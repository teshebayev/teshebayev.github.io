



<p class="lead">
  Свёрточный слой — это полносвязный слой, который смотрит не на всю картинку, а на окно
  3 × 3, и прикладывается одними и теми же весами ко всем окнам. Если выложить окна строками,
  свёртка превращается в одно умножение матриц — и прямой, и обратный проход CNN читаются теми
  же формулами, что у многослойного перцептрона, плюс одно новое правило для пулинга.
</p>

<p>
  Статья устроена так же, как разборы трансформера, полносвязной и рекуррентной сетей по формам
  матриц: к каждой части — сцена, где тензоры нарисованы блоками без чисел, и сразу за ней «Те же
  шаги в числах». Сквозной пример — две картинки 6 × 6 (вертикальная и горизонтальная полоса) и
  сеть Conv 3 × 3 (2 канала) → ReLU → MaxPool 2 × 2 → Linear 8 → 2, всего 38 параметров. В конце —
  обратный проход через классификатор, пулинг и саму свёртку, проверка градиента и обучение.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Полносвязный слой</strong>
    <p>Нужно помнить <span class="math-inline" data-tex="Z = XW + b"></span>, ReLU, softmax и три формулы обратного прохода линейного слоя.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Две полосы 6 × 6</strong>
    <p>B = 2 картинки, 1 канал, 2 ядра 3 × 3, пулинг 2 × 2, 2 класса; веса случайные.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>CNN без чёрных ящиков</strong>
    <p>Вы сможете назвать форму каждого тензора от <code>[B × C × H × W]</code> до потери и вывести градиент ядра через im2col.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#73B222"></i>X — пиксели</span>
  <span><i style="background:#7B4AB5"></i>K — ядра и карты признаков</span>
  <span><i style="background:#3576C0"></i>после пулинга и признаки F</span>
  <span><i style="background:#C29E08"></i>W — классификатор</span>
  <span><i style="background:#E88919"></i>P — вероятности</span>
  <span><i style="background:#C30B0A"></i>градиенты и проблемы</span>
</div>
<p class="tiny">Тёмный блок — обучаемые веса, светлый блок того же цвета — то, что пересчитывается на каждом батче. Ось каналов нарисована листами позади основного блока. Картинки показаны пикселями: чем ярче зелёный, тем больше значение.</p>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не на всю
  схему сразу, а только на яркую часть. Слева в каждой сцене форм — карта сети: красная рамка
  показывает, какой блок разбирается сейчас. Стрелки на клавиатуре работают, когда сцена в фокусе.
</div>


## Часть 1. Общая схема: от пикселей до класса

<p>
  Свёрточная сеть делится на две части. Свёрточная — несколько блоков «свёртка → ReLU → пулинг» —
  превращает картинку в набор признаков, сохраняя её пространственное устройство. Классификатор —
  обычная полносвязная сеть — получает эти признаки строкой и выдаёт вероятности классов.
</p>
<p>У нас один свёрточный блок и один линейный слой: минимальная сеть, в которой есть всё.</p>
<div class="stage" id="stage-ar" tabindex="0">
  <div class="stage-figure">
<svg id="ar" viewBox="0 0 960 560" role="img" aria-label="Свёрточная сеть: картинка, свёртка, ReLU, пулинг, выпрямление, линейный слой, softmax">
<style>
  #ar { font-family: Helvetica, Arial, sans-serif; }
  #ar .cap { font-size: 13px; fill: #5E5850; }
  #ar .lbl { font-size: 16px; fill: #111111; }
  #ar .legend { font-size: 13px; fill: #5E5850; }
  #ar .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #ar .grid { stroke: #ffffff; stroke-width: 1.35; }
  #ar .dim { font-size: 13px; fill: #5E5850; }
  #ar .nm { font-size: 16px; font-weight: 800; }
  #ar .op { font-size: 23px; fill: #5E5850; }
  #ar .arw { font-size: 12px; fill: #5E5850; }
  #ar .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="ar-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="ar-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="ar-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="ar-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g data-key="img"><rect x="40" y="190" width="132" height="132" fill="#FFFFFF" stroke="#C9C2B8"/><rect x="84.0" y="190.0" width="22" height="22" fill="#73B222" opacity="0.92"/><rect x="106.0" y="190.0" width="22" height="22" fill="#73B222" opacity="0.49"/><rect x="84.0" y="212.0" width="22" height="22" fill="#73B222" opacity="1.00"/><rect x="106.0" y="212.0" width="22" height="22" fill="#73B222" opacity="0.57"/><rect x="84.0" y="234.0" width="22" height="22" fill="#73B222" opacity="0.83"/><rect x="106.0" y="234.0" width="22" height="22" fill="#73B222" opacity="0.41"/><rect x="84.0" y="256.0" width="22" height="22" fill="#73B222" opacity="1.00"/><rect x="106.0" y="256.0" width="22" height="22" fill="#73B222" opacity="0.66"/><rect x="84.0" y="278.0" width="22" height="22" fill="#73B222" opacity="0.74"/><rect x="106.0" y="278.0" width="22" height="22" fill="#73B222" opacity="0.57"/><rect x="84.0" y="300.0" width="22" height="22" fill="#73B222" opacity="0.92"/><rect x="106.0" y="300.0" width="22" height="22" fill="#73B222" opacity="0.49"/><line x1="62" y1="190" x2="62" y2="322" stroke="#E4E1D7" stroke-width="0.8"/><line x1="84" y1="190" x2="84" y2="322" stroke="#E4E1D7" stroke-width="0.8"/><line x1="106" y1="190" x2="106" y2="322" stroke="#E4E1D7" stroke-width="0.8"/><line x1="128" y1="190" x2="128" y2="322" stroke="#E4E1D7" stroke-width="0.8"/><line x1="150" y1="190" x2="150" y2="322" stroke="#E4E1D7" stroke-width="0.8"/><line x1="40" y1="212" x2="172" y2="212" stroke="#E4E1D7" stroke-width="0.8"/><line x1="40" y1="234" x2="172" y2="234" stroke="#E4E1D7" stroke-width="0.8"/><line x1="40" y1="256" x2="172" y2="256" stroke="#E4E1D7" stroke-width="0.8"/><line x1="40" y1="278" x2="172" y2="278" stroke="#E4E1D7" stroke-width="0.8"/><line x1="40" y1="300" x2="172" y2="300" stroke="#E4E1D7" stroke-width="0.8"/><text x="106.0" y="178.0" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="700">картинка 6 × 6</text></g><g data-key="conv"><rect x="62.0" y="212.0" width="66.0" height="66.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><path d="M 178.0 250.0 L 240.0 200.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><path d="M 178.0 250.0 L 240.0 320.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="205.0" y="232.0" font-size="12" fill="#5E5850" text-anchor="middle">ядро 3×3</text><g><rect x="250.0" y="150.0" width="88.0" height="88.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="272.0" y1="150.0" x2="272.0" y2="238.0" class="grid" opacity=".75"/><line x1="294.0" y1="150.0" x2="294.0" y2="238.0" class="grid" opacity=".75"/><line x1="316.0" y1="150.0" x2="316.0" y2="238.0" class="grid" opacity=".75"/><line x1="250.0" y1="172.0" x2="338.0" y2="172.0" class="grid" opacity=".75"/><line x1="250.0" y1="194.0" x2="338.0" y2="194.0" class="grid" opacity=".75"/><line x1="250.0" y1="216.0" x2="338.0" y2="216.0" class="grid" opacity=".75"/></g><g><rect x="250.0" y="280.0" width="88.0" height="88.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="272.0" y1="280.0" x2="272.0" y2="368.0" class="grid" opacity=".75"/><line x1="294.0" y1="280.0" x2="294.0" y2="368.0" class="grid" opacity=".75"/><line x1="316.0" y1="280.0" x2="316.0" y2="368.0" class="grid" opacity=".75"/><line x1="250.0" y1="302.0" x2="338.0" y2="302.0" class="grid" opacity=".75"/><line x1="250.0" y1="324.0" x2="338.0" y2="324.0" class="grid" opacity=".75"/><line x1="250.0" y1="346.0" x2="338.0" y2="346.0" class="grid" opacity=".75"/></g><text x="294.0" y="142.0" font-size="12" fill="#5E5850" text-anchor="middle">канал 1</text><text x="294.0" y="272.0" font-size="12" fill="#5E5850" text-anchor="middle">канал 2</text><text x="294.0" y="395.0" font-size="12" fill="#7B4AB5" text-anchor="middle" font-weight="700">2 ядра → 2 карты 4 × 4</text></g><g data-key="relu"><rect x="295" y="151" width="20" height="20" fill="#D9D5CC" rx="1"/><rect x="317" y="151" width="20" height="20" fill="#D9D5CC" rx="1"/><rect x="295" y="173" width="20" height="20" fill="#D9D5CC" rx="1"/><rect x="317" y="173" width="20" height="20" fill="#D9D5CC" rx="1"/><rect x="295" y="195" width="20" height="20" fill="#D9D5CC" rx="1"/><rect x="317" y="195" width="20" height="20" fill="#D9D5CC" rx="1"/><rect x="295" y="217" width="20" height="20" fill="#D9D5CC" rx="1"/><rect x="317" y="217" width="20" height="20" fill="#D9D5CC" rx="1"/><text x="294.0" y="414.0" font-size="12" fill="#5E5850" text-anchor="middle">ReLU: серые клетки — ноль</text></g><g data-key="pool"><path d="M 342.0 194.0 L 410.0 194.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><path d="M 342.0 324.0 L 410.0 324.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="376.0" y="184.0" font-size="12" fill="#5E5850" text-anchor="middle">max 2×2</text><g><rect x="414.0" y="172.0" width="44.0" height="44.0" rx="2" fill="#3576C0" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="436.0" y1="172.0" x2="436.0" y2="216.0" class="grid" opacity=".75"/><line x1="414.0" y1="194.0" x2="458.0" y2="194.0" class="grid" opacity=".75"/></g><g><rect x="414.0" y="302.0" width="44.0" height="44.0" rx="2" fill="#3576C0" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="436.0" y1="302.0" x2="436.0" y2="346.0" class="grid" opacity=".75"/><line x1="414.0" y1="324.0" x2="458.0" y2="324.0" class="grid" opacity=".75"/></g><text x="436.0" y="164.0" font-size="12" fill="#5E5850" text-anchor="middle">2 × 2</text></g><g data-key="flat"><path d="M 462.0 194.0 L 540.0 170.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><path d="M 462.0 324.0 L 540.0 260.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><g><rect x="546.0" y="130.0" width="22.0" height="176.0" rx="2" fill="#3576C0" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="546.0" y1="152.0" x2="568.0" y2="152.0" class="grid" opacity=".75"/><line x1="546.0" y1="174.0" x2="568.0" y2="174.0" class="grid" opacity=".75"/><line x1="546.0" y1="196.0" x2="568.0" y2="196.0" class="grid" opacity=".75"/><line x1="546.0" y1="218.0" x2="568.0" y2="218.0" class="grid" opacity=".75"/><line x1="546.0" y1="240.0" x2="568.0" y2="240.0" class="grid" opacity=".75"/><line x1="546.0" y1="262.0" x2="568.0" y2="262.0" class="grid" opacity=".75"/><line x1="546.0" y1="284.0" x2="568.0" y2="284.0" class="grid" opacity=".75"/></g><text x="557.0" y="122.0" font-size="12" fill="#5E5850" text-anchor="middle">8 чисел</text></g><g data-key="lin"><line x1="568" y1="141" x2="702" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="141" x2="702" y2="310" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="163" x2="702" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="163" x2="702" y2="310" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="185" x2="702" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="185" x2="702" y2="310" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="207" x2="702" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="207" x2="702" y2="310" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="229" x2="702" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="229" x2="702" y2="310" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="251" x2="702" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="251" x2="702" y2="310" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="273" x2="702" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="273" x2="702" y2="310" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="295" x2="702" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="568" y1="295" x2="702" y2="310" stroke="#B9B3A8" stroke-width="1"/><circle cx="722" cy="230" r="20" fill="#FFFFFF" stroke="#C29E08" stroke-width="2.2"/><text x="722.0" y="235.0" font-size="13" fill="#111111" text-anchor="middle">z₁</text><circle cx="722" cy="310" r="20" fill="#FFFFFF" stroke="#C29E08" stroke-width="2.2"/><text x="722.0" y="315.0" font-size="13" fill="#111111" text-anchor="middle">z₂</text><text x="635.0" y="420.0" font-size="12" fill="#A5850A" text-anchor="middle" font-weight="700">Linear 8 → 2</text></g><g data-key="sm"><rect x="776" y="200" width="170" height="140" rx="10" fill="#FEF4EA" stroke="#E88919" stroke-width="1.6"/><text x="861.0" y="222.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800">softmax</text><path d="M 744.0 230.0 L 774.0 250.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="861.0" y="255.0" font-size="13" fill="#111111" text-anchor="middle">вертикальная</text><path d="M 744.0 310.0 L 774.0 310.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="861.0" y="315.0" font-size="13" fill="#111111" text-anchor="middle">горизонтальная</text><rect x="806" y="370" width="110" height="40" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.6"/><text x="861.0" y="395.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800">потеря L</text><path d="M 861.0 342.0 L 861.0 368.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/></g><g data-key="flow" data-only="1"><path d="M 40.0 490.0 L 930.0 490.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#ar-fw)"/><text x="485.0" y="480.0" font-size="13" fill="#4E9A38" text-anchor="middle">прямой проход: картинка входит слева, распределение по классам выходит справа</text></g><text x="20.0" y="548.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">зелёное — пиксели · фиолетовое — карты признаков · синее — после пулинга · жёлтое — классификатор</text>
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
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>Картинка — таблица пикселей</h4>
      <p>Серая картинка 6 × 6: вертикальная полоса. Для сети это 36 чисел от 0 до 1, но важно не только какие это числа, а какие из них соседи.</p>
    </div>
    <div class="step-panel" data-on="img conv" data-focus="conv">
      <div class="step-kicker">Шаг 2 · свёртка</div>
      <h4>Окно 3 × 3 скользит по картинке</h4>
      <p>Одно маленькое ядро из 9 весов прикладывается к каждому окну 3 × 3 и выдаёт одно число. 16 окон — карта 4 × 4. Два разных ядра — две карты, два <em>канала</em>.</p>
    </div>
    <div class="step-panel" data-on="img conv relu" data-focus="relu">
      <div class="step-kicker">Шаг 3 · нелинейность</div>
      <h4>ReLU поэлементно</h4>
      <p>Как в полносвязной сети: отрицательное — в ноль. У первого канала справа от полосы ядро отвечает минусом, эти клетки гаснут.</p>
    </div>
    <div class="step-panel" data-on="conv relu pool" data-focus="pool">
      <div class="step-kicker">Шаг 4 · пулинг</div>
      <h4>Из каждого квадрата 2 × 2 — максимум</h4>
      <p>MaxPool уменьшает карту вдвое по каждой стороне и оставляет самый сильный отклик в каждой области. Параметров у него нет.</p>
    </div>
    <div class="step-panel" data-on="pool flat lin" data-focus="flat lin">
      <div class="step-kicker">Шаг 5 · классификатор</div>
      <h4>Выпрямить и отдать полносвязному слою</h4>
      <p>Две карты 2 × 2 выстраиваются в строку из 8 чисел, дальше — обычный линейный слой на 2 класса, как в статье про полносвязную сеть.</p>
    </div>
    <div class="step-panel" data-on="img conv relu pool flat lin sm flow" data-focus="flow">
      <div class="step-kicker">Шаг 6 · целиком</div>
      <h4>38 параметров</h4>
      <p>18 весов в двух ядрах, 2 смещения свёртки, 16 весов и 2 смещения линейного слоя. Дальше статья разбирает каждый блок в форме тензоров — с батчем из двух картинок.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Сначала — карта всего числового примера: какие блоки идут друг за другом, что течёт между ними и какой формы.</p>
<div class="stage" id="stage-arn" tabindex="0">
  <div class="stage-figure">
<svg id="arn" viewBox="0 0 960 500" role="img" aria-label="Карта пайплайна свёрточной сети с размерностями">
<style>
  #arn { font-family: Helvetica, Arial, sans-serif; }
  #arn .cap { font-size: 13px; fill: #5E5850; }
  #arn .lbl { font-size: 16px; fill: #111111; }
  #arn .legend { font-size: 13px; fill: #5E5850; }
  #arn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #arn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #arn .dim { font-size: 13px; fill: #5E5850; }
  #arn .nm { font-size: 16px; font-weight: 800; }
  #arn .op { font-size: 23px; fill: #5E5850; }
  #arn .arw { font-size: 12px; fill: #5E5850; }
  #arn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="arn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="arn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="arn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="arn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Пайплайн с размерностями: где какая матрица</text><g data-key="c0"><rect x="28" y="70" width="56" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="56" y="150" transform="rotate(-90 56 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Вход X</text></g><g data-key="c1"><rect x="144" y="70" width="56" height="150" rx="10" fill="#F4EFFA" stroke="#7B4AB5" stroke-width="1.8"/><text x="172" y="150" transform="rotate(-90 172 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Conv 3×3</text><rect x="118" y="234" width="108" height="50" rx="7" fill="#F4EFFA" stroke="#7B4AB5" stroke-width="1.4"/><text x="172.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">K [2×1×3×3]</text><text x="172.0" y="270.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">b_c [2]</text></g><g data-key="c2"><rect x="260" y="70" width="56" height="150" rx="10" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.8"/><text x="288" y="150" transform="rotate(-90 288 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">ReLU</text><rect x="234" y="234" width="108" height="32" rx="7" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.4"/><text x="288.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c3"><rect x="376" y="70" width="56" height="150" rx="10" fill="#EEF4FB" stroke="#3576C0" stroke-width="1.8"/><text x="404" y="150" transform="rotate(-90 404 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">MaxPool 2×2</text><rect x="350" y="234" width="108" height="32" rx="7" fill="#EEF4FB" stroke="#3576C0" stroke-width="1.4"/><text x="404.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c4"><rect x="492" y="70" width="56" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="520" y="150" transform="rotate(-90 520 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Flatten</text><rect x="466" y="234" width="108" height="32" rx="7" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.4"/><text x="520.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c5"><rect x="608" y="70" width="56" height="150" rx="10" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.8"/><text x="636" y="150" transform="rotate(-90 636 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear</text><rect x="582" y="234" width="108" height="32" rx="7" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.4"/><text x="636.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W [8×2] · b [2]</text></g><g data-key="c6"><rect x="724" y="70" width="56" height="150" rx="10" fill="#FEF4EA" stroke="#E88919" stroke-width="1.8"/><text x="752" y="150" transform="rotate(-90 752 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Softmax</text><rect x="698" y="234" width="108" height="32" rx="7" fill="#FEF4EA" stroke="#E88919" stroke-width="1.4"/><text x="752.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c7"><rect x="840" y="70" width="56" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="868" y="150" transform="rotate(-90 868 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Cross-Entropy</text></g><path d="M 87.0 145.0 L 141.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="114.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">X</text><text x="114.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×1×6×6]</text><path d="M 203.0 145.0 L 257.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="230.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z</text><text x="230.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2×4×4]</text><path d="M 319.0 145.0 L 373.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="346.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">A</text><text x="346.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2×4×4]</text><path d="M 435.0 145.0 L 489.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="462.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Pₚ</text><text x="462.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2×2×2]</text><path d="M 551.0 145.0 L 605.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="578.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">F</text><text x="578.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×8]</text><path d="M 667.0 145.0 L 721.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="694.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z_y</text><text x="694.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2]</text><path d="M 783.0 145.0 L 837.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="810.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">P</text><text x="810.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2]</text><path d="M 899.0 145.0 L 948.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="923.5" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">L</text><text x="923.5" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[1]</text><g data-key="yy"><path d="M 868.0 320.0 L 868.0 224.0" fill="none" stroke="#5E5850" stroke-width="1.6" marker-end="url(#arn-arw)"/><text x="868.0" y="338.0" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="700">Y [2 × 2]</text><text x="868.0" y="354.0" font-size="12" fill="#5E5850" text-anchor="middle">one-hot</text></g><g data-key="par"><text x="150.0" y="396.0" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">где живут 38 параметров</text><rect x="150" y="410" width="252" height="34" rx="3" fill="#7B4AB5" opacity="0.85"/><text x="276.0" y="432.0" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="800">K 18</text><rect x="402" y="410" width="28" height="34" rx="3" fill="#5A3590" opacity="0.85"/><text x="416.0" y="432.0" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="800">b_c</text><rect x="430" y="410" width="224" height="34" rx="3" fill="#C29E08" opacity="0.85"/><text x="542.0" y="432.0" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="800">W 16</text><rect x="654" y="410" width="28" height="34" rx="3" fill="#A5850A" opacity="0.85"/><text x="668.0" y="432.0" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="800">b</text><text x="692.0" y="432.0" font-size="15" fill="#111111" text-anchor="start" font-weight="800">= 38</text><text x="150.0" y="470.0" font-size="13" fill="#5E5850" text-anchor="start">у свёрточного слоя всего 20 параметров — на любой размер картинки</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="c0 c1" data-focus="c1">
      <div class="step-kicker">Шаг 1 · свёртка</div>
      <h4>Четыре оси: объект, канал, высота, ширина</h4>
      <p>Батч — две картинки с одним каналом: <code>X [2 × 1 × 6 × 6]</code>. Свёртка с двумя ядрами 3 × 3 даёт <code>Z [2 × 2 × 4 × 4]</code>: каналов стало 2, сторона уменьшилась на K − 1 = 2.</p>
    </div>
    <div class="step-panel" data-on="c1 c2" data-focus="c2">
      <div class="step-kicker">Шаг 2 · ReLU</div>
      <h4>Форма та же</h4>
      <p>Поэлементная нелинейность, как в полносвязной сети.</p>
    </div>
    <div class="step-panel" data-on="c2 c3" data-focus="c3">
      <div class="step-kicker">Шаг 3 · пулинг</div>
      <h4>Сторона делится на 2</h4>
      <p><code>[2 × 2 × 4 × 4] → [2 × 2 × 2 × 2]</code>. Весов нет.</p>
    </div>
    <div class="step-panel" data-on="c3 c4 c5" data-focus="c4 c5">
      <div class="step-kicker">Шаг 4 · выпрямление и линейный слой</div>
      <h4>Тензор становится матрицей</h4>
      <p>Flatten склеивает оси канала и пространства: <code>[2 × 2 × 2 × 2] → [2 × 8]</code>. Дальше — полносвязный слой <code>[8 × 2]</code>.</p>
    </div>
    <div class="step-panel" data-on="c5 c6 c7 yy" data-focus="c6 c7">
      <div class="step-kicker">Шаг 5 · выход и потеря</div>
      <h4>Два класса, одна потеря</h4>
      <p>Softmax по строке и средняя кросс-энтропия. На нашем батче L = 0.6772 — почти ln 2 = 0.6931.</p>
    </div>
    <div class="step-panel" data-on="c1 c5 par" data-focus="par">
      <div class="step-kicker">Шаг 6 · параметры</div>
      <h4>38 чисел</h4>
      <p>Двадцать живут в свёрточном слое, восемнадцать — в классификаторе. Число весов свёртки не зависит от размера картинки — только от размера ядра и числа каналов.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<p class="tiny">Числовая модель одна на всю статью: две картинки 6 × 6 с неровными полосами, Conv2d(1 → 2, 3 × 3), ReLU, MaxPool 2 × 2, Linear 8 → 2, 38 параметров. Веса взяты из нормального распределения (numpy default_rng(78)), округлены до десятых и не обучены. Все числа посчитаны numpy и округлены при выводе.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> CNN — это свёрточные блоки, которые меняют каналы и пространство <code>[C × H × W]</code>, и полносвязный классификатор после выпрямления; ось батча B не меняется нигде.
</div>

---


## Часть 2. Вход: картинка как тензор

<p>
  У полносвязной сети объект — строка. У свёрточной — тензор с пространственными осями: высота,
  ширина и канал. Батч картинок имеет четыре оси:
</p>
<div class="math-display" data-tex="X \in \mathbb{R}^{B \times C \times H \times W}, \qquad B = 2,\ C = 1,\ H = W = 6"></div>

<p>Порядок осей <code>[B × C × H × W]</code> — соглашение PyTorch; в TensorFlow канал по умолчанию последний.</p>
<div class="stage" id="stage-in" tabindex="0">
  <div class="stage-figure">
