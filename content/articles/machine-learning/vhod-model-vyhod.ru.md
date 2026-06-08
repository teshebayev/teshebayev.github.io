> **В этой статье.** Прежде чем разбираться, *как* модель машинного обучения учится и что у неё внутри, полезно посмотреть на неё снаружи — как на **чёрную коробку**. У коробки есть только две стороны, которые нас сейчас интересуют: что мы в неё *кладём* (вход) и что из неё *достаём* (выход). Оказывается, почти все задачи ML можно разложить именно по этим двум осям. И заодно станет понятно, почему выбор самой модели — это во многом следствие того, *что у нас на входе* и *что мы хотим на выходе*.

## 1. Карта машинного обучения: три области

Прежде чем открывать коробку, полезно увидеть карту целиком. Машинное обучение обычно делят на три большие области — по тому, **как** модель учится и какую обратную связь она при этом получает.

- **Обучение с учителем (Supervised)** — у каждого примера есть правильный ответ. Модель учится на парах «*вход → правильный выход*».
- **Обучение без учителя (Unsupervised)** — правильных ответов нет. Модель сама ищет структуру в данных: кластеры, закономерности, сжатые представления.
- **Обучение с подкреплением (Reinforcement Learning)** — агент действует в среде, получает награды или штраф и учится максимизировать награду.

Дальше статья будет говорить в основном про **обучение с учителем**: именно сам взгляд «вход → модель → выход *с правильным ответом*» работает напрямую. Но сначала — короткая прогулка по всем трём областям.

<figure class="embedded-interactive" id="section-interactive-1">
  <div class="interactive-meta">Интерактив 1</div>
  <p class="interactive-desc">Три области машинного обучения: с учителем, без учителя, с подкреплением</p>
  <div class="interactive-svg-wrap">
