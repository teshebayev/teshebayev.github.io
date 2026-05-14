import {
  loadManifest,
  renderProfileSidebar,
  initTheme,
  publishedArticles,
  pluralizeArticles,
  shortDate,
} from "./shared.js";

initTheme();

const PREVIEW_COUNT = 5;

const ICONS = {
  brain: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 0 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 0 1 12 18Z"/><path d="M12 5v13"/></svg>`,
  chart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>`,
  sigma: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>`,
  database: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>`,
};

loadManifest().then((manifest) => {
  const { site, categories } = manifest;
  document.title = `Блог — ${site.author}`;
  renderProfileSidebar(document.getElementById("sidebar-slot"), site, "blog");

  const articles = publishedArticles(manifest);
  const root = document.getElementById("categories");

  categories
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
            ${cat.title}
          </h2>
          <a class="category__count-link" href="category.html?id=${cat.id}">
            ${all.length} ${pluralizeArticles(all.length)} →
          </a>
        </header>
        <p class="category__desc">${cat.description}</p>

        <ul class="article-list-flat">
          ${preview.map(rowHTML).join("")}
        </ul>

        ${hasMore ? `
          <a class="category__see-all" href="category.html?id=${cat.id}">
            Смотреть все ${all.length} ${pluralizeArticles(all.length)} →
          </a>
        ` : ""}
      `;
      root.appendChild(section);
    });
});

function rowHTML(article) {
  return `
    <li>
      <a class="article-row" href="article.html?slug=${article.slug}">
        <span class="article-row__date">${shortDate(article.date)}</span>
        <span class="article-row__title">${article.title}</span>
        <span class="article-row__desc">${article.description || ""}</span>
      </a>
    </li>
  `;
}
