import {
  loadManifest,
  initTheme,
  findArticle,
  findCategory,
  articlesInCategory,
  publishedArticles,
  applyCategoryAccent,
  groupByPrimaryTag,
  hasReadingOrder,
  applyReadingOrder,
  readingOrderSequence,
  pluralizeArticles,
  param,
  formatDate,
  currentLang,
  setLang,
  ui,
  t,
  articleLanguages,
  articleHasLang,
  resolveContent,
} from "./shared.js";

initTheme();

const slug = param("slug");
if (!slug) window.location.replace("blog.html");

(async () => {
  const manifest = await loadManifest();
  const lang = currentLang(manifest);
  document.documentElement.setAttribute("lang", lang);

  const article = findArticle(manifest, slug);
  if (!article) {
    document.body.innerHTML = `
      <div class="notfound"><div>
        <h1>404</h1>
        <p>${ui(manifest, "article_not_found", lang)} <a href="blog.html">${ui(manifest, "back_to_blog", lang)}</a></p>
      </div></div>`;
    return;
  }

  const category = findCategory(manifest, article.category);
  applyCategoryAccent(document.documentElement, category);

  document.title = `${t(article.title, lang)} — ${manifest.site.author}`;

  // Resolve content with fallback. If the article has no translation in the
  // current language, we still render it (using whatever language we have)
  // and show a banner offering to switch.
  const resolved = resolveContent(article, lang);
  if (!resolved) {
    document.body.innerHTML = `<div class="notfound"><div><h1>404</h1><p>${ui(manifest, "article_not_found", lang)}</p></div></div>`;
    return;
  }

  // 1. Sidebar
  renderLeftSidebar(manifest, category, article, lang);

  // 2. Header
  renderArticleHeader(article, category, lang, manifest);

  // 3. Fallback banner if displaying a different language than user asked for
  if (resolved.isFallback) renderFallbackBanner(manifest, lang, resolved.lang);

  // 4. Language switch in article header if multiple translations exist
  renderArticleLangSwitch(manifest, article, lang);

  // 5. Fetch markdown
  const md = await fetch(resolved.path).then((r) => r.text());
  const html = renderMarkdown(md);
  const body = document.getElementById("article-body");
  body.innerHTML = html;

  // 5a. Restore script bodies that were stashed before innerHTML parsing.
  //     Inside <svg>, the HTML parser would otherwise eat any markup-like
  //     fragments (e.g. inside JS template literals) as real SVG nodes.
  restoreSvgScripts(body);

  // 5b. Scope each inline SVG's <style> so their CSS rules don't leak globally
  //     and don't collide with each other (every SVG defines its own .title,
  //     .btn, .center etc — we need them isolated).
  scopeSvgStyles(body);

  // 6. Activate scripts inserted via innerHTML
  activateScripts(body);
  activateDemos(body);

  // 7. Headings → anchors, TOC, scrollspy
  decorateHeadings(body);
  renderToc(body, manifest, lang);
  setupScrollSpy(body);

  // 8. Syntax + math
  if (window.Prism) window.Prism.highlightAllUnder(body);
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

  // 9. Prev/next
  renderPrevNext(manifest, article, lang);
})();

// =========================================================================
function renderLeftSidebar(manifest, category, current, lang) {
  const siblings = articlesInCategory(manifest, category.id, lang);
  const target = document.getElementById("sidebar-slot");
  const curriculum = hasReadingOrder(category);
  const FLAT_THRESHOLD = 10;
  const flat = !curriculum && siblings.length <= FLAT_THRESHOLD;

  if (flat) {
    target.innerHTML = `
      <aside class="sidebar sidebar--articles">
        <a class="back-link" href="category.html?id=${category.id}">← ${t(category.title, lang)}</a>
        <p class="sidebar__cat-sub">${siblings.length} ${pluralizeArticles(siblings.length, lang)}</p>
        <nav class="article-list">
          ${siblings.map((a) => `
            <a href="article.html?slug=${a.slug}" class="${a.slug === current.slug ? "is-current" : ""}">
              ${t(a.title, lang)}
            </a>
          `).join("")}
        </nav>
      </aside>
    `;
    return;
  }

  const groups = curriculum
    ? applyReadingOrder(manifest, category, lang)
    : groupByPrimaryTag(manifest, siblings, lang);

  const currentGroupId = (() => {
    for (const g of groups) {
      if (g.articles.some((a) => a.slug === current.slug)) return g.group.id;
    }
    return null;
  })();

  target.innerHTML = `
    <aside class="sidebar sidebar--articles">
      <a class="back-link" href="category.html?id=${category.id}">← ${t(category.title, lang)}</a>
      <p class="sidebar__cat-sub">
        ${siblings.length} ${pluralizeArticles(siblings.length, lang)}
        ${curriculum ? `· <span class="sidebar__mode">${ui(manifest, "reading_order_mode", lang)}</span>` : ""}
      </p>

      <div class="sidebar__search">
        <input type="text" id="sidebar-filter" placeholder="${ui(manifest, "sidebar_filter_placeholder", lang)}" autocomplete="off" />
      </div>

      <nav class="article-groups" id="article-groups-nav">
        ${groups.map((g, i) => groupHTML(g, current, g.group.id === currentGroupId, curriculum ? i + 1 : null, lang)).join("")}
      </nav>
    </aside>
  `;

  const nav = document.getElementById("article-groups-nav");
  nav.addEventListener("click", (e) => {
    const header = e.target.closest(".article-group__header");
    if (!header) return;
    header.parentElement.classList.toggle("is-collapsed");
  });

  const input = document.getElementById("sidebar-filter");
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    nav.querySelectorAll(".article-group").forEach((group) => {
      let groupHasMatch = false;
      group.querySelectorAll(".article-group__item").forEach((a) => {
        const match = !q || a.dataset.title.includes(q);
        a.style.display = match ? "" : "none";
        if (match) groupHasMatch = true;
      });
      group.style.display = groupHasMatch ? "" : "none";
      if (q && groupHasMatch) group.classList.remove("is-collapsed");
    });
  });
}

