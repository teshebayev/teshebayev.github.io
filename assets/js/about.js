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
      Я Software Engineer и PhD-студент / исследователь в области искусственного интеллекта.
      В профессиональной работе занимаюсь разработкой Warehouse Management System и решений
      для автоматизации складских процессов.
    </p>

    <p>
      Помимо инженерной работы, я преподаю основы машинного обучения в Farabi University
      и руковожу студенческой исследовательской командой, которая изучает
      Vision-Language-Action модели и их применение в робототехнике.
    </p>

    <p>
      Я выступал на научных конференциях и проводил лекции на летних школах,
      в том числе по темам Agentic AI и современных AI-систем.
    </p>

    <p>
      Мои научные интересы: VLA, LLM, VLM, Robotics, Applied ML, Machine Learning
      и Deep Learning.
    </p>

    <p>
      В этом блоге я пишу о том, как работают AI-системы: от базовой интуиции
      до практических экспериментов и исследовательских заметок.
    </p>
  `,

  en: `
    <h1 class="about__title">${ui(manifest, "nav_about", lang)}</h1>

    <p>
      I am a Software Engineer and a PhD student / researcher in Artificial Intelligence.
      Professionally, I work on Warehouse Management Systems and automation solutions
      for warehouse operations.
    </p>

    <p>
      In addition to engineering, I teach Machine Learning fundamentals at Farabi University
      and lead a student research team focused on Vision-Language-Action models and their
      applications in robotics.
    </p>

    <p>
      I have presented at scientific conferences and delivered lectures at summer schools,
      including sessions on Agentic AI and modern AI systems.
    </p>

    <p>
      My research interests include VLA, LLMs, VLMs, Robotics, Applied ML,
      Machine Learning, and Deep Learning.
    </p>

    <p>
      In this blog, I write about how AI systems work — from basic intuition
      to practical experiments and research notes.
    </p>
  `,

  kk: `
    <h1 class="about__title">${ui(manifest, "nav_about", lang)}</h1>

    <p>
      Мен Software Engineer және жасанды интеллект саласындағы PhD студент / зерттеушімін.
      Кәсіби жұмысымда Warehouse Management System және қойма процестерін автоматтандыруға
      арналған шешімдерді әзірлеумен айналысамын.
    </p>

    <p>
      Инженерлік жұмыспен қатар, Farabi University-де машиналық оқыту негіздері бойынша
      дәріс оқимын және Vision-Language-Action модельдерін робототехникада қолдануды
      зерттейтін студенттік зерттеу тобына жетекшілік етемін.
    </p>

    <p>
      Ғылыми конференцияларда баяндама жасап, жазғы мектептерде дәрістер өткіздім.
      Дәрістерімнің тақырыптары арасында Agentic AI және заманауи AI жүйелері бар.
    </p>

    <p>
      Ғылыми қызығушылықтарым: VLA, LLM, VLM, Robotics, Applied ML,
      Machine Learning және Deep Learning.
    </p>

    <p>
      Бұл блогта AI жүйелерінің қалай жұмыс істейтінін жазамын:
      базалық интуициядан бастап практикалық эксперименттер мен зерттеу жазбаларына дейін.
    </p>
  `,
};

  document.getElementById("about-content").innerHTML = ABOUT_BODY[lang] || ABOUT_BODY.ru;
}).catch((err) => {
  console.error(err);
  document.getElementById("about-error").textContent =
    "Could not load site data. Make sure content/manifest.json is reachable.";
});
