// =========================================================================
//  shared.js — utilities used on every page
// =========================================================================

const MANIFEST_URL = "content/manifest.json";

/** Fetch the site manifest once and cache it. */
let _manifestCache = null;
export async function loadManifest() {
  if (_manifestCache) return _manifestCache;
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) throw new Error("Failed to load manifest");
  _manifestCache = await res.json();
  return _manifestCache;
}

/** Find category by id. */
export function findCategory(manifest, id) {
  return manifest.categories.find((c) => c.id === id);
}

/** Find article by slug. */
export function findArticle(manifest, slug) {
  return manifest.articles.find((a) => a.slug === slug);
}

/** All non-draft articles, sorted by date desc. */
export function publishedArticles(manifest) {
  return manifest.articles
    .filter((a) => !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Articles in a given category, sorted by date desc. */
export function articlesInCategory(manifest, categoryId) {
  return publishedArticles(manifest).filter((a) => a.category === categoryId);
}

/** Get URL search param value. */
export function param(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/** Set a CSS variable scoped to a category accent. */
export function applyCategoryAccent(rootEl, category) {
  if (!category) return;
  rootEl.style.setProperty("--cat-accent", category.accent);
  rootEl.style.setProperty("--cat-tint", category.tint);
}

// =========================================================================
//  Profile sidebar — rendered on every page
// =========================================================================
export function renderProfileSidebar(target, site, activePage) {
  target.innerHTML = `
    <aside class="sidebar">
      <img class="sidebar__avatar" src="${site.avatar}" alt="${site.author}" onerror="this.style.display='none'">
      <h1 class="sidebar__name">
        ${site.author}
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
          <span class="theme-toggle__dot" id="theme-dot">☼</span>
        </button>
      </h1>
      <p class="sidebar__bio">${site.bio}</p>

      <nav class="sidebar__nav">
        <a href="index.html" class="${activePage === "about" ? "is-active" : ""}">About</a>
        <a href="blog.html"  class="${activePage === "blog"  ? "is-active" : ""}">Блог</a>
      </nav>

      <div class="sidebar__social">
        ${site.social.github ? socialIcon(site.social.github, "github") : ""}
        ${site.social.twitter ? socialIcon(site.social.twitter, "twitter") : ""}
        ${site.social.email ? socialIcon(site.social.email, "mail") : ""}
        ${site.social.rss ? socialIcon(site.social.rss, "rss") : ""}
      </div>

      <div class="sidebar__footer">© ${site.author} ${new Date().getFullYear()}</div>
    </aside>
  `;

  // Wire up theme toggle
  const toggle = document.getElementById("theme-toggle");
  toggle.addEventListener("click", toggleTheme);

  // Mobile bar
  const mobileBar = document.createElement("div");
  mobileBar.className = "mobile-bar";
  mobileBar.innerHTML = `
    <a href="index.html" class="mobile-bar__name">${site.author}</a>
    <div class="mobile-bar__links">
      <a href="index.html">About</a>
      <a href="blog.html">Блог</a>
      <button class="theme-toggle" id="theme-toggle-m" aria-label="Toggle theme">
        <span class="theme-toggle__dot">☼</span>
      </button>
    </div>
  `;
  document.body.prepend(mobileBar);
  document.getElementById("theme-toggle-m").addEventListener("click", toggleTheme);
}

function socialIcon(href, kind) {
  const icons = {
    github: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>`,
    twitter: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>`,
    rss: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3a16 16 0 0 1 16 16h-3a13 13 0 0 0-13-13V3zm0 7a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6v-3zm2 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>`,
  };
  return `<a href="${href}" target="_blank" rel="noopener" aria-label="${kind}">${icons[kind]}</a>`;
}

// =========================================================================
//  Theme
// =========================================================================
export function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon(theme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  document.querySelectorAll(".theme-toggle__dot").forEach((dot) => {
    dot.textContent = theme === "dark" ? "☾" : "☼";
  });
}

// =========================================================================
//  Misc
// =========================================================================
export function formatDate(iso) {
  // Display as "YYYY-MM-DD" — keeps it consistent and locale-neutral.
  return iso;
}

/** Build a category index map: { id: category } */
export function indexCategories(manifest) {
  return Object.fromEntries(manifest.categories.map((c) => [c.id, c]));
}
