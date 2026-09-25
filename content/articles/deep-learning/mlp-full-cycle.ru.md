<style>
  .article-map {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin: 22px 0;
  }
  .map-card {
    background: #fff;
    border: 1px solid #E4E1D7;
    border-radius: 11px;
    padding: 13px 14px;
    min-height: 92px;
  }
  .map-card span {
    display: block;
    color: #3576C0;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .07em;
    text-transform: uppercase;
  }
  .map-card strong { display: block; margin-top: 4px; font-size: 15px; line-height: 1.35; }
  .map-card p { margin: 4px 0 0; color: #5E5850; font-size: 13px; line-height: 1.4; }
  .viz-svg { font-family: Helvetica, Arial, sans-serif; }
  .viz-svg .v-title { fill: #111; font-size: 22px; font-weight: 800; }
  .viz-svg .v-label { fill: #111; font-size: 15px; font-weight: 700; }
  .viz-svg .v-text { fill: #111; font-size: 14px; }
  .viz-svg .v-small { fill: #5E5850; font-size: 12.5px; }
  .viz-svg .v-tiny { fill: #5E5850; font-size: 11.5px; }
  .viz-svg .layer-name { fill: #111; font-size: 15px; font-weight: 800; letter-spacing: .01em; }
  .viz-svg .tensor-name { fill: #111; font-size: 15px; font-weight: 750; font-style: italic; }
  .viz-svg .tensor-shape { fill: #5E5850; font-size: 11.5px; }
  .viz-svg .parameter-label { fill: #5E5850; font-size: 11.5px; font-weight: 700; }
  .viz-svg .box { fill: #fff; stroke: #C9C2B8; stroke-width: 1.4; }
  .viz-svg .box-blue { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
  .viz-svg .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
  .viz-svg .box-green { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
  .viz-svg .box-red { fill: #FFF4F4; stroke: #C30B0A; stroke-width: 1.6; }
  .viz-svg .node-blue { fill: #fff; stroke: #3576C0; stroke-width: 2; }
  .viz-svg .node-yellow { fill: #fff; stroke: #C29E08; stroke-width: 2; }
  .viz-svg .node-green { fill: #fff; stroke: #73B222; stroke-width: 2; }
  .viz-svg .node-red { fill: #fff; stroke: #C30B0A; stroke-width: 2; }
  .viz-svg .edge { fill: none; stroke: #77736A; stroke-width: 1.6; }
  .viz-svg .edge-blue { fill: none; stroke: #3576C0; stroke-width: 2; }
  .viz-svg .edge-green { fill: none; stroke: #73B222; stroke-width: 2.4; }
  .viz-svg .edge-red { fill: none; stroke: #C30B0A; stroke-width: 2.4; }
  .viz-svg .formula-bg { fill: #FAFAF7; stroke: #D8D4C8; stroke-width: 1.2; }
  .slider-card {
    background: #fff;
    border: 1px solid #E4E1D7;
    border-radius: 14px;
    padding: 20px;
    margin: 30px 0 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
  }
  .slider-layout { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(250px, .6fr); gap: 22px; align-items: center; }
  .slider-figure { overflow-x: auto; }
  .slider-figure svg { display: block; width: 100%; height: auto; }
  .slider-control { background: #F8F7F2; border: 1px solid #E4E1D7; border-radius: 12px; padding: 17px; }
  .slider-control label { display: block; font-weight: 800; font-size: 15px; margin-bottom: 10px; }
  .slider-control input[type="range"] { width: 100%; accent-color: #3576C0; min-height: 36px; }
  .slider-value { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-top: 9px; }
  .slider-value strong { font-size: 24px; }
  .slider-value span { color: #5E5850; font-size: 13px; }
  .equation-card { margin-top: 12px; padding: 11px 12px; background: #fff; border: 1px solid #E4E1D7; border-radius: 9px; overflow-x: auto; }
  .equation-card .math-display { margin: 0; font-size: 14px; }
  .mini-legend { display: flex; flex-wrap: wrap; gap: 12px; margin: 9px 0 0; color: #5E5850; font-size: 13px; }
  .mini-legend span { display: inline-flex; align-items: center; gap: 6px; }
  .mini-legend i { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .code-output { background: #F0FAF0; border-left: 3px solid #73B222; padding: 12px 16px; font-family: "Courier New", monospace; font-size: 14px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .compact-card { background: #fff; border: 1px solid #E4E1D7; border-radius: 12px; padding: 15px 17px; }
  .compact-card h4 { margin: 0 0 7px; font-size: 17px; }
  .compact-card p { font-size: 15px; margin: 5px 0; }
  @media (max-width: 760px) {
    .article-map { grid-template-columns: 1fr 1fr; }
    .slider-layout, .two-col { grid-template-columns: 1fr; }
    .slider-card { padding: 12px; margin-left: -4px; margin-right: -4px; }
  }
</style>



<p class="lead">
  Логистическая регрессия уже содержит почти весь учебный цикл нейросети:
  линейное преобразование, вероятность, loss, градиенты и обновление. Полносвязная
  сеть добавляет главное — несколько таких преобразований подряд и нелинейность
  между ними.
</p>

<p>
  Поэтому мы не будем начинать заново. Возьмём знакомую логику
  <span class="math-inline" data-tex="\text{forward}\to\text{loss}\to\text{backward}\to\text{update}"></span>
  и протянем её через три полносвязных слоя. В примере два признака проходят через
  два скрытых слоя и превращаются в вероятности двух классов. Одни и те же числа,
  обозначения и цвета сохраняются до конца статьи.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>Опора</span>
    <strong>Логистическая регрессия</strong>
    <p>Линейная часть, вероятность, cross-entropy и gradient descent уже знакомы.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>2 → 2 → 2 → 2</strong>
    <p>Два признака, два скрытых слоя и два выходных класса.</p>
  </div>
  <div class="contract-card">
    <span>Результат</span>
    <strong>Полный шаг обучения</strong>
    <p>Каждое значение и каждый градиент можно восстановить по формуле.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные и структура</span>
  <span><i style="background:#C29E08"></i>параметры и текущая операция</span>
  <span><i style="background:#73B222"></i>значения forward</span>
  <span><i style="background:#C30B0A"></i>loss и градиенты backward</span>
</div>


<div class="callout-blue">
  <strong>Как читать интерактивы:</strong> в верхней сцене сначала идёт общая
  формула, а под ней — отдельная сцена с подстановкой чисел. Нажимайте «Далее»:
  яркая часть показывает только текущую операцию. Стрелки ← → работают, когда
  интерактив находится в фокусе.
</div>

## Часть 1. От логистической регрессии к полносвязной сети

<p>
  Логистическая регрессия строит один логит прямо из входных признаков. В
  полносвязной сети выход каждого слоя становится входом следующего. Слово
  <em>полносвязный</em> означает: каждый нейрон слоя получает значения всех
  нейронов предыдущего слоя.
</p>

<div class="math-display" data-tex="\underbrace{\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)}}_{\text{слой 1}}\;\longrightarrow\;\underbrace{\mathbf a^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)}}_{\text{слой 2}}\;\longrightarrow\;\underbrace{\mathbf a^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)}}_{\text{выход}}"></div>

<p>
  Между линейными слоями стоит ReLU. Она нужна не для красоты: без нелинейности
  несколько линейных слоёв схлопнутся в один. В этой статье основная сеть имеет
  два скрытых слоя — они присутствуют в каждом последующем forward и backward.
</p>

### Сначала — один нейрон

<p>
  Прежде чем собирать сеть, посмотрим на её наименьшую деталь. Нейрон не делает
  ничего нового по сравнению с логистической регрессией: он умножает признаки на
  веса, складывает результаты, добавляет сдвиг — и пропускает получившееся число
  через одну функцию сверху.
</p>

<div class="stage" id="stageOneNeuron" tabindex="0" aria-label="Пошаговая схема одного нейрона">
  <div class="stage-figure">
<svg class="viz-svg" id="mlp-oneneuron-svg" viewBox="0 0 960 476" role="img" aria-label="Схема одного нейрона: входы, веса, сумматор, активация и выход">
<defs><marker id="on-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#77736A"/></marker></defs>
<text x="36" y="40" class="v-title">Один нейрон: та же линейная комбинация под новым именем</text>
<text x="36" y="66" class="v-small">Прямоугольник — величина, круг — операция; индекс объекта опущен.</text>
<g data-key="on-inputs"><text x="86" y="102" text-anchor="middle" class="v-small">признаки объекта</text><rect x="42" y="118" width="88" height="46" rx="8" class="box-blue"/><text x="86" y="148" text-anchor="middle" font-size="18" fill="#3576C0">x&#185;</text><rect x="42" y="186" width="88" height="46" rx="8" class="box-blue"/><text x="86" y="216" text-anchor="middle" font-size="18" fill="#3576C0">x&#178;</text><rect x="42" y="276" width="88" height="46" rx="8" class="box-blue"/><text x="86" y="306" text-anchor="middle" font-size="18" fill="#3576C0">x<tspan font-size="12">P</tspan></text><text x="86" y="254" text-anchor="middle" font-size="18" fill="#111111">&#8942;</text></g>
<g data-key="on-edges"><path d="M 132 141 L 396 198" class="edge" marker-end="url(#on-arw)"/><path d="M 132 209 L 396 210" class="edge" marker-end="url(#on-arw)"/><path d="M 132 299 L 396 230" class="edge" marker-end="url(#on-arw)"/></g>
<g data-key="on-weights"><text x="243" y="128" text-anchor="middle" class="v-small">веса</text><rect x="214" y="147" width="58" height="36" rx="7" class="box-yellow"/><text x="243" y="172" text-anchor="middle" font-size="16" fill="#C29E08">&#969;&#8321;</text><rect x="214" y="192" width="58" height="36" rx="7" class="box-yellow"/><text x="243" y="217" text-anchor="middle" font-size="16" fill="#C29E08">&#969;&#8322;</text><rect x="214" y="252" width="58" height="36" rx="7" class="box-yellow"/><text x="243" y="277" text-anchor="middle" font-size="16" fill="#C29E08">&#969;<tspan font-size="12">P</tspan></text></g>
<g data-key="on-bias"><rect x="42" y="344" width="88" height="44" rx="8" class="box"/><text x="86" y="373" text-anchor="middle" font-size="18" fill="#111111">b</text><text x="86" y="408" text-anchor="middle" class="v-small">сдвиг</text><path d="M 132 366 L 398 248" class="edge" marker-end="url(#on-arw)"/></g>
<g data-key="on-sum"><circle cx="450" cy="214" r="48" class="node-yellow"/><text x="450" y="228" text-anchor="middle" font-size="30" fill="#111111">&#931;</text><text x="450" y="294" text-anchor="middle" class="v-small">взвешенная сумма</text></g>
<g data-key="on-z"><path d="M 500 214 L 574 214" class="edge" marker-end="url(#on-arw)"/><rect x="584" y="190" width="76" height="48" rx="8" class="box"/><text x="622" y="222" text-anchor="middle" font-size="18" fill="#111111">z</text></g>
<g data-key="on-problem" data-only="1"><text x="622" y="168" text-anchor="middle" font-size="14" fill="#C30B0A">z &#8712; (&#8722;&#8734;, +&#8734;)</text><text x="622" y="270" text-anchor="middle" font-size="14" fill="#C30B0A">а нужна вероятность</text></g>
<g data-key="on-act"><path d="M 662 214 L 712 214" class="edge" marker-end="url(#on-arw)"/><circle cx="766" cy="214" r="46" class="node-yellow"/><polyline points="738,236 743,235 748,232 753,226 758,218 766,214 774,210 779,202 784,196 789,193 794,192" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="766" y="294" text-anchor="middle" class="v-small">активация f</text></g>
<g data-key="on-out"><path d="M 812 214 L 856 214" class="edge" marker-end="url(#on-arw)"/><rect x="866" y="190" width="76" height="48" rx="8" class="box-green"/><text x="904" y="222" text-anchor="middle" font-size="18" fill="#5a8c1c">&#375;</text><text x="904" y="168" text-anchor="middle" class="v-small">предсказание</text></g>
<g data-key="on-matrix" data-only="1"><rect x="200" y="372" width="144" height="30" fill="#3576C0" fill-opacity="0.1"/>
<line x1="248" y1="372" x2="248" y2="402" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="296" y1="372" x2="296" y2="402" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 199 367 L 189 367 L 189 407 L 199 407" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 345 367 L 355 367 L 355 407 L 345 407" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<text x="224" y="391.8" text-anchor="middle" font-size="14" fill="#111111">x<tspan font-size="10" dy="4">1</tspan></text>
<text x="272" y="391.8" text-anchor="middle" font-size="14" fill="#111111">x<tspan font-size="10" dy="4">2</tspan></text>
<text x="320" y="391.8" text-anchor="middle" font-size="14" fill="#111111">x<tspan font-size="10" dy="4">P</tspan></text>
<text x="272" y="358" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">[1, P]</text>
<text x="272" y="428" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">x</text><text x="374" y="392" text-anchor="middle" font-size="20" fill="#111111">&#183;</text><rect x="400" y="342" width="48" height="90" fill="#C29E08" fill-opacity="0.16"/>
<line x1="400" y1="372" x2="448" y2="372" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="400" y1="402" x2="448" y2="402" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 399 337 L 389 337 L 389 437 L 399 437" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 449 337 L 459 337 L 459 437 L 449 437" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="424" y="361.8" text-anchor="middle" font-size="14" fill="#111111">&#969;<tspan font-size="10" dy="4">1</tspan></text>
<text x="424" y="391.8" text-anchor="middle" font-size="14" fill="#111111">&#969;<tspan font-size="10" dy="4">2</tspan></text>
<text x="424" y="421.8" text-anchor="middle" font-size="14" fill="#111111">&#969;<tspan font-size="10" dy="4">P</tspan></text>
<text x="424" y="328" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">[P, 1]</text>
<text x="424" y="458" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">&#969;</text><text x="490" y="392" text-anchor="middle" font-size="20" fill="#111111">+</text><rect x="516" y="372" width="48" height="30" fill="#C29E08" fill-opacity="0.16"/>
<path d="M 515 367 L 505 367 L 505 407 L 515 407" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 565 367 L 575 367 L 575 407 L 565 407" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="540" y="391.8" text-anchor="middle" font-size="14" fill="#111111">b</text>
<text x="540" y="358" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">[1]</text>
<text x="540" y="428" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b</text><text x="600" y="392" text-anchor="middle" font-size="20" fill="#111111">=</text><rect x="626" y="372" width="48" height="30" fill="#73B222" fill-opacity="0.1"/>
<path d="M 625 367 L 615 367 L 615 407 L 625 407" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 675 367 L 685 367 L 685 407 L 675 407" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="650" y="391.8" text-anchor="middle" font-size="14" fill="#111111">z</text>
<text x="650" y="358" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">[1]</text>
<text x="650" y="428" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">z</text><text x="812" y="386" text-anchor="middle" font-size="13" fill="#5E5850">та же сумма,</text><text x="812" y="406" text-anchor="middle" font-size="13" fill="#5E5850">другая запись</text></g>
</svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="on-inputs" data-focus="on-inputs"><div class="step-kicker">Шаг 1 &#183; вход</div><h4>На вход подаётся один объект</h4><div class="math-display" data-tex="\mathbf x=(x^1,x^2,\ldots,x^P)"></div><p>Объект описан набором из <span class="math-inline" data-tex="P"></span> чисел — признаков. Для письма это частота подозрительных слов и длина текста, для картинки — яркости пикселей.</p></div>
    <div class="step-panel" data-on="on-inputs on-edges on-weights" data-focus="on-weights"><div class="step-kicker">Шаг 2 &#183; параметры</div><h4>Каждому признаку — свой вес</h4><div class="math-display" data-tex="z=\omega_1x^1+\omega_2x^2+\ldots+\omega_Px^P+b"></div><p>Вес <span class="math-inline" data-tex="\omega_p"></span> отвечает на вопрос, насколько сильно p-й признак влияет на ответ. Признаки приходят из данных и не меняются; веса и сдвиг подбирает обучение.</p></div>
    <div class="step-panel" data-on="on-inputs on-edges on-weights on-bias on-sum on-z" data-focus="on-sum"><div class="step-kicker">Шаг 3 &#183; операция</div><h4>Сумматор сворачивает всё в одно число</h4><div class="math-display" data-tex="z=\sum_{p=1}^{P}\omega_px^p+b"></div><p>Сдвиг нужен, чтобы модель могла выдавать ненулевой ответ, когда все признаки равны нулю: без него разделяющая прямая была бы обязана проходить через начало координат.</p></div>
    <div class="step-panel" data-on="on-inputs on-weights on-bias on-sum on-z on-matrix" data-focus="on-matrix"><div class="step-kicker">Шаг 4 &#183; та же операция, другая запись</div><h4>Сумму удобнее записать как произведение</h4><div class="math-display" data-tex="z=\mathbf x\,\boldsymbol\omega+b,\qquad [1,P]\cdot[P,1]\to[1]"></div><p>Ничего нового не произошло: это те же P умножений и одна сумма. Но такая запись без изменений переносится на слой, на батч и на всю сеть — а проверка размерностей ловит ошибку раньше, чем запуск.</p></div>
    <div class="step-panel" data-on="on-inputs on-weights on-bias on-sum on-z on-problem" data-focus="on-problem"><div class="step-kicker">Шаг 5 &#183; ограничение</div><h4>Проблема: выход ничем не ограничен</h4><div class="math-display" data-tex="z\in(-\infty,+\infty)"></div><p>Для регрессии это нормально: цена и правда может быть любой. Но для вопроса «спам или не спам» ответ должен быть числом от нуля до единицы.</p></div>
    <div class="step-panel" data-on="on-inputs on-weights on-bias on-sum on-z on-act on-out" data-focus="on-out"><div class="step-kicker">Шаг 6 &#183; активация</div><h4>Между суммой и выходом стоит ещё одна функция</h4><div class="math-display" data-tex="\hat y=f(z)"></div><p>Именно здесь появляется нелинейность. В скрытых слоях этой статьи роль <span class="math-inline" data-tex="f"></span> играет ReLU, на выходе — softmax.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">&#8592; Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее &#8594;</button></div>
</div>
<p class="stage-hint">Цель интерактива: увидеть, что нейрон — это линейная комбинация плюс одна функция сверху.</p>

<div class="callout-blue">
  <strong>Что нужно запомнить из этой сцены:</strong> линейная часть
  <span class="math-inline" data-tex="z=\mathbf x\boldsymbol\omega+b"></span>
  и функция активации <span class="math-inline" data-tex="f"></span> — два разных
  шага. Всё остальное в статье будет повторением этой пары.
</div>

### Из одного нейрона — линейный слой

<p>
  Один нейрон возвращает одно число. Для двух классов нужно два, для десяти —
  десять. Поставим нейроны рядом: вход у них общий, а веса у каждого свои.
  Столбцы весов при этом собираются в одну матрицу, и весь слой считается одним
  умножением.
</p>

<div class="stage" id="stageLinearLayer" tabindex="0" aria-label="Пошаговая схема линейного слоя из нескольких нейронов">
  <div class="stage-figure">
<svg class="viz-svg" id="mlp-linlayer-svg" viewBox="0 0 960 440" role="img" aria-label="Схема линейного слоя: входы, матрица весов, нейроны, softmax, вероятности и ошибка">
<defs><marker id="ll-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#77736A"/></marker></defs>
<text x="36" y="40" class="v-title">Из одного нейрона — линейный слой</text>
<text x="36" y="66" class="v-small">Все нейроны видят один и тот же вход, но у каждого свой столбец весов.</text>
<g data-key="ll-inputs"><text x="70" y="106" text-anchor="middle" class="v-small">вход [1, P]</text><rect x="30" y="118" width="80" height="44" rx="8" class="box-blue"/><text x="70" y="147" text-anchor="middle" font-size="17" fill="#3576C0">x&#185;</text><rect x="30" y="188" width="80" height="44" rx="8" class="box-blue"/><text x="70" y="217" text-anchor="middle" font-size="17" fill="#3576C0">x&#178;</text><rect x="30" y="274" width="80" height="44" rx="8" class="box-blue"/><text x="70" y="303" text-anchor="middle" font-size="17" fill="#3576C0">x<tspan font-size="12">P</tspan></text><text x="70" y="252" text-anchor="middle" font-size="18" fill="#111111">&#8942;</text></g>
<g data-key="ll-fan"><path d="M 112 140 L 392 144" class="edge" stroke-width="1.1"/><path d="M 112 140 L 392 226" class="edge" stroke-width="1.1"/><path d="M 112 140 L 392 346" class="edge" stroke-width="1.1"/><path d="M 112 210 L 392 144" class="edge" stroke-width="1.1"/><path d="M 112 210 L 392 226" class="edge" stroke-width="1.1"/><path d="M 112 210 L 392 346" class="edge" stroke-width="1.1"/><path d="M 112 296 L 392 144" class="edge" stroke-width="1.1"/><path d="M 112 296 L 392 226" class="edge" stroke-width="1.1"/><path d="M 112 296 L 392 346" class="edge" stroke-width="1.1"/></g>
<g data-key="ll-w" data-only="1"><rect x="206" y="196" width="82" height="52" rx="9" class="box-yellow"/><text x="247" y="228" text-anchor="middle" font-size="19" fill="#C29E08">W</text><text x="247" y="266" text-anchor="middle" class="v-small">[P, O]</text></g>
<g data-key="ll-bias" data-only="1"><rect x="30" y="352" width="80" height="44" rx="8" class="box-red"/><text x="70" y="381" text-anchor="middle" font-size="17" fill="#C30B0A">1</text><text x="70" y="416" text-anchor="middle" class="v-small">фиктивный вход</text><path d="M 112 374 L 392 152" class="edge-red" stroke-width="1.2"/><path d="M 112 374 L 392 234" class="edge-red" stroke-width="1.2"/><path d="M 112 374 L 392 352" class="edge-red" stroke-width="1.2"/><rect x="200" y="184" width="94" height="76" rx="9" class="box-yellow"/><text x="247" y="210" text-anchor="middle" font-size="17" fill="#C30B0A">b</text><line x1="212" y1="220" x2="282" y2="220" stroke="#C29E08" stroke-width="1.2"/><text x="247" y="248" text-anchor="middle" font-size="17" fill="#C29E08">W</text><text x="247" y="278" text-anchor="middle" class="v-small">[P+1, O]</text></g>
<g data-key="ll-neurons"><text x="430" y="106" text-anchor="middle" class="v-small">O нейронов</text><circle cx="430" cy="144" r="38" class="node-yellow"/><text x="414" y="153" text-anchor="middle" font-size="22" fill="#111111">&#931;</text><circle cx="430" cy="226" r="38" class="node-yellow"/><text x="414" y="235" text-anchor="middle" font-size="22" fill="#111111">&#931;</text><circle cx="430" cy="346" r="38" class="node-yellow"/><text x="414" y="355" text-anchor="middle" font-size="22" fill="#111111">&#931;</text><text x="430" y="294" text-anchor="middle" font-size="18" fill="#111111">&#8942;</text></g>
<g data-key="ll-acts" data-only="1"><polyline points="440,160 444,159 448,156 452,150 456,143 460,136 464,132 470,130" fill="none" stroke="#C30B0A" stroke-width="2"/><polyline points="440,242 444,241 448,238 452,232 456,225 460,218 464,214 470,212" fill="none" stroke="#C30B0A" stroke-width="2"/><polyline points="440,362 444,361 448,358 452,352 456,345 460,338 464,334 470,332" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="ll-outs"><text x="558" y="106" text-anchor="middle" class="v-small">выход слоя [1, O]</text><path d="M 476 144 L 514 144" class="edge" marker-end="url(#ll-arw)"/><rect x="522" y="122" width="74" height="44" rx="8" class="box"/><text x="559" y="151" text-anchor="middle" font-size="17" fill="#111111">z&#185;</text><path d="M 476 226 L 514 226" class="edge" marker-end="url(#ll-arw)"/><rect x="522" y="204" width="74" height="44" rx="8" class="box"/><text x="559" y="233" text-anchor="middle" font-size="17" fill="#111111">z&#178;</text><path d="M 476 346 L 514 346" class="edge" marker-end="url(#ll-arw)"/><rect x="522" y="324" width="74" height="44" rx="8" class="box"/><text x="559" y="353" text-anchor="middle" font-size="17" fill="#111111">z<tspan font-size="12">O</tspan></text><text x="559" y="294" text-anchor="middle" font-size="18" fill="#111111">&#8942;</text></g>
<g data-key="ll-softmax" data-only="1"><path d="M 598 144 L 642 208" class="edge"/><path d="M 598 226 L 642 230" class="edge"/><path d="M 598 346 L 642 252" class="edge"/><rect x="646" y="118" width="58" height="250" rx="11" class="box-green"/><text x="675" y="243" text-anchor="middle" font-size="16" fill="#5a8c1c" transform="rotate(-90 675 243)">softmax</text></g>
<g data-key="ll-probs" data-only="1"><text x="782" y="106" text-anchor="middle" class="v-small">вероятности &#375;</text><path d="M 704 208 L 742 144" class="edge" marker-end="url(#ll-arw)"/><rect x="746" y="122" width="74" height="44" rx="8" class="box-green"/><path d="M 704 230 L 742 226" class="edge" marker-end="url(#ll-arw)"/><rect x="746" y="204" width="74" height="44" rx="8" class="box-green"/><path d="M 704 252 L 742 346" class="edge" marker-end="url(#ll-arw)"/><rect x="746" y="324" width="74" height="44" rx="8" class="box-green"/><text x="783" y="151" text-anchor="middle" font-size="16" fill="#5a8c1c">&#375;&#8321;</text><text x="783" y="233" text-anchor="middle" font-size="16" fill="#5a8c1c">&#375;&#8322;</text><text x="783" y="353" text-anchor="middle" font-size="16" fill="#5a8c1c">&#375;<tspan font-size="12">O</tspan></text><text x="783" y="294" text-anchor="middle" font-size="18" fill="#111111">&#8942;</text></g>
<g data-key="ll-loss" data-only="1"><rect x="846" y="112" width="80" height="44" rx="8" class="box-blue"/><text x="886" y="141" text-anchor="middle" font-size="17" fill="#3576C0">y</text><text x="886" y="102" text-anchor="middle" class="v-small">верный ответ</text><path d="M 886 158 L 886 196" class="edge" marker-end="url(#ll-arw)"/><path d="M 822 144 L 858 210" class="edge"/><path d="M 822 226 L 856 226" class="edge"/><path d="M 822 346 L 858 246" class="edge"/><circle cx="886" cy="228" r="32" class="node-red"/><text x="886" y="236" text-anchor="middle" font-size="19" fill="#C30B0A">&#8466;</text><text x="886" y="288" text-anchor="middle" class="v-small">ошибка [1]</text></g>
</svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ll-inputs ll-fan ll-neurons" data-focus="ll-neurons"><div class="step-kicker">Шаг 1 &#183; нейроны рядом</div><h4>Один нейрон даёт одно число — поставим их рядом</h4><div class="math-display" data-tex="z^o=\sum_{p=1}^{P}\omega^o_p\,x^p+b^o,\qquad o=1,\ldots,O"></div><p>Для трёх классов нужно три числа, для десяти — десять. Каждый нейрон видит все входы, но считает свою сумму со своим набором весов.</p></div>
    <div class="step-panel" data-on="ll-inputs ll-fan ll-neurons ll-w" data-focus="ll-w"><div class="step-kicker">Шаг 2 &#183; матрица весов</div><h4>Наборы весов складываются в одну матрицу</h4><div class="math-display" data-tex="\mathbf z=\mathbf x\mathbf W+\mathbf b,\qquad [1,P]\cdot[P,O]\to[1,O]"></div><p>Столбец <span class="math-inline" data-tex="\mathbf W_{:,o}"></span> — это веса o-го нейрона, строка <span class="math-inline" data-tex="\mathbf W_{p,:}"></span> — все связи p-го признака. Так и выглядит полносвязный слой: каждый вход соединён с каждым выходом.</p></div>
    <div class="step-panel" data-on="ll-inputs ll-fan ll-neurons ll-bias" data-focus="ll-bias"><div class="step-kicker">Шаг 3 &#183; сдвиг</div><h4>Смещение можно сделать ещё одним входом</h4><div class="math-display" data-tex="\tilde{\mathbf x}=[\,\mathbf x,\;1\,],\qquad \mathbf z=\tilde{\mathbf x}\tilde{\mathbf W}"></div><p>Приписываем к объекту постоянную единицу, а к матрице — строку смещений. Формула становится одним умножением без слагаемого. В коде этой статьи мы храним b отдельно, но знать этот приём полезно: в учебниках он встречается постоянно.</p></div>
    <div class="step-panel" data-on="ll-inputs ll-fan ll-neurons ll-w ll-acts ll-outs" data-focus="ll-outs"><div class="step-kicker">Шаг 4 &#183; выход слоя</div><h4>Слой возвращает строку из O чисел</h4><div class="math-display" data-tex="\mathbf z\in\mathbb R^{1\times O}"></div><p>После каждого сумматора стоит своя активация. Пока это ещё не вероятности: числа не связаны между собой и не обязаны давать в сумме единицу.</p></div>
    <div class="step-panel" data-on="ll-inputs ll-neurons ll-w ll-acts ll-outs ll-softmax ll-probs" data-focus="ll-probs"><div class="step-kicker">Шаг 5 &#183; softmax</div><h4>Softmax связывает выходы между собой</h4><div class="math-display" data-tex="\hat y_o=\frac{e^{z^o}}{\sum_k e^{z^k}},\qquad \sum_o\hat y_o=1"></div><p>Поднять один выход можно только за счёт остальных — именно поэтому вероятность одного класса зависит от всех логитов сразу.</p></div>
    <div class="step-panel" data-on="ll-inputs ll-neurons ll-w ll-acts ll-outs ll-softmax ll-probs ll-loss" data-focus="ll-loss"><div class="step-kicker">Шаг 6 &#183; ошибка</div><h4>Метка показывает, какую вероятность проверять</h4><div class="math-display" data-tex="\mathcal L=-\sum_o y_o\log\hat y_o=-\log\hat y_{\text{true}}"></div><p>Слой, softmax и loss — три блока, из которых дальше собирается вся сеть. Полносвязная сеть просто ставит несколько таких слоёв подряд.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">&#8592; Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее &#8594;</button></div>
</div>
<p class="stage-hint">Цель интерактива: увидеть, откуда берётся матрица W и почему слой называется полносвязным.</p>

<div class="callout">
  <strong>Главная мысль:</strong> полносвязный слой — это <em>O</em> нейронов из
  предыдущей сцены, чьи веса записаны столбцами одной матрицы. Дальше мы
  ставим несколько таких слоёв друг за другом.
</div>


### Вся сеть как нейроны и связи

<p>
  Теперь поставим три таких слоя подряд. Каждый круг — отдельное число, каждая
  линия — путь, по которому это число участвует в вычислении следующего слоя.
  Нажимайте «Далее» и следите, как два входа превращаются в два выхода.
</p>

<div class="stage" id="stageMlpNeurons" tabindex="0" aria-label="Пошаговая схема полносвязной сети в виде отдельных нейронов и связей">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-neuron-svg" viewBox="0 0 960 430" role="img" aria-label="Два входных нейрона, два скрытых слоя, два выходных логита, softmax и loss">
      <defs><marker id="mlp-neuron-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
      <text x="36" y="40" class="v-title">Из отдельных нейронов собирается полносвязная сеть</text>
      <text x="36" y="66" class="v-small">Каждый нейрон следующего слоя получает значения всех нейронов предыдущего слоя.</text>

      <g data-key="neuron-input">
        <text x="76" y="103" text-anchor="middle" class="v-label">Вход</text>
        <circle cx="76" cy="168" r="34" class="node-blue"/><text x="76" y="174" text-anchor="middle" class="v-label">x₁</text>
        <circle cx="76" cy="278" r="34" class="node-blue"/><text x="76" y="284" text-anchor="middle" class="v-label">x₂</text>
        <text x="76" y="334" text-anchor="middle" class="v-small">признаки</text>
      </g>

      <g data-key="neuron-w1">
        <path d="M110 168 L216 168" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M108 181 L218 265" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M108 265 L218 181" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M110 278 L216 278" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <text x="164" y="356" text-anchor="middle" class="parameter-label">W⁽¹⁾, b⁽¹⁾</text>
      </g>
      <g data-key="neuron-h1">
        <text x="252" y="103" text-anchor="middle" class="v-label">Скрытый слой 1</text>
        <circle cx="252" cy="168" r="34" class="node-yellow"/><text x="252" y="174" text-anchor="middle" class="v-label">a₁⁽¹⁾</text>
        <circle cx="252" cy="278" r="34" class="node-yellow"/><text x="252" y="284" text-anchor="middle" class="v-label">a₂⁽¹⁾</text>
        <text x="252" y="334" text-anchor="middle" class="v-small">Linear + ReLU</text>
      </g>

      <g data-key="neuron-w2">
        <path d="M286 168 L396 168" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M284 181 L398 265" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M284 265 L398 181" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M286 278 L396 278" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <text x="342" y="356" text-anchor="middle" class="parameter-label">W⁽²⁾, b⁽²⁾</text>
      </g>
      <g data-key="neuron-h2">
        <text x="432" y="103" text-anchor="middle" class="v-label">Скрытый слой 2</text>
        <circle cx="432" cy="168" r="34" class="node-yellow"/><text x="432" y="174" text-anchor="middle" class="v-label">a₁⁽²⁾</text>
        <circle cx="432" cy="278" r="34" class="node-yellow"/><text x="432" y="284" text-anchor="middle" class="v-label">a₂⁽²⁾</text>
        <text x="432" y="334" text-anchor="middle" class="v-small">Linear + ReLU</text>
      </g>

      <g data-key="neuron-w3">
        <path d="M466 168 L576 168" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M464 181 L578 265" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M464 265 L578 181" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M466 278 L576 278" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <text x="522" y="356" text-anchor="middle" class="parameter-label">W⁽³⁾, b⁽³⁾</text>
      </g>
      <g data-key="neuron-logits">
        <text x="612" y="103" text-anchor="middle" class="v-label">Выходной слой</text>
        <circle cx="612" cy="168" r="34" class="node-yellow"/><text x="612" y="174" text-anchor="middle" class="v-label">s₁</text>
        <circle cx="612" cy="278" r="34" class="node-yellow"/><text x="612" y="284" text-anchor="middle" class="v-label">s₂</text>
        <text x="612" y="334" text-anchor="middle" class="v-small">логиты</text>
      </g>

      <g data-key="neuron-softmax">
        <path d="M646 168 L700 168" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <path d="M646 278 L700 278" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <text x="675" y="356" text-anchor="middle" class="parameter-label">softmax</text>
        <text x="755" y="103" text-anchor="middle" class="v-label">Вероятности</text>
        <rect x="706" y="139" width="104" height="58" rx="12" class="box-green"/><text x="758" y="174" text-anchor="middle" class="v-label">p₁</text>
        <rect x="706" y="249" width="104" height="58" rx="12" class="box-green"/><text x="758" y="284" text-anchor="middle" class="v-label">p₂</text>
      </g>

      <g data-key="neuron-loss">
        <path d="M810 168 L830 168 L830 223" class="edge-green"/>
        <path d="M810 278 L830 278 L830 223 L848 223" class="edge-green" marker-end="url(#mlp-neuron-arrow)"/>
        <text x="888" y="103" text-anchor="middle" class="v-label">Ошибка</text>
        <rect x="850" y="180" width="76" height="86" rx="12" class="box-red"/>
        <text x="888" y="217" text-anchor="middle" class="v-label">loss</text>
        <text x="888" y="239" text-anchor="middle" class="v-small">ℓ</text>
        <text x="888" y="334" text-anchor="middle" class="v-small">нужна метка y</text>
        <text x="842" y="201" text-anchor="middle" class="parameter-label">y</text>
      </g>

      <g data-key="neuron-chain" data-only="1">
        <rect x="46" y="374" width="868" height="42" rx="11" class="formula-bg"/>
        <text x="480" y="400" text-anchor="middle" class="v-label">x → a⁽¹⁾ → a⁽²⁾ → s → p → ℓ</text>
      </g>
    </svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="neuron-input" data-focus="neuron-input"><div class="step-kicker">Шаг 1 · вход</div><h4>Объект начинается с двух признаков</h4><div class="math-display" data-tex="\mathbf x=[x_1,x_2]\in\mathbb R^{1\times2}"></div><p>Пока это просто два числа. Сеть ещё ничего нового не построила.</p></div>
    <div class="step-panel" data-on="neuron-input neuron-w1 neuron-h1" data-focus="neuron-w1 neuron-h1"><div class="step-kicker">Шаг 2 · первый скрытый слой</div><h4>Каждый новый нейрон получает оба входа</h4><div class="math-display" data-tex="a_j^{(1)}=\operatorname{ReLU}\!\left(x_1W^{(1)}_{1j}+x_2W^{(1)}_{2j}+b_j^{(1)}\right)"></div><p>Именно множество связей со всеми входами делает слой полносвязным.</p></div>
    <div class="step-panel" data-on="neuron-h1 neuron-w2 neuron-h2" data-focus="neuron-w2 neuron-h2"><div class="step-kicker">Шаг 3 · второй скрытый слой</div><h4>Следующий слой комбинирует уже построенные признаки</h4><div class="math-display" data-tex="a_k^{(2)}=\operatorname{ReLU}\!\left(\sum_j a_j^{(1)}W^{(2)}_{jk}+b_k^{(2)}\right)"></div><p>Операция не изменилась: изменилось только то, какие значения теперь считаются входом.</p></div>
    <div class="step-panel" data-on="neuron-h2 neuron-w3 neuron-logits" data-focus="neuron-w3 neuron-logits"><div class="step-kicker">Шаг 4 · выходной слой</div><h4>Два скрытых признака превращаются в два логита</h4><div class="math-display" data-tex="s_c=\sum_k a_k^{(2)}W^{(3)}_{kc}+b_c^{(3)}"></div><p>Каждый круг <span class="math-inline" data-tex="s_c"></span> — ещё не вероятность, а свободная оценка соответствующего класса.</p></div>
    <div class="step-panel" data-on="neuron-logits neuron-softmax" data-focus="neuron-softmax"><div class="step-kicker">Шаг 5 · softmax</div><h4>Два логита становятся связанными вероятностями</h4><div class="math-display" data-tex="p_c=\frac{e^{s_c}}{e^{s_1}+e^{s_2}},\qquad p_1+p_2=1"></div><p>Softmax сравнивает выходы между собой, поэтому вероятность одного класса зависит от обоих логитов.</p></div>
    <div class="step-panel" data-on="neuron-softmax neuron-loss" data-focus="neuron-loss"><div class="step-kicker">Шаг 6 · loss</div><h4>Метка показывает, какую вероятность нужно проверить</h4><div class="math-display" data-tex="\ell=-\sum_c y_c\log p_c=-\log p_{\mathrm{true}}"></div><p>Полученное число оценивает весь путь от входов до вероятностей.</p></div>
    <div class="step-panel" data-on="neuron-input neuron-w1 neuron-h1 neuron-w2 neuron-h2 neuron-w3 neuron-logits neuron-softmax neuron-loss neuron-chain" data-focus="neuron-chain"><div class="step-kicker">Шаг 7 · вся сеть</div><h4>Большая схема состоит из повторяющегося правила</h4><div class="math-display" data-tex="\mathbf x\to\mathbf a^{(1)}\to\mathbf a^{(2)}\to\mathbf s\to\mathbf p\to\ell"></div><p>Теперь можно свернуть каждый вертикальный столбец нейронов в один блок слоя — значения и вычисления от этого не изменятся.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее →</button></div>
</div>
<p class="stage-hint">Цель интерактива: сначала увидеть отдельные нейроны и связи между ними.</p>

<div class="callout-blue">
  <strong>Переход к записи слоя:</strong> круги одного столбца выполняют одну
  матричную операцию. Поэтому дальше мы можем свернуть весь столбец в блок
  <span class="math-inline" data-tex="\mathbf Z=\mathbf X\mathbf W+\mathbf b"></span>,
  не теряя ни одного вычисления.
</div>

### Теперь та же сеть — как последовательность слоёв

<p>
  Ниже показана та же архитектура, но каждый столбец нейронов уже записан одним
  вертикальным блоком. Такая форма компактнее и удобнее, когда мы следим за
  тензорами, их размерностями и параметрами.
</p>

<div class="stage" id="stageMlpPipeline" tabindex="0" aria-label="Пошаговая схема полносвязной сети с двумя скрытыми слоями">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-pipe-svg" viewBox="0 0 960 430" role="img" aria-label="Вертикальные блоки входного, двух скрытых, выходного, softmax- и loss-слоёв">
      <defs><marker id="mlp-pipe-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
      <text x="36" y="40" class="v-title">Одна сеть, один маршрут значений</text>
      <text x="36" y="66" class="v-small">Над стрелкой — тензор, под стрелкой — его форма; W и b принадлежат следующему полносвязному слою.</text>

      <g data-key="pipe-input">
        <rect x="34" y="104" width="74" height="164" rx="10" class="box"/>
        <text x="71" y="186" text-anchor="middle" class="layer-name" transform="rotate(-90 71 186)">Input Layer</text>
      </g>
      <g data-key="pipe-w1">
        <path d="M108 186 L190 186" class="edge-green" marker-end="url(#mlp-pipe-arrow)"/>
        <text x="149" y="161" text-anchor="middle" class="tensor-name">x</text>
        <text x="149" y="215" text-anchor="middle" class="tensor-shape">[1, P]</text>
        <rect x="199" y="280" width="94" height="38" rx="9" class="box-yellow"/>
        <text x="246" y="304" text-anchor="middle" class="parameter-label">W⁽¹⁾, b⁽¹⁾</text>
      </g>
      <g data-key="pipe-h1">
        <rect x="198" y="104" width="96" height="164" rx="10" class="box-yellow"/>
        <text x="246" y="186" text-anchor="middle" class="layer-name" transform="rotate(-90 246 186)">Hidden Layer 1</text>
        <text x="246" y="258" text-anchor="middle" class="v-tiny">Linear + ReLU</text>
      </g>
      <g data-key="pipe-w2">
        <path d="M294 186 L360 186" class="edge-green" marker-end="url(#mlp-pipe-arrow)"/>
        <text x="327" y="161" text-anchor="middle" class="tensor-name">a⁽¹⁾</text>
        <text x="327" y="215" text-anchor="middle" class="tensor-shape">[1, H₁]</text>
        <rect x="369" y="280" width="94" height="38" rx="9" class="box-yellow"/>
        <text x="416" y="304" text-anchor="middle" class="parameter-label">W⁽²⁾, b⁽²⁾</text>
      </g>
      <g data-key="pipe-h2">
        <rect x="368" y="104" width="96" height="164" rx="10" class="box-yellow"/>
        <text x="416" y="186" text-anchor="middle" class="layer-name" transform="rotate(-90 416 186)">Hidden Layer 2</text>
        <text x="416" y="258" text-anchor="middle" class="v-tiny">Linear + ReLU</text>
      </g>
      <g data-key="pipe-w3">
        <path d="M464 186 L530 186" class="edge-green" marker-end="url(#mlp-pipe-arrow)"/>
        <text x="497" y="161" text-anchor="middle" class="tensor-name">a⁽²⁾</text>
        <text x="497" y="215" text-anchor="middle" class="tensor-shape">[1, H₂]</text>
        <rect x="539" y="280" width="94" height="38" rx="9" class="box-yellow"/>
        <text x="586" y="304" text-anchor="middle" class="parameter-label">W⁽³⁾, b⁽³⁾</text>
      </g>
      <g data-key="pipe-logits">
        <rect x="538" y="104" width="96" height="164" rx="10" class="box-yellow"/>
        <text x="586" y="186" text-anchor="middle" class="layer-name" transform="rotate(-90 586 186)">Output Layer</text>
        <text x="586" y="258" text-anchor="middle" class="v-tiny">Linear</text>
      </g>
      <g data-key="pipe-softmax">
        <path d="M634 186 L700 186" class="edge-green" marker-end="url(#mlp-pipe-arrow)"/>
        <text x="667" y="161" text-anchor="middle" class="tensor-name">s</text>
        <text x="667" y="215" text-anchor="middle" class="tensor-shape">[1, C]</text>
        <rect x="708" y="104" width="92" height="164" rx="10" class="box-green"/>
        <text x="754" y="186" text-anchor="middle" class="layer-name" transform="rotate(-90 754 186)">Softmax Layer</text>
      </g>
      <g data-key="pipe-loss">
        <path d="M800 186 L850 186" class="edge-green" marker-end="url(#mlp-pipe-arrow)"/>
        <text x="825" y="161" text-anchor="middle" class="tensor-name">p</text>
        <text x="825" y="215" text-anchor="middle" class="tensor-shape">[1, C]</text>
        <rect x="858" y="104" width="70" height="164" rx="10" class="box-red"/>
        <text x="893" y="186" text-anchor="middle" class="layer-name" transform="rotate(-90 893 186)">Loss Layer</text>
      </g>
      <g data-key="pipe-chain" data-only="1">
        <rect x="62" y="346" width="836" height="58" rx="12" class="formula-bg"/>
        <foreignObject x="72" y="351" width="816" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf x\to\mathbf a^{(1)}\to\mathbf a^{(2)}\to\mathbf s\to\mathbf p\to\ell"></div></foreignObject>
      </g>
    </svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="pipe-input" data-focus="pipe-input"><div class="step-kicker">Шаг 1 · вход</div><h4>Один объект — одна строка признаков</h4><div class="math-display" data-tex="\mathbf x\in\mathbb R^{1\times P}"></div><p>В нашем примере <span class="math-inline" data-tex="P=2"></span>: каждый объект описан двумя числами.</p></div>
    <div class="step-panel" data-on="pipe-input pipe-w1 pipe-h1" data-focus="pipe-w1 pipe-h1"><div class="step-kicker">Шаг 2 · первый скрытый слой</div><h4>Каждый скрытый нейрон видит оба признака</h4><div class="math-display" data-tex="\mathbf z^{(1)}=\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)},\qquad \mathbf a^{(1)}=\operatorname{ReLU}(\mathbf z^{(1)})"></div><p>Столбец <span class="math-inline" data-tex="\mathbf W^{(1)}_{:,j}"></span> содержит все веса <span class="math-inline" data-tex="j"></span>-го нейрона.</p></div>
    <div class="step-panel" data-on="pipe-h1 pipe-w2 pipe-h2" data-focus="pipe-w2 pipe-h2"><div class="step-kicker">Шаг 3 · второй скрытый слой</div><h4>Новая комбинация строится уже из скрытых признаков</h4><div class="math-display" data-tex="\mathbf z^{(2)}=\mathbf a^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)},\qquad \mathbf a^{(2)}=\operatorname{ReLU}(\mathbf z^{(2)})"></div><p>Второй слой получает не исходные <span class="math-inline" data-tex="x_1,x_2"></span>, а признаки, которые построил первый.</p></div>
    <div class="step-panel" data-on="pipe-h2 pipe-w3 pipe-logits" data-focus="pipe-w3 pipe-logits"><div class="step-kicker">Шаг 4 · выходной слой</div><h4>Последний линейный слой считает логиты классов</h4><div class="math-display" data-tex="\mathbf s=\mathbf a^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)}"></div><p>Логит — оценка класса до нормировки; он может быть любым вещественным числом.</p></div>
    <div class="step-panel" data-on="pipe-logits pipe-softmax" data-focus="pipe-softmax"><div class="step-kicker">Шаг 5 · вероятности</div><h4>Softmax связывает все выходы одной строки</h4><div class="math-display" data-tex="p_c=\frac{e^{s_c}}{\sum_k e^{s_k}},\qquad \sum_c p_c=1"></div><p>Увеличение одного логита повышает его вероятность и одновременно уменьшает доли остальных классов.</p></div>
    <div class="step-panel" data-on="pipe-softmax pipe-loss" data-focus="pipe-loss"><div class="step-kicker">Шаг 6 · ошибка</div><h4>Cross-entropy проверяет вероятность правильного класса</h4><div class="math-display" data-tex="\ell=-\sum_c y_c\log p_c"></div><p>Для one-hot метки в сумме остаётся только <span class="math-inline" data-tex="-\log p_{\text{true}}"></span>.</p></div>
    <div class="step-panel" data-on="pipe-input pipe-w1 pipe-h1 pipe-w2 pipe-h2 pipe-w3 pipe-logits pipe-softmax pipe-loss pipe-chain" data-focus="pipe-chain"><div class="step-kicker">Шаг 7 · полный forward</div><h4>Сеть — композиция простых блоков</h4><div class="math-display" data-tex="\mathbf x\xrightarrow{W^{(1)},b^{(1)}}\mathbf z^{(1)}\xrightarrow{\mathrm{ReLU}}\mathbf a^{(1)}\xrightarrow{W^{(2)},b^{(2)}}\mathbf z^{(2)}\xrightarrow{\mathrm{ReLU}}\mathbf a^{(2)}\xrightarrow{W^{(3)},b^{(3)}}\mathbf s\xrightarrow{\mathrm{softmax}}\mathbf p\xrightarrow{y}\ell"></div><p>Backward пройдёт по этой же цепочке справа налево.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее →</button></div>
</div>
<p class="stage-hint">Цель интерактива: увидеть два скрытых слоя как повтор одного и того же блока, а не как новую математику.</p>

<div class="callout">
  <strong>Главный инвариант:</strong> любой полносвязный слой считает
  <span class="math-inline" data-tex="\mathbf Z=\mathbf X\mathbf W+\mathbf b"></span>.
  Меняются только вход, параметры, размерности и функция активации после слоя.
</div>

## Часть 2. Скрытый нейрон: линейная комбинация плюс ReLU

<p>
  Первый скрытый нейрон сначала собирает признаки в число <span class="math-inline" data-tex="z"></span>,
  затем ReLU оставляет положительную часть и обнуляет отрицательную. Передвиньте
  ползунок и посмотрите, где нейрон пропускает сигнал, а где закрывает путь.
</p>

<div class="slider-card" id="stageRelu">
<div class="slider-layout">
<div class="slider-figure">
<svg class="viz-svg" id="mlp-relu-svg" viewBox="0 0 680 410" role="img" aria-label="График ReLU с управляемым значением z">
<text x="28" y="36" class="v-title">ReLU(z) = max(0, z)</text>
<line x1="60" y1="330" x2="640" y2="330" stroke="#C9C2B8" stroke-width="1.4"/>
<line x1="350" y1="62" x2="350" y2="360" stroke="#C9C2B8" stroke-width="1.4"/>
<line x1="70" y1="330" x2="350" y2="330" stroke="#73B222" stroke-width="5" stroke-linecap="round"/>
<line x1="350" y1="330" x2="625" y2="75" stroke="#73B222" stroke-width="5" stroke-linecap="round"/>
<text x="638" y="353" class="v-small">z</text><text x="360" y="72" class="v-small">a</text>
<text x="76" y="351" class="v-small">−3</text><text x="344" y="351" class="v-small">0</text><text x="615" y="351" class="v-small">3</text>
<line id="mlp-relu-guide" x1="350" y1="330" x2="350" y2="330" stroke="#3576C0" stroke-width="1.5" stroke-dasharray="5 5"/>
<circle id="mlp-relu-point" cx="350" cy="330" r="9" fill="#3576C0" stroke="#fff" stroke-width="3"/>
<rect x="72" y="80" width="210" height="72" rx="12" class="box-blue"/>
<text id="mlp-relu-state" x="177" y="111" text-anchor="middle" class="v-label">сигнал проходит</text>
<text id="mlp-relu-value-svg" x="177" y="137" text-anchor="middle" class="v-small">z = 1.20 → a = 1.20</text>
</svg>
</div>
<div class="slider-control">
<label for="mlpReluRange">Линейный выход z</label>
<input id="mlpReluRange" type="range" min="-3" max="3" step="0.05" value="1.2">
<div class="slider-value"><strong id="mlpReluValue">1.20</strong><span>выход ReLU</span></div>
<div class="equation-card"><div id="mlpReluEquation" class="math-display" data-tex="\operatorname{ReLU}(1.20)=1.20"></div></div>
<p class="tiny" id="mlpReluExplain">Положительное значение проходит дальше без изменения.</p>
</div>
</div>
</div>

<p>
  У ReLU есть простая локальная производная: справа от нуля она равна 1, слева —
  0. Поэтому в backward активный нейрон пропускает градиент, а неактивный
  возвращает ноль.
</p>

<div class="math-display" data-tex="\operatorname{ReLU}'(z)=\begin{cases}1,&z>0,\\0,&z<0.\end{cases}"></div>

<div class="callout-yellow">
  <strong>В точке z = 0</strong> классическая производная не определена. В
  практических библиотеках выбирают согласованное подградиентное значение,
  обычно 0. Для нашего числового примера ни один активный путь точно в ноль не попадает.
</div>

## Часть 3. Почему без нелинейности глубина исчезает

<p>
  Два линейных слоя подряд выглядят глубже, но вычисляют всё ту же линейную
  функцию. Нелинейность разрывает это схлопывание. Именно поэтому ReLU стоит
  <em>между</em> полносвязными слоями, а не только в самом конце.
</p>

<div class="stage" id="stageDepth" tabindex="0" aria-label="Почему несколько линейных слоёв без активации эквивалентны одному">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-depth-svg" viewBox="0 0 960 390" role="img" aria-label="Сравнение цепочки линейных слоёв с сетью, содержащей ReLU">
      <defs><marker id="mlp-depth-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
      <text x="36" y="40" class="v-title">Глубина появляется только после нелинейности</text>
      <g data-key="depth-linear">
        <rect x="62" y="78" width="82" height="118" rx="10" class="box-blue"/><text x="103" y="137" text-anchor="middle" class="layer-name" transform="rotate(-90 103 137)">Linear Layer 1</text>
        <path d="M144 137 L274 137" class="edge-green" marker-end="url(#mlp-depth-arrow)"/><text x="209" y="114" text-anchor="middle" class="tensor-name">xW¹ + b¹</text><text x="209" y="166" text-anchor="middle" class="tensor-shape">линейное значение</text>
        <rect x="282" y="78" width="82" height="118" rx="10" class="box-blue"/><text x="323" y="137" text-anchor="middle" class="layer-name" transform="rotate(-90 323 137)">Linear Layer 2</text>
      </g>
      <g data-key="depth-collapse" data-only="1">
        <path d="M364 137 L472 137" class="edge-green" marker-end="url(#mlp-depth-arrow)"/>
        <rect x="480" y="88" width="416" height="98" rx="12" class="box-green"/>
        <foreignObject x="494" y="98" width="388" height="78"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="(\mathbf xW^{(1)}+\mathbf b^{(1)})W^{(2)}+\mathbf b^{(2)}=\mathbf xW^*+\mathbf b^*"></div></foreignObject>
      </g>
      <g data-key="depth-relu" data-only="1">
        <rect x="62" y="230" width="82" height="118" rx="10" class="box-blue"/><text x="103" y="289" text-anchor="middle" class="layer-name" transform="rotate(-90 103 289)">Linear Layer 1</text>
        <path d="M144 289 L234 289" class="edge-green" marker-end="url(#mlp-depth-arrow)"/><text x="189" y="268" text-anchor="middle" class="tensor-name">z¹</text>
        <rect x="242" y="230" width="76" height="118" rx="10" class="box-yellow"/><text x="280" y="289" text-anchor="middle" class="layer-name" transform="rotate(-90 280 289)">ReLU</text>
        <path d="M318 289 L408 289" class="edge-green" marker-end="url(#mlp-depth-arrow)"/><text x="363" y="268" text-anchor="middle" class="tensor-name">a¹</text>
        <rect x="416" y="230" width="82" height="118" rx="10" class="box-blue"/><text x="457" y="289" text-anchor="middle" class="layer-name" transform="rotate(-90 457 289)">Linear Layer 2</text>
      </g>
      <g data-key="depth-result" data-only="1">
        <path d="M498 289 L650 289" class="edge-green" marker-end="url(#mlp-depth-arrow)"/><text x="574" y="268" text-anchor="middle" class="tensor-name">z²</text>
        <rect x="658" y="240" width="238" height="98" rx="12" class="box-green"/><text x="777" y="277" text-anchor="middle" class="v-label">кусочно-линейная функция</text><text x="777" y="306" text-anchor="middle" class="v-small">уже не схлопывается в один Linear</text>
      </g>
    </svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="depth-linear" data-focus="depth-linear"><div class="step-kicker">Шаг 1 · два линейных слоя</div><h4>Пока между слоями нет активации</h4><div class="math-display" data-tex="\mathbf h=(\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)})\mathbf W^{(2)}+\mathbf b^{(2)}"></div><p>Скобки создают впечатление глубины, но их можно раскрыть.</p></div>
    <div class="step-panel" data-on="depth-linear depth-collapse" data-focus="depth-collapse"><div class="step-kicker">Шаг 2 · схлопывание</div><h4>Произведения и bias объединяются</h4><div class="math-display" data-tex="\mathbf W^*=\mathbf W^{(1)}\mathbf W^{(2)},\qquad \mathbf b^*=\mathbf b^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)}"></div><p>Два линейных слоя эквивалентны одному слою с новыми параметрами <span class="math-inline" data-tex="\mathbf W^*,\mathbf b^*"></span>.</p></div>
    <div class="step-panel" data-on="depth-linear depth-relu" data-focus="depth-relu"><div class="step-kicker">Шаг 3 · вставляем ReLU</div><h4>Теперь объединить матрицы нельзя</h4><div class="math-display" data-tex="\mathbf a^{(1)}=\operatorname{ReLU}(\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)})"></div><p>ReLU по-разному пропускает координаты для разных объектов; одной общей матрицей это не заменить.</p></div>
    <div class="step-panel" data-on="depth-linear depth-relu depth-result" data-focus="depth-result"><div class="step-kicker">Шаг 4 · настоящая глубина</div><h4>Каждый следующий слой комбинирует уже построенные признаки</h4><div class="math-display" data-tex="f(\mathbf x)=\operatorname{ReLU}\!\left(\operatorname{ReLU}(\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)})\mathbf W^{(2)}+\mathbf b^{(2)}\right)\mathbf W^{(3)}+\mathbf b^{(3)}"></div><p>Это и есть механизм, который отличает многослойную сеть от одной логистической регрессии.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее →</button></div>
</div>

## Часть 4. Softmax и cross-entropy: одна строка превращается в loss

<p>
  Выходной слой возвращает логиты <span class="math-inline" data-tex="\mathbf s"></span>.
  Softmax превращает их в распределение вероятностей, а cross-entropy берёт
  отрицательный логарифм вероятности правильного класса. Для one-hot метки формула
  снова становится очень короткой.
</p>

<div class="math-display" data-tex="\mathbf p=\operatorname{softmax}(\mathbf s),\qquad \ell=-\sum_{c=1}^{C}y_c\log p_c=-\log p_{\text{true}}"></div>

<div class="slider-card" id="stageSoftmaxLoss">
<div class="slider-layout">
<div class="slider-figure">
<svg class="viz-svg" id="mlp-loss-svg" viewBox="0 0 680 410" role="img" aria-label="Вероятности двух классов и cross-entropy для правильного класса">
<text x="28" y="36" class="v-title">Cross-entropy смотрит на правильный класс</text>
<line x1="82" y1="330" x2="410" y2="330" stroke="#C9C2B8" stroke-width="1.4"/>
<rect id="mlp-loss-bar-true" x="130" y="90" width="92" height="240" rx="8" fill="#73B222"/>
<rect id="mlp-loss-bar-other" x="280" y="300" width="92" height="30" rx="8" fill="#D8D4C8"/>
<text x="176" y="356" text-anchor="middle" class="v-label">класс 1 · верный</text>
<text x="326" y="356" text-anchor="middle" class="v-label">класс 2</text>
<text id="mlp-loss-ptrue" x="176" y="78" text-anchor="middle" class="v-label">0.88</text>
<text id="mlp-loss-pother" x="326" y="288" text-anchor="middle" class="v-label">0.12</text>
<rect x="452" y="100" width="190" height="160" rx="14" class="box-red"/>
<text x="547" y="137" text-anchor="middle" class="v-label">loss</text>
<text id="mlp-loss-number" x="547" y="190" text-anchor="middle" style="fill:#C30B0A;font-size:34px;font-weight:800">0.128</text>
<text x="547" y="222" text-anchor="middle" class="v-small">−log(p правильного класса)</text>
</svg>
</div>
<div class="slider-control">
<label for="mlpLossRange">Вероятность правильного класса</label>
<input id="mlpLossRange" type="range" min="0.02" max="0.98" step="0.01" value="0.88">
<div class="slider-value"><strong id="mlpLossValue">0.128</strong><span>cross-entropy</span></div>
<div class="equation-card"><div id="mlpLossEquation" class="math-display" data-tex="\ell=-\log(0.88)=0.128"></div></div>
<p class="tiny" id="mlpLossExplain">Модель уверена в верном классе, поэтому штраф мал.</p>
</div>
</div>
</div>

<p>
  Здесь важна связь с логистической регрессией: в бинарном случае формула BCE
  учитывала вероятность нужной метки, а здесь softmax cross-entropy делает то же
  для одного из нескольких классов. Отличается выходной блок, но учебная логика
  остаётся прежней.
</p>

<div class="callout-red">
  <strong>Не применяйте softmax по всему батчу.</strong> Нормировка всегда идёт по
  классам внутри одной строки. Объекты батча не должны делить вероятность друг с другом.
</div>

## Часть 5. Полный forward: сначала формулы, затем те же шаги с числами

<p>
  Теперь соберём все блоки без скрытых переходов. Сначала посмотрим только на
  формулы и размерности. После этого повторим тот же порядок с конкретными
  матрицами. Такой разрыв важен: буквенная запись показывает общий алгоритм, а
  числовая — что именно происходит внутри каждого умножения.
</p>

<div class="stage" id="stageForwardFormula" tabindex="0" aria-label="Полный forward многослойной сети в формулах">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-ff-svg" viewBox="0 0 960 420" role="img" aria-label="Формульный forward через два скрытых слоя, softmax и cross-entropy">
      <defs><marker id="mlp-ff-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
      <text x="32" y="38" class="v-title">Forward одного объекта</text>
      <text x="32" y="62" class="v-small">Формы указаны для P = H₁ = H₂ = C = 2.</text>
      <g data-key="ff-input">
        <rect x="24" y="86" width="70" height="150" rx="10" class="box-blue"/><text x="59" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 59 161)">Input Layer</text>
      </g>
      <g data-key="ff-l1">
        <path d="M94 161 L130 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><text x="112" y="139" text-anchor="middle" class="tensor-name">x</text><text x="112" y="188" text-anchor="middle" class="tensor-shape">[1,P]</text>
        <rect x="132" y="86" width="80" height="150" rx="10" class="box-yellow"/><text x="172" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 172 161)">Linear Layer 1</text><rect x="136" y="244" width="72" height="30" rx="8" class="box-yellow"/><text x="172" y="264" text-anchor="middle" class="parameter-label">W¹, b¹</text>
      </g>
      <g data-key="ff-a1">
        <path d="M212 161 L242 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><text x="227" y="139" text-anchor="middle" class="tensor-name">z¹</text><text x="227" y="188" text-anchor="middle" class="tensor-shape">[1,H₁]</text>
        <rect x="244" y="86" width="70" height="150" rx="10" class="box-green"/><text x="279" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 279 161)">ReLU 1</text>
      </g>
      <g data-key="ff-l2">
        <path d="M314 161 L354 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><text x="334" y="139" text-anchor="middle" class="tensor-name">a¹</text><text x="334" y="188" text-anchor="middle" class="tensor-shape">[1,H₁]</text>
        <rect x="356" y="86" width="80" height="150" rx="10" class="box-yellow"/><text x="396" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 396 161)">Linear Layer 2</text><rect x="360" y="244" width="72" height="30" rx="8" class="box-yellow"/><text x="396" y="264" text-anchor="middle" class="parameter-label">W², b²</text>
      </g>
      <g data-key="ff-a2">
        <path d="M436 161 L466 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><text x="451" y="139" text-anchor="middle" class="tensor-name">z²</text><text x="451" y="188" text-anchor="middle" class="tensor-shape">[1,H₂]</text>
        <rect x="468" y="86" width="70" height="150" rx="10" class="box-green"/><text x="503" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 503 161)">ReLU 2</text>
      </g>
      <g data-key="ff-out">
        <path d="M538 161 L578 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><text x="558" y="139" text-anchor="middle" class="tensor-name">a²</text><text x="558" y="188" text-anchor="middle" class="tensor-shape">[1,H₂]</text>
        <rect x="580" y="86" width="80" height="150" rx="10" class="box-yellow"/><text x="620" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 620 161)">Output Layer</text><rect x="584" y="244" width="72" height="30" rx="8" class="box-yellow"/><text x="620" y="264" text-anchor="middle" class="parameter-label">W³, b³</text>
      </g>
      <g data-key="ff-prob">
        <path d="M660 161 L690 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><text x="675" y="139" text-anchor="middle" class="tensor-name">s</text><text x="675" y="188" text-anchor="middle" class="tensor-shape">[1,C]</text>
        <rect x="692" y="86" width="82" height="150" rx="10" class="box-green"/><text x="733" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 733 161)">Softmax Layer</text>
      </g>
      <g data-key="ff-loss">
        <path d="M774 161 L804 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><text x="789" y="139" text-anchor="middle" class="tensor-name">p</text><text x="789" y="188" text-anchor="middle" class="tensor-shape">[1,C]</text>
        <rect x="806" y="86" width="128" height="150" rx="10" class="box-red"/><text x="870" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 870 161)">Cross-Entropy Loss</text>
      </g>

      <rect x="46" y="292" width="868" height="92" rx="14" class="formula-bg"/>
      <g data-key="ff-eq-input" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf x\in\mathbb R^{1\times P},\quad \mathbf W^{(1)}\in\mathbb R^{P\times H_1},\quad \mathbf b^{(1)}\in\mathbb R^{1\times H_1}"></div></foreignObject></g>
      <g data-key="ff-eq-l1" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf z^{(1)}=\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)}"></div></foreignObject></g>
      <g data-key="ff-eq-a1" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf a^{(1)}=\operatorname{ReLU}(\mathbf z^{(1)})"></div></foreignObject></g>
      <g data-key="ff-eq-l2" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf z^{(2)}=\mathbf a^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)}"></div></foreignObject></g>
      <g data-key="ff-eq-a2" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf a^{(2)}=\operatorname{ReLU}(\mathbf z^{(2)})"></div></foreignObject></g>
      <g data-key="ff-eq-out" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf s=\mathbf a^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)}"></div></foreignObject></g>
      <g data-key="ff-eq-prob" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="p_c=\frac{e^{s_c}}{\sum_{k=1}^{C}e^{s_k}},\qquad \sum_c p_c=1"></div></foreignObject></g>
      <g data-key="ff-eq-loss" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\ell(\mathbf y,\mathbf p)=-\sum_{c=1}^{C}y_c\log p_c"></div></foreignObject></g>
    </svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ff-input ff-eq-input" data-focus="ff-input ff-eq-input"><div class="step-kicker">Шаг 1 · вход и параметры</div><h4>Фиксируем формы всех объектов</h4><div class="math-display" data-tex="\mathbf x:1\times P,\quad \mathbf W^{(1)}:P\times H_1,\quad \mathbf b^{(1)}:1\times H_1"></div><p>Число столбцов входа должно совпасть с числом строк первой матрицы весов.</p></div>
    <div class="step-panel" data-on="ff-input ff-l1 ff-eq-l1" data-focus="ff-l1 ff-eq-l1"><div class="step-kicker">Шаг 2 · Linear 1</div><h4>Первый слой строит H₁ линейных комбинаций</h4><div class="math-display" data-tex="z^{(1)}_j=\sum_{i=1}^{P}x_iW^{(1)}_{ij}+b^{(1)}_j"></div><p>Один столбец <span class="math-inline" data-tex="W^{(1)}_{:,j}"></span> принадлежит одному скрытому нейрону.</p></div>
    <div class="step-panel" data-on="ff-l1 ff-a1 ff-eq-a1" data-focus="ff-a1 ff-eq-a1"><div class="step-kicker">Шаг 3 · ReLU 1</div><h4>Активация применяется покоординатно</h4><div class="math-display" data-tex="a^{(1)}_j=\max(0,z^{(1)}_j)"></div><p>Форма не меняется: <span class="math-inline" data-tex="\mathbf z^{(1)},\mathbf a^{(1)}\in\mathbb R^{1\times H_1}"></span>.</p></div>
    <div class="step-panel" data-on="ff-a1 ff-l2 ff-eq-l2" data-focus="ff-l2 ff-eq-l2"><div class="step-kicker">Шаг 4 · Linear 2</div><h4>Второй слой получает уже скрытые признаки</h4><div class="math-display" data-tex="z^{(2)}_k=\sum_{j=1}^{H_1}a^{(1)}_jW^{(2)}_{jk}+b^{(2)}_k"></div><p>Операция та же, но роль входа теперь играет <span class="math-inline" data-tex="\mathbf a^{(1)}"></span>.</p></div>
    <div class="step-panel" data-on="ff-l2 ff-a2 ff-eq-a2" data-focus="ff-a2 ff-eq-a2"><div class="step-kicker">Шаг 5 · ReLU 2</div><h4>Второй нелинейный фильтр создаёт a⁽²⁾</h4><div class="math-display" data-tex="a^{(2)}_k=\max(0,z^{(2)}_k)"></div><p>Именно эти значения поступят в классификатор.</p></div>
    <div class="step-panel" data-on="ff-a2 ff-out ff-eq-out" data-focus="ff-out ff-eq-out"><div class="step-kicker">Шаг 6 · выходной Linear</div><h4>Для каждого класса появляется свой логит</h4><div class="math-display" data-tex="s_c=\sum_{k=1}^{H_2}a^{(2)}_kW^{(3)}_{kc}+b^{(3)}_c"></div><p>Здесь <span class="math-inline" data-tex="c=1,\ldots,C"></span> — индекс класса.</p></div>
    <div class="step-panel" data-on="ff-out ff-prob ff-eq-prob" data-focus="ff-prob ff-eq-prob"><div class="step-kicker">Шаг 7 · softmax</div><h4>Логиты становятся вероятностями</h4><div class="math-display" data-tex="\mathbf p=\operatorname{softmax}(\mathbf s)"></div><p>Вычислительно устойчивый softmax вычитает <span class="math-inline" data-tex="\max_c s_c"></span> перед экспонентой; вероятность от этого не меняется.</p></div>
    <div class="step-panel" data-on="ff-input ff-l1 ff-a1 ff-l2 ff-a2 ff-out ff-prob ff-loss ff-eq-loss" data-focus="ff-loss ff-eq-loss"><div class="step-kicker">Шаг 8 · cross-entropy</div><h4>Вся сеть заканчивается одним числом ошибки</h4><div class="math-display" data-tex="\ell=-\log p_{\text{true}}"></div><p>Это число оценивает текущие параметры. Следующий раздел развернёт его обратно в градиенты.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее →</button></div>
</div>

### Подставляем числа — тем же маршрутом

<p>
  Используем объект <span class="math-inline" data-tex="\mathbf x=[2,1]"></span> и
  правильный класс 1, то есть <span class="math-inline" data-tex="\mathbf y=[1,0]"></span>.
  Все матрицы имеют размер <span class="math-inline" data-tex="2\times2"></span>,
  поэтому каждое умножение можно проверить вручную.
</p>

<div class="stage numeric-stage" id="stageForwardNumeric" tabindex="0" aria-label="Пошаговая числовая проверка forward многослойной сети">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-fn-svg" viewBox="0 0 960 430" role="img" aria-label="Числовые значения входа, двух скрытых слоёв, логитов, вероятностей и loss">
      <defs><marker id="mlp-fn-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
      <text x="32" y="38" class="v-title">Forward на числах</text>
      <text x="32" y="62" class="v-small">Значения вычисляются из одной модели и используются дальше в backward.</text>
      <g data-key="fn-input"><rect x="24" y="84" width="70" height="148" rx="10" class="box-blue"/><text x="59" y="158" text-anchor="middle" class="layer-name" transform="rotate(-90 59 158)">Input Layer</text><text x="59" y="257" text-anchor="middle" class="v-small">[2, 1]</text></g>
      <g data-key="fn-z1"><path d="M94 158 L130 158" class="edge-green" marker-end="url(#mlp-fn-arrow)"/><text x="112" y="136" text-anchor="middle" class="tensor-name">x</text><rect x="132" y="84" width="80" height="148" rx="10" class="box-yellow"/><text x="172" y="158" text-anchor="middle" class="layer-name" transform="rotate(-90 172 158)">Linear Layer 1</text><text x="172" y="257" text-anchor="middle" class="v-small" data-mlp-text="oneZ1">[2.10, −0.20]</text></g>
      <g data-key="fn-a1"><path d="M212 158 L242 158" class="edge-green" marker-end="url(#mlp-fn-arrow)"/><text x="227" y="136" text-anchor="middle" class="tensor-name">z¹</text><rect x="244" y="84" width="70" height="148" rx="10" class="box-green"/><text x="279" y="158" text-anchor="middle" class="layer-name" transform="rotate(-90 279 158)">ReLU 1</text><text x="279" y="257" text-anchor="middle" class="v-small" data-mlp-text="oneA1">[2.10, 0]</text></g>
      <g data-key="fn-z2"><path d="M314 158 L354 158" class="edge-green" marker-end="url(#mlp-fn-arrow)"/><text x="334" y="136" text-anchor="middle" class="tensor-name">a¹</text><rect x="356" y="84" width="80" height="148" rx="10" class="box-yellow"/><text x="396" y="158" text-anchor="middle" class="layer-name" transform="rotate(-90 396 158)">Linear Layer 2</text><text x="396" y="257" text-anchor="middle" class="v-small" data-mlp-text="oneZ2">[1.16, −0.85]</text></g>
      <g data-key="fn-a2"><path d="M436 158 L466 158" class="edge-green" marker-end="url(#mlp-fn-arrow)"/><text x="451" y="136" text-anchor="middle" class="tensor-name">z²</text><rect x="468" y="84" width="70" height="148" rx="10" class="box-green"/><text x="503" y="158" text-anchor="middle" class="layer-name" transform="rotate(-90 503 158)">ReLU 2</text><text x="503" y="257" text-anchor="middle" class="v-small" data-mlp-text="oneA2">[1.16, 0]</text></g>
      <g data-key="fn-s"><path d="M538 158 L578 158" class="edge-green" marker-end="url(#mlp-fn-arrow)"/><text x="558" y="136" text-anchor="middle" class="tensor-name">a²</text><rect x="580" y="84" width="80" height="148" rx="10" class="box-yellow"/><text x="620" y="158" text-anchor="middle" class="layer-name" transform="rotate(-90 620 158)">Output Layer</text><text x="620" y="257" text-anchor="middle" class="v-small" data-mlp-text="oneS">[1.16, −0.828]</text></g>
      <g data-key="fn-p"><path d="M660 158 L690 158" class="edge-green" marker-end="url(#mlp-fn-arrow)"/><text x="675" y="136" text-anchor="middle" class="tensor-name">s</text><rect x="692" y="84" width="82" height="148" rx="10" class="box-green"/><text x="733" y="158" text-anchor="middle" class="layer-name" transform="rotate(-90 733 158)">Softmax Layer</text><text x="733" y="257" text-anchor="middle" class="v-tiny" data-mlp-text="oneP">[0.8795, 0.1205]</text></g>
      <g data-key="fn-loss"><path d="M774 158 L804 158" class="edge-green" marker-end="url(#mlp-fn-arrow)"/><text x="789" y="136" text-anchor="middle" class="tensor-name">p</text><rect x="806" y="84" width="128" height="148" rx="10" class="box-red"/><text x="870" y="158" text-anchor="middle" class="layer-name" transform="rotate(-90 870 158)">Cross-Entropy Loss</text><text x="870" y="257" text-anchor="middle" class="v-small" data-mlp-text="oneLoss">0.128366</text></g>
      <rect x="46" y="292" width="868" height="102" rx="14" class="formula-bg"/>
      <g data-key="fn-eq-input" data-only="1"><foreignObject x="60" y="300" width="840" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="forwardInputs"></div></foreignObject></g>
      <g data-key="fn-eq-z1" data-only="1"><foreignObject x="60" y="300" width="840" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="forwardZ1"></div></foreignObject></g>
      <g data-key="fn-eq-a1" data-only="1"><foreignObject x="60" y="300" width="840" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="forwardA1"></div></foreignObject></g>
      <g data-key="fn-eq-z2" data-only="1"><foreignObject x="60" y="300" width="840" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="forwardZ2"></div></foreignObject></g>
      <g data-key="fn-eq-a2" data-only="1"><foreignObject x="60" y="300" width="840" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="forwardA2"></div></foreignObject></g>
      <g data-key="fn-eq-s" data-only="1"><foreignObject x="60" y="300" width="840" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="forwardS"></div></foreignObject></g>
      <g data-key="fn-eq-p" data-only="1"><foreignObject x="60" y="300" width="840" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="forwardP"></div></foreignObject></g>
      <g data-key="fn-eq-loss" data-only="1"><foreignObject x="60" y="300" width="840" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="forwardLoss"></div></foreignObject></g>
    </svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="fn-input fn-eq-input" data-focus="fn-input fn-eq-input"><div class="step-kicker">Шаг 1 · исходные числа</div><h4>Фиксируем объект, метку и три набора параметров</h4><div class="math-display" data-mlp-tex="forwardInputs"></div><p>Во время одного forward эти числа не меняются.</p></div>
    <div class="step-panel" data-on="fn-input fn-z1 fn-eq-z1" data-focus="fn-z1 fn-eq-z1"><div class="step-kicker">Шаг 2 · Linear 1</div><h4>Считаем оба скрытых нейрона</h4><div class="math-display" data-mlp-tex="forwardZ1"></div><p>Первая координата положительна, вторая отрицательна.</p></div>
    <div class="step-panel" data-on="fn-z1 fn-a1 fn-eq-a1" data-focus="fn-a1 fn-eq-a1"><div class="step-kicker">Шаг 3 · ReLU 1</div><h4>Отрицательный путь закрывается</h4><div class="math-display" data-mlp-tex="forwardA1"></div><p>Вторая координата станет нулём и не внесёт вклад в следующий слой.</p></div>
    <div class="step-panel" data-on="fn-a1 fn-z2 fn-eq-z2" data-focus="fn-z2 fn-eq-z2"><div class="step-kicker">Шаг 4 · Linear 2</div><h4>Повторяем ту же матричную операцию</h4><div class="math-display" data-mlp-tex="forwardZ2"></div><p>На входе слоя теперь <span class="math-inline" data-tex="\mathbf a^{(1)}"></span>, а не исходный объект.</p></div>
    <div class="step-panel" data-on="fn-z2 fn-a2 fn-eq-a2" data-focus="fn-a2 fn-eq-a2"><div class="step-kicker">Шаг 5 · ReLU 2</div><h4>Снова оставляем только положительные координаты</h4><div class="math-display" data-mlp-tex="forwardA2"></div><p>К выходному слою проходит вектор <span class="math-inline" data-tex="[1.16,0]"></span>.</p></div>
    <div class="step-panel" data-on="fn-a2 fn-s fn-eq-s" data-focus="fn-s fn-eq-s"><div class="step-kicker">Шаг 6 · логиты</div><h4>Выходной Linear даёт по числу на класс</h4><div class="math-display" data-mlp-tex="forwardS"></div><p>Первый логит выше второго почти на 2, поэтому softmax предпочтет класс 1.</p></div>
    <div class="step-panel" data-on="fn-s fn-p fn-eq-p" data-focus="fn-p fn-eq-p"><div class="step-kicker">Шаг 7 · softmax</div><h4>Вычитаем максимум и нормируем экспоненты</h4><div class="math-display" data-mlp-tex="forwardP"></div><p>Вероятности складываются в 1 с учётом округления.</p></div>
    <div class="step-panel" data-on="fn-input fn-z1 fn-a1 fn-z2 fn-a2 fn-s fn-p fn-loss fn-eq-loss" data-focus="fn-loss fn-eq-loss"><div class="step-kicker">Шаг 8 · loss</div><h4>Берём вероятность правильного класса</h4><div class="math-display" data-mlp-tex="forwardLoss"></div><p>Сеть дала правильному классу высокую вероятность, поэтому loss мал, но не равен нулю.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее →</button></div>
</div>
<p class="stage-hint">Числа в SVG и формулах получают значения из одного объекта JavaScript; округление выполняется только при отображении.</p>

<div class="callout">
  <strong>Forward завершён.</strong> Мы сохранили
  <span class="math-inline" data-tex="\mathbf x,\mathbf z^{(1)},\mathbf a^{(1)},\mathbf z^{(2)},\mathbf a^{(2)},\mathbf p,\mathbf y"></span>.
  Это не лишняя память: именно эти значения понадобятся локальным операциям backward.
</div>

## Часть 6. Backpropagation: один сигнал разворачивается через все слои

<p>
  Backpropagation не ищет одну гигантскую производную. Он начинает с простого
  выходного сигнала и передаёт его справа налево. Каждый блок получает градиент
  со своей правой стороны, применяет локальную производную и возвращает новый
  градиент дальше.
</p>

<div class="math-display" data-tex="\underbrace{\boldsymbol\delta^{(3)}=\mathbf p-\mathbf y}_{\text{softmax + cross-entropy}}\;\longrightarrow\;\boldsymbol\delta^{(2)}\;\longrightarrow\;\boldsymbol\delta^{(1)}"></div>

<div class="stage" id="stageBackwardFormula" tabindex="0" aria-label="Backpropagation многослойной сети в формулах">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-bf-svg" viewBox="0 0 960 440" role="img" aria-label="Красный путь градиентов через выходной и два скрытых слоя">
      <defs>
        <marker id="mlp-bf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#C30B0A"/></marker>
        <marker id="mlp-bf-forward-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker>
      </defs>
      <text x="32" y="38" class="v-title">Backward идёт по сохранённой карте справа налево</text>
      <text x="32" y="62" class="v-small">Красная стрелка переносит производную loss по текущему промежуточному значению.</text>
      <g data-key="bf-map">
        <rect x="24" y="82" width="70" height="142" rx="10" class="box-blue"/><text x="59" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 59 153)">Input Layer</text>
        <path d="M94 153 L130 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><text x="112" y="132" text-anchor="middle" class="tensor-name">x</text>
        <rect x="132" y="82" width="80" height="142" rx="10" class="box-yellow"/><text x="172" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 172 153)">Linear Layer 1</text>
        <path d="M212 153 L242 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><text x="227" y="132" text-anchor="middle" class="tensor-name">z¹</text>
        <rect x="244" y="82" width="70" height="142" rx="10" class="box-green"/><text x="279" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 279 153)">ReLU 1</text>
        <path d="M314 153 L354 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><text x="334" y="132" text-anchor="middle" class="tensor-name">a¹</text>
        <rect x="356" y="82" width="80" height="142" rx="10" class="box-yellow"/><text x="396" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 396 153)">Linear Layer 2</text>
        <path d="M436 153 L466 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><text x="451" y="132" text-anchor="middle" class="tensor-name">z²</text>
        <rect x="468" y="82" width="70" height="142" rx="10" class="box-green"/><text x="503" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 503 153)">ReLU 2</text>
        <path d="M538 153 L578 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><text x="558" y="132" text-anchor="middle" class="tensor-name">a²</text>
        <rect x="580" y="82" width="80" height="142" rx="10" class="box-yellow"/><text x="620" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 620 153)">Output Layer</text>
        <path d="M660 153 L690 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><text x="675" y="132" text-anchor="middle" class="tensor-name">s</text>
        <rect x="692" y="82" width="82" height="142" rx="10" class="box-green"/><text x="733" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 733 153)">Softmax Layer</text>
        <path d="M774 153 L804 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><text x="789" y="132" text-anchor="middle" class="tensor-name">p</text>
        <rect x="806" y="82" width="128" height="142" rx="10" class="box-red"/><text x="870" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 870 153)">Cross-Entropy Loss</text>
      </g>
      <g data-key="bf-d3"><path d="M806 250 L660 250" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><text x="733" y="242" text-anchor="middle" class="v-small">δ³ = p − y</text></g>
      <g data-key="bf-w3"><path d="M660 278 L538 278" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><text x="599" y="270" text-anchor="middle" class="v-small">dW³, db³, da²</text></g>
      <g data-key="bf-relu2"><path d="M538 250 L436 250" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><text x="487" y="242" text-anchor="middle" class="v-small">ReLU′ → δ²</text></g>
      <g data-key="bf-w2"><path d="M436 306 L314 306" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><text x="375" y="298" text-anchor="middle" class="v-small">dW², db², da¹</text></g>
      <g data-key="bf-relu1"><path d="M314 278 L94 278" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><text x="204" y="270" text-anchor="middle" class="v-small">ReLU′ → δ¹ → dW¹, db¹</text></g>
      <rect x="46" y="334" width="868" height="82" rx="14" class="formula-bg"/>
      <g data-key="bf-eq-map" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\ell\to\mathbf s\to\mathbf a^{(2)}\to\mathbf z^{(2)}\to\mathbf a^{(1)}\to\mathbf z^{(1)}"></div></foreignObject></g>
      <g data-key="bf-eq-d3" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\boldsymbol\delta^{(3)}=\frac{\partial\ell}{\partial\mathbf s}=\mathbf p-\mathbf y"></div></foreignObject></g>
      <g data-key="bf-eq-w3" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\nabla_{\mathbf W^{(3)}}\ell=(\mathbf a^{(2)})^\top\boldsymbol\delta^{(3)},\quad \nabla_{\mathbf b^{(3)}}\ell=\boldsymbol\delta^{(3)},\quad \nabla_{\mathbf a^{(2)}}\ell=\boldsymbol\delta^{(3)}(\mathbf W^{(3)})^\top"></div></foreignObject></g>
      <g data-key="bf-eq-r2" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\boldsymbol\delta^{(2)}=\nabla_{\mathbf a^{(2)}}\ell\odot\mathbb 1[\mathbf z^{(2)}>0]"></div></foreignObject></g>
      <g data-key="bf-eq-w2" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\nabla_{\mathbf W^{(2)}}\ell=(\mathbf a^{(1)})^\top\boldsymbol\delta^{(2)},\quad \nabla_{\mathbf a^{(1)}}\ell=\boldsymbol\delta^{(2)}(\mathbf W^{(2)})^\top"></div></foreignObject></g>
      <g data-key="bf-eq-r1" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\boldsymbol\delta^{(1)}=\nabla_{\mathbf a^{(1)}}\ell\odot\mathbb 1[\mathbf z^{(1)}>0]"></div></foreignObject></g>
      <g data-key="bf-eq-all" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\nabla_{\mathbf W^{(l)}}\ell=(\mathbf a^{(l-1)})^\top\boldsymbol\delta^{(l)},\qquad \nabla_{\mathbf b^{(l)}}\ell=\boldsymbol\delta^{(l)}"></div></foreignObject></g>
    </svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="bf-map bf-eq-map" data-focus="bf-map bf-eq-map"><div class="step-kicker">Шаг 1 · сохранённая карта</div><h4>Backward использует значения из forward</h4><div class="math-display" data-tex="\mathbf x,\mathbf z^{(1)},\mathbf a^{(1)},\mathbf z^{(2)},\mathbf a^{(2)},\mathbf p,\mathbf y"></div><p>Каждому локальному backward нужны вход или выход соответствующего forward-блока.</p></div>
    <div class="step-panel" data-on="bf-map bf-d3 bf-eq-d3" data-focus="bf-d3 bf-eq-d3"><div class="step-kicker">Шаг 2 · выходной сигнал</div><h4>Softmax и cross-entropy сокращаются до p − y</h4><div class="math-display" data-tex="\delta^{(3)}_c=p_c-y_c"></div><p>Правильный класс получает отрицательный сигнал, ошибочные — положительный.</p></div>
    <div class="step-panel" data-on="bf-map bf-d3 bf-w3 bf-eq-w3" data-focus="bf-w3 bf-eq-w3"><div class="step-kicker">Шаг 3 · Linear 3 backward</div><h4>Считаем градиенты параметров и сигнал влево</h4><div class="math-display" data-tex="d\mathbf W^{(3)}=(\mathbf a^{(2)})^\top\boldsymbol\delta^{(3)},\quad d\mathbf b^{(3)}=\boldsymbol\delta^{(3)},\quad d\mathbf a^{(2)}=\boldsymbol\delta^{(3)}(\mathbf W^{(3)})^\top"></div><p>Один linear backward всегда возвращает эти три семейства производных.</p></div>
    <div class="step-panel" data-on="bf-map bf-w3 bf-relu2 bf-eq-r2" data-focus="bf-relu2 bf-eq-r2"><div class="step-kicker">Шаг 4 · ReLU 2 backward</div><h4>Градиент проходит только через активные координаты</h4><div class="math-display" data-tex="\boldsymbol\delta^{(2)}=d\mathbf a^{(2)}\odot\mathbb 1[\mathbf z^{(2)}>0]"></div><p>Маска берётся из <span class="math-inline" data-tex="\mathbf z^{(2)}"></span>, сохранённого на forward.</p></div>
    <div class="step-panel" data-on="bf-map bf-relu2 bf-w2 bf-eq-w2" data-focus="bf-w2 bf-eq-w2"><div class="step-kicker">Шаг 5 · Linear 2 backward</div><h4>Та же тройка формул повторяется для второго слоя</h4><div class="math-display" data-tex="d\mathbf W^{(2)}=(\mathbf a^{(1)})^\top\boldsymbol\delta^{(2)},\quad d\mathbf a^{(1)}=\boldsymbol\delta^{(2)}(\mathbf W^{(2)})^\top"></div><p>Bias получает тот же сигнал <span class="math-inline" data-tex="d\mathbf b^{(2)}=\boldsymbol\delta^{(2)}"></span>.</p></div>
    <div class="step-panel" data-on="bf-map bf-w2 bf-relu1 bf-eq-r1" data-focus="bf-relu1 bf-eq-r1"><div class="step-kicker">Шаг 6 · ReLU 1 и Linear 1</div><h4>Доходим до самых ранних параметров</h4><div class="math-display" data-tex="\boldsymbol\delta^{(1)}=d\mathbf a^{(1)}\odot\mathbb 1[\mathbf z^{(1)}>0],\qquad d\mathbf W^{(1)}=\mathbf x^\top\boldsymbol\delta^{(1)}"></div><p>Если нужно обучать более ранний модуль, можно также вернуть <span class="math-inline" data-tex="d\mathbf x=\boldsymbol\delta^{(1)}(\mathbf W^{(1)})^\top"></span>.</p></div>
    <div class="step-panel" data-on="bf-map bf-d3 bf-w3 bf-relu2 bf-w2 bf-relu1 bf-eq-all" data-focus="bf-eq-all"><div class="step-kicker">Шаг 7 · общий шаблон</div><h4>Каждый слой повторяет одно правило</h4><div class="math-display" data-tex="d\mathbf W^{(l)}=(\mathbf a^{(l-1)})^\top\boldsymbol\delta^{(l)},\qquad d\mathbf b^{(l)}=\boldsymbol\delta^{(l)}"></div><p>Для более глубокой сети добавляются повторения этого блока, а не новая логика.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее →</button></div>
</div>

### Проверяем backward на тех же числах

<p>
  Возвращаемся к объекту <span class="math-inline" data-tex="[2,1]"></span>.
  Числовой backward начнётся с вероятностей, полученных выше, и пройдёт через
  обе ReLU-маски. Важно заметить: координаты, обнулённые в forward, дают нулевые
  градиенты на соответствующих путях.
</p>

<div class="stage numeric-stage" id="stageBackwardNumeric" tabindex="0" aria-label="Пошаговая числовая проверка backpropagation многослойной сети">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-bn-svg" viewBox="0 0 960 440" role="img" aria-label="Числовые градиенты выходного и двух скрытых слоёв">
      <defs>
        <marker id="mlp-bn-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#C30B0A"/></marker>
        <marker id="mlp-bn-forward-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker>
      </defs>
      <text x="32" y="38" class="v-title">Backward на числах</text>
      <text x="32" y="62" class="v-small">Зелёные значения сохранены в forward; красные вычисляются справа налево.</text>
      <g data-key="bn-forward">
        <rect x="30" y="82" width="76" height="142" rx="10" class="box-blue"/><text x="68" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 68 153)">Input Layer</text><text x="68" y="246" text-anchor="middle" class="v-small">x = [2, 1]</text>
        <path d="M106 153 L180 153" class="edge-green" marker-end="url(#mlp-bn-forward-arrow)"/><text x="143" y="137" text-anchor="middle" class="tensor-name">forward</text>
        <rect x="184" y="82" width="96" height="142" rx="10" class="box-yellow"/><text x="232" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 232 153)">Hidden Layer 1</text><text x="232" y="246" text-anchor="middle" class="v-tiny" data-mlp-text="backA1">a⁽¹⁾ = [2.10, 0]</text><text x="232" y="263" text-anchor="middle" class="v-tiny" data-mlp-text="backZ1">z⁽¹⁾ = [2.10, −0.20]</text>
        <path d="M280 153 L344 153" class="edge-green" marker-end="url(#mlp-bn-forward-arrow)"/>
        <rect x="348" y="82" width="96" height="142" rx="10" class="box-yellow"/><text x="396" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 396 153)">Hidden Layer 2</text><text x="396" y="246" text-anchor="middle" class="v-tiny" data-mlp-text="backA2">a⁽²⁾ = [1.16, 0]</text><text x="396" y="263" text-anchor="middle" class="v-tiny" data-mlp-text="backZ2">z⁽²⁾ = [1.16, −0.85]</text>
        <path d="M444 153 L508 153" class="edge-green" marker-end="url(#mlp-bn-forward-arrow)"/>
        <rect x="512" y="82" width="96" height="142" rx="10" class="box-yellow"/><text x="560" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 560 153)">Output Layer</text><text x="560" y="246" text-anchor="middle" class="v-tiny">s = <tspan data-mlp-text="oneS">[1.16, −0.828]</tspan></text>
        <path d="M608 153 L672 153" class="edge-green" marker-end="url(#mlp-bn-forward-arrow)"/>
        <rect x="676" y="82" width="96" height="142" rx="10" class="box-green"/><text x="724" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 724 153)">Softmax Layer</text><text x="724" y="246" text-anchor="middle" class="v-tiny" data-mlp-text="backP">p = [0.8795, 0.1205]</text><text x="724" y="263" text-anchor="middle" class="v-tiny">y = [1, 0]</text>
        <path d="M772 153 L836 153" class="edge-green" marker-end="url(#mlp-bn-forward-arrow)"/>
        <rect x="840" y="82" width="88" height="142" rx="10" class="box-red"/><text x="884" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 884 153)">Loss Layer</text><text x="884" y="246" text-anchor="middle" class="v-tiny" data-mlp-text="backLoss">ℓ = 0.128366</text>
      </g>
      <g data-key="bn-d3"><path d="M840 286 L608 286" class="edge-red" marker-end="url(#mlp-bn-arrow)"/><text x="724" y="279" text-anchor="middle" class="v-small">δ³ = p − y</text></g>
      <g data-key="bn-w3"><path d="M608 312 L444 312" class="edge-red" marker-end="url(#mlp-bn-arrow)"/><text x="526" y="305" text-anchor="middle" class="v-small">dW³, db³, da²</text></g>
      <g data-key="bn-d2"><path d="M444 286 L348 286" class="edge-red" marker-end="url(#mlp-bn-arrow)"/><text x="396" y="279" text-anchor="middle" class="v-small">ReLU′ → δ²</text></g>
      <g data-key="bn-w2"><path d="M348 338 L184 338" class="edge-red" marker-end="url(#mlp-bn-arrow)"/><text x="266" y="331" text-anchor="middle" class="v-small">dW², db², da¹</text></g>
      <g data-key="bn-d1"><path d="M184 312 L106 312" class="edge-red" marker-end="url(#mlp-bn-arrow)"/><text x="145" y="305" text-anchor="middle" class="v-small">δ¹</text></g>
      <rect x="46" y="354" width="868" height="70" rx="14" class="formula-bg"/>
      <g data-key="bn-eq-start" data-only="1"><foreignObject x="56" y="359" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="backStart"></div></foreignObject></g>
      <g data-key="bn-eq-d3" data-only="1"><foreignObject x="56" y="359" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="backD3"></div></foreignObject></g>
      <g data-key="bn-eq-w3" data-only="1"><foreignObject x="56" y="359" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="backW3"></div></foreignObject></g>
      <g data-key="bn-eq-d2" data-only="1"><foreignObject x="56" y="359" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="backD2"></div></foreignObject></g>
      <g data-key="bn-eq-w2" data-only="1"><foreignObject x="56" y="359" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="backW2"></div></foreignObject></g>
      <g data-key="bn-eq-d1" data-only="1"><foreignObject x="56" y="359" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="backD1"></div></foreignObject></g>
      <g data-key="bn-eq-all" data-only="1"><foreignObject x="56" y="359" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-mlp-tex="backAll"></div></foreignObject></g>
    </svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="bn-forward bn-eq-start" data-focus="bn-forward bn-eq-start"><div class="step-kicker">Шаг 1 · значения из forward</div><h4>Берём вероятности и сохранённые активации</h4><div class="math-display" data-mlp-tex="backStart"></div><p>Ничего не пересчитываем случайно: backward относится к этому конкретному forward.</p></div>
    <div class="step-panel" data-on="bn-forward bn-d3 bn-eq-d3" data-focus="bn-d3 bn-eq-d3"><div class="step-kicker">Шаг 2 · выходной сигнал</div><h4>Вычитаем one-hot метку</h4><div class="math-display" data-mlp-tex="backD3"></div><p>Сумма координат равна нулю: повышение одного логита перераспределяет вероятность между классами.</p></div>
    <div class="step-panel" data-on="bn-forward bn-d3 bn-w3 bn-eq-w3" data-focus="bn-w3 bn-eq-w3"><div class="step-kicker">Шаг 3 · третий слой</div><h4>Считаем dW³ и возвращаем сигнал в a⁽²⁾</h4><div class="math-display" data-mlp-tex="backW3"></div><p>Вторая строка <span class="math-inline" data-tex="d\mathbf W^{(3)}"></span> нулевая, потому что <span class="math-inline" data-tex="a^{(2)}_2=0"></span>.</p></div>
    <div class="step-panel" data-on="bn-forward bn-w3 bn-d2 bn-eq-d2" data-focus="bn-d2 bn-eq-d2"><div class="step-kicker">Шаг 4 · ReLU 2</div><h4>Умножаем на маску [1, 0]</h4><div class="math-display" data-mlp-tex="backD2"></div><p>Положительная первая координата пропускает сигнал; отрицательная вторая его обнуляет.</p></div>
    <div class="step-panel" data-on="bn-forward bn-d2 bn-w2 bn-eq-w2" data-focus="bn-w2 bn-eq-w2"><div class="step-kicker">Шаг 5 · второй слой</div><h4>Получаем dW² и сигнал для первого скрытого слоя</h4><div class="math-display" data-mlp-tex="backW2"></div><p>Формула совпадает с предыдущим linear backward; меняются только сохранённый вход и матрица.</p></div>
    <div class="step-panel" data-on="bn-forward bn-w2 bn-d1 bn-eq-d1" data-focus="bn-d1 bn-eq-d1"><div class="step-kicker">Шаг 6 · первый слой</div><h4>Последняя ReLU-маска и dW¹</h4><div class="math-display" data-mlp-tex="backD1"></div><p>Вторая колонка <span class="math-inline" data-tex="d\mathbf W^{(1)}"></span> равна нулю из-за неактивного первого скрытого нейрона.</p></div>
    <div class="step-panel" data-on="bn-forward bn-d3 bn-w3 bn-d2 bn-w2 bn-d1 bn-eq-all" data-focus="bn-eq-all"><div class="step-kicker">Шаг 7 · все градиенты</div><h4>Каждый параметр получил число той же формы</h4><div class="math-display" data-mlp-tex="backAll"></div><p>Теперь backpropagation завершён. Параметры пока не изменились — это сделает оптимизатор.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее →</button></div>
</div>

<div class="callout-red">
  <strong>Backpropagation и gradient descent — не одно и то же.</strong>
  Backpropagation вычисляет <span class="math-inline" data-tex="d\mathbf W,d\mathbf b"></span>;
  gradient descent использует их, чтобы изменить параметры.
</div>

## Часть 7. Батч и gradient descent: строки меняются, модель остаётся общей

<p>
  Для одного объекта все промежуточные значения были строками. Батч просто
  складывает несколько объектов в матрицу <span class="math-inline" data-tex="\mathbf X"></span>.
  Матрицы весов не копируются: один и тот же параметр участвует в расчёте каждой
  строки, поэтому в backward получает сумму вкладов объектов.
</p>

<div class="stage" id="stageBatchFormula" tabindex="0" aria-label="Forward и backward батча многослойной сети в формулах">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-batchf-svg" viewBox="0 0 960 450" role="img" aria-label="Вертикальные блоки слоёв для forward батча и обратная линия общих градиентов">
      <defs>
        <marker id="mlp-batchf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker>
        <marker id="mlp-batchf-back-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#C30B0A"/></marker>
      </defs>
      <text x="32" y="38" class="v-title">Батч добавляет ось объектов</text>
      <text x="32" y="62" class="v-small">B строк проходят через общие W и b; softmax работает по классам внутри каждой строки.</text>
      <g data-key="batch-x"><rect x="30" y="84" width="76" height="160" rx="10" class="box"/><text x="68" y="164" text-anchor="middle" class="layer-name" transform="rotate(-90 68 164)">Input Layer</text></g>
      <g data-key="batch-a1"><path d="M106 164 L188 164" class="edge-green" marker-end="url(#mlp-batchf-arrow)"/><text x="147" y="139" text-anchor="middle" class="tensor-name">X</text><text x="147" y="193" text-anchor="middle" class="tensor-shape">[B, P]</text><rect x="196" y="84" width="96" height="160" rx="10" class="box-yellow"/><text x="244" y="164" text-anchor="middle" class="layer-name" transform="rotate(-90 244 164)">Hidden Layer 1</text><rect x="197" y="256" width="94" height="34" rx="8" class="box-yellow"/><text x="244" y="278" text-anchor="middle" class="parameter-label">W¹, b¹</text></g>
      <g data-key="batch-a2"><path d="M292 164 L358 164" class="edge-green" marker-end="url(#mlp-batchf-arrow)"/><text x="325" y="139" text-anchor="middle" class="tensor-name">A⁽¹⁾</text><text x="325" y="193" text-anchor="middle" class="tensor-shape">[B, H₁]</text><rect x="366" y="84" width="96" height="160" rx="10" class="box-yellow"/><text x="414" y="164" text-anchor="middle" class="layer-name" transform="rotate(-90 414 164)">Hidden Layer 2</text><rect x="367" y="256" width="94" height="34" rx="8" class="box-yellow"/><text x="414" y="278" text-anchor="middle" class="parameter-label">W², b²</text></g>
      <g data-key="batch-s"><path d="M462 164 L528 164" class="edge-green" marker-end="url(#mlp-batchf-arrow)"/><text x="495" y="139" text-anchor="middle" class="tensor-name">A⁽²⁾</text><text x="495" y="193" text-anchor="middle" class="tensor-shape">[B, H₂]</text><rect x="536" y="84" width="96" height="160" rx="10" class="box-yellow"/><text x="584" y="164" text-anchor="middle" class="layer-name" transform="rotate(-90 584 164)">Output Layer</text><rect x="537" y="256" width="94" height="34" rx="8" class="box-yellow"/><text x="584" y="278" text-anchor="middle" class="parameter-label">W³, b³</text></g>
      <g data-key="batch-p"><path d="M632 164 L698 164" class="edge-green" marker-end="url(#mlp-batchf-arrow)"/><text x="665" y="139" text-anchor="middle" class="tensor-name">S</text><text x="665" y="193" text-anchor="middle" class="tensor-shape">[B, C]</text><rect x="706" y="84" width="92" height="160" rx="10" class="box-green"/><text x="752" y="164" text-anchor="middle" class="layer-name" transform="rotate(-90 752 164)">Softmax Layer</text></g>
      <g data-key="batch-loss"><path d="M798 164 L852 164" class="edge-green" marker-end="url(#mlp-batchf-arrow)"/><text x="825" y="139" text-anchor="middle" class="tensor-name">P</text><text x="825" y="193" text-anchor="middle" class="tensor-shape">[B, C]</text><rect x="860" y="84" width="70" height="160" rx="10" class="box-red"/><text x="895" y="164" text-anchor="middle" class="layer-name" transform="rotate(-90 895 164)">Loss Layer</text></g>
      <g data-key="batch-grad"><path d="M860 310 L106 310" class="edge-red" marker-end="url(#mlp-batchf-back-arrow)"/><rect x="335" y="294" width="396" height="32" rx="16" class="box-red"/><text x="533" y="315" text-anchor="middle" class="v-small">общие градиенты: сумма вкладов B строк / B</text></g>
      <rect x="46" y="344" width="868" height="82" rx="14" class="formula-bg"/>
      <g data-key="batch-eq-x" data-only="1"><foreignObject x="58" y="350" width="844" height="70"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf X\in\mathbb R^{B\times P},\qquad \mathbf Y\in\mathbb R^{B\times C}"></div></foreignObject></g>
      <g data-key="batch-eq-forward" data-only="1"><foreignObject x="58" y="350" width="844" height="70"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf A^{(1)}=\operatorname{ReLU}(\mathbf X\mathbf W^{(1)}+\mathbf b^{(1)}),\quad \mathbf A^{(2)}=\operatorname{ReLU}(\mathbf A^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)})"></div></foreignObject></g>
      <g data-key="batch-eq-prob" data-only="1"><foreignObject x="58" y="350" width="844" height="70"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf S=\mathbf A^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)},\qquad \mathbf P_{n,:}=\operatorname{softmax}(\mathbf S_{n,:})"></div></foreignObject></g>
      <g data-key="batch-eq-loss" data-only="1"><foreignObject x="58" y="350" width="844" height="70"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="L=-\frac1B\sum_{n=1}^{B}\sum_{c=1}^{C}Y_{nc}\log P_{nc}"></div></foreignObject></g>
      <g data-key="batch-eq-d3" data-only="1"><foreignObject x="58" y="350" width="844" height="70"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\boldsymbol\Delta^{(3)}=\frac{\mathbf P-\mathbf Y}{B}"></div></foreignObject></g>
      <g data-key="batch-eq-grad" data-only="1"><foreignObject x="58" y="350" width="844" height="70"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="d\mathbf W^{(l)}=(\mathbf A^{(l-1)})^\top\boldsymbol\Delta^{(l)},\qquad d\mathbf b^{(l)}=\sum_{n=1}^{B}\boldsymbol\Delta^{(l)}_{n,:}"></div></foreignObject></g>
    </svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="batch-x batch-eq-x" data-focus="batch-x batch-eq-x"><div class="step-kicker">Шаг 1 · данные батча</div><h4>Каждый объект занимает одну строку</h4><div class="math-display" data-tex="\mathbf X=[\mathbf x_1;\ldots;\mathbf x_B],\qquad \mathbf Y=[\mathbf y_1;\ldots;\mathbf y_B]"></div><p>Новая ось <span class="math-inline" data-tex="B"></span> считает объекты, а не признаки или классы.</p></div>
    <div class="step-panel" data-on="batch-x batch-a1 batch-a2 batch-eq-forward" data-focus="batch-a1 batch-a2 batch-eq-forward"><div class="step-kicker">Шаг 2 · скрытые слои</div><h4>Одна матричная операция обрабатывает все строки</h4><div class="math-display" data-tex="\mathbf Z^{(1)}=\mathbf X\mathbf W^{(1)}+\mathbf b^{(1)},\qquad \mathbf Z^{(2)}=\mathbf A^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)}"></div><p>Bias автоматически добавляется к каждой строке.</p></div>
    <div class="step-panel" data-on="batch-a2 batch-s batch-p batch-eq-prob" data-focus="batch-s batch-p batch-eq-prob"><div class="step-kicker">Шаг 3 · логиты и softmax</div><h4>Softmax применяется независимо к каждой строке</h4><div class="math-display" data-tex="P_{nc}=\frac{e^{S_{nc}}}{\sum_k e^{S_{nk}}}"></div><p>Сумма по <span class="math-inline" data-tex="c"></span> равна 1 для каждого объекта <span class="math-inline" data-tex="n"></span>.</p></div>
    <div class="step-panel" data-on="batch-p batch-loss batch-eq-loss" data-focus="batch-loss batch-eq-loss"><div class="step-kicker">Шаг 4 · средний loss</div><h4>Сначала B отдельных ошибок, затем среднее</h4><div class="math-display" data-tex="L=\frac1B\sum_{n=1}^{B}\ell_n"></div><p>Если loss усреднён, множитель <span class="math-inline" data-tex="1/B"></span> должен появиться и в градиентах.</p></div>
    <div class="step-panel" data-on="batch-p batch-loss batch-grad batch-eq-d3" data-focus="batch-grad batch-eq-d3"><div class="step-kicker">Шаг 5 · выходной backward</div><h4>Каждая строка создаёт собственный остаток</h4><div class="math-display" data-tex="\Delta^{(3)}_{n,:}=\frac{\mathbf p_n-\mathbf y_n}{B}"></div><p>Строки пока не смешиваются: они лишь масштабируются из-за среднего loss.</p></div>
    <div class="step-panel" data-on="batch-x batch-a1 batch-a2 batch-s batch-p batch-loss batch-grad batch-eq-grad" data-focus="batch-grad batch-eq-grad"><div class="step-kicker">Шаг 6 · общие параметры</div><h4>Матричное произведение складывает вклады объектов</h4><div class="math-display" data-tex="dW^{(l)}_{ij}=\sum_{n=1}^{B}A^{(l-1)}_{ni}\Delta^{(l)}_{nj}"></div><p>Один вес использовался во всех строках, поэтому получает один общий градиент.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее →</button></div>