<svg id="in" viewBox="0 0 960 620" role="img" aria-label="Картинка как тензор: батч, каналы, высота, ширина">
<style>
  #in { font-family: Helvetica, Arial, sans-serif; }
  #in .cap { font-size: 13px; fill: #5E5850; }
  #in .lbl { font-size: 16px; fill: #111111; }
  #in .legend { font-size: 13px; fill: #5E5850; }
  #in .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #in .grid { stroke: #ffffff; stroke-width: 1.35; }
  #in .dim { font-size: 13px; fill: #5E5850; }
  #in .nm { font-size: 16px; font-weight: 800; }
  #in .op { font-size: 23px; fill: #5E5850; }
  #in .arw { font-size: 12px; fill: #5E5850; }
  #in .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="in-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="in-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="in-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="in-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="296" width="190" height="152" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="372.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 372)">свёрточный блок</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 356 L 125 338" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 304 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#in-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Conv 3×3</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#8A857C" text-anchor="middle">MaxPool 2×2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#C30B0A" text-anchor="middle">Вход X</text><rect x="34" y="456" width="182" height="44" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="img"><rect x="300" y="110" width="144" height="144" fill="#FFFFFF" stroke="#C9C2B8"/><rect x="348.0" y="110.0" width="24" height="24" fill="#73B222" opacity="0.92"/><rect x="372.0" y="110.0" width="24" height="24" fill="#73B222" opacity="0.49"/><rect x="348.0" y="134.0" width="24" height="24" fill="#73B222" opacity="1.00"/><rect x="372.0" y="134.0" width="24" height="24" fill="#73B222" opacity="0.57"/><rect x="348.0" y="158.0" width="24" height="24" fill="#73B222" opacity="0.83"/><rect x="372.0" y="158.0" width="24" height="24" fill="#73B222" opacity="0.41"/><rect x="348.0" y="182.0" width="24" height="24" fill="#73B222" opacity="1.00"/><rect x="372.0" y="182.0" width="24" height="24" fill="#73B222" opacity="0.66"/><rect x="348.0" y="206.0" width="24" height="24" fill="#73B222" opacity="0.74"/><rect x="372.0" y="206.0" width="24" height="24" fill="#73B222" opacity="0.57"/><rect x="348.0" y="230.0" width="24" height="24" fill="#73B222" opacity="0.92"/><rect x="372.0" y="230.0" width="24" height="24" fill="#73B222" opacity="0.49"/><line x1="324" y1="110" x2="324" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="348" y1="110" x2="348" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="372" y1="110" x2="372" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="396" y1="110" x2="396" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="420" y1="110" x2="420" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="134" x2="444" y2="134" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="158" x2="444" y2="158" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="182" x2="444" y2="182" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="206" x2="444" y2="206" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="230" x2="444" y2="230" stroke="#E4E1D7" stroke-width="0.8"/><rect x="480" y="110" width="144" height="144" fill="#FFFFFF" stroke="#C9C2B8"/><rect x="480.0" y="158.0" width="24" height="24" fill="#73B222" opacity="0.41"/><rect x="504.0" y="158.0" width="24" height="24" fill="#73B222" opacity="0.57"/><rect x="528.0" y="158.0" width="24" height="24" fill="#73B222" opacity="0.49"/><rect x="552.0" y="158.0" width="24" height="24" fill="#73B222" opacity="0.66"/><rect x="576.0" y="158.0" width="24" height="24" fill="#73B222" opacity="0.49"/><rect x="600.0" y="158.0" width="24" height="24" fill="#73B222" opacity="0.57"/><rect x="480.0" y="182.0" width="24" height="24" fill="#73B222" opacity="0.83"/><rect x="504.0" y="182.0" width="24" height="24" fill="#73B222" opacity="1.00"/><rect x="528.0" y="182.0" width="24" height="24" fill="#73B222" opacity="0.92"/><rect x="552.0" y="182.0" width="24" height="24" fill="#73B222" opacity="1.00"/><rect x="576.0" y="182.0" width="24" height="24" fill="#73B222" opacity="0.74"/><rect x="600.0" y="182.0" width="24" height="24" fill="#73B222" opacity="0.92"/><line x1="504" y1="110" x2="504" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="528" y1="110" x2="528" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="552" y1="110" x2="552" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="576" y1="110" x2="576" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="600" y1="110" x2="600" y2="254" stroke="#E4E1D7" stroke-width="0.8"/><line x1="480" y1="134" x2="624" y2="134" stroke="#E4E1D7" stroke-width="0.8"/><line x1="480" y1="158" x2="624" y2="158" stroke="#E4E1D7" stroke-width="0.8"/><line x1="480" y1="182" x2="624" y2="182" stroke="#E4E1D7" stroke-width="0.8"/><line x1="480" y1="206" x2="624" y2="206" stroke="#E4E1D7" stroke-width="0.8"/><line x1="480" y1="230" x2="624" y2="230" stroke="#E4E1D7" stroke-width="0.8"/><text x="372.0" y="98.0" font-size="13" fill="#5E5850" text-anchor="middle">класс 0: вертикальная</text><text x="552.0" y="98.0" font-size="13" fill="#5E5850" text-anchor="middle">класс 1: горизонтальная</text></g><g data-key="tens"><g><rect x="720.0" y="120.0" width="108.0" height="108.0" rx="2" fill="#73B222" opacity="0.35" stroke="#ffffff" stroke-width="1"/><line x1="738.0" y1="120.0" x2="738.0" y2="228.0" class="grid" opacity=".75"/><line x1="756.0" y1="120.0" x2="756.0" y2="228.0" class="grid" opacity=".75"/><line x1="774.0" y1="120.0" x2="774.0" y2="228.0" class="grid" opacity=".75"/><line x1="792.0" y1="120.0" x2="792.0" y2="228.0" class="grid" opacity=".75"/><line x1="810.0" y1="120.0" x2="810.0" y2="228.0" class="grid" opacity=".75"/><line x1="720.0" y1="138.0" x2="828.0" y2="138.0" class="grid" opacity=".75"/><line x1="720.0" y1="156.0" x2="828.0" y2="156.0" class="grid" opacity=".75"/><line x1="720.0" y1="174.0" x2="828.0" y2="174.0" class="grid" opacity=".75"/><line x1="720.0" y1="192.0" x2="828.0" y2="192.0" class="grid" opacity=".75"/><line x1="720.0" y1="210.0" x2="828.0" y2="210.0" class="grid" opacity=".75"/></g><g><rect x="713.0" y="127.0" width="108.0" height="108.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="731.0" y1="127.0" x2="731.0" y2="235.0" class="grid" opacity=".75"/><line x1="749.0" y1="127.0" x2="749.0" y2="235.0" class="grid" opacity=".75"/><line x1="767.0" y1="127.0" x2="767.0" y2="235.0" class="grid" opacity=".75"/><line x1="785.0" y1="127.0" x2="785.0" y2="235.0" class="grid" opacity=".75"/><line x1="803.0" y1="127.0" x2="803.0" y2="235.0" class="grid" opacity=".75"/><line x1="713.0" y1="145.0" x2="821.0" y2="145.0" class="grid" opacity=".75"/><line x1="713.0" y1="163.0" x2="821.0" y2="163.0" class="grid" opacity=".75"/><line x1="713.0" y1="181.0" x2="821.0" y2="181.0" class="grid" opacity=".75"/><line x1="713.0" y1="199.0" x2="821.0" y2="199.0" class="grid" opacity=".75"/><line x1="713.0" y1="217.0" x2="821.0" y2="217.0" class="grid" opacity=".75"/></g><text x="767.0" y="112.0" font-size="13" fill="#111111" text-anchor="middle">W = 6</text><text x="705.0" y="186.0" font-size="13" fill="#111111" text-anchor="end">H = 6</text><text x="767.0" y="262.0" font-size="12" fill="#5E5850" text-anchor="middle">B = 2: второй лист позади</text><text x="767.0" y="280.0" font-size="12" fill="#5E5850" text-anchor="middle">C = 1 канал</text></g><g data-key="ch" data-only="1"><g><rect x="320.0" y="380.0" width="56.0" height="56.0" rx="2" fill="#C30B0A" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="334.0" y1="380.0" x2="334.0" y2="436.0" class="grid" opacity=".75"/><line x1="348.0" y1="380.0" x2="348.0" y2="436.0" class="grid" opacity=".75"/><line x1="362.0" y1="380.0" x2="362.0" y2="436.0" class="grid" opacity=".75"/><line x1="320.0" y1="394.0" x2="376.0" y2="394.0" class="grid" opacity=".75"/><line x1="320.0" y1="408.0" x2="376.0" y2="408.0" class="grid" opacity=".75"/><line x1="320.0" y1="422.0" x2="376.0" y2="422.0" class="grid" opacity=".75"/></g><g><rect x="330.0" y="370.0" width="56.0" height="56.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="344.0" y1="370.0" x2="344.0" y2="426.0" class="grid" opacity=".75"/><line x1="358.0" y1="370.0" x2="358.0" y2="426.0" class="grid" opacity=".75"/><line x1="372.0" y1="370.0" x2="372.0" y2="426.0" class="grid" opacity=".75"/><line x1="330.0" y1="384.0" x2="386.0" y2="384.0" class="grid" opacity=".75"/><line x1="330.0" y1="398.0" x2="386.0" y2="398.0" class="grid" opacity=".75"/><line x1="330.0" y1="412.0" x2="386.0" y2="412.0" class="grid" opacity=".75"/></g><g><rect x="340.0" y="360.0" width="56.0" height="56.0" rx="2" fill="#3576C0" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="354.0" y1="360.0" x2="354.0" y2="416.0" class="grid" opacity=".75"/><line x1="368.0" y1="360.0" x2="368.0" y2="416.0" class="grid" opacity=".75"/><line x1="382.0" y1="360.0" x2="382.0" y2="416.0" class="grid" opacity=".75"/><line x1="340.0" y1="374.0" x2="396.0" y2="374.0" class="grid" opacity=".75"/><line x1="340.0" y1="388.0" x2="396.0" y2="388.0" class="grid" opacity=".75"/><line x1="340.0" y1="402.0" x2="396.0" y2="402.0" class="grid" opacity=".75"/></g><text x="420.0" y="380.0" font-size="13" fill="#5E5850" text-anchor="start">у цветной картинки C = 3:</text><text x="420.0" y="398.0" font-size="13" fill="#5E5850" text-anchor="start">R, G и B — три листа одной оси</text></g><g data-key="mlp" data-only="1"><g><rect x="300.0" y="470.0" width="288.0" height="8.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="308.0" y1="470.0" x2="308.0" y2="478.0" class="grid" opacity=".75"/><line x1="316.0" y1="470.0" x2="316.0" y2="478.0" class="grid" opacity=".75"/><line x1="324.0" y1="470.0" x2="324.0" y2="478.0" class="grid" opacity=".75"/><line x1="332.0" y1="470.0" x2="332.0" y2="478.0" class="grid" opacity=".75"/><line x1="340.0" y1="470.0" x2="340.0" y2="478.0" class="grid" opacity=".75"/><line x1="348.0" y1="470.0" x2="348.0" y2="478.0" class="grid" opacity=".75"/><line x1="356.0" y1="470.0" x2="356.0" y2="478.0" class="grid" opacity=".75"/><line x1="364.0" y1="470.0" x2="364.0" y2="478.0" class="grid" opacity=".75"/><line x1="372.0" y1="470.0" x2="372.0" y2="478.0" class="grid" opacity=".75"/><line x1="380.0" y1="470.0" x2="380.0" y2="478.0" class="grid" opacity=".75"/><line x1="388.0" y1="470.0" x2="388.0" y2="478.0" class="grid" opacity=".75"/><line x1="396.0" y1="470.0" x2="396.0" y2="478.0" class="grid" opacity=".75"/><line x1="404.0" y1="470.0" x2="404.0" y2="478.0" class="grid" opacity=".75"/><line x1="412.0" y1="470.0" x2="412.0" y2="478.0" class="grid" opacity=".75"/><line x1="420.0" y1="470.0" x2="420.0" y2="478.0" class="grid" opacity=".75"/><line x1="428.0" y1="470.0" x2="428.0" y2="478.0" class="grid" opacity=".75"/><line x1="436.0" y1="470.0" x2="436.0" y2="478.0" class="grid" opacity=".75"/><line x1="444.0" y1="470.0" x2="444.0" y2="478.0" class="grid" opacity=".75"/><line x1="452.0" y1="470.0" x2="452.0" y2="478.0" class="grid" opacity=".75"/><line x1="460.0" y1="470.0" x2="460.0" y2="478.0" class="grid" opacity=".75"/><line x1="468.0" y1="470.0" x2="468.0" y2="478.0" class="grid" opacity=".75"/><line x1="476.0" y1="470.0" x2="476.0" y2="478.0" class="grid" opacity=".75"/><line x1="484.0" y1="470.0" x2="484.0" y2="478.0" class="grid" opacity=".75"/><line x1="492.0" y1="470.0" x2="492.0" y2="478.0" class="grid" opacity=".75"/><line x1="500.0" y1="470.0" x2="500.0" y2="478.0" class="grid" opacity=".75"/><line x1="508.0" y1="470.0" x2="508.0" y2="478.0" class="grid" opacity=".75"/><line x1="516.0" y1="470.0" x2="516.0" y2="478.0" class="grid" opacity=".75"/><line x1="524.0" y1="470.0" x2="524.0" y2="478.0" class="grid" opacity=".75"/><line x1="532.0" y1="470.0" x2="532.0" y2="478.0" class="grid" opacity=".75"/><line x1="540.0" y1="470.0" x2="540.0" y2="478.0" class="grid" opacity=".75"/><line x1="548.0" y1="470.0" x2="548.0" y2="478.0" class="grid" opacity=".75"/><line x1="556.0" y1="470.0" x2="556.0" y2="478.0" class="grid" opacity=".75"/><line x1="564.0" y1="470.0" x2="564.0" y2="478.0" class="grid" opacity=".75"/><line x1="572.0" y1="470.0" x2="572.0" y2="478.0" class="grid" opacity=".75"/><line x1="580.0" y1="470.0" x2="580.0" y2="478.0" class="grid" opacity=".75"/></g><text x="300.0" y="462.0" font-size="13" fill="#5E5850" text-anchor="start">полносвязная сеть: строка из 36 чисел</text><text x="300.0" y="500.0" font-size="13" fill="#C30B0A" text-anchor="start">соседство пикселей по вертикали потеряно</text></g><g data-key="shapes" data-only="1"><foreignObject x="290.0" y="340.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X:\ [B \times C \times H \times W] = [2 \times 1 \times 6 \times 6]"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — картинки · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl img" data-focus="hl img">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>Две картинки 6 × 6</h4>
      <p>Полоса вертикальная (класс 0) и горизонтальная (класс 1). Яркость пикселей от 0 до 1; полосы нарочно неровные, чтобы соседние окна давали разные числа.</p>
    </div>
    <div class="step-panel" data-on="hl img tens shapes" data-focus="tens shapes">
      <div class="step-kicker">Шаг 2 · тензор</div>
      <h4>Четыре оси</h4>
      <p>Батч картинок — тензор <code>[B × C × H × W]</code>: номер картинки, канал, строка, столбец. У серой картинки один канал.</p>
    </div>
    <div class="step-panel" data-on="hl tens ch" data-focus="ch">
      <div class="step-kicker">Шаг 3 · каналы</div>
      <h4>У цвета — три листа</h4>
      <p>Канальная ось есть всегда: у цветной картинки их три, а после свёрточного слоя — столько, сколько ядер. Дальше мы увидим, что каналы — это аналог «ширины» полносвязного слоя.</p>
    </div>
    <div class="step-panel" data-on="hl img mlp" data-focus="mlp">
      <div class="step-kicker">Шаг 4 · почему не строка</div>
      <h4>Выпрямление теряет геометрию</h4>
      <p>Полносвязная сеть превратила бы картинку в строку из 36 чисел. Пиксели, стоящие друг над другом, окажутся в шести позициях друг от друга, и сеть должна будет выучить это соседство сама.</p>
    </div>
    <div class="step-panel" data-on="hl img tens shapes" data-focus="shapes">
      <div class="step-kicker">Шаг 5 · формы</div>
      <h4>X [2 × 1 × 6 × 6]</h4>
      <p>Свёрточная сеть сохраняет пространственные оси до самого конца свёрточной части и выпрямляет тензор только перед классификатором.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Две картинки — 72 числа.</p>
<div class="stage" id="stage-inn" tabindex="0">
  <div class="stage-figure">
<svg id="inn" viewBox="0 0 960 420" role="img" aria-label="Числовой вид двух картинок">
<style>
  #inn { font-family: Helvetica, Arial, sans-serif; }
  #inn .cap { font-size: 13px; fill: #5E5850; }
  #inn .lbl { font-size: 16px; fill: #111111; }
  #inn .legend { font-size: 13px; fill: #5E5850; }
  #inn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #inn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #inn .dim { font-size: 13px; fill: #5E5850; }
  #inn .nm { font-size: 16px; font-weight: 800; }
  #inn .op { font-size: 23px; fill: #5E5850; }
  #inn .arw { font-size: 12px; fill: #5E5850; }
  #inn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="inn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="inn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="inn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="inn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: две картинки 6 × 6</text><g data-key="x1"><g><rect x="189.0" y="70.0" width="102.0" height="102.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="206.0" y1="70.0" x2="206.0" y2="172.0" class="grid" opacity=".75"/><line x1="223.0" y1="70.0" x2="223.0" y2="172.0" class="grid" opacity=".75"/><line x1="240.0" y1="70.0" x2="240.0" y2="172.0" class="grid" opacity=".75"/><line x1="257.0" y1="70.0" x2="257.0" y2="172.0" class="grid" opacity=".75"/><line x1="274.0" y1="70.0" x2="274.0" y2="172.0" class="grid" opacity=".75"/><line x1="189.0" y1="87.0" x2="291.0" y2="87.0" class="grid" opacity=".75"/><line x1="189.0" y1="104.0" x2="291.0" y2="104.0" class="grid" opacity=".75"/><line x1="189.0" y1="121.0" x2="291.0" y2="121.0" class="grid" opacity=".75"/><line x1="189.0" y1="138.0" x2="291.0" y2="138.0" class="grid" opacity=".75"/><line x1="189.0" y1="155.0" x2="291.0" y2="155.0" class="grid" opacity=".75"/></g><text x="240.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">6</text><text x="179.0" y="125.0" font-size="13" fill="#111111" text-anchor="end">6</text><foreignObject x="150.0" y="175.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X_{0,0}"></div></foreignObject><foreignObject x="105.0" y="202.0" width="270.0" height="144.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0 &amp; 0.0 &amp; 0.9 &amp; 0.4 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 1.0 &amp; 0.5 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 0.8 &amp; 0.3 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 1.0 &amp; 0.6 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 0.7 &amp; 0.5 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 0.9 &amp; 0.4 &amp; 0.0 &amp; 0.0\end{bmatrix}"></div></foreignObject></g><g data-key="x2"><g><rect x="649.0" y="70.0" width="102.0" height="102.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="666.0" y1="70.0" x2="666.0" y2="172.0" class="grid" opacity=".75"/><line x1="683.0" y1="70.0" x2="683.0" y2="172.0" class="grid" opacity=".75"/><line x1="700.0" y1="70.0" x2="700.0" y2="172.0" class="grid" opacity=".75"/><line x1="717.0" y1="70.0" x2="717.0" y2="172.0" class="grid" opacity=".75"/><line x1="734.0" y1="70.0" x2="734.0" y2="172.0" class="grid" opacity=".75"/><line x1="649.0" y1="87.0" x2="751.0" y2="87.0" class="grid" opacity=".75"/><line x1="649.0" y1="104.0" x2="751.0" y2="104.0" class="grid" opacity=".75"/><line x1="649.0" y1="121.0" x2="751.0" y2="121.0" class="grid" opacity=".75"/><line x1="649.0" y1="138.0" x2="751.0" y2="138.0" class="grid" opacity=".75"/><line x1="649.0" y1="155.0" x2="751.0" y2="155.0" class="grid" opacity=".75"/></g><text x="700.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">6</text><text x="639.0" y="125.0" font-size="13" fill="#111111" text-anchor="end">6</text><foreignObject x="610.0" y="175.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X_{1,0}"></div></foreignObject><foreignObject x="565.0" y="202.0" width="270.0" height="144.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 \\ 0.3 &amp; 0.5 &amp; 0.4 &amp; 0.6 &amp; 0.4 &amp; 0.5 \\ 0.8 &amp; 1.0 &amp; 0.9 &amp; 1.0 &amp; 0.7 &amp; 0.9 \\ 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0 &amp; 0.0\end{bmatrix}"></div></foreignObject></g><g data-key="pix" data-only="1"><rect x="223.0" y="87.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="480.0" y="400.0" font-size="13" fill="#C30B0A" text-anchor="middle">X[0, 0, 1, 2] = 1.0 — самый яркий пиксель вертикальной полосы</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="x1" data-focus="x1">
      <div class="step-kicker">Шаг 1 · первая картинка</div>
      <h4>Два ненулевых столбца</h4>
      <p>Полоса занимает столбцы 2 и 3 (счёт с нуля): яркая часть 0.7–1.0 и бледная 0.3–0.6.</p>
    </div>
    <div class="step-panel" data-on="x1 pix" data-focus="pix">
      <div class="step-kicker">Шаг 2 · индекс</div>
      <h4>Четыре индекса на пиксель</h4>
      <p>X[b, c, i, j]: картинка b, канал c, строка i, столбец j.</p>
    </div>
    <div class="step-panel" data-on="x1 x2" data-focus="x2">
      <div class="step-kicker">Шаг 3 · вторая картинка</div>
      <h4>Та же полоса, повёрнутая</h4>
      <p>Строки 2 и 3 вместо столбцов. По гистограмме яркостей картинки почти одинаковы — различает их только расположение пикселей.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> вход CNN — тензор <code>[B × C × H × W]</code>; свёртка работает с пространственными осями напрямую, не выпрямляя их.
</div>

---


## Часть 3. Одно окно свёртки

<p>
  Свёртка начинается с малого: берём окно картинки размером с ядро, умножаем поэлементно на
  ядро, складываем и прибавляем смещение:
</p>
<div class="math-display" data-tex="z_{ij} = \sum_{u=0}^{2}\sum_{v=0}^{2} x_{i+u,\,j+v}\; k_{uv} + b"></div>

<div class="callout-blue">
  <strong>Свёртка или корреляция?</strong> В математике свёртка переворачивает ядро, а в нейросетях
  под этим словом почти всегда понимают взаимную корреляцию — без переворота, как в формуле выше.
  Для обучения разницы нет: сеть просто выучит перевёрнутое ядро. Переворот появится в части 11 —
  в обратном проходе.
</div>
<div class="stage" id="stage-ne" tabindex="0">
  <div class="stage-figure">
<svg id="ne" viewBox="0 0 960 620" role="img" aria-label="Одно окно свёртки: патч 3 на 3 поэлементно умножается на ядро и суммируется">
<style>
  #ne { font-family: Helvetica, Arial, sans-serif; }
  #ne .cap { font-size: 13px; fill: #5E5850; }
  #ne .lbl { font-size: 16px; fill: #111111; }
  #ne .legend { font-size: 13px; fill: #5E5850; }
  #ne .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #ne .grid { stroke: #ffffff; stroke-width: 1.35; }
  #ne .dim { font-size: 13px; fill: #5E5850; }
  #ne .nm { font-size: 16px; font-weight: 800; }
  #ne .op { font-size: 23px; fill: #5E5850; }
  #ne .arw { font-size: 12px; fill: #5E5850; }
  #ne .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="ne-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="ne-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="ne-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="ne-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="296" width="190" height="152" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="372.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 372)">свёрточный блок</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 356 L 125 338" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 304 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ne-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Conv 3×3</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#8A857C" text-anchor="middle">MaxPool 2×2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#C30B0A" text-anchor="middle">Conv 3×3</text><rect x="34" y="398" width="182" height="48" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="img"><rect x="300" y="110" width="156" height="156" fill="#FFFFFF" stroke="#C9C2B8"/><rect x="352.0" y="110.0" width="26" height="26" fill="#73B222" opacity="0.92"/><rect x="378.0" y="110.0" width="26" height="26" fill="#73B222" opacity="0.49"/><rect x="352.0" y="136.0" width="26" height="26" fill="#73B222" opacity="1.00"/><rect x="378.0" y="136.0" width="26" height="26" fill="#73B222" opacity="0.57"/><rect x="352.0" y="162.0" width="26" height="26" fill="#73B222" opacity="0.83"/><rect x="378.0" y="162.0" width="26" height="26" fill="#73B222" opacity="0.41"/><rect x="352.0" y="188.0" width="26" height="26" fill="#73B222" opacity="1.00"/><rect x="378.0" y="188.0" width="26" height="26" fill="#73B222" opacity="0.66"/><rect x="352.0" y="214.0" width="26" height="26" fill="#73B222" opacity="0.74"/><rect x="378.0" y="214.0" width="26" height="26" fill="#73B222" opacity="0.57"/><rect x="352.0" y="240.0" width="26" height="26" fill="#73B222" opacity="0.92"/><rect x="378.0" y="240.0" width="26" height="26" fill="#73B222" opacity="0.49"/><line x1="326" y1="110" x2="326" y2="266" stroke="#E4E1D7" stroke-width="0.8"/><line x1="352" y1="110" x2="352" y2="266" stroke="#E4E1D7" stroke-width="0.8"/><line x1="378" y1="110" x2="378" y2="266" stroke="#E4E1D7" stroke-width="0.8"/><line x1="404" y1="110" x2="404" y2="266" stroke="#E4E1D7" stroke-width="0.8"/><line x1="430" y1="110" x2="430" y2="266" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="136" x2="456" y2="136" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="162" x2="456" y2="162" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="188" x2="456" y2="188" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="214" x2="456" y2="214" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="240" x2="456" y2="240" stroke="#E4E1D7" stroke-width="0.8"/><text x="378.0" y="100.0" font-size="13" fill="#5E5850" text-anchor="middle">картинка</text></g><g data-key="win"><rect x="326.0" y="136.0" width="78.0" height="78.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/></g><g data-key="patch"><path d="M 410.0 175.0 L 470.0 175.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ne-arw)"/><rect x="480" y="136" width="78" height="78" fill="#FFFFFF" stroke="#C9C2B8"/><rect x="506.0" y="136.0" width="26" height="26" fill="#73B222" opacity="1.00"/><rect x="532.0" y="136.0" width="26" height="26" fill="#73B222" opacity="0.57"/><rect x="506.0" y="162.0" width="26" height="26" fill="#73B222" opacity="0.83"/><rect x="532.0" y="162.0" width="26" height="26" fill="#73B222" opacity="0.41"/><rect x="506.0" y="188.0" width="26" height="26" fill="#73B222" opacity="1.00"/><rect x="532.0" y="188.0" width="26" height="26" fill="#73B222" opacity="0.66"/><line x1="506" y1="136" x2="506" y2="214" stroke="#E4E1D7" stroke-width="0.8"/><line x1="532" y1="136" x2="532" y2="214" stroke="#E4E1D7" stroke-width="0.8"/><line x1="480" y1="162" x2="558" y2="162" stroke="#E4E1D7" stroke-width="0.8"/><line x1="480" y1="188" x2="558" y2="188" stroke="#E4E1D7" stroke-width="0.8"/><foreignObject x="474.0" y="220.0" width="90.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\text{патч}"></div></foreignObject></g><g data-key="ker"><text x="572.0" y="180.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="590.0" y="136.0" width="78.0" height="78.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="616.0" y1="136.0" x2="616.0" y2="214.0" class="grid" opacity=".75"/><line x1="642.0" y1="136.0" x2="642.0" y2="214.0" class="grid" opacity=".75"/><line x1="590.0" y1="162.0" x2="668.0" y2="162.0" class="grid" opacity=".75"/><line x1="590.0" y1="188.0" x2="668.0" y2="188.0" class="grid" opacity=".75"/></g><foreignObject x="584.0" y="220.0" width="90.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="K_1"></div></foreignObject></g><g data-key="z"><text x="684.0" y="180.0" font-size="22" fill="#111111" text-anchor="middle">Σ</text><text x="700.0" y="184.0" font-size="15" fill="#111111" text-anchor="start">+ b =</text><g><rect x="750.0" y="162.0" width="26.0" height="26.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="733.0" y="194.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z"></div></foreignObject></g><g data-key="flat"><g><rect x="300.0" y="380.0" width="180.0" height="20.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="320.0" y1="380.0" x2="320.0" y2="400.0" class="grid" opacity=".75"/><line x1="340.0" y1="380.0" x2="340.0" y2="400.0" class="grid" opacity=".75"/><line x1="360.0" y1="380.0" x2="360.0" y2="400.0" class="grid" opacity=".75"/><line x1="380.0" y1="380.0" x2="380.0" y2="400.0" class="grid" opacity=".75"/><line x1="400.0" y1="380.0" x2="400.0" y2="400.0" class="grid" opacity=".75"/><line x1="420.0" y1="380.0" x2="420.0" y2="400.0" class="grid" opacity=".75"/><line x1="440.0" y1="380.0" x2="440.0" y2="400.0" class="grid" opacity=".75"/><line x1="460.0" y1="380.0" x2="460.0" y2="400.0" class="grid" opacity=".75"/></g><text x="390.0" y="372.0" font-size="12" fill="#5E5850" text-anchor="middle">патч → строка из 9 чисел</text><text x="496.0" y="396.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="512.0" y="330.0" width="14.0" height="126.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="512.0" y1="344.0" x2="526.0" y2="344.0" class="grid" opacity=".75"/><line x1="512.0" y1="358.0" x2="526.0" y2="358.0" class="grid" opacity=".75"/><line x1="512.0" y1="372.0" x2="526.0" y2="372.0" class="grid" opacity=".75"/><line x1="512.0" y1="386.0" x2="526.0" y2="386.0" class="grid" opacity=".75"/><line x1="512.0" y1="400.0" x2="526.0" y2="400.0" class="grid" opacity=".75"/><line x1="512.0" y1="414.0" x2="526.0" y2="414.0" class="grid" opacity=".75"/><line x1="512.0" y1="428.0" x2="526.0" y2="428.0" class="grid" opacity=".75"/><line x1="512.0" y1="442.0" x2="526.0" y2="442.0" class="grid" opacity=".75"/></g><text x="538.0" y="372.0" font-size="12" fill="#5E5850" text-anchor="start">ядро →</text><text x="538.0" y="388.0" font-size="12" fill="#5E5850" text-anchor="start">столбец</text><text x="592.0" y="396.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="608.0" y="383.0" width="20.0" height="20.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/></g></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="490.0" width="650.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z_{ij} = \sum_{u=0}^{2}\sum_{v=0}^{2} x_{i+u,\,j+v}\,k_{uv} + b"></div></foreignObject></g><g data-key="nn" data-only="1"><text x="760.0" y="400.0" font-size="13" fill="#C30B0A" text-anchor="start">окно — нейрон,</text><text x="760.0" y="418.0" font-size="13" fill="#C30B0A" text-anchor="start">который видит 9 пикселей</text><text x="760.0" y="436.0" font-size="13" fill="#C30B0A" text-anchor="start">и делит веса со всеми</text><text x="760.0" y="454.0" font-size="13" fill="#C30B0A" text-anchor="start">остальными окнами</text></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — картинки · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl img win" data-focus="hl win">
      <div class="step-kicker">Шаг 1 · окно</div>
      <h4>Кусок 3 × 3</h4>
      <p>Возьмём окно с левым верхним углом в (1, 1). Оно накрывает начало вертикальной полосы.</p>
    </div>
    <div class="step-panel" data-on="hl img win patch ker" data-focus="patch ker">
      <div class="step-kicker">Шаг 2 · ядро</div>
      <h4>Ядро того же размера, что окно</h4>
      <p>Ядро K₁ — 9 обучаемых весов. Патч и ядро перемножаются поэлементно: пиксель на вес в той же позиции.</p>
    </div>
    <div class="step-panel" data-on="hl patch ker z" data-focus="z">
      <div class="step-kicker">Шаг 3 · сумма</div>
      <h4>Девять произведений и смещение</h4>
      <p>Сумма всех девяти произведений плюс смещение канала — одно число. Больше ничего свёртка не делает.</p>
    </div>
    <div class="step-panel" data-on="hl patch ker z flat f" data-focus="flat f">
      <div class="step-kicker">Шаг 4 · как у нейрона</div>
      <h4>Строка на столбец</h4>
      <p>Если развернуть патч в строку <code>[1 × 9]</code>, а ядро — в столбец <code>[9 × 1]</code>, это ровно скалярное произведение из статьи про полносвязную сеть. Новое только одно: что именно подаётся на вход.</p>
    </div>
    <div class="step-panel" data-on="hl flat nn" data-focus="nn">
      <div class="step-kicker">Шаг 5 · главное отличие</div>
      <h4>Локальность и общие веса</h4>
      <p>Нейрон свёртки смотрит не на всю картинку, а на 9 соседних пикселей, и в каждом окне — одни и те же 9 весов. Отсюда и экономия параметров, и умение находить признак где угодно на картинке.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Окно (1, 1) первой картинки и первое ядро.</p>
<div class="stage" id="stage-nen" tabindex="0">
  <div class="stage-figure">
