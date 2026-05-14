Мы часто говорим «искусственный интеллект», но внутри этого термина смешано сразу несколько идей: человеческий интеллект, программирование правил, машинное обучение, глубокие нейросети, компьютерное зрение и большие языковые модели. В этой статье разберём всё постепенно: от простой интуиции до того, как модель учится на данных и почему LLM умеют писать текст.

## Человеческий интеллект

Когда мы узнаём друзей по голосу, читаем между строк, водим машину или впервые решаем новую задачу — мы используем интеллект. В простом смысле интеллект — это способность учиться на опыте, видеть закономерности и принимать решения в ситуациях, где заранее не прописана инструкция.

Главное здесь в том, что нас не учат всему через явные правила. Ребёнку не пишут инструкцию «как узнавать кошку». Он видит несколько кошек, замечает повторяющиеся признаки и постепенно начинает отличать кошку от собаки, игрушки или случайного пятна на картинке.

## Искусственный интеллект — почему искусственный?

«Искусственный» — потому что создан человеком, а не природой. Это попытка воспроизвести разумное поведение в машине: видеть, слышать, говорить, рассуждать, выбирать действие и адаптироваться к новой информации.

Это слово не означает «фальшивый». Оно означает «сделанный руками» — как искусственный спутник или искусственный материал. Поведение системы может выглядеть разумным, но источник у него другой: не биологическая эволюция, а математика, данные, инженерия и вычислительные ресурсы.

## Области ИИ и почему сейчас все говорят про машинное обучение

ИИ — это широкая дисциплина. В неё входят разные подходы. В старых системах программисты вручную описывали правила: «если у объекта четыре ноги, хвост и он лает — это собака». Такие системы называют экспертными или rule-based системами.

Но большинство реальных задач слишком сложные для ручного описания. Невозможно перечислить все варианты лиц, голосов, дорожных ситуаций, стилей письма или фотографий котов. Поэтому современный ИИ в основном опирается на машинное обучение: мы не пишем все правила сами, а показываем машине данные, чтобы она нашла закономерности.

