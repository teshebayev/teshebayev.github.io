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

// =========================================================================
//  Internationalization
// =========================================================================

const LANG_KEY = "lang";

/**
 * Determine the current language. Precedence:
 *   1. ?lang=xx in the URL
 *   2. localStorage
 *   3. site.defaultLanguage from the manifest
 *   4. "ru" as a last resort.
 * Always returns a language that the site declares it supports.
 */
export function currentLang(manifest) {
  const supported = (manifest?.site?.languages) || ["ru"];
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  const stored = localStorage.getItem(LANG_KEY);
  const def = manifest?.site?.defaultLanguage || supported[0] || "ru";
  const chosen = urlLang || stored || def;
  return supported.includes(chosen) ? chosen : def;
}

/** Persist a language choice and optionally reflect it in the URL. */
export function setLang(lang, { updateUrl = true } = {}) {
  localStorage.setItem(LANG_KEY, lang);
  if (updateUrl) {
    const u = new URL(window.location.href);
    u.searchParams.set("lang", lang);
    window.history.replaceState({}, "", u.toString());
  }
}

/**
 * Translate a localised value into the current language.
 *
 *   t("Hello", "en")                       → "Hello"
 *   t({ru: "Привет", en: "Hello"}, "en")   → "Hello"
 *   t({ru: "Привет"}, "en")                → "Привет"   (fallback to any value)
 *   t(undefined, "en")                     → ""
 *
 * Strings pass through unchanged — useful for fields that don't need translation
 * (like author name or icon ids).
 */
export function t(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value[lang] != null) return value[lang];
    // Fallback: first non-empty translation in any language
    for (const k of Object.keys(value)) {
      if (value[k] != null && value[k] !== "") return value[k];
    }
    return "";
  }
  return String(value);
}

/** Translate a UI string from manifest.i18n. */
export function ui(manifest, key, lang) {
  const dict = manifest?.i18n?.[lang] || {};
  if (dict[key] != null) return dict[key];
  // Fallback to default language, then any
  const def = manifest?.site?.defaultLanguage;
  if (def && manifest?.i18n?.[def]?.[key] != null) return manifest.i18n[def][key];
  for (const l of Object.keys(manifest?.i18n || {})) {
    if (manifest.i18n[l][key] != null) return manifest.i18n[l][key];
  }
  return key;
}

/** Which languages does an article have content for? */
export function articleLanguages(article) {
  const c = article.content;
  if (typeof c === "string") return ["ru"]; // legacy single-string content
  if (c && typeof c === "object") return Object.keys(c).filter((k) => c[k]);
  return [];
}

/** Does this article have content in the given language? */
export function articleHasLang(article, lang) {
  return articleLanguages(article).includes(lang);
}

/**
 * Resolve the markdown path for an article in the given language,
 * falling back to any available language if needed.
 * Returns { path, lang, isFallback }.
 */
export function resolveContent(article, lang) {
  const c = article.content;
  if (typeof c === "string") return { path: c, lang: "ru", isFallback: false };
  if (c && typeof c === "object") {
    if (c[lang]) return { path: c[lang], lang, isFallback: false };
    const fallbackLang = Object.keys(c).find((k) => c[k]);
    if (fallbackLang) return { path: c[fallbackLang], lang: fallbackLang, isFallback: true };
  }
  return null;
}

// =========================================================================
//  Manifest lookups
// =========================================================================

export function findCategory(manifest, id) {
  return manifest.categories.find((c) => c.id === id);
}

export function findArticle(manifest, slug) {
  return manifest.articles.find((a) => a.slug === slug);
}

/**
 * All non-draft articles, sorted by date desc. If `lang` is given, only
 * articles that have content in that language are returned.
 */
