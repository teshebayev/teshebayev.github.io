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
  currentLang,
  ui,
  t,
  tagLabel,
} from "./shared.js";

initTheme();

const id = param("id");
if (!id) window.location.replace("blog.html");

const state = {
  search: param("q") || "",
  tag: param("tag") || null,
  view: param("view") || null,
};

(async () => {
  const manifest = await loadManifest();
  const lang = currentLang(manifest);
  document.documentElement.setAttribute("lang", lang);

  const category = findCategory(manifest, id);
  if (!category) {
    document.body.innerHTML = `
      <div class="notfound"><div>
        <h1>404</h1>
        <p>${ui(manifest, "category_not_found", lang)} <a href="blog.html">${ui(manifest, "back_to_categories", lang)}</a></p>
      </div></div>`;
    return;
  }

  applyCategoryAccent(document.documentElement, category);
  document.title = `${t(category.title, lang)} — ${manifest.site.author}`;
  renderProfileSidebar(document.getElementById("sidebar-slot"), manifest, "blog");

  const all = articlesInCategory(manifest, category.id, lang);
  const curriculum = hasReadingOrder(category);
  if (!state.view) state.view = curriculum ? "curriculum" : "chronological";

  // Static UI strings
  document.getElementById("back-link").textContent = `← ${ui(manifest, "back_to_categories", lang)}`;
  document.getElementById("search-input").placeholder = ui(manifest, "search_placeholder", lang);

  renderHeader(category, all, lang);
  renderViewToggle(manifest, lang, curriculum);
  renderTagFilter(manifest, all, lang);
  renderList(manifest, category, all, lang);
  wireControls(manifest, category, all, lang);
})();

function renderHeader(category, all, lang) {
  document.getElementById("cat-title").textContent = t(category.title, lang);
  document.getElementById("cat-desc").textContent = t(category.description, lang);
  document.getElementById("cat-count").textContent =
    `${all.length} ${pluralizeArticles(all.length, lang)}`;
  document.getElementById("search-input").value = state.search;
}

function renderViewToggle(manifest, lang, curriculum) {
  const wrap = document.getElementById("view-toggle");
  if (!curriculum) { wrap.style.display = "none"; return; }
  wrap.style.display = "";
  wrap.innerHTML = `
    <button class="view-btn ${state.view === "curriculum" ? "is-active" : ""}" data-view="curriculum">
      ${ui(manifest, "view_curriculum", lang)}
    </button>
    <button class="view-btn ${state.view === "chronological" ? "is-active" : ""}" data-view="chronological">
      ${ui(manifest, "view_chronological", lang)}
    </button>
  `;
}

function renderTagFilter(manifest, all, lang) {
  const wrap = document.getElementById("tag-filter-wrap");
  if (state.view === "curriculum") { wrap.style.display = "none"; return; }
  wrap.style.display = "";

  const tags = summarizeTags(manifest, all, lang);
  const root = document.getElementById("tag-filter");
  const allLabel = lang === "en" ? "All" : "Все";
  const chips = [
    chipHTML({ id: null, label: allLabel, count: all.length }, state.tag === null),
    ...tags.map((tg) => chipHTML(tg, state.tag === tg.id)),
  ];
  root.innerHTML = chips.join("");
}

function chipHTML(tag, active) {
  const v = tag.id === null ? "" : tag.id;
  return `<button class="chip ${active ? "is-active" : ""}" data-tag="${v}">
    ${tag.label} <span class="chip__count">${tag.count}</span>
  </button>`;
}

function applyFilter(articles, lang) {
  let list = articles.slice();
  if (state.tag) list = list.filter((a) => (a.tags || []).includes(state.tag));
  if (state.search) {
    const q = state.search.toLowerCase().trim();
    list = list.filter((a) =>
      t(a.title, lang).toLowerCase().includes(q) ||
      t(a.description, lang).toLowerCase().includes(q) ||
      (a.tags || []).some((tg) => tg.toLowerCase().includes(q))
    );
  }
  return list;
}

function renderList(manifest, category, all, lang) {
  const root = document.getElementById("article-groups");
  if (state.view === "curriculum") {
    renderCurriculum(manifest, category, all, lang, root);
  } else {
    renderChronological(manifest, all, lang, root);
  }
}