<svg id="nen" viewBox="0 0 960 470" role="img" aria-label="Числовой расчёт одного окна свёртки">
<style>
  #nen { font-family: Helvetica, Arial, sans-serif; }
  #nen .cap { font-size: 13px; fill: #5E5850; }
  #nen .lbl { font-size: 16px; fill: #111111; }
  #nen .legend { font-size: 13px; fill: #5E5850; }
  #nen .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #nen .grid { stroke: #ffffff; stroke-width: 1.35; }
  #nen .dim { font-size: 13px; fill: #5E5850; }
  #nen .nm { font-size: 16px; font-weight: 800; }
  #nen .op { font-size: 23px; fill: #5E5850; }
  #nen .arw { font-size: 12px; fill: #5E5850; }
  #nen .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="nen-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="nen-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="nen-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="nen-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: окно (1, 1) первой картинки, первое ядро</text><g data-key="patch"><g><rect x="144.5" y="70.0" width="51.0" height="51.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="161.5" y1="70.0" x2="161.5" y2="121.0" class="grid" opacity=".75"/><line x1="178.5" y1="70.0" x2="178.5" y2="121.0" class="grid" opacity=".75"/><line x1="144.5" y1="87.0" x2="195.5" y2="87.0" class="grid" opacity=".75"/><line x1="144.5" y1="104.0" x2="195.5" y2="104.0" class="grid" opacity=".75"/></g><text x="170.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="134.5" y="99.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="80.0" y="124.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\text{патч}"></div></foreignObject><foreignObject x="85.0" y="151.0" width="170.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0 &amp; 1.0 &amp; 0.5 \\ 0.0 &amp; 0.8 &amp; 0.3 \\ 0.0 &amp; 1.0 &amp; 0.6\end{bmatrix}"></div></foreignObject></g><g data-key="ker"><text x="290.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="394.5" y="70.0" width="51.0" height="51.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="411.5" y1="70.0" x2="411.5" y2="121.0" class="grid" opacity=".75"/><line x1="428.5" y1="70.0" x2="428.5" y2="121.0" class="grid" opacity=".75"/><line x1="394.5" y1="87.0" x2="445.5" y2="87.0" class="grid" opacity=".75"/><line x1="394.5" y1="104.0" x2="445.5" y2="104.0" class="grid" opacity=".75"/></g><text x="420.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="384.5" y="99.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="330.0" y="124.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="K_1"></div></foreignObject><foreignObject x="325.0" y="151.0" width="190.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.3 &amp; 0.2 &amp; -0.2 \\ -0.5 &amp; 0.4 &amp; -0.2 \\ 0.0 &amp; 0.4 &amp; 1.3\end{bmatrix}"></div></foreignObject></g><g data-key="prod"><text x="550.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="674.5" y="70.0" width="51.0" height="51.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="691.5" y1="70.0" x2="691.5" y2="121.0" class="grid" opacity=".75"/><line x1="708.5" y1="70.0" x2="708.5" y2="121.0" class="grid" opacity=".75"/><line x1="674.5" y1="87.0" x2="725.5" y2="87.0" class="grid" opacity=".75"/><line x1="674.5" y1="104.0" x2="725.5" y2="104.0" class="grid" opacity=".75"/></g><text x="700.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="664.5" y="99.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="610.0" y="124.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\text{произведения}"></div></foreignObject><foreignObject x="585.0" y="151.0" width="230.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.00 &amp; 0.20 &amp; -0.10 \\ 0.00 &amp; 0.32 &amp; -0.06 \\ 0.00 &amp; 0.40 &amp; 0.78\end{bmatrix}"></div></foreignObject></g><g data-key="z"><foreignObject x="20.0" y="270.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z = 1.54 + b_1 = 1.54 + 0.1 = 1.64"></div></foreignObject><text x="480.0" y="340.0" font-size="13" fill="#C30B0A" text-anchor="middle">первый столбец окна пустой — первый столбец ядра на этом окне ни на что не влияет</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="patch ker" data-focus="patch ker">
      <div class="step-kicker">Шаг 1 · две таблицы</div>
      <h4>Патч и ядро</h4>
      <p>Патч — строки 1–3, столбцы 1–3 первой картинки: пустой столбец и два столбца полосы.</p>
    </div>
    <div class="step-panel" data-on="patch ker prod" data-focus="prod">
      <div class="step-kicker">Шаг 2 · поэлементно</div>
      <h4>Девять произведений</h4>
      <p>Самый большой вклад — 0.78: пиксель 0.6 из бледного столбца в правом нижнем углу, умноженный на вес 1.3.</p>
    </div>
    <div class="step-panel" data-on="prod z" data-focus="z">
      <div class="step-kicker">Шаг 3 · сумма</div>
      <h4>1.54 + 0.1 = 1.64</h4>
      <p>Это клетка (1, 1) первого канала карты признаков первой картинки — дальше она окажется победителем пулинга.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> одно окно свёртки — скалярное произведение патча на ядро, то есть ровно работа одного нейрона; новое — только локальный вход.
</div>

---


## Часть 4. Свёрточный слой и каналы

<p>
  Слой прикладывает ядро ко всем положениям окна (шаг 1, без дополнения нулями) и так получает
  карту признаков. Несколько ядер — несколько карт, то есть каналов выхода:
</p>
<div class="math-display" data-tex="Z[b, c, i, j] = \sum_{u,v} X[b, 0, i+u, j+v]\, K[c, 0, u, v] + b_c, \qquad H_{out} = H - K + 1"></div>
<div class="stage" id="stage-cv" tabindex="0">
  <div class="stage-figure">
<svg id="cv" viewBox="0 0 960 620" role="img" aria-label="Свёрточный слой: окно скользит по картинке, каждое положение даёт клетку карты признаков">
<style>
  #cv { font-family: Helvetica, Arial, sans-serif; }
  #cv .cap { font-size: 13px; fill: #5E5850; }
  #cv .lbl { font-size: 16px; fill: #111111; }
  #cv .legend { font-size: 13px; fill: #5E5850; }
  #cv .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #cv .grid { stroke: #ffffff; stroke-width: 1.35; }
  #cv .dim { font-size: 13px; fill: #5E5850; }
  #cv .nm { font-size: 16px; font-weight: 800; }
  #cv .op { font-size: 23px; fill: #5E5850; }
  #cv .arw { font-size: 12px; fill: #5E5850; }
  #cv .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="cv-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="cv-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="cv-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="cv-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="296" width="190" height="152" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="372.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 372)">свёрточный блок</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#cv-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#cv-arw)"/><path d="M 125 356 L 125 338" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#cv-arw)"/><path d="M 125 304 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#cv-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#cv-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#cv-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#cv-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#cv-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#cv-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Conv 3×3</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#8A857C" text-anchor="middle">MaxPool 2×2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#C30B0A" text-anchor="middle">Conv 3×3</text><rect x="34" y="398" width="182" height="48" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="img"><rect x="290" y="120" width="132" height="132" fill="#FFFFFF" stroke="#C9C2B8"/><rect x="334.0" y="120.0" width="22" height="22" fill="#73B222" opacity="0.92"/><rect x="356.0" y="120.0" width="22" height="22" fill="#73B222" opacity="0.49"/><rect x="334.0" y="142.0" width="22" height="22" fill="#73B222" opacity="1.00"/><rect x="356.0" y="142.0" width="22" height="22" fill="#73B222" opacity="0.57"/><rect x="334.0" y="164.0" width="22" height="22" fill="#73B222" opacity="0.83"/><rect x="356.0" y="164.0" width="22" height="22" fill="#73B222" opacity="0.41"/><rect x="334.0" y="186.0" width="22" height="22" fill="#73B222" opacity="1.00"/><rect x="356.0" y="186.0" width="22" height="22" fill="#73B222" opacity="0.66"/><rect x="334.0" y="208.0" width="22" height="22" fill="#73B222" opacity="0.74"/><rect x="356.0" y="208.0" width="22" height="22" fill="#73B222" opacity="0.57"/><rect x="334.0" y="230.0" width="22" height="22" fill="#73B222" opacity="0.92"/><rect x="356.0" y="230.0" width="22" height="22" fill="#73B222" opacity="0.49"/><line x1="312" y1="120" x2="312" y2="252" stroke="#E4E1D7" stroke-width="0.8"/><line x1="334" y1="120" x2="334" y2="252" stroke="#E4E1D7" stroke-width="0.8"/><line x1="356" y1="120" x2="356" y2="252" stroke="#E4E1D7" stroke-width="0.8"/><line x1="378" y1="120" x2="378" y2="252" stroke="#E4E1D7" stroke-width="0.8"/><line x1="400" y1="120" x2="400" y2="252" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="142" x2="422" y2="142" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="164" x2="422" y2="164" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="186" x2="422" y2="186" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="208" x2="422" y2="208" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="230" x2="422" y2="230" stroke="#E4E1D7" stroke-width="0.8"/><text x="356.0" y="110.0" font-size="13" fill="#111111" text-anchor="middle">6 × 6</text></g><g data-key="ker"><g><rect x="452.0" y="163.0" width="54.0" height="54.0" rx="2" fill="#7B4AB5" opacity="0.49500000000000005" stroke="#ffffff" stroke-width="1"/><line x1="470.0" y1="163.0" x2="470.0" y2="217.0" class="grid" opacity=".75"/><line x1="488.0" y1="163.0" x2="488.0" y2="217.0" class="grid" opacity=".75"/><line x1="452.0" y1="181.0" x2="506.0" y2="181.0" class="grid" opacity=".75"/><line x1="452.0" y1="199.0" x2="506.0" y2="199.0" class="grid" opacity=".75"/></g><g><rect x="445.0" y="170.0" width="54.0" height="54.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="463.0" y1="170.0" x2="463.0" y2="224.0" class="grid" opacity=".75"/><line x1="481.0" y1="170.0" x2="481.0" y2="224.0" class="grid" opacity=".75"/><line x1="445.0" y1="188.0" x2="499.0" y2="188.0" class="grid" opacity=".75"/><line x1="445.0" y1="206.0" x2="499.0" y2="206.0" class="grid" opacity=".75"/></g><text x="475.0" y="150.0" font-size="12" fill="#111111" text-anchor="middle">K [2 × 3 × 3]</text><foreignObject x="442.0" y="228.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="K"></div></foreignObject></g><g data-key="map"><g><rect x="567.0" y="135.0" width="88.0" height="88.0" rx="2" fill="#7B4AB5" opacity="0.30250000000000005" stroke="#ffffff" stroke-width="1"/><line x1="589.0" y1="135.0" x2="589.0" y2="223.0" class="grid" opacity=".75"/><line x1="611.0" y1="135.0" x2="611.0" y2="223.0" class="grid" opacity=".75"/><line x1="633.0" y1="135.0" x2="633.0" y2="223.0" class="grid" opacity=".75"/><line x1="567.0" y1="157.0" x2="655.0" y2="157.0" class="grid" opacity=".75"/><line x1="567.0" y1="179.0" x2="655.0" y2="179.0" class="grid" opacity=".75"/><line x1="567.0" y1="201.0" x2="655.0" y2="201.0" class="grid" opacity=".75"/></g><g><rect x="560.0" y="142.0" width="88.0" height="88.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="582.0" y1="142.0" x2="582.0" y2="230.0" class="grid" opacity=".75"/><line x1="604.0" y1="142.0" x2="604.0" y2="230.0" class="grid" opacity=".75"/><line x1="626.0" y1="142.0" x2="626.0" y2="230.0" class="grid" opacity=".75"/><line x1="560.0" y1="164.0" x2="648.0" y2="164.0" class="grid" opacity=".75"/><line x1="560.0" y1="186.0" x2="648.0" y2="186.0" class="grid" opacity=".75"/><line x1="560.0" y1="208.0" x2="648.0" y2="208.0" class="grid" opacity=".75"/></g><text x="611.0" y="124.0" font-size="13" fill="#111111" text-anchor="middle">4 × 4</text><foreignObject x="574.0" y="236.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z"></div></foreignObject></g><g data-key="s1" data-only="1"><rect x="290.0" y="120.0" width="66.0" height="66.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="560.0" y="142.0" width="22.0" height="22.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><path d="M 356 153 L 560 153" fill="none" stroke="#C30B0A" stroke-width="1.2" marker-end="url(#cv-arw)"/></g><g data-key="s2" data-only="1"><rect x="312.0" y="120.0" width="66.0" height="66.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="582.0" y="142.0" width="22.0" height="22.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><path d="M 378 153 L 582 153" fill="none" stroke="#C30B0A" stroke-width="1.2" marker-end="url(#cv-arw)"/></g><g data-key="s3" data-only="1"><rect x="356.0" y="186.0" width="66.0" height="66.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="626.0" y="208.0" width="22.0" height="22.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><path d="M 422 219 L 626 219" fill="none" stroke="#C30B0A" stroke-width="1.2" marker-end="url(#cv-arw)"/></g><g data-key="size"><foreignObject x="290.0" y="300.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="H_{out} = H - K + 1 = 6 - 3 + 1 = 4"></div></foreignObject></g><g data-key="share" data-only="1"><text x="615.0" y="370.0" font-size="13" fill="#C30B0A" text-anchor="middle">одно ядро — 9 весов — на все 16 окон; окон 4 × 4, потому что окно должно целиком поместиться</text></g><g data-key="ch2" data-only="1"><rect x="567.0" y="135.0" width="88.0" height="88.0" rx="3" fill="none" stroke="#7B4AB5" stroke-width="2"/><text x="700.0" y="190.0" font-size="13" fill="#7B4AB5" text-anchor="start" font-weight="700">второе ядро →</text><text x="700.0" y="208.0" font-size="13" fill="#7B4AB5" text-anchor="start" font-weight="700">второй лист карты</text></g><g data-key="shapes" data-only="1"><foreignObject x="290.0" y="420.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[B \times 1 \times 6 \times 6] \ \to\ [B \times 2 \times 4 \times 4]"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — картинки · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl img ker" data-focus="hl ker">
      <div class="step-kicker">Шаг 1 · что есть</div>
      <h4>Картинка и стопка ядер</h4>
      <p>У слоя два ядра по 3 × 3. Форма весов — <code>[C_out × C_in × 3 × 3] = [2 × 1 × 3 × 3]</code>.</p>
    </div>
    <div class="step-panel" data-on="hl img ker map s1" data-focus="s1">
      <div class="step-kicker">Шаг 2 · первое окно</div>
      <h4>Левый верхний угол → клетка (0, 0)</h4>
      <p>Окно в позиции (i, j) даёт клетку (i, j) карты. Карта — это таблица откликов ядра на все положения.</p>
    </div>
    <div class="step-panel" data-on="hl img ker map s2" data-focus="s2">
      <div class="step-kicker">Шаг 3 · сдвиг</div>
      <h4>Окно сдвигается на один пиксель</h4>
      <p>Шаг (stride) равен 1, поэтому соседние окна перекрываются на 6 пикселей из 9.</p>
    </div>
    <div class="step-panel" data-on="hl img ker map s3 size" data-focus="s3 size">
      <div class="step-kicker">Шаг 4 · размер</div>
      <h4>Последнее окно — в углу (3, 3)</h4>
      <p>Окно 3 × 3 помещается в строку из 6 пикселей 4 раза: H − K + 1. Без дополнения нулями (padding) карта всегда меньше картинки.</p>
    </div>
    <div class="step-panel" data-on="hl img ker map share" data-focus="share">
      <div class="step-kicker">Шаг 5 · общие веса</div>
      <h4>Одно ядро на все окна</h4>
      <p>Все 16 клеток карты посчитаны одними и теми же 9 весами. Это и есть сверточная «экономия»: признак, найденный в одном месте, ищется во всех.</p>
    </div>
    <div class="step-panel" data-on="hl ker map ch2 shapes" data-focus="ch2 shapes">
      <div class="step-kicker">Шаг 6 · каналы</div>
      <h4>Два ядра — два канала</h4>
      <p>Второе ядро проходит по той же картинке и даёт второй лист. Форма выхода — <code>[B × 2 × 4 × 4]</code>: каналов столько, сколько ядер.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Все четыре карты: две картинки × два канала.</p>
<div class="stage" id="stage-cvn" tabindex="0">
  <div class="stage-figure">
<svg id="cvn" viewBox="0 0 960 520" role="img" aria-label="Числовые карты признаков для двух картинок и двух каналов">
<style>
  #cvn { font-family: Helvetica, Arial, sans-serif; }
  #cvn .cap { font-size: 13px; fill: #5E5850; }
  #cvn .lbl { font-size: 16px; fill: #111111; }
  #cvn .legend { font-size: 13px; fill: #5E5850; }
  #cvn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #cvn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #cvn .dim { font-size: 13px; fill: #5E5850; }
  #cvn .nm { font-size: 16px; font-weight: 800; }
  #cvn .op { font-size: 23px; fill: #5E5850; }
  #cvn .arw { font-size: 12px; fill: #5E5850; }
  #cvn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="cvn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="cvn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="cvn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="cvn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: Z — две картинки × два канала</text><g data-key="z11"><text x="240.0" y="46.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">картинка 1, канал 1</text><g><rect x="206.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="223.0" y1="70.0" x2="223.0" y2="138.0" class="grid" opacity=".75"/><line x1="240.0" y1="70.0" x2="240.0" y2="138.0" class="grid" opacity=".75"/><line x1="257.0" y1="70.0" x2="257.0" y2="138.0" class="grid" opacity=".75"/><line x1="206.0" y1="87.0" x2="274.0" y2="87.0" class="grid" opacity=".75"/><line x1="206.0" y1="104.0" x2="274.0" y2="104.0" class="grid" opacity=".75"/><line x1="206.0" y1="121.0" x2="274.0" y2="121.0" class="grid" opacity=".75"/></g><text x="240.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="196.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="150.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_{0,0}"></div></foreignObject><foreignObject x="120.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.76 &amp; 1.21 &amp; -0.27 &amp; -0.27 \\ 1.04 &amp; 1.64 &amp; -0.14 &amp; -0.20 \\ 0.65 &amp; 1.41 &amp; -0.14 &amp; -0.29 \\ 0.93 &amp; 1.24 &amp; -0.07 &amp; -0.33\end{bmatrix}"></div></foreignObject></g><g data-key="z12"><text x="700.0" y="46.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">картинка 1, канал 2</text><g><rect x="666.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="683.0" y1="70.0" x2="683.0" y2="138.0" class="grid" opacity=".75"/><line x1="700.0" y1="70.0" x2="700.0" y2="138.0" class="grid" opacity=".75"/><line x1="717.0" y1="70.0" x2="717.0" y2="138.0" class="grid" opacity=".75"/><line x1="666.0" y1="87.0" x2="734.0" y2="87.0" class="grid" opacity=".75"/><line x1="666.0" y1="104.0" x2="734.0" y2="104.0" class="grid" opacity=".75"/><line x1="666.0" y1="121.0" x2="734.0" y2="121.0" class="grid" opacity=".75"/></g><text x="700.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="656.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="610.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_{0,1}"></div></foreignObject><foreignObject x="580.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.82 &amp; 1.98 &amp; 0.93 &amp; 0.22 \\ 1.84 &amp; 2.04 &amp; 0.99 &amp; 0.33 \\ 1.71 &amp; 2.10 &amp; 0.99 &amp; 0.35 \\ 1.69 &amp; 2.01 &amp; 1.02 &amp; 0.23\end{bmatrix}"></div></foreignObject></g><g data-key="z21"><text x="240.0" y="266.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">картинка 2, канал 1</text><g><rect x="206.0" y="290.0" width="68.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="223.0" y1="290.0" x2="223.0" y2="358.0" class="grid" opacity=".75"/><line x1="240.0" y1="290.0" x2="240.0" y2="358.0" class="grid" opacity=".75"/><line x1="257.0" y1="290.0" x2="257.0" y2="358.0" class="grid" opacity=".75"/><line x1="206.0" y1="307.0" x2="274.0" y2="307.0" class="grid" opacity=".75"/><line x1="206.0" y1="324.0" x2="274.0" y2="324.0" class="grid" opacity=".75"/><line x1="206.0" y1="341.0" x2="274.0" y2="341.0" class="grid" opacity=".75"/></g><text x="240.0" y="282.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="196.0" y="328.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="150.0" y="361.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_{1,0}"></div></foreignObject><foreignObject x="120.0" y="388.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.82 &amp; 1.04 &amp; 0.86 &amp; 0.91 \\ 1.64 &amp; 1.55 &amp; 1.37 &amp; 1.31 \\ -0.15 &amp; -0.43 &amp; -0.17 &amp; -0.50 \\ -0.12 &amp; -0.22 &amp; -0.11 &amp; -0.24\end{bmatrix}"></div></foreignObject></g><g data-key="z22"><text x="700.0" y="266.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">картинка 2, канал 2</text><g><rect x="666.0" y="290.0" width="68.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="683.0" y1="290.0" x2="683.0" y2="358.0" class="grid" opacity=".75"/><line x1="700.0" y1="290.0" x2="700.0" y2="358.0" class="grid" opacity=".75"/><line x1="717.0" y1="290.0" x2="717.0" y2="358.0" class="grid" opacity=".75"/><line x1="666.0" y1="307.0" x2="734.0" y2="307.0" class="grid" opacity=".75"/><line x1="666.0" y1="324.0" x2="734.0" y2="324.0" class="grid" opacity=".75"/><line x1="666.0" y1="341.0" x2="734.0" y2="341.0" class="grid" opacity=".75"/></g><text x="700.0" y="282.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="656.0" y="328.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="610.0" y="361.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_{1,1}"></div></foreignObject><foreignObject x="580.0" y="388.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.68 &amp; 0.89 &amp; 0.76 &amp; 0.87 \\ 2.08 &amp; 2.34 &amp; 2.06 &amp; 2.14 \\ 1.75 &amp; 1.80 &amp; 1.61 &amp; 1.54 \\ 0.60 &amp; 0.57 &amp; 0.50 &amp; 0.47\end{bmatrix}"></div></foreignObject></g><g data-key="cell" data-only="1"><rect x="223.0" y="87.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/></g><g data-key="neg" data-only="1"><rect x="240.0" y="70.0" width="34.0" height="68.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="480.0" y="512.0" font-size="13" fill="#C30B0A" text-anchor="middle">справа от полосы первое ядро отвечает минусом: столбцы 2 и 3 отрицательны</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="z11 cell" data-focus="z11 cell">
      <div class="step-kicker">Шаг 1 · первая карта</div>
      <h4>Клетка (1, 1) = 1.64</h4>
      <p>Число из прошлой части. Остальные 15 клеток — то же ядро на других окнах.</p>
    </div>
    <div class="step-panel" data-on="z11 neg" data-focus="neg">
      <div class="step-kicker">Шаг 2 · знаки</div>
      <h4>Ядро 1 различает стороны полосы</h4>
      <p>На левом крае полосы отклик положительный (до 1.64), на правом — отрицательный. Ядро случайное, но уже «чувствует» перепад яркости слева направо.</p>
    </div>
    <div class="step-panel" data-on="z11 z12" data-focus="z12">
      <div class="step-kicker">Шаг 3 · второй канал</div>
      <h4>Ядро 2 почти везде положительно</h4>
      <p>У второго ядра почти все веса положительные — оно просто суммирует яркость окна. Карта повторяет полосу, от 0.22 до 2.10.</p>
    </div>
    <div class="step-panel" data-on="z11 z12 z21 z22" data-focus="z21 z22">
      <div class="step-kicker">Шаг 4 · вторая картинка</div>
      <h4>Горизонтальная полоса — горизонтальный след на картах</h4>
      <p>У второй картинки отклики выстроены по строкам: максимум в строке 1, отрицательные — в строках 2–3 первого канала.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> свёрточный слой — одно ядро на все окна и по ядру на каждый канал выхода; форма <code>[B × C_in × H × W] → [B × C_out × (H−K+1) × (W−K+1)]</code>.
</div>

---


## Часть 5. im2col: свёртка как умножение матриц

<p>
  Двойной цикл по окнам можно заменить одним умножением. Выложим все окна строками в матрицу
  <code>cols</code>, ядра — столбцами в матрицу <span class="math-inline" data-tex="K_{mat}"></span>:
</p>
<div class="math-display" data-tex="Z_{flat} = \text{cols}\; K_{mat} + b_c, \qquad [16 \times 9]\cdot[9 \times 2] + [1 \times 2] = [16 \times 2]"></div>
<div class="stage" id="stage-ic" tabindex="0">
  <div class="stage-figure">