function groupHTML(group, current, expanded, orderNum, lang) {
  return `
    <div class="article-group ${expanded ? "" : "is-collapsed"}">
      <button class="article-group__header" type="button">
        <span class="article-group__name">
          ${orderNum !== null ? `<span class="article-group__num">${String(orderNum).padStart(2, "0")}</span>` : ""}
          ${group.group.label}
        </span>
        <span class="article-group__meta">
          <span class="article-group__count">${group.group.count}</span>
          <svg class="article-group__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </button>
      <div class="article-group__body">
        ${group.articles.map((a) => `
          <a class="article-group__item ${a.slug === current.slug ? "is-current" : ""}"
             href="article.html?slug=${a.slug}"
             data-title="${t(a.title, lang).toLowerCase()}">
            ${t(a.title, lang)}
          </a>
        `).join("")}
      </div>
    </div>
  `;
}

function renderArticleHeader(article, category, lang, manifest) {
  document.getElementById("article-cat").textContent = t(category.title, lang);
  document.getElementById("article-title").textContent = t(article.title, lang);
  const meta = document.getElementById("article-meta");
  const parts = [
    `<span>${formatDate(article.date)}</span>`,
    `<span>${article.reading_time} ${ui(manifest, "min_read_full", lang)}</span>`,
  ];
  if (article.updated) parts.push(`<span>${ui(manifest, "updated", lang)} ${formatDate(article.updated)}</span>`);
  meta.innerHTML = parts.join("");
}

function renderFallbackBanner(manifest, requestedLang, actualLang) {
  const banner = document.getElementById("article-banner");
  const actualName = ui(manifest, "_lang_name", actualLang);
  banner.style.display = "";
  banner.innerHTML = `
    <span>${ui(manifest, "article_not_translated", requestedLang)} ${actualName}.</span>
    <button class="link-btn" id="switch-lang">${ui(manifest, "view_in_lang", requestedLang)} ${actualName}</button>
  `;
  document.getElementById("switch-lang").addEventListener("click", () => {
    setLang(actualLang);
    window.location.reload();
  });
}

function renderArticleLangSwitch(manifest, article, lang) {
  const wrap = document.getElementById("article-langs");
  const langs = articleLanguages(article);
  if (langs.length < 2) { wrap.style.display = "none"; return; }
  wrap.innerHTML = langs.map((l) => {
    const short = ui(manifest, "_lang_short", l);
    const active = l === lang ? "is-active" : "";
    return `<button class="lang-btn ${active}" data-lang="${l}">${short}</button>`;
  }).join("");
  wrap.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
      window.location.reload();
    });
  });
}

