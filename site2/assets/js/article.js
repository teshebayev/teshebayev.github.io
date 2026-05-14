import {
  loadManifest,
  initTheme,
  findArticle,
  findCategory,
  articlesInCategory,
  publishedArticles,
  applyCategoryAccent,
  groupByPrimaryTag,
  pluralizeArticles,
  param,
  formatDate,
} from "./shared.js";

initTheme();

const slug = param("slug");
if (!slug) {
  window.location.replace("blog.html");
}

(async () => {
  const manifest = await loadManifest();
  const article = findArticle(manifest, slug);

  if (!article) {
    document.body.innerHTML = `<div class="notfound"><div><h1>404</h1><p>Статья не найдена. <a href="blog.html">Вернуться в блог</a></p></div></div>`;
    return;
  }

  const category = findCategory(manifest, article.category);
  applyCategoryAccent(document.documentElement, category);

  document.title = `${article.title} — ${manifest.site.author}`;

  // 1. Left sidebar: other articles in this category
  renderLeftSidebar(manifest, category, article);

  // 2. Article header
  renderArticleHeader(article, category);

  // 3. Fetch markdown, render into body
  const md = await fetch(article.content).then((r) => r.text());
  const html = renderMarkdown(md);
  const body = document.getElementById("article-body");
  body.innerHTML = html;

  // 3b. Activate any <script> tags from rendered HTML (interactive SVG, demos).
  //     innerHTML never executes scripts — we have to re-create them.
  activateScripts(body);

  // 3c. Process any <demo src="..."> placeholders into sandboxed <iframe>.
  activateDemos(body);

  // 4. Add anchor IDs to headings, render TOC
  decorateHeadings(body);
  renderToc(body);
  setupScrollSpy(body);

  // 5. Render syntax highlighting if Prism is loaded
  if (window.Prism) window.Prism.highlightAllUnder(body);

  // 6. Render math with KaTeX if loaded
  if (window.renderMathInElement) {
    window.renderMathInElement(body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  }

  // 7. Prev / next navigation
  renderPrevNext(manifest, article);
})();

// =========================================================================
// Renderers
// =========================================================================
function renderLeftSidebar(manifest, category, current) {
  const siblings = articlesInCategory(manifest, category.id);
  const target = document.getElementById("sidebar-slot");

  // Decide layout based on category size.
  // Small: flat chronological list (current is highlighted).
  // Large: search + groups by primary tag, only current's group expanded by default.
  const FLAT_THRESHOLD = 10;
  const flat = siblings.length <= FLAT_THRESHOLD;

  if (flat) {
    target.innerHTML = `
      <aside class="sidebar sidebar--articles">
        <a class="back-link" href="category.html?id=${category.id}">← ${category.title}</a>
        <p class="sidebar__cat-sub">${siblings.length} ${pluralizeArticles(siblings.length)}</p>
        <nav class="article-list">
          ${siblings.map((a) => `
            <a href="article.html?slug=${a.slug}" class="${a.slug === current.slug ? "is-current" : ""}">
              ${a.title}
            </a>
          `).join("")}
        </nav>
      </aside>
    `;
    return;
  }

  // Grouped layout
  const groups = groupByPrimaryTag(manifest, siblings);
  const currentPrimaryTag = (current.tags || [])[0] || "_other";

  target.innerHTML = `
    <aside class="sidebar sidebar--articles">
      <a class="back-link" href="category.html?id=${category.id}">← ${category.title}</a>
      <p class="sidebar__cat-sub">${siblings.length} ${pluralizeArticles(siblings.length)}</p>

      <div class="sidebar__search">
        <input type="text" id="sidebar-filter" placeholder="Фильтр…" autocomplete="off" />
      </div>

      <nav class="article-groups" id="article-groups-nav">
        ${groups.map((g) => groupHTML(g, current, g.tag.id === currentPrimaryTag)).join("")}
      </nav>
    </aside>
  `;

  // Wire collapse + filter
  const nav = document.getElementById("article-groups-nav");
  nav.addEventListener("click", (e) => {
    const header = e.target.closest(".article-group__header");
    if (!header) return;
    header.parentElement.classList.toggle("is-collapsed");
  });

  const input = document.getElementById("sidebar-filter");
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    let anyVisible = false;
    nav.querySelectorAll(".article-group").forEach((group) => {
      let groupHasMatch = false;
      group.querySelectorAll(".article-group__item").forEach((a) => {
        const match = !q || a.dataset.title.includes(q);
        a.style.display = match ? "" : "none";
        if (match) groupHasMatch = true;
      });
      group.style.display = groupHasMatch ? "" : "none";
      // When filtering, expand all matching groups
      if (q && groupHasMatch) group.classList.remove("is-collapsed");
      anyVisible = anyVisible || groupHasMatch;
    });
  });
}