</div>

### Проверяем батч из двух объектов

<p>
  Добавим второй объект <span class="math-inline" data-tex="[0.5,2]"></span> с
  правильным классом 2. Параметры сети не меняем. Второй объект пока распознаётся
  плохо, поэтому его вклад в средний loss и градиент будет заметно больше.
</p>

<div class="stage numeric-stage" id="stageBatchNumeric" tabindex="0" aria-label="Пошаговая числовая проверка батча из двух объектов">
  <div class="stage-figure">
<svg class="viz-svg" id="mlp-batchn-svg" viewBox="0 0 960 316" role="img" aria-label="Батч из двух объектов: матрицы X и Y, forward, вероятности, дельты и градиенты">
<defs><marker id="mlp-batchn-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#C30B0A"/></marker></defs>
<rect x="24" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="95.8333" y="35" text-anchor="middle" font-size="12" fill="#5E5850">X и Y</text>
<rect x="177.667" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="249.5" y="35" text-anchor="middle" font-size="12" fill="#5E5850">два forward</text>
<rect x="331.333" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="403.167" y="35" text-anchor="middle" font-size="12" fill="#5E5850">P и loss</text>
<rect x="485" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="556.833" y="35" text-anchor="middle" font-size="12" fill="#5E5850">&#916;&#8317;&#179;&#8318;</text>
<rect x="638.667" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="710.5" y="35" text-anchor="middle" font-size="12" fill="#5E5850">dW&#8317;&#179;&#8318; и db&#8317;&#179;&#8318;</text>
<rect x="792.333" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="864.167" y="35" text-anchor="middle" font-size="12" fill="#5E5850">шесть градиентов</text>
<g data-key="mm0" data-only="1"><rect x="22" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="175.667" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="329.333" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="636.667" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="790.333" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" text-anchor="middle" font-size="13" fill="#5E5850">малиновым выделено то, что считаем руками: строка, столбец и клетка результата</text>
<g transform="translate(0,-34)">
<g data-key="e1" data-only="1"><rect x="250" y="190" width="120" height="68" fill="#3576C0" fill-opacity="0.1"/>
<line x1="310" y1="190" x2="310" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="250" y1="224" x2="370" y2="224" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 249 185 L 239 185 L 239 263 L 249 263" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 371 185 L 381 185 L 381 263 L 371 263" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<text x="280" y="212.44" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="340" y="212.44" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="280" y="246.44" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="340" y="246.44" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="310" y="176" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="310" y="285" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">X &#183; два объекта</text><text x="228" y="212" text-anchor="end" font-size="12.5" fill="#5E5850">объект 1</text><text x="228" y="246" text-anchor="end" font-size="12.5" fill="#5E5850">объект 2</text><rect x="570" y="190" width="120" height="68" fill="#3576C0" fill-opacity="0.1"/>
<line x1="630" y1="190" x2="630" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="570" y1="224" x2="690" y2="224" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 569 185 L 559 185 L 559 263 L 569 263" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 691 185 L 701 185 L 701 263 L 691 263" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<text x="600" y="212.44" text-anchor="middle" font-size="15" fill="#111111">y<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="660" y="212.44" text-anchor="middle" font-size="15" fill="#111111">y<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="600" y="246.44" text-anchor="middle" font-size="15" fill="#111111">y<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="660" y="246.44" text-anchor="middle" font-size="15" fill="#111111">y<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="630" y="176" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="630" y="285" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">Y &#183; верные классы</text><text x="480" y="310" text-anchor="middle" font-size="13" fill="#5E5850">строка&#160;n — объект&#160;n, столбец&#160;c — класс&#160;c; в каждой строке Y ровно одна единица</text></g>
<g data-key="e2" data-only="1"><rect x="60" y="175" width="108" height="64" fill="#3576C0" fill-opacity="0.1"/>
<line x1="114" y1="175" x2="114" y2="239" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="60" y1="207" x2="168" y2="207" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 59 170 L 49 170 L 49 244 L 59 244" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 169 170 L 179 170 L 179 244 L 169 244" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<text x="87" y="196.12" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="141" y="196.12" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="87" y="228.12" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="141" y="228.12" text-anchor="middle" font-size="15" fill="#111111">x<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="114" y="161" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="114" y="266" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">X</text><text x="192" y="214" text-anchor="middle" font-size="20" fill="#111111">&#215;</text><rect x="218" y="175" width="108" height="64" fill="#C29E08" fill-opacity="0.16"/>
<line x1="272" y1="175" x2="272" y2="239" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="218" y1="207" x2="326" y2="207" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 217 170 L 207 170 L 207 244 L 217 244" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 327 170 L 337 170 L 337 244 L 327 244" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="245" y="196.12" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="299" y="196.12" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="245" y="228.12" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="299" y="228.12" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="272" y="161" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="272" y="266" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W&#8317;&#185;&#8318;</text><text x="350" y="214" text-anchor="middle" font-size="20" fill="#111111">+</text><rect x="376" y="191" width="108" height="32" fill="#C29E08" fill-opacity="0.16"/>
<line x1="430" y1="191" x2="430" y2="223" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 375 186 L 365 186 L 365 228 L 375 228" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 485 186 L 495 186 L 495 228 L 485 228" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="403" y="212.12" text-anchor="middle" font-size="15" fill="#111111">b<tspan font-size="10" dy="4">1</tspan></text>
<text x="457" y="212.12" text-anchor="middle" font-size="15" fill="#111111">b<tspan font-size="10" dy="4">2</tspan></text>
<text x="430" y="177" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 &#215; 2</text>
<text x="430" y="266" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b&#8317;&#185;&#8318;</text><text x="508" y="214" text-anchor="middle" font-size="20" fill="#111111">=</text><rect x="534" y="175" width="108" height="64" fill="#73B222" fill-opacity="0.1"/>
<line x1="588" y1="175" x2="588" y2="239" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="534" y1="207" x2="642" y2="207" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 533 170 L 523 170 L 523 244 L 533 244" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 643 170 L 653 170 L 653 244 L 643 244" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="561" y="196.12" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="615" y="196.12" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="561" y="228.12" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="615" y="228.12" text-anchor="middle" font-size="15" fill="#111111">z<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="588" y="161" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="588" y="266" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">Z&#8317;&#185;&#8318;</text><text x="800" y="196" text-anchor="middle" font-size="13" fill="#5E5850">одни и те же W и b</text><text x="800" y="216" text-anchor="middle" font-size="13" fill="#5E5850">обрабатывают обе строки;</text><text x="800" y="236" text-anchor="middle" font-size="13" fill="#5E5850">строки между собой не смешиваются</text><text x="480" y="300" text-anchor="middle" font-size="13" fill="#5E5850">дальше ReLU, второй скрытый слой и выходной — те же три операции</text></g>
<g data-key="h2" data-only="1"><rect x="60" y="207" width="108" height="32" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="218" y="175" width="54" height="64" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="534" y="207" width="54" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e3" data-only="1"><rect x="190" y="178" width="128" height="72" fill="#73B222" fill-opacity="0.1"/>
<line x1="254" y1="178" x2="254" y2="250" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="190" y1="214" x2="318" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 189 173 L 179 173 L 179 255 L 189 255" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 319 173 L 329 173 L 329 255 L 319 255" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="222" y="201.76" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="286" y="201.76" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="222" y="237.76" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="286" y="237.76" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="254" y="164" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="254" y="277" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">P &#183; вероятности</text><path d="M 340 214 L 396 214" fill="none" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlp-batchn-arrow)"/><rect x="404" y="172" width="176" height="38" rx="9" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.6"/><text x="492" y="196" text-anchor="middle" font-size="14" fill="#111111">&#8467;&#8321; = &#8722;log p&#8321;,&#8321;</text><rect x="404" y="220" width="176" height="38" rx="9" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.6"/><text x="492" y="244" text-anchor="middle" font-size="14" fill="#111111">&#8467;&#8322; = &#8722;log p&#8322;,&#8322;</text><path d="M 580 214 L 636 214" fill="none" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlp-batchn-arrow)"/><rect x="644" y="180" width="170" height="70" rx="11" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.6"/><text x="729" y="209" text-anchor="middle" font-size="15" font-weight="700" fill="#111111">L</text><text x="729" y="233" text-anchor="middle" font-size="13.5" fill="#5E5850">(&#8467;&#8321; + &#8467;&#8322;) / 2</text><rect x="190" y="178" width="64" height="36" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="254" y="214" width="64" height="36" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><text x="480" y="308" text-anchor="middle" font-size="13" fill="#5E5850">из каждой строки P берётся ровно одна клетка — та, где в Y стоит единица</text></g>
<g data-key="e4" data-only="1"><rect x="110" y="180" width="116" height="68" fill="#73B222" fill-opacity="0.1"/>
<line x1="168" y1="180" x2="168" y2="248" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="110" y1="214" x2="226" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 109 175 L 99 175 L 99 253 L 109 253" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 227 175 L 237 175 L 237 253 L 227 253" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="139" y="202.44" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="197" y="202.44" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="139" y="236.44" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="197" y="236.44" text-anchor="middle" font-size="15" fill="#111111">p<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="168" y="166" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="168" y="275" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">P</text><text x="248" y="220" text-anchor="middle" font-size="20" fill="#111111">&#8722;</text><rect x="276" y="180" width="116" height="68" fill="#3576C0" fill-opacity="0.1"/>
<line x1="334" y1="180" x2="334" y2="248" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="276" y1="214" x2="392" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 275 175 L 265 175 L 265 253 L 275 253" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 393 175 L 403 175 L 403 253 L 393 253" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<text x="305" y="202.44" text-anchor="middle" font-size="15" fill="#111111">y<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="363" y="202.44" text-anchor="middle" font-size="15" fill="#111111">y<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="305" y="236.44" text-anchor="middle" font-size="15" fill="#111111">y<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="363" y="236.44" text-anchor="middle" font-size="15" fill="#111111">y<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="334" y="166" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="334" y="275" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">Y</text><text x="414" y="220" text-anchor="middle" font-size="20" fill="#111111">=</text><rect x="442" y="180" width="116" height="68" fill="#E88919" fill-opacity="0.14"/>
<line x1="500" y1="180" x2="500" y2="248" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="442" y1="214" x2="558" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 441 175 L 431 175 L 431 253 L 441 253" fill="none" stroke="#E88919" stroke-width="1.8"/>
<path d="M 559 175 L 569 175 L 569 253 L 559 253" fill="none" stroke="#E88919" stroke-width="1.8"/>
<text x="471" y="202.44" text-anchor="middle" font-size="15" fill="#111111">&#948;<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="529" y="202.44" text-anchor="middle" font-size="15" fill="#111111">&#948;<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="471" y="236.44" text-anchor="middle" font-size="15" fill="#111111">&#948;<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="529" y="236.44" text-anchor="middle" font-size="15" fill="#111111">&#948;<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="500" y="166" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="500" y="275" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">&#916;&#8317;&#179;&#8318;</text><text x="558" y="298" text-anchor="middle" font-size="12.5" fill="#5E5850">уже поделено на B = 2</text><text x="790" y="196" text-anchor="middle" font-size="13" fill="#5E5850">знак клетки говорит,</text><text x="790" y="216" text-anchor="middle" font-size="13" fill="#5E5850">какой логит опустить,</text><text x="790" y="236" text-anchor="middle" font-size="13" fill="#5E5850">а какой поднять</text><text x="480" y="326" text-anchor="middle" font-size="13" fill="#5E5850">строки пока не смешиваются: у каждого объекта свой остаток</text></g>
<g data-key="h4" data-only="1"><rect x="110" y="214" width="116" height="34" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="276" y="214" width="116" height="34" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="442" y="214" width="116" height="34" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/></g>
<g data-key="e5" data-only="1"><rect x="70" y="178" width="108" height="64" fill="#73B222" fill-opacity="0.1"/>
<line x1="124" y1="178" x2="124" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="70" y1="210" x2="178" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 69 173 L 59 173 L 59 247 L 69 247" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 179 173 L 189 173 L 189 247 L 179 247" fill="none" stroke="#73B222" stroke-width="1.8"/>
<text x="97" y="199.12" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="151" y="199.12" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="97" y="231.12" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="151" y="231.12" text-anchor="middle" font-size="15" fill="#111111">a<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="124" y="164" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="124" y="269" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">(A&#8317;&#178;&#8318;)&#7488;</text><text x="202" y="217" text-anchor="middle" font-size="20" fill="#111111">&#215;</text><rect x="228" y="178" width="108" height="64" fill="#E88919" fill-opacity="0.14"/>
<line x1="282" y1="178" x2="282" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="228" y1="210" x2="336" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 227 173 L 217 173 L 217 247 L 227 247" fill="none" stroke="#E88919" stroke-width="1.8"/>
<path d="M 337 173 L 347 173 L 347 247 L 337 247" fill="none" stroke="#E88919" stroke-width="1.8"/>
<text x="255" y="199.12" text-anchor="middle" font-size="15" fill="#111111">&#948;<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="309" y="199.12" text-anchor="middle" font-size="15" fill="#111111">&#948;<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="255" y="231.12" text-anchor="middle" font-size="15" fill="#111111">&#948;<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="309" y="231.12" text-anchor="middle" font-size="15" fill="#111111">&#948;<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="282" y="164" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="282" y="269" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">&#916;&#8317;&#179;&#8318;</text><text x="360" y="217" text-anchor="middle" font-size="20" fill="#111111">=</text><rect x="386" y="178" width="108" height="64" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="440" y1="178" x2="440" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="386" y1="210" x2="494" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 385 173 L 375 173 L 375 247 L 385 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 495 173 L 505 173 L 505 247 L 495 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="413" y="199.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="9" dy="4">1,1</tspan></text>
<text x="467" y="199.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="9" dy="4">1,2</tspan></text>
<text x="413" y="231.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="9" dy="4">2,1</tspan></text>
<text x="467" y="231.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="9" dy="4">2,2</tspan></text>
<text x="440" y="164" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="440" y="269" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">dW&#8317;&#179;&#8318;</text><rect x="640" y="194" width="108" height="32" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="694" y1="194" x2="694" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 639 189 L 629 189 L 629 231 L 639 231" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 749 189 L 759 189 L 759 231 L 749 231" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="667" y="215.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;b<tspan font-size="9" dy="4">1</tspan></text>
<text x="721" y="215.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;b<tspan font-size="9" dy="4">2</tspan></text>
<text x="694" y="180" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 &#215; 2</text>
<text x="694" y="269" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">db&#8317;&#179;&#8318;</text><text x="694" y="290" text-anchor="middle" font-size="12.5" fill="#5E5850">сумма строк &#916;&#8317;&#179;&#8318;</text><text x="480" y="324" text-anchor="middle" font-size="13" fill="#5E5850">транспонирование ставит объекты внутрь суммы: один вес получает вклад обеих строк</text></g>
<g data-key="h5" data-only="1"><rect x="70" y="178" width="108" height="32" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="228" y="178" width="54" height="64" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="386" y="178" width="54" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e6" data-only="1"><rect x="60" y="200" width="88" height="56" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="104" y1="200" x2="104" y2="256" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="60" y1="228" x2="148" y2="228" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 59 195 L 49 195 L 49 261 L 59 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 149 195 L 159 195 L 159 261 L 149 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="82" y="218.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="126" y="218.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="82" y="246.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="126" y="246.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="104" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="104" y="283" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">dW&#8317;&#185;&#8318;</text><rect x="210" y="214" width="88" height="28" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="254" y1="214" x2="254" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 209 209 L 199 209 L 199 247 L 209 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 299 209 L 309 209 L 309 247 L 299 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="232" y="232.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;b<tspan font-size="8" dy="4">1</tspan></text>
<text x="276" y="232.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;b<tspan font-size="8" dy="4">2</tspan></text>
<text x="254" y="200" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 &#215; 2</text>
<text x="254" y="283" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">db&#8317;&#185;&#8318;</text><rect x="360" y="200" width="88" height="56" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="404" y1="200" x2="404" y2="256" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="360" y1="228" x2="448" y2="228" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 359 195 L 349 195 L 349 261 L 359 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 449 195 L 459 195 L 459 261 L 449 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="382" y="218.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="426" y="218.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="382" y="246.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="426" y="246.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="404" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="404" y="283" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">dW&#8317;&#178;&#8318;</text><rect x="510" y="214" width="88" height="28" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="554" y1="214" x2="554" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 509 209 L 499 209 L 499 247 L 509 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 599 209 L 609 209 L 609 247 L 599 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="532" y="232.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;b<tspan font-size="8" dy="4">1</tspan></text>
<text x="576" y="232.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;b<tspan font-size="8" dy="4">2</tspan></text>
<text x="554" y="200" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 &#215; 2</text>
<text x="554" y="283" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">db&#8317;&#178;&#8318;</text><rect x="660" y="200" width="88" height="56" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="704" y1="200" x2="704" y2="256" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="660" y1="228" x2="748" y2="228" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 659 195 L 649 195 L 649 261 L 659 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 749 195 L 759 195 L 759 261 L 749 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="682" y="218.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="726" y="218.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="682" y="246.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="726" y="246.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="704" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="704" y="283" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">dW&#8317;&#179;&#8318;</text><rect x="810" y="214" width="88" height="28" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="854" y1="214" x2="854" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 809 209 L 799 209 L 799 247 L 809 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 899 209 L 909 209 L 909 247 L 899 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="832" y="232.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;b<tspan font-size="8" dy="4">1</tspan></text>
<text x="876" y="232.48" text-anchor="middle" font-size="12" fill="#111111">&#8706;b<tspan font-size="8" dy="4">2</tspan></text>
<text x="854" y="200" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 &#215; 2</text>
<text x="854" y="283" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">db&#8317;&#179;&#8318;</text><text x="480" y="320" text-anchor="middle" font-size="13" fill="#5E5850">эти шесть матриц — весь результат backward; их получает оптимизатор</text></g>
</g>
</svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="mm0 e1" data-focus="e1"><div class="step-kicker">Шаг 1 &#183; что дано</div><h4>Батч — это матрица 2 &#215; 2: строка на объект</h4><div class="math-display" data-mlp-tex="batchData"></div><p>Второй объект — <span class="math-inline" data-tex="[0.5,\,2]"></span> с верным классом 2. Параметры сети те же, что и в разделе про один объект: меняется только число строк на входе.</p></div>
    <div class="step-panel" data-on="mm1 e2 h2" data-focus="h2"><div class="step-kicker">Шаг 2 &#183; одна клетка результата</div><h4>z&#8317;&#185;&#8318;&#8322;,&#8321; — сумма двух произведений плюс смещение</h4><div class="math-display" data-mlp-tex="batchCellForm"></div><div class="math-display" data-mlp-tex="batchCellNum"></div><p>Подсвечены строка 2 матрицы X, столбец 1 матрицы W&#8317;&#185;&#8318; и клетка, которая из них получается. Правило одно на все четыре клетки Z&#8317;&#185;&#8318;.</p></div>
    <div class="step-panel" data-on="mm2 e3" data-focus="e3"><div class="step-kicker">Шаг 3 &#183; вероятности и средний loss</div><h4>Каждая строка получает свою вероятность и свой штраф</h4><div class="math-display" data-mlp-tex="batchForward"></div><div class="math-display" data-mlp-tex="batchLoss"></div><p>Первый объект распознан уверенно, второй — уверенно неверно, поэтому в среднем loss почти всё приходит от второй строки.</p></div>
    <div class="step-panel" data-on="mm3 e4 h4" data-focus="h4"><div class="step-kicker">Шаг 4 &#183; &#916;&#8317;&#179;&#8318;</div><h4>Вычитаем метки и сразу делим на B = 2</h4><div class="math-display" data-mlp-tex="batchD3"></div><p>Деление на размер батча появляется здесь ровно потому, что loss усреднён. Если бы мы складывали ошибки без деления, множитель 1/B пропал бы и из градиентов.</p></div>
    <div class="step-panel" data-on="mm4 e5 h5" data-focus="h5"><div class="step-kicker">Шаг 5 &#183; выходной слой</div><h4>(A&#8317;&#178;&#8318;)&#7488; складывает вклады обоих объектов</h4><div class="math-display" data-mlp-tex="batchDW3cell"></div><div class="math-display" data-mlp-tex="batchW3"></div><p>Форма результата совпадает с формой W&#8317;&#179;&#8318;. Смещение получает сумму строк &#916;&#8317;&#179;&#8318;: b участвовал в обеих строках одинаково.</p></div>
    <div class="step-panel" data-on="mm5 e6" data-focus="e6"><div class="step-kicker">Шаг 6 &#183; все слои</div><h4>Дальше повторяется маска ReLU и тот же linear backward</h4><div class="math-display" data-mlp-tex="batchAll"></div><p>Ни одна формула не изменилась по сравнению с одним объектом — добавилась только ось строк, по которой идёт суммирование.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">&#8592; Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее &#8594;</button></div>