function renderMarkdown(src) {
  if (!window.marked) return `<pre>${escapeHtml(src)}</pre>`;
  window.marked.setOptions({ gfm: true, breaks: false });

  // Marked's GFM rules will close an HTML block whenever it sees a blank line,
  // re-parsing the inside as markdown.  That destroys big SVGs (long <text>
  // lines look like markdown, <marker> blocks leak into code fences, etc).
  // So we lift any <svg>…</svg> and <figure>…</figure> out before parsing,
  // replace them with single-line placeholders, then splice them back after.
  const slots = [];
  const PLACEHOLDER = (i) => `\n\nMARKED_RAW_HTML_${i}_PLACEHOLDER\n\n`;

  // Stash <script> bodies inside lifted SVG blocks into a separate side table.
  // Why: when the host page later does `body.innerHTML = html`, the HTML5
  // parser switches to "in foreign content" mode inside <svg>.  In that mode
  // <script> is NOT a raw-text element — so any markup-looking text inside a
  // JS template literal (e.g. `<rect/>`, `<text>…</text>`) is parsed as real
  // SVG nodes and disappears from the script source.  We replace each body
  // with a comment placeholder (no `<` anywhere) and restore it after the
  // innerHTML assignment via restoreSvgScripts().
  _svgScriptBodies = [];
  const stashScripts = (block) =>
    block.replace(
      /(<script\b[^>]*>)([\s\S]*?)(<\/script\s*>)/gi,
      (_, open, body, close) => {
        const idx = _svgScriptBodies.length;
        _svgScriptBodies.push(body);
        return `${open}/*SVG_SCRIPT_PLACEHOLDER_${idx}*/${close}`;
      }
    );

  // Order matters: <figure> first, since it may wrap <svg>. Both regexps are
  // multiline / dot-matches-newline so they swallow the whole block.
  const lift = (text, tag) => {
    const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, "gi");
    return text.replace(re, (match) => {
      match = stashScripts(match);
      const i = slots.length;
      slots.push(match);
      return PLACEHOLDER(i);
    });
  };

  let stripped = src;
  stripped = lift(stripped, "figure");
  stripped = lift(stripped, "svg");

  let html = window.marked.parse(stripped);

  // Restore. Placeholders may end up wrapped in <p>…</p> by marked — strip.
  html = html.replace(/<p>\s*MARKED_RAW_HTML_(\d+)_PLACEHOLDER\s*<\/p>/g, (_, i) => slots[Number(i)]);
  html = html.replace(/MARKED_RAW_HTML_(\d+)_PLACEHOLDER/g, (_, i) => slots[Number(i)]);
  return html;
}

// Counterpart to the stash above.  Walk every <script> inside the rendered
// body and, if its textContent is just one of our placeholders, swap the
// original code back in.  Must run AFTER body.innerHTML = …, BEFORE
// activateScripts, so the scripts execute with their real source.
let _svgScriptBodies = [];
function restoreSvgScripts(root) {
  root.querySelectorAll("script").forEach((script) => {
    const m = (script.textContent || "").match(/^\s*\/\*SVG_SCRIPT_PLACEHOLDER_(\d+)\*\/\s*$/);
    if (m) script.textContent = _svgScriptBodies[Number(m[1])];
  });
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
    h.prepend(a);
  });
}

function renderToc(body, manifest, lang) {
  const toc = document.getElementById("toc");
  const list = document.getElementById("toc-list");
  const label = document.getElementById("toc-label");
  const headings = body.querySelectorAll("h2, h3");
  if (headings.length === 0) { toc.style.display = "none"; return; }
  label.textContent = ui(manifest, "in_this_article", lang);
  list.innerHTML = Array.from(headings).map((h) => {
    const cls = h.tagName === "H3" ? "toc-h3" : "toc-h2";
    const text = h.textContent.replace(/^#\s*/, "").trim();
    return `<li class="${cls}"><a href="#${h.id}" data-target="${h.id}">${text}</a></li>`;
  }).join("");
}

function setupScrollSpy(body) {
  const links = document.querySelectorAll(".toc__list a");
  const map = new Map();
  links.forEach((l) => map.set(l.dataset.target, l));
  const heads = body.querySelectorAll("h2, h3");
  if (heads.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.remove("is-active"));
        map.get(entry.target.id)?.classList.add("is-active");
      }
    });
  }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
  heads.forEach((h) => observer.observe(h));
}

