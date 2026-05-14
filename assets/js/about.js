import { loadManifest, renderProfileSidebar, initTheme, currentLang, ui, t } from "./shared.js";

initTheme();

loadManifest().then((manifest) => {
  const lang = currentLang(manifest);
  document.documentElement.setAttribute("lang", lang);
  document.title = `${ui(manifest, "nav_about", lang)} — ${manifest.site.author}`;
  renderProfileSidebar(document.getElementById("sidebar-slot"), manifest, "about");

  // Localized "About" page body
  const ABOUT_BODY = {
    ru: `
      <h1 class="about__title">${ui(manifest, "nav_about", lang)}</h1>
      <p>
        Я инженер-программист. Здесь я пишу о том, как вещи на самом деле работают
        под капотом — нейросети, статистика, небольшие эксперименты на стороне.
        Записывать заставляет понять предмет дважды.
      </p>
      <p>Темы, к которым я возвращаюсь:</p>
      <ul>
        <li>Интуиция за ML-алгоритмами с первых принципов</li>
        <li>Архитектуры глубокого обучения (CNN, трансформеры, генеративные модели)</li>
        <li>Вероятность и математика под ML</li>
        <li>Что бы я сейчас ни ковырял в качестве сайд-проекта</li>
      </ul>
      <p>
        В <a href="blog.html">блоге</a> статьи сгруппированы по темам. Если найдёте
        ошибку или хотите написать — иконки в сайдбаре настоящие.
      </p>
    `,
    en: `
      <h1 class="about__title">${ui(manifest, "nav_about", lang)}</h1>
      <p>
        I'm a software engineer. I write here about how things actually work
        under the hood — neural networks, statistics, and the small
        experiments I run on the side. Writing forces me to understand
        something twice over.
      </p>
      <p>A few topics I keep coming back to:</p>
      <ul>
        <li>Building intuition for ML algorithms from first principles</li>
        <li>Deep learning architectures (CNNs, transformers, generative models)</li>
        <li>Probability and the math underneath it all</li>
        <li>Whatever side project I'm currently obsessed with</li>
      </ul>
      <p>
        The <a href="blog.html">blog</a> groups posts by topic. If you find a
        mistake or want to chat, the icons in the sidebar are real — pick the
        one that fits you.
      </p>
    `,
  };

  document.getElementById("about-content").innerHTML = ABOUT_BODY[lang] || ABOUT_BODY.ru;
}).catch((err) => {
  console.error(err);
  document.getElementById("about-error").textContent =
    "Could not load site data. Make sure content/manifest.json is reachable.";
});
