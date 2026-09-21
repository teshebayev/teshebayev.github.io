<style>
  .rnn-svg text { font-family: Helvetica, Arial, sans-serif; }
  .rnn-svg .v-title { font-size: 19px; font-weight: 700; fill: #111; }
  .rnn-svg .v-small { font-size: 13px; fill: #5E5850; }
  .rnn-svg .v-lbl13 { font-size: 13px; fill: #111; }
  .rnn-svg .v-lblb { font-size: 14px; fill: #2A5E9B; }
  .rnn-svg .v-lblr { font-size: 14px; fill: #A30908; }
  .rnn-svg .v-tlbl { font-size: 13px; fill: #C29E08; }
  .rnn-svg .v-wlbl { font-size: 14px; font-weight: 700; fill: #8C7106; }
  .rnn-svg .v-capy { font-size: 13px; fill: #8C7106; }
  .rnn-svg .tensor-name { font-size: 13px; font-style: italic; fill: #111; }
  .rnn-svg .box-blue   { fill:#EAF2FA; stroke:#3576C0; stroke-width:2; }
  .rnn-svg .box-yellow { fill:#FFF8D9; stroke:#C29E08; stroke-width:2; }
  .rnn-svg .box-green  { fill:#F0FAF0; stroke:#73B222; stroke-width:2; }
  .rnn-svg .box-red    { fill:#FDECEC; stroke:#C30B0A; stroke-width:2; }
  .rnn-svg .edge-green { stroke:#73B222; stroke-width:2; fill:none; }
  .rnn-svg .edge-red   { stroke:#C30B0A; stroke-width:2; fill:none; }
  .rnn-svg .thin       { stroke:#9A948C; stroke-width:1.4; fill:none; }
  .rnn-svg .dash-y     { fill:none; stroke:#C29E08; stroke-width:1.5; stroke-dasharray:6 4; }
  .rnn-svg .formula-bg { fill:#FAFAF8; stroke:#E4E1D7; stroke-width:1.5; }
</style>

<style>
/* ===== Добавленные PDF-интерактивы: стили из референсов, локально по id ===== */
#stage-pdf .svg-title, #stage-bptt .svg-title { font-size:28px; font-weight:400; fill:#111; font-family:Georgia,'Times New Roman',serif; }
#stage-pdf .svg-word, #stage-bptt .svg-word { font-size:18px; fill:#111; }
#stage-pdf .svg-small, #stage-bptt .svg-small { font-size:15px; fill:#555; }
#stage-pdf .svg-form, #stage-bptt .svg-form { font-size:18px; fill:#111; font-style:italic; }
#stage-pdf .svg-form-sm, #stage-bptt .svg-form-sm { font-size:20px; fill:#111; }
#stage-pdf .svg-big, #stage-bptt .svg-big { font-size:26px; fill:#111; font-style:italic; }
#stage-pdf .node-in { fill:#f6d89f; stroke:#b18f57; stroke-width:1.3; }
#stage-pdf .node-h { fill:#e7b7b7; stroke:#ad7d7d; stroke-width:1.3; }
#stage-pdf .node-y { fill:#f0d9a8; stroke:#b89655; stroke-width:1.3; }
#stage-pdf .connect { stroke:#8a8a8a; stroke-width:1.3; opacity:.95; }
#stage-pdf .layer-1 { fill:#F0F6FC; stroke:#3576C0; stroke-width:2.2; }
#stage-pdf .layer-2 { fill:#FFFBEB; stroke:#C29E08; stroke-width:2.2; }
#stage-pdf .layer-n { fill:#F0FAF0; stroke:#73B222; stroke-width:2.2; }
#stage-pdf .layer-fc { fill:#FFF4F4; stroke:#C30B0A; stroke-width:2.2; }
#stage-pdf .input-box { fill:#fff; stroke:#3576C0; stroke-width:1.8; }
#stage-pdf .output-chip { fill:#F0FAF0; stroke:#73B222; stroke-width:1.6; }
#stage-pdf .param-box { fill:#FFFBEB; stroke:#C29E08; stroke-width:2; }
#stage-pdf .memory-box { fill:#F0F6FC; stroke:#3576C0; stroke-width:2; }
#stage-pdf .flow-gray, #stage-bptt .flow-gray { stroke:#5E5850; stroke-width:2.2; fill:none; }
#stage-pdf .flow-blue, #stage-bptt .flow-blue { stroke:#3576C0; stroke-width:2.4; fill:none; }
#stage-pdf .flow-yellow, #stage-bptt .flow-yellow { stroke:#C29E08; stroke-width:2.4; fill:none; }
#stage-pdf .flow-green, #stage-bptt .flow-green { stroke:#73B222; stroke-width:2.4; fill:none; }
#stage-pdf .flow-red, #stage-bptt .flow-red { stroke:#C30B0A; stroke-width:2.4; fill:none; }
#stage-pdf .flow-dashed { stroke-dasharray:7 6; }
#stage-pdf .formula-panel, #stage-bptt .formula-panel {
  width:100%; height:100%; display:flex; flex-direction:column; justify-content:center;
  padding:20px 24px; border:1.5px solid #D9E4F0; border-radius:14px;
  background:#F8FBFE; color:#111; font-family:Georgia,'Times New Roman',serif;
}
#stage-pdf .formula-panel .formula-caption, #stage-bptt .formula-panel .formula-caption {
  margin-bottom:14px; color:#5E5850; font-family:Helvetica,Arial,sans-serif; font-size:17px; line-height:1.35;
}
#stage-pdf .formula-grid { display:grid; grid-template-columns:max-content 22px minmax(0,1fr); align-items:baseline; column-gap:8px; row-gap:16px; font-size:25px; line-height:1.25; font-style:italic; }
#stage-pdf .formula-grid .lhs { text-align:right; white-space:nowrap; }
#stage-pdf .formula-grid .eq { text-align:center; font-style:normal; }
#stage-pdf .formula-grid .rhs { white-space:nowrap; }
#stage-pdf .formula-grid sub, #stage-pdf .formula-grid sup { font-size:.68em; line-height:0; }
#stage-pdf .time-axis-label { font-size:15px; fill:#5E5850; font-weight:700; letter-spacing:.03em; }
#stage-pdf .time-tick { font-size:14px; fill:#5E5850; }
#stage-pdf .layer-caption, #stage-bptt .layer-caption { font-size:14px; font-weight:700; letter-spacing:.04em; }
#stage-pdf .layer-caption.l1, #stage-bptt .layer-caption.l1 { fill:#2A5E9B; }
#stage-pdf .layer-caption.l2, #stage-bptt .layer-caption.l2 { fill:#8C7106; }
#stage-pdf .layer-caption.ln, #stage-bptt .layer-caption.ln { fill:#5A8C1C; }
#stage-pdf .state-label, #stage-bptt .state-label { font-size:19px; fill:#111; font-style:italic; }
#stage-pdf .output-label, #stage-bptt .output-label { font-size:17px; font-style:italic; }
#stage-pdf .output-label.l1, #stage-bptt .output-label.l1 { fill:#2A5E9B; }
#stage-pdf .output-label.l2, #stage-bptt .output-label.l2 { fill:#8C7106; }
#stage-pdf .output-label.ln, #stage-bptt .output-label.ln { fill:#5A8C1C; }
#stage-pdf .row-focus { fill:#F8FBFE; stroke:#D9E4F0; stroke-width:1.2; rx:12; }
#stage-pdf .row-focus-2 { fill:#FCFAF0; stroke:#E9DFA8; stroke-width:1.2; rx:12; }
#stage-pdf .row-focus-all { fill:#F6FAF2; stroke:#D7E9C1; stroke-width:1.2; rx:12; }
#stage-pdf .stage-figure svg text, #stage-bptt .stage-figure svg text { dominant-baseline:alphabetic; }

#stage-bptt .grad-arrow { stroke:#C30B0A; stroke-width:3.2; fill:none; }
#stage-bptt .grad-arrow-soft { stroke:#C30B0A; stroke-width:2.4; fill:none; stroke-dasharray:7 5; }
#stage-bptt .time-arrow { stroke:#5E5850; stroke-width:2.1; fill:none; }
#stage-bptt .state-t1 { fill:#F0F6FC; stroke:#3576C0; stroke-width:2.2; }
#stage-bptt .state-t2 { fill:#FFFBEB; stroke:#C29E08; stroke-width:2.2; }
#stage-bptt .state-t3 { fill:#F0FAF0; stroke:#73B222; stroke-width:2.2; }
#stage-bptt .state-t0 { fill:#F4F1EA; stroke:#8B857B; stroke-width:2; }
#stage-bptt .head-box, #stage-bptt .loss-box, #stage-bptt .layer-two, #stage-bptt .loss-chip { fill:#FFF4F4; stroke:#C30B0A; stroke-width:2; }
#stage-bptt .input-vector { fill:#fff; stroke:#3576C0; stroke-width:1.8; }
#stage-bptt .output-box { fill:#F0FAF0; stroke:#73B222; stroke-width:1.8; }
#stage-bptt .grad-label { fill:#A30908; font-size:16px; font-style:italic; font-family:Georgia,'Times New Roman',serif; }
#stage-bptt .axis-title { fill:#5E5850; font-size:15px; font-weight:800; letter-spacing:.05em; text-transform:uppercase; }
#stage-bptt .step-tag { fill:#5E5850; font-size:14px; font-weight:700; }
#stage-bptt .svg-note { fill:#5E5850; font-size:16px; }
#stage-bptt .svg-note-strong { fill:#111; font-size:17px; font-weight:750; }
#stage-bptt .formula-panel.bptt { justify-content:flex-start; padding:18px 22px; overflow:hidden; }
#stage-bptt .formula-panel.bptt .formula-caption { margin-bottom:10px; }
#stage-bptt .eqblock { display:flex; flex-direction:column; gap:13px; font-family:Georgia,'Times New Roman',serif; font-size:23px; line-height:1.25; font-style:italic; }
#stage-bptt .eqrow { display:flex; align-items:center; flex-wrap:wrap; gap:.34em; min-height:34px; }
#stage-bptt .eqrow.center { justify-content:center; }
#stage-bptt .eqrow.small { font-size:20px; }
#stage-bptt .eqrow.big { font-size:27px; }
#stage-bptt .eqrow .op { font-style:normal; }
#stage-bptt .frac { display:inline-flex; flex-direction:column; align-items:center; justify-content:center; vertical-align:middle; line-height:1.02; white-space:nowrap; }
#stage-bptt .frac > .num { padding:0 .15em .08em; border-bottom:1.55px solid currentColor; }
#stage-bptt .frac > .den { padding:.08em .15em 0; }
#stage-bptt .formula-card-red { border:1.5px solid #E9B9B9; background:#FFF7F7; border-radius:10px; padding:12px 14px; }
#stage-bptt .formula-card-blue { border:1.5px solid #D9E4F0; background:#F8FBFE; border-radius:10px; padding:12px 14px; }
#stage-bptt .formula-card-yellow { border:1.5px solid #E9DFA8; background:#FFFCF1; border-radius:10px; padding:12px 14px; }
#stage-bptt .formula-highlight { display:inline-flex; padding:.08em .18em; border:2px solid #C30B0A; border-radius:4px; color:#A30908; }
#stage-bptt .formula-explain { font-family:Helvetica,Arial,sans-serif; font-size:15px; line-height:1.42; font-style:normal; color:#5E5850; margin-top:4px; }
#stage-bptt .path-legend { display:flex; flex-wrap:wrap; gap:10px; margin-top:8px; font:14px/1.35 Helvetica,Arial,sans-serif; color:#5E5850; }
#stage-bptt .path-legend span { display:inline-flex; align-items:center; gap:6px; }
#stage-bptt .path-legend i { width:18px; height:3px; display:inline-block; border-radius:2px; }
#stage-bptt .sum-symbol { font-size:1.55em; line-height:.8; font-style:normal; }
#stage-bptt .loss-column { display:grid; grid-template-columns:max-content 26px minmax(0,1fr); gap:10px 7px; align-items:center; }
#stage-bptt .loss-column .eq { text-align:center; font-style:normal; }
#stage-bptt .stage-notes { min-height:330px; }
</style>


<style>
  .stage-figure #rc, .stage-figure #bp { display: block; width: 100%; max-width: 760px; margin: 0 auto; }

  .slider-stage { padding-bottom: 20px; }
  .slider-grid { display: grid; grid-template-columns: minmax(0, 1fr) 252px; gap: 20px; align-items: stretch; }
  .slider-panel { border-left: 1px solid #ECE9E0; padding: 10px 2px 10px 20px; display: flex; flex-direction: column; justify-content: center; }
  .range-label { font-size: 13px; color: #5E5850; text-transform: uppercase; letter-spacing: .06em; font-weight: 800; }
  input[type="range"] { width: 100%; accent-color: #3576C0; min-height: 44px; cursor: pointer; }
  .live-number { font-size: 34px; line-height: 1; font-weight: 800; margin: 10px 0 4px; color: #3576C0; }
  .live-number.small { font-size: 23px; }
  .live-caption { color: #5E5850; font-size: 14px; line-height: 1.45; }
  .live-caption code { font-size: 13px; }
  .toggle-row { display: flex; gap: 8px; margin: 12px 0 10px; flex-wrap: wrap; }
  .toggle-row button { min-height: 44px; padding: 8px 13px; border-radius: 9px; border: 1px solid #C9C2B8; background: #fff; font: inherit; font-weight: 750; cursor: pointer; }
  .toggle-row button.active { color: #fff; background: #1b1d26; border-color: #1b1d26; }
  .formula-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 22px 0; }
  .formula-card { min-width: 0; background: #fff; border: 1px solid #E4E1D7; border-radius: 11px; padding: 13px 14px; }
  .formula-card span { display: block; font-size: 11px; color: #5E5850; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
  .formula-card .math-display { margin: 8px 0 2px; font-size: 14px; }
  .numeric-stage { margin-top: 22px; }
  .numeric-stage .stage-notes { min-height: 240px; }
  .numeric-stage .step-panel .math-display { margin: 14px 0; }
  .rn-axis { stroke: #C9C2B8; stroke-width: 1.5; }
  .rn-grid { stroke: #ECE9E0; stroke-width: 1.4; }
  .rn-tick { font-size: 13px; fill: #5E5850; }
  .rn-cap { font-size: 13px; fill: #5E5850; letter-spacing: .04em; text-transform: uppercase; }
  .rn-title { font-size: 18px; fill: #111111; font-weight: 800; }
  .rn-node { fill: #ffffff; stroke: #C9C2B8; stroke-width: 1.6; }
  .rn-blue { fill: #F0F6FC; stroke: #3576C0; stroke-width: 2.2; }
  .rn-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2.2; }
  .rn-green { fill: #F0FAF0; stroke: #73B222; stroke-width: 2.2; }
  .rn-red { fill: #FFF4F4; stroke: #C30B0A; stroke-width: 2.2; }
  .rn-mono { font: 600 16px/1.2 "Courier New", monospace; fill: #111111; }
  .rn-flow { fill: none; stroke: #5E5850; stroke-width: 2.2; }
  @media (max-width: 760px) {
    .slider-grid { grid-template-columns: 1fr; }
    .slider-panel { border-left: 0; border-top: 1px solid #ECE9E0; padding: 16px 4px 2px; }
    .slider-stage .stage-figure svg { min-width: 0; }
    .formula-strip { grid-template-columns: 1fr; }
    .numeric-stage .stage-notes { min-height: 0; }
    .numeric-stage .step-panel .math-display { font-size: 12.5px; overflow-x: auto; overflow-y: hidden; }
  }
</style>



<p class="lead">
  Рекуррентная сеть — это не новый тип нейрона. Это тот же полносвязный слой,
  которому дали второй вход: собственный результат с предыдущего шага. Из этой
  одной добавки вырастают и память, и развёртка во времени, и вся сложность
  обратного прохода.
</p>

<p>
  Мы начнём с того, как последовательность вообще превращается в числа, соберём
  ячейку RNN из уже знакомого линейного слоя, посчитаем ошибку на всей
  последовательности и разберём backpropagation through time на развёрнутом
  графе. Затем посмотрим, почему градиент затухает, соберём формы тензоров и трюк
  с конкатенацией и напишем ту же сеть в коде. Все обозначения вводятся ровно
  перед тем местом, где они нужны.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Полносвязный слой</strong>
    <p>Достаточно помнить, что <code>Z = XW + b</code> и что такое softmax.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>4 токена, 3 шага, H = 2</strong>
    <p>Одна короткая фраза проходит через схемы, формы тензоров и код.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Полный цикл BPTT</strong>
    <p>Вы поймёте, откуда берётся рекурсия в градиенте и почему он затухает.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные и структура</span>
  <span><i style="background:#C29E08"></i>операция и параметр</span>
  <span><i style="background:#73B222"></i>результат прямого хода</span>
  <span><i style="background:#C30B0A"></i>ошибка и градиент</span>
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> в статье их два вида. Пошаговые
  сцены с кнопкой «Далее» показывают одну и ту же схему, гася всё, кроме нужной
  части, — смотрите не на всю картинку, а на яркую. Ползунки и переключатели
  меняют одно число и сразу пересчитывают результат: ими стоит поиграть, а не
  просто пролистать. Кнопки ← → на клавиатуре работают, когда сцена в фокусе.
</div>

## Часть 1. Последовательность — это данные с осью времени

<p>
  Полносвязная сеть принимает объект целиком: одна строка признаков — один ответ.
  Но у текста, речи, показаний датчика или цен акции есть свойство, которого нет
  у таблицы: <strong>порядок</strong>. «Собака укусила человека» и «человек укусил
  собаку» состоят из одних и тех же слов, а означают разное. Значит, модель должна
  видеть не мешок признаков, а последовательность.
</p>

<p>
  Первый шаг — превратить текст в числа. Текст режется на <strong>токены</strong>
  (для простоты будем считать, что токен — это слово), каждому токену словарь
  назначает номер, а номер разворачивается в вектор. В самом простом случае это
  <strong>one-hot</strong>: вектор длины <code>V</code>, где на месте нужного
  токена стоит единица, а на остальных нули.
</p>

<div class="math-display" data-tex="\langle \mathrm{BOS}\rangle\ \text{you will pass} \;\longrightarrow\; (1,2,3) \;\longrightarrow\; X \in \mathbb{R}^{T \times V}"></div>

<p>
  Служебные токены <code>&lt;BOS&gt;</code> (begin of sentence) и
  <code>&lt;EOS&gt;</code> (end of sentence) отмечают начало и конец фразы: первому
  шагу нужно с чего-то стартовать, а модель должна уметь сказать «я закончила».
  Обозначения, которые понадобятся дальше, лучше зафиксировать сразу.
</p>

<table class="shape-table">
  <tr><th>Обозначение</th><th>Смысл</th><th>В нашем примере</th></tr>
  <tr><td><code>B</code></td><td>batch size — сколько последовательностей обрабатываем сразу</td><td>1</td></tr>
  <tr><td><code>T</code></td><td>длина последовательности — сколько шагов времени</td><td>3</td></tr>
  <tr><td><code>E</code></td><td>embedding size — размер вектора одного токена</td><td>4</td></tr>
  <tr><td><code>H</code></td><td>hidden size — размер скрытого состояния (памяти)</td><td>2</td></tr>
  <tr><td><code>O</code></td><td>output size — размер выхода на одном шаге</td><td>4</td></tr>
  <tr><td><code>t</code></td><td>номер шага времени, <code>t = 1 … T</code></td><td>1, 2, 3</td></tr>
</table>

<p>
  Посмотрим пошагово, как фраза превращается в тензор, который можно скормить сети.
</p>

<div class="stage" id="stageSeq" tabindex="0">
  <div class="stage-figure">
<svg id="sq" viewBox="0 0 960 470" role="img" aria-label="Схема: предложение, словарь, one-hot матрица и вход ячейки на шаге t">
  <style>
    #sq { font-family: Helvetica, Arial, sans-serif; }
    #sq .tok  { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    #sq .cell { fill: #ffffff; stroke: #5E5850; stroke-width: 1.1; }
    #sq .cellon { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #sq .box  { fill: #ffffff; stroke: #5E5850; stroke-width: 1.3; }
    #sq .boxg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #sq .boxb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #sq .lbl  { font-size: 17px; fill: #111111; }
    #sq .lblb { font-size: 17px; fill: #3576C0; }
    #sq .lblg { font-size: 17px; fill: #73B222; }
    #sq .num  { font-size: 15px; fill: #111111; }
    #sq .numy { font-size: 15px; fill: #C29E08; font-weight: 700; }
    #sq .cap  { font-size: 14px; fill: #5E5850; }
    #sq .capy { font-size: 14px; fill: #C29E08; }
    #sq .tax  { font-size: 14px; fill: #C29E08; }
    #sq .edge { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    #sq .bra  { stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #sq .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="sq-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="sent">
    <text x="40" y="34" class="cap">одна последовательность, порядок несёт смысл</text>
    <text x="102" y="62" class="tax" text-anchor="middle">t = 1</text>
    <text x="252" y="62" class="tax" text-anchor="middle">t = 2</text>
    <text x="402" y="62" class="tax" text-anchor="middle">t = 3</text>
    <text x="552" y="62" class="tax" text-anchor="middle">t = 4</text>
    <rect x="40"  y="74" width="124" height="44" rx="7" class="tok"/>
    <text x="102" y="103" class="lblb" text-anchor="middle">&lt;BOS&gt;</text>
    <rect x="190" y="74" width="124" height="44" rx="7" class="tok"/>
    <text x="252" y="103" class="lblb" text-anchor="middle">you</text>
    <rect x="340" y="74" width="124" height="44" rx="7" class="tok"/>
    <text x="402" y="103" class="lblb" text-anchor="middle">will</text>
    <rect x="490" y="74" width="124" height="44" rx="7" class="tok"/>
    <text x="552" y="103" class="lblb" text-anchor="middle">pass</text>
    <text x="640" y="103" class="cap">T = 4 шага</text>
  </g>

  <g data-key="vocab">
    <text x="40" y="168" class="cap">словарь: токен → id</text>
    <rect x="40" y="182" width="210" height="40" rx="6" class="box"/>
    <text x="56" y="207" class="lbl">&lt;BOS&gt;</text>
    <text x="234" y="207" class="lbl" text-anchor="end">1</text>
    <rect x="40" y="230" width="210" height="40" rx="6" class="box"/>
    <text x="56" y="255" class="lbl">you</text>
    <text x="234" y="255" class="lbl" text-anchor="end">2</text>
    <rect x="40" y="278" width="210" height="40" rx="6" class="box"/>
    <text x="56" y="303" class="lbl">will</text>
    <text x="234" y="303" class="lbl" text-anchor="end">3</text>
    <rect x="40" y="326" width="210" height="40" rx="6" class="box"/>
    <text x="56" y="351" class="lbl">pass</text>
    <text x="234" y="351" class="lbl" text-anchor="end">4</text>
    <text x="40" y="392" class="cap">размер словаря V = 4</text>
  </g>

  <g data-key="onehot">
    <text x="300" y="168" class="cap">one-hot: id → строка длины V</text>
    <path d="M 398 186 q -10 0 -10 10 L 388 348 q 0 10 10 10" class="bra"/>
    <path d="M 618 186 q 10 0 10 10 L 628 348 q 0 10 -10 10" class="bra"/>
    <rect x="404" y="192" width="52" height="40" class="cell"/>
    <rect x="456" y="192" width="52" height="40" class="cell"/>
    <rect x="508" y="192" width="52" height="40" class="cell"/>
    <rect x="560" y="192" width="52" height="40" class="cell"/>
    <rect x="404" y="232" width="52" height="40" class="cell"/>
    <rect x="456" y="232" width="52" height="40" class="cell"/>
    <rect x="508" y="232" width="52" height="40" class="cell"/>
    <rect x="560" y="232" width="52" height="40" class="cell"/>
    <rect x="404" y="272" width="52" height="40" class="cell"/>
    <rect x="456" y="272" width="52" height="40" class="cell"/>
    <rect x="508" y="272" width="52" height="40" class="cell"/>
    <rect x="560" y="272" width="52" height="40" class="cell"/>
    <rect x="404" y="312" width="52" height="40" class="cell"/>
    <rect x="456" y="312" width="52" height="40" class="cell"/>
    <rect x="508" y="312" width="52" height="40" class="cell"/>
    <rect x="560" y="312" width="52" height="40" class="cell"/>
    <text x="430" y="218" class="num" text-anchor="middle">1</text>
    <text x="482" y="218" class="num" text-anchor="middle">0</text>
    <text x="534" y="218" class="num" text-anchor="middle">0</text>
    <text x="586" y="218" class="num" text-anchor="middle">0</text>
    <text x="430" y="258" class="num" text-anchor="middle">0</text>
    <text x="482" y="258" class="num" text-anchor="middle">1</text>
    <text x="534" y="258" class="num" text-anchor="middle">0</text>
    <text x="586" y="258" class="num" text-anchor="middle">0</text>
    <text x="430" y="298" class="num" text-anchor="middle">0</text>
    <text x="482" y="298" class="num" text-anchor="middle">0</text>
    <text x="534" y="298" class="num" text-anchor="middle">1</text>
    <text x="586" y="298" class="num" text-anchor="middle">0</text>
    <text x="430" y="338" class="num" text-anchor="middle">0</text>
    <text x="482" y="338" class="num" text-anchor="middle">0</text>
    <text x="534" y="338" class="num" text-anchor="middle">0</text>
    <text x="586" y="338" class="num" text-anchor="middle">1</text>
    <text x="380" y="218" class="cap" text-anchor="end">&lt;BOS&gt;</text>
    <text x="380" y="258" class="cap" text-anchor="end">you</text>
    <text x="380" y="298" class="cap" text-anchor="end">will</text>
    <text x="380" y="338" class="cap" text-anchor="end">pass</text>
  </g>

  <g data-key="mat">
    <text x="508" y="392" class="cap" text-anchor="middle">вся фраза = матрица X формы [T, V] = [4, 4]</text>
  </g>

  <g data-key="slice" data-only="1">
    <rect x="404" y="232" width="208" height="40" class="cellon" fill="none"/>
    <line x1="628" y1="252" x2="686" y2="252" class="edge" marker-end="url(#sq-arw)"/>
    <text x="508" y="418" class="capy" text-anchor="middle">на шаге t ячейка получает ровно одну строку</text>
  </g>

  <g data-key="xt">
    <text x="700" y="168" class="cap">вход ячейки на шаге t</text>
    <rect x="700" y="228" width="220" height="48" rx="8" class="boxb"/>
    <text x="810" y="258" class="lblb" text-anchor="middle">x₂ = (0, 1, 0, 0)</text>
    <text x="810" y="300" class="cap" text-anchor="middle">форма [B, E] = [1, 4]</text>
  </g>

  <g data-key="batch">
    <rect x="716" y="344" width="196" height="44" rx="7" class="box"/>
    <rect x="708" y="336" width="196" height="44" rx="7" class="box"/>
    <rect x="700" y="328" width="196" height="44" rx="7" class="boxg"/>
    <text x="798" y="357" class="lblg" text-anchor="middle">[B, T, E]</text>
    <text x="810" y="410" class="cap" text-anchor="middle">батч = стопка последовательностей</text>
  </g>

  <text x="40" y="452" class="legend">синий — данные · жёлтый — то, что выбирается на текущем шаге · зелёный — итоговый тензор</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="sent" data-focus="sent">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>Объект — это не строка, а цепочка</h4>
      <p>
        В полносвязной сети один объект — одна строка чисел. Здесь один объект —
        целая последовательность из <code>T</code> элементов, и у каждого элемента
        есть номер шага <code>t</code>. Переставить элементы нельзя: это будет
        другой объект.
      </p>
      <p>
        Токен <code>&lt;BOS&gt;</code> стоит первым, чтобы у шага <code>t = 1</code>
        был хоть какой-то вход, когда предсказывать нужно уже первое настоящее слово.
      </p>
    </div>
    <div class="step-panel" data-on="sent vocab" data-focus="vocab">
      <div class="step-kicker">Шаг 2 · словарь</div>
      <h4>Токен превращается в номер</h4>
      <p>
        Словарь — это просто таблица соответствия «текст → целое число». Его строят
        один раз по обучающему корпусу, и он не меняется во время обучения. Размер
        словаря <code>V</code> у настоящих моделей — десятки тысяч; у нас, чтобы
        всё поместилось на экране, ровно четыре.
      </p>
      <div class="callout-blue">
        <strong>Почему не подать сам номер?</strong> Число 3 не «в полтора раза
        больше» числа 2 в смысле языка. Порядковый номер навязал бы модели ложную
        арифметику между словами, поэтому номер разворачивают в вектор.
      </div>
    </div>
    <div class="step-panel" data-on="vocab onehot" data-focus="onehot">
      <div class="step-kicker">Шаг 3 · кодирование</div>
      <h4>One-hot: единица на своём месте</h4>
      <p>
        Токен с номером <code>k</code> становится вектором длины <code>V</code>, у
        которого <code>k</code>-я координата равна единице, а все остальные — нулю.
        Никакой токен при этом не «ближе» к другому: все векторы одинаково
        перпендикулярны друг другу.
      </p>
      <div class="math-display" data-tex="x_t \in \{0,1\}^{V},\qquad \sum_{k=1}^{V} x_t^k = 1"></div>
      <p>
        Здесь размер эмбеддинга совпадает с размером словаря: <code>E = V = 4</code>.
        В настоящих сетях one-hot почти сразу заменяют на обучаемую таблицу
        эмбеддингов, но для понимания механики это ничего не меняет.
      </p>
    </div>
    <div class="step-panel" data-on="onehot mat" data-focus="mat">
      <div class="step-kicker">Шаг 4 · тензор</div>
      <h4>Последовательность целиком — матрица</h4>
      <p>
        Сложив строки одну под другой, получаем матрицу <code>X</code> формы
        <code>[T, V]</code>. Строка номер <code>t</code> — это токен, поданный на
        шаге <code>t</code>. В нашем примере она случайно оказалась единичной
        матрицей: каждое слово встречается ровно один раз.
      </p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="\langle\mathrm{BOS}\rangle\ \text{you will pass}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="X=\begin{pmatrix}1&amp;0&amp;0&amp;0\\0&amp;1&amp;0&amp;0\\0&amp;0&amp;1&amp;0\\0&amp;0&amp;0&amp;1\end{pmatrix}\in\mathbb R^{4\times4}"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> строки — время, столбцы — словарь. Первая строка означает «на шаге 1 пришёл токен номер 1».</p>
      </div>
    </div>
    <div class="step-panel" data-on="onehot mat slice xt" data-focus="slice xt">
      <div class="step-kicker">Шаг 5 · вход одного шага</div>
      <h4>Ячейка работает с одной строкой за раз</h4>
      <p>
        Это ключевое отличие от полносвязной сети. RNN не видит матрицу
        <code>X</code> целиком: она берёт строку <code>t = 1</code>, что-то с ней
        делает, потом берёт строку <code>t = 2</code>, и так далее. Форма входа на
        одном шаге — <code>[B, E]</code>, ровно как у обычного линейного слоя.
      </p>
      <div class="callout-blue">
        <strong>Отсюда и вся конструкция:</strong> раз шаги обрабатываются по
        очереди, между ними нужно что-то передавать, иначе шаг <code>t = 2</code>
        не будет знать, что было на шаге <code>t = 1</code>. Это «что-то» и есть
        скрытое состояние.
      </div>
    </div>
    <div class="step-panel" data-on="xt batch" data-focus="batch">
      <div class="step-kicker">Шаг 6 · батч</div>
      <h4>Батч добавляет третью ось, а не новую логику</h4>
      <p>
        В обучении сразу обрабатывают <code>B</code> последовательностей. Тензор
        становится <code>[B, T, E]</code>, но ось <code>T</code> по-прежнему
        разворачивается циклом, а ось <code>B</code> — просто дополнительные строки
        в каждом матричном умножении.
      </p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="B=1,\quad T=3,\quad E=4"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="X\in\mathbb R^{1\times3\times4},\quad x_t\in\mathbb R^{1\times4}"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> дальше в статье мы работаем с тремя шагами — входы <code>&lt;BOS&gt;</code>, <code>you</code>, <code>will</code>, а целями будут <code>you</code>, <code>will</code>, <code>pass</code>.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

### Что именно попадает в ячейку на такте t

<p>
  Матрица <code>X</code> хранит фразу целиком, но ячейка никогда не видит её
  целиком: на такте <code>t</code> ей достаётся ровно одна строка. Переключите
  шаг и посмотрите, какой вектор идёт на вход и какой токен модель обязана
  предсказать.
</p>

<div class="stage slider-stage" id="stageTimeStep" tabindex="0">
<div class="slider-grid">
<div class="stage-figure">
<svg id="rnSeq" viewBox="0 0 680 392" role="img" aria-label="Три такта времени: токен, его one-hot вектор и целевой токен">
<defs>
<marker id="rnSeqArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
<path d="M0,0 L10,5 L0,10 Z" fill="#5E5850"></path>
</marker>
</defs>
<text x="36" y="30" class="rn-title">Одна фраза — три такта</text>
<text x="165" y="66" text-anchor="middle" class="rn-cap">вход x_t</text>
<text x="362" y="66" text-anchor="middle" class="rn-cap">строка X, V = 4</text>
<text x="570" y="66" text-anchor="middle" class="rn-cap">цель y_t</text>
<text x="293" y="90" text-anchor="middle" font-size="12" fill="#5E5850">&lt;BOS&gt;</text>
<text x="339" y="90" text-anchor="middle" font-size="12" fill="#5E5850">you</text>
<text x="385" y="90" text-anchor="middle" font-size="12" fill="#5E5850">will</text>
<text x="431" y="90" text-anchor="middle" font-size="12" fill="#5E5850">pass</text>
<g data-row="1">
<text x="66" y="133" text-anchor="middle" class="rn-cap">t = 1</text>
<rect x="100" y="100" width="130" height="52" rx="9" class="rn-blue"></rect>
<text x="165" y="133" text-anchor="middle" font-size="17" font-weight="700" fill="#3576C0">&lt;BOS&gt;</text>
<rect x="270" y="100" width="46" height="52" class="rn-node"></rect>
<rect x="316" y="100" width="46" height="52" class="rn-node"></rect>
<rect x="362" y="100" width="46" height="52" class="rn-node"></rect>
<rect x="408" y="100" width="46" height="52" class="rn-node"></rect>
<text x="293" y="133" text-anchor="middle" class="rn-mono">1</text>
<text x="339" y="133" text-anchor="middle" class="rn-mono">0</text>
<text x="385" y="133" text-anchor="middle" class="rn-mono">0</text>
<text x="431" y="133" text-anchor="middle" class="rn-mono">0</text>
<path d="M 466 126 L 496 126" class="rn-flow" marker-end="url(#rnSeqArrow)"></path>
<rect x="505" y="100" width="130" height="52" rx="9" class="rn-green"></rect>
<text x="570" y="133" text-anchor="middle" font-size="17" font-weight="700" fill="#5A8C1C">you</text>
</g>
<g data-row="2">
<text x="66" y="225" text-anchor="middle" class="rn-cap">t = 2</text>
<rect x="100" y="192" width="130" height="52" rx="9" class="rn-blue"></rect>
<text x="165" y="225" text-anchor="middle" font-size="17" font-weight="700" fill="#3576C0">you</text>
<rect x="270" y="192" width="46" height="52" class="rn-node"></rect>
<rect x="316" y="192" width="46" height="52" class="rn-node"></rect>
<rect x="362" y="192" width="46" height="52" class="rn-node"></rect>
<rect x="408" y="192" width="46" height="52" class="rn-node"></rect>
<text x="293" y="225" text-anchor="middle" class="rn-mono">0</text>
<text x="339" y="225" text-anchor="middle" class="rn-mono">1</text>
<text x="385" y="225" text-anchor="middle" class="rn-mono">0</text>
<text x="431" y="225" text-anchor="middle" class="rn-mono">0</text>
<path d="M 466 218 L 496 218" class="rn-flow" marker-end="url(#rnSeqArrow)"></path>
<rect x="505" y="192" width="130" height="52" rx="9" class="rn-green"></rect>
<text x="570" y="225" text-anchor="middle" font-size="17" font-weight="700" fill="#5A8C1C">will</text>
</g>
<g data-row="3">
<text x="66" y="317" text-anchor="middle" class="rn-cap">t = 3</text>
<rect x="100" y="284" width="130" height="52" rx="9" class="rn-blue"></rect>
<text x="165" y="317" text-anchor="middle" font-size="17" font-weight="700" fill="#3576C0">will</text>
<rect x="270" y="284" width="46" height="52" class="rn-node"></rect>
<rect x="316" y="284" width="46" height="52" class="rn-node"></rect>
<rect x="362" y="284" width="46" height="52" class="rn-node"></rect>
<rect x="408" y="284" width="46" height="52" class="rn-node"></rect>
<text x="293" y="317" text-anchor="middle" class="rn-mono">0</text>
<text x="339" y="317" text-anchor="middle" class="rn-mono">0</text>
<text x="385" y="317" text-anchor="middle" class="rn-mono">1</text>
<text x="431" y="317" text-anchor="middle" class="rn-mono">0</text>
<path d="M 466 310 L 496 310" class="rn-flow" marker-end="url(#rnSeqArrow)"></path>
<rect x="505" y="284" width="130" height="52" rx="9" class="rn-green"></rect>
<text x="570" y="317" text-anchor="middle" font-size="17" font-weight="700" fill="#5A8C1C">pass</text>
</g>
<text x="36" y="370" font-size="13" fill="#5E5850">погашенные строки — это другие такты: сеть дойдёт до них по очереди, а не увидит сразу</text>
</svg>
</div>
<div class="slider-panel">
<div class="range-label">Такт времени</div>
<div class="toggle-row" role="group" aria-label="Такт времени">
<button type="button" data-seq-step="1" class="active" aria-pressed="true">t = 1</button>
<button type="button" data-seq-step="2" aria-pressed="false">t = 2</button>
<button type="button" data-seq-step="3" aria-pressed="false">t = 3</button>
</div>
<div id="rnSeqVec" class="live-number small">(1, 0, 0, 0)</div>
<div class="live-caption">вектор <code>x_t</code>, который получает ячейка</div>
<div id="rnSeqTarget" class="live-number small" style="color:#5A8C1C">you</div>
<div class="live-caption">токен, который она обязана предсказать</div>
</div>
</div>
</div>
<p class="stage-hint">Схема не перерисовывается: меняется только активная строка — ровно то, что происходит внутри цикла по времени.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> последовательность — это обычные матрицы
  плюс ось времени, по которой сеть идёт шаг за шагом. Всё остальное в RNN — ответ
  на вопрос «что передавать между соседними шагами».
</div>

---

## Часть 2. Ячейка RNN — полносвязный слой, который помнит

<p>
  Возьмём один шаг времени и забудем на минуту про рекуррентность. На вход пришёл
  вектор <code>x<sub>t</sub></code> длины <code>E</code>. Пропустим его через
  обычный линейный слой и активацию — получим вектор длины <code>H</code>.
  Это буквально то же самое, что делает первый слой полносвязной сети.
</p>

<div class="math-display" data-tex="h_t = f\left(x_t W_{xh} + b_h\right)"></div>

<p>
  Такая сеть уже что-то умеет, но у неё есть фатальный для последовательностей
  недостаток: результат на шаге <code>t</code> зависит только от токена номер
  <code>t</code>. Слово «bank» в «river bank» и в «bank account» дало бы
  абсолютно одинаковый ответ. Нужен канал, по которому шаг может передать
  что-то следующему шагу.
</p>

<p>
  Решение простое до неприличия: возьмём <strong>тот же самый вектор
  <code>h</code></strong>, который слой выдал на прошлом шаге, и подадим его на
  вход вместе с <code>x<sub>t</sub></code> — через свою матрицу весов
  <code>W<sub>hh</sub></code>. Вектор <code>h<sub>t</sub></code> называют
  <strong>скрытым состоянием</strong>: это и выход слоя, и его память.
</p>

<div class="math-display" data-tex="h_t = f\left(x_t W_{xh} + h_{t-1} W_{hh} + b_h\right), \qquad h_0 = 0"></div>

<p>
  Поверх скрытого состояния ставится ещё один линейный слой — он переводит память
  размера <code>H</code> в ответ размера <code>O</code>. Для задачи «предскажи
  следующий токен» <code>O = V</code>, а после него идёт softmax.
</p>

<div class="math-display" data-tex="y_t = \mathrm{softmax}\left(h_t W_{hy} + b_y\right)"></div>

<div class="callout-blue">
  <strong>Почему обычно берут tanh.</strong> Скрытое состояние подаётся само в
  себя раз за разом, поэтому его нужно удерживать в разумных пределах: без
  ограничения значения расходятся за десяток шагов. Функция <code>tanh</code>
  зажимает состояние в <code>(−1, 1)</code>, симметрична относительно нуля и имеет
  максимум производной, равный 1, — это важно для градиента, к которому мы
  вернёмся в части про обратный проход.
</div>

<p>
  Подвигайте предактивацию. Зелёная кривая — само состояние, жёлтая — величина
  <span class="math-inline" data-tex="1-h^2"></span>, производная
  <code>tanh</code>. Она понадобится в четвёртой части: именно на неё умножается
  градиент при каждом шаге назад во времени. Обратите внимание, что она никогда
  не бывает больше единицы.
</p>

<div class="stage slider-stage" id="stageTanh" tabindex="0">
<div class="slider-grid">
<div class="stage-figure">
<svg id="rnTanh" viewBox="0 0 680 420" role="img" aria-label="Интерактивный график гиперболического тангенса и его производной">
<line x1="70" y1="210" x2="648" y2="210" class="rn-axis"></line>
<line x1="355" y1="52" x2="355" y2="370" class="rn-grid"></line>
<line x1="70" y1="70" x2="648" y2="70" class="rn-grid" stroke-dasharray="6 6"></line>
<text x="60" y="75" text-anchor="end" class="rn-tick">1</text>
<text x="60" y="215" text-anchor="end" class="rn-tick">0</text>
<text x="60" y="355" text-anchor="end" class="rn-tick">−1</text>
<text x="70" y="390" text-anchor="middle" class="rn-tick">−3</text>
<text x="355" y="390" text-anchor="middle" class="rn-tick">0</text>
<text x="640" y="390" text-anchor="middle" class="rn-tick">3</text>
<text x="648" y="412" text-anchor="end" class="rn-cap">предактивация a</text>
<path id="rnTanhCurve" fill="none" stroke="#73B222" stroke-width="4" stroke-linecap="round"></path>
<path id="rnTanhDeriv" fill="none" stroke="#C29E08" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="9 5"></path>
<line id="rnTanhGuide" x1="355" y1="210" x2="355" y2="210" stroke="#3576C0" stroke-width="2" stroke-dasharray="5 5"></line>
<circle id="rnTanhDot" cx="355" cy="210" r="9" fill="#3576C0" stroke="#fff" stroke-width="3"></circle>
<circle id="rnTanhDotD" cx="355" cy="70" r="7" fill="#C29E08" stroke="#fff" stroke-width="3"></circle>
<text x="482" y="120" font-size="15" font-weight="800" fill="#5A8C1C">h = tanh a</text>
<text x="482" y="145" font-size="15" font-weight="800" fill="#8C7106">1 − h²</text>
</svg>
</div>
<div class="slider-panel">
<label class="range-label" for="rnTanhRange">Предактивация a</label>
<input id="rnTanhRange" type="range" min="-3" max="3" step="0.05" value="0.6">
<div id="rnTanhA" class="live-number">0.60</div>
<div class="live-caption">сумма вклада токена, памяти и сдвига</div>
<div id="rnTanhH" class="live-number" style="color:#5A8C1C">0.5370</div>
<div class="live-caption">состояние <code>h = tanh a</code></div>
<div id="rnTanhD" class="live-number" style="color:#8C7106">0.7116</div>
<div class="live-caption">множитель <code>1 − h²</code> для градиента</div>
</div>
</div>
</div>
<p class="stage-hint">Значение 0.6 — это первая координата предактивации <code>a₁</code> из сквозного примера, поэтому стартовое состояние на графике равно 0.5370.</p>

<div class="callout-yellow">
  <strong>Жёлтая кривая — это пропускная способность такта.</strong> Пока
  состояние близко к нулю, шаг назад почти не ослабляет градиент. Но стоит
  <code>h</code> уйти к ±1, как множитель падает почти до нуля: насыщенная ячейка
  перестаёт передавать не только сигнал вперёд, но и обучение назад.
</div>

<p>
  Разберём ячейку по деталям: сначала соберём её как обычный слой, потом увидим,
  чего ей не хватает, и достроим недостающее.
</p>

<div class="stage" id="stageCell" tabindex="0">
  <div class="stage-figure">
<svg id="cl" viewBox="0 0 960 660" role="img" aria-label="Развёрнутая схема ячейки RNN: входы, матрицы весов, скрытое состояние, выход и рекуррентная связь">
  <style>
    #cl { font-family: Helvetica, Arial, sans-serif; }
    #cl .var  { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    #cl .varh { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #cl .varo { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.7; }
    #cl .op   { fill: #ffffff; stroke: #C29E08; stroke-width: 1.7; }
    #cl .wbox { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #cl .lblb { font-size: 17px; fill: #3576C0; }
    #cl .lbly { font-size: 17px; fill: #8C7106; }
    #cl .lblg { font-size: 17px; fill: #5A8C1C; }
    #cl .wlbl { font-size: 16px; fill: #8C7106; font-weight: 700; }
    #cl .cap  { font-size: 14px; fill: #5E5850; }
    #cl .capr { font-size: 15px; fill: #C30B0A; }
    #cl .dots { font-size: 20px; fill: #5E5850; }
    #cl .edge { stroke: #9A948C; stroke-width: 0.9; fill: none; }
    #cl .edge2{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #cl .curve{ stroke: #C30B0A; stroke-width: 2; fill: none; }
    #cl .divl { stroke: #C29E08; stroke-width: 1.2; }
    #cl .loop { stroke: #C29E08; stroke-width: 2; fill: none; stroke-dasharray: 7 5; }
    #cl .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="cl-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="cl-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
  </defs>

  <text x="205" y="32" class="legend">E — размер вектора токена</text>
  <text x="205" y="52" class="legend">H — размер скрытого состояния</text>
  <text x="205" y="72" class="legend">O — размер выхода одного шага</text>
  <text x="205" y="92" class="legend">t — номер шага времени</text>

  <g data-key="xin">
    <text x="62" y="34" class="cap" text-anchor="middle">вход шага t</text>
    <circle cx="62" cy="90"  r="26" class="var"/>
    <text x="62" y="97"  class="lblb" text-anchor="middle">x¹</text>
    <circle cx="62" cy="168" r="26" class="var"/>
    <text x="62" y="175" class="lblb" text-anchor="middle">x²</text>
    <text x="62" y="222" class="dots" text-anchor="middle">⋮</text>
    <circle cx="62" cy="262" r="26" class="var"/>
    <text x="62" y="269" class="lblb" text-anchor="middle">xᴱ</text>
  </g>

  <g data-key="exh">
    <line x1="88" y1="90"  x2="314" y2="240" class="edge"/>
    <line x1="88" y1="90"  x2="314" y2="340" class="edge"/>
    <line x1="88" y1="90"  x2="314" y2="460" class="edge"/>
    <line x1="88" y1="168" x2="314" y2="240" class="edge"/>
    <line x1="88" y1="168" x2="314" y2="340" class="edge"/>
    <line x1="88" y1="168" x2="314" y2="460" class="edge"/>
    <line x1="88" y1="262" x2="314" y2="240" class="edge"/>
    <line x1="88" y1="262" x2="314" y2="340" class="edge"/>
    <line x1="88" y1="262" x2="314" y2="460" class="edge"/>
  </g>

  <g data-key="wxh">
    <rect x="110" y="286" width="80" height="36" rx="6" class="wbox"/>
    <text x="150" y="311" class="wlbl" text-anchor="middle">W</text>
    <text x="167" y="316" class="wlbl" font-size="12">xh</text>
  </g>

  <g data-key="hsum">
    <circle cx="350" cy="240" r="36" class="op"/>
    <line x1="350" y1="205" x2="350" y2="275" class="divl"/>
    <text x="332" y="249" class="lbly" text-anchor="middle" font-size="24">Σ</text>
    <polyline points="358,258 364,255 370,246 376,234 382,225 388,222" class="curve"/>
    <circle cx="350" cy="340" r="36" class="op"/>
    <line x1="350" y1="305" x2="350" y2="375" class="divl"/>
    <text x="332" y="349" class="lbly" text-anchor="middle" font-size="24">Σ</text>
    <polyline points="358,358 364,355 370,346 376,334 382,325 388,322" class="curve"/>
    <circle cx="350" cy="460" r="36" class="op"/>
    <line x1="350" y1="425" x2="350" y2="495" class="divl"/>
    <text x="332" y="469" class="lbly" text-anchor="middle" font-size="24">Σ</text>
    <polyline points="358,478 364,475 370,466 376,454 382,445 388,442" class="curve"/>
    <text x="350" y="530" class="cap" text-anchor="middle">сумма + активация</text>
  </g>

  <g data-key="hout">
    <line x1="386" y1="240" x2="437" y2="240" class="edge2" marker-end="url(#cl-arw)"/>
    <line x1="386" y1="340" x2="437" y2="340" class="edge2" marker-end="url(#cl-arw)"/>
    <line x1="386" y1="460" x2="437" y2="460" class="edge2" marker-end="url(#cl-arw)"/>
    <circle cx="470" cy="240" r="27" class="varh"/>
    <text x="470" y="247" class="lbly" text-anchor="middle">h¹ₜ</text>
    <circle cx="470" cy="340" r="27" class="varh"/>
    <text x="470" y="347" class="lbly" text-anchor="middle">h²ₜ</text>
    <text x="470" y="408" class="dots" text-anchor="middle">⋮</text>
    <circle cx="470" cy="460" r="27" class="varh"/>
    <text x="470" y="467" class="lbly" text-anchor="middle">hᴴₜ</text>
    <text x="470" y="196" class="cap" text-anchor="middle">скрытое состояние</text>
  </g>

  <g data-key="ehy">
    <line x1="497" y1="240" x2="626" y2="110" class="edge"/>
    <line x1="497" y1="240" x2="626" y2="220" class="edge"/>
    <line x1="497" y1="240" x2="626" y2="340" class="edge"/>
    <line x1="497" y1="340" x2="626" y2="110" class="edge"/>
    <line x1="497" y1="340" x2="626" y2="220" class="edge"/>
    <line x1="497" y1="340" x2="626" y2="340" class="edge"/>
    <line x1="497" y1="460" x2="626" y2="110" class="edge"/>
    <line x1="497" y1="460" x2="626" y2="220" class="edge"/>
    <line x1="497" y1="460" x2="626" y2="340" class="edge"/>
  </g>

  <g data-key="why">
    <rect x="556" y="150" width="80" height="36" rx="6" class="wbox"/>
    <text x="594" y="175" class="wlbl" text-anchor="middle">W</text>
    <text x="611" y="180" class="wlbl" font-size="12">hy</text>
  </g>

  <g data-key="ysum">
    <circle cx="660" cy="110" r="34" class="op"/>
    <line x1="660" y1="77" x2="660" y2="143" class="divl"/>
    <text x="643" y="119" class="lbly" text-anchor="middle" font-size="22">Σ</text>
    <polyline points="667,127 673,124 679,116 685,105 691,96 696,93" class="curve"/>
    <circle cx="660" cy="220" r="34" class="op"/>
    <line x1="660" y1="187" x2="660" y2="253" class="divl"/>
    <text x="643" y="229" class="lbly" text-anchor="middle" font-size="22">Σ</text>
    <polyline points="667,237 673,234 679,226 685,215 691,206 696,203" class="curve"/>
    <circle cx="660" cy="340" r="34" class="op"/>
    <line x1="660" y1="307" x2="660" y2="373" class="divl"/>
    <text x="643" y="349" class="lbly" text-anchor="middle" font-size="22">Σ</text>
    <polyline points="667,357 673,354 679,346 685,335 691,326 696,323" class="curve"/>
  </g>

  <g data-key="yout">
    <line x1="694" y1="110" x2="750" y2="110" class="edge2" marker-end="url(#cl-arw)"/>
    <line x1="694" y1="220" x2="750" y2="220" class="edge2" marker-end="url(#cl-arw)"/>
    <line x1="694" y1="340" x2="750" y2="340" class="edge2" marker-end="url(#cl-arw)"/>
    <circle cx="783" cy="110" r="27" class="varo"/>
    <text x="783" y="117" class="lblg" text-anchor="middle">y¹ₜ</text>
    <circle cx="783" cy="220" r="27" class="varo"/>
    <text x="783" y="227" class="lblg" text-anchor="middle">y²ₜ</text>
    <text x="783" y="292" class="dots" text-anchor="middle">⋮</text>
    <circle cx="783" cy="340" r="27" class="varo"/>
    <text x="783" y="347" class="lblg" text-anchor="middle">yᴼₜ</text>
    <text x="783" y="62" class="cap" text-anchor="middle">выход шага t</text>
  </g>

  <g data-key="hprev">
    <circle cx="62" cy="370" r="27" class="varh"/>
    <text x="62" y="377" class="lbly" text-anchor="middle" font-size="15">h¹ₜ₋₁</text>
    <circle cx="62" cy="452" r="27" class="varh"/>
    <text x="62" y="459" class="lbly" text-anchor="middle" font-size="15">h²ₜ₋₁</text>
    <text x="62" y="518" class="dots" text-anchor="middle">⋮</text>
    <circle cx="62" cy="566" r="27" class="varh"/>
    <text x="62" y="573" class="lbly" text-anchor="middle" font-size="15">hᴴₜ₋₁</text>
    <text x="95" y="596" class="cap">память прошлого шага</text>
  </g>

  <g data-key="ehh">
    <line x1="89" y1="370" x2="314" y2="240" class="edge"/>
    <line x1="89" y1="370" x2="314" y2="340" class="edge"/>
    <line x1="89" y1="370" x2="314" y2="460" class="edge"/>
    <line x1="89" y1="452" x2="314" y2="240" class="edge"/>
    <line x1="89" y1="452" x2="314" y2="340" class="edge"/>
    <line x1="89" y1="452" x2="314" y2="460" class="edge"/>
    <line x1="89" y1="566" x2="314" y2="240" class="edge"/>
    <line x1="89" y1="566" x2="314" y2="340" class="edge"/>
    <line x1="89" y1="566" x2="314" y2="460" class="edge"/>
  </g>

  <g data-key="whh">
    <rect x="110" y="430" width="80" height="36" rx="6" class="wbox"/>
    <text x="150" y="455" class="wlbl" text-anchor="middle">W</text>
    <text x="167" y="460" class="wlbl" font-size="12">hh</text>
  </g>

  <g data-key="fy">
    <foreignObject x="530" y="404" width="420" height="46"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="y_t = f\left(h_t W_{hy} + b_y\right)"></div></foreignObject>
  </g>

  <g data-key="fh0" data-only="1">
    <foreignObject x="530" y="480" width="420" height="46"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="h_t = f\left(x_t W_{xh} + b_h\right)"></div></foreignObject>
  </g>

  <g data-key="fh" data-only="1">
    <foreignObject x="530" y="480" width="430" height="46"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="h_t = f\left(x_t W_{xh} + h_{t-1} W_{hh} + b_h\right)"></div></foreignObject>
  </g>

  <g data-key="prob" data-only="1">
    <text x="530" y="500" class="capr">выход зависит только от текущего токена</text>
    <text x="530" y="528" class="capr">шаг t = 2 ничего не знает о шаге t = 1</text>
  </g>

  <g data-key="shapes" data-only="1">
    <text x="530" y="466" class="cap">[B, O] = [B, H] • [H, O] + [B, O]</text>
    <text x="530" y="548" class="cap">[B, H] = [B, E] • [E, H] + [B, H] • [H, H] + [B, H]</text>
  </g>

  <g data-key="loop" data-only="1">
    <path d="M 470 487 L 470 612 L 62 612 L 62 596" class="loop" marker-end="url(#cl-arwy)"/>
    <text x="500" y="602" class="cap" text-anchor="middle">hₜ становится hₜ₋₁ на следующем шаге</text>
  </g>

  <text x="40" y="648" class="legend">круг — величина или операция · жёлтый — параметры и память · зелёный — выход прямого хода</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="xin" data-focus="xin">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>На вход приходит один токен</h4>
      <p>
        Вектор <code>x<sub>t</sub></code> состоит из <code>E</code> чисел. Это
        может быть one-hot из первой части или обучаемый эмбеддинг — для ячейки
        разницы нет, она видит просто вектор фиксированной длины.
      </p>
      <div class="math-display" data-tex="x_t = \left(x_t^1,\; x_t^2,\; \dots,\; x_t^E\right)"></div>
    </div>
    <div class="step-panel" data-on="xin exh wxh hsum hout fh0" data-focus="wxh hsum">
      <div class="step-kicker">Шаг 2 · знакомый линейный слой</div>
      <h4>W<sub>xh</sub> — это обычная матрица весов</h4>
      <p>
        Каждый вход соединён с каждым сумматором, весов ровно <code>E × H</code>.
        Сумматор складывает взвешенные входы, добавляет сдвиг и пропускает
        результат через активацию. Пока в этой схеме нет ничего рекуррентного —
        это первый слой полносвязной сети.
      </p>
      <div class="math-display" data-tex="h_t = f\left(x_t W_{xh} + b_h\right)"></div>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="x_1=(1,0,0,0),\quad W_{xh}=\begin{pmatrix}0.5&amp;-0.4\\0.2&amp;0.9\\-0.6&amp;0.3\\0.7&amp;0.1\end{pmatrix}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="x_1 W_{xh} = (0.5,\; -0.4)"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> умножение one-hot вектора на матрицу просто вынимает из неё строку номер 1. Именно поэтому <code>W<sub>xh</sub></code> при one-hot входе работает как таблица эмбеддингов.</p>
      </div>
    </div>
    <div class="step-panel" data-on="hout ehy why ysum yout fy" data-focus="why ysum yout">
      <div class="step-kicker">Шаг 3 · выходной слой</div>
      <h4>Из памяти размера H — в ответ размера O</h4>
      <p>
        Скрытое состояние — это внутреннее представление, его размер
        <code>H</code> выбирает инженер. Чтобы получить ответ в нужном формате,
        поверх ставится ещё одна матрица <code>W<sub>hy</sub></code> формы
        <code>[H, O]</code>. Для языковой модели <code>O</code> равно размеру
        словаря, и сверху добавляется softmax.
      </p>
      <div class="math-display" data-tex="y_t = f\left(h_t W_{hy} + b_y\right)"></div>
      <p>
        Обратите внимание: <code>W<sub>hy</sub></code> смотрит только на
        <code>h<sub>t</sub></code>. Вся история последовательности должна быть уже
        упакована в эти <code>H</code> чисел.
      </p>
    </div>
    <div class="step-panel" data-on="xin hout yout prob" data-focus="prob">
      <div class="step-kicker">Шаг 4 · чего не хватает</div>
      <h4>У такой сети нет памяти</h4>
      <p>
        Если подать ту же схему на каждый токен по очереди, получится <code>T</code>
        независимых предсказаний. Одинаковый вход всегда даст одинаковый выход,
        независимо от того, что было до него.
      </p>
      <div class="callout-red">
        <strong>Что ломается:</strong> «he» и «she» в начале предложения не влияют
        на выбор глагола в конце; закрывающая скобка не знает про открывающую;
        отрицание «не» не меняет смысл следующего слова. Задача просто не решается.
      </div>
    </div>
    <div class="step-panel" data-on="xin hout hprev" data-focus="hprev">
      <div class="step-kicker">Шаг 5 · вторая линия входов</div>
      <h4>Прошлое состояние подаётся как ещё один вход</h4>
      <p>
        Добавим слева вторую колонку: вектор <code>h<sub>t−1</sub></code> — тот
        самый, который эта же ячейка выдала на предыдущем шаге. Его длина
        <code>H</code>, потому что это буквально её собственный прошлый выход.
      </p>
      <p>
        На самом первом шаге предыдущего состояния ещё нет, поэтому берут
        <code>h<sub>0</sub> = 0</code>. Иногда его делают обучаемым параметром, но
        нулевой вектор — стандартный выбор.
      </p>
    </div>
    <div class="step-panel" data-on="xin hprev ehh whh hsum hout" data-focus="whh ehh">
      <div class="step-kicker">Шаг 6 · веса памяти</div>
      <h4>W<sub>hh</sub> решает, что помнить</h4>
      <p>
        У второй линии входов своя матрица весов <code>W<sub>hh</sub></code> формы
        <code>[H, H]</code>: она принимает <code>H</code> чисел и отдаёт
        <code>H</code> чисел в те же сумматоры. Именно эта матрица определяет, как
        старое состояние смешивается с новой информацией.
      </p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="h_1=(0.537,\,-0.462),\quad W_{hh}=\begin{pmatrix}0.4&amp;-0.2\\0.1&amp;0.5\end{pmatrix}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="h_1 W_{hh} = (0.1686,\; -0.3385)"></div>
          </div>
        </div>
        <div class="worked-trace">
          <div class="worked-trace-title">Раскрываем умножение</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">выход 1</div>
            <div class="math-display worked-trace-math" data-tex="0.537\cdot0.4 + (-0.462)\cdot0.1 = 0.1686"></div>
            <div class="worked-trace-note">первый столбец W<sub>hh</sub> собирает всё состояние в одно число</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">выход 2</div>
            <div class="math-display worked-trace-math" data-tex="0.537\cdot(-0.2) + (-0.462)\cdot0.5 = -0.3385"></div>
            <div class="worked-trace-note">второй столбец — своя, независимая комбинация тех же чисел</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> память не копируется, а пересчитывается: каждая координата нового состояния видит все координаты старого.</p>
      </div>
    </div>
    <div class="step-panel" data-on="xin exh wxh hprev ehh whh hsum hout ehy why ysum yout fh fy" data-focus="hsum fh">
      <div class="step-kicker">Шаг 7 · формула ячейки</div>
      <h4>Два входа сходятся в одном сумматоре</h4>
      <p>
        Сумматор не различает, откуда пришло слагаемое. Он складывает вклад
        текущего токена, вклад прошлого состояния и сдвиг — и применяет активацию.
        Это и есть вся ячейка Vanilla RNN.
      </p>
      <div class="math-display" data-tex="h_t = \tanh\left(x_t W_{xh} + h_{t-1} W_{hh} + b_h\right)"></div>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="x_2 W_{xh}=(0.2,\,0.9),\;\; h_1 W_{hh}=(0.1686,\,-0.3385),\;\; b_h=(0.1,\,-0.1)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="h_2=\tanh(0.4686,\;0.4615)=(0.4371,\;0.4313)"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> в состоянии <code>h₂</code> уже смешаны оба токена — <code>&lt;BOS&gt;</code> и <code>you</code>. Это и есть память.</p>
      </div>
    </div>
    <div class="step-panel" data-on="xin exh wxh hprev ehh whh hsum hout ehy why ysum yout fh fy shapes loop" data-focus="shapes loop">
      <div class="step-kicker">Шаг 8 · замыкание цикла</div>
      <h4>Выход шага становится входом следующего</h4>
      <p>
        Пунктирная стрелка — единственное, что отличает эту схему от двух
        полносвязных слоёв. Значение <code>h<sub>t</sub></code> не выбрасывается
        после шага, а возвращается в ту же ячейку в роли
        <code>h<sub>t−1</sub></code>.
      </p>
      <p>
        Формы всех тензоров при этом остаются такими же, как в обычной сети: обе
        матрицы весов дают результат <code>[B, H]</code>, поэтому их можно просто
        сложить.
      </p>
      <table class="shape-table">
        <tr><th>Объект</th><th>Форма</th><th>В примере</th></tr>
        <tr><td><code>x<sub>t</sub></code></td><td>[B, E]</td><td>[1, 4]</td></tr>
        <tr><td><code>W<sub>xh</sub></code></td><td>[E, H]</td><td>[4, 2]</td></tr>
        <tr><td><code>h<sub>t−1</sub></code>, <code>h<sub>t</sub></code></td><td>[B, H]</td><td>[1, 2]</td></tr>
        <tr><td><code>W<sub>hh</sub></code></td><td>[H, H]</td><td>[2, 2]</td></tr>
        <tr><td><code>W<sub>hy</sub></code></td><td>[H, O]</td><td>[2, 4]</td></tr>
        <tr><td><code>y<sub>t</sub></code></td><td>[B, O]</td><td>[1, 4]</td></tr>
      </table>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> ячейка RNN — это линейный слой с двумя
  входами вместо одного. Новизна не в нейроне, а в том, что второй вход — это
  собственный выход слоя с предыдущего шага.
</div>

---



### От полносвязного слоя к рекуррентной ячейке

<p>
  Та же идея ещё раз, крупной схемой: сначала обычный полносвязный слой, затем ячейка со
  скрытым состоянием и матрицами <code>W</code>, <code>U</code>, <code>V</code>, и наконец
  развёртка этой ячейки на три такта сквозного примера. Развёрнутая сеть здесь та же, что в
  сцене обратного прохода.
</p>
<div class="stage" id="stageRnnCell" tabindex="0">
  <div class="stage-figure">
<svg id="rc" viewBox="0 0 960 680" role="img" aria-label="От полносвязного слоя к рекуррентной ячейке и её развёртке на три такта">
  <style>
    #rc { font-family: Helvetica, Arial, sans-serif; }
    #rc text { dominant-baseline: alphabetic; }
    #rc [data-key="fc"].is-focus text, #rc [data-key="cell"].is-focus text, #rc [data-key="mat"].is-focus text { font-weight: 400; }
    #rc .is-focus .sub-title { font-weight: 400; }
    #rc .svg-title { font-size: 28px; fill: #111; font-family: Georgia, 'Times New Roman', serif; }
    #rc .sub-title { font-size: 24px; fill: #111; }
    #rc .svg-word { font-size: 18px; fill: #111; }
    #rc .svg-small { font-size: 15px; fill: #555; }
    #rc .svg-form { font-size: 18px; fill: #111; font-style: italic; }
    #rc .svg-form-sm { font-size: 20px; fill: #111; }
    #rc .svg-big { font-size: 26px; fill: #111; font-style: italic; }
    #rc .state-label { font-size: 21px; fill: #111; font-style: italic; }
    #rc .out-label { font-size: 19px; font-style: italic; }
    #rc .param { font-size: 18px; font-style: italic; font-weight: 700; }
    #rc .step-tag { fill: #5E5850; font-size: 14px; font-weight: 700; }
    #rc .axis-title { fill: #5E5850; font-size: 14px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
    #rc .caption { font-size: 14px; font-weight: 700; letter-spacing: .04em; fill: #2A5E9B; }
    #rc .target { font-size: 14px; fill: #5E5850; }
    #rc .input-box { fill: #fff; stroke: #3576C0; stroke-width: 1.8; }
    #rc .param-box { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2; }
    #rc .memory-box { fill: #F0F6FC; stroke: #3576C0; stroke-width: 2; }
    #rc .output-chip { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #rc .layer-1 { fill: #F0F6FC; stroke: #3576C0; stroke-width: 2.2; }
    #rc .layer-2 { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2.2; }
    #rc .layer-n { fill: #F0FAF0; stroke: #73B222; stroke-width: 2.2; }
    #rc .node-in { fill: #f6d89f; stroke: #b18f57; stroke-width: 1.3; }
    #rc .node-h { fill: #e7b7b7; stroke: #ad7d7d; stroke-width: 1.3; }
    #rc .node-y { fill: #f0d9a8; stroke: #b89655; stroke-width: 1.3; }
    #rc .connect { stroke: #8a8a8a; stroke-width: 1.3; }
    #rc .state-t0 { fill: #F4F1EA; stroke: #8B857B; stroke-width: 2; }
    #rc .state-blue { fill: #F0F6FC; stroke: #3576C0; stroke-width: 2.2; }
    #rc .state-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2.2; }
    #rc .state-green { fill: #F0FAF0; stroke: #73B222; stroke-width: 2.2; }
    #rc .input-vector { fill: #fff; stroke: #3576C0; stroke-width: 1.8; }
    #rc .output-box { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #rc .head-box, #rc .loss-box { fill: #FFF4F4; stroke: #C30B0A; stroke-width: 2; }
    #rc .flow-gray { stroke: #5E5850; stroke-width: 2.2; fill: none; }
    #rc .flow-blue { stroke: #3576C0; stroke-width: 2.4; fill: none; }
    #rc .flow-yellow { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #rc .flow-green { stroke: #73B222; stroke-width: 2.4; fill: none; }
    #rc .flow-red { stroke: #C30B0A; stroke-width: 2.4; fill: none; }
    #rc .time-arrow { stroke: #5E5850; stroke-width: 2.1; fill: none; }
    #rc .grad-arrow { stroke: #C30B0A; stroke-width: 3.2; fill: none; }
    #rc .grad-frame { fill: none; stroke: #C30B0A; stroke-width: 3; }
    #rc .grad-label { fill: #A30908; font-size: 18px; font-style: italic; font-family: Georgia, 'Times New Roman', serif; }
  </style>
  <defs>
    <marker id="rc-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#5E5850"/></marker>
    <marker id="rc-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#3576C0"/></marker>
    <marker id="rc-yellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#C29E08"/></marker>
    <marker id="rc-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#73B222"/></marker>
    <marker id="rc-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#C30B0A"/></marker>
  </defs>
<text class="svg-title" x="32" y="38">От полносвязного слоя к RNN</text>
<g data-key="fc" data-only="1">
<text class="sub-title" x="54" y="110">Полносвязный слой</text>
<g transform="translate(0,50)">
<rect class="input-box" x="260" y="265" width="84" height="70" rx="12"/>
<text class="svg-big" style="fill:#3576C0" text-anchor="middle" x="302" y="309">x</text>
<path class="flow-blue" d="M344 300 H422" marker-end="url(#rc-blue)"/>
<rect class="param-box" x="436" y="246" width="112" height="108" rx="12"/>
<text class="svg-form-sm" text-anchor="middle" x="492" y="295">линейный</text>
<text class="svg-form-sm" text-anchor="middle" x="492" y="323">слой</text>
<text class="svg-form" style="fill:#8C7106" text-anchor="middle" x="492" y="392">W, b</text>
<path class="flow-green" d="M548 300 H626" marker-end="url(#rc-green)"/>
<rect class="output-chip" x="640" y="265" width="84" height="70" rx="12"/>
<text class="svg-big" style="fill:#5A8C1C" text-anchor="middle" x="682" y="309">y</text>
</g></g>
<g data-key="cell" data-only="1">
<text class="sub-title" x="54" y="110">Рекуррентный слой</text>
<g transform="translate(0,40)">
<rect class="input-box" x="260" y="322" width="84" height="70" rx="12"/>
<text x="302" y="366" text-anchor="middle" class="state-label" style="fill:#3576C0">x<tspan dy="-9" font-size="14">t</tspan></text>
<path class="flow-blue" d="M344 357 H422" marker-end="url(#rc-blue)"/>
<rect class="memory-box" x="436" y="132" width="112" height="82" rx="12"/>
<text x="492" y="181" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">t−1</tspan></text>
<text class="caption" x="572" y="178">память из прошлого</text>
<path class="flow-blue" d="M492 214 V295" marker-end="url(#rc-blue)"/>
<rect class="memory-box" x="436" y="309" width="112" height="96" rx="12"/>
<text x="492" y="365" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">t</tspan></text>
<text class="svg-form" style="fill:#8C7106" text-anchor="middle" x="492" y="446">W, U, V, b<tspan dy="6" font-size="12">h</tspan><tspan dy="-6">, b</tspan><tspan dy="6" font-size="12">y</tspan></text>
<path class="flow-green" d="M548 357 H626" marker-end="url(#rc-green)"/>
<rect class="output-chip" x="640" y="322" width="84" height="70" rx="12"/>
<text x="682" y="366" text-anchor="middle" class="state-label" style="fill:#5A8C1C">y<tspan dy="-9" font-size="14">t</tspan></text>
</g></g>
<g data-key="mat" data-only="1">
<text class="sub-title" x="54" y="110">Та же ячейка по нейронам</text>
<g transform="translate(40,20)">
<rect class="input-box" height="220" rx="10" width="52" x="72" y="332"/>
<circle class="node-in" cx="98" cy="365" r="10"/><circle class="node-in" cx="98" cy="410" r="10"/>
<circle class="node-in" cx="98" cy="455" r="10"/><circle class="node-in" cx="98" cy="520" r="10"/>
<text class="svg-form" text-anchor="middle" x="98" y="492">…</text>
<text x="98" y="590" text-anchor="middle" class="state-label" style="fill:#3576C0">x<tspan dy="-9" font-size="14">t</tspan></text><text class="svg-small" x="98" y="614" text-anchor="middle">E</text>
<rect class="layer-1" height="160" rx="10" width="56" x="296" y="160"/>
<circle class="node-h" cx="324" cy="192" r="9"/><circle class="node-h" cx="324" cy="236" r="9"/><circle class="node-h" cx="324" cy="288" r="9"/>
<text class="svg-form" text-anchor="middle" x="324" y="267">…</text>
<text x="324" y="126" text-anchor="middle" class="state-label" style="fill:#2A5E9B">h<tspan dy="-9" font-size="14">t−1</tspan></text><text class="svg-small" x="324" y="150" text-anchor="middle">H</text>
<rect class="layer-2" height="194" rx="10" width="56" x="532" y="160"/>
<circle class="node-h" cx="560" cy="192" r="9"/><circle class="node-h" cx="560" cy="238" r="9"/>
<circle class="node-h" cx="560" cy="284" r="9"/><circle class="node-h" cx="560" cy="326" r="9"/>
<text class="svg-form" text-anchor="middle" x="560" y="309">…</text>
<text x="560" y="126" text-anchor="middle" class="state-label" style="fill:#8C7106">h<tspan dy="-9" font-size="14">t</tspan></text><text class="svg-small" x="560" y="150" text-anchor="middle">H</text>
<rect class="layer-n" height="168" rx="10" width="56" x="764" y="248"/>
<circle class="node-y" cx="792" cy="282" r="10"/><circle class="node-y" cx="792" cy="326" r="10"/><circle class="node-y" cx="792" cy="382" r="10"/>
<text class="svg-form" text-anchor="middle" x="792" y="359">…</text>
<text x="792" y="214" text-anchor="middle" class="state-label" style="fill:#5A8C1C">y<tspan dy="-9" font-size="14">t</tspan></text><text class="svg-small" x="792" y="238" text-anchor="middle">O</text>
<g opacity=".75">
<path class="connect" d="M108 365 L548 192"/><path class="connect" d="M108 365 L548 238"/>
<path class="connect" d="M108 410 L548 238"/><path class="connect" d="M108 410 L548 284"/>
<path class="connect" d="M108 455 L548 284"/><path class="connect" d="M108 520 L548 326"/>
<path class="connect" d="M333 192 L551 192"/><path class="connect" d="M333 236 L551 238"/>
<path class="connect" d="M333 288 L551 284"/>
<path class="connect" d="M569 192 L782 282"/><path class="connect" d="M569 238 L782 326"/><path class="connect" d="M569 284 L782 382"/>
</g>
<text class="svg-form" style="fill:#8C7106" x="244" y="384">W<tspan dy="7" font-size="13">(E×H)</tspan></text>
<text class="svg-form" style="fill:#2A5E9B" x="410" y="176">U<tspan dy="7" font-size="13">(H×H)</tspan></text>
<text class="svg-form" style="fill:#5A8C1C" x="648" y="226">V<tspan dy="7" font-size="13">(H×O)</tspan></text>
<text class="svg-form" style="fill:#8C7106" x="552" y="389">b<tspan dy="7" font-size="13">h</tspan></text>
<text class="svg-form" style="fill:#5A8C1C" text-anchor="middle" x="792" y="448">b<tspan dy="7" font-size="13">y</tspan></text>
</g>
</g>
<g data-key="axis" data-only="1"><path d="M22 150 V632" class="time-arrow" marker-end="url(#rc-gray)"/><text x="12" y="390" class="axis-title" text-anchor="middle" transform="rotate(-90 12 390)">время</text></g>
<g data-key="h0" data-only="1"><rect x="315" y="64" width="92" height="60" rx="12" class="state-t0"/><text x="361" y="102" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">0</tspan></text><text x="423" y="99" class="target">начальная память = 0</text></g>
<g data-key="r1" data-only="1"><text x="40" y="212" class="svg-word" style="font-size:17px">&lt;BOS&gt;</text><text x="40" y="236" class="step-tag">t = 1</text><rect x="108" y="154" width="80" height="112" rx="18" class="input-vector"/><text x="148" y="180" text-anchor="middle" class="svg-small">1</text><text x="148" y="202" text-anchor="middle" class="svg-small">0</text><text x="148" y="224" text-anchor="middle" class="svg-small">0</text><text x="148" y="246" text-anchor="middle" class="svg-small">0</text><text x="210" y="218" text-anchor="middle" class="state-label" style="fill:#3576C0">x<tspan dy="-9" font-size="14">1</tspan></text><path d="M226 210 H303" class="flow-blue" marker-end="url(#rc-blue)"/><rect x="315" y="168" width="92" height="84" rx="12" class="state-blue"/><text x="361" y="218" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">1</tspan></text><path d="M407 210 H454" class="flow-blue" marker-end="url(#rc-blue)"/><rect x="466" y="178" width="76" height="64" rx="10" class="output-box"/><text x="504" y="218" text-anchor="middle" class="out-label" style="fill:#2A5E9B">y<tspan dy="-9" font-size="14">1</tspan></text></g>
<g data-key="u1" data-only="1"><path d="M361 124 V156" class="flow-gray" marker-end="url(#rc-gray)"/></g>
<g data-key="p1" data-only="1"><text x="264" y="198" text-anchor="middle" class="param" style="fill:#8C7106">W</text><text x="379" y="152" class="param" style="fill:#2A5E9B">U</text><text x="430" y="198" text-anchor="middle" class="param" style="fill:#5A8C1C">V</text></g>
<g data-key="r2" data-only="1"><text x="40" y="382" class="svg-word" style="font-size:17px">you</text><text x="40" y="406" class="step-tag">t = 2</text><rect x="108" y="324" width="80" height="112" rx="18" class="input-vector"/><text x="148" y="350" text-anchor="middle" class="svg-small">0</text><text x="148" y="372" text-anchor="middle" class="svg-small">1</text><text x="148" y="394" text-anchor="middle" class="svg-small">0</text><text x="148" y="416" text-anchor="middle" class="svg-small">0</text><text x="210" y="388" text-anchor="middle" class="state-label" style="fill:#3576C0">x<tspan dy="-9" font-size="14">2</tspan></text><path d="M226 380 H303" class="flow-blue" marker-end="url(#rc-blue)"/><rect x="315" y="338" width="92" height="84" rx="12" class="state-yellow"/><text x="361" y="388" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">2</tspan></text><path d="M407 380 H454" class="flow-yellow" marker-end="url(#rc-yellow)"/><rect x="466" y="348" width="76" height="64" rx="10" class="output-box"/><text x="504" y="388" text-anchor="middle" class="out-label" style="fill:#8C7106">y<tspan dy="-9" font-size="14">2</tspan></text></g>
<g data-key="u2" data-only="1"><path d="M361 252 V326" class="flow-blue" marker-end="url(#rc-blue)"/></g>
<g data-key="p2" data-only="1"><text x="264" y="368" text-anchor="middle" class="param" style="fill:#8C7106">W</text><text x="379" y="301" class="param" style="fill:#2A5E9B">U</text><text x="430" y="368" text-anchor="middle" class="param" style="fill:#5A8C1C">V</text></g>
<g data-key="r3" data-only="1"><text x="40" y="552" class="svg-word" style="font-size:17px">will</text><text x="40" y="576" class="step-tag">t = 3</text><rect x="108" y="494" width="80" height="112" rx="18" class="input-vector"/><text x="148" y="520" text-anchor="middle" class="svg-small">0</text><text x="148" y="542" text-anchor="middle" class="svg-small">0</text><text x="148" y="564" text-anchor="middle" class="svg-small">1</text><text x="148" y="586" text-anchor="middle" class="svg-small">0</text><text x="210" y="558" text-anchor="middle" class="state-label" style="fill:#3576C0">x<tspan dy="-9" font-size="14">3</tspan></text><path d="M226 550 H303" class="flow-blue" marker-end="url(#rc-blue)"/><rect x="315" y="508" width="92" height="84" rx="12" class="state-green"/><text x="361" y="558" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">3</tspan></text><path d="M407 550 H454" class="flow-green" marker-end="url(#rc-green)"/><rect x="466" y="518" width="76" height="64" rx="10" class="output-box"/><text x="504" y="558" text-anchor="middle" class="out-label" style="fill:#5A8C1C">y<tspan dy="-9" font-size="14">3</tspan></text></g>
<g data-key="u3" data-only="1"><path d="M361 422 V496" class="flow-yellow" marker-end="url(#rc-yellow)"/></g>
<g data-key="p3" data-only="1"><text x="264" y="538" text-anchor="middle" class="param" style="fill:#8C7106">W</text><text x="379" y="471" class="param" style="fill:#2A5E9B">U</text><text x="430" y="538" text-anchor="middle" class="param" style="fill:#5A8C1C">V</text></g>
<g data-key="head" data-only="1"><path d="M542 550 H578" class="flow-green" marker-end="url(#rc-green)"/><rect x="590" y="504" width="100" height="92" rx="12" class="head-box"/><text x="640" y="543" text-anchor="middle" class="svg-form-sm">FC</text><text x="640" y="572" text-anchor="middle" class="svg-form" style="fill:#A30908">W<tspan dy="6" font-size="12">fc</tspan><tspan dy="-6">, b</tspan><tspan dy="6" font-size="12">fc</tspan></text><path d="M690 550 H714" class="flow-red" marker-end="url(#rc-red)"/><rect x="726" y="518" width="64" height="64" rx="10" class="loss-box"/><text x="758" y="559" text-anchor="middle" class="svg-big" style="fill:#A30908">ŷ</text><path d="M790 550 H814" class="flow-red" marker-end="url(#rc-red)"/><rect x="826" y="510" width="118" height="80" rx="12" class="loss-box"/><text x="885" y="542" text-anchor="middle" class="svg-form-sm">loss</text><text x="885" y="572" text-anchor="middle" class="svg-form">L(ŷ, y)</text><text x="885" y="498" text-anchor="middle" class="target">цель: pass</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="fc" data-focus="fc">
      <div class="step-kicker">Шаг 1 · отправная точка</div>
      <h4>Сначала вспоминаем обычный полносвязный слой</h4>
      <p>Есть входной вектор <code>x</code>, слой с параметрами <code>W</code> и <code>b</code>, и на выходе получается вектор <code>y</code>. Памяти здесь нет: каждый объект обрабатывается сам по себе — пришёл вход, слой один раз выполнил преобразование и выдал ответ.</p><p>Для последовательности этого мало: сеть должна помнить, что было до текущего шага, а полносвязный слой этого не умеет.</p>
      <div class="math-display" data-tex="y = f\left(x W + b\right)"></div>
    </div>
    <div class="step-panel" data-on="cell" data-focus="cell">
      <div class="step-kicker">Шаг 2 · новая сущность</div>
      <h4>У рекуррентного слоя появляется скрытое состояние</h4>
      <p>Вход <code>xᵗ</code> и выход <code>yᵗ</code> остаются, но сверху приходит дополнительный вход — скрытое состояние прошлого такта <code>hᵗ⁻¹</code>. Это и есть память слоя: она переносит информацию из прошлого в текущий момент.</p><p>Здесь два вычисления. Сначала сеть обновляет память — из текущего входа и прошлой памяти собирает <code>hᵗ</code>. Потом из нового состояния строит выход.</p>
      <div class="math-display" data-tex="h^{t}=\tanh\!\left(x^{t}W+h^{t-1}U+b_h\right),\qquad y^{t}=f\!\left(h^{t}V+b_y\right)"></div>
    </div>
    <div class="step-panel" data-on="mat" data-focus="mat">
      <div class="step-kicker">Шаг 3 · та же ячейка по нейронам</div>
      <h4>Видно, какая матрица за что отвечает</h4>
      <p>Вход <code>xᵗ</code> из <code>E</code> чисел умножается на <code>W</code>, прошлая память <code>hᵗ⁻¹</code> из <code>H</code> чисел — на <code>U</code>. Сигналы складываются, к ним добавляется <code>b<sub>h</sub></code>, и получается новое состояние <code>hᵗ</code> того же размера <code>H</code>. Затем <code>V</code> переводит его в выход <code>yᵗ</code> размера <code>O</code>.</p><p>Поэтому <code>U</code> обязана быть квадратной, а размер памяти не меняется от шага к шагу. В основной части статьи это <code>W<sub>xh</sub></code>, <code>W<sub>hh</sub></code> и <code>W<sub>hy</sub></code>; в сквозном примере <code>E = 4</code>, <code>H = 2</code>, <code>O = 4</code>.</p>
      <div class="math-display" data-tex="W\in\mathbb R^{E\times H},\qquad U\in\mathbb R^{H\times H},\qquad V\in\mathbb R^{H\times O}"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1" data-focus="h0 r1">
      <div class="step-kicker">Шаг 4 · первый такт</div>
      <h4>Разворачиваем ячейку во времени: первый токен</h4>
      <p>Теперь та же ячейка обрабатывает фразу по токенам. На первом такте приходит one-hot вектор <code>&lt;BOS&gt;</code>, а в роли прошлой памяти выступает <code>h⁰</code> — обычно нулевой вектор. Ячейка получает состояние <code>h¹</code> и выход <code>y¹</code>.</p>
      <div class="math-display" data-tex="h^{1}=\tanh\!\left(x^{1}W+h^{0}U+b_h\right),\qquad h^{0}=0"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2" data-focus="u2 r2">
      <div class="step-kicker">Шаг 5 · второй такт</div>
      <h4>Второй токен приходит уже не к пустой памяти</h4>
      <p>Токен <code>you</code> обрабатывается той же ячейкой, но вместо <code>h⁰</code> в неё входит <code>h¹</code>. Вертикальная стрелка — это перенос памяти по времени, горизонтальные — вычисления внутри одного такта. Так в <code>h²</code> попадает информация о первом токене.</p>
      <div class="math-display" data-tex="h^{2}=\tanh\!\left(x^{2}W+h^{1}U+b_h\right)"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3" data-focus="u3 r3">
      <div class="step-kicker">Шаг 6 · третий такт</div>
      <h4>Последнее состояние видело всю фразу</h4>
      <p>На третьем такте приходит <code>will</code>. Состояние <code>h³</code> зависит от <code>x³</code> напрямую, от <code>x²</code> — через <code>h²</code>, от <code>x¹</code> — через цепочку <code>h¹ → h² → h³</code>. Вся прочитанная часть фразы сжата в <code>H</code> чисел.</p>
      <div class="math-display" data-tex="h^{3}=\tanh\!\left(x^{3}W+h^{2}U+b_h\right)"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3" data-focus="p1 p2 p3">
      <div class="step-kicker">Шаг 7 · общие параметры</div>
      <h4>На всех тактах работают одни и те же W, U и V</h4>
      <p>Матриц не стало больше: на каждом такте стоят те же <code>W</code>, <code>U</code> и <code>V</code>. Развёртка — это картинка цикла <code>for t in range(T)</code>, а не три разных слоя.</p><p>Отсюда главное следствие для обучения: каждый параметр использован <code>T</code> раз, и его градиент соберёт вклады со всех тактов.</p>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head" data-focus="head">
      <div class="step-kicker">Шаг 8 · ответ по всей последовательности</div>
      <h4>Поверх последнего выхода ставят полносвязную голову</h4>
      <p>Если нужен один ответ на всю фразу, выход последнего такта <code>y³</code> передают в обычный слой <code>FC</code> с параметрами <code>W<sub>fc</sub></code> и <code>b<sub>fc</sub></code>. Он превращает накопленный контекст в предсказание <code>ŷ</code>, а loss сравнивает его с целью — токеном <code>pass</code>.</p><p>RNN отвечает за накопление контекста, голова — за превращение контекста в ответ. С этой картинки начинается обратный проход.</p>
      <div class="math-display" data-tex="\hat y=\operatorname{softmax}\!\left(y^{3}W_{fc}+b_{fc}\right)"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

---

## Часть 3. Ошибка на последовательности

<p>
  У полносвязной сети loss считался один раз: одно предсказание — одна ошибка. У
  RNN предсказаний может быть <code>T</code>, и от того, сколько из них попадает в
  функцию потерь, зависит вся форма задачи.
</p>

<table class="shape-table">
  <tr><th>Схема</th><th>Где берётся ошибка</th><th>Примеры задач</th></tr>
  <tr><td>many-to-many</td><td>на каждом шаге</td><td>языковая модель, POS-разметка, NER</td></tr>
  <tr><td>many-to-one</td><td>только на последнем шаге</td><td>классификация тональности, детекция спама</td></tr>
  <tr><td>one-to-many</td><td>на каждом шаге, вход один</td><td>подпись к картинке, генерация из вектора</td></tr>
  <tr><td>seq2seq</td><td>на шагах декодера</td><td>перевод, суммаризация</td></tr>
</table>

<p>
  Мы разбираем many-to-many: выход есть на каждом шаге, и цель — следующий токен.
  Ошибка шага — стандартная кросс-энтропия, а поскольку <code>y<sub>t</sub></code>
  является one-hot вектором, скалярное произведение просто выбирает нужную
  координату.
</p>

<div class="math-display" data-tex="\mathcal{L}\left(\hat{y}_1,\dots,\hat{y}_T\right) = -\frac{1}{B}\sum_{n=1}^{B}\Big(\log\left(y_1 \cdot \hat{y}_1\right) + \dots + \log\left(y_T \cdot \hat{y}_T\right)\Big)"></div>

<p>
  Деление на <code>B</code> (а часто и на <code>T</code>) — не косметика.
  Без него величина градиента зависела бы от размера батча, и подобранный
  learning rate переставал бы работать при его изменении.
</p>

<p>
  Внутри одного шага это ровно та же кросс-энтропия, что и в классификации: из
  всего распределения берётся вероятность правильного токена, и от неё берётся
  минус логарифм. Подвигайте эту вероятность и посмотрите, как реагируют ошибка
  шага и ошибка всей последовательности.
</p>

<div class="stage slider-stage" id="stageCE" tabindex="0">
<div class="slider-grid">
<div class="stage-figure">
<svg id="rnCE" viewBox="0 0 680 420" role="img" aria-label="Кривая минус логарифма вероятности правильного токена">
<line x1="75" y1="360" x2="648" y2="360" class="rn-axis"></line>
<line x1="75" y1="50" x2="75" y2="360" class="rn-axis"></line>
<line x1="75" y1="285" x2="648" y2="285" class="rn-grid"></line>
<line x1="75" y1="210" x2="648" y2="210" class="rn-grid"></line>
<line x1="75" y1="135" x2="648" y2="135" class="rn-grid"></line>
<line x1="75" y1="60" x2="648" y2="60" class="rn-grid"></line>
<text x="65" y="365" text-anchor="end" class="rn-tick">0</text>
<text x="65" y="290" text-anchor="end" class="rn-tick">1</text>
<text x="65" y="215" text-anchor="end" class="rn-tick">2</text>
<text x="65" y="140" text-anchor="end" class="rn-tick">3</text>
<text x="65" y="65" text-anchor="end" class="rn-tick">4</text>
<text x="75" y="386" text-anchor="middle" class="rn-tick">0</text>
<text x="355" y="386" text-anchor="middle" class="rn-tick">0.5</text>
<text x="635" y="386" text-anchor="middle" class="rn-tick">1</text>
<text x="648" y="410" text-anchor="end" class="rn-cap">вероятность правильного токена</text>
<text x="92" y="46" class="rn-cap">ошибка шага</text>
<path id="rnCECurve" fill="none" stroke="#C30B0A" stroke-width="4" stroke-linecap="round"></path>
<line id="rnCEGuide" x1="355" y1="360" x2="355" y2="210" stroke="#3576C0" stroke-width="2" stroke-dasharray="5 5"></line>
<circle id="rnCEDot" cx="355" cy="210" r="9" fill="#3576C0" stroke="#fff" stroke-width="3"></circle>
</svg>
</div>
<div class="slider-panel">
<label class="range-label" for="rnCERange">Вероятность цели на шаге 1</label>
<input id="rnCERange" type="range" min="0.02" max="0.98" step="0.005" value="0.145">
<div id="rnCEP" class="live-number">0.145</div>
<div class="live-caption">сколько модель дала правильному токену</div>
<div id="rnCEStep" class="live-number" style="color:#A30908">1.931</div>
<div class="live-caption">ошибка шага <code>L_1 = −log p</code></div>
<div id="rnCETotal" class="live-number small" style="color:#A30908">1.521</div>
<div class="live-caption">ошибка последовательности; шаги 2 и 3 оставлены как в примере</div>
</div>
</div>
</div>
<p class="stage-hint">Единственный шаг с уверенной ошибкой поднимает среднее по всей фразе — поэтому один плохой такт заметен в loss даже на длинной последовательности.</p>

<div class="callout-red">
  <strong>Асимметрия штрафа.</strong> Разница между 0.9 и 0.7 стоит около 0.25, а
  между 0.1 и 0.02 — уже больше полутора. Кросс-энтропия почти не награждает за
  дополнительную уверенность в правильном ответе, но резко наказывает за
  уверенность в неправильном.
</div>

<div class="callout-yellow">
  <strong>Про padding.</strong> В батче последовательности обычно разной длины, и
  короткие дополняются служебным токеном <code>&lt;PAD&gt;</code>. Ошибку на этих
  позициях нужно занулять маской, иначе модель будет старательно учиться
  предсказывать пустоту. В PyTorch для этого есть
  <code>ignore_index</code> у <code>CrossEntropyLoss</code>.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> loss у RNN — это сумма обычных loss'ов по
  шагам. Ничего нового в самой функции потерь нет; новое начнётся, когда мы
  спросим, как её градиент проходит назад сквозь время.
</div>

---

### Forward руками: вся фраза на числах

<p>
  До сих пор ячейка, развёртка и loss были схемами. Теперь проведём сквозной
  пример целиком: сначала каждая операция в общем виде, затем та же цепочка по
  элементам матриц, где строка — один такт, и наконец на конкретных числах до
  <span class="math-inline" data-tex="\mathcal L = 1{,}5192"></span>. Матрицы здесь называются
  <span class="math-inline" data-tex="W_{xh}, W_{hh}, W_{hy}"></span> — это те же <code>W</code>, <code>U</code> и <code>V</code>
  из второй части.
</p>

### Сеть, которую можно посчитать руками

<p>
  Напомним сквозной пример. Словарь — четыре токена: &lt;BOS&gt;, you, will, pass. Каждый токен — строка
  one-hot длины 4. На вход подаём фразу &lt;BOS&gt; you will и на каждом такте
  просим предсказать следующий токен: you, will, pass. Внутри такта четыре
  операции: ячейка складывает вклад токена и вклад памяти и сжимает сумму tanh,
  выходной слой превращает состояние в четыре логита, softmax — в вероятности,
  cross-entropy — в ошибку такта. Ошибки трёх тактов усредняются.
</p>
<div class="math-display" data-tex="h_0=0\;\xrightarrow{\;x_1\;}\;h_1\;\xrightarrow{\;x_2\;}\;h_2\;\xrightarrow{\;x_3\;}\;h_3,\qquad h_t\;\xrightarrow{\;W_{hy},\,b_y\;}\;z_t\in\mathbb{R}^{4}\;\to\;\hat y_t,\ \mathcal L_t\;\to\;\mathcal L"></div>

<div class="stage" id="stageArch" tabindex="0" aria-label="Архитектура маленькой рекуррентной сети">
  <div class="stage-figure">
<svg id="ar-svg" class="rnn-svg" viewBox="0 0 960 548" role="img" aria-label="Развёрнутая RNN: три такта одного блока">
<style>#ar-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="ar-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4.0" orient="auto"><path d="M0,0 L8,4.0 L0,8 Z" fill="#73B222"/></marker></defs>
<text x="30" y="34" text-anchor="start" class="v-title">Один блок, три применения: параметры только в жёлтом</text>
<text x="30" y="56" text-anchor="start" class="v-small">Синий — данные, жёлтый — обучаемая операция, зелёный — вероятности, красный — ошибка.</text>
<g data-key="ar-x"><text x="24" y="482" text-anchor="start" class="v-small">вход</text><rect x="155" y="460" width="130" height="34" rx="10" class="box-blue"/><text x="220" y="482" text-anchor="middle" class="v-lblb">x₁ · &lt;BOS&gt;</text><path d="M220 460 L220 425" class="edge-green" marker-end="url(#ar-arrow)"/><rect x="405" y="460" width="130" height="34" rx="10" class="box-blue"/><text x="470" y="482" text-anchor="middle" class="v-lblb">x₂ · you</text><path d="M470 460 L470 425" class="edge-green" marker-end="url(#ar-arrow)"/><rect x="655" y="460" width="130" height="34" rx="10" class="box-blue"/><text x="720" y="482" text-anchor="middle" class="v-lblb">x₃ · will</text><path d="M720 460 L720 425" class="edge-green" marker-end="url(#ar-arrow)"/></g>
<g data-key="ar-c"><text x="24" y="350" text-anchor="start" class="v-small">ячейка</text><rect x="135" y="336" width="170" height="86" rx="10" class="box-yellow"/><text x="220" y="356" text-anchor="middle" class="v-tlbl">t = 1</text><text x="220" y="381" text-anchor="middle" class="v-wlbl">W_xh · W_hh · b_h</text><text x="220" y="406" text-anchor="middle" class="v-lbl13">h₁ = tanh(a₁)</text><rect x="385" y="336" width="170" height="86" rx="10" class="box-yellow"/><text x="470" y="356" text-anchor="middle" class="v-tlbl">t = 2</text><text x="470" y="381" text-anchor="middle" class="v-wlbl">W_xh · W_hh · b_h</text><text x="470" y="406" text-anchor="middle" class="v-lbl13">h₂ = tanh(a₂)</text><rect x="635" y="336" width="170" height="86" rx="10" class="box-yellow"/><text x="720" y="356" text-anchor="middle" class="v-tlbl">t = 3</text><text x="720" y="381" text-anchor="middle" class="v-wlbl">W_xh · W_hh · b_h</text><text x="720" y="406" text-anchor="middle" class="v-lbl13">h₃ = tanh(a₃)</text></g>
<g data-key="ar-h"><path d="M40 379 L133 379" class="edge-green" marker-end="url(#ar-arrow)"/><text x="86" y="370" text-anchor="middle" class="tensor-name">h₀ = 0</text><path d="M305 379 L383 379" class="edge-green" marker-end="url(#ar-arrow)"/><text x="344" y="370" text-anchor="middle" class="tensor-name">h₁</text><path d="M555 379 L633 379" class="edge-green" marker-end="url(#ar-arrow)"/><text x="594" y="370" text-anchor="middle" class="tensor-name">h₂</text><path d="M805 379 L900 379" class="edge-green" marker-end="url(#ar-arrow)"/><text x="852" y="370" text-anchor="middle" class="tensor-name">h₃</text></g>
<g data-key="ar-w"><rect x="140" y="367" width="160" height="20" rx="6" class="dash-y"/><rect x="140" y="262" width="160" height="48" rx="12" class="dash-y"/><rect x="390" y="367" width="160" height="20" rx="6" class="dash-y"/><rect x="390" y="262" width="160" height="48" rx="12" class="dash-y"/><rect x="640" y="367" width="160" height="20" rx="6" class="dash-y"/><rect x="640" y="262" width="160" height="48" rx="12" class="dash-y"/><text x="24" y="530" text-anchor="start" class="v-capy">одни и те же W_xh, W_hh, b_h и W_hy, b_y на всех тактах: 26 параметров при любой длине T</text></g>
<g data-key="ar-f"><text x="24" y="291" text-anchor="start" class="v-small">выход</text><rect x="145" y="266" width="150" height="40" rx="10" class="box-yellow"/><text x="220" y="291" text-anchor="middle" class="v-lbl13">z₁ = h₁W_hy + b_y</text><path d="M220 336 L220 309" class="edge-green" marker-end="url(#ar-arrow)"/><rect x="395" y="266" width="150" height="40" rx="10" class="box-yellow"/><text x="470" y="291" text-anchor="middle" class="v-lbl13">z₂ = h₂W_hy + b_y</text><path d="M470 336 L470 309" class="edge-green" marker-end="url(#ar-arrow)"/><rect x="645" y="266" width="150" height="40" rx="10" class="box-yellow"/><text x="720" y="291" text-anchor="middle" class="v-lbl13">z₃ = h₃W_hy + b_y</text><path d="M720 336 L720 309" class="edge-green" marker-end="url(#ar-arrow)"/></g>
<g data-key="ar-s"><text x="24" y="226" text-anchor="start" class="v-small">softmax</text><rect x="155" y="204" width="130" height="34" rx="10" class="box-green"/><text x="220" y="226" text-anchor="middle" class="v-lbl13">ŷ₁ = softmax(z₁)</text><path d="M220 266 L220 241" class="edge-green" marker-end="url(#ar-arrow)"/><rect x="405" y="204" width="130" height="34" rx="10" class="box-green"/><text x="470" y="226" text-anchor="middle" class="v-lbl13">ŷ₂ = softmax(z₂)</text><path d="M470 266 L470 241" class="edge-green" marker-end="url(#ar-arrow)"/><rect x="655" y="204" width="130" height="34" rx="10" class="box-green"/><text x="720" y="226" text-anchor="middle" class="v-lbl13">ŷ₃ = softmax(z₃)</text><path d="M720 266 L720 241" class="edge-green" marker-end="url(#ar-arrow)"/></g>
<g data-key="ar-l"><text x="24" y="164" text-anchor="start" class="v-small">ошибка</text><rect x="155" y="142" width="130" height="34" rx="10" class="box-red"/><text x="220" y="164" text-anchor="middle" class="v-lblr">ℒ₁ · цель you</text><path d="M220 204 L220 179" class="edge-green" marker-end="url(#ar-arrow)"/><rect x="405" y="142" width="130" height="34" rx="10" class="box-red"/><text x="470" y="164" text-anchor="middle" class="v-lblr">ℒ₂ · цель will</text><path d="M470 204 L470 179" class="edge-green" marker-end="url(#ar-arrow)"/><rect x="655" y="142" width="130" height="34" rx="10" class="box-red"/><text x="720" y="164" text-anchor="middle" class="v-lblr">ℒ₃ · цель pass</text><path d="M720 204 L720 179" class="edge-green" marker-end="url(#ar-arrow)"/></g>
<g data-key="ar-L"><text x="24" y="101" text-anchor="start" class="v-small">итог</text><rect x="370" y="78" width="200" height="36" rx="10" class="box-red"/><text x="470" y="101" text-anchor="middle" class="v-lblr">ℒ = ⅓(ℒ₁ + ℒ₂ + ℒ₃)</text><path d="M220 142 L410 116" class="thin"/><path d="M470 142 L470 116" class="thin"/><path d="M720 142 L530 116" class="thin"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ar-x" data-focus="ar-x"><div class="step-kicker">Шаг 1 · вход</div><h4>Три токена — три one-hot строки</h4><p>Вход — фраза &lt;BOS&gt; you will. Каждый токен становится строкой <span class="math-inline" data-tex="x_t"></span> длины 4 с единицей на месте своего номера в словаре. Это единственные данные; всё остальное сеть вычислит из них и своих весов.</p></div>
    <div class="step-panel" data-on="ar-x ar-c" data-focus="ar-c"><div class="step-kicker">Шаг 2 · ячейка</div><h4>Сумматор и tanh</h4><p>Ячейка складывает вклад токена <span class="math-inline" data-tex="x_tW_{xh}"></span>, вклад памяти <span class="math-inline" data-tex="h_{t-1}W_{hh}"></span> и сдвиг <span class="math-inline" data-tex="b_h"></span>, затем сжимает сумму tanh. Выход <span class="math-inline" data-tex="h_t"></span> — всего два числа. В блоке 14 параметров: <span class="math-inline" data-tex="W_{xh}"></span> 4×2, <span class="math-inline" data-tex="W_{hh}"></span> 2×2 и <span class="math-inline" data-tex="b_h"></span>.</p></div>
    <div class="step-panel" data-on="ar-x ar-c ar-h ar-w" data-focus="ar-h ar-w"><div class="step-kicker">Шаг 3 · развёртка</div><h4>Один блок, три применения</h4><p>Горизонтальные стрелки передают состояние дальше: <span class="math-inline" data-tex="h_t"></span> нельзя посчитать, пока не посчитано <span class="math-inline" data-tex="h_{t-1}"></span>. Три жёлтых прямоугольника — не три слоя, а один и тот же блок, нарисованный трижды; пунктир отмечает общие веса.</p></div>
    <div class="step-panel" data-on="ar-c ar-h ar-w ar-f" data-focus="ar-f"><div class="step-kicker">Шаг 4 · выходной слой</div><h4>Два числа памяти → четыре логита</h4><p>На каждом такте <span class="math-inline" data-tex="z_t=h_tW_{hy}+b_y"></span>. Выходной слой не знает ни про время, ни про историю: он видит только <span class="math-inline" data-tex="h_t"></span>. Здесь ещё 12 параметров, и они тоже общие для всех тактов.</p></div>
    <div class="step-panel" data-on="ar-f ar-s" data-focus="ar-s"><div class="step-kicker">Шаг 5 · softmax</div><h4>Логиты → распределение по словарю</h4><p>Экспонента и нормировка превращают четыре логита в вероятности <span class="math-inline" data-tex="\hat y_t"></span>. Правильные токены — you, will, pass: номера 1, 2, 3 при нумерации с нуля.</p></div>
    <div class="step-panel" data-on="ar-s ar-l" data-focus="ar-l"><div class="step-kicker">Шаг 6 · ошибка такта</div><h4>Своя cross-entropy на каждом такте</h4><p>Ошибка <span class="math-inline" data-tex="\mathcal L_t"></span> смотрит только на одно число из <span class="math-inline" data-tex="\hat y_t"></span> — вероятность, назначенную правильному токену.</p></div>
    <div class="step-panel" data-on="ar-x ar-c ar-h ar-w ar-f ar-s ar-l ar-L" data-focus="ar-L"><div class="step-kicker">Шаг 7 · общая ошибка</div><h4>Вся развёртка — одно число</h4><p>Три ошибки усредняются в скаляр <span class="math-inline" data-tex="\mathcal L"></span>. Именно по нему берутся производные всех 26 параметров — и каждый параметр входит в <span class="math-inline" data-tex="\mathcal L"></span> трижды, по разу на такт.</p></div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки для навигации.</p>

<div class="callout">
  <strong>Двадцать шесть параметров, три применения.</strong> Ячейка хранит 14 весов,
  выходной слой — 12; tanh, softmax и cross-entropy не обучаются. Развернуть фразу
  длиной 3 или 300 — параметров останется столько же. Дальше мы проведём фразу через
  всю цепочку и вернём градиент обратно по времени.
</div>


### Forward в формулах

<p>
  Сначала общий вид каждой операции — без чисел. Ячейка — линейная операция над
  двумя входами плюс tanh; выходной слой — матричное умножение; softmax и
  cross-entropy закрывают цепочку каждого такта; усреднение сводит такты в одно
  число. Все векторы здесь — строки, поэтому матрицы весов стоят справа.
</p>

<div class="stage" id="stageFF" tabindex="0" aria-label="Forward рекуррентной сети в формулах">
  <div class="stage-figure">
<svg id="ff-svg" class="rnn-svg" viewBox="0 0 960 548" role="img" aria-label="Развёрнутая RNN: три такта одного блока">
<style>#ff-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="ff-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4.0" orient="auto"><path d="M0,0 L8,4.0 L0,8 Z" fill="#73B222"/></marker></defs>
<text x="30" y="34" text-anchor="start" class="v-title">Forward: формула каждого узла развёртки</text>
<g data-key="ff-x"><text x="24" y="482" text-anchor="start" class="v-small">вход</text><rect x="155" y="460" width="130" height="34" rx="10" class="box-blue"/><text x="220" y="482" text-anchor="middle" class="v-lblb">x₁ · &lt;BOS&gt;</text><path d="M220 460 L220 425" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="405" y="460" width="130" height="34" rx="10" class="box-blue"/><text x="470" y="482" text-anchor="middle" class="v-lblb">x₂ · you</text><path d="M470 460 L470 425" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="655" y="460" width="130" height="34" rx="10" class="box-blue"/><text x="720" y="482" text-anchor="middle" class="v-lblb">x₃ · will</text><path d="M720 460 L720 425" class="edge-green" marker-end="url(#ff-arrow)"/></g>
<g data-key="ff-c"><text x="24" y="350" text-anchor="start" class="v-small">ячейка</text><rect x="135" y="336" width="170" height="86" rx="10" class="box-yellow"/><text x="220" y="356" text-anchor="middle" class="v-tlbl">t = 1</text><text x="220" y="381" text-anchor="middle" class="v-wlbl">W_xh · W_hh · b_h</text><text x="220" y="406" text-anchor="middle" class="v-lbl13">h₁ = tanh(a₁)</text><rect x="385" y="336" width="170" height="86" rx="10" class="box-yellow"/><text x="470" y="356" text-anchor="middle" class="v-tlbl">t = 2</text><text x="470" y="381" text-anchor="middle" class="v-wlbl">W_xh · W_hh · b_h</text><text x="470" y="406" text-anchor="middle" class="v-lbl13">h₂ = tanh(a₂)</text><rect x="635" y="336" width="170" height="86" rx="10" class="box-yellow"/><text x="720" y="356" text-anchor="middle" class="v-tlbl">t = 3</text><text x="720" y="381" text-anchor="middle" class="v-wlbl">W_xh · W_hh · b_h</text><text x="720" y="406" text-anchor="middle" class="v-lbl13">h₃ = tanh(a₃)</text></g>
<g data-key="ff-h"><path d="M40 379 L133 379" class="edge-green" marker-end="url(#ff-arrow)"/><text x="86" y="370" text-anchor="middle" class="tensor-name">h₀ = 0</text><path d="M305 379 L383 379" class="edge-green" marker-end="url(#ff-arrow)"/><text x="344" y="370" text-anchor="middle" class="tensor-name">h₁</text><path d="M555 379 L633 379" class="edge-green" marker-end="url(#ff-arrow)"/><text x="594" y="370" text-anchor="middle" class="tensor-name">h₂</text><path d="M805 379 L900 379" class="edge-green" marker-end="url(#ff-arrow)"/><text x="852" y="370" text-anchor="middle" class="tensor-name">h₃</text></g>
<g data-key="ff-w"><rect x="140" y="367" width="160" height="20" rx="6" class="dash-y"/><rect x="140" y="262" width="160" height="48" rx="12" class="dash-y"/><rect x="390" y="367" width="160" height="20" rx="6" class="dash-y"/><rect x="390" y="262" width="160" height="48" rx="12" class="dash-y"/><rect x="640" y="367" width="160" height="20" rx="6" class="dash-y"/><rect x="640" y="262" width="160" height="48" rx="12" class="dash-y"/><text x="24" y="530" text-anchor="start" class="v-capy">пунктир — общие параметры: одна и та же матрица на каждом такте</text></g>
<g data-key="ff-f"><text x="24" y="291" text-anchor="start" class="v-small">выход</text><rect x="145" y="266" width="150" height="40" rx="10" class="box-yellow"/><text x="220" y="291" text-anchor="middle" class="v-lbl13">z₁ = h₁W_hy + b_y</text><path d="M220 336 L220 309" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="395" y="266" width="150" height="40" rx="10" class="box-yellow"/><text x="470" y="291" text-anchor="middle" class="v-lbl13">z₂ = h₂W_hy + b_y</text><path d="M470 336 L470 309" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="645" y="266" width="150" height="40" rx="10" class="box-yellow"/><text x="720" y="291" text-anchor="middle" class="v-lbl13">z₃ = h₃W_hy + b_y</text><path d="M720 336 L720 309" class="edge-green" marker-end="url(#ff-arrow)"/></g>
<g data-key="ff-s"><text x="24" y="226" text-anchor="start" class="v-small">softmax</text><rect x="155" y="204" width="130" height="34" rx="10" class="box-green"/><text x="220" y="226" text-anchor="middle" class="v-lbl13">ŷ₁ = softmax(z₁)</text><path d="M220 266 L220 241" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="405" y="204" width="130" height="34" rx="10" class="box-green"/><text x="470" y="226" text-anchor="middle" class="v-lbl13">ŷ₂ = softmax(z₂)</text><path d="M470 266 L470 241" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="655" y="204" width="130" height="34" rx="10" class="box-green"/><text x="720" y="226" text-anchor="middle" class="v-lbl13">ŷ₃ = softmax(z₃)</text><path d="M720 266 L720 241" class="edge-green" marker-end="url(#ff-arrow)"/></g>
<g data-key="ff-l"><text x="24" y="164" text-anchor="start" class="v-small">ошибка</text><rect x="155" y="142" width="130" height="34" rx="10" class="box-red"/><text x="220" y="164" text-anchor="middle" class="v-lblr">ℒ₁ · цель you</text><path d="M220 204 L220 179" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="405" y="142" width="130" height="34" rx="10" class="box-red"/><text x="470" y="164" text-anchor="middle" class="v-lblr">ℒ₂ · цель will</text><path d="M470 204 L470 179" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="655" y="142" width="130" height="34" rx="10" class="box-red"/><text x="720" y="164" text-anchor="middle" class="v-lblr">ℒ₃ · цель pass</text><path d="M720 204 L720 179" class="edge-green" marker-end="url(#ff-arrow)"/></g>
<g data-key="ff-L"><text x="24" y="101" text-anchor="start" class="v-small">итог</text><rect x="370" y="78" width="200" height="36" rx="10" class="box-red"/><text x="470" y="101" text-anchor="middle" class="v-lblr">ℒ = ⅓(ℒ₁ + ℒ₂ + ℒ₃)</text><path d="M220 142 L410 116" class="thin"/><path d="M470 142 L470 116" class="thin"/><path d="M720 142 L530 116" class="thin"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ff-x" data-focus="ff-x"><div class="step-kicker">Шаг 1 · вход и параметры</div><h4>Что фиксировано на один forward</h4><div class="math-display" data-fwdf-tex="fx"></div><p>Три one-hot строки <span class="math-inline" data-tex="x_t"></span> и пять тензоров параметров. Параметры не меняются ни внутри такта, ни между тактами.</p></div>
    <div class="step-panel" data-on="ff-x ff-c ff-w" data-focus="ff-c"><div class="step-kicker">Шаг 2 · предактивация</div><h4>Вклад токена плюс вклад памяти</h4><div class="math-display" data-fwdf-tex="fa"></div><p>Умножение one-hot строки на <span class="math-inline" data-tex="W_{xh}"></span> просто выбирает строку матрицы с номером токена. На первом такте вклад памяти равен нулю.</p></div>
    <div class="step-panel" data-on="ff-c ff-h" data-focus="ff-h"><div class="step-kicker">Шаг 3 · состояние</div><h4>tanh и передача по горизонтали</h4><div class="math-display" data-fwdf-tex="fh"></div><p>Состояние <span class="math-inline" data-tex="h_t"></span> уходит в два места: вверх, к выходному слою, и вправо, в предактивацию следующего такта. Производная tanh выражается через сам выход — это понадобится в backward.</p></div>
    <div class="step-panel" data-on="ff-h ff-f" data-focus="ff-f"><div class="step-kicker">Шаг 4 · выходной слой</div><h4>Состояние → логиты</h4><div class="math-display" data-fwdf-tex="fz"></div><p>Одна и та же пара <span class="math-inline" data-tex="W_{hy},\,b_y"></span> на каждом такте; строка <span class="math-inline" data-tex="h_t"></span> из двух чисел становится строкой из четырёх логитов.</p></div>
    <div class="step-panel" data-on="ff-f ff-s" data-focus="ff-s"><div class="step-kicker">Шаг 5 · softmax</div><h4>Логиты → вероятности</h4><div class="math-display" data-fwdf-tex="fs"></div><p>Вычитаем максимум для устойчивости и нормируем экспоненты — по строке каждого такта отдельно.</p></div>
    <div class="step-panel" data-on="ff-s ff-l" data-focus="ff-l"><div class="step-kicker">Шаг 6 · ошибка такта</div><h4>Минус логарифм правильной вероятности</h4><div class="math-display" data-fwdf-tex="fl"></div><p>Цели — те же токены, сдвинутые на одну позицию. Ошибка такта тем меньше, чем ближе вероятность цели к единице.</p></div>
    <div class="step-panel" data-on="ff-x ff-c ff-h ff-w ff-f ff-s ff-l ff-L" data-focus="ff-L"><div class="step-kicker">Шаг 7 · loss</div><h4>Среднее по тактам</h4><div class="math-display" data-fwdf-tex="fL"></div><p>Усреднение делает величину градиента независимой от длины фразы: последовательность из 3 и из 300 токенов даёт ошибки одного масштаба.</p></div>
  </div>
</div>
<p class="stage-hint">Формулы даны в общем виде; ниже те же шаги проходят на конкретных числах.</p>

<div class="callout">
  <strong>Пять формул — весь прямой проход.</strong> Ячейка и выходной слой —
  линейные операции с параметрами; tanh, softmax и cross-entropy — фиксированные
  нелинейности. Backward будет этой же развёрткой, пройденной сверху вниз и справа
  налево.
</div>

### Тот же forward по элементам матриц

<p>Тот же полный прогон, но по элементам: <span class="math-inline" data-tex="x_{t,j}"></span> вместо чисел. Все такты собраны в матрицы, где строка t — одно применение блока. Сверху виден текущий шаг; при «Далее» добавляется следующая матрица.</p>

<div class="stage" id="stageSF" tabindex="0" aria-label="Тот же forward по элементам матриц">
  <div class="stage-figure">
<svg id="sf-svg" class="rnn-svg" viewBox="0 0 960 510" role="img" aria-label="Forward по элементам: вся развёртка">
<style>#sf-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="sf-ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#73B222"/></marker><marker id="sf-ary" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C29E08"/></marker></defs><rect x="24.0" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="85.7" y="36" text-anchor="middle" font-size="12" fill="#5E5850">вход X</text><rect x="155.4" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="217.1" y="36" text-anchor="middle" font-size="12" fill="#5E5850">предактивация A</text><rect x="286.9" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="348.6" y="36" text-anchor="middle" font-size="12" fill="#5E5850">состояние H</text><rect x="418.3" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="480.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">логиты Z</text><rect x="549.7" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="611.4" y="36" text-anchor="middle" font-size="12" fill="#5E5850">softmax Ŷ</text><rect x="681.1" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="742.9" y="36" text-anchor="middle" font-size="12" fill="#5E5850">ошибки ℒₜ</text><rect x="812.6" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="874.3" y="36" text-anchor="middle" font-size="12" fill="#5E5850">loss ℒ</text><text x="480" y="62" text-anchor="middle" font-size="12" fill="#5E5850">вся развёртка по элементам: X → A → H → Z → Ŷ → ℒₜ → ℒ; строка = такт</text>
<g data-key="sf-m0" data-only="1"><rect x="40" y="100" width="160" height="114" fill="#3576C0" fill-opacity="0.1"/><line x1="80" y1="100" x2="80" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="120" y1="100" x2="120" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="160" y1="100" x2="160" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="40" y1="138" x2="200" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="40" y1="176" x2="200" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 39 95 L 33 95 L 33 219 L 39 219" fill="none" stroke="#3576C0" stroke-width="1.8"/><path d="M 201 95 L 207 95 L 207 219 L 201 219" fill="none" stroke="#3576C0" stroke-width="1.8"/><text x="60.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,1</tspan></text><text x="100.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,2</tspan></text><text x="140.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,3</tspan></text><text x="180.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,4</tspan></text><text x="60.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,1</tspan></text><text x="100.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,2</tspan></text><text x="140.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,3</tspan></text><text x="180.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,4</tspan></text><text x="60.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,1</tspan></text><text x="100.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,2</tspan></text><text x="140.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,3</tspan></text><text x="180.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,4</tspan></text><text x="120.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="120.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">X · 3×4</text><text x="28" y="123" text-anchor="end" font-size="12" fill="#5E5850">t=1</text><text x="28" y="161" text-anchor="end" font-size="12" fill="#5E5850">t=2</text><text x="28" y="199" text-anchor="end" font-size="12" fill="#5E5850">t=3</text></g>
<g data-key="sf-a1" data-only="1"><path d="M208 157 L254 157" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m1" data-only="1"><rect x="262" y="100" width="112" height="114" fill="#73B222" fill-opacity="0.1"/><line x1="318" y1="100" x2="318" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="262" y1="138" x2="374" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="262" y1="176" x2="374" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 261 95 L 255 95 L 255 219 L 261 219" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 375 95 L 381 95 L 381 219 L 375 219" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="290.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">1,1</tspan></text><text x="346.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">1,2</tspan></text><text x="290.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">2,1</tspan></text><text x="346.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">2,2</tspan></text><text x="290.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">3,1</tspan></text><text x="346.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">3,2</tspan></text><text x="318.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="318.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">A · 3×2</text></g>
<g data-key="sf-a2" data-only="1"><path d="M382 157 L428 157" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m2" data-only="1"><rect x="436" y="100" width="112" height="114" fill="#73B222" fill-opacity="0.1"/><line x1="492" y1="100" x2="492" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="436" y1="138" x2="548" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="436" y1="176" x2="548" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 435 95 L 429 95 L 429 219 L 435 219" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 549 95 L 555 95 L 555 219 L 549 219" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="464.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">h<tspan font-size="10" dy="4">1,1</tspan></text><text x="520.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">h<tspan font-size="10" dy="4">1,2</tspan></text><text x="464.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">h<tspan font-size="10" dy="4">2,1</tspan></text><text x="520.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">h<tspan font-size="10" dy="4">2,2</tspan></text><text x="464.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">h<tspan font-size="10" dy="4">3,1</tspan></text><text x="520.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">h<tspan font-size="10" dy="4">3,2</tspan></text><text x="492.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="492.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">H = tanh(A)</text></g>
<g data-key="sf-fb" data-only="1"><path d="M492 246 L492 264 L318 264 L318 249" stroke="#C29E08" stroke-width="2" fill="none" stroke-dasharray="6 4" marker-end="url(#sf-ary)"/><text x="405" y="284" text-anchor="middle" font-size="12" fill="#8C7106">строка t−1 из H → строка t в A (·W_hh)</text></g>
<g data-key="sf-a3" data-only="1"><path d="M556 157 L602 157" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m3" data-only="1"><rect x="610" y="100" width="200" height="114" fill="#73B222" fill-opacity="0.1"/><line x1="660" y1="100" x2="660" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="710" y1="100" x2="710" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="760" y1="100" x2="760" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="610" y1="138" x2="810" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="610" y1="176" x2="810" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 609 95 L 603 95 L 603 219 L 609 219" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 811 95 L 817 95 L 817 219 L 811 219" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="635.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">1,1</tspan></text><text x="685.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">1,2</tspan></text><text x="735.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">1,3</tspan></text><text x="785.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">1,4</tspan></text><text x="635.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">2,1</tspan></text><text x="685.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">2,2</tspan></text><text x="735.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">2,3</tspan></text><text x="785.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">2,4</tspan></text><text x="635.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">3,1</tspan></text><text x="685.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">3,2</tspan></text><text x="735.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">3,3</tspan></text><text x="785.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">3,4</tspan></text><text x="710.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="710.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">Z = HW_hy + b_y</text></g>
<g data-key="sf-c1" data-only="1"><path d="M818 157 L912 157 L912 304 L20 304 L20 407 L50 407" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m4" data-only="1"><rect x="60" y="350" width="200" height="114" fill="#73B222" fill-opacity="0.1"/><line x1="110" y1="350" x2="110" y2="464" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="160" y1="350" x2="160" y2="464" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="210" y1="350" x2="210" y2="464" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="60" y1="388" x2="260" y2="388" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="60" y1="426" x2="260" y2="426" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 59 345 L 53 345 L 53 469 L 59 469" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 261 345 L 267 345 L 267 469 L 261 469" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="85.0" y="373.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">1,1</tspan></text><text x="135.0" y="373.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">1,2</tspan></text><text x="185.0" y="373.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">1,3</tspan></text><text x="235.0" y="373.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">1,4</tspan></text><text x="85.0" y="411.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">2,1</tspan></text><text x="135.0" y="411.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">2,2</tspan></text><text x="185.0" y="411.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">2,3</tspan></text><text x="235.0" y="411.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">2,4</tspan></text><text x="85.0" y="449.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">3,1</tspan></text><text x="135.0" y="449.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">3,2</tspan></text><text x="185.0" y="449.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">3,3</tspan></text><text x="235.0" y="449.6" text-anchor="middle" font-size="13" fill="#111">ŷ<tspan font-size="10" dy="4">3,4</tspan></text><text x="160.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="160.0" y="486" text-anchor="middle" font-size="14" font-weight="700" fill="#111">Ŷ = softmax(Z)</text></g>
<g data-key="sf-a5" data-only="1"><path d="M268 407 L316 407" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m5" data-only="1"><rect x="324" y="350" width="64" height="114" fill="#C30B0A" fill-opacity="0.12"/><line x1="324" y1="388" x2="388" y2="388" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="324" y1="426" x2="388" y2="426" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 323 345 L 317 345 L 317 469 L 323 469" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 389 345 L 395 345 L 395 469 L 389 469" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="356.0" y="373.6" text-anchor="middle" font-size="14" fill="#111">ℒ<tspan font-size="10" dy="4">1</tspan></text><text x="356.0" y="411.6" text-anchor="middle" font-size="14" fill="#111">ℒ<tspan font-size="10" dy="4">2</tspan></text><text x="356.0" y="449.6" text-anchor="middle" font-size="14" fill="#111">ℒ<tspan font-size="10" dy="4">3</tspan></text><text x="356.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 1</text><text x="356.0" y="486" text-anchor="middle" font-size="14" font-weight="700" fill="#111">ℒₜ</text></g>
<g data-key="sf-a6" data-only="1"><path d="M396 407 L444 407" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m6" data-only="1"><rect x="452" y="385" width="80" height="44" fill="#C30B0A" fill-opacity="0.12"/><path d="M 451 380 L 445 380 L 445 434 L 451 434" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 533 380 L 539 380 L 539 434 L 533 434" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="492.0" y="411.6" text-anchor="middle" font-size="17" fill="#111">ℒ</text><text x="492.0" y="371" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">среднее</text><text x="492.0" y="451" text-anchor="middle" font-size="14" font-weight="700" fill="#111">ℒ</text></g>
<g data-key="sf-tab0" data-only="1"><rect x="22.0" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab1" data-only="1"><rect x="153.4" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab2" data-only="1"><rect x="284.9" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab3" data-only="1"><rect x="416.3" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab4" data-only="1"><rect x="547.7" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab5" data-only="1"><rect x="679.1" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab6" data-only="1"><rect x="810.6" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-f0" data-only="1"><rect x="34" y="94" width="172" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f1" data-only="1"><rect x="256" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f2" data-only="1"><rect x="430" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f3" data-only="1"><rect x="604" y="94" width="212" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f4" data-only="1"><rect x="54" y="344" width="212" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f5" data-only="1"><rect x="318" y="344" width="76" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f6" data-only="1"><rect x="446" y="379" width="92" height="56" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="sf-m0 sf-tab0 sf-f0" data-focus="sf-f0"><div class="step-kicker">Шаг 1 · вход</div><h4>Матрица X (символьно)</h4><p>Три one-hot строки, собранные в <span class="math-inline" data-tex="X"></span> размера 3×4. Строка t — вход такта t; единица стоит в столбце своего токена.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-tab1 sf-f1" data-focus="sf-f1"><div class="step-kicker">Шаг 2 · предактивация</div><h4>X → A</h4><p><span class="math-inline" data-tex="a_{t,i}=\sum_j x_{t,j}W^{xh}_{j,i}+\sum_k h_{t-1,k}W^{hh}_{k,i}+b_{h,i}"></span>. Строка t матрицы A зависит от строки t матрицы X и строки t−1 матрицы H.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-fb sf-tab2 sf-f2" data-focus="sf-f2"><div class="step-kicker">Шаг 3 · состояние</div><h4>A → H</h4><p>Поэлементно <span class="math-inline" data-tex="h_{t,i}=\tanh(a_{t,i})"></span>, форма не меняется. Пунктир — рекуррентность: строка t−1 матрицы H возвращается в строку t матрицы A, поэтому строки считаются строго сверху вниз.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-fb sf-a3 sf-m3 sf-tab3 sf-f3" data-focus="sf-f3"><div class="step-kicker">Шаг 4 · выходной слой</div><h4>H → Z</h4><p><span class="math-inline" data-tex="z_{t,k}=\sum_i h_{t,i}W^{hy}_{i,k}+b_{y,k}"></span> — строка H на столбец <span class="math-inline" data-tex="W_{hy}"></span>. Здесь строки уже независимы друг от друга.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-fb sf-a3 sf-m3 sf-c1 sf-m4 sf-tab4 sf-f4" data-focus="sf-f4"><div class="step-kicker">Шаг 5 · softmax</div><h4>Z → Ŷ</h4><p><span class="math-inline" data-tex="\hat y_{t,k}=\dfrac{e^{z_{t,k}}}{\sum_j e^{z_{t,j}}}"></span> — по строкам: каждая строка <span class="math-inline" data-tex="\hat Y"></span> — распределение по словарю.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-fb sf-a3 sf-m3 sf-c1 sf-m4 sf-a5 sf-m5 sf-tab5 sf-f5" data-focus="sf-f5"><div class="step-kicker">Шаг 6 · ошибки тактов</div><h4>Ŷ → ℒₜ</h4><p><span class="math-inline" data-tex="\mathcal L_t=-\log \hat y_{t,c_t}"></span> — из каждой строки берём одно число, вероятность цели.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-fb sf-a3 sf-m3 sf-c1 sf-m4 sf-a5 sf-m5 sf-a6 sf-m6 sf-tab6 sf-f6" data-focus="sf-f6"><div class="step-kicker">Шаг 7 · loss</div><h4>ℒₜ → ℒ</h4><p><span class="math-inline" data-tex="\mathcal L=\tfrac13(\mathcal L_1+\mathcal L_2+\mathcal L_3)"></span>. Вся развёртка — одно число.</p></div>
  </div>
</div>
<p class="stage-hint">Полный forward развёртки: X → A → H → Z → Ŷ → ℒₜ → ℒ; строка матрицы — один такт.</p>


### Forward на числах

<p>
  Теперь те же операции на нашей фразе. Параметры маленькие и заданы вручную, модель
  пока не обучена. Главное видно в матрице <span class="math-inline" data-tex="A"></span>: на первом такте памяти нет, и
  <span class="math-inline" data-tex="a_1"></span> — просто первая строка <span class="math-inline" data-tex="W_{xh}"></span> плюс сдвиг, а начиная со второго
  такта к выбранной строке добавляется <span class="math-inline" data-tex="h_{t-1}W_{hh}"></span>. В матрице <span class="math-inline" data-tex="\hat Y"></span>
  зелёным подсвечены вероятности правильных токенов — только они попадут в loss.
</p>

<div class="stage numeric-stage" id="stageFN" tabindex="0" aria-label="Числа прямого прохода">
  <div class="stage-figure">
<svg id="fn-svg" class="rnn-svg" viewBox="0 0 960 510" role="img" aria-label="Числа прямого прохода по тактам">
<style>#fn-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="fn-ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#73B222"/></marker><marker id="fn-ary" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C29E08"/></marker></defs><rect x="24.0" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="85.7" y="36" text-anchor="middle" font-size="12" fill="#5E5850">вход X</text><rect x="155.4" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="217.1" y="36" text-anchor="middle" font-size="12" fill="#5E5850">предактивация A</text><rect x="286.9" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="348.6" y="36" text-anchor="middle" font-size="12" fill="#5E5850">состояние H</text><rect x="418.3" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="480.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">логиты Z</text><rect x="549.7" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="611.4" y="36" text-anchor="middle" font-size="12" fill="#5E5850">softmax Ŷ</text><rect x="681.1" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="742.9" y="36" text-anchor="middle" font-size="12" fill="#5E5850">ошибки ℒₜ</text><rect x="812.6" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="874.3" y="36" text-anchor="middle" font-size="12" fill="#5E5850">loss ℒ</text><text x="480" y="62" text-anchor="middle" font-size="12" fill="#5E5850">каждый шаг добавляет матрицу; строка матрицы — один такт, пунктир — память</text>
<g data-key="fn-m0" data-only="1"><rect x="40" y="100" width="40" height="38" fill="#CFE0F3" stroke="#C9C2B8" stroke-width="1"/><rect x="80" y="100" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="120" y="100" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="100" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="40" y="138" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="80" y="138" width="40" height="38" fill="#CFE0F3" stroke="#C9C2B8" stroke-width="1"/><rect x="120" y="138" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="138" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="40" y="176" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="80" y="176" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="120" y="176" width="40" height="38" fill="#CFE0F3" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="176" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><path d="M 39 95 L 33 95 L 33 219 L 39 219" fill="none" stroke="#3576C0" stroke-width="1.8"/><path d="M 201 95 L 207 95 L 207 219 L 201 219" fill="none" stroke="#3576C0" stroke-width="1.8"/><text x="60.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">1</text><text x="100.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="140.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="180.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="60.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="100.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">1</text><text x="140.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="180.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="60.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="100.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="140.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">1</text><text x="180.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="120.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="120.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">X · 3×4</text><text x="28" y="123" text-anchor="end" font-size="12" fill="#5E5850">t=1</text><text x="28" y="161" text-anchor="end" font-size="12" fill="#5E5850">t=2</text><text x="28" y="199" text-anchor="end" font-size="12" fill="#5E5850">t=3</text></g>
<g data-key="fn-a1" data-only="1"><path d="M208 157 L254 157" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m1" data-only="1"><rect x="262" y="100" width="56" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="318" y="100" width="56" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="262" y="138" width="56" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="318" y="138" width="56" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="262" y="176" width="56" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="318" y="176" width="56" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><path d="M 261 95 L 255 95 L 255 219 L 261 219" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 375 95 L 381 95 L 381 219 L 375 219" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="290.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.600</text><text x="346.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">−0.500</text><text x="290.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.469</text><text x="346.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.462</text><text x="290.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.282</text><text x="346.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0.328</text><text x="318.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="318.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">A · 3×2</text></g>
<g data-key="fn-a2" data-only="1"><path d="M382 157 L428 157" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m2" data-only="1"><rect x="436" y="100" width="56" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="492" y="100" width="56" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="436" y="138" width="56" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="492" y="138" width="56" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="436" y="176" width="56" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="492" y="176" width="56" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><path d="M 435 95 L 429 95 L 429 219 L 435 219" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 549 95 L 555 95 L 555 219 L 549 219" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="464.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.537</text><text x="520.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">−0.462</text><text x="464.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.437</text><text x="520.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.431</text><text x="464.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.275</text><text x="520.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0.317</text><text x="492.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="492.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">H = tanh(A)</text></g>
<g data-key="fn-fb" data-only="1"><path d="M492 246 L492 264 L318 264 L318 249" stroke="#C29E08" stroke-width="2" fill="none" stroke-dasharray="6 4" marker-end="url(#fn-ary)"/><text x="405" y="284" text-anchor="middle" font-size="12" fill="#8C7106">строка t−1 из H → строка t в A (·W_hh)</text></g>
<g data-key="fn-a3" data-only="1"><path d="M556 157 L602 157" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m3" data-only="1"><rect x="610" y="100" width="50" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="660" y="100" width="50" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="710" y="100" width="50" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="760" y="100" width="50" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="610" y="138" width="50" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="660" y="138" width="50" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="710" y="138" width="50" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="760" y="138" width="50" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="610" y="176" width="50" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="660" y="176" width="50" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="710" y="176" width="50" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="760" y="176" width="50" height="38" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><path d="M 609 95 L 603 95 L 603 219 L 609 219" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 811 95 L 817 95 L 817 219 L 811 219" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="635.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.485</text><text x="685.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">−0.446</text><text x="735.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.183</text><text x="785.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">−0.077</text><text x="635.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">−0.171</text><text x="685.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.140</text><text x="735.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.193</text><text x="785.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.260</text><text x="635.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.304</text><text x="685.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0.428</text><text x="735.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.388</text><text x="785.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0.072</text><text x="710.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="710.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">Z = HW_hy + b_y</text></g>
<g data-key="fn-c1" data-only="1"><path d="M818 157 L912 157 L912 304 L20 304 L20 407 L50 407" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m4" data-only="1"><rect x="60" y="350" width="50" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="110" y="350" width="50" height="38" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="350" width="50" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="210" y="350" width="50" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="60" y="388" width="50" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="110" y="388" width="50" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="388" width="50" height="38" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><rect x="210" y="388" width="50" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="60" y="426" width="50" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="110" y="426" width="50" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="426" width="50" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="210" y="426" width="50" height="38" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><path d="M 59 345 L 53 345 L 53 469 L 59 469" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 261 345 L 267 345 L 267 469 L 261 469" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="85.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0.370</text><text x="135.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0.146</text><text x="185.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0.274</text><text x="235.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0.211</text><text x="85.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">0.187</text><text x="135.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">0.256</text><text x="185.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">0.269</text><text x="235.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">0.288</text><text x="85.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">0.183</text><text x="135.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">0.381</text><text x="185.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">0.169</text><text x="235.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">0.267</text><text x="160.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="160.0" y="486" text-anchor="middle" font-size="14" font-weight="700" fill="#111">Ŷ = softmax(Z)</text></g>
<g data-key="fn-a5" data-only="1"><path d="M268 407 L316 407" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m5" data-only="1"><rect x="324" y="350" width="64" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="324" y="388" width="64" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="324" y="426" width="64" height="38" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><path d="M 323 345 L 317 345 L 317 469 L 323 469" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 389 345 L 395 345 L 395 469 L 389 469" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="356.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">1.9253</text><text x="356.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">1.3120</text><text x="356.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">1.3204</text><text x="356.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 1</text><text x="356.0" y="486" text-anchor="middle" font-size="14" font-weight="700" fill="#111">ℒₜ</text></g>
<g data-key="fn-a6" data-only="1"><path d="M396 407 L444 407" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m6" data-only="1"><rect x="452" y="385" width="80" height="44" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><path d="M 451 380 L 445 380 L 445 434 L 451 434" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 533 380 L 539 380 L 539 434 L 533 434" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="492.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">1.5192</text><text x="492.0" y="371" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">среднее</text><text x="492.0" y="451" text-anchor="middle" font-size="14" font-weight="700" fill="#111">ℒ</text></g>
<g data-key="fn-tab0" data-only="1"><rect x="22.0" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab1" data-only="1"><rect x="153.4" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab2" data-only="1"><rect x="284.9" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab3" data-only="1"><rect x="416.3" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab4" data-only="1"><rect x="547.7" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab5" data-only="1"><rect x="679.1" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab6" data-only="1"><rect x="810.6" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-f0" data-only="1"><rect x="34" y="94" width="172" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f1" data-only="1"><rect x="256" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f2" data-only="1"><rect x="430" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f3" data-only="1"><rect x="604" y="94" width="212" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f4" data-only="1"><rect x="54" y="344" width="212" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f5" data-only="1"><rect x="318" y="344" width="76" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f6" data-only="1"><rect x="446" y="379" width="92" height="56" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="fn-m0 fn-tab0 fn-f0" data-focus="fn-f0"><div class="step-kicker">Шаг 1 · вход</div><h4>Три one-hot строки</h4><div class="math-display" data-fwdn-tex="fx"></div><div class="math-display" data-fwdn-tex="fw"></div><p>Умножение на one-hot строку ничего не считает — оно выбирает строку <span class="math-inline" data-tex="W_{xh}"></span>: <span class="math-inline" data-tex="x_tW_{xh}"></span> равно строке с номером токена.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-tab1 fn-f1" data-focus="fn-f1"><div class="step-kicker">Шаг 2 · предактивация</div><h4>Память включается со второго такта</h4><div class="math-display" data-fwdn-tex="fa"></div><p><span class="math-inline" data-tex="a_1=(0{,}5;\,-0{,}4)+(0{,}1;\,-0{,}1)"></span> — вклада памяти нет. Во второй строке к выбранной строке <span class="math-inline" data-tex="W_{xh}"></span> добавляется <span class="math-inline" data-tex="h_1W_{hh}"></span>.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-fb fn-tab2 fn-f2" data-focus="fn-f2"><div class="step-kicker">Шаг 3 · состояние</div><h4>tanh зажимает всё в (−1, 1)</h4><div class="math-display" data-fwdn-tex="fh"></div><p>Знаки состояния меняются от такта к такту: h₁ разнознаковое, h₂ положительное, h₃ снова разнознаковое. Память перезаписывается, а не накапливается.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-fb fn-a3 fn-m3 fn-tab3 fn-f3" data-focus="fn-f3"><div class="step-kicker">Шаг 4 · выходной слой</div><h4>Два числа → четыре логита</h4><div class="math-display" data-fwdn-tex="fz"></div><p>Каждая строка Z — оценки всех четырёх токенов словаря на своём такте.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-fb fn-a3 fn-m3 fn-c1 fn-m4 fn-tab4 fn-f4" data-focus="fn-f4"><div class="step-kicker">Шаг 5 · softmax</div><h4>Вероятности токенов</h4><div class="math-display" data-fwdn-tex="fs"></div><p>Зелёным — вероятности правильных токенов: 0,146, 0,269 и 0,267. На первом такте модель дала цели you меньше всех.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-fb fn-a3 fn-m3 fn-c1 fn-m4 fn-a5 fn-m5 fn-tab5 fn-f5" data-focus="fn-f5"><div class="step-kicker">Шаг 6 · ошибки тактов</div><h4>Три числа</h4><div class="math-display" data-fwdn-tex="fl"></div><p>Самая большая ошибка — на первом такте, где правильному you досталась самая маленькая вероятность в строке.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-fb fn-a3 fn-m3 fn-c1 fn-m4 fn-a5 fn-m5 fn-a6 fn-m6 fn-tab6 fn-f6" data-focus="fn-f6"><div class="step-kicker">Шаг 7 · loss</div><h4>Одно число</h4><div class="math-display" data-fwdn-tex="fL"></div><p>Случайная модель на словаре из четырёх токенов дала бы <span class="math-inline" data-tex="\log 4\approx1{,}386"></span>. Необученные веса пока хуже случайного угадывания — есть что оптимизировать.</p></div>
  </div>
</div>
<p class="stage-hint">Числа в матрицах и формулах согласованы: и то, и другое посчитано одним скриптом, округление — только при выводе.</p>

<div class="callout">
  <strong>Из двенадцати вероятностей в loss попадают три.</strong> Только
  <span class="math-inline" data-tex="\hat y_{1,\text{you}}"></span>, <span class="math-inline" data-tex="\hat y_{2,\text{will}}"></span> и
  <span class="math-inline" data-tex="\hat y_{3,\text{pass}}"></span> входят в <span class="math-inline" data-tex="\mathcal L"></span>, но градиент получит каждая
  клетка <span class="math-inline" data-tex="\hat Y"></span> — через нормировку softmax. А строка <span class="math-inline" data-tex="W_{xh}"></span> для токена
  pass не участвовала ни в одном такте: pass ни разу не был входом.
</div>


### Что forward обязан запомнить

<p>
  Backward — это цепное правило, применённое по развёртке сверху вниз и справа
  налево. Чтобы посчитать локальную производную каждого узла, нужны величины,
  вычисленные в forward. Их больше, чем у обычной сети: всё хранится для каждого
  такта.
</p>

<table class="shape-table">
  <thead><tr><th>Что помним</th><th>Форма</th><th>Зачем в backward</th></tr></thead>
  <tbody>
    <tr><td><code>X</code> (one-hot входы)</td><td><code>3×4</code></td><td>для <code>dW_xh = Xᵀ·Δ</code>; заодно показывает, какие строки <code>W_xh</code> вообще получат градиент</td></tr>
    <tr><td>состояния <code>h₀, h₁, h₂, h₃</code></td><td><code>4×2</code></td><td><code>h_(t−1)</code> — для <code>dW_hh</code>, <code>h_t</code> — для <code>dW_hy</code> и производной tanh <code>1 − h_t²</code></td></tr>
    <tr><td><code>Ŷ</code> (softmax)</td><td><code>3×4</code></td><td>для <code>dZ = (Ŷ − Y)/T</code></td></tr>
    <tr><td>номера целей <code>c_t</code></td><td><code>3</code></td><td>строят one-hot <code>Y</code> для того же старта</td></tr>
    <tr><td>сами <code>W_hy</code>, <code>W_hh</code></td><td><code>2×4</code>, <code>2×2</code></td><td>разворачивают градиент: <code>dZ·W_hyᵀ</code> и <code>δ_(t+1)·W_hhᵀ</code></td></tr>
  </tbody>
</table>

<div class="math-display" data-tex="\delta_t=\bigl(dz_t\,W_{hy}^{\top}+\delta_{t+1}W_{hh}^{\top}\bigr)\odot\left(1-h_t^{2}\right),\qquad \frac{\partial \mathcal L}{\partial W_{hh}}=\sum_t h_{t-1}^{\top}\delta_t,\qquad \frac{\partial \mathcal L}{\partial W_{xh}}=\sum_t x_t^{\top}\delta_t"></div>

<div class="callout-blue">
  <strong>Память — плата за время.</strong> В отличие от числа параметров, объём
  сохранённого растёт линейно с длиной фразы: все состояния, все предсказания и все
  входы нужны в backward. Предактивации <span class="math-inline" data-tex="a_t"></span> хранить не обязательно —
  производная tanh выражается через <span class="math-inline" data-tex="h_t"></span>.
</div>

---

## Часть 4. Backpropagation through time: развёрнутый граф и обратный путь ошибки

<p>
  Обучать нужно те же параметры, что работают в прямом проходе: матрицы <code>W</code>,
  <code>U</code>, <code>V</code> и сдвиги <code>b<sub>h</sub></code>, <code>b<sub>y</sub></code>.
  Для каждого надо ответить на вопрос «на сколько изменится ошибка, если чуть шевельнуть
  это число». Ответ собирается цепным правилом, но у цепочки появляется новое измерение —
  время. Сцена ниже использует ту же развёрнутую сеть, что и во второй части, и читает её
  справа налево: от ошибки к первому такту.
</p>
<div class="stage" id="stageBpttGraph" tabindex="0">
  <div class="stage-figure">
<svg id="bp" viewBox="0 0 960 680" role="img" aria-label="Обратный проход по развёрнутой RNN">
  <style>
    #bp { font-family: Helvetica, Arial, sans-serif; }
    #bp text { dominant-baseline: alphabetic; }
    #bp [data-key="fc"].is-focus text, #bp [data-key="cell"].is-focus text, #bp [data-key="mat"].is-focus text { font-weight: 400; }
    #bp .is-focus .sub-title { font-weight: 400; }
    #bp .svg-title { font-size: 28px; fill: #111; font-family: Georgia, 'Times New Roman', serif; }
    #bp .sub-title { font-size: 24px; fill: #111; }
    #bp .svg-word { font-size: 18px; fill: #111; }
    #bp .svg-small { font-size: 15px; fill: #555; }
    #bp .svg-form { font-size: 18px; fill: #111; font-style: italic; }
    #bp .svg-form-sm { font-size: 20px; fill: #111; }
    #bp .svg-big { font-size: 26px; fill: #111; font-style: italic; }
    #bp .state-label { font-size: 21px; fill: #111; font-style: italic; }
    #bp .out-label { font-size: 19px; font-style: italic; }
    #bp .param { font-size: 18px; font-style: italic; font-weight: 700; }
    #bp .step-tag { fill: #5E5850; font-size: 14px; font-weight: 700; }
    #bp .axis-title { fill: #5E5850; font-size: 14px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
    #bp .caption { font-size: 14px; font-weight: 700; letter-spacing: .04em; fill: #2A5E9B; }
    #bp .target { font-size: 14px; fill: #5E5850; }
    #bp .input-box { fill: #fff; stroke: #3576C0; stroke-width: 1.8; }
    #bp .param-box { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2; }
    #bp .memory-box { fill: #F0F6FC; stroke: #3576C0; stroke-width: 2; }
    #bp .output-chip { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #bp .layer-1 { fill: #F0F6FC; stroke: #3576C0; stroke-width: 2.2; }
    #bp .layer-2 { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2.2; }
    #bp .layer-n { fill: #F0FAF0; stroke: #73B222; stroke-width: 2.2; }
    #bp .node-in { fill: #f6d89f; stroke: #b18f57; stroke-width: 1.3; }
    #bp .node-h { fill: #e7b7b7; stroke: #ad7d7d; stroke-width: 1.3; }
    #bp .node-y { fill: #f0d9a8; stroke: #b89655; stroke-width: 1.3; }
    #bp .connect { stroke: #8a8a8a; stroke-width: 1.3; }
    #bp .state-t0 { fill: #F4F1EA; stroke: #8B857B; stroke-width: 2; }
    #bp .state-blue { fill: #F0F6FC; stroke: #3576C0; stroke-width: 2.2; }
    #bp .state-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2.2; }
    #bp .state-green { fill: #F0FAF0; stroke: #73B222; stroke-width: 2.2; }
    #bp .input-vector { fill: #fff; stroke: #3576C0; stroke-width: 1.8; }
    #bp .output-box { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #bp .head-box, #bp .loss-box { fill: #FFF4F4; stroke: #C30B0A; stroke-width: 2; }
    #bp .flow-gray { stroke: #5E5850; stroke-width: 2.2; fill: none; }
    #bp .flow-blue { stroke: #3576C0; stroke-width: 2.4; fill: none; }
    #bp .flow-yellow { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #bp .flow-green { stroke: #73B222; stroke-width: 2.4; fill: none; }
    #bp .flow-red { stroke: #C30B0A; stroke-width: 2.4; fill: none; }
    #bp .time-arrow { stroke: #5E5850; stroke-width: 2.1; fill: none; }
    #bp .grad-arrow { stroke: #C30B0A; stroke-width: 3.2; fill: none; }
    #bp .grad-frame { fill: none; stroke: #C30B0A; stroke-width: 3; }
    #bp .grad-label { fill: #A30908; font-size: 18px; font-style: italic; font-family: Georgia, 'Times New Roman', serif; }
  </style>
  <defs>
    <marker id="bp-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#5E5850"/></marker>
    <marker id="bp-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#3576C0"/></marker>
    <marker id="bp-yellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#C29E08"/></marker>
    <marker id="bp-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#73B222"/></marker>
    <marker id="bp-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#C30B0A"/></marker>
  </defs>
<text class="svg-title" x="32" y="38">Обучение RNN: обратный проход</text>
<g data-key="axis"><path d="M22 150 V632" class="time-arrow" marker-end="url(#bp-gray)"/><text x="12" y="390" class="axis-title" text-anchor="middle" transform="rotate(-90 12 390)">время</text></g>
<g data-key="h0"><rect x="315" y="64" width="92" height="60" rx="12" class="state-t0"/><text x="361" y="102" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">0</tspan></text><text x="423" y="99" class="target">начальная память = 0</text></g>
<g data-key="r1"><text x="40" y="212" class="svg-word" style="font-size:17px">&lt;BOS&gt;</text><text x="40" y="236" class="step-tag">t = 1</text><rect x="108" y="154" width="80" height="112" rx="18" class="input-vector"/><text x="148" y="180" text-anchor="middle" class="svg-small">1</text><text x="148" y="202" text-anchor="middle" class="svg-small">0</text><text x="148" y="224" text-anchor="middle" class="svg-small">0</text><text x="148" y="246" text-anchor="middle" class="svg-small">0</text><text x="210" y="218" text-anchor="middle" class="state-label" style="fill:#3576C0">x<tspan dy="-9" font-size="14">1</tspan></text><path d="M226 210 H303" class="flow-blue" marker-end="url(#bp-blue)"/><rect x="315" y="168" width="92" height="84" rx="12" class="state-blue"/><text x="361" y="218" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">1</tspan></text><path d="M407 210 H454" class="flow-blue" marker-end="url(#bp-blue)"/><rect x="466" y="178" width="76" height="64" rx="10" class="output-box"/><text x="504" y="218" text-anchor="middle" class="out-label" style="fill:#2A5E9B">y<tspan dy="-9" font-size="14">1</tspan></text></g>
<g data-key="u1"><path d="M361 124 V156" class="flow-gray" marker-end="url(#bp-gray)"/></g>
<g data-key="p1"><text x="264" y="198" text-anchor="middle" class="param" style="fill:#8C7106">W</text><text x="379" y="152" class="param" style="fill:#2A5E9B">U</text><text x="430" y="198" text-anchor="middle" class="param" style="fill:#5A8C1C">V</text></g>
<g data-key="r2"><text x="40" y="382" class="svg-word" style="font-size:17px">you</text><text x="40" y="406" class="step-tag">t = 2</text><rect x="108" y="324" width="80" height="112" rx="18" class="input-vector"/><text x="148" y="350" text-anchor="middle" class="svg-small">0</text><text x="148" y="372" text-anchor="middle" class="svg-small">1</text><text x="148" y="394" text-anchor="middle" class="svg-small">0</text><text x="148" y="416" text-anchor="middle" class="svg-small">0</text><text x="210" y="388" text-anchor="middle" class="state-label" style="fill:#3576C0">x<tspan dy="-9" font-size="14">2</tspan></text><path d="M226 380 H303" class="flow-blue" marker-end="url(#bp-blue)"/><rect x="315" y="338" width="92" height="84" rx="12" class="state-yellow"/><text x="361" y="388" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">2</tspan></text><path d="M407 380 H454" class="flow-yellow" marker-end="url(#bp-yellow)"/><rect x="466" y="348" width="76" height="64" rx="10" class="output-box"/><text x="504" y="388" text-anchor="middle" class="out-label" style="fill:#8C7106">y<tspan dy="-9" font-size="14">2</tspan></text></g>
<g data-key="u2"><path d="M361 252 V326" class="flow-blue" marker-end="url(#bp-blue)"/></g>
<g data-key="p2"><text x="264" y="368" text-anchor="middle" class="param" style="fill:#8C7106">W</text><text x="379" y="301" class="param" style="fill:#2A5E9B">U</text><text x="430" y="368" text-anchor="middle" class="param" style="fill:#5A8C1C">V</text></g>
<g data-key="r3"><text x="40" y="552" class="svg-word" style="font-size:17px">will</text><text x="40" y="576" class="step-tag">t = 3</text><rect x="108" y="494" width="80" height="112" rx="18" class="input-vector"/><text x="148" y="520" text-anchor="middle" class="svg-small">0</text><text x="148" y="542" text-anchor="middle" class="svg-small">0</text><text x="148" y="564" text-anchor="middle" class="svg-small">1</text><text x="148" y="586" text-anchor="middle" class="svg-small">0</text><text x="210" y="558" text-anchor="middle" class="state-label" style="fill:#3576C0">x<tspan dy="-9" font-size="14">3</tspan></text><path d="M226 550 H303" class="flow-blue" marker-end="url(#bp-blue)"/><rect x="315" y="508" width="92" height="84" rx="12" class="state-green"/><text x="361" y="558" text-anchor="middle" class="state-label">h<tspan dy="-9" font-size="14">3</tspan></text><path d="M407 550 H454" class="flow-green" marker-end="url(#bp-green)"/><rect x="466" y="518" width="76" height="64" rx="10" class="output-box"/><text x="504" y="558" text-anchor="middle" class="out-label" style="fill:#5A8C1C">y<tspan dy="-9" font-size="14">3</tspan></text></g>
<g data-key="u3"><path d="M361 422 V496" class="flow-yellow" marker-end="url(#bp-yellow)"/></g>
<g data-key="p3"><text x="264" y="538" text-anchor="middle" class="param" style="fill:#8C7106">W</text><text x="379" y="471" class="param" style="fill:#2A5E9B">U</text><text x="430" y="538" text-anchor="middle" class="param" style="fill:#5A8C1C">V</text></g>
<g data-key="head"><path d="M542 550 H578" class="flow-green" marker-end="url(#bp-green)"/><rect x="590" y="504" width="100" height="92" rx="12" class="head-box"/><text x="640" y="543" text-anchor="middle" class="svg-form-sm">FC</text><text x="640" y="572" text-anchor="middle" class="svg-form" style="fill:#A30908">W<tspan dy="6" font-size="12">fc</tspan><tspan dy="-6">, b</tspan><tspan dy="6" font-size="12">fc</tspan></text><path d="M690 550 H714" class="flow-red" marker-end="url(#bp-red)"/><rect x="726" y="518" width="64" height="64" rx="10" class="loss-box"/><text x="758" y="559" text-anchor="middle" class="svg-big" style="fill:#A30908">ŷ</text><path d="M790 550 H814" class="flow-red" marker-end="url(#bp-red)"/><rect x="826" y="510" width="118" height="80" rx="12" class="loss-box"/><text x="885" y="542" text-anchor="middle" class="svg-form-sm">loss</text><text x="885" y="572" text-anchor="middle" class="svg-form">L(ŷ, y)</text><text x="885" y="498" text-anchor="middle" class="target">цель: pass</text></g>
<g data-key="m2m" data-only="1"><path d="M542 210 H578" class="flow-green" marker-end="url(#bp-green)"/><rect x="590" y="164" width="100" height="92" rx="12" class="head-box"/><text x="640" y="203" text-anchor="middle" class="svg-form-sm">FC</text><text x="640" y="232" text-anchor="middle" class="svg-form" style="fill:#A30908">W<tspan dy="6" font-size="12">fc</tspan><tspan dy="-6">, b</tspan><tspan dy="6" font-size="12">fc</tspan></text><path d="M690 210 H714" class="flow-red" marker-end="url(#bp-red)"/><rect x="726" y="178" width="64" height="64" rx="10" class="loss-box"/><text x="758" y="219" text-anchor="middle" class="svg-big" style="fill:#A30908">ŷ<tspan dy="-9" font-size="14">1</tspan></text><path d="M790 210 H814" class="flow-red" marker-end="url(#bp-red)"/><rect x="826" y="170" width="118" height="80" rx="12" class="loss-box"/><text x="885" y="202" text-anchor="middle" class="svg-form-sm">loss</text><text x="885" y="232" text-anchor="middle" class="svg-form">L(ŷ¹, y¹)</text><text x="885" y="158" text-anchor="middle" class="target">цель: you</text><path d="M542 380 H578" class="flow-green" marker-end="url(#bp-green)"/><rect x="590" y="334" width="100" height="92" rx="12" class="head-box"/><text x="640" y="373" text-anchor="middle" class="svg-form-sm">FC</text><text x="640" y="402" text-anchor="middle" class="svg-form" style="fill:#A30908">W<tspan dy="6" font-size="12">fc</tspan><tspan dy="-6">, b</tspan><tspan dy="6" font-size="12">fc</tspan></text><path d="M690 380 H714" class="flow-red" marker-end="url(#bp-red)"/><rect x="726" y="348" width="64" height="64" rx="10" class="loss-box"/><text x="758" y="389" text-anchor="middle" class="svg-big" style="fill:#A30908">ŷ<tspan dy="-9" font-size="14">2</tspan></text><path d="M790 380 H814" class="flow-red" marker-end="url(#bp-red)"/><rect x="826" y="340" width="118" height="80" rx="12" class="loss-box"/><text x="885" y="372" text-anchor="middle" class="svg-form-sm">loss</text><text x="885" y="402" text-anchor="middle" class="svg-form">L(ŷ², y²)</text><text x="885" y="328" text-anchor="middle" class="target">цель: will</text><rect x="726" y="518" width="64" height="64" rx="10" class="loss-box"/><text x="758" y="559" text-anchor="middle" class="svg-big" style="fill:#A30908">ŷ<tspan dy="-9" font-size="14">3</tspan></text><rect x="826" y="510" width="118" height="80" rx="12" class="loss-box"/><text x="885" y="542" text-anchor="middle" class="svg-form-sm">loss</text><text x="885" y="572" text-anchor="middle" class="svg-form">L(ŷ³, y³)</text><text x="868" y="622" text-anchor="middle" class="grad-label">L = L¹ + L² + L³</text></g>
<g data-key="ghead" data-only="1"><rect x="580" y="494" width="120" height="112" rx="14" class="grad-frame"/><path d="M885 590 V622 H504 V594" class="grad-arrow" marker-end="url(#bp-red)"/><text x="780" y="614" text-anchor="middle" class="grad-label">∂L/∂y³</text></g>
<g data-key="gv" data-only="1"><rect x="416" y="516" width="28" height="30" rx="6" class="grad-frame"/><text x="430" y="506" text-anchor="middle" class="grad-label">∂L/∂V</text></g>
<g data-key="gdh" data-only="1"><rect x="307" y="500" width="108" height="100" rx="16" class="grad-frame"/><text x="361" y="626" text-anchor="middle" class="grad-label">∂L/∂h³</text></g>
<g data-key="gw1" data-only="1"><rect x="249" y="176" width="30" height="30" rx="6" class="grad-frame"/></g>
<g data-key="gw2" data-only="1"><rect x="249" y="346" width="30" height="30" rx="6" class="grad-frame"/></g>
<g data-key="gw3" data-only="1"><rect x="249" y="516" width="30" height="30" rx="6" class="grad-frame"/></g>
<g data-key="gb32" data-only="1"><path d="M315 528 H284 V402 H311" class="grad-arrow" marker-end="url(#bp-red)"/><text x="274" y="471" text-anchor="end" class="grad-label">∂h³/∂h²</text></g>
<g data-key="gb21" data-only="1"><path d="M315 358 H284 V232 H311" class="grad-arrow" marker-end="url(#bp-red)"/><text x="274" y="301" text-anchor="end" class="grad-label">∂h²/∂h¹</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head" data-focus="head">
      <div class="step-kicker">Шаг 1 · откуда начинается обучение</div>
      <h4>Прямой проход сделан, ошибка посчитана</h4>
      <p>Фраза прошла через ячейку: получены состояния <code>h¹</code>, <code>h²</code>, <code>h³</code>, последний выход передан в голову, а функция <code>L(ŷ, y)</code> измерила ошибку прогноза. Обучение должно ответить, как изменение каждого параметра изменит эту ошибку.</p>
      <div class="math-display" data-tex="\frac{\partial L}{\partial W},\;\frac{\partial L}{\partial U},\;\frac{\partial L}{\partial V},\;\frac{\partial L}{\partial b_h},\;\frac{\partial L}{\partial b_y}"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head ghead" data-focus="ghead">
      <div class="step-kicker">Шаг 2 · выходная голова</div>
      <h4>Сначала — знакомый backprop через FC</h4>
      <p>У <code>W<sub>fc</sub></code> и <code>b<sub>fc</sub></code> нет рекуррентной зависимости: их градиенты считаются обычным цепным правилом. Заодно получаем сигнал для рекуррентной части — градиент по выходу последнего такта <code>∂L/∂y³</code>.</p>
      <div class="math-display" data-tex="\frac{\partial L}{\partial W_{fc}},\qquad \frac{\partial L}{\partial b_{fc}},\qquad \frac{\partial L}{\partial y^{3}}"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head ghead" data-focus="r3 p3 u3">
      <div class="step-kicker">Шаг 3 · возвращаемся в ячейку</div>
      <h4>Последний такт зависит от входа и от прошлой памяти</h4>
      <p>Подставим <code>t = 3</code> в формулы ячейки. <code>y³</code> зависит от <code>h³</code> через <code>V</code>, а <code>h³</code> — от <code>x³</code> через <code>W</code> и от <code>h²</code> через <code>U</code>. Поэтому сначала считаем локальные выходные параметры, а потом раскрываем зависимость от прошлого.</p>
      <div class="math-display" data-tex="h^{3}=\tanh\!\left(x^{3}W+h^{2}U+b_h\right),\qquad y^{3}=f\!\left(h^{3}V+b_y\right)"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head ghead gv" data-focus="gv">
      <div class="step-kicker">Шаг 4 · локальный участок</div>
      <h4>Градиенты V и b_y не требуют движения во времени</h4>
      <p><code>V</code> и <code>b<sub>y</sub></code> участвуют в вычислении <code>y³</code> напрямую. Их производная — произведение пришедшего градиента по выходу и локальной производной выхода по параметру. Рекурсии здесь нет.</p>
      <div class="math-display" data-tex="\frac{\partial L}{\partial V}=\frac{\partial L}{\partial y^{3}}\cdot\frac{\partial y^{3}}{\partial V},\qquad \frac{\partial L}{\partial b_y}=\frac{\partial L}{\partial y^{3}}\cdot\frac{\partial y^{3}}{\partial b_y}"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head ghead gdh" data-focus="gdh">
      <div class="step-kicker">Шаг 5 · переход к матрице W</div>
      <h4>Для W сначала нужен градиент по последнему состоянию</h4>
      <p>Матрица <code>W</code> находится внутри формулы <code>h³</code>, поэтому ошибка доходит до неё через <code>∂L/∂h³</code>. Формула выглядит обычной, но множитель <code>dh³/dW</code> скрывает несколько путей: <code>h³</code> зависит от <code>h²</code>, а <code>h²</code> считалось с той же матрицей <code>W</code>.</p>
      <div class="math-display" data-tex="\frac{dL}{dW}=\frac{\partial L}{\partial h^{3}}\cdot\frac{dh^{3}}{dW}"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head ghead gdh gw3 gb32" data-focus="gw3 gb32">
      <div class="step-kicker">Шаг 6 · первый рекуррентный путь</div>
      <h4>У h³ два пути зависимости от W</h4>
      <p>Первое слагаемое — прямой вклад <code>W</code> на третьем такте. Второе проходит через прошлое состояние: множитель <code>∂h³/∂h²</code> (красная стрелка) переносит ошибку с третьего такта на второй. Это первый собственно рекуррентный участок обратного прохода.</p>
      <div class="math-display" data-tex="\frac{dh^{3}}{dW}=\underbrace{\frac{\partial h^{3}}{\partial W}}_{\text{прямой вклад}}+\underbrace{\frac{\partial h^{3}}{\partial h^{2}}\cdot\frac{dh^{2}}{dW}}_{\text{через }h^{2}}"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head ghead gdh gw3 gb32 gw2 gb21" data-focus="gw2 gb21">
      <div class="step-kicker">Шаг 7 · рекурсия повторяется</div>
      <h4>h² тоже зависит от W двумя путями</h4>
      <p>Тот же аргумент для второго такта: прямой вклад <code>W</code> и вклад через <code>h¹</code>. Градиент продолжает двигаться вверх по цепочке состояний — в сторону, обратную прямому проходу.</p>
      <div class="math-display" data-tex="\frac{dh^{2}}{dW}=\frac{\partial h^{2}}{\partial W}+\frac{\partial h^{2}}{\partial h^{1}}\cdot\frac{dh^{1}}{dW}"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head ghead gdh gw3 gb32 gw2 gb21 gw1" data-focus="gw1 gw2 gw3">
      <div class="step-kicker">Шаг 8 · полное раскрытие</div>
      <h4>Это и есть backpropagation through time</h4>
      <p>Для трёх тактов получаем три слагаемых — по одному на каждое использование <code>W</code>. Первое — прямой вклад последнего такта, второе проходит через <code>h²</code>, третье — через <code>h²</code> и <code>h¹</code>. Все они относятся к одной матрице и поэтому суммируются.</p><p>Нового вида производной нет: это обычное цепное правило на развёрнутом графе. Так же раскрываются градиенты по <code>U</code> и <code>b<sub>h</sub></code>.</p>
      <div class="math-display" data-tex="\frac{dL}{dW}=\frac{\partial L}{\partial h^{3}}\left(\frac{\partial h^{3}}{\partial W}+\frac{\partial h^{3}}{\partial h^{2}}\frac{\partial h^{2}}{\partial W}+\frac{\partial h^{3}}{\partial h^{2}}\frac{\partial h^{2}}{\partial h^{1}}\frac{\partial h^{1}}{\partial W}\right)"></div>
    </div>
    <div class="step-panel" data-on="axis h0 r1 u1 p1 r2 u2 p2 r3 u3 p3 head m2m" data-focus="m2m">
      <div class="step-kicker">Шаг 9 · ответ на каждом такте</div>
      <h4>Если выход нужен на каждом шаге, ошибки складываются</h4>
      <p>В языковой модели голова стоит на каждом такте: по <code>&lt;BOS&gt;</code> предсказываем <code>you</code>, по <code>you</code> — <code>will</code>, по <code>will</code> — <code>pass</code>. Общая ошибка — сумма локальных, и каждая добавляет свой сигнал в тот же обратный граф: состояние <code>hᵗ</code> получает градиент и от своего выхода, и от будущих тактов.</p>
      <div class="math-display" data-tex="L=\sum_{t=1}^{3}L\!\left(\hat y^{t},\,y^{t}\right)"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> BPTT — это обычный backpropagation по
  развёрнутому графу. Единственное отличие: параметр использован <code>T</code>
  раз, поэтому его градиент — сумма <code>T</code> вкладов, а вклад далёкого шага
  проходит через произведение множителей <code>∂hᵗ/∂hᵗ⁻¹</code>.
</div>

---

### BPTT руками: формулы, числа и шаг обучения

<p>
  Развёрнутый граф показал, куда течёт градиент. Теперь пройдём этот путь на той
  же фразе, что и в прямом проходе: общая формула каждой локальной производной,
  затем матрицы градиентов по элементам, затем числа — до
  <span class="math-inline" data-tex="dW_{xh}"></span>, <span class="math-inline" data-tex="dW_{hh}"></span>,
  <span class="math-inline" data-tex="dW_{hy}"></span>. В конце сверим результат с численным градиентом и
  сделаем один шаг обучения.
</p>

### Backward в формулах

<p>
  Идём сверху вниз и справа налево. Softmax с cross-entropy дают знакомый старт —
  «предсказание минус правда», только поделённое на T из-за усреднения. Дальше
  выходной слой, затем главное отличие от обычной сети: в <span class="math-inline" data-tex="dh_t"></span> сходятся два
  потока — от собственного выхода и из будущего такта. Потом tanh и, наконец, общие
  веса, которые собирают вклады всех тактов.
</p>

<div class="stage" id="stageBF" tabindex="0" aria-label="Backward рекуррентной сети в формулах">
  <div class="stage-figure">
<svg id="bf-svg" class="rnn-svg" viewBox="0 0 960 548" role="img" aria-label="Обратный проход по развёрнутой RNN">
<style>#bf-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="bf-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4.0" orient="auto"><path d="M0,0 L8,4.0 L0,8 Z" fill="#C30B0A"/></marker></defs>
<text x="30" y="34" text-anchor="start" class="v-title">Backward: локальная производная каждого узла</text>
<text x="30" y="56" text-anchor="start" class="v-small">Красные стрелки идут сверху вниз и справа налево: градиент разворачивается по сохранённой развёртке.</text>
<g data-key="bf-L"><text x="24" y="101" text-anchor="start" class="v-small">итог</text><rect x="370" y="78" width="200" height="36" rx="10" class="box-red"/><text x="470" y="101" text-anchor="middle" class="v-lblr">∂ℒ/∂ℒₜ = 1/T = ⅓</text><path d="M410 116 L220 139" class="edge-red" marker-end="url(#bf-arrow)"/><path d="M470 116 L470 139" class="edge-red" marker-end="url(#bf-arrow)"/><path d="M530 116 L720 139" class="edge-red" marker-end="url(#bf-arrow)"/></g>
<g data-key="bf-l"><text x="24" y="164" text-anchor="start" class="v-small">ошибка</text><rect x="155" y="142" width="130" height="34" rx="10" class="box-red"/><text x="220" y="164" text-anchor="middle" class="v-lblr">ℒ₁ · цель you</text><path d="M220 176 L220 201" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="405" y="142" width="130" height="34" rx="10" class="box-red"/><text x="470" y="164" text-anchor="middle" class="v-lblr">ℒ₂ · цель will</text><path d="M470 176 L470 201" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="655" y="142" width="130" height="34" rx="10" class="box-red"/><text x="720" y="164" text-anchor="middle" class="v-lblr">ℒ₃ · цель pass</text><path d="M720 176 L720 201" class="edge-red" marker-end="url(#bf-arrow)"/></g>
<g data-key="bf-s"><text x="24" y="226" text-anchor="start" class="v-small">softmax</text><rect x="155" y="204" width="130" height="34" rx="10" class="box-green"/><text x="220" y="226" text-anchor="middle" class="v-lbl13">dz₁ = (ŷ₁ − y₁)/T</text><path d="M220 238 L220 263" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="405" y="204" width="130" height="34" rx="10" class="box-green"/><text x="470" y="226" text-anchor="middle" class="v-lbl13">dz₂ = (ŷ₂ − y₂)/T</text><path d="M470 238 L470 263" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="655" y="204" width="130" height="34" rx="10" class="box-green"/><text x="720" y="226" text-anchor="middle" class="v-lbl13">dz₃ = (ŷ₃ − y₃)/T</text><path d="M720 238 L720 263" class="edge-red" marker-end="url(#bf-arrow)"/></g>
<g data-key="bf-f"><text x="24" y="291" text-anchor="start" class="v-small">выход</text><rect x="145" y="266" width="150" height="40" rx="10" class="box-yellow"/><text x="220" y="291" text-anchor="middle" class="v-lbl13">dW_hy += h₁ᵀ·dz₁</text><path d="M220 306 L220 333" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="395" y="266" width="150" height="40" rx="10" class="box-yellow"/><text x="470" y="291" text-anchor="middle" class="v-lbl13">dW_hy += h₂ᵀ·dz₂</text><path d="M470 306 L470 333" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="645" y="266" width="150" height="40" rx="10" class="box-yellow"/><text x="720" y="291" text-anchor="middle" class="v-lbl13">dW_hy += h₃ᵀ·dz₃</text><path d="M720 306 L720 333" class="edge-red" marker-end="url(#bf-arrow)"/></g>
<g data-key="bf-h"><path d="M133 379 L40 379" class="edge-red" marker-end="url(#bf-arrow)"/><text x="86" y="370" text-anchor="middle" class="tensor-name">δ₁·W_hhᵀ</text><path d="M383 379 L307 379" class="edge-red" marker-end="url(#bf-arrow)"/><text x="344" y="370" text-anchor="middle" class="tensor-name">δ₂·W_hhᵀ</text><path d="M633 379 L557 379" class="edge-red" marker-end="url(#bf-arrow)"/><text x="594" y="370" text-anchor="middle" class="tensor-name">δ₃·W_hhᵀ</text><path d="M900 379 L807 379" class="edge-red" marker-end="url(#bf-arrow)"/><text x="852" y="370" text-anchor="middle" class="tensor-name">δ₄ = 0</text></g>
<g data-key="bf-c"><text x="24" y="350" text-anchor="start" class="v-small">ячейка</text><rect x="135" y="336" width="170" height="86" rx="10" class="box-yellow"/><text x="220" y="356" text-anchor="middle" class="v-tlbl">t = 1</text><text x="220" y="381" text-anchor="middle" class="v-wlbl">δ₁ = dh₁ ⊙ (1 − h₁²)</text><text x="220" y="406" text-anchor="middle" class="v-lbl13">вклад в dW_xh, dW_hh</text><rect x="385" y="336" width="170" height="86" rx="10" class="box-yellow"/><text x="470" y="356" text-anchor="middle" class="v-tlbl">t = 2</text><text x="470" y="381" text-anchor="middle" class="v-wlbl">δ₂ = dh₂ ⊙ (1 − h₂²)</text><text x="470" y="406" text-anchor="middle" class="v-lbl13">вклад в dW_xh, dW_hh</text><rect x="635" y="336" width="170" height="86" rx="10" class="box-yellow"/><text x="720" y="356" text-anchor="middle" class="v-tlbl">t = 3</text><text x="720" y="381" text-anchor="middle" class="v-wlbl">δ₃ = dh₃ ⊙ (1 − h₃²)</text><text x="720" y="406" text-anchor="middle" class="v-lbl13">вклад в dW_xh, dW_hh</text></g>
<g data-key="bf-w"><rect x="140" y="392" width="160" height="20" rx="6" class="dash-y"/><rect x="140" y="262" width="160" height="48" rx="12" class="dash-y"/><rect x="390" y="392" width="160" height="20" rx="6" class="dash-y"/><rect x="390" y="262" width="160" height="48" rx="12" class="dash-y"/><rect x="640" y="392" width="160" height="20" rx="6" class="dash-y"/><rect x="640" y="262" width="160" height="48" rx="12" class="dash-y"/><text x="24" y="530" text-anchor="start" class="v-capy">пунктир — общие параметры: их градиент собирается суммой по всем трём тактам</text></g>
<g data-key="bf-x"><text x="24" y="482" text-anchor="start" class="v-small">вход</text><rect x="155" y="460" width="130" height="34" rx="10" class="box-blue"/><text x="220" y="482" text-anchor="middle" class="v-lblb">dx₁ = δ₁·W_xhᵀ</text><path d="M220 423 L220 457" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="405" y="460" width="130" height="34" rx="10" class="box-blue"/><text x="470" y="482" text-anchor="middle" class="v-lblb">dx₂ = δ₂·W_xhᵀ</text><path d="M470 423 L470 457" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="655" y="460" width="130" height="34" rx="10" class="box-blue"/><text x="720" y="482" text-anchor="middle" class="v-lblb">dx₃ = δ₃·W_xhᵀ</text><path d="M720 423 L720 457" class="edge-red" marker-end="url(#bf-arrow)"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="bf-L bf-l bf-s" data-focus="bf-s"><div class="step-kicker">Шаг 1 · softmax + CE</div><h4>Предсказание минус правда, делённое на T</h4><div class="math-display" data-bwdf-tex="bs"></div><p>Тот же старт, что в любой классификации, — на каждом такте свой. Множитель 1/T пришёл из усреднения ошибок тактов.</p></div>
    <div class="step-panel" data-on="bf-s bf-f" data-focus="bf-f"><div class="step-kicker">Шаг 2 · выходной слой</div><h4>Три производные из одного вектора</h4><div class="math-display" data-bwdf-tex="bf"></div><p><span class="math-inline" data-tex="dW_{hy}"></span> — сумма внешних произведений по тактам, <span class="math-inline" data-tex="db_y"></span> — сумма самих <span class="math-inline" data-tex="dz_t"></span>, а <span class="math-inline" data-tex="dh_t^{\text{out}}"></span> уходит вниз, в ячейку.</p></div>
    <div class="step-panel" data-on="bf-f bf-h" data-focus="bf-h"><div class="step-kicker">Шаг 3 · через время</div><h4>В dh_t сходятся два потока</h4><div class="math-display" data-bwdf-tex="bh"></div><p>Состояние <span class="math-inline" data-tex="h_t"></span> использовалось дважды: выходным слоем и следующим тактом. Поэтому и градиент складывается из двух частей. Считать приходится справа налево: <span class="math-inline" data-tex="\delta_{t+1}"></span> должен быть готов раньше <span class="math-inline" data-tex="\delta_t"></span>.</p></div>
    <div class="step-panel" data-on="bf-h bf-c" data-focus="bf-c"><div class="step-kicker">Шаг 4 · tanh</div><h4>Умножаем на производную tanh</h4><div class="math-display" data-bwdf-tex="bc"></div><p>Множитель <span class="math-inline" data-tex="1-h_t^2"></span> не бывает больше единицы: на каждом такте tanh немного гасит сигнал — отсюда затухание градиента на длинных фразах.</p></div>
    <div class="step-panel" data-on="bf-c bf-w" data-focus="bf-w"><div class="step-kicker">Шаг 5 · общие веса</div><h4>Общий вес — сумма по всем тактам</h4><div class="math-display" data-bwdf-tex="bw"></div><p>Один и тот же <span class="math-inline" data-tex="W_{hh}"></span> стоял в трёх местах развёртки, поэтому его градиент — сумма трёх вкладов. Это и есть backpropagation through time.</p></div>
    <div class="step-panel" data-on="bf-w bf-x" data-focus="bf-x"><div class="step-kicker">Шаг 6 · градиент по входу</div><h4>Если ниже есть ещё слои</h4><div class="math-display" data-bwdf-tex="bx"></div><p><span class="math-inline" data-tex="dx_t"></span> нужен, если вход — обучаемый эмбеддинг; <span class="math-inline" data-tex="dh_0"></span> — если начальное состояние приходит из другой сети, например из энкодера.</p></div>
  </div>
</div>
<p class="stage-hint">Каждый шаг — одна локальная производная; ниже те же шаги проходят на числах нашей фразы.</p>

<div class="callout">
  <strong>Backward — та же развёртка, пройденная наоборот.</strong> Разность
  <span class="math-inline" data-tex="\hat y_t-y_t"></span> стартует градиент на каждом такте, а рекуррентная связь несёт
  его влево: <span class="math-inline" data-tex="\delta_t"></span> зависит от <span class="math-inline" data-tex="\delta_{t+1}"></span>. Поэтому обратный проход
  по времени так же последователен, как прямой.
</div>

### Те же градиенты по элементам матриц

<p>Полный обратный проход по элементам. Строка — такт; сверху — текущий шаг; при «Далее» добавляется следующая матрица градиента.</p>

<div class="stage" id="stageSB" tabindex="0" aria-label="Те же градиенты по элементам матриц">
  <div class="stage-figure">
<svg id="sb-svg" class="rnn-svg" viewBox="0 0 960 545" role="img" aria-label="Backward по элементам: вся развёртка">
<style>#sb-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="sb-ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C30B0A"/></marker><marker id="sb-arb" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#3576C0"/></marker></defs><rect x="24.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="112.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dZ (выход)</text><rect x="208.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="296.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dHᵒᵘᵗ (выходной слой)</text><rect x="392.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="480.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dH (+ будущее)</text><rect x="576.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="664.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">Δ (tanh)</text><rect x="760.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="848.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dW, db</text><text x="480" y="62" text-anchor="middle" font-size="12" fill="#5E5850">весь backward по элементам: dZ → dHᵒᵘᵗ → dH → Δ → dW; петля Δ → dH несёт градиент по времени</text>
<g data-key="sb-m0" data-only="1"><rect x="40" y="100" width="200" height="114" fill="#C30B0A" fill-opacity="0.12"/><line x1="90" y1="100" x2="90" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="140" y1="100" x2="140" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="190" y1="100" x2="190" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="40" y1="138" x2="240" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="40" y1="176" x2="240" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 39 95 L 33 95 L 33 219 L 39 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 241 95 L 247 95 L 247 219 L 241 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="65.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">1,1</tspan></text><text x="115.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">1,2</tspan></text><text x="165.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">1,3</tspan></text><text x="215.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">1,4</tspan></text><text x="65.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">2,1</tspan></text><text x="115.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">2,2</tspan></text><text x="165.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">2,3</tspan></text><text x="215.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">2,4</tspan></text><text x="65.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">3,1</tspan></text><text x="115.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">3,2</tspan></text><text x="165.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">3,3</tspan></text><text x="215.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">3,4</tspan></text><text x="140.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="140.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dZ = (Ŷ − Y)/T</text></g>
<g data-key="sb-a1" data-only="1"><path d="M248 157 L296 157" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#sb-ar)"/></g>
<g data-key="sb-m1" data-only="1"><rect x="304" y="100" width="112" height="114" fill="#C30B0A" fill-opacity="0.12"/><line x1="360" y1="100" x2="360" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="304" y1="138" x2="416" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="304" y1="176" x2="416" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 303 95 L 297 95 L 297 219 L 303 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 417 95 L 423 95 L 423 219 L 417 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="332.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">dhᵒ<tspan font-size="10" dy="4">1,1</tspan></text><text x="388.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">dhᵒ<tspan font-size="10" dy="4">1,2</tspan></text><text x="332.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">dhᵒ<tspan font-size="10" dy="4">2,1</tspan></text><text x="388.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">dhᵒ<tspan font-size="10" dy="4">2,2</tspan></text><text x="332.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">dhᵒ<tspan font-size="10" dy="4">3,1</tspan></text><text x="388.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">dhᵒ<tspan font-size="10" dy="4">3,2</tspan></text><text x="360.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="360.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dHᵒᵘᵗ = dZ·W_hyᵀ</text></g>
<g data-key="sb-a2" data-only="1"><path d="M424 157 L472 157" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#sb-ar)"/></g>
<g data-key="sb-m2" data-only="1"><rect x="480" y="100" width="112" height="114" fill="#C30B0A" fill-opacity="0.12"/><line x1="536" y1="100" x2="536" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="480" y1="138" x2="592" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="480" y1="176" x2="592" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 479 95 L 473 95 L 473 219 L 479 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 593 95 L 599 95 L 599 219 L 593 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="508.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">dh<tspan font-size="10" dy="4">1,1</tspan></text><text x="564.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">dh<tspan font-size="10" dy="4">1,2</tspan></text><text x="508.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">dh<tspan font-size="10" dy="4">2,1</tspan></text><text x="564.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">dh<tspan font-size="10" dy="4">2,2</tspan></text><text x="508.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">dh<tspan font-size="10" dy="4">3,1</tspan></text><text x="564.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">dh<tspan font-size="10" dy="4">3,2</tspan></text><text x="536.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="536.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dH</text></g>
<g data-key="sb-fb" data-only="1"><path d="M712 246 L712 264 L536 264 L536 249" stroke="#C30B0A" stroke-width="2" fill="none" stroke-dasharray="6 4" marker-end="url(#sb-ar)"/><text x="624" y="284" text-anchor="middle" font-size="12" fill="#A30908">строка t+1 из Δ → строка t в dH (·W_hhᵀ)</text></g>
<g data-key="sb-a3" data-only="1"><path d="M600 157 L648 157" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#sb-ar)"/></g>
<g data-key="sb-m3" data-only="1"><rect x="656" y="100" width="112" height="114" fill="#C30B0A" fill-opacity="0.12"/><line x1="712" y1="100" x2="712" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="656" y1="138" x2="768" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="656" y1="176" x2="768" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 655 95 L 649 95 L 649 219 L 655 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 769 95 L 775 95 L 775 219 L 769 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="684.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">δ<tspan font-size="10" dy="4">1,1</tspan></text><text x="740.0" y="123.6" text-anchor="middle" font-size="12" fill="#111">δ<tspan font-size="10" dy="4">1,2</tspan></text><text x="684.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">δ<tspan font-size="10" dy="4">2,1</tspan></text><text x="740.0" y="161.6" text-anchor="middle" font-size="12" fill="#111">δ<tspan font-size="10" dy="4">2,2</tspan></text><text x="684.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">δ<tspan font-size="10" dy="4">3,1</tspan></text><text x="740.0" y="199.6" text-anchor="middle" font-size="12" fill="#111">δ<tspan font-size="10" dy="4">3,2</tspan></text><text x="712.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="712.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">Δ = dH ⊙ (1 − H²)</text></g>
<g data-key="sb-c1" data-only="1"><path d="M776 157 L912 157 L912 304 L20 304 L20 426 L50 426" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#sb-ar)"/></g>
<g data-key="sb-m4" data-only="1"><rect x="60" y="350" width="112" height="152" fill="#C30B0A" fill-opacity="0.12"/><line x1="116" y1="350" x2="116" y2="502" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="60" y1="388" x2="172" y2="388" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="60" y1="426" x2="172" y2="426" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="60" y1="464" x2="172" y2="464" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 59 345 L 53 345 L 53 507 L 59 507" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 173 345 L 179 345 L 179 507 L 173 507" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="88.0" y="373.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">1,1</tspan></text><text x="144.0" y="373.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">1,2</tspan></text><text x="88.0" y="411.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">2,1</tspan></text><text x="144.0" y="411.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">2,2</tspan></text><text x="88.0" y="449.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">3,1</tspan></text><text x="144.0" y="449.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">3,2</tspan></text><text x="88.0" y="487.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">4,1</tspan></text><text x="144.0" y="487.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">4,2</tspan></text><text x="116.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 2</text><text x="116.0" y="524" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dW_xh = XᵀΔ</text><rect x="290" y="350" width="160" height="114" fill="#3576C0" fill-opacity="0.1"/><line x1="330" y1="350" x2="330" y2="464" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="370" y1="350" x2="370" y2="464" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="410" y1="350" x2="410" y2="464" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="290" y1="388" x2="450" y2="388" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="290" y1="426" x2="450" y2="426" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 289 345 L 283 345 L 283 469 L 289 469" fill="none" stroke="#3576C0" stroke-width="1.8"/><path d="M 451 345 L 457 345 L 457 469 L 451 469" fill="none" stroke="#3576C0" stroke-width="1.8"/><text x="310.0" y="373.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,1</tspan></text><text x="350.0" y="373.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,2</tspan></text><text x="390.0" y="373.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,3</tspan></text><text x="430.0" y="373.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,4</tspan></text><text x="310.0" y="411.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,1</tspan></text><text x="350.0" y="411.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,2</tspan></text><text x="390.0" y="411.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,3</tspan></text><text x="430.0" y="411.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,4</tspan></text><text x="310.0" y="449.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,1</tspan></text><text x="350.0" y="449.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,2</tspan></text><text x="390.0" y="449.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,3</tspan></text><text x="430.0" y="449.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,4</tspan></text><text x="370.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="370.0" y="486" text-anchor="middle" font-size="14" font-weight="700" fill="#111">X · 3×4</text><path d="M280 407 L232 407" stroke="#3576C0" stroke-width="2.2" fill="none" marker-end="url(#sb-arb)"/><text x="258" y="398" text-anchor="middle" font-size="12" fill="#3576C0">Xᵀ·Δ</text><text x="186" y="373" font-size="12" fill="#5E5850">&lt;BOS&gt;</text><text x="186" y="411" font-size="12" fill="#5E5850">you</text><text x="186" y="449" font-size="12" fill="#5E5850">will</text><text x="186" y="487" font-size="12" fill="#5E5850">pass</text><rect x="500" y="350" width="112" height="76" fill="#C30B0A" fill-opacity="0.12"/><line x1="556" y1="350" x2="556" y2="426" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="500" y1="388" x2="612" y2="388" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 499 345 L 493 345 L 493 431 L 499 431" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 613 345 L 619 345 L 619 431 L 613 431" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="528.0" y="373.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">1,1</tspan></text><text x="584.0" y="373.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">1,2</tspan></text><text x="528.0" y="411.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">2,1</tspan></text><text x="584.0" y="411.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">2,2</tspan></text><text x="556.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 × 2</text><text x="556.0" y="448" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dW_hh = Σ hₜ₋₁ᵀδₜ</text><rect x="660" y="350" width="200" height="76" fill="#C30B0A" fill-opacity="0.12"/><line x1="710" y1="350" x2="710" y2="426" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="760" y1="350" x2="760" y2="426" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="810" y1="350" x2="810" y2="426" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="660" y1="388" x2="860" y2="388" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 659 345 L 653 345 L 653 431 L 659 431" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 861 345 L 867 345 L 867 431 L 861 431" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="685.0" y="373.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">1,1</tspan></text><text x="735.0" y="373.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">1,2</tspan></text><text x="785.0" y="373.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">1,3</tspan></text><text x="835.0" y="373.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">1,4</tspan></text><text x="685.0" y="411.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">2,1</tspan></text><text x="735.0" y="411.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">2,2</tspan></text><text x="785.0" y="411.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">2,3</tspan></text><text x="835.0" y="411.6" text-anchor="middle" font-size="12" fill="#111">dW<tspan font-size="10" dy="4">2,4</tspan></text><text x="760.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 × 4</text><text x="760.0" y="448" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dW_hy = Σ hₜᵀdzₜ</text><text x="500" y="486" font-size="13" fill="#5E5850">db_h = Σₜ δₜ  (сумма строк Δ)</text><text x="500" y="508" font-size="13" fill="#5E5850">db_y = Σₜ dzₜ  (сумма строк dZ)</text></g>
<g data-key="sb-tab0" data-only="1"><rect x="22.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-tab1" data-only="1"><rect x="206.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-tab2" data-only="1"><rect x="390.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-tab3" data-only="1"><rect x="574.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-tab4" data-only="1"><rect x="758.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-f0" data-only="1"><rect x="34" y="94" width="212" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sb-f1" data-only="1"><rect x="298" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sb-f2" data-only="1"><rect x="474" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sb-f3" data-only="1"><rect x="650" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sb-f4" data-only="1"><rect x="54" y="344" width="124" height="164" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="sb-m0 sb-tab0 sb-f0" data-focus="sb-f0"><div class="step-kicker">Шаг 1 · выход</div><h4>dZ</h4><p>Каждая строка: <span class="math-inline" data-tex="dz_t=(\hat y_t-y_t)/T"></span>. Все такты стартуют независимо друг от друга.</p></div>
    <div class="step-panel" data-on="sb-m0 sb-a1 sb-m1 sb-tab1 sb-f1" data-focus="sb-f1"><div class="step-kicker">Шаг 2 · выходной слой</div><h4>dZ → dHᵒᵘᵗ</h4><p><span class="math-inline" data-tex="dh^{\text{out}}_{t,i}=\sum_k dz_{t,k}W^{hy}_{i,k}"></span> — строка dZ на строку <span class="math-inline" data-tex="W_{hy}"></span>. Четыре числа сворачиваются в два.</p></div>
    <div class="step-panel" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-fb sb-tab2 sb-f2" data-focus="sb-f2"><div class="step-kicker">Шаг 3 · через время</div><h4>dHᵒᵘᵗ → dH</h4><p><span class="math-inline" data-tex="dh_{t,i}=dh^{\text{out}}_{t,i}+\sum_k \delta_{t+1,k}W^{hh}_{i,k}"></span>. Пунктир — вклад будущего такта: он придёт из строки t+1 матрицы Δ, которая появится на следующем шаге. Поэтому строки считаются снизу вверх: t = 3, 2, 1.</p></div>
    <div class="step-panel" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-fb sb-a3 sb-m3 sb-tab3 sb-f3" data-focus="sb-f3"><div class="step-kicker">Шаг 4 · tanh</div><h4>dH → Δ</h4><p>Поэлементно <span class="math-inline" data-tex="\delta_{t,i}=dh_{t,i}\,(1-h_{t,i}^2)"></span>. Теперь петля замкнута: строка t матрицы Δ возвращается в строку t−1 матрицы dH.</p></div>
    <div class="step-panel" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-fb sb-a3 sb-m3 sb-c1 sb-m4 sb-tab4 sb-f4" data-focus="sb-f4"><div class="step-kicker">Шаг 5 · общие веса</div><h4>Δ → dW, db</h4><p><span class="math-inline" data-tex="dW^{xh}_{j,i}=\sum_t x_{t,j}\,\delta_{t,i}"></span> — столбцы X на Δ. Так же <span class="math-inline" data-tex="dW_{hh}=\sum_t h_{t-1}^{\top}\delta_t"></span>, <span class="math-inline" data-tex="dW_{hy}=\sum_t h_t^{\top}dz_t"></span>, а сдвиги — суммы строк.</p></div>
  </div>
</div>
<p class="stage-hint">Полный backward: dZ → dHᵒᵘᵗ → dH → Δ → dW, а петля Δ → dH несёт градиент по времени.</p>


### Backward на числах

<p>
  Теперь та же цепочка на числах. Старт — <span class="math-inline" data-tex="dZ=(\hat Y-Y)/3"></span>: в каждой строке
  одна отрицательная клетка (правильный токен) и три положительные. Пунктирная петля
  добавляет вклад будущего только в первые две строки <span class="math-inline" data-tex="dH"></span> — у последнего такта
  будущего нет. А в <span class="math-inline" data-tex="dW_{xh}"></span> появляется целая нулевая строка: токена pass нет на
  входе, и его строка весов не получает ни одного вклада.
</p>

<div class="stage numeric-stage" id="stageBN" tabindex="0" aria-label="Числа обратного прохода">
  <div class="stage-figure">
<svg id="bn-svg" class="rnn-svg" viewBox="0 0 960 545" role="img" aria-label="Числа обратного прохода по тактам">
<style>#bn-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="bn-ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C30B0A"/></marker><marker id="bn-arb" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#3576C0"/></marker></defs><rect x="24.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="112.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dZ (выход)</text><rect x="208.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="296.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dHᵒᵘᵗ (выходной слой)</text><rect x="392.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="480.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dH (+ будущее)</text><rect x="576.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="664.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">Δ (tanh)</text><rect x="760.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="848.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dW, db</text><text x="480" y="62" text-anchor="middle" font-size="12" fill="#5E5850">градиент идёт сверху вниз по слоям и снизу вверх по строкам-тактам</text>
<g data-key="bn-m0" data-only="1"><rect x="40" y="100" width="50" height="38" fill="rgb(255,204,204)" stroke="#C9C2B8" stroke-width="1"/><rect x="90" y="100" width="50" height="38" fill="rgb(255,150,150)" stroke="#C9C2B8" stroke-width="1"/><rect x="140" y="100" width="50" height="38" fill="rgb(255,215,215)" stroke="#C9C2B8" stroke-width="1"/><rect x="190" y="100" width="50" height="38" fill="rgb(255,222,222)" stroke="#C9C2B8" stroke-width="1"/><rect x="40" y="138" width="50" height="38" fill="rgb(255,224,224)" stroke="#C9C2B8" stroke-width="1"/><rect x="90" y="138" width="50" height="38" fill="rgb(255,217,217)" stroke="#C9C2B8" stroke-width="1"/><rect x="140" y="138" width="50" height="38" fill="rgb(255,164,164)" stroke="#C9C2B8" stroke-width="1"/><rect x="190" y="138" width="50" height="38" fill="rgb(255,213,213)" stroke="#C9C2B8" stroke-width="1"/><rect x="40" y="176" width="50" height="38" fill="rgb(255,225,225)" stroke="#C9C2B8" stroke-width="1"/><rect x="90" y="176" width="50" height="38" fill="rgb(255,203,203)" stroke="#C9C2B8" stroke-width="1"/><rect x="140" y="176" width="50" height="38" fill="rgb(255,226,226)" stroke="#C9C2B8" stroke-width="1"/><rect x="190" y="176" width="50" height="38" fill="rgb(255,164,164)" stroke="#C9C2B8" stroke-width="1"/><path d="M 39 95 L 33 95 L 33 219 L 39 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 241 95 L 247 95 L 247 219 L 241 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="65.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.123</text><text x="115.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">−0.285</text><text x="165.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.091</text><text x="215.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.070</text><text x="65.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.062</text><text x="115.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.085</text><text x="165.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">−0.244</text><text x="215.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.096</text><text x="65.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0.061</text><text x="115.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0.127</text><text x="165.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">0.056</text><text x="215.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.244</text><text x="140.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="140.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dZ = (Ŷ − Y)/T</text></g>
<g data-key="bn-a1" data-only="1"><path d="M248 157 L296 157" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-ar)"/></g>
<g data-key="bn-m1" data-only="1"><rect x="304" y="100" width="56" height="38" fill="rgb(255,156,156)" stroke="#C9C2B8" stroke-width="1"/><rect x="360" y="100" width="56" height="38" fill="rgb(255,172,172)" stroke="#C9C2B8" stroke-width="1"/><rect x="304" y="138" width="56" height="38" fill="rgb(255,178,178)" stroke="#C9C2B8" stroke-width="1"/><rect x="360" y="138" width="56" height="38" fill="rgb(255,238,238)" stroke="#C9C2B8" stroke-width="1"/><rect x="304" y="176" width="56" height="38" fill="rgb(255,229,229)" stroke="#C9C2B8" stroke-width="1"/><rect x="360" y="176" width="56" height="38" fill="rgb(255,225,225)" stroke="#C9C2B8" stroke-width="1"/><path d="M 303 95 L 297 95 L 297 219 L 303 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 417 95 L 423 95 L 423 219 L 417 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="332.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.266</text><text x="388.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">−0.220</text><text x="332.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">−0.200</text><text x="388.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">0.021</text><text x="332.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.049</text><text x="388.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.059</text><text x="360.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="360.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dHᵒᵘᵗ = dZ·W_hyᵀ</text></g>
<g data-key="bn-a2" data-only="1"><path d="M424 157 L472 157" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-ar)"/></g>
<g data-key="bn-m2" data-only="1"><rect x="480" y="100" width="56" height="38" fill="rgb(255,178,178)" stroke="#C9C2B8" stroke-width="1"/><rect x="536" y="100" width="56" height="38" fill="rgb(255,165,165)" stroke="#C9C2B8" stroke-width="1"/><rect x="480" y="138" width="56" height="38" fill="rgb(255,176,176)" stroke="#C9C2B8" stroke-width="1"/><rect x="536" y="138" width="56" height="38" fill="rgb(255,242,242)" stroke="#C9C2B8" stroke-width="1"/><rect x="480" y="176" width="56" height="38" fill="rgb(255,229,229)" stroke="#C9C2B8" stroke-width="1"/><rect x="536" y="176" width="56" height="38" fill="rgb(255,225,225)" stroke="#C9C2B8" stroke-width="1"/><path d="M 479 95 L 473 95 L 473 219 L 479 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 593 95 L 599 95 L 599 219 L 593 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="508.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.201</text><text x="564.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">−0.240</text><text x="508.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">−0.207</text><text x="564.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">−0.009</text><text x="508.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.049</text><text x="564.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.059</text><text x="536.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="536.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dH</text></g>
<g data-key="bn-fb" data-only="1"><path d="M712 246 L712 264 L536 264 L536 249" stroke="#C30B0A" stroke-width="2" fill="none" stroke-dasharray="6 4" marker-end="url(#bn-ar)"/><text x="624" y="284" text-anchor="middle" font-size="12" fill="#A30908">строка t+1 из Δ → строка t в dH (·W_hhᵀ)</text></g>
<g data-key="bn-a3" data-only="1"><path d="M600 157 L648 157" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-ar)"/></g>
<g data-key="bn-m3" data-only="1"><rect x="656" y="100" width="56" height="38" fill="rgb(255,197,197)" stroke="#C9C2B8" stroke-width="1"/><rect x="712" y="100" width="56" height="38" fill="rgb(255,182,182)" stroke="#C9C2B8" stroke-width="1"/><rect x="656" y="138" width="56" height="38" fill="rgb(255,189,189)" stroke="#C9C2B8" stroke-width="1"/><rect x="712" y="138" width="56" height="38" fill="rgb(255,242,242)" stroke="#C9C2B8" stroke-width="1"/><rect x="656" y="176" width="56" height="38" fill="rgb(255,230,230)" stroke="#C9C2B8" stroke-width="1"/><rect x="712" y="176" width="56" height="38" fill="rgb(255,227,227)" stroke="#C9C2B8" stroke-width="1"/><path d="M 655 95 L 649 95 L 649 219 L 655 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 769 95 L 775 95 L 775 219 L 769 219" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="684.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">0.143</text><text x="740.0" y="123.1" text-anchor="middle" font-size="12" fill="#111">−0.189</text><text x="684.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">−0.168</text><text x="740.0" y="161.1" text-anchor="middle" font-size="12" fill="#111">−0.008</text><text x="684.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.045</text><text x="740.0" y="199.1" text-anchor="middle" font-size="12" fill="#111">−0.053</text><text x="712.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 2</text><text x="712.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">Δ = dH ⊙ (1 − H²)</text></g>
<g data-key="bn-c1" data-only="1"><path d="M776 157 L912 157 L912 304 L20 304 L20 426 L50 426" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-ar)"/></g>
<g data-key="bn-m4" data-only="1"><rect x="60" y="350" width="56" height="38" fill="rgb(255,197,197)" stroke="#C9C2B8" stroke-width="1"/><rect x="116" y="350" width="56" height="38" fill="rgb(255,182,182)" stroke="#C9C2B8" stroke-width="1"/><rect x="60" y="388" width="56" height="38" fill="rgb(255,189,189)" stroke="#C9C2B8" stroke-width="1"/><rect x="116" y="388" width="56" height="38" fill="rgb(255,242,242)" stroke="#C9C2B8" stroke-width="1"/><rect x="60" y="426" width="56" height="38" fill="rgb(255,230,230)" stroke="#C9C2B8" stroke-width="1"/><rect x="116" y="426" width="56" height="38" fill="rgb(255,227,227)" stroke="#C9C2B8" stroke-width="1"/><rect x="60" y="464" width="56" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="116" y="464" width="56" height="38" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><path d="M 59 345 L 53 345 L 53 507 L 59 507" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 173 345 L 179 345 L 179 507 L 173 507" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="88.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0.143</text><text x="144.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">−0.189</text><text x="88.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">−0.168</text><text x="144.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">−0.008</text><text x="88.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">−0.045</text><text x="144.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">−0.053</text><text x="88.0" y="487.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="144.0" y="487.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="116.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 2</text><text x="116.0" y="524" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dW_xh = XᵀΔ</text><rect x="290" y="350" width="40" height="38" fill="#CFE0F3" stroke="#C9C2B8" stroke-width="1"/><rect x="330" y="350" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="370" y="350" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="410" y="350" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="290" y="388" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="330" y="388" width="40" height="38" fill="#CFE0F3" stroke="#C9C2B8" stroke-width="1"/><rect x="370" y="388" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="410" y="388" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="290" y="426" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="330" y="426" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="370" y="426" width="40" height="38" fill="#CFE0F3" stroke="#C9C2B8" stroke-width="1"/><rect x="410" y="426" width="40" height="38" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><path d="M 289 345 L 283 345 L 283 469 L 289 469" fill="none" stroke="#3576C0" stroke-width="1.8"/><path d="M 451 345 L 457 345 L 457 469 L 451 469" fill="none" stroke="#3576C0" stroke-width="1.8"/><text x="310.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">1</text><text x="350.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="390.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="430.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="310.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="350.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">1</text><text x="390.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="430.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="310.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="350.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="390.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">1</text><text x="430.0" y="449.1" text-anchor="middle" font-size="12" fill="#111">0</text><text x="370.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 4</text><text x="370.0" y="486" text-anchor="middle" font-size="14" font-weight="700" fill="#111">X · 3×4</text><path d="M280 407 L232 407" stroke="#3576C0" stroke-width="2.2" fill="none" marker-end="url(#bn-arb)"/><text x="258" y="398" text-anchor="middle" font-size="12" fill="#3576C0">Xᵀ·Δ</text><text x="186" y="373" font-size="12" fill="#5E5850">&lt;BOS&gt;</text><text x="186" y="411" font-size="12" fill="#5E5850">you</text><text x="186" y="449" font-size="12" fill="#5E5850">will</text><text x="186" y="487" font-size="12" fill="#5E5850">pass</text><rect x="500" y="350" width="56" height="38" fill="rgb(255,208,208)" stroke="#C9C2B8" stroke-width="1"/><rect x="556" y="350" width="56" height="38" fill="rgb(255,236,236)" stroke="#C9C2B8" stroke-width="1"/><rect x="500" y="388" width="56" height="38" fill="rgb(255,226,226)" stroke="#C9C2B8" stroke-width="1"/><rect x="556" y="388" width="56" height="38" fill="rgb(255,239,239)" stroke="#C9C2B8" stroke-width="1"/><path d="M 499 345 L 493 345 L 493 431 L 499 431" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 613 345 L 619 345 L 619 431 L 613 431" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="528.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">−0.110</text><text x="584.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">−0.027</text><text x="528.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">0.058</text><text x="584.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">−0.019</text><text x="556.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 × 2</text><text x="556.0" y="448" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dW_hh = Σ hₜ₋₁ᵀδₜ</text><rect x="660" y="350" width="50" height="38" fill="rgb(255,219,219)" stroke="#C9C2B8" stroke-width="1"/><rect x="710" y="350" width="50" height="38" fill="rgb(255,195,195)" stroke="#C9C2B8" stroke-width="1"/><rect x="760" y="350" width="50" height="38" fill="rgb(255,221,221)" stroke="#C9C2B8" stroke-width="1"/><rect x="810" y="350" width="50" height="38" fill="rgb(255,196,196)" stroke="#C9C2B8" stroke-width="1"/><rect x="660" y="388" width="50" height="38" fill="rgb(255,241,241)" stroke="#C9C2B8" stroke-width="1"/><rect x="710" y="388" width="50" height="38" fill="rgb(255,175,175)" stroke="#C9C2B8" stroke-width="1"/><rect x="760" y="388" width="50" height="38" fill="rgb(255,202,202)" stroke="#C9C2B8" stroke-width="1"/><rect x="810" y="388" width="50" height="38" fill="rgb(255,222,222)" stroke="#C9C2B8" stroke-width="1"/><path d="M 659 345 L 653 345 L 653 431 L 659 431" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 861 345 L 867 345 L 867 431 L 861 431" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="685.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0.077</text><text x="735.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">−0.151</text><text x="785.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">−0.073</text><text x="835.0" y="373.1" text-anchor="middle" font-size="12" fill="#111">0.147</text><text x="685.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">−0.011</text><text x="735.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">0.209</text><text x="785.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">−0.129</text><text x="835.0" y="411.1" text-anchor="middle" font-size="12" fill="#111">−0.069</text><text x="760.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 × 4</text><text x="760.0" y="448" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dW_hy = Σ hₜᵀdzₜ</text><text x="500" y="486" font-size="13" fill="#5E5850">db_h = Σₜ δₜ = (−0.070, −0.250)</text><text x="500" y="508" font-size="13" fill="#5E5850">db_y = Σₜ dzₜ = (0.247, −0.073, −0.096, −0.078)</text></g>
<g data-key="bn-tab0" data-only="1"><rect x="22.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-tab1" data-only="1"><rect x="206.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-tab2" data-only="1"><rect x="390.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-tab3" data-only="1"><rect x="574.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-tab4" data-only="1"><rect x="758.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-f0" data-only="1"><rect x="34" y="94" width="212" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="bn-f1" data-only="1"><rect x="298" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="bn-f2" data-only="1"><rect x="474" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="bn-f3" data-only="1"><rect x="650" y="94" width="124" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="bn-f4" data-only="1"><rect x="54" y="344" width="124" height="164" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="bn-m0 bn-tab0 bn-f0" data-focus="bn-f0"><div class="step-kicker">Шаг 1 · dZ</div><h4>Предсказание минус правда</h4><div class="math-display" data-bwdn-tex="bz"></div><p>Модель почти не различает токены, поэтому правки небольшие. Но в каждой строке ровно одна отрицательная клетка — у правильного токена: его вероятность нужно поднять, остальные опустить.</p></div>
    <div class="step-panel" data-on="bn-m0 bn-a1 bn-m1 bn-tab1 bn-f1" data-focus="bn-f1"><div class="step-kicker">Шаг 2 · dHᵒᵘᵗ</div><h4>Выходной слой раздаёт градиент</h4><div class="math-display" data-bwdn-tex="bo"></div><p>Каждая строка — это <span class="math-inline" data-tex="dz_t"></span>, пропущенная через <span class="math-inline" data-tex="W_{hy}^{\top}"></span>: четыре числа сворачиваются в два — по одному на координату памяти.</p></div>
    <div class="step-panel" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-fb bn-tab2 bn-f2" data-focus="bn-f2"><div class="step-kicker">Шаг 3 · dH</div><h4>Будущее добавляется к настоящему</h4><div class="math-display" data-bwdn-tex="bh"></div><p>Третья строка не меняется: <span class="math-inline" data-tex="\delta_4=0"></span>. В первой строке вклад будущего −0,065 заметно сдвигает первую координату: <span class="math-inline" data-tex="h_1"></span> отвечает и за свой выход, и за оба следующих такта.</p></div>
    <div class="step-panel" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-fb bn-a3 bn-m3 bn-tab3 bn-f3" data-focus="bn-f3"><div class="step-kicker">Шаг 4 · Δ</div><h4>tanh ослабляет сигнал</h4><div class="math-display" data-bwdn-tex="bd"></div><p>Все множители <span class="math-inline" data-tex="1-h^2"></span> меньше единицы. Сильнее всего гасится первая координата первого такта (0,712), где <span class="math-inline" data-tex="|h|"></span> больше всего.</p></div>
    <div class="step-panel" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-fb bn-a3 bn-m3 bn-c1 bn-m4 bn-tab4 bn-f4" data-focus="bn-f4"><div class="step-kicker">Шаг 5 · dW и db</div><h4>Сумма по тактам</h4><div class="math-display" data-bwdn-tex="bw"></div><div class="math-display" data-bwdn-tex="bw2"></div><p>Строка <span class="math-inline" data-tex="dW_{xh}"></span> для pass — нули: этот токен ни разу не был входом. Остальные три строки просто повторяют строки Δ, потому что X — one-hot.</p></div>
  </div>
</div>
<p class="stage-hint">Нулевая строка dW_xh — прямое следствие one-hot входа: Xᵀ выбирает строки Δ, и строке pass выбирать нечего.</p>

<div class="callout-red">
  <strong>Градиент по времени быстро слабеет.</strong> Уже на один такт назад вклад
  будущего в <span class="math-inline" data-tex="dh_1"></span> заметно меньше собственного: <span class="math-inline" data-tex="-0{,}065\ \text{против}\ 0{,}266"></span>.
  Каждый следующий такт назад снова умножает сигнал на <span class="math-inline" data-tex="W_{hh}^{\top}"></span> и на
  <span class="math-inline" data-tex="1-h^2\le1"></span>. На фразе из трёх слов это незаметно, на трёхстах первые токены
  почти не получают сигнала. Это и есть затухающий градиент — главная слабость
  простой RNN.
</div>


### Проверка градиента и шаг обучения

<p>
  Аналитический градиент легко сверить с численным: сдвинуть один параметр на
  маленькое <span class="math-inline" data-tex="\varepsilon"></span> в обе стороны и поделить разность loss на
  <span class="math-inline" data-tex="2\varepsilon"></span>. Совпадение до десятого знака означает, что в выкладке нет ошибки.
</p>

<div class="worked-example">
  <div class="worked-label">Сверка центральными разностями · ε = 10⁻⁶</div>
  <div class="worked-grid">
    <div class="worked-cell">
      <span>Максимум расхождения по dW_xh и dW_hh</span>
      <div class="math-display worked-math" data-tex="\max|dW-dW_{\text{числ}}|\approx8{,}3\cdot10^{-11}"></div>
    </div>
    <div class="worked-cell">
      <span>По db_h и db_y</span>
      <div class="math-display worked-math" data-tex="\max|db-db_{\text{числ}}|\approx1{,}2\cdot10^{-10}"></div>
    </div>
    <div class="worked-cell worked-result">
      <span>По dW_hy</span>
      <div class="math-display worked-math" data-tex="\max|dW_{hy}-dW_{hy,\text{числ}}|\approx2{,}2\cdot10^{-10}"></div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> расхождения порядка <span class="math-inline" data-tex="10^{-10}"></span> — это шум округления, а не ошибка. Аналитический BPTT, включая сумму по тактам и вклад будущего, верен.</p>
</div>

<p>
  Остаётся один шаг градиентного спуска. Вычитаем
  <span class="math-inline" data-tex="\eta\cdot\text{градиент}"></span> из каждого параметра и снова считаем loss на той же фразе.
</p>

<div class="math-display" data-tex="W_{xh}\leftarrow W_{xh}-\eta\,dW_{xh},\quad W_{hh}\leftarrow W_{hh}-\eta\,dW_{hh},\quad W_{hy}\leftarrow W_{hy}-\eta\,dW_{hy},\quad b_h\leftarrow b_h-\eta\,db_h,\quad b_y\leftarrow b_y-\eta\,db_y"></div>

<div class="worked-example">
  <div class="worked-label">Один шаг · η = 0,5</div>
  <div class="worked-grid">
    <div class="worked-cell">
      <span>Loss до шага</span>
      <div class="math-display worked-math" data-tex="\mathcal L = 1{,}5192"></div>
    </div>
    <div class="worked-cell worked-result">
      <span>Loss после шага</span>
      <div class="math-display worked-math" data-tex="\mathcal L = 1{,}3478"></div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> один шаг по верному градиенту опустил ошибку ниже <span class="math-inline" data-tex="\log 4\approx1{,}386"></span> — сеть уже лучше случайного угадывания на этой фразе.</p>
</div>

### Как выглядит один шаг для W<sub>xh</sub>

<p>
  Правило простое: из каждого веса вычитаем скорость обучения, умноженную на его
  градиент. Ниже — та же операция для входной матрицы <span class="math-inline" data-tex="W_{xh}"></span> на числах; на
  втором шаге подсвечена строка токена pass: градиент там нулевой, и веса не меняются.
</p>

<div class="stage numeric-stage" id="stageGD" tabindex="0" aria-label="Один шаг градиентного спуска для входной матрицы">
  <div class="stage-figure">
<svg id="gd-svg" class="rnn-svg" viewBox="0 0 960 420" role="img" aria-label="Один шаг градиентного спуска для входной матрицы">
<style>#gd-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="gd-arrow2" markerWidth="8" markerHeight="8" refX="6" refY="4.0" orient="auto"><path d="M0,0 L8,4.0 L0,8 Z" fill="#73B222"/></marker></defs><text x="30" y="34" class="v-title">Шаг градиентного спуска: W_xh ← W_xh − η·dW_xh</text>
<text x="30" y="56" class="v-small">Вычитаем η = 0,5 от градиента. Показана W_xh; остальные параметры обновляются так же.</text>
<g data-key="gd-base"><rect x="150" y="110" width="64" height="36" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="214" y="110" width="64" height="36" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="150" y="146" width="64" height="36" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="214" y="146" width="64" height="36" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="150" y="182" width="64" height="36" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="214" y="182" width="64" height="36" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="150" y="218" width="64" height="36" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="214" y="218" width="64" height="36" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><path d="M 149 105 L 143 105 L 143 259 L 149 259" fill="none" stroke="#C29E08" stroke-width="1.8"/><path d="M 279 105 L 285 105 L 285 259 L 279 259" fill="none" stroke="#C29E08" stroke-width="1.8"/><text x="182.0" y="132.1" text-anchor="middle" font-size="12" fill="#111">0.50</text><text x="246.0" y="132.1" text-anchor="middle" font-size="12" fill="#111">−0.40</text><text x="182.0" y="168.1" text-anchor="middle" font-size="12" fill="#111">0.20</text><text x="246.0" y="168.1" text-anchor="middle" font-size="12" fill="#111">0.90</text><text x="182.0" y="204.1" text-anchor="middle" font-size="12" fill="#111">−0.60</text><text x="246.0" y="204.1" text-anchor="middle" font-size="12" fill="#111">0.30</text><text x="182.0" y="240.1" text-anchor="middle" font-size="12" fill="#111">0.70</text><text x="246.0" y="240.1" text-anchor="middle" font-size="12" fill="#111">0.10</text><text x="214.0" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 2</text><text x="214.0" y="276" text-anchor="middle" font-size="14" font-weight="700" fill="#111">W_xh (было)</text><text x="138" y="132" text-anchor="end" font-size="13" fill="#5E5850">&lt;BOS&gt;</text><text x="138" y="168" text-anchor="end" font-size="13" fill="#5E5850">you</text><text x="138" y="204" text-anchor="end" font-size="13" fill="#5E5850">will</text><text x="138" y="240" text-anchor="end" font-size="13" fill="#5E5850">pass</text><text x="334" y="187" text-anchor="middle" font-size="18" fill="#111">− 0,5 ×</text><rect x="390" y="110" width="64" height="36" fill="rgb(255,197,197)" stroke="#C9C2B8" stroke-width="1"/><rect x="454" y="110" width="64" height="36" fill="rgb(255,182,182)" stroke="#C9C2B8" stroke-width="1"/><rect x="390" y="146" width="64" height="36" fill="rgb(255,189,189)" stroke="#C9C2B8" stroke-width="1"/><rect x="454" y="146" width="64" height="36" fill="rgb(255,242,242)" stroke="#C9C2B8" stroke-width="1"/><rect x="390" y="182" width="64" height="36" fill="rgb(255,230,230)" stroke="#C9C2B8" stroke-width="1"/><rect x="454" y="182" width="64" height="36" fill="rgb(255,227,227)" stroke="#C9C2B8" stroke-width="1"/><rect x="390" y="218" width="64" height="36" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="454" y="218" width="64" height="36" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><path d="M 389 105 L 383 105 L 383 259 L 389 259" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 519 105 L 525 105 L 525 259 L 519 259" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="422.0" y="132.1" text-anchor="middle" font-size="12" fill="#111">0.143</text><text x="486.0" y="132.1" text-anchor="middle" font-size="12" fill="#111">−0.189</text><text x="422.0" y="168.1" text-anchor="middle" font-size="12" fill="#111">−0.168</text><text x="486.0" y="168.1" text-anchor="middle" font-size="12" fill="#111">−0.008</text><text x="422.0" y="204.1" text-anchor="middle" font-size="12" fill="#111">−0.045</text><text x="486.0" y="204.1" text-anchor="middle" font-size="12" fill="#111">−0.053</text><text x="422.0" y="240.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="486.0" y="240.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="454.0" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 2</text><text x="454.0" y="276" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dW_xh</text><text x="579" y="187" text-anchor="middle" font-size="20" fill="#111">=</text><rect x="640" y="110" width="64" height="36" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="704" y="110" width="64" height="36" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="640" y="146" width="64" height="36" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="704" y="146" width="64" height="36" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="640" y="182" width="64" height="36" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="704" y="182" width="64" height="36" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="640" y="218" width="64" height="36" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="704" y="218" width="64" height="36" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><path d="M 639 105 L 633 105 L 633 259 L 639 259" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 769 105 L 775 105 L 775 259 L 769 259" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="672.0" y="132.1" text-anchor="middle" font-size="12" fill="#111">0.429</text><text x="736.0" y="132.1" text-anchor="middle" font-size="12" fill="#111">−0.305</text><text x="672.0" y="168.1" text-anchor="middle" font-size="12" fill="#111">0.284</text><text x="736.0" y="168.1" text-anchor="middle" font-size="12" fill="#111">0.904</text><text x="672.0" y="204.1" text-anchor="middle" font-size="12" fill="#111">−0.577</text><text x="736.0" y="204.1" text-anchor="middle" font-size="12" fill="#111">0.326</text><text x="672.0" y="240.1" text-anchor="middle" font-size="12" fill="#111">0.700</text><text x="736.0" y="240.1" text-anchor="middle" font-size="12" fill="#111">0.100</text><text x="704.0" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 2</text><text x="704.0" y="276" text-anchor="middle" font-size="14" font-weight="700" fill="#111">W_xh (стало)</text><text x="782" y="132" font-size="13" fill="#5E5850">&lt;BOS&gt;</text><text x="782" y="168" font-size="13" fill="#5E5850">you</text><text x="782" y="204" font-size="13" fill="#5E5850">will</text><text x="782" y="240" font-size="13" fill="#5E5850">pass</text><rect x="60" y="310" width="360" height="90" rx="12" class="formula-bg"/><text x="240" y="342" text-anchor="middle" class="v-small">Loss до шага</text><text x="240" y="372" text-anchor="middle" font-size="20" fill="#C30B0A">ℒ = 1.5192</text><path d="M430 355 L470 355" class="edge-green" marker-end="url(#gd-arrow2)"/><rect x="500" y="310" width="360" height="90" rx="12" class="formula-bg"/><text x="680" y="342" text-anchor="middle" class="v-small">Loss после шага (та же фраза)</text><text x="680" y="372" text-anchor="middle" font-size="20" fill="#73B222">ℒ = 1.3478</text></g>
<g data-key="gd-hl" data-only="1"><rect x="150" y="218" width="128" height="36" fill="#D83BB9" fill-opacity="0.3" stroke="#D83BB9" stroke-width="2.2"/><rect x="390" y="218" width="128" height="36" fill="#D83BB9" fill-opacity="0.3" stroke="#D83BB9" stroke-width="2.2"/><rect x="640" y="218" width="128" height="36" fill="#D83BB9" fill-opacity="0.3" stroke="#D83BB9" stroke-width="2.2"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="gd-base" data-focus="gd-base"><div class="step-kicker">Шаг 1 · вся матрица</div><h4>W_xh ← W_xh − η·dW_xh</h4><p>Каждая из восьми клеток обновляется независимо: из старого веса вычитается <span class="math-inline" data-tex="\eta=0{,}5"></span> градиента. Loss на той же фразе падает с 1,5192 до 1,3478.</p></div>
    <div class="step-panel" data-on="gd-base gd-hl" data-focus="gd-hl"><div class="step-kicker">Шаг 2 · одна строка</div><h4>Строка pass не сдвинулась</h4><p>Клетки <span class="math-inline" data-tex="W_{xh}"></span> для pass: <span class="math-inline" data-tex="0{,}7-0{,}5\cdot0=0{,}7"></span> и <span class="math-inline" data-tex="0{,}1-0{,}5\cdot0=0{,}1"></span>. Меняются только веса, через которые прошёл сигнал в forward: у первых трёх строк сдвиг ровно <span class="math-inline" data-tex="-\eta\,\delta_t"></span>.</p></div>
  </div>
</div>
<p class="stage-hint">W_hh, W_hy, b_h и b_y обновляются точно так же — вычитанием η, умноженного на их градиент.</p>

<div class="callout">
  <strong>Градиент верен, шаг работает.</strong> Мы провели фразу вперёд до loss,
  вернули производную назад по времени до каждого веса, сверили её с численной и
  сделали шаг обучения. Это полный цикл, из которого состоит обучение любой
  рекуррентной сети — только скрытое состояние там в сотни раз шире, а фраз миллионы.
</div>

---

## Часть 5. Затухающий градиент и клиппинг

<p>
  В четвёртой части вклад далёкого шага проходил через цепочку множителей
  <code>∂h<sup>t</sup>/∂h<sup>t−1</sup></code> — произведение якобианов. Оно ведёт
  себя как геометрическая прогрессия. Оценим его
  грубо сверху: производная <code>tanh</code> не больше единицы, поэтому всё
  упирается в спектральную норму <code>W<sub>hh</sub></code>.
</p>

<div class="math-display" data-tex="\left\| \frac{\partial h_T}{\partial h_k} \right\| \;\le\; \left(\left\| W_{hh}\right\|\right)^{T-k}"></div>

<p>
  Если норма меньше единицы, градиент затухает экспоненциально — сеть учит только
  короткие зависимости. Если больше — взрывается, и один батч может разрушить
  все накопленные веса. Заметьте асимметрию: затухание портит обучение тихо, а
  взрыв виден сразу по <code>NaN</code> в loss.
</p>

<p>
  Обозначим через <span class="math-inline" data-tex="\gamma"></span> усиление
  одного такта — норму одного якобиана. Тогда через <code>k</code> шагов назад
  градиент умножается примерно на
  <span class="math-inline" data-tex="\gamma^{k}"></span>. Подвигайте
  <span class="math-inline" data-tex="\gamma"></span> и посмотрите, что
  происходит с этим множителем: шкала по вертикали логарифмическая, каждая
  клетка — три порядка.
</p>

<div class="stage slider-stage" id="stageDecay" tabindex="0">
<div class="slider-grid">
<div class="stage-figure">
<svg id="rnDecay" viewBox="0 0 680 420" role="img" aria-label="Накопленный множитель градиента в зависимости от числа шагов назад">
<rect x="80" y="234" width="568" height="116" fill="#FFF4F4"></rect>
<line x1="80" y1="350" x2="648" y2="350" class="rn-axis"></line>
<line x1="80" y1="50" x2="80" y2="350" class="rn-axis"></line>
<line x1="80" y1="118" x2="648" y2="118" stroke="#5E5850" stroke-width="1.5" stroke-dasharray="7 5"></line>
<line x1="80" y1="176" x2="648" y2="176" class="rn-grid"></line>
<line x1="80" y1="234" x2="648" y2="234" class="rn-grid"></line>
<line x1="80" y1="292" x2="648" y2="292" class="rn-grid"></line>
<text x="70" y="65" text-anchor="end" class="rn-tick">10³</text>
<text x="70" y="123" text-anchor="end" class="rn-tick">1</text>
<text x="70" y="181" text-anchor="end" class="rn-tick">10⁻³</text>
<text x="70" y="239" text-anchor="end" class="rn-tick">10⁻⁶</text>
<text x="70" y="297" text-anchor="end" class="rn-tick">10⁻⁹</text>
<text x="70" y="355" text-anchor="end" class="rn-tick">10⁻¹²</text>
<text x="80" y="376" text-anchor="middle" class="rn-tick">1</text>
<text x="364" y="376" text-anchor="middle" class="rn-tick">10</text>
<text x="648" y="376" text-anchor="middle" class="rn-tick">20</text>
<text x="648" y="400" text-anchor="end" class="rn-cap">шагов назад во времени</text>
<text x="96" y="252" font-size="13" fill="#A30908">ниже этой полосы градиент практически не отличим от нуля</text>
<path id="rnDecayCurve" fill="none" stroke="#C30B0A" stroke-width="4" stroke-linecap="round"></path>
<circle id="rnDecayDot" cx="648" cy="234" r="8" fill="#C30B0A" stroke="#fff" stroke-width="3"></circle>
</svg>
</div>
<div class="slider-panel">
<label class="range-label" for="rnDecayRange">Усиление такта γ</label>
<input id="rnDecayRange" type="range" min="0.3" max="1.4" step="0.01" value="0.49">
<div id="rnDecayG" class="live-number">0.49</div>
<div class="live-caption">норма одного якобиана; в нашем примере ≈ 0.49</div>
<div id="rnDecayM" class="live-number small" style="color:#A30908">8·10⁻⁷</div>
<div class="live-caption">множитель через 20 тактов</div>
<div id="rnDecayK" class="live-number small">20</div>
<div class="live-caption">через столько тактов сигнал падает ниже 10⁻⁶</div>
</div>
</div>
</div>
<p class="stage-hint">Граница между «учится» и «не учится» очень узкая: γ = 0.9 держит сигнал полтора десятка тактов, γ = 1.1 за то же время усиливает его почти в семь раз.</p>

<div class="callout-red">
  <strong>Почему нельзя просто выставить γ = 1.</strong> Усиление зависит не
  только от весов, но и от состояния: множитель <code>1 − h²</code> меняется на
  каждом такте и на каждой координате. Ровная единица недостижима, а любое
  устойчивое отклонение экспоненциально накапливается. Воротные ячейки решают
  это иначе — они добавляют путь, где состояние переносится сложением, без
  умножения на матрицу.
</div>

<table class="shape-table">
  <tr><th>Проблема</th><th>Симптом</th><th>Стандартное лечение</th></tr>
  <tr><td>Взрыв градиента</td><td>loss скачет или становится <code>NaN</code></td><td>gradient clipping по норме</td></tr>
  <tr><td>Затухание градиента</td><td>loss падает и застревает; длинный контекст игнорируется</td><td>LSTM / GRU, residual-связи</td></tr>
  <tr><td>Длинная последовательность</td><td>обратный ход не помещается в память</td><td>truncated BPTT</td></tr>
</table>

<div class="callout-yellow">
  <strong>Gradient clipping в одну строку.</strong> Перед шагом оптимизатора
  градиент масштабируют, если его норма превысила порог:
  <code>torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)</code>.
  Направление сохраняется, длина ограничивается — это дёшево и почти всегда
  включено при обучении RNN.
</div>

### Truncated BPTT

<p>
  Для последовательности из десятков тысяч шагов нельзя ни хранить все
  <code>h<sub>t</sub></code>, ни разворачивать граф целиком. Решение —
  усечённый обратный ход: forward идёт непрерывно, а backward ограничивается
  окном в <code>k</code> шагов. Состояние между окнами передаётся, но отвязывается
  от графа (<code>h = h.detach()</code>).
</p>

<div class="callout-blue">
  <strong>Что именно теряется.</strong> Усечение не мешает сети <em>использовать</em>
  далёкий контекст на прямом ходе — <code>h</code> продолжает нести информацию.
  Оно мешает <em>научиться</em> зависимостям длиннее окна: градиент за границу
  окна не проходит. Впрочем, из-за затухания он всё равно почти не проходил.
</div>


---

## Часть 6. Формы тензоров и трюк с конкатенацией

<p>
  Прежде чем переходить к коду, соберём в одном месте формы всех тензоров — по
  ним проще всего проверять любую реализацию. На одном шаге времени ячейка получает два входа: текущий вектор
  <span class="math-inline" data-tex="\mathbf x_t"></span> формы
  <span class="math-inline" data-tex="[B,E]"></span> и прошлое скрытое состояние
  <span class="math-inline" data-tex="\mathbf h_{t-1}"></span> формы
  <span class="math-inline" data-tex="[B,H]"></span>. Здесь
  <span class="math-inline" data-tex="B"></span> — размер батча,
  <span class="math-inline" data-tex="E"></span> — ширина входного вектора,
  <span class="math-inline" data-tex="H"></span> — размер памяти, а
  <span class="math-inline" data-tex="O"></span> — размер выхода.
</p>

<div class="callout-blue">
  <strong>Про числа на схеме.</strong> Используем сквозной пример статьи:
  <span class="math-inline" data-tex="B=1,\;E=4,\;H=2,\;O=4"></span>.
  Буквенная форма показывает общее правило, а числовая под каждым тензором —
  как это правило выглядит именно в нашем примере.
</div>

<p>
  Два произведения обязаны закончиться одной формой
  <span class="math-inline" data-tex="[B,H]"></span>, потому что дальше они
  складываются поэлементно. Bias имеет форму
  <span class="math-inline" data-tex="[1,H]"></span> и автоматически
  распространяется по строкам батча. После <span class="math-inline" data-tex="\tanh"></span>
  форма не меняется.
</p>

<div class="math-display" data-tex="\mathbf h_t=\tanh\!\left(\mathbf x_t\mathbf W_{xh}+\mathbf h_{t-1}\mathbf W_{hh}+\mathbf b_h\right)"></div>

<style>
  .rnn-shape-strip { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:22px 0; }
  .rnn-shape-card { min-width:0; background:#fff; border:1px solid #E4E1D7; border-radius:11px; padding:13px 14px; }
  .rnn-shape-card > span { display:block; font-size:11px; color:#5E5850; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
  .rnn-shape-card .math-display { margin:8px 0 2px; font-size:14px; }
  .rnn-shape-note { color:#5E5850; font-size:14px; line-height:1.5; }
  @media (max-width:760px) { .rnn-shape-strip { grid-template-columns:1fr; } }
</style>

<div class="stage" id="stageRnnDims" tabindex="0" aria-label="Размерности тензоров RNN и конкатенация">
  <div class="stage-figure">
    <svg id="rnDims" viewBox="0 0 960 1320" role="img" aria-label="Размерности тензоров RNN: два отдельных умножения, сложение, конкатенация, выходной слой и ось времени">
<style>
  #rnDims text { font-family: Helvetica, Arial, sans-serif; }
  #rnDims .ttl { font-size: 19px; font-weight: 800; fill: #111111; letter-spacing: -0.01em; }
  #rnDims .sub { font-size: 13px; fill: #5E5850; }
  #rnDims .cap { font-size: 13px; font-weight: 700; fill: #5E5850; letter-spacing: .06em; text-transform: uppercase; }
  #rnDims .dim { font-size: 13px; fill: #5E5850; }
  #rnDims .nm  { font-size: 15px; font-weight: 700; }
  #rnDims .op  { font-size: 20px; fill: #5E5850; }
  #rnDims .arw { font-size: 13px; fill: #5E5850; }
  #rnDims .note { font-size: 12.5px; fill: #5E5850; }
  #rnDims .leg { font-size: 13px; }
  #rnDims .split { stroke: #FFFFFF; stroke-width: 2.2; }
  #rnDims .dash { stroke: #8B8175; stroke-width: 1.4; stroke-dasharray: 5 4; }
</style>
<defs>
  <marker id="rnd-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
    <path d="M0,0 L10,5 L0,10 Z" fill="#5E5850"></path>
  </marker>
</defs>
<text x="36" y="34" class="ttl">RNN: размерности одного шага и трюк с конкатенацией</text>
<text x="36" y="56" class="sub">Сверху у матрицы — число столбцов, слева — число строк. Под именем — числовая форма для B=1, E=4, H=2, O=4.</text>
<g data-key="rd-setup"><rect x="36" y="68" width="888" height="82" rx="12" fill="#FBFAF7" stroke="#B7B0A7" stroke-width="1.5"></rect><foreignObject x="54" y="78" width="852" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="\mathbf x_t\in\mathbb R^{B\times E},\quad \mathbf h_{t-1}\in\mathbb R^{B\times H},\quad \mathbf W_{xh}\in\mathbb R^{E\times H},\quad \mathbf W_{hh}\in\mathbb R^{H\times H}"></div></foreignObject><foreignObject x="54" y="107" width="852" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="\mathbf b_h\in\mathbb R^{1\times H},\quad \mathbf W_{hy}\in\mathbb R^{H\times O},\quad B=1,\;E=4,\;H=2,\;O=4"></div></foreignObject></g><text x="36" y="181" class="cap">Один шаг RNN · два независимых вклада одинаковой формы</text><g data-key="rd-xpath"><rect x="60" y="238" width="88" height="22" rx="0" fill="#73B222"></rect><line x1="82" y1="238" x2="82" y2="260" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="104" y1="238" x2="104" y2="260" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="126" y1="238" x2="126" y2="260" stroke="#FFFFFF" stroke-width="1.6"></line><text x="104.0" y="228" text-anchor="middle" class="dim">E</text><text x="44" y="254.0" text-anchor="middle" class="dim">B</text><text x="104.0" y="302" text-anchor="middle" class="nm" fill="#4C7A16">xₜ</text><foreignObject x="60.0" y="310" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,4]"></div></foreignObject><text x="169" y="239" text-anchor="middle" class="op">·</text><rect x="194" y="205" width="44" height="88" rx="0" fill="#7B4AB5"></rect><line x1="216" y1="205" x2="216" y2="293" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="194" y1="227" x2="238" y2="227" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="194" y1="249" x2="238" y2="249" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="194" y1="271" x2="238" y2="271" stroke="#FFFFFF" stroke-width="1.6"></line><text x="216.0" y="195" text-anchor="middle" class="dim">H</text><text x="178" y="254.0" text-anchor="middle" class="dim">E</text><text x="216.0" y="302" text-anchor="middle" class="nm" fill="#7B4AB5">Wₓₕ</text><foreignObject x="172.0" y="310" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[4,2]"></div></foreignObject><text x="270" y="239" text-anchor="middle" class="op">=</text><rect x="302" y="238" width="44" height="22" rx="0" fill="#C29E08"></rect><line x1="324" y1="238" x2="324" y2="260" stroke="#FFFFFF" stroke-width="1.6"></line><text x="324.0" y="228" text-anchor="middle" class="dim">H</text><text x="286" y="254.0" text-anchor="middle" class="dim">B</text><text x="324.0" y="302" text-anchor="middle" class="nm" fill="#8C7106">uₜ</text><foreignObject x="280.0" y="310" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="324" y="277" text-anchor="middle" class="note">вклад токена</text></g><g data-key="rd-hpath"><rect x="450" y="238" width="44" height="22" rx="0" fill="#1B9BC2"></rect><line x1="472" y1="238" x2="472" y2="260" stroke="#FFFFFF" stroke-width="1.6"></line><text x="472.0" y="228" text-anchor="middle" class="dim">H</text><text x="434" y="254.0" text-anchor="middle" class="dim">B</text><text x="472.0" y="302" text-anchor="middle" class="nm" fill="#147B9A">hₜ₋₁</text><foreignObject x="428.0" y="310" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="510" y="239" text-anchor="middle" class="op">·</text><rect x="542" y="227" width="44" height="44" rx="0" fill="#7B4AB5"></rect><line x1="564" y1="227" x2="564" y2="271" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="542" y1="249" x2="586" y2="249" stroke="#FFFFFF" stroke-width="1.6"></line><text x="564.0" y="217" text-anchor="middle" class="dim">H</text><text x="526" y="254.0" text-anchor="middle" class="dim">H</text><text x="564.0" y="302" text-anchor="middle" class="nm" fill="#7B4AB5">Wₕₕ</text><foreignObject x="520.0" y="310" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[2,2]"></div></foreignObject><text x="616" y="239" text-anchor="middle" class="op">=</text><rect x="648" y="238" width="44" height="22" rx="0" fill="#C29E08"></rect><line x1="670" y1="238" x2="670" y2="260" stroke="#FFFFFF" stroke-width="1.6"></line><text x="670.0" y="228" text-anchor="middle" class="dim">H</text><text x="632" y="254.0" text-anchor="middle" class="dim">B</text><text x="670.0" y="302" text-anchor="middle" class="nm" fill="#8C7106">rₜ</text><foreignObject x="626.0" y="310" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="670" y="277" text-anchor="middle" class="note">вклад памяти</text></g><text x="36" y="367" class="cap">Сложение · bias броадкастится по батчу · tanh не меняет форму</text><g data-key="rd-sum"><rect x="60" y="405" width="44" height="22" rx="0" fill="#C29E08"></rect><line x1="82" y1="405" x2="82" y2="427" stroke="#FFFFFF" stroke-width="1.6"></line><text x="82.0" y="395" text-anchor="middle" class="dim">H</text><text x="44" y="421.0" text-anchor="middle" class="dim">B</text><text x="82.0" y="467" text-anchor="middle" class="nm" fill="#8C7106">uₜ</text><foreignObject x="38.0" y="475" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="126" y="424" text-anchor="middle" class="op">+</text><rect x="158" y="405" width="44" height="22" rx="0" fill="#C29E08"></rect><line x1="180" y1="405" x2="180" y2="427" stroke="#FFFFFF" stroke-width="1.6"></line><text x="180.0" y="395" text-anchor="middle" class="dim">H</text><text x="142" y="421.0" text-anchor="middle" class="dim">B</text><text x="180.0" y="467" text-anchor="middle" class="nm" fill="#8C7106">rₜ</text><foreignObject x="136.0" y="475" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="224" y="424" text-anchor="middle" class="op">+</text><rect x="256" y="405" width="44" height="22" rx="0" fill="#7B4AB5"></rect><line x1="278" y1="405" x2="278" y2="427" stroke="#FFFFFF" stroke-width="1.6"></line><text x="278.0" y="395" text-anchor="middle" class="dim">H</text><text x="240" y="421.0" text-anchor="middle" class="dim">1</text><text x="278.0" y="467" text-anchor="middle" class="nm" fill="#7B4AB5">bₕ</text><foreignObject x="234.0" y="475" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="322" y="424" text-anchor="middle" class="op">=</text><rect x="354" y="405" width="44" height="22" rx="0" fill="#C29E08"></rect><line x1="376" y1="405" x2="376" y2="427" stroke="#FFFFFF" stroke-width="1.6"></line><text x="376.0" y="395" text-anchor="middle" class="dim">H</text><text x="338" y="421.0" text-anchor="middle" class="dim">B</text><text x="376.0" y="467" text-anchor="middle" class="nm" fill="#8C7106">aₜ</text><foreignObject x="332.0" y="475" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><path d="M408 416 L492 416" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#rnd-arw)"></path><text x="450" y="404" text-anchor="middle" class="arw">tanh</text><rect x="516" y="405" width="44" height="22" rx="0" fill="#1B9BC2"></rect><line x1="538" y1="405" x2="538" y2="427" stroke="#FFFFFF" stroke-width="1.6"></line><text x="538.0" y="395" text-anchor="middle" class="dim">H</text><text x="500" y="421.0" text-anchor="middle" class="dim">B</text><text x="538.0" y="467" text-anchor="middle" class="nm" fill="#147B9A">hₜ</text><foreignObject x="494.0" y="475" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="590" y="420" class="note">форма остаётся [B,H]</text></g><text x="36" y="518" class="cap">Конкатенация · склеиваем признаки, а не складываем их</text><g data-key="rd-concat"><rect x="60" y="600" width="88" height="22" fill="#73B222"></rect><rect x="148" y="600" width="44" height="22" fill="#1B9BC2"></rect><line x1="82" y1="600" x2="82" y2="622" class="split"></line><line x1="104" y1="600" x2="104" y2="622" class="split"></line><line x1="126" y1="600" x2="126" y2="622" class="split"></line><line x1="148" y1="600" x2="148" y2="622" class="split"></line><line x1="170" y1="600" x2="170" y2="622" class="split"></line><text x="126" y="590" text-anchor="middle" class="dim">E + H</text><text x="44" y="617" text-anchor="middle" class="dim">B</text><text x="126" y="675" text-anchor="middle" class="nm" fill="#3576C0">cₜ = [xₜ | hₜ₋₁]</text><foreignObject x="82" y="683" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,6]"></div></foreignObject><text x="104" y="642" text-anchor="middle" class="note" fill="#4C7A16">E</text><text x="170" y="642" text-anchor="middle" class="note" fill="#147B9A">H</text><text x="222" y="619" text-anchor="middle" class="op">·</text><rect x="260" y="545" width="44" height="88" rx="0" fill="#7B4AB5"></rect><line x1="282" y1="545" x2="282" y2="633" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="260" y1="567" x2="304" y2="567" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="260" y1="589" x2="304" y2="589" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="260" y1="611" x2="304" y2="611" stroke="#FFFFFF" stroke-width="1.6"></line><rect x="260" y="633" width="44" height="44" rx="0" fill="#9B6BC7"></rect><line x1="282" y1="633" x2="282" y2="677" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="260" y1="655" x2="304" y2="655" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="260" y1="633" x2="304" y2="633" stroke="#FFFFFF" stroke-width="3"></line><text x="282" y="535" text-anchor="middle" class="dim">H</text><text x="243" y="616" text-anchor="middle" class="dim">E + H</text><text x="314" y="592" class="note">Wₓₕ</text><text x="314" y="659" class="note">Wₕₕ</text><text x="282" y="693" text-anchor="middle" class="nm" fill="#7B4AB5">W꜀</text><foreignObject x="238" y="701" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[6,2]"></div></foreignObject></g><g data-key="rd-fused"><text x="368" y="619" text-anchor="middle" class="op">+</text><rect x="400" y="600" width="44" height="22" rx="0" fill="#7B4AB5"></rect><line x1="422" y1="600" x2="422" y2="622" stroke="#FFFFFF" stroke-width="1.6"></line><text x="422.0" y="590" text-anchor="middle" class="dim">H</text><text x="384" y="616.0" text-anchor="middle" class="dim">1</text><text x="422.0" y="675" text-anchor="middle" class="nm" fill="#7B4AB5">bₕ</text><foreignObject x="378.0" y="683" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="466" y="619" text-anchor="middle" class="op">=</text><rect x="498" y="600" width="44" height="22" rx="0" fill="#C29E08"></rect><line x1="520" y1="600" x2="520" y2="622" stroke="#FFFFFF" stroke-width="1.6"></line><text x="520.0" y="590" text-anchor="middle" class="dim">H</text><text x="482" y="616.0" text-anchor="middle" class="dim">B</text><text x="520.0" y="675" text-anchor="middle" class="nm" fill="#8C7106">aₜ</text><foreignObject x="476.0" y="683" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><path d="M552 611 L636 611" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#rnd-arw)"></path><text x="594" y="599" text-anchor="middle" class="arw">tanh</text><rect x="660" y="600" width="44" height="22" rx="0" fill="#1B9BC2"></rect><line x1="682" y1="600" x2="682" y2="622" stroke="#FFFFFF" stroke-width="1.6"></line><text x="682.0" y="590" text-anchor="middle" class="dim">H</text><text x="644" y="616.0" text-anchor="middle" class="dim">B</text><text x="682.0" y="675" text-anchor="middle" class="nm" fill="#147B9A">hₜ</text><foreignObject x="638.0" y="683" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="760" y="605" class="note">одно матричное</text><text x="760" y="624" class="note">умножение вместо</text><text x="760" y="643" class="note">суммы двух произведений</text></g><text x="36" y="758" class="cap">Выходной слой · обычное линейное преобразование скрытого состояния</text><g data-key="rd-output"><rect x="60" y="810" width="44" height="22" rx="0" fill="#1B9BC2"></rect><line x1="82" y1="810" x2="82" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><text x="82.0" y="800" text-anchor="middle" class="dim">H</text><text x="44" y="826.0" text-anchor="middle" class="dim">B</text><text x="82.0" y="884" text-anchor="middle" class="nm" fill="#147B9A">hₜ</text><foreignObject x="38.0" y="892" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject><text x="126" y="829" text-anchor="middle" class="op">·</text><rect x="160" y="799" width="88" height="44" rx="0" fill="#7B4AB5"></rect><line x1="182" y1="799" x2="182" y2="843" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="204" y1="799" x2="204" y2="843" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="226" y1="799" x2="226" y2="843" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="160" y1="821" x2="248" y2="821" stroke="#FFFFFF" stroke-width="1.6"></line><text x="204.0" y="789" text-anchor="middle" class="dim">O</text><text x="144" y="826.0" text-anchor="middle" class="dim">H</text><text x="204.0" y="884" text-anchor="middle" class="nm" fill="#7B4AB5">Wₕᵧ</text><foreignObject x="160.0" y="892" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[2,4]"></div></foreignObject><text x="270" y="829" text-anchor="middle" class="op">+</text><rect x="302" y="810" width="88" height="22" rx="0" fill="#7B4AB5"></rect><line x1="324" y1="810" x2="324" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="346" y1="810" x2="346" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="368" y1="810" x2="368" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><text x="346.0" y="800" text-anchor="middle" class="dim">O</text><text x="286" y="826.0" text-anchor="middle" class="dim">1</text><text x="346.0" y="884" text-anchor="middle" class="nm" fill="#7B4AB5">bᵧ</text><foreignObject x="302.0" y="892" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,4]"></div></foreignObject><text x="412" y="829" text-anchor="middle" class="op">=</text><rect x="444" y="810" width="88" height="22" rx="0" fill="#C29E08"></rect><line x1="466" y1="810" x2="466" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="488" y1="810" x2="488" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="510" y1="810" x2="510" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><text x="488.0" y="800" text-anchor="middle" class="dim">O</text><text x="428" y="826.0" text-anchor="middle" class="dim">B</text><text x="488.0" y="884" text-anchor="middle" class="nm" fill="#8C7106">zₜ</text><foreignObject x="444.0" y="892" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,4]"></div></foreignObject><path d="M542 821 L626 821" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#rnd-arw)"></path><text x="584" y="809" text-anchor="middle" class="arw">softmax</text><rect x="650" y="810" width="88" height="22" rx="0" fill="#3576C0"></rect><line x1="672" y1="810" x2="672" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="694" y1="810" x2="694" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="716" y1="810" x2="716" y2="832" stroke="#FFFFFF" stroke-width="1.6"></line><text x="694.0" y="800" text-anchor="middle" class="dim">O</text><text x="634" y="826.0" text-anchor="middle" class="dim">B</text><text x="694.0" y="884" text-anchor="middle" class="nm" fill="#3576C0">pₜ</text><foreignObject x="650.0" y="892" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,4]"></div></foreignObject></g><text x="36" y="968" class="cap">Полная последовательность · ось времени хранится снаружи ячейки</text><g data-key="rd-seq"><rect x="76" y="1018" width="88" height="66" rx="0" fill="#73B222"></rect><line x1="98" y1="1018" x2="98" y2="1084" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="120" y1="1018" x2="120" y2="1084" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="142" y1="1018" x2="142" y2="1084" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="76" y1="1040" x2="164" y2="1040" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="76" y1="1062" x2="164" y2="1062" stroke="#FFFFFF" stroke-width="1.6"></line><text x="120" y="1008" text-anchor="middle" class="dim">E</text><text x="58" y="1055" text-anchor="middle" class="dim">T·B</text><text x="120" y="1108" text-anchor="middle" class="nm" fill="#4C7A16">X</text><foreignObject x="76" y="1116" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[3,1,4]"></div></foreignObject><text x="182" y="1037" class="note">t = 1</text><text x="182" y="1059" class="note">t = 2</text><text x="182" y="1081" class="note">t = 3</text><path d="M240 1051 L330 1051" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#rnd-arw)"></path><text x="285" y="1038" text-anchor="middle" class="arw">RNN по t</text><rect x="366" y="1018" width="44" height="66" rx="0" fill="#1B9BC2"></rect><line x1="388" y1="1018" x2="388" y2="1084" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="366" y1="1040" x2="410" y2="1040" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="366" y1="1062" x2="410" y2="1062" stroke="#FFFFFF" stroke-width="1.6"></line><text x="388" y="1008" text-anchor="middle" class="dim">H</text><text x="348" y="1055" text-anchor="middle" class="dim">T·B</text><text x="388" y="1108" text-anchor="middle" class="nm" fill="#147B9A">H</text><foreignObject x="344" y="1116" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[3,1,2]"></div></foreignObject><path d="M448 1051 L538 1051" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#rnd-arw)"></path><text x="493" y="1038" text-anchor="middle" class="arw">Wₕᵧ</text><rect x="574" y="1018" width="88" height="66" rx="0" fill="#3576C0"></rect><line x1="596" y1="1018" x2="596" y2="1084" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="618" y1="1018" x2="618" y2="1084" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="640" y1="1018" x2="640" y2="1084" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="574" y1="1040" x2="662" y2="1040" stroke="#FFFFFF" stroke-width="1.6"></line><line x1="574" y1="1062" x2="662" y2="1062" stroke="#FFFFFF" stroke-width="1.6"></line><text x="618" y="1008" text-anchor="middle" class="dim">O</text><text x="556" y="1055" text-anchor="middle" class="dim">T·B</text><text x="618" y="1108" text-anchor="middle" class="nm" fill="#3576C0">P</text><foreignObject x="574" y="1116" width="88" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[3,1,4]"></div></foreignObject><text x="708" y="1035" class="note">На каждом шаге ячейка видит</text><text x="708" y="1055" class="note">только срез xₜ: [B,E].</text><text x="708" y="1075" class="note">Ось T появляется, когда</text><text x="708" y="1095" class="note">складываем все шаги обратно.</text></g><g data-key="rd-rule"><rect x="36" y="1160" width="888" height="118" rx="12" fill="#F3FAF0" stroke="#73B222" stroke-width="1.5"></rect><text x="56" y="1186" class="cap" fill="#4C7A16">Проверка форм</text><foreignObject x="54" y="1195" width="852" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="\underbrace{[B,E]}_{\mathbf x_t}\underbrace{[E,H]}_{\mathbf W_{xh}}+\underbrace{[B,H]}_{\mathbf h_{t-1}}\underbrace{[H,H]}_{\mathbf W_{hh}}\;=\;\underbrace{[B,H]}_{\mathbf a_t}"></div></foreignObject><foreignObject x="54" y="1227" width="852" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="\underbrace{[B,E+H]}_{[\mathbf x_t\mid\mathbf h_{t-1}]}\underbrace{[E+H,H]}_{[\mathbf W_{xh};\mathbf W_{hh}]}\;=\;\underbrace{[B,H]}_{\mathbf a_t}"></div></foreignObject></g><text x="36" y="1305" class="leg"><tspan fill="#73B222">входные данные</tspan><tspan fill="#5E5850">  ·  </tspan><tspan fill="#1B9BC2">скрытое состояние</tspan><tspan fill="#5E5850">  ·  </tspan><tspan fill="#7B4AB5">параметры</tspan><tspan fill="#5E5850">  ·  </tspan><tspan fill="#C29E08">линейные суммы</tspan><tspan fill="#5E5850">  ·  </tspan><tspan fill="#3576C0">вероятности</tspan></text></svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <div class="stage-progress" aria-hidden="true"></div>
    <span class="stage-counter"></span>
    <button type="button" data-nav="next">Далее →</button>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="rd-setup rd-xpath" data-focus="rd-setup rd-xpath">
      <div class="step-kicker">Шаг 1 · фиксируем оси</div>
      <h4>Вход задаёт E, память задаёт H</h4>
      <div class="math-display" data-tex="\mathbf x_t:[B,E],\qquad \mathbf h_{t-1}:[B,H],\qquad \mathbf W_{xh}:[E,H]"></div>
      <p>Строка — один объект батча. У <span class="math-inline" data-tex="\mathbf x_t"></span> по <span class="math-inline" data-tex="E"></span> входных чисел, а у скрытого состояния — по <span class="math-inline" data-tex="H"></span> чисел памяти. Матрица <span class="math-inline" data-tex="\mathbf W_{xh}"></span> должна принять ось <span class="math-inline" data-tex="E"></span> и открыть ось <span class="math-inline" data-tex="H"></span>.</p>
    </div>
    <div class="step-panel" data-on="rd-xpath" data-focus="rd-xpath">
      <div class="step-kicker">Шаг 2 · вклад текущего входа</div>
      <h4>Умножение съедает E и возвращает H чисел</h4>
      <div class="math-display" data-tex="\underbrace{[B,E]}_{\mathbf x_t}\underbrace{[E,H]}_{\mathbf W_{xh}}\longrightarrow\underbrace{[B,H]}_{\mathbf u_t},\qquad [1,4][4,2]\to[1,2]"></div>
      <p>Внутренние размерности <span class="math-inline" data-tex="E"></span> совпадают и исчезают. Наружу выходят <span class="math-inline" data-tex="B"></span> строк по <span class="math-inline" data-tex="H"></span> чисел — вклад текущего токена в новое состояние.</p>
    </div>
    <div class="step-panel" data-on="rd-hpath" data-focus="rd-hpath">
      <div class="step-kicker">Шаг 3 · вклад памяти</div>
      <h4>Wₕₕ обязана быть квадратной</h4>
      <div class="math-display" data-tex="\underbrace{[B,H]}_{\mathbf h_{t-1}}\underbrace{[H,H]}_{\mathbf W_{hh}}\longrightarrow\underbrace{[B,H]}_{\mathbf r_t},\qquad [1,2][2,2]\to[1,2]"></div>
      <p>Состояние после преобразования снова должно иметь ширину <span class="math-inline" data-tex="H"></span>, иначе его нельзя было бы вернуть в ту же ячейку на следующем шаге. Поэтому рекуррентная матрица имеет форму <span class="math-inline" data-tex="[H,H]"></span>.</p>
    </div>
    <div class="step-panel" data-on="rd-xpath rd-hpath rd-sum" data-focus="rd-sum">
      <div class="step-kicker">Шаг 4 · сложение и tanh</div>
      <h4>Складывать можно только тензоры одной формы</h4>
      <div class="math-display" data-tex="\mathbf a_t=\mathbf u_t+\mathbf r_t+\mathbf b_h:[B,H],\qquad \mathbf h_t=\tanh(\mathbf a_t):[B,H]"></div>
      <p>Оба произведения дали <span class="math-inline" data-tex="[B,H]"></span>. Bias хранится как одна строка <span class="math-inline" data-tex="[1,H]"></span> и копируется логически для каждой строки батча. <span class="math-inline" data-tex="\tanh"></span> применяется поэлементно, поэтому меняет значения, но не форму.</p>
    </div>
    <div class="step-panel" data-on="rd-concat" data-focus="rd-concat">
      <div class="step-kicker">Шаг 5 · конкатенация</div>
      <h4>Входы склеиваются по последней оси, веса — по строкам</h4>
      <div class="math-display" data-tex="\mathbf c_t=[\mathbf x_t\mid\mathbf h_{t-1}]:[B,E+H],\qquad \mathbf W_c=\begin{bmatrix}\mathbf W_{xh}\\\mathbf W_{hh}\end{bmatrix}:[E+H,H]"></div>
      <p>Конкатенация не складывает числа. Она просто приписывает <span class="math-inline" data-tex="H"></span> координат памяти справа к <span class="math-inline" data-tex="E"></span> координатам входа. Поэтому <span class="math-inline" data-tex="[1,4]"></span> и <span class="math-inline" data-tex="[1,2]"></span> превращаются в <span class="math-inline" data-tex="[1,6]"></span>. Матрицы весов ставятся вертикально: <span class="math-inline" data-tex="[4,2]"></span> над <span class="math-inline" data-tex="[2,2]"></span> дают <span class="math-inline" data-tex="[6,2]"></span>.</p>
    </div>
    <div class="step-panel" data-on="rd-concat rd-fused rd-rule" data-focus="rd-fused rd-rule">
      <div class="step-kicker">Шаг 6 · одно объединённое умножение</div>
      <h4>Блочное умножение раскрывается обратно в сумму двух вкладов</h4>
      <div class="math-display" data-tex="[\mathbf x_t\mid\mathbf h_{t-1}]\begin{bmatrix}\mathbf W_{xh}\\\mathbf W_{hh}\end{bmatrix}=\mathbf x_t\mathbf W_{xh}+\mathbf h_{t-1}\mathbf W_{hh}"></div>
      <p>По формам это <span class="math-inline" data-tex="[B,E+H][E+H,H]\to[B,H]"></span>; в числах — <span class="math-inline" data-tex="[1,6][6,2]\to[1,2]"></span>. Это та же математика, только два входа и две матрицы представлены как один большой вход и одна большая матрица.</p>
      <div class="callout-blue"><strong>Важно про библиотеки.</strong> Конкатенация — удобный способ увидеть эквивалентность форм. Реальные реализации могут хранить <span class="math-inline" data-tex="W_{ih}"></span> и <span class="math-inline" data-tex="W_{hh}"></span> отдельно и объединять вычисления внутри оптимизированного ядра.</div>
    </div>
    <div class="step-panel" data-on="rd-output" data-focus="rd-output">
      <div class="step-kicker">Шаг 7 · выходной слой</div>
      <h4>Рекуррентность закончилась: дальше обычный линейный слой</h4>
      <div class="math-display" data-tex="\underbrace{[B,H]}_{\mathbf h_t}\underbrace{[H,O]}_{\mathbf W_{hy}}+\underbrace{[1,O]}_{\mathbf b_y}\longrightarrow\underbrace{[B,O]}_{\mathbf z_t}\xrightarrow{softmax}\underbrace{[B,O]}_{\mathbf p_t}"></div>
      <p>Матрица <span class="math-inline" data-tex="\mathbf W_{hy}"></span> переводит память ширины <span class="math-inline" data-tex="H"></span> в <span class="math-inline" data-tex="O"></span> логитов. Softmax нормирует каждую строку отдельно и форму не меняет.</p>
    </div>
    <div class="step-panel" data-on="rd-seq rd-rule" data-focus="rd-seq rd-rule">
      <div class="step-kicker">Шаг 8 · от шага к последовательности</div>
      <h4>Ось T не участвует в одном умножении — она перебирается циклом</h4>
      <div class="math-display" data-tex="\mathbf X:[T,B,E],\qquad \mathbf H:[T,B,H],\qquad \mathbf P:[T,B,O]"></div>
      <p>В NumPy-коде статьи вход хранится как <span class="math-inline" data-tex="[T,B,E]"></span>. На шаге <span class="math-inline" data-tex="t"></span> берётся срез <span class="math-inline" data-tex="\mathbf X[t]:[B,E]"></span>, проходит через ячейку, а результаты всех шагов затем складываются обратно вдоль оси времени. Для <span class="math-inline" data-tex="T=3"></span> получаем <span class="math-inline" data-tex="[3,1,4]\to[3,1,2]\to[3,1,4]"></span>.</p>
      <p><strong>Главная проверка:</strong> соседние размерности при умножении совпадают, все слагаемые при сложении имеют одну форму, а поэлементные функции форму не меняют.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Переключайте шаги кнопками или стрелками клавиатуры. Под каждым тензором показана числовая форма для B=1, E=4, H=2, O=4.</p>

### Шпаргалка по формам одного шага

<div class="rnn-shape-strip">
  <div class="rnn-shape-card">
    <span>Два вклада</span>
    <div class="math-display" data-tex="[B,E][E,H]+[B,H][H,H]\to[B,H]"></div>
  </div>
  <div class="rnn-shape-card">
    <span>После конкатенации</span>
    <div class="math-display" data-tex="[B,E+H][E+H,H]\to[B,H]"></div>
  </div>
  <div class="rnn-shape-card">
    <span>Выходной слой</span>
    <div class="math-display" data-tex="[B,H][H,O]+[1,O]\to[B,O]"></div>
  </div>
</div>
<p class="rnn-shape-note">В первых двух карточках результат один и тот же: меняется только способ записи вычисления. Конкатенация объединяет оси признаков, но не меняет смысл отдельных блоков весов.</p>

### Чем приходится платить за большую память

<p>
  Из трёх матриц только <code>W<sub>hh</sub></code> квадратная, и это меняет
  арифметику. Две другие растут по <code>H</code> линейно, а память — как
  <code>H²</code>. Подвигайте размер скрытого состояния и посмотрите, с какого
  момента рекуррентная матрица начинает съедать почти все параметры ячейки.
</p>

<div class="math-display" data-tex="\#\text{params} = \underbrace{E H}_{W_{xh}} + \underbrace{H^2}_{W_{hh}} + \underbrace{H O}_{W_{hy}} + \underbrace{H + O}_{b_h,\; b_y}"></div>

<div class="stage slider-stage" id="stageParams" tabindex="0">
<div class="slider-grid">
<div class="stage-figure">
<svg id="rnParams" viewBox="0 0 680 372" role="img" aria-label="Число параметров ячейки RNN в зависимости от размера скрытого состояния">
<text x="36" y="32" class="rn-title">Из чего складываются параметры</text>
<text x="36" y="54" class="rn-cap">E = 4, O = 4 зафиксированы</text>
<text x="196" y="106" text-anchor="end" class="rn-tick">Wxh · [E, H]</text>
<rect id="rnBarXh" x="210" y="86" width="10" height="28" rx="5" fill="#E7D48A"></rect>
<text id="rnValXh" x="230" y="106" class="rn-mono">8</text>
<text x="196" y="170" text-anchor="end" class="rn-tick">Whh · [H, H]</text>
<rect id="rnBarHh" x="210" y="150" width="10" height="28" rx="5" fill="#C29E08"></rect>
<text id="rnValHh" x="230" y="170" class="rn-mono">4</text>
<text x="196" y="234" text-anchor="end" class="rn-tick">Why · [H, O]</text>
<rect id="rnBarHy" x="210" y="214" width="10" height="28" rx="5" fill="#E7D48A"></rect>
<text id="rnValHy" x="230" y="234" class="rn-mono">8</text>
<text x="196" y="298" text-anchor="end" class="rn-tick">bh, by</text>
<rect id="rnBarB" x="210" y="278" width="10" height="28" rx="5" fill="#D9D4C8"></rect>
<text id="rnValB" x="230" y="298" class="rn-mono">6</text>
<line x1="210" y1="70" x2="210" y2="318" class="rn-grid"></line>
<text x="36" y="352" font-size="13" fill="#5E5850">длина полосы — доля от самой большой величины на текущем H</text>
</svg>
</div>
<div class="slider-panel">
<label class="range-label" for="rnParamsRange">Размер памяти H</label>
<input id="rnParamsRange" type="range" min="1" max="32" step="1" value="2">
<div id="rnParamsH" class="live-number">2</div>
<div class="live-caption">длина скрытого состояния</div>
<div id="rnParamsTotal" class="live-number" style="color:#8C7106">26</div>
<div class="live-caption">всего обучаемых чисел в ячейке</div>
<div id="rnParamsShare" class="live-number small" style="color:#8C7106">15%</div>
<div class="live-caption">доля <code>W_hh</code> в этом количестве</div>
</div>
</div>
</div>
<p class="stage-hint">На <code>H = 2</code> из нашего примера рекуррентная матрица почти незаметна; на <code>H = 32</code> она уже больше всего остального вместе взятого.</p>

<div class="callout-blue">
  <strong>Почему это важно для длинных зависимостей.</strong> Хочется увеличить
  <code>H</code>, чтобы в память влезало больше контекста, — но цена растёт
  квадратично, и вместе с ней растёт то самое произведение якобианов из пятой
  части. Именно этот компромисс позже и решают воротные ячейки.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> квадратная форма <code>W<sub>hh</sub></code>
  — не деталь реализации, а суть конструкции. Состояние обязано возвращаться в
  себя того же размера, поэтому вся история сжимается в фиксированные
  <code>H</code> чисел.
</div>

---

## Часть 7. Код: от текстовой последовательности к PyTorch — три версии одной RNN

<p>
  Теперь соберём forward и BPTT в коде по той же структуре, что использовалась для
  логистической регрессии. Вместо табличных признаков здесь есть последовательность
  <code>«кот сидит на коврике»</code>. На вход подаются первые три токена, а на каждом
  такте сеть учится предсказывать следующий: <code>кот → сидит</code>,
  <code>сидит → на</code>, <code>на → коврике</code>.
</p>

### Данные: строка → токены → словарь → one-hot

<p>
  Слова переводятся в целочисленные идентификаторы, затем во входные one-hot-векторы.
  Поэтому один объект теперь имеет не форму <code>(P,)</code>, а форму
  <code>(T, V)</code>: длина последовательности × размер словаря.
</p>

### Версия 1. Функции на NumPy: forward и BPTT вручную

<p>
  В этой версии видны все вычисления статьи. Forward переносит скрытое состояние слева
  направо, а <code>backward</code> идёт по сохранённым состояниям в обратном порядке.
  Матрица <code>W<sub>hh</sub></code> одна и та же на всех тактах, поэтому её градиент
  накапливается внутри обратного цикла.
</p>
<pre><code class="language-python">import numpy as np

# Текстовая последовательность: на каждом такте предсказываем следующее слово.
tokens = &quot;кот сидит на коврике&quot;.split()
vocab = sorted(set(tokens))
to_id = {word: i for i, word in enumerate(vocab)}

x_ids = np.array([to_id[word] for word in tokens[:-1]])   # кот, сидит, на
y_ids = np.array([to_id[word] for word in tokens[1:]])    # сидит, на, коврике

T = len(x_ids)                  # 3 такта
V = len(vocab)                  # размер словаря
H = 8                           # размер скрытого состояния
X = np.eye(V)[x_ids]            # one-hot, форма (T, V)

rng = np.random.default_rng(7)
Wxh = rng.normal(0, 0.2, (V, H)) # вход xᵗ -&gt; hᵗ
Whh = rng.normal(0, 0.2, (H, H)) # память hᵗ⁻¹ -&gt; hᵗ
Why = rng.normal(0, 0.2, (H, V)) # состояние hᵗ -&gt; логиты
bh = np.zeros(H)
by = np.zeros(V)

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

def forward(X):
    hs = [np.zeros(H)]
    probs = []
    for xt in X:
        ht = np.tanh(xt @ Wxh + hs[-1] @ Whh + bh)
        pt = softmax(ht @ Why + by)
        hs.append(ht)
        probs.append(pt)
    return np.array(hs), np.array(probs)

def cross_entropy(probs, targets):
    return -np.log(probs[np.arange(len(targets)), targets] + 1e-9).mean()

def backward(X, targets, hs, probs):
    # Производная softmax + cross-entropy по логитам.
    dlogits = probs.copy()
    dlogits[np.arange(T), targets] -= 1
    dlogits /= T

    dWxh = np.zeros_like(Wxh)
    dWhh = np.zeros_like(Whh)
    dWhy = hs[1:].T @ dlogits
    dbh = np.zeros_like(bh)
    dby = dlogits.sum(axis=0)
    dh_next = np.zeros(H)

    # BPTT: идём от последнего такта к первому.
    for t in range(T - 1, -1, -1):
        dh = dlogits[t] @ Why.T + dh_next
        dz = dh * (1 - hs[t + 1] ** 2)       # производная tanh
        dWxh += np.outer(X[t], dz)
        dWhh += np.outer(hs[t], dz)
        dbh += dz
        dh_next = dz @ Whh.T

    return dWxh, dWhh, dWhy, dbh, dby

lr = 0.2
for epoch in range(1200):
    hs, probs = forward(X)                    # FORWARD
    grads = backward(X, y_ids, hs, probs)    # BACKWARD THROUGH TIME
    for grad in grads:
        np.clip(grad, -1.0, 1.0, out=grad)   # gradient clipping
    Wxh -= lr * grads[0]                     # UPDATE
    Whh -= lr * grads[1]
    Why -= lr * grads[2]
    bh  -= lr * grads[3]
    by  -= lr * grads[4]

hs, probs = forward(X)
predicted = [vocab[i] for i in probs.argmax(axis=1)]
print(predicted)                              # [&#x27;сидит&#x27;, &#x27;на&#x27;, &#x27;коврике&#x27;]</code></pre>

<div class="callout-blue">
  <strong>Почему сохраняются все h.</strong> Для BPTT нужны промежуточные состояния каждого
  такта: производная <code>tanh</code> на шаге <code>t</code> вычисляется через
  <code>h<sup>t</sup></code>, а рекуррентный градиент передаётся дальше к
  <code>h<sup>t−1</sup></code>.
</div>

### Версия 2. Те же вычисления внутри NumPy-класса

<p>
  Математика не меняется: параметры становятся полями объекта, <code>forward</code>
  возвращает состояния и вероятности, а <code>train_step</code> выполняет один полный
  цикл forward → loss → BPTT → clipping → update.
</p>
<pre><code class="language-python">class SimpleRNNNumPy:
    def __init__(self, vocab_size, hidden_size, seed=7):
        rng = np.random.default_rng(seed)
        self.V = vocab_size
        self.H = hidden_size
        self.Wxh = rng.normal(0, 0.2, (self.V, self.H))
        self.Whh = rng.normal(0, 0.2, (self.H, self.H))
        self.Why = rng.normal(0, 0.2, (self.H, self.V))
        self.bh = np.zeros(self.H)
        self.by = np.zeros(self.V)

    def forward(self, X):
        hs = [np.zeros(self.H)]
        probs = []
        for xt in X:
            ht = np.tanh(xt @ self.Wxh + hs[-1] @ self.Whh + self.bh)
            pt = softmax(ht @ self.Why + self.by)
            hs.append(ht)
            probs.append(pt)
        return np.array(hs), np.array(probs)

    def train_step(self, X, targets, lr=0.2):
        T = len(targets)
        hs, probs = self.forward(X)

        dlogits = probs.copy()
        dlogits[np.arange(T), targets] -= 1
        dlogits /= T

        dWxh = np.zeros_like(self.Wxh)
        dWhh = np.zeros_like(self.Whh)
        dWhy = hs[1:].T @ dlogits
        dbh = np.zeros_like(self.bh)
        dby = dlogits.sum(axis=0)
        dh_next = np.zeros(self.H)

        for t in range(T - 1, -1, -1):
            dh = dlogits[t] @ self.Why.T + dh_next
            dz = dh * (1 - hs[t + 1] ** 2)
            dWxh += np.outer(X[t], dz)
            dWhh += np.outer(hs[t], dz)
            dbh += dz
            dh_next = dz @ self.Whh.T

        grads = [dWxh, dWhh, dWhy, dbh, dby]
        for grad in grads:
            np.clip(grad, -1.0, 1.0, out=grad)

        self.Wxh -= lr * dWxh
        self.Whh -= lr * dWhh
        self.Why -= lr * dWhy
        self.bh  -= lr * dbh
        self.by  -= lr * dby
        return cross_entropy(probs, targets)

model = SimpleRNNNumPy(vocab_size=V, hidden_size=H)
for epoch in range(1200):
    loss = model.train_step(X, y_ids)

_, probs = model.forward(X)
print([vocab[i] for i in probs.argmax(axis=1)])</code></pre>

### Версия 3. PyTorch через наследование от nn.Module

<p>
  В PyTorch рекуррентный слой и выходная голова остаются отдельными объектами класса —
  <code>Sequential</code> здесь не используется. <code>nn.RNN</code> строит те же состояния
  <code>h¹, …, hᵀ</code>, а <code>loss.backward()</code> автоматически запускает BPTT по
  развёрнутому вычислительному графу.
</p>
<pre><code class="language-python">import torch
import torch.nn as nn

torch.manual_seed(7)

# Тот же one-hot вход: (batch=1, time=T, vocab=V).
Xt = torch.tensor(X[None, :, :], dtype=torch.float32)
yt = torch.tensor(y_ids[None, :], dtype=torch.long)

class TinyRNN(nn.Module):
    def __init__(self, vocab_size, hidden_size):
        super().__init__()
        self.rnn = nn.RNN(
            input_size=vocab_size,
            hidden_size=hidden_size,
            batch_first=True,
        )
        self.head = nn.Linear(hidden_size, vocab_size)

    def forward(self, x, h0=None):
        states, hT = self.rnn(x, h0)   # states: (B, T, H)
        logits = self.head(states)     # logits: (B, T, V)
        return logits, hT

model = TinyRNN(vocab_size=V, hidden_size=H)
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.05)

for epoch in range(500):
    optimizer.zero_grad()
    logits, hT = model(Xt)             # FORWARD
    loss = loss_fn(
        logits.reshape(-1, V),
        yt.reshape(-1),
    )                                  # LOSS по всем тактам
    loss.backward()                    # BPTT строит autograd
    nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    optimizer.step()                   # UPDATE

pred_ids = logits.argmax(dim=-1)[0].tolist()
print([vocab[i] for i in pred_ids])    # [&#x27;сидит&#x27;, &#x27;на&#x27;, &#x27;коврике&#x27;]</code></pre>

<p>
  Во всех трёх вариантах результат один: после токена <code>«кот»</code> сеть выдаёт
  <code>«сидит»</code>, затем <code>«на»</code> и <code>«коврике»</code>. Разница только в том,
  кто реализует производные: в NumPy мы явно пишем обратный цикл по времени, а PyTorch
  сохраняет граф операций и вычисляет градиенты через autograd.
</p>

<div class="callout-yellow">
  <strong>Это учебный пример, а не языковая модель.</strong> Один короткий текст позволяет
  проверить формы и BPTT, но модель просто запоминает последовательность. Для реального
  обучения нужны много предложений, батчи, padding/mask и обычно embedding вместо one-hot.
</div>


### Куда это ведёт дальше

<p>
  Vanilla RNN почти не используют в продакшене — и именно из-за произведения
  якобианов. LSTM и GRU решают проблему тем, что добавляют в цепочку путь, по
  которому состояние переносится <em>почти без умножения на матрицу</em>:
  в LSTM это ячейка памяти <code>c<sub>t</sub></code>, обновляемая сложением, а
  затвор забывания сам решает, что сохранить. Трансформеры пошли дальше и убрали
  рекурсию совсем, заменив её вниманием — что заодно вернуло возможность
  параллельного вычисления по времени.
</p>

<div class="callout-blue">
  <strong>Зачем тогда разбирать RNN.</strong> Все ключевые идеи — скрытое
  состояние, общие веса, развёртка, градиент через время, затухание — переходят в
  LSTM, GRU и state-space модели без изменений. Понять их проще всего на самой
  простой ячейке, где ничего не спрятано за затворами.
</div>

---



## Модификация RNN: LSTM и управляемая память

<p>
  Vanilla RNN переносит только одно скрытое состояние и на каждом такте пропускает его
  через рекуррентную матрицу. LSTM добавляет отдельную долгосрочную память
  <code>C<sup>t</sup></code> и ворота, которые управляют забыванием, записью и выдачей
  информации. Ниже добавлен референсный интерактив ячейки без изменения остальных сцен статьи.
</p>
<div class="semantic-key" aria-label="Цветовые обозначения LSTM">
  <span><i style="background:#C29E08"></i>обучаемые ворота</span>
  <span><i style="background:#3576C0"></i>память и поэлементные операции</span>
  <span><i style="background:#73B222"></i>граница ячейки</span>
  <span><i style="background:#C30B0A"></i>путь, который затухает у vanilla RNN</span>
</div>
<div class="callout-blue">
  <strong>Как читать схему.</strong> Положение блоков не меняется: на каждом шаге яркой
  остаётся только та часть LSTM, которая сейчас разбирается.
</div>
<div class="stage" id="stageLstm" tabindex="0">
  <div class="stage-figure">
<svg id="ls" viewBox="0 0 960 560" role="img" aria-label="Схема ячейки LSTM: магистраль долгосрочной памяти, ворота забывания, входа и выхода">
  <style>
    #ls { font-family: Helvetica, Arial, sans-serif; }
    #ls .cellbox { fill: #F5FBF1; stroke: #73B222; stroke-width: 2; }
    #ls .cwire { fill: none; stroke: #3576C0; stroke-width: 3.4; }
    #ls .wire { fill: none; stroke: #5E5850; stroke-width: 2; }
    #ls .gate { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2; }
    #ls .opc { fill: #F0F6FC; stroke: #3576C0; stroke-width: 2; }
    #ls .lbl { font-size: 18px; fill: #111111; font-weight: 700; }
    #ls .gl { font-size: 16px; fill: #8C7106; font-weight: 700; }
    #ls .ol { font-size: 17px; fill: #3576C0; font-weight: 700; }
    #ls .cap { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ls-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5E5850"></path></marker>
    <marker id="ls-arwb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#3576C0"></path></marker>
  </defs>

  <g data-key="cell">
    <rect x="180" y="120" width="560" height="330" rx="22" class="cellbox"></rect>
    <text x="460" y="108" text-anchor="middle" class="cap">одна ячейка LSTM на такте t</text>
  </g>

  <g data-key="cline">
    <line x1="110" y1="170" x2="248" y2="170" class="cwire" marker-end="url(#ls-arwb)"></line>
    <text x="100" y="176" text-anchor="end" class="lbl">Cᵗ⁻¹</text>
    <line x1="290" y1="170" x2="418" y2="170" class="cwire" marker-end="url(#ls-arwb)"></line>
    <line x1="460" y1="170" x2="798" y2="170" class="cwire" marker-end="url(#ls-arwb)"></line>
    <text x="810" y="176" class="lbl">Cᵗ</text>
    <text x="110" y="146" class="cap">долгосрочная память</text>
  </g>

  <g data-key="hin">
    <line x1="110" y1="430" x2="618" y2="430" class="wire"></line>
    <text x="100" y="436" text-anchor="end" class="lbl">hᵗ⁻¹</text>
    <line x1="215" y1="526" x2="215" y2="434" class="wire" marker-end="url(#ls-arw)"></line>
    <text x="215" y="546" text-anchor="middle" class="lbl">xᵗ</text>
    <text x="252" y="412" class="cap">общий вход всех ворот: [hᵗ⁻¹, xᵗ]</text>
  </g>

  <g data-key="forget">
    <line x1="270" y1="430" x2="270" y2="388" class="wire"></line>
    <rect x="248" y="350" width="44" height="36" rx="9" class="gate"></rect>
    <text x="270" y="374" text-anchor="middle" class="gl">σ</text>
    <text x="240" y="374" text-anchor="end" class="gl">f</text>
    <line x1="270" y1="348" x2="270" y2="192" class="wire" marker-end="url(#ls-arw)"></line>
    <circle cx="270" cy="170" r="18" class="opc"></circle>
    <text x="270" y="177" text-anchor="middle" class="ol">×</text>
  </g>

  <g data-key="ctemp">
    <text x="360" y="148" text-anchor="middle" class="cap">C_temp = f ∗ Cᵗ⁻¹</text>
  </g>

  <g data-key="input">
    <line x1="360" y1="430" x2="360" y2="388" class="wire"></line>
    <rect x="338" y="350" width="44" height="36" rx="9" class="gate"></rect>
    <text x="360" y="374" text-anchor="middle" class="gl">σ</text>
    <text x="326" y="342" text-anchor="middle" class="gl">i</text>
    <path d="M 360 348 V 265 H 420" class="wire" marker-end="url(#ls-arw)"></path>
    <line x1="500" y1="430" x2="500" y2="388" class="wire"></line>
    <rect x="470" y="350" width="60" height="36" rx="9" class="gate"></rect>
    <text x="500" y="374" text-anchor="middle" class="gl">tanh</text>
    <text x="556" y="342" text-anchor="middle" class="gl">C_add</text>
    <path d="M 500 348 V 265 H 460" class="wire" marker-end="url(#ls-arw)"></path>
    <circle cx="440" cy="265" r="16" class="opc"></circle>
    <text x="440" y="272" text-anchor="middle" class="ol">×</text>
    <line x1="440" y1="247" x2="440" y2="192" class="wire" marker-end="url(#ls-arw)"></line>
    <circle cx="440" cy="170" r="18" class="opc"></circle>
    <text x="440" y="177" text-anchor="middle" class="ol">+</text>
  </g>

  <g data-key="output">
    <line x1="620" y1="430" x2="620" y2="388" class="wire"></line>
    <rect x="598" y="350" width="44" height="36" rx="9" class="gate"></rect>
    <text x="620" y="374" text-anchor="middle" class="gl">σ</text>
    <text x="588" y="342" text-anchor="middle" class="gl">o</text>
    <path d="M 620 348 V 300 H 640" class="wire" marker-end="url(#ls-arw)"></path>
    <line x1="660" y1="174" x2="660" y2="192" class="wire"></line>
    <ellipse cx="660" cy="215" rx="40" ry="21" class="gate"></ellipse>
    <text x="660" y="221" text-anchor="middle" class="gl">tanh</text>
    <line x1="660" y1="236" x2="660" y2="280" class="wire" marker-end="url(#ls-arw)"></line>
    <circle cx="660" cy="300" r="16" class="opc"></circle>
    <text x="660" y="307" text-anchor="middle" class="ol">×</text>
  </g>

  <g data-key="hout">
    <path d="M 678 300 H 720 V 430 H 788" class="wire" marker-end="url(#ls-arw)"></path>
    <text x="800" y="436" class="lbl">hᵗ</text>
    <line x1="720" y1="296" x2="720" y2="84" class="wire" marker-end="url(#ls-arw)"></line>
    <text x="720" y="66" text-anchor="middle" class="lbl">yᵗ</text>
    <text x="744" y="102" class="cap">выход слоя на этом такте</text>
  </g>

  <text x="296" y="546" class="cap">жёлтый — обучаемые ворота · синий — память и поэлементные операции · зелёный — граница ячейки</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="cell cline hin" data-focus="cell">
      <div class="step-kicker">Шаг 1 · два вектора вместо одного</div>
      <h4>Долгосрочная память и текущее состояние</h4>
      <p>
        Слева в ячейку входят два вектора: <code>C<sup>t−1</sup></code> —
        долгосрочная память, и <code>h<sup>t−1</sup></code> — краткосрочная,
        она же выход прошлого такта. Снизу приходит новый токен
        <code>x<sup>t</sup></code>. Все трое ворот смотрят на одну и ту же
        склейку <code>[h<sup>t−1</sup>, x<sup>t</sup>]</code> — отдельного
        входа у них нет.
      </p>
      <p>
        Векторы <code>C</code> и <code>h</code> имеют одинаковую длину. Разница
        между ними не в размере, а в том, как они обновляются.
      </p>
    </div>
    <div class="step-panel" data-on="cell cline" data-focus="cline">
      <div class="step-kicker">Шаг 2 · магистраль</div>
      <h4>Верхняя линия проходит ячейку почти насквозь</h4>
      <p>
        На пути <code>C</code> стоят всего две операции, и обе поэлементные:
        умножение на вектор из нулей и единиц и сложение. Ни одного умножения на
        матрицу весов — вот главное отличие от vanilla RNN, где состояние на
        каждом такте прогонялось через <code>W<sub>hh</sub></code>.
      </p>
      <div class="callout-blue">
        <strong>Аналогия со skip connection.</strong> Это тот же приём, что в
        ResNet: рядом с вычислениями протянут короткий путь, по которому сигнал
        (и градиент) идёт без искажений.
      </div>
    </div>
    <div class="step-panel" data-on="cell cline hin forget ctemp" data-focus="forget">
      <div class="step-kicker">Шаг 3 · ворота забывания</div>
      <h4>Что из памяти уже можно выкинуть</h4>
      <div class="math-display" data-tex="f^t=\sigma\left(W_f\cdot[h^{t-1},x^t]+b_f\right),\qquad C_{\text{temp}}^{\,t}=f^t\ast C^{t-1}"></div>
      <p>
        Сигмоида даёт вектор значений от нуля до единицы той же длины, что и
        <code>C</code>. Каждая координата памяти умножается на своё число:
        единица — сохранить полностью, ноль — стереть, промежуточное значение —
        ослабить.
      </p>
      <div class="callout-yellow">
        <strong>На примере.</strong> В предложении «Человек в шляпе с красивым
        попугаем на плече… зашёл в бар» на слове «на» ворота забывания могут
        стереть из памяти форму слов «красивым попугаем»: согласовывать с ними
        уже ничего не нужно.
      </div>
    </div>
    <div class="step-panel" data-on="cell cline hin input" data-focus="input">
      <div class="step-kicker">Шаг 4 · ворота входа</div>
      <h4>Что из нового стоит записать</h4>
      <div class="math-display" data-tex="i^t=\sigma\left(W_i\cdot[h^{t-1},x^t]+b_i\right),\qquad C_{\text{add}}^{\,t}=\tanh\left(W_C\cdot[h^{t-1},x^t]+b_C\right)"></div>
      <p>
        Здесь работают сразу двое: <code>tanh</code> готовит
        <em>что</em> записать (вектор-кандидат со значениями от −1 до 1), а
        сигмоида решает, <em>сколько</em> от него пропустить. Разделение
        осмысленное: содержание и громкость записи учатся отдельно.
      </p>
      <div class="callout-yellow">
        <strong>На примере.</strong> На слове «человек» сеть добавляет в память
        признак мужского рода — он понадобится через полтора десятка слов, на
        слове «которого».
      </div>
    </div>
    <div class="step-panel" data-on="cell cline hin forget input ctemp" data-focus="ctemp input">
      <div class="step-kicker">Шаг 5 · обновление памяти</div>
      <h4>Стёрли — и дописали</h4>
      <div class="math-display" data-tex="C^t=f^t\ast C^{t-1}+i^t\ast C_{\text{add}}^{\,t}"></div>
      <p>
        Вся долгосрочная память обновляется одной строчкой: старое содержимое,
        ослабленное воротами забывания, плюс новое, дозированное воротами входа.
        Обе операции — поэлементные, поэтому каждая координата памяти живёт своей
        жизнью и может держать свой собственный признак.
      </p>
      <div class="callout">
        <strong>Вывод шага:</strong> при <code>f = 1</code> и <code>i = 0</code>
        ячейка просто копирует память дальше без изменений. У vanilla RNN такого
        режима нет в принципе — там состояние обязательно проходит через матрицу.
      </div>
    </div>
    <div class="step-panel" data-on="cell cline hin output" data-focus="output">
      <div class="step-kicker">Шаг 6 · ворота выхода</div>
      <h4>Что из памяти показать наружу</h4>
      <div class="math-display" data-tex="o^t=\sigma\left(W_o\cdot[h^{t-1},x^t]+b_o\right),\qquad h^t=o^t\ast\tanh\left(C^t\right)"></div>
      <p>
        Память и выход разведены: в <code>C</code> может лежать что угодно, но
        наружу пойдёт только та часть, которую пропустят ворота выхода.
        <code>tanh</code> здесь нужен, чтобы вернуть значения в диапазон
        <code>(−1, 1)</code> — ведь сама <code>C</code> ничем не ограничена.
      </p>
      <div class="callout-yellow">
        <strong>На примере.</strong> На слове «попугаем» из памяти нужно достать
        форму слова «красивым», но не форму слова «человек» — хотя оба признака
        в памяти лежат. Ровно это и делают ворота выхода.
      </div>
    </div>
    <div class="step-panel" data-on="cell cline hin output hout" data-focus="hout">
      <div class="step-kicker">Шаг 7 · выход такта</div>
      <h4>h идёт и наверх, и в следующий такт</h4>
      <div class="math-display" data-tex="y^t=\sigma\left(W_y h^t+b_y\right)"></div>
      <p>
        Вектор <code>h<sup>t</sup></code> уходит сразу в две стороны: вверх — в
        выходной слой, и вправо — в следующий такт, где станет
        <code>h<sup>t−1</sup></code>. Вместе с ним дальше едет и
        <code>C<sup>t</sup></code>: между тактами передаются оба вектора.
      </p>
    </div>
    <div class="step-panel" data-on="cell cline hin forget input ctemp output hout" data-focus="cline">
      <div class="step-kicker">Шаг 8 · зачем всё это</div>
      <h4>Градиент по C не проходит через матрицу</h4>
      <div class="math-display" data-tex="\frac{\partial C^t}{\partial C^{t-1}}=\operatorname{diag}\left(f^t\right)"></div>
      <p>
        У vanilla RNN переход между тактами давал якобиан
        <code>W<sub>hh</sub><sup>⊤</sup>·diag(1 − h²)</code>, и его норма почти
        всегда была заметно меньше единицы. Здесь на пути стоит только вектор
        <code>f</code>, который сеть выбирает сама: захочет помнить — поставит
        значения около единицы, и градиент дойдёт до начала предложения почти
        нетронутым.
      </p>
      <div class="callout-red">
        <strong>Это не бесплатно.</strong> Четыре матрицы вместо одной — вчетверо
        больше параметров и вчетверо больше вычислений на такт. И
        последовательность по-прежнему не распараллеливается по времени: LSTM
        лечит затухание, но не медлительность.
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Переключайте восемь шагов кнопками или стрелками клавиатуры.</p>

## Часть 8. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>RNN — линейный слой с двумя входами:</strong> текущий токен и собственное состояние с прошлого шага.</li>
  <li><strong>Скрытое состояние</strong> <code>h<sub>t</sub> = tanh(x<sub>t</sub>W<sub>xh</sub> + h<sub>t−1</sub>W<sub>hh</sub> + b<sub>h</sub>)</code> — это и выход, и память.</li>
  <li><strong>W<sub>hh</sub> обязана быть квадратной</strong> <code>[H, H]</code>: состояние возвращается в себя того же размера, поэтому вся история сжата в <code>H</code> чисел.</li>
  <li><strong>Ошибка последовательности</strong> — сумма (или среднее) обычных loss'ов по шагам; padding нужно маскировать.</li>
  <li><strong>Градиенты по <code>V</code> и <code>b<sub>y</sub></code></strong> — локальные: рекурсии по времени нет.</li>
  <li><strong>Градиенты по <code>W</code> и <code>U</code> раскрываются рекурсивно:</strong> общий параметр получает вклад от каждого такта, а путь от далёкого такта проходит через <code>∂h<sup>t</sup>/∂h<sup>t−1</sup></code>.</li>
  <li><strong>BPTT на практике</strong> — одна обратная рекурсия: <code>δ<sub>t</sub> = (1 − h<sub>t</sub><sup>2</sup>) ⊙ (dz<sub>t</sub>W<sub>hy</sub><sup>⊤</sup> + δ<sub>t+1</sub>W<sub>hh</sub><sup>⊤</sup>)</code>.</li>
  <li><strong>Затухание и взрыв</strong> — следствие произведения <code>T − k</code> одинаковых якобианов; лечатся клиппингом, усечением и воротными ячейками.</li>
  <li><strong>Forward запоминает все такты:</strong> входы, состояния <code>h<sub>0</sub>…h<sub>T</sub></code> и предсказания — память растёт линейно по <code>T</code>, а строка <code>W<sub>xh</sub></code> для токена, ни разу не бывшего входом, получает нулевой градиент.</li>
  <li><strong>Проверка градиента</strong> центральными разностями ловит ошибку в выкладке: расхождение должно быть порядка <code>10<sup>−10</sup></code>.</li>
  <li>Формы всегда сходятся: градиент по параметру имеет ту же форму, что и параметр. Это самая быстрая проверка любой выкладки.</li>
</ol>

<p>
  Если держать в голове одну картину, пусть это будет не формула, а стрелка,
  идущая вправо по времени, и вторая — красная, идущая обратно через все те же
  состояния. <strong>Значения текут вперёд, градиенты — назад по той же цепочке</strong>,
  и каждый лишний такт добавляет к градиенту ещё одно умножение на ту же матрицу.
  Всё остальное в рекуррентных сетях — попытки сделать это умножение безопасным.
</p>

<p class="tiny">
  Числовые значения в статье получены из явно заданных матриц
  <code>W<sub>xh</sub>, W<sub>hh</sub>, W<sub>hy</sub></code> и проверены
  сравнением аналитических градиентов с численными (центральные разности,
  ε = 10⁻⁶, расхождение ≈ 10⁻¹⁰); один шаг с η = 0,5 снижает loss на фразе
  с 1,5192 до 1,3478. Значения округлены до четырёх знаков, в сценах обычно до трёх.
</p>

<script>
(function () {
  'use strict';
  // Строки формул для сцен. Заполняются до renderProseMath шелла.
  var FWDF = {"fx": "x_t\\in\\mathbb{R}^{1\\times4},\\quad h_t\\in\\mathbb{R}^{1\\times2},\\qquad W_{xh}\\in\\mathbb{R}^{4\\times2},\\ W_{hh}\\in\\mathbb{R}^{2\\times2},\\ b_h\\in\\mathbb{R}^{2},\\qquad W_{hy}\\in\\mathbb{R}^{2\\times4},\\ b_y\\in\\mathbb{R}^{4}", "fa": "a_t=x_tW_{xh}+h_{t-1}W_{hh}+b_h,\\qquad h_0=0\\quad\\Rightarrow\\quad a_t\\in\\mathbb{R}^{1\\times2}", "fh": "h_t=\\tanh(a_t)\\ (\\text{поэлементно}),\\qquad \\tanh^{\\prime}(a_t)=1-h_t^{2}", "fz": "z_t=h_tW_{hy}+b_y\\in\\mathbb{R}^{1\\times4}", "fs": "\\hat y_{t,k}=\\dfrac{e^{z_{t,k}}}{\\sum_j e^{z_{t,j}}}", "fl": "\\mathcal L_t=-\\log \\hat y_{t,c_t},\\qquad (c_1,c_2,c_3)=(\\text{you},\\,\\text{will},\\,\\text{pass})", "fL": "\\mathcal L=\\frac{1}{T}\\sum_{t=1}^{T}\\mathcal L_t,\\qquad T=3"};
  var FWDN = {"fx": "X=\\begin{bmatrix}1&0&0&0\\\\0&1&0&0\\\\0&0&1&0\\end{bmatrix}\\begin{matrix}\\leftarrow \\langle\\text{BOS}\\rangle\\\\ \\leftarrow \\text{you}\\\\ \\leftarrow \\text{will}\\end{matrix}", "fw": "W_{xh}=\\begin{bmatrix}0{,}5&-0{,}4\\\\0{,}2&0{,}9\\\\-0{,}6&0{,}3\\\\0{,}7&0{,}1\\end{bmatrix},\\quad W_{hh}=\\begin{bmatrix}0{,}4&-0{,}2\\\\0{,}1&0{,}5\\end{bmatrix},\\quad b_h=\\left(0{,}1;\\ -0{,}1\\right)", "fa": "A=\\begin{bmatrix}0{,}6000&-0{,}5000\\\\0{,}4686&0{,}4615\\\\-0{,}2820&0{,}3283\\end{bmatrix},\\qquad a_2=\\underbrace{\\left(0{,}2;\\ 0{,}9\\right)}_{x_2W_{xh}}+\\underbrace{\\left(0{,}1686;\\ -0{,}3385\\right)}_{h_1W_{hh}}+\\left(0{,}1;\\ -0{,}1\\right)", "fh": "H=\\tanh(A)=\\begin{bmatrix}0{,}5370&-0{,}4621\\\\0{,}4371&0{,}4313\\\\-0{,}2748&0{,}3169\\end{bmatrix}", "fz": "W_{hy}=\\begin{bmatrix}0{,}3&-0{,}5&0{,}8&0{,}2\\\\-0{,}7&0{,}6&0{,}1&0{,}4\\end{bmatrix},\\ \\ b_y=\\left(0;\\ 0{,}1;\\ -0{,}2;\\ 0\\right)\\ \\Rightarrow\\ Z=\\begin{bmatrix}0{,}4846&-0{,}4458&0{,}1834&-0{,}0774\\\\-0{,}1708&0{,}1403&0{,}1928&0{,}2599\\\\-0{,}3043&0{,}4276&-0{,}3881&0{,}0718\\end{bmatrix}", "fs": "\\hat Y=\\begin{bmatrix}0{,}3698&0{,}1458&0{,}2736&0{,}2108\\\\0{,}1872&0{,}2555&0{,}2693&0{,}2880\\\\0{,}1833&0{,}3811&0{,}1686&0{,}2670\\end{bmatrix},\\qquad \\text{сумма каждой строки}=1", "fl": "\\mathcal L_t=\\bigl(-\\log 0{,}1458;\\ -\\log 0{,}2693;\\ -\\log 0{,}2670\\bigr)=\\left(1{,}9253;\\ 1{,}3120;\\ 1{,}3204\\right)", "fL": "\\mathcal L=\\tfrac13\\left(1{,}9253+1{,}3120+1{,}3204\\right)=1{,}5192"};
  var BWDF = {"bs": "dz_t=\\dfrac{\\partial \\mathcal L}{\\partial z_t}=\\dfrac{\\hat y_t-y_t}{T}", "bf": "dW_{hy}=\\sum_t h_t^{\\top}dz_t,\\quad db_y=\\sum_t dz_t,\\quad dh_t^{\\text{out}}=dz_t\\,W_{hy}^{\\top}", "bh": "dh_t=dh_t^{\\text{out}}+\\delta_{t+1}W_{hh}^{\\top},\\qquad \\delta_{T+1}=0", "bc": "\\delta_t=dh_t\\odot\\left(1-h_t^{2}\\right)", "bw": "dW_{hh}=\\sum_{t}h_{t-1}^{\\top}\\delta_t,\\quad dW_{xh}=\\sum_{t}x_t^{\\top}\\delta_t,\\quad db_h=\\sum_t\\delta_t", "bx": "dx_t=\\delta_t\\,W_{xh}^{\\top},\\qquad dh_0=\\delta_1W_{hh}^{\\top}"};
  var BWDN = {"bz": "dZ=\\frac{\\hat Y-Y}{3}=\\begin{bmatrix}0{,}1233&-0{,}2847&0{,}0912&0{,}0703\\\\0{,}0624&0{,}0852&-0{,}2436&0{,}0960\\\\0{,}0611&0{,}1270&0{,}0562&-0{,}2443\\end{bmatrix}", "bo": "dH^{\\text{out}}=dZ\\,W_{hy}^{\\top}=\\begin{bmatrix}0{,}2664&-0{,}2199\\\\-0{,}1995&0{,}0215\\\\-0{,}0491&-0{,}0587\\end{bmatrix}", "bh": "dH=dH^{\\text{out}}+\\underbrace{\\begin{bmatrix}-0{,}0655&-0{,}0206\\\\-0{,}0076&-0{,}0309\\\\0&0\\end{bmatrix}}_{\\delta_{t+1}W_{hh}^{\\top}}=\\begin{bmatrix}0{,}2009&-0{,}2405\\\\-0{,}2071&-0{,}0095\\\\-0{,}0491&-0{,}0587\\end{bmatrix}", "bd": "1-H^2=\\begin{bmatrix}0{,}7116&0{,}7864\\\\0{,}8090&0{,}8140\\\\0{,}9245&0{,}8995\\end{bmatrix},\\qquad \\Delta=dH\\odot(1-H^2)=\\begin{bmatrix}0{,}1429&-0{,}1891\\\\-0{,}1676&-0{,}0077\\\\-0{,}0454&-0{,}0528\\end{bmatrix}", "bw": "dW_{xh}=X^{\\top}\\Delta=\\begin{bmatrix}0{,}1429&-0{,}1891\\\\-0{,}1676&-0{,}0077\\\\-0{,}0454&-0{,}0528\\\\0&0\\end{bmatrix},\\quad dW_{hh}=\\begin{bmatrix}-0{,}1098&-0{,}0272\\\\0{,}0579&-0{,}0192\\end{bmatrix},\\quad db_h=\\left(-0{,}0700;\\ -0{,}2496\\right)", "bw2": "dW_{hy}=\\begin{bmatrix}0{,}0767&-0{,}1506&-0{,}0729&0{,}1468\\\\-0{,}0107&0{,}2086&-0{,}1294&-0{,}0685\\end{bmatrix},\\qquad db_y=\\left(0{,}2468;\\ -0{,}0725;\\ -0{,}0962;\\ -0{,}0781\\right)"};
  function fill(attr, table) {
    document.querySelectorAll('[' + attr + ']').forEach(function (node) {
      var key = node.getAttribute(attr);
      if (table[key]) node.setAttribute('data-tex', table[key]);
    });
  }
  fill('data-fwdf-tex', FWDF);
  fill('data-fwdn-tex', FWDN);
  fill('data-bwdf-tex', BWDF);
  fill('data-bwdn-tex', BWDN);
})();
</script>

<script>
(function () {
  'use strict';

  function initStages() {
    document.querySelectorAll('.stage').forEach(function (stage) {
      if (stage.dataset.ready === '1') return;
      var svg = stage.querySelector('.stage-figure svg');
      var figure = stage.querySelector('.stage-figure');
      var panels = Array.prototype.slice.call(stage.querySelectorAll('.step-panel'));
      var groups = svg ? Array.prototype.slice.call(svg.querySelectorAll('[data-key]')) : [];
      var prev = stage.querySelector('[data-nav="prev"]');
      var next = stage.querySelector('[data-nav="next"]');
      var counter = stage.querySelector('.stage-counter');
      var progress = stage.querySelector('.stage-progress');
      if (!svg || !panels.length || !prev || !next || !counter || !progress) return;

      var cur = 0;
      panels.forEach(function () { progress.appendChild(document.createElement('i')); });
      var ticks = Array.prototype.slice.call(progress.querySelectorAll('i'));

      function render() {
        var panel = panels[cur];
        var on = (panel.getAttribute('data-on') || '').split(/\s+/).filter(Boolean);
        var focus = (panel.getAttribute('data-focus') || '').split(/\s+/).filter(Boolean);

        groups.forEach(function (group) {
          var key = group.getAttribute('data-key');
          var active = on.indexOf(key) !== -1;
          var only = group.hasAttribute('data-only');
          group.classList.toggle('is-hidden', only && !active);
          group.classList.toggle('is-dim', !active && !only);
          group.classList.toggle('is-focus', focus.indexOf(key) !== -1);
        });

        panels.forEach(function (panelNode, index) {
          panelNode.classList.toggle('active', index === cur);
        });
        ticks.forEach(function (tick, index) {
          tick.classList.toggle('done', index <= cur);
        });

        counter.textContent = (cur + 1) + ' из ' + panels.length;
        prev.disabled = cur === 0;
        next.textContent = cur === panels.length - 1 ? 'Сначала ↺' : 'Далее →';

        requestAnimationFrame(function () {
          if (!figure || figure.scrollWidth <= figure.clientWidth) return;
          var focused = groups.filter(function (group) {
            return focus.indexOf(group.getAttribute('data-key')) !== -1 &&
              !group.classList.contains('is-hidden');
          });
          if (!focused.length) { figure.scrollLeft = 0; return; }
          var wrapRect = figure.getBoundingClientRect();
          var left = Infinity;
          var right = -Infinity;
          focused.forEach(function (group) {
            var rect = group.getBoundingClientRect();
            left = Math.min(left, rect.left - wrapRect.left + figure.scrollLeft);
            right = Math.max(right, rect.right - wrapRect.left + figure.scrollLeft);
          });
          var target = (left + right) / 2 - figure.clientWidth / 2;
          figure.scrollLeft = Math.max(0, Math.min(target, figure.scrollWidth - figure.clientWidth));
        });
      }

      function move(delta) {
        var target = cur + delta;
        if (target < 0) return;
        if (target >= panels.length) target = 0;
        cur = target;
        render();
      }

      prev.addEventListener('click', function () { move(-1); });
      next.addEventListener('click', function () { move(1); });
      stage.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') { move(1); event.preventDefault(); }
        if (event.key === 'ArrowLeft') { move(-1); event.preventDefault(); }
      });
      stage.dataset.ready = '1';
      render();
    });
  }

  /* ---------------- сквозной числовой пример ---------------- */

  var Wxh = [[0.5, -0.4], [0.2, 0.9], [-0.6, 0.3], [0.7, 0.1]];
  var Whh = [[0.4, -0.2], [0.1, 0.5]];
  var Why = [[0.3, -0.5, 0.8, 0.2], [-0.7, 0.6, 0.1, 0.4]];
  var bh = [0.1, -0.1];
  var by = [0, 0.1, -0.2, 0];
  var Xseq = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]];
  var targets = [1, 2, 3];
  var vocab = ['<BOS>', 'you', 'will', 'pass'];
  var TSTEPS = 3;

  function vm(v, M) {
    var cols = M[0].length, out = [], j, i, s;
    for (j = 0; j < cols; j += 1) { s = 0; for (i = 0; i < v.length; i += 1) s += v[i] * M[i][j]; out.push(s); }
    return out;
  }
  function vmT(v, M) {
    return M.map(function (row) { return row.reduce(function (s, x, j) { return s + x * v[j]; }, 0); });
  }
  function addV(a, b) { return a.map(function (x, i) { return x + b[i]; }); }
  function mulV(a, b) { return a.map(function (x, i) { return x * b[i]; }); }
  function outer(a, b) { return a.map(function (x) { return b.map(function (y) { return x * y; }); }); }
  function addM(A, B) { return A.map(function (row, i) { return row.map(function (x, j) { return x + B[i][j]; }); }); }
  function zerosM(n, m) {
    var out = [], i, j, row;
    for (i = 0; i < n; i += 1) { row = []; for (j = 0; j < m; j += 1) row.push(0); out.push(row); }
    return out;
  }
  function softmax(v) {
    var mx = Math.max.apply(null, v);
    var e = v.map(function (x) { return Math.exp(x - mx); });
    var s = e.reduce(function (a, b) { return a + b; }, 0);
    return e.map(function (x) { return x / s; });
  }
  function mm2(A, B) {
    return [
      [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
      [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
    ];
  }
  function spectral2(M) {
    var a = M[0][0], b = M[0][1], c = M[1][0], d = M[1][1];
    var p = a * a + c * c, q = a * b + c * d, r = b * b + d * d;
    var tr = p + r, det = p * r - q * q;
    var disc = Math.max(tr * tr - 4 * det, 0);
    return Math.sqrt((tr + Math.sqrt(disc)) / 2);
  }

  var EX = (function () {
    var hs = [[0, 0]], as = [], zs = [], ps = [], Ls = [], hW = [], xW = [], t;
    for (t = 0; t < TSTEPS; t += 1) {
      var xw = vm(Xseq[t], Wxh);
      var hw = vm(hs[t], Whh);
      var a = addV(addV(xw, hw), bh);
      var h = a.map(Math.tanh);
      var z = addV(vm(h, Why), by);
      var p = softmax(z);
      xW.push(xw); hW.push(hw); as.push(a); hs.push(h); zs.push(z); ps.push(p);
      Ls.push(-Math.log(p[targets[t]]));
    }
    var L = (Ls[0] + Ls[1] + Ls[2]) / TSTEPS;

    var dWhy = zerosM(2, 4), dWhh = zerosM(2, 2), dWxh = zerosM(4, 2);
    var dbh = [0, 0], dby = [0, 0, 0, 0];
    var dz = [], dhOut = [], dhFut = [], dh = [], delta = [], tanhD = [];
    var nextDelta = [0, 0];
    for (t = TSTEPS - 1; t >= 0; t -= 1) {
      var g = ps[t].map(function (v, i) { return (v - (i === targets[t] ? 1 : 0)) / TSTEPS; });
      dz[t] = g;
      dWhy = addM(dWhy, outer(hs[t + 1], g));
      dby = addV(dby, g);
      var own = vmT(g, Why);
      var future = vmT(nextDelta, Whh);
      var dhT = addV(own, future);
      var td = hs[t + 1].map(function (v) { return 1 - v * v; });
      var de = mulV(dhT, td);
      dhOut[t] = own; dhFut[t] = future; dh[t] = dhT; tanhD[t] = td; delta[t] = de;
      dWhh = addM(dWhh, outer(hs[t], de));
      dWxh = addM(dWxh, outer(Xseq[t], de));
      dbh = addV(dbh, de);
      nextDelta = de;
    }

    function jacobian(h) {
      return [
        [(1 - h[0] * h[0]) * Whh[0][0], (1 - h[0] * h[0]) * Whh[1][0]],
        [(1 - h[1] * h[1]) * Whh[0][1], (1 - h[1] * h[1]) * Whh[1][1]]
      ];
    }
    var J3 = jacobian(hs[3]), J2 = jacobian(hs[2]);

    return {
      hs: hs, as: as, zs: zs, ps: ps, Ls: Ls, L: L, xW: xW, hW: hW,
      dz: dz, dhOut: dhOut, dhFut: dhFut, dh: dh, delta: delta, tanhD: tanhD,
      dWhy: dWhy, dWhh: dWhh, dWxh: dWxh, dbh: dbh, dby: dby,
      n3: spectral2(J3), n2: spectral2(J2), nProd: spectral2(mm2(J3, J2))
    };
  }());

  /* ---------------- форматирование ---------------- */

  function fx(value, digits) {
    var s = Number(value).toFixed(digits);
    if (Number(s) === 0) s = Math.abs(Number(s)).toFixed(digits);
    return s;
  }
  function rowTex(v, digits) {
    return '\\left(' + v.map(function (x) { return fx(x, digits); }).join(',\\;') + '\\right)';
  }
  function matTex(M, digits) {
    return '\\begin{pmatrix}' + M.map(function (row) {
      return row.map(function (x) { return fx(x, digits); }).join('&');
    }).join('\\\\') + '\\end{pmatrix}';
  }
  function applyTex(attribute, table) {
    document.querySelectorAll('[' + attribute + ']').forEach(function (node) {
      var key = node.getAttribute(attribute);
      if (Object.prototype.hasOwnProperty.call(table, key)) node.setAttribute('data-tex', table[key]);
    });
  }
  var SUP = { '0': '\u2070', '1': '\u00b9', '2': '\u00b2', '3': '\u00b3', '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079', '-': '\u207b' };
  function powerFmt(value) {
    if (value >= 0.01 && value < 10000) {
      return value >= 100 ? String(Math.round(value)) : String(Number(value.toPrecision(3)));
    }
    var parts = value.toExponential(1).split('e');
    var exponent = String(Number(parts[1])).split('').map(function (ch) { return SUP[ch] || ch; }).join('');
    return parts[0] + '\u00b710' + exponent;
  }
  function minus(text) { return String(text).replace(/-/g, '\u2212'); }

  /* ---------------- числовые сцены ---------------- */

  function initForwardNumeric() {
    var table = {
      params: '\\begin{aligned}W_{xh}&=' + matTex(Wxh, 1) + ',\\qquad W_{hh}=' + matTex(Whh, 1) +
        ',\\qquad W_{hy}=' + matTex(Why, 1) + ',\\\\[6pt]b_h&=' + rowTex(bh, 1) +
        ',\\qquad b_y=' + rowTex(by, 1) + ',\\qquad h_0=\\left(0,\\;0\\right),\\qquad T=3.\\end{aligned}',
      a1: '\\begin{aligned}a_1&=x_1W_{xh}+h_0W_{hh}+b_h\\\\&=' + rowTex(EX.xW[0], 1) + '+\\left(0,\\;0\\right)+' +
        rowTex(bh, 1) + '=' + rowTex(EX.as[0], 4) + '.\\end{aligned}',
      h1: 'h_1=\\tanh' + rowTex(EX.as[0], 4) + '=' + rowTex(EX.hs[1], 4) + '.',
      z1: '\\begin{aligned}z_1&=h_1W_{hy}+b_y\\\\&=' + rowTex(EX.hs[1], 4) + matTex(Why, 1) + '+' + rowTex(by, 1) +
        '=' + rowTex(EX.zs[0], 4) + '.\\end{aligned}',
      l1: '\\begin{aligned}\\hat y_1&=\\mathrm{softmax}' + rowTex(EX.zs[0], 4) + '=' + rowTex(EX.ps[0], 4) +
        ',\\\\[4pt]\\mathcal{L}_1&=-\\log ' + fx(EX.ps[0][1], 4) + '=' + fx(EX.Ls[0], 4) + '.\\end{aligned}',
      t2: '\\begin{aligned}a_2&=' + rowTex(EX.xW[1], 1) + '+' + rowTex(EX.hW[1], 4) + '+' + rowTex(bh, 1) +
        '=' + rowTex(EX.as[1], 4) + ',\\\\h_2&=\\tanh a_2=' + rowTex(EX.hs[2], 4) +
        ',\\\\\\hat y_2&=' + rowTex(EX.ps[1], 4) + ',\\qquad \\mathcal{L}_2=' + fx(EX.Ls[1], 4) + '.\\end{aligned}',
      t3: '\\begin{aligned}a_3&=' + rowTex(EX.xW[2], 1) + '+' + rowTex(EX.hW[2], 4) + '+' + rowTex(bh, 1) +
        '=' + rowTex(EX.as[2], 4) + ',\\\\h_3&=\\tanh a_3=' + rowTex(EX.hs[3], 4) +
        ',\\\\\\hat y_3&=' + rowTex(EX.ps[2], 4) + ',\\qquad \\mathcal{L}_3=' + fx(EX.Ls[2], 4) + '.\\end{aligned}',
      total: '\\mathcal{L}=\\frac{\\mathcal{L}_1+\\mathcal{L}_2+\\mathcal{L}_3}{3}=\\frac{' +
        fx(EX.Ls[0], 4) + '+' + fx(EX.Ls[1], 4) + '+' + fx(EX.Ls[2], 4) + '}{3}=' + fx(EX.L, 4) + '.',
      save: '\\begin{aligned}h_1&=' + rowTex(EX.hs[1], 4) + ',\\quad h_2=' + rowTex(EX.hs[2], 4) +
        ',\\quad h_3=' + rowTex(EX.hs[3], 4) + ',\\\\[4pt]\\hat Y&=' + matTex(EX.ps, 4) +
        ',\\qquad X=' + matTex(Xseq, 0) + '.\\end{aligned}'
    };
    applyTex('data-fw-tex', table);
  }

  function initBpttNumeric() {
    var table = {
      start: '\\begin{aligned}\\delta_4&=\\left(0,\\;0\\right),\\\\[4pt]\\frac{\\partial\\mathcal{L}}{\\partial W_{xh}}&=0,\\qquad' +
        '\\frac{\\partial\\mathcal{L}}{\\partial W_{hh}}=0,\\qquad\\frac{\\partial\\mathcal{L}}{\\partial W_{hy}}=0.\\end{aligned}',
      dz3: '\\begin{aligned}dz_3&=\\frac{\\hat y_3-y_3}{T}=\\frac{' + rowTex(EX.ps[2], 4) +
        '-\\left(0,\\;0,\\;0,\\;1\\right)}{3}\\\\[4pt]&=' + rowTex(EX.dz[2], 4) + '.\\end{aligned}',
      dh3: '\\begin{aligned}dh_3&=dz_3W_{hy}^{\\top}+\\delta_4W_{hh}^{\\top}\\\\&=' + rowTex(EX.dhOut[2], 4) +
        '+' + rowTex(EX.dhFut[2], 4) + '=' + rowTex(EX.dh[2], 4) + '.\\end{aligned}',
      d3: '\\begin{aligned}1-h_3^2&=' + rowTex(EX.tanhD[2], 4) + ',\\\\[4pt]\\delta_3&=dh_3\\odot\\left(1-h_3^2\\right)=' +
        rowTex(EX.delta[2], 4) + '.\\end{aligned}',
      t2: '\\begin{aligned}dz_2&=' + rowTex(EX.dz[1], 4) + ',\\\\dh_2&=' + rowTex(EX.dhOut[1], 4) + '+' +
        rowTex(EX.dhFut[1], 4) + '=' + rowTex(EX.dh[1], 4) + ',\\\\\\delta_2&=dh_2\\odot' + rowTex(EX.tanhD[1], 4) +
        '=' + rowTex(EX.delta[1], 4) + '.\\end{aligned}',
      t1: '\\begin{aligned}dz_1&=' + rowTex(EX.dz[0], 4) + ',\\\\dh_1&=' + rowTex(EX.dhOut[0], 4) + '+' +
        rowTex(EX.dhFut[0], 4) + '=' + rowTex(EX.dh[0], 4) + ',\\\\\\delta_1&=dh_1\\odot' + rowTex(EX.tanhD[0], 4) +
        '=' + rowTex(EX.delta[0], 4) + '.\\end{aligned}',
      why: '\\frac{\\partial\\mathcal{L}}{\\partial W_{hy}}=\\sum_{t=1}^{3}h_t^{\\top}dz_t=' + matTex(EX.dWhy, 4) + '.',
      whh: '\\begin{aligned}\\frac{\\partial\\mathcal{L}}{\\partial W_{hh}}&=' + matTex(EX.dWhh, 4) +
        ',\\qquad\\frac{\\partial\\mathcal{L}}{\\partial W_{xh}}=' + matTex(EX.dWxh, 4) +
        ',\\\\[4pt]\\frac{\\partial\\mathcal{L}}{\\partial b_h}&=' + rowTex(EX.dbh, 4) +
        ',\\qquad\\frac{\\partial\\mathcal{L}}{\\partial b_y}=' + rowTex(EX.dby, 4) + '.\\end{aligned}',
      check: '\\begin{aligned}\\left\\|\\frac{\\partial h_3}{\\partial h_2}\\right\\|&=' + fx(EX.n3, 3) +
        ',\\qquad\\left\\|\\frac{\\partial h_2}{\\partial h_1}\\right\\|=' + fx(EX.n2, 3) +
        ',\\\\[4pt]\\left\\|\\frac{\\partial h_3}{\\partial h_1}\\right\\|&=' + fx(EX.nProd, 3) +
        '\\;\\le\\;' + fx(EX.n3, 3) + '\\cdot' + fx(EX.n2, 3) + '.\\end{aligned}'
    };
    applyTex('data-bn-tex', table);
  }

  /* ---------------- интерактив: такт времени ---------------- */

  function initTimeStep() {
    var svg = document.getElementById('rnSeq');
    if (!svg) return;
    var rows = [1, 2, 3].map(function (index) { return svg.querySelector('[data-row="' + index + '"]'); });
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-seq-step]'));
    var vecLabel = document.getElementById('rnSeqVec');
    var targetLabel = document.getElementById('rnSeqTarget');
    var current = 1;
    function update() {
      rows.forEach(function (row, index) { if (row) row.style.opacity = index + 1 === current ? '1' : '.16'; });
      buttons.forEach(function (button) {
        var on = Number(button.getAttribute('data-seq-step')) === current;
        button.classList.toggle('active', on);
        button.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      vecLabel.textContent = '(' + Xseq[current - 1].join(', ') + ')';
      targetLabel.textContent = vocab[targets[current - 1]];
    }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        current = Number(button.getAttribute('data-seq-step'));
        update();
      });
    });
    update();
  }

  /* ---------------- интерактив: tanh ---------------- */

  function initTanh() {
    var range = document.getElementById('rnTanhRange');
    if (!range) return;
    var curve = document.getElementById('rnTanhCurve');
    var deriv = document.getElementById('rnTanhDeriv');
    var guide = document.getElementById('rnTanhGuide');
    var dot = document.getElementById('rnTanhDot');
    var dotD = document.getElementById('rnTanhDotD');
    var aLabel = document.getElementById('rnTanhA');
    var hLabel = document.getElementById('rnTanhH');
    var dLabel = document.getElementById('rnTanhD');
    function sx(a) { return 70 + (a + 3) / 6 * 570; }
    function sy(v) { return 210 - v * 140; }
    var pathTanh = '', pathDeriv = '', i, a;
    for (i = 0; i <= 180; i += 1) {
      a = -3 + 6 * i / 180;
      pathTanh += (i ? ' L' : 'M') + sx(a).toFixed(2) + ' ' + sy(Math.tanh(a)).toFixed(2);
      pathDeriv += (i ? ' L' : 'M') + sx(a).toFixed(2) + ' ' + sy(1 - Math.tanh(a) * Math.tanh(a)).toFixed(2);
    }
    curve.setAttribute('d', pathTanh);
    deriv.setAttribute('d', pathDeriv);
    function update() {
      var value = Number(range.value);
      var h = Math.tanh(value);
      var d = 1 - h * h;
      var x = sx(value);
      dot.setAttribute('cx', x); dot.setAttribute('cy', sy(h));
      dotD.setAttribute('cx', x); dotD.setAttribute('cy', sy(d));
      guide.setAttribute('x1', x); guide.setAttribute('x2', x);
      guide.setAttribute('y1', sy(Math.min(0, h))); guide.setAttribute('y2', sy(d));
      aLabel.textContent = minus(value.toFixed(2));
      hLabel.textContent = minus(h.toFixed(4));
      dLabel.textContent = d.toFixed(4);
    }
    range.addEventListener('input', update);
    update();
  }

  /* ---------------- интерактив: число параметров ---------------- */

  function initParams() {
    var range = document.getElementById('rnParamsRange');
    if (!range) return;
    var E = 4, O = 4;
    var bars = {
      xh: [document.getElementById('rnBarXh'), document.getElementById('rnValXh')],
      hh: [document.getElementById('rnBarHh'), document.getElementById('rnValHh')],
      hy: [document.getElementById('rnBarHy'), document.getElementById('rnValHy')],
      b: [document.getElementById('rnBarB'), document.getElementById('rnValB')]
    };
    function setBar(pair, value, max) {
      var width = Math.max(8, value / max * 400);
      pair[0].setAttribute('width', width.toFixed(1));
      pair[1].setAttribute('x', (210 + width + 12).toFixed(1));
      pair[1].textContent = value;
    }
    function update() {
      var H = Number(range.value);
      var pXh = E * H, pHh = H * H, pHy = H * O, pB = H + O;
      var total = pXh + pHh + pHy + pB;
      var max = Math.max(pXh, pHh, pHy, pB);
      setBar(bars.xh, pXh, max);
      setBar(bars.hh, pHh, max);
      setBar(bars.hy, pHy, max);
      setBar(bars.b, pB, max);
      document.getElementById('rnParamsH').textContent = H;
      document.getElementById('rnParamsTotal').textContent = total;
      document.getElementById('rnParamsShare').textContent = Math.round(pHh / total * 100) + '%';
    }
    range.addEventListener('input', update);
    update();
  }

  /* ---------------- интерактив: кросс-энтропия шага ---------------- */

  function initCrossEntropy() {
    var range = document.getElementById('rnCERange');
    if (!range) return;
    var curve = document.getElementById('rnCECurve');
    var guide = document.getElementById('rnCEGuide');
    var dot = document.getElementById('rnCEDot');
    var pLabel = document.getElementById('rnCEP');
    var stepLabel = document.getElementById('rnCEStep');
    var totalLabel = document.getElementById('rnCETotal');
    function sx(p) { return 75 + p * 560; }
    function sy(loss) { return 360 - Math.min(loss, 4) / 4 * 300; }
    var path = '', i, p;
    for (i = 0; i <= 200; i += 1) {
      p = 0.018 + (1 - 0.018) * i / 200;
      path += (i ? ' L' : 'M') + sx(p).toFixed(2) + ' ' + sy(-Math.log(p)).toFixed(2);
    }
    curve.setAttribute('d', path);
    function update() {
      var value = Number(range.value);
      var loss = -Math.log(value);
      var x = sx(value), y = sy(loss);
      dot.setAttribute('cx', x); dot.setAttribute('cy', y);
      guide.setAttribute('x1', x); guide.setAttribute('x2', x); guide.setAttribute('y2', y);
      pLabel.textContent = value.toFixed(3);
      stepLabel.textContent = loss.toFixed(3);
      totalLabel.textContent = ((loss + EX.Ls[1] + EX.Ls[2]) / 3).toFixed(3);
    }
    range.addEventListener('input', update);
    update();
  }

  /* ---------------- интерактив: затухание и взрыв ---------------- */

  function initDecay() {
    var range = document.getElementById('rnDecayRange');
    if (!range) return;
    var curve = document.getElementById('rnDecayCurve');
    var dot = document.getElementById('rnDecayDot');
    var gLabel = document.getElementById('rnDecayG');
    var mLabel = document.getElementById('rnDecayM');
    var kLabel = document.getElementById('rnDecayK');
    function sx(k) { return 80 + (k - 1) / 19 * 568; }
    function sy(m) {
      var lg = Math.log(m) / Math.LN10;
      if (lg > 3) lg = 3;
      if (lg < -12) lg = -12;
      return 350 - (lg + 12) / 15 * 290;
    }
    function update() {
      var gamma = Number(range.value);
      var path = '', k, m;
      for (k = 1; k <= 20; k += 1) {
        m = Math.pow(gamma, k);
        path += (k === 1 ? 'M' : ' L') + sx(k).toFixed(2) + ' ' + sy(m).toFixed(2);
      }
      curve.setAttribute('d', path);
      var last = Math.pow(gamma, 20);
      dot.setAttribute('cx', sx(20)); dot.setAttribute('cy', sy(last));
      gLabel.textContent = gamma.toFixed(2);
      mLabel.textContent = powerFmt(last);
      if (gamma < 1) {
        kLabel.textContent = Math.ceil(-6 / (Math.log(gamma) / Math.LN10));
      } else if (gamma > 1) {
        kLabel.textContent = 'никогда';
      } else {
        kLabel.textContent = 'никогда';
      }
    }
    range.addEventListener('input', update);
    update();
  }

  function boot() {
    initForwardNumeric();
    initBpttNumeric();
    initStages();
    initTimeStep();
    initTanh();
    initParams();
    initCrossEntropy();
    initDecay();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
</script>


<script>
(function () {
  'use strict';

  function initLegacyPdfStage(id) {
    var stage = document.getElementById(id);
    if (!stage || stage.dataset.legacyReady === '1') return;
    var steps = Array.prototype.slice.call(stage.querySelectorAll('.step-panel'));
    var prev = stage.querySelector('[data-prev]');
    var next = stage.querySelector('[data-next]');
    var counter = stage.querySelector('.stage-counter');
    var progress = stage.querySelector('.stage-progress');
    var groups = Array.prototype.slice.call(stage.querySelectorAll('svg [data-key]'));
    if (!steps.length || !prev || !next || !counter || !progress) return;

    var ticks = steps.map(function () {
      var tick = document.createElement('i');
      progress.appendChild(tick);
      return tick;
    });
    var cur = 0;

    function render() {
      steps.forEach(function (panel, index) {
        panel.classList.toggle('active', index === cur);
      });
      var visible = (steps[cur].getAttribute('data-show') || '').split(/\s+/).filter(Boolean);
      groups.forEach(function (group) {
        group.setAttribute('opacity', visible.indexOf(group.getAttribute('data-key')) !== -1 ? '1' : '0');
      });
      ticks.forEach(function (tick, index) {
        tick.classList.toggle('done', index <= cur);
      });
      counter.textContent = (cur + 1) + ' из ' + steps.length;
      prev.disabled = cur === 0;
      next.textContent = cur === steps.length - 1 ? 'Сначала ↺' : 'Далее →';
    }

    prev.addEventListener('click', function () {
      if (cur > 0) { cur -= 1; render(); }
    });
    next.addEventListener('click', function () {
      cur = cur === steps.length - 1 ? 0 : cur + 1;
      render();
    });
    stage.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        cur = cur === steps.length - 1 ? 0 : cur + 1;
        render();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (cur > 0) { cur -= 1; render(); }
      }
    });

    stage.dataset.legacyReady = '1';
    render();
  }

  initLegacyPdfStage('stage-pdf');
  initLegacyPdfStage('stage-bptt');
})();
</script>
