import {
  loadManifest,
  renderProfileSidebar,
  initTheme,
  publishedArticles,
  pluralizeArticles,
  shortDate,
  currentLang,
  ui,
  t,
} from "./shared.js";

initTheme();

const PREVIEW_COUNT = 5;

const ICONS = {
  brain: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 0 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 0 1 12 18Z"/><path d="M12 5v13"/></svg>`,
  chart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>`,
  sigma: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>`,
};

loadManifest().then((manifest) => {
  const lang = currentLang(manifest);
  document.documentElement.setAttribute("lang", lang);
  document.title = `${ui(manifest, "blog_title", lang)} — ${manifest.site.author}`;
  renderProfileSidebar(document.getElementById("sidebar-slot"), manifest, "blog");

  document.getElementById("blog-title").textContent = ui(manifest, "blog_title", lang);
  document.getElementById("blog-subtitle").textContent = ui(manifest, "blog_subtitle", lang);

  const articles = publishedArticles(manifest, lang);
  const root = document.getElementById("categories");

  manifest.categories
    .slice()
    .sort((a, b) => (a.order || 99) - (b.order || 99))
    .forEach((cat) => {
      const all = articles.filter((a) => a.category === cat.id);
      if (all.length === 0) return;

      const preview = all.slice(0, PREVIEW_COUNT);
      const hasMore = all.length > PREVIEW_COUNT;

      const section = document.createElement("section");
      section.className = "category";
      section.style.setProperty("--cat-accent", cat.accent);
      section.style.setProperty("--cat-tint", cat.tint);

      section.innerHTML = `
        <header class="category__header">
          <h2 class="category__title">
            <span class="category__icon">${ICONS[cat.icon] || ICONS.chart}</span>
            ${t(cat.title, lang)}
          </h2>
          <a class="category__count-link" href="category.html?id=${cat.id}">
            ${all.length} ${pluralizeArticles(all.length, lang)} →
          </a>
        </header>
        <p class="category__desc">${t(cat.description, lang)}</p>

        <ul class="article-list-flat">
          ${preview.map((a) => rowHTML(a, lang)).join("")}
        </ul>

        ${hasMore ? `
          <a class="category__see-all" href="category.html?id=${cat.id}">
            ${ui(manifest, "see_all", lang)} ${all.length} ${pluralizeArticles(all.length, lang)} →
          </a>
        ` : ""}
      `;
      root.appendChild(section);
    });
});

function rowHTML(article, lang) {
  return `
    <li>
      <a class="article-row" href="article.html?slug=${article.slug}">
        <span class="article-row__date">${shortDate(article.date)}</span>
        <span class="article-row__title">${t(article.title, lang)}</span>
        <span class="article-row__desc">${t(article.description, lang)}</span>
      </a>
    </li>
  `;
}
