Каждый день мы пользуемся компьютерами, смартфонами и тысячами устройств, внутри которых работают чипы. Мы знаем, как открыть браузер, как написать программу, как сохранить файл. Но что на самом деле происходит, когда вы нажимаете «Enter»?

Эта статья — попытка пройти всю цепочку сверху донизу. От ЭВМ — к транзистору. От Python — к электронам, бегущим по проводам. Без формул, без хитрого жаргона, с одним только желанием понять, как же оно работает.

Поехали — снизу вверх.

---

## Часть 1. Что такое компьютер

Начнём с самого простого вопроса: а что вообще такое компьютер?

«Компьютер» — это английское слово. По-русски то же самое называется «ЭВМ». Это не два разных устройства, а одно и то же, только с разными именами. Сейчас разберём каждую букву в этой аббревиатуре — и сразу станет понятно, что компьютер из себя представляет.

<figure class="embedded-interactive" id="section-viz-evm">
  <div class="interactive-meta">Интерактив 1</div>
  <h3>Компьютер = ЭВМ: расшифровываем по буквам</h3>
  <p class="interactive-desc">6 шагов: расшифровка ЭВМ — Электронная Вычислительная Машина, разбор каждой буквы</p>
  <div class="interactive-svg-wrap">
<svg id="viz-evm" viewBox="0 0 960 680" width="100%" role="img" aria-label="Что такое ЭВМ">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .big-letter { font-size: 56px; font-weight: 800; fill: #C29E08; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                          text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                    text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="ev-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text id="ev-title" x="36" y="48" class="title"></text>
  <text id="ev-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="ev-scene"></g>

  <text id="ev-counter" x="36" y="635" class="text"></text>

  <g id="ev-prevGroup">
    <rect id="ev-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="ev-nextGroup">
    <rect id="ev-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="ev-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-evm");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Два названия — одно устройство",
          subtitle: "«Компьютер» по-английски и «ЭВМ» по-русски означают одно и то же",
          scene: `
            <rect x="80" y="220" width="360" height="180" class="box-blue"/>
            <text x="260" y="280" text-anchor="middle" class="text" font-size="28" font-weight="800" fill="#3576C0">Компьютер</text>
            <text x="260" y="320" text-anchor="middle" class="small">от англ. computer</text>
            <text x="260" y="345" text-anchor="middle" class="small">от лат. computare</text>
            <text x="260" y="375" text-anchor="middle" class="text" font-style="italic">«считать, вычислять»</text>

            <text x="480" y="320" text-anchor="middle" font-size="48" font-weight="800" fill="#73B222">=</text>

            <rect x="520" y="220" width="360" height="180" class="box-yellow"/>
            <text x="700" y="280" text-anchor="middle" class="text" font-size="28" font-weight="800" fill="#C29E08">ЭВМ</text>
            <text x="700" y="320" text-anchor="middle" class="small">по-русски — аббревиатура из</text>
            <text x="700" y="345" text-anchor="middle" class="small">трёх слов</text>
            <text x="700" y="375" text-anchor="middle" class="text" font-style="italic">сейчас узнаем каких</text>

            <text x="480" y="475" text-anchor="middle" class="text">Изначально компьютером называли человека-вычислителя</text>
            <text x="480" y="500" text-anchor="middle" class="small">«computer» — это тот, кто считает; работа такая была в XVIII веке</text>
          `
        },
        {
          title: "Шаг 2. Расшифровка по буквам",
          subtitle: "Каждая буква ЭВМ означает важное свойство устройства",
          scene: `
            <text x="120" y="230" class="big-letter">Э</text>
            <text x="180" y="195" class="text" font-size="22" font-weight="700">Электронная</text>
            <text x="180" y="225" class="small">работает на движении электронов,</text>
            <text x="180" y="247" class="small">а не на шестерёнках или паре</text>

            <line x1="100" y1="265" x2="900" y2="265" stroke="#e0e0e0" stroke-width="1"/>

            <text x="120" y="345" class="big-letter">В</text>
            <text x="180" y="310" class="text" font-size="22" font-weight="700">Вычислительная</text>
            <text x="180" y="340" class="small">умеет считать — от простой</text>
            <text x="180" y="362" class="small">арифметики до сложных алгоритмов</text>

            <line x1="100" y1="385" x2="900" y2="385" stroke="#e0e0e0" stroke-width="1"/>

            <text x="120" y="465" class="big-letter">М</text>
            <text x="180" y="430" class="text" font-size="22" font-weight="700">Машина</text>
            <text x="180" y="460" class="small">устройство, которое делает работу</text>
            <text x="180" y="482" class="small">само, без участия человека</text>

            <text x="480" y="565" text-anchor="middle" class="text">Дальше разберём каждое слово отдельно</text>
          `
        },
        {
          title: "Шаг 3. Э — Электронная",
          subtitle: "Все операции внутри компьютера происходят благодаря движению электронов",
          scene: `
            <text x="100" y="180" class="big-letter">Э</text>
            <text x="180" y="170" class="text" font-size="20" font-weight="700">Электронная</text>

            <rect x="80" y="230" width="380" height="280" class="box-gray"/>
            <text x="270" y="265" text-anchor="middle" class="text" font-weight="700" fill="#5E5850">До электроники</text>

            <rect x="120" y="290" width="300" height="50" fill="#ffffff" stroke="#5E5850" stroke-width="1" rx="6"/>
            <text x="270" y="320" text-anchor="middle" class="small">Абак — деревянные шарики</text>

            <rect x="120" y="350" width="300" height="50" fill="#ffffff" stroke="#5E5850" stroke-width="1" rx="6"/>
            <text x="270" y="380" text-anchor="middle" class="small">Арифмометр — шестерёнки</text>

            <rect x="120" y="410" width="300" height="50" fill="#ffffff" stroke="#5E5850" stroke-width="1" rx="6"/>
            <text x="270" y="440" text-anchor="middle" class="small">Машина Бэббиджа — пар и металл</text>

            <text x="270" y="490" text-anchor="middle" class="small">медленно, шумно, ломается</text>

            <rect x="500" y="230" width="380" height="280" class="box-yellow"/>
            <text x="690" y="265" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Электронная вычислительная машина</text>

            <rect x="540" y="290" width="300" height="50" fill="#FFFBEB" stroke="#C29E08" stroke-width="1" rx="6"/>
            <text x="690" y="320" text-anchor="middle" class="small">движение электронов = ток</text>

            <rect x="540" y="350" width="300" height="50" fill="#FFFBEB" stroke="#C29E08" stroke-width="1" rx="6"/>
            <text x="690" y="380" text-anchor="middle" class="small">нет движущихся деталей внутри чипа</text>

            <rect x="540" y="410" width="300" height="50" fill="#FFFBEB" stroke="#C29E08" stroke-width="1" rx="6"/>
            <text x="690" y="440" text-anchor="middle" class="small">скорость света → миллиарды операций/сек</text>

            <text x="690" y="490" text-anchor="middle" class="small">быстро, бесшумно, надёжно</text>

            <text x="480" y="580" text-anchor="middle" class="text">«Электронная» = считает с помощью электрического тока, а не механики</text>
          `
        },
        {
          title: "Шаг 4. В — Вычислительная",
          subtitle: "Любое действие компьютера сводится к вычислениям над числами",
          scene: `
            <text x="100" y="180" class="big-letter">В</text>
            <text x="180" y="170" class="text" font-size="20" font-weight="700">Вычислительная</text>

            <text x="480" y="230" text-anchor="middle" class="text" font-weight="700">Всё в компьютере — это числа</text>

            <rect x="60" y="270" width="280" height="220" class="box-green"/>
            <text x="200" y="305" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Что вы видите</text>
            <text x="200" y="345" text-anchor="middle" class="small">фото с котиком</text>
            <text x="200" y="375" text-anchor="middle" class="small">видео из тиктока</text>
            <text x="200" y="405" text-anchor="middle" class="small">текст этой презентации</text>
            <text x="200" y="435" text-anchor="middle" class="small">музыка</text>
            <text x="200" y="465" text-anchor="middle" class="small">игра</text>

            <text x="480" y="385" text-anchor="middle" font-size="36" font-weight="800" fill="#5E5850">→</text>

            <rect x="620" y="270" width="280" height="220" class="box-yellow"/>
            <text x="760" y="305" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Что считает CPU</text>
            <text x="760" y="345" text-anchor="middle" class="mono">10110000 01100001</text>
            <text x="760" y="375" text-anchor="middle" class="mono">11010010 00010100</text>
            <text x="760" y="405" text-anchor="middle" class="mono">01010111 11000011</text>
            <text x="760" y="435" text-anchor="middle" class="mono">00101101 10010101</text>
            <text x="760" y="465" text-anchor="middle" class="mono">…</text>

            <text x="480" y="555" text-anchor="middle" class="small">«Показать фото» = вычислить цвет каждого пикселя</text>
            <text x="480" y="580" text-anchor="middle" class="small">«Воспроизвести музыку» = вычислить громкость в каждый момент времени</text>
          `
        },
        {
          title: "Шаг 5. М — Машина",
          subtitle: "Устройство, которое выполняет работу самостоятельно по заданной программе",
          scene: `
            <text x="100" y="180" class="big-letter">М</text>
            <text x="180" y="170" class="text" font-size="20" font-weight="700">Машина</text>

            <text x="480" y="230" text-anchor="middle" class="text" font-weight="700">Машина = действует без человека по заданной программе</text>

            <rect x="60" y="280" width="260" height="220" class="box-blue"/>
            <text x="190" y="320" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Стиральная машина</text>
            <text x="190" y="360" text-anchor="middle" class="small">программа:</text>
            <text x="190" y="385" text-anchor="middle" class="small">«стирка хлопка 60°»</text>
            <text x="190" y="425" text-anchor="middle" class="small">→ запустил и ушёл</text>
            <text x="190" y="465" text-anchor="middle" class="small">сама знает что делать</text>

            <rect x="340" y="280" width="260" height="220" class="box-blue"/>
            <text x="470" y="320" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Кофе-машина</text>
            <text x="470" y="360" text-anchor="middle" class="small">программа:</text>
            <text x="470" y="385" text-anchor="middle" class="small">«капучино»</text>
            <text x="470" y="425" text-anchor="middle" class="small">→ нажал кнопку</text>
            <text x="470" y="465" text-anchor="middle" class="small">сама делает всё</text>

            <rect x="620" y="280" width="260" height="220" class="box-yellow"/>
            <text x="750" y="320" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Компьютер</text>
            <text x="750" y="360" text-anchor="middle" class="small">программа:</text>
            <text x="750" y="385" text-anchor="middle" class="small">любая (универсальная!)</text>
            <text x="750" y="425" text-anchor="middle" class="small">→ запустил скрипт</text>
            <text x="750" y="465" text-anchor="middle" class="small">сам выполняет инструкции</text>

            <text x="480" y="555" text-anchor="middle" class="text">Главное отличие — компьютер можно перепрограммировать на что угодно</text>
            <text x="480" y="580" text-anchor="middle" class="small">а стиралка умеет только стирать</text>
          `
        },
        {
          title: "Шаг 6. Складываем всё вместе",
          subtitle: "ЭВМ — машина, которая считает с помощью электричества по заданной программе",
          scene: `
            <rect x="180" y="160" width="600" height="100" class="box-yellow"/>
            <text x="480" y="200" text-anchor="middle" class="text" font-size="22" font-weight="800" fill="#C29E08">ЭВМ = Электронная Вычислительная Машина</text>
            <text x="480" y="232" text-anchor="middle" class="small">= computer</text>

            <rect x="60" y="290" width="280" height="180" class="box-blue"/>
            <text x="200" y="325" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Э — Электронная</text>
            <line x1="80" y1="340" x2="320" y2="340" stroke="#e0e0e0" stroke-width="1"/>
            <text x="200" y="375" text-anchor="middle" class="small">работает на</text>
            <text x="200" y="397" text-anchor="middle" class="small">электрическом токе</text>
            <text x="200" y="435" text-anchor="middle" class="small">(дальше разберём что это)</text>

            <rect x="340" y="290" width="280" height="180" class="box-yellow"/>
            <text x="480" y="325" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">В — Вычислительная</text>
            <line x1="360" y1="340" x2="600" y2="340" stroke="#e0e0e0" stroke-width="1"/>
            <text x="480" y="375" text-anchor="middle" class="small">всё, что делает,</text>
            <text x="480" y="397" text-anchor="middle" class="small">сводит к вычислениям</text>
            <text x="480" y="435" text-anchor="middle" class="small">над числами в двоичном виде</text>

            <rect x="620" y="290" width="280" height="180" class="box-green"/>
            <text x="760" y="325" text-anchor="middle" class="text" font-weight="700" fill="#73B222">М — Машина</text>
            <line x1="640" y1="340" x2="880" y2="340" stroke="#e0e0e0" stroke-width="1"/>
            <text x="760" y="375" text-anchor="middle" class="small">выполняет</text>
            <text x="760" y="397" text-anchor="middle" class="small">программу сама</text>
            <text x="760" y="435" text-anchor="middle" class="small">программу можно менять</text>

            <text x="480" y="550" text-anchor="middle" class="text">Теперь логичный вопрос: а что такое «электрический ток»,</text>
            <text x="480" y="575" text-anchor="middle" class="text">на котором всё это работает?</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("ev-title").textContent = step.title;
        $("ev-subtitle").textContent = step.subtitle;
        $("ev-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("ev-scene").innerHTML = step.scene;
        $("ev-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("ev-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("ev-nextBtn").addEventListener("click", nextStep);
      $("ev-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Главное, что мы вынесли: компьютер — это <strong>электронная</strong> машина. Все его операции происходят благодаря движению электронов. А движение электронов — это электрический ток.

Значит, чтобы понять компьютер, нужно сначала понять ток.

---

## Часть 2. Электрический ток на пальцах

Слово «ток» — от слова «течь». Что-то по проводам течёт. Самая удобная аналогия — вода в трубе. Если по трубе может течь вода, то по проводу — электроны. И почти все правила работают одинаково.

Это объяснение во многом основано на <a href="https://thecode.media/gumanitarniy-tok/">статье Максима Ильяхова в журнале «Код»</a> — рекомендую её, если захотите углубиться.

<figure class="embedded-interactive" id="section-viz-current">
  <div class="interactive-meta">Интерактив 2</div>
  <h3>Электрический ток — гуманитарное объяснение</h3>
  <p class="interactive-desc">8 шагов: водяная аналогия → электрон → разность давлений и потенциалов → проводник vs изолятор → постоянный/переменный ток → применения → возврат к ЭВМ</p>
  <div class="interactive-svg-wrap">
<svg id="viz-current" viewBox="0 0 960 680" width="100%" role="img" aria-label="Что такое электрический ток">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 13px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                              text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                        text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="cu-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="cu-arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#3576C0"/>
    </marker>
    <marker id="cu-arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text id="cu-title" x="36" y="48" class="title"></text>
  <text id="cu-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="cu-scene"></g>

  <text id="cu-counter" x="36" y="635" class="text"></text>

  <g id="cu-prevGroup">
    <rect id="cu-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="cu-nextGroup">
    <rect id="cu-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="cu-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-current");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Ток — это что-то, что течёт",
          subtitle: "Слово «ток» — от «течь». Сравнить с водой будет очень полезно",
          scene: `
            <text x="100" y="160" class="text" font-weight="700" font-size="18">Аналогия:</text>

            <rect x="80" y="200" width="380" height="300" class="box-blue"/>
            <text x="270" y="240" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Вода в трубе</text>

            <rect x="120" y="280" width="60" height="180" fill="#F0FAF0" stroke="#3576C0" stroke-width="2" rx="6"/>
            <text x="150" y="270" text-anchor="middle" class="small">бак</text>

            <line x1="180" y1="365" x2="400" y2="365" stroke="#3576C0" stroke-width="20" stroke-linecap="round"/>
            <line x1="180" y1="365" x2="400" y2="365" stroke="#a8d4ff" stroke-width="14" stroke-linecap="round"/>

            <circle cx="220" cy="365" r="4" fill="#3576C0"/>
            <circle cx="260" cy="365" r="4" fill="#3576C0"/>
            <circle cx="300" cy="365" r="4" fill="#3576C0"/>
            <circle cx="340" cy="365" r="4" fill="#3576C0"/>
            <circle cx="380" cy="365" r="4" fill="#3576C0"/>

            <text x="270" y="490" text-anchor="middle" class="small">молекулы воды текут по трубе</text>

            <rect x="500" y="200" width="380" height="300" class="box-yellow"/>
            <text x="690" y="240" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Ток в проводе</text>

            <rect x="540" y="280" width="60" height="180" fill="#FFFBEB" stroke="#C29E08" stroke-width="2" rx="6"/>
            <text x="570" y="270" text-anchor="middle" class="small">батарейка</text>

            <line x1="600" y1="365" x2="820" y2="365" stroke="#C29E08" stroke-width="20" stroke-linecap="round"/>
            <line x1="600" y1="365" x2="820" y2="365" stroke="#FFF6D1" stroke-width="14" stroke-linecap="round"/>

            <circle cx="640" cy="365" r="4" fill="#C29E08"/>
            <text x="640" y="356" text-anchor="middle" font-size="9" fill="#C29E08">e⁻</text>
            <circle cx="680" cy="365" r="4" fill="#C29E08"/>
            <text x="680" y="356" text-anchor="middle" font-size="9" fill="#C29E08">e⁻</text>
            <circle cx="720" cy="365" r="4" fill="#C29E08"/>
            <text x="720" y="356" text-anchor="middle" font-size="9" fill="#C29E08">e⁻</text>
            <circle cx="760" cy="365" r="4" fill="#C29E08"/>
            <text x="760" y="356" text-anchor="middle" font-size="9" fill="#C29E08">e⁻</text>
            <circle cx="800" cy="365" r="4" fill="#C29E08"/>
            <text x="800" y="356" text-anchor="middle" font-size="9" fill="#C29E08">e⁻</text>

            <text x="690" y="490" text-anchor="middle" class="small">электроны (e⁻) текут по проводу</text>

            <text x="480" y="565" text-anchor="middle" class="text">Ток — это движение электронов по проводнику</text>
          `
        },
        {
          title: "Шаг 2. Электрон — частица с зарядом",
          subtitle: "Электрон переносит маленькую порцию энергии",
          scene: `
            <rect x="280" y="180" width="400" height="200" class="box-blue"/>
            <circle cx="480" cy="280" r="60" fill="#FFFBEB" stroke="#3576C0" stroke-width="2"/>
            <text x="480" y="285" text-anchor="middle" class="text" font-size="24" font-weight="800" fill="#3576C0">e⁻</text>
            <text x="480" y="365" text-anchor="middle" class="small">электрон</text>

            <text x="480" y="430" text-anchor="middle" class="text">Электрон — элементарная частица</text>
            <text x="480" y="455" text-anchor="middle" class="small">«элементарная» значит самая простая — на части не разбирается</text>

            <text x="480" y="510" text-anchor="middle" class="text">Несёт минимальный возможный отрицательный заряд («−»)</text>
            <text x="480" y="535" text-anchor="middle" class="small">«Заряд» = кусочек энергии, который может заставить что-то крутиться, греться, светиться</text>
          `
        },
        {
          title: "Шаг 3. Бак с водой — разность давлений",
          subtitle: "Чтобы вода потекла, нужен перепад: где-то много, где-то мало",
          scene: `
            <text x="480" y="155" text-anchor="middle" class="text" font-weight="700">Вода течёт сверху вниз — из «много» в «мало»</text>

            <rect x="160" y="200" width="120" height="100" fill="#a8d4ff" stroke="#3576C0" stroke-width="2"/>
            <text x="220" y="190" text-anchor="middle" class="small">бак A (полный)</text>
            <text x="220" y="255" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">высокий</text>
            <text x="220" y="278" text-anchor="middle" class="small">уровень</text>

            <line x1="280" y1="290" x2="540" y2="290" stroke="#3576C0" stroke-width="14" stroke-linecap="round"/>
            <line x1="280" y1="290" x2="540" y2="290" stroke="#a8d4ff" stroke-width="10" stroke-linecap="round"/>

            <line x1="540" y1="290" x2="540" y2="440" stroke="#3576C0" stroke-width="14" stroke-linecap="round"/>
            <line x1="540" y1="290" x2="540" y2="440" stroke="#a8d4ff" stroke-width="10" stroke-linecap="round"/>

            <rect x="480" y="440" width="120" height="80" fill="#cce5ff" stroke="#3576C0" stroke-width="2"/>
            <text x="540" y="500" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">низкий</text>
            <text x="540" y="540" text-anchor="middle" class="small">бак B (пустой)</text>

            <line x1="350" y1="270" x2="450" y2="270" stroke="#3576C0" stroke-width="3" marker-end="url(#cu-arrowBlue)"/>
            <text x="400" y="255" text-anchor="middle" class="small" fill="#3576C0">поток воды</text>

            <text x="700" y="290" class="text" font-weight="700">Чем больше</text>
            <text x="700" y="315" class="text" font-weight="700">разница уровней —</text>
            <text x="700" y="345" class="text" font-weight="700">тем сильнее поток</text>
            <text x="700" y="395" class="small">если уровни сравняются —</text>
            <text x="700" y="415" class="small">вода перестанет течь</text>
          `
        },
        {
          title: "Шаг 4. Электричество: то же самое, только с электронами",
          subtitle: "Минус и плюс — это «полный» и «пустой» баки в мире электронов",
          scene: `
            <text x="480" y="155" text-anchor="middle" class="text" font-weight="700">Электроны бегут от «−» к «+» — там их избыток vs недостаток</text>

            <rect x="160" y="220" width="120" height="180" fill="#FFFBEB" stroke="#C29E08" stroke-width="2" rx="6"/>
            <text x="220" y="205" text-anchor="middle" class="small">«−» избыток электронов</text>
            <text x="220" y="290" text-anchor="middle" class="text" font-size="28" font-weight="800" fill="#C29E08">−</text>
            <text x="220" y="335" text-anchor="middle" class="mono">e⁻ e⁻ e⁻</text>
            <text x="220" y="355" text-anchor="middle" class="mono">e⁻ e⁻ e⁻</text>
            <text x="220" y="375" text-anchor="middle" class="mono">e⁻ e⁻ e⁻</text>

            <line x1="280" y1="310" x2="680" y2="310" stroke="#C29E08" stroke-width="14" stroke-linecap="round"/>
            <line x1="280" y1="310" x2="680" y2="310" stroke="#FFF6D1" stroke-width="10" stroke-linecap="round"/>

            <circle cx="340" cy="310" r="4" fill="#C29E08"/>
            <circle cx="400" cy="310" r="4" fill="#C29E08"/>
            <circle cx="460" cy="310" r="4" fill="#C29E08"/>
            <circle cx="520" cy="310" r="4" fill="#C29E08"/>
            <circle cx="580" cy="310" r="4" fill="#C29E08"/>
            <circle cx="640" cy="310" r="4" fill="#C29E08"/>

            <line x1="380" y1="285" x2="600" y2="285" stroke="#C29E08" stroke-width="3" marker-end="url(#cu-arrowGray)"/>
            <text x="490" y="275" text-anchor="middle" class="small" fill="#C29E08">движение электронов = ТОК</text>

            <rect x="680" y="220" width="120" height="180" fill="#FFFBEB" stroke="#C29E08" stroke-width="2" rx="6"/>
            <text x="740" y="205" text-anchor="middle" class="small">«+» недостаток</text>
            <text x="740" y="290" text-anchor="middle" class="text" font-size="28" font-weight="800" fill="#C29E08">+</text>
            <text x="740" y="335" text-anchor="middle" class="small">пусто</text>

            <text x="480" y="475" text-anchor="middle" class="text">Разность уровней электронов называется «напряжением» (V)</text>
            <text x="480" y="500" text-anchor="middle" class="small">Чем больше напряжение — тем сильнее ток (как давление воды в шланге)</text>
          `
        },
        {
          title: "Шаг 5. Проводник — труба для электронов",
          subtitle: "Не любой материал пускает электроны бежать — нужна особая структура",
          scene: `
            <rect x="60" y="170" width="400" height="280" class="box-green"/>
            <text x="260" y="205" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Проводники</text>
            <text x="260" y="232" text-anchor="middle" class="small">электроны могут свободно двигаться</text>

            <rect x="100" y="260" width="320" height="40" fill="#F0FAF0" stroke="#73B222" stroke-width="1" rx="6"/>
            <text x="260" y="285" text-anchor="middle" class="small">медь (в проводах)</text>

            <rect x="100" y="310" width="320" height="40" fill="#F0FAF0" stroke="#73B222" stroke-width="1" rx="6"/>
            <text x="260" y="335" text-anchor="middle" class="small">алюминий, золото, серебро</text>

            <rect x="100" y="360" width="320" height="40" fill="#F0FAF0" stroke="#73B222" stroke-width="1" rx="6"/>
            <text x="260" y="385" text-anchor="middle" class="small">кремний (в чипах — особым образом)</text>

            <text x="260" y="425" text-anchor="middle" class="small">по ним электроны проходят легко</text>

            <rect x="500" y="170" width="400" height="280" class="box-red"/>
            <text x="700" y="205" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">Изоляторы</text>
            <text x="700" y="232" text-anchor="middle" class="small">электронам ходу нет</text>

            <rect x="540" y="260" width="320" height="40" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1" rx="6"/>
            <text x="700" y="285" text-anchor="middle" class="small">резина (обмотка проводов)</text>

            <rect x="540" y="310" width="320" height="40" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1" rx="6"/>
            <text x="700" y="335" text-anchor="middle" class="small">пластик, стекло</text>

            <rect x="540" y="360" width="320" height="40" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1" rx="6"/>
            <text x="700" y="385" text-anchor="middle" class="small">сухое дерево, керамика</text>

            <text x="700" y="425" text-anchor="middle" class="small">используются чтобы изолировать провода</text>

            <text x="480" y="510" text-anchor="middle" class="text">Поэтому провод = металл внутри + пластик снаружи</text>
            <text x="480" y="535" text-anchor="middle" class="small">металл проводит ток, пластик его удерживает</text>
          `
        },
        {
          title: "Шаг 6. Постоянный и переменный ток",
          subtitle: "Два способа гонять электроны: в одну сторону или туда-сюда",
          scene: `
            <text x="240" y="155" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">Постоянный (DC)</text>
            <text x="720" y="155" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#C29E08">Переменный (AC)</text>

            <rect x="60" y="180" width="360" height="300" class="box-blue"/>

            <text x="80" y="215" class="small">всегда в одну сторону:</text>
            <line x1="80" y1="260" x2="400" y2="260" stroke="#3576C0" stroke-width="3" marker-end="url(#cu-arrowBlue)"/>
            <text x="240" y="246" text-anchor="middle" class="small" fill="#3576C0">e⁻ → → → → →</text>

            <text x="80" y="305" class="text" font-weight="700">где встречается:</text>
            <text x="80" y="335" class="small">• батарейки</text>
            <text x="80" y="360" class="small">• аккумуляторы телефона</text>
            <text x="80" y="385" class="small">• USB-кабели</text>
            <text x="80" y="410" class="small">• внутри компьютера и чипов</text>

            <text x="240" y="455" text-anchor="middle" class="small">+ ────⊳────  −</text>

            <rect x="540" y="180" width="360" height="300" class="box-yellow"/>

            <text x="560" y="215" class="small">направление меняется 50 раз/сек:</text>
            <line x1="560" y1="260" x2="880" y2="260" stroke="#C29E08" stroke-width="3"/>
            <text x="720" y="246" text-anchor="middle" class="small" fill="#C29E08">e⁻ ⇄ ⇄ ⇄ ⇄ ⇄</text>

            <text x="560" y="305" class="text" font-weight="700">где встречается:</text>
            <text x="560" y="335" class="small">• розетки в квартире</text>
            <text x="560" y="360" class="small">• линии электропередач</text>
            <text x="560" y="385" class="small">• промышленные сети</text>

            <text x="560" y="430" class="small">в зарядке телефона стоит</text>
            <text x="560" y="450" class="small">преобразователь AC → DC</text>

            <text x="480" y="525" text-anchor="middle" class="small">Переменным удобнее передавать на большие расстояния — отсюда розетки</text>
          `
        },
        {
          title: "Шаг 7. Что ток умеет делать",
          subtitle: "Электроны передают энергию устройствам, которые превращают её в работу",
          scene: `
            <rect x="60" y="160" width="200" height="170" class="box-blue"/>
            <text x="160" y="195" text-anchor="middle" class="text" font-size="22" font-weight="700" fill="#3576C0">⚙</text>
            <text x="160" y="225" text-anchor="middle" class="text" font-weight="700">Моторы</text>
            <text x="160" y="265" text-anchor="middle" class="small">создают магнитное поле</text>
            <text x="160" y="285" text-anchor="middle" class="small">→ вращают ось</text>
            <text x="160" y="315" text-anchor="middle" class="small">стиралка, дрель, насос</text>

            <rect x="280" y="160" width="200" height="170" class="box-blue"/>
            <text x="380" y="200" text-anchor="middle" class="text" font-size="26" font-weight="700" fill="#C30B0A">🔥</text>
            <text x="380" y="225" text-anchor="middle" class="text" font-weight="700">Нагреватели</text>
            <text x="380" y="265" text-anchor="middle" class="small">электроны стукают атомы</text>
            <text x="380" y="285" text-anchor="middle" class="small">→ атомы шевелятся → тепло</text>
            <text x="380" y="315" text-anchor="middle" class="small">чайник, тостер, утюг</text>

            <rect x="500" y="160" width="200" height="170" class="box-blue"/>
            <text x="600" y="200" text-anchor="middle" class="text" font-size="26" font-weight="700" fill="#C29E08">💡</text>
            <text x="600" y="225" text-anchor="middle" class="text" font-weight="700">Светодиоды</text>
            <text x="600" y="265" text-anchor="middle" class="small">в кремнии энергия</text>
            <text x="600" y="285" text-anchor="middle" class="small">→ превращается в фотоны</text>
            <text x="600" y="315" text-anchor="middle" class="small">лампы, экраны, индикаторы</text>

            <rect x="720" y="160" width="200" height="170" class="box-yellow"/>
            <text x="820" y="200" text-anchor="middle" class="text" font-size="22" font-weight="700" fill="#3576C0">⚡</text>
            <text x="820" y="225" text-anchor="middle" class="text" font-weight="700">Чипы (CPU)</text>
            <text x="820" y="265" text-anchor="middle" class="small">ток открывает/закрывает</text>
            <text x="820" y="285" text-anchor="middle" class="small">микроскопические «двери»</text>
            <text x="820" y="315" text-anchor="middle" class="small">→ это и есть вычисления</text>

            <text x="480" y="420" text-anchor="middle" class="text">Один и тот же ток делает разные вещи —</text>
            <text x="480" y="445" text-anchor="middle" class="text">в зависимости от устройства, в которое он попадает</text>

            <text x="480" y="510" text-anchor="middle" class="small">Компьютер использует ток как сигнал «1» (есть ток) или «0» (нет тока)</text>
          `
        },
        {
          title: "Шаг 8. Возвращаемся к ЭВМ",
          subtitle: "Теперь понятно, почему компьютер — «электронная» машина",
          scene: `
            <rect x="60" y="170" width="380" height="280" class="box-yellow"/>
            <text x="250" y="205" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Что происходит внутри</text>

            <rect x="100" y="230" width="300" height="60" fill="#FFFBEB" stroke="#C29E08" stroke-width="1" rx="6"/>
            <text x="250" y="255" text-anchor="middle" class="small">по миллиардам проводков в чипе</text>
            <text x="250" y="278" text-anchor="middle" class="small">бегут электроны</text>

            <rect x="100" y="300" width="300" height="60" fill="#FFFBEB" stroke="#C29E08" stroke-width="1" rx="6"/>
            <text x="250" y="325" text-anchor="middle" class="small">есть ток в провод = «1»</text>
            <text x="250" y="348" text-anchor="middle" class="small">нет тока = «0»</text>

            <rect x="100" y="370" width="300" height="60" fill="#FFFBEB" stroke="#C29E08" stroke-width="1" rx="6"/>
            <text x="250" y="395" text-anchor="middle" class="small">из таких 1 и 0 складываются</text>
            <text x="250" y="418" text-anchor="middle" class="small">все программы и данные</text>

            <rect x="480" y="170" width="420" height="280" class="box-green"/>
            <text x="690" y="205" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Почему это круто</text>

            <text x="500" y="245" class="small">• скорость света → миллиарды операций/сек</text>
            <text x="500" y="280" class="small">• никаких движущихся деталей</text>
            <text x="500" y="315" class="small">• чипы можно делать микроскопическими</text>
            <text x="500" y="350" class="small">• мало энергии на одну операцию</text>
            <text x="500" y="385" class="small">• надёжно — работает годами</text>
            <text x="500" y="420" class="small">• программируется на что угодно</text>

            <rect x="180" y="490" width="600" height="80" class="box-blue"/>
            <text x="480" y="520" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Компьютер = ЭВМ</text>
            <text x="480" y="548" text-anchor="middle" class="small">машина, которая считает с помощью движения электронов</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("cu-title").textContent = step.title;
        $("cu-subtitle").textContent = step.subtitle;
        $("cu-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("cu-scene").innerHTML = step.scene;
        $("cu-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("cu-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("cu-nextBtn").addEventListener("click", nextStep);
      $("cu-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Теперь у нас есть фундамент: компьютер питается током, ток — это движущиеся электроны, и в проводах эти электроны можно либо пропустить, либо задержать.

Звучит просто, но именно из этой простой идеи — «пропустить или задержать» — вырастает всё остальное.

---

## Часть 3. Транзистор — крошечный переключатель

Идея гениальная: что если сделать устройство, которое управляет током <strong>другим током</strong>? Маленький управляющий сигнал открывает или закрывает «дверь» для большого потока электронов. Это и есть транзистор.

Транзистор — это сердце всей современной электроники. Без транзистора не было бы ни компьютеров, ни телефонов, ни даже банальной микроволновки. Давайте посмотрим, как он устроен.

<figure class="embedded-interactive" id="section-viz-tr1">
  <div class="interactive-meta">Интерактив 3</div>
  <h3>Транзистор — крошечный переключатель тока</h3>
  <p class="interactive-desc">7 шагов: аналогия с краном → три ножки транзистора (исток/сток/затвор) → закрытое состояние → открытое состояние → бит = 0 или 1 → размер транзистора через историю → 28 миллиардов транзисторов на чипе</p>
  <div class="interactive-svg-wrap">
<svg id="viz-tr1" viewBox="0 0 960 680" width="100%" role="img" aria-label="Что такое транзистор">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                          text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                    text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="tr1-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="tr1-arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#3576C0"/>
    </marker>
    <marker id="tr1-arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#73B222"/>
    </marker>
  </defs>

  <text id="tr1-title" x="36" y="48" class="title"></text>
  <text id="tr1-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="tr1-scene"></g>

  <text id="tr1-counter" x="36" y="635" class="text"></text>

  <g id="tr1-prevGroup">
    <rect id="tr1-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="tr1-nextGroup">
    <rect id="tr1-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="tr1-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-tr1");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Вспомним водяную аналогию",
          subtitle: "Чтобы управлять потоком воды, мы используем кран. Что-то похожее нужно и для тока",
          scene: `
            <text x="480" y="155" text-anchor="middle" class="text" font-weight="700">Кран открыт → вода льётся   ·   кран закрыт → вода стоит</text>

            <rect x="60" y="200" width="400" height="280" class="box-blue"/>
            <text x="260" y="240" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Кран закрыт</text>

            <rect x="100" y="280" width="80" height="120" fill="#a8d4ff" stroke="#3576C0" stroke-width="2"/>
            <text x="140" y="270" text-anchor="middle" class="small">бак</text>

            <line x1="180" y1="340" x2="280" y2="340" stroke="#3576C0" stroke-width="14" stroke-linecap="round"/>
            <line x1="180" y1="340" x2="280" y2="340" stroke="#a8d4ff" stroke-width="10" stroke-linecap="round"/>

            <rect x="280" y="305" width="40" height="70" fill="#C30B0A" stroke="#5E5850" stroke-width="1.5" rx="4"/>
            <text x="300" y="295" text-anchor="middle" class="small" fill="#C30B0A">кран</text>

            <line x1="320" y1="340" x2="420" y2="340" stroke="#5E5850" stroke-width="3" stroke-dasharray="4 4"/>
            <text x="370" y="365" text-anchor="middle" class="small">сухо</text>

            <rect x="500" y="200" width="400" height="280" class="box-green"/>
            <text x="700" y="240" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Кран открыт</text>

            <rect x="540" y="280" width="80" height="120" fill="#a8d4ff" stroke="#3576C0" stroke-width="2"/>
            <text x="580" y="270" text-anchor="middle" class="small">бак</text>

            <line x1="620" y1="340" x2="860" y2="340" stroke="#3576C0" stroke-width="14" stroke-linecap="round"/>
            <line x1="620" y1="340" x2="860" y2="340" stroke="#a8d4ff" stroke-width="10" stroke-linecap="round"/>

            <rect x="720" y="305" width="40" height="70" fill="#73B222" stroke="#5E5850" stroke-width="1.5" rx="4"/>
            <text x="740" y="295" text-anchor="middle" class="small" fill="#73B222">кран</text>

            <text x="830" y="365" text-anchor="middle" class="small">→ → →</text>

            <text x="480" y="540" text-anchor="middle" class="text">Транзистор — это такой же «кран», только для электрического тока</text>
          `
        },
        {
          title: "Шаг 2. У транзистора три ножки",
          subtitle: "Две — для тока, который мы хотим пропустить, третья — для управления",
          scene: `
            <rect x="280" y="180" width="400" height="320" class="box-blue"/>
            <text x="480" y="220" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Транзистор (упрощённо)</text>

            <rect x="380" y="260" width="200" height="180" fill="#F5F5F5" stroke="#3576C0" stroke-width="2" rx="8"/>

            <line x1="370" y1="300" x2="380" y2="300" stroke="#3576C0" stroke-width="3"/>
            <circle cx="365" cy="300" r="5" fill="#3576C0"/>
            <text x="350" y="305" text-anchor="end" class="text" font-weight="700" fill="#3576C0">Исток</text>
            <text x="350" y="325" text-anchor="end" class="small">сюда втекает ток</text>

            <line x1="580" y1="400" x2="590" y2="400" stroke="#3576C0" stroke-width="3"/>
            <circle cx="595" cy="400" r="5" fill="#3576C0"/>
            <text x="610" y="405" class="text" font-weight="700" fill="#3576C0">Сток</text>
            <text x="610" y="425" class="small">отсюда вытекает ток</text>

            <line x1="480" y1="260" x2="480" y2="250" stroke="#C29E08" stroke-width="3"/>
            <circle cx="480" cy="245" r="5" fill="#C29E08"/>
            <text x="480" y="235" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Затвор</text>

            <text x="480" y="365" text-anchor="middle" class="small">тут «дверь»</text>

            <text x="480" y="555" text-anchor="middle" class="text">Затвор решает: пропустить ток от истока к стоку или нет</text>
          `
        },
        {
          title: "Шаг 3. Нет тока на затворе → дверь закрыта",
          subtitle: "Если на затвор не подать напряжение, ток не пройдёт от истока к стоку",
          scene: `
            <rect x="280" y="180" width="400" height="320" class="box-red"/>
            <text x="480" y="220" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">Затвор = 0 → транзистор закрыт</text>

            <rect x="380" y="260" width="200" height="180" fill="#F5F5F5" stroke="#C30B0A" stroke-width="2" rx="8"/>

            <line x1="320" y1="300" x2="380" y2="300" stroke="#3576C0" stroke-width="3"/>
            <text x="305" y="305" text-anchor="end" class="small">Исток (+)</text>
            <circle cx="335" cy="300" r="4" fill="#3576C0"/>
            <circle cx="355" cy="300" r="4" fill="#3576C0"/>

            <line x1="580" y1="400" x2="640" y2="400" stroke="#5E5850" stroke-width="3" stroke-dasharray="4 4"/>
            <text x="655" y="405" class="small" fill="#5E5850">Сток — сухо</text>

            <line x1="480" y1="260" x2="480" y2="220" stroke="#5E5850" stroke-width="3" stroke-dasharray="4 4"/>
            <text x="480" y="205" text-anchor="middle" class="small" fill="#5E5850">Затвор: 0 В</text>

            <line x1="420" y1="320" x2="540" y2="380" stroke="#C30B0A" stroke-width="3"/>
            <line x1="540" y1="320" x2="420" y2="380" stroke="#C30B0A" stroke-width="3"/>
            <text x="480" y="365" text-anchor="middle" class="small" fill="#C30B0A">⊗ закрыто</text>

            <text x="480" y="555" text-anchor="middle" class="text">Электроны не могут пройти — внутри транзистора барьер</text>
          `
        },
        {
          title: "Шаг 4. Подали ток на затвор → дверь открылась",
          subtitle: "Маленький ток на затворе открывает путь для большого тока через транзистор",
          scene: `
            <rect x="280" y="180" width="400" height="320" class="box-green"/>
            <text x="480" y="220" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Затвор = 1 → транзистор открыт</text>

            <rect x="380" y="260" width="200" height="180" fill="#F0FAF0" stroke="#73B222" stroke-width="2" rx="8"/>

            <line x1="320" y1="300" x2="380" y2="300" stroke="#3576C0" stroke-width="3"/>
            <text x="305" y="305" text-anchor="end" class="small">Исток (+)</text>

            <line x1="380" y1="300" x2="580" y2="400" stroke="#73B222" stroke-width="3" marker-end="url(#tr1-arrowGreen)"/>
            <circle cx="420" cy="320" r="4" fill="#73B222"/>
            <circle cx="460" cy="340" r="4" fill="#73B222"/>
            <circle cx="500" cy="360" r="4" fill="#73B222"/>
            <circle cx="540" cy="380" r="4" fill="#73B222"/>

            <line x1="580" y1="400" x2="640" y2="400" stroke="#3576C0" stroke-width="3"/>
            <text x="655" y="405" class="small">Сток — ток есть!</text>

            <line x1="480" y1="260" x2="480" y2="220" stroke="#C29E08" stroke-width="3" marker-start="url(#tr1-arrowBlue)"/>
            <text x="480" y="205" text-anchor="middle" class="small" fill="#C29E08">Затвор: +5 В</text>

            <text x="480" y="555" text-anchor="middle" class="text">Электроны проходят свободно — ток течёт от истока к стоку</text>
          `
        },
        {
          title: "Шаг 5. Два состояния = бит = 0 или 1",
          subtitle: "Транзистор всегда либо «есть ток на выходе», либо «нет тока» — основа всего двоичного",
          scene: `
            <rect x="60" y="170" width="400" height="300" class="box-red"/>
            <text x="260" y="205" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">Состояние: закрыт</text>

            <rect x="160" y="240" width="200" height="120" fill="#F5F5F5" stroke="#C30B0A" stroke-width="2" rx="8"/>
            <text x="260" y="310" text-anchor="middle" class="text" font-size="36" font-weight="800" fill="#C30B0A">⊗</text>

            <text x="260" y="400" text-anchor="middle" class="small">на выходе тока нет</text>
            <text x="260" y="435" text-anchor="middle" class="text" font-size="32" font-weight="800" fill="#C30B0A">0</text>

            <rect x="500" y="170" width="400" height="300" class="box-green"/>
            <text x="700" y="205" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Состояние: открыт</text>

            <rect x="600" y="240" width="200" height="120" fill="#F0FAF0" stroke="#73B222" stroke-width="2" rx="8"/>
            <line x1="640" y1="320" x2="760" y2="280" stroke="#73B222" stroke-width="3" marker-end="url(#tr1-arrowGreen)"/>
            <circle cx="670" cy="310" r="4" fill="#73B222"/>
            <circle cx="710" cy="300" r="4" fill="#73B222"/>

            <text x="700" y="400" text-anchor="middle" class="small">на выходе есть ток</text>
            <text x="700" y="435" text-anchor="middle" class="text" font-size="32" font-weight="800" fill="#73B222">1</text>

            <text x="480" y="540" text-anchor="middle" class="text">Один транзистор хранит один бит информации</text>
          `
        },
        {
          title: "Шаг 6. Транзистор крошечный и быстрый",
          subtitle: "Сейчас один транзистор — несколько нанометров. Это в 50 000 раз тоньше волоса",
          scene: `
            <text x="480" y="150" text-anchor="middle" class="text" font-weight="700">Размер транзистора в современных чипах</text>

            <line x1="80" y1="280" x2="880" y2="280" stroke="#5E5850" stroke-width="1.5"/>

            <line x1="100" y1="270" x2="100" y2="290" stroke="#5E5850" stroke-width="1.5"/>
            <text x="100" y="305" text-anchor="middle" class="small">1947</text>
            <text x="100" y="325" text-anchor="middle" class="small" fill="#5E5850">первый</text>
            <text x="100" y="343" text-anchor="middle" class="small" fill="#5E5850">транзистор</text>
            <rect x="60" y="220" width="80" height="40" class="box-blue"/>
            <text x="100" y="247" text-anchor="middle" class="small">~1 см</text>

            <line x1="320" y1="270" x2="320" y2="290" stroke="#5E5850" stroke-width="1.5"/>
            <text x="320" y="305" text-anchor="middle" class="small">1971</text>
            <text x="320" y="325" text-anchor="middle" class="small" fill="#5E5850">Intel 4004</text>
            <rect x="295" y="235" width="50" height="25" class="box-blue"/>
            <text x="320" y="252" text-anchor="middle" class="small">10 мкм</text>

            <line x1="540" y1="270" x2="540" y2="290" stroke="#5E5850" stroke-width="1.5"/>
            <text x="540" y="305" text-anchor="middle" class="small">2000</text>
            <text x="540" y="325" text-anchor="middle" class="small" fill="#5E5850">Pentium 4</text>
            <rect x="525" y="240" width="30" height="20" class="box-blue"/>
            <text x="540" y="254" text-anchor="middle" class="small">180 нм</text>

            <line x1="760" y1="270" x2="760" y2="290" stroke="#5E5850" stroke-width="1.5"/>
            <text x="760" y="305" text-anchor="middle" class="small">2024</text>
            <text x="760" y="325" text-anchor="middle" class="small" fill="#5E5850">Apple M4</text>
            <rect x="753" y="245" width="14" height="15" class="box-green"/>
            <text x="760" y="256" text-anchor="middle" class="small" font-size="10">3 нм</text>

            <rect x="180" y="400" width="600" height="120" class="box-yellow"/>
            <text x="480" y="437" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">3 нанометра — это сколько?</text>
            <text x="480" y="465" text-anchor="middle" class="small">диаметр волоса = ~70 000 нм</text>
            <text x="480" y="487" text-anchor="middle" class="small">размер одной молекулы ДНК = ~2 нм</text>
            <text x="480" y="509" text-anchor="middle" class="small">современный транзистор — между этими двумя</text>
          `
        },
        {
          title: "Шаг 7. На одном чипе — миллиарды транзисторов",
          subtitle: "В современном CPU больше транзисторов, чем людей на Земле",
          scene: `
            <rect x="180" y="160" width="600" height="280" class="box-blue"/>
            <text x="200" y="190" class="small" fill="#3576C0">чип CPU (увеличенный фрагмент)</text>

            <g>
              <rect x="220" y="210" width="540" height="220" fill="#F5F5F5" stroke="#3576C0" stroke-width="1" rx="6"/>
            </g>

            <g fill="#3576C0">
              <circle cx="250" cy="240" r="2"/><circle cx="270" cy="240" r="2"/><circle cx="290" cy="240" r="2"/>
              <circle cx="310" cy="240" r="2"/><circle cx="330" cy="240" r="2"/><circle cx="350" cy="240" r="2"/>
              <circle cx="370" cy="240" r="2"/><circle cx="390" cy="240" r="2"/><circle cx="410" cy="240" r="2"/>
              <circle cx="430" cy="240" r="2"/><circle cx="450" cy="240" r="2"/><circle cx="470" cy="240" r="2"/>
              <circle cx="490" cy="240" r="2"/><circle cx="510" cy="240" r="2"/><circle cx="530" cy="240" r="2"/>
              <circle cx="550" cy="240" r="2"/><circle cx="570" cy="240" r="2"/><circle cx="590" cy="240" r="2"/>
              <circle cx="610" cy="240" r="2"/><circle cx="630" cy="240" r="2"/><circle cx="650" cy="240" r="2"/>
              <circle cx="670" cy="240" r="2"/><circle cx="690" cy="240" r="2"/><circle cx="710" cy="240" r="2"/>
              <circle cx="730" cy="240" r="2"/>
            </g>
            <g fill="#3576C0">
              <circle cx="250" cy="270" r="2"/><circle cx="290" cy="270" r="2"/><circle cx="330" cy="270" r="2"/>
              <circle cx="370" cy="270" r="2"/><circle cx="410" cy="270" r="2"/><circle cx="450" cy="270" r="2"/>
              <circle cx="490" cy="270" r="2"/><circle cx="530" cy="270" r="2"/><circle cx="570" cy="270" r="2"/>
              <circle cx="610" cy="270" r="2"/><circle cx="650" cy="270" r="2"/><circle cx="690" cy="270" r="2"/>
              <circle cx="730" cy="270" r="2"/>
              <circle cx="270" cy="300" r="2"/><circle cx="310" cy="300" r="2"/><circle cx="350" cy="300" r="2"/>
              <circle cx="390" cy="300" r="2"/><circle cx="430" cy="300" r="2"/><circle cx="470" cy="300" r="2"/>
              <circle cx="510" cy="300" r="2"/><circle cx="550" cy="300" r="2"/><circle cx="590" cy="300" r="2"/>
              <circle cx="630" cy="300" r="2"/><circle cx="670" cy="300" r="2"/><circle cx="710" cy="300" r="2"/>
              <circle cx="250" cy="330" r="2"/><circle cx="290" cy="330" r="2"/><circle cx="330" cy="330" r="2"/>
              <circle cx="370" cy="330" r="2"/><circle cx="410" cy="330" r="2"/><circle cx="450" cy="330" r="2"/>
              <circle cx="490" cy="330" r="2"/><circle cx="530" cy="330" r="2"/><circle cx="570" cy="330" r="2"/>
              <circle cx="610" cy="330" r="2"/><circle cx="650" cy="330" r="2"/><circle cx="690" cy="330" r="2"/>
              <circle cx="730" cy="330" r="2"/>
              <circle cx="270" cy="360" r="2"/><circle cx="310" cy="360" r="2"/><circle cx="350" cy="360" r="2"/>
              <circle cx="390" cy="360" r="2"/><circle cx="430" cy="360" r="2"/><circle cx="470" cy="360" r="2"/>
              <circle cx="510" cy="360" r="2"/><circle cx="550" cy="360" r="2"/><circle cx="590" cy="360" r="2"/>
              <circle cx="630" cy="360" r="2"/><circle cx="670" cy="360" r="2"/><circle cx="710" cy="360" r="2"/>
              <circle cx="250" cy="390" r="2"/><circle cx="290" cy="390" r="2"/><circle cx="330" cy="390" r="2"/>
              <circle cx="370" cy="390" r="2"/><circle cx="410" cy="390" r="2"/><circle cx="450" cy="390" r="2"/>
              <circle cx="490" cy="390" r="2"/><circle cx="530" cy="390" r="2"/><circle cx="570" cy="390" r="2"/>
              <circle cx="610" cy="390" r="2"/><circle cx="650" cy="390" r="2"/><circle cx="690" cy="390" r="2"/>
              <circle cx="730" cy="390" r="2"/>
            </g>

            <text x="480" y="475" text-anchor="middle" class="text">каждая точка — один транзистор</text>

            <rect x="120" y="495" width="720" height="85" class="box-green"/>
            <text x="480" y="525" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Apple M4 = 28 миллиардов транзисторов</text>
            <text x="480" y="552" text-anchor="middle" class="small">на чипе размером с ноготь</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("tr1-title").textContent = step.title;
        $("tr1-subtitle").textContent = step.subtitle;
        $("tr1-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("tr1-scene").innerHTML = step.scene;
        $("tr1-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("tr1-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("tr1-nextBtn").addEventListener("click", nextStep);
      $("tr1-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Запомните главное: <strong>один транзистор хранит один бит</strong>. Открыт — это «1», закрыт — это «0». Из этих нулей и единиц складывается всё, что вы видите на экране.

Но один транзистор сам по себе ничего особенного не умеет. Магия начинается, когда их соединяют вместе.

---

## Часть 4. Логические вентили: из транзисторов в логику

Если соединить два-три транзистора по особой схеме, получится устройство, которое умеет принимать простейшие решения. Например: «выдай 1 только если оба входа единицы». Или: «выдай противоположное от того, что пришло на вход».

Такие схемы называются <strong>логическими вентилями</strong>. Их всего три базовых — NOT, AND и OR — и этого достаточно, чтобы построить что угодно. Серьёзно — что угодно. Любой процессор, любая память, любое цифровое устройство в мире — всё в конечном счёте сводится к этим трём вентилям.

<figure class="embedded-interactive" id="section-viz-tr2">
  <div class="interactive-meta">Интерактив 4</div>
  <h3>Из транзисторов — логические вентили</h3>
  <p class="interactive-desc">7 шагов: идея соединения транзисторов → NOT → AND → OR → из трёх вентилей любая логика → пример полусумматора (1+1=2) → большая картина</p>
  <div class="interactive-svg-wrap">
<svg id="viz-tr2" viewBox="0 0 960 680" width="100%" role="img" aria-label="Логические вентили из транзисторов">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                          text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                    text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="tr2-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text id="tr2-title" x="36" y="48" class="title"></text>
  <text id="tr2-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="tr2-scene"></g>

  <text id="tr2-counter" x="36" y="635" class="text"></text>

  <g id="tr2-prevGroup">
    <rect id="tr2-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="tr2-nextGroup">
    <rect id="tr2-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="tr2-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-tr2");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Идея: соединить транзисторы вместе",
          subtitle: "Один транзистор — просто переключатель. Несколько соединённых — это уже логика",
          scene: `
            <rect x="60" y="200" width="380" height="240" class="box-blue"/>
            <text x="250" y="240" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Один транзистор</text>

            <rect x="170" y="270" width="160" height="120" class="box-blue"/>
            <text x="250" y="335" text-anchor="middle" class="text" font-size="28" font-weight="800" fill="#3576C0">⊕</text>

            <text x="250" y="420" text-anchor="middle" class="small">просто «открыт/закрыт»</text>

            <text x="480" y="320" text-anchor="middle" font-size="36" font-weight="800" fill="#5E5850">→</text>

            <rect x="520" y="200" width="380" height="240" class="box-green"/>
            <text x="710" y="240" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Несколько транзисторов</text>

            <rect x="580" y="270" width="80" height="50" class="box-green"/>
            <text x="620" y="300" text-anchor="middle" class="small" fill="#73B222">⊕</text>
            <rect x="680" y="270" width="80" height="50" class="box-green"/>
            <text x="720" y="300" text-anchor="middle" class="small" fill="#73B222">⊕</text>
            <rect x="780" y="270" width="80" height="50" class="box-green"/>
            <text x="820" y="300" text-anchor="middle" class="small" fill="#73B222">⊕</text>
            <rect x="630" y="340" width="80" height="50" class="box-green"/>
            <text x="670" y="370" text-anchor="middle" class="small" fill="#73B222">⊕</text>
            <rect x="730" y="340" width="80" height="50" class="box-green"/>
            <text x="770" y="370" text-anchor="middle" class="small" fill="#73B222">⊕</text>

            <text x="710" y="420" text-anchor="middle" class="small">умеют принимать решения</text>

            <text x="480" y="510" text-anchor="middle" class="text">Такие комбинации называют логическими вентилями (gates)</text>
            <text x="480" y="535" text-anchor="middle" class="small">Базовых вентилей всего три: NOT, AND, OR</text>
          `
        },
        {
          title: "Шаг 2. NOT — переворачивает значение",
          subtitle: "Если на входе 1 — на выходе 0. И наоборот",
          scene: `
            <text x="480" y="155" text-anchor="middle" class="text" font-weight="700">NOT — «инвертор», самый простой вентиль</text>

            <rect x="80" y="200" width="400" height="240" class="box-blue"/>
            <text x="280" y="240" text-anchor="middle" class="small" fill="#3576C0">схема</text>

            <line x1="120" y1="320" x2="180" y2="320" stroke="#3576C0" stroke-width="3" marker-end="url(#tr2-arrowGray)"/>
            <text x="100" y="325" text-anchor="end" class="text" font-weight="700">A</text>

            <polygon points="200,280 200,360 280,320" fill="#ffffff" stroke="#3576C0" stroke-width="2"/>
            <circle cx="290" cy="320" r="8" fill="#ffffff" stroke="#3576C0" stroke-width="2"/>

            <line x1="298" y1="320" x2="400" y2="320" stroke="#3576C0" stroke-width="3" marker-end="url(#tr2-arrowGray)"/>
            <text x="420" y="325" class="text" font-weight="700">не A</text>

            <text x="240" y="400" text-anchor="middle" class="small">кружок = инверсия</text>

            <rect x="520" y="200" width="380" height="240" class="box-yellow"/>
            <text x="710" y="235" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Таблица истинности</text>

            <line x1="540" y1="250" x2="880" y2="250" stroke="#e0e0e0" stroke-width="1"/>
            <text x="600" y="275" class="text">A</text>
            <text x="800" y="275" text-anchor="middle" class="text">не A</text>
            <line x1="540" y1="285" x2="880" y2="285" stroke="#e0e0e0" stroke-width="1"/>

            <text x="600" y="320" class="mono" font-size="18" fill="#C30B0A">0</text>
            <text x="800" y="320" text-anchor="middle" class="mono" font-size="18" fill="#73B222">1</text>

            <text x="600" y="365" class="mono" font-size="18" fill="#73B222">1</text>
            <text x="800" y="365" text-anchor="middle" class="mono" font-size="18" fill="#C30B0A">0</text>

            <text x="710" y="415" text-anchor="middle" class="small">всегда переворачивает</text>

            <text x="480" y="540" text-anchor="middle" class="small">Делается всего из 2 транзисторов</text>
          `
        },
        {
          title: "Шаг 3. AND — «И»: оба входа должны быть 1",
          subtitle: "Как два выключателя последовательно — лампочка горит только когда оба нажаты",
          scene: `
            <rect x="80" y="170" width="400" height="270" class="box-blue"/>
            <text x="280" y="200" text-anchor="middle" class="small" fill="#3576C0">схема AND</text>

            <line x1="100" y1="280" x2="180" y2="280" stroke="#3576C0" stroke-width="3"/>
            <text x="90" y="285" text-anchor="end" class="text" font-weight="700">A</text>

            <line x1="100" y1="350" x2="180" y2="350" stroke="#3576C0" stroke-width="3"/>
            <text x="90" y="355" text-anchor="end" class="text" font-weight="700">B</text>

            <path d="M 180,240 L 240,240 A 80 80 0 0 1 240,390 L 180,390 Z" fill="#ffffff" stroke="#3576C0" stroke-width="2"/>
            <text x="240" y="320" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">AND</text>

            <line x1="320" y1="315" x2="400" y2="315" stroke="#3576C0" stroke-width="3" marker-end="url(#tr2-arrowGray)"/>
            <text x="415" y="320" class="text" font-weight="700">Y</text>

            <rect x="520" y="170" width="380" height="270" class="box-yellow"/>
            <text x="710" y="200" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Y = 1 только если A=1 И B=1</text>

            <text x="570" y="240" class="text">A</text>
            <text x="640" y="240" class="text">B</text>
            <text x="800" y="240" text-anchor="middle" class="text">Y</text>
            <line x1="540" y1="250" x2="880" y2="250" stroke="#e0e0e0" stroke-width="1"/>

            <text x="570" y="280" class="mono" fill="#C30B0A">0</text>
            <text x="640" y="280" class="mono" fill="#C30B0A">0</text>
            <text x="800" y="280" text-anchor="middle" class="mono" fill="#C30B0A">0</text>

            <text x="570" y="310" class="mono" fill="#C30B0A">0</text>
            <text x="640" y="310" class="mono" fill="#73B222">1</text>
            <text x="800" y="310" text-anchor="middle" class="mono" fill="#C30B0A">0</text>

            <text x="570" y="340" class="mono" fill="#73B222">1</text>
            <text x="640" y="340" class="mono" fill="#C30B0A">0</text>
            <text x="800" y="340" text-anchor="middle" class="mono" fill="#C30B0A">0</text>

            <text x="570" y="370" class="mono" fill="#73B222">1</text>
            <text x="640" y="370" class="mono" fill="#73B222">1</text>
            <text x="800" y="370" text-anchor="middle" class="mono" fill="#73B222" font-weight="700">1</text>

            <text x="710" y="415" text-anchor="middle" class="small">единица только в одной строке из четырёх</text>

            <text x="480" y="545" text-anchor="middle" class="small">Аналогия: «открыто, если ключ А И ключ B повёрнуты»</text>
          `
        },
        {
          title: "Шаг 4. OR — «ИЛИ»: достаточно одного входа",
          subtitle: "Как два выключателя параллельно — хотя бы один нажат → лампочка горит",
          scene: `
            <rect x="80" y="170" width="400" height="270" class="box-blue"/>
            <text x="280" y="200" text-anchor="middle" class="small" fill="#3576C0">схема OR</text>

            <line x1="100" y1="280" x2="200" y2="280" stroke="#3576C0" stroke-width="3"/>
            <text x="90" y="285" text-anchor="end" class="text" font-weight="700">A</text>

            <line x1="100" y1="350" x2="200" y2="350" stroke="#3576C0" stroke-width="3"/>
            <text x="90" y="355" text-anchor="end" class="text" font-weight="700">B</text>

            <path d="M 195,240 Q 240,315 195,390 Q 250,390 320,315 Q 250,240 195,240 Z" fill="#ffffff" stroke="#3576C0" stroke-width="2"/>
            <text x="240" y="320" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">OR</text>

            <line x1="320" y1="315" x2="400" y2="315" stroke="#3576C0" stroke-width="3" marker-end="url(#tr2-arrowGray)"/>
            <text x="415" y="320" class="text" font-weight="700">Y</text>

            <rect x="520" y="170" width="380" height="270" class="box-yellow"/>
            <text x="710" y="200" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Y = 1 если A=1 ИЛИ B=1</text>

            <text x="570" y="240" class="text">A</text>
            <text x="640" y="240" class="text">B</text>
            <text x="800" y="240" text-anchor="middle" class="text">Y</text>
            <line x1="540" y1="250" x2="880" y2="250" stroke="#e0e0e0" stroke-width="1"/>

            <text x="570" y="280" class="mono" fill="#C30B0A">0</text>
            <text x="640" y="280" class="mono" fill="#C30B0A">0</text>
            <text x="800" y="280" text-anchor="middle" class="mono" fill="#C30B0A">0</text>

            <text x="570" y="310" class="mono" fill="#C30B0A">0</text>
            <text x="640" y="310" class="mono" fill="#73B222">1</text>
            <text x="800" y="310" text-anchor="middle" class="mono" fill="#73B222" font-weight="700">1</text>

            <text x="570" y="340" class="mono" fill="#73B222">1</text>
            <text x="640" y="340" class="mono" fill="#C30B0A">0</text>
            <text x="800" y="340" text-anchor="middle" class="mono" fill="#73B222" font-weight="700">1</text>

            <text x="570" y="370" class="mono" fill="#73B222">1</text>
            <text x="640" y="370" class="mono" fill="#73B222">1</text>
            <text x="800" y="370" text-anchor="middle" class="mono" fill="#73B222" font-weight="700">1</text>

            <text x="710" y="415" text-anchor="middle" class="small">ноль только когда оба входа ноль</text>

            <text x="480" y="545" text-anchor="middle" class="small">Аналогия: «свет включится, если щёлкнуть выключатель у двери ИЛИ у кровати»</text>
          `
        },
        {
          title: "Шаг 5. Из трёх вентилей — любая логика",
          subtitle: "NOT, AND, OR — этого достаточно, чтобы построить вообще всё",
          scene: `
            <rect x="60" y="170" width="280" height="100" class="box-blue"/>
            <text x="200" y="210" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">NOT</text>
            <text x="200" y="240" text-anchor="middle" class="small">2 транзистора</text>

            <rect x="340" y="170" width="280" height="100" class="box-blue"/>
            <text x="480" y="210" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">AND</text>
            <text x="480" y="240" text-anchor="middle" class="small">6 транзисторов</text>

            <rect x="620" y="170" width="280" height="100" class="box-blue"/>
            <text x="760" y="210" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">OR</text>
            <text x="760" y="240" text-anchor="middle" class="small">6 транзисторов</text>

            <line x1="480" y1="285" x2="480" y2="320" stroke="#5E5850" stroke-width="2" marker-end="url(#tr2-arrowGray)"/>
            <text x="495" y="307" class="small">комбинируем</text>

            <rect x="120" y="335" width="720" height="200" class="box-yellow"/>
            <text x="480" y="370" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Можно собрать что угодно</text>

            <text x="150" y="410" class="small">• XOR (исключающее ИЛИ) = (A OR B) AND NOT(A AND B)</text>
            <text x="150" y="438" class="small">• сумматор — складывает два бита</text>
            <text x="150" y="466" class="small">• триггер — запоминает 1 бит (это и есть ячейка памяти!)</text>
            <text x="150" y="494" class="small">• мультиплексор, дешифратор, счётчик…</text>
            <text x="150" y="520" class="small">• в итоге — весь процессор</text>
          `
        },
        {
          title: "Шаг 6. Пример: складываем два бита",
          subtitle: "Полусумматор (half-adder) — из XOR и AND. Складывает A + B",
          scene: `
            <rect x="80" y="170" width="800" height="260" class="box-blue"/>
            <text x="100" y="200" class="small" fill="#3576C0">схема полусумматора</text>

            <line x1="120" y1="260" x2="280" y2="260" stroke="#3576C0" stroke-width="3"/>
            <text x="110" y="265" text-anchor="end" class="text" font-weight="700">A</text>

            <line x1="120" y1="340" x2="280" y2="340" stroke="#3576C0" stroke-width="3"/>
            <text x="110" y="345" text-anchor="end" class="text" font-weight="700">B</text>

            <line x1="200" y1="260" x2="200" y2="380" stroke="#3576C0" stroke-width="2"/>
            <line x1="240" y1="340" x2="240" y2="380" stroke="#3576C0" stroke-width="2"/>

            <rect x="280" y="220" width="140" height="80" class="box-yellow"/>
            <text x="350" y="255" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">XOR</text>
            <text x="350" y="285" text-anchor="middle" class="small">«ровно один»</text>

            <rect x="280" y="360" width="140" height="80" class="box-yellow"/>
            <text x="350" y="395" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">AND</text>
            <text x="350" y="425" text-anchor="middle" class="small">«оба»</text>

            <line x1="420" y1="260" x2="600" y2="260" stroke="#3576C0" stroke-width="3" marker-end="url(#tr2-arrowGray)"/>
            <text x="640" y="265" class="text" font-weight="700" fill="#73B222">Сумма</text>
            <text x="640" y="287" class="small">младший бит</text>

            <line x1="420" y1="400" x2="600" y2="400" stroke="#3576C0" stroke-width="3" marker-end="url(#tr2-arrowGray)"/>
            <text x="640" y="405" class="text" font-weight="700" fill="#73B222">Перенос</text>
            <text x="640" y="427" class="small">старший бит</text>

            <text x="480" y="480" text-anchor="middle" class="text">A=1, B=1  →  XOR даёт 0, AND даёт 1  →  результат «10» (это двоичное 2!)</text>
            <text x="480" y="510" text-anchor="middle" class="text">1 + 1 = 2 — посчитано без всяких чисел, одним только потоком тока через вентили</text>
          `
        },
        {
          title: "Шаг 7. Что мы только что построили",
          subtitle: "Транзисторы → вентили → сумматор — это уже зачатки арифметики CPU",
          scene: `
            <rect x="60" y="180" width="200" height="80" class="box-blue"/>
            <text x="160" y="220" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Транзистор</text>
            <text x="160" y="245" text-anchor="middle" class="small">просто переключатель</text>

            <text x="280" y="225" text-anchor="middle" font-size="20" fill="#5E5850">→</text>

            <rect x="300" y="180" width="200" height="80" class="box-yellow"/>
            <text x="400" y="220" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Вентиль</text>
            <text x="400" y="245" text-anchor="middle" class="small">NOT · AND · OR · XOR</text>

            <text x="520" y="225" text-anchor="middle" font-size="20" fill="#5E5850">→</text>

            <rect x="540" y="180" width="200" height="80" class="box-yellow"/>
            <text x="640" y="220" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Сумматор</text>
            <text x="640" y="245" text-anchor="middle" class="small">складывает числа</text>

            <text x="760" y="225" text-anchor="middle" font-size="20" fill="#5E5850">→</text>

            <rect x="780" y="180" width="140" height="80" class="box-green"/>
            <text x="850" y="220" text-anchor="middle" class="text" font-weight="700" fill="#73B222">ALU</text>
            <text x="850" y="245" text-anchor="middle" class="small">вся арифметика</text>

            <rect x="180" y="320" width="600" height="200" class="box-green"/>
            <text x="480" y="358" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Невероятно, но факт</text>
            <text x="480" y="392" text-anchor="middle" class="small">Когда вы складываете два числа в Python (a + b),</text>
            <text x="480" y="414" text-anchor="middle" class="small">внутри CPU миллионы транзисторов открываются и закрываются,</text>
            <text x="480" y="436" text-anchor="middle" class="small">пропуская или останавливая ток —</text>
            <text x="480" y="470" text-anchor="middle" class="text" font-weight="700">и из этой пляски тока получается результат</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("tr2-title").textContent = step.title;
        $("tr2-subtitle").textContent = step.subtitle;
        $("tr2-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("tr2-scene").innerHTML = step.scene;
        $("tr2-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("tr2-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("tr2-nextBtn").addEventListener("click", nextStep);
      $("tr2-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Маленький факт, который меня в своё время поразил: когда вы пишете <code>a + b</code> в Python, в недрах процессора миллионы транзисторов открываются и закрываются. И вся эта пляска тока даёт вам результат сложения. Не магия — чистая электроника.

Но погоди. Мы только что говорили, что транзисторы оперируют нулями и единицами. А я хочу хранить число 305, написать слово «привет» и показать фото кота. Где здесь нули и единицы? Как из лампочек получаются настоящие данные?

---

## Часть 5. Как ток превращается в числа

Самое крошечное, что компьютер умеет хранить — это «есть ток / нет тока». Один транзистор, две лампочки на двери: горит — значит «да», не горит — значит «нет». Но мы хотим хранить миллион. Шестьсот сорок два. Минус восемнадцать. Это как?

Хитрость в том, что несколько лампочек, поставленные в ряд, могут вместе обозначить любое число. Точно так же, как мы записываем число «305» тремя цифрами — компьютер записывает любое число несколькими битами.

<figure class="embedded-interactive" id="section-viz-bin">
  <div class="interactive-meta">Интерактив 5</div>
  <h3>От лампочек до чисел: что такое двоичная система</h3>
  <p class="interactive-desc">7 шагов: одна лампочка = бит → 2 числа → 2 лампочки = 4 числа → таблица степеней двойки → как читать число из лампочек → сравнение с десятичной системой → главная мысль</p>
  <div class="interactive-svg-wrap">
<svg id="viz-bin" viewBox="0 0 960 680" width="100%" role="img" aria-label="Двоичная система через лампочки">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 16px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                          text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                    text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="bin-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>

    <symbol id="bulb-on" viewBox="0 0 100 130">
      <g stroke="#C29E08" stroke-width="2" stroke-linecap="round">
        <line x1="50" y1="5" x2="50" y2="20"/>
        <line x1="20" y1="25" x2="30" y2="35"/>
        <line x1="80" y1="25" x2="70" y2="35"/>
        <line x1="10" y1="55" x2="22" y2="55"/>
        <line x1="90" y1="55" x2="78" y2="55"/>
        <line x1="20" y1="85" x2="30" y2="75"/>
        <line x1="80" y1="85" x2="70" y2="75"/>
      </g>
      <path d="M 50 25 Q 25 25 25 55 Q 25 80 40 95 L 60 95 Q 75 80 75 55 Q 75 25 50 25 Z" fill="#FFD93D" stroke="#C29E08" stroke-width="2"/>
      <rect x="38" y="95" width="24" height="6" fill="#1a3a5c"/>
      <rect x="40" y="103" width="20" height="4" fill="#1a3a5c"/>
      <rect x="42" y="110" width="16" height="4" fill="#1a3a5c"/>
      <polygon points="46,116 54,116 50,123" fill="#1a3a5c"/>
    </symbol>

    <symbol id="bulb-off" viewBox="0 0 100 130">
      <g stroke="#ffffff" stroke-width="2" stroke-linecap="round">
        <line x1="50" y1="5" x2="50" y2="20"/>
        <line x1="20" y1="25" x2="30" y2="35"/>
        <line x1="80" y1="25" x2="70" y2="35"/>
        <line x1="10" y1="55" x2="22" y2="55"/>
        <line x1="90" y1="55" x2="78" y2="55"/>
        <line x1="20" y1="85" x2="30" y2="75"/>
        <line x1="80" y1="85" x2="70" y2="75"/>
      </g>
      <path d="M 50 25 Q 25 25 25 55 Q 25 80 40 95 L 60 95 Q 75 80 75 55 Q 75 25 50 25 Z" fill="none" stroke="#5E5850" stroke-width="2.5"/>
      <rect x="38" y="95" width="24" height="6" fill="#1a3a5c"/>
      <rect x="40" y="103" width="20" height="4" fill="#1a3a5c"/>
      <rect x="42" y="110" width="16" height="4" fill="#1a3a5c"/>
      <polygon points="46,116 54,116 50,123" fill="#1a3a5c"/>
    </symbol>
  </defs>

  <text id="bin-title" x="36" y="48" class="title"></text>
  <text id="bin-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="bin-scene"></g>

  <text id="bin-counter" x="36" y="635" class="text"></text>

  <g id="bin-prevGroup">
    <rect id="bin-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="bin-nextGroup">
    <rect id="bin-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="bin-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-bin");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Транзистор — это «лампочка»",
          subtitle: "Каждый транзистор всегда в одном из двух состояний: ток есть или тока нет",
          scene: `
            <rect x="60" y="170" width="400" height="340" class="box-red"/>
            <text x="260" y="210" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">Тока нет</text>

            <use href="#bulb-off" x="180" y="250" width="160" height="208"/>

            <rect x="160" y="475" width="200" height="25" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1" rx="4"/>
            <text x="260" y="493" text-anchor="middle" class="mono" font-weight="700" fill="#C30B0A">0</text>

            <rect x="500" y="170" width="400" height="340" class="box-green"/>
            <text x="700" y="210" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Ток есть</text>

            <use href="#bulb-on" x="620" y="250" width="160" height="208"/>

            <rect x="600" y="475" width="200" height="25" fill="#F0FAF0" stroke="#73B222" stroke-width="1" rx="4"/>
            <text x="700" y="493" text-anchor="middle" class="mono" font-weight="700" fill="#73B222">1</text>

            <text x="480" y="555" text-anchor="middle" class="text">Это и есть бит — одно из двух возможных состояний</text>
          `
        },
        {
          title: "Шаг 2. Одной лампочкой можно записать только 2 числа",
          subtitle: "Не густо — нужно больше",
          scene: `
            <rect x="180" y="180" width="600" height="280" class="box-blue"/>
            <text x="480" y="215" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">1 лампочка = 1 бит = 2 варианта</text>

            <use href="#bulb-off" x="290" y="250" width="120" height="156"/>
            <text x="350" y="430" text-anchor="middle" class="mono" font-weight="700" fill="#C30B0A">0</text>

            <text x="480" y="345" text-anchor="middle" font-size="36" font-weight="800" fill="#5E5850">или</text>

            <use href="#bulb-on" x="550" y="250" width="120" height="156"/>
            <text x="610" y="430" text-anchor="middle" class="mono" font-weight="700" fill="#73B222">1</text>

            <text x="480" y="510" text-anchor="middle" class="text">Только два числа: 0 и 1</text>
            <text x="480" y="540" text-anchor="middle" class="small">А как записать 2? 3? 100? 1 000 000? Нужно больше лампочек</text>
          `
        },
        {
          title: "Шаг 3. Две лампочки — уже 4 числа",
          subtitle: "Каждая комбинация — отдельное число",
          scene: `
            <rect x="60" y="170" width="840" height="320" class="box-blue"/>
            <text x="480" y="205" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">2 лампочки = 2 бита = 4 варианта</text>

            <g transform="translate(80, 230)">
              <use href="#bulb-off" x="0" y="0" width="80" height="104"/>
              <use href="#bulb-off" x="80" y="0" width="80" height="104"/>
              <text x="80" y="135" text-anchor="middle" class="mono">0 0</text>
              <text x="80" y="170" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">0</text>
            </g>

            <g transform="translate(290, 230)">
              <use href="#bulb-off" x="0" y="0" width="80" height="104"/>
              <use href="#bulb-on" x="80" y="0" width="80" height="104"/>
              <text x="80" y="135" text-anchor="middle" class="mono">0 1</text>
              <text x="80" y="170" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">1</text>
            </g>

            <g transform="translate(500, 230)">
              <use href="#bulb-on" x="0" y="0" width="80" height="104"/>
              <use href="#bulb-off" x="80" y="0" width="80" height="104"/>
              <text x="80" y="135" text-anchor="middle" class="mono">1 0</text>
              <text x="80" y="170" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">2</text>
            </g>

            <g transform="translate(710, 230)">
              <use href="#bulb-on" x="0" y="0" width="80" height="104"/>
              <use href="#bulb-on" x="80" y="0" width="80" height="104"/>
              <text x="80" y="135" text-anchor="middle" class="mono">1 1</text>
              <text x="80" y="170" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">3</text>
            </g>

            <text x="480" y="540" text-anchor="middle" class="text">Каждая лампочка удваивает количество вариантов</text>
            <text x="480" y="565" text-anchor="middle" class="small">2 → 4 → 8 → 16 → 32 → …</text>
          `
        },
        {
          title: "Шаг 4. 3 лампочки = 8 чисел, 4 = 16, и так далее",
          subtitle: "Удвоение на каждой добавленной лампочке — это степени двойки",
          scene: `
            <text x="480" y="155" text-anchor="middle" class="text" font-weight="700">Сколько чисел можно записать N лампочками</text>

            <rect x="100" y="190" width="180" height="80" class="box-blue"/>
            <text x="190" y="218" text-anchor="middle" class="small">1 лампочка</text>
            <text x="190" y="252" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">2¹ = 2 числа</text>

            <rect x="300" y="190" width="180" height="80" class="box-blue"/>
            <text x="390" y="218" text-anchor="middle" class="small">2 лампочки</text>
            <text x="390" y="252" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">2² = 4 числа</text>

            <rect x="500" y="190" width="180" height="80" class="box-blue"/>
            <text x="590" y="218" text-anchor="middle" class="small">3 лампочки</text>
            <text x="590" y="252" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">2³ = 8 чисел</text>

            <rect x="700" y="190" width="180" height="80" class="box-blue"/>
            <text x="790" y="218" text-anchor="middle" class="small">4 лампочки</text>
            <text x="790" y="252" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">2⁴ = 16 чисел</text>

            <rect x="100" y="300" width="180" height="80" class="box-yellow"/>
            <text x="190" y="328" text-anchor="middle" class="small">8 лампочек</text>
            <text x="190" y="362" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">2⁸ = 256</text>

            <rect x="300" y="300" width="180" height="80" class="box-yellow"/>
            <text x="390" y="328" text-anchor="middle" class="small">16 лампочек</text>
            <text x="390" y="362" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">2¹⁶ = 65 536</text>

            <rect x="500" y="300" width="180" height="80" class="box-green"/>
            <text x="590" y="328" text-anchor="middle" class="small">32 лампочки</text>
            <text x="590" y="362" text-anchor="middle" class="text" font-weight="700" fill="#73B222">~4 млрд</text>

            <rect x="700" y="300" width="180" height="80" class="box-green"/>
            <text x="790" y="328" text-anchor="middle" class="small">64 лампочки</text>
            <text x="790" y="362" text-anchor="middle" class="text" font-weight="700" fill="#73B222">~10¹⁹</text>

            <rect x="180" y="420" width="600" height="120" class="box-yellow"/>
            <text x="480" y="455" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">8 битов получили специальное имя — байт</text>
            <text x="480" y="485" text-anchor="middle" class="small">1 байт = 8 битов = число от 0 до 255</text>
            <text x="480" y="510" text-anchor="middle" class="small">этого хватает на одну букву или один оттенок цвета</text>
          `
        },
        {
          title: "Шаг 5. Как читать число из лампочек",
          subtitle: "Каждая позиция — степень двойки. Складываем включённые",
          scene: `
            <text x="480" y="150" text-anchor="middle" class="text" font-weight="700">Пример: 8 лампочек показывают число 53</text>

            <g transform="translate(120, 195)">
              <use href="#bulb-off" x="0" y="0" width="80" height="104"/>
              <text x="40" y="125" text-anchor="middle" class="mono" fill="#C30B0A">0</text>
              <text x="40" y="155" text-anchor="middle" class="small">128</text>
            </g>
            <g transform="translate(220, 195)">
              <use href="#bulb-off" x="0" y="0" width="80" height="104"/>
              <text x="40" y="125" text-anchor="middle" class="mono" fill="#C30B0A">0</text>
              <text x="40" y="155" text-anchor="middle" class="small">64</text>
            </g>
            <g transform="translate(320, 195)">
              <use href="#bulb-on" x="0" y="0" width="80" height="104"/>
              <text x="40" y="125" text-anchor="middle" class="mono" fill="#73B222" font-weight="700">1</text>
              <text x="40" y="155" text-anchor="middle" class="small" fill="#C29E08" font-weight="700">32</text>
            </g>
            <g transform="translate(420, 195)">
              <use href="#bulb-on" x="0" y="0" width="80" height="104"/>
              <text x="40" y="125" text-anchor="middle" class="mono" fill="#73B222" font-weight="700">1</text>
              <text x="40" y="155" text-anchor="middle" class="small" fill="#C29E08" font-weight="700">16</text>
            </g>
            <g transform="translate(520, 195)">
              <use href="#bulb-off" x="0" y="0" width="80" height="104"/>
              <text x="40" y="125" text-anchor="middle" class="mono" fill="#C30B0A">0</text>
              <text x="40" y="155" text-anchor="middle" class="small">8</text>
            </g>
            <g transform="translate(620, 195)">
              <use href="#bulb-on" x="0" y="0" width="80" height="104"/>
              <text x="40" y="125" text-anchor="middle" class="mono" fill="#73B222" font-weight="700">1</text>
              <text x="40" y="155" text-anchor="middle" class="small" fill="#C29E08" font-weight="700">4</text>
            </g>
            <g transform="translate(720, 195)">
              <use href="#bulb-off" x="0" y="0" width="80" height="104"/>
              <text x="40" y="125" text-anchor="middle" class="mono" fill="#C30B0A">0</text>
              <text x="40" y="155" text-anchor="middle" class="small">2</text>
            </g>
            <g transform="translate(820, 195)">
              <use href="#bulb-on" x="0" y="0" width="80" height="104"/>
              <text x="40" y="125" text-anchor="middle" class="mono" fill="#73B222" font-weight="700">1</text>
              <text x="40" y="155" text-anchor="middle" class="small" fill="#C29E08" font-weight="700">1</text>
            </g>

            <line x1="100" y1="395" x2="880" y2="395" stroke="#e0e0e0" stroke-width="1"/>

            <text x="480" y="430" text-anchor="middle" class="text">складываем только те позиции, где лампочка горит:</text>
            <text x="480" y="465" text-anchor="middle" class="mono" font-size="20" fill="#C29E08" font-weight="700">32 + 16 + 4 + 1 = 53</text>

            <rect x="280" y="490" width="400" height="60" class="box-green"/>
            <text x="480" y="528" text-anchor="middle" class="text" font-weight="700" fill="#73B222">00110101₂ = 53₁₀</text>
          `
        },
        {
          title: "Шаг 6. То же самое, но в десятичной — мы делаем каждый день",
          subtitle: "В обычной системе позиции — степени десятки. В компьютере — степени двойки",
          scene: `
            <text x="480" y="150" text-anchor="middle" class="text" font-weight="700">Число 305 в привычной десятичной системе</text>

            <rect x="200" y="200" width="180" height="100" class="box-yellow"/>
            <text x="290" y="235" text-anchor="middle" class="text">сотни</text>
            <text x="290" y="270" text-anchor="middle" class="mono" font-size="32" font-weight="800" fill="#C29E08">3</text>
            <text x="290" y="293" text-anchor="middle" class="small">× 100</text>

            <rect x="390" y="200" width="180" height="100" class="box-yellow"/>
            <text x="480" y="235" text-anchor="middle" class="text">десятки</text>
            <text x="480" y="270" text-anchor="middle" class="mono" font-size="32" font-weight="800" fill="#C29E08">0</text>
            <text x="480" y="293" text-anchor="middle" class="small">× 10</text>

            <rect x="580" y="200" width="180" height="100" class="box-yellow"/>
            <text x="670" y="235" text-anchor="middle" class="text">единицы</text>
            <text x="670" y="270" text-anchor="middle" class="mono" font-size="32" font-weight="800" fill="#C29E08">5</text>
            <text x="670" y="293" text-anchor="middle" class="small">× 1</text>

            <text x="480" y="345" text-anchor="middle" class="mono" font-size="18" fill="#C29E08">300 + 0 + 5 = 305</text>

            <text x="480" y="410" text-anchor="middle" class="text">У компьютера 2 лампочки вместо 10 пальцев,</text>
            <text x="480" y="435" text-anchor="middle" class="text">поэтому он считает не десятками, а двойками</text>

            <text x="480" y="495" text-anchor="middle" class="small">десятичная: 10⁰=1, 10¹=10, 10²=100, 10³=1000…</text>
            <text x="480" y="520" text-anchor="middle" class="small">двоичная:    2⁰=1, 2¹=2,  2²=4,  2³=8,  2⁴=16…</text>
          `
        },
        {
          title: "Шаг 7. Любое число — это лампочки",
          subtitle: "Так компьютер хранит, передаёт и считает с любым числом",
          scene: `
            <rect x="80" y="170" width="800" height="120" class="box-yellow"/>
            <text x="100" y="200" class="small" fill="#C29E08">примеры: байт = 8 битов</text>

            <text x="100" y="235" class="mono">7</text>
            <text x="180" y="235" class="mono" fill="#C29E08">= 00000111₂</text>
            <text x="350" y="235" class="small" fill="#5E5850">(4 + 2 + 1)</text>

            <text x="100" y="265" class="mono">42</text>
            <text x="180" y="265" class="mono" fill="#C29E08">= 00101010₂</text>
            <text x="350" y="265" class="small" fill="#5E5850">(32 + 8 + 2)</text>

            <text x="510" y="235" class="mono">128</text>
            <text x="610" y="235" class="mono" fill="#C29E08">= 10000000₂</text>
            <text x="780" y="235" class="small" fill="#5E5850">(только 128)</text>

            <text x="510" y="265" class="mono">255</text>
            <text x="610" y="265" class="mono" fill="#C29E08">= 11111111₂</text>
            <text x="780" y="265" class="small" fill="#5E5850">(все восемь)</text>

            <rect x="80" y="320" width="800" height="220" class="box-green"/>
            <text x="480" y="355" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Главная мысль</text>
            <text x="480" y="390" text-anchor="middle" class="small">Каждый транзистор внутри CPU и RAM — это одна «лампочка»</text>
            <text x="480" y="415" text-anchor="middle" class="small">Группа транзисторов хранит число в двоичной форме</text>
            <text x="480" y="450" text-anchor="middle" class="small">CPU умеет складывать, сравнивать, передвигать эти числа</text>
            <text x="480" y="490" text-anchor="middle" class="text" font-weight="700">Значит, всё что нужно — научиться кодировать данные числами</text>
            <text x="480" y="515" text-anchor="middle" class="small">текст, картинки, звук — все они должны превратиться в числа</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("bin-title").textContent = step.title;
        $("bin-subtitle").textContent = step.subtitle;
        $("bin-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("bin-scene").innerHTML = step.scene;
        $("bin-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("bin-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("bin-nextBtn").addEventListener("click", nextStep);
      $("bin-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Теперь мы умеем хранить числа. Но компьютер показывает буквы. И картинки. И видео. Как же эти штуки превращаются в числа?

---

## Часть 6. Как кодируются текст и картинки

Решение оказалось простым и красивым: <strong>всё на свете можно превратить в числа</strong>, если заранее договориться о правилах. Это называется кодированием.

Букве <code>A</code> присваиваем число 65. Букве <code>B</code> — 66. И так весь алфавит. Цвет красный — это три числа: 255 для красного, 0 для зелёного, 0 для синего. Каждый пиксель — три числа. Картинка — миллионы пикселей. И всё это уже умеет компьютер.

<figure class="embedded-interactive" id="section-viz-enc">
  <div class="interactive-meta">Интерактив 6</div>
  <h3>Как кодируются текст и картинки</h3>
  <p class="interactive-desc">8 шагов: проблема (CPU понимает только числа) → буква = номер → таблица ASCII → пример «Hi!» в битах → картинка = сетка пикселей → пиксель = RGB → фото = огромный список чисел → звук, видео, программы — тоже числа</p>
  <div class="interactive-svg-wrap">
<svg id="viz-enc" viewBox="0 0 960 680" width="100%" role="img" aria-label="Кодирование текста и изображений">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                          text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                    text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="enc-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text id="enc-title" x="36" y="48" class="title"></text>
  <text id="enc-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="enc-scene"></g>

  <text id="enc-counter" x="36" y="635" class="text"></text>

  <g id="enc-prevGroup">
    <rect id="enc-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="enc-nextGroup">
    <rect id="enc-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="enc-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-enc");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Проблема: CPU понимает только числа",
          subtitle: "А мы хотим хранить буквы, картинки, музыку. Как быть?",
          scene: `
            <rect x="60" y="200" width="380" height="240" class="box-blue"/>
            <text x="250" y="240" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Что хочет человек</text>

            <rect x="120" y="270" width="240" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="240" y="295" text-anchor="middle" class="text">«Привет, мир!»</text>

            <rect x="120" y="320" width="240" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="240" y="345" text-anchor="middle" class="small">фото с котиком</text>

            <rect x="120" y="370" width="240" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="240" y="395" text-anchor="middle" class="small">любимая песня</text>

            <text x="480" y="335" text-anchor="middle" font-size="40" font-weight="800" fill="#C30B0A">≠</text>

            <rect x="520" y="200" width="380" height="240" class="box-yellow"/>
            <text x="710" y="240" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Что понимает CPU</text>

            <text x="710" y="295" text-anchor="middle" class="mono">10110000 01100001</text>
            <text x="710" y="320" text-anchor="middle" class="mono">11010010 00010100</text>
            <text x="710" y="345" text-anchor="middle" class="mono">01010111 11000011</text>
            <text x="710" y="380" text-anchor="middle" class="small">только числа в двоичном виде</text>

            <text x="480" y="495" text-anchor="middle" class="text">Решение: договориться, какое число будет обозначать «А», какое «Б», какое цвет красный…</text>
            <text x="480" y="525" text-anchor="middle" class="small">Это и есть кодирование</text>
          `
        },
        {
          title: "Шаг 2. Буквы — каждой свой номер",
          subtitle: "Самый простой способ: пронумеровать алфавит и хранить эти номера",
          scene: `
            <rect x="180" y="170" width="600" height="380" class="box-yellow"/>
            <text x="480" y="205" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Простейшая идея — таблица соответствий</text>

            <line x1="220" y1="230" x2="740" y2="230" stroke="#e0e0e0" stroke-width="1"/>

            <text x="280" y="265" class="text" font-weight="700">буква</text>
            <text x="500" y="265" text-anchor="middle" class="text" font-weight="700">→</text>
            <text x="640" y="265" text-anchor="middle" class="text" font-weight="700">число</text>

            <line x1="220" y1="280" x2="740" y2="280" stroke="#e0e0e0" stroke-width="1"/>

            <text x="280" y="315" class="mono" font-size="20">A</text>
            <text x="500" y="315" text-anchor="middle" class="text">→</text>
            <text x="640" y="315" text-anchor="middle" class="mono" fill="#C29E08">65</text>

            <text x="280" y="345" class="mono" font-size="20">B</text>
            <text x="500" y="345" text-anchor="middle" class="text">→</text>
            <text x="640" y="345" text-anchor="middle" class="mono" fill="#C29E08">66</text>

            <text x="280" y="375" class="mono" font-size="20">C</text>
            <text x="500" y="375" text-anchor="middle" class="text">→</text>
            <text x="640" y="375" text-anchor="middle" class="mono" fill="#C29E08">67</text>

            <text x="280" y="410" class="text" fill="#5E5850">…</text>

            <text x="280" y="445" class="mono" font-size="20">!</text>
            <text x="500" y="445" text-anchor="middle" class="text">→</text>
            <text x="640" y="445" text-anchor="middle" class="mono" fill="#C29E08">33</text>

            <text x="280" y="475" class="mono" font-size="20">пробел</text>
            <text x="500" y="475" text-anchor="middle" class="text">→</text>
            <text x="640" y="475" text-anchor="middle" class="mono" fill="#C29E08">32</text>

            <text x="280" y="505" class="mono" font-size="20">1</text>
            <text x="500" y="505" text-anchor="middle" class="text">→</text>
            <text x="640" y="505" text-anchor="middle" class="mono" fill="#C29E08">49</text>

            <text x="480" y="585" text-anchor="middle" class="text">Эта таблица существует с 1963 года и называется ASCII</text>
          `
        },
        {
          title: "Шаг 3. ASCII — стандартная таблица символов",
          subtitle: "Один байт (число от 0 до 255) кодирует один символ — буквы, цифры, знаки",
          scene: `
            <rect x="60" y="160" width="840" height="320" class="box-yellow"/>
            <text x="80" y="190" class="text" font-size="16" font-weight="700" fill="#C29E08">ASCII (American Standard Code for Information Interchange)</text>

            <text x="100" y="225" class="text" font-weight="700">0–31</text>
            <rect x="180" y="210" width="700" height="30" fill="#ffffff" stroke="#C29E08" stroke-width="1" rx="4"/>
            <text x="200" y="230" class="small">служебные коды (перенос строки, tab, конец файла…)</text>

            <text x="100" y="265" class="text" font-weight="700">32–47</text>
            <rect x="180" y="250" width="700" height="30" fill="#ffffff" stroke="#C29E08" stroke-width="1" rx="4"/>
            <text x="200" y="270" class="mono">пробел  !  "  #  $  %  &amp;  '  (  )  *  +  ,  -  .  /</text>

            <text x="100" y="305" class="text" font-weight="700">48–57</text>
            <rect x="180" y="290" width="700" height="30" fill="#F0FAF0" stroke="#73B222" stroke-width="1" rx="4"/>
            <text x="200" y="310" class="mono">цифры:  0  1  2  3  4  5  6  7  8  9</text>

            <text x="100" y="345" class="text" font-weight="700">65–90</text>
            <rect x="180" y="330" width="700" height="30" fill="#F0FAF0" stroke="#73B222" stroke-width="1" rx="4"/>
            <text x="200" y="350" class="mono">заглавные:  A  B  C  D  E  F  G  H … X  Y  Z</text>

            <text x="100" y="385" class="text" font-weight="700">97–122</text>
            <rect x="180" y="370" width="700" height="30" fill="#F0FAF0" stroke="#73B222" stroke-width="1" rx="4"/>
            <text x="200" y="390" class="mono">строчные:   a  b  c  d  e  f  g  h … x  y  z</text>

            <text x="100" y="425" class="text" font-weight="700">остальное</text>
            <rect x="180" y="410" width="700" height="30" fill="#ffffff" stroke="#C29E08" stroke-width="1" rx="4"/>
            <text x="200" y="430" class="small">знаки препинания, скобки, специальные символы</text>

            <rect x="180" y="500" width="600" height="80" class="box-blue"/>
            <text x="480" y="530" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Всего 128 символов хватило для английского</text>
            <text x="480" y="555" text-anchor="middle" class="small">Для русского, китайского, эмодзи позже придумали Unicode (миллионы символов)</text>
          `
        },
        {
          title: "Шаг 4. Превращаем «Hi!» в биты",
          subtitle: "Каждая буква → её код в ASCII → этот код в двоичном виде",
          scene: `
            <text x="480" y="155" text-anchor="middle" class="text" font-weight="700">Кодируем строку «Hi!»</text>

            <g transform="translate(120, 200)">
              <rect x="0" y="0" width="200" height="80" class="box-blue"/>
              <text x="100" y="50" text-anchor="middle" class="text" font-size="32" font-weight="800" fill="#3576C0">H</text>
            </g>
            <g transform="translate(380, 200)">
              <rect x="0" y="0" width="200" height="80" class="box-blue"/>
              <text x="100" y="50" text-anchor="middle" class="text" font-size="32" font-weight="800" fill="#3576C0">i</text>
            </g>
            <g transform="translate(640, 200)">
              <rect x="0" y="0" width="200" height="80" class="box-blue"/>
              <text x="100" y="50" text-anchor="middle" class="text" font-size="32" font-weight="800" fill="#3576C0">!</text>
            </g>

            <text x="220" y="310" text-anchor="middle" class="text">↓ ASCII</text>
            <text x="480" y="310" text-anchor="middle" class="text">↓ ASCII</text>
            <text x="740" y="310" text-anchor="middle" class="text">↓ ASCII</text>

            <g transform="translate(120, 330)">
              <rect x="0" y="0" width="200" height="60" class="box-yellow"/>
              <text x="100" y="38" text-anchor="middle" class="mono" font-size="20" fill="#C29E08">72</text>
            </g>
            <g transform="translate(380, 330)">
              <rect x="0" y="0" width="200" height="60" class="box-yellow"/>
              <text x="100" y="38" text-anchor="middle" class="mono" font-size="20" fill="#C29E08">105</text>
            </g>
            <g transform="translate(640, 330)">
              <rect x="0" y="0" width="200" height="60" class="box-yellow"/>
              <text x="100" y="38" text-anchor="middle" class="mono" font-size="20" fill="#C29E08">33</text>
            </g>

            <text x="220" y="415" text-anchor="middle" class="text">↓ в биты</text>
            <text x="480" y="415" text-anchor="middle" class="text">↓ в биты</text>
            <text x="740" y="415" text-anchor="middle" class="text">↓ в биты</text>

            <g transform="translate(120, 435)">
              <rect x="0" y="0" width="200" height="60" class="box-green"/>
              <text x="100" y="38" text-anchor="middle" class="mono" fill="#73B222">01001000</text>
            </g>
            <g transform="translate(380, 435)">
              <rect x="0" y="0" width="200" height="60" class="box-green"/>
              <text x="100" y="38" text-anchor="middle" class="mono" fill="#73B222">01101001</text>
            </g>
            <g transform="translate(640, 435)">
              <rect x="0" y="0" width="200" height="60" class="box-green"/>
              <text x="100" y="38" text-anchor="middle" class="mono" fill="#73B222">00100001</text>
            </g>

            <text x="480" y="555" text-anchor="middle" class="text">«Hi!» — это 3 байта = 24 бита в памяти компьютера</text>
          `
        },
        {
          title: "Шаг 5. Картинка — это сетка из пикселей",
          subtitle: "Если приблизить любое фото — увидим квадратики. Каждый квадратик и есть пиксель",
          scene: `
            <text x="480" y="150" text-anchor="middle" class="text" font-weight="700">Картинка вблизи — это просто решётка из цветных точек</text>

            <g transform="translate(280, 180)">
              <rect width="60" height="60" fill="#FFD93D"/>
              <rect x="60" width="60" height="60" fill="#FFD93D"/>
              <rect x="120" width="60" height="60" fill="#FFD93D"/>
              <rect x="180" width="60" height="60" fill="#FFD93D"/>
              <rect x="240" width="60" height="60" fill="#FFD93D"/>
              <rect x="300" width="60" height="60" fill="#FFD93D"/>

              <rect y="60" width="60" height="60" fill="#FFD93D"/>
              <rect x="60" y="60" width="60" height="60" fill="#3576C0"/>
              <rect x="120" y="60" width="60" height="60" fill="#3576C0"/>
              <rect x="180" y="60" width="60" height="60" fill="#3576C0"/>
              <rect x="240" y="60" width="60" height="60" fill="#FFD93D"/>
              <rect x="300" y="60" width="60" height="60" fill="#FFD93D"/>

              <rect y="120" width="60" height="60" fill="#FFD93D"/>
              <rect x="60" y="120" width="60" height="60" fill="#3576C0"/>
              <rect x="120" y="120" width="60" height="60" fill="#FFFFFF"/>
              <rect x="180" y="120" width="60" height="60" fill="#FFFFFF"/>
              <rect x="240" y="120" width="60" height="60" fill="#3576C0"/>
              <rect x="300" y="120" width="60" height="60" fill="#FFD93D"/>

              <rect y="180" width="60" height="60" fill="#FFD93D"/>
              <rect x="60" y="180" width="60" height="60" fill="#3576C0"/>
              <rect x="120" y="180" width="60" height="60" fill="#3576C0"/>
              <rect x="180" y="180" width="60" height="60" fill="#3576C0"/>
              <rect x="240" y="180" width="60" height="60" fill="#3576C0"/>
              <rect x="300" y="180" width="60" height="60" fill="#FFD93D"/>

              <g stroke="#5E5850" stroke-width="0.5" fill="none">
                <rect width="360" height="240"/>
                <line x1="60" y1="0" x2="60" y2="240"/>
                <line x1="120" y1="0" x2="120" y2="240"/>
                <line x1="180" y1="0" x2="180" y2="240"/>
                <line x1="240" y1="0" x2="240" y2="240"/>
                <line x1="300" y1="0" x2="300" y2="240"/>
                <line x1="0" y1="60" x2="360" y2="60"/>
                <line x1="0" y1="120" x2="360" y2="120"/>
                <line x1="0" y1="180" x2="360" y2="180"/>
              </g>
            </g>

            <text x="480" y="475" text-anchor="middle" class="text">Этот «эмоджи» — 6×4 = 24 пикселя</text>
            <text x="480" y="510" text-anchor="middle" class="small">Обычное фото в телефоне — миллионы пикселей</text>
            <text x="480" y="540" text-anchor="middle" class="text">Если научимся хранить один пиксель — сможем хранить любую картинку</text>
          `
        },
        {
          title: "Шаг 6. Каждый пиксель — три числа (RGB)",
          subtitle: "Любой цвет — смесь красного, зелёного и синего. Каждого — от 0 до 255",
          scene: `
            <text x="480" y="150" text-anchor="middle" class="text" font-weight="700">Один пиксель = три байта = три числа</text>

            <rect x="160" y="190" width="160" height="160" fill="#C30B0A" stroke="#5E5850" stroke-width="1"/>
            <text x="240" y="370" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">красный</text>
            <text x="240" y="395" text-anchor="middle" class="mono">R = 255</text>
            <text x="240" y="415" text-anchor="middle" class="mono">G = 0</text>
            <text x="240" y="435" text-anchor="middle" class="mono">B = 0</text>

            <rect x="400" y="190" width="160" height="160" fill="#73B222" stroke="#5E5850" stroke-width="1"/>
            <text x="480" y="370" text-anchor="middle" class="text" font-weight="700" fill="#73B222">зелёный</text>
            <text x="480" y="395" text-anchor="middle" class="mono">R = 0</text>
            <text x="480" y="415" text-anchor="middle" class="mono">G = 255</text>
            <text x="480" y="435" text-anchor="middle" class="mono">B = 0</text>

            <rect x="640" y="190" width="160" height="160" fill="#3576C0" stroke="#5E5850" stroke-width="1"/>
            <text x="720" y="370" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">синий</text>
            <text x="720" y="395" text-anchor="middle" class="mono">R = 0</text>
            <text x="720" y="415" text-anchor="middle" class="mono">G = 0</text>
            <text x="720" y="435" text-anchor="middle" class="mono">B = 255</text>

            <rect x="280" y="475" width="400" height="100" class="box-yellow"/>
            <text x="480" y="505" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Цвет апельсина:</text>
            <text x="480" y="535" text-anchor="middle" class="mono">R=255  G=140  B=0</text>
            <text x="480" y="560" text-anchor="middle" class="small">255·255·255 = 16 миллионов возможных цветов</text>
          `
        },
        {
          title: "Шаг 7. Фото = огромный список чисел",
          subtitle: "Фото 4000×3000 пикселей — это 4000 × 3000 × 3 = 36 миллионов чисел",
          scene: `
            <rect x="80" y="160" width="320" height="240" class="box-blue"/>
            <text x="240" y="190" text-anchor="middle" class="small" fill="#3576C0">фото</text>

            <g transform="translate(110, 210)">
              <rect width="40" height="40" fill="#FFB347"/>
              <rect x="40" width="40" height="40" fill="#FFD580"/>
              <rect x="80" width="40" height="40" fill="#5B3A29"/>
              <rect x="120" width="40" height="40" fill="#3A2517"/>
              <rect x="160" width="40" height="40" fill="#5B3A29"/>
              <rect x="200" width="40" height="40" fill="#FFD580"/>
              <rect x="240" width="40" height="40" fill="#FFB347"/>

              <rect y="40" width="40" height="40" fill="#FFD580"/>
              <rect x="40" y="40" width="40" height="40" fill="#5B3A29"/>
              <rect x="80" y="40" width="40" height="40" fill="#FFE4B5"/>
              <rect x="120" y="40" width="40" height="40" fill="#FFE4B5"/>
              <rect x="160" y="40" width="40" height="40" fill="#FFE4B5"/>
              <rect x="200" y="40" width="40" height="40" fill="#5B3A29"/>
              <rect x="240" y="40" width="40" height="40" fill="#FFD580"/>

              <rect y="80" width="40" height="40" fill="#5B3A29"/>
              <rect x="40" y="80" width="40" height="40" fill="#FFE4B5"/>
              <rect x="80" y="80" width="40" height="40" fill="#3576C0"/>
              <rect x="120" y="80" width="40" height="40" fill="#FFE4B5"/>
              <rect x="160" y="80" width="40" height="40" fill="#3576C0"/>
              <rect x="200" y="80" width="40" height="40" fill="#FFE4B5"/>
              <rect x="240" y="80" width="40" height="40" fill="#5B3A29"/>

              <rect y="120" width="40" height="40" fill="#5B3A29"/>
              <rect x="40" y="120" width="40" height="40" fill="#FFE4B5"/>
              <rect x="80" y="120" width="40" height="40" fill="#FFE4B5"/>
              <rect x="120" y="120" width="40" height="40" fill="#C30B0A"/>
              <rect x="160" y="120" width="40" height="40" fill="#FFE4B5"/>
              <rect x="200" y="120" width="40" height="40" fill="#FFE4B5"/>
              <rect x="240" y="120" width="40" height="40" fill="#5B3A29"/>
            </g>

            <text x="240" y="385" text-anchor="middle" class="small">кот, 7×4 пикселя</text>

            <line x1="410" y1="280" x2="450" y2="280" stroke="#5E5850" stroke-width="2" marker-end="url(#enc-arrowGray)"/>

            <rect x="460" y="160" width="440" height="240" class="box-yellow"/>
            <text x="680" y="190" text-anchor="middle" class="small" fill="#C29E08">в памяти компьютера</text>

            <text x="480" y="220" class="mono" font-size="11">пиксель (0,0): 255, 179,  71</text>
            <text x="480" y="240" class="mono" font-size="11">пиксель (1,0): 255, 213, 128</text>
            <text x="480" y="260" class="mono" font-size="11">пиксель (2,0):  91,  58,  41</text>
            <text x="480" y="280" class="mono" font-size="11">пиксель (3,0):  58,  37,  23</text>
            <text x="480" y="300" class="mono" font-size="11">пиксель (4,0):  91,  58,  41</text>
            <text x="480" y="320" class="mono" font-size="11">пиксель (5,0): 255, 213, 128</text>
            <text x="480" y="340" class="mono" font-size="11">пиксель (6,0): 255, 179,  71</text>
            <text x="480" y="360" class="mono" font-size="11">пиксель (0,1): 255, 213, 128</text>
            <text x="480" y="380" class="mono" font-size="11">… ещё 21 строка для остальных пикселей</text>

            <rect x="180" y="430" width="600" height="120" class="box-green"/>
            <text x="480" y="465" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Реальные размеры</text>
            <text x="480" y="495" text-anchor="middle" class="small">Фото с iPhone (4032 × 3024) = ~36 миллионов чисел = ~36 МБ</text>
            <text x="480" y="520" text-anchor="middle" class="small">Поэтому фото сжимают: JPEG, HEIC, PNG — это умные способы хранить меньше чисел</text>
          `
        },
        {
          title: "Шаг 8. Звук, видео, программы — тоже числа",
          subtitle: "Любые данные на компьютере — это просто длинная последовательность чисел",
          scene: `
            <rect x="60" y="170" width="200" height="160" class="box-blue"/>
            <text x="160" y="205" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Текст</text>
            <text x="160" y="240" text-anchor="middle" class="small">каждый символ →</text>
            <text x="160" y="260" text-anchor="middle" class="small">число по ASCII/Unicode</text>
            <text x="160" y="295" text-anchor="middle" class="mono" fill="#C29E08">72  105  33</text>

            <rect x="280" y="170" width="200" height="160" class="box-blue"/>
            <text x="380" y="205" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Картинка</text>
            <text x="380" y="240" text-anchor="middle" class="small">каждый пиксель →</text>
            <text x="380" y="260" text-anchor="middle" class="small">три числа RGB</text>
            <text x="380" y="295" text-anchor="middle" class="mono" fill="#C29E08">255  140  0</text>

            <rect x="500" y="170" width="200" height="160" class="box-blue"/>
            <text x="600" y="205" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Звук</text>
            <text x="600" y="240" text-anchor="middle" class="small">44 100 раз в секунду →</text>
            <text x="600" y="260" text-anchor="middle" class="small">громкость числом</text>
            <text x="600" y="295" text-anchor="middle" class="mono" fill="#C29E08">−12  +7  +22</text>

            <rect x="720" y="170" width="200" height="160" class="box-blue"/>
            <text x="820" y="205" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Видео</text>
            <text x="820" y="240" text-anchor="middle" class="small">30 картинок в секунду</text>
            <text x="820" y="260" text-anchor="middle" class="small">+ звук</text>
            <text x="820" y="295" text-anchor="middle" class="small">= очень много чисел</text>

            <rect x="60" y="350" width="440" height="160" class="box-yellow"/>
            <text x="280" y="385" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Программа</text>
            <text x="280" y="420" text-anchor="middle" class="small">каждая инструкция CPU —</text>
            <text x="280" y="442" text-anchor="middle" class="small">тоже число (опкод)</text>
            <text x="280" y="478" text-anchor="middle" class="mono" fill="#C29E08">10110000  01100001</text>

            <rect x="520" y="350" width="380" height="160" class="box-green"/>
            <text x="710" y="385" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Главная идея</text>
            <text x="710" y="420" text-anchor="middle" class="small">внутри компьютера нет ни текста,</text>
            <text x="710" y="442" text-anchor="middle" class="small">ни картинок, ни песен</text>
            <text x="710" y="478" text-anchor="middle" class="text" font-weight="700" fill="#73B222">только числа в двоичной форме</text>

            <text x="480" y="585" text-anchor="middle" class="text">А числа — это просто комбинации лампочек, которые горят или не горят</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("enc-title").textContent = step.title;
        $("enc-subtitle").textContent = step.subtitle;
        $("enc-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("enc-scene").innerHTML = step.scene;
        $("enc-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("enc-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("enc-nextBtn").addEventListener("click", nextStep);
      $("enc-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

И вот тут вся картина наконец складывается. <strong>Всё, что есть в компьютере — это числа.</strong> Текст, который вы сейчас читаете, фото в галерее, песня в наушниках, даже сама программа, которая всё это показывает — внутри это просто длинная цепочка нулей и единиц. А нули и единицы — это лампочки, которые горят или не горят. А лампочки — это транзисторы. А транзисторы — это электроны, бегущие по проводу.

Круг замкнулся.

---

## Часть 7. От транзистора до целого процессора

Хорошо, у нас есть транзисторы и вентили. Как из них собрать целый процессор?

Ответ: послойно. Каждый следующий уровень собирается из элементов нижнего. Транзисторы → вентили → сумматоры и триггеры → ALU и регистры → CPU.

<figure class="embedded-interactive" id="section-viz-tr3">
  <div class="interactive-meta">Интерактив 7</div>
  <h3>От транзистора — до целого процессора</h3>
  <p class="interactive-desc">7 шагов: лестница абстракций → сумматор стал ALU → триггер стал регистром → CU из вентилей → весь CPU в сборе → закон Мура → большая картина</p>
  <div class="interactive-svg-wrap">
<svg id="viz-tr3" viewBox="0 0 960 680" width="100%" role="img" aria-label="Как из транзисторов собирается CPU">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                          text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                    text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="tr3-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text id="tr3-title" x="36" y="48" class="title"></text>
  <text id="tr3-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="tr3-scene"></g>

  <text id="tr3-counter" x="36" y="635" class="text"></text>

  <g id="tr3-prevGroup">
    <rect id="tr3-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="tr3-nextGroup">
    <rect id="tr3-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="tr3-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-tr3");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Лестница абстракций — снизу доверху",
          subtitle: "Каждый следующий уровень собирается из предыдущего",
          scene: `
            <rect x="280" y="160" width="400" height="60" class="box-green"/>
            <text x="480" y="197" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Процессор (CPU)</text>

            <line x1="480" y1="220" x2="480" y2="245" stroke="#5E5850" stroke-width="2"/>
            <polygon points="475,235 485,235 480,250" fill="#5E5850"/>

            <rect x="280" y="250" width="400" height="60" class="box-yellow"/>
            <text x="480" y="287" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Блоки: ALU, регистры, CU</text>

            <line x1="480" y1="310" x2="480" y2="335" stroke="#5E5850" stroke-width="2"/>
            <polygon points="475,325 485,325 480,340" fill="#5E5850"/>

            <rect x="280" y="340" width="400" height="60" class="box-yellow"/>
            <text x="480" y="377" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Сумматор, триггер, мультиплексор</text>

            <line x1="480" y1="400" x2="480" y2="425" stroke="#5E5850" stroke-width="2"/>
            <polygon points="475,415 485,415 480,430" fill="#5E5850"/>

            <rect x="280" y="430" width="400" height="60" class="box-yellow"/>
            <text x="480" y="467" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Логические вентили: NOT, AND, OR</text>

            <line x1="480" y1="490" x2="480" y2="515" stroke="#5E5850" stroke-width="2"/>
            <polygon points="475,505 485,505 480,520" fill="#5E5850"/>

            <rect x="280" y="520" width="400" height="60" class="box-blue"/>
            <text x="480" y="557" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Транзистор</text>

            <text x="80" y="200" class="small" fill="#5E5850">сложное</text>
            <text x="80" y="557" class="small" fill="#5E5850">простое</text>
          `
        },
        {
          title: "Шаг 2. Сумматор → весь ALU",
          subtitle: "Сумматоры, вычитатели, сравниватели — соединены в одно арифметическое устройство",
          scene: `
            <rect x="60" y="180" width="380" height="260" class="box-yellow"/>
            <text x="250" y="215" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Один сумматор</text>

            <rect x="120" y="250" width="260" height="80" class="box-yellow"/>
            <text x="250" y="295" text-anchor="middle" class="text">складывает 2 числа</text>

            <text x="250" y="380" text-anchor="middle" class="small">+ ещё для вычитания,</text>
            <text x="250" y="400" text-anchor="middle" class="small">умножения, сравнения, AND, OR…</text>

            <text x="480" y="320" text-anchor="middle" font-size="36" font-weight="800" fill="#5E5850">→</text>

            <rect x="520" y="180" width="380" height="260" class="box-green"/>
            <text x="710" y="215" text-anchor="middle" class="text" font-weight="700" fill="#73B222">ALU</text>
            <text x="710" y="238" text-anchor="middle" class="small">арифметико-логическое устройство</text>

            <rect x="555" y="255" width="140" height="40" class="box-green"/>
            <text x="625" y="280" text-anchor="middle" class="small">+ сложение</text>
            <rect x="715" y="255" width="160" height="40" class="box-green"/>
            <text x="795" y="280" text-anchor="middle" class="small">− вычитание</text>

            <rect x="555" y="305" width="140" height="40" class="box-green"/>
            <text x="625" y="330" text-anchor="middle" class="small">× умножение</text>
            <rect x="715" y="305" width="160" height="40" class="box-green"/>
            <text x="795" y="330" text-anchor="middle" class="small">= сравнение</text>

            <rect x="555" y="355" width="140" height="40" class="box-green"/>
            <text x="625" y="380" text-anchor="middle" class="small">AND, OR</text>
            <rect x="715" y="355" width="160" height="40" class="box-green"/>
            <text x="795" y="380" text-anchor="middle" class="small">сдвиги бит</text>

            <text x="480" y="510" text-anchor="middle" class="text">Из ~10 000 транзисторов получается ALU, умеющий считать</text>
          `
        },
        {
          title: "Шаг 3. Триггер → ячейка памяти → регистр",
          subtitle: "Комбинация вентилей, которая помнит один бит, — это уже память",
          scene: `
            <rect x="60" y="170" width="280" height="280" class="box-yellow"/>
            <text x="200" y="205" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Триггер</text>
            <text x="200" y="227" text-anchor="middle" class="small">~6 транзисторов</text>

            <rect x="100" y="260" width="200" height="120" class="box-yellow"/>
            <text x="200" y="305" text-anchor="middle" class="text">помнит</text>
            <text x="200" y="340" text-anchor="middle" class="text" font-size="32" font-weight="800" fill="#C29E08">0 или 1</text>

            <text x="200" y="420" text-anchor="middle" class="small">1 бит памяти</text>

            <text x="370" y="320" text-anchor="middle" font-size="28" font-weight="800" fill="#5E5850">→</text>

            <rect x="400" y="170" width="220" height="280" class="box-blue"/>
            <text x="510" y="205" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Байт = 8 битов</text>

            <g>
              <rect x="425" y="225" width="40" height="40" class="box-yellow"/>
              <text x="445" y="252" text-anchor="middle" class="mono">1</text>
              <rect x="465" y="225" width="40" height="40" class="box-yellow"/>
              <text x="485" y="252" text-anchor="middle" class="mono">0</text>
              <rect x="505" y="225" width="40" height="40" class="box-yellow"/>
              <text x="525" y="252" text-anchor="middle" class="mono">1</text>
              <rect x="545" y="225" width="40" height="40" class="box-yellow"/>
              <text x="565" y="252" text-anchor="middle" class="mono">1</text>
              <rect x="425" y="270" width="40" height="40" class="box-yellow"/>
              <text x="445" y="297" text-anchor="middle" class="mono">0</text>
              <rect x="465" y="270" width="40" height="40" class="box-yellow"/>
              <text x="485" y="297" text-anchor="middle" class="mono">0</text>
              <rect x="505" y="270" width="40" height="40" class="box-yellow"/>
              <text x="525" y="297" text-anchor="middle" class="mono">1</text>
              <rect x="545" y="270" width="40" height="40" class="box-yellow"/>
              <text x="565" y="297" text-anchor="middle" class="mono">0</text>
            </g>

            <text x="510" y="365" text-anchor="middle" class="small">8 триггеров рядом</text>
            <text x="510" y="395" text-anchor="middle" class="small">= число от 0 до 255</text>

            <text x="650" y="320" text-anchor="middle" font-size="28" font-weight="800" fill="#5E5850">→</text>

            <rect x="680" y="170" width="220" height="280" class="box-green"/>
            <text x="790" y="205" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Регистр</text>
            <text x="790" y="227" text-anchor="middle" class="small">32 или 64 бита</text>

            <rect x="710" y="245" width="160" height="40" fill="#ffffff" stroke="#73B222" stroke-width="1" rx="6"/>
            <text x="725" y="272" class="mono">EAX:</text>
            <text x="855" y="272" text-anchor="end" class="mono">12</text>

            <rect x="710" y="290" width="160" height="40" fill="#ffffff" stroke="#73B222" stroke-width="1" rx="6"/>
            <text x="725" y="317" class="mono">EBX:</text>
            <text x="855" y="317" text-anchor="end" class="mono">5</text>

            <rect x="710" y="335" width="160" height="40" fill="#ffffff" stroke="#73B222" stroke-width="1" rx="6"/>
            <text x="725" y="362" class="mono">IP:</text>
            <text x="855" y="362" text-anchor="end" class="mono">0xF1</text>

            <text x="480" y="510" text-anchor="middle" class="small">Регистры CPU — это просто очень быстрая память из триггеров</text>
          `
        },
        {
          title: "Шаг 4. CU — тоже куча вентилей",
          subtitle: "Control Unit декодирует инструкции — это большая логическая схема",
          scene: `
            <rect x="60" y="170" width="380" height="280" class="box-yellow"/>
            <text x="250" y="205" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Вход CU</text>

            <rect x="100" y="230" width="300" height="50" class="box-yellow"/>
            <text x="250" y="262" text-anchor="middle" class="mono">10110000 01100001</text>

            <text x="250" y="305" text-anchor="middle" class="small">биты инструкции из памяти</text>

            <rect x="100" y="325" width="300" height="100" class="box-yellow"/>
            <text x="250" y="358" text-anchor="middle" class="small">десятки тысяч вентилей</text>
            <text x="250" y="380" text-anchor="middle" class="small">распознают «команду MOV»</text>
            <text x="250" y="402" text-anchor="middle" class="small">«регистр EAX», «значение 7»</text>

            <text x="480" y="320" text-anchor="middle" font-size="36" font-weight="800" fill="#5E5850">→</text>

            <rect x="520" y="170" width="380" height="280" class="box-green"/>
            <text x="710" y="205" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Выход CU — сигналы управления</text>

            <rect x="540" y="225" width="340" height="40" class="box-green"/>
            <text x="710" y="252" text-anchor="middle" class="small">«ALU, сложи»</text>

            <rect x="540" y="275" width="340" height="40" class="box-green"/>
            <text x="710" y="302" text-anchor="middle" class="small">«регистр EAX, прими результат»</text>

            <rect x="540" y="325" width="340" height="40" class="box-green"/>
            <text x="710" y="352" text-anchor="middle" class="small">«IP, увеличься на 1»</text>

            <rect x="540" y="375" width="340" height="40" class="box-green"/>
            <text x="710" y="402" text-anchor="middle" class="small">«RAM, прочитай по адресу…»</text>

            <text x="480" y="510" text-anchor="middle" class="text">CU — это огромная логическая схема, превращающая биты в команды для остальных блоков</text>
          `
        },
        {
          title: "Шаг 5. Собираем весь процессор",
          subtitle: "ALU + регистры + CU + шины — это и есть CPU. И всё это — из транзисторов",
          scene: `
            <rect x="60" y="140" width="840" height="420" class="box-blue"/>
            <text x="80" y="170" class="text" font-size="16" font-weight="700" fill="#3576C0">CPU</text>

            <rect x="100" y="200" width="240" height="100" class="box-green"/>
            <text x="220" y="240" text-anchor="middle" class="text" font-weight="700" fill="#73B222">ALU</text>
            <text x="220" y="270" text-anchor="middle" class="small">~10 000 транзисторов</text>

            <rect x="360" y="200" width="240" height="100" class="box-green"/>
            <text x="480" y="240" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Регистры</text>
            <text x="480" y="270" text-anchor="middle" class="small">~1 000 транзисторов</text>

            <rect x="620" y="200" width="240" height="100" class="box-green"/>
            <text x="740" y="240" text-anchor="middle" class="text" font-weight="700" fill="#73B222">CU</text>
            <text x="740" y="270" text-anchor="middle" class="small">~50 000 транзисторов</text>

            <line x1="220" y1="300" x2="220" y2="340" stroke="#5E5850" stroke-width="2"/>
            <line x1="480" y1="300" x2="480" y2="340" stroke="#5E5850" stroke-width="2"/>
            <line x1="740" y1="300" x2="740" y2="340" stroke="#5E5850" stroke-width="2"/>
            <line x1="220" y1="340" x2="740" y2="340" stroke="#5E5850" stroke-width="2"/>

            <rect x="280" y="360" width="400" height="80" class="box-yellow"/>
            <text x="480" y="395" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Шины — провода между блоками</text>
            <text x="480" y="420" text-anchor="middle" class="small">по ним блоки обмениваются данными</text>

            <rect x="180" y="470" width="600" height="70" class="box-blue"/>
            <text x="480" y="505" text-anchor="middle" class="small">+ кеши, контроллеры памяти, декодеры…</text>
            <text x="480" y="525" text-anchor="middle" class="small">в сумме — миллиарды транзисторов на одном чипе</text>

            <text x="480" y="595" text-anchor="middle" class="text" font-weight="700">Все эти блоки — просто разные схемы из тех же трёх вентилей</text>
          `
        },
        {
          title: "Шаг 6. Закон Мура — почему всё стало быстрее",
          subtitle: "Каждые ~2 года количество транзисторов на чипе удваивается",
          scene: `
            <text x="480" y="150" text-anchor="middle" class="text" font-weight="700">Транзисторов на одном CPU (по годам)</text>

            <line x1="100" y1="510" x2="900" y2="510" stroke="#5E5850" stroke-width="1.5"/>
            <line x1="100" y1="200" x2="100" y2="510" stroke="#5E5850" stroke-width="1.5"/>

            <text x="120" y="195" class="small" fill="#5E5850">28 млрд</text>
            <text x="120" y="290" class="small" fill="#5E5850">1 млрд</text>
            <text x="120" y="390" class="small" fill="#5E5850">42 млн</text>
            <text x="120" y="450" class="small" fill="#5E5850">3.1 млн</text>
            <text x="120" y="495" class="small" fill="#5E5850">2 300</text>

            <circle cx="170" cy="498" r="6" fill="#3576C0"/>
            <text x="170" y="530" text-anchor="middle" class="small">1971</text>
            <text x="170" y="547" text-anchor="middle" class="small" fill="#5E5850">4004</text>

            <circle cx="320" cy="467" r="6" fill="#3576C0"/>
            <text x="320" y="530" text-anchor="middle" class="small">1985</text>
            <text x="320" y="547" text-anchor="middle" class="small" fill="#5E5850">386</text>

            <circle cx="470" cy="395" r="6" fill="#3576C0"/>
            <text x="470" y="530" text-anchor="middle" class="small">2000</text>
            <text x="470" y="547" text-anchor="middle" class="small" fill="#5E5850">Pentium 4</text>

            <circle cx="620" cy="295" r="6" fill="#3576C0"/>
            <text x="620" y="530" text-anchor="middle" class="small">2012</text>
            <text x="620" y="547" text-anchor="middle" class="small" fill="#5E5850">Core i7</text>

            <circle cx="820" cy="210" r="6" fill="#73B222"/>
            <text x="820" y="530" text-anchor="middle" class="small">2024</text>
            <text x="820" y="547" text-anchor="middle" class="small" fill="#5E5850">Apple M4</text>

            <path d="M 170,498 Q 350,490 470,395 T 820,210" fill="none" stroke="#C29E08" stroke-width="2.5"/>

            <text x="700" y="240" class="small" fill="#C29E08">экспонента</text>

            <text x="480" y="615" text-anchor="middle" class="small">за 50 лет количество транзисторов выросло в 12 000 000 раз</text>
          `
        },
        {
          title: "Шаг 7. Большая картина",
          subtitle: "Когда вы запускаете программу — на самом деле миллиарды транзисторов открывают и закрывают двери для тока",
          scene: `
            <rect x="60" y="140" width="200" height="80" class="box-blue"/>
            <text x="160" y="178" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Программа</text>
            <text x="160" y="203" text-anchor="middle" class="mono">a + b</text>

            <line x1="265" y1="180" x2="305" y2="180" stroke="#5E5850" stroke-width="2" marker-end="url(#tr3-arrowGray)"/>

            <rect x="310" y="140" width="200" height="80" class="box-yellow"/>
            <text x="410" y="178" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Машинный код</text>
            <text x="410" y="203" text-anchor="middle" class="mono">ADD EAX,EBX</text>

            <line x1="515" y1="180" x2="555" y2="180" stroke="#5E5850" stroke-width="2" marker-end="url(#tr3-arrowGray)"/>

            <rect x="560" y="140" width="200" height="80" class="box-yellow"/>
            <text x="660" y="178" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">CU декодирует</text>
            <text x="660" y="203" text-anchor="middle" class="small">«сложить»</text>

            <line x1="765" y1="180" x2="800" y2="180" stroke="#5E5850" stroke-width="2" marker-end="url(#tr3-arrowGray)"/>

            <rect x="800" y="140" width="120" height="80" class="box-green"/>
            <text x="860" y="178" text-anchor="middle" class="text" font-weight="700" fill="#73B222">ALU</text>
            <text x="860" y="203" text-anchor="middle" class="small">сумматор</text>

            <line x1="860" y1="225" x2="860" y2="265" stroke="#5E5850" stroke-width="2" marker-end="url(#tr3-arrowGray)"/>

            <rect x="180" y="270" width="600" height="120" class="box-yellow"/>
            <text x="480" y="305" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Сумматор = вентили AND и XOR</text>
            <text x="480" y="335" text-anchor="middle" class="small">которые работают на нулях и единицах</text>
            <text x="480" y="365" text-anchor="middle" class="small">где «1» = есть ток, «0» = нет тока</text>

            <line x1="480" y1="395" x2="480" y2="430" stroke="#5E5850" stroke-width="2" marker-end="url(#tr3-arrowGray)"/>

            <rect x="180" y="435" width="600" height="120" class="box-blue"/>
            <text x="480" y="470" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Вентили = транзисторы</text>
            <text x="480" y="500" text-anchor="middle" class="small">микроскопические переключатели, которые пропускают</text>
            <text x="480" y="525" text-anchor="middle" class="small">или останавливают поток электронов</text>

            <text x="480" y="600" text-anchor="middle" class="text" font-weight="700">Программа = пляска электронов через миллиарды крошечных дверей</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("tr3-title").textContent = step.title;
        $("tr3-subtitle").textContent = step.subtitle;
        $("tr3-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("tr3-scene").innerHTML = step.scene;
        $("tr3-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("tr3-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("tr3-nextBtn").addEventListener("click", nextStep);
      $("tr3-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Закон Мура — отдельная красота. За пятьдесят лет количество транзисторов в одном процессоре выросло в двенадцать миллионов раз. Двенадцать. Миллионов. Раз. Поэтому компьютер, лежащий в кармане, мощнее, чем тот, что отправлял людей на Луну.

Теперь у нас есть процессор. Но процессор сам по себе ничего не делает — ему нужны программы. Откуда они берутся?

---

## Часть 8. Как работает компьютер целиком

Прежде чем нырять в программирование, давайте окинем взглядом всю систему. Компьютер — это не только CPU. Это CPU + память (RAM, ROM) + диск + устройства ввода-вывода. И всё это связано в одно работающее целое.

<figure class="embedded-interactive" id="section-viz-arch">
  <div class="interactive-meta">Интерактив 8</div>
  <h3>Архитектура: Hardware, Software и Драйвер</h3>
  <p class="interactive-desc">6 шагов: hardware vs software → состав железа → состав ОС → драйвер как переводчик → программы поверх ОС → слоёная модель</p>
  <div class="interactive-svg-wrap">
<svg id="viz-arch" viewBox="0 0 960 680" width="100%" role="img" aria-label="Архитектура компьютера: Hardware, Software, Драйвер, Программа">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                          text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                    text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="a-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text id="a-title" x="36" y="48" class="title"></text>
  <text id="a-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="a-scene"></g>

  <text id="a-counter" x="36" y="635" class="text"></text>

  <g id="a-prevGroup">
    <rect id="a-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="a-nextGroup">
    <rect id="a-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="a-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-arch");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Два мира",
          subtitle: "Любой компьютер состоит из железа и программ",
          scene: `
            <rect x="100" y="220" width="320" height="180" class="box-blue"/>
            <text x="260" y="300" text-anchor="middle" class="text" font-size="22" font-weight="700" fill="#3576C0">Компьютер</text>
            <text x="260" y="333" text-anchor="middle" class="text" font-size="22" font-weight="700" fill="#3576C0">(железо)</text>
            <text x="260" y="430" text-anchor="middle" class="small">Hardware</text>

            <text x="480" y="325" text-anchor="middle" font-size="44" font-weight="800" fill="#5E5850">+</text>

            <rect x="540" y="220" width="320" height="180" class="box-yellow"/>
            <text x="700" y="300" text-anchor="middle" class="text" font-size="22" font-weight="700" fill="#C29E08">Операционная</text>
            <text x="700" y="333" text-anchor="middle" class="text" font-size="22" font-weight="700" fill="#C29E08">система</text>
            <text x="700" y="430" text-anchor="middle" class="small">Software</text>

            <text x="480" y="510" text-anchor="middle" class="text">Hardware можно потрогать, Software — нет</text>
          `
        },
        {
          title: "Шаг 2. Hardware — это железо",
          subtitle: "Физические компоненты: процессор, память, диски, устройства",
          scene: `
            <rect x="180" y="170" width="600" height="340" class="box-blue"/>
            <text x="200" y="200" class="text" font-size="18" font-weight="700" fill="#3576C0">Hardware</text>

            <rect x="220" y="225" width="170" height="100" class="box-blue"/>
            <text x="305" y="270" text-anchor="middle" class="text" font-weight="700">CPU</text>
            <text x="305" y="296" text-anchor="middle" class="small">процессор</text>

            <rect x="395" y="225" width="170" height="100" class="box-blue"/>
            <text x="480" y="270" text-anchor="middle" class="text" font-weight="700">RAM</text>
            <text x="480" y="296" text-anchor="middle" class="small">оперативная память</text>

            <rect x="570" y="225" width="170" height="100" class="box-blue"/>
            <text x="655" y="270" text-anchor="middle" class="text" font-weight="700">ROM</text>
            <text x="655" y="296" text-anchor="middle" class="small">постоянная память</text>

            <rect x="220" y="350" width="350" height="120" class="box-blue"/>
            <text x="395" y="395" text-anchor="middle" class="text" font-weight="700">Устройства ввода-вывода</text>
            <text x="395" y="425" text-anchor="middle" class="small">клавиатура · мышь · экран · принтер</text>

            <rect x="575" y="350" width="165" height="120" class="box-blue"/>
            <text x="657" y="395" text-anchor="middle" class="text" font-weight="700">Диск</text>
            <text x="657" y="425" text-anchor="middle" class="small">HDD / SSD</text>

            <text x="480" y="550" text-anchor="middle" class="small">Всё, что находится внутри корпуса (и подключено к нему)</text>
          `
        },
        {
          title: "Шаг 3. Software — это программы",
          subtitle: "Главная программа компьютера называется операционной системой",
          scene: `
            <rect x="180" y="170" width="600" height="320" class="box-yellow"/>
            <text x="200" y="200" class="text" font-size="18" font-weight="700" fill="#C29E08">Операционная система</text>

            <rect x="220" y="230" width="240" height="100" class="box-yellow"/>
            <text x="340" y="275" text-anchor="middle" class="text">Управляет памятью</text>
            <text x="340" y="300" text-anchor="middle" class="small">распределяет RAM между программами</text>

            <rect x="500" y="230" width="240" height="100" class="box-yellow"/>
            <text x="620" y="275" text-anchor="middle" class="text">Запускает программы</text>
            <text x="620" y="300" text-anchor="middle" class="small">создаёт и завершает процессы</text>

            <rect x="220" y="350" width="240" height="100" class="box-yellow"/>
            <text x="340" y="395" text-anchor="middle" class="text">Работает с файлами</text>
            <text x="340" y="420" text-anchor="middle" class="small">читает и пишет на диск</text>

            <rect x="500" y="350" width="240" height="100" class="box-yellow"/>
            <text x="620" y="395" text-anchor="middle" class="text">Общается с железом</text>
            <text x="620" y="420" text-anchor="middle" class="small">через драйверы</text>

            <text x="480" y="530" text-anchor="middle" class="small">Примеры: Windows · macOS · Linux · Android · iOS</text>
          `
        },
        {
          title: "Шаг 4. Драйвер — переводчик",
          subtitle: "ОС не разговаривает с железом напрямую — нужен драйвер",
          scene: `
            <rect x="60" y="240" width="220" height="160" class="box-blue"/>
            <text x="170" y="305" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Компьютер</text>
            <text x="170" y="330" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">(железо)</text>
            <text x="170" y="425" text-anchor="middle" class="small">Hardware</text>

            <rect x="370" y="240" width="220" height="160" class="box-red"/>
            <text x="480" y="328" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">Драйвер</text>
            <text x="480" y="425" text-anchor="middle" class="small">Software</text>

            <rect x="680" y="240" width="220" height="160" class="box-yellow"/>
            <text x="790" y="305" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Операционная</text>
            <text x="790" y="330" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">система</text>
            <text x="790" y="425" text-anchor="middle" class="small">Software</text>

            <line x1="280" y1="310" x2="370" y2="310" stroke="#5E5850" stroke-width="2" marker-end="url(#a-arrowGray)"/>
            <line x1="370" y1="335" x2="280" y2="335" stroke="#5E5850" stroke-width="2" marker-end="url(#a-arrowGray)"/>

            <line x1="590" y1="310" x2="680" y2="310" stroke="#5E5850" stroke-width="2" marker-end="url(#a-arrowGray)"/>
            <line x1="680" y1="335" x2="590" y2="335" stroke="#5E5850" stroke-width="2" marker-end="url(#a-arrowGray)"/>

            <text x="480" y="495" text-anchor="middle" class="text">Драйвер переводит команды ОС в сигналы для железа</text>
            <text x="480" y="520" text-anchor="middle" class="small">У каждого устройства — свой драйвер</text>
          `
        },
        {
          title: "Шаг 5. Программы — поверх ОС",
          subtitle: "Браузеры, игры, редакторы — все они запускаются внутри ОС",
          scene: `
            <rect x="40" y="300" width="180" height="130" class="box-blue"/>
            <text x="130" y="360" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Железо</text>
            <text x="130" y="455" text-anchor="middle" class="small">Hardware</text>

            <rect x="250" y="300" width="170" height="130" class="box-red"/>
            <text x="335" y="365" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">Драйвер</text>

            <rect x="450" y="300" width="180" height="130" class="box-yellow"/>
            <text x="540" y="365" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">ОС</text>

            <rect x="660" y="300" width="240" height="130" class="box-green"/>
            <text x="780" y="360" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Программа</text>
            <text x="780" y="385" text-anchor="middle" class="small">браузер · игра · IDE</text>

            <line x1="220" y1="365" x2="250" y2="365" stroke="#5E5850" stroke-width="2" marker-end="url(#a-arrowGray)"/>
            <line x1="420" y1="365" x2="450" y2="365" stroke="#5E5850" stroke-width="2" marker-end="url(#a-arrowGray)"/>
            <line x1="660" y1="365" x2="630" y2="365" stroke="#5E5850" stroke-width="2" marker-end="url(#a-arrowGray)"/>

            <text x="480" y="510" text-anchor="middle" class="text">Программа просит ОС → ОС просит драйвер → драйвер дёргает железо</text>
          `
        },
        {
          title: "Шаг 6. Слоёная модель",
          subtitle: "Каждый слой опирается на тот, что под ним",
          scene: `
            <rect x="160" y="130" width="640" height="430" class="box-blue"/>
            <text x="180" y="160" class="small" fill="#3576C0">Hardware</text>

            <rect x="220" y="190" width="520" height="340" class="box-yellow"/>
            <text x="240" y="220" class="small" fill="#C29E08">Операционная система</text>

            <rect x="310" y="260" width="340" height="240" class="box-green"/>
            <text x="330" y="290" class="small" fill="#73B222">Программа</text>
            <text x="480" y="385" text-anchor="middle" class="text" font-weight="700">Ваш код</text>
            <text x="480" y="415" text-anchor="middle" class="small">работает внутри ОС,</text>
            <text x="480" y="435" text-anchor="middle" class="small">которая работает на железе</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("a-title").textContent = step.title;
        $("a-subtitle").textContent = step.subtitle;
        $("a-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("a-scene").innerHTML = step.scene;
        $("a-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("a-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("a-nextBtn").addEventListener("click", nextStep);
      $("a-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Внутри компьютера несколько ключевых компонентов, и каждый делает своё дело.

<figure class="embedded-interactive" id="section-viz-int">
  <div class="interactive-meta">Интерактив 9</div>
  <h3>Внутри компьютера: CPU, RAM, ROM</h3>
  <p class="interactive-desc">7 шагов: ЭВМ как корпус → CPU → RAM → ROM → RAM vs ROM → I/O → как CPU читает RAM</p>
  <div class="interactive-svg-wrap">
<svg id="viz-int" viewBox="0 0 960 680" width="100%" role="img" aria-label="Внутреннее устройство компьютера">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                         text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                   text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="i-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="i-arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#3576C0"/>
    </marker>
    <marker id="i-arrowYellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#C29E08"/>
    </marker>
  </defs>

  <text id="i-title" x="36" y="48" class="title"></text>
  <text id="i-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="i-scene"></g>

  <text id="i-counter" x="36" y="635" class="text"></text>

  <g id="i-prevGroup">
    <rect id="i-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="i-nextGroup">
    <rect id="i-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="i-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-int");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Заглянем внутрь ЭВМ",
          subtitle: "Внутри корпуса прячется несколько ключевых компонентов",
          scene: `
            <rect x="270" y="170" width="420" height="360" class="box-blue"/>
            <text x="295" y="200" class="text" font-size="18" font-weight="700" fill="#3576C0">ЭВМ</text>

            <rect x="320" y="225" width="320" height="70" fill="none" stroke="#cccccc" stroke-width="1.5" stroke-dasharray="5 4" rx="12"/>
            <text x="480" y="265" text-anchor="middle" class="small">? ? ?</text>

            <rect x="320" y="315" width="320" height="70" fill="none" stroke="#cccccc" stroke-width="1.5" stroke-dasharray="5 4" rx="12"/>
            <text x="480" y="355" text-anchor="middle" class="small">? ? ?</text>

            <rect x="320" y="405" width="320" height="70" fill="none" stroke="#cccccc" stroke-width="1.5" stroke-dasharray="5 4" rx="12"/>
            <text x="480" y="445" text-anchor="middle" class="small">? ? ?</text>

            <text x="480" y="560" text-anchor="middle" class="text">Что же именно работает внутри?</text>
          `
        },
        {
          title: "Шаг 2. CPU — процессор",
          subtitle: "Мозг компьютера: читает инструкции и выполняет их",
          scene: `
            <rect x="270" y="170" width="420" height="360" class="box-blue"/>
            <text x="295" y="200" class="text" font-size="18" font-weight="700" fill="#3576C0">ЭВМ</text>

            <rect x="320" y="225" width="320" height="100" class="box-blue"/>
            <text x="480" y="270" text-anchor="middle" class="text" font-size="22" font-weight="700" fill="#3576C0">CPU</text>
            <text x="480" y="298" text-anchor="middle" class="small">Процессор</text>

            <text x="480" y="390" text-anchor="middle" class="text">Выполняет миллиарды операций в секунду</text>
            <text x="480" y="420" text-anchor="middle" class="small">сложение, сравнение, перемещение данных…</text>
            <text x="480" y="475" text-anchor="middle" class="small">Но самому CPU негде хранить данные надолго —</text>
            <text x="480" y="495" text-anchor="middle" class="small">ему нужна память</text>
          `
        },
        {
          title: "Шаг 3. RAM — оперативная память",
          subtitle: "Быстрая память, в которой CPU держит текущие данные",
          scene: `
            <rect x="270" y="170" width="420" height="360" class="box-blue"/>
            <text x="295" y="200" class="text" font-size="18" font-weight="700" fill="#3576C0">ЭВМ</text>

            <rect x="320" y="225" width="320" height="80" class="box-blue"/>
            <text x="480" y="272" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">CPU</text>

            <line x1="460" y1="305" x2="460" y2="335" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>
            <line x1="500" y1="335" x2="500" y2="305" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>

            <rect x="320" y="335" width="320" height="80" class="box-yellow"/>
            <text x="480" y="372" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">RAM</text>
            <text x="480" y="395" text-anchor="middle" class="small">оперативная (Жедел жады)</text>

            <text x="480" y="470" text-anchor="middle" class="text">Быстрая, но временная</text>
            <text x="480" y="495" text-anchor="middle" class="small">При выключении компьютера всё стирается</text>
          `
        },
        {
          title: "Шаг 4. ROM — постоянная память",
          subtitle: "Хранит данные, даже когда компьютер выключен",
          scene: `
            <rect x="270" y="140" width="420" height="400" class="box-blue"/>
            <text x="295" y="170" class="text" font-size="18" font-weight="700" fill="#3576C0">ЭВМ</text>

            <rect x="320" y="195" width="320" height="70" class="box-blue"/>
            <text x="480" y="237" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">CPU</text>

            <line x1="460" y1="265" x2="460" y2="290" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>
            <line x1="500" y1="290" x2="500" y2="265" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>

            <rect x="320" y="290" width="320" height="70" class="box-yellow"/>
            <text x="480" y="332" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">RAM</text>

            <line x1="460" y1="360" x2="460" y2="385" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>
            <line x1="500" y1="385" x2="500" y2="360" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>

            <rect x="320" y="385" width="320" height="70" class="box-gray"/>
            <text x="480" y="427" text-anchor="middle" class="text" font-weight="700" fill="#5E5850">ROM</text>

            <text x="480" y="500" text-anchor="middle" class="text">Медленнее RAM, но данные не теряются</text>
            <text x="480" y="525" text-anchor="middle" class="small">программы, файлы, прошивка BIOS</text>
          `
        },
        {
          title: "Шаг 5. RAM vs ROM",
          subtitle: "Разные роли — разные правила работы с памятью",
          scene: `
            <text x="240" y="160" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#5E5850">ROM (ПЗУ)</text>
            <text x="240" y="183" text-anchor="middle" class="small">тұрақты жады</text>

            <rect x="120" y="200" width="240" height="270" class="box-gray"/>
            <text x="240" y="270" text-anchor="middle" class="text" font-weight="700" fill="#5E5850">ROM</text>

            <rect x="160" y="305" width="160" height="55" fill="#ffffff" stroke="#5E5850" stroke-width="1.2" rx="10"/>
            <text x="240" y="340" text-anchor="middle" class="text">Только чтение</text>

            <text x="240" y="410" text-anchor="middle" class="small">Хранит программы и файлы,</text>
            <text x="240" y="430" text-anchor="middle" class="small">записанные заранее</text>
            <text x="240" y="450" text-anchor="middle" class="small">(сохраняются после выключения)</text>

            <text x="480" y="335" text-anchor="middle" font-size="28" font-weight="800" fill="#5E5850">VS</text>

            <text x="720" y="160" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#C29E08">RAM (ОЗУ)</text>
            <text x="720" y="183" text-anchor="middle" class="small">жедел жады</text>

            <rect x="600" y="200" width="240" height="270" class="box-yellow"/>
            <text x="720" y="270" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">RAM</text>

            <rect x="640" y="295" width="160" height="75" fill="#ffffff" stroke="#C29E08" stroke-width="1.2" rx="10"/>
            <text x="720" y="322" text-anchor="middle" class="text">Чтение</text>
            <text x="720" y="350" text-anchor="middle" class="text">Запись</text>

            <text x="720" y="410" text-anchor="middle" class="small">Хранит промежуточные данные</text>
            <text x="720" y="430" text-anchor="middle" class="small">и результаты вычислений</text>
            <text x="720" y="450" text-anchor="middle" class="small">(стираются при выключении)</text>
          `
        },
        {
          title: "Шаг 6. I/O — связь с внешним миром",
          subtitle: "Клавиатура, экран, диски — всё подключается через устройства ввода-вывода",
          scene: `
            <rect x="380" y="170" width="380" height="380" class="box-blue"/>
            <text x="405" y="200" class="text" font-size="18" font-weight="700" fill="#3576C0">ЭВМ</text>

            <rect x="440" y="225" width="260" height="70" class="box-blue"/>
            <text x="570" y="267" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">CPU</text>

            <line x1="555" y1="295" x2="555" y2="320" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>
            <line x1="585" y1="320" x2="585" y2="295" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>

            <rect x="440" y="320" width="260" height="70" class="box-yellow"/>
            <text x="570" y="362" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">RAM</text>

            <line x1="555" y1="390" x2="555" y2="415" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>
            <line x1="585" y1="415" x2="585" y2="390" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>

            <rect x="440" y="415" width="260" height="70" class="box-gray"/>
            <text x="570" y="457" text-anchor="middle" class="text" font-weight="700" fill="#5E5850">ROM</text>

            <rect x="150" y="320" width="180" height="70" class="box-green"/>
            <text x="240" y="362" text-anchor="middle" class="text" font-weight="700" fill="#73B222">I/O</text>

            <line x1="330" y1="343" x2="440" y2="343" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>
            <line x1="440" y1="368" x2="330" y2="368" stroke="#5E5850" stroke-width="2" marker-end="url(#i-arrowGray)"/>

            <text x="240" y="275" text-anchor="middle" class="small">Клавиатура · Мышь</text>
            <text x="240" y="295" text-anchor="middle" class="small">Экран · Диск · Сеть</text>

            <text x="480" y="580" text-anchor="middle" class="small">Через I/O данные попадают в RAM, а CPU обрабатывает их</text>
          `
        },
        {
          title: "Шаг 7. Как CPU читает RAM",
          subtitle: "Процессор отправляет адрес — память возвращает данные",
          scene: `
            <rect x="160" y="240" width="240" height="200" class="box-blue"/>
            <text x="280" y="350" text-anchor="middle" class="text" font-size="28" font-weight="800" fill="#3576C0">CPU</text>

            <rect x="560" y="240" width="240" height="200" class="box-yellow"/>
            <text x="680" y="350" text-anchor="middle" class="text" font-size="28" font-weight="800" fill="#C29E08">RAM</text>

            <line x1="400" y1="295" x2="555" y2="295" stroke="#3576C0" stroke-width="2.5" marker-end="url(#i-arrowBlue)"/>
            <text x="480" y="280" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Адрес</text>

            <line x1="560" y1="385" x2="405" y2="385" stroke="#C29E08" stroke-width="2.5" marker-end="url(#i-arrowYellow)"/>
            <text x="480" y="408" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Данные</text>

            <text x="480" y="500" text-anchor="middle" class="text">«Дай то, что лежит по адресу X»  →  RAM возвращает значение</text>
            <text x="480" y="525" text-anchor="middle" class="small">Так миллиарды раз в секунду</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("i-title").textContent = step.title;
        $("i-subtitle").textContent = step.subtitle;
        $("i-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("i-scene").innerHTML = step.scene;
        $("i-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("i-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("i-nextBtn").addEventListener("click", nextStep);
      $("i-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

---

## Часть 9. Откуда берётся программа

Программа в компьютере проходит интересный путь. Сначала программист пишет текст — обычный читаемый код. Потом этот текст превращается в машинные инструкции. Потом загружается в память. И только потом начинает работать.

<figure class="embedded-interactive" id="section-viz-life">
  <div class="interactive-meta">Интерактив 10</div>
  <h3>Жизненный цикл программы: от кода до выполнения</h3>
  <p class="interactive-desc">7 шагов: исходный код → компиляция → исполняемый файл на диске → загрузка в RAM → процесс → CPU выполняет процесс → полная цепочка</p>
  <div class="interactive-svg-wrap">
<svg id="viz-life" viewBox="0 0 960 680" width="100%" role="img" aria-label="Жизненный цикл программы">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 13px; fill: #5E5850; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                          text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                    text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="l-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="l-arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#3576C0"/>
    </marker>
    <marker id="l-arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#73B222"/>
    </marker>
  </defs>

  <text id="l-title" x="36" y="48" class="title"></text>
  <text id="l-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="l-scene"></g>

  <text id="l-counter" x="36" y="635" class="text"></text>

  <g id="l-prevGroup">
    <rect id="l-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="l-nextGroup">
    <rect id="l-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="l-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-life");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Исходный код",
          subtitle: "Программист пишет текст программы в обычном файле",
          scene: `
            <rect x="280" y="200" width="400" height="240" class="box-blue"/>
            <text x="480" y="255" text-anchor="middle" class="text" font-size="20" font-weight="700" fill="#3576C0">Source code</text>
            <text x="480" y="282" text-anchor="middle" class="small">program.c</text>

            <line x1="320" y1="305" x2="640" y2="305" stroke="#e0e0e0" stroke-width="1"/>

            <text x="320" y="335" class="mono">int main() {</text>
            <text x="320" y="358" class="mono">    printf("Hello!");</text>
            <text x="320" y="381" class="mono">    return 0;</text>
            <text x="320" y="404" class="mono">}</text>

            <text x="480" y="490" text-anchor="middle" class="text">Просто текстовый файл на диске (HDD/SSD)</text>
            <text x="480" y="515" text-anchor="middle" class="small">CPU пока что не понимает этот код напрямую</text>
          `
        },
        {
          title: "Шаг 2. Компиляция",
          subtitle: "Компилятор переводит исходный код в машинные инструкции",
          scene: `
            <rect x="60" y="245" width="220" height="140" class="box-blue"/>
            <text x="170" y="300" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Source code</text>
            <text x="170" y="328" text-anchor="middle" class="small">program.c</text>
            <text x="170" y="355" text-anchor="middle" class="mono">текст</text>

            <line x1="280" y1="315" x2="380" y2="315" stroke="#5E5850" stroke-width="2" marker-end="url(#l-arrowGray)"/>
            <text x="330" y="300" text-anchor="middle" class="small">Compile</text>

            <rect x="380" y="245" width="200" height="140" class="box-yellow"/>
            <text x="480" y="305" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Компилятор</text>
            <text x="480" y="335" text-anchor="middle" class="small">gcc · clang ·</text>
            <text x="480" y="355" text-anchor="middle" class="small">javac · rustc</text>

            <line x1="580" y1="315" x2="680" y2="315" stroke="#5E5850" stroke-width="2" marker-end="url(#l-arrowGray)"/>

            <rect x="680" y="245" width="220" height="140" class="box-blue"/>
            <text x="790" y="300" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Executable</text>
            <text x="790" y="328" text-anchor="middle" class="small">program.exe</text>
            <text x="790" y="355" text-anchor="middle" class="mono">01101001…</text>

            <text x="480" y="470" text-anchor="middle" class="text">Из текста — в инструкции, понятные процессору</text>
          `
        },
        {
          title: "Шаг 3. Исполняемый файл на диске",
          subtitle: "Готовая программа лежит на диске и ждёт запуска",
          scene: `
            <rect x="220" y="180" width="520" height="320" class="box-gray"/>
            <text x="245" y="210" class="text" font-size="16" font-weight="700" fill="#5E5850">HDD / SSD (диск)</text>

            <rect x="320" y="260" width="320" height="180" class="box-blue"/>
            <text x="480" y="330" text-anchor="middle" class="text" font-size="20" font-weight="700" fill="#3576C0">program.exe</text>
            <text x="480" y="365" text-anchor="middle" class="small">машинные инструкции</text>
            <text x="480" y="400" text-anchor="middle" class="mono">01101001 11010010 …</text>

            <text x="480" y="555" text-anchor="middle" class="text">Файл существует, но пока ничего не делает</text>
          `
        },
        {
          title: "Шаг 4. Запуск — загрузка в RAM",
          subtitle: "ОС копирует программу с диска в оперативную память",
          scene: `
            <rect x="60" y="240" width="280" height="200" class="box-gray"/>
            <text x="80" y="270" class="small" fill="#5E5850">HDD</text>
            <rect x="100" y="290" width="200" height="120" class="box-blue"/>
            <text x="200" y="345" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">program.exe</text>
            <text x="200" y="375" text-anchor="middle" class="small">исходный файл</text>

            <line x1="350" y1="340" x2="610" y2="340" stroke="#5E5850" stroke-width="2.5" marker-end="url(#l-arrowGray)"/>
            <text x="480" y="320" text-anchor="middle" class="text" font-weight="700">копирование</text>
            <text x="480" y="365" text-anchor="middle" class="small">это делает ОС</text>

            <rect x="620" y="240" width="280" height="200" class="box-yellow"/>
            <text x="640" y="270" class="small" fill="#C29E08">RAM</text>
            <rect x="660" y="290" width="200" height="120" class="box-yellow"/>
            <text x="760" y="345" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">копия программы</text>
            <text x="760" y="375" text-anchor="middle" class="small">в памяти</text>

            <text x="480" y="510" text-anchor="middle" class="text">Программа должна быть в RAM — оттуда CPU читает её быстрее всего</text>
          `
        },
        {
          title: "Шаг 5. Процесс",
          subtitle: "Запущенный экземпляр программы называется процессом",
          scene: `
            <rect x="180" y="180" width="600" height="320" class="box-yellow"/>
            <text x="200" y="210" class="text" font-size="16" font-weight="700" fill="#C29E08">RAM</text>

            <rect x="280" y="240" width="400" height="220" class="box-green"/>
            <text x="480" y="290" text-anchor="middle" class="text" font-size="20" font-weight="700" fill="#73B222">Процесс</text>

            <line x1="310" y1="310" x2="650" y2="310" stroke="#e0e0e0" stroke-width="1"/>

            <text x="320" y="340" class="small">• код программы (инструкции)</text>
            <text x="320" y="365" class="small">• данные и переменные</text>
            <text x="320" y="390" class="small">• стек вызовов функций</text>
            <text x="320" y="415" class="small">• текущее состояние (регистры, счётчик)</text>

            <text x="480" y="540" text-anchor="middle" class="text">Один файл program.exe → можно запустить много процессов</text>
          `
        },
        {
          title: "Шаг 6. CPU выполняет процесс",
          subtitle: "Процессор читает инструкции из RAM и исполняет их одну за одной",
          scene: `
            <rect x="80" y="230" width="240" height="220" class="box-blue"/>
            <text x="200" y="345" text-anchor="middle" class="text" font-size="24" font-weight="800" fill="#3576C0">CPU</text>

            <rect x="440" y="200" width="440" height="280" class="box-yellow"/>
            <text x="460" y="230" class="small" fill="#C29E08">RAM</text>
            <rect x="500" y="245" width="340" height="220" class="box-green"/>
            <text x="670" y="295" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Процесс</text>
            <text x="670" y="335" text-anchor="middle" class="mono">инструкция 1</text>
            <text x="670" y="360" text-anchor="middle" class="mono">инструкция 2</text>
            <text x="670" y="385" text-anchor="middle" class="mono">инструкция 3</text>
            <text x="670" y="410" text-anchor="middle" class="mono">…</text>

            <line x1="500" y1="320" x2="325" y2="320" stroke="#73B222" stroke-width="2.5" marker-end="url(#l-arrowGreen)"/>
            <text x="412" y="305" text-anchor="middle" class="small" fill="#73B222">читает инструкцию</text>

            <line x1="325" y1="380" x2="500" y2="380" stroke="#3576C0" stroke-width="2.5" marker-end="url(#l-arrowBlue)"/>
            <text x="412" y="400" text-anchor="middle" class="small" fill="#3576C0">записывает результат</text>

            <text x="480" y="540" text-anchor="middle" class="text">Цикл «прочитать → выполнить → записать» повторяется миллиарды раз</text>
          `
        },
        {
          title: "Шаг 7. Весь путь — от текста до работы",
          subtitle: "Полная цепочка превращения исходного кода в работающую программу",
          scene: `
            <rect x="40" y="230" width="150" height="110" class="box-blue"/>
            <text x="115" y="275" text-anchor="middle" class="small" fill="#3576C0">Source</text>
            <text x="115" y="293" text-anchor="middle" class="small" fill="#3576C0">code</text>
            <text x="115" y="322" text-anchor="middle" class="small">HDD</text>

            <line x1="190" y1="285" x2="225" y2="285" stroke="#5E5850" stroke-width="2" marker-end="url(#l-arrowGray)"/>
            <text x="207" y="270" text-anchor="middle" class="small">compile</text>

            <rect x="225" y="230" width="150" height="110" class="box-blue"/>
            <text x="300" y="275" text-anchor="middle" class="small" fill="#3576C0">Executable</text>
            <text x="300" y="293" text-anchor="middle" class="small" fill="#3576C0">code</text>
            <text x="300" y="322" text-anchor="middle" class="small">HDD</text>

            <line x1="375" y1="285" x2="410" y2="285" stroke="#5E5850" stroke-width="2" marker-end="url(#l-arrowGray)"/>
            <text x="392" y="270" text-anchor="middle" class="small">execute</text>

            <rect x="410" y="230" width="150" height="110" class="box-yellow"/>
            <text x="485" y="285" text-anchor="middle" class="small" fill="#C29E08">Process</text>
            <text x="485" y="322" text-anchor="middle" class="small">RAM</text>

            <line x1="560" y1="285" x2="595" y2="285" stroke="#5E5850" stroke-width="2" marker-end="url(#l-arrowGray)"/>

            <rect x="595" y="230" width="150" height="110" class="box-blue"/>
            <text x="670" y="290" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Процессор</text>
            <text x="670" y="320" text-anchor="middle" class="small">железо</text>

            <line x1="745" y1="285" x2="780" y2="285" stroke="#5E5850" stroke-width="2" marker-end="url(#l-arrowGray)"/>

            <rect x="780" y="230" width="140" height="110" class="box-green"/>
            <text x="850" y="280" text-anchor="middle" class="small" fill="#73B222">Результат</text>
            <text x="850" y="298" text-anchor="middle" class="small" fill="#73B222">работы</text>
            <text x="850" y="322" text-anchor="middle" class="small">экран · файл</text>

            <text x="480" y="430" text-anchor="middle" class="text">Текст → машинный код → процесс в памяти → выполнение → результат</text>
            <text x="480" y="475" text-anchor="middle" class="small">Каждый раз, когда вы запускаете программу, происходит вся эта цепочка</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("l-title").textContent = step.title;
        $("l-subtitle").textContent = step.subtitle;
        $("l-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("l-scene").innerHTML = step.scene;
        $("l-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("l-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("l-nextBtn").addEventListener("click", nextStep);
      $("l-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Здесь важный момент: программа на компьютере — это не магия и не отдельная сущность. Это просто куча байтов в памяти, которые CPU читает один за другим и выполняет.

Но как именно текст превращается в эти байты? Тут начинается отдельная история — про языки программирования.

---

## Часть 10. Языки программирования и машинный код

Процессор понимает только машинный код — последовательность нулей и единиц. Человек писать в нулях и единицах не хочет (и не должен). Поэтому придумали языки программирования: понятные человеку, и инструменты, которые переводят их в понятные процессору.

Этих инструментов два типа: <strong>компиляторы</strong> и <strong>интерпретаторы</strong>. Принципиальная разница между ними — когда происходит перевод. Но сначала разберёмся, зачем перевод вообще нужен.

<figure class="embedded-interactive" id="section-viz-lang1">
  <div class="interactive-meta">Интерактив 11</div>
  <h3>Языки программирования и машинный код</h3>
  <p class="interactive-desc">7 шагов: код высокого уровня → машинный код → пропасть между ними → два способа перевода → разные процессоры с разными ISA → один язык под несколько архитектур → полная картина</p>
  <div class="interactive-svg-wrap">
<svg id="viz-lang1" viewBox="0 0 960 680" width="100%" role="img" aria-label="Языки программирования и машинный код">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                           text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                     text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="l1-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="l1-arrowYellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#C29E08"/>
    </marker>
    <marker id="l1-arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text id="l1-title" x="36" y="48" class="title"></text>
  <text id="l1-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="l1-scene"></g>

  <text id="l1-counter" x="36" y="635" class="text"></text>

  <g id="l1-prevGroup">
    <rect id="l1-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="l1-nextGroup">
    <rect id="l1-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="l1-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-lang1");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Что видит человек",
          subtitle: "Программист пишет на понятном языке высокого уровня",
          scene: `
            <rect x="240" y="220" width="480" height="180" class="box-blue"/>
            <text x="480" y="265" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">Код высокого уровня</text>
            <line x1="280" y1="285" x2="680" y2="285" stroke="#e0e0e0" stroke-width="1"/>
            <text x="480" y="325" text-anchor="middle" class="mono">print('Hello world')</text>
            <text x="480" y="355" text-anchor="middle" class="small">читается как обычный текст</text>

            <text x="480" y="465" text-anchor="middle" class="text">Python, C/C++, Java, JavaScript, Rust…</text>
            <text x="480" y="495" text-anchor="middle" class="small">Любой современный язык программирования</text>
          `
        },
        {
          title: "Шаг 2. Что понимает процессор",
          subtitle: "CPU читает только двоичные инструкции — нули и единицы",
          scene: `
            <rect x="240" y="220" width="480" height="180" class="box-blue"/>
            <text x="480" y="265" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">Машинный код</text>
            <line x1="280" y1="285" x2="680" y2="285" stroke="#e0e0e0" stroke-width="1"/>
            <text x="480" y="320" text-anchor="middle" class="mono">10110000 01100001</text>
            <text x="480" y="345" text-anchor="middle" class="mono">11010010 00010100</text>
            <text x="480" y="375" text-anchor="middle" class="small">единицы и нули, понятные только CPU</text>

            <text x="480" y="465" text-anchor="middle" class="text">Это и есть «язык» процессора</text>
            <text x="480" y="495" text-anchor="middle" class="small">Каждая инструкция — одно простое действие: сложить, скопировать, сравнить</text>
          `
        },
        {
          title: "Шаг 3. Между ними — пропасть",
          subtitle: "Человеку не удобно писать в нулях, а CPU не понимает текст",
          scene: `
            <rect x="40" y="240" width="280" height="160" class="box-blue"/>
            <text x="180" y="285" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Человек</text>
            <text x="180" y="325" text-anchor="middle" class="mono">print('Hello')</text>
            <text x="180" y="370" text-anchor="middle" class="small">пишет понятный текст</text>

            <text x="480" y="285" text-anchor="middle" class="text" font-size="20" font-weight="800" fill="#C30B0A">не понимают</text>
            <text x="480" y="315" text-anchor="middle" class="text" font-size="20" font-weight="800" fill="#C30B0A">друг друга</text>
            <text x="480" y="365" text-anchor="middle" font-size="48" font-weight="800" fill="#C30B0A">↔</text>

            <rect x="640" y="240" width="280" height="160" class="box-blue"/>
            <text x="780" y="285" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">CPU</text>
            <text x="780" y="325" text-anchor="middle" class="mono">10110000 01100001</text>
            <text x="780" y="370" text-anchor="middle" class="small">понимает только биты</text>

            <text x="480" y="495" text-anchor="middle" class="text">Нужен переводчик</text>
          `
        },
        {
          title: "Шаг 4. Два способа перевода",
          subtitle: "Компилятор и интерпретатор — две стратегии превращения кода в инструкции CPU",
          scene: `
            <rect x="380" y="140" width="200" height="80" class="box-blue"/>
            <text x="480" y="187" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Код высокого уровня</text>

            <line x1="420" y1="220" x2="290" y2="280" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l1-arrowGray)"/>
            <line x1="540" y1="220" x2="670" y2="280" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l1-arrowGray)"/>

            <rect x="80" y="290" width="280" height="140" class="box-yellow"/>
            <text x="220" y="335" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#C29E08">Компилятор</text>
            <text x="220" y="365" text-anchor="middle" class="small">переводит всю программу</text>
            <text x="220" y="385" text-anchor="middle" class="small">сразу — один раз</text>
            <text x="220" y="412" text-anchor="middle" class="small">C, C++, Rust, Go</text>

            <rect x="600" y="290" width="280" height="140" class="box-yellow"/>
            <text x="740" y="335" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#C29E08">Интерпретатор</text>
            <text x="740" y="365" text-anchor="middle" class="small">читает и выполняет</text>
            <text x="740" y="385" text-anchor="middle" class="small">строка за строкой</text>
            <text x="740" y="412" text-anchor="middle" class="small">Python, Ruby, JavaScript</text>

            <line x1="220" y1="430" x2="380" y2="490" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l1-arrowGray)"/>
            <line x1="740" y1="430" x2="580" y2="490" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l1-arrowGray)"/>

            <rect x="360" y="500" width="240" height="60" class="box-blue"/>
            <text x="480" y="538" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Машинный код</text>
          `
        },
        {
          title: "Шаг 5. У разных процессоров — разные «языки»",
          subtitle: "x86 и ARM не понимают инструкции друг друга, как русский и японский",
          scene: `
            <rect x="60" y="200" width="240" height="160" class="box-blue"/>
            <text x="180" y="245" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">Intel x86</text>
            <text x="180" y="280" text-anchor="middle" class="small">десктопы, ноутбуки,</text>
            <text x="180" y="300" text-anchor="middle" class="small">серверы</text>
            <text x="180" y="335" text-anchor="middle" class="mono">mov eax, 5</text>

            <rect x="360" y="200" width="240" height="160" class="box-blue"/>
            <text x="480" y="245" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">ARM</text>
            <text x="480" y="280" text-anchor="middle" class="small">смартфоны,</text>
            <text x="480" y="300" text-anchor="middle" class="small">Apple Silicon, IoT</text>
            <text x="480" y="335" text-anchor="middle" class="mono">mov r0, #5</text>

            <rect x="660" y="200" width="240" height="160" class="box-blue"/>
            <text x="780" y="245" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">MIPS / RISC-V</text>
            <text x="780" y="280" text-anchor="middle" class="small">встраиваемая</text>
            <text x="780" y="300" text-anchor="middle" class="small">электроника</text>
            <text x="780" y="335" text-anchor="middle" class="mono">li $t0, 5</text>

            <text x="480" y="430" text-anchor="middle" class="text">Одна и та же операция «положи 5 в регистр» — но три разные команды</text>
            <text x="480" y="460" text-anchor="middle" class="small">Каждая архитектура — это отдельная система команд</text>
          `
        },
        {
          title: "Шаг 6. Один язык — много целевых процессоров",
          subtitle: "Чтобы Python работал везде, нужны разные «переводы» под каждую архитектуру",
          scene: `
            <rect x="380" y="160" width="200" height="80" class="box-green"/>
            <text x="480" y="207" text-anchor="middle" class="text" font-size="20" font-weight="700" fill="#73B222">Python</text>

            <rect x="380" y="295" width="200" height="80" class="box-yellow"/>
            <text x="480" y="330" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">переводчик</text>
            <text x="480" y="355" text-anchor="middle" class="small">под каждую платформу</text>

            <line x1="480" y1="240" x2="480" y2="290" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l1-arrowGray)"/>

            <line x1="420" y1="375" x2="220" y2="450" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l1-arrowGray)"/>
            <line x1="480" y1="375" x2="480" y2="450" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l1-arrowGray)"/>
            <line x1="540" y1="375" x2="740" y2="450" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l1-arrowGray)"/>

            <rect x="100" y="460" width="240" height="80" class="box-blue"/>
            <text x="220" y="500" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">x86</text>
            <text x="220" y="525" text-anchor="middle" class="small">машинный код для Intel</text>

            <rect x="360" y="460" width="240" height="80" class="box-blue"/>
            <text x="480" y="500" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">ARM</text>
            <text x="480" y="525" text-anchor="middle" class="small">машинный код для ARM</text>

            <rect x="620" y="460" width="240" height="80" class="box-blue"/>
            <text x="740" y="500" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">MIPS</text>
            <text x="740" y="525" text-anchor="middle" class="small">машинный код для MIPS</text>
          `
        },
        {
          title: "Шаг 7. Полная картина",
          subtitle: "Высокоуровневый код → переводчик → машинный код → процессор выполняет",
          scene: `
            <rect x="60" y="240" width="180" height="100" class="box-green"/>
            <text x="150" y="285" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Программа</text>
            <text x="150" y="312" text-anchor="middle" class="small">print('Hello')</text>

            <line x1="240" y1="290" x2="290" y2="290" stroke="#5E5850" stroke-width="2" marker-end="url(#l1-arrowGray)"/>

            <rect x="290" y="240" width="220" height="100" class="box-yellow"/>
            <text x="400" y="282" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Компилятор или</text>
            <text x="400" y="308" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">интерпретатор</text>

            <line x1="510" y1="290" x2="560" y2="290" stroke="#5E5850" stroke-width="2" marker-end="url(#l1-arrowGray)"/>

            <rect x="560" y="240" width="200" height="100" class="box-blue"/>
            <text x="660" y="285" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Машинный код</text>
            <text x="660" y="312" text-anchor="middle" class="mono">10110000…</text>

            <line x1="760" y1="290" x2="810" y2="290" stroke="#5E5850" stroke-width="2" marker-end="url(#l1-arrowGray)"/>

            <rect x="810" y="240" width="120" height="100" class="box-blue"/>
            <text x="870" y="285" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">CPU</text>
            <text x="870" y="312" text-anchor="middle" class="small">выполняет</text>

            <text x="480" y="430" text-anchor="middle" class="text">Дальше посмотрим эти две стратегии перевода подробнее</text>
            <text x="480" y="460" text-anchor="middle" class="small">сначала компилятор, потом интерпретатор</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("l1-title").textContent = step.title;
        $("l1-subtitle").textContent = step.subtitle;
        $("l1-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("l1-scene").innerHTML = step.scene;
        $("l1-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("l1-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("l1-nextBtn").addEventListener("click", nextStep);
      $("l1-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Теперь подробно о компиляторе.

<figure class="embedded-interactive" id="section-viz-lang2">
  <div class="interactive-meta">Интерактив 12</div>
  <h3>Компилятор: переводим всё заранее</h3>
  <p class="interactive-desc">6 шагов: программист пишет исходник → компилятор обрабатывает файл целиком → результат — исполняемый файл → запуск с данными → преимущества → проблема платформ</p>
  <div class="interactive-svg-wrap">
<svg id="viz-lang2" viewBox="0 0 960 680" width="100%" role="img" aria-label="Как работает компилятор">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                           text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                     text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="l2-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="l2-arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#73B222"/>
    </marker>
  </defs>

  <text id="l2-title" x="36" y="48" class="title"></text>
  <text id="l2-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="l2-scene"></g>

  <text id="l2-counter" x="36" y="635" class="text"></text>

  <g id="l2-prevGroup">
    <rect id="l2-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="l2-nextGroup">
    <rect id="l2-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="l2-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-lang2");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Программист пишет исходник",
          subtitle: "Текстовый файл с программой — для языков типа C, C++, Rust, Go",
          scene: `
            <rect x="280" y="220" width="400" height="220" class="box-blue"/>
            <text x="480" y="265" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">Исходный код</text>
            <text x="480" y="287" text-anchor="middle" class="small">файл program.c</text>
            <line x1="320" y1="305" x2="640" y2="305" stroke="#e0e0e0" stroke-width="1"/>

            <text x="320" y="335" class="mono">int main() {</text>
            <text x="320" y="360" class="mono">    printf("Hello!");</text>
            <text x="320" y="385" class="mono">    return 0;</text>
            <text x="320" y="410" class="mono">}</text>

            <text x="480" y="500" text-anchor="middle" class="text">Это обычный текст — CPU его пока выполнить не может</text>
          `
        },
        {
          title: "Шаг 2. Компилятор обрабатывает весь файл сразу",
          subtitle: "За один проход переводит всю программу целиком",
          scene: `
            <rect x="60" y="270" width="240" height="120" class="box-blue"/>
            <text x="180" y="315" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Исходник</text>
            <text x="180" y="345" text-anchor="middle" class="mono">program.c</text>
            <text x="180" y="370" text-anchor="middle" class="small">весь файл — на вход</text>

            <line x1="300" y1="330" x2="360" y2="330" stroke="#5E5850" stroke-width="2.5" marker-end="url(#l2-arrowGray)"/>

            <rect x="360" y="270" width="240" height="120" class="box-yellow"/>
            <text x="480" y="315" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#C29E08">Компилятор</text>
            <text x="480" y="345" text-anchor="middle" class="small">gcc · clang ·</text>
            <text x="480" y="365" text-anchor="middle" class="small">rustc · javac</text>

            <line x1="600" y1="330" x2="660" y2="330" stroke="#5E5850" stroke-width="2.5" marker-end="url(#l2-arrowGray)"/>

            <rect x="660" y="270" width="240" height="120" class="box-green"/>
            <text x="780" y="315" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Машинный код</text>
            <text x="780" y="345" text-anchor="middle" class="mono">program.exe</text>
            <text x="780" y="370" text-anchor="middle" class="small">готовый файл</text>

            <text x="480" y="465" text-anchor="middle" class="text">Один прогон → один полностью переведённый файл</text>
            <text x="480" y="495" text-anchor="middle" class="small">если в коде есть ошибки — компилятор не выпустит .exe</text>
          `
        },
        {
          title: "Шаг 3. Результат — исполняемый файл",
          subtitle: ".exe лежит на диске и готов к запуску — больше компилятор не нужен",
          scene: `
            <rect x="220" y="180" width="520" height="320" class="box-gray"/>
            <text x="245" y="210" class="text" font-size="16" font-weight="700" fill="#5E5850">Диск (HDD / SSD)</text>

            <rect x="320" y="260" width="320" height="200" class="box-green"/>
            <text x="480" y="330" text-anchor="middle" class="text" font-size="22" font-weight="700" fill="#73B222">program.exe</text>
            <text x="480" y="365" text-anchor="middle" class="small">машинные инструкции CPU</text>
            <text x="480" y="400" text-anchor="middle" class="mono">10110000 01100001 11010010…</text>
            <text x="480" y="430" text-anchor="middle" class="small">файл полностью самостоятельный</text>

            <text x="480" y="555" text-anchor="middle" class="text">Можно запускать сколько угодно раз — компилятор больше не участвует</text>
          `
        },
        {
          title: "Шаг 4. Запуск: данные + .exe → результат",
          subtitle: "Программа принимает входные данные и выдаёт результат",
          scene: `
            <rect x="60" y="280" width="180" height="80" class="box-blue"/>
            <text x="150" y="318" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Данные</text>
            <text x="150" y="343" text-anchor="middle" class="small">ввод пользователя</text>

            <line x1="240" y1="320" x2="340" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#l2-arrowGray)"/>

            <rect x="340" y="260" width="280" height="120" class="box-green"/>
            <text x="480" y="305" text-anchor="middle" class="text" font-weight="700" fill="#73B222">program.exe</text>
            <text x="480" y="333" text-anchor="middle" class="small">машинный код</text>
            <text x="480" y="358" text-anchor="middle" class="small">выполняется CPU</text>

            <line x1="620" y1="320" x2="720" y2="320" stroke="#73B222" stroke-width="2.5" marker-end="url(#l2-arrowGreen)"/>

            <rect x="720" y="280" width="180" height="80" class="box-green"/>
            <text x="810" y="318" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Результат</text>
            <text x="810" y="343" text-anchor="middle" class="small">вывод программы</text>

            <text x="480" y="460" text-anchor="middle" class="text">Внутри .exe — только инструкции CPU, никакого «переводчика» при запуске нет</text>
            <text x="480" y="490" text-anchor="middle" class="small">поэтому скомпилированные программы работают очень быстро</text>
          `
        },
        {
          title: "Шаг 5. Преимущества компиляции",
          subtitle: "Главные плюсы — скорость и контроль",
          scene: `
            <rect x="80" y="180" width="380" height="120" class="box-green"/>
            <text x="270" y="220" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Быстро на старте</text>
            <text x="270" y="250" text-anchor="middle" class="small">перевод уже сделан заранее</text>
            <text x="270" y="275" text-anchor="middle" class="small">CPU сразу выполняет инструкции</text>

            <rect x="500" y="180" width="380" height="120" class="box-green"/>
            <text x="690" y="220" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Можно сильно оптимизировать</text>
            <text x="690" y="250" text-anchor="middle" class="small">компилятор видит весь код целиком</text>
            <text x="690" y="275" text-anchor="middle" class="small">и упрощает его при сборке</text>

            <rect x="80" y="330" width="380" height="120" class="box-green"/>
            <text x="270" y="370" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Ошибки видны заранее</text>
            <text x="270" y="400" text-anchor="middle" class="small">опечатки и неправильные типы</text>
            <text x="270" y="425" text-anchor="middle" class="small">находятся ещё до запуска</text>

            <rect x="500" y="330" width="380" height="120" class="box-green"/>
            <text x="690" y="370" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Готовый продукт</text>
            <text x="690" y="400" text-anchor="middle" class="small">пользователю достаточно .exe</text>
            <text x="690" y="425" text-anchor="middle" class="small">— исходники не нужны</text>

            <text x="480" y="510" text-anchor="middle" class="small">Поэтому игры, операционные системы и драйверы пишут на компилируемых языках</text>
          `
        },
        {
          title: "Шаг 6. Минус: новый .exe под каждую платформу",
          subtitle: "Скомпилированный под x86 файл не запустится на ARM или MIPS",
          scene: `
            <rect x="380" y="120" width="200" height="80" class="box-blue"/>
            <text x="480" y="167" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">program.c</text>

            <line x1="430" y1="200" x2="220" y2="280" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l2-arrowGray)"/>
            <line x1="480" y1="200" x2="480" y2="280" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l2-arrowGray)"/>
            <line x1="530" y1="200" x2="740" y2="280" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l2-arrowGray)"/>

            <rect x="100" y="290" width="240" height="100" class="box-yellow"/>
            <text x="220" y="325" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">компилятор x86</text>
            <text x="220" y="365" text-anchor="middle" class="small">собирает под Intel</text>

            <rect x="360" y="290" width="240" height="100" class="box-yellow"/>
            <text x="480" y="325" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">компилятор ARM</text>
            <text x="480" y="365" text-anchor="middle" class="small">собирает под ARM</text>

            <rect x="620" y="290" width="240" height="100" class="box-yellow"/>
            <text x="740" y="325" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">компилятор MIPS</text>
            <text x="740" y="365" text-anchor="middle" class="small">собирает под MIPS</text>

            <line x1="220" y1="390" x2="220" y2="430" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l2-arrowGray)"/>
            <line x1="480" y1="390" x2="480" y2="430" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l2-arrowGray)"/>
            <line x1="740" y1="390" x2="740" y2="430" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l2-arrowGray)"/>

            <rect x="100" y="440" width="240" height="70" class="box-green"/>
            <text x="220" y="482" text-anchor="middle" class="text" font-weight="700" fill="#73B222">program_x86.exe</text>

            <rect x="360" y="440" width="240" height="70" class="box-green"/>
            <text x="480" y="482" text-anchor="middle" class="text" font-weight="700" fill="#73B222">program_arm.exe</text>

            <rect x="620" y="440" width="240" height="70" class="box-green"/>
            <text x="740" y="482" text-anchor="middle" class="text" font-weight="700" fill="#73B222">program_mips.exe</text>

            <text x="480" y="560" text-anchor="middle" class="small">Поэтому при скачивании программ часто спрашивают: «Mac (Intel) или Mac (Apple Silicon)?»</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("l2-title").textContent = step.title;
        $("l2-subtitle").textContent = step.subtitle;
        $("l2-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("l2-scene").innerHTML = step.scene;
        $("l2-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("l2-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("l2-nextBtn").addEventListener("click", nextStep);
      $("l2-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

И об интерпретаторе.

<figure class="embedded-interactive" id="section-viz-lang3">
  <div class="interactive-meta">Интерактив 13</div>
  <h3>Интерпретатор: переводим на лету</h3>
  <p class="interactive-desc">7 шагов: скрипт без сборки → построчное чтение → выполнение каждой строки → внутри Python (source → байт-код → машинный код) → переносимость → плюсы и минусы → сравнение с компилятором</p>
  <div class="interactive-svg-wrap">
<svg id="viz-lang3" viewBox="0 0 960 680" width="100%" role="img" aria-label="Как работает интерпретатор">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                           text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                     text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="l3-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="l3-arrowYellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#C29E08"/>
    </marker>
  </defs>

  <text id="l3-title" x="36" y="48" class="title"></text>
  <text id="l3-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="l3-scene"></g>

  <text id="l3-counter" x="36" y="635" class="text"></text>

  <g id="l3-prevGroup">
    <rect id="l3-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="l3-nextGroup">
    <rect id="l3-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="l3-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-lang3");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Скрипт на Python — без отдельной сборки",
          subtitle: "Просто текстовый файл .py — никаких .exe не создаётся",
          scene: `
            <rect x="280" y="220" width="400" height="220" class="box-blue"/>
            <text x="480" y="265" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">Скрипт Python</text>
            <text x="480" y="287" text-anchor="middle" class="small">файл script.py</text>
            <line x1="320" y1="305" x2="640" y2="305" stroke="#e0e0e0" stroke-width="1"/>

            <text x="320" y="335" class="mono">x = 5</text>
            <text x="320" y="360" class="mono">y = int(input())</text>
            <text x="320" y="385" class="mono">print(x + y)</text>

            <text x="480" y="490" text-anchor="middle" class="text">Запускаем командой: python script.py</text>
            <text x="480" y="515" text-anchor="middle" class="small">никакого этапа компиляции нет — что дальше?</text>
          `
        },
        {
          title: "Шаг 2. Интерпретатор читает строку за строкой",
          subtitle: "Программу разбирает специальная программа — сам Python",
          scene: `
            <rect x="60" y="180" width="280" height="320" class="box-blue"/>
            <text x="200" y="210" text-anchor="middle" class="small" fill="#3576C0">script.py</text>

            <rect x="100" y="230" width="200" height="50" class="box-blue" stroke-width="2.5"/>
            <text x="200" y="261" text-anchor="middle" class="mono">x = 5</text>

            <rect x="100" y="295" width="200" height="50" fill="#ffffff" stroke="#3576C0" stroke-width="1" stroke-dasharray="3 3" rx="14"/>
            <text x="200" y="326" text-anchor="middle" class="mono">y = int(input())</text>

            <rect x="100" y="360" width="200" height="50" fill="#ffffff" stroke="#3576C0" stroke-width="1" stroke-dasharray="3 3" rx="14"/>
            <text x="200" y="391" text-anchor="middle" class="mono">print(x + y)</text>

            <line x1="340" y1="255" x2="540" y2="320" stroke="#5E5850" stroke-width="2" marker-end="url(#l3-arrowGray)"/>
            <text x="445" y="275" text-anchor="middle" class="small">сейчас читает</text>
            <text x="445" y="293" text-anchor="middle" class="small">первую строку</text>

            <rect x="540" y="280" width="320" height="120" class="box-yellow"/>
            <text x="700" y="320" text-anchor="middle" class="text" font-size="20" font-weight="700" fill="#C29E08">Интерпретатор</text>
            <text x="700" y="350" text-anchor="middle" class="small">программа python.exe</text>
            <text x="700" y="375" text-anchor="middle" class="small">сама написана и собрана заранее</text>
          `
        },
        {
          title: "Шаг 3. Каждую строку — сразу выполняет",
          subtitle: "Перевёл одну строку → выполнил → перешёл к следующей",
          scene: `
            <rect x="80" y="170" width="800" height="340" class="box-yellow"/>
            <text x="100" y="200" class="small" fill="#C29E08">Интерпретатор — цикл</text>

            <rect x="120" y="240" width="180" height="80" class="box-blue"/>
            <text x="210" y="278" text-anchor="middle" class="small" fill="#3576C0">читает строку</text>
            <text x="210" y="300" text-anchor="middle" class="mono">x = 5</text>

            <line x1="305" y1="280" x2="345" y2="280" stroke="#5E5850" stroke-width="2" marker-end="url(#l3-arrowGray)"/>

            <rect x="345" y="240" width="180" height="80" class="box-yellow"/>
            <text x="435" y="278" text-anchor="middle" class="small" fill="#C29E08">переводит</text>
            <text x="435" y="300" text-anchor="middle" class="small" fill="#C29E08">в инструкции</text>

            <line x1="530" y1="280" x2="570" y2="280" stroke="#5E5850" stroke-width="2" marker-end="url(#l3-arrowGray)"/>

            <rect x="570" y="240" width="180" height="80" class="box-green"/>
            <text x="660" y="278" text-anchor="middle" class="small" fill="#73B222">CPU выполняет</text>
            <text x="660" y="300" text-anchor="middle" class="small" fill="#73B222">эту инструкцию</text>

            <line x1="755" y1="280" x2="830" y2="280" stroke="#5E5850" stroke-width="2"/>
            <line x1="830" y1="280" x2="830" y2="360" stroke="#5E5850" stroke-width="2"/>
            <line x1="830" y1="360" x2="210" y2="360" stroke="#5E5850" stroke-width="2"/>
            <line x1="210" y1="360" x2="210" y2="325" stroke="#5E5850" stroke-width="2" marker-end="url(#l3-arrowGray)"/>
            <text x="520" y="385" text-anchor="middle" class="small">следующая строка…</text>

            <text x="480" y="475" text-anchor="middle" class="text">Интерпретатор работает всё время, пока крутится программа</text>
          `
        },
        {
          title: "Шаг 4. Внутри Python: source → байт-код → машинный код",
          subtitle: "Реальный Python устроен в два шага для эффективности",
          scene: `
            <rect x="320" y="130" width="320" height="80" class="box-blue"/>
            <text x="480" y="172" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">script.py</text>
            <text x="480" y="195" text-anchor="middle" class="mono">print('Hello world')</text>

            <line x1="480" y1="210" x2="480" y2="245" stroke="#5E5850" stroke-width="2" marker-end="url(#l3-arrowGray)"/>

            <rect x="320" y="245" width="320" height="65" class="box-yellow"/>
            <text x="480" y="282" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Интерпретатор Python</text>

            <line x1="480" y1="310" x2="480" y2="345" stroke="#5E5850" stroke-width="2" marker-end="url(#l3-arrowGray)"/>

            <rect x="320" y="345" width="320" height="80" class="box-yellow"/>
            <text x="480" y="378" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Байт-код</text>
            <text x="480" y="402" text-anchor="middle" class="mono">BB 11 01 B9 0D 00 B4</text>

            <line x1="480" y1="425" x2="480" y2="460" stroke="#5E5850" stroke-width="2" marker-end="url(#l3-arrowGray)"/>

            <rect x="320" y="460" width="320" height="80" class="box-green"/>
            <text x="480" y="493" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Машинный код</text>
            <text x="480" y="517" text-anchor="middle" class="mono">00101101 10010101…</text>

            <text x="100" y="285" class="small">этап 1:</text>
            <text x="100" y="305" class="small">в промежуточный</text>
            <text x="100" y="325" class="small">формат</text>

            <text x="780" y="455" class="small">этап 2:</text>
            <text x="780" y="475" class="small">в инструкции</text>
            <text x="780" y="495" class="small">для конкретного CPU</text>
          `
        },
        {
          title: "Шаг 5. Один скрипт — на любом процессоре",
          subtitle: "Если на платформе есть интерпретатор, скрипт запустится без изменений",
          scene: `
            <rect x="380" y="140" width="200" height="80" class="box-blue"/>
            <text x="480" y="187" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">script.py</text>

            <line x1="420" y1="220" x2="200" y2="280" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l3-arrowGray)"/>
            <line x1="480" y1="220" x2="480" y2="280" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l3-arrowGray)"/>
            <line x1="540" y1="220" x2="760" y2="280" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l3-arrowGray)"/>

            <rect x="60" y="290" width="280" height="100" class="box-yellow"/>
            <text x="200" y="330" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Python для x86</text>
            <text x="200" y="362" text-anchor="middle" class="small">собран под Intel</text>

            <rect x="340" y="290" width="280" height="100" class="box-yellow"/>
            <text x="480" y="330" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Python для ARM</text>
            <text x="480" y="362" text-anchor="middle" class="small">собран под ARM</text>

            <rect x="620" y="290" width="280" height="100" class="box-yellow"/>
            <text x="760" y="330" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Python для MIPS</text>
            <text x="760" y="362" text-anchor="middle" class="small">собран под MIPS</text>

            <line x1="200" y1="390" x2="200" y2="430" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l3-arrowGray)"/>
            <line x1="480" y1="390" x2="480" y2="430" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l3-arrowGray)"/>
            <line x1="760" y1="390" x2="760" y2="430" stroke="#5E5850" stroke-width="1.5" marker-end="url(#l3-arrowGray)"/>

            <rect x="60" y="440" width="280" height="70" class="box-green"/>
            <text x="200" y="482" text-anchor="middle" class="text" font-weight="700" fill="#73B222">тот же результат</text>

            <rect x="340" y="440" width="280" height="70" class="box-green"/>
            <text x="480" y="482" text-anchor="middle" class="text" font-weight="700" fill="#73B222">тот же результат</text>

            <rect x="620" y="440" width="280" height="70" class="box-green"/>
            <text x="760" y="482" text-anchor="middle" class="text" font-weight="700" fill="#73B222">тот же результат</text>

            <text x="480" y="560" text-anchor="middle" class="small">Скрипт один и тот же — разные только интерпретаторы. Их пишут авторы языка</text>
          `
        },
        {
          title: "Шаг 6. Плюсы и минусы интерпретатора",
          subtitle: "Удобство разработки в обмен на скорость выполнения",
          scene: `
            <text x="240" y="155" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#73B222">Плюсы</text>
            <text x="720" y="155" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#C30B0A">Минусы</text>

            <rect x="60" y="180" width="360" height="80" class="box-green"/>
            <text x="240" y="215" text-anchor="middle" class="text" font-weight="700">Один скрипт работает везде</text>
            <text x="240" y="240" text-anchor="middle" class="small">где есть интерпретатор языка</text>

            <rect x="540" y="180" width="360" height="80" class="box-red"/>
            <text x="720" y="215" text-anchor="middle" class="text" font-weight="700">Медленнее на старте</text>
            <text x="720" y="240" text-anchor="middle" class="small">перевод происходит во время работы</text>

            <rect x="60" y="280" width="360" height="80" class="box-green"/>
            <text x="240" y="315" text-anchor="middle" class="text" font-weight="700">Быстро менять и пробовать</text>
            <text x="240" y="340" text-anchor="middle" class="small">сохранил файл — сразу запустил</text>

            <rect x="540" y="280" width="360" height="80" class="box-red"/>
            <text x="720" y="315" text-anchor="middle" class="text" font-weight="700">Нужен интерпретатор у пользователя</text>
            <text x="720" y="340" text-anchor="middle" class="small">.py сам по себе не запустится</text>

            <rect x="60" y="380" width="360" height="80" class="box-green"/>
            <text x="240" y="415" text-anchor="middle" class="text" font-weight="700">Меньше «бойлерплейта»</text>
            <text x="240" y="440" text-anchor="middle" class="small">не нужны типы, заголовки, сборка</text>

            <rect x="540" y="380" width="360" height="80" class="box-red"/>
            <text x="720" y="415" text-anchor="middle" class="text" font-weight="700">Ошибки видны только в момент</text>
            <text x="720" y="440" text-anchor="middle" class="small">когда интерпретатор до них дошёл</text>

            <text x="480" y="525" text-anchor="middle" class="small">Поэтому Python и JavaScript обожают за быстрый старт, а C++ выбирают для производительности</text>
          `
        },
        {
          title: "Шаг 7. Компилятор vs Интерпретатор",
          subtitle: "Главное отличие — когда происходит перевод",
          scene: `
            <text x="240" y="155" text-anchor="middle" class="text" font-size="20" font-weight="700" fill="#C29E08">Компилятор</text>
            <text x="720" y="155" text-anchor="middle" class="text" font-size="20" font-weight="700" fill="#C29E08">Интерпретатор</text>

            <line x1="480" y1="170" x2="480" y2="520" stroke="#e0e0e0" stroke-width="1"/>

            <rect x="60" y="190" width="360" height="80" class="box-yellow"/>
            <text x="240" y="225" text-anchor="middle" class="text" font-weight="700">Переводит ВСЮ программу</text>
            <text x="240" y="248" text-anchor="middle" class="text" font-weight="700">один раз — заранее</text>

            <rect x="540" y="190" width="360" height="80" class="box-yellow"/>
            <text x="720" y="225" text-anchor="middle" class="text" font-weight="700">Переводит ПО ОДНОЙ строке</text>
            <text x="720" y="248" text-anchor="middle" class="text" font-weight="700">прямо во время работы</text>

            <rect x="60" y="290" width="360" height="80" class="box-green"/>
            <text x="240" y="325" text-anchor="middle" class="text">создаёт .exe</text>
            <text x="240" y="350" text-anchor="middle" class="small">самостоятельный файл</text>

            <rect x="540" y="290" width="360" height="80" class="box-green"/>
            <text x="720" y="325" text-anchor="middle" class="text">.exe не создаёт</text>
            <text x="720" y="350" text-anchor="middle" class="small">нужен сам интерпретатор</text>

            <rect x="60" y="390" width="360" height="80" class="box-blue"/>
            <text x="240" y="425" text-anchor="middle" class="text">Быстро, но «тяжело» собирать</text>
            <text x="240" y="450" text-anchor="middle" class="small">C, C++, Rust, Go</text>

            <rect x="540" y="390" width="360" height="80" class="box-blue"/>
            <text x="720" y="425" text-anchor="middle" class="text">Медленнее, но проще писать</text>
            <text x="720" y="450" text-anchor="middle" class="small">Python, Ruby, JavaScript, PHP</text>

            <text x="480" y="555" text-anchor="middle" class="small">Современные языки часто гибрид: Java и C# компилируются в байт-код, который потом интерпретируется</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("l3-title").textContent = step.title;
        $("l3-subtitle").textContent = step.subtitle;
        $("l3-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("l3-scene").innerHTML = step.scene;
        $("l3-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("l3-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("l3-nextBtn").addEventListener("click", nextStep);
      $("l3-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Кратко: C/C++/Rust компилируются — поэтому быстрые, но привязаны к платформе. Python/JavaScript интерпретируются — поэтому медленнее, но работают везде, где есть интерпретатор.

---

## Часть 11. Что делает операционная система

Пока программа одна — всё просто. Запустил, поработала, закрыл. Но что если программ нужно несколько? Кто будет распределять между ними процессорное время, память, доступ к диску? Кто переключит вас с браузера на YouTube без перезагрузки?

Эту работу делает операционная система — Windows, macOS, Linux, Android. Без неё современный компьютер не может работать.

<figure class="embedded-interactive" id="section-viz-os1">
  <div class="interactive-meta">Интерактив 14</div>
  <h3>Зачем нужна операционная система</h3>
  <p class="interactive-desc">6 шагов: история — одна программа за раз → конфликт за ресурсы → ОС как универсальный интерфейс → функции ОС → многозадачность → ОС-посредник между всеми</p>
  <div class="interactive-svg-wrap">
<svg id="viz-os1" viewBox="0 0 960 680" width="100%" role="img" aria-label="Зачем нужна операционная система">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 13px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                         text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                   text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="os1-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="os1-arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text id="os1-title" x="36" y="48" class="title"></text>
  <text id="os1-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="os1-scene"></g>

  <text id="os1-counter" x="36" y="635" class="text"></text>

  <g id="os1-prevGroup">
    <rect id="os1-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="os1-nextGroup">
    <rect id="os1-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="os1-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-os1");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Раньше: одна программа за раз",
          subtitle: "Один компьютер мог работать только с одной программой — остальные ждали",
          scene: `
            <rect x="80" y="220" width="280" height="220" class="box-blue"/>
            <text x="220" y="270" text-anchor="middle" class="text" font-size="20" font-weight="700" fill="#3576C0">ЭВМ</text>
            <text x="220" y="298" text-anchor="middle" class="small">работает с одной программой</text>

            <rect x="135" y="340" width="170" height="60" class="box-green"/>
            <text x="220" y="377" text-anchor="middle" class="text" fill="#73B222">Программа A</text>

            <text x="510" y="240" class="small" fill="#5E5850">очередь ожидания:</text>
            <rect x="430" y="260" width="320" height="50" class="box-gray"/>
            <text x="590" y="291" text-anchor="middle" class="text" fill="#5E5850">Программа B — ждёт…</text>
            <rect x="430" y="320" width="320" height="50" class="box-gray"/>
            <text x="590" y="351" text-anchor="middle" class="text" fill="#5E5850">Программа C — ждёт…</text>
            <rect x="430" y="380" width="320" height="50" class="box-gray"/>
            <text x="590" y="411" text-anchor="middle" class="text" fill="#5E5850">Программа D — ждёт…</text>

            <text x="480" y="495" text-anchor="middle" class="text">Дорогой компьютер часто простаивает — это очень неэффективно</text>
          `
        },
        {
          title: "Шаг 2. Проблема: кто разделит ресурсы?",
          subtitle: "Несколько программ хотят одни и те же CPU, RAM и устройства",
          scene: `
            <rect x="80" y="200" width="180" height="60" class="box-yellow"/>
            <text x="170" y="237" text-anchor="middle" class="text" fill="#C29E08">Программа A</text>
            <rect x="80" y="280" width="180" height="60" class="box-yellow"/>
            <text x="170" y="317" text-anchor="middle" class="text" fill="#C29E08">Программа B</text>
            <rect x="80" y="360" width="180" height="60" class="box-yellow"/>
            <text x="170" y="397" text-anchor="middle" class="text" fill="#C29E08">Программа C</text>

            <rect x="700" y="200" width="180" height="60" class="box-blue"/>
            <text x="790" y="237" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">CPU</text>
            <rect x="700" y="280" width="180" height="60" class="box-blue"/>
            <text x="790" y="317" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">RAM</text>
            <rect x="700" y="360" width="180" height="60" class="box-blue"/>
            <text x="790" y="397" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Диск</text>

            <line x1="260" y1="230" x2="700" y2="230" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="5 3"/>
            <line x1="260" y1="230" x2="700" y2="310" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="5 3"/>
            <line x1="260" y1="310" x2="700" y2="230" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="5 3"/>
            <line x1="260" y1="310" x2="700" y2="390" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="5 3"/>
            <line x1="260" y1="390" x2="700" y2="310" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="5 3"/>
            <line x1="260" y1="390" x2="700" y2="390" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="5 3"/>

            <text x="480" y="335" text-anchor="middle" font-size="56" font-weight="800" fill="#C30B0A">?</text>

            <text x="480" y="500" text-anchor="middle" class="text">Кто разрешит конфликты и решит, кому что давать?</text>
          `
        },
        {
          title: "Шаг 3. Решение: ОС — универсальный интерфейс",
          subtitle: "ОС встаёт между железом, программами и пользователем",
          scene: `
            <rect x="380" y="150" width="200" height="80" class="box-blue"/>
            <text x="480" y="197" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Hardware</text>

            <rect x="360" y="300" width="240" height="100" class="box-yellow"/>
            <text x="480" y="340" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Операционная</text>
            <text x="480" y="368" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">система</text>

            <rect x="100" y="460" width="200" height="80" class="box-green"/>
            <text x="200" y="507" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Software</text>

            <rect x="660" y="460" width="200" height="80" class="box-green"/>
            <text x="760" y="507" text-anchor="middle" class="text" font-weight="700" fill="#73B222">User</text>

            <line x1="475" y1="230" x2="475" y2="300" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>
            <line x1="485" y1="300" x2="485" y2="230" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>

            <line x1="365" y1="378" x2="295" y2="455" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>
            <line x1="305" y1="450" x2="375" y2="375" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>

            <line x1="595" y1="378" x2="665" y2="455" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>
            <line x1="655" y1="450" x2="585" y2="375" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>

            <text x="480" y="585" text-anchor="middle" class="small">Все общаются через ОС, а не напрямую друг с другом</text>
          `
        },
        {
          title: "Шаг 4. Что именно делает ОС",
          subtitle: "Главные обязанности — управление ресурсами компьютера",
          scene: `
            <rect x="380" y="280" width="200" height="120" class="box-yellow"/>
            <text x="480" y="328" text-anchor="middle" class="text" font-size="20" font-weight="800" fill="#C29E08">ОС</text>
            <text x="480" y="360" text-anchor="middle" class="small">менеджер</text>
            <text x="480" y="378" text-anchor="middle" class="small">всех ресурсов</text>

            <rect x="60" y="160" width="260" height="90" class="box-yellow"/>
            <text x="190" y="198" text-anchor="middle" class="text" font-weight="700">Управление процессами</text>
            <text x="190" y="223" text-anchor="middle" class="small">запуск, остановка, переключение</text>

            <rect x="640" y="160" width="260" height="90" class="box-yellow"/>
            <text x="770" y="198" text-anchor="middle" class="text" font-weight="700">Управление памятью</text>
            <text x="770" y="223" text-anchor="middle" class="small">кто и сколько RAM получит</text>

            <rect x="60" y="430" width="260" height="90" class="box-yellow"/>
            <text x="190" y="468" text-anchor="middle" class="text" font-weight="700">Файловая система</text>
            <text x="190" y="493" text-anchor="middle" class="small">чтение и запись на диск</text>

            <rect x="640" y="430" width="260" height="90" class="box-yellow"/>
            <text x="770" y="468" text-anchor="middle" class="text" font-weight="700">Устройства (I/O)</text>
            <text x="770" y="493" text-anchor="middle" class="small">драйверы, экран, сеть, клавиатура</text>

            <line x1="380" y1="305" x2="320" y2="225" stroke="#5E5850" stroke-width="1.3"/>
            <line x1="580" y1="305" x2="640" y2="225" stroke="#5E5850" stroke-width="1.3"/>
            <line x1="380" y1="375" x2="320" y2="455" stroke="#5E5850" stroke-width="1.3"/>
            <line x1="580" y1="375" x2="640" y2="455" stroke="#5E5850" stroke-width="1.3"/>

            <text x="480" y="580" text-anchor="middle" class="small">Плюс — безопасность, сеть, время, пользователи…</text>
          `
        },
        {
          title: "Шаг 5. Многозадачность — иллюзия одновременности",
          subtitle: "ОС очень быстро переключается между программами, и кажется, что они работают параллельно",
          scene: `
            <text x="480" y="150" text-anchor="middle" class="text" font-weight="700">Одно ядро CPU — несколько программ</text>

            <line x1="60" y1="330" x2="900" y2="330" stroke="#5E5850" stroke-width="2" marker-end="url(#os1-arrowGray)"/>
            <text x="895" y="357" class="small" text-anchor="end">время</text>

            <rect x="60" y="200" width="100" height="50" class="box-yellow"/>
            <text x="110" y="231" text-anchor="middle" class="text" fill="#C29E08">A</text>
            <rect x="170" y="200" width="100" height="50" class="box-green"/>
            <text x="220" y="231" text-anchor="middle" class="text" fill="#73B222">B</text>
            <rect x="280" y="200" width="100" height="50" class="box-yellow"/>
            <text x="330" y="231" text-anchor="middle" class="text" fill="#C29E08">A</text>
            <rect x="390" y="200" width="100" height="50" class="box-blue"/>
            <text x="440" y="231" text-anchor="middle" class="text" fill="#3576C0">C</text>
            <rect x="500" y="200" width="100" height="50" class="box-green"/>
            <text x="550" y="231" text-anchor="middle" class="text" fill="#73B222">B</text>
            <rect x="610" y="200" width="100" height="50" class="box-yellow"/>
            <text x="660" y="231" text-anchor="middle" class="text" fill="#C29E08">A</text>
            <rect x="720" y="200" width="100" height="50" class="box-blue"/>
            <text x="770" y="231" text-anchor="middle" class="text" fill="#3576C0">C</text>
            <rect x="830" y="200" width="70" height="50" fill="none" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="4 3" rx="14"/>
            <text x="865" y="231" text-anchor="middle" class="small" fill="#5E5850">…</text>

            <text x="480" y="400" text-anchor="middle" class="small">каждая полоска — несколько миллисекунд</text>

            <rect x="280" y="440" width="20" height="20" class="box-yellow"/>
            <text x="312" y="456" class="small">Программа A</text>
            <rect x="430" y="440" width="20" height="20" class="box-green"/>
            <text x="462" y="456" class="small">Программа B</text>
            <rect x="580" y="440" width="20" height="20" class="box-blue"/>
            <text x="612" y="456" class="small">Программа C</text>

            <text x="480" y="525" text-anchor="middle" class="text">Глаз и не успевает заметить — для нас всё работает одновременно</text>
          `
        },
        {
          title: "Шаг 6. ОС — посредник между всеми",
          subtitle: "Программы, пользователи и устройства разговаривают друг с другом через ОС",
          scene: `
            <rect x="320" y="260" width="320" height="180" class="box-yellow"/>
            <text x="480" y="325" text-anchor="middle" class="text" font-size="22" font-weight="800" fill="#C29E08">Операционная</text>
            <text x="480" y="358" text-anchor="middle" class="text" font-size="22" font-weight="800" fill="#C29E08">система</text>
            <text x="480" y="395" text-anchor="middle" class="small">единый интерфейс</text>

            <rect x="360" y="140" width="240" height="60" class="box-blue"/>
            <text x="480" y="178" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Hardware</text>
            <line x1="475" y1="200" x2="475" y2="260" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>
            <line x1="485" y1="260" x2="485" y2="200" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>

            <rect x="60" y="320" width="200" height="60" class="box-green"/>
            <text x="160" y="358" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Программы</text>
            <line x1="260" y1="345" x2="320" y2="345" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>
            <line x1="320" y1="355" x2="260" y2="355" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>

            <rect x="700" y="320" width="200" height="60" class="box-green"/>
            <text x="800" y="358" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Пользователь</text>
            <line x1="640" y1="345" x2="700" y2="345" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>
            <line x1="700" y1="355" x2="640" y2="355" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>

            <rect x="360" y="500" width="240" height="60" class="box-red"/>
            <text x="480" y="538" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">Драйверы устройств</text>
            <line x1="475" y1="440" x2="475" y2="500" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>
            <line x1="485" y1="500" x2="485" y2="440" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os1-arrowGray)"/>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("os1-title").textContent = step.title;
        $("os1-subtitle").textContent = step.subtitle;
        $("os1-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("os1-scene").innerHTML = step.scene;
        $("os1-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("os1-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("os1-nextBtn").addEventListener("click", nextStep);
      $("os1-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Что именно происходит, когда вы кликаете по иконке программы?

<figure class="embedded-interactive" id="section-viz-os2">
  <div class="interactive-meta">Интерактив 15</div>
  <h3>Что делает ОС при запуске программы</h3>
  <p class="interactive-desc">7 шагов: программа на диске → ОС создаёт процесс в RAM → код превращается в инструкции → CPU читает их → внутреннее устройство CPU → ОС распределяет ресурсы → программа работает</p>
  <div class="interactive-svg-wrap">
<svg id="viz-os2" viewBox="0 0 960 680" width="100%" role="img" aria-label="Что делает ОС при запуске программы">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 13px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                         text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                   text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="os2-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="os2-arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#3576C0"/>
    </marker>
    <marker id="os2-arrowYellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#C29E08"/>
    </marker>
  </defs>

  <text id="os2-title" x="36" y="48" class="title"></text>
  <text id="os2-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="os2-scene"></g>

  <text id="os2-counter" x="36" y="635" class="text"></text>

  <g id="os2-prevGroup">
    <rect id="os2-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="os2-nextGroup">
    <rect id="os2-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="os2-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-os2");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. У вас есть программа",
          subtitle: "Простой пример: присвоить значение и распечатать",
          scene: `
            <rect x="280" y="220" width="400" height="200" class="box-blue"/>
            <text x="480" y="265" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">Программа</text>
            <line x1="320" y1="285" x2="640" y2="285" stroke="#e0e0e0" stroke-width="1"/>
            <text x="320" y="320" class="mono">x = 5</text>
            <text x="320" y="350" class="mono">print(x)</text>

            <text x="480" y="485" text-anchor="middle" class="text">Вы нажали «запустить» — что должна сделать ОС?</text>
            <text x="480" y="515" text-anchor="middle" class="small">CPU не понимает текст программы напрямую</text>
          `
        },
        {
          title: "Шаг 2. ОС создаёт процесс в памяти",
          subtitle: "Программа копируется с диска в RAM и превращается в процесс",
          scene: `
            <rect x="60" y="230" width="240" height="200" class="box-gray"/>
            <text x="80" y="260" class="small" fill="#5E5850">Диск (HDD / SSD)</text>
            <rect x="100" y="280" width="160" height="120" class="box-blue"/>
            <text x="180" y="325" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">program</text>
            <text x="180" y="355" text-anchor="middle" class="mono">x=5; print(x)</text>

            <line x1="310" y1="330" x2="540" y2="330" stroke="#5E5850" stroke-width="2.5" marker-end="url(#os2-arrowGray)"/>
            <text x="425" y="315" text-anchor="middle" class="small">ОС загружает</text>

            <rect x="550" y="230" width="350" height="200" class="box-yellow"/>
            <text x="570" y="260" class="small" fill="#C29E08">RAM</text>
            <rect x="600" y="280" width="270" height="120" class="box-green"/>
            <text x="735" y="325" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Процесс</text>
            <text x="735" y="355" text-anchor="middle" class="small">копия программы + состояние</text>

            <text x="480" y="490" text-anchor="middle" class="text">Процесс — это запущенный экземпляр программы в RAM</text>
          `
        },
        {
          title: "Шаг 3. Программа превращается в инструкции",
          subtitle: "Текст программы — это для человека; для CPU нужны двоичные инструкции",
          scene: `
            <rect x="60" y="270" width="200" height="120" class="box-blue"/>
            <text x="160" y="315" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Программа</text>
            <text x="160" y="345" text-anchor="middle" class="mono">x = 5</text>
            <text x="160" y="370" text-anchor="middle" class="mono">print(x)</text>

            <line x1="270" y1="330" x2="360" y2="330" stroke="#5E5850" stroke-width="2" marker-end="url(#os2-arrowGray)"/>

            <rect x="370" y="270" width="220" height="120" class="box-yellow"/>
            <text x="480" y="315" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Инструкции</text>
            <text x="480" y="345" text-anchor="middle" class="mono">01010010…</text>
            <text x="480" y="370" text-anchor="middle" class="mono">11010011…</text>

            <line x1="600" y1="330" x2="690" y2="330" stroke="#5E5850" stroke-width="2" marker-end="url(#os2-arrowGray)"/>

            <rect x="700" y="270" width="200" height="120" class="box-yellow"/>
            <text x="800" y="315" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">RAM</text>
            <text x="800" y="345" text-anchor="middle" class="mono">01010010…</text>
            <text x="800" y="370" text-anchor="middle" class="mono">11010011…</text>

            <text x="480" y="450" text-anchor="middle" class="text">Готовые инструкции лежат в оперативной памяти —</text>
            <text x="480" y="475" text-anchor="middle" class="text">CPU теперь может их выполнять</text>
          `
        },
        {
          title: "Шаг 4. CPU читает инструкции из RAM",
          subtitle: "Процессор отправляет адрес — RAM возвращает инструкцию",
          scene: `
            <rect x="180" y="280" width="240" height="140" class="box-yellow"/>
            <text x="300" y="335" text-anchor="middle" class="text" font-size="20" font-weight="700" fill="#C29E08">RAM</text>
            <text x="300" y="365" text-anchor="middle" class="mono">01010010…</text>
            <text x="300" y="390" text-anchor="middle" class="mono">11010011…</text>

            <line x1="420" y1="320" x2="540" y2="320" stroke="#3576C0" stroke-width="2.5" marker-end="url(#os2-arrowBlue)"/>
            <text x="480" y="307" text-anchor="middle" class="small" fill="#3576C0">адрес</text>

            <line x1="540" y1="370" x2="420" y2="370" stroke="#C29E08" stroke-width="2.5" marker-end="url(#os2-arrowYellow)"/>
            <text x="480" y="395" text-anchor="middle" class="small" fill="#C29E08">инструкция</text>

            <rect x="540" y="280" width="240" height="140" class="box-blue"/>
            <text x="660" y="355" text-anchor="middle" class="text" font-size="22" font-weight="800" fill="#3576C0">CPU</text>

            <text x="480" y="490" text-anchor="middle" class="text">Так миллиарды раз в секунду — инструкция за инструкцией</text>
          `
        },
        {
          title: "Шаг 5. Что внутри CPU",
          subtitle: "Процессор — это не один блок, а несколько связанных устройств",
          scene: `
            <rect x="160" y="160" width="640" height="380" class="box-blue"/>
            <text x="185" y="190" class="text" font-size="18" font-weight="700" fill="#3576C0">CPU</text>

            <rect x="230" y="230" width="240" height="130" class="box-blue"/>
            <text x="350" y="278" text-anchor="middle" class="text" font-weight="700">ALU</text>
            <text x="350" y="305" text-anchor="middle" class="small">арифметико-логическое</text>
            <text x="350" y="325" text-anchor="middle" class="small">устройство</text>
            <text x="350" y="345" text-anchor="middle" class="small">(сложение, сравнение)</text>

            <rect x="490" y="230" width="280" height="130" class="box-blue"/>
            <text x="630" y="278" text-anchor="middle" class="text" font-weight="700">Регистры</text>
            <text x="630" y="305" text-anchor="middle" class="small">сверхбыстрая память</text>
            <text x="630" y="325" text-anchor="middle" class="small">для текущих данных</text>
            <text x="630" y="345" text-anchor="middle" class="small">и адресов</text>

            <rect x="230" y="390" width="540" height="120" class="box-blue"/>
            <text x="500" y="432" text-anchor="middle" class="text" font-weight="700">CU — Control Unit (управляющее устройство)</text>
            <text x="500" y="460" text-anchor="middle" class="small">читает инструкцию из RAM, расшифровывает её</text>
            <text x="500" y="480" text-anchor="middle" class="small">и говорит ALU и регистрам, что делать</text>

            <line x1="350" y1="390" x2="350" y2="360" stroke="#3576C0" stroke-width="1.5" marker-end="url(#os2-arrowBlue)"/>
            <line x1="630" y1="390" x2="630" y2="360" stroke="#3576C0" stroke-width="1.5" marker-end="url(#os2-arrowBlue)"/>
          `
        },
        {
          title: "Шаг 6. ОС распределяет ресурсы",
          subtitle: "Программы получают доступ к CPU, RAM и устройствам только через ОС",
          scene: `
            <rect x="60" y="200" width="180" height="50" class="box-green"/>
            <text x="150" y="232" text-anchor="middle" class="text" fill="#73B222">Программа A</text>
            <rect x="60" y="270" width="180" height="50" class="box-green"/>
            <text x="150" y="302" text-anchor="middle" class="text" fill="#73B222">Программа B</text>
            <rect x="60" y="340" width="180" height="50" class="box-green"/>
            <text x="150" y="372" text-anchor="middle" class="text" fill="#73B222">Программа C</text>

            <rect x="360" y="220" width="240" height="180" class="box-yellow"/>
            <text x="480" y="265" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#C29E08">ОС</text>
            <text x="480" y="305" text-anchor="middle" class="small">распределяет:</text>
            <text x="480" y="330" text-anchor="middle" class="small">• время CPU</text>
            <text x="480" y="352" text-anchor="middle" class="small">• память (RAM)</text>
            <text x="480" y="374" text-anchor="middle" class="small">• доступ к устройствам</text>

            <line x1="240" y1="225" x2="358" y2="290" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os2-arrowGray)"/>
            <line x1="240" y1="295" x2="358" y2="310" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os2-arrowGray)"/>
            <line x1="240" y1="365" x2="358" y2="330" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os2-arrowGray)"/>

            <rect x="720" y="200" width="180" height="50" class="box-blue"/>
            <text x="810" y="232" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">CPU</text>
            <rect x="720" y="270" width="180" height="50" class="box-blue"/>
            <text x="810" y="302" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">RAM</text>
            <rect x="720" y="340" width="180" height="50" class="box-blue"/>
            <text x="810" y="372" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Устройства</text>

            <line x1="602" y1="290" x2="720" y2="225" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os2-arrowGray)"/>
            <line x1="602" y1="310" x2="720" y2="295" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os2-arrowGray)"/>
            <line x1="602" y1="330" x2="720" y2="365" stroke="#5E5850" stroke-width="1.5" marker-end="url(#os2-arrowGray)"/>

            <text x="480" y="490" text-anchor="middle" class="text">Никакая программа не идёт к железу напрямую — только через ОС</text>
          `
        },
        {
          title: "Шаг 7. Программа работает — ОС следит",
          subtitle: "Программа выполняется, а ОС незаметно держит всё под контролем",
          scene: `
            <rect x="120" y="140" width="720" height="400" class="box-blue"/>
            <text x="140" y="170" class="small" fill="#3576C0">Hardware (CPU, RAM, устройства)</text>

            <rect x="180" y="200" width="600" height="300" class="box-yellow"/>
            <text x="200" y="230" class="small" fill="#C29E08">ОС — управляет, защищает, переключает</text>

            <rect x="240" y="260" width="240" height="200" class="box-green"/>
            <text x="260" y="290" class="small" fill="#73B222">Программа A</text>
            <text x="360" y="370" text-anchor="middle" class="text" font-weight="700">работает</text>
            <text x="360" y="395" text-anchor="middle" class="mono">x = 5; print(x)</text>

            <rect x="500" y="260" width="240" height="200" class="box-green"/>
            <text x="520" y="290" class="small" fill="#73B222">Программа B</text>
            <text x="620" y="370" text-anchor="middle" class="text" font-weight="700">работает</text>
            <text x="620" y="395" text-anchor="middle" class="mono">y = input()</text>

            <text x="480" y="585" text-anchor="middle" class="small">ОС незаметно держит весь зоопарк под контролем</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("os2-title").textContent = step.title;
        $("os2-subtitle").textContent = step.subtitle;
        $("os2-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("os2-scene").innerHTML = step.scene;
        $("os2-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("os2-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("os2-nextBtn").addEventListener("click", nextStep);
      $("os2-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

И финальное про ОС — как одновременно работают десятки программ, хотя ядер у процессора всего несколько.

<figure class="embedded-interactive" id="section-viz-os3">
  <div class="interactive-meta">Интерактив 16</div>
  <h3>Процессы, потоки и планировщик</h3>
  <p class="interactive-desc">7 шагов: процесс = запущенная программа → что хранит процесс → один поток → много потоков в процессе → пример браузера → много процессов → планировщик переключает контекст</p>
  <div class="interactive-svg-wrap">
<svg id="viz-os3" viewBox="0 0 960 680" width="100%" role="img" aria-label="Процессы, потоки и планировщик ОС">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 13px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                         text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                   text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="os3-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text id="os3-title" x="36" y="48" class="title"></text>
  <text id="os3-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="os3-scene"></g>

  <text id="os3-counter" x="36" y="635" class="text"></text>

  <g id="os3-prevGroup">
    <rect id="os3-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="os3-nextGroup">
    <rect id="os3-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="os3-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-os3");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Процесс — это запущенная программа",
          subtitle: "Файл на диске и работающая программа — это разные вещи",
          scene: `
            <rect x="80" y="240" width="320" height="180" class="box-blue"/>
            <text x="240" y="290" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Программа</text>
            <text x="240" y="320" text-anchor="middle" class="small">файл на диске</text>
            <text x="240" y="360" text-anchor="middle" class="mono">program.exe</text>
            <text x="240" y="390" text-anchor="middle" class="small">просто лежит</text>

            <text x="480" y="335" text-anchor="middle" font-size="36" font-weight="800" fill="#5E5850">→</text>

            <rect x="560" y="240" width="320" height="180" class="box-yellow"/>
            <text x="720" y="290" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Процесс</text>
            <text x="720" y="320" text-anchor="middle" class="small">запущенный экземпляр в RAM</text>
            <text x="720" y="360" text-anchor="middle" class="mono">PID: 4521</text>
            <text x="720" y="390" text-anchor="middle" class="small">работает прямо сейчас</text>

            <text x="480" y="495" text-anchor="middle" class="text">Один файл программы можно запустить много раз —</text>
            <text x="480" y="520" text-anchor="middle" class="text">каждый раз будет новый процесс</text>
          `
        },
        {
          title: "Шаг 2. Что хранит процесс",
          subtitle: "Процесс — это код плюс всё его текущее состояние",
          scene: `
            <rect x="180" y="160" width="600" height="400" class="box-yellow"/>
            <text x="200" y="190" class="text" font-size="18" font-weight="700" fill="#C29E08">Процесс</text>

            <rect x="230" y="220" width="240" height="90" class="box-yellow"/>
            <text x="350" y="255" text-anchor="middle" class="text" font-weight="700">Код</text>
            <text x="350" y="280" text-anchor="middle" class="small">инструкции программы</text>

            <rect x="490" y="220" width="260" height="90" class="box-yellow"/>
            <text x="620" y="255" text-anchor="middle" class="text" font-weight="700">Данные</text>
            <text x="620" y="280" text-anchor="middle" class="small">переменные, состояние</text>

            <rect x="230" y="330" width="240" height="90" class="box-yellow"/>
            <text x="350" y="365" text-anchor="middle" class="text" font-weight="700">Стек</text>
            <text x="350" y="390" text-anchor="middle" class="small">вызовы функций</text>

            <rect x="490" y="330" width="260" height="90" class="box-yellow"/>
            <text x="620" y="365" text-anchor="middle" class="text" font-weight="700">Ресурсы</text>
            <text x="620" y="390" text-anchor="middle" class="small">файлы, сеть, память</text>

            <rect x="350" y="440" width="260" height="90" class="box-yellow"/>
            <text x="480" y="475" text-anchor="middle" class="text" font-weight="700">Регистры CPU</text>
            <text x="480" y="500" text-anchor="middle" class="small">«где я сейчас в коде»</text>
          `
        },
        {
          title: "Шаг 3. Один поток — последовательное выполнение",
          subtitle: "Поток — это «нить» выполнения внутри процесса, идущая шаг за шагом",
          scene: `
            <rect x="200" y="170" width="560" height="200" class="box-yellow"/>
            <text x="220" y="200" class="small" fill="#C29E08">Процесс</text>

            <rect x="280" y="220" width="400" height="130" class="box-green"/>
            <text x="480" y="255" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Поток (thread)</text>
            <text x="480" y="290" text-anchor="middle" class="mono">x = 5</text>
            <text x="480" y="313" text-anchor="middle" class="mono">y = x + 1</text>
            <text x="480" y="336" text-anchor="middle" class="mono">print(y)</text>

            <line x1="80" y1="450" x2="880" y2="450" stroke="#5E5850" stroke-width="2" marker-end="url(#os3-arrowGray)"/>
            <text x="875" y="475" class="small" text-anchor="end">время</text>

            <rect x="80" y="420" width="160" height="40" class="box-green"/>
            <text x="160" y="445" text-anchor="middle" class="small">x = 5</text>
            <rect x="260" y="420" width="220" height="40" class="box-green"/>
            <text x="370" y="445" text-anchor="middle" class="small">y = x + 1</text>
            <rect x="500" y="420" width="200" height="40" class="box-green"/>
            <text x="600" y="445" text-anchor="middle" class="small">print(y)</text>

            <text x="480" y="525" text-anchor="middle" class="text">Один поток выполняет команды по очереди — никакой параллельности</text>
          `
        },
        {
          title: "Шаг 4. Несколько потоков в одном процессе",
          subtitle: "Внутри одного процесса можно запустить несколько независимых потоков",
          scene: `
            <rect x="100" y="150" width="760" height="380" class="box-yellow"/>
            <text x="120" y="180" class="text" font-size="18" font-weight="700" fill="#C29E08">Процесс</text>

            <rect x="160" y="220" width="220" height="140" class="box-green"/>
            <text x="270" y="252" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Поток 1</text>
            <text x="270" y="290" text-anchor="middle" class="mono">x = 5</text>
            <text x="270" y="315" text-anchor="middle" class="mono">print(x)</text>

            <rect x="410" y="220" width="220" height="140" class="box-green"/>
            <text x="520" y="252" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Поток 2</text>
            <text x="520" y="290" text-anchor="middle" class="mono">y = input()</text>
            <text x="520" y="315" text-anchor="middle" class="mono">print(y)</text>

            <rect x="660" y="220" width="180" height="140" class="box-green"/>
            <text x="750" y="252" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Поток 3</text>
            <text x="750" y="290" text-anchor="middle" class="mono">z = int(input())</text>
            <text x="750" y="315" text-anchor="middle" class="mono">print(y + z)</text>

            <text x="480" y="400" text-anchor="middle" class="text">Все потоки живут в одном процессе и делят его память</text>
            <text x="480" y="425" text-anchor="middle" class="small">но выполняются как будто независимо — каждый занимается своим делом</text>

            <text x="480" y="500" text-anchor="middle" class="small">Это нужно, когда программе надо делать несколько вещей сразу</text>
          `
        },
        {
          title: "Шаг 5. Пример: браузер — один процесс, много потоков",
          subtitle: "Браузер не «застывает», пока загружается видео, потому что у него много потоков",
          scene: `
            <rect x="100" y="140" width="760" height="420" class="box-yellow"/>
            <text x="120" y="170" class="text" font-size="18" font-weight="700" fill="#C29E08">Браузер (один процесс)</text>

            <rect x="140" y="200" width="220" height="100" class="box-green"/>
            <text x="250" y="232" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Поток UI</text>
            <text x="250" y="262" text-anchor="middle" class="small">кнопки, скролл,</text>
            <text x="250" y="282" text-anchor="middle" class="small">реакция на клики</text>

            <rect x="380" y="200" width="220" height="100" class="box-green"/>
            <text x="490" y="232" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Поток сети</text>
            <text x="490" y="262" text-anchor="middle" class="small">скачивает страницу,</text>
            <text x="490" y="282" text-anchor="middle" class="small">картинки, видео</text>

            <rect x="620" y="200" width="220" height="100" class="box-green"/>
            <text x="730" y="232" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Поток рендера</text>
            <text x="730" y="262" text-anchor="middle" class="small">рисует пиксели</text>
            <text x="730" y="282" text-anchor="middle" class="small">на экране</text>

            <rect x="260" y="330" width="220" height="100" class="box-green"/>
            <text x="370" y="362" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Поток JS</text>
            <text x="370" y="392" text-anchor="middle" class="small">выполняет скрипты</text>
            <text x="370" y="412" text-anchor="middle" class="small">страницы</text>

            <rect x="500" y="330" width="220" height="100" class="box-green"/>
            <text x="610" y="362" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Поток видео</text>
            <text x="610" y="392" text-anchor="middle" class="small">декодирует кадры</text>
            <text x="610" y="412" text-anchor="middle" class="small">YouTube</text>

            <text x="480" y="500" text-anchor="middle" class="small">Пока один поток ждёт интернет — другой уже рисует то, что пришло</text>
          `
        },
        {
          title: "Шаг 6. Многозадачность — много процессов сразу",
          subtitle: "Каждое запущенное приложение — это отдельный процесс",
          scene: `
            <text x="480" y="155" text-anchor="middle" class="text" font-weight="700">Несколько программ — несколько процессов</text>

            <rect x="60" y="195" width="200" height="125" class="box-yellow"/>
            <text x="160" y="230" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Браузер</text>
            <text x="160" y="265" text-anchor="middle" class="small">процесс #1234</text>
            <text x="160" y="290" text-anchor="middle" class="small">5 потоков</text>

            <rect x="280" y="195" width="200" height="125" class="box-yellow"/>
            <text x="380" y="230" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">VS Code</text>
            <text x="380" y="265" text-anchor="middle" class="small">процесс #5678</text>
            <text x="380" y="290" text-anchor="middle" class="small">12 потоков</text>

            <rect x="500" y="195" width="200" height="125" class="box-yellow"/>
            <text x="600" y="230" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Spotify</text>
            <text x="600" y="265" text-anchor="middle" class="small">процесс #9012</text>
            <text x="600" y="290" text-anchor="middle" class="small">8 потоков</text>

            <rect x="720" y="195" width="180" height="125" class="box-yellow"/>
            <text x="810" y="230" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Telegram</text>
            <text x="810" y="265" text-anchor="middle" class="small">процесс #3456</text>
            <text x="810" y="290" text-anchor="middle" class="small">6 потоков</text>

            <line x1="160" y1="320" x2="430" y2="400" stroke="#5E5850" stroke-width="1.4" marker-end="url(#os3-arrowGray)"/>
            <line x1="380" y1="320" x2="460" y2="400" stroke="#5E5850" stroke-width="1.4" marker-end="url(#os3-arrowGray)"/>
            <line x1="600" y1="320" x2="500" y2="400" stroke="#5E5850" stroke-width="1.4" marker-end="url(#os3-arrowGray)"/>
            <line x1="810" y1="320" x2="530" y2="400" stroke="#5E5850" stroke-width="1.4" marker-end="url(#os3-arrowGray)"/>

            <rect x="370" y="410" width="220" height="80" class="box-blue"/>
            <text x="480" y="448" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">CPU</text>
            <text x="480" y="473" text-anchor="middle" class="small">один (или несколько ядер)</text>

            <text x="480" y="545" text-anchor="middle" class="small">Все процессы хотят CPU одновременно. Кто решает, кому когда давать?</text>
          `
        },
        {
          title: "Шаг 7. Планировщик ОС переключает контекст",
          subtitle: "ОС делит время CPU между процессами — каждый получает свой «кусочек»",
          scene: `
            <text x="480" y="150" text-anchor="middle" class="text" font-weight="700">CPU выполняет процессы по очереди — каждому несколько миллисекунд</text>

            <line x1="60" y1="320" x2="900" y2="320" stroke="#5E5850" stroke-width="2" marker-end="url(#os3-arrowGray)"/>
            <text x="895" y="347" class="small" text-anchor="end">время</text>

            <rect x="60" y="200" width="90" height="50" class="box-yellow"/>
            <text x="105" y="231" text-anchor="middle" class="small" fill="#C29E08">Браузер</text>
            <rect x="160" y="200" width="105" height="50" class="box-yellow"/>
            <text x="212" y="231" text-anchor="middle" class="small" fill="#C29E08">VS Code</text>
            <rect x="275" y="200" width="85" height="50" class="box-yellow"/>
            <text x="317" y="231" text-anchor="middle" class="small" fill="#C29E08">Spotify</text>
            <rect x="370" y="200" width="90" height="50" class="box-yellow"/>
            <text x="415" y="231" text-anchor="middle" class="small" fill="#C29E08">Браузер</text>
            <rect x="470" y="200" width="105" height="50" class="box-yellow"/>
            <text x="522" y="231" text-anchor="middle" class="small" fill="#C29E08">Telegram</text>
            <rect x="585" y="200" width="90" height="50" class="box-yellow"/>
            <text x="630" y="231" text-anchor="middle" class="small" fill="#C29E08">Браузер</text>
            <rect x="685" y="200" width="105" height="50" class="box-yellow"/>
            <text x="737" y="231" text-anchor="middle" class="small" fill="#C29E08">VS Code</text>
            <rect x="800" y="200" width="60" height="50" fill="none" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="3 3" rx="14"/>
            <text x="830" y="231" text-anchor="middle" class="small" fill="#5E5850">…</text>

            <text x="480" y="290" text-anchor="middle" class="small">переключение между процессами происходит сотни раз в секунду</text>

            <rect x="280" y="380" width="400" height="120" class="box-red"/>
            <text x="480" y="418" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">Планировщик ОС (scheduler)</text>
            <text x="480" y="448" text-anchor="middle" class="small">решает, какой процесс получит CPU следующим</text>
            <text x="480" y="470" text-anchor="middle" class="small">и сохраняет/восстанавливает «где остановились»</text>

            <text x="480" y="555" text-anchor="middle" class="text">«Одновременно» = «по очереди, но очень быстро»</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("os3-title").textContent = step.title;
        $("os3-subtitle").textContent = step.subtitle;
        $("os3-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("os3-scene").innerHTML = step.scene;
        $("os3-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("os3-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("os3-nextBtn").addEventListener("click", nextStep);
      $("os3-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Когда вам кажется, что браузер, музыка и редактор работают «одновременно», на самом деле планировщик ОС переключает их сотни раз в секунду. И всё это так быстро, что иллюзия параллельности безупречна.

---

## Часть 12. Что внутри процессора

Мы уже знаем, что CPU собран из транзисторов и вентилей. Теперь посмотрим на него глазами программиста: что в нём за блоки и как они между собой связаны.

<figure class="embedded-interactive" id="section-viz-exec1">
  <div class="interactive-meta">Интерактив 17</div>
  <h3>Что находится внутри процессора</h3>
  <p class="interactive-desc">6 шагов: три компонента CPU → ALU считает → регистры держат данные → CU дирижирует → ISA как язык процессора → разные ISA для разных архитектур</p>
  <div class="interactive-svg-wrap">
<svg id="viz-exec1" viewBox="0 0 960 680" width="100%" role="img" aria-label="Внутреннее устройство процессора">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                            text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                      text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="e1-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="e1-arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#3576C0"/>
    </marker>
  </defs>

  <text id="e1-title" x="36" y="48" class="title"></text>
  <text id="e1-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="e1-scene"></g>

  <text id="e1-counter" x="36" y="635" class="text"></text>

  <g id="e1-prevGroup">
    <rect id="e1-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="e1-nextGroup">
    <rect id="e1-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="e1-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-exec1");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. CPU — не монолит, а команда из трёх частей",
          subtitle: "Внутри процессора три ключевых устройства, каждое со своей ролью",
          scene: `
            <rect x="180" y="160" width="600" height="380" class="box-blue"/>
            <text x="200" y="190" class="text" font-size="18" font-weight="700" fill="#3576C0">CPU</text>

            <rect x="220" y="220" width="260" height="120" class="box-blue"/>
            <text x="350" y="265" text-anchor="middle" class="text" font-weight="700">ALU</text>
            <text x="350" y="290" text-anchor="middle" class="small">арифметико-логическое</text>
            <text x="350" y="310" text-anchor="middle" class="small">устройство</text>

            <rect x="500" y="220" width="260" height="120" class="box-blue"/>
            <text x="630" y="265" text-anchor="middle" class="text" font-weight="700">Регистры</text>
            <text x="630" y="290" text-anchor="middle" class="small">сверхбыстрая память</text>
            <text x="630" y="310" text-anchor="middle" class="small">внутри CPU</text>

            <rect x="220" y="370" width="540" height="140" class="box-blue"/>
            <text x="490" y="415" text-anchor="middle" class="text" font-weight="700">CU — Control Unit</text>
            <text x="490" y="440" text-anchor="middle" class="small">управляющее устройство — «дирижёр»</text>
            <text x="490" y="465" text-anchor="middle" class="small">говорит ALU и регистрам, что делать</text>

            <text x="480" y="585" text-anchor="middle" class="small">Разберём каждую часть по отдельности</text>
          `
        },
        {
          title: "Шаг 2. ALU — арифметика и логика",
          subtitle: "Здесь происходят все вычисления процессора",
          scene: `
            <rect x="180" y="170" width="600" height="380" class="box-blue" stroke-dasharray="3 3"/>
            <text x="200" y="200" class="text" font-size="16" fill="#5E5850">CPU</text>

            <rect x="220" y="220" width="260" height="120" class="box-blue" stroke-width="2.5"/>
            <text x="350" y="270" text-anchor="middle" class="text" font-size="20" font-weight="800" fill="#3576C0">ALU</text>
            <text x="350" y="298" text-anchor="middle" class="small">здесь работает математика</text>

            <rect x="500" y="220" width="260" height="120" fill="none" stroke="#cccccc" stroke-width="1" stroke-dasharray="3 3" rx="14"/>
            <text x="630" y="285" text-anchor="middle" class="small" fill="#cccccc">Регистры</text>

            <rect x="220" y="370" width="540" height="140" fill="none" stroke="#cccccc" stroke-width="1" stroke-dasharray="3 3" rx="14"/>
            <text x="490" y="440" text-anchor="middle" class="small" fill="#cccccc">CU</text>

            <text x="120" y="595" class="text" font-weight="700">Что умеет ALU:</text>
            <text x="270" y="595" class="small">+ − × ÷ · сравнения · И/ИЛИ/НЕ · сдвиги бит</text>
            <text x="120" y="620" class="small">Например: получает на вход 7 и 5 — возвращает 12</text>
          `
        },
        {
          title: "Шаг 3. Регистры — самая быстрая память",
          subtitle: "Несколько ячеек прямо внутри CPU — для текущих чисел и адресов",
          scene: `
            <rect x="180" y="170" width="600" height="380" class="box-blue" stroke-dasharray="3 3"/>
            <text x="200" y="200" class="text" font-size="16" fill="#5E5850">CPU</text>

            <rect x="220" y="220" width="260" height="120" fill="none" stroke="#cccccc" stroke-width="1" stroke-dasharray="3 3" rx="14"/>
            <text x="350" y="285" text-anchor="middle" class="small" fill="#cccccc">ALU</text>

            <rect x="500" y="220" width="260" height="120" class="box-blue" stroke-width="2.5"/>
            <text x="630" y="255" text-anchor="middle" class="text" font-size="18" font-weight="800" fill="#3576C0">Регистры</text>

            <rect x="520" y="275" width="100" height="25" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="4"/>
            <text x="525" y="293" class="small">EAX:</text>
            <text x="610" y="293" text-anchor="end" class="mono">7</text>

            <rect x="640" y="275" width="100" height="25" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="4"/>
            <text x="645" y="293" class="small">EBX:</text>
            <text x="730" y="293" text-anchor="end" class="mono">5</text>

            <rect x="520" y="307" width="100" height="25" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="4"/>
            <text x="525" y="325" class="small">IP:</text>
            <text x="610" y="325" text-anchor="end" class="mono">0xF1</text>

            <rect x="640" y="307" width="100" height="25" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="4"/>
            <text x="645" y="325" class="small">ECX:</text>
            <text x="730" y="325" text-anchor="end" class="mono">12</text>

            <rect x="220" y="370" width="540" height="140" fill="none" stroke="#cccccc" stroke-width="1" stroke-dasharray="3 3" rx="14"/>
            <text x="490" y="440" text-anchor="middle" class="small" fill="#cccccc">CU</text>

            <text x="480" y="590" text-anchor="middle" class="small">RAM далеко и медленно, регистры — здесь и сейчас (в десятки раз быстрее)</text>
          `
        },
        {
          title: "Шаг 4. CU — управляющее устройство",
          subtitle: "Дирижёр оркестра: читает инструкцию и говорит остальным, что делать",
          scene: `
            <rect x="180" y="170" width="600" height="380" class="box-blue" stroke-dasharray="3 3"/>
            <text x="200" y="200" class="text" font-size="16" fill="#5E5850">CPU</text>

            <rect x="220" y="220" width="260" height="120" fill="none" stroke="#cccccc" stroke-width="1" stroke-dasharray="3 3" rx="14"/>
            <text x="350" y="285" text-anchor="middle" class="small" fill="#cccccc">ALU</text>

            <rect x="500" y="220" width="260" height="120" fill="none" stroke="#cccccc" stroke-width="1" stroke-dasharray="3 3" rx="14"/>
            <text x="630" y="285" text-anchor="middle" class="small" fill="#cccccc">Регистры</text>

            <rect x="220" y="370" width="540" height="140" class="box-blue" stroke-width="2.5"/>
            <text x="490" y="410" text-anchor="middle" class="text" font-size="18" font-weight="800" fill="#3576C0">CU</text>
            <text x="490" y="438" text-anchor="middle" class="small">читает инструкции из памяти,</text>
            <text x="490" y="460" text-anchor="middle" class="small">декодирует их</text>
            <text x="490" y="482" text-anchor="middle" class="small">и управляет работой ALU и регистров</text>

            <line x1="350" y1="370" x2="350" y2="340" stroke="#3576C0" stroke-width="1.5" marker-end="url(#e1-arrowBlue)"/>
            <line x1="630" y1="370" x2="630" y2="340" stroke="#3576C0" stroke-width="1.5" marker-end="url(#e1-arrowBlue)"/>

            <text x="480" y="595" text-anchor="middle" class="small">Сам CU ничего не считает — он только координирует работу остальных</text>
          `
        },
        {
          title: "Шаг 5. ISA — словарь команд процессора",
          subtitle: "Instruction Set Architecture — список инструкций, которые CPU умеет выполнять",
          scene: `
            <rect x="280" y="140" width="400" height="80" class="box-yellow"/>
            <text x="480" y="175" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#C29E08">ISA</text>
            <text x="480" y="200" text-anchor="middle" class="small">Instruction Set Architecture</text>

            <rect x="120" y="260" width="720" height="240" class="box-blue"/>
            <text x="480" y="290" text-anchor="middle" class="small" fill="#3576C0">примеры инструкций x86 ISA:</text>

            <rect x="150" y="310" width="320" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="170" y="335" class="mono">MOV EAX, 7</text>
            <text x="320" y="335" class="small">→ положить 7 в регистр EAX</text>

            <rect x="490" y="310" width="320" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="510" y="335" class="mono">ADD EAX, EBX</text>
            <text x="670" y="335" class="small">→ сложить EAX и EBX</text>

            <rect x="150" y="360" width="320" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="170" y="385" class="mono">CMP EAX, 10</text>
            <text x="320" y="385" class="small">→ сравнить EAX и 10</text>

            <rect x="490" y="360" width="320" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="510" y="385" class="mono">JMP 0xF4</text>
            <text x="660" y="385" class="small">→ прыгнуть на адрес 0xF4</text>

            <rect x="150" y="410" width="320" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="170" y="435" class="mono">PUSH EAX</text>
            <text x="320" y="435" class="small">→ положить EAX на стек</text>

            <rect x="490" y="410" width="320" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="510" y="435" class="mono">RET</text>
            <text x="600" y="435" class="small">→ вернуться из функции</text>

            <text x="480" y="475" text-anchor="middle" class="small">…и ещё несколько сотен подобных команд</text>

            <text x="480" y="570" text-anchor="middle" class="text">ISA — это «язык» процессора, на котором с ним разговаривают программы</text>
          `
        },
        {
          title: "Шаг 6. Разные процессоры — разные ISA",
          subtitle: "x86, ARM, RISC-V — у каждой архитектуры свой набор команд",
          scene: `
            <rect x="40" y="170" width="280" height="200" class="box-blue"/>
            <text x="180" y="210" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">x86 / x64</text>
            <text x="180" y="240" text-anchor="middle" class="small">Intel, AMD</text>
            <line x1="60" y1="255" x2="300" y2="255" stroke="#e0e0e0" stroke-width="1"/>
            <text x="180" y="285" text-anchor="middle" class="mono">MOV EAX, 7</text>
            <text x="180" y="310" text-anchor="middle" class="mono">ADD EAX, EBX</text>
            <text x="180" y="340" text-anchor="middle" class="small">~1500 инструкций</text>

            <rect x="340" y="170" width="280" height="200" class="box-blue"/>
            <text x="480" y="210" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">ARM</text>
            <text x="480" y="240" text-anchor="middle" class="small">Apple, телефоны, IoT</text>
            <line x1="360" y1="255" x2="600" y2="255" stroke="#e0e0e0" stroke-width="1"/>
            <text x="480" y="285" text-anchor="middle" class="mono">MOV R0, #7</text>
            <text x="480" y="310" text-anchor="middle" class="mono">ADD R0, R0, R1</text>
            <text x="480" y="340" text-anchor="middle" class="small">~400 инструкций</text>

            <rect x="640" y="170" width="280" height="200" class="box-blue"/>
            <text x="780" y="210" text-anchor="middle" class="text" font-size="18" font-weight="700" fill="#3576C0">RISC-V</text>
            <text x="780" y="240" text-anchor="middle" class="small">открытая архитектура</text>
            <line x1="660" y1="255" x2="900" y2="255" stroke="#e0e0e0" stroke-width="1"/>
            <text x="780" y="285" text-anchor="middle" class="mono">li x5, 7</text>
            <text x="780" y="310" text-anchor="middle" class="mono">add x5, x5, x6</text>
            <text x="780" y="340" text-anchor="middle" class="small">~50 базовых</text>

            <text x="480" y="430" text-anchor="middle" class="text">Одна и та же операция — «положить 7 в регистр и прибавить другой» —</text>
            <text x="480" y="460" text-anchor="middle" class="text">записывается по-разному в разных ISA</text>

            <text x="480" y="525" text-anchor="middle" class="small">Поэтому файлы программ для x86 не запустятся на ARM — нужна перекомпиляция</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("e1-title").textContent = step.title;
        $("e1-subtitle").textContent = step.subtitle;
        $("e1-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("e1-scene").innerHTML = step.scene;
        $("e1-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("e1-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("e1-nextBtn").addEventListener("click", nextStep);
      $("e1-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

У каждого процессора есть свой «словарь» — набор команд, которые он понимает. Это называется ISA (Instruction Set Architecture). У Intel свой, у ARM свой, у RISC-V свой. Поэтому программа, скомпилированная под Intel, не запустится на iPhone — там другая ISA.

---

## Часть 13. Как процессор выполняет инструкции

Каждая инструкция, которую процессор когда-либо выполнял, прошла через один и тот же цикл из четырёх фаз. Он повторяется миллиарды раз в секунду — и за этим простым циклом стоят все ваши приложения, игры и тиктоки.

<figure class="embedded-interactive" id="section-viz-exec2">
  <div class="interactive-meta">Интерактив 18</div>
  <h3>Цикл выполнения: Fetch → Decode → Execute → Writeback</h3>
  <p class="interactive-desc">7 шагов: обзор четырёх фаз → Fetch (берём инструкцию) → Decode (расшифровываем) → Execute (выполняем) → Writeback (сохраняем) → IP сдвигается → такты и pipeline</p>
  <div class="interactive-svg-wrap">
<svg id="viz-exec2" viewBox="0 0 960 680" width="100%" role="img" aria-label="Цикл выполнения инструкций">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                            text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                      text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="e2-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="e2-arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#3576C0"/>
    </marker>
    <marker id="e2-arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#73B222"/>
    </marker>
    <marker id="e2-arrowYellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#C29E08"/>
    </marker>
  </defs>

  <text id="e2-title" x="36" y="48" class="title"></text>
  <text id="e2-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="e2-scene"></g>

  <text id="e2-counter" x="36" y="635" class="text"></text>

  <g id="e2-prevGroup">
    <rect id="e2-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="e2-nextGroup">
    <rect id="e2-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="e2-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-exec2");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      const steps = [
        {
          title: "Шаг 1. Любая инструкция проходит четыре фазы",
          subtitle: "CPU крутит один и тот же цикл — снова и снова, для каждой инструкции",
          scene: `
            <rect x="60" y="280" width="180" height="100" class="box-blue"/>
            <text x="150" y="320" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Fetch</text>
            <text x="150" y="345" text-anchor="middle" class="small">взять команду</text>

            <line x1="240" y1="330" x2="290" y2="330" stroke="#5E5850" stroke-width="2" marker-end="url(#e2-arrowGray)"/>

            <rect x="290" y="280" width="180" height="100" class="box-yellow"/>
            <text x="380" y="320" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Decode</text>
            <text x="380" y="345" text-anchor="middle" class="small">разобрать</text>

            <line x1="470" y1="330" x2="520" y2="330" stroke="#5E5850" stroke-width="2" marker-end="url(#e2-arrowGray)"/>

            <rect x="520" y="280" width="180" height="100" class="box-yellow"/>
            <text x="610" y="320" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Execute</text>
            <text x="610" y="345" text-anchor="middle" class="small">выполнить</text>

            <line x1="700" y1="330" x2="750" y2="330" stroke="#5E5850" stroke-width="2" marker-end="url(#e2-arrowGray)"/>

            <rect x="750" y="280" width="180" height="100" class="box-green"/>
            <text x="840" y="320" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Writeback</text>
            <text x="840" y="345" text-anchor="middle" class="small">сохранить</text>

            <path d="M 840,380 Q 840,460 480,460 Q 150,460 150,380" fill="none" stroke="#5E5850" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#e2-arrowGray)"/>
            <text x="480" y="485" text-anchor="middle" class="small">после Writeback — снова Fetch следующей инструкции</text>

            <text x="480" y="555" text-anchor="middle" class="text">Этот цикл повторяется миллиарды раз в секунду</text>
          `
        },
        {
          title: "Шаг 2. FETCH — взять инструкцию из памяти",
          subtitle: "Instruction Pointer (IP) указывает, какая инструкция следующая",
          scene: `
            <rect x="80" y="170" width="320" height="280" class="box-blue"/>
            <text x="100" y="200" class="text" font-size="16" font-weight="700" fill="#3576C0">CPU</text>

            <text x="240" y="230" text-anchor="middle" class="small">регистр IP (Instruction Pointer)</text>
            <rect x="120" y="245" width="240" height="50" class="box-blue" stroke-width="2.5"/>
            <text x="240" y="278" text-anchor="middle" class="mono" font-size="18">IP = 0xF1</text>

            <text x="240" y="335" text-anchor="middle" class="small">хранит адрес следующей</text>
            <text x="240" y="355" text-anchor="middle" class="small">инструкции для выполнения</text>

            <line x1="400" y1="300" x2="560" y2="300" stroke="#3576C0" stroke-width="2.5" marker-end="url(#e2-arrowBlue)"/>
            <text x="480" y="285" text-anchor="middle" class="small" fill="#3576C0">дай инструкцию</text>
            <text x="480" y="320" text-anchor="middle" class="small" fill="#3576C0">по адресу 0xF1</text>

            <rect x="560" y="170" width="320" height="280" class="box-yellow"/>
            <text x="580" y="200" class="text" font-size="16" font-weight="700" fill="#C29E08">RAM</text>

            <rect x="590" y="230" width="260" height="35" fill="#FFFBEB" stroke="#C29E08" stroke-width="2.5" rx="6"/>
            <text x="610" y="253" class="mono">0xF1:</text>
            <text x="680" y="253" class="mono">MOV EAX, 7</text>

            <rect x="590" y="270" width="260" height="35" fill="#ffffff" stroke="#C29E08" stroke-width="1" rx="6"/>
            <text x="610" y="293" class="mono">0xF2:</text>
            <text x="680" y="293" class="mono">MOV EBX, 5</text>

            <rect x="590" y="310" width="260" height="35" fill="#ffffff" stroke="#C29E08" stroke-width="1" rx="6"/>
            <text x="610" y="333" class="mono">0xF3:</text>
            <text x="680" y="333" class="mono">ADD EAX, EBX</text>

            <rect x="590" y="350" width="260" height="35" fill="#ffffff" stroke="#C29E08" stroke-width="1" rx="6"/>
            <text x="610" y="373" class="mono">0xF4:</text>
            <text x="680" y="373" class="mono">PRINT EAX</text>

            <text x="480" y="510" text-anchor="middle" class="text">CPU отправляет адрес → RAM возвращает инструкцию по этому адресу</text>
          `
        },
        {
          title: "Шаг 3. DECODE — расшифровать команду",
          subtitle: "Сырые байты превращаются в понятную инструкцию + её аргументы",
          scene: `
            <rect x="80" y="180" width="320" height="160" class="box-blue"/>
            <text x="240" y="220" text-anchor="middle" class="small">из RAM пришло:</text>
            <text x="240" y="260" text-anchor="middle" class="mono" font-size="18">10111000 00000111</text>
            <text x="240" y="295" text-anchor="middle" class="small">просто 16 бит — ещё ничего не значат</text>

            <line x1="400" y1="260" x2="560" y2="260" stroke="#C29E08" stroke-width="2.5" marker-end="url(#e2-arrowYellow)"/>
            <text x="480" y="245" text-anchor="middle" class="small" fill="#C29E08">CU декодирует</text>

            <rect x="560" y="180" width="320" height="160" class="box-yellow"/>
            <text x="720" y="220" text-anchor="middle" class="small">CU распознал:</text>
            <text x="720" y="252" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">это MOV</text>
            <text x="720" y="280" text-anchor="middle" class="small">регистр назначения: EAX</text>
            <text x="720" y="302" text-anchor="middle" class="small">значение: 7</text>

            <rect x="200" y="400" width="560" height="120" class="box-yellow"/>
            <text x="480" y="438" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">CU теперь знает три вещи:</text>
            <text x="480" y="468" text-anchor="middle" class="small">какую операцию делать (MOV) · откуда брать данные (число 7)</text>
            <text x="480" y="490" text-anchor="middle" class="small">куда складывать результат (регистр EAX)</text>

            <text x="480" y="575" text-anchor="middle" class="small">Разные ISA имеют разные форматы — поэтому ARM-биты декодируются иначе</text>
          `
        },
        {
          title: "Шаг 4. EXECUTE — выполнить операцию",
          subtitle: "CU отправляет команду в ALU или прямо в регистры",
          scene: `
            <rect x="80" y="170" width="800" height="350" class="box-blue"/>
            <text x="100" y="200" class="text" font-size="16" font-weight="700" fill="#3576C0">CPU</text>

            <rect x="140" y="230" width="240" height="100" class="box-blue"/>
            <text x="260" y="270" text-anchor="middle" class="text" font-weight="700">ALU</text>
            <text x="260" y="295" text-anchor="middle" class="small">7 + 5</text>
            <text x="260" y="315" text-anchor="middle" class="mono">= 12</text>

            <line x1="380" y1="280" x2="450" y2="280" stroke="#3576C0" stroke-width="2.5" marker-end="url(#e2-arrowBlue)"/>

            <rect x="450" y="230" width="240" height="100" class="box-blue"/>
            <text x="570" y="270" text-anchor="middle" class="text" font-weight="700">Регистры</text>
            <text x="570" y="295" text-anchor="middle" class="small">временно держат</text>
            <text x="570" y="315" text-anchor="middle" class="small">результат</text>

            <rect x="140" y="370" width="650" height="120" class="box-blue"/>
            <text x="465" y="410" text-anchor="middle" class="text" font-weight="700">CU — отдал приказ</text>
            <text x="465" y="438" text-anchor="middle" class="small">«ALU, сложи EAX и EBX»</text>
            <text x="465" y="462" text-anchor="middle" class="small">и подождал результат</text>

            <line x1="260" y1="370" x2="260" y2="330" stroke="#3576C0" stroke-width="1.5" marker-end="url(#e2-arrowBlue)"/>
            <line x1="570" y1="370" x2="570" y2="330" stroke="#3576C0" stroke-width="1.5" marker-end="url(#e2-arrowBlue)"/>

            <text x="480" y="580" text-anchor="middle" class="small">Простые инструкции (MOV) обходятся без ALU; арифметика и логика всегда идут через него</text>
          `
        },
        {
          title: "Шаг 5. WRITEBACK — записать результат",
          subtitle: "Результат сохраняется обратно в регистр или в RAM",
          scene: `
            <rect x="80" y="170" width="320" height="280" class="box-blue"/>
            <text x="100" y="200" class="text" font-size="16" font-weight="700" fill="#3576C0">CPU</text>

            <text x="240" y="240" text-anchor="middle" class="small">ALU посчитал:</text>
            <rect x="120" y="255" width="240" height="50" class="box-green"/>
            <text x="240" y="288" text-anchor="middle" class="mono" font-size="18" fill="#73B222">результат = 12</text>

            <text x="240" y="345" text-anchor="middle" class="small">нужно куда-то это положить</text>

            <line x1="400" y1="280" x2="560" y2="280" stroke="#73B222" stroke-width="2.5" marker-end="url(#e2-arrowGreen)"/>
            <text x="480" y="265" text-anchor="middle" class="small" fill="#73B222">записать в EAX</text>

            <rect x="560" y="170" width="320" height="280" class="box-blue"/>
            <text x="580" y="200" class="text" font-size="16" font-weight="700" fill="#3576C0">Регистры</text>

            <rect x="590" y="230" width="260" height="40" fill="#F0FAF0" stroke="#73B222" stroke-width="2.5" rx="6"/>
            <text x="610" y="257" class="mono">EAX:</text>
            <text x="830" y="257" text-anchor="end" class="mono" fill="#73B222" font-weight="700">12</text>

            <rect x="590" y="275" width="260" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="610" y="302" class="mono">EBX:</text>
            <text x="830" y="302" text-anchor="end" class="mono">5</text>

            <rect x="590" y="320" width="260" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="610" y="347" class="mono">ECX:</text>
            <text x="830" y="347" text-anchor="end" class="mono">0</text>

            <rect x="590" y="365" width="260" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="610" y="392" class="mono">IP:</text>
            <text x="830" y="392" text-anchor="end" class="mono">0xF3</text>

            <text x="480" y="505" text-anchor="middle" class="text">Результат записан, состояние CPU обновилось</text>
          `
        },
        {
          title: "Шаг 6. IP сдвигается → следующий цикл",
          subtitle: "После Writeback CU обновляет Instruction Pointer и начинает Fetch заново",
          scene: `
            <rect x="120" y="170" width="720" height="120" class="box-blue"/>
            <text x="140" y="200" class="small" fill="#3576C0">после выполнения инструкции по 0xF1:</text>

            <rect x="160" y="220" width="280" height="50" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
            <text x="180" y="252" class="mono">IP было: 0xF1</text>

            <line x1="450" y1="245" x2="510" y2="245" stroke="#3576C0" stroke-width="2.5" marker-end="url(#e2-arrowBlue)"/>

            <rect x="520" y="220" width="280" height="50" class="box-blue" stroke-width="2.5"/>
            <text x="540" y="252" class="mono" font-weight="700">IP стало: 0xF2</text>

            <line x1="480" y1="290" x2="480" y2="320" stroke="#5E5850" stroke-width="2" marker-end="url(#e2-arrowGray)"/>

            <rect x="120" y="335" width="160" height="80" class="box-blue"/>
            <text x="200" y="370" text-anchor="middle" class="text" font-weight="700" fill="#3576C0">Fetch</text>
            <text x="200" y="395" text-anchor="middle" class="small">по 0xF2</text>

            <line x1="280" y1="375" x2="320" y2="375" stroke="#5E5850" stroke-width="2" marker-end="url(#e2-arrowGray)"/>

            <rect x="320" y="335" width="160" height="80" class="box-yellow"/>
            <text x="400" y="370" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Decode</text>

            <line x1="480" y1="375" x2="520" y2="375" stroke="#5E5850" stroke-width="2" marker-end="url(#e2-arrowGray)"/>

            <rect x="520" y="335" width="160" height="80" class="box-yellow"/>
            <text x="600" y="370" text-anchor="middle" class="text" font-weight="700" fill="#C29E08">Execute</text>

            <line x1="680" y1="375" x2="720" y2="375" stroke="#5E5850" stroke-width="2" marker-end="url(#e2-arrowGray)"/>

            <rect x="720" y="335" width="160" height="80" class="box-green"/>
            <text x="800" y="370" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Writeback</text>

            <text x="480" y="490" text-anchor="middle" class="text">Цикл начинается заново — и так пока программа не закончится</text>
          `
        },
        {
          title: "Шаг 7. Внутри одного такта CPU",
          subtitle: "На частоте 3 ГГц процессор делает 3 миллиарда таких циклов в секунду",
          scene: `
            <text x="480" y="155" text-anchor="middle" class="text" font-weight="700">CPU тактовая частота 3 ГГц = 3 000 000 000 циклов в секунду</text>

            <line x1="60" y1="280" x2="900" y2="280" stroke="#5E5850" stroke-width="2" marker-end="url(#e2-arrowGray)"/>
            <text x="895" y="307" class="small" text-anchor="end">время</text>

            <rect x="80" y="220" width="170" height="50" class="box-blue"/>
            <text x="165" y="251" text-anchor="middle" class="small" fill="#3576C0">Fetch</text>

            <rect x="260" y="220" width="170" height="50" class="box-yellow"/>
            <text x="345" y="251" text-anchor="middle" class="small" fill="#C29E08">Decode</text>

            <rect x="440" y="220" width="170" height="50" class="box-yellow"/>
            <text x="525" y="251" text-anchor="middle" class="small" fill="#C29E08">Execute</text>

            <rect x="620" y="220" width="170" height="50" class="box-green"/>
            <text x="705" y="251" text-anchor="middle" class="small" fill="#73B222">Writeback</text>

            <rect x="800" y="220" width="100" height="50" fill="none" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="3 3" rx="14"/>
            <text x="850" y="251" text-anchor="middle" class="small" fill="#5E5850">Fetch…</text>

            <text x="480" y="335" text-anchor="middle" class="small">один такой цикл — это примерно 0.3 наносекунды</text>

            <rect x="180" y="380" width="600" height="120" class="box-red"/>
            <text x="480" y="418" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">Современный фокус</text>
            <text x="480" y="448" text-anchor="middle" class="small">реальные CPU выполняют несколько инструкций одновременно (pipeline)</text>
            <text x="480" y="472" text-anchor="middle" class="small">пока одна Execute — следующая уже Decode, а ещё одна Fetch</text>

            <text x="480" y="580" text-anchor="middle" class="small">Поэтому скорость ≫ простой формулы «частота × 1 инструкция за цикл»</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("e2-title").textContent = step.title;
        $("e2-subtitle").textContent = step.subtitle;
        $("e2-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("e2-scene").innerHTML = step.scene;
        $("e2-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("e2-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("e2-nextBtn").addEventListener("click", nextStep);
      $("e2-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

И самое наглядное — посмотрим, как небольшая программа из четырёх строчек реально проходит через CPU, такт за тактом.

<figure class="embedded-interactive" id="section-viz-exec3">
  <div class="interactive-meta">Интерактив 19</div>
  <h3>Выполним программу пошагово</h3>
  <p class="interactive-desc">7 шагов: программа загружена → такт 1 (a=7) → такт 2 (b=5) → такт 3 (c=a+b с использованием ALU) → такт 4 (print) → состояние после программы → весь путь от Python до исполнения</p>
  <div class="interactive-svg-wrap">
<svg id="viz-exec3" viewBox="0 0 960 680" width="100%" role="img" aria-label="Пошаговое выполнение программы">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .mono { font-family: "Courier New", monospace; font-size: 14px; fill: #111111; }
    .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    .box-gray   { fill: #F5F5F5; stroke: #5E5850; stroke-width: 1.45; rx: 14; }
    .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                            text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                      text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="e3-arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#5E5850"/>
    </marker>
    <marker id="e3-arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#3576C0"/>
    </marker>
    <marker id="e3-arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#73B222"/>
    </marker>
  </defs>

  <text id="e3-title" x="36" y="48" class="title"></text>
  <text id="e3-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="e3-scene"></g>

  <text id="e3-counter" x="36" y="635" class="text"></text>

  <g id="e3-prevGroup">
    <rect id="e3-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="e3-nextGroup">
    <rect id="e3-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="e3-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  
</svg>
  </div>
<script>
    (function () {
      const svg = document.getElementById("viz-exec3");
      if (!svg || svg.dataset.vizReady === "1") return;
      svg.dataset.vizReady = "1";
      const $ = (id) => svg.querySelector("#" + id);

      // helper: standard layout reused across all steps
      // RAM on the right with 4 instructions at addresses 0xF1..0xF4
      // CPU panel on the left with IP and registers
      function layout(opts) {
        const ip = opts.ip;            // current IP value, e.g. "0xF1"
        const eax = opts.eax;          // value of a / EAX (or "?")
        const ebx = opts.ebx;          // value of b / EBX
        const ecx = opts.ecx;          // value of c / ECX
        const out = opts.out || "";    // program output so far
        const highlight = opts.highlight; // address of instruction in RAM to highlight: "0xF1".."0xF4"
        const note = opts.note || "";

        const ramRow = (addr, instr, comment, y) => {
          const isHi = (highlight === addr);
          const fill = isHi ? "#FFFBEB" : "#ffffff";
          const stroke = isHi ? "#C29E08" : "#3576C0";
          const sw = isHi ? "2.5" : "1";
          return `
            <rect x="540" y="${y}" width="340" height="40" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" rx="6"/>
            <text x="560" y="${y+25}" class="mono">${addr}:</text>
            <text x="630" y="${y+25}" class="mono">${instr}</text>
            <text x="800" y="${y+25}" class="small">${comment}</text>
          `;
        };

        return `
          <rect x="60" y="120" width="440" height="420" class="box-blue"/>
          <text x="80" y="150" class="text" font-size="16" font-weight="700" fill="#3576C0">CPU</text>

          <text x="100" y="180" class="small">IP (Instruction Pointer):</text>
          <rect x="100" y="190" width="360" height="40" class="box-blue" stroke-width="2"/>
          <text x="280" y="217" text-anchor="middle" class="mono" font-size="16" font-weight="700">${ip}</text>

          <text x="100" y="260" class="small">Регистры:</text>
          <rect x="100" y="275" width="170" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
          <text x="115" y="300" class="mono">EAX (a):</text>
          <text x="255" y="300" text-anchor="end" class="mono">${eax}</text>

          <rect x="290" y="275" width="170" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
          <text x="305" y="300" class="mono">EBX (b):</text>
          <text x="445" y="300" text-anchor="end" class="mono">${ebx}</text>

          <rect x="100" y="320" width="170" height="40" fill="#ffffff" stroke="#3576C0" stroke-width="1" rx="6"/>
          <text x="115" y="345" class="mono">ECX (c):</text>
          <text x="255" y="345" text-anchor="end" class="mono">${ecx}</text>

          <text x="100" y="395" class="small">Вывод программы:</text>
          <rect x="100" y="410" width="360" height="100" class="box-green"/>
          <text x="120" y="445" class="mono" fill="#73B222">${out}</text>

          <rect x="520" y="120" width="380" height="420" class="box-yellow"/>
          <text x="540" y="150" class="text" font-size="16" font-weight="700" fill="#C29E08">RAM (программа)</text>

          ${ramRow("0xF1", "MOV EAX, 7",   "// a = 7",      180)}
          ${ramRow("0xF2", "MOV EBX, 5",   "// b = 5",      225)}
          ${ramRow("0xF3", "ADD EAX, EBX", "// c = a+b",    270)}
          ${ramRow("0xF4", "PRINT EAX",    "// print(c)",   315)}

          <text x="480" y="595" text-anchor="middle" class="text">${note}</text>
        `;
      }

      const steps = [
        {
          title: "Шаг 1. Программа загружена в память",
          subtitle: "Каждая строка кода превратилась в инструкцию по конкретному адресу RAM",
          scene: layout({
            ip: "0xF1",
            eax: "—", ebx: "—", ecx: "—",
            out: "",
            highlight: null,
            note: "Регистры пусты, IP смотрит на первую инструкцию — готовы стартовать"
          })
        },
        {
          title: "Шаг 2. Такт 1 — выполняем a = 7  (адрес 0xF1)",
          subtitle: "Fetch 0xF1 → Decode MOV EAX,7 → Execute (просто значение) → Writeback в EAX",
          scene: layout({
            ip: "0xF1 → 0xF2",
            eax: "7", ebx: "—", ecx: "—",
            out: "",
            highlight: "0xF1",
            note: "EAX = 7. IP сдвигается на 0xF2 — следующая инструкция готова"
          })
        },
        {
          title: "Шаг 3. Такт 2 — выполняем b = 5  (адрес 0xF2)",
          subtitle: "Тот же цикл из 4 фаз, но другая инструкция и другой регистр",
          scene: layout({
            ip: "0xF2 → 0xF3",
            eax: "7", ebx: "5", ecx: "—",
            out: "",
            highlight: "0xF2",
            note: "EBX = 5. EAX не тронут — он по-прежнему 7"
          })
        },
        {
          title: "Шаг 4. Такт 3 — вычисляем c = a + b  (адрес 0xF3)",
          subtitle: "Самое интересное — ADD: впервые в работу включается ALU",
          scene: layout({
            ip: "0xF3 → 0xF4",
            eax: "12", ebx: "5", ecx: "—",
            out: "",
            highlight: "0xF3",
            note: "Активно ALU: сложило EAX(7) и EBX(5), результат 12 вернулся в EAX"
          }) + `
            <rect x="290" y="320" width="170" height="40" class="box-yellow" stroke-width="2.5"/>
            <text x="375" y="346" text-anchor="middle" class="mono" font-weight="700" fill="#C29E08">ALU: 7+5</text>
          `
        },
        {
          title: "Шаг 5. Такт 4 — выводим результат  (адрес 0xF4)",
          subtitle: "PRINT EAX — CPU отправляет значение из EAX устройству вывода",
          scene: layout({
            ip: "0xF4 → конец",
            eax: "12", ebx: "5", ecx: "—",
            out: "12",
            highlight: "0xF4",
            note: "На экране (или в консоли) появилось 12. Программа закончилась"
          })
        },
        {
          title: "Шаг 6. Что осталось после программы",
          subtitle: "Регистры всё ещё хранят последние значения — но программа завершена",
          scene: layout({
            ip: "конец программы",
            eax: "12", ebx: "5", ecx: "—",
            out: "12",
            highlight: null,
            note: "Заметьте: переменной c в регистрах нет — компилятор оптимизировал её в EAX"
          })
        },
        {
          title: "Шаг 7. Что мы только что увидели",
          subtitle: "Четыре строчки Python превратились в 4 цикла Fetch-Decode-Execute-Writeback",
          scene: `
            <text x="480" y="125" text-anchor="middle" class="text" font-weight="700">Программа из 4 строк</text>

            <rect x="80" y="150" width="400" height="180" class="box-blue"/>
            <text x="100" y="180" class="small" fill="#3576C0">Python (то, что писал человек)</text>
            <text x="110" y="215" class="mono">a = 7</text>
            <text x="110" y="240" class="mono">b = 5</text>
            <text x="110" y="265" class="mono">c = a + b</text>
            <text x="110" y="290" class="mono">print(c)</text>

            <line x1="480" y1="240" x2="540" y2="240" stroke="#5E5850" stroke-width="2" marker-end="url(#e3-arrowGray)"/>

            <rect x="540" y="150" width="380" height="180" class="box-yellow"/>
            <text x="560" y="180" class="small" fill="#C29E08">машинный код (что выполнял CPU)</text>
            <text x="570" y="215" class="mono">0xF1: MOV EAX, 7</text>
            <text x="570" y="240" class="mono">0xF2: MOV EBX, 5</text>
            <text x="570" y="265" class="mono">0xF3: ADD EAX, EBX</text>
            <text x="570" y="290" class="mono">0xF4: PRINT EAX</text>

            <rect x="180" y="370" width="600" height="160" class="box-green"/>
            <text x="480" y="405" text-anchor="middle" class="text" font-weight="700" fill="#73B222">Итог</text>
            <text x="480" y="435" text-anchor="middle" class="small">CPU прокрутил цикл Fetch-Decode-Execute-Writeback четыре раза</text>
            <text x="480" y="460" text-anchor="middle" class="small">IP двигался: 0xF1 → 0xF2 → 0xF3 → 0xF4</text>
            <text x="480" y="490" text-anchor="middle" class="small">Реальная программа делает миллионы таких циклов за один клик мышью</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("e3-title").textContent = step.title;
        $("e3-subtitle").textContent = step.subtitle;
        $("e3-counter").textContent = (currentStep + 1) + " из " + steps.length;
        $("e3-scene").innerHTML = step.scene;
        $("e3-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("e3-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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

      $("e3-nextBtn").addEventListener("click", nextStep);
      $("e3-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  
</script>
</figure>

Вот и всё. Простая программа <code>a=7; b=5; c=a+b; print(c)</code> прошла через четыре цикла Fetch-Decode-Execute-Writeback. CPU прочитал инструкции, ALU сложило числа, регистры подержали промежуточные значения, результат вывелся на экран. И всё это — на электронах, бегущих через транзисторы.

---

## Заключение: вся картина целиком

Давайте окинем взглядом то, что мы прошли:

- Внизу — <strong>электроны</strong>. Маленькие частицы с отрицательным зарядом, которые могут двигаться по проводам.
- Их движение — это <strong>электрический ток</strong>, который мы научились включать и выключать.
- Самый простой управляемый переключатель тока — <strong>транзистор</strong>. Маленькая штучка с тремя ножками.
- Соединив транзисторы определёнными способами, получаем <strong>логические вентили</strong>: NOT, AND, OR. Они уже умеют принимать решения над нулями и единицами.
- Из этих нулей и единиц по правилам <strong>двоичной системы</strong> складываются числа. Несколько транзисторов рядом — это число.
- А любые данные — текст, картинки, звук — можно <strong>закодировать числами</strong>. Каждая буква, каждый пиксель, каждый звук имеют свой числовой код.
- Из вентилей собираются более сложные блоки: <strong>сумматоры, триггеры, мультиплексоры</strong>. Это уже арифметика и память.
- Из этих блоков складываются <strong>функциональные узлы CPU</strong>: ALU (считает), регистры (хранят данные), CU (управляет).
- Из узлов в сборе — <strong>процессор</strong>, который умеет выполнять инструкции из своего «словаря» ISA.
- Процессор работает с <strong>памятью</strong> (RAM, ROM) и <strong>устройствами ввода-вывода</strong> через драйверы.
- Всем этим хозяйством управляет <strong>операционная система</strong> — распределяет ресурсы, запускает программы, переключает контекст.
- Программы пишутся на <strong>языках программирования</strong>: их код переводится в машинный либо заранее (компилятор), либо на лету (интерпретатор).
- Запущенная программа — это <strong>процесс</strong>, у которого может быть много <strong>потоков</strong> выполнения.
- Когда CPU реально работает, он крутит цикл <strong>Fetch-Decode-Execute-Writeback</strong> — миллиарды раз в секунду.

И вот, когда вы пишете в Python обычное <code>print('Hello world')</code> — за кулисами происходит вся эта цепочка. Интерпретатор переводит вашу строчку в байт-код, потом в машинные инструкции. ОС загружает процесс в память. CPU читает инструкции одну за другой, ALU и регистры обмениваются данными, миллионы транзисторов открываются и закрываются. И на вашем экране появляются буквы.

Компьютер — это не магия. Это <strong>пляска электронов через миллиарды крошечных дверей</strong>. И мы теперь знаем, как она устроена.

---

## Что почитать дальше

- <a href="https://thecode.media/gumanitarniy-tok/">Статья Максима Ильяхова про ток</a> — гуманитарное объяснение электричества, на котором основано второе интерактивное объяснение.
- <a href="https://www.youtube.com/watch?v=oI_X2cMHNe0">Видео Veritasium о том, как на самом деле движется ток</a> — для тех, кто хочет узнать, что объяснение через «электроны текут как вода» — это упрощение.
- <a href="https://www.felixcloutier.com/x86/index.html">Felix Cloutier's x86 instruction reference</a> — справочник всех инструкций ISA Intel x86, если интересно посмотреть на реальный «язык» процессора.
