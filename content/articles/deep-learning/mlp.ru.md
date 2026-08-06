<script>
/* Формулы в шаговых панелях размечены как <div class="math-display" data-tex="…">
   и рендерятся здесь. KaTeX подключён на странице через defer, поэтому к моменту
   запуска этого скрипта он может быть ещё не готов — ждём его, а не пропускаем
   формулы молча (иначе панели остались бы просто без формул). */
(function () {
  function renderProseMath() {
    document.querySelectorAll('[data-tex]').forEach(function (node) {
      if (node.querySelector('.katex')) return;   // уже отрисовано
      try {
        katex.render(node.getAttribute('data-tex'), node, {
          throwOnError: false,
          displayMode: node.classList.contains('math-display')
        });
      } catch (e) {}
    });
  }
  var tries = 0;
  (function waitForKatex() {
    if (window.katex) { renderProseMath(); return; }
    if (++tries > 100) return;                    // сдаёмся через ~10 c
    setTimeout(waitForKatex, 100);
  })();
})();
</script>

В прошлой статье мы разобрали линейную регрессию и увидели, что у неё с обучением нейросетей один и тот же каркас: forward pass → loss → backward pass → update. Теперь сделаем следующий шаг — построим полносвязную нейросеть и поймём, чем она принципиально отличается от линрегрессии и почему именно она может решать задачи, с которыми прямая не справляется.

Логика та же, что и раньше: от простого к общему. Один нейрон → слой нейронов → стек слоёв. Каждая часть с интерактивной пошаговой визуализацией. В конце соберём всё в код — на numpy и PyTorch — и увидим обучение сети в действии.

> **Главный мост между темами:** линейная регрессия учит одну линейную формулу; логистическая регрессия добавляет sigmoid и превращает линейную формулу в вероятность; MLP добавляет скрытые слои и учит промежуточные представления. Формула обучения при этом остаётся той же: forward → loss → backward → update.

| Модель | Формула | Что умеет |
|---|---|---|
| **Линейная регрессия** | `ŷ = w·x + b` | предсказывает непрерывное число |
| **Логистическая регрессия** | `a = σ(w·x + b)` | даёт вероятность класса 1 |
| **MLP** | `ŷ = f₃(f₂(f₁(x)))` | учит нелинейные представления через скрытые слои |

---

## Часть 1. Один нейрон

Линрегрессия делает одну простую вещь: проводит прямую через данные. Это отлично работает, когда зависимость между `x` и `y` и впрямь линейная. Но мир редко такой удобный — настоящие зависимости почти всегда изогнутые, и прямая через них «не пролезает».

Возьмём задачу бинарной классификации: одни точки относятся к классу 0, другие — к классу 1. Линрегрессия попробует провести прямую, но она будет проходить «сквозь» оба класса — для значений между ними будет выдавать промежуточные числа. Их можно попытаться читать как «уверенность», но линейная модель не ограничивает выход диапазоном от 0 до 1 и плохо подходит под вероятностную классификацию.

Идея простая: что если после линейной части добавить ещё одно преобразование — **нелинейную функцию активации**? Получится **нейрон**:

```
z = w · x + b           ← это линрегрессия
a = σ(z)                ← это активация
выход нейрона: a
```

Нейрон состоит из двух частей: уже знакомая линейная часть и новая — активация. Активация принимает число и возвращает число, но делает это нелинейно — например, плавно зажимает любой вход в диапазон от 0 до 1 (это и есть sigmoid).

> **Зачем активация принципиально нужна?** Если бы её не было, мы могли бы стэкать линейные слои сколько угодно — но композиция линейных функций остаётся линейной. `w₂·(w₁·x + b₁) + b₂ = (w₂·w₁)·x + (w₂·b₁ + b₂)` — снова одна прямая. Активация — это то, что разрывает эту цепочку и даёт сети способность к нелинейным предсказаниям.

Посмотрим всё это пошагово:

<figure class="embedded-interactive" id="section-interactive-1">
  <div class="interactive-meta">Интерактив 1</div>
  <p class="interactive-desc">От линейной регрессии к нейрону</p>