</div>
<p class="stage-hint">Цель интерактива: увидеть, что от батча меняется только число строк, а формулы остаются прежними.</p>

### Один шаг gradient descent

<p>
  Оптимизатор не меняет данные, активации, softmax или loss. Он обновляет только
  обучаемые параметры. Для каждого слоя действует одно и то же правило.
</p>

<div class="stage" id="stageUpdateFormula" tabindex="0" aria-label="Формулы одного шага gradient descent для многослойной сети">
  <div class="stage-figure">
<svg class="viz-svg" id="mlp-uf-svg" viewBox="0 0 960 442" role="img" aria-label="Шаг спуска: параметры, градиенты той же формы и обновлённые параметры">
<defs><marker id="mlp-uf-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#C30B0A"/></marker><marker id="mlp-uf-arrow2" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#C29E08"/></marker></defs>
<rect x="24" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="111.2" y="35" text-anchor="middle" font-size="12" fill="#5E5850">&#952; — что меняем</text>
<rect x="208.4" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="295.6" y="35" text-anchor="middle" font-size="12" fill="#5E5850">&#8711;&#952;L — куда</text>
<rect x="392.8" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="480" y="35" text-anchor="middle" font-size="12" fill="#5E5850">правило клетки</text>
<rect x="577.2" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="664.4" y="35" text-anchor="middle" font-size="12" fill="#5E5850">&#952;&#8242; — новое состояние</text>
<rect x="761.6" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="848.8" y="35" text-anchor="middle" font-size="12" fill="#5E5850">новый forward</text>
<g data-key="mm0" data-only="1"><rect x="22" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="206.4" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="390.8" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="575.2" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="759.6" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" text-anchor="middle" font-size="13" fill="#5E5850">форма градиента всегда совпадает с формой параметра — поэтому вычитание поклеточное</text>
<g data-key="uf-theta" data-only="1"><text x="20" y="112" font-size="12.5" fill="#5E5850">&#952; — обучаемые числа</text><rect x="40" y="120" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="78" y1="120" x2="78" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="40" y1="146" x2="116" y2="146" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 39 115 L 29 115 L 29 177 L 39 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 117 115 L 127 115 L 127 177 L 117 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="59" y="137.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="97" y="137.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="59" y="163.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="97" y="163.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="78" y="197" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W&#8317;&#185;&#8318;</text><rect x="150" y="133" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="188" y1="133" x2="188" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 149 128 L 139 128 L 139 164 L 149 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 227 128 L 237 128 L 237 164 L 227 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="169" y="150.16" text-anchor="middle" font-size="11" fill="#111111">b<tspan font-size="8" dy="4">1</tspan></text>
<text x="207" y="150.16" text-anchor="middle" font-size="11" fill="#111111">b<tspan font-size="8" dy="4">2</tspan></text>
<text x="188" y="197" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b&#8317;&#185;&#8318;</text><rect x="260" y="120" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="298" y1="120" x2="298" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="260" y1="146" x2="336" y2="146" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 259 115 L 249 115 L 249 177 L 259 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 337 115 L 347 115 L 347 177 L 337 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="279" y="137.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="317" y="137.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="279" y="163.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="317" y="163.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="298" y="197" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W&#8317;&#178;&#8318;</text><rect x="370" y="133" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="408" y1="133" x2="408" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 369 128 L 359 128 L 359 164 L 369 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 447 128 L 457 128 L 457 164 L 447 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="389" y="150.16" text-anchor="middle" font-size="11" fill="#111111">b<tspan font-size="8" dy="4">1</tspan></text>
<text x="427" y="150.16" text-anchor="middle" font-size="11" fill="#111111">b<tspan font-size="8" dy="4">2</tspan></text>
<text x="408" y="197" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b&#8317;&#178;&#8318;</text><rect x="480" y="120" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="518" y1="120" x2="518" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="480" y1="146" x2="556" y2="146" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 479 115 L 469 115 L 469 177 L 479 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 557 115 L 567 115 L 567 177 L 557 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="499" y="137.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="537" y="137.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="499" y="163.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="537" y="163.16" text-anchor="middle" font-size="11" fill="#111111">w<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="518" y="197" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W&#8317;&#179;&#8318;</text><rect x="590" y="133" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="628" y1="133" x2="628" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 589 128 L 579 128 L 579 164 L 589 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 667 128 L 677 128 L 677 164 L 667 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="609" y="150.16" text-anchor="middle" font-size="11" fill="#111111">b<tspan font-size="8" dy="4">1</tspan></text>
<text x="647" y="150.16" text-anchor="middle" font-size="11" fill="#111111">b<tspan font-size="8" dy="4">2</tspan></text>
<text x="628" y="197" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b&#8317;&#179;&#8318;</text></g>
<g data-key="uf-grad" data-only="1"><text x="20" y="224" font-size="12.5" fill="#5E5850">&#8711;&#952;L — из backward</text><rect x="40" y="232" width="76" height="52" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="78" y1="232" x2="78" y2="284" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="40" y1="258" x2="116" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 39 227 L 29 227 L 29 289 L 39 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 117 227 L 127 227 L 127 289 L 117 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="59" y="249.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="97" y="249.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="59" y="275.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="97" y="275.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="78" y="309" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">dW&#8317;&#185;&#8318;</text><rect x="150" y="245" width="76" height="26" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="188" y1="245" x2="188" y2="271" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 149 240 L 139 240 L 139 276 L 149 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 227 240 L 237 240 L 237 276 L 227 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="169" y="262.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;b<tspan font-size="8" dy="4">1</tspan></text>
<text x="207" y="262.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;b<tspan font-size="8" dy="4">2</tspan></text>
<text x="188" y="309" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">db&#8317;&#185;&#8318;</text><rect x="260" y="232" width="76" height="52" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="298" y1="232" x2="298" y2="284" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="260" y1="258" x2="336" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 259 227 L 249 227 L 249 289 L 259 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 337 227 L 347 227 L 347 289 L 337 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="279" y="249.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="317" y="249.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="279" y="275.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="317" y="275.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="298" y="309" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">dW&#8317;&#178;&#8318;</text><rect x="370" y="245" width="76" height="26" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="408" y1="245" x2="408" y2="271" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 369 240 L 359 240 L 359 276 L 369 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 447 240 L 457 240 L 457 276 L 447 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="389" y="262.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;b<tspan font-size="8" dy="4">1</tspan></text>
<text x="427" y="262.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;b<tspan font-size="8" dy="4">2</tspan></text>
<text x="408" y="309" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">db&#8317;&#178;&#8318;</text><rect x="480" y="232" width="76" height="52" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="518" y1="232" x2="518" y2="284" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="480" y1="258" x2="556" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 479 227 L 469 227 L 469 289 L 479 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 557 227 L 567 227 L 567 289 L 557 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="499" y="249.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="537" y="249.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="499" y="275.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="537" y="275.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;w<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="518" y="309" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">dW&#8317;&#179;&#8318;</text><rect x="590" y="245" width="76" height="26" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="628" y1="245" x2="628" y2="271" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 589 240 L 579 240 L 579 276 L 589 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 667 240 L 677 240 L 677 276 L 667 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="609" y="262.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;b<tspan font-size="8" dy="4">1</tspan></text>
<text x="647" y="262.16" text-anchor="middle" font-size="11" fill="#111111">&#8706;b<tspan font-size="8" dy="4">2</tspan></text>
<text x="628" y="309" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">db&#8317;&#179;&#8318;</text></g>
<g data-key="uf-new" data-only="1"><text x="20" y="336" font-size="12.5" fill="#5E5850">&#952;&#8242; — после шага</text><rect x="40" y="344" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="78" y1="344" x2="78" y2="396" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="40" y1="370" x2="116" y2="370" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 39 339 L 29 339 L 29 401 L 39 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 117 339 L 127 339 L 127 401 L 117 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="59" y="361.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="97" y="361.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="59" y="387.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="97" y="387.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="78" y="421" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W&#8317;&#185;&#8318;&#8242;</text><rect x="150" y="357" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="188" y1="357" x2="188" y2="383" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 149 352 L 139 352 L 139 388 L 149 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 227 352 L 237 352 L 237 388 L 227 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="169" y="374.16" text-anchor="middle" font-size="11" fill="#111111">b&#8242;<tspan font-size="8" dy="4">1</tspan></text>
<text x="207" y="374.16" text-anchor="middle" font-size="11" fill="#111111">b&#8242;<tspan font-size="8" dy="4">2</tspan></text>
<text x="188" y="421" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b&#8317;&#185;&#8318;&#8242;</text><rect x="260" y="344" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="298" y1="344" x2="298" y2="396" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="260" y1="370" x2="336" y2="370" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 259 339 L 249 339 L 249 401 L 259 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 337 339 L 347 339 L 347 401 L 337 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="279" y="361.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="317" y="361.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="279" y="387.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="317" y="387.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="298" y="421" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W&#8317;&#178;&#8318;&#8242;</text><rect x="370" y="357" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="408" y1="357" x2="408" y2="383" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 369 352 L 359 352 L 359 388 L 369 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 447 352 L 457 352 L 457 388 L 447 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="389" y="374.16" text-anchor="middle" font-size="11" fill="#111111">b&#8242;<tspan font-size="8" dy="4">1</tspan></text>
<text x="427" y="374.16" text-anchor="middle" font-size="11" fill="#111111">b&#8242;<tspan font-size="8" dy="4">2</tspan></text>
<text x="408" y="421" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b&#8317;&#178;&#8318;&#8242;</text><rect x="480" y="344" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="518" y1="344" x2="518" y2="396" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="480" y1="370" x2="556" y2="370" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 479 339 L 469 339 L 469 401 L 479 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 557 339 L 567 339 L 567 401 L 557 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="499" y="361.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">1,1</tspan></text>
<text x="537" y="361.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">1,2</tspan></text>
<text x="499" y="387.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">2,1</tspan></text>
<text x="537" y="387.16" text-anchor="middle" font-size="11" fill="#111111">w&#8242;<tspan font-size="8" dy="4">2,2</tspan></text>
<text x="518" y="421" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W&#8317;&#179;&#8318;&#8242;</text><rect x="590" y="357" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="628" y1="357" x2="628" y2="383" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 589 352 L 579 352 L 579 388 L 589 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 667 352 L 677 352 L 677 388 L 667 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="609" y="374.16" text-anchor="middle" font-size="11" fill="#111111">b&#8242;<tspan font-size="8" dy="4">1</tspan></text>
<text x="647" y="374.16" text-anchor="middle" font-size="11" fill="#111111">b&#8242;<tspan font-size="8" dy="4">2</tspan></text>
<text x="628" y="421" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">b&#8317;&#179;&#8318;&#8242;</text></g>
<g data-key="uf-arrow1" data-only="1"><path d="M 78 200 L 78 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 188 200 L 188 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 298 200 L 298 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 408 200 L 408 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 518 200 L 518 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 628 200 L 628 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/></g>
<g data-key="uf-arrow2" data-only="1"><path d="M 78 312 L 78 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 188 312 L 188 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 298 312 L 298 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 408 312 L 408 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 518 312 L 518 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 628 312 L 628 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/></g>
<g data-key="uf-rule" data-only="1"><rect x="690" y="150" width="250" height="180" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/><text x="815" y="176" text-anchor="middle" font-size="12.5" fill="#5E5850">правило одной клетки</text><rect x="712" y="192" width="88" height="36" rx="6" fill="#C29E08" fill-opacity="0.16" stroke="#D83BB9" stroke-width="2"/><text x="756" y="216" text-anchor="middle" font-size="14" fill="#111111">w&#8317;&#179;&#8318;<tspan font-size="10" dy="4">1,1</tspan></text><text x="820" y="216" text-anchor="middle" font-size="18" fill="#111111">&#8722;</text><rect x="840" y="192" width="88" height="36" rx="6" fill="#C30B0A" fill-opacity="0.10" stroke="#D83BB9" stroke-width="2"/><text x="884" y="216" text-anchor="middle" font-size="14" fill="#111111">&#951;&#8201;&#8706;w<tspan font-size="10" dy="4">1,1</tspan></text><text x="815" y="252" text-anchor="middle" font-size="18" fill="#111111">&#8595;</text><rect x="776" y="264" width="88" height="36" rx="6" fill="#C29E08" fill-opacity="0.16" stroke="#D83BB9" stroke-width="2"/><text x="820" y="288" text-anchor="middle" font-size="14" fill="#111111">w&#8317;&#179;&#8318;&#8242;<tspan font-size="10" dy="4">1,1</tspan></text><text x="815" y="318" text-anchor="middle" font-size="12" fill="#5E5850">так меняется каждое из 18 чисел</text></g>
<g data-key="uf-hl" data-only="1"><rect x="480" y="120" width="38" height="26" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="480" y="232" width="38" height="26" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="480" y="344" width="38" height="26" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><path d="M 499 146 L 499 230" fill="none" stroke="#D83BB9" stroke-width="1.4" stroke-dasharray="4 3"/><path d="M 499 258 L 499 342" fill="none" stroke="#D83BB9" stroke-width="1.4" stroke-dasharray="4 3"/></g>
<g data-key="uf-all" data-only="1"><rect x="690" y="150" width="250" height="180" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/><text x="815" y="180" text-anchor="middle" font-size="13" fill="#5E5850">в этой сети</text><text x="815" y="216" text-anchor="middle" font-size="30" font-weight="800" fill="#111111">18</text><text x="815" y="240" text-anchor="middle" font-size="13" fill="#5E5850">обучаемых чисел</text><text x="815" y="268" text-anchor="middle" font-size="12.5" fill="#5E5850">12 весов + 6 смещений;</text><text x="815" y="288" text-anchor="middle" font-size="12.5" fill="#5E5850">все меняются одновременно,</text><text x="815" y="308" text-anchor="middle" font-size="12.5" fill="#5E5850">по одному и тому же правилу</text></g>
<g data-key="uf-check" data-only="1"><rect x="690" y="150" width="250" height="180" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/><text x="815" y="176" text-anchor="middle" font-size="12.5" fill="#5E5850">проверка шага</text><rect x="712" y="190" width="206" height="34" rx="8" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/><text x="815" y="212" text-anchor="middle" font-size="13.5" fill="#111111">тот же батч X, Y</text><text x="815" y="240" text-anchor="middle" font-size="16" fill="#111111">&#8595;</text><rect x="712" y="246" width="206" height="34" rx="8" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="815" y="268" text-anchor="middle" font-size="13.5" fill="#111111">forward с &#952;&#8242;</text><text x="815" y="296" text-anchor="middle" font-size="16" fill="#111111">&#8595;</text><rect x="742" y="300" width="146" height="26" rx="8" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.6"/><text x="815" y="318" text-anchor="middle" font-size="13.5" fill="#111111">новый L&#8242;</text></g>
</svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="mm0 uf-theta" data-focus="uf-theta"><div class="step-kicker">Шаг 1 &#183; текущее состояние</div><h4>Все обучаемые числа собраны в один набор &#952;</h4><div class="math-display" data-tex="\boldsymbol\theta=\{\mathbf W^{(1)},\mathbf b^{(1)},\mathbf W^{(2)},\mathbf b^{(2)},\mathbf W^{(3)},\mathbf b^{(3)}\}"></div><p>Входы, активации и вероятности в &#952; не входят: они пересчитываются заново на каждом forward.</p></div>
    <div class="step-panel" data-on="mm1 uf-theta uf-grad uf-arrow1" data-focus="uf-grad"><div class="step-kicker">Шаг 2 &#183; направление</div><h4>Backward вернул матрицы ровно тех же форм</h4><div class="math-display" data-tex="\nabla_{\boldsymbol\theta}L=\{d\mathbf W^{(1)},d\mathbf b^{(1)},d\mathbf W^{(2)},d\mathbf b^{(2)},d\mathbf W^{(3)},d\mathbf b^{(3)}\}"></div><p>Совпадение форм градиента и параметра — проверка: если формы разошлись, где-то забыто транспонирование или суммирование по батчу.</p></div>
    <div class="step-panel" data-on="mm2 uf-theta uf-grad uf-new uf-arrow1 uf-arrow2 uf-rule uf-hl" data-focus="uf-rule"><div class="step-kicker">Шаг 3 &#183; правило клетки</div><h4>Каждое число уменьшается на свою производную с множителем &#951;</h4><div class="math-display" data-tex="w^{(l)}_{ij}\;\leftarrow\;w^{(l)}_{ij}-\eta\,\frac{\partial L}{\partial w^{(l)}_{ij}}"></div><p>Градиент показывает направление роста loss, поэтому мы идём в противоположную сторону. Клетка не знает ни про слой, ни про соседей — правило локальное.</p></div>
    <div class="step-panel" data-on="mm3 uf-theta uf-grad uf-new uf-arrow1 uf-arrow2 uf-all" data-focus="uf-all"><div class="step-kicker">Шаг 4 &#183; обновление</div><h4>Одно и то же вычитание применяется ко всем слоям</h4><div class="math-display" data-tex="\boldsymbol\theta' = \boldsymbol\theta-\eta\,\nabla_{\boldsymbol\theta}L"></div><p>Никакой очерёдности нет: слои обновляются из градиентов, посчитанных до шага, а не по цепочке друг за другом.</p></div>
    <div class="step-panel" data-on="mm4 uf-theta uf-grad uf-new uf-arrow1 uf-arrow2 uf-check" data-focus="uf-check"><div class="step-kicker">Шаг 5 &#183; проверка</div><h4>Новый loss узнаём только новым forward</h4><div class="math-display" data-tex="L(\boldsymbol\theta')&lt;L(\boldsymbol\theta)\quad\text{при достаточно малом }\eta"></div><p>Слишком большой шаг перескакивает через область уменьшения: правило не обещает спад при любом &#951;, оно обещает верное направление.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">&#8592; Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее &#8594;</button></div>
