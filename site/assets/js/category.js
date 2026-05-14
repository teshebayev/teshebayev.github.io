import {
  loadManifest,
  renderProfileSidebar,
  initTheme,
  findCategory,
  articlesInCategory,
  applyCategoryAccent,
  summarizeTags,
  groupByYear,
  hasReadingOrder,
  applyReadingOrder,
  shortDate,
  pluralizeArticles,
  param,
} from "./shared.js";

initTheme();

const id = param("id");
if (!id) window.location.replace("blog.html");

// UI state — kept on the URL so back/forward and shareable links work.
const state = {
  search: param("q") || "",
  tag: param("tag") || null,
  view: param("view") || null, // "curriculum" | "chronological" | null (auto)
};

(async () => {
  const manifest = await loadManifest();
  const category = findCategory(manifest, id);
  if (!category) {
    document.body.innerHTML = `<div class="notfound"><div><h1>404</h1><p>Категория не найдена. <a href="blog.html">Все категории</a></p></div></div>`;
    return;
  }

  applyCategoryAccent(document.documentElement, category);
  document.title = `${category.title} — ${manifest.site.author}`;
  renderProfileSidebar(document.getElementById("sidebar-slot"), manifest.site, "blog");

  const all = articlesInCategory(manifest, category.id);
  const curriculum = hasReadingOrder(category);

  // Default view: curriculum if available, else chronological.
  if (!state.view) state.view = curriculum ? "curriculum" : "chronological";

  renderHeader(category, all);
  renderViewToggle(category, curriculum);
  renderTagFilter(manifest, all);
  renderList(manifest, category, all);
  wireControls(manifest, category, all);
})();

// =========================================================================
function renderHeader(category, all) {
  document.getElementById("cat-title").textContent = category.title;
  document.getElementById("cat-desc").textContent = category.description;
  document.getElementById("cat-count").textContent =
    `${all.length} ${pluralizeArticles(all.length)}`;
  document.getElementById("search-input").value = state.search;
}

function renderViewToggle(category, curriculum) {
  const wrap = document.getElementById("view-toggle");
  if (!curriculum) { wrap.style.display = "none"; return; }
  wrap.innerHTML = `
    <button class="view-btn ${state.view === "curriculum" ? "is-active" : ""}" data-view="curriculum">
      Учебный порядок
    </button>
    <button class="view-btn ${state.view === "chronological" ? "is-active" : ""}" data-view="chronological">
      По дате
    </button>
  `;
}

function renderTagFilter(manifest, all) {
  // Tag filter is only meaningful in chronological view — it would conflict
  // with curated groups otherwise. Hide it in curriculum mode.
  const wrap = document.getElementById("tag-filter-wrap");
  if (state.view === "curriculum") { wrap.style.display = "none"; return; }
  wrap.style.display = "";

  const tags = summarizeTags(manifest, all);
  const root = document.getElementById("tag-filter");
  const chips = [
    chipHTML({ id: null, label: "Все", count: all.length }, state.tag === null),
    ...tags.map((t) => chipHTML(t, state.tag === t.id)),
  ];
  root.innerHTML = chips.join("");
}

function chipHTML(tag, active) {
  const v = tag.id === null ? "" : tag.id;
  return `<button class="chip ${active ? "is-active" : ""}" data-tag="${v}">
    ${tag.label} <span class="chip__count">${tag.count}</span>
  </button>`;
}

function applyFilter(articles) {
  let list = articles.slice();
  if (state.tag) list = list.filter((a) => (a.tags || []).includes(state.tag));
  if (state.search) {
    const q = state.search.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }
  return list;
}

function renderList(manifest, category, all) {
  const root = document.getElementById("article-groups");

  if (state.view === "curriculum") {
    renderCurriculum(manifest, category, all, root);
  } else {
    renderChronological(manifest, all, root);
  }
}

