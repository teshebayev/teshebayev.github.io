<style>
  .prose .stage-figure .is-focus .svg-math > span:not(.katex) { font-weight: 700; }
  .prose .stage-notes .katex-display { padding-bottom: .35em; }
  .prose .step-math-label { display: block; margin-top: 14px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
  .prose .step-math .math-display { margin: 4px 0 8px; }
  .prose .gd-live { border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; margin: 26px 0; background: var(--bg-elev); }
  .prose .gd-live-head strong { font-size: 17px; }
  .prose .gd-live-head p { margin: 6px 0 0; font-size: 14px; color: var(--text-muted); }
  .prose .gd-live-figure { margin-top: 14px; background: #FFFFFF; border: 1px solid #E0DDD3; border-radius: 10px; }
  .prose .gd-live-figure svg { display: block; width: 100%; height: auto; font-family: Helvetica, Arial, sans-serif; }
  .prose .gd-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px 22px; margin-top: 16px; }
  .prose .gd-control label { display: flex; justify-content: space-between; gap: 10px; font-size: 14px; color: var(--text-muted); margin-bottom: 6px; }
  .prose .gd-control output { font-variant-numeric: tabular-nums; font-weight: 700; color: var(--text); }
  .prose .gd-control input[type=range] { width: 100%; accent-color: #3576C0; }
  .prose .gd-buttons { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 14px; }
  .prose .gd-btn { font: inherit; font-size: 14px; font-weight: 700; color: var(--text); background: var(--bg-elev); border: 1px solid var(--accent); border-radius: 9px; padding: 6px 14px; cursor: pointer; }
  .prose .gd-btn:hover { background: var(--accent); color: var(--bg-elev); }
  .prose .gd-btn[disabled] { opacity: .35; cursor: default; }
  .prose .gd-btn[disabled]:hover { background: var(--bg-elev); color: var(--text); }
  .prose .gd-chip { font: inherit; font-size: 13px; color: var(--text); background: transparent; border: 1px solid var(--border); border-radius: 999px; padding: 4px 11px; cursor: pointer; }
  .prose .gd-chip.is-on { border-color: #3576C0; background: rgba(53, 118, 192, .12); font-weight: 700; }
  .prose .gd-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-top: 14px; }
  .prose .gd-metric { border: 1px solid var(--border); border-radius: 10px; padding: 7px 10px; }
  .prose .gd-metric span { display: block; font-size: 12px; color: var(--text-muted); }
  .prose .gd-metric strong { font-size: 16px; font-variant-numeric: tabular-nums; }
  .prose .gd-calc { margin-top: 12px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; text-align: center; font-size: 15px; overflow-x: auto; min-height: 42px; }
  .prose .gd-status { margin: 10px 0 0; font-size: 14px; color: var(--text-muted); min-height: 21px; }
  .prose .gd-code { margin-top: 14px; padding: 8px 0; border: 1px solid var(--border); border-radius: 10px; font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 13.5px; overflow-x: auto; }
  .prose .gd-code div { padding: 2px 12px; white-space: pre; border-left: 3px solid transparent; }
  .prose .gd-code .is-given { color: var(--text-muted); }
  .prose .gd-code .is-on { background: rgba(194, 158, 8, .16); border-left-color: #C29E08; font-weight: 700; }
  .prose .gd-note { margin-top: 12px; }
  .prose .gd-note h4 { margin: 0 0 4px; font-size: 18px; font-weight: 700; }
  .prose .gd-note p { margin: 6px 0; font-size: 15.5px; }
  .prose .gd-note .math-display, .prose .gd-note-numbers { margin: 4px 0 8px; overflow-x: auto; text-align: center; }
  .prose .gd-metric-wide { grid-column: span 2; }
  .prose .step-math .katex-display, .prose .gd-note .katex-display { margin: .35em 0; }
  .prose .gd-table-wrap { margin-top: 12px; max-height: 196px; overflow-y: auto; }
  .prose .gd-table-wrap .shape-table { margin: 0; }
  .prose .gd-radios { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
  .prose .gd-live pre { margin: 0; }
</style>
<p class="lead">
  Модель обучается так: считаем ошибку, смотрим, в какую сторону она растёт, и немного
  сдвигаем параметры в обратную. Это и есть градиентный спуск. Разберём его на двух точках
  и прямой, где каждое число можно проверить на калькуляторе.
</p>

<p>
<p>
  Сначала одна переменная: производная и касательная. Потом две, и появляются градиент и
  карта высот. Затем цикл обучения с SGD и инерцией, шаг спуска для сети с двенадцатью
  параметрами и код на NumPy. В большинстве частей есть ползунки, параметры можно двигать самим.
</p>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные и модель</span>
  <span><i style="background:#C29E08"></i>параметр и операция</span>
  <span><i style="background:#73B222"></i>результат шага</span>
  <span><i style="background:#C30B0A"></i>ошибка, производная, градиент</span>
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> в пошаговых сценах нажимайте «Далее» и смотрите не
  на всю схему сразу, а только на яркую часть. Положение объектов не меняется, меняется только то,
  куда надо смотреть. Клавиши со стрелками работают, когда сцена в фокусе. Формула каждого
  шага и расчёт на числах стоят под схемой. В живых блоках двигайте ползунки и нажимайте кнопки.
</div>

## Часть 1. Что именно мы минимизируем

<p>
  У любой модели есть числа, которые можно крутить (<strong>параметры</strong>), и
  числа, которые крутить нельзя (<strong>данные</strong>). Обучение состоит в том,
  чтобы подобрать первые под вторые. Чтобы «подобрать» перестало быть делом вкуса,
  нужен судья: одна функция, которая по текущим параметрам выдаёт одно число:
  насколько модель сейчас плоха. Это <strong>функция потерь</strong>.
</p>

<p>
  Возьмём самый маленький пример, какой вообще бывает: обучающую выборку из двух
  объектов. У каждого объекта есть признак <span class="math-inline" data-tex="x_i"></span>
  и правильный ответ <span class="math-inline" data-tex="y_i"></span>:
</p>

<table class="shape-table">
  <tr><th>i — номер объекта</th><th>признак <span class="math-inline" data-tex="x_i"></span></th><th>правильный ответ <span class="math-inline" data-tex="y_i"></span></th></tr>
  <tr><td>1</td><td>1</td><td>2</td></tr>
  <tr><td>2</td><td>2</td><td>3</td></tr>
</table>

<p>
  Всего объектов <span class="math-inline" data-tex="n = 2"></span>. Модель: прямая
  через начало координат с единственным параметром <span class="math-inline" data-tex="w"></span>; её предсказание на
  <span class="math-inline" data-tex="i"></span>-м объекте обозначим
  <span class="math-inline" data-tex="\hat{y}_i"></span>:
</p>

<div class="math-display" data-tex="\hat{y} = w \cdot x"></div>

<p>
  Ошибку на одном объекте меряем квадратом промаха
  <span class="math-inline" data-tex="\bigl(y_i - \hat{y}_i\bigr)^2"></span>, а по
  выборке усредняем. Это квадратичная функция потерь, она же MSE. Распишем её по
  всем индексам, шаг за шагом. Сначала общий вид:
</p>

<div class="math-display" data-tex="L(w) = \frac{1}{n}\sum_{i=1}^{n}\bigl(y_i - \hat{y}_i\bigr)^2 = \frac{1}{n}\sum_{i=1}^{n}\bigl(y_i - w x_i\bigr)^2"></div>

<p>Теперь раскрываем сумму: при <span class="math-inline" data-tex="n = 2"></span> в ней ровно два слагаемых:</p>

<div class="math-display" data-tex="L(w) = \frac{1}{2}\Bigl[\bigl(y_1 - w x_1\bigr)^2 + \bigl(y_2 - w x_2\bigr)^2\Bigr]"></div>

<p>И подставляем числа из таблицы, <span class="math-inline" data-tex="x_1 = 1,\ y_1 = 2,\ x_2 = 2,\ y_2 = 3"></span>:</p>

<div class="math-display" data-tex="\begin{gathered}L(w) = \frac{1}{2}\Bigl[(2 - w\cdot 1)^2 + (3 - w\cdot 2)^2\Bigr] \\ = \frac{1}{2}\bigl[5w^2 - 16w + 13\bigr] = 2.5\,w^2 - 8w + 6.5\end{gathered}"></div>

<p>
  Данные <em>исчезли</em> внутрь формулы. Осталась
  функция от одной переменной <span class="math-inline" data-tex="w"></span>, обычная парабола. Обучение модели
  превратилось в школьную задачу «найдите точку минимума».
</p>

<p>Посмотрим пошагово, как из двух точек получается эта парабола.</p>

<div class="stage" id="stageData" tabindex="0">
  <div class="stage-figure">
<svg id="ds" viewBox="0 0 960 402" role="img" aria-label="Слева данные и прямые с разным наклоном, справа график функции потерь как параболы">
  <style>
    #ds { font-family: Helvetica, Arial, sans-serif; }
    #ds .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #ds .cap  { font-size: 13px; fill: #5E5850; }
    #ds .tick { font-size: 13px; fill: #8A8378; }
    #ds .pt   { fill: #3576C0; }
    #ds .ln   { stroke: #3576C0; stroke-width: 2.2; fill: none; }
    #ds .er   { stroke: #C30B0A; stroke-width: 2.4; }
    #ds .erl  { font-size: 13px; fill: #C30B0A; }
    #ds .cv   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #ds .dot  { fill: #C29E08; }
    #ds .gdot { fill: #73B222; }
    #ds .legend { font-size: 13px; fill: #8A8378; }
  </style>

  <foreignObject x="70" y="16.6" width="293" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700"><span>Данные и прямая</span></div></foreignObject>
  <foreignObject x="560" y="16.6" width="455" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700"><span>Та же ошибка как функция одного числа <span data-tex="w"></span></span></div></foreignObject>

  <line x1="70" y1="340" x2="382" y2="340" class="ax"/>
  <line x1="70" y1="340" x2="70" y2="62" class="ax"/>
  <foreignObject x="388" y="324.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="x"></div></foreignObject>
  <foreignObject x="60" y="37.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="y"></div></foreignObject>
  <text x="185" y="358" class="tick" text-anchor="middle">1</text>
  <text x="300" y="358" class="tick" text-anchor="middle">2</text>
  <text x="62" y="270" class="tick" text-anchor="end">1</text>
  <text x="62" y="195" class="tick" text-anchor="end">2</text>
  <text x="62" y="120" class="tick" text-anchor="end">3</text>

  <line x1="550" y1="340" x2="934" y2="340" class="ax"/>
  <line x1="596" y1="340" x2="596" y2="62" class="ax"/>
  <foreignObject x="940" y="324.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="w"></div></foreignObject>
  <foreignObject x="530" y="37.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400;justify-content:flex-end" data-tex="L"></div></foreignObject>
  <text x="686" y="358" class="tick" text-anchor="middle">1</text>
  <text x="776" y="358" class="tick" text-anchor="middle">2</text>
  <text x="866" y="358" class="tick" text-anchor="middle">3</text>
  <text x="590" y="294" class="tick" text-anchor="end">2</text>
  <text x="590" y="191" class="tick" text-anchor="end">6</text>
  <text x="590" y="88" class="tick" text-anchor="end">10</text>

  <g data-key="data">
    <circle cx="185" cy="190" r="6" class="pt"/>
    <circle cx="300" cy="115" r="6" class="pt"/>
    <text x="174" y="184" class="cap" text-anchor="end">(1, 2)</text>
    <text x="311" y="109" class="cap">(2, 3)</text>
  </g>

  <g data-key="line0" data-only="1">
    <line x1="70" y1="340" x2="369" y2="340" class="ln"/>
    <foreignObject x="310" y="311.82" width="352" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="w = 0"></span>: все предсказания равны нулю</span></div></foreignObject>
  </g>

  <g data-key="err0" data-only="1">
    <line x1="185" y1="340" x2="185" y2="190" class="er"/>
    <line x1="300" y1="340" x2="300" y2="115" class="er"/>
    <text x="192" y="270" class="erl">2</text>
    <text x="307" y="240" class="erl">3</text>
  </g>

  <g data-key="line08" data-only="1">
    <line x1="70" y1="340" x2="369" y2="184" class="ln"/>
    <line x1="185" y1="280" x2="185" y2="190" class="er"/>
    <line x1="300" y1="220" x2="300" y2="115" class="er"/>
    <text x="192" y="245" class="erl">1.2</text>
    <text x="307" y="175" class="erl">1.4</text>
    <foreignObject x="245" y="304.82" width="100" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="w = 0.8"></div></foreignObject>
  </g>

  <g data-key="line16" data-only="1">
    <line x1="70" y1="340" x2="329" y2="70" class="ln"/>
    <line x1="185" y1="220" x2="185" y2="190" class="er"/>
    <line x1="300" y1="100" x2="300" y2="115" class="er"/>
    <text x="176" y="215" class="erl" text-anchor="end">0.4</text>
    <text x="307" y="95" class="erl">−0.2</text>
    <foreignObject x="1" y="79.82" width="249" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400;justify-content:flex-end"><span><span data-tex="w = 1.6"></span>: лучшая прямая</span></div></foreignObject>
  </g>

  <g data-key="curve">
    <polyline class="cv" points="560.0,80.3 569.0,105.4 578.0,129.1 587.0,151.6 596.0,172.9 605.0,192.8 614.0,211.4 623.0,228.8 632.0,244.9 641.0,259.6 650.0,273.1 659.0,285.4 668.0,296.3 677.0,305.9 686.0,314.3 695.0,321.4 704.0,327.1 713.0,331.6 722.0,334.9 731.0,336.8 740.0,337.4 749.0,336.8 758.0,334.9 767.0,331.6 776.0,327.1 785.0,321.4 794.0,314.3 803.0,305.9 812.0,296.3 821.0,285.4 830.0,273.1 839.0,259.6 848.0,244.9 857.0,228.8 866.0,211.4 875.0,192.8 884.0,172.9 893.0,151.6 902.0,129.1 911.0,105.4 920.0,80.3"/>
  </g>

  <g data-key="pt0">
    <circle cx="596" cy="172.9" r="6" class="dot"/>
    <foreignObject x="606" y="143.96" width="135" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="L(0) = 6.5"></div></foreignObject>
  </g>

  <g data-key="pt08">
    <circle cx="668" cy="296.3" r="6" class="dot"/>
    <foreignObject x="678" y="267.96" width="155" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="L(0.8) = 1.7"></div></foreignObject>
  </g>

  <g data-key="pt16">
    <circle cx="740" cy="337.4" r="7" class="gdot"/>
    <foreignObject x="752" y="299.96" width="296" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400"><span>минимум: <span data-tex="w = 1.6,\ L = 0.1"></span></span></div></foreignObject>
  </g>





  <text x="70" y="392" class="legend">синий: данные и модель · красный: промахи · жёлтый: значение потерь · зелёный: лучшее найденное</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="data" data-focus="data">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Две точки: вся обучающая выборка</h4>
      <p>Наблюдения <span class="math-inline" data-tex="(1, 2)"></span> и <span class="math-inline" data-tex="(2, 3)"></span> зафиксированы: их
      нельзя двигать. Менять мы можем только наклон прямой, то есть одно
      число <span class="math-inline" data-tex="w"></span>.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\hat{y}_i = w\,x_i"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="(x_1,\,y_1) = (1,\,2), \qquad (x_2,\,y_2) = (2,\,3)"></div></div>
    </div>
    <div class="step-panel" data-on="data line0 err0" data-focus="err0">
      <div class="step-kicker">Шаг 2 · плохой наклон</div>
      <h4>При <span class="math-inline" data-tex="w = 0"></span> модель предсказывает нули</h4>
      <p>Красные отрезки показывают промахи: 2 и 3. Возводим их в квадрат, усредняем и
      получаем одно число, которым можно измерить, насколько плоха эта прямая.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L(w) = \tfrac{1}{2}\bigl[(y_1 - w x_1)^2 + (y_2 - w x_2)^2\bigr]"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L(0) = \tfrac{1}{2}\bigl[(2 - 0\cdot 1)^2 + (3 - 0\cdot 2)^2\bigr] = \tfrac{1}{2}\bigl[4 + 9\bigr] = 6.5"></div></div>
    </div>
    <div class="step-panel" data-on="data line08" data-focus="line08">
      <div class="step-kicker">Шаг 3 · наклон получше</div>
      <h4>При <span class="math-inline" data-tex="w = 0.8"></span> промахи заметно короче</h4>
      <p>Теперь предсказания 0.8 и 1.6, промахи 1.2 и 1.4. Квадраты: 1.44 и 1.96,
      среднее 1.7. Прямая стала лучше, и число это подтвердило.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L(w) = \tfrac{1}{2}\bigl[(y_1 - w x_1)^2 + (y_2 - w x_2)^2\bigr]"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L(0.8) = \tfrac{1}{2}\bigl[(2 - 0.8\cdot 1)^2 + (3 - 0.8\cdot 2)^2\bigr] = \tfrac{1}{2}\bigl[1.44 + 1.96\bigr] = 1.7"></div></div>
    </div>
    <div class="step-panel" data-on="data line08 curve pt0 pt08" data-focus="curve">
      <div class="step-kicker">Шаг 4 · перенос на правый график</div>
      <h4>Каждому наклону своя высота</h4>
      <p>Правый график не про данные. По горизонтали отложен параметр
      <span class="math-inline" data-tex="w"></span>, по вертикали значение <span class="math-inline" data-tex="L"></span> при этом
      <span class="math-inline" data-tex="w"></span>. Точки 6.5 и 1.7 взяты из тех же двух расчётов.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L(w) = \tfrac{1}{n}\sum_{i=1}^{n}\bigl(y_i - w x_i\bigr)^2"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L(0) = 6.5, \qquad L(0.8) = 1.7"></div></div>
    </div>
    <div class="step-panel" data-on="curve pt0 pt08" data-focus="curve">
      <div class="step-kicker">Шаг 5 · раскрываем скобки</div>
      <h4>Данные превратились в коэффициенты</h4>
      <p>После раскрытия скобок от выборки остаются три числа: 2.5, −8 и 6.5.
      Дальше мы работаем не с точками, а с параболой, обычной функцией одной
      переменной.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L(w) = \tfrac{1}{2}\bigl[(2 - w)^2 + (3 - 2w)^2\bigr]"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\tfrac{1}{2}\bigl[5w^2 - 16w + 13\bigr] = 2.5\,w^2 - 8w + 6.5"></div></div>
    </div>
    <div class="step-panel" data-on="curve pt0 pt08 pt16 data line16" data-focus="pt16">
      <div class="step-kicker">Шаг 6 · дно параболы</div>
      <h4>Минимум параболы даёт лучшую прямую</h4>
      <p>Дно достигается при <span class="math-inline" data-tex="w = 1.6"></span>, и это в точности лучший наклон
      для наших двух точек. Слева видно соответствующую прямую: она проходит
      между точками, промахнувшись на 0.4 и −0.2.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L'(w) = 5w - 8 = 0"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="w = \frac{8}{5} = 1.6"></div></div>
    </div>
    <div class="step-panel" data-on="curve pt16 data line16" data-focus="line16">
      <div class="step-kicker">Шаг 7 · честный остаток</div>
      <h4>Минимум не равен нулю, и это нормально</h4>
      <p>Значение в минимуме <span class="math-inline" data-tex="L = 0.1"></span>, а не 0: прямая через начало
      координат физически не может пройти через обе точки. Функция потерь меряет не
      «правильно или нет», а «насколько близко из того, что модель вообще умеет».</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L_{\min} = L(1.6)"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\tfrac{1}{2}\bigl[(2 - 1.6)^2 + (3 - 3.2)^2\bigr] = \tfrac{1}{2}\bigl[0.16 + 0.04\bigr] = 0.1"></div></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Теперь то же самое своими руками. Подвигайте <span class="math-inline" data-tex="w"></span>: слева
  поворачивается прямая и меняются красные промахи, справа точка едет по параболе.
  Попробуйте найти дно на глаз, не глядя на расчёты выше.
</p>

<div class="gd-live" id="gdFit">
  <div class="gd-live-head"><strong>Подберите наклон сами</strong>
    <p>Красные отрезки показывают промахи: подпись у отрезка равна <span class="math-inline" data-tex="y_i - \hat{y}_i"></span>.</p></div>
  <div class="gd-live-figure"><svg id="gdFitSvg" viewBox="0 0 720 290" role="img" aria-label="Две точки данных и прямая слева, парабола потерь с текущей точкой справа"></svg></div>
  <div class="gd-controls">
    <div class="gd-control"><label for="gdFitW"><span>Наклон <span class="math-inline" data-tex="w"></span></span> <output id="gdFitWOut">0.00</output></label>
      <input id="gdFitW" type="range" min="-0.5" max="3.5" step="0.05" value="0"></div>
  </div>
  <div class="gd-buttons"><button type="button" class="gd-btn" id="gdFitBest">Показать лучший наклон</button></div>
  <div class="gd-metrics">
    <div class="gd-metric"><span>предсказания</span><strong id="gdFitPred">—</strong></div>
    <div class="gd-metric"><span>промахи</span><strong id="gdFitMiss">—</strong></div>
    <div class="gd-metric"><span>потери L</span><strong id="gdFitLoss">—</strong></div>
  </div>
  <div class="gd-calc" id="gdFitCalc"></div>
  <p class="gd-status" id="gdFitStatus"></p>
</div>


### А если объектов не два, а много?

<p>
  Меняется ровно одно место: количество слагаемых под знаком суммы. При
  <span class="math-inline" data-tex="n"></span> объектах функция потерь выглядит так:
</p>

<div class="math-display" data-tex="L(w) = \frac{1}{n}\Bigl[\bigl(y_1 - w x_1\bigr)^2 + \bigl(y_2 - w x_2\bigr)^2 + \dots + \bigl(y_n - w x_n\bigr)^2\Bigr]"></div>

<p>
  После раскрытия скобок каждое слагаемое даёт вклад в три коэффициента, и они
  складываются в те же три числа, что и у нас:
</p>

<div class="math-display" data-tex="L(w) = \underbrace{\Bigl(\tfrac{1}{n}\sum_i x_i^2\Bigr)}_{A}\,w^2 \;-\; \underbrace{\Bigl(\tfrac{2}{n}\sum_i x_i y_i\Bigr)}_{B}\,w \;+\; \underbrace{\Bigl(\tfrac{1}{n}\sum_i y_i^2\Bigr)}_{C}"></div>

<p>
  Проверим на наших двух точках:
  <span class="math-inline" data-tex="A = \tfrac{1}{2}(1 + 4) = 2.5"></span>,
  <span class="math-inline" data-tex="B = \tfrac{2}{2}(1\cdot 2 + 2\cdot 3) = 8"></span>,
  <span class="math-inline" data-tex="C = \tfrac{1}{2}(4 + 9) = 6.5"></span>. Это ровно те
  коэффициенты, что и в сцене. Миллион объектов не усложняет картинку: это по-прежнему
  парабола от одного числа <span class="math-inline" data-tex="w"></span>, просто её коэффициенты собраны из миллиона
  слагаемых. Дорожает не форма функции, а один её подсчёт.
</p>

<p>
  Для параболы минимум находится в одну строчку: производная
  <span class="math-inline" data-tex="L'(w) = 5w - 8"></span> обнуляется при <span class="math-inline" data-tex="w = 1.6"></span>. Возникает
  законный вопрос: зачем тогда нужен какой-то спуск?
</p>

<div class="callout-red">
  <strong>Где ломается точный метод:</strong> он требует <em>решить</em> уравнение
  <span class="math-inline" data-tex="\nabla L = 0"></span>. Для параболы это линейное
  уравнение. Для нейросети это система из миллионов нелинейных уравнений с
  сигмоидами и максимумами внутри, и у неё нет общего способа решения. Даже
  безобидный многочлен от двух переменных даёт систему, которую проще посчитать
  численно, чем решить.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обучение сводится к минимизации одной функции,
  у которой аргументы не данные, а параметры модели. Данные лишь задают форму
  этой функции и дальше в оптимизации не участвуют.
</div>

---

## Часть 2. Производная: наклон и касательная

<p>
  Спускаться придётся вслепую: мы не видим весь график, у нас есть только текущая
  точка. В точке можно измерить только <strong>наклон</strong>. Чтобы
  измерить наклон, нужна вторая точка рядом, и вот тут появляются два ключевых слова:
  приращение аргумента и приращение функции.
</p>

<p>
  Прежде чем считать, договоримся о словах. Сдвинем аргумент из точки
  <span class="math-inline" data-tex="w"></span> на маленькую величину <span class="math-inline" data-tex="\Delta w"></span>,
  это <strong>приращение аргумента</strong>. Функция на это ответит своим сдвигом
  <span class="math-inline" data-tex="\Delta L = L(w + \Delta w) - L(w)"></span>,
  это <strong>приращение функции</strong>. Два приращения образуют прямоугольный
  треугольник, гипотенуза которого и есть <strong>секущая</strong>, прямая через две точки
  графика:
</p>

<div class="math-display" data-tex="\text{наклон секущей} \;=\; \frac{\Delta L}{\Delta w} \;=\; \frac{L(w + \Delta w) - L(w)}{\Delta w}"></div>

<p>
  Это средняя скорость изменения на отрезке. Чтобы получить скорость <em>именно в
  точке</em>, отрезок нужно стянуть в точку: устремить
  <span class="math-inline" data-tex="\Delta w"></span> к нулю. Предел этого отношения
  и есть <strong>производная</strong>, а предельное положение секущей называют
  <strong>касательной</strong>.
</p>

<div class="stage" id="stageDiff" tabindex="0">
  <div class="stage-figure">
<svg id="dv" viewBox="0 0 960 410" role="img" aria-label="Приращение аргумента, приращение функции, секущая и переход к касательной">
  <style>
    #dv { font-family: Helvetica, Arial, sans-serif; }
    #dv .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #dv .ttl  { font-size: 15px; fill: #111111; font-weight: 700; }
    #dv .tick { font-size: 13px; fill: #8A8378; }
    #dv .cv   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #dv .dot  { fill: #3576C0; }
    #dv .dotb { fill: #244F81; }
    #dv .leg  { stroke: #3576C0; stroke-width: 2; stroke-dasharray: 6 4; fill: none; }
    #dv .sec  { stroke: #5E5850; stroke-width: 2; fill: none; }
    #dv .sec2 { stroke: #B9B4A9; stroke-width: 1.6; fill: none; }
    #dv .tan  { stroke: #C30B0A; stroke-width: 2.8; fill: none; }
    #dv .bl   { font-size: 13px; fill: #244F81; }
    #dv .gl   { font-size: 13px; fill: #5E5850; }
    #dv .rl   { font-size: 14px; fill: #C30B0A; }
    #dv .pan  { fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.4; }
    #dv .td   { font-size: 14px; fill: #111111; }
    #dv .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="dv-ab" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
  </defs>

  <text x="40" y="36" class="ttl">Приращения, секущая и предельный переход к касательной</text>

  <line x1="100" y1="350" x2="546" y2="350" class="ax"/>
  <line x1="109.2" y1="350" x2="109.2" y2="70" class="ax"/>
  <foreignObject x="552" y="334.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="w"></div></foreignObject>
  <foreignObject x="43" y="45.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400;justify-content:flex-end" data-tex="L"></div></foreignObject>
  <text x="294.2" y="368" class="tick" text-anchor="middle">1</text>
  <text x="479.3" y="368" class="tick" text-anchor="middle">2</text>

  <polyline class="cv" points="100.0,87.6 109.2,103.0 118.5,118.0 127.8,132.5 137.0,146.5 146.2,160.0 155.5,173.1 164.8,185.7 174.0,197.8 183.2,209.4 192.5,220.6 201.8,231.2 211.0,241.5 220.2,251.2 229.5,260.5 238.8,269.2 248.0,277.6 257.2,285.4 266.5,292.8 275.8,299.7 285.0,306.1 294.2,312.0 303.5,317.5 312.8,322.4 322.0,327.0 331.2,331.0 340.5,334.6 349.8,337.6 359.0,340.3 368.3,342.4 377.5,344.1 386.8,345.2 396.0,346.0 405.2,346.2 414.5,346.0 423.8,345.2 433.0,344.1 442.2,342.4 451.5,340.3 460.8,337.7 470.0,334.6 479.3,331.0 488.5,327.0 497.8,322.4 507.0,317.5 516.2,312.0"/>

  <g data-key="pa">
    <circle cx="109.2" cy="103" r="6" class="dotb"/>
    <foreignObject x="118" y="75.82" width="156" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:400" data-tex="A = (0,\ 6.5)"></div></foreignObject>
  </g>

  <g data-key="dw">
    <line x1="109.2" y1="103" x2="288" y2="103" class="leg" marker-end="url(#dv-ab)"/>
    <foreignObject x="195" y="71.82" width="90" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#244F81;font-weight:400" data-tex="\Delta w = 1"></div></foreignObject>
  </g>

  <g data-key="dl">
    <line x1="294.2" y1="103" x2="294.2" y2="306" class="leg" marker-end="url(#dv-ab)"/>
    <circle cx="294.2" cy="312" r="6" class="dot"/>
    <foreignObject x="302" y="189.82" width="231" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:400" data-tex="\Delta L = -5.5"></div></foreignObject>
    <foreignObject x="302" y="301.82" width="156" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:400" data-tex="B = (1,\ 1.0)"></div></foreignObject>
  </g>

  <g data-key="sec" data-only="1">
    <line x1="100" y1="92.6" x2="330" y2="352.4" class="sec"/>
    <text x="302" y="262" class="gl">секущая: наклон −5.5</text>
  </g>

  <g data-key="small" data-only="1">
    <line x1="109.2" y1="103" x2="215" y2="248" class="sec2"/>
    <line x1="109.2" y1="103" x2="160" y2="180" class="sec2"/>
    <line x1="109.2" y1="103" x2="140" y2="148" class="sec2"/>
    <circle cx="201.8" cy="231.2" r="5" class="dot"/>
    <circle cx="146.2" cy="160" r="5" class="dot"/>
    <circle cx="127.8" cy="132.5" r="5" class="dot"/>
    <foreignObject x="212" y="205.82" width="109" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:400" data-tex="\Delta w = 0.5"></div></foreignObject>
    <text x="158" y="156" class="bl">0.2</text>
    <text x="140" y="128" class="bl">0.1</text>
  </g>

  <g data-key="tan" data-only="1">
    <line x1="100" y1="87.8" x2="253.6" y2="340.1" class="tan"/>
    <text x="232" y="238" class="rl">касательная: наклон −8</text>
  </g>

  <g data-key="tbl">
    <rect x="600" y="86" width="340" height="240" rx="10" class="pan"/>
    <foreignObject x="624" y="95.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:700" data-tex="\Delta w"></div></foreignObject>
    <foreignObject x="816" y="95.82" width="100" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:700;justify-content:flex-end" data-tex="\Delta L / \Delta w"></div></foreignObject>
    <line x1="616" y1="128" x2="924" y2="128" class="ax"/>
  </g>

  <g data-key="row1" data-only="1">
    <text x="624" y="158" class="td">1.0</text>
    <text x="916" y="158" class="td" text-anchor="end">−5.50</text>
  </g>

  <g data-key="rows" data-only="1">
    <text x="624" y="192" class="td">0.5</text>
    <text x="916" y="192" class="td" text-anchor="end">−6.75</text>
    <text x="624" y="226" class="td">0.2</text>
    <text x="916" y="226" class="td" text-anchor="end">−7.50</text>
    <text x="624" y="260" class="td">0.1</text>
    <text x="916" y="260" class="td" text-anchor="end">−7.75</text>
  </g>

  <g data-key="rowlim" data-only="1">
    <foreignObject x="624" y="275.96" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C30B0A;font-weight:400" data-tex="\to 0"></div></foreignObject>
    <text x="916" y="298" class="rl" text-anchor="end">−8.00</text>
  </g>

  <text x="40" y="400" class="legend">жёлтый: функция · синий: приращения и пробные точки · серый: секущая · красный: касательная и производная</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="pa dw" data-focus="dw">
      <div class="step-kicker">Шаг 1 · приращение аргумента</div>
      <h4><span class="math-inline" data-tex="\Delta w"></span>: насколько мы сдвинули параметр</h4>
      <p>Стоим в точке <span class="math-inline" data-tex="A"></span> при <span class="math-inline" data-tex="w = 0"></span>, где <span class="math-inline" data-tex="L = 6.5"></span>,
      и делаем пробный сдвиг вправо на <span class="math-inline" data-tex="\Delta w = 1"></span>. Это горизонтальный катет:
      сама функция здесь ещё не участвует, мы только выбрали, куда посмотреть.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="w \;\longrightarrow\; w + \Delta w"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="0 \;\longrightarrow\; 0 + 1 = 1"></div></div>
    </div>
    <div class="step-panel" data-on="pa dw dl" data-focus="dl">
      <div class="step-kicker">Шаг 2 · приращение функции</div>
      <h4><span class="math-inline" data-tex="\Delta L"></span>: как на этот сдвиг ответила функция</h4>
      <p>В точке <span class="math-inline" data-tex="w = 1"></span> потери равны
      <span class="math-inline" data-tex="2.5\cdot 1 - 8\cdot 1 + 6.5 = 1.0"></span>, значит
      <span class="math-inline" data-tex="\Delta L = 1.0 - 6.5 = -5.5"></span>. Знак минус значит, что функция упала. Это
      вертикальный катет треугольника.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\Delta L = L(w + \Delta w) - L(w)"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\Delta L = L(1) - L(0) = 1.0 - 6.5 = -5.5"></div></div>
    </div>
    <div class="step-panel" data-on="pa dw dl sec tbl row1" data-focus="sec">
      <div class="step-kicker">Шаг 3 · отношение</div>
      <h4><span class="math-inline" data-tex="\Delta L / \Delta w"></span>: наклон секущей</h4>
      <p><span class="math-inline" data-tex="-5.5 / 1 = -5.5"></span>: в среднем на этом отрезке функция падает на
      5.5 единицы за единицу <span class="math-inline" data-tex="w"></span>. Гипотенуза треугольника и есть секущая,
      прямая через точки <span class="math-inline" data-tex="A"></span> и <span class="math-inline" data-tex="B"></span>. Проблема в слове
      «в среднем»: у левого края склон круче, у правого положе.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\frac{\Delta L}{\Delta w} = \frac{L(w + \Delta w) - L(w)}{\Delta w}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\frac{-5.5}{1} = -5.5"></div></div>
    </div>
    <div class="step-panel" data-on="pa small sec tbl row1 rows" data-focus="small">
      <div class="step-kicker">Шаг 4 · стягиваем отрезок</div>
      <h4>Чем меньше <span class="math-inline" data-tex="\Delta w"></span>, тем честнее ответ</h4>
      <p>Берём <span class="math-inline" data-tex="\Delta w = 0.5"></span>: <span class="math-inline" data-tex="(3.125 - 6.5)/0.5 = -6.75"></span>. Затем
      <span class="math-inline" data-tex="0.2"></span> даёт <span class="math-inline" data-tex="-7.5"></span>, а <span class="math-inline" data-tex="0.1"></span> даёт <span class="math-inline" data-tex="-7.75"></span>.
      Секущие поворачиваются и всё плотнее прижимаются к одной прямой.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\frac{\Delta L}{\Delta w} = \frac{L(w + \Delta w) - L(w)}{\Delta w}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\frac{3.125 - 6.5}{0.5} = -6.75, \quad \frac{5.0 - 6.5}{0.2} = -7.5, \quad \frac{5.725 - 6.5}{0.1} = -7.75"></div></div>
    </div>
    <div class="step-panel" data-on="pa tan tbl row1 rows rowlim" data-focus="tan">
      <div class="step-kicker">Шаг 5 · предел</div>
      <h4>Число −8 и есть производная в точке</h4>
      <p>Последовательность −5.5, −6.75, −7.5, −7.75 упирается в −8. Это значение
      называют производной <span class="math-inline" data-tex="L'(0)"></span>, а
      предельное положение секущей называют касательной. Проверка по правилам:
      <span class="math-inline" data-tex="L'(w) = 5w - 8"></span>, при <span class="math-inline" data-tex="w = 0"></span> получаем −8.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L'(w) = \lim_{\Delta w \to 0}\frac{L(w + \Delta w) - L(w)}{\Delta w}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L'(0) = 5\cdot 0 - 8 = -8"></div></div>
    </div>
    <div class="step-panel" data-on="pa tan" data-focus="tan">
      <div class="step-kicker">Шаг 6 · зачем это нужно спуску</div>
      <h4>Касательная как локальный прогноз</h4>
      <p>Рядом с точкой функция почти совпадает со своей касательной:
      <span class="math-inline" data-tex="L(\Delta w) \approx 6.5 - 8\cdot \Delta w"></span>. Именно этим приближением пользуется
      градиентный спуск, когда решает, куда и насколько шагнуть, а слово «рядом»
      объясняет, почему шаг должен быть небольшим.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L(w + \Delta w) \approx L(w) + L'(w)\,\Delta w"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L(0 + \Delta w) \approx 6.5 - 8\,\Delta w"></div></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Из определения сразу следует главное для нас правило. Знак производной говорит,
  куда функция растёт. Если <span class="math-inline" data-tex="L'(w) &lt; 0"></span>,
  функция убывает вправо, и уменьшить её можно, увеличив <span class="math-inline" data-tex="w"></span>. Если
  <span class="math-inline" data-tex="L'(w) &gt; 0"></span>, наоборот. Значит,
  <em>шагать надо против знака производной</em>.
</p>

<div class="stage" id="stageTangent" tabindex="0">
  <div class="stage-figure">
<svg id="tg" viewBox="0 0 960 452" role="img" aria-label="Парабола потерь с секущей и касательными в точках w=0, w=1.6 и w=2.5">
  <style>
    #tg { font-family: Helvetica, Arial, sans-serif; }
    #tg .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #tg .cap  { font-size: 13px; fill: #5E5850; }
    #tg .tick { font-size: 13px; fill: #8A8378; }
    #tg .cv   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #tg .dot  { fill: #3576C0; }
    #tg .gdot { fill: #73B222; }
    #tg .sec  { stroke: #8A8378; stroke-width: 2; stroke-dasharray: 6 4; fill: none; }
    #tg .tan  { stroke: #C30B0A; stroke-width: 2.6; fill: none; }
    #tg .lab  { font-size: 14px; fill: #C30B0A; }
    #tg .arw  { stroke: #73B222; stroke-width: 2.6; fill: none; }
    #tg .pan  { fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.4; }
    #tg .th   { font-size: 13px; fill: #244F81; font-weight: 700; }
    #tg .td   { font-size: 14px; fill: #111111; }
    #tg .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="tg-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
  </defs>

  <foreignObject x="70" y="14.6" width="704" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700"><span>Парабола потерь и наклон в трёх точках</span></div></foreignObject>

  <line x1="70" y1="360" x2="636" y2="360" class="ax"/>
  <line x1="113.4" y1="360" x2="113.4" y2="66" class="ax"/>
  <foreignObject x="642" y="344.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="w"></div></foreignObject>
  <foreignObject x="48" y="41.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400;justify-content:flex-end" data-tex="L"></div></foreignObject>
  <text x="258.2" y="378" class="tick" text-anchor="middle">1</text>
  <text x="402.9" y="378" class="tick" text-anchor="middle">2</text>
  <text x="547.6" y="378" class="tick" text-anchor="middle">3</text>
  <text x="107" y="245" class="tick" text-anchor="end">4</text>
  <text x="107" y="185" class="tick" text-anchor="end">6</text>
  <text x="107" y="125" class="tick" text-anchor="end">8</text>

  <g data-key="curve">
    <polyline class="cv" points="70.0,86.2 77.2,100.3 84.5,114.0 91.7,127.3 98.9,140.2 106.2,152.8 113.4,165.0 120.7,176.8 127.9,188.2 135.1,199.3 142.4,210.0 149.6,220.3 156.8,230.2 164.1,239.8 171.3,249.0 178.6,257.8 185.8,266.2 193.0,274.3 200.3,282.0 207.5,289.3 214.7,296.2 222.0,302.8 229.2,309.0 236.4,314.8 243.7,320.2 250.9,325.3 258.2,330.0 265.4,334.3 272.6,338.2 279.9,341.8 287.1,345.0 294.3,347.8 301.6,350.2 308.8,352.3 316.1,354.0 323.3,355.3 330.5,356.2 337.8,356.8 345.0,357.0 352.2,356.8 359.5,356.2 366.7,355.3 373.9,354.0 381.2,352.3 388.4,350.2 395.7,347.8 402.9,345.0 410.1,341.8 417.4,338.2 424.6,334.3 431.8,330.0 439.1,325.3 446.3,320.2 453.6,314.8 460.8,309.0 468.0,302.8 475.3,296.3 482.5,289.3 489.7,282.0 497.0,274.3 504.2,266.3 511.4,257.8 518.7,249.0 525.9,239.8 533.2,230.3 540.4,220.3 547.6,210.0 554.9,199.3 562.1,188.3 569.3,176.8 576.6,165.0 583.8,152.8 591.1,140.3 598.3,127.3 605.5,114.0 612.8,100.3 620.0,86.3"/>
  </g>

  <g data-key="p0">
    <circle cx="113.4" cy="165" r="6" class="dot"/>
    <foreignObject x="122" y="135.96" width="185" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400"><span>мы здесь: <span data-tex="w = 0"></span></span></div></foreignObject>
  </g>

  <g data-key="sec" data-only="1">
    <line x1="84.5" y1="132" x2="279.9" y2="354.8" class="sec"/>
    <circle cx="258.2" cy="330" r="5" class="dot"/>
    <foreignObject x="266" y="303.82" width="212" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>вторая точка: <span data-tex="w = 1"></span></span></div></foreignObject>
    <text x="186" y="235" class="cap">секущая, наклон −5.5</text>
  </g>

  <g data-key="tan0">
    <line x1="77.2" y1="105" x2="226.3" y2="352.2" class="tan"/>
    <text x="130" y="108" class="lab">касательная, наклон −8</text>
  </g>

  <g data-key="dir" data-only="1">
    <line x1="118" y1="400" x2="205" y2="400" class="arw" marker-end="url(#tg-ag)"/>
    <foreignObject x="212" y="384.82" width="446" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5A8C1C;font-weight:400"><span>производная отрицательная: двигаем <span data-tex="w"></span> вправо</span></div></foreignObject>
  </g>

  <g data-key="p25">
    <circle cx="475.3" cy="296.2" r="6" class="dot"/>
    <foreignObject x="490" y="281.96" width="105" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="w = 2.5"></div></foreignObject>
  </g>

  <g data-key="tan25">
    <line x1="410.1" y1="357" x2="547.6" y2="228.8" class="tan"/>
    <text x="478" y="222" class="lab" text-anchor="middle">наклон +4.5</text>
  </g>

  <g data-key="dir2" data-only="1">
    <line x1="470" y1="400" x2="383" y2="400" class="arw" marker-end="url(#tg-ag)"/>
    <foreignObject x="-60" y="384.82" width="436" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5A8C1C;font-weight:400;justify-content:flex-end"><span>производная положительная: двигаем <span data-tex="w"></span> влево</span></div></foreignObject>
  </g>

  <g data-key="p16">
    <circle cx="345" cy="357" r="7" class="gdot"/>
    <line x1="258.2" y1="357" x2="439.1" y2="357" class="tan"/>
    <text x="345" y="336" class="lab" text-anchor="middle">наклон 0: дно</text>
  </g>

  <g data-key="tbl">
    <rect x="650" y="110" width="290" height="200" rx="10" class="pan"/>
    <foreignObject x="672" y="115.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:700" data-tex="w"></div></foreignObject>
    <foreignObject x="681" y="115.82" width="81" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:700;justify-content:flex-end" data-tex="L'(w)"></div></foreignObject>
    <text x="790" y="136" class="th">куда шагать</text>
    <line x1="662" y1="148" x2="928" y2="148" class="ax"/>
    <text x="672" y="176" class="td">0</text>
    <text x="762" y="176" class="td" text-anchor="end">−8.0</text>
    <text x="790" y="176" class="td">вправо</text>
    <text x="672" y="212" class="td">1.0</text>
    <text x="762" y="212" class="td" text-anchor="end">−3.0</text>
    <text x="790" y="212" class="td">вправо</text>
    <text x="672" y="248" class="td">1.6</text>
    <text x="762" y="248" class="td" text-anchor="end">0.0</text>
    <text x="790" y="248" class="td">никуда</text>
    <text x="672" y="284" class="td">2.5</text>
    <text x="762" y="284" class="td" text-anchor="end">+4.5</text>
    <text x="790" y="284" class="td">влево</text>
  </g>

  <text x="70" y="442" class="legend">жёлтый: функция потерь · красный: производная и касательная · зелёный: направление спуска</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="curve p0" data-focus="p0">
      <div class="step-kicker">Шаг 1 · вслепую</div>
      <h4>Мы стоим в точке <span class="math-inline" data-tex="w = 0"></span> и не видим графика</h4>
      <p>Вся картинка нарисована для нас, читателей. Алгоритм её не видит: он умеет
      только вычислять <span class="math-inline" data-tex="L"></span> в конкретной точке и брать производную. Вопрос
      на этом шаге ровно один: увеличивать <span class="math-inline" data-tex="w"></span> или уменьшать.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L(w) = 2.5\,w^2 - 8w + 6.5"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L(0) = 6.5"></div></div>
    </div>
    <div class="step-panel" data-on="curve p0 sec" data-focus="sec">
      <div class="step-kicker">Шаг 2 · секущая</div>
      <h4>Средний наклон между двумя точками</h4>
      <p>Возьмём вторую точку при <span class="math-inline" data-tex="w = 1"></span>: там <span class="math-inline" data-tex="L = 1.0"></span>.
      Наклон отрезка равен <span class="math-inline" data-tex="(1.0 - 6.5)/1 = -5.5"></span>.
      Число уже отвечает на вопрос «вниз или вверх», но описывает весь отрезок, а не
      нашу точку.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\frac{L(w_2) - L(w_1)}{w_2 - w_1}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\frac{L(1) - L(0)}{1 - 0} = \frac{1.0 - 6.5}{1} = -5.5"></div></div>
    </div>
    <div class="step-panel" data-on="curve p0 sec tan0" data-focus="tan0">
      <div class="step-kicker">Шаг 3 · предел</div>
      <h4>Сдвигаем вторую точку вплотную и получаем касательную</h4>
      <p>Чем меньше <span class="math-inline" data-tex="\Delta w"></span>, тем ближе
      секущая к касательной. В пределе наклон равен −8: это и есть производная в
      точке <span class="math-inline" data-tex="w = 0"></span>. Проверка по формуле: <span class="math-inline" data-tex="5\cdot 0 - 8 = -8"></span>.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L'(w) = \lim_{\Delta w \to 0}\frac{L(w + \Delta w) - L(w)}{\Delta w}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L'(w) = 5w - 8, \qquad L'(0) = 5\cdot 0 - 8 = -8"></div></div>
    </div>
    <div class="step-panel" data-on="curve p0 tan0 dir" data-focus="dir">
      <div class="step-kicker">Шаг 4 · знак</div>
      <h4>Минус означает «вниз направо»</h4>
      <p>Отрицательная производная значит, что функция убывает при увеличении аргумента.
      Значит, чтобы уменьшить потери, надо двигать <span class="math-inline" data-tex="w"></span> в
      <em>положительную</em> сторону. Направление спуска противоположно знаку
      производной.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L'(w) &lt; 0 \;\Longrightarrow\; w \text{ увеличиваем}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L'(0) = -8 &lt; 0"></div></div>
    </div>
    <div class="step-panel" data-on="curve p25 tan25 dir2" data-focus="tan25">
      <div class="step-kicker">Шаг 5 · симметричный случай</div>
      <h4>Справа от минимума наклон положительный</h4>
      <p>В точке <span class="math-inline" data-tex="w = 2.5"></span> производная равна <span class="math-inline" data-tex="5\cdot 2.5 - 8 = +4.5"></span>:
      функция растёт вправо. Правило то же: идём против знака, то есть влево. Одно
      правило покрывает оба случая.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L'(w) &gt; 0 \;\Longrightarrow\; w \text{ уменьшаем}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L'(2.5) = 5\cdot 2.5 - 8 = +4.5"></div></div>
    </div>
    <div class="step-panel" data-on="curve p16" data-focus="p16">
      <div class="step-kicker">Шаг 6 · ноль</div>
      <h4>В минимуме касательная горизонтальна</h4>
      <p>Производная в дне равна нулю, и правило «иди против знака» само собой
      выключается: шагать некуда. Спуск не нужно останавливать вручную: он
      затухает, когда наклон исчезает.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L'(w) = 0 \;\Longrightarrow\; \text{шагать некуда}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L'(1.6) = 5\cdot 1.6 - 8 = 0"></div></div>
    </div>
    <div class="step-panel" data-on="curve p0 p16 p25 tbl" data-focus="tbl">
      <div class="step-kicker">Шаг 7 · вся информация в одной формуле</div>
      <h4><span class="math-inline" data-tex="L'(w) = 5w - 8"></span> отвечает в любой точке</h4>
      <p>Производную считают не по определению каждый раз, а по правилам
      дифференцирования. Одна формула сразу даёт и направление (знак), и крутизну
      (модуль). Оба числа понадобятся в следующей части.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L'(w) = 5w - 8"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L'(0) = -8, \quad L'(1) = -3, \quad L'(1.6) = 0, \quad L'(2.5) = +4.5"></div></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Теперь то же своими руками. Для нашей параболы наклон секущей считается точно:
</p>

<div class="math-display" data-tex="\frac{L(w + \Delta w) - L(w)}{\Delta w} = 5w - 8 + 2.5\,\Delta w"></div>

<p>
  Первые два слагаемых и есть производная, а хвост <span class="math-inline" data-tex="2.5\,\Delta w"></span>
  показывает, насколько секущая отличается от касательной. Уменьшайте <span class="math-inline" data-tex="\Delta w"></span>
  и смотрите, как хвост исчезает. Затем двигайте <span class="math-inline" data-tex="w"></span>: справа
  видно, какой наклон у функции в каждой точке.
</p>

<div class="gd-live" id="gdTan">
  <div class="gd-live-head"><strong>Секущая, касательная и наклон</strong>
    <p>Серая прямая проходит через две точки графика, красная касается его в одной. Зелёная стрелка показывает, куда шагать, чтобы потери падали.</p></div>
  <div class="gd-live-figure"><svg id="gdTanSvg" viewBox="0 0 720 320" role="img" aria-label="Парабола потерь с секущей и касательной слева, график производной справа"></svg></div>
  <div class="gd-controls">
    <div class="gd-control"><label for="gdTanW"><span>Точка <span class="math-inline" data-tex="w"></span></span> <output id="gdTanWOut">0.00</output></label>
      <input id="gdTanW" type="range" min="-0.5" max="3.5" step="0.05" value="0"></div>
    <div class="gd-control"><label for="gdTanD"><span>Приращение <span class="math-inline" data-tex="\Delta w"></span></span> <output id="gdTanDOut">1.00</output></label>
      <input id="gdTanD" type="range" min="0.01" max="1.5" step="0.01" value="1"></div>
  </div>
  <div class="gd-radios">
    <button type="button" class="gd-chip" data-w="0">w = 0</button>
    <button type="button" class="gd-chip" data-w="1">w = 1</button>
    <button type="button" class="gd-chip" data-w="1.6">w = 1.6</button>
    <button type="button" class="gd-chip" data-w="2.5">w = 2.5</button>
  </div>
  <div class="gd-buttons">
    <button type="button" class="gd-btn" id="gdTanShrink">Стянуть Δw к нулю</button>
    <button type="button" class="gd-btn" id="gdTanReset">Сброс</button>
  </div>
  <div class="gd-metrics">
    <div class="gd-metric"><span>потери L(w)</span><strong id="gdTanL">—</strong></div>
    <div class="gd-metric"><span>наклон секущей</span><strong id="gdTanSec">—</strong></div>
    <div class="gd-metric"><span>производная L′(w)</span><strong id="gdTanDer">—</strong></div>
    <div class="gd-metric"><span>разница</span><strong id="gdTanGap">—</strong></div>
  </div>
  <div class="gd-calc" id="gdTanCalc"></div>
  <p class="gd-status" id="gdTanStatus"></p>
</div>

### Мини-таблица производных, которой хватает на всё обучение

<p>
  Производные в машинном обучении почти никогда не считают по определению: берут
  готовые формулы для базовых функций и три правила, которые собирают из них
  сложные выражения.
</p>

<table class="shape-table">
  <tr><th>Функция</th><th>Производная</th><th>Где встречается</th></tr>
  <tr><td><span class="math-inline" data-tex="c"></span></td><td><span class="math-inline" data-tex="0"></span></td><td>свободные слагаемые в потерях</td></tr>
  <tr><td><span class="math-inline" data-tex="w^{n}"></span></td><td><span class="math-inline" data-tex="n\,w^{\,n-1}"></span></td><td>квадратичная ошибка: <span class="math-inline" data-tex="(w^2)' = 2w"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="e^{w}"></span></td><td><span class="math-inline" data-tex="e^{w}"></span></td><td>сигмоида, softmax</td></tr>
  <tr><td><span class="math-inline" data-tex="\ln w"></span></td><td><span class="math-inline" data-tex="1/w"></span></td><td>логистическая функция потерь</td></tr>
  <tr><td><span class="math-inline" data-tex="\sigma(z) = \dfrac{1}{1+e^{-z}}"></span></td><td><span class="math-inline" data-tex="\sigma(z)\bigl(1-\sigma(z)\bigr)"></span></td><td>активация нейрона</td></tr>
  <tr><td><span class="math-inline" data-tex="\tanh z"></span></td><td><span class="math-inline" data-tex="1 - \tanh^2 z"></span></td><td>активация в рекуррентных сетях</td></tr>
  <tr><td><span class="math-inline" data-tex="\max(0, z)"></span></td><td><span class="math-inline" data-tex="1"></span> при <span class="math-inline" data-tex="z&gt;0"></span>, иначе <span class="math-inline" data-tex="0"></span></td><td>ReLU</td></tr>
</table>

<p>И три правила, которыми это склеивается:</p>

<div class="math-display" data-tex="(u+v)' = u' + v', \qquad (uv)' = u'v + uv', \qquad \bigl(u(v)\bigr)' = u'(v)\cdot v'"></div>

<div class="callout-blue">
  <strong>Третье правило самое важное.</strong> Правило дифференцирования сложной
  функции (цепное правило) и есть единственный инструмент, из которого сделан бэкпроп.
  Производная композиции равна произведению производных по цепочке; в сети такой
  цепочкой становится путь от ошибки до конкретного веса.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> производная считается в одной точке, видеть
  весь график для этого не нужно. Её знак задаёт направление шага, а модуль показывает, насколько круто здесь
  падает функция.
</div>

---

## Часть 3. Шаг спуска и скорость обучения

<p>
  Направление есть, осталось решить, насколько далеко идти. Естественная идея:
  сделать длину шага пропорциональной крутизне. Там, где склон крутой, можно
  шагать смело; у самого дна осторожно. Умножим производную на маленькое
  положительное число и вычтем результат:
</p>

<div class="math-display" data-tex="w_{\text{new}} = w_{\text{old}} - \eta \cdot L'(w_{\text{old}})"></div>

<p>
  Множитель <span class="math-inline" data-tex="\eta"></span> называется
  <strong>скоростью обучения</strong> (learning rate). Минус в формуле и есть
  «идти против знака производной»: при отрицательной производной мы вычитаем
  отрицательное число, то есть <span class="math-inline" data-tex="w"></span> растёт.
</p>

<p>
  Возьмём <span class="math-inline" data-tex="\eta = 0.1"></span> и стартовую точку
  <span class="math-inline" data-tex="w = 0"></span>. Дальше только арифметика, но посмотрим на неё пошагово,
  чтобы увидеть, что происходит с длиной шага.
</p>

<div class="stage" id="stageRate" tabindex="0">
  <div class="stage-figure">
<svg id="lr" viewBox="0 0 960 452" role="img" aria-label="Траектория градиентного спуска по параболе при разных значениях скорости обучения">
  <style>
    #lr { font-family: Helvetica, Arial, sans-serif; }
    #lr .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #lr .ttl  { font-size: 15px; fill: #111111; font-weight: 700; }
    #lr .tick { font-size: 13px; fill: #8A8378; }
    #lr .cv   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #lr .drop { stroke: #B9C9DA; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #lr .gdot { fill: #73B222; }
    #lr .bdot { fill: #3576C0; }
    #lr .mv   { stroke: #73B222; stroke-width: 2.6; fill: none; }
    #lr .gl   { font-size: 14px; fill: #5A8C1C; }
    #lr .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="lr-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
  </defs>

  <foreignObject x="190" y="6" width="500" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700"><span>Спуск по параболе потерь при <span data-tex="\eta = 0.1"></span></span></div></foreignObject>

  <line x1="80" y1="350" x2="846" y2="350" class="ax"/>
  <line x1="168.1" y1="350" x2="168.1" y2="56" class="ax"/>
  <foreignObject x="852" y="334.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="w"></div></foreignObject>
  <foreignObject x="102" y="31.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400;justify-content:flex-end" data-tex="L"></div></foreignObject>
  <text x="344.3" y="368" class="tick" text-anchor="middle">1</text>
  <text x="520.5" y="368" class="tick" text-anchor="middle">2</text>
  <text x="696.7" y="368" class="tick" text-anchor="middle">3</text>
  <text x="162" y="240" class="tick" text-anchor="end">4</text>
  <text x="162" y="134" class="tick" text-anchor="end">8</text>

  <polyline class="cv" points="80.0,42.9 88.8,57.3 97.6,71.2 106.4,84.9 115.2,98.1 124.0,111.1 132.9,123.7 141.7,135.9 150.5,147.8 159.3,159.4 168.1,170.6 176.9,181.5 185.7,192.0 194.5,202.2 203.3,212.0 212.1,221.5 221.0,230.6 229.8,239.4 238.6,247.9 247.4,256.0 256.2,263.7 265.0,271.2 273.8,278.2 282.6,285.0 291.4,291.3 300.2,297.4 309.1,303.1 317.9,308.4 326.7,313.4 335.5,318.1 344.3,322.4 353.1,326.4 361.9,330.0 370.7,333.3 379.5,336.2 388.3,338.8 397.2,341.0 406.0,342.9 414.8,344.5 423.6,345.7 432.4,346.5 441.2,347.1 450.0,347.2 458.8,347.1 467.6,346.6 476.4,345.7 485.3,344.5 494.1,342.9 502.9,341.0 511.7,338.8 520.5,336.2 529.3,333.3 538.1,330.0 546.9,326.4 555.7,322.4 564.5,318.1 573.4,313.4 582.2,308.4 591.0,303.1 599.8,297.4 608.6,291.4 617.4,285.0 626.2,278.2 635.0,271.2 643.8,263.8 652.6,256.0 661.5,247.9 670.3,239.4 679.1,230.6 687.9,221.5 696.7,212.0 705.5,202.2 714.3,192.0 723.1,181.5 731.9,170.6 740.7,159.4 749.6,147.8 758.4,135.9 767.2,123.7 776.0,111.1 784.8,98.2 793.6,84.9 802.4,71.2 811.2,57.3 820.0,43.0"/>

  <g data-key="t0">
    <circle cx="168.1" cy="170.6" r="6" class="bdot"/>
    <line x1="168.1" y1="170.6" x2="168.1" y2="350" class="drop"/>
    <text x="168.1" y="388" class="tick" text-anchor="middle">0</text>
  </g>

  <g data-key="s1">
    <line x1="176" y1="177" x2="303" y2="297" class="mv" marker-end="url(#lr-ag)"/>
    <circle cx="309.1" cy="303.1" r="6" class="gdot"/>
    <line x1="309.1" y1="303.1" x2="309.1" y2="350" class="drop"/>
    <text x="309.1" y="388" class="tick" text-anchor="middle">0.8</text>
    <foreignObject x="240" y="202.96" width="185" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5A8C1C;font-weight:400" data-tex="+0.8"></div></foreignObject>
  </g>

  <g data-key="s2">
    <line x1="316" y1="307" x2="374" y2="333" class="mv" marker-end="url(#lr-ag)"/>
    <circle cx="379.5" cy="336.2" r="6" class="gdot"/>
    <line x1="379.5" y1="336.2" x2="379.5" y2="350" class="drop"/>
    <text x="379.5" y="388" class="tick" text-anchor="middle">1.2</text>
    <text x="350" y="305" class="gl">+0.4</text>
  </g>

  <g data-key="s3">
    <circle cx="414.8" cy="344.5" r="6" class="gdot"/>
    <circle cx="432.4" cy="346.6" r="6" class="gdot"/>
    <text x="414.8" y="410" class="tick" text-anchor="middle">1.4</text>
    <text x="400" y="215" class="gl">шаги гаснут сами: +0.2, затем +0.1</text>
  </g>

  <text x="80" y="442" class="legend">жёлтый: функция потерь · зелёный: шаги спуска</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="t0" data-focus="t0">
      <div class="step-kicker">Шаг 1 · правило</div>
      <h4>Вычесть производную, умноженную на <span class="math-inline" data-tex="\eta"></span></h4>
      <p>Формула целиком описывает алгоритм: направление берём из знака
      производной, длину из её модуля, а <span class="math-inline" data-tex="\eta"></span>
      задаёт общий масштаб. Стартуем из <span class="math-inline" data-tex="w = 0"></span>, где
      <span class="math-inline" data-tex="L = 6.5"></span>.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="w_{\text{new}} = w_{\text{old}} - \eta\,L'(w_{\text{old}})"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L'(w) = 5w - 8, \qquad \eta = 0.1, \qquad w_0 = 0, \qquad L(0) = 6.5"></div></div>
    </div>
    <div class="step-panel" data-on="t0 s1" data-focus="s1">
      <div class="step-kicker">Шаг 2 · первый шаг</div>
      <h4>Крутой склон, длинный шаг</h4>
      <p>Производная в нуле равна −8, значит сдвиг равен
      <span class="math-inline" data-tex="-0.1 \cdot (-8) = +0.8"></span>. Потери падают с 6.5 до 1.7 за один шаг:
      это была самая крутая часть склона.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="w_1 = w_0 - \eta\,L'(w_0)"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="w_1 = 0 - 0.1\cdot(-8) = 0.8, \qquad L:\ 6.5 \to 1.7"></div></div>
    </div>
    <div class="step-panel" data-on="t0 s1 s2" data-focus="s2">
      <div class="step-kicker">Шаг 3 · второй шаг</div>
      <h4>Склон стал положе, шаг короче</h4>
      <p>В точке 0.8 производная равна <span class="math-inline" data-tex="5\cdot 0.8 - 8 = -4"></span>, сдвиг вдвое
      меньше первого. Мы не задавали это правило отдельно: оно возникло само из
      того, что длина шага пропорциональна производной.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="w_2 = w_1 - \eta\,L'(w_1)"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="w_2 = 0.8 - 0.1\cdot(-4) = 1.2, \qquad L:\ 1.7 \to 0.5"></div></div>
    </div>
    <div class="step-panel" data-on="t0 s1 s2 s3" data-focus="s3">
      <div class="step-kicker">Шаг 4 · затухание</div>
      <h4>К минимуму подходим всё мельче</h4>
      <p>1.4, затем 1.5, затем 1.55. Точное значение 1.6 достигается лишь в
      пределе. Для обучения это нормально: нам нужна не точка минимума, а
      достаточно близкая к ней точка.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\bigl|w_{t+1} - w_t\bigr| = \eta\,\bigl|L'(w_t)\bigr|"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="w_3 = 1.2 - 0.1\cdot(-2) = 1.4, \qquad w_4 = 1.4 - 0.1\cdot(-1) = 1.5"></div></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Всё решает <span class="math-inline" data-tex="\eta"></span>. Подставим производную
  <span class="math-inline" data-tex="L'(w) = 5w - 8"></span> в формулу шага и вычтем 1.6 из обеих
  частей. Промах относительно минимума на каждом шаге умножается на одно и то же число:
</p>

<div class="math-display" data-tex="w_{t+1} - 1.6 = (1 - 5\eta)\,(w_t - 1.6)"></div>

<p>
  Отсюда четыре режима. При <span class="math-inline" data-tex="\eta &lt; 0.2"></span> множитель
  положительный, и спуск подходит к дну с одной стороны. При
  <span class="math-inline" data-tex="0.2 &lt; \eta &lt; 0.4"></span> множитель отрицательный, и спуск
  перелетает дно, но промахи затухают. При <span class="math-inline" data-tex="\eta = 0.4"></span>
  множитель равен −1, и спуск бесконечно прыгает между двумя точками. При
  <span class="math-inline" data-tex="\eta &gt; 0.4"></span> промах растёт с каждым шагом. Порог совпадает
  с общей формулой для параболы: <span class="math-inline" data-tex="\eta = 2/L'' = 2/5 = 0.4"></span>.
  Проверьте каждый режим сами.
</p>

<div class="gd-live" id="gdRate">
  <div class="gd-live-head"><strong>Меняйте скорость обучения и старт</strong>
    <p>Слева путь по параболе, справа потери на каждой итерации.</p></div>
  <div class="gd-live-figure"><svg id="gdRateSvg" viewBox="0 0 720 290" role="img" aria-label="Траектория спуска по параболе слева и график потерь по итерациям справа"></svg></div>
  <div class="gd-controls">
    <div class="gd-control"><label for="gdRateEta"><span>Скорость обучения <span class="math-inline" data-tex="\eta"></span></span> <output id="gdRateEtaOut">0.10</output></label>
      <input id="gdRateEta" type="range" min="0.01" max="0.6" step="0.01" value="0.1"></div>
    <div class="gd-control"><label for="gdRateStart"><span>Старт <span class="math-inline" data-tex="w_0"></span></span> <output id="gdRateStartOut">0.0</output></label>
      <input id="gdRateStart" type="range" min="-2" max="4" step="0.1" value="0"></div>
  </div>
  <div class="gd-radios">
    <button type="button" class="gd-chip" data-eta="0.02">η = 0.02</button>
    <button type="button" class="gd-chip" data-eta="0.1">η = 0.1</button>
    <button type="button" class="gd-chip" data-eta="0.2">η = 0.2</button>
    <button type="button" class="gd-chip" data-eta="0.3">η = 0.3</button>
    <button type="button" class="gd-chip" data-eta="0.4">η = 0.4</button>
    <button type="button" class="gd-chip" data-eta="0.55">η = 0.55</button>
  </div>
  <div class="gd-buttons">
    <button type="button" class="gd-btn" id="gdRateStep">Шаг</button>
    <button type="button" class="gd-btn" id="gdRateRun">Запуск</button>
    <button type="button" class="gd-btn" id="gdRateReset">Сброс</button>
  </div>
  <div class="gd-metrics">
    <div class="gd-metric"><span>итерация</span><strong id="gdRateT">0</strong></div>
    <div class="gd-metric"><span>w</span><strong id="gdRateW">—</strong></div>
    <div class="gd-metric"><span>L′(w)</span><strong id="gdRateD">—</strong></div>
    <div class="gd-metric"><span>L(w)</span><strong id="gdRateL">—</strong></div>
    <div class="gd-metric"><span>множитель 1 − 5η</span><strong id="gdRateK">—</strong></div>
  </div>
  <div class="gd-calc" id="gdRateCalc"></div>
  <p class="gd-status" id="gdRateStatus"></p>
</div>

<table class="shape-table">
  <tr><th><span class="math-inline" data-tex="\eta"></span></th><th>Первые значения <span class="math-inline" data-tex="w"></span> из нуля</th><th>Что происходит</th></tr>
  <tr><td>0.02</td><td>0 → 0.16 → 0.30 → 0.43</td><td>направление верное, но спуск сойдётся в разы дольше, а каждый шаг на реальных данных стоит прохода по всей выборке</td></tr>
  <tr><td>0.1</td><td>0 → 0.8 → 1.2 → 1.4</td><td>подходит к дну с одной стороны, шаги укорачиваются сами</td></tr>
  <tr><td>0.3</td><td>0 → 2.4 → 1.2 → 1.8</td><td>перелетает дно, колебания затухают, но шаги тратятся на метания поперёк</td></tr>
  <tr><td>0.4</td><td>0 → 3.2 → 0 → 3.2</td><td>прыгает между двумя точками, потери не меняются</td></tr>
  <tr><td>0.55</td><td>0 → 4.4 → −3.3 → 10.2 → −13.4</td><td>потери растут при любом старте, обучение развалилось</td></tr>
</table>

<div class="callout-yellow">
  <strong>Практическая деталь:</strong> <span class="math-inline" data-tex="\eta"></span>
  не параметр модели, а <em>гиперпараметр</em>: спуск его не подбирает, его выбирает
  человек или расписание. Обычные стартовые значения для нейросетей от 0.1 до
  0.0001, и почти всегда лучше начать с малого и увеличить, чем поймать расходимость
  и не понять, что случилось.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> длину шага задаёт произведение
  <span class="math-inline" data-tex="\eta \cdot L'(w)"></span>: производная тормозит
  спуск у дна автоматически, а <span class="math-inline" data-tex="\eta"></span>
  решает, сходимся мы медленно, быстро или вообще никогда.
</div>

---

## Часть 4. Градиент: направление наискорейшего роста

<p>
  У настоящей модели параметров больше одного. Добавим к нашей прямой свободный
  член. Теперь модель <span class="math-inline" data-tex="\hat{y} = w_0 + w_1 x"></span>,
  и функция потерь стала функцией двух переменных:
</p>

<div class="math-display" data-tex="L(w_0, w_1) = \tfrac{1}{2}\Bigl[(2 - w_0 - w_1)^2 + (3 - w_0 - 2w_1)^2\Bigr]"></div>

<p>
  Здесь «наклон» перестаёт быть одним числом. <strong>Частная производная</strong>
  <span class="math-inline" data-tex="\partial L/\partial w_0"></span> даёт наклон
  вдоль оси <span class="math-inline" data-tex="w_0"></span>, когда
  <span class="math-inline" data-tex="w_1"></span> заморожен; вторая частная даёт
  наклон вдоль второй оси. В стартовой точке <span class="math-inline" data-tex="(0, 0)"></span>:
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial w_0} = \frac{1}{2}\sum -2(y_i - \hat{y}_i) = -5, \qquad \frac{\partial L}{\partial w_1} = \frac{1}{2}\sum -2x_i(y_i - \hat{y}_i) = -8"></div>

<p>
  Но идти-то можно не только вдоль осей: направлений бесконечно много. Направление
  удобно задавать вектором единичной длины
  <span class="math-inline" data-tex="u = (\Delta w_0, \Delta w_1)"></span>,
  <span class="math-inline" data-tex="\|u\| = 1"></span>, иначе мы будем сравнивать
  не направления, а длины векторов. Скорость изменения функции вдоль такого вектора
  называется <strong>производной по направлению</strong>, и считается она на
  удивление просто:
</p>

<div class="math-display" data-tex="L'_u = \Delta w_0 \cdot \frac{\partial L}{\partial w_0} + \Delta w_1 \cdot \frac{\partial L}{\partial w_1}"></div>

<p>
  Вклад каждой оси берётся пропорционально смещению по ней. А справа знакомая
  конструкция: это скалярное произведение вектора <span class="math-inline" data-tex="u"></span> на вектор из
  частных производных. Этот второй вектор и называется <strong>градиентом</strong>:
</p>

<div class="math-display" data-tex="\nabla L = \left(\frac{\partial L}{\partial w_0},\ \frac{\partial L}{\partial w_1}, \dots, \frac{\partial L}{\partial w_n}\right), \qquad L'_u = u \cdot \nabla L"></div>

<div class="stage" id="stageGrad" tabindex="0">
  <div class="stage-figure">
<svg id="gd" viewBox="0 0 960 408" role="img" aria-label="Круг направлений в точке и столбики значений производной по направлению">
  <style>
    #gd { font-family: Helvetica, Arial, sans-serif; }
    #gd .ax   { stroke: #5E5850; stroke-width: 1.3; }
    #gd .ttl  { font-size: 15px; fill: #111111; font-weight: 700; }
    #gd .cap  { font-size: 13px; fill: #5E5850; }
    #gd .circ { fill: none; stroke: #B9C9DA; stroke-width: 1.4; stroke-dasharray: 5 4; }
    #gd .thin { stroke: #9FBEE0; stroke-width: 1.8; fill: none; }
    #gd .vec  { stroke: #3576C0; stroke-width: 2.6; fill: none; }
    #gd .gvec { stroke: #C30B0A; stroke-width: 3.2; fill: none; }
    #gd .avec { stroke: #73B222; stroke-width: 3.2; fill: none; }
    #gd .rl   { font-size: 14px; fill: #C30B0A; }
    #gd .gl   { font-size: 14px; fill: #5A8C1C; }
    #gd .pan  { fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.4; }
    #gd .bar  { fill: #9FBEE0; }
    #gd .barg { fill: #A9D46A; }
    #gd .barr { fill: #E39A99; }
    #gd .td   { font-size: 14px; fill: #111111; }
    #gd .tick { font-size: 13px; fill: #8A8378; }
    #gd .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="gd-ab" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
    <marker id="gd-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
    <marker id="gd-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
  </defs>

  <text x="40" y="36" class="ttl">Все направления из точки (0, 0) и скорость изменения потерь вдоль каждого</text>

  <line x1="110" y1="215" x2="400" y2="215" class="ax"/>
  <line x1="250" y1="350" x2="250" y2="80" class="ax"/>
  <foreignObject x="406" y="199.82" width="62" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="\Delta w_0"></div></foreignObject>
  <foreignObject x="219" y="49.82" width="62" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="\Delta w_1"></div></foreignObject>

  <g data-key="comp">
    <circle cx="250" cy="215" r="110" class="circ"/>
    <circle cx="250" cy="215" r="5" fill="#111111"/>
    <line x1="250" y1="215" x2="327.8" y2="137.2" class="thin"/>
    <line x1="250" y1="215" x2="327.8" y2="292.8" class="thin"/>
    <line x1="250" y1="215" x2="172.2" y2="137.2" class="thin"/>
    <line x1="250" y1="215" x2="172.2" y2="292.8" class="thin"/>
    <text x="128" y="366" class="cap">все векторы длины 1 лежат на окружности</text>
  </g>

  <g data-key="pd">
    <line x1="250" y1="215" x2="352" y2="215" class="vec" marker-end="url(#gd-ab)"/>
    <line x1="250" y1="215" x2="250" y2="113" class="vec" marker-end="url(#gd-ab)"/>
    <foreignObject x="231.5" y="186.82" width="137" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#244F81;font-weight:400" data-tex="u = (1,\ 0)"></div></foreignObject>
    <foreignObject x="176" y="109.82" width="137" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:400" data-tex="u = (0,\ 1)"></div></foreignObject>
  </g>

  <g data-key="grad">
    <line x1="250" y1="215" x2="196" y2="301" class="gvec" marker-end="url(#gd-ar)"/>
    <text x="120" y="322" class="rl">градиент (−5, −8)</text>
  </g>

  <g data-key="anti">
    <line x1="250" y1="215" x2="303" y2="128" class="avec" marker-end="url(#gd-ag)"/>
    <text x="312" y="106" class="gl">антиградиент</text>
  </g>





  <g data-key="bars">
    <rect x="470" y="80" width="470" height="270" rx="10" class="pan"/>
    <text x="492" y="110" class="td">производная по направлению</text>
    <line x1="730" y1="128" x2="730" y2="316" class="ax"/>
    <foreignObject x="551" y="149.82" width="118" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:400;justify-content:flex-end"><span>по оси <span data-tex="w_0"></span></span></div></foreignObject>
    <rect x="675" y="156" width="55" height="18" class="bar"/>
    <text x="738" y="170" class="td">−5.00</text>
    <foreignObject x="518" y="194.82" width="118" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:400;justify-content:flex-end"><span>по оси <span data-tex="w_1"></span></span></div></foreignObject>
    <rect x="642" y="201" width="88" height="18" class="bar"/>
    <text x="738" y="215" class="td">−8.00</text>
    <text x="620" y="260" class="gl" text-anchor="end">антиградиент</text>
    <rect x="626" y="246" width="104" height="18" class="barg"/>
    <text x="738" y="260" class="td">−9.43: рекорд</text>
    <text x="736" y="305" class="rl">градиент</text>
    <rect x="730" y="291" width="104" height="18" class="barr"/>
    <text x="842" y="305" class="td">+9.43</text>
    <text x="626" y="336" class="tick" text-anchor="middle">−9.43</text>
    <text x="730" y="336" class="tick" text-anchor="middle">0</text>
    <text x="834" y="336" class="tick" text-anchor="middle">+9.43</text>
  </g>

  <text x="40" y="398" class="legend">синий: пробные направления · красный: градиент, рост · зелёный: антиградиент, спуск</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="comp" data-focus="comp">
      <div class="step-kicker">Шаг 1 · выбор</div>
      <h4>Из точки на плоскости можно шагнуть куда угодно</h4>
      <p>В одномерном случае вариантов было два: влево или вправо. Теперь их
      бесконечно много, и все они лежат на окружности единичного радиуса. Сравнивать
      имеет смысл только векторы одинаковой длины, иначе выиграет просто самый
      длинный.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\|u\| = 1: \quad \Delta w_0^2 + \Delta w_1^2 = 1"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="u = (1,\,0), \qquad u = (0,\,1), \qquad u = (0.6,\,0.8)"></div></div>
    </div>
    <div class="step-panel" data-on="comp pd" data-focus="pd">
      <div class="step-kicker">Шаг 2 · что мы уже умеем</div>
      <h4>Частные производные отвечают только про два направления</h4>
      <p>Вдоль <span class="math-inline" data-tex="w_0"></span> функция меняется со скоростью −5, вдоль
      <span class="math-inline" data-tex="w_1"></span> со скоростью −8. Оба направления ведут вниз, второе круче.
      Про остальную окружность мы пока ничего не знаем.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\begin{gathered}\frac{\partial L}{\partial w_0} = \tfrac{1}{2}\sum_i -2\bigl(y_i - \hat{y}_i\bigr), \\ \frac{\partial L}{\partial w_1} = \tfrac{1}{2}\sum_i -2x_i\bigl(y_i - \hat{y}_i\bigr)\end{gathered}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\frac{\partial L}{\partial w_0} = -(2 + 3) = -5, \qquad \frac{\partial L}{\partial w_1} = -(1\cdot 2 + 2\cdot 3) = -8"></div></div>
    </div>
    <div class="step-panel" data-on="comp pd" data-focus="pd">
      <div class="step-kicker">Шаг 3 · произвольное направление</div>
      <h4>Смесь двух наклонов пропорционально смещению</h4>
      <p>Для любого <span class="math-inline" data-tex="u = (\Delta w_0, \Delta w_1)"></span> скорость равна
      <span class="math-inline" data-tex="\Delta w_0\cdot (-5) + \Delta w_1\cdot (-8)"></span>. Никаких новых вычислений: двух частных
      производных хватает, чтобы ответить сразу про все направления.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L'_u = \Delta w_0\cdot\frac{\partial L}{\partial w_0} + \Delta w_1\cdot\frac{\partial L}{\partial w_1}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="u = (0.6,\,0.8): \quad L'_u = 0.6\cdot(-5) + 0.8\cdot(-8) = -9.4"></div></div>
    </div>
    <div class="step-panel" data-on="comp pd grad" data-focus="grad">
      <div class="step-kicker">Шаг 4 · вектор из производных</div>
      <h4>Градиент устроен просто: это список частных производных</h4>
      <p>Записав <span class="math-inline" data-tex="\nabla L = (-5, -8)"></span>,
      формулу можно прочитать как скалярное произведение
      <span class="math-inline" data-tex="L'_u = u\cdot\nabla L"></span>. Длина этого
      вектора здесь равна <span class="math-inline" data-tex="\sqrt{25+64} = 9.434"></span>.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\nabla L = \Bigl(\frac{\partial L}{\partial w_0},\ \frac{\partial L}{\partial w_1}\Bigr), \qquad L'_u = u\cdot\nabla L"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\nabla L = (-5,\,-8), \qquad \|\nabla L\| = \sqrt{25 + 64} = \sqrt{89} = 9.434"></div></div>
    </div>
    <div class="step-panel" data-on="comp grad bars" data-focus="bars">
      <div class="step-kicker">Шаг 5 · косинус решает всё</div>
      <h4>Управляем мы только углом</h4>
      <p>По определению скалярного произведения
      <span class="math-inline" data-tex="L'_u = \|u\|\|\nabla L\|\cos\alpha"></span>.
      Длина <span class="math-inline" data-tex="u"></span> равна 1 по договорённости, длина градиента задана точкой
      и функцией. Остаётся угол: максимум при <span class="math-inline" data-tex="\alpha = 0^\circ"></span>: вдоль градиента
      функция растёт быстрее всего.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L'_u = \|u\|\cdot\|\nabla L\|\cdot\cos\alpha"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L'_u = 9.434\,\cos\alpha, \qquad \alpha = 0^\circ: \ L'_u = +9.434"></div></div>
    </div>
    <div class="step-panel" data-on="comp grad anti bars" data-focus="anti">
      <div class="step-kicker">Шаг 6 · разворот</div>
      <h4>Минимум косинуса при 180°</h4>
      <p>Самое быстрое убывание достигается ровно в противоположную сторону:
      <span class="math-inline" data-tex="-\nabla L/\|\nabla L\| = (0.53,\ 0.848)"></span>,
      скорость −9.434. Этот вектор называют <strong>антиградиентом</strong>, и именно
      по нему делает шаг градиентный спуск.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="u = -\frac{\nabla L}{\|\nabla L\|}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="u = \Bigl(\frac{5}{9.434},\ \frac{8}{9.434}\Bigr) = (0.530,\ 0.848), \qquad L'_u = -9.434"></div></div>
    </div>
    <div class="step-panel" data-on="comp pd grad anti bars" data-focus="bars">
      <div class="step-kicker">Шаг 7 · сравнение</div>
      <h4>По осям хуже, чем по антиградиенту</h4>
      <p>−5 и −8 против −9.43: движение вдоль любой оси проигрывает. Столбики
      показывают весь разброс: от +9.43 (вверх по градиенту) до −9.43 (вниз по
      антиградиенту), и ни одно направление не даёт больше по модулю.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="-\|\nabla L\| \;\le\; L'_u \;\le\; \|\nabla L\|"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="-9.434 \;&lt;\; -8 \;&lt;\; -5"></div></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-blue">
  <strong>Почему это работает для любого числа параметров:</strong> в рассуждении
  нигде не использовалось, что переменных ровно две. У сети с миллионом весов
  градиент состоит из миллиона частных производных, и антиградиент точно так же
  остаётся направлением наискорейшего убывания в этом миллионномерном пространстве.
  Нарисовать нельзя, посчитать можно.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> градиент собирает все частные производные
  в один вектор, и этого вектора достаточно, чтобы мгновенно ответить про любое из
  бесконечного множества направлений. Спуск идёт против него.
</div>

---

## Часть 5. Спуск по карте высот

<p>
  Функцию двух переменных удобно рисовать как рельеф: по горизонтали
  <span class="math-inline" data-tex="w_0"></span>, по вертикали <span class="math-inline" data-tex="w_1"></span>, а высота показывает значение потерь.
  Замкнутые кривые называются <strong>линиями уровня</strong>: вдоль такой линии потери
  одинаковы, как горизонтали на топографической карте.
</p>

<p>
  Человек с завязанными глазами, стоящий на этом рельефе, видит ровно то же, что и
  алгоритм: ничего. Он может лишь пощупать наклон вокруг себя и шагнуть туда, где
  спуск круче. Именно это и делает формула шага, теперь векторная:
</p>

<div class="math-display" data-tex="\begin{pmatrix} w_0 \\ w_1 \end{pmatrix}_{\text{new}} = \begin{pmatrix} w_0 \\ w_1 \end{pmatrix}_{\text{old}} - \eta \cdot \nabla L\bigl(w_{\text{old}}\bigr)"></div>

<p>
  Алгоритм целиком умещается в три строки: выбрать начальную точку (обычно
  случайно), посчитать в ней градиент, сдвинуться против него и повторять, пока
  шаги не станут пренебрежимо малы. Посмотрим на траекторию для наших двух точек.
</p>

<div class="stage" id="stageMap" tabindex="0">
  <div class="stage-figure">
<svg id="mp" viewBox="0 0 960 536" role="img" aria-label="Карта линий уровня функции потерь и траектория градиентного спуска из нуля">
  <style>
    #mp { font-family: Helvetica, Arial, sans-serif; }
    #mp .ax   { stroke: #5E5850; stroke-width: 1.3; }
    #mp .tick { font-size: 13px; fill: #8A8378; }
    #mp .lvl  { fill: none; stroke: #C9BE7A; stroke-width: 1.6; }
    #mp .lvl2 { fill: none; stroke: #C29E08; stroke-width: 2; }
    #mp .mv   { stroke: #73B222; stroke-width: 2.8; fill: none; }
    #mp .gv   { stroke: #C30B0A; stroke-width: 2.6; fill: none; }
    #mp .dot  { fill: #3576C0; }
    #mp .gdot { fill: #73B222; }
    #mp .rl   { font-size: 13px; fill: #C30B0A; }
    #mp .gl   { font-size: 13px; fill: #5A8C1C; }
    #mp .val2 { font-size: 14px; fill: #111111; }
    #mp .pan  { fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.4; }
    #mp .th   { font-size: 13px; fill: #244F81; font-weight: 700; }
    #mp .td   { font-size: 14px; fill: #111111; }
    #mp .dash { stroke: #C30B0A; stroke-width: 1.6; stroke-dasharray: 7 5; fill: none; }
    #mp .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="mp-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="mp-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
    <clipPath id="mp-box"><rect x="60" y="60" width="340" height="374"/></clipPath>
  </defs>

  <foreignObject x="40" y="12.6" width="693" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700"><span>Карта потерь <span data-tex="L(w_0, w_1)"></span>: линии уровня и путь спуска при <span data-tex="\eta = 0.1"></span></span></div></foreignObject>

  <line x1="60" y1="383" x2="410" y2="383" class="ax"/>
  <line x1="111" y1="434" x2="111" y2="60" class="ax"/>
  <foreignObject x="416" y="367.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="w_0"></div></foreignObject>
  <foreignObject x="81" y="31.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8A8378;font-weight:400" data-tex="w_1"></div></foreignObject>
  <text x="281" y="401" class="tick" text-anchor="middle">1</text>
  <text x="105" y="218" class="tick" text-anchor="end">1</text>

  <g data-key="map" clip-path="url(#mp-box)">
    <ellipse cx="281" cy="213" rx="1605" ry="234" class="lvl" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="1090" ry="159" class="lvl" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="771" ry="112" class="lvl" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="508" ry="74" class="lvl2" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="345" ry="50" class="lvl" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="168" ry="24" class="lvl" transform="rotate(31.72 281 213)"/>
  </g>

  <g data-key="min">
    <circle cx="281" cy="213" r="6" class="gdot"/>
    <text x="292" y="203" class="val2">минимум (1, 1)</text>
    <foreignObject x="292" y="200.96" width="84" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="L = 0"></div></foreignObject>
  </g>

  <g data-key="start">
    <circle cx="111" cy="383" r="6" class="dot"/>
    <foreignObject x="120" y="376.96" width="266" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400"><span>старт <span data-tex="(0,\ 0),\ L = 6.5"></span></span></div></foreignObject>
  </g>

  <g data-key="g1">
    <line x1="111" y1="383" x2="79" y2="428" class="gv" marker-end="url(#mp-ar)"/>
    <foreignObject x="66" y="425.82" width="165" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400" data-tex="\nabla L = (-5,\ -8)"></div></foreignObject>
  </g>

  <g data-key="s1">
    <line x1="115" y1="377" x2="192" y2="253" class="mv" marker-end="url(#mp-ag)"/>
    <circle cx="196" cy="247" r="6" class="gdot"/>
    <foreignObject x="204" y="241.82" width="352" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5A8C1C;font-weight:400"><span>после шага: <span data-tex="(0.5,\ 0.8),\ L = 0.65"></span></span></div></foreignObject>
  </g>

  <g data-key="s2">
    <line x1="199" y1="242" x2="220" y2="210" class="mv" marker-end="url(#mp-ag)"/>
    <circle cx="223.2" cy="204.5" r="5" class="gdot"/>
    <circle cx="232.2" cy="191.4" r="4" class="gdot"/>
    <circle cx="235.4" cy="187.6" r="4" class="gdot"/>
    <text x="243" y="180" class="gl">и дальше всё мельче</text>
  </g>

  <g data-key="ravine" data-only="1">
    <line x1="60" y1="76.5" x2="399" y2="286" class="dash"/>
    <text x="150" y="95" class="rl">дно долины: вдоль этой линии</text>
    <text x="150" y="115" class="rl">потери почти не меняются</text>
  </g>

  <g data-key="tbl">
    <rect x="440" y="70" width="500" height="250" rx="10" class="pan"/>
    <text x="462" y="100" class="th">шаг</text>
    <foreignObject x="520" y="79.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:700;justify-content:flex-end" data-tex="w_0"></div></foreignObject>
    <foreignObject x="600" y="79.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:700;justify-content:flex-end" data-tex="w_1"></div></foreignObject>
    <foreignObject x="692" y="79.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:700;justify-content:flex-end" data-tex="L"></div></foreignObject>
    <foreignObject x="790" y="79.82" width="60" height="31"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#244F81;font-weight:700" data-tex="\nabla L"></div></foreignObject>
    <line x1="455" y1="112" x2="925" y2="112" class="ax"/>
    <text x="462" y="140" class="td">0</text>
    <text x="580" y="140" class="td" text-anchor="end">0.000</text>
    <text x="660" y="140" class="td" text-anchor="end">0.000</text>
    <text x="752" y="140" class="td" text-anchor="end">6.5000</text>
    <text x="790" y="140" class="td">(−5.00, −8.00)</text>
    <text x="462" y="175" class="td">1</text>
    <text x="580" y="175" class="td" text-anchor="end">0.500</text>
    <text x="660" y="175" class="td" text-anchor="end">0.800</text>
    <text x="752" y="175" class="td" text-anchor="end">0.6500</text>
    <text x="790" y="175" class="td">(−1.60, −2.50)</text>
    <text x="462" y="210" class="td">2</text>
    <text x="580" y="210" class="td" text-anchor="end">0.660</text>
    <text x="660" y="210" class="td" text-anchor="end">1.050</text>
    <text x="752" y="210" class="td" text-anchor="end">0.0708</text>
    <text x="790" y="210" class="td">(−0.53, −0.77)</text>
    <text x="462" y="245" class="td">3</text>
    <text x="580" y="245" class="td" text-anchor="end">0.713</text>
    <text x="660" y="245" class="td" text-anchor="end">1.127</text>
    <text x="752" y="245" class="td" text-anchor="end">0.0133</text>
    <text x="790" y="245" class="td">(−0.19, −0.23)</text>
    <text x="462" y="280" class="td">4</text>
    <text x="580" y="280" class="td" text-anchor="end">0.732</text>
    <text x="660" y="280" class="td" text-anchor="end">1.150</text>
    <text x="752" y="280" class="td" text-anchor="end">0.0075</text>
    <text x="790" y="280" class="td">(−0.09, −0.06)</text>
  </g>


  <g data-key="slow" data-only="1">
    <text x="440" y="446" class="val2">За 4 шага потери упали в 870 раз, но до точки (1, 1)</text>
    <text x="440" y="470" class="val2">этому спуску понадобится ещё около 230 шагов:</text>
    <text x="440" y="494" class="rl">вдоль дна долины градиент почти нулевой.</text>
  </g>

  <text x="40" y="526" class="legend">жёлтый: линии уровня потерь · красный: градиент и проблемное место · зелёный: шаги спуска</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="map min" data-focus="map">
      <div class="step-kicker">Шаг 1 · рельеф</div>
      <h4>Линии уровня: горизонтали карты потерь</h4>
      <p>Каждая кривая соединяет точки с одинаковым значением <span class="math-inline" data-tex="L"></span>. Здесь
      они оказались сильно вытянутыми эллипсами с общим центром в точке
      <span class="math-inline" data-tex="(1, 1)"></span>: там модель <span class="math-inline" data-tex="\hat{y} = 1 + x"></span>
      проходит ровно через оба наблюдения, и потери равны нулю.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="L(w_0, w_1) = \tfrac{1}{2}\Bigl[(y_1 - w_0 - w_1 x_1)^2 + (y_2 - w_0 - w_1 x_2)^2\Bigr]"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L(1, 1) = \tfrac{1}{2}\bigl[(2 - 1 - 1)^2 + (3 - 1 - 2)^2\bigr] = 0"></div></div>
    </div>
    <div class="step-panel" data-on="map min start" data-focus="start">
      <div class="step-kicker">Шаг 2 · старт</div>
      <h4>Начинаем из нуля, ничего не зная о рельефе</h4>
      <p>Алгоритм не видит ни центра, ни линий уровня. Ему известны только
      координаты текущей точки и значение потерь в ней: <span class="math-inline" data-tex="L(0, 0) = 6.5"></span>.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\hat{y}_i = w_0 + w_1 x_i"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="L(0, 0) = \tfrac{1}{2}\bigl[2^2 + 3^2\bigr] = 6.5"></div></div>
    </div>
    <div class="step-panel" data-on="map min start g1" data-focus="g1">
      <div class="step-kicker">Шаг 3 · щупаем склон</div>
      <h4>Градиент указывает вверх по склону</h4>
      <p>В стартовой точке <span class="math-inline" data-tex="\nabla L = (-5, -8)"></span>:
      красная стрелка ведёт от центра, туда, где потери растут. Полезное свойство:
      градиент всегда перпендикулярен линии уровня, ведь вдоль самой линии функция
      не меняется.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\begin{gathered}\frac{\partial L}{\partial w_0} = \tfrac{1}{2}\sum_i -2\bigl(y_i - \hat{y}_i\bigr), \\ \frac{\partial L}{\partial w_1} = \tfrac{1}{2}\sum_i -2x_i\bigl(y_i - \hat{y}_i\bigr)\end{gathered}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\nabla L(0, 0) = (-5,\ -8)"></div></div>
    </div>
    <div class="step-panel" data-on="map min start s1" data-focus="s1">
      <div class="step-kicker">Шаг 4 · первый шаг</div>
      <h4>Разворачиваемся и умножаем на <span class="math-inline" data-tex="\eta"></span></h4>
      <p>Сдвиг равен <span class="math-inline" data-tex="-0.1\cdot (-5, -8) = (0.5, 0.8)"></span>. Одним шагом потери
      падают с 6.5 до 0.65, в десять раз. Обе координаты обновляются одновременно
      и независимо: у каждого параметра своя частная производная.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\begin{pmatrix} w_0 \\ w_1 \end{pmatrix}_{\text{new}} = \begin{pmatrix} w_0 \\ w_1 \end{pmatrix}_{\text{old}} - \eta\,\nabla L"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\begin{pmatrix} 0.5 \\ 0.8 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \end{pmatrix} - 0.1\begin{pmatrix} -5 \\ -8 \end{pmatrix}, \qquad L = 0.65"></div></div>
    </div>
    <div class="step-panel" data-on="map min start s1 s2 tbl" data-focus="tbl">
      <div class="step-kicker">Шаг 5 · дальше</div>
      <h4>Шаги укорачиваются быстрее, чем хотелось бы</h4>
      <p>Второй шаг переносит нас в <span class="math-inline" data-tex="(0.66, 1.05)"></span>, третий в
      <span class="math-inline" data-tex="(0.713, 1.127)"></span>. Потери уже 0.0133, но точка всё ещё далеко от
      центра карты: спуск явно замедлился, не дойдя до цели.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\begin{pmatrix} w_0 \\ w_1 \end{pmatrix}_{\text{new}} = \begin{pmatrix} w_0 \\ w_1 \end{pmatrix}_{\text{old}} - \eta\,\nabla L"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\begin{pmatrix} 0.66 \\ 1.05 \end{pmatrix} = \begin{pmatrix} 0.5 \\ 0.8 \end{pmatrix} - 0.1\begin{pmatrix} -1.60 \\ -2.50 \end{pmatrix}, \qquad L = 0.0708"></div></div>
    </div>
    <div class="step-panel" data-on="map min s2 ravine" data-focus="ravine">
      <div class="step-kicker">Шаг 6 · диагноз</div>
      <h4>Мы в узкой долине</h4>
      <p>Кривизна поперёк долины примерно в 47 раз больше, чем вдоль неё: это отношение
      собственных чисел матрицы вторых производных, а сами эллипсы вытянуты в
      <span class="math-inline" data-tex="\sqrt{47} \approx 6.9"></span> раза. Поперёк долины склон крутой,
      вдоль неё почти плоский. Спуск быстро сваливается на дно, а потом ползёт
      вдоль него микроскопическими шагами: градиент там почти ноль.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\frac{\lambda_{\max}}{\lambda_{\min}}"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="\frac{6.854}{0.146} \approx 47, \qquad \sqrt{47} \approx 6.9"></div></div>
    </div>
    <div class="step-panel" data-on="map min start s1 s2 slow" data-focus="slow">
      <div class="step-kicker">Шаг 7 · цена</div>
      <h4>Ещё 230 шагов до точного попадания</h4>
      <p>С <span class="math-inline" data-tex="\eta = 0.1"></span> в окрестность
      <span class="math-inline" data-tex="(1, 1)"></span> спуск приходит примерно за 237 итераций, при том что
      первые 90% потерь ушли за один шаг. Именно из-за таких долин придумали
      инерцию и нормировку признаков; о них в следующей части.</p>
      <div class="step-math"><span class="step-math-label">Формула</span><div class="math-display" data-tex="\bigl\|w_t - (1,\,1)\bigr\| &lt; 0.01"></div>
      <span class="step-math-label">На числах</span><div class="math-display" data-tex="t \approx 237 \quad \text{при } \eta = 0.1"></div></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Та же карта вживую. Запустите спуск и смотрите одновременно на точку на карте и на
  прямую справа: каждая точка карты задаёт одну прямую. Щелчок по карте выбирает другой старт.
</p>

<div class="gd-live" id="gdMap">
  <div class="gd-live-head"><strong>Спуск по карте и прямая на данных</strong>
    <p>Зелёная точка в центре карты: минимум <span class="math-inline" data-tex="(1, 1)"></span>, где прямая проходит через обе точки.</p></div>
  <div class="gd-live-figure"><svg id="gdMapSvg" viewBox="0 0 720 330" role="img" aria-label="Карта линий уровня с траекторией спуска слева и соответствующая прямая на данных справа"></svg></div>
  <div class="gd-controls">
    <div class="gd-control"><label for="gdMapEta"><span>Скорость обучения <span class="math-inline" data-tex="\eta"></span></span> <output id="gdMapEtaOut">0.10</output></label>
      <input id="gdMapEta" type="range" min="0.02" max="0.32" step="0.01" value="0.1"></div>
  </div>
  <div class="gd-buttons">
    <button type="button" class="gd-btn" id="gdMapStep">Шаг</button>
    <button type="button" class="gd-btn" id="gdMapRun">Запуск</button>
    <button type="button" class="gd-btn" id="gdMapReset">Сброс</button>
  </div>
  <div class="gd-metrics">
    <div class="gd-metric"><span>итерация</span><strong id="gdMapT">0</strong></div>
    <div class="gd-metric"><span>точка на карте</span><strong id="gdMapP">—</strong></div>
    <div class="gd-metric"><span>потери L</span><strong id="gdMapL">—</strong></div>
    <div class="gd-metric"><span>длина градиента</span><strong id="gdMapG">—</strong></div>
  </div>
  <p class="gd-status" id="gdMapStatus"></p>
</div>

<p>
  У этой карты свой порог скорости. Он задаётся самым крутым направлением:
  <span class="math-inline" data-tex="\eta &lt; 2/\lambda_{\max} = 2/6.854 \approx 0.29"></span>.
  Число итераций от <span class="math-inline" data-tex="\eta"></span> зависит сильно: 476 при 0.05,
  237 при 0.1, 118 при 0.2 и 84 при 0.28. Уже при 0.3 спуск расходится.
</p>

<div class="callout-red">
  <strong>Чего спуск не гарантирует:</strong> он находит <em>локальный</em> минимум:
  ту яму, в которую скатился из своей случайной стартовой точки. Если рельеф
  сложный, из другой инициализации получится другой ответ. Отдельная беда: седловые
  точки и плато, где градиент близок к нулю, хотя рядом есть путь вниз. Для
  выпуклых потерь (MSE линейной регрессии, log loss логистической) проблемы нет:
  яма там одна.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> в каждой точке спуск знает только градиент,
  то есть направление наибольшего подъёма. Число шагов зависит от формы рельефа: на круглых
  ямах их единицы, в нашей вытянутой долине 237 при той же
  <span class="math-inline" data-tex="\eta = 0.1"></span>.
</div>

---

## Часть 6. Цикл обучения: батч, SGD, инерция

<p>
  Соберём всё, что было, в один цикл. Он одинаков для линейной регрессии и для
  сети с миллиардом параметров, меняется только то, насколько сложно вычислить
  предсказание и градиент. В коде это четыре строки. Ниже они выполняются по одной:
  нажимайте кнопку и смотрите, что каждая строка делает с графиками.
</p>

<div class="gd-live" id="gdLoop">
  <div class="gd-live-head"><strong>Четыре строки цикла на графиках</strong>
    <p>Серые строки: данные и настройка, их цикл не трогает. Жёлтая подсветка: строка, которая выполняется сейчас.</p></div>
  <div class="gd-code" aria-label="Код цикла обучения">
    <div class="is-given">x, y = np.array([1., 2.]), np.array([2., 3.])</div>
    <div class="is-given">w, eta = 0.0, 0.1</div>
    <div data-line="0">y_hat = w * x                            # предсказать</div>
    <div data-line="1">loss  = np.mean((y - y_hat) ** 2)        # оценить</div>
    <div data-line="2">grad  = np.mean(-2 * x * (y - y_hat))    # продифференцировать</div>
    <div data-line="3">w     = w - eta * grad                   # шагнуть</div>
  </div>
  <div class="gd-buttons">
    <button type="button" class="gd-btn" id="gdLoopNext">Следующая строка →</button>
    <button type="button" class="gd-btn" id="gdLoopReset">Сброс</button>
  </div>
  <div class="gd-live-figure"><svg id="gdLoopSvg" viewBox="0 0 720 280" role="img" aria-label="Данные и прямая модели слева, парабола потерь с текущей точкой, касательной и шагом справа"></svg></div>
  <div class="gd-metrics">
    <div class="gd-metric"><span>итерация</span><strong id="gdLoopIt">0</strong></div>
    <div class="gd-metric"><span>текущий w</span><strong id="gdLoopW">0.000</strong></div>
  </div>
  <div class="gd-note" data-phase="-1">
    <h4>Перед циклом</h4>
    <p>Выборка фиксирована, её трогать нельзя. Единственное, что меняется в ходе обучения, это
    <span class="math-inline" data-tex="w"></span>. Скорость <span class="math-inline" data-tex="\eta"></span> выбирает человек. Нажмите «Следующая строка».</p>
  </div>
  <div class="gd-note" data-phase="0" hidden>
    <h4>Строка 1 · предсказать</h4>
    <p>Данные превращаются в предсказания: кружки на прямой. Форма сохраняется: сколько объектов на входе, столько предсказаний на выходе.</p>
    <span class="step-math-label">Формула</span><div class="math-display" data-tex="\hat y_i = w\,x_i"></div>
    <span class="step-math-label">На числах</span><div class="gd-note-numbers" id="gdLoopNum0"></div>
  </div>
  <div class="gd-note" data-phase="1" hidden>
    <h4>Строка 2 · оценить</h4>
    <p>Промахи возводятся в квадрат и усредняются. Это единственное место в цикле, где размерность падает до одного числа. На параболе появляется точка с этой высотой.</p>
    <span class="step-math-label">Формула</span><div class="math-display" data-tex="L = \frac{1}{n}\sum_{i=1}^{n}\bigl(y_i - \hat y_i\bigr)^2"></div>
    <span class="step-math-label">На числах</span><div class="gd-note-numbers" id="gdLoopNum1"></div>
  </div>
  <div class="gd-note" data-phase="2" hidden>
    <h4>Строка 3 · продифференцировать</h4>
    <p>Производная той же суммы. Каждое слагаемое даёт <span class="math-inline" data-tex="-2x_i(y_i - \hat y_i)"></span>: признак входит множителем, поэтому параметр при большем признаке получает и больший градиент. На параболе это наклон касательной.</p>
    <span class="step-math-label">Формула</span><div class="math-display" data-tex="L'(w) = \frac{1}{n}\sum_{i=1}^{n} -2x_i\bigl(y_i - \hat y_i\bigr)"></div>
    <span class="step-math-label">На числах</span><div class="gd-note-numbers" id="gdLoopNum2"></div>
  </div>
  <div class="gd-note" data-phase="3" hidden>
    <h4>Строка 4 · шагнуть</h4>
    <p>Только эта строка меняет модель. Данные не изменились, а потери и градиент были промежуточными величинами. Прямая становится зелёной, точка на параболе съезжает вниз, и цикл начинается заново.</p>
    <span class="step-math-label">Формула</span><div class="math-display" data-tex="w \leftarrow w - \eta\,L'(w)"></div>
    <span class="step-math-label">На числах</span><div class="gd-note-numbers" id="gdLoopNum3"></div>
  </div>
  <div class="gd-table-wrap">
    <table class="shape-table">
      <thead><tr><th>Итерация</th><th>w</th><th>L</th><th>L′(w)</th><th>новый w</th></tr></thead>
      <tbody id="gdLoopRows"></tbody>
    </table>
  </div>
</div>

<p>
  После четырёх итераций получается 0 → 0.8 → 1.2 → 1.4 → 1.5, а потери идут
  6.5 → 1.7 → 0.5 → 0.2 → 0.125. Один полный проход по всей выборке называют
  <strong>эпохой</strong>; здесь каждая итерация считает сумму по всей выборке, поэтому итерация и эпоха совпадают.
</p>

<p>
  Самая дорогая часть цикла стоит во второй и третьей строках: сумма по всем объектам.
  Каждая итерация читает весь датасет. При миллионах объектов сумму считают по случайному
  <strong>мини-батчу</strong>: формулы остаются теми же, меняется только набор слагаемых.
</p>

### Стохастический спуск: дешевле шаг, шумнее путь

<p>
  <strong>Стохастический градиентный спуск</strong> (SGD) считает градиент не по всей
  выборке, а по одному объекту (или небольшому батчу) и сразу делает шаг. Цена
  итерации падает с <span class="math-inline" data-tex="O(n)"></span> до <span class="math-inline" data-tex="O(1)"></span>, а траектория становится
  дёрганой, потому что у каждого объекта своя функция потерь со своим минимумом.
  Разложим нашу параболу на два слагаемых:
</p>

<div class="math-display" data-tex="\begin{gathered}L_1(w) = (2 - w)^2, \qquad L_2(w) = (3 - 2w)^2, \\ L(w) = \tfrac{1}{2}\bigl[L_1(w) + L_2(w)\bigr]\end{gathered}"></div>

<p>
  Минимум <span class="math-inline" data-tex="L_1"></span> лежит при <span class="math-inline" data-tex="w = 2"></span>,
  минимум <span class="math-inline" data-tex="L_2"></span> при <span class="math-inline" data-tex="w = 1.5"></span>, минимум их среднего при
  <span class="math-inline" data-tex="w = 1.6"></span>. Производная суммы равна сумме производных, поэтому полный
  градиент получается усреднением: при <span class="math-inline" data-tex="w = 0"></span> объекты дают −4 и −12, в среднем −8.
</p>

<div class="gd-live" id="gdTwo">
  <div class="gd-live-head"><strong>Каждый объект тянет к своему минимуму</strong>
    <p>Стрелки сверху показывают, куда сдвинул бы <span class="math-inline" data-tex="w"></span> каждый градиент: синяя от объекта 1, тёмная от объекта 2, жёлтая от их среднего. Скорость обучения <span class="math-inline" data-tex="\eta = 0.1"></span>.</p></div>
  <div class="gd-radios">
    <button type="button" class="gd-chip" data-mode="both">Оба объекта</button>
    <button type="button" class="gd-chip" data-mode="one">Только объект 1</button>
    <button type="button" class="gd-chip" data-mode="two">Только объект 2</button>
    <button type="button" class="gd-chip" data-mode="sgd">По очереди (SGD)</button>
  </div>
  <div class="gd-live-figure"><svg id="gdTwoSvg" viewBox="0 0 720 290" role="img" aria-label="Параболы потерь двух объектов и их среднего, текущая точка и стрелки сдвига"></svg></div>
  <div class="gd-controls">
    <div class="gd-control"><label for="gdTwoW"><span>Текущий <span class="math-inline" data-tex="w"></span></span> <output id="gdTwoWOut">0.000</output></label>
      <input id="gdTwoW" type="range" min="0" max="3" step="0.01" value="0"></div>
  </div>
  <div class="gd-buttons">
    <button type="button" class="gd-btn" id="gdTwoStep">Шаг</button>
    <button type="button" class="gd-btn" id="gdTwoRun">Запуск</button>
    <button type="button" class="gd-btn" id="gdTwoReset">Сброс</button>
  </div>
  <div class="gd-metrics">
    <div class="gd-metric"><span>кто считает шаг</span><strong id="gdTwoNow">—</strong></div>
    <div class="gd-metric"><span>градиент объекта 1</span><strong id="gdTwoG1">—</strong></div>
    <div class="gd-metric"><span>градиент объекта 2</span><strong id="gdTwoG2">—</strong></div>
    <div class="gd-metric"><span>их среднее</span><strong id="gdTwoGM">—</strong></div>
  </div>
  <div class="gd-calc" id="gdTwoCalc"></div>
  <p class="gd-status" id="gdTwoStatus"></p>
</div>

<p>
  Возьмём наши два наблюдения по очереди, <span class="math-inline" data-tex="\eta = 0.1"></span>:
</p>

<table class="shape-table">
  <tr><th>Шаг</th><th>Объект</th><th>Градиент по одному объекту</th><th>w после шага</th></tr>
  <tr><td>1</td><td>(1, 2)</td><td><span class="math-inline" data-tex="-2\cdot 1\cdot(2 - 0) = -4"></span></td><td>0.400</td></tr>
  <tr><td>2</td><td>(2, 3)</td><td><span class="math-inline" data-tex="-2\cdot 2\cdot(3 - 0.4\cdot 2) = -8.8"></span></td><td>1.280</td></tr>
  <tr><td>3</td><td>(1, 2)</td><td><span class="math-inline" data-tex="-2\cdot 1\cdot(2 - 1.28) = -1.44"></span></td><td>1.424</td></tr>
  <tr><td>4</td><td>(2, 3)</td><td><span class="math-inline" data-tex="-2\cdot 2\cdot(3 - 2.848) = -0.608"></span></td><td>1.485</td></tr>
</table>

<p>
  За четыре дешёвых шага SGD подошёл к 1.485, примерно туда же, куда полный спуск
  добрался за четыре дорогих. Но у шума есть цена: продолжив, мы увидим не
  сходимость в точку, а блуждание вокруг неё (1.52, 1.62, 1.52, 1.62 …). В режиме
  «По очереди» это видно: дно среднего лежит между двумя минимумами, и объекты всё время
  перетягивают <span class="math-inline" data-tex="w"></span> друг у друга.
  Поэтому скорость обучения со временем уменьшают: шум надо гасить руками.
</p>

### Инерция: лекарство от узких долин

<p>
  Вернёмся к вытянутой долине из части 5. Проблема была не в скорости обучения, а в
  том, что градиент раз за разом указывает поперёк долины. <strong>Momentum</strong>
  копит скорость, как шарик, катящийся по склону: если несколько шагов подряд
  тянут в одну сторону, движение разгоняется, а колебания поперёк гасят друг друга.
</p>

<div class="math-display" data-tex="v_t = \alpha\,v_{t-1} + \eta\,\nabla L(w_{t-1}), \qquad w_t = w_{t-1} - v_t"></div>

<p>
  На нашей карте высот с <span class="math-inline" data-tex="\alpha = 0.9"></span>
  и той же <span class="math-inline" data-tex="\eta = 0.1"></span> спуск доходит до
  окрестности <span class="math-inline" data-tex="(1, 1)"></span> примерно за 48 итераций вместо 237, почти в пять
  раз быстрее, хотя формула изменилась на одну строку. Поменяйте <span class="math-inline" data-tex="\alpha"></span> и сравните.
</p>

<div class="gd-live" id="gdMom">
  <div class="gd-live-head"><strong>Спуск с инерцией и без неё</strong>
    <p>Серая линия без инерции, синяя с инерцией. Щелчок по карте выбирает другой старт.</p></div>
  <div class="gd-live-figure"><svg id="gdMomSvg" viewBox="0 0 720 330" role="img" aria-label="Две траектории на карте линий уровня слева и потери по итерациям в логарифмической шкале справа"></svg></div>
  <div class="gd-controls">
    <div class="gd-control"><label for="gdMomA"><span>Инерция <span class="math-inline" data-tex="\alpha"></span></span> <output id="gdMomAOut">0.90</output></label>
      <input id="gdMomA" type="range" min="0" max="0.98" step="0.01" value="0.9"></div>
    <div class="gd-control"><label for="gdMomEta"><span>Скорость <span class="math-inline" data-tex="\eta"></span></span> <output id="gdMomEtaOut">0.10</output></label>
      <input id="gdMomEta" type="range" min="0.02" max="0.28" step="0.01" value="0.1"></div>
  </div>
  <div class="gd-buttons">
    <button type="button" class="gd-btn" id="gdMomRun">Показать движение</button>
    <button type="button" class="gd-btn" id="gdMomReset">Сброс</button>
  </div>
  <div class="gd-metrics">
    <div class="gd-metric"><span>итераций без инерции</span><strong id="gdMomN0">—</strong></div>
    <div class="gd-metric"><span>итераций с инерцией</span><strong id="gdMomN1">—</strong></div>
    <div class="gd-metric"><span>выигрыш</span><strong id="gdMomRatio">—</strong></div>
  </div>
  <p class="gd-status" id="gdMomStatus"></p>
</div>

<table class="shape-table">
  <tr><th>Метод</th><th>Чем считает градиент</th><th>Что добавляет</th><th>Где выигрывает</th></tr>
  <tr><td>Полный (batch) GD</td><td>вся выборка</td><td>—</td><td>гладкая траектория, но дорогой шаг</td></tr>
  <tr><td>SGD / мини-батч</td><td>один объект или батч</td><td>шум</td><td>дешёвый шаг, выбирается из мелких ям</td></tr>
  <tr><td>Momentum</td><td>батч</td><td>инерция <span class="math-inline" data-tex="\alpha"></span></td><td>вытянутые долины, плато</td></tr>
  <tr><td>Nesterov</td><td>батч</td><td>градиент в точке «после инерции»</td><td>тот же разгон, меньше перелёты</td></tr>
  <tr><td>RMSprop / Adam</td><td>батч</td><td>своя <span class="math-inline" data-tex="\eta"></span> для каждого параметра</td><td>разномасштабные параметры — база для нейросетей</td></tr>
</table>

<div class="callout-blue">
  <strong>Что общего у всех строк таблицы:</strong> ни одна из них не меняет
  ни функцию потерь, ни способ вычисления градиента. Меняется только правило, по
  которому из градиента получается шаг. Поэтому всё, что вы поняли про
  <span class="math-inline" data-tex="w \leftarrow w - \eta\nabla L"></span>, остаётся
  верным и для Adam.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обучение устроено как замкнутый цикл
  «предсказать → оценить → продифференцировать → шагнуть», и параметры меняются
  ровно в одной его точке. Все модификации спуска живут внутри этой одной строки.
</div>

---

## Часть 7. Нейросеть: та же формула шага, двенадцать параметров

<p>
  У регрессии параметров было один или два. У сети их сотни тысяч, но сам спуск не меняется
  ни на символ: та же формула, только применённая к каждому из параметров.
</p>

<p>
  Возьмём сеть 2-2-2 с сигмоидами. Вход <span class="math-inline" data-tex="(0.5, 0.8)"></span>, цель <span class="math-inline" data-tex="(1, 0)"></span>, двенадцать
  параметров: восемь весов и четыре смещения. Как получить все двенадцать производных за один
  проход по сети, разобрано в статье
  <a href="article.html?slug=backprop">«Обратное распространение ошибки: как читать сеть справа налево»</a>.
  Здесь градиент считается внутри интерактива, а нас интересует, что спуск с ним делает.
</p>

### Что именно здесь минимизируется


<p>
  В части 1 мы выписали функцию потерь целиком, подставили в неё данные и увидели,
  что от выборки остались три числа, а от задачи парабола
  <span class="math-inline" data-tex="L(w) = 2.5\,w^2 - 8w + 6.5"></span>. Прежде
  чем считать градиенты сети, сделаем ровно то же самое: выпишем функцию, значение
  которой мы собираемся уменьшать, и посмотрим, что от неё останется после
  подстановки данных.
</p>

<p>
  Модель состоит из двух слоёв с сигмоидами, поэтому предсказание записывается одной строкой:
</p>

<div class="math-display" data-tex="\hat{\mathbf y} = \sigma\!\left(\mathbf W^{(2)}\sigma\!\left(\mathbf W^{(1)}\mathbf x + \mathbf b^{(1)}\right) + \mathbf b^{(2)}\right)"></div>

<p>
  Ошибка на одном объекте равна половине квадрата длины вектора промаха. Множитель
  <span class="math-inline" data-tex="\tfrac{1}{2}"></span> здесь другой, чем в части 1: там это был делитель
  <span class="math-inline" data-tex="1/n"></span> при двух объектах, а здесь объект один, и половина нужна только
  чтобы двойка сократилась при дифференцировании.
</p>

<div class="math-display" data-tex="E(\theta) = \tfrac{1}{2}\bigl\|\hat{\mathbf y} - \mathbf y\bigr\|^2 = \tfrac{1}{2}\Bigl[\bigl(\hat{y}_1 - y_1\bigr)^2 + \bigl(\hat{y}_2 - y_2\bigr)^2\Bigr]"></div>

<p>
  Буква <span class="math-inline" data-tex="\theta"></span> служит сокращением для
  всех параметров сразу: <span class="math-inline" data-tex="\theta = \bigl(\mathbf W^{(1)}, \mathbf b^{(1)}, \mathbf W^{(2)}, \mathbf b^{(2)}\bigr)"></span>,
  двенадцать чисел. Раскроем запись по индексам, слой за слоем:
</p>

<div class="math-display" data-tex="h_1 = \sigma\bigl(w^{(1)}_{11}x_1 + w^{(1)}_{12}x_2 + b^{(1)}_1\bigr), \qquad h_2 = \sigma\bigl(w^{(1)}_{21}x_1 + w^{(1)}_{22}x_2 + b^{(1)}_2\bigr)"></div>

<div class="math-display" data-tex="\hat{y}_1 = \sigma\bigl(w^{(2)}_{11}h_1 + w^{(2)}_{12}h_2 + b^{(2)}_1\bigr), \qquad \hat{y}_2 = \sigma\bigl(w^{(2)}_{21}h_1 + w^{(2)}_{22}h_2 + b^{(2)}_2\bigr)"></div>

<p>
  И подставляем наш единственный объект: <span class="math-inline" data-tex="\mathbf x = (0.5,\ 0.8)"></span>,
  <span class="math-inline" data-tex="\mathbf y = (1,\ 0)"></span>. Данные уходят внутрь
  формулы и больше нигде не появляются:
</p>

<div class="math-display" data-tex="\begin{gathered}E(\theta) = \tfrac{1}{2}\Bigl[\Bigl(\sigma\bigl(w^{(2)}_{11}\,\sigma(0.5\,w^{(1)}_{11} + 0.8\,w^{(1)}_{12} + b^{(1)}_1) \\ + w^{(2)}_{12}\,\sigma(0.5\,w^{(1)}_{21} + 0.8\,w^{(1)}_{22} + b^{(1)}_2) + b^{(2)}_1\bigr) - 1\Bigr)^2 \\ + \Bigl(\sigma\bigl(w^{(2)}_{21}\,\sigma(0.5\,w^{(1)}_{11} + 0.8\,w^{(1)}_{12} + b^{(1)}_1) \\ + w^{(2)}_{22}\,\sigma(0.5\,w^{(1)}_{21} + 0.8\,w^{(1)}_{22} + b^{(1)}_2) + b^{(2)}_2\bigr) - 0\Bigr)^2\Bigr]\end{gathered}"></div>

<p>
  Формула длинная, но устроена она так же, как парабола из части 1: слева имя
  функции, справа выражение, в котором нет ничего, кроме двенадцати параметров и
  чисел. Подставьте в него любые двенадцать значений и получите одно число. Это и
  есть тот функционал, который спуск уменьшает.
</p>

<div class="callout-blue">
  <strong>Про слово «функционал».</strong> Строго говоря, перед нами обычная
  функция двенадцати переменных, а функционалом называют отображение из пространства
  функций в число. В русскоязычной традиции машинного обучения за
  <span class="math-inline" data-tex="E(\theta)"></span> закрепилось название
  «функционал качества», и путаницы оно не создаёт: важно, что аргументы у него
  параметры, а не данные.
</div>

<p>
  А вот чем эта функция отличается от параболы:
</p>

<table class="shape-table">
  <tr><th></th><th>Часть 1: регрессия</th><th>Часть 7: сеть 2-2-2</th></tr>
  <tr><td>Сколько аргументов</td><td>1 (<span class="math-inline" data-tex="w"></span>)</td><td>12</td></tr>
  <tr><td>Что осталось после подстановки данных</td><td><span class="math-inline" data-tex="2.5\,w^2 - 8w + 6.5"></span></td><td>сигмоида от сигмоиды, дважды</td></tr>
  <tr><td>Уравнение <span class="math-inline" data-tex="\nabla E = 0"></span></td><td>линейное, решается в строчку</td><td>12 нелинейных уравнений, общего решения нет</td></tr>
  <tr><td>Форма графика</td><td>парабола с дном</td><td>плато — обрыв — плато, дно на бесконечности</td></tr>
  <tr><td>Как искать минимум</td><td>можно точно, можно спуском</td><td>только спуском</td></tr>
</table>

<p>
  Строку про форму графика можно проверить на срезе. Двенадцать
  измерений нарисовать нельзя, но можно зафиксировать одиннадцать параметров и
  посмотреть, как <span class="math-inline" data-tex="E"></span> зависит от
  двенадцатого. В интерактиве ниже срез строится по любому параметру, а заодно здесь же
  можно сделать настоящий шаг спуска. При стартовых весах <span class="math-inline" data-tex="\hat{\mathbf y} = (0.5316, 0.6459)"></span>
  и <span class="math-inline" data-tex="E(\theta) = 0.3183"></span>.
</p>

<div class="gd-live" id="gdNet">
  <div class="gd-live-head"><strong>Срез по любому параметру и настоящий шаг спуска</strong>
    <p>Щёлкните по ребру или смещению: справа появится срез функции потерь по этому параметру, синяя точка покажет текущее значение, красная линия наклон. Кнопка «Шаг спуска» обновляет сразу все двенадцать чисел.</p></div>
  <div class="gd-live-figure"><svg id="gdNetSvg" viewBox="0 0 720 440" role="img" aria-label="Граф сети 2-2-2 с весами на рёбрах слева, срез функции потерь по выбранному параметру справа, потери по шагам спуска снизу"></svg></div>
  <div class="gd-controls">
    <div class="gd-control"><label for="gdNetVal"><span>Параметр <span id="gdNetValName"></span></span> <output id="gdNetValOut">—</output></label>
      <input id="gdNetVal" type="range" min="-10" max="10" step="0.05" value="0.5"></div>
    <div class="gd-control"><label for="gdNetEta"><span>Скорость <span class="math-inline" data-tex="\eta"></span></span> <output id="gdNetEtaOut">0.5</output></label>
      <input id="gdNetEta" type="range" min="0.1" max="3" step="0.1" value="0.5"></div>
  </div>
  <div class="gd-buttons">
    <button type="button" class="gd-btn" id="gdNetStep">Шаг спуска</button>
    <button type="button" class="gd-btn" id="gdNetRun">50 шагов</button>
    <button type="button" class="gd-btn" id="gdNetReset">Сброс</button>
  </div>
  <div class="gd-metrics">
    <div class="gd-metric"><span>шаг</span><strong id="gdNetT">0</strong></div>
    <div class="gd-metric"><span>потери E</span><strong id="gdNetE">—</strong></div>
    <div class="gd-metric gd-metric-wide"><span>выход сети</span><strong id="gdNetY">—</strong></div>
    <div class="gd-metric"><span>производная по параметру</span><strong id="gdNetD">—</strong></div>
  </div>
  <div class="gd-calc" id="gdNetCalc"></div>
</div>

<p>
  Что здесь стоит проверить руками.
</p>

<ul>
  <li><strong>Срез не парабола.</strong> Выберите <span class="math-inline" data-tex="w^{(2)}_{11}"></span>:
  слева кривая упирается в 0.7086, справа в 0.2086, и нигде не разворачивается вверх.
  Минимума в конечной точке нет, а 0.2086 это вклад второго выхода, на который этот вес вообще не влияет.</li>
  <li><strong>Производная равна наклону среза.</strong> В стартовой точке у
  <span class="math-inline" data-tex="w^{(2)}_{11}"></span> она равна −0.0588. Это та же производная, что
  <span class="math-inline" data-tex="L'(w)"></span> из части 2, только взятая по одному из двенадцати аргументов.</li>
  <li><strong>Срезы очень разные.</strong> Срез по <span class="math-inline" data-tex="w^{(1)}_{11}"></span>
  почти горизонтален: сдвиньте этот вес хоть на бесконечность, потери изменятся всего на 0.029, а наклон
  здесь −0.0036, в 16 раз мельче. Двенадцать таких наклонов, собранных в вектор, и есть
  <span class="math-inline" data-tex="\nabla E"></span>.</li>
  <li><strong>Шаг тот же, что в части 3.</strong> С <span class="math-inline" data-tex="\eta = 0.5"></span>
  первый вес меняется так: <span class="math-inline" data-tex="0.50 - 0.5\cdot(-0.0588) = 0.5294"></span>,
  и так по каждому параметру. После одного шага <span class="math-inline" data-tex="\hat{\mathbf y} = (0.5554, 0.6177)"></span>
  и <span class="math-inline" data-tex="E = 0.2896"></span>, через 50 шагов <span class="math-inline" data-tex="E = 0.0186"></span>.</li>
</ul>

<div class="callout-red">
  <strong>Почему точный метод здесь не работает.</strong> В части 1 мы решили
  <span class="math-inline" data-tex="L'(w) = 5w - 8 = 0"></span> в одну строчку.
  Здесь <span class="math-inline" data-tex="\nabla E = 0"></span> означает систему из
  двенадцати уравнений, в каждом из которых сигмоида от сигмоиды. Общего способа
  её решить нет, а у срезов, как видно в интерактиве, дно вообще уезжает на
  бесконечность. Остаётся идти вниз по наклону, то есть спуск.
</div>

### А если объектов не один, а много?

<p>
  Меняется ровно одно место: количество слагаемых, как и в части 1. Функция потерь
  по выборке из <span class="math-inline" data-tex="n"></span> объектов усредняет
  ошибку по объектам, а зависимость от параметров у каждого слагаемого своя:
</p>

<div class="math-display" data-tex="E(\theta) = \frac{1}{n}\sum_{i=1}^{n} \tfrac{1}{2}\bigl\|\hat{\mathbf y}(\mathbf x_i;\theta) - \mathbf y_i\bigr\|^2 = \frac{1}{n}\Bigl[E_1(\theta) + E_2(\theta) + \dots + E_n(\theta)\Bigr]"></div>

<p>
  Здесь <span class="math-inline" data-tex="E_i(\theta)"></span>: та самая длинная
  формула с двенадцатью параметрами, в которую подставлен
  <span class="math-inline" data-tex="i"></span>-й объект. Аргументы у всех слагаемых
  общие: сеть одна, параметров по-прежнему двенадцать. Растёт не размерность, а
  количество слагаемых.
</p>

<p>
  Отсюда сразу следует главное свойство: производная суммы равна сумме производных,
  поэтому
</p>

<div class="math-display" data-tex="\nabla E(\theta) = \frac{1}{n}\sum_{i=1}^{n} \nabla E_i(\theta)"></div>

<p>
  Для каждого объекта производные считаются отдельно, а по батчу результаты просто усредняются:
  отдельной «батчевой» формулы не нужно. Это та же картина, что с двумя параболами в части 6, только аргументов двенадцать
  и у каждого своя кривая. При <span class="math-inline" data-tex="n"></span> объектах один честный градиент стоит
  <span class="math-inline" data-tex="n"></span> проходов по сети, отсюда мини-батчи и SGD: берём среднее не по всей
  выборке, а по случайной горстке.
</p>

<div class="callout-yellow">
  <strong>Практическая деталь.</strong> В коде прямой проход делают сразу для всей матрицы объектов
  <span class="math-inline" data-tex="\mathbf X"></span> формы <span class="math-inline" data-tex="[n, 2]"></span>, а градиент
  усредняют по строкам батча. Делить на <span class="math-inline" data-tex="n"></span> не обязательно, но
  тогда подходящая скорость обучения будет зависеть от размера батча.
</div>

<p>
  Сравните две задачи, которые мы решили одной и той же формулой:
</p>

<table class="shape-table">
  <tr><th>Модель</th><th>Предсказание</th><th>Потери</th><th>Градиент по весу</th><th>Шаг</th></tr>
  <tr><td>Линейная регрессия</td><td><span class="math-inline" data-tex="\hat{y} = wx"></span></td><td>MSE</td><td><span class="math-inline" data-tex="-2x(y - \hat{y})"></span></td><td rowspan="2"><span class="math-inline" data-tex="w \leftarrow w - \eta\,\nabla L"></span></td></tr>
  <tr><td>Сеть 2-2-2</td><td>два слоя с сигмоидами</td><td><span class="math-inline" data-tex="\tfrac{1}{2}\|\hat{\mathbf y} - \mathbf y\|^2"></span></td><td>считает бэкпроп</td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> нейросеть не требует нового метода
  оптимизации. Как только двенадцать производных посчитаны, обучение сети становится той же
  арифметикой, что и первый шаг из части 3.
</div>

---

## Часть 8. Всё то же на NumPy

<p>
  Весь код статьи умещается на одном экране. Он считает те же данные, поэтому числа
  в комментариях совпадают с числами в сценах выше: четыре шага с <span class="math-inline" data-tex="\eta = 0.1"></span>
  приводят к 1.5, расходимость при <span class="math-inline" data-tex="\eta = 0.55"></span> доходит до −13.4,
  а по карте спуск идёт 237 итераций без инерции и 48 с ней.
</p>

<pre><code>import numpy as np

# Данные из части 1
x = np.array([1.0, 2.0])
y = np.array([2.0, 3.0])

# Один параметр: y_hat = w * x (части 1-3)
def loss(w):
    return np.mean((y - w * x) ** 2)

def grad(w):
    return np.mean(-2 * x * (y - w * x))

w, eta = 0.0, 0.1
for t in range(4):
    w = w - eta * grad(w)
print(round(w, 3), round(loss(w), 3))  # 1.5 0.125

# Расходимость выше порога eta = 0.4
w = 0.0
for t in range(4):
    w = w - 0.55 * grad(w)
print(round(w, 1))  # -13.4

# Два параметра: y_hat = w0 + w1 * x (части 4-5)
X = np.column_stack([np.ones_like(x), x])  # столбец единиц и признак
best = np.linalg.solve(X, y)               # минимум (1, 1), для проверки

def grad2(theta):
    return np.mean(-2 * X * (y - X @ theta)[:, None], axis=0)

def descend(eta, alpha=0.0, tol=0.01, max_steps=10_000):
    """Число итераций до окрестности минимума."""
    theta, v = np.zeros(2), np.zeros(2)
    for t in range(1, max_steps + 1):
        v = alpha * v + eta * grad2(theta)
        theta = theta - v
        if np.linalg.norm(theta - best) &lt; tol:
            return t
    return None

print(grad2(np.zeros(2)))       # [-5. -8.]
print(descend(0.1))             # 237
print(descend(0.1, alpha=0.9))  # 48
print(descend(0.28))            # 84

# SGD: один объект за шаг, объекты по очереди (часть 6)
w, trace = 0.0, []
for t in range(40):
    i = t % 2
    g = -2 * x[i] * (y[i] - w * x[i])
    w = w - 0.1 * g
    trace.append(round(float(w), 3))
print(trace[:4])   # [0.4, 1.28, 1.424, 1.485]
print(trace[-2:])  # [1.619, 1.524]</code></pre>

<p>
  Смена модели меняет только функцию <code>grad</code>. Цикл, скорость обучения и инерция
  ничего не знают о том, какая модель стоит внутри. Для настоящих сетей <code>grad</code>
  считает бэкпроп, а цикл остаётся этим же.
</p>

---

## Часть 9. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Обучение сводится к минимизации:</strong> данные фиксированы, аргументами
  функции потерь служат параметры модели. Найти минимум <span class="math-inline" data-tex="L(w)"></span>
  и обучить модель это одно и то же действие.</li>
  <li><strong>Производная измеряет наклон в текущей точке:</strong> её знак говорит, куда функция
  растёт, поэтому шаг делается против знака. Модуль говорит, насколько здесь круто.</li>
  <li><strong>Формула шага:</strong>
  <span class="math-inline" data-tex="w \leftarrow w - \eta\,L'(w)"></span>. Шаги
  укорачиваются сами по мере приближения к минимуму, отдельного торможения не нужно.</li>
  <li><strong>Скорость обучения решает судьбу спуска:</strong> слишком мала: ползём,
  слишком велика: колеблемся или расходимся. Для параболы порог считается точно:
  <span class="math-inline" data-tex="\eta &gt; 2/L''"></span> даёт расходимость.</li>
  <li><strong>Градиент составлен из частных производных.</strong> Производная по любому
  направлению равна <span class="math-inline" data-tex="u \cdot \nabla L"></span>,
  поэтому максимум роста идёт вдоль градиента, максимум убывания против него.</li>
  <li><strong>Спуск идёт перпендикулярно линиям уровня</strong> и тормозит в
  вытянутых долинах: там градиент почти нулевой вдоль дна. Отсюда инерция,
  нормировка признаков и адаптивные методы.</li>
  <li><strong>Цикл обучения:</strong> предсказать → посчитать потери → взять
  градиент → шагнуть → повторить. Параметры меняются ровно в одном месте цикла.</li>
  <li><strong>Стохастичность снижает цену шага:</strong> градиент
  по мини-батчу дешевле и шумнее; шум приходится гасить убыванием
  <span class="math-inline" data-tex="\eta"></span>.</li>
  <li><strong>Смена модели меняет только две формулы:</strong> предсказание и потери.
  У линейной регрессии градиент равен <span class="math-inline" data-tex="-2x(y-\hat{y})"></span>;
  правило обновления от модели не зависит.</li>
  <li><strong>Для сети шаг выглядит ровно так же,</strong> как для
  одного веса, просто выполняется для всех параметров сразу.</li>
</ol>

<p>
  Если из статьи стоит унести одну картину, пусть это будет человек с завязанными
  глазами на склоне. Он не знает, где долина, не видит карты и не умеет решать
  уравнения. Он умеет одно: пощупать землю под ногами и сделать небольшой шаг вниз.
  Повторённое достаточное число раз, это скромное умение обучает и линейную
  регрессию из двух точек, и сеть с миллиардом параметров.
</p>

<p class="tiny">
  Все числа в статье посчитаны на данных
  <span class="math-inline" data-tex="x = (1, 2)"></span>,
  <span class="math-inline" data-tex="y = (2, 3)"></span> (регрессия) и на сети 2-2-2 с входом <span class="math-inline" data-tex="(0.5, 0.8)"></span>
  и целью <span class="math-inline" data-tex="(1, 0)"></span>, те же веса, что в
  статье про бэкпроп. Градиенты проверены сравнением с численными производными
  (конечные разности, расхождение порядка <span class="math-inline" data-tex="10^{-11}"></span>). Данные учебные и подобраны так, чтобы все промежуточные величины
  помещались на экран.
</p>

<script>
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var BLUE = '#3576C0', YELLOW = '#C29E08', GREEN = '#73B222', RED = '#C30B0A', GRAY = '#5E5850', MUTED = '#8A8378', LEVEL = '#C9BE7A';
  var X = [1, 2], Y = [2, 3], clipId = 0;

  function $(id) { return document.getElementById(id); }
  function el(n, a, p) {
    var e = document.createElementNS(NS, n);
    for (var k in a) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  }
  function txt(p, x, y, t, o) {
    o = o || {};
    var e = el('text', {x: x, y: y, 'font-size': o.s || 13, fill: o.c || GRAY, 'text-anchor': o.a || 'start', 'font-weight': o.w || 400}, p);
    if (o.halo) { e.setAttribute('paint-order', 'stroke'); e.setAttribute('stroke', '#FFFFFF'); e.setAttribute('stroke-width', 3); }
    e.textContent = t;
    return e;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function num(v, d) {
    if (d === undefined) d = 2;
    var s = Math.abs(v).toFixed(d);
    return (v < 0 && +s !== 0 ? '−' : '') + s;
  }
  function tnum(v, d) { return num(v, d).replace('−', '-'); }
  function paren(v, d) { return v < 0 ? '(' + tnum(v, d) + ')' : tnum(v, d); }
  function tex(node, s, display) {
    if (window.katex) {
      try { window.katex.render(s, node, {throwOnError: false, strict: 'ignore', displayMode: !!display}); return; } catch (e) {}
    }
    node.textContent = s;
  }
  function texLabel(p, x, y, s, o) {
    o = o || {};
    var w = o.w || 60, h = 28;
    var fo = el('foreignObject', {x: o.a === 'end' ? x - w : x, y: y - 19, width: w, height: h}, p);
    var d = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    d.setAttribute('class', 'svg-math svg-math-fit');
    d.setAttribute('style', 'font-size:' + (o.s || 13) + 'px;color:' + (o.c || MUTED) + ';' + (o.a === 'end' ? 'justify-content:flex-end;' : ''));
    tex(d, s);
    fo.appendChild(d);
  }
  function plot(P) {
    P.sx = function (v) { return P.l + (v - P.x0) / (P.x1 - P.x0) * (P.r - P.l); };
    P.sy = function (v) { return P.b - (v - P.y0) / (P.y1 - P.y0) * (P.b - P.t); };
    return P;
  }
  function layers(svg, P) {
    var id = 'gdclip' + (++clipId), defs = el('defs', {}, svg), c = el('clipPath', {id: id}, defs);
    el('rect', {x: P.l, y: P.t - 2, width: P.r - P.l + 2, height: P.b - P.t + 4}, c);
    P.base = el('g', {'clip-path': 'url(#' + id + ')'}, svg);
    P.dyn = el('g', {'clip-path': 'url(#' + id + ')'}, svg);
    P.top = el('g', {}, svg);
    P.clip = id;
    return P;
  }
  function axes(p, P, o) {
    var ya = !o.bottom && P.y0 <= 0 && P.y1 >= 0 ? P.sy(0) : P.b;
    var xa = P.x0 <= 0 && P.x1 >= 0 ? P.sx(0) : P.l;
    el('line', {x1: P.l, y1: ya, x2: P.r, y2: ya, stroke: GRAY, 'stroke-width': 1.3}, p);
    el('line', {x1: xa, y1: P.t, x2: xa, y2: P.b, stroke: GRAY, 'stroke-width': 1.3}, p);
    (o.xt || []).forEach(function (v) {
      el('line', {x1: P.sx(v), y1: ya, x2: P.sx(v), y2: ya + 4, stroke: GRAY}, p);
      txt(p, P.sx(v), Math.min(ya + 17, P.b + 17), o.xf ? o.xf(v) : v, {c: MUTED, a: 'middle', s: 12});
    });
    (o.yt || []).forEach(function (v) {
      el('line', {x1: xa - 4, y1: P.sy(v), x2: xa, y2: P.sy(v), stroke: GRAY}, p);
      if (o.ytex) texLabel(p, xa - 6, P.sy(v) + 4, o.ytex(v), {a: 'end', s: 12, w: 44});
      else txt(p, xa - 7, P.sy(v) + 4, o.yf ? o.yf(v) : v, {c: MUTED, a: 'end', s: 12});
    });
    if (o.xl) texLabel(p, P.r + 4, ya + 5, o.xl);
    if (o.yl) texLabel(p, xa + 6, P.t + 8, o.yl);
  }
  function curve(p, P, fn, attrs, a, b) {
    var pts = [], n = 160;
    a = a === undefined ? P.x0 : a; b = b === undefined ? P.x1 : b;
    for (var i = 0; i <= n; i++) { var v = a + (b - a) * i / n; pts.push(P.sx(v).toFixed(1) + ',' + Math.max(-2000, Math.min(4000, P.sy(fn(v)))).toFixed(1)); }
    var A = {points: pts.join(' '), fill: 'none'};
    for (var k in attrs) A[k] = attrs[k];
    return el('polyline', A, p);
  }
  function arrow(p, x1, y1, x2, y2, c, w) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy);
    if (L < 1) return;
    var ux = dx / L, uy = dy / L, s = 8;
    el('line', {x1: x1, y1: y1, x2: x2 - ux * (s - 1), y2: y2 - uy * (s - 1), stroke: c, 'stroke-width': w || 2.4}, p);
    el('polygon', {points: x2 + ',' + y2 + ' ' + (x2 - ux * s - uy * s * .55) + ',' + (y2 - uy * s + ux * s * .55) + ' ' + (x2 - ux * s + uy * s * .55) + ',' + (y2 - uy * s - ux * s * .55), fill: c}, p);
  }
  function dot(p, x, y, r, c) { return el('circle', {cx: x, cy: y, r: r, fill: c, stroke: '#FFFFFF', 'stroke-width': 1.2}, p); }
  function setText(id, s) { var n = $(id); if (n) n.textContent = s; }
  function timer() {
    var h = null;
    return {
      start: function (fn, ms) { this.stop(); h = setInterval(fn, ms); },
      stop: function () { if (h) clearInterval(h); h = null; },
      on: function () { return h !== null; }
    };
  }

  var L1d = function (w) { return 2.5 * w * w - 8 * w + 6.5; };

  /* ---------- 1. Подбираем w вручную ---------- */
  function fit() {
    var svg = $('gdFitSvg');
    if (!svg) return;
    var A = plot({l: 50, r: 330, t: 30, b: 262, x0: 0, x1: 2.6, y0: -1.5, y1: 4.5});
    var B = plot({l: 410, r: 690, t: 30, b: 262, x0: -0.6, x1: 3.6, y0: 0, y1: 11.5});
    txt(svg, 50, 20, 'Данные и прямая', {c: '#111111', w: 700, s: 14});
    txt(svg, 410, 20, 'Ошибка этой прямой как точка на параболе', {c: '#111111', w: 700, s: 14});
    axes(svg, A, {xt: [1, 2], yt: [1, 2, 3, 4], xl: 'x', yl: 'y'});
    axes(svg, B, {xt: [1, 2, 3], yt: [2, 4, 6, 8, 10], xl: 'w', yl: 'L'});
    layers(svg, A); layers(svg, B);
    curve(B.base, B, L1d, {stroke: YELLOW, 'stroke-width': 2.4});
    var s = $('gdFitW');
    function update() {
      var w = +s.value, g = A.dyn, h = B.dyn;
      clear(g); clear(h); clear(A.top); clear(B.top);
      el('line', {x1: A.sx(0), y1: A.sy(0), x2: A.sx(2.6), y2: A.sy(2.6 * w), stroke: BLUE, 'stroke-width': 2.4}, g);
      var yh = X.map(function (x) { return w * x; });
      X.forEach(function (x, i) {
        el('line', {x1: A.sx(x), y1: A.sy(Y[i]), x2: A.sx(x), y2: A.sy(yh[i]), stroke: RED, 'stroke-width': 2.4}, g);
        dot(g, A.sx(x), A.sy(Y[i]), 6, BLUE);
        var my = Math.max(A.t + 12, Math.min(A.b - 4, A.sy((Y[i] + yh[i]) / 2) + 4));
        txt(A.top, A.sx(x) + 8, my, num(Y[i] - yh[i]), {c: RED, halo: true});
      });
      var L = L1d(w), best = Math.abs(w - 1.6) < 0.026;
      el('line', {x1: B.sx(w), y1: B.sy(L), x2: B.sx(w), y2: B.sy(0), stroke: '#B9C9DA', 'stroke-width': 1.2, 'stroke-dasharray': '4 3'}, h);
      dot(h, B.sx(w), B.sy(L), best ? 7 : 6, best ? GREEN : YELLOW);
      var lx = w > 2.2 ? B.sx(w) - 10 : B.sx(w) + 10;
      txt(B.top, lx, Math.max(B.t + 14, B.sy(L) - 8), 'L = ' + num(L), {c: '#111111', a: w > 2.2 ? 'end' : 'start', halo: true});
      setText('gdFitWOut', num(w));
      setText('gdFitPred', '(' + num(yh[0]) + ', ' + num(yh[1]) + ')');
      setText('gdFitMiss', '(' + num(Y[0] - yh[0]) + ', ' + num(Y[1] - yh[1]) + ')');
      setText('gdFitLoss', num(L, best ? 2 : 2));
      var a = Math.pow(Y[0] - yh[0], 2), b = Math.pow(Y[1] - yh[1], 2);
      tex($('gdFitCalc'), 'L = \\tfrac{1}{2}\\bigl[(2 - ' + paren(w) + '\\cdot 1)^2 + (3 - ' + paren(w) + '\\cdot 2)^2\\bigr] = \\tfrac{1}{2}\\bigl[' + tnum(a) + ' + ' + tnum(b) + '\\bigr] = ' + tnum(L));
      setText('gdFitStatus', best ? 'Это дно параболы: лучшая прямая через начало координат. Ноль здесь недостижим, потому что такая прямая не проходит через обе точки.' : (L1d(w + 0.05) < L ? 'Вправо потери падают: увеличивайте w.' : 'Вправо потери растут: уменьшайте w.'));
    }
    s.addEventListener('input', update);
    $('gdFitBest').addEventListener('click', function () { s.value = 1.6; update(); });
    update();
  }

  /* ---------- Производная: секущая, касательная, наклон ---------- */
  function tangent() {
    var svg = $('gdTanSvg');
    if (!svg) return;
    var A = plot({l: 44, r: 420, t: 30, b: 296, x0: -0.7, x1: 4, y0: -2.5, y1: 15});
    var B = plot({l: 500, r: 690, t: 30, b: 296, x0: -0.7, x1: 4, y0: -13, y1: 13});
    txt(svg, 44, 20, 'Функция потерь', {c: '#111111', w: 700, s: 14});
    txt(svg, 500, 20, 'Наклон в каждой точке', {c: '#111111', w: 700, s: 14});
    axes(svg, A, {xt: [1, 2, 3], yt: [5, 10, 15], xl: 'w', yl: 'L'});
    axes(svg, B, {xt: [1, 2, 3], yt: [-10, -5, 5, 10], yf: function (v) { return num(v, 0); }, xl: 'w', yl: "L'"});
    layers(svg, A); layers(svg, B);
    curve(A.base, A, L1d, {stroke: YELLOW, 'stroke-width': 2.4});
    curve(B.base, B, function (w) { return 5 * w - 8; }, {stroke: RED, 'stroke-width': 2.2});
    var sw = $('gdTanW'), sd = $('gdTanD'), run = timer();
    function line(g, P, w, y, k, a, b, attrs) {
      var o = {x1: P.sx(a), y1: P.sy(y + (a - w) * k), x2: P.sx(b), y2: P.sy(y + (b - w) * k)};
      for (var n in attrs) o[n] = attrs[n];
      el('line', o, g);
    }
    function draw() {
      var w = +sw.value, d = +sd.value, L = L1d(w), w2 = w + d, L2v = L1d(w2), sec = (L2v - L) / d, der = 5 * w - 8;
      var g = A.dyn, h = B.dyn, top = A.top; clear(g); clear(h); clear(top); clear(B.top);
      line(g, A, w, L, sec, -0.7, 4, {stroke: MUTED, 'stroke-width': 2});
      line(g, A, w, L, der, w - 1.1, w + 1.1, {stroke: RED, 'stroke-width': 2.8});
      el('line', {x1: A.sx(w), y1: A.sy(L), x2: A.sx(w2), y2: A.sy(L), stroke: BLUE, 'stroke-width': 2, 'stroke-dasharray': '6 4'}, g);
      el('line', {x1: A.sx(w2), y1: A.sy(L), x2: A.sx(w2), y2: A.sy(L2v), stroke: BLUE, 'stroke-width': 2, 'stroke-dasharray': '6 4'}, g);
      dot(g, A.sx(w2), A.sy(L2v), 5, BLUE);
      dot(g, A.sx(w), A.sy(L), 6.5, '#244F81');
      var zero = Math.abs(der) < 1e-9;
      if (zero) dot(g, A.sx(w), A.sy(-1.4), 5, GREEN);
      else arrow(g, A.sx(w), A.sy(-1.4), A.sx(w) - (der > 0 ? 1 : -1) * Math.max(16, Math.min(70, Math.abs(der) * 9)), A.sy(-1.4), GREEN, 2.8);
      if (A.sx(w2) - A.sx(w) > 44) texLabel(top, (A.sx(w) + A.sx(w2)) / 2 - 15, Math.max(A.t + 12, A.sy(L) - 7), '\\Delta w', {c: '#244F81', s: 13});
      if (Math.abs(A.sy(L2v) - A.sy(L)) > 26 && L2v < 15) texLabel(top, A.sx(w2) + 5, Math.max(A.t + 12, (A.sy(L) + A.sy(L2v)) / 2 + 5), '\\Delta L', {c: '#244F81', s: 13});
      el('line', {x1: B.sx(w), y1: B.t, x2: B.sx(w), y2: B.b, stroke: '#B9C9DA', 'stroke-width': 1.2, 'stroke-dasharray': '4 3'}, h);
      dot(h, B.sx(w), B.sy(sec), 5, MUTED);
      dot(h, B.sx(w), B.sy(der), 6, RED);
      setText('gdTanWOut', num(w)); setText('gdTanDOut', num(d));
      setText('gdTanL', num(L)); setText('gdTanSec', num(sec, 3)); setText('gdTanDer', num(der, 3)); setText('gdTanGap', num(sec - der, 3));
      tex($('gdTanCalc'), '\\frac{L(' + tnum(w2) + ') - L(' + tnum(w) + ')}{' + tnum(d) + '} = \\frac{' + tnum(L2v, d < 0.1 ? 5 : 3) + ' - ' + paren(L, d < 0.1 ? 5 : 3) + '}{' + tnum(d) + '} = ' + tnum(sec, 3) + ", \\qquad L'(" + tnum(w) + ') = 5\\cdot ' + paren(w) + ' - 8 = ' + tnum(der));
      setText('gdTanStatus', zero ? 'Дно параболы: касательная горизонтальна, производная равна нулю, шагать некуда.' : der < 0 ? 'Производная отрицательная: вправо функция убывает, поэтому шагать надо вправо.' : 'Производная положительная: вправо функция растёт, поэтому шагать надо влево.');
      document.querySelectorAll('#gdTan .gd-chip').forEach(function (b) { b.classList.toggle('is-on', Math.abs(+b.dataset.w - w) < 1e-9); });
    }
    function stop() { run.stop(); $('gdTanShrink').textContent = 'Стянуть Δw к нулю'; }
    sw.addEventListener('input', draw);
    sd.addEventListener('input', function () { stop(); draw(); });
    document.querySelectorAll('#gdTan .gd-chip').forEach(function (b) {
      b.addEventListener('click', function () { sw.value = b.dataset.w; draw(); });
    });
    $('gdTanShrink').addEventListener('click', function () {
      if (run.on()) { stop(); return; }
      if (+sd.value <= 0.01) sd.value = 1;
      this.textContent = 'Пауза';
      run.start(function () {
        var c = +sd.value, v = Math.max(0.01, c - Math.max(0.01, c * 0.07));
        sd.value = v;
        draw();
        if (v <= 0.01) stop();
      }, 60);
    });
    $('gdTanReset').addEventListener('click', function () { stop(); sw.value = 0; sd.value = 1; draw(); });
    draw();
  }

  /* ---------- 2. Скорость обучения на параболе ---------- */
  function rate() {
    var svg = $('gdRateSvg');
    if (!svg) return;
    var A = plot({l: 40, r: 410, t: 30, b: 262, x0: -2.2, x1: 4.8, y0: 0, y1: 24});
    txt(svg, 40, 20, 'Спуск по параболе', {c: '#111111', w: 700, s: 14});
    txt(svg, 460, 20, 'Потери по итерациям', {c: '#111111', w: 700, s: 14});
    axes(svg, A, {xt: [-2, -1, 1, 2, 3, 4], xf: function (v) { return num(v, 0); }, yt: [5, 10, 15, 20], xl: 'w', yl: 'L'});
    layers(svg, A);
    curve(A.base, A, L1d, {stroke: YELLOW, 'stroke-width': 2.4});
    el('line', {x1: A.sx(1.6), y1: A.sy(0), x2: A.sx(1.6), y2: A.sy(3), stroke: GREEN, 'stroke-width': 1.5, 'stroke-dasharray': '4 3'}, A.base);
    var right = el('g', {}, svg);
    var eta = $('gdRateEta'), st = $('gdRateStart'), run = timer(), S;
    function reset() {
      run.stop(); $('gdRateRun').textContent = 'Запуск'; $('gdRateStep').disabled = false; $('gdRateRun').disabled = false;
      S = {w: +st.value, h: [+st.value], calc: ''};
      draw();
    }
    function regime(e) {
      if (Math.abs(e - 0.2) < 1e-9) return 'one';
      if (e < 0.2) return 'mono';
      if (e < 0.4 - 1e-9) return 'zig';
      if (Math.abs(e - 0.4) < 1e-9) return 'edge';
      return 'boom';
    }
    function done() { return Math.abs(S.w - 1.6) < 5e-4 || Math.abs(S.w) > 1e4; }
    function step() {
      if (done()) { run.stop(); $('gdRateRun').textContent = 'Запуск'; return; }
      var e = +eta.value, g = 5 * S.w - 8, n = S.w - e * g;
      S.calc = 'w_{' + (S.h.length) + '} = ' + tnum(S.w) + ' - ' + tnum(e) + '\\cdot ' + paren(g) + ' = ' + tnum(n);
      S.w = n; S.h.push(n);
      if (S.h.length > 200) run.stop();
      draw();
      if (done()) { run.stop(); $('gdRateRun').textContent = 'Запуск'; if (Math.abs(S.w) > 1e4) { $('gdRateStep').disabled = true; $('gdRateRun').disabled = true; } }
    }
    function draw() {
      var e = +eta.value, r = regime(e), c = {mono: GREEN, one: GREEN, zig: YELLOW, edge: RED, boom: RED}[r];
      var g = A.dyn; clear(g); clear(right);
      for (var i = 0; i + 1 < S.h.length && i < 40; i++) {
        var a = S.h[i], b = S.h[i + 1];
        if (Math.abs(a) > 200 || Math.abs(b) > 200) break;
        arrow(g, A.sx(a), A.sy(L1d(a)), A.sx(b), A.sy(L1d(b)), c, 2);
      }
      S.h.slice(0, 41).forEach(function (w, i) { if (Math.abs(w) < 200) dot(g, A.sx(w), A.sy(L1d(w)), i === 0 ? 6 : 4, i === 0 ? BLUE : c); });
      var L0 = L1d(S.h[0]), top = Math.max(1, L0 * 1.15);
      var B = plot({l: 500, r: 690, t: 30, b: 262, x0: 0, x1: 30, y0: 0, y1: top});
      var tick = top > 20 ? 10 : top > 10 ? 5 : top > 4 ? 2 : top > 2 ? 1 : 0.5, yt = [];
      for (var v0 = tick; v0 < top; v0 += tick) yt.push(v0);
      axes(right, B, {xt: [10, 20, 30], yt: yt, xl: 't', yl: 'L'});
      var id = 'gdRateClip', defs = el('defs', {}, right), cp = el('clipPath', {id: id}, defs);
      el('rect', {x: B.l, y: B.t - 2, width: B.r - B.l + 2, height: B.b - B.t + 4}, cp);
      var q = el('g', {'clip-path': 'url(#' + id + ')'}, right), pts = [];
      S.h.slice(0, 31).forEach(function (w, t) {
        var v = Math.min(L1d(w), top * 6);
        pts.push(B.sx(t).toFixed(1) + ',' + B.sy(v).toFixed(1));
        dot(q, B.sx(t), B.sy(v), 3, c);
      });
      el('polyline', {points: pts.join(' '), fill: 'none', stroke: c, 'stroke-width': 1.8}, q);
      var w = S.w;
      setText('gdRateEtaOut', num(e)); setText('gdRateStartOut', num(+st.value, 1));
      setText('gdRateT', S.h.length - 1);
      setText('gdRateW', Math.abs(w) > 1e4 ? 'за графиком' : num(w, 3));
      setText('gdRateD', Math.abs(w) > 1e4 ? 'огромная' : num(5 * w - 8, 3));
      setText('gdRateL', Math.abs(w) > 1e4 ? 'огромные' : num(L1d(w), 3));
      setText('gdRateK', num(1 - 5 * e, 2));
      tex($('gdRateCalc'), S.calc || 'w_0 = ' + tnum(w));
      setText('gdRateStatus', {
        mono: 'Промах каждый раз умножается на ' + num(1 - 5 * e) + ': знак сохраняется, спуск подходит к дну с одной стороны.',
        one: 'Множитель 1 − 5η равен нулю: первый же шаг попадает ровно в минимум. На реальных данных заранее такое η не узнать.',
        zig: 'Множитель ' + num(1 - 5 * e) + ' отрицательный, по модулю меньше единицы: спуск перелетает дно, а качание затухает.',
        edge: 'Множитель равен −1: спуск прыгает между двумя точками и никогда не приближается к дну.',
        boom: 'Множитель ' + num(1 - 5 * e) + ' по модулю больше единицы: каждый промах больше предыдущего, потери растут.'
      }[r]);
      document.querySelectorAll('#gdRate .gd-chip').forEach(function (b) { b.classList.toggle('is-on', Math.abs(+b.dataset.eta - e) < 1e-9); });
    }
    eta.addEventListener('input', reset);
    st.addEventListener('input', reset);
    $('gdRateStep').addEventListener('click', function () { run.stop(); $('gdRateRun').textContent = 'Запуск'; step(); });
    $('gdRateReset').addEventListener('click', reset);
    $('gdRateRun').addEventListener('click', function () {
      if (run.on()) { run.stop(); this.textContent = 'Запуск'; return; }
      this.textContent = 'Пауза'; run.start(step, 450);
    });
    document.querySelectorAll('#gdRate .gd-chip').forEach(function (b) {
      b.addEventListener('click', function () { eta.value = b.dataset.eta; reset(); });
    });
    reset();
  }

  /* ---------- Карта высот: общая для частей 5 и 6 ---------- */
  var HL1 = 0.5 * (7 + Math.sqrt(45)), HL2 = 0.5 * (7 - Math.sqrt(45));
  function L2(a, b) { return 0.5 * (Math.pow(2 - a - b, 2) + Math.pow(3 - a - 2 * b, 2)); }
  function G2(a, b) { var r1 = 2 - a - b, r2 = 3 - a - 2 * b; return [-(r1 + r2), -(r1 + 2 * r2)]; }
  function drawMap(svg, P) {
    axes(svg, P, {xt: [1, 2], yt: [1, 2], xl: 'w_0', yl: 'w_1'});
    layers(svg, P);
    var n = Math.sqrt(9 + Math.pow(HL1 - 2, 2)), v1 = [3 / n, (HL1 - 2) / n], v2 = [-v1[1], v1[0]];
    [0.05, 0.25, 0.75, 1.5, 3, 6.5, 12, 20, 32].forEach(function (c) {
      var pts = [], r1 = Math.sqrt(2 * c / HL1), r2 = Math.sqrt(2 * c / HL2);
      for (var i = 0; i <= 120; i++) {
        var t = i / 120 * 2 * Math.PI, a = 1 + r1 * Math.cos(t) * v1[0] + r2 * Math.sin(t) * v2[0], b = 1 + r1 * Math.cos(t) * v1[1] + r2 * Math.sin(t) * v2[1];
        pts.push(P.sx(a).toFixed(1) + ',' + P.sy(b).toFixed(1));
      }
      el('polyline', {points: pts.join(' '), fill: 'none', stroke: c === 6.5 ? YELLOW : LEVEL, 'stroke-width': c === 6.5 ? 2 : 1.4}, P.base);
    });
    dot(P.base, P.sx(1), P.sy(1), 6, GREEN);
    el('rect', {x: P.l, y: P.t, width: P.r - P.l, height: P.b - P.t, fill: 'transparent', style: 'cursor:crosshair'}, svg).dataset.map = '1';
  }
  function mapClick(svg, P, fn) {
    svg.addEventListener('click', function (e) {
      var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      var q = p.matrixTransform(svg.getScreenCTM().inverse());
      if (q.x < P.l || q.x > P.r || q.y < P.t || q.y > P.b) return;
      var a = P.x0 + (q.x - P.l) / (P.r - P.l) * (P.x1 - P.x0), b = P.y0 + (P.b - q.y) / (P.b - P.t) * (P.y1 - P.y0);
      fn(Math.round(a * 20) / 20, Math.round(b * 20) / 20);
    });
  }
  function pathOn(g, P, pts, c, w, maxDots) {
    var s = [], lim = 40;
    for (var i = 0; i < pts.length; i++) {
      if (Math.abs(pts[i][0]) > lim || Math.abs(pts[i][1]) > lim) break;
      s.push(P.sx(pts[i][0]).toFixed(1) + ',' + P.sy(pts[i][1]).toFixed(1));
    }
    el('polyline', {points: s.join(' '), fill: 'none', stroke: c, 'stroke-width': w}, g);
    for (var j = 1; j < s.length && j <= maxDots; j++) dot(g, P.sx(pts[j][0]), P.sy(pts[j][1]), 3.4, c);
  }

  /* ---------- 3. Карта высот и прямая ---------- */
  function map() {
    var svg = $('gdMapSvg');
    if (!svg) return;
    var P = plot({l: 44, r: 314, t: 30, b: 300, x0: -1, x1: 3, y0: -1, y1: 3});
    var D = plot({l: 420, r: 690, t: 30, b: 300, x0: 0, x1: 2.6, y0: -1, y1: 5});
    txt(svg, 44, 20, 'Карта потерь', {c: '#111111', w: 700, s: 14});
    txt(svg, 420, 20, 'Эта же точка как прямая на данных', {c: '#111111', w: 700, s: 14});
    drawMap(svg, P);
    axes(svg, D, {xt: [1, 2], yt: [1, 2, 3, 4], xl: 'x', yl: 'y'});
    layers(svg, D);
    var eta = $('gdMapEta'), run = timer(), S, start = [0, 0];
    function reset() {
      run.stop(); $('gdMapRun').textContent = 'Запуск'; $('gdMapStep').disabled = false; $('gdMapRun').disabled = false;
      S = {p: start.slice(), h: [start.slice()], reached: start[0] === 1 && start[1] === 1 ? 0 : null};
      draw();
    }
    function finished() { return S.reached !== null || Math.abs(S.p[0]) > 1e4 || S.h.length > 5000; }
    function step() {
      if (finished()) { stopRun(); return; }
      var e = +eta.value, g = G2(S.p[0], S.p[1]);
      S.p = [S.p[0] - e * g[0], S.p[1] - e * g[1]];
      S.h.push(S.p.slice());
      if (Math.hypot(S.p[0] - 1, S.p[1] - 1) < 0.01) S.reached = S.h.length - 1;
    }
    function stopRun() {
      run.stop(); $('gdMapRun').textContent = 'Запуск';
      if (finished()) { $('gdMapStep').disabled = true; $('gdMapRun').disabled = true; }
    }
    function draw() {
      var g = P.dyn, d = D.dyn; clear(g); clear(d);
      var div = Math.abs(S.p[0]) > 1e4 || Math.abs(S.p[1]) > 1e4;
      pathOn(g, P, S.h, div ? RED : GREEN, 2.2, 12);
      dot(g, P.sx(S.h[0][0]), P.sy(S.h[0][1]), 6, BLUE);
      if (!div) dot(g, P.sx(S.p[0]), P.sy(S.p[1]), 5, GREEN);
      var a = div ? start[0] : S.p[0], b = div ? start[1] : S.p[1];
      el('line', {x1: D.sx(0), y1: D.sy(a), x2: D.sx(2.6), y2: D.sy(a + 2.6 * b), stroke: BLUE, 'stroke-width': 2.4}, d);
      X.forEach(function (x, i) {
        el('line', {x1: D.sx(x), y1: D.sy(Y[i]), x2: D.sx(x), y2: D.sy(a + b * x), stroke: RED, 'stroke-width': 2.2}, d);
        dot(d, D.sx(x), D.sy(Y[i]), 6, BLUE);
      });
      setText('gdMapEtaOut', num(+eta.value));
      setText('gdMapT', S.h.length - 1);
      setText('gdMapP', div ? 'за картой' : '(' + num(S.p[0], 3) + ', ' + num(S.p[1], 3) + ')');
      setText('gdMapL', div ? 'огромные' : num(L2(S.p[0], S.p[1]), 4));
      var G = G2(S.p[0], S.p[1]);
      setText('gdMapG', div ? 'огромный' : num(Math.hypot(G[0], G[1]), 4));
      var msg;
      if (div) msg = 'При этой скорости спуск расходится: порог для этой карты около 0.29.';
      else if (S.reached !== null) msg = 'До окрестности минимума (1, 1) радиусом 0.01 спуск дошёл за ' + S.reached + ' итераций.';
      else if (S.h.length > 5000) msg = 'За 5000 итераций до окрестности минимума спуск не дошёл.';
      else if (+eta.value > 0.2918) msg = 'Скорость выше порога 0.29: посмотрите, что будет после нескольких шагов.';
      else msg = 'Сначала спуск быстро падает поперёк долины, потом медленно идёт вдоль её дна. Щёлкните по карте, чтобы выбрать другой старт.';
      setText('gdMapStatus', msg);
    }
    eta.addEventListener('input', reset);
    mapClick(svg, P, function (a, b) { start = [a, b]; reset(); });
    $('gdMapStep').addEventListener('click', function () { run.stop(); $('gdMapRun').textContent = 'Запуск'; step(); draw(); if (finished()) stopRun(); });
    $('gdMapReset').addEventListener('click', function () { start = [0, 0]; reset(); });
    $('gdMapRun').addEventListener('click', function () {
      if (run.on()) { run.stop(); this.textContent = 'Запуск'; return; }
      this.textContent = 'Пауза';
      run.start(function () {
        var k = S.h.length < 12 ? 1 : 4;
        for (var i = 0; i < k; i++) step();
        draw();
        if (finished()) stopRun();
      }, 70);
    });
    reset();
  }

  /* ---------- 4. Цикл обучения рядом с кодом ---------- */
  function loop() {
    var svg = $('gdLoopSvg');
    if (!svg) return;
    var A = plot({l: 44, r: 324, t: 30, b: 250, x0: 0, x1: 2.6, y0: -0.6, y1: 4.2});
    var B = plot({l: 410, r: 690, t: 30, b: 250, x0: -0.3, x1: 2.6, y0: 0, y1: 8});
    txt(svg, 44, 20, 'Данные и модель', {c: '#111111', w: 700, s: 14});
    txt(svg, 410, 20, 'Парабола потерь', {c: '#111111', w: 700, s: 14});
    axes(svg, A, {xt: [1, 2], yt: [1, 2, 3, 4], xl: 'x', yl: 'y'});
    axes(svg, B, {xt: [1, 2], yt: [2, 4, 6, 8], xl: 'w', yl: 'L'});
    layers(svg, A); layers(svg, B);
    curve(B.base, B, L1d, {stroke: YELLOW, 'stroke-width': 2.4});
    var ETA = 0.1, S;
    var LINES = document.querySelectorAll('#gdLoop .gd-code [data-line]');
    var NOTES = document.querySelectorAll('#gdLoop .gd-note');
    function reset() { S = {w: 0, old: null, phase: -1, it: 0, rows: []}; $('gdLoopRows').innerHTML = ''; draw(); }
    function vals(w) {
      var yh = X.map(function (x) { return w * x; });
      return {yh: yh, L: L1d(w), g: 5 * w - 8};
    }
    function next() {
      S.phase++;
      if (S.phase === 4) { S.phase = 0; S.it++; }
      if (S.phase === 3) {
        var v = vals(S.w), n = S.w - ETA * v.g;
        S.rows.push([S.it, S.w, v.L, v.g, n]);
        var tr = document.createElement('tr');
        [S.it, num(S.w, 3), num(v.L, 3), num(v.g, 3), num(n, 3)].forEach(function (c) { var td = document.createElement('td'); td.textContent = c; tr.appendChild(td); });
        $('gdLoopRows').appendChild(tr);
        var wrap = $('gdLoopRows').closest('.gd-table-wrap'); wrap.scrollTop = wrap.scrollHeight;
        S.old = S.w; S.w = n;
      }
      draw();
    }
    function draw() {
      var g = A.dyn, h = B.dyn, ph = S.phase; clear(g); clear(h); clear(A.top); clear(B.top);
      var w = ph === 3 ? S.old : S.w, v = vals(w);
      el('line', {x1: A.sx(0), y1: A.sy(0), x2: A.sx(2.6), y2: A.sy(2.6 * w), stroke: BLUE, 'stroke-width': ph === 3 ? 1.4 : 2.4, opacity: ph === 3 ? 0.4 : 1}, g);
      if (ph === 3) el('line', {x1: A.sx(0), y1: A.sy(0), x2: A.sx(2.6), y2: A.sy(2.6 * S.w), stroke: GREEN, 'stroke-width': 2.6}, g);
      X.forEach(function (x, i) {
        if (ph >= 1) el('line', {x1: A.sx(x), y1: A.sy(Y[i]), x2: A.sx(x), y2: A.sy(v.yh[i]), stroke: RED, 'stroke-width': 2.4, opacity: ph === 3 ? 0.35 : 1}, g);
        dot(g, A.sx(x), A.sy(Y[i]), 6, BLUE);
        if (ph >= 0) el('circle', {cx: A.sx(x), cy: A.sy(v.yh[i]), r: 5, fill: '#FFFFFF', stroke: BLUE, 'stroke-width': 2}, g);
      });
      var px = B.sx(w), py = B.sy(v.L);
      if (ph >= 2) {
        var d = 0.6;
        el('line', {x1: B.sx(w - d), y1: B.sy(v.L - d * v.g), x2: B.sx(w + d), y2: B.sy(v.L + d * v.g), stroke: RED, 'stroke-width': 2.4, opacity: ph === 3 ? 0.4 : 1}, h);
        txt(B.top, Math.min(px + 12, 600), Math.max(B.t + 14, py - 28), 'наклон ' + num(v.g), {c: RED, halo: true});
      }
      if (ph === 3) { arrow(h, px, py, B.sx(S.w), B.sy(L1d(S.w)), GREEN, 2.6); dot(h, B.sx(S.w), B.sy(L1d(S.w)), 6, GREEN); }
      if (ph >= 1 || ph === -1) dot(h, px, py, 6, ph === 3 ? MUTED : YELLOW);
      if (ph >= 1) txt(B.top, px + 12, py - 6, 'L = ' + num(v.L, 3), {c: '#111111', halo: true});
      LINES.forEach(function (n) { n.classList.toggle('is-on', +n.dataset.line === ph); });
      NOTES.forEach(function (n) { n.hidden = +n.dataset.phase !== ph; });
      setText('gdLoopW', num(S.w, 3)); setText('gdLoopIt', S.it);
      var tx = '';
      if (ph === 0) tx = '\\hat y = (' + tnum(w) + '\\cdot 1,\\ ' + tnum(w) + '\\cdot 2) = (' + tnum(v.yh[0]) + ',\\ ' + tnum(v.yh[1]) + ')';
      if (ph === 1) tx = 'L = \\tfrac{1}{2}\\bigl[(2 - ' + paren(v.yh[0]) + ')^2 + (3 - ' + paren(v.yh[1]) + ')^2\\bigr] = ' + tnum(v.L, 3);
      if (ph === 2) tx = "L'(w) = \\tfrac{1}{2}\\bigl[-2\\cdot 1\\cdot " + paren(Y[0] - v.yh[0]) + ' - 2\\cdot 2\\cdot ' + paren(Y[1] - v.yh[1]) + '\\bigr] = ' + tnum(v.g, 3);
      if (ph === 3) tx = 'w = ' + tnum(w, 3) + ' - 0.1\\cdot ' + paren(v.g, 3) + ' = ' + tnum(S.w, 3);
      if (ph >= 0) tex($('gdLoopNum' + ph), tx, true);
    }
    $('gdLoopNext').addEventListener('click', next);
    $('gdLoopReset').addEventListener('click', reset);
    reset();
  }

  /* ---------- 5. Каждый объект тянет к своему минимуму ---------- */
  function two() {
    var svg = $('gdTwoSvg');
    if (!svg) return;
    var P = plot({l: 44, r: 690, t: 36, b: 262, x0: -0.15, x1: 3.05, y0: 0, y1: 10});
    var ETA = 0.1, S, run = timer(), mode = 'both';
    var f1 = function (w) { return Math.pow(2 - w, 2); }, f2 = function (w) { return Math.pow(3 - 2 * w, 2); };
    var g1 = function (w) { return -2 * (2 - w); }, g2 = function (w) { return -4 * (3 - 2 * w); };
    txt(svg, 44, 20, 'Потери каждого объекта и их среднее', {c: '#111111', w: 700, s: 14});
    el('line', {x1: 372, y1: 16, x2: 396, y2: 16, stroke: BLUE, 'stroke-width': 2}, svg); txt(svg, 402, 20, 'объект 1', {s: 12});
    el('line', {x1: 466, y1: 16, x2: 490, y2: 16, stroke: '#244F81', 'stroke-width': 2, 'stroke-dasharray': '6 4'}, svg); txt(svg, 496, 20, 'объект 2', {s: 12});
    el('line', {x1: 560, y1: 16, x2: 584, y2: 16, stroke: YELLOW, 'stroke-width': 3.2}, svg); txt(svg, 590, 20, 'среднее', {s: 12});
    axes(svg, P, {xt: [1, 2, 3], yt: [2, 4, 6, 8, 10], xl: 'w', yl: 'L'});
    layers(svg, P);
    var c1 = curve(P.base, P, f1, {stroke: BLUE, 'stroke-width': 2});
    var c2 = curve(P.base, P, f2, {stroke: '#244F81', 'stroke-width': 2, 'stroke-dasharray': '6 4'});
    var c3 = curve(P.base, P, L1d, {stroke: YELLOW, 'stroke-width': 3.2});
    [[2, BLUE, 'минимум объекта 1'], [1.5, '#244F81', 'объекта 2'], [1.6, YELLOW, 'среднего']].forEach(function (m, i) {
      el('line', {x1: P.sx(m[0]), y1: P.sy(0), x2: P.sx(m[0]), y2: P.sy(0) - 9, stroke: m[1], 'stroke-width': 2.4}, P.base);
    });
    var s = $('gdTwoW');
    function reset(w) { run.stop(); $('gdTwoRun').textContent = 'Запуск'; S = {w: w === undefined ? 0 : w, turn: 0, h: [], calc: ''}; s.value = S.w; draw(); }
    function current() { return mode === 'both' ? 'both' : mode === 'one' ? 0 : mode === 'two' ? 1 : S.turn % 2; }
    function step() {
      var c = current(), w = S.w, g = c === 'both' ? (g1(w) + g2(w)) / 2 : c === 0 ? g1(w) : g2(w), n = w - ETA * g;
      S.calc = 'w = ' + tnum(w, 3) + ' - 0.1\\cdot ' + paren(g, 3) + ' = ' + tnum(n, 3);
      S.h.push(w); if (S.h.length > 14) S.h.shift();
      S.w = n; S.turn++; s.value = n;
      draw();
    }
    function draw() {
      var g = P.dyn, w = S.w, c = current(); clear(g); clear(P.top);
      c1.setAttribute('opacity', c === 'both' || c === 0 ? 1 : 0.3);
      c2.setAttribute('opacity', c === 'both' || c === 1 ? 1 : 0.3);
      c3.setAttribute('opacity', c === 'both' ? 1 : 0.35);
      S.h.forEach(function (v, i) { el('circle', {cx: P.sx(v), cy: P.sy(L1d(v)), r: 3, fill: MUTED, opacity: 0.25 + 0.05 * i}, g); });
      el('line', {x1: P.sx(w), y1: P.t, x2: P.sx(w), y2: P.b, stroke: '#B9C9DA', 'stroke-width': 1.2, 'stroke-dasharray': '4 3'}, g);
      dot(g, P.sx(w), P.sy(f1(w)), 5, BLUE); dot(g, P.sx(w), P.sy(f2(w)), 5, '#244F81'); dot(g, P.sx(w), P.sy(L1d(w)), 6, YELLOW);
      var A = g1(w), B = g2(w), M = (A + B) / 2, sc = 24, cl = function (v) { return Math.max(-110, Math.min(110, -v * sc)); };
      if (c === 'both' || c === 0) arrow(P.top, P.sx(w), 50, P.sx(w) + cl(A), 50, BLUE, 2.6);
      if (c === 'both' || c === 1) arrow(P.top, P.sx(w), 64, P.sx(w) + cl(B), 64, '#244F81', 2.6);
      if (c === 'both') arrow(P.top, P.sx(w), 78, P.sx(w) + cl(M), 78, YELLOW, 3);
      setText('gdTwoWOut', num(w, 3));
      setText('gdTwoG1', num(A)); setText('gdTwoG2', num(B)); setText('gdTwoGM', num(M));
      setText('gdTwoNow', c === 'both' ? 'оба объекта' : c === 0 ? 'объект 1' : 'объект 2');
      tex($('gdTwoCalc'), S.calc || '\\tfrac{1}{2}\\bigl[' + tnum(A) + ' + ' + paren(B) + '\\bigr] = ' + tnum(M));
      var msg = '';
      if (mode === 'both') msg = 'Полный градиент: шаги ведут к 1.6 и гаснут сами.';
      if (mode === 'one') msg = 'Первый объект в одиночку ведёт к w = 2.';
      if (mode === 'two') msg = 'Второй объект в одиночку ведёт к w = 1.5.';
      if (mode === 'sgd') msg = S.turn > 30 ? 'Спуск уже качается между 1.524 и 1.619: при постоянной η шум не гаснет.' : 'Объекты по очереди тянут w каждый к своему минимуму. Жмите «Шаг» или «Запуск».';
      setText('gdTwoStatus', msg);
      document.querySelectorAll('#gdTwo .gd-chip').forEach(function (b) { b.classList.toggle('is-on', b.dataset.mode === mode); });
    }
    s.addEventListener('input', function () { run.stop(); $('gdTwoRun').textContent = 'Запуск'; S.w = +s.value; S.turn = 0; S.h = []; S.calc = ''; draw(); });
    $('gdTwoStep').addEventListener('click', function () { run.stop(); $('gdTwoRun').textContent = 'Запуск'; step(); });
    $('gdTwoReset').addEventListener('click', function () { reset(0); });
    $('gdTwoRun').addEventListener('click', function () {
      if (run.on()) { run.stop(); this.textContent = 'Запуск'; return; }
      this.textContent = 'Пауза'; run.start(function () { step(); if (S.turn > 60) { run.stop(); $('gdTwoRun').textContent = 'Запуск'; } }, 350);
    });
    document.querySelectorAll('#gdTwo .gd-chip').forEach(function (b) {
      b.addEventListener('click', function () { mode = b.dataset.mode; reset(0); });
    });
    reset(0);
  }

  /* ---------- 6. Инерция на той же карте ---------- */
  function momentum() {
    var svg = $('gdMomSvg');
    if (!svg) return;
    var P = plot({l: 44, r: 314, t: 30, b: 300, x0: -1, x1: 3, y0: -1, y1: 3});
    txt(svg, 44, 20, 'Две траектории на одной карте', {c: '#111111', w: 700, s: 14});
    txt(svg, 420, 20, 'Потери, логарифмическая шкала', {c: '#111111', w: 700, s: 14});
    drawMap(svg, P);
    var right = el('g', {}, svg), start = [0, 0], al = $('gdMomA'), et = $('gdMomEta'), run = timer(), T = null, K = null;
    function traj(alpha, eta) {
      var a = start[0], b = start[1], va = 0, vb = 0, pts = [[a, b]], reach = null;
      for (var t = 1; t <= 3000; t++) {
        var g = G2(a, b);
        va = alpha * va + eta * g[0]; vb = alpha * vb + eta * g[1]; a -= va; b -= vb;
        pts.push([a, b]);
        if (Math.hypot(a - 1, b - 1) < 0.01) { reach = t; break; }
        if (Math.abs(a) > 1e5) break;
      }
      return {pts: pts, reach: reach};
    }
    function compute() {
      run.stop(); K = null; $('gdMomRun').textContent = 'Показать движение';
      T = {plain: traj(0, +et.value), mom: traj(+al.value, +et.value)};
      draw();
    }
    function draw() {
      var g = P.dyn; clear(g); clear(right);
      var n = K === null ? Infinity : K;
      var a = T.plain.pts.slice(0, n), b = T.mom.pts.slice(0, n);
      pathOn(g, P, a, MUTED, 2, 0); pathOn(g, P, b, BLUE, 2.4, 0);
      dot(g, P.sx(start[0]), P.sy(start[1]), 6, BLUE);
      var last = function (x) { return x[x.length - 1]; };
      dot(g, P.sx(last(a)[0]), P.sy(last(a)[1]), 4.5, MUTED); dot(g, P.sx(last(b)[0]), P.sy(last(b)[1]), 4.5, BLUE);
      var mx = Math.max(T.plain.pts.length, T.mom.pts.length, 20), C = plot({l: 460, r: 690, t: 30, b: 300, x0: 0, x1: mx, y0: -5, y1: 2});
      var tk = mx > 400 ? [200, 400, 600, 800] : mx > 120 ? [50, 100, 150, 200, 250].filter(function (v) { return v < mx; }) : [20, 40, 60, 80, 100].filter(function (v) { return v < mx; });
      axes(right, C, {bottom: true, xt: tk, yt: [-4, -2, 0, 2], ytex: function (v) { return '10^{' + v + '}'; }, xl: 't', yl: 'L'});
      var id = 'gdMomClip', defs = el('defs', {}, right), cp = el('clipPath', {id: id}, defs);
      el('rect', {x: C.l, y: C.t, width: C.r - C.l, height: C.b - C.t}, cp);
      var q = el('g', {'clip-path': 'url(#' + id + ')'}, right);
      [[a, MUTED, 2], [b, BLUE, 2.4]].forEach(function (o) {
        var s = o[0].map(function (p, i) { return C.sx(i).toFixed(1) + ',' + C.sy(Math.log10(Math.max(L2(p[0], p[1]), 1e-6))).toFixed(1); });
        el('polyline', {points: s.join(' '), fill: 'none', stroke: o[1], 'stroke-width': o[2]}, q);
      });
      setText('gdMomAOut', num(+al.value)); setText('gdMomEtaOut', num(+et.value));
      var r0 = T.plain.reach, r1 = T.mom.reach;
      setText('gdMomN0', r0 === null ? 'не дошёл' : r0); setText('gdMomN1', r1 === null ? 'не дошёл' : r1);
      setText('gdMomRatio', r0 && r1 ? 'в ' + (r0 / r1).toFixed(1).replace(/\.0$/, '') + ' раза' : '—');
      setText('gdMomStatus', +al.value === 0 ? 'При нулевой инерции обе траектории совпадают.' : r1 && r0 && r1 > r0 ? 'Инерция здесь слишком велика: траектория долго качается вокруг минимума и проигрывает обычному спуску.' : 'Серая линия ползёт вдоль дна долины, синяя разгоняется вдоль него: шаги в одну сторону складываются.');
    }
    al.addEventListener('input', compute); et.addEventListener('input', compute);
    mapClick(svg, P, function (a, b) { start = [a, b]; compute(); });
    $('gdMomReset').addEventListener('click', function () { start = [0, 0]; al.value = 0.9; et.value = 0.1; compute(); });
    $('gdMomRun').addEventListener('click', function () {
      if (run.on()) { run.stop(); K = null; this.textContent = 'Показать движение'; draw(); return; }
      this.textContent = 'Показать целиком'; K = 1;
      var me = this;
      run.start(function () {
        K += 2; draw();
        if (K > Math.max(T.plain.pts.length, T.mom.pts.length)) { run.stop(); K = null; me.textContent = 'Показать движение'; draw(); }
      }, 50);
    });
    compute();
  }

  /* ---------- 7. Сеть 2-2-2 ---------- */
  function net() {
    var svg = $('gdNetSvg');
    if (!svg) return;
    var x = [0.5, 0.8], y = [1, 0];
    var sig = function (z) { return 1 / (1 + Math.exp(-z)); };
    var INIT = {W1: [[0.15, -0.2], [0.4, 0.3]], b1: [0.1, -0.1], W2: [[0.5, -0.3], [0.2, 0.6]], b2: [0.05, 0.15]};
    function copy(p) { return JSON.parse(JSON.stringify(p)); }
    function forward(p) {
      var h = [0, 1].map(function (i) { return sig(p.W1[i][0] * x[0] + p.W1[i][1] * x[1] + p.b1[i]); });
      var o = [0, 1].map(function (i) { return sig(p.W2[i][0] * h[0] + p.W2[i][1] * h[1] + p.b2[i]); });
      return {h: h, o: o, E: 0.5 * (Math.pow(o[0] - y[0], 2) + Math.pow(o[1] - y[1], 2))};
    }
    function gradient(p) {
      var f = forward(p), d2 = [0, 1].map(function (i) { return (f.o[i] - y[i]) * f.o[i] * (1 - f.o[i]); });
      var d1 = [0, 1].map(function (j) { return (p.W2[0][j] * d2[0] + p.W2[1][j] * d2[1]) * f.h[j] * (1 - f.h[j]); });
      return {
        W1: d1.map(function (d) { return [d * x[0], d * x[1]]; }), b1: d1,
        W2: d2.map(function (d) { return [d * f.h[0], d * f.h[1]]; }), b2: d2
      };
    }
    function get(o, s) { return s.j === undefined ? o[s.k][s.i] : o[s.k][s.i][s.j]; }
    function put(o, s, v) { if (s.j === undefined) o[s.k][s.i] = v; else o[s.k][s.i][s.j] = v; }
    function nameOf(s) {
      if (s.k === 'W1') return 'w^{(1)}_{' + (s.i + 1) + (s.j + 1) + '}';
      if (s.k === 'W2') return 'w^{(2)}_{' + (s.i + 1) + (s.j + 1) + '}';
      return 'b^{(' + s.k.charAt(1) + ')}_' + (s.i + 1);
    }
    var YP = [84, 214], XN = [44, 172, 300];
    var P = plot({l: 400, r: 690, t: 30, b: 280, x0: -10, x1: 10, y0: 0, y1: 1.05});
    var H = plot({l: 400, r: 690, t: 320, b: 400, x0: 0, x1: 50, y0: 0, y1: 0.4});
    txt(svg, 20, 20, 'Сеть: щёлкните по весу или смещению', {c: '#111111', w: 700, s: 14});
    var graph = el('g', {}, svg);
    axes(svg, P, {xt: [-10, -5, 5, 10], xf: function (v) { return num(v, 0); }, yt: [0.25, 0.5, 0.75, 1], xl: '', yl: 'E'});
    layers(svg, P);
    var titleBox = el('foreignObject', {x: 400, y: 2, width: 310, height: 26}, svg);
    var titleDiv = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    titleDiv.setAttribute('class', 'svg-math svg-math-fit');
    titleDiv.setAttribute('style', 'font-size:14px;color:#111111;font-weight:700');
    titleBox.appendChild(titleDiv);
    txt(svg, 20, 330, 'Потери по шагам спуска', {c: '#111111', w: 700, s: 14});
    var hist = el('g', {}, svg);
    var S, sel = {k: 'W2', i: 0, j: 0}, slider = $('gdNetVal'), eta = $('gdNetEta');
    function reset() { S = {p: copy(INIT), t: 0, h: [forward(INIT).E]}; draw(); }
    function stepOnce() {
      var e = +eta.value, g = gradient(S.p), p = S.p;
      ['W1', 'W2'].forEach(function (k) { [0, 1].forEach(function (i) { [0, 1].forEach(function (j) { p[k][i][j] -= e * g[k][i][j]; }); }); });
      ['b1', 'b2'].forEach(function (k) { [0, 1].forEach(function (i) { p[k][i] -= e * g[k][i]; }); });
      S.t++; S.h.push(forward(p).E);
    }
    function sameSel(s) { return s.k === sel.k && s.i === sel.i && s.j === sel.j; }
    function edge(s, x1, y1, x2, y2, tp) {
      var v = get(S.p, s), on = sameSel(s);
      el('line', {x1: x1, y1: y1, x2: x2, y2: y2, stroke: on ? RED : YELLOW, 'stroke-width': on ? 3.4 : Math.min(3, 0.8 + Math.abs(v) * 1.1), opacity: on ? 1 : 0.8}, graph);
      var hit = el('line', {x1: x1, y1: y1, x2: x2, y2: y2, stroke: 'transparent', 'stroke-width': 18, style: 'cursor:pointer'}, graph);
      hit.addEventListener('click', function () { sel = s; draw(); });
      txt(graph, x1 + (x2 - x1) * tp, y1 + (y2 - y1) * tp + 4, num(v), {s: 12, c: on ? RED : '#8C7106', a: 'middle', halo: true, w: on ? 700 : 400}).setAttribute('pointer-events', 'none');
    }
    function node(cx, cy, label, fill) {
      el('circle', {cx: cx, cy: cy, r: 21, fill: fill, stroke: '#3576C0', 'stroke-width': 1.6}, graph);
      txt(graph, cx, cy + 4, label, {s: 12, c: '#111111', a: 'middle'});
    }
    function biasChip(s, cx, cy) {
      var on = sameSel(s), g = el('g', {style: 'cursor:pointer'}, graph);
      var top = s.i === 0 ? cy - 43 : cy + 25;
      el('rect', {x: cx - 27, y: top, width: 54, height: 18, rx: 5, fill: on ? RED : '#FAFAF8', stroke: on ? RED : '#E0DDD3'}, g);
      txt(g, cx, top + 13, 'b ' + num(get(S.p, s)), {s: 11.5, c: on ? '#FFFFFF' : '#8C7106', a: 'middle'});
      g.addEventListener('click', function () { sel = s; draw(); });
    }
    function draw() {
      var f = forward(S.p), g = gradient(S.p), v = get(S.p, sel), d = get(g, sel), e = +eta.value;
      clear(graph); clear(P.dyn); clear(hist);
      [0, 1].forEach(function (i) { [0, 1].forEach(function (j) { edge({k: 'W1', i: i, j: j}, XN[0], YP[j], XN[1], YP[i], i === j ? 0.5 : 0.28); }); });
      [0, 1].forEach(function (i) { [0, 1].forEach(function (j) { edge({k: 'W2', i: i, j: j}, XN[1], YP[j], XN[2], YP[i], i === j ? 0.5 : 0.72); }); });
      [0, 1].forEach(function (i) {
        node(XN[0], YP[i], x[i].toFixed(1), '#EAF1F9');
        node(XN[1], YP[i], f.h[i].toFixed(2), '#FFFFFF');
        node(XN[2], YP[i], f.o[i].toFixed(2), '#F1F7E6');
        biasChip({k: 'b1', i: i}, XN[1], YP[i]);
        biasChip({k: 'b2', i: i}, XN[2], YP[i]);
        txt(graph, XN[2] + 28, YP[i] + 4, 'цель ' + y[i], {s: 12, c: GRAY});
      });
      tex(titleDiv, '\\text{Срез } E \\text{ по } ' + nameOf(sel));
      curve(P.dyn, P, function (t) { var q = copy(S.p); put(q, sel, t); return forward(q).E; }, {stroke: YELLOW, 'stroke-width': 2.4});
      if (Math.abs(v) <= 10) {
        var scale = 2.2;
        el('line', {x1: P.sx(v - scale), y1: P.sy(f.E - scale * d), x2: P.sx(v + scale), y2: P.sy(f.E + scale * d), stroke: RED, 'stroke-width': 2.2}, P.dyn);
        dot(P.dyn, P.sx(v), P.sy(f.E), 6, BLUE);
      }
      var mx = Math.max(50, S.h.length - 1), top = Math.max(0.1, Math.max.apply(null, S.h) * 1.15);
      H = plot({l: 60, r: 690, t: 342, b: 412, x0: 0, x1: mx, y0: 0, y1: top});
      axes(hist, H, {xt: [Math.round(mx / 2), mx], yt: [+(top / 2).toFixed(2), +top.toFixed(2)], xl: '', yl: ''});
      var pts = S.h.map(function (E, t) { return H.sx(t).toFixed(1) + ',' + H.sy(E).toFixed(1); });
      el('polyline', {points: pts.join(' '), fill: 'none', stroke: GREEN, 'stroke-width': 2.2}, hist);
      dot(hist, H.sx(S.h.length - 1), H.sy(S.h[S.h.length - 1]), 4.5, GREEN);
      slider.value = Math.max(-10, Math.min(10, v));
      tex($('gdNetValName'), nameOf(sel));
      setText('gdNetValOut', num(v, 3)); setText('gdNetEtaOut', num(e, 1));
      setText('gdNetT', S.t); setText('gdNetE', f.E.toFixed(4));
      setText('gdNetY', '(' + f.o[0].toFixed(4) + ', ' + f.o[1].toFixed(4) + ')');
      setText('gdNetD', num(d, 4));
      tex($('gdNetCalc'), nameOf(sel) + ' \\leftarrow ' + tnum(v, 4) + ' - ' + tnum(e, 1) + '\\cdot ' + paren(d, 4) + ' = ' + tnum(v - e * d, 4));
    }
    slider.addEventListener('input', function () { put(S.p, sel, +slider.value); S.t = 0; S.h = [forward(S.p).E]; draw(); });
    eta.addEventListener('input', draw);
    $('gdNetStep').addEventListener('click', function () { stepOnce(); draw(); });
    $('gdNetRun').addEventListener('click', function () { for (var i = 0; i < 50; i++) stepOnce(); draw(); });
    $('gdNetReset').addEventListener('click', function () { eta.value = 0.5; sel = {k: 'W2', i: 0, j: 0}; reset(); });
    reset();
  }

  [fit, tangent, rate, map, loop, two, momentum, net].forEach(function (fn) {
    try { fn(); } catch (e) { if (window.console) console.error('gd widget', fn.name, e); }
  });
})();
</script>