function renderCurriculum(manifest, category, all, lang, root) {
  const groups = applyReadingOrder(manifest, category, lang);
  const q = state.search.toLowerCase().trim();
  const filtered = q
    ? groups
        .map((g) => ({
          ...g,
          articles: g.articles.filter((a) =>
            t(a.title, lang).toLowerCase().includes(q) ||
            t(a.description, lang).toLowerCase().includes(q)
          ),
        }))
        .filter((g) => g.articles.length > 0)
    : groups;

  if (filtered.length === 0) {
    root.innerHTML = emptyHTML(manifest, lang);
    wireEmpty(manifest, category, all, lang);
    return;
  }

  root.innerHTML = filtered.map((g, gIdx) => `
    <section class="curriculum-group">
      <h3 class="curriculum-group__label">
        <span class="curriculum-group__num">${String(gIdx + 1).padStart(2, "0")}</span>
        ${g.group.label}
        <span class="curriculum-group__count">${g.group.count} ${pluralizeArticles(g.group.count, lang)}</span>
      </h3>
      <ol class="article-list-ordered">
        ${g.articles.map((a, i) => orderedRowHTML(a, i + 1, lang, manifest)).join("")}
      </ol>
    </section>
  `).join("");
}

function renderChronological(manifest, all, lang, root) {
  const filtered = applyFilter(all, lang);
  if (filtered.length === 0) {
    root.innerHTML = emptyHTML(manifest, lang);
    wireEmpty(manifest, null, all, lang);
    return;
  }
  const groups = groupByYear(filtered);
  root.innerHTML = groups.map(({ year, articles }) => `
    <section class="year-group">
      <h3 class="year-group__label">${year}</h3>
      <ul class="article-list-flat">
        ${articles.map((a) => rowHTML(a, lang, manifest)).join("")}
      </ul>
    </section>
  `).join("");
}

function emptyHTML(manifest, lang) {
  return `<div class="empty">${ui(manifest, "no_results", lang)} <button class="link-btn" id="reset-filters">${ui(manifest, "reset_filters", lang)}</button></div>`;
}
function wireEmpty(manifest, category, all, lang) {
  document.getElementById("reset-filters")?.addEventListener("click", () => {
    state.search = "";
    state.tag = null;
    document.getElementById("search-input").value = "";
    syncUrl();
    renderTagFilter(manifest, all, lang);
    renderList(manifest, category, all, lang);
  });
}

function rowHTML(article, lang, manifest) {
  const primaryTagId = (article.tags || [])[0];
  const primaryTagLabel = primaryTagId ? tagLabel(manifest, primaryTagId, lang) : "";
  return `
    <li>
      <a class="article-row article-row--3col" href="article.html?slug=${article.slug}">
        <span class="article-row__date">${shortDate(article.date)}</span>
        <span class="article-row__main">
          <span class="article-row__title">${t(article.title, lang)}</span>
          <span class="article-row__desc">${t(article.description, lang)}</span>
        </span>
        <span class="article-row__tag">${primaryTagLabel}</span>
      </a>
    </li>
  `;
}

function orderedRowHTML(article, n, lang, manifest) {
  return `
    <li>
      <a class="article-row article-row--ordered" href="article.html?slug=${article.slug}">
        <span class="article-row__num">${String(n).padStart(2, "0")}</span>
        <span class="article-row__main">
          <span class="article-row__title">${t(article.title, lang)}</span>
          <span class="article-row__desc">${t(article.description, lang)}</span>
        </span>
        <span class="article-row__time">${article.reading_time} ${ui(manifest, "min_read", lang)}</span>
      </a>
    </li>
  `;
}

function wireControls(manifest, category, all, lang) {
  const input = document.getElementById("search-input");
  let timer;
  input.addEventListener("input", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.search = e.target.value;
      syncUrl();
      renderList(manifest, category, all, lang);
    }, 120);
  });

  document.getElementById("tag-filter").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const next = btn.dataset.tag || null;
    state.tag = next === state.tag ? null : next;
    syncUrl();
    renderTagFilter(manifest, all, lang);
    renderList(manifest, category, all, lang);
  });

  document.getElementById("view-toggle").addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;
    state.view = btn.dataset.view;
    if (state.view === "curriculum") state.tag = null;
    syncUrl();
    renderViewToggle(manifest, lang, true);
    renderTagFilter(manifest, all, lang);
    renderList(manifest, category, all, lang);
  });

  window.addEventListener("popstate", () => {
    state.search = param("q") || "";
    state.tag = param("tag") || null;
    state.view = param("view") || (hasReadingOrder(category) ? "curriculum" : "chronological");
    document.getElementById("search-input").value = state.search;
    renderViewToggle(manifest, lang, hasReadingOrder(category));
    renderTagFilter(manifest, all, lang);
    renderList(manifest, category, all, lang);
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