<svg id="ic" viewBox="0 0 960 620" role="img" aria-label="im2col: окна выкладываются строками, свёртка становится умножением матриц">
<style>
  #ic { font-family: Helvetica, Arial, sans-serif; }
  #ic .cap { font-size: 13px; fill: #5E5850; }
  #ic .lbl { font-size: 16px; fill: #111111; }
  #ic .legend { font-size: 13px; fill: #5E5850; }
  #ic .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #ic .grid { stroke: #ffffff; stroke-width: 1.35; }
  #ic .dim { font-size: 13px; fill: #5E5850; }
  #ic .nm { font-size: 16px; font-weight: 800; }
  #ic .op { font-size: 23px; fill: #5E5850; }
  #ic .arw { font-size: 12px; fill: #5E5850; }
  #ic .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="ic-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="ic-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="ic-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="ic-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="296" width="190" height="152" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="372.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 372)">свёрточный блок</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ic-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ic-arw)"/><path d="M 125 356 L 125 338" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ic-arw)"/><path d="M 125 304 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ic-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ic-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ic-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ic-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ic-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ic-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Conv 3×3</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#8A857C" text-anchor="middle">MaxPool 2×2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#C30B0A" text-anchor="middle">Conv 3×3</text><rect x="34" y="398" width="182" height="48" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="img"><rect x="290" y="150" width="96" height="96" fill="#FFFFFF" stroke="#C9C2B8"/><rect x="322.0" y="150.0" width="16" height="16" fill="#73B222" opacity="0.92"/><rect x="338.0" y="150.0" width="16" height="16" fill="#73B222" opacity="0.49"/><rect x="322.0" y="166.0" width="16" height="16" fill="#73B222" opacity="1.00"/><rect x="338.0" y="166.0" width="16" height="16" fill="#73B222" opacity="0.57"/><rect x="322.0" y="182.0" width="16" height="16" fill="#73B222" opacity="0.83"/><rect x="338.0" y="182.0" width="16" height="16" fill="#73B222" opacity="0.41"/><rect x="322.0" y="198.0" width="16" height="16" fill="#73B222" opacity="1.00"/><rect x="338.0" y="198.0" width="16" height="16" fill="#73B222" opacity="0.66"/><rect x="322.0" y="214.0" width="16" height="16" fill="#73B222" opacity="0.74"/><rect x="338.0" y="214.0" width="16" height="16" fill="#73B222" opacity="0.57"/><rect x="322.0" y="230.0" width="16" height="16" fill="#73B222" opacity="0.92"/><rect x="338.0" y="230.0" width="16" height="16" fill="#73B222" opacity="0.49"/><line x1="306" y1="150" x2="306" y2="246" stroke="#E4E1D7" stroke-width="0.8"/><line x1="322" y1="150" x2="322" y2="246" stroke="#E4E1D7" stroke-width="0.8"/><line x1="338" y1="150" x2="338" y2="246" stroke="#E4E1D7" stroke-width="0.8"/><line x1="354" y1="150" x2="354" y2="246" stroke="#E4E1D7" stroke-width="0.8"/><line x1="370" y1="150" x2="370" y2="246" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="166" x2="386" y2="166" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="182" x2="386" y2="182" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="198" x2="386" y2="198" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="214" x2="386" y2="214" stroke="#E4E1D7" stroke-width="0.8"/><line x1="290" y1="230" x2="386" y2="230" stroke="#E4E1D7" stroke-width="0.8"/><rect x="290.0" y="150.0" width="48.0" height="48.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="338.0" y="140.0" font-size="12" fill="#5E5850" text-anchor="middle">окно (i, j) →</text></g><g data-key="cols"><path d="M 392.0 200.0 L 418.0 200.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ic-arw)"/><g><rect x="424.0" y="90.0" width="108.0" height="192.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="436.0" y1="90.0" x2="436.0" y2="282.0" class="grid" opacity=".75"/><line x1="448.0" y1="90.0" x2="448.0" y2="282.0" class="grid" opacity=".75"/><line x1="460.0" y1="90.0" x2="460.0" y2="282.0" class="grid" opacity=".75"/><line x1="472.0" y1="90.0" x2="472.0" y2="282.0" class="grid" opacity=".75"/><line x1="484.0" y1="90.0" x2="484.0" y2="282.0" class="grid" opacity=".75"/><line x1="496.0" y1="90.0" x2="496.0" y2="282.0" class="grid" opacity=".75"/><line x1="508.0" y1="90.0" x2="508.0" y2="282.0" class="grid" opacity=".75"/><line x1="520.0" y1="90.0" x2="520.0" y2="282.0" class="grid" opacity=".75"/><line x1="424.0" y1="102.0" x2="532.0" y2="102.0" class="grid" opacity=".75"/><line x1="424.0" y1="114.0" x2="532.0" y2="114.0" class="grid" opacity=".75"/><line x1="424.0" y1="126.0" x2="532.0" y2="126.0" class="grid" opacity=".75"/><line x1="424.0" y1="138.0" x2="532.0" y2="138.0" class="grid" opacity=".75"/><line x1="424.0" y1="150.0" x2="532.0" y2="150.0" class="grid" opacity=".75"/><line x1="424.0" y1="162.0" x2="532.0" y2="162.0" class="grid" opacity=".75"/><line x1="424.0" y1="174.0" x2="532.0" y2="174.0" class="grid" opacity=".75"/><line x1="424.0" y1="186.0" x2="532.0" y2="186.0" class="grid" opacity=".75"/><line x1="424.0" y1="198.0" x2="532.0" y2="198.0" class="grid" opacity=".75"/><line x1="424.0" y1="210.0" x2="532.0" y2="210.0" class="grid" opacity=".75"/><line x1="424.0" y1="222.0" x2="532.0" y2="222.0" class="grid" opacity=".75"/><line x1="424.0" y1="234.0" x2="532.0" y2="234.0" class="grid" opacity=".75"/><line x1="424.0" y1="246.0" x2="532.0" y2="246.0" class="grid" opacity=".75"/><line x1="424.0" y1="258.0" x2="532.0" y2="258.0" class="grid" opacity=".75"/><line x1="424.0" y1="270.0" x2="532.0" y2="270.0" class="grid" opacity=".75"/></g><rect x="424.0" y="90.0" width="108.0" height="12.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="478.0" y="82.0" font-size="13" fill="#111111" text-anchor="middle">9</text><text x="416.0" y="190.0" font-size="13" fill="#111111" text-anchor="end">16</text><foreignObject x="438.0" y="286.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\text{cols}"></div></foreignObject></g><g data-key="km"><text x="548.0" y="190.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="562.0" y="138.0" width="24.0" height="108.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="574.0" y1="138.0" x2="574.0" y2="246.0" class="grid" opacity=".75"/><line x1="562.0" y1="150.0" x2="586.0" y2="150.0" class="grid" opacity=".75"/><line x1="562.0" y1="162.0" x2="586.0" y2="162.0" class="grid" opacity=".75"/><line x1="562.0" y1="174.0" x2="586.0" y2="174.0" class="grid" opacity=".75"/><line x1="562.0" y1="186.0" x2="586.0" y2="186.0" class="grid" opacity=".75"/><line x1="562.0" y1="198.0" x2="586.0" y2="198.0" class="grid" opacity=".75"/><line x1="562.0" y1="210.0" x2="586.0" y2="210.0" class="grid" opacity=".75"/><line x1="562.0" y1="222.0" x2="586.0" y2="222.0" class="grid" opacity=".75"/><line x1="562.0" y1="234.0" x2="586.0" y2="234.0" class="grid" opacity=".75"/></g><text x="574.0" y="130.0" font-size="13" fill="#111111" text-anchor="middle">2</text><foreignObject x="534.0" y="248.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="K_{mat}"></div></foreignObject></g><g data-key="bz"><text x="602.0" y="190.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="616.0" y="90.0" width="24.0" height="12.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="628.0" y1="90.0" x2="628.0" y2="102.0" class="grid" opacity=".75"/></g><text x="628.0" y="82.0" font-size="12" fill="#111111" text-anchor="middle">b</text><text x="652.0" y="190.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="666.0" y="90.0" width="24.0" height="192.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="678.0" y1="90.0" x2="678.0" y2="282.0" class="grid" opacity=".75"/><line x1="666.0" y1="102.0" x2="690.0" y2="102.0" class="grid" opacity=".75"/><line x1="666.0" y1="114.0" x2="690.0" y2="114.0" class="grid" opacity=".75"/><line x1="666.0" y1="126.0" x2="690.0" y2="126.0" class="grid" opacity=".75"/><line x1="666.0" y1="138.0" x2="690.0" y2="138.0" class="grid" opacity=".75"/><line x1="666.0" y1="150.0" x2="690.0" y2="150.0" class="grid" opacity=".75"/><line x1="666.0" y1="162.0" x2="690.0" y2="162.0" class="grid" opacity=".75"/><line x1="666.0" y1="174.0" x2="690.0" y2="174.0" class="grid" opacity=".75"/><line x1="666.0" y1="186.0" x2="690.0" y2="186.0" class="grid" opacity=".75"/><line x1="666.0" y1="198.0" x2="690.0" y2="198.0" class="grid" opacity=".75"/><line x1="666.0" y1="210.0" x2="690.0" y2="210.0" class="grid" opacity=".75"/><line x1="666.0" y1="222.0" x2="690.0" y2="222.0" class="grid" opacity=".75"/><line x1="666.0" y1="234.0" x2="690.0" y2="234.0" class="grid" opacity=".75"/><line x1="666.0" y1="246.0" x2="690.0" y2="246.0" class="grid" opacity=".75"/><line x1="666.0" y1="258.0" x2="690.0" y2="258.0" class="grid" opacity=".75"/><line x1="666.0" y1="270.0" x2="690.0" y2="270.0" class="grid" opacity=".75"/></g><text x="678.0" y="82.0" font-size="13" fill="#111111" text-anchor="middle">2</text><foreignObject x="638.0" y="286.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_{flat}"></div></foreignObject></g><g data-key="rs"><path d="M 696.0 190.0 L 742.0 190.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ic-arw)"/><text x="719.0" y="180.0" font-size="12" fill="#5E5850" text-anchor="middle">reshape</text><g><rect x="757.0" y="143.0" width="72.0" height="72.0" rx="2" fill="#7B4AB5" opacity="0.30250000000000005" stroke="#ffffff" stroke-width="1"/><line x1="775.0" y1="143.0" x2="775.0" y2="215.0" class="grid" opacity=".75"/><line x1="793.0" y1="143.0" x2="793.0" y2="215.0" class="grid" opacity=".75"/><line x1="811.0" y1="143.0" x2="811.0" y2="215.0" class="grid" opacity=".75"/><line x1="757.0" y1="161.0" x2="829.0" y2="161.0" class="grid" opacity=".75"/><line x1="757.0" y1="179.0" x2="829.0" y2="179.0" class="grid" opacity=".75"/><line x1="757.0" y1="197.0" x2="829.0" y2="197.0" class="grid" opacity=".75"/></g><g><rect x="750.0" y="150.0" width="72.0" height="72.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="768.0" y1="150.0" x2="768.0" y2="222.0" class="grid" opacity=".75"/><line x1="786.0" y1="150.0" x2="786.0" y2="222.0" class="grid" opacity=".75"/><line x1="804.0" y1="150.0" x2="804.0" y2="222.0" class="grid" opacity=".75"/><line x1="750.0" y1="168.0" x2="822.0" y2="168.0" class="grid" opacity=".75"/><line x1="750.0" y1="186.0" x2="822.0" y2="186.0" class="grid" opacity=".75"/><line x1="750.0" y1="204.0" x2="822.0" y2="204.0" class="grid" opacity=".75"/></g><foreignObject x="719.0" y="230.0" width="140.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z\ [2\times4\times4]"></div></foreignObject></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="340.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[16 \times 9] \cdot [9 \times 2] + [1 \times 2] = [16 \times 2]"></div></foreignObject><text x="615.0" y="410.0" font-size="13" fill="#C30B0A" text-anchor="middle">для батча строки всех картинок идут подряд: [B·16 × 9] · [9 × 2]</text><text x="615.0" y="430.0" font-size="13" fill="#C30B0A" text-anchor="middle">одна свёртка = одно матричное умножение, как у линейного слоя</text></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — картинки · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl img cols" data-focus="hl cols">
      <div class="step-kicker">Шаг 1 · окна в строки</div>
      <h4>Каждое окно — строка из 9 пикселей</h4>
      <p>Вырежем все 16 окон и положим друг под другом: матрица <code>cols [16 × 9]</code>. Пиксели повторяются — каждый входит в несколько окон, — зато дальше всё линейно.</p>
    </div>
    <div class="step-panel" data-on="hl cols km" data-focus="km">
      <div class="step-kicker">Шаг 2 · ядра в столбцы</div>
      <h4>Каждое ядро — столбец из 9 весов</h4>
      <p>Два ядра — два столбца: <code>K_mat [9 × 2]</code>. Это ровно матрица весов полносвязного слоя «9 входов → 2 выхода».</p>
    </div>
    <div class="step-panel" data-on="hl cols km bz" data-focus="bz">
      <div class="step-kicker">Шаг 3 · умножение</div>
      <h4>cols · K_mat + b</h4>
      <p>Строка «окно», столбец «ядро» — клетка «отклик ядра на окно». 16 × 2 = 32 числа — все клетки обоих каналов.</p>
    </div>
    <div class="step-panel" data-on="hl bz rs" data-focus="rs">
      <div class="step-kicker">Шаг 4 · обратно в картинку</div>
      <h4>Столбцы Z_flat — это карты</h4>
      <p>Каждый столбец из 16 чисел складывается обратно в 4 × 4. Никаких вычислений — только перестановка.</p>
    </div>
    <div class="step-panel" data-on="hl cols km bz f" data-focus="f">
      <div class="step-kicker">Шаг 5 · вывод</div>
      <h4>Свёртка — это линейный слой над окнами</h4>
      <p>Так свёртку и считают быстрые библиотеки. А для нас это значит, что обратный проход свёртки — это обратный проход линейного слоя, который мы уже знаем.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Шестнадцать окон первой картинки строками.</p>
<div class="stage" id="stage-icn" tabindex="0">
  <div class="stage-figure">