Внутри машинного обучения находится глубокое обучение — подход, где используются многослойные нейронные сети. Именно глубокое обучение лежит в основе больших языковых моделей, компьютерного зрения, распознавания речи и многих современных рекомендательных систем.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      fill: #111111;
    }
    .subtitle {
      font-size: 14px;
      fill: #111111;
      opacity: 0.72;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      rx: 14;
    }
    .step-top {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
    }
    .step-bottom {
      font-size: 13px;
      font-weight: 700;
      fill: #111111;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.25;
      rx: 18;
    }
    .ai-box {
      fill: #F7F5EF;
      stroke: #8E8A82;
      stroke-width: 1.3;
      rx: 18;
    }
    .ml-box {
      fill: #F0EEFF;
      stroke: #3576C0;
      stroke-width: 1.45;
      rx: 16;
    }
    .dl-box {
      fill: #EAF8F3;
      stroke: #73B222;
      stroke-width: 1.45;
      rx: 14;
    }
    .mini-box {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.25;
      rx: 9;
    }
    .side-box {
      fill: #ffffff;
      stroke: #8E8A82;
      stroke-width: 1.15;
      rx: 10;
    }
    .box-title-ai {
      font-size: 17px;
      font-weight: 800;
      fill: #4F4A44;
    }
    .box-sub-ai {
      font-size: 13px;
      fill: #5E5850;
    }
    .box-title-ml {
      font-size: 17px;
      font-weight: 800;
      fill: #3576C0;
    }
    .box-sub-ml {
      font-size: 13px;
      fill: #3576C0;
      opacity: 0.88;
    }
    .box-title-dl {
      font-size: 17px;
      font-weight: 800;
      fill: #145F53;
    }
    .box-sub-dl {
      font-size: 13px;
      fill: #145F53;
      opacity: 0.85;
    }
    .mini-title {
      font-size: 16px;
      font-weight: 800;
      fill: #145F53;
    }
    .mini-sub {
      font-size: 12px;
      fill: #145F53;
      opacity: 0.85;
    }
    .side-title {
      font-size: 15px;
      font-weight: 800;
      fill: #4F4A44;
    }
    .explain {
      font-size: 17px;
      font-weight: 800;
      fill: #111111;
    }
    .explain-small {
      font-size: 14px;
      fill: #111111;
      opacity: 0.76;
    }
    .highlight-ai {
      fill: none;
      stroke: #C30B0A;
      stroke-width: 2.3;
      rx: 18;
      stroke-dasharray: 8 5;
    }
    .highlight-ml {
      fill: none;
      stroke: #C30B0A;
      stroke-width: 2.3;
      rx: 16;
      stroke-dasharray: 8 5;
    }
    .highlight-dl {
      fill: none;
      stroke: #C30B0A;
      stroke-width: 2.3;
      rx: 14;
      stroke-dasharray: 8 5;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <!-- Header -->
  <text id="mainTitle" x="32" y="36" class="title">Шаг 1. Что такое искусственный интеллект?</text>
  <text id="mainSubtitle" x="32" y="64" class="subtitle">ИИ — это общий класс систем, которые имитируют разумное поведение</text>
  <rect x="640" y="20" width="230" height="58" class="step-pill" />
  <text id="stepCounter" x="660" y="43" class="step-top">Шаг 1 из 6</text>
  <text id="stepName" x="660" y="65" class="step-bottom">Искусственный интеллект</text>
  <!-- Внешний синий прямоугольник: увеличен по вертикали -->
  <rect x="40" y="112" width="830" height="340" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="555" y="474" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="606" y="493" class="btn-text-disabled">← Назад</text>
  <text id="bottomCounter" x="715" y="494" class="title center">1 / 6</text>
  <rect id="nextBtn" x="768" y="474" width="102" height="38" class="btn" />
  <text x="819" y="493" class="btn-text">Вперёд →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const aiOnly = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Искусственный интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Любая система, которая пытается имитировать разумное поведение</text>
    `;
    const aiMl = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Искусственный интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Общий «зонт» для разных подходов</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Машинное обучение</text>
      <text x="180" y="252" class="box-sub-ml">Учится на данных, а не на правилах</text>
    `;
    const aiMlDl = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Искусственный интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Общий «зонт» для разных подходов</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Машинное обучение</text>
      <text x="180" y="252" class="box-sub-ml">Учится на данных, а не на правилах</text>
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="287" class="box-title-dl">Глубокое обучение</text>
      <text x="232" y="309" class="box-sub-dl">Многослойные нейронные сети</text>
    `;
    const aiMlDlModels = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Искусственный интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Общий «зонт» для разных подходов</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Машинное обучение</text>
      <text x="180" y="252" class="box-sub-ml">Учится на данных, а не на правилах</text>
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="286" class="box-title-dl">Глубокое обучение</text>
      <text x="232" y="307" class="box-sub-dl">Многослойные нейронные сети</text>
      <rect x="225" y="317" width="96" height="42" class="mini-box" />
      <text x="273" y="334" class="mini-title center">LLM</text>
      <text x="273" y="350" class="mini-sub center">тексты</text>
      <rect x="340" y="317" width="96" height="42" class="mini-box" />
      <text x="388" y="334" class="mini-title center">CNN</text>
      <text x="388" y="350" class="mini-sub center">зрение</text>
      <rect x="455" y="317" width="96" height="42" class="mini-box" />
      <text x="503" y="334" class="mini-title center">Речь</text>
      <text x="503" y="350" class="mini-sub center">аудио</text>
    `;
    const fullDiagram = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Искусственный интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Общий «зонт» для разных подходов</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Машинное обучение</text>
      <text x="180" y="252" class="box-sub-ml">Учится на данных, а не на правилах</text>
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="286" class="box-title-dl">Глубокое обучение</text>
      <text x="232" y="307" class="box-sub-dl">Многослойные нейронные сети</text>
      <rect x="225" y="317" width="96" height="42" class="mini-box" />
      <text x="273" y="334" class="mini-title center">LLM</text>
      <text x="273" y="350" class="mini-sub center">тексты</text>
      <rect x="340" y="317" width="96" height="42" class="mini-box" />
      <text x="388" y="334" class="mini-title center">CNN</text>
      <text x="388" y="350" class="mini-sub center">зрение</text>
      <rect x="455" y="317" width="96" height="42" class="mini-box" />
      <text x="503" y="334" class="mini-title center">Речь</text>
      <text x="503" y="350" class="mini-sub center">аудио</text>
      <rect x="645" y="174" width="135" height="52" class="side-box" />
      <text x="712.5" y="194" class="side-title center">Экспертные</text>
      <text x="712.5" y="215" class="side-title center">системы</text>
      <rect x="645" y="246" width="135" height="52" class="side-box" />
      <text x="712.5" y="266" class="side-title center">Логические</text>
      <text x="712.5" y="287" class="side-title center">правила</text>
      <rect x="645" y="318" width="135" height="52" class="side-box" />
      <text x="712.5" y="338" class="side-title center">Поиск</text>
      <text x="712.5" y="359" class="side-title center">и план.</text>
    `;
    const steps = [
      {
        title: "Шаг 1. Что такое искусственный интеллект?",
        subtitle: "ИИ — это общий класс систем, которые имитируют разумное поведение",
        name: "Искусственный интеллект",
        scene: `
          ${aiOnly}
          <rect x="95" y="128" width="710" height="252" class="highlight-ai" />
          <text x="450" y="398" class="explain center">ИИ — самый широкий уровень.</text>
          <text x="450" y="416" class="explain-small center">Сюда входят разные способы заставить систему решать интеллектуальные задачи.</text>
        `
      },
      {
        title: "Шаг 2. Внутри ИИ появляется машинное обучение",
        subtitle: "Это подход, где система учится на данных",
        name: "Машинное обучение",
        scene: `
          ${aiMl}
          <rect x="150" y="194" width="470" height="182" class="highlight-ml" />
          <text x="450" y="398" class="explain center">Машинное обучение — это часть ИИ.</text>
          <text x="450" y="416" class="explain-small center">Вместо ручных правил модель ищет закономерности в данных.</text>
        `
      },
      {
        title: "Шаг 3. Внутри ML есть глубокое обучение",
        subtitle: "Это машинное обучение на основе многослойных нейросетей",
        name: "Глубокое обучение",
        scene: `
          ${aiMlDl}
          <rect x="202" y="258" width="370" height="105" class="highlight-dl" />
          <text x="450" y="398" class="explain center">Глубокое обучение — это часть машинного обучения.</text>
          <text x="450" y="416" class="explain-small center">Оно использует нейросети с большим количеством слоёв.</text>
        `
      },
      {
        title: "Шаг 4. Внутри deep learning есть разные модели",
        subtitle: "Например: модели для текста, изображений и речи",
        name: "LLM / CNN / речь",
        scene: `
          ${aiMlDlModels}
          <text x="450" y="398" class="explain center">Разные модели решают разные задачи.</text>
          <text x="450" y="416" class="explain-small center">LLM — текст, CNN — зрение, модели речи — аудио.</text>
        `
      },
      {
        title: "Шаг 5. ИИ — это не только ML",
        subtitle: "В ИИ также входят системы на правилах, поиск и планирование",
        name: "Другие подходы",
        scene: `
          ${fullDiagram}
          <rect x="635" y="168" width="155" height="212" class="highlight-ai" />
          <text x="450" y="398" class="explain center">Не весь ИИ обучается на данных.</text>
          <text x="450" y="416" class="explain-small center">Экспертные системы могут работать по заранее заданным правилам.</text>
        `
      },
      {
        title: "Шаг 6. Итоговая иерархия",
        subtitle: "Теперь видно, где находится LLM внутри всей области ИИ",
        name: "Итог",
        scene: `
          ${fullDiagram}
          <text x="450" y="392" class="explain center">ИИ ⊃ Машинное обучение ⊃ Глубокое обучение ⊃ LLM / CNN / речь</text>
          <text x="450" y="414" class="explain-small center">LLM — это не весь ИИ, а одна ветка внутри глубокого обучения.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Интерактивная схема: ИИ как общий «зонт», внутри которого находятся машинное обучение, глубокое обучение и современные модели.</figcaption>
</figure>

## Явное программирование и машинное обучение

Проще всего понять разницу на обычной задаче. Допустим, нам нужно найти расстояние, которое прошёл автомобиль. У нас есть скорость и время. Это классическая школьная формула:

$$S = v \cdot t$$

Здесь связь между входами и выходом полностью известна. Можно просто написать программу:

```python
def distance(velocity, time):
    return velocity * time
```

Это явное программирование: человек знает правило и записывает его в код. Машине не нужно учиться, потому что вся логика уже задана программистом.

А теперь другая задача: определить по фотографии, кошка на ней или собака. Формулы для этого нет. Нельзя написать надёжное правило вида `if pixel[3][5] == "усы": return "cat"`. Картинки слишком разные: меняется освещение, поза, фон, ракурс, размер объекта и качество камеры.

Здесь начинается машинное обучение. Мы показываем модели много примеров вида «вход → правильный ответ», а она подбирает внутренние параметры так, чтобы на новых похожих примерах давать правильный ответ.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 21px;
      font-weight: 800;
      fill: #111111;
    }
    .subtitle {
      font-size: 14px;
      fill: #111111;
      opacity: 0.75;
    }
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
      rx: 14;
    }
    .step-top {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
    }
    .step-bottom {
      font-size: 13px;
      font-weight: 700;
      fill: #111111;
    }
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
    }
    .scene-title {
      font-size: 16px;
      font-weight: 800;
      fill: #111111;
    }
    .node-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 800;
      fill: #111111;
    }
    .small {
      font-size: 12px;
      fill: #111111;
      opacity: 0.78;
    }
    .formula {
      font-size: 24px;
      font-weight: 800;
      fill: #111111;
    }
    .formula-small {
      font-size: 18px;
      font-weight: 800;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .arrow {
      stroke: #3576C0;
      stroke-width: 2.2;
      fill: none;
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
    }
    .route {
      stroke: #3576C0;
      stroke-width: 3.3;
      fill: none;
      stroke-linecap: round;
    }
    .dot {
      fill: #3576C0;
    }
    .code-box {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .code-title {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
    }
    .code {
      font-family: "Courier New", Courier, monospace;
      font-size: 14px;
      fill: #3576C0;
    }
    .table-box {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      rx: 8;
    }
    .table-line {
      stroke: #3576C0;
      stroke-width: 1.1;
      stroke-opacity: 0.35;
    }
    .table-head {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .table-cell {
      font-size: 14px;
      fill: #111111;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Шаг 1. Есть простая задача</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">Нужно найти время движения по расстоянию и скорости</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Шаг 1 из 9</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Простая задача</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Дано</text>
  <text id="dataLine1" x="50" y="152" class="left-text">S = 10 км</text>
  <text id="dataLine2" x="50" y="178" class="left-text">v = 1 км/ч</text>
  <text id="dataLine3" x="50" y="204" class="left-text">t = ?</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Цель</text>
  <text id="goalLine1" x="50" y="318" class="left-text">Понять, как получить</text>
  <text id="goalLine2" x="50" y="346" class="left-text">ответ: обычной формулой</text>
  <text id="goalLine3" x="50" y="374" class="left-text">или через обучение</text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Назад</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 9</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Вперёд →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Шаг 1. Есть простая задача",
        subtitle: "Нужно найти время движения по расстоянию и скорости",
        name: "Простая задача",
        goal: [
          "Понять, как получить",
          "ответ: обычной формулой",
          "или через обучение"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Идеальный случай</text>
          <text x="328" y="154" class="small">Скорость постоянная. Дорога простая.</text>
          <circle cx="350" cy="250" r="6" class="dot" />
          <path d="M350 250 C400 250, 430 214, 480 238 C535 263, 575 208, 628 238 C680 266, 725 250, 820 250" class="route" />
          <circle cx="820" cy="250" r="6" class="dot" />
          <text x="335" y="276" class="small">start</text>
          <text x="797" y="276" class="small">finish</text>
          <line x1="350" y1="318" x2="820" y2="318" stroke="#3576C0" stroke-width="1.5" stroke-opacity="0.7" />
          <line x1="350" y1="311" x2="350" y2="325" stroke="#3576C0" stroke-width="1.5" />
          <line x1="820" y1="311" x2="820" y2="325" stroke="#3576C0" stroke-width="1.5" />
          <text x="585" y="342" class="formula-small center">S = 10 км</text>
        `
      },
      {
        title: "Шаг 2. В обычном программировании",
        subtitle: "Мы сами знаем правило и просто даём его компьютеру",
        name: "Explicit programming",
        goal: [
          "Если правило известно,",
          "человек сам записывает",
          "формулу"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Схема explicit programming</text>
          <rect x="328" y="205" width="112" height="66" class="node-blue" />
          <text x="384" y="230" class="node-bold center">Данные</text>
          <text x="384" y="252" class="small center">S, v</text>
          <path d="M452 238 L502 238" class="arrow" />
          <rect x="514" y="205" width="136" height="66" class="node-yellow" />
          <text x="582" y="230" class="node-bold center">Правило</text>
          <text x="582" y="252" class="small center">t = S / v</text>
          <path d="M662 238 L712 238" class="arrow" />
          <rect x="724" y="205" width="96" height="66" class="node-green" />
          <text x="772" y="230" class="node-bold center">Ответ</text>
          <text x="772" y="252" class="small center">t</text>
          <text x="584" y="345" class="formula-small center">Данные + правило → ответ</text>
        `
      },
      {
        title: "Шаг 3. Компьютер выполняет код",
        subtitle: "Он выполняет формулу, которую написал человек",
        name: "Код",
        goal: [
          "Человек сам",
          "пишет формулу",
          "в коде"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Что происходит внутри программы?</text>
          <rect x="328" y="226" width="118" height="74" class="node-blue" />
          <text x="387" y="252" class="node-bold center">Данные</text>
          <text x="387" y="276" class="small center">S = 10, v = 1</text>
          <path d="M456 263 L486 263" class="arrow" />
          <rect x="532" y="158" width="160" height="42" class="node-yellow" />
          <text x="612" y="179" class="node-bold center">Компьютер</text>
          <rect x="498" y="218" width="250" height="122" class="code-box" />
          <text x="520" y="246" class="code-title">Python</text>
          <text x="520" y="280" class="code">def travel_time(S, v):</text>
          <text x="548" y="310" class="code">return S / v</text>
          <path d="M760 263 L790 263" class="arrow" />
          <rect x="802" y="226" width="58" height="74" class="node-green" />
          <text x="831" y="252" class="node-bold center">Ответ</text>
          <text x="831" y="278" class="formula-small center">10 ч</text>
          <text x="584" y="388" class="left-text center">Здесь нет обучения. Компьютер просто выполняет функцию,</text>
          <text x="584" y="418" class="left-text center">которую заранее написал человек.</text>
        `
      },
      {
        title: "Шаг 4. Вопрос",
        subtitle: "А мог бы компьютер сам узнать эту зависимость?",
        name: "Вопрос",
        goal: [
          "Переходим от",
          "готовой формулы",
          "к обучению"
        ],
        scene: `
          <text x="584" y="195" class="title center">Как заставить компьютер учиться?</text>
          <text x="584" y="250" class="formula-small center">Может ли он сам обнаружить правило?</text>
          <text x="584" y="292" class="formula-small center">Например: t зависит от S и v</text>
        `
      },
      {
        title: "Шаг 5. Идея машинного обучения",
        subtitle: "Вместо формулы дадим много примеров",
        name: "Много примеров",
        goal: [
          "Не пишем формулу.",
          "Показываем много",
          "готовых примеров"
        ],
        scene: `
          <text x="584" y="195" class="title center">Дадим компьютеру примеры</text>
          <text x="584" y="250" class="formula-small center">Он увидит входные данные и правильные ответы.</text>
          <text x="584" y="292" class="formula-small center">После этого попробует найти закономерность.</text>
        `
      },
      {
        title: "Шаг 6. Данные для обучения",
        subtitle: "Каждая строка — это пример, на котором модель учится",
        name: "Training data",
        goal: [
          "Теперь у нас есть",
          "не одна задача,",
          "а набор примеров"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Обучающие данные</text>
          <rect x="410" y="164" width="300" height="198" class="table-box" />
          <line x1="410" y1="206" x2="710" y2="206" class="table-line" />
          <line x1="410" y1="245" x2="710" y2="245" class="table-line" />
          <line x1="410" y1="284" x2="710" y2="284" class="table-line" />
          <line x1="410" y1="323" x2="710" y2="323" class="table-line" />
          <line x1="510" y1="164" x2="510" y2="362" class="table-line" />
          <line x1="610" y1="164" x2="610" y2="362" class="table-line" />
          <text x="460" y="186" class="table-head">S</text>
          <text x="560" y="186" class="table-head">v</text>
          <text x="660" y="186" class="table-head">t</text>
          <text x="460" y="226" class="table-cell">100</text>
          <text x="560" y="226" class="table-cell">5</text>
          <text x="660" y="226" class="table-cell">20</text>
          <text x="460" y="265" class="table-cell">10</text>
          <text x="560" y="265" class="table-cell">2</text>
          <text x="660" y="265" class="table-cell">5</text>
          <text x="460" y="304" class="table-cell">5</text>
          <text x="560" y="304" class="table-cell">1</text>
          <text x="660" y="304" class="table-cell">5</text>
          <text x="460" y="343" class="table-cell">20</text>
          <text x="560" y="343" class="table-cell">4</text>
          <text x="660" y="343" class="table-cell">5</text>
          <path d="M760 226 L715 226" class="arrow-red" />
          <text x="772" y="230" class="small">ответ</text>
          <path d="M760 343 L715 343" class="arrow-red" />
          <text x="772" y="347" class="small">ответ</text>
        `
      },
      {
        title: "Шаг 7. Модель учится по примерам",
        subtitle: "Она ищет зависимость между S, v и t",
        name: "Обучение",
        goal: [
          "Модель пытается",
          "найти скрытое",
          "правило"
        ],
        scene: `
          <rect x="328" y="156" width="170" height="178" class="node-blue" />
          <text x="413" y="180" class="node-bold center">Данные</text>
          <rect x="350" y="198" width="126" height="108" class="table-box" />
          <line x1="350" y1="225" x2="476" y2="225" class="table-line" />
          <line x1="350" y1="252" x2="476" y2="252" class="table-line" />
          <line x1="350" y1="279" x2="476" y2="279" class="table-line" />
          <line x1="392" y1="198" x2="392" y2="306" class="table-line" />
          <line x1="434" y1="198" x2="434" y2="306" class="table-line" />
          <text x="371" y="212" class="table-head">S</text>
          <text x="413" y="212" class="table-head">v</text>
          <text x="455" y="212" class="table-head">t</text>
          <text x="371" y="238" class="table-cell">100</text>
          <text x="413" y="238" class="table-cell">5</text>
          <text x="455" y="238" class="table-cell">20</text>
          <text x="371" y="265" class="table-cell">10</text>
          <text x="413" y="265" class="table-cell">2</text>
          <text x="455" y="265" class="table-cell">5</text>
          <text x="371" y="292" class="table-cell">20</text>
          <text x="413" y="292" class="table-cell">4</text>
          <text x="455" y="292" class="table-cell">5</text>
          <path d="M510 245 L560 245" class="arrow" />
          <rect x="572" y="196" width="130" height="98" class="node-yellow" />
          <text x="637" y="223" class="node-bold center">Модель</text>
          <text x="637" y="253" class="small center">ищет связь</text>
          <path d="M714 245 L760 245" class="arrow" />
          <rect x="772" y="196" width="44" height="98" class="node-green" />
          <text x="794" y="223" class="node-bold center">t</text>
          <text x="794" y="253" class="small center">ответ</text>
          <text x="584" y="380" class="formula-small center">После обучения модель примерно понимает:</text>
          <text x="584" y="410" class="formula center">t = f(S, v)</text>
        `
      },
      {
        title: "Шаг 8. Используем обученную модель",
        subtitle: "Теперь можно дать новый пример без готового ответа",
        name: "Предсказание",
        goal: [
          "После обучения",
          "модель получает",
          "новые данные"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Новый пример</text>
          <rect x="328" y="208" width="130" height="72" class="node-blue" />
          <text x="393" y="232" class="node-bold center">Новые данные</text>
          <text x="393" y="256" class="small center">S = 10, v = 1</text>
          <path d="M470 244 L528 244" class="arrow" />
          <rect x="540" y="200" width="144" height="88" class="node-yellow" />
          <text x="612" y="228" class="node-bold center">Модель</text>
          <text x="612" y="252" class="small center">уже обучена</text>
          <path d="M696 244 L750 244" class="arrow" />
          <rect x="762" y="208" width="60" height="72" class="node-green" />
          <text x="792" y="232" class="node-bold center">t</text>
          <text x="792" y="256" class="small center">?</text>
          <text x="584" y="370" class="formula-small center">Модель должна предсказать время.</text>
          <text x="584" y="406" class="formula center">t ≈ 10 ч</text>
        `
      },
      {
        title: "Шаг 9. Главное различие",
        subtitle: "В одном случае формулу пишет человек, в другом — модель ищет её по данным",
        name: "Сравнение",
        goal: [
          "Теперь можно",
          "сравнить два",
          "подхода"
        ],
        scene: `
          <text x="430" y="146" class="scene-title center">Explicit programming</text>
          <rect x="332" y="172" width="196" height="112" class="node-blue" />
          <text x="430" y="206" class="formula-small center">Данные + правило</text>
          <text x="430" y="236" class="formula-small center">→</text>
          <text x="430" y="264" class="formula-small center">Ответ</text>
          <text x="430" y="330" class="small center">Человек пишет правило заранее.</text>
          <line x1="584" y1="146" x2="584" y2="340" stroke="#3576C0" stroke-width="1.2" stroke-opacity="0.28" />
          <text x="738" y="146" class="scene-title center">Machine learning</text>
          <rect x="640" y="172" width="196" height="112" class="node-yellow" />
          <text x="738" y="206" class="formula-small center">Данные + ответы</text>
          <text x="738" y="236" class="formula-small center">→</text>
          <text x="738" y="264" class="formula-small center">Модель</text>
          <text x="738" y="330" class="small center">Модель учится правилу по примерам.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("goalLine1").textContent = step.goal[0];
      $("goalLine2").textContent = step.goal[1];
      $("goalLine3").textContent = step.goal[2];
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Интерактивная визуализация: когда правило известно, мы программируем явно; когда правило слишком сложное, переходим к обучению на примерах.</figcaption>
</figure>

## Почему одной формулы часто недостаточно

Даже задача с поездкой в реальности сложнее, чем кажется. По формуле можно оценить время движения:

$$t = \frac{S}{v}$$

Но в реальной жизни время зависит не только от расстояния и средней скорости. Есть пробки, погода, остановки, качество дороги, светофоры, стиль водителя и множество других факторов. Формально мы могли бы записать:

$$t = f(S, v, \text{пробки}, \text{погода}, \text{остановки}, \ldots)$$

Проблема в том, что функцию `f` обычно трудно написать руками. Но можно собрать много реальных поездок и дать модели возможность самой приблизить эту зависимость.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="480" viewBox="0 0 900 480">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      fill: #111111;
    }
    .subtitle {
      font-size: 15px;
      fill: #111111;
      opacity: 0.75;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
      rx: 14;
    }
    .step-top {
      font-size: 14px;
      font-weight: 700;
      fill: #3576C0;
    }
    .step-bottom {
      font-size: 13px;
      fill: #111111;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 700;
      fill: #111111;
    }
    .text {
      font-size: 16px;
      fill: #111111;
    }
    .small {
      font-size: 13px;
      fill: #111111;
      opacity: 0.78;
    }
    .formula {
      font-size: 22px;
      font-weight: 700;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 700;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 700;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <!-- Header -->
  <text id="mainTitle" x="32" y="42" class="title">Упс, Хюстон у нас проблемы</text>
  <text id="mainSubtitle" x="32" y="70" class="subtitle"></text>
  <rect x="668" y="20" width="190" height="58" class="step-pill" />
  <text id="stepCounter" x="688" y="43" class="step-top">Шаг 1</text>
  <text id="stepName" x="688" y="65" class="step-bottom">Вопрос</text>
  <!-- Scene -->
  <rect x="32" y="100" width="826" height="280" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="542" y="415" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="593" y="434" class="btn-text-disabled">← Назад</text>
  <text id="bottomCounter" x="696" y="435" class="formula center">1 / 2</text>
  <rect id="nextBtn" x="756" y="415" width="102" height="38" class="btn" />
  <text x="807" y="434" class="btn-text">Вперёд →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Упс, Хюстон у нас проблемы",
        subtitle: "",
        counter: "Шаг 1",
        name: "Вопрос",
        scene: `
          <text x="445" y="215" class="title center">Но идеально ли движение?</text>
          <text x="445" y="265" class="text center">Достаточно ли только формулы t = S / v?</text>
        `
      },
      {
        title: "Шаг 2. Реальная задача",
        subtitle: "В реальной жизни факторов обычно больше, чем S и v",
        counter: "Шаг 2 из 2",
        name: "Ответ",
        scene: `
          <text x="445" y="145" class="title center">Нет, в реальности всё сложнее</text>
          <text x="445" y="190" class="text center">Время зависит не только от расстояния и скорости.</text>
          <rect x="120" y="230" width="120" height="54" class="node-red" />
          <text x="180" y="257" class="node-bold center">Пробки</text>
          <rect x="280" y="230" width="120" height="54" class="node-red" />
          <text x="340" y="257" class="node-bold center">Погода</text>
          <rect x="440" y="230" width="120" height="54" class="node-red" />
          <text x="500" y="257" class="node-bold center">Остановки</text>
          <rect x="600" y="230" width="120" height="54" class="node-red" />
          <text x="660" y="257" class="node-bold center">Дорога</text>
          <text x="445" y="335" class="formula center">t = f(S, v, пробки, погода, ...)</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = step.counter;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Интерактивный блок: почему простая формула ломается, когда в задаче появляются реальные факторы.</figcaption>
</figure>

## Как обучается машина?

Слово «обучение» здесь не просто метафора, но важно понимать: машина не учится как человек в полном смысле слова. Математически обучение — это подбор параметров модели так, чтобы ошибка на обучающих примерах стала меньше.

У модели есть «настраиваемые ручки» — параметры. Сначала они могут быть случайными. Модель делает предсказание, мы сравниваем его с правильным ответом, считаем ошибку и немного меняем параметры в сторону уменьшения ошибки. Потом повторяем это снова и снова.

Упрощённо цикл выглядит так:

1. дать модели данные;
2. получить предсказание;
3. посчитать ошибку;
4. обновить параметры;
5. повторить много раз.

После тысяч, миллионов или миллиардов таких шагов модель начинает лучше обобщать закономерности из данных.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 21px;
      font-weight: 800;
      fill: #111111;
    }
    .subtitle {
      font-size: 14px;
      fill: #111111;
      opacity: 0.75;
    }
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
      rx: 14;
    }
    .step-top {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
    }
    .step-bottom {
      font-size: 13px;
      font-weight: 700;
      fill: #111111;
    }
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
    }
    .scene-title {
      font-size: 16px;
      font-weight: 800;
      fill: #111111;
    }
    .node-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 800;
      fill: #111111;
    }
    .small {
      font-size: 12px;
      fill: #111111;
      opacity: 0.78;
    }
    .formula {
      font-size: 24px;
      font-weight: 800;
      fill: #111111;
    }
    .formula-small {
      font-size: 18px;
      font-weight: 800;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .arrow {
      stroke: #3576C0;
      stroke-width: 2.2;
      fill: none;
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
    }
    .table-box {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      rx: 8;
    }
    .table-line {
      stroke: #3576C0;
      stroke-width: 1.1;
      stroke-opacity: 0.35;
    }
    .table-head {
      font-size: 13px;
      font-weight: 800;
      fill: #3576C0;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .table-cell {
      font-size: 13px;
      fill: #111111;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Шаг 1. У модели есть примеры</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">Модель учится на поездках, где уже известен правильный ответ</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Шаг 1 из 8</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Данные</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Дано</text>
  <text id="dataLine1" x="50" y="150" class="left-text">много поездок</text>
  <text id="dataLine2" x="50" y="176" class="left-text">есть факторы</text>
  <text id="dataLine3" x="50" y="202" class="left-text">известно реальное t</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Цель</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Показать, как</text>
  <text id="goalLine2" x="50" y="344" class="left-text">модель учится</text>
  <text id="goalLine3" x="50" y="372" class="left-text">шаг за шагом</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Назад</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 8</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Вперёд →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Шаг 1. У модели есть примеры",
        subtitle: "Модель учится на поездках, где уже известен правильный ответ",
        name: "Данные",
        data: [
          "много поездок",
          "есть факторы",
          "известно реальное t"
        ],
        goal: [
          "Показать, как",
          "модель учится",
          "шаг за шагом",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Обучающие данные</text>
          <rect x="340" y="165" width="490" height="190" class="table-box" />
          <line x1="340" y1="205" x2="830" y2="205" class="table-line" />
          <line x1="340" y1="245" x2="830" y2="245" class="table-line" />
          <line x1="340" y1="285" x2="830" y2="285" class="table-line" />
          <line x1="340" y1="325" x2="830" y2="325" class="table-line" />
          <line x1="420" y1="165" x2="420" y2="355" class="table-line" />
          <line x1="500" y1="165" x2="500" y2="355" class="table-line" />
          <line x1="600" y1="165" x2="600" y2="355" class="table-line" />
          <line x1="710" y1="165" x2="710" y2="355" class="table-line" />
          <text x="380" y="185" class="table-head">S</text>
          <text x="460" y="185" class="table-head">v</text>
          <text x="550" y="185" class="table-head">пробки</text>
          <text x="655" y="185" class="table-head">погода</text>
          <text x="770" y="185" class="table-head">реальное t</text>
          <text x="380" y="225" class="table-cell">10</text>
          <text x="460" y="225" class="table-cell">1</text>
          <text x="550" y="225" class="table-cell">нет</text>
          <text x="655" y="225" class="table-cell">ясно</text>
          <text x="770" y="225" class="table-cell">10</text>
          <text x="380" y="265" class="table-cell">10</text>
          <text x="460" y="265" class="table-cell">1</text>
          <text x="550" y="265" class="table-cell">да</text>
          <text x="655" y="265" class="table-cell">ясно</text>
          <text x="770" y="265" class="table-cell">12</text>
          <text x="380" y="305" class="table-cell">10</text>
          <text x="460" y="305" class="table-cell">1</text>
          <text x="550" y="305" class="table-cell">да</text>
          <text x="655" y="305" class="table-cell">дождь</text>
          <text x="770" y="305" class="table-cell">14</text>
          <text x="380" y="345" class="table-cell">8</text>
          <text x="460" y="345" class="table-cell">1</text>
          <text x="550" y="345" class="table-cell">нет</text>
          <text x="655" y="345" class="table-cell">дождь</text>
          <text x="770" y="345" class="table-cell">9</text>
          <text x="584" y="405" class="left-text center">Каждая строка — это пример: условия поездки и правильный ответ.</text>
        `
      },
      {
        title: "Шаг 2. Модель сначала не знает правило",
        subtitle: "Она начинает с грубого предположения",
        name: "Первое предположение",
        data: [
          "есть строка данных",
          "правильный t = 14",
          "модель ещё не обучена"
        ],
        goal: [
          "Показать, что",
          "модель сначала",
          "ошибается",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Берём один пример из таблицы</text>
          <rect x="330" y="185" width="170" height="90" class="node-blue" />
          <text x="415" y="213" class="node-bold center">Пример</text>
          <text x="415" y="238" class="small center">S=10, v=1</text>
          <text x="415" y="258" class="small center">пробки + дождь</text>
          <path d="M512 230 L565 230" class="arrow" />
          <rect x="578" y="180" width="150" height="100" class="node-yellow" />
          <text x="653" y="210" class="node-bold center">Модель</text>
          <text x="653" y="238" class="small center">пока не знает</text>
          <text x="653" y="258" class="small center">точную связь</text>
          <path d="M740 230 L790 230" class="arrow" />
          <rect x="802" y="185" width="50" height="90" class="node-green" />
          <text x="827" y="213" class="node-bold center">t</text>
          <text x="827" y="240" class="small center">?</text>
          <text x="584" y="360" class="formula-small center">Первый прогноз может быть неточным</text>
          <text x="584" y="400" class="left-text center">Например, модель говорит: t ≈ 11, а правильный ответ 14.</text>
        `
      },
      {
        title: "Шаг 3. Модель делает прогноз",
        subtitle: "Она пробует предсказать ответ для выбранной строки",
        name: "Прогноз",
        data: [
          "пример: пробки + дождь",
          "реальное t = 14",
          "прогноз t ≈ 11"
        ],
        goal: [
          "Сравнить",
          "прогноз модели",
          "с реальным ответом",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Модель пробует ответить</text>
          <rect x="330" y="205" width="145" height="76" class="node-blue" />
          <text x="402.5" y="233" class="node-bold center">Факторы</text>
          <text x="402.5" y="258" class="small center">S, v, пробки, дождь</text>
          <path d="M488 243 L545 243" class="arrow" />
          <rect x="558" y="198" width="140" height="90" class="node-yellow" />
          <text x="628" y="230" class="node-bold center">Модель</text>
          <text x="628" y="258" class="small center">делает прогноз</text>
          <path d="M710 243 L760 243" class="arrow" />
          <rect x="772" y="205" width="80" height="76" class="node-green" />
          <text x="812" y="233" class="node-bold center">Прогноз</text>
          <text x="812" y="260" class="formula-small center">11</text>
          <text x="584" y="358" class="formula-small center">Прогноз модели: 11</text>
          <text x="584" y="398" class="left-text center">Но в обучающих данных правильный ответ для этой строки: 14.</text>
        `
      },
      {
        title: "Шаг 4. Модель видит ошибку",
        subtitle: "Она сравнивает прогноз с правильным ответом",
        name: "Ошибка",
        data: [
          "прогноз t ≈ 11",
          "реальное t = 14",
          "есть ошибка"
        ],
        goal: [
          "Показать идею",
          "ошибки без",
          "сложной математики",
          ""
        ],
  scene: `
  <text x="328" y="130" class="scene-title">Сравнение прогноза и правильного ответа</text>
  <rect x="350" y="195" width="170" height="90" class="node-green" />
  <text x="435" y="225" class="node-bold center">Прогноз</text>
  <text x="435" y="255" class="formula-small center">11</text>
  <rect x="635" y="195" width="185" height="90" class="node-blue" />
  <text x="727.5" y="220" class="node-bold center">Правильный</text>
  <text x="727.5" y="242" class="node-bold center">ответ</text>
  <text x="727.5" y="267" class="formula-small center">14</text>
  <path d="M535 240 L620 240" class="arrow-red" />
  <text x="584" y="345" class="formula-small center">Ошибка: прогноз ниже реального ответа</text>
  <text x="584" y="390" class="left-text center">Модель понимает направление: для таких условий время надо увеличить.</text>
`
      },
      {
        title: "Шаг 5. Модель немного исправляется",
        subtitle: "Она меняет своё правило так, чтобы в следующий раз ошибиться меньше",
        name: "Обновление",
        data: [
          "ошибка найдена",
          "модель меняется",
          "прогноз становится лучше"
        ],
        goal: [
          "Показать, что",
          "обучение — это",
          "постепенная правка",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">После ошибки модель обновляет своё правило</text>
          <rect x="330" y="200" width="145" height="86" class="node-red" />
          <text x="402.5" y="228" class="node-bold center">Ошибка</text>
          <text x="402.5" y="255" class="small center">прогноз был мал</text>
          <path d="M488 243 L545 243" class="arrow-red" />
          <rect x="558" y="190" width="150" height="106" class="node-yellow" />
          <text x="633" y="220" class="node-bold center">Модель</text>
          <text x="633" y="248" class="small center">немного меняет</text>
          <text x="633" y="270" class="small center">своё правило</text>
          <path d="M720 243 L775 243" class="arrow" />
          <rect x="788" y="200" width="64" height="86" class="node-green" />
          <text x="820" y="228" class="node-bold center">Лучше</text>
          <text x="820" y="255" class="small center">прогноз</text>
          <text x="584" y="365" class="formula-small center">Было: t ≈ 11 → стало: t ≈ 12</text>
          <text x="584" y="405" class="left-text center">Это ещё не идеально, но ошибка стала меньше.</text>
        `
      },
      {
        title: "Шаг 6. Так повторяется много раз",
        subtitle: "Модель проходит по большому количеству примеров",
        name: "Повторение",
        data: [
          "пример за примером",
          "ошибка за ошибкой",
          "модель улучшается"
        ],
        goal: [
          "Показать цикл",
          "обучения модели",
          "на многих строках",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Обучение — это повторение одного цикла</text>
          <rect x="330" y="200" width="120" height="70" class="node-blue" />
          <text x="390" y="226" class="node-bold center">Пример</text>
          <text x="390" y="250" class="small center">из данных</text>
          <path d="M462 235 L510 235" class="arrow" />
          <rect x="522" y="200" width="120" height="70" class="node-yellow" />
          <text x="582" y="226" class="node-bold center">Прогноз</text>
          <text x="582" y="250" class="small center">модели</text>
          <path d="M654 235 L702 235" class="arrow" />
          <rect x="714" y="200" width="120" height="70" class="node-red" />
          <text x="774" y="226" class="node-bold center">Ошибка</text>
          <text x="774" y="250" class="small center">сравнение</text>
          <path d="M774 285 C750 330, 410 330, 390 285" class="arrow" />
          <text x="584" y="370" class="formula-small center">Пример → прогноз → ошибка → исправление</text>
          <text x="584" y="410" class="left-text center">Чем больше хороших примеров, тем лучше модель находит закономерность.</text>
        `
      },
      {
        title: "Шаг 7. После обучения модель понимает связь",
        subtitle: "Не идеально, но уже полезно для новых ситуаций",
        name: "Обученная модель",
        data: [
          "много примеров",
          "ошибки уменьшены",
          "модель обучена"
        ],
        goal: [
          "Показать итог",
          "обучения без",
          "углубления внутрь",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Что модель примерно поняла?</text>
          <rect x="330" y="190" width="140" height="72" class="node-blue" />
          <text x="400" y="218" class="node-bold center">S и v</text>
          <text x="400" y="242" class="small center">базовое время</text>
          <rect x="510" y="190" width="140" height="72" class="node-red" />
          <text x="580" y="218" class="node-bold center">Пробки</text>
          <text x="580" y="242" class="small center">увеличивают t</text>
          <rect x="690" y="190" width="140" height="72" class="node-red" />
          <text x="760" y="218" class="node-bold center">Дождь</text>
          <text x="760" y="242" class="small center">тоже влияет</text>
          <text x="584" y="330" class="formula-small center">Модель выучила не одну формулу, а зависимость</text>
          <text x="584" y="375" class="left-text center">Она примерно понимает: при пробках и дожде время обычно больше.</text>
          <text x="584" y="405" class="left-text center">Это знание появилось из данных, а не из ручного if-else.</text>
        `
      },
      {
        title: "Шаг 8. Теперь можно предсказывать",
        subtitle: "Для новой поездки модель выдаёт прогноз времени",
        name: "Применение",
        data: [
          "новая поездка",
          "ответ неизвестен",
          "модель даёт прогноз"
        ],
        goal: [
          "Завершить цикл",
          "обучение →",
          "использование",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Используем обученную модель</text>
          <rect x="320" y="205" width="155" height="82" class="node-blue" />
          <text x="397.5" y="232" class="node-bold center">Новая поездка</text>
          <text x="397.5" y="257" class="small center">S, v, пробки, погода</text>
          <path d="M488 246 L545 246" class="arrow" />
          <rect x="558" y="198" width="145" height="96" class="node-yellow" />
          <text x="630.5" y="228" class="node-bold center">Обученная</text>
          <text x="630.5" y="253" class="node-bold center">модель</text>
          <path d="M716 246 L775 246" class="arrow" />
          <rect x="788" y="205" width="64" height="82" class="node-green" />
          <text x="820" y="232" class="node-bold center">t</text>
          <text x="820" y="257" class="small center">прогноз</text>
          <text x="584" y="360" class="formula-small center">Новые данные + обученная модель → прогноз</text>
          <text x="584" y="405" class="left-text center">Так ML заменяет большое количество ручных правил.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("dataLine1").textContent = step.data[0] || "";
      $("dataLine2").textContent = step.data[1] || "";
      $("dataLine3").textContent = step.data[2] || "";
      $("goalLine1").textContent = step.goal[0] || "";
      $("goalLine2").textContent = step.goal[1] || "";
      $("goalLine3").textContent = step.goal[2] || "";
      $("goalLine4").textContent = step.goal[3] || "";
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Интерактивная визуализация: модель получает примеры, ошибается, корректирует параметры и постепенно улучшает предсказание.</figcaption>
</figure>

Самый простой пример — линейная регрессия. Есть точки на графике, и модель пытается провести через них линию. Линия задаётся двумя параметрами: наклоном и смещением.

$$\hat y = w \cdot x + b$$

Сначала линия стоит почти случайно, поэтому ошибка большая. Затем модель меняет `w` и `b`, линия постепенно поворачивается и сдвигается ближе к точкам. Это и есть обучение в самой простой форме.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 21px;
      font-weight: 800;
      fill: #111111;
    }
    .subtitle {
      font-size: 14px;
      fill: #111111;
      opacity: 0.75;
    }
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
      rx: 14;
    }
    .step-top {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
    }
    .step-bottom {
      font-size: 13px;
      font-weight: 700;
      fill: #111111;
    }
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
    }
    .scene-title {
      font-size: 16px;
      font-weight: 800;
      fill: #111111;
    }
    .node-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 800;
      fill: #111111;
    }
    .small {
      font-size: 12px;
      fill: #111111;
      opacity: 0.78;
    }
    .formula {
      font-size: 24px;
      font-weight: 800;
      fill: #111111;
    }
    .formula-small {
      font-size: 18px;
      font-weight: 800;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .arrow {
      stroke: #3576C0;
      stroke-width: 2.2;
      fill: none;
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
    }
    .route {
      stroke: #3576C0;
      stroke-width: 3.3;
      fill: none;
      stroke-linecap: round;
    }
    .dot {
      fill: #3576C0;
    }
    .table-box {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      rx: 8;
    }
    .table-line {
      stroke: #3576C0;
      stroke-width: 1.1;
      stroke-opacity: 0.35;
    }
    .table-head {
      font-size: 13px;
      font-weight: 800;
      fill: #3576C0;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .table-cell {
      font-size: 13px;
      fill: #111111;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Шаг 1. Реальная задача сложнее</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">Время зависит не только от расстояния и скорости</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Шаг 1 из 7</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Дополнительные факторы</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Дано</text>
  <text id="dataLine1" x="50" y="150" class="left-text">S = 10 км</text>
  <text id="dataLine2" x="50" y="176" class="left-text">v = 1 км/ч</text>
  <text id="dataLine3" x="50" y="202" class="left-text">есть доп. факторы</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Цель</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Понять, почему</text>
  <text id="goalLine2" x="50" y="344" class="left-text">обычных правил</text>
  <text id="goalLine3" x="50" y="372" class="left-text">становится мало</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Назад</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 7</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Вперёд →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Шаг 1. Реальная задача сложнее",
        subtitle: "Время зависит не только от расстояния и скорости",
        name: "Дополнительные факторы",
        data: [
          "S = 10 км",
          "v = 1 км/ч",
          "есть доп. факторы"
        ],
        goal: [
          "Понять, почему",
          "обычных правил",
          "становится мало",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">В реальности формулы t = S / v уже мало</text>
          <rect x="340" y="190" width="110" height="54" class="node-blue" />
          <text x="395" y="217" class="node-bold center">S, v</text>
          <rect x="480" y="190" width="110" height="54" class="node-red" />
          <text x="535" y="217" class="node-bold center">Пробки</text>
          <rect x="620" y="190" width="110" height="54" class="node-red" />
          <text x="675" y="217" class="node-bold center">Погода</text>
          <rect x="760" y="190" width="90" height="54" class="node-red" />
          <text x="805" y="217" class="node-bold center">Дорога</text>
          <text x="584" y="310" class="formula-small center">t = f(S, v, пробки, погода, дорога, ...)</text>
          <text x="584" y="360" class="left-text center">Чем больше факторов, тем труднее вручную описать все случаи.</text>
        `
      },
      {
        title: "Шаг 2. Можно писать правила вручную",
        subtitle: "Но количество условий быстро растёт",
        name: "Много if-else",
        data: [
          "S = 10 км",
          "v = 1 км/ч",
          "пробки, дождь, дорога"
        ],
        goal: [
          "Показать, что",
          "ручные правила",
          "быстро усложняются",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Попробуем решить через explicit programming</text>
          <rect x="350" y="175" width="460" height="170" class="node-blue" />
          <text x="380" y="215" class="small">если пробки сильные → добавить 40 минут</text>
          <text x="380" y="245" class="small">если дождь → добавить 15 минут</text>
          <text x="380" y="275" class="small">если плохая дорога → добавить 20 минут</text>
          <text x="380" y="305" class="small">если час пик и дождь → добавить ещё ...</text>
          <text x="584" y="390" class="formula-small center">Правил становится всё больше</text>
        `
      },
      {
        title: "Шаг 3. Правила начинают конфликтовать",
        subtitle: "Один фактор может усиливать или ослаблять другой",
        name: "Сложные комбинации",
        data: [
          "S = 10 км",
          "v = 1 км/ч",
          "много комбинаций"
        ],
        goal: [
          "Понять проблему",
          "комбинаций между",
          "факторами",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Проблема не только в количестве факторов</text>
          <rect x="330" y="185" width="130" height="58" class="node-red" />
          <text x="395" y="214" class="node-bold center">Дождь</text>
          <rect x="515" y="185" width="130" height="58" class="node-red" />
          <text x="580" y="214" class="node-bold center">Час пик</text>
          <rect x="700" y="185" width="130" height="58" class="node-red" />
          <text x="765" y="214" class="node-bold center">Ремонт</text>
          <path d="M462 214 L503 214" class="arrow-red" />
          <path d="M647 214 L688 214" class="arrow-red" />
          <text x="584" y="310" class="left-text center">Факторы работают не отдельно, а вместе.</text>
          <text x="584" y="345" class="left-text center">Например, дождь + час пик может увеличить время сильнее,</text>
          <text x="584" y="380" class="left-text center">чем каждый фактор по отдельности.</text>
        `
      },
      {
        title: "Шаг 4. Вместо правил можно собрать данные",
        subtitle: "Каждая поездка становится примером для обучения",
        name: "Исторические данные",
        data: [
          "много поездок",
          "известны факторы",
          "известно реальное t"
        ],
        goal: [
          "Заменить ручные",
          "правила большим",
          "набором примеров",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Собираем реальные примеры</text>
          <rect x="340" y="165" width="480" height="190" class="table-box" />
          <line x1="340" y1="205" x2="820" y2="205" class="table-line" />
          <line x1="340" y1="245" x2="820" y2="245" class="table-line" />
          <line x1="340" y1="285" x2="820" y2="285" class="table-line" />
          <line x1="340" y1="325" x2="820" y2="325" class="table-line" />
          <line x1="430" y1="165" x2="430" y2="355" class="table-line" />
          <line x1="520" y1="165" x2="520" y2="355" class="table-line" />
          <line x1="620" y1="165" x2="620" y2="355" class="table-line" />
          <line x1="720" y1="165" x2="720" y2="355" class="table-line" />
          <text x="385" y="185" class="table-head">S</text>
          <text x="475" y="185" class="table-head">v</text>
          <text x="570" y="185" class="table-head">пробки</text>
          <text x="670" y="185" class="table-head">погода</text>
          <text x="770" y="185" class="table-head">t</text>
          <text x="385" y="225" class="table-cell">10</text>
          <text x="475" y="225" class="table-cell">1</text>
          <text x="570" y="225" class="table-cell">нет</text>
          <text x="670" y="225" class="table-cell">ясно</text>
          <text x="770" y="225" class="table-cell">10</text>
          <text x="385" y="265" class="table-cell">10</text>
          <text x="475" y="265" class="table-cell">1</text>
          <text x="570" y="265" class="table-cell">да</text>
          <text x="670" y="265" class="table-cell">ясно</text>
          <text x="770" y="265" class="table-cell">12</text>
          <text x="385" y="305" class="table-cell">10</text>
          <text x="475" y="305" class="table-cell">1</text>
          <text x="570" y="305" class="table-cell">да</text>
          <text x="670" y="305" class="table-cell">дождь</text>
          <text x="770" y="305" class="table-cell">14</text>
          <text x="385" y="345" class="table-cell">8</text>
          <text x="475" y="345" class="table-cell">1</text>
          <text x="570" y="345" class="table-cell">нет</text>
          <text x="670" y="345" class="table-cell">дождь</text>
          <text x="770" y="345" class="table-cell">9</text>
          <text x="584" y="400" class="left-text center">Теперь ответ берётся из реального опыта, а не из ручных правил.</text>
        `
      },
      {
        title: "Шаг 5. Модель ищет закономерности",
        subtitle: "Она учится на примерах, где уже известен правильный ответ",
        name: "Обучение",
        data: [
          "факторы поездки",
          "реальное время",
          "много примеров"
        ],
        goal: [
          "Показать, что",
          "модель учится",
          "не формуле, а связи",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Модель обучается на исторических данных</text>
          <rect x="330" y="210" width="150" height="76" class="node-blue" />
          <text x="405" y="238" class="node-bold center">Данные</text>
          <text x="405" y="264" class="small center">S, v, факторы, t</text>
          <path d="M492 248 L550 248" class="arrow" />
          <rect x="562" y="200" width="150" height="96" class="node-yellow" />
          <text x="637" y="230" class="node-bold center">Модель</text>
          <text x="637" y="258" class="small center">ищет связь</text>
          <text x="637" y="278" class="small center">между факторами</text>
          <path d="M724 248 L780 248" class="arrow" />
          <rect x="792" y="210" width="60" height="76" class="node-green" />
          <text x="822" y="238" class="node-bold center">t</text>
          <text x="822" y="264" class="small center">ответ</text>
          <text x="584" y="360" class="formula-small center">ML: данные + ответы → модель</text>
          <text x="584" y="400" class="left-text center">Модель сама подбирает зависимость по примерам.</text>
        `
      },
      {
        title: "Шаг 6. Потом модель делает прогноз",
        subtitle: "Для новой поездки правильный ответ заранее неизвестен",
        name: "Предсказание",
        data: [
          "новая поездка",
          "есть факторы",
          "t неизвестно"
        ],
        goal: [
          "Показать, как",
          "обученная модель",
          "используется дальше",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Используем модель на новой ситуации</text>
          <rect x="320" y="210" width="160" height="76" class="node-blue" />
          <text x="400" y="238" class="node-bold center">Новые данные</text>
          <text x="400" y="264" class="small center">S, v, пробки, погода</text>
          <path d="M492 248 L550 248" class="arrow" />
          <rect x="562" y="200" width="150" height="96" class="node-yellow" />
          <text x="637" y="230" class="node-bold center">Модель</text>
          <text x="637" y="258" class="small center">уже обучена</text>
          <path d="M724 248 L780 248" class="arrow" />
          <rect x="792" y="210" width="60" height="76" class="node-green" />
          <text x="822" y="238" class="node-bold center">t</text>
          <text x="822" y="264" class="small center">прогноз</text>
          <text x="584" y="360" class="formula-small center">Новые данные + модель → прогноз</text>
          <text x="584" y="400" class="left-text center">Модель не знает будущее, но оценивает его по прошлому опыту.</text>
        `
      },
      {
        title: "Шаг 7. Почему здесь нужен ML",
        subtitle: "ML полезен, когда зависимость сложная, но есть много примеров",
        name: "Вывод",
        data: [
          "много факторов",
          "много примеров",
          "нужен прогноз"
        ],
        goal: [
          "Сформулировать",
          "главную причину",
          "использования ML",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Когда ML подходит лучше ручных правил?</text>
          <rect x="330" y="180" width="150" height="70" class="node-red" />
          <text x="405" y="210" class="node-bold center">Много</text>
          <text x="405" y="233" class="small center">факторов</text>
          <rect x="505" y="180" width="150" height="70" class="node-yellow" />
          <text x="580" y="210" class="node-bold center">Сложная</text>
          <text x="580" y="233" class="small center">зависимость</text>
          <rect x="680" y="180" width="150" height="70" class="node-green" />
          <text x="755" y="210" class="node-bold center">Есть</text>
          <text x="755" y="233" class="small center">история данных</text>
          <text x="584" y="320" class="formula-small center">ML нужен, когда правило трудно написать вручную,</text>
          <text x="584" y="360" class="formula-small center">но можно показать много примеров.</text>
          <text x="584" y="410" class="left-text center">Модель учится на прошлом и делает прогноз для новых случаев.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("dataLine1").textContent = step.data[0] || "";
      $("dataLine2").textContent = step.data[1] || "";
      $("dataLine3").textContent = step.data[2] || "";
      $("goalLine1").textContent = step.goal[0] || "";
      $("goalLine2").textContent = step.goal[1] || "";
      $("goalLine3").textContent = step.goal[2] || "";
      $("goalLine4").textContent = step.goal[3] || "";
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Интерактивная визуализация: как модель шаг за шагом подбирает параметры линии и уменьшает ошибку.</figcaption>
</figure>

## Как компьютер видит мир?

У компьютера нет глаз в человеческом смысле. Картинка для него — это таблица чисел. В чёрно-белом изображении каждый пиксель можно представить одним числом: 0 — чёрный, 255 — белый, значения между ними — разные оттенки серого.

У цветной картинки обычно три канала: R, G и B. То есть каждый пиксель хранит три числа: сколько в нём красного, зелёного и синего цвета.

Компьютер не видит «кота» сразу. На входе у него только сетка чисел. Задача компьютерного зрения — научить модель находить в этой сетке такие комбинации пикселей, которые соответствуют осмысленным объектам: лицам, машинам, буквам, медицинским снимкам или котикам.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 21px;
      font-weight: 800;
      fill: #111111;
    }
    .subtitle {
      font-size: 14px;
      fill: #111111;
      opacity: 0.75;
    }
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
      rx: 14;
    }
    .step-top {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
    }
    .step-bottom {
      font-size: 13px;
      font-weight: 700;
      fill: #111111;
    }
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
    }
    .scene-title {
      font-size: 16px;
      font-weight: 800;
      fill: #111111;
    }
    .node-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 800;
      fill: #111111;
    }
    .small {
      font-size: 12px;
      fill: #111111;
      opacity: 0.78;
    }
    .formula {
      font-size: 24px;
      font-weight: 800;
      fill: #111111;
    }
    .formula-small {
      font-size: 18px;
      font-weight: 800;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .arrow {
      stroke: #3576C0;
      stroke-width: 2.2;
      fill: none;
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
    }
    .pixel {
      stroke: #ffffff;
      stroke-width: 0.7;
    }
    .shape {
      fill: none;
      stroke: #3576C0;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .shape-green {
      fill: none;
      stroke: #73B222;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .shape-red {
      fill: none;
      stroke: #C30B0A;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .bar-blue {
      fill: #3576C0;
      opacity: 0.82;
    }
    .bar-green {
      fill: #73B222;
      opacity: 0.82;
    }
    .bar-yellow {
      fill: #C29E08;
      opacity: 0.82;
    }
    .bar-red {
      fill: #C30B0A;
      opacity: 0.82;
    }
    .num {
      font-family: "Courier New", Courier, monospace;
      font-size: 12px;
      fill: #111111;
    }
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Шаг 1. Компьютер получает картинку</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">Для компьютера изображение — это не объект, а набор чисел</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Шаг 1 из 7</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Пиксели</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Дано</text>
  <text id="dataLine1" x="50" y="150" class="left-text">изображение</text>
  <text id="dataLine2" x="50" y="176" class="left-text">сетка пикселей</text>
  <text id="dataLine3" x="50" y="202" class="left-text">числа 0–255</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Цель</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Понять, как</text>
  <text id="goalLine2" x="50" y="344" class="left-text">компьютер</text>
  <text id="goalLine3" x="50" y="372" class="left-text">видит картинку</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Назад</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 7</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Вперёд →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Шаг 1. Компьютер получает картинку",
        subtitle: "Для компьютера изображение — это не объект, а набор чисел",
        name: "Пиксели",
        data: [
  "изображение",
  "пиксели RGB",
  "числа 0–255"
],
      goal: [
  "Понять, что",
  "картинка для",
  "компьютера — числа",
  ""
],
        scene: `
  <text x="328" y="130" class="scene-title">Цветная картинка для компьютера — это три канала</text>
  <!-- RGB пиксельная картинка -->
  <g transform="translate(325,175)">
    <rect x="0" y="0" width="24" height="24" class="pixel" fill="#F4B6A6"/>
    <rect x="24" y="0" width="24" height="24" class="pixel" fill="#F0C86A"/>
    <rect x="48" y="0" width="24" height="24" class="pixel" fill="#E9D86A"/>
    <rect x="72" y="0" width="24" height="24" class="pixel" fill="#F0C86A"/>
    <rect x="96" y="0" width="24" height="24" class="pixel" fill="#F4B6A6"/>
    <rect x="0" y="24" width="24" height="24" class="pixel" fill="#D98A62"/>
    <rect x="24" y="24" width="24" height="24" class="pixel" fill="#C29E08"/>
    <rect x="48" y="24" width="24" height="24" class="pixel" fill="#73B222"/>
    <rect x="72" y="24" width="24" height="24" class="pixel" fill="#C29E08"/>
    <rect x="96" y="24" width="24" height="24" class="pixel" fill="#D98A62"/>
    <rect x="0" y="48" width="24" height="24" class="pixel" fill="#3576C0"/>
    <rect x="24" y="48" width="24" height="24" class="pixel" fill="#73B222"/>
    <rect x="48" y="48" width="24" height="24" class="pixel" fill="#C30B0A"/>
    <rect x="72" y="48" width="24" height="24" class="pixel" fill="#73B222"/>
    <rect x="96" y="48" width="24" height="24" class="pixel" fill="#3576C0"/>
    <rect x="0" y="72" width="24" height="24" class="pixel" fill="#D98A62"/>
    <rect x="24" y="72" width="24" height="24" class="pixel" fill="#C29E08"/>
    <rect x="48" y="72" width="24" height="24" class="pixel" fill="#73B222"/>
    <rect x="72" y="72" width="24" height="24" class="pixel" fill="#C29E08"/>
    <rect x="96" y="72" width="24" height="24" class="pixel" fill="#D98A62"/>
    <rect x="0" y="96" width="24" height="24" class="pixel" fill="#F4B6A6"/>
    <rect x="24" y="96" width="24" height="24" class="pixel" fill="#F0C86A"/>
    <rect x="48" y="96" width="24" height="24" class="pixel" fill="#E9D86A"/>
    <rect x="72" y="96" width="24" height="24" class="pixel" fill="#F0C86A"/>
    <rect x="96" y="96" width="24" height="24" class="pixel" fill="#F4B6A6"/>
    <rect x="0" y="0" width="120" height="120" fill="none" stroke="#3576C0" stroke-width="2"/>
  </g>
  <text x="470" y="240" class="formula center">=</text>
  <!-- R -->
  <rect x="520" y="170" width="95" height="60" class="node-red" />
  <text x="567.5" y="194" class="node-bold center">R</text>
  <text x="567.5" y="216" class="small center">красный</text>
  <!-- G -->
  <rect x="640" y="170" width="95" height="60" class="node-green" />
  <text x="687.5" y="194" class="node-bold center">G</text>
  <text x="687.5" y="216" class="small center">зелёный</text>
  <!-- B -->
  <rect x="760" y="170" width="95" height="60" class="node-blue" />
  <text x="807.5" y="194" class="node-bold center">B</text>
  <text x="807.5" y="216" class="small center">синий</text>
  <text x="687.5" y="285" class="formula-small center">каждый пиксель = [R, G, B]</text>
  <text x="584" y="350" class="left-text center">Компьютер видит цветную картинку как три числовых слоя.</text>
  <text x="584" y="380" class="left-text center">Например, один пиксель может быть записан как [195, 11, 10].</text>
  <text x="584" y="410" class="left-text center">То есть сначала изображение — это не “кот”, а числа.</text>
`
      },
      {
        title: "Шаг 2. Цветная картинка — это несколько каналов",
        subtitle: "Каждый пиксель хранит три числа: R, G и B",
        name: "RGB",
        data: [
          "цветной пиксель",
          "R + G + B",
          "три матрицы"
        ],
        goal: [
          "Показать, что",
          "цвет — это тоже",
          "числа",
          ""
        ],
  scene: `
  <text x="328" y="130" class="scene-title">Цветная картинка складывается из трёх каналов</text>
  <text x="584" y="170" class="formula-small center">R + G + B = картинка</text>
  <!-- Верхний ряд -->
  <rect x="335" y="195" width="90" height="54" class="node-red" />
  <text x="380" y="218" class="node-bold center">R</text>
  <text x="380" y="238" class="small center">красный</text>
  <text x="447" y="224" class="formula-small center">+</text>
  <rect x="470" y="195" width="90" height="54" class="node-green" />
  <text x="515" y="218" class="node-bold center">G</text>
  <text x="515" y="238" class="small center">зелёный</text>
  <text x="582" y="224" class="formula-small center">+</text>
  <rect x="605" y="195" width="90" height="54" class="node-blue" />
  <text x="650" y="218" class="node-bold center">B</text>
  <text x="650" y="238" class="small center">синий</text>
  <text x="717" y="224" class="formula-small center">=</text>
  <!-- Итоговая картинка -->
  <g transform="translate(750,190)">
    <rect x="0" y="0" width="22" height="22" class="pixel" fill="#F4B6A6"/>
    <rect x="22" y="0" width="22" height="22" class="pixel" fill="#F0C86A"/>
    <rect x="44" y="0" width="22" height="22" class="pixel" fill="#E9D86A"/>
    <rect x="0" y="22" width="22" height="22" class="pixel" fill="#3576C0"/>
    <rect x="22" y="22" width="22" height="22" class="pixel" fill="#73B222"/>
    <rect x="44" y="22" width="22" height="22" class="pixel" fill="#C30B0A"/>
    <rect x="0" y="44" width="22" height="22" class="pixel" fill="#D98A62"/>
    <rect x="22" y="44" width="22" height="22" class="pixel" fill="#C29E08"/>
    <rect x="44" y="44" width="22" height="22" class="pixel" fill="#73B222"/>
    <rect x="0" y="0" width="66" height="66" fill="none" stroke="#3576C0" stroke-width="2"/>
  </g>
  <!-- Нижние матрицы -->
  <!-- R matrix -->
  <text x="380" y="292" class="node-bold center">R</text>
  <rect x="330" y="305" width="100" height="85" class="node-red" />
  <text x="380" y="330" class="num center">195 240 233</text>
  <text x="380" y="352" class="num center">53 115 195</text>
  <text x="380" y="374" class="num center">217 194 115</text>
  <!-- G matrix -->
  <text x="515" y="292" class="node-bold center">G</text>
  <rect x="465" y="305" width="100" height="85" class="node-green" />
  <text x="515" y="330" class="num center">11 40 56</text>
  <text x="515" y="352" class="num center">118 178 11</text>
  <text x="515" y="374" class="num center">102 158 178</text>
  <!-- B matrix -->
  <text x="650" y="292" class="node-bold center">B</text>
  <rect x="600" y="305" width="100" height="85" class="node-blue" />
  <text x="650" y="330" class="num center">10 22 44</text>
  <text x="650" y="352" class="num center">192 34 10</text>
  <text x="650" y="374" class="num center">98 45 34</text>
  <text x="584" y="418" class="left-text center">Каждый канал — это отдельная матрица чисел.</text>
`
      },
      {
        title: "Шаг 3. Первые слои ищут простые признаки",
        subtitle: "Например, края, линии и контрасты",
        name: "Края",
        data: [
          "пиксели",
          "контрасты",
          "края и линии"
        ],
        goal: [
          "Показать, что",
          "модель сначала",
          "ищет простые формы",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">На первых слоях модель ищет края</text>
          <rect x="335" y="185" width="100" height="90" class="node-blue" />
          <line x1="355" y1="215" x2="415" y2="215" class="shape" />
          <line x1="355" y1="240" x2="415" y2="240" class="shape" />
          <text x="385" y="305" class="small center">горизонталь</text>
          <rect x="470" y="185" width="100" height="90" class="node-blue" />
          <line x1="500" y1="205" x2="500" y2="255" class="shape" />
          <line x1="540" y1="205" x2="540" y2="255" class="shape" />
          <text x="520" y="305" class="small center">вертикаль</text>
          <rect x="605" y="185" width="100" height="90" class="node-blue" />
          <line x1="625" y1="255" x2="685" y2="205" class="shape" />
          <text x="655" y="305" class="small center">наклон</text>
          <rect x="740" y="185" width="100" height="90" class="node-blue" />
          <line x1="760" y1="205" x2="820" y2="255" class="shape" />
          <line x1="820" y1="205" x2="760" y2="255" class="shape" />
          <text x="790" y="305" class="small center">угол</text>
          <text x="584" y="375" class="left-text center">Модель ещё не понимает “кот”. Она видит простые визуальные сигналы:</text>
          <text x="584" y="405" class="left-text center">границы, переходы цвета, линии и углы.</text>
        `
      },
      {
        title: "Шаг 4. Простые признаки собираются в формы",
        subtitle: "Линии и края начинают складываться в более понятные фигуры",
        name: "Формы",
        data: [
          "края и линии",
          "объединяются",
          "получаются формы"
        ],
        goal: [
          "Показать переход",
          "от краёв",
          "к формам",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Следующие слои собирают формы</text>
          <rect x="340" y="185" width="105" height="90" class="node-yellow" />
          <circle cx="392.5" cy="230" r="26" class="shape" />
          <text x="392.5" y="305" class="small center">круг</text>
          <rect x="485" y="185" width="105" height="90" class="node-yellow" />
          <rect x="515" y="205" width="45" height="45" class="shape" />
          <text x="537.5" y="305" class="small center">квадрат</text>
          <rect x="630" y="185" width="105" height="90" class="node-yellow" />
          <path d="M657 250 L682 205 L707 250 Z" class="shape" />
          <text x="682.5" y="305" class="small center">треугольник</text>
          <text x="584" y="370" class="formula-small center">края → формы</text>
          <text x="584" y="410" class="left-text center">Модель постепенно переходит от отдельных линий к простым частям картинки.</text>
        `
      },
      {
        title: "Шаг 5. Формы складываются в части объекта",
        subtitle: "Например: глаза, уши, нос, лапы",
        name: "Части",
        data: [
          "простые формы",
          "узоры",
          "части объекта"
        ],
        goal: [
          "Показать, как",
          "из форм появляются",
          "части объекта",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Более глубокие слои ищут части объекта</text>
          <rect x="330" y="185" width="105" height="90" class="node-green" />
          <path d="M382 203 L410 255 L354 255 Z" fill="none" stroke="#73B222" stroke-width="3"/>
          <text x="382.5" y="305" class="small center">ухо</text>
          <rect x="465" y="185" width="105" height="90" class="node-green" />
          <ellipse cx="517.5" cy="230" rx="28" ry="18" class="shape-green" />
          <circle cx="517.5" cy="230" r="7" fill="#73B222" />
          <text x="517.5" y="305" class="small center">глаз</text>
          <rect x="600" y="185" width="105" height="90" class="node-green" />
          <circle cx="652.5" cy="225" r="6" fill="#73B222" />
          <line x1="652.5" y1="225" x2="620" y2="210" class="shape-green" />
          <line x1="652.5" y1="225" x2="620" y2="240" class="shape-green" />
          <line x1="652.5" y1="225" x2="685" y2="210" class="shape-green" />
          <line x1="652.5" y1="225" x2="685" y2="240" class="shape-green" />
          <text x="652.5" y="305" class="small center">усы</text>
          <rect x="735" y="185" width="105" height="90" class="node-green" />
          <ellipse cx="787.5" cy="245" rx="26" ry="14" class="shape-green" />
          <circle cx="767" cy="220" r="6" fill="none" stroke="#73B222" stroke-width="3"/>
          <circle cx="787" cy="214" r="6" fill="none" stroke="#73B222" stroke-width="3"/>
          <circle cx="807" cy="220" r="6" fill="none" stroke="#73B222" stroke-width="3"/>
          <text x="787.5" y="305" class="small center">лапа</text>
          <text x="584" y="375" class="left-text center">Никто вручную не говорит модели: “вот это ухо”.</text>
          <text x="584" y="405" class="left-text center">При обучении она сама находит полезные признаки для распознавания.</text>
        `
      },
      {
        title: "Шаг 6. Части объекта дают общий ответ",
        subtitle: "Модель собирает признаки и оценивает, что изображено на картинке",
        name: "Классификация",
        data: [
          "части объекта",
          "собраны вместе",
          "модель даёт ответ"
        ],
        goal: [
          "Показать финал:",
          "из признаков",
          "получается класс",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Финальный слой даёт вероятности классов</text>
          <rect x="340" y="170" width="170" height="160" class="node-green" />
          <path d="M395 220 L410 190 L425 220" fill="none" stroke="#73B222" stroke-width="3"/>
          <path d="M430 220 L445 190 L460 220" fill="none" stroke="#73B222" stroke-width="3"/>
          <ellipse cx="427.5" cy="240" rx="45" ry="35" fill="none" stroke="#73B222" stroke-width="3"/>
          <circle cx="410" cy="235" r="4" fill="#111111"/>
          <circle cx="445" cy="235" r="4" fill="#111111"/>
          <path d="M420 252 Q428 260 436 252" fill="none" stroke="#73B222" stroke-width="2"/>
          <text x="425" y="305" class="node-bold center">признаки кота</text>
          <text x="570" y="190" class="left-text">кот</text>
          <rect x="630" y="176" width="190" height="18" rx="4" class="bar-green"/>
          <text x="830" y="190" class="small">0.93</text>
          <text x="570" y="230" class="left-text">собака</text>
          <rect x="630" y="216" width="36" height="18" rx="4" class="bar-blue"/>
          <text x="680" y="230" class="small">0.04</text>
          <text x="570" y="270" class="left-text">лиса</text>
          <rect x="630" y="256" width="20" height="18" rx="4" class="bar-yellow"/>
          <text x="660" y="270" class="small">0.02</text>
          <text x="570" y="310" class="left-text">другое</text>
          <rect x="630" y="296" width="10" height="18" rx="4" class="bar-red"/>
          <text x="650" y="310" class="small">0.01</text>
          <text x="584" y="390" class="formula-small center">Ответ модели: это похоже на кота</text>
          <text x="584" y="420" class="left-text center">Модель выбирает класс с наибольшей вероятностью.</text>
        `
      },
      {
        title: "Шаг 7. Полная логика зрения модели",
        subtitle: "От чисел к признакам, от признаков к объекту",
        name: "Полная схема",
        data: [
          "пиксели",
          "признаки",
          "объект"
        ],
        goal: [
          "Собрать всю",
          "логику в одну",
          "простую схему",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Как компьютер “видит” картинку</text>
          <rect x="320" y="190" width="90" height="70" class="node-blue" />
          <text x="365" y="215" class="node-bold center">Пиксели</text>
          <text x="365" y="240" class="small center">числа</text>
          <path d="M420 225 L460 225" class="arrow" />
          <rect x="472" y="190" width="90" height="70" class="node-yellow" />
          <text x="517" y="215" class="node-bold center">Края</text>
          <text x="517" y="240" class="small center">линии</text>
          <path d="M572 225 L612 225" class="arrow" />
          <rect x="624" y="190" width="90" height="70" class="node-yellow" />
          <text x="669" y="215" class="node-bold center">Части</text>
          <text x="669" y="240" class="small center">глаз, ухо</text>
          <path d="M724 225 L764 225" class="arrow" />
          <rect x="776" y="190" width="80" height="70" class="node-green" />
          <text x="816" y="215" class="node-bold center">Объект</text>
          <text x="816" y="240" class="small center">кот</text>
          <text x="584" y="335" class="formula-small center">пиксели → края → формы → части → объект</text>
          <text x="584" y="385" class="left-text center">Компьютер не видит “кота” сразу.</text>
          <text x="584" y="415" class="left-text center">Он постепенно строит всё более сложное описание картинки.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("dataLine1").textContent = step.data[0] || "";
      $("dataLine2").textContent = step.data[1] || "";
      $("dataLine3").textContent = step.data[2] || "";
      $("goalLine1").textContent = step.goal[0] || "";
      $("goalLine2").textContent = step.goal[1] || "";
      $("goalLine3").textContent = step.goal[2] || "";
      $("goalLine4").textContent = step.goal[3] || "";
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Интерактивная визуализация: изображение превращается в числовую матрицу, а дальше модель ищет в ней закономерности.</figcaption>
</figure>

## Как компьютер пишет тексты?

Текст для модели — тоже числа. Сначала фраза разбивается на токены: слова, части слов, знаки препинания или отдельные символы. Затем каждому токену присваивается числовой идентификатор.

Большая языковая модель обучается на огромном количестве текстов. Её базовая учебная задача очень простая: предсказать следующий токен по предыдущим.

Например, если модель видит начало фразы:

> Кошка сидит на ...

она должна оценить, какой токен вероятнее всего будет следующим: «диване», «окне», «стуле», «полу» и так далее.

Делая это миллиарды раз, модель учится грамматике, стилю, фактам, типичным рассуждениям и структуре языка. Когда мы просим её написать ответ, она продолжает тот же процесс: оценивает вероятности следующих токенов и генерирует текст шаг за шагом.

Важно: LLM не достаёт готовый ответ из базы данных как поисковик. Она строит продолжение текста на основе вероятностей. Поэтому такие модели могут звучать убедительно, но иногда ошибаться. Их нужно проверять, особенно в фактах, цифрах, законах, медицине и технических деталях.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 21px;
      font-weight: 800;
      fill: #111111;
    }
    .subtitle {
      font-size: 14px;
      fill: #111111;
      opacity: 0.75;
    }
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
      rx: 14;
    }
    .step-top {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
    }
    .step-bottom {
      font-size: 13px;
      font-weight: 700;
      fill: #111111;
    }
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
    }
    .scene-title {
      font-size: 16px;
      font-weight: 800;
      fill: #111111;
    }
    .node-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 800;
      fill: #111111;
    }
    .small {
      font-size: 12px;
      fill: #111111;
      opacity: 0.78;
    }
    .formula {
      font-size: 24px;
      font-weight: 800;
      fill: #111111;
    }
    .formula-small {
      font-size: 18px;
      font-weight: 800;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .arrow {
      stroke: #3576C0;
      stroke-width: 2.2;
      fill: none;
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
    }
    .token-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.5;
      rx: 7;
    }
    .token-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.5;
      rx: 7;
    }
    .token-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.5;
      rx: 7;
    }
    .token-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.5;
      rx: 7;
    }
    .bar-blue {
      fill: #3576C0;
      opacity: 0.82;
    }
    .bar-yellow {
      fill: #C29E08;
      opacity: 0.82;
    }
    .bar-red {
      fill: #C30B0A;
      opacity: 0.82;
    }
    .bar-green {
      fill: #73B222;
      opacity: 0.82;
    }
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Шаг 1. Пользователь вводит текст</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">LLM получает начало фразы и должна продолжить её</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Шаг 1 из 7</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Ввод</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Дано</text>
  <text id="dataLine1" x="50" y="150" class="left-text">текстовый запрос</text>
  <text id="dataLine2" x="50" y="176" class="left-text">часть фразы</text>
  <text id="dataLine3" x="50" y="202" class="left-text">ответ ещё не готов</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Цель</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Понять, как</text>
  <text id="goalLine2" x="50" y="344" class="left-text">LLM генерирует</text>
  <text id="goalLine3" x="50" y="372" class="left-text">текст шаг за шагом</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Назад</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 7</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Вперёд →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Шаг 1. Пользователь вводит текст",
        subtitle: "LLM получает начало фразы и должна продолжить её",
        name: "Ввод",
        data: [
          "текстовый запрос",
          "часть фразы",
          "ответ ещё не готов"
        ],
        goal: [
          "Понять, как",
          "LLM генерирует",
          "текст шаг за шагом",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Пользователь даёт модели начало текста</text>
          <rect x="355" y="195" width="460" height="78" class="node-yellow" />
          <text x="585" y="225" class="node-bold center">Входной текст</text>
          <text x="585" y="252" class="formula-small center">"Кошка сидит на ..."</text>
          <text x="584" y="340" class="left-text center">На этом этапе модель просто получает последовательность символов.</text>
          <text x="584" y="375" class="left-text center">Ей ещё нужно понять, из каких частей состоит текст.</text>
        `
      },
      {
        title: "Шаг 2. Текст разбивается на токены",
        subtitle: "Модель работает не с целой фразой сразу, а с небольшими частями",
        name: "Токены",
        data: [
          "входной текст",
          "делится на части",
          "получаются токены"
        ],
        goal: [
          "Показать, что",
          "LLM читает текст",
          "через токены",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Разбиение текста на токены</text>
          <rect x="335" y="205" width="86" height="50" class="token-blue" />
          <text x="378" y="230" class="node-bold center">Кошка</text>
          <rect x="440" y="205" width="86" height="50" class="token-yellow" />
          <text x="483" y="230" class="node-bold center">сидит</text>
          <rect x="545" y="205" width="68" height="50" class="token-blue" />
          <text x="579" y="230" class="node-bold center">на</text>
          <rect x="632" y="205" width="68" height="50" class="token-red" />
          <text x="666" y="230" class="node-bold center">...</text>
          <text x="584" y="330" class="formula-small center">Текст → токены</text>
          <text x="584" y="370" class="left-text center">Токены — это маленькие части текста, с которыми дальше работает модель.</text>
        `
      },
      {
        title: "Шаг 3. Модель смотрит на контекст",
        subtitle: "Чтобы продолжить текст, ей важно, что было написано раньше",
        name: "Контекст",
        data: [
          "есть токены",
          "важен контекст",
          "модель смотрит назад"
        ],
        goal: [
          "Показать, что",
          "следующее слово",
          "зависит от контекста",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Перед предсказанием модель учитывает контекст</text>
          <rect x="330" y="205" width="86" height="50" class="token-blue" />
          <text x="373" y="230" class="node-bold center">Кошка</text>
          <rect x="438" y="205" width="86" height="50" class="token-yellow" />
          <text x="481" y="230" class="node-bold center">сидит</text>
          <rect x="546" y="205" width="60" height="50" class="token-blue" />
          <text x="576" y="230" class="node-bold center">на</text>
          <rect x="650" y="195" width="120" height="70" class="node-red" />
          <text x="710" y="223" class="node-bold center">Следующий</text>
          <text x="710" y="245" class="node-bold center">токен ?</text>
          <path d="M373 255 Q520 320 690 265" class="arrow-red" />
          <path d="M481 255 Q565 310 700 265" class="arrow-red" />
          <path d="M576 255 Q615 295 707 265" class="arrow-red" />
          <text x="584" y="340" class="left-text center">Модель смотрит на предыдущие токены и пытается понять,</text>
          <text x="584" y="375" class="left-text center">какое продолжение наиболее уместно именно в этом контексте.</text>
        `
      },
      {
        title: "Шаг 4. Модель оценивает варианты",
        subtitle: "Она не выбирает слово сразу, а сначала оценивает несколько кандидатов",
        name: "Вероятности",
        data: [
          "контекст известен",
          "есть варианты",
          "оценены вероятности"
        ],
        goal: [
          "Показать, что",
          "модель сравнивает",
          "несколько продолжений",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Модель оценивает возможные продолжения</text>
          <text x="400" y="195" class="left-text">"стуле"</text>
          <rect x="470" y="182" width="240" height="20" rx="4" class="bar-blue" />
          <text x="725" y="197" class="small">0.45</text>
          <text x="400" y="235" class="left-text">"диване"</text>
          <rect x="470" y="222" width="160" height="20" rx="4" class="bar-yellow" />
          <text x="645" y="237" class="small">0.30</text>
          <text x="400" y="275" class="left-text">"крыше"</text>
          <rect x="470" y="262" width="92" height="20" rx="4" class="bar-red" />
          <text x="577" y="277" class="small">0.17</text>
          <text x="400" y="315" class="left-text">"полу"</text>
          <rect x="470" y="302" width="50" height="20" rx="4" class="bar-green" />
          <text x="535" y="317" class="small">0.08</text>
          <text x="584" y="375" class="left-text center">На этом шаге модель решает, какой следующий токен наиболее вероятен.</text>
        `
      },
      {
        title: "Шаг 5. Выбирается один токен",
        subtitle: "Из вариантов модель берёт следующий фрагмент текста",
        name: "Выбор токена",
        data: [
          "варианты оценены",
          "выбран лучший",
          "появился новый токен"
        ],
        goal: [
          "Показать, что",
          "генерация идёт",
          "по одному токену",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Следующий токен выбран</text>
          <rect x="350" y="205" width="150" height="68" class="node-blue" />
          <text x="425" y="232" class="node-bold center">Контекст</text>
          <text x="425" y="255" class="small center">"Кошка сидит на"</text>
          <path d="M513 239 L580 239" class="arrow" />
          <rect x="595" y="195" width="160" height="88" class="node-green" />
          <text x="675" y="223" class="node-bold center">Новый токен</text>
          <text x="675" y="253" class="formula-small center">"стуле"</text>
          <text x="584" y="350" class="formula-small center">Модель добавляет один токен за раз</text>
          <text x="584" y="390" class="left-text center">Она ещё не написала весь ответ — только выбрала следующее продолжение.</text>
        `
      },
      {
        title: "Шаг 6. Новый токен добавляется ко входу",
        subtitle: "После этого модель снова повторяет тот же процесс",
        name: "Повторение",
        data: [
          "новый токен добавлен",
          "контекст расширился",
          "цикл повторяется"
        ],
        goal: [
          "Показать цикл",
          "предсказание →",
          "добавление → повтор",
          ""
        ],
 scene: `
  <text x="328" y="130" class="scene-title">Авторегрессия: модель повторяет один и тот же цикл</text>
  <rect x="360" y="180" width="190" height="60" class="node-blue" />
  <text x="455" y="210" class="node-bold center">"Кошка сидит на"</text>
  <path d="M563 210 L605 210" class="arrow" />
  <rect x="620" y="180" width="110" height="60" class="node-green" />
  <text x="675" y="210" class="node-bold center">"стуле"</text>
  <path d="M675 250 C675 300, 450 300, 450 252" class="arrow" />
  <rect x="360" y="310" width="410" height="60" class="node-yellow" />
  <text x="565" y="340" class="node-bold center">Новый вход: "Кошка сидит на стуле ..."</text>
  <text x="584" y="395" class="left-text center">Теперь модель снова оценивает следующий токен:</text>
  <text x="584" y="420" class="left-text center">например, "и", "рядом", "у окна" и т.д.</text>
`
      },
      {
        title: "Шаг 7. Так собирается весь ответ",
        subtitle: "Текст растёт токен за токеном, пока модель не закончит фразу",
        name: "Готовый текст",
        data: [
          "цикл повторён много раз",
          "текст постепенно собран",
          "ответ готов"
        ],
        goal: [
          "Показать итог:",
          "LLM строит текст",
          "по одному шагу",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Результат появляется постепенно</text>
          <rect x="340" y="175" width="440" height="165" class="node-yellow" />
          <text x="370" y="210" class="small">шаг 1  →  "Кошка сидит на <tspan font-weight="800">стуле</tspan>"</text>
          <text x="370" y="245" class="small">шаг 2  →  "Кошка сидит на стуле <tspan font-weight="800">и</tspan>"</text>
          <text x="370" y="280" class="small">шаг 3  →  "Кошка сидит на стуле и <tspan font-weight="800">смотрит</tspan>"</text>
          <text x="370" y="315" class="small">шаг 4  →  "Кошка сидит на стуле и смотрит <tspan font-weight="800">в окно.</tspan>"</text>
          <text x="584" y="380" class="formula-small center">LLM генерирует текст токен за токеном</text>
          <text x="584" y="412" class="left-text center">Она не пишет весь ответ сразу — она многократно повторяет один и тот же цикл.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("dataLine1").textContent = step.data[0] || "";
      $("dataLine2").textContent = step.data[1] || "";
      $("dataLine3").textContent = step.data[2] || "";
      $("goalLine1").textContent = step.goal[0] || "";
      $("goalLine2").textContent = step.goal[1] || "";
      $("goalLine3").textContent = step.goal[2] || "";
      $("goalLine4").textContent = step.goal[3] || "";
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Интерактивная визуализация: LLM получает текст, разбивает его на токены и выбирает следующий токен по вероятностям.</figcaption>
</figure>

## Глубокое обучение — почему «глубокое»?

«Глубина» здесь почти буквальная: это количество слоёв в нейронной сети. Простая сеть может иметь один или несколько слоёв. Глубокая сеть — десятки, сотни, а иногда и больше вычислительных блоков.

Каждый слой превращает данные в новое представление. В компьютерном зрении первые слои могут реагировать на простые элементы: границы, углы, пятна цвета. Следующие слои собирают из них формы. Более глубокие слои распознают части объектов. И только ближе к выходу появляется высокоуровневое представление: «похоже на кота», «похоже на автомобиль», «похоже на лицо».

С текстом идея похожая: ранние уровни работают с токенами и локальными связями, а более глубокие блоки помогают модели строить более сложные зависимости между словами, фразами и смысловыми частями текста.

Именно эта иерархия представлений делает глубокое обучение таким мощным. Модель не получает признаки полностью вручную. Она постепенно строит их сама — от простых к более абстрактным.

## Итог

Если собрать всё вместе:

- искусственный интеллект — это попытка воспроизвести разумное поведение в машине;
- машинное обучение — современный подход внутри ИИ, где машина учится на данных вместо ручного перечисления правил;
- глубокое обучение — часть машинного обучения, основанная на многослойных нейронных сетях;
- компьютерное зрение учит модель понимать изображения как числовые матрицы;
- большие языковые модели работают с текстом как с последовательностью токенов и учатся предсказывать следующий токен.

Главная идея проста: современный ИИ силён не потому, что программист заранее написал все правила. Он силён потому, что модель может находить сложные закономерности в данных и применять их к новым ситуациям.
