Есть три способа добавлять интерактивные визуализации в статьи. Каждый показан ниже на живых примерах.

## 1. Чистый SVG с CSS-анимацией

Самый простой случай: SVG с `<animate>` или CSS-переходами. Работает мгновенно, без JavaScript.

<figure class="demo">
<svg viewBox="0 0 400 160" width="100%" style="max-width:500px">
  <defs>
    <linearGradient id="curve-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#D97706" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#D97706" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <path d="M 20 130 Q 200 -20, 380 130" stroke="#D97706" stroke-width="2" fill="none"/>
  <path d="M 20 130 Q 200 -20, 380 130 L 380 130 L 20 130 Z" fill="url(#curve-grad)" opacity="0.3"/>
  <circle r="8" fill="#D97706">
    <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
      <mpath href="#track"/>
    </animateMotion>
  </circle>
  <path id="track" d="M 20 130 Q 200 -20, 380 130" fill="none" stroke="none"/>
</svg>
<figcaption>Шарик движется по траектории — чистый SMIL, без JS.</figcaption>
</figure>

## 2. Интерактивный SVG с обработчиками

Когда нужно реагировать на наведение, клики или ползунки. Скрипт пишется прямо в markdown — рендерер автоматически активирует его.

<figure class="demo">
<svg id="sigmoid-demo" viewBox="0 0 400 200" width="100%" style="max-width:500px">
  <line x1="20" y1="100" x2="380" y2="100" stroke="#888" stroke-width="1"/>
  <line x1="200" y1="10" x2="200" y2="190" stroke="#888" stroke-width="1"/>
  <path id="sigmoid-path" stroke="#6366F1" stroke-width="2.5" fill="none"/>
  <circle id="sigmoid-dot" r="6" fill="#6366F1"/>
  <text id="sigmoid-label" x="20" y="25" font-family="monospace" font-size="13" fill="#1A1A23"></text>
</svg>
<div class="demo-controls">
  <label>x: <span id="sigmoid-x">0.0</span></label>
  <input type="range" id="sigmoid-slider" min="-6" max="6" step="0.1" value="0">
</div>
<figcaption>Подвигай ползунок — увидишь, как сигмоида сжимает x в (0, 1).</figcaption>
</figure>

<script>
(function() {
  const svg = document.getElementById("sigmoid-demo");
  if (!svg) return;
  const path = document.getElementById("sigmoid-path");
  const dot = document.getElementById("sigmoid-dot");
  const label = document.getElementById("sigmoid-label");
  const slider = document.getElementById("sigmoid-slider");
  const xText = document.getElementById("sigmoid-x");

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  const toSvgX = (x) => 200 + x * 30;
  const toSvgY = (y) => 190 - y * 180;

  // Draw curve once
  let d = "";
  for (let i = -200; i <= 200; i += 2) {
    const x = i / 30;
    const y = sigmoid(x);
    d += (i === -200 ? "M " : " L ") + toSvgX(x) + " " + toSvgY(y);
  }
  path.setAttribute("d", d);

  function update() {
    const x = parseFloat(slider.value);
    const y = sigmoid(x);
    dot.setAttribute("cx", toSvgX(x));
    dot.setAttribute("cy", toSvgY(y));
    label.textContent = "σ(" + x.toFixed(1) + ") = " + y.toFixed(3);
    xText.textContent = x.toFixed(1);
  }
  slider.addEventListener("input", update);
  update();
})();
</script>

Что важно: я обернул код в `(function() { ... })()`, чтобы переменные не утекли в глобальную область. Если у тебя несколько демо на одной странице, это спасает от конфликтов имён.

## 3. Сложное демо в iframe

Когда демо использует тяжёлые библиотеки (D3, Three.js, Plotly) или нужно полностью изолировать стили — выноси в отдельный HTML-файл и подключай через тег `<demo>`:

```markdown
<demo src="content/articles/deep-learning/demos/gradient-descent.html" height="500"></demo>
```

Это превратится в sandbox-iframe — твоё демо не сломает стили страницы, и наоборот.

## Что когда использовать

| Случай | Метод |
|---|---|
| Анимация (движение, морфинг, fade) | SVG + SMIL/CSS |
| Реакция на ввод, простые формулы | inline `<script>` |
| Графики на D3, 3D на Three.js, тяжёлые либы | `<demo>` → iframe |

## Полезные мелочи

- Тёмная тема: используй CSS-переменные (`var(--text)`, `var(--cat-accent)`) внутри SVG — цвета поедут вслед за темой.
- KaTeX и Prism запускаются **до** активации скриптов, так что код подсветится корректно, а математика отрендерится.
- В iframe нужно подключать свои CSS/JS заново — он изолирован.
- Если демо сложное — выноси в `content/articles/<категория>/demos/имя.html`. Структура остаётся чистой.