<svg id="icn" viewBox="0 0 960 760" role="img" aria-label="Числовой im2col первой картинки">
<style>
  #icn { font-family: Helvetica, Arial, sans-serif; }
  #icn .cap { font-size: 13px; fill: #5E5850; }
  #icn .lbl { font-size: 16px; fill: #111111; }
  #icn .legend { font-size: 13px; fill: #5E5850; }
  #icn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #icn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #icn .dim { font-size: 13px; fill: #5E5850; }
  #icn .nm { font-size: 16px; font-weight: 800; }
  #icn .op { font-size: 23px; fill: #5E5850; }
  #icn .arw { font-size: 12px; fill: #5E5850; }
  #icn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="icn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="icn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="icn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="icn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: im2col первой картинки</text><g data-key="cols"><g><rect x="123.5" y="70.0" width="153.0" height="272.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="140.5" y1="70.0" x2="140.5" y2="342.0" class="grid" opacity=".75"/><line x1="157.5" y1="70.0" x2="157.5" y2="342.0" class="grid" opacity=".75"/><line x1="174.5" y1="70.0" x2="174.5" y2="342.0" class="grid" opacity=".75"/><line x1="191.5" y1="70.0" x2="191.5" y2="342.0" class="grid" opacity=".75"/><line x1="208.5" y1="70.0" x2="208.5" y2="342.0" class="grid" opacity=".75"/><line x1="225.5" y1="70.0" x2="225.5" y2="342.0" class="grid" opacity=".75"/><line x1="242.5" y1="70.0" x2="242.5" y2="342.0" class="grid" opacity=".75"/><line x1="259.5" y1="70.0" x2="259.5" y2="342.0" class="grid" opacity=".75"/><line x1="123.5" y1="87.0" x2="276.5" y2="87.0" class="grid" opacity=".75"/><line x1="123.5" y1="104.0" x2="276.5" y2="104.0" class="grid" opacity=".75"/><line x1="123.5" y1="121.0" x2="276.5" y2="121.0" class="grid" opacity=".75"/><line x1="123.5" y1="138.0" x2="276.5" y2="138.0" class="grid" opacity=".75"/><line x1="123.5" y1="155.0" x2="276.5" y2="155.0" class="grid" opacity=".75"/><line x1="123.5" y1="172.0" x2="276.5" y2="172.0" class="grid" opacity=".75"/><line x1="123.5" y1="189.0" x2="276.5" y2="189.0" class="grid" opacity=".75"/><line x1="123.5" y1="206.0" x2="276.5" y2="206.0" class="grid" opacity=".75"/><line x1="123.5" y1="223.0" x2="276.5" y2="223.0" class="grid" opacity=".75"/><line x1="123.5" y1="240.0" x2="276.5" y2="240.0" class="grid" opacity=".75"/><line x1="123.5" y1="257.0" x2="276.5" y2="257.0" class="grid" opacity=".75"/><line x1="123.5" y1="274.0" x2="276.5" y2="274.0" class="grid" opacity=".75"/><line x1="123.5" y1="291.0" x2="276.5" y2="291.0" class="grid" opacity=".75"/><line x1="123.5" y1="308.0" x2="276.5" y2="308.0" class="grid" opacity=".75"/><line x1="123.5" y1="325.0" x2="276.5" y2="325.0" class="grid" opacity=".75"/></g><text x="200.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">9</text><text x="113.5" y="210.0" font-size="13" fill="#111111" text-anchor="end">16</text><foreignObject x="110.0" y="345.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\text{cols}"></div></foreignObject><foreignObject x="20.0" y="372.0" width="360.0" height="354.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0 &amp; 0.0 &amp; 0.9 &amp; 0.0 &amp; 0.0 &amp; 1.0 &amp; 0.0 &amp; 0.0 &amp; 0.8 \\ 0.0 &amp; 0.9 &amp; 0.4 &amp; 0.0 &amp; 1.0 &amp; 0.5 &amp; 0.0 &amp; 0.8 &amp; 0.3 \\ 0.9 &amp; 0.4 &amp; 0.0 &amp; 1.0 &amp; 0.5 &amp; 0.0 &amp; 0.8 &amp; 0.3 &amp; 0.0 \\ 0.4 &amp; 0.0 &amp; 0.0 &amp; 0.5 &amp; 0.0 &amp; 0.0 &amp; 0.3 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 1.0 &amp; 0.0 &amp; 0.0 &amp; 0.8 &amp; 0.0 &amp; 0.0 &amp; 1.0 \\ 0.0 &amp; 1.0 &amp; 0.5 &amp; 0.0 &amp; 0.8 &amp; 0.3 &amp; 0.0 &amp; 1.0 &amp; 0.6 \\ 1.0 &amp; 0.5 &amp; 0.0 &amp; 0.8 &amp; 0.3 &amp; 0.0 &amp; 1.0 &amp; 0.6 &amp; 0.0 \\ 0.5 &amp; 0.0 &amp; 0.0 &amp; 0.3 &amp; 0.0 &amp; 0.0 &amp; 0.6 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 0.8 &amp; 0.0 &amp; 0.0 &amp; 1.0 &amp; 0.0 &amp; 0.0 &amp; 0.7 \\ 0.0 &amp; 0.8 &amp; 0.3 &amp; 0.0 &amp; 1.0 &amp; 0.6 &amp; 0.0 &amp; 0.7 &amp; 0.5 \\ 0.8 &amp; 0.3 &amp; 0.0 &amp; 1.0 &amp; 0.6 &amp; 0.0 &amp; 0.7 &amp; 0.5 &amp; 0.0 \\ 0.3 &amp; 0.0 &amp; 0.0 &amp; 0.6 &amp; 0.0 &amp; 0.0 &amp; 0.5 &amp; 0.0 &amp; 0.0 \\ 0.0 &amp; 0.0 &amp; 1.0 &amp; 0.0 &amp; 0.0 &amp; 0.7 &amp; 0.0 &amp; 0.0 &amp; 0.9 \\ 0.0 &amp; 1.0 &amp; 0.6 &amp; 0.0 &amp; 0.7 &amp; 0.5 &amp; 0.0 &amp; 0.9 &amp; 0.4 \\ 1.0 &amp; 0.6 &amp; 0.0 &amp; 0.7 &amp; 0.5 &amp; 0.0 &amp; 0.9 &amp; 0.4 &amp; 0.0 \\ 0.6 &amp; 0.0 &amp; 0.0 &amp; 0.5 &amp; 0.0 &amp; 0.0 &amp; 0.4 &amp; 0.0 &amp; 0.0\end{bmatrix}"></div></foreignObject></g><g data-key="km"><text x="400.0" y="190.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="463.0" y="70.0" width="34.0" height="153.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="480.0" y1="70.0" x2="480.0" y2="223.0" class="grid" opacity=".75"/><line x1="463.0" y1="87.0" x2="497.0" y2="87.0" class="grid" opacity=".75"/><line x1="463.0" y1="104.0" x2="497.0" y2="104.0" class="grid" opacity=".75"/><line x1="463.0" y1="121.0" x2="497.0" y2="121.0" class="grid" opacity=".75"/><line x1="463.0" y1="138.0" x2="497.0" y2="138.0" class="grid" opacity=".75"/><line x1="463.0" y1="155.0" x2="497.0" y2="155.0" class="grid" opacity=".75"/><line x1="463.0" y1="172.0" x2="497.0" y2="172.0" class="grid" opacity=".75"/><line x1="463.0" y1="189.0" x2="497.0" y2="189.0" class="grid" opacity=".75"/><line x1="463.0" y1="206.0" x2="497.0" y2="206.0" class="grid" opacity=".75"/></g><text x="480.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="453.0" y="150.5" font-size="13" fill="#111111" text-anchor="end">9</text><foreignObject x="390.0" y="226.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="K_{mat}"></div></foreignObject><foreignObject x="415.0" y="253.0" width="130.0" height="207.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.3 &amp; -0.2 \\ 0.2 &amp; 0.3 \\ -0.2 &amp; 0.4 \\ -0.5 &amp; 0.1 \\ 0.4 &amp; 0.6 \\ -0.2 &amp; 0.8 \\ 0.0 &amp; 0.5 \\ 0.4 &amp; 0.3 \\ 1.3 &amp; 0.7\end{bmatrix}"></div></foreignObject></g><g data-key="zf"><text x="580.0" y="190.0" font-size="15" fill="#111111" text-anchor="middle">+ b =</text><g><rect x="683.0" y="70.0" width="34.0" height="272.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="700.0" y1="70.0" x2="700.0" y2="342.0" class="grid" opacity=".75"/><line x1="683.0" y1="87.0" x2="717.0" y2="87.0" class="grid" opacity=".75"/><line x1="683.0" y1="104.0" x2="717.0" y2="104.0" class="grid" opacity=".75"/><line x1="683.0" y1="121.0" x2="717.0" y2="121.0" class="grid" opacity=".75"/><line x1="683.0" y1="138.0" x2="717.0" y2="138.0" class="grid" opacity=".75"/><line x1="683.0" y1="155.0" x2="717.0" y2="155.0" class="grid" opacity=".75"/><line x1="683.0" y1="172.0" x2="717.0" y2="172.0" class="grid" opacity=".75"/><line x1="683.0" y1="189.0" x2="717.0" y2="189.0" class="grid" opacity=".75"/><line x1="683.0" y1="206.0" x2="717.0" y2="206.0" class="grid" opacity=".75"/><line x1="683.0" y1="223.0" x2="717.0" y2="223.0" class="grid" opacity=".75"/><line x1="683.0" y1="240.0" x2="717.0" y2="240.0" class="grid" opacity=".75"/><line x1="683.0" y1="257.0" x2="717.0" y2="257.0" class="grid" opacity=".75"/><line x1="683.0" y1="274.0" x2="717.0" y2="274.0" class="grid" opacity=".75"/><line x1="683.0" y1="291.0" x2="717.0" y2="291.0" class="grid" opacity=".75"/><line x1="683.0" y1="308.0" x2="717.0" y2="308.0" class="grid" opacity=".75"/><line x1="683.0" y1="325.0" x2="717.0" y2="325.0" class="grid" opacity=".75"/></g><text x="700.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="673.0" y="210.0" font-size="13" fill="#111111" text-anchor="end">16</text><foreignObject x="610.0" y="345.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_{flat}"></div></foreignObject><foreignObject x="625.0" y="372.0" width="150.0" height="354.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.76 &amp; 1.82 \\ 1.21 &amp; 1.98 \\ -0.27 &amp; 0.93 \\ -0.27 &amp; 0.22 \\ 1.04 &amp; 1.84 \\ 1.64 &amp; 2.04 \\ -0.14 &amp; 0.99 \\ -0.20 &amp; 0.33 \\ 0.65 &amp; 1.71 \\ 1.41 &amp; 2.10 \\ -0.14 &amp; 0.99 \\ -0.29 &amp; 0.35 \\ 0.93 &amp; 1.69 \\ 1.24 &amp; 2.01 \\ -0.07 &amp; 1.02 \\ -0.33 &amp; 0.23\end{bmatrix}"></div></foreignObject></g><g data-key="same" data-only="1"><rect x="683.0" y="155.0" width="34.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="790.0" y="180.0" font-size="13" fill="#3576C0" text-anchor="start">строка 5 = окно (1, 1):</text><text x="790.0" y="198.0" font-size="13" fill="#3576C0" text-anchor="start">1.64 и 2.04</text><text x="790.0" y="230.0" font-size="13" fill="#3576C0" text-anchor="start">расхождение с циклом</text><text x="790.0" y="248.0" font-size="13" fill="#3576C0" text-anchor="start">по окнам — ровно 0</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="cols" data-focus="cols">
      <div class="step-kicker">Шаг 1 · окна</div>
      <h4>16 строк по 9 пикселей</h4>
      <p>Строка k — окно с левым верхним углом (k // 4, k mod 4), пиксели по строкам окна. Первые столбцы почти везде нули: окна слева от полосы пустые.</p>
    </div>
    <div class="step-panel" data-on="cols km" data-focus="km">
      <div class="step-kicker">Шаг 2 · ядра</div>
      <h4>Два столбца весов</h4>
      <p>Первый столбец — ядро K₁, развёрнутое по строкам; второй — K₂.</p>
    </div>
    <div class="step-panel" data-on="cols km zf" data-focus="zf">
      <div class="step-kicker">Шаг 3 · произведение</div>
      <h4>Z_flat [16 × 2]</h4>
      <p>Первый столбец — карта первого канала, прочитанная по строкам; второй — второго канала.</p>
    </div>
    <div class="step-panel" data-on="zf same" data-focus="same">
      <div class="step-kicker">Шаг 4 · сверка</div>
      <h4>То же, что в части 4</h4>
      <p>Ни одно число не отличается от посчитанного окно за окном.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> после im2col свёрточный слой — обычный линейный слой <code>[окна × 9] · [9 × каналы]</code>; всё, что мы знаем о линейных слоях, включая обратный проход, переносится на свёртку.
</div>

---


## Часть 6. ReLU и max-пулинг

<p>
  После свёртки — поэлементная ReLU и пулинг: карта режется на непересекающиеся квадраты 2 × 2, из
  каждого остаётся максимум.
</p>
<div class="math-display" data-tex="A = \max(0,\ Z), \qquad P_p[b, c, i, j] = \max_{u,v \in \{0,1\}} A[b, c, 2i+u, 2j+v]"></div>
<div class="stage" id="stage-pl" tabindex="0">
  <div class="stage-figure">
<svg id="pl" viewBox="0 0 960 620" role="img" aria-label="ReLU и max-пулинг 2 на 2">
<style>
  #pl { font-family: Helvetica, Arial, sans-serif; }
  #pl .cap { font-size: 13px; fill: #5E5850; }
  #pl .lbl { font-size: 16px; fill: #111111; }
  #pl .legend { font-size: 13px; fill: #5E5850; }
  #pl .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #pl .grid { stroke: #ffffff; stroke-width: 1.35; }
  #pl .dim { font-size: 13px; fill: #5E5850; }
  #pl .nm { font-size: 16px; font-weight: 800; }
  #pl .op { font-size: 23px; fill: #5E5850; }
  #pl .arw { font-size: 12px; fill: #5E5850; }
  #pl .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="pl-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="pl-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="pl-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="pl-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="296" width="190" height="152" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="372.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 372)">свёрточный блок</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#pl-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#pl-arw)"/><path d="M 125 356 L 125 338" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#pl-arw)"/><path d="M 125 304 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#pl-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#pl-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#pl-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#pl-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#pl-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#pl-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Conv 3×3</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#8A857C" text-anchor="middle">MaxPool 2×2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#C30B0A" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#C30B0A" text-anchor="middle">MaxPool 2×2</text><rect x="34" y="298" width="182" height="94" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="z"><g><rect x="300.0" y="160.0" width="104.0" height="104.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="326.0" y1="160.0" x2="326.0" y2="264.0" class="grid" opacity=".75"/><line x1="352.0" y1="160.0" x2="352.0" y2="264.0" class="grid" opacity=".75"/><line x1="378.0" y1="160.0" x2="378.0" y2="264.0" class="grid" opacity=".75"/><line x1="300.0" y1="186.0" x2="404.0" y2="186.0" class="grid" opacity=".75"/><line x1="300.0" y1="212.0" x2="404.0" y2="212.0" class="grid" opacity=".75"/><line x1="300.0" y1="238.0" x2="404.0" y2="238.0" class="grid" opacity=".75"/></g><text x="352.0" y="152.0" font-size="13" fill="#111111" text-anchor="middle">4 × 4</text><foreignObject x="312.0" y="268.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_{0,0}"></div></foreignObject></g><g data-key="relu"><path d="M 410.0 212.0 L 446.0 212.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#pl-arw)"/><text x="428.0" y="202.0" font-size="12" fill="#5E5850" text-anchor="middle">ReLU</text><g><rect x="450.0" y="160.0" width="104.0" height="104.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="476.0" y1="160.0" x2="476.0" y2="264.0" class="grid" opacity=".75"/><line x1="502.0" y1="160.0" x2="502.0" y2="264.0" class="grid" opacity=".75"/><line x1="528.0" y1="160.0" x2="528.0" y2="264.0" class="grid" opacity=".75"/><line x1="450.0" y1="186.0" x2="554.0" y2="186.0" class="grid" opacity=".75"/><line x1="450.0" y1="212.0" x2="554.0" y2="212.0" class="grid" opacity=".75"/><line x1="450.0" y1="238.0" x2="554.0" y2="238.0" class="grid" opacity=".75"/></g><rect x="503.0" y="161.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="529.0" y="161.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="503.0" y="187.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="529.0" y="187.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="503.0" y="213.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="529.0" y="213.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="503.0" y="239.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="529.0" y="239.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><foreignObject x="462.0" y="268.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_{0,0}"></div></foreignObject></g><g data-key="grid"><rect x="450" y="160" width="52" height="52" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="502" y="160" width="52" height="52" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="450" y="212" width="52" height="52" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="502" y="212" width="52" height="52" fill="none" stroke="#3576C0" stroke-width="2.4"/></g><g data-key="p"><path d="M 560.0 212.0 L 604.0 212.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#pl-arw)"/><text x="582.0" y="202.0" font-size="12" fill="#5E5850" text-anchor="middle">max</text><g><rect x="610.0" y="186.0" width="52.0" height="52.0" rx="2" fill="#3576C0" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="636.0" y1="186.0" x2="636.0" y2="238.0" class="grid" opacity=".75"/><line x1="610.0" y1="212.0" x2="662.0" y2="212.0" class="grid" opacity=".75"/></g><foreignObject x="596.0" y="246.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P_{0,0}"></div></foreignObject></g><g data-key="win" data-only="1"><circle cx="489" cy="199" r="6" fill="#C30B0A"/><circle cx="489" cy="225" r="6" fill="#C30B0A"/><text x="700.0" y="190.0" font-size="13" fill="#C30B0A" text-anchor="start">красная точка —</text><text x="700.0" y="208.0" font-size="13" fill="#C30B0A" text-anchor="start">победитель окна</text></g><g data-key="dead" data-only="1"><rect x="502.0" y="160.0" width="52.0" height="104.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="636.0" y="186.0" width="26.0" height="52.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="700.0" y="250.0" font-size="13" fill="#C30B0A" text-anchor="start">правые окна целиком</text><text x="700.0" y="268.0" font-size="13" fill="#C30B0A" text-anchor="start">нулевые → max = 0</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="330.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="p_{ij} = \max_{u,v \in \{0,1\}} a_{2i+u,\,2j+v}, \qquad [B \times 2 \times 4 \times 4] \to [B \times 2 \times 2 \times 2]"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — картинки · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче · синее — после пулинга</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl z" data-focus="hl z">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>Карта первого канала первой картинки</h4>
      <p>Та же Z, что в части 4. Разберём одну карту; остальные три обрабатываются так же и независимо.</p>
    </div>
    <div class="step-panel" data-on="hl z relu" data-focus="relu">
      <div class="step-kicker">Шаг 2 · ReLU</div>
      <h4>Отрицательное → 0</h4>
      <p>Правая половина карты гаснет целиком: там ядро отвечало минусом.</p>
    </div>
    <div class="step-panel" data-on="hl relu grid p" data-focus="grid p">
      <div class="step-kicker">Шаг 3 · пулинг</div>
      <h4>Четыре окна 2 × 2 → четыре числа</h4>
      <p>Окна не перекрываются (шаг 2). Из каждого берётся максимум: карта 4 × 4 превращается в 2 × 2.</p>
    </div>
    <div class="step-panel" data-on="hl relu grid p win" data-focus="win">
      <div class="step-kicker">Шаг 4 · победители</div>
      <h4>Выживает одна клетка из четырёх</h4>
      <p>Пулинг запоминает, откуда взят максимум. На обратном пути градиент пойдёт только туда — остальные три клетки окна его не получат.</p>
    </div>
    <div class="step-panel" data-on="hl relu grid p dead f" data-focus="dead f">
      <div class="step-kicker">Шаг 5 · пустые окна</div>
      <h4>Максимум из нулей — ноль</h4>
      <p>Два правых окна состоят из нулей ReLU: пулинг выдаёт 0, и через них градиент не пройдёт вообще. У второй картинки в первом канале так же умирают два нижних окна.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>ReLU и пулинг обеих карт первой картинки.</p>
<div class="stage" id="stage-pln" tabindex="0">
  <div class="stage-figure">
<svg id="pln" viewBox="0 0 960 460" role="img" aria-label="Числовой ReLU и пулинг первой картинки">
<style>
  #pln { font-family: Helvetica, Arial, sans-serif; }
  #pln .cap { font-size: 13px; fill: #5E5850; }
  #pln .lbl { font-size: 16px; fill: #111111; }
  #pln .legend { font-size: 13px; fill: #5E5850; }
  #pln .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #pln .grid { stroke: #ffffff; stroke-width: 1.35; }
  #pln .dim { font-size: 13px; fill: #5E5850; }
  #pln .nm { font-size: 16px; font-weight: 800; }
  #pln .op { font-size: 23px; fill: #5E5850; }
  #pln .arw { font-size: 12px; fill: #5E5850; }
  #pln .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="pln-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="pln-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="pln-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="pln-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: A и пулинг первой картинки</text><g data-key="a0"><text x="200.0" y="46.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">канал 1</text><g><rect x="166.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="183.0" y1="70.0" x2="183.0" y2="138.0" class="grid" opacity=".75"/><line x1="200.0" y1="70.0" x2="200.0" y2="138.0" class="grid" opacity=".75"/><line x1="217.0" y1="70.0" x2="217.0" y2="138.0" class="grid" opacity=".75"/><line x1="166.0" y1="87.0" x2="234.0" y2="87.0" class="grid" opacity=".75"/><line x1="166.0" y1="104.0" x2="234.0" y2="104.0" class="grid" opacity=".75"/><line x1="166.0" y1="121.0" x2="234.0" y2="121.0" class="grid" opacity=".75"/></g><text x="200.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="156.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="110.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_{0,0}"></div></foreignObject><foreignObject x="80.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.76 &amp; 1.21 &amp; 0.00 &amp; 0.00 \\ 1.04 &amp; 1.64 &amp; 0.00 &amp; 0.00 \\ 0.65 &amp; 1.41 &amp; 0.00 &amp; 0.00 \\ 0.93 &amp; 1.24 &amp; 0.00 &amp; 0.00\end{bmatrix}"></div></foreignObject></g><g data-key="p0"><path d="M 330.0 104.0 L 370.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#pln-arw)"/><g><rect x="413.0" y="78.0" width="34.0" height="34.0" rx="2" fill="#3576C0" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="430.0" y1="78.0" x2="430.0" y2="112.0" class="grid" opacity=".75"/><line x1="413.0" y1="95.0" x2="447.0" y2="95.0" class="grid" opacity=".75"/></g><text x="430.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="403.0" y="99.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="340.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P_{0,0}"></div></foreignObject><foreignObject x="360.0" y="142.0" width="140.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.64 &amp; 0.00 \\ 1.41 &amp; 0.00\end{bmatrix}"></div></foreignObject></g><g data-key="a1"><text x="640.0" y="46.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">канал 2</text><g><rect x="606.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="623.0" y1="70.0" x2="623.0" y2="138.0" class="grid" opacity=".75"/><line x1="640.0" y1="70.0" x2="640.0" y2="138.0" class="grid" opacity=".75"/><line x1="657.0" y1="70.0" x2="657.0" y2="138.0" class="grid" opacity=".75"/><line x1="606.0" y1="87.0" x2="674.0" y2="87.0" class="grid" opacity=".75"/><line x1="606.0" y1="104.0" x2="674.0" y2="104.0" class="grid" opacity=".75"/><line x1="606.0" y1="121.0" x2="674.0" y2="121.0" class="grid" opacity=".75"/></g><text x="640.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="596.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="550.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_{0,1}"></div></foreignObject><foreignObject x="520.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.82 &amp; 1.98 &amp; 0.93 &amp; 0.22 \\ 1.84 &amp; 2.04 &amp; 0.99 &amp; 0.33 \\ 1.71 &amp; 2.10 &amp; 0.99 &amp; 0.35 \\ 1.69 &amp; 2.01 &amp; 1.02 &amp; 0.23\end{bmatrix}"></div></foreignObject></g><g data-key="p1"><path d="M 770.0 104.0 L 810.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#pln-arw)"/><g><rect x="853.0" y="78.0" width="34.0" height="34.0" rx="2" fill="#3576C0" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="870.0" y1="78.0" x2="870.0" y2="112.0" class="grid" opacity=".75"/><line x1="853.0" y1="95.0" x2="887.0" y2="95.0" class="grid" opacity=".75"/></g><text x="870.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="843.0" y="99.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="780.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P_{0,1}"></div></foreignObject><foreignObject x="800.0" y="142.0" width="140.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2.04 &amp; 0.99 \\ 2.10 &amp; 1.02\end{bmatrix}"></div></foreignObject></g><g data-key="fl" data-only="1"><foreignObject x="20.0" y="320.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="F_0 = (1.64,\ 0,\ 1.41,\ 0,\ 2.04,\ 0.99,\ 2.10,\ 1.02)"></div></foreignObject><text x="480.0" y="390.0" font-size="13" fill="#5E5850" text-anchor="middle">выпрямление: сначала канал 1 по строкам, потом канал 2</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="a0" data-focus="a0">
      <div class="step-kicker">Шаг 1 · ReLU</div>
      <h4>Восемь нулей в первом канале</h4>
      <p>Столбцы 2 и 3 обнулены целиком.</p>
    </div>
    <div class="step-panel" data-on="a0 p0" data-focus="p0">
      <div class="step-kicker">Шаг 2 · пулинг</div>
      <h4>1.64, 0, 1.41, 0</h4>
      <p>Максимумы левых окон — 1.64 и 1.41, правых — нули.</p>
    </div>
    <div class="step-panel" data-on="a1 p1" data-focus="a1 p1">
      <div class="step-kicker">Шаг 3 · второй канал</div>
      <h4>Нулей нет</h4>
      <p>Все 16 клеток положительны, пулинг выдаёт 2.04, 0.99, 2.10, 1.02.</p>
    </div>
    <div class="step-panel" data-on="p0 p1 fl" data-focus="fl">
      <div class="step-kicker">Шаг 4 · признаки</div>
      <h4>Восемь чисел картинки</h4>
      <p>Это всё, что классификатор узнает о первой картинке. Четвёртое число — ноль и у второй картинки тоже, так что соответствующая строка весов классификатора сейчас бесполезна.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> пулинг уменьшает пространство без параметров и запоминает победителя каждого окна — это понадобится на обратном пути.
</div>

---


## Часть 7. Выпрямление, классификатор и потеря

<p>
  Свёрточная часть закончилась тензором <code>[2 × 2 × 2 × 2]</code>. Классификатору нужна матрица:
  оси канала и пространства склеиваются в одну, дальше — полносвязный слой, softmax и
  кросс-энтропия:
</p>
<div class="math-display" data-tex="F = \text{flatten}(P_p) \in \mathbb{R}^{B \times 8}, \qquad Z_y = F W + b, \qquad L = -\frac{1}{B}\sum_b \log p_{b,\,y_b}"></div>
<div class="stage" id="stage-fl" tabindex="0">
  <div class="stage-figure">
<svg id="fl" viewBox="0 0 960 620" role="img" aria-label="Выпрямление, линейный слой, softmax и потеря">
<style>
  #fl { font-family: Helvetica, Arial, sans-serif; }
  #fl .cap { font-size: 13px; fill: #5E5850; }
  #fl .lbl { font-size: 16px; fill: #111111; }
  #fl .legend { font-size: 13px; fill: #5E5850; }
  #fl .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #fl .grid { stroke: #ffffff; stroke-width: 1.35; }
  #fl .dim { font-size: 13px; fill: #5E5850; }
  #fl .nm { font-size: 16px; font-weight: 800; }
  #fl .op { font-size: 23px; fill: #5E5850; }
  #fl .arw { font-size: 12px; fill: #5E5850; }
  #fl .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="fl-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="fl-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="fl-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="fl-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="296" width="190" height="152" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="372.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 372)">свёрточный блок</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#fl-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#fl-arw)"/><path d="M 125 356 L 125 338" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#fl-arw)"/><path d="M 125 304 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#fl-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#fl-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#fl-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#fl-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#fl-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#fl-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Conv 3×3</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#8A857C" text-anchor="middle">MaxPool 2×2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#C30B0A" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#C30B0A" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#C30B0A" text-anchor="middle">Cross-Entropy</text><rect x="34" y="70" width="182" height="210" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="pool"><g><rect x="307.0" y="113.0" width="44.0" height="44.0" rx="2" fill="#3576C0" opacity="0.341" stroke="#ffffff" stroke-width="1"/><line x1="329.0" y1="113.0" x2="329.0" y2="157.0" class="grid" opacity=".75"/><line x1="307.0" y1="135.0" x2="351.0" y2="135.0" class="grid" opacity=".75"/></g><g><rect x="300.0" y="120.0" width="44.0" height="44.0" rx="2" fill="#3576C0" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="322.0" y1="120.0" x2="322.0" y2="164.0" class="grid" opacity=".75"/><line x1="300.0" y1="142.0" x2="344.0" y2="142.0" class="grid" opacity=".75"/></g><text x="330.0" y="102.0" font-size="12" fill="#111111" text-anchor="middle">[2 × 2 × 2]</text><text x="330.0" y="190.0" font-size="12" fill="#5E5850" text-anchor="middle">× B = 2</text></g><g data-key="flat"><path d="M 356.0 140.0 L 414.0 150.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#fl-arw)"/><text x="385.0" y="132.0" font-size="12" fill="#5E5850" text-anchor="middle">flatten</text><g><rect x="420.0" y="140.0" width="176.0" height="44.0" rx="2" fill="#3576C0" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="442.0" y1="140.0" x2="442.0" y2="184.0" class="grid" opacity=".75"/><line x1="464.0" y1="140.0" x2="464.0" y2="184.0" class="grid" opacity=".75"/><line x1="486.0" y1="140.0" x2="486.0" y2="184.0" class="grid" opacity=".75"/><line x1="508.0" y1="140.0" x2="508.0" y2="184.0" class="grid" opacity=".75"/><line x1="530.0" y1="140.0" x2="530.0" y2="184.0" class="grid" opacity=".75"/><line x1="552.0" y1="140.0" x2="552.0" y2="184.0" class="grid" opacity=".75"/><line x1="574.0" y1="140.0" x2="574.0" y2="184.0" class="grid" opacity=".75"/><line x1="420.0" y1="162.0" x2="596.0" y2="162.0" class="grid" opacity=".75"/></g><text x="508.0" y="132.0" font-size="13" fill="#111111" text-anchor="middle">8</text><foreignObject x="478.0" y="188.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="F"></div></foreignObject></g><g data-key="lin"><text x="610.0" y="166.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="626.0" y="90.0" width="44.0" height="176.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="648.0" y1="90.0" x2="648.0" y2="266.0" class="grid" opacity=".75"/><line x1="626.0" y1="112.0" x2="670.0" y2="112.0" class="grid" opacity=".75"/><line x1="626.0" y1="134.0" x2="670.0" y2="134.0" class="grid" opacity=".75"/><line x1="626.0" y1="156.0" x2="670.0" y2="156.0" class="grid" opacity=".75"/><line x1="626.0" y1="178.0" x2="670.0" y2="178.0" class="grid" opacity=".75"/><line x1="626.0" y1="200.0" x2="670.0" y2="200.0" class="grid" opacity=".75"/><line x1="626.0" y1="222.0" x2="670.0" y2="222.0" class="grid" opacity=".75"/><line x1="626.0" y1="244.0" x2="670.0" y2="244.0" class="grid" opacity=".75"/></g><text x="648.0" y="82.0" font-size="13" fill="#111111" text-anchor="middle">2</text><foreignObject x="618.0" y="270.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W"></div></foreignObject><text x="684.0" y="166.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="700.0" y="140.0" width="44.0" height="22.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="722.0" y1="140.0" x2="722.0" y2="162.0" class="grid" opacity=".75"/></g><foreignObject x="697.0" y="166.0" width="50.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b"></div></foreignObject><text x="760.0" y="166.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="776.0" y="140.0" width="44.0" height="44.0" rx="2" fill="#C29E08" opacity="0.35" stroke="#ffffff" stroke-width="1"/><line x1="798.0" y1="140.0" x2="798.0" y2="184.0" class="grid" opacity=".75"/><line x1="776.0" y1="162.0" x2="820.0" y2="162.0" class="grid" opacity=".75"/></g><foreignObject x="768.0" y="188.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_y"></div></foreignObject></g><g data-key="sm"><path d="M 826.0 162.0 L 856.0 162.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#fl-arw)"/><g><rect x="860.0" y="140.0" width="44.0" height="44.0" rx="2" fill="#E88919" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="882.0" y1="140.0" x2="882.0" y2="184.0" class="grid" opacity=".75"/><line x1="860.0" y1="162.0" x2="904.0" y2="162.0" class="grid" opacity=".75"/></g><foreignObject x="857.0" y="188.0" width="50.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P"></div></foreignObject></g><g data-key="ce" data-only="1"><foreignObject x="290.0" y="330.0" width="650.0" height="50.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L = -\dfrac{1}{B}\sum_{b} \log p_{b,\,y_b}, \qquad \ln 2 = 0.6931"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — картинки · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче · оранжевое — вероятности</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl pool" data-focus="hl pool">
      <div class="step-kicker">Шаг 1 · что осталось</div>
      <h4>Две карты 2 × 2 на картинку</h4>
      <p>Свёрточная часть закончилась: из 36 пикселей получилось 8 признаков.</p>
    </div>
    <div class="step-panel" data-on="hl pool flat" data-focus="flat">
      <div class="step-kicker">Шаг 2 · выпрямление</div>
      <h4>Тензор → матрица [B × 8]</h4>
      <p>Оси канала, строки и столбца склеиваются в одну. Порядок — любой, лишь бы одинаковый всегда; здесь по каналам, внутри — по строкам.</p>
    </div>
    <div class="step-panel" data-on="hl flat lin" data-focus="lin">
      <div class="step-kicker">Шаг 3 · линейный слой</div>
      <h4>[2 × 8] · [8 × 2] + [1 × 2]</h4>
      <p>Классификатор — обычный полносвязный слой из статьи про MLP.</p>
    </div>
    <div class="step-panel" data-on="hl lin sm" data-focus="sm">
      <div class="step-kicker">Шаг 4 · softmax</div>
      <h4>Вероятность двух классов</h4>
      <p>Строка на картинку, столбец на класс.</p>
    </div>
    <div class="step-panel" data-on="hl sm ce" data-focus="ce">
      <div class="step-kicker">Шаг 5 · потеря</div>
      <h4>Средняя кросс-энтропия</h4>
      <p>Ориентир для двух классов — ln 2.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Восемь признаков, логиты, вероятности и потеря.</p>
<div class="stage" id="stage-fln" tabindex="0">
  <div class="stage-figure">
<svg id="fln" viewBox="0 0 960 600" role="img" aria-label="Числовой расчёт классификатора">
<style>
  #fln { font-family: Helvetica, Arial, sans-serif; }
  #fln .cap { font-size: 13px; fill: #5E5850; }
  #fln .lbl { font-size: 16px; fill: #111111; }
  #fln .legend { font-size: 13px; fill: #5E5850; }
  #fln .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #fln .grid { stroke: #ffffff; stroke-width: 1.35; }
  #fln .dim { font-size: 13px; fill: #5E5850; }
  #fln .nm { font-size: 16px; font-weight: 800; }
  #fln .op { font-size: 23px; fill: #5E5850; }
  #fln .arw { font-size: 12px; fill: #5E5850; }
  #fln .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="fln-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="fln-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="fln-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="fln-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: F · W + b → P → L</text><g data-key="f"><g><rect x="152.0" y="70.0" width="136.0" height="34.0" rx="2" fill="#3576C0" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="169.0" y1="70.0" x2="169.0" y2="104.0" class="grid" opacity=".75"/><line x1="186.0" y1="70.0" x2="186.0" y2="104.0" class="grid" opacity=".75"/><line x1="203.0" y1="70.0" x2="203.0" y2="104.0" class="grid" opacity=".75"/><line x1="220.0" y1="70.0" x2="220.0" y2="104.0" class="grid" opacity=".75"/><line x1="237.0" y1="70.0" x2="237.0" y2="104.0" class="grid" opacity=".75"/><line x1="254.0" y1="70.0" x2="254.0" y2="104.0" class="grid" opacity=".75"/><line x1="271.0" y1="70.0" x2="271.0" y2="104.0" class="grid" opacity=".75"/><line x1="152.0" y1="87.0" x2="288.0" y2="87.0" class="grid" opacity=".75"/></g><text x="220.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">8</text><text x="142.0" y="91.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="130.0" y="107.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="F"></div></foreignObject><foreignObject x="5.0" y="134.0" width="430.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.64 &amp; 0.00 &amp; 1.41 &amp; 0.00 &amp; 2.04 &amp; 0.99 &amp; 2.10 &amp; 1.02 \\ 1.64 &amp; 1.37 &amp; 0.00 &amp; 0.00 &amp; 2.34 &amp; 2.14 &amp; 1.80 &amp; 1.61\end{bmatrix}"></div></foreignObject></g><g data-key="w"><text x="450.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="523.0" y="62.0" width="34.0" height="136.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="540.0" y1="62.0" x2="540.0" y2="198.0" class="grid" opacity=".75"/><line x1="523.0" y1="79.0" x2="557.0" y2="79.0" class="grid" opacity=".75"/><line x1="523.0" y1="96.0" x2="557.0" y2="96.0" class="grid" opacity=".75"/><line x1="523.0" y1="113.0" x2="557.0" y2="113.0" class="grid" opacity=".75"/><line x1="523.0" y1="130.0" x2="557.0" y2="130.0" class="grid" opacity=".75"/><line x1="523.0" y1="147.0" x2="557.0" y2="147.0" class="grid" opacity=".75"/><line x1="523.0" y1="164.0" x2="557.0" y2="164.0" class="grid" opacity=".75"/><line x1="523.0" y1="181.0" x2="557.0" y2="181.0" class="grid" opacity=".75"/></g><text x="540.0" y="54.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="513.0" y="134.0" font-size="13" fill="#111111" text-anchor="end">8</text><foreignObject x="450.0" y="201.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W"></div></foreignObject><foreignObject x="475.0" y="228.0" width="130.0" height="186.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2 &amp; 0.4 \\ 0.0 &amp; 0.7 \\ 0.0 &amp; 0.6 \\ 0.1 &amp; -0.3 \\ -0.3 &amp; -0.1 \\ -0.2 &amp; 0.4 \\ 0.4 &amp; -0.4 \\ -0.1 &amp; 0.1\end{bmatrix}"></div></foreignObject><text x="640.0" y="104.0" font-size="15" fill="#111111" text-anchor="middle">+ b =</text></g><g data-key="z"><g><rect x="763.0" y="70.0" width="34.0" height="34.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="780.0" y1="70.0" x2="780.0" y2="104.0" class="grid" opacity=".75"/><line x1="763.0" y1="87.0" x2="797.0" y2="87.0" class="grid" opacity=".75"/></g><text x="780.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="753.0" y="91.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="690.0" y="107.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_y"></div></foreignObject><foreignObject x="695.0" y="134.0" width="170.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.156 &amp; 1.056 \\ -0.343 &amp; 1.778\end{bmatrix}"></div></foreignObject></g><g data-key="p"><g><rect x="143.0" y="440.0" width="34.0" height="34.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="160.0" y1="440.0" x2="160.0" y2="474.0" class="grid" opacity=".75"/><line x1="143.0" y1="457.0" x2="177.0" y2="457.0" class="grid" opacity=".75"/></g><text x="160.0" y="432.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="133.0" y="461.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="70.0" y="477.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P"></div></foreignObject><foreignObject x="70.0" y="504.0" width="180.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2891 &amp; 0.7109 \\ 0.1071 &amp; 0.8929\end{bmatrix}"></div></foreignObject></g><g data-key="L" data-only="1"><foreignObject x="300.0" y="450.0" width="640.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L = \dfrac{-\ln 0.2891 - \ln 0.8929}{2} = \dfrac{1.2412 + 0.1132}{2} = 0.6772"></div></foreignObject><text x="620.0" y="530.0" font-size="13" fill="#3576C0" text-anchor="middle">почти ln 2 = 0.6931; вертикальная полоса названа горизонтальной</text></g><g data-key="dead" data-only="1"><rect x="203.0" y="70.0" width="17.0" height="34.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="523.0" y="113.0" width="34.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="220.0" y="250.0" font-size="13" fill="#C30B0A" text-anchor="middle">четвёртый признак равен нулю у обеих картинок —</text><text x="220.0" y="268.0" font-size="13" fill="#C30B0A" text-anchor="middle">четвёртая строка W ни на что не влияет</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="f" data-focus="f">
      <div class="step-kicker">Шаг 1 · признаки</div>
      <h4>F [2 × 8]</h4>
      <p>Строка 1 — вертикальная полоса, строка 2 — горизонтальная.</p>
    </div>
    <div class="step-panel" data-on="f w dead" data-focus="w dead">
      <div class="step-kicker">Шаг 2 · бесполезная строка</div>
      <h4>Четвёртый признак — ноль у обеих картинок</h4>
      <p>Правое нижнее окно первого канала пусто у обеих: ReLU погасила его. Строка 4 матрицы W умножается на нули — в обратном проходе её градиент будет ровно нулём.</p>
    </div>
    <div class="step-panel" data-on="f w z" data-focus="z">
      <div class="step-kicker">Шаг 3 · логиты</div>
      <h4>Z_y = F W + b</h4>
      <p>У первой картинки 0.156 против 1.056 — сеть склоняется к горизонтальной.</p>
    </div>
    <div class="step-panel" data-on="z p" data-focus="p">
      <div class="step-kicker">Шаг 4 · вероятности</div>
      <h4>0.2891 / 0.7109 и 0.1071 / 0.8929</h4>
      <p>Вторая картинка названа верно, первая — нет: угадана одна из двух.</p>
    </div>
    <div class="step-panel" data-on="p L" data-focus="L">
      <div class="step-kicker">Шаг 5 · потеря</div>
      <h4>L = 0.6772</h4>
      <p>Первая картинка стоит 1.2412, вторая — 0.1132.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> классификатор CNN — обычная полносвязная сеть над выпрямленными признаками; потеря необученной сети с двумя классами около ln 2.
</div>

---


## Часть 8. Зачем свёртка, а не полносвязный слой

<p>
  Та же задача решалась бы и полносвязной сетью над 36 пикселями. Два свойства свёртки делают её
  лучше для картинок: веса общие для всех окон, а сдвиг входа сдвигает выход.
</p>
<div class="math-display" data-tex="\text{conv}\big(\text{shift}(x)\big) = \text{shift}\big(\text{conv}(x)\big)"></div>
<div class="stage" id="stage-nl" tabindex="0">
  <div class="stage-figure">
<svg id="nl" viewBox="0 0 960 620" role="img" aria-label="Свёртка против полносвязного слоя: параметры и сдвиг картинки">
<style>
  #nl { font-family: Helvetica, Arial, sans-serif; }
  #nl .cap { font-size: 13px; fill: #5E5850; }
  #nl .lbl { font-size: 16px; fill: #111111; }
  #nl .legend { font-size: 13px; fill: #5E5850; }
  #nl .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #nl .grid { stroke: #ffffff; stroke-width: 1.35; }
  #nl .dim { font-size: 13px; fill: #5E5850; }
  #nl .nm { font-size: 16px; font-weight: 800; }
  #nl .op { font-size: 23px; fill: #5E5850; }
  #nl .arw { font-size: 12px; fill: #5E5850; }
  #nl .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="nl-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="nl-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="nl-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="nl-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="296" width="190" height="152" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="372.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 372)">свёрточный блок</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 356 L 125 338" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 304 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#nl-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Conv 3×3</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#8A857C" text-anchor="middle">MaxPool 2×2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#C30B0A" text-anchor="middle">Conv 3×3</text><rect x="34" y="398" width="182" height="48" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="par"><text x="300.0" y="86.0" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">чтобы получить 32 числа из 36 пикселей:</text><rect x="300" y="98" width="592" height="24" rx="3" fill="#8A857C" opacity="0.6"/><text x="310.0" y="115.0" font-size="13" fill="#FFFFFF" text-anchor="start" font-weight="800">полносвязный слой 36 → 32: 1184 параметра</text><rect x="300" y="130" width="10" height="24" rx="3" fill="#7B4AB5"/><text x="318.0" y="147.0" font-size="13" fill="#7B4AB5" text-anchor="start" font-weight="800">свёртка 2 × 3 × 3 + 2: 20 параметров</text></g><g data-key="shift"><rect x="300" y="230" width="84" height="84" fill="#FFFFFF" stroke="#C9C2B8"/><rect x="328.0" y="230.0" width="14" height="14" fill="#73B222" opacity="0.92"/><rect x="342.0" y="230.0" width="14" height="14" fill="#73B222" opacity="0.49"/><rect x="328.0" y="244.0" width="14" height="14" fill="#73B222" opacity="1.00"/><rect x="342.0" y="244.0" width="14" height="14" fill="#73B222" opacity="0.57"/><rect x="328.0" y="258.0" width="14" height="14" fill="#73B222" opacity="0.83"/><rect x="342.0" y="258.0" width="14" height="14" fill="#73B222" opacity="0.41"/><rect x="328.0" y="272.0" width="14" height="14" fill="#73B222" opacity="1.00"/><rect x="342.0" y="272.0" width="14" height="14" fill="#73B222" opacity="0.66"/><rect x="328.0" y="286.0" width="14" height="14" fill="#73B222" opacity="0.74"/><rect x="342.0" y="286.0" width="14" height="14" fill="#73B222" opacity="0.57"/><rect x="328.0" y="300.0" width="14" height="14" fill="#73B222" opacity="0.92"/><rect x="342.0" y="300.0" width="14" height="14" fill="#73B222" opacity="0.49"/><line x1="314" y1="230" x2="314" y2="314" stroke="#E4E1D7" stroke-width="0.8"/><line x1="328" y1="230" x2="328" y2="314" stroke="#E4E1D7" stroke-width="0.8"/><line x1="342" y1="230" x2="342" y2="314" stroke="#E4E1D7" stroke-width="0.8"/><line x1="356" y1="230" x2="356" y2="314" stroke="#E4E1D7" stroke-width="0.8"/><line x1="370" y1="230" x2="370" y2="314" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="244" x2="384" y2="244" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="258" x2="384" y2="258" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="272" x2="384" y2="272" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="286" x2="384" y2="286" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="300" x2="384" y2="300" stroke="#E4E1D7" stroke-width="0.8"/><text x="342.0" y="222.0" font-size="12" fill="#5E5850" text-anchor="middle">картинка</text><rect x="300" y="380" width="84" height="84" fill="#FFFFFF" stroke="#C9C2B8"/><rect x="342.0" y="380.0" width="14" height="14" fill="#73B222" opacity="0.92"/><rect x="356.0" y="380.0" width="14" height="14" fill="#73B222" opacity="0.49"/><rect x="342.0" y="394.0" width="14" height="14" fill="#73B222" opacity="1.00"/><rect x="356.0" y="394.0" width="14" height="14" fill="#73B222" opacity="0.57"/><rect x="342.0" y="408.0" width="14" height="14" fill="#73B222" opacity="0.83"/><rect x="356.0" y="408.0" width="14" height="14" fill="#73B222" opacity="0.41"/><rect x="342.0" y="422.0" width="14" height="14" fill="#73B222" opacity="1.00"/><rect x="356.0" y="422.0" width="14" height="14" fill="#73B222" opacity="0.66"/><rect x="342.0" y="436.0" width="14" height="14" fill="#73B222" opacity="0.74"/><rect x="356.0" y="436.0" width="14" height="14" fill="#73B222" opacity="0.57"/><rect x="342.0" y="450.0" width="14" height="14" fill="#73B222" opacity="0.92"/><rect x="356.0" y="450.0" width="14" height="14" fill="#73B222" opacity="0.49"/><line x1="314" y1="380" x2="314" y2="464" stroke="#E4E1D7" stroke-width="0.8"/><line x1="328" y1="380" x2="328" y2="464" stroke="#E4E1D7" stroke-width="0.8"/><line x1="342" y1="380" x2="342" y2="464" stroke="#E4E1D7" stroke-width="0.8"/><line x1="356" y1="380" x2="356" y2="464" stroke="#E4E1D7" stroke-width="0.8"/><line x1="370" y1="380" x2="370" y2="464" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="394" x2="384" y2="394" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="408" x2="384" y2="408" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="422" x2="384" y2="422" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="436" x2="384" y2="436" stroke="#E4E1D7" stroke-width="0.8"/><line x1="300" y1="450" x2="384" y2="450" stroke="#E4E1D7" stroke-width="0.8"/><text x="342.0" y="372.0" font-size="12" fill="#5E5850" text-anchor="middle">сдвиг на 1 вправо</text><path d="M 390.0 272.0 L 440.0 272.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#nl-arw)"/><path d="M 390.0 422.0 L 440.0 422.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#nl-arw)"/><g><rect x="450.0" y="244.0" width="56.0" height="56.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="464.0" y1="244.0" x2="464.0" y2="300.0" class="grid" opacity=".75"/><line x1="478.0" y1="244.0" x2="478.0" y2="300.0" class="grid" opacity=".75"/><line x1="492.0" y1="244.0" x2="492.0" y2="300.0" class="grid" opacity=".75"/><line x1="450.0" y1="258.0" x2="506.0" y2="258.0" class="grid" opacity=".75"/><line x1="450.0" y1="272.0" x2="506.0" y2="272.0" class="grid" opacity=".75"/><line x1="450.0" y1="286.0" x2="506.0" y2="286.0" class="grid" opacity=".75"/></g><rect x="479.0" y="245.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="493.0" y="245.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="479.0" y="259.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="493.0" y="259.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="479.0" y="273.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="493.0" y="273.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="479.0" y="287.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="493.0" y="287.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><g><rect x="450.0" y="394.0" width="56.0" height="56.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="464.0" y1="394.0" x2="464.0" y2="450.0" class="grid" opacity=".75"/><line x1="478.0" y1="394.0" x2="478.0" y2="450.0" class="grid" opacity=".75"/><line x1="492.0" y1="394.0" x2="492.0" y2="450.0" class="grid" opacity=".75"/><line x1="450.0" y1="408.0" x2="506.0" y2="408.0" class="grid" opacity=".75"/><line x1="450.0" y1="422.0" x2="506.0" y2="422.0" class="grid" opacity=".75"/><line x1="450.0" y1="436.0" x2="506.0" y2="436.0" class="grid" opacity=".75"/></g><rect x="493.0" y="395.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="493.0" y="409.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="493.0" y="423.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><rect x="493.0" y="437.0" width="12.0" height="12.0" fill="#D9D5CC" rx="1"/><text x="478.0" y="236.0" font-size="12" fill="#5E5850" text-anchor="middle">Z, канал 1</text></g><g data-key="eq" data-only="1"><rect x="464" y="394" width="42" height="56" fill="none" stroke="#3576C0" stroke-width="2"/><rect x="450" y="244" width="42" height="56" fill="none" stroke="#3576C0" stroke-width="2"/><text x="530.0" y="330.0" font-size="13" fill="#3576C0" text-anchor="start">карта сдвинулась ровно на клетку:</text><text x="530.0" y="348.0" font-size="13" fill="#3576C0" text-anchor="start">совпадение до последнего бита</text></g><g data-key="inv" data-only="1"><text x="530.0" y="420.0" font-size="13" fill="#C30B0A" text-anchor="start">но после пулинга признаки другие:</text><text x="530.0" y="438.0" font-size="13" fill="#C30B0A" text-anchor="start" font-weight="700">p(вертикальная) 0.29 → 0.10</text></g><g data-key="note" data-only="1"><foreignObject x="290.0" y="500.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\text{conv}(\text{shift}(x)) = \text{shift}(\text{conv}(x))"></div></foreignObject><text x="615.0" y="560.0" font-size="13" fill="#C30B0A" text-anchor="middle">свёртка эквивариантна сдвигу; пулинг даёт лишь частичную инвариантность</text></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — картинки · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl par" data-focus="hl par">
      <div class="step-kicker">Шаг 1 · параметры</div>
      <h4>20 против 1184</h4>
      <p>Полносвязный слой, который из 36 пикселей делает 32 числа (столько же, сколько в двух картах 4 × 4), хранит отдельный вес на каждую пару «пиксель → выход». Свёртка хранит два ядра по 9 весов: в 59 раз меньше.</p>
    </div>
    <div class="step-panel" data-on="hl shift" data-focus="shift">
      <div class="step-kicker">Шаг 2 · эксперимент</div>
      <h4>Сдвинем полосу на пиксель</h4>
      <p>Та же картинка, сдвинутая вправо на один столбец (слева дописан нулевой столбец).</p>
    </div>
    <div class="step-panel" data-on="hl shift eq" data-focus="eq">
      <div class="step-kicker">Шаг 3 · эквивариантность</div>
      <h4>Карта сдвинулась вместе с картинкой</h4>
      <p>Поскольку в каждом окне те же веса, сдвиг входа сдвигает выход — там, где окна не упираются в край, числа совпадают точно. Полносвязный слой так не умеет: для него сдвинутая картинка — просто другие 36 чисел.</p>
    </div>
    <div class="step-panel" data-on="hl shift inv" data-focus="inv">
      <div class="step-kicker">Шаг 4 · но не инвариантность</div>
      <h4>Классификатор видит другое</h4>
      <p>Пулинг 2 × 2 сглаживает сдвиги внутри своего окна, но сдвиг на один пиксель переносит максимум в соседнее окно. Признаки меняются, вероятность верного класса падает с 0.29 до 0.10.</p>
    </div>
    <div class="step-panel" data-on="hl eq inv note" data-focus="note">
      <div class="step-kicker">Шаг 5 · вывод</div>
      <h4>Что даёт свёртка</h4>
      <p>Локальность, общие веса и эквивариантность к сдвигу. Инвариантность к сдвигу сеть не получает даром — её дают пулинг, глубина и обучение на сдвинутых примерах.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Карта исходной и сдвинутой картинки.</p>
<div class="stage" id="stage-nln" tabindex="0">
  <div class="stage-figure">
<svg id="nln" viewBox="0 0 960 470" role="img" aria-label="Числовая проверка эквивариантности свёртки">
<style>
  #nln { font-family: Helvetica, Arial, sans-serif; }
  #nln .cap { font-size: 13px; fill: #5E5850; }
  #nln .lbl { font-size: 16px; fill: #111111; }
  #nln .legend { font-size: 13px; fill: #5E5850; }
  #nln .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #nln .grid { stroke: #ffffff; stroke-width: 1.35; }
  #nln .dim { font-size: 13px; fill: #5E5850; }
  #nln .nm { font-size: 16px; font-weight: 800; }
  #nln .op { font-size: 23px; fill: #5E5850; }
  #nln .arw { font-size: 12px; fill: #5E5850; }
  #nln .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="nln-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="nln-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="nln-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="nln-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: сдвиг картинки на один пиксель</text><g data-key="z"><g><rect x="206.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="223.0" y1="70.0" x2="223.0" y2="138.0" class="grid" opacity=".75"/><line x1="240.0" y1="70.0" x2="240.0" y2="138.0" class="grid" opacity=".75"/><line x1="257.0" y1="70.0" x2="257.0" y2="138.0" class="grid" opacity=".75"/><line x1="206.0" y1="87.0" x2="274.0" y2="87.0" class="grid" opacity=".75"/><line x1="206.0" y1="104.0" x2="274.0" y2="104.0" class="grid" opacity=".75"/><line x1="206.0" y1="121.0" x2="274.0" y2="121.0" class="grid" opacity=".75"/></g><text x="240.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="196.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="150.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_{0,0}"></div></foreignObject><foreignObject x="120.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.76 &amp; 1.21 &amp; -0.27 &amp; -0.27 \\ 1.04 &amp; 1.64 &amp; -0.14 &amp; -0.20 \\ 0.65 &amp; 1.41 &amp; -0.14 &amp; -0.29 \\ 0.93 &amp; 1.24 &amp; -0.07 &amp; -0.33\end{bmatrix}"></div></foreignObject></g><g data-key="zs"><g><rect x="666.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="683.0" y1="70.0" x2="683.0" y2="138.0" class="grid" opacity=".75"/><line x1="700.0" y1="70.0" x2="700.0" y2="138.0" class="grid" opacity=".75"/><line x1="717.0" y1="70.0" x2="717.0" y2="138.0" class="grid" opacity=".75"/><line x1="666.0" y1="87.0" x2="734.0" y2="87.0" class="grid" opacity=".75"/><line x1="666.0" y1="104.0" x2="734.0" y2="104.0" class="grid" opacity=".75"/><line x1="666.0" y1="121.0" x2="734.0" y2="121.0" class="grid" opacity=".75"/></g><text x="700.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="656.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="610.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_{0,0}\ \text{после сдвига}"></div></foreignObject><foreignObject x="580.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.10 &amp; 0.76 &amp; 1.21 &amp; -0.27 \\ 0.10 &amp; 1.04 &amp; 1.64 &amp; -0.14 \\ 0.10 &amp; 0.65 &amp; 1.41 &amp; -0.14 \\ 0.10 &amp; 0.93 &amp; 1.24 &amp; -0.07\end{bmatrix}"></div></foreignObject></g><g data-key="eq" data-only="1"><rect x="206.0" y="70.0" width="51.0" height="68.0" rx="3" fill="none" stroke="#3576C0" stroke-width="2.2"/><rect x="683.0" y="70.0" width="51.0" height="68.0" rx="3" fill="none" stroke="#3576C0" stroke-width="2.2"/><text x="480.0" y="290.0" font-size="13" fill="#3576C0" text-anchor="middle">столбцы 0–2 исходной карты = столбцы 1–3 сдвинутой: расхождение 0</text></g><g data-key="fl"><foreignObject x="20.0" y="320.0" width="920.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="F: (1.64,\ 0,\ 1.41,\ 0,\ 2.04,\ 0.99,\ 2.10,\ 1.02) \ \to\ (1.04,\ 1.64,\ 0.93,\ 1.41,\ 1.84,\ 2.04,\ 1.71,\ 2.10)"></div></foreignObject></g><g data-key="p" data-only="1"><text x="480.0" y="410.0" font-size="15" fill="#C30B0A" text-anchor="middle" font-weight="700">p(вертикальная): 0.2891 → 0.1003</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="z" data-focus="z">
      <div class="step-kicker">Шаг 1 · исходная карта</div>
      <h4>Первый канал первой картинки</h4>
      <p>Та же Z, что в части 4.</p>
    </div>
    <div class="step-panel" data-on="z zs eq" data-focus="zs eq">
      <div class="step-kicker">Шаг 2 · после сдвига</div>
      <h4>Карта съехала на столбец</h4>
      <p>Первый столбец новой карты — отклик на край картинки, остальные три — старые числа, сдвинутые вправо.</p>
    </div>
    <div class="step-panel" data-on="zs fl" data-focus="fl">
      <div class="step-kicker">Шаг 3 · после пулинга</div>
      <h4>Признаки другие</h4>
      <p>Бывшие нули в правых окнах заполнились: максимум переехал в соседнее окно.</p>
    </div>
    <div class="step-panel" data-on="fl p" data-focus="p">
      <div class="step-kicker">Шаг 4 · ответ</div>
      <h4>Ошибка стала сильнее</h4>
      <p>Необученной сети безразлично, что картинка «та же»: классификатор видит другие 8 чисел.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> свёртка экономит параметры в десятки раз и эквивариантна сдвигу; инвариантность к сдвигу даёт только всё вместе — пулинг, глубина и обучение.
</div>

---


## Часть 9. Backprop: карта и классификатор

<p>
  Обратный проход идёт по тем же блокам в обратном порядке. Классификатор — знакомая часть:
</p>
<div class="math-display" data-tex="dZ_y = \frac{P - Y}{B}, \qquad dW = F^{\top} dZ_y, \qquad db = \sum_b dZ_y, \qquad dF = dZ_y W^{\top}"></div>
<p class="tiny">Дальше для краткости <span class="math-inline" data-tex="dT"></span> означает <span class="math-inline" data-tex="\partial L / \partial T"></span>.</p>
<div class="stage" id="stage-bpg" tabindex="0">
  <div class="stage-figure">
<svg id="bpg" viewBox="0 0 960 470" role="img" aria-label="Карта обратного прохода свёрточной сети">
<style>
  #bpg { font-family: Helvetica, Arial, sans-serif; }
  #bpg .cap { font-size: 13px; fill: #5E5850; }
  #bpg .lbl { font-size: 16px; fill: #111111; }
  #bpg .legend { font-size: 13px; fill: #5E5850; }
  #bpg .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #bpg .grid { stroke: #ffffff; stroke-width: 1.35; }
  #bpg .dim { font-size: 13px; fill: #5E5850; }
  #bpg .nm { font-size: 16px; font-weight: 800; }
  #bpg .op { font-size: 23px; fill: #5E5850; }
  #bpg .arw { font-size: 12px; fill: #5E5850; }
  #bpg .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="bpg-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="bpg-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="bpg-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="bpg-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Обратный проход: тот же конвейер справа налево</text><g data-key="c0"><rect x="28" y="70" width="56" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="56" y="150" transform="rotate(-90 56 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Вход X</text></g><g data-key="c1"><rect x="144" y="70" width="56" height="150" rx="10" fill="#F4EFFA" stroke="#7B4AB5" stroke-width="1.8"/><text x="172" y="150" transform="rotate(-90 172 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Conv 3×3</text><rect x="118" y="234" width="108" height="50" rx="7" fill="#F4EFFA" stroke="#7B4AB5" stroke-width="1.4"/><text x="172.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">K [2×1×3×3]</text><text x="172.0" y="270.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">b_c [2]</text></g><g data-key="c2"><rect x="260" y="70" width="56" height="150" rx="10" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.8"/><text x="288" y="150" transform="rotate(-90 288 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">ReLU</text><rect x="234" y="234" width="108" height="32" rx="7" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.4"/><text x="288.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c3"><rect x="376" y="70" width="56" height="150" rx="10" fill="#EEF4FB" stroke="#3576C0" stroke-width="1.8"/><text x="404" y="150" transform="rotate(-90 404 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">MaxPool 2×2</text><rect x="350" y="234" width="108" height="32" rx="7" fill="#EEF4FB" stroke="#3576C0" stroke-width="1.4"/><text x="404.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c4"><rect x="492" y="70" width="56" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="520" y="150" transform="rotate(-90 520 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Flatten</text><rect x="466" y="234" width="108" height="32" rx="7" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.4"/><text x="520.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c5"><rect x="608" y="70" width="56" height="150" rx="10" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.8"/><text x="636" y="150" transform="rotate(-90 636 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear</text><rect x="582" y="234" width="108" height="32" rx="7" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.4"/><text x="636.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W [8×2] · b [2]</text></g><g data-key="c6"><rect x="724" y="70" width="56" height="150" rx="10" fill="#FEF4EA" stroke="#E88919" stroke-width="1.8"/><text x="752" y="150" transform="rotate(-90 752 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Softmax</text><rect x="698" y="234" width="108" height="32" rx="7" fill="#FEF4EA" stroke="#E88919" stroke-width="1.4"/><text x="752.0" y="252.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c7"><rect x="840" y="70" width="56" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="868" y="150" transform="rotate(-90 868 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Cross-Entropy</text></g><path d="M 87.0 145.0 L 141.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="114.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">X</text><text x="114.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×1×6×6]</text><path d="M 203.0 145.0 L 257.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="230.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z</text><text x="230.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2×4×4]</text><path d="M 319.0 145.0 L 373.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="346.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">A</text><text x="346.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2×4×4]</text><path d="M 435.0 145.0 L 489.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="462.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Pₚ</text><text x="462.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2×2×2]</text><path d="M 551.0 145.0 L 605.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="578.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">F</text><text x="578.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×8]</text><path d="M 667.0 145.0 L 721.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="694.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z_y</text><text x="694.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2]</text><path d="M 783.0 145.0 L 837.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="810.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">P</text><text x="810.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[2×2]</text><path d="M 899.0 145.0 L 948.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="923.5" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">L</text><text x="923.5" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[1]</text><g data-key="yy"><path d="M 868.0 320.0 L 868.0 224.0" fill="none" stroke="#5E5850" stroke-width="1.6" marker-end="url(#bpg-arw)"/><text x="868.0" y="338.0" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="700">Y [2 × 2]</text><text x="868.0" y="354.0" font-size="12" fill="#5E5850" text-anchor="middle">one-hot</text></g><g data-key="g5"><text x="694.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dZ_y</text></g><g data-key="g4"><text x="578.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dF</text></g><g data-key="g3"><text x="462.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dPₚ</text></g><g data-key="g2"><text x="346.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dA</text></g><g data-key="g1"><text x="230.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dZ</text></g><g data-key="g0"><text x="114.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dX</text></g><g data-key="wg"><text x="636.0" y="300.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dW, db</text></g><g data-key="fg"><text x="520.0" y="300.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">reshape назад</text></g><g data-key="pg"><text x="404.0" y="300.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">в победителя</text></g><g data-key="rg"><text x="288.0" y="300.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">⊙ [Z &gt; 0]</text></g><g data-key="kg"><text x="172.0" y="300.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dK, db_c</text></g><g data-key="mag" data-only="1"><path d="M 930.0 380.0 L 40.0 380.0" fill="none" stroke="#E39A9A" stroke-width="3" marker-end="url(#bpg-bw)"/><rect x="290" y="364" width="400" height="32" rx="16" fill="#FDF3F3" stroke="#E39A9A"/><text x="490.0" y="385.0" font-size="13" fill="#C30B0A" text-anchor="middle" font-weight="700">градиент течёт справа налево, формы те же</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="c7 c6 c5 yy g5 wg g4" data-focus="g5 wg">
      <div class="step-kicker">Шаг 1 · классификатор</div>
      <h4>Как в полносвязной сети</h4>
      <p>(P − Y)/B, затем dW = Fᵀ·dZ_y, db, и градиент по признакам dF = dZ_y·Wᵀ формы <code>[2 × 8]</code>.</p>
    </div>
    <div class="step-panel" data-on="c4 g4 fg g3" data-focus="fg">
      <div class="step-kicker">Шаг 2 · flatten назад</div>
      <h4>Строка снова становится тензором</h4>
      <p>Выпрямление — перестановка, и его обратный проход — обратная перестановка: <code>[2 × 8] → [2 × 2 × 2 × 2]</code>.</p>
    </div>
    <div class="step-panel" data-on="c3 g3 pg g2" data-focus="pg">
      <div class="step-kicker">Шаг 3 · пулинг назад</div>
      <h4>Градиент уходит в победителя</h4>
      <p>Максимум зависел только от одной клетки окна — она и получает весь градиент, три остальные — ноль.</p>
    </div>
    <div class="step-panel" data-on="c2 g2 rg g1" data-focus="rg">
      <div class="step-kicker">Шаг 4 · ReLU назад</div>
      <h4>Маска</h4>
      <p>Как везде: через закрытые клетки градиент не проходит.</p>
    </div>
    <div class="step-panel" data-on="c1 g1 kg g0" data-focus="kg">
      <div class="step-kicker">Шаг 5 · свёртка назад</div>
      <h4>dK, db_c и dX</h4>
      <p>Через im2col — формулы линейного слоя: dK_mat = colsᵀ·dZ_flat. Градиент по картинке dX для обучения не нужен, но его полезно уметь считать.</p>
    </div>
    <div class="step-panel" data-on="c0 c1 c2 c3 c4 c5 c6 c7 g0 g1 g2 g3 g4 g5 wg fg pg rg kg mag" data-focus="mag">
      <div class="step-kicker">Шаг 6 · целиком</div>
      <h4>Все 38 производных за один проход</h4>
      <p>Новых правил два: маршрутизация через пулинг и сумма по окнам у общих весов свёртки. Всё остальное уже встречалось.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="stage" id="stage-bp1" tabindex="0">
  <div class="stage-figure">
<svg id="bp1" viewBox="0 0 960 640" role="img" aria-label="Числовые градиенты классификатора">
<style>
  #bp1 { font-family: Helvetica, Arial, sans-serif; }
  #bp1 .cap { font-size: 13px; fill: #5E5850; }
  #bp1 .lbl { font-size: 16px; fill: #111111; }
  #bp1 .legend { font-size: 13px; fill: #5E5850; }
  #bp1 .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #bp1 .grid { stroke: #ffffff; stroke-width: 1.35; }
  #bp1 .dim { font-size: 13px; fill: #5E5850; }
  #bp1 .nm { font-size: 16px; font-weight: 800; }
  #bp1 .op { font-size: 23px; fill: #5E5850; }
  #bp1 .arw { font-size: 12px; fill: #5E5850; }
  #bp1 .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="bp1-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="bp1-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="bp1-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="bp1-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: от потери до признаков</text><g data-key="dz"><g><rect x="133.0" y="70.0" width="34.0" height="34.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="150.0" y1="70.0" x2="150.0" y2="104.0" class="grid" opacity=".75"/><line x1="133.0" y1="87.0" x2="167.0" y2="87.0" class="grid" opacity=".75"/></g><text x="150.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="123.0" y="91.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="60.0" y="107.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_y = (P - Y)/B"></div></foreignObject><foreignObject x="60.0" y="134.0" width="180.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.3555 &amp; 0.3555 \\ 0.0535 &amp; -0.0535\end{bmatrix}"></div></foreignObject></g><g data-key="dw"><g><rect x="413.0" y="62.0" width="34.0" height="136.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="430.0" y1="62.0" x2="430.0" y2="198.0" class="grid" opacity=".75"/><line x1="413.0" y1="79.0" x2="447.0" y2="79.0" class="grid" opacity=".75"/><line x1="413.0" y1="96.0" x2="447.0" y2="96.0" class="grid" opacity=".75"/><line x1="413.0" y1="113.0" x2="447.0" y2="113.0" class="grid" opacity=".75"/><line x1="413.0" y1="130.0" x2="447.0" y2="130.0" class="grid" opacity=".75"/><line x1="413.0" y1="147.0" x2="447.0" y2="147.0" class="grid" opacity=".75"/><line x1="413.0" y1="164.0" x2="447.0" y2="164.0" class="grid" opacity=".75"/><line x1="413.0" y1="181.0" x2="447.0" y2="181.0" class="grid" opacity=".75"/></g><text x="430.0" y="54.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="403.0" y="134.0" font-size="13" fill="#111111" text-anchor="end">8</text><foreignObject x="340.0" y="201.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dW = F^{\top} dZ_y"></div></foreignObject><foreignObject x="335.0" y="228.0" width="190.0" height="186.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.4952 &amp; 0.4952 \\ 0.0733 &amp; -0.0733 \\ -0.5012 &amp; 0.5012 \\ 0.0000 &amp; 0.0000 \\ -0.5999 &amp; 0.5999 \\ -0.2374 &amp; 0.2374 \\ -0.6501 &amp; 0.6501 \\ -0.2764 &amp; 0.2764\end{bmatrix}"></div></foreignObject></g><g data-key="zrow" data-only="1"><rect x="413.0" y="113.0" width="34.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="700.0" y="190.0" font-size="13" fill="#C30B0A" text-anchor="start">строка 4 — ровно 0:</text><text x="700.0" y="208.0" font-size="13" fill="#C30B0A" text-anchor="start">признак 4 нулевой у обеих</text></g><g data-key="db"><g><rect x="743.0" y="70.0" width="34.0" height="17.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="760.0" y1="70.0" x2="760.0" y2="87.0" class="grid" opacity=".75"/></g><text x="760.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="733.0" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="670.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="db"></div></foreignObject><foreignObject x="675.0" y="117.0" width="170.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.3019 &amp; 0.3019\end{bmatrix}"></div></foreignObject><text x="760.0" y="160.0" font-size="13" fill="#C30B0A" text-anchor="middle">сумма = 0</text></g><g data-key="df"><g><rect x="192.0" y="440.0" width="136.0" height="34.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="209.0" y1="440.0" x2="209.0" y2="474.0" class="grid" opacity=".75"/><line x1="226.0" y1="440.0" x2="226.0" y2="474.0" class="grid" opacity=".75"/><line x1="243.0" y1="440.0" x2="243.0" y2="474.0" class="grid" opacity=".75"/><line x1="260.0" y1="440.0" x2="260.0" y2="474.0" class="grid" opacity=".75"/><line x1="277.0" y1="440.0" x2="277.0" y2="474.0" class="grid" opacity=".75"/><line x1="294.0" y1="440.0" x2="294.0" y2="474.0" class="grid" opacity=".75"/><line x1="311.0" y1="440.0" x2="311.0" y2="474.0" class="grid" opacity=".75"/><line x1="192.0" y1="457.0" x2="328.0" y2="457.0" class="grid" opacity=".75"/></g><text x="260.0" y="432.0" font-size="13" fill="#111111" text-anchor="middle">8</text><text x="182.0" y="461.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="170.0" y="477.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dF = dZ_y W^{\top}"></div></foreignObject><foreignObject x="0.0" y="504.0" width="520.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0711 &amp; 0.2488 &amp; 0.2133 &amp; -0.1422 &amp; 0.0711 &amp; 0.2133 &amp; -0.2844 &amp; 0.0711 \\ -0.0107 &amp; -0.0375 &amp; -0.0321 &amp; 0.0214 &amp; -0.0107 &amp; -0.0321 &amp; 0.0428 &amp; -0.0107\end{bmatrix}"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="dz" data-focus="dz">
      <div class="step-kicker">Шаг 1 · первый градиент</div>
      <h4>(P − Y)/B</h4>
      <p>У двух классов строки dZ_y — пары противоположных чисел: сумма строки ноль. Первая картинка ошибается сильнее: 0.3555 против 0.0535.</p>
    </div>
    <div class="step-panel" data-on="dz dw" data-focus="dw">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>dW [8 × 2]</h4>
      <p>Столбцы dW противоположны друг другу — прямое следствие двух классов.</p>
    </div>
    <div class="step-panel" data-on="dw zrow" data-focus="zrow">
      <div class="step-kicker">Шаг 3 · нулевая строка</div>
      <h4>Признак, которого нет</h4>
      <p>Четвёртый признак — пустое окно пулинга у обеих картинок. Веса, которые на него смотрят, градиента не получают.</p>
    </div>
    <div class="step-panel" data-on="dz db" data-focus="db">
      <div class="step-kicker">Шаг 4 · смещения</div>
      <h4>−0.3019 и +0.3019</h4>
      <p>Сумма ровно ноль, как у любого выходного слоя с softmax.</p>
    </div>
    <div class="step-panel" data-on="dz df" data-focus="df">
      <div class="step-kicker">Шаг 5 · вниз</div>
      <h4>dF [2 × 8]</h4>
      <p>Градиент по восьми признакам каждой картинки. После reshape — по одному числу на каждое окно пулинга.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> обратный проход CNN начинается как у полносвязной сети; новые правила появятся только внутри свёрточного блока.
</div>

---


## Часть 10. Backprop: через пулинг и ReLU

<p>
  Производная максимума по аргументам — единица у победителя и ноль у остальных. Поэтому
  градиент окна пулинга целиком уходит в одну клетку:
</p>
<div class="math-display" data-tex="dA[b,c,2i+u^*,2j+v^*] = dP_p[b,c,i,j], \quad \text{остальные клетки окна} = 0, \qquad dZ = dA \odot [Z &gt; 0]"></div>
<div class="stage" id="stage-bp2" tabindex="0">
  <div class="stage-figure">
<svg id="bp2" viewBox="0 0 960 620" role="img" aria-label="Обратный проход через max-пулинг и ReLU">
<style>
  #bp2 { font-family: Helvetica, Arial, sans-serif; }
  #bp2 .cap { font-size: 13px; fill: #5E5850; }
  #bp2 .lbl { font-size: 16px; fill: #111111; }
  #bp2 .legend { font-size: 13px; fill: #5E5850; }
  #bp2 .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #bp2 .grid { stroke: #ffffff; stroke-width: 1.35; }
  #bp2 .dim { font-size: 13px; fill: #5E5850; }
  #bp2 .nm { font-size: 16px; font-weight: 800; }
  #bp2 .op { font-size: 23px; fill: #5E5850; }
  #bp2 .arw { font-size: 12px; fill: #5E5850; }
  #bp2 .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="bp2-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="bp2-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="bp2-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="bp2-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="296" width="190" height="152" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="372.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 372)">свёрточный блок</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 356 L 125 338" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 304 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#bp2-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Conv 3×3</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#8A857C" text-anchor="middle">MaxPool 2×2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#C30B0A" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#C30B0A" text-anchor="middle">MaxPool 2×2</text><rect x="34" y="298" width="182" height="94" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="dp"><g><rect x="300.0" y="186.0" width="52.0" height="52.0" rx="2" fill="#C30B0A" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="326.0" y1="186.0" x2="326.0" y2="238.0" class="grid" opacity=".75"/><line x1="300.0" y1="212.0" x2="352.0" y2="212.0" class="grid" opacity=".75"/></g><foreignObject x="291.0" y="246.0" width="70.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dP_p"></div></foreignObject></g><g data-key="route"><path d="M 313 199 L 469 199" fill="none" stroke="#C30B0A" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 339 199 L 495 173" fill="none" stroke="#C30B0A" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 313 225 L 469 225" fill="none" stroke="#C30B0A" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 339 225 L 495 225" fill="none" stroke="#C30B0A" stroke-width="1.2" marker-end="url(#bp2-arw)"/><g><rect x="430.0" y="160.0" width="104.0" height="104.0" rx="2" fill="#F4F2EC" opacity="1.0" stroke="#ffffff" stroke-width="1"/><line x1="456.0" y1="160.0" x2="456.0" y2="264.0" class="grid" opacity=".75"/><line x1="482.0" y1="160.0" x2="482.0" y2="264.0" class="grid" opacity=".75"/><line x1="508.0" y1="160.0" x2="508.0" y2="264.0" class="grid" opacity=".75"/><line x1="430.0" y1="186.0" x2="534.0" y2="186.0" class="grid" opacity=".75"/><line x1="430.0" y1="212.0" x2="534.0" y2="212.0" class="grid" opacity=".75"/><line x1="430.0" y1="238.0" x2="534.0" y2="238.0" class="grid" opacity=".75"/></g><rect x="457" y="187" width="24" height="24" fill="#C30B0A" opacity="0.55" rx="1"/><rect x="483" y="161" width="24" height="24" fill="#C30B0A" opacity="0.55" rx="1"/><rect x="457" y="213" width="24" height="24" fill="#C30B0A" opacity="0.55" rx="1"/><rect x="483" y="213" width="24" height="24" fill="#C30B0A" opacity="0.55" rx="1"/><rect x="430" y="160" width="52" height="52" fill="none" stroke="#3576C0" stroke-width="2"/><rect x="482" y="160" width="52" height="52" fill="none" stroke="#3576C0" stroke-width="2"/><rect x="430" y="212" width="52" height="52" fill="none" stroke="#3576C0" stroke-width="2"/><rect x="482" y="212" width="52" height="52" fill="none" stroke="#3576C0" stroke-width="2"/><foreignObject x="452.0" y="270.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dA"></div></foreignObject><text x="482.0" y="300.0" font-size="12" fill="#5E5850" text-anchor="middle">только победители</text></g><g data-key="mask"><text x="552.0" y="216.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="570.0" y="160.0" width="104.0" height="104.0" rx="2" fill="#73B222" opacity="0.5" stroke="#ffffff" stroke-width="1"/><line x1="596.0" y1="160.0" x2="596.0" y2="264.0" class="grid" opacity=".75"/><line x1="622.0" y1="160.0" x2="622.0" y2="264.0" class="grid" opacity=".75"/><line x1="648.0" y1="160.0" x2="648.0" y2="264.0" class="grid" opacity=".75"/><line x1="570.0" y1="186.0" x2="674.0" y2="186.0" class="grid" opacity=".75"/><line x1="570.0" y1="212.0" x2="674.0" y2="212.0" class="grid" opacity=".75"/><line x1="570.0" y1="238.0" x2="674.0" y2="238.0" class="grid" opacity=".75"/></g><rect x="623.0" y="161.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="649.0" y="161.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="623.0" y="187.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="649.0" y="187.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="623.0" y="213.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="649.0" y="213.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="623.0" y="239.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="649.0" y="239.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><foreignObject x="582.0" y="270.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[Z &gt; 0]"></div></foreignObject></g><g data-key="dz"><text x="692.0" y="216.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="710.0" y="160.0" width="104.0" height="104.0" rx="2" fill="#F4F2EC" opacity="1.0" stroke="#ffffff" stroke-width="1"/><line x1="736.0" y1="160.0" x2="736.0" y2="264.0" class="grid" opacity=".75"/><line x1="762.0" y1="160.0" x2="762.0" y2="264.0" class="grid" opacity=".75"/><line x1="788.0" y1="160.0" x2="788.0" y2="264.0" class="grid" opacity=".75"/><line x1="710.0" y1="186.0" x2="814.0" y2="186.0" class="grid" opacity=".75"/><line x1="710.0" y1="212.0" x2="814.0" y2="212.0" class="grid" opacity=".75"/><line x1="710.0" y1="238.0" x2="814.0" y2="238.0" class="grid" opacity=".75"/></g><rect x="737" y="187" width="24" height="24" fill="#C30B0A" opacity="0.55" rx="1"/><rect x="737" y="213" width="24" height="24" fill="#C30B0A" opacity="0.55" rx="1"/><foreignObject x="732.0" y="270.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ"></div></foreignObject></g><g data-key="count" data-only="1"><text x="615.0" y="360.0" font-size="13" fill="#C30B0A" text-anchor="middle">у победителей правых окон значение было 0 — маска гасит и их:</text><text x="615.0" y="380.0" font-size="13" fill="#C30B0A" text-anchor="middle" font-weight="700">во всём батче градиент получают 12 клеток Z из 64</text></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">красное — градиенты · синие квадраты — окна пулинга</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl dp" data-focus="hl dp">
      <div class="step-kicker">Шаг 1 · что пришло</div>
      <h4>По числу на окно</h4>
      <p>После reshape градиента признаков — по одному числу на каждое окно пулинга.</p>
    </div>
    <div class="step-panel" data-on="hl dp route" data-focus="route">
      <div class="step-kicker">Шаг 2 · в победителя</div>
      <h4>Производная max — единица у максимума</h4>
      <p>max(a, b, c, d) меняется, только если двигать максимальный аргумент. Поэтому градиент окна целиком уходит в клетку-победителя, остальные три получают 0. Позиции победителей запомнены на прямом проходе.</p>
    </div>
    <div class="step-panel" data-on="hl route mask" data-focus="mask">
      <div class="step-kicker">Шаг 3 · ReLU</div>
      <h4>Та же маска, что вперёд</h4>
      <p>dZ = dA ⊙ [Z &gt; 0].</p>
    </div>
    <div class="step-panel" data-on="hl route mask dz" data-focus="dz">
      <div class="step-kicker">Шаг 4 · результат</div>
      <h4>dZ почти весь нулевой</h4>
      <p>На этой карте ненулевых клеток две — победители двух левых окон.</p>
    </div>
    <div class="step-panel" data-on="hl dz count" data-focus="count">
      <div class="step-kicker">Шаг 5 · разреженность</div>
      <h4>12 из 64</h4>
      <p>Пулинг и ReLU вместе делают градиент очень разреженным: ядро учится только на тех окнах, которые «победили». Это ещё одна причина, почему свёрточным сетям нужны тысячи картинок.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Первая картинка, оба канала.</p>
<div class="stage" id="stage-bp2n" tabindex="0">
  <div class="stage-figure">
<svg id="bp2n" viewBox="0 0 960 470" role="img" aria-label="Числовой обратный проход через пулинг первой картинки">
<style>
  #bp2n { font-family: Helvetica, Arial, sans-serif; }
  #bp2n .cap { font-size: 13px; fill: #5E5850; }
  #bp2n .lbl { font-size: 16px; fill: #111111; }
  #bp2n .legend { font-size: 13px; fill: #5E5850; }
  #bp2n .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #bp2n .grid { stroke: #ffffff; stroke-width: 1.35; }
  #bp2n .dim { font-size: 13px; fill: #5E5850; }
  #bp2n .nm { font-size: 16px; font-weight: 800; }
  #bp2n .op { font-size: 23px; fill: #5E5850; }
  #bp2n .arw { font-size: 12px; fill: #5E5850; }
  #bp2n .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="bp2n-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="bp2n-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="bp2n-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="bp2n-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: пулинг и ReLU назад, первая картинка</text><g data-key="p0"><text x="150.0" y="46.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">канал 1</text><g><rect x="133.0" y="78.0" width="34.0" height="34.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="150.0" y1="78.0" x2="150.0" y2="112.0" class="grid" opacity=".75"/><line x1="133.0" y1="95.0" x2="167.0" y2="95.0" class="grid" opacity=".75"/></g><text x="150.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="123.0" y="99.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="60.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dP_{0,0}"></div></foreignObject><foreignObject x="65.0" y="142.0" width="170.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0711 &amp; 0.2488 \\ 0.2133 &amp; -0.1422\end{bmatrix}"></div></foreignObject></g><g data-key="z0"><path d="M 250.0 104.0 L 290.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#bp2n-arw)"/><g><rect x="366.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="383.0" y1="70.0" x2="383.0" y2="138.0" class="grid" opacity=".75"/><line x1="400.0" y1="70.0" x2="400.0" y2="138.0" class="grid" opacity=".75"/><line x1="417.0" y1="70.0" x2="417.0" y2="138.0" class="grid" opacity=".75"/><line x1="366.0" y1="87.0" x2="434.0" y2="87.0" class="grid" opacity=".75"/><line x1="366.0" y1="104.0" x2="434.0" y2="104.0" class="grid" opacity=".75"/><line x1="366.0" y1="121.0" x2="434.0" y2="121.0" class="grid" opacity=".75"/></g><text x="400.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="356.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="310.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_{0,0}"></div></foreignObject><foreignObject x="260.0" y="168.0" width="280.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0000 &amp; 0.0000 &amp; 0.0000 &amp; 0.0000 \\ 0.0000 &amp; 0.0711 &amp; 0.0000 &amp; 0.0000 \\ 0.0000 &amp; 0.2133 &amp; 0.0000 &amp; 0.0000 \\ 0.0000 &amp; 0.0000 &amp; 0.0000 &amp; 0.0000\end{bmatrix}"></div></foreignObject></g><g data-key="p1"><text x="620.0" y="46.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">канал 2</text><g><rect x="603.0" y="78.0" width="34.0" height="34.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="620.0" y1="78.0" x2="620.0" y2="112.0" class="grid" opacity=".75"/><line x1="603.0" y1="95.0" x2="637.0" y2="95.0" class="grid" opacity=".75"/></g><text x="620.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="593.0" y="99.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="530.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dP_{0,1}"></div></foreignObject><foreignObject x="535.0" y="142.0" width="170.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0711 &amp; 0.2133 \\ -0.2844 &amp; 0.0711\end{bmatrix}"></div></foreignObject></g><g data-key="z1"><path d="M 720.0 104.0 L 760.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#bp2n-arw)"/><text x="830.0" y="64.0" font-size="13" fill="#111111" text-anchor="middle">dZ₀,₁: 4 клетки</text><text x="830.0" y="84.0" font-size="13" fill="#111111" text-anchor="middle">из 16 ненулевые</text></g><g data-key="dead" data-only="1"><text x="480.0" y="330.0" font-size="13" fill="#C30B0A" text-anchor="middle">градиенты 0.2488 и −0.1422 правых окон канала 1 пропали: победитель — нулевая клетка ReLU</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="p0" data-focus="p0">
      <div class="step-kicker">Шаг 1 · градиенты окон</div>
      <h4>Четыре числа</h4>
      <p>dPₚ первого канала первой картинки: по одному числу на окно.</p>
    </div>
    <div class="step-panel" data-on="p0 z0" data-focus="z0">
      <div class="step-kicker">Шаг 2 · маршрут</div>
      <h4>0.0711 → клетка (1, 1), 0.2133 → клетка (2, 1)</h4>
      <p>Победители левых окон — клетки (1, 1) и (2, 1). Остальные 14 клеток карты — нули.</p>
    </div>
    <div class="step-panel" data-on="z0 dead" data-focus="dead">
      <div class="step-kicker">Шаг 3 · потери</div>
      <h4>Правые окна не пропускают</h4>
      <p>Сеть «хотела бы» изменить отклик в правых окнах (0.2488 и −0.1422), но там ReLU закрыта.</p>
    </div>
    <div class="step-panel" data-on="p1 z1" data-focus="p1 z1">
      <div class="step-kicker">Шаг 4 · второй канал</div>
      <h4>Все четыре доходят</h4>
      <p>Во втором канале нулей ReLU нет, так что каждое из четырёх чисел попадает в своего победителя.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> на обратном пути max-пулинг передаёт градиент окна только в запомненную клетку-победителя, остальные клетки окна получают ноль; вместе с ReLU это оставляет ненулевыми лишь малую часть клеток.
</div>

---


## Часть 11. Backprop: через свёртку

<p>
  Благодаря im2col обратный проход свёртки — три формулы линейного слоя. Единственная новая
  операция — col2im: вернуть градиенты окон на их места в картинке, складывая перекрытия.
</p>
<div class="math-display" data-tex="dK_{mat} = \text{cols}^{\top} dZ_{flat}, \qquad db_c = \sum dZ_{flat}, \qquad d\text{cols} = dZ_{flat} K_{mat}^{\top}, \qquad dX = \text{col2im}(d\text{cols})"></div>
<div class="stage" id="stage-bp3" tabindex="0">
  <div class="stage-figure">
<svg id="bp3" viewBox="0 0 960 620" role="img" aria-label="Обратный проход свёртки через im2col: градиент ядер, смещений и картинки">
<style>
  #bp3 { font-family: Helvetica, Arial, sans-serif; }
  #bp3 .cap { font-size: 13px; fill: #5E5850; }
  #bp3 .lbl { font-size: 16px; fill: #111111; }
  #bp3 .legend { font-size: 13px; fill: #5E5850; }
  #bp3 .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #bp3 .grid { stroke: #ffffff; stroke-width: 1.35; }
  #bp3 .dim { font-size: 13px; fill: #5E5850; }
  #bp3 .nm { font-size: 16px; font-weight: 800; }
  #bp3 .op { font-size: 23px; fill: #5E5850; }
  #bp3 .arw { font-size: 12px; fill: #5E5850; }
  #bp3 .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="bp3-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="bp3-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="bp3-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="bp3-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="296" width="190" height="152" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="372.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 372)">свёрточный блок</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp3-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp3-arw)"/><path d="M 125 356 L 125 338" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp3-arw)"/><path d="M 125 304 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp3-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp3-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp3-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp3-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp3-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#bp3-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Conv 3×3</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="304" width="170" height="34" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="325.5" font-size="13" fill="#8A857C" text-anchor="middle">MaxPool 2×2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">Flatten</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#C30B0A" text-anchor="middle">Conv 3×3</text><rect x="34" y="398" width="182" height="48" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="dk"><g><rect x="290.0" y="110.0" width="160.0" height="90.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="300.0" y1="110.0" x2="300.0" y2="200.0" class="grid" opacity=".75"/><line x1="310.0" y1="110.0" x2="310.0" y2="200.0" class="grid" opacity=".75"/><line x1="320.0" y1="110.0" x2="320.0" y2="200.0" class="grid" opacity=".75"/><line x1="330.0" y1="110.0" x2="330.0" y2="200.0" class="grid" opacity=".75"/><line x1="340.0" y1="110.0" x2="340.0" y2="200.0" class="grid" opacity=".75"/><line x1="350.0" y1="110.0" x2="350.0" y2="200.0" class="grid" opacity=".75"/><line x1="360.0" y1="110.0" x2="360.0" y2="200.0" class="grid" opacity=".75"/><line x1="370.0" y1="110.0" x2="370.0" y2="200.0" class="grid" opacity=".75"/><line x1="380.0" y1="110.0" x2="380.0" y2="200.0" class="grid" opacity=".75"/><line x1="390.0" y1="110.0" x2="390.0" y2="200.0" class="grid" opacity=".75"/><line x1="400.0" y1="110.0" x2="400.0" y2="200.0" class="grid" opacity=".75"/><line x1="410.0" y1="110.0" x2="410.0" y2="200.0" class="grid" opacity=".75"/><line x1="420.0" y1="110.0" x2="420.0" y2="200.0" class="grid" opacity=".75"/><line x1="430.0" y1="110.0" x2="430.0" y2="200.0" class="grid" opacity=".75"/><line x1="440.0" y1="110.0" x2="440.0" y2="200.0" class="grid" opacity=".75"/><line x1="290.0" y1="120.0" x2="450.0" y2="120.0" class="grid" opacity=".75"/><line x1="290.0" y1="130.0" x2="450.0" y2="130.0" class="grid" opacity=".75"/><line x1="290.0" y1="140.0" x2="450.0" y2="140.0" class="grid" opacity=".75"/><line x1="290.0" y1="150.0" x2="450.0" y2="150.0" class="grid" opacity=".75"/><line x1="290.0" y1="160.0" x2="450.0" y2="160.0" class="grid" opacity=".75"/><line x1="290.0" y1="170.0" x2="450.0" y2="170.0" class="grid" opacity=".75"/><line x1="290.0" y1="180.0" x2="450.0" y2="180.0" class="grid" opacity=".75"/><line x1="290.0" y1="190.0" x2="450.0" y2="190.0" class="grid" opacity=".75"/></g><foreignObject x="330.0" y="206.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\text{cols}^{\top}"></div></foreignObject><text x="462.0" y="160.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="478.0" y="70.0" width="20.0" height="160.0" rx="2" fill="#C30B0A" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="488.0" y1="70.0" x2="488.0" y2="230.0" class="grid" opacity=".75"/><line x1="478.0" y1="80.0" x2="498.0" y2="80.0" class="grid" opacity=".75"/><line x1="478.0" y1="90.0" x2="498.0" y2="90.0" class="grid" opacity=".75"/><line x1="478.0" y1="100.0" x2="498.0" y2="100.0" class="grid" opacity=".75"/><line x1="478.0" y1="110.0" x2="498.0" y2="110.0" class="grid" opacity=".75"/><line x1="478.0" y1="120.0" x2="498.0" y2="120.0" class="grid" opacity=".75"/><line x1="478.0" y1="130.0" x2="498.0" y2="130.0" class="grid" opacity=".75"/><line x1="478.0" y1="140.0" x2="498.0" y2="140.0" class="grid" opacity=".75"/><line x1="478.0" y1="150.0" x2="498.0" y2="150.0" class="grid" opacity=".75"/><line x1="478.0" y1="160.0" x2="498.0" y2="160.0" class="grid" opacity=".75"/><line x1="478.0" y1="170.0" x2="498.0" y2="170.0" class="grid" opacity=".75"/><line x1="478.0" y1="180.0" x2="498.0" y2="180.0" class="grid" opacity=".75"/><line x1="478.0" y1="190.0" x2="498.0" y2="190.0" class="grid" opacity=".75"/><line x1="478.0" y1="200.0" x2="498.0" y2="200.0" class="grid" opacity=".75"/><line x1="478.0" y1="210.0" x2="498.0" y2="210.0" class="grid" opacity=".75"/><line x1="478.0" y1="220.0" x2="498.0" y2="220.0" class="grid" opacity=".75"/></g><foreignObject x="448.0" y="236.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_{flat}"></div></foreignObject><text x="512.0" y="160.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="528.0" y="110.0" width="20.0" height="90.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="538.0" y1="110.0" x2="538.0" y2="200.0" class="grid" opacity=".75"/><line x1="528.0" y1="120.0" x2="548.0" y2="120.0" class="grid" opacity=".75"/><line x1="528.0" y1="130.0" x2="548.0" y2="130.0" class="grid" opacity=".75"/><line x1="528.0" y1="140.0" x2="548.0" y2="140.0" class="grid" opacity=".75"/><line x1="528.0" y1="150.0" x2="548.0" y2="150.0" class="grid" opacity=".75"/><line x1="528.0" y1="160.0" x2="548.0" y2="160.0" class="grid" opacity=".75"/><line x1="528.0" y1="170.0" x2="548.0" y2="170.0" class="grid" opacity=".75"/><line x1="528.0" y1="180.0" x2="548.0" y2="180.0" class="grid" opacity=".75"/><line x1="528.0" y1="190.0" x2="548.0" y2="190.0" class="grid" opacity=".75"/></g><foreignObject x="498.0" y="206.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dK_{mat}"></div></foreignObject><path d="M 556.0 155.0 L 590.0 155.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#bp3-arw)"/><g><rect x="605.0" y="121.0" width="48.0" height="48.0" rx="2" fill="#C30B0A" opacity="0.20900000000000002" stroke="#ffffff" stroke-width="1"/><line x1="621.0" y1="121.0" x2="621.0" y2="169.0" class="grid" opacity=".75"/><line x1="637.0" y1="121.0" x2="637.0" y2="169.0" class="grid" opacity=".75"/><line x1="605.0" y1="137.0" x2="653.0" y2="137.0" class="grid" opacity=".75"/><line x1="605.0" y1="153.0" x2="653.0" y2="153.0" class="grid" opacity=".75"/></g><g><rect x="598.0" y="128.0" width="48.0" height="48.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="614.0" y1="128.0" x2="614.0" y2="176.0" class="grid" opacity=".75"/><line x1="630.0" y1="128.0" x2="630.0" y2="176.0" class="grid" opacity=".75"/><line x1="598.0" y1="144.0" x2="646.0" y2="144.0" class="grid" opacity=".75"/><line x1="598.0" y1="160.0" x2="646.0" y2="160.0" class="grid" opacity=".75"/></g><foreignObject x="605.0" y="184.0" width="50.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dK"></div></foreignObject></g><g data-key="db"><text x="700.0" y="140.0" font-size="13" fill="#C30B0A" text-anchor="start">db_c = сумма столбцов dZ_flat</text></g><g data-key="dc"><g><rect x="290.0" y="300.0" width="20.0" height="160.0" rx="2" fill="#C30B0A" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="300.0" y1="300.0" x2="300.0" y2="460.0" class="grid" opacity=".75"/><line x1="290.0" y1="310.0" x2="310.0" y2="310.0" class="grid" opacity=".75"/><line x1="290.0" y1="320.0" x2="310.0" y2="320.0" class="grid" opacity=".75"/><line x1="290.0" y1="330.0" x2="310.0" y2="330.0" class="grid" opacity=".75"/><line x1="290.0" y1="340.0" x2="310.0" y2="340.0" class="grid" opacity=".75"/><line x1="290.0" y1="350.0" x2="310.0" y2="350.0" class="grid" opacity=".75"/><line x1="290.0" y1="360.0" x2="310.0" y2="360.0" class="grid" opacity=".75"/><line x1="290.0" y1="370.0" x2="310.0" y2="370.0" class="grid" opacity=".75"/><line x1="290.0" y1="380.0" x2="310.0" y2="380.0" class="grid" opacity=".75"/><line x1="290.0" y1="390.0" x2="310.0" y2="390.0" class="grid" opacity=".75"/><line x1="290.0" y1="400.0" x2="310.0" y2="400.0" class="grid" opacity=".75"/><line x1="290.0" y1="410.0" x2="310.0" y2="410.0" class="grid" opacity=".75"/><line x1="290.0" y1="420.0" x2="310.0" y2="420.0" class="grid" opacity=".75"/><line x1="290.0" y1="430.0" x2="310.0" y2="430.0" class="grid" opacity=".75"/><line x1="290.0" y1="440.0" x2="310.0" y2="440.0" class="grid" opacity=".75"/><line x1="290.0" y1="450.0" x2="310.0" y2="450.0" class="grid" opacity=".75"/></g><foreignObject x="260.0" y="466.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_{flat}"></div></foreignObject><text x="326.0" y="390.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="342.0" y="380.0" width="90.0" height="20.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="352.0" y1="380.0" x2="352.0" y2="400.0" class="grid" opacity=".75"/><line x1="362.0" y1="380.0" x2="362.0" y2="400.0" class="grid" opacity=".75"/><line x1="372.0" y1="380.0" x2="372.0" y2="400.0" class="grid" opacity=".75"/><line x1="382.0" y1="380.0" x2="382.0" y2="400.0" class="grid" opacity=".75"/><line x1="392.0" y1="380.0" x2="392.0" y2="400.0" class="grid" opacity=".75"/><line x1="402.0" y1="380.0" x2="402.0" y2="400.0" class="grid" opacity=".75"/><line x1="412.0" y1="380.0" x2="412.0" y2="400.0" class="grid" opacity=".75"/><line x1="422.0" y1="380.0" x2="422.0" y2="400.0" class="grid" opacity=".75"/><line x1="342.0" y1="390.0" x2="432.0" y2="390.0" class="grid" opacity=".75"/></g><foreignObject x="347.0" y="406.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="K_{mat}^{\top}"></div></foreignObject><text x="446.0" y="390.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="462.0" y="300.0" width="90.0" height="160.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="472.0" y1="300.0" x2="472.0" y2="460.0" class="grid" opacity=".75"/><line x1="482.0" y1="300.0" x2="482.0" y2="460.0" class="grid" opacity=".75"/><line x1="492.0" y1="300.0" x2="492.0" y2="460.0" class="grid" opacity=".75"/><line x1="502.0" y1="300.0" x2="502.0" y2="460.0" class="grid" opacity=".75"/><line x1="512.0" y1="300.0" x2="512.0" y2="460.0" class="grid" opacity=".75"/><line x1="522.0" y1="300.0" x2="522.0" y2="460.0" class="grid" opacity=".75"/><line x1="532.0" y1="300.0" x2="532.0" y2="460.0" class="grid" opacity=".75"/><line x1="542.0" y1="300.0" x2="542.0" y2="460.0" class="grid" opacity=".75"/><line x1="462.0" y1="310.0" x2="552.0" y2="310.0" class="grid" opacity=".75"/><line x1="462.0" y1="320.0" x2="552.0" y2="320.0" class="grid" opacity=".75"/><line x1="462.0" y1="330.0" x2="552.0" y2="330.0" class="grid" opacity=".75"/><line x1="462.0" y1="340.0" x2="552.0" y2="340.0" class="grid" opacity=".75"/><line x1="462.0" y1="350.0" x2="552.0" y2="350.0" class="grid" opacity=".75"/><line x1="462.0" y1="360.0" x2="552.0" y2="360.0" class="grid" opacity=".75"/><line x1="462.0" y1="370.0" x2="552.0" y2="370.0" class="grid" opacity=".75"/><line x1="462.0" y1="380.0" x2="552.0" y2="380.0" class="grid" opacity=".75"/><line x1="462.0" y1="390.0" x2="552.0" y2="390.0" class="grid" opacity=".75"/><line x1="462.0" y1="400.0" x2="552.0" y2="400.0" class="grid" opacity=".75"/><line x1="462.0" y1="410.0" x2="552.0" y2="410.0" class="grid" opacity=".75"/><line x1="462.0" y1="420.0" x2="552.0" y2="420.0" class="grid" opacity=".75"/><line x1="462.0" y1="430.0" x2="552.0" y2="430.0" class="grid" opacity=".75"/><line x1="462.0" y1="440.0" x2="552.0" y2="440.0" class="grid" opacity=".75"/><line x1="462.0" y1="450.0" x2="552.0" y2="450.0" class="grid" opacity=".75"/></g><foreignObject x="467.0" y="466.0" width="80.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="d\text{cols}"></div></foreignObject></g><g data-key="c2i"><path d="M 560.0 380.0 L 600.0 380.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#bp3-arw)"/><text x="580.0" y="370.0" font-size="12" fill="#5E5850" text-anchor="middle">col2im</text><g><rect x="608.0" y="332.0" width="96.0" height="96.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="624.0" y1="332.0" x2="624.0" y2="428.0" class="grid" opacity=".75"/><line x1="640.0" y1="332.0" x2="640.0" y2="428.0" class="grid" opacity=".75"/><line x1="656.0" y1="332.0" x2="656.0" y2="428.0" class="grid" opacity=".75"/><line x1="672.0" y1="332.0" x2="672.0" y2="428.0" class="grid" opacity=".75"/><line x1="688.0" y1="332.0" x2="688.0" y2="428.0" class="grid" opacity=".75"/><line x1="608.0" y1="348.0" x2="704.0" y2="348.0" class="grid" opacity=".75"/><line x1="608.0" y1="364.0" x2="704.0" y2="364.0" class="grid" opacity=".75"/><line x1="608.0" y1="380.0" x2="704.0" y2="380.0" class="grid" opacity=".75"/><line x1="608.0" y1="396.0" x2="704.0" y2="396.0" class="grid" opacity=".75"/><line x1="608.0" y1="412.0" x2="704.0" y2="412.0" class="grid" opacity=".75"/></g><foreignObject x="626.0" y="434.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dX"></div></foreignObject><text x="720.0" y="360.0" font-size="13" fill="#5E5850" text-anchor="start">каждое окно прибавляет</text><text x="720.0" y="378.0" font-size="13" fill="#5E5850" text-anchor="start">свою строку dcols</text><text x="720.0" y="396.0" font-size="13" fill="#5E5850" text-anchor="start">обратно на своё место</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="500.0" width="650.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dK = \sum_{\text{окна}} \text{патч} \cdot dz, \qquad dX = \text{pad}(dZ,\,2) \star \text{rot}_{180}(K)"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">красное — градиенты · фиолетовое — веса</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl dk" data-focus="hl dk">
      <div class="step-kicker">Шаг 1 · градиент ядер</div>
      <h4>dK_mat = colsᵀ · dZ_flat</h4>
      <p>Раз свёртка — это линейный слой над окнами, градиент весов — его обычная формула: транспонированный вход на градиент выхода. <code>[9 × 16] · [16 × 2] = [9 × 2]</code>, для батча — сумма по всем 32 окнам. Каждое окно вносит вклад «патч × его dz».</p>
    </div>
    <div class="step-panel" data-on="hl dk db" data-focus="db">
      <div class="step-kicker">Шаг 2 · смещения</div>
      <h4>Сумма по всем окнам</h4>
      <p>Смещение канала прибавлялось в каждом окне — значит, градиент суммируется по всем клеткам карты.</p>
    </div>
    <div class="step-panel" data-on="hl dc" data-focus="dc">
      <div class="step-kicker">Шаг 3 · градиент по окнам</div>
      <h4>dcols = dZ_flat · K_matᵀ</h4>
      <p>Третья формула линейного слоя: градиент по входу. Получается по строке из 9 чисел на окно.</p>
    </div>
    <div class="step-panel" data-on="hl dc c2i" data-focus="c2i">
      <div class="step-kicker">Шаг 4 · обратно в картинку</div>
      <h4>Перекрытия складываются</h4>
      <p>Пиксель входил в несколько окон — значит, собирает градиент со всех (копия вперёд ⇔ сумма назад). Эта операция — col2im, обратная к im2col.</p>
    </div>
    <div class="step-panel" data-on="hl dk c2i f" data-focus="f">
      <div class="step-kicker">Шаг 5 · в классической записи</div>
      <h4>Перевёрнутое ядро</h4>
      <p>Если расписать col2im по индексам, получится свёртка дополненного нулями dZ с ядром, повёрнутым на 180°. Две записи — одно и то же вычисление; im2col-вариант легче вывести и проверить.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Градиенты ядер, смещений и пикселей первой картинки.</p>
<div class="stage" id="stage-bp3n" tabindex="0">
  <div class="stage-figure">
<svg id="bp3n" viewBox="0 0 960 560" role="img" aria-label="Числовые градиенты свёрточного слоя">
<style>
  #bp3n { font-family: Helvetica, Arial, sans-serif; }
  #bp3n .cap { font-size: 13px; fill: #5E5850; }
  #bp3n .lbl { font-size: 16px; fill: #111111; }
  #bp3n .legend { font-size: 13px; fill: #5E5850; }
  #bp3n .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #bp3n .grid { stroke: #ffffff; stroke-width: 1.35; }
  #bp3n .dim { font-size: 13px; fill: #5E5850; }
  #bp3n .nm { font-size: 16px; font-weight: 800; }
  #bp3n .op { font-size: 23px; fill: #5E5850; }
  #bp3n .arw { font-size: 12px; fill: #5E5850; }
  #bp3n .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="bp3n-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="bp3n-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="bp3n-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="bp3n-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: dK, db_c и dX</text><g data-key="dk"><g><rect x="144.5" y="70.0" width="51.0" height="51.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="161.5" y1="70.0" x2="161.5" y2="121.0" class="grid" opacity=".75"/><line x1="178.5" y1="70.0" x2="178.5" y2="121.0" class="grid" opacity=".75"/><line x1="144.5" y1="87.0" x2="195.5" y2="87.0" class="grid" opacity=".75"/><line x1="144.5" y1="104.0" x2="195.5" y2="104.0" class="grid" opacity=".75"/></g><text x="170.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="134.5" y="99.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="80.0" y="124.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dK_1"></div></foreignObject><foreignObject x="55.0" y="151.0" width="230.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0000 &amp; 0.2417 &amp; 0.0995 \\ -0.0182 &amp; 0.2423 &amp; 0.1300 \\ -0.0423 &amp; 0.1722 &amp; 0.1134\end{bmatrix}"></div></foreignObject><g><rect x="424.5" y="70.0" width="51.0" height="51.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="441.5" y1="70.0" x2="441.5" y2="121.0" class="grid" opacity=".75"/><line x1="458.5" y1="70.0" x2="458.5" y2="121.0" class="grid" opacity=".75"/><line x1="424.5" y1="87.0" x2="475.5" y2="87.0" class="grid" opacity=".75"/><line x1="424.5" y1="104.0" x2="475.5" y2="104.0" class="grid" opacity=".75"/></g><text x="450.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="414.5" y="99.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="360.0" y="124.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dK_2"></div></foreignObject><foreignObject x="335.0" y="151.0" width="230.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.3015 &amp; 0.0036 &amp; -0.0284 \\ 0.2290 &amp; -0.1173 &amp; -0.1365 \\ 0.2344 &amp; -0.0037 &amp; -0.1391\end{bmatrix}"></div></foreignObject></g><g data-key="db"><g><rect x="743.0" y="78.0" width="34.0" height="17.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="760.0" y1="78.0" x2="760.0" y2="95.0" class="grid" opacity=".75"/></g><text x="760.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="733.0" y="90.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="670.0" y="98.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="db_c"></div></foreignObject><foreignObject x="675.0" y="125.0" width="170.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2362 &amp; 0.0604\end{bmatrix}"></div></foreignObject></g><g data-key="dx"><g><rect x="249.0" y="280.0" width="102.0" height="102.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="266.0" y1="280.0" x2="266.0" y2="382.0" class="grid" opacity=".75"/><line x1="283.0" y1="280.0" x2="283.0" y2="382.0" class="grid" opacity=".75"/><line x1="300.0" y1="280.0" x2="300.0" y2="382.0" class="grid" opacity=".75"/><line x1="317.0" y1="280.0" x2="317.0" y2="382.0" class="grid" opacity=".75"/><line x1="334.0" y1="280.0" x2="334.0" y2="382.0" class="grid" opacity=".75"/><line x1="249.0" y1="297.0" x2="351.0" y2="297.0" class="grid" opacity=".75"/><line x1="249.0" y1="314.0" x2="351.0" y2="314.0" class="grid" opacity=".75"/><line x1="249.0" y1="331.0" x2="351.0" y2="331.0" class="grid" opacity=".75"/><line x1="249.0" y1="348.0" x2="351.0" y2="348.0" class="grid" opacity=".75"/><line x1="249.0" y1="365.0" x2="351.0" y2="365.0" class="grid" opacity=".75"/></g><text x="300.0" y="272.0" font-size="13" fill="#111111" text-anchor="middle">6</text><text x="239.0" y="335.0" font-size="13" fill="#111111" text-anchor="end">6</text><foreignObject x="210.0" y="385.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dX_{0,0}"></div></foreignObject><foreignObject x="105.0" y="412.0" width="390.0" height="144.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.000 &amp; 0.000 &amp; 0.000 &amp; 0.000 &amp; 0.000 &amp; 0.000 \\ 0.000 &amp; -0.036 &amp; -0.007 &amp; 0.078 &amp; 0.085 &amp; 0.000 \\ 0.000 &amp; -0.036 &amp; 0.050 &amp; 0.014 &amp; 0.171 &amp; 0.000 \\ 0.000 &amp; -0.100 &amp; 0.057 &amp; -0.043 &amp; 0.178 &amp; 0.000 \\ 0.000 &amp; -0.142 &amp; 0.007 &amp; 0.121 &amp; 0.057 &amp; 0.000 \\ 0.000 &amp; 0.000 &amp; 0.036 &amp; 0.021 &amp; 0.050 &amp; 0.000\end{bmatrix}"></div></foreignObject></g><g data-key="rot" data-only="1"><text x="720.0" y="330.0" font-size="13" fill="#3576C0" text-anchor="middle">через pad + rot₁₈₀(K):</text><text x="720.0" y="350.0" font-size="13" fill="#3576C0" text-anchor="middle">расхождение 2.8 · 10⁻¹⁷</text><text x="720.0" y="400.0" font-size="13" fill="#5E5850" text-anchor="middle">первая строка и крайние</text><text x="720.0" y="418.0" font-size="13" fill="#5E5850" text-anchor="middle">столбцы dX — нули: эти пиксели</text><text x="720.0" y="436.0" font-size="13" fill="#5E5850" text-anchor="middle">попали только в окна без градиента</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="dk" data-focus="dk">
      <div class="step-kicker">Шаг 1 · ядра</div>
      <h4>dK₁ и dK₂</h4>
      <p>Левый верхний вес первого ядра получил ровно 0: во всех окнах-победителях первого канала этот пиксель пустой.</p>
    </div>
    <div class="step-panel" data-on="dk db" data-focus="db">
      <div class="step-kicker">Шаг 2 · смещения</div>
      <h4>0.2362 и 0.0604</h4>
      <p>Сумма всех ненулевых клеток dZ соответствующего канала по обеим картинкам.</p>
    </div>
    <div class="step-panel" data-on="dx" data-focus="dx">
      <div class="step-kicker">Шаг 3 · по картинке</div>
      <h4>dX первой картинки</h4>
      <p>Градиент по пикселям — «какие пиксели надо сделать ярче, чтобы сеть ошиблась меньше». Для обучения не нужен, но на нём строятся карты значимости.</p>
    </div>
    <div class="step-panel" data-on="dx rot" data-focus="rot">
      <div class="step-kicker">Шаг 4 · сверка</div>
      <h4>Две формулы совпали</h4>
      <p>col2im и свёртка с перевёрнутым ядром дают одно и то же.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout-blue">
  <strong>Проверка формами.</strong> dK обязан быть <code>[2 × 1 × 3 × 3]</code>, то есть
  <code>[9 × 2]</code> после разворота. Из <code>cols [32 × 9]</code> и <code>dZ_flat [32 × 2]</code>
  такую форму даёт единственное произведение <span class="math-inline" data-tex="\text{cols}^{\top} dZ_{flat}"></span>;
  сумма по всем окнам всех картинок — во внутренней размерности 32.
</div>
<div class="callout">
  <strong>Главная мысль части:</strong> градиент ядра — сумма «патч × dz» по всем окнам, то есть <span class="math-inline" data-tex="\text{cols}^{\top}dZ"></span>; градиент картинки — col2im от <span class="math-inline" data-tex="dZ\,K^{\top}"></span>, что то же самое, что свёртка с повёрнутым ядром.
</div>

---


## Часть 12. Проверка градиента и обучение

<p>
  Формулы выведены руками — проверим их конечными разностями и обучим сеть.
</p>
<div class="math-display" data-tex="\frac{\partial L}{\partial \theta} \approx \frac{L(\theta+\varepsilon) - L(\theta-\varepsilon)}{2\varepsilon}, \qquad \theta \leftarrow \theta - \eta\,\frac{\partial L}{\partial \theta}"></div>
<div class="stage" id="stage-tr" tabindex="0">
  <div class="stage-figure">
<svg id="tr" viewBox="0 0 960 540" role="img" aria-label="Сверка градиентов и кривые обучения свёрточной сети">
<style>
  #tr { font-family: Helvetica, Arial, sans-serif; }
  #tr .cap { font-size: 13px; fill: #5E5850; }
  #tr .lbl { font-size: 16px; fill: #111111; }
  #tr .legend { font-size: 13px; fill: #5E5850; }
  #tr .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #tr .grid { stroke: #ffffff; stroke-width: 1.35; }
  #tr .dim { font-size: 13px; fill: #5E5850; }
  #tr .nm { font-size: 16px; font-weight: 800; }
  #tr .op { font-size: 23px; fill: #5E5850; }
  #tr .arw { font-size: 12px; fill: #5E5850; }
  #tr .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="tr-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="tr-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="tr-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="tr-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Проверка градиента и обучение</text><g data-key="check"><text x="30.0" y="80.0" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">параметр</text><text x="140.0" y="80.0" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">форма</text><text x="250.0" y="80.0" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">max |аналитика − разности|</text><line x1="30" y1="90" x2="440" y2="90" stroke="#E0DDD3" stroke-width="1.2"/><text x="30.0" y="116.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">K</text><text x="140.0" y="116.0" font-size="14" fill="#111111" text-anchor="start">[2×1×3×3]</text><text x="250.0" y="116.0" font-size="14" fill="#5F9420" text-anchor="start">9,5 · 10<tspan baseline-shift="super" font-size="11">-11</tspan></text><text x="30.0" y="146.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">b_c</text><text x="140.0" y="146.0" font-size="14" fill="#111111" text-anchor="start">[2]</text><text x="250.0" y="146.0" font-size="14" fill="#5F9420" text-anchor="start">4,3 · 10<tspan baseline-shift="super" font-size="11">-11</tspan></text><text x="30.0" y="176.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">W</text><text x="140.0" y="176.0" font-size="14" fill="#111111" text-anchor="start">[8 × 2]</text><text x="250.0" y="176.0" font-size="14" fill="#5F9420" text-anchor="start">8,9 · 10<tspan baseline-shift="super" font-size="11">-11</tspan></text><text x="30.0" y="206.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">b</text><text x="140.0" y="206.0" font-size="14" fill="#111111" text-anchor="start">[2]</text><text x="250.0" y="206.0" font-size="14" fill="#5F9420" text-anchor="start">3,4 · 10<tspan baseline-shift="super" font-size="11">-11</tspan></text><text x="30.0" y="250.0" font-size="13" fill="#5E5850" text-anchor="start">центральные разности, ε = 10⁻⁶, все 38 параметров</text></g><g data-key="eps" data-only="1"><text x="30.0" y="300.0" font-size="13" fill="#C30B0A" text-anchor="start">при ε = 0.1 для b_c[1] разности дают 0.2143 вместо 0.2362:</text><text x="30.0" y="318.0" font-size="13" fill="#C30B0A" text-anchor="start">сдвиг смещения открывает закрытые клетки ReLU</text><text x="30.0" y="336.0" font-size="13" fill="#C30B0A" text-anchor="start">и меняет победителей пулинга</text></g><line x1="520" y1="440" x2="920" y2="440" stroke="#8A857C"/><line x1="520" y1="440" x2="520" y2="100" stroke="#8A857C"/><text x="512.0" y="444.0" font-size="12" fill="#5E5850" text-anchor="end">0,0</text><line x1="520" y1="440" x2="920" y2="440" stroke="#EFECE4"/><text x="512.0" y="344.0" font-size="12" fill="#5E5850" text-anchor="end">0,5</text><line x1="520" y1="340.0" x2="920" y2="340.0" stroke="#EFECE4"/><text x="512.0" y="244.0" font-size="12" fill="#5E5850" text-anchor="end">1,0</text><line x1="520" y1="240.0" x2="920" y2="240.0" stroke="#EFECE4"/><text x="512.0" y="144.0" font-size="12" fill="#5E5850" text-anchor="end">1,5</text><line x1="520" y1="140.0" x2="920" y2="140.0" stroke="#EFECE4"/><text x="520.0" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">0</text><text x="653.3" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">100</text><text x="786.7" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">200</text><text x="920.0" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">300</text><text x="920.0" y="476.0" font-size="12" fill="#5E5850" text-anchor="end">шаг обучения</text><text x="526.0" y="92.0" font-size="13" fill="#5E5850" text-anchor="start" font-style="italic">L</text><g data-key="c05"><polyline points="520.0,304.6 521.3,186.2 522.7,317.9 524.0,416.0 525.3,425.1 526.7,429.3 528.0,431.6 529.3,433.1 530.7,434.0 532.0,434.7 533.3,435.3 534.7,435.8 536.0,436.2 537.3,436.5 538.7,436.8 540.0,437.0 541.3,437.3 542.7,437.4 544.0,437.6 545.3,437.8 546.7,437.9 548.0,438.0 549.3,438.1 550.7,438.2 552.0,438.3 553.3,438.4 554.7,438.4 556.0,438.5 557.3,438.6 558.7,438.6 560.0,438.7 561.3,438.7 562.7,438.8 564.0,438.8 565.3,438.9 566.7,438.9 568.0,438.9 569.3,439.0 570.7,439.0 572.0,439.0 573.3,439.1 574.7,439.1 576.0,439.1 577.3,439.1 578.7,439.2 580.0,439.2 581.3,439.2 582.7,439.2 584.0,439.2 585.3,439.3 586.7,439.3 588.0,439.3 589.3,439.3 590.7,439.3 592.0,439.3 593.3,439.4 594.7,439.4 596.0,439.4 597.3,439.4 598.7,439.4 600.0,439.4 601.3,439.4 602.7,439.4 604.0,439.5 605.3,439.5 606.7,439.5 608.0,439.5 609.3,439.5 610.7,439.5 612.0,439.5 613.3,439.5 614.7,439.5 616.0,439.5 617.3,439.5 618.7,439.5 620.0,439.6 621.3,439.6 622.7,439.6 624.0,439.6 625.3,439.6 626.7,439.6 628.0,439.6 629.3,439.6 630.7,439.6 632.0,439.6 633.3,439.6 634.7,439.6 636.0,439.6 637.3,439.6 638.7,439.6 640.0,439.6 641.3,439.6 642.7,439.7 644.0,439.7 645.3,439.7 646.7,439.7 648.0,439.7 649.3,439.7 650.7,439.7 652.0,439.7 653.3,439.7 654.7,439.7 656.0,439.7 657.3,439.7 658.7,439.7 660.0,439.7 661.3,439.7 662.7,439.7 664.0,439.7 665.3,439.7 666.7,439.7 668.0,439.7 669.3,439.7 670.7,439.7 672.0,439.7 673.3,439.7 674.7,439.7 676.0,439.7 677.3,439.7 678.7,439.7 680.0,439.7 681.3,439.7 682.7,439.7 684.0,439.8 685.3,439.8 686.7,439.8 688.0,439.8 689.3,439.8 690.7,439.8 692.0,439.8 693.3,439.8 694.7,439.8 696.0,439.8 697.3,439.8 698.7,439.8 700.0,439.8 701.3,439.8 702.7,439.8 704.0,439.8 705.3,439.8 706.7,439.8 708.0,439.8 709.3,439.8 710.7,439.8 712.0,439.8 713.3,439.8 714.7,439.8 716.0,439.8 717.3,439.8 718.7,439.8 720.0,439.8 721.3,439.8 722.7,439.8 724.0,439.8 725.3,439.8 726.7,439.8 728.0,439.8 729.3,439.8 730.7,439.8 732.0,439.8 733.3,439.8 734.7,439.8 736.0,439.8 737.3,439.8 738.7,439.8 740.0,439.8 741.3,439.8 742.7,439.8 744.0,439.8 745.3,439.8 746.7,439.8 748.0,439.8 749.3,439.8 750.7,439.8 752.0,439.8 753.3,439.8 754.7,439.8 756.0,439.8 757.3,439.8 758.7,439.8 760.0,439.8 761.3,439.8 762.7,439.8 764.0,439.8 765.3,439.8 766.7,439.8 768.0,439.8 769.3,439.8 770.7,439.8 772.0,439.9 773.3,439.9 774.7,439.9 776.0,439.9 777.3,439.9 778.7,439.9 780.0,439.9 781.3,439.9 782.7,439.9 784.0,439.9 785.3,439.9 786.7,439.9 788.0,439.9 789.3,439.9 790.7,439.9 792.0,439.9 793.3,439.9 794.7,439.9 796.0,439.9 797.3,439.9 798.7,439.9 800.0,439.9 801.3,439.9 802.7,439.9 804.0,439.9 805.3,439.9 806.7,439.9 808.0,439.9 809.3,439.9 810.7,439.9 812.0,439.9 813.3,439.9 814.7,439.9 816.0,439.9 817.3,439.9 818.7,439.9 820.0,439.9 821.3,439.9 822.7,439.9 824.0,439.9 825.3,439.9 826.7,439.9 828.0,439.9 829.3,439.9 830.7,439.9 832.0,439.9 833.3,439.9 834.7,439.9 836.0,439.9 837.3,439.9 838.7,439.9 840.0,439.9 841.3,439.9 842.7,439.9 844.0,439.9 845.3,439.9 846.7,439.9 848.0,439.9 849.3,439.9 850.7,439.9 852.0,439.9 853.3,439.9 854.7,439.9 856.0,439.9 857.3,439.9 858.7,439.9 860.0,439.9 861.3,439.9 862.7,439.9 864.0,439.9 865.3,439.9 866.7,439.9 868.0,439.9 869.3,439.9 870.7,439.9 872.0,439.9 873.3,439.9 874.7,439.9 876.0,439.9 877.3,439.9 878.7,439.9 880.0,439.9 881.3,439.9 882.7,439.9 884.0,439.9 885.3,439.9 886.7,439.9 888.0,439.9 889.3,439.9 890.7,439.9 892.0,439.9 893.3,439.9 894.7,439.9 896.0,439.9 897.3,439.9 898.7,439.9 900.0,439.9 901.3,439.9 902.7,439.9 904.0,439.9 905.3,439.9 906.7,439.9 908.0,439.9 909.3,439.9 910.7,439.9 912.0,439.9 913.3,439.9 914.7,439.9 916.0,439.9 917.3,439.9 918.7,439.9 920.0,439.9" fill="none" stroke="#4E9A38" stroke-width="2.6"/><text x="920.0" y="426.0" font-size="12" fill="#4E9A38" text-anchor="end" font-weight="700">η = 0.5: → 0.0004</text></g><g data-key="c2" data-only="1"><polyline points="520.0,304.6 521.3,110.0 522.7,277.7 524.0,301.2 525.3,301.4 526.7,301.4 528.0,301.4 529.3,301.4 530.7,301.4 532.0,301.4 533.3,301.4 534.7,301.4 536.0,301.4 537.3,301.4 538.7,301.4 540.0,301.4 541.3,301.4 542.7,301.4 544.0,301.4 545.3,301.4 546.7,301.4 548.0,301.4 549.3,301.4 550.7,301.4 552.0,301.4 553.3,301.4 554.7,301.4 556.0,301.4 557.3,301.4 558.7,301.4 560.0,301.4 561.3,301.4 562.7,301.4 564.0,301.4 565.3,301.4 566.7,301.4 568.0,301.4 569.3,301.4 570.7,301.4 572.0,301.4 573.3,301.4 574.7,301.4 576.0,301.4 577.3,301.4 578.7,301.4 580.0,301.4 581.3,301.4 582.7,301.4 584.0,301.4 585.3,301.4 586.7,301.4 588.0,301.4 589.3,301.4 590.7,301.4 592.0,301.4 593.3,301.4 594.7,301.4 596.0,301.4 597.3,301.4 598.7,301.4 600.0,301.4 601.3,301.4 602.7,301.4 604.0,301.4 605.3,301.4 606.7,301.4 608.0,301.4 609.3,301.4 610.7,301.4 612.0,301.4 613.3,301.4 614.7,301.4 616.0,301.4 617.3,301.4 618.7,301.4 620.0,301.4 621.3,301.4 622.7,301.4 624.0,301.4 625.3,301.4 626.7,301.4 628.0,301.4 629.3,301.4 630.7,301.4 632.0,301.4 633.3,301.4 634.7,301.4 636.0,301.4 637.3,301.4 638.7,301.4 640.0,301.4 641.3,301.4 642.7,301.4 644.0,301.4 645.3,301.4 646.7,301.4 648.0,301.4 649.3,301.4 650.7,301.4 652.0,301.4 653.3,301.4 654.7,301.4 656.0,301.4 657.3,301.4 658.7,301.4 660.0,301.4 661.3,301.4 662.7,301.4 664.0,301.4 665.3,301.4 666.7,301.4 668.0,301.4 669.3,301.4 670.7,301.4 672.0,301.4 673.3,301.4 674.7,301.4 676.0,301.4 677.3,301.4 678.7,301.4 680.0,301.4 681.3,301.4 682.7,301.4 684.0,301.4 685.3,301.4 686.7,301.4 688.0,301.4 689.3,301.4 690.7,301.4 692.0,301.4 693.3,301.4 694.7,301.4 696.0,301.4 697.3,301.4 698.7,301.4 700.0,301.4 701.3,301.4 702.7,301.4 704.0,301.4 705.3,301.4 706.7,301.4 708.0,301.4 709.3,301.4 710.7,301.4 712.0,301.4 713.3,301.4 714.7,301.4 716.0,301.4 717.3,301.4 718.7,301.4 720.0,301.4 721.3,301.4 722.7,301.4 724.0,301.4 725.3,301.4 726.7,301.4 728.0,301.4 729.3,301.4 730.7,301.4 732.0,301.4 733.3,301.4 734.7,301.4 736.0,301.4 737.3,301.4 738.7,301.4 740.0,301.4 741.3,301.4 742.7,301.4 744.0,301.4 745.3,301.4 746.7,301.4 748.0,301.4 749.3,301.4 750.7,301.4 752.0,301.4 753.3,301.4 754.7,301.4 756.0,301.4 757.3,301.4 758.7,301.4 760.0,301.4 761.3,301.4 762.7,301.4 764.0,301.4 765.3,301.4 766.7,301.4 768.0,301.4 769.3,301.4 770.7,301.4 772.0,301.4 773.3,301.4 774.7,301.4 776.0,301.4 777.3,301.4 778.7,301.4 780.0,301.4 781.3,301.4 782.7,301.4 784.0,301.4 785.3,301.4 786.7,301.4 788.0,301.4 789.3,301.4 790.7,301.4 792.0,301.4 793.3,301.4 794.7,301.4 796.0,301.4 797.3,301.4 798.7,301.4 800.0,301.4 801.3,301.4 802.7,301.4 804.0,301.4 805.3,301.4 806.7,301.4 808.0,301.4 809.3,301.4 810.7,301.4 812.0,301.4 813.3,301.4 814.7,301.4 816.0,301.4 817.3,301.4 818.7,301.4 820.0,301.4 821.3,301.4 822.7,301.4 824.0,301.4 825.3,301.4 826.7,301.4 828.0,301.4 829.3,301.4 830.7,301.4 832.0,301.4 833.3,301.4 834.7,301.4 836.0,301.4 837.3,301.4 838.7,301.4 840.0,301.4 841.3,301.4 842.7,301.4 844.0,301.4 845.3,301.4 846.7,301.4 848.0,301.4 849.3,301.4 850.7,301.4 852.0,301.4 853.3,301.4 854.7,301.4 856.0,301.4 857.3,301.4 858.7,301.4 860.0,301.4 861.3,301.4 862.7,301.4 864.0,301.4 865.3,301.4 866.7,301.4 868.0,301.4 869.3,301.4 870.7,301.4 872.0,301.4 873.3,301.4 874.7,301.4 876.0,301.4 877.3,301.4 878.7,301.4 880.0,301.4 881.3,301.4 882.7,301.4 884.0,301.4 885.3,301.4 886.7,301.4 888.0,301.4 889.3,301.4 890.7,301.4 892.0,301.4 893.3,301.4 894.7,301.4 896.0,301.4 897.3,301.4 898.7,301.4 900.0,301.4 901.3,301.4 902.7,301.4 904.0,301.4 905.3,301.4 906.7,301.4 908.0,301.4 909.3,301.4 910.7,301.4 912.0,301.4 913.3,301.4 914.7,301.4 916.0,301.4 917.3,301.4 918.7,301.4 920.0,301.4" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="920.0" y="291.4" font-size="12" fill="#C30B0A" text-anchor="end" font-weight="700">η = 2: застыла на ln 2</text></g><g data-key="dead" data-only="1"><text x="30.0" y="400.0" font-size="13" fill="#C30B0A" text-anchor="start">при η = 2 после скачка до L = 6.55 все пред-активации</text><text x="30.0" y="418.0" font-size="13" fill="#C30B0A" text-anchor="start">свёртки ушли в минус (максимум −1.99): признаки нулевые,</text><text x="30.0" y="436.0" font-size="13" fill="#C30B0A" text-anchor="start">ответ всегда (0.5, 0.5), L = ln 2 навсегда</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="check" data-focus="check">
      <div class="step-kicker">Шаг 1 · сверка</div>
      <h4>Все 38 производных</h4>
      <p>Худшее расхождение — 9,5·10⁻¹¹: пулинг-маршрутизация, маски и im2col-формулы верны.</p>
    </div>
    <div class="step-panel" data-on="check eps" data-focus="eps">
      <div class="step-kicker">Шаг 2 · где проверка ломается</div>
      <h4>Большой ε меняет маршрут</h4>
      <p>Ближайшая к нулю пред-активация — 0.07. Шаг 0.1 её перескакивает: открывается клетка ReLU и может смениться победитель окна, а разность считает уже «другую» сеть.</p>
    </div>
    <div class="step-panel" data-on="c05" data-focus="c05">
      <div class="step-kicker">Шаг 3 · обучение</div>
      <h4>η = 0.5</h4>
      <p>Первый шаг перелетает (0.6772 → 1.2690), но уже к десятому потеря 0.0234, к трёхсотому — 0.0004; обе полосы распознаются.</p>
    </div>
    <div class="step-panel" data-on="c05 c2 dead" data-focus="c2 dead">
      <div class="step-kicker">Шаг 4 · слишком большой шаг</div>
      <h4>Сеть умерла</h4>
      <p>При η = 2 первый шаг выбрасывает потерю до 6.55, а через несколько шагов все пред-активации свёртки становятся отрицательными (к концу максимум −1.99). Признаки нулевые, градиент к ядрам не доходит, и сеть навсегда отвечает (0.5, 0.5) — ровно ln 2.</p>
    </div>
    <div class="step-panel" data-on="check c05" data-focus="c05">
      <div class="step-kicker">Шаг 5 · итог</div>
      <h4>Весь цикл</h4>
      <p>Свёртка как im2col-линейный слой, ReLU, пулинг с запоминанием победителей, классификатор — и обратный проход по тем же шагам в обратном порядке.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> обратный проход CNN проверяется так же, как любой другой, но ε должен быть меньше расстояния до ближайшего излома ReLU и смены победителя пулинга; слишком большой шаг обучения убивает все клетки ReLU разом.
</div>

---


## Часть 13. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Вход — <code>[B × C × H × W]</code>;</strong> свёртка работает с пространственными осями, не выпрямляя их.</li>
  <li><strong>Окно свёртки</strong> — скалярное произведение патча и ядра плюс смещение: работа одного нейрона с локальным входом.</li>
  <li><strong>Веса слоя</strong> <code>[C_out × C_in × K × K]</code>; число каналов выхода = число ядер.</li>
  <li><strong>Размер выхода</strong> при шаге 1 и без дополнения: <span class="math-inline" data-tex="H - K + 1"></span>.</li>
  <li><strong>im2col:</strong> окна строками, ядра столбцами — свёртка становится <code>[окна × C_in·K²] · [C_in·K² × C_out]</code>.</li>
  <li><strong>ReLU поэлементна,</strong> max-пулинг 2 × 2 делит сторону пополам и запоминает победителей.</li>
  <li><strong>Flatten</strong> — перестановка осей; классификатор — обычный полносвязный слой.</li>
  <li><strong>Свёртка эквивариантна сдвигу</strong> и экономит параметры: 20 против 1184 в нашем примере.</li>
  <li><strong>Пулинг назад:</strong> весь градиент окна — в победителя.</li>
  <li><strong>Свёртка назад:</strong> <span class="math-inline" data-tex="dK = \text{cols}^{\top}dZ"></span>, <span class="math-inline" data-tex="db_c = \sum dZ"></span>, <span class="math-inline" data-tex="dX = \text{col2im}(dZ\,K^{\top})"></span> = свёртка с повёрнутым ядром.</li>
  <li><strong>Нулевые градиенты — норма:</strong> пустой признак даёт нулевую строку dW, пустой пиксель окна — нулевой вес dK.</li>
</ol>

<p>
  Если держать в голове одну картину — пусть это будет цепочка форм:
  <code>[2 × 1 × 6 × 6] → [2 × 2 × 4 × 4] → [2 × 2 × 2 × 2] → [2 × 8] → [2 × 2] → L</code>
  и та же цепочка назад, где свёртка на время превращается в матрицу окон <code>[32 × 9]</code>.
</p>

<div class="callout-yellow">
  <strong>Мелочи соглашений,</strong> которые стоит держать в уме при сверке с другими источниками:
  в PyTorch <code>nn.Conv2d</code> хранит веса как <code>[C_out × C_in × K × K]</code> и считает
  корреляцию без переворота ядра; в TensorFlow по умолчанию каналы последние, <code>[B × H × W × C]</code>;
  при дополнении нулями (padding = 1 для ядра 3 × 3) размер карты не уменьшается, а при шаге s
  выход равен <span class="math-inline" data-tex="\lfloor (H + 2p - K)/s \rfloor + 1"></span>.
</div>

<p class="tiny">
  Сквозной пример: две картинки 6 × 6 — вертикальная полоса (класс 0) и горизонтальная (класс 1), яркость
  полос неровная (0.7–1.0 и 0.3–0.6), чтобы в окнах пулинга не было ничьих. Сеть: Conv2d(1 → 2, 3 × 3, шаг 1,
  без дополнения), ReLU, MaxPool 2 × 2, Linear 8 → 2, softmax, кросс-энтропия, 38 параметров. Веса взяты из нормального
  распределения (numpy default_rng(78); σ = 0,5 для ядер и W, 0,2 для смещений) и округлены до десятых — сеть не
  обучена: верно названа одна картинка из двух, потеря 0,6772 против ln 2 = 0,6931. Прямой и обратный проход
  написаны на numpy вручную через im2col; градиенты сверены с центральными разностями при
  <span class="math-inline" data-tex="\varepsilon = 10^{-6}"></span> по всем 38 параметрам — худшее расхождение
  9,5 · 10<sup>−11</sup>; dX через col2im и через свёртку с повёрнутым ядром совпали до
  2,8 · 10<sup>−17</sup>. Кривые обучения — 300 шагов градиентного спуска на том же батче. В матрицах показаны
  округлённые значения, считалось всё в двойной точности.
</p>