</div>
<p class="stage-hint">Цель интерактива: увидеть, что шаг спуска — это одно поклеточное вычитание, повторённое для всех параметров.</p>

### Проверяем обновление на числах

<p>
  Берём средние градиенты батча и learning rate
  <span class="math-inline" data-tex="\eta=0.1"></span>. Проследим одну клетку —
  <span class="math-inline" data-tex="W^{(3)}_{1,1}"></span> — от градиента до нового
  значения, а затем запустим новый forward для того же батча.
</p>

<div class="stage numeric-stage" id="stageUpdateNumeric" tabindex="0" aria-label="Числовая проверка одного шага gradient descent">
  <div class="stage-figure">
<svg class="viz-svg" id="mlp-un-svg" viewBox="0 0 960 326" role="img" aria-label="Числовой шаг спуска: loss до, градиенты, умножение на eta, вычитание и loss после">
<defs><marker id="mlp-un-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
<rect x="24" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="111.2" y="35" text-anchor="middle" font-size="12" fill="#5E5850">L до шага</text>
<rect x="208.4" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="295.6" y="35" text-anchor="middle" font-size="12" fill="#5E5850">градиенты</text>
<rect x="392.8" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="480" y="35" text-anchor="middle" font-size="12" fill="#5E5850">умножаем на &#951;</text>
<rect x="577.2" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="664.4" y="35" text-anchor="middle" font-size="12" fill="#5E5850">вычитаем</text>
<rect x="761.6" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="848.8" y="35" text-anchor="middle" font-size="12" fill="#5E5850">L после шага</text>
<g data-key="mm0" data-only="1"><rect x="22" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="206.4" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="390.8" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="575.2" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="759.6" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" text-anchor="middle" font-size="13" fill="#5E5850">в клетках стоят только имена — все числа собраны в описании шага под сценой</text>
<g transform="translate(0,-34)">
<g data-key="un1" data-only="1"><line x1="300" y1="292" x2="700" y2="292" stroke="#C9C2B8" stroke-width="1.4"/><rect x="360" y="284" width="62" height="8" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.5"/><text x="391" y="312" text-anchor="middle" font-size="13" fill="#5E5850">&#8467;&#8321; &#183; объект 1</text><rect x="500" y="136" width="62" height="156" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.5"/><text x="531" y="312" text-anchor="middle" font-size="13" fill="#5E5850">&#8467;&#8322; &#183; объект 2</text><line x1="320" y1="210" x2="680" y2="210" stroke="#111111" stroke-width="1.6" stroke-dasharray="6 4"/><text x="690" y="214" font-size="13" font-weight="700" fill="#111111">L — среднее</text><text x="480" y="340" text-anchor="middle" font-size="13" fill="#5E5850">почти весь средний loss приходит от второго объекта — он и потянет градиент</text></g>
<g data-key="un2" data-only="1"><rect x="250" y="176" width="120" height="68" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="310" y1="176" x2="310" y2="244" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="250" y1="210" x2="370" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 249 171 L 239 171 L 239 249 L 249 249" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 371 171 L 381 171 L 381 249 L 371 249" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="280" y="198.44" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="340" y="198.44" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="280" y="232.44" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="340" y="232.44" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="310" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="310" y="271" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">dW&#8317;&#179;&#8318;</text><rect x="560" y="193" width="120" height="34" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="620" y1="193" x2="620" y2="227" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 559 188 L 549 188 L 549 232 L 559 232" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 681 188 L 691 188 L 691 232 L 681 232" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="590" y="215.44" text-anchor="middle" font-size="15" fill="#111111">&#8706;b<tspan font-size="10" dy="4">1</tspan></text>
<text x="650" y="215.44" text-anchor="middle" font-size="15" fill="#111111">&#8706;b<tspan font-size="10" dy="4">2</tspan></text>
<text x="620" y="179" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 &#215; 2</text>
<text x="620" y="270" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">db&#8317;&#179;&#8318;</text><text x="480" y="320" text-anchor="middle" font-size="13" fill="#5E5850">форма dW&#8317;&#179;&#8318; совпадает с формой W&#8317;&#179;&#8318;, форма db&#8317;&#179;&#8318; — с формой b&#8317;&#179;&#8318;</text></g>
<g data-key="un-hl2" data-only="1"><rect x="250" y="176" width="60" height="34" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="un3" data-only="1"><text x="196" y="216" text-anchor="middle" font-size="18" fill="#111111">&#951; &#215;</text><rect x="240" y="176" width="112" height="64" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="296" y1="176" x2="296" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="240" y1="208" x2="352" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 239 171 L 229 171 L 229 245 L 239 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 353 171 L 363 171 L 363 245 L 353 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<text x="268" y="197.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="324" y="197.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="268" y="229.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="324" y="229.12" text-anchor="middle" font-size="15" fill="#111111">&#8706;w<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="296" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="296" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">dW&#8317;&#179;&#8318;</text><text x="392" y="216" text-anchor="middle" font-size="20" fill="#111111">=</text><rect x="430" y="176" width="112" height="64" fill="#E88919" fill-opacity="0.14"/>
<line x1="486" y1="176" x2="486" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="430" y1="208" x2="542" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 429 171 L 419 171 L 419 245 L 429 245" fill="none" stroke="#E88919" stroke-width="1.8"/>
<path d="M 543 171 L 553 171 L 553 245 L 543 245" fill="none" stroke="#E88919" stroke-width="1.8"/>
<text x="458" y="197.12" text-anchor="middle" font-size="13" fill="#111111">&#951;&#8201;&#8706;w<tspan font-size="9" dy="4">1,1</tspan></text>
<text x="514" y="197.12" text-anchor="middle" font-size="13" fill="#111111">&#951;&#8201;&#8706;w<tspan font-size="9" dy="4">1,2</tspan></text>
<text x="458" y="229.12" text-anchor="middle" font-size="13" fill="#111111">&#951;&#8201;&#8706;w<tspan font-size="9" dy="4">2,1</tspan></text>
<text x="514" y="229.12" text-anchor="middle" font-size="13" fill="#111111">&#951;&#8201;&#8706;w<tspan font-size="9" dy="4">2,2</tspan></text>
<text x="486" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="486" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">&#951; &#183; dW&#8317;&#179;&#8318;</text><text x="720" y="200" text-anchor="middle" font-size="13" fill="#5E5850">&#951; = 0,1 — длина шага;</text><text x="720" y="220" text-anchor="middle" font-size="13" fill="#5E5850">направление задал градиент,</text><text x="720" y="240" text-anchor="middle" font-size="13" fill="#5E5850">&#951; отвечает только за масштаб</text></g>
<g data-key="un-hl3" data-only="1"><rect x="240" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="430" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="un4" data-only="1"><rect x="90" y="176" width="112" height="64" fill="#C29E08" fill-opacity="0.16"/>
<line x1="146" y1="176" x2="146" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="90" y1="208" x2="202" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 89 171 L 79 171 L 79 245 L 89 245" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 203 171 L 213 171 L 213 245 L 203 245" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="118" y="197.12" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="174" y="197.12" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="118" y="229.12" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="174" y="229.12" text-anchor="middle" font-size="15" fill="#111111">w<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="146" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="146" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W&#8317;&#179;&#8318;</text><text x="228" y="216" text-anchor="middle" font-size="20" fill="#111111">&#8722;</text><rect x="264" y="176" width="112" height="64" fill="#E88919" fill-opacity="0.14"/>
<line x1="320" y1="176" x2="320" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="264" y1="208" x2="376" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 263 171 L 253 171 L 253 245 L 263 245" fill="none" stroke="#E88919" stroke-width="1.8"/>
<path d="M 377 171 L 387 171 L 387 245 L 377 245" fill="none" stroke="#E88919" stroke-width="1.8"/>
<text x="292" y="197.12" text-anchor="middle" font-size="13" fill="#111111">&#951;&#8201;&#8706;w<tspan font-size="9" dy="4">1,1</tspan></text>
<text x="348" y="197.12" text-anchor="middle" font-size="13" fill="#111111">&#951;&#8201;&#8706;w<tspan font-size="9" dy="4">1,2</tspan></text>
<text x="292" y="229.12" text-anchor="middle" font-size="13" fill="#111111">&#951;&#8201;&#8706;w<tspan font-size="9" dy="4">2,1</tspan></text>
<text x="348" y="229.12" text-anchor="middle" font-size="13" fill="#111111">&#951;&#8201;&#8706;w<tspan font-size="9" dy="4">2,2</tspan></text>
<text x="320" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="320" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">&#951; &#183; dW&#8317;&#179;&#8318;</text><text x="402" y="216" text-anchor="middle" font-size="20" fill="#111111">=</text><rect x="438" y="176" width="112" height="64" fill="#C29E08" fill-opacity="0.16"/>
<line x1="494" y1="176" x2="494" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="438" y1="208" x2="550" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 437 171 L 427 171 L 427 245 L 437 245" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 551 171 L 561 171 L 561 245 L 551 245" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<text x="466" y="197.12" text-anchor="middle" font-size="15" fill="#111111">w&#8242;<tspan font-size="10" dy="4">1,1</tspan></text>
<text x="522" y="197.12" text-anchor="middle" font-size="15" fill="#111111">w&#8242;<tspan font-size="10" dy="4">1,2</tspan></text>
<text x="466" y="229.12" text-anchor="middle" font-size="15" fill="#111111">w&#8242;<tspan font-size="10" dy="4">2,1</tspan></text>
<text x="522" y="229.12" text-anchor="middle" font-size="15" fill="#111111">w&#8242;<tspan font-size="10" dy="4">2,2</tspan></text>
<text x="494" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 &#215; 2</text>
<text x="494" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#111111">W&#8317;&#179;&#8318;&#8242;</text><text x="740" y="192" text-anchor="middle" font-size="13" fill="#5E5850">b&#8317;&#179;&#8318;, W&#8317;&#178;&#8318;, b&#8317;&#178;&#8318;,</text><text x="740" y="212" text-anchor="middle" font-size="13" fill="#5E5850">W&#8317;&#185;&#8318; и b&#8317;&#185;&#8318; обновляются</text><text x="740" y="232" text-anchor="middle" font-size="13" fill="#5E5850">этой же строкой кода</text><text x="480" y="320" text-anchor="middle" font-size="13" fill="#5E5850">операция поклеточная: клетка (1,1) слева даёт клетку (1,1) справа</text></g>
<g data-key="un-hl4" data-only="1"><rect x="90" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="264" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="438" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="un5" data-only="1"><line x1="300" y1="292" x2="700" y2="292" stroke="#C9C2B8" stroke-width="1.4"/><rect x="370" y="152" width="74" height="140" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.5"/><text x="407" y="312" text-anchor="middle" font-size="13.5" font-weight="700" fill="#111111">L — до шага</text><path d="M 470 192 L 536 192" fill="none" stroke="#73B222" stroke-width="2.4" marker-end="url(#mlp-un-arrow)"/><rect x="556" y="220" width="74" height="72" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.5"/><text x="593" y="312" text-anchor="middle" font-size="13.5" font-weight="700" fill="#111111">L&#8242; — после шага</text><text x="480" y="340" text-anchor="middle" font-size="13" fill="#5E5850">это проверка одного шага, а не обещание монотонного спуска при любом &#951;</text></g>
</g>
</svg>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="mm0 un1" data-focus="un1"><div class="step-kicker">Шаг 1 &#183; исходное состояние</div><h4>Средний loss до шага</h4><div class="math-display" data-mlp-tex="updateOld"></div><p>Столбики нарисованы в одном масштабе: первый объект почти не штрафуется, второй даёт больше двух с половиной единиц.</p></div>
    <div class="step-panel" data-on="mm1 un2 un-hl2" data-focus="un-hl2"><div class="step-kicker">Шаг 2 &#183; градиенты батча</div><h4>Берём результаты batch backward как есть</h4><div class="math-display" data-mlp-tex="updateGrad"></div><p>Подсвечена клетка (1,1): дальше проследим именно её. В коде она ничем не выделена — все клетки обрабатываются одной операцией над массивами.</p></div>
    <div class="step-panel" data-on="mm2 un3 un-hl3" data-focus="un-hl3"><div class="step-kicker">Шаг 3 &#183; умножаем на &#951;</div><h4>&#951; = 0,1 сжимает шаг в десять раз</h4><div class="math-display" data-mlp-tex="updateScaled"></div><p>Знаки не меняются: умножение на положительное число сохраняет направление, поэтому &#951; отвечает только за длину шага.</p></div>
    <div class="step-panel" data-on="mm3 un4 un-hl4" data-focus="un-hl4"><div class="step-kicker">Шаг 4 &#183; вычитаем</div><h4>Показываем обновление W&#8317;&#179;&#8318; и b&#8317;&#179;&#8318; полностью</h4><div class="math-display" data-mlp-tex="updateCellNum"></div><div class="math-display" data-mlp-tex="updateNew"></div><p>Одновременно тем же правилом обновлены <span class="math-inline" data-tex="W^{(1)},b^{(1)},W^{(2)},b^{(2)}"></span> — всего 18 чисел.</p></div>
    <div class="step-panel" data-on="mm4 un5" data-focus="un5"><div class="step-kicker">Шаг 5 &#183; новый forward</div><h4>Средний loss уменьшился почти вдвое</h4><div class="math-display" data-mlp-tex="updateCheck"></div><p>Дальше цикл повторяется: новый forward &#8594; новый loss &#8594; новый backward &#8594; новый шаг. Ни одна формула при этом не меняется.</p></div>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">&#8592; Назад</button><div class="stage-progress"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее &#8594;</button></div>
</div>
<p class="stage-hint">Цель интерактива: проследить одну клетку от градиента до нового значения.</p>

<div class="callout">
  <strong>Полный цикл замкнулся:</strong>
  <span class="math-inline" data-tex="\mathbf X\to L\to\nabla_{\theta}L\to\theta'\to\text{новый forward}"></span>.
  В глубокой сети цикл не меняется; увеличивается только число повторяющихся слоёв.
</div>

## Часть 8. Размерности end to end: от x до dW и db

<p>
  Обозначения статьи сохранены: <span class="math-inline" data-tex="\mathbf x"></span> — строка признаков одного объекта,
  <span class="math-inline" data-tex="P"></span> — число признаков, <span class="math-inline" data-tex="H_1,H_2"></span> — ширины скрытых слоёв,
  <span class="math-inline" data-tex="C"></span> — число классов. Один объект — это <em>строка</em>, поэтому все векторы
  здесь имеют форму <span class="math-inline" data-tex="[1,\cdot]"></span>, а не столбца.
</p>
<div class="callout-blue">
  <strong>Про числа.</strong> В самой статье сквозной пример — сеть <span class="math-inline" data-tex="2\to2\to2\to2"></span>,
  где все формы одинаковые и различить оси невозможно. Здесь специально взяты разные числа:
  <span class="math-inline" data-tex="P=3,\;H_1=4,\;H_2=2,\;C=3"></span>. Формулы от этого не меняются — меняется только то,
  что теперь видно, какая ось откуда берётся.
</div>
<style>
  .fc-flow-label { font-size: 13px; fill: #5E5850; letter-spacing: .04em; text-transform: uppercase; }
  .slider-stage { padding-bottom: 20px; }
  .formula-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 22px 0; }
  .formula-card { min-width: 0; background: #fff; border: 1px solid #E4E1D7; border-radius: 11px; padding: 13px 14px; }
  .formula-card > span { display: block; font-size: 11px; color: #5E5850; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
  .formula-card .math-display { margin: 8px 0 2px; font-size: 14px; }
  .shape-note { color: #5E5850; font-size: 14px; line-height: 1.5; }
  @media (max-width: 760px) {
    .formula-strip { grid-template-columns: 1fr; }
    .stage-notes .step-panel .math-display { font-size: 13px; overflow-x: auto; overflow-y: hidden; }
  }
</style>
<div class="stage" id="stageFcDims" tabindex="0" aria-label="Размерности полносвязной нейросети от входа до градиентов">
  <div class="stage-figure">
    <svg id="fcdg" viewBox="0 0 960 1230" role="img" aria-label="Схема размерностей полносвязной сети: x, W, b, z, a, s, p, дельты, градиенты и батч">
      
      <style>
        #fcdg text { font-family: Helvetica, Arial, sans-serif; }
        #fcdg .ttl { font-size: 19px; font-weight: 800; fill: #111111; letter-spacing: -0.01em; }
        #fcdg .sub { font-size: 13px; fill: #5E5850; }
        #fcdg .cap { font-size: 13px; font-weight: 700; fill: #5E5850; letter-spacing: 0.06em; text-transform: uppercase; }
        #fcdg .dim { font-size: 13px; fill: #5E5850; }
        #fcdg .nm  { font-size: 15px; font-weight: 700; }
        #fcdg .op  { font-size: 20px; fill: #5E5850; }
        #fcdg .arw { font-size: 13px; fill: #5E5850; }
        #fcdg .leg { font-size: 13px; }
        #fcdg .grid { stroke: #FFFFFF; stroke-width: 1.6; }
      </style>
      <defs>
        <marker id="fc-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#5E5850"></path>
        </marker>
      </defs>
      <text x="36" y="34" class="ttl">Полносвязная сеть: размерности от входа до градиентов</text>
      <text x="36" y="56" class="sub">Сверху у матрицы — число столбцов, слева — число строк. Под именем — форма для P=3, H₁=4, H₂=2, C=3.</text>
      <g data-key="fc-setup">
      <rect x="36" y="68" width="888" height="68" rx="12" fill="#FBFAF7" stroke="#B7B0A7" stroke-width="1.5"></rect>
      <foreignObject x="56" y="78" width="848" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="\mathbf x\in\mathbb R^{1\times P},\quad \mathbf W^{(1)}\in\mathbb R^{P\times H_1},\quad \mathbf W^{(2)}\in\mathbb R^{H_1\times H_2},\quad \mathbf W^{(3)}\in\mathbb R^{H_2\times C}"></div></foreignObject>
      <foreignObject x="56" y="106" width="848" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="\mathbf b^{(l)}\in\mathbb R^{1\times H_l},\qquad \mathbf y\in\{0,1\}^{1\times C},\qquad P=3,\; H_1=4,\; H_2=2,\; C=3"></div></foreignObject>
      </g>
      <text x="36" y="166" class="cap">Forward · слой 1 · из признаков в скрытые нейроны</text>
      <g data-key="fc-x">
      <rect x="60" y="211" width="66" height="22" fill="#73B222"></rect><line x1="82" y1="211" x2="82" y2="233" class="grid"></line><line x1="104" y1="211" x2="104" y2="233" class="grid"></line><text x="93" y="202" text-anchor="middle" class="dim">P</text><text x="45" y="227" text-anchor="middle" class="dim">1</text><text x="93" y="277" text-anchor="middle" class="nm" fill="#73B222">x</text><foreignObject x="55" y="285" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      </g>
      <g data-key="fc-w1">
      <text x="140" y="229" text-anchor="middle" class="op">·</text>
      <rect x="176" y="189" width="88" height="66" fill="#7B4AB5"></rect><line x1="198" y1="189" x2="198" y2="255" class="grid"></line><line x1="220" y1="189" x2="220" y2="255" class="grid"></line><line x1="242" y1="189" x2="242" y2="255" class="grid"></line><line x1="176" y1="211" x2="264" y2="211" class="grid"></line><line x1="176" y1="233" x2="264" y2="233" class="grid"></line><text x="220" y="180" text-anchor="middle" class="dim">H₁</text><text x="161" y="227" text-anchor="middle" class="dim">P</text><text x="220" y="277" text-anchor="middle" class="nm" fill="#7B4AB5">W⁽¹⁾</text><foreignObject x="182" y="285" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[3,4]"></div></foreignObject>
      <text x="278" y="229" text-anchor="middle" class="op">+</text>
      <rect x="314" y="211" width="88" height="22" fill="#7B4AB5"></rect><line x1="336" y1="211" x2="336" y2="233" class="grid"></line><line x1="358" y1="211" x2="358" y2="233" class="grid"></line><line x1="380" y1="211" x2="380" y2="233" class="grid"></line><text x="358" y="202" text-anchor="middle" class="dim">H₁</text><text x="299" y="227" text-anchor="middle" class="dim">1</text><text x="358" y="277" text-anchor="middle" class="nm" fill="#7B4AB5">b⁽¹⁾</text><foreignObject x="320" y="285" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,4]"></div></foreignObject>
      </g>
      <g data-key="fc-z1">
      <text x="416" y="229" text-anchor="middle" class="op">=</text>
      <rect x="452" y="211" width="88" height="22" fill="#C29E08"></rect><line x1="474" y1="211" x2="474" y2="233" class="grid"></line><line x1="496" y1="211" x2="496" y2="233" class="grid"></line><line x1="518" y1="211" x2="518" y2="233" class="grid"></line><text x="496" y="202" text-anchor="middle" class="dim">H₁</text><text x="437" y="227" text-anchor="middle" class="dim">1</text><text x="496" y="277" text-anchor="middle" class="nm" fill="#C29E08">z⁽¹⁾</text><foreignObject x="458" y="285" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,4]"></div></foreignObject>
      </g>
      <g data-key="fc-a1">
      <path d="M550 222 L612 222" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#fc-arw)"></path><text x="581" y="210" text-anchor="middle" class="arw">ReLU</text>
      <rect x="636" y="211" width="88" height="22" fill="#1B9BC2"></rect><line x1="658" y1="211" x2="658" y2="233" class="grid"></line><line x1="680" y1="211" x2="680" y2="233" class="grid"></line><line x1="702" y1="211" x2="702" y2="233" class="grid"></line><text x="680" y="202" text-anchor="middle" class="dim">H₁</text><text x="621" y="227" text-anchor="middle" class="dim">1</text><text x="680" y="277" text-anchor="middle" class="nm" fill="#1B9BC2">a⁽¹⁾</text><foreignObject x="642" y="285" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,4]"></div></foreignObject>
      </g>
      <text x="36" y="336" class="cap">Forward · слой 2 · тот же блок ещё раз</text>
      <g data-key="fc-a1b">
      <rect x="60" y="387" width="88" height="22" fill="#1B9BC2"></rect><line x1="82" y1="387" x2="82" y2="409" class="grid"></line><line x1="104" y1="387" x2="104" y2="409" class="grid"></line><line x1="126" y1="387" x2="126" y2="409" class="grid"></line><text x="104" y="378" text-anchor="middle" class="dim">H₁</text><text x="45" y="403" text-anchor="middle" class="dim">1</text><text x="104" y="464" text-anchor="middle" class="nm" fill="#1B9BC2">a⁽¹⁾</text><foreignObject x="66" y="472" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,4]"></div></foreignObject>
      </g>
      <g data-key="fc-w2">
      <text x="162" y="405" text-anchor="middle" class="op">·</text>
      <rect x="198" y="354" width="44" height="88" fill="#7B4AB5"></rect><line x1="220" y1="354" x2="220" y2="442" class="grid"></line><line x1="198" y1="376" x2="242" y2="376" class="grid"></line><line x1="198" y1="398" x2="242" y2="398" class="grid"></line><line x1="198" y1="420" x2="242" y2="420" class="grid"></line><text x="220" y="345" text-anchor="middle" class="dim">H₂</text><text x="183" y="403" text-anchor="middle" class="dim">H₁</text><text x="220" y="464" text-anchor="middle" class="nm" fill="#7B4AB5">W⁽²⁾</text><foreignObject x="182" y="472" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[4,2]"></div></foreignObject>
      <text x="256" y="405" text-anchor="middle" class="op">+</text>
      <rect x="292" y="387" width="44" height="22" fill="#7B4AB5"></rect><line x1="314" y1="387" x2="314" y2="409" class="grid"></line><text x="314" y="378" text-anchor="middle" class="dim">H₂</text><text x="277" y="403" text-anchor="middle" class="dim">1</text><text x="314" y="464" text-anchor="middle" class="nm" fill="#7B4AB5">b⁽²⁾</text><foreignObject x="276" y="472" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      </g>
      <g data-key="fc-z2">
      <text x="350" y="405" text-anchor="middle" class="op">=</text>
      <rect x="386" y="387" width="44" height="22" fill="#C29E08"></rect><line x1="408" y1="387" x2="408" y2="409" class="grid"></line><text x="408" y="378" text-anchor="middle" class="dim">H₂</text><text x="371" y="403" text-anchor="middle" class="dim">1</text><text x="408" y="464" text-anchor="middle" class="nm" fill="#C29E08">z⁽²⁾</text><foreignObject x="370" y="472" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      </g>
      <g data-key="fc-a2">
      <path d="M440 398 L502 398" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#fc-arw)"></path><text x="471" y="386" text-anchor="middle" class="arw">ReLU</text>
      <rect x="526" y="387" width="44" height="22" fill="#1B9BC2"></rect><line x1="548" y1="387" x2="548" y2="409" class="grid"></line><text x="548" y="378" text-anchor="middle" class="dim">H₂</text><text x="511" y="403" text-anchor="middle" class="dim">1</text><text x="548" y="464" text-anchor="middle" class="nm" fill="#1B9BC2">a⁽²⁾</text><foreignObject x="510" y="472" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      </g>
      <text x="36" y="524" class="cap">Forward · выход · логиты, softmax и loss</text>
      <g data-key="fc-a2b">
      <rect x="60" y="557" width="44" height="22" fill="#1B9BC2"></rect><line x1="82" y1="557" x2="82" y2="579" class="grid"></line><text x="82" y="548" text-anchor="middle" class="dim">H₂</text><text x="45" y="573" text-anchor="middle" class="dim">1</text><text x="82" y="612" text-anchor="middle" class="nm" fill="#1B9BC2">a⁽²⁾</text><foreignObject x="44" y="620" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      </g>
      <g data-key="fc-w3">
      <text x="118" y="575" text-anchor="middle" class="op">·</text>
      <rect x="154" y="546" width="66" height="44" fill="#7B4AB5"></rect><line x1="176" y1="546" x2="176" y2="590" class="grid"></line><line x1="198" y1="546" x2="198" y2="590" class="grid"></line><line x1="154" y1="568" x2="220" y2="568" class="grid"></line><text x="187" y="537" text-anchor="middle" class="dim">C</text><text x="139" y="573" text-anchor="middle" class="dim">H₂</text><text x="187" y="612" text-anchor="middle" class="nm" fill="#7B4AB5">W⁽³⁾</text><foreignObject x="149" y="620" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[2,3]"></div></foreignObject>
      <text x="234" y="575" text-anchor="middle" class="op">+</text>
      <rect x="270" y="557" width="66" height="22" fill="#7B4AB5"></rect><line x1="292" y1="557" x2="292" y2="579" class="grid"></line><line x1="314" y1="557" x2="314" y2="579" class="grid"></line><text x="303" y="548" text-anchor="middle" class="dim">C</text><text x="255" y="573" text-anchor="middle" class="dim">1</text><text x="303" y="612" text-anchor="middle" class="nm" fill="#7B4AB5">b⁽³⁾</text><foreignObject x="265" y="620" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      </g>
      <g data-key="fc-s">
      <text x="350" y="575" text-anchor="middle" class="op">=</text>
      <rect x="386" y="557" width="66" height="22" fill="#C29E08"></rect><line x1="408" y1="557" x2="408" y2="579" class="grid"></line><line x1="430" y1="557" x2="430" y2="579" class="grid"></line><text x="419" y="548" text-anchor="middle" class="dim">C</text><text x="371" y="573" text-anchor="middle" class="dim">1</text><text x="419" y="612" text-anchor="middle" class="nm" fill="#C29E08">s</text><foreignObject x="381" y="620" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      </g>
      <g data-key="fc-p">
      <path d="M462 568 L544 568" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#fc-arw)"></path><text x="503" y="556" text-anchor="middle" class="arw">softmax</text>
      <rect x="568" y="557" width="66" height="22" fill="#1B9BC2"></rect><line x1="590" y1="557" x2="590" y2="579" class="grid"></line><line x1="612" y1="557" x2="612" y2="579" class="grid"></line><text x="601" y="548" text-anchor="middle" class="dim">C</text><text x="553" y="573" text-anchor="middle" class="dim">1</text><text x="601" y="612" text-anchor="middle" class="nm" fill="#1B9BC2">p</text><foreignObject x="563" y="620" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      </g>
      <g data-key="fc-y">
      <rect x="664" y="557" width="66" height="22" fill="#73B222"></rect><line x1="686" y1="557" x2="686" y2="579" class="grid"></line><line x1="708" y1="557" x2="708" y2="579" class="grid"></line><text x="697" y="548" text-anchor="middle" class="dim">C</text><text x="649" y="573" text-anchor="middle" class="dim">1</text><text x="697" y="612" text-anchor="middle" class="nm" fill="#73B222">y</text><foreignObject x="659" y="620" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      </g>
      <g data-key="fc-loss">
      <path d="M750 568 L806 568" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#fc-arw)"></path><text x="778" y="556" text-anchor="middle" class="arw">cross-entropy</text>
      <rect x="846" y="550" width="36" height="36" fill="#C30B0A"></rect><text x="864" y="541" text-anchor="middle" class="dim">1</text><text x="831" y="573" text-anchor="middle" class="dim">1</text><text x="864" y="612" text-anchor="middle" class="nm" fill="#C30B0A">ℓ</text><foreignObject x="826" y="620" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,1]"></div></foreignObject>
      </g>
      <text x="36" y="672" class="cap">Backward 1 · сигнал ошибки и градиенты последнего слоя</text>
      <g data-key="fc-d3">
      <rect x="60" y="705" width="66" height="22" fill="#1B9BC2"></rect><line x1="82" y1="705" x2="82" y2="727" class="grid"></line><line x1="104" y1="705" x2="104" y2="727" class="grid"></line><text x="93" y="696" text-anchor="middle" class="dim">C</text><text x="45" y="721" text-anchor="middle" class="dim">1</text><text x="93" y="760" text-anchor="middle" class="nm" fill="#1B9BC2">p</text><foreignObject x="55" y="768" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      <text x="140" y="723" text-anchor="middle" class="op">−</text>
      <rect x="176" y="705" width="66" height="22" fill="#73B222"></rect><line x1="198" y1="705" x2="198" y2="727" class="grid"></line><line x1="220" y1="705" x2="220" y2="727" class="grid"></line><text x="209" y="696" text-anchor="middle" class="dim">C</text><text x="161" y="721" text-anchor="middle" class="dim">1</text><text x="209" y="760" text-anchor="middle" class="nm" fill="#73B222">y</text><foreignObject x="171" y="768" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      <text x="256" y="723" text-anchor="middle" class="op">=</text>
      <rect x="292" y="705" width="66" height="22" fill="#A64CC6"></rect><line x1="314" y1="705" x2="314" y2="727" class="grid"></line><line x1="336" y1="705" x2="336" y2="727" class="grid"></line><text x="325" y="696" text-anchor="middle" class="dim">C</text><text x="277" y="721" text-anchor="middle" class="dim">1</text><text x="325" y="760" text-anchor="middle" class="nm" fill="#A64CC6">δ⁽³⁾</text><foreignObject x="287" y="768" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      </g>
      <g data-key="fc-gw3">
      <rect x="430" y="694" width="22" height="44" fill="#1B9BC2"></rect><line x1="430" y1="716" x2="452" y2="716" class="grid"></line><text x="441" y="685" text-anchor="middle" class="dim">1</text><text x="415" y="721" text-anchor="middle" class="dim">H₂</text><text x="441" y="760" text-anchor="middle" class="nm" fill="#1B9BC2">(a⁽²⁾)ᵀ</text><foreignObject x="403" y="768" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[2,1]"></div></foreignObject>
      <text x="466" y="723" text-anchor="middle" class="op">·</text>
      <rect x="502" y="705" width="66" height="22" fill="#A64CC6"></rect><line x1="524" y1="705" x2="524" y2="727" class="grid"></line><line x1="546" y1="705" x2="546" y2="727" class="grid"></line><text x="535" y="696" text-anchor="middle" class="dim">C</text><text x="487" y="721" text-anchor="middle" class="dim">1</text><text x="535" y="760" text-anchor="middle" class="nm" fill="#A64CC6">δ⁽³⁾</text><foreignObject x="497" y="768" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      <text x="582" y="723" text-anchor="middle" class="op">=</text>
      <rect x="618" y="694" width="66" height="44" fill="#C30B0A"></rect><line x1="640" y1="694" x2="640" y2="738" class="grid"></line><line x1="662" y1="694" x2="662" y2="738" class="grid"></line><line x1="618" y1="716" x2="684" y2="716" class="grid"></line><text x="651" y="685" text-anchor="middle" class="dim">C</text><text x="603" y="721" text-anchor="middle" class="dim">H₂</text><text x="651" y="760" text-anchor="middle" class="nm" fill="#C30B0A">dW⁽³⁾</text><foreignObject x="613" y="768" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[2,3]"></div></foreignObject>
      </g>
      <g data-key="fc-gb3">
      <rect x="760" y="705" width="66" height="22" fill="#C30B0A"></rect><line x1="782" y1="705" x2="782" y2="727" class="grid"></line><line x1="804" y1="705" x2="804" y2="727" class="grid"></line><text x="793" y="696" text-anchor="middle" class="dim">C</text><text x="745" y="721" text-anchor="middle" class="dim">1</text><text x="793" y="760" text-anchor="middle" class="nm" fill="#C30B0A">db⁽³⁾ = δ⁽³⁾</text><foreignObject x="755" y="768" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      </g>
      <text x="36" y="820" class="cap">Backward 2 · один шаг назад: через Wᵀ, через ReLU, в градиент</text>
      <g data-key="fc-da2">
      <rect x="60" y="875" width="66" height="22" fill="#A64CC6"></rect><line x1="82" y1="875" x2="82" y2="897" class="grid"></line><line x1="104" y1="875" x2="104" y2="897" class="grid"></line><text x="93" y="866" text-anchor="middle" class="dim">C</text><text x="45" y="891" text-anchor="middle" class="dim">1</text><text x="93" y="952" text-anchor="middle" class="nm" fill="#A64CC6">δ⁽³⁾</text><foreignObject x="55" y="960" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      <text x="140" y="893" text-anchor="middle" class="op">·</text>
      <rect x="176" y="853" width="44" height="66" fill="#7B4AB5"></rect><line x1="198" y1="853" x2="198" y2="919" class="grid"></line><line x1="176" y1="875" x2="220" y2="875" class="grid"></line><line x1="176" y1="897" x2="220" y2="897" class="grid"></line><text x="198" y="844" text-anchor="middle" class="dim">H₂</text><text x="161" y="891" text-anchor="middle" class="dim">C</text><text x="198" y="952" text-anchor="middle" class="nm" fill="#7B4AB5">(W⁽³⁾)ᵀ</text><foreignObject x="160" y="960" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[3,2]"></div></foreignObject>
      <text x="234" y="893" text-anchor="middle" class="op">=</text>
      <rect x="270" y="875" width="44" height="22" fill="#A64CC6"></rect><line x1="292" y1="875" x2="292" y2="897" class="grid"></line><text x="292" y="866" text-anchor="middle" class="dim">H₂</text><text x="255" y="891" text-anchor="middle" class="dim">1</text><text x="292" y="952" text-anchor="middle" class="nm" fill="#A64CC6">da⁽²⁾</text><foreignObject x="254" y="960" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      </g>
      <g data-key="fc-d2">
      <text x="328" y="893" text-anchor="middle" class="op">⊙</text>
      <rect x="364" y="875" width="44" height="22" fill="#9A938A"></rect><line x1="386" y1="875" x2="386" y2="897" class="grid"></line><text x="386" y="866" text-anchor="middle" class="dim">H₂</text><text x="349" y="891" text-anchor="middle" class="dim">1</text><text x="386" y="952" text-anchor="middle" class="nm" fill="#9A938A">1[z⁽²⁾&gt;0]</text><foreignObject x="348" y="960" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      <text x="422" y="893" text-anchor="middle" class="op">=</text>
      <rect x="458" y="875" width="44" height="22" fill="#A64CC6"></rect><line x1="480" y1="875" x2="480" y2="897" class="grid"></line><text x="480" y="866" text-anchor="middle" class="dim">H₂</text><text x="443" y="891" text-anchor="middle" class="dim">1</text><text x="480" y="952" text-anchor="middle" class="nm" fill="#A64CC6">δ⁽²⁾</text><foreignObject x="442" y="960" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      </g>
      <g data-key="fc-gw2">
      <rect x="560" y="842" width="22" height="88" fill="#1B9BC2"></rect><line x1="560" y1="864" x2="582" y2="864" class="grid"></line><line x1="560" y1="886" x2="582" y2="886" class="grid"></line><line x1="560" y1="908" x2="582" y2="908" class="grid"></line><text x="571" y="833" text-anchor="middle" class="dim">1</text><text x="545" y="891" text-anchor="middle" class="dim">H₁</text><text x="571" y="952" text-anchor="middle" class="nm" fill="#1B9BC2">(a⁽¹⁾)ᵀ</text><foreignObject x="533" y="960" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[4,1]"></div></foreignObject>
      <text x="596" y="893" text-anchor="middle" class="op">·</text>
      <rect x="632" y="875" width="44" height="22" fill="#A64CC6"></rect><line x1="654" y1="875" x2="654" y2="897" class="grid"></line><text x="654" y="866" text-anchor="middle" class="dim">H₂</text><text x="617" y="891" text-anchor="middle" class="dim">1</text><text x="654" y="952" text-anchor="middle" class="nm" fill="#A64CC6">δ⁽²⁾</text><foreignObject x="616" y="960" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      <text x="690" y="893" text-anchor="middle" class="op">=</text>
      <rect x="726" y="842" width="44" height="88" fill="#C30B0A"></rect><line x1="748" y1="842" x2="748" y2="930" class="grid"></line><line x1="726" y1="864" x2="770" y2="864" class="grid"></line><line x1="726" y1="886" x2="770" y2="886" class="grid"></line><line x1="726" y1="908" x2="770" y2="908" class="grid"></line><text x="748" y="833" text-anchor="middle" class="dim">H₂</text><text x="711" y="891" text-anchor="middle" class="dim">H₁</text><text x="748" y="952" text-anchor="middle" class="nm" fill="#C30B0A">dW⁽²⁾</text><foreignObject x="710" y="960" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[4,2]"></div></foreignObject>
      <rect x="846" y="875" width="44" height="22" fill="#C30B0A"></rect><line x1="868" y1="875" x2="868" y2="897" class="grid"></line><text x="868" y="866" text-anchor="middle" class="dim">H₂</text><text x="831" y="891" text-anchor="middle" class="dim">1</text><text x="868" y="952" text-anchor="middle" class="nm" fill="#C30B0A">db⁽²⁾ = δ⁽²⁾</text><foreignObject x="830" y="960" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      </g>
      <text x="36" y="1012" class="cap">Батч · тот же слой 2, но сразу B=3 объекта</text>
      <g data-key="fc-batch">
      <rect x="60" y="1034" width="66" height="88" fill="#1B9BC2"></rect><line x1="82" y1="1034" x2="82" y2="1122" class="grid"></line><line x1="104" y1="1034" x2="104" y2="1122" class="grid"></line><line x1="60" y1="1056" x2="126" y2="1056" class="grid"></line><line x1="60" y1="1078" x2="126" y2="1078" class="grid"></line><line x1="60" y1="1100" x2="126" y2="1100" class="grid"></line><text x="93" y="1025" text-anchor="middle" class="dim">B</text><text x="45" y="1083" text-anchor="middle" class="dim">H₁</text><text x="93" y="1144" text-anchor="middle" class="nm" fill="#1B9BC2">(A⁽¹⁾)ᵀ</text><foreignObject x="55" y="1152" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[4,3]"></div></foreignObject>
      <text x="140" y="1085" text-anchor="middle" class="op">·</text>
      <rect x="176" y="1045" width="44" height="66" fill="#A64CC6"></rect><line x1="198" y1="1045" x2="198" y2="1111" class="grid"></line><line x1="176" y1="1067" x2="220" y2="1067" class="grid"></line><line x1="176" y1="1089" x2="220" y2="1089" class="grid"></line><text x="198" y="1036" text-anchor="middle" class="dim">H₂</text><text x="161" y="1083" text-anchor="middle" class="dim">B</text><text x="198" y="1144" text-anchor="middle" class="nm" fill="#A64CC6">Δ⁽²⁾</text><foreignObject x="160" y="1152" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[3,2]"></div></foreignObject>
      <text x="234" y="1085" text-anchor="middle" class="op">=</text>
      <rect x="270" y="1034" width="44" height="88" fill="#C30B0A"></rect><line x1="292" y1="1034" x2="292" y2="1122" class="grid"></line><line x1="270" y1="1056" x2="314" y2="1056" class="grid"></line><line x1="270" y1="1078" x2="314" y2="1078" class="grid"></line><line x1="270" y1="1100" x2="314" y2="1100" class="grid"></line><text x="292" y="1025" text-anchor="middle" class="dim">H₂</text><text x="255" y="1083" text-anchor="middle" class="dim">H₁</text><text x="292" y="1144" text-anchor="middle" class="nm" fill="#C30B0A">dW⁽²⁾</text><foreignObject x="254" y="1152" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[4,2]"></div></foreignObject>
      <rect x="380" y="1067" width="66" height="22" fill="#9A938A"></rect><line x1="402" y1="1067" x2="402" y2="1089" class="grid"></line><line x1="424" y1="1067" x2="424" y2="1089" class="grid"></line><text x="413" y="1058" text-anchor="middle" class="dim">B</text><text x="365" y="1083" text-anchor="middle" class="dim">1</text><text x="413" y="1144" text-anchor="middle" class="nm" fill="#9A938A">1ᵀ (сумма по B)</text><foreignObject x="375" y="1152" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,3]"></div></foreignObject>
      <text x="460" y="1085" text-anchor="middle" class="op">·</text>
      <rect x="496" y="1045" width="44" height="66" fill="#A64CC6"></rect><line x1="518" y1="1045" x2="518" y2="1111" class="grid"></line><line x1="496" y1="1067" x2="540" y2="1067" class="grid"></line><line x1="496" y1="1089" x2="540" y2="1089" class="grid"></line><text x="518" y="1036" text-anchor="middle" class="dim">H₂</text><text x="481" y="1083" text-anchor="middle" class="dim">B</text><text x="518" y="1144" text-anchor="middle" class="nm" fill="#A64CC6">Δ⁽²⁾</text><foreignObject x="480" y="1152" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[3,2]"></div></foreignObject>
      <text x="554" y="1085" text-anchor="middle" class="op">=</text>
      <rect x="590" y="1067" width="44" height="22" fill="#C30B0A"></rect><line x1="612" y1="1067" x2="612" y2="1089" class="grid"></line><text x="612" y="1058" text-anchor="middle" class="dim">H₂</text><text x="575" y="1083" text-anchor="middle" class="dim">1</text><text x="612" y="1144" text-anchor="middle" class="nm" fill="#C30B0A">db⁽²⁾</text><foreignObject x="574" y="1152" width="76" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="[1,2]"></div></foreignObject>
      </g>
      <g data-key="fc-rule">
      <rect x="660" y="1026" width="264" height="126" rx="14" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"></rect>
      <text x="682" y="1054" class="cap" fill="#4C7A16">Правило проверки</text>
      <foreignObject x="676" y="1064" width="232" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="d\mathbf W^{(l)}:[H_{l-1},H_l]"></div></foreignObject>
      <foreignObject x="676" y="1094" width="232" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="d\mathbf b^{(l)}:[1,H_l]"></div></foreignObject>
      <text x="792" y="1130" text-anchor="middle" class="arw" fill="#4C7A16">форма градиента = форма параметра</text>
      </g>
      <text x="36" y="1206" class="leg"><tspan fill="#73B222">данные</tspan><tspan fill="#5E5850">  ·  </tspan><tspan fill="#7B4AB5">параметры</tspan><tspan fill="#5E5850">  ·  </tspan><tspan fill="#C29E08">линейные выходы</tspan><tspan fill="#5E5850">  ·  </tspan><tspan fill="#1B9BC2">активации и вероятности</tspan><tspan fill="#5E5850">  ·  </tspan><tspan fill="#A64CC6">сигнал ошибки</tspan><tspan fill="#5E5850">  ·  </tspan><tspan fill="#C30B0A">loss и градиенты</tspan></text>
      </svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><div class="stage-progress" aria-hidden="true"></div><span class="stage-counter"></span><button type="button" data-nav="next">Далее →</button></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="fc-setup fc-x fc-w1" data-focus="fc-setup fc-x">
      <div class="step-kicker">Шаг 1 · что фиксируем</div>
      <h4>Строка — это объект, столбец — это нейрон</h4>
      <div class="math-display" data-tex="\mathbf x\in\mathbb R^{1\times P},\qquad \mathbf W^{(1)}\in\mathbb R^{P\times H_1},\qquad \mathbf b^{(1)}\in\mathbb R^{1\times H_1}"></div>
      <p>Ширина <span class="math-inline" data-tex="\mathbf x"></span> и высота <span class="math-inline" data-tex="\mathbf W^{(1)}"></span> — это одно и то же число <span class="math-inline" data-tex="P"></span>. Именно поэтому их можно перемножить. Столбец <span class="math-inline" data-tex="j"></span> матрицы <span class="math-inline" data-tex="\mathbf W^{(1)}"></span> — это веса одного скрытого нейрона.</p>
    </div>
    <div class="step-panel" data-on="fc-x fc-w1 fc-z1" data-focus="fc-z1">
      <div class="step-kicker">Шаг 2 · линейная часть слоя</div>
      <h4>Умножение съедает ось признаков и открывает ось нейронов</h4>
      <div class="math-display" data-tex="\underbrace{[1,P]}_{\mathbf x}\;\underbrace{[P,H_1]}_{\mathbf W^{(1)}}+\underbrace{[1,H_1]}_{\mathbf b^{(1)}}\longrightarrow\underbrace{[1,H_1]}_{\mathbf z^{(1)}}"></div>
      <p>Внутренние <span class="math-inline" data-tex="P"></span> сокращаются, наружу выходит строка из <span class="math-inline" data-tex="H_1"></span> чисел — по одному предактивационному значению на скрытый нейрон. Bias складывается покомпонентно и форму не трогает.</p>
    </div>
    <div class="step-panel" data-on="fc-z1 fc-a1 fc-a1b fc-w2 fc-z2 fc-a2" data-focus="fc-a1 fc-w2 fc-a2">
      <div class="step-kicker">Шаг 3 · ReLU и второй слой</div>
      <h4>ReLU форму не меняет, а слой 2 — это тот же блок с другими числами</h4>
      <div class="math-display" data-tex="\mathbf a^{(1)}=\operatorname{ReLU}(\mathbf z^{(1)})\in\mathbb R^{1\times H_1},\qquad \underbrace{[1,H_1]}_{\mathbf a^{(1)}}\underbrace{[H_1,H_2]}_{\mathbf W^{(2)}}\longrightarrow\underbrace{[1,H_2]}_{\mathbf z^{(2)}}"></div>
      <p>Поэлементная нелинейность просто перекрашивает числа внутри той же формы. А дальше повторяется ровно та же схема: выход предыдущего слоя становится входом следующего, и высота <span class="math-inline" data-tex="\mathbf W^{(2)}"></span> обязана совпасть с <span class="math-inline" data-tex="H_1"></span>.</p>
    </div>
    <div class="step-panel" data-on="fc-a2b fc-w3 fc-s fc-p fc-y fc-loss" data-focus="fc-s fc-p fc-loss">
      <div class="step-kicker">Шаг 4 · выход и loss</div>
      <h4>Softmax не меняет форму, cross-entropy сжимает строку в скаляр</h4>
      <div class="math-display" data-tex="\mathbf s=\mathbf a^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)}\in\mathbb R^{1\times C},\qquad \mathbf p=\operatorname{softmax}(\mathbf s)\in\mathbb R^{1\times C},\qquad \ell\in\mathbb R"></div>
      <p>Последний слой переводит <span class="math-inline" data-tex="H_2"></span> скрытых чисел в <span class="math-inline" data-tex="C"></span> логитов. Softmax нормирует строку и оставляет <span class="math-inline" data-tex="[1,C]"></span>. Первое настоящее изменение размерности на forward — сама потеря: <span class="math-inline" data-tex="[1,C]\to[1,1]"></span>.</p>
    </div>
    <div class="step-panel" data-on="fc-p fc-y fc-d3" data-focus="fc-d3">
      <div class="step-kicker">Шаг 5 · старт backward</div>
      <h4>Сигнал ошибки имеет ту же форму, что вероятности и метки</h4>
      <div class="math-display" data-tex="\boldsymbol\delta^{(3)}=\frac{\partial\ell}{\partial\mathbf s}=\mathbf p-\mathbf y\in\mathbb R^{1\times C}"></div>
      <p>Softmax вместе с cross-entropy дают самое простое возможное начало: обычная разность. Это снова поэлементная операция, было <span class="math-inline" data-tex="[1,C]"></span> и осталось <span class="math-inline" data-tex="[1,C]"></span>.</p>
    </div>
    <div class="step-panel" data-on="fc-a2b fc-d3 fc-gw3 fc-gb3" data-focus="fc-gw3 fc-gb3">
      <div class="step-kicker">Шаг 6 · градиенты последнего слоя</div>
      <h4>Столбец на строку даёт матрицу ровно формы W</h4>
      <div class="math-display" data-tex="d\mathbf W^{(3)}=(\mathbf a^{(2)})^\top\boldsymbol\delta^{(3)}:\qquad \underbrace{[H_2,1]}_{(\mathbf a^{(2)})^\top}\underbrace{[1,C]}_{\boldsymbol\delta^{(3)}}\longrightarrow\underbrace{[H_2,C]}_{d\mathbf W^{(3)}},\qquad d\mathbf b^{(3)}=\boldsymbol\delta^{(3)}"></div>
      <p>Транспонирование разворачивает строку активаций в столбец, и внешнее произведение сразу заполняет всю матрицу: элемент <span class="math-inline" data-tex="(k,c)"></span> — это <span class="math-inline" data-tex="a^{(2)}_k\delta^{(3)}_c"></span>. Для bias вход не нужен вообще, поэтому <span class="math-inline" data-tex="d\mathbf b^{(3)}"></span> — это просто сам сигнал ошибки.</p>
    </div>
    <div class="step-panel" data-on="fc-d3 fc-da2 fc-d2 fc-gw2" data-focus="fc-da2 fc-d2 fc-gw2">
      <div class="step-kicker">Шаг 7 · один шаг назад</div>
      <h4>Транспонированный W возвращает сигнал в форму предыдущего слоя</h4>
      <div class="math-display" data-tex="\underbrace{[1,C]}_{\boldsymbol\delta^{(3)}}\underbrace{[C,H_2]}_{(\mathbf W^{(3)})^\top}\longrightarrow\underbrace{[1,H_2]}_{d\mathbf a^{(2)}},\qquad \boldsymbol\delta^{(2)}=d\mathbf a^{(2)}\odot\mathbb 1[\mathbf z^{(2)}>0]"></div>
      <p>Вперёд шли через <span class="math-inline" data-tex="\mathbf W"></span>, назад идём через <span class="math-inline" data-tex="\mathbf W^\top"></span> — и форма автоматически возвращается к ширине предыдущего слоя. Маска ReLU поэлементная, поэтому <span class="math-inline" data-tex="\boldsymbol\delta^{(2)}"></span> остаётся <span class="math-inline" data-tex="[1,H_2]"></span>, а дальше повторяется тот же приём: <span class="math-inline" data-tex="d\mathbf W^{(2)}=(\mathbf a^{(1)})^\top\boldsymbol\delta^{(2)}"></span>.</p>
    </div>
    <div class="step-panel" data-on="fc-gw3 fc-gw2 fc-batch fc-rule" data-focus="fc-batch fc-rule">
      <div class="step-kicker">Шаг 8 · батч и контроль</div>
      <h4>Батч добавляет ось B, которая сокращается при умножении</h4>
      <div class="math-display" data-tex="d\mathbf W^{(l)}=(\mathbf A^{(l-1)})^\top\boldsymbol\Delta^{(l)}:\qquad \underbrace{[H_{l-1},B]}_{(\mathbf A^{(l-1)})^\top}\underbrace{[B,H_l]}_{\boldsymbol\Delta^{(l)}}\longrightarrow\underbrace{[H_{l-1},H_l]}_{d\mathbf W^{(l)}}"></div>
      <p>На схеме показан слой 2 той же сети, только теперь через него идут сразу три объекта. Формула не изменилась — просто вместо <span class="math-inline" data-tex="1"></span> в оси объектов стоит <span class="math-inline" data-tex="B"></span>, и умножение само суммирует вклады всех примеров батча. Для bias роль суммирования играет строка единиц: <span class="math-inline" data-tex="d\mathbf b^{(l)}=\mathbf 1_B^\top\boldsymbol\Delta^{(l)}"></span>.</p>
      <p>И главное правило, которое ловит почти любую ошибку в backprop: <strong>градиент всегда той же формы, что и параметр</strong>. Если формы разошлись — где-то потеряно транспонирование или суммирование по батчу.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Переключайте шаги кнопками или стрелками клавиатуры. Числовые формы под именами посчитаны для сети 3 → 4 → 2 → 3 и батча из трёх объектов.</p>

### Шпаргалка по формам

<div class="formula-strip">
  <div class="formula-card">
    <span>Forward</span>
    <div class="math-display" data-tex="[1,H_{l-1}]\,[H_{l-1},H_l]\to[1,H_l]"></div>
  </div>
  <div class="formula-card">
    <span>Назад по сигналу</span>
    <div class="math-display" data-tex="[1,H_l]\,[H_l,H_{l-1}]\to[1,H_{l-1}]"></div>
  </div>
  <div class="formula-card">
    <span>Градиент весов</span>
    <div class="math-display" data-tex="[H_{l-1},1]\,[1,H_l]\to[H_{l-1},H_l]"></div>
  </div>
</div>
<p class="shape-note">Все три строки — одно и то же умножение матриц, в котором соседние размерности обязаны совпасть. Меняется только то, что именно стоит слева и справа: вперёд — вход и веса, назад — ошибка и транспонированные веса, в градиенте — транспонированный вход и ошибка.</p>

## Часть 9. От таблицы к PyTorch — три версии одного и того же

<p>
Матричный расчёт мы прошли по шагам. Теперь соберём ту же сеть в код — тремя способами: руками на numpy, слоями-объектами и на PyTorch. Все три считают <em>одни и те же</em> градиенты (те, что были в визуализации выше) и одинаково обучаются. Разница лишь в том, сколько математики мы пишем сами.
</p>