<svg id="mlParadigmsMap" viewBox="0 0 960 680" width="100%" role="img" aria-label="Три области машинного обучения">
  <style>
    svg { background:#ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size:24px; font-weight:800; fill:#111111; }
    .subtitle { font-size:15px; fill:#5E5850; }
    .text { font-size:16px; fill:#111111; }
    .small { font-size:13px; fill:#5E5850; }
    .label { font-size:14px; font-weight:700; fill:#111111; }
    .box-blue { fill:#ffffff; stroke:#3576C0; stroke-width:1.5; rx:14; }
    .box-yellow { fill:#FFFBEB; stroke:#C29E08; stroke-width:1.5; rx:14; }
    .box-green { fill:#F0FAF0; stroke:#73B222; stroke-width:1.5; rx:14; }
    .box-red { fill:#FFF2F2; stroke:#C30B0A; stroke-width:1.5; rx:14; }
    .box-gray { fill:#F6F5F3; stroke:#5E5850; stroke-width:1.2; rx:14; }
    .box-dark { fill:#1b1d26; rx:16; }
    .btn { fill:#1b1d26; rx:12; cursor:pointer; }
    .btn-secondary { fill:#ffffff; stroke:#1b1d26; stroke-width:1.2; rx:12; cursor:pointer; }
    .btn-text { font-size:18px; font-weight:800; fill:#ffffff; text-anchor:middle; dominant-baseline:middle; pointer-events:none; }
    .btn-text-secondary { font-size:22px; font-weight:800; fill:#1b1d26; text-anchor:middle; dominant-baseline:middle; pointer-events:none; }
  </style>
  <defs>
    <marker id="mpArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
    <marker id="mpArrowY" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#C29E08"/>
    </marker>
  </defs>
  <text id="title" x="36" y="48" class="title"></text>
  <text id="subtitle" x="36" y="78" class="subtitle"></text>
  <g id="scene"></g>
  <text id="counter" x="36" y="635" class="text"></text>
  <g id="prevGroup"><rect id="prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/><text x="642" y="627" class="btn-text-secondary">←</text></g>
  <g id="nextGroup"><rect id="nextBtn" x="700" y="594" width="220" height="64" class="btn"/><text id="nextText" x="810" y="627" class="btn-text">Далее</text></g>
  <script><![CDATA[
  (function(){
    const svg = svgRoot;
    const $ = (id) => svg.getElementById(id);

    const steps = [
      {
        title: "Шаг 1. Три области машинного обучения",
        subtitle: "ML делят по тому, КАК модель учится и какую обратную связь получает",
        scene: `
          <rect class="box-dark" x="360" y="116" width="240" height="64"/>
          <text x="480" y="146" text-anchor="middle" font-size="18" font-weight="800" fill="#ffffff">Машинное обучение</text>
          <text x="480" y="168" text-anchor="middle" font-size="13" fill="#c7c7d1">три способа учиться</text>

          <line x1="470" y1="180" x2="205" y2="300" stroke="#5E5850" stroke-width="2" marker-end="url(#mpArrow)"/>
          <line x1="480" y1="180" x2="480" y2="300" stroke="#5E5850" stroke-width="2" marker-end="url(#mpArrow)"/>
          <line x1="490" y1="180" x2="755" y2="300" stroke="#5E5850" stroke-width="2" marker-end="url(#mpArrow)"/>

          <rect class="box-blue" x="70" y="305" width="250" height="155"/>
          <text x="195" y="345" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">С учителем</text>
          <text x="195" y="368" text-anchor="middle" class="small">Supervised</text>
          <text x="195" y="404" text-anchor="middle" class="small" fill="#111111">есть правильные ответы</text>
          <text x="195" y="426" text-anchor="middle" class="small" fill="#111111">учимся на парах вход → ответ</text>

          <rect class="box-blue" x="355" y="305" width="250" height="155"/>
          <text x="480" y="345" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">Без учителя</text>
          <text x="480" y="368" text-anchor="middle" class="small">Unsupervised</text>
          <text x="480" y="404" text-anchor="middle" class="small" fill="#111111">ответов нет</text>
          <text x="480" y="426" text-anchor="middle" class="small" fill="#111111">ищем структуру в данных</text>

          <rect class="box-blue" x="640" y="305" width="250" height="155"/>
          <text x="765" y="345" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">С подкреплением</text>
          <text x="765" y="368" text-anchor="middle" class="small">Reinforcement</text>
          <text x="765" y="404" text-anchor="middle" class="small" fill="#111111">награда или штраф</text>
          <text x="765" y="426" text-anchor="middle" class="small" fill="#111111">учимся действовать</text>

          <text x="480" y="520" class="text" text-anchor="middle" font-weight="700">Различаются тем, что (и есть ли вообще) модель получает в ответ на свои попытки</text>
        `
      },
      {
        title: "Шаг 2. С учителем: учимся на парах",
        subtitle: "У каждого входа есть заранее известный правильный ответ",
        scene: `
          <text x="250" y="150" text-anchor="middle" class="label" fill="#3576C0">вход (x)</text>
          <text x="650" y="150" text-anchor="middle" class="label" fill="#73B222">правильный ответ (y)</text>

          <rect class="box-blue" x="120" y="172" width="260" height="60"/>
          <text x="250" y="208" text-anchor="middle" class="text">фото животного</text>
          <line x1="395" y1="202" x2="505" y2="202" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
          <rect class="box-green" x="520" y="172" width="260" height="60"/>
          <text x="650" y="208" text-anchor="middle" class="text" font-weight="700" fill="#73B222">«кошка»</text>

          <rect class="box-blue" x="120" y="252" width="260" height="76"/>
          <text x="250" y="284" text-anchor="middle" class="text">площадь дома, м²</text>
          <text x="250" y="306" text-anchor="middle" class="small">упрощённый фрагмент Ames Housing</text>
          <line x1="395" y1="290" x2="505" y2="290" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
          <rect class="box-green" x="520" y="252" width="260" height="76"/>
          <text x="650" y="296" text-anchor="middle" class="text" font-weight="700" fill="#73B222">цена: 215 000 $</text>

          <rect class="box-blue" x="120" y="348" width="260" height="60"/>
          <text x="250" y="384" text-anchor="middle" class="text">текст письма</text>
          <line x1="395" y1="378" x2="505" y2="378" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
          <rect class="box-green" x="520" y="348" width="260" height="60"/>
          <text x="650" y="384" text-anchor="middle" class="text" font-weight="700" fill="#73B222">«спам»</text>

          <text x="480" y="468" class="small" text-anchor="middle">Модель видит много таких пар и учится сама давать правильный ответ на новом входе</text>
        `
      },
      {
        title: "Шаг 3. Без учителя: структура без ответов",
        subtitle: "Меток никто не дал — модель сама находит группы и закономерности",
        scene: `
          <text x="225" y="172" text-anchor="middle" class="label">данные без меток</text>
          <rect class="box-gray" x="90" y="186" width="270" height="260"/>
          <circle cx="150" cy="248" r="6" fill="#5E5850"/>
          <circle cx="185" cy="282" r="6" fill="#5E5850"/>
          <circle cx="160" cy="320" r="6" fill="#5E5850"/>
          <circle cx="210" cy="262" r="6" fill="#5E5850"/>
          <circle cx="135" cy="298" r="6" fill="#5E5850"/>
          <circle cx="298" cy="392" r="6" fill="#5E5850"/>
          <circle cx="320" cy="362" r="6" fill="#5E5850"/>
          <circle cx="300" cy="420" r="6" fill="#5E5850"/>
          <circle cx="262" cy="402" r="6" fill="#5E5850"/>
          <circle cx="332" cy="408" r="6" fill="#5E5850"/>

          <line x1="372" y1="316" x2="452" y2="316" stroke="#C29E08" stroke-width="2.5" marker-end="url(#mpArrowY)"/>
          <text x="412" y="298" text-anchor="middle" class="small" font-weight="700" fill="#C29E08">находим</text>
          <text x="412" y="346" text-anchor="middle" class="small" font-weight="700" fill="#C29E08">структуру</text>

          <text x="735" y="172" text-anchor="middle" class="label">модель нашла группы</text>
          <rect class="box-gray" x="600" y="186" width="270" height="260"/>
          <ellipse cx="690" cy="288" rx="78" ry="72" fill="#3576C0" fill-opacity="0.07" stroke="#3576C0" stroke-width="1.5" stroke-dasharray="5 4"/>
          <ellipse cx="798" cy="388" rx="58" ry="50" fill="#73B222" fill-opacity="0.07" stroke="#73B222" stroke-width="1.5" stroke-dasharray="5 4"/>
          <circle cx="660" cy="248" r="6" fill="#3576C0"/>
          <circle cx="695" cy="282" r="6" fill="#3576C0"/>
          <circle cx="670" cy="320" r="6" fill="#3576C0"/>
          <circle cx="720" cy="262" r="6" fill="#3576C0"/>
          <circle cx="645" cy="298" r="6" fill="#3576C0"/>
          <circle cx="790" cy="388" r="6" fill="#73B222"/>
          <circle cx="815" cy="366" r="6" fill="#73B222"/>
          <circle cx="795" cy="412" r="6" fill="#73B222"/>
          <circle cx="765" cy="398" r="6" fill="#73B222"/>
          <circle cx="822" cy="402" r="6" fill="#73B222"/>

          <text x="480" y="492" class="small" text-anchor="middle">Похожие объекты собираются в кластеры. Так же ищут закономерности и сжатые представления</text>
        `
      },
      {
        title: "Шаг 4. С подкреплением: действие и награда",
        subtitle: "Агент пробует действия в среде и получает награду или штраф",
        scene: `
          <rect class="box-blue" x="110" y="238" width="220" height="120"/>
          <text x="220" y="292" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">Агент</text>
          <text x="220" y="320" text-anchor="middle" class="small">напр., робот-рука</text>

          <rect class="box-gray" x="630" y="238" width="220" height="120"/>
          <text x="740" y="292" text-anchor="middle" class="text" font-weight="800">Среда</text>
          <text x="740" y="320" text-anchor="middle" class="small">мир / задача</text>

          <line x1="332" y1="270" x2="626" y2="270" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
          <text x="480" y="258" text-anchor="middle" class="small" font-weight="700">действие</text>

          <line x1="628" y1="332" x2="334" y2="332" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
          <text x="480" y="354" text-anchor="middle" class="small" font-weight="700">новое состояние + сигнал</text>

          <rect class="box-green" x="250" y="408" width="210" height="56"/>
          <text x="355" y="442" text-anchor="middle" class="text" font-weight="700" fill="#73B222">+ награда за успех</text>
          <rect class="box-red" x="500" y="408" width="210" height="56"/>
          <text x="605" y="442" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">− штраф за ошибку</text>

          <text x="480" y="512" class="small" text-anchor="middle">Цель — выбирать действия так, чтобы суммарная награда была максимальной</text>
        `
      },
      {
        title: "Шаг 5. Три области рядом",
        subtitle: "Ключевое различие — какую обратную связь видит модель",
        scene: `
          <rect class="box-blue" x="70" y="140" width="260" height="50"/>
          <text x="200" y="172" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">С учителем</text>
          <rect class="box-blue" x="350" y="140" width="260" height="50"/>
          <text x="480" y="172" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">Без учителя</text>
          <rect class="box-blue" x="630" y="140" width="260" height="50"/>
          <text x="760" y="172" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">С подкреплением</text>

          <rect class="box-gray" x="70" y="200" width="260" height="220"/>
          <rect class="box-gray" x="350" y="200" width="260" height="220"/>
          <rect class="box-gray" x="630" y="200" width="260" height="220"/>

          <text x="90" y="238" class="small">Вход:</text>
          <text x="90" y="260" class="text">данные + метки</text>
          <text x="90" y="308" class="small">Правильный ответ:</text>
          <text x="90" y="330" class="text" fill="#73B222" font-weight="700">дан заранее</text>
          <text x="90" y="378" class="small">Учится:</text>
          <text x="90" y="400" class="text">повторять ответ</text>

          <text x="370" y="238" class="small">Вход:</text>
          <text x="370" y="260" class="text">только данные</text>
          <text x="370" y="308" class="small">Правильный ответ:</text>
          <text x="370" y="330" class="text" fill="#C30B0A" font-weight="700">нет</text>
          <text x="370" y="378" class="small">Учится:</text>
          <text x="370" y="400" class="text">находить структуру</text>

          <text x="650" y="238" class="small">Вход:</text>
          <text x="650" y="260" class="text">опыт в среде</text>
          <text x="650" y="308" class="small">Правильный ответ:</text>
          <text x="650" y="330" class="text" fill="#C29E08" font-weight="700">только награда</text>
          <text x="650" y="378" class="small">Учится:</text>
          <text x="650" y="400" class="text">стратегию действий</text>

          <text x="480" y="478" class="small" text-anchor="middle">Точный ответ • ничего • награда — вот три разных вида обратной связи</text>
        `
      },
      {
        title: "Шаг 6. Где в этой карте мы",
        subtitle: "Дальше статья — про обучение с учителем",
        scene: `
          <rect class="box-blue" x="320" y="120" width="320" height="48"/>
          <text x="480" y="151" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">Обучение с учителем (Supervised)</text>

          <rect class="box-blue" x="60" y="288" width="190" height="100"/>
          <text x="155" y="334" text-anchor="middle" class="text" font-weight="700">вход x</text>
          <text x="155" y="360" text-anchor="middle" class="small">данные</text>

          <line x1="256" y1="338" x2="372" y2="338" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>

          <rect class="box-dark" x="380" y="278" width="200" height="120"/>
          <text x="480" y="332" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">Модель</text>
          <text x="480" y="360" text-anchor="middle" font-size="13" fill="#c7c7d1">чёрная коробка</text>

          <line x1="586" y1="338" x2="702" y2="338" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>

          <rect class="box-green" x="710" y="288" width="190" height="100"/>
          <text x="805" y="328" text-anchor="middle" class="text" font-weight="700" fill="#73B222">выход ŷ</text>
          <text x="805" y="356" text-anchor="middle" class="small" fill="#111111">сравниваем с правильным ответом</text>

          <text x="480" y="468" class="text" text-anchor="middle" font-weight="700">Именно здесь работает шаблон «вход → модель → выход»</text>
          <text x="480" y="500" class="small" text-anchor="middle">Дальше открываем эту коробку — но сначала смотрим на неё снаружи</text>
        `
      }
    ];

    let currentStep = 0;
    function renderStep(){
      const step = steps[currentStep];
      $('title').textContent = step.title;
      $('subtitle').textContent = step.subtitle;
      $('counter').textContent = `${currentStep+1} из ${steps.length}`;
      $('scene').innerHTML = step.scene;
      $('prevGroup').style.display = currentStep===0 ? 'none' : 'block';
      $('nextText').textContent = currentStep===steps.length-1 ? '↻' : 'Далее';
    }
    function nextStep(){ currentStep = currentStep < steps.length-1 ? currentStep+1 : 0; renderStep(); }
    function prevStep(){ if(currentStep>0) currentStep--; renderStep(); }
    $('nextBtn').addEventListener('click', nextStep);
    $('prevBtn').addEventListener('click', prevStep);
    svg.tabIndex = 0;
    svg.addEventListener('keydown', e=>{ if(e.key==='ArrowRight') nextStep(); if(e.key==='ArrowLeft') prevStep(); });
    renderStep();
  })();
  ]]></script>
</svg>
  </div>
</figure>

## 2. Модель как чёрная коробка

Представим, что модель — это закрытая коробка с двумя отверстиями. В одно мы что-то подаём, из другого что-то получаем. Что происходит внутри — пока не важно: возможно, там линейная формула, возможно, дерево решений, возможно, нейросеть на сто слоёв. С точки зрения «снаружи» это всё одно и то же — **функция**:

$$\text{выход} = f(\text{вход})$$

Такой взгляд кажется упрощением, но он невероятно полезен. Он позволяет:

- **классифицировать любую задачу ML** по двум признакам — *форма входа* и *тип выхода*;
- **отделить постановку задачи от реализации**: сначала решаем, что подаём и что хотим получить, и только потом выбираем конкретную модель;
- увидеть, что совершенно разные на первый взгляд задачи (предсказать цену дома, узнать кошку на фото, угадать следующее слово) — это один и тот же шаблон **вход → f → выход**.

Дальше мы по очереди откроем обе стороны коробки. Сначала — что бывает на входе. Потом — что бывает на выходе. А внутрь специально заглядывать не будем: это тема следующей статьи.
<figure class="embedded-interactive" id="section-interactive-2">
  <div class="interactive-meta">Интерактив 2</div>
  <p class="interactive-desc">Модель как чёрная коробка: вход, внутренняя функция и выход</p>
  <div class="interactive-svg-wrap">
<svg id="blackBoxOverview" viewBox="0 0 960 680" width="100%" role="img" aria-label="Вход — модель — выход как чёрная коробка">
  <style>
    svg { background:#ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size:24px; font-weight:800; fill:#111111; }
    .subtitle { font-size:15px; fill:#5E5850; }
    .text { font-size:16px; fill:#111111; }
    .small { font-size:13px; fill:#5E5850; }
    .label { font-size:14px; font-weight:700; fill:#111111; }
    .box-blue { fill:#ffffff; stroke:#3576C0; stroke-width:1.5; rx:14; }
    .box-yellow { fill:#FFFBEB; stroke:#C29E08; stroke-width:1.5; rx:14; }
    .box-green { fill:#F0FAF0; stroke:#73B222; stroke-width:1.5; rx:14; }
    .box-red { fill:#FFF2F2; stroke:#C30B0A; stroke-width:1.5; rx:14; }
    .box-gray { fill:#F6F5F3; stroke:#5E5850; stroke-width:1.2; rx:14; }
    .box-dark { fill:#1b1d26; rx:16; }
    .btn { fill:#1b1d26; rx:12; cursor:pointer; }
    .btn-secondary { fill:#ffffff; stroke:#1b1d26; stroke-width:1.2; rx:12; cursor:pointer; }
    .btn-text { font-size:18px; font-weight:800; fill:#ffffff; text-anchor:middle; dominant-baseline:middle; pointer-events:none; }
    .btn-text-secondary { font-size:22px; font-weight:800; fill:#1b1d26; text-anchor:middle; dominant-baseline:middle; pointer-events:none; }
  </style>
  <defs>
    <marker id="bbArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
  </defs>
  <text id="title" x="36" y="48" class="title"></text>
  <text id="subtitle" x="36" y="78" class="subtitle"></text>
  <g id="scene"></g>
  <text id="counter" x="36" y="635" class="text"></text>
  <g id="prevGroup"><rect id="prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/><text x="642" y="627" class="btn-text-secondary">←</text></g>
  <g id="nextGroup"><rect id="nextBtn" x="700" y="594" width="220" height="64" class="btn"/><text id="nextText" x="810" y="627" class="btn-text">Далее</text></g>
  <script><![CDATA[
  (function(){
    const svg = svgRoot;
    const $ = (id) => svg.getElementById(id);
    const arrow = '<line x1="285" y1="320" x2="388" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/><line x1="573" y1="320" x2="676" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/>';
    const box = '<rect class="box-dark" x="395" y="245" width="170" height="150"/><text x="480" y="308" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">Модель</text><text x="480" y="338" text-anchor="middle" font-size="14" fill="#c7c7d1">чёрная коробка</text>';
    const steps = [
      {title:'Шаг 1. Сначала смотрим снаружи', subtitle:'У модели есть вход, внутренняя функция и выход', scene:`
        <rect class="box-blue" x="90" y="260" width="190" height="120"/><text x="185" y="310" class="text" text-anchor="middle" font-weight="700">Вход</text><text x="185" y="340" class="small" text-anchor="middle">данные, которые мы подаём</text>
        ${arrow}${box}
        <rect class="box-green" x="680" y="260" width="190" height="120"/><text x="775" y="310" class="text" text-anchor="middle" font-weight="700">Выход</text><text x="775" y="340" class="small" text-anchor="middle">ответ модели</text>
        <text x="480" y="470" class="text" text-anchor="middle" font-weight="700">Пока не открываем коробку: важно понять две стороны — вход и выход</text>`},
      {title:'Шаг 2. На вход могут прийти разные данные', subtitle:'Таблица, картинка и текст выглядят по-разному для человека', scene:`
        <rect class="box-blue" x="70" y="160" width="210" height="110"/><text x="175" y="205" class="text" text-anchor="middle" font-weight="700">Таблица</text><text x="175" y="232" class="small" text-anchor="middle">квартиры, клиенты, продажи</text>
        <rect class="box-blue" x="70" y="285" width="210" height="110"/><text x="175" y="330" class="text" text-anchor="middle" font-weight="700">Картинка</text><text x="175" y="357" class="small" text-anchor="middle">пиксели изображения</text>
        <rect class="box-blue" x="70" y="410" width="210" height="110"/><text x="175" y="455" class="text" text-anchor="middle" font-weight="700">Текст</text><text x="175" y="482" class="small" text-anchor="middle">слова и токены</text>
        <line x1="285" y1="215" x2="388" y2="295" stroke="#5E5850" stroke-width="2.2" marker-end="url(#bbArrow)"/><line x1="285" y1="340" x2="388" y2="320" stroke="#5E5850" stroke-width="2.2" marker-end="url(#bbArrow)"/><line x1="285" y1="465" x2="388" y2="345" stroke="#5E5850" stroke-width="2.2" marker-end="url(#bbArrow)"/>
        ${box}
        <text x="670" y="315" class="small">Но для модели всё это должно стать числами</text>`},
      {title:'Шаг 3. Выход тоже бывает разным', subtitle:'Одна и та же коробка может возвращать число, класс или последовательность', scene:`
        <rect class="box-blue" x="80" y="280" width="200" height="90"/><text x="180" y="334" class="text" text-anchor="middle" font-weight="700">Вход x</text>${arrow}${box}
        <rect class="box-green" x="690" y="180" width="200" height="70"/><text x="790" y="224" class="text" text-anchor="middle" font-weight="700">23.7 °C</text>
        <rect class="box-yellow" x="690" y="285" width="200" height="70"/><text x="790" y="329" class="text" text-anchor="middle" font-weight="700">«кошка»</text>
        <rect class="box-red" x="690" y="390" width="200" height="70"/><text x="790" y="433" class="text" text-anchor="middle" font-weight="700">токены...</text>
        <text x="480" y="520" class="small" text-anchor="middle">Тип выхода заранее подсказывает, какая это задача: регрессия, классификация, генерация и т.д.</text>`},
      {title:'Шаг 4. Внутри — функция f', subtitle:'Обучение подбирает параметры функции, но снаружи шаблон остаётся тем же', scene:`
        <rect class="box-blue" x="80" y="270" width="200" height="100"/><text x="180" y="327" class="text" text-anchor="middle" font-weight="700">вход x</text>
        <line x1="286" y1="320" x2="372" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/>
        <rect class="box-yellow" x="380" y="230" width="200" height="180"/><text x="480" y="292" text-anchor="middle" font-size="34" font-weight="800" fill="#C29E08">f</text><text x="480" y="326" class="text" text-anchor="middle" font-weight="700">параметры</text><text x="480" y="352" class="small" text-anchor="middle">подбираются по данным</text>
        <line x1="586" y1="320" x2="672" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/>
        <rect class="box-green" x="680" y="270" width="200" height="100"/><text x="780" y="327" class="text" text-anchor="middle" font-weight="700">выход ŷ</text>
        <text x="480" y="485" font-size="24" font-weight="800" text-anchor="middle" fill="#111111">ŷ = f(x)</text><text x="480" y="525" class="small" text-anchor="middle">В этой статье фиксируем вход и выход. Внутрь коробки зайдём позже.</text>`}
    ];
    let currentStep = 0;
    function renderStep(){ const step = steps[currentStep]; $('title').textContent=step.title; $('subtitle').textContent=step.subtitle; $('counter').textContent=`${currentStep+1} из ${steps.length}`; $('scene').innerHTML=step.scene; $('prevGroup').style.display=currentStep===0?'none':'block'; $('nextText').textContent=currentStep===steps.length-1?'↻':'Далее'; }
    function nextStep(){ currentStep = currentStep < steps.length-1 ? currentStep+1 : 0; renderStep(); }
    function prevStep(){ if(currentStep>0) currentStep--; renderStep(); }
    $('nextBtn').addEventListener('click', nextStep); $('prevBtn').addEventListener('click', prevStep); svg.tabIndex=0; svg.addEventListener('keydown', e=>{ if(e.key==='ArrowRight') nextStep(); if(e.key==='ArrowLeft') prevStep(); }); renderStep();
  })();
  ]]></script>
</svg>
  </div>
</figure>

## 3. Что на входе: всё сводится к числам

Главная идея этого раздела одна, и её стоит проговорить сразу:

> **Модель не умеет работать с «картинками», «текстом» или «таблицами». Она умеет работать только с числами** — векторами, матрицами и тензорами.

Какими бы разными ни были исходные данные, перед входом в коробку их всегда превращают в набор чисел фиксированной формы. Разберём три типичных случая.

### 3.1. Табличные данные — самый базовый вид

Это самый привычный формат: таблица, где **строки — это объекты**, а **столбцы — их признаки** (характеристики). Каждая ячейка — одно число. Одна строка превращается в **вектор признаков** `x`, а вся таблица — в **матрицу X** формы `(n × m)`: `n` объектов на `m` признаков. Отдельно выделяют **целевой столбец y** — то, что мы хотим предсказать.

Именно в таком виде данные подаются почти в любую классическую ML-модель. Поэтому с таблиц удобно начинать: на них проще всего увидеть и `X`, и `y`, и саму идею `f(признаки) → ответ`.
<figure class="embedded-interactive" id="section-interactive-3">
  <div class="interactive-meta">Интерактив 3</div>
  <p class="interactive-desc">Табличные данные как вход модели: матрица X и вектор целей y</p>
  <div class="interactive-svg-wrap">
<svg id="tabularDataViz" viewBox="0 0 960 680" width="100%" role="img" aria-label="Табличные данные как вход модели машинного обучения">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .label { font-size: 14px; font-weight: 700; fill: #111111; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

<text id="title" x="36" y="48" class="title"></text>
<text id="subtitle" x="36" y="78" class="subtitle"></text>
<g id="scene"></g>
<text id="counter" x="36" y="635" class="text"></text>
  <g id="prevGroup">
    <rect id="prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="nextGroup">
    <rect id="nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
  (function () {
    const svg = svgRoot;
    const $ = (id) => svg.getElementById(id);

    const C_FEAT   = '#3576C0';
    const C_TARGET = '#73B222';
    const C_PROC   = '#C29E08';
    const C_MUTE   = '#5E5850';

    const HEADERS = ['Площадь', 'Комнаты', 'Этаж', 'Возраст', 'Цена, млн'];
    const ROWS = [
      [65,  2,  4, 10, 18],
      [80,  3,  7,  5, 25],
      [45,  1,  2, 20, 12],
      [120, 4, 12,  2, 40]
    ];

    function arrowedLine(x1, y1, x2, y2, color, sw, headLen) {
      headLen = headLen || 11;
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx*dx + dy*dy);
      if (len < 0.1) return '';
      const ux = dx/len, uy = dy/len, px = -uy, py = ux, wing = 6;
      const bx = x2 - headLen*ux, by = y2 - headLen*uy;
      return `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="${color}" stroke-width="${sw}"/>` +
             `<polygon points="${x2},${y2} ${(bx+wing*px).toFixed(1)},${(by+wing*py).toFixed(1)} ${(bx-wing*px).toFixed(1)},${(by-wing*py).toFixed(1)}" fill="${color}"/>`;
    }

    function drawTable(ox, oy, colW, rowH, opts) {
      opts = opts || {};
      const nCols = HEADERS.length, nRows = ROWS.length;
      const gapAfter = opts.gapAfterCol;
      const gapSize = opts.gapSize || 0;
      const colX = (j) => ox + j*colW + ((gapAfter !== undefined && j > gapAfter) ? gapSize : 0);
      const fc = opts.featureCols, tc = opts.targetCol;
      let s = '';
      for (let j = 0; j < nCols; j++) {
        const x = colX(j);
        let fill = '#EFEFEC';
        if (fc !== undefined && j < fc) fill = '#DCEAFB';
        if (tc !== undefined && j === tc) fill = '#E2F2D2';
        s += `<rect x="${x}" y="${oy}" width="${colW}" height="${rowH}" fill="${fill}" stroke="#b6b6b6" stroke-width="1"/>`;
        s += `<text x="${x + colW/2}" y="${oy + rowH/2 + 5}" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">${HEADERS[j]}</text>`;
      }
      for (let i = 0; i < nRows; i++) {
        const y = oy + (i+1)*rowH;
        const isHL = opts.highlightRow === i;
        for (let j = 0; j < nCols; j++) {
          const x = colX(j);
          let fill = '#fff';
          if (fc !== undefined && j < fc) fill = '#F5F9FE';
          if (tc !== undefined && j === tc) fill = '#F5FBEE';
          if (isHL) fill = '#FFF4D2';
          s += `<rect x="${x}" y="${y}" width="${colW}" height="${rowH}" fill="${fill}" stroke="#dddddd" stroke-width="1"/>`;
          s += `<text x="${x + colW/2}" y="${y + rowH/2 + 5}" font-size="15" fill="#111" text-anchor="middle">${ROWS[i][j]}</text>`;
        }
        if (isHL && gapAfter === undefined) {
          s += `<rect x="${colX(0)}" y="${y}" width="${nCols*colW}" height="${rowH}" fill="none" stroke="${C_PROC}" stroke-width="3"/>`;
        }
      }
      return s;
    }

    const steps = [
      {
        title: "Шаг 1. Табличные данные — это матрица",
        subtitle: "Как в Excel или CSV: строки и столбцы из чисел",
        scene: (function () {
          const ox = 215, oy = 175, colW = 126, rowH = 46;
          let s = '';
          s += arrowedLine(ox - 10, 158, ox + 5*colW + 10, 158, C_MUTE, 1.2, 9);
          s += arrowedLine(ox + 5*colW + 10, 158, ox - 10, 158, C_MUTE, 1.2, 9);
          s += `<text x="${ox + 5*colW/2}" y="148" class="label" text-anchor="middle">СТОЛБЦЫ = признаки (характеристики)</text>`;

          s += `<text class="label" text-anchor="middle" transform="translate(180, ${oy + 3*rowH}) rotate(-90)">СТРОКИ = объекты</text>`;
          s += arrowedLine(198, oy + rowH + 4, 198, oy + 5*rowH - 4, C_MUTE, 1.2, 9);

          s += drawTable(ox, oy, colW, rowH, {});

          const cx = ox + colW + colW/2, cy = oy + 2*rowH + rowH/2;
          s += `<rect x="${ox + colW}" y="${oy + 2*rowH}" width="${colW}" height="${rowH}" fill="none" stroke="${C_PROC}" stroke-width="3"/>`;
          s += arrowedLine(cx, cy + rowH + 38, cx, cy + 4, C_PROC, 2, 10);
          s += `<text x="${cx}" y="${cy + rowH + 58}" class="small" fill="${C_PROC}" font-weight="700" text-anchor="middle">одна ячейка = одно число</text>`;

          s += `
            <g transform="translate(80, 470)">
              <rect width="800" height="100" rx="12" fill="#FFFBEB" stroke="${C_PROC}" stroke-width="1.5"/>
              <text x="400" y="34" class="text" font-weight="700" text-anchor="middle">Для модели любая таблица — это просто прямоугольник чисел (матрица)</text>
              <text x="400" y="62" class="small" text-anchor="middle">Строки — отдельные объекты (здесь: 4 квартиры). Столбцы — их измеримые характеристики.</text>
              <text x="400" y="84" class="small" text-anchor="middle">Каждая ячейка — одно значение. Дальше разберём, как это превращается во вход модели.</text>
            </g>
          `;
          return s;
        })()
      },

      {
        title: "Шаг 2. Одно наблюдение = строка = вектор",
        subtitle: "Каждый объект описывается упорядоченным набором чисел",
        scene: (function () {
          const ox = 230, oy = 120, colW = 120, rowH = 42;
          let s = '';
          s += drawTable(ox, oy, colW, rowH, { highlightRow: 1 });
          s += `<text x="${ox + 5*colW + 16}" y="${oy + 2*rowH + rowH/2 + 5}" class="small" fill="${C_PROC}" font-weight="700">→ объект №2</text>`;

          const vy = 400;
          s += arrowedLine(ox + 5*colW/2, oy + 5*rowH + 6, ox + 5*colW/2, vy - 78, C_PROC, 2, 10);
          s += `<text x="${ox + 5*colW/2 + 14}" y="${oy + 5*rowH + 48}" class="small" fill="${C_PROC}" font-weight="700">вынем эту строку</text>`;

          const vals = ROWS[1];
          const bw = 88, bgap = 10;
          const total = vals.length*bw + (vals.length-1)*bgap;
          const sx = (960 - total)/2;
          s += `<text x="${sx - 30}" y="${vy + 28}" font-size="20" font-weight="800" fill="#111" text-anchor="end">x⁽²⁾ =</text>`;
          s += `<text x="${sx - 6}" y="${vy + 30}" font-size="40" fill="#111" text-anchor="end">[</text>`;
          vals.forEach((v, j) => {
            const x = sx + j*(bw + bgap);
            s += `<rect x="${x}" y="${vy}" width="${bw}" height="50" rx="6" fill="#F4F8FF" stroke="${C_FEAT}" stroke-width="1.4"/>`;
            s += `<text x="${x + bw/2}" y="${vy + 32}" font-size="18" font-weight="700" fill="#111" text-anchor="middle">${v}</text>`;
            s += `<text x="${x + bw/2}" y="${vy + 70}" font-size="11" fill="${C_MUTE}" text-anchor="middle">${HEADERS[j].replace(', млн','')}</text>`;
          });
          s += `<text x="${sx + total + 6}" y="${vy + 30}" font-size="40" fill="#111">]</text>`;

          s += `
            <g transform="translate(80, 488)">
              <rect width="800" height="82" rx="12" fill="#F4F8FF" stroke="${C_FEAT}" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Строка таблицы — это вектор: список чисел в фиксированном порядке</text>
              <text x="400" y="60" class="small" text-anchor="middle">Порядок важен: 2-я позиция всегда «комнаты», 3-я всегда «этаж». Так модель понимает, что есть что.</text>
            </g>
          `;
          return s;
        })()
      },

      {
        title: "Шаг 3. Признаки (X) и цель (y)",
        subtitle: "Делим столбцы: что мы знаем — что хотим предсказать",
        scene: (function () {
          const ox = 175, oy = 160, colW = 118, rowH = 46, gap = 44;
          let s = '';
          s += drawTable(ox, oy, colW, rowH, { featureCols: 4, targetCol: 4, gapAfterCol: 3, gapSize: gap });

          const featW = 4*colW;
          const featCx = ox + featW/2;
          const tx = ox + 4*colW + gap;
          const tCx = tx + colW/2;
          const braceY = oy + 5*rowH + 16;

          s += `<line x1="${ox}" y1="${braceY}" x2="${ox + featW}" y2="${braceY}" stroke="${C_FEAT}" stroke-width="2"/>`;
          s += `<line x1="${ox}" y1="${braceY}" x2="${ox}" y2="${braceY - 8}" stroke="${C_FEAT}" stroke-width="2"/>`;
          s += `<line x1="${ox + featW}" y1="${braceY}" x2="${ox + featW}" y2="${braceY - 8}" stroke="${C_FEAT}" stroke-width="2"/>`;
          s += `<text x="${featCx}" y="${braceY + 26}" font-size="22" font-weight="800" fill="${C_FEAT}" text-anchor="middle">X — признаки (вход)</text>`;

          s += `<line x1="${tx}" y1="${braceY}" x2="${tx + colW}" y2="${braceY}" stroke="${C_TARGET}" stroke-width="2"/>`;
          s += `<line x1="${tx}" y1="${braceY}" x2="${tx}" y2="${braceY - 8}" stroke="${C_TARGET}" stroke-width="2"/>`;
          s += `<line x1="${tx + colW}" y1="${braceY}" x2="${tx + colW}" y2="${braceY - 8}" stroke="${C_TARGET}" stroke-width="2"/>`;
          s += `<text x="${tCx}" y="${braceY + 26}" font-size="22" font-weight="800" fill="${C_TARGET}" text-anchor="middle">y — цель</text>`;

          s += `<text x="${(ox + featW + tx)/2}" y="${oy - 22}" font-size="26" fill="${C_MUTE}" text-anchor="middle">→</text>`;

          s += `
            <g transform="translate(80, 460)">
              <rect width="800" height="110" rx="12" fill="#F0FAF0" stroke="${C_TARGET}" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">X — то, что известно. y — то, что нужно предсказать.</text>
              <text x="400" y="60" class="small" text-anchor="middle">Признаки (площадь, комнаты, этаж, возраст) → цель (цена). Цель — обычно один столбец.</text>
              <text x="400" y="82" class="small" text-anchor="middle">Регрессия: y — число (цена). Классификация: y — метка класса (например, «дорогая / дешёвая»).</text>
              <text x="400" y="102" class="small" text-anchor="middle">Какой столбец сделать целью — решаем мы, исходя из задачи.</text>
            </g>
          `;
          return s;
        })()
      },

      {
        title: "Шаг 4. Весь датасет: матрица X и вектор y",
        subtitle: "n объектов × m признаков — и столбец ответов длины n",
        scene: (function () {
          let s = '';
          const fHead = HEADERS.slice(0, 4);
          const Xox = 235, Xoy = 175, cw = 66, ch = 46;
          const nR = ROWS.length, nC = 4;

          for (let j = 0; j < nC; j++) {
            s += `<text x="${Xox + j*cw + cw/2}" y="${Xoy - 10}" font-size="10.5" fill="${C_MUTE}" text-anchor="middle">${fHead[j].slice(0,6)}</text>`;
          }
          for (let i = 0; i < nR; i++) {
            for (let j = 0; j < nC; j++) {
              const x = Xox + j*cw, y = Xoy + i*ch;
              s += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="#F5F9FE" stroke="${C_FEAT}" stroke-width="0.8"/>`;
              s += `<text x="${x + cw/2}" y="${y + ch/2 + 5}" font-size="15" fill="#111" text-anchor="middle">${ROWS[i][j]}</text>`;
            }
          }
          const Xw = nC*cw, Xh = nR*ch;
          s += `<path d="M ${Xox-8} ${Xoy} L ${Xox-8} ${Xoy+Xh} M ${Xox-8} ${Xoy} L ${Xox-2} ${Xoy} M ${Xox-8} ${Xoy+Xh} L ${Xox-2} ${Xoy+Xh}" stroke="${C_FEAT}" stroke-width="2.5" fill="none"/>`;
          s += `<path d="M ${Xox+Xw+8} ${Xoy} L ${Xox+Xw+8} ${Xoy+Xh} M ${Xox+Xw+8} ${Xoy} L ${Xox+Xw+2} ${Xoy} M ${Xox+Xw+8} ${Xoy+Xh} L ${Xox+Xw+2} ${Xoy+Xh}" stroke="${C_FEAT}" stroke-width="2.5" fill="none"/>`;
          s += `<text x="${Xox + Xw/2}" y="${Xoy - 34}" font-size="26" font-weight="800" fill="${C_FEAT}" text-anchor="middle">X</text>`;

          s += arrowedLine(Xox - 26, Xoy, Xox - 26, Xoy + Xh, C_MUTE, 1.2, 8);
          s += arrowedLine(Xox - 26, Xoy + Xh, Xox - 26, Xoy, C_MUTE, 1.2, 8);
          s += `<text class="small" text-anchor="middle" transform="translate(${Xox - 40}, ${Xoy + Xh/2}) rotate(-90)">n = 4 объекта</text>`;
          s += arrowedLine(Xox, Xoy + Xh + 22, Xox + Xw, Xoy + Xh + 22, C_MUTE, 1.2, 8);
          s += arrowedLine(Xox + Xw, Xoy + Xh + 22, Xox, Xoy + Xh + 22, C_MUTE, 1.2, 8);
          s += `<text x="${Xox + Xw/2}" y="${Xoy + Xh + 40}" class="small" text-anchor="middle">m = 4 признака</text>`;

          const yox = 640, yoy = Xoy, ycw = 90, ych = ch;
          s += `<text x="${yox + ycw/2}" y="${yoy - 10}" font-size="10.5" fill="${C_MUTE}" text-anchor="middle">Цена</text>`;
          for (let i = 0; i < nR; i++) {
            const y = yoy + i*ych;
            s += `<rect x="${yox}" y="${y}" width="${ycw}" height="${ych}" fill="#F5FBEE" stroke="${C_TARGET}" stroke-width="0.8"/>`;
            s += `<text x="${yox + ycw/2}" y="${y + ych/2 + 5}" font-size="15" fill="#111" text-anchor="middle">${ROWS[i][4]}</text>`;
          }
          const yh = nR*ych;
          s += `<path d="M ${yox-8} ${yoy} L ${yox-8} ${yoy+yh} M ${yox-8} ${yoy} L ${yox-2} ${yoy} M ${yox-8} ${yoy+yh} L ${yox-2} ${yoy+yh}" stroke="${C_TARGET}" stroke-width="2.5" fill="none"/>`;
          s += `<path d="M ${yox+ycw+8} ${yoy} L ${yox+ycw+8} ${yoy+yh} M ${yox+ycw+8} ${yoy} L ${yox+ycw+2} ${yoy} M ${yox+ycw+8} ${yoy+yh} L ${yox+ycw+2} ${yoy+yh}" stroke="${C_TARGET}" stroke-width="2.5" fill="none"/>`;
          s += `<text x="${yox + ycw/2}" y="${yoy - 34}" font-size="26" font-weight="800" fill="${C_TARGET}" text-anchor="middle">y</text>`;

          s += `
            <g transform="translate(80, 430)">
              <rect width="800" height="140" rx="12" fill="#FFFBEB" stroke="${C_PROC}" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Стандартная форма данных в ML</text>
              <text x="400" y="62" font-size="16" text-anchor="middle"><tspan fill="${C_FEAT}" font-weight="700">X: форма (n × m) = (4 × 4)</tspan><tspan fill="${C_MUTE}">     ·     </tspan><tspan fill="${C_TARGET}" font-weight="700">y: форма (n,) = (4,)</tspan></text>
              <text x="400" y="90" class="small" text-anchor="middle">n — число объектов (samples), m — число признаков (features). У каждого объекта свой ответ в y.</text>
              <text x="400" y="112" class="small" text-anchor="middle">В реальности n бывает миллионы строк, m — десятки или тысячи столбцов.</text>
              <text x="400" y="132" class="small" text-anchor="middle">Это ровно тот вид, в котором данные подаются почти в любую классическую ML-модель.</text>
            </g>
          `;
          return s;
        })()
      },

      {
        title: "Шаг 5. Задача: предсказать y по X",
        subtitle: "Нужна функция f, которая по признакам выдаст цель",
        scene: (function () {
          let s = '';
          const inX = 110, inY = 150, inW = 220, rowH = 46;
          const feats = ['Площадь: 65', 'Комнаты: 2', 'Этаж: 4', 'Возраст: 10'];
          s += `<text x="${inX + inW/2}" y="${inY - 14}" class="label" fill="${C_FEAT}" text-anchor="middle">признаки одной квартиры</text>`;
          feats.forEach((f, i) => {
            const y = inY + i*rowH;
            s += `<rect x="${inX}" y="${y}" width="${inW}" height="${rowH - 6}" rx="6" fill="#F4F8FF" stroke="${C_FEAT}" stroke-width="1.3"/>`;
            s += `<text x="${inX + 16}" y="${y + (rowH-6)/2 + 5}" font-size="15" fill="#111">${f}</text>`;
          });
          s += `<text x="${inX + inW/2}" y="${inY + 4*rowH + 8}" font-size="15" font-weight="700" fill="${C_FEAT}" text-anchor="middle">вектор x = [65, 2, 4, 10]</text>`;

          const boxX = 410, boxY = 195, boxW = 150, boxH = 110;
          s += arrowedLine(inX + inW + 8, inY + 2*rowH - 3, boxX - 8, boxY + boxH/2, C_MUTE, 2.5, 13);
          s += `<rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="14" fill="#FFFBEB" stroke="${C_PROC}" stroke-width="2.5"/>`;
          s += `<text x="${boxX + boxW/2}" y="${boxY + 46}" font-size="30" font-weight="800" fill="${C_PROC}" text-anchor="middle">f</text>`;
          s += `<text x="${boxX + boxW/2}" y="${boxY + 78}" class="small" text-anchor="middle">модель</text>`;
          s += `<text x="${boxX + boxW/2}" y="${boxY + 96}" class="small" text-anchor="middle">(функция)</text>`;

          const outX = 660, outY = boxY + boxH/2;
          s += arrowedLine(boxX + boxW + 8, outY, outX - 8, outY, C_MUTE, 2.5, 13);
          s += `<rect x="${outX}" y="${outY - 42}" width="200" height="84" rx="12" fill="#F0FAF0" stroke="${C_TARGET}" stroke-width="2"/>`;
          s += `<text x="${outX + 100}" y="${outY - 12}" class="small" fill="${C_TARGET}" font-weight="700" text-anchor="middle">предсказание цены</text>`;
          s += `<text x="${outX + 100}" y="${outY + 22}" font-size="24" font-weight="800" fill="#111" text-anchor="middle">ŷ ≈ 18 млн</text>`;

          s += `<text x="480" y="370" font-size="22" font-weight="800" text-anchor="middle"><tspan fill="${C_PROC}">f</tspan><tspan fill="#111">(</tspan><tspan fill="${C_FEAT}">X</tspan><tspan fill="#111">) → </tspan><tspan fill="${C_TARGET}">y</tspan></text>`;

          s += `
            <g transform="translate(80, 405)">
              <rect width="800" height="165" rx="12" fill="#F0FAF0" stroke="${C_TARGET}" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Цель машинного обучения — найти такую f</text>
              <text x="400" y="60" class="small" text-anchor="middle">...чтобы для каждого объекта предсказание f(признаки) было близко к настоящему ответу y.</text>
              <text x="400" y="82" class="small" text-anchor="middle">Вход всегда один и тот же по форме: вектор признаков фиксированной длины m.</text>
              <text x="400" y="104" class="small" text-anchor="middle">Выход — одно число (регрессия) или метка класса (классификация).</text>
              <text x="400" y="132" class="small" text-anchor="middle" font-weight="700">Как именно подбирается f по данным (обучение) — это уже отдельная история.</text>
              <text x="400" y="152" class="small" text-anchor="middle">Здесь главное: вход модели = матрица X, и мы хотим из неё получить y.</text>
            </g>
          `;
          return s;
        })()
      }
    ];

    let currentStep = 0;

    function renderStep() {
      const step = steps[currentStep];
      $("title").textContent = step.title;
      $("subtitle").textContent = step.subtitle;
      $("counter").textContent = `${currentStep + 1} из ${steps.length}`;
      $("scene").innerHTML = step.scene;
      $("prevGroup").style.display = currentStep === 0 ? "none" : "block";
      $("nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
    }

    function nextStep() {
      if (currentStep < steps.length - 1) currentStep++;
      else currentStep = 0;
      renderStep();
    }
    function prevStep() {
      if (currentStep > 0) currentStep--;
      renderStep();
    }

    $("nextBtn").addEventListener("click", nextStep);
    $("prevBtn").addEventListener("click", prevStep);

    svg.tabIndex = 0;
    svg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });

    renderStep();
  })();
  ]]></script>
</svg>
  </div>
</figure>

### 3.2. Изображения — это тоже числа

Человек видит на картинке кошку. Компьютер видит **сетку чисел**. Каждый пиксель — это число (для серого — одно число от 0 до 255), а для цветного изображения — **три числа** (R, G, B). Сложив три цветовых канала, получаем **3D-тензор** формы `высота × ширина × каналы`.

То есть картинка — это не что-то принципиально новое для модели: это просто матрица (или тензор) чисел, только большего размера, чем строка таблицы.
<figure class="embedded-interactive" id="section-interactive-4">
  <div class="interactive-meta">Интерактив 4</div>
  <p class="interactive-desc">Как компьютер видит изображение: каждый пиксель — это числа R, G, B</p>
  <div class="interactive-svg-wrap">
<svg id="howComputerSeesImage" viewBox="0 0 960 680" width="100%" role="img" aria-label="Как компьютер видит цветную картинку">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .label { font-size: 14px; font-weight: 700; fill: #111111; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <text id="title" x="36" y="48" class="title"></text>
  <text id="subtitle" x="36" y="78" class="subtitle"></text>

  <g id="scene"></g>

  <text id="counter" x="36" y="635" class="text"></text>

  <g id="prevGroup">
    <rect id="prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="nextGroup">
    <rect id="nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
  (function () {
    const svg = svgRoot;
    const $ = (id) => svg.getElementById(id);

    const RGB_R = '#C30B0A';
    const RGB_G = '#73B222';
    const RGB_B = '#3576C0';

    const rgb = (r,g,b) => `rgb(${r},${g},${b})`;

    // Основная картинка 3×3 (разнообразные цвета для демонстрации каналов)
    const IMG = [
      [[220,  70,  70], [250, 200,  80], [ 90, 180,  90]],
      [[ 80, 150, 220], [220, 130, 200], [200, 200, 200]],
      [[240, 150,  60], [ 60,  60, 150], [ 40,  40,  40]]
    ];

    // Псевдо-MNIST: симметричный «плюс» с antialiasing (имитация фрагмента рукописной цифры)
    const DIGIT = [
      [  0,   0, 220,   0,   0],
      [  0,  60, 240,  60,   0],
      [220, 240, 255, 240, 220],
      [  0,  60, 240,  60,   0],
      [  0,   0, 220,   0,   0]
    ];

    function colorImage(img, cell, ox, oy, border = '#111', sw = 1.5) {
      let s = '';
      for (let i = 0; i < img.length; i++) {
        for (let j = 0; j < img[i].length; j++) {
          const [r, g, b] = img[i][j];
          s += `<rect x="${ox + j*cell}" y="${oy + i*cell}" width="${cell}" height="${cell}" fill="${rgb(r,g,b)}"/>`;
        }
      }
      s += `<rect x="${ox}" y="${oy}" width="${img[0].length*cell}" height="${img.length*cell}" fill="none" stroke="${border}" stroke-width="${sw}"/>`;
      return s;
    }

    function singleChannelImage(img, ch, cell, ox, oy, border = '#111') {
      let s = '';
      for (let i = 0; i < img.length; i++) {
        for (let j = 0; j < img[i].length; j++) {
          const v = img[i][j][ch];
          const color = ch === 0 ? rgb(v, 0, 0) : ch === 1 ? rgb(0, v, 0) : rgb(0, 0, v);
          s += `<rect x="${ox + j*cell}" y="${oy + i*cell}" width="${cell}" height="${cell}" fill="${color}"/>`;
        }
      }
      s += `<rect x="${ox}" y="${oy}" width="${img[0].length*cell}" height="${img.length*cell}" fill="none" stroke="${border}" stroke-width="2"/>`;
      return s;
    }

    function channelMatrix(img, ch, cell, ox, oy, accent) {
      let s = '';
      const n = img.length, m = img[0].length;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          const v = img[i][j][ch];
          s += `<rect x="${ox + j*cell}" y="${oy + i*cell}" width="${cell}" height="${cell}" fill="${rgb(v,v,v)}" stroke="#bbb" stroke-width="0.5"/>`;
          const tc = v > 140 ? '#111' : '#fff';
          s += `<text x="${ox + j*cell + cell/2}" y="${oy + i*cell + cell/2 + 5}" font-size="14" font-weight="700" fill="${tc}" text-anchor="middle">${v}</text>`;
        }
      }
      s += `<rect x="${ox}" y="${oy}" width="${m*cell}" height="${n*cell}" fill="none" stroke="${accent}" stroke-width="2.5"/>`;
      return s;
    }

    function numberGridRGB(img, cellW, cellH, ox, oy) {
      let s = '';
      for (let i = 0; i < img.length; i++) {
        for (let j = 0; j < img[i].length; j++) {
          const [r, g, b] = img[i][j];
          s += `<rect x="${ox + j*cellW}" y="${oy + i*cellH}" width="${cellW}" height="${cellH}" fill="#ffffff" stroke="#3576C0" stroke-width="1"/>`;
          const cx = ox + j*cellW + cellW/2;
          const cy = oy + i*cellH + cellH/2 + 5;
          s += `<text x="${cx}" y="${cy}" font-size="15" font-weight="700" text-anchor="middle">`;
          s += `<tspan fill="${RGB_R}">${r}</tspan>`;
          s += `<tspan fill="#5E5850">,&#160;</tspan>`;
          s += `<tspan fill="${RGB_G}">${g}</tspan>`;
          s += `<tspan fill="#5E5850">,&#160;</tspan>`;
          s += `<tspan fill="${RGB_B}">${b}</tspan>`;
          s += `</text>`;
        }
      }
      return s;
    }

    function grayscaleGrid(grid, cell, ox, oy) {
      let s = '';
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          const v = grid[i][j];
          s += `<rect x="${ox + j*cell}" y="${oy + i*cell}" width="${cell}" height="${cell}" fill="${rgb(v,v,v)}" stroke="#888" stroke-width="0.5"/>`;
          const tc = v > 140 ? '#111' : '#fff';
          s += `<text x="${ox + j*cell + cell/2}" y="${oy + i*cell + cell/2 + 6}" font-size="17" font-weight="700" fill="${tc}" text-anchor="middle">${v}</text>`;
        }
      }
      s += `<rect x="${ox}" y="${oy}" width="${grid[0].length*cell}" height="${grid.length*cell}" fill="none" stroke="#111" stroke-width="2"/>`;
      return s;
    }

    const steps = [
      {
        title: "Шаг 1. Что видит компьютер?",
        subtitle: "Любая картинка для машины — это просто матрица чисел",
        scene: `
          <text x="200" y="170" class="label" text-anchor="middle">ЧЕЛОВЕК ВИДИТ</text>
          ${colorImage(IMG, 60, 110, 190)}
          <text x="200" y="395" class="small" text-anchor="middle">3 × 3 пикселя (увеличено)</text>

          <line x1="305" y1="280" x2="375" y2="280" stroke="#5E5850" stroke-width="2.5"/>
          <polygon points="375,280 362,274 362,286" fill="#5E5850"/>

          <text x="635" y="170" class="label" text-anchor="middle">КОМПЬЮТЕР ВИДИТ</text>
          ${numberGridRGB(IMG, 160, 60, 395, 190)}
          <text x="635" y="395" class="small" text-anchor="middle">та же сетка — но из чисел (R, G, B) на каждый пиксель</text>

          <g transform="translate(80, 440)">
            <rect width="800" height="115" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
            <text x="400" y="38" class="text" font-weight="700" text-anchor="middle">Любая цифровая картинка хранится в виде чисел.</text>
            <text x="400" y="68" class="small" text-anchor="middle">Дальше разберём: почему чисел три на каждый пиксель,</text>
            <text x="400" y="90" class="small" text-anchor="middle">как из них собирается цвет и почему всё это — 3D тензор.</text>
          </g>
        `
      },
      {
        title: "Шаг 2. Один пиксель — одно число",
        subtitle: "Сначала простой случай — чёрно-белая (grayscale) картинка",
        scene: `
          <text x="510" y="160" class="label" text-anchor="middle">Фрагмент изображения (как в MNIST)</text>
          ${grayscaleGrid(DIGIT, 55, 372, 180)}

          <g transform="translate(70, 215)">
            <rect width="180" height="240" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
            <text x="90" y="34" class="label" text-anchor="middle">ОДИН ПИКСЕЛЬ</text>
            <text x="90" y="58" class="small" text-anchor="middle">=</text>
            <text x="90" y="82" class="label" text-anchor="middle">ОДНО ЧИСЛО (0–255)</text>

            <rect x="40" y="105" width="100" height="60" fill="rgb(60,60,60)" stroke="#111" stroke-width="1.5"/>
            <text x="90" y="143" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">60</text>
            <text x="90" y="187" class="small" text-anchor="middle">тёмно-серый пиксель</text>
            <text x="90" y="208" class="small" text-anchor="middle">(пример из матрицы справа)</text>
          </g>

          <text x="510" y="500" class="text" font-weight="700" text-anchor="middle">0 — чёрный   ·   255 — белый   ·   между — оттенки серого</text>
          <text x="510" y="525" class="small" text-anchor="middle">в MNIST реальный размер цифры — 28 × 28 таких пикселей</text>
        `
      },
      {
        title: "Шаг 3. Цветной пиксель — три числа",
        subtitle: "Любой цвет = смесь R (красный), G (зелёный), B (синий). Каждое 0–255.",
        scene: (function () {
          const examples = [
            { name: 'Красный',  rgb: [230,  60,  60] },
            { name: 'Жёлтый',   rgb: [240, 220,  60] },
            { name: 'Зелёный',  rgb: [ 60, 200,  80] },
            { name: 'Голубой',  rgb: [ 60, 180, 230] }
          ];
          const startX = 130, pixelW = 140, gap = 50;
          let s = '';
          examples.forEach((ex, idx) => {
            const x = startX + idx * (pixelW + gap);
            s += `<text x="${x + pixelW/2}" y="135" class="small" text-anchor="middle">${ex.name}</text>`;
            s += `<rect x="${x}" y="145" width="${pixelW}" height="${pixelW}" fill="${rgb(ex.rgb[0], ex.rgb[1], ex.rgb[2])}" stroke="#111" stroke-width="1.5"/>`;
            const [r, g, b] = ex.rgb;
            const baseY = 145 + pixelW + 28;
            s += `<text x="${x + pixelW/2}" y="${baseY}" font-size="17" font-weight="800" fill="${RGB_R}" text-anchor="middle">R = ${r}</text>`;
            s += `<text x="${x + pixelW/2}" y="${baseY + 24}" font-size="17" font-weight="800" fill="${RGB_G}" text-anchor="middle">G = ${g}</text>`;
            s += `<text x="${x + pixelW/2}" y="${baseY + 48}" font-size="17" font-weight="800" fill="${RGB_B}" text-anchor="middle">B = ${b}</text>`;
          });
          s += `
            <g transform="translate(80, 495)">
              <rect width="800" height="85" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Интуиция: 0 — нет этого цвета, 255 — максимум.</text>
              <text x="400" y="60" class="small" text-anchor="middle">Жёлтый = много R + много G + мало B.   Чёрный = (0, 0, 0).   Белый = (255, 255, 255).</text>
            </g>
          `;
          return s;
        })()
      },
      {
        title: "Шаг 4. Картинка раскладывается на 3 канала",
        subtitle: "На пиксель — три числа, значит вся картинка = три отдельные матрицы",
        scene: `
          ${colorImage(IMG, 60, 80, 270)}
          <text x="170" y="465" class="small" text-anchor="middle">цветная картинка 3×3</text>

          <line x1="260" y1="360" x2="310" y2="360" stroke="#5E5850" stroke-width="2"/>
          <line x1="310" y1="215" x2="310" y2="505" stroke="#5E5850" stroke-width="2"/>

          <line x1="310" y1="215" x2="475" y2="215" stroke="${RGB_R}" stroke-width="2"/>
          <polygon points="475,215 463,210 463,220" fill="${RGB_R}"/>
          <line x1="310" y1="360" x2="475" y2="360" stroke="${RGB_G}" stroke-width="2"/>
          <polygon points="475,360 463,355 463,365" fill="${RGB_G}"/>
          <line x1="310" y1="505" x2="475" y2="505" stroke="${RGB_B}" stroke-width="2"/>
          <polygon points="475,505 463,500 463,510" fill="${RGB_B}"/>

          <text x="490" y="170" font-size="22" font-weight="800" fill="${RGB_R}">R</text>
          ${channelMatrix(IMG, 0, 40, 520, 155, RGB_R)}
          <text x="660" y="185" class="label" fill="${RGB_R}">красный канал</text>
          <text x="660" y="208" class="small">матрица 3×3, значения 0–255</text>

          <text x="490" y="315" font-size="22" font-weight="800" fill="${RGB_G}">G</text>
          ${channelMatrix(IMG, 1, 40, 520, 300, RGB_G)}
          <text x="660" y="330" class="label" fill="${RGB_G}">зелёный канал</text>
          <text x="660" y="353" class="small">та же сетка, но яркость зелёного</text>

          <text x="490" y="460" font-size="22" font-weight="800" fill="${RGB_B}">B</text>
          ${channelMatrix(IMG, 2, 40, 520, 445, RGB_B)}
          <text x="660" y="475" class="label" fill="${RGB_B}">синий канал</text>
          <text x="660" y="498" class="small">опять 3×3 чисел 0–255</text>
        `
      },
      {
        title: "Шаг 5. R + G + B = цветная картинка",
        subtitle: "Складываем интенсивности по всем каналам — получаем итоговый цвет",
        scene: (function () {
          const items = [
            { kind: 'r', label: 'только R' },
            { kind: 'op', symbol: '+' },
            { kind: 'g', label: 'только G' },
            { kind: 'op', symbol: '+' },
            { kind: 'b', label: 'только B' },
            { kind: 'op', symbol: '=' },
            { kind: 'full', label: 'цветная' }
          ];
          let s = '';
          const imgW = 120, opW = 36, gap = 8;
          const totalW = 4*imgW + 3*opW + 6*gap;
          let x = (960 - totalW) / 2;
          const yImg = 210;
          items.forEach(item => {
            if (item.kind === 'op') {
              s += `<text x="${x + opW/2}" y="${yImg + imgW/2}" font-size="34" font-weight="800" fill="#5E5850" text-anchor="middle" dominant-baseline="middle">${item.symbol}</text>`;
              x += opW + gap;
            } else {
              const ch = item.kind === 'r' ? 0 : item.kind === 'g' ? 1 : item.kind === 'b' ? 2 : -1;
              const accent = ch === 0 ? RGB_R : ch === 1 ? RGB_G : ch === 2 ? RGB_B : '#111';
              if (ch >= 0) {
                s += singleChannelImage(IMG, ch, imgW/3, x, yImg, accent);
              } else {
                s += colorImage(IMG, imgW/3, x, yImg, '#111', 2);
              }
              s += `<text x="${x + imgW/2}" y="${yImg + imgW + 22}" class="label" text-anchor="middle" fill="${accent}">${item.label}</text>`;
              x += imgW + gap;
            }
          });
          s += `
            <g transform="translate(80, 410)">
              <rect width="800" height="155" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Каждый пиксель собирается из трёх интенсивностей</text>
              <text x="400" y="62" class="small" text-anchor="middle">Центральный пиксель в этой картинке: R = 220, G = 130, B = 200 — пурпурно-розовый.</text>
              <text x="400" y="85" class="small" text-anchor="middle">«Только R» — это вся картинка, но обнулены G и B. Видим только «красную составляющую».</text>
              <text x="400" y="108" class="small" text-anchor="middle">Аналогично «только G» и «только B». Сложили три слоя — получили исходный цвет.</text>
              <text x="400" y="135" class="small" text-anchor="middle" font-weight="700">Никакого «цвета» в данных нет — только три числа на пиксель.</text>
            </g>
          `;
          return s;
        })()
      },
      {
        title: "Шаг 6. Картинка = 3D тензор",
        subtitle: "Стопка из трёх матриц. Форма: (Высота × Ширина × 3)",
        scene: `
          <rect x="350" y="210" width="320" height="200" fill="#E8F1FE" stroke="${RGB_B}" stroke-width="2.5"/>
          <rect x="310" y="250" width="320" height="200" fill="#EFF8E8" stroke="${RGB_G}" stroke-width="2.5"/>
          <rect x="270" y="290" width="320" height="200" fill="#FFEDED" stroke="${RGB_R}" stroke-width="2.5"/>

          <line x1="350" y1="210" x2="270" y2="290" stroke="#aaa" stroke-width="0.8" stroke-dasharray="3 3"/>
          <line x1="670" y1="210" x2="590" y2="290" stroke="#aaa" stroke-width="0.8" stroke-dasharray="3 3"/>
          <line x1="670" y1="410" x2="590" y2="490" stroke="#aaa" stroke-width="0.8" stroke-dasharray="3 3"/>

          <text x="525" y="232" font-size="26" font-weight="800" fill="${RGB_B}" text-anchor="middle" dominant-baseline="middle">B</text>
          <text x="485" y="272" font-size="26" font-weight="800" fill="${RGB_G}" text-anchor="middle" dominant-baseline="middle">G</text>
          <text x="430" y="395" font-size="64" font-weight="800" fill="${RGB_R}" text-anchor="middle" dominant-baseline="middle" opacity="0.45">R</text>

          <line x1="270" y1="282" x2="590" y2="282" stroke="#5E5850" stroke-width="1.2"/>
          <line x1="270" y1="277" x2="270" y2="287" stroke="#5E5850" stroke-width="1.2"/>
          <line x1="590" y1="277" x2="590" y2="287" stroke="#5E5850" stroke-width="1.2"/>
          <text x="430" y="272" class="label" text-anchor="middle">W (ширина)</text>

          <line x1="262" y1="290" x2="262" y2="490" stroke="#5E5850" stroke-width="1.2"/>
          <line x1="257" y1="290" x2="267" y2="290" stroke="#5E5850" stroke-width="1.2"/>
          <line x1="257" y1="490" x2="267" y2="490" stroke="#5E5850" stroke-width="1.2"/>
          <text class="label" text-anchor="middle" transform="translate(245, 390) rotate(-90)">H (высота)</text>

          <line x1="600" y1="300" x2="680" y2="220" stroke="#5E5850" stroke-width="1.4"/>
          <polygon points="680,220 668,222 672,232" fill="#5E5850"/>
          <text x="695" y="215" class="label" fill="${RGB_G}">C = 3 канала</text>
          <text x="695" y="234" class="small">«глубина» тензора</text>

          <g transform="translate(80, 500)">
            <rect width="800" height="90" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
            <text x="400" y="28" class="text" font-weight="700" text-anchor="middle">Реальные размеры тензора:</text>
            <text x="170" y="58" class="label" text-anchor="middle">CIFAR-10</text>
            <text x="170" y="78" class="small" text-anchor="middle">32 × 32 × 3</text>
            <text x="400" y="58" class="label" text-anchor="middle">ImageNet</text>
            <text x="400" y="78" class="small" text-anchor="middle">224 × 224 × 3</text>
            <text x="630" y="58" class="label" text-anchor="middle">Full HD фото</text>
            <text x="630" y="78" class="small" text-anchor="middle">1080 × 1920 × 3</text>
          </g>
        `
      }
    ];

    let currentStep = 0;

    function renderStep() {
      const step = steps[currentStep];
      $("title").textContent = step.title;
      $("subtitle").textContent = step.subtitle;
      $("counter").textContent = `${currentStep + 1} из ${steps.length}`;
      $("scene").innerHTML = step.scene;
      $("prevGroup").style.display = currentStep === 0 ? "none" : "block";
      $("nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
    }

    function nextStep() {
      if (currentStep < steps.length - 1) currentStep++;
      else currentStep = 0;
      renderStep();
    }

    function prevStep() {
      if (currentStep > 0) currentStep--;
      renderStep();
    }

    $("nextBtn").addEventListener("click", nextStep);
    $("prevBtn").addEventListener("click", prevStep);

    svg.tabIndex = 0;
    svg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });

    renderStep();
  })();
  ]]></script>
</svg>
  </div>
</figure>

### 3.3. Текст — самый хитрый случай

С текстом сложнее всего, потому что «правильное» превращение в числа здесь неочевидно. Наивный путь — закодировать каждую букву её номером (ASCII) — не работает: у слов *cat* и *car* почти одинаковые коды, но совершенно разный смысл, а у *cat* и *kitten* коды разные, хотя по смыслу они близки.

Следующая попытка — **one-hot векторы** — даёт каждому слову уникальный «адрес», но такие векторы огромные, почти полностью из нулей, и все слова в них «одинаково чужие» друг другу. Решение — **эмбеддинги**: короткие плотные векторы из вещественных чисел, которые модель *выстраивает* так, чтобы **геометрия отражала смысл** (близкие по смыслу слова — близкие векторы).

Главное для нашей картины: на вход модели в итоге всё равно идёт **вектор чисел** — просто полученный хитрее, чем у таблицы.
<figure class="embedded-interactive" id="section-interactive-5">
  <div class="interactive-meta">Интерактив 5</div>
  <p class="interactive-desc">Как слова становятся числами: от ASCII через one-hot к эмбеддингам (word embeddings)</p>
  <div class="interactive-svg-wrap">
<svg id="wordEmbeddingsViz" viewBox="0 0 960 680" width="100%" role="img" aria-label="Как слова становятся числами: word embeddings">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .label { font-size: 14px; font-weight: 700; fill: #111111; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

<text id="title" x="36" y="48" class="title"></text>
<text id="subtitle" x="36" y="78" class="subtitle"></text>
<g id="scene"></g>
<text id="counter" x="36" y="635" class="text"></text>
  <g id="prevGroup">
    <rect id="prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="nextGroup">
    <rect id="nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
  (function () {
    const svg = svgRoot;
    const $ = (id) => svg.getElementById(id);

    const C_DATA = '#3576C0';
    const C_PROC = '#C29E08';
    const C_OK   = '#73B222';
    const C_BAD  = '#C30B0A';
    const C_MUTE = '#5E5850';

    function arrowedLine(x1, y1, x2, y2, color, sw, headLen) {
      headLen = headLen || 10;
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx*dx + dy*dy);
      if (len < 0.1) return '';
      const ux = dx / len, uy = dy / len;
      const wingLen = 5;
      const px = -uy, py = ux;
      const bx = x2 - headLen * ux;
      const by = y2 - headLen * uy;
      const w1x = bx + wingLen * px;
      const w1y = by + wingLen * py;
      const w2x = bx - wingLen * px;
      const w2y = by - wingLen * py;
      return `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="${color}" stroke-width="${sw}"/>` +
             `<polygon points="${x2},${y2} ${w1x.toFixed(1)},${w1y.toFixed(1)} ${w2x.toFixed(1)},${w2y.toFixed(1)}" fill="${color}"/>`;
    }

    function dashedLine(x1, y1, x2, y2, color, sw) {
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" stroke-dasharray="5 4"/>`;
    }

    function point(x, y, r, fill, stroke) {
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke || '#111'}" stroke-width="1.5"/>`;
    }

    const VOCAB = ['кот', 'собака', 'автомобиль', 'молоко', 'дом'];

    const EMBEDDINGS = [
      { word: 'кот',        v: [0.85, 0.20] },
      { word: 'собака',     v: [0.90, 0.35] },
      { word: 'молоко',     v: [0.35, 0.25] },
      { word: 'автомобиль', v: [0.15, 0.85] },
      { word: 'дом',        v: [0.20, 0.75] }
    ];

    function asciiExample(word, codes, xCenter, yTop) {
      const boxSize = 52, gap = 14;
      const totalW = word.length * boxSize + (word.length - 1) * gap;
      const startX = xCenter - totalW / 2;
      let s = '';
      s += `<text x="${xCenter}" y="${yTop}" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"${word}"</text>`;
      for (let i = 0; i < word.length; i++) {
        const x = startX + i * (boxSize + gap);
        s += `<rect x="${x}" y="${yTop + 15}" width="${boxSize}" height="${boxSize}" fill="#ffffff" stroke="${C_DATA}" stroke-width="1.5" rx="6"/>`;
        s += `<text x="${x + boxSize/2}" y="${yTop + 15 + boxSize/2 + 8}" font-size="24" font-weight="700" fill="#111" text-anchor="middle">${word[i]}</text>`;
        s += arrowedLine(x + boxSize/2, yTop + 15 + boxSize + 4, x + boxSize/2, yTop + 15 + boxSize + 28, C_MUTE, 1.5, 8);
        s += `<text x="${x + boxSize/2}" y="${yTop + 15 + boxSize + 52}" font-size="20" font-weight="800" fill="${C_DATA}" text-anchor="middle">${codes[i]}</text>`;
      }
      s += `<text x="${xCenter}" y="${yTop + 15 + boxSize + 86}" font-size="16" font-weight="700" fill="#111" text-anchor="middle">→ [${codes.join(', ')}]</text>`;
      return s;
    }

    const steps = [
      {
        title: "Шаг 1. Наивная идея: буква → число (ASCII)",
        subtitle: "Самый простой способ кодировать текст — назначить каждой букве число",
        scene: `
          ${asciiExample('cat', [99, 97, 116], 240, 120)}
          ${asciiExample('dog', [100, 111, 103], 720, 120)}

          <g transform="translate(80, 360)">
            <rect width="800" height="50" rx="10" fill="#F4F8FF" stroke="${C_DATA}" stroke-width="1.2"/>
            <text x="400" y="20" class="label" text-anchor="middle">Откуда числа: ASCII-таблица</text>
            <text x="400" y="40" class="small" text-anchor="middle">a = 97   ·   b = 98   ·   c = 99   ·   d = 100   ·   …   ·   z = 122   ·   ' ' = 32   ·   '!' = 33</text>
          </g>

          <g transform="translate(80, 440)">
            <rect width="800" height="130" rx="12" fill="#FFFBEB" stroke="${C_PROC}" stroke-width="1.5"/>
            <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Так компьютер хранит текст: 1 буква = 1 число (0–255)</text>
            <text x="400" y="60" class="small" text-anchor="middle">ASCII — реальный стандарт, используется в каждом текстовом файле.</text>
            <text x="400" y="82" class="small" text-anchor="middle">Слово целиком = массив чисел. Это естественная первая мысль:</text>
            <text x="400" y="104" class="small" text-anchor="middle">взять эти массивы и подавать в нейросеть. Дальше — почему так не работает.</text>
          </g>
        `
      },

      {
        title: "Шаг 2. Почему ASCII не подходит для смысла",
        subtitle: "Близость кодов не равна близости смысла — это две разные вещи",
        scene: `
          <g transform="translate(80, 110)">
            <rect width="380" height="300" rx="12" fill="#FFF2F2" stroke="${C_BAD}" stroke-width="1.5"/>
            <text x="190" y="32" class="label" fill="${C_BAD}" text-anchor="middle">Близкие коды — разный смысл</text>

            <text x="100" y="80" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"cat"</text>
            <text x="100" y="108" font-size="15" font-weight="700" fill="${C_DATA}" text-anchor="middle">[99, 97, 116]</text>

            <text x="280" y="80" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"car"</text>
            <text x="280" y="108" font-size="15" font-weight="700" fill="${C_DATA}" text-anchor="middle">[99, 97, 114]</text>

            <text x="190" y="160" class="small" text-anchor="middle">Отличаются только на 2</text>
            <text x="190" y="178" class="small" text-anchor="middle">в одной позиции</text>
            <text x="190" y="196" class="small" text-anchor="middle">→ для ASCII почти одно и то же</text>

            <text x="190" y="235" class="text" font-weight="700" text-anchor="middle">Но cat ≠ car</text>
            <text x="190" y="260" class="small" text-anchor="middle">(животное vs транспорт —</text>
            <text x="190" y="278" class="small" text-anchor="middle">никакого сходства по смыслу)</text>
          </g>

          <g transform="translate(500, 110)">
            <rect width="380" height="300" rx="12" fill="#FFF2F2" stroke="${C_BAD}" stroke-width="1.5"/>
            <text x="190" y="32" class="label" fill="${C_BAD}" text-anchor="middle">Близкий смысл — разные коды</text>

            <text x="100" y="80" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"cat"</text>
            <text x="100" y="108" font-size="15" font-weight="700" fill="${C_DATA}" text-anchor="middle">[99, 97, 116]</text>

            <text x="280" y="80" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"kitten"</text>
            <text x="280" y="108" font-size="12" font-weight="700" fill="${C_DATA}" text-anchor="middle">[107, 105, 116, 116, 101, 110]</text>

            <text x="190" y="160" class="small" text-anchor="middle">Совсем разные числа,</text>
            <text x="190" y="178" class="small" text-anchor="middle">даже длины массивов разные</text>

            <text x="190" y="235" class="text" font-weight="700" text-anchor="middle">Но kitten ≈ cat</text>
            <text x="190" y="260" class="small" text-anchor="middle">(котёнок и кошка —</text>
            <text x="190" y="278" class="small" text-anchor="middle">буквально семья)</text>
          </g>

          <g transform="translate(80, 440)">
            <rect width="800" height="130" rx="12" fill="#FFFBEB" stroke="${C_PROC}" stroke-width="1.5"/>
            <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">ASCII оптимизирован для хранения, а не для понимания</text>
            <text x="400" y="60" class="small" text-anchor="middle">Числа в ASCII — это просто порядковые номера символов в таблице.</text>
            <text x="400" y="82" class="small" text-anchor="middle">Они отражают «как буква записана», но ничего не знают про смысл слов.</text>
            <text x="400" y="106" class="small" text-anchor="middle">Нужен другой способ — на уровне слов, а не букв.</text>
          </g>
        `
      },

      {
        title: "Шаг 3. Идея получше: one-hot encoding",
        subtitle: "Словарь из V слов. Каждое слово — вектор длины V с единственной 1.",
        scene: (function () {
          let s = '';
          const startY = 145;
          const rowH = 56;
          const boxSize = 44;
          const gap = 8;
          const labelX = 175;
          const boxStartX = 250;

          s += `<text x="${labelX}" y="${startY - 14}" class="label" text-anchor="middle">слово</text>`;
          s += `<text x="${boxStartX + (5 * boxSize + 4 * gap) / 2}" y="${startY - 14}" class="label" text-anchor="middle">one-hot вектор</text>`;
          s += `<text x="${boxStartX + 5 * (boxSize + gap) + 60}" y="${startY - 14}" class="label" text-anchor="middle">как массив</text>`;

          VOCAB.forEach((word, idx) => {
            const y = startY + idx * rowH;
            s += `<text x="${labelX}" y="${y + boxSize/2 + 6}" font-size="17" font-weight="700" fill="#111" text-anchor="middle">${word}</text>`;
            const vec = [];
            for (let j = 0; j < 5; j++) {
              const bx = boxStartX + j * (boxSize + gap);
              const isActive = j === idx;
              vec.push(isActive ? 1 : 0);
              if (isActive) {
                s += `<rect x="${bx}" y="${y}" width="${boxSize}" height="${boxSize}" fill="${C_DATA}" stroke="${C_DATA}" stroke-width="1.5" rx="6"/>`;
                s += `<text x="${bx + boxSize/2}" y="${y + boxSize/2 + 7}" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">1</text>`;
              } else {
                s += `<rect x="${bx}" y="${y}" width="${boxSize}" height="${boxSize}" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/>`;
                s += `<text x="${bx + boxSize/2}" y="${y + boxSize/2 + 7}" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text>`;
              }
            }
            const arrayX = boxStartX + 5 * (boxSize + gap) + 5;
            s += `<text x="${arrayX}" y="${y + boxSize/2 + 5}" font-size="14" font-weight="700" fill="#111">[${vec.join(', ')}]</text>`;
          });

          s += `
            <g transform="translate(80, 460)">
              <rect width="800" height="110" rx="12" fill="#FFFBEB" stroke="${C_PROC}" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Каждое слово получает уникальный «адрес» в словаре</text>
              <text x="400" y="58" class="small" text-anchor="middle">Длина вектора = размер словаря V. Единица — в позиции слова, остальное — нули.</text>
              <text x="400" y="80" class="small" text-anchor="middle">В реальности V = 10 000 — 50 000 слов. Огромный вектор почти из одних нулей.</text>
              <text x="400" y="102" class="small" text-anchor="middle">Уже лучше ASCII: компьютер видит «слово №42», а не «три буквы».</text>
            </g>
          `;
          return s;
        })()
      },

      {
        title: "Шаг 4. Проблема one-hot: все слова одинаково далеки",
        subtitle: "Векторы попарно ортогональны — расстояние между любыми двумя одинаковое",
        scene: (function () {
          let s = '';
          const ox = 270, oy = 405;
          const xEndX = ox + 200, xEndY = oy;
          const yEndX = ox, yEndY = oy - 200;
          const zEndX = ox + 130, zEndY = oy - 110;

          s += arrowedLine(ox, oy, xEndX, xEndY, C_MUTE, 1.5);
          s += arrowedLine(ox, oy, yEndX, yEndY, C_MUTE, 1.5);
          s += arrowedLine(ox, oy, zEndX, zEndY, C_MUTE, 1.5);

          s += `<text x="${xEndX + 8}" y="${xEndY + 5}" class="small">ось 1</text>`;
          s += `<text x="${yEndX - 5}" y="${yEndY - 10}" class="small">ось 2</text>`;
          s += `<text x="${zEndX + 8}" y="${zEndY - 4}" class="small">ось 3</text>`;

          s += dashedLine(xEndX, xEndY, yEndX, yEndY, C_BAD, 1.2);
          s += dashedLine(xEndX, xEndY, zEndX, zEndY, C_BAD, 1.2);
          s += dashedLine(yEndX, yEndY, zEndX, zEndY, C_BAD, 1.2);

          const lblBox = (mx, my, text) => {
            return `<rect x="${mx - 18}" y="${my - 12}" width="36" height="20" rx="4" fill="#fff" stroke="${C_BAD}" stroke-width="0.8"/>` +
                   `<text x="${mx}" y="${my + 3}" font-size="13" font-weight="700" fill="${C_BAD}" text-anchor="middle">${text}</text>`;
          };

          s += lblBox((xEndX + yEndX)/2, (xEndY + yEndY)/2, '√2');
          s += lblBox((xEndX + zEndX)/2 + 8, (xEndY + zEndY)/2 + 8, '√2');
          s += lblBox((yEndX + zEndX)/2 - 14, (yEndY + zEndY)/2, '√2');

          s += point(xEndX, xEndY, 7, C_DATA);
          s += `<text x="${xEndX + 10}" y="${xEndY + 6}" class="label">кот</text>`;

          s += point(yEndX, yEndY, 7, C_DATA);
          s += `<text x="${yEndX + 12}" y="${yEndY + 4}" class="label">собака</text>`;

          s += point(zEndX, zEndY, 7, C_DATA);
          s += `<text x="${zEndX + 10}" y="${zEndY - 8}" class="label">автомобиль</text>`;

          s += `<text x="${ox - 12}" y="${oy + 18}" class="small">0</text>`;

          s += `
            <g transform="translate(560, 110)">
              <rect width="320" height="280" rx="12" fill="#F4F8FF" stroke="${C_DATA}" stroke-width="1.5"/>
              <text x="160" y="35" class="label" text-anchor="middle">Что не так?</text>
              <text x="20" y="72" class="small">• Все векторы перпендикулярны</text>
              <text x="20" y="92" class="small">  друг другу (ортогональны)</text>
              <text x="20" y="130" class="small">• Расстояние между любыми</text>
              <text x="20" y="150" class="small">  двумя словами одинаковое: √2</text>
              <text x="20" y="190" class="small">  d(кот, собака) =</text>
              <text x="20" y="210" class="small">  d(кот, автомобиль) = √2</text>
              <text x="20" y="248" class="small" font-weight="700">• Семантика нулевая —</text>
              <text x="20" y="268" class="small" font-weight="700">  все слова одинаково «чужие»</text>
            </g>

            <g transform="translate(80, 460)">
              <rect width="800" height="110" rx="12" fill="#FFF2F2" stroke="${C_BAD}" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" fill="${C_BAD}" text-anchor="middle">Нельзя сказать, что кот ближе к собаке, чем к автомобилю</text>
              <text x="400" y="60" class="small" text-anchor="middle">При V = 50 000 — гигантские разреженные векторы, и каждое слово «остров».</text>
              <text x="400" y="82" class="small" text-anchor="middle">Нужны векторы, у которых геометрия отражает семантику.</text>
              <text x="400" y="102" class="small" text-anchor="middle">Так появляются эмбеддинги — следующий шаг.</text>
            </g>
          `;
          return s;
        })()
      },

      {
        title: "Шаг 5. Эмбеддинги: плотный вектор с реальными числами",
        subtitle: "Каждое слово — короткий массив осмысленных чисел",
        scene: (function () {
          let s = '';

          s += `<text x="290" y="135" class="label" text-anchor="middle">слово → вектор (длина 2 для примера)</text>`;

          const startY = 165;
          const rowH = 46;
          EMBEDDINGS.forEach((e, i) => {
            const y = startY + i * rowH;
            s += `<rect x="100" y="${y}" width="380" height="${rowH - 6}" fill="${i % 2 === 0 ? '#FAFAFA' : '#FFFFFF'}" stroke="${C_DATA}" stroke-width="0.6" rx="4"/>`;
            s += `<text x="210" y="${y + (rowH - 6)/2 + 5}" font-size="16" font-weight="700" fill="#111" text-anchor="end">${e.word}</text>`;
            s += `<text x="235" y="${y + (rowH - 6)/2 + 5}" font-size="16" fill="${C_MUTE}" text-anchor="middle">→</text>`;
            s += `<text x="265" y="${y + (rowH - 6)/2 + 5}" font-size="18" fill="#111">[</text>`;
            s += `<text x="320" y="${y + (rowH - 6)/2 + 5}" font-size="15" font-weight="700" fill="${C_DATA}" text-anchor="middle">${e.v[0].toFixed(2)}</text>`;
            s += `<text x="355" y="${y + (rowH - 6)/2 + 5}" font-size="15" fill="${C_MUTE}" text-anchor="middle">,</text>`;
            s += `<text x="395" y="${y + (rowH - 6)/2 + 5}" font-size="15" font-weight="700" fill="${C_DATA}" text-anchor="middle">${e.v[1].toFixed(2)}</text>`;
            s += `<text x="450" y="${y + (rowH - 6)/2 + 5}" font-size="18" fill="#111">]</text>`;
          });

          s += `
            <g transform="translate(540, 145)">
              <rect width="340" height="245" rx="12" fill="#F4F8FF" stroke="${C_DATA}" stroke-width="1.5"/>
              <text x="170" y="32" class="label" text-anchor="middle">Особенности</text>
              <text x="20" y="64" class="small">• Длина вектора маленькая:</text>
              <text x="20" y="83" class="small">  в реальности 50–1000 чисел</text>

              <text x="20" y="115" class="small">• Числа реальные (0.34, -0.12...),</text>
              <text x="20" y="134" class="small">  не нули и единицы</text>

              <text x="20" y="166" class="small">• Подбираются обучением модели —</text>
              <text x="20" y="185" class="small">  не задаются вручную</text>

              <text x="20" y="216" class="small" font-weight="700">• Сами по себе числа выглядят</text>
              <text x="20" y="232" class="small" font-weight="700">  случайно. Магия — в геометрии.</text>
            </g>

            <g transform="translate(80, 410)">
              <rect width="800" height="160" rx="12" fill="#FFFBEB" stroke="${C_PROC}" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Контраст с one-hot</text>
              <text x="400" y="60" class="small" text-anchor="middle">one-hot: длина 50 000, почти всё нули, единственная 1</text>
              <text x="400" y="82" class="small" text-anchor="middle">embedding: длина 50–1000, все числа значимые и реальные</text>
              <text x="400" y="104" class="small" text-anchor="middle">one-hot задаются вручную; эмбеддинги выстраиваются из текстов</text>
              <text x="400" y="135" class="small" text-anchor="middle" font-weight="700">Главное — у этих чисел появляется геометрический смысл (следующий шаг).</text>
            </g>
          `;
          return s;
        })()
      },

      {
        title: "Шаг 6. Геометрия: близкие по смыслу слова рядом",
        subtitle: "Те же 5 слов как точки на плоскости. Близость = семантическое сходство.",
        scene: (function () {
          let s = '';
          const plotL = 80, plotR = 700, plotT = 110, plotB = 420;

          s += `<rect x="${plotL}" y="${plotT}" width="${plotR - plotL}" height="${plotB - plotT}" fill="#FAFCFF" stroke="#DDE" stroke-width="1" rx="6"/>`;

          s += arrowedLine(plotL + 30, plotB - 30, plotR - 15, plotB - 30, C_MUTE, 1.2);
          s += arrowedLine(plotL + 30, plotB - 30, plotL + 30, plotT + 15, C_MUTE, 1.2);
          s += `<text x="${plotR - 90}" y="${plotB - 12}" class="small">ось 1 (→ живое)</text>`;
          s += `<text class="small" transform="translate(${plotL + 18}, ${plotT + 100}) rotate(-90)" text-anchor="middle">ось 2 (→ крупное)</text>`;

          const px = (x) => plotL + 40 + x * (plotR - plotL - 70);
          const py = (y) => plotB - 40 - y * (plotB - plotT - 60);

          const ax = (px(0.85) + px(0.90)) / 2;
          const ay = (py(0.20) + py(0.35)) / 2;
          s += `<ellipse cx="${ax}" cy="${ay}" rx="62" ry="48" fill="${C_OK}" fill-opacity="0.10" stroke="${C_OK}" stroke-width="1.3" stroke-dasharray="5 4"/>`;
          s += `<text x="${ax + 70}" y="${ay - 30}" class="label" fill="${C_OK}">животные</text>`;

          const bx = (px(0.15) + px(0.20)) / 2;
          const by = (py(0.85) + py(0.75)) / 2;
          s += `<ellipse cx="${bx}" cy="${by}" rx="58" ry="48" fill="${C_DATA}" fill-opacity="0.10" stroke="${C_DATA}" stroke-width="1.3" stroke-dasharray="5 4"/>`;
          s += `<text x="${bx + 70}" y="${by - 30}" class="label" fill="${C_DATA}">крупное, неживое</text>`;

          const points = {};
          EMBEDDINGS.forEach(e => { points[e.word] = { x: px(e.v[0]), y: py(e.v[1]) }; });

          s += dashedLine(points['кот'].x, points['кот'].y, points['собака'].x, points['собака'].y, C_OK, 1.5);
          s += `<text x="${(points['кот'].x + points['собака'].x)/2 + 14}" y="${(points['кот'].y + points['собака'].y)/2 - 4}" font-size="12" font-weight="700" fill="${C_OK}">близко</text>`;

          s += dashedLine(points['кот'].x, points['кот'].y, points['автомобиль'].x, points['автомобиль'].y, C_BAD, 1.5);
          s += `<text x="${(points['кот'].x + points['автомобиль'].x)/2 - 30}" y="${(points['кот'].y + points['автомобиль'].y)/2 + 18}" font-size="12" font-weight="700" fill="${C_BAD}">далеко</text>`;

          EMBEDDINGS.forEach(e => {
            const p = points[e.word];
            s += point(p.x, p.y, 6, '#111');
            let lx = p.x + 10, ly = p.y + 5;
            if (e.word === 'собака') { lx = p.x + 10; ly = p.y - 10; }
            if (e.word === 'автомобиль') { lx = p.x - 10; ly = p.y - 10; }
            if (e.word === 'дом') { lx = p.x + 10; ly = p.y + 18; }
            if (e.word === 'молоко') { lx = p.x + 10; ly = p.y + 5; }
            const anchor = (e.word === 'автомобиль') ? 'end' : 'start';
            s += `<text x="${lx}" y="${ly}" class="label" text-anchor="${anchor}">${e.word}</text>`;
          });

          s += `
            <g transform="translate(720, 110)">
              <rect width="160" height="310" rx="12" fill="#F0FAF0" stroke="${C_OK}" stroke-width="1.5"/>
              <text x="80" y="32" class="label" text-anchor="middle">Что видно</text>
              <text x="10" y="68" class="small">• кот и собака</text>
              <text x="10" y="86" class="small">  оказались рядом</text>

              <text x="10" y="120" class="small">• автомобиль и дом</text>
              <text x="10" y="138" class="small">  тоже близко</text>

              <text x="10" y="172" class="small">• молоко</text>
              <text x="10" y="190" class="small">  само по себе</text>

              <text x="10" y="240" class="small" font-weight="700">Расстояние</text>
              <text x="10" y="258" class="small" font-weight="700">в пространстве</text>
              <text x="10" y="276" class="small" font-weight="700">= близость</text>
              <text x="10" y="294" class="small" font-weight="700">по смыслу</text>
            </g>

            <g transform="translate(80, 440)">
              <rect width="800" height="130" rx="12" fill="#F0FAF0" stroke="${C_OK}" stroke-width="1.5"/>
              <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Геометрия теперь несёт смысл</text>
              <text x="400" y="60" class="small" text-anchor="middle">В one-hot все слова на расстоянии √2 друг от друга — это бесполезно.</text>
              <text x="400" y="82" class="small" text-anchor="middle">В embeddings: d(кот, собака) маленькое, d(кот, автомобиль) большое.</text>
              <text x="400" y="106" class="small" text-anchor="middle">Откуда модель берёт именно такие числа? Следующий шаг — обучение.</text>
            </g>
          `;
          return s;
        })()
      },

      {
        title: "Шаг 7. Как обучаются эмбеддинги: предсказание контекста",
        subtitle: "Слова, появляющиеся в похожих контекстах, получают похожие векторы (Word2Vec)",
        scene: `
          <g transform="translate(80, 110)">
            <rect width="800" height="135" rx="12" fill="#F4F8FF" stroke="${C_DATA}" stroke-width="1.2"/>
            <text x="400" y="32" class="label" text-anchor="middle">Модель видит миллионы предложений из текста. Сравните:</text>

            <text x="60" y="76" font-size="18" fill="#111">Пушистый</text>
            <rect x="172" y="58" width="80" height="28" fill="${C_OK}" fill-opacity="0.20" stroke="${C_OK}" stroke-width="1.5" rx="5"/>
            <text x="212" y="78" font-size="18" font-weight="800" fill="${C_OK}" text-anchor="middle">кот</text>
            <text x="265" y="76" font-size="18" fill="#111">сидит на коврике.</text>

            <text x="60" y="115" font-size="18" fill="#111">Пушистый</text>
            <rect x="172" y="97" width="80" height="28" fill="${C_OK}" fill-opacity="0.20" stroke="${C_OK}" stroke-width="1.5" rx="5"/>
            <text x="212" y="117" font-size="18" font-weight="800" fill="${C_OK}" text-anchor="middle">пёс</text>
            <text x="265" y="115" font-size="18" fill="#111">сидит на коврике.</text>

            <text x="560" y="78" class="small" fill="${C_MUTE}" font-weight="700">одинаковый</text>
            <text x="560" y="96" class="small" fill="${C_MUTE}" font-weight="700">контекст:</text>
            <text x="560" y="118" class="small" fill="${C_MUTE}">«Пушистый ___ сидит»</text>
          </g>

          <g transform="translate(80, 270)">
            <rect width="800" height="170" rx="12" fill="#fff" stroke="${C_PROC}" stroke-width="1.2"/>
            <text x="400" y="28" class="label" text-anchor="middle" fill="${C_PROC}">Что делает обучение: подвигает векторы ближе</text>

            <text x="160" y="58" class="small" text-anchor="middle" font-weight="700">До обучения</text>
            <circle cx="90" cy="110" r="6" fill="none" stroke="#111" stroke-width="1.5" stroke-dasharray="3 2"/>
            <text x="90" y="132" class="small" text-anchor="middle">кот</text>
            <circle cx="240" cy="130" r="6" fill="none" stroke="#111" stroke-width="1.5" stroke-dasharray="3 2"/>
            <text x="240" y="152" class="small" text-anchor="middle">пёс</text>

            ${arrowedLine(330, 115, 460, 115, C_PROC, 2.5, 12)}
            <text x="395" y="103" class="small" text-anchor="middle" fill="${C_PROC}" font-weight="700">обучение</text>
            <text x="395" y="138" class="small" text-anchor="middle">млрд примеров</text>

            <text x="620" y="58" class="small" text-anchor="middle" font-weight="700">После обучения</text>
            <circle cx="600" cy="120" r="6" fill="${C_OK}" stroke="#111" stroke-width="1.5"/>
            <text x="600" y="142" class="small" text-anchor="middle" font-weight="700">кот</text>
            <circle cx="645" cy="125" r="6" fill="${C_OK}" stroke="#111" stroke-width="1.5"/>
            <text x="645" y="147" class="small" text-anchor="middle" font-weight="700">пёс</text>

            <text x="622" y="95" class="small" fill="${C_OK}" font-weight="700" text-anchor="middle">рядом</text>
          </g>

          <g transform="translate(80, 460)">
            <rect width="800" height="110" rx="12" fill="#FFFBEB" stroke="${C_PROC}" stroke-width="1.5"/>
            <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Word2Vec (2013): нейросеть учится предсказывать соседние слова</text>
            <text x="400" y="58" class="small" text-anchor="middle">«Кот» и «пёс» появляются в похожих фразах — их векторы сближаются.</text>
            <text x="400" y="80" class="small" text-anchor="middle">«Автомобиль» в таких контекстах не встречается — его вектор остаётся далеко.</text>
            <text x="400" y="100" class="small" text-anchor="middle">После миллиардов примеров — стабильная карта смыслов.</text>
          </g>
        `
      },

      {
        title: "Шаг 8. Магия: с векторами слов можно считать",
        subtitle: "Классика Word2Vec: vec('король') − vec('мужчина') + vec('женщина') ≈ vec('королева')",
        scene: (function () {
          let s = '';
          const plotL = 140, plotR = 820, plotT = 100, plotB = 410;
          s += `<rect x="${plotL}" y="${plotT}" width="${plotR - plotL}" height="${plotB - plotT}" fill="#FAFCFF" stroke="#DDE" stroke-width="1" rx="6"/>`;

          s += arrowedLine(plotL + 30, plotB - 30, plotR - 15, plotB - 30, C_MUTE, 1.2);
          s += arrowedLine(plotL + 30, plotB - 30, plotL + 30, plotT + 15, C_MUTE, 1.2);
          s += `<text x="${plotR - 100}" y="${plotB - 12}" class="small">«женское» →</text>`;
          s += `<text class="small" transform="translate(${plotL + 18}, ${plotT + 90}) rotate(-90)" text-anchor="middle">«королевское» →</text>`;

          const px = (x) => plotL + 50 + x * (plotR - plotL - 90);
          const py = (y) => plotB - 50 - y * (plotB - plotT - 80);

          const pts = {
            man:   { p: [0.15, 0.15], label: 'мужчина' },
            king:  { p: [0.25, 0.70], label: 'король' },
            woman: { p: [0.70, 0.20], label: 'женщина' },
            queen: { p: [0.80, 0.75], label: 'королева' }
          };

          const sx = px(pts.man.p[0]),   sy = py(pts.man.p[1]);
          const kx = px(pts.king.p[0]),  ky = py(pts.king.p[1]);
          const wx = px(pts.woman.p[0]), wy = py(pts.woman.p[1]);
          const qx = px(pts.queen.p[0]), qy = py(pts.queen.p[1]);

          s += arrowedLine(sx, sy, kx, ky, C_OK, 2.6, 12);
          s += arrowedLine(wx, wy, qx, qy, C_OK, 2.6, 12);

          s += `<text x="${(sx + kx)/2 - 12}" y="${(sy + ky)/2 + 5}" class="small" fill="${C_OK}" font-weight="700" text-anchor="end">+ королевское</text>`;
          s += `<text x="${(wx + qx)/2 + 12}" y="${(wy + qy)/2 + 5}" class="small" fill="${C_OK}" font-weight="700">+ королевское</text>`;

          s += dashedLine(sx, sy, wx, wy, C_PROC, 1.5);
          s += `<text x="${(sx + wx)/2}" y="${(sy + wy)/2 + 20}" class="small" fill="${C_PROC}" font-weight="700" text-anchor="middle">+ женское</text>`;

          s += dashedLine(kx, ky, qx, qy, C_PROC, 1.5);
          s += `<text x="${(kx + qx)/2}" y="${(ky + qy)/2 - 10}" class="small" fill="${C_PROC}" font-weight="700" text-anchor="middle">+ женское</text>`;

          ['man', 'king', 'woman', 'queen'].forEach(k => {
            const pt = pts[k];
            const x = px(pt.p[0]), y = py(pt.p[1]);
            s += point(x, y, 7, '#111', '#fff');
          });

          s += `<text x="${sx - 10}" y="${sy + 5}" class="label" text-anchor="end">мужчина</text>`;
          s += `<text x="${kx - 10}" y="${ky + 5}" class="label" text-anchor="end">король</text>`;
          s += `<text x="${wx + 12}" y="${wy + 5}" class="label">женщина</text>`;
          s += `<text x="${qx + 12}" y="${qy + 5}" class="label">королева</text>`;

          s += `
            <g transform="translate(80, 430)">
              <rect width="800" height="140" rx="12" fill="#F0FAF0" stroke="${C_OK}" stroke-width="1.5"/>
              <text x="400" y="30" class="text" font-weight="700" text-anchor="middle">Эмбеддинги несут смысловые отношения</text>
              <text x="400" y="62" font-size="18" font-weight="800" fill="${C_OK}" text-anchor="middle">vec(король) − vec(мужчина) + vec(женщина) ≈ vec(королева)</text>
              <text x="400" y="90" class="small" text-anchor="middle">Разница между «королём» и «мужчиной» — тот же вектор, что между «королевой» и «женщиной».</text>
              <text x="400" y="110" class="small" text-anchor="middle">Модель выучила «королевское» и «женское» как направления в пространстве.</text>
              <text x="400" y="130" class="small" text-anchor="middle" font-weight="700">С эмбеддингами можно считать. И именно так работают все современные языковые модели.</text>
            </g>
          `;
          return s;
        })()
      }
    ];

    let currentStep = 0;

    function renderStep() {
      const step = steps[currentStep];
      $("title").textContent = step.title;
      $("subtitle").textContent = step.subtitle;
      $("counter").textContent = `${currentStep + 1} из ${steps.length}`;
      $("scene").innerHTML = step.scene;
      $("prevGroup").style.display = currentStep === 0 ? "none" : "block";
      $("nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
    }

    function nextStep() {
      if (currentStep < steps.length - 1) currentStep++;
      else currentStep = 0;
      renderStep();
    }

    function prevStep() {
      if (currentStep > 0) currentStep--;
      renderStep();
    }

    $("nextBtn").addEventListener("click", nextStep);
    $("prevBtn").addEventListener("click", prevStep);

    svg.tabIndex = 0;
    svg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });

    renderStep();
  })();
  ]]></script>
</svg>
  </div>
</figure>

### 3.4. Общий знаменатель

Если отойти на шаг назад, видно одну и ту же картину:

| Тип данных | Во что превращается | Форма |
| --- | --- | --- |
| Таблица (один объект) | вектор | `(m,)` |
| Изображение | тензор | `(H × W × C)` |
| Текст (слово/токен) | вектор-эмбеддинг | `(d,)` |
| Аудио, временные ряды | вектор / 1D-сигнал | `(t,)` |

> *Аудио и временные ряды добавлены для полноты — они тоже сводятся к числам. При желании это отдельный мини-интерактив, но для статьи достаточно строки в таблице.*

Вывод раздела: **любой вход — это тензор чисел фиксированной формы.** Эта форма — первое, что определяет, какую модель мы вообще можем использовать.
<figure class="embedded-interactive" id="section-interactive-6">
  <div class="interactive-meta">Интерактив 6</div>
  <p class="interactive-desc">Любой вход — таблица, картинка, текст, аудио — превращается в тензор чисел</p>
  <div class="interactive-svg-wrap">
<svg id="mlTensors" viewBox="0 0 960 680" width="100%" role="img" aria-label="Любой вход превращается в тензор чисел">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .lbl { font-size: 15px; fill: #111111; }
    .mono { font-size: 15px; fill: #111111; font-family: "Courier New", monospace; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F6F5F3; stroke: #5E5850; stroke-width: 1.3; rx: 14; }
    .box-dark   { fill: #1b1d26; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>
  <defs>
    <marker id="tsArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
  </defs>

<text id="title" x="36" y="48" class="title"></text>
<text id="subtitle" x="36" y="78" class="subtitle"></text>
<g id="scene"></g>
<text id="counter" x="36" y="635" class="text"></text>
  <g id="prevGroup">
    <rect id="prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="nextGroup">
    <rect id="nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      const steps = [
        {
          title: "Шаг 1. Модель понимает только числа",
          subtitle: "Картинка, текст, таблица — для модели это не «образы», а наборы чисел",
          scene: `
            <rect class="box-blue" x="80" y="230" width="200" height="160"/>
            <text x="180" y="270" class="lbl" text-anchor="middle" font-weight="700">Таблица</text>
            <g stroke="#3576C0" stroke-width="1.2" fill="none">
              <rect x="110" y="290" width="140" height="60"/>
              <line x1="110" y1="310" x2="250" y2="310"/>
              <line x1="110" y1="330" x2="250" y2="330"/>
              <line x1="157" y1="290" x2="157" y2="350"/>
              <line x1="203" y1="290" x2="203" y2="350"/>
            </g>

            <rect class="box-blue" x="380" y="230" width="200" height="160"/>
            <text x="480" y="270" class="lbl" text-anchor="middle" font-weight="700">Картинка</text>
            <g>
              <rect x="420" y="288" width="20" height="20" fill="#C30B0A"/>
              <rect x="440" y="288" width="20" height="20" fill="#C29E08"/>
              <rect x="460" y="288" width="20" height="20" fill="#73B222"/>
              <rect x="480" y="288" width="20" height="20" fill="#3576C0"/>
              <rect x="420" y="308" width="20" height="20" fill="#C29E08"/>
              <rect x="440" y="308" width="20" height="20" fill="#73B222"/>
              <rect x="460" y="308" width="20" height="20" fill="#3576C0"/>
              <rect x="480" y="308" width="20" height="20" fill="#C30B0A"/>
              <rect x="420" y="328" width="20" height="20" fill="#73B222"/>
              <rect x="440" y="328" width="20" height="20" fill="#3576C0"/>
              <rect x="460" y="328" width="20" height="20" fill="#C30B0A"/>
              <rect x="480" y="328" width="20" height="20" fill="#C29E08"/>
            </g>

            <rect class="box-blue" x="680" y="230" width="200" height="160"/>
            <text x="780" y="270" class="lbl" text-anchor="middle" font-weight="700">Текст</text>
            <text x="780" y="325" text-anchor="middle" font-size="26" font-weight="700" fill="#3576C0">«кот»</text>

            <text x="480" y="450" class="text" text-anchor="middle" font-weight="700">Внутри коробки все они должны превратиться в числа</text>
            <text x="480" y="482" class="small" text-anchor="middle">Дальше посмотрим, как именно это происходит с каждым</text>
          `
        },
        {
          title: "Шаг 2. Таблица → вектор чисел",
          subtitle: "Одна строка таблицы — это список чисел в фиксированном порядке",
          scene: `
            <text x="200" y="220" class="lbl" text-anchor="middle">Одна квартира</text>
            <g stroke="#3576C0" stroke-width="1.3" fill="none">
              <rect x="90" y="250" width="220" height="120"/>
              <line x1="90" y1="280" x2="310" y2="280"/>
              <line x1="90" y1="310" x2="310" y2="310"/>
              <line x1="90" y1="340" x2="310" y2="340"/>
              <line x1="200" y1="250" x2="200" y2="370"/>
            </g>
            <g class="small" fill="#5E5850">
              <text x="100" y="300">площадь</text><text x="240" y="300">65</text>
              <text x="100" y="330">комнаты</text><text x="240" y="330">2</text>
              <text x="100" y="360">этаж</text><text x="240" y="360">4</text>
            </g>

            <line x1="330" y1="310" x2="452" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#tsArrow)"/>

            <rect class="box-green" x="470" y="270" width="410" height="80"/>
            <text x="675" y="318" class="mono" text-anchor="middle" font-weight="700" fill="#73B222">x = [65, 2, 4, 10]</text>

            <text x="675" y="410" class="small" text-anchor="middle">Вектор формы <tspan font-weight="700">(m,)</tspan> — m признаков подряд</text>
            <text x="480" y="500" class="small" text-anchor="middle">Порядок важен: 2-я позиция всегда «комнаты», 3-я всегда «этаж»</text>
          `
        },
        {
          title: "Шаг 3. Картинка → тензор чисел",
          subtitle: "Каждый пиксель — это числа интенсивности по каналам R, G, B",
          scene: `
            <text x="200" y="215" class="lbl" text-anchor="middle">Один пиксель</text>
            <rect x="150" y="235" width="100" height="100" fill="#dc82c8" stroke="#3576C0" stroke-width="1.5"/>

            <line x1="266" y1="285" x2="388" y2="285" stroke="#5E5850" stroke-width="2.5" marker-end="url(#tsArrow)"/>

            <rect class="box-red"   x="400" y="240" width="150" height="44"/>
            <text x="475" y="268" class="mono" text-anchor="middle" font-weight="700" fill="#C30B0A">R = 220</text>
            <rect class="box-green" x="400" y="292" width="150" height="44"/>
            <text x="475" y="320" class="mono" text-anchor="middle" font-weight="700" fill="#73B222">G = 130</text>
            <rect class="box-blue"  x="400" y="344" width="150" height="44"/>
            <text x="475" y="372" class="mono" text-anchor="middle" font-weight="700" fill="#3576C0">B = 200</text>

            <line x1="566" y1="314" x2="612" y2="314" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>
            <rect class="box-gray" x="625" y="270" width="255" height="88"/>
            <text x="752" y="305" class="text" text-anchor="middle" font-weight="700">3D-тензор</text>
            <text x="752" y="335" class="mono" text-anchor="middle">(H × W × C)</text>

            <text x="480" y="500" class="small" text-anchor="middle">Вся картинка — сетка таких пикселей: высота × ширина × 3 канала</text>
          `
        },
        {
          title: "Шаг 4. Текст → вектор-эмбеддинг",
          subtitle: "Слово превращается в короткий вектор вещественных чисел",
          scene: `
            <rect class="box-blue" x="120" y="270" width="160" height="80"/>
            <text x="200" y="318" text-anchor="middle" font-size="24" font-weight="700" fill="#3576C0">«кот»</text>

            <line x1="296" y1="310" x2="418" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#tsArrow)"/>

            <rect class="box-green" x="435" y="270" width="445" height="80"/>
            <text x="657" y="318" class="mono" text-anchor="middle" font-weight="700" fill="#73B222">[0.21, -0.45, 0.78, …]</text>

            <text x="480" y="420" class="small" text-anchor="middle">Числа не задаются вручную — модель <tspan font-weight="700">выстраивает</tspan> их так,</text>
            <text x="480" y="446" class="small" text-anchor="middle">чтобы близкие по смыслу слова получали близкие векторы</text>
            <text x="480" y="510" class="small" text-anchor="middle">Вектор формы <tspan font-weight="700">(d,)</tspan> — обычно 50–1000 чисел</text>
          `
        },
        {
          title: "Шаг 5. Общий знаменатель — тензор чисел",
          subtitle: "Что бы ни было на входе, в коробку заходит один и тот же объект",
          scene: `
            <rect class="box-blue" x="60" y="180" width="190" height="56"/>
            <text x="80" y="215" class="lbl" font-weight="700">Таблица</text>
            <text x="230" y="215" class="mono" text-anchor="end" fill="#5E5850">(m,)</text>

            <rect class="box-blue" x="60" y="250" width="190" height="56"/>
            <text x="80" y="285" class="lbl" font-weight="700">Картинка</text>
            <text x="230" y="285" class="mono" text-anchor="end" fill="#5E5850">(H×W×C)</text>

            <rect class="box-blue" x="60" y="320" width="190" height="56"/>
            <text x="80" y="355" class="lbl" font-weight="700">Текст</text>
            <text x="230" y="355" class="mono" text-anchor="end" fill="#5E5850">(d,)</text>

            <rect class="box-blue" x="60" y="390" width="190" height="56"/>
            <text x="80" y="425" class="lbl" font-weight="700">Аудио</text>
            <text x="230" y="425" class="mono" text-anchor="end" fill="#5E5850">(t,)</text>

            <line x1="250" y1="208" x2="452" y2="300" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>
            <line x1="250" y1="278" x2="452" y2="305" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>
            <line x1="250" y1="348" x2="452" y2="315" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>
            <line x1="250" y1="418" x2="452" y2="320" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>

            <rect class="box-green" x="460" y="270" width="210" height="80"/>
            <text x="565" y="305" class="text" text-anchor="middle" font-weight="800" fill="#73B222">тензор</text>
            <text x="565" y="332" class="small" text-anchor="middle">просто числа</text>

            <line x1="676" y1="310" x2="742" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#tsArrow)"/>

            <rect class="box-dark" x="750" y="270" width="150" height="80"/>
            <text x="825" y="316" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>

            <text x="480" y="525" class="text" text-anchor="middle" font-weight="700">Любой вход — это тензор чисел фиксированной формы</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("title").textContent = step.title;
        $("subtitle").textContent = step.subtitle;
        $("counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("scene").innerHTML = step.scene;
        $("prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
      }

      function nextStep() {
        if (currentStep < steps.length - 1) currentStep++;
        else currentStep = 0;
        renderStep();
      }
      function prevStep() {
        if (currentStep > 0) currentStep--;
        renderStep();
      }

      $("nextBtn").addEventListener("click", nextStep);
      $("prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  ]]></script>
</svg>
  </div>
</figure>

## 4. Что внутри: коробка «что-то делает»

Здесь мы держим обещание и **не открываем коробку**. Скажем лишь самое необходимое:

внутри сидит функция `f` с настраиваемыми параметрами. Эти параметры **подбираются по данным** — это и есть обучение. После обучения коробка фиксируется: подаём ей вход `x` → получаем предсказание `ŷ = f(x)`.

Для нашего взгляда снаружи важно ровно одно: коробка **превращает вход определённой формы в выход определённого типа**. Каким именно образом — разберём в следующей статье на примере регрессии, где по шагам соберём весь пайплайн обучения.

## 5. Что на выходе: тип выхода определяет задачу

Теперь откроем вторую сторону коробки. И тут есть простое, но очень важное правило:

> **Сначала смотрим на выход.** Именно он диктует, какую модель брать, какую функцию потерь оптимизировать и какими метриками мерить качество.

### 5.1. Главный водораздел: дискретный или непрерывный выход

Все исходы можно разделить на два больших класса.

- **Дискретный выход** — конечный, «пересчитываемый» набор значений. Метафора: бросок кубика (только 1–6, значения 3.5 не бывает). Если выход — это **одна метка из заранее известного списка**, то задача называется **классификацией**. Примеры: письмо → спам / не спам; фото → цифра 0–9; лицо → «это Алиса».
- **Непрерывный выход** — значение из бесконечного диапазона, которое можно сколь угодно дробить. Метафора: рост человека (172.4 см, а между 172 и 173 — бесконечно много значений). Если выход — это **произвольное число**, задача называется **регрессией**. Примеры: дом → цена; погода → температура; фото → возраст.
<figure class="embedded-interactive" id="section-interactive-7">
  <div class="interactive-meta">Интерактив 7</div>
  <p class="interactive-desc">Дискретный выход — классификация, непрерывный выход — регрессия</p>
  <div class="interactive-svg-wrap">
<svg id="mlOutputTypes" viewBox="0 0 960 680" width="100%" role="img" aria-label="Дискретные и непрерывные выходы ML-модели">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .lbl { font-size: 15px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F6F5F3; stroke: #5E5850; stroke-width: 1.3; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>
  <defs>
    <marker id="mlArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
  </defs>

<text id="title" x="36" y="48" class="title"></text>
<text id="subtitle" x="36" y="78" class="subtitle"></text>
<g id="scene"></g>
<text id="counter" x="36" y="635" class="text"></text>
  <g id="prevGroup">
    <rect id="prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="nextGroup">
    <rect id="nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      const steps = [
        {
          title: "Шаг 1. Что вообще на выходе модели?",
          subtitle: "Модель берёт вход и возвращает выход — вопрос в том, какие значения он может принимать",
          scene: `
            <rect class="box-blue" x="60" y="250" width="200" height="120"/>
            <text x="160" y="298" class="text" text-anchor="middle" font-weight="700">Вход</text>
            <text x="160" y="326" class="small" text-anchor="middle">фото, текст, числа…</text>

            <line x1="266" y1="310" x2="372" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>

            <rect class="box-yellow" x="380" y="250" width="200" height="120"/>
            <text x="480" y="298" class="text" text-anchor="middle" font-weight="700">Модель ML</text>
            <text x="480" y="326" class="small" text-anchor="middle">обученная функция</text>

            <line x1="586" y1="310" x2="692" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>

            <rect class="box-green" x="700" y="250" width="200" height="120"/>
            <text x="800" y="328" text-anchor="middle" font-size="56" font-weight="800" fill="#73B222">?</text>

            <text x="480" y="450" class="text" text-anchor="middle" font-weight="700">Главный вопрос: какие значения может принимать выход?</text>
            <text x="480" y="480" class="small" text-anchor="middle">Ответ делит все задачи на два больших класса</text>
          `
        },
        {
          title: "Шаг 2. Дискретные значения — стороны кубика",
          subtitle: "У кубика есть только 6 сторон: 1, 2, 3, 4, 5 или 6. Другого исхода быть не может",
          scene: `
            <text x="140" y="165" class="lbl">Возможные исходы броска шестигранного кубика:</text>

            <g>
              <rect x="220" y="205" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
              <circle cx="287.5" cy="250" r="10" fill="#111111"/>
              <text x="287.5" y="322" class="small" text-anchor="middle" font-weight="700">сторона 1</text>

              <rect x="412" y="205" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
              <circle cx="442" cy="267" r="10" fill="#111111"/>
              <circle cx="517" cy="223" r="10" fill="#111111"/>
              <text x="479.5" y="322" class="small" text-anchor="middle" font-weight="700">сторона 2</text>

              <rect x="604" y="205" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
              <circle cx="634" cy="272" r="10" fill="#111111"/>
              <circle cx="671.5" cy="250" r="10" fill="#111111"/>
              <circle cx="709" cy="228" r="10" fill="#111111"/>
              <text x="671.5" y="322" class="small" text-anchor="middle" font-weight="700">сторона 3</text>

              <rect x="220" y="350" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
              <circle cx="250" cy="372" r="10" fill="#111111"/>
              <circle cx="325" cy="372" r="10" fill="#111111"/>
              <circle cx="250" cy="418" r="10" fill="#111111"/>
              <circle cx="325" cy="418" r="10" fill="#111111"/>
              <text x="287.5" y="467" class="small" text-anchor="middle" font-weight="700">сторона 4</text>

              <rect x="412" y="350" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
              <circle cx="442" cy="372" r="10" fill="#111111"/>
              <circle cx="517" cy="372" r="10" fill="#111111"/>
              <circle cx="479.5" cy="395" r="10" fill="#111111"/>
              <circle cx="442" cy="418" r="10" fill="#111111"/>
              <circle cx="517" cy="418" r="10" fill="#111111"/>
              <text x="479.5" y="467" class="small" text-anchor="middle" font-weight="700">сторона 5</text>

              <rect x="604" y="350" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
              <circle cx="634" cy="372" r="10" fill="#111111"/>
              <circle cx="709" cy="372" r="10" fill="#111111"/>
              <circle cx="634" cy="395" r="10" fill="#111111"/>
              <circle cx="709" cy="395" r="10" fill="#111111"/>
              <circle cx="634" cy="418" r="10" fill="#111111"/>
              <circle cx="709" cy="418" r="10" fill="#111111"/>
              <text x="671.5" y="467" class="small" text-anchor="middle" font-weight="700">сторона 6</text>
            </g>

            <rect class="box-red" x="330" y="492" width="300" height="70"/>
            <text x="480" y="522" text-anchor="middle" font-size="17" font-weight="800" fill="#C30B0A">3.5 — невозможно</text>
            <text x="480" y="545" text-anchor="middle" class="small" fill="#C30B0A">на кубике нет стороны «три с половиной»</text>

            <text x="480" y="585" class="small" text-anchor="middle">Можно пересчитать все варианты: закрытый список из 6 исходов — <tspan fill="#3576C0" font-weight="700">дискретные значения</tspan></text>
          `
        },
        {
          title: "Шаг 3. Непрерывные значения — рост человека",
          subtitle: "Рост можно описать в сантиметрах, миллиметрах и ещё точнее — шкала не заканчивается отдельными точками",
          scene: `
            <text x="110" y="160" class="lbl">Возможный рост человека (см):</text>

            <rect x="115" y="240" width="730" height="28" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5" rx="6"/>

            <g stroke="#73B222" stroke-width="2">
              <line x1="115" y1="268" x2="115" y2="288"/><line x1="261" y1="268" x2="261" y2="288"/>
              <line x1="407" y1="268" x2="407" y2="288"/><line x1="553" y1="268" x2="553" y2="288"/>
              <line x1="699" y1="268" x2="699" y2="288"/><line x1="845" y1="268" x2="845" y2="288"/>
            </g>
            <g class="small" text-anchor="middle">
              <text x="115" y="310">150 см</text><text x="261" y="310">160 см</text>
              <text x="407" y="310">170 см</text><text x="553" y="310">180 см</text>
              <text x="699" y="310">190 см</text><text x="845" y="310">200 см</text>
            </g>

            <polygon points="443,207 432,229 454,229" fill="#C30B0A"/>
            <line x1="443" y1="229" x2="443" y2="268" stroke="#C30B0A" stroke-width="2.5"/>
            <text x="443" y="190" text-anchor="middle" font-size="18" font-weight="800" fill="#C30B0A">172.43856… см</text>

            <text x="480" y="360" class="lbl" text-anchor="middle" font-weight="700">Увеличим маленький участок между 172 и 173 см</text>
            <line x1="360" y1="384" x2="600" y2="384" stroke="#5E5850" stroke-width="1.6" stroke-dasharray="5 5"/>
            <line x1="443" y1="268" x2="360" y2="384" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="5 5"/>
            <line x1="458" y1="268" x2="600" y2="384" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="5 5"/>

            <rect x="300" y="405" width="360" height="24" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5" rx="6"/>
            <g stroke="#73B222" stroke-width="1.6">
              <line x1="300" y1="429" x2="300" y2="448"/>
              <line x1="336" y1="429" x2="336" y2="440"/>
              <line x1="372" y1="429" x2="372" y2="440"/>
              <line x1="408" y1="429" x2="408" y2="440"/>
              <line x1="444" y1="429" x2="444" y2="440"/>
              <line x1="480" y1="429" x2="480" y2="448"/>
              <line x1="516" y1="429" x2="516" y2="440"/>
              <line x1="552" y1="429" x2="552" y2="440"/>
              <line x1="588" y1="429" x2="588" y2="440"/>
              <line x1="624" y1="429" x2="624" y2="440"/>
              <line x1="660" y1="429" x2="660" y2="448"/>
            </g>
            <g class="small" text-anchor="middle">
              <text x="300" y="470">172.0 см</text>
              <text x="480" y="470">172.5 см</text>
              <text x="660" y="470">173.0 см</text>
              <text x="300" y="492">1720 мм</text>
              <text x="480" y="492">1725 мм</text>
              <text x="660" y="492">1730 мм</text>
            </g>

            <polygon points="458,382 450,398 466,398" fill="#C30B0A"/>
            <line x1="458" y1="398" x2="458" y2="429" stroke="#C30B0A" stroke-width="2"/>
            <text x="458" y="525" text-anchor="middle" font-size="15" font-weight="800" fill="#C30B0A">172.43856 см = 1724.3856 мм</text>

            <text x="480" y="560" class="small" text-anchor="middle">Можно записать грубо: 172 см, точнее: 1724 мм, ещё точнее: 172.43856 см.</text>
            <text x="480" y="584" class="small" text-anchor="middle">Между 172 и 173 см есть миллиметры и ещё более мелкие значения — <tspan fill="#73B222" font-weight="700">непрерывные</tspan></text>
          `
        },
        {
          title: "Шаг 4. Дискретный выход — классификация",
          subtitle: "Модель выбирает один вариант из конечного списка классов",
          scene: `
            <rect class="box-yellow" x="90" y="280" width="170" height="100"/>
            <text x="175" y="325" class="text" text-anchor="middle" font-weight="700">Модель</text>
            <text x="175" y="350" class="small" text-anchor="middle">вход → класс</text>

            <line x1="266" y1="330" x2="382" y2="330" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>

            <rect class="box-blue" x="430" y="240" width="280" height="50"/>
            <text x="455" y="271" class="text">кошка</text>

            <rect class="box-green" x="430" y="305" width="280" height="50"/>
            <text x="455" y="336" class="text" font-weight="700" fill="#73B222">собака  ←</text>

            <rect class="box-blue" x="430" y="370" width="280" height="50"/>
            <text x="455" y="401" class="text">птица</text>

            <text x="500" y="500" class="small" text-anchor="middle">Выход — одна из заранее известных меток. Это и есть <tspan fill="#3576C0" font-weight="700">классификация</tspan></text>
          `
        },
        {
          title: "Шаг 5. Непрерывный выход — регрессия",
          subtitle: "Модель предсказывает число на непрерывной шкале",
          scene: `
            <line x1="200" y1="470" x2="840" y2="470" stroke="#5E5850" stroke-width="2"/>
            <line x1="200" y1="470" x2="200" y2="180" stroke="#5E5850" stroke-width="2"/>
            <text x="520" y="510" class="small" text-anchor="middle">площадь дома, м²</text>
            <text x="150" y="330" class="small" text-anchor="middle" transform="rotate(-90 150 330)">цена, $</text>

            <line x1="220" y1="440" x2="820" y2="220" stroke="#C29E08" stroke-width="3"/>

            <g fill="#3576C0">
              <circle cx="270" cy="410" r="7"/><circle cx="360" cy="390" r="7"/>
              <circle cx="440" cy="350" r="7"/><circle cx="540" cy="330" r="7"/>
              <circle cx="640" cy="290" r="7"/><circle cx="740" cy="250" r="7"/>
            </g>

            <circle cx="600" cy="306" r="9" fill="#73B222"/>
            <line x1="600" y1="306" x2="600" y2="470" stroke="#73B222" stroke-width="1.5" stroke-dasharray="4 4"/>
            <text x="612" y="300" font-size="15" font-weight="700" fill="#73B222">$215 000</text>

            <text x="500" y="555" class="small" text-anchor="middle">Выход — произвольное число (упрощённый фрагмент Ames Housing). Это <tspan fill="#73B222" font-weight="700">регрессия</tspan></text>
          `
        },
        {
          title: "Шаг 6. Примеры классификации (дискретный выход)",
          subtitle: "Везде ответ — одна метка из конечного набора",
          scene: `
            ${[
              ["Распознавание лица","«это Алиса» — один из N людей"],
              ["Генерация токена","следующее слово из словаря"],
              ["Письмо","спам / не спам"],
              ["Картинка MNIST","цифра 0–9"]
            ].map((r,i)=>{
              const y = 170 + i*88;
              return `
                <rect class="box-gray" x="80" y="${y}" width="300" height="62"/>
                <text x="100" y="${y+38}" class="lbl">${r[0]}</text>
                <line x1="388" y1="${y+31}" x2="470" y2="${y+31}" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
                <rect class="box-blue" x="478" y="${y}" width="400" height="62"/>
                <text x="498" y="${y+38}" class="lbl" fill="#3576C0" font-weight="700">${r[1]}</text>
              `;
            }).join("")}
            <text x="480" y="558" class="small" text-anchor="middle">Внутри модель считает вероятности, но итог — один дискретный класс</text>
          `
        },
        {
          title: "Шаг 7. Примеры регрессии (непрерывный выход)",
          subtitle: "Везде ответ — число на непрерывной шкале",
          scene: `
            ${[
              ["Дом (Ames Housing)","цена: $215 000"],
              ["Погода на завтра","температура: 23.7 °C"],
              ["Фото человека","возраст: 31.4 года"],
              ["Замер пациента","рост: 172.4 см"]
            ].map((r,i)=>{
              const y = 170 + i*88;
              return `
                <rect class="box-gray" x="80" y="${y}" width="300" height="62"/>
                <text x="100" y="${y+38}" class="lbl">${r[0]}</text>
                <line x1="388" y1="${y+31}" x2="470" y2="${y+31}" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
                <rect class="box-green" x="478" y="${y}" width="400" height="62"/>
                <text x="498" y="${y+38}" class="lbl" fill="#73B222" font-weight="700">${r[1]}</text>
              `;
            }).join("")}
            <text x="480" y="558" class="small" text-anchor="middle">Выход можно бесконечно дробить — это число, а не метка</text>
          `
        },
        {
          title: "Шаг 8. Итог: тип выхода определяет тип задачи",
          subtitle: "Дискретно — классификация, непрерывно — регрессия",
          scene: `
            <rect class="box-blue" x="70" y="150" width="380" height="360"/>
            <text x="260" y="195" class="text" text-anchor="middle" font-weight="800" fill="#3576C0">Дискретный выход</text>
            <text x="260" y="222" class="lbl" text-anchor="middle" font-weight="700">→ классификация</text>
            <g class="small" fill="#111111">
              <text x="100" y="268">• конечный набор значений</text>
              <text x="100" y="298">• метафора: кубик 1–6</text>
              <text x="100" y="328">• лицо → «это Алиса»</text>
              <text x="100" y="358">• токен → следующее слово</text>
              <text x="100" y="388">• письмо → спам / не спам</text>
              <text x="100" y="418">• картинка → цифра 0–9</text>
            </g>

            <rect class="box-green" x="510" y="150" width="380" height="360"/>
            <text x="700" y="195" class="text" text-anchor="middle" font-weight="800" fill="#73B222">Непрерывный выход</text>
            <text x="700" y="222" class="lbl" text-anchor="middle" font-weight="700">→ регрессия</text>
            <g class="small" fill="#111111">
              <text x="540" y="268">• бесконечный диапазон</text>
              <text x="540" y="298">• метафора: рост человека</text>
              <text x="540" y="328">• дом → цена $215 000</text>
              <text x="540" y="358">• погода → 23.7 °C</text>
              <text x="540" y="388">• фото → возраст 31.4 года</text>
              <text x="540" y="418">• замер → рост 172.4 см</text>
            </g>

            <text x="480" y="555" class="text" text-anchor="middle" font-weight="700">Сначала смотрим на выход — он диктует выбор модели и метрики</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("title").textContent = step.title;
        $("subtitle").textContent = step.subtitle;
        $("counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("scene").innerHTML = step.scene;
        $("prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
      }

      function nextStep() {
        if (currentStep < steps.length - 1) currentStep++;
        else currentStep = 0;
        renderStep();
      }
      function prevStep() {
        if (currentStep > 0) currentStep--;
        renderStep();
      }

      $("nextBtn").addEventListener("click", nextStep);
      $("prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  ]]></script>
</svg>
  </div>
</figure>

### 5.2. На самом деле выходов больше, чем «число или метка»

Деление на регрессию и классификацию — это фундамент, но реальные модели выдают и более богатые выходы. Полезно знать весь «зоопарк», чтобы понимать, что коробка может отдавать почти что угодно:

- **Одно число** (скалярная регрессия) — цена, температура.
- **Одна метка из K классов** (классификация) — кошка/собака/птица.
- **Несколько меток сразу** (multi-label) — у фото могут быть теги «пляж», «закат», «люди».
- **Вероятности / распределение** — не просто «кошка», а «кошка 0.8, собака 0.15, …».
- **Последовательность** — перевод, генерация текста: на выходе цепочка токенов.
- **Структурированный выход** — рамки объектов на фото (детекция), маска по пикселям (сегментация), или даже **целая картинка** (генеративные модели).
- **Вектор-эмбеддинг** — иногда нужен сам по себе (поиск похожих, рекомендации).

Большинство из этих случаев под капотом сводится к тем же двум базовым кирпичикам («предскажи число» и «предскажи класс»), просто применённым много раз или к структуре. Но на уровне постановки задачи их полезно различать.
<figure class="embedded-interactive" id="section-interactive-8">
  <div class="interactive-meta">Интерактив 8</div>
  <p class="interactive-desc">Зоопарк выходов модели: число, метка, набор меток, распределение, последовательность, структура</p>
  <div class="interactive-svg-wrap">
<svg id="mlOutputZoo" viewBox="0 0 960 680" width="100%" role="img" aria-label="Разные типы выхода модели">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .lbl { font-size: 15px; fill: #111111; }
    .mono { font-size: 15px; fill: #111111; font-family: "Courier New", monospace; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F6F5F3; stroke: #5E5850; stroke-width: 1.3; rx: 14; }
    .box-dark   { fill: #1b1d26; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>
  <defs>
    <marker id="ozArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
  </defs>

<text id="title" x="36" y="48" class="title"></text>
<text id="subtitle" x="36" y="78" class="subtitle"></text>
<g id="scene"></g>
<text id="counter" x="36" y="635" class="text"></text>
  <g id="prevGroup">
    <rect id="prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="nextGroup">
    <rect id="nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      const modelBox = (x, y) => `
        <rect class="box-dark" x="${x}" y="${y}" width="180" height="110"/>
        <text x="${x+90}" y="${y+58}" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>
        <text x="${x+90}" y="${y+84}" text-anchor="middle" font-size="12" fill="#9a9aa4">f( вход )</text>
      `;

      const steps = [
        {
          title: "Шаг 1. Выход — не только «число или метка»",
          subtitle: "Базовое деление — регрессия и классификация. Но коробка умеет больше",
          scene: `
            ${modelBox(120, 270)}
            <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>
            <rect class="box-gray" x="460" y="270" width="320" height="110"/>
            <text x="620" y="335" text-anchor="middle" font-size="40" font-weight="800" fill="#5E5850">?</text>

            <text x="480" y="460" class="text" text-anchor="middle" font-weight="700">Дальше — «зоопарк» выходов, которые встречаются на практике</text>
            <text x="480" y="492" class="small" text-anchor="middle">от одного числа до целой картинки</text>
          `
        },
        {
          title: "Шаг 2. Одно число — регрессия",
          subtitle: "Самый простой выход: единственное значение на непрерывной шкале",
          scene: `
            ${modelBox(120, 270)}
            <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>
            <rect class="box-green" x="460" y="270" width="360" height="110"/>
            <text x="640" y="320" text-anchor="middle" font-size="32" font-weight="800" fill="#73B222">23.7 °C</text>
            <text x="640" y="352" class="small" text-anchor="middle">температура на завтра</text>

            <text x="480" y="470" class="small" text-anchor="middle">Также: цена дома, возраст по фото, длительность поездки</text>
          `
        },
        {
          title: "Шаг 3. Одна метка — классификация",
          subtitle: "Выход — один класс из конечного, заранее заданного списка",
          scene: `
            ${modelBox(120, 270)}
            <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>
            <rect class="box-blue"  x="460" y="250" width="320" height="46"/>
            <text x="486" y="279" class="text">спам</text>
            <rect class="box-green" x="460" y="304" width="320" height="46"/>
            <text x="486" y="333" class="text" font-weight="700" fill="#73B222">не спам  ←</text>

            <text x="480" y="470" class="small" text-anchor="middle">Также: кошка/собака/птица, цифра 0–9, «это Алиса»</text>
          `
        },
        {
          title: "Шаг 4. Несколько меток сразу — multi-label",
          subtitle: "У одного объекта может быть несколько верных меток одновременно",
          scene: `
            ${modelBox(120, 270)}
            <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>

            <rect class="box-green" x="460" y="240" width="150" height="46"/>
            <text x="486" y="269" class="text" font-weight="700" fill="#73B222">пляж  ←</text>
            <rect class="box-green" x="460" y="296" width="150" height="46"/>
            <text x="486" y="325" class="text" font-weight="700" fill="#73B222">закат  ←</text>
            <rect class="box-blue"  x="460" y="352" width="150" height="46"/>
            <text x="486" y="381" class="text">снег</text>

            <rect class="box-green" x="630" y="240" width="150" height="46"/>
            <text x="656" y="269" class="text" font-weight="700" fill="#73B222">люди  ←</text>
            <rect class="box-blue"  x="630" y="296" width="150" height="46"/>
            <text x="656" y="325" class="text">город</text>
            <rect class="box-blue"  x="630" y="352" width="150" height="46"/>
            <text x="656" y="381" class="text">ночь</text>

            <text x="480" y="470" class="small" text-anchor="middle">Теги фотографии: помечаем все подходящие, а не одну метку</text>
          `
        },
        {
          title: "Шаг 5. Распределение вероятностей",
          subtitle: "Часто модель отдаёт не один ответ, а уверенность по каждому варианту",
          scene: `
            ${modelBox(120, 270)}
            <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>

            <g>
              <text x="470" y="262" class="lbl">кошка</text>
              <rect x="560" y="248" width="256" height="22" fill="#73B222"/>
              <text x="828" y="265" class="small" font-weight="700" fill="#73B222">0.80</text>

              <text x="470" y="310" class="lbl">собака</text>
              <rect x="560" y="296" width="48" height="22" fill="#3576C0"/>
              <text x="620" y="313" class="small" fill="#3576C0">0.15</text>

              <text x="470" y="358" class="lbl">птица</text>
              <rect x="560" y="344" width="16" height="22" fill="#3576C0"/>
              <text x="588" y="361" class="small" fill="#3576C0">0.05</text>
            </g>

            <text x="480" y="470" class="small" text-anchor="middle">Сумма = 1. Если нужен один класс — берём максимум (кошка)</text>
          `
        },
        {
          title: "Шаг 6. Последовательность — генерация и перевод",
          subtitle: "Выход — это цепочка токенов, выдаваемая шаг за шагом",
          scene: `
            <rect class="box-blue" x="80" y="290" width="200" height="70"/>
            <text x="180" y="332" text-anchor="middle" font-size="18" font-weight="700" fill="#3576C0">«I love cats»</text>

            <line x1="296" y1="325" x2="372" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>
            ${modelBox(380, 270)}
            <line x1="566" y1="325" x2="604" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>

            <g>
              <rect class="box-green" x="610" y="250" width="90" height="46"/>
              <text x="655" y="279" text-anchor="middle" class="text" fill="#73B222">Я</text>
              <rect class="box-green" x="708" y="250" width="120" height="46"/>
              <text x="768" y="279" text-anchor="middle" class="text" fill="#73B222">люблю</text>
              <rect class="box-green" x="610" y="306" width="120" height="46"/>
              <text x="670" y="335" text-anchor="middle" class="text" fill="#73B222">котов</text>
            </g>

            <text x="480" y="470" class="small" text-anchor="middle">Перевод, ответ чат-бота, описание картинки — выход переменной длины</text>
          `
        },
        {
          title: "Шаг 7. Структурный выход — рамки, маски, картинки",
          subtitle: "Выход может иметь форму: координаты объекта, маска по пикселям, целое изображение",
          scene: `
            ${modelBox(90, 280)}
            <line x1="276" y1="335" x2="352" y2="335" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>

            <rect x="370" y="250" width="170" height="170" class="box-gray"/>
            <rect x="410" y="300" width="90" height="80" fill="none" stroke="#C30B0A" stroke-width="3"/>
            <rect x="408" y="284" width="86" height="18" fill="#C30B0A"/>
            <text x="451" y="297" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">кошка 0.97</text>
            <text x="455" y="440" class="small" text-anchor="middle">детекция (рамка)</text>

            <rect x="600" y="250" width="170" height="170" class="box-gray"/>
            <path d="M650 380 q10 -70 55 -75 q40 0 35 75 z" fill="#73B222" opacity="0.55"/>
            <text x="685" y="440" class="small" text-anchor="middle">сегментация (маска)</text>

            <text x="480" y="500" class="small" text-anchor="middle">Сюда же — генерация изображений: на выходе целый тензор-картинка</text>
          `
        },
        {
          title: "Шаг 8. Итог: коробка отдаёт почти что угодно",
          subtitle: "Но почти всё сводится к двум кирпичикам: «предскажи число» и «предскажи класс»",
          scene: `
            <rect class="box-blue" x="70" y="150" width="380" height="360"/>
            <text x="260" y="195" class="text" text-anchor="middle" font-weight="800" fill="#3576C0">Два базовых кирпичика</text>
            <g class="small" fill="#111111">
              <text x="100" y="250">• число → регрессия</text>
              <text x="100" y="288">• класс → классификация</text>
            </g>
            <text x="260" y="350" class="lbl" text-anchor="middle" font-weight="700">из них собирают</text>
            <text x="260" y="382" class="small" text-anchor="middle">сложные выходы ниже →</text>

            <rect class="box-green" x="510" y="150" width="380" height="360"/>
            <text x="700" y="195" class="text" text-anchor="middle" font-weight="800" fill="#73B222">Богатые выходы</text>
            <g class="small" fill="#111111">
              <text x="540" y="245">• набор меток (multi-label)</text>
              <text x="540" y="283">• распределение вероятностей</text>
              <text x="540" y="321">• последовательность токенов</text>
              <text x="540" y="359">• рамки и маски объектов</text>
              <text x="540" y="397">• целое изображение</text>
              <text x="540" y="435">• вектор-эмбеддинг</text>
            </g>

            <text x="480" y="555" class="text" text-anchor="middle" font-weight="700">Тип выхода определяет последний слой, функцию потерь и метрику</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("title").textContent = step.title;
        $("subtitle").textContent = step.subtitle;
        $("counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("scene").innerHTML = step.scene;
        $("prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
      }

      function nextStep() {
        if (currentStep < steps.length - 1) currentStep++;
        else currentStep = 0;
        renderStep();
      }
      function prevStep() {
        if (currentStep > 0) currentStep--;
        renderStep();
      }

      $("nextBtn").addEventListener("click", nextStep);
      $("prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  ]]></script>
</svg>
  </div>
</figure>

## 6. Главный вывод: модель выбирают по входу и выходу

Сложим обе стороны коробки вместе. Получается простое правило, которое и будет мостом к следующей статье:

> **Форма входа** подсказывает **семейство модели**, а **тип выхода** определяет **последний слой, функцию потерь и метрику**.

Грубая, но рабочая шпаргалка:

| Что на входе | Типичное семейство моделей |
| --- | --- |
| Таблица | линейные модели, деревья / градиентный бустинг, MLP |
| Изображение | свёрточные сети (CNN), визуальные трансформеры (ViT) |
| Текст | трансформеры |

| Что на выходе | Что меняется в модели |
| --- | --- |
| Число (регрессия) | один выход без активации, потери типа MSE |
| Класс (классификация) | softmax на K классов, кросс-энтропия |

Поэтому правильный порядок мыслей в любой ML-задаче такой: **сначала зафиксировать вход и выход коробки — и только потом выбирать, что положить внутрь.**

В следующей статье мы наконец **откроем коробку** и на примере **регрессии** соберём весь пайплайн обучения по шагам: данные → модель → как она учится → как проверяем качество. Там станет видно, что «магия» внутри коробки — это вполне понятный последовательный процесс.