function groupHTML(group, current, expanded) {
  return `
    <div class="article-group ${expanded ? "" : "is-collapsed"}">
      <button class="article-group__header" type="button">
        <span class="article-group__name">${group.tag.label}</span>
        <span class="article-group__meta">
          <span class="article-group__count">${group.tag.count}</span>
          <svg class="article-group__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </button>
      <div class="article-group__body">
        ${group.articles.map((a) => `
          <a class="article-group__item ${a.slug === current.slug ? "is-current" : ""}"
             href="article.html?slug=${a.slug}"
             data-title="${a.title.toLowerCase()}">
            ${a.title}
          </a>
        `).join("")}
      </div>
    </div>
  `;
}

function renderArticleHeader(article, category) {
  document.getElementById("article-cat").textContent = category.title;
  document.getElementById("article-title").textContent = article.title;
  const meta = document.getElementById("article-meta");
  const parts = [
    `<span>${formatDate(article.date)}</span>`,
    `<span>${article.reading_time} min read</span>`,
  ];
  if (article.updated) parts.push(`<span>updated ${formatDate(article.updated)}</span>`);
  meta.innerHTML = parts.join("");
}

function renderMarkdown(src) {
  if (window.marked) {
    window.marked.setOptions({ gfm: true, breaks: false });
    return window.marked.parse(src);
  }
  // Tiny fallback if CDN failed
  return `<pre>${escapeHtml(src)}</pre>`;
}

function decorateHeadings(root) {
  const used = new Set();
  root.querySelectorAll("h2, h3").forEach((h) => {
    const text = h.textContent.trim();
    let id = slugify(text);
    let n = 1;
    while (used.has(id)) id = `${slugify(text)}-${++n}`;
    used.add(id);
    h.id = id;
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.className = "anchor";
    a.textContent = "#";
    a.setAttribute("aria-label", "Link to section");
    h.prepend(a);
  });
}

function renderToc(body) {
  const toc = document.getElementById("toc-list");
  const headings = body.querySelectorAll("h2, h3");
  if (headings.length === 0) {
    document.getElementById("toc").style.display = "none";
    return;
  }
  toc.innerHTML = Array.from(headings)
    .map((h) => {
      const cls = h.tagName === "H3" ? "toc-h3" : "toc-h2";
      const text = h.textContent.replace(/^#\s*/, "").trim();
      return `<li class="${cls}"><a href="#${h.id}" data-target="${h.id}">${text}</a></li>`;
    })
    .join("");
}

function setupScrollSpy(body) {
  const links = document.querySelectorAll(".toc__list a");
  const map = new Map();
  links.forEach((l) => map.set(l.dataset.target, l));
  const heads = body.querySelectorAll("h2, h3");
  if (heads.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          map.get(entry.target.id)?.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );
  heads.forEach((h) => observer.observe(h));
}

function renderPrevNext(manifest, current) {
  const all = publishedArticles(manifest).filter((a) => a.category === current.category);
  const idx = all.findIndex((a) => a.slug === current.slug);
  const prev = all[idx + 1]; // older
  const next = all[idx - 1]; // newer

  const nav = document.getElementById("article-nav");
  nav.innerHTML = `
    ${prev ? `
      <a href="article.html?slug=${prev.slug}" class="article-nav__prev">
        <div class="article-nav__label">← Предыдущая</div>
        <div class="article-nav__title">${prev.title}</div>
      </a>` : "<span></span>"}
    ${next ? `
      <a href="article.html?slug=${next.slug}" class="article-nav__next">
        <div class="article-nav__label">Следующая →</div>
        <div class="article-nav__title">${next.title}</div>
      </a>` : "<span></span>"}
  `;
}

// =========================================================================
// Helpers
// =========================================================================
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/giu, "")
    .trim()
    .replace(/\s+/g, "-");
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// =========================================================================
// Interactive content support
// =========================================================================

/**
 * Re-create <script> tags inserted via innerHTML so the browser runs them.
 * This is what enables interactive inline SVG with JS handlers.
 * Runs both inline scripts and external `src=` scripts in document order.
 */
function activateScripts(root) {
  const scripts = root.querySelectorAll("script");
  scripts.forEach((old) => {
    const s = document.createElement("script");
    // Copy attributes (type, src, async, defer, etc.)
    for (const { name, value } of old.attributes) s.setAttribute(name, value);
    s.text = old.textContent;
    old.replaceWith(s);
  });
}

/**
 * <demo src="path/to/widget.html" height="420"></demo>
 * Becomes a sandboxed <iframe> — isolates the widget's CSS/JS from the page.
 * Use this for complex visualisations (D3, Three.js, Plotly, etc.).
 */
function activateDemos(root) {
  root.querySelectorAll("demo").forEach((el) => {
    const src = el.getAttribute("src");
    if (!src) return;
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.loading = "lazy";
    iframe.className = "demo-frame";
    iframe.style.width = "100%";
    iframe.style.height = (el.getAttribute("height") || "400") + "px";
    iframe.style.border = "1px solid var(--border)";
    iframe.style.borderRadius = "var(--radius-sm)";
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    iframe.setAttribute("title", el.getAttribute("title") || "Interactive demo");
    el.replaceWith(iframe);
  });
}