function renderPrevNext(manifest, current, lang) {
  const category = findCategory(manifest, current.category);
  let sequence, mode;
  if (hasReadingOrder(category)) {
    sequence = readingOrderSequence(manifest, category, lang);
    mode = "curriculum";
  } else {
    sequence = publishedArticles(manifest, lang).filter((a) => a.category === current.category);
    mode = "chronological";
  }

  const idx = sequence.findIndex((a) => a.slug === current.slug);
  let prev, next;
  if (mode === "curriculum") {
    prev = sequence[idx - 1];
    next = sequence[idx + 1];
  } else {
    prev = sequence[idx + 1];
    next = sequence[idx - 1];
  }

  const prevLabel = ui(manifest, mode === "curriculum" ? "prev_curriculum" : "prev_chronological", lang);
  const nextLabel = ui(manifest, mode === "curriculum" ? "next_curriculum" : "next_chronological", lang);

  const nav = document.getElementById("article-nav");
  nav.innerHTML = `
    ${prev ? `
      <a href="article.html?slug=${prev.slug}" class="article-nav__prev">
        <div class="article-nav__label">${prevLabel}</div>
        <div class="article-nav__title">${t(prev.title, lang)}</div>
      </a>` : "<span></span>"}
    ${next ? `
      <a href="article.html?slug=${next.slug}" class="article-nav__next">
        <div class="article-nav__label">${nextLabel}</div>
        <div class="article-nav__title">${t(next.title, lang)}</div>
      </a>` : "<span></span>"}
  `;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9а-яё\s-]/giu, "").trim().replace(/\s+/g, "-");
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function activateScripts(root) {
  root.querySelectorAll("script").forEach((old) => {
    const s = document.createElement("script");
    for (const { name, value } of old.attributes) s.setAttribute(name, value);

    // External script — keep as is; the browser will fetch and run it.
    if (old.src) {
      old.replaceWith(s);
      return;
    }

    // 1) Strip SVG/XML CDATA wrapping if present.
    //    Authors who copy code from SVG editors often paste:
    //      <script><![CDATA[ ... ]]></script>
    //    That's valid XML but invalid JavaScript when the host doc is HTML.
    let code = old.textContent || "";
    code = code
      .replace(/^\s*\/\/\s*<!\[CDATA\[\s*/, "")  // // <![CDATA[
      .replace(/\/\/\s*\]\]>\s*$/, "")            // // ]]>
      .replace(/^\s*<!\[CDATA\[\s*/, "")          // raw <![CDATA[
      .replace(/\s*\]\]>\s*$/, "");               // raw ]]>

    // 2) If this script lives inside an <svg>, expose `svgRoot` as a local so
    //    authors can use svgRoot.getElementById(...) instead of relying on
    //    document.currentScript (which is unreliable after innerHTML insertion).
    const svgParent = old.closest("svg");
    if (svgParent) {
      // Reuse the scope id set by scopeSvgStyles (or assign one if it wasn't).
      let scopeId = svgParent.getAttribute("data-svg-scope");
      if (!scopeId) {
        scopeId = "svg_" + Math.random().toString(36).slice(2, 10);
        svgParent.setAttribute("data-svg-scope", scopeId);
      }
      code = `(function(){
  const svgRoot = document.querySelector('svg[data-svg-scope="${scopeId}"]');
  if (!svgRoot) return;
  ${code}
})();`;
    }

    s.text = code;
    old.replaceWith(s);
  });
}

/**
 * Scope every inline SVG's <style> block so its rules apply only inside that
 * SVG. Without this, rules like `svg { background: white }` or `.title {...}`
 * leak globally and trample each other across multiple SVGs on the same page.
 *
 * We rewrite each selector in the rule list to be prefixed with
 *   svg[data-svg-scope="<id>"]
 *
 * Special case: a selector that starts with `svg` (with or without
 * combinators) gets rewritten to address THIS svg specifically — otherwise
 * `svg { background: #fff }` would still apply to every <svg> in the page.
 */
let _svgScopeCounter = 0;
function scopeSvgStyles(root) {
  root.querySelectorAll("svg").forEach((svg) => {
    const styles = svg.querySelectorAll(":scope > style, :scope > defs > style");
    if (styles.length === 0) return;

    const scopeId = "svg_" + (++_svgScopeCounter).toString(36) + "_" + Math.random().toString(36).slice(2, 8);
    svg.setAttribute("data-svg-scope", scopeId);
    const scope = `svg[data-svg-scope="${scopeId}"]`;

    styles.forEach((styleEl) => {
      styleEl.textContent = rewriteCss(styleEl.textContent || "", scope);
    });
  });
}

/**
 * Prefix every selector in `css` so it only applies inside `scope`.
 * Naive but works for the limited CSS you find inside inline SVG <style> tags
 * (no @media, no @keyframes, no nested rules).
 */
function rewriteCss(css, scope) {
  // Strip comments first to simplify parsing.
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");

  // Walk through "selector-list { block }" pairs.
  return css.replace(/([^{}]+)\{([^}]*)\}/g, (_, selectors, body) => {
    const rewritten = selectors
      .split(",")
      .map((sel) => sel.trim())
      .filter(Boolean)
      .map((sel) => {
        // A selector starting with `svg` (the element) should address THIS
        // svg specifically — replace "svg" with our scoped selector.
        if (/^svg(\s|$|\.|\[|:|>|~|\+|,)/.test(sel)) {
          return scope + sel.slice(3);
        }
        return `${scope} ${sel}`;
      })
      .join(", ");
    return `${rewritten} { ${body.trim()} }`;
  });
}

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
    el.replaceWith(iframe);
  });
}