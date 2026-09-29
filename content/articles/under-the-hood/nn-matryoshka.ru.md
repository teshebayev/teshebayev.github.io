

<p class="lead">
  Полносвязная сеть — это одно действие «умножить строку на матрицу», вложенное
  само в себя столько раз, сколько у сети слоёв. Прямой проход вкладывает слои
  друг в друга, обратный раскрывает их снаружи внутрь.
</p>

<p>
  Я начну не с нейронов, а с того, что сеть получает и что должна отдать. Пока
  внутри сети пусто: сначала нужно договориться о форме входа и выхода, и только
  потом собирать то, что их соединяет.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Умножение матриц</strong>
    <p>Достаточно помнить, что строку можно умножить на матрицу, если совпадают внутренние размеры.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Цена квартиры</strong>
    <p>Квартира с <span class="math-inline" data-tex="m"></span> признаками, ответ — один из <span class="math-inline" data-tex="K"></span> ценовых классов. Одни и те же веса во всех частях.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Сеть любой глубины в матрицах</strong>
    <p>Вы распишете её в матрицах с размерностями, объясните, зачем нужна активация, подадите батч и проведёте градиент обратно.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные и структура</span>
  <span><i style="background:#C29E08"></i>операция и параметр</span>
  <span><i style="background:#73B222"></i>результат</span>
  <span><i style="background:#C30B0A"></i>ошибка и градиент</span>
  <span><i style="background:#E8590C"></i>слой 1</span>
  <span><i style="background:#7C3AED"></i>слой 2</span>
  <span><i style="background:#0D9488"></i>слой 3</span>
  <span><i style="background:#DB2777"></i>слой 4 (выходной)</span>
</div>

<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не
  на всю схему сразу, а только на яркую часть. Положение объектов остаётся
  постоянным, поэтому меняется именно смысл шага, а не карта перед глазами.
  Кнопки со стрелками на клавиатуре работают, когда сцена в фокусе.
</div>

<h2 id="part-1">Часть 1. Что входит в сеть и что выходит</h2>

<p>
  Задача такая: по описанию квартиры определить, к какому ценовому классу она
  относится — дорогая, средняя или дешёвая. Описание — это строка таблицы, где
  каждая колонка — <strong>признак</strong> (feature): площадь, число комнат,
  этаж и так далее. Сколько колонок в таблице, заранее не важно: обозначу их
  число буквой <span class="math-inline" data-tex="m"></span>. Классов тоже может быть сколько угодно, их
  число — <span class="math-inline" data-tex="K"></span>.
</p>

<p>
  Сеть ничего не знает про квартиры. Она видит только числа, поэтому объект
  превращается в <strong>вектор-строку</strong> длины <span class="math-inline" data-tex="m"></span>, а ответ — в строку
  длины <span class="math-inline" data-tex="K"></span>. Всё, что сеть делает, укладывается в одну запись:
</p>

<div class="math-display" data-tex="f:\ \mathbb{R}^{1\times m} \;\longrightarrow\; \mathbb{R}^{1\times K}"></div>

<div class="callout-blue">
  <strong>Почему строка, а не столбец:</strong> объекты в таблице лежат строками.
  Когда позже на вход придёт сразу пачка квартир, строки просто встанут друг под
  другом, и формулы не придётся переписывать.
</div>

<p>Посмотрим пошагово, как квартира становится входом, а класс — выходом.</p>

<div class="stage" id="stageObj" tabindex="0">
  <div class="stage-figure">
<svg id="ob" viewBox="0 0 960 560" role="img" aria-label="Квартира превращается во вход из m признаков, ценовой класс — в выход из K нейронов, между ними пока пустая сеть">
  <style>
    #ob { font-family: Helvetica, Arial, sans-serif; }
    #ob .bx   { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ob .by   { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; stroke-dasharray: 6 5; }
    #ob .bg   { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ob .bn   { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.2; }
    #ob .card { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.6; }
    #ob .sep  { stroke: #E0DDD3; stroke-width: 1; }
    #ob .lbl  { font-size: 17px; fill: #111111; }
    #ob .row  { font-size: 15px; fill: #111111; }
    #ob .val  { font-size: 15px; fill: #3576C0; font-weight: 700; }
    #ob .cap  { font-size: 14px; fill: #5E5850; }
    #ob .hdr  { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #ob .dots { font-size: 22px; fill: #5E5850; }
    #ob .shpB { font-size: 15px; fill: #3576C0; font-weight: 700; }
    #ob .shpG { font-size: 15px; fill: #5A8C1C; font-weight: 700; }
    #ob .opY  { font-size: 15px; fill: #8C7106; font-weight: 700; }
    #ob .q    { font-size: 44px; fill: #C29E08; font-weight: 700; }
    #ob .one  { font-size: 17px; fill: #5A8C1C; font-weight: 700; }
    #ob .edgeB{ stroke: #3576C0; stroke-width: 1.5; fill: none; }
    #ob .edgeY{ stroke: #C29E08; stroke-width: 1.5; fill: none; }
    #ob .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ob-arwB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
    <marker id="ob-arwY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
  </defs>
  <!-- Шаг 1: объект — квартира -->
  <g data-key="flat">
    <text x="130" y="60" class="hdr" text-anchor="middle">ОБЪЕКТ</text>
    <rect x="30" y="80" width="200" height="300" rx="10" class="card"/>
    <text x="46" y="116" class="row">площадь, м²</text>
    <text x="214" y="116" class="val" text-anchor="end">54</text>
    <line x1="42" y1="145" x2="218" y2="145" class="sep"/>
    <text x="46" y="186" class="row">комнат</text>
    <text x="214" y="186" class="val" text-anchor="end">2</text>
    <line x1="42" y1="215" x2="218" y2="215" class="sep"/>
    <text x="46" y="256" class="row">этаж</text>
    <text x="214" y="256" class="val" text-anchor="end">7</text>
    <line x1="42" y1="280" x2="218" y2="280" class="sep"/>
  </g>
  <!-- Шаг 2: первые три признака — входные нейроны -->
  <g data-key="feat3">
    <text x="330" y="60" class="hdr" text-anchor="middle">ВХОД</text>
    <line x1="232" y1="110" x2="304" y2="110" class="edgeB" marker-end="url(#ob-arwB)"/>
    <line x1="232" y1="180" x2="304" y2="180" class="edgeB" marker-end="url(#ob-arwB)"/>
    <line x1="232" y1="250" x2="304" y2="250" class="edgeB" marker-end="url(#ob-arwB)"/>
    <circle cx="330" cy="110" r="22" class="bx"/>
    <foreignObject x="300" y="91.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <circle cx="330" cy="180" r="22" class="bx"/>
    <foreignObject x="300" y="161.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <circle cx="330" cy="250" r="22" class="bx"/>
    <foreignObject x="300" y="231.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{3}"></div></foreignObject>
  </g>
  <!-- Шаг 3: признаков может быть сколько угодно, до m -->
  <g data-key="featm">
    <text x="130" y="306" class="dots" text-anchor="middle">⋮</text>
    <line x1="42" y1="325" x2="218" y2="325" class="sep"/>
    <foreignObject x="46" y="334.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>признак <span data-tex="m"></span></span></div></foreignObject>
    <text x="214" y="356" class="val" text-anchor="end">…</text>
    <text x="330" y="306" class="dots" text-anchor="middle">⋮</text>
    <line x1="232" y1="350" x2="304" y2="350" class="edgeB" marker-end="url(#ob-arwB)"/>
    <circle cx="330" cy="350" r="22" class="bx"/>
    <foreignObject x="300" y="331.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <foreignObject x="256.5" y="384.5" width="147" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="m"></span> признаков</span></div></foreignObject>
  </g>
  <!-- Шаг 4: вектор-строка x -->
  <g data-key="xvec">
    <foreignObject x="-11" y="421.9" width="73" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:17px;color:#111111;font-weight:400" data-tex="x ="></div></foreignObject>
    <rect x="70"  y="420" width="56" height="40" class="bx"/>
    <rect x="126" y="420" width="56" height="40" class="bx"/>
    <rect x="182" y="420" width="56" height="40" class="bx"/>
    <rect x="238" y="420" width="56" height="40" class="bx"/>
    <rect x="294" y="420" width="56" height="40" class="bx"/>
    <foreignObject x="68" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <foreignObject x="124" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <foreignObject x="180" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{3}"></div></foreignObject>
    <text x="266" y="446" class="lbl" text-anchor="middle">…</text>
    <foreignObject x="292" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <foreignObject x="132.5" y="468.6" width="155" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#3576C0;font-weight:700"><span>форма <span data-tex="1 \times m"></span></span></div></foreignObject>
  </g>
  <!-- Шаг 5: выход — K нейронов, по одному на класс -->
  <g data-key="outs">
    <text x="680" y="60" class="hdr" text-anchor="middle">ВЫХОД</text>
    <circle cx="680" cy="110" r="22" class="bg"/>
    <foreignObject x="650" y="91.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{1}"></div></foreignObject>
    <text x="712" y="115" class="cap">high</text>
    <circle cx="680" cy="180" r="22" class="bg"/>
    <foreignObject x="650" y="161.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{2}"></div></foreignObject>
    <text x="712" y="185" class="cap">medium</text>
    <circle cx="680" cy="250" r="22" class="bg"/>
    <foreignObject x="650" y="231.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{3}"></div></foreignObject>
    <text x="712" y="255" class="cap">low</text>
    <text x="680" y="306" class="dots" text-anchor="middle">⋮</text>
    <circle cx="680" cy="350" r="22" class="bg"/>
    <foreignObject x="650" y="331.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{K}"></div></foreignObject>
    <foreignObject x="712" y="335.5" width="107" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span>класс <span data-tex="K"></span></span></div></foreignObject>
    <foreignObject x="616.5" y="384.5" width="127" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="K"></span> классов</span></div></foreignObject>
    <foreignObject x="621" y="421.9" width="73" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:17px;color:#111111;font-weight:400" data-tex="y ="></div></foreignObject>
    <rect x="702" y="420" width="44" height="40" class="bg"/>
    <rect x="746" y="420" width="44" height="40" class="bg"/>
    <rect x="790" y="420" width="44" height="40" class="bg"/>
    <rect x="834" y="420" width="44" height="40" class="bg"/>
    <rect x="878" y="420" width="44" height="40" class="bg"/>
    <foreignObject x="694" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{1}"></div></foreignObject>
    <foreignObject x="738" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{2}"></div></foreignObject>
    <foreignObject x="782" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{3}"></div></foreignObject>
    <text x="856" y="446" class="lbl" text-anchor="middle">…</text>
    <foreignObject x="870" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{K}"></div></foreignObject>
    <foreignObject x="734.5" y="468.6" width="155" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#5A8C1C;font-weight:700"><span>форма <span data-tex="1 \times K"></span></span></div></foreignObject>
  </g>
  <!-- Шаг 6: правильный ответ one-hot -->
  <g data-key="target">
    <foreignObject x="826.5" y="40.5" width="107" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>ОТВЕТ <span data-tex="t"></span></span></div></foreignObject>
    <rect x="862" y="93"  width="36" height="34" rx="4" class="bn"/>
    <text x="880" y="116" class="lbl" text-anchor="middle">0</text>
    <rect x="862" y="163" width="36" height="34" rx="4" class="bg"/>
    <text x="880" y="186" class="one" text-anchor="middle">1</text>
    <rect x="862" y="233" width="36" height="34" rx="4" class="bn"/>
    <text x="880" y="256" class="lbl" text-anchor="middle">0</text>
    <text x="880" y="306" class="dots" text-anchor="middle">⋮</text>
    <rect x="862" y="333" width="36" height="34" rx="4" class="bn"/>
    <text x="880" y="356" class="lbl" text-anchor="middle">0</text>
    <text x="880" y="404" class="cap" text-anchor="middle">medium</text>
  </g>
  <!-- Шаг 7: сеть — пока пустая коробка -->
  <g data-key="net">
    <foreignObject x="472" y="40.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>СЕТЬ <span data-tex="f"></span></span></div></foreignObject>
    <line x1="354" y1="110" x2="436" y2="110" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="354" y1="180" x2="436" y2="180" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="354" y1="250" x2="436" y2="250" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="354" y1="350" x2="436" y2="350" class="edgeY" marker-end="url(#ob-arwY)"/>
    <rect x="440" y="80" width="160" height="300" rx="12" class="by"/>
    <text x="520" y="232" class="q" text-anchor="middle">?</text>
    <text x="520" y="268" class="cap" text-anchor="middle">соберём</text>
    <text x="520" y="288" class="cap" text-anchor="middle">слой за слоем</text>
    <line x1="602" y1="110" x2="654" y2="110" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="602" y1="180" x2="654" y2="180" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="602" y1="250" x2="654" y2="250" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="602" y1="350" x2="654" y2="350" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="360" y1="440" x2="650" y2="440" class="edgeY" marker-end="url(#ob-arwY)"/>
    <foreignObject x="481.5" y="406.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#8C7106;font-weight:700" data-tex="f"></div></foreignObject>
    <foreignObject x="411.5" y="444.5" width="187" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="1\times m \;\to\; 1\times K"></div></foreignObject>
  </g>
  <text x="30" y="545" class="legend">синий — вход · жёлтый — сеть (операция) · зелёный — выход и правильный ответ · числа иллюстративные</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="flat" data-focus="flat">
      <div class="step-kicker">Шаг 1 · объект</div>
      <h4>Квартира — это строка таблицы</h4>
      <p>
        Для сети квартира — не стены и окна, а набор чисел: площадь 54 м²,
        2 комнаты, 7-й этаж. Каждое число — отдельная колонка таблицы, то есть
        признак.
      </p>
    </div>
    <div class="step-panel" data-on="flat feat3" data-focus="feat3">
      <div class="step-kicker">Шаг 2 · признак → нейрон</div>
      <h4>Каждому признаку — свой входной нейрон</h4>
      <p>
        Входной слой ничего не вычисляет: он просто держит значения признаков.
        Площадь попадает в <span class="math-inline" data-tex="x_{1}"></span>, число комнат — в <span class="math-inline" data-tex="x_{2}"></span>,
        этаж — в <span class="math-inline" data-tex="x_{3}"></span>. Один признак — один кружок.
      </p>
    </div>
    <div class="step-panel" data-on="flat feat3 featm" data-focus="featm">
      <div class="step-kicker">Шаг 3 · сколько угодно признаков</div>
      <h4>Признаков не три, а <span class="math-inline" data-tex="m"></span></h4>
      <p>
        Три колонки — только пример. Добавим расстояние до метро, год постройки,
        наличие парковки — входных нейронов станет больше, а схема не
        изменится. Поэтому дальше я пишу общее число признаков буквой
        <span class="math-inline" data-tex="m"></span>, а последний вход — <span class="math-inline" data-tex="x_{m}"></span>.
      </p>
    </div>
    <div class="step-panel" data-on="flat feat3 featm xvec" data-focus="xvec">
      <div class="step-kicker">Шаг 4 · данные</div>
      <h4>Вход — вектор-строка длины <span class="math-inline" data-tex="m"></span></h4>
      <p>
        Столбик нейронов удобно рисовать, а считать удобнее со строкой: так же,
        как объект лежит в таблице. Её форма — <span class="math-inline" data-tex="1 \times m"></span>.
      </p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · та же квартира</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>В общем виде</span>
            <div class="math-display worked-math" data-tex="x = [\,x_1,\ x_2,\ x_3,\ \dots,\ x_m\,] \in \mathbb{R}^{1\times m}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Для нашей квартиры</span>
            <div class="math-display worked-math" data-tex="x = [\,54,\ 2,\ 7,\ \dots\,]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> позиция в
        строке и есть смысл числа. Сеть знает, что 54 — это площадь, только
        потому, что площадь всегда стоит первой.</p>
      </div>
    </div>
    <div class="step-panel" data-on="flat feat3 featm xvec outs" data-focus="outs">
      <div class="step-kicker">Шаг 5 · выход</div>
      <h4>На выходе — по нейрону на класс</h4>
      <p>
        Классов в примере три: high, medium, low. Но их число тоже не
        зашито — пусть будет <span class="math-inline" data-tex="K"></span>. Выход — строка
        <span class="math-inline" data-tex="y"></span> формы <span class="math-inline" data-tex="1 \times K"></span>: каждое число — насколько сеть «голосует» за
        свой класс.
      </p>
      <div class="math-display" data-tex="y = [\,y_1,\ y_2,\ \dots,\ y_K\,] \in \mathbb{R}^{1\times K}"></div>
    </div>
    <div class="step-panel" data-on="flat feat3 featm xvec outs target" data-focus="target">
      <div class="step-kicker">Шаг 6 · правильный ответ</div>
      <h4>Ответ записываем той же формой: one-hot</h4>
      <p>
        Наша квартира — medium. Чтобы сравнивать ответ с выходом сети,
        записываю его строкой той же длины <span class="math-inline" data-tex="K"></span>: единица на месте верного класса,
        нули на остальных.
      </p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · та же квартира</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Класс</span>
            <div class="math-display worked-math" data-tex="\text{medium} = \text{класс } 2"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>One-hot</span>
            <div class="math-display worked-math" data-tex="t = [\,0,\ 1,\ 0,\ \dots,\ 0\,]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> <span class="math-inline" data-tex="t"></span> и <span class="math-inline" data-tex="y"></span>
        одной формы <span class="math-inline" data-tex="1 \times K"></span>, поэтому их можно сравнивать поэлементно. Хорошая сеть
        выдаст <span class="math-inline" data-tex="y"></span>, в котором второе число заметно больше остальных.</p>
      </div>
    </div>
    <div class="step-panel" data-on="flat feat3 featm xvec outs target net" data-focus="net">
      <div class="step-kicker">Шаг 7 · операция</div>
      <h4>Сеть — это функция из <span class="math-inline" data-tex="1 \times m"></span> в <span class="math-inline" data-tex="1 \times K"></span></h4>
      <p>
        Между входом и выходом пока пустая коробка. Про неё известно только
        одно: она берёт строку длины <span class="math-inline" data-tex="m"></span> и возвращает строку длины <span class="math-inline" data-tex="K"></span>. Дальше я
        буду наполнять коробку слоями — каждый новый слой вкладывается вокруг
        предыдущего, как кукла в матрёшке.
      </p>
      <div class="math-display" data-tex="y = f(x),\qquad f:\ \mathbb{R}^{1\times m} \to \mathbb{R}^{1\times K}"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> сеть видит квартиру как строку из <span class="math-inline" data-tex="m"></span> чисел
  и должна вернуть строку из <span class="math-inline" data-tex="K"></span> чисел. Всё остальное — способ собрать функцию,
  которая переводит одно в другое.
</div>

<hr>

<h2 id="part-2">Часть 2. Один слой — это одна матрица</h2>

<p>
  Первый кирпич матрёшки — <strong>скрытый слой</strong> из <span class="math-inline" data-tex="d_{1}"></span> нейронов. Число
  входов <span class="math-inline" data-tex="m"></span> диктуют данные, а <span class="math-inline" data-tex="d_{1}"></span> я выбираю сам: это ширина слоя, настройка
  архитектуры. Слой <strong>полносвязный</strong>: каждый вход соединён с каждым
  нейроном, и у каждой связи свой вес.
</p>

<p>
  Отсюда сразу вопрос: сколько весов и как их хранить? Связей <span class="math-inline" data-tex="m \cdot d_1"></span>, и удобнее
  всего сложить их в таблицу, где строка отвечает за вход, а столбец — за
  нейрон. Эта таблица и есть <strong>матрица весов</strong> <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span> формы <span class="math-inline" data-tex="m \times d_{1}"></span>.
  Тогда весь слой считается одним умножением:
</p>

<div class="math-display" data-tex="h^{(1)} = x\,\textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1},\qquad [1\times m]\cdot[m\times d_1] = [1\times d_1]"></div>

<div class="callout-blue">
  <strong>Про индексы:</strong> в записи
  <span class="math-inline" data-tex="w^{(1)}_{ij}"></span> верхний индекс — номер
  слоя, нижние читаются «откуда → куда»: из входа <span class="math-inline" data-tex="x_{i}"></span> в нейрон
  <span class="math-inline" data-tex="h_{j}"></span>. Поэтому <span class="math-inline" data-tex="i"></span> — номер строки <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>, а <span class="math-inline" data-tex="j"></span> — номер столбца.
</div>

<p>Посмотрим пошагово, как рёбра схемы превращаются в ячейки матрицы.</p>

<div class="stage" id="stageLayer" tabindex="0">
  <div class="stage-figure">
<svg id="ly" viewBox="0 0 960 600" role="img" aria-label="Полносвязный слой: m входов, d1 нейронов и матрица весов W1 размером m на d1">
  <style>
    #ly { font-family: Helvetica, Arial, sans-serif; }
    #ly .bx   { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ly .bg   { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ly .by   { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.6; }
    #ly .cell { fill: #FFFFFF; stroke: #D8D2C4; stroke-width: 1; }
    #ly .hlc  { fill: #FFD8B5; stroke: #E8590C; stroke-width: 2; }
    #ly .hlr  { fill: none; stroke: #E8590C; stroke-width: 3; }
    #ly .lbl  { font-size: 17px; fill: #111111; }
    #ly .w    { font-size: 14px; fill: #5E5850; }
    #ly .cap  { font-size: 14px; fill: #5E5850; }
    #ly .capY { font-size: 14px; fill: #C2410C; font-weight: 700; }
    #ly .hdr  { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #ly .ttl  { font-size: 16px; fill: #C2410C; font-weight: 700; }
    #ly .dots { font-size: 22px; fill: #5E5850; }
    #ly .shp  { font-size: 14px; fill: #111111; font-weight: 700; }
    #ly .op   { font-size: 24px; fill: #5E5850; }
    #ly .eg   { stroke: #B9B2A4; stroke-width: 1; fill: none; }
    #ly .ey   { stroke: #E8590C; stroke-width: 2.2; fill: none; }
    #ly .wl   { font-size: 15px; fill: #C2410C; font-weight: 700; }
    #ly .bias { font-size: 14px; fill: #C2410C; font-weight: 700; }
    #ly .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ly-arwY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#E8590C"/>
    </marker>
  </defs>
  <g data-key="inp">
    <foreignObject x="51.5" y="30.5" width="117" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>ВХОД · <span data-tex="m"></span></span></div></foreignObject>
    <circle cx="110" cy="110" r="22" class="bx"/>
    <foreignObject x="80" y="91.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <circle cx="110" cy="180" r="22" class="bx"/>
    <foreignObject x="80" y="161.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <circle cx="110" cy="250" r="22" class="bx"/>
    <foreignObject x="80" y="231.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{3}"></div></foreignObject>
    <circle cx="110" cy="350" r="22" class="bx"/>
    <foreignObject x="80" y="331.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <text x="110" y="306" class="dots" text-anchor="middle">⋮</text>
  </g>
  <g data-key="hid">
    <foreignObject x="281" y="30.5" width="238" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>СЛОЙ 1 · <span data-tex="d_1"></span> нейронов</span></div></foreignObject>
    <circle cx="400" cy="90" r="22" class="bg"/>
    <foreignObject x="370" y="71.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <circle cx="400" cy="150" r="22" class="bg"/>
    <foreignObject x="370" y="131.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <circle cx="400" cy="210" r="22" class="bg"/>
    <foreignObject x="370" y="191.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <circle cx="400" cy="270" r="22" class="bg"/>
    <foreignObject x="370" y="251.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{4}"></div></foreignObject>
    <circle cx="400" cy="360" r="22" class="bg"/>
    <foreignObject x="363.5" y="341.9" width="73" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{d_{1}}"></div></foreignObject>
    <text x="400" y="322" class="dots" text-anchor="middle">⋮</text>
    <foreignObject x="301.5" y="390.5" width="197" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="d_1"></span> выбираем сами</span></div></foreignObject>
  </g>
  <g data-key="edges">
    <line x1="131.9" y1="108.5" x2="375.1" y2="91.7" class="eg"/>
    <line x1="131.8" y1="113.0" x2="375.2" y2="146.6" class="eg"/>
    <line x1="130.8" y1="117.2" x2="376.4" y2="201.9" class="eg"/>
    <line x1="129.3" y1="120.6" x2="378.1" y2="257.9" class="eg"/>
    <line x1="126.7" y1="124.4" x2="381.1" y2="343.7" class="eg"/>
    <line x1="131.0" y1="173.5" x2="376.1" y2="97.4" class="eg"/>
    <line x1="131.9" y1="177.7" x2="375.1" y2="152.6" class="eg"/>
    <line x1="131.9" y1="182.3" x2="375.1" y2="207.4" class="eg"/>
    <line x1="131.0" y1="186.5" x2="376.1" y2="262.6" class="eg"/>
    <line x1="128.7" y1="191.6" x2="378.8" y2="346.8" class="eg"/>
    <line x1="129.3" y1="239.4" x2="378.1" y2="102.1" class="eg"/>
    <line x1="130.8" y1="242.8" x2="376.4" y2="158.1" class="eg"/>
    <line x1="131.8" y1="247.0" x2="375.2" y2="213.4" class="eg"/>
    <line x1="131.9" y1="251.5" x2="375.1" y2="268.3" class="eg"/>
    <line x1="130.6" y1="257.8" x2="376.6" y2="351.1" class="eg"/>
    <line x1="126.4" y1="335.3" x2="381.4" y2="106.7" class="eg"/>
    <line x1="128.1" y1="337.5" x2="379.4" y2="164.2" class="eg"/>
    <line x1="129.8" y1="340.4" x2="377.5" y2="220.9" class="eg"/>
    <line x1="131.2" y1="344.1" x2="375.9" y2="276.6" class="eg"/>
    <line x1="132.0" y1="350.8" x2="375.0" y2="359.1" class="eg"/>
    <foreignObject x="171.5" y="390.5" width="167" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="m \cdot d_1"></span> связей</span></div></foreignObject>
  </g>
  <g data-key="one" data-only="1">
    <line x1="131.8" y1="113.0" x2="375.2" y2="146.6" class="ey" marker-end="url(#ly-arwY)"/>
    <rect x="226" y="104" width="62" height="22" rx="4" fill="#FFFFFF"/>
    <foreignObject x="206.5" y="99.6" width="101" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="w^{(1)}_{12}"></div></foreignObject>
  </g>
  <g data-key="row" data-only="1">
    <line x1="131.9" y1="108.5" x2="375.1" y2="91.7" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="131.8" y1="113.0" x2="375.2" y2="146.6" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="130.8" y1="117.2" x2="376.4" y2="201.9" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="129.3" y1="120.6" x2="378.1" y2="257.9" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="126.7" y1="124.4" x2="381.1" y2="343.7" class="ey" marker-end="url(#ly-arwY)"/>
  </g>
  <g data-key="col" data-only="1">
    <line x1="131.8" y1="113.0" x2="375.2" y2="146.6" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="131.9" y1="177.7" x2="375.1" y2="152.6" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="130.8" y1="242.8" x2="376.4" y2="158.1" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="128.1" y1="337.5" x2="379.4" y2="164.2" class="ey" marker-end="url(#ly-arwY)"/>
  </g>
  <g data-key="grid">
    <foreignObject x="630.5" y="61.2" width="255" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#C2410C;font-weight:700"><span><span data-tex="\textcolor{#C2410C}{W_1}"></span> — матрица <span data-tex="m \times d_1"></span></span></div></foreignObject>
    <foreignObject x="590" y="100.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <foreignObject x="646" y="100.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <foreignObject x="702" y="100.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <foreignObject x="758" y="100.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{4}"></div></foreignObject>
    <text x="842" y="120" class="cap" text-anchor="middle">…</text>
    <foreignObject x="865" y="100.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{d_{1}}"></div></foreignObject>
    <foreignObject x="544" y="135.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <rect x="590" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="585" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{11}"></div></foreignObject>
    <rect x="646" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="641" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{12}"></div></foreignObject>
    <rect x="702" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="697" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{13}"></div></foreignObject>
    <rect x="758" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="753" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{14}"></div></foreignObject>
    <rect x="814" y="130" width="56" height="40" class="cell"/>
    <text x="842" y="155" class="w" text-anchor="middle">…</text>
    <rect x="870" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="855" y="135.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{1,d_{1}}"></div></foreignObject>
    <foreignObject x="544" y="175.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <rect x="590" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="585" y="175.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{21}"></div></foreignObject>
    <rect x="646" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="641" y="175.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{22}"></div></foreignObject>
    <rect x="702" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="697" y="175.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{23}"></div></foreignObject>
    <rect x="758" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="753" y="175.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{24}"></div></foreignObject>
    <rect x="814" y="170" width="56" height="40" class="cell"/>
    <text x="842" y="195" class="w" text-anchor="middle">…</text>
    <rect x="870" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="855" y="175.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{2,d_{1}}"></div></foreignObject>
    <foreignObject x="544" y="215.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="x_{3}"></div></foreignObject>
    <rect x="590" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="585" y="215.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{31}"></div></foreignObject>
    <rect x="646" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="641" y="215.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{32}"></div></foreignObject>
    <rect x="702" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="697" y="215.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{33}"></div></foreignObject>
    <rect x="758" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="753" y="215.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{34}"></div></foreignObject>
    <rect x="814" y="210" width="56" height="40" class="cell"/>
    <text x="842" y="235" class="w" text-anchor="middle">…</text>
    <rect x="870" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="855" y="215.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{3,d_{1}}"></div></foreignObject>
    <text x="572" y="276" class="cap" text-anchor="middle">⋮</text>
    <rect x="590" y="250" width="56" height="40" class="cell"/>
    <text x="618" y="275" class="w" text-anchor="middle">⋮</text>
    <rect x="646" y="250" width="56" height="40" class="cell"/>
    <text x="674" y="275" class="w" text-anchor="middle">⋮</text>
    <rect x="702" y="250" width="56" height="40" class="cell"/>
    <text x="730" y="275" class="w" text-anchor="middle">⋮</text>
    <rect x="758" y="250" width="56" height="40" class="cell"/>
    <text x="786" y="275" class="w" text-anchor="middle">⋮</text>
    <rect x="814" y="250" width="56" height="40" class="cell"/>
    <text x="842" y="275" class="w" text-anchor="middle">⋱</text>
    <rect x="870" y="250" width="56" height="40" class="cell"/>
    <text x="898" y="275" class="w" text-anchor="middle">⋮</text>
    <foreignObject x="544" y="295.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <rect x="590" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="585" y="295.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m1}"></div></foreignObject>
    <rect x="646" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="641" y="295.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m2}"></div></foreignObject>
    <rect x="702" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="697" y="295.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m3}"></div></foreignObject>
    <rect x="758" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="753" y="295.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m4}"></div></foreignObject>
    <rect x="814" y="290" width="56" height="40" class="cell"/>
    <text x="842" y="315" class="w" text-anchor="middle">…</text>
    <rect x="870" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="855" y="295.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m,d_{1}}"></div></foreignObject>
  </g>
  <g data-key="cell" data-only="1">
    <rect x="646" y="130" width="56" height="40" class="hlc"/>
    <foreignObject x="641" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="w_{12}"></div></foreignObject>
    <text x="758" y="366" class="capY" text-anchor="middle">одна связь = одна ячейка</text>
  </g>
  <g data-key="rowhl" data-only="1">
    <rect x="590" y="130" width="336" height="40" class="hlr"/>
    <foreignObject x="573.5" y="346.5" width="369" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700"><span>строка <span data-tex="i"></span> — всё, что выходит из <span data-tex="x_i"></span></span></div></foreignObject>
  </g>
  <g data-key="colhl" data-only="1">
    <rect x="646" y="130" width="56" height="200" class="hlr"/>
    <foreignObject x="578.5" y="346.5" width="359" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700"><span>столбец <span data-tex="j"></span> — всё, что входит в <span data-tex="h_j"></span></span></div></foreignObject>
  </g>
  <g data-key="dot" data-only="1">
    <foreignObject x="40" y="440" width="880" height="56">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-lg svg-math-center" data-tex="h_2 = x_1 w_{12} + x_2 w_{22} + \dots + x_m w_{m2} = \sum_{i=1}^{m} x_i\, w_{i2}"></div>
    </foreignObject>
  </g>
  <g data-key="mat" data-only="1">
    <rect x="60" y="473" width="90" height="24" class="bx"/>
    <foreignObject x="62" y="495.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="1 \times  m"></div></foreignObject>
    <text x="170" y="493" class="op" text-anchor="middle">·</text>
    <rect x="190" y="440" width="150" height="90" class="by"/>
    <foreignObject x="217" y="470.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="m \times  d_{1}"></div></foreignObject>
    <text x="555" y="493" class="op" text-anchor="middle">=</text>
    <rect x="580" y="473" width="150" height="24" class="bg"/>
    <foreignObject x="607" y="495.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="1 \times  d_{1}"></div></foreignObject>
  </g>
  <g data-key="fmat" data-only="1">
    <foreignObject x="750" y="466" width="200" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="h^{(1)} = x\,\textcolor{#C2410C}{W_1}"></div>
    </foreignObject>
  </g>
  <g data-key="bias" data-only="1">
    <text x="360" y="493" class="op" text-anchor="middle">+</text>
    <rect x="380" y="473" width="150" height="24" class="by"/>
    <foreignObject x="407" y="495.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="1 \times  d_{1}"></div></foreignObject>
    <foreignObject x="750" y="466" width="200" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="h^{(1)} = x\,\textcolor{#C2410C}{W_1} + \textcolor{#C2410C}{b_1}"></div>
    </foreignObject>
    <foreignObject x="428" y="56.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
    <foreignObject x="428" y="116.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
    <foreignObject x="428" y="176.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
    <foreignObject x="428" y="236.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
    <foreignObject x="428" y="326.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
  </g>
  <text x="30" y="585" class="legend">синий — вход · оранжевый — веса и смещение слоя 1 · зелёный — выход слоя</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="inp hid edges" data-focus="edges">
      <div class="step-kicker">Шаг 1 · структура</div>
      <h4>Каждый вход связан с каждым нейроном</h4>
      <p>
        Слева <span class="math-inline" data-tex="m"></span> входов, справа <span class="math-inline" data-tex="d_{1}"></span> нейронов первого скрытого слоя. Связей
        <span class="math-inline" data-tex="m \cdot d_1"></span>, по одной на каждую пару. Число <span class="math-inline" data-tex="m"></span> задают данные, а <span class="math-inline" data-tex="d_{1}"></span> — мой
        выбор: слой может быть и шире входа, и уже.
      </p>
    </div>
    <div class="step-panel" data-on="inp hid edges one grid cell" data-focus="one cell">
      <div class="step-kicker">Шаг 2 · параметр</div>
      <h4>Одна связь — один вес — одна ячейка</h4>
      <p>
        У связи из <span class="math-inline" data-tex="x_{1}"></span> в <span class="math-inline" data-tex="h_{2}"></span> свой вес
        <span class="math-inline" data-tex="w^{(1)}_{12}"></span>: слой 1,
        из входа 1 в нейрон 2. Сложим все веса в таблицу так, чтобы номер входа
        был номером строки, а номер нейрона — номером столбца. Этот вес
        окажется в строке 1, столбце 2.
      </p>
    </div>
    <div class="step-panel" data-on="inp hid edges row grid rowhl" data-focus="row rowhl">
      <div class="step-kicker">Шаг 3 · строка</div>
      <h4>Всё, что выходит из одного входа, — строка <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span></h4>
      <p>
        Возьмём веса, которые выходят из <span class="math-inline" data-tex="x_{1}"></span> во все нейроны слоя.
        Их <span class="math-inline" data-tex="d_{1}"></span> штук, и все они лежат в первой строке матрицы. Это ещё не слой,
        а только вклад одного признака во все нейроны сразу.
      </p>
    </div>
    <div class="step-panel" data-on="inp hid edges col grid colhl" data-focus="col colhl">
      <div class="step-kicker">Шаг 4 · столбец</div>
      <h4>Всё, что входит в один нейрон, — столбец <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span></h4>
      <p>
        Теперь посмотрим с другой стороны: какие веса приходят в нейрон
        <span class="math-inline" data-tex="h_{2}"></span>? По одному от каждого входа, всего <span class="math-inline" data-tex="m"></span>. Они лежат во
        втором столбце. Для вычисления нейрона нужен именно столбец.
      </p>
    </div>
    <div class="step-panel" data-on="inp hid edges col grid colhl dot" data-focus="dot">
      <div class="step-kicker">Шаг 5 · операция</div>
      <h4>Нейрон — скалярное произведение <span class="math-inline" data-tex="x"></span> на свой столбец</h4>
      <p>
        Нейрон умножает каждый вход на вес своей связи и складывает. Это ровно
        скалярное произведение строки <span class="math-inline" data-tex="x"></span> на столбец <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>.
      </p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · три признака квартиры</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Считаем второй нейрон для квартиры 54 · 2 · 7</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">площадь</div>
            <div class="math-display worked-trace-math" data-tex="54 \cdot (-0.01) = -0.54"></div>
            <div class="worked-trace-note">большое число, маленький вес</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">комнаты</div>
            <div class="math-display worked-trace-math" data-tex="2 \cdot 0.30 = 0.60"></div>
            <div class="worked-trace-note">вклад того же порядка</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">этаж</div>
            <div class="math-display worked-trace-math" data-tex="7 \cdot 0.20 = 1.40"></div>
            <div class="worked-trace-note">самый большой вклад</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">сумма</div>
            <div class="math-display worked-trace-math" data-tex="h_2 = -0.54 + 0.60 + 1.40 = 1.46"></div>
            <div class="worked-trace-note">одно число на нейрон</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> вклад
        признака зависит и от его значения, и от веса. Площадь 54 в разы больше
        этажа 7, но из-за веса −0.01 её вклад меньше.</p>
      </div>
    </div>
    <div class="step-panel" data-on="inp hid edges grid mat fmat" data-focus="mat fmat">
      <div class="step-kicker">Шаг 6 · результат</div>
      <h4>Все нейроны сразу — одно умножение <span class="math-inline" data-tex="x \cdot \textcolor{#EA580C}{W_1}"></span></h4>
      <p>
        Каждый нейрон — это <span class="math-inline" data-tex="x"></span> на свой столбец. Если сделать это для всех <span class="math-inline" data-tex="d_{1}"></span>
        столбцов разом, получится умножение строки на матрицу. Внутренние
        размеры совпадают (<span class="math-inline" data-tex="m"></span> и <span class="math-inline" data-tex="m"></span>), а наружу остаётся строка <span class="math-inline" data-tex="1 \times d_{1}"></span> — по числу
        на нейрон.
      </p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · 3 признака, 4 нейрона</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="[54,\ 2,\ 7]\begin{bmatrix}0.02 &amp; -0.01 &amp; 0.03 &amp; 0\\ 0.5 &amp; 0.3 &amp; -0.4 &amp; 0.1\\ -0.1 &amp; 0.2 &amp; 0.05 &amp; 0.3\end{bmatrix}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="x \textcolor{#EA580C}{W_1} = [1.38,\ 1.46,\ 1.17,\ 2.30]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> второе
        число 1.46 — тот же <span class="math-inline" data-tex="h_{2}"></span>, что на прошлом шаге. Матричное умножение ничего
        нового не делает, оно просто считает все нейроны за один раз.</p>
      </div>
    </div>
    <div class="step-panel" data-on="inp hid edges grid mat bias" data-focus="bias">
      <div class="step-kicker">Шаг 7 · параметр</div>
      <h4>Смещение: у каждого нейрона своя поправка</h4>
      <p>
        К каждому нейрону добавляется ещё одно число — смещение
        <span class="math-inline" data-tex="b"></span>. Все смещения слоя складываются в строку <span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span> той же
        формы <span class="math-inline" data-tex="1 \times d_{1}"></span>. Итого у слоя <span class="math-inline" data-tex="m \cdot d_1 + d_1"></span> параметров: при <span class="math-inline" data-tex="m = 3"></span> и <span class="math-inline" data-tex="d_1 = 4"></span>
        это <span class="math-inline" data-tex="12 + 4 = 16"></span>.
      </p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · смещения слоя</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="[1.38,\ 1.46,\ 1.17,\ 2.30] + [0.1,\ -0.2,\ 0,\ -0.5]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="h^{(1)} = [1.48,\ 1.26,\ 1.17,\ 1.80]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> смещение
        не зависит от квартиры. Оно сдвигает «точку отсчёта» нейрона: даже при
        нулевом входе нейрон выдаст своё <span class="math-inline" data-tex="b"></span>.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> слой — это матрица <span class="math-inline" data-tex="m \times d_{1}"></span>, где строки —
  входы, а столбцы — нейроны. Весь слой считается одной формулой
  <span class="math-inline" data-tex="x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1}"></span>, и из строки длины <span class="math-inline" data-tex="m"></span> получается строка длины <span class="math-inline" data-tex="d_{1}"></span>.
</div>

<hr>

<h2 id="part-3">Часть 3. Слой за слоем: матрёшка собирается</h2>

<p>
  Один слой превращает строку длины <span class="math-inline" data-tex="m"></span> в строку длины <span class="math-inline" data-tex="d_{1}"></span>. Но <span class="math-inline" data-tex="h^{(1)}"></span> — такая же
  строка чисел, как и <span class="math-inline" data-tex="x"></span>, поэтому её можно подать на вход следующему слою. Тот
  сделает то же самое: умножит на свою матрицу <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> и прибавит своё смещение <span class="math-inline" data-tex="\textcolor{#8B5CF6}{b_2}"></span>.
  Каждый новый слой <strong>оборачивает</strong> всё, что было посчитано до него.
</p>

<div class="math-display" data-tex="y = \Big(\big((x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1})\, \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}\big)\, \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}\Big)\, \textcolor{#DB2777}{W_4} + \textcolor{#DB2777}{b_4}"></div>

<p>
  Размеры матриц при этом не произвольны. Сколько строк у <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span>, решает не <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span>, а
  предыдущий слой: строк столько, сколько нейронов пришло на вход. Столбцов —
  сколько нейронов будет в новом слое. Размеры стыкуются, как костяшки
  домино.
</p>

<div class="callout-blue">
  <strong>Почему скрытых слоёв три:</strong> число не особенное. Скрытых слоёв
  может быть сколько угодно, три — ровно столько, чтобы увидеть закономерность
  и не утонуть в индексах.
</div>

<p>Посмотрим пошагово, как добавляется каждая оболочка.</p>

<div class="stage" id="stageStack" tabindex="0">
  <div class="stage-figure">
<svg id="mt" viewBox="0 0 960 640" role="img" aria-label="Сеть из четырёх слоёв собирается как матрёшка: размеры матриц весов стыкуются как домино">
  <style>
    #mt { font-family: Helvetica, Arial, sans-serif; }
    #mt .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mt .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #mt .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #mt .tb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #mt .ty { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #mt .tr { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 2; }
    #mt .div { stroke: #5E5850; stroke-width: 1; stroke-dasharray: 3 3; }
    #mt .nl { font-size: 15px; fill: #111111; }
    #mt .dm { font-size: 18px; fill: #111111; font-weight: 700; }
    #mt .dmr { font-size: 18px; fill: #C30B0A; font-weight: 700; }
    #mt .tn { font-size: 15px; fill: #5E5850; }
    #mt .hdr { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #mt .sec { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #mt .dots { font-size: 18px; fill: #5E5850; }
    #mt .eg { stroke: #C8C1B3; stroke-width: 0.9; fill: none; }
    #mt .wl { font-size: 16px; fill: #8C7106; font-weight: 700; }
    #mt .sh { fill: none; stroke: #C29E08; stroke-width: 1.8; }
    #mt .shl { font-size: 15px; fill: #8C7106; font-weight: 700; }
    #mt .inx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mt .ok { stroke: #73B222; stroke-width: 2.2; fill: none; }
    #mt .okt { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #mt .bad { stroke: #C30B0A; stroke-width: 2.4; }
    #mt .badt { font-size: 14px; fill: #C30B0A; font-weight: 700; }
    #mt .num { font-size: 14px; fill: #111111; font-weight: 700; }
    #mt .res { font-size: 17px; fill: #5A8C1C; font-weight: 700; }
    #mt .legend { font-size: 13px; fill: #5E5850; }
    #mt .l1  { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.8; }
    #mt .l1e { stroke: #E8590C; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #mt .l1s { fill: none; stroke: #E8590C; stroke-width: 2.2; }
    #mt .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #mt .l2e { stroke: #7C3AED; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #mt .l2s { fill: none; stroke: #7C3AED; stroke-width: 2.2; }
    #mt .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
    #mt .l3e { stroke: #0D9488; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #mt .l3s { fill: none; stroke: #0D9488; stroke-width: 2.2; }
    #mt .l4  { fill: #FDEBF4; stroke: #DB2777; stroke-width: 1.8; }
    #mt .l4e { stroke: #DB2777; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #mt .l4s { fill: none; stroke: #DB2777; stroke-width: 2.2; }
  </style>
  <g data-key="inp">
    <foreignObject x="34.5" y="37.8" width="111" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>ВХОД · <span data-tex="m"></span></span></div></foreignObject>
    <circle cx="90" cy="96" r="16" class="bx"/>
    <foreignObject x="61" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <circle cx="90" cy="140" r="16" class="bx"/>
    <foreignObject x="61" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <circle cx="90" cy="184" r="16" class="bx"/>
    <foreignObject x="61" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{3}"></div></foreignObject>
    <circle cx="90" cy="242" r="16" class="bx"/>
    <foreignObject x="61" y="225.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <text x="90" y="222" class="dots" text-anchor="middle">⋮</text>
    <rect x="65" y="318" width="150" height="50" rx="8" class="tb"/>
    <line x1="140.0" y1="326" x2="140.0" y2="360" class="div"/>
    <text x="102.5" y="349" class="dm" text-anchor="middle">1</text>
    <foreignObject x="153" y="323.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="m"></div></foreignObject>
    <foreignObject x="116.5" y="368.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#5E5850;font-weight:400" data-tex="x"></div></foreignObject>
    <text x="30" y="300" class="sec">ДОМИНО РАЗМЕРОВ</text>
    <text x="30" y="456" class="sec">МАТРЁШКА</text>
    <rect x="291" y="502" width="50" height="36" rx="6" class="inx"/>
    <foreignObject x="292.5" y="504.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
  </g>
  <g data-key="L1">
    <foreignObject x="220.5" y="37.8" width="139" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#C2410C;font-weight:400;letter-spacing:.04em"><span>СЛОЙ 1 · <span data-tex="d_1"></span></span></div></foreignObject>
    <circle cx="290" cy="96" r="16" class="l1"/>
    <foreignObject x="261" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <circle cx="290" cy="140" r="16" class="l1"/>
    <foreignObject x="261" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <circle cx="290" cy="184" r="16" class="l1"/>
    <foreignObject x="261" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <circle cx="290" cy="242" r="16" class="l1"/>
    <foreignObject x="256" y="225.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{d_{1}}"></div></foreignObject>
    <text x="290" y="222" class="dots" text-anchor="middle">⋮</text>
    <line x1="106.0" y1="96.0" x2="274.0" y2="96.0" class="l1e"/>
    <line x1="105.6" y1="99.4" x2="274.4" y2="136.6" class="l1e"/>
    <line x1="104.6" y1="102.4" x2="275.4" y2="177.6" class="l1e"/>
    <line x1="102.9" y1="105.4" x2="277.1" y2="232.6" class="l1e"/>
    <line x1="105.6" y1="136.6" x2="274.4" y2="99.4" class="l1e"/>
    <line x1="106.0" y1="140.0" x2="274.0" y2="140.0" class="l1e"/>
    <line x1="105.6" y1="143.4" x2="274.4" y2="180.6" class="l1e"/>
    <line x1="104.3" y1="147.3" x2="275.7" y2="234.7" class="l1e"/>
    <line x1="104.6" y1="177.6" x2="275.4" y2="102.4" class="l1e"/>
    <line x1="105.6" y1="180.6" x2="274.4" y2="143.4" class="l1e"/>
    <line x1="106.0" y1="184.0" x2="274.0" y2="184.0" class="l1e"/>
    <line x1="105.4" y1="188.5" x2="274.6" y2="237.5" class="l1e"/>
    <line x1="102.9" y1="232.6" x2="277.1" y2="105.4" class="l1e"/>
    <line x1="104.3" y1="234.7" x2="275.7" y2="147.3" class="l1e"/>
    <line x1="105.4" y1="237.5" x2="274.6" y2="188.5" class="l1e"/>
    <line x1="106.0" y1="242.0" x2="274.0" y2="242.0" class="l1e"/>
    <foreignObject x="160.5" y="61.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="235" y="318" width="150" height="50" rx="8" class="l1"/>
    <line x1="310.0" y1="326" x2="310.0" y2="360" class="div"/>
    <foreignObject x="248" y="323.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="m"></div></foreignObject>
    <foreignObject x="316.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="d_{1}"></div></foreignObject>
    <foreignObject x="281" y="368.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#C2410C;font-weight:400" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="277" y="494" width="174" height="52" rx="10" class="l1s"/>
    <foreignObject x="351" y="504.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="\cdot\, \textcolor{#C2410C}{W_1} + \textcolor{#C2410C}{b_1}"></div></foreignObject>
  </g>
  <g data-key="L2">
    <foreignObject x="420.5" y="37.8" width="139" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#6D28D9;font-weight:400;letter-spacing:.04em"><span>СЛОЙ 2 · <span data-tex="d_2"></span></span></div></foreignObject>
    <circle cx="490" cy="96" r="16" class="l2"/>
    <foreignObject x="461" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <circle cx="490" cy="140" r="16" class="l2"/>
    <foreignObject x="461" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <circle cx="490" cy="184" r="16" class="l2"/>
    <foreignObject x="461" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <circle cx="490" cy="242" r="16" class="l2"/>
    <foreignObject x="456" y="225.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{d_{2}}"></div></foreignObject>
    <text x="490" y="222" class="dots" text-anchor="middle">⋮</text>
    <line x1="306.0" y1="96.0" x2="474.0" y2="96.0" class="l2e"/>
    <line x1="305.6" y1="99.4" x2="474.4" y2="136.6" class="l2e"/>
    <line x1="304.6" y1="102.4" x2="475.4" y2="177.6" class="l2e"/>
    <line x1="302.9" y1="105.4" x2="477.1" y2="232.6" class="l2e"/>
    <line x1="305.6" y1="136.6" x2="474.4" y2="99.4" class="l2e"/>
    <line x1="306.0" y1="140.0" x2="474.0" y2="140.0" class="l2e"/>
    <line x1="305.6" y1="143.4" x2="474.4" y2="180.6" class="l2e"/>
    <line x1="304.3" y1="147.3" x2="475.7" y2="234.7" class="l2e"/>
    <line x1="304.6" y1="177.6" x2="475.4" y2="102.4" class="l2e"/>
    <line x1="305.6" y1="180.6" x2="474.4" y2="143.4" class="l2e"/>
    <line x1="306.0" y1="184.0" x2="474.0" y2="184.0" class="l2e"/>
    <line x1="305.4" y1="188.5" x2="474.6" y2="237.5" class="l2e"/>
    <line x1="302.9" y1="232.6" x2="477.1" y2="105.4" class="l2e"/>
    <line x1="304.3" y1="234.7" x2="475.7" y2="147.3" class="l2e"/>
    <line x1="305.4" y1="237.5" x2="474.6" y2="188.5" class="l2e"/>
    <line x1="306.0" y1="242.0" x2="474.0" y2="242.0" class="l2e"/>
    <foreignObject x="360.5" y="61.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="405" y="318" width="150" height="50" rx="8" class="l2"/>
    <line x1="480.0" y1="326" x2="480.0" y2="360" class="div"/>
    <foreignObject x="411.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="d_{1}"></div></foreignObject>
    <foreignObject x="486.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="d_{2}"></div></foreignObject>
    <foreignObject x="451" y="368.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#6D28D9;font-weight:400" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="263" y="486" width="298" height="68" rx="12" class="l2s"/>
    <foreignObject x="461" y="504.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#6D28D9;font-weight:700" data-tex="\cdot\, \textcolor{#6D28D9}{W_2} + \textcolor{#6D28D9}{b_2}"></div></foreignObject>
  </g>
  <g data-key="L3">
    <foreignObject x="620.5" y="37.8" width="139" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#0F766E;font-weight:400;letter-spacing:.04em"><span>СЛОЙ 3 · <span data-tex="d_3"></span></span></div></foreignObject>
    <circle cx="690" cy="96" r="16" class="l3"/>
    <foreignObject x="661" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <circle cx="690" cy="140" r="16" class="l3"/>
    <foreignObject x="661" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <circle cx="690" cy="184" r="16" class="l3"/>
    <foreignObject x="661" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <circle cx="690" cy="242" r="16" class="l3"/>
    <foreignObject x="656" y="225.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{d_{3}}"></div></foreignObject>
    <text x="690" y="222" class="dots" text-anchor="middle">⋮</text>
    <line x1="506.0" y1="96.0" x2="674.0" y2="96.0" class="l3e"/>
    <line x1="505.6" y1="99.4" x2="674.4" y2="136.6" class="l3e"/>
    <line x1="504.6" y1="102.4" x2="675.4" y2="177.6" class="l3e"/>
    <line x1="502.9" y1="105.4" x2="677.1" y2="232.6" class="l3e"/>
    <line x1="505.6" y1="136.6" x2="674.4" y2="99.4" class="l3e"/>
    <line x1="506.0" y1="140.0" x2="674.0" y2="140.0" class="l3e"/>
    <line x1="505.6" y1="143.4" x2="674.4" y2="180.6" class="l3e"/>
    <line x1="504.3" y1="147.3" x2="675.7" y2="234.7" class="l3e"/>
    <line x1="504.6" y1="177.6" x2="675.4" y2="102.4" class="l3e"/>
    <line x1="505.6" y1="180.6" x2="674.4" y2="143.4" class="l3e"/>
    <line x1="506.0" y1="184.0" x2="674.0" y2="184.0" class="l3e"/>
    <line x1="505.4" y1="188.5" x2="674.6" y2="237.5" class="l3e"/>
    <line x1="502.9" y1="232.6" x2="677.1" y2="105.4" class="l3e"/>
    <line x1="504.3" y1="234.7" x2="675.7" y2="147.3" class="l3e"/>
    <line x1="505.4" y1="237.5" x2="674.6" y2="188.5" class="l3e"/>
    <line x1="506.0" y1="242.0" x2="674.0" y2="242.0" class="l3e"/>
    <foreignObject x="560.5" y="61.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="575" y="318" width="150" height="50" rx="8" class="l3"/>
    <line x1="650.0" y1="326" x2="650.0" y2="360" class="div"/>
    <foreignObject x="581.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="d_{2}"></div></foreignObject>
    <foreignObject x="656.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="d_{3}"></div></foreignObject>
    <foreignObject x="621" y="368.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#0F766E;font-weight:400" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="249" y="478" width="422" height="84" rx="14" class="l3s"/>
    <foreignObject x="571" y="504.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#0F766E;font-weight:700" data-tex="\cdot\, \textcolor{#0F766E}{W_3} + \textcolor{#0F766E}{b_3}"></div></foreignObject>
  </g>
  <g data-key="L4">
    <foreignObject x="810" y="37.8" width="120" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#BE185D;font-weight:400;letter-spacing:.04em"><span>ВЫХОД · <span data-tex="K"></span></span></div></foreignObject>
    <circle cx="870" cy="96" r="16" class="bg"/>
    <foreignObject x="841" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{1}"></div></foreignObject>
    <circle cx="870" cy="140" r="16" class="bg"/>
    <foreignObject x="841" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{2}"></div></foreignObject>
    <circle cx="870" cy="184" r="16" class="bg"/>
    <foreignObject x="841" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{3}"></div></foreignObject>
    <circle cx="870" cy="242" r="16" class="bg"/>
    <foreignObject x="841" y="225.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{K}"></div></foreignObject>
    <text x="870" y="222" class="dots" text-anchor="middle">⋮</text>
    <line x1="706.0" y1="96.0" x2="854.0" y2="96.0" class="l4e"/>
    <line x1="705.5" y1="99.8" x2="854.5" y2="136.2" class="l4e"/>
    <line x1="704.4" y1="103.0" x2="855.6" y2="177.0" class="l4e"/>
    <line x1="702.4" y1="106.1" x2="857.6" y2="231.9" class="l4e"/>
    <line x1="705.5" y1="136.2" x2="854.5" y2="99.8" class="l4e"/>
    <line x1="706.0" y1="140.0" x2="854.0" y2="140.0" class="l4e"/>
    <line x1="705.5" y1="143.8" x2="854.5" y2="180.2" class="l4e"/>
    <line x1="703.9" y1="147.9" x2="856.1" y2="234.1" class="l4e"/>
    <line x1="704.4" y1="177.0" x2="855.6" y2="103.0" class="l4e"/>
    <line x1="705.5" y1="180.2" x2="854.5" y2="143.8" class="l4e"/>
    <line x1="706.0" y1="184.0" x2="854.0" y2="184.0" class="l4e"/>
    <line x1="705.2" y1="188.9" x2="854.8" y2="237.1" class="l4e"/>
    <line x1="702.4" y1="231.9" x2="857.6" y2="106.1" class="l4e"/>
    <line x1="703.9" y1="234.1" x2="856.1" y2="147.9" class="l4e"/>
    <line x1="705.2" y1="237.1" x2="854.8" y2="188.9" class="l4e"/>
    <line x1="706.0" y1="242.0" x2="854.0" y2="242.0" class="l4e"/>
    <foreignObject x="750.5" y="61.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#BE185D;font-weight:700" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject>
    <rect x="745" y="318" width="150" height="50" rx="8" class="l4"/>
    <line x1="820.0" y1="326" x2="820.0" y2="360" class="div"/>
    <foreignObject x="751.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="d_{3}"></div></foreignObject>
    <foreignObject x="833" y="323.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="K"></div></foreignObject>
    <foreignObject x="791" y="368.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#BE185D;font-weight:400" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject>
    <rect x="235" y="470" width="546" height="100" rx="16" class="l4s"/>
    <foreignObject x="681" y="504.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#BE185D;font-weight:700" data-tex="\cdot\, \textcolor{#BE185D}{W_4} + \textcolor{#BE185D}{b_4}"></div></foreignObject>
    <foreignObject x="795" y="501.9" width="73" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#5A8C1C;font-weight:700" data-tex="= y"></div></foreignObject>
  </g>
  <g data-key="match" data-only="1">
    <path d="M 177.5 314 Q 225.0 292 272.5 314" class="ok"/>
    <path d="M 347.5 314 Q 395.0 292 442.5 314" class="ok"/>
    <path d="M 517.5 314 Q 565.0 292 612.5 314" class="ok"/>
    <path d="M 687.5 314 Q 735.0 292 782.5 314" class="ok"/>
    <text x="102.5" y="410" class="okt" text-anchor="middle">1</text>
    <foreignObject x="834.5" y="390.5" width="46" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700" data-tex="K"></div></foreignObject>
    <foreignObject x="190" y="390.5" width="580" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700"><span>внутренние размеры сокращаются, снаружи остаётся <span data-tex="1 \times K"></span></span></div></foreignObject>
  </g>
  <g data-key="bad" data-only="1">
    <rect x="405" y="318" width="150" height="50" rx="8" class="tr"/>
    <line x1="480.0" y1="326" x2="480.0" y2="360" class="div"/>
    <foreignObject x="411.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#C30B0A;font-weight:700" data-tex="d_{2}"></div></foreignObject>
    <foreignObject x="486.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#C30B0A;font-weight:700" data-tex="d_{1}"></div></foreignObject>
    <line x1="387.0" y1="300" x2="403.0" y2="316" class="bad"/><line x1="403.0" y1="300" x2="387.0" y2="316" class="bad"/>
    <foreignObject x="336" y="390.5" width="288" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700"><span><span data-tex="d_1 \ne d_2"></span> — умножить нельзя</span></div></foreignObject>
  </g>
  <g data-key="nums" data-only="1">
    <rect x="68" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="90" y="284" class="num" text-anchor="middle">3</text>
    <rect x="268" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="290" y="284" class="num" text-anchor="middle">4</text>
    <rect x="468" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="490" y="284" class="num" text-anchor="middle">5</text>
    <rect x="668" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="690" y="284" class="num" text-anchor="middle">4</text>
    <rect x="848" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="870" y="284" class="num" text-anchor="middle">3</text>
  </g>
  <text x="30" y="626" class="legend">синий — вход · слои: оранжевый — 1 · фиолетовый — 2 · бирюзовый — 3 · розовый — 4 (выходной) · зелёный — выход · красный — ошибка</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="inp L1" data-focus="L1">
      <div class="step-kicker">Шаг 1 · первая кукла</div>
      <h4>Внутри — <span class="math-inline" data-tex="x"></span> и первый слой</h4>
      <p>
        Начинаем с того, что уже знаем: <span class="math-inline" data-tex="x"></span> умножается на <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>, прибавляется <span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span>.
        В домино это две костяшки, <span class="math-inline" data-tex="1 \times m"></span> и <span class="math-inline" data-tex="m \times d_{1}"></span>. В матрёшке — самая
        маленькая оболочка вокруг <span class="math-inline" data-tex="x"></span>.
      </p>
      <div class="math-display" data-tex="h^{(1)} = x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1} \qquad [1\times m]\cdot[m\times d_1] \to [1\times d_1]"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2" data-focus="L2">
      <div class="step-kicker">Шаг 2 · вторая кукла</div>
      <h4>Выход слоя — вход следующего</h4>
      <p>
        Второй слой получает <span class="math-inline" data-tex="h^{(1)}"></span> длины <span class="math-inline" data-tex="d_{1}"></span>. Значит, у <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> ровно <span class="math-inline" data-tex="d_{1}"></span> строк — по
        одной на каждый нейрон предыдущего слоя. Столбцов <span class="math-inline" data-tex="d_{2}"></span>: столько нейронов
        я выбираю для второго слоя. Если подставить <span class="math-inline" data-tex="h^{(1)}"></span>, видна вторая оболочка.
      </p>
      <div class="math-display" data-tex="h^{(2)} = h^{(1)} \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2} = (x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1})\, \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3" data-focus="L3">
      <div class="step-kicker">Шаг 3 · третья кукла</div>
      <h4>Тот же приём ещё раз</h4>
      <p>
        Третий слой устроен так же: <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span> имеет <span class="math-inline" data-tex="d_{2}"></span> строк и <span class="math-inline" data-tex="d_{3}"></span> столбцов. Новый слой
        ничего не знает о <span class="math-inline" data-tex="x"></span> напрямую — он видит только выход предыдущего слоя.
      </p>
      <div class="math-display" data-tex="h^{(3)} = \big((x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1})\, \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}\big)\, \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3 L4" data-focus="L4">
      <div class="step-kicker">Шаг 4 · внешняя кукла</div>
      <h4>Выходной слой закрывает матрёшку</h4>
      <p>
        Последняя матрица <span class="math-inline" data-tex="\textcolor{#DB2777}{W_4}"></span> переводит <span class="math-inline" data-tex="d_{3}"></span> чисел в <span class="math-inline" data-tex="K"></span> — по одному на класс.
        Здесь ширина уже не мой выбор: её задала задача. Раскрытая формула —
        это и есть вся сеть.
      </p>
      <div class="math-display" data-tex="y = \Big(\big((x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1}) \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}\big) \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}\Big) \textcolor{#DB2777}{W_4} + \textcolor{#DB2777}{b_4}"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3 L4 match" data-focus="match">
      <div class="step-kicker">Шаг 5 · правило</div>
      <h4>Домино: соседние половинки совпадают</h4>
      <p>
        Правая половинка каждой костяшки равна левой половинке следующей: <span class="math-inline" data-tex="m"></span> и
        <span class="math-inline" data-tex="m"></span>, <span class="math-inline" data-tex="d_{1}"></span> и <span class="math-inline" data-tex="d_{1}"></span>, <span class="math-inline" data-tex="d_{2}"></span> и <span class="math-inline" data-tex="d_{2}"></span>, <span class="math-inline" data-tex="d_{3}"></span> и <span class="math-inline" data-tex="d_{3}"></span>. Эти размеры «сокращаются», снаружи
        остаются только 1 и <span class="math-inline" data-tex="K"></span>. Поэтому ответ сети — строка <span class="math-inline" data-tex="1 \times K"></span>, какой бы
        глубины ни была матрёшка.
      </p>
      <div class="math-display" data-tex="[1\times m]\,[m\times d_1]\,[d_1\times d_2]\,[d_2\times d_3]\,[d_3\times K] \to [1\times K]"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3 L4 bad" data-focus="bad">
      <div class="step-kicker">Шаг 6 · что ломается</div>
      <h4>Перепутали строки и столбцы — домино рассыпалось</h4>
      <p>
        Допустим, <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> записали в форме <span class="math-inline" data-tex="d_{2} \times d_{1}"></span> — «куда × откуда». Тогда рядом
        оказываются <span class="math-inline" data-tex="d_{1}"></span> и <span class="math-inline" data-tex="d_{2}"></span>, и умножение не определено. Такая ошибка появляется,
        если смешать две записи: <span class="math-inline" data-tex="x W"></span> (строка слева) и <span class="math-inline" data-tex="W x"></span> (столбец справа).
        Нужно выбрать одну и держаться её по всей сети; в этой статье — <span class="math-inline" data-tex="x W"></span>.
      </p>
      <div class="math-display" data-tex="[1\times d_1]\cdot[d_2\times d_1] \quad \text{не умножается при } d_1 \ne d_2"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3 L4 nums" data-focus="nums L4">
      <div class="step-kicker">Шаг 7 · числа</div>
      <h4>Прогоняем квартиру через всю матрёшку</h4>
      <p>
        Возьмём ширины 3 → 4 → 5 → 4 → 3 и продолжим пример из части 2.
        Каждый слой берёт строку, которую отдал предыдущий.
      </p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · та же квартира</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Строка после каждой оболочки</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">слой 1</div>
            <div class="math-display worked-trace-math" data-tex="h^{(1)} = [1.48,\ 1.26,\ 1.17,\ 1.80]"></div>
            <div class="worked-trace-note">из части 2</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">слой 2</div>
            <div class="math-display worked-trace-math" data-tex="h^{(2)} = [0.732,\ 0.011,\ 0.192,\ 0.691,\ 0.295]"></div>
            <div class="worked-trace-note">стало 5 чисел</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">слой 3</div>
            <div class="math-display worked-trace-math" data-tex="h^{(3)} = [0.5876,\ -0.0517,\ 0.118,\ 0.0878]"></div>
            <div class="worked-trace-note">снова 4</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">выход</div>
            <div class="math-display worked-trace-math" data-tex="y = [0.3417,\ -0.0527,\ -0.0724]"></div>
            <div class="worked-trace-note"><span class="math-inline" data-tex="K = 3"></span> оценки</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> сеть
        голосует за high (0.3417), хотя правильный ответ — medium. Так и должно
        быть: веса взяты наугад, сеть ничему не обучена. Прямой проход только
        считает ответ, исправлять его будет обратный.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>Каждая оболочка приносит свои параметры. Вот сколько их в примере:</p>

<table class="shape-table">
  <tr><th>Слой</th><th><span class="math-inline" data-tex="W"></span></th><th><span class="math-inline" data-tex="b"></span></th><th>Параметров</th><th>В примере</th></tr>
  <tr><td>1</td><td><span class="math-inline" data-tex="m \times d_{1}"></span></td><td><span class="math-inline" data-tex="1 \times d_{1}"></span></td><td><span class="math-inline" data-tex="m \cdot d_1 + d_1"></span></td><td>3·4 + 4 = 16</td></tr>
  <tr><td>2</td><td><span class="math-inline" data-tex="d_{1} \times d_{2}"></span></td><td><span class="math-inline" data-tex="1 \times d_{2}"></span></td><td><span class="math-inline" data-tex="d_1 \cdot d_2 + d_2"></span></td><td>4·5 + 5 = 25</td></tr>
  <tr><td>3</td><td><span class="math-inline" data-tex="d_{2} \times d_{3}"></span></td><td><span class="math-inline" data-tex="1 \times d_{3}"></span></td><td><span class="math-inline" data-tex="d_2 \cdot d_3 + d_3"></span></td><td>5·4 + 4 = 24</td></tr>
  <tr><td>4 (выход)</td><td><span class="math-inline" data-tex="d_{3} \times K"></span></td><td><span class="math-inline" data-tex="1 \times K"></span></td><td><span class="math-inline" data-tex="d_3 \cdot K + K"></span></td><td>4·3 + 3 = 15</td></tr>
  <tr><td colspan="3"><strong>Вся сеть</strong></td><td></td><td><strong>80</strong></td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> сеть — это вложенные друг в друга
  слои вида <span class="math-inline" data-tex="(\cdot)\, W + b"></span>. Число строк каждой матрицы задаёт предыдущий слой,
  число столбцов — следующий, поэтому размеры стыкуются как домино, а наружу
  выходит строка <span class="math-inline" data-tex="1 \times K"></span>.
</div>

<hr>

<h2 id="part-4">Часть 4. Без активаций матрёшка пустая</h2>

<p>
  У матрёшки из части 3 есть неприятное свойство. Каждая оболочка — это
  умножение на матрицу и прибавление вектора, то есть <strong>линейное</strong>
  (точнее, аффинное) преобразование. А композиция линейных преобразований
  тоже линейна. Значит, сколько бы слоёв я ни вложил друг в друга, их можно
  заранее «слепить» в один.
</p>

<div class="math-display" data-tex="x \textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4} = x\,W_{\text{eff}}, \qquad [3\times 4][4\times 5][5\times 4][4\times 3] = [3\times 3]"></div>

<p>Проверим это на тех же числах, что и в части 3.</p>

<div class="stage" id="stageCollapse" tabindex="0">
  <div class="stage-figure">
<svg id="cl" viewBox="0 0 960 600" role="img" aria-label="Без активаций четыре слоя перемножаются в одну матрицу">
  <style>
    #cl { font-family: Helvetica, Arial, sans-serif; }
    #cl .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #cl .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #cl .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #cl .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.8; }
    #cl .bn { fill: #FFFFFF; stroke: #B9B2A4; stroke-width: 1.2; }
    #cl .lbl { font-size: 17px; fill: #111111; }
    #cl .lb { font-size: 16px; fill: #111111; font-weight: 700; }
    #cl .v { font-size: 13px; fill: #111111; }
    #cl .cap { font-size: 14px; fill: #5E5850; }
    #cl .hdr { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #cl .capY { font-size: 14px; fill: #8C7106; font-weight: 700; }
    #cl .capG { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #cl .capR { font-size: 14px; fill: #C30B0A; font-weight: 700; }
    #cl .capB { font-size: 14px; fill: #2A5E9B; font-weight: 700; }
    #cl .sh { fill: none; stroke: #C29E08; stroke-width: 1.8; }
    #cl .shl { font-size: 15px; fill: #8C7106; font-weight: 700; }
    #cl .eB { stroke: #3576C0; stroke-width: 1.8; fill: none; }
    #cl .eY { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #cl .eR { stroke: #C30B0A; stroke-width: 2; fill: none; }
    #cl .eG { stroke: #73B222; stroke-width: 2; fill: none; }
    #cl .eN { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    #cl .dash { stroke-dasharray: 5 4; }
    #cl .legend { font-size: 13px; fill: #5E5850; }
    #cl .l1  { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.8; }
    #cl .l1e { stroke: #E8590C; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #cl .l1s { fill: none; stroke: #E8590C; stroke-width: 2.2; }
    #cl .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #cl .l2e { stroke: #7C3AED; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #cl .l2s { fill: none; stroke: #7C3AED; stroke-width: 2.2; }
    #cl .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
    #cl .l3e { stroke: #0D9488; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #cl .l3s { fill: none; stroke: #0D9488; stroke-width: 2.2; }
    #cl .l4  { fill: #FDEBF4; stroke: #DB2777; stroke-width: 1.8; }
    #cl .l4e { stroke: #DB2777; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #cl .l4s { fill: none; stroke: #DB2777; stroke-width: 2.2; }
  </style>
  <defs>
    <marker id="cl-aB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="cl-aY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
    <marker id="cl-aR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="cl-aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
    <marker id="cl-aN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <linearGradient id="cl-geff" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#E8590C"/><stop offset=".34" stop-color="#7C3AED"/><stop offset=".66" stop-color="#0D9488"/><stop offset="1" stop-color="#DB2777"/></linearGradient>
  </defs>
  <g data-key="nest">
    <text x="30" y="46" class="hdr">МАТРЁШКА БЕЗ АКТИВАЦИЙ</text>
    <rect x="326" y="100" width="44" height="36" rx="6" class="bx"/><foreignObject x="324" y="101.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <rect x="312" y="92" width="138" height="52" rx="10" class="l1s"/>
    <foreignObject x="380" y="101.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="\cdot\, \textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="298" y="84" width="232" height="68" rx="12" class="l2s"/>
    <foreignObject x="460" y="101.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#6D28D9;font-weight:700" data-tex="\cdot\, \textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="284" y="76" width="326" height="84" rx="14" class="l3s"/>
    <foreignObject x="540" y="101.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#0F766E;font-weight:700" data-tex="\cdot\, \textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="270" y="68" width="420" height="100" rx="16" class="l4s"/>
    <foreignObject x="620" y="101.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#BE185D;font-weight:700" data-tex="\cdot\, \textcolor{#BE185D}{W_4}"></div></foreignObject>
    <foreignObject x="704" y="103.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5A8C1C;font-weight:700" data-tex="= y"></div></foreignObject>
  </g>
  <g data-key="chain">
    <text x="30" y="212" class="hdr">ТЕ ЖЕ МАТРИЦЫ ПОДРЯД</text>
    <rect x="40" y="240" width="70" height="50" rx="6" class="bx"/><foreignObject x="51" y="248.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject><foreignObject x="32" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="1 \times  3"></div></foreignObject>
    <rect x="150" y="240" width="90" height="50" rx="6" class="l1"/><foreignObject x="165.5" y="248.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject><foreignObject x="152" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="3 \times  4"></div></foreignObject>
    <rect x="260" y="240" width="90" height="50" rx="6" class="l2"/><foreignObject x="275.5" y="248.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject><foreignObject x="262" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="4 \times  5"></div></foreignObject>
    <rect x="370" y="240" width="90" height="50" rx="6" class="l3"/><foreignObject x="385.5" y="248.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject><foreignObject x="372" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="5 \times  4"></div></foreignObject>
    <rect x="480" y="240" width="90" height="50" rx="6" class="l4"/><foreignObject x="495.5" y="248.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#BE185D;font-weight:700" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject><foreignObject x="482" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="4 \times  3"></div></foreignObject>
    <text x="128" y="270" class="lbl" text-anchor="middle">·</text>
    <text x="253" y="270" class="lbl" text-anchor="middle">·</text>
    <text x="363" y="270" class="lbl" text-anchor="middle">·</text>
    <text x="473" y="270" class="lbl" text-anchor="middle">·</text>
  </g>
  <g data-key="merge">
    <path d="M 150 232 L 150 222 L 570 222 L 570 232" class="eY"/>
    <text x="360" y="214" class="capY" text-anchor="middle">перемножим заранее</text>
    <line x1="585" y1="265" x2="686" y2="265" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="690" y="232" width="130" height="66" rx="8" fill="#FFFFFF" stroke="url(#cl-geff)" stroke-width="3"/>
    <foreignObject x="714" y="239.2" width="82" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="W_{\text{eff}}"></div></foreignObject><foreignObject x="712" y="264.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="3 \times  3"></div></foreignObject>
    <text x="755" y="318" class="capY" text-anchor="middle">всего 9 чисел</text>
  </g>
  <g data-key="cmp">
    <text x="30" y="370" class="hdr">ДВА ПУТИ К ОДНОМУ ОТВЕТУ</text>
    <rect x="40" y="390" width="60" height="44" rx="6" class="bx"/><foreignObject x="46" y="395.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <line x1="104" y1="412" x2="176" y2="412" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="180" y="390" width="200" height="44" rx="6" class="by"/><text x="280" y="410" class="lb" text-anchor="middle">4 слоя</text><text x="280" y="427" class="cap" text-anchor="middle">80 параметров</text>
    <line x1="384" y1="412" x2="456" y2="412" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="460" y="390" width="300" height="44" rx="6" class="bg"/><foreignObject x="419" y="395.2" width="382" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="y = [0.3417,\ -0.0527,\ -0.0724]"></div></foreignObject>
    <rect x="40" y="470" width="60" height="44" rx="6" class="bx"/><foreignObject x="46" y="475.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <line x1="104" y1="492" x2="176" y2="492" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="180" y="470" width="200" height="44" rx="6" class="by"/><text x="280" y="490" class="lb" text-anchor="middle">1 слой</text><text x="280" y="507" class="cap" text-anchor="middle">12 параметров</text>
    <line x1="384" y1="492" x2="456" y2="492" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="460" y="470" width="300" height="44" rx="6" class="bg"/><foreignObject x="419" y="475.2" width="382" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="y = [0.3417,\ -0.0527,\ -0.0724]"></div></foreignObject>
    <text x="810" y="462" class="capG" text-anchor="middle">одинаково</text><text x="810" y="480" class="capG" text-anchor="middle">до 4-го знака</text>
  </g>
  <g data-key="red" data-only="1">
    <rect x="40" y="532" width="880" height="36" rx="6" class="br"/>
    <text x="480" y="555" class="capR" text-anchor="middle">смещения тоже сворачиваются: 4 линейных слоя = 1 линейный слой. Глубина ничего не добавила</text>
  </g>
  <text x="30" y="590" class="legend">синий — вход · слои: оранжевый — 1 · фиолетовый — 2 · бирюзовый — 3 · розовый — 4 (выходной) · зелёный — выход · красный — проблема</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="nest" data-focus="nest">
      <div class="step-kicker">Шаг 1 · что у нас есть</div>
      <h4>Матрёшка из одних умножений</h4>
      <p>Уберу пока смещения, чтобы было видно главное. Без них вся сеть — это <span class="math-inline" data-tex="x"></span>, по очереди умноженный на четыре матрицы. Каждая оболочка — одно умножение.</p>
      <div class="math-display" data-tex="y = \big(((x \textcolor{#EA580C}{W_1})\, \textcolor{#8B5CF6}{W_2})\, \textcolor{#0D9488}{W_3}\big)\, \textcolor{#DB2777}{W_4}"></div>
    </div>
    <div class="step-panel" data-on="nest chain" data-focus="chain">
      <div class="step-kicker">Шаг 2 · операция</div>
      <h4>Скобки можно переставить</h4>
      <p>Умножение матриц ассоциативно: неважно, в каком порядке расставлены скобки, лишь бы порядок самих матриц не менялся. Значит, можно сначала перемножить все <span class="math-inline" data-tex="W"></span> между собой, а <span class="math-inline" data-tex="x"></span> подставить в самом конце.</p>
      <div class="math-display" data-tex="\big(((x \textcolor{#EA580C}{W_1}) \textcolor{#8B5CF6}{W_2}) \textcolor{#0D9488}{W_3}\big) \textcolor{#DB2777}{W_4} = x\,(\textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4})"></div>
    </div>
    <div class="step-panel" data-on="nest chain merge" data-focus="merge">
      <div class="step-kicker">Шаг 3 · результат</div>
      <h4>Четыре матрицы складываются в одну</h4>
      <p>Произведение <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4}"></span> — это одна матрица размером <span class="math-inline" data-tex="3 \times 3"></span>: внутренние размеры 4, 5, 4 сокращаются, как в домино. Девять чисел вместо 64 весов.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · веса из части 3</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Перемножаем</span>
            <div class="math-display worked-math" data-tex="\textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="W_{\text{eff}} = \begin{bmatrix}0.0081 &amp; -0.0039 &amp; -0.0032\\ 0.0461 &amp; -0.0731 &amp; 0.0788\\ -0.0229 &amp; 0.0164 &amp; 0.0124\end{bmatrix}"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> это не приближение, а точное равенство. Любую квартиру эта матрица переведёт в те же оценки, что и четыре слоя.</p>
      </div>
    </div>
    <div class="step-panel" data-on="nest chain merge cmp" data-focus="cmp">
      <div class="step-kicker">Шаг 4 · проверка</div>
      <h4>Четыре слоя и один слой дают одно и то же</h4>
      <p>Прогоним нашу квартиру двумя путями: через все четыре слоя, как в части 3, и через одну матрицу <span class="math-inline" data-tex="W_{\text{eff}}"></span> со свёрнутым смещением <span class="math-inline" data-tex="b_{\text{eff}}"></span>. Ответы совпадают до последнего знака.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · та же квартира</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Один слой</span>
            <div class="math-display worked-math" data-tex="x\,W_{\text{eff}} + b_{\text{eff}},\quad b_{\text{eff}} = [-0.0258,\ 0.1871,\ -0.1435]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="y = [0.3417,\ -0.0527,\ -0.0724]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> тот же <span class="math-inline" data-tex="y"></span>, что в части 3. Восемьдесят параметров четырёх слоёв умеют ровно то же, что двенадцать параметров одного слоя.</p>
      </div>
    </div>
    <div class="step-panel" data-on="nest chain merge cmp red" data-focus="red">
      <div class="step-kicker">Шаг 5 · что ломается</div>
      <h4>Глубина без активаций — пустая матрёшка</h4>
      <p>Со смещениями то же самое: подставляя одно в другое, получаем снова вид <span class="math-inline" data-tex="x W + b"></span>. Сколько слоёв ни вкладывай, снаружи окажется один линейный слой. Внутри матрёшки ничего нет, кроме одной куклы.</p>
      <div class="math-display" data-tex="b_{\text{eff}} = \big((\textcolor{#EA580C}{b_1} \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}) \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}\big) \textcolor{#DB2777}{W_4} + \textcolor{#DB2777}{b_4}"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-red">
  <strong>Почему это важно:</strong> один линейный слой проводит между классами
  только прямые (гиперплоскости). Если данные так не разделяются, никакое число
  линейных слоёв не поможет — они всё равно сворачиваются в один.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> без нелинейности между слоями вся
  матрёшка сворачивается в одну матрицу <span class="math-inline" data-tex="W_{\text{eff}}"></span> и одно смещение <span class="math-inline" data-tex="b_{\text{eff}}"></span>. Глубина
  появляется только тогда, когда между умножениями стоит что-то, что
  перемножить заранее нельзя.
</div>

<hr>

<h2 id="part-5">Часть 5. Активация: то, что нельзя перемножить заранее</h2>

<p>
  Чтобы матрёшка не сворачивалась, после каждого скрытого слоя ставят
  <strong>функцию активации</strong> <span class="math-inline" data-tex="\sigma"></span> — нелинейную функцию, которая применяется
  к каждому числу строки отдельно. Оболочка становится такой:
</p>

<div class="math-display" data-tex="h^{(k)} = \sigma\big(h^{(k-1)} W_k + b_k\big), \qquad h^{(0)} = x"></div>

<p>
  На выходе вместо ReLU ставят <strong>softmax</strong>: он превращает <span class="math-inline" data-tex="K"></span> оценок в
  <span class="math-inline" data-tex="K"></span> вероятностей. А чтобы сравнить вероятности с правильным ответом <span class="math-inline" data-tex="t"></span>, нужен
  <strong>лосс</strong> — одно число, которое показывает, насколько сеть ошиблась.
</p>

<div class="callout-blue">
  <strong>Размеры не меняются:</strong> <span class="math-inline" data-tex="\sigma"></span> и softmax применяются поэлементно или
  построчно, поэтому домино из части 3 остаётся тем же. Активация добавляет
  нелинейность, но не параметры.
</div>

<p>Посмотрим пошагово.</p>

<div class="stage" id="stageAct" tabindex="0">
  <div class="stage-figure">
<svg id="ac" viewBox="0 0 960 700" role="img" aria-label="Активация ReLU между слоями и softmax на выходе">
  <style>
    #ac { font-family: Helvetica, Arial, sans-serif; }
    #ac .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ac .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ac .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ac .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.8; }
    #ac .bn { fill: #FFFFFF; stroke: #B9B2A4; stroke-width: 1.2; }
    #ac .lbl { font-size: 17px; fill: #111111; }
    #ac .lb { font-size: 16px; fill: #111111; font-weight: 700; }
    #ac .v { font-size: 13px; fill: #111111; }
    #ac .cap { font-size: 14px; fill: #5E5850; }
    #ac .hdr { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #ac .capY { font-size: 14px; fill: #8C7106; font-weight: 700; }
    #ac .capG { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #ac .capR { font-size: 14px; fill: #C30B0A; font-weight: 700; }
    #ac .capB { font-size: 14px; fill: #2A5E9B; font-weight: 700; }
    #ac .sh { fill: none; stroke: #C29E08; stroke-width: 1.8; }
    #ac .shl { font-size: 15px; fill: #8C7106; font-weight: 700; }
    #ac .eB { stroke: #3576C0; stroke-width: 1.8; fill: none; }
    #ac .eY { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #ac .eR { stroke: #C30B0A; stroke-width: 2; fill: none; }
    #ac .eG { stroke: #73B222; stroke-width: 2; fill: none; }
    #ac .eN { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    #ac .dash { stroke-dasharray: 5 4; }
    #ac .legend { font-size: 13px; fill: #5E5850; }
    #ac .l1  { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.8; }
    #ac .l1e { stroke: #E8590C; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #ac .l1s { fill: none; stroke: #E8590C; stroke-width: 2.2; }
    #ac .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #ac .l2e { stroke: #7C3AED; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #ac .l2s { fill: none; stroke: #7C3AED; stroke-width: 2.2; }
    #ac .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
    #ac .l3e { stroke: #0D9488; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #ac .l3s { fill: none; stroke: #0D9488; stroke-width: 2.2; }
    #ac .l4  { fill: #FDEBF4; stroke: #DB2777; stroke-width: 1.8; }
    #ac .l4e { stroke: #DB2777; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #ac .l4s { fill: none; stroke: #DB2777; stroke-width: 2.2; }
  </style>
  <defs>
    <marker id="ac-aB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="ac-aY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
    <marker id="ac-aR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="ac-aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
    <marker id="ac-aN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
  </defs>
  <g data-key="relu">
    <text x="30" y="46" class="hdr">АКТИВАЦИЯ ReLU</text>
    <rect x="40" y="60" width="270" height="190" rx="8" class="bn"/>
    <line x1="60" y1="210" x2="292" y2="210" class="eN" marker-end="url(#ac-aN)"/>
    <line x1="175" y1="232" x2="175" y2="76" class="eN" marker-end="url(#ac-aN)"/>
    <path d="M 65 210 L 175 210 L 275 110" class="eY" stroke-width="3.2"/>
    <foreignObject x="240" y="210.5" width="46" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:14px;color:#5E5850;font-weight:400" data-tex="z"></div></foreignObject>
    <foreignObject x="186" y="70.5" width="197" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#8C7106;font-weight:700" data-tex="\sigma(z) = \max(0,\ z)"></div></foreignObject>
    <foreignObject x="46.5" y="180.5" width="127" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z &lt; 0 \;\to\; 0"></div></foreignObject>
    <foreignObject x="171" y="172.5" width="127" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:14px;color:#5E5850;font-weight:400" data-tex="z &gt; 0 \;\to\; z"></div></foreignObject>
  </g>
  <g data-key="l3">
    <text x="360" y="46" class="hdr">СЛОЙ 3 НАШЕЙ КВАРТИРЫ</text>
    <line x1="360" y1="210" x2="610" y2="210" class="eN"/><line x1="690" y1="210" x2="930" y2="210" class="eN"/>
    <rect x="380" y="121.9" width="40" height="88.1" class="by"/>
    <text x="400" y="115.9" class="v" text-anchor="middle">0.5876</text>
    <foreignObject x="372" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z_{1}"></div></foreignObject>
    <rect x="710" y="121.9" width="40" height="88.1" class="bg"/>
    <text x="730" y="115.9" class="v" text-anchor="middle">0.5876</text>
    <foreignObject x="702" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <rect x="440" y="210" width="40" height="7.8" class="br"/>
    <text x="460" y="233.8" class="v" text-anchor="middle" fill="#C30B0A">−0.0517</text>
    <foreignObject x="432" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z_{2}"></div></foreignObject>
    <text x="790" y="204" class="capR" text-anchor="middle">0</text>
    <foreignObject x="762" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <rect x="500" y="192.3" width="40" height="17.7" class="by"/>
    <text x="520" y="186.3" class="v" text-anchor="middle">0.1180</text>
    <foreignObject x="492" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z_{3}"></div></foreignObject>
    <rect x="830" y="192.3" width="40" height="17.7" class="bg"/>
    <text x="850" y="186.3" class="v" text-anchor="middle">0.1180</text>
    <foreignObject x="822" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <rect x="560" y="196.8" width="40" height="13.2" class="by"/>
    <text x="580" y="190.8" class="v" text-anchor="middle">0.0878</text>
    <foreignObject x="552" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z_{4}"></div></foreignObject>
    <rect x="890" y="196.8" width="40" height="13.2" class="bg"/>
    <text x="910" y="190.8" class="v" text-anchor="middle">0.0878</text>
    <foreignObject x="882" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{4}"></div></foreignObject>
    <line x1="618" y1="150" x2="682" y2="150" class="eY" marker-end="url(#ac-aY)"/><text x="650" y="140" class="capY" text-anchor="middle">ReLU</text>
  </g>
  <g data-key="block">
    <text x="30" y="290" class="hdr">ПЕРЕМНОЖИТЬ ЗАРАНЕЕ НЕЛЬЗЯ</text>
    <rect x="300" y="300" width="90" height="40" rx="6" class="l2"/><foreignObject x="315.5" y="303.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <circle cx="440" cy="320" r="20" class="br"/><foreignObject x="416" y="303.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="\sigma"></div></foreignObject>
    <rect x="490" y="300" width="90" height="40" rx="6" class="l3"/><foreignObject x="505.5" y="303.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <line x1="394" y1="320" x2="416" y2="320" class="eN" marker-end="url(#ac-aN)"/><line x1="462" y1="320" x2="486" y2="320" class="eN" marker-end="url(#ac-aN)"/>
    <line x1="600" y1="306" x2="620" y2="334" class="eR"/><line x1="620" y1="306" x2="600" y2="334" class="eR"/>
    <foreignObject x="634" y="306.5" width="258" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C30B0A;font-weight:700"><span><span data-tex="\textcolor{#6D28D9}{W_2} \cdot \textcolor{#0F766E}{W_3}"></span> уже не склеить</span></div></foreignObject>
  </g>
  <g data-key="shells">
    <text x="30" y="372" class="hdr">НАСТОЯЩАЯ МАТРЁШКА</text>
    <rect x="256" y="400" width="40" height="36" rx="6" class="bx"/><foreignObject x="252" y="401.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <rect x="242" y="392" width="170" height="52" rx="10" class="l1s"/>
    <foreignObject x="306" y="401.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#C2410C}{W_1} + \textcolor{#C2410C}{b_1})"></div></foreignObject>
    <rect x="228" y="384" width="300" height="68" rx="12" class="l2s"/>
    <foreignObject x="422" y="401.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#6D28D9;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#6D28D9}{W_2} + \textcolor{#6D28D9}{b_2})"></div></foreignObject>
    <rect x="214" y="376" width="430" height="84" rx="14" class="l3s"/>
    <foreignObject x="538" y="401.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#0F766E;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#0F766E}{W_3} + \textcolor{#0F766E}{b_3})"></div></foreignObject>
    <rect x="200" y="368" width="560" height="100" rx="16" class="l4s"/>
    <foreignObject x="654" y="401.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#BE185D;font-weight:700" data-tex="\cdot\, \textcolor{#BE185D}{W_4} + \textcolor{#BE185D}{b_4}"></div></foreignObject>
    <foreignObject x="772" y="403.5" width="167" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5A8C1C;font-weight:700"><span><span data-tex="\to"></span> softmax <span data-tex="\to p"></span></span></div></foreignObject>
  </g>
  <g data-key="soft">
    <text x="30" y="506" class="hdr">ВЫХОД: ОЦЕНКИ → ВЕРОЯТНОСТИ</text>
    <line x1="80" y1="630" x2="320" y2="630" class="eN"/><line x1="440" y1="630" x2="680" y2="630" class="eN"/>
    <rect x="100" y="581.1" width="44" height="48.9" class="by"/><text x="122" y="575.1" class="v" text-anchor="middle">0.3262</text>
    <text x="122" y="664" class="cap" text-anchor="middle">high</text>
    <rect x="460" y="566.9" width="44" height="63.1" class="bg"/><text x="482" y="560.9" class="v" text-anchor="middle">0.4207</text>
    <text x="482" y="664" class="cap" text-anchor="middle">high</text>
    <rect x="170" y="630" width="44" height="4.8" class="by"/><text x="192" y="624" class="v" text-anchor="middle">−0.0321</text>
    <text x="192" y="664" class="cap" text-anchor="middle">medium</text>
    <rect x="530" y="585.9" width="44" height="44.1" class="bg"/><text x="552" y="579.9" class="v" text-anchor="middle">0.2940</text>
    <text x="552" y="664" class="cap" text-anchor="middle">medium</text>
    <rect x="240" y="630" width="44" height="9.3" class="by"/><text x="262" y="624" class="v" text-anchor="middle">−0.0621</text>
    <text x="262" y="664" class="cap" text-anchor="middle">low</text>
    <rect x="600" y="587.2" width="44" height="42.8" class="bg"/><text x="622" y="581.2" class="v" text-anchor="middle">0.2853</text>
    <text x="622" y="664" class="cap" text-anchor="middle">low</text>
    <line x1="336" y1="590" x2="424" y2="590" class="eY" marker-end="url(#ac-aY)"/><text x="380" y="580" class="capY" text-anchor="middle">softmax</text>
    <foreignObject x="131.5" y="510.5" width="137" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="y"></span> — оценки</span></div></foreignObject><foreignObject x="426" y="510.5" width="278" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="p"></span> — вероятности, сумма 1</span></div></foreignObject>
  </g>
  <g data-key="loss">
    <foreignObject x="706.5" y="510.5" width="217" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span>правильный ответ <span data-tex="t"></span></span></div></foreignObject>
    <rect x="745" y="560" width="40" height="34" rx="4" class="bn"/><text x="765" y="583" class="lb" text-anchor="middle">0</text>
    <rect x="795" y="560" width="40" height="34" rx="4" class="bg"/><text x="815" y="583" class="lb" text-anchor="middle">1</text>
    <rect x="845" y="560" width="40" height="34" rx="4" class="bn"/><text x="865" y="583" class="lb" text-anchor="middle">0</text>
    <foreignObject x="726.5" y="602.5" width="177" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="L = -\ln 0.2940"></div></foreignObject><text x="815" y="642" class="capR" text-anchor="middle">= 1.2241</text>
    <path d="M 552 566 Q 650 510 742 570" class="eR dash" marker-end="url(#ac-aR)"/>
  </g>
  <text x="30" y="688" class="legend">синий — вход · жёлтый — операция · цвет оболочки — номер слоя · зелёный — результат · красный — срезанное и ошибка</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="relu" data-focus="relu">
      <div class="step-kicker">Шаг 1 · операция</div>
      <h4>ReLU: отрицательное — в ноль</h4>
      <p>Самая простая нелинейность — ReLU. Положительные числа она пропускает как есть, отрицательные заменяет нулём. Применяется к каждому числу строки отдельно.</p>
      <div class="math-display" data-tex="\sigma(z) = \max(0,\ z)"></div>
    </div>
    <div class="step-panel" data-on="relu l3" data-focus="l3">
      <div class="step-kicker">Шаг 2 · числа</div>
      <h4>ReLU на третьем слое нашей квартиры</h4>
      <p>Обозначу <span class="math-inline" data-tex="z"></span> — строку до активации, <span class="math-inline" data-tex="h = \sigma(z)"></span> — после. На третьем слое у квартиры одно число отрицательное: −0.0517. ReLU делает его нулём, остальные проходят без изменений.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · та же квартира</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>До активации</span>
            <div class="math-display worked-math" data-tex="z^{(3)} = [0.5876,\ -0.0517,\ 0.118,\ 0.0878]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>После ReLU</span>
            <div class="math-display worked-math" data-tex="h^{(3)} = [0.5876,\ 0,\ 0.118,\ 0.0878]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> на первых двух слоях все числа этой квартиры положительны, и ReLU там ничего не меняет. У другой квартиры нули окажутся в других местах — поэтому сеть и перестаёт быть одной матрицей.</p>
      </div>
    </div>
    <div class="step-panel" data-on="relu l3 block" data-focus="block">
      <div class="step-kicker">Шаг 3 · почему это работает</div>
      <h4>Между матрицами встал <span class="math-inline" data-tex="\sigma"></span></h4>
      <p>Теперь между <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> и <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span> стоит функция, которая зависит от самих чисел: какие обнулять, решается только после умножения. Перемножить <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3}"></span> заранее уже нельзя, и матрёшка перестаёт сворачиваться.</p>
      <div class="math-display" data-tex="\sigma(h \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2})\, \textcolor{#0D9488}{W_3} \ne h\,(\textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3}) + \dots"></div>
    </div>
    <div class="step-panel" data-on="relu l3 block shells" data-focus="shells">
      <div class="step-kicker">Шаг 4 · структура</div>
      <h4>Настоящая матрёшка</h4>
      <p>Каждая скрытая оболочка теперь — «умножить, прибавить, пропустить через <span class="math-inline" data-tex="\sigma"></span>». Внешняя оболочка без ReLU: на выходе нужны оценки любого знака.</p>
      <div class="math-display" data-tex="y = \sigma\Big(\sigma\big(\sigma(x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1})\, \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}\big)\, \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}\Big)\, \textcolor{#DB2777}{W_4} + \textcolor{#DB2777}{b_4}"></div>
    </div>
    <div class="step-panel" data-on="relu l3 block shells soft" data-focus="soft">
      <div class="step-kicker">Шаг 5 · результат</div>
      <h4>Softmax превращает оценки в вероятности</h4>
      <p>Оценки <span class="math-inline" data-tex="y"></span> могут быть любыми, в том числе отрицательными. Softmax берёт экспоненту каждой и делит на сумму — получаются положительные числа с суммой 1.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · та же квартира</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Оценки (с ReLU)</span>
            <div class="math-display worked-math" data-tex="y = [0.3262,\ -0.0321,\ -0.0621]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Softmax</span>
            <div class="math-display worked-math" data-tex="p_k = \frac{e^{y_k}}{\sum_j e^{y_j}} \;\Rightarrow\; p = [0.4207,\ 0.2940,\ 0.2853]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> оценки изменились по сравнению с частью 3 — это работа ReLU на третьем слое. Сеть по-прежнему больше всего верит в high: веса пока не обучены.</p>
      </div>
    </div>
    <div class="step-panel" data-on="relu l3 block shells soft loss" data-focus="loss">
      <div class="step-kicker">Шаг 6 · ошибка</div>
      <h4>Лосс: насколько сеть ошиблась</h4>
      <p>Правильный ответ — medium. Кросс-энтропия смотрит только на вероятность правильного класса: чем она ближе к 1, тем меньше лосс. Именно это число обратный проход и будет уменьшать.</p>
      <div class="math-display" data-tex="L = -\sum_k t_k \ln p_k = -\ln p_{\text{medium}} = -\ln 0.2940 = 1.2241"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> активация между слоями — это то, что
  не даёт матрёшке свернуться в одну матрицу. Каждая скрытая оболочка — <span class="math-inline" data-tex="\sigma(\cdot\, W + b)"></span>,
  внешняя — <span class="math-inline" data-tex="\cdot\, W + b"></span>, а softmax и лосс превращают выход в вероятности и одно
  число ошибки.
</div>

<hr>

<h2 id="part-6">Часть 6. Батч: из строки в матрицу</h2>

<p>
  До сих пор через сеть шла одна квартира. На практике сеть получает сразу
  <strong>батч</strong> — <span class="math-inline" data-tex="B"></span> объектов. Вот где пригодилась запись строкой из
  части 1: объекты просто становятся строками матрицы <span class="math-inline" data-tex="X"></span>, и формулы не меняются.
</p>

<div class="math-display" data-tex="x \in \mathbb{R}^{1\times m} \;\longrightarrow\; X \in \mathbb{R}^{B\times m}, \qquad H^{(1)} = \sigma(X \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1}) \in \mathbb{R}^{B\times d_1}"></div>

<div class="stage" id="stageBatch" tabindex="0">
  <div class="stage-figure">
<svg id="bt" viewBox="0 0 960 520" role="img" aria-label="Батч из двух квартир: матрица X умножается на ту же W1">
  <style>
    #bt { font-family: Helvetica, Arial, sans-serif; }
    #bt .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #bt .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #bt .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #bt .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.8; }
    #bt .bn { fill: #FFFFFF; stroke: #B9B2A4; stroke-width: 1.2; }
    #bt .lbl { font-size: 17px; fill: #111111; }
    #bt .lb { font-size: 16px; fill: #111111; font-weight: 700; }
    #bt .v { font-size: 13px; fill: #111111; }
    #bt .cap { font-size: 14px; fill: #5E5850; }
    #bt .hdr { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #bt .capY { font-size: 14px; fill: #8C7106; font-weight: 700; }
    #bt .capG { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #bt .capR { font-size: 14px; fill: #C30B0A; font-weight: 700; }
    #bt .capB { font-size: 14px; fill: #2A5E9B; font-weight: 700; }
    #bt .sh { fill: none; stroke: #C29E08; stroke-width: 1.8; }
    #bt .shl { font-size: 15px; fill: #8C7106; font-weight: 700; }
    #bt .eB { stroke: #3576C0; stroke-width: 1.8; fill: none; }
    #bt .eY { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #bt .eR { stroke: #C30B0A; stroke-width: 2; fill: none; }
    #bt .eG { stroke: #73B222; stroke-width: 2; fill: none; }
    #bt .eN { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    #bt .dash { stroke-dasharray: 5 4; }
    #bt .legend { font-size: 13px; fill: #5E5850; }
    #bt .l1  { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.8; }
    #bt .l1e { stroke: #E8590C; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #bt .l1s { fill: none; stroke: #E8590C; stroke-width: 2.2; }
    #bt .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #bt .l2e { stroke: #7C3AED; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #bt .l2s { fill: none; stroke: #7C3AED; stroke-width: 2.2; }
    #bt .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
    #bt .l3e { stroke: #0D9488; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #bt .l3s { fill: none; stroke: #0D9488; stroke-width: 2.2; }
    #bt .l4  { fill: #FDEBF4; stroke: #DB2777; stroke-width: 1.8; }
    #bt .l4e { stroke: #DB2777; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #bt .l4s { fill: none; stroke: #DB2777; stroke-width: 2.2; }
  </style>
  <defs>
    <marker id="bt-aB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="bt-aY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
    <marker id="bt-aR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bt-aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
    <marker id="bt-aN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="bt-l1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#E8590C"/></marker>
    <marker id="bt-l2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#7C3AED"/></marker>
    <marker id="bt-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0D9488"/></marker>
    <marker id="bt-l4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#DB2777"/></marker>
  </defs>
  <g data-key="w">
    <foreignObject x="243.5" y="60.5" width="137" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1} \cdot 3 \times 4"></div></foreignObject>
    <rect x="216" y="123" width="48" height="34" class="l1"/><text x="240.0" y="145" class="v" text-anchor="middle">0.02</text>
    <rect x="264" y="123" width="48" height="34" class="l1"/><text x="288.0" y="145" class="v" text-anchor="middle">−0.01</text>
    <rect x="312" y="123" width="48" height="34" class="l1"/><text x="336.0" y="145" class="v" text-anchor="middle">0.03</text>
    <rect x="360" y="123" width="48" height="34" class="l1"/><text x="384.0" y="145" class="v" text-anchor="middle">0</text>
    <rect x="216" y="157" width="48" height="34" class="l1"/><text x="240.0" y="179" class="v" text-anchor="middle">0.5</text>
    <rect x="264" y="157" width="48" height="34" class="l1"/><text x="288.0" y="179" class="v" text-anchor="middle">0.3</text>
    <rect x="312" y="157" width="48" height="34" class="l1"/><text x="336.0" y="179" class="v" text-anchor="middle">−0.4</text>
    <rect x="360" y="157" width="48" height="34" class="l1"/><text x="384.0" y="179" class="v" text-anchor="middle">0.1</text>
    <rect x="216" y="191" width="48" height="34" class="l1"/><text x="240.0" y="213" class="v" text-anchor="middle">−0.1</text>
    <rect x="264" y="191" width="48" height="34" class="l1"/><text x="288.0" y="213" class="v" text-anchor="middle">0.2</text>
    <rect x="312" y="191" width="48" height="34" class="l1"/><text x="336.0" y="213" class="v" text-anchor="middle">0.05</text>
    <rect x="360" y="191" width="48" height="34" class="l1"/><text x="384.0" y="213" class="v" text-anchor="middle">0.3</text>
    <text x="200" y="163" class="lbl" text-anchor="middle">·</text>
  </g>
  <g data-key="x1">
    <foreignObject x="89" y="60.5" width="46" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#2A5E9B;font-weight:700" data-tex="X"></div></foreignObject>
    <text x="30" y="162" class="cap">кв. 1</text>
    <rect x="64" y="140" width="48" height="34" class="bx"/><text x="88.0" y="162" class="v" text-anchor="middle">54</text>
    <rect x="112" y="140" width="48" height="34" class="bx"/><text x="136.0" y="162" class="v" text-anchor="middle">2</text>
    <rect x="160" y="140" width="48" height="34" class="bx"/><text x="184.0" y="162" class="v" text-anchor="middle">7</text>
  </g>
  <g data-key="x2">
    <text x="30" y="196" class="cap">кв. 2</text>
    <rect x="64" y="174" width="48" height="34" class="bx"/><text x="88.0" y="196" class="v" text-anchor="middle">38</text>
    <rect x="112" y="174" width="48" height="34" class="bx"/><text x="136.0" y="196" class="v" text-anchor="middle">1</text>
    <rect x="160" y="174" width="48" height="34" class="bx"/><text x="184.0" y="196" class="v" text-anchor="middle">2</text>
  </g>
  <g data-key="b">
    <text x="426" y="163" class="lbl" text-anchor="middle">+</text>
    <foreignObject x="471.5" y="60.5" width="137" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{b_1} \cdot 1 \times 4"></div></foreignObject>
    <rect x="444" y="140" width="48" height="34" class="l1"/><text x="468.0" y="162" class="v" text-anchor="middle">0.1</text>
    <rect x="492" y="140" width="48" height="34" class="l1"/><text x="516.0" y="162" class="v" text-anchor="middle">−0.2</text>
    <rect x="540" y="140" width="48" height="34" class="l1"/><text x="564.0" y="162" class="v" text-anchor="middle">0</text>
    <rect x="588" y="140" width="48" height="34" class="l1"/><text x="612.0" y="162" class="v" text-anchor="middle">−0.5</text>
  </g>
  <g data-key="bc" data-only="1">
    <rect x="444" y="174" width="48" height="34" class="l1" stroke-dasharray="4 3"/><text x="468.0" y="196" class="v" text-anchor="middle">0.1</text>
    <rect x="492" y="174" width="48" height="34" class="l1" stroke-dasharray="4 3"/><text x="516.0" y="196" class="v" text-anchor="middle">−0.2</text>
    <rect x="540" y="174" width="48" height="34" class="l1" stroke-dasharray="4 3"/><text x="564.0" y="196" class="v" text-anchor="middle">0</text>
    <rect x="588" y="174" width="48" height="34" class="l1" stroke-dasharray="4 3"/><text x="612.0" y="196" class="v" text-anchor="middle">−0.5</text>
    <text fill="#C2410C" x="540" y="232" class="capY" text-anchor="middle">та же строка для каждой квартиры</text>
  </g>
  <g data-key="h1r">
    <text x="654" y="163" class="lbl" text-anchor="middle">=</text>
    <foreignObject x="730" y="60.5" width="76" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700" data-tex="H^{(1)}"></div></foreignObject>
    <rect x="672" y="140" width="48" height="34" class="bg"/><text x="696.0" y="162" class="v" text-anchor="middle">1.48</text>
    <rect x="720" y="140" width="48" height="34" class="bg"/><text x="744.0" y="162" class="v" text-anchor="middle">1.26</text>
    <rect x="768" y="140" width="48" height="34" class="bg"/><text x="792.0" y="162" class="v" text-anchor="middle">1.17</text>
    <rect x="816" y="140" width="48" height="34" class="bg"/><text x="840.0" y="162" class="v" text-anchor="middle">1.80</text>
  </g>
  <g data-key="h2r">
    <rect x="672" y="174" width="48" height="34" class="bg"/><text x="696.0" y="196" class="v" text-anchor="middle">1.16</text>
    <rect x="720" y="174" width="48" height="34" class="bg"/><text x="744.0" y="196" class="v" text-anchor="middle">0.12</text>
    <rect x="768" y="174" width="48" height="34" class="bg"/><text x="792.0" y="196" class="v" text-anchor="middle">0.84</text>
    <rect x="816" y="174" width="48" height="34" class="bg"/><text x="840.0" y="196" class="v" text-anchor="middle">0.20</text>
  </g>
  <g data-key="rows" data-only="1">
    <path d="M 112 136 Q 112 102 216 104" class="eB dash" marker-end="url(#bt-aB)"/>
    <path d="M 112 212 Q 112 250 216 232" class="eB dash" marker-end="url(#bt-aB)"/>
    <foreignObject x="107.5" y="232.5" width="409" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#2A5E9B;font-weight:700"><span>обе строки идут через одну и ту же <span data-tex="\textcolor{#C2410C}{W_1}"></span></span></div></foreignObject>
  </g>
  <g data-key="shape">
    <foreignObject x="93" y="262.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#2A5E9B;font-weight:700" data-tex="B \times  m"></div></foreignObject>
    <foreignObject x="264" y="262.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="m \times  d_{1}"></div></foreignObject>
    <foreignObject x="492" y="262.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="1 \times  d_{1}"></div></foreignObject>
    <foreignObject x="720" y="262.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700" data-tex="B \times  d_{1}"></div></foreignObject>
    <foreignObject x="265.5" y="286.5" width="429" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="B"></span> — число объектов в батче, здесь <span data-tex="B = 2"></span></span></div></foreignObject>
  </g>
  <g data-key="chain">
    <text x="30" y="352" class="hdr">ВСЯ МАТРЁШКА С БАТЧЕМ</text>
    <rect x="40" y="370" width="120" height="44" rx="6" class="bx"/><foreignObject x="53" y="375.2" width="94" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  m"></div></foreignObject>
    <line x1="164" y1="392" x2="220" y2="392" stroke="#E8590C" stroke-width="2" fill="none" marker-end="url(#bt-l1)"/><foreignObject x="164" y="362.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="224" y="370" width="120" height="44" rx="6" class="l1"/><foreignObject x="231.5" y="375.2" width="105" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  d_{1}"></div></foreignObject>
    <line x1="348" y1="392" x2="404" y2="392" stroke="#7C3AED" stroke-width="2" fill="none" marker-end="url(#bt-l2)"/><foreignObject x="348" y="362.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="408" y="370" width="120" height="44" rx="6" class="l2"/><foreignObject x="415.5" y="375.2" width="105" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  d_{2}"></div></foreignObject>
    <line x1="532" y1="392" x2="588" y2="392" stroke="#0D9488" stroke-width="2" fill="none" marker-end="url(#bt-l3)"/><foreignObject x="532" y="362.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="592" y="370" width="120" height="44" rx="6" class="l3"/><foreignObject x="599.5" y="375.2" width="105" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  d_{3}"></div></foreignObject>
    <line x1="716" y1="392" x2="772" y2="392" stroke="#DB2777" stroke-width="2" fill="none" marker-end="url(#bt-l4)"/><foreignObject x="716" y="362.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#BE185D;font-weight:700" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject>
    <rect x="776" y="370" width="120" height="44" rx="6" class="bg"/><foreignObject x="789" y="375.2" width="94" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  K"></div></foreignObject>
    <foreignObject x="225" y="430.5" width="510" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700"><span>параметров по-прежнему 80: веса не зависят от <span data-tex="B"></span></span></div></foreignObject>
    <text x="480" y="474" class="cap" text-anchor="middle">softmax и ReLU применяются к каждой строке отдельно</text>
  </g>
  <text x="30" y="508" class="legend">синий — объекты · слои: оранжевый — 1 · фиолетовый — 2 · бирюзовый — 3 · розовый — 4 (выходной) · зелёный — выход</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="w x1 b h1r" data-focus="x1 h1r">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>Одна квартира — одна строка</h4>
      <p>Начнём с того, что уже было: строка <span class="math-inline" data-tex="x"></span> первой квартиры умножается на <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>, прибавляется <span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span>, получается строка <span class="math-inline" data-tex="h^{(1)}"></span> из четырёх чисел.</p>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r" data-focus="x2">
      <div class="step-kicker">Шаг 2 · данные</div>
      <h4>Вторая квартира — вторая строка</h4>
      <p>Добавим вторую квартиру: 38 м², 1 комната, 2-й этаж. Она ложится в таблицу строкой под первой. Так <span class="math-inline" data-tex="x"></span> превращается в матрицу <span class="math-inline" data-tex="X"></span> формы <span class="math-inline" data-tex="B \times m"></span>, где <span class="math-inline" data-tex="B"></span> — число квартир в батче.</p>
      <div class="math-display" data-tex="X = \begin{bmatrix}54 &amp; 2 &amp; 7\\ 38 &amp; 1 &amp; 2\end{bmatrix} \in \mathbb{R}^{2\times 3}"></div>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r h2r rows" data-focus="rows h2r">
      <div class="step-kicker">Шаг 3 · операция</div>
      <h4>Каждая строка — через ту же <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span></h4>
      <p>Матричное умножение считает каждую строку <span class="math-inline" data-tex="X"></span> отдельно: строка <span class="math-inline" data-tex="i"></span> результата — это строка <span class="math-inline" data-tex="i"></span> из <span class="math-inline" data-tex="X"></span>, умноженная на <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>. Квартиры друг на друга не влияют, а веса у них общие.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · вторая квартира</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="[38,\ 1,\ 2]\,\textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="h^{(1)}_2 = [1.16,\ 0.12,\ 0.84,\ 0.20]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> первая строка <span class="math-inline" data-tex="H^{(1)}"></span> осталась прежней — [1.48, 1.26, 1.17, 1.80]. Добавление второй квартиры её не изменило.</p>
      </div>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r h2r shape" data-focus="shape">
      <div class="step-kicker">Шаг 4 · формы</div>
      <h4>Домино с батчем</h4>
      <p>Формы стыкуются так же, как раньше, только вместо 1 слева стоит <span class="math-inline" data-tex="B"></span>. Внутренний размер <span class="math-inline" data-tex="m"></span> по-прежнему сокращается.</p>
      <div class="math-display" data-tex="[B\times m]\cdot[m\times d_1] = [B\times d_1]"></div>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r h2r shape bc" data-focus="bc">
      <div class="step-kicker">Шаг 5 · смещение</div>
      <h4>Смещение копируется в каждую строку</h4>
      <p>У <span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span> форма <span class="math-inline" data-tex="1 \times d_{1}"></span>, а у <span class="math-inline" data-tex="X \textcolor{#EA580C}{W_1}"></span> — <span class="math-inline" data-tex="B \times d_{1}"></span>. Строку <span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span> прибавляют к каждой строке: каждая квартира получает одинаковую поправку. В NumPy и PyTorch это делает broadcasting автоматически.</p>
      <div class="math-display" data-tex="H^{(1)} = \sigma\big(X \textcolor{#EA580C}{W_1} + \mathbf{1}\, \textcolor{#EA580C}{b_1}\big), \qquad \mathbf{1} \in \mathbb{R}^{B\times 1}"></div>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r h2r shape chain" data-focus="chain">
      <div class="step-kicker">Шаг 6 · вся сеть</div>
      <h4>Батч проходит через всю матрёшку</h4>
      <p>Все формулы частей 3–5 остаются теми же, только строки превращаются в матрицы с <span class="math-inline" data-tex="B"></span> строками. Число параметров от <span class="math-inline" data-tex="B"></span> не зависит: 80 весов обрабатывают хоть одну квартиру, хоть тысячу.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · обе квартиры</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Вход</span>
            <div class="math-display worked-math" data-tex="X \in \mathbb{R}^{2\times 3}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Выход</span>
            <div class="math-display worked-math" data-tex="P = \begin{bmatrix}0.4207 &amp; 0.2940 &amp; 0.2853\\ 0.3997 &amp; 0.3184 &amp; 0.2818\end{bmatrix}"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> первая строка <span class="math-inline" data-tex="P"></span> та же, что в части 5. Вторую квартиру сеть тоже относит к high — веса ещё не обучены.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-yellow">
  <strong>На практике:</strong> в PyTorch <code>nn.Linear(m, d)</code> хранит
  веса в форме <span class="math-inline" data-tex="d \times m"></span> и считает <code>X @ W.T + b</code>. Это та же запись <span class="math-inline" data-tex="x W"></span>,
  просто матрица хранится транспонированной.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> батч — это те же строки, сложенные в
  матрицу. Каждая строка проходит через одни и те же веса независимо от
  остальных, формы превращаются из <span class="math-inline" data-tex="1 \times d"></span> в <span class="math-inline" data-tex="B \times d"></span>, а число параметров не
  меняется.
</div>

<hr>

<h2 id="part-7">Часть 7. Обратный проход: раскрываем матрёшку снаружи внутрь</h2>

<p>
  Прямой проход собирает матрёшку изнутри наружу: <span class="math-inline" data-tex="x"></span>, потом первый слой, потом
  второй. Обратный проход идёт в обратном порядке: сначала лосс, потом
  внешняя оболочка, и так до самой внутренней. На каждой оболочке считаются
  две вещи: <strong>градиент по весам</strong> этого слоя и
  <strong>ошибка <span class="math-inline" data-tex="\delta"></span></strong>, которую нужно передать следующей, более внутренней
  оболочке.
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial W_k} = h^{(k-1)\top}\,\delta_k, \qquad \delta_{k-1} = \big(\delta_k W_k^{\top}\big) \odot \sigma^{\prime}(z_{k-1})"></div>

