
<style>
  .console {
    background: #1D1B17; color: #E8E4DA; border-radius: 12px;
    padding: 15px 18px; margin: 22px 0; overflow-x: auto;
    font-family: Menlo, Consolas, "Courier New", monospace;
    font-size: 13.5px; line-height: 1.6; white-space: pre;
  }
  .console .cmd { color: #8FD14F; }
  .console .cdim { color: #8C877D; }
  .console .chi { color: #FFD166; }
  .console-title {
    font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
    color: #5E5850; font-weight: 800; margin: 26px 0 -12px;
  }
</style>



<p class="lead">
  Обучение — это один и тот же цикл из пяти действий, повторённый 1260 раз. Мы прогоним
  его целиком на настоящих данных: от рукописной цифры в 64 числа и случайных весов
  до 97,78 % на картинках, которых сеть не видела ни разу.
</p>

<p>
  Статья самодостаточна: все формулы выводятся здесь же, из определения производной и правила
  цепочки, и ни одна не берётся готовой «из учебника». Из математики нужны только производная
  сложной функции и умножение матриц. Всё остальное — арифметика, которую можно проверить
  на калькуляторе: каждое ключевое число в статье посчитано и показано целиком, вместе
  со слагаемыми, из которых оно сложилось.
</p>

<p>
  Набор данных — <strong>digits</strong> из scikit-learn: 1797 рукописных цифр в разрешении 8 × 8.
  Это ближайшая родня MNIST, только меньше: каждая клетка здесь — количество закрашенных точек
  в блоке 4 × 4 исходного скана 32 × 32, поэтому значения целые и лежат от 0 до 16.
  Маленький размер выбран намеренно: всю картинку видно на экране целиком, все 64 числа можно
  выписать, а полное обучение укладывается в доли секунды — значит, любой эксперимент из статьи
  можно повторить и проверить.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Производная сложной функции и умножение матриц</strong>
    <p>Больше ничего не нужно: все формулы сети выводятся в статье с нуля, а каждое число показано вместе со слагаемыми.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Четыре цифры: 3, 5, 2, 8</strong>
    <p>Один батч из четырёх картинок проходит все формулы статьи, а затем — полный прогон в 30 эпох.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Цикл обучения целиком</strong>
    <p>Вы сможете написать обучение сети на голом numpy и объяснить каждое число в её логе.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные: картинки и метки</span>
  <span><i style="background:#C29E08"></i>параметры и операции</span>
  <span><i style="background:#73B222"></i>то, что сеть посчитала</span>
  <span><i style="background:#C30B0A"></i>потеря и градиенты</span>
</div>

<p>
  Внутри схем работает ещё одно правило: <strong>тёмная заливка — то, что обучается</strong>
  (веса и смещения), <strong>светлая — то, что пересчитывается заново</strong> на каждом батче
  и выбрасывается. Разделение на эти две группы — самое полезное, что стоит унести из первых двух частей.
</p>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не на всю схему сразу,
  а только на яркую часть. Расположение блоков не меняется от шага к шагу, поэтому переключается
  именно смысл, а не картинка перед глазами. Каждая пара сцен устроена одинаково: сначала формы и
  формулы, потом те же шаги с подставленными числами. Стрелки ← → на клавиатуре работают, когда сцена в фокусе.
</div>

## Часть 1. Что лежит на входе

<p>
  Сеть не работает с картинками. Она работает с матрицами чисел, и первое, что нужно сделать, —
  честно превратить одно в другое. Картинка 8 × 8 — это решётка из 64 клеток, в каждой целое
  число от 0 до 16. Мы делим их на 16, чтобы получить диапазон от 0 до 1, и выкладываем строки
  одну за другой в единый ряд длиной 64.
</p>

<p>
  Этот ряд — <strong>вектор признаков</strong> одной картинки. Порядок клеток в нём произвольный,
  но зафиксированный: важно лишь, чтобы одна и та же клетка всегда попадала в одну и ту же позицию.
  Информация о том, что клетки 11 и 12 были соседями, при этом теряется безвозвратно —
  полносвязная сеть про геометрию картинки не знает ничего и восстанавливать её не будет.
</p>

<div class="math-display" data-tex="X \in \mathbb{R}^{B \times 64}, \qquad Y \in \{0,1\}^{B \times 10}, \qquad \sum_{c} y_{ic} = 1"></div>

<p>
  Правильный ответ тоже становится числами: класс «3» записывается строкой из десяти чисел с
  единицей на третьем месте. Такая запись называется <strong>one-hot</strong>, и нужна она затем,
  чтобы ответ сети и правду можно было сравнить одной формулой, без ветвлений по номеру класса.
</p>

<div class="callout-blue">
  <strong>Почему делим именно на 16:</strong> максимальное значение клетки в этом наборе — 16,
  потому что клетка получена подсчётом закрашенных точек в блоке 4 × 4. Деление на максимум —
  простейшая нормировка. В части 11 будет видно, что это не косметика: без неё та же скорость
  обучения разваливает сеть.
</div>

<p>Посмотрим пошагово, как одна картинка превращается в строку матрицы.</p>

<div class="stage" id="stageDT" tabindex="0">
  <div class="stage-figure">
<svg id="dt" viewBox="0 0 960 620" role="img" aria-label="Картинка восемь на восемь превращается в строку из 64 чисел и в матрицу батча">
  <style>
    #dt { font-family: Helvetica, Arial, sans-serif; }
    #dt .lbl { font-size: 16px; fill: #111111; }
    #dt .cap { font-size: 13px; fill: #5E5850; }
    #dt .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #dt .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #dt .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #dt .legend { font-size: 13px; fill: #5E5850; }
    #dt .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="dt-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="dt-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="dt-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<g data-key="img">
<text x="40" y="64" class="cap">8 × 8 пикселей · значение каждого от 0 до 16</text>
<rect x="40" y="76" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="57" y="97" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="74" y="76" width="34" height="34" fill="rgb(239,239,239)"/>
<text x="91" y="97" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="108" y="76" width="34" height="34" fill="rgb(128,128,128)"/>
<text x="125" y="97" text-anchor="middle" font-size="12" fill="#5E5850">8</text>
<rect x="142" y="76" width="34" height="34" fill="rgb(32,32,32)"/>
<text x="159" y="97" text-anchor="middle" font-size="12" fill="#FFFFFF">14</text>
<rect x="176" y="76" width="34" height="34" fill="rgb(16,16,16)"/>
<text x="193" y="97" text-anchor="middle" font-size="12" fill="#FFFFFF">15</text>
<rect x="210" y="76" width="34" height="34" fill="rgb(223,223,223)"/>
<text x="227" y="97" text-anchor="middle" font-size="12" fill="#5E5850">2</text>
<rect x="244" y="76" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="261" y="97" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="278" y="76" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="295" y="97" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="40" y="110" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="57" y="131" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="74" y="110" width="34" height="34" fill="rgb(223,223,223)"/>
<text x="91" y="131" text-anchor="middle" font-size="12" fill="#5E5850">2</text>
<rect x="108" y="110" width="34" height="34" fill="rgb(48,48,48)"/>
<text x="125" y="131" text-anchor="middle" font-size="12" fill="#FFFFFF">13</text>
<rect x="142" y="110" width="34" height="34" fill="rgb(112,112,112)"/>
<text x="159" y="131" text-anchor="middle" font-size="12" fill="#FFFFFF">9</text>
<rect x="176" y="110" width="34" height="34" fill="rgb(32,32,32)"/>
<text x="193" y="131" text-anchor="middle" font-size="12" fill="#FFFFFF">14</text>
<rect x="210" y="110" width="34" height="34" fill="rgb(128,128,128)"/>
<text x="227" y="131" text-anchor="middle" font-size="12" fill="#5E5850">8</text>
<rect x="244" y="110" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="261" y="131" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="278" y="110" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="295" y="131" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="40" y="144" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="57" y="165" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="74" y="144" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="91" y="165" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="108" y="144" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="125" y="165" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="142" y="144" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="159" y="165" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="176" y="144" width="34" height="34" fill="rgb(64,64,64)"/>
<text x="193" y="165" text-anchor="middle" font-size="12" fill="#FFFFFF">12</text>
<rect x="210" y="144" width="34" height="34" fill="rgb(112,112,112)"/>
<text x="227" y="165" text-anchor="middle" font-size="12" fill="#FFFFFF">9</text>
<rect x="244" y="144" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="261" y="165" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="278" y="144" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="295" y="165" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="40" y="178" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="57" y="199" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="74" y="178" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="91" y="199" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="108" y="178" width="34" height="34" fill="rgb(223,223,223)"/>
<text x="125" y="199" text-anchor="middle" font-size="12" fill="#5E5850">2</text>
<rect x="142" y="178" width="34" height="34" fill="rgb(48,48,48)"/>
<text x="159" y="199" text-anchor="middle" font-size="12" fill="#FFFFFF">13</text>
<rect x="176" y="178" width="34" height="34" fill="rgb(48,48,48)"/>
<text x="193" y="199" text-anchor="middle" font-size="12" fill="#FFFFFF">13</text>
<rect x="210" y="178" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="227" y="199" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="244" y="178" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="261" y="199" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="278" y="178" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="295" y="199" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="40" y="212" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="57" y="233" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="74" y="212" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="91" y="233" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="108" y="212" width="34" height="34" fill="rgb(207,207,207)"/>
<text x="125" y="233" text-anchor="middle" font-size="12" fill="#5E5850">3</text>
<rect x="142" y="212" width="34" height="34" fill="rgb(16,16,16)"/>
<text x="159" y="233" text-anchor="middle" font-size="12" fill="#FFFFFF">15</text>
<rect x="176" y="212" width="34" height="34" fill="rgb(0,0,0)"/>
<text x="193" y="233" text-anchor="middle" font-size="12" fill="#FFFFFF">16</text>
<rect x="210" y="212" width="34" height="34" fill="rgb(159,159,159)"/>
<text x="227" y="233" text-anchor="middle" font-size="12" fill="#5E5850">6</text>
<rect x="244" y="212" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="261" y="233" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="278" y="212" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="295" y="233" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="40" y="246" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="57" y="267" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="74" y="246" width="34" height="34" fill="rgb(239,239,239)"/>
<text x="91" y="267" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="108" y="246" width="34" height="34" fill="rgb(239,239,239)"/>
<text x="125" y="267" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="142" y="246" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="159" y="267" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="176" y="246" width="34" height="34" fill="rgb(64,64,64)"/>
<text x="193" y="267" text-anchor="middle" font-size="12" fill="#FFFFFF">12</text>
<rect x="210" y="246" width="34" height="34" fill="rgb(32,32,32)"/>
<text x="227" y="267" text-anchor="middle" font-size="12" fill="#FFFFFF">14</text>
<rect x="244" y="246" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="261" y="267" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="278" y="246" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="295" y="267" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="40" y="280" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="57" y="301" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="74" y="280" width="34" height="34" fill="rgb(175,175,175)"/>
<text x="91" y="301" text-anchor="middle" font-size="12" fill="#5E5850">5</text>
<rect x="108" y="280" width="34" height="34" fill="rgb(48,48,48)"/>
<text x="125" y="301" text-anchor="middle" font-size="12" fill="#FFFFFF">13</text>
<rect x="142" y="280" width="34" height="34" fill="rgb(175,175,175)"/>
<text x="159" y="301" text-anchor="middle" font-size="12" fill="#5E5850">5</text>
<rect x="176" y="280" width="34" height="34" fill="rgb(159,159,159)"/>
<text x="193" y="301" text-anchor="middle" font-size="12" fill="#5E5850">6</text>
<rect x="210" y="280" width="34" height="34" fill="rgb(0,0,0)"/>
<text x="227" y="301" text-anchor="middle" font-size="12" fill="#FFFFFF">16</text>
<rect x="244" y="280" width="34" height="34" fill="rgb(239,239,239)"/>
<text x="261" y="301" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="278" y="280" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="295" y="301" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="40" y="314" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="57" y="335" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="74" y="314" width="34" height="34" fill="rgb(239,239,239)"/>
<text x="91" y="335" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="108" y="314" width="34" height="34" fill="rgb(112,112,112)"/>
<text x="125" y="335" text-anchor="middle" font-size="12" fill="#FFFFFF">9</text>
<rect x="142" y="314" width="34" height="34" fill="rgb(64,64,64)"/>
<text x="159" y="335" text-anchor="middle" font-size="12" fill="#FFFFFF">12</text>
<rect x="176" y="314" width="34" height="34" fill="rgb(48,48,48)"/>
<text x="193" y="335" text-anchor="middle" font-size="12" fill="#FFFFFF">13</text>
<rect x="210" y="314" width="34" height="34" fill="rgb(112,112,112)"/>
<text x="227" y="335" text-anchor="middle" font-size="12" fill="#FFFFFF">9</text>
<rect x="244" y="314" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="261" y="335" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="278" y="314" width="34" height="34" fill="rgb(255,255,255)"/>
<text x="295" y="335" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<line x1="40" y1="76" x2="40" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="74" y1="76" x2="74" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="108" y1="76" x2="108" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="142" y1="76" x2="142" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="176" y1="76" x2="176" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="210" y1="76" x2="210" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="244" y1="76" x2="244" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="278" y1="76" x2="278" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="312" y1="76" x2="312" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="40" y1="76" x2="312" y2="76" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="40" y1="110" x2="312" y2="110" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="40" y1="144" x2="312" y2="144" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="40" y1="178" x2="312" y2="178" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="40" y1="212" x2="312" y2="212" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="40" y1="246" x2="312" y2="246" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="40" y1="280" x2="312" y2="280" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="40" y1="314" x2="312" y2="314" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="40" y1="348" x2="312" y2="348" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="40" y="76" width="272" height="272" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="40" y="372" class="cap">объект №1262 обучающей выборки · это цифра 3</text>
</g>
<g data-key="one" data-only="1">
<rect x="142" y="76" width="34" height="34" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<line x1="176" y1="93" x2="250" y2="404" stroke="#C30B0A" stroke-width="1.2" stroke-dasharray="4 3"/>
<text x="40" y="404" class="cap">одна клетка — одно число:</text>
<text x="40" y="422" class="cap">0 — фон, 16 — самый тёмный штрих</text>
<text x="40" y="444" class="cap">почти половина клеток нулевые,</text>
<text x="40" y="462" class="cap">а 4 клетки — у всех картинок сразу</text>
</g>
<g data-key="strip">
<text x="360" y="84" class="cap">делим на 16 и вытягиваем строку за строкой</text>
<rect x="360.00" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="368.75" y="96" width="8.75" height="26" fill="rgb(239,239,239)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="377.50" y="96" width="8.75" height="26" fill="rgb(128,128,128)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="386.25" y="96" width="8.75" height="26" fill="rgb(32,32,32)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="395.00" y="96" width="8.75" height="26" fill="rgb(16,16,16)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="403.75" y="96" width="8.75" height="26" fill="rgb(223,223,223)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="412.50" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="421.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="430.00" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="438.75" y="96" width="8.75" height="26" fill="rgb(223,223,223)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="447.50" y="96" width="8.75" height="26" fill="rgb(48,48,48)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="456.25" y="96" width="8.75" height="26" fill="rgb(112,112,112)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="465.00" y="96" width="8.75" height="26" fill="rgb(32,32,32)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="473.75" y="96" width="8.75" height="26" fill="rgb(128,128,128)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="482.50" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="491.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="500.00" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="508.75" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="517.50" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="526.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="535.00" y="96" width="8.75" height="26" fill="rgb(64,64,64)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="543.75" y="96" width="8.75" height="26" fill="rgb(112,112,112)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="552.50" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="561.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="570.00" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="578.75" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="587.50" y="96" width="8.75" height="26" fill="rgb(223,223,223)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="596.25" y="96" width="8.75" height="26" fill="rgb(48,48,48)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="605.00" y="96" width="8.75" height="26" fill="rgb(48,48,48)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="613.75" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="622.50" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="631.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="640.00" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="648.75" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="657.50" y="96" width="8.75" height="26" fill="rgb(207,207,207)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="666.25" y="96" width="8.75" height="26" fill="rgb(16,16,16)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="675.00" y="96" width="8.75" height="26" fill="rgb(0,0,0)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="683.75" y="96" width="8.75" height="26" fill="rgb(159,159,159)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="692.50" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="701.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="710.00" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="718.75" y="96" width="8.75" height="26" fill="rgb(239,239,239)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="727.50" y="96" width="8.75" height="26" fill="rgb(239,239,239)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="736.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="745.00" y="96" width="8.75" height="26" fill="rgb(64,64,64)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="753.75" y="96" width="8.75" height="26" fill="rgb(32,32,32)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="762.50" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="771.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="780.00" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="788.75" y="96" width="8.75" height="26" fill="rgb(175,175,175)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="797.50" y="96" width="8.75" height="26" fill="rgb(48,48,48)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="806.25" y="96" width="8.75" height="26" fill="rgb(175,175,175)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="815.00" y="96" width="8.75" height="26" fill="rgb(159,159,159)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="823.75" y="96" width="8.75" height="26" fill="rgb(0,0,0)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="832.50" y="96" width="8.75" height="26" fill="rgb(239,239,239)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="841.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="850.00" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="858.75" y="96" width="8.75" height="26" fill="rgb(239,239,239)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="867.50" y="96" width="8.75" height="26" fill="rgb(112,112,112)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="876.25" y="96" width="8.75" height="26" fill="rgb(64,64,64)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="885.00" y="96" width="8.75" height="26" fill="rgb(48,48,48)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="893.75" y="96" width="8.75" height="26" fill="rgb(112,112,112)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="902.50" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="911.25" y="96" width="8.75" height="26" fill="rgb(255,255,255)" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="360" y="96" width="560" height="26" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="360" y="140" class="nm">x — одна картинка, 64 числа от 0 до 1</text>
</g>
<g data-key="batch">
<rect x="360" y="170" width="560" height="104" fill="#3576C0" fill-opacity="0.55" stroke="#3576C0" stroke-width="1.6"/>
<line x1="395.0" y1="170" x2="395.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="430.0" y1="170" x2="430.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="465.0" y1="170" x2="465.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="500.0" y1="170" x2="500.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="535.0" y1="170" x2="535.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="570.0" y1="170" x2="570.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="605.0" y1="170" x2="605.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="640.0" y1="170" x2="640.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="675.0" y1="170" x2="675.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="710.0" y1="170" x2="710.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="745.0" y1="170" x2="745.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="780.0" y1="170" x2="780.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="815.0" y1="170" x2="815.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="850.0" y1="170" x2="850.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="885.0" y1="170" x2="885.0" y2="274" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="360" y1="196.0" x2="920" y2="196.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="360" y1="222.0" x2="920" y2="222.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="360" y1="248.0" x2="920" y2="248.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="640" y="161" class="dim" text-anchor="middle">4 × 64</text>
<text x="640" y="296" class="nm" text-anchor="middle">X — батч из четырёх картинок</text>
</g>
<g data-key="more">
<rect x="360" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="374" y="330" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="388" y="330" width="14" height="14" fill="rgb(128,128,128)"/>
<rect x="402" y="330" width="14" height="14" fill="rgb(32,32,32)"/>
<rect x="416" y="330" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="430" y="330" width="14" height="14" fill="rgb(223,223,223)"/>
<rect x="444" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="458" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="360" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="374" y="344" width="14" height="14" fill="rgb(223,223,223)"/>
<rect x="388" y="344" width="14" height="14" fill="rgb(48,48,48)"/>
<rect x="402" y="344" width="14" height="14" fill="rgb(112,112,112)"/>
<rect x="416" y="344" width="14" height="14" fill="rgb(32,32,32)"/>
<rect x="430" y="344" width="14" height="14" fill="rgb(128,128,128)"/>
<rect x="444" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="458" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="360" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="374" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="388" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="402" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="416" y="358" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="430" y="358" width="14" height="14" fill="rgb(112,112,112)"/>
<rect x="444" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="458" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="360" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="374" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="388" y="372" width="14" height="14" fill="rgb(223,223,223)"/>
<rect x="402" y="372" width="14" height="14" fill="rgb(48,48,48)"/>
<rect x="416" y="372" width="14" height="14" fill="rgb(48,48,48)"/>
<rect x="430" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="444" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="458" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="360" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="374" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="388" y="386" width="14" height="14" fill="rgb(207,207,207)"/>
<rect x="402" y="386" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="416" y="386" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="430" y="386" width="14" height="14" fill="rgb(159,159,159)"/>
<rect x="444" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="458" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="360" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="374" y="400" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="388" y="400" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="402" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="416" y="400" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="430" y="400" width="14" height="14" fill="rgb(32,32,32)"/>
<rect x="444" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="458" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="360" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="374" y="414" width="14" height="14" fill="rgb(175,175,175)"/>
<rect x="388" y="414" width="14" height="14" fill="rgb(48,48,48)"/>
<rect x="402" y="414" width="14" height="14" fill="rgb(175,175,175)"/>
<rect x="416" y="414" width="14" height="14" fill="rgb(159,159,159)"/>
<rect x="430" y="414" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="444" y="414" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="458" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="360" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="374" y="428" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="388" y="428" width="14" height="14" fill="rgb(112,112,112)"/>
<rect x="402" y="428" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="416" y="428" width="14" height="14" fill="rgb(48,48,48)"/>
<rect x="430" y="428" width="14" height="14" fill="rgb(112,112,112)"/>
<rect x="444" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="458" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<line x1="360" y1="330" x2="360" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="374" y1="330" x2="374" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="388" y1="330" x2="388" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="402" y1="330" x2="402" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="416" y1="330" x2="416" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="330" x2="430" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="444" y1="330" x2="444" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="458" y1="330" x2="458" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="472" y1="330" x2="472" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="360" y1="330" x2="472" y2="330" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="360" y1="344" x2="472" y2="344" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="360" y1="358" x2="472" y2="358" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="360" y1="372" x2="472" y2="372" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="360" y1="386" x2="472" y2="386" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="360" y1="400" x2="472" y2="400" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="360" y1="414" x2="472" y2="414" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="360" y1="428" x2="472" y2="428" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="360" y1="442" x2="472" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="360" y="330" width="112" height="112" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="416" y="466" class="cap" text-anchor="middle">строка 1 · цифра 3</text>
<rect x="505" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="519" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="533" y="330" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="547" y="330" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="561" y="330" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="575" y="330" width="14" height="14" fill="rgb(175,175,175)"/>
<rect x="589" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="603" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="505" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="519" y="344" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="533" y="344" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="547" y="344" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="561" y="344" width="14" height="14" fill="rgb(80,80,80)"/>
<rect x="575" y="344" width="14" height="14" fill="rgb(143,143,143)"/>
<rect x="589" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="603" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="505" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="519" y="358" width="14" height="14" fill="rgb(191,191,191)"/>
<rect x="533" y="358" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="547" y="358" width="14" height="14" fill="rgb(112,112,112)"/>
<rect x="561" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="575" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="589" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="603" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="505" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="519" y="372" width="14" height="14" fill="rgb(128,128,128)"/>
<rect x="533" y="372" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="547" y="372" width="14" height="14" fill="rgb(32,32,32)"/>
<rect x="561" y="372" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="575" y="372" width="14" height="14" fill="rgb(143,143,143)"/>
<rect x="589" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="603" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="505" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="519" y="386" width="14" height="14" fill="rgb(143,143,143)"/>
<rect x="533" y="386" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="547" y="386" width="14" height="14" fill="rgb(32,32,32)"/>
<rect x="561" y="386" width="14" height="14" fill="rgb(96,96,96)"/>
<rect x="575" y="386" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="589" y="386" width="14" height="14" fill="rgb(207,207,207)"/>
<rect x="603" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="505" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="519" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="533" y="400" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="547" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="561" y="400" width="14" height="14" fill="rgb(96,96,96)"/>
<rect x="575" y="400" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="589" y="400" width="14" height="14" fill="rgb(191,191,191)"/>
<rect x="603" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="505" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="519" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="533" y="414" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="547" y="414" width="14" height="14" fill="rgb(96,96,96)"/>
<rect x="561" y="414" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="575" y="414" width="14" height="14" fill="rgb(96,96,96)"/>
<rect x="589" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="603" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="505" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="519" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="533" y="428" width="14" height="14" fill="rgb(48,48,48)"/>
<rect x="547" y="428" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="561" y="428" width="14" height="14" fill="rgb(175,175,175)"/>
<rect x="575" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="589" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="603" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<line x1="505" y1="330" x2="505" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="519" y1="330" x2="519" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="533" y1="330" x2="533" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="547" y1="330" x2="547" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="561" y1="330" x2="561" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="575" y1="330" x2="575" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="589" y1="330" x2="589" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="603" y1="330" x2="603" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="617" y1="330" x2="617" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="505" y1="330" x2="617" y2="330" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="505" y1="344" x2="617" y2="344" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="505" y1="358" x2="617" y2="358" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="505" y1="372" x2="617" y2="372" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="505" y1="386" x2="617" y2="386" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="505" y1="400" x2="617" y2="400" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="505" y1="414" x2="617" y2="414" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="505" y1="428" x2="617" y2="428" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="505" y1="442" x2="617" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="505" y="330" width="112" height="112" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="561" y="466" class="cap" text-anchor="middle">строка 2 · цифра 5</text>
<rect x="650" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="664" y="330" width="14" height="14" fill="rgb(207,207,207)"/>
<rect x="678" y="330" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="692" y="330" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="706" y="330" width="14" height="14" fill="rgb(159,159,159)"/>
<rect x="720" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="734" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="748" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="650" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="664" y="344" width="14" height="14" fill="rgb(80,80,80)"/>
<rect x="678" y="344" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="692" y="344" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="706" y="344" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="720" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="734" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="748" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="650" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="664" y="358" width="14" height="14" fill="rgb(223,223,223)"/>
<rect x="678" y="358" width="14" height="14" fill="rgb(223,223,223)"/>
<rect x="692" y="358" width="14" height="14" fill="rgb(223,223,223)"/>
<rect x="706" y="358" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="720" y="358" width="14" height="14" fill="rgb(191,191,191)"/>
<rect x="734" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="748" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="650" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="664" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="678" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="692" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="706" y="372" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="720" y="372" width="14" height="14" fill="rgb(191,191,191)"/>
<rect x="734" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="748" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="650" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="664" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="678" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="692" y="386" width="14" height="14" fill="rgb(175,175,175)"/>
<rect x="706" y="386" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="720" y="386" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="734" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="748" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="650" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="664" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="678" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="692" y="400" width="14" height="14" fill="rgb(80,80,80)"/>
<rect x="706" y="400" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="720" y="400" width="14" height="14" fill="rgb(191,191,191)"/>
<rect x="734" y="400" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="748" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="650" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="664" y="414" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="678" y="414" width="14" height="14" fill="rgb(96,96,96)"/>
<rect x="692" y="414" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="706" y="414" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="720" y="414" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="734" y="414" width="14" height="14" fill="rgb(80,80,80)"/>
<rect x="748" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="650" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="664" y="428" width="14" height="14" fill="rgb(191,191,191)"/>
<rect x="678" y="428" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="692" y="428" width="14" height="14" fill="rgb(32,32,32)"/>
<rect x="706" y="428" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="720" y="428" width="14" height="14" fill="rgb(128,128,128)"/>
<rect x="734" y="428" width="14" height="14" fill="rgb(207,207,207)"/>
<rect x="748" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<line x1="650" y1="330" x2="650" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="664" y1="330" x2="664" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="678" y1="330" x2="678" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="692" y1="330" x2="692" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="706" y1="330" x2="706" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="720" y1="330" x2="720" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="734" y1="330" x2="734" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="748" y1="330" x2="748" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="762" y1="330" x2="762" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="650" y1="330" x2="762" y2="330" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="650" y1="344" x2="762" y2="344" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="650" y1="358" x2="762" y2="358" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="650" y1="372" x2="762" y2="372" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="650" y1="386" x2="762" y2="386" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="650" y1="400" x2="762" y2="400" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="650" y1="414" x2="762" y2="414" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="650" y1="428" x2="762" y2="428" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="650" y1="442" x2="762" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="650" y="330" width="112" height="112" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="706" y="466" class="cap" text-anchor="middle">строка 3 · цифра 2</text>
<rect x="795" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="809" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="823" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="837" y="330" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="851" y="330" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="865" y="330" width="14" height="14" fill="rgb(159,159,159)"/>
<rect x="879" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="893" y="330" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="795" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="809" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="823" y="344" width="14" height="14" fill="rgb(175,175,175)"/>
<rect x="837" y="344" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="851" y="344" width="14" height="14" fill="rgb(48,48,48)"/>
<rect x="865" y="344" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="879" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="893" y="344" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="795" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="809" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="823" y="358" width="14" height="14" fill="rgb(223,223,223)"/>
<rect x="837" y="358" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="851" y="358" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="865" y="358" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="879" y="358" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="893" y="358" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="795" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="809" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="823" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="837" y="372" width="14" height="14" fill="rgb(80,80,80)"/>
<rect x="851" y="372" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="865" y="372" width="14" height="14" fill="rgb(32,32,32)"/>
<rect x="879" y="372" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="893" y="372" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="795" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="809" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="823" y="386" width="14" height="14" fill="rgb(143,143,143)"/>
<rect x="837" y="386" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="851" y="386" width="14" height="14" fill="rgb(16,16,16)"/>
<rect x="865" y="386" width="14" height="14" fill="rgb(96,96,96)"/>
<rect x="879" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="893" y="386" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="795" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="809" y="400" width="14" height="14" fill="rgb(239,239,239)"/>
<rect x="823" y="400" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="837" y="400" width="14" height="14" fill="rgb(128,128,128)"/>
<rect x="851" y="400" width="14" height="14" fill="rgb(223,223,223)"/>
<rect x="865" y="400" width="14" height="14" fill="rgb(32,32,32)"/>
<rect x="879" y="400" width="14" height="14" fill="rgb(175,175,175)"/>
<rect x="893" y="400" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="795" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="809" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="823" y="414" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="837" y="414" width="14" height="14" fill="rgb(96,96,96)"/>
<rect x="851" y="414" width="14" height="14" fill="rgb(191,191,191)"/>
<rect x="865" y="414" width="14" height="14" fill="rgb(64,64,64)"/>
<rect x="879" y="414" width="14" height="14" fill="rgb(143,143,143)"/>
<rect x="893" y="414" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="795" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="809" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<rect x="823" y="428" width="14" height="14" fill="rgb(223,223,223)"/>
<rect x="837" y="428" width="14" height="14" fill="rgb(80,80,80)"/>
<rect x="851" y="428" width="14" height="14" fill="rgb(0,0,0)"/>
<rect x="865" y="428" width="14" height="14" fill="rgb(48,48,48)"/>
<rect x="879" y="428" width="14" height="14" fill="rgb(207,207,207)"/>
<rect x="893" y="428" width="14" height="14" fill="rgb(255,255,255)"/>
<line x1="795" y1="330" x2="795" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="809" y1="330" x2="809" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="823" y1="330" x2="823" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="837" y1="330" x2="837" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="851" y1="330" x2="851" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="865" y1="330" x2="865" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="879" y1="330" x2="879" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="893" y1="330" x2="893" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="907" y1="330" x2="907" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="795" y1="330" x2="907" y2="330" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="795" y1="344" x2="907" y2="344" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="795" y1="358" x2="907" y2="358" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="795" y1="372" x2="907" y2="372" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="795" y1="386" x2="907" y2="386" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="795" y1="400" x2="907" y2="400" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="795" y1="414" x2="907" y2="414" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="795" y1="428" x2="907" y2="428" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="795" y1="442" x2="907" y2="442" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="795" y="330" width="112" height="112" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="851" y="466" class="cap" text-anchor="middle">строка 4 · цифра 8</text>
</g>
<g data-key="onehot">
<text x="360" y="500" class="cap">метка — строка из десяти чисел: единица в своей клетке</text>
<rect x="360" y="512" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="372" y="527" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="384" y="512" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="396" y="527" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="408" y="512" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="420" y="527" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="432" y="512" width="24" height="22" fill="#73B222" fill-opacity="0.75" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="444" y="527" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="456" y="512" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="468" y="527" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="480" y="512" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="492" y="527" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="504" y="512" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="516" y="527" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="528" y="512" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="540" y="527" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="552" y="512" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="564" y="527" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="576" y="512" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="588" y="527" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="360" y="534" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="372" y="549" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="384" y="534" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="396" y="549" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="408" y="534" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="420" y="549" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="432" y="534" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="444" y="549" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="456" y="534" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="468" y="549" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="480" y="534" width="24" height="22" fill="#73B222" fill-opacity="0.75" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="492" y="549" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="504" y="534" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="516" y="549" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="528" y="534" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="540" y="549" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="552" y="534" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="564" y="549" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="576" y="534" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="588" y="549" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="360" y="556" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="372" y="571" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="384" y="556" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="396" y="571" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="408" y="556" width="24" height="22" fill="#73B222" fill-opacity="0.75" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="420" y="571" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="432" y="556" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="444" y="571" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="456" y="556" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="468" y="571" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="480" y="556" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="492" y="571" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="504" y="556" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="516" y="571" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="528" y="556" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="540" y="571" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="552" y="556" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="564" y="571" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="576" y="556" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="588" y="571" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="360" y="578" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="372" y="593" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="384" y="578" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="396" y="593" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="408" y="578" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="420" y="593" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="432" y="578" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="444" y="593" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="456" y="578" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="468" y="593" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="480" y="578" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="492" y="593" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="504" y="578" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="516" y="593" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="528" y="578" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="540" y="593" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="552" y="578" width="24" height="22" fill="#73B222" fill-opacity="0.75" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="564" y="593" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="576" y="578" width="24" height="22" fill="#FFFFFF" fill-opacity="1" stroke="#D8D4C8" stroke-width="0.8"/>
<text x="588" y="593" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<text x="616" y="548" class="nm">Y — метки батча</text>
<text x="616" y="572" class="cap">4 строки × 10 клеток</text>
</g>
<g data-key="split">
<text x="40" y="466" class="cap">все 1797 картинок делим раз и навсегда</text>
<rect x="40" y="478" width="204" height="30" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/>
<rect x="244" y="478" width="68" height="30" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="142" y="498" text-anchor="middle" font-size="13" fill="#111111">1347 обучение</text>
<text x="278" y="498" text-anchor="middle" font-size="12" fill="#111111">450</text>
<text x="40" y="528" class="cap">зелёную часть сеть не увидит ни разу</text>
</g>
<text x="40" y="612" class="legend">синий — данные · зелёный — то, что сеть должна выдать · красный — комментарий шага</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="img" data-focus="img">
      <div class="step-kicker">Шаг 1 · что такое картинка</div>
      <h4>Рукописная цифра — это решётка 8 × 8</h4>
<p>Набор digits из scikit-learn: 1797 рукописных цифр, каждая ужата до восьми на восемь клеток. В клетке лежит целое число от 0 до 16 — насколько эта клетка закрашена. Никаких «пикселей» сверх этого в задаче нет: картинка полностью описывается 64 числами.</p>
    </div>
    <div class="step-panel" data-on="img one" data-focus="one">
      <div class="step-kicker">Шаг 2 · клетка</div>
      <h4>Одна клетка — одно число, и половина из них нули</h4>
<p>По всей обучающей выборке 48,93 % клеток равны нулю: цифра занимает середину, поля пустые. Четыре клетки — №0, №24, №32 и №39 — нулевые у всех 1347 картинок сразу. Позже это даст занятный эффект: соответствующие им веса не сдвинутся за всё обучение ни на йоту.</p>
    </div>
    <div class="step-panel" data-on="img strip" data-focus="strip">
      <div class="step-kicker">Шаг 3 · вектор</div>
      <h4>Сеть не знает, что картинка квадратная</h4>
<p>Мы делим значения на 16 (теперь они от 0 до 1) и выкладываем строки одну за другой в единый ряд из 64 чисел. Порядок произвольный, но зафиксированный раз и навсегда: клетка №11 обязана всегда попадать в 11-ю позицию, иначе веса будут учиться на разных местах. Двумерность картинки при этом теряется — полносвязная сеть про соседство клеток ничего не знает.</p>
    </div>
    <div class="step-panel" data-on="img strip batch more" data-focus="batch">
      <div class="step-kicker">Шаг 4 · батч</div>
      <h4>Несколько картинок складываются в матрицу</h4>
<p>Сеть считает не по одной картинке, а пачками. Четыре строки, положенные друг на друга, дают матрицу <code>X</code> формы 4 × 64: строка — объект, столбец — клетка. Дальше вся арифметика статьи — это операции над такими прямоугольниками. В настоящем прогоне в батче 32 строки; от числа строк не меняется ни одна формула.</p>
    </div>
    <div class="step-panel" data-on="img strip batch more onehot" data-focus="onehot">
      <div class="step-kicker">Шаг 5 · правильный ответ</div>
      <h4>Метку тоже превращаем в строку чисел</h4>
<p>Класс «3» записывается как строка из десяти чисел, где на третьем месте единица, а на остальных нули. Такая запись называется one-hot. Она нужна, чтобы ответ сети (десять чисел) и правильный ответ (десять чисел) можно было сравнивать одной формулой.</p>
    </div>
    <div class="step-panel" data-on="img strip batch more onehot split" data-focus="split">
      <div class="step-kicker">Шаг 6 · честная проверка</div>
      <h4>450 картинок сеть не увидит ни разу</h4>
<p>Разбиение делается один раз: 1347 картинок в обучение, 450 — в отложенную выборку, доли классов сохранены. Всё, что мы дальше называем «точностью», меряется на этих 450. Иначе выученный наизусть ответ было бы не отличить от понимания.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<p class="console-title">Загрузка и разбиение · настоящий вывод скрипта</p>
<div class="console"><span class="cmd">$ python3 mnist8.py</span>
обучающая выборка: (1347, 64)  отложенная: (450, 64)
значения пикселя: 0.0 … 1.0
картинок каждого класса в обучении: [133 136 133 137 136 136 136 134 131 135]
</div>

<p>
  Разбиение делается один раз и с сохранением долей классов: в обучении 1347 картинок, в отложенной
  выборке — 450, и в каждой части все десять цифр представлены примерно поровну. Всё, что дальше
  называется точностью, измеряется только на этих 450.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> для сети данные — это ровно две матрицы, X и Y, с одинаковым
  числом строк. Строка X — картинка, строка Y — правильный ответ. Всё остальное в статье будет
  арифметикой над этими двумя прямоугольниками.
</div>

---

## Часть 2. Сеть: 2410 чисел между картинкой и ответом

<p>
  Архитектура выбрана самая обыкновенная: 64 входа, один скрытый слой из 32 нейронов, 10 выходов.
  Между ними — <strong>ReLU</strong>, на выходе — <strong>softmax</strong>. Никаких свёрток, нормализаций
  и остаточных связей: всё, что нужно для полного цикла обучения, здесь уже есть, а лишние детали
  только помешают увидеть цикл целиком.
</p>

<table class="shape-table">
  <tr><th>Объект</th><th>Что это</th><th>Форма</th><th>Чисел</th></tr>
  <tr><td><code>X</code></td><td>батч картинок</td><td>B × 64</td><td>пересчитывается</td></tr>
  <tr><td><code>W⁽¹⁾</code>, <code>b⁽¹⁾</code></td><td>первый линейный слой</td><td>64 × 32 и 32</td><td>2080</td></tr>
  <tr><td><code>Z⁽¹⁾</code>, <code>A⁽¹⁾</code></td><td>до и после ReLU</td><td>B × 32</td><td>пересчитывается</td></tr>
  <tr><td><code>W⁽²⁾</code>, <code>b⁽²⁾</code></td><td>второй линейный слой</td><td>32 × 10 и 10</td><td>330</td></tr>
  <tr><td><code>Z⁽²⁾</code>, <code>P</code></td><td>оценки и вероятности</td><td>B × 10</td><td>пересчитывается</td></tr>
  <tr><td><code>L</code></td><td>потеря батча</td><td>число</td><td>—</td></tr>
</table>

<p>
  Итого <strong>2410 обучаемых чисел</strong>, и 86,3 % из них живут в первом слое: он единственный,
  кто смотрит сразу на все 64 клетки. Размер скрытого слоя — единственная свобода, которой мы
  воспользовались; вот что он даёт при прочих равных условиях:
</p>

<table class="shape-table">
  <tr><th>Скрытый слой</th><th>4</th><th>8</th><th>16</th><th>32</th><th>64</th><th>128</th></tr>
  <tr><td>параметров</td><td>310</td><td>610</td><td>1210</td><td>2410</td><td>4810</td><td>9610</td></tr>
  <tr><td>точность, %</td><td>79,56</td><td>92,44</td><td>96,67</td><td>97,78</td><td>98,00</td><td>98,00</td></tr>
</table>

<p>
  Тридцать два нейрона — точка, после которой рост почти прекращается: удвоение и учетверение
  сети добавляют лишь 0,22 процентных пункта. Так что дальше в статье везде 64 → 32 → 10.
</p>

<p>Посмотрим пошагово, из чего сеть состоит и что в ней обучается.</p>

<div class="stage" id="stageAR" tabindex="0">
  <div class="stage-figure">
<svg id="ar" viewBox="0 0 960 560" role="img" aria-label="Карта сети: вход, скрытый слой, выходной слой, softmax и потеря; над стрелкой тензор, под стрелкой его форма">
  <style>
    #ar { font-family: Helvetica, Arial, sans-serif; }
    #ar .lbl { font-size: 16px; fill: #111111; }
    #ar .cap { font-size: 13px; fill: #5E5850; }
    #ar .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #ar .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #ar .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #ar .legend { font-size: 13px; fill: #5E5850; }
    #ar .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ar-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="ar-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="ar-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<defs><marker id="ar-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker></defs>
<text x="34" y="66" class="cap">над стрелкой — тензор, под стрелкой — его форма; W и b принадлежат своему слою</text>
<g data-key="inp">
<rect x="34" y="100" width="104" height="220" rx="10" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.8"/>
<text x="86" y="196" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 86 196)">Вход</text>
<text x="86" y="288" text-anchor="middle" font-size="13" fill="#5E5850">батч картинок</text>
</g>
<g data-key="lin1">
<line x1="144" y1="200" x2="208" y2="200" stroke="#73B222" stroke-width="2.6" fill="none" marker-end="url(#ar-arg)"/><text x="176" y="186" class="nm" text-anchor="middle">X</text><text x="176" y="222" class="dim" text-anchor="middle">4 × 64</text>
<rect x="214" y="100" width="104" height="220" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.8"/>
<text x="266" y="196" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 266 196)">Скрытый слой</text>
<text x="266" y="288" text-anchor="middle" font-size="13" fill="#5E5850">Linear 64 → 32</text>
</g>
<g data-key="relu"><text x="266" y="308" text-anchor="middle" font-size="13" fill="#73B222">+ ReLU</text></g>
<g data-key="par1">
<line x1="266.0" y1="406" x2="266.0" y2="324" stroke="#C29E08" stroke-width="1.6" fill="none"/><rect x="182" y="406" width="168" height="66" rx="8" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.7"/><text x="266" y="428" class="nm" text-anchor="middle">W⁽¹⁾, b⁽¹⁾</text><text x="266" y="448" class="dim" text-anchor="middle">64 × 32 · 32</text><text x="266" y="466" class="cap" text-anchor="middle">2080 чисел · 86,3 %</text>
</g>
<g data-key="lin2">
<line x1="324" y1="200" x2="388" y2="200" stroke="#73B222" stroke-width="2.6" fill="none" marker-end="url(#ar-arg)"/><text x="356" y="186" class="nm" text-anchor="middle">A⁽¹⁾</text><text x="356" y="222" class="dim" text-anchor="middle">4 × 32</text>
<rect x="394" y="100" width="104" height="220" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.8"/>
<text x="446" y="196" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 446 196)">Выходной слой</text>
<text x="446" y="288" text-anchor="middle" font-size="13" fill="#5E5850">Linear 32 → 10</text>
</g>
<g data-key="par2">
<line x1="446.0" y1="406" x2="446.0" y2="324" stroke="#C29E08" stroke-width="1.6" fill="none"/><rect x="362" y="406" width="168" height="66" rx="8" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.7"/><text x="446" y="428" class="nm" text-anchor="middle">W⁽²⁾, b⁽²⁾</text><text x="446" y="448" class="dim" text-anchor="middle">32 × 10 · 10</text><text x="446" y="466" class="cap" text-anchor="middle">330 чисел · 13,7 %</text>
</g>
<g data-key="soft">
<line x1="504" y1="200" x2="568" y2="200" stroke="#73B222" stroke-width="2.6" fill="none" marker-end="url(#ar-arg)"/><text x="536" y="186" class="nm" text-anchor="middle">Z⁽²⁾</text><text x="536" y="222" class="dim" text-anchor="middle">4 × 10</text>
<rect x="574" y="100" width="104" height="220" rx="10" fill="#F0FAF0" stroke="#73B222" stroke-width="1.8"/>
<text x="626" y="196" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 626 196)">Softmax</text>
<text x="626" y="288" text-anchor="middle" font-size="13" fill="#5E5850">в вероятности</text>
</g>
<g data-key="out">
<line x1="684" y1="200" x2="748" y2="200" stroke="#73B222" stroke-width="2.6" fill="none" marker-end="url(#ar-arg)"/><text x="716" y="186" class="nm" text-anchor="middle">P</text><text x="716" y="222" class="dim" text-anchor="middle">4 × 10</text>
<rect x="754" y="100" width="104" height="220" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="806" y="196" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 806 196)">Потеря</text>
<text x="806" y="288" text-anchor="middle" font-size="13" fill="#C30B0A">cross-entropy</text>
</g>
<g data-key="loss">
<rect x="754" y="400" width="104" height="46" rx="8" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/>
<text x="806" y="422" text-anchor="middle" font-size="13" fill="#111111">Y — метки</text>
<text x="806" y="440" class="dim" text-anchor="middle">4 × 10</text>
<line x1="806" y1="398" x2="806" y2="324" stroke="#3576C0" stroke-width="1.6" fill="none"/>
<text x="880" y="422" class="cap">одно</text>
<text x="880" y="440" class="cap">число L</text>
</g>
<g data-key="back" data-only="1">
<line x1="748" y1="356" x2="684" y2="356" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#ar-arr)"/><text x="716" y="342" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂P</text><text x="716" y="378" class="dim" text-anchor="middle">4 × 10</text>
<line x1="568" y1="356" x2="504" y2="356" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#ar-arr)"/><text x="536" y="342" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂Z⁽²⁾</text><text x="536" y="378" class="dim" text-anchor="middle">4 × 10</text>
<line x1="388" y1="356" x2="324" y2="356" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#ar-arr)"/><text x="356" y="342" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂A⁽¹⁾</text><text x="356" y="378" class="dim" text-anchor="middle">4 × 32</text>
<line x1="208" y1="356" x2="144" y2="356" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#ar-arr)"/><text x="176" y="342" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂X</text><text x="176" y="378" class="dim" text-anchor="middle">4 × 64</text>
</g>
<g data-key="count" data-only="1">
<rect x="180" y="404" width="172" height="70" rx="9" fill="none" stroke="#C30B0A" stroke-width="2"/>
<rect x="360" y="404" width="172" height="70" rx="9" fill="none" stroke="#C30B0A" stroke-width="2"/>
<text x="548" y="430" class="nm" fill="#C30B0A">всего 2410 обучаемых чисел</text>
<text x="548" y="452" class="cap">остальное живёт один батч</text>
</g>
<rect x="34" y="492" width="892" height="44" rx="10" fill="#FBFAF6" stroke="#E4E1D7" stroke-width="1.2"/>
<foreignObject x="54" y="498" width="852" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X \;\to\; Z^{(1)} \;\to\; A^{(1)} \;\to\; Z^{(2)} \;\to\; P \;\to\; L"></div></foreignObject>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="inp" data-focus="inp">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>На входе прямоугольник, а не картинка</h4>
<p>Сеть принимает матрицу 4 × 64: четыре картинки батча, у каждой 64 числа в строку. Ни про квадрат 8 × 8, ни про то, что соседние клетки рядом, она не знает — полносвязная сеть учит связи «клетка — признак» с нуля.</p>
    </div>
    <div class="step-panel" data-on="inp lin1 par1" data-focus="par1">
      <div class="step-kicker">Шаг 2 · скрытый слой</div>
      <h4>Матрица весов 64 × 32 и 32 смещения</h4>
<p>Слой умножает вход на W⁽¹⁾ и прибавляет строку b⁽¹⁾. Столбец матрицы — один скрытый нейрон: 64 веса, по одному на каждую клетку картинки. Всего 2080 чисел, и это 86,3 % всех параметров сети.</p>
    </div>
    <div class="step-panel" data-on="inp lin1 par1 relu" data-focus="relu">
      <div class="step-kicker">Шаг 3 · нелинейность</div>
      <h4>ReLU обнуляет всё отрицательное</h4>
<p>Она живёт внутри той же карточки, потому что не имеет параметров и не меняет форму: на входе 4 × 32, на выходе 4 × 32. Без неё два линейных слоя схлопнулись бы в один — произведение двух матриц снова матрица.</p>
    </div>
    <div class="step-panel" data-on="inp lin1 par1 relu lin2 par2" data-focus="par2">
      <div class="step-kicker">Шаг 4 · выходной слой</div>
      <h4>Из 32 признаков — 10 оценок</h4>
<p>Второй слой устроен так же и не подозревает, что перед ним был первый: он видит просто матрицу чисел. Его выход Z⁽²⁾ — по одной оценке на каждую цифру. Пока это произвольные числа, а не вероятности.</p>
    </div>
    <div class="step-panel" data-on="inp lin1 par1 relu lin2 par2 soft" data-focus="soft">
      <div class="step-kicker">Шаг 5 · softmax</div>
      <h4>Десять оценок превращаются в десять вероятностей</h4>
<p>Softmax возводит оценки в экспоненту и делит на сумму: числа становятся положительными и в сумме дают единицу. Порядок сохраняется — кто был больше, тот и остаётся больше. Формы это не меняет: 4 × 10 на входе, 4 × 10 на выходе.</p>
    </div>
    <div class="step-panel" data-on="inp lin1 par1 relu lin2 par2 soft out loss" data-focus="loss">
      <div class="step-kicker">Шаг 6 · потеря</div>
      <h4>Вся сеть сходится в одно число</h4>
<p>Последняя карточка принимает сразу два входа: ответ P и метки Y. На выходе — одно число на весь батч. Именно оно будет уменьшаться при обучении, и именно по нему берутся производные по всем 2410 параметрам.</p>
    </div>
    <div class="step-panel" data-on="inp lin1 par1 relu lin2 par2 soft out loss back" data-focus="back">
      <div class="step-kicker">Шаг 7 · тот же маршрут назад</div>
      <h4>Красные стрелки идут по тем же рёбрам, что и зелёные</h4>
<p>У каждого тензора на пути есть производная той же формы: у X она 4 × 64, у A⁽¹⁾ — 4 × 32, у P — 4 × 10. Обратный проход не строит новый граф, он просто идёт по нарисованным стрелкам справа налево. ∂L/∂X считать не нужно — под ним нет параметров, но форма у него та же, что у входа.</p>
    </div>
    <div class="step-panel" data-on="inp lin1 par1 relu lin2 par2 soft out loss back count" data-focus="count">
      <div class="step-kicker">Шаг 8 · что здесь обучается</div>
      <h4>Обучается только то, что висит под карточками</h4>
<p>W⁽¹⁾, b⁽¹⁾, W⁽²⁾, b⁽²⁾ — это состояние сети: 2410 чисел, которые меняются шаг за шагом и живут между батчами. X, A⁽¹⁾, Z⁽²⁾, P пересчитываются заново для каждого батча и выбрасываются. Обучить сеть — значит подобрать 2410 чисел так, чтобы вторая группа выдавала нужный ответ.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> сеть — это 2410 чисел плюс правило, как их применять.
  Числа живут между батчами и меняются при обучении; всё остальное — Z, A, P — рождается на каждом
  батче заново и тут же выбрасывается. Обучить сеть значит подобрать первую группу так, чтобы вторая
  выдавала нужный ответ.
</div>

---

## Часть 3. Прямой проход: сначала формы

<p>
  Прямой проход — это четыре строки арифметики. Прежде чем подставлять в них числа, стоит убедиться,
  что сходятся формы: почти все ошибки в коде сети — это перепутанные размерности, и ловятся
  они на бумаге за минуту.
</p>

<div class="math-display" data-tex="Z^{(1)} = X W^{(1)} + b^{(1)}, \qquad A^{(1)} = \max\left(0, Z^{(1)}\right)"></div>
<div class="math-display" data-tex="Z^{(2)} = A^{(1)} W^{(2)} + b^{(2)}, \qquad P = \mathrm{softmax}\left(Z^{(2)}\right)"></div>

<p>
  Мы держим объекты в строках: строка матрицы — одна картинка, и умножение идёт как
  <code>X · W</code>, а не <code>W · x</code>. Это соглашение отличается от того, что удобно при
  разборе одного примера (там вектор обычно записывают столбцом), но именно оно принято во всех
  библиотеках, потому что позволяет обрабатывать батч без единого дополнительного индекса.
</p>

<div class="callout-blue">
  <strong>Что означает «сокращение размерностей»:</strong> в произведении [B × 64] · [64 × 32]
  внутренние числа обязаны совпасть, а внешние дают форму результата — [B × 32]. Клетка результата
  собирает 64 произведения: всю картинку, взвешенную одним нейроном. Столбец матрицы весов —
  это и есть один нейрон, и таких столбцов 32.
</div>

<p>Посмотрим пошагово, как батч превращается в вероятности.</p>

<div class="stage" id="stageFW" tabindex="0">
  <div class="stage-figure">
<svg id="fw" viewBox="0 0 960 610" role="img" aria-label="Прямой проход: батч умножается на веса, проходит ReLU, второй слой и softmax">
  <style>
    #fw { font-family: Helvetica, Arial, sans-serif; }
    #fw .lbl { font-size: 16px; fill: #111111; }
    #fw .cap { font-size: 13px; fill: #5E5850; }
    #fw .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #fw .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #fw .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #fw .legend { font-size: 13px; fill: #5E5850; }
    #fw .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="fw-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="fw-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="fw-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">картинки → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">W⁽¹⁾ · b⁽¹⁾</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">ReLU</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">W⁽²⁾ · b⁽²⁾</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">softmax</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">потеря L</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="x">
<rect x="40" y="110" width="120" height="80" fill="#3576C0" fill-opacity="0.55" stroke="#3576C0" stroke-width="1.6"/>
<line x1="55.0" y1="110" x2="55.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="70.0" y1="110" x2="70.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="85.0" y1="110" x2="85.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="100.0" y1="110" x2="100.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="115.0" y1="110" x2="115.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="130.0" y1="110" x2="130.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="145.0" y1="110" x2="145.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="40" y1="130.0" x2="160" y2="130.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="40" y1="150.0" x2="160" y2="150.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="40" y1="170.0" x2="160" y2="170.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="100" y="101" class="dim" text-anchor="middle">4 × 64</text>
<text x="100" y="210" class="nm" text-anchor="middle">X</text>
</g>
<g data-key="w1">
<text x="176" y="158" class="lbl" text-anchor="middle">×</text>
<rect x="195" y="90" width="95" height="120" fill="#C29E08" fill-opacity="0.9" stroke="#C29E08" stroke-width="1.6"/>
<line x1="214.0" y1="90" x2="214.0" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="233.0" y1="90" x2="233.0" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="252.0" y1="90" x2="252.0" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="271.0" y1="90" x2="271.0" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="195" y1="105.0" x2="290" y2="105.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="195" y1="120.0" x2="290" y2="120.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="195" y1="135.0" x2="290" y2="135.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="195" y1="150.0" x2="290" y2="150.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="195" y1="165.0" x2="290" y2="165.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="195" y1="180.0" x2="290" y2="180.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="195" y1="195.0" x2="290" y2="195.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="242" y="81" class="dim" text-anchor="middle">64 × 32</text>
<text x="242" y="230" class="nm" text-anchor="middle">W⁽¹⁾</text>
</g>
<g data-key="b1">
<text x="303" y="158" class="lbl" text-anchor="middle">+</text>
<rect x="316" y="136" width="72" height="28" fill="#C29E08" fill-opacity="0.9" stroke="#C29E08" stroke-width="1.6"/>
<text x="352" y="155" text-anchor="middle" font-size="13" fill="#FFFFFF">b⁽¹⁾</text>
<text x="352" y="184" class="dim" text-anchor="middle">32</text>
</g>
<g data-key="z1">
<text x="402" y="158" class="lbl" text-anchor="middle">=</text>
<rect x="418" y="110" width="90" height="80" fill="#73B222" fill-opacity="0.5" stroke="#73B222" stroke-width="1.6"/>
<line x1="433.0" y1="110" x2="433.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="448.0" y1="110" x2="448.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="463.0" y1="110" x2="463.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="478.0" y1="110" x2="478.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="493.0" y1="110" x2="493.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="418" y1="130.0" x2="508" y2="130.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="418" y1="150.0" x2="508" y2="150.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="418" y1="170.0" x2="508" y2="170.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="463" y="101" class="dim" text-anchor="middle">4 × 32</text>
<text x="463" y="210" class="nm" text-anchor="middle">Z⁽¹⁾</text>
</g>
<g data-key="a1">
<line x1="512" y1="150" x2="558" y2="150" stroke="#73B222" stroke-width="1.4" fill="none" marker-end="url(#fw-arg)"/>
<text x="535" y="138" class="cap" text-anchor="middle">ReLU</text>
<rect x="566" y="110" width="90" height="80" fill="#73B222" fill-opacity="0.5" stroke="#73B222" stroke-width="1.6"/>
<line x1="581.0" y1="110" x2="581.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="596.0" y1="110" x2="596.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="611.0" y1="110" x2="611.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="626.0" y1="110" x2="626.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="641.0" y1="110" x2="641.0" y2="190" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="566" y1="130.0" x2="656" y2="130.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="566" y1="150.0" x2="656" y2="150.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="566" y1="170.0" x2="656" y2="170.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="611" y="101" class="dim" text-anchor="middle">4 × 32</text>
<text x="611" y="210" class="nm" text-anchor="middle">A⁽¹⁾</text>
</g>
<g data-key="a1b">
<line x1="611" y1="196" x2="611" y2="244" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#arw)"/>
<line x1="611" y1="244" x2="22" y2="244" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#arw)"/>
<line x1="22" y1="244" x2="22" y2="340" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#arw)"/>
<line x1="22" y1="340" x2="36" y2="340" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#arw)"/>
<rect x="40" y="300" width="90" height="80" fill="#73B222" fill-opacity="0.5" stroke="#73B222" stroke-width="1.6"/>
<line x1="55.0" y1="300" x2="55.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="70.0" y1="300" x2="70.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="85.0" y1="300" x2="85.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="100.0" y1="300" x2="100.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="115.0" y1="300" x2="115.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="40" y1="320.0" x2="130" y2="320.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="40" y1="340.0" x2="130" y2="340.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="40" y1="360.0" x2="130" y2="360.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="85" y="291" class="dim" text-anchor="middle">4 × 32</text>
<text x="85" y="400" class="nm" text-anchor="middle">A⁽¹⁾</text>
</g>
<g data-key="w2">
<text x="146" y="348" class="lbl" text-anchor="middle">×</text>
<rect x="162" y="285" width="75" height="110" fill="#C29E08" fill-opacity="0.9" stroke="#C29E08" stroke-width="1.6"/>
<line x1="180.8" y1="285" x2="180.8" y2="395" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="199.5" y1="285" x2="199.5" y2="395" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="218.2" y1="285" x2="218.2" y2="395" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="162" y1="303.3" x2="237" y2="303.3" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="162" y1="321.7" x2="237" y2="321.7" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="162" y1="340.0" x2="237" y2="340.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="162" y1="358.3" x2="237" y2="358.3" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="162" y1="376.7" x2="237" y2="376.7" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="200" y="276" class="dim" text-anchor="middle">32 × 10</text>
<text x="200" y="415" class="nm" text-anchor="middle">W⁽²⁾</text>
</g>
<g data-key="b2">
<text x="250" y="348" class="lbl" text-anchor="middle">+</text>
<rect x="264" y="326" width="62" height="28" fill="#C29E08" fill-opacity="0.9" stroke="#C29E08" stroke-width="1.6"/>
<text x="295" y="345" text-anchor="middle" font-size="13" fill="#FFFFFF">b⁽²⁾</text>
<text x="295" y="374" class="dim" text-anchor="middle">10</text>
</g>
<g data-key="z2">
<text x="338" y="348" class="lbl" text-anchor="middle">=</text>
<rect x="352" y="300" width="70" height="80" fill="#73B222" fill-opacity="0.5" stroke="#73B222" stroke-width="1.6"/>
<line x1="366.0" y1="300" x2="366.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="380.0" y1="300" x2="380.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="394.0" y1="300" x2="394.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="408.0" y1="300" x2="408.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="352" y1="320.0" x2="422" y2="320.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="352" y1="340.0" x2="422" y2="340.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="352" y1="360.0" x2="422" y2="360.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="387" y="291" class="dim" text-anchor="middle">4 × 10</text>
<text x="387" y="400" class="nm" text-anchor="middle">Z⁽²⁾</text>
</g>
<g data-key="p">
<line x1="426" y1="340" x2="486" y2="340" stroke="#73B222" stroke-width="1.4" fill="none" marker-end="url(#fw-arg)"/>
<text x="456" y="328" class="cap" text-anchor="middle">softmax</text>
<rect x="492" y="300" width="70" height="80" fill="#73B222" fill-opacity="0.5" stroke="#73B222" stroke-width="1.6"/>
<line x1="506.0" y1="300" x2="506.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="520.0" y1="300" x2="520.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="534.0" y1="300" x2="534.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="548.0" y1="300" x2="548.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="492" y1="320.0" x2="562" y2="320.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="492" y1="340.0" x2="562" y2="340.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="492" y1="360.0" x2="562" y2="360.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="527" y="291" class="dim" text-anchor="middle">4 × 10</text>
<text x="527" y="400" class="nm" text-anchor="middle">P</text>
</g>
<g data-key="l">
<rect x="600" y="300" width="70" height="80" fill="#3576C0" fill-opacity="0.55" stroke="#3576C0" stroke-width="1.6"/>
<line x1="614.0" y1="300" x2="614.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="628.0" y1="300" x2="628.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="642.0" y1="300" x2="642.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="656.0" y1="300" x2="656.0" y2="380" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="600" y1="320.0" x2="670" y2="320.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="600" y1="340.0" x2="670" y2="340.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="600" y1="360.0" x2="670" y2="360.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="635" y="291" class="dim" text-anchor="middle">4 × 10</text>
<text x="635" y="400" class="nm" text-anchor="middle">Y</text>
<line x1="556" y1="384" x2="556" y2="414" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#arw)"/>
<line x1="556" y1="414" x2="776" y2="414" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#arw)"/>
<line x1="776" y1="414" x2="776" y2="374" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#arw)"/>
<rect x="716" y="310" width="120" height="60" rx="8" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.7"/>
<text x="776" y="336" class="lbl" text-anchor="middle">L</text>
<text x="776" y="356" class="cap" text-anchor="middle">одно число</text>
<line x1="674" y1="340" x2="712" y2="340" stroke="#C30B0A" stroke-width="1.4" fill="none"/>
</g>
<rect x="40" y="432" width="880" height="74" rx="10" fill="#FFFFFF" stroke="#E4E1D7" stroke-width="1.3"/>
<text x="56" y="452" class="cap">формула шага</text>
<g data-key="fm0" data-only="1"><foreignObject x="56" y="458" width="848" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="X \in \mathbb{R}^{4\times 64},\quad W^{(1)} \in \mathbb{R}^{64\times 32},\quad b^{(1)} \in \mathbb{R}^{32}"></div></foreignObject></g>
<g data-key="fm1" data-only="1"><foreignObject x="56" y="458" width="848" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="Z^{(1)} = X\,W^{(1)} + b^{(1)} \qquad [4\times 64]\cdot[64\times 32] \rightarrow [4\times 32]"></div></foreignObject></g>
<g data-key="fm2" data-only="1"><foreignObject x="56" y="458" width="848" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="z^{(1)}_{ij} = \sum_{k=1}^{64} x_{ik}\, w^{(1)}_{kj} + b^{(1)}_{j}"></div></foreignObject></g>
<g data-key="fm3" data-only="1"><foreignObject x="56" y="458" width="848" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="A^{(1)} = \max\left(0,\; Z^{(1)}\right) \qquad [4\times 32] \rightarrow [4\times 32]"></div></foreignObject></g>
<g data-key="fm4" data-only="1"><foreignObject x="56" y="458" width="848" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="Z^{(2)} = A^{(1)} W^{(2)} + b^{(2)} \qquad [4\times 32]\cdot[32\times 10] \rightarrow [4\times 10]"></div></foreignObject></g>
<g data-key="fm5" data-only="1"><foreignObject x="56" y="458" width="848" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="p_{ic} = \dfrac{e^{\,z^{(2)}_{ic}}}{\sum_{c'=1}^{10} e^{\,z^{(2)}_{ic'}}} \qquad \sum_c p_{ic} = 1"></div></foreignObject></g>
<g data-key="fm6" data-only="1"><foreignObject x="56" y="458" width="848" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="L = -\dfrac{1}{B}\sum_{i=1}^{B}\sum_{c=1}^{10} y_{ic}\,\log p_{ic}"></div></foreignObject></g>
<text x="40" y="600" class="legend">тёмно-жёлтые блоки — обучаемые параметры · светло-зелёные — то, что пересчитывается на каждом батче · синие — данные</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="x w1 b1 mm0 fm0" data-focus="x">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Батч и параметры первого слоя</h4>
<p>Слева матрица X: четыре картинки по 64 числа. Рядом — параметры первого слоя: матрица весов 64 × 32 и строка смещений из 32 чисел. Веса нарисованы тёмными, активации светлыми: тёмное меняется при обучении, светлое пересчитывается заново на каждом батче.</p>
    </div>
    <div class="step-panel" data-on="x w1 b1 z1 mm1 fm1" data-focus="z1">
      <div class="step-kicker">Шаг 2 · умножение</div>
      <h4>Строка на столбец — и получается 4 × 32</h4>
<p>Внутренние размерности встречаются и сокращаются: [4 × 64] · [64 × 32] = [4 × 32]. Клетка результата — это сумма 64 произведений: одна картинка целиком, взвешенная одним скрытым нейроном. Каждый столбец W⁽¹⁾ — самостоятельный детектор, который смотрит на все 64 клетки сразу.</p>
    </div>
    <div class="step-panel" data-on="x w1 b1 z1 mm1 fm2" data-focus="b1">
      <div class="step-kicker">Шаг 3 · смещение</div>
      <h4>Одна строка прибавляется ко всем строкам батча</h4>
<p>b⁽¹⁾ — это 32 числа, а прибавляем мы их к матрице 4 × 32. Строка размножается по всем объектам батча: смещение принадлежит нейрону, а не картинке. Это единственное место, где формы не совпадают буквально, и это стоит держать в голове — на обратном проходе размножение превратится в суммирование.</p>
    </div>
    <div class="step-panel" data-on="x w1 b1 z1 a1 mm2 fm3" data-focus="a1">
      <div class="step-kicker">Шаг 4 · ReLU</div>
      <h4>Отрицательные значения обнуляются, форма не меняется</h4>
<p>ReLU работает поэлементно: клетки не смешиваются. Форма остаётся 4 × 32, но примерно половина клеток становится нулями. Именно здесь сеть перестаёт быть линейной функцией входа — и именно здесь на обратном проходе появится маска из нулей и единиц.</p>
    </div>
    <div class="step-panel" data-on="x w1 b1 z1 a1 a1b w2 b2 z2 mm3 fm4" data-focus="z2">
      <div class="step-kicker">Шаг 5 · второй слой</div>
      <h4>Тот же приём ещё раз: 32 признака → 10 оценок</h4>
<p>A⁽¹⁾ становится входом второго слоя, и всё повторяется: [4 × 32] · [32 × 10] + [10] = [4 × 10]. Второй слой не знает, что перед ним был первый, — он видит просто матрицу. Из этой повторяемости и растёт возможность строить сети произвольной глубины.</p>
    </div>
    <div class="step-panel" data-on="x w1 b1 z1 a1 a1b w2 b2 z2 p mm4 fm5" data-focus="p">
      <div class="step-kicker">Шаг 6 · softmax</div>
      <h4>Каждая строка превращается в десять вероятностей</h4>
<p>Softmax применяется построчно: объекты не смешиваются между собой. После него в каждой строке десять положительных чисел, которые в сумме дают ровно 1. Форма прежняя — 4 × 10, изменился смысл: это уже не оценки, а вероятности классов.</p>
    </div>
    <div class="step-panel" data-on="x w1 b1 z1 a1 a1b w2 b2 z2 p l mm5 fm6" data-focus="l">
      <div class="step-kicker">Шаг 7 · потеря</div>
      <h4>Матрица 4 × 10 и метки 4 × 10 схлопываются в одно число</h4>
<p>Последний шаг сравнивает P с Y и выдаёт единственное число — потерю батча. Весь прямой проход — это четыре умножения матриц и две поэлементные операции; ничего сверх этого в сети нет.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> прямой проход — это два умножения матриц и две поэлементные
  операции. Умножения меняют форму и смешивают числа между собой; ReLU и softmax форму сохраняют
  и работают внутри строки. Ничего третьего в сети нет.
</div>

---

## Часть 4. Прямой проход: те же шаги в числах

<p>
  Теперь подставим настоящие числа. Батч — первые четыре картинки первого батча первой эпохи:
  цифры 3, 5, 2 и 8. Веса заданы генератором случайных чисел: нормальное распределение с нулевым
  средним и стандартным отклонением <span class="math-inline" data-tex="\sqrt{2/64} = 0{,}1768"></span>
  для первого слоя и <span class="math-inline" data-tex="\sqrt{2/32} = 0{,}25"></span> для второго.
  Смещения — нули.
</p>

<div class="callout-blue">
  <strong>Почему веса случайные, а смещения нулевые:</strong> если инициализировать все веса нулями,
  все 32 нейрона будут считать одно и то же и получать один и тот же градиент — они никогда не
  разойдутся. Случайность нужна именно для того, чтобы сломать эту симметрию. Смещениям ломать
  нечего, их спокойно ставят в ноль. Множитель <span class="math-inline" data-tex="\sqrt{2/n_{\text{вход}}}"></span>
  подобран так, чтобы разброс значений не рос и не затухал от слоя к слою.
</div>

<pre><code>def forward(X):
    Z1 = X @ W1 + b1
    A1 = np.maximum(Z1, 0)
    Z2 = A1 @ W2 + b2
    E = np.exp(Z2 - Z2.max(axis=1, keepdims=True))
    return Z1, A1, Z2, E / E.sum(axis=1, keepdims=True)</code></pre>

<p>
  Вычитание максимума в softmax — обязательная деталь реализации: экспонента от большого числа
  переполняется, а от вычитания константы результат не меняется, потому что она сокращается
  в числителе и знаменателе.
</p>

<p>
  Дальше — сама арифметика, клетка за клеткой. Матрицы ниже нарисованы с индексами: видно,
  какая строка на какой столбец умножается и в какую клетку результата это попадает.
  Чисел внутри клеток нет — они бы туда не поместились, — зато они подставлены под схемой
  и в описании каждого шага, так что любую цифру можно перепроверить на калькуляторе.
</p>

<div class="stage" id="stageFX" tabindex="0">
  <div class="stage-figure">
<svg id="fx" viewBox="0 0 960 530" role="img" aria-label="Прямой проход в числах: матрицы с индексами, подстановка чисел под схемой">
  <style>
    #fx { font-family: Helvetica, Arial, sans-serif; }
    #fx .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="fx-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="fx-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="fx-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" text-anchor="middle" font-size="12" fill="#5E5850">картинки → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" text-anchor="middle" font-size="12" fill="#5E5850">W⁽¹⁾ · b⁽¹⁾</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" text-anchor="middle" font-size="12" fill="#5E5850">ReLU</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" text-anchor="middle" font-size="12" fill="#5E5850">W⁽²⁾ · b⁽²⁾</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" text-anchor="middle" font-size="12" fill="#5E5850">softmax</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" text-anchor="middle" font-size="12" fill="#5E5850">потеря L</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" text-anchor="middle" font-size="13" fill="#5E5850">малиновым выделено то, что считаем руками: строка, столбец и клетка результата</text>
<g data-key="e1" data-only="1"><rect x="51" y="132" width="220" height="108" fill="#3576C0" fill-opacity="0.1"/>
<line x1="95" y1="132" x2="95" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="139" y1="132" x2="139" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="183" y1="132" x2="183" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="227" y1="132" x2="227" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="51" y1="159" x2="271" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="51" y1="186" x2="271" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="51" y1="213" x2="271" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 50 127 L 40 127 L 40 245 L 50 245" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 272 127 L 282 127 L 282 245 L 272 245" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<text x="73" y="150" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="117" y="150" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">1,2</tspan></text>
<text x="161" y="150" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">1,3</tspan></text>
<text x="205" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="249" y="150" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">1,64</tspan></text>
<text x="73" y="178" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="117" y="178" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">2,2</tspan></text>
<text x="161" y="178" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">2,3</tspan></text>
<text x="205" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="249" y="178" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">2,64</tspan></text>
<text x="73" y="204" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="117" y="204" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">3,2</tspan></text>
<text x="161" y="204" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">3,3</tspan></text>
<text x="205" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="249" y="204" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">3,64</tspan></text>
<text x="73" y="232" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="117" y="232" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">4,2</tspan></text>
<text x="161" y="232" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">4,3</tspan></text>
<text x="205" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="249" y="232" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">4,64</tspan></text>
<text x="161" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 64</text>
<text x="161" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">X</text>
<text x="296" y="198" text-anchor="middle" font-size="20" fill="#111111">×</text>
<rect x="323" y="118" width="220" height="135" fill="#C29E08" fill-opacity="0.16"/>
<line x1="367" y1="118" x2="367" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="411" y1="118" x2="411" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="455" y1="118" x2="455" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="499" y1="118" x2="499" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="323" y1="145" x2="543" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="323" y1="172" x2="543" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="323" y1="199" x2="543" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="323" y1="226" x2="543" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 322 113 L 312 113 L 312 258 L 322 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 544 113 L 554 113 L 554 258 L 544 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="345" y="136" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="389" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="433" y="136" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="477" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="521" y="136" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="345" y="164" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="389" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="433" y="164" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="477" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="521" y="164" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="345" y="190" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="389" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="433" y="190" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="477" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="521" y="190" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="345" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="389" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="433" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="477" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="521" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="345" y="244" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">64,1</tspan></text>
<text x="389" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="433" y="244" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">64,22</tspan></text>
<text x="477" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="521" y="244" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">64,32</tspan></text>
<text x="433" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">64 × 32</text>
<text x="433" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W⁽¹⁾</text>
<text x="568" y="198" text-anchor="middle" font-size="20" fill="#111111">=</text>
<rect x="595" y="132" width="220" height="108" fill="#73B222" fill-opacity="0.1"/>
<line x1="639" y1="132" x2="639" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="683" y1="132" x2="683" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="727" y1="132" x2="727" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="771" y1="132" x2="771" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="595" y1="159" x2="815" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="595" y1="186" x2="815" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="595" y1="213" x2="815" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 594 127 L 584 127 L 584 245 L 594 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 816 127 L 826 127 L 826 245 L 816 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="617" y="150" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="661" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="705" y="150" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="749" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="793" y="150" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="617" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="661" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="705" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="749" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="793" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="617" y="204" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="661" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="705" y="204" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="749" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="793" y="204" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="617" y="232" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="661" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="705" y="232" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">4,22</tspan></text>
<text x="749" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="793" y="232" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">4,32</tspan></text>
<text x="705" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 32</text>
<text x="705" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">Z⁽¹⁾</text></g>
<g data-key="h1" data-only="1"><rect x="51" y="132" width="220" height="27" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="411" y="118" width="44" height="135" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="683" y="132" width="44" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="eb" data-only="1"><rect x="595" y="296" width="220" height="27" fill="#C29E08" fill-opacity="0.16"/>
<line x1="639" y1="296" x2="639" y2="323" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="683" y1="296" x2="683" y2="323" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="727" y1="296" x2="727" y2="323" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="771" y1="296" x2="771" y2="323" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 594 291 L 584 291 L 584 328 L 594 328" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 816 291 L 826 291 L 826 328 L 816 328" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="617" y="314" text-anchor="middle" font-size="15" fill="#111111">b<tspan font-size="11" dy="4">1</tspan></text>
<text x="661" y="314" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="705" y="314" text-anchor="middle" font-size="15" fill="#111111">b<tspan font-size="11" dy="4">22</tspan></text>
<text x="749" y="314" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="793" y="314" text-anchor="middle" font-size="15" fill="#111111">b<tspan font-size="11" dy="4">32</tspan></text>
<text x="571" y="316" text-anchor="middle" font-size="20" fill="#111111">+</text>
<text x="705" y="344" text-anchor="middle" font-size="13" fill="#5E5850">одна строка из 32 чисел — ко всем четырём строкам Z⁽¹⁾</text>
<line x1="613" y1="292" x2="613" y2="254" stroke="#5E5850" stroke-width="1.2" fill="none" stroke-dasharray="3 3" marker-end="url(#fx-arw)"/>
<line x1="657" y1="292" x2="657" y2="254" stroke="#5E5850" stroke-width="1.2" fill="none" stroke-dasharray="3 3" marker-end="url(#fx-arw)"/>
<line x1="753" y1="292" x2="753" y2="254" stroke="#5E5850" stroke-width="1.2" fill="none" stroke-dasharray="3 3" marker-end="url(#fx-arw)"/>
<line x1="797" y1="292" x2="797" y2="254" stroke="#5E5850" stroke-width="1.2" fill="none" stroke-dasharray="3 3" marker-end="url(#fx-arw)"/></g>
<g data-key="e2" data-only="1"><rect x="121" y="132" width="220" height="108" fill="#73B222" fill-opacity="0.1"/>
<rect x="121" y="132" width="44" height="27" fill="#C30B0A" fill-opacity="0.3"/>
<rect x="209" y="132" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="297" y="132" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="121" y="159" width="44" height="27" fill="#C30B0A" fill-opacity="0.3"/>
<rect x="209" y="159" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="297" y="159" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="121" y="186" width="44" height="27" fill="#C30B0A" fill-opacity="0.3"/>
<rect x="209" y="186" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="297" y="186" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="121" y="213" width="44" height="27" fill="#C30B0A" fill-opacity="0.3"/>
<rect x="209" y="213" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="297" y="213" width="44" height="27" fill="#C30B0A" fill-opacity="0.3"/>
<line x1="165" y1="132" x2="165" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="209" y1="132" x2="209" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="253" y1="132" x2="253" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="297" y1="132" x2="297" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="121" y1="159" x2="341" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="121" y1="186" x2="341" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="121" y1="213" x2="341" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 120 127 L 110 127 L 110 245 L 120 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 342 127 L 352 127 L 352 245 L 342 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="143" y="150" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="187" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="231" y="150" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="275" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="319" y="150" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="143" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="187" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="231" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="275" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="319" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="143" y="204" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="187" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="231" y="204" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="275" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="319" y="204" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="143" y="232" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="187" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="231" y="232" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">4,22</tspan></text>
<text x="275" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="319" y="232" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">4,32</tspan></text>
<text x="231" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 32</text>
<text x="231" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">Z⁽¹⁾</text>
<rect x="611" y="132" width="220" height="108" fill="#73B222" fill-opacity="0.1"/>
<rect x="611" y="132" width="44" height="27" fill="#FFFFFF" fill-opacity="0.85"/>
<rect x="699" y="132" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="787" y="132" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="611" y="159" width="44" height="27" fill="#FFFFFF" fill-opacity="0.85"/>
<rect x="699" y="159" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="787" y="159" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="611" y="186" width="44" height="27" fill="#FFFFFF" fill-opacity="0.85"/>
<rect x="699" y="186" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="787" y="186" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="611" y="213" width="44" height="27" fill="#FFFFFF" fill-opacity="0.85"/>
<rect x="699" y="213" width="44" height="27" fill="#73B222" fill-opacity="0.42"/>
<rect x="787" y="213" width="44" height="27" fill="#FFFFFF" fill-opacity="0.85"/>
<line x1="655" y1="132" x2="655" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="699" y1="132" x2="699" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="743" y1="132" x2="743" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="787" y1="132" x2="787" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="611" y1="159" x2="831" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="611" y1="186" x2="831" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="611" y1="213" x2="831" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 610 127 L 600 127 L 600 245 L 610 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 832 127 L 842 127 L 842 245 L 832 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="633" y="150" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="677" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="721" y="150" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="765" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="809" y="150" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="633" y="178" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="677" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="721" y="178" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="765" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="809" y="178" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="633" y="204" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="677" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="721" y="204" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="765" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="809" y="204" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="633" y="232" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="677" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="721" y="232" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">4,22</tspan></text>
<text x="765" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="809" y="232" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">4,32</tspan></text>
<text x="721" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 32</text>
<text x="721" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">A⁽¹⁾</text>
<line x1="372" y1="186" x2="578" y2="186" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#fx-arg)"/>
<text x="475" y="170" text-anchor="middle" font-size="13" fill="#5E5850">поклеточно</text>
<foreignObject x="375" y="194" width="230" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="a_{ij} = \max(0,\; z_{ij})"></div></foreignObject>
<text x="480" y="300" text-anchor="middle" font-size="13" fill="#5E5850">зелёные клетки прошли, красные обнулились: открыто 56 из 128</text></g>
<g data-key="e3" data-only="1"><rect x="51" y="132" width="220" height="108" fill="#73B222" fill-opacity="0.1"/>
<line x1="95" y1="132" x2="95" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="139" y1="132" x2="139" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="183" y1="132" x2="183" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="227" y1="132" x2="227" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="51" y1="159" x2="271" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="51" y1="186" x2="271" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="51" y1="213" x2="271" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 50 127 L 40 127 L 40 245 L 50 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 272 127 L 282 127 L 282 245 L 272 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="73" y="150" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="117" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="161" y="150" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="205" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="249" y="150" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="73" y="178" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="117" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="161" y="178" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="205" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="249" y="178" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="73" y="204" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="117" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="161" y="204" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="205" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="249" y="204" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="73" y="232" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="117" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="161" y="232" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">4,22</tspan></text>
<text x="205" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="249" y="232" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">4,32</tspan></text>
<text x="161" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 32</text>
<text x="161" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">A⁽¹⁾</text>
<text x="296" y="198" text-anchor="middle" font-size="20" fill="#111111">×</text>
<rect x="315" y="118" width="252" height="135" fill="#C29E08" fill-opacity="0.16"/>
<line x1="357" y1="118" x2="357" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="399" y1="118" x2="399" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="441" y1="118" x2="441" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="483" y1="118" x2="483" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="525" y1="118" x2="525" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="315" y1="145" x2="567" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="315" y1="172" x2="567" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="315" y1="199" x2="567" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="315" y1="226" x2="567" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 314 113 L 304 113 L 304 258 L 314 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 568 113 L 578 113 L 578 258 L 568 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="336" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="378" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="420" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="462" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="504" y="136" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="546" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="336" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="378" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="420" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="462" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="504" y="164" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="546" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="336" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,1</tspan></text>
<text x="378" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,2</tspan></text>
<text x="420" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,3</tspan></text>
<text x="462" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,4</tspan></text>
<text x="504" y="190" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="546" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,10</tspan></text>
<text x="336" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="378" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="420" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="462" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="504" y="218" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="546" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="336" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,1</tspan></text>
<text x="378" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,2</tspan></text>
<text x="420" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,3</tspan></text>
<text x="462" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,4</tspan></text>
<text x="504" y="244" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="546" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,10</tspan></text>
<text x="441" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">32 × 10</text>
<text x="441" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W⁽²⁾</text>
<text x="592" y="198" text-anchor="middle" font-size="20" fill="#111111">=</text>
<rect x="619" y="132" width="252" height="108" fill="#73B222" fill-opacity="0.1"/>
<line x1="661" y1="132" x2="661" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="703" y1="132" x2="703" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="745" y1="132" x2="745" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="787" y1="132" x2="787" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="829" y1="132" x2="829" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="619" y1="159" x2="871" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="619" y1="186" x2="871" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="619" y1="213" x2="871" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 618 127 L 608 127 L 608 245 L 618 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 872 127 L 882 127 L 882 245 L 872 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="640" y="150" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="682" y="150" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="724" y="150" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="766" y="150" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="808" y="150" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="850" y="150" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="640" y="178" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="682" y="178" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="724" y="178" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">2,3</tspan></text>
<text x="766" y="178" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">2,4</tspan></text>
<text x="808" y="178" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="850" y="178" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">2,10</tspan></text>
<text x="640" y="204" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">3,1</tspan></text>
<text x="682" y="204" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">3,2</tspan></text>
<text x="724" y="204" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">3,3</tspan></text>
<text x="766" y="204" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">3,4</tspan></text>
<text x="808" y="204" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="850" y="204" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">3,10</tspan></text>
<text x="640" y="232" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">4,1</tspan></text>
<text x="682" y="232" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">4,2</tspan></text>
<text x="724" y="232" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">4,3</tspan></text>
<text x="766" y="232" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">4,4</tspan></text>
<text x="808" y="232" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="850" y="232" text-anchor="middle" font-size="14" fill="#111111">z<tspan font-size="10" dy="4">4,10</tspan></text>
<text x="745" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 10</text>
<text x="745" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">Z⁽²⁾</text></g>
<g data-key="h3" data-only="1"><rect x="51" y="132" width="220" height="27" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="441" y="118" width="42" height="135" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="745" y="132" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e4" data-only="1"><rect x="101" y="160" width="252" height="27" fill="#73B222" fill-opacity="0.1"/>
<line x1="143" y1="160" x2="143" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="185" y1="160" x2="185" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="227" y1="160" x2="227" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="269" y1="160" x2="269" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="311" y1="160" x2="311" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 100 155 L 90 155 L 90 192 L 100 192" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 354 155 L 364 155 L 364 192 L 354 192" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="122" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">1</tspan></text>
<text x="164" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">2</tspan></text>
<text x="206" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">3</tspan></text>
<text x="248" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">4</tspan></text>
<text x="290" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="332" y="178" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="11" dy="4">10</tspan></text>
<text x="227" y="146" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">строка 1 из Z⁽²⁾</text>
<text x="227" y="214" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">z⁽²⁾₁</text>
<rect x="611" y="160" width="252" height="27" fill="#73B222" fill-opacity="0.22"/>
<line x1="653" y1="160" x2="653" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="695" y1="160" x2="695" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="737" y1="160" x2="737" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="779" y1="160" x2="779" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="821" y1="160" x2="821" y2="187" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 610 155 L 600 155 L 600 192 L 610 192" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 864 155 L 874 155 L 874 192 L 864 192" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="632" y="178" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="11" dy="4">1</tspan></text>
<text x="674" y="178" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="11" dy="4">2</tspan></text>
<text x="716" y="178" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="11" dy="4">3</tspan></text>
<text x="758" y="178" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="11" dy="4">4</tspan></text>
<text x="800" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="842" y="178" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="11" dy="4">10</tspan></text>
<text x="737" y="146" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">строка 1 из P</text>
<text x="737" y="214" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">p₁</text>
<line x1="384" y1="174" x2="578" y2="174" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#fx-arg)"/>
<foreignObject x="361" y="108" width="260" height="46"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="p_{c} = \dfrac{e^{z_c}}{\sum_{c'} e^{z_{c'}}}"></div></foreignObject>
<text x="480" y="232" text-anchor="middle" font-size="13" fill="#5E5850">внутри строки: десять положительных чисел, в сумме ровно 1</text>
<text x="480" y="256" text-anchor="middle" font-size="13" fill="#5E5850">оценки −0,2158 … 0,3139 превращаются в 0,0579 … 0,1488</text></g>
<g data-key="e5" data-only="1"><rect x="71" y="132" width="252" height="108" fill="#73B222" fill-opacity="0.1"/>
<line x1="113" y1="132" x2="113" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="155" y1="132" x2="155" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="197" y1="132" x2="197" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="239" y1="132" x2="239" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="281" y1="132" x2="281" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="159" x2="323" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="186" x2="323" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="213" x2="323" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 70 127 L 60 127 L 60 245 L 70 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 324 127 L 334 127 L 334 245 L 324 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="92" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="134" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="176" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="218" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="260" y="150" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="302" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="92" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="134" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="176" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,3</tspan></text>
<text x="218" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,4</tspan></text>
<text x="260" y="178" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="302" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,10</tspan></text>
<text x="92" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,1</tspan></text>
<text x="134" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,2</tspan></text>
<text x="176" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,3</tspan></text>
<text x="218" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,4</tspan></text>
<text x="260" y="204" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="302" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,10</tspan></text>
<text x="92" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,1</tspan></text>
<text x="134" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,2</tspan></text>
<text x="176" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,3</tspan></text>
<text x="218" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,4</tspan></text>
<text x="260" y="232" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="302" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,10</tspan></text>
<text x="197" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 10</text>
<text x="197" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">P</text>
<rect x="411" y="132" width="86" height="108" fill="#5E5850" fill-opacity="0.1"/>
<line x1="411" y1="159" x2="497" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="411" y1="186" x2="497" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="411" y1="213" x2="497" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 410 127 L 400 127 L 400 245 L 410 245" fill="none" stroke="#5E5850" stroke-width="1.8"/>
<path d="M 498 127 L 508 127 L 508 245 L 498 245" fill="none" stroke="#5E5850" stroke-width="1.8"/>
<text x="454" y="150" text-anchor="middle" font-size="13" fill="#111111">4</text>
<text x="454" y="178" text-anchor="middle" font-size="13" fill="#111111">6</text>
<text x="454" y="204" text-anchor="middle" font-size="13" fill="#111111">3</text>
<text x="454" y="232" text-anchor="middle" font-size="13" fill="#111111">9</text>
<text x="454" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">верный класс</text>
<text x="454" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">y</text>
<rect x="197" y="132" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/>
<rect x="155" y="186" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/>
<line x1="524" y1="186" x2="640" y2="186" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#fx-arr)"/>
<rect x="656" y="152" width="150" height="70" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="731" y="184" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">L</text>
<text x="731" y="208" text-anchor="middle" font-size="13" fill="#5E5850">одно число</text>
<text x="480" y="300" text-anchor="middle" font-size="13" fill="#5E5850">столбцы 6 и 9 спрятаны за многоточием — они существуют, просто не влезли</text></g>
<rect x="40" y="362" width="880" height="124" rx="10" fill="#FFFFFF" stroke="#E4E1D7" stroke-width="1.3"/>
<text x="56" y="382" text-anchor="start" font-size="13" fill="#5E5850">формула шага</text>
<text x="56" y="436" text-anchor="start" font-size="13" fill="#5E5850">подстановка чисел</text>
<g data-key="fm0" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="X \in \mathbb{R}^{4\times 64},\quad W^{(1)} \in \mathbb{R}^{64\times 32},\quad b^{(1)} \in \mathbb{R}^{32}"></div></foreignObject></g>
<g data-key="fm1" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="z^{(1)}_{ij} = \sum_{k=1}^{64} x_{ik}\, w^{(1)}_{kj}"></div></foreignObject></g>
<g data-key="fm2" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="z^{(1)}_{ij} = \sum_{k=1}^{64} x_{ik}\, w^{(1)}_{kj} + b^{(1)}_{j}"></div></foreignObject></g>
<g data-key="fm3" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="a^{(1)}_{ij} = \max\left(0,\; z^{(1)}_{ij}\right)"></div></foreignObject></g>
<g data-key="fm4" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="z^{(2)}_{ic} = \sum_{j=1}^{32} a^{(1)}_{ij}\, w^{(2)}_{jc} + b^{(2)}_{c}"></div></foreignObject></g>
<g data-key="fm5" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="p_{ic} = \dfrac{e^{\,z^{(2)}_{ic}}}{\sum_{c'=1}^{10} e^{\,z^{(2)}_{ic'}}}"></div></foreignObject></g>
<g data-key="fm6" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="L = -\dfrac{1}{B}\sum_{i=1}^{B} \log p_{i,\,y_i}"></div></foreignObject></g>
<g data-key="sb0" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="x_{1,2} = 0{,}0625,\quad x_{1,3} = 0{,}5,\quad x_{1,4} = 0{,}875,\quad x_{1,7} = 0"></div></foreignObject></g>
<g data-key="sb1" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="z^{(1)}_{1,22} = 0{,}0625\cdot 0{,}1160 + 0{,}5\cdot 0{,}1114 + 0{,}875\cdot 0{,}1284 + \ldots = 1{,}0536"></div></foreignObject></g>
<g data-key="sb2" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="b^{(1)}_{22} = 0 \ \text{на старте} \;\Rightarrow\; z^{(1)}_{1,22} = 1{,}0536"></div></foreignObject></g>
<g data-key="sb3" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="a^{(1)}_{1,22} = \max(0;\, 1{,}0536) = 1{,}0536,\qquad a^{(1)}_{1,21} = \max(0;\, -1{,}2744) = 0"></div></foreignObject></g>
<g data-key="sb4" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="z^{(2)}_{1,4} = 0{,}7629\cdot(-0{,}1014) + \ldots + 1{,}0536\cdot 0{,}2681 + \ldots = 0{,}3139"></div></foreignObject></g>
<g data-key="sb5" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="p_{1,4} = \dfrac{e^{0{,}3139}}{9{,}1979} = \dfrac{1{,}3688}{9{,}1979} = 0{,}1488"></div></foreignObject></g>
<g data-key="sb6" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="L = \tfrac{1}{4}\left(1{,}9050 + 1{,}9796 + 2{,}2081 + 2{,}4735\right) = 2{,}1416"></div></foreignObject></g>
<text x="40" y="512" text-anchor="start" font-size="13" fill="#5E5850">индексы в формулах считаются с единицы; в коде на numpy те же клетки нумеруются с нуля</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="mm0 e1 fm0 sb0" data-focus="e1">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Батч — это матрица 4 × 64, строка на картинку</h4>
<p>Строка i — целая картинка, развёрнутая в 64 числа; клетка <span class="math-inline" data-tex="x_{ik}"></span> — яркость k-й точки, делённая на 16, поэтому все значения лежат между 0 и 1. Первая строка — тройка, дальше пятёрка, двойка и восьмёрка.</p><div class="math-display" data-tex="x_{1,1} = 0,\quad x_{1,2} = 0{,}0625,\quad x_{1,3} = 0{,}5,\quad x_{1,4} = 0{,}875,\quad x_{1,5} = 0{,}9375,\quad x_{1,6} = 0{,}125,\quad x_{1,7} = x_{1,8} = 0"></div><p>Ненулевых чисел в первой строке 34 из 64 — остальное фон. Это пригодится через шаг: пустая клетка не даёт вклада ни в одну сумму.</p>
    </div>
    <div class="step-panel" data-on="mm1 e1 h1 fm1 sb1" data-focus="h1">
      <div class="step-kicker">Шаг 2 · одна клетка результата</div>
      <h4>z⁽¹⁾₁,₂₂ = 1,0536 — сумма 64 произведений</h4>
<p>Подсвечены строка 1 матрицы X, столбец 22 матрицы W⁽¹⁾ и клетка, которая из них получается. Правило одно на все 128 клеток: клетка результата — это скалярное произведение строки на столбец.</p><div class="math-display" data-tex="z^{(1)}_{1,22} = \sum_{k=1}^{64} x_{1k}\,w^{(1)}_{k,22}"></div><div class="math-display" data-tex="= 0{,}0625\cdot 0{,}1160 + 0{,}5\cdot 0{,}1114 + 0{,}875\cdot 0{,}1284 + 0{,}9375\cdot 0{,}1909 + 0{,}125\cdot(-0{,}1844) + \ldots = 1{,}0536"></div><p>Значащих слагаемых ровно 34 — по числу непустых пикселей. Самое крупное: 0,75 · 0,3459 = 0,2594, самое отрицательное: 1 · (−0,1957) = −0,1957. Плюсы в сумме дают 1,75175, минусы −0,69815, разность и есть 1,0536.</p>
    </div>
    <div class="step-panel" data-on="mm1 e1 eb fm2 sb2" data-focus="eb">
      <div class="step-kicker">Шаг 3 · смещение</div>
      <h4>b⁽¹⁾ — строка из 32 чисел, а прибавляется к матрице 4 × 32</h4>
<p>Формы не совпадают буквально, и это единственное место прямого прохода, где так: одна и та же строка смещений прибавляется ко всем четырём строкам, потому что смещение принадлежит нейрону, а не картинке. На обратном проходе это размножение превратится в суммирование по строкам.</p><div class="math-display" data-tex="z^{(1)}_{ij} = \sum_{k} x_{ik} w^{(1)}_{kj} + b^{(1)}_{j}, \qquad b^{(1)}_{22} = 0"></div><p>На старте все смещения нулевые, поэтому сейчас Z⁽¹⁾ целиком состоит из произведений. После первого же шага спуска они станут ненулевыми — и это ничего не изменит в формуле.</p>
    </div>
    <div class="step-panel" data-on="mm2 e2 fm3 sb3" data-focus="e2">
      <div class="step-kicker">Шаг 4 · ReLU</div>
      <h4>56 клеток из 128 прошли, 72 обнулились</h4>
<p>ReLU действует поклеточно: индексы не перемешиваются, форма остаётся 4 × 32. Клетка либо проходит как есть, либо становится нулём.</p><div class="math-display" data-tex="a^{(1)}_{1,22} = \max(0;\, 1{,}0536) = 1{,}0536, \qquad a^{(1)}_{1,21} = \max(0;\, -1{,}2744) = 0"></div><p>По объектам открыто 12, 16, 12 и 16 нейронов из 32. Десять нейронов закрыты у всех четырёх картинок сразу — на этом батче они не участвуют ни в ответе, ни, как мы увидим, в обучении.</p>
    </div>
    <div class="step-panel" data-on="mm3 e3 h3 fm4 sb4" data-focus="h3">
      <div class="step-kicker">Шаг 5 · второй слой</div>
      <h4>z⁽²⁾₁,₄ = 0,3139 — оценка класса «3»</h4>
<p>Та же операция, другие размеры: [4 × 32] · [32 × 10] = [4 × 10]. Второй слой не знает, что перед ним был первый, — он видит просто матрицу чисел.</p><div class="math-display" data-tex="z^{(2)}_{1,4} = \sum_{j=1}^{32} a^{(1)}_{1j}\, w^{(2)}_{j,4} = 0{,}7629\cdot(-0{,}1014) + 0{,}2729\cdot(-0{,}0436) + \ldots + 1{,}0536\cdot 0{,}2681 + \ldots = 0{,}3139"></div><p>Значащих слагаемых только 12: остальные 20 активаций равны нулю после ReLU. Самое крупное даёт как раз 22-й нейрон: 1,0536 · 0,2681 = 0,2825 — он и вытянул класс «3» в максимум строки.</p>
    </div>
    <div class="step-panel" data-on="mm4 e4 fm5 sb5" data-focus="e4">
      <div class="step-kicker">Шаг 6 · softmax</div>
      <h4>p₁,₄ = 0,1488 — и вся строка в сумме даёт 1</h4>
<p>Softmax работает внутри строки: объекты не смешиваются. Делим экспоненту клетки на сумму десяти экспонент этой же строки.</p><div class="math-display" data-tex="p_{1,4} = \dfrac{e^{0{,}3139}}{\sum_{c} e^{z^{(2)}_{1c}}} = \dfrac{1{,}3688}{9{,}1979} = 0{,}1488"></div><p>Вся первая строка: 0,0876; 0,0949; 0,0824; <strong>0,1488</strong>; 0,1185; 0,0890; 0,0579; 0,1244; 0,0918; 0,1046. Ни одно значение не ушло далеко от 0,1 — сеть честно не знает ответа, а максимум попал на верный класс случайно.</p>
    </div>
    <div class="step-panel" data-on="mm5 e5 fm6 sb6" data-focus="e5">
      <div class="step-kicker">Шаг 7 · потеря</div>
      <h4>L = 2,1416 против ln 10 = 2,3026</h4>
<p>Из каждой строки P берётся ровно одна клетка — та, где стоит верный класс. Для наших четырёх картинок это столбцы 4, 6, 3 и 9. Остальные 36 чисел в формулу не входят вовсе.</p><div class="math-display" data-tex="L = -\tfrac{1}{4}\left(\log 0{,}1488 + \log 0{,}1381 + \log 0{,}1099 + \log 0{,}0843\right) = \tfrac{1}{4}\left(1{,}9050 + 1{,}9796 + 2{,}2081 + 2{,}4735\right) = 2{,}1416"></div><p>Сильнее всех штрафуется восьмёрка — 2,4735: ей досталась самая маленькая вероятность 0,0843. Именно она и потянет градиент сильнее остальных.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout-red">
  <strong>Осторожно с «уже угадала»:</strong> необученная сеть верно назвала две картинки из четырёх.
  Это не признак того, что что-то работает, — это случайность на выборке из четырёх объектов.
  На всей отложенной выборке та же сеть даёт 12,44 %, то есть почти ровно уровень угадывания.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> у необученной сети все десять вероятностей примерно равны 0,1,
  а потеря близка к ln 10 = 2,3026. Это правильное начальное состояние и лучший ориентир на старте:
  если первые батчи дают потерю около 2,3 — всё в порядке, если 20 — где-то ошибка.
</div>

---

## Часть 5. Потеря: одно число вместо сорока

<p>
  На выходе сети сорок чисел: четыре объекта по десять вероятностей. Чтобы сравнивать состояния сети
  между собой и брать производные, нужно одно число. Его даёт <strong>кросс-энтропия</strong>: берём
  вероятность, которую сеть присвоила верному классу, считаем её логарифм со знаком минус и усредняем
  по батчу.
</p>

<div class="math-display" data-tex="L = -\frac{1}{B}\sum_{i=1}^{B}\sum_{c=1}^{10} y_{ic}\,\log p_{ic} \;=\; -\frac{1}{B}\sum_{i=1}^{B} \log p_{i,\,y_i}"></div>

<p>
  Второе равенство — это то же самое, записанное короче: one-hot метка обнуляет девять слагаемых
  из десяти, и в сумме остаётся ровно одно. Обе записи полезны: первая удобна для вывода градиента,
  вторая — для понимания.
</p>

<div class="callout-blue">
  <strong>Почему логарифм, а не «1 − p»:</strong> из-за формы штрафа. Рядом с единицей −log p почти
  плоский, а у нуля уходит в бесконечность. Значит, уверенная ошибка наказывается несопоставимо
  сильнее, чем честное «не знаю»: вероятность 0,01 у верного класса стоит 4,61, а 0,1 — только 2,30.
  Это ровно то поведение, которого мы хотим от классификатора.
</div>

<p>Посмотрим пошагово, как из сорока чисел получается одно.</p>

<div class="stage" id="stageLS" tabindex="0">
  <div class="stage-figure">
<svg id="ls" viewBox="0 0 960 500" role="img" aria-label="Вероятности четырёх объектов, выбор верного класса и логарифмический штраф">
  <style>
    #ls { font-family: Helvetica, Arial, sans-serif; }
    #ls .lbl { font-size: 16px; fill: #111111; }
    #ls .cap { font-size: 13px; fill: #5E5850; }
    #ls .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #ls .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #ls .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #ls .legend { font-size: 13px; fill: #5E5850; }
    #ls .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ls-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="ls-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="ls-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<g data-key="bars">
<text x="40" y="66" class="cap">P — по строке на объект, в каждой строке сумма ровно 1</text>
<text x="62" y="132" class="cap" text-anchor="end">цифра 3</text>
<line x1="70" y1="150" x2="530" y2="150" stroke="#D8D4C8" stroke-width="1"/>
<rect x="70" y="123.7" width="40" height="26.3" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="116" y="121.5" width="40" height="28.5" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="162" y="125.3" width="40" height="24.7" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="208" y="105.4" width="40" height="44.6" fill="#73B222" fill-opacity="0.75" stroke="#73B222" stroke-width="1"/>
<rect x="254" y="114.5" width="40" height="35.5" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="300" y="123.3" width="40" height="26.7" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="346" y="132.6" width="40" height="17.4" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="392" y="112.7" width="40" height="37.3" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="438" y="122.5" width="40" height="27.5" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="484" y="118.6" width="40" height="31.4" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="62" y="214" class="cap" text-anchor="end">цифра 5</text>
<line x1="70" y1="232" x2="530" y2="232" stroke="#D8D4C8" stroke-width="1"/>
<rect x="70" y="198.8" width="40" height="33.2" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="116" y="210.4" width="40" height="21.6" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="162" y="212.1" width="40" height="20.0" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="208" y="191.3" width="40" height="40.7" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="254" y="202.3" width="40" height="29.7" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="300" y="190.6" width="40" height="41.4" fill="#73B222" fill-opacity="0.75" stroke="#73B222" stroke-width="1"/>
<rect x="346" y="211.9" width="40" height="20.1" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="392" y="195.9" width="40" height="36.1" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="438" y="202.2" width="40" height="29.8" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="484" y="204.5" width="40" height="27.5" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="62" y="296" class="cap" text-anchor="end">цифра 2</text>
<line x1="70" y1="314" x2="530" y2="314" stroke="#D8D4C8" stroke-width="1"/>
<rect x="70" y="285.6" width="40" height="28.4" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="116" y="290.0" width="40" height="24.0" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="162" y="281.0" width="40" height="33.0" fill="#73B222" fill-opacity="0.75" stroke="#73B222" stroke-width="1"/>
<rect x="208" y="276.9" width="40" height="37.0" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="254" y="285.5" width="40" height="28.5" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="300" y="276.8" width="40" height="37.2" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="346" y="288.1" width="40" height="25.9" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="392" y="285.6" width="40" height="28.4" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="438" y="289.2" width="40" height="24.8" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<rect x="484" y="281.3" width="40" height="32.7" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="62" y="378" class="cap" text-anchor="end">цифра 8</text>
<line x1="70" y1="396" x2="530" y2="396" stroke="#D8D4C8" stroke-width="1"/>
<rect x="70" y="354.6" width="40" height="41.4" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="90" y="412" text-anchor="middle" font-size="12" fill="#5E5850">0</text>
<rect x="116" y="365.9" width="40" height="30.2" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="136" y="412" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="162" y="381.9" width="40" height="14.1" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="182" y="412" text-anchor="middle" font-size="12" fill="#5E5850">2</text>
<rect x="208" y="361.2" width="40" height="34.8" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="228" y="412" text-anchor="middle" font-size="12" fill="#5E5850">3</text>
<rect x="254" y="370.6" width="40" height="25.4" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="274" y="412" text-anchor="middle" font-size="12" fill="#5E5850">4</text>
<rect x="300" y="353.7" width="40" height="42.3" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="320" y="412" text-anchor="middle" font-size="12" fill="#5E5850">5</text>
<rect x="346" y="381.6" width="40" height="14.4" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="366" y="412" text-anchor="middle" font-size="12" fill="#5E5850">6</text>
<rect x="392" y="353.0" width="40" height="43.0" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="412" y="412" text-anchor="middle" font-size="12" fill="#5E5850">7</text>
<rect x="438" y="370.7" width="40" height="25.3" fill="#73B222" fill-opacity="0.75" stroke="#73B222" stroke-width="1"/>
<text x="458" y="412" text-anchor="middle" font-size="12" fill="#5E5850">8</text>
<rect x="484" y="366.8" width="40" height="29.2" fill="#3576C0" fill-opacity="0.4" stroke="#3576C0" stroke-width="1"/>
<text x="504" y="412" text-anchor="middle" font-size="12" fill="#5E5850">9</text>
</g>
<g data-key="pick" data-only="1">
<rect x="205" y="102.4" width="46" height="50.6" fill="none" stroke="#C30B0A" stroke-width="2"/>
<text x="228" y="95.4" text-anchor="middle" font-size="12" fill="#C30B0A">0,1488</text>
<rect x="297" y="187.6" width="46" height="47.4" fill="none" stroke="#C30B0A" stroke-width="2"/>
<text x="320" y="180.6" text-anchor="middle" font-size="12" fill="#C30B0A">0,1381</text>
<rect x="159" y="278.0" width="46" height="39.0" fill="none" stroke="#C30B0A" stroke-width="2"/>
<text x="182" y="271.0" text-anchor="middle" font-size="12" fill="#C30B0A">0,1099</text>
<rect x="435" y="367.7" width="46" height="31.3" fill="none" stroke="#C30B0A" stroke-width="2"/>
<text x="458" y="360.7" text-anchor="middle" font-size="12" fill="#C30B0A">0,0843</text>
</g>
<g data-key="curve">
<text x="600" y="66" class="cap">штраф −log p: чем меньше вероятность,</text>
<text x="600" y="84" class="cap">тем он больше</text>
<line x1="620" y1="310" x2="920" y2="310" stroke="#5E5850" stroke-width="1.2"/>
<line x1="620" y1="100" x2="620" y2="310" stroke="#5E5850" stroke-width="1.2"/>
<polyline points="626.0,131.4 629.0,149.9 632.0,163.1 635.0,173.2 638.0,181.6 641.0,188.6 644.0,194.7 647.0,200.1 650.0,204.9 653.0,209.2 656.0,213.2 659.0,216.9 662.0,220.2 665.0,223.4 668.0,226.3 671.0,229.1 674.0,231.7 677.0,234.2 680.0,236.5 683.0,238.8 686.0,240.9 689.0,242.9 692.0,244.8 695.0,246.7 698.0,248.5 701.0,250.2 704.0,251.9 707.0,253.5 710.0,255.0 713.0,256.5 716.0,258.0 719.0,259.4 722.0,260.7 725.0,262.1 728.0,263.4 731.0,264.6 734.0,265.8 737.0,267.0 740.0,268.2 743.0,269.3 746.0,270.4 749.0,271.5 752.0,272.5 755.0,273.5 758.0,274.5 761.0,275.5 764.0,276.5 767.0,277.4 770.0,278.4 773.0,279.3 776.0,280.1 779.0,281.0 782.0,281.9 785.0,282.7 788.0,283.5 791.0,284.3 794.0,285.1 797.0,285.9 800.0,286.7 803.0,287.4 806.0,288.2 809.0,288.9 812.0,289.6 815.0,290.3 818.0,291.0 821.0,291.7 824.0,292.4 827.0,293.1 830.0,293.7 833.0,294.4 836.0,295.0 839.0,295.6 842.0,296.3 845.0,296.9 848.0,297.5 851.0,298.1 854.0,298.7 857.0,299.2 860.0,299.8 863.0,300.4 866.0,300.9 869.0,301.5 872.0,302.0 875.0,302.6 878.0,303.1 881.0,303.6 884.0,304.2 887.0,304.7 890.0,305.2 893.0,305.7 896.0,306.2 899.0,306.7 902.0,307.2 905.0,307.7 908.0,308.1 911.0,308.6 914.0,309.1 917.0,309.5 920.0,310.0" fill="none" stroke="#C30B0A" stroke-width="2"/>
<text x="614" y="110" class="cap" text-anchor="end">4,6</text>
<text x="614" y="310" class="cap" text-anchor="end">0</text>
<text x="620" y="328" class="cap" text-anchor="middle">0</text>
<text x="920" y="328" class="cap" text-anchor="middle">1</text>
<text x="770.0" y="346" class="cap" text-anchor="middle">вероятность верного класса</text>
</g>
<g data-key="dots" data-only="1">
<circle cx="664.6" cy="223.0" r="4.5" fill="#C30B0A"/>
<circle cx="661.4" cy="219.6" r="4.5" fill="#C30B0A"/>
<circle cx="653.0" cy="209.2" r="4.5" fill="#C30B0A"/>
<circle cx="645.3" cy="197.1" r="4.5" fill="#C30B0A"/>
<text x="640" y="122" class="cap" fill="#C30B0A">все четыре объекта здесь</text>
</g>
<g data-key="mean">
<rect x="600" y="380" width="330" height="90" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
<text x="616" y="406" class="cap">четыре штрафа и их среднее</text>
<text x="616" y="430" class="lbl">1,9050 · 1,9796 · 2,2081 · 2,4735</text>
<text x="616" y="456" class="lbl">L = 2,1416</text>
</g>
<g data-key="ln10" data-only="1">
<line x1="620" y1="204.9" x2="920" y2="204.9" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="5 4"/>
<text x="920" y="196.9" class="cap" text-anchor="end">ln 10 — «сеть не знает ничего»</text>
</g>
<text x="40" y="490" class="legend">зелёный — вероятность верного класса · синий — остальные девять · красный — штраф</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="bars" data-focus="bars">
      <div class="step-kicker">Шаг 1 · ответ сети</div>
      <h4>Десять чисел на объект, в сумме 1</h4>
<p>Каждая строка — одна картинка. Столбики почти одинаковой высоты: необученная сеть раздаёт всем классам примерно по 0,1. Заметьте, что сравнивать высоту столбиков между строками бессмысленно — сумма внутри строки всегда 1.</p>
    </div>
    <div class="step-panel" data-on="bars pick" data-focus="pick">
      <div class="step-kicker">Шаг 2 · метка выбирает один столбик</div>
      <h4>Из десяти чисел в счёт идёт ровно одно</h4>
<p>One-hot метка обнуляет девять слагаемых из десяти, и в потере остаётся только вероятность верного класса: 0,1488, 0,1381, 0,1099 и 0,0843. Всё, что сеть думает про остальные классы, попадает в потерю лишь косвенно — через сумму в знаменателе softmax.</p>
    </div>
    <div class="step-panel" data-on="bars pick curve" data-focus="curve">
      <div class="step-kicker">Шаг 3 · логарифм</div>
      <h4>Штраф равен −log p и растёт до бесконечности</h4>
<p>Почему логарифм, а не, скажем, 1 − p? Из-за формы: около единицы штраф почти нулевой, а при стремлении вероятности к нулю он неограниченно растёт. Сеть, уверенно давшая верному классу 0,01, наказывается в 4,6 раза сильнее, чем сеть, честно сказавшая «не знаю» (0,1).</p>
    </div>
    <div class="step-panel" data-on="bars pick curve dots mean" data-focus="mean">
      <div class="step-kicker">Шаг 4 · средняя по батчу</div>
      <h4>L = 2,1416 на четырёх картинках</h4>
<p>Четыре штрафа усредняются: (1,9050 + 1,9796 + 2,2081 + 2,4735) / 4 = 2,1416. Именно деление на размер батча делает потерю сравнимой между батчами разного размера — и оно же появится в первой формуле обратного прохода.</p>
    </div>
    <div class="step-panel" data-on="bars pick curve dots mean ln10" data-focus="ln10">
      <div class="step-kicker">Шаг 5 · с чем сравнивать</div>
      <h4>ln 10 = 2,3026 — уровень полного незнания</h4>
<p>Если сеть выдаёт всем десяти классам по 0,1, потеря равна −log 0,1 = 2,3026. Наши 2,1416 чуть ниже — просто повезло с начальными весами. Это лучший ориентир на старте обучения: потеря около 2,3 — сеть не сдвинулась, потеря 5 или 10 — где-то ошибка в коде или шаг слишком велик.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> потеря — это единственное число, которое сеть уменьшает,
  и с ним всегда стоит держать рядом ориентир. Для десяти классов таким ориентиром служит
  ln 10 = 2,3026: столько получается у сети, которая не знает ничего.
</div>

---

## Часть 6. Обратный проход: выводим пять формул

<p>
  Нам нужны 2410 производных — по одной на каждый параметр. Считать их по определению, сдвигая
  каждое число и пересчитывая потерю, значит выполнить 2410 прямых проходов на каждый шаг обучения.
  Обратный проход даёт все производные разом, за один проход справа налево, и стоит примерно
  столько же, сколько прямой. Сейчас мы его выведем — целиком, с нуля.
</p>

<p>
  Одно соглашение, без которого выкладка расползается. Производная скаляра по матрице — это матрица
  той же формы, в клетке которой стоит производная по соответствующему числу:
</p>

<div class="math-display" data-tex="\left(\frac{\partial L}{\partial W}\right)_{jc} \;=\; \frac{\partial L}{\partial w_{jc}}"></div>

<p>
  Отсюда сразу следует правило форм, которым мы будем пользоваться как проверкой: у ∂L/∂W⁽¹⁾
  форма 64 × 32, у ∂L/∂b⁽²⁾ — десять чисел, у ∂L/∂Z⁽²⁾ — 4 × 10. Ниже три вывода: softmax
  с кросс-энтропией, линейный слой и ReLU. Больше в нашей сети ничего нет.
</p>

### Вывод 1. Softmax и кросс-энтропия дают P − Y

<p>
  Возьмём один объект и опустим индекс строки. Есть оценки <span class="math-inline" data-tex="z_1,\ldots,z_{10}"></span>,
  из них softmax делает вероятности, а кросс-энтропия — штраф:
</p>

<div class="math-display" data-tex="p_c = \frac{e^{z_c}}{\sum_{k=1}^{10} e^{z_k}}, \qquad L_i = -\sum_{c} y_c \log p_c = -\log p_{y}"></div>

<p>
  Сначала производная самой softmax. Обозначим знаменатель
  <span class="math-inline" data-tex="S = \sum_k e^{z_k}"></span> и продифференцируем частное
  по произвольной оценке <span class="math-inline" data-tex="z_m"></span>. Числитель зависит
  от <span class="math-inline" data-tex="z_m"></span>, только если c = m, а знаменатель — всегда:
</p>

<div class="math-display" data-tex="\frac{\partial p_c}{\partial z_m} = \frac{\delta_{cm} e^{z_c} S - e^{z_c} e^{z_m}}{S^2} = p_c\left(\delta_{cm} - p_m\right)"></div>

<p>
  Здесь <span class="math-inline" data-tex="\delta_{cm}"></span> равна единице при c = m и нулю иначе.
  Теперь подставим это в производную потери. Логарифм даёт множитель
  <span class="math-inline" data-tex="1/p_y"></span>, и он сокращается с
  <span class="math-inline" data-tex="p_y"></span> из формулы выше:
</p>

<div class="math-display" data-tex="\frac{\partial L_i}{\partial z_m} = -\frac{1}{p_{y}}\cdot\frac{\partial p_{y}}{\partial z_m} = -\frac{1}{p_{y}}\cdot p_{y}\left(\delta_{ym} - p_m\right) = p_m - y_m"></div>

<p>
  Всё сократилось: остаётся разность «что сеть выдала минус что было надо». Якобиан softmax
  размером 10 × 10 существовал ровно одно преобразование и исчез. Потеря батча — это среднее
  по B объектам, поэтому каждая строка ещё делится на B:
</p>

<div class="math-display" data-tex="\boxed{\;\frac{\partial L}{\partial Z^{(2)}} = \frac{P - Y}{B}\;} \qquad [B \times 10]"></div>

<div class="callout-blue">
  <strong>Проверка на нашем батче:</strong> у первой картинки верный класс — тройка, и сеть дала ей
  p = 0,1488. Формула обещает (0,1488 − 1)/4 = −0,2128, а для любого неверного класса — просто p/4,
  например 0,0876/4 = 0,0219. Ровно эти числа и стоят в первой строке ∂L/∂Z⁽²⁾. Заодно видно,
  почему сумма строки равна нулю: сумма всех p равна единице, сумма всех y — тоже.
</div>

### Вывод 2. Линейный слой: три производные из одной формулы

<p>
  Второй слой считает <span class="math-inline" data-tex="Z = A W + b"></span>, то есть поэлементно
  <span class="math-inline" data-tex="z_{ic} = \sum_j a_{ij} w_{jc} + b_c"></span>. Пусть градиент
  по выходу <span class="math-inline" data-tex="\partial L/\partial z_{ic}"></span> уже известен —
  его дал предыдущий вывод. Дальше работает правило цепочки: каждое число влияет на L через все
  выходы, в которых участвует, и вклады складываются.
</p>

<p>
  Вес <span class="math-inline" data-tex="w_{jc}"></span> участвует в одном выходе каждой строки
  батча — в <span class="math-inline" data-tex="z_{ic}"></span>, с множителем
  <span class="math-inline" data-tex="a_{ij}"></span>. Значит, суммировать надо по строкам:
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial w_{jc}} = \sum_{i=1}^{B} \frac{\partial L}{\partial z_{ic}}\cdot\frac{\partial z_{ic}}{\partial w_{jc}} = \sum_{i=1}^{B} a_{ij}\,\frac{\partial L}{\partial z_{ic}} \qquad\Longrightarrow\qquad \frac{\partial L}{\partial W} = A^{\top}\frac{\partial L}{\partial Z}"></div>

<p>
  Последний переход — это просто определение матричного произведения: сумма по общему индексу i,
  а он у A стоит в строках, поэтому A транспонируется. Смещение
  <span class="math-inline" data-tex="b_c"></span> входит в те же выходы, но с множителем единица:
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial b_c} = \sum_{i=1}^{B} \frac{\partial L}{\partial z_{ic}} \qquad\Longrightarrow\qquad \frac{\partial L}{\partial b} = \text{сумма } \frac{\partial L}{\partial Z} \text{ по строкам}"></div>

<p>
  Осталось протолкнуть градиент дальше влево. Активация
  <span class="math-inline" data-tex="a_{ij}"></span> влияет на все десять выходов своей строки,
  каждый раз с множителем <span class="math-inline" data-tex="w_{jc}"></span>:
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial a_{ij}} = \sum_{c=1}^{10} w_{jc}\,\frac{\partial L}{\partial z_{ic}} \qquad\Longrightarrow\qquad \frac{\partial L}{\partial A} = \frac{\partial L}{\partial Z}\,W^{\top}"></div>

<p>
  Три формулы — и все три получены одним и тем же движением: выписать, куда входит число,
  и сложить вклады. Транспонирование появилось не как приём, а как единственный способ поставить
  суммирование по нужному индексу.
</p>

<div class="callout-blue">
  <strong>Проверка на нашем батче:</strong> возьмём вес между нейроном 21 и классом «3». Формула даёт
  сумму четырёх произведений «активация × градиент выхода»:
  1,0536 · (−0,2128) + 0,5808 · 0,0339 + 0,5335 · 0,0309 + 0,9531 · 0,0290 = −0,1604.
  Столько и стоит в ∂L/∂W⁽²⁾ на месте [21, 3]. Видно и смысл: первое слагаемое, где нейрон был
  активнее всего, а класс ошибся сильнее всего, задаёт знак всей суммы.
</div>

### Вывод 3. ReLU — это маска

<p>
  Между слоями стоит <span class="math-inline" data-tex="a = \max(0, z)"></span>. Функция кусочно
  линейная, поэтому её производная принимает всего два значения:
</p>

<div class="math-display" data-tex="\frac{\partial a}{\partial z} = \begin{cases} 1, &amp; z > 0\\ 0, &amp; z < 0\end{cases} \qquad\Longrightarrow\qquad \frac{\partial L}{\partial Z^{(1)}} = \frac{\partial L}{\partial A^{(1)}} \odot \mathbb{1}\left[Z^{(1)} > 0\right]"></div>

<p>
  Знак <span class="math-inline" data-tex="\odot"></span> — поэлементное умножение: каждая клетка
  умножается на свою, потому что ReLU действует на каждое число отдельно и не смешивает их.
  В нуле производной нет, и это не мешает: на практике берут 0 или 1 по соглашению, а точное
  попадание в ноль случается с вероятностью, равной нулю.
</p>

<div class="callout-yellow">
  <strong>Отсюда растёт «умирание» нейронов:</strong> если нейрон закрыт на всех картинках батча,
  его столбец маски целиком нулевой — градиент до его весов не доходит, и они не меняются.
  На нашем батче это 10 нейронов из 32, а к концу обучения два нейрона окажутся закрытыми
  вообще на всех 1347 картинках.
</div>

### Всё вместе

<p>
  Три вывода дают пять формул, и две из них применяются дважды — по разу на слой. Ниже полный
  обратный проход нашей сети; никакой шестой формулы не существует.
</p>

<table class="shape-table">
  <tr><th>Шаг</th><th>Формула</th><th>Форма</th></tr>
  <tr><td>вход обратного прохода</td><td><code>(P − Y) / B</code></td><td>B × 10</td></tr>
  <tr><td>градиент веса</td><td><code>(вход слоя)ᵀ · (градиент выхода)</code></td><td>как у W</td></tr>
  <tr><td>градиент смещения</td><td>сумма градиента выхода по строкам</td><td>как у b</td></tr>
  <tr><td>проброс назад</td><td><code>(градиент выхода) · Wᵀ</code></td><td>как у входа слоя</td></tr>
  <tr><td>через ReLU</td><td>умножить на маску <code>Z &gt; 0</code></td><td>без изменений</td></tr>
</table>

<p>
  Почему это дёшево: каждая величина считается ровно один раз и переиспользуется дальше.
  ∂L/∂Z⁽²⁾ нужна и для весов второго слоя, и для проброса влево; ∂L/∂A⁽¹⁾ — только чтобы получить
  ∂L/∂Z⁽¹⁾, а та — чтобы получить веса первого слоя. Ни одна величина не пересчитывается заново,
  поэтому весь обратный проход стоит примерно как один прямой, а не как 2410 прямых.
</p>

<p>Посмотрим пошагово, как градиент едет от потери до первого слоя.</p>

<div class="stage" id="stageBW" tabindex="0">
  <div class="stage-figure">
<svg id="bw" viewBox="0 0 960 610" role="img" aria-label="Обратный проход в формах: карточки слоёв, красные стрелки градиента и коробочки производных по параметрам">
  <style>
    #bw { font-family: Helvetica, Arial, sans-serif; }
    #bw .lbl { font-size: 16px; fill: #111111; }
    #bw .cap { font-size: 13px; fill: #5E5850; }
    #bw .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #bw .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #bw .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #bw .legend { font-size: 13px; fill: #5E5850; }
    #bw .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bw-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="bw-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="bw-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<defs><marker id="bw-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker></defs>
<text x="34" y="44" class="cap">зелёным — прямой проход, красным — обратный; у производной всегда форма того, по чему дифференцируем</text>
<g data-key="net">
<rect x="34" y="72" width="104" height="220" rx="10" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.8"/>
<text x="86" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 86 168)">Вход</text>
<text x="86" y="260" text-anchor="middle" font-size="13" fill="#5E5850">батч картинок</text>
<rect x="214" y="72" width="104" height="220" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.8"/>
<text x="266" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 266 168)">Скрытый слой</text>
<text x="266" y="260" text-anchor="middle" font-size="13" fill="#5E5850">Linear 64 → 32</text>
<rect x="394" y="72" width="104" height="220" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.8"/>
<text x="446" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 446 168)">Выходной слой</text>
<text x="446" y="260" text-anchor="middle" font-size="13" fill="#5E5850">Linear 32 → 10</text>
<rect x="574" y="72" width="104" height="220" rx="10" fill="#F0FAF0" stroke="#73B222" stroke-width="1.8"/>
<text x="626" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 626 168)">Softmax</text>
<text x="626" y="260" text-anchor="middle" font-size="13" fill="#5E5850">в вероятности</text>
<rect x="754" y="72" width="104" height="220" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="806" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 806 168)">Потеря</text>
<text x="806" y="260" text-anchor="middle" font-size="13" fill="#C30B0A">cross-entropy</text>
<g data-key="gz1"><text x="266" y="280" text-anchor="middle" font-size="13" fill="#73B222">+ ReLU</text></g>
<line x1="144" y1="172" x2="208" y2="172" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#bw-arg)"/>
<text x="176" y="158" class="nm" text-anchor="middle">X</text>
<text x="176" y="194" class="dim" text-anchor="middle">4 × 64</text>
<line x1="324" y1="172" x2="388" y2="172" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#bw-arg)"/>
<text x="356" y="158" class="nm" text-anchor="middle">A⁽¹⁾</text>
<text x="356" y="194" class="dim" text-anchor="middle">4 × 32</text>
<line x1="504" y1="172" x2="568" y2="172" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#bw-arg)"/>
<text x="536" y="158" class="nm" text-anchor="middle">Z⁽²⁾</text>
<text x="536" y="194" class="dim" text-anchor="middle">4 × 10</text>
<line x1="684" y1="172" x2="748" y2="172" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#bw-arg)"/>
<text x="716" y="158" class="nm" text-anchor="middle">P</text>
<text x="716" y="194" class="dim" text-anchor="middle">4 × 10</text>
</g>
<g data-key="gx">
<line x1="208" y1="332" x2="144" y2="332" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bw-arr)"/>
<text x="176" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂X</text>
<text x="176" y="354" class="dim" text-anchor="middle">4 × 64</text>
</g>
<g data-key="ga1">
<line x1="388" y1="332" x2="324" y2="332" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bw-arr)"/>
<text x="356" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂A⁽¹⁾</text>
<text x="356" y="354" class="dim" text-anchor="middle">4 × 32</text>
</g>
<g data-key="gz2">
<line x1="568" y1="332" x2="504" y2="332" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bw-arr)"/>
<text x="536" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂Z⁽²⁾</text>
<text x="536" y="354" class="dim" text-anchor="middle">4 × 10</text>
</g>
<g data-key="gp">
<line x1="748" y1="332" x2="684" y2="332" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bw-arr)"/>
<text x="716" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂P</text>
<text x="716" y="354" class="dim" text-anchor="middle">4 × 10</text>
</g>
<g data-key="hl4" data-only="1"><rect x="750" y="68" width="112" height="228" rx="12" fill="none" stroke="#C30B0A" stroke-width="2.4"/></g>
<g data-key="hl3" data-only="1"><rect x="570" y="68" width="112" height="228" rx="12" fill="none" stroke="#C30B0A" stroke-width="2.4"/></g>
<g data-key="hl2" data-only="1"><rect x="390" y="68" width="112" height="228" rx="12" fill="none" stroke="#C30B0A" stroke-width="2.4"/></g>
<g data-key="hl1" data-only="1"><rect x="210" y="68" width="112" height="228" rx="12" fill="none" stroke="#C30B0A" stroke-width="2.4"/></g>
<g data-key="gw1"><line x1="266.0" y1="386" x2="266.0" y2="296" stroke="#C30B0A" stroke-width="1.6" fill="none"/><rect x="170" y="386" width="176" height="70" rx="8" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.7"/><text x="258" y="410" class="nm" text-anchor="middle" fill="#C30B0A">∂L/∂W⁽¹⁾, ∂L/∂b⁽¹⁾</text><text x="258" y="430" class="dim" text-anchor="middle">64 × 32 · 32</text><text x="258" y="448" class="cap" text-anchor="middle">2080 чисел</text></g>
<g data-key="gw2"><line x1="446.0" y1="386" x2="446.0" y2="296" stroke="#C30B0A" stroke-width="1.6" fill="none"/><rect x="362" y="386" width="176" height="70" rx="8" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.7"/><text x="450" y="410" class="nm" text-anchor="middle" fill="#C30B0A">∂L/∂W⁽²⁾, ∂L/∂b⁽²⁾</text><text x="450" y="430" class="dim" text-anchor="middle">32 × 10 · 10</text><text x="450" y="448" class="cap" text-anchor="middle">330 чисел</text></g>
<g data-key="gz1" data-only="1">
<text x="560" y="410" class="nm" fill="#73B222">∂L/∂Z⁽¹⁾ = ∂L/∂A⁽¹⁾ ⊙ [Z⁽¹⁾ &gt; 0]</text>
<text x="560" y="432" class="cap">маска сохранена с прямого прохода: 4 × 32</text>
</g>
<g data-key="rule" data-only="1">
<text x="560" y="410" class="nm" fill="#C30B0A">форма ∂L/∂θ = форма θ</text>
<text x="560" y="432" class="cap">проверка, которая ловит почти все ошибки в коде</text>
</g>
<rect x="34" y="476" width="892" height="76" rx="10" fill="#FFFFFF" stroke="#E4E1D7" stroke-width="1.3"/>
<text x="52" y="498" class="cap">формула шага</text>
<g data-key="fm0" data-only="1"><foreignObject x="52" y="502" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\text{нужно: } \dfrac{\partial L}{\partial W^{(1)}},\ \dfrac{\partial L}{\partial b^{(1)}},\ \dfrac{\partial L}{\partial W^{(2)}},\ \dfrac{\partial L}{\partial b^{(2)}} \quad \text{— всего } 2410 \ \text{чисел}"></div></foreignObject></g>
<g data-key="fm1" data-only="1"><foreignObject x="52" y="502" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial Z^{(2)}} = \dfrac{P - Y}{B} \qquad [4 \times 10]"></div></foreignObject></g>
<g data-key="fm2" data-only="1"><foreignObject x="52" y="502" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial W^{(2)}} = \left(A^{(1)}\right)^{\!\top} \dfrac{\partial L}{\partial Z^{(2)}}, \qquad \dfrac{\partial L}{\partial b^{(2)}} = \sum_{i=1}^{B} \dfrac{\partial L}{\partial z^{(2)}_{i}}"></div></foreignObject></g>
<g data-key="fm3" data-only="1"><foreignObject x="52" y="502" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial A^{(1)}} = \dfrac{\partial L}{\partial Z^{(2)}} \left(W^{(2)}\right)^{\!\top} \qquad [4 \times 10]\cdot[10 \times 32] \rightarrow [4 \times 32]"></div></foreignObject></g>
<g data-key="fm4" data-only="1"><foreignObject x="52" y="502" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial Z^{(1)}} = \dfrac{\partial L}{\partial A^{(1)}} \odot \mathbb{1}\left[Z^{(1)} > 0\right]"></div></foreignObject></g>
<g data-key="fm5" data-only="1"><foreignObject x="52" y="502" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial W^{(1)}} = X^{\top} \dfrac{\partial L}{\partial Z^{(1)}}, \qquad \dfrac{\partial L}{\partial b^{(1)}} = \sum_{i=1}^{B} \dfrac{\partial L}{\partial z^{(1)}_{i}}"></div></foreignObject></g>
<g data-key="fm6" data-only="1"><foreignObject x="52" y="502" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\text{форма } \dfrac{\partial L}{\partial \theta} = \text{форма } \theta \quad \text{для любого параметра } \theta"></div></foreignObject></g>
<text x="34" y="586" class="legend">красные коробочки под карточками — то, ради чего затевался обратный проход: производные по параметрам слоя</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="net gp hl4 fm0" data-focus="hl4">
      <div class="step-kicker">Шаг 1 · что мы ищем</div>
      <h4>2410 производных — по одной на каждый параметр</h4>
<p>Нам нужно узнать, как изменится L при крошечном сдвиге каждого из 2410 чисел. Считать это по определению — 2410 отдельных прямых проходов. Обратный проход получает все производные разом за один проход справа налево, потому что по дороге переиспользует уже посчитанное.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 hl3 fm1" data-focus="gz2">
      <div class="step-kicker">Шаг 2 · первый узел</div>
      <h4>Softmax и кросс-энтропия схлопываются в (P − Y)/B</h4>
<p>Если считать честно, производная потери по Z⁽²⁾ — это произведение градиента потери по P на якобиан softmax размером 10 × 10. Но при паре «softmax + кросс-энтропия» всё сокращается до разности «что сеть выдала минус что было надо», делённой на размер батча. Поэтому красная стрелка проходит softmax насквозь и первый настоящий узел — уже Z⁽²⁾.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 gw2 hl2 fm2" data-focus="gw2">
      <div class="step-kicker">Шаг 3 · параметры второго слоя</div>
      <h4>Градиент веса — это вход, умноженный на градиент выхода</h4>
<p>∂L/∂W⁽²⁾ = (A⁽¹⁾)ᵀ · ∂L/∂Z⁽²⁾: [32 × 4] · [4 × 10] = [32 × 10] — форма совпала с самой W⁽²⁾. Смысл прост: вес между нейроном j и классом c виноват тем сильнее, чем активнее был нейрон и чем сильнее ошибся класс. Для смещения вход — единица, поэтому там просто сумма по строкам батча.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 gw2 ga1 hl2 fm3" data-focus="ga1">
      <div class="step-kicker">Шаг 4 · протолкнуть назад</div>
      <h4>Тот же вес, но транспонированный</h4>
<p>∂L/∂A⁽¹⁾ = ∂L/∂Z⁽²⁾ · (W⁽²⁾)ᵀ: [4 × 10] · [10 × 32] = [4 × 32]. Вперёд вес умножал вход, назад — тот же вес умножает градиент, только с другой стороны. Транспонирование здесь не трюк, а единственный способ сложить формы.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 gw2 ga1 gz1 hl1 fm4" data-focus="gz1">
      <div class="step-kicker">Шаг 5 · через ReLU</div>
      <h4>Маска из нулей и единиц</h4>
<p>Производная max(0, z) равна 1 там, где z был положителен, и 0 в остальных местах. Поэтому ∂L/∂Z⁽¹⁾ = ∂L/∂A⁽¹⁾ ⊙ [Z⁽¹⁾ &gt; 0] — поэлементное умножение на маску, сохранённую с прямого прохода. ReLU живёт внутри карточки скрытого слоя, и градиент проходит её насквозь, теряя ровно те клетки, которые были закрыты.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 gw2 ga1 gz1 gw1 hl1 fm5" data-focus="gw1">
      <div class="step-kicker">Шаг 6 · параметры первого слоя</div>
      <h4>Ровно та же формула, что и для второго</h4>
<p>∂L/∂W⁽¹⁾ = Xᵀ · ∂L/∂Z⁽¹⁾: [64 × 4] · [4 × 32] = [64 × 32]. Никакой новой математики: слой не знает своего номера, и формула для него та же самая. Именно поэтому обратный проход пишется одним циклом по слоям в обратном порядке.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 gw2 ga1 gx gw1 rule fm6" data-focus="rule">
      <div class="step-kicker">Шаг 7 · правило форм</div>
      <h4>У градиента всегда форма того, по чему дифференцируем</h4>
<p>Это самая полезная проверка на практике: ∂L/∂W⁽¹⁾ обязана быть 64 × 32, ∂L/∂b⁽²⁾ — вектором из 10 чисел, ∂L/∂Z⁽²⁾ — матрицей 4 × 10. Слева от первого слоя градиент тоже существует — ∂L/∂X формы 4 × 64, — но считать его незачем: под ним нет параметров. Если формы сошлись, вероятность ошибки в выкладке резко падает; если нет — ошибка найдена, даже не начав считать.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<p>
  Формы сошлись — теперь те же пять формул в клетках и числах. Матрицы снова с индексами, но
  едут в них производные; на каждом шаге мы считаем руками одну клетку и сверяем её с тем,
  что выдал код.
</p>

<div class="stage" id="stageBX" tabindex="0">
  <div class="stage-figure">
<svg id="bx" viewBox="0 0 960 530" role="img" aria-label="Обратный проход в матрицах с индексами: пять формул и подстановка чисел">
  <style>
    #bx { font-family: Helvetica, Arial, sans-serif; }
    #bx .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bx-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="bx-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="bx-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" text-anchor="middle" font-size="12" fill="#5E5850">∂L/∂Z⁽²⁾</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" text-anchor="middle" font-size="12" fill="#5E5850">∂L/∂W⁽²⁾</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" text-anchor="middle" font-size="12" fill="#5E5850">∂L/∂b⁽²⁾</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" text-anchor="middle" font-size="12" fill="#5E5850">∂L/∂A⁽¹⁾</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" text-anchor="middle" font-size="12" fill="#5E5850">∂L/∂Z⁽¹⁾</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" text-anchor="middle" font-size="12" fill="#5E5850">∂L/∂W⁽¹⁾ и ∂L/∂b⁽¹⁾</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" text-anchor="middle" font-size="13" fill="#5E5850">красным — производные, малиновым — клетка, которую считаем руками</text>
<g data-key="e1" data-only="1"><rect x="71" y="150" width="156" height="108" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="123" y1="150" x2="123" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="175" y1="150" x2="175" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="177" x2="227" y2="177" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="204" x2="227" y2="204" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="231" x2="227" y2="231" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 70 145 L 60 145 L 60 263 L 70 263" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 228 145 L 238 145 L 238 263 L 228 263" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="97" y="168" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="149" y="168" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="201" y="168" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="97" y="196" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="149" y="196" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="201" y="196" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="97" y="222" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="149" y="222" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="201" y="222" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="97" y="250" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">64,1</tspan></text>
<text x="149" y="250" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="201" y="250" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">64,32</tspan></text>
<text x="149" y="136" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">64 × 32</text>
<text x="149" y="285" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂W⁽¹⁾</text>
<rect x="301" y="150" width="156" height="27" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="353" y1="150" x2="353" y2="177" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="405" y1="150" x2="405" y2="177" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 300 145 L 290 145 L 290 182 L 300 182" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 458 145 L 468 145 L 468 182 L 458 182" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="327" y="168" text-anchor="middle" font-size="15" fill="#111111">∂b<tspan font-size="11" dy="4">1</tspan></text>
<text x="379" y="168" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="431" y="168" text-anchor="middle" font-size="15" fill="#111111">∂b<tspan font-size="11" dy="4">32</tspan></text>
<text x="379" y="136" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">32</text>
<text x="379" y="204" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂b⁽¹⁾</text>
<rect x="491" y="150" width="156" height="81" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="543" y1="150" x2="543" y2="231" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="595" y1="150" x2="595" y2="231" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="491" y1="177" x2="647" y2="177" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="491" y1="204" x2="647" y2="204" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 490 145 L 480 145 L 480 236 L 490 236" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 648 145 L 658 145 L 658 236 L 648 236" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="517" y="168" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="569" y="168" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="621" y="168" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,10</tspan></text>
<text x="517" y="196" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="569" y="196" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="621" y="196" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="517" y="222" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">32,1</tspan></text>
<text x="569" y="222" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="621" y="222" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">32,10</tspan></text>
<text x="569" y="136" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">32 × 10</text>
<text x="569" y="258" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂W⁽²⁾</text>
<rect x="721" y="150" width="156" height="27" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="773" y1="150" x2="773" y2="177" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="825" y1="150" x2="825" y2="177" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 720 145 L 710 145 L 710 182 L 720 182" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 878 145 L 888 145 L 888 182 L 878 182" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="747" y="168" text-anchor="middle" font-size="15" fill="#111111">∂b<tspan font-size="11" dy="4">1</tspan></text>
<text x="799" y="168" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="851" y="168" text-anchor="middle" font-size="15" fill="#111111">∂b<tspan font-size="11" dy="4">10</tspan></text>
<text x="799" y="136" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">10</text>
<text x="799" y="204" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂b⁽²⁾</text>
<text x="149" y="306" text-anchor="middle" font-size="13" fill="#5E5850">2048 чисел</text>
<text x="379" y="306" text-anchor="middle" font-size="13" fill="#5E5850">32</text>
<text x="569" y="306" text-anchor="middle" font-size="13" fill="#5E5850">320</text>
<text x="799" y="306" text-anchor="middle" font-size="13" fill="#5E5850">10</text>
<text x="480" y="338" text-anchor="middle" font-size="14" fill="#5E5850">всего 2410 — ровно столько же, сколько параметров у сети</text></g>
<g data-key="e2" data-only="1"><rect x="46" y="132" width="252" height="108" fill="#73B222" fill-opacity="0.1"/>
<line x1="88" y1="132" x2="88" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="130" y1="132" x2="130" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="172" y1="132" x2="172" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="214" y1="132" x2="214" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="256" y1="132" x2="256" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="46" y1="159" x2="298" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="46" y1="186" x2="298" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="46" y1="213" x2="298" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 45 127 L 35 127 L 35 245 L 45 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 299 127 L 309 127 L 309 245 L 299 245" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="67" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="109" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="151" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="193" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="235" y="150" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="277" y="150" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="67" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="109" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="151" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,3</tspan></text>
<text x="193" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,4</tspan></text>
<text x="235" y="178" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="277" y="178" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">2,10</tspan></text>
<text x="67" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,1</tspan></text>
<text x="109" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,2</tspan></text>
<text x="151" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,3</tspan></text>
<text x="193" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,4</tspan></text>
<text x="235" y="204" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="277" y="204" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">3,10</tspan></text>
<text x="67" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,1</tspan></text>
<text x="109" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,2</tspan></text>
<text x="151" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,3</tspan></text>
<text x="193" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,4</tspan></text>
<text x="235" y="232" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="277" y="232" text-anchor="middle" font-size="14" fill="#111111">p<tspan font-size="10" dy="4">4,10</tspan></text>
<text x="172" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 10</text>
<text x="172" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">P</text>
<text x="324" y="186" text-anchor="middle" font-size="20" fill="#111111">−</text>
<rect x="350" y="132" width="252" height="108" fill="#5E5850" fill-opacity="0.1"/>
<line x1="392" y1="132" x2="392" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="434" y1="132" x2="434" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="476" y1="132" x2="476" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="518" y1="132" x2="518" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="560" y1="132" x2="560" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="350" y1="159" x2="602" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="350" y1="186" x2="602" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="350" y1="213" x2="602" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 349 127 L 339 127 L 339 245 L 349 245" fill="none" stroke="#5E5850" stroke-width="1.8"/>
<path d="M 603 127 L 613 127 L 613 245 L 603 245" fill="none" stroke="#5E5850" stroke-width="1.8"/>
<text x="371" y="150" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="413" y="150" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="455" y="150" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="497" y="150" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="539" y="150" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="581" y="150" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="371" y="178" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="413" y="178" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="455" y="178" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">2,3</tspan></text>
<text x="497" y="178" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">2,4</tspan></text>
<text x="539" y="178" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="581" y="178" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">2,10</tspan></text>
<text x="371" y="204" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">3,1</tspan></text>
<text x="413" y="204" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">3,2</tspan></text>
<text x="455" y="204" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">3,3</tspan></text>
<text x="497" y="204" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">3,4</tspan></text>
<text x="539" y="204" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="581" y="204" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">3,10</tspan></text>
<text x="371" y="232" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">4,1</tspan></text>
<text x="413" y="232" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">4,2</tspan></text>
<text x="455" y="232" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">4,3</tspan></text>
<text x="497" y="232" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">4,4</tspan></text>
<text x="539" y="232" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="581" y="232" text-anchor="middle" font-size="14" fill="#111111">y<tspan font-size="10" dy="4">4,10</tspan></text>
<text x="476" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 10</text>
<text x="476" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">Y</text>
<text x="628" y="186" text-anchor="middle" font-size="20" fill="#111111">=</text>
<rect x="654" y="132" width="252" height="108" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="696" y1="132" x2="696" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="738" y1="132" x2="738" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="780" y1="132" x2="780" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="822" y1="132" x2="822" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="864" y1="132" x2="864" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="654" y1="159" x2="906" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="654" y1="186" x2="906" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="654" y1="213" x2="906" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 653 127 L 643 127 L 643 245 L 653 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 907 127 L 917 127 L 917 245 L 907 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="675" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="717" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="759" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="801" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="843" y="150" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="885" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="675" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="717" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="759" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,3</tspan></text>
<text x="801" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,4</tspan></text>
<text x="843" y="178" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="885" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,10</tspan></text>
<text x="675" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,1</tspan></text>
<text x="717" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,2</tspan></text>
<text x="759" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,3</tspan></text>
<text x="801" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,4</tspan></text>
<text x="843" y="204" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="885" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,10</tspan></text>
<text x="675" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,1</tspan></text>
<text x="717" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,2</tspan></text>
<text x="759" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,3</tspan></text>
<text x="801" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,4</tspan></text>
<text x="843" y="232" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="885" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,10</tspan></text>
<text x="780" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 10</text>
<text x="780" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂Z⁽²⁾</text>
<text x="480" y="300" text-anchor="middle" font-size="13" fill="#5E5850">потом каждая клетка делится на размер батча B = 4</text>
<text x="476" y="324" text-anchor="middle" font-size="13" fill="#5E5850">в строке Y единица стоит в столбце верного класса, остальное нули</text></g>
<g data-key="h2" data-only="1"><rect x="172" y="132" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="476" y="132" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="780" y="132" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e3" data-only="1"><rect x="81" y="118" width="176" height="135" fill="#73B222" fill-opacity="0.1"/>
<line x1="125" y1="118" x2="125" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="169" y1="118" x2="169" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="213" y1="118" x2="213" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="81" y1="145" x2="257" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="81" y1="172" x2="257" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="81" y1="199" x2="257" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="81" y1="226" x2="257" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 80 113 L 70 113 L 70 258 L 80 258" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 258 113 L 268 113 L 268 258 L 258 258" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="103" y="136" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="147" y="136" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,2</tspan></text>
<text x="191" y="136" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,3</tspan></text>
<text x="235" y="136" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">1,4</tspan></text>
<text x="103" y="164" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="147" y="164" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="191" y="164" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="235" y="164" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="103" y="190" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">22,1</tspan></text>
<text x="147" y="190" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">22,2</tspan></text>
<text x="191" y="190" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">22,3</tspan></text>
<text x="235" y="190" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">22,4</tspan></text>
<text x="103" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="147" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="191" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="235" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="103" y="244" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">32,1</tspan></text>
<text x="147" y="244" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">32,2</tspan></text>
<text x="191" y="244" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">32,3</tspan></text>
<text x="235" y="244" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="11" dy="4">32,4</tspan></text>
<text x="169" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">32 × 4</text>
<text x="169" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">(A⁽¹⁾)ᵀ</text>
<text x="284" y="186" text-anchor="middle" font-size="20" fill="#111111">×</text>
<rect x="311" y="132" width="252" height="108" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="353" y1="132" x2="353" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="395" y1="132" x2="395" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="437" y1="132" x2="437" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="479" y1="132" x2="479" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="521" y1="132" x2="521" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="311" y1="159" x2="563" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="311" y1="186" x2="563" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="311" y1="213" x2="563" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 310 127 L 300 127 L 300 245 L 310 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 564 127 L 574 127 L 574 245 L 564 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="332" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="374" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="416" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="458" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="500" y="150" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="542" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="332" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="374" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="416" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,3</tspan></text>
<text x="458" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,4</tspan></text>
<text x="500" y="178" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="542" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,10</tspan></text>
<text x="332" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,1</tspan></text>
<text x="374" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,2</tspan></text>
<text x="416" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,3</tspan></text>
<text x="458" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,4</tspan></text>
<text x="500" y="204" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="542" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,10</tspan></text>
<text x="332" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,1</tspan></text>
<text x="374" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,2</tspan></text>
<text x="416" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,3</tspan></text>
<text x="458" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,4</tspan></text>
<text x="500" y="232" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="542" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,10</tspan></text>
<text x="437" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 10</text>
<text x="437" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂Z⁽²⁾</text>
<text x="590" y="186" text-anchor="middle" font-size="20" fill="#111111">=</text>
<rect x="617" y="118" width="252" height="135" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="659" y1="118" x2="659" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="701" y1="118" x2="701" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="743" y1="118" x2="743" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="785" y1="118" x2="785" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="827" y1="118" x2="827" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="617" y1="145" x2="869" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="617" y1="172" x2="869" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="617" y1="199" x2="869" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="617" y1="226" x2="869" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 616 113 L 606 113 L 606 258 L 616 258" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 870 113 L 880 113 L 880 258 L 870 258" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="638" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="680" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="722" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="764" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="806" y="136" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="848" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="638" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="680" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="722" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="764" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="806" y="164" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="848" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="638" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,1</tspan></text>
<text x="680" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,2</tspan></text>
<text x="722" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,3</tspan></text>
<text x="764" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,4</tspan></text>
<text x="806" y="190" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="848" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,10</tspan></text>
<text x="638" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="680" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="722" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="764" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="806" y="218" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="848" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="638" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,1</tspan></text>
<text x="680" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,2</tspan></text>
<text x="722" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,3</tspan></text>
<text x="764" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,4</tspan></text>
<text x="806" y="244" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="848" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,10</tspan></text>
<text x="743" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">32 × 10</text>
<text x="743" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂W⁽²⁾</text>
<text x="480" y="320" text-anchor="middle" font-size="13" fill="#5E5850">строка 22 транспонированной A⁽¹⁾ — это активности 22-го нейрона на четырёх картинках</text></g>
<g data-key="h3" data-only="1"><rect x="81" y="172" width="176" height="27" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="437" y="132" width="42" height="108" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="743" y="172" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e4" data-only="1"><rect x="341" y="96" width="252" height="108" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="383" y1="96" x2="383" y2="204" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="425" y1="96" x2="425" y2="204" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="467" y1="96" x2="467" y2="204" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="509" y1="96" x2="509" y2="204" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="551" y1="96" x2="551" y2="204" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="341" y1="123" x2="593" y2="123" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="341" y1="150" x2="593" y2="150" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="341" y1="177" x2="593" y2="177" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 340 91 L 330 91 L 330 209 L 340 209" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 594 91 L 604 91 L 604 209 L 594 209" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="362" y="114" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="404" y="114" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="446" y="114" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="488" y="114" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="530" y="114" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="572" y="114" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="362" y="142" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="404" y="142" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="446" y="142" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,3</tspan></text>
<text x="488" y="142" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,4</tspan></text>
<text x="530" y="142" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="572" y="142" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,10</tspan></text>
<text x="362" y="168" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,1</tspan></text>
<text x="404" y="168" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,2</tspan></text>
<text x="446" y="168" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,3</tspan></text>
<text x="488" y="168" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,4</tspan></text>
<text x="530" y="168" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="572" y="168" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,10</tspan></text>
<text x="362" y="196" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,1</tspan></text>
<text x="404" y="196" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,2</tspan></text>
<text x="446" y="196" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,3</tspan></text>
<text x="488" y="196" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,4</tspan></text>
<text x="530" y="196" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="572" y="196" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,10</tspan></text>
<text x="467" y="82" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 10</text>
<text x="467" y="231" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂Z⁽²⁾</text>
<rect x="341" y="258" width="252" height="27" fill="#C30B0A" fill-opacity="0.18"/>
<line x1="383" y1="258" x2="383" y2="285" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="425" y1="258" x2="425" y2="285" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="467" y1="258" x2="467" y2="285" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="509" y1="258" x2="509" y2="285" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="551" y1="258" x2="551" y2="285" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 340 253 L 330 253 L 330 290 L 340 290" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 594 253 L 604 253 L 604 290 L 594 290" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="362" y="276" text-anchor="middle" font-size="14" fill="#111111">∂b<tspan font-size="10" dy="4">1</tspan></text>
<text x="404" y="276" text-anchor="middle" font-size="14" fill="#111111">∂b<tspan font-size="10" dy="4">2</tspan></text>
<text x="446" y="276" text-anchor="middle" font-size="14" fill="#111111">∂b<tspan font-size="10" dy="4">3</tspan></text>
<text x="488" y="276" text-anchor="middle" font-size="14" fill="#111111">∂b<tspan font-size="10" dy="4">4</tspan></text>
<text x="530" y="276" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="572" y="276" text-anchor="middle" font-size="14" fill="#111111">∂b<tspan font-size="10" dy="4">10</tspan></text>
<text x="467" y="312" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂b⁽²⁾</text>
<line x1="362" y1="240" x2="362" y2="252" stroke="#C30B0A" stroke-width="1.4" fill="none" marker-end="url(#bx-arr)"/>
<line x1="404" y1="240" x2="404" y2="252" stroke="#C30B0A" stroke-width="1.4" fill="none" marker-end="url(#bx-arr)"/>
<line x1="446" y1="240" x2="446" y2="252" stroke="#C30B0A" stroke-width="1.4" fill="none" marker-end="url(#bx-arr)"/>
<line x1="488" y1="240" x2="488" y2="252" stroke="#C30B0A" stroke-width="1.4" fill="none" marker-end="url(#bx-arr)"/>
<line x1="530" y1="240" x2="530" y2="252" stroke="#C30B0A" stroke-width="1.4" fill="none" marker-end="url(#bx-arr)"/>
<line x1="572" y1="240" x2="572" y2="252" stroke="#C30B0A" stroke-width="1.4" fill="none" marker-end="url(#bx-arr)"/>
<text x="730" y="250" text-anchor="middle" font-size="13" fill="#5E5850">складываем по столбцу</text>
<text x="480" y="336" text-anchor="middle" font-size="13" fill="#5E5850">смещение участвовало в каждой строке батча — значит вклады строк складываются</text></g>
<g data-key="h4" data-only="1"><rect x="467" y="96" width="42" height="108" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="467" y="258" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e5" data-only="1"><rect x="66" y="132" width="252" height="108" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="108" y1="132" x2="108" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="150" y1="132" x2="150" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="192" y1="132" x2="192" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="234" y1="132" x2="234" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="276" y1="132" x2="276" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="66" y1="159" x2="318" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="66" y1="186" x2="318" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="66" y1="213" x2="318" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 65 127 L 55 127 L 55 245 L 65 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 319 127 L 329 127 L 329 245 L 319 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="87" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="129" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="171" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="213" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="255" y="150" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="297" y="150" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="87" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="129" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="171" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,3</tspan></text>
<text x="213" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,4</tspan></text>
<text x="255" y="178" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="297" y="178" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">2,10</tspan></text>
<text x="87" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,1</tspan></text>
<text x="129" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,2</tspan></text>
<text x="171" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,3</tspan></text>
<text x="213" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,4</tspan></text>
<text x="255" y="204" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="297" y="204" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">3,10</tspan></text>
<text x="87" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,1</tspan></text>
<text x="129" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,2</tspan></text>
<text x="171" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,3</tspan></text>
<text x="213" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,4</tspan></text>
<text x="255" y="232" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="297" y="232" text-anchor="middle" font-size="14" fill="#111111">∂z<tspan font-size="10" dy="4">4,10</tspan></text>
<text x="192" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 10</text>
<text x="192" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂Z⁽²⁾</text>
<text x="344" y="186" text-anchor="middle" font-size="20" fill="#111111">×</text>
<rect x="370" y="104" width="220" height="162" fill="#C29E08" fill-opacity="0.16"/>
<line x1="414" y1="104" x2="414" y2="266" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="458" y1="104" x2="458" y2="266" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="502" y1="104" x2="502" y2="266" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="546" y1="104" x2="546" y2="266" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="370" y1="131" x2="590" y2="131" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="370" y1="158" x2="590" y2="158" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="370" y1="185" x2="590" y2="185" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="370" y1="212" x2="590" y2="212" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="370" y1="239" x2="590" y2="239" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 369 99 L 359 99 L 359 271 L 369 271" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 591 99 L 601 99 L 601 271 L 591 271" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="392" y="122" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="436" y="122" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="480" y="122" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="524" y="122" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="568" y="122" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="392" y="150" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="436" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="480" y="150" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="524" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="568" y="150" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="392" y="176" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="436" y="176" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="480" y="176" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="524" y="176" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="568" y="176" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="392" y="204" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="436" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="480" y="204" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">4,22</tspan></text>
<text x="524" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="568" y="204" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">4,32</tspan></text>
<text x="392" y="230" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="436" y="230" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="480" y="230" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="524" y="230" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="568" y="230" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="392" y="258" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">10,1</tspan></text>
<text x="436" y="258" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="480" y="258" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">10,22</tspan></text>
<text x="524" y="258" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="568" y="258" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">10,32</tspan></text>
<text x="480" y="90" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">10 × 32</text>
<text x="480" y="293" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">(W⁽²⁾)ᵀ</text>
<text x="616" y="186" text-anchor="middle" font-size="20" fill="#111111">=</text>
<rect x="642" y="132" width="220" height="108" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="686" y1="132" x2="686" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="730" y1="132" x2="730" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="774" y1="132" x2="774" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="818" y1="132" x2="818" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="642" y1="159" x2="862" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="642" y1="186" x2="862" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="642" y1="213" x2="862" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 641 127 L 631 127 L 631 245 L 641 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 863 127 L 873 127 L 873 245 L 863 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="664" y="150" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="708" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="752" y="150" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="796" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="840" y="150" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="664" y="178" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="708" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="752" y="178" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="796" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="840" y="178" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="664" y="204" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="708" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="752" y="204" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="796" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="840" y="204" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="664" y="232" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="708" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="752" y="232" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">4,22</tspan></text>
<text x="796" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="840" y="232" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">4,32</tspan></text>
<text x="752" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 32</text>
<text x="752" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂A⁽¹⁾</text>
<text x="480" y="336" text-anchor="middle" font-size="13" fill="#5E5850">тот же вес W⁽²⁾, только теперь он умножает градиент — и с другой стороны</text></g>
<g data-key="h5" data-only="1"><rect x="66" y="132" width="252" height="27" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="458" y="104" width="44" height="162" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="730" y="132" width="44" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e6" data-only="1"><rect x="91" y="132" width="220" height="108" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="135" y1="132" x2="135" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="179" y1="132" x2="179" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="223" y1="132" x2="223" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="267" y1="132" x2="267" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="91" y1="159" x2="311" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="91" y1="186" x2="311" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="91" y1="213" x2="311" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 90 127 L 80 127 L 80 245 L 90 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 312 127 L 322 127 L 322 245 L 312 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="113" y="150" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="157" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="201" y="150" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="245" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="289" y="150" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="113" y="178" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="157" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="201" y="178" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="245" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="289" y="178" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="113" y="204" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="157" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="201" y="204" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="245" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="289" y="204" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="113" y="232" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="157" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="201" y="232" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">4,22</tspan></text>
<text x="245" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="289" y="232" text-anchor="middle" font-size="15" fill="#111111">∂a<tspan font-size="11" dy="4">4,32</tspan></text>
<text x="201" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 32</text>
<text x="201" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂A⁽¹⁾</text>
<text x="339" y="186" text-anchor="middle" font-size="20" fill="#111111">⊙</text>
<rect x="367" y="132" width="220" height="108" fill="#5E5850" fill-opacity="0.06"/>
<rect x="367" y="132" width="44" height="27" fill="#C30B0A" fill-opacity="0.22"/>
<rect x="455" y="132" width="44" height="27" fill="#73B222" fill-opacity="0.35"/>
<rect x="543" y="132" width="44" height="27" fill="#73B222" fill-opacity="0.35"/>
<rect x="367" y="159" width="44" height="27" fill="#C30B0A" fill-opacity="0.22"/>
<rect x="455" y="159" width="44" height="27" fill="#73B222" fill-opacity="0.35"/>
<rect x="543" y="159" width="44" height="27" fill="#73B222" fill-opacity="0.35"/>
<rect x="367" y="186" width="44" height="27" fill="#C30B0A" fill-opacity="0.22"/>
<rect x="455" y="186" width="44" height="27" fill="#73B222" fill-opacity="0.35"/>
<rect x="543" y="186" width="44" height="27" fill="#73B222" fill-opacity="0.35"/>
<rect x="367" y="213" width="44" height="27" fill="#C30B0A" fill-opacity="0.22"/>
<rect x="455" y="213" width="44" height="27" fill="#73B222" fill-opacity="0.35"/>
<rect x="543" y="213" width="44" height="27" fill="#C30B0A" fill-opacity="0.22"/>
<line x1="411" y1="132" x2="411" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="455" y1="132" x2="455" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="499" y1="132" x2="499" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="543" y1="132" x2="543" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="367" y1="159" x2="587" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="367" y1="186" x2="587" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="367" y1="213" x2="587" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 366 127 L 356 127 L 356 245 L 366 245" fill="none" stroke="#5E5850" stroke-width="1.8"/>
<path d="M 588 127 L 598 127 L 598 245 L 588 245" fill="none" stroke="#5E5850" stroke-width="1.8"/>
<text x="389" y="150" text-anchor="middle" font-size="13" fill="#111111">0</text>
<text x="433" y="150" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="477" y="150" text-anchor="middle" font-size="13" fill="#111111">1</text>
<text x="521" y="150" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="565" y="150" text-anchor="middle" font-size="13" fill="#111111">1</text>
<text x="389" y="178" text-anchor="middle" font-size="13" fill="#111111">0</text>
<text x="433" y="178" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="477" y="178" text-anchor="middle" font-size="13" fill="#111111">1</text>
<text x="521" y="178" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="565" y="178" text-anchor="middle" font-size="13" fill="#111111">1</text>
<text x="389" y="204" text-anchor="middle" font-size="13" fill="#111111">0</text>
<text x="433" y="204" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="477" y="204" text-anchor="middle" font-size="13" fill="#111111">1</text>
<text x="521" y="204" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="565" y="204" text-anchor="middle" font-size="13" fill="#111111">1</text>
<text x="389" y="232" text-anchor="middle" font-size="13" fill="#111111">0</text>
<text x="433" y="232" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="477" y="232" text-anchor="middle" font-size="13" fill="#111111">1</text>
<text x="521" y="232" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="565" y="232" text-anchor="middle" font-size="13" fill="#111111">0</text>
<text x="477" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 32</text>
<text x="477" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">маска [Z⁽¹⁾ > 0]</text>
<text x="615" y="186" text-anchor="middle" font-size="20" fill="#111111">=</text>
<rect x="643" y="132" width="220" height="108" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="687" y1="132" x2="687" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="731" y1="132" x2="731" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="775" y1="132" x2="775" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="819" y1="132" x2="819" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="643" y1="159" x2="863" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="643" y1="186" x2="863" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="643" y1="213" x2="863" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 642 127 L 632 127 L 632 245 L 642 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 864 127 L 874 127 L 874 245 L 864 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="665" y="150" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="709" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="753" y="150" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="797" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="841" y="150" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="665" y="178" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="709" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="753" y="178" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="797" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="841" y="178" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="665" y="204" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="709" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="753" y="204" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="797" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="841" y="204" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="665" y="232" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="709" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="753" y="232" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">4,22</tspan></text>
<text x="797" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="841" y="232" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">4,32</tspan></text>
<text x="753" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 32</text>
<text x="753" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂Z⁽¹⁾</text>
<text x="480" y="320" text-anchor="middle" font-size="13" fill="#5E5850">маска сохранена с прямого прохода: 72 клетки из 128 обнулятся</text></g>
<g data-key="h6" data-only="1"><rect x="179" y="132" width="44" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="455" y="132" width="44" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="731" y="132" width="44" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e7" data-only="1"><rect x="111" y="118" width="176" height="135" fill="#3576C0" fill-opacity="0.1"/>
<line x1="155" y1="118" x2="155" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="199" y1="118" x2="199" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="243" y1="118" x2="243" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="111" y1="145" x2="287" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="111" y1="172" x2="287" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="111" y1="199" x2="287" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="111" y1="226" x2="287" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 110 113 L 100 113 L 100 258 L 110 258" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 288 113 L 298 113 L 298 258 L 288 258" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<text x="133" y="136" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="177" y="136" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">1,2</tspan></text>
<text x="221" y="136" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">1,3</tspan></text>
<text x="265" y="136" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">1,4</tspan></text>
<text x="133" y="164" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="177" y="164" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">2,2</tspan></text>
<text x="221" y="164" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">2,3</tspan></text>
<text x="265" y="164" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">2,4</tspan></text>
<text x="133" y="190" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="177" y="190" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">3,2</tspan></text>
<text x="221" y="190" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">3,3</tspan></text>
<text x="265" y="190" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">3,4</tspan></text>
<text x="133" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="177" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="221" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="265" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="133" y="244" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">64,1</tspan></text>
<text x="177" y="244" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">64,2</tspan></text>
<text x="221" y="244" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">64,3</tspan></text>
<text x="265" y="244" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="11" dy="4">64,4</tspan></text>
<text x="199" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">64 × 4</text>
<text x="199" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">Xᵀ</text>
<text x="315" y="186" text-anchor="middle" font-size="20" fill="#111111">×</text>
<rect x="343" y="132" width="220" height="108" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="387" y1="132" x2="387" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="431" y1="132" x2="431" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="475" y1="132" x2="475" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="519" y1="132" x2="519" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="343" y1="159" x2="563" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="343" y1="186" x2="563" y2="186" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="343" y1="213" x2="563" y2="213" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 342 127 L 332 127 L 332 245 L 342 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 564 127 L 574 127 L 574 245 L 564 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="365" y="150" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="409" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="453" y="150" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="497" y="150" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="541" y="150" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="365" y="178" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="409" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="453" y="178" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="497" y="178" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="541" y="178" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="365" y="204" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="409" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="453" y="204" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="497" y="204" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="541" y="204" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="365" y="232" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">4,1</tspan></text>
<text x="409" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="453" y="232" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">4,22</tspan></text>
<text x="497" y="232" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="541" y="232" text-anchor="middle" font-size="15" fill="#111111">∂z<tspan font-size="11" dy="4">4,32</tspan></text>
<text x="453" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">4 × 32</text>
<text x="453" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂Z⁽¹⁾</text>
<text x="591" y="186" text-anchor="middle" font-size="20" fill="#111111">=</text>
<rect x="619" y="118" width="220" height="135" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="663" y1="118" x2="663" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="707" y1="118" x2="707" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="751" y1="118" x2="751" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="795" y1="118" x2="795" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="619" y1="145" x2="839" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="619" y1="172" x2="839" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="619" y1="199" x2="839" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="619" y1="226" x2="839" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 618 113 L 608 113 L 608 258 L 618 258" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 840 113 L 850 113 L 850 258 L 840 258" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="641" y="136" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="685" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="729" y="136" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="773" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="817" y="136" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="641" y="164" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="685" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="729" y="164" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="773" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="817" y="164" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="641" y="190" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="685" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="729" y="190" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="773" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="817" y="190" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="641" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="685" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="729" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="773" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="817" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="641" y="244" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">64,1</tspan></text>
<text x="685" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="729" y="244" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">64,22</tspan></text>
<text x="773" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="817" y="244" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">64,32</tspan></text>
<text x="729" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">64 × 32</text>
<text x="729" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂W⁽¹⁾</text>
<text x="480" y="320" text-anchor="middle" font-size="13" fill="#5E5850">строка 2 матрицы Xᵀ — яркость второго пикселя у четырёх картинок</text></g>
<g data-key="h7" data-only="1"><rect x="111" y="145" width="176" height="27" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="431" y="132" width="44" height="108" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="707" y="145" width="44" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="ok" data-only="1"><rect x="57" y="136" width="837" height="184" rx="12" fill="none" stroke="#73B222" stroke-width="2.2"/><text x="480" y="356" text-anchor="middle" font-size="14" fill="#73B222" font-weight="700">форма производной = форма того, по чему дифференцируем</text></g>
<rect x="40" y="362" width="880" height="124" rx="10" fill="#FFFFFF" stroke="#E4E1D7" stroke-width="1.3"/>
<text x="56" y="382" text-anchor="start" font-size="13" fill="#5E5850">формула шага</text>
<text x="56" y="436" text-anchor="start" font-size="13" fill="#5E5850">подстановка чисел</text>
<g data-key="fm0" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\text{ищем } \dfrac{\partial L}{\partial W^{(1)}},\ \dfrac{\partial L}{\partial b^{(1)}},\ \dfrac{\partial L}{\partial W^{(2)}},\ \dfrac{\partial L}{\partial b^{(2)}} \;-\; 2410 \text{ чисел}"></div></foreignObject></g>
<g data-key="fm1" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial z^{(2)}_{ic}} = \dfrac{p_{ic} - y_{ic}}{B}"></div></foreignObject></g>
<g data-key="fm2" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial w^{(2)}_{jc}} = \sum_{i=1}^{B} a^{(1)}_{ij}\, \dfrac{\partial L}{\partial z^{(2)}_{ic}}"></div></foreignObject></g>
<g data-key="fm3" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial b^{(2)}_{c}} = \sum_{i=1}^{B} \dfrac{\partial L}{\partial z^{(2)}_{ic}}"></div></foreignObject></g>
<g data-key="fm4" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial a^{(1)}_{ij}} = \sum_{c=1}^{10} w^{(2)}_{jc}\, \dfrac{\partial L}{\partial z^{(2)}_{ic}}"></div></foreignObject></g>
<g data-key="fm5" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial z^{(1)}_{ij}} = \dfrac{\partial L}{\partial a^{(1)}_{ij}} \cdot \mathbb{1}\left[z^{(1)}_{ij} > 0\right]"></div></foreignObject></g>
<g data-key="fm6" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial w^{(1)}_{kj}} = \sum_{i=1}^{B} x_{ik}\, \dfrac{\partial L}{\partial z^{(1)}_{ij}}"></div></foreignObject></g>
<g data-key="fm7" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\text{форма } \dfrac{\partial L}{\partial \theta} = \text{форма } \theta \quad \text{для любого параметра}"></div></foreignObject></g>
<g data-key="sb0" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="2048 + 32 + 320 + 10 = 2410"></div></foreignObject></g>
<g data-key="sb1" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial z^{(2)}_{1,4}} = \dfrac{0{,}1488 - 1}{4} = -0{,}2128, \qquad \dfrac{\partial L}{\partial z^{(2)}_{1,1}} = \dfrac{0{,}0876 - 0}{4} = 0{,}0219"></div></foreignObject></g>
<g data-key="sb2" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial w^{(2)}_{22,4}} = 1{,}0536\cdot(-0{,}2128) + 0{,}5808\cdot 0{,}0339 + 0{,}5335\cdot 0{,}0309 + 0{,}9531\cdot 0{,}0290 = -0{,}1604"></div></foreignObject></g>
<g data-key="sb3" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial b^{(2)}_{4}} = -0{,}2128 + 0{,}0339 + 0{,}0309 + 0{,}0290 = -0{,}1190"></div></foreignObject></g>
<g data-key="sb4" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial a^{(1)}_{1,22}} = -0{,}2128\cdot 0{,}2681 + \ldots = -0{,}0661"></div></foreignObject></g>
<g data-key="sb5" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial z^{(1)}_{1,22}} = -0{,}0661 \cdot 1 = -0{,}0661, \qquad \dfrac{\partial L}{\partial z^{(1)}_{1,21}} = 0{,}0490 \cdot 0 = 0"></div></foreignObject></g>
<g data-key="sb6" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial w^{(1)}_{2,22}} = 0{,}0625\cdot(-0{,}0661) + 0 + 0{,}1875\cdot 0{,}0486 + 0 = 0{,}0050"></div></foreignObject></g>
<g data-key="sb7" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="2048 + 32 + 320 + 10 = 2410 \quad \text{и все сверены разностями: } 3{,}7\cdot 10^{-11}"></div></foreignObject></g>
<text x="40" y="512" text-anchor="start" font-size="13" fill="#5E5850">⊙ — поклеточное умножение; индексы в формулах с единицы, в коде на numpy — с нуля</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="e1 fm0 sb0" data-focus="e1">
      <div class="step-kicker">Шаг 1 · что мы ищем</div>
      <h4>2410 производных — по одной на каждый параметр</h4>
<p>Обратный проход не ищет ничего, кроме этих четырёх таблиц. У каждой производной та же форма, что у параметра: если W⁽¹⁾ — это 64 × 32, то и ∂L/∂W⁽¹⁾ — 64 × 32.</p><div class="math-display" data-tex="\left(\dfrac{\partial L}{\partial W}\right)_{kj} = \dfrac{\partial L}{\partial w_{kj}}"></div><p>Считать их по определению — 2410 отдельных прямых проходов. Мы получим все разом, двигаясь справа налево и переиспользуя уже посчитанное.</p>
    </div>
    <div class="step-panel" data-on="mm0 e2 h2 fm1 sb1" data-focus="h2">
      <div class="step-kicker">Шаг 2 · вход обратного прохода</div>
      <h4>∂L/∂z⁽²⁾₁,₄ = (0,1488 − 1) / 4 = −0,2128</h4>
<p>Пара «softmax + кросс-энтропия» схлопывается в разность «что выдала сеть минус что было надо», делённую на размер батча. Верному классу вычитается единица, остальным — ноль.</p><div class="math-display" data-tex="\dfrac{\partial L}{\partial z^{(2)}_{1,4}} = \dfrac{0{,}1488 - 1}{4} = -0{,}2128, \qquad \dfrac{\partial L}{\partial z^{(2)}_{1,1}} = \dfrac{0{,}0876 - 0}{4} = 0{,}0219"></div><p>Первая строка целиком: 0,0219; 0,0237; 0,0206; <strong>−0,2128</strong>; 0,0296; 0,0223; 0,0145; 0,0311; 0,0229; 0,0262. Сумма строки — ровно ноль: сумма всех p равна единице, сумма всех y — тоже.</p>
    </div>
    <div class="step-panel" data-on="mm1 e3 h3 fm2 sb2" data-focus="h3">
      <div class="step-kicker">Шаг 3 · градиент весов второго слоя</div>
      <h4>∂L/∂w⁽²⁾₂₂,₄ = −0,1604</h4>
<p>Вес между нейроном 22 и классом «3» участвовал в четырёх выходах — по одному на картинку. Вклады складываются, и каждый равен «активация × градиент выхода».</p><div class="math-display" data-tex="\dfrac{\partial L}{\partial w^{(2)}_{22,4}} = 1{,}0536\cdot(-0{,}2128) + 0{,}5808\cdot 0{,}0339 + 0{,}5335\cdot 0{,}0309 + 0{,}9531\cdot 0{,}0290"></div><div class="math-display" data-tex="= -0{,}2242 + 0{,}0197 + 0{,}0165 + 0{,}0276 = -0{,}1604"></div><p>Первое слагаемое задаёт знак всей суммы: там, где нейрон был активнее всего, класс ошибся сильнее всего. Минус означает «увеличь этот вес, и потеря упадёт».</p>
    </div>
    <div class="step-panel" data-on="mm2 e4 h4 fm3 sb3" data-focus="h4">
      <div class="step-kicker">Шаг 4 · градиент смещений</div>
      <h4>∂L/∂b⁽²⁾₄ = −0,1190 — просто сумма столбца</h4>
<p>На прямом проходе смещение размножалось по строкам батча. Обратная операция к размножению — суммирование: складываем столбец ∂L/∂Z⁽²⁾ по всем четырём объектам.</p><div class="math-display" data-tex="\dfrac{\partial L}{\partial b^{(2)}_{4}} = -0{,}2128 + 0{,}0339 + 0{,}0309 + 0{,}0290 = -0{,}1190"></div><p>Вся строка: 0,1076; 0,0868; −0,1736; −0,1190; 0,0993; −0,1269; 0,0648; 0,1207; −0,1605; 0,1007. Их сумма — ноль, потому что нулевая сумма была у каждой строки ∂L/∂Z⁽²⁾. Смещения не сдвинут все десять оценок разом, они меняют только разницу между классами.</p>
    </div>
    <div class="step-panel" data-on="mm3 e5 h5 fm4 sb4" data-focus="h5">
      <div class="step-kicker">Шаг 5 · протолкнуть градиент влево</div>
      <h4>∂L/∂a⁽¹⁾₁,₂₂ = −0,0661</h4>
<p>Активация 22-го нейрона участвовала во всех десяти оценках своей строки, каждый раз с множителем-весом. Значит, складываем десять произведений «вес × градиент оценки».</p><div class="math-display" data-tex="\dfrac{\partial L}{\partial a^{(1)}_{1,22}} = \sum_{c=1}^{10} w^{(2)}_{22,c}\,\dfrac{\partial L}{\partial z^{(2)}_{1c}} = -0{,}2128\cdot 0{,}2681 + 0{,}0219\cdot(-0{,}0172) + \ldots = -0{,}0661"></div><p>Главное слагаемое — верный класс: −0,2128 · 0,2681 = −0,0570. Тот же самый вес, что нёс число вперёд, несёт градиент назад — только теперь матрица транспонирована.</p>
    </div>
    <div class="step-panel" data-on="mm4 e6 h6 fm5 sb5" data-focus="h6">
      <div class="step-kicker">Шаг 6 · маска ReLU</div>
      <h4>72 клетки из 128 обнуляются</h4>
<p>Производная max(0, z) равна единице там, где z был положителен, и нулю в остальных местах. Поэтому маска, снятая на прямом проходе, просто умножается поклеточно.</p><div class="math-display" data-tex="\dfrac{\partial L}{\partial z^{(1)}_{1,22}} = -0{,}0661\cdot 1 = -0{,}0661, \qquad \dfrac{\partial L}{\partial z^{(1)}_{1,21}} = 0{,}0490\cdot 0 = 0"></div><p>Здесь и живёт «умирание» нейронов: у десяти нейронов маска нулевая на всех четырёх картинках, и до их весов градиент просто не доходит.</p>
    </div>
    <div class="step-panel" data-on="mm5 e7 h7 fm6 sb6" data-focus="h7">
      <div class="step-kicker">Шаг 7 · градиент первого слоя</div>
      <h4>∂L/∂w⁽¹⁾₂,₂₂ = 0,0050 — и та же формула, что была для второго</h4>
<p>Никакой новой математики: вход слоя транспонируется и умножается на градиент выхода. Для первого слоя вход — сами картинки.</p><div class="math-display" data-tex="\dfrac{\partial L}{\partial w^{(1)}_{2,22}} = 0{,}0625\cdot(-0{,}0661) + 0\cdot(-0{,}0297) + 0{,}1875\cdot 0{,}0486 + 0\cdot(-0{,}0491) = -0{,}0041 + 0{,}0091 = 0{,}0050"></div><p>Две картинки из четырёх имеют в этом пикселе ноль и не вносят вклада вовсе. Если пиксель пуст у всех четырёх — вся строка ∂L/∂W⁽¹⁾ нулевая; на нашем батче таких строк 18 из 64. Смещения считаются так же, как во втором слое: ∂L/∂b⁽¹⁾₂₂ = −0,0661 − 0,0297 + 0,0486 − 0,0491 = −0,0963.</p>
    </div>
    <div class="step-panel" data-on="e1 ok fm7 sb7" data-focus="ok">
      <div class="step-kicker">Шаг 8 · проверка формами</div>
      <h4>2048 + 32 + 320 + 10 = 2410 — всё сошлось</h4>
<p>Самая полезная проверка на практике: у ∂L/∂W⁽¹⁾ обязана быть форма 64 × 32, у ∂L/∂b⁽²⁾ — десять чисел, у ∂L/∂Z⁽²⁾ — 4 × 10. Если формы сходятся, вероятность ошибки в выкладке резко падает; если нет — ошибка найдена, даже не начав считать.</p><p>Слева от первого слоя градиент тоже существует — ∂L/∂X формы 4 × 64, — но считать его незачем: под ним нет параметров. Все 2410 чисел ниже сверены центральными разностями, худшее расхождение 3,7 · 10⁻¹¹.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> у градиента всегда форма того, по чему дифференцируем,
  а вперёд и назад работает один и тот же вес — только во втором случае транспонированный.
  Этих двух правил хватает, чтобы восстановить обратный проход любой полносвязной сети по памяти.
</div>

---

## Часть 7. Обратный проход в числах и сверка градиента

<p>
  Весь обратный проход нашей сети — пять строк кода. Обратите внимание, что в них не появляется
  ничего, чего не было бы на прямом проходе: используются сохранённые <code>Z1</code>,
  <code>A1</code>, <code>P</code> и сами веса.
</p>

<pre><code>dZ2 = (P - Yb) / len(idx)
dW2, db2 = A1.T @ dZ2, dZ2.sum(0)
dZ1 = (dZ2 @ W2.T) * (Z1 > 0)
dW1, db1 = Xb.T @ dZ1, dZ1.sum(0)</code></pre>

<p>
  Написать эти строки легко, ошибиться в них — ещё легче: перепутанное транспонирование или
  забытое деление на размер батча не вызовут никакой ошибки, сеть просто будет учиться хуже
  или не будет вовсе. Поэтому единственная надёжная проверка — численная. Сдвигаем каждый параметр
  на ±ε, пересчитываем потерю дважды и сравниваем с тем, что выдал обратный проход.
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial \theta} \;\approx\; \frac{L(\theta + \varepsilon) - L(\theta - \varepsilon)}{2\varepsilon}, \qquad \varepsilon = 10^{-5}"></div>

### Одно число сквозь всю сеть

<p>
  Проверим формулы руками. Возьмём первую картинку батча — тройку — и двадцать первый нейрон
  скрытого слоя, и проследим одно-единственное число вперёд и назад. Все промежуточные значения
  ниже настоящие, их можно пересчитать на калькуляторе.
</p>

<table class="shape-table">
  <tr><th>Что считаем</th><th>Как</th><th>Сколько</th></tr>
  <tr><td>оценка нейрона<br><code>z⁽¹⁾[0, 21]</code></td>
      <td>0,0625 · 0,1160 + 0,5000 · 0,1114 + 0,8750 · 0,1284 + … <br>(34 ненулевых слагаемых, смещение равно нулю)</td>
      <td>1,0536</td></tr>
  <tr><td>после ReLU<br><code>a⁽¹⁾[0, 21]</code></td><td>число положительное, значит проходит как есть</td><td>1,0536</td></tr>
  <tr><td>оценка класса «3»<br><code>z⁽²⁾[0, 3]</code></td><td>тридцать два произведения «активация × вес» плюс нулевое смещение</td><td>0,3139</td></tr>
  <tr><td>вероятность<br><code>p[0, 3]</code></td><td>e<sup>0,3139</sup> = 1,3688, сумма всех десяти экспонент 9,1979, делим одно на другое</td><td>0,1488</td></tr>
  <tr><td>штраф объекта</td><td>−log 0,1488</td><td>1,9050</td></tr>
  <tr><td>градиент оценки<br><code>∂L/∂z⁽²⁾[0, 3]</code></td><td>(0,1488 − 1) / 4</td><td>−0,2128</td></tr>
  <tr><td>градиент веса<br><code>∂L/∂W⁽²⁾[21, 3]</code></td>
      <td>1,0536 · (−0,2128) + 0,5808 · 0,0339 + 0,5335 · 0,0309 + 0,9531 · 0,0290</td>
      <td>−0,1604</td></tr>
  <tr><td>градиент активации<br><code>∂L/∂a⁽¹⁾[0, 21]</code></td>
      <td>десять произведений «градиент оценки × вес», из них главное −0,2128 · 0,2681 = −0,0570</td>
      <td>−0,0661</td></tr>
  <tr><td>через ReLU<br><code>∂L/∂z⁽¹⁾[0, 21]</code></td><td>нейрон был открыт, маска равна единице</td><td>−0,0661</td></tr>
  <tr><td>градиент веса первого слоя<br><code>∂L/∂W⁽¹⁾[1, 21]</code></td>
      <td>0,0625 · (−0,0661) + 0 + 0,1875 · 0,0486 + 0 <br>(две картинки из четырёх имеют в этой клетке ноль)</td>
      <td>0,0050</td></tr>
</table>

<p>
  Последняя строка показывает всю механику сразу: вклад картинки в градиент веса — это её яркость
  в нужной клетке, умноженная на градиент нейрона. Если клетка пустая, вклад равен нулю при любом
  состоянии сети; если пустая у всех картинок батча — нулевой будет вся строка. Отсюда и берутся
  18 нулевых строк в ∂L/∂W⁽¹⁾ на этом батче.
</p>

<div class="callout-blue">
  <strong>Знаки читаются буквально:</strong> у ∂L/∂W⁽²⁾[21, 3] знак минус означает «увеличь этот вес,
  и потеря упадёт» — что логично, ведь верным классом была именно тройка, а нейрон 21 был активен.
  Шаг спуска вычитает производную, то есть как раз увеличит этот вес.
</div>

<p class="console-title">Сверка градиента · настоящий вывод скрипта</p>
<div class="console"><span class="cmd">$ python3 gradcheck.py</span>
батч: (4, 64)  метки: [3 5 2 8]
потеря на батче: 2.1416   (ln 10 = 2.3026)
открытых ReLU: 56 из 128
норма градиента: 1.8510
нулевых строк в dW1: 18 из 64
<span class="chi">сверка центральными разностями по всем 2410 параметрам: 3.72e-11</span>
</div>

<div class="callout-yellow">
  <strong>Где численная проверка честно ломается:</strong> ReLU имеет излом в нуле. Если взять ε
  слишком большим, точка <span class="math-inline" data-tex="\theta + \varepsilon"></span> может
  оказаться по другую сторону излома — тогда разность посчитает производную уже другой функции,
  и расхождение вырастет на порядки без всякой ошибки в коде. Для ε = 10⁻⁵ этого не происходит,
  но само явление стоит держать в голове: аккуратные значения ε лежат между 10⁻⁶ и 10⁻⁴.
</div>

<p>Посмотрим пошагово, что за числа получаются на обратном проходе.</p>

<div class="stage" id="stageBN" tabindex="0">
  <div class="stage-figure">
<svg id="bn" viewBox="0 0 960 680" role="img" aria-label="Обратный проход в числах: тот же маршрут, но каждый шаг показан матрицами, а числа подставлены внизу">
  <style>
    #bn { font-family: Helvetica, Arial, sans-serif; }
    #bn .lbl { font-size: 16px; fill: #111111; }
    #bn .cap { font-size: 13px; fill: #5E5850; }
    #bn .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #bn .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #bn .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #bn .legend { font-size: 13px; fill: #5E5850; }
    #bn .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="bn-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="bn-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<defs><marker id="bn-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker></defs>
<text x="34" y="44" class="cap">сверху — маршрут, снизу — матрицы текущего шага; сами числа подставлены в полосе под ними</text>
<g data-key="net">
<rect x="34" y="72" width="104" height="220" rx="10" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.8"/>
<text x="86" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 86 168)">Вход</text>
<text x="86" y="260" text-anchor="middle" font-size="13" fill="#5E5850">батч картинок</text>
<rect x="214" y="72" width="104" height="220" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.8"/>
<text x="266" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 266 168)">Скрытый слой</text>
<text x="266" y="260" text-anchor="middle" font-size="13" fill="#5E5850">Linear 64 → 32</text>
<rect x="394" y="72" width="104" height="220" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.8"/>
<text x="446" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 446 168)">Выходной слой</text>
<text x="446" y="260" text-anchor="middle" font-size="13" fill="#5E5850">Linear 32 → 10</text>
<rect x="574" y="72" width="104" height="220" rx="10" fill="#F0FAF0" stroke="#73B222" stroke-width="1.8"/>
<text x="626" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 626 168)">Softmax</text>
<text x="626" y="260" text-anchor="middle" font-size="13" fill="#5E5850">в вероятности</text>
<rect x="754" y="72" width="104" height="220" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="806" y="168" class="lbl" text-anchor="middle" font-weight="700" transform="rotate(-90 806 168)">Потеря</text>
<text x="806" y="260" text-anchor="middle" font-size="13" fill="#C30B0A">cross-entropy</text>
<g data-key="relu"><text x="266" y="280" text-anchor="middle" font-size="13" fill="#73B222">+ ReLU</text></g>
<line x1="144" y1="172" x2="208" y2="172" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#bn-arg)"/>
<text x="176" y="158" class="nm" text-anchor="middle">X</text>
<text x="176" y="194" class="dim" text-anchor="middle">4 × 64</text>
<line x1="324" y1="172" x2="388" y2="172" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#bn-arg)"/>
<text x="356" y="158" class="nm" text-anchor="middle">A⁽¹⁾</text>
<text x="356" y="194" class="dim" text-anchor="middle">4 × 32</text>
<line x1="504" y1="172" x2="568" y2="172" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#bn-arg)"/>
<text x="536" y="158" class="nm" text-anchor="middle">Z⁽²⁾</text>
<text x="536" y="194" class="dim" text-anchor="middle">4 × 10</text>
<line x1="684" y1="172" x2="748" y2="172" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#bn-arg)"/>
<text x="716" y="158" class="nm" text-anchor="middle">P</text>
<text x="716" y="194" class="dim" text-anchor="middle">4 × 10</text>
</g>
<g data-key="gx">
<line x1="208" y1="332" x2="144" y2="332" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-arr)"/>
<text x="176" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂X</text>
<text x="176" y="354" class="dim" text-anchor="middle">4 × 64</text>
</g>
<g data-key="ga1">
<line x1="388" y1="332" x2="324" y2="332" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-arr)"/>
<text x="356" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂A⁽¹⁾</text>
<text x="356" y="354" class="dim" text-anchor="middle">4 × 32</text>
</g>
<g data-key="gz2">
<line x1="568" y1="332" x2="504" y2="332" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-arr)"/>
<text x="536" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂Z⁽²⁾</text>
<text x="536" y="354" class="dim" text-anchor="middle">4 × 10</text>
</g>
<g data-key="gp">
<line x1="748" y1="332" x2="684" y2="332" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-arr)"/>
<text x="716" y="318" text-anchor="middle" font-size="13" font-weight="700" fill="#C30B0A">∂L/∂P</text>
<text x="716" y="354" class="dim" text-anchor="middle">4 × 10</text>
</g>
<g data-key="hl4" data-only="1"><rect x="750" y="68" width="112" height="228" rx="12" fill="none" stroke="#C30B0A" stroke-width="2.4"/></g>
<g data-key="hl3" data-only="1"><rect x="570" y="68" width="112" height="228" rx="12" fill="none" stroke="#C30B0A" stroke-width="2.4"/></g>
<g data-key="hl2" data-only="1"><rect x="390" y="68" width="112" height="228" rx="12" fill="none" stroke="#C30B0A" stroke-width="2.4"/></g>
<g data-key="hl1" data-only="1"><rect x="210" y="68" width="112" height="228" rx="12" fill="none" stroke="#C30B0A" stroke-width="2.4"/></g>
<g data-key="all" data-only="1">
<rect x="60.0" y="436" width="713.8" height="48" fill="#C30B0A" fill-opacity="0.45" stroke="#C30B0A" stroke-width="1.6"/>
<text x="417" y="466" class="nm" text-anchor="middle">∂L/∂W⁽¹⁾ · 2048</text>
<rect x="773.8" y="436" width="11.2" height="48" fill="#C30B0A" fill-opacity="0.45" stroke="#C30B0A" stroke-width="1.6"/>
<rect x="785.0" y="436" width="111.5" height="48" fill="#C30B0A" fill-opacity="0.45" stroke="#C30B0A" stroke-width="1.6"/>
<text x="841" y="466" class="nm" text-anchor="middle">∂L/∂W⁽²⁾ · 320</text>
<rect x="896.5" y="436" width="3.5" height="48" fill="#C30B0A" fill-opacity="0.45" stroke="#C30B0A" stroke-width="1.6"/>
<text x="762" y="420" class="cap" text-anchor="middle">b⁽¹⁾ 32</text>
<text x="898" y="420" class="cap" text-anchor="middle">b⁽²⁾ 10</text>
<line x1="762" y1="424" x2="776" y2="434" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#arw)"/>
<line x1="898" y1="424" x2="902" y2="434" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#arw)"/>
<text x="480" y="534" class="cap" text-anchor="middle">один обратный проход заполняет всю эту полосу целиком</text>
</g>
<g data-key="mz2" data-only="1">
<rect x="175.0" y="416.0" width="100" height="56" fill="#73B222" fill-opacity="0.5" stroke="#73B222" stroke-width="1.6"/>
<line x1="185.0" y1="416.0" x2="185.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="195.0" y1="416.0" x2="195.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="205.0" y1="416.0" x2="205.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="215.0" y1="416.0" x2="215.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="225.0" y1="416.0" x2="225.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="235.0" y1="416.0" x2="235.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="245.0" y1="416.0" x2="245.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="255.0" y1="416.0" x2="255.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="265.0" y1="416.0" x2="265.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="175.0" y1="430.0" x2="275.0" y2="430.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="175.0" y1="444.0" x2="275.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="175.0" y1="458.0" x2="275.0" y2="458.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="225" y="406.0" class="dim" text-anchor="middle">4 × 10</text>
<text x="225" y="494.0" class="nm" text-anchor="middle">P</text>
<text x="310" y="451" class="lbl" text-anchor="middle">−</text>
<rect x="345.00" y="416.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="355.00" y="416.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="365.00" y="416.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="375.00" y="416.00" width="10.00" height="14.00" fill="#3576C0" fill-opacity="0.75" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="385.00" y="416.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="395.00" y="416.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="405.00" y="416.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="415.00" y="416.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="425.00" y="416.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="435.00" y="416.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="345.00" y="430.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="355.00" y="430.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="365.00" y="430.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="375.00" y="430.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="385.00" y="430.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="395.00" y="430.00" width="10.00" height="14.00" fill="#3576C0" fill-opacity="0.75" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="405.00" y="430.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="415.00" y="430.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="425.00" y="430.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="435.00" y="430.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="345.00" y="444.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="355.00" y="444.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="365.00" y="444.00" width="10.00" height="14.00" fill="#3576C0" fill-opacity="0.75" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="375.00" y="444.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="385.00" y="444.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="395.00" y="444.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="405.00" y="444.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="415.00" y="444.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="425.00" y="444.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="435.00" y="444.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="345.00" y="458.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="355.00" y="458.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="365.00" y="458.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="375.00" y="458.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="385.00" y="458.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="395.00" y="458.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="405.00" y="458.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="415.00" y="458.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="425.00" y="458.00" width="10.00" height="14.00" fill="#3576C0" fill-opacity="0.75" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="435.00" y="458.00" width="10.00" height="14.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.5"/>
<rect x="345.0" y="416.0" width="100" height="56" fill="none" stroke="#3576C0" stroke-width="1.6"/>
<text x="395" y="406" class="dim" text-anchor="middle">4 × 10</text>
<text x="395" y="494" class="nm" text-anchor="middle">Y</text>
<text x="480" y="451" class="lbl" text-anchor="middle">=</text>
<rect x="515.0" y="416.0" width="100" height="56" fill="#C30B0A" fill-opacity="0.3" stroke="#C30B0A" stroke-width="1.6"/>
<line x1="525.0" y1="416.0" x2="525.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="535.0" y1="416.0" x2="535.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="545.0" y1="416.0" x2="545.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="555.0" y1="416.0" x2="555.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="565.0" y1="416.0" x2="565.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="575.0" y1="416.0" x2="575.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="585.0" y1="416.0" x2="585.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="595.0" y1="416.0" x2="595.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="605.0" y1="416.0" x2="605.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="515.0" y1="430.0" x2="615.0" y2="430.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="515.0" y1="444.0" x2="615.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="515.0" y1="458.0" x2="615.0" y2="458.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="565" y="406.0" class="dim" text-anchor="middle">4 × 10</text>
<text x="565" y="494.0" class="nm" text-anchor="middle">P − Y</text>
<rect x="545.00" y="416.00" width="10.00" height="14.00" fill="#C30B0A" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1"/>
<rect x="565.00" y="430.00" width="10.00" height="14.00" fill="#C30B0A" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1"/>
<rect x="535.00" y="444.00" width="10.00" height="14.00" fill="#C30B0A" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1"/>
<rect x="595.00" y="458.00" width="10.00" height="14.00" fill="#C30B0A" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1"/>
<text x="650" y="451" class="lbl" text-anchor="middle">÷ 4</text>
<rect x="685.0" y="416.0" width="100" height="56" fill="#C30B0A" fill-opacity="0.3" stroke="#C30B0A" stroke-width="1.6"/>
<line x1="695.0" y1="416.0" x2="695.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="705.0" y1="416.0" x2="705.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="715.0" y1="416.0" x2="715.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="725.0" y1="416.0" x2="725.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="735.0" y1="416.0" x2="735.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="745.0" y1="416.0" x2="745.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="755.0" y1="416.0" x2="755.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="765.0" y1="416.0" x2="765.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="775.0" y1="416.0" x2="775.0" y2="472.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="685.0" y1="430.0" x2="785.0" y2="430.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="685.0" y1="444.0" x2="785.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="685.0" y1="458.0" x2="785.0" y2="458.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="735" y="406.0" class="dim" text-anchor="middle">4 × 10</text>
<text x="735" y="494.0" class="nm" text-anchor="middle">∂L/∂Z⁽²⁾</text>
<rect x="715.00" y="416.00" width="10.00" height="14.00" fill="#C30B0A" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1"/>
<rect x="735.00" y="430.00" width="10.00" height="14.00" fill="#C30B0A" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1"/>
<rect x="705.00" y="444.00" width="10.00" height="14.00" fill="#C30B0A" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1"/>
<rect x="765.00" y="458.00" width="10.00" height="14.00" fill="#C30B0A" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1"/>
<text x="480" y="534" class="cap" text-anchor="middle">в каждой строке ровно одна клетка отрицательная — верный класс; сумма строки равна нулю</text>
</g>
<g data-key="mw2" data-only="1">
<rect x="219.0" y="392.0" width="52" height="104" fill="#73B222" fill-opacity="0.5" stroke="#73B222" stroke-width="1.6"/>
<line x1="232.0" y1="392.0" x2="232.0" y2="496.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="245.0" y1="392.0" x2="245.0" y2="496.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="258.0" y1="392.0" x2="258.0" y2="496.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="219.0" y1="409.3" x2="271.0" y2="409.3" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="219.0" y1="426.7" x2="271.0" y2="426.7" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="219.0" y1="444.0" x2="271.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="219.0" y1="461.3" x2="271.0" y2="461.3" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="219.0" y1="478.7" x2="271.0" y2="478.7" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="245" y="382.0" class="dim" text-anchor="middle">32 × 4</text>
<text x="245" y="518.0" class="nm" text-anchor="middle">(A⁽¹⁾)ᵀ</text>
<text x="306" y="451" class="lbl" text-anchor="middle">×</text>
<rect x="341.0" y="422.0" width="92" height="44" fill="#C30B0A" fill-opacity="0.5" stroke="#C30B0A" stroke-width="1.6"/>
<line x1="350.2" y1="422.0" x2="350.2" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="359.4" y1="422.0" x2="359.4" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="368.6" y1="422.0" x2="368.6" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="377.8" y1="422.0" x2="377.8" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="387.0" y1="422.0" x2="387.0" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="396.2" y1="422.0" x2="396.2" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="405.4" y1="422.0" x2="405.4" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="414.6" y1="422.0" x2="414.6" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="423.8" y1="422.0" x2="423.8" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="341.0" y1="433.0" x2="433.0" y2="433.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="341.0" y1="444.0" x2="433.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="341.0" y1="455.0" x2="433.0" y2="455.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="387" y="412.0" class="dim" text-anchor="middle">4 × 10</text>
<text x="387" y="488.0" class="nm" text-anchor="middle">∂L/∂Z⁽²⁾</text>
<text x="468" y="451" class="lbl" text-anchor="middle">=</text>
<rect x="503.0" y="392.0" width="76" height="104" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.6"/>
<rect x="503.0" y="392.00" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="395.25" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="398.50" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="401.75" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="405.00" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="408.25" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="411.50" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="414.75" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="418.00" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="421.25" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="424.50" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="427.75" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="431.00" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="434.25" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="437.50" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="440.75" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="444.00" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="447.25" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="450.50" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="453.75" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="457.00" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="460.25" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="463.50" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="466.75" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="470.00" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="473.25" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="476.50" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="479.75" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="483.00" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="486.25" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="489.50" width="76" height="3.25" fill="#E4E1D7" fill-opacity="1"/>
<rect x="503.0" y="492.75" width="76" height="3.25" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="503.0" y="392.0" width="76" height="104" fill="none" stroke="#C30B0A" stroke-width="1.6"/>
<text x="541" y="382" class="dim" text-anchor="middle">32 × 10</text>
<text x="541" y="518" class="nm" text-anchor="middle">∂L/∂W⁽²⁾</text>
<text x="614" y="451" class="lbl" text-anchor="middle">и</text>
<rect x="649.0" y="435.0" width="92" height="18" fill="#C30B0A" fill-opacity="0.5" stroke="#C30B0A" stroke-width="1.6"/>
<line x1="658.2" y1="435.0" x2="658.2" y2="453.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="667.4" y1="435.0" x2="667.4" y2="453.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="676.6" y1="435.0" x2="676.6" y2="453.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="685.8" y1="435.0" x2="685.8" y2="453.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="695.0" y1="435.0" x2="695.0" y2="453.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="704.2" y1="435.0" x2="704.2" y2="453.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="713.4" y1="435.0" x2="713.4" y2="453.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="722.6" y1="435.0" x2="722.6" y2="453.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="731.8" y1="435.0" x2="731.8" y2="453.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="649.0" y1="444.0" x2="741.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="695" y="425.0" class="dim" text-anchor="middle">10</text>
<text x="695" y="475.0" class="nm" text-anchor="middle">∂L/∂b⁽²⁾</text>
<text x="480" y="534" class="cap" text-anchor="middle">серые полоски — 10 нейронов, закрытых у всех четырёх картинок: их строки в градиенте ровно нулевые</text>
</g>
<g data-key="ma1" data-only="1">
<rect x="260.0" y="422.0" width="92" height="44" fill="#C30B0A" fill-opacity="0.5" stroke="#C30B0A" stroke-width="1.6"/>
<line x1="269.2" y1="422.0" x2="269.2" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="278.4" y1="422.0" x2="278.4" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="287.6" y1="422.0" x2="287.6" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="296.8" y1="422.0" x2="296.8" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="306.0" y1="422.0" x2="306.0" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="315.2" y1="422.0" x2="315.2" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="324.4" y1="422.0" x2="324.4" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="333.6" y1="422.0" x2="333.6" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="342.8" y1="422.0" x2="342.8" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="260.0" y1="433.0" x2="352.0" y2="433.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="260.0" y1="444.0" x2="352.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="260.0" y1="455.0" x2="352.0" y2="455.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="306" y="412.0" class="dim" text-anchor="middle">4 × 10</text>
<text x="306" y="488.0" class="nm" text-anchor="middle">∂L/∂Z⁽²⁾</text>
<text x="387" y="451" class="lbl" text-anchor="middle">×</text>
<rect x="422.0" y="410.0" width="104" height="68" fill="#C29E08" fill-opacity="0.9" stroke="#C29E08" stroke-width="1.6"/>
<line x1="432.4" y1="410.0" x2="432.4" y2="478.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="442.8" y1="410.0" x2="442.8" y2="478.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="453.2" y1="410.0" x2="453.2" y2="478.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="463.6" y1="410.0" x2="463.6" y2="478.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="474.0" y1="410.0" x2="474.0" y2="478.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="484.4" y1="410.0" x2="484.4" y2="478.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="494.8" y1="410.0" x2="494.8" y2="478.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="505.2" y1="410.0" x2="505.2" y2="478.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="515.6" y1="410.0" x2="515.6" y2="478.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="422.0" y1="421.3" x2="526.0" y2="421.3" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="422.0" y1="432.7" x2="526.0" y2="432.7" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="422.0" y1="444.0" x2="526.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="422.0" y1="455.3" x2="526.0" y2="455.3" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="422.0" y1="466.7" x2="526.0" y2="466.7" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="474" y="400.0" class="dim" text-anchor="middle">10 × 32</text>
<text x="474" y="500.0" class="nm" text-anchor="middle">(W⁽²⁾)ᵀ</text>
<text x="561" y="451" class="lbl" text-anchor="middle">=</text>
<rect x="596.0" y="422.0" width="104" height="44" fill="#C30B0A" fill-opacity="0.5" stroke="#C30B0A" stroke-width="1.6"/>
<line x1="606.4" y1="422.0" x2="606.4" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="616.8" y1="422.0" x2="616.8" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="627.2" y1="422.0" x2="627.2" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="637.6" y1="422.0" x2="637.6" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="648.0" y1="422.0" x2="648.0" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="658.4" y1="422.0" x2="658.4" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="668.8" y1="422.0" x2="668.8" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="679.2" y1="422.0" x2="679.2" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="689.6" y1="422.0" x2="689.6" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="596.0" y1="433.0" x2="700.0" y2="433.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="596.0" y1="444.0" x2="700.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="596.0" y1="455.0" x2="700.0" y2="455.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="648" y="412.0" class="dim" text-anchor="middle">4 × 32</text>
<text x="648" y="488.0" class="nm" text-anchor="middle">∂L/∂A⁽¹⁾</text>
<text x="480" y="534" class="cap" text-anchor="middle">каждый нейрон получает десять пожеланий сразу — и до него доезжает их равнодействующая</text>
</g>
<g data-key="mz1" data-only="1">
<rect x="246.0" y="418.0" width="104" height="52" fill="#C30B0A" fill-opacity="0.5" stroke="#C30B0A" stroke-width="1.6"/>
<line x1="256.4" y1="418.0" x2="256.4" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="266.8" y1="418.0" x2="266.8" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="277.2" y1="418.0" x2="277.2" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="287.6" y1="418.0" x2="287.6" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="298.0" y1="418.0" x2="298.0" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="308.4" y1="418.0" x2="308.4" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="318.8" y1="418.0" x2="318.8" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="329.2" y1="418.0" x2="329.2" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="339.6" y1="418.0" x2="339.6" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="246.0" y1="431.0" x2="350.0" y2="431.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="246.0" y1="444.0" x2="350.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="246.0" y1="457.0" x2="350.0" y2="457.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="298" y="408.0" class="dim" text-anchor="middle">4 × 32</text>
<text x="298" y="492.0" class="nm" text-anchor="middle">∂L/∂A⁽¹⁾</text>
<text x="385" y="451" class="lbl" text-anchor="middle">⊙</text>
<rect x="420.00" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="423.75" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="427.50" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="431.25" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="435.00" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="438.75" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="442.50" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="446.25" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="450.00" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="453.75" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="457.50" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="461.25" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="465.00" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="468.75" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="472.50" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="476.25" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="480.00" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="483.75" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="487.50" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="491.25" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="495.00" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="498.75" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="502.50" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="506.25" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="510.00" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="513.75" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="517.50" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="521.25" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="525.00" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="528.75" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="532.50" y="418.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="536.25" y="418.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="420.00" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="423.75" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="427.50" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="431.25" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="435.00" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="438.75" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="442.50" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="446.25" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="450.00" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="453.75" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="457.50" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="461.25" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="465.00" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="468.75" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="472.50" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="476.25" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="480.00" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="483.75" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="487.50" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="491.25" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="495.00" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="498.75" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="502.50" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="506.25" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="510.00" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="513.75" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="517.50" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="521.25" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="525.00" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="528.75" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="532.50" y="431.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="536.25" y="431.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="420.00" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="423.75" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="427.50" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="431.25" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="435.00" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="438.75" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="442.50" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="446.25" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="450.00" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="453.75" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="457.50" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="461.25" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="465.00" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="468.75" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="472.50" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="476.25" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="480.00" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="483.75" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="487.50" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="491.25" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="495.00" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="498.75" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="502.50" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="506.25" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="510.00" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="513.75" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="517.50" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="521.25" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="525.00" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="528.75" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="532.50" y="444.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="536.25" y="444.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="420.00" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="423.75" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="427.50" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="431.25" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="435.00" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="438.75" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="442.50" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="446.25" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="450.00" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="453.75" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="457.50" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="461.25" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="465.00" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="468.75" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="472.50" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="476.25" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="480.00" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="483.75" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="487.50" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="491.25" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="495.00" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="498.75" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="502.50" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="506.25" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="510.00" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="513.75" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="517.50" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="521.25" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="525.00" y="457.00" width="3.75" height="13.00" fill="#73B222" fill-opacity="0.65" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="528.75" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="532.50" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="536.25" y="457.00" width="3.75" height="13.00" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.4"/>
<rect x="420.0" y="418.0" width="120" height="52" fill="none" stroke="#73B222" stroke-width="1.6"/>
<text x="480" y="408" class="dim" text-anchor="middle">4 × 32</text>
<text x="480" y="492" class="nm" text-anchor="middle">[Z⁽¹⁾ > 0]</text>
<text x="575" y="451" class="lbl" text-anchor="middle">=</text>
<rect x="610.0" y="418.0" width="104" height="52" fill="#C30B0A" fill-opacity="0.5" stroke="#C30B0A" stroke-width="1.6"/>
<line x1="620.4" y1="418.0" x2="620.4" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="630.8" y1="418.0" x2="630.8" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="641.2" y1="418.0" x2="641.2" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="651.6" y1="418.0" x2="651.6" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="662.0" y1="418.0" x2="662.0" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="672.4" y1="418.0" x2="672.4" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="682.8" y1="418.0" x2="682.8" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="693.2" y1="418.0" x2="693.2" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="703.6" y1="418.0" x2="703.6" y2="470.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="610.0" y1="431.0" x2="714.0" y2="431.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="610.0" y1="444.0" x2="714.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="610.0" y1="457.0" x2="714.0" y2="457.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="662" y="408.0" class="dim" text-anchor="middle">4 × 32</text>
<text x="662" y="492.0" class="nm" text-anchor="middle">∂L/∂Z⁽¹⁾</text>
<text x="480" y="534" class="cap" text-anchor="middle">зелёные клетки маски — 56 открытых нейронов; сквозь остальные 72 не проходит ничего</text>
</g>
<g data-key="mw1" data-only="1">
<rect x="287.0" y="392.0" width="52" height="104" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.6"/>
<rect x="287.0" y="392.00" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="393.62" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="395.25" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="396.88" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="398.50" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="400.12" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="401.75" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="403.38" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="405.00" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="406.62" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="408.25" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="409.88" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="411.50" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="413.12" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="414.75" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="416.38" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="418.00" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="419.62" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="421.25" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="422.88" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="424.50" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="426.12" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="427.75" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="429.38" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="431.00" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="432.62" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="434.25" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="435.88" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="437.50" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="439.12" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="440.75" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="442.38" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="444.00" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="445.62" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="447.25" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="448.88" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="450.50" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="452.12" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="453.75" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="455.38" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="457.00" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="458.62" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="460.25" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="461.88" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="463.50" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="465.12" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="466.75" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="468.38" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="470.00" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="471.62" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="473.25" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="474.88" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="476.50" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="478.12" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="479.75" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="481.38" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="483.00" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="484.62" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="486.25" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="487.88" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="489.50" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="491.12" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="492.75" width="52" height="1.62" fill="#3576C0" fill-opacity="0.5"/>
<rect x="287.0" y="494.38" width="52" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="287.0" y="392.0" width="52" height="104" fill="none" stroke="#3576C0" stroke-width="1.6"/>
<text x="313" y="382" class="dim" text-anchor="middle">64 × 4</text>
<text x="313" y="518" class="nm" text-anchor="middle">Xᵀ</text>
<text x="374" y="451" class="lbl" text-anchor="middle">×</text>
<rect x="409.0" y="422.0" width="104" height="44" fill="#C30B0A" fill-opacity="0.5" stroke="#C30B0A" stroke-width="1.6"/>
<line x1="419.4" y1="422.0" x2="419.4" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="429.8" y1="422.0" x2="429.8" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="440.2" y1="422.0" x2="440.2" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="450.6" y1="422.0" x2="450.6" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="461.0" y1="422.0" x2="461.0" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="471.4" y1="422.0" x2="471.4" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="481.8" y1="422.0" x2="481.8" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="492.2" y1="422.0" x2="492.2" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="502.6" y1="422.0" x2="502.6" y2="466.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="409.0" y1="433.0" x2="513.0" y2="433.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="409.0" y1="444.0" x2="513.0" y2="444.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<line x1="409.0" y1="455.0" x2="513.0" y2="455.0" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.75"/>
<text x="461" y="412.0" class="dim" text-anchor="middle">4 × 32</text>
<text x="461" y="488.0" class="nm" text-anchor="middle">∂L/∂Z⁽¹⁾</text>
<text x="548" y="451" class="lbl" text-anchor="middle">=</text>
<rect x="583.0" y="392.0" width="90" height="104" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.6"/>
<rect x="583.0" y="392.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="393.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="395.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="396.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="398.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="400.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="401.75" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="403.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="405.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="406.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="408.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="409.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="411.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="413.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="414.75" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="416.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="418.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="419.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="421.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="422.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="424.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="426.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="427.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="429.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="431.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="432.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="434.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="435.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="437.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="439.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="440.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="442.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="444.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="445.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="447.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="448.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="450.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="452.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="453.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="455.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="457.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="458.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="460.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="461.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="463.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="465.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="466.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="468.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="470.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="471.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="473.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="474.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="476.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="478.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="479.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="481.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="483.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="484.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="486.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="487.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="489.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="491.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="492.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="583.0" y="494.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="583.0" y="392.0" width="90" height="104" fill="none" stroke="#C30B0A" stroke-width="1.6"/>
<text x="628" y="382" class="dim" text-anchor="middle">64 × 32</text>
<text x="628" y="518" class="nm" text-anchor="middle">∂L/∂W⁽¹⁾</text>
<text x="480" y="534" class="cap" text-anchor="middle">пустая строка входа даёт пустую строку градиента: 18 клеток картинки нулевые у всех четырёх объектов</text>
</g>
<g data-key="chk" data-only="1">
<rect x="257.0" y="392.0" width="90" height="104" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.6"/>
<rect x="257.0" y="392.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="393.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="395.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="396.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="398.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="400.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="401.75" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="403.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="405.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="406.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="408.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="409.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="411.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="413.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="414.75" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="416.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="418.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="419.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="421.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="422.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="424.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="426.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="427.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="429.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="431.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="432.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="434.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="435.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="437.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="439.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="440.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="442.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="444.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="445.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="447.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="448.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="450.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="452.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="453.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="455.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="457.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="458.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="460.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="461.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="463.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="465.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="466.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="468.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="470.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="471.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="473.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="474.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="476.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="478.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="479.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="481.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="483.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="484.62" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="486.25" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="487.88" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="489.50" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="491.12" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="492.75" width="90" height="1.62" fill="#C30B0A" fill-opacity="0.5"/>
<rect x="257.0" y="494.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="257.0" y="392.0" width="90" height="104" fill="none" stroke="#C30B0A" stroke-width="1.6"/>
<text x="302" y="382" class="dim" text-anchor="middle">64 × 32</text>
<text x="302" y="518" class="nm" text-anchor="middle">аналитически</text>
<text x="480" y="451" class="lbl" text-anchor="middle">против</text>
<rect x="613.0" y="392.0" width="90" height="104" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.6"/>
<rect x="613.0" y="392.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="393.62" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="395.25" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="396.88" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="398.50" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="400.12" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="401.75" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="403.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="405.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="406.62" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="408.25" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="409.88" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="411.50" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="413.12" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="414.75" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="416.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="418.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="419.62" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="421.25" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="422.88" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="424.50" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="426.12" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="427.75" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="429.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="431.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="432.62" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="434.25" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="435.88" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="437.50" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="439.12" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="440.75" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="442.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="444.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="445.62" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="447.25" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="448.88" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="450.50" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="452.12" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="453.75" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="455.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="457.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="458.62" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="460.25" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="461.88" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="463.50" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="465.12" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="466.75" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="468.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="470.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="471.62" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="473.25" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="474.88" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="476.50" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="478.12" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="479.75" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="481.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="483.00" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="484.62" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="486.25" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="487.88" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="489.50" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="491.12" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="492.75" width="90" height="1.62" fill="#5E5850" fill-opacity="0.5"/>
<rect x="613.0" y="494.38" width="90" height="1.62" fill="#E4E1D7" fill-opacity="1"/>
<rect x="613.0" y="392.0" width="90" height="104" fill="none" stroke="#5E5850" stroke-width="1.6"/>
<text x="658" y="382" class="dim" text-anchor="middle">64 × 32</text>
<text x="658" y="518" class="nm" text-anchor="middle">разностями</text>
<text x="480" y="534" class="cap" text-anchor="middle" fill="#C30B0A">худшее расхождение по всем 2410 параметрам — 3,7 · 10⁻¹¹, это уровень ошибок округления</text>
</g>
<rect x="34" y="546" width="892" height="76" rx="10" fill="#FFFFFF" stroke="#E4E1D7" stroke-width="1.3"/>
<text x="52" y="568" class="cap">числа этого шага</text>
<g data-key="nm0" data-only="1"><foreignObject x="52" y="572" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="B = 4,\quad L = 2{,}1416,\quad \|\nabla L\| = 1{,}8510 \quad=\quad \sqrt{1{,}6198^2 + 0{,}3769^2 + 0{,}7184^2 + 0{,}3795^2}"></div></foreignObject></g>
<g data-key="nm1" data-only="1"><foreignObject x="52" y="572" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\dfrac{\partial L}{\partial z^{(2)}_{1}} = \dfrac{(0{,}0876;\ 0{,}0949;\ 0{,}0824;\ 0{,}1488 - 1;\ \ldots)}{4} = (0{,}0219;\ 0{,}0237;\ 0{,}0206;\ -0{,}2128;\ \ldots)"></div></foreignObject></g>
<g data-key="nm2" data-only="1"><foreignObject x="52" y="572" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\left\|\dfrac{\partial L}{\partial W^{(2)}}\right\| = 0{,}7184;\qquad \dfrac{\partial L}{\partial b^{(2)}} = (0{,}1076;\ 0{,}0868;\ -0{,}1736;\ -0{,}1190;\ \ldots),\quad \textstyle\sum_c = 0"></div></foreignObject></g>
<g data-key="nm3" data-only="1"><foreignObject x="52" y="572" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\left\|\dfrac{\partial L}{\partial Z^{(2)}}\right\| = 0{,}4653 \ \longrightarrow\ \left\|\dfrac{\partial L}{\partial A^{(1)}}\right\| = 0{,}6736"></div></foreignObject></g>
<g data-key="nm4" data-only="1"><foreignObject x="52" y="572" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\left\|\dfrac{\partial L}{\partial A^{(1)}}\right\| = 0{,}6736 \ \longrightarrow\ \left\|\dfrac{\partial L}{\partial Z^{(1)}}\right\| = 0{,}4557; \qquad 128 - 56 = 72 \ \text{нуля}"></div></foreignObject></g>
<g data-key="nm5" data-only="1"><foreignObject x="52" y="572" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\left\|\dfrac{\partial L}{\partial W^{(1)}}\right\| = 1{,}6198; \qquad \text{нулевые строки: } 0,\ 6,\ 7,\ 8,\ 14,\ 15,\ 16,\ 23,\ 24,\ \ldots \ \text{— поля картинки}"></div></foreignObject></g>
<g data-key="nm6" data-only="1"><foreignObject x="52" y="572" width="856" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\max_{\theta}\left|\dfrac{\partial L}{\partial \theta} - \dfrac{L(\theta + \varepsilon) - L(\theta - \varepsilon)}{2\varepsilon}\right| = 3{,}66\cdot 10^{-11}, \qquad \varepsilon = 10^{-5}"></div></foreignObject></g>
<text x="34" y="656" class="legend">жёлтое — параметры, зелёное — активации, красное — производные, серые полоски — строки, которые остались нулевыми</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="net gp hl4 all nm0" data-focus="all">
      <div class="step-kicker">Шаг 1 · те же шаги, но в числах</div>
      <h4>Норма градиента 1,8510 на батче из четырёх картинок</h4>
<p>Прямой проход дал L = 2,1416, теперь тот же батч едет назад. Полоса под маршрутом — это все 2410 производных в масштабе: 85 % длины занимает ∂L/∂W⁽¹⁾. Четыре куска считаются за один проход, а их длины складываются в общую норму 1,8510.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 hl3 mz2 nm1" data-focus="mz2">
      <div class="step-kicker">Шаг 2 · разность вероятностей</div>
      <h4>Сумма по строке ∂L/∂Z⁽²⁾ равна нулю</h4>
<p>У верного класса из вероятности вычитается единица, у остальных не вычитается ничего. В первой строке было p = 0,1488 у тройки — после вычитания получилось −0,8512, а после деления на B = 4 это −0,2128. Остальные девять чисел положительные и в сумме дают ровно +0,2128: softmax не может поднять один класс, не опустив остальные.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 hl2 mw2 nm2" data-focus="mw2">
      <div class="step-kicker">Шаг 3 · градиент второго слоя</div>
      <h4>10 строк ∂L/∂W⁽²⁾ — ровно нули</h4>
<p>Строка j этой матрицы умножается на активацию нейрона j. Если нейрон был закрыт у всех четырёх картинок, его строка целиком нулевая — на схеме это серые полоски, их ровно 10 из 32. Длина всего градиента здесь 0,7184. У ∂L/∂b⁽²⁾ сумма всех десяти чисел равна нулю по той же причине, что и на прошлом шаге.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 ga1 hl2 ma1 nm3" data-focus="ma1">
      <div class="step-kicker">Шаг 4 · градиент по активациям</div>
      <h4>0,4653 на входе — 0,6736 на выходе</h4>
<p>∂L/∂A⁽¹⁾ — это то, чего от нейрона хотят все десять классов вместе, уже сложенное в одно число. Часть пожеланий тянет вверх, часть вниз, и до нейрона доезжает их равнодействующая; умножение на матрицу 10 × 32 здесь слегка растянуло длину градиента.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 ga1 relu hl1 mz1 nm4" data-focus="mz1">
      <div class="step-kicker">Шаг 5 · маска ReLU</div>
      <h4>72 нуля из 128 — те самые закрытые нейроны</h4>
<p>Маска нарисована настоящая: зелёная клетка — нейрон был открыт на этой картинке. Открытых ровно 56, и после умножения длина градиента падает с 0,6736 до 0,4557. Число нулей совпадает с числом закрытых клеток на прямом проходе — это хорошая самопроверка кода: если нулей меньше, маску где-то потеряли.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 ga1 relu hl1 mw1 nm5" data-focus="mw1">
      <div class="step-kicker">Шаг 6 · градиент первого слоя</div>
      <h4>18 строк из 64 — ровно нули</h4>
<p>Строка k матрицы ∂L/∂W⁽¹⁾ умножается на k-ю клетку картинки. У наших четырёх картинок 18 клеток нулевые у всех сразу — это поля по краям, и номера видно в списке внизу: 0, 6, 7, 8, 14, 15, 16, 23, 24 и дальше. Веса этих клеток на данном батче не сдвинутся вовсе. А четыре клетки (№0, №24, №32, №39) нулевые у всех 1347 картинок: их 128 весов после 1260 шагов обучения остались ровно такими же, какими были при инициализации.</p>
    </div>
    <div class="step-panel" data-on="net gp gz2 ga1 gx chk nm6" data-focus="chk">
      <div class="step-kicker">Шаг 7 · сверка</div>
      <h4>Расхождение 3,7 · 10⁻¹¹ по всем 2410 параметрам</h4>
<p>Аналитический градиент сверен с центральными разностями: каждый параметр по очереди сдвигается на ±10⁻⁵, потеря пересчитывается дважды, производная берётся как (L₊ − L₋)/2ε. Худшее расхождение — 3,7 · 10⁻¹¹, это уровень ошибок округления, и нулевые строки совпали в обеих матрицах. Проверка честно ломается ровно в одном месте: если ε взять крупным, точка может перескочить излом ReLU, и численная производная посчитает уже другую функцию.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> в градиенте почти всегда есть говорящие нули, и по ним
  проверяют код: нулевые строки dW⁽¹⁾ — это клетки, которые у всего батча пусты, нулевые строки
  dW⁽²⁾ — нейроны, которых батч не разбудил, нули в dZ⁽¹⁾ — закрытые ReLU. Если нулей меньше,
  чем должно быть, где-то потеряна маска.
</div>

---

## Часть 8. Шаг: куда и насколько сдвинуть 2410 чисел

<p>
  Почему шагать надо именно против градиента — видно из разложения потери в точке, где мы стоим.
  Соберём все 2410 чисел в один вектор θ, а все производные — в вектор
  <span class="math-inline" data-tex="g = \nabla L"></span>. Для малого сдвига в направлении
  единичного вектора u первый член разложения Тейлора выглядит так:
</p>

<div class="math-display" data-tex="L(\theta + t\,u) \;\approx\; L(\theta) + t\,\langle g,\,u\rangle"></div>

<p>
  Скалярное произведение <span class="math-inline" data-tex="\langle g, u\rangle"></span> при
  единичной длине u не может быть меньше, чем <span class="math-inline" data-tex="-\|g\|"></span>,
  и равенство достигается ровно при <span class="math-inline" data-tex="u = -g/\|g\|"></span>.
  То есть направление против градиента — не одно из хороших, а единственное наилучшее из всех
  возможных при малом шаге. Отсюда правило, одно на все параметры сразу, без исключений для весов,
  смещений и слоёв:
</p>

<div class="math-display" data-tex="\theta \;\leftarrow\; \theta - \eta\,\frac{\partial L}{\partial \theta}"></div>

<p>
  Посмотрим пошагово, как это правило выглядит на самих матрицах — и что происходит с теми
  числами, которые мы считали руками в частях 4 и 6.
</p>

<div class="stage" id="stageUP" tabindex="0">
  <div class="stage-figure">
<svg id="up" viewBox="0 0 960 530" role="img" aria-label="Шаг спуска в матрицах: вычитаем из каждого параметра его производную с множителем">
  <style>
    #up { font-family: Helvetica, Arial, sans-serif; }
    #up .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="up-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="up-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="up-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
<rect x="40" y="24" width="743" height="26" fill="#3576C0" fill-opacity="0.18" stroke="#3576C0" stroke-width="1.2"/>
<rect x="783" y="24" width="12" height="26" fill="#3576C0" fill-opacity="0.18" stroke="#3576C0" stroke-width="1.2"/>
<rect x="795" y="24" width="116" height="26" fill="#3576C0" fill-opacity="0.18" stroke="#3576C0" stroke-width="1.2"/>
<rect x="911" y="24" width="9" height="26" fill="#3576C0" fill-opacity="0.18" stroke="#3576C0" stroke-width="1.2"/>
<text x="412" y="42" text-anchor="middle" font-size="12" fill="#5E5850">W⁽¹⁾ · 2048</text>
<text x="853" y="42" text-anchor="middle" font-size="12" fill="#5E5850">W⁽²⁾ · 320</text>
<text x="789" y="16" text-anchor="middle" font-size="12" fill="#5E5850">b⁽¹⁾ 32</text>
<text x="916" y="16" text-anchor="middle" font-size="12" fill="#5E5850">b⁽²⁾ 10</text>
<g data-key="mm0" data-only="1"><rect x="38" y="22" width="747" height="30" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="781" y="22" width="16" height="30" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="793" y="22" width="120" height="30" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="909" y="22" width="13" height="30" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mmall" data-only="1"><rect x="38" y="22" width="884" height="30" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" text-anchor="middle" font-size="13" fill="#5E5850">полоса сверху — все 2410 параметров сети по долям; рамкой отмечено то, что меняем сейчас</text>
<g data-key="e1" data-only="1"><rect x="41" y="118" width="252" height="135" fill="#C29E08" fill-opacity="0.16"/>
<line x1="83" y1="118" x2="83" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="125" y1="118" x2="125" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="167" y1="118" x2="167" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="209" y1="118" x2="209" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="251" y1="118" x2="251" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="41" y1="145" x2="293" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="41" y1="172" x2="293" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="41" y1="199" x2="293" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="41" y1="226" x2="293" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 40 113 L 30 113 L 30 258 L 40 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 294 113 L 304 113 L 304 258 L 294 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="62" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="104" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="146" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="188" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="230" y="136" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="272" y="136" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="62" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="104" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="146" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="188" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="230" y="164" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="272" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="62" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,1</tspan></text>
<text x="104" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,2</tspan></text>
<text x="146" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,3</tspan></text>
<text x="188" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,4</tspan></text>
<text x="230" y="190" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="272" y="190" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">22,10</tspan></text>
<text x="62" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="104" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="146" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="188" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="230" y="218" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="272" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="62" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,1</tspan></text>
<text x="104" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,2</tspan></text>
<text x="146" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,3</tspan></text>
<text x="188" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,4</tspan></text>
<text x="230" y="244" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="272" y="244" text-anchor="middle" font-size="14" fill="#111111">w<tspan font-size="10" dy="4">32,10</tspan></text>
<text x="167" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">32 × 10</text>
<text x="167" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W⁽²⁾ было</text>
<rect x="361" y="118" width="252" height="135" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="403" y1="118" x2="403" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="445" y1="118" x2="445" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="487" y1="118" x2="487" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="529" y1="118" x2="529" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="571" y1="118" x2="571" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="361" y1="145" x2="613" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="361" y1="172" x2="613" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="361" y1="199" x2="613" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="361" y1="226" x2="613" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 360 113 L 350 113 L 350 258 L 360 258" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 614 113 L 624 113 L 624 258 L 614 258" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="382" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="424" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="466" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="508" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="550" y="136" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="592" y="136" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="382" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="424" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="466" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="508" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="550" y="164" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="592" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="382" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,1</tspan></text>
<text x="424" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,2</tspan></text>
<text x="466" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,3</tspan></text>
<text x="508" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,4</tspan></text>
<text x="550" y="190" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="592" y="190" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">22,10</tspan></text>
<text x="382" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="424" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="466" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="508" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="550" y="218" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="592" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="382" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,1</tspan></text>
<text x="424" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,2</tspan></text>
<text x="466" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,3</tspan></text>
<text x="508" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,4</tspan></text>
<text x="550" y="244" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="592" y="244" text-anchor="middle" font-size="14" fill="#111111">∂w<tspan font-size="10" dy="4">32,10</tspan></text>
<text x="487" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">32 × 10</text>
<text x="487" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂W⁽²⁾</text>
<rect x="665" y="118" width="252" height="135" fill="#C29E08" fill-opacity="0.16"/>
<line x1="707" y1="118" x2="707" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="749" y1="118" x2="749" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="791" y1="118" x2="791" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="833" y1="118" x2="833" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="875" y1="118" x2="875" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="665" y1="145" x2="917" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="665" y1="172" x2="917" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="665" y1="199" x2="917" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="665" y1="226" x2="917" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 664 113 L 654 113 L 654 258 L 664 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 918 113 L 928 113 L 928 258 L 918 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="686" y="136" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="728" y="136" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="770" y="136" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">1,3</tspan></text>
<text x="812" y="136" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">1,4</tspan></text>
<text x="854" y="136" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="896" y="136" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">1,10</tspan></text>
<text x="686" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="728" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="770" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="812" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="854" y="164" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="896" y="164" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="686" y="190" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">22,1</tspan></text>
<text x="728" y="190" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">22,2</tspan></text>
<text x="770" y="190" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">22,3</tspan></text>
<text x="812" y="190" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">22,4</tspan></text>
<text x="854" y="190" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="896" y="190" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">22,10</tspan></text>
<text x="686" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="728" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="770" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="812" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="854" y="218" text-anchor="middle" font-size="14" fill="#111111">⋱</text>
<text x="896" y="218" text-anchor="middle" font-size="14" fill="#111111">⋮</text>
<text x="686" y="244" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">32,1</tspan></text>
<text x="728" y="244" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">32,2</tspan></text>
<text x="770" y="244" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">32,3</tspan></text>
<text x="812" y="244" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">32,4</tspan></text>
<text x="854" y="244" text-anchor="middle" font-size="14" fill="#111111">⋯</text>
<text x="896" y="244" text-anchor="middle" font-size="14" fill="#111111">w′<tspan font-size="10" dy="4">32,10</tspan></text>
<text x="791" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">32 × 10</text>
<text x="791" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W⁽²⁾ стало</text>
<text x="327" y="192" text-anchor="middle" font-size="17" fill="#111111">− η ·</text>
<text x="639" y="192" text-anchor="middle" font-size="20" fill="#111111">=</text></g>
<g data-key="h1" data-only="1"><rect x="167" y="172" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="487" y="172" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="791" y="172" width="42" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e2" data-only="1"><rect x="81" y="170" width="224" height="27" fill="#C29E08" fill-opacity="0.16"/>
<line x1="137" y1="170" x2="137" y2="197" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="193" y1="170" x2="193" y2="197" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="249" y1="170" x2="249" y2="197" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 80 165 L 70 165 L 70 202 L 80 202" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 306 165 L 316 165 L 316 202 L 306 202" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="109" y="188" text-anchor="middle" font-size="13" fill="#111111">0</text>
<text x="165" y="188" text-anchor="middle" font-size="13" fill="#111111">0</text>
<text x="221" y="188" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="277" y="188" text-anchor="middle" font-size="13" fill="#111111">0</text>
<text x="193" y="156" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">10</text>
<text x="193" y="224" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b⁽²⁾ было</text>
<rect x="379" y="170" width="224" height="27" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="435" y1="170" x2="435" y2="197" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="491" y1="170" x2="491" y2="197" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="547" y1="170" x2="547" y2="197" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 378 165 L 368 165 L 368 202 L 378 202" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 604 165 L 614 165 L 614 202 L 604 202" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="407" y="188" text-anchor="middle" font-size="13" fill="#111111">0,1076</text>
<text x="463" y="188" text-anchor="middle" font-size="13" fill="#111111">0,0868</text>
<text x="519" y="188" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="575" y="188" text-anchor="middle" font-size="13" fill="#111111">0,1007</text>
<text x="491" y="156" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">10</text>
<text x="491" y="224" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂b⁽²⁾</text>
<rect x="659" y="170" width="224" height="27" fill="#C29E08" fill-opacity="0.16"/>
<line x1="715" y1="170" x2="715" y2="197" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="771" y1="170" x2="771" y2="197" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="827" y1="170" x2="827" y2="197" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 658 165 L 648 165 L 648 202 L 658 202" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 884 165 L 894 165 L 894 202 L 884 202" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="687" y="188" text-anchor="middle" font-size="13" fill="#111111">−0,0323</text>
<text x="743" y="188" text-anchor="middle" font-size="13" fill="#111111">−0,0260</text>
<text x="799" y="188" text-anchor="middle" font-size="13" fill="#111111">⋯</text>
<text x="855" y="188" text-anchor="middle" font-size="13" fill="#111111">−0,0302</text>
<text x="771" y="156" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">10</text>
<text x="771" y="224" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b⁽²⁾ стало</text>
<text x="342" y="190" text-anchor="middle" font-size="17" fill="#111111">− η ·</text>
<text x="631" y="190" text-anchor="middle" font-size="20" fill="#111111">=</text>
<text x="480" y="260" text-anchor="middle" font-size="13" fill="#5E5850">сумма всех десяти производных равна нулю — значит и сумма новых смещений тоже ноль</text>
<text x="480" y="286" text-anchor="middle" font-size="13" fill="#5E5850">softmax не сдвигается целиком: меняется только разница между классами</text></g>
<g data-key="e3" data-only="1"><rect x="71" y="118" width="220" height="135" fill="#C29E08" fill-opacity="0.16"/>
<line x1="115" y1="118" x2="115" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="159" y1="118" x2="159" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="203" y1="118" x2="203" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="247" y1="118" x2="247" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="145" x2="291" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="172" x2="291" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="199" x2="291" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="71" y1="226" x2="291" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 70 113 L 60 113 L 60 258 L 70 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 292 113 L 302 113 L 302 258 L 292 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="93" y="136" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="137" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="181" y="136" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="225" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="269" y="136" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="93" y="164" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="137" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="181" y="164" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="225" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="269" y="164" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="93" y="190" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="137" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="181" y="190" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="225" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="269" y="190" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="93" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="137" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="181" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="225" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="269" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="93" y="244" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">64,1</tspan></text>
<text x="137" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="181" y="244" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">64,22</tspan></text>
<text x="225" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="269" y="244" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="11" dy="4">64,32</tspan></text>
<text x="181" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">64 × 32</text>
<text x="181" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W⁽¹⁾ было</text>
<rect x="359" y="118" width="220" height="135" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="403" y1="118" x2="403" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="447" y1="118" x2="447" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="491" y1="118" x2="491" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="535" y1="118" x2="535" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="359" y1="145" x2="579" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="359" y1="172" x2="579" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="359" y1="199" x2="579" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="359" y1="226" x2="579" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 358 113 L 348 113 L 348 258 L 358 258" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 580 113 L 590 113 L 590 258 L 580 258" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="381" y="136" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="425" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="469" y="136" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="513" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="557" y="136" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="381" y="164" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="425" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="469" y="164" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="513" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="557" y="164" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="381" y="190" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="425" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="469" y="190" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="513" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="557" y="190" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="381" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="425" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="469" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="513" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="557" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="381" y="244" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">64,1</tspan></text>
<text x="425" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="469" y="244" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">64,22</tspan></text>
<text x="513" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="557" y="244" text-anchor="middle" font-size="15" fill="#111111">∂w<tspan font-size="11" dy="4">64,32</tspan></text>
<text x="469" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">64 × 32</text>
<text x="469" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">∂L/∂W⁽¹⁾</text>
<rect x="635" y="118" width="220" height="135" fill="#C29E08" fill-opacity="0.16"/>
<line x1="679" y1="118" x2="679" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="723" y1="118" x2="723" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="767" y1="118" x2="767" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="811" y1="118" x2="811" y2="253" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="635" y1="145" x2="855" y2="145" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="635" y1="172" x2="855" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="635" y1="199" x2="855" y2="199" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="635" y1="226" x2="855" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 634 113 L 624 113 L 624 258 L 634 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 856 113 L 866 113 L 866 258 L 856 258" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="657" y="136" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">1,1</tspan></text>
<text x="701" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="745" y="136" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">1,22</tspan></text>
<text x="789" y="136" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="833" y="136" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">1,32</tspan></text>
<text x="657" y="164" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">2,1</tspan></text>
<text x="701" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="745" y="164" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">2,22</tspan></text>
<text x="789" y="164" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="833" y="164" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">2,32</tspan></text>
<text x="657" y="190" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">3,1</tspan></text>
<text x="701" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="745" y="190" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">3,22</tspan></text>
<text x="789" y="190" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="833" y="190" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">3,32</tspan></text>
<text x="657" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="701" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="745" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="789" y="218" text-anchor="middle" font-size="15" fill="#111111">⋱</text>
<text x="833" y="218" text-anchor="middle" font-size="15" fill="#111111">⋮</text>
<text x="657" y="244" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">64,1</tspan></text>
<text x="701" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="745" y="244" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">64,22</tspan></text>
<text x="789" y="244" text-anchor="middle" font-size="15" fill="#111111">⋯</text>
<text x="833" y="244" text-anchor="middle" font-size="15" fill="#111111">w′<tspan font-size="11" dy="4">64,32</tspan></text>
<text x="745" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">64 × 32</text>
<text x="745" y="280" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W⁽¹⁾ стало</text>
<text x="325" y="192" text-anchor="middle" font-size="17" fill="#111111">− η ·</text>
<text x="607" y="192" text-anchor="middle" font-size="20" fill="#111111">=</text>
<text x="480" y="330" text-anchor="middle" font-size="13" fill="#5E5850">18 строк ∂L/∂W⁽¹⁾ нулевые целиком — эти веса после шага не изменились ни на бит</text></g>
<g data-key="h3" data-only="1"><rect x="159" y="145" width="44" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="447" y="145" width="44" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="723" y="145" width="44" height="27" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e4" data-only="1"><rect x="60" y="150" width="260" height="86" rx="12" fill="#3576C0" fill-opacity="0.10" stroke="#3576C0" stroke-width="1.8"/>
<text x="190" y="180" text-anchor="middle" font-size="13" fill="#5E5850">длина градиента</text>
<text x="190" y="210" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">‖∇L‖ = 1,8510</text>
<rect x="350" y="150" width="260" height="86" rx="12" fill="#C30B0A" fill-opacity="0.10" stroke="#C30B0A" stroke-width="1.8"/>
<text x="480" y="180" text-anchor="middle" font-size="13" fill="#5E5850">длина шага</text>
<text x="480" y="210" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">η‖∇L‖ = 0,5553</text>
<rect x="640" y="150" width="260" height="86" rx="12" fill="#C29E08" fill-opacity="0.10" stroke="#C29E08" stroke-width="1.8"/>
<text x="770" y="180" text-anchor="middle" font-size="13" fill="#5E5850">длина вектора весов</text>
<text x="770" y="210" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">‖θ‖ = 9,1616</text>
<text x="480" y="276" text-anchor="middle" font-size="15" fill="#111111" font-weight="700">шаг сдвинул вектор весов на 6,1 % его длины</text>
<text x="480" y="306" text-anchor="middle" font-size="13" fill="#5E5850">1244 числа из 2410 не изменились вовсе: у них производная ровно ноль</text></g>
<g data-key="e5" data-only="1"><rect x="131" y="130" width="92" height="108" fill="#73B222" fill-opacity="0.12"/>
<line x1="131" y1="157" x2="223" y2="157" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="131" y1="184" x2="223" y2="184" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="131" y1="211" x2="223" y2="211" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 130 125 L 120 125 L 120 243 L 130 243" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 224 125 L 234 125 L 234 243 L 224 243" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="177" y="148" text-anchor="middle" font-size="13" fill="#111111">0,1488</text>
<text x="177" y="176" text-anchor="middle" font-size="13" fill="#111111">0,1381</text>
<text x="177" y="202" text-anchor="middle" font-size="13" fill="#111111">0,1099</text>
<text x="177" y="230" text-anchor="middle" font-size="13" fill="#111111">0,0843</text>
<text x="177" y="116" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">было</text>
<text x="177" y="265" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">p верного класса</text>
<rect x="431" y="130" width="92" height="108" fill="#73B222" fill-opacity="0.28"/>
<line x1="431" y1="157" x2="523" y2="157" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="431" y1="184" x2="523" y2="184" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="431" y1="211" x2="523" y2="211" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 430 125 L 420 125 L 420 243 L 430 243" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 524 125 L 534 125 L 534 243 L 524 243" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="477" y="148" text-anchor="middle" font-size="13" fill="#111111">0,1947</text>
<text x="477" y="176" text-anchor="middle" font-size="13" fill="#111111">0,3284</text>
<text x="477" y="202" text-anchor="middle" font-size="13" fill="#111111">0,1859</text>
<text x="477" y="230" text-anchor="middle" font-size="13" fill="#111111">0,2323</text>
<text x="477" y="116" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">стало</text>
<text x="477" y="265" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">p верного класса</text>
<line x1="250" y1="184" x2="408" y2="184" stroke="#73B222" stroke-width="2.4" fill="none" marker-end="url(#up-arg)"/>
<rect x="640" y="140" width="250" height="92" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="765" y="172" text-anchor="middle" font-size="13" fill="#5E5850">потеря батча</text>
<text x="765" y="204" text-anchor="middle" font-size="18" fill="#111111" font-weight="700">2,1416  →  1,4731</text>
<text x="480" y="290" text-anchor="middle" font-size="14" fill="#5E5850">тот же батч, пересчитанный после шага: угаданы все 4 из 4 — было 2 из 4</text>
<text x="480" y="316" text-anchor="middle" font-size="13" fill="#5E5850">но это те же картинки, на которых считался градиент; на новых сеть пока не лучше</text></g>
<g data-key="e6" data-only="1"><text x="252" y="140" text-anchor="middle" font-size="13" fill="#5E5850">маска до шага: 56 открытых</text>
<rect x="60" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="72" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="84" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="96" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="108" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="120" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="132" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="144" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="156" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="168" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="180" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="192" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="204" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="216" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="228" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="240" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="252" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="264" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="276" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="288" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="300" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="312" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="324" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="336" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="348" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="360" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="372" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="384" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="396" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="408" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="420" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="432" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="60" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="72" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="84" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="96" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="108" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="120" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="132" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="144" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="156" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="168" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="180" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="192" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="204" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="216" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="228" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="240" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="252" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="264" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="276" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="288" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="300" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="312" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="324" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="336" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="348" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="360" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="372" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="384" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="396" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="408" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="420" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="432" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="60" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="72" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="84" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="96" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="108" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="120" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="132" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="144" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="156" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="168" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="180" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="192" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="204" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="216" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="228" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="240" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="252" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="264" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="276" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="288" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="300" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="312" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="324" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="336" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="348" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="360" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="372" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="384" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="396" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="408" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="420" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="432" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="60" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="72" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="84" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="96" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="108" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="120" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="132" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="144" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="156" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="168" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="180" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="192" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="204" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="216" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="228" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="240" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="252" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="264" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="276" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="288" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="300" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="312" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="324" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="336" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="348" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="360" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="372" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="384" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="396" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="408" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="420" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="432" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<text x="712" y="140" text-anchor="middle" font-size="13" fill="#5E5850">маска после шага: 51 открытая</text>
<rect x="520" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="532" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="544" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="556" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="568" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="580" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="592" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="604" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="616" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="628" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="640" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="652" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="664" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="676" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="688" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="700" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="712" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="724" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="736" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="748" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="760" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="772" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="784" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="796" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="808" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="820" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="832" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="844" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="856" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="868" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="880" y="158" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="892" y="158" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="520" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="532" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="544" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="556" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="568" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="580" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="592" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="604" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="616" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="628" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="640" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="652" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="664" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="676" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="688" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="700" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="712" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="724" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="736" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="748" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="760" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="772" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="784" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="796" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="808" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="820" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="832" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="844" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="856" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="868" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="880" y="178" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="892" y="178" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="520" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="532" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="544" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="556" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="568" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="580" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="592" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="604" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="616" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="628" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="640" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="652" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="664" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="676" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="688" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="700" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="712" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="724" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="736" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="748" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="760" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="772" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="784" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="796" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="808" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="820" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="832" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="844" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="856" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="868" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="880" y="198" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="892" y="198" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="520" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="532" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="544" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="556" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="568" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="580" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="592" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="604" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="616" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="628" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="640" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="652" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="664" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="676" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="688" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="700" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="712" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="724" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="736" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="748" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="760" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="772" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="784" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="796" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="808" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="820" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="832" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="844" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="856" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="868" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="880" y="218" width="12" height="20" fill="#E4E1D7" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="892" y="218" width="12" height="20" fill="#73B222" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="0.8"/>
<rect x="568" y="158" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="676" y="158" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="700" y="158" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="724" y="158" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="808" y="158" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="664" y="178" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="796" y="178" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="808" y="178" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="568" y="198" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="664" y="198" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="676" y="198" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="700" y="198" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="712" y="198" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="640" y="218" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="700" y="218" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="712" y="218" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="724" y="218" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="820" y="218" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<rect x="892" y="218" width="12" height="20" fill="none" stroke="#D83BB9" stroke-width="2"/>
<line x1="452" y1="198" x2="508" y2="198" stroke="#5E5850" stroke-width="2.0" fill="none" marker-end="url(#up-arw)"/>
<text x="480" y="128" text-anchor="middle" font-size="13" fill="#5E5850">строки — четыре картинки, столбцы — 32 нейрона скрытого слоя</text>
<text x="480" y="268" text-anchor="middle" font-size="13" fill="#5E5850">малиновым обведены 19 клеток, сменивших состояние: 12 закрылись, 7 открылись</text>
<text x="480" y="300" text-anchor="middle" font-size="14" fill="#5E5850">градиент был верен ровно в той точке, где его считали — дальше сеть уже другая</text></g>
<rect x="40" y="362" width="880" height="124" rx="10" fill="#FFFFFF" stroke="#E4E1D7" stroke-width="1.3"/>
<text x="56" y="382" text-anchor="start" font-size="13" fill="#5E5850">формула шага</text>
<text x="56" y="436" text-anchor="start" font-size="13" fill="#5E5850">подстановка чисел</text>
<g data-key="fm0" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\theta \leftarrow \theta - \eta\, \dfrac{\partial L}{\partial \theta}, \qquad \eta = 0{,}3"></div></foreignObject></g>
<g data-key="fm1" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="w^{(2)}_{jc} \leftarrow w^{(2)}_{jc} - \eta\, \dfrac{\partial L}{\partial w^{(2)}_{jc}}"></div></foreignObject></g>
<g data-key="fm2" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="b^{(2)}_{c} \leftarrow b^{(2)}_{c} - \eta\, \dfrac{\partial L}{\partial b^{(2)}_{c}}"></div></foreignObject></g>
<g data-key="fm3" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="w^{(1)}_{kj} \leftarrow w^{(1)}_{kj} - \eta\, \dfrac{\partial L}{\partial w^{(1)}_{kj}}"></div></foreignObject></g>
<g data-key="fm4" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\|\Delta\theta\| = \eta\,\|\nabla L\|"></div></foreignObject></g>
<g data-key="fm5" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="L(\theta - \eta \nabla L) \ \text{против} \ L(\theta)"></div></foreignObject></g>
<g data-key="fm6" data-only="1"><foreignObject x="56" y="388" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\mathbb{1}\left[z^{(1)}_{ij} > 0\right] \ \text{после шага уже другая}"></div></foreignObject></g>
<g data-key="sb0" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\text{вычитаем, потому что градиент показывает направление роста потери}"></div></foreignObject></g>
<g data-key="sb1" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="0{,}2681 - 0{,}3\cdot(-0{,}1604) = 0{,}2681 + 0{,}0481 = 0{,}3162"></div></foreignObject></g>
<g data-key="sb2" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="0 - 0{,}3\cdot(-0{,}1190) = 0{,}0357, \qquad 0 - 0{,}3\cdot 0{,}1076 = -0{,}0323"></div></foreignObject></g>
<g data-key="sb3" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="0{,}1160 - 0{,}3\cdot 0{,}0050 = 0{,}1146"></div></foreignObject></g>
<g data-key="sb4" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="0{,}3 \cdot 1{,}8510 = 0{,}5553 \quad \text{при} \ \|\theta\| = 9{,}1616 \ \text{(6,1 \%)}"></div></foreignObject></g>
<g data-key="sb5" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="2{,}1416 \;\rightarrow\; 1{,}4731"></div></foreignObject></g>
<g data-key="sb6" data-only="1"><foreignObject x="56" y="442" width="848" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="56 \;\rightarrow\; 51 \ \text{открытых клеток из } 128"></div></foreignObject></g>
<text x="40" y="512" text-anchor="start" font-size="13" fill="#5E5850">η — длина шага (learning rate); все числа посчитаны на том же батче из четырёх картинок</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="mmall e1 fm0 sb0" data-focus="e1">
      <div class="step-kicker">Шаг 1 · правило</div>
      <h4>Из каждого числа вычитается его производная</h4>
<p>Обратный проход дал 2410 производных. Шаг спуска — одна строка, одинаковая для весов и смещений, для первого слоя и второго: вычесть производную, умноженную на длину шага η.</p><div class="math-display" data-tex="\theta \leftarrow \theta - \eta\, \dfrac{\partial L}{\partial \theta}, \qquad \eta = 0{,}3"></div><p>Минус здесь принципиален: производная показывает, куда потеря <em>растёт</em>, а нам нужно в противоположную сторону.</p>
    </div>
    <div class="step-panel" data-on="mm2 e1 h1 fm1 sb1" data-focus="h1">
      <div class="step-kicker">Шаг 2 · одна клетка</div>
      <h4>w⁽²⁾₂₂,₄: 0,2681 → 0,3162</h4>
<p>Тот самый вес между 22-м нейроном и классом «3», для которого мы вручную считали производную −0,1604. Она отрицательная, значит вычитание её увеличит вес.</p><div class="math-display" data-tex="w^{(2)}_{22,4} \leftarrow 0{,}2681 - 0{,}3\cdot(-0{,}1604) = 0{,}2681 + 0{,}0481 = 0{,}3162"></div><p>Смысл читается буквально: верным классом была тройка, 22-й нейрон был активен — значит связь между ними надо усилить. Сеть только что сделала это, ничего не зная ни про тройки, ни про цифры.</p>
    </div>
    <div class="step-panel" data-on="mm3 e2 fm2 sb2" data-focus="e2">
      <div class="step-kicker">Шаг 3 · смещения</div>
      <h4>Были нулями — стали десятью разными числами</h4>
<p>Смещения инициализировались нулями, поэтому после первого шага они равны просто −η, умноженному на производную.</p><div class="math-display" data-tex="b^{(2)}_{4} = 0 - 0{,}3\cdot(-0{,}1190) = 0{,}0357, \qquad b^{(2)}_{1} = 0 - 0{,}3\cdot 0{,}1076 = -0{,}0323"></div><p>Классы, которые сеть назвала зря, получили отрицательные смещения; верные классы — положительные. Сумма всех десяти производных равна нулю, значит и сумма новых смещений нулевая: softmax нельзя сдвинуть целиком, можно только перераспределить.</p>
    </div>
    <div class="step-panel" data-on="mm0 mm1 e3 h3 fm3 sb3" data-focus="h3">
      <div class="step-kicker">Шаг 4 · первый слой</div>
      <h4>1134 клетки из 2048 не изменились ни на бит</h4>
<p>Формула та же самая. Разница только в том, что у первого слоя очень много производных, равных ровно нулю: пустой пиксель у всех четырёх картинок или нейрон, закрытый ReLU.</p><div class="math-display" data-tex="w^{(1)}_{2,22} \leftarrow 0{,}1160 - 0{,}3\cdot 0{,}0050 = 0{,}1146"></div><p>Ноль в производной — это не «маленькая поправка», а буквально отсутствие изменения: такой вес после шага останется прежним до последнего бита. Смещения b⁽¹⁾ обновляются той же формулой; у десяти из тридцати двух нейронов производная нулевая — это те самые нейроны, закрытые на всех четырёх картинках.</p>
    </div>
    <div class="step-panel" data-on="mmall e4 fm4 sb4" data-focus="e4">
      <div class="step-kicker">Шаг 5 · насколько сдвинулись 2410 чисел</div>
      <h4>Длина шага — 6,1 % от длины вектора весов</h4>
<p>Все параметры сети можно считать одной точкой в пространстве из 2410 измерений. Тогда шаг спуска — это перемещение из точки в точку, и у него есть длина.</p><div class="math-display" data-tex="\|\Delta\theta\| = \eta\,\|\nabla L\| = 0{,}3\cdot 1{,}8510 = 0{,}5553"></div><p>Самая большая поправка к одному числу — 0,0633, у 1244 параметров поправка ровно нулевая. То есть шаг не «размазан» по сети равномерно: он бьёт в те веса, которые участвовали в ошибке на этих четырёх картинках.</p>
    </div>
    <div class="step-panel" data-on="mmall e5 fm5 sb5" data-focus="e5">
      <div class="step-kicker">Шаг 6 · что стало с потерей</div>
      <h4>2,1416 → 1,4731 за один шаг</h4>
<p>Пересчитываем прямой проход тем же батчем и теми же формулами, только с новыми весами. Вероятности верных классов выросли у всех четырёх картинок.</p><div class="math-display" data-tex="(0{,}1488;\ 0{,}1381;\ 0{,}1099;\ 0{,}0843) \;\rightarrow\; (0{,}1947;\ 0{,}3284;\ 0{,}1859;\ 0{,}2323)"></div><p>Теперь угаданы все четыре из четырёх — было две. Но радоваться рано: это ровно те картинки, на которых и считался градиент. Проверять сеть нужно на других — этим займётся отложенная выборка.</p>
    </div>
    <div class="step-panel" data-on="mmall e6 fm6 sb6" data-focus="e6">
      <div class="step-kicker">Шаг 7 · почему нельзя шагнуть сразу в минимум</div>
      <h4>После шага маска ReLU уже другая: 51 открытая клетка вместо 56</h4>
<p>Градиент — это производная в одной конкретной точке, и он верен только рядом с ней. Достаточно сделать шаг, и сеть меняется качественно: часть нейронов закрывается, часть открывается, и производные пересчитываются заново.</p><p>Поэтому шаг делают небольшим и повторяют — 1260 раз за наше обучение. Слишком длинный шаг перепрыгивает минимум: при η = 3 потеря на том же батче станет 2,9051, хуже, чем была до шага.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<p>
  Шаг мы уже сделали: потеря упала с 2,1416 до 1,4731. То же разложение даёт и обещание про величину —
  если шагнуть на η против градиента, потеря должна упасть примерно на
  <span class="math-inline" data-tex="\eta\,\|g\|^2"></span>. Сравним с тем, что вышло.
  Норма градиента 1,8510, значит
  <span class="math-inline" data-tex="\|g\|^2 = 3{,}4260"></span>, и при η = 0,3 линейный прогноз
  такой:
</p>

<div class="math-display" data-tex="2{,}1416 - 0{,}3\cdot 3{,}4260 \;=\; 1{,}1138 \qquad \text{против настоящих } 1{,}4731"></div>

<p>
  Прогноз оказался слишком оптимистичным — и это важная деталь, а не погрешность. Разложение Тейлора
  описывает поверхность потери прямой линией, а она изогнута: чем дальше уходим, тем сильнее
  настоящая потеря отклоняется от касательной вверх. Именно поэтому η нельзя выбрать формулой,
  а слишком большой шаг делает хуже, чем было. Посмотреть на изгиб можно прямо: посчитаем потерю
  нашего батча для разных длин шага в уже известном направлении, то есть построим срез
  <span class="math-inline" data-tex="L(\theta - t\,\nabla L)"></span> вдоль антиградиента.
</p>

<p>Посмотрим пошагово, что даёт один шаг из точки, в которой мы стоим.</p>

<div class="stage" id="stageSP" tabindex="0">
  <div class="stage-figure">
<svg id="sp" viewBox="0 0 960 480" role="img" aria-label="Срез потери вдоль направления против градиента и вероятности верного класса до и после шага">
  <style>
    #sp { font-family: Helvetica, Arial, sans-serif; }
    #sp .lbl { font-size: 16px; fill: #111111; }
    #sp .cap { font-size: 13px; fill: #5E5850; }
    #sp .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #sp .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #sp .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #sp .legend { font-size: 13px; fill: #5E5850; }
    #sp .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="sp-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="sp-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="sp-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<g data-key="axes">
<line x1="80" y1="400" x2="600" y2="400" stroke="#5E5850" stroke-width="1.2"/>
<line x1="80" y1="70" x2="80" y2="400" stroke="#5E5850" stroke-width="1.2"/>
<line x1="80.0" y1="400" x2="80.0" y2="405" stroke="#5E5850" stroke-width="1"/>
<text x="80.0" y="420" class="cap" text-anchor="middle">0,0</text>
<line x1="166.7" y1="400" x2="166.7" y2="405" stroke="#5E5850" stroke-width="1"/>
<text x="166.7" y="420" class="cap" text-anchor="middle">0,5</text>
<line x1="253.3" y1="400" x2="253.3" y2="405" stroke="#5E5850" stroke-width="1"/>
<text x="253.3" y="420" class="cap" text-anchor="middle">1,0</text>
<line x1="340.0" y1="400" x2="340.0" y2="405" stroke="#5E5850" stroke-width="1"/>
<text x="340.0" y="420" class="cap" text-anchor="middle">1,5</text>
<line x1="426.7" y1="400" x2="426.7" y2="405" stroke="#5E5850" stroke-width="1"/>
<text x="426.7" y="420" class="cap" text-anchor="middle">2,0</text>
<line x1="513.3" y1="400" x2="513.3" y2="405" stroke="#5E5850" stroke-width="1"/>
<text x="513.3" y="420" class="cap" text-anchor="middle">2,5</text>
<line x1="600.0" y1="400" x2="600.0" y2="405" stroke="#5E5850" stroke-width="1"/>
<text x="600.0" y="420" class="cap" text-anchor="middle">3,0</text>
<line x1="75" y1="400.0" x2="80" y2="400.0" stroke="#5E5850" stroke-width="1"/>
<text x="70" y="404.0" class="cap" text-anchor="end">1,0</text>
<line x1="75" y1="317.5" x2="80" y2="317.5" stroke="#5E5850" stroke-width="1"/>
<text x="70" y="321.5" class="cap" text-anchor="end">1,5</text>
<line x1="75" y1="235.0" x2="80" y2="235.0" stroke="#5E5850" stroke-width="1"/>
<text x="70" y="239.0" class="cap" text-anchor="end">2,0</text>
<line x1="75" y1="152.5" x2="80" y2="152.5" stroke="#5E5850" stroke-width="1"/>
<text x="70" y="156.5" class="cap" text-anchor="end">2,5</text>
<line x1="75" y1="70.0" x2="80" y2="70.0" stroke="#5E5850" stroke-width="1"/>
<text x="70" y="74.0" class="cap" text-anchor="end">3,0</text>
<text x="340" y="440" class="cap" text-anchor="middle">длина шага η</text>
<text x="34" y="56" class="cap">потеря батча</text>
</g>
<g data-key="curve">
<polyline points="80.0,211.6 88.7,237.8 97.3,259.2 106.0,278.3 114.7,295.3 123.3,309.2 132.0,321.9 140.7,333.0 149.3,342.7 158.0,351.0 166.7,358.4 175.3,364.5 184.0,369.7 192.7,373.8 201.3,377.3 210.0,380.1 218.7,382.1 227.3,383.5 236.0,384.3 244.7,384.3 253.3,383.6 262.0,382.1 270.7,380.0 279.3,377.5 288.0,374.5 296.7,371.2 305.3,367.5 314.0,363.5 322.7,359.1 331.3,354.3 340.0,349.1 348.7,343.4 357.3,337.4 366.0,331.2 374.7,324.7 383.3,317.9 392.0,310.9 400.7,303.7 409.3,296.2 418.0,288.6 426.7,280.7 435.3,272.6 444.0,264.4 452.7,255.9 461.3,247.2 470.0,238.3 478.7,229.3 487.3,220.1 496.0,210.7 504.7,201.1 513.3,191.4 522.0,181.5 530.7,171.4 539.3,161.2 548.0,150.9 556.7,140.4 565.3,129.7 574.0,118.9 582.7,108.0 591.3,96.9 600.0,85.7" fill="none" stroke="#3576C0" stroke-width="2.2"/>
</g>
<g data-key="start" data-only="1">
<circle cx="80.0" cy="211.6" r="5" fill="#5E5850"/><text x="80.0" y="197.6" class="cap" text-anchor="start" fill="#5E5850">старт: 2,1416</text>

</g>
<g data-key="eta03" data-only="1">
<circle cx="132.0" cy="321.9" r="5" fill="#73B222"/><text x="132.0" y="307.9" class="cap" text-anchor="middle" fill="#73B222">η = 0,3 → 1,4731</text>
<line x1="80.0" y1="211.6" x2="132.0" y2="321.9" stroke="#73B222" stroke-width="1.6" stroke-dasharray="5 4"/>
</g>
<g data-key="best" data-only="1">
<circle cx="244.7" cy="384.3" r="5" fill="#C29E08"/><text x="244.7" y="368.3" class="cap" text-anchor="middle" fill="#C29E08">минимум среза: η = 0,95 → 1,0952</text>
</g>
<g data-key="big" data-only="1">
<circle cx="600.0" cy="85.7" r="5" fill="#C30B0A"/><text x="600.0" y="71.7" class="cap" text-anchor="end" fill="#C30B0A">η = 3 → 2,9051</text>
<text x="590" y="96" class="cap" text-anchor="end" fill="#C30B0A">хуже, чем было до шага</text>
</g>
<g data-key="probs">
<text x="640" y="66" class="cap">вероятность верного класса</text>
<text x="640" y="114" class="cap">цифра 3</text>
<rect x="700" y="98" width="80.4" height="16" fill="#5E5850" fill-opacity="0.45" stroke="#5E5850" stroke-width="1"/>
<text x="788.4" y="111" class="cap">0,1488</text>
<rect x="700" y="120" width="105.1" height="16" fill="#73B222" fill-opacity="0.6" stroke="#73B222" stroke-width="1"/>
<text x="813.1" y="133" class="cap">0,1947</text>
<text x="640" y="188" class="cap">цифра 5</text>
<rect x="700" y="172" width="74.6" height="16" fill="#5E5850" fill-opacity="0.45" stroke="#5E5850" stroke-width="1"/>
<text x="782.6" y="185" class="cap">0,1381</text>
<rect x="700" y="194" width="177.3" height="16" fill="#73B222" fill-opacity="0.6" stroke="#73B222" stroke-width="1"/>
<text x="885.3" y="207" class="cap">0,3284</text>
<text x="640" y="262" class="cap">цифра 2</text>
<rect x="700" y="246" width="59.3" height="16" fill="#5E5850" fill-opacity="0.45" stroke="#5E5850" stroke-width="1"/>
<text x="767.3" y="259" class="cap">0,1099</text>
<rect x="700" y="268" width="100.4" height="16" fill="#73B222" fill-opacity="0.6" stroke="#73B222" stroke-width="1"/>
<text x="808.4" y="281" class="cap">0,1859</text>
<text x="640" y="336" class="cap">цифра 8</text>
<rect x="700" y="320" width="45.5" height="16" fill="#5E5850" fill-opacity="0.45" stroke="#5E5850" stroke-width="1"/>
<text x="753.5" y="333" class="cap">0,0843</text>
<rect x="700" y="342" width="125.4" height="16" fill="#73B222" fill-opacity="0.6" stroke="#73B222" stroke-width="1"/>
<text x="833.4" y="355" class="cap">0,2323</text>
<text x="640" y="386" class="cap">серое — до шага, зелёное — после</text>
<text x="640" y="404" class="cap">одного шага при η = 0,3</text>
</g>
<g data-key="rule">
<rect x="640" y="440" width="290" height="0.1" fill="none" stroke="none"/>
<foreignObject x="640" y="434" width="300" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\theta \leftarrow \theta - \eta\, \dfrac{\partial L}{\partial \theta}"></div></foreignObject>
</g>
<text x="40" y="468" class="legend">синяя кривая — как меняется потеря батча, если шагнуть на η против градиента</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="axes curve rule" data-focus="rule">
      <div class="step-kicker">Шаг 1 · правило шага</div>
      <h4>Из каждого числа вычитаем его производную, умноженную на η</h4>
<p>Градиент показывает направление наискорейшего роста потери, поэтому идём в противоположную сторону. Все 2410 параметров обновляются одновременно и по одной и той же формуле — ни у весов, ни у смещений нет привилегий.</p>
    </div>
    <div class="step-panel" data-on="axes curve rule start" data-focus="start">
      <div class="step-kicker">Шаг 2 · срез вдоль направления</div>
      <h4>Что будет, если шагнуть на разную длину</h4>
<p>Синяя кривая — это настоящая потеря нашего батча, посчитанная для шагов от 0 до 3 с интервалом 0,05. Слева она круто падает, потом выполаживается, а после единицы начинает расти: направление верное, но идти по нему бесконечно нельзя.</p>
    </div>
    <div class="step-panel" data-on="axes curve rule start eta03 probs" data-focus="eta03">
      <div class="step-kicker">Шаг 3 · наш шаг</div>
      <h4>η = 0,3 роняет потерю с 2,1416 до 1,4731</h4>
<p>Один шаг по четырём картинкам — и вероятность верного класса у второй картинки выросла с 0,1381 до 0,3284, а у четвёртой с 0,0843 до 0,2323. Сеть не «выучила пятёрку», она просто чуть-чуть повернулась в сторону этих четырёх примеров.</p>
    </div>
    <div class="step-panel" data-on="axes curve rule start eta03 best" data-focus="best">
      <div class="step-kicker">Шаг 4 · а почему не сразу в минимум</div>
      <h4>Лучший шаг для этого батча — 0,95, и брать его не надо</h4>
<p>Минимум среза даёт потерю 1,0952 — вдвое меньше стартовой. Но это минимум по четырём картинкам, а не по всем 1347. Прыгнув туда, мы идеально подстроились бы под случайную четвёрку и испортили то, что уже знали. Маленький шаг — это способ доверять каждому батчу лишь чуть-чуть.</p>
    </div>
    <div class="step-panel" data-on="axes curve rule start big" data-focus="big">
      <div class="step-kicker">Шаг 5 · слишком длинный шаг</div>
      <h4>η = 3 даёт 2,9051 — хуже, чем до шага</h4>
<p>Направление осталось правильным, но мы перелетели долину и вылезли на противоположный склон. Именно так выглядит расходящееся обучение: потеря не просто перестаёт падать, а растёт от шага к шагу.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout-red">
  <strong>Соблазн, которому нельзя поддаваться:</strong> длину шага 0,95 можно найти точным поиском
  и получить на этом батче потерю 1,0952 вместо 1,4731. Но батч из четырёх картинок — не выборка,
  а её случайная тень. Идеально подстроившись под четыре примера, мы сломали бы то, что уже
  выучили по остальным 1343. Осторожный шаг — это способ доверять каждому батчу лишь отчасти.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> направление даёт обратный проход, а длину — вы сами,
  и цена ошибки несимметрична: слишком маленький η означает медленное обучение, слишком большой —
  что обучения не будет вообще.
</div>

---

## Часть 9. Цикл: батчи, эпохи, перемешивание

<p>
  Всё, что нужно для обучения, уже собрано. Осталось замкнуть цикл: взять батч, посчитать прямой
  проход, потерю, обратный проход, сдвинуть параметры — и повторить. Полный цикл обучения
  умещается в семь строк:
</p>

<pre><code>for ep in range(1, epochs + 1):
    order = rng.permutation(n)                   # перемешали картинки
    for i in range(n // B):
        idx = order[i*B : (i+1)*B if i &lt; n//B - 1 else n]
        Xb, Yb = Xtr[idx], Ytr[idx]
        Z1, A1, Z2, P = forward(Xb)              # прямой проход
        dZ2 = (P - Yb) / len(idx)                # обратный проход
        dW2, db2 = A1.T @ dZ2, dZ2.sum(0)
        dZ1 = (dZ2 @ W2.T) * (Z1 &gt; 0)
        dW1, db1 = Xb.T @ dZ1, dZ1.sum(0)
        W1 -= eta*dW1; b1 -= eta*db1             # шаг спуска
        W2 -= eta*dW2; b2 -= eta*db2</code></pre>

<p>
  Три слова, которые часто путают. <strong>Шаг</strong> — одно обновление параметров по одному батчу.
  <strong>Эпоха</strong> — один проход по всем обучающим картинкам, у нас это 42 шага.
  <strong>Батч</strong> — сколько картинок участвует в одном шаге; у нас 32, а последний батч эпохи
  забирает остаток и получается из 35 картинок.
</p>

<div class="callout-blue">
  <strong>Зачем перемешивать перед каждой эпохой:</strong> без этого сеть будет получать одни и те же
  42 градиента в одном и том же порядке — и подстраиваться под порядок, а не под данные.
  Перемешивание стоит одну строку, а разница на данных, отсортированных по классам, — 16 процентных
  пунктов точности.
</div>

<p class="console-title">Обучение · настоящий вывод скрипта</p>
<div class="console"><span class="cmd">$ python3 mnist8.py</span>
параметров: 2410
эпоха   1   потеря 0.5712   на обучении 89.83%   на отложенной 88.44%
эпоха   2   потеря 0.3420   на обучении 90.50%   на отложенной 91.56%
эпоха   3   потеря 0.2078   на обучении 94.58%   на отложенной 93.56%
эпоха   5   потеря 0.1294   на обучении 97.40%   на отложенной 95.56%
эпоха  10   потеря 0.1044   на обучении 97.10%   на отложенной 94.89%
эпоха  15   потеря 0.0567   на обучении 99.11%   на отложенной 97.11%
эпоха  20   потеря 0.0484   на обучении 99.33%   на отложенной 97.11%
эпоха  25   потеря 0.0347   на обучении 99.55%   на отложенной 97.33%
эпоха  30   потеря 0.0266   на обучении 99.78%   на отложенной 97.78%

<span class="chi">точность на отложенной выборке: 97.78% (10 ошибок из 450)</span>
</div>

<p>
  Обратите внимание на первую строчку: 42 шага — и точность 88,44 %. Основная часть качества
  набирается почти сразу, а последние два процента стоят двадцати пяти эпох.
</p>

<p>Посмотрим пошагово, как выглядит обучение целиком.</p>

<div class="stage" id="stageTR" tabindex="0">
  <div class="stage-figure">
<svg id="tr" viewBox="0 0 960 540" role="img" aria-label="Лента батчей одной эпохи и кривые потери и точности по тридцати эпохам">
  <style>
    #tr { font-family: Helvetica, Arial, sans-serif; }
    #tr .lbl { font-size: 16px; fill: #111111; }
    #tr .cap { font-size: 13px; fill: #5E5850; }
    #tr .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #tr .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #tr .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #tr .legend { font-size: 13px; fill: #5E5850; }
    #tr .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="tr-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="tr-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="tr-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<g data-key="tape">
<text x="40" y="62" class="cap">одна эпоха = 42 батча = 42 шага спуска</text>
<rect x="40" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="51" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="62" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="73" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="84" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="95" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="106" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="117" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="128" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="139" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="150" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="161" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="172" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="183" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="194" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="205" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="216" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="227" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="238" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="249" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="260" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="271" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="282" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="293" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="304" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="315" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="326" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="337" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="348" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="359" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="370" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="381" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="392" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="403" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="414" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="425" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="436" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="447" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="458" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="469" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="480" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<rect x="491" y="72" width="9" height="22" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="0.8"/>
<text x="520" y="90" class="cap">× 30 эпох = 1260 шагов</text>
</g>
<g data-key="shuf" data-only="1">
<text x="40" y="116" class="cap" fill="#C30B0A">перед каждой эпохой порядок 1347 картинок перемешивается заново — батчи каждый раз новые</text>
</g>
<g data-key="lossax">
<text x="70" y="156" class="cap">потеря</text>
<line x1="70" y1="420" x2="450" y2="420" stroke="#5E5850" stroke-width="1.2"/>
<line x1="70" y1="170" x2="70" y2="420" stroke="#5E5850" stroke-width="1.2"/>
<text x="62" y="424.0" class="cap" text-anchor="end">0,0</text>
<line x1="70" y1="420.0" x2="450" y2="420.0" stroke="#EFECE3" stroke-width="1"/>
<text x="62" y="347.1" class="cap" text-anchor="end">0,2</text>
<line x1="70" y1="343.1" x2="450" y2="343.1" stroke="#EFECE3" stroke-width="1"/>
<text x="62" y="270.2" class="cap" text-anchor="end">0,4</text>
<line x1="70" y1="266.2" x2="450" y2="266.2" stroke="#EFECE3" stroke-width="1"/>
<text x="62" y="193.2" class="cap" text-anchor="end">0,6</text>
<line x1="70" y1="189.2" x2="450" y2="189.2" stroke="#EFECE3" stroke-width="1"/>
<text x="70.0" y="438" class="cap" text-anchor="middle">1</text>
<text x="187.9" y="438" class="cap" text-anchor="middle">10</text>
<text x="319.0" y="438" class="cap" text-anchor="middle">20</text>
<text x="450.0" y="438" class="cap" text-anchor="middle">30</text>
<text x="260" y="458" class="cap" text-anchor="middle">эпоха</text>
</g>
<g data-key="ltr"><polyline points="70.0,200.3 83.1,288.5 96.2,340.1 109.3,354.3 122.4,370.2 135.5,366.2 148.6,381.1 161.7,382.6 174.8,373.7 187.9,379.8 201.0,384.7 214.1,389.5 227.2,394.8 240.3,396.5 253.4,398.2 266.6,399.8 279.7,395.3 292.8,401.5 305.9,403.2 319.0,401.4 332.1,402.3 345.2,405.3 358.3,406.3 371.4,406.7 384.5,406.7 397.6,407.1 410.7,408.5 423.8,408.7 436.9,409.0 450.0,409.8" fill="none" stroke="#3576C0" stroke-width="2.2"/><text x="220" y="387" class="cap" fill="#3576C0">на обучающей</text></g>
<g data-key="lte"><polyline points="70.0,192.1 83.1,283.4 96.2,322.9 109.3,342.8 122.4,354.5 135.5,344.6 148.6,364.1 161.7,368.3 174.8,348.3 187.9,355.8 201.0,365.3 214.1,376.2 227.2,375.8 240.3,377.3 253.4,379.0 266.6,378.4 279.7,378.0 292.8,380.4 305.9,382.5 319.0,381.3 332.1,383.2 345.2,379.8 358.3,380.0 371.4,383.8 384.5,385.3 397.6,379.8 410.7,383.0 423.8,382.3 436.9,382.6 450.0,384.6" fill="none" stroke="#C30B0A" stroke-width="2.2" stroke-dasharray="6 4"/><text x="320" y="355" class="cap" fill="#C30B0A">на отложенной</text></g>
<g data-key="accax">
<text x="560" y="156" class="cap">точность, %</text>
<line x1="560" y1="420" x2="930" y2="420" stroke="#5E5850" stroke-width="1.2"/>
<line x1="560" y1="170" x2="560" y2="420" stroke="#5E5850" stroke-width="1.2"/>
<text x="552" y="424.0" class="cap" text-anchor="end">85</text>
<line x1="560" y1="420.0" x2="930" y2="420.0" stroke="#EFECE3" stroke-width="1"/>
<text x="552" y="340.7" class="cap" text-anchor="end">90</text>
<line x1="560" y1="336.7" x2="930" y2="336.7" stroke="#EFECE3" stroke-width="1"/>
<text x="552" y="257.3" class="cap" text-anchor="end">95</text>
<line x1="560" y1="253.3" x2="930" y2="253.3" stroke="#EFECE3" stroke-width="1"/>
<text x="552" y="174.0" class="cap" text-anchor="end">100</text>
<line x1="560" y1="170.0" x2="930" y2="170.0" stroke="#EFECE3" stroke-width="1"/>
<text x="560.0" y="438" class="cap" text-anchor="middle">1</text>
<text x="674.8" y="438" class="cap" text-anchor="middle">10</text>
<text x="802.4" y="438" class="cap" text-anchor="middle">20</text>
<text x="930.0" y="438" class="cap" text-anchor="middle">30</text>
<text x="745" y="458" class="cap" text-anchor="middle">эпоха</text>
</g>
<g data-key="atr"><polyline points="560.0,339.5 572.8,328.3 585.5,260.3 598.3,249.2 611.0,213.3 623.8,236.8 636.6,204.7 649.3,212.0 662.1,234.3 674.8,218.3 687.6,209.7 700.3,204.7 713.1,188.5 725.9,188.5 738.6,184.8 751.4,182.3 764.1,194.7 776.9,183.7 789.7,178.7 802.4,181.2 815.2,181.2 827.9,177.5 840.7,176.2 853.4,178.7 866.2,177.5 879.0,176.2 891.7,175.0 904.5,173.7 917.2,175.0 930.0,173.7" fill="none" stroke="#3576C0" stroke-width="2.2"/></g>
<g data-key="ate"><polyline points="560.0,362.7 572.8,310.7 585.5,277.3 598.3,247.8 611.0,244.0 623.8,273.7 636.6,233.0 649.3,233.0 662.1,262.7 674.8,255.2 687.6,236.7 700.3,214.5 713.1,225.5 725.9,210.7 738.6,218.2 751.4,218.2 764.1,218.2 776.9,214.5 789.7,207.0 802.4,218.2 815.2,221.8 827.9,210.7 840.7,214.5 853.4,214.5 866.2,214.5 879.0,225.5 891.7,210.7 904.5,210.7 917.2,214.5 930.0,207.0" fill="none" stroke="#73B222" stroke-width="2.2"/><text x="924" y="260" class="cap" text-anchor="end" fill="#73B222">на отложенной: 97,78 %</text></g>
<g data-key="first" data-only="1">
<circle cx="560.0" cy="362.7" r="5" fill="#C30B0A"/>
<text x="570.0" y="354.7" class="cap" fill="#C30B0A">после первой эпохи уже 88,44 %</text>
</g>
<g data-key="gap" data-only="1">
<text x="80" y="192" class="cap" fill="#C30B0A">красная кривая идёт выше синей:</text>
<text x="80" y="210" class="cap" fill="#C30B0A">на новых картинках сеть всегда хуже</text>
</g>
<text x="40" y="530" class="legend">синий — обучающая выборка · красный и зелёный — отложенная, которую сеть не видела</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="tape" data-focus="tape">
      <div class="step-kicker">Шаг 1 · из чего состоит обучение</div>
      <h4>Шаг, батч, эпоха — три разных слова</h4>
<p>Шаг — это один цикл «прямой проход → потеря → обратный проход → обновление» на одном батче. 1347 картинок при батче 32 дают 42 шага; последний батч забирает остаток и получается чуть больше. Проход по всем картинкам ровно один раз называется эпохой.</p>
    </div>
    <div class="step-panel" data-on="tape shuf" data-focus="shuf">
      <div class="step-kicker">Шаг 2 · перемешивание</div>
      <h4>Каждую эпоху состав батчей новый</h4>
<p>Если порядок не менять, сеть каждую эпоху будет получать одни и те же 42 градиента в одном и том же порядке — и начнёт подстраиваться под порядок. Перемешивание стоит одну строку кода и заметно влияет на результат: на данных, отсортированных по классам, без него точность падает с 97,11 % до 80,67 %.</p>
    </div>
    <div class="step-panel" data-on="tape lossax ltr" data-focus="ltr">
      <div class="step-kicker">Шаг 3 · потеря по эпохам</div>
      <h4>0,5712 после первой эпохи, 0,0266 после тридцатой</h4>
<p>Первая эпоха — это 42 шага, и они снимают потерю с 2,3 до 0,57. Дальше падение замедляется: легко исправляемые ошибки заканчиваются, остаются трудные. Кривая не идеально гладкая — каждая точка меряется после случайного набора батчей.</p>
    </div>
    <div class="step-panel" data-on="tape lossax ltr lte gap" data-focus="lte">
      <div class="step-kicker">Шаг 4 · вторая кривая</div>
      <h4>На отложенной выборке потеря выше — и это нормально</h4>
<p>Красная кривая всё время идёт над синей: на картинках, которых сеть не видела, она ошибается чуть сильнее. Пока обе падают вместе — обучение идёт правильно. Момент, когда синяя продолжит падать, а красная развернётся вверх, — это переобучение, и мы посмотрим на него отдельно.</p>
    </div>
    <div class="step-panel" data-on="tape accax atr ate first" data-focus="first">
      <div class="step-kicker">Шаг 5 · точность</div>
      <h4>88,44 % уже после первой эпохи</h4>
<p>Сорок два шага по 32 картинки — и сеть узнаёт девять цифр из десяти. Так выглядит типичная кривая обучения: большая часть качества набирается в самом начале, а последние проценты стоят десятков эпох.</p>
    </div>
    <div class="step-panel" data-on="tape accax atr ate" data-focus="ate">
      <div class="step-kicker">Шаг 6 · чем всё кончилось</div>
      <h4>97,78 % на отложенной, 99,78 % на обучающей</h4>
<p>К тридцатой эпохе сеть ошибается на 10 картинках из 450. На обучающей выборке ошибок три — она почти выучила её наизусть. Разрыв между двумя числами и есть цена, которую платят за конечный размер данных.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> обучение — это тот же цикл из пяти действий, повторённый
  1260 раз. Ни на одном шаге не происходит ничего, кроме уже разобранного; всё различие между
  необученной и обученной сетью накапливается маленькими сдвигами 2410 чисел.
</div>

---

## Часть 10. Что получилось и на чём сеть ошибается

<p>
  Точность 97,78 % — это одно число, и оно скрывает всё интересное. Полезнее посмотреть на
  <strong>матрицу ошибок</strong>: строка — что было на картинке, столбец — что ответила сеть.
  Диагональ — верные ответы, всё остальное — ошибки, причём видно, какие именно.
</p>

<p class="console-title">Проверка на отложенной выборке · настоящий вывод скрипта</p>
<div class="console"><span class="cmd">$ python3 eval.py</span>
точность: 97.78% (10 ошибок из 450)
матрица ошибок (строка — правда, столбец — ответ сети):
[[45  0  0  0  0  0  0  0  0  0]
 [ 0 45  0  0  0  0  0  0  1  0]
 [ 0  1 43  0  0  0  0  0  0  0]
 [ 0  0  0 45  0  0  0  0  0  1]
 [ 0  0  0  0 43  0  0  0  2  0]
 [ 0  1  0  0  0 45  0  0  0  0]
 [ 0  1  0  0  0  0 44  0  0  0]
 [ 0  0  0  0  0  0  0 45  0  0]
 [ 0  2  0  0  0  0  0  0 41  0]
 [ 0  0  0  0  0  1  0  0  0 44]]

все ошибки:
  цифра 4 → сеть говорит 8 с уверенностью 0.90   (верному классу осталось 0.02)
  цифра 4 → сеть говорит 8 с уверенностью 0.34   (верному классу осталось 0.30)
  цифра 5 → сеть говорит 1 с уверенностью 0.86   (верному классу осталось 0.02)
  цифра 2 → сеть говорит 1 с уверенностью 0.79   (верному классу осталось 0.17)
  цифра 8 → сеть говорит 1 с уверенностью 0.89   (верному классу осталось 0.09)
  цифра 8 → сеть говорит 1 с уверенностью 0.94   (верному классу осталось 0.04)
  цифра 6 → сеть говорит 1 с уверенностью 0.99   (верному классу осталось 0.01)
  цифра 3 → сеть говорит 9 с уверенностью 0.45   (верному классу осталось 0.22)
  цифра 9 → сеть говорит 5 с уверенностью 0.98   (верному классу осталось 0.01)
  цифра 1 → сеть говорит 8 с уверенностью 0.63   (верному классу осталось 0.20)
</div>

<p>
  И ещё одна вещь, которую стоит сделать после обучения, — посмотреть на сами веса. Столбец
  <code>W⁽¹⁾</code> — это 64 числа, ровно столько же, сколько клеток в картинке. Значит, его можно
  свернуть обратно в квадрат 8 × 8 и посмотреть глазами, что нейрон ищет.
</p>

<p>Посмотрим пошагово, что стоит за числом 97,78 %.</p>

<div class="stage" id="stageEV" tabindex="0">
  <div class="stage-figure">
<svg id="ev" viewBox="0 0 960 580" role="img" aria-label="Матрица ошибок, картинки, на которых сеть ошиблась, и веса первого слоя">
  <style>
    #ev { font-family: Helvetica, Arial, sans-serif; }
    #ev .lbl { font-size: 16px; fill: #111111; }
    #ev .cap { font-size: 13px; fill: #5E5850; }
    #ev .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #ev .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #ev .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #ev .legend { font-size: 13px; fill: #5E5850; }
    #ev .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ev-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="ev-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="ev-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<g data-key="mx">
<text x="100" y="80" class="cap">строка — правда · столбец — ответ сети</text>
<text x="114" y="112" class="cap" text-anchor="middle">0</text>
<text x="142" y="112" class="cap" text-anchor="middle">1</text>
<text x="170" y="112" class="cap" text-anchor="middle">2</text>
<text x="198" y="112" class="cap" text-anchor="middle">3</text>
<text x="226" y="112" class="cap" text-anchor="middle">4</text>
<text x="254" y="112" class="cap" text-anchor="middle">5</text>
<text x="282" y="112" class="cap" text-anchor="middle">6</text>
<text x="310" y="112" class="cap" text-anchor="middle">7</text>
<text x="338" y="112" class="cap" text-anchor="middle">8</text>
<text x="366" y="112" class="cap" text-anchor="middle">9</text>
<text x="92" y="140" class="cap" text-anchor="end">0</text>
<rect x="100" y="120" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="114" y="138" text-anchor="middle" font-size="12" fill="#111111">45</text>
<rect x="128" y="120" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="156" y="120" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="184" y="120" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="212" y="120" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="240" y="120" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="268" y="120" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="296" y="120" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="324" y="120" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="352" y="120" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="92" y="168" class="cap" text-anchor="end">1</text>
<rect x="100" y="148" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="128" y="148" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="142" y="166" text-anchor="middle" font-size="12" fill="#111111">45</text>
<rect x="156" y="148" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="184" y="148" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="212" y="148" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="240" y="148" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="268" y="148" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="296" y="148" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="324" y="148" width="28" height="28" fill="#C30B0A" fill-opacity="0.5" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="338" y="166" text-anchor="middle" font-size="12" fill="#111111">1</text>
<rect x="352" y="148" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="92" y="196" class="cap" text-anchor="end">2</text>
<rect x="100" y="176" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="128" y="176" width="28" height="28" fill="#C30B0A" fill-opacity="0.5" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="142" y="194" text-anchor="middle" font-size="12" fill="#111111">1</text>
<rect x="156" y="176" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="170" y="194" text-anchor="middle" font-size="12" fill="#111111">43</text>
<rect x="184" y="176" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="212" y="176" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="240" y="176" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="268" y="176" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="296" y="176" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="324" y="176" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="352" y="176" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="92" y="224" class="cap" text-anchor="end">3</text>
<rect x="100" y="204" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="128" y="204" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="156" y="204" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="184" y="204" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="198" y="222" text-anchor="middle" font-size="12" fill="#111111">45</text>
<rect x="212" y="204" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="240" y="204" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="268" y="204" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="296" y="204" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="324" y="204" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="352" y="204" width="28" height="28" fill="#C30B0A" fill-opacity="0.5" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="366" y="222" text-anchor="middle" font-size="12" fill="#111111">1</text>
<text x="92" y="252" class="cap" text-anchor="end">4</text>
<rect x="100" y="232" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="128" y="232" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="156" y="232" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="184" y="232" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="212" y="232" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="226" y="250" text-anchor="middle" font-size="12" fill="#111111">43</text>
<rect x="240" y="232" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="268" y="232" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="296" y="232" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="324" y="232" width="28" height="28" fill="#C30B0A" fill-opacity="0.5" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="338" y="250" text-anchor="middle" font-size="12" fill="#111111">2</text>
<rect x="352" y="232" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="92" y="280" class="cap" text-anchor="end">5</text>
<rect x="100" y="260" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="128" y="260" width="28" height="28" fill="#C30B0A" fill-opacity="0.5" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="142" y="278" text-anchor="middle" font-size="12" fill="#111111">1</text>
<rect x="156" y="260" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="184" y="260" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="212" y="260" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="240" y="260" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="254" y="278" text-anchor="middle" font-size="12" fill="#111111">45</text>
<rect x="268" y="260" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="296" y="260" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="324" y="260" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="352" y="260" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="92" y="308" class="cap" text-anchor="end">6</text>
<rect x="100" y="288" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="128" y="288" width="28" height="28" fill="#C30B0A" fill-opacity="0.5" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="142" y="306" text-anchor="middle" font-size="12" fill="#111111">1</text>
<rect x="156" y="288" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="184" y="288" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="212" y="288" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="240" y="288" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="268" y="288" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="282" y="306" text-anchor="middle" font-size="12" fill="#111111">44</text>
<rect x="296" y="288" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="324" y="288" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="352" y="288" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="92" y="336" class="cap" text-anchor="end">7</text>
<rect x="100" y="316" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="128" y="316" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="156" y="316" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="184" y="316" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="212" y="316" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="240" y="316" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="268" y="316" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="296" y="316" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="310" y="334" text-anchor="middle" font-size="12" fill="#111111">45</text>
<rect x="324" y="316" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="352" y="316" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="92" y="364" class="cap" text-anchor="end">8</text>
<rect x="100" y="344" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="128" y="344" width="28" height="28" fill="#C30B0A" fill-opacity="0.5" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="142" y="362" text-anchor="middle" font-size="12" fill="#111111">2</text>
<rect x="156" y="344" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="184" y="344" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="212" y="344" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="240" y="344" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="268" y="344" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="296" y="344" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="324" y="344" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="338" y="362" text-anchor="middle" font-size="12" fill="#111111">41</text>
<rect x="352" y="344" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="92" y="392" class="cap" text-anchor="end">9</text>
<rect x="100" y="372" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="128" y="372" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="156" y="372" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="184" y="372" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="212" y="372" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="240" y="372" width="28" height="28" fill="#C30B0A" fill-opacity="0.5" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="254" y="390" text-anchor="middle" font-size="12" fill="#111111">1</text>
<rect x="268" y="372" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="296" y="372" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="324" y="372" width="28" height="28" fill="#FFFFFF" fill-opacity="1" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="352" y="372" width="28" height="28" fill="#73B222" fill-opacity="0.45" stroke="#E0DDD3" stroke-width="0.8"/>
<text x="366" y="390" text-anchor="middle" font-size="12" fill="#111111">44</text>
<rect x="100" y="120" width="280" height="280" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="100" y="424" class="cap">440 картинок из 450 попали на диагональ</text>
</g>
<g data-key="col1" data-only="1">
<rect x="128" y="120" width="28" height="280" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<text x="142" y="446" class="cap" text-anchor="middle" fill="#C30B0A">половина ошибок — ответ «единица»</text>
</g>
<g data-key="errs" data-only="1">
<text x="430" y="80" class="cap">все десять ошибок · под картинкой: правда → ответ и уверенность</text>
<rect x="430" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="120" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="463" y="120" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="474" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="485" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="496" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="131" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="452" y="131" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="463" y="131" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="474" y="131" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="485" y="131" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="496" y="131" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="507" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="142" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="452" y="142" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="463" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="474" y="142" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="485" y="142" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="496" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="153" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="452" y="153" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="463" y="153" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="474" y="153" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="485" y="153" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="496" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="164" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="463" y="164" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="474" y="164" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="485" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="496" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="175" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="463" y="175" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="474" y="175" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="485" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="496" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="186" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="463" y="186" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="474" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="485" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="496" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="197" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="463" y="197" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="474" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="485" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="496" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="430" y1="120" x2="430" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="441" y1="120" x2="441" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="452" y1="120" x2="452" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="463" y1="120" x2="463" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="474" y1="120" x2="474" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="485" y1="120" x2="485" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="496" y1="120" x2="496" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="507" y1="120" x2="507" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="518" y1="120" x2="518" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="120" x2="518" y2="120" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="131" x2="518" y2="131" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="142" x2="518" y2="142" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="153" x2="518" y2="153" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="164" x2="518" y2="164" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="175" x2="518" y2="175" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="186" x2="518" y2="186" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="197" x2="518" y2="197" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="208" x2="518" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="430" y="120" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="474" y="228" text-anchor="middle" font-size="13" fill="#111111">4 → 8</text>
<text x="474" y="246" text-anchor="middle" font-size="12" fill="#C30B0A">0,90</text>
<rect x="534" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="120" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="567" y="120" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="578" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="589" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="600" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="131" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="567" y="131" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="578" y="131" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="589" y="131" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="600" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="142" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="567" y="142" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="578" y="142" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="589" y="142" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="600" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="153" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="567" y="153" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="578" y="153" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="589" y="153" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="600" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="164" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="567" y="164" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="578" y="164" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="589" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="600" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="567" y="175" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="578" y="175" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="589" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="600" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="186" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="567" y="186" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="578" y="186" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="589" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="600" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="197" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="567" y="197" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="578" y="197" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="589" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="600" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="534" y1="120" x2="534" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="545" y1="120" x2="545" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="556" y1="120" x2="556" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="567" y1="120" x2="567" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="578" y1="120" x2="578" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="589" y1="120" x2="589" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="600" y1="120" x2="600" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="611" y1="120" x2="611" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="622" y1="120" x2="622" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="120" x2="622" y2="120" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="131" x2="622" y2="131" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="142" x2="622" y2="142" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="153" x2="622" y2="153" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="164" x2="622" y2="164" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="175" x2="622" y2="175" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="186" x2="622" y2="186" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="197" x2="622" y2="197" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="208" x2="622" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="534" y="120" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="578" y="228" text-anchor="middle" font-size="13" fill="#111111">4 → 8</text>
<text x="578" y="246" text-anchor="middle" font-size="12" fill="#C30B0A">0,34</text>
<rect x="638" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="120" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="660" y="120" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="671" y="120" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="682" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="693" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="704" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="131" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="660" y="131" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="671" y="131" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="682" y="131" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="693" y="131" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="704" y="131" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="715" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="142" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="660" y="142" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="671" y="142" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="682" y="142" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="693" y="142" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="704" y="142" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="715" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="153" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="660" y="153" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="671" y="153" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="682" y="153" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="693" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="704" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="660" y="164" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="671" y="164" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="682" y="164" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="693" y="164" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="704" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="660" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="671" y="175" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="682" y="175" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="693" y="175" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="704" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="660" y="186" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="671" y="186" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="682" y="186" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="693" y="186" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="704" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="660" y="197" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="671" y="197" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="682" y="197" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="693" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="704" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="638" y1="120" x2="638" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="649" y1="120" x2="649" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="660" y1="120" x2="660" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="671" y1="120" x2="671" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="682" y1="120" x2="682" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="693" y1="120" x2="693" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="704" y1="120" x2="704" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="715" y1="120" x2="715" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="726" y1="120" x2="726" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="120" x2="726" y2="120" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="131" x2="726" y2="131" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="142" x2="726" y2="142" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="153" x2="726" y2="153" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="164" x2="726" y2="164" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="175" x2="726" y2="175" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="186" x2="726" y2="186" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="197" x2="726" y2="197" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="208" x2="726" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="638" y="120" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="682" y="228" text-anchor="middle" font-size="13" fill="#111111">5 → 1</text>
<text x="682" y="246" text-anchor="middle" font-size="12" fill="#C30B0A">0,86</text>
<rect x="742" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="775" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="786" y="120" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="797" y="120" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="808" y="120" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="819" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="775" y="131" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="786" y="131" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="797" y="131" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="808" y="131" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="819" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="775" y="142" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="786" y="142" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="797" y="142" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="808" y="142" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="819" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="775" y="153" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="786" y="153" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="797" y="153" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="808" y="153" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="819" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="164" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="764" y="164" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="775" y="164" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="786" y="164" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="797" y="164" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="808" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="819" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="175" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="764" y="175" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="775" y="175" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="786" y="175" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="797" y="175" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="808" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="819" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="186" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="764" y="186" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="775" y="186" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="786" y="186" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="797" y="186" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="808" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="819" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="775" y="197" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="786" y="197" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="797" y="197" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="808" y="197" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="819" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="742" y1="120" x2="742" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="753" y1="120" x2="753" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="764" y1="120" x2="764" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="775" y1="120" x2="775" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="786" y1="120" x2="786" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="797" y1="120" x2="797" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="808" y1="120" x2="808" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="819" y1="120" x2="819" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="830" y1="120" x2="830" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="120" x2="830" y2="120" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="131" x2="830" y2="131" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="142" x2="830" y2="142" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="153" x2="830" y2="153" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="164" x2="830" y2="164" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="175" x2="830" y2="175" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="186" x2="830" y2="186" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="197" x2="830" y2="197" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="208" x2="830" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="742" y="120" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="786" y="228" text-anchor="middle" font-size="13" fill="#111111">2 → 1</text>
<text x="786" y="246" text-anchor="middle" font-size="12" fill="#C30B0A">0,79</text>
<rect x="846" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="879" y="120" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="890" y="120" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="901" y="120" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="912" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="120" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="131" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="879" y="131" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="890" y="131" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="901" y="131" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="912" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="131" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="142" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="868" y="142" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="879" y="142" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="890" y="142" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="901" y="142" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="912" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="142" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="153" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="868" y="153" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="879" y="153" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="890" y="153" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="901" y="153" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="912" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="153" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="164" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="868" y="164" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="879" y="164" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="890" y="164" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="901" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="912" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="164" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="879" y="175" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="890" y="175" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="901" y="175" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="912" y="175" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="923" y="175" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="879" y="186" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="890" y="186" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="901" y="186" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="912" y="186" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="923" y="186" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="879" y="197" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="890" y="197" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="901" y="197" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="912" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="197" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="846" y1="120" x2="846" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="857" y1="120" x2="857" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="868" y1="120" x2="868" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="879" y1="120" x2="879" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="890" y1="120" x2="890" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="901" y1="120" x2="901" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="912" y1="120" x2="912" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="923" y1="120" x2="923" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="934" y1="120" x2="934" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="120" x2="934" y2="120" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="131" x2="934" y2="131" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="142" x2="934" y2="142" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="153" x2="934" y2="153" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="164" x2="934" y2="164" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="175" x2="934" y2="175" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="186" x2="934" y2="186" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="197" x2="934" y2="197" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="208" x2="934" y2="208" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="846" y="120" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="890" y="228" text-anchor="middle" font-size="13" fill="#111111">8 → 1</text>
<text x="890" y="246" text-anchor="middle" font-size="12" fill="#C30B0A">0,89</text>
<rect x="430" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="292" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="463" y="292" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="474" y="292" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="485" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="496" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="303" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="463" y="303" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="474" y="303" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="485" y="303" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="496" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="314" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="452" y="314" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="463" y="314" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="474" y="314" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="485" y="314" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="496" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="325" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="452" y="325" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="463" y="325" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="474" y="325" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="485" y="325" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="496" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="336" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="452" y="336" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="463" y="336" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="474" y="336" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="485" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="496" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="347" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="463" y="347" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="474" y="347" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="485" y="347" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="496" y="347" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="507" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="430" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="358" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="463" y="358" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="474" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="485" y="358" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="496" y="358" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="507" y="358" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="430" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="441" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="452" y="369" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="463" y="369" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="474" y="369" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="485" y="369" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="496" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="507" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="430" y1="292" x2="430" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="441" y1="292" x2="441" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="452" y1="292" x2="452" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="463" y1="292" x2="463" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="474" y1="292" x2="474" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="485" y1="292" x2="485" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="496" y1="292" x2="496" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="507" y1="292" x2="507" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="518" y1="292" x2="518" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="292" x2="518" y2="292" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="303" x2="518" y2="303" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="314" x2="518" y2="314" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="325" x2="518" y2="325" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="336" x2="518" y2="336" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="347" x2="518" y2="347" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="358" x2="518" y2="358" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="369" x2="518" y2="369" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="380" x2="518" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="430" y="292" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="474" y="400" text-anchor="middle" font-size="13" fill="#111111">8 → 1</text>
<text x="474" y="418" text-anchor="middle" font-size="12" fill="#C30B0A">0,94</text>
<rect x="534" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="567" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="578" y="292" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="589" y="292" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="600" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="567" y="303" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="578" y="303" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="589" y="303" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="600" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="567" y="314" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="578" y="314" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="589" y="314" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="600" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="611" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="325" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="567" y="325" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="578" y="325" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="589" y="325" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="600" y="325" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="611" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="336" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="567" y="336" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="578" y="336" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="589" y="336" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="600" y="336" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="611" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="347" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="567" y="347" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="578" y="347" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="589" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="600" y="347" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="611" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="358" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="567" y="358" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="578" y="358" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="589" y="358" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="600" y="358" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="611" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="534" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="545" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="556" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="567" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="578" y="369" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="589" y="369" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="600" y="369" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="611" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="534" y1="292" x2="534" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="545" y1="292" x2="545" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="556" y1="292" x2="556" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="567" y1="292" x2="567" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="578" y1="292" x2="578" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="589" y1="292" x2="589" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="600" y1="292" x2="600" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="611" y1="292" x2="611" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="622" y1="292" x2="622" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="292" x2="622" y2="292" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="303" x2="622" y2="303" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="314" x2="622" y2="314" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="325" x2="622" y2="325" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="336" x2="622" y2="336" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="347" x2="622" y2="347" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="358" x2="622" y2="358" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="369" x2="622" y2="369" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="380" x2="622" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="534" y="292" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="578" y="400" text-anchor="middle" font-size="13" fill="#111111">6 → 1</text>
<text x="578" y="418" text-anchor="middle" font-size="12" fill="#C30B0A">0,99</text>
<rect x="638" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="660" y="292" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="671" y="292" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="682" y="292" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="693" y="292" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="704" y="292" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="715" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="303" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="660" y="303" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="671" y="303" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="682" y="303" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="693" y="303" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="704" y="303" width="11" height="11" fill="rgb(64,64,64)"/>
<rect x="715" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="314" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="660" y="314" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="671" y="314" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="682" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="693" y="314" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="704" y="314" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="715" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="660" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="671" y="325" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="682" y="325" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="693" y="325" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="704" y="325" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="715" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="660" y="336" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="671" y="336" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="682" y="336" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="693" y="336" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="704" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="660" y="347" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="671" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="682" y="347" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="693" y="347" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="704" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="660" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="671" y="358" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="682" y="358" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="693" y="358" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="704" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="638" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="649" y="369" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="660" y="369" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="671" y="369" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="682" y="369" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="693" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="704" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="715" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="638" y1="292" x2="638" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="649" y1="292" x2="649" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="660" y1="292" x2="660" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="671" y1="292" x2="671" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="682" y1="292" x2="682" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="693" y1="292" x2="693" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="704" y1="292" x2="704" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="715" y1="292" x2="715" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="726" y1="292" x2="726" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="292" x2="726" y2="292" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="303" x2="726" y2="303" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="314" x2="726" y2="314" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="325" x2="726" y2="325" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="336" x2="726" y2="336" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="347" x2="726" y2="347" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="358" x2="726" y2="358" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="369" x2="726" y2="369" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="380" x2="726" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="638" y="292" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="682" y="400" text-anchor="middle" font-size="13" fill="#111111">3 → 9</text>
<text x="682" y="418" text-anchor="middle" font-size="12" fill="#C30B0A">0,45</text>
<rect x="742" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="292" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="775" y="292" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="786" y="292" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="797" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="808" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="819" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="303" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="764" y="303" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="775" y="303" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="786" y="303" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="797" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="808" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="819" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="314" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="764" y="314" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="775" y="314" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="786" y="314" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="797" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="808" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="819" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="325" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="764" y="325" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="775" y="325" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="786" y="325" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="797" y="325" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="808" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="819" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="336" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="775" y="336" width="11" height="11" fill="rgb(191,191,191)"/>
<rect x="786" y="336" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="797" y="336" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="808" y="336" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="819" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="775" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="786" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="797" y="347" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="808" y="347" width="11" height="11" fill="rgb(159,159,159)"/>
<rect x="819" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="358" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="775" y="358" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="786" y="358" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="797" y="358" width="11" height="11" fill="rgb(112,112,112)"/>
<rect x="808" y="358" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="819" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="742" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="753" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="764" y="369" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="775" y="369" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="786" y="369" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="797" y="369" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="808" y="369" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="819" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="742" y1="292" x2="742" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="753" y1="292" x2="753" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="764" y1="292" x2="764" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="775" y1="292" x2="775" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="786" y1="292" x2="786" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="797" y1="292" x2="797" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="808" y1="292" x2="808" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="819" y1="292" x2="819" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="830" y1="292" x2="830" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="292" x2="830" y2="292" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="303" x2="830" y2="303" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="314" x2="830" y2="314" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="325" x2="830" y2="325" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="336" x2="830" y2="336" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="347" x2="830" y2="347" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="358" x2="830" y2="358" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="369" x2="830" y2="369" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="742" y1="380" x2="830" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="742" y="292" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="786" y="400" text-anchor="middle" font-size="13" fill="#111111">9 → 5</text>
<text x="786" y="418" text-anchor="middle" font-size="12" fill="#C30B0A">0,98</text>
<rect x="846" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="879" y="292" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="890" y="292" width="11" height="11" fill="rgb(96,96,96)"/>
<rect x="901" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="912" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="292" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="303" width="11" height="11" fill="rgb(207,207,207)"/>
<rect x="868" y="303" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="879" y="303" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="890" y="303" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="901" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="912" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="303" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="314" width="11" height="11" fill="rgb(223,223,223)"/>
<rect x="857" y="314" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="868" y="314" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="879" y="314" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="890" y="314" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="901" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="912" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="314" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="325" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="857" y="325" width="11" height="11" fill="rgb(80,80,80)"/>
<rect x="868" y="325" width="11" height="11" fill="rgb(32,32,32)"/>
<rect x="879" y="325" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="890" y="325" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="901" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="912" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="325" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="336" width="11" height="11" fill="rgb(128,128,128)"/>
<rect x="879" y="336" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="890" y="336" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="901" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="912" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="336" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="347" width="11" height="11" fill="rgb(143,143,143)"/>
<rect x="879" y="347" width="11" height="11" fill="rgb(0,0,0)"/>
<rect x="890" y="347" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="901" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="912" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="347" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="358" width="11" height="11" fill="rgb(239,239,239)"/>
<rect x="879" y="358" width="11" height="11" fill="rgb(16,16,16)"/>
<rect x="890" y="358" width="11" height="11" fill="rgb(175,175,175)"/>
<rect x="901" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="912" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="358" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="846" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="857" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="868" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="879" y="369" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="890" y="369" width="11" height="11" fill="rgb(48,48,48)"/>
<rect x="901" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="912" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<rect x="923" y="369" width="11" height="11" fill="rgb(255,255,255)"/>
<line x1="846" y1="292" x2="846" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="857" y1="292" x2="857" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="868" y1="292" x2="868" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="879" y1="292" x2="879" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="890" y1="292" x2="890" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="901" y1="292" x2="901" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="912" y1="292" x2="912" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="923" y1="292" x2="923" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="934" y1="292" x2="934" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="292" x2="934" y2="292" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="303" x2="934" y2="303" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="314" x2="934" y2="314" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="325" x2="934" y2="325" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="336" x2="934" y2="336" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="347" x2="934" y2="347" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="358" x2="934" y2="358" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="369" x2="934" y2="369" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="846" y1="380" x2="934" y2="380" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="846" y="292" width="88" height="88" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<text x="890" y="400" text-anchor="middle" font-size="13" fill="#111111">1 → 8</text>
<text x="890" y="418" text-anchor="middle" font-size="12" fill="#C30B0A">0,63</text>
</g>
<g data-key="conf" data-only="1">
<text x="430" y="500" class="cap" fill="#C30B0A">на семи ошибках из десяти уверенность выше 0,79 — сеть ошибается уверенно</text>
<text x="430" y="520" class="cap">только на двух верный класс шёл вторым вплотную:</text>
<text x="430" y="538" class="cap">0,34 против 0,30 и 0,45 против 0,22</text>
</g>
<g data-key="wts" data-only="1">
<text x="430" y="80" class="cap">столбец W⁽¹⁾ одного нейрона, свёрнутый в квадрат 8 × 8</text>
<rect x="430" y="120" width="13" height="13" fill="rgb(235,241,251)"/>
<rect x="443" y="120" width="13" height="13" fill="rgb(236,192,189)"/>
<rect x="456" y="120" width="13" height="13" fill="rgb(247,230,228)"/>
<rect x="469" y="120" width="13" height="13" fill="rgb(234,186,182)"/>
<rect x="482" y="120" width="13" height="13" fill="rgb(248,232,231)"/>
<rect x="495" y="120" width="13" height="13" fill="rgb(126,165,229)"/>
<rect x="508" y="120" width="13" height="13" fill="rgb(218,229,247)"/>
<rect x="521" y="120" width="13" height="13" fill="rgb(245,224,222)"/>
<rect x="430" y="133" width="13" height="13" fill="rgb(226,234,249)"/>
<rect x="443" y="133" width="13" height="13" fill="rgb(254,254,254)"/>
<rect x="456" y="133" width="13" height="13" fill="rgb(244,220,218)"/>
<rect x="469" y="133" width="13" height="13" fill="rgb(244,220,218)"/>
<rect x="482" y="133" width="13" height="13" fill="rgb(252,247,246)"/>
<rect x="495" y="133" width="13" height="13" fill="rgb(238,199,197)"/>
<rect x="508" y="133" width="13" height="13" fill="rgb(251,242,241)"/>
<rect x="521" y="133" width="13" height="13" fill="rgb(235,241,251)"/>
<rect x="430" y="146" width="13" height="13" fill="rgb(251,252,254)"/>
<rect x="443" y="146" width="13" height="13" fill="rgb(254,254,254)"/>
<rect x="456" y="146" width="13" height="13" fill="rgb(217,131,124)"/>
<rect x="469" y="146" width="13" height="13" fill="rgb(249,237,236)"/>
<rect x="482" y="146" width="13" height="13" fill="rgb(158,187,235)"/>
<rect x="495" y="146" width="13" height="13" fill="rgb(218,132,126)"/>
<rect x="508" y="146" width="13" height="13" fill="rgb(252,246,246)"/>
<rect x="521" y="146" width="13" height="13" fill="rgb(240,206,204)"/>
<rect x="430" y="159" width="13" height="13" fill="rgb(248,250,253)"/>
<rect x="443" y="159" width="13" height="13" fill="rgb(230,172,168)"/>
<rect x="456" y="159" width="13" height="13" fill="rgb(201,75,66)"/>
<rect x="469" y="159" width="13" height="13" fill="rgb(195,213,243)"/>
<rect x="482" y="159" width="13" height="13" fill="rgb(81,133,220)"/>
<rect x="495" y="159" width="13" height="13" fill="rgb(218,134,128)"/>
<rect x="508" y="159" width="13" height="13" fill="rgb(237,197,194)"/>
<rect x="521" y="159" width="13" height="13" fill="rgb(235,241,251)"/>
<rect x="430" y="172" width="13" height="13" fill="rgb(243,215,213)"/>
<rect x="443" y="172" width="13" height="13" fill="rgb(239,202,200)"/>
<rect x="456" y="172" width="13" height="13" fill="rgb(225,158,153)"/>
<rect x="469" y="172" width="13" height="13" fill="rgb(138,173,231)"/>
<rect x="482" y="172" width="13" height="13" fill="rgb(55,115,215)"/>
<rect x="495" y="172" width="13" height="13" fill="rgb(246,249,253)"/>
<rect x="508" y="172" width="13" height="13" fill="rgb(224,152,146)"/>
<rect x="521" y="172" width="13" height="13" fill="rgb(241,245,252)"/>
<rect x="430" y="185" width="13" height="13" fill="rgb(253,253,254)"/>
<rect x="443" y="185" width="13" height="13" fill="rgb(192,211,242)"/>
<rect x="456" y="185" width="13" height="13" fill="rgb(220,139,133)"/>
<rect x="469" y="185" width="13" height="13" fill="rgb(131,168,230)"/>
<rect x="482" y="185" width="13" height="13" fill="rgb(200,217,244)"/>
<rect x="495" y="185" width="13" height="13" fill="rgb(236,193,190)"/>
<rect x="508" y="185" width="13" height="13" fill="rgb(246,225,224)"/>
<rect x="521" y="185" width="13" height="13" fill="rgb(254,254,254)"/>
<rect x="430" y="198" width="13" height="13" fill="rgb(244,220,218)"/>
<rect x="443" y="198" width="13" height="13" fill="rgb(234,188,184)"/>
<rect x="456" y="198" width="13" height="13" fill="rgb(250,239,238)"/>
<rect x="469" y="198" width="13" height="13" fill="rgb(235,188,185)"/>
<rect x="482" y="198" width="13" height="13" fill="rgb(243,246,252)"/>
<rect x="495" y="198" width="13" height="13" fill="rgb(235,189,186)"/>
<rect x="508" y="198" width="13" height="13" fill="rgb(251,243,242)"/>
<rect x="521" y="198" width="13" height="13" fill="rgb(205,220,245)"/>
<rect x="430" y="211" width="13" height="13" fill="rgb(239,244,251)"/>
<rect x="443" y="211" width="13" height="13" fill="rgb(199,216,243)"/>
<rect x="456" y="211" width="13" height="13" fill="rgb(246,249,253)"/>
<rect x="469" y="211" width="13" height="13" fill="rgb(229,171,166)"/>
<rect x="482" y="211" width="13" height="13" fill="rgb(216,228,247)"/>
<rect x="495" y="211" width="13" height="13" fill="rgb(234,240,250)"/>
<rect x="508" y="211" width="13" height="13" fill="rgb(247,249,253)"/>
<rect x="521" y="211" width="13" height="13" fill="rgb(239,204,202)"/>
<rect x="430" y="120" width="104" height="104" fill="none" stroke="#5E5850" stroke-width="1.2"/>
<text x="482" y="244" text-anchor="middle" font-size="12" fill="#111111">нейрон 16</text>
<text x="482" y="262" text-anchor="middle" font-size="12" fill="#5E5850">тянет к «0»</text>
<rect x="560" y="120" width="13" height="13" fill="rgb(237,195,192)"/>
<rect x="573" y="120" width="13" height="13" fill="rgb(249,238,237)"/>
<rect x="586" y="120" width="13" height="13" fill="rgb(249,236,235)"/>
<rect x="599" y="120" width="13" height="13" fill="rgb(251,243,242)"/>
<rect x="612" y="120" width="13" height="13" fill="rgb(240,244,252)"/>
<rect x="625" y="120" width="13" height="13" fill="rgb(222,147,142)"/>
<rect x="638" y="120" width="13" height="13" fill="rgb(252,247,247)"/>
<rect x="651" y="120" width="13" height="13" fill="rgb(226,234,249)"/>
<rect x="560" y="133" width="13" height="13" fill="rgb(223,232,248)"/>
<rect x="573" y="133" width="13" height="13" fill="rgb(236,241,251)"/>
<rect x="586" y="133" width="13" height="13" fill="rgb(226,234,249)"/>
<rect x="599" y="133" width="13" height="13" fill="rgb(251,243,243)"/>
<rect x="612" y="133" width="13" height="13" fill="rgb(242,212,210)"/>
<rect x="625" y="133" width="13" height="13" fill="rgb(210,107,100)"/>
<rect x="638" y="133" width="13" height="13" fill="rgb(254,254,254)"/>
<rect x="651" y="133" width="13" height="13" fill="rgb(248,250,253)"/>
<rect x="560" y="146" width="13" height="13" fill="rgb(231,176,172)"/>
<rect x="573" y="146" width="13" height="13" fill="rgb(217,131,125)"/>
<rect x="586" y="146" width="13" height="13" fill="rgb(183,204,240)"/>
<rect x="599" y="146" width="13" height="13" fill="rgb(213,115,109)"/>
<rect x="612" y="146" width="13" height="13" fill="rgb(198,67,58)"/>
<rect x="625" y="146" width="13" height="13" fill="rgb(245,222,221)"/>
<rect x="638" y="146" width="13" height="13" fill="rgb(188,208,241)"/>
<rect x="651" y="146" width="13" height="13" fill="rgb(226,159,154)"/>
<rect x="560" y="159" width="13" height="13" fill="rgb(227,235,249)"/>
<rect x="573" y="159" width="13" height="13" fill="rgb(232,239,250)"/>
<rect x="586" y="159" width="13" height="13" fill="rgb(252,246,246)"/>
<rect x="599" y="159" width="13" height="13" fill="rgb(201,75,66)"/>
<rect x="612" y="159" width="13" height="13" fill="rgb(212,111,104)"/>
<rect x="625" y="159" width="13" height="13" fill="rgb(198,215,243)"/>
<rect x="638" y="159" width="13" height="13" fill="rgb(79,131,219)"/>
<rect x="651" y="159" width="13" height="13" fill="rgb(226,234,249)"/>
<rect x="560" y="172" width="13" height="13" fill="rgb(175,199,239)"/>
<rect x="573" y="172" width="13" height="13" fill="rgb(85,136,221)"/>
<rect x="586" y="172" width="13" height="13" fill="rgb(243,218,216)"/>
<rect x="599" y="172" width="13" height="13" fill="rgb(235,191,188)"/>
<rect x="612" y="172" width="13" height="13" fill="rgb(229,236,249)"/>
<rect x="625" y="172" width="13" height="13" fill="rgb(142,176,232)"/>
<rect x="638" y="172" width="13" height="13" fill="rgb(106,151,225)"/>
<rect x="651" y="172" width="13" height="13" fill="rgb(214,226,246)"/>
<rect x="560" y="185" width="13" height="13" fill="rgb(184,205,240)"/>
<rect x="573" y="185" width="13" height="13" fill="rgb(198,215,243)"/>
<rect x="586" y="185" width="13" height="13" fill="rgb(84,135,220)"/>
<rect x="599" y="185" width="13" height="13" fill="rgb(55,115,215)"/>
<rect x="612" y="185" width="13" height="13" fill="rgb(242,245,252)"/>
<rect x="625" y="185" width="13" height="13" fill="rgb(238,199,196)"/>
<rect x="638" y="185" width="13" height="13" fill="rgb(140,175,232)"/>
<rect x="651" y="185" width="13" height="13" fill="rgb(254,254,254)"/>
<rect x="560" y="198" width="13" height="13" fill="rgb(208,222,245)"/>
<rect x="573" y="198" width="13" height="13" fill="rgb(211,224,246)"/>
<rect x="586" y="198" width="13" height="13" fill="rgb(225,234,249)"/>
<rect x="599" y="198" width="13" height="13" fill="rgb(138,173,231)"/>
<rect x="612" y="198" width="13" height="13" fill="rgb(248,232,231)"/>
<rect x="625" y="198" width="13" height="13" fill="rgb(224,152,147)"/>
<rect x="638" y="198" width="13" height="13" fill="rgb(228,236,249)"/>
<rect x="651" y="198" width="13" height="13" fill="rgb(252,246,246)"/>
<rect x="560" y="211" width="13" height="13" fill="rgb(243,217,215)"/>
<rect x="573" y="211" width="13" height="13" fill="rgb(253,254,254)"/>
<rect x="586" y="211" width="13" height="13" fill="rgb(212,225,246)"/>
<rect x="599" y="211" width="13" height="13" fill="rgb(208,99,91)"/>
<rect x="612" y="211" width="13" height="13" fill="rgb(213,116,109)"/>
<rect x="625" y="211" width="13" height="13" fill="rgb(233,184,180)"/>
<rect x="638" y="211" width="13" height="13" fill="rgb(246,228,226)"/>
<rect x="651" y="211" width="13" height="13" fill="rgb(240,207,205)"/>
<rect x="560" y="120" width="104" height="104" fill="none" stroke="#5E5850" stroke-width="1.2"/>
<text x="612" y="244" text-anchor="middle" font-size="12" fill="#111111">нейрон 21</text>
<text x="612" y="262" text-anchor="middle" font-size="12" fill="#5E5850">тянет к «1»</text>
<rect x="690" y="120" width="13" height="13" fill="rgb(251,242,242)"/>
<rect x="703" y="120" width="13" height="13" fill="rgb(250,238,237)"/>
<rect x="716" y="120" width="13" height="13" fill="rgb(238,243,251)"/>
<rect x="729" y="120" width="13" height="13" fill="rgb(244,247,252)"/>
<rect x="742" y="120" width="13" height="13" fill="rgb(236,241,251)"/>
<rect x="755" y="120" width="13" height="13" fill="rgb(235,241,251)"/>
<rect x="768" y="120" width="13" height="13" fill="rgb(248,234,233)"/>
<rect x="781" y="120" width="13" height="13" fill="rgb(246,228,226)"/>
<rect x="690" y="133" width="13" height="13" fill="rgb(225,234,249)"/>
<rect x="703" y="133" width="13" height="13" fill="rgb(234,240,250)"/>
<rect x="716" y="133" width="13" height="13" fill="rgb(241,245,252)"/>
<rect x="729" y="133" width="13" height="13" fill="rgb(244,220,218)"/>
<rect x="742" y="133" width="13" height="13" fill="rgb(152,183,234)"/>
<rect x="755" y="133" width="13" height="13" fill="rgb(172,197,238)"/>
<rect x="768" y="133" width="13" height="13" fill="rgb(201,217,244)"/>
<rect x="781" y="133" width="13" height="13" fill="rgb(215,227,247)"/>
<rect x="690" y="146" width="13" height="13" fill="rgb(249,236,235)"/>
<rect x="703" y="146" width="13" height="13" fill="rgb(223,232,248)"/>
<rect x="716" y="146" width="13" height="13" fill="rgb(246,225,224)"/>
<rect x="729" y="146" width="13" height="13" fill="rgb(240,206,204)"/>
<rect x="742" y="146" width="13" height="13" fill="rgb(158,187,235)"/>
<rect x="755" y="146" width="13" height="13" fill="rgb(55,115,215)"/>
<rect x="768" y="146" width="13" height="13" fill="rgb(203,218,244)"/>
<rect x="781" y="146" width="13" height="13" fill="rgb(239,202,199)"/>
<rect x="690" y="159" width="13" height="13" fill="rgb(253,253,254)"/>
<rect x="703" y="159" width="13" height="13" fill="rgb(239,201,199)"/>
<rect x="716" y="159" width="13" height="13" fill="rgb(225,155,150)"/>
<rect x="729" y="159" width="13" height="13" fill="rgb(252,246,246)"/>
<rect x="742" y="159" width="13" height="13" fill="rgb(245,223,222)"/>
<rect x="755" y="159" width="13" height="13" fill="rgb(166,193,237)"/>
<rect x="768" y="159" width="13" height="13" fill="rgb(254,253,253)"/>
<rect x="781" y="159" width="13" height="13" fill="rgb(252,253,254)"/>
<rect x="690" y="172" width="13" height="13" fill="rgb(237,242,251)"/>
<rect x="703" y="172" width="13" height="13" fill="rgb(230,237,250)"/>
<rect x="716" y="172" width="13" height="13" fill="rgb(222,146,141)"/>
<rect x="729" y="172" width="13" height="13" fill="rgb(252,245,244)"/>
<rect x="742" y="172" width="13" height="13" fill="rgb(242,212,210)"/>
<rect x="755" y="172" width="13" height="13" fill="rgb(218,132,126)"/>
<rect x="768" y="172" width="13" height="13" fill="rgb(235,190,187)"/>
<rect x="781" y="172" width="13" height="13" fill="rgb(221,231,248)"/>
<rect x="690" y="185" width="13" height="13" fill="rgb(239,204,201)"/>
<rect x="703" y="185" width="13" height="13" fill="rgb(246,225,224)"/>
<rect x="716" y="185" width="13" height="13" fill="rgb(239,201,199)"/>
<rect x="729" y="185" width="13" height="13" fill="rgb(216,228,247)"/>
<rect x="742" y="185" width="13" height="13" fill="rgb(229,171,167)"/>
<rect x="755" y="185" width="13" height="13" fill="rgb(228,167,162)"/>
<rect x="768" y="185" width="13" height="13" fill="rgb(227,162,157)"/>
<rect x="781" y="185" width="13" height="13" fill="rgb(246,249,253)"/>
<rect x="690" y="198" width="13" height="13" fill="rgb(218,229,247)"/>
<rect x="703" y="198" width="13" height="13" fill="rgb(230,238,250)"/>
<rect x="716" y="198" width="13" height="13" fill="rgb(242,246,252)"/>
<rect x="729" y="198" width="13" height="13" fill="rgb(240,205,203)"/>
<rect x="742" y="198" width="13" height="13" fill="rgb(249,237,236)"/>
<rect x="755" y="198" width="13" height="13" fill="rgb(252,253,254)"/>
<rect x="768" y="198" width="13" height="13" fill="rgb(239,204,202)"/>
<rect x="781" y="198" width="13" height="13" fill="rgb(226,235,249)"/>
<rect x="690" y="211" width="13" height="13" fill="rgb(239,204,201)"/>
<rect x="703" y="211" width="13" height="13" fill="rgb(249,236,235)"/>
<rect x="716" y="211" width="13" height="13" fill="rgb(216,228,247)"/>
<rect x="729" y="211" width="13" height="13" fill="rgb(234,240,250)"/>
<rect x="742" y="211" width="13" height="13" fill="rgb(243,246,252)"/>
<rect x="755" y="211" width="13" height="13" fill="rgb(248,250,253)"/>
<rect x="768" y="211" width="13" height="13" fill="rgb(245,248,253)"/>
<rect x="781" y="211" width="13" height="13" fill="rgb(249,237,236)"/>
<rect x="690" y="120" width="104" height="104" fill="none" stroke="#5E5850" stroke-width="1.2"/>
<text x="742" y="244" text-anchor="middle" font-size="12" fill="#111111">нейрон 18</text>
<text x="742" y="262" text-anchor="middle" font-size="12" fill="#5E5850">тянет к «6»</text>
<rect x="820" y="120" width="13" height="13" fill="rgb(253,251,250)"/>
<rect x="833" y="120" width="13" height="13" fill="rgb(247,249,253)"/>
<rect x="846" y="120" width="13" height="13" fill="rgb(247,230,228)"/>
<rect x="859" y="120" width="13" height="13" fill="rgb(217,228,247)"/>
<rect x="872" y="120" width="13" height="13" fill="rgb(244,219,217)"/>
<rect x="885" y="120" width="13" height="13" fill="rgb(218,229,247)"/>
<rect x="898" y="120" width="13" height="13" fill="rgb(239,203,200)"/>
<rect x="911" y="120" width="13" height="13" fill="rgb(240,245,252)"/>
<rect x="820" y="133" width="13" height="13" fill="rgb(228,167,162)"/>
<rect x="833" y="133" width="13" height="13" fill="rgb(186,206,241)"/>
<rect x="846" y="133" width="13" height="13" fill="rgb(229,170,166)"/>
<rect x="859" y="133" width="13" height="13" fill="rgb(243,216,214)"/>
<rect x="872" y="133" width="13" height="13" fill="rgb(211,224,246)"/>
<rect x="885" y="133" width="13" height="13" fill="rgb(242,213,211)"/>
<rect x="898" y="133" width="13" height="13" fill="rgb(240,206,204)"/>
<rect x="911" y="133" width="13" height="13" fill="rgb(253,253,254)"/>
<rect x="820" y="146" width="13" height="13" fill="rgb(220,230,248)"/>
<rect x="833" y="146" width="13" height="13" fill="rgb(244,219,217)"/>
<rect x="846" y="146" width="13" height="13" fill="rgb(231,175,171)"/>
<rect x="859" y="146" width="13" height="13" fill="rgb(251,243,242)"/>
<rect x="872" y="146" width="13" height="13" fill="rgb(208,222,245)"/>
<rect x="885" y="146" width="13" height="13" fill="rgb(216,126,120)"/>
<rect x="898" y="146" width="13" height="13" fill="rgb(243,246,252)"/>
<rect x="911" y="146" width="13" height="13" fill="rgb(212,225,246)"/>
<rect x="820" y="159" width="13" height="13" fill="rgb(251,242,241)"/>
<rect x="833" y="159" width="13" height="13" fill="rgb(249,235,234)"/>
<rect x="846" y="159" width="13" height="13" fill="rgb(239,203,200)"/>
<rect x="859" y="159" width="13" height="13" fill="rgb(195,56,46)"/>
<rect x="872" y="159" width="13" height="13" fill="rgb(222,232,248)"/>
<rect x="885" y="159" width="13" height="13" fill="rgb(245,224,222)"/>
<rect x="898" y="159" width="13" height="13" fill="rgb(227,236,249)"/>
<rect x="911" y="159" width="13" height="13" fill="rgb(234,186,183)"/>
<rect x="820" y="172" width="13" height="13" fill="rgb(251,252,254)"/>
<rect x="833" y="172" width="13" height="13" fill="rgb(89,138,221)"/>
<rect x="846" y="172" width="13" height="13" fill="rgb(237,195,192)"/>
<rect x="859" y="172" width="13" height="13" fill="rgb(195,55,45)"/>
<rect x="872" y="172" width="13" height="13" fill="rgb(251,252,254)"/>
<rect x="885" y="172" width="13" height="13" fill="rgb(221,231,248)"/>
<rect x="898" y="172" width="13" height="13" fill="rgb(176,200,239)"/>
<rect x="911" y="172" width="13" height="13" fill="rgb(251,252,254)"/>
<rect x="820" y="185" width="13" height="13" fill="rgb(191,210,242)"/>
<rect x="833" y="185" width="13" height="13" fill="rgb(198,215,243)"/>
<rect x="846" y="185" width="13" height="13" fill="rgb(229,170,166)"/>
<rect x="859" y="185" width="13" height="13" fill="rgb(231,238,250)"/>
<rect x="872" y="185" width="13" height="13" fill="rgb(229,237,249)"/>
<rect x="885" y="185" width="13" height="13" fill="rgb(231,238,250)"/>
<rect x="898" y="185" width="13" height="13" fill="rgb(216,228,247)"/>
<rect x="911" y="185" width="13" height="13" fill="rgb(246,225,223)"/>
<rect x="820" y="198" width="13" height="13" fill="rgb(233,239,250)"/>
<rect x="833" y="198" width="13" height="13" fill="rgb(248,234,233)"/>
<rect x="846" y="198" width="13" height="13" fill="rgb(240,207,205)"/>
<rect x="859" y="198" width="13" height="13" fill="rgb(135,171,231)"/>
<rect x="872" y="198" width="13" height="13" fill="rgb(129,166,229)"/>
<rect x="885" y="198" width="13" height="13" fill="rgb(229,237,249)"/>
<rect x="898" y="198" width="13" height="13" fill="rgb(243,247,252)"/>
<rect x="911" y="198" width="13" height="13" fill="rgb(206,221,245)"/>
<rect x="820" y="211" width="13" height="13" fill="rgb(186,206,241)"/>
<rect x="833" y="211" width="13" height="13" fill="rgb(251,243,242)"/>
<rect x="846" y="211" width="13" height="13" fill="rgb(203,218,244)"/>
<rect x="859" y="211" width="13" height="13" fill="rgb(254,253,253)"/>
<rect x="872" y="211" width="13" height="13" fill="rgb(225,156,151)"/>
<rect x="885" y="211" width="13" height="13" fill="rgb(253,250,250)"/>
<rect x="898" y="211" width="13" height="13" fill="rgb(214,226,246)"/>
<rect x="911" y="211" width="13" height="13" fill="rgb(207,222,245)"/>
<rect x="820" y="120" width="104" height="104" fill="none" stroke="#5E5850" stroke-width="1.2"/>
<text x="872" y="244" text-anchor="middle" font-size="12" fill="#111111">нейрон 3</text>
<text x="872" y="262" text-anchor="middle" font-size="12" fill="#5E5850">тянет к «8»</text>
<rect x="430" y="296" width="24" height="14" fill="rgb(195,55,45)"/>
<text x="462" y="308" class="cap">красное — «здесь чернила нужны»</text>
<rect x="430" y="320" width="24" height="14" fill="rgb(55,115,215)"/>
<text x="462" y="332" class="cap">синее — «здесь чернил быть не должно»</text>
<text x="430" y="348" class="cap">Ни один из них не похож на цифру: нейрон отвечает не за образ целиком,</text>
<text x="430" y="368" class="cap">а за небольшой перевес чернил в одной части картинки против другой.</text>
</g>
<g data-key="dead" data-only="1">
<text x="430" y="80" class="cap">четыре клетки, нулевые у всех 1347 обучающих картинок</text>
<rect x="430" y="110" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="456" y="110" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="482" y="110" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="508" y="110" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="534" y="110" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="560" y="110" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="586" y="110" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="612" y="110" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="430" y="136" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="456" y="136" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="482" y="136" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="508" y="136" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="534" y="136" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="560" y="136" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="586" y="136" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="612" y="136" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="430" y="162" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="456" y="162" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="482" y="162" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="508" y="162" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="534" y="162" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="560" y="162" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="586" y="162" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="612" y="162" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="430" y="188" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="456" y="188" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="482" y="188" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="508" y="188" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="534" y="188" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="560" y="188" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="586" y="188" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="612" y="188" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="430" y="214" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="456" y="214" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="482" y="214" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="508" y="214" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="534" y="214" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="560" y="214" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="586" y="214" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="612" y="214" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="430" y="240" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="456" y="240" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="482" y="240" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="508" y="240" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="534" y="240" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="560" y="240" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="586" y="240" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="612" y="240" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="430" y="266" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="456" y="266" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="482" y="266" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="508" y="266" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="534" y="266" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="560" y="266" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="586" y="266" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="612" y="266" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="430" y="292" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="456" y="292" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="482" y="292" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="508" y="292" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="534" y="292" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="560" y="292" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="586" y="292" width="26" height="26" fill="rgb(255,255,255)"/>
<rect x="612" y="292" width="26" height="26" fill="rgb(255,255,255)"/>
<line x1="430" y1="110" x2="430" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="456" y1="110" x2="456" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="482" y1="110" x2="482" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="508" y1="110" x2="508" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="534" y1="110" x2="534" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="560" y1="110" x2="560" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="586" y1="110" x2="586" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="612" y1="110" x2="612" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="638" y1="110" x2="638" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="110" x2="638" y2="110" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="136" x2="638" y2="136" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="162" x2="638" y2="162" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="188" x2="638" y2="188" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="214" x2="638" y2="214" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="240" x2="638" y2="240" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="266" x2="638" y2="266" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="292" x2="638" y2="292" stroke="#E0DDD3" stroke-width="0.8"/>
<line x1="430" y1="318" x2="638" y2="318" stroke="#E0DDD3" stroke-width="0.8"/>
<rect x="430" y="110" width="208" height="208" fill="none" stroke="#5E5850" stroke-width="1.4"/>
<rect x="430" y="110" width="26" height="26" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.4"/>
<rect x="430" y="188" width="26" height="26" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.4"/>
<rect x="430" y="214" width="26" height="26" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.4"/>
<rect x="612" y="214" width="26" height="26" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.4"/>
<text x="660" y="140" class="cap">клетки №0, №24, №32 и №39</text>
<text x="660" y="162" class="cap">4 × 32 = 128 весов первого слоя</text>
<text x="660" y="184" class="cap">после 1260 шагов остались ровно</text>
<text x="660" y="206" class="cap">такими же, какими были заданы</text>
<text x="660" y="228" class="cap">случайным генератором</text>
<text x="430" y="352" class="cap" fill="#C30B0A">градиент по этим весам всегда равен нулю:</text>
<text x="430" y="370" class="cap" fill="#C30B0A">их множитель — яркость клетки, а она всегда 0</text>
</g>
<g data-key="score">
<rect x="100" y="464" width="310" height="76" rx="10" fill="#F0FAF0" stroke="#73B222" stroke-width="1.7"/>
<text x="118" y="492" class="lbl">97,78 % на отложенной выборке</text>
<text x="118" y="514" class="cap">10 ошибок из 450 · 99,78 % на обучающей</text>
<text x="118" y="532" class="cap">2410 параметров · 1260 шагов · доли секунды счёта</text>
</g>
<text x="40" y="570" class="legend">зелёный — верные ответы · красный — ошибки · в картах весов красное и синее — знак веса</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="mx score" data-focus="mx">
      <div class="step-kicker">Шаг 1 · матрица ошибок</div>
      <h4>Десять на десять: что было и что сеть ответила</h4>
<p>Точность одним числом скрывает главное — куда именно сеть путается. Матрица ошибок это показывает: на диагонали 440 верных ответов, вне её — 10 ошибок. Столбцы «0» и «7» чистые: ни одну картинку сеть не назвала нулём или семёркой ошибочно.</p>
    </div>
    <div class="step-panel" data-on="mx score col1" data-focus="col1">
      <div class="step-kicker">Шаг 2 · любимый ответ</div>
      <h4>Пять ошибок из десяти — это ответ «единица»</h4>
<p>Единицей сеть назвала двойку, пятёрку, шестёрку и две восьмёрки. Причина понятная: единица в этом наборе — самая «пустая» цифра, у неё мало чернил, и любая тонко написанная цифра оказывается к ней ближе, чем к своему классу. Такие перекосы видно только в матрице, в проценте точности они растворяются.</p>
    </div>
    <div class="step-panel" data-on="mx score errs" data-focus="errs">
      <div class="step-kicker">Шаг 3 · сами картинки</div>
      <h4>Все десять картинок, на которых сеть промахнулась</h4>
<p>Это и есть настоящий разбор ошибок: не «точность 97,78 %», а конкретные картинки в 8 × 8, где хвост четвёрки замкнулся и стал восьмёркой. Часть из них человек тоже прочтёт неуверенно — при таком разрешении информация местами просто потеряна.</p>
    </div>
    <div class="step-panel" data-on="mx score errs conf" data-focus="conf">
      <div class="step-kicker">Шаг 4 · уверенность на ошибках</div>
      <h4>0,99 за неверный ответ — это не опечатка</h4>
<p>На семи ошибках из десяти сеть уверена сильнее, чем на 0,79, а на одной шестёрке — на 0,99. Кросс-энтропия штрафует за неуверенность, поэтому обученная сеть почти всегда отвечает уверенно — и ошибается тоже уверенно. Само по себе число «вероятность» здесь не измеряет надёжность ответа.</p>
    </div>
    <div class="step-panel" data-on="mx score wts" data-focus="wts">
      <div class="step-kicker">Шаг 5 · что выучил первый слой</div>
      <h4>Веса нейрона — это карта «где чернила нужны, а где нет»</h4>
<p>Свернём столбец W⁽¹⁾ обратно в квадрат 8 × 8 и раскрасим: красное — положительные веса, синее — отрицательные. Ни одна картинка не похожа на цифру. Нейрон, который сильнее всех тянет к «единице», просто требует чернил в середине и их отсутствия по бокам. Красивые «детекторы петель и палочек» — это мотивация, а не описание того, что получается на самом деле.</p>
    </div>
    <div class="step-panel" data-on="mx score dead" data-focus="dead">
      <div class="step-kicker">Шаг 6 · 128 весов, которых не коснулись</div>
      <h4>Клетка всегда нулевая — значит, её веса не сдвинутся никогда</h4>
<p>Градиент веса равен яркости клетки, умноженной на градиент нейрона. Если клетка равна нулю у всех картинок, произведение равно нулю при любом состоянии сети. Проверка после обучения это подтвердила: 128 весов совпадают с начальными до последнего разряда. Сеть не «решила их не трогать» — до них просто ни разу не дошла информация.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout-red">
  <strong>Красивая история, которая не подтверждается:</strong> про скрытые нейроны обычно говорят,
  что они учат части образа — палочки, петельки, углы. У нашей сети ни один из 32 нейронов не похож
  ни на петлю, ни на палочку: это пятна из плюсов и минусов, разбросанные по всей картинке.
  Слои действительно строят промежуточные признаки, но выглядят эти признаки не так, как хотелось бы,
  и объяснимость приходится добывать отдельными методами, а не разглядыванием весов.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обученная сеть ошибается уверенно. На семи ошибках из десяти
  вероятность неверного ответа выше 0,79 — кросс-энтропия учит быть уверенным, а не осторожным,
  и выход softmax нельзя читать как «насколько сети можно доверять».
</div>

---

## Часть 11. Что ломается: шесть экспериментов

<p>
  Всё описанное выше работает при конкретных значениях η = 0,3 и B = 32 и при входах, поделённых на 16.
  Стоит посмотреть, что бывает при других значениях: именно здесь видно, какие из настроек связаны
  между собой, а какие независимы. Все шесть экспериментов проведены на той же сети и том же
  разбиении, менялся ровно один параметр за раз.
</p>

<p>Посмотрим пошагово, что происходит, когда что-то из этого сдвинуть.</p>

<div class="stage" id="stageBR" tabindex="0">
  <div class="stage-figure">
<svg id="br" viewBox="0 0 960 560" role="img" aria-label="Шесть экспериментов: шаг, размер батча, нормировка, перемешивание, крошечный батч и слишком долгое обучение">
  <style>
    #br { font-family: Helvetica, Arial, sans-serif; }
    #br .lbl { font-size: 16px; fill: #111111; }
    #br .cap { font-size: 13px; fill: #5E5850; }
    #br .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #br .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #br .edge{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #br .legend { font-size: 13px; fill: #5E5850; }
    #br .mm { font-size: 12px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="br-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="br-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="br-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D83BB9"/>
    </marker>
  </defs>

<g data-key="p1">
<rect x="30" y="70" width="290" height="210" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.3"/><text x="46" y="96" class="nm">Длина шага η</text>
<rect x="46.0" y="134.1" width="42.0" height="111.9" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.2"/>
<text x="67.0" y="128.1" text-anchor="middle" font-size="12" fill="#111111">90,2</text>
<text x="67.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">0,01</text>
<rect x="100.0" y="125.9" width="42.0" height="120.1" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.2"/>
<text x="121.0" y="119.9" text-anchor="middle" font-size="12" fill="#111111">96,9</text>
<text x="121.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">0,10</text>
<rect x="154.0" y="124.8" width="42.0" height="121.2" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.2"/>
<text x="175.0" y="118.8" text-anchor="middle" font-size="12" fill="#111111">97,8</text>
<text x="175.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">0,30</text>
<rect x="208.0" y="125.3" width="42.0" height="120.7" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.2"/>
<text x="229.0" y="119.3" text-anchor="middle" font-size="12" fill="#111111">97,3</text>
<text x="229.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">1,00</text>
<rect x="262.0" y="233.6" width="42.0" height="12.4" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.2"/>
<text x="283.0" y="227.6" text-anchor="middle" font-size="12" fill="#111111">10,0</text>
<text x="283.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">3,00</text>
<line x1="42" y1="246" x2="308" y2="246" stroke="#5E5850" stroke-width="1"/>
<text x="46" y="272" class="cap">точность, % · 30 эпох</text>
</g>
<g data-key="p2">
<rect x="335" y="70" width="290" height="210" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.3"/><text x="351" y="96" class="nm">Размер батча</text>
<rect x="351.0" y="223.4" width="42.0" height="22.6" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.2"/>
<text x="372.0" y="217.4" text-anchor="middle" font-size="12" fill="#111111">18,2</text>
<text x="372.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<rect x="405.0" y="124.8" width="42.0" height="121.2" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.2"/>
<text x="426.0" y="118.8" text-anchor="middle" font-size="12" fill="#111111">97,8</text>
<text x="426.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">8</text>
<rect x="459.0" y="124.8" width="42.0" height="121.2" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.2"/>
<text x="480.0" y="118.8" text-anchor="middle" font-size="12" fill="#111111">97,8</text>
<text x="480.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">32</text>
<rect x="513.0" y="126.1" width="42.0" height="119.9" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.2"/>
<text x="534.0" y="120.1" text-anchor="middle" font-size="12" fill="#111111">96,7</text>
<text x="534.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">128</text>
<rect x="567.0" y="137.7" width="42.0" height="108.3" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.2"/>
<text x="588.0" y="131.7" text-anchor="middle" font-size="12" fill="#111111">87,3</text>
<text x="588.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">1347</text>
<line x1="347" y1="246" x2="613" y2="246" stroke="#5E5850" stroke-width="1"/>
<text x="351" y="272" class="cap">точность, % · та же η = 0,3</text>
</g>
<g data-key="p3">
<rect x="640" y="70" width="290" height="210" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.3"/><text x="656" y="96" class="nm">Деление на 16</text>
<rect x="656.0" y="124.8" width="44.0" height="121.2" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.2"/>
<text x="678.0" y="118.8" text-anchor="middle" font-size="12" fill="#111111">97,8</text>
<text x="678.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">÷16 · 0,3</text>
<rect x="763.0" y="233.6" width="44.0" height="12.4" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.2"/>
<text x="785.0" y="227.6" text-anchor="middle" font-size="12" fill="#111111">10,0</text>
<text x="785.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">0…16 · 0,3</text>
<rect x="870.0" y="127.2" width="44.0" height="118.8" fill="#C29E08" fill-opacity="0.55" stroke="#C29E08" stroke-width="1.2"/>
<text x="892.0" y="121.2" text-anchor="middle" font-size="12" fill="#111111">95,8</text>
<text x="892.0" y="262.0" text-anchor="middle" font-size="12" fill="#5E5850">0…16 · 0,01</text>
<line x1="652" y1="246" x2="918" y2="246" stroke="#5E5850" stroke-width="1"/>
<text x="656" y="272" class="cap">точность, %</text>
</g>
<g data-key="p4">
<rect x="30" y="310" width="290" height="210" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.3"/><text x="46" y="336" class="nm">Перемешивание</text>
<rect x="46.0" y="386.0" width="44.0" height="100.0" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.2"/>
<text x="68.0" y="380.0" text-anchor="middle" font-size="12" fill="#111111">80,7</text>
<text x="68.0" y="502.0" text-anchor="middle" font-size="12" fill="#5E5850">по порядку</text>
<rect x="260.0" y="365.6" width="44.0" height="120.4" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.2"/>
<text x="282.0" y="359.6" text-anchor="middle" font-size="12" fill="#111111">97,1</text>
<text x="282.0" y="502.0" text-anchor="middle" font-size="12" fill="#5E5850">вперемешку</text>
<line x1="42" y1="486" x2="308" y2="486" stroke="#5E5850" stroke-width="1"/>
<text x="46" y="512" class="cap">данные отсортированы по классам</text>
</g>
<g data-key="p5">
<rect x="335" y="310" width="290" height="210" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.3"/><text x="351" y="336" class="nm">Батч из трёх картинок</text>
<text x="351" y="368" class="cap">один шаг по остатку эпохи</text>
<text x="351" y="396" class="lbl">потеря 0,1108 → 1,9904</text>
<text x="351" y="422" class="cap">точность на обучающей: 97,1 % → 66,4 %</text>
<text x="351" y="450" class="cap">норма градиента 4,92 против 0,49</text>
<text x="351" y="468" class="cap">у обычного батча из 32 картинок</text>
<text x="351" y="496" class="cap" fill="#C30B0A">один трудный пример из трёх решает всё</text>
</g>
<g data-key="p6">
<rect x="640" y="310" width="290" height="210" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.3"/><text x="656" y="336" class="nm">200 эпох вместо 30</text>
<line x1="662" y1="474" x2="906" y2="474" stroke="#5E5850" stroke-width="1"/>
<line x1="662" y1="360" x2="662" y2="474" stroke="#5E5850" stroke-width="1"/>
<polyline points="662.0,360.0 663.2,360.0 664.5,360.0 665.7,376.6 666.9,400.2 668.1,394.3 669.4,416.3 670.6,418.6 671.8,405.4 673.0,414.5 674.3,421.7 675.5,428.9 676.7,436.7 677.9,439.2 679.2,441.7 680.4,444.1 681.6,437.4 682.8,446.6 684.1,449.1 685.3,446.4 686.5,447.8 687.7,452.2 689.0,453.7 690.2,454.2 691.4,454.2 692.7,454.9 693.9,456.9 695.1,457.2 696.3,457.7 697.6,458.8 698.8,458.4 700.0,456.8 701.2,459.1 702.5,459.1 703.7,460.9 704.9,461.7 706.1,462.2 707.4,463.2 708.6,461.5 709.8,463.9 711.0,463.7 712.3,464.4 713.5,464.7 714.7,464.8 715.9,463.7 717.2,465.4 718.4,464.3 719.6,465.6 720.9,466.0 722.1,466.6 723.3,466.0 724.5,466.5 725.8,466.6 727.0,467.3 728.2,467.6 729.4,467.5 730.7,467.6 731.9,467.8 733.1,467.8 734.3,468.2 735.6,468.4 736.8,468.6 738.0,466.0 739.2,468.2 740.5,469.0 741.7,469.1 742.9,468.9 744.2,469.3 745.4,469.4 746.6,469.3 747.8,469.6 749.1,469.7 750.3,469.7 751.5,469.8 752.7,470.0 754.0,469.6 755.2,469.7 756.4,469.9 757.6,469.0 758.9,470.4 760.1,470.2 761.3,470.5 762.5,470.5 763.8,470.4 765.0,470.6 766.2,470.4 767.4,470.8 768.7,470.9 769.9,470.9 771.1,470.8 772.4,471.0 773.6,471.0 774.8,471.0 776.0,470.9 777.3,471.1 778.5,471.1 779.7,471.1 780.9,471.1 782.2,471.1 783.4,471.3 784.6,471.3 785.8,471.3 787.1,471.1 788.3,471.4 789.5,471.4 790.7,471.5 792.0,471.4 793.2,471.6 794.4,471.5 795.6,471.7 796.9,471.7 798.1,471.8 799.3,471.7 800.6,471.5 801.8,471.8 803.0,471.7 804.2,471.9 805.5,471.9 806.7,471.9 807.9,471.9 809.1,472.0 810.4,472.0 811.6,471.9 812.8,472.0 814.0,472.1 815.3,472.0 816.5,472.1 817.7,472.1 818.9,472.1 820.2,472.2 821.4,472.2 822.6,472.2 823.8,472.2 825.1,472.2 826.3,472.2 827.5,472.3 828.8,472.2 830.0,472.3 831.2,472.1 832.4,472.3 833.7,472.3 834.9,472.4 836.1,472.4 837.3,472.3 838.6,472.4 839.8,472.4 841.0,472.5 842.2,472.5 843.5,472.5 844.7,472.5 845.9,472.5 847.1,472.5 848.4,472.5 849.6,472.5 850.8,472.6 852.1,472.6 853.3,472.5 854.5,472.6 855.7,472.6 857.0,472.6 858.2,472.6 859.4,472.6 860.6,472.7 861.9,472.7 863.1,472.7 864.3,472.7 865.5,472.7 866.8,472.7 868.0,472.7 869.2,472.7 870.4,472.7 871.7,472.7 872.9,472.7 874.1,472.8 875.3,472.7 876.6,472.8 877.8,472.8 879.0,472.8 880.3,472.8 881.5,472.9 882.7,472.9 883.9,472.8 885.2,472.8 886.4,472.9 887.6,472.9 888.8,472.9 890.1,472.9 891.3,472.9 892.5,472.9 893.7,472.9 895.0,472.9 896.2,472.9 897.4,472.9 898.6,473.0 899.9,473.0 901.1,473.0 902.3,473.0 903.5,473.0 904.8,473.0 906.0,473.0" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<polyline points="662.0,360.0 663.2,360.0 664.5,360.0 665.7,360.0 666.9,376.9 668.1,362.2 669.4,391.2 670.6,397.4 671.8,367.8 673.0,378.9 674.3,393.0 675.5,409.0 676.7,408.4 677.9,410.7 679.2,413.2 680.4,412.4 681.6,411.8 682.8,415.3 684.1,418.5 685.3,416.7 686.5,419.5 687.7,414.4 689.0,414.8 690.2,420.4 691.4,422.5 692.7,414.4 693.9,419.2 695.1,418.2 696.3,418.5 697.6,421.5 698.8,422.5 700.0,411.5 701.2,415.3 702.5,421.4 703.7,423.6 704.9,419.6 706.1,421.0 707.4,421.7 708.6,424.5 709.8,420.5 711.0,423.6 712.3,421.0 713.5,419.7 714.7,423.7 715.9,425.2 717.2,422.0 718.4,420.0 719.6,420.1 720.9,423.8 722.1,421.8 723.3,423.2 724.5,423.4 725.8,416.7 727.0,421.3 728.2,422.5 729.4,418.5 730.7,424.9 731.9,424.8 733.1,416.9 734.3,420.4 735.6,422.7 736.8,421.6 738.0,415.6 739.2,422.0 740.5,420.3 741.7,421.2 742.9,418.7 744.2,422.2 745.4,421.0 746.6,419.6 747.8,420.0 749.1,419.5 750.3,419.7 751.5,420.1 752.7,418.4 754.0,413.1 755.2,417.1 756.4,418.9 757.6,413.2 758.9,418.6 760.1,418.3 761.3,417.9 762.5,418.4 763.8,417.0 765.0,419.3 766.2,420.1 767.4,419.1 768.7,419.3 769.9,418.2 771.1,417.5 772.4,418.5 773.6,420.0 774.8,415.6 776.0,419.2 777.3,420.6 778.5,418.9 779.7,419.5 780.9,416.5 782.2,419.2 783.4,419.4 784.6,420.4 785.8,416.3 787.1,413.9 788.3,416.0 789.5,421.0 790.7,415.9 792.0,417.6 793.2,416.5 794.4,417.9 795.6,419.8 796.9,418.4 798.1,417.9 799.3,416.5 800.6,415.9 801.8,416.3 803.0,417.7 804.2,416.9 805.5,417.1 806.7,417.9 807.9,420.0 809.1,418.5 810.4,416.5 811.6,415.6 812.8,416.4 814.0,416.7 815.3,416.8 816.5,416.3 817.7,418.0 818.9,418.3 820.2,418.7 821.4,417.4 822.6,416.4 823.8,415.5 825.1,418.8 826.3,416.3 827.5,417.2 828.8,412.8 830.0,415.6 831.2,414.0 832.4,416.0 833.7,415.8 834.9,418.1 836.1,416.5 837.3,415.1 838.6,417.7 839.8,416.3 841.0,416.0 842.2,416.4 843.5,417.6 844.7,416.1 845.9,416.9 847.1,415.4 848.4,414.9 849.6,415.8 850.8,416.3 852.1,416.1 853.3,413.6 854.5,414.9 855.7,416.9 857.0,417.2 858.2,415.1 859.4,415.8 860.6,415.3 861.9,416.4 863.1,414.9 864.3,416.4 865.5,417.0 866.8,415.3 868.0,415.2 869.2,416.2 870.4,415.5 871.7,414.9 872.9,416.5 874.1,415.7 875.3,414.1 876.6,416.0 877.8,416.9 879.0,416.0 880.3,414.1 881.5,416.0 882.7,414.3 883.9,416.9 885.2,414.9 886.4,415.3 887.6,415.1 888.8,413.9 890.1,414.4 891.3,417.0 892.5,415.5 893.7,413.8 895.0,412.8 896.2,415.3 897.4,414.6 898.6,415.2 899.9,413.9 901.1,414.3 902.3,413.0 903.5,415.5 904.8,414.5 906.0,414.0" fill="none" stroke="#C30B0A" stroke-width="1.8" stroke-dasharray="5 4"/>
<text x="906" y="414.2" class="cap" text-anchor="end" fill="#C30B0A">отложенная</text>
<text x="906" y="466.9" class="cap" text-anchor="end" fill="#3576C0">обучающая</text>
<text x="656" y="494" class="cap">минимум 0,0856 на 45-й эпохе,</text>
<text x="656" y="512" class="cap">дальше 0,1052 при 0,0018</text>
</g>
<text x="30" y="548" class="legend">зелёный — рабочий режим · красный — сломанный · всё измерено на той же сети 64 → 32 → 10</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="p1" data-focus="p1">
      <div class="step-kicker">Шаг 1 · шаг спуска</div>
      <h4>От 90 % до 10 % — решает одно число</h4>
<p>При η = 0,01 тридцати эпох не хватает: сеть доходит только до 90,22 %. При η = 0,3 — 97,78 %. При η = 3 обучение разваливается: 10,00 % — это ровно уровень случайного угадывания одного класса из десяти. Никакой промежуточной деградации нет, переход резкий.</p>
    </div>
    <div class="step-panel" data-on="p1 p2" data-focus="p2">
      <div class="step-kicker">Шаг 2 · размер батча</div>
      <h4>Батч из одной картинки при той же η не работает</h4>
<p>B = 8 и B = 32 дают одинаковые 97,78 %. B = 1347 (весь набор целиком) — 87,33 %: за 30 эпох получается всего 30 шагов, и сеть просто не успевает. B = 1 даёт 18,22 % — не потому, что это плохой метод, а потому, что при том же η каждый шаг делается по одной картинке и градиент слишком шумный. Размер батча и длина шага настраиваются вместе.</p>
    </div>
    <div class="step-panel" data-on="p1 p2 p3" data-focus="p3">
      <div class="step-kicker">Шаг 3 · нормировка</div>
      <h4>Деление на 16 — это тоже про длину шага</h4>
<p>Если подать сырые значения 0…16, тот же η = 0,3 убивает сеть: 10,00 %. Входы стали в 16 раз больше, значит, и градиент по весам — тоже, и шаг перелетает. Уменьшив η до 0,01, получаем работающие 95,78 %. Нормировка не «улучшает данные» — она приводит масштаб градиентов к тому, при котором привычные значения η имеют смысл.</p>
    </div>
    <div class="step-panel" data-on="p1 p2 p3 p4" data-focus="p4">
      <div class="step-kicker">Шаг 4 · перемешивание</div>
      <h4>80,67 % против 97,11 % на одних и тех же данных</h4>
<p>Здесь обучающая выборка отсортирована по классам: сначала все нули, потом все единицы. Без перемешивания сеть получает батчи, состоящие из одного класса, и каждый батч тянет её в свою сторону, забывая предыдущий. Одна строка кода — и те же данные дают на 16 процентных пунктов больше.</p>
    </div>
    <div class="step-panel" data-on="p1 p2 p3 p4 p5" data-focus="p5">
      <div class="step-kicker">Шаг 5 · крошечный батч</div>
      <h4>Один шаг по трём картинкам уронил обучение</h4>
<p>Если 1347 делить на 32 честно, в конце эпохи остаётся хвост из трёх картинок. Шаг по такому батчу — это шаг по трём примерам, и если один из них трудный, его вклад ничем не разбавлен: норма градиента вышла 4,92 против обычных 0,49. Потеря на всей обучающей выборке подскочила с 0,1108 до 1,9904 — на восстановление ушло несколько эпох. Поэтому остаток обычно либо отбрасывают, либо присоединяют к последнему батчу, как сделано у нас.</p>
    </div>
    <div class="step-panel" data-on="p1 p2 p3 p4 p5 p6" data-focus="p6">
      <div class="step-kicker">Шаг 6 · слишком долгое обучение</div>
      <h4>Обучающая потеря падает до 0,0018, отложенная растёт</h4>
<p>После 45-й эпохи кривые расходятся: сеть продолжает улучшать ответы на 1347 знакомых картинках и с 75-й эпохи знает их все наизусть (100 %), а на новых становится чуть хуже — 0,1052 против лучших 0,0856. Точность держится около 97 %, но запас уверенности тает. Это и есть переобучение: полезное запоминание закончилось, началось бесполезное.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте шаги стрелками ← →.</p>

<div class="callout-blue">
  <strong>Как это связано между собой:</strong> длина шага, размер батча и масштаб входа — по сути
  одна настройка, а не три. Увеличив входы в 16 раз, вы во столько же раз увеличили градиент по весам
  первого слоя; уменьшив батч, вы увеличили разброс градиента. И то и другое требует уменьшить η.
  Поэтому «хорошее» значение скорости обучения нельзя переносить из чужого кода, не проверив всё остальное.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> сеть ломается не постепенно, а резко. Между η = 1 (97,33 %)
  и η = 3 (10,00 %) нет плавного перехода — есть граница, после которой шаг перелетает долину и
  обучение перестаёт существовать. Поэтому первое, что проверяют при неработающем обучении, — не
  архитектуру, а скорость обучения и масштаб данных.
</div>

---

## Часть 12. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Данные — это две матрицы.</strong> X формы B × 64 и Y формы B × 10 с одинаковым числом
  строк. Картинка становится строкой, метка — строкой из одной единицы и девяти нулей.</li>
  <li><strong>Сеть — это 2410 чисел плюс правило их применения.</strong> Веса и смещения живут между
  батчами, активации рождаются и умирают внутри одного шага.</li>
  <li><strong>Прямой проход — два умножения матриц и две поэлементные операции.</strong>
  Z = XW + b меняет форму и смешивает числа, ReLU и softmax форму сохраняют.</li>
  <li><strong>Потеря — одно число, и у него есть ориентир.</strong> Для десяти классов необученная
  сеть даёт ln 10 = 2,3026; наш батч дал 2,1416.</li>
  <li><strong>Обратный проход начинается с (P − Y)/B.</strong> Softmax и кросс-энтропия вместе дают
  разность «выдали минус надо», и сумма этой разности по строке равна нулю.</li>
  <li><strong>Градиент веса — это вход слоя, транспонированный и умноженный на градиент выхода.</strong>
  Форма градиента всегда совпадает с формой того, по чему дифференцируем; ReLU назад работает маской.</li>
  <li><strong>Backward обязательно сверяется центральными разностями.</strong> Расхождение порядка
  10⁻¹⁰ означает «верно», всё, что заметно больше, — ошибка в коде, а не в ε.</li>
  <li><strong>Шаг: θ ← θ − η ∂L/∂θ, одинаково для всех параметров.</strong> Направление даёт градиент,
  длину выбираете вы, и она связана с размером батча и масштабом входов.</li>
  <li><strong>Эпоха = все картинки один раз, шаг = один батч.</strong> Перед каждой эпохой данные
  перемешиваются; 1347 картинок при батче 32 дают 42 шага.</li>
  <li><strong>После обучения смотрят не на точность, а на матрицу ошибок.</strong> Она показывает,
  куда именно сеть путается — у нас половина ошибок это ответ «единица».</li>
</ol>

<p>
  Если из статьи стоит унести одну картину, пусть это будет такая: обучение — это узкий цикл
  из пяти действий, в котором нет ни одного места для магии. Батч чисел проходит вперёд, превращается
  в одно число, это число едет назад и оставляет по производной на каждом параметре, параметры
  сдвигаются на долю процента — и так 1260 раз. Всё, что называется «сеть научилась распознавать
  цифры», — это накопленный результат 1260 маленьких, полностью понятных сдвигов.
</p>

<p class="tiny">
  Все числа в статье посчитаны на наборе digits из scikit-learn (1797 картинок 8 × 8, значения 0…16)
  собственной реализацией сети на NumPy: разбиение 1347/450 со стратификацией по классам, сеть
  64 → 32 → 10 с ReLU и softmax, инициализация весов нормальным распределением с масштабом
  <span class="math-inline" data-tex="\sqrt{2/n_{\text{вход}}}"></span> при фиксированном зерне,
  батч 32, скорость обучения 0,3, 30 эпох. Сквозной пример — первые четыре картинки первого батча
  первой эпохи. Аналитические градиенты сверены с центральными разностями при ε = 10⁻⁵ по всем
  2410 параметрам; худшее расхождение 3,7 · 10⁻¹¹. Округление везде до четырёх знаков после запятой,
  проценты — до двух. Выводы скриптов в тёмных врезках приведены дословно.
</p>

<p class="tiny"><a href="assets/code/mnist8-code.zip" download>Скачать код целиком (mnist8-code.zip)</a> — пять файлов на чистом NumPy: данные и сеть, основной прогон, сквозной пример со сверкой градиента, разбор ошибок и шесть экспериментов из части 11. Воспроизводит каждое число из статьи.</p>
