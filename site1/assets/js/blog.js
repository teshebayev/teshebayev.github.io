import {
  loadManifest,
  renderProfileSidebar,
  initTheme,
  publishedArticles,
  formatDate,
} from "./shared.js";

initTheme();

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
      const list = articles.filter((a) => a.category === cat.id);
      if (list.length === 0) return;

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
          <span class="category__count">${list.length} ${pluralize(list.length)}</span>
        </header>
        <p class="category__desc">${cat.description}</p>
        <div class="article-cards">
          ${list.map(cardHTML).join("")}
        </div>
      `;
      root.appendChild(section);
    });
});

function cardHTML(article) {
  return `
    <a class="article-card" href="article.html?slug=${article.slug}">
      <div class="article-card__date">${formatDate(article.date)}</div>
      <h3 class="article-card__title">${article.title}</h3>
      <p class="article-card__desc">${article.description || ""}</p>
    </a>
  `;
}

function pluralize(n) {
  // Russian-friendly plural for "статья"
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "статья";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "статьи";
  return "статей";
}
