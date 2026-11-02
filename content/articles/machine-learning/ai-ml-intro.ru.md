Мы часто говорим «искусственный интеллект», но внутри этого термина смешано сразу несколько идей: человеческий интеллект, программирование правил, машинное обучение, глубокие нейросети, компьютерное зрение и большие языковые модели. В этой статье разберём всё постепенно: от простой интуиции до того, как модель учится на данных и почему LLM умеют писать текст.

## Человеческий интеллект

Когда мы узнаём друзей по голосу, читаем между строк, водим машину или впервые решаем новую задачу, мы используем интеллект. В простом смысле интеллектом называют способность учиться на опыте, видеть закономерности и принимать решения в ситуациях, где заранее не прописана инструкция.

Главное здесь в том, что нас не учат всему через явные правила. Ребёнку не пишут инструкцию «как узнавать кошку». Он видит несколько кошек, замечает повторяющиеся признаки и постепенно начинает отличать кошку от собаки, игрушки или случайного пятна на картинке.

## Почему интеллект называют искусственным?

Такой интеллект создан человеком, а не природой. Это попытка воспроизвести разумное поведение в машине: видеть, слышать, говорить, рассуждать, выбирать действие и адаптироваться к новой информации.

Слово «искусственный» не означает «фальшивый». Оно означает «сделанный руками», как в словах «искусственный спутник» или «искусственный материал». Поведение системы может выглядеть разумным, но источник у него другой: не биологическая эволюция, а математика, данные, инженерия и вычислительные ресурсы.