function renderCurriculum(manifest, category, all, root) {
  const groups = applyReadingOrder(manifest, category);
  // Filter by search only — tag filter is hidden in curriculum mode.
  const q = state.search.toLowerCase().trim();
  const filtered = q
    ? groups
        .map((g) => ({
          ...g,
          articles: g.articles.filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              (a.description || "").toLowerCase().includes(q)
          ),
        }))
        .filter((g) => g.articles.length > 0)
    : groups;

  if (filtered.length === 0) {
    root.innerHTML = emptyHTML();
    wireEmpty(manifest, category, all);
    return;
  }

  root.innerHTML = filtered
    .map(
      (g, gIdx) => `
    <section class="curriculum-group">
      <h3 class="curriculum-group__label">
        <span class="curriculum-group__num">${String(gIdx + 1).padStart(2, "0")}</span>
        ${g.group.label}
        <span class="curriculum-group__count">${g.group.count} ${pluralizeArticles(g.group.count)}</span>
      </h3>
      <ol class="article-list-ordered">
        ${g.articles.map((a, i) => orderedRowHTML(a, i + 1)).join("")}
      </ol>
    </section>
  `
    )
    .join("");
}

function renderChronological(manifest, all, root) {
  const filtered = applyFilter(all);
  if (filtered.length === 0) {
    root.innerHTML = emptyHTML();
    wireEmpty(manifest, null, all);
    return;
  }
  const groups = groupByYear(filtered);
  root.innerHTML = groups
    .map(
      ({ year, articles }) => `
    <section class="year-group">
      <h3 class="year-group__label">${year}</h3>
      <ul class="article-list-flat">
        ${articles.map(rowHTML).join("")}
      </ul>
    </section>
  `
    )
    .join("");
}

function emptyHTML() {
  return `<div class="empty">Ничего не найдено. <button class="link-btn" id="reset-filters">Сбросить фильтры</button></div>`;
}
function wireEmpty(manifest, category, all) {
  document.getElementById("reset-filters")?.addEventListener("click", () => {
    state.search = "";
    state.tag = null;
    document.getElementById("search-input").value = "";
    syncUrl();
    renderTagFilter(manifest, all);
    renderList(manifest, category, all);
  });
}

function rowHTML(article) {
  const primaryTag = (article.tags || [])[0];
  return `
    <li>
      <a class="article-row article-row--3col" href="article.html?slug=${article.slug}">
        <span class="article-row__date">${shortDate(article.date)}</span>
        <span class="article-row__main">
          <span class="article-row__title">${article.title}</span>
          <span class="article-row__desc">${article.description || ""}</span>
        </span>
        <span class="article-row__tag">${primaryTag || ""}</span>
      </a>
    </li>
  `;
}

function orderedRowHTML(article, n) {
  return `
    <li>
      <a class="article-row article-row--ordered" href="article.html?slug=${article.slug}">
        <span class="article-row__num">${String(n).padStart(2, "0")}</span>
        <span class="article-row__main">
          <span class="article-row__title">${article.title}</span>
          <span class="article-row__desc">${article.description || ""}</span>
        </span>
        <span class="article-row__time">${article.reading_time} мин</span>
      </a>
    </li>
  `;
}

function wireControls(manifest, category, all) {
  // Search
  const input = document.getElementById("search-input");
  let timer;
  input.addEventListener("input", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.search = e.target.value;
      syncUrl();
      renderList(manifest, category, all);
    }, 120);
  });

  // Tag chips
  document.getElementById("tag-filter").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const next = btn.dataset.tag || null;
    state.tag = next === state.tag ? null : next;
    syncUrl();
    renderTagFilter(manifest, all);
    renderList(manifest, category, all);
  });

  // View toggle
  document.getElementById("view-toggle").addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;
    state.view = btn.dataset.view;
    // Reset tag filter when switching to curriculum (it's hidden there).
    if (state.view === "curriculum") state.tag = null;
    syncUrl();
    renderViewToggle(category, true);
    renderTagFilter(manifest, all);
    renderList(manifest, category, all);
  });

  // Back/forward
  window.addEventListener("popstate", () => {
    state.search = param("q") || "";
    state.tag = param("tag") || null;
    state.view = param("view") || (hasReadingOrder(category) ? "curriculum" : "chronological");
    document.getElementById("search-input").value = state.search;
    renderViewToggle(category, hasReadingOrder(category));
    renderTagFilter(manifest, all);
    renderList(manifest, category, all);
  });
}

function syncUrl() {
  const u = new URL(window.location.href);
  u.searchParams.set("id", id);
  if (state.search) u.searchParams.set("q", state.search); else u.searchParams.delete("q");
  if (state.tag)    u.searchParams.set("tag", state.tag);  else u.searchParams.delete("tag");
  if (state.view)   u.searchParams.set("view", state.view); else u.searchParams.delete("view");
  window.history.replaceState({}, "", u.toString());
}
