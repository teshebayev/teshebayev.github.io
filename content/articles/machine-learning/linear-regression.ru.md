Все модели машинного обучения — от линейной регрессии до огромных языковых моделей вроде GPT — обучаются по одному и тому же шаблону. Если разобраться, как работает линейная регрессия, дальше всё становится про «то же самое, только сложнее».

В этой статье мы пройдём этот путь от простого к общему. Сначала разберём линейную регрессию и идею функции потерь. Затем посмотрим, как находят оптимальные параметры с помощью градиентного спуска. И наконец увидим, что тот же самый цикл лежит в основе обучения нейросетей.

Каждая часть сопровождается интерактивной пошаговой визуализацией — нажимай «Далее» и иди по шагам.

---

## Часть 1. Линейная регрессия

Задача такая: у нас есть набор домов, для каждого известна площадь и цена. Хочется выучить зависимость, чтобы по площади предсказывать цену для новых домов.

Это типичная задача **регрессии** — предсказание непрерывного значения. На вход модели идёт **фича** (площадь, `sqft`), на выходе — **таргет** (цена, `price`). Между ними мы хотим найти зависимость.

Простейшая модель — линейная: предположим, что цена линейно зависит от площади.

```
ŷ = β̂₁ · x + β̂₀
```

У этой модели всего два параметра: `β̂₁` (наклон прямой) и `β̂₀` (свободный член). Задача обучения — подобрать их так, чтобы прямая как можно лучше проходила через наши данные.

Чтобы понять, насколько прямая «хорошая», нужно определить **функцию потерь** (loss function) — число, которое говорит, насколько модель ошибается. Самая популярная функция для регрессии — MSE (mean squared error):

```
MSE = (1/n) · Σ (yᵢ − ŷᵢ)²
```

Это среднее квадратов разностей между настоящей ценой и предсказанной. Чем MSE меньше — тем модель лучше.

> **Почему квадрат?** Возведение в квадрат делает две вещи: во-первых, не даёт положительным и отрицательным ошибкам сократить друг друга в сумме; во-вторых, сильнее штрафует большие промахи. Альтернативы есть (MAE, Huber и др.), но MSE — отправная точка по умолчанию.

Посмотрим всё это пошагово — от данных до обученной модели:

<figure class="embedded-interactive" id="section-interactive-1">
  <div class="interactive-meta">Интерактив 1</div>
  <p class="interactive-desc">Линейная регрессия: пошаговая интуиция</p>