<div class="interactive-svg-wrap">
<svg id="neuronIntuition" viewBox="0 0 960 680" width="100%" role="img" aria-label="От линейной регрессии к нейрону: пошаговая интуиция">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .text { font-size: 16px; fill: #111111; }
    svg .small { font-size: 13px; fill: #5E5850; }
    svg .label { font-size: 13px; fill: #111111; }
    svg .axis { stroke: #5E5850; stroke-width: 1.2; }
    svg .grid { stroke: #ECECEC; stroke-width: 1; }
    svg .mono { font-family: 'Courier New', Courier, monospace; }

    svg .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    svg .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    svg .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    svg .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }

    svg .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                                  text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                            text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <text id="n-title" x="36" y="48" class="title"></text>
  <text id="n-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="n-scene"></g>

  <text id="n-counter" x="36" y="635" class="text"></text>

  <g id="n-prevGroup">
    <rect id="n-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="n-nextGroup">
    <rect id="n-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="n-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      // ========== Данные классификации: 1D ==========
      // класс 0 — точки слева (зелёные внизу, y=0)
      // класс 1 — точки справа (синие вверху, y=1)
      const dataC0 = [0.5, 1.0, 1.4, 1.7, 2.1, 2.5, 3.0, 3.4].map(x => ({x, y: 0}));
      const dataC1 = [5.6, 6.1, 6.5, 7.0, 7.4, 7.9, 8.3, 8.8].map(x => ({x, y: 1}));

      // Геометрия основного графика
      const X0 = 480, X1 = 900;
      const Y0 = 530, Y1 = 200;
      const xPx = (x) => X0 + x / 10 * (X1 - X0);
      const yPx = (y) => Y0 - y * (Y0 - Y1);

      function axes(xLabel = 'x', yLabel = '') {
        let s = '';
        for (let xi = 0; xi <= 10; xi += 2) {
          const xp = xPx(xi);
          s += `<line x1="${xp}" y1="${Y0}" x2="${xp}" y2="${Y1}" class="grid"/>`;
          s += `<text x="${xp}" y="${Y0+18}" text-anchor="middle" class="small">${xi}</text>`;
        }
        [0, 0.5, 1].forEach(yi => {
          const yp = yPx(yi);
          s += `<line x1="${X0}" y1="${yp}" x2="${X1}" y2="${yp}" class="grid"/>`;
          s += `<text x="${X0-8}" y="${yp+4}" text-anchor="end" class="small">${yi}</text>`;
        });
        s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s += `<text x="${(X0+X1)/2}" y="${Y0+38}" text-anchor="middle" class="label" style="font-weight:700;">${xLabel}</text>`;
        if (yLabel) s += `<text x="${X0-30}" y="${Y1-8}" class="label" style="font-weight:700;">${yLabel}</text>`;
        return s;
      }

      function dataPoints() {
        let s = '';
        dataC0.forEach(d => {
          s += `<circle cx="${xPx(d.x)}" cy="${yPx(d.y)}" r="6" fill="#73B222" stroke="#fff" stroke-width="1.5"/>`;
        });
        dataC1.forEach(d => {
          s += `<circle cx="${xPx(d.x)}" cy="${yPx(d.y)}" r="6" fill="#3576C0" stroke="#fff" stroke-width="1.5"/>`;
        });
        return s;
      }

      function linRegLine() {
        // прямая через примерно (1.5, 0.1) и (8.5, 0.9)
        // y = 0.114*x - 0.07
        const x1 = 0, x2 = 10;
        const y1 = -0.07, y2 = 0.114*10 - 0.07;
        return `<line x1="${xPx(x1)}" y1="${yPx(Math.max(0,Math.min(1,y1)))}"
                       x2="${xPx(x2)}" y2="${yPx(Math.max(0,Math.min(1,y2)))}"
                       stroke="#C29E08" stroke-width="3"/>`;
      }

      function sigmoidCurve(w = 2, b = -9) {
        // a = sigmoid(w*x + b)
        let path = '';
        for (let xi = 0; xi <= 10; xi += 0.1) {
          const z = w * xi + b;
          const a = 1 / (1 + Math.exp(-z));
          path += (path === '' ? 'M' : 'L') + ' ' + xPx(xi).toFixed(1) + ' ' + yPx(a).toFixed(1) + ' ';
        }
        return `<path d="${path}" fill="none" stroke="#73B222" stroke-width="3"/>`;
      }

      // ============================================
      // ШАГ 1: проблема — линрегрессия не справляется с классификацией
      // ============================================
      const scene1 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-red"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Проблема линрегрессии</text>
          <text x="60" y="195" class="text">У нас задача:</text>
          <text x="60" y="217" class="text">по числу x определить</text>
          <text x="60" y="239" class="text">класс — 0 или 1.</text>

          <text x="60" y="278" class="text"><tspan style="font-weight:700;fill:#73B222;">●</tspan> зелёные — класс 0</text>
          <text x="60" y="300" class="text"><tspan style="font-weight:700;fill:#3576C0;">●</tspan> синие  — класс 1</text>

          <rect x="60" y="322" width="340" height="80" class="box-red"/>
          <text x="78" y="346" class="text" style="font-weight:700;fill:#C30B0A;">Прямая (линрегрессия)</text>
          <text x="78" y="365" class="small">пытается «соединить» классы</text>
          <text x="78" y="383" class="small">плавной зависимостью.</text>
          <text x="78" y="401" class="small">Для x=4 предскажет ≈ 0.4 —</text>

          <text x="60" y="438" class="small">но это плохой класс:</text>
          <text x="60" y="456" class="text" style="font-weight:700;fill:#C30B0A;">нужна вероятность и правило порога.</text>

          <text x="60" y="495" class="small" style="fill:#3576C0;">Нужна <tspan style="font-weight:700;">нелинейная</tspan> модель.</text>
        </g>
        <g>
          ${axes('x', 'класс')}
          ${linRegLine()}
          ${dataPoints()}
          <text x="${xPx(8)}" y="${yPx(0.83)-12}" class="label" style="font-weight:700;fill:#C29E08;">линрегрессия</text>
          <text x="${xPx(8)}" y="${yPx(0.83)+4}" class="small" style="fill:#C29E08;">плохо подходит</text>
        </g>
      `;

      // ============================================
      // ШАГ 2: анатомия нейрона
      // ============================================
      const scene2 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Анатомия нейрона</text>
          <text x="60" y="195" class="text">Нейрон — это две операции,</text>
          <text x="60" y="217" class="text">соединённые подряд:</text>

          <rect x="60" y="240" width="340" height="60" class="box-yellow"/>
          <text x="78" y="263" class="small" style="font-weight:700;fill:#C29E08;">1. ЛИНЕЙНАЯ ЧАСТЬ</text>
          <text x="78" y="285" class="text mono">z = w · x + b</text>

          <rect x="60" y="316" width="340" height="60" class="box-red"/>
          <text x="78" y="339" class="small" style="font-weight:700;fill:#C30B0A;">2. АКТИВАЦИЯ (нелинейная)</text>
          <text x="78" y="361" class="text mono">a = σ(z)</text>

          <text x="60" y="410" class="text"><tspan class="mono" style="font-weight:700;">w</tspan>, <tspan class="mono" style="font-weight:700;">b</tspan> — параметры (учим),</text>
          <text x="60" y="432" class="text"><tspan class="mono" style="font-weight:700;">σ</tspan> — фиксированная функция.</text>

          <text x="60" y="475" class="small" style="fill:#3576C0;font-weight:700;">Линейная часть — это</text>
          <text x="60" y="493" class="small" style="fill:#3576C0;font-weight:700;">та же линрегрессия!</text>
        </g>

        <g>
          <!-- Граф нейрона -->
          <text x="690" y="180" text-anchor="middle" class="text" style="font-weight:800;">один нейрон</text>

          <!-- вход x -->
          <circle cx="510" cy="370" r="28" fill="#fff" stroke="#3576C0" stroke-width="2.5"/>
          <text x="510" y="376" text-anchor="middle" class="text" style="font-weight:800;">x</text>

          <!-- линейная часть -->
          <rect x="590" y="340" width="100" height="60" class="box-yellow"/>
          <text x="640" y="365" text-anchor="middle" class="small" style="font-weight:700;fill:#C29E08;">линейная</text>
          <text x="640" y="385" text-anchor="middle" class="text mono">w·x + b</text>

          <!-- активация -->
          <rect x="730" y="340" width="100" height="60" class="box-red"/>
          <text x="780" y="365" text-anchor="middle" class="small" style="font-weight:700;fill:#C30B0A;">активация</text>
          <text x="780" y="385" text-anchor="middle" class="text mono">σ( · )</text>

          <!-- выход -->
          <circle cx="880" cy="370" r="28" fill="#fff" stroke="#73B222" stroke-width="2.5"/>
          <text x="880" y="376" text-anchor="middle" class="text" style="font-weight:800;fill:#73B222;">a</text>

          <!-- стрелки -->
          <line x1="538" y1="370" x2="588" y2="370" stroke="#3576C0" stroke-width="2" marker-end="url(#n-ar-blue)"/>
          <line x1="690" y1="370" x2="728" y2="370" stroke="#5E5850" stroke-width="2" marker-end="url(#n-ar-gray)"/>
          <line x1="830" y1="370" x2="852" y2="370" stroke="#73B222" stroke-width="2" marker-end="url(#n-ar-green)"/>

          <!-- подписи -->
          <text x="563" y="358" text-anchor="middle" class="small" style="fill:#3576C0;">вход</text>
          <text x="710" y="358" text-anchor="middle" class="small mono">z</text>
          <text x="855" y="358" text-anchor="middle" class="small" style="fill:#73B222;">выход</text>

          <text x="690" y="465" text-anchor="middle" class="text mono" style="font-weight:800;">a = σ(w·x + b)</text>
        </g>
      `;

      // ============================================
      // ШАГ 3: линейная часть — это просто прямая
      // ============================================
      const scene3 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-yellow"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Шаг 1. Линейная часть</text>
          <text x="60" y="195" class="text">Первая половина нейрона:</text>

          <rect x="60" y="215" width="340" height="58" class="box-yellow"/>
          <text x="230" y="250" text-anchor="middle" class="text mono" style="font-size:18px;">z = w · x + b</text>

          <text x="60" y="300" class="text">Это в точности то,</text>
          <text x="60" y="322" class="text">что делает линрегрессия —</text>
          <text x="60" y="344" class="text">прямая в координатах (x, z).</text>

          <text x="60" y="382" class="small">Подбираем w и b так,</text>
          <text x="60" y="400" class="small">чтобы прямая хоть как-то</text>
          <text x="60" y="418" class="small">разделяла классы.</text>

          <rect x="60" y="442" width="340" height="56" class="box-blue"/>
          <text x="230" y="466" text-anchor="middle" class="small" style="fill:#3576C0;font-weight:700;">пока что нелинейности нет</text>
          <text x="230" y="484" text-anchor="middle" class="small">прямая всё ещё «не идеальна»</text>
        </g>
        <g>
          ${axes('x', 'z')}
          ${linRegLine()}
          ${dataPoints()}
          <text x="${xPx(8.3)}" y="${yPx(0.87)-12}" class="label" style="font-weight:700;fill:#C29E08;">z = w·x + b</text>
        </g>
      `;

      // ============================================
      // ШАГ 4: что такое sigmoid
      // ============================================
      function sigmoidStandalone() {
        // график sigmoid в координатах z → σ(z)
        const X0 = 480, X1 = 900;
        const Y0 = 510, Y1 = 220;
        const xPx = (z) => X0 + (z + 6) / 12 * (X1 - X0);
        const yPx = (a) => Y0 - a * (Y0 - Y1);
        let s = '';
        // сетка/оси
        for (let zi = -6; zi <= 6; zi += 2) {
          const xp = xPx(zi);
          s += `<line x1="${xp}" y1="${Y0}" x2="${xp}" y2="${Y1}" class="grid"/>`;
          s += `<text x="${xp}" y="${Y0+18}" text-anchor="middle" class="small">${zi}</text>`;
        }
        [0, 0.5, 1].forEach(ai => {
          const yp = yPx(ai);
          s += `<line x1="${X0}" y1="${yp}" x2="${X1}" y2="${yp}" class="grid"/>`;
          s += `<text x="${X0-8}" y="${yp+4}" text-anchor="end" class="small">${ai}</text>`;
        });
        s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s += `<text x="${(X0+X1)/2}" y="${Y0+38}" text-anchor="middle" class="label" style="font-weight:700;">вход z</text>`;
        s += `<text x="${X0-30}" y="${Y1-8}" class="label" style="font-weight:700;fill:#C30B0A;">σ(z)</text>`;

        // кривая sigmoid
        let path = '';
        for (let zi = -6; zi <= 6; zi += 0.1) {
          const ai = 1 / (1 + Math.exp(-zi));
          path += (path === '' ? 'M' : 'L') + ' ' + xPx(zi).toFixed(1) + ' ' + yPx(ai).toFixed(1) + ' ';
        }
        s += `<path d="${path}" fill="none" stroke="#C30B0A" stroke-width="3"/>`;

        // характерные точки
        s += `<circle cx="${xPx(0)}" cy="${yPx(0.5)}" r="5" fill="#C30B0A"/>`;
        s += `<text x="${xPx(0)+10}" y="${yPx(0.5)+4}" class="small mono" style="fill:#C30B0A;font-weight:700;">σ(0) = 0.5</text>`;
        s += `<text x="${xPx(-5)}" y="${yPx(0.05)-8}" class="small" style="fill:#5E5850;">→ 0 при z → −∞</text>`;
        s += `<text x="${xPx(4)}" y="${yPx(0.95)+18}" class="small" style="fill:#5E5850;">→ 1 при z → +∞</text>`;
        return s;
      }
      const scene4 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-red"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Шаг 2. Активация: sigmoid</text>
          <text x="60" y="195" class="text">Sigmoid — одна из самых</text>
          <text x="60" y="217" class="text">старых функций активации.</text>

          <rect x="60" y="240" width="340" height="62" class="box-red"/>
          <text x="230" y="280" text-anchor="middle" class="text mono" style="font-size:17px;">σ(z) = 1 / (1 + e⁻ᶻ)</text>

          <text x="60" y="330" class="text">Что она делает:</text>
          <text x="78" y="354" class="small">• любой <tspan class="mono">z</tspan> зажимает в (0, 1)</text>
          <text x="78" y="374" class="small">• большие <tspan class="mono">z</tspan> → почти 1</text>
          <text x="78" y="394" class="small">• маленькие <tspan class="mono">z</tspan> → почти 0</text>
          <text x="78" y="414" class="small">• в нуле плавный переход</text>

          <text x="60" y="450" class="text" style="font-weight:700;fill:#C30B0A;">Это уже нелинейная</text>
          <text x="60" y="472" class="text" style="font-weight:700;fill:#C30B0A;">функция — больше не прямая.</text>

          <text x="60" y="508" class="small">Удобна для вероятности класса 1.</text>
        </g>
        <g>
          ${sigmoidStandalone()}
        </g>
      `;

      // ============================================
      // ШАГ 5: соединяем — нейрон работает
      // ============================================
      const scene5 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Соединяем — получается нейрон</text>
          <text x="60" y="195" class="text">Подставим линейную часть</text>
          <text x="60" y="217" class="text">внутрь sigmoid:</text>

          <rect x="60" y="240" width="340" height="62" class="box-green"/>
          <text x="230" y="280" text-anchor="middle" class="text mono" style="font-size:18px;font-weight:800;fill:#73B222;">a = σ(w · x + b)</text>

          <text x="60" y="334" class="text">Эта функция уже изогнутая,</text>
          <text x="60" y="356" class="text">похожа на ступеньку:</text>
          <text x="78" y="380" class="small">слева почти 0,</text>
          <text x="78" y="398" class="small">справа почти 1,</text>
          <text x="78" y="416" class="small">в центре — плавный переход.</text>

          <text x="60" y="455" class="text" style="font-weight:700;fill:#73B222;">Идеально подходит</text>
          <text x="60" y="477" class="text" style="font-weight:700;fill:#73B222;">под наши классы 0/1.</text>

          <text x="60" y="510" class="small">(Это и есть логистическая</text>
          <text x="60" y="525" class="small">регрессия — частный случай.)</text>
        </g>
        <g>
          ${axes('x', 'a')}
          ${sigmoidCurve(2, -9)}
          ${dataPoints()}
          <text x="${xPx(6.5)}" y="${yPx(0.72)-10}" class="label" style="font-weight:700;fill:#73B222;">a = σ(w·x + b)</text>
          <text x="${xPx(6.5)}" y="${yPx(0.72)+8}" class="small" style="fill:#73B222;">нейрон с sigmoid</text>
        </g>
      `;

      // ============================================
      // ШАГ 6: математически — зачем активация принципиально нужна
      // ============================================
      const scene6 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Зачем активация — формально</text>
          <text x="60" y="195" class="text">Что было бы без неё?</text>

          <text x="60" y="232" class="small">Стек из двух линейных слоёв:</text>
          <rect x="60" y="248" width="340" height="92" class="box-red"/>
          <text x="78" y="272" class="text mono" style="font-size:13px;">a₁ = w₁·x + b₁</text>
          <text x="78" y="292" class="text mono" style="font-size:13px;">a₂ = w₂·a₁ + b₂</text>
          <text x="78" y="320" class="text mono" style="font-size:13px;">a₂ = w₂(w₁x + b₁) + b₂</text>
          <text x="78" y="332" class="text mono" style="font-size:13px;font-weight:800;fill:#C30B0A;">     = (w₂w₁)·x + (...)</text>

          <text x="60" y="370" class="text" style="font-weight:700;fill:#C30B0A;">Опять одна прямая!</text>

          <text x="60" y="410" class="text">Без активации сколько слоёв</text>
          <text x="60" y="432" class="text">ни ставь — всё схлопнется</text>
          <text x="60" y="454" class="text">в линейную регрессию.</text>

          <text x="60" y="495" class="text" style="font-weight:700;fill:#3576C0;">Активация = ключ</text>
          <text x="60" y="517" class="text" style="font-weight:700;fill:#3576C0;">к выразительности.</text>
        </g>

        <g>
          <!-- Слева: линейный + линейный = линейный (плоско) -->
          <rect x="460" y="180" width="450" height="160" class="box-red"/>
          <text x="685" y="208" text-anchor="middle" class="text" style="font-weight:700;fill:#C30B0A;">без активации</text>

          <circle cx="500" cy="270" r="18" fill="#fff" stroke="#C30B0A" stroke-width="2"/>
          <text x="500" y="275" text-anchor="middle" class="small">x</text>
          <rect x="540" y="252" width="90" height="36" class="box-red"/>
          <text x="585" y="275" text-anchor="middle" class="small mono">w₁·x+b₁</text>
          <rect x="660" y="252" width="90" height="36" class="box-red"/>
          <text x="705" y="275" text-anchor="middle" class="small mono">w₂·z+b₂</text>
          <circle cx="790" cy="270" r="18" fill="#fff" stroke="#C30B0A" stroke-width="2"/>
          <text x="790" y="275" text-anchor="middle" class="small">a</text>
          <line x1="518" y1="270" x2="538" y2="270" stroke="#C30B0A" stroke-width="1.5" marker-end="url(#n-ar-red)"/>
          <line x1="630" y1="270" x2="658" y2="270" stroke="#C30B0A" stroke-width="1.5" marker-end="url(#n-ar-red)"/>
          <line x1="750" y1="270" x2="772" y2="270" stroke="#C30B0A" stroke-width="1.5" marker-end="url(#n-ar-red)"/>
          <text x="685" y="318" text-anchor="middle" class="small mono" style="fill:#C30B0A;">= одна прямая</text>

          <!-- Справа: с активацией -->
          <rect x="460" y="370" width="450" height="160" class="box-green"/>
          <text x="685" y="398" text-anchor="middle" class="text" style="font-weight:700;fill:#73B222;">с активацией</text>

          <circle cx="500" cy="460" r="18" fill="#fff" stroke="#73B222" stroke-width="2"/>
          <text x="500" y="465" text-anchor="middle" class="small">x</text>
          <rect x="540" y="442" width="60" height="36" class="box-yellow"/>
          <text x="570" y="465" text-anchor="middle" class="small mono">w₁x+b</text>
          <rect x="610" y="442" width="40" height="36" class="box-red"/>
          <text x="630" y="465" text-anchor="middle" class="small mono">σ(·)</text>
          <rect x="660" y="442" width="60" height="36" class="box-yellow"/>
          <text x="690" y="465" text-anchor="middle" class="small mono">w₂z+b</text>
          <rect x="730" y="442" width="40" height="36" class="box-red"/>
          <text x="750" y="465" text-anchor="middle" class="small mono">σ(·)</text>
          <circle cx="810" cy="460" r="18" fill="#fff" stroke="#73B222" stroke-width="2"/>
          <text x="810" y="465" text-anchor="middle" class="small">a</text>
          <line x1="518" y1="460" x2="538" y2="460" stroke="#73B222" stroke-width="1.5"/>
          <line x1="600" y1="460" x2="608" y2="460" stroke="#73B222" stroke-width="1.5"/>
          <line x1="650" y1="460" x2="658" y2="460" stroke="#73B222" stroke-width="1.5"/>
          <line x1="720" y1="460" x2="728" y2="460" stroke="#73B222" stroke-width="1.5"/>
          <line x1="770" y1="460" x2="792" y2="460" stroke="#73B222" stroke-width="1.5" marker-end="url(#n-ar-green)"/>
          <text x="685" y="508" text-anchor="middle" class="small mono" style="fill:#73B222;">= гибкая нелинейная композиция</text>
        </g>
      `;

      // ============================================
      // ШАГ 7: разные активации
      // ============================================
      function activationsTriptych() {
        const panels = [
          {x0: 460, x1: 615, y0: 480, y1: 220, title: 'ReLU', formula: 'max(0, z)', f: z => Math.max(0, z), color: '#3576C0', yMin: -0.5, yMax: 5},
          {x0: 645, x1: 800, y0: 480, y1: 220, title: 'sigmoid', formula: '1/(1+e⁻ᶻ)', f: z => 1/(1+Math.exp(-z)), color: '#C30B0A', yMin: -0.2, yMax: 1.2},
          {x0: 830, x1: 920, y0: 480, y1: 220, title: 'tanh', formula: '(eᶻ-e⁻ᶻ)/(eᶻ+e⁻ᶻ)', f: z => Math.tanh(z), color: '#73B222', yMin: -1.2, yMax: 1.2}
        ];
        // адаптирую: на самом деле tanh-панель тоже шире
        panels[2] = {...panels[2], x0: 820, x1: 920};

        let s = '';
        panels.forEach(p => {
          const xPxP = z => p.x0 + (z + 5) / 10 * (p.x1 - p.x0);
          const yPxP = a => p.y0 - (a - p.yMin) / (p.yMax - p.yMin) * (p.y0 - p.y1);

          // фон-панель
          s += `<rect x="${p.x0-12}" y="${p.y1-50}" width="${p.x1-p.x0+24}" height="${p.y0-p.y1+95}"
                       fill="#fff" stroke="${p.color}" stroke-width="1.4" rx="10"/>`;
          // заголовок
          s += `<text x="${(p.x0+p.x1)/2}" y="${p.y1-28}" text-anchor="middle" class="text" style="font-weight:700;fill:${p.color};">${p.title}</text>`;
          s += `<text x="${(p.x0+p.x1)/2}" y="${p.y1-10}" text-anchor="middle" class="small mono" style="fill:${p.color};">${p.formula}</text>`;

          // оси
          s += `<line x1="${p.x0}" y1="${p.y0}" x2="${p.x1}" y2="${p.y0}" class="axis"/>`;
          s += `<line x1="${xPxP(0)}" y1="${p.y0}" x2="${xPxP(0)}" y2="${p.y1}" class="axis"/>`;

          // кривая
          let path = '';
          for (let zi = -5; zi <= 5; zi += 0.1) {
            const ai = p.f(zi);
            path += (path === '' ? 'M' : 'L') + ' ' + xPxP(zi).toFixed(1) + ' ' + yPxP(ai).toFixed(1) + ' ';
          }
          s += `<path d="${path}" fill="none" stroke="${p.color}" stroke-width="2.4"/>`;
        });
        return s;
      }

      const scene7 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Разные активации</text>
          <text x="60" y="192" class="text">σ — это не одна функция,</text>
          <text x="60" y="214" class="text">а целое семейство. На практике</text>
          <text x="60" y="236" class="text">используют разные.</text>

          <rect x="60" y="258" width="340" height="56" class="box-blue"/>
          <text x="78" y="280" class="small" style="font-weight:700;fill:#3576C0;">ReLU</text>
          <text x="78" y="300" class="small">самая популярная в DL, простая, быстрая</text>

          <rect x="60" y="324" width="340" height="56" class="box-red"/>
          <text x="78" y="346" class="small" style="font-weight:700;fill:#C30B0A;">sigmoid</text>
          <text x="78" y="366" class="small">для бинарной классификации (выход — вероятность)</text>

          <rect x="60" y="390" width="340" height="56" class="box-green"/>
          <text x="78" y="412" class="small" style="font-weight:700;fill:#73B222;">tanh</text>
          <text x="78" y="432" class="small">похожа на sigmoid, но симметрична (от −1 до +1)</text>

          <text x="60" y="478" class="small">Выбор активации — это</text>
          <text x="60" y="496" class="small">гиперпараметр архитектуры.</text>
        </g>
        <g>
          ${activationsTriptych()}
        </g>
      `;

      // ============================================
      // ШАГ 8: ограничения одного нейрона (XOR)
      // ============================================
      function xorScene() {
        // 4 точки: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0
        const X0 = 540, X1 = 880;
        const Y0 = 510, Y1 = 230;
        const xPx = (x) => X0 + x * (X1 - X0);
        const yPx = (y) => Y0 - y * (Y0 - Y1);

        let s = '';
        // сетка/оси
        [0, 0.5, 1].forEach(v => {
          s += `<line x1="${xPx(v)}" y1="${Y0}" x2="${xPx(v)}" y2="${Y1}" class="grid"/>`;
          s += `<text x="${xPx(v)}" y="${Y0+18}" text-anchor="middle" class="small">${v}</text>`;
          s += `<line x1="${X0}" y1="${yPx(v)}" x2="${X1}" y2="${yPx(v)}" class="grid"/>`;
          s += `<text x="${X0-8}" y="${yPx(v)+4}" text-anchor="end" class="small">${v}</text>`;
        });
        s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s += `<text x="${(X0+X1)/2}" y="${Y0+38}" text-anchor="middle" class="label" style="font-weight:700;">x₁</text>`;
        s += `<text x="${X0-30}" y="${Y1-8}" class="label" style="font-weight:700;">x₂</text>`;

        // 4 точки XOR
        const pts = [
          {x:0, y:0, cls:0}, {x:0, y:1, cls:1},
          {x:1, y:0, cls:1}, {x:1, y:1, cls:0}
        ];
        pts.forEach(p => {
          const c = p.cls === 0 ? '#73B222' : '#3576C0';
          s += `<circle cx="${xPx(p.x)}" cy="${yPx(p.y)}" r="12" fill="${c}" stroke="#fff" stroke-width="2"/>`;
          s += `<text x="${xPx(p.x)}" y="${yPx(p.y)+4}" text-anchor="middle" class="small" style="font-weight:800;fill:#fff;">${p.cls}</text>`;
        });

        // попытка разделить одной прямой — не выйдет; пунктирные кандидаты
        s += `<line x1="${xPx(-0.05)}" y1="${yPx(0.5)}" x2="${xPx(1.05)}" y2="${yPx(0.5)}" stroke="#C30B0A" stroke-width="2" stroke-dasharray="6 4"/>`;
        s += `<line x1="${xPx(0.5)}" y1="${yPx(-0.05)}" x2="${xPx(0.5)}" y2="${yPx(1.05)}" stroke="#C30B0A" stroke-width="2" stroke-dasharray="6 4"/>`;
        s += `<line x1="${xPx(-0.05)}" y1="${yPx(1.05)}" x2="${xPx(1.05)}" y2="${yPx(-0.05)}" stroke="#C30B0A" stroke-width="2" stroke-dasharray="6 4"/>`;

        s += `<text x="${(X0+X1)/2}" y="${Y1-15}" text-anchor="middle" class="small" style="fill:#C30B0A;font-weight:700;">какую прямую ни проведи — пары 0/1 пересекаются</text>`;
        return s;
      }
      const scene8 = `
        <g>
          <rect x="40" y="120" width="380" height="395" class="box-red"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Что один нейрон не может</text>
          <text x="60" y="192" class="text">Один нейрон с sigmoid</text>
          <text x="60" y="214" class="text">отлично рисует <tspan style="font-weight:700;">одну</tspan></text>
          <text x="60" y="236" class="text">плавную границу.</text>

          <text x="60" y="278" class="text">Но что если граница должна</text>
          <text x="60" y="300" class="text">состоять из <tspan style="font-weight:700;">нескольких частей</tspan>?</text>

          <rect x="60" y="322" width="340" height="80" class="box-red"/>
          <text x="78" y="346" class="small" style="font-weight:700;fill:#C30B0A;">Классический пример: XOR</text>
          <text x="78" y="365" class="small">класс 1 ↔ x₁ ≠ x₂</text>
          <text x="78" y="383" class="small">никакая прямая (никакая</text>
          <text x="78" y="401" class="small">одна сигмоида) не разделит.</text>

          <text x="60" y="440" class="text" style="font-weight:700;fill:#C30B0A;">Нужно несколько нейронов.</text>

          <text x="60" y="480" class="small" style="fill:#3576C0;font-weight:700;">Дальше — слой нейронов,</text>
          <text x="60" y="498" class="small" style="fill:#3576C0;font-weight:700;">работающих параллельно.</text>
        </g>
        <g>
          ${xorScene()}
        </g>
      `;

      // ============== маркеры стрелок (общие для всех шагов) ==============
      const arrowDefs = `
        <defs>
          <marker id="n-ar-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#3576C0"/>
          </marker>
          <marker id="n-ar-yellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C29E08"/>
          </marker>
          <marker id="n-ar-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/>
          </marker>
          <marker id="n-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#73B222"/>
          </marker>
          <marker id="n-ar-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#5E5850"/>
          </marker>
        </defs>
      `;

      const steps = [
        { title: "Шаг 1. Проблема линрегрессии",
          subtitle: "Прямая не справляется с задачей классификации",
          scene: arrowDefs + scene1 },
        { title: "Шаг 2. Анатомия нейрона",
          subtitle: "Две операции подряд: линейная часть + активация",
          scene: arrowDefs + scene2 },
        { title: "Шаг 3. Линейная часть",
          subtitle: "z = w·x + b — это та же линрегрессия",
          scene: arrowDefs + scene3 },
        { title: "Шаг 4. Активация: sigmoid",
          subtitle: "Нелинейная функция, зажимающая значения в (0, 1)",
          scene: arrowDefs + scene4 },
        { title: "Шаг 5. Линейная часть + sigmoid = нейрон",
          subtitle: "S-образная кривая идеально ложится на классы",
          scene: arrowDefs + scene5 },
        { title: "Шаг 6. Зачем активация принципиально нужна",
          subtitle: "Без неё стек линейных слоёв = одна линрегрессия",
          scene: arrowDefs + scene6 },
        { title: "Шаг 7. Разные активации",
          subtitle: "ReLU, sigmoid, tanh — выбираются под задачу",
          scene: arrowDefs + scene7 },
        { title: "Шаг 8. Что один нейрон не может",
          subtitle: "Одна граница есть — но не XOR. Нужны несколько нейронов.",
          scene: arrowDefs + scene8 }
      ];

      let currentStep = 0;
      function renderStep() {
        const step = steps[currentStep];
        $("n-title").textContent = step.title;
        $("n-subtitle").textContent = step.subtitle;
        $("n-counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("n-scene").innerHTML = step.scene;
        $("n-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("n-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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
      $("n-nextBtn").addEventListener("click", nextStep);
      $("n-prevBtn").addEventListener("click", prevStep);
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

> **Логистическая регрессия = один нейрон с sigmoid.** Когда в учебниках говорят про «логрегрессию», имеют в виду именно эту модель: `a = σ(w·x + b)`. Это самый простой случай нейросети — на одном нейроне. Всё, что мы будем строить дальше — это многократное усложнение того же кирпича.

> **Важное уточнение.** Sigmoid удобно использовать на выходе бинарного классификатора, потому что он даёт число от 0 до 1. Но в скрытых слоях современных MLP чаще используют ReLU или её варианты: они проще, быстрее и обычно лучше обучаются. Поэтому дальше мы будем разделять две идеи: *нейрон как линейная часть + активация* и *тип активации, который выбирается под задачу*.

---

## Часть 2. Слой нейронов

Один нейрон умеет рисовать одну плавную границу. Но реальные задачи устроены сложнее: несколько границ, изогнутые регионы, ветвящиеся зависимости. Решение очевидное — поставим несколько нейронов параллельно. Каждый смотрит на тот же вход `x`, но имеет свои собственные веса и bias. Получается **слой нейронов**.

Если в слое `k` нейронов, то на выходе получается `k` чисел — вектор `h = [h₁, h₂, …, hₖ]`. Каждое из этих чисел — это выход одного нейрона, выучившего свою собственную «фичу». Один может реагировать на «x в верхней половине», другой — «x около середины», третий — «x возле края». Какие именно фичи будут выучены — решает алгоритм обучения, исходя из данных.

Удобнее всего записать всё в векторно-матричной форме:

```
h = σ(x · W + b)
```

Здесь `W` — матрица весов размером `(d × k)`, где `d` — размерность входа, `k` — число нейронов в слое. Строка `x` формы `[1, d]` умножается на `W` и превращается в строку `[1, k]`. `b` — вектор bias размером `k`. Одно умножение, одно сложение, одна поэлементная активация — и получается слой.

> **Что геометрически делает слой?** Преобразует входное пространство в новое представление, в котором задача (надо надеяться) становится проще. Классический пример — XOR: скрытый слой из двух нейронов вместе с выходным нейроном может превратить XOR в линейно-разделимую задачу в новом представлении. Линрегрессия XOR не решает, а двухслойная сеть — решает.

<figure class="embedded-interactive" id="section-interactive-2">
  <div class="interactive-meta">Интерактив 2</div>
  <p class="interactive-desc">Один нейрон: от признаков до вероятности</p>
<div class="stage" id="stage1" tabindex="0">
  <div class="stage-figure">
<svg id="p1" viewBox="0 0 960 470" role="img" aria-label="Схема одного нейрона: входы, веса, сумматор, активация, выход">
  <style>
    svg { font-family: Helvetica, Arial, sans-serif; }
    svg .var  { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    svg .varg { fill: #ffffff; stroke: #5E5850; stroke-width: 1.4; }
    svg .varo { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    svg .op   { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    svg .lbl  { font-size: 19px; fill: #111111; }
    svg .lblb { font-size: 19px; fill: #3576C0; }
    svg .lblg { font-size: 19px; fill: #73B222; }
    svg .cap  { font-size: 14px; fill: #5E5850; }
    svg .capr { font-size: 15px; fill: #C30B0A; }
    svg .w    { font-size: 17px; fill: #C29E08; }
    svg .edge { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    svg .curve{ stroke: #C30B0A; stroke-width: 2.2; fill: none; }
    svg .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="p1-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="inputs">
    <text x="85" y="58" class="cap" text-anchor="middle">признаки объекта</text>
    <rect x="42" y="76" width="86" height="46" rx="7" class="var"/>
    <text x="85" y="106" class="lblb" text-anchor="middle">x¹</text>
    <rect x="42" y="152" width="86" height="46" rx="7" class="var"/>
    <text x="85" y="182" class="lblb" text-anchor="middle">x²</text>
    <text x="85" y="240" class="lbl" text-anchor="middle">⋮</text>
    <rect x="42" y="268" width="86" height="46" rx="7" class="var"/>
    <text x="85" y="298" class="lblb" text-anchor="middle">x<tspan font-size="14">P</tspan></text>
  </g>

  <g data-key="bias">
    <rect x="42" y="360" width="86" height="44" rx="7" class="varg"/>
    <text x="85" y="389" class="lbl" text-anchor="middle">b</text>
    <text x="85" y="424" class="cap" text-anchor="middle">сдвиг</text>
    <line x1="128" y1="382" x2="390" y2="252" class="edge" marker-end="url(#p1-arw)"/>
  </g>

  <g data-key="edges">
    <line x1="128" y1="99"  x2="390" y2="194" class="edge" marker-end="url(#p1-arw)"/>
    <line x1="128" y1="175" x2="390" y2="209" class="edge" marker-end="url(#p1-arw)"/>
    <line x1="128" y1="291" x2="390" y2="233" class="edge" marker-end="url(#p1-arw)"/>
  </g>

  <g data-key="weights">
    <text x="240" y="105" class="cap" text-anchor="middle">веса</text>
    <rect x="212" y="123" width="56" height="34" rx="6" class="op"/>
    <text x="240" y="147" class="w" text-anchor="middle">ω₁</text>
    <rect x="212" y="173" width="56" height="34" rx="6" class="op"/>
    <text x="240" y="197" class="w" text-anchor="middle">ω₂</text>
    <rect x="212" y="248" width="56" height="34" rx="6" class="op"/>
    <text x="240" y="272" class="w" text-anchor="middle">ω<tspan font-size="13">P</tspan></text>
  </g>

  <g data-key="sum">
    <circle cx="440" cy="215" r="48" class="op"/>
    <text x="440" y="227" class="lbl" text-anchor="middle" font-size="28">Σ</text>
    <text x="440" y="292" class="cap" text-anchor="middle">взвешенная сумма</text>
  </g>

  <g data-key="zvar">
    <line x1="488" y1="215" x2="574" y2="215" class="edge" marker-end="url(#p1-arw)"/>
    <rect x="580" y="192" width="72" height="46" rx="7" class="varg"/>
    <text x="616" y="222" class="lbl" text-anchor="middle">z</text>
  </g>

  <g data-key="problem" data-only="1">
    <text x="616" y="166" class="capr" text-anchor="middle">z ∈ (−∞, +∞)</text>
    <text x="616" y="270" class="capr" text-anchor="middle">а нужна вероятность</text>
  </g>

  <g data-key="act">
    <line x1="652" y1="215" x2="710" y2="215" class="edge" marker-end="url(#p1-arw)"/>
    <circle cx="762" cy="215" r="46" class="op"/>
    <polyline points="736,236 741,235 746,233 751,229 756,222 762,215 768,208 773,201 778,197 783,195 788,194" class="curve"/>
    <text x="762" y="292" class="cap" text-anchor="middle">активация f</text>
  </g>

  <g data-key="out">
    <line x1="808" y1="215" x2="856" y2="215" class="edge" marker-end="url(#p1-arw)"/>
    <rect x="860" y="192" width="78" height="46" rx="7" class="varo"/>
    <text x="899" y="222" class="lblg" text-anchor="middle">ŷ</text>
    <text x="899" y="166" class="cap" text-anchor="middle">предсказание</text>
  </g>

  <text x="42" y="452" class="legend">прямоугольник — величина · круг — операция · индекс объекта n опущен</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="inputs" data-focus="inputs">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>На вход подаётся один объект</h4>
      <p>
        Объект описан набором из <code>P</code> чисел — признаков. Для квартиры это
        площадь, этаж и число комнат; для картинки — яркости пикселей. Нижний индекс
        <code>n</code> нумерует объект в выборке, верхний — номер признака.
      </p>
      <div class="math-display" data-tex="\mathbf{x}_n = \left(x_n^1,\; x_n^2,\; \dots,\; x_n^P\right)"></div>
    </div>

    <div class="step-panel" data-on="inputs edges weights" data-focus="weights">
      <div class="step-kicker">Шаг 2 · параметры</div>
      <h4>Каждому признаку — свой вес</h4>
      <p>
        Вес <code>ωₚ</code> отвечает на вопрос: насколько сильно p-й признак влияет
        на ответ. Большой положительный вес тянет предсказание вверх, отрицательный —
        вниз, близкий к нулю означает, что признак почти не учитывается.
      </p>
      <p>
        Веса — единственное, что модель подбирает при обучении. Сами признаки
        приходят из данных и не меняются.
      </p>
    </div>

    <div class="step-panel" data-on="inputs edges weights bias sum zvar" data-focus="sum">
      <div class="step-kicker">Шаг 3 · операция</div>
      <h4>Сумматор сворачивает всё в одно число</h4>
      <p>
        Нейрон перемножает каждый признак со своим весом, складывает результаты и
        добавляет сдвиг <code>b</code>. Получается одно число — обозначим его
        <code>z</code>.
      </p>
      <div class="math-display" data-tex="z_n = b + \sum_{p=1}^{P} \omega_p\, x_n^p"></div>
      <p>
        Сдвиг нужен, чтобы модель могла выдавать ненулевой ответ даже когда все
        признаки равны нулю: без него прямая была бы обязана проходить через начало
        координат.
      </p>
    </div>

    <div class="step-panel" data-on="inputs edges weights bias sum zvar" data-focus="zvar">
      <div class="step-kicker">Шаг 4 · та же операция, другая запись</div>
      <h4>Сумму удобнее записать как произведение</h4>
      <p>
        Та же самая сумма — это скалярное произведение строки признаков на столбец
        весов. Ничего нового не произошло, но такая запись переносится на слой и на
        всю сеть без изменений.
      </p>
      <div class="math-display" data-tex="z_n = \mathbf{x}_n\,\boldsymbol{\omega} + b, \qquad [1, P] \times [P, 1] \rightarrow [1,1]"></div>
      <p>
        Проверка размерностей — самый быстрый способ поймать ошибку в реализации:
        если формы не сходятся, формула записана неверно.
      </p>
    </div>

    <div class="step-panel" data-on="sum zvar problem" data-focus="problem">
      <div class="step-kicker">Шаг 5 · ограничение</div>
      <h4>Проблема: выход ничем не ограничен</h4>
      <p>
        Величина <code>z</code> пробегает всю числовую прямую. Для задачи регрессии
        это нормально — цена дома и правда может быть любой. Но для вопроса «спам
        или не спам» ответ должен быть вероятностью, то есть числом от нуля до
        единицы.
      </p>
      <p>
        Значит, между суммой и выходом нужна ещё одна операция, которая сожмёт любое
        число в нужный диапазон.
      </p>
    </div>

    <div class="step-panel" data-on="sum zvar act" data-focus="act">
      <div class="step-kicker">Шаг 6 · нелинейность</div>
      <h4>Активация: сигмоида сжимает всё в интервал (0, 1)</h4>
      <div class="math-display" data-tex="\sigma(z) = \frac{1}{1 + e^{-z}}"></div>
      <p>
        Большие положительные <code>z</code> она переводит почти в единицу, большие
        отрицательные — почти в ноль, а ноль ровно в <code>0.5</code>. Функция
        монотонна, поэтому порядок сохраняется: больший <code>z</code> всегда даёт
        большую вероятность.
      </p>
    </div>

    <div class="step-panel" data-on="inputs edges weights bias sum zvar act out" data-focus="out">
      <div class="step-kicker">Шаг 7 · итог части</div>
      <h4>Нейрон = линейная функция плюс активация</h4>
      <div class="math-display" data-tex="\hat{y}_n = f\left(\mathbf{x}_n\,\boldsymbol{\omega} + b\right)"></div>
      <p>
        Если <code>f</code> ничего не делает, получается обычная линейная регрессия.
        Если <code>f</code> — сигмоида, получается логистическая регрессия. Два
        знакомых алгоритма оказались одним и тем же нейроном с разной активацией.
      </p>
    </div>
  </div>
</div>
</figure>

> **Главная идея слоя:** один FC-слой берёт вход в пространстве размерности `d` и переводит его в новое пространство размерности `k`, попутно применяя нелинейную активацию. В новом пространстве задача может стать «удобнее» — например, классы могут стать линейно разделимыми. Это и называется *learning representations* — выучивание представлений.

---

## Часть 3. Полносвязная нейросеть

Один слой делает одно нелинейное преобразование. А что если поставить несколько слоёв подряд? Выход первого слоя становится входом второго, выход второго — входом третьего, и так далее. Получается **полносвязная нейросеть** (multi-layer perceptron, MLP).

```
h₁ = σ(x  · W₁ + b₁)     ← скрытый слой 1
h₂ = σ(h₁ · W₂ + b₂)     ← скрытый слой 2
ŷ  =    h₂ · W₃ + b₃     ← выходной слой
```

> **Выходной слой зависит от задачи.** Для регрессии выход часто оставляют линейным и используют MSE. Для бинарной классификации обычно ставят sigmoid и BCE. Для многоклассовой классификации используют softmax и cross-entropy. Скрытые слои при этом могут оставаться ReLU.

Каждый следующий слой работает не с сырыми признаками, а с тем, что предыдущий уже выучил. Возникает **иерархия абстракций**: первый слой замечает простые паттерны, второй комбинирует их в более сложные, третий — в ещё более сложные.

Например, для классификации картинок: первые уровни могут выделять простые признаки, следующие — комбинировать их в более сложные. Для картинок такая интуиция особенно хорошо видна в свёрточных сетях; для MLP это скорее полезная ментальная модель, а не буквальное описание каждого нейрона.

> **Universal Approximation Theorem.** В классической формулировке: полносвязная сеть с одним достаточно широким скрытым слоем и подходящей нелинейной активацией может приблизить любую непрерывную функцию на компактной области с любой заданной точностью. Но это теорема о существовании, а не рецепт обучения. На практике глубокие сети часто оказываются более параметрически эффективными и лучше подходят для иерархических данных, хотя хорошее обобщение всё равно зависит от данных, регуляризации и обучения.

Обучается такая сеть так же, как мы видели в прошлой статье: forward pass → loss → backward pass (backpropagation) → update. Backprop эффективно вычисляет градиенты для *всех* весов сети за один обратный проход — даже если их миллионы.

### Сначала: один полносвязный слой

Ниже мы ещё раз соберём один слой целиком: общий вход, матрица весов, несколько нейронов, активация и выход. После этого поставим два таких скрытых слоя подряд и проследим весь forward от `x` до `ŷ`.

<figure class="embedded-interactive" id="section-interactive-3">
  <div class="interactive-meta">Интерактив 3</div>
  <p class="interactive-desc">Полносвязный слой: матрица весов, softmax и функция потерь</p>
<div class="stage" id="stage2" tabindex="0">
  <div class="stage-figure">
<svg id="p2" viewBox="0 0 960 490" role="img" aria-label="Схема линейного слоя: входы, матрица весов, нейроны, softmax и функция потерь">
  <style>
    svg { font-family: Helvetica, Arial, sans-serif; }
    svg .var  { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    svg .varg { fill: #ffffff; stroke: #5E5850; stroke-width: 1.4; }
    svg .varo { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    svg .varr { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    svg .op   { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    svg .opr  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    svg .lbl  { font-size: 18px; fill: #111111; }
    svg .lblb { font-size: 18px; fill: #3576C0; }
    svg .lblg { font-size: 17px; fill: #73B222; }
    svg .lblr { font-size: 18px; fill: #C30B0A; }
    svg .lbly { font-size: 18px; fill: #C29E08; }
    svg .cap  { font-size: 13.5px; fill: #5E5850; }
    svg .edge { stroke: #5E5850; stroke-width: 1.1; fill: none; }
    svg .edger{ stroke: #C30B0A; stroke-width: 1.1; fill: none; }
    svg .curve{ stroke: #C30B0A; stroke-width: 2; fill: none; }
    svg .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="p2-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="inputs">
    <text x="64" y="58" class="cap" text-anchor="middle">вход [1, P]</text>
    <rect x="26" y="74" width="76" height="42" rx="7" class="var"/>
    <text x="64" y="102" class="lblb" text-anchor="middle">x¹</text>
    <rect x="26" y="144" width="76" height="42" rx="7" class="var"/>
    <text x="64" y="172" class="lblb" text-anchor="middle">x²</text>
    <text x="64" y="222" class="lbl" text-anchor="middle">⋮</text>
    <rect x="26" y="250" width="76" height="42" rx="7" class="var"/>
    <text x="64" y="278" class="lblb" text-anchor="middle">x<tspan font-size="13">P</tspan></text>
  </g>

  <g data-key="one" data-only="1">
    <line x1="102" y1="351" x2="386" y2="118" class="edger"/>
    <line x1="102" y1="351" x2="386" y2="205" class="edger"/>
    <line x1="102" y1="351" x2="386" y2="328" class="edger"/>
    <rect x="26" y="330" width="76" height="42" rx="7" class="varr"/>
    <text x="64" y="358" class="lblr" text-anchor="middle">1</text>
    <text x="64" y="392" class="cap" text-anchor="middle">фиктивный вход</text>
  </g>

  <g data-key="fan">
    <line x1="102" y1="95"  x2="386" y2="106" class="edge"/>
    <line x1="102" y1="95"  x2="386" y2="192" class="edge"/>
    <line x1="102" y1="95"  x2="386" y2="316" class="edge"/>
    <line x1="102" y1="165" x2="386" y2="110" class="edge"/>
    <line x1="102" y1="165" x2="386" y2="196" class="edge"/>
    <line x1="102" y1="165" x2="386" y2="320" class="edge"/>
    <line x1="102" y1="271" x2="386" y2="118" class="edge"/>
    <line x1="102" y1="271" x2="386" y2="204" class="edge"/>
    <line x1="102" y1="271" x2="386" y2="326" class="edge"/>
  </g>

  <g data-key="wbox" data-only="1">
    <rect x="212" y="178" width="72" height="48" rx="8" class="op"/>
    <text x="248" y="209" class="lbly" text-anchor="middle">W</text>
    <text x="248" y="246" class="cap" text-anchor="middle">[P, O]</text>
  </g>

  <g data-key="wbias" data-only="1">
    <rect x="206" y="168" width="84" height="66" rx="8" class="op"/>
    <text x="248" y="194" class="lblr" text-anchor="middle" font-size="16">b</text>
    <line x1="218" y1="203" x2="278" y2="203" stroke="#C29E08" stroke-width="1"/>
    <text x="248" y="225" class="lbly" text-anchor="middle" font-size="16">W</text>
    <text x="248" y="254" class="cap" text-anchor="middle">[P+1, O]</text>
  </g>

  <g data-key="neurons">
    <text x="424" y="58" class="cap" text-anchor="middle">O нейронов</text>
    <circle cx="424" cy="110" r="38" class="op"/>
    <text x="409" y="119" class="lbl" text-anchor="middle" font-size="22">Σ</text>
    <circle cx="424" cy="197" r="38" class="op"/>
    <text x="409" y="206" class="lbl" text-anchor="middle" font-size="22">Σ</text>
    <text x="424" y="266" class="lbl" text-anchor="middle">⋮</text>
    <circle cx="424" cy="321" r="38" class="op"/>
    <text x="409" y="330" class="lbl" text-anchor="middle" font-size="22">Σ</text>
  </g>

  <g data-key="acts">
    <line x1="430" y1="76" x2="430" y2="144" class="edge"/>
    <polyline points="438,126 442,125 446,122 450,116 454,109 458,102 462,98 466,97" class="curve"/>
    <line x1="430" y1="163" x2="430" y2="231" class="edge"/>
    <polyline points="438,213 442,212 446,209 450,203 454,196 458,189 462,185 466,184" class="curve"/>
    <line x1="430" y1="287" x2="430" y2="355" class="edge"/>
    <polyline points="438,337 442,336 446,333 450,327 454,320 458,313 462,309 466,308" class="curve"/>
  </g>

  <g data-key="outs">
    <text x="548" y="58" class="cap" text-anchor="middle">выход слоя [1, O]</text>
    <line x1="462" y1="110" x2="506" y2="110" class="edge" marker-end="url(#p2-arw)"/>
    <line x1="462" y1="197" x2="506" y2="197" class="edge" marker-end="url(#p2-arw)"/>
    <line x1="462" y1="321" x2="506" y2="321" class="edge" marker-end="url(#p2-arw)"/>
    <rect x="512" y="89" width="72" height="42" rx="7" class="varg"/>
    <text x="548" y="117" class="lbl" text-anchor="middle">z¹</text>
    <rect x="512" y="176" width="72" height="42" rx="7" class="varg"/>
    <text x="548" y="204" class="lbl" text-anchor="middle">z²</text>
    <text x="548" y="266" class="lbl" text-anchor="middle">⋮</text>
    <rect x="512" y="300" width="72" height="42" rx="7" class="varg"/>
    <text x="548" y="328" class="lbl" text-anchor="middle">z<tspan font-size="13">O</tspan></text>
  </g>

  <g data-key="zvals" data-only="1">
    <text x="548" y="150" class="cap" text-anchor="middle">2.0</text>
    <text x="548" y="237" class="cap" text-anchor="middle">1.0</text>
    <text x="548" y="361" class="cap" text-anchor="middle">0.1</text>
  </g>

  <g data-key="softmax" data-only="1">
    <line x1="584" y1="110" x2="628" y2="180" class="edge"/>
    <line x1="584" y1="197" x2="628" y2="202" class="edge"/>
    <line x1="584" y1="321" x2="628" y2="224" class="edge"/>
    <rect x="632" y="80" width="60" height="250" rx="10" class="op"/>
    <text x="662" y="205" class="lbly" text-anchor="middle" transform="rotate(-90 662 205)">softmax</text>
  </g>

  <g data-key="probs" data-only="1">
    <text x="776" y="58" class="cap" text-anchor="middle">вероятности ŷ</text>
    <line x1="692" y1="180" x2="732" y2="112" class="edge" marker-end="url(#p2-arw)"/>
    <line x1="692" y1="202" x2="732" y2="199" class="edge" marker-end="url(#p2-arw)"/>
    <line x1="692" y1="224" x2="732" y2="318" class="edge" marker-end="url(#p2-arw)"/>
    <rect x="738" y="89" width="76" height="42" rx="7" class="varo"/>
    <text x="776" y="117" class="lblg" text-anchor="middle">0.66</text>
    <rect x="738" y="176" width="76" height="42" rx="7" class="varo"/>
    <text x="776" y="204" class="lblg" text-anchor="middle">0.24</text>
    <text x="776" y="266" class="lbl" text-anchor="middle">⋮</text>
    <rect x="738" y="300" width="76" height="42" rx="7" class="varo"/>
    <text x="776" y="328" class="lblg" text-anchor="middle">0.10</text>
  </g>

  <g data-key="target" data-only="1">
    <rect x="846" y="80" width="76" height="42" rx="7" class="var"/>
    <text x="884" y="108" class="lblb" text-anchor="middle">y</text>
    <text x="884" y="70" class="cap" text-anchor="middle">верный ответ</text>
    <line x1="884" y1="122" x2="884" y2="174" class="edge" marker-end="url(#p2-arw)"/>
  </g>

  <g data-key="loss" data-only="1">
    <line x1="814" y1="110" x2="856" y2="196" class="edge"/>
    <line x1="814" y1="197" x2="850" y2="207" class="edge"/>
    <line x1="814" y1="321" x2="856" y2="228" class="edge"/>
    <circle cx="884" cy="212" r="32" class="opr"/>
    <text x="884" y="220" class="lblr" text-anchor="middle" font-size="20">ℒ</text>
    <text x="884" y="272" class="cap" text-anchor="middle">ошибка [1]</text>
  </g>

  <text x="26" y="470" class="legend">прямоугольник — величина · круг — операция · индекс объекта n опущен</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="inputs fan neurons outs" data-focus="neurons">
      <div class="step-kicker">Шаг 1 · много нейронов</div>
      <h4>Ставим рядом O нейронов с общим входом</h4>
      <p>
        Все нейроны видят один и тот же вектор признаков, но у каждого свой набор
        весов, поэтому и выходы у них разные. Получается <code>O</code> чисел вместо
        одного — например, по одному на каждый класс.
      </p>
      <p>
        Внутри каждого нейрона по-прежнему та же формула из первой части. Ничего
        нового не появилось, изменилось только их количество.
      </p>
    </div>

    <div class="step-panel" data-on="inputs fan wbox neurons" data-focus="wbox">
      <div class="step-kicker">Шаг 2 · параметры</div>
      <h4>Все веса собираются в одну матрицу</h4>
      <p>
        Вместо <code>O</code> отдельных векторов весов держим одну матрицу
        <code>W</code>. В ней <code>P</code> строк — по числу признаков, и
        <code>O</code> столбцов — по числу нейронов.
      </p>
      <div class="math-display" data-tex="W \in \mathbb{R}^{P \times O}, \qquad \omega_{pj} \;-\; \text{вес } p\text{-го признака в } j\text{-м нейроне}"></div>
      <p>
        Читать её удобнее по столбцам: <strong>j-й столбец — это весь набор весов
        j-го нейрона</strong>.
      </p>
    </div>

    <div class="step-panel" data-on="inputs fan wbox neurons outs" data-focus="outs">
      <div class="step-kicker">Шаг 3 · операция</div>
      <h4>Весь слой — одно матричное умножение</h4>
      <div class="math-display" data-tex="\mathbf{z}_n = \mathbf{x}_n W + \mathbf{b}, \qquad [1,P] \times [P,O] + [1,O] \rightarrow [1,O]"></div>
      <p>
        Строка признаков умножается на матрицу и превращается в строку из
        <code>O</code> выходов. J-й выход — это скалярное произведение входа на j-й
        столбец <code>W</code> плюс сдвиг, то есть ровно формула одного нейрона.
      </p>
    </div>

    <div class="step-panel" data-on="inputs one fan wbias neurons outs" data-focus="one">
      <div class="step-kicker">Шаг 4 · приём записи</div>
      <h4>Сдвиг можно спрятать внутрь матрицы</h4>
      <p>
        Добавим к входу фиктивный признак, всегда равный единице. Тогда сдвиг
        становится обычным весом при этом признаке, и отдельное слагаемое
        <code>b</code> из формулы исчезает.
      </p>
      <div class="math-display" data-tex="\mathbf{z}_n = \left(1,\; x_n^1,\; \dots,\; x_n^P\right)\widetilde{W}"></div>
      <p>
        Это чисто техническое удобство: формула становится короче, а на схемах сдвиг
        после этого обычно перестают рисовать — он живёт внутри матрицы.
      </p>
    </div>

    <div class="step-panel" data-on="inputs fan wbox neurons acts outs" data-focus="acts">
      <div class="step-kicker">Шаг 5 · нелинейность</div>
      <h4>Активация применяется к каждому выходу отдельно</h4>
      <div class="math-display" data-tex="\mathbf{h}_n = f\left(\mathbf{x}_n W + \mathbf{b}\right)"></div>
      <p>
        Функция <code>f</code> действует поэлементно: каждый из <code>O</code>
        выходов проходит через неё независимо, размерность при этом не меняется.
      </p>
      <div class="callout-blue">
        <strong>Зачем это нужно:</strong> без нелинейности два линейных слоя подряд
        свернулись бы в один — произведение двух матриц это снова матрица. Именно
        активация делает глубину осмысленной.
      </div>
    </div>

    <div class="step-panel" data-on="outs zvals softmax probs" data-focus="softmax">
      <div class="step-kicker">Шаг 6 · вероятности</div>
      <h4>Softmax превращает O чисел в распределение</h4>
      <div class="math-display" data-tex="S(\mathbf{z})_i = \frac{e^{z_i}}{\sum_{j=1}^{O} e^{z_j}}"></div>
      <p>
        Экспонента делает все числа положительными, а деление на сумму приводит их к
        единице. Для выходов <code>2.0</code>, <code>1.0</code>, <code>0.1</code>
        получаем <code>0.66</code>, <code>0.24</code>, <code>0.10</code> — теперь это
        честные вероятности классов.
      </p>
    </div>

    <div class="step-panel" data-on="probs target loss" data-focus="loss">
      <div class="step-kicker">Шаг 7 · ошибка</div>
      <h4>Кросс-энтропия измеряет, насколько модель промахнулась</h4>
      <div class="math-display" data-tex="\mathcal{L}_n = -\sum_{i=1}^{O} y_n^i \log \hat{y}_n^i"></div>
      <p>
        Верный ответ записан как вектор из нулей и одной единицы. Нули обнуляют
        лишние слагаемые, поэтому ошибка смотрит только на вероятность правильного
        класса. Если верный класс первый, то <code>ℒ = −log 0.66 ≈ 0.42</code>.
      </p>
      <p>
        Была бы вероятность правильного класса равна единице — ошибка оказалась бы
        нулевой. Чем увереннее модель права, тем меньше ℒ.
      </p>
    </div>

    <div class="step-panel" data-on="inputs fan wbox neurons acts outs zvals softmax probs target loss">
      <div class="step-kicker">Шаг 8 · итог части</div>
      <h4>Весь путь от признаков до одного числа</h4>
      <p>
        Вход <code>[1, P]</code> → линейный слой → <code>[1, O]</code> → softmax →
        <code>[1, O]</code> → ошибка → <code>[1]</code>. На каждом шаге размерность
        известна заранее, и по ней легко проверить реализацию.
      </p>
      <p>
        Обучаются во всей этой цепочке только два объекта: матрица <code>W</code> и
        вектор сдвигов <code>b</code>. Softmax и функция потерь параметров не имеют —
        они лишь превращают выход в число, которое нужно уменьшить.
      </p>
    </div>
  </div>
</div>
</figure>

### Теперь: несколько скрытых слоёв подряд

Один слой создаёт новое представление `h¹`. Второй слой уже не видит исходный `x`: он получает `h¹` и строит следующее представление `h²`. Нажимайте «Далее» и следите, как один и тот же блок `линейное преобразование → ReLU` повторяется на каждом скрытом уровне.

<figure class="embedded-interactive" id="section-interactive-4">
  <div class="interactive-meta">Интерактив 4</div>
  <p class="interactive-desc">Несколько скрытых слоёв подряд</p>
<div class="stage" id="stageDeep" tabindex="0">
  <div class="stage-figure">
<svg id="p3" viewBox="0 0 960 550" role="img" aria-label="Пошаговый forward через два скрытых полносвязных слоя и выходной слой">
  <style>
    svg { font-family: Helvetica, Arial, sans-serif; }
    svg .panel { fill: #ffffff; stroke: #C9C2B8; stroke-width: 1.4; }
    svg .input { fill: #ffffff; stroke: #3576C0; stroke-width: 1.7; }
    svg .linear { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.5; }
    svg .activation { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.5; }
    svg .output { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    svg .parameter { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.4; }
    svg .formula-box { fill: #F7F6F1; stroke: #D7D2C8; stroke-width: 1.2; }
    svg .edge { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    svg .title { font-size: 17px; font-weight: 700; fill: #111111; }
    svg .label { font-size: 16px; fill: #111111; }
    svg .blue { font-size: 17px; font-weight: 700; fill: #3576C0; }
    svg .green { font-size: 16px; font-weight: 700; fill: #73B222; }
    svg .yellow { font-size: 15px; font-weight: 700; fill: #C29E08; }
    svg .small { font-size: 13px; fill: #5E5850; }
    svg .legend { font-size: 13px; fill: #5E5850; }
    svg [data-key].is-focus .edge { stroke: #73B222; stroke-width: 3; }
    svg [data-key].is-focus .linear,
    svg [data-key].is-focus .parameter { fill: #F0FAF0; stroke: #73B222; stroke-width: 2.6; }
    svg [data-key].is-focus .activation,
    svg [data-key].is-focus .output,
    svg [data-key].is-focus .input { stroke: #73B222; stroke-width: 2.7; }
  </style>
  <defs>
    <marker id="p3-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="deep-input">
    <text x="82" y="60" class="title" text-anchor="middle">вход</text>
    <text x="82" y="82" class="small" text-anchor="middle">[1, 3]</text>
    <rect x="42" y="124" width="80" height="46" rx="8" class="input"/>
    <text x="82" y="154" class="blue" text-anchor="middle">x¹</text>
    <rect x="42" y="205" width="80" height="46" rx="8" class="input"/>
    <text x="82" y="235" class="blue" text-anchor="middle">x²</text>
    <rect x="42" y="286" width="80" height="46" rx="8" class="input"/>
    <text x="82" y="316" class="blue" text-anchor="middle">x³</text>
    <text x="82" y="365" class="small" text-anchor="middle">сырой объект x</text>
  </g>

  <g data-key="deep-edge1">
    <line x1="122" y1="228" x2="184" y2="228" class="edge" marker-end="url(#p3-arw)"/>
  </g>
  <g data-key="deep-w1">
    <rect x="137" y="174" width="48" height="34" rx="7" class="parameter"/>
    <text x="161" y="197" class="yellow" text-anchor="middle">W¹</text>
    <text x="161" y="160" class="small" text-anchor="middle">[3, 4]</text>
  </g>

  <g data-key="deep-h1-base">
    <rect x="198" y="48" width="220" height="340" rx="13" class="panel"/>
    <text x="308" y="78" class="title" text-anchor="middle">скрытый слой 1</text>
    <text x="308" y="99" class="small" text-anchor="middle">4 нейрона</text>
  </g>
  <g data-key="deep-h1-linear">
    <rect x="218" y="120" width="180" height="68" rx="9" class="linear"/>
    <text x="308" y="145" class="yellow" text-anchor="middle">линейная часть</text>
    <text x="308" y="171" class="label" text-anchor="middle">z¹ = xW¹ + b¹</text>
  </g>
  <g data-key="deep-h1-act">
    <rect x="218" y="208" width="180" height="58" rx="9" class="activation"/>
    <text x="308" y="233" class="green" text-anchor="middle">ReLU</text>
    <text x="308" y="254" class="small" text-anchor="middle">h¹ = ReLU(z¹)</text>
    <circle cx="244" cy="315" r="21" class="output"/>
    <text x="244" y="320" class="green" text-anchor="middle">h¹₁</text>
    <circle cx="287" cy="315" r="21" class="output"/>
    <text x="287" y="320" class="green" text-anchor="middle">h¹₂</text>
    <circle cx="330" cy="315" r="21" class="output"/>
    <text x="330" y="320" class="green" text-anchor="middle">h¹₃</text>
    <circle cx="373" cy="315" r="21" class="output"/>
    <text x="373" y="320" class="green" text-anchor="middle">h¹₄</text>
    <text x="308" y="359" class="small" text-anchor="middle">новое представление [1, 4]</text>
  </g>

  <g data-key="deep-edge2">
    <line x1="418" y1="228" x2="480" y2="228" class="edge" marker-end="url(#p3-arw)"/>
  </g>
  <g data-key="deep-w2">
    <rect x="433" y="174" width="48" height="34" rx="7" class="parameter"/>
    <text x="457" y="197" class="yellow" text-anchor="middle">W²</text>
    <text x="457" y="160" class="small" text-anchor="middle">[4, 3]</text>
  </g>

  <g data-key="deep-h2-base">
    <rect x="494" y="48" width="220" height="340" rx="13" class="panel"/>
    <text x="604" y="78" class="title" text-anchor="middle">скрытый слой 2</text>
    <text x="604" y="99" class="small" text-anchor="middle">3 нейрона</text>
  </g>
  <g data-key="deep-h2-linear">
    <rect x="514" y="120" width="180" height="68" rx="9" class="linear"/>
    <text x="604" y="145" class="yellow" text-anchor="middle">линейная часть</text>
    <text x="604" y="171" class="label" text-anchor="middle">z² = h¹W² + b²</text>
  </g>
  <g data-key="deep-h2-act">
    <rect x="514" y="208" width="180" height="58" rx="9" class="activation"/>
    <text x="604" y="233" class="green" text-anchor="middle">ReLU</text>
    <text x="604" y="254" class="small" text-anchor="middle">h² = ReLU(z²)</text>
    <circle cx="550" cy="315" r="23" class="output"/>
    <text x="550" y="320" class="green" text-anchor="middle">h²₁</text>
    <circle cx="604" cy="315" r="23" class="output"/>
    <text x="604" y="320" class="green" text-anchor="middle">h²₂</text>
    <circle cx="658" cy="315" r="23" class="output"/>
    <text x="658" y="320" class="green" text-anchor="middle">h²₃</text>
    <text x="604" y="359" class="small" text-anchor="middle">следующее представление [1, 3]</text>
  </g>

  <g data-key="deep-edge3">
    <line x1="714" y1="228" x2="768" y2="228" class="edge" marker-end="url(#p3-arw)"/>
  </g>
  <g data-key="deep-w3">
    <rect x="723" y="174" width="48" height="34" rx="7" class="parameter"/>
    <text x="747" y="197" class="yellow" text-anchor="middle">W³</text>
    <text x="747" y="160" class="small" text-anchor="middle">[3, 1]</text>
  </g>

  <g data-key="deep-output">
    <rect x="782" y="100" width="142" height="288" rx="13" class="panel"/>
    <text x="853" y="132" class="title" text-anchor="middle">выходной слой</text>
    <text x="853" y="153" class="small" text-anchor="middle">1 нейрон</text>
    <rect x="801" y="184" width="104" height="58" rx="9" class="linear"/>
    <text x="853" y="208" class="yellow" text-anchor="middle">линейная часть</text>
    <text x="853" y="229" class="small" text-anchor="middle">h²W³ + b³</text>
    <circle cx="853" cy="298" r="34" class="output"/>
    <text x="853" y="305" class="green" text-anchor="middle" style="font-size:21px;">ŷ</text>
    <text x="853" y="356" class="small" text-anchor="middle">предсказание [1, 1]</text>
  </g>

  <g data-key="deep-formula-input" data-only="1">
    <rect x="42" y="420" width="882" height="82" rx="10" class="formula-box"/>
    <text x="64" y="446" class="small">Вход сети</text>
    <foreignObject x="64" y="453" width="830" height="42">
      <div xmlns="http://www.w3.org/1999/xhtml" data-tex="\mathbf{x}\in\mathbb{R}^{1\times3}" style="font-size:18px;color:#111111;"></div>
    </foreignObject>
  </g>
  <g data-key="deep-formula-z1" data-only="1">
    <rect x="42" y="420" width="882" height="82" rx="10" class="formula-box"/>
    <text x="64" y="446" class="small">Линейная часть первого скрытого слоя</text>
    <foreignObject x="64" y="453" width="830" height="42">
      <div xmlns="http://www.w3.org/1999/xhtml" data-tex="\mathbf{z}^{(1)}=\mathbf{x}W^{(1)}+\mathbf{b}^{(1)},\quad [1,3][3,4]+[1,4]\to[1,4]" style="font-size:18px;color:#111111;"></div>
    </foreignObject>
  </g>
  <g data-key="deep-formula-h1" data-only="1">
    <rect x="42" y="420" width="882" height="82" rx="10" class="formula-box"/>
    <text x="64" y="446" class="small">Нелинейность первого скрытого слоя</text>
    <foreignObject x="64" y="453" width="830" height="42">
      <div xmlns="http://www.w3.org/1999/xhtml" data-tex="\mathbf{h}^{(1)}=\operatorname{ReLU}\!\left(\mathbf{z}^{(1)}\right)\in\mathbb{R}^{1\times4}" style="font-size:18px;color:#111111;"></div>
    </foreignObject>
  </g>
  <g data-key="deep-formula-z2" data-only="1">
    <rect x="42" y="420" width="882" height="82" rx="10" class="formula-box"/>
    <text x="64" y="446" class="small">Линейная часть второго скрытого слоя</text>
    <foreignObject x="64" y="453" width="830" height="42">
      <div xmlns="http://www.w3.org/1999/xhtml" data-tex="\mathbf{z}^{(2)}=\mathbf{h}^{(1)}W^{(2)}+\mathbf{b}^{(2)},\quad [1,4][4,3]+[1,3]\to[1,3]" style="font-size:18px;color:#111111;"></div>
    </foreignObject>
  </g>
  <g data-key="deep-formula-h2" data-only="1">
    <rect x="42" y="420" width="882" height="82" rx="10" class="formula-box"/>
    <text x="64" y="446" class="small">Нелинейность второго скрытого слоя</text>
    <foreignObject x="64" y="453" width="830" height="42">
      <div xmlns="http://www.w3.org/1999/xhtml" data-tex="\mathbf{h}^{(2)}=\operatorname{ReLU}\!\left(\mathbf{z}^{(2)}\right)\in\mathbb{R}^{1\times3}" style="font-size:18px;color:#111111;"></div>
    </foreignObject>
  </g>
  <g data-key="deep-formula-out" data-only="1">
    <rect x="42" y="420" width="882" height="82" rx="10" class="formula-box"/>
    <text x="64" y="446" class="small">Выходной слой для регрессии</text>
    <foreignObject x="64" y="453" width="830" height="42">
      <div xmlns="http://www.w3.org/1999/xhtml" data-tex="\hat{y}=\mathbf{h}^{(2)}W^{(3)}+b^{(3)},\quad [1,3][3,1]+[1,1]\to[1,1]" style="font-size:18px;color:#111111;"></div>
    </foreignObject>
  </g>
  <g data-key="deep-formula-all" data-only="1">
    <rect x="42" y="420" width="882" height="82" rx="10" class="formula-box"/>
    <text x="64" y="446" class="small">Вся сеть — композиция трёх функций</text>
    <foreignObject x="64" y="453" width="830" height="42">
      <div xmlns="http://www.w3.org/1999/xhtml" data-tex="\hat{y}=f_3\!\left(f_2\!\left(f_1(\mathbf{x})\right)\right)" style="font-size:20px;color:#111111;"></div>
    </foreignObject>
  </g>

  <text x="42" y="532" class="legend">синий — вход · жёлтый — линейное преобразование · зелёный — активация и forward-значения</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="deep-input deep-formula-input" data-focus="deep-input">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>Сеть получает один исходный вектор</h4>
      <p>
        Пусть объект описан тремя признаками, поэтому <code>x</code> имеет форму
        <code>[1, 3]</code>. Пока это только сырые данные: сеть ещё не создала ни
        одного скрытого представления.
      </p>
    </div>

    <div class="step-panel" data-on="deep-input deep-edge1 deep-w1 deep-h1-base deep-h1-linear deep-formula-z1" data-focus="deep-edge1 deep-w1 deep-h1-linear">
      <div class="step-kicker">Шаг 2 · скрытый слой 1</div>
      <h4>Первый слой считает четыре взвешенные суммы</h4>
      <div class="math-display" data-tex="\mathbf{z}^{(1)}=\mathbf{x}W^{(1)}+\mathbf{b}^{(1)}"></div>
      <p>
        Матрица <code>W¹</code> имеет форму <code>[3, 4]</code>: каждый из трёх
        входных признаков соединён с каждым из четырёх нейронов. Поэтому слой
        превращает три числа в четыре значения <code>z¹</code>.
      </p>
    </div>

    <div class="step-panel" data-on="deep-input deep-edge1 deep-w1 deep-h1-base deep-h1-linear deep-h1-act deep-formula-h1" data-focus="deep-h1-act">
      <div class="step-kicker">Шаг 3 · активация 1</div>
      <h4>ReLU превращает z¹ в первое скрытое представление h¹</h4>
      <div class="math-display" data-tex="\mathbf{h}^{(1)}=\operatorname{ReLU}\!\left(\mathbf{z}^{(1)}\right)"></div>
      <p>
        ReLU применяется поэлементно и сохраняет форму <code>[1, 4]</code>. Именно
        нелинейность не даёт первому и второму линейным преобразованиям схлопнуться
        в одну матрицу.
      </p>
    </div>

    <div class="step-panel" data-on="deep-h1-base deep-h1-act deep-edge2 deep-w2 deep-h2-base deep-h2-linear deep-formula-z2" data-focus="deep-edge2 deep-w2 deep-h2-linear">
      <div class="step-kicker">Шаг 4 · скрытый слой 2</div>
      <h4>Второй слой работает уже не с x, а с h¹</h4>
      <div class="math-display" data-tex="\mathbf{z}^{(2)}=\mathbf{h}^{(1)}W^{(2)}+\mathbf{b}^{(2)}"></div>
      <p>
        Теперь входом служат четыре признака, созданные первым слоем. Матрица
        <code>W²</code> формы <code>[4, 3]</code> собирает их в три новые
        взвешенные суммы.
      </p>
    </div>

    <div class="step-panel" data-on="deep-h1-base deep-h1-act deep-edge2 deep-w2 deep-h2-base deep-h2-linear deep-h2-act deep-formula-h2" data-focus="deep-h2-act">
      <div class="step-kicker">Шаг 5 · активация 2</div>
      <h4>Получаем второе скрытое представление h²</h4>
      <div class="math-display" data-tex="\mathbf{h}^{(2)}=\operatorname{ReLU}\!\left(\mathbf{z}^{(2)}\right)"></div>
      <p>
        Второй скрытый слой комбинирует уже найденные признаки. Поэтому глубина —
        это не просто больше нейронов, а последовательность представлений:
        <code>x → h¹ → h²</code>.
      </p>
    </div>

    <div class="step-panel" data-on="deep-h2-base deep-h2-act deep-edge3 deep-w3 deep-output deep-formula-out" data-focus="deep-edge3 deep-w3 deep-output">
      <div class="step-kicker">Шаг 6 · выход</div>
      <h4>Выходной слой собирает h² в предсказание</h4>
      <div class="math-display" data-tex="\hat{y}=\mathbf{h}^{(2)}W^{(3)}+b^{(3)}"></div>
      <p>
        В примере решается регрессия, поэтому последний слой линейный и возвращает
        одно число. В классификации после него можно поставить sigmoid или softmax —
        скрытые слои от этого не меняются.
      </p>
    </div>

    <div class="step-panel" data-on="deep-input deep-edge1 deep-w1 deep-h1-base deep-h1-linear deep-h1-act deep-edge2 deep-w2 deep-h2-base deep-h2-linear deep-h2-act deep-edge3 deep-w3 deep-output deep-formula-all" data-focus="deep-input deep-edge1 deep-w1 deep-h1-base deep-h1-linear deep-h1-act deep-edge2 deep-w2 deep-h2-base deep-h2-linear deep-h2-act deep-edge3 deep-w3 deep-output">
      <div class="step-kicker">Шаг 7 · полный forward</div>
      <h4>Несколько скрытых слоёв — это композиция простых блоков</h4>
      <div class="math-display" data-tex="\hat{y}=f_3\!\left(f_2\!\left(f_1(\mathbf{x})\right)\right)"></div>
      <p>
        Каждый блок выполняет знакомые операции, но получает вход предыдущего
        уровня. Зелёный путь показывает весь forward: <code>x → h¹ → h² → ŷ</code>.
        Во время backward градиент пройдёт по той же цепочке в обратном направлении.
      </p>
    </div>
  </div>
</div>
</figure>

> **Главная идея глубины:** первый скрытый слой создаёт признаки `h¹`, второй создаёт признаки уже из `h¹`, а выходной слой превращает `h²` в ответ. Поэтому сеть с несколькими скрытыми слоями — не новая операция, а многократное применение одного и того же блока с разными матрицами весов.

---

## Часть 4. Как MLP обучается: forward, backward и матричная форма

До этого мы смотрели на MLP как на архитектуру: вход → скрытые слои → выход. Теперь важно увидеть, как эта сеть реально обучается. Здесь появляется тот же цикл, который уже был в линейной и логистической регрессии:

```
forward pass  →  loss  →  backward pass  →  update
```

Ниже используется маленькая сеть для регрессии: `2 входа → 2 ReLU-нейрона → 1 линейный выход`. Такой пример удобен тем, что все числа можно проверить вручную: видно, как входы превращаются в скрытые признаки, как считается ошибка, как градиент идёт назад через выходной слой, ReLU и веса первого слоя.

> **Почему здесь MSE, а выше говорили про классификацию?** В первых частях sigmoid нужен, чтобы интуитивно связать «нейрон» с логистической регрессией и вероятностями. В этом backprop-примере выбрана регрессия с MSE, потому что она проще для ручного расчёта. Принцип не меняется: если заменить выход на sigmoid/BCE или softmax/cross-entropy, изменится только последняя функция потерь и градиент на выходе, а сама схема backprop останется той же.

### Forward pass на одном объекте

<figure class="embedded-interactive" id="section-interactive-5">
  <div class="interactive-meta">Интерактив 5</div>
  <p class="interactive-desc">Forward pass: от входа до ошибки</p>
<div class="interactive-svg-wrap">
<svg id="mlpForward" viewBox="0 0 960 700" width="100%" role="img" aria-label="Forward pass MLP">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .counter { font-size: 15px; fill: #5E5850; }
    svg .node-label { font-size: 16px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    svg .op-label   { font-size: 15px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    svg .green      { font-size: 15px; font-weight: 800; fill: #73B222; text-anchor: middle; }
    svg .edge-label { font-size: 12px; fill: #5E5850; text-anchor: middle; }
    svg .desc       { font-size: 15px; fill: #111111; }
    svg .input-circle { fill: #ffffff; stroke: #5E5850; stroke-width: 1.6; }
    svg .param-circle { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    svg .op-box       { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; rx: 8; }
    svg .op-box-active{ fill: #EDF7DD; stroke: #73B222; stroke-width: 3.5; rx: 8; }
    svg .arrow        { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    svg .arrow-forward{ stroke: #73B222; stroke-width: 2.8; fill: none; }
    svg .thin         { stroke-width: 1.15; opacity: 0.75; }
    svg .btn          { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary{ fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text     { font-size: 17px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="arrMF" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/>
    </marker>
    <marker id="arrMFG" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#73B222"/>
    </marker>
  </defs>

  <text id="mfTitle" x="36" y="48" class="title"></text>
  <text id="mfSubtitle" x="36" y="76" class="subtitle"></text>

  <g id="mfScene"></g>

  <text id="mfCounter" x="36" y="655" class="counter"></text>

  <g id="mfPrevGroup">
    <rect id="mfPrevBtn" x="640" y="620" width="56" height="48" class="btn-secondary"/>
    <text x="668" y="644" class="btn-text-secondary">←</text>
  </g>

  <g id="mfNextGroup">
    <rect id="mfNextBtn" x="712" y="620" width="208" height="48" class="btn"/>
    <text id="mfNextText" x="816" y="644" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      function graphSVG(state) {
        const active = state.active || "";
        const v = state.values || {};
        const flow = state.flow || {};
        const show = (val) => (val === undefined || val === null) ? "" : val;
        const opCls = (id) => (active === id) ? "op-box-active" : "op-box";
        const forward = (id, x1, y1, x2, y2) => flow[id]
          ? `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="arrow-forward" marker-end="url(#arrMFG)"/>`
          : "";

        return `
          <line x1="105" y1="160" x2="245" y2="160" class="arrow thin" marker-end="url(#arrMF)"/>
          <line x1="105" y1="160" x2="245" y2="310" class="arrow thin" marker-end="url(#arrMF)"/>
          <line x1="105" y1="310" x2="245" y2="160" class="arrow thin" marker-end="url(#arrMF)"/>
          <line x1="105" y1="310" x2="245" y2="310" class="arrow thin" marker-end="url(#arrMF)"/>
          <line x1="326" y1="160" x2="386" y2="160" class="arrow" marker-end="url(#arrMF)"/>
          <line x1="326" y1="310" x2="386" y2="310" class="arrow" marker-end="url(#arrMF)"/>
          <line x1="470" y1="160" x2="565" y2="235" class="arrow" marker-end="url(#arrMF)"/>
          <line x1="470" y1="310" x2="565" y2="235" class="arrow" marker-end="url(#arrMF)"/>
          <line x1="646" y1="235" x2="718" y2="235" class="arrow" marker-end="url(#arrMF)"/>
          <line x1="760" y1="385" x2="760" y2="268" class="arrow" marker-end="url(#arrMF)"/>

          ${forward('x_to_u1_a', 105, 160, 245, 160)}
          ${forward('x_to_u1_b', 105, 310, 245, 160)}
          ${forward('u1_to_h1', 326, 160, 386, 160)}
          ${forward('x_to_u2_a', 105, 160, 245, 310)}
          ${forward('x_to_u2_b', 105, 310, 245, 310)}
          ${forward('u2_to_h2', 326, 310, 386, 310)}
          ${forward('h1_to_out', 470, 160, 565, 235)}
          ${forward('h2_to_out', 470, 310, 565, 235)}
          ${forward('out_to_loss', 646, 235, 718, 235)}
          ${forward('y_to_loss', 760, 385, 760, 268)}

          <circle cx="80" cy="160" r="25" class="input-circle"/>
          <text x="80" y="160" class="node-label">x₁</text>
          <circle cx="80" cy="310" r="25" class="input-circle"/>
          <text x="80" y="310" class="node-label">x₂</text>
          <circle cx="760" cy="410" r="25" class="input-circle"/>
          <text x="760" y="410" class="node-label">y</text>

          <rect x="246" y="130" width="80" height="60" class="${opCls('u1')}"/>
          <text x="286" y="154" class="op-label">Σ</text>
          <text x="286" y="177" class="op-label" style="font-size:13px;">u₁</text>
          <rect x="388" y="130" width="82" height="60" class="${opCls('h1')}"/>
          <text x="429" y="160" class="op-label">ReLU</text>

          <rect x="246" y="280" width="80" height="60" class="${opCls('u2')}"/>
          <text x="286" y="304" class="op-label">Σ</text>
          <text x="286" y="327" class="op-label" style="font-size:13px;">u₂</text>
          <rect x="388" y="280" width="82" height="60" class="${opCls('h2')}"/>
          <text x="429" y="310" class="op-label">ReLU</text>

          <rect x="566" y="205" width="80" height="60" class="${opCls('out')}"/>
          <text x="606" y="229" class="op-label">Σ</text>
          <text x="606" y="252" class="op-label" style="font-size:13px;">ŷ</text>
          <rect x="720" y="205" width="80" height="60" class="${opCls('loss')}"/>
          <text x="760" y="235" class="op-label">MSE</text>
          <text x="820" y="240" style="font-size:20px; font-style:italic; fill:#111;">ℓ</text>

          <text x="80" y="115" class="green">${show(v.x1)}</text>
          <text x="80" y="265" class="green">${show(v.x2)}</text>
          <text x="760" y="462" class="green">${show(v.y)}</text>
          <text x="286" y="115" class="green">${show(v.u1)}</text>
          <text x="429" y="115" class="green">${show(v.h1)}</text>
          <text x="286" y="265" class="green">${show(v.u2)}</text>
          <text x="429" y="265" class="green">${show(v.h2)}</text>
          <text x="606" y="190" class="green">${show(v.yhat)}</text>
          <text x="760" y="190" class="green">${show(v.loss)}</text>

          <text x="165" y="140" class="edge-label">w₁₁=0.5</text>
          <text x="164" y="222" class="edge-label">w₁₂=−0.3</text>
          <text x="164" y="264" class="edge-label">w₂₁=0.2</text>
          <text x="165" y="362" class="edge-label">w₂₂=0.4</text>
          <text x="520" y="185" class="edge-label">v₁=1.0</text>
          <text x="520" y="334" class="edge-label">v₂=−0.5</text>

          ${state.descSVG || ""}
        `;
      }

      const steps = [
        {
          title: "Шаг 0. Архитектура MLP",
          subtitle: "Два входа, два скрытых ReLU-нейрона и один числовой выход",
          state: {
            active: "",
            values: { x1: "2", x2: "3", y: "5" },
            flow: {},
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="526" class="desc"><tspan font-weight="700">MLP:</tspan> сначала строит новые признаки h₁ и h₂ в скрытом слое, а затем линейно собирает из них ответ ŷ.</text>
              <text x="56" y="552" class="desc"><tspan font-weight="700">Главное отличие от линейной регрессии:</tspan> между входом и выходом появился нелинейный слой ReLU.</text>
              <text x="56" y="578" class="desc">Именно нелинейность позволяет MLP приближать более сложные зависимости, чем одна прямая.</text>
            `
          }
        },
        {
          title: "Шаг 1. Первый скрытый нейрон: u₁",
          subtitle: "Сначала считаем линейную сумму для первого нейрона",
          state: {
            active: "u1",
            values: { x1: "2", x2: "3", y: "5", u1: "1.7" },
            flow: { x_to_u1_a: true, x_to_u1_b: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="530" class="desc">u₁ = 0.5·x₁ + 0.2·x₂ + b₁ = 0.5·2 + 0.2·3 + 0.1 = <tspan fill="#73B222" font-weight="800">1.7</tspan></text>
              <text x="56" y="562" class="desc">u₁ — это ещё не выход нейрона, а значение <tspan font-weight="700">до активации</tspan>.</text>
            `
          }
        },
        {
          title: "Шаг 2. ReLU для первого нейрона: h₁",
          subtitle: "ReLU пропускает положительное число без изменения",
          state: {
            active: "h1",
            values: { x1: "2", x2: "3", y: "5", u1: "1.7", h1: "1.7" },
            flow: { u1_to_h1: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="530" class="desc">h₁ = ReLU(u₁) = max(0, 1.7) = <tspan fill="#73B222" font-weight="800">1.7</tspan></text>
              <text x="56" y="562" class="desc">Если u был бы отрицательным, ReLU сделал бы выход нейрона равным нулю.</text>
            `
          }
        },
        {
          title: "Шаг 3. Второй скрытый нейрон: u₂",
          subtitle: "Второй нейрон смотрит на те же входы, но со своими весами",
          state: {
            active: "u2",
            values: { x1: "2", x2: "3", y: "5", u1: "1.7", h1: "1.7", u2: "0.8" },
            flow: { x_to_u2_a: true, x_to_u2_b: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="530" class="desc">u₂ = (−0.3)·x₁ + 0.4·x₂ + b₂ = (−0.3)·2 + 0.4·3 + 0.2 = <tspan fill="#73B222" font-weight="800">0.8</tspan></text>
              <text x="56" y="562" class="desc">Каждый скрытый нейрон учит свою комбинацию исходных признаков.</text>
            `
          }
        },
        {
          title: "Шаг 4. ReLU для второго нейрона: h₂",
          subtitle: "Второй нейрон тоже активен, потому что u₂ больше нуля",
          state: {
            active: "h2",
            values: { x1: "2", x2: "3", y: "5", u1: "1.7", h1: "1.7", u2: "0.8", h2: "0.8" },
            flow: { u2_to_h2: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="530" class="desc">h₂ = ReLU(u₂) = max(0, 0.8) = <tspan fill="#73B222" font-weight="800">0.8</tspan></text>
              <text x="56" y="562" class="desc">Теперь скрытый слой выдал два новых признака: h₁=1.7 и h₂=0.8.</text>
            `
          }
        },
        {
          title: "Шаг 5. Выходной слой: ŷ",
          subtitle: "Финальное предсказание — линейная комбинация скрытых признаков",
          state: {
            active: "out",
            values: { x1: "2", x2: "3", y: "5", u1: "1.7", h1: "1.7", u2: "0.8", h2: "0.8", yhat: "1.6" },
            flow: { h1_to_out: true, h2_to_out: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="530" class="desc">ŷ = 1.0·h₁ + (−0.5)·h₂ + c = 1.0·1.7 − 0.5·0.8 + 0.3 = <tspan fill="#73B222" font-weight="800">1.6</tspan></text>
              <text x="56" y="562" class="desc">Модель предсказала 1.6, но правильный ответ y = 5, значит ошибка пока большая.</text>
            `
          }
        },
        {
          title: "Шаг 6. Считаем loss",
          subtitle: "MSE показывает, насколько далеко предсказание от правильного ответа",
          state: {
            active: "loss",
            values: { x1: "2", x2: "3", y: "5", u1: "1.7", h1: "1.7", u2: "0.8", h2: "0.8", yhat: "1.6", loss: "5.78" },
            flow: { out_to_loss: true, y_to_loss: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="530" class="desc">ℓ = 1/2 · (ŷ − y)² = 1/2 · (1.6 − 5)² = 1/2 · (−3.4)² = <tspan fill="#73B222" font-weight="800">5.78</tspan></text>
              <text x="56" y="562" class="desc">Forward pass закончен: теперь надо понять, какие веса сильнее всего виноваты в ошибке.</text>
            `
          }
        },
        {
          title: "Шаг 7. Forward pass завершён",
          subtitle: "Все промежуточные значения сохранены для backward pass",
          state: {
            active: "",
            values: { x1: "2", x2: "3", y: "5", u1: "1.7", h1: "1.7", u2: "0.8", h2: "0.8", yhat: "1.6", loss: "5.78" },
            flow: {
              x_to_u1_a: true, x_to_u1_b: true, u1_to_h1: true,
              x_to_u2_a: true, x_to_u2_b: true, u2_to_h2: true,
              h1_to_out: true, h2_to_out: true, out_to_loss: true, y_to_loss: true
            },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4" rx="8"/>
              <text x="56" y="528" class="desc"><tspan font-weight="700">Итог:</tspan> скрытый слой дал h₁=1.7, h₂=0.8; выход ŷ=1.6; loss=5.78.</text>
              <text x="56" y="556" class="desc">На backward pass эти зелёные значения понадобятся, чтобы посчитать локальные производные.</text>
            `
          }
        }
      ];

      let i = 0;
      function render() {
        const s = steps[i];
        $("mfTitle").textContent = s.title;
        $("mfSubtitle").textContent = s.subtitle;
        $("mfCounter").textContent = `${i + 1} из ${steps.length}`;
        $("mfScene").innerHTML = graphSVG(s.state);
        $("mfPrevGroup").style.display = i === 0 ? "none" : "block";
        $("mfNextText").textContent = i === steps.length - 1 ? "↻" : "Далее";
      }
      function next(){ i = (i < steps.length - 1) ? i + 1 : 0; render(); }
      function prev(){ if (i > 0) { i--; render(); } }
      $("mfNextBtn").addEventListener("click", next);
      $("mfPrevBtn").addEventListener("click", prev);
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

### Backward pass на одном объекте

<figure class="embedded-interactive" id="section-interactive-6">
  <div class="interactive-meta">Интерактив 6</div>
  <p class="interactive-desc">Backward pass: градиент идёт справа налево</p>
<div class="interactive-svg-wrap">
<svg id="mlpBackward" viewBox="0 0 960 700" width="100%" role="img" aria-label="Backward pass MLP">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .counter { font-size: 15px; fill: #5E5850; }
    svg .node-label { font-size: 16px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    svg .op-label   { font-size: 15px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    svg .green      { font-size: 15px; font-weight: 800; fill: #73B222; text-anchor: middle; }
    svg .red        { font-size: 14px; font-weight: 800; fill: #C30B0A; text-anchor: middle; }
    svg .edge-label { font-size: 12px; fill: #5E5850; text-anchor: middle; }
    svg .desc       { font-size: 15px; fill: #111111; }
    svg .input-circle { fill: #ffffff; stroke: #5E5850; stroke-width: 1.6; }
    svg .op-box       { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; rx: 8; }
    svg .op-box-active{ fill: #FFE9E9; stroke: #C30B0A; stroke-width: 3.5; rx: 8; }
    svg .arrow        { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    svg .arrow-back   { stroke: #C30B0A; stroke-width: 2.4; fill: none; }
    svg .thin         { stroke-width: 1.15; opacity: 0.75; }
    svg .btn          { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary{ fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text     { font-size: 17px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="arrMB" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/>
    </marker>
    <marker id="arrMBR" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text id="mbTitle" x="36" y="48" class="title"></text>
  <text id="mbSubtitle" x="36" y="76" class="subtitle"></text>
  <g id="mbScene"></g>
  <text id="mbCounter" x="36" y="655" class="counter"></text>
  <g id="mbPrevGroup">
    <rect id="mbPrevBtn" x="640" y="620" width="56" height="48" class="btn-secondary"/>
    <text x="668" y="644" class="btn-text-secondary">←</text>
  </g>
  <g id="mbNextGroup">
    <rect id="mbNextBtn" x="712" y="620" width="208" height="48" class="btn"/>
    <text id="mbNextText" x="816" y="644" class="btn-text">Далее</text>
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
          ? `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="arrow-back" marker-end="url(#arrMBR)"/>`
          : "";

        return `
          <line x1="105" y1="160" x2="245" y2="160" class="arrow thin" marker-end="url(#arrMB)"/>
          <line x1="105" y1="160" x2="245" y2="310" class="arrow thin" marker-end="url(#arrMB)"/>
          <line x1="105" y1="310" x2="245" y2="160" class="arrow thin" marker-end="url(#arrMB)"/>
          <line x1="105" y1="310" x2="245" y2="310" class="arrow thin" marker-end="url(#arrMB)"/>
          <line x1="326" y1="160" x2="386" y2="160" class="arrow" marker-end="url(#arrMB)"/>
          <line x1="326" y1="310" x2="386" y2="310" class="arrow" marker-end="url(#arrMB)"/>
          <line x1="470" y1="160" x2="565" y2="235" class="arrow" marker-end="url(#arrMB)"/>
          <line x1="470" y1="310" x2="565" y2="235" class="arrow" marker-end="url(#arrMB)"/>
          <line x1="646" y1="235" x2="718" y2="235" class="arrow" marker-end="url(#arrMB)"/>
          <line x1="760" y1="385" x2="760" y2="268" class="arrow" marker-end="url(#arrMB)"/>

          ${back('loss_out', 812, 246, 802, 246)}
          ${back('to_yhat', 718, 250, 648, 250)}
          ${back('to_h1', 566, 250, 472, 175)}
          ${back('to_h2', 566, 250, 472, 325)}
          ${back('relu1', 388, 176, 328, 176)}
          ${back('relu2', 388, 326, 328, 326)}
          ${flow.wgrad ? `
            <rect x="132" y="96" width="112" height="30" fill="#ffffff" fill-opacity="0.88" stroke="#FDE6E6" rx="6"/>
            <rect x="132" y="248" width="112" height="30" fill="#ffffff" fill-opacity="0.88" stroke="#FDE6E6" rx="6"/>
          ` : ""}

          <circle cx="80" cy="160" r="25" class="input-circle"/>
          <text x="80" y="160" class="node-label">x₁</text>
          <circle cx="80" cy="310" r="25" class="input-circle"/>
          <text x="80" y="310" class="node-label">x₂</text>
          <circle cx="760" cy="410" r="25" class="input-circle"/>
          <text x="760" y="410" class="node-label">y</text>

          <rect x="246" y="130" width="80" height="60" class="${opCls('u1')}"/>
          <text x="286" y="154" class="op-label">Σ</text>
          <text x="286" y="177" class="op-label" style="font-size:13px;">u₁</text>
          <rect x="388" y="130" width="82" height="60" class="${opCls('h1')}"/>
          <text x="429" y="160" class="op-label">ReLU</text>
          <rect x="246" y="280" width="80" height="60" class="${opCls('u2')}"/>
          <text x="286" y="304" class="op-label">Σ</text>
          <text x="286" y="327" class="op-label" style="font-size:13px;">u₂</text>
          <rect x="388" y="280" width="82" height="60" class="${opCls('h2')}"/>
          <text x="429" y="310" class="op-label">ReLU</text>
          <rect x="566" y="205" width="80" height="60" class="${opCls('out')}"/>
          <text x="606" y="229" class="op-label">Σ</text>
          <text x="606" y="252" class="op-label" style="font-size:13px;">ŷ</text>
          <rect x="720" y="205" width="80" height="60" class="${opCls('loss')}"/>
          <text x="760" y="235" class="op-label">MSE</text>
          <text x="820" y="240" style="font-size:20px; font-style:italic; fill:#111;">ℓ</text>

          <text x="80" y="115" class="green">2</text>
          <text x="80" y="265" class="green">3</text>
          <text x="760" y="462" class="green">5</text>
          <text x="286" y="115" class="green">1.7</text>
          <text x="429" y="115" class="green">1.7</text>
          <text x="286" y="265" class="green">0.8</text>
          <text x="429" y="265" class="green">0.8</text>
          <text x="606" y="190" class="green">1.6</text>
          <text x="760" y="190" class="green">5.78</text>

          <text x="682" y="286" class="red">${show(g.dyhat)}</text>
          <text x="520" y="185" class="red">${show(g.dv1)}</text>
          <text x="520" y="334" class="red">${show(g.dv2)}</text>
          <text x="520" y="146" class="red">${show(g.dh1)}</text>
          <text x="520" y="362" class="red">${show(g.dh2)}</text>
          <text x="356" y="205" class="red">${show(g.du1)}</text>
          <text x="356" y="355" class="red">${show(g.du2)}</text>
          <text x="165" y="140" class="red">${show(g.dw11)}</text>
          <text x="164" y="222" class="red">${show(g.dw12)}</text>
          <text x="164" y="264" class="red">${show(g.dw21)}</text>
          <text x="165" y="362" class="red">${show(g.dw22)}</text>

          ${state.descSVG || ""}
        `;
      }

      const steps = [
        {
          title: "Шаг 0. Зачем нужен backward pass",
          subtitle: "Нужно найти, как loss меняется при изменении каждого веса",
          state: {
            active: "",
            grads: {},
            flow: {},
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="526" class="desc"><tspan font-weight="700">Цель:</tspan> найти градиенты для W₂, c, W₁ и b₁.</text>
              <text x="56" y="552" class="desc">Идём справа налево: loss → выходной слой → скрытые активации → ReLU → веса скрытого слоя.</text>
              <text x="56" y="578" class="desc">Красные числа показывают градиенты, зелёные — значения из forward pass.</text>
            `
          }
        },
        {
          title: "Шаг 1. Градиент loss по предсказанию",
          subtitle: "Для ℓ = 1/2(ŷ−y)² производная равна ŷ−y",
          state: {
            active: "loss",
            grads: { dyhat: "∂ℓ/∂ŷ = −3.4" },
            flow: { loss_out: true, to_yhat: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="530" class="desc">∂ℓ/∂ŷ = ŷ − y = 1.6 − 5 = <tspan fill="#C30B0A" font-weight="800">−3.4</tspan></text>
              <text x="56" y="562" class="desc">Знак минус означает: чтобы уменьшить loss, предсказание надо увеличить.</text>
            `
          }
        },
        {
          title: "Шаг 2. Градиенты выходного слоя",
          subtitle: "Выходной слой — это линейная регрессия поверх h₁ и h₂",
          state: {
            active: "out",
            grads: { dyhat: "∂ℓ/∂ŷ = −3.4", dv1: "∂ℓ/∂v₁ = −5.78", dv2: "∂ℓ/∂v₂ = −2.72" },
            flow: { loss_out: true, to_yhat: true, to_h1: true, to_h2: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="526" class="desc">ŷ = v₁h₁ + v₂h₂ + c. Поэтому ∂ℓ/∂v₁ = (−3.4)·1.7 = <tspan fill="#C30B0A" font-weight="800">−5.78</tspan>.</text>
              <text x="56" y="552" class="desc">∂ℓ/∂v₂ = (−3.4)·0.8 = <tspan fill="#C30B0A" font-weight="800">−2.72</tspan>; ∂ℓ/∂c = <tspan fill="#C30B0A" font-weight="800">−3.4</tspan>.</text>
              <text x="56" y="578" class="desc">Это такие же правила, как в линейной регрессии, только входами стали h₁ и h₂.</text>
            `
          }
        },
        {
          title: "Шаг 3. Передаём ошибку в скрытый слой",
          subtitle: "Каждый скрытый нейрон получает градиент через свой выходной вес",
          state: {
            active: "out",
            grads: { dyhat: "∂ℓ/∂ŷ = −3.4", dv1: "∂ℓ/∂v₁ = −5.78", dv2: "∂ℓ/∂v₂ = −2.72", dh1: "∂ℓ/∂h₁ = −3.4", dh2: "∂ℓ/∂h₂ = 1.7" },
            flow: { loss_out: true, to_yhat: true, to_h1: true, to_h2: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="526" class="desc">∂ℓ/∂h₁ = ∂ℓ/∂ŷ · v₁ = −3.4 · 1.0 = <tspan fill="#C30B0A" font-weight="800">−3.4</tspan></text>
              <text x="56" y="552" class="desc">∂ℓ/∂h₂ = ∂ℓ/∂ŷ · v₂ = −3.4 · (−0.5) = <tspan fill="#C30B0A" font-weight="800">1.7</tspan></text>
              <text x="56" y="578" class="desc">Так ошибка «распределяется» по скрытым нейронам через веса следующего слоя.</text>
            `
          }
        },
        {
          title: "Шаг 4. Проходим через ReLU",
          subtitle: "Производная ReLU равна 1, если u > 0, и 0, если u < 0",
          state: {
            active: "h1",
            grads: { dh1: "∂ℓ/∂h₁ = −3.4", dh2: "∂ℓ/∂h₂ = 1.7", du1: "∂ℓ/∂u₁ = −3.4", du2: "∂ℓ/∂u₂ = 1.7" },
            flow: { to_h1: true, to_h2: true, relu1: true, relu2: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="526" class="desc">u₁=1.7 и u₂=0.8 — оба положительные, значит ReLU'(u₁)=ReLU'(u₂)=1.</text>
              <text x="56" y="552" class="desc">∂ℓ/∂u₁ = −3.4 · 1 = <tspan fill="#C30B0A" font-weight="800">−3.4</tspan>; ∂ℓ/∂u₂ = 1.7 · 1 = <tspan fill="#C30B0A" font-weight="800">1.7</tspan>.</text>
              <text x="56" y="578" class="desc">Если нейрон был бы выключен ReLU, его градиент назад стал бы нулём.</text>
            `
          }
        },
        {
          title: "Шаг 5. Градиенты весов скрытого слоя",
          subtitle: "Не отправляем градиент отдельно в два входа — считаем градиенты рёбер W₁",
          state: {
            active: "u1",
            grads: { du1: "∂ℓ/∂u₁ = −3.4", du2: "∂ℓ/∂u₂ = 1.7", dw11: "∂w₁₁ −6.8", dw21: "∂w₂₁ −10.2", dw12: "∂w₁₂ 3.4", dw22: "∂w₂₂ 5.1" },
            flow: { relu1: true, relu2: true, wgrad: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="522" class="desc">Здесь x₁ и x₂ — фиксированные входные признаки. Мы не обновляем их; обновляются веса на рёбрах.</text>
              <text x="56" y="548" class="desc">Первый нейрон: ∂ℓ/∂w₁₁ = (−3.4)·2 = <tspan fill="#C30B0A" font-weight="800">−6.8</tspan>, ∂ℓ/∂w₂₁ = (−3.4)·3 = <tspan fill="#C30B0A" font-weight="800">−10.2</tspan>.</text>
              <text x="56" y="574" class="desc">Второй нейрон: ∂ℓ/∂w₁₂ = 1.7·2 = <tspan fill="#C30B0A" font-weight="800">3.4</tspan>, ∂ℓ/∂w₂₂ = 1.7·3 = <tspan fill="#C30B0A" font-weight="800">5.1</tspan>. Bias: ∂b₁=−3.4, ∂b₂=1.7.</text>
            `
          }
        },
        {
          title: "Шаг 6. Обновляем параметры",
          subtitle: "Делаем шаг против градиента: θ ← θ − η·∇θ",
          state: {
            active: "",
            grads: { dyhat: "∂ℓ/∂ŷ = −3.4", du1: "−3.4", du2: "1.7", dw11: "∂w₁₁ −6.8", dw21: "∂w₂₁ −10.2", dw12: "∂w₁₂ 3.4", dw22: "∂w₂₂ 5.1", dv1: "−5.78", dv2: "−2.72" },
            flow: { loss_out: true, to_yhat: true, to_h1: true, to_h2: true, relu1: true, relu2: true, wgrad: true },
            descSVG: `
              <rect x="36" y="500" width="888" height="96" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4" rx="8"/>
              <text x="56" y="522" class="desc">Берём learning rate η = 0.02. Например: v₁ ← 1.0 − 0.02·(−5.78) = <tspan fill="#73B222" font-weight="800">1.1156</tspan>.</text>
              <text x="56" y="548" class="desc">w₁₁ ← 0.5 − 0.02·(−6.8) = <tspan fill="#73B222" font-weight="800">0.636</tspan>; w₂₁ ← 0.2 − 0.02·(−10.2) = <tspan fill="#73B222" font-weight="800">0.404</tspan>.</text>
              <text x="56" y="574" class="desc">После одного шага новое предсказание ≈ 3.18, loss ≈ <tspan fill="#73B222" font-weight="800">1.65</tspan> вместо 5.78 — модель стала лучше.</text>
            `
          }
        }
      ];

      let i = 0;
      function render() {
        const s = steps[i];
        $("mbTitle").textContent = s.title;
        $("mbSubtitle").textContent = s.subtitle;
        $("mbCounter").textContent = `${i + 1} из ${steps.length}`;
        $("mbScene").innerHTML = graphSVG(s.state);
        $("mbPrevGroup").style.display = i === 0 ? "none" : "block";
        $("mbNextText").textContent = i === steps.length - 1 ? "↻" : "Далее";
      }
      function next(){ i = (i < steps.length - 1) ? i + 1 : 0; render(); }
      function prev(){ if (i > 0) { i--; render(); } }
      $("mbNextBtn").addEventListener("click", next);
      $("mbPrevBtn").addEventListener("click", prev);
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

### MLP в матричной форме: батч из трёх объектов

<figure class="embedded-interactive" id="section-interactive-7">
  <div class="interactive-meta">Интерактив 7</div>
  <p class="interactive-desc">MLP в матричной форме: батч из трёх объектов</p>
<div class="interactive-svg-wrap">
<svg id="mlpMat" viewBox="0 0 960 760" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif" role="img" aria-label="MLP backprop в матричной форме">
  <style>
    svg .data-cell  { fill: #F3F1EE; stroke: #5E5850; stroke-width: 1; }
    svg .param-cell { fill: #E8F0F7; stroke: #3576C0; stroke-width: 1.2; }
    svg .fwd-cell   { fill: #EDF7DD; stroke: #73B222; stroke-width: 1.2; }
    svg .bwd-cell   { fill: #FDE6E6; stroke: #C30B0A; stroke-width: 1.2; }
    svg .empty-cell { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; stroke-dasharray: 3,2; }
    svg .active-fwd { fill: #DBF0AE; stroke: #5C8E1B; stroke-width: 2; }
    svg .active-bwd { fill: #FBD0D0; stroke: #A1090A; stroke-width: 2; }
    svg .data-text  { fill: #5E5850; font-size: 13px; font-weight: 500; }
    svg .param-text { fill: #3576C0; font-size: 13px; font-weight: 600; }
    svg .fwd-text   { fill: #4C8316; font-size: 13px; font-weight: 600; }
    svg .bwd-text   { fill: #A1090A; font-size: 13px; font-weight: 600; }
    svg .empty-text { fill: #C9C2B8; font-size: 13px; }
    svg .label   { fill: #5E5850; font-size: 12px; }
    svg .formula { fill: #5E5850; font-size: 13px; font-weight: 500; }
    svg .formula-active { fill: #B08F00; font-size: 13px; font-weight: 700; }
    svg .header  { fill: #5E5850; font-size: 15px; font-weight: 700; }
    svg .title   { fill: #5E5850; font-size: 16px; font-weight: 700; }
    svg .shape   { fill: #968F85; font-size: 10px; }
    svg .desc-bg { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; }
    svg .desc-text { fill: #5E5850; font-size: 13px; }
    svg .col-sep { stroke: #E5E1DA; stroke-width: 1; }
    svg .nav-btn  { cursor: pointer; }
    svg .nav-btn rect { fill: #C29E08; stroke: #C29E08; }
    svg .nav-btn:hover rect { fill: #A88800; }
    svg .nav-btn text { fill: #fff; font-size: 14px; font-weight: 600; pointer-events: none; }
    svg .nav-prev rect { fill: #fff; stroke: #5E5850; stroke-width: 1.2; }
    svg .nav-prev text { fill: #5E5850; font-size: 16px; }
    svg .counter { fill: #5E5850; font-size: 13px; }
  </style>

  <g id="mlpMat-scene"></g>
  <g id="mlpMat-nav"></g>
</svg>
</div>
</figure>

<script>
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const sceneEl = document.getElementById('mlpMat-scene');
  const navEl   = document.getElementById('mlpMat-nav');

  const X = [2,3, 1,2, 3,1];
  const y = [5,3,6];
  const W1 = [0.5,-0.3, 0.2,0.4];
  const b1 = [0.1,0.2];
  const W2 = [1.0,-0.5];
  const c = 0.3;

  const U = [1.7,0.8, 1.0,0.7, 1.8,-0.3];
  const H = [1.7,0.8, 1.0,0.7, 1.8,0.0];
  const YH = [1.6,0.95,2.1];
  const LOSS = 5.162;

  const dYH = [-1.133,-0.683,-1.300];
  const dW2 = [-4.950,-1.385];
  const dc = -3.117;
  const dU = [-1.133,0.567, -0.683,0.342, -1.300,0.000];
  const dW1 = [-6.850,1.475, -6.067,2.383];
  const db1 = [-3.117,0.908];

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
    let s = Number(v).toFixed(d);
    s = s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    return s;
  }

  const CW = 34, CH = 25;

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
    const cw = 54, ch = 28;
    const cls = empty ? 'empty-cell' : (active ? (active === 'fwd' ? 'active-fwd' : 'active-bwd') : fillCls);
    g.appendChild(rect(x, y, cw, ch, cls));
    if (!empty) g.appendChild(txt(x + cw/2, y + ch/2 + 5, fmt(value, decimals), textCls));
    else g.appendChild(txt(x + cw/2, y + ch/2 + 5, '?', 'empty-text'));
  }

  const steps = [
    {
      title: 'Постановка: батч N = 3, вход d = 2, скрытый слой m = 2',
      active: null,
      fwd: { U:false, H:false, Y:false, L:false },
      bwd: { dY:false, dW2:false, dU:false, dW1:false, upd:false },
      desc: [
        'X — батч 3×2. W₁ переводит входы в 2 скрытых нейрона, W₂ переводит скрытый слой в один выход.',
        'Forward: U = XW₁ + b₁, H = ReLU(U), ŷ = HW₂ + c, loss = 1/2 · mean((ŷ−y)²).',
        'Backward делает те же операции в обратном направлении и сохраняет формы матриц.'
      ]
    },
    {
      title: 'Forward, шаг 1: U = X · W₁ + b₁',
      active: 'U',
      fwd: { U:true, H:false, Y:false, L:false },
      bwd: { dY:false, dW2:false, dU:false, dW1:false, upd:false },
      desc: [
        'Одно матричное умножение считает значения до активации для всех 3 объектов и 2 скрытых нейронов.',
        'Форма: X(3×2) · W₁(2×2) + b₁(1×2) = U(3×2). Bias b₁ прибавляется к каждой строке.',
        'Например, для первого объекта: u₁=1.7, u₂=0.8.'
      ]
    },
    {
      title: 'Forward, шаг 2: H = ReLU(U)',
      active: 'H',
      fwd: { U:true, H:true, Y:false, L:false },
      bwd: { dY:false, dW2:false, dU:false, dW1:false, upd:false },
      desc: [
        'ReLU применяется поэлементно: положительные значения остаются, отрицательные превращаются в 0.',
        'В третьей строке второй скрытый нейрон имел U = −0.3, поэтому в H стало 0.',
        'Это и есть нелинейность, из-за которой MLP мощнее простой линейной модели.'
      ]
    },
    {
      title: 'Forward, шаг 3: ŷ = H · W₂ + c',
      active: 'Y',
      fwd: { U:true, H:true, Y:true, L:false },
      bwd: { dY:false, dW2:false, dU:false, dW1:false, upd:false },
      desc: [
        'Выходной слой собирает два скрытых признака в одно число для каждого объекта батча.',
        'Форма: H(3×2) · W₂(2×1) + c = ŷ(3×1). Получаем предсказания [1.6, 0.95, 2.1]ᵀ.',
        'Пока все предсказания ниже правильных ответов y = [5, 3, 6]ᵀ.'
      ]
    },
    {
      title: 'Forward, шаг 4: loss = 1/2 · mean((ŷ − y)²)',
      active: 'L',
      fwd: { U:true, H:true, Y:true, L:true },
      bwd: { dY:false, dW2:false, dU:false, dW1:false, upd:false },
      desc: [
        'Loss по батчу — один скаляр: он усредняет ошибки всех трёх объектов.',
        'ℓ = 1/2 · mean([1.6−5, 0.95−3, 2.1−6]²) ≈ 5.162.',
        'Теперь этот скаляр нужно «разложить» назад по всем параметрам сети.'
      ]
    },
    {
      title: 'Backward, шаг 1: ∂ℓ/∂ŷ = (1/N)(ŷ − y)',
      active: 'dY',
      fwd: { U:true, H:true, Y:true, L:true },
      bwd: { dY:true, dW2:false, dU:false, dW1:false, upd:false },
      desc: [
        'Множитель 1/N появляется из-за mean по батчу. Для N=3 получаем градиент формы 3×1.',
        '∂ℓ/∂ŷ ≈ [−1.133, −0.683, −1.300]ᵀ.',
        'Каждая строка говорит, как надо менять предсказание конкретного объекта.'
      ]
    },
    {
      title: 'Backward, шаг 2: ∂ℓ/∂W₂ = Hᵀ · ∂ℓ/∂ŷ,  ∂ℓ/∂c = Σ∂ℓ/∂ŷ',
      active: 'dW2',
      fwd: { U:true, H:true, Y:true, L:true },
      bwd: { dY:true, dW2:true, dU:false, dW1:false, upd:false },
      desc: [
        'Hᵀ(2×3) собирает вклад всех объектов батча в два веса выходного слоя.',
        '∂ℓ/∂W₂ ≈ [−4.950, −1.385]ᵀ, а ∂ℓ/∂c ≈ −3.117.',
        'Это тот же принцип, что в линейной регрессии: вход слоя транспонируется и умножается на градиент выхода.'
      ]
    },
    {
      title: 'Backward, шаг 3: ∂ℓ/∂U = (∂ℓ/∂ŷ · W₂ᵀ) ⊙ ReLU′(U)',
      active: 'dU',
      fwd: { U:true, H:true, Y:true, L:true },
      bwd: { dY:true, dW2:true, dU:true, dW1:false, upd:false },
      desc: [
        'Сначала проталкиваем ошибку через W₂ назад в скрытый слой, потом умножаем на производную ReLU.',
        'Там, где U < 0, ReLU′(U)=0. Поэтому во второй колонке третьей строки градиент стал 0.',
        'Форма ∂ℓ/∂U такая же, как U и H: 3×2.'
      ]
    },
    {
      title: 'Backward, шаг 4: ∂ℓ/∂W₁ = Xᵀ · ∂ℓ/∂U,  ∂ℓ/∂b₁ = Σ rows',
      active: 'dW1',
      fwd: { U:true, H:true, Y:true, L:true },
      bwd: { dY:true, dW2:true, dU:true, dW1:true, upd:false },
      desc: [
        'Xᵀ(2×3) собирает вклад всех объектов батча в веса первого слоя W₁(2×2).',
        '∂ℓ/∂W₁ ≈ [[−6.850, 1.475], [−6.067, 2.383]],  ∂ℓ/∂b₁ ≈ [−3.117, 0.908].',
        'Все градиенты готовы: сеть знает, как поправить каждый вес.'
      ]
    },
    {
      title: 'Шаг градиентного спуска: обновляем W₁, b₁, W₂, c',
      active: 'upd',
      fwd: { U:true, H:true, Y:true, L:true },
      bwd: { dY:true, dW2:true, dU:true, dW1:true, upd:true },
      desc: [
        'Обновление одинаковое для всех параметров: θ ← θ − η · ∂ℓ/∂θ.',
        'В коде это выглядит как несколько матричных операций: dY, dW2, dU, dW1, затем optimizer.step().',
        'Главная проверка корректности: формы должны совпадать с параметрами: dW₁ как W₁, db₁ как b₁, dW₂ как W₂, dc как scalar.'
      ]
    }
  ];

  let i = 0;

  function render() {
    while (sceneEl.firstChild) sceneEl.removeChild(sceneEl.firstChild);
    while (navEl.firstChild) navEl.removeChild(navEl.firstChild);
    const s = steps[i];

    sceneEl.appendChild(txt(480, 32, s.title, 'title'));
    sceneEl.appendChild(el('line', { x1: 232, y1: 58, x2: 232, y2: 565, class: 'col-sep' }));
    sceneEl.appendChild(el('line', { x1: 560, y1: 58, x2: 560, y2: 565, class: 'col-sep' }));

    sceneEl.appendChild(txt(135, 76, 'Данные и параметры', 'header'));
    sceneEl.appendChild(txt(395, 76, 'Forward pass', 'header'));
    sceneEl.appendChild(txt(720, 76, 'Backward pass', 'header'));

    sceneEl.appendChild(txt(60, 114, 'X =', 'label', 'end'));
    drawMatrix(sceneEl, 72, 96, 3, 2, X, 'data-cell', 'data-text', null, 0);
    sceneEl.appendChild(txt(106, 184, '(3×2)', 'shape'));

    sceneEl.appendChild(txt(60, 218, 'y =', 'label', 'end'));
    drawMatrix(sceneEl, 72, 200, 3, 1, y, 'data-cell', 'data-text', null, 0);
    sceneEl.appendChild(txt(89, 288, '(3×1)', 'shape'));

    sceneEl.appendChild(txt(60, 326, 'W₁ =', 'label', 'end'));
    drawMatrix(sceneEl, 72, 308, 2, 2, W1, 'param-cell', 'param-text', null, 3);
    sceneEl.appendChild(txt(106, 371, '(2×2)', 'shape'));

    sceneEl.appendChild(txt(60, 410, 'b₁ =', 'label', 'end'));
    drawMatrix(sceneEl, 72, 392, 1, 2, b1, 'param-cell', 'param-text', null, 3);
    sceneEl.appendChild(txt(106, 437, '(1×2)', 'shape'));

    sceneEl.appendChild(txt(60, 482, 'W₂ =', 'label', 'end'));
    drawMatrix(sceneEl, 72, 464, 2, 1, W2, 'param-cell', 'param-text', null, 3);
    sceneEl.appendChild(txt(89, 527, '(2×1)', 'shape'));

    sceneEl.appendChild(txt(150, 482, 'c =', 'label', 'end'));
    drawScalar(sceneEl, 162, 467, c, 'param-cell', 'param-text', null, 3);

    const uHl = s.active === 'U';
    sceneEl.appendChild(txt(260, 106, 'U = XW₁ + b₁', uHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(280, 134, 'U =', 'label', 'end'));
    drawMatrix(sceneEl, 292, 116, 3, 2, s.fwd.U ? U : null, 'fwd-cell', 'fwd-text', uHl ? 'fwd' : null, 3);
    sceneEl.appendChild(txt(326, 204, '(3×2)', 'shape'));

    const hHl = s.active === 'H';
    sceneEl.appendChild(txt(260, 238, 'H = ReLU(U)', hHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(280, 266, 'H =', 'label', 'end'));
    drawMatrix(sceneEl, 292, 248, 3, 2, s.fwd.H ? H : null, 'fwd-cell', 'fwd-text', hHl ? 'fwd' : null, 3);
    sceneEl.appendChild(txt(326, 336, '(3×2)', 'shape'));

    const yHl = s.active === 'Y';
    sceneEl.appendChild(txt(260, 355, 'ŷ = HW₂ + c', yHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(280, 383, 'ŷ =', 'label', 'end'));
    drawMatrix(sceneEl, 292, 365, 3, 1, s.fwd.Y ? YH : null, 'fwd-cell', 'fwd-text', yHl ? 'fwd' : null, 3);
    sceneEl.appendChild(txt(309, 453, '(3×1)', 'shape'));

    const lHl = s.active === 'L';
    sceneEl.appendChild(txt(260, 487, 'ℓ = 1/2·mean((ŷ−y)²)', lHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(280, 515, 'ℓ =', 'label', 'end'));
    drawScalar(sceneEl, 292, 497, s.fwd.L ? LOSS : null, 'fwd-cell', 'fwd-text', lHl ? 'fwd' : null, 3);

    const dyHl = s.active === 'dY';
    sceneEl.appendChild(txt(580, 106, '∂ℓ/∂ŷ = (1/N)(ŷ−y)', dyHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(622, 134, 'dŷ =', 'label', 'end'));
    drawMatrix(sceneEl, 632, 116, 3, 1, s.bwd.dY ? dYH : null, 'bwd-cell', 'bwd-text', dyHl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(649, 204, '(3×1)', 'shape'));

    const dw2Hl = s.active === 'dW2';
    sceneEl.appendChild(txt(580, 238, 'dW₂ = Hᵀdŷ,  dc = Σdŷ', dw2Hl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(622, 266, 'dW₂ =', 'label', 'end'));
    drawMatrix(sceneEl, 632, 248, 2, 1, s.bwd.dW2 ? dW2 : null, 'bwd-cell', 'bwd-text', dw2Hl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(649, 311, '(2×1)', 'shape'));
    sceneEl.appendChild(txt(720, 266, 'dc =', 'label', 'end'));
    drawScalar(sceneEl, 730, 251, s.bwd.dW2 ? dc : null, 'bwd-cell', 'bwd-text', dw2Hl ? 'bwd' : null, 3);

    const duHl = s.active === 'dU';
    sceneEl.appendChild(txt(580, 355, 'dU = (dŷW₂ᵀ) ⊙ ReLU′(U)', duHl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(622, 383, 'dU =', 'label', 'end'));
    drawMatrix(sceneEl, 632, 365, 3, 2, s.bwd.dU ? dU : null, 'bwd-cell', 'bwd-text', duHl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(666, 453, '(3×2)', 'shape'));

    const dw1Hl = s.active === 'dW1';
    sceneEl.appendChild(txt(580, 487, 'dW₁ = XᵀdU,  db₁ = Σ rows', dw1Hl ? 'formula-active' : 'formula', 'start'));
    sceneEl.appendChild(txt(622, 515, 'dW₁ =', 'label', 'end'));
    drawMatrix(sceneEl, 632, 497, 2, 2, s.bwd.dW1 ? dW1 : null, 'bwd-cell', 'bwd-text', dw1Hl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(666, 560, '(2×2)', 'shape'));
    sceneEl.appendChild(txt(778, 515, 'db₁ =', 'label', 'end'));
    drawMatrix(sceneEl, 790, 497, 1, 2, s.bwd.dW1 ? db1 : null, 'bwd-cell', 'bwd-text', dw1Hl ? 'bwd' : null, 3);

    if (s.bwd.upd) {
      sceneEl.appendChild(txt(580, 579, '↳ дальше: W₁,b₁,W₂,c ← параметры − η·градиенты', 'formula-active', 'start'));
    }

    sceneEl.appendChild(rect(40, 605, 880, 85, 'desc-bg'));
    let dy = 626;
    for (const line of s.desc) {
      sceneEl.appendChild(txt(56, dy, line, 'desc-text', 'start'));
      dy += 19;
    }

    navEl.appendChild(txt(50, 735, `${i + 1} из ${steps.length}`, 'counter', 'start'));
    if (i > 0) {
      const prev = el('g', { class: 'nav-btn nav-prev' });
      prev.appendChild(rect(720, 712, 60, 36, ''));
      prev.appendChild(txt(750, 737, '←', '', 'middle'));
      prev.addEventListener('click', () => { i--; render(); });
      navEl.appendChild(prev);
    }
    const last = i === steps.length - 1;
    const next = el('g', { class: 'nav-btn' });
    next.appendChild(rect(790, 712, last ? 60 : 110, 36, ''));
    next.appendChild(txt(last ? 820 : 845, 736, last ? '↻' : 'Далее', '', 'middle'));
    next.addEventListener('click', () => { i = last ? 0 : i + 1; render(); });
    navEl.appendChild(next);
  }

  const rootEl = document.getElementById('mlpMat');
  if (rootEl) {
    rootEl.tabIndex = 0;
    rootEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && i < steps.length - 1) { i++; render(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' && i > 0) { i--; render(); e.preventDefault(); }
    });
  }

  render();
})();
</script>

> **Проверка форм — лучший способ не запутаться.** Если `W₁` имеет форму `2×2`, то `∂L/∂W₁` тоже должен быть `2×2`. Если `W₂` имеет форму `2×1`, то `∂L/∂W₂` тоже `2×1`. В матричном backprop почти все ошибки находятся именно через несовпадение размерностей.

---

## Часть 5. От таблицы к PyTorch — три версии одного и того же

Матричный расчёт мы прошли по шагам. Теперь соберём ту же сеть в код — тремя способами: руками на numpy, слоями-объектами и на PyTorch. Все три считают *одни и те же* градиенты (те, что были в визуализации выше) и одинаково обучаются. Разница лишь в том, сколько математики мы пишем сами.

### Данные: та же маленькая сеть 2 → 2 → 1

Берём ровно тот пример из матричной части, чтобы каждое число можно было сверить: три объекта, два признака, цель — регрессия. В реальных проектах данные читают из файла (путь список → pandas → numpy ровно тот же, что в прошлой статье); здесь впишем их прямо в код.

```python
import numpy as np
# 3 объекта, 2 признака; цель y — непрерывное число (регрессия)
X = np.array([[2., 3.],
              [1., 2.],
              [3., 1.]])           # (3, 2)
y = np.array([[5.], [3.], [6.]])   # (3, 1)
# Параметры сети — как в визуализации выше
W1 = np.array([[0.5, -0.3], [0.2, 0.4]])   # (2, 2): вход -> 2 скрытых нейрона
b1 = np.array([[0.1, 0.2]])                 # (1, 2)
W2 = np.array([[1.0], [-0.5]])              # (2, 1): скрытый слой -> выход
c  = np.array([[0.3]])                      # (1, 1)
```

### Версия 1. Просто функции на numpy

«Голая» математика из Частей 3–4: forward прогоняет вход через линейный слой, ReLU и выходной слой; loss — это MSE (с множителем ½ для чистого градиента); backward — то самое цепное правило справа налево. Каждый параметр обновляется одним и тем же правилом.

```python
def relu(z):
    return np.maximum(0.0, z)

def forward(X, W1, b1, W2, c):           # FORWARD: x -> скрытый слой -> выход
    U = X @ W1 + b1                      # значения до активации
    H = relu(U)                          # скрытое представление (нелинейность)
    yhat = H @ W2 + c                    # выходной слой (линейный)
    return U, H, yhat

def mse(yhat, y):                        # LOSS: ½ · среднее((ŷ − y)²)
    return 0.5 * np.mean((yhat - y) ** 2)

# Тот самый цикл: forward -> loss -> backward -> update
lr = 0.02
for epoch in range(2000):
    U, H, yhat = forward(X, W1, b1, W2, c)
    # BACKWARD: цепное правило, справа налево
    dyhat = (yhat - y) / len(y)          # ∂L/∂ŷ
    dW2 = H.T @ dyhat                    # ∂L/∂W₂
    dc  = dyhat.sum(0, keepdims=True)    # ∂L/∂c
    dU  = (dyhat @ W2.T) * (U > 0)       # назад через W₂ и ReLU′
    dW1 = X.T @ dU                       # ∂L/∂W₁
    db1 = dU.sum(0, keepdims=True)       # ∂L/∂b₁
    # UPDATE: шаг против градиента для каждого параметра
    W1 -= lr * dW1; b1 -= lr * db1
    W2 -= lr * dW2; c  -= lr * dc

_, _, yhat = forward(X, W1, b1, W2, c)
print(f"loss: {mse(yhat, y):.4f}")       # ≈ 0.0000 — сеть выучила 3 точки
print(yhat.ravel())                      # ≈ [5. 3. 6.] = y
```

> **Проверка форм — лучший друг.** На самой первой итерации (с весами из таблицы выше) этот код считает `loss = 5.162` и градиенты `dW₁ ≈ [[−6.85, 1.48], [−6.07, 2.38]]`, `dW₂ ≈ [−4.95, −1.39]` — ровно те числа, что в матричной визуализации. Форма каждого градиента совпадает с формой его параметра: `dW₁` как `W₁` (2×2), `dW₂` как `W₂` (2×1). Не сходятся формы — значит, где-то ошибка в backprop.

### Версия 2. Тот же код, но слоями (мостик к PyTorch)

Математика не меняется — но теперь каждый слой это объект, который умеет `forward` (и запоминает вход) и `backward` (отдаёт градиенты по своим весам и проталкивает градиент дальше назад). Ровно так устроен PyTorch: сеть — это последовательность слоёв, а обучающий цикл снаружи.

```python
class Linear:                            # линейный слой: out = X·W + b
    def __init__(self, n_in, n_out):
        self.W = np.random.randn(n_in, n_out) * 0.1
        self.b = np.zeros((1, n_out))
    def forward(self, X):
        self.X = X                       # запомнили вход для backward
        return X @ self.W + self.b
    def backward(self, grad):            # grad = ∂L/∂(выход слоя)
        self.dW = self.X.T @ grad        # ∂L/∂W
        self.db = grad.sum(0, keepdims=True)
        return grad @ self.W.T           # ∂L/∂(вход) — толкаем дальше назад
    def step(self, lr):
        self.W -= lr * self.dW
        self.b -= lr * self.db

class ReLU:                              # слой-активация
    def forward(self, X):
        self.mask = (X > 0)
        return X * self.mask
    def backward(self, grad):
        return grad * self.mask          # ReLU′: пропускаем, где вход был > 0

# Сеть = список слоёв 2 -> 2 -> 1
net = [Linear(2, 2), ReLU(), Linear(2, 1)]
for epoch in range(2000):
    out = X                              # FORWARD по слоям
    for layer in net:
        out = layer.forward(out)
    grad = (out - y) / len(y)            # ∂L/∂ŷ для ½·MSE
    for layer in reversed(net):          # BACKWARD в обратном порядке
        grad = layer.backward(grad)
    for layer in net:                    # UPDATE
        if isinstance(layer, Linear):
            layer.step(0.02)
```

### Версия 3. PyTorch — backward в одну строку

Цикл буквально тот же: forward → loss → backward → update. Но градиенты больше не выводим руками — весь блок backward сворачивается в `loss.backward()`: autograd сам проходит по всем слоям. Здесь это экономит десяток строк; в настоящей сети с миллионами весов — делает обучение вообще возможным.

```python
import torch
import torch.nn as nn

Xt = torch.tensor([[2., 3.], [1., 2.], [3., 1.]])
yt = torch.tensor([[5.], [3.], [6.]])

# MODEL: те же 2 -> 2 -> 1, ReLU между слоями
net = nn.Sequential(
    nn.Linear(2, 2),
    nn.ReLU(),
    nn.Linear(2, 1),
)
optimizer = torch.optim.SGD(net.parameters(), lr=0.02)

for epoch in range(2000):
    optimizer.zero_grad()                # обнуляем градиенты прошлого шага
    yhat = net(Xt)                       # FORWARD: через все слои
    loss = 0.5 * ((yhat - yt) ** 2).mean()   # LOSS: ½·MSE
    loss.backward()                      # BACKWARD: ВСЕ градиенты автоматически
    optimizer.step()                     # UPDATE: θ ← θ − η·∂L/∂θ

print(round(loss.item(), 4))             # ≈ 0.0
```

Все три версии обучают одну и ту же сеть и приходят к одному результату: на нашем игрушечном примере loss падает с 5.16 почти до нуля, и сеть точно воспроизводит ответы `y = [5, 3, 6]`. Разница только в количестве ручной математики — на numpy мы сами вывели каждый градиент; в версии со слоями завернули их в объекты; в PyTorch описываем только *что* считаем (слои и loss), а *как* брать производные, autograd берёт на себя. Для бинарной классификации достаточно поменять выходной слой на sigmoid и loss на BCE, для многоклассовой — на softmax и cross-entropy; схема backprop и сам цикл при этом не меняются.

---

## Часть 6. Та же логика — для любой модели

Мы собрали MLP из кирпичей, прошли forward и backward по числам и записали обучение кодом. Осталось увидеть всё это как единый цикл — и понять, почему он не заканчивается на MLP. Линейная регрессия, логистическая регрессия и нейросеть отличаются архитектурой и функцией потерь, но обучаются одинаково: forward → loss → backward → update, повторённый много раз.

Нажми «Далее» и пройди цикл обучения сети по шагам — от одной итерации до перехода к глубоким сетям:

<figure class="embedded-interactive" id="section-interactive-8">
  <div class="interactive-meta">Интерактив 8</div>
  <p class="interactive-desc">Цикл обучения полносвязной нейросети</p>
<div class="interactive-svg-wrap">
<svg id="trainingLoopMLP" viewBox="0 0 960 680" width="100%" role="img" aria-label="Цикл обучения полносвязной нейросети">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .text { font-size: 16px; fill: #111111; }
    svg .small { font-size: 13px; fill: #5E5850; }
    svg .label { font-size: 13px; fill: #111111; }
    svg .mono { font-family: 'Courier New', Courier, monospace; }
    svg .axis { stroke: #5E5850; stroke-width: 1.2; }
    svg .grid { stroke: #ECECEC; stroke-width: 1; }

    svg .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    svg .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    svg .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    svg .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }

    svg .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                                 text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                           text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <text id="tlmlp-title" x="36" y="48" class="title"></text>
  <text id="tlmlp-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="tlmlp-scene"></g>

  <text id="tlmlp-counter" x="36" y="635" class="text"></text>

  <g id="tlmlp-prevGroup">
    <rect id="tlmlp-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="tlmlp-nextGroup">
    <rect id="tlmlp-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="tlmlp-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      const arrowDefs = `
        <defs>
          <marker id="tlmlp-ar-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#3576C0"/>
          </marker>
          <marker id="tlmlp-ar-yellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C29E08"/>
          </marker>
          <marker id="tlmlp-ar-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/>
          </marker>
          <marker id="tlmlp-ar-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#5E5850"/>
          </marker>
        </defs>
      `;

      // --- кривая loss: старт 5.16 → почти 0 (наш пример 2→2→1, MSE) ---
      function lossCurve() {
        const X0 = 510, X1 = 905, Y0 = 540, Y1 = 205;
        const LMAX = 5.4;
        const xpx = (i) => X0 + i / 80 * (X1 - X0);
        const ypx = (l) => Y0 - Math.min(l, LMAX) / LMAX * (Y0 - Y1);
        let s = '';
        [0, 20, 40, 60, 80].forEach(i => {
          const xp = xpx(i);
          s += `<line x1="${xp}" y1="${Y1}" x2="${xp}" y2="${Y0}" class="grid"/>`;
          s += `<text x="${xp}" y="${Y0+18}" text-anchor="middle" class="small">${i}</text>`;
        });
        [0, 1, 2, 3, 4, 5].forEach(l => {
          const yp = ypx(l);
          s += `<line x1="${X0}" y1="${yp}" x2="${X1}" y2="${yp}" class="grid"/>`;
          s += `<text x="${X0-8}" y="${yp+4}" text-anchor="end" class="small">${l}</text>`;
        });
        s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s += `<text x="${(X0+X1)/2}" y="${Y0+40}" text-anchor="middle" class="label" style="font-weight:700;">эпохи обучения</text>`;
        s += `<text x="${X0-30}" y="${Y1-12}" class="label" style="font-weight:700;fill:#C30B0A;">Loss</text>`;
        let path = '';
        for (let i = 0; i <= 80; i += 0.5) {
          const L = 5.16 * Math.exp(-i / 11);
          path += (path === '' ? 'M' : 'L') + ' ' + xpx(i).toFixed(1) + ' ' + ypx(L).toFixed(1) + ' ';
        }
        s += `<path d="${path}" fill="none" stroke="#C30B0A" stroke-width="2.6"/>`;
        const pts = [
          {i: 0,  L: 5.16, t: 'старт 5.16', c: '#C30B0A', a: 'start'},
          {i: 80, L: 0.01, t: 'обучено ≈0', c: '#73B222', a: 'end'}
        ];
        pts.forEach(p => {
          s += `<circle cx="${xpx(p.i)}" cy="${ypx(p.L)}" r="6" fill="${p.c}" stroke="#fff" stroke-width="2"/>`;
          s += `<text x="${xpx(p.i) + (p.a==='start'?10:-10)}" y="${ypx(p.L)-12}" text-anchor="${p.a}" class="small" style="font-weight:700;fill:${p.c};">${p.t}</text>`;
        });
        return s;
      }

      // --- что выучивает сеть: кривая там, где прямая «не пролезает» (иллюстрация) ---
      const CX0 = 510, CX1 = 905, CY0 = 540, CY1 = 210, cxMax = 10, cyMax = 10;
      const cx = (x) => CX0 + x / cxMax * (CX1 - CX0);
      const cy = (y) => CY0 - y / cyMax * (CY0 - CY1);
      const truth = (x) => 5 + 3.2 * Math.sin(x / 1.5 - 0.6);   // изогнутая зависимость
      const dataX = [0.4,1.3,2.1,3.0,3.8,4.7,5.6,6.4,7.3,8.2,9.1,9.7];
      function curveFit() {
        let s = '';
        for (let g = 0; g <= cxMax; g += 2) {
          s += `<line x1="${cx(g)}" y1="${cy(0)}" x2="${cx(g)}" y2="${cy(cyMax)}" class="grid"/>`;
        }
        for (let g = 0; g <= cyMax; g += 2) {
          s += `<line x1="${cx(0)}" y1="${cy(g)}" x2="${cx(cxMax)}" y2="${cy(g)}" class="grid"/>`;
        }
        s += `<line x1="${cx(0)}" y1="${cy(0)}" x2="${cx(cxMax)}" y2="${cy(0)}" class="axis"/>`;
        s += `<line x1="${cx(0)}" y1="${cy(0)}" x2="${cx(0)}" y2="${cy(cyMax)}" class="axis"/>`;
        s += `<text x="${(cx(0)+cx(cxMax))/2}" y="${cy(0)+34}" text-anchor="middle" class="label">x</text>`;
        s += `<text x="${cx(0)-22}" y="${cy(cyMax)-4}" class="label">y</text>`;
        // прямая (линрегрессия) — не справляется
        s += `<line x1="${cx(0)}" y1="${cy(truth(0)+0.3)}" x2="${cx(10)}" y2="${cy(truth(10)-1.2)}" stroke="#5E5850" stroke-width="2" stroke-dasharray="6 4"/>`;
        s += `<text x="${cx(7.2)}" y="${cy(truth(7.2)+2.4)}" class="small" style="fill:#5E5850;font-weight:700;">прямая — мимо</text>`;
        // кривая MLP — проходит через точки
        let path = '';
        for (let x = 0; x <= 10; x += 0.2) {
          path += (path === '' ? 'M' : 'L') + ' ' + cx(x).toFixed(1) + ' ' + cy(truth(x)).toFixed(1) + ' ';
        }
        s += `<path d="${path}" fill="none" stroke="#73B222" stroke-width="3"/>`;
        s += `<text x="${cx(2.0)}" y="${cy(truth(2.0)+2.0)}" class="small" style="fill:#73B222;font-weight:700;">MLP — по кривой</text>`;
        // точки данных
        dataX.forEach(x => {
          const yy = truth(x) + (Math.sin(x * 7.3) * 0.25);
          s += `<circle cx="${cx(x)}" cy="${cy(yy)}" r="5.5" fill="#3576C0" stroke="#fff" stroke-width="1.5"/>`;
        });
        return s;
      }

      // ============================= STEP 1 =============================
      const scene1 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Один цикл — четыре шага</text>
          <text x="60" y="190" class="text">Обучение нейросети — это</text>
          <text x="60" y="212" class="text">повторение одного цикла:</text>
          <text x="78" y="246" class="text"><tspan style="font-weight:700;fill:#C29E08;">forward</tspan> — гоним x через все слои → ŷ</text>
          <text x="78" y="270" class="text"><tspan style="font-weight:700;fill:#C30B0A;">loss</tspan> — насколько ошиблись</text>
          <text x="78" y="294" class="text"><tspan style="font-weight:700;fill:#C30B0A;">backward</tspan> — backprop: градиент по всем весам</text>
          <text x="78" y="318" class="text"><tspan style="font-weight:700;fill:#73B222;">update</tspan> — шаг против градиента</text>
          <text x="60" y="356" class="text">Тот же цикл из линейной</text>
          <text x="60" y="378" class="text">регрессии — но параметров</text>
          <text x="60" y="400" class="text">теперь не два, а тысячи.</text>
          <rect x="60" y="424" width="352" height="60" class="box-blue"/>
          <text x="236" y="452" text-anchor="middle" class="text mono" style="font-weight:700;">θ ← θ − η · ∂L/∂θ</text>
          <text x="236" y="473" text-anchor="middle" class="small">одно правило для всех весов сети</text>
        </g>
        <g>
          <rect x="600" y="148" width="244" height="62" class="box-yellow"/>
          <text x="722" y="174" text-anchor="middle" class="text" style="font-weight:700;fill:#C29E08;">FORWARD</text>
          <text x="722" y="196" text-anchor="middle" class="small mono">ŷ = f₃(f₂(f₁(x)))</text>

          <rect x="600" y="242" width="244" height="62" class="box-red"/>
          <text x="722" y="268" text-anchor="middle" class="text" style="font-weight:700;fill:#C30B0A;">LOSS</text>
          <text x="722" y="290" text-anchor="middle" class="small mono">MSE / BCE / CE → одно число</text>

          <rect x="600" y="336" width="244" height="62" class="box-red"/>
          <text x="722" y="362" text-anchor="middle" class="text" style="font-weight:700;fill:#C30B0A;">BACKWARD</text>
          <text x="722" y="384" text-anchor="middle" class="small mono">∂L/∂θ для всех слоёв сразу</text>

          <rect x="600" y="430" width="244" height="62" class="box-green"/>
          <text x="722" y="456" text-anchor="middle" class="text" style="font-weight:700;fill:#73B222;">UPDATE</text>
          <text x="722" y="478" text-anchor="middle" class="small mono">θ ← θ − η·∂L/∂θ</text>

          <line x1="722" y1="210" x2="722" y2="240" stroke="#5E5850" stroke-width="2" marker-end="url(#tlmlp-ar-gray)"/>
          <line x1="722" y1="304" x2="722" y2="334" stroke="#5E5850" stroke-width="2" marker-end="url(#tlmlp-ar-gray)"/>
          <line x1="722" y1="398" x2="722" y2="428" stroke="#5E5850" stroke-width="2" marker-end="url(#tlmlp-ar-gray)"/>

          <path d="M 846 461 C 916 461 916 179 848 179" fill="none" stroke="#3576C0" stroke-width="2.2" marker-end="url(#tlmlp-ar-blue)"/>
          <text x="909" y="320" text-anchor="middle" class="small" style="fill:#3576C0;font-weight:700;" transform="rotate(90 909 320)">повторяем тысячи раз</text>
        </g>
      `;

      // ============================= STEP 2 =============================
      const scene2 = `
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Повторяем — тысячи раз</text>
          <text x="60" y="192" class="text">Один проход цикла почти</text>
          <text x="60" y="214" class="text">ничего не меняет. Но мы</text>
          <text x="60" y="236" class="text">повторяем его снова и снова.</text>
          <rect x="60" y="258" width="352" height="92" class="box-blue"/>
          <text x="78" y="284" class="small">• один объект → <tspan style="font-weight:700;">step</tspan></text>
          <text x="78" y="308" class="small">• пачка объектов → <tspan style="font-weight:700;">batch</tspan></text>
          <text x="78" y="332" class="small">• весь датасет 1 раз → <tspan style="font-weight:700;">epoch</tspan></text>
          <text x="60" y="386" class="text" style="font-weight:700;fill:#73B222;">Loss падает с каждой</text>
          <text x="60" y="408" class="text" style="font-weight:700;fill:#73B222;">эпохой — сеть учится.</text>
          <text x="60" y="448" class="small">На нашем примере (3 точки,</text>
          <text x="60" y="466" class="small">сеть 2→2→1) loss падает</text>
          <text x="60" y="484" class="small">с 5.16 почти до 0 за пару</text>
          <text x="60" y="502" class="small">десятков эпох.</text>
        </g>
        <g>${lossCurve()}</g>
      `;

      // ============================= STEP 3 =============================
      const scene3 = `
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Обученная сеть выучивает кривую</text>
          <text x="60" y="192" class="text">С чего начали: прямая «не</text>
          <text x="60" y="214" class="text">пролезает» сквозь изогнутую</text>
          <text x="60" y="236" class="text">зависимость.</text>
          <text x="60" y="272" class="text">Скрытые слои с активацией</text>
          <text x="60" y="294" class="text">дают сети гибкость — она</text>
          <text x="60" y="316" class="text">приближает кривую, а не прямую.</text>
          <rect x="60" y="336" width="352" height="64" class="box-green"/>
          <text x="236" y="362" text-anchor="middle" class="small" style="font-weight:700;fill:#73B222;">Universal Approximation Theorem</text>
          <text x="236" y="384" text-anchor="middle" class="small">достаточно широкая сеть приближает</text>
          <text x="236" y="400" text-anchor="middle" class="small">любую непрерывную функцию</text>
          <text x="60" y="440" class="text" style="font-weight:700;fill:#73B222;">Это и было целью: модель,</text>
          <text x="60" y="462" class="text" style="font-weight:700;fill:#73B222;">которой прямая не ограничена.</text>
          <text x="60" y="498" class="small">(данные — упрощённый пример)</text>
        </g>
        <g>${curveFit()}</g>
      `;

      // ============================= STEP 4 =============================
      const scene4 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Та же анатомия — у любой модели</text>
          <text x="60" y="192" class="text">Обучение устроено из одних</text>
          <text x="60" y="214" class="text">и тех же блоков:</text>
          <text x="78" y="246" class="text"><tspan style="font-weight:700;fill:#3576C0;">Task</tspan> — что предсказываем</text>
          <text x="78" y="268" class="text"><tspan style="font-weight:700;fill:#3576C0;">Data</tspan> — примеры (x, y)</text>
          <text x="78" y="290" class="text"><tspan style="font-weight:700;fill:#3576C0;">Model</tspan> — стек слоёв x → ŷ</text>
          <text x="78" y="312" class="text"><tspan style="font-weight:700;fill:#C30B0A;">Loss</tspan> — насколько ошибается</text>
          <text x="60" y="350" class="text">Тип задачи задаёт Loss:</text>
          <text x="60" y="372" class="text">регрессия → MSE, классифи-</text>
          <text x="60" y="394" class="text">кация → BCE / cross-entropy.</text>
          <rect x="60" y="414" width="352" height="86" class="box-green"/>
          <text x="236" y="442" text-anchor="middle" class="text" style="font-weight:700;fill:#73B222;">Линейная регрессия, логрегрессия,</text>
          <text x="236" y="464" text-anchor="middle" class="small">MLP — это один и тот же каркас</text>
          <text x="236" y="482" text-anchor="middle" class="small">разной сложности.</text>
        </g>
        <g>
          <rect x="600" y="150" width="244" height="62" class="box-blue"/>
          <text x="722" y="178" text-anchor="middle" class="text" style="font-weight:800;fill:#3576C0;">Task</text>
          <text x="722" y="199" text-anchor="middle" class="small">задаёт вид Loss</text>

          <rect x="784" y="278" width="138" height="120" class="box-blue"/>
          <text x="853" y="308" text-anchor="middle" class="text" style="font-weight:800;fill:#3576C0;">Data</text>
          <text x="853" y="334" text-anchor="middle" class="small">(x, y)</text>
          <text x="853" y="356" text-anchor="middle" class="small">пары вход-</text>
          <text x="853" y="374" text-anchor="middle" class="small">истина</text>

          <rect x="560" y="278" width="200" height="120" class="box-red"/>
          <text x="660" y="308" text-anchor="middle" class="text" style="font-weight:800;fill:#C30B0A;">Loss</text>
          <text x="660" y="334" text-anchor="middle" class="small">«насколько</text>
          <text x="660" y="352" text-anchor="middle" class="small">ошиблись»</text>
          <text x="660" y="382" text-anchor="middle" class="small mono" style="fill:#C30B0A;">→ одно число</text>

          <rect x="600" y="462" width="244" height="62" class="box-blue"/>
          <text x="722" y="490" text-anchor="middle" class="text" style="font-weight:800;fill:#3576C0;">Model</text>
          <text x="722" y="511" text-anchor="middle" class="small">стек слоёв: x → ŷ</text>

          <line x1="722" y1="212" x2="722" y2="276" stroke="#3576C0" stroke-width="2" marker-end="url(#tlmlp-ar-blue)"/>
          <line x1="782" y1="338" x2="762" y2="338" stroke="#3576C0" stroke-width="2" marker-end="url(#tlmlp-ar-blue)"/>
          <line x1="702" y1="460" x2="664" y2="400" stroke="#C29E08" stroke-width="2" marker-end="url(#tlmlp-ar-yellow)"/>
          <line x1="660" y1="400" x2="700" y2="458" stroke="#C30B0A" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#tlmlp-ar-red)"/>
          <text x="610" y="438" class="small" style="fill:#C29E08;font-weight:700;">ŷ</text>
          <text x="690" y="440" class="small" style="fill:#C30B0A;font-weight:700;">градиенты</text>
        </g>
      `;

      // ============================= STEP 5 =============================
      const scene5 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">От MLP к глубокому обучению</text>
          <text x="60" y="192" class="text">MLP — это базовый каркас.</text>
          <text x="60" y="214" class="text">Добавь слои, смени тип</text>
          <text x="60" y="236" class="text">слоёв (свёртки, attention) —</text>
          <text x="60" y="258" class="text">получишь CNN, трансформер.</text>
          <text x="60" y="298" class="text" style="font-weight:700;">Цикл обучения не меняется:</text>
          <text x="60" y="320" class="text" style="font-weight:700;fill:#73B222;">forward → loss → backward → update.</text>
          <text x="60" y="358" class="text" style="font-weight:700;">Выходной слой — под задачу:</text>
          <rect x="60" y="374" width="352" height="78" class="box-green"/>
          <text x="78" y="398" class="small"><tspan style="font-weight:700;fill:#3576C0;">регрессия</tspan> → линейный выход + MSE</text>
          <text x="78" y="418" class="small"><tspan style="font-weight:700;fill:#73B222;">2 класса</tspan> → sigmoid + BCE</text>
          <text x="78" y="438" class="small"><tspan style="font-weight:700;fill:#C29E08;">K классов</tspan> → softmax + cross-entropy</text>
          <text x="60" y="482" class="small">Меняются архитектура и Loss —</text>
          <text x="60" y="500" class="small">цикл и backprop остаются теми же.</text>
        </g>
        <g>
          <text x="710" y="150" text-anchor="middle" class="small" style="font-weight:700;">глубже = больше слоёв</text>

          <rect x="560" y="170" width="300" height="50" class="box-blue"/>
          <text x="710" y="200" text-anchor="middle" class="text" style="fill:#3576C0;font-weight:700;">вход x</text>

          <rect x="560" y="242" width="300" height="50" class="box-yellow"/>
          <text x="710" y="272" text-anchor="middle" class="text" style="fill:#C29E08;font-weight:700;">скрытый слой + активация</text>

          <rect x="560" y="314" width="300" height="50" class="box-yellow"/>
          <text x="710" y="344" text-anchor="middle" class="text" style="fill:#C29E08;font-weight:700;">скрытый слой + активация</text>

          <rect x="560" y="386" width="300" height="50" class="box-yellow"/>
          <text x="710" y="416" text-anchor="middle" class="small" style="fill:#C29E08;font-weight:700;">… ещё слои …</text>

          <rect x="560" y="458" width="300" height="58" class="box-green"/>
          <text x="710" y="483" text-anchor="middle" class="text" style="fill:#73B222;font-weight:700;">выходной слой</text>
          <text x="710" y="504" text-anchor="middle" class="small">под задачу: MSE / BCE / CE</text>

          <line x1="710" y1="220" x2="710" y2="240" stroke="#5E5850" stroke-width="2" marker-end="url(#tlmlp-ar-gray)"/>
          <line x1="710" y1="292" x2="710" y2="312" stroke="#5E5850" stroke-width="2" marker-end="url(#tlmlp-ar-gray)"/>
          <line x1="710" y1="364" x2="710" y2="384" stroke="#5E5850" stroke-width="2" marker-end="url(#tlmlp-ar-gray)"/>
          <line x1="710" y1="436" x2="710" y2="456" stroke="#5E5850" stroke-width="2" marker-end="url(#tlmlp-ar-gray)"/>
        </g>
      `;

      const steps = [
        { title: "Шаг 1. Цикл обучения: четыре шага",
          subtitle: "forward → loss → backward → update — одна петля для всей сети",
          scene: scene1 },
        { title: "Шаг 2. Повторяем — тысячи раз",
          subtitle: "Loss падает с каждой эпохой — сеть учится",
          scene: scene2 },
        { title: "Шаг 3. Обученная сеть выучивает кривую",
          subtitle: "То, на что прямая не способна — нелинейная зависимость",
          scene: scene3 },
        { title: "Шаг 4. Анатомия обучения",
          subtitle: "Task — Data — Model — Loss: один каркас для любой ML-модели",
          scene: scene4 },
        { title: "Шаг 5. От MLP к глубокому обучению",
          subtitle: "Добавь слои — цикл обучения остаётся тем же",
          scene: scene5 }
      ];

      let currentStep = 0;
      function renderStep() {
        const step = steps[currentStep];
        $("tlmlp-title").textContent = step.title;
        $("tlmlp-subtitle").textContent = step.subtitle;
        $("tlmlp-counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("tlmlp-scene").innerHTML = step.scene;
        $("tlmlp-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("tlmlp-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
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
      $("tlmlp-nextBtn").addEventListener("click", nextStep);
      $("tlmlp-prevBtn").addEventListener("click", prevStep);
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

> **Главная мысль:** правило `θ ← θ − η · ∂L/∂θ` — то же самое, что мы видели для линейной и логистической регрессии. Просто теперь параметров не два, а тысячи, и градиент по каждому из них считает backpropagation за один обратный проход. Это и есть фундамент глубокого обучения: меняются слои и loss, но цикл остаётся тем же.

---

## Что важно вынести

1. **MLP — это не магия, а стек простых блоков:** линейное преобразование, bias, активация.
2. **Активация нужна принципиально:** без неё несколько линейных слоёв схлопываются в один линейный слой.
3. **Скрытый слой учит новое представление:** он не просто «считает ответ», а переводит данные в пространство, где задачу проще решить.
4. **Backprop — это цепное правило:** градиент идёт справа налево и показывает, как каждый параметр влияет на loss.
5. **Матричная форма — это тот же расчёт, только сразу для батча:** поэтому в коде обучение выглядит как несколько умножений матриц.

Если линейная регрессия — это одна прямая, а логистическая регрессия — один sigmoid-нейрон, то MLP — это много таких преобразований, собранных в цепочку. Главное не теряется: модель делает forward, считает loss, получает градиенты через backward и обновляет параметры.

<script>
/* Сцена: один постоянный SVG плюс шаги, описанные текстом.
   Скрипт ничего не перерисовывает — он только переключает классы подсветки. */
(function () {
  document.querySelectorAll('.stage').forEach(function (stage) {
    var svg      = stage.querySelector('.stage-figure svg');
    var panels   = Array.prototype.slice.call(stage.querySelectorAll('.step-panel'));
    var groups   = Array.prototype.slice.call(svg.querySelectorAll('[data-key]'));
    var prev     = stage.querySelector('[data-nav="prev"]');
    var next     = stage.querySelector('[data-nav="next"]');
    var counter  = stage.querySelector('.stage-counter');
    var progress = stage.querySelector('.stage-progress');
    var total    = panels.length;
    var cur      = 0;

    panels.forEach(function () { progress.appendChild(document.createElement('i')); });
    var ticks = Array.prototype.slice.call(progress.querySelectorAll('i'));

    function render() {
      var panel = panels[cur];
      var on    = (panel.getAttribute('data-on')    || '').split(/\s+/).filter(Boolean);
      var focus = (panel.getAttribute('data-focus') || '').split(/\s+/).filter(Boolean);

      groups.forEach(function (g) {
        var key    = g.getAttribute('data-key');
        var active = on.indexOf(key) !== -1;
        var only   = g.hasAttribute('data-only');
        g.classList.toggle('is-hidden', only && !active);
        g.classList.toggle('is-dim',    !active && !only);
        g.classList.toggle('is-focus',  focus.indexOf(key) !== -1);
      });

      panels.forEach(function (p, i) { p.classList.toggle('active', i === cur); });
      ticks.forEach(function (t, i)  { t.classList.toggle('done',   i <= cur); });

      counter.textContent = (cur + 1) + ' из ' + total;
      prev.disabled = cur === 0;
      next.disabled = false;
      next.textContent = cur === total - 1 ? 'Повторить ↻' : 'Далее →';
    }

    function go(delta) {
      var target = cur + delta;
      if (target < 0) return;
      if (target >= total) target = 0;
      cur = target;
      render();
    }

    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(1);  e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { go(-1); e.preventDefault(); }
    });

    render();
  });
})();
</script>