### Данные: та же маленькая сеть 2 → 2 → 1

<p>
Берём ровно тот пример из матричной части, чтобы каждое число можно было сверить: три объекта, два признака, цель — регрессия. В реальных проектах данные читают из файла (путь список → pandas → numpy ровно тот же, что в прошлой статье); здесь впишем их прямо в код.
</p>

<pre>import numpy as np
# 3 объекта, 2 признака; цель y — непрерывное число (регрессия)
X = np.array([[2., 3.],
              [1., 2.],
              [3., 1.]])           # (3, 2)
y = np.array([[5.], [3.], [6.]])   # (3, 1)
# Параметры сети — как в визуализации выше
W1 = np.array([[0.5, -0.3], [0.2, 0.4]])   # (2, 2): вход -> 2 скрытых нейрона
b1 = np.array([[0.1, 0.2]])                 # (1, 2)
W2 = np.array([[1.0], [-0.5]])              # (2, 1): скрытый слой -> выход
c  = np.array([[0.3]])                      # (1, 1)</pre>

### Версия 1. Просто функции на numpy

<p>
«Голая» математика из Частей 3–4: forward прогоняет вход через линейный слой, ReLU и выходной слой; loss — это MSE (с множителем ½ для чистого градиента); backward — то самое цепное правило справа налево. Каждый параметр обновляется одним и тем же правилом.
</p>

<pre>def relu(z):
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
print(yhat.ravel())                      # ≈ [5. 3. 6.] = y</pre>

<div class="callout-blue">
<strong>Проверка форм — лучший друг.</strong> На самой первой итерации (с весами из таблицы выше) этот код считает <code>loss = 5.162</code> и градиенты <code>dW₁ ≈ [[−6.85, 1.48], [−6.07, 2.38]]</code>, <code>dW₂ ≈ [−4.95, −1.39]</code> — ровно те числа, что в матричной визуализации. Форма каждого градиента совпадает с формой его параметра: <code>dW₁</code> как <code>W₁</code> (2×2), <code>dW₂</code> как <code>W₂</code> (2×1). Не сходятся формы — значит, где-то ошибка в backprop.
</div>

### Версия 2. Тот же код, но слоями (мостик к PyTorch)

<p>
Математика не меняется — но теперь каждый слой это объект, который умеет <code>forward</code> (и запоминает вход) и <code>backward</code> (отдаёт градиенты по своим весам и проталкивает градиент дальше назад). Ровно так устроен PyTorch: сеть — это последовательность слоёв, а обучающий цикл снаружи.
</p>

<pre>class Linear:                            # линейный слой: out = X·W + b
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
            layer.step(0.02)</pre>

### Версия 3. PyTorch — backward в одну строку

<p>
Цикл буквально тот же: forward → loss → backward → update. Но градиенты больше не выводим руками — весь блок backward сворачивается в <code>loss.backward()</code>: autograd сам проходит по всем слоям. Здесь это экономит десяток строк; в настоящей сети с миллионами весов — делает обучение вообще возможным. Саму модель опишем через наследование от <code>nn.Module</code>: слои будут явными полями класса, а вычислительная цепочка — методом <code>forward</code>.
</p>

<pre>import torch
import torch.nn as nn

torch.manual_seed(0)

Xt = torch.tensor([[2., 3.], [1., 2.], [3., 1.]])
yt = torch.tensor([[5.], [3.], [6.]])

# MODEL: наследуемся от nn.Module и явно описываем слои
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(2, 2)        # вход [B, 2] -> скрытый слой [B, 2]
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(2, 1)        # скрытый слой [B, 2] -> выход [B, 1]

    def forward(self, x):
        z1 = self.fc1(x)                  # линейная часть первого слоя
        h1 = self.relu(z1)                # нелинейность
        yhat = self.fc2(h1)               # линейный выход для регрессии
        return yhat

net = MLP()
optimizer = torch.optim.SGD(net.parameters(), lr=0.02)

for epoch in range(2000):
    optimizer.zero_grad()                 # обнуляем градиенты прошлого шага
    yhat = net(Xt)                        # FORWARD вызывает MLP.forward(...)
    loss = 0.5 * ((yhat - yt) ** 2).mean()  # LOSS: ½·MSE
    loss.backward()                       # BACKWARD: autograd заполняет .grad
    optimizer.step()                      # UPDATE всех параметров fc1 и fc2

with torch.no_grad():
    yhat = net(Xt)

print(round(loss.item(), 4))              # ≈ 0.0
print(yhat.squeeze().round(decimals=3))   # ≈ tensor([5., 3., 6.])</pre>

<p>
Все три версии обучают одну и ту же сеть и приходят к одному результату: на нашем игрушечном примере loss падает с 5.16 почти до нуля, и сеть точно воспроизводит ответы <code>y = [5, 3, 6]</code>. Разница только в количестве ручной математики — на numpy мы сами вывели каждый градиент; в версии со слоями завернули их в объекты; в PyTorch описываем только <em>что</em> считаем (слои и loss), а <em>как</em> брать производные, autograd берёт на себя. Для бинарной классификации достаточно поменять выходной слой на sigmoid и loss на BCE, для многоклассовой — на softmax и cross-entropy; схема backprop и сам цикл при этом не меняются.
</p>

<div class="two-col">
  <div class="compact-card"><h4>Что меняется с глубиной</h4><p>Добавляются пары <span class="math-inline" data-tex="W^{(l)},b^{(l)}"></span>, промежуточные <span class="math-inline" data-tex="z^{(l)},a^{(l)}"></span> и повторения linear + activation.</p></div>
  <div class="compact-card"><h4>Что не меняется</h4><p>Forward идёт вправо, backward — влево, а оптимизатор обновляет каждый параметр его собственным градиентом.</p></div>
</div>

### Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Полносвязный слой:</strong> <span class="math-inline" data-tex="\mathbf Z=\mathbf X\mathbf W+\mathbf b"></span>; каждый выход использует все входы предыдущего слоя.</li>
  <li><strong>Нелинейность обязательна:</strong> без неё несколько линейных слоёв схлопываются в один.</li>
  <li><strong>Forward:</strong> <span class="math-inline" data-tex="\text{Linear}\to\text{ReLU}\to\text{Linear}\to\text{ReLU}\to\text{Linear}\to\text{softmax}\to\text{loss}"></span>.</li>
  <li><strong>Softmax + cross-entropy:</strong> выходной градиент сокращается до <span class="math-inline" data-tex="(\mathbf P-\mathbf Y)/B"></span> для среднего loss.</li>
  <li><strong>Linear backward:</strong> <span class="math-inline" data-tex="dW=A^\top\Delta"></span>, <span class="math-inline" data-tex="db=\sum_n\Delta_{n,:}"></span>, <span class="math-inline" data-tex="dA=\Delta W^\top"></span>.</li>
  <li><strong>ReLU backward:</strong> градиент умножается на маску <span class="math-inline" data-tex="\mathbb1[Z>0]"></span>.</li>
  <li><strong>Батч:</strong> добавляет строки данным и промежуточным значениям, но не копирует параметры.</li>
  <li><strong>Backpropagation считает</strong> градиенты; <strong>gradient descent обновляет</strong> параметры.</li>
  <li><strong>Проверка размерностей:</strong> форма <span class="math-inline" data-tex="dW^{(l)}"></span> совпадает с <span class="math-inline" data-tex="W^{(l)}"></span>, а форма <span class="math-inline" data-tex="db^{(l)}"></span> — с <span class="math-inline" data-tex="b^{(l)}"></span>.</li>
</ol>

<p>
  Если оставить одну картину, пусть это будет не «нейросеть как большая формула»,
  а <strong>одна карта с двумя направлениями</strong>: значения идут слева направо,
  градиенты возвращаются справа налево. Глубина лишь добавляет повторяющиеся
  участки этой карты.
</p>

<p class="tiny">Все числовые значения иллюстративные и вычислены из одной детерминированной учебной модели. Округление применяется только при отображении.</p>

<script>
(function () {
  'use strict';

  var model = {
    X: [[2, 1], [0.5, 2]],
    Y: [[1, 0], [0, 1]],
    W1: [[0.5, -0.4], [1.0, 0.8]], b1: [0.1, -0.2],
    W2: [[0.6, -0.5], [0.2, 0.9]], b2: [-0.1, 0.2],
    W3: [[1.0, -0.8], [-0.3, 0.5]], b3: [0.0, 0.1],
    eta: 0.1
  };

  function cloneMatrix(A) { return A.map(function (row) { return row.slice(); }); }
  function zeros(rows, cols) { return Array.from({length: rows}, function () { return Array(cols).fill(0); }); }
  function matMul(A, B) {
    return A.map(function (row) {
      return B[0].map(function (_, j) {
        return row.reduce(function (sum, value, i) { return sum + value * B[i][j]; }, 0);
      });
    });
  }
  function addBias(A, b) { return A.map(function (row) { return row.map(function (v, j) { return v + b[j]; }); }); }
  function reluMatrix(A) { return A.map(function (row) { return row.map(function (v) { return Math.max(0, v); }); }); }
  function softmaxRows(A) {
    return A.map(function (row) {
      var m = Math.max.apply(null, row);
      var exps = row.map(function (v) { return Math.exp(v - m); });
      var sum = exps.reduce(function (a, b) { return a + b; }, 0);
      return exps.map(function (v) { return v / sum; });
    });
  }
  function transpose(A) { return A[0].map(function (_, j) { return A.map(function (row) { return row[j]; }); }); }
  function hadamardMask(A, Z) { return A.map(function (row, i) { return row.map(function (v, j) { return Z[i][j] > 0 ? v : 0; }); }); }
  function sumRows(A) { return A[0].map(function (_, j) { return A.reduce(function (s, row) { return s + row[j]; }, 0); }); }
  function subtractScaled(A, dA, eta) { return A.map(function (row, i) { return row.map(function (v, j) { return v - eta * dA[i][j]; }); }); }
  function subtractScaledVector(a, da, eta) { return a.map(function (v, j) { return v - eta * da[j]; }); }

  function forward(X, params) {
    var Z1 = addBias(matMul(X, params.W1), params.b1);
    var A1 = reluMatrix(Z1);
    var Z2 = addBias(matMul(A1, params.W2), params.b2);
    var A2 = reluMatrix(Z2);
    var S = addBias(matMul(A2, params.W3), params.b3);
    var P = softmaxRows(S);
    var losses = P.map(function (row, i) {
      return -model.Y[i].reduce(function (sum, y, j) { return sum + y * Math.log(row[j]); }, 0);
    });
    var loss = losses.reduce(function (a, b) { return a + b; }, 0) / losses.length;
    return {Z1: Z1, A1: A1, Z2: Z2, A2: A2, S: S, P: P, losses: losses, loss: loss};
  }

  function backward(X, Y, params, cache, average) {
    var B = X.length;
    var scale = average ? 1 / B : 1;
    var D3 = cache.P.map(function (row, i) { return row.map(function (p, j) { return (p - Y[i][j]) * scale; }); });
    var dW3 = matMul(transpose(cache.A2), D3);
    var db3 = sumRows(D3);
    var dA2 = matMul(D3, transpose(params.W3));
    var D2 = hadamardMask(dA2, cache.Z2);
    var dW2 = matMul(transpose(cache.A1), D2);
    var db2 = sumRows(D2);
    var dA1 = matMul(D2, transpose(params.W2));
    var D1 = hadamardMask(dA1, cache.Z1);
    var dW1 = matMul(transpose(X), D1);
    var db1 = sumRows(D1);
    return {D3:D3,dW3:dW3,db3:db3,dA2:dA2,D2:D2,dW2:dW2,db2:db2,dA1:dA1,D1:D1,dW1:dW1,db1:db1};
  }

  var params = {W1:cloneMatrix(model.W1),b1:model.b1.slice(),W2:cloneMatrix(model.W2),b2:model.b2.slice(),W3:cloneMatrix(model.W3),b3:model.b3.slice()};
  var batch = forward(model.X, params);
  var batchGrad = backward(model.X, model.Y, params, batch, true);
  var oneX = [model.X[0]], oneY = [model.Y[0]];
  var one = forward(oneX, params);
  one.losses = [-Math.log(one.P[0][0])]; one.loss = one.losses[0];
  var oneGrad = backward(oneX, oneY, params, one, false);
  var newParams = {
    W1: subtractScaled(params.W1, batchGrad.dW1, model.eta), b1: subtractScaledVector(params.b1, batchGrad.db1, model.eta),
    W2: subtractScaled(params.W2, batchGrad.dW2, model.eta), b2: subtractScaledVector(params.b2, batchGrad.db2, model.eta),
    W3: subtractScaled(params.W3, batchGrad.dW3, model.eta), b3: subtractScaledVector(params.b3, batchGrad.db3, model.eta)
  };
  var updated = forward(model.X, newParams);

  function fixed(value, digits) {
    var threshold = Math.pow(10, -digits) / 2;
    if (Math.abs(value) < threshold) value = 0;
    return Number(value).toFixed(digits).replace('-', '\u2212');
  }
  function latexNumber(value, digits) {
    var text = fixed(value, digits);
    return text.charAt(0) === '\u2212' ? '-' + text.slice(1) : text;
  }
  function texVector(v, digits) { return '\\begin{bmatrix}' + v.map(function (x) { return latexNumber(x, digits); }).join('&') + '\\end{bmatrix}'; }
  function texColumn(v, digits) { return '\\begin{bmatrix}' + v.map(function (x) { return latexNumber(x, digits); }).join('\\\\') + '\\end{bmatrix}'; }
  function texMatrix(A, digits) { return '\\begin{bmatrix}' + A.map(function (row) { return row.map(function (x) { return latexNumber(x, digits); }).join('&'); }).join('\\\\') + '\\end{bmatrix}'; }

  var t = {
    forwardInputs: '\\mathbf x=' + texVector(oneX[0],1) + ',\\quad \\mathbf y=' + texVector(oneY[0],0) + ',\\quad \\mathbf W^{(1)}=' + texMatrix(params.W1,1) + ',\\quad \\mathbf b^{(1)}=' + texVector(params.b1,1),
    forwardZ1: '\\mathbf z^{(1)}=' + texVector(oneX[0],1) + texMatrix(params.W1,1) + '+' + texVector(params.b1,1) + '=' + texVector(one.Z1[0],2),
    forwardA1: '\\mathbf a^{(1)}=\\operatorname{ReLU}' + texVector(one.Z1[0],2) + '=' + texVector(one.A1[0],2),
    forwardZ2: '\\mathbf z^{(2)}=' + texVector(one.A1[0],2) + texMatrix(params.W2,1) + '+' + texVector(params.b2,1) + '=' + texVector(one.Z2[0],2),
    forwardA2: '\\mathbf a^{(2)}=\\operatorname{ReLU}' + texVector(one.Z2[0],2) + '=' + texVector(one.A2[0],2),
    forwardS: '\\mathbf s=' + texVector(one.A2[0],2) + texMatrix(params.W3,1) + '+' + texVector(params.b3,1) + '=' + texVector(one.S[0],3),
    forwardP: '\\mathbf p=\\operatorname{softmax}' + texVector(one.S[0],3) + '=' + texVector(one.P[0],4),
    forwardLoss: '\\ell=-\\log(' + latexNumber(one.P[0][0],6) + ')=' + latexNumber(one.loss,6),
    backStart: '\\mathbf p=' + texVector(one.P[0],4) + ',\\quad \\mathbf y=' + texVector(oneY[0],0) + ',\\quad \\mathbf a^{(2)}=' + texVector(one.A2[0],2),
    backD3: '\\boldsymbol\\delta^{(3)}=\\mathbf p-\\mathbf y=' + texVector(oneGrad.D3[0],4),
    backW3: 'd\\mathbf W^{(3)}=' + texColumn(one.A2[0],2) + texVector(oneGrad.D3[0],4) + '=' + texMatrix(oneGrad.dW3,4) + ',\\quad d\\mathbf a^{(2)}=' + texVector(oneGrad.dA2[0],4),
    backD2: '\\boldsymbol\\delta^{(2)}=' + texVector(oneGrad.dA2[0],4) + '\\odot' + texVector(one.Z2[0].map(function(v){return v>0?1:0;}),0) + '=' + texVector(oneGrad.D2[0],4),
    backW2: 'd\\mathbf W^{(2)}=' + texColumn(one.A1[0],2) + texVector(oneGrad.D2[0],4) + '=' + texMatrix(oneGrad.dW2,4) + ',\\quad d\\mathbf a^{(1)}=' + texVector(oneGrad.dA1[0],4),
    backD1: '\\boldsymbol\\delta^{(1)}=' + texVector(oneGrad.dA1[0],4) + '\\odot' + texVector(one.Z1[0].map(function(v){return v>0?1:0;}),0) + '=' + texVector(oneGrad.D1[0],4) + ',\\quad d\\mathbf W^{(1)}=' + texMatrix(oneGrad.dW1,4),
    backAll: 'd\\mathbf W^{(1)}=' + texMatrix(oneGrad.dW1,4) + ',\\quad d\\mathbf W^{(2)}=' + texMatrix(oneGrad.dW2,4) + ',\\quad d\\mathbf W^{(3)}=' + texMatrix(oneGrad.dW3,4),
    batchData: '\\mathbf X=' + texMatrix(model.X,1) + ',\\qquad \\mathbf Y=' + texMatrix(model.Y,0),
    batchForward: '\\mathbf P=' + texMatrix(batch.P,4) + ',\\qquad (\\ell_1,\\ell_2)=(' + latexNumber(batch.losses[0],4) + ',' + latexNumber(batch.losses[1],4) + ')',
    batchLoss: 'L=\\frac{' + latexNumber(batch.losses[0],6) + '+' + latexNumber(batch.losses[1],6) + '}{2}=' + latexNumber(batch.loss,6),
    batchD3: '\\boldsymbol\\Delta^{(3)}=\\frac{\\mathbf P-\\mathbf Y}{2}=' + texMatrix(batchGrad.D3,4),
    batchW3: 'd\\mathbf W^{(3)}=(\\mathbf A^{(2)})^\\top\\boldsymbol\\Delta^{(3)}=' + texMatrix(batchGrad.dW3,4) + ',\\quad d\\mathbf b^{(3)}=' + texVector(batchGrad.db3,4),
    batchAll: 'd\\mathbf W^{(1)}=' + texMatrix(batchGrad.dW1,4) + ',\\quad d\\mathbf W^{(2)}=' + texMatrix(batchGrad.dW2,4) + ',\\quad d\\mathbf W^{(3)}=' + texMatrix(batchGrad.dW3,4),
    updateOld: 'L(\\boldsymbol\\theta)=(' + latexNumber(batch.losses[0],6) + '+' + latexNumber(batch.losses[1],6) + ')/2=' + latexNumber(batch.loss,6),
    updateGrad: 'd\\mathbf W^{(3)}=' + texMatrix(batchGrad.dW3,4) + ',\\qquad d\\mathbf b^{(3)}=' + texVector(batchGrad.db3,4),
    updateNew: '\\mathbf W^{(3)\\prime}=' + texMatrix(params.W3,1) + '-0.1' + texMatrix(batchGrad.dW3,4) + '=' + texMatrix(newParams.W3,4) + ',\\quad \\mathbf b^{(3)\\prime}=' + texVector(newParams.b3,4),
    updateCheck: 'L(\\boldsymbol\\theta)= ' + latexNumber(batch.loss,6) + '\\quad\\longrightarrow\\quad L(\\boldsymbol\\theta\\prime)=' + latexNumber(updated.loss,6)
  };

  function signed(value, digits) {
    var text = latexNumber(value, digits);
    return text.charAt(0) === '-' ? text : '+' + text;
  }
  var etaW3 = batchGrad.dW3.map(function (row) {
    return row.map(function (v) { return v * model.eta; });
  });
  t.batchCellForm = 'z^{(1)}_{2,1}=x_{2,1}W^{(1)}_{1,1}+x_{2,2}W^{(1)}_{2,1}+b^{(1)}_{1}';
  t.batchCellNum = 'z^{(1)}_{2,1}=' + latexNumber(model.X[1][0],1) + '\\cdot' + latexNumber(params.W1[0][0],1)
    + '+' + latexNumber(model.X[1][1],1) + '\\cdot' + latexNumber(params.W1[1][0],1)
    + '+' + latexNumber(params.b1[0],1) + '=' + latexNumber(batch.Z1[1][0],4);
  t.batchDW3cell = 'dW^{(3)}_{1,1}=A^{(2)}_{1,1}\\Delta^{(3)}_{1,1}+A^{(2)}_{2,1}\\Delta^{(3)}_{2,1}='
    + latexNumber(batch.A2[0][0],4) + '\\cdot(' + latexNumber(batchGrad.D3[0][0],4) + ')'
    + '+' + latexNumber(batch.A2[1][0],4) + '\\cdot(' + latexNumber(batchGrad.D3[1][0],4) + ')'
    + '=' + latexNumber(batchGrad.dW3[0][0],4);
  t.updateScaled = '\\eta\\,d\\mathbf W^{(3)}=0.1\\cdot' + texMatrix(batchGrad.dW3,4) + '=' + texMatrix(etaW3,4);
  t.updateCellNum = 'W^{(3)\\prime}_{1,1}=' + latexNumber(params.W3[0][0],1) + '-0.1\\cdot('
    + latexNumber(batchGrad.dW3[0][0],4) + ')=' + latexNumber(newParams.W3[0][0],4);

  function viewVector(v, digits) {
    return '[' + v.map(function (x) { return fixed(x, digits); }).join(', ') + ']';
  }
  var textValues = {
    oneZ1: viewVector(one.Z1[0], 2),
    oneA1: viewVector(one.A1[0], 2),
    oneZ2: viewVector(one.Z2[0], 2),
    oneA2: viewVector(one.A2[0], 2),
    oneS: viewVector(one.S[0], 3),
    oneP: viewVector(one.P[0], 4),
    oneLoss: fixed(one.loss, 6),
    backA1: 'a⁽¹⁾ = ' + viewVector(one.A1[0], 2),
    backZ1: 'z⁽¹⁾ = ' + viewVector(one.Z1[0], 2),
    backA2: 'a⁽²⁾ = ' + viewVector(one.A2[0], 2),
    backZ2: 'z⁽²⁾ = ' + viewVector(one.Z2[0], 2),
    backP: 'p = ' + viewVector(one.P[0], 4),
    backLoss: 'ℓ = ' + fixed(one.loss, 6),
    batchP1: viewVector(batch.P[0], 4),
    batchP2: viewVector(batch.P[1], 4),
    batchLoss1: 'ℓ₁ = ' + fixed(batch.losses[0], 4),
    batchLoss2: 'ℓ₂ = ' + fixed(batch.losses[1], 4),
    oldLoss: 'L = ' + fixed(batch.loss, 6),
    newLoss: 'L′ = ' + fixed(updated.loss, 6)
  };

  function renderDerivedText() {
    document.querySelectorAll('[data-mlp-text]').forEach(function (node) {
      var key = node.getAttribute('data-mlp-text');
      node.textContent = textValues[key] || key;
    });
  }

  function renderDerivedMath() {
    document.querySelectorAll('[data-mlp-tex]').forEach(function (node) {
      var key = node.getAttribute('data-mlp-tex');
      var source = t[key] || key;
      node.setAttribute('data-tex', source);
      try {
        katex.render(source, node, {throwOnError:false, displayMode:true, strict:'ignore'});
        node.dataset.rendered = '1';
      } catch (error) { node.textContent = source; }
    });
  }

  function initStages() {
    document.querySelectorAll('.stage').forEach(function (stage) {
      if (stage.dataset.ready === '1') return;
      var svg = stage.querySelector('.stage-figure svg');
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
        panels.forEach(function (node, index) { node.classList.toggle('active', index === cur); });
        ticks.forEach(function (tick, index) { tick.classList.toggle('done', index <= cur); });
        counter.textContent = (cur + 1) + ' из ' + panels.length;
        prev.disabled = cur === 0;
        next.textContent = cur === panels.length - 1 ? 'Сначала ↺' : 'Далее →';
      }
      function move(delta) {
        var target = cur + delta;
        if (target < 0) return;
        if (target >= panels.length) target = 0;
        cur = target; render();
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

  function rerenderNode(node, tex) {
    node.setAttribute('data-tex', tex);
    try { katex.render(tex, node, {throwOnError:false,displayMode:true,strict:'ignore'}); } catch (error) { node.textContent = tex; }
  }

  function initRelu() {
    var range = document.getElementById('mlpReluRange');
    if (!range) return;
    var point = document.getElementById('mlp-relu-point');
    var guide = document.getElementById('mlp-relu-guide');
    var state = document.getElementById('mlp-relu-state');
    var svgText = document.getElementById('mlp-relu-value-svg');
    var valueText = document.getElementById('mlpReluValue');
    var equation = document.getElementById('mlpReluEquation');
    var explain = document.getElementById('mlpReluExplain');
    function render() {
      var z = Number(range.value), a = Math.max(0, z);
      var x = 350 + z * (275 / 3);
      var y = 330 - a * (255 / 3);
      point.setAttribute('cx', x); point.setAttribute('cy', y);
      guide.setAttribute('x1', x); guide.setAttribute('x2', x); guide.setAttribute('y1', 330); guide.setAttribute('y2', y);
      state.textContent = z > 0 ? 'сигнал проходит' : (z < 0 ? 'сигнал закрыт' : 'граница ReLU');
      svgText.textContent = 'z = ' + fixed(z,2) + ' → a = ' + fixed(a,2);
      valueText.textContent = fixed(a,2);
      explain.textContent = z > 0 ? 'Положительное значение проходит дальше без изменения.' : (z < 0 ? 'Отрицательное значение превращается в ноль.' : 'В точке ноль реализация выбирает подградиент.');
      rerenderNode(equation, '\\operatorname{ReLU}(' + latexNumber(z,2) + ')=' + latexNumber(a,2));
    }
    range.addEventListener('input', render); render();
  }

  function initLoss() {
    var range = document.getElementById('mlpLossRange');
    if (!range) return;
    var barTrue = document.getElementById('mlp-loss-bar-true');
    var barOther = document.getElementById('mlp-loss-bar-other');
    var pTrueText = document.getElementById('mlp-loss-ptrue');
    var pOtherText = document.getElementById('mlp-loss-pother');
    var number = document.getElementById('mlp-loss-number');
    var value = document.getElementById('mlpLossValue');
    var equation = document.getElementById('mlpLossEquation');
    var explain = document.getElementById('mlpLossExplain');
    function setBar(rect, p) { var h = p * 250; rect.setAttribute('y', 330-h); rect.setAttribute('height', h); }
    function render() {
      var p = Number(range.value), q = 1-p, loss = -Math.log(p);
      setBar(barTrue,p); setBar(barOther,q);
      pTrueText.textContent = fixed(p,2); pTrueText.setAttribute('y', Math.max(72, 330-p*250-12));
      pOtherText.textContent = fixed(q,2); pOtherText.setAttribute('y', Math.max(72, 330-q*250-12));
      number.textContent = fixed(loss,3); value.textContent = fixed(loss,3);
      explain.textContent = p >= .75 ? 'Модель уверена в верном классе, поэтому штраф мал.' : (p >= .5 ? 'Верный класс лидирует, но уверенность пока невысока.' : 'Модель отдаёт больше вероятности неверному классу, поэтому штраф быстро растёт.');
      rerenderNode(equation, '\\ell=-\\log(' + latexNumber(p,2) + ')=' + latexNumber(loss,3));
    }
    range.addEventListener('input', render); render();
  }

  function boot() {
    renderDerivedText();
    renderDerivedMath();
    initStages();
    initRelu();
    initLoss();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
</script>