<div class="callout-blue">
  <strong>Проверка:</strong> все градиенты ниже сверены с численными (конечные
  разности по каждому из 64 весов). Максимальное расхождение — <span class="math-inline" data-tex="2\cdot 10^{-10}"></span>.
</div>

<p>Раскрываем матрёшку пошагово.</p>

<div class="stage" id="stageBack" tabindex="0">
  <div class="stage-figure">
<svg id="bw" viewBox="0 0 960 600" role="img" aria-label="Обратный проход: градиент идёт от лосса к весам, матрёшка раскрывается снаружи внутрь">
  <style>
    #bw { font-family: Helvetica, Arial, sans-serif; }
    #bw .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #bw .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #bw .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #bw .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.8; }
    #bw .bn { fill: #FFFFFF; stroke: #B9B2A4; stroke-width: 1.2; }
    #bw .lbl { font-size: 17px; fill: #111111; }
    #bw .lb { font-size: 16px; fill: #111111; font-weight: 700; }
    #bw .v { font-size: 13px; fill: #111111; }
    #bw .cap { font-size: 14px; fill: #5E5850; }
    #bw .hdr { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #bw .capY { font-size: 14px; fill: #8C7106; font-weight: 700; }
    #bw .capG { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #bw .capR { font-size: 14px; fill: #C30B0A; font-weight: 700; }
    #bw .capB { font-size: 14px; fill: #2A5E9B; font-weight: 700; }
    #bw .sh { fill: none; stroke: #C29E08; stroke-width: 1.8; }
    #bw .shl { font-size: 15px; fill: #8C7106; font-weight: 700; }
    #bw .eB { stroke: #3576C0; stroke-width: 1.8; fill: none; }
    #bw .eY { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #bw .eR { stroke: #C30B0A; stroke-width: 2; fill: none; }
    #bw .eG { stroke: #73B222; stroke-width: 2; fill: none; }
    #bw .eN { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    #bw .dash { stroke-dasharray: 5 4; }
    #bw .legend { font-size: 13px; fill: #5E5850; }
    #bw .l1  { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.8; }
    #bw .l1e { stroke: #E8590C; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #bw .l1s { fill: none; stroke: #E8590C; stroke-width: 2.2; }
    #bw .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #bw .l2e { stroke: #7C3AED; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #bw .l2s { fill: none; stroke: #7C3AED; stroke-width: 2.2; }
    #bw .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
    #bw .l3e { stroke: #0D9488; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #bw .l3s { fill: none; stroke: #0D9488; stroke-width: 2.2; }
    #bw .l4  { fill: #FDEBF4; stroke: #DB2777; stroke-width: 1.8; }
    #bw .l4e { stroke: #DB2777; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #bw .l4s { fill: none; stroke: #DB2777; stroke-width: 2.2; }
  </style>
  <defs>
    <marker id="bw-aB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="bw-aY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
    <marker id="bw-aR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bw-aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
    <marker id="bw-aN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
  </defs>
  <g data-key="fwd">
    <text x="30" y="50" class="hdr">ПРЯМОЙ ПРОХОД И ЛОСС</text>
    <rect x="22.0" y="90" width="76" height="46" rx="8" class="bx"/><foreignObject x="36" y="96.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <rect x="192.0" y="90" width="76" height="46" rx="8" class="l1"/><foreignObject x="189" y="96.2" width="82" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="h^{(1)}"></div></foreignObject>
    <rect x="362.0" y="90" width="76" height="46" rx="8" class="l2"/><foreignObject x="359" y="96.2" width="82" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="h^{(2)}"></div></foreignObject>
    <rect x="532.0" y="90" width="76" height="46" rx="8" class="l3"/><foreignObject x="529" y="96.2" width="82" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="h^{(3)}"></div></foreignObject>
    <rect x="702.0" y="90" width="76" height="46" rx="8" class="bg"/><foreignObject x="716" y="96.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="p"></div></foreignObject>
    <rect x="842.0" y="90" width="76" height="46" rx="8" class="br"/><foreignObject x="856" y="96.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="L"></div></foreignObject>
    <line x1="100.0" y1="102" x2="189.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <line x1="270.0" y1="102" x2="359.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <line x1="440.0" y1="102" x2="529.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <line x1="610.0" y1="102" x2="699.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <line x1="780.0" y1="102" x2="839.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <rect x="115.0" y="200" width="60" height="34" rx="6" class="l1"/><foreignObject x="115.5" y="200.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="285.0" y="200" width="60" height="34" rx="6" class="l2"/><foreignObject x="285.5" y="200.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="455.0" y="200" width="60" height="34" rx="6" class="l3"/><foreignObject x="455.5" y="200.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="625.0" y="200" width="60" height="34" rx="6" class="l4"/><foreignObject x="625.5" y="200.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#BE185D;font-weight:700" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject>
    <foreignObject x="721.5" y="60.5" width="177" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span>softmax + лосс</span></div></foreignObject>
    <text x="30" y="296" class="hdr">МАТРЁШКА</text>
    <rect x="256" y="340" width="40" height="36" rx="6" class="bx"/><foreignObject x="252" y="341.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <rect x="242" y="332" width="170" height="52" rx="10" class="l1s"/>
    <foreignObject x="306" y="341.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#C2410C}{W_1} + \textcolor{#C2410C}{b_1})"></div></foreignObject>
    <rect x="228" y="324" width="300" height="68" rx="12" class="l2s"/>
    <foreignObject x="422" y="341.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#6D28D9;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#6D28D9}{W_2} + \textcolor{#6D28D9}{b_2})"></div></foreignObject>
    <rect x="214" y="316" width="430" height="84" rx="14" class="l3s"/>
    <foreignObject x="538" y="341.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#0F766E;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#0F766E}{W_3} + \textcolor{#0F766E}{b_3})"></div></foreignObject>
    <rect x="200" y="308" width="560" height="100" rx="16" class="l4s"/>
    <foreignObject x="654" y="341.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#BE185D;font-weight:700" data-tex="\cdot\, \textcolor{#BE185D}{W_4} + \textcolor{#BE185D}{b_4}"></div></foreignObject>
  </g>
  <g data-key="d4">
    <line x1="840.0" y1="126" x2="781.0" y2="126" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="671.5" y="140.5" width="137" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\delta_4 = p - t"></div></foreignObject>
    <rect x="200" y="308" width="560" height="100" rx="16" class="eR dash" stroke-width="3"/>
  </g>
  <g data-key="g4">
    <line x1="667.0" y1="128" x2="667.0" y2="196" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="607" y="234.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\partial L / \partial \textcolor{#BE185D}{W_4}"></div></foreignObject>
    <foreignObject x="567" y="253.8" width="176" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="h^{(3)\top}\delta_4 \;\cdot\; 4 \times 3"></div></foreignObject>
  </g>
  <g data-key="d3">
    <line x1="700.0" y1="126" x2="611.0" y2="126" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="542" y="140.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\delta_{3}"></div></foreignObject>
    <rect x="214" y="316" width="430" height="84" rx="14" class="eR dash" stroke-width="3"/>
    <foreignObject x="539" y="137.8" width="120" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:13px;color:#C30B0A;font-weight:400" data-tex="\cdot\, \textcolor{#BE185D}{W_4}^{\top} \odot \sigma&#x27;"></div></foreignObject>
  </g>
  <g data-key="g3">
    <line x1="497.0" y1="128" x2="497.0" y2="196" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="437" y="234.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\partial L / \partial \textcolor{#0F766E}{W_3}"></div></foreignObject>
    <foreignObject x="397" y="253.8" width="176" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="h^{(2)\top}\delta_3 \;\cdot\; 5 \times 4"></div></foreignObject>
  </g>
  <g data-key="rest">
    <line x1="530.0" y1="126" x2="441.0" y2="126" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="372" y="140.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\delta_{2}"></div></foreignObject>
    <rect x="228" y="324" width="300" height="68" rx="12" class="eR dash" stroke-width="3"/>
    <foreignObject x="369" y="137.8" width="120" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:13px;color:#C30B0A;font-weight:400" data-tex="\cdot\, \textcolor{#0F766E}{W_3}^{\top} \odot \sigma&#x27;"></div></foreignObject>
    <line x1="360.0" y1="126" x2="271.0" y2="126" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="202" y="140.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\delta_{1}"></div></foreignObject>
    <rect x="242" y="332" width="170" height="52" rx="10" class="eR dash" stroke-width="3"/>
    <foreignObject x="199" y="137.8" width="120" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:13px;color:#C30B0A;font-weight:400" data-tex="\cdot\, \textcolor{#6D28D9}{W_2}^{\top} \odot \sigma&#x27;"></div></foreignObject>
    <line x1="327.0" y1="128" x2="327.0" y2="196" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="267" y="234.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\partial L / \partial \textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <foreignObject x="227" y="253.8" width="176" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="h^{(1)\top}\delta_2 \;\cdot\; 4 \times 5"></div></foreignObject>
    <line x1="157.0" y1="128" x2="157.0" y2="196" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="97" y="234.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\partial L / \partial \textcolor{#C2410C}{W_1}"></div></foreignObject>
    <foreignObject x="71" y="253.8" width="148" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="x^{\top}\delta_1 \;\cdot\; 3 \times 4"></div></foreignObject>
  </g>
  <g data-key="chain" data-only="1">
    <rect x="40" y="440" width="880" height="56" rx="6" class="br"/>
    <foreignObject x="60" y="444" width="840" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-lg svg-math-center" data-tex="\frac{\partial L}{\partial \textcolor{#C2410C}{W_1}} \ne \frac{\partial L}{\partial y}\cdot\frac{\partial y}{\partial \textcolor{#0F766E}{W_3}}\cdot\frac{\partial h^{(3)}}{\partial \textcolor{#0F766E}{W_3}}\cdots"></div></foreignObject>
    <rect x="40" y="506" width="880" height="60" rx="6" class="bg"/>
    <foreignObject x="60" y="508" width="840" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-lg svg-math-center" data-tex="\frac{\partial L}{\partial \textcolor{#C2410C}{W_1}} = \frac{\partial L}{\partial y}\cdot\frac{\partial y}{\partial h^{(3)}}\cdot\frac{\partial h^{(3)}}{\partial h^{(2)}}\cdot\frac{\partial h^{(2)}}{\partial h^{(1)}}\cdot\frac{\partial h^{(1)}}{\partial \textcolor{#C2410C}{W_1}}"></div></foreignObject>
  </g>
  <g data-key="upd" data-only="1">
    <rect x="40" y="446" width="880" height="110" rx="6" class="bn"/>
    <foreignObject x="60" y="456" width="840" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-lg svg-math-center" data-tex="W_k \leftarrow W_k - \eta\,\frac{\partial L}{\partial W_k}"></div></foreignObject>
    <foreignObject x="84" y="510.5" width="792" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span>с батчем <span data-tex="h^{\top}\delta"></span> складывает вклады всех <span data-tex="B"></span> строк: форма градиента та же, что у <span data-tex="W"></span></span></div></foreignObject>
  </g>
  <text x="30" y="588" class="legend">синий — прямой проход · цвет — номер слоя · красный — градиент и лосс · пунктир — раскрытая оболочка</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="fwd" data-focus="fwd">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Дифференцируем лосс, а не выход</h4>
      <p>Прямой проход собрал матрёшку и выдал лосс <span class="math-inline" data-tex="L = 1.2241"></span>. Задача обучения — узнать, как <span class="math-inline" data-tex="L"></span> меняется от каждого веса, то есть найти <span class="math-inline" data-tex="\partial L/\partial W_{k}"></span> для всех <span class="math-inline" data-tex="k"></span>. Дифференцировать нужно именно <span class="math-inline" data-tex="L"></span>: у выхода <span class="math-inline" data-tex="y"></span> нет «правильного направления», оно появляется только в сравнении с ответом.</p>
    </div>
    <div class="step-panel" data-on="fwd d4" data-focus="d4">
      <div class="step-kicker">Шаг 2 · градиент</div>
      <h4>Внешняя оболочка: <span class="math-inline" data-tex="\delta_4 = p - t"></span></h4>
      <p>Начинаем с самой внешней оболочки. Обозначу <span class="math-inline" data-tex="\delta_k = \partial L/\partial z_k"></span> — градиент по строке слоя <span class="math-inline" data-tex="k"></span> до активации. Для softmax вместе с кросс-энтропией он получается удивительно простым: вероятности минус правильный ответ.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · та же квартира</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="p - t = [0.4207,\ 0.2940,\ 0.2853] - [0,\ 1,\ 0]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="\delta_4 = [0.4207,\ -0.7060,\ 0.2853]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> знак говорит, куда двигать оценку: у medium −0.706 — её надо поднять, у high и low — опустить.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4" data-focus="g4">
      <div class="step-kicker">Шаг 3 · веса</div>
      <h4>Градиент по <span class="math-inline" data-tex="\textcolor{#DB2777}{W_4}"></span> — вход слоя на его <span class="math-inline" data-tex="\delta"></span></h4>
      <p>Вес <span class="math-inline" data-tex="\textcolor{#DB2777}{W_4}[i, j]"></span> умножал <span class="math-inline" data-tex="h^{(3)}_i"></span> и попадал в оценку <span class="math-inline" data-tex="j"></span>. Поэтому его градиент — произведение того, что пришло на вход, и того, что пришло сзади. Для всей матрицы это внешнее произведение, и форма совпадает с <span class="math-inline" data-tex="\textcolor{#DB2777}{W_4}"></span>.</p>
      <div class="math-display" data-tex="\frac{\partial L}{\partial \textcolor{#DB2777}{W_4}} = h^{(3)\top}\,\delta_4 \quad [4\times 1]\cdot[1\times 3] = [4\times 3]"></div>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · вторая строка</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Вход <span class="math-inline" data-tex="h^{(3)}_2"></span></span>
            <div class="math-display worked-math" data-tex="h^{(3)}_2 = 0"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Строка градиента</span>
            <div class="math-display worked-math" data-tex="\frac{\partial L}{\partial \textcolor{#DB2777}{W_4}}[2,:] = [0,\ 0,\ 0]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> второй нейрон третьего слоя ReLU обнулил. Раз он ничего не передал вперёд, его исходящие веса на лосс не повлияли — и градиент у них ноль.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3" data-focus="d3">
      <div class="step-kicker">Шаг 4 · градиент</div>
      <h4>Передаём ошибку внутрь</h4>
      <p>Чтобы снять следующую оболочку, нужно <span class="math-inline" data-tex="\delta_{3}"></span>. Ошибка идёт назад через те же веса, но транспонированные, а потом через производную ReLU: 1 там, где <span class="math-inline" data-tex="z"></span> было положительным, и 0 там, где нейрон обнулили.</p>
      <div class="math-display" data-tex="\delta_3 = \big(\delta_4\, \textcolor{#DB2777}{W_4}^{\top}\big) \odot \sigma^{\prime}(z_3)"></div>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · та же квартира</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>До маски <span class="math-inline" data-tex="\sigma&#x27;"></span></span>
            <div class="math-display worked-math" data-tex="\delta_4 \textcolor{#DB2777}{W_4}^{\top} = [0.3801,\ -0.3515,\ -0.1006,\ 0.3395]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>После маски</span>
            <div class="math-display worked-math" data-tex="\delta_3 = [0.3801,\ 0,\ -0.1006,\ 0.3395]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> ReLU закрывает дорогу не только вперёд, но и назад: сигнал −0.3515 пришёл к обнулённому нейрону и дальше не прошёл.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3 g3" data-focus="g3">
      <div class="step-kicker">Шаг 5 · веса</div>
      <h4>Градиент по <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span> и мёртвый столбец</h4>
      <p>Тот же шаблон: вход слоя на его <span class="math-inline" data-tex="\delta"></span>. Форма <span class="math-inline" data-tex="5 \times 4"></span>, как у <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span>.</p>
      <div class="math-display" data-tex="\frac{\partial L}{\partial \textcolor{#0D9488}{W_3}} = h^{(2)\top}\,\delta_3 \quad [5\times 1]\cdot[1\times 4] = [5\times 4]"></div>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · первая строка градиента</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span><span class="math-inline" data-tex="h^{(2)}_1 \cdot \delta_3"></span></span>
            <div class="math-display worked-math" data-tex="0.732\cdot[0.3801,\ 0,\ -0.1006,\ 0.3395]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="[0.2782,\ 0,\ -0.0736,\ 0.2485]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> весь второй столбец <span class="math-inline" data-tex="\partial L/\partial \textcolor{#0D9488}{W_3}"></span> — нули. Это входящие веса того самого обнулённого нейрона: для этой квартиры они не обучаются.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3 g3 rest" data-focus="rest">
      <div class="step-kicker">Шаг 6 · повторение</div>
      <h4>Оставшиеся оболочки — тем же шаблоном</h4>
      <p>Дальше ничего нового: <span class="math-inline" data-tex="\delta_2 = (\delta_3 \textcolor{#0D9488}{W_3}^{\top}) \odot \sigma&#x27;(z_2)"></span>, <span class="math-inline" data-tex="\delta_1 = (\delta_2 \textcolor{#8B5CF6}{W_2}^{\top}) \odot \sigma&#x27;(z_1)"></span>, и градиент каждого слоя — его вход, транспонированный, на его <span class="math-inline" data-tex="\delta"></span>.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · та же квартира</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Ошибка идёт внутрь</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\delta_{2}"></span></div>
            <div class="math-display worked-trace-math" data-tex="[0.1659,\ -0.2219,\ 0.1361,\ 0.1379,\ -0.1600]"></div>
            <div class="worked-trace-note">5 чисел, как у слоя 2</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\delta_{1}"></span></div>
            <div class="math-display worked-trace-math" data-tex="[0.1789,\ -0.1737,\ -0.0776,\ 0.1699]"></div>
            <div class="worked-trace-note">4 числа, как у слоя 1</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\partial L/\partial \textcolor{#EA580C}{W_1}"></span></div>
            <div class="math-display worked-trace-math" data-tex="x^{\top}\delta_1,\ \text{строка 1} = [9.6603,\ -9.3778,\ -4.1927,\ 9.1763]"></div>
            <div class="worked-trace-note">в 27 раз больше строки 2</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> первая строка <span class="math-inline" data-tex="\partial L/\partial \textcolor{#EA580C}{W_1}"></span> огромная, потому что <span class="math-inline" data-tex="x_1 = 54"></span> — площадь. Градиент по весу пропорционален входу, поэтому признаки перед обучением приводят к одному масштабу.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3 g3 rest chain" data-focus="chain">
      <div class="step-kicker">Шаг 7 · правило</div>
      <h4>Цепочка идёт через <span class="math-inline" data-tex="h"></span>, а не через соседние <span class="math-inline" data-tex="W"></span></h4>
      <p>Частая ошибка — вести цепное правило от веса к весу. Но <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span> не зависит от <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>: связь между слоями идёт только через строки <span class="math-inline" data-tex="h"></span>. Правильная цепочка проходит через все оболочки снаружи внутрь и лишь в самом конце сворачивает к <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>.</p>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3 g3 rest upd" data-focus="upd">
      <div class="step-kicker">Шаг 8 · обучение</div>
      <h4>Шаг градиентного спуска и батч</h4>
      <p>Имея все <span class="math-inline" data-tex="\partial L/\partial W_{k}"></span>, каждый вес сдвигают против градиента с шагом <span class="math-inline" data-tex="\eta"></span>. С батчем формулы те же, только <span class="math-inline" data-tex="h"></span> и <span class="math-inline" data-tex="\delta"></span> — матрицы из <span class="math-inline" data-tex="B"></span> строк: произведение <span class="math-inline" data-tex="h^{\top}\delta"></span> само складывает вклады всех объектов.</p>
      <div class="math-display" data-tex="\frac{\partial L}{\partial W_k} = H^{(k-1)\top}\,\Delta_k \quad [d_{k-1}\times B]\cdot[B\times d_k] = [d_{k-1}\times d_k]"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-yellow">
  <strong>Подводный камень:</strong> огромная первая строка <span class="math-inline" data-tex="\partial L/\partial \textcolor{#EA580C}{W_1}"></span> — не ошибка
  вычислений, а следствие того, что площадь измерена в квадратных метрах, а
  число комнат — в штуках. Без нормализации признаков шаг обучения, удобный
  для одних весов, окажется слишком большим для других.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обратный проход раскрывает матрёшку в
  обратном порядке. На каждой оболочке градиент по весам — это вход слоя,
  транспонированный, на его <span class="math-inline" data-tex="\delta"></span>, а <span class="math-inline" data-tex="\delta"></span> передаётся внутрь через <span class="math-inline" data-tex="W^{\top}"></span> и производную
  активации.
</div>

<hr>

<h2 id="part-8">Часть 8. Что важно уметь восстановить по памяти</h2>

<ol class="end-list">
  <li><strong>Объект — строка:</strong> <span class="math-inline" data-tex="x \in \mathbb{R}^{1\times m}"></span>, ответ — строка длины <span class="math-inline" data-tex="K"></span>, правильный ответ записывается one-hot.</li>
  <li><strong>Слой — матрица:</strong> <span class="math-inline" data-tex="W"></span> формы «входов × нейронов»; строка — всё, что выходит из одного входа, столбец — всё, что входит в один нейрон.</li>
  <li><strong>Индексы <span class="math-inline" data-tex="w^{(k)}_{ij}"></span>:</strong> слой <span class="math-inline" data-tex="k"></span>, из входа <span class="math-inline" data-tex="i"></span> в нейрон <span class="math-inline" data-tex="j"></span>.</li>
  <li><strong>Домино размеров:</strong> <span class="math-inline" data-tex="[1\times m][m\times d_1][d_1\times d_2]\dots[d\times K] \to [1\times K]"></span>; строк у <span class="math-inline" data-tex="W"></span> столько, сколько нейронов в предыдущем слое.</li>
  <li><strong>Одна запись на всю сеть:</strong> либо <span class="math-inline" data-tex="x W"></span>, либо <span class="math-inline" data-tex="W x"></span>. Смешаешь — домино рассыплется.</li>
  <li><strong>Без активации</strong> любые слои сворачиваются в один: <span class="math-inline" data-tex="x\,\textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4} = x\,W_{\text{eff}}"></span>.</li>
  <li><strong>Оболочка сети:</strong> <span class="math-inline" data-tex="h^{(k)} = \sigma(h^{(k-1)} W_k + b_k)"></span>, на выходе softmax и кросс-энтропия.</li>
  <li><strong>Батч:</strong> <span class="math-inline" data-tex="X \in \mathbb{R}^{B\times m}"></span>, формы <span class="math-inline" data-tex="B \times d"></span>, параметры от <span class="math-inline" data-tex="B"></span> не зависят.</li>
  <li><strong>Обратный проход:</strong> <span class="math-inline" data-tex="\delta_4 = p - t"></span>, <span class="math-inline" data-tex="\partial L/\partial W_k = h^{(k-1)\top}\,\delta_k"></span>, <span class="math-inline" data-tex="\delta_{k-1} = (\delta_k W_k^{\top}) \odot \sigma&#x27;(z_{k-1})"></span>.</li>
  <li><strong>Цепочка идёт через <span class="math-inline" data-tex="h"></span>:</strong> <span class="math-inline" data-tex="\partial L/\partial \textcolor{#EA580C}{W_1}"></span> проходит через все оболочки <span class="math-inline" data-tex="\partial h^{(k)}/\partial h^{(k-1)}"></span>, а не через соседние веса.</li>
</ol>

<p>
  Картина, которую стоит унести: сеть — это матрёшка из одинаковых оболочек
  <span class="math-inline" data-tex="\sigma(\cdot\, W + b)"></span>. Прямой проход вкладывает их друг в друга изнутри наружу,
  активация не даёт им слипнуться в одну куклу, а обратный проход раскрывает
  их снаружи внутрь, на каждой оболочке оставляя градиент для её весов.
</p>

<p class="tiny">Параметры квартир, веса и смещения в примерах иллюстративные. Все числа посчитаны скриптом на NumPy и округлены до 4 знаков; градиенты сверены с конечными разностями.</p>