<div class="interactive-svg-wrap">
<svg id="linregIntuition" viewBox="0 0 960 680" width="100%" role="img" aria-label="Линейная регрессия: пошаговая интуиция">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .label { font-size: 13px; fill: #111111; }
    .axis { stroke: #5E5850; stroke-width: 1.2; }
    .grid { stroke: #ECECEC; stroke-width: 1; }
    .mono { font-family: 'Courier New', Courier, monospace; }

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

  <text id="lin-title" x="36" y="48" class="title"></text>
  <text id="lin-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="lin-scene"></g>

  <text id="lin-counter" x="36" y="635" class="text"></text>

  <g id="lin-prevGroup">
    <rect id="lin-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="lin-nextGroup">
    <rect id="lin-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="lin-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      const data = [
        {x: 130, y: 38},  {x: 160, y: 90},  {x: 180, y: 75},
        {x: 210, y: 105}, {x: 220, y: 60},  {x: 240, y: 118},
        {x: 290, y: 235}, {x: 390, y: 245}, {x: 410, y: 195},
        {x: 480, y: 210}, {x: 500, y: 340}, {x: 520, y: 535},
        {x: 580, y: 390}, {x: 640, y: 488}, {x: 650, y: 560},
        {x: 670, y: 405}, {x: 690, y: 380}, {x: 730, y: 495},
        {x: 740, y: 380}
      ];

      const meanY = data.reduce((s,d) => s + d.y, 0) / data.length;
      const beta1 = 0.76;
      const beta0 = -27;
      const fit = (x) => beta1 * x + beta0;

      const X0 = 460, X1 = 920;
      const Y0 = 540, Y1 = 160;
      const xMin = 0, xMax = 760;
      const yMin = 0, yMax = 600;
      const xPx = (x) => X0 + (x - xMin) / (xMax - xMin) * (X1 - X0);
      const yPx = (y) => Y0 - (y - yMin) / (yMax - yMin) * (Y0 - Y1);

      function axes() {
        let s = '';
        for (let py = 0; py <= 600; py += 100) {
          const yp = yPx(py);
          s += `<line x1="${X0}" y1="${yp}" x2="${X1}" y2="${yp}" class="grid"/>`;
          s += `<text x="${X0-8}" y="${yp+4}" text-anchor="end" class="small">$${py}k</text>`;
        }
        for (let px = 0; px <= 700; px += 100) {
          const xp = xPx(px);
          s += `<line x1="${xp}" y1="${Y0}" x2="${xp}" y2="${Y1}" class="grid"/>`;
          s += `<text x="${xp}" y="${Y0+18}" text-anchor="middle" class="small">${px}</text>`;
        }
        s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s += `<text x="${(X0+X1)/2}" y="${Y0+38}" text-anchor="middle" class="label">площадь, sqft</text>`;
        return s;
      }

      function points(color = '#C29E08') {
        return data.map(d =>
          `<circle cx="${xPx(d.x)}" cy="${yPx(d.y)}" r="5.5" fill="${color}"/>`
        ).join('');
      }

      function dataTable() {
        let s = '';
        const headerY = 170;
        const rowStart = 202;
        const rowH = 30;
        s += `<text x="690" y="155" text-anchor="middle" class="small">фрагмент датасета (иллюстративные данные)</text>`;
        s += `<rect x="500" y="${headerY}" width="180" height="28" fill="#3576C0" rx="8"/>`;
        s += `<text x="590" y="${headerY+18}" text-anchor="middle" style="font-size:14px;fill:#fff;font-weight:bold;">sqft  —  фича  X</text>`;
        s += `<rect x="690" y="${headerY}" width="180" height="28" fill="#73B222" rx="8"/>`;
        s += `<text x="780" y="${headerY+18}" text-anchor="middle" style="font-size:14px;fill:#fff;font-weight:bold;">price  —  таргет  y</text>`;
        const rows = data.slice(0, 8);
        rows.forEach((d, i) => {
          const ry = rowStart + i * rowH;
          const bg = i % 2 === 0 ? '#F5F8FC' : '#FFFFFF';
          s += `<rect x="500" y="${ry}" width="370" height="${rowH-2}" fill="${bg}" stroke="#E1E5EA"/>`;
          s += `<text x="590" y="${ry+19}" text-anchor="middle" class="text">${d.x}</text>`;
          s += `<text x="780" y="${ry+19}" text-anchor="middle" class="text">$${d.y},000</text>`;
        });
        s += `<text x="690" y="${rowStart + 8*rowH + 18}" text-anchor="middle" class="small">… всего ${data.length} строк</text>`;
        return s;
      }

      const scene1 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Задача</text>
          <text x="60" y="190" class="text">У нас есть набор домов.</text>
          <text x="60" y="212" class="text">Для каждого известно:</text>
          <text x="78" y="236" class="text">• площадь (sqft)</text>
          <text x="78" y="258" class="text">• цена (price)</text>

          <text x="60" y="300" class="text" style="font-weight:700;">Хотим выучить зависимость:</text>
          <text x="60" y="328" class="text mono" style="font-size:17px;">price ≈ f(sqft)</text>

          <rect x="60" y="350" width="340" height="44" class="box-blue"/>
          <text x="78" y="368" style="font-size:12px;fill:#3576C0;font-weight:700;">ФИЧА  (X)</text>
          <text x="78" y="386" class="text">sqft — то, что подаём на вход</text>

          <rect x="60" y="408" width="340" height="44" class="box-green"/>
          <text x="78" y="426" style="font-size:12px;fill:#73B222;font-weight:700;">ТАРГЕТ  (y)</text>
          <text x="78" y="444" class="text">price — то, что предсказываем</text>
        </g>
        <g>${dataTable()}</g>
      `;

      const scene2 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Смотрим на данные</text>
          <text x="60" y="195" class="text">Каждая точка — один дом:</text>
          <text x="60" y="217" class="small">по X площадь, по Y цена.</text>

          <text x="60" y="275" class="text">Видна закономерность:</text>
          <text x="60" y="305" class="text" style="font-weight:700;fill:#3576C0;">больше площадь —</text>
          <text x="60" y="327" class="text" style="font-weight:700;fill:#3576C0;">выше цена.</text>

          <text x="60" y="385" class="small">Это и есть «зависимость»,</text>
          <text x="60" y="403" class="small">которую мы хотим описать</text>
          <text x="60" y="421" class="small">формулой.</text>

          <text x="60" y="465" class="small" style="fill:#3576C0;">Но как именно — прямой?</text>
          <text x="60" y="483" class="small" style="fill:#3576C0;">какой именно прямой?</text>
        </g>
        <g>
          ${axes()}
          ${points()}
        </g>
      `;

      const meanLineY = yPx(meanY);
      const scene3 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-yellow"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Самая простая модель</text>
          <text x="60" y="195" class="text">Что если для любого дома</text>
          <text x="60" y="217" class="text">предсказывать одно число —</text>
          <text x="60" y="239" class="text">среднюю цену по выборке?</text>

          <rect x="60" y="265" width="340" height="62" class="box-yellow"/>
          <text x="78" y="290" class="text mono">ŷ = 0 · sqft + 281</text>
          <text x="78" y="312" class="small">β̂₁ = 0,  β̂₀ = mean(y) ≈ $281k</text>

          <text x="60" y="365" class="text">Площадь полностью</text>
          <text x="60" y="387" class="text" style="font-weight:700;fill:#C30B0A;">игнорируется.</text>

          <text x="60" y="430" class="small">Очевидно — это плохо.</text>
          <text x="60" y="450" class="small">Но как сказать насколько?</text>
        </g>
        <g>
          ${axes()}
          ${points()}
          <line x1="${X0}" y1="${meanLineY}" x2="${X1}" y2="${meanLineY}" stroke="#C29E08" stroke-width="2.8"/>
          <text x="${X1-8}" y="${meanLineY-8}" text-anchor="end" class="label" style="fill:#C29E08;font-weight:700;">ŷ = $281k</text>
        </g>
      `;

      function residualsToConst() {
        return data.map(d => {
          const px = xPx(d.x);
          const py = yPx(d.y);
          return `<line x1="${px}" y1="${py}" x2="${px}" y2="${meanLineY}" stroke="#C30B0A" stroke-width="1.6" opacity="0.75"/>`;
        }).join('');
      }
      const scene4 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-red"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Ошибки модели</text>
          <text x="60" y="195" class="text">Для каждой точки смотрим:</text>
          <text x="60" y="217" class="text">насколько модель промахнулась.</text>

          <rect x="60" y="245" width="340" height="55" class="box-red"/>
          <text x="230" y="278" text-anchor="middle" class="text mono" style="font-size:18px;">eᵢ = yᵢ − ŷᵢ</text>

          <text x="60" y="340" class="text">Красные отрезки — расстояния</text>
          <text x="60" y="362" class="text">от реальной цены до того,</text>
          <text x="60" y="384" class="text">что предсказала модель.</text>

          <text x="60" y="430" class="small" style="fill:#C30B0A;font-weight:700;">Чем длиннее отрезки —</text>
          <text x="60" y="450" class="small" style="fill:#C30B0A;font-weight:700;">тем хуже модель.</text>
        </g>
        <g>
          ${axes()}
          <line x1="${X0}" y1="${meanLineY}" x2="${X1}" y2="${meanLineY}" stroke="#C29E08" stroke-width="2.5"/>
          ${residualsToConst()}
          ${points()}
        </g>
      `;

      const scene5 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-yellow"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Loss function: MSE</text>
          <text x="60" y="195" class="text">Сводим все ошибки к одному</text>
          <text x="60" y="217" class="text">числу — среднему квадрату:</text>

          <rect x="60" y="240" width="340" height="62" class="box-yellow"/>
          <text x="230" y="280" text-anchor="middle" class="text mono" style="font-size:17px;">MSE = (1/n) · Σ (yᵢ − ŷᵢ)²</text>

          <text x="60" y="335" class="text">Возводим в квадрат, чтобы:</text>
          <text x="78" y="358" class="small">• плюсы и минусы не сократили друг друга;</text>
          <text x="78" y="378" class="small">• сильнее штрафовать большие промахи.</text>

          <rect x="60" y="400" width="340" height="50" class="box-blue"/>
          <text x="230" y="424" text-anchor="middle" class="text" style="font-weight:700;fill:#3576C0;">Цель — найти β̂₀, β̂₁,</text>
          <text x="230" y="442" text-anchor="middle" class="text" style="font-weight:700;fill:#3576C0;">которые минимизируют MSE.</text>
        </g>
        <g>
          ${axes()}
          <line x1="${X0}" y1="${meanLineY}" x2="${X1}" y2="${meanLineY}" stroke="#C29E08" stroke-width="2.5"/>
          ${residualsToConst()}
          ${points()}

          <rect x="${X0+18}" y="${Y1+14}" width="240" height="48" fill="#ffffff" stroke="#C29E08" rx="10"/>
          <text x="${X0+138}" y="${Y1+36}" text-anchor="middle" class="text" style="font-weight:700;">MSE — большое</text>
          <text x="${X0+138}" y="${Y1+56}" text-anchor="middle" class="small">плохая модель: много ошибок</text>
        </g>
      `;

      function bestFitLine() {
        const x1 = xPx(xMin), y1 = yPx(fit(xMin));
        const x2 = xPx(xMax), y2 = yPx(fit(xMax));
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#73B222" stroke-width="3"/>`;
      }
      function residualsToLine() {
        return data.map(d => {
          const px = xPx(d.x);
          const py = yPx(d.y);
          const fy = yPx(fit(d.x));
          return `<line x1="${px}" y1="${py}" x2="${px}" y2="${fy}" stroke="#C30B0A" stroke-width="1.3" opacity="0.55"/>`;
        }).join('');
      }
      const scene6 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Лучшая прямая</text>
          <text x="60" y="195" class="text">Перебираем β̂₀ и β̂₁ так,</text>
          <text x="60" y="217" class="text">чтобы MSE стало как можно</text>
          <text x="60" y="239" class="text">меньше.</text>

          <rect x="60" y="265" width="340" height="62" class="box-green"/>
          <text x="78" y="290" class="text mono">ŷ = 0.76 · sqft − 27</text>
          <text x="78" y="312" class="small">β̂₁ ≈ 0.76,   β̂₀ ≈ −27</text>

          <text x="60" y="358" class="text">Точки не лежат на прямой</text>
          <text x="60" y="380" class="text">идеально — но красные отрезки</text>
          <text x="60" y="402" class="text">в сумме минимально возможные.</text>

          <text x="60" y="448" class="small" style="fill:#73B222;font-weight:700;">Это и есть «обучение»</text>
          <text x="60" y="466" class="small" style="fill:#73B222;font-weight:700;">линейной регрессии.</text>
        </g>
        <g>
          ${axes()}
          ${residualsToLine()}
          ${bestFitLine()}
          ${points()}

          <rect x="${X0+18}" y="${Y1+14}" width="240" height="48" fill="#ffffff" stroke="#73B222" rx="10"/>
          <text x="${X0+138}" y="${Y1+36}" text-anchor="middle" class="text" style="font-weight:700;fill:#73B222;">MSE — в разы меньше</text>
          <text x="${X0+138}" y="${Y1+56}" text-anchor="middle" class="small">модель ловит зависимость</text>
        </g>
      `;

      const predX = 449;
      const predY = fit(predX);
      const predXPx = xPx(predX);
      const predYPx = yPx(predY);
      const scene8 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Используем модель</text>
          <text x="60" y="195" class="text">Модель обучена. Теперь</text>
          <text x="60" y="217" class="text">можем предсказать цену</text>
          <text x="60" y="239" class="text">для дома любой площади.</text>

          <rect x="60" y="265" width="340" height="92" class="box-green"/>
          <text x="78" y="290" class="text">Возьмём sqft = 449:</text>
          <text x="78" y="318" class="text mono">ŷ  =  0.76 · 449 − 27</text>
          <text x="78" y="346" class="text mono" style="font-weight:800;fill:#73B222;">ŷ  ≈  $ 314 000</text>

          <text x="60" y="398" class="text">Это и есть весь смысл:</text>
          <text x="60" y="422" class="small">из X (площадь) научились</text>
          <text x="60" y="442" class="small">получать y (цену).</text>

          <text x="60" y="478" class="small" style="fill:#73B222;font-weight:700;">Это — линейная регрессия.</text>
        </g>
        <g>
          ${axes()}
          ${bestFitLine()}
          ${points()}

          <line x1="${predXPx}" y1="${Y0}" x2="${predXPx}" y2="${predYPx}" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="4 4"/>
          <line x1="${X0}" y1="${predYPx}" x2="${predXPx}" y2="${predYPx}" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="4 4"/>
          <circle cx="${predXPx}" cy="${predYPx}" r="8" fill="#73B222" stroke="#fff" stroke-width="2"/>

          <rect x="${predXPx-90}" y="${predYPx-48}" width="180" height="34" fill="#ffffff" stroke="#73B222" rx="8"/>
          <text x="${predXPx}" y="${predYPx-26}" text-anchor="middle" class="text" style="font-weight:800;fill:#73B222;">449 sqft  →  $314k</text>
        </g>
      `;

      const steps = [
        { title: "Шаг 1. Данные: фичи и таргет",
          subtitle: "Что подаём на вход, что хотим предсказать",
          scene: scene1 },
        { title: "Шаг 2. Смотрим на точки",
          subtitle: "Есть ли зависимость между sqft и ценой?",
          scene: scene2 },
        { title: "Шаг 3. Самая простая модель",
          subtitle: "Предсказываем среднее — площадь игнорируется",
          scene: scene3 },
        { title: "Шаг 4. Сколько модель ошибается",
          subtitle: "Остатки — вертикальные расстояния до предсказания",
          scene: scene4 },
        { title: "Шаг 5. Сводим ошибки в одно число",
          subtitle: "MSE — среднее квадратов остатков",
          scene: scene5 },
        { title: "Шаг 6. Находим лучшую прямую",
          subtitle: "Минимизируем MSE по β̂₀ и β̂₁",
          scene: scene6 },
        { title: "Шаг 7. Применяем модель",
          subtitle: "Новый sqft → предсказанная цена",
          scene: scene8 }
      ];

      let currentStep = 0;
      function renderStep() {
        const step = steps[currentStep];
        $("lin-title").textContent = step.title;
        $("lin-subtitle").textContent = step.subtitle;
        $("lin-counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("lin-scene").innerHTML = step.scene;
        $("lin-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("lin-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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
      $("lin-nextBtn").addEventListener("click", nextStep);
      $("lin-prevBtn").addEventListener("click", prevStep);
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

---

## Часть 2. Как найти лучшую прямую — градиентный спуск

Хорошо, мы знаем: хорошая модель — это та, у которой MSE минимальный. Но как найти такие `β̂₀` и `β̂₁`?

Для линейной регрессии есть аналитическое решение (метод наименьших квадратов, формула в одну строку). Но в общем случае — для нейросетей и любой сложной модели — аналитического решения нет. И тогда работает универсальный численный метод: **градиентный спуск**.

Идея простая. Представим, что мы зафиксировали `β̂₀` и смотрим, как MSE зависит только от `β̂₁`. Получается парабола: при правильном `β̂₁` MSE маленький, при сильно неправильном — большой.

Мы хотим попасть в дно параболы. Что делаем?

1. Стартуем со случайной точки.
2. Смотрим, в какую сторону функция падает (это даёт производная — «slope»).
3. Делаем маленький шаг в этом направлении.
4. Повторяем.

Это и есть градиентный спуск. Разберём по шагам:

<figure class="embedded-interactive" id="section-interactive-2">
  <div class="interactive-meta">Интерактив 2</div>
  <p class="interactive-desc">Градиентный спуск: пошаговая интуиция</p>
<div class="interactive-svg-wrap">
<svg id="gradDescentIntuition" viewBox="0 0 960 680" width="100%" role="img" aria-label="Градиентный спуск: пошаговая интуиция">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .label { font-size: 13px; fill: #111111; }
    .axis { stroke: #5E5850; stroke-width: 1.2; }
    .grid { stroke: #ECECEC; stroke-width: 1; }
    .mono { font-family: 'Courier New', Courier, monospace; }

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

  <text id="gd-title" x="36" y="48" class="title"></text>
  <text id="gd-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="gd-scene"></g>

  <text id="gd-counter" x="36" y="635" class="text"></text>

  <g id="gd-prevGroup">
    <rect id="gd-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="gd-nextGroup">
    <rect id="gd-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="gd-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      const bStar = 0.76;
      const L = (b) => 200 * (b - bStar) ** 2 + 10;
      const dLdb = (b) => 400 * (b - bStar);

      const X0 = 480, X1 = 900;
      const Y0 = 540, Y1 = 170;
      const bMin = 0, bMax = 1.5;
      const lMax = 130;
      const xPx = (b) => X0 + (b - bMin) / (bMax - bMin) * (X1 - X0);
      const yPx = (l) => Y0 - l / lMax * (Y0 - Y1);

      function axes() {
        let s = '';
        [0, 50, 100].forEach(l => {
          const yp = yPx(l);
          s += `<line x1="${X0}" y1="${yp}" x2="${X1}" y2="${yp}" class="grid"/>`;
          s += `<text x="${X0-8}" y="${yp+4}" text-anchor="end" class="small">${l}</text>`;
        });
        [0, 0.5, 1.0, 1.5].forEach(b => {
          const xp = xPx(b);
          s += `<line x1="${xp}" y1="${Y0}" x2="${xp}" y2="${Y1}" class="grid"/>`;
          s += `<text x="${xp}" y="${Y0+18}" text-anchor="middle" class="small">${b.toFixed(1)}</text>`;
        });
        s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s += `<text x="${(X0+X1)/2}" y="${Y0+38}" text-anchor="middle" class="label" style="font-weight:700;">β̂₁  (параметр модели)</text>`;
        s += `<text x="${X0-30}" y="${Y1-8}" text-anchor="start" class="label" style="font-weight:700;fill:#3576C0;">L (loss / MSE)</text>`;
        return s;
      }

      function parabolaPath(color = '#3576C0', strokeW = 2.6) {
        let path = '';
        for (let b = bMin; b <= bMax + 1e-9; b += 0.02) {
          const l = L(b);
          if (l > lMax) continue;
          path += (path === '' ? 'M' : 'L') + ' ' + xPx(b).toFixed(1) + ' ' + yPx(l).toFixed(1) + ' ';
        }
        return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeW}"/>`;
      }

      function pointOn(b, color = '#C29E08', r = 7) {
        return `<circle cx="${xPx(b)}" cy="${yPx(L(b))}" r="${r}" fill="${color}" stroke="#fff" stroke-width="2"/>`;
      }

      function tangentAt(b0, color = '#C30B0A', span = 0.22) {
        const l0 = L(b0);
        const m = dLdb(b0);
        const b1a = Math.max(b0 - span, bMin);
        const b2a = Math.min(b0 + span, bMax);
        const y1 = l0 + m * (b1a - b0);
        const y2 = l0 + m * (b2a - b0);
        return `<line x1="${xPx(b1a)}" y1="${yPx(y1)}" x2="${xPx(b2a)}" y2="${yPx(y2)}" stroke="${color}" stroke-width="2.6"/>`;
      }

      const arrowDefs = `
        <defs>
          <marker id="gd-arr-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/>
          </marker>
          <marker id="gd-arr-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#73B222"/>
          </marker>
          <marker id="gd-arr-yellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C29E08"/>
          </marker>
        </defs>
      `;

      const scene1 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Loss как функция параметра</text>
          <text x="60" y="190" class="text">У линейной регрессии есть</text>
          <text x="60" y="212" class="text">два параметра: β̂₀ и β̂₁.</text>

          <text x="60" y="248" class="text">Чтобы упростить картинку,</text>
          <text x="60" y="270" class="text">зафиксируем β̂₀ и меняем</text>
          <text x="60" y="292" class="text">только β̂₁ (наклон прямой).</text>

          <rect x="60" y="310" width="340" height="62" class="box-blue"/>
          <text x="230" y="334" text-anchor="middle" class="text mono" style="font-size:14px;">L(β̂₁) = (1/n) Σ (yᵢ − (β̂₁·xᵢ + β̂₀))²</text>
          <text x="230" y="358" text-anchor="middle" class="small">MSE как функция от β̂₁</text>

          <text x="60" y="402" class="text">Эта функция — <tspan style="font-weight:700;fill:#3576C0;">парабола</tspan>.</text>
          <text x="60" y="424" class="small">Внизу — модель хорошая (loss мал),</text>
          <text x="60" y="442" class="small">по краям — плохая (loss большой).</text>

          <text x="60" y="482" class="text" style="font-weight:700;fill:#73B222;">Цель: найти то самое β̂₁,</text>
          <text x="60" y="504" class="text" style="font-weight:700;fill:#73B222;">где loss минимальный.</text>
        </g>
        <g>
          ${axes()}
          ${parabolaPath()}
          ${pointOn(bStar, '#73B222', 8)}
          <line x1="${xPx(bStar)}" y1="${yPx(L(bStar))}" x2="${xPx(bStar)}" y2="${Y0}" stroke="#73B222" stroke-width="1" stroke-dasharray="3 3"/>
          <text x="${xPx(bStar)}" y="${yPx(L(bStar))-14}" text-anchor="middle" class="label" style="font-weight:700;fill:#73B222;">минимум здесь</text>
          <text x="${xPx(bStar)}" y="${yPx(L(bStar))+1}" text-anchor="middle" class="small" style="fill:#73B222;">β̂₁* ≈ 0.76</text>
        </g>
      `;

      const bInit = 0.20;
      const scene2 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-yellow"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">С чего начинаем</text>
          <text x="60" y="195" class="text">Изначально β̂₁ — это просто</text>
          <text x="60" y="217" class="text">случайное число.</text>

          <rect x="60" y="240" width="340" height="55" class="box-yellow"/>
          <text x="230" y="266" text-anchor="middle" class="text mono">β̂₁ ⁽⁰⁾  =  0.20</text>
          <text x="230" y="287" text-anchor="middle" class="small">наша «отправная точка»</text>

          <text x="60" y="328" class="text">Мы оказались <tspan style="font-weight:700;fill:#C30B0A;">высоко на склоне</tspan></text>
          <text x="60" y="350" class="text">параболы. Loss большой —</text>
          <text x="60" y="372" class="text">модель пока плохая.</text>

          <rect x="60" y="395" width="340" height="44" class="box-blue"/>
          <text x="230" y="421" text-anchor="middle" class="text">L(0.20) ≈ 73   ←   далеко от 10</text>

          <text x="60" y="475" class="text" style="font-weight:700;">Вопрос:</text>
          <text x="60" y="498" class="text">куда нам двигаться?</text>
        </g>
        <g>
          ${axes()}
          ${parabolaPath()}
          ${pointOn(bStar, '#D5EBC0', 6)}
          ${pointOn(bInit, '#C29E08', 9)}
          <line x1="${xPx(bInit)}" y1="${yPx(L(bInit))}" x2="${xPx(bInit)}" y2="${Y0}" stroke="#C29E08" stroke-width="1.2" stroke-dasharray="4 4"/>
          <line x1="${xPx(bInit)}" y1="${yPx(L(bInit))}" x2="${X0}" y2="${yPx(L(bInit))}" stroke="#C29E08" stroke-width="1.2" stroke-dasharray="4 4"/>
          <text x="${xPx(bInit)}" y="${yPx(L(bInit))-14}" text-anchor="middle" class="label" style="font-weight:700;fill:#C29E08;">мы здесь</text>
          <text x="${xPx(bInit)}" y="${Y0+34}" text-anchor="middle" class="small" style="fill:#C29E08;">β̂₁ = 0.20</text>
        </g>
      `;

      const scene3 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-red"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Наклон (slope) в точке</text>
          <text x="60" y="192" class="text">В каждой точке у функции</text>
          <text x="60" y="214" class="text">есть <tspan style="font-weight:700;">локальный наклон</tspan>.</text>

          <text x="60" y="250" class="text">Это насколько круто функция</text>
          <text x="60" y="272" class="text">растёт или падает прямо</text>
          <text x="60" y="294" class="text">здесь, у нас под ногами.</text>

          <rect x="60" y="312" width="340" height="68" class="box-red"/>
          <text x="78" y="338" class="text mono" style="font-size:14px;">slope = ∂L/∂β̂₁  (производная)</text>
          <text x="78" y="365" class="text mono" style="font-size:14px;">в точке β̂₁=0.20:  slope ≈ −224</text>

          <text x="60" y="408" class="small">Знак минус говорит:</text>
          <text x="60" y="426" class="text" style="font-weight:700;fill:#C30B0A;">функция падает,</text>
          <text x="60" y="448" class="text" style="font-weight:700;fill:#C30B0A;">если идти вправо.</text>

          <text x="60" y="487" class="small">Красная прямая — касательная,</text>
          <text x="60" y="503" class="small">её наклон и есть slope.</text>
        </g>
        <g>
          ${axes()}
          ${parabolaPath()}
          ${tangentAt(bInit, '#C30B0A', 0.28)}
          ${pointOn(bInit, '#C29E08', 9)}
          <text x="${xPx(bInit)+90}" y="${yPx(L(bInit))-50}" class="label" style="font-weight:700;fill:#C30B0A;">касательная</text>
          <text x="${xPx(bInit)+90}" y="${yPx(L(bInit))-32}" class="small" style="fill:#C30B0A;">slope = −224</text>
        </g>
      `;

      const arrowY = Y0 + 60;
      const xCur = xPx(bInit);
      const scene4 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Градиент = «куда вверх»</text>
          <text x="60" y="192" class="text"><tspan style="font-weight:700;fill:#C30B0A;">Градиент</tspan> — это направление,</text>
          <text x="60" y="214" class="text">в котором функция</text>
          <text x="60" y="236" class="text" style="font-weight:700;fill:#C30B0A;">растёт быстрее всего.</text>

          <text x="60" y="276" class="text">Логика очень простая:</text>
          <text x="78" y="300" class="text">• хотим вверх — идём <tspan style="fill:#C30B0A;font-weight:700;">по</tspan> градиенту</text>
          <text x="78" y="322" class="text">• хотим вниз — идём <tspan style="fill:#73B222;font-weight:700;">против</tspan> градиента</text>

          <rect x="60" y="345" width="340" height="56" class="box-green"/>
          <text x="230" y="370" text-anchor="middle" class="text" style="font-weight:700;fill:#73B222;">Нам нужен минимум loss.</text>
          <text x="230" y="390" text-anchor="middle" class="small">→ движемся ПРОТИВ градиента</text>

          <text x="60" y="438" class="small">В нашей точке slope = −224.</text>
          <text x="60" y="456" class="small">Градиент «смотрит влево»</text>
          <text x="60" y="474" class="small">(туда L растёт).</text>
          <text x="60" y="497" class="text" style="font-weight:700;fill:#73B222;">→ значит, шагаем вправо.</text>
        </g>
        <g>
          ${axes()}
          ${parabolaPath()}
          ${tangentAt(bInit, '#C30B0A55', 0.28)}
          ${pointOn(bInit, '#C29E08', 9)}

          <line x1="${xCur-6}" y1="${arrowY}" x2="${xCur-86}" y2="${arrowY}" stroke="#C30B0A" stroke-width="3.2" marker-end="url(#gd-arr-red)"/>
          <text x="${xCur-46}" y="${arrowY-12}" text-anchor="middle" class="label" style="font-weight:700;fill:#C30B0A;">градиент</text>
          <text x="${xCur-46}" y="${arrowY+22}" text-anchor="middle" class="small" style="fill:#C30B0A;">«в гору»</text>

          <line x1="${xCur+6}" y1="${arrowY}" x2="${xCur+86}" y2="${arrowY}" stroke="#73B222" stroke-width="3.2" marker-end="url(#gd-arr-green)"/>
          <text x="${xCur+46}" y="${arrowY-12}" text-anchor="middle" class="label" style="font-weight:700;fill:#73B222;">−градиент</text>
          <text x="${xCur+46}" y="${arrowY+22}" text-anchor="middle" class="small" style="fill:#73B222;">«с горы»  ← сюда!</text>
        </g>
      `;

      const alpha1 = 0.001;
      const bNext = bInit - alpha1 * dLdb(bInit);
      const scene5 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-yellow"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Правило обновления</text>
          <text x="60" y="192" class="text">Идею «шагаем против градиента»</text>
          <text x="60" y="214" class="text">записывают одной строчкой:</text>

          <rect x="60" y="232" width="340" height="62" class="box-yellow"/>
          <text x="230" y="270" text-anchor="middle" class="text mono" style="font-size:18px;">β̂₁ ← β̂₁ − α · ∂L/∂β̂₁</text>

          <text x="60" y="320" class="text"><tspan class="mono" style="font-weight:700;">α</tspan> — <tspan style="font-weight:700;">learning rate</tspan>,</text>
          <text x="60" y="342" class="text">маленькое число вроде 0.001.</text>
          <text x="60" y="364" class="small">Размер шага по склону.</text>

          <text x="60" y="402" class="text" style="font-weight:700;">Подставим числа:</text>
          <rect x="60" y="416" width="340" height="80" class="box-blue"/>
          <text x="78" y="438" class="text mono" style="font-size:13px;">β̂₁ ← 0.20 − 0.001 · (−224)</text>
          <text x="78" y="460" class="text mono" style="font-size:13px;">β̂₁ ← 0.20 + 0.224</text>
          <text x="78" y="484" class="text mono" style="font-size:14px;font-weight:800;fill:#73B222;">β̂₁ ← 0.424   ← сделали шаг</text>
        </g>
        <g>
          ${axes()}
          ${parabolaPath()}

          ${pointOn(bInit, '#E2C77A', 7)}
          <text x="${xPx(bInit)}" y="${Y0+34}" text-anchor="middle" class="small" style="fill:#C29E08;">было: 0.20</text>

          <line x1="${xPx(bInit)+9}" y1="${yPx(L(bInit))}"
                x2="${xPx(bNext)-9}" y2="${yPx(L(bNext))}"
                stroke="#73B222" stroke-width="3" marker-end="url(#gd-arr-green)"/>

          ${pointOn(bNext, '#73B222', 9)}
          <text x="${xPx(bNext)}" y="${yPx(L(bNext))-14}" text-anchor="middle" class="label" style="font-weight:700;fill:#73B222;">шаг!</text>
          <text x="${xPx(bNext)}" y="${Y0+34}" text-anchor="middle" class="small" style="fill:#73B222;">стало: 0.424</text>

          <text x="${X1-8}" y="${Y1+18}" text-anchor="end" class="small">L: 73 → 33  ↓</text>
        </g>
      `;

      const traj = [];
      let bt = bInit;
      for (let i = 0; i < 7; i++) {
        traj.push(bt);
        bt = bt - 0.001 * dLdb(bt);
      }
      function trajectoryArrows() {
        let s = '';
        for (let i = 0; i < traj.length - 1; i++) {
          const x1 = xPx(traj[i]), y1 = yPx(L(traj[i]));
          const x2 = xPx(traj[i+1]), y2 = yPx(L(traj[i+1]));
          s += `<line x1="${x1+6}" y1="${y1}" x2="${x2-6}" y2="${y2}"
                      stroke="#C29E08" stroke-width="2.2" marker-end="url(#gd-arr-yellow)" opacity="0.85"/>`;
        }
        traj.forEach((b, i) => {
          const isLast = i === traj.length - 1;
          s += `<circle cx="${xPx(b)}" cy="${yPx(L(b))}" r="${isLast ? 8 : 6}"
                        fill="${isLast ? '#73B222' : '#C29E08'}" stroke="#fff" stroke-width="2"/>`;
          if (i === 0 || isLast) {
            s += `<text x="${xPx(b)}" y="${yPx(L(b))-14}" text-anchor="middle" class="small"
                        style="font-weight:700;fill:${isLast ? '#73B222' : '#C29E08'};">
                    ${i === 0 ? 'старт' : 'шаг ' + i}
                  </text>`;
          }
        });
        return s;
      }
      const scene6 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Повторяем — и сходимся</text>
          <text x="60" y="195" class="text">Делаем правило обновления</text>
          <text x="60" y="217" class="text">снова и снова.</text>

          <rect x="60" y="240" width="340" height="190" class="box-green"/>
          <text x="78" y="262" class="text mono" style="font-size:13px;">шаг 0:  β̂₁ = 0.200,  L = 73</text>
          <text x="78" y="282" class="text mono" style="font-size:13px;">шаг 1:  β̂₁ = 0.424,  L = 33</text>
          <text x="78" y="302" class="text mono" style="font-size:13px;">шаг 2:  β̂₁ = 0.558,  L = 18</text>
          <text x="78" y="322" class="text mono" style="font-size:13px;">шаг 3:  β̂₁ = 0.639,  L = 13</text>
          <text x="78" y="342" class="text mono" style="font-size:13px;">шаг 4:  β̂₁ = 0.687,  L = 11</text>
          <text x="78" y="362" class="text mono" style="font-size:13px;">шаг 5:  β̂₁ = 0.716,  L = 10</text>
          <text x="78" y="386" class="text mono" style="font-size:13px;font-weight:800;fill:#73B222;">шаг 6:  β̂₁ → 0.76</text>
          <text x="78" y="412" class="small" style="fill:#73B222;">шаги становятся всё короче —</text>
          <text x="78" y="426" class="small" style="fill:#73B222;">slope уменьшается у дна параболы</text>

          <text x="60" y="465" class="text" style="font-weight:700;fill:#73B222;">Это и есть градиентный спуск:</text>
          <text x="60" y="487" class="small">скатываемся к минимуму</text>
          <text x="60" y="503" class="small">маленькими шагами против градиента.</text>
        </g>
        <g>
          ${axes()}
          ${parabolaPath()}
          ${trajectoryArrows()}
        </g>
      `;

      function miniAxes(x0, x1, y0, y1) {
        return { x0, x1, y0, y1,
                 xPxM: (b) => x0 + (b - bMin) / (bMax - bMin) * (x1 - x0),
                 yPxM: (l) => y0 - Math.min(l, lMax) / lMax * (y0 - y1)
               };
      }
      function miniParabola(M) {
        let path = '';
        for (let b = bMin; b <= bMax + 1e-9; b += 0.02) {
          const l = L(b);
          if (l > lMax) continue;
          path += (path === '' ? 'M' : 'L') + ' ' + M.xPxM(b).toFixed(1) + ' ' + M.yPxM(l).toFixed(1) + ' ';
        }
        return `<path d="${path}" fill="none" stroke="#3576C0" stroke-width="2"/>`;
      }
      function miniFrame(M, title, color) {
        return `
          <rect x="${M.x0-30}" y="${M.y1-50}" width="${M.x1-M.x0+50}" height="${M.y0-M.y1+85}"
                fill="#ffffff" stroke="${color}" stroke-width="1.4" rx="12"/>
          <text x="${(M.x0+M.x1)/2+10}" y="${M.y1-30}" text-anchor="middle" class="text"
                style="font-weight:700;fill:${color};font-size:14px;">${title}</text>
          <line x1="${M.x0}" y1="${M.y0}" x2="${M.x1}" y2="${M.y0}" class="axis"/>
          <line x1="${M.x0}" y1="${M.y0}" x2="${M.x0}" y2="${M.y1}" class="axis"/>
          <text x="${(M.x0+M.x1)/2}" y="${M.y0+20}" text-anchor="middle" class="small">β̂₁</text>
        `;
      }
      const M1 = miniAxes(490, 670, 530, 240);
      const trajBig = [];
      let bb = 0.20;
      for (let i = 0; i < 4; i++) {
        trajBig.push(bb);
        bb = bb - 0.0055 * dLdb(bb);
      }
      function trajMini(M, points, color) {
        let s = '';
        for (let i = 0; i < points.length - 1; i++) {
          const b1 = Math.max(Math.min(points[i], bMax), bMin);
          const b2 = Math.max(Math.min(points[i+1], bMax), bMin);
          s += `<line x1="${M.xPxM(b1)}" y1="${M.yPxM(L(points[i]))}"
                       x2="${M.xPxM(b2)}" y2="${M.yPxM(L(points[i+1]))}"
                       stroke="${color}" stroke-width="2" opacity="0.9"/>`;
        }
        points.forEach((b, i) => {
          const bc = Math.max(Math.min(b, bMax), bMin);
          s += `<circle cx="${M.xPxM(bc)}" cy="${M.yPxM(L(b))}" r="5"
                        fill="${color}" stroke="#fff" stroke-width="1.5"/>`;
        });
        return s;
      }
      const M2 = miniAxes(740, 920, 530, 240);
      const trajSmall = [];
      bb = 0.20;
      for (let i = 0; i < 6; i++) {
        trajSmall.push(bb);
        bb = bb - 0.00015 * dLdb(bb);
      }

      const scene7 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-red"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Размер шага: α</text>
          <text x="60" y="195" class="text">α (learning rate) решает,</text>
          <text x="60" y="217" class="text">насколько большие прыжки</text>
          <text x="60" y="239" class="text">мы делаем.</text>

          <rect x="60" y="262" width="340" height="62" class="box-red"/>
          <text x="78" y="288" class="text" style="font-weight:700;fill:#C30B0A;">α слишком большое →</text>
          <text x="78" y="310" class="small">перепрыгиваем минимум,</text>
          <text x="78" y="326" class="small">прыжки всё больше — улетаем.</text>

          <rect x="60" y="338" width="340" height="62" class="box-yellow"/>
          <text x="78" y="364" class="text" style="font-weight:700;fill:#C29E08;">α слишком маленькое →</text>
          <text x="78" y="386" class="small">шажки крошечные, обучение</text>
          <text x="78" y="402" class="small">тянется вечность.</text>

          <rect x="60" y="414" width="340" height="62" class="box-green"/>
          <text x="78" y="440" class="text" style="font-weight:700;fill:#73B222;">α правильное →</text>
          <text x="78" y="462" class="small">плавно скатываемся к дну.</text>
          <text x="78" y="478" class="small">Подбирают экспериментально.</text>
        </g>
        <g>
          ${miniFrame(M1, 'α слишком большое', '#C30B0A')}
          ${miniParabola(M1)}
          ${trajMini(M1, trajBig, '#C30B0A')}
          <text x="${(M1.x0+M1.x1)/2}" y="${M1.y0+38}" text-anchor="middle" class="small" style="fill:#C30B0A;">прыгаем через минимум, расходимся</text>

          ${miniFrame(M2, 'α слишком маленькое', '#C29E08')}
          ${miniParabola(M2)}
          ${trajMini(M2, trajSmall, '#C29E08')}
          <text x="${(M2.x0+M2.x1)/2}" y="${M2.y0+38}" text-anchor="middle" class="small" style="fill:#C29E08;">ползём очень медленно</text>
        </g>
      `;

      const scene8 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Пришли в минимум</text>
          <text x="60" y="195" class="text">В самой нижней точке параболы</text>
          <text x="60" y="217" class="text">касательная — горизонтальная.</text>

          <rect x="60" y="240" width="340" height="62" class="box-green"/>
          <text x="230" y="268" text-anchor="middle" class="text mono" style="font-size:16px;">slope = ∂L/∂β̂₁ = 0</text>
          <text x="230" y="290" text-anchor="middle" class="small">градиент обнулился</text>

          <text x="60" y="335" class="text">Шаги становятся нулевыми —</text>
          <text x="60" y="357" class="text">алгоритм <tspan style="font-weight:700;">останавливается</tspan>.</text>

          <rect x="60" y="380" width="340" height="62" class="box-blue"/>
          <text x="230" y="406" text-anchor="middle" class="text" style="font-weight:700;fill:#3576C0;">β̂₁ ≈ 0.76</text>
          <text x="230" y="426" text-anchor="middle" class="small">то самое значение, которое</text>
          <text x="230" y="440" text-anchor="middle" class="small">даёт лучшую прямую на данных</text>

          <text x="60" y="478" class="text" style="font-weight:700;fill:#73B222;">Это и есть «обучение»</text>
          <text x="60" y="500" class="text" style="font-weight:700;fill:#73B222;">в машинном обучении.</text>
        </g>
        <g>
          ${axes()}
          ${parabolaPath()}
          <line x1="${xPx(bStar)-60}" y1="${yPx(L(bStar))}" x2="${xPx(bStar)+60}" y2="${yPx(L(bStar))}"
                stroke="#73B222" stroke-width="3"/>
          ${pointOn(bStar, '#73B222', 10)}
          <text x="${xPx(bStar)}" y="${yPx(L(bStar))-18}" text-anchor="middle" class="label" style="font-weight:800;fill:#73B222;">минимум</text>
          <text x="${xPx(bStar)}" y="${yPx(L(bStar))-2}" text-anchor="middle" class="small" style="fill:#73B222;">slope = 0</text>
          <line x1="${xPx(bStar)}" y1="${yPx(L(bStar))}" x2="${xPx(bStar)}" y2="${Y0}"
                stroke="#73B222" stroke-width="1.2" stroke-dasharray="4 4"/>
          <text x="${xPx(bStar)}" y="${Y0+34}" text-anchor="middle" class="small" style="fill:#73B222;font-weight:700;">β̂₁ = 0.76</text>
        </g>
      `;

      const steps = [
        { title: "Шаг 1. Loss как функция параметра",
          subtitle: "Зафиксируем β̂₀ — и L зависит только от β̂₁. Это парабола.",
          scene: scene1 },
        { title: "Шаг 2. С чего начинаем",
          subtitle: "Случайное начальное β̂₁ = 0.20 — мы где-то высоко на склоне",
          scene: scene2 },
        { title: "Шаг 3. Slope — наклон в точке",
          subtitle: "Производная ∂L/∂β̂₁ показывает, насколько круто здесь",
          scene: scene3 },
        { title: "Шаг 4. Градиент = «куда вверх»",
          subtitle: "Чтобы спуститься — идём в противоположную сторону",
          scene: scene4 },
        { title: "Шаг 5. Правило обновления",
          subtitle: "β̂₁ ← β̂₁ − α · slope. Один шаг алгоритма.",
          scene: scene5 },
        { title: "Шаг 6. Повторяем — приходим к минимуму",
          subtitle: "Шаги становятся меньше, потому что slope падает",
          scene: scene6 },
        { title: "Шаг 7. Размер шага: learning rate α",
          subtitle: "Слишком большое — улетим, слишком маленькое — будем ползти",
          scene: scene7 },
        { title: "Шаг 8. Минимум: slope = 0",
          subtitle: "Градиент обнулился — это и есть обученное β̂₁",
          scene: scene8 }
      ];

      let currentStep = 0;
      function renderStep() {
        const step = steps[currentStep];
        $("gd-title").textContent = step.title;
        $("gd-subtitle").textContent = step.subtitle;
        $("gd-counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("gd-scene").innerHTML = step.scene;
        $("gd-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("gd-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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
      $("gd-nextBtn").addEventListener("click", nextStep);
      $("gd-prevBtn").addEventListener("click", prevStep);
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

> **Ключевая интуиция:** градиент указывает в сторону наибольшего _роста_ функции. Чтобы спускаться к минимуму, мы идём _против_ градиента. Размер шага определяется learning rate — слишком большой шаг даст промах через минимум, слишком маленький — будем ползти.

Когда у нас не один параметр, а два (`β̂₀` и `β̂₁`), парабола превращается в чашеобразную поверхность в 3D — но логика та же. Когда параметров миллион — поверхность в миллион-мерном пространстве, которую мы не можем «увидеть»; алгоритм работает одинаково.

---

## Часть 3. Backpropagation — градиент для каждого параметра

Градиентному спуску из Части 2 на каждом шаге нужна одна вещь — **градиент**: «куда наклонён loss» по каждому параметру. Когда параметр один, мы просто берём производную. Но даже у линейной регрессии с двумя признаками параметров уже три (`w₁`, `w₂`, `b`), а у нейросети — миллионы.

Чтобы посчитать производную loss по каждому из них, удобно представить модель как **вычислительный граф** и пройти по нему справа налево, перемножая локальные производные по _цепному правилу_. Это и есть **backpropagation** (обратное распространение ошибки).

Разберём это на самом простом примере — линейной регрессии с двумя признаками. Возьмём один объект: `x₁ = 2`, `x₂ = 3`, `y = 5`; стартовые параметры `w₁ = 1`, `w₂ = 0.5`, `b = 0.5`. Модель: `ŷ = w₁x₁ + w₂x₂ + b`, функция потерь `ℓ = ½ · (ŷ − y)²`.

### Forward pass

Сначала прямой проход: гоним признаки по графу слева направо и считаем предсказание `ŷ` и значение потери `ℓ`. Зелёные числа — это значения, которые мы запомним: на обратном проходе они понадобятся для локальных производных.

<figure class="embedded-interactive" id="section-interactive-3">
  <div class="interactive-meta">Интерактив 3</div>
  <p class="interactive-desc">Forward pass линейной регрессии</p>
<div class="interactive-svg-wrap">
<svg id="linForward" viewBox="0 0 960 680" width="100%" role="img" aria-label="Forward pass линейной регрессии">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .counter { font-size: 15px; fill: #5E5850; }
    .node-label { font-size: 17px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    .op-label   { font-size: 16px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    .green      { font-size: 15px; font-weight: 800; fill: #73B222; text-anchor: middle; }
    .edge-label { font-size: 12px; fill: #5E5850; text-anchor: middle; }
    .desc       { font-size: 15px; fill: #111111; }
    .input-circle { fill: #ffffff; stroke: #5E5850; stroke-width: 1.6; }
    .param-circle { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    .op-box       { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; rx: 6; }
    .op-box-active{ fill: #FFE7A3; stroke: #C29E08; stroke-width: 3.5; rx: 6; }
    .arrow        { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    .btn          { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary{ fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text     { font-size: 17px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="arrLF" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text id="lfTitle" x="36" y="48" class="title"></text>
  <text id="lfSubtitle" x="36" y="76" class="subtitle"></text>

  <g id="lfScene"></g>

  <text id="lfCounter" x="36" y="635" class="counter"></text>

  <g id="lfPrevGroup">
    <rect id="lfPrevBtn" x="640" y="600" width="56" height="48" class="btn-secondary"/>
    <text x="668" y="624" class="btn-text-secondary">←</text>
  </g>

  <g id="lfNextGroup">
    <rect id="lfNextBtn" x="712" y="600" width="208" height="48" class="btn"/>
    <text id="lfNextText" x="816" y="624" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      function graphSVG(state) {
        const active = state.active || "";
        const v = state.values || {};
        const show = (val) => (val === undefined || val === null) ? "" : val;
        const opCls = (id) => (active === id) ? "op-box-active" : "op-box";

        return `
          <line x1="104" y1="170" x2="166" y2="170" class="arrow" marker-end="url(#arrLF)"/>
          <polyline points="232,170 360,170 360,241" class="arrow" fill="none" marker-end="url(#arrLF)"/>
          <line x1="104" y1="270" x2="166" y2="270" class="arrow" marker-end="url(#arrLF)"/>
          <line x1="232" y1="270" x2="331" y2="270" class="arrow" marker-end="url(#arrLF)"/>
          <line x1="360" y1="386" x2="360" y2="299" class="arrow" marker-end="url(#arrLF)"/>
          <line x1="387" y1="270" x2="436" y2="270" class="arrow" marker-end="url(#arrLF)"/>
          <line x1="502" y1="270" x2="541" y2="270" class="arrow" marker-end="url(#arrLF)"/>
          <line x1="580" y1="386" x2="580" y2="299" class="arrow" marker-end="url(#arrLF)"/>
          <line x1="617" y1="270" x2="685" y2="270" class="arrow" marker-end="url(#arrLF)"/>
          <text x="700" y="276" style="font-size:20px; font-style:italic; fill:#111;">ℓ</text>

          <circle cx="80"  cy="170" r="24" class="input-circle"/>
          <text   x="80"   y="170" class="node-label">x₁</text>
          <circle cx="80"  cy="270" r="24" class="input-circle"/>
          <text   x="80"   y="270" class="node-label">x₂</text>
          <circle cx="360" cy="410" r="24" class="param-circle"/>
          <text   x="360"  y="410" class="node-label">b</text>
          <circle cx="580" cy="410" r="24" class="input-circle"/>
          <text   x="580"  y="410" class="node-label">y</text>

          <rect x="168" y="150" width="64" height="40" class="${opCls('mw1')}"/>
          <text x="200" y="170" class="op-label">×w₁</text>
          <rect x="168" y="250" width="64" height="40" class="${opCls('mw2')}"/>
          <text x="200" y="270" class="op-label">×w₂</text>
          <rect x="333" y="243" width="54" height="54" class="${opCls('add')}"/>
          <text x="360" y="270" class="op-label" style="font-size:22px;">+</text>
          <rect x="438" y="243" width="64" height="54" class="${opCls('sub')}"/>
          <text x="470" y="270" class="op-label" style="font-size:20px;">−</text>
          <rect x="543" y="243" width="74" height="54" class="${opCls('mse')}"/>
          <text x="580" y="270" class="op-label" style="font-size:15px;">½e²</text>

          <text x="80"  y="130" class="green">${show(v.x1)}</text>
          <text x="80"  y="230" class="green">${show(v.x2)}</text>
          <text x="360" y="463" class="green">${show(v.b)}</text>
          <text x="580" y="463" class="green">${show(v.y)}</text>
          <text x="200" y="135" class="green">${show(v.m1)}</text>
          <text x="200" y="235" class="green">${show(v.m2)}</text>
          <text x="360" y="230" class="green">${show(v.yhat)}</text>
          <text x="470" y="230" class="green">${show(v.e)}</text>
          <text x="580" y="230" class="green">${show(v.ell)}</text>

          <text x="305" y="162" class="edge-label">m₁</text>
          <text x="282" y="263" class="edge-label">m₂</text>
          <text x="412" y="263" class="edge-label">ŷ</text>
          <text x="522" y="263" class="edge-label">e</text>

          ${state.descSVG || ""}
        `;
      }

      const steps = [
        {
          title: "Шаг 0. Постановка задачи",
          subtitle: "Линейная регрессия с двумя признаками",
          state: {
            active: "",
            values: { x1: "2", x2: "3", y: "5", b: "0.5" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="516" class="desc"><tspan font-weight="700">Модель:</tspan> ŷ = w₁·x₁ + w₂·x₂ + b,  e = ŷ − y,  ℓ = 1/2 · e²</text>
              <text x="56" y="540" class="desc"><tspan font-weight="700">Данные:</tspan> x₁=2, x₂=3, y=5. Например, признаки объекта и реальное числовое значение.</text>
              <text x="56" y="564" class="desc"><tspan font-weight="700">Параметры:</tspan> w₁=1, w₂=0.5, b=0.5. Синяя b — обучаемый параметр, серые x/y — фиксированные данные.</text>
            `
          }
        },
        {
          title: "Шаг 1. Считаем m₁ = w₁ · x₁",
          subtitle: "Первый признак умножается на свой вес",
          state: {
            active: "mw1",
            values: { x1: "2", x2: "3", y: "5", b: "0.5", m1: "2.0" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Что делаем:</tspan> линейная модель сначала взвешивает каждый признак.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">m₁ = w₁ · x₁ = 1 · 2 = <tspan fill="#73B222" font-weight="800">2.0</tspan></text>
            `
          }
        },
        {
          title: "Шаг 2. Считаем m₂ = w₂ · x₂",
          subtitle: "Второй признак тоже получает свой вес",
          state: {
            active: "mw2",
            values: { x1: "2", x2: "3", y: "5", b: "0.5", m1: "2.0", m2: "1.5" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Что делаем:</tspan> второй вклад считается точно так же.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">m₂ = w₂ · x₂ = 0.5 · 3 = <tspan fill="#73B222" font-weight="800">1.5</tspan></text>
            `
          }
        },
        {
          title: "Шаг 3. Считаем предсказание ŷ",
          subtitle: "Складываем все взвешенные признаки и свободный член b",
          state: {
            active: "add",
            values: { x1: "2", x2: "3", y: "5", b: "0.5", m1: "2.0", m2: "1.5", yhat: "4.0" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Что делаем:</tspan> линейная часть сразу даёт числовое предсказание.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">ŷ = m₁ + m₂ + b = 2.0 + 1.5 + 0.5 = <tspan fill="#73B222" font-weight="800">4.0</tspan></text>
            `
          }
        },
        {
          title: "Шаг 4. Считаем ошибку e = ŷ − y",
          subtitle: "Сравниваем предсказание с реальным значением",
          state: {
            active: "sub",
            values: { x1: "2", x2: "3", y: "5", b: "0.5", m1: "2.0", m2: "1.5", yhat: "4.0", e: "−1.0" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Что делаем:</tspan> остаток показывает, насколько модель ошиблась и в какую сторону.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">e = ŷ − y = 4.0 − 5 = <tspan fill="#73B222" font-weight="800">−1.0</tspan>. Модель предсказала меньше, чем надо.</text>
            `
          }
        },
        {
          title: "Шаг 5. Считаем потерю ℓ = 1/2 · e²",
          subtitle: "Квадрат ошибки делает знак неважным и сильнее штрафует большие промахи",
          state: {
            active: "mse",
            values: { x1: "2", x2: "3", y: "5", b: "0.5", m1: "2.0", m2: "1.5", yhat: "4.0", e: "−1.0", ell: "0.5" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Почему 1/2?</tspan> Так производная становится красивой: d(1/2·e²)/de = e.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">ℓ = 1/2 · (−1.0)² = <tspan fill="#73B222" font-weight="800">0.5</tspan></text>
            `
          }
        },
        {
          title: "Шаг 6. Forward pass завершён",
          subtitle: "Все промежуточные значения сохранены — они нужны для backward pass",
          state: {
            active: "",
            values: { x1: "2", x2: "3", y: "5", b: "0.5", m1: "2.0", m2: "1.5", yhat: "4.0", e: "−1.0", ell: "0.5" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4" rx="8"/>
              <text x="56" y="518" class="desc"><tspan font-weight="700">Итог:</tspan> предсказание ŷ = 4.0 при истинном y = 5, потеря ℓ = 0.5.</text>
              <text x="56" y="546" class="desc">На backward pass мы пойдём справа налево: от ошибки к параметрам w₁, w₂ и b.</text>
              <text x="56" y="568" class="desc">Зелёные значения помогут посчитать локальные производные.</text>
            `
          }
        }
      ];

      let i = 0;
      function render() {
        const s = steps[i];
        $("lfTitle").textContent = s.title;
        $("lfSubtitle").textContent = s.subtitle;
        $("lfCounter").textContent = `${i + 1} из ${steps.length}`;
        $("lfScene").innerHTML = graphSVG(s.state);
        $("lfPrevGroup").style.display = i === 0 ? "none" : "block";
        $("lfNextText").textContent = i === steps.length - 1 ? "↻" : "Далее";
      }
      function next(){ i = (i < steps.length - 1) ? i + 1 : 0; render(); }
      function prev(){ if (i > 0) { i--; render(); } }
      $("lfNextBtn").addEventListener("click", next);
      $("lfPrevBtn").addEventListener("click", prev);
      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft")  prev();
      });
      render();
    })();
  ]]></script>
</svg>
</div>
</figure>

### Backward pass

Теперь обратный проход. Стартуем с градиента `1` на выходе и идём справа налево: на каждой операции домножаем на её локальную производную, пока не доберёмся до `w₁`, `w₂` и `b`. Сложение просто копирует градиент, умножение — отдаёт на вес соответствующий признак.

<figure class="embedded-interactive" id="section-interactive-4">
  <div class="interactive-meta">Интерактив 4</div>
  <p class="interactive-desc">Backward pass линейной регрессии</p>
<div class="interactive-svg-wrap">
<svg id="linBackward" viewBox="0 0 960 680" width="100%" role="img" aria-label="Backward pass линейной регрессии">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .counter { font-size: 15px; fill: #5E5850; }
    .node-label { font-size: 17px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    .op-label   { font-size: 16px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    .green      { font-size: 15px; font-weight: 800; fill: #73B222; text-anchor: middle; }
    .red        { font-size: 15px; font-weight: 800; fill: #C30B0A; text-anchor: middle; }
    .edge-label { font-size: 12px; fill: #5E5850; text-anchor: middle; }
    .desc       { font-size: 15px; fill: #111111; }
    .input-circle { fill: #ffffff; stroke: #5E5850; stroke-width: 1.6; }
    .param-circle { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    .op-box       { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; rx: 6; }
    .op-box-active{ fill: #FFE9E9; stroke: #C30B0A; stroke-width: 3.5; rx: 6; }
    .arrow        { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    .arrow-back   { stroke: #C30B0A; stroke-width: 2.4; fill: none; }
    .btn          { fill: #1b1d26; rx: 12; cursor: pointer; }
    .btn-secondary{ fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    .btn-text     { font-size: 17px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="arrLB" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/>
    </marker>
    <marker id="arrLBR" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text id="lbTitle" x="36" y="48" class="title"></text>
  <text id="lbSubtitle" x="36" y="76" class="subtitle"></text>

  <g id="lbScene"></g>

  <text id="lbCounter" x="36" y="635" class="counter"></text>

  <g id="lbPrevGroup">
    <rect id="lbPrevBtn" x="640" y="600" width="56" height="48" class="btn-secondary"/>
    <text x="668" y="624" class="btn-text-secondary">←</text>
  </g>

  <g id="lbNextGroup">
    <rect id="lbNextBtn" x="712" y="600" width="208" height="48" class="btn"/>
    <text id="lbNextText" x="816" y="624" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      function graphSVG(state) {
        const active = state.active || "";
        const g = state.grads || {};
        const show = (val) => (val === undefined || val === null) ? "" : val;
        const flow = state.flow || {};
        const opCls = (id) => (active === id) ? "op-box-active" : "op-box";
        const back = (id, x1, y1, x2, y2) => flow[id]
          ? `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="arrow-back" marker-end="url(#arrLBR)"/>`
          : "";
        const backPoly = (id, pts) => flow[id]
          ? `<polyline points="${pts}" class="arrow-back" fill="none" marker-end="url(#arrLBR)"/>`
          : "";

        return `
          <line x1="104" y1="170" x2="166" y2="170" class="arrow" marker-end="url(#arrLB)"/>
          <polyline points="232,170 360,170 360,241" class="arrow" fill="none" marker-end="url(#arrLB)"/>
          <line x1="104" y1="270" x2="166" y2="270" class="arrow" marker-end="url(#arrLB)"/>
          <line x1="232" y1="270" x2="331" y2="270" class="arrow" marker-end="url(#arrLB)"/>
          <line x1="360" y1="386" x2="360" y2="299" class="arrow" marker-end="url(#arrLB)"/>
          <line x1="387" y1="270" x2="436" y2="270" class="arrow" marker-end="url(#arrLB)"/>
          <line x1="502" y1="270" x2="541" y2="270" class="arrow" marker-end="url(#arrLB)"/>
          <line x1="580" y1="386" x2="580" y2="299" class="arrow" marker-end="url(#arrLB)"/>
          <line x1="617" y1="270" x2="685" y2="270" class="arrow" marker-end="url(#arrLB)"/>
          <text x="700" y="276" style="font-size:20px; font-style:italic; fill:#111;">ℓ</text>

          ${back('mse_in', 690, 285, 619, 285)}
          ${back('sub_in', 545, 285, 504, 285)}
          ${back('add_in', 440, 285, 389, 285)}
          ${back('mw2_in', 333, 285, 234, 285)}
          ${backPoly('mw1_in', '370,243 370,160 234,160')}
          ${back('b_in',   370, 299, 370, 388)}

          <circle cx="80"  cy="170" r="24" class="input-circle"/>
          <text   x="80"   y="170" class="node-label">x₁</text>
          <circle cx="80"  cy="270" r="24" class="input-circle"/>
          <text   x="80"   y="270" class="node-label">x₂</text>
          <circle cx="360" cy="410" r="24" class="param-circle"/>
          <text   x="360"  y="410" class="node-label">b</text>
          <circle cx="580" cy="410" r="24" class="input-circle"/>
          <text   x="580"  y="410" class="node-label">y</text>

          <rect x="168" y="150" width="64" height="40" class="${opCls('mw1')}"/>
          <text x="200" y="170" class="op-label">×w₁</text>
          <rect x="168" y="250" width="64" height="40" class="${opCls('mw2')}"/>
          <text x="200" y="270" class="op-label">×w₂</text>
          <rect x="333" y="243" width="54" height="54" class="${opCls('add')}"/>
          <text x="360" y="270" class="op-label" style="font-size:22px;">+</text>
          <rect x="438" y="243" width="64" height="54" class="${opCls('sub')}"/>
          <text x="470" y="270" class="op-label" style="font-size:20px;">−</text>
          <rect x="543" y="243" width="74" height="54" class="${opCls('mse')}"/>
          <text x="580" y="270" class="op-label" style="font-size:15px;">½e²</text>

          <text x="80"  y="130" class="green">2</text>
          <text x="80"  y="230" class="green">3</text>
          <text x="360" y="463" class="green">0.5</text>
          <text x="580" y="463" class="green">5</text>
          <text x="200" y="135" class="green">2.0</text>
          <text x="200" y="235" class="green">1.5</text>
          <text x="360" y="230" class="green">4.0</text>
          <text x="470" y="230" class="green">−1.0</text>
          <text x="580" y="230" class="green">0.5</text>

          <text x="650" y="306" class="red">${show(g.dL)}</text>
          <text x="523" y="306" class="red">${show(g.de)}</text>
          <text x="412" y="306" class="red">${show(g.dyhat)}</text>
          <text x="282" y="306" class="red">${show(g.dm2)}</text>
          <text x="305" y="195" class="red">${show(g.dm1)}</text>
          <text x="395" y="345" class="red" text-anchor="start">${show(g.db)}</text>
          <text x="200" y="212" class="red">${show(g.dw1)}</text>
          <text x="200" y="312" class="red">${show(g.dw2)}</text>

          <text x="305" y="143" class="edge-label">m₁</text>
          <text x="282" y="263" class="edge-label">m₂</text>
          <text x="412" y="263" class="edge-label">ŷ</text>
          <text x="522" y="263" class="edge-label">e</text>

          ${state.descSVG || ""}
        `;
      }

      const steps = [
        {
          title: "Шаг 0. Зачем нужен backward pass",
          subtitle: "Хотим узнать, как loss меняется при изменении каждого параметра",
          state: {
            active: "",
            grads: {},
            flow: {},
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="516" class="desc"><tspan font-weight="700">Цель:</tspan> найти ∂ℓ/∂w₁, ∂ℓ/∂w₂, ∂ℓ/∂b — градиенты по обучаемым параметрам.</text>
              <text x="56" y="540" class="desc"><tspan font-weight="700">Инструмент:</tspan> цепное правило. Идём справа налево и умножаем на локальные производные.</text>
              <text x="56" y="564" class="desc">Зелёные числа — значения с forward pass, красные — градиенты.</text>
            `
          }
        },
        {
          title: "Шаг 1. Старт: ∂ℓ/∂ℓ = 1",
          subtitle: "Производная выхода по самому себе равна единице",
          state: {
            active: "",
            grads: { dL: "1" },
            flow: { mse_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Идея:</tspan> backward pass стартует с градиента 1 на финальном loss.</text>
              <text x="56" y="552" class="desc">Эта единица дальше проходит через операции справа налево.</text>
            `
          }
        },
        {
          title: "Шаг 2. Через MSE: ∂ℓ/∂e = e",
          subtitle: "У 1/2 · e² очень удобная производная",
          state: {
            active: "mse",
            grads: { dL: "1", de: "−1.0" },
            flow: { mse_in: true, sub_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc">ℓ = 1/2 · e² ⇒ ∂ℓ/∂e = e. На forward pass e = −1.0.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">∂ℓ/∂e = <tspan fill="#C30B0A" font-weight="800">−1.0</tspan></text>
            `
          }
        },
        {
          title: "Шаг 3. Через вычитание: ∂ℓ/∂ŷ",
          subtitle: "e = ŷ − y, поэтому по ŷ градиент проходит без изменения",
          state: {
            active: "sub",
            grads: { dL: "1", de: "−1.0", dyhat: "−1.0" },
            flow: { mse_in: true, sub_in: true, add_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc">e = ŷ − y ⇒ ∂e/∂ŷ = 1. Значит ∂ℓ/∂ŷ = ∂ℓ/∂e · 1.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">∂ℓ/∂ŷ = −1.0 · 1 = <tspan fill="#C30B0A" font-weight="800">−1.0</tspan></text>
            `
          }
        },
        {
          title: "Шаг 4. Через «+»: градиент копируется",
          subtitle: "ŷ = m₁ + m₂ + b — у сложения производная по каждому входу равна 1",
          state: {
            active: "add",
            grads: { dL: "1", de: "−1.0", dyhat: "−1.0", dm1: "−1.0", dm2: "−1.0", db: "−1.0" },
            flow: { mse_in: true, sub_in: true, add_in: true, mw1_in: true, mw2_in: true, b_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="518" class="desc">ŷ = m₁ + m₂ + b ⇒ ∂ŷ/∂m₁ = ∂ŷ/∂m₂ = ∂ŷ/∂b = 1.</text>
              <text x="56" y="552" class="desc">Поэтому ∂ℓ/∂m₁ = ∂ℓ/∂m₂ = ∂ℓ/∂b = <tspan fill="#C30B0A" font-weight="800">−1.0</tspan>. Градиент по b уже найден.</text>
            `
          }
        },
        {
          title: "Шаг 5. Через «×»: градиенты по w₁ и w₂",
          subtitle: "В умножении производная по весу равна соответствующему признаку",
          state: {
            active: "mw1",
            grads: { dL: "1", de: "−1.0", dyhat: "−1.0", dm1: "−1.0", dm2: "−1.0", db: "−1.0", dw1: "−2.0", dw2: "−3.0" },
            flow: { mse_in: true, sub_in: true, add_in: true, mw1_in: true, mw2_in: true, b_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="518" class="desc">m₁ = w₁·x₁ ⇒ ∂m₁/∂w₁ = x₁. Значит ∂ℓ/∂w₁ = (−1.0) · 2 = <tspan fill="#C30B0A" font-weight="800">−2.0</tspan>.</text>
              <text x="56" y="552" class="desc">m₂ = w₂·x₂ ⇒ ∂ℓ/∂w₂ = (−1.0) · 3 = <tspan fill="#C30B0A" font-weight="800">−3.0</tspan>. Все градиенты найдены.</text>
            `
          }
        },
        {
          title: "Шаг 6. Обновляем параметры",
          subtitle: "Идём против градиента: θ ← θ − η · ∇θ",
          state: {
            active: "",
            grads: { dL: "1", de: "−1.0", dyhat: "−1.0", dm1: "−1.0", dm2: "−1.0", db: "−1.0", dw1: "−2.0", dw2: "−3.0" },
            flow: { mse_in: true, sub_in: true, add_in: true, mw1_in: true, mw2_in: true, b_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4" rx="8"/>
              <text x="56" y="514" class="desc">С learning rate η = 0.1 обновляем:</text>
              <text x="56" y="538" class="desc">w₁ ← 1 − 0.1·(−2.0) = <tspan fill="#73B222" font-weight="800">1.2</tspan>; w₂ ← 0.5 − 0.1·(−3.0) = <tspan fill="#73B222" font-weight="800">0.8</tspan>; b ← 0.5 − 0.1·(−1.0) = <tspan fill="#73B222" font-weight="800">0.6</tspan></text>
              <text x="56" y="568" class="desc">Новое предсказание: ŷ' = 1.2·2 + 0.8·3 + 0.6 = 5.4; ℓ' = 0.08. Потеря упала с 0.5.</text>
            `
          }
        }
      ];

      let i = 0;
      function render() {
        const s = steps[i];
        $("lbTitle").textContent = s.title;
        $("lbSubtitle").textContent = s.subtitle;
        $("lbCounter").textContent = `${i + 1} из ${steps.length}`;
        $("lbScene").innerHTML = graphSVG(s.state);
        $("lbPrevGroup").style.display = i === 0 ? "none" : "block";
        $("lbNextText").textContent = i === steps.length - 1 ? "↻" : "Далее";
      }
      function next(){ i = (i < steps.length - 1) ? i + 1 : 0; render(); }
      function prev(){ if (i > 0) { i--; render(); } }
      $("lbNextBtn").addEventListener("click", next);
      $("lbPrevBtn").addEventListener("click", prev);
      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft")  prev();
      });
      render();
    })();
  ]]></script>
</svg>
</div>
</figure>

> **Главная мысль:** backward pass — это всё то же правило `∂L/∂w`, что мы видели для одного параметра, только аккуратно проведённое по цепочке сразу для всех параметров. Именно это автоматически делает `autograd` в PyTorch — поэтому при миллионе параметров никто не выводит производные руками.

### Та же идея в матричной форме

На практике обучаются не на одном объекте, а на **батче** — сразу нескольких примерах. Тогда тот же граф записывается матрицами: forward — это одно умножение `X · w + b`, а backward — пара матричных операций (`Xᵀ · ∂ℓ/∂ŷ` для весов и сумма столбца для `b`). Логика не меняется — меняется только форма записи.

<figure class="embedded-interactive" id="section-interactive-5">
  <div class="interactive-meta">Интерактив 5</div>
  <p class="interactive-desc">Backprop линейной регрессии в матричной форме</p>
<div class="interactive-svg-wrap">
<svg id="linMat" viewBox="0 0 960 680" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif" role="img" aria-label="Backprop линейной регрессии в матричной форме">
  <style>
    .data-cell  { fill: #F3F1EE; stroke: #5E5850; stroke-width: 1; }
    .param-cell { fill: #E8F0F7; stroke: #3576C0; stroke-width: 1.2; }
    .fwd-cell   { fill: #EDF7DD; stroke: #73B222; stroke-width: 1.2; }
    .bwd-cell   { fill: #FDE6E6; stroke: #C30B0A; stroke-width: 1.2; }
    .empty-cell { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; stroke-dasharray: 3,2; }

    .active-fwd { fill: #DBF0AE; stroke: #5C8E1B; stroke-width: 2; }
    .active-bwd { fill: #FBD0D0; stroke: #A1090A; stroke-width: 2; }

    .data-text  { fill: #5E5850; font-size: 14px; font-weight: 500; }
    .param-text { fill: #3576C0; font-size: 14px; font-weight: 600; }
    .fwd-text   { fill: #4C8316; font-size: 14px; font-weight: 600; }
    .bwd-text   { fill: #A1090A; font-size: 14px; font-weight: 600; }
    .empty-text { fill: #C9C2B8; font-size: 14px; }

    .label   { fill: #5E5850; font-size: 13px; }
    .formula { fill: #5E5850; font-size: 14px; font-weight: 500; }
    .formula-active { fill: #B08F00; font-size: 14px; font-weight: 700; }
    .header  { fill: #5E5850; font-size: 15px; font-weight: 700; }
    .title   { fill: #5E5850; font-size: 16px; font-weight: 700; }
    .shape   { fill: #968F85; font-size: 11px; }

    .desc-bg { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; }
    .desc-text { fill: #5E5850; font-size: 13px; }

    .col-sep { stroke: #E5E1DA; stroke-width: 1; }

    .nav-btn  { cursor: pointer; }
    .nav-btn rect { fill: #C29E08; stroke: #C29E08; }
    .nav-btn:hover rect { fill: #A88800; }
    .nav-btn text { fill: #fff; font-size: 14px; font-weight: 600; pointer-events: none; }
    .nav-prev rect { fill: #fff; stroke: #5E5850; stroke-width: 1.2; }
    .nav-prev text { fill: #5E5850; font-size: 16px; }
    .counter { fill: #5E5850; font-size: 13px; }
  </style>

  <g id="linMat-scene"></g>
  <g id="linMat-nav"></g>
</svg>
</div>
<script>
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const sceneEl = document.getElementById('linMat-scene');
  const navEl   = document.getElementById('linMat-nav');

  // ============ Values (verified) ============
  const X      = [[2, 3], [1, 2], [3, 1]];
  const y_vec  = [5, 3, 4];
  const w_vec  = [1, 0.5];
  const b      = 0.5;

  const yhat_vec  = [4, 2.5, 4];
  const e_vec     = [-1, -0.5, 0];
  const loss_v    = 0.208;

  const dyhat_vec = [-0.333, -0.167, 0];
  const dw_vec    = [-0.833, -1.333];
  const db_v      = -0.5;

  const w_new  = [1.083, 0.633];
  const b_new  = 0.55;

  // ============ SVG helpers ============
  function el(tag, attrs, ...kids) {
    const e = document.createElementNS(NS, tag);
    if (attrs) {
      for (const k in attrs) {
        if (attrs[k] != null) e.setAttribute(k, attrs[k]);
      }
    }
    for (const c of kids) {
      if (c == null) continue;
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else e.appendChild(c);
    }
    return e;
  }
  function rect(x, y, w, h, cls) {
    return el('rect', { x, y, width: w, height: h, class: cls, rx: 2, ry: 2 });
  }
  function txt(x, y, content, cls, anchor) {
    return el('text', { x, y, class: cls, 'text-anchor': anchor || 'middle' }, String(content));
  }

  function brackets(x, y, w, h) {
    const s = '#5E5850', sw = 1.4;
    return [
      el('path', { d: `M ${x-3} ${y-2} L ${x-7} ${y-2} L ${x-7} ${y+h+2} L ${x-3} ${y+h+2}`,
                   fill: 'none', stroke: s, 'stroke-width': sw }),
      el('path', { d: `M ${x+w+3} ${y-2} L ${x+w+7} ${y-2} L ${x+w+7} ${y+h+2} L ${x+w+3} ${y+h+2}`,
                   fill: 'none', stroke: s, 'stroke-width': sw })
    ];
  }

  function fmt(v, d) {
    if (v === 0) return '0';
    if (Number.isInteger(v) && Math.abs(v) < 100) return String(v);
    let s = v.toFixed(d);
    s = s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    return s;
  }

  const CW = 38, CH = 28;

  function drawMatrix(g, x, y, rows, cols, values, fillCls, textCls, active, decimals) {
    decimals = decimals == null ? 3 : decimals;
    const empty = values == null;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cx = x + j * CW, cy = y + i * CH;
        const cls = empty ? 'empty-cell' : (active ? (active === 'fwd' ? 'active-fwd' : 'active-bwd') : fillCls);
        g.appendChild(rect(cx, cy, CW, CH, cls));
        if (!empty) {
          const v = values[i * cols + j];
          g.appendChild(txt(cx + CW/2, cy + CH/2 + 5, fmt(v, decimals), textCls));
        } else {
          g.appendChild(txt(cx + CW/2, cy + CH/2 + 5, '?', 'empty-text'));
        }
      }
    }
    brackets(x, y, cols * CW, rows * CH).forEach(b => g.appendChild(b));
  }

  function drawScalar(g, x, y, value, fillCls, textCls, active, decimals) {
    decimals = decimals == null ? 3 : decimals;
    const empty = value == null;
    const cw = 56, ch = 30;
    const cls = empty ? 'empty-cell' : (active ? (active === 'fwd' ? 'active-fwd' : 'active-bwd') : fillCls);
    g.appendChild(rect(x, y, cw, ch, cls));
    if (!empty) {
      g.appendChild(txt(x + cw/2, y + ch/2 + 5, fmt(value, decimals), textCls));
    } else {
      g.appendChild(txt(x + cw/2, y + ch/2 + 5, '?', 'empty-text'));
    }
  }

  // ============ Steps ============
  const steps = [
    {
      title: 'Постановка: батч N = 3, признаков d = 2',
      active: null,
      fwd: { yhat: false, e: false, loss: false },
      bwd: { dyhat: false, dw: false, db: false, upd: false },
      desc: [
        'X — матрица батча (3 примера × 2 признака), y — реальные числовые значения (3×1).',
        'w (2×1) и b (скаляр) — обучаемые параметры. Цель: посчитать loss и градиенты',
        'по всем примерам сразу, без ручного прохода по каждому объекту.'
      ]
    },
    {
      title: 'Линейный слой: ŷ = X · w + b',
      active: 'yhat',
      fwd: { yhat: true, e: false, loss: false },
      bwd: { dyhat: false, dw: false, db: false, upd: false },
      desc: [
        'Одно матричное умножение даёт предсказания для всех примеров сразу.',
        'ŷ = Xw + b = [2·1 + 3·0.5,  1·1 + 2·0.5,  3·1 + 1·0.5]ᵀ + 0.5',
        '   = [3.5,  2,  3.5]ᵀ + 0.5  =  [4,  2.5,  4]ᵀ. Скаляр b добавляется через broadcasting.'
      ]
    },
    {
      title: 'Ошибка: e = ŷ − y — поэлементно',
      active: 'e',
      fwd: { yhat: true, e: true, loss: false },
      bwd: { dyhat: false, dw: false, db: false, upd: false },
      desc: [
        'Сравниваем каждое предсказание с соответствующим реальным значением.',
        'e = [4 − 5,  2.5 − 3,  4 − 4]ᵀ = [−1,  −0.5,  0]ᵀ.',
        'Отрицательное значение означает, что модель занизила прогноз.'
      ]
    },
    {
      title: 'Loss: ℓ = (1/2N) Σᵢ (ŷᵢ − yᵢ)²',
      active: 'loss',
      fwd: { yhat: true, e: true, loss: true },
      bwd: { dyhat: false, dw: false, db: false, upd: false },
      desc: [
        'Квадраты ошибок: 1, 0.25, 0. Сумма = 1.25.',
        'Усредняем с коэффициентом 1/(2N): ℓ = 1.25 / 6 ≈ 0.208.',
        'Коэффициент 1/2 оставляют, чтобы производная квадрата была проще.'
      ]
    },
    {
      title: 'Backward, шаг 1: ∂ℓ/∂ŷ = (1/N)(ŷ − y)',
      active: 'dyhat',
      fwd: { yhat: true, e: true, loss: true },
      bwd: { dyhat: true, dw: false, db: false, upd: false },
      desc: [
        'Для MSE производная по предсказанию равна residual/N.',
        '∂ℓ/∂ŷ = (1/3) · [−1,  −0.5,  0]ᵀ ≈ [−0.333,  −0.167,  0]ᵀ.',
        'Это градиент для каждого примера батча.'
      ]
    },
    {
      title: 'Backward, шаг 2: ∂ℓ/∂w = Xᵀ · ∂ℓ/∂ŷ',
      active: 'dw',
      fwd: { yhat: true, e: true, loss: true },
      bwd: { dyhat: true, dw: true, db: false, upd: false },
      desc: [
        'Xᵀ (2×3) собирает вклады всех примеров и возвращает градиент формы (2×1).',
        'dw[0] = 2·(−0.333) + 1·(−0.167) + 3·0 ≈ −0.833',
        'dw[1] = 3·(−0.333) + 2·(−0.167) + 1·0 ≈ −1.333.'
      ]
    },
    {
      title: 'Backward, шаг 3: ∂ℓ/∂b = Σᵢ (∂ℓ/∂ŷ)ᵢ',
      active: 'db',
      fwd: { yhat: true, e: true, loss: true },
      bwd: { dyhat: true, dw: true, db: true, upd: false },
      desc: [
        'b одинаково добавлялся ко всем примерам, поэтому на backward он получает сумму градиентов.',
        'db = −0.333 + (−0.167) + 0 = −0.5.',
        'Теперь найдены все градиенты: dw и db.'
      ]
    },
    {
      title: 'Шаг градиентного спуска (η = 0.1)',
      active: 'upd',
      fwd: { yhat: true, e: true, loss: true },
      bwd: { dyhat: true, dw: true, db: true, upd: true },
      desc: [
        'w ← w − η · dw = [1, 0.5] − 0.1 · [−0.833, −1.333] = [1.083, 0.633].',
        'b ← b − η · db = 0.5 − 0.1 · (−0.5) = 0.55.',
        'Новый loss ≈ 0.058 (был 0.208) — модель сделала шаг в правильном направлении.'
      ]
    }
  ];

  let i = 0;

  function render() {
    while (sceneEl.firstChild) sceneEl.removeChild(sceneEl.firstChild);
    while (navEl.firstChild)   navEl.removeChild(navEl.firstChild);

    const s = steps[i];

    // === Step title ===
    sceneEl.appendChild(txt(480, 32, s.title, 'title'));

    // === Column separators ===
    sceneEl.appendChild(el('line', { x1: 230, y1: 60, x2: 230, y2: 470, class: 'col-sep' }));
    sceneEl.appendChild(el('line', { x1: 560, y1: 60, x2: 560, y2: 470, class: 'col-sep' }));

    // === Column headers ===
    sceneEl.appendChild(txt(135, 78, 'Данные и параметры', 'header'));
    sceneEl.appendChild(txt(395, 78, 'Forward pass',       'header'));
    sceneEl.appendChild(txt(720, 78, 'Backward pass',      'header'));

    // ===== Column 1: data and params =====
    sceneEl.appendChild(txt(60, 118, 'X =', 'label', 'end'));
    drawMatrix(sceneEl, 70, 100, 3, 2, [2,3,1,2,3,1], 'data-cell', 'data-text', null, 0);
    sceneEl.appendChild(txt(108, 196, '(3 × 2) — батч', 'shape'));

    sceneEl.appendChild(txt(60, 230, 'y =', 'label', 'end'));
    drawMatrix(sceneEl, 70, 212, 3, 1, [5,3,4], 'data-cell', 'data-text', null, 0);
    sceneEl.appendChild(txt(89, 308, '(3 × 1) — target', 'shape'));

    sceneEl.appendChild(txt(60, 342, 'w =', 'label', 'end'));
    const wActive = s.active === 'upd';
    drawMatrix(sceneEl, 70, 324, 2, 1, s.bwd.upd ? w_new : w_vec,
               'param-cell', 'param-text', wActive ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(89, 392, '(2 × 1)', 'shape'));

    sceneEl.appendChild(txt(60, 420, 'b =', 'label', 'end'));
    drawScalar(sceneEl, 70, 405, s.bwd.upd ? b_new : b,
               'param-cell', 'param-text', wActive ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(98, 454, '(scalar)', 'shape'));

    // ===== Column 2: Forward =====
    const yhHl = s.active === 'yhat';
    sceneEl.appendChild(txt(260, 110, 'ŷ = X · w + b', yhHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(280, 138, 'ŷ =', 'label', 'end'));
    drawMatrix(sceneEl, 290, 120, 3, 1, s.fwd.yhat ? yhat_vec : null,
               'fwd-cell', 'fwd-text', yhHl ? 'fwd' : null, 2);
    sceneEl.appendChild(txt(309, 216, '(3 × 1)', 'shape'));

    const eHl = s.active === 'e';
    sceneEl.appendChild(txt(260, 250, 'e = ŷ − y', eHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(280, 278, 'e =', 'label', 'end'));
    drawMatrix(sceneEl, 290, 260, 3, 1, s.fwd.e ? e_vec : null,
               'fwd-cell', 'fwd-text', eHl ? 'fwd' : null, 3);
    sceneEl.appendChild(txt(309, 356, '(3 × 1)', 'shape'));

    const lHl = s.active === 'loss';
    sceneEl.appendChild(txt(260, 390, 'ℓ = (1/2N) Σᵢ eᵢ²', lHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(280, 423, 'ℓ =', 'label', 'end'));
    drawScalar(sceneEl, 290, 408, s.fwd.loss ? loss_v : null,
               'fwd-cell', 'fwd-text', lHl ? 'fwd' : null, 3);
    sceneEl.appendChild(txt(318, 457, '(scalar)', 'shape'));

    // ===== Column 3: Backward =====
    const dyHl = s.active === 'dyhat';
    sceneEl.appendChild(txt(580, 110, '∂ℓ/∂ŷ = (1/N)(ŷ − y)', dyHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(620, 138, '∂ℓ/∂ŷ =', 'label', 'end'));
    drawMatrix(sceneEl, 630, 120, 3, 1, s.bwd.dyhat ? dyhat_vec : null,
               'bwd-cell', 'bwd-text', dyHl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(649, 216, '(3 × 1)', 'shape'));

    const dwHl = s.active === 'dw';
    sceneEl.appendChild(txt(580, 250, '∂ℓ/∂w = Xᵀ · ∂ℓ/∂ŷ', dwHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(620, 278, '∂ℓ/∂w =', 'label', 'end'));
    drawMatrix(sceneEl, 630, 260, 2, 1, s.bwd.dw ? dw_vec : null,
               'bwd-cell', 'bwd-text', dwHl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(649, 328, '(2 × 1)', 'shape'));

    const dbHl = s.active === 'db';
    sceneEl.appendChild(txt(580, 362, '∂ℓ/∂b = Σᵢ (∂ℓ/∂ŷ)ᵢ', dbHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(620, 395, '∂ℓ/∂b =', 'label', 'end'));
    drawScalar(sceneEl, 630, 380, s.bwd.db ? db_v : null,
               'bwd-cell', 'bwd-text', dbHl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(658, 429, '(scalar)', 'shape'));

    if (s.bwd.upd) {
      sceneEl.appendChild(txt(580, 454, '↳ w, b обновлены слева (η = 0.1)',
                              'formula-active', 'start'));
    }

    // ===== Description box =====
    sceneEl.appendChild(rect(40, 490, 880, 95, 'desc-bg'));
    let dy = 511;
    for (const line of s.desc) {
      sceneEl.appendChild(txt(56, dy, line, 'desc-text', 'start'));
      dy += 20;
    }

    // ===== Navigation =====
    navEl.appendChild(txt(50, 645, `${i + 1} из ${steps.length}`, 'counter', 'start'));

    if (i > 0) {
      const prev = el('g', { class: 'nav-btn nav-prev' });
      prev.appendChild(rect(720, 622, 60, 36, ''));
      prev.appendChild(txt(750, 647, '←', '', 'middle'));
      prev.addEventListener('click', () => { i--; render(); });
      navEl.appendChild(prev);
    }

    const last = i === steps.length - 1;
    const next = el('g', { class: 'nav-btn' });
    next.appendChild(rect(790, 622, last ? 60 : 110, 36, ''));
    next.appendChild(txt(last ? 820 : 845, 646, last ? '↻' : 'Далее', '', 'middle'));
    next.addEventListener('click', () => { i = last ? 0 : i + 1; render(); });
    navEl.appendChild(next);
  }

  const matSvgEl = document.getElementById('linMat');
  matSvgEl.setAttribute('tabindex', '0');
  matSvgEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && i < steps.length - 1) { i++; render(); }
    else if (e.key === 'ArrowLeft' && i > 0)            { i--; render(); }
  });

  render();
})();
</script>
</figure>

---

## Часть 4. От таблицы к PyTorch — три версии одного и того же

Теперь соберём всё в код. Важная оговорка: в реальных проектах данные почти никогда не задают руками — их читают из CSV, выгружают из базы или парсят с сайтов. Здесь мы **для наглядности** впишем маленький датасет прямо в код, чтобы было видно каждое число; путь от таблицы к numpy при этом ровно тот же, что и с настоящим CSV.

### Данные: список → pandas → numpy

Данные обычно живут таблицей. Её удобно держать в pandas, а в numpy переводить только те колонки, что идут в модель: фичу `X` и таргет `Y`.

```python
import numpy as np
import pandas as pd

# Шаг 1. Сырые данные — как выгрузка объявлений о продаже.
# Каждый дом это словарь; на практике сюда же легли бы данные из CSV/БД.
listings = [
    {"address": "12 Maple St",    "sqft": 850,  "beds": 2, "price": 168000},
    {"address": "5 Oak Ave",      "sqft": 980,  "beds": 2, "price": 192000},
    {"address": "71 Pine Rd",     "sqft": 1100, "beds": 3, "price": 205000},
    {"address": "9 Cedar Ln",     "sqft": 1250, "beds": 3, "price": 248000},
    {"address": "33 Birch St",    "sqft": 1320, "beds": 3, "price": 240000},
    {"address": "60 Elm St",      "sqft": 1400, "beds": 3, "price": 272000},
    {"address": "18 Spruce Ct",   "sqft": 1500, "beds": 4, "price": 295000},
    {"address": "4 Willow Way",   "sqft": 1580, "beds": 4, "price": 310000},
    {"address": "27 Ash Blvd",    "sqft": 1650, "beds": 4, "price": 305000},
    {"address": "8 Poplar Dr",    "sqft": 1720, "beds": 4, "price": 338000},
    {"address": "55 Walnut St",   "sqft": 1850, "beds": 4, "price": 355000},
    {"address": "14 Cherry Ln",   "sqft": 1950, "beds": 5, "price": 372000},
    {"address": "90 Hickory Rd",  "sqft": 2100, "beds": 5, "price": 410000},
    {"address": "3 Magnolia Ct",  "sqft": 2250, "beds": 5, "price": 428000},
    {"address": "41 Sycamore Dr", "sqft": 2400, "beds": 5, "price": 445000},
    {"address": "22 Chestnut St", "sqft": 2550, "beds": 6, "price": 489000},
]

# Шаг 2. Кладём в pandas — теперь это привычная таблица.
df = pd.DataFrame(listings)
print(df.head())
print(df[["sqft", "price"]].describe())   # быстрый взгляд на разброс данных

# Шаг 3. Достаём в numpy только нужные колонки: фичу X и таргет Y.
# Модель работает с числовыми массивами, а не с DataFrame.
X = df[["sqft"]].to_numpy(dtype=float)     # (n, 1) — площадь
Y = df[["price"]].to_numpy(dtype=float)    # (n, 1) — цена
n = len(Y)
```

Важный момент про реальные данные: площадь измеряется тысячами, цена — сотнями тысяч. Если запустить градиентный спуск прямо на таких числах, шаги получаются гигантскими, и веса улетают в бесконечность за несколько итераций. Поэтому фичи (и таргет) **стандартизуют** — приводят к среднему 0 и разбросу 1. Это не «трюк ради красоты», а стандартная практика для любой реальной таблицы.

```python
# Стандартизация: вычитаем среднее, делим на стандартное отклонение.
# Без этого градиентный спуск на сырых ценах расходится (веса -> inf).
x_mean, x_std = X.mean(), X.std()
y_mean, y_std = Y.mean(), Y.std()

Xs = (X - x_mean) / x_std
Ys = (Y - y_mean) / y_std
```

### Версия 1. Просто функции на numpy

«Голая» математика из Частей 1–3: модель — это умножение матриц, обучение — ручной цикл из четырёх шагов. Столбец единиц добавляем, чтобы свободный член `β̂₀` стал ещё одним весом и всё считалось одним матричным произведением.

```python
# Добавляем столбец единиц: предсказание = ОДНО матричное умножение.
# w = [β̂₁, β̂₀] — наклон и свободный член в одном векторе.
Xb = np.hstack([Xs, np.ones_like(Xs)])     # (n, 2), на стандартизованных фичах

def predict(Xb, w):                        # FORWARD: ŷ = X · w
    return Xb @ w

def mse(yhat, Ys):                         # LOSS: средний квадрат ошибки
    return np.mean((yhat - Ys) ** 2)

def gradient(Xb, Ys, w):                   # BACKWARD: ∂MSE/∂w — выведено вручную
    error = Xb @ w - Ys                    # куда и насколько ошиблись
    return (2 / len(Ys)) * Xb.T @ error

# Тот самый цикл обучения: forward -> loss -> backward -> update
w = np.zeros((2, 1))                       # старт из нуля
lr = 0.1                                   # learning rate — размер шага
for epoch in range(5000):
    w -= lr * gradient(Xb, Ys, w)          # UPDATE: w ← w − α · ∂L/∂w

# Веса найдены в стандартизованном пространстве. Переводим обратно
# в человеческие единицы — $/sqft и базовую цену в долларах.
slope_std, intercept_std = w.ravel()
price_per_sqft = slope_std * y_std / x_std
base_price = y_mean + y_std * intercept_std - price_per_sqft * x_mean
print(f"Цена за sqft: ${price_per_sqft:.0f}")   # ≈ $188
print(f"Базовая цена: ${base_price:.0f}")       # ≈ $6500
```

И обещанное в Части 2 аналитическое решение «в одну строку»: для линейной регрессии минимум MSE можно найти без всякого спуска, причём прямо на сырых данных (нормальное уравнение к масштабу нечувствительно).

```python
# Метод наименьших квадратов: w = (XᵀX)⁻¹ Xᵀ y — на исходных X и Y.
# Даёт ровно тот же ответ, что 5000 шагов градиентного спуска выше.
Xb_raw = np.hstack([X, np.ones_like(X)])
w_exact = np.linalg.solve(Xb_raw.T @ Xb_raw, Xb_raw.T @ Y)
print(f"Цена за sqft: ${w_exact[0,0]:.0f}, база: ${w_exact[1,0]:.0f}")  # $188, $6528
```

### Версия 2. Тот же код, но в объектном виде

Математика не меняется — мы просто складываем те же четыре шага в класс. Это мостик к PyTorch: там модель устроена точно так же (`forward`, параметры внутри объекта, цикл обучения снаружи).

```python
class LinearRegression:
    def __init__(self, n_features):
        # Параметры модели живут внутри объекта
        self.w = np.zeros((n_features, 1))   # β̂₁ (наклон по каждой фиче)
        self.b = 0.0                         # β̂₀ (свободный член)

    def forward(self, X):                    # FORWARD: ŷ = X·w + b
        return X @ self.w + self.b

    def loss(self, yhat, Y):                 # LOSS: MSE
        return np.mean((yhat - Y) ** 2)

    def backward(self, X, Y, yhat):          # BACKWARD: градиенты по w и b
        error = yhat - Y
        n = len(Y)
        self.dw = (2 / n) * X.T @ error      # ∂L/∂w
        self.db = (2 / n) * np.sum(error)    # ∂L/∂b

    def step(self, lr):                      # UPDATE: шаг против градиента
        self.w -= lr * self.dw
        self.b -= lr * self.db

    def fit(self, X, Y, lr=0.1, epochs=5000):
        for _ in range(epochs):              # тот же цикл из 4 шагов
            yhat = self.forward(X)
            self.backward(X, Y, yhat)
            self.step(lr)

model = LinearRegression(n_features=1)
model.fit(Xs, Ys)                            # обучаем на стандартизованных данных

# Переводим веса обратно в доллары
price_per_sqft = float(model.w) * y_std / x_std
base_price = y_mean + y_std * model.b - price_per_sqft * x_mean
print(f"${price_per_sqft:.0f}/sqft, база ${base_price:.0f}")   # $188, $6500
```

### Версия 3. PyTorch — и почему он «решает быстро»

Цикл остаётся буквально тем же: forward → loss → backward → update. Но градиент больше не выводим руками — весь блок `backward` из версий 1 и 2 заменяется одной строкой `loss.backward()`. PyTorch сам строит вычислительный граф и считает все производные за один обратный проход — это ровно тот backpropagation из Части 3.

```python
import torch
import torch.nn as nn

# Те же стандартизованные данные, только в виде тензоров
Xt = torch.tensor(Xs, dtype=torch.float32)
Yt = torch.tensor(Ys, dtype=torch.float32)

model = nn.Linear(1, 1)                                  # MODEL: ŷ = X·w + b
loss_fn = nn.MSELoss()                                   # LOSS: тот же MSE
optimizer = torch.optim.SGD(model.parameters(), lr=0.1) # правило UPDATE

for epoch in range(5000):
    optimizer.zero_grad()        # обнуляем градиенты с прошлого шага
    yhat = model(Xt)             # FORWARD
    loss = loss_fn(yhat, Yt)     # LOSS
    loss.backward()              # BACKWARD: ВСЕ градиенты автоматически (autograd)
    optimizer.step()             # UPDATE: w ← w − α · ∂L/∂w

# Переводим обратно в доллары
slope = model.weight.item() * y_std / x_std
base = y_mean + y_std * model.bias.item() - slope * x_mean
print(f"${slope:.0f}/sqft, база ${base:.0f}")           # $188, $6500
```

Все три версии сходятся к одному ответу — около **$188 за квадратный фут** и базовой цене **≈ $6 500** (RMSE ≈ $7 400, то есть модель промахивается в среднем на пару процентов цены). Разница между версиями не в результате, а в том, сколько математики мы пишем руками: numpy — выводим градиент сами; PyTorch — описываем только _что_ считаем (модель и loss), а _как_ брать производные, autograd берёт на себя.

Два реальных урока всплыли тут естественным образом: данные приходят таблицей и проходят путь список → pandas → numpy, а признаки разного масштаба приходится стандартизовать, иначе градиентный спуск разлетается.

---

## Часть 5. Та же логика — для любой модели

И вот мы добрались до главного. **Тот цикл, которым мы только что обучили линейную регрессию, в точности так же работает для нейросетей и любых других ML-моделей.**

У каждой ML-задачи есть четыре блока: **Task** — что именно мы предсказываем; **Data** — примеры `(x, y)` из реального мира; **Model** — то, что обучаем (от двухпараметрической прямой до миллиардов весов); **Loss** — функция, измеряющая ошибку. И один цикл, который повторяется тысячи раз: forward → loss → backward → update.

Правило обновления — то же самое, что мы видели для линрегрессии. Только теперь параметров не два, а много:

<figure class="embedded-interactive" id="section-interactive-6">
  <div class="interactive-meta">Интерактив 6</div>
  <p class="interactive-desc">Цикл обучения линейной регрессии</p>
<div class="interactive-svg-wrap">
<svg id="trainingLoopLinReg" viewBox="0 0 960 680" width="100%" role="img" aria-label="Цикл обучения линейной регрессии">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    .title { font-size: 24px; font-weight: 800; fill: #111111; }
    .subtitle { font-size: 15px; fill: #5E5850; }
    .text { font-size: 16px; fill: #111111; }
    .small { font-size: 13px; fill: #5E5850; }
    .label { font-size: 13px; fill: #111111; }
    .mono { font-family: 'Courier New', Courier, monospace; }
    .axis { stroke: #5E5850; stroke-width: 1.2; }
    .grid { stroke: #ECECEC; stroke-width: 1; }

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

  <text id="tll-title" x="36" y="48" class="title"></text>
  <text id="tll-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="tll-scene"></g>

  <text id="tll-counter" x="36" y="635" class="text"></text>

  <g id="tll-prevGroup">
    <rect id="tll-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="tll-nextGroup">
    <rect id="tll-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="tll-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      const arrowDefs = `
        <defs>
          <marker id="tll-ar-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#3576C0"/>
          </marker>
          <marker id="tll-ar-yellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C29E08"/>
          </marker>
          <marker id="tll-ar-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/>
          </marker>
          <marker id="tll-ar-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#5E5850"/>
          </marker>
        </defs>
      `;

      function lossCurve() {
        const X0 = 500, X1 = 900, Y0 = 540, Y1 = 200;
        const xpx = (i) => X0 + i / 1000 * (X1 - X0);
        const ypx = (l) => Y0 - Math.min(l, 0.25) / 0.25 * (Y0 - Y1);
        let s = '';
        [0, 250, 500, 750, 1000].forEach(i => {
          const xp = xpx(i);
          s += `<line x1="${xp}" y1="${Y1}" x2="${xp}" y2="${Y0}" class="grid"/>`;
          s += `<text x="${xp}" y="${Y0+18}" text-anchor="middle" class="small">${i}</text>`;
        });
        [0, 0.1, 0.2].forEach(l => {
          const yp = ypx(l);
          s += `<line x1="${X0}" y1="${yp}" x2="${X1}" y2="${yp}" class="grid"/>`;
          s += `<text x="${X0-8}" y="${yp+4}" text-anchor="end" class="small">${l.toFixed(2)}</text>`;
        });
        s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s += `<text x="${(X0+X1)/2}" y="${Y0+40}" text-anchor="middle" class="label" style="font-weight:700;">итерации обучения</text>`;
        s += `<text x="${X0-30}" y="${Y1-12}" class="label" style="font-weight:700;fill:#C30B0A;">Loss</text>`;
        let path = '';
        for (let i = 0; i <= 1000; i += 8) {
          const L = 0.23 * Math.exp(-i/180) + 0.005;
          path += (path === '' ? 'M' : 'L') + ' ' + xpx(i).toFixed(1) + ' ' + ypx(L).toFixed(1) + ' ';
        }
        s += `<path d="${path}" fill="none" stroke="#C30B0A" stroke-width="2.6"/>`;
        const pts = [
          {i: 0,    L: 0.23,  t: 'старт',   c: '#C30B0A'},
          {i: 1000, L: 0.006, t: 'обучено', c: '#73B222'}
        ];
        pts.forEach(p => {
          s += `<circle cx="${xpx(p.i)}" cy="${ypx(p.L)}" r="6" fill="${p.c}" stroke="#fff" stroke-width="2"/>`;
          s += `<text x="${xpx(p.i)}" y="${ypx(p.L)-14}" text-anchor="${p.i===0?'start':'end'}" class="small" style="font-weight:700;fill:${p.c};">${p.t}</text>`;
        });
        return s;
      }

      const PX0 = 500, PX1 = 900, PY0 = 540, PY1 = 200;
      const sx = (x) => PX0 + x / 10 * (PX1 - PX0);
      const sy = (y) => PY0 - y / 10 * (PY0 - PY1);
      const dpts = [[1,1.3],[2,2.2],[3,2.5],[4,3.7],[5,4.1],[6,5.2],[7,5.5],[8,6.7],[9,7.0]];
      function scatter() {
        let s = '';
        for (let g = 0; g <= 10; g += 2) {
          s += `<line x1="${sx(0)}" y1="${sy(g)}" x2="${sx(10)}" y2="${sy(g)}" class="grid"/>`;
          s += `<line x1="${sx(g)}" y1="${sy(0)}" x2="${sx(g)}" y2="${sy(10)}" class="grid"/>`;
        }
        s += `<line x1="${sx(0)}" y1="${sy(0)}" x2="${sx(10)}" y2="${sy(0)}" class="axis"/>`;
        s += `<line x1="${sx(0)}" y1="${sy(0)}" x2="${sx(0)}" y2="${sy(10)}" class="axis"/>`;
        s += `<text x="${(sx(0)+sx(10))/2}" y="${sy(0)+38}" text-anchor="middle" class="label">площадь</text>`;
        s += `<text x="${sx(0)-26}" y="${sy(10)-6}" class="label" style="fill:#3576C0;">цена</text>`;
        s += `<line x1="${sx(0)}" y1="${sy(0.7)}" x2="${sx(10)}" y2="${sy(7.5)}" stroke="#73B222" stroke-width="3"/>`;
        dpts.forEach(p => { s += `<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="5.5" fill="#3576C0"/>`; });
        return s;
      }

      const scene1 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Один цикл — четыре шага</text>
          <text x="60" y="192" class="text">Обучение любой модели —</text>
          <text x="60" y="214" class="text">это повторение одного цикла:</text>
          <text x="78" y="248" class="text"><tspan style="font-weight:700;fill:#C29E08;">forward</tspan> — считаем ŷ</text>
          <text x="78" y="272" class="text"><tspan style="font-weight:700;fill:#C30B0A;">loss</tspan> — насколько ошиблись</text>
          <text x="78" y="296" class="text"><tspan style="font-weight:700;fill:#C30B0A;">backward</tspan> — градиент по каждому β̂</text>
          <text x="78" y="320" class="text"><tspan style="font-weight:700;fill:#73B222;">update</tspan> — шаг против градиента</text>
          <text x="60" y="362" class="text">Это ровно те шаги, что мы</text>
          <text x="60" y="384" class="text">прошли в Частях 2 и 3 —</text>
          <text x="60" y="406" class="text">здесь они собраны в петлю.</text>
          <rect x="60" y="430" width="340" height="62" class="box-blue"/>
          <text x="230" y="460" text-anchor="middle" class="text mono" style="font-weight:700;">β̂ ← β̂ − α · ∂L/∂β̂</text>
          <text x="230" y="481" text-anchor="middle" class="small">одно правило для всех параметров</text>
        </g>
        <g>
          <rect x="600" y="150" width="240" height="64" class="box-yellow"/>
          <text x="720" y="178" text-anchor="middle" class="text" style="font-weight:700;fill:#C29E08;">FORWARD</text>
          <text x="720" y="200" text-anchor="middle" class="small mono">ŷ = β̂₁·x + β̂₀</text>

          <rect x="600" y="246" width="240" height="64" class="box-red"/>
          <text x="720" y="274" text-anchor="middle" class="text" style="font-weight:700;fill:#C30B0A;">LOSS</text>
          <text x="720" y="296" text-anchor="middle" class="small mono">(y − ŷ)² → одно число</text>

          <rect x="600" y="342" width="240" height="64" class="box-red"/>
          <text x="720" y="370" text-anchor="middle" class="text" style="font-weight:700;fill:#C30B0A;">BACKWARD</text>
          <text x="720" y="392" text-anchor="middle" class="small mono">∂L/∂β̂₁ , ∂L/∂β̂₀</text>

          <rect x="600" y="438" width="240" height="64" class="box-green"/>
          <text x="720" y="466" text-anchor="middle" class="text" style="font-weight:700;fill:#73B222;">UPDATE</text>
          <text x="720" y="488" text-anchor="middle" class="small mono">β̂ ← β̂ − α·∂L/∂β̂</text>

          <line x1="720" y1="216" x2="720" y2="244" stroke="#5E5850" stroke-width="2" marker-end="url(#tll-ar-gray)"/>
          <line x1="720" y1="312" x2="720" y2="340" stroke="#5E5850" stroke-width="2" marker-end="url(#tll-ar-gray)"/>
          <line x1="720" y1="408" x2="720" y2="436" stroke="#5E5850" stroke-width="2" marker-end="url(#tll-ar-gray)"/>

          <path d="M 842 470 C 912 470 912 182 844 182" fill="none" stroke="#3576C0" stroke-width="2.2" marker-end="url(#tll-ar-blue)"/>
          <text x="905" y="330" text-anchor="middle" class="small" style="fill:#3576C0;font-weight:700;" transform="rotate(90 905 330)">повторяем тысячи раз</text>
        </g>
      `;

      const scene2 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Повторяем — тысячи раз</text>
          <text x="60" y="195" class="text">Один проход цикла почти</text>
          <text x="60" y="217" class="text">ничего не меняет. Но мы</text>
          <text x="60" y="239" class="text">повторяем его снова и снова.</text>
          <rect x="60" y="262" width="340" height="92" class="box-blue"/>
          <text x="78" y="288" class="small">• один пример → <tspan style="font-weight:700;">step</tspan></text>
          <text x="78" y="312" class="small">• пачка примеров → <tspan style="font-weight:700;">batch</tspan></text>
          <text x="78" y="336" class="small">• весь датасет 1 раз → <tspan style="font-weight:700;">epoch</tspan></text>
          <text x="60" y="392" class="text" style="font-weight:700;fill:#73B222;">Loss падает с каждой</text>
          <text x="60" y="414" class="text" style="font-weight:700;fill:#73B222;">итерацией — модель учится.</text>
          <text x="60" y="458" class="small">Когда падать почти перестаёт —</text>
          <text x="60" y="476" class="small">обучение можно останавливать.</text>
        </g>
        <g>${lossCurve()}</g>
      `;

      const scene3 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Обученная модель</text>
          <text x="60" y="195" class="text">После многих итераций</text>
          <text x="60" y="217" class="text">параметры нашли значения,</text>
          <text x="60" y="239" class="text">при которых loss минимальный.</text>
          <rect x="60" y="262" width="340" height="62" class="box-green"/>
          <text x="78" y="288" class="text mono">ŷ = 0.76 · sqft − 27</text>
          <text x="78" y="310" class="small">β̂₁ ≈ 0.76,  β̂₀ ≈ −27</text>
          <text x="60" y="356" class="text">Зелёная прямая проходит</text>
          <text x="60" y="378" class="text">через облако точек так, что</text>
          <text x="60" y="400" class="text">ошибки в сумме минимальны.</text>
          <text x="60" y="446" class="text" style="font-weight:700;fill:#73B222;">ŷ ≈ y — для нового x</text>
          <text x="60" y="468" class="text" style="font-weight:700;fill:#73B222;">модель даёт ответ.</text>
          <text x="60" y="500" class="small">(значения β̂ — иллюстративные)</text>
        </g>
        <g>${scatter()}</g>
      `;

      const scene4 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Анатомия обучения</text>
          <text x="60" y="195" class="text">У любой модели обучение</text>
          <text x="60" y="217" class="text">устроено из одних и тех же</text>
          <text x="60" y="239" class="text">блоков:</text>
          <text x="78" y="270" class="text"><tspan style="font-weight:700;fill:#3576C0;">Task</tspan> — что предсказываем</text>
          <text x="78" y="292" class="text"><tspan style="font-weight:700;fill:#3576C0;">Data</tspan> — примеры (x, y)</text>
          <text x="78" y="314" class="text"><tspan style="font-weight:700;fill:#3576C0;">Model</tspan> — то, что обучаем</text>
          <text x="78" y="336" class="text"><tspan style="font-weight:700;fill:#C30B0A;">Loss</tspan> — насколько ошибается</text>
          <text x="60" y="376" class="text">Плюс цикл forward → loss →</text>
          <text x="60" y="398" class="text">backward → update.</text>
          <rect x="60" y="418" width="340" height="74" class="box-green"/>
          <text x="230" y="444" text-anchor="middle" class="text" style="font-weight:700;fill:#73B222;">Линейная регрессия —</text>
          <text x="230" y="466" text-anchor="middle" class="small">это тот же каркас в самом</text>
          <text x="230" y="482" text-anchor="middle" class="small">простом виде.</text>
        </g>
        <g>
          <rect x="600" y="150" width="240" height="64" class="box-blue"/>
          <text x="720" y="178" text-anchor="middle" class="text" style="font-weight:800;fill:#3576C0;">Task</text>
          <text x="720" y="200" text-anchor="middle" class="small">определяет вид Loss</text>

          <rect x="780" y="280" width="140" height="120" class="box-blue"/>
          <text x="850" y="310" text-anchor="middle" class="text" style="font-weight:800;fill:#3576C0;">Data</text>
          <text x="850" y="336" text-anchor="middle" class="small">(x, y)</text>
          <text x="850" y="358" text-anchor="middle" class="small">пары вход-</text>
          <text x="850" y="376" text-anchor="middle" class="small">истина</text>

          <rect x="560" y="280" width="200" height="120" class="box-red"/>
          <text x="660" y="310" text-anchor="middle" class="text" style="font-weight:800;fill:#C30B0A;">Loss</text>
          <text x="660" y="336" text-anchor="middle" class="small">«насколько</text>
          <text x="660" y="354" text-anchor="middle" class="small">ошиблись»</text>
          <text x="660" y="384" text-anchor="middle" class="small mono" style="fill:#C30B0A;">→ одно число</text>

          <rect x="600" y="460" width="240" height="64" class="box-blue"/>
          <text x="720" y="488" text-anchor="middle" class="text" style="font-weight:800;fill:#3576C0;">Model</text>
          <text x="720" y="510" text-anchor="middle" class="small">принимает x → даёт ŷ</text>

          <line x1="720" y1="216" x2="720" y2="278" stroke="#3576C0" stroke-width="2" marker-end="url(#tll-ar-blue)"/>
          <line x1="778" y1="340" x2="762" y2="340" stroke="#3576C0" stroke-width="2" marker-end="url(#tll-ar-blue)"/>
          <line x1="700" y1="458" x2="662" y2="402" stroke="#C29E08" stroke-width="2" marker-end="url(#tll-ar-yellow)"/>
          <line x1="660" y1="402" x2="700" y2="458" stroke="#C30B0A" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#tll-ar-red)"/>
          <text x="612" y="436" class="small" style="fill:#C29E08;font-weight:700;">ŷ</text>
          <text x="690" y="442" class="small" style="fill:#C30B0A;font-weight:700;">градиенты</text>
        </g>
      `;

      const steps = [
        { title: "Шаг 1. Цикл обучения: четыре шага",
          subtitle: "forward → loss → backward → update — одна петля",
          scene: scene1 },
        { title: "Шаг 2. Повторяем — тысячи раз",
          subtitle: "Loss падает с каждой итерацией — модель учится",
          scene: scene2 },
        { title: "Шаг 3. Обученная модель",
          subtitle: "Параметры найдены — ŷ ≈ y на данных",
          scene: scene3 },
        { title: "Шаг 4. Анатомия обучения",
          subtitle: "Task — Data — Model — Loss: один каркас для любой ML-модели",
          scene: scene4 }
      ];

      let currentStep = 0;
      function renderStep() {
        const step = steps[currentStep];
        $("tll-title").textContent = step.title;
        $("tll-subtitle").textContent = step.subtitle;
        $("tll-counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("tll-scene").innerHTML = step.scene;
        $("tll-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("tll-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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
      $("tll-nextBtn").addEventListener("click", nextStep);
      $("tll-prevBtn").addEventListener("click", prevStep);
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

> **Главная мысль:** правило `w ← w − α · ∂L/∂w` — это в точности то же самое, что мы видели для линейной регрессии. Только теперь параметров не два, а много, и градиент по каждому из них считает backpropagation за один обратный проход.

---

## Что важно вынести

Линейная регрессия — это не «одна из ML-моделей». Это базовая интуиция, лежащая под всеми остальными:

1. **Любая модель — это функция** `ŷ = f(x; w)`, где `w` — параметры.
2. **Функция потерь** — это способ сказать «насколько модель ошибается» одним числом.
3. **Градиентный спуск** — общий рецепт минимизации функции потерь.
4. **Backpropagation** — способ эффективно вычислять градиент по каждому параметру за один обратный проход.
5. **Training loop** — это просто многократное повторение четырёх шагов: forward, loss, backward, update.

Если ты понял линейную регрессию — каркас всех современных моделей у тебя в кармане. Остальное — вариации на тему: другие архитектуры моделей, другие функции потерь, другие оптимизаторы. Но цикл обучения остаётся тем же: forward, loss, backward, update — повторённый много-много раз.