<style>
  .ai-live { margin: 26px 0 30px; }
  .ai-live-controls {
    display: flex; flex-wrap: wrap; align-items: flex-end; gap: 14px 24px;
    margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-soft);
  }
  .ai-live-btns { display: flex; flex-wrap: wrap; gap: 8px; }
  .ai-live-btns button {
    font-family: inherit; font-size: 14px; font-weight: 700; color: var(--text);
    background: var(--bg-elev); border: 1px solid var(--accent); border-radius: 9px;
    padding: 7px 14px; cursor: pointer;
  }
  .ai-live-btns button:hover,
  .ai-live-btns button[aria-pressed="true"] { background: var(--accent); color: var(--bg-elev); }
  .ai-live-btns button[disabled] { opacity: 0.35; cursor: default; }
  .ai-slider { flex: 1 1 170px; min-width: 160px; }
  .ai-slider label { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
  .ai-slider output { font-variant-numeric: tabular-nums; font-weight: 700; color: var(--text); }
  .ai-slider input[type=range] { width: 100%; accent-color: #3576C0; }
  .ai-live .stage-notes { min-height: 0; }
</style>

<div class="stage" id="stageAiArtificial" tabindex="0">
  <div class="stage-figure">
<svg id="aiArtificial" viewBox="0 0 900 400" role="img" aria-label="Искусственный значит сделанный человеком: шесть умений машины, Луна и искусственный спутник на орбите Земли, два источника умений">
  <style>
    .aa-panel { fill: #ffffff; stroke: #3576C0; stroke-width: 1.3; stroke-opacity: 0.25; }
    .aa-title { font: 800 20px Helvetica, Arial, sans-serif; fill: #111111; }
    .aa-big { font: 800 34px Helvetica, Arial, sans-serif; fill: #111111; }
    .aa-bold { font: 800 16px Helvetica, Arial, sans-serif; fill: #111111; }
    .aa-text { font: 15px Helvetica, Arial, sans-serif; fill: #111111; }
    .aa-small { font: 13px Helvetica, Arial, sans-serif; fill: #111111; opacity: 0.75; }
    .aa-c { text-anchor: middle; dominant-baseline: middle; }
    .aa-grey { fill: #F7F5EF; stroke: #8E8A82; stroke-width: 1.4; }
    .aa-blue { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    .aa-yellow { fill: #ffffff; stroke: #C29E08; stroke-width: 1.6; }
    .aa-link { stroke: #3576C0; stroke-width: 1.4; stroke-opacity: 0.45; fill: none; }
    .aa-arrow { stroke: #3576C0; stroke-width: 2.2; fill: none; marker-end: url(#aaArrow); }
    .aa-arrow-grey { stroke: #8E8A82; stroke-width: 2.2; fill: none; marker-end: url(#aaArrowGrey); }
    .aa-orbit { fill: none; stroke: #8E8A82; stroke-width: 1.2; stroke-dasharray: 5 5; }
    .aa-hl { fill: none; stroke: #C30B0A; stroke-width: 2.3; stroke-dasharray: 8 5; }
    .aa-strike { stroke: #C30B0A; stroke-width: 2.4; }
  </style>
  <defs>
    <marker id="aaArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="aaArrowGrey" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#8E8A82" />
    </marker>
  </defs>
  <rect x="30" y="16" width="840" height="368" rx="18" class="aa-panel" />

  <g data-key="who" data-only="1">
    <text x="450" y="62" class="aa-title aa-c">Кто создал интеллект?</text>
    <rect x="110" y="110" width="250" height="78" rx="12" class="aa-grey" />
    <text x="235" y="140" class="aa-bold aa-c">Природа</text>
    <text x="235" y="165" class="aa-small aa-c">эволюция за миллионы лет</text>
    <path d="M235 196 L235 238" class="aa-arrow-grey" />
    <rect x="110" y="248" width="250" height="70" rx="12" class="aa-grey" />
    <text x="235" y="283" class="aa-bold aa-c">Интеллект человека</text>
    <rect x="540" y="110" width="250" height="78" rx="12" class="aa-blue" />
    <text x="665" y="140" class="aa-bold aa-c">Человек</text>
    <text x="665" y="165" class="aa-small aa-c">инженеры и программисты</text>
    <path d="M665 196 L665 238" class="aa-arrow" />
    <rect x="540" y="248" width="250" height="70" rx="12" class="aa-yellow" />
    <text x="665" y="283" class="aa-bold aa-c">Искусственный интеллект</text>
    <text x="450" y="352" class="aa-text aa-c">ИИ построили люди: это попытка воспроизвести разумное поведение в машине.</text>
  </g>

  <g data-key="skills" data-only="1">
    <text x="450" y="62" class="aa-title aa-c">Что значит «разумное поведение»</text>
    <path d="M300 130 L380 200 M300 200 L380 200 M300 270 L380 200 M600 130 L520 200 M600 200 L520 200 M600 270 L520 200" class="aa-link" />
    <rect x="380" y="160" width="140" height="80" rx="12" class="aa-yellow" />
    <text x="450" y="200" class="aa-bold aa-c">Машина</text>
    <rect x="130" y="110" width="170" height="40" rx="9" class="aa-blue" /><text x="215" y="130" class="aa-text aa-c">видеть</text>
    <rect x="130" y="180" width="170" height="40" rx="9" class="aa-blue" /><text x="215" y="200" class="aa-text aa-c">слышать</text>
    <rect x="130" y="250" width="170" height="40" rx="9" class="aa-blue" /><text x="215" y="270" class="aa-text aa-c">говорить</text>
    <rect x="600" y="110" width="170" height="40" rx="9" class="aa-blue" /><text x="685" y="130" class="aa-text aa-c">рассуждать</text>
    <rect x="600" y="180" width="170" height="40" rx="9" class="aa-blue" /><text x="685" y="200" class="aa-text aa-c">выбирать действие</text>
    <rect x="600" y="250" width="170" height="40" rx="9" class="aa-blue" /><text x="685" y="270" class="aa-text aa-c">адаптироваться</text>
    <text x="450" y="340" class="aa-text aa-c">Каждое из шести умений можно проверить на задаче:</text>
    <text x="450" y="362" class="aa-text aa-c">узнала ли машина объект на фото, поняла ли фразу, выбрала ли верный ход.</text>
  </g>

  <g data-key="orbit" data-only="1">
    <circle cx="240" cy="200" r="130" class="aa-orbit" />
    <circle cx="240" cy="200" r="72" class="aa-orbit" />
    <circle cx="240" cy="200" r="34" fill="#3576C0" fill-opacity="0.85" />
    <text x="240" y="201" class="aa-small aa-c" style="fill:#ffffff;opacity:1">Земля</text>
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 240 200" to="360 240 200" dur="16s" repeatCount="indefinite" />
      <circle cx="370" cy="200" r="13" fill="#BDB8AE" stroke="#8E8A82" stroke-width="1.2" />
    </g>
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 240 200" to="360 240 200" dur="5s" repeatCount="indefinite" />
      <rect x="306" y="195" width="12" height="10" fill="#C29E08" />
      <rect x="292" y="198" width="12" height="4" fill="#3576C0" />
      <rect x="320" y="198" width="12" height="4" fill="#3576C0" />
    </g>
    <text x="440" y="62" class="aa-title">«Искусственный» = сделанный руками</text>
    <circle cx="452" cy="116" r="9" fill="#BDB8AE" stroke="#8E8A82" stroke-width="1.2" />
    <text x="472" y="121" class="aa-text"><tspan font-weight="800">Луна</tspan>: её создала природа</text>
    <rect x="445" y="152" width="14" height="11" fill="#C29E08" />
    <text x="472" y="163" class="aa-text"><tspan font-weight="800">Спутник</tspan>: его построили люди</text>
    <text x="440" y="214" class="aa-text">Оба тела летят по орбите по одним и тем же</text>
    <text x="440" y="236" class="aa-text">законам тяготения. Спутник настоящий: он</text>
    <text x="440" y="258" class="aa-text">передаёт сигнал и снимает Землю.</text>
    <text x="440" y="314" class="aa-bold">искусственный</text>
    <text x="568" y="314" class="aa-text">≠</text>
    <text x="592" y="314" class="aa-bold" textLength="88" lengthAdjust="spacingAndGlyphs">фальшивый</text>
    <line x1="589" y1="309" x2="683" y2="309" class="aa-strike" />
    <text x="440" y="346" class="aa-small">Так же с ИИ: поведение настоящее, другое происхождение.</text>
  </g>

  <g data-key="cols" data-only="1">
    <text x="450" y="58" class="aa-title aa-c">Откуда берутся умения</text>
    <rect x="100" y="86" width="300" height="222" rx="14" class="aa-grey" />
    <text x="250" y="118" class="aa-bold aa-c">Человек</text>
    <rect x="135" y="146" width="230" height="44" rx="9" fill="#ffffff" stroke="#8E8A82" stroke-width="1.1" />
    <text x="250" y="168" class="aa-text aa-c">биологическая эволюция</text>
    <rect x="135" y="204" width="230" height="44" rx="9" fill="#ffffff" stroke="#8E8A82" stroke-width="1.1" />
    <text x="250" y="226" class="aa-text aa-c">личный опыт</text>
    <rect x="500" y="86" width="300" height="222" rx="14" style="fill:#F0F5FB" class="aa-blue" />
    <text x="650" y="118" style="fill:#3576C0" class="aa-bold aa-c">Искусственный интеллект</text>
    <rect x="525" y="140" width="120" height="40" rx="9" class="aa-blue" /><text x="585" y="160" class="aa-text aa-c">математика</text>
    <rect x="655" y="140" width="120" height="40" rx="9" class="aa-blue" /><text x="715" y="160" class="aa-text aa-c">данные</text>
    <rect x="525" y="194" width="120" height="40" rx="9" class="aa-blue" /><text x="585" y="214" class="aa-text aa-c">инженерия</text>
    <rect x="655" y="194" width="120" height="40" rx="9" class="aa-blue" /><text x="715" y="214" class="aa-text aa-c">вычисления</text>
    <text x="650" y="270" class="aa-small aa-c">видеокарты, дата-центры</text>
  </g>
  <g data-key="colsNote" data-only="1">
    <text x="450" y="346" class="aa-text aa-c">Умения могут совпадать: оба узнают кошку на фото. Различается источник.</text>
  </g>
  <g data-key="hlRight" data-only="1">
    <rect x="490" y="76" width="320" height="242" rx="18" class="aa-hl" />
    <text x="450" y="346" class="aa-bold aa-c">Дальше в статье: какие числа считает машина,</text>
    <text x="450" y="368" class="aa-bold aa-c">по каким формулам и как она подбирает свои параметры.</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="who" data-focus="who">
      <div class="step-kicker">Шаг 1 · кто создал</div>
      <h4>Интеллект человека вырастила природа, ИИ построили люди</h4>
      <p>Человеческий интеллект сложился за миллионы лет эволюции. Искусственный интеллект
      проектируют инженеры и программисты: это попытка воспроизвести разумное поведение в машине.</p>
    </div>
    <div class="step-panel" data-on="skills" data-focus="skills">
      <div class="step-kicker">Шаг 2 · шесть умений</div>
      <h4>Разумное поведение раскладывается на умения</h4>
      <p>Машине нужно видеть, слышать, говорить, рассуждать, выбирать действие и подстраиваться под
      новую информацию. Каждое умение проверяется на конкретной задаче: распознать объект на фото,
      понять фразу, выбрать ход в игре.</p>
    </div>
    <div class="step-panel" data-on="orbit" data-focus="orbit">
      <div class="step-kicker">Шаг 3 · искусственный спутник</div>
      <h4>«Искусственный» значит «сделанный руками»</h4>
      <p>Луна и спутник летят вокруг Земли по одним и тем же законам тяготения. Луну создала природа,
      спутник построили люди. При этом спутник настоящий: он передаёт сигнал и снимает Землю.
      Так же и с ИИ: слово «искусственный» говорит о происхождении, а не о том, что поведение фальшивое.</p>
    </div>
    <div class="step-panel" data-on="cols colsNote" data-focus="cols">
      <div class="step-kicker">Шаг 4 · источник умений</div>
      <h4>Различается источник поведения</h4>
      <p>У человека умения выросли из биологической эволюции и личного опыта. У ИИ они получаются
      из математики, данных, инженерии и вычислительных мощностей.</p>
    </div>
    <div class="step-panel" data-on="cols hlRight" data-focus="hlRight">
      <div class="step-kicker">Шаг 5 · что дальше</div>
      <h4>Разберём правую колонку</h4>
      <p>Дальше в статье раскроем, что стоит за словами «математика» и «данные»: какие числа считает
      машина, по каким формулам и как она подбирает свои параметры.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

## Области ИИ и почему сейчас все говорят про машинное обучение

ИИ объединяет разные подходы. В старых системах программисты вручную описывали правила: «если у объекта четыре ноги, хвост и он лает, то это собака». Такие системы называют экспертными или rule-based системами.

Но большинство реальных задач слишком сложные для ручного описания. Невозможно перечислить все варианты лиц, голосов, дорожных ситуаций, стилей письма или фотографий котов. Поэтому современный ИИ в основном опирается на машинное обучение: мы не пишем все правила сами, а показываем машине данные, чтобы она нашла закономерности.

Внутри машинного обучения находится глубокое обучение, где используются многослойные нейронные сети. Именно глубокое обучение лежит в основе больших языковых моделей, компьютерного зрения, распознавания речи и многих современных рекомендательных систем.

<div class="stage" id="stageAiHierarchy" tabindex="0">
  <div class="stage-figure">
<svg id="aiHier" viewBox="0 90 900 390" role="img" aria-label="Вложенные прямоугольники: искусственный интеллект содержит машинное обучение, которое содержит глубокое обучение и современные модели">
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
  </style>
  <rect x="40" y="112" width="830" height="340" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="boxAI" data-only="1">
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Искусственный интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Общий «зонт» для разных подходов</text>
    </g>
    <g data-key="boxML" data-only="1">
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Машинное обучение</text>
      <text x="180" y="252" class="box-sub-ml">Учится на данных, а не на правилах</text>
    </g>
    <g data-key="boxDL" data-only="1">
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="286" class="box-title-dl">Глубокое обучение</text>
      <text x="232" y="307" class="box-sub-dl">Многослойные нейронные сети</text>
    </g>
    <g data-key="boxMini" data-only="1">
      <rect x="225" y="317" width="96" height="42" class="mini-box" />
      <text x="273" y="334" class="mini-title center">LLM</text>
      <text x="273" y="350" class="mini-sub center">тексты</text>
      <rect x="340" y="317" width="96" height="42" class="mini-box" />
      <text x="388" y="334" class="mini-title center">CNN</text>
      <text x="388" y="350" class="mini-sub center">зрение</text>
      <rect x="455" y="317" width="96" height="42" class="mini-box" />
      <text x="503" y="334" class="mini-title center">Речь</text>
      <text x="503" y="350" class="mini-sub center">аудио</text>
    </g>
    <g data-key="boxSide" data-only="1">
      <rect x="645" y="174" width="135" height="52" class="side-box" />
      <text x="712.5" y="194" class="side-title center">Экспертные</text>
      <text x="712.5" y="215" class="side-title center">системы</text>
      <rect x="645" y="246" width="135" height="52" class="side-box" />
      <text x="712.5" y="266" class="side-title center">Логические</text>
      <text x="712.5" y="287" class="side-title center">правила</text>
      <rect x="645" y="318" width="135" height="52" class="side-box" />
      <text x="712.5" y="338" class="side-title center">Поиск</text>
      <text x="712.5" y="359" class="side-title center">и план.</text>
    </g>
    <g data-key="hlAI" data-only="1">
      <rect x="95" y="128" width="710" height="252" class="highlight-ai" />
    </g>
    <g data-key="hlML" data-only="1">
      <rect x="150" y="194" width="470" height="182" class="highlight-ml" />
    </g>
    <g data-key="hlDL" data-only="1">
      <rect x="202" y="258" width="370" height="105" class="highlight-dl" />
    </g>
    <g data-key="hlSide" data-only="1">
      <rect x="635" y="168" width="155" height="212" class="highlight-ai" />
    </g>
    <g data-key="exp1" data-only="1">
      <text x="450" y="398" class="explain center">ИИ: самый широкий уровень.</text>
      <text x="450" y="416" class="explain-small center">Сюда входят разные способы заставить систему решать интеллектуальные задачи.</text>
    </g>
    <g data-key="exp2" data-only="1">
      <text x="450" y="398" class="explain center">Машинное обучение входит в ИИ.</text>
      <text x="450" y="416" class="explain-small center">Вместо ручных правил модель ищет закономерности в данных.</text>
    </g>
    <g data-key="exp3" data-only="1">
      <text x="450" y="398" class="explain center">Глубокое обучение входит в машинное обучение.</text>
      <text x="450" y="416" class="explain-small center">Оно использует нейросети с большим количеством слоёв.</text>
    </g>
    <g data-key="exp4" data-only="1">
      <text x="450" y="398" class="explain center">Разные модели решают разные задачи.</text>
      <text x="450" y="416" class="explain-small center">LLM для текста, CNN для зрения, модели речи для аудио.</text>
    </g>
    <g data-key="exp5" data-only="1">
      <text x="450" y="398" class="explain center">Не весь ИИ обучается на данных.</text>
      <text x="450" y="416" class="explain-small center">Экспертные системы могут работать по заранее заданным правилам.</text>
    </g>
    <g data-key="exp6" data-only="1">
      <text x="450" y="392" class="explain center">ИИ ⊃ Машинное обучение ⊃ Глубокое обучение ⊃ LLM / CNN / речь</text>
      <text x="450" y="414" class="explain-small center">LLM не весь ИИ, а одна ветка внутри глубокого обучения.</text>
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="boxAI hlAI exp1" data-focus="boxAI">
      <div class="step-kicker">Шаг 1 · искусственный интеллект</div>
      <h4>ИИ: самый широкий уровень</h4>
      <p>Искусственным интеллектом называют общий класс систем, которые имитируют разумное поведение.
      Сюда входят разные способы заставить систему решать интеллектуальные задачи: от ручных
      правил до обучения на данных.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML hlML exp2" data-focus="boxML">
      <div class="step-kicker">Шаг 2 · машинное обучение</div>
      <h4>Внутри ИИ появляется машинное обучение</h4>
      <p>Машинным обучением называют часть ИИ, где система учится на данных, а не на заранее
      прописанных правилах: вместо ручных инструкций модель сама ищет закономерности.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML boxDL hlDL exp3" data-focus="boxDL">
      <div class="step-kicker">Шаг 3 · глубокое обучение</div>
      <h4>Внутри ML есть глубокое обучение</h4>
      <p>Глубокое обучение входит в машинное обучение и строится на многослойных нейронных
      сетях: чем больше слоёв, тем сложнее закономерности, которые модель способна находить.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML boxDL boxMini exp4" data-focus="boxMini">
      <div class="step-kicker">Шаг 4 · разные модели</div>
      <h4>Внутри deep learning есть разные модели</h4>
      <p>Разные архитектуры решают разные задачи: LLM работают с текстом, CNN с изображениями,
      а отдельные модели с речью и аудио.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML boxDL boxMini boxSide hlSide exp5" data-focus="boxSide">
      <div class="step-kicker">Шаг 5 · не только ML</div>
      <h4>В ИИ входит не только машинное обучение</h4>
      <p>В ИИ также входят системы на правилах, поиск и планирование. Не весь ИИ обучается на
      данных: экспертные системы могут работать по заранее заданным логическим правилам.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML boxDL boxMini boxSide exp6" data-focus="">
      <div class="step-kicker">Шаг 6 · итог</div>
      <h4>Итоговая иерархия</h4>
      <p>Теперь видно всю картину: ИИ ⊃ машинное обучение ⊃ глубокое обучение ⊃ LLM / CNN / речь.
      LLM не весь ИИ, а всего одна ветка внутри глубокого обучения.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

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

<div class="ai-live" id="aiPixel">
  <div class="stage-figure">
<svg id="aiPixelSvg" viewBox="0 0 900 400" role="img" aria-label="Кот 16 на 16 пикселей: при смене освещения и сдвиге кота значение одного и того же пикселя меняется, и правило по пикселю перестаёт срабатывать">
  <g data-pix="cat"></g>
  <g data-pix="side"></g>
</svg>
  </div>
  <div class="ai-live-controls">
    <div class="ai-live-btns" role="group" aria-label="Снимок кота">
      <button type="button" data-preset="0" aria-pressed="true">Обычный свет</button>
      <button type="button" data-preset="1" aria-pressed="false">В тени</button>
      <button type="button" data-preset="2" aria-pressed="false">Кот сдвинулся</button>
    </div>
    <div class="ai-slider"><label for="aiPixLight">Освещение <output id="aiPixLightOut">100 %</output></label>
      <input id="aiPixLight" type="range" min="0.2" max="1.3" step="0.05" value="1"></div>
    <div class="ai-slider"><label for="aiPixDx">Сдвиг вправо <output id="aiPixDxOut">0</output></label>
      <input id="aiPixDx" type="range" min="-3" max="3" step="1" value="0"></div>
    <div class="ai-slider"><label for="aiPixDy">Сдвиг вниз <output id="aiPixDyOut">0</output></label>
      <input id="aiPixDy" type="range" min="-3" max="3" step="1" value="0"></div>
  </div>
  <div class="stage-notes">
    <div class="step-live">
      <div class="step-kicker">Один пиксель · три снимка</div>
      <h4></h4>
      <p></p>
    </div>
  </div>
</div>

<script>
(function () {
  'use strict';
  var root = document.getElementById('aiPixel');
  if (!root) return;
  var svg = root.querySelector('svg');
  var NS = 'http://www.w3.org/2000/svg';
  var PAL = {
    '.': [172, 203, 236], d: [58, 42, 34], o: [232, 142, 44], p: [238, 150, 162], w: [246, 244, 238],
    g: [96, 172, 64], k: [90, 90, 90], r: [195, 11, 10], y: [240, 200, 40]
  };
  var CAT = [
    '................', '..d..........d..', '..dd........dd..', '..dpd......dpd..',
    '..dppddddddppd..', '.dooooooooooood.', '.dooooooooooood.', '.doogdoooodgood.',
    '.doodgoooogdood.', '.dooooooooooood.', 'kdwwwwwppwwwwwdk', 'kdwwwwdwwdwwwwdk',
    '..dwwwwddwwwwd..', '...dddddddddd...', '....rrrrrrrr....', '....rrryyrrr....'
  ];
  var N = 16, CELL = 20, X0 = 50, Y0 = 34, R0 = 7, C0 = 4, RULE = 137;
  var PRESETS = [[1, 0, 0], [0.45, 0, 0], [1, 3, 2]];

  function el(name, attrs, parent, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function gray(c) { return Math.round(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]); }
  function hex(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }

  // кадр: сдвиг (фон заполняет освободившиеся клетки), затем множитель освещения
  function frame(light, dx, dy) {
    var out = [];
    for (var r = 0; r < N; r++) {
      var row = [];
      for (var c = 0; c < N; c++) {
        var sr = r - dy, sc = c - dx;
        var base = (sr >= 0 && sr < N && sc >= 0 && sc < N) ? PAL[CAT[sr][sc]] : PAL['.'];
        row.push(base.map(function (v) { return Math.min(255, Math.max(0, Math.round(v * light))); }));
      }
      out.push(row);
    }
    return out;
  }

  var gCat = svg.querySelector('[data-pix="cat"]');
  var gSide = svg.querySelector('[data-pix="side"]');
  var cells = [];
  for (var r = 0; r < N; r++) {
    cells.push([]);
    for (var c = 0; c < N; c++) {
      var rc = el('rect', { x: X0 + c * CELL, y: Y0 + r * CELL, width: CELL, height: CELL, stroke: '#ffffff', 'stroke-width': 0.6 }, gCat);
      rc.dataset.r = r; rc.dataset.c = c;
      cells[r].push(rc);
    }
  }
  el('rect', { x: X0 + C0 * CELL - 1.5, y: Y0 + R0 * CELL - 1.5, width: CELL + 3, height: CELL + 3,
               fill: 'none', stroke: '#C30B0A', 'stroke-width': 3.2 }, gCat);
  var hoverBox = el('rect', { width: CELL, height: CELL, fill: 'none', stroke: '#111111', 'stroke-width': 2, visibility: 'hidden' }, gCat);
  var hoverText = el('text', { x: X0, y: Y0 + N * CELL + 26, 'font-size': 13, fill: '#5E5850', 'font-family': 'Helvetica, Arial, sans-serif' }, gCat,
                     'Наведите на любой пиксель, чтобы увидеть его числа');

  var F = 'Helvetica, Arial, sans-serif', MONO = 'Menlo, Consolas, "Courier New", monospace';
  el('text', { x: 430, y: 60, 'font-size': 18, 'font-weight': 800, fill: '#111111', 'font-family': F }, gSide, 'Пиксель (7, 4): строка 7, столбец 4');
  var zoom = el('rect', { x: 430, y: 84, width: 96, height: 96, rx: 6, stroke: '#C30B0A', 'stroke-width': 3 }, gSide);
  var bigNum = el('text', { x: 552, y: 146, 'font-size': 54, 'font-weight': 800, fill: '#111111', 'font-family': F }, gSide, '137');
  el('text', { x: 552, y: 172, 'font-size': 13, fill: '#5E5850', 'font-family': F }, gSide, 'яркость: 0 чёрный, 255 белый');
  var rgbText = el('text', { x: 430, y: 206, 'font-size': 14, fill: '#111111', 'font-family': MONO }, gSide, '');
  el('rect', { x: 430, y: 226, width: 420, height: 72, rx: 10, fill: '#ffffff', stroke: '#3576C0', 'stroke-width': 1.6 }, gSide);
  el('text', { x: 448, y: 256, 'font-size': 16, fill: '#3576C0', 'font-family': MONO }, gSide, 'if pixel[7][4] == 137:');
  el('text', { x: 448, y: 282, 'font-size': 16, fill: '#3576C0', 'font-family': MONO }, gSide, '    return "кошка"');
  var verdict = el('text', { x: 430, y: 330, 'font-size': 17, 'font-weight': 800, 'font-family': F }, gSide, '');
  var verdict2 = el('text', { x: 430, y: 356, 'font-size': 14, fill: '#5E5850', 'font-family': F }, gSide, '');

  var lightIn = document.getElementById('aiPixLight');
  var dxIn = document.getElementById('aiPixDx');
  var dyIn = document.getElementById('aiPixDy');
  var presetBtns = Array.prototype.slice.call(root.querySelectorAll('[data-preset]'));
  var titleEl = root.querySelector('.step-live h4');
  var textEl = root.querySelector('.step-live p');
  var img = frame(1, 0, 0);

  function describe(light, dx, dy, v) {
    var hit = v === RULE;
    if (dx === 0 && dy === 0 && light === 1) {
      return ['Правило сработало на этом снимке',
        'Пиксель (7, 4) попал на зелёный глаз, его яркость 137. Программист видит это число и пишет правило «если 137, то кошка».'];
    }
    if (dx === 0 && dy === 0) {
      return [hit ? 'Правило пока держится' : 'Тот же кот, другое число',
        'Освещение ' + Math.round(light * 100) + ' %: каждый канал R, G, B умножился на ' + light.toFixed(2) +
        ', и пиксель глаза стал ' + v + '. Кот на месте, глаз на месте, а правило проверяет точное число.'];
    }
    var moves = [];
    if (dx) moves.push('на ' + Math.abs(dx) + ' ' + (Math.abs(dx) === 1 ? 'пиксель' : 'пикселя') + (dx > 0 ? ' вправо' : ' влево'));
    if (dy) moves.push('на ' + Math.abs(dy) + ' ' + (Math.abs(dy) === 1 ? 'пиксель' : 'пикселя') + (dy > 0 ? ' вниз' : ' вверх'));
    return [hit ? 'Совпадение случайное' : 'Кот сдвинулся, и на месте глаза другой участок',
      'Кот сместился ' + moves.join(' и ') + '. В клетку (7, 4) теперь попадает другой участок картинки, его яркость ' + v +
      '. На настоящих фото меняются ещё поза, фон, ракурс, размер и камера, и вместе с ними все числа сразу.'];
  }

  function update() {
    var light = +lightIn.value, dx = +dxIn.value, dy = +dyIn.value;
    document.getElementById('aiPixLightOut').textContent = Math.round(light * 100) + ' %';
    document.getElementById('aiPixDxOut').textContent = dx;
    document.getElementById('aiPixDyOut').textContent = dy;
    img = frame(light, dx, dy);
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) cells[r][c].setAttribute('fill', hex(img[r][c]));
    var px = img[R0][C0], v = gray(px), hit = v === RULE;
    zoom.setAttribute('fill', hex(px));
    bigNum.textContent = v;
    rgbText.textContent = 'R ' + px[0] + '   G ' + px[1] + '   B ' + px[2];
    verdict.textContent = hit ? '✓ правило сработало: «кошка»' : '✗ правило молчит: ' + v + ' ≠ 137';
    verdict.setAttribute('fill', hit ? '#4E8A12' : '#C30B0A');
    verdict2.textContent = hit ? 'На этом снимке число совпало.' : 'На снимке по-прежнему кошка.';
    presetBtns.forEach(function (b, i) {
      var p = PRESETS[i];
      b.setAttribute('aria-pressed', String(p[0] === light && p[1] === dx && p[2] === dy));
    });
    var d = describe(light, dx, dy, v);
    titleEl.textContent = d[0];
    textEl.textContent = d[1];
  }

  function showHover(r, c) {
    var px = img[r][c];
    hoverBox.setAttribute('x', X0 + c * CELL); hoverBox.setAttribute('y', Y0 + r * CELL);
    hoverBox.setAttribute('visibility', 'visible');
    hoverText.textContent = 'пиксель (' + r + ', ' + c + '): R ' + px[0] + ', G ' + px[1] + ', B ' + px[2] + ' → яркость ' + gray(px);
  }
  gCat.addEventListener('mouseover', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.r !== undefined) showHover(+t.dataset.r, +t.dataset.c);
  });
  gCat.addEventListener('click', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.r !== undefined) showHover(+t.dataset.r, +t.dataset.c);
  });
  gCat.addEventListener('mouseleave', function () { hoverBox.setAttribute('visibility', 'hidden'); });

  presetBtns.forEach(function (b, i) {
    b.addEventListener('click', function () {
      lightIn.value = PRESETS[i][0]; dxIn.value = PRESETS[i][1]; dyIn.value = PRESETS[i][2];
      update();
    });
  });
  [lightIn, dxIn, dyIn].forEach(function (inp) { inp.addEventListener('input', update); });
  update();
})();
</script>

Здесь начинается машинное обучение. Мы показываем модели много примеров вида «вход → правильный ответ», а она подбирает внутренние параметры так, чтобы на новых похожих примерах давать правильный ответ.

<div class="stage" id="stageExplicitVsML" tabindex="0">
  <div class="stage-figure">
<svg id="explicitMl" viewBox="262 70 638 390" role="img" aria-label="Сравнение явного программирования и машинного обучения на примере расчёта времени в пути">
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
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
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
    .left-text {
      font-size: 15px;
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
      marker-end: url(#arrowHeadBlueEM);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRedEM);
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
  </style>
  <defs>
    <marker id="arrowHeadBlueEM" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRedEM" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="step1" data-only="1">
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
    </g>
    <g data-key="step2" data-only="1">
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
    </g>
    <g data-key="step3" data-only="1">
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
    </g>
    <g data-key="step4" data-only="1">
      <text x="584" y="195" class="title center">Как заставить компьютер учиться?</text>
      <text x="584" y="250" class="formula-small center">Может ли он сам обнаружить правило?</text>
      <text x="584" y="292" class="formula-small center">Например: t зависит от S и v</text>
    </g>
    <g data-key="step5" data-only="1">
      <text x="584" y="195" class="title center">Дадим компьютеру примеры</text>
      <text x="584" y="250" class="formula-small center">Он увидит входные данные и правильные ответы.</text>
      <text x="584" y="292" class="formula-small center">После этого попробует найти закономерность.</text>
    </g>
    <g data-key="step6" data-only="1">
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
    </g>
    <g data-key="step7" data-only="1">
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
    </g>
    <g data-key="step8" data-only="1">
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
    </g>
    <g data-key="step9" data-only="1">
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
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · условие</div>
      <h4>Есть простая задача</h4>
      <p>Нужно узнать время движения, зная расстояние S = 10 км и скорость v = 1 км/ч.
      Разберём, как эту зависимость можно получить двумя разными способами: обычной
      формулой или обучением.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · явное программирование</div>
      <h4>Правило известно: просто пишем формулу</h4>
      <p>Когда зависимость между входом и выходом известна заранее, человек сам записывает
      её в виде правила: данные плюс правило дают ответ.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · выполнение кода</div>
      <h4>Компьютер выполняет готовую формулу</h4>
      <p>Компьютер просто подставляет числа S = 10 и v = 1 в функцию <code>t = S / v</code>,
      которую заранее написал человек, и получает t = 10 ч. Обучения здесь нет, есть
      только вычисление по готовой формуле.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · вопрос</div>
      <h4>А может ли компьютер сам найти правило?</h4>
      <p>Переходим от готовой формулы к идее, что компьютер способен сам обнаружить
      зависимость между S, v и t, если её не подсказывать напрямую.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · идея обучения</div>
      <h4>Вместо формулы показываем много примеров</h4>
      <p>Не пишем формулу вручную. Вместо этого показываем компьютеру много готовых
      примеров «вход → ответ», и он пытается найти в них закономерность сам.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Шаг 6 · обучающие данные</div>
      <h4>Каждая строка таблицы описывает один пример</h4>
      <p>Теперь у нас не одна задача, а набор примеров: для разных S и v известен правильный
      ответ t. Именно на таких парах модель будет учиться.</p>
    </div>
    <div class="step-panel" data-on="step7" data-focus="step7">
      <div class="step-kicker">Шаг 7 · модель ищет закономерность</div>
      <h4>Модель подбирает связь между S, v и t</h4>
      <p>Модель смотрит на обучающие примеры и пытается найти скрытое правило. После
      обучения она приблизительно понимает: t = f(S, v).</p>
    </div>
    <div class="step-panel" data-on="step8" data-focus="step8">
      <div class="step-kicker">Шаг 8 · предсказание</div>
      <h4>Обученная модель получает новый пример</h4>
      <p>После обучения модели можно дать данные без готового ответа (S = 10, v = 1),
      и она предскажет результат: t ≈ 10 ч, не зная формулы t = S / v в явном виде.</p>
    </div>
    <div class="step-panel" data-on="step9" data-focus="step9">
      <div class="step-kicker">Шаг 9 · сравнение</div>
      <h4>Главное различие двух подходов</h4>
      <p>В explicit programming человек заранее пишет правило, и данные с правилом дают
      ответ. В machine learning данные и ответы даются вместе, а правилу (модели)
      предстоит научиться самому.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

## Почему одной формулы часто недостаточно

Даже задача с поездкой в реальности сложнее, чем кажется. По формуле можно оценить время движения:

$$t = \frac{S}{v}$$

Но в реальной жизни время зависит не только от расстояния и средней скорости. Есть пробки, погода, остановки, качество дороги, светофоры, стиль водителя и множество других факторов. Формально мы могли бы записать:

$$t = f(S, v, \text{пробки}, \text{погода}, \text{остановки}, \ldots)$$

Проблема в том, что функцию `f` обычно трудно написать руками. Но можно собрать много реальных поездок и дать модели возможность самой приблизить эту зависимость.

<div class="stage" id="stageRealFactorsQuestion" tabindex="0">
  <div class="stage-figure">
<svg id="realFactors" viewBox="0 80 900 320" role="img" aria-label="Вопрос: достаточно ли формулы t = S / v, и список реальных факторов, которые на самом деле влияют на время в пути">
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
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
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
    .formula {
      font-size: 22px;
      font-weight: 700;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
  </style>
  <rect x="32" y="100" width="826" height="280" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="step1" data-only="1">
      <text x="445" y="215" class="title center">Но идеально ли движение?</text>
      <text x="445" y="265" class="text center">Достаточно ли только формулы t = S / v?</text>
    </g>
    <g data-key="step2" data-only="1">
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
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · вопрос</div>
      <h4>Но идеально ли движение?</h4>
      <p>Формула t = S / v предполагает постоянную скорость и простую дорогу. Достаточно
      ли этого для реальной поездки?</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · ответ</div>
      <h4>Нет, в реальности всё сложнее</h4>
      <p>Время зависит не только от расстояния и скорости: есть пробки, погода, остановки
      и качество дороги. Формально это можно записать как t = f(S, v, пробки, погода, ...),
      но такую функцию уже трудно написать руками.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

## Как обучается машина?

Машина не учится как человек в полном смысле слова. При этом у слова «обучение» здесь есть математический смысл: подбор параметров модели так, чтобы ошибка на обучающих примерах стала меньше.

У модели есть «настраиваемые ручки», их называют параметрами. Сначала они могут быть случайными. Модель делает предсказание, мы сравниваем его с правильным ответом, считаем ошибку и немного меняем параметры в сторону уменьшения ошибки. Потом повторяем это снова и снова.

Упрощённо цикл выглядит так:

1. дать модели данные;
2. получить предсказание;
3. посчитать ошибку;
4. обновить параметры;
5. повторить много раз.

После тысяч, миллионов или миллиардов таких шагов модель начинает лучше обобщать закономерности из данных.

<div class="stage" id="stageTrainingLoop" tabindex="0">
  <div class="stage-figure">
<svg id="trainLoop" viewBox="262 70 638 390" role="img" aria-label="Модель получает пример поездки, делает прогноз, сравнивает его с реальным ответом и обновляет параметры">
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
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
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
    .left-text {
      font-size: 15px;
      fill: #111111;
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
      marker-end: url(#arrowHeadBlueTL);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRedTL);
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
  </style>
  <defs>
    <marker id="arrowHeadBlueTL" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRedTL" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="step1" data-only="1">
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
      <text x="584" y="405" class="left-text center">В каждой строке пример: условия поездки и правильный ответ.</text>
    </g>
    <g data-key="step2" data-only="1">
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
    </g>
    <g data-key="step3" data-only="1">
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
    </g>
    <g data-key="step4" data-only="1">
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
    </g>
    <g data-key="step5" data-only="1">
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
    </g>
    <g data-key="step6" data-only="1">
      <text x="328" y="130" class="scene-title">Обучение: повторение одного цикла</text>
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
    </g>
    <g data-key="step7" data-only="1">
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
    </g>
    <g data-key="step8" data-only="1">
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
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>У модели есть примеры</h4>
      <p>Модель учится на поездках, где уже известен правильный ответ: много строк с
      факторами (S, v, пробки, погода) и реальным временем t. Каждая строка
      служит примером «вход → правильный ответ».</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · первое предположение</div>
      <h4>Модель сначала не знает правило</h4>
      <p>Берём одну строку данных: S = 10, v = 1, пробки и дождь, правильный ответ t = 14.
      Модель ещё не обучена и начинает с грубого предположения.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · прогноз</div>
      <h4>Модель делает прогноз</h4>
      <p>Она пробует предсказать ответ для выбранной строки: получается t ≈ 11. Но в
      обучающих данных правильный ответ для этой строки равен 14.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · ошибка</div>
      <h4>Модель видит ошибку</h4>
      <p>Она сравнивает прогноз (11) с правильным ответом (14) и видит: прогноз ниже
      реального. Модель понимает направление: для таких условий время нужно увеличить.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · обновление</div>
      <h4>Модель немного исправляется</h4>
      <p>Она меняет своё правило так, чтобы в следующий раз ошибиться меньше: прогноз
      сдвигается с 11 до 12. Это ещё не идеально, но ошибка стала меньше.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Шаг 6 · повторение</div>
      <h4>Так повторяется много раз</h4>
      <p>Модель проходит по большому количеству примеров: пример → прогноз → ошибка →
      исправление. Чем больше хороших примеров, тем лучше модель находит закономерность.</p>
    </div>
    <div class="step-panel" data-on="step7" data-focus="step7">
      <div class="step-kicker">Шаг 7 · обученная модель</div>
      <h4>После обучения модель понимает связь</h4>
      <p>Не идеально, но уже полезно для новых ситуаций: модель выучила не одну формулу,
      а зависимость: при пробках и дожде время обычно больше. Это знание появилось из
      данных, а не из ручного if-else.</p>
    </div>
    <div class="step-panel" data-on="step8" data-focus="step8">
      <div class="step-kicker">Шаг 8 · применение</div>
      <h4>Теперь можно предсказывать</h4>
      <p>Для новой поездки правильный ответ заранее неизвестен. Обученная модель получает
      новые факторы и выдаёт прогноз времени: новые данные + обученная модель → прогноз.
      Так ML заменяет большое количество ручных правил.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

Самый простой пример даёт линейная регрессия. Есть точки на графике, и модель пытается провести через них линию. Линия задаётся двумя параметрами: наклоном и смещением.

$$\hat y = w \cdot x + b$$

Сначала линия стоит почти случайно, поэтому ошибка большая. Затем модель меняет `w` и `b`, линия постепенно поворачивается и сдвигается ближе к точкам. Это и есть обучение в самой простой форме.

<div class="ai-live" id="aiLinreg">
  <div class="stage-figure">
<svg id="aiLinregSvg" viewBox="0 0 900 400" role="img" aria-label="Двадцать точек и прямая y = w x + b: ручки w и b двигают прямую, красные отрезки показывают ошибки, градиентный спуск сам подбирает w и b">
  <defs>
    <clipPath id="aiLrClip"><rect x="60" y="24" width="500" height="326" /></clipPath>
  </defs>
  <g data-lr="axes"></g>
  <g data-lr="plot" clip-path="url(#aiLrClip)"></g>
  <g data-lr="side"></g>
</svg>
  </div>
  <div class="ai-live-controls">
    <div class="ai-slider"><label for="aiLrW">Ручка w (наклон) <output id="aiLrWOut">−0.40</output></label>
      <input id="aiLrW" type="range" min="-1.5" max="2.5" step="0.01" value="-0.4"></div>
    <div class="ai-slider"><label for="aiLrB">Ручка b (сдвиг) <output id="aiLrBOut">7.00</output></label>
      <input id="aiLrB" type="range" min="-3" max="9" step="0.01" value="7"></div>
    <div class="ai-live-btns">
      <button type="button" data-lr-act="step">1 шаг спуска</button>
      <button type="button" data-lr-act="run">Обучить: 1500 шагов</button>
      <button type="button" data-lr-act="reset">Сначала</button>
    </div>
  </div>
  <div class="stage-notes">
    <div class="step-live">
      <div class="step-kicker">Обучение · подбор двух параметров</div>
      <h4></h4>
      <p></p>
    </div>
  </div>
</div>

<script>
(function () {
  'use strict';
  var root = document.getElementById('aiLinreg');
  if (!root) return;
  var svg = root.querySelector('svg');
  var NS = 'http://www.w3.org/2000/svg';
  var F = 'Helvetica, Arial, sans-serif';
  var X = [0.758, 1.134, 1.657, 1.668, 1.742, 1.831, 2.978, 3.821, 4.994, 5.103,
           5.106, 5.442, 5.907, 6.098, 6.473, 6.532, 7.594, 7.851, 8.849, 9.033];
  var Y = [1.501, 1.348, 3.103, 2.362, 1.546, 2.396, 3.552, 3.719, 4.453, 5.611,
           6.222, 5.689, 5.713, 6.648, 7.172, 6.521, 7.964, 8.509, 8.436, 8.164];
  var W0 = -0.4, B0 = 7, LR = 0.02, STEPS = 1500, W_BEST = 0.907, B_BEST = 0.740;
  var P = { l: 60, r: 560, t: 24, b: 350, x0: 0, x1: 10, y0: -1, y1: 11 };
  function sx(v) { return P.l + (v - P.x0) / (P.x1 - P.x0) * (P.r - P.l); }
  function sy(v) { return P.b - (v - P.y0) / (P.y1 - P.y0) * (P.b - P.t); }
  function el(name, attrs, parent, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function f2(v) { return (v < 0 ? '−' : '') + Math.abs(v).toFixed(2); }
  function mse(w, b) {
    var s = 0;
    for (var i = 0; i < X.length; i++) { var r = w * X[i] + b - Y[i]; s += r * r; }
    return s / X.length;
  }
  function gradStep(w, b) {
    var gw = 0, gb = 0;
    for (var i = 0; i < X.length; i++) { var r = w * X[i] + b - Y[i]; gw += r * X[i]; gb += r; }
    return [w - LR * 2 * gw / X.length, b - LR * 2 * gb / X.length];
  }

  // оси и сетка
  var axes = svg.querySelector('[data-lr="axes"]');
  for (var gx = 0; gx <= 10; gx += 2) {
    el('line', { x1: sx(gx), y1: P.t, x2: sx(gx), y2: P.b, stroke: '#ECECEC' }, axes);
    el('text', { x: sx(gx), y: P.b + 18, 'font-size': 12, fill: '#5E5850', 'text-anchor': 'middle', 'font-family': F }, axes, gx);
  }
  for (var gy = 0; gy <= 10; gy += 2) {
    el('line', { x1: P.l, y1: sy(gy), x2: P.r, y2: sy(gy), stroke: '#ECECEC' }, axes);
    el('text', { x: P.l - 8, y: sy(gy) + 4, 'font-size': 12, fill: '#5E5850', 'text-anchor': 'end', 'font-family': F }, axes, gy);
  }
  el('line', { x1: P.l, y1: sy(0), x2: P.r, y2: sy(0), stroke: '#8E8A82', 'stroke-width': 1.2 }, axes);
  el('line', { x1: sx(0), y1: P.t, x2: sx(0), y2: P.b, stroke: '#8E8A82', 'stroke-width': 1.2 }, axes);
  el('text', { x: P.r, y: P.b + 40, 'font-size': 13, fill: '#5E5850', 'text-anchor': 'end', 'font-family': F }, axes, 'x');
  el('text', { x: P.l + 6, y: P.t + 12, 'font-size': 13, fill: '#5E5850', 'font-family': F }, axes, 'y');

  var plot = svg.querySelector('[data-lr="plot"]');
  var best = el('line', { stroke: '#8E8A82', 'stroke-width': 1.6, 'stroke-dasharray': '6 5', visibility: 'hidden' }, plot);
  best.setAttribute('x1', sx(P.x0)); best.setAttribute('y1', sy(W_BEST * P.x0 + B_BEST));
  best.setAttribute('x2', sx(P.x1)); best.setAttribute('y2', sy(W_BEST * P.x1 + B_BEST));
  var resid = X.map(function () { return el('line', { stroke: '#C30B0A', 'stroke-width': 1.8, opacity: 0.85 }, plot); });
  var line = el('line', { stroke: '#73B222', 'stroke-width': 3.2 }, plot);
  X.forEach(function (x, i) {
    el('circle', { cx: sx(x), cy: sy(Y[i]), r: 5.5, fill: '#3576C0', stroke: '#ffffff', 'stroke-width': 1.3 }, plot);
  });

  // правая колонка: формула, ошибка, кривая обучения
  var side = svg.querySelector('[data-lr="side"]');
  var formula = el('text', { x: 600, y: 52, 'font-size': 21, 'font-weight': 800, fill: '#111111', 'font-family': F }, side, '');
  el('text', { x: 600, y: 90, 'font-size': 13, fill: '#5E5850', 'font-family': F }, side, 'средний квадрат ошибки (MSE)');
  var mseText = el('text', { x: 600, y: 130, 'font-size': 38, 'font-weight': 800, fill: '#C30B0A', 'font-family': F }, side, '');
  var stepText = el('text', { x: 600, y: 160, 'font-size': 14, fill: '#5E5850', 'font-family': F }, side, '');
  var C = { l: 610, r: 860, t: 200, b: 330 };
  el('rect', { x: C.l, y: C.t, width: C.r - C.l, height: C.b - C.t, fill: '#FAFAF7', stroke: '#E0DDD3', rx: 6 }, side);
  el('text', { x: C.l, y: C.t - 10, 'font-size': 13, fill: '#5E5850', 'font-family': F }, side, 'MSE по шагам спуска');
  el('text', { x: C.l, y: C.b + 18, 'font-size': 12, fill: '#5E5850', 'font-family': F }, side, '0');
  el('text', { x: C.r, y: C.b + 18, 'font-size': 12, fill: '#5E5850', 'text-anchor': 'end', 'font-family': F }, side, '1500');
  var curve = el('path', { fill: 'none', stroke: '#C30B0A', 'stroke-width': 2.2 }, side);
  var bestNote = el('text', { x: 600, y: 376, 'font-size': 13, fill: '#5E5850', 'font-family': F, visibility: 'hidden' }, side,
                    'пунктир: точный МНК, w = 0.91, b = 0.74');

  var wIn = document.getElementById('aiLrW');
  var bIn = document.getElementById('aiLrB');
  var runBtn = root.querySelector('[data-lr-act="run"]');
  var stepBtn = root.querySelector('[data-lr-act="step"]');
  var titleEl = root.querySelector('.step-live h4');
  var textEl = root.querySelector('.step-live p');

  var w = W0, b = B0, step = 0, hist = [], timer = null, manual = false;
  var M0 = mse(W0, B0);

  function drawCurve() {
    if (!hist.length) { curve.setAttribute('d', ''); return; }
    var top = Math.log(Math.max(hist[0], 0.3)), bot = Math.log(0.2);
    var d = hist.map(function (m, i) {
      var cx = C.l + i / STEPS * (C.r - C.l);
      var cy = C.t + (top - Math.log(Math.max(m, 0.2))) / (top - bot) * (C.b - C.t);
      return (i ? 'L' : 'M') + cx.toFixed(1) + ' ' + Math.max(C.t, cy).toFixed(1);
    });
    curve.setAttribute('d', d.join(' '));
  }

  function note() {
    var m = mse(w, b);
    if (manual) {
      return ['Вы крутите ручки сами',
        'Каждое положение ручек даёт свою прямую и свою ошибку: сейчас MSE = ' + m.toFixed(2) +
        '. Попробуйте опустить её ниже 0.30 вручную, а потом нажмите «Обучить», и спуск продолжит с вашей прямой.'];
    }
    if (step === 0) {
      return ['Сначала прямая стоит почти случайно',
        'w = −0.4, b = 7: прямая идёт вниз, а точки растут вверх. Красные отрезки показывают ошибку на каждой точке, ' +
        'их средний квадрат равен ' + M0.toFixed(1) + '.'];
    }
    if (step < STEPS) {
      return ['Шаг спуска сдвигает обе ручки',
        'На каждом шаге w и b немного сдвигаются туда, где средний квадрат ошибки меньше. После ' + step +
        ' шагов: w = ' + f2(w) + ', b = ' + f2(b) + ', MSE = ' + m.toFixed(2) + '.'];
    }
    return ['Прямая подобрана',
      'После 1500 шагов w = ' + f2(w) + ', b = ' + f2(b) + ', MSE = ' + m.toFixed(2) +
      '. Точная формула метода наименьших квадратов даёт ту же прямую (пунктир). Нейросеть учится так же, только ручек у неё миллионы и миллиарды.'];
  }

  function render() {
    line.setAttribute('x1', sx(P.x0)); line.setAttribute('y1', sy(w * P.x0 + b));
    line.setAttribute('x2', sx(P.x1)); line.setAttribute('y2', sy(w * P.x1 + b));
    X.forEach(function (x, i) {
      resid[i].setAttribute('x1', sx(x)); resid[i].setAttribute('x2', sx(x));
      resid[i].setAttribute('y1', sy(Y[i])); resid[i].setAttribute('y2', sy(w * x + b));
    });
    var m = mse(w, b);
    formula.textContent = 'ŷ = ' + f2(w) + '·x ' + (b < 0 ? '− ' : '+ ') + Math.abs(b).toFixed(2);
    mseText.textContent = m.toFixed(2);
    mseText.setAttribute('fill', m < 0.3 ? '#4E8A12' : '#C30B0A');
    stepText.textContent = manual ? 'ручки выставлены вручную' : 'шагов спуска: ' + step;
    var done = step >= STEPS;
    best.setAttribute('visibility', done ? 'visible' : 'hidden');
    bestNote.setAttribute('visibility', done ? 'visible' : 'hidden');
    wIn.value = w; bIn.value = b;
    document.getElementById('aiLrWOut').textContent = f2(w);
    document.getElementById('aiLrBOut').textContent = f2(b);
    runBtn.disabled = done; stepBtn.disabled = done;
    drawCurve();
    var n = note();
    titleEl.textContent = n[0];
    textEl.textContent = n[1];
  }

  function stop() { if (timer) { cancelAnimationFrame(timer); timer = null; } }
  function doStep() {
    if (manual) { manual = false; step = 0; hist = [mse(w, b)]; }
    if (!hist.length) hist.push(mse(w, b));
    var nb = gradStep(w, b); w = nb[0]; b = nb[1]; step += 1;
    hist.push(mse(w, b));
  }
  function run() {
    stop();
    function frame() {
      var k = Math.max(1, Math.floor(step / 25));
      for (var i = 0; i < k && step < STEPS; i++) doStep();
      render();
      if (step < STEPS) timer = requestAnimationFrame(frame); else timer = null;
    }
    timer = requestAnimationFrame(frame);
  }

  stepBtn.addEventListener('click', function () { stop(); if (step < STEPS) doStep(); render(); });
  runBtn.addEventListener('click', run);
  root.querySelector('[data-lr-act="reset"]').addEventListener('click', function () {
    stop(); w = W0; b = B0; step = 0; hist = []; manual = false; render();
  });
  [wIn, bIn].forEach(function (inp) {
    inp.addEventListener('input', function () {
      stop(); w = +wIn.value; b = +bIn.value; manual = true; step = 0; hist = []; render();
    });
  });
  render();
})();
</script>

<div class="stage" id="stageWhyMlNeeded" tabindex="0">
  <div class="stage-figure">
<svg id="whyMl" viewBox="262 70 638 390" role="img" aria-label="От множества факторов и растущих правил if-else к историческим данным и модели, которая учится на них">
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
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
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
    .left-text {
      font-size: 15px;
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
      marker-end: url(#arrowHeadBlueWM);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRedWM);
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
  </style>
  <defs>
    <marker id="arrowHeadBlueWM" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRedWM" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="step1" data-only="1">
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
    </g>
    <g data-key="step2" data-only="1">
      <text x="328" y="130" class="scene-title">Попробуем решить через explicit programming</text>
      <rect x="350" y="175" width="460" height="170" class="node-blue" />
      <text x="380" y="215" class="small">если пробки сильные → добавить 40 минут</text>
      <text x="380" y="245" class="small">если дождь → добавить 15 минут</text>
      <text x="380" y="275" class="small">если плохая дорога → добавить 20 минут</text>
      <text x="380" y="305" class="small">если час пик и дождь → добавить ещё ...</text>
      <text x="584" y="390" class="formula-small center">Правил становится всё больше</text>
    </g>
    <g data-key="step3" data-only="1">
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
    </g>
    <g data-key="step4" data-only="1">
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
    </g>
    <g data-key="step5" data-only="1">
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
    </g>
    <g data-key="step6" data-only="1">
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
    </g>
    <g data-key="step7" data-only="1">
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
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · дополнительные факторы</div>
      <h4>Реальная задача сложнее</h4>
      <p>Время зависит от расстояния и скорости (S = 10 км, v = 1 км/ч), но есть
      ещё пробки, погода и дорога. Чем больше факторов, тем труднее вручную описать все
      случаи.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · много if-else</div>
      <h4>Можно писать правила вручную</h4>
      <p>Но количество условий быстро растёт: если пробки → добавить 40 минут, если дождь →
      15, если плохая дорога → 20, и так далее для каждой новой комбинации.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · сложные комбинации</div>
      <h4>Правила начинают конфликтовать</h4>
      <p>Проблема не только в количестве факторов: они работают не отдельно, а вместе.
      Дождь и час пик вместе могут увеличить время сильнее, чем каждый фактор по
      отдельности: один фактор усиливает другой.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · исторические данные</div>
      <h4>Вместо правил можно собрать данные</h4>
      <p>Каждая поездка становится примером для обучения: известны факторы поездки и
      реальное время t. Теперь ответ берётся из реального опыта, а не из ручных правил.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · обучение</div>
      <h4>Модель ищет закономерности</h4>
      <p>Она учится на примерах, где уже известен правильный ответ, и сама подбирает
      зависимость между факторами и временем: данные и ответы дают модель.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Шаг 6 · предсказание</div>
      <h4>Потом модель делает прогноз</h4>
      <p>Для новой поездки правильный ответ заранее неизвестен. Модель не знает будущее,
      но оценивает его по прошлому опыту: новые данные плюс модель дают прогноз.</p>
    </div>
    <div class="step-panel" data-on="step7" data-focus="step7">
      <div class="step-kicker">Шаг 7 · вывод</div>
      <h4>Почему здесь нужен ML</h4>
      <p>ML полезен, когда факторов много, зависимость между ними сложная, но есть история
      данных. Тогда проще показать модели примеры, чем вручную прописывать все правила.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

## Как компьютер видит мир?

У компьютера нет глаз в человеческом смысле. Картинка для него хранится как таблица чисел. В чёрно-белом изображении каждый пиксель можно представить одним числом: 0 означает чёрный, 255 означает белый, значения между ними дают разные оттенки серого.

У цветной картинки обычно три канала: R, G и B. То есть каждый пиксель хранит три числа: сколько в нём красного, зелёного и синего цвета.

Компьютер не видит «кота» сразу. На входе у него только сетка чисел. Компьютерное зрение учит модель находить в этой сетке такие комбинации пикселей, которые соответствуют осмысленным объектам: лицам, машинам, буквам, медицинским снимкам или котикам.

Разберём это на том же коте 16 × 16, на котором в разделе про явное программирование сломалось правило по одному пикселю.

<div class="stage" id="stageComputerVision" tabindex="0">
  <div class="stage-figure">
<svg id="cvPipeline" viewBox="0 0 900 400" role="img" aria-label="Тот же пиксельный кот 16 на 16: яркость пикселей, числа у глаза, три канала RGB, окно 3 на 3 рисует карту краёв, части кота и вероятности классов">
  <style>
    .cv-panel { fill: #ffffff; stroke: #3576C0; stroke-width: 1.3; stroke-opacity: 0.25; }
    .cv-title { font: 800 19px Helvetica, Arial, sans-serif; fill: #111111; }
    .cv-bold { font: 800 15px Helvetica, Arial, sans-serif; fill: #111111; }
    .cv-text { font: 15px Helvetica, Arial, sans-serif; fill: #111111; }
    .cv-small { font: 13px Helvetica, Arial, sans-serif; fill: #111111; opacity: 0.75; }
    .cv-big { font: 800 30px Helvetica, Arial, sans-serif; fill: #111111; }
    .cv-c { text-anchor: middle; dominant-baseline: middle; }
    .cv-frame { fill: none; stroke: #C30B0A; stroke-width: 3; }
    .cv-link { stroke: #C30B0A; stroke-width: 1.3; stroke-opacity: 0.6; }
    .cv-arrow { stroke: #3576C0; stroke-width: 2.2; fill: none; marker-end: url(#cvArrow); }
  </style>
  <defs>
    <marker id="cvArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <linearGradient id="cvGrayScale" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#000000" />
      <stop offset="1" stop-color="#ffffff" />
    </linearGradient>
  </defs>
  <rect x="30" y="16" width="840" height="368" rx="18" class="cv-panel" />

  <!-- 1. тот же кот -->
  <g data-key="s1" data-only="1">
    <g data-cv="color"></g>
    <rect x="144" y="181" width="19" height="19" class="cv-frame" />
    <text x="430" y="72" class="cv-title">Картинка для компьютера: таблица чисел</text>
    <text x="430" y="116" class="cv-text">Это тот же кот 16 × 16, на котором выше</text>
    <text x="430" y="140" class="cv-text">сломалось правило pixel[7][4] == 137.</text>
    <text x="430" y="184" class="cv-text">16 строк × 16 столбцов = 256 пикселей.</text>
    <text x="430" y="208" class="cv-text">Красная рамка: пиксель (7, 4), зелёный глаз.</text>
    <text x="430" y="252" class="cv-text">Уши, глаза и усы видит человек.</text>
    <text x="430" y="276" class="cv-text">В памяти компьютера лежат только числа.</text>
  </g>

  <!-- 2. яркость -->
  <g data-key="s2" data-only="1">
    <g data-cv="gray"></g>
    <rect x="144" y="181" width="19" height="19" class="cv-frame" />
    <text x="430" y="72" class="cv-title">Чёрно-белая картинка: одно число на пиксель</text>
    <rect x="430" y="130" width="400" height="34" rx="4" fill="url(#cvGrayScale)" stroke="#8E8A82" />
    <text x="430" y="186" class="cv-small">0 · чёрный</text>
    <text x="830" y="186" class="cv-small" text-anchor="end">255 · белый</text>
    <path d="M502 124 L502 112" stroke="#111111" />
    <text x="502" y="104" class="cv-small cv-c">46 · контур</text>
    <path d="M678 124 L678 112" stroke="#111111" />
    <text x="678" y="104" class="cv-small cv-c">158 · шерсть</text>
    <path d="M645 170 L645 214" stroke="#C30B0A" stroke-width="2" />
    <text x="645" y="232" class="cv-bold cv-c" style="fill:#C30B0A">137 · глаз (7, 4)</text>
    <text x="430" y="290" class="cv-text">Цвет пикселя сводится к одному числу от 0 до 255:</text>
    <text x="430" y="314" class="cv-text">чем светлее точка, тем больше число.</text>
  </g>

  <!-- 3. числа у глаза -->
  <g data-key="s3" data-only="1">
    <g data-cv="gray2"></g>
    <rect x="87" y="143" width="114" height="95" class="cv-frame" />
    <line x1="201" y1="143" x2="470" y2="52" class="cv-link" />
    <line x1="201" y1="238" x2="470" y2="322" class="cv-link" />
    <g data-cv="zoom"></g>
    <text x="626" y="356" class="cv-text cv-c">Строки 5–9, столбцы 1–6. Слова «глаз» здесь нет: только 46, 158, 137.</text>
  </g>

  <!-- 4. RGB одного пикселя -->
  <g data-key="s4" data-only="1">
    <g data-cv="color2"></g>
    <rect x="161.5" y="312.5" width="22" height="22" class="cv-frame" style="stroke:#111111;stroke-width:3.5" />
    <text x="430" y="72" class="cv-title">Цветной пиксель хранит три числа</text>
    <rect x="430" y="98" width="96" height="96" rx="6" style="fill:#C30B0A" stroke="#111111" stroke-width="3" />
    <text x="546" y="132" class="cv-bold">пиксель (14, 5): ошейник</text>
    <text x="546" y="160" class="cv-text">[195, 11, 10]</text>
    <text x="430" y="238" class="cv-bold">R</text>
    <rect x="456" y="224" width="306" height="20" rx="4" fill="#C30B0A" /><text x="772" y="239" class="cv-bold">195</text>
    <text x="430" y="274" class="cv-bold">G</text>
    <rect x="456" y="260" width="17" height="20" rx="4" fill="#73B222" /><text x="483" y="275" class="cv-bold">11</text>
    <text x="430" y="310" class="cv-bold">B</text>
    <rect x="456" y="296" width="16" height="20" rx="4" fill="#3576C0" /><text x="482" y="311" class="cv-bold">10</text>
    <text x="430" y="352" class="cv-text">Много красного, почти нет зелёного и синего.</text>
  </g>

  <!-- 5. три канала -->
  <g data-key="s5" data-only="1">
    <text x="450" y="56" class="cv-title cv-c">Картинка = три таблицы: R, G и B</text>
    <g data-cv="channels"></g>
    <text x="207" y="160" class="cv-big cv-c">=</text>
    <text x="388" y="160" class="cv-big cv-c">+</text>
    <text x="569" y="160" class="cv-big cv-c">+</text>
    <text x="117" y="256" class="cv-small cv-c">картинка</text>
    <text x="298" y="256" class="cv-small cv-c">R: сколько красного</text>
    <text x="479" y="256" class="cv-small cv-c">G: сколько зелёного</text>
    <text x="660" y="256" class="cv-small cv-c">B: сколько синего</text>
    <text x="450" y="306" class="cv-bold cv-c">16 × 16 × 3 = 768 чисел на входе модели</text>
    <text x="450" y="336" class="cv-text cv-c">У фото 4000 × 3000 пикселей таких чисел 4000 × 3000 × 3 = 36 млн.</text>
  </g>

  <!-- 6. окно бежит по коту -->
  <g data-key="s6" data-only="1">
    <text x="196" y="44" class="cv-small cv-c">яркость</text>
    <text x="616" y="44" class="cv-small cv-c">карта краёв</text>
    <g data-cv="scanGray"></g>
    <g data-cv="scanEdge"></g>
    <path d="M350 192 L462 192" class="cv-arrow" />
    <text x="406" y="178" class="cv-small cv-c">окно 3 × 3</text>
    <text x="196" y="354" class="cv-text cv-c" data-cv="readout"></text>
    <text x="616" y="354" class="cv-small cv-c">тёмная клетка: резкий перепад яркости</text>
  </g>

  <!-- 7. части -->
  <g data-key="s7" data-only="1">
    <g data-cv="edgeParts"></g>
    <rect x="77" y="73" width="85" height="68" fill="none" stroke="#3576C0" stroke-width="3" />
    <rect x="94" y="158" width="85" height="68" fill="none" stroke="#73B222" stroke-width="3" />
    <rect x="60" y="209" width="102" height="68" fill="none" stroke="#C29E08" stroke-width="3" stroke-dasharray="7 4" />
    <text x="400" y="72" class="cv-title">Из краёв складываются части</text>
    <rect x="400" y="102" width="16" height="16" fill="none" stroke="#3576C0" stroke-width="3" />
    <text x="428" y="115" class="cv-text"><tspan font-weight="800">ухо</tspan>: два наклонных края сходятся в угол</text>
    <rect x="400" y="140" width="16" height="16" fill="none" stroke="#73B222" stroke-width="3" />
    <text x="428" y="153" class="cv-text"><tspan font-weight="800">глаз</tspan>: маленькое пятно в рамке из краёв</text>
    <rect x="400" y="178" width="16" height="16" fill="none" stroke="#C29E08" stroke-width="3" stroke-dasharray="5 3" />
    <text x="428" y="191" class="cv-text"><tspan font-weight="800">усы</tspan>: короткие края по бокам морды</text>
    <text x="400" y="250" class="cv-text">Края, линии и углы собираются в формы,</text>
    <text x="400" y="274" class="cv-text">формы в части. Эти сочетания никто не размечает:</text>
    <text x="400" y="298" class="cv-text">при обучении глубокие слои находят их сами.</text>
  </g>

  <!-- 8. классы -->
  <g data-key="s8" data-only="1">
    <g data-cv="color3"></g>
    <path d="M276 196 L330 196" class="cv-arrow" />
    <text x="360" y="72" class="cv-title">Последний слой выдаёт вероятности классов</text>
    <text x="440" y="130" class="cv-bold" text-anchor="end">кот</text>
    <rect x="452" y="114" width="335" height="24" rx="5" fill="#73B222" /><text x="797" y="131" class="cv-bold">0.93</text>
    <text x="440" y="176" class="cv-bold" text-anchor="end">собака</text>
    <rect x="452" y="160" width="14" height="24" rx="5" fill="#3576C0" /><text x="476" y="177" class="cv-bold">0.04</text>
    <text x="440" y="222" class="cv-bold" text-anchor="end">лиса</text>
    <rect x="452" y="206" width="7" height="24" rx="5" fill="#C29E08" /><text x="469" y="223" class="cv-bold">0.02</text>
    <text x="440" y="268" class="cv-bold" text-anchor="end">другое</text>
    <rect x="452" y="252" width="4" height="24" rx="2" fill="#8E8A82" /><text x="466" y="269" class="cv-bold">0.01</text>
    <text x="360" y="330" class="cv-text">Ответ: класс с наибольшей вероятностью, «кот».</text>
  </g>

  <!-- 9. вся цепочка -->
  <g data-key="s9" data-only="1">
    <text x="450" y="60" class="cv-title cv-c">От чисел к «коту»</text>
    <g data-cv="chain"></g>
    <path d="M160 176 L192 176 M330 176 L362 176 M500 176 L532 176 M670 176 L702 176" class="cv-arrow" />
    <rect x="712" y="132" width="130" height="88" rx="12" style="fill:#EEF6E4" stroke="#73B222" stroke-width="1.8" />
    <text x="777" y="164" class="cv-bold cv-c">кот</text>
    <text x="777" y="192" class="cv-big cv-c">0.93</text>
    <text x="96" y="256" class="cv-small cv-c">пиксели</text>
    <text x="266" y="256" class="cv-small cv-c">яркость</text>
    <text x="436" y="256" class="cv-small cv-c">края</text>
    <text x="606" y="256" class="cv-small cv-c">части</text>
    <text x="777" y="256" class="cv-small cv-c">ответ</text>
    <text x="450" y="310" class="cv-bold cv-c">пиксели → края → формы и части → объект</text>
    <text x="450" y="340" class="cv-text cv-c">Каждый этап строит из предыдущего более сложное описание той же картинки.</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="s1" data-focus="s1">
      <div class="step-kicker">Шаг 1 · картинка</div>
      <h4>Тот же кот, теперь глазами компьютера</h4>
      <p>Возьмём кота 16 × 16 из раздела про явное программирование. На нём правило
      «если пиксель (7, 4) равен 137, то кошка» ломалось от тени и сдвига. Теперь посмотрим, что
      с этой картинкой делает модель. Для компьютера кот хранится как таблица из 256 пикселей.</p>
    </div>
    <div class="step-panel" data-on="s2" data-focus="s2">
      <div class="step-kicker">Шаг 2 · яркость</div>
      <h4>В чёрно-белой картинке пиксель равен одному числу</h4>
      <p>0 означает чёрный, 255 белый, значения между ними дают оттенки серого. Тёмный контур кота
      равен 46, рыжая шерсть 158, зелёный глаз в клетке (7, 4) равен 137.</p>
    </div>
    <div class="step-panel" data-on="s3" data-focus="s3">
      <div class="step-kicker">Шаг 3 · числа у глаза</div>
      <h4>Вот что на самом деле получает компьютер</h4>
      <p>Увеличим кусок 5 × 6 у левого глаза. В клетках только числа: 46 там, где контур, 158 на
      шерсти, 137 на глазу. Признака «это глаз» в таблице нет, его ещё предстоит найти.</p>
    </div>
    <div class="step-panel" data-on="s4" data-focus="s4">
      <div class="step-kicker">Шаг 4 · RGB</div>
      <h4>Цветной пиксель хранит три числа</h4>
      <p>У цветной картинки три канала: R, G и B. Каждый пиксель хранит, сколько в нём красного,
      зелёного и синего. Пиксель ошейника равен [195, 11, 10]: много красного, почти нет зелёного
      и синего.</p>
    </div>
    <div class="step-panel" data-on="s5" data-focus="s5">
      <div class="step-kicker">Шаг 5 · три канала</div>
      <h4>Картинка раскладывается на три таблицы</h4>
      <p>Каждый канал хранится отдельной матрицей 16 × 16. Вместе это 16 × 16 × 3 = 768 чисел, и
      именно их получает модель на вход. У фотографии 4000 × 3000 пикселей таких чисел 36 миллионов.</p>
    </div>
    <div class="step-panel" data-on="s6" data-focus="s6">
      <div class="step-kicker">Шаг 6 · края</div>
      <h4>Первые слои ищут края</h4>
      <p>Окно 3 × 3 проходит по всей картинке и в каждой точке сравнивает яркость слева и справа,
      сверху и снизу. Где перепад резкий, на карте появляется тёмная клетка. У левого уха, в клетке
      (3, 2), яркость меняется с 197 на 46, и окно даёт сильный край. Здесь окно задано вручную
      (фильтр Собеля); в настоящей сети числа в таких окнах подбираются при обучении.</p>
    </div>
    <div class="step-panel" data-on="s7" data-focus="s7">
      <div class="step-kicker">Шаг 7 · формы и части</div>
      <h4>Края складываются в части объекта</h4>
      <p>Следующие слои собирают края в формы, а формы в части: два наклонных края, сходящихся
      в угол, дают ухо, маленькое пятно в рамке из краёв даёт глаз, короткие края по бокам морды
      дают усы. Никто вручную не говорит модели «вот это ухо»: такие признаки она находит при обучении.</p>
    </div>
    <div class="step-panel" data-on="s8" data-focus="s8">
      <div class="step-kicker">Шаг 8 · классификация</div>
      <h4>Части объекта дают общий ответ</h4>
      <p>Последний слой оценивает, что изображено на картинке: кот 0.93, собака 0.04, лиса 0.02,
      другое 0.01. Модель выбирает класс с наибольшей вероятностью.</p>
    </div>
    <div class="step-panel" data-on="s9" data-focus="s9">
      <div class="step-kicker">Шаг 9 · вся цепочка</div>
      <h4>От чисел к «коту»</h4>
      <p>Пиксели → края → формы и части → объект. На входе 768 чисел, на выходе вероятность
      «кот» 0.93. Ручное правило по одному пикселю ломалось от тени и сдвига. Модель опирается на
      сочетания краёв и частей: в тени перепады яркости слабее, но идут по тем же границам, а
      после сдвига ухо остаётся ухом, просто в другом месте картинки.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<script>
(function () {
  'use strict';
  var stage = document.getElementById('stageComputerVision');
  if (!stage) return;
  var svg = stage.querySelector('svg');
  var NS = 'http://www.w3.org/2000/svg';
  var PAL = {
    '.': [172, 203, 236], d: [58, 42, 34], o: [232, 142, 44], p: [238, 150, 162], w: [246, 244, 238],
    g: [96, 172, 64], k: [90, 90, 90], r: [195, 11, 10], y: [240, 200, 40]
  };
  var CAT = [
    '................', '..d..........d..', '..dd........dd..', '..dpd......dpd..',
    '..dppddddddppd..', '.dooooooooooood.', '.dooooooooooood.', '.doogdoooodgood.',
    '.doodgoooogdood.', '.dooooooooooood.', 'kdwwwwwppwwwwwdk', 'kdwwwwdwwdwwwwdk',
    '..dwwwwddwwwwd..', '...dddddddddd...', '....rrrrrrrr....', '....rrryyrrr....'
  ];
  var N = 16;
  var RGB = CAT.map(function (row) { return row.split('').map(function (ch) { return PAL[ch]; }); });
  var GRAY = RGB.map(function (row) {
    return row.map(function (c) { return Math.round(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]); });
  });
  // фильтр Собеля по яркости, края дополняются соседним значением (как в видео)
  function g(r, c) { return GRAY[Math.min(N - 1, Math.max(0, r))][Math.min(N - 1, Math.max(0, c))]; }
  var MAG = [], MAX = 0;
  for (var r = 0; r < N; r++) {
    MAG.push([]);
    for (var c = 0; c < N; c++) {
      var gx = -g(r - 1, c - 1) + g(r - 1, c + 1) - 2 * g(r, c - 1) + 2 * g(r, c + 1) - g(r + 1, c - 1) + g(r + 1, c + 1);
      var gy = -g(r - 1, c - 1) - 2 * g(r - 1, c) - g(r - 1, c + 1) + g(r + 1, c - 1) + 2 * g(r + 1, c) + g(r + 1, c + 1);
      var m = Math.sqrt(gx * gx + gy * gy);
      MAG[r].push(m);
      if (m > MAX) MAX = m;
    }
  }

  function el(name, attrs, parent, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function rgb(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }
  function gray(v) { return rgb([v, v, v]); }
  function edge(m) { var v = Math.round(255 - 225 * m / MAX); return gray(v); }
  function slot(name) { return svg.querySelector('[data-cv="' + name + '"]'); }
  function grid(parent, x, y, cell, fill, line) {
    var cells = [];
    for (var r = 0; r < N; r++) {
      cells.push([]);
      for (var c = 0; c < N; c++) {
        cells[r].push(el('rect', { x: x + c * cell, y: y + r * cell, width: cell, height: cell, fill: fill(r, c),
                                   stroke: '#ffffff', 'stroke-width': line === undefined ? 0.6 : line }, parent));
      }
    }
    return cells;
  }
  var colorAt = function (r, c) { return rgb(RGB[r][c]); };
  var grayAt = function (r, c) { return gray(GRAY[r][c]); };
  var edgeAt = function (r, c) { return edge(MAG[r][c]); };

  // большие коты: левый верхний угол (68, 48), клетка 19
  grid(slot('color'), 68, 48, 19, colorAt);
  grid(slot('gray'), 68, 48, 19, grayAt);
  grid(slot('gray2'), 68, 48, 19, grayAt);
  grid(slot('color2'), 68, 48, 19, colorAt);

  // увеличенный кусок у глаза: строки 5–9, столбцы 1–6
  var zoom = slot('zoom'), Z = 52;
  for (var zr = 5; zr <= 9; zr++) {
    for (var zc = 1; zc <= 6; zc++) {
      var v = GRAY[zr][zc], zx = 470 + (zc - 1) * Z, zy = 52 + (zr - 5) * Z;
      var eye = zr === 7 && zc === 4;
      el('rect', { x: zx, y: zy, width: Z, height: Z, fill: gray(v), stroke: eye ? '#C30B0A' : '#ffffff', 'stroke-width': eye ? 3 : 1 }, zoom);
      el('text', { x: zx + Z / 2, y: zy + Z / 2 + 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800,
                   'font-family': 'Helvetica, Arial, sans-serif', fill: v < 110 ? '#ffffff' : '#111111' }, zoom, v);
    }
  }

  // три канала, клетка 9
  var ch = slot('channels');
  grid(ch, 45, 88, 9, colorAt, 0);
  grid(ch, 226, 88, 9, function (r, c) { return rgb([RGB[r][c][0], 0, 0]); }, 0);
  grid(ch, 407, 88, 9, function (r, c) { return rgb([0, RGB[r][c][1], 0]); }, 0);
  grid(ch, 588, 88, 9, function (r, c) { return rgb([0, 0, RGB[r][c][2]]); }, 0);

  // части на карте краёв, клетка 17
  grid(slot('edgeParts'), 60, 56, 17, edgeAt, 0.5);
  grid(slot('color3'), 70, 100, 12, colorAt, 0.4);

  // цепочка: пиксели, яркость, края, части; клетка 7
  var chain = slot('chain');
  grid(chain, 40, 120, 7, colorAt, 0);
  grid(chain, 210, 120, 7, grayAt, 0);
  grid(chain, 380, 120, 7, edgeAt, 0);
  grid(chain, 550, 120, 7, edgeAt, 0);
  [[1, 4, 1, 5, '#3576C0'], [6, 9, 2, 6, '#73B222'], [9, 12, 0, 5, '#C29E08']].forEach(function (p) {
    el('rect', { x: 550 + p[2] * 7, y: 120 + p[0] * 7, width: (p[3] - p[2] + 1) * 7, height: (p[1] - p[0] + 1) * 7,
                 fill: 'none', stroke: p[4], 'stroke-width': 2 }, chain);
  });

  // шаг 6: окно 3 × 3 бежит по коту и дорисовывает карту краёв
  var S = 17, GX = 60, GY = 56, EX = 480;
  var scanGray = slot('scanGray'), scanEdge = slot('scanEdge'), readout = slot('readout');
  grid(scanGray, GX, GY, S, grayAt, 0.5);
  var edgeCells = grid(scanEdge, EX, GY, S, function () { return '#ffffff'; }, 0.5);
  el('rect', { x: EX, y: GY, width: N * S, height: N * S, fill: 'none', stroke: '#E0DDD3' }, scanEdge);
  var win = el('rect', { width: 3 * S, height: 3 * S, fill: 'none', stroke: '#C30B0A', 'stroke-width': 3 }, scanGray);
  var mark = el('rect', { width: S, height: S, fill: 'none', stroke: '#C30B0A', 'stroke-width': 2.5 }, scanEdge);
  var group = svg.querySelector('[data-key="s6"]');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var k = 0, shown = false;

  function place(i) {
    var r = Math.floor(i / N), c = i % N;
    win.setAttribute('x', GX + (c - 1) * S); win.setAttribute('y', GY + (r - 1) * S);
    mark.setAttribute('x', EX + c * S); mark.setAttribute('y', GY + r * S);
    edgeCells[r][c].setAttribute('fill', edgeAt(r, c));
    readout.textContent = 'окно у (' + r + ', ' + c + '): сила края ' + Math.round(MAG[r][c]);
  }
  function reset() {
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) edgeCells[r][c].setAttribute('fill', '#ffffff');
    k = 0;
  }
  function finish() {
    for (var i = 0; i < N * N; i++) place(i);
    place(3 * N + 2);
    k = N * N;
  }
  setInterval(function () {
    var visible = !group.classList.contains('is-hidden');
    if (!visible) { shown = false; return; }
    if (!shown) { shown = true; reset(); if (still) { finish(); return; } }
    if (k < N * N) { place(k); k += 1; if (k === N * N) place(3 * N + 2); }
  }, 32);
})();
</script>

## Как компьютер пишет тексты?

Текст для модели тоже превращается в числа. Сначала фраза разбивается на токены: слова, части слов, знаки препинания или отдельные символы. Затем каждому токену присваивается числовой идентификатор.

Большая языковая модель обучается на огромном количестве текстов. Её базовая учебная задача очень простая: предсказать следующий токен по предыдущим.

Например, если модель видит начало фразы:

> Кошка сидит на ...

она должна оценить, какой токен вероятнее всего будет следующим: «стуле», «диване», «крыше», «полу» и так далее.

Делая это миллиарды раз, модель учится грамматике, стилю, фактам, типичным рассуждениям и структуре языка. Когда мы просим её написать ответ, она продолжает тот же процесс: оценивает вероятности следующих токенов и генерирует текст шаг за шагом. Следующий токен не обязательно самый вероятный: часто его выбирают случайно, с теми вероятностями, которые посчитала модель. Поэтому на один и тот же вопрос она может ответить по-разному.

LLM не достаёт готовый ответ из базы данных, как поисковик. Она строит продолжение текста по вероятностям. Поэтому такие модели могут звучать убедительно, но иногда ошибаться. Их нужно проверять, особенно в фактах, цифрах, законах, медицине и технических деталях.

<div class="stage" id="stageLlmGeneration" tabindex="0">
  <div class="stage-figure">
<svg id="llmGen" viewBox="0 0 900 400" role="img" aria-label="LLM разбивает текст на токены с номерами, учится угадывать следующий токен, оценивает вероятности продолжений, генерирует текст токен за токеном и выбирает токены случайно с этими вероятностями">
  <style>
    .lg-panel { fill: #ffffff; stroke: #3576C0; stroke-width: 1.3; stroke-opacity: 0.25; }
    .lg-title { font: 800 20px Helvetica, Arial, sans-serif; fill: #111111; }
    .lg-bold { font: 800 16px Helvetica, Arial, sans-serif; fill: #111111; }
    .lg-big { font: 800 24px Helvetica, Arial, sans-serif; fill: #111111; }
    .lg-text { font: 15px Helvetica, Arial, sans-serif; fill: #111111; }
    .lg-small { font: 13px Helvetica, Arial, sans-serif; fill: #111111; opacity: 0.75; }
    .lg-id { font: 700 15px Menlo, Consolas, "Courier New", monospace; fill: #3576C0; }
    .lg-c { text-anchor: middle; dominant-baseline: middle; }
    .lg-tok { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    .lg-tok-y { fill: #ffffff; stroke: #C29E08; stroke-width: 1.6; }
    .lg-tok-r { fill: #ffffff; stroke: #C30B0A; stroke-width: 1.8; }
    .lg-tok-g { fill: #EEF6E4; stroke: #73B222; stroke-width: 1.8; }
    .lg-grey { fill: #F7F5EF; stroke: #8E8A82; stroke-width: 1.4; }
    .lg-arrow { stroke: #3576C0; stroke-width: 2.2; fill: none; marker-end: url(#lgArrow); }
    .lg-arc { stroke: #C30B0A; stroke-width: 1.8; fill: none; marker-end: url(#lgArrowRed); }
  </style>
  <defs>
    <marker id="lgArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="lgArrowRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <rect x="30" y="16" width="840" height="368" rx="18" class="lg-panel" />

  <!-- заголовки шагов -->
  <g data-key="t1" data-only="1"><text x="450" y="58" class="lg-title lg-c">Модель получает начало текста</text></g>
  <g data-key="t2" data-only="1"><text x="450" y="58" class="lg-title lg-c">Текст → токены</text></g>
  <g data-key="t3" data-only="1"><text x="450" y="58" class="lg-title lg-c">Токены → номера</text></g>
  <g data-key="t5" data-only="1"><text x="450" y="58" class="lg-title lg-c">Модель смотрит на все предыдущие токены</text></g>
  <g data-key="t7" data-only="1"><text x="450" y="58" class="lg-title lg-c">Выбранный токен добавляется к тексту</text></g>

  <!-- 1. фраза целиком -->
  <g data-key="phrase" data-only="1">
    <rect x="230" y="140" width="440" height="80" rx="14" class="lg-tok-y" />
    <text x="450" y="180" class="lg-big lg-c">Кошка сидит на …</text>
    <text x="450" y="290" class="lg-text lg-c">Пока это просто строка символов. Модель считает только числа,</text>
    <text x="450" y="314" class="lg-text lg-c">поэтому текст сначала нужно разрезать и пронумеровать.</text>
  </g>

  <!-- 2–3, 5, 7. ряд токенов -->
  <g data-key="tokens" data-only="1">
    <rect x="170" y="130" width="90" height="54" rx="9" class="lg-tok" /><text x="215" y="157" class="lg-bold lg-c">Кош</text>
    <rect x="270" y="130" width="70" height="54" rx="9" class="lg-tok" /><text x="305" y="157" class="lg-bold lg-c">ка</text>
    <rect x="350" y="130" width="110" height="54" rx="9" class="lg-tok" /><text x="405" y="157" class="lg-bold lg-c">сидит</text>
    <rect x="470" y="130" width="70" height="54" rx="9" class="lg-tok" /><text x="505" y="157" class="lg-bold lg-c">на</text>
  </g>
  <g data-key="tokNote" data-only="1">
    <text x="450" y="270" class="lg-text lg-c">Токен: слово, часть слова или знак препинания.</text>
    <text x="450" y="296" class="lg-text lg-c">Слово может разрезаться на куски: «Кошка» → «Кош» + «ка».</text>
  </g>
  <g data-key="ids" data-only="1">
    <text x="215" y="212" class="lg-id lg-c">48213</text>
    <text x="305" y="212" class="lg-id lg-c">1023</text>
    <text x="405" y="212" class="lg-id lg-c">27591</text>
    <text x="505" y="212" class="lg-id lg-c">1186</text>
    <text x="580" y="212" class="lg-small">← номер в словаре</text>
    <text x="450" y="280" class="lg-text lg-c">У каждого токена свой номер в словаре модели. Номера здесь условные:</text>
    <text x="450" y="306" class="lg-text lg-c">словарь настоящей модели содержит десятки или сотни тысяч токенов.</text>
  </g>

  <!-- 4. учебные задачи из одной фразы -->
  <g data-key="tasks" data-only="1">
    <text x="450" y="50" class="lg-title lg-c">Учебная задача: угадать следующий токен</text>
    <text x="450" y="78" class="lg-small lg-c">строка из обучающих текстов: «Кошка сидит на стуле»</text>
    <rect x="150" y="98" width="330" height="40" rx="8" class="lg-tok" /><text x="166" y="118" class="lg-text" dominant-baseline="middle">Кош</text>
    <path d="M492 118 L560 118" class="lg-arrow" />
    <rect x="572" y="98" width="130" height="40" rx="8" class="lg-tok-g" /><text x="637" y="118" class="lg-bold lg-c">ка</text>
    <rect x="150" y="148" width="330" height="40" rx="8" class="lg-tok" /><text x="166" y="168" class="lg-text" dominant-baseline="middle">Кош | ка</text>
    <path d="M492 168 L560 168" class="lg-arrow" />
    <rect x="572" y="148" width="130" height="40" rx="8" class="lg-tok-g" /><text x="637" y="168" class="lg-bold lg-c">сидит</text>
    <rect x="150" y="198" width="330" height="40" rx="8" class="lg-tok" /><text x="166" y="218" class="lg-text" dominant-baseline="middle">Кош | ка | сидит</text>
    <path d="M492 218 L560 218" class="lg-arrow" />
    <rect x="572" y="198" width="130" height="40" rx="8" class="lg-tok-g" /><text x="637" y="218" class="lg-bold lg-c">на</text>
    <rect x="150" y="248" width="330" height="40" rx="8" class="lg-tok" /><text x="166" y="268" class="lg-text" dominant-baseline="middle">Кош | ка | сидит | на</text>
    <path d="M492 268 L560 268" class="lg-arrow" />
    <rect x="572" y="248" width="130" height="40" rx="8" class="lg-tok-g" /><text x="637" y="268" class="lg-bold lg-c">стуле</text>
    <text x="315" y="312" class="lg-small lg-c">что модель видит</text>
    <text x="637" y="312" class="lg-small lg-c">правильный ответ</text>
    <text x="450" y="352" class="lg-text lg-c">Одна строка даёт сразу четыре задачи. Ответ уже есть в самом тексте.</text>
  </g>

  <!-- 5. контекст -->
  <g data-key="ask" data-only="1">
    <rect x="600" y="124" width="120" height="66" rx="10" class="lg-tok-r" />
    <text x="660" y="157" style="fill:#C30B0A" class="lg-big lg-c">?</text>
  </g>
  <g data-key="arcs" data-only="1">
    <path d="M215 186 Q430 300 640 194" class="lg-arc" />
    <path d="M305 186 Q470 280 650 194" class="lg-arc" />
    <path d="M405 186 Q530 262 658 194" class="lg-arc" />
    <path d="M505 186 Q580 240 666 194" class="lg-arc" />
    <text x="450" y="318" class="lg-text lg-c">Чтобы выбрать продолжение, модель учитывает все токены слева,</text>
    <text x="450" y="344" class="lg-text lg-c">а не только последнее слово «на».</text>
  </g>

  <!-- 6. вероятности -->
  <g data-key="probs" data-only="1">
    <text x="450" y="54" class="lg-title lg-c">Модель оценивает варианты продолжения</text>
    <text x="450" y="86" class="lg-text lg-c">«Кошка сидит на …»</text>
    <text x="250" y="132" class="lg-bold" text-anchor="end">стуле</text>
    <rect x="265" y="114" width="300" height="26" rx="5" fill="#73B222" fill-opacity="0.85" />
    <text x="575" y="132" class="lg-bold">0.45</text>
    <text x="250" y="178" class="lg-bold" text-anchor="end">диване</text>
    <rect x="265" y="160" width="200" height="26" rx="5" fill="#3576C0" fill-opacity="0.85" />
    <text x="475" y="178" class="lg-bold">0.30</text>
    <text x="250" y="224" class="lg-bold" text-anchor="end">крыше</text>
    <rect x="265" y="206" width="113" height="26" rx="5" fill="#C29E08" fill-opacity="0.85" />
    <text x="388" y="224" class="lg-bold">0.17</text>
    <text x="250" y="270" class="lg-bold" text-anchor="end">полу</text>
    <rect x="265" y="252" width="53" height="26" rx="5" fill="#8E8A82" fill-opacity="0.85" />
    <text x="328" y="270" class="lg-bold">0.08</text>
    <text x="450" y="330" class="lg-text lg-c">Для каждого токена словаря модель выдаёт вероятность. Здесь показаны</text>
    <text x="450" y="354" class="lg-text lg-c">четыре самых вероятных, вместе они дают 1.</text>
  </g>

  <!-- 7. выбор -->
  <g data-key="picked" data-only="1">
    <rect x="550" y="130" width="100" height="54" rx="9" class="lg-tok-g" />
    <text x="600" y="157" class="lg-bold lg-c">стуле</text>
    <rect x="660" y="130" width="60" height="54" rx="9" class="lg-tok-r" />
    <text x="690" y="157" style="fill:#C30B0A" class="lg-bold lg-c">?</text>
    <text x="450" y="252" class="lg-text lg-c">Новый вход: «Кошка сидит на стуле».</text>
    <text x="450" y="280" class="lg-text lg-c">Модель снова считает вероятности, теперь для следующего токена.</text>
  </g>

  <!-- 8. цикл -->
  <g data-key="loop" data-only="1">
    <text x="450" y="54" class="lg-title lg-c">Ответ растёт по одному токену</text>
    <rect x="130" y="80" width="640" height="200" rx="12" class="lg-tok-y" />
    <text x="160" y="116" class="lg-small">шаг 1</text>
    <text x="240" y="116" class="lg-text">Кошка сидит на <tspan font-weight="800" fill="#4E8A12">стуле</tspan></text>
    <text x="160" y="160" class="lg-small">шаг 2</text>
    <text x="240" y="160" class="lg-text">Кошка сидит на стуле <tspan font-weight="800" fill="#4E8A12">у</tspan></text>
    <text x="160" y="204" class="lg-small">шаг 3</text>
    <text x="240" y="204" class="lg-text">Кошка сидит на стуле у <tspan font-weight="800" fill="#4E8A12">окна</tspan></text>
    <text x="160" y="248" class="lg-small">шаг 4</text>
    <text x="240" y="248" class="lg-text">Кошка сидит на стуле у окна<tspan font-weight="800" fill="#4E8A12">.</tspan></text>
    <text x="620" y="248" class="lg-small">точка: конец ответа</text>
    <text x="450" y="322" class="lg-bold lg-c">предсказать → добавить → повторить</text>
    <text x="450" y="350" class="lg-text lg-c">Весь ответ сразу модель не пишет: каждый токен требует нового прохода.</text>
  </g>

  <!-- 9. сэмплирование -->
  <g data-key="sample" data-only="1">
    <text x="450" y="54" class="lg-title lg-c">Шесть запусков на одном и том же начале</text>
    <text x="110" y="100" class="lg-small">запуск 1</text><text x="190" y="100" class="lg-text">Кошка сидит на <tspan font-weight="800" fill="#4E8A12">стуле</tspan></text>
    <text x="110" y="134" class="lg-small">запуск 2</text><text x="190" y="134" class="lg-text">Кошка сидит на <tspan font-weight="800" fill="#4E8A12">стуле</tspan></text>
    <text x="110" y="168" class="lg-small">запуск 3</text><text x="190" y="168" class="lg-text">Кошка сидит на <tspan font-weight="800" fill="#A38404">крыше</tspan></text>
    <text x="110" y="202" class="lg-small">запуск 4</text><text x="190" y="202" class="lg-text">Кошка сидит на <tspan font-weight="800" fill="#4E8A12">стуле</tspan></text>
    <text x="110" y="236" class="lg-small">запуск 5</text><text x="190" y="236" class="lg-text">Кошка сидит на <tspan font-weight="800" fill="#3576C0">диване</tspan></text>
    <text x="110" y="270" class="lg-small">запуск 6</text><text x="190" y="270" class="lg-text">Кошка сидит на <tspan font-weight="800" fill="#3576C0">диване</tspan></text>
    <line x1="470" y1="82" x2="470" y2="282" stroke="#3576C0" stroke-opacity="0.25" />
    <text x="500" y="100" class="lg-small">слово</text><text x="640" y="100" class="lg-small">раз</text><text x="740" y="100" class="lg-small">вероятность</text>
    <text x="500" y="140" class="lg-bold">стуле</text><rect x="590" y="126" width="45" height="20" rx="4" fill="#73B222" /><text x="645" y="141" class="lg-bold">3</text><text x="740" y="140" class="lg-text">0.45</text>
    <text x="500" y="180" class="lg-bold">диване</text><rect x="590" y="166" width="30" height="20" rx="4" fill="#3576C0" /><text x="630" y="181" class="lg-bold">2</text><text x="740" y="180" class="lg-text">0.30</text>
    <text x="500" y="220" class="lg-bold">крыше</text><rect x="590" y="206" width="15" height="20" rx="4" fill="#C29E08" /><text x="615" y="221" class="lg-bold">1</text><text x="740" y="220" class="lg-text">0.17</text>
    <text x="500" y="260" class="lg-bold">полу</text><text x="600" y="261" class="lg-bold">0</text><text x="740" y="260" class="lg-text">0.08</text>
    <text x="450" y="326" class="lg-text lg-c">Токен выбирают случайно с вероятностями модели: «стуле» выпадает</text>
    <text x="450" y="350" class="lg-text lg-c">примерно в 45 запусках из 100, «полу» в 8. Поэтому ответы различаются.</text>
  </g>

  <!-- 10. поисковик и LLM -->
  <g data-key="search" data-only="1">
    <text x="450" y="50" class="lg-title lg-c">Поисковик и LLM работают по-разному</text>
    <rect x="80" y="76" width="350" height="200" rx="14" class="lg-grey" />
    <text x="255" y="104" class="lg-bold lg-c">Поисковик</text>
    <text x="255" y="140" class="lg-text lg-c">запрос</text>
    <path d="M255 152 L255 172" class="lg-arrow" />
    <text x="255" y="190" class="lg-text lg-c">индекс готовых страниц</text>
    <path d="M255 202 L255 222" class="lg-arrow" />
    <text x="255" y="242" class="lg-text lg-c">страница, которую написал человек,</text>
    <text x="255" y="262" class="lg-small lg-c">со ссылкой на источник</text>
    <rect x="470" y="76" width="350" height="200" rx="14" style="fill:#F0F5FB" class="lg-tok" />
    <text x="645" y="104" style="fill:#3576C0" class="lg-bold lg-c">LLM</text>
    <text x="645" y="140" class="lg-text lg-c">начало текста</text>
    <path d="M645 152 L645 172" class="lg-arrow" />
    <text x="645" y="190" class="lg-text lg-c">вероятности следующего токена</text>
    <path d="M645 202 L645 222" class="lg-arrow" />
    <text x="645" y="242" class="lg-text lg-c">новый текст, токен за токеном;</text>
    <text x="645" y="262" class="lg-small lg-c">готового ответа в базе нет</text>
    <rect x="80" y="300" width="740" height="62" rx="12" fill="#FBEDEC" stroke="#C30B0A" stroke-width="1.4" />
    <text x="450" y="322" style="fill:#C30B0A" class="lg-bold lg-c">Вероятный текст может звучать убедительно и содержать ошибку.</text>
    <text x="450" y="346" class="lg-text lg-c">Проверяйте факты, цифры, законы, медицину и технические детали.</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="t1 phrase" data-focus="phrase">
      <div class="step-kicker">Шаг 1 · начало текста</div>
      <h4>Модель получает фразу «Кошка сидит на …»</h4>
      <p>Её нужно продолжить. Но модель работает только с числами, поэтому строку символов
      сначала надо превратить в числа.</p>
    </div>
    <div class="step-panel" data-on="t2 tokens tokNote" data-focus="tokens">
      <div class="step-kicker">Шаг 2 · токены</div>
      <h4>Фраза разбивается на токены</h4>
      <p>Токеном может быть слово, часть слова или знак препинания. Здесь «Кошка» распалась на
      два куска, «Кош» и «ка», а «сидит» и «на» остались целыми словами.</p>
    </div>
    <div class="step-panel" data-on="t3 tokens ids" data-focus="ids">
      <div class="step-kicker">Шаг 3 · номера</div>
      <h4>Каждому токену присваивается номер</h4>
      <p>Номер берётся из словаря модели: «Кош» → 48213, «ка» → 1023, «сидит» → 27591, «на» → 1186.
      Номера условные, у настоящей модели они зависят от её словаря на десятки или сотни
      тысяч токенов. Дальше модель работает с этими числами.</p>
    </div>
    <div class="step-panel" data-on="tasks" data-focus="tasks">
      <div class="step-kicker">Шаг 4 · учебная задача</div>
      <h4>Предсказать следующий токен по предыдущим</h4>
      <p>Модель обучают на огромном количестве текстов. Каждая строка превращается в набор задач:
      по «Кош» угадать «ка», по «Кош ка» угадать «сидит» и так далее. Правильный ответ всегда
      следующий токен того же текста, поэтому размечать данные вручную не нужно.</p>
    </div>
    <div class="step-panel" data-on="t5 tokens ask arcs" data-focus="arcs">
      <div class="step-kicker">Шаг 5 · контекст</div>
      <h4>Модель смотрит на все предыдущие токены</h4>
      <p>Чтобы оценить следующий токен, модель учитывает весь контекст слева. После «на» могло бы
      идти что угодно, а «Кошка сидит на» сужает выбор до мест, где сидят кошки.</p>
    </div>
    <div class="step-panel" data-on="probs" data-focus="probs">
      <div class="step-kicker">Шаг 6 · вероятности</div>
      <h4>Модель оценивает варианты продолжения</h4>
      <p>На выходе она выдаёт вероятность для каждого токена словаря: «стуле» 0.45, «диване» 0.30,
      «крыше» 0.17, «полу» 0.08. Именно этим вероятностям модель училась на шаге 4: правильный
      ответ из текста должен получать высокую вероятность.</p>
    </div>
    <div class="step-panel" data-on="t7 tokens picked" data-focus="picked">
      <div class="step-kicker">Шаг 7 · выбор токена</div>
      <h4>Один токен добавляется к тексту</h4>
      <p>Из вариантов выбирается один, например «стуле», и встаёт в конец фразы. Теперь вход
      «Кошка сидит на стуле», и модель заново оценивает вероятности для следующего токена.</p>
    </div>
    <div class="step-panel" data-on="loop" data-focus="loop">
      <div class="step-kicker">Шаг 8 · генерация</div>
      <h4>Ответ собирается токен за токеном</h4>
      <p>Предсказать, добавить, повторить: так появляются «у», «окна» и точка. Цикл идёт, пока
      модель не выдаст токен конца ответа. Каждый новый токен требует нового прохода по всему
      тексту.</p>
    </div>
    <div class="step-panel" data-on="sample" data-focus="sample">
      <div class="step-kicker">Шаг 9 · случайный выбор</div>
      <h4>Один и тот же вопрос, разные ответы</h4>
      <p>Брать каждый раз самый вероятный токен не обязательно. Часто токен выбирают случайно,
      с вероятностями модели. В шести запусках на одном начале вышло: «стуле» 3 раза, «диване»
      2 раза, «крыше» 1 раз. Поэтому на одинаковый вопрос модель может ответить по-разному.</p>
    </div>
    <div class="step-panel" data-on="search" data-focus="search">
      <div class="step-kicker">Шаг 10 · не поисковик</div>
      <h4>LLM строит текст, а не достаёт его из базы</h4>
      <p>Поисковик находит страницу, которую уже кто-то написал, и показывает источник. LLM собирает
      новый текст по вероятностям токенов. Вероятное продолжение может звучать убедительно и всё
      равно содержать ошибку, поэтому факты, цифры, законы, медицину и технические детали нужно
      проверять.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

## Почему обучение называют глубоким?

«Глубина» здесь почти буквальная: это количество слоёв в нейронной сети. Простая сеть может иметь один или несколько слоёв. В глубокой сети десятки, сотни, а иногда и больше вычислительных блоков.

Каждый слой превращает данные в новое представление. В компьютерном зрении первые слои могут реагировать на простые элементы: границы, углы, пятна цвета. Следующие слои собирают из них формы. Более глубокие слои распознают части объектов. И только ближе к выходу появляется высокоуровневое представление: «похоже на кота», «похоже на автомобиль», «похоже на лицо».

С текстом идея похожая: ранние уровни работают с токенами и локальными связями, а более глубокие блоки помогают модели строить более сложные зависимости между словами, фразами и смысловыми частями текста.

Именно эта иерархия представлений делает глубокое обучение таким мощным. Модель не получает признаки полностью вручную. Она постепенно строит их сама, от простых к более абстрактным.

## Итог

Если собрать всё вместе:

- искусственный интеллект: попытка воспроизвести разумное поведение в машине;
- машинное обучение: современный подход внутри ИИ, где машина учится на данных вместо ручного перечисления правил;
- глубокое обучение: часть машинного обучения, основанная на многослойных нейронных сетях;
- компьютерное зрение учит модель понимать изображения как числовые матрицы;
- большие языковые модели работают с текстом как с последовательностью токенов и учатся предсказывать следующий токен.

Современный ИИ силён не потому, что программист заранее написал все правила, а потому, что модель может находить сложные закономерности в данных и применять их к новым ситуациям.
