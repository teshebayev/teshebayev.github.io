import {
  loadManifest,
  renderProfileSidebar,
  initTheme,
  findCategory,
  articlesInCategory,
  applyCategoryAccent,
  summarizeTags,
  groupByYear,
  shortDate,
  pluralizeArticles,
  param,
} from "./shared.js";

initTheme();

const id = param("id");
if (!id) window.location.replace("blog.html");

// UI state, kept on the URL so back/forward and shareable links work.
const state = {
  search: param("q") || "",
  tag: param("tag") || null,
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

  renderHeader(category, all);
  renderTagFilter(manifest, all);
  renderList(manifest, all);
  wireControls(manifest, all);
})();

// =========================================================================
function renderHeader(category, all) {
  document.getElementById("cat-title").textContent = category.title;
  document.getElementById("cat-desc").textContent = category.description;
  document.getElementById("cat-count").textContent =
    `${all.length} ${pluralizeArticles(all.length)}`;

  // Pre-fill search input from URL
  const input = document.getElementById("search-input");
  input.value = state.search;
}

function renderTagFilter(manifest, all) {
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

function renderList(manifest, all) {
  const filtered = applyFilter(all);
  const root = document.getElementById("article-groups");

  if (filtered.length === 0) {
    root.innerHTML = `<div class="empty">Ничего не найдено. <button class="link-btn" id="reset-filters">Сбросить фильтры</button></div>`;
    document.getElementById("reset-filters")?.addEventListener("click", () => {
      state.search = "";
      state.tag = null;
      document.getElementById("search-input").value = "";
      syncUrl();
      renderTagFilter(manifest, all);
      renderList(manifest, all);
    });
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

function wireControls(manifest, all) {
  // Search
  const input = document.getElementById("search-input");
  let timer;
  input.addEventListener("input", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.search = e.target.value;
      syncUrl();
      renderList(manifest, all);
    }, 120);
  });

  // Tag chips (event delegation so we re-render freely)
  document.getElementById("tag-filter").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const next = btn.dataset.tag || null;
    state.tag = next === state.tag ? null : next; // click active chip = deselect
    syncUrl();
    renderTagFilter(manifest, all);
    renderList(manifest, all);
  });

  // Browser back/forward
  window.addEventListener("popstate", () => {
    state.search = param("q") || "";
    state.tag = param("tag") || null;
    document.getElementById("search-input").value = state.search;
    renderTagFilter(manifest, all);
    renderList(manifest, all);
  });
}

function syncUrl() {
  const u = new URL(window.location.href);
  u.searchParams.set("id", id);
  if (state.search) u.searchParams.set("q", state.search);
  else u.searchParams.delete("q");
  if (state.tag) u.searchParams.set("tag", state.tag);
  else u.searchParams.delete("tag");
  window.history.replaceState({}, "", u.toString());
}