export function publishedArticles(manifest, lang = null) {
  let list = manifest.articles.filter((a) => !a.draft);
  if (lang) list = list.filter((a) => articleHasLang(a, lang));
  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function articlesInCategory(manifest, categoryId, lang = null) {
  return publishedArticles(manifest, lang).filter((a) => a.category === categoryId);
}

export function param(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function applyCategoryAccent(rootEl, category) {
  if (!category) return;
  rootEl.style.setProperty("--cat-accent", category.accent);
  rootEl.style.setProperty("--cat-tint", category.tint);
}

// =========================================================================
//  Tag helpers
// =========================================================================

export function tagLabel(manifest, tagId, lang) {
  const entry = manifest.tags && manifest.tags[tagId];
  if (!entry) return tagId;
  return t(entry, lang);
}

export function summarizeTags(manifest, articles, lang) {
  const counts = new Map();
  for (const a of articles) {
    for (const tg of a.tags || []) counts.set(tg, (counts.get(tg) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([id, count]) => ({ id, count, label: tagLabel(manifest, id, lang) }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

// =========================================================================
//  Grouping
// =========================================================================

export function groupByYear(articles) {
  const map = new Map();
  for (const a of articles) {
    const y = a.date.slice(0, 4);
    if (!map.has(y)) map.set(y, []);
    map.get(y).push(a);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, list]) => ({ year, articles: list }));
}

export function groupByPrimaryTag(manifest, articles, lang) {
  const groups = new Map();
  for (const a of articles) {
    const tagId = (a.tags && a.tags[0]) || "_other";
    if (!groups.has(tagId)) groups.set(tagId, []);
    groups.get(tagId).push(a);
  }
  return Array.from(groups.entries())
    .map(([id, list]) => ({
      group: {
        id,
        label: id === "_other" ? ui(manifest, "other_group", lang) : tagLabel(manifest, id, lang),
        count: list.length,
      },
      articles: list,
    }))
    .sort((a, b) => b.group.count - a.group.count);
}

// =========================================================================
//  Reading order
// =========================================================================

export function hasReadingOrder(category) {
  return Array.isArray(category.reading_order) && category.reading_order.length > 0;
}

export function applyReadingOrder(manifest, category, lang = null) {
  const all = articlesInCategory(manifest, category.id, lang);
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  const claimed = new Set();
  const groups = [];

  for (const g of category.reading_order || []) {
    const articles = (g.articles || [])
      .map((slug) => {
        const a = bySlug.get(slug);
        if (a) claimed.add(slug);
        return a;
      })
      .filter(Boolean);
    if (articles.length === 0) continue;
    groups.push({
      group: {
        id: g.group || (typeof g.label === "string" ? g.label : "group"),
        label: t(g.label, lang),
        count: articles.length,
      },
      articles,
    });
  }

  const leftover = all.filter((a) => !claimed.has(a.slug));
  if (leftover.length > 0) {
    groups.push({
      group: { id: "_rest", label: ui(manifest, "other_group", lang), count: leftover.length },
      articles: leftover,
    });
  }
  return groups;
}

export function readingOrderSequence(manifest, category, lang = null) {
  if (!hasReadingOrder(category)) return null;
  return applyReadingOrder(manifest, category, lang).flatMap((g) => g.articles);
}

// =========================================================================
//  Profile sidebar (rendered on every page)
// =========================================================================

export function renderProfileSidebar(target, manifest, activePage) {
  const lang = currentLang(manifest);
  const site = manifest.site;
  target.innerHTML = `
    <aside class="sidebar">
      <img class="sidebar__avatar" src="${site.avatar}" alt="${site.author}" onerror="this.style.display='none'">
      <h1 class="sidebar__name">
        ${site.author}
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
          <span class="theme-toggle__dot" id="theme-dot">☼</span>
        </button>
      </h1>
      <p class="sidebar__bio">${t(site.bio, lang)}</p>

      <nav class="sidebar__nav">
        <a href="index.html${langSuffix(lang, manifest)}" class="${activePage === "about" ? "is-active" : ""}">${ui(manifest, "nav_about", lang)}</a>
        <a href="blog.html${langSuffix(lang, manifest)}"  class="${activePage === "blog"  ? "is-active" : ""}">${ui(manifest, "nav_blog", lang)}</a>
      </nav>

      ${renderLangSwitch(manifest, lang)}

      <div class="sidebar__social">
        ${site.social.github  ? socialIcon(site.social.github,  "github")  : ""}
        ${site.social.twitter ? socialIcon(site.social.twitter, "twitter") : ""}
        ${site.social.email   ? socialIcon(site.social.email,   "mail")    : ""}
        ${site.social.rss     ? socialIcon(site.social.rss,     "rss")     : ""}
      </div>

      <div class="sidebar__footer">© ${site.author} ${new Date().getFullYear()}</div>
    </aside>
  `;

  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  wireLangSwitch(manifest);

  // Mobile bar
  const mobileBar = document.createElement("div");
  mobileBar.className = "mobile-bar";
  mobileBar.innerHTML = `
    <a href="index.html${langSuffix(lang, manifest)}" class="mobile-bar__name">${site.author}</a>
    <div class="mobile-bar__links">
      <a href="index.html${langSuffix(lang, manifest)}">${ui(manifest, "nav_about", lang)}</a>
      <a href="blog.html${langSuffix(lang, manifest)}">${ui(manifest, "nav_blog", lang)}</a>
      ${renderLangSwitch(manifest, lang, true)}
      <button class="theme-toggle" id="theme-toggle-m" aria-label="Toggle theme">
        <span class="theme-toggle__dot">☼</span>
      </button>
    </div>
  `;
  document.body.prepend(mobileBar);
  document.getElementById("theme-toggle-m").addEventListener("click", toggleTheme);
  wireLangSwitch(manifest, true);
}

function langSuffix(lang, manifest) {
  // Only include ?lang= if it differs from default; keeps URLs clean.
  const def = manifest?.site?.defaultLanguage;
  return lang && lang !== def ? `?lang=${lang}` : "";
}

function renderLangSwitch(manifest, currentLang, mobile = false) {
  const langs = manifest?.site?.languages || [];
  if (langs.length < 2) return "";
  const cls = mobile ? "lang-switch lang-switch--mobile" : "lang-switch";
  const buttons = langs.map((l) => {
    const short = ui(manifest, "_lang_short", l);
    const active = l === currentLang ? "is-active" : "";
    return `<button class="lang-btn ${active}" data-lang="${l}" data-mobile="${mobile}" aria-label="${ui(manifest, "_lang_name", l)}">${short}</button>`;
  }).join("");
  return `<div class="${cls}">${buttons}</div>`;
}

function wireLangSwitch(manifest /*, mobile */) {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    // Only attach once
    if (btn.dataset.wired) return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      setLang(lang);
      window.location.reload();
    });
  });
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
  return iso;
}

export function indexCategories(manifest) {
  return Object.fromEntries(manifest.categories.map((c) => [c.id, c]));
}

export function shortDate(iso) {
  const [_y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1]} ${d}`;
}

/**
 * Plural for "article" — language-aware.
 *   ru: "статья" / "статьи" / "статей"
 *   en: "article" / "articles"
 */
export function pluralizeArticles(n, lang = "ru") {
  if (lang === "en") return n === 1 ? "article" : "articles";
  // Russian
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "статья";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "статьи";
  return "статей";
}
