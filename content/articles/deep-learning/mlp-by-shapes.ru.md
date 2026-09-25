



<p class="lead">
  Полносвязная сеть целиком собирается из четырёх операций — умножения на матрицу весов,
  прибавления смещения, поэлементного max(0, ·) и softmax по строке. Если следить за
  формами <code>[B × d]</code> на каждом шаге, и прямой, и обратный проход читаются как одна
  цепочка перемножений, в которой ни одна формула не берётся из воздуха.
</p>

<p>
  Статья построена так же, как разбор трансформера по формам матриц: к каждой части — сцена,
  где тензоры нарисованы блоками без чисел, и сразу за ней вторая сцена — те же шаги в числах.
  Сквозной пример — четыре ириса Фишера и маленькая сеть <strong>4 → 5 → 4 → 3</strong>
  с 64 параметрами. В конце три части про обратный проход: глобальная карта, локальные формулы
  одного слоя и проверка градиента численно.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Умножение матриц</strong>
    <p>Достаточно помнить, что <code>[a × b] · [b × c] = [a × c]</code>, и не бояться слова «производная».</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Четыре ириса и сеть 4 → 5 → 4 → 3</strong>
    <p>B = 4 цветка, 4 признака, два скрытых слоя по 5 и 4 нейрона, 3 класса; веса случайные.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Сеть без чёрных ящиков</strong>
    <p>Вы сможете нарисовать путь от строки признаков до потери и обратно и назвать форму каждой матрицы и каждого градиента.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#73B222"></i>X — входные данные</span>
  <span><i style="background:#7B4AB5"></i>слой 1: W₁, Z₁, A₁</span>
  <span><i style="background:#1B9BC2"></i>слой 2: W₂, Z₂, A₂</span>
  <span><i style="background:#C29E08"></i>слой 3: W₃, логиты Z₃</span>
  <span><i style="background:#E88919"></i>P — вероятности</span>
  <span><i style="background:#C30B0A"></i>градиенты и проблемы</span>
</div>
<p class="tiny">Тёмный блок — обучаемые веса, светлый блок того же цвета — то, что слой пересчитывает на каждом батче. В сценах прямого прохода зелёная стрелка — движение вперёд, красная — обратный проход.</p>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не на всю
  схему сразу, а только на яркую часть. Слева в каждой сцене форм — карта всей сети:
  красная рамка показывает, какой блок разбирается сейчас. Стрелки на клавиатуре работают,
  когда сцена в фокусе.
</div>


## Часть 1. Общая схема: слой за слоем

<p>
  Многослойный перцептрон — самая простая нейросеть, в которой уже есть всё главное: слои,
  веса, нелинейность, функция потерь и обратный проход. Каждый нейрон слоя получает <em>все</em>
  выходы предыдущего слоя — отсюда слово «полносвязная». Между слоями нет ни свёрток, ни
  памяти, ни внимания: только взвешенные суммы и излом ReLU.
</p>
<p>
  Наша сеть решает классическую задачу: по четырём измерениям цветка назвать один из трёх
  сортов ириса. Сначала — привычная картинка с кружками; дальше в статье она превратится в
  цепочку матриц.
</p>
<div class="stage" id="stage-ar" tabindex="0">
  <div class="stage-figure">
<svg id="ar" viewBox="0 0 960 600" role="img" aria-label="Полносвязная сеть 4 → 5 → 4 → 3: нейроны, веса, softmax и потеря">
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
<g data-key="w1"><line x1="200" y1="195" x2="370" y2="160" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="195" x2="370" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="195" x2="370" y2="300" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="195" x2="370" y2="370" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="195" x2="370" y2="440" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="265" x2="370" y2="160" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="265" x2="370" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="265" x2="370" y2="300" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="265" x2="370" y2="370" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="265" x2="370" y2="440" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="335" x2="370" y2="160" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="335" x2="370" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="335" x2="370" y2="300" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="335" x2="370" y2="370" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="335" x2="370" y2="440" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="405" x2="370" y2="160" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="405" x2="370" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="405" x2="370" y2="300" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="405" x2="370" y2="370" stroke="#B9B3A8" stroke-width="1"/><line x1="200" y1="405" x2="370" y2="440" stroke="#B9B3A8" stroke-width="1"/><foreignObject x="195.0" y="480.0" width="180.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_1\ [4 \times 5],\ b_1"></div></foreignObject></g><g data-key="w2"><line x1="410" y1="160" x2="570" y2="195" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="160" x2="570" y2="265" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="160" x2="570" y2="335" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="160" x2="570" y2="405" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="230" x2="570" y2="195" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="230" x2="570" y2="265" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="230" x2="570" y2="335" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="230" x2="570" y2="405" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="300" x2="570" y2="195" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="300" x2="570" y2="265" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="300" x2="570" y2="335" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="300" x2="570" y2="405" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="370" x2="570" y2="195" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="370" x2="570" y2="265" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="370" x2="570" y2="335" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="370" x2="570" y2="405" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="440" x2="570" y2="195" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="440" x2="570" y2="265" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="440" x2="570" y2="335" stroke="#B9B3A8" stroke-width="1"/><line x1="410" y1="440" x2="570" y2="405" stroke="#B9B3A8" stroke-width="1"/><foreignObject x="400.0" y="480.0" width="180.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_2\ [5 \times 4],\ b_2"></div></foreignObject></g><g data-key="w3"><line x1="610" y1="195" x2="750" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="195" x2="750" y2="300" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="195" x2="750" y2="370" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="265" x2="750" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="265" x2="750" y2="300" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="265" x2="750" y2="370" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="335" x2="750" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="335" x2="750" y2="300" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="335" x2="750" y2="370" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="405" x2="750" y2="230" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="405" x2="750" y2="300" stroke="#B9B3A8" stroke-width="1"/><line x1="610" y1="405" x2="750" y2="370" stroke="#B9B3A8" stroke-width="1"/><foreignObject x="590.0" y="480.0" width="180.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_3\ [4 \times 3],\ b_3"></div></foreignObject></g><g data-key="in"><text x="180.0" y="112.0" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="700">вход · 4 признака</text><circle cx="180" cy="195" r="20" fill="#FFFFFF" stroke="#73B222" stroke-width="2.2"/><text x="180.0" y="200.0" font-size="13" fill="#111111" text-anchor="middle">x₁</text><circle cx="180" cy="265" r="20" fill="#FFFFFF" stroke="#73B222" stroke-width="2.2"/><text x="180.0" y="270.0" font-size="13" fill="#111111" text-anchor="middle">x₂</text><circle cx="180" cy="335" r="20" fill="#FFFFFF" stroke="#73B222" stroke-width="2.2"/><text x="180.0" y="340.0" font-size="13" fill="#111111" text-anchor="middle">x₃</text><circle cx="180" cy="405" r="20" fill="#FFFFFF" stroke="#73B222" stroke-width="2.2"/><text x="180.0" y="410.0" font-size="13" fill="#111111" text-anchor="middle">x₄</text><text x="150.0" y="199.0" font-size="13" fill="#5E5850" text-anchor="end">длина чашелистика</text><text x="150.0" y="269.0" font-size="13" fill="#5E5850" text-anchor="end">ширина чашелистика</text><text x="150.0" y="339.0" font-size="13" fill="#5E5850" text-anchor="end">длина лепестка</text><text x="150.0" y="409.0" font-size="13" fill="#5E5850" text-anchor="end">ширина лепестка</text></g><g data-key="h1"><text x="390.0" y="112.0" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="700">скрытый слой 1 · 5</text><circle cx="390" cy="160" r="20" fill="#FFFFFF" stroke="#7B4AB5" stroke-width="2.2"/><text x="390.0" y="165.0" font-size="13" fill="#111111" text-anchor="middle">1</text><circle cx="390" cy="230" r="20" fill="#FFFFFF" stroke="#7B4AB5" stroke-width="2.2"/><text x="390.0" y="235.0" font-size="13" fill="#111111" text-anchor="middle">2</text><circle cx="390" cy="300" r="20" fill="#FFFFFF" stroke="#7B4AB5" stroke-width="2.2"/><text x="390.0" y="305.0" font-size="13" fill="#111111" text-anchor="middle">3</text><circle cx="390" cy="370" r="20" fill="#FFFFFF" stroke="#7B4AB5" stroke-width="2.2"/><text x="390.0" y="375.0" font-size="13" fill="#111111" text-anchor="middle">4</text><circle cx="390" cy="440" r="20" fill="#FFFFFF" stroke="#7B4AB5" stroke-width="2.2"/><text x="390.0" y="445.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="390.0" y="470.0" font-size="12" fill="#7B4AB5" text-anchor="middle" font-weight="700">ReLU</text></g><g data-key="h2"><text x="590.0" y="112.0" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="700">скрытый слой 2 · 4</text><circle cx="590" cy="195" r="20" fill="#FFFFFF" stroke="#1B9BC2" stroke-width="2.2"/><text x="590.0" y="200.0" font-size="13" fill="#111111" text-anchor="middle">1</text><circle cx="590" cy="265" r="20" fill="#FFFFFF" stroke="#1B9BC2" stroke-width="2.2"/><text x="590.0" y="270.0" font-size="13" fill="#111111" text-anchor="middle">2</text><circle cx="590" cy="335" r="20" fill="#FFFFFF" stroke="#1B9BC2" stroke-width="2.2"/><text x="590.0" y="340.0" font-size="13" fill="#111111" text-anchor="middle">3</text><circle cx="590" cy="405" r="20" fill="#FFFFFF" stroke="#1B9BC2" stroke-width="2.2"/><text x="590.0" y="410.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="590.0" y="436.0" font-size="12" fill="#1B9BC2" text-anchor="middle" font-weight="700">ReLU</text></g><g data-key="out"><text x="770.0" y="112.0" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="700">выход · 3 класса</text><circle cx="770" cy="230" r="20" fill="#FFFFFF" stroke="#C29E08" stroke-width="2.2"/><text x="770.0" y="235.0" font-size="13" fill="#111111" text-anchor="middle">z₁</text><circle cx="770" cy="300" r="20" fill="#FFFFFF" stroke="#C29E08" stroke-width="2.2"/><text x="770.0" y="305.0" font-size="13" fill="#111111" text-anchor="middle">z₂</text><circle cx="770" cy="370" r="20" fill="#FFFFFF" stroke="#C29E08" stroke-width="2.2"/><text x="770.0" y="375.0" font-size="13" fill="#111111" text-anchor="middle">z₃</text><text x="770.0" y="400.0" font-size="12" fill="#A5850A" text-anchor="middle" font-weight="700">без ReLU</text></g><g data-key="sm"><rect x="830" y="190" width="116" height="206" rx="10" fill="#FEF4EA" stroke="#E88919" stroke-width="1.6"/><text x="888.0" y="212.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800">softmax</text><path d="M 792.0 230.0 L 828.0 230.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="888.0" y="235.0" font-size="13" fill="#111111" text-anchor="middle">setosa</text><path d="M 792.0 300.0 L 828.0 300.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="888.0" y="305.0" font-size="13" fill="#111111" text-anchor="middle">versicolor</text><path d="M 792.0 370.0 L 828.0 370.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="888.0" y="375.0" font-size="13" fill="#111111" text-anchor="middle">virginica</text><rect x="830" y="430" width="116" height="42" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.6"/><text x="888.0" y="456.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800">потеря L</text><path d="M 888.0 398.0 L 888.0 428.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/></g><g data-key="flow" data-only="1"><path d="M 160.0 540.0 L 930.0 540.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#ar-fw)"/><text x="545.0" y="530.0" font-size="13" fill="#4E9A38" text-anchor="middle">прямой проход: объект входит слева, распределение по классам выходит справа</text></g><text x="20.0" y="588.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">кружок — нейрон · линия — один вес · каждый скрытый нейрон считает max(0, w·x + b) и передаёт число дальше</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="in" data-focus="in">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>Четыре числа об одном цветке</h4>
      <p>Сеть получает объект — ирис — как четыре числа: длину и ширину чашелистика и лепестка. Входной «слой» ничего не вычисляет, это просто место, где лежат признаки.</p>
    </div>
    <div class="step-panel" data-on="in w1 h1" data-focus="w1 h1">
      <div class="step-kicker">Шаг 2 · первый скрытый слой</div>
      <h4>Каждый вход соединён с каждым нейроном</h4>
      <p>Отсюда название «полносвязная»: 4 входа × 5 нейронов = 20 линий, у каждой свой вес. Всё это одна матрица <code>W₁ [4 × 5]</code> и вектор смещений <code>b₁</code> из пяти чисел. После суммы каждый нейрон пропускает результат через ReLU.</p>
    </div>
    <div class="step-panel" data-on="in w1 h1 w2 h2" data-focus="w2 h2">
      <div class="step-kicker">Шаг 3 · второй скрытый слой</div>
      <h4>Тот же приём ещё раз: 5 → 4</h4>
      <p>Второй слой устроен так же, только его входом служат уже не признаки цветка, а пять чисел первого слоя. Матрица <code>W₂ [5 × 4]</code>: строк столько, сколько чисел пришло, столбцов — сколько нейронов в слое.</p>
    </div>
    <div class="step-panel" data-on="in w1 h1 w2 h2 w3 out" data-focus="w3 out">
      <div class="step-kicker">Шаг 4 · выходной слой</div>
      <h4>Три числа — по одному на класс</h4>
      <p>Последний линейный слой <code>W₃ [4 × 3]</code> сжимает всё до трёх чисел — логитов. ReLU здесь нет: логит может быть отрицательным, и это нормально, он ещё не вероятность.</p>
    </div>
    <div class="step-panel" data-on="in w1 h1 w2 h2 w3 out sm" data-focus="sm">
      <div class="step-kicker">Шаг 5 · softmax и потеря</div>
      <h4>Логиты → вероятности → одно число ошибки</h4>
      <p>Softmax превращает три логита в три неотрицательных числа с суммой 1. Потеря смотрит только на вероятность правильного класса и штрафует её логарифмом.</p>
    </div>
    <div class="step-panel" data-on="in w1 h1 w2 h2 w3 out sm flow" data-focus="flow">
      <div class="step-kicker">Шаг 6 · целиком</div>
      <h4>Вся сеть — это 64 числа и четыре операции</h4>
      <p>20 + 5 весов первого слоя, 20 + 4 второго, 12 + 3 третьего — всего 64 параметра. Операций всего четыре: умножение на матрицу, сложение со смещением, ReLU и softmax. Дальше статья разбирает их по одной — в форме матриц, где все объекты батча идут через сеть одновременно.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Сначала — карта всего числового примера: какие слои идут друг за другом, что течёт между ними и какой формы. Дальше в каждой части эта же цепочка разбирается по одному шагу.</p>
<div class="stage" id="stage-arn" tabindex="0">
  <div class="stage-figure">
<svg id="arn" viewBox="0 0 960 500" role="img" aria-label="Карта пайплайна: слои, тензоры между ними и их формы">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Пайплайн с размерностями: где какая матрица</text><g data-key="c0"><rect x="24" y="70" width="64" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="56" y="150" transform="rotate(-90 56 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Вход X</text></g><g data-key="c1"><rect x="140" y="70" width="64" height="150" rx="10" fill="#F4EFFA" stroke="#7B4AB5" stroke-width="1.8"/><text x="172" y="150" transform="rotate(-90 172 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear 1</text><rect x="118" y="234" width="108" height="32" rx="7" fill="#F4EFFA" stroke="#7B4AB5" stroke-width="1.4"/><text x="172.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W₁ [4×5] · b₁</text></g><g data-key="c2"><rect x="256" y="70" width="64" height="150" rx="10" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.8"/><text x="288" y="150" transform="rotate(-90 288 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">ReLU</text><rect x="234" y="234" width="108" height="32" rx="7" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.4"/><text x="288.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c3"><rect x="372" y="70" width="64" height="150" rx="10" fill="#EAF6FA" stroke="#1B9BC2" stroke-width="1.8"/><text x="404" y="150" transform="rotate(-90 404 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear 2</text><rect x="350" y="234" width="108" height="32" rx="7" fill="#EAF6FA" stroke="#1B9BC2" stroke-width="1.4"/><text x="404.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W₂ [5×4] · b₂</text></g><g data-key="c4"><rect x="488" y="70" width="64" height="150" rx="10" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.8"/><text x="520" y="150" transform="rotate(-90 520 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">ReLU</text><rect x="466" y="234" width="108" height="32" rx="7" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.4"/><text x="520.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c5"><rect x="604" y="70" width="64" height="150" rx="10" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.8"/><text x="636" y="150" transform="rotate(-90 636 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear 3</text><rect x="582" y="234" width="108" height="32" rx="7" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.4"/><text x="636.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W₃ [4×3] · b₃</text></g><g data-key="c6"><rect x="720" y="70" width="64" height="150" rx="10" fill="#FEF4EA" stroke="#E88919" stroke-width="1.8"/><text x="752" y="150" transform="rotate(-90 752 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Softmax</text><rect x="698" y="234" width="108" height="32" rx="7" fill="#FEF4EA" stroke="#E88919" stroke-width="1.4"/><text x="752.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c7"><rect x="836" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="868" y="150" transform="rotate(-90 868 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Cross-Entropy</text></g><path d="M 91.0 145.0 L 137.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="114.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">X</text><text x="114.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 4]</text><path d="M 207.0 145.0 L 253.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="230.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z₁</text><text x="230.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 5]</text><path d="M 323.0 145.0 L 369.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="346.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">A₁</text><text x="346.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 5]</text><path d="M 439.0 145.0 L 485.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="462.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z₂</text><text x="462.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 4]</text><path d="M 555.0 145.0 L 601.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="578.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">A₂</text><text x="578.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 4]</text><path d="M 671.0 145.0 L 717.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="694.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z₃</text><text x="694.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 3]</text><path d="M 787.0 145.0 L 833.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="810.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">P</text><text x="810.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 3]</text><path d="M 903.0 145.0 L 948.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="925.5" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">L</text><text x="925.5" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[1]</text><g data-key="yy"><path d="M 868.0 300.0 L 868.0 224.0" fill="none" stroke="#5E5850" stroke-width="1.6" marker-end="url(#arn-arw)"/><text x="868.0" y="318.0" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="700">Y [4 × 3]</text><text x="868.0" y="334.0" font-size="12" fill="#5E5850" text-anchor="middle">one-hot</text></g><g data-key="par"><text x="150.0" y="376.0" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">где живут 64 параметра</text><rect x="150" y="390" width="250" height="36" rx="3" fill="#7B4AB5" opacity="0.85"/><text x="275.0" y="413.0" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="800">W₁ 20 + b₁ 5 = 25</text><rect x="400" y="390" width="240" height="36" rx="3" fill="#1B9BC2" opacity="0.85"/><text x="520.0" y="413.0" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="800">W₂ 20 + b₂ 4 = 24</text><rect x="640" y="390" width="150" height="36" rx="3" fill="#C29E08" opacity="0.85"/><text x="715.0" y="413.0" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="800">W₃ 12 + b₃ 3 = 15</text><text x="800.0" y="413.0" font-size="15" fill="#111111" text-anchor="start" font-weight="800">= 64</text><text x="150.0" y="452.0" font-size="13" fill="#5E5850" text-anchor="start">ReLU, softmax и потеря не имеют ни одного параметра — они только пересчитывают числа</text></g>
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
      <div class="step-kicker">Шаг 1 · первый слой</div>
      <h4>Четыре признака превращаются в пять чисел</h4>
      <p>Батч из четырёх цветков — матрица <code>X [4 × 4]</code>. Первый линейный слой умножает её на <code>W₁ [4 × 5]</code> и добавляет <code>b₁</code>: получается <code>Z₁ [4 × 5]</code>. Число строк — число объектов — не меняется нигде в сети.</p>
    </div>
    <div class="step-panel" data-on="c1 c2" data-focus="c2">
      <div class="step-kicker">Шаг 2 · нелинейность</div>
      <h4>ReLU не меняет форму</h4>
      <p>ReLU работает с каждым числом по отдельности, поэтому <code>A₁</code> той же формы <code>[4 × 5]</code>, что и <code>Z₁</code>. Весов у неё нет.</p>
    </div>
    <div class="step-panel" data-on="c2 c3 c4" data-focus="c3">
      <div class="step-kicker">Шаг 3 · второй слой</div>
      <h4>Ширина идёт 4 → 5 → 4</h4>
      <p><code>[4 × 5] · [5 × 4] = [4 × 4]</code>. Меняется только второе измерение — ширина представления, которую выбирает архитектор сети.</p>
    </div>
    <div class="step-panel" data-on="c4 c5 c6" data-focus="c5 c6">
      <div class="step-kicker">Шаг 4 · выход</div>
      <h4>Логиты [4 × 3] и вероятности [4 × 3]</h4>
      <p>Третий слой выдаёт по три логита на объект, softmax переводит каждую строку в распределение по трём сортам ириса.</p>
    </div>
    <div class="step-panel" data-on="c6 c7 yy" data-focus="c7 yy">
      <div class="step-kicker">Шаг 5 · потеря</div>
      <h4>Вся матрица сворачивается в одно число</h4>
      <p>Потеря сравнивает <code>P</code> с правильными ответами <code>Y</code> и выдаёт скаляр. На нашем батче L = 1.0133 — почти ln 3 = 1.0986, как у сети, которая ничего не знает.</p>
    </div>
    <div class="step-panel" data-on="c1 c3 c5 par" data-focus="par">
      <div class="step-kicker">Шаг 6 · параметры</div>
      <h4>Все 64 числа живут в трёх линейных слоях</h4>
      <p>Первый слой — 25 параметров, второй — 24, третий — 15. Именно эти 64 числа будет двигать обратный проход; всё остальное в сети пересчитывается заново на каждом батче.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<p class="tiny">Числовая модель одна на всю статью: сеть 4 → 5 → 4 → 3 с ReLU после двух скрытых слоёв, 64 параметра, батч из четырёх ирисов Фишера (объекты 0, 55, 110 и 70, признаки стандартизованы по всем 150 цветкам и округлены до двух знаков). Веса взяты из нормального распределения с масштабом √(2/n<sub>in</sub>), округлены до десятых и не обучены. Все числа посчитаны numpy и округлены при выводе.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> полносвязная сеть — это чередование линейных слоев и поэлементной нелинейности; число строк <code>B</code> не меняется от входа до выхода, меняется только ширина — 4 → 5 → 4 → 3.
</div>

---


## Часть 2. Вход: объекты строками

<p>
  Прежде чем что-то умножать, надо договориться о форме данных. Во всей статье принято
  соглашение numpy и PyTorch: <strong>объект — строка</strong>, признак — столбец. Батч из B
  объектов с d признаками — матрица:
</p>
<div class="math-display" data-tex="X \in \mathbb{R}^{B \times d_{in}}, \qquad B = 4,\ d_{in} = 4"></div>

<p>
  Признаки ирисов имеют разный масштаб: длина лепестка разбросана на 1,76 см, ширина
  чашелистика — на 0,43 см. Поэтому каждый столбец стандартизуют: вычитают среднее и делят
  на стандартное отклонение, посчитанные по обучающему набору.
</p>
<div class="callout-blue">
  <strong>Почему строка, а не столбец?</strong> В учебниках нейрон часто пишут как
  <span class="math-inline" data-tex="Wx + b"></span> со столбцом x. Тогда батч приходится
  собирать из столбцов и транспонировать на каждом шаге. Со строками формула слоя
  <span class="math-inline" data-tex="XW + b"></span> одинакова для одного объекта и для тысячи.
</div>
<div class="stage" id="stage-in" tabindex="0">
  <div class="stage-figure">
<svg id="in" viewBox="0 0 960 620" role="img" aria-label="Один цветок — строка из четырёх чисел; батч — матрица X после стандартизации">
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
<g transform="translate(10,60)"><rect x="30" y="348" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="30" y="236" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="398.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 398)">слой 1</text><text x="20.0" y="286.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 286)">слой 2</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 356 L 125 328" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 292 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#in-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 1</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#C30B0A" text-anchor="middle">Вход X</text><rect x="34" y="456" width="182" height="44" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="row"><g><rect x="330.0" y="100.0" width="120.0" height="30.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="360.0" y1="100.0" x2="360.0" y2="130.0" class="grid" opacity=".75"/><line x1="390.0" y1="100.0" x2="390.0" y2="130.0" class="grid" opacity=".75"/><line x1="420.0" y1="100.0" x2="420.0" y2="130.0" class="grid" opacity=".75"/></g><text x="390.0" y="92.0" font-size="13" fill="#111111" text-anchor="middle">4 признака</text><foreignObject x="335.0" y="134.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="x"></div></foreignObject><foreignObject x="470.0" y="97.0" width="330.0" height="36.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="x = (x_1,\ x_2,\ x_3,\ x_4)"></div></foreignObject><text x="470.0" y="160.0" font-size="13" fill="#5E5850" text-anchor="start">один цветок — одна строка</text></g><g data-key="stack"><g><rect x="330.0" y="220.0" width="104.0" height="104.0" rx="2" fill="#73B222" opacity="0.35" stroke="#ffffff" stroke-width="1"/><line x1="356.0" y1="220.0" x2="356.0" y2="324.0" class="grid" opacity=".75"/><line x1="382.0" y1="220.0" x2="382.0" y2="324.0" class="grid" opacity=".75"/><line x1="408.0" y1="220.0" x2="408.0" y2="324.0" class="grid" opacity=".75"/><line x1="330.0" y1="246.0" x2="434.0" y2="246.0" class="grid" opacity=".75"/><line x1="330.0" y1="272.0" x2="434.0" y2="272.0" class="grid" opacity=".75"/><line x1="330.0" y1="298.0" x2="434.0" y2="298.0" class="grid" opacity=".75"/></g><text x="382.0" y="212.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="327.0" y="328.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X_{raw}"></div></foreignObject><text x="322.0" y="238.0" font-size="12" fill="#5E5850" text-anchor="end">setosa</text><text x="322.0" y="264.0" font-size="12" fill="#5E5850" text-anchor="end">versicolor</text><text x="322.0" y="290.0" font-size="12" fill="#5E5850" text-anchor="end">virginica</text><text x="322.0" y="316.0" font-size="12" fill="#5E5850" text-anchor="end">versicolor</text></g><g data-key="mu"><text x="452.0" y="280.0" font-size="22" fill="#111111" text-anchor="middle">−</text><g><rect x="470.0" y="246.0" width="104.0" height="26.0" rx="2" fill="#5E5850" opacity="0.16" stroke="#5E5850" stroke-width="1" stroke-dasharray="4 3"/><rect x="470.0" y="272.0" width="104.0" height="26.0" rx="2" fill="#5E5850" opacity="0.16" stroke="#5E5850" stroke-width="1" stroke-dasharray="4 3"/><rect x="470.0" y="298.0" width="104.0" height="26.0" rx="2" fill="#5E5850" opacity="0.16" stroke="#5E5850" stroke-width="1" stroke-dasharray="4 3"/></g><g><rect x="470.0" y="220.0" width="104.0" height="26.0" rx="2" fill="#5E5850" opacity="0.5" stroke="#ffffff" stroke-width="1"/><line x1="496.0" y1="220.0" x2="496.0" y2="246.0" class="grid" opacity=".75"/><line x1="522.0" y1="220.0" x2="522.0" y2="246.0" class="grid" opacity=".75"/><line x1="548.0" y1="220.0" x2="548.0" y2="246.0" class="grid" opacity=".75"/></g><text x="522.0" y="212.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="467.0" y="328.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\mu"></div></foreignObject><text x="596.0" y="280.0" font-size="22" fill="#111111" text-anchor="middle">÷</text><g><rect x="618.0" y="246.0" width="104.0" height="26.0" rx="2" fill="#5E5850" opacity="0.16" stroke="#5E5850" stroke-width="1" stroke-dasharray="4 3"/><rect x="618.0" y="272.0" width="104.0" height="26.0" rx="2" fill="#5E5850" opacity="0.16" stroke="#5E5850" stroke-width="1" stroke-dasharray="4 3"/><rect x="618.0" y="298.0" width="104.0" height="26.0" rx="2" fill="#5E5850" opacity="0.16" stroke="#5E5850" stroke-width="1" stroke-dasharray="4 3"/></g><g><rect x="618.0" y="220.0" width="104.0" height="26.0" rx="2" fill="#5E5850" opacity="0.5" stroke="#ffffff" stroke-width="1"/><line x1="644.0" y1="220.0" x2="644.0" y2="246.0" class="grid" opacity=".75"/><line x1="670.0" y1="220.0" x2="670.0" y2="246.0" class="grid" opacity=".75"/><line x1="696.0" y1="220.0" x2="696.0" y2="246.0" class="grid" opacity=".75"/></g><text x="670.0" y="212.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="615.0" y="328.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\sigma"></div></foreignObject><text x="470.0" y="384.0" font-size="13" fill="#5E5850" text-anchor="start">μ и σ посчитаны по каждому столбцу на всех 150 цветках</text><text x="470.0" y="402.0" font-size="13" fill="#5E5850" text-anchor="start">и растянуты на все 4 строки батча</text></g><g data-key="x"><text x="744.0" y="280.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="766.0" y="220.0" width="104.0" height="104.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="792.0" y1="220.0" x2="792.0" y2="324.0" class="grid" opacity=".75"/><line x1="818.0" y1="220.0" x2="818.0" y2="324.0" class="grid" opacity=".75"/><line x1="844.0" y1="220.0" x2="844.0" y2="324.0" class="grid" opacity=".75"/><line x1="766.0" y1="246.0" x2="870.0" y2="246.0" class="grid" opacity=".75"/><line x1="766.0" y1="272.0" x2="870.0" y2="272.0" class="grid" opacity=".75"/><line x1="766.0" y1="298.0" x2="870.0" y2="298.0" class="grid" opacity=".75"/></g><text x="818.0" y="212.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="763.0" y="328.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject></g><g data-key="shapes" data-only="1"><foreignObject x="290.0" y="440.0" width="650.0" height="54.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="x_{ij} = \dfrac{x^{raw}_{ij} - \mu_j}{\sigma_j}"></div></foreignObject><foreignObject x="290.0" y="500.0" width="650.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="X:\ [B \times d_{in}] = [4 \times 4] \quad \text{строка — объект, столбец — признак}"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl row" data-focus="hl row">
      <div class="step-kicker">Шаг 1 · объект</div>
      <h4>Цветок — это строка</h4>
      <p>Один ирис описывается четырьмя числами. Удобно сразу думать о нём как о строке — матрице <code>[1 × 4]</code>, а не как о столбце: тогда весь батч сложится в одну таблицу без транспонирований.</p>
    </div>
    <div class="step-panel" data-on="hl row stack" data-focus="stack">
      <div class="step-kicker">Шаг 2 · батч</div>
      <h4>Четыре цветка — четыре строки</h4>
      <p>Сеть обрабатывает сразу B объектов, уложенных друг под другом. Здесь B = 4: по одному ирису из каждого сорта и ещё один versicolor. Номер строки — номер объекта, номер столбца — номер признака.</p>
    </div>
    <div class="step-panel" data-on="hl stack mu" data-focus="mu">
      <div class="step-kicker">Шаг 3 · масштаб</div>
      <h4>Из каждого столбца вычитаем среднее и делим на разброс</h4>
      <p>Длина лепестка меняется от 1 до 7 см, ширина — от 0,1 до 2,5. Без выравнивания признак с большим разбросом доминировал бы в первой же сумме. Строки μ и σ растягиваются на все строки батча — это <em>broadcasting</em>, мы ещё встретим его у смещений.</p>
    </div>
    <div class="step-panel" data-on="hl stack mu x" data-focus="x">
      <div class="step-kicker">Шаг 4 · результат</div>
      <h4>X — вход сети</h4>
      <p>После стандартизации каждый признак в среднем по набору равен 0, а разброс — 1. Форма не изменилась: <code>[4 × 4]</code>.</p>
    </div>
    <div class="step-panel" data-on="hl x shapes" data-focus="shapes">
      <div class="step-kicker">Шаг 5 · формы</div>
      <h4>Форма [B × d] пройдёт через всю сеть</h4>
      <p>Первое измерение — B — не изменится до самого конца: у каждого объекта своя строка на любом слое. Меняться будет только второе измерение, ширина.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Сырые значения — сантиметры из набора Фишера; стандартизованная X дальше используется как точный вход сети.</p>
<div class="stage" id="stage-inn" tabindex="0">
  <div class="stage-figure">
<svg id="inn" viewBox="0 0 960 500" role="img" aria-label="Числовой расчёт стандартизованной матрицы X">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: четыре ириса до и после стандартизации</text><g data-key="raw"><g><rect x="96.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="113.0" y1="70.0" x2="113.0" y2="138.0" class="grid" opacity=".75"/><line x1="130.0" y1="70.0" x2="130.0" y2="138.0" class="grid" opacity=".75"/><line x1="147.0" y1="70.0" x2="147.0" y2="138.0" class="grid" opacity=".75"/><line x1="96.0" y1="87.0" x2="164.0" y2="87.0" class="grid" opacity=".75"/><line x1="96.0" y1="104.0" x2="164.0" y2="104.0" class="grid" opacity=".75"/><line x1="96.0" y1="121.0" x2="164.0" y2="121.0" class="grid" opacity=".75"/></g><text x="130.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="86.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="40.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X_{raw}"></div></foreignObject><foreignObject x="35.0" y="168.0" width="190.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}5.1 &amp; 3.5 &amp; 1.4 &amp; 0.2 \\ 5.7 &amp; 2.8 &amp; 4.5 &amp; 1.3 \\ 6.5 &amp; 3.2 &amp; 5.1 &amp; 2.0 \\ 5.9 &amp; 3.2 &amp; 4.8 &amp; 1.8\end{bmatrix}"></div></foreignObject></g><text x="262.0" y="110.0" font-size="22" fill="#111111" text-anchor="middle">−</text><g data-key="mu"><g><rect x="386.0" y="70.0" width="68.0" height="17.0" rx="2" fill="#5E5850" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="403.0" y1="70.0" x2="403.0" y2="87.0" class="grid" opacity=".75"/><line x1="420.0" y1="70.0" x2="420.0" y2="87.0" class="grid" opacity=".75"/><line x1="437.0" y1="70.0" x2="437.0" y2="87.0" class="grid" opacity=".75"/></g><text x="420.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="376.0" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="330.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\mu"></div></foreignObject><foreignObject x="305.0" y="117.0" width="230.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}5.84 &amp; 3.06 &amp; 3.76 &amp; 1.20\end{bmatrix}"></div></foreignObject></g><text x="566.0" y="110.0" font-size="22" fill="#111111" text-anchor="middle">÷</text><g data-key="sd"><g><rect x="676.0" y="70.0" width="68.0" height="17.0" rx="2" fill="#5E5850" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="693.0" y1="70.0" x2="693.0" y2="87.0" class="grid" opacity=".75"/><line x1="710.0" y1="70.0" x2="710.0" y2="87.0" class="grid" opacity=".75"/><line x1="727.0" y1="70.0" x2="727.0" y2="87.0" class="grid" opacity=".75"/></g><text x="710.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="666.0" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="620.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\sigma"></div></foreignObject><foreignObject x="595.0" y="117.0" width="230.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.83 &amp; 0.43 &amp; 1.76 &amp; 0.76\end{bmatrix}"></div></foreignObject></g><text x="300.0" y="340.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g data-key="x"><g><rect x="386.0" y="290.0" width="68.0" height="68.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="403.0" y1="290.0" x2="403.0" y2="358.0" class="grid" opacity=".75"/><line x1="420.0" y1="290.0" x2="420.0" y2="358.0" class="grid" opacity=".75"/><line x1="437.0" y1="290.0" x2="437.0" y2="358.0" class="grid" opacity=".75"/><line x1="386.0" y1="307.0" x2="454.0" y2="307.0" class="grid" opacity=".75"/><line x1="386.0" y1="324.0" x2="454.0" y2="324.0" class="grid" opacity=".75"/><line x1="386.0" y1="341.0" x2="454.0" y2="341.0" class="grid" opacity=".75"/></g><text x="420.0" y="282.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="376.0" y="328.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="330.0" y="361.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject><foreignObject x="300.0" y="388.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.90 &amp; 1.02 &amp; -1.34 &amp; -1.32 \\ -0.17 &amp; -0.59 &amp; 0.42 &amp; 0.13 \\ 0.80 &amp; 0.33 &amp; 0.76 &amp; 1.05 \\ 0.07 &amp; 0.33 &amp; 0.59 &amp; 0.79\end{bmatrix}"></div></foreignObject></g><g data-key="cell" data-only="1"><rect x="385.5" y="290.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="560.0" y="300.0" width="380.0" height="56.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="x_{11} = \dfrac{5.10 - 5.84}{0.83} = -0.90"></div></foreignObject><text x="750.0" y="388.0" font-size="13" fill="#5E5850" text-anchor="middle">длина чашелистика у setosa на 0,9 σ меньше средней</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="raw" data-focus="raw">
      <div class="step-kicker">Шаг 1 · сырые данные</div>
      <h4>Сантиметры из таблицы Фишера</h4>
      <p>Строки — setosa, versicolor, virginica и ещё один versicolor (номера 0, 55, 110 и 70 в наборе). Столбцы — длина и ширина чашелистика, длина и ширина лепестка.</p>
    </div>
    <div class="step-panel" data-on="raw mu sd" data-focus="mu sd">
      <div class="step-kicker">Шаг 2 · статистики</div>
      <h4>μ и σ — по всем 150 цветкам</h4>
      <p>Средние 5.84, 3.06, 3.76, 1.20 и разбросы 0.83, 0.43, 1.76, 0.76. Их считают один раз на обучающем наборе и потом применяют к любому объекту — и в обучении, и в предсказании.</p>
    </div>
    <div class="step-panel" data-on="raw mu sd x cell" data-focus="x cell">
      <div class="step-kicker">Шаг 3 · одна клетка</div>
      <h4>x₁₁ = (5.10 − 5.84) / 0.83 = −0.90</h4>
      <p>Каждая клетка пересчитывается независимо, по своему столбцу. Результат округлён до двух знаков, и дальше в статье именно эта X считается точным входом.</p>
    </div>
    <div class="step-panel" data-on="x" data-focus="x">
      <div class="step-kicker">Шаг 4 · вход готов</div>
      <h4>У setosa лепесток на 1,3 σ короче среднего</h4>
      <p>Строка setosa в последних двух столбцах даёт −1.34 и −1.32, у virginica — 0.76 и 1.05. Разница между сортами уже видна глазами; научить сеть видеть её — задача весов.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> вход сети — матрица <code>[B × d]</code>, где каждая строка — отдельный объект; все дальнейшие слои работают со строками независимо и параллельно.
</div>

---


## Часть 3. Один нейрон

<p>
  Нейрон делает две вещи. Сначала взвешенно складывает входы и прибавляет смещение —
  получается пред-активация z. Потом пропускает её через функцию активации. В записи
  строками взвешенная сумма — это скалярное произведение строки признаков на столбец весов:
</p>
<div class="math-display" data-tex="z = x\,w + b = \sum_{i=1}^{4} x_i\, w_i + b, \qquad a = \max(0,\ z)"></div>

<p>
  Посмотрим пошагово, как привычный рисунок нейрона превращается в произведение
  <code>[1 × 4] · [4 × 1]</code> и откуда берётся матрица весов слоя.
</p>
<div class="stage" id="stage-ne" tabindex="0">
  <div class="stage-figure">
<svg id="ne" viewBox="0 0 960 620" role="img" aria-label="Нейрон: скалярное произведение строки на столбец весов, смещение и ReLU">
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
<g transform="translate(10,60)"><rect x="30" y="348" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="30" y="236" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="398.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 398)">слой 1</text><text x="20.0" y="286.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 286)">слой 2</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 356 L 125 328" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 292 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ne-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 1</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear 1</text><rect x="34" y="398" width="182" height="48" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="nr"><line x1="330" y1="100" x2="488" y2="168" stroke="#7B4AB5" stroke-width="1.6"/><circle cx="324" cy="100" r="7" fill="#73B222" opacity="0.8"/><text x="310.0" y="105.0" font-size="13" fill="#111111" text-anchor="end">x₁</text><text x="401.1" y="124.6" font-size="12" fill="#7B4AB5" text-anchor="middle" font-weight="700">w₁</text><line x1="330" y1="145" x2="488" y2="168" stroke="#7B4AB5" stroke-width="1.6"/><circle cx="324" cy="145" r="7" fill="#73B222" opacity="0.8"/><text x="310.0" y="150.0" font-size="13" fill="#111111" text-anchor="end">x₂</text><text x="401.1" y="149.3" font-size="12" fill="#7B4AB5" text-anchor="middle" font-weight="700">w₂</text><line x1="330" y1="190" x2="488" y2="168" stroke="#7B4AB5" stroke-width="1.6"/><circle cx="324" cy="190" r="7" fill="#73B222" opacity="0.8"/><text x="310.0" y="195.0" font-size="13" fill="#111111" text-anchor="end">x₃</text><text x="401.1" y="174.1" font-size="12" fill="#7B4AB5" text-anchor="middle" font-weight="700">w₃</text><line x1="330" y1="235" x2="488" y2="168" stroke="#7B4AB5" stroke-width="1.6"/><circle cx="324" cy="235" r="7" fill="#73B222" opacity="0.8"/><text x="310.0" y="240.0" font-size="13" fill="#111111" text-anchor="end">x₄</text><text x="401.1" y="198.8" font-size="12" fill="#7B4AB5" text-anchor="middle" font-weight="700">w₄</text><circle cx="520" cy="168" r="32" fill="#FFFFFF" stroke="#7B4AB5" stroke-width="2.2"/><text x="520.0" y="176.0" font-size="22" fill="#111111" text-anchor="middle">Σ</text><path d="M 520.0 236.0 L 520.0 202.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ne-arw)"/><text x="520.0" y="254.0" font-size="13" fill="#7B4AB5" text-anchor="middle" font-weight="700">+ b</text><path d="M 552.0 168.0 L 626.0 168.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ne-arw)"/><text x="588.0" y="158.0" font-size="14" fill="#111111" text-anchor="middle" font-style="italic">z</text></g><g data-key="dot"><g><rect x="300.0" y="375.0" width="120.0" height="30.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="330.0" y1="375.0" x2="330.0" y2="405.0" class="grid" opacity=".75"/><line x1="360.0" y1="375.0" x2="360.0" y2="405.0" class="grid" opacity=".75"/><line x1="390.0" y1="375.0" x2="390.0" y2="405.0" class="grid" opacity=".75"/></g><text x="360.0" y="367.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="305.0" y="409.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="x"></div></foreignObject><text x="438.0" y="398.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="456.0" y="330.0" width="30.0" height="120.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="456.0" y1="360.0" x2="486.0" y2="360.0" class="grid" opacity=".75"/><line x1="456.0" y1="390.0" x2="486.0" y2="390.0" class="grid" opacity=".75"/><line x1="456.0" y1="420.0" x2="486.0" y2="420.0" class="grid" opacity=".75"/></g><text x="471.0" y="322.0" font-size="13" fill="#111111" text-anchor="middle">1</text><foreignObject x="416.0" y="454.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="w"></div></foreignObject></g><g data-key="bz"><text x="506.0" y="398.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="522.0" y="375.0" width="30.0" height="30.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="482.0" y="409.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b"></div></foreignObject><text x="574.0" y="398.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="592.0" y="375.0" width="30.0" height="30.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="552.0" y="409.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z"></div></foreignObject></g><g data-key="relu"><line x1="690" y1="232" x2="930" y2="232" stroke="#8A857C" stroke-width="1.2"/><line x1="810" y1="80" x2="810" y2="244" stroke="#8A857C" stroke-width="1.2"/><path d="M 696 232 L 810 232 L 920 104" fill="none" stroke="#7B4AB5" stroke-width="3"/><text x="924.0" y="250.0" font-size="13" fill="#5E5850" text-anchor="end" font-style="italic">z</text><text x="820.0" y="90.0" font-size="13" fill="#5E5850" text-anchor="start" font-style="italic">a</text><text x="700.0" y="110.0" font-size="13" fill="#111111" text-anchor="start">a = max(0, z)</text><path d="M 626.0 390.0 L 690.0 390.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ne-arw)"/><text x="658.0" y="380.0" font-size="12" fill="#5E5850" text-anchor="middle">ReLU</text><g><rect x="694.0" y="375.0" width="30.0" height="30.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="654.0" y="409.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="a"></div></foreignObject></g><g data-key="col"><g><rect x="790.0" y="330.0" width="130.0" height="104.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="816.0" y1="330.0" x2="816.0" y2="434.0" class="grid" opacity=".75"/><line x1="842.0" y1="330.0" x2="842.0" y2="434.0" class="grid" opacity=".75"/><line x1="868.0" y1="330.0" x2="868.0" y2="434.0" class="grid" opacity=".75"/><line x1="894.0" y1="330.0" x2="894.0" y2="434.0" class="grid" opacity=".75"/><line x1="790.0" y1="356.0" x2="920.0" y2="356.0" class="grid" opacity=".75"/><line x1="790.0" y1="382.0" x2="920.0" y2="382.0" class="grid" opacity=".75"/><line x1="790.0" y1="408.0" x2="920.0" y2="408.0" class="grid" opacity=".75"/></g><rect x="790.0" y="330.0" width="26.0" height="104.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="855.0" y="322.0" font-size="13" fill="#111111" text-anchor="middle">5 нейронов</text><foreignObject x="800.0" y="438.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_1"></div></foreignObject><text x="855.0" y="488.0" font-size="13" fill="#5E5850" text-anchor="middle">столбец j — веса нейрона j</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="520.0" width="650.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z = x\,w + b = \sum_{i=1}^{4} x_i w_i + b, \qquad a = \max(0,\ z)"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl nr" data-focus="hl nr">
      <div class="step-kicker">Шаг 1 · картинка</div>
      <h4>Нейрон: четыре входа — одно число</h4>
      <p>Классический рисунок нейрона: входы приходят по рёбрам, у каждого ребра свой вес, в кружке всё складывается. Это ровно одна операция — скалярное произведение.</p>
    </div>
    <div class="step-panel" data-on="hl nr dot f" data-focus="dot f">
      <div class="step-kicker">Шаг 2 · в матрицах</div>
      <h4>Строка на столбец</h4>
      <p>Строка признаков <code>[1 × 4]</code> умножается на столбец весов <code>[4 × 1]</code> — получается <code>[1 × 1]</code>, одно число. Четыре произведения и одна сумма.</p>
    </div>
    <div class="step-panel" data-on="hl nr dot bz f" data-focus="bz">
      <div class="step-kicker">Шаг 3 · смещение</div>
      <h4>b сдвигает порог срабатывания</h4>
      <p>Без смещения нейрон при нулевом входе всегда выдавал бы ноль. С ним он сам решает, с какого уровня суммы начинать «отвечать». Сумма вместе со смещением называется <em>пред-активацией</em> z.</p>
    </div>
    <div class="step-panel" data-on="hl dot bz relu f" data-focus="relu">
      <div class="step-kicker">Шаг 4 · активация</div>
      <h4>ReLU обнуляет всё отрицательное</h4>
      <p>Положительное z проходит без изменений, отрицательное превращается в 0. Нейрон либо «говорит», либо молчит — и именно этот излом делает сеть из нескольких слоёв сильнее одного слоя.</p>
    </div>
    <div class="step-panel" data-on="hl dot bz col" data-focus="col">
      <div class="step-kicker">Шаг 5 · слой</div>
      <h4>Пять нейронов — пять столбцов одной матрицы</h4>
      <p>Если поставить столбцы весов пяти нейронов рядом, получится <code>W₁ [4 × 5]</code>. Нейрон — это столбец матрицы весов; слой — вся матрица.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Первый цветок батча — setosa — и два нейрона первого слоя. Веса заданы с одним знаком после запятой, чтобы каждое произведение проверялось в уме.</p>
<div class="stage" id="stage-nen" tabindex="0">
  <div class="stage-figure">
<svg id="nen" viewBox="0 0 960 520" role="img" aria-label="Числовой расчёт одного нейрона на одном цветке">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: первый нейрон на первом цветке (setosa)</text><g data-key="x"><g><rect x="126.0" y="70.0" width="68.0" height="17.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="143.0" y1="70.0" x2="143.0" y2="87.0" class="grid" opacity=".75"/><line x1="160.0" y1="70.0" x2="160.0" y2="87.0" class="grid" opacity=".75"/><line x1="177.0" y1="70.0" x2="177.0" y2="87.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="116.0" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="70.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="x"></div></foreignObject><foreignObject x="40.0" y="117.0" width="240.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.90 &amp; 1.02 &amp; -1.34 &amp; -1.32\end{bmatrix}"></div></foreignObject></g><text x="318.0" y="86.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g data-key="w"><g><rect x="391.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="391.5" y1="87.0" x2="408.5" y2="87.0" class="grid" opacity=".75"/><line x1="391.5" y1="104.0" x2="408.5" y2="104.0" class="grid" opacity=".75"/><line x1="391.5" y1="121.0" x2="408.5" y2="121.0" class="grid" opacity=".75"/></g><text x="400.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="381.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="310.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="w_{\cdot 1}"></div></foreignObject><foreignObject x="355.0" y="168.0" width="90.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.4 \\ -0.3 \\ -0.4 \\ -1.2\end{bmatrix}"></div></foreignObject></g><g data-key="b"><text x="468.0" y="86.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="521.5" y="70.0" width="17.0" height="17.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/></g><text x="530.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="511.5" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="440.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b_1"></div></foreignObject><foreignObject x="485.0" y="117.0" width="90.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.3\end{bmatrix}"></div></foreignObject></g><g data-key="z"><text x="598.0" y="86.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="671.5" y="70.0" width="17.0" height="17.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/></g><text x="680.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="661.5" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="590.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z_{11}"></div></foreignObject><foreignObject x="630.0" y="117.0" width="100.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.874\end{bmatrix}"></div></foreignObject></g><g data-key="prod"><foreignObject x="20.0" y="280.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z = (-0.90)(-0.4) + 1.02\cdot(-0.3) + (-1.34)(-0.4) + (-1.32)(-1.2) + (-0.3)"></div></foreignObject><foreignObject x="20.0" y="322.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="= 0.360 - 0.306 + 0.536 + 1.584 - 0.3 = 1.874"></div></foreignObject></g><g data-key="a" data-only="1"><foreignObject x="20.0" y="372.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="a = \max(0,\ 1.874) = 1.874"></div></foreignObject><text x="480.0" y="425.0" font-size="13" fill="#5F9420" text-anchor="middle">сумма положительна — нейрон пропускает её без изменений</text></g><g data-key="n2" data-only="1"><foreignObject x="20.0" y="440.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\text{нейрон 2: } w_{\cdot 2} = (0,\ -1.1,\ -0.9,\ 0),\ b = -0.3:\quad z = -1.122 + 1.206 - 0.3 = -0.216 \ \Rightarrow\ a = 0"></div></foreignObject><text x="480.0" y="500.0" font-size="13" fill="#C30B0A" text-anchor="middle">+1.206 и −1.122 почти погасили друг друга, смещение −0.3 увело сумму ниже нуля — нейрон молчит</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="x w" data-focus="x w">
      <div class="step-kicker">Шаг 1 · вход и веса</div>
      <h4>Строка цветка и столбец весов</h4>
      <p>Строка — первый объект X. Столбец — первый столбец <code>W₁</code>: веса первого нейрона. Все веса заданы с одним знаком после запятой, чтобы произведения можно было проверить в уме.</p>
    </div>
    <div class="step-panel" data-on="x w prod" data-focus="prod">
      <div class="step-kicker">Шаг 2 · четыре произведения</div>
      <h4>Самый большой вклад — ширина лепестка</h4>
      <p>1.584 из общей суммы даёт последний признак: у setosa он сильно отрицателен, и отрицательный вес превращает его в большой плюс. Отрицательный вес — это «чем меньше признак, тем сильнее реагирую».</p>
    </div>
    <div class="step-panel" data-on="x w b z prod" data-focus="b z">
      <div class="step-kicker">Шаг 3 · смещение</div>
      <h4>z₁₁ = 2.174 − 0.3 = 1.874</h4>
      <p>Смещение −0.3 немного опустило сумму. Это число стоит в левом верхнем углу матрицы <code>Z₁</code> следующей части.</p>
    </div>
    <div class="step-panel" data-on="z a" data-focus="a">
      <div class="step-kicker">Шаг 4 · ReLU</div>
      <h4>Положительное проходит как есть</h4>
      <p>a = 1.874. На этом объекте первый нейрон «включён».</p>
    </div>
    <div class="step-panel" data-on="n2" data-focus="n2">
      <div class="step-kicker">Шаг 5 · соседний нейрон</div>
      <h4>Второй нейрон даёт −0.216 и выключается</h4>
      <p>Тот же цветок, другой столбец весов — и сумма уже отрицательна. Запомните этот нейрон: в следующих частях окажется, что он молчит на всех четырёх цветках, и это видно в градиентах.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> нейрон — это столбец матрицы весов плюс одно смещение; его работа — скалярное произведение и излом ReLU.
</div>

---


## Часть 4. Линейный слой: Z = XW + b

<p>
  Слой — это несколько нейронов, которые смотрят на один и тот же вход. Ставим их столбцы
  весов рядом — получаем матрицу; ставим объекты друг под другом — получаем X. Весь слой
  на всём батче — одно матричное умножение:
</p>
<div class="math-display" data-tex="Z_1 = X\,W_1 + b_1, \qquad [4 \times 4] \cdot [4 \times 5] + [1 \times 5] = [4 \times 5]"></div>

<div class="callout-blue">
  <strong>Два соглашения о форме W.</strong> Здесь <code>W₁</code> хранится как
  <code>[d_in × d_out]</code>, и слой — это <span class="math-inline" data-tex="XW + b"></span>.
  В PyTorch <code>nn.Linear</code> хранит транспонированную матрицу <code>[d_out × d_in]</code>
  и считает <span class="math-inline" data-tex="XW^{\top} + b"></span>. Математика одна и та же;
  важно лишь не перепутать, по какому индексу идёт сумма.
</div>
<div class="stage" id="stage-li" tabindex="0">
  <div class="stage-figure">
<svg id="li" viewBox="0 0 960 620" role="img" aria-label="Линейный слой: X умножается на W1, к результату прибавляется b1">
<style>
  #li { font-family: Helvetica, Arial, sans-serif; }
  #li .cap { font-size: 13px; fill: #5E5850; }
  #li .lbl { font-size: 16px; fill: #111111; }
  #li .legend { font-size: 13px; fill: #5E5850; }
  #li .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #li .grid { stroke: #ffffff; stroke-width: 1.35; }
  #li .dim { font-size: 13px; fill: #5E5850; }
  #li .nm { font-size: 16px; font-weight: 800; }
  #li .op { font-size: 23px; fill: #5E5850; }
  #li .arw { font-size: 12px; fill: #5E5850; }
  #li .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="li-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="li-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="li-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="li-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="348" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="30" y="236" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="398.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 398)">слой 1</text><text x="20.0" y="286.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 286)">слой 2</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 356 L 125 328" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 292 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#li-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 1</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear 1</text><rect x="34" y="398" width="182" height="48" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="x"><g><rect x="290.0" y="230.0" width="104.0" height="104.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="316.0" y1="230.0" x2="316.0" y2="334.0" class="grid" opacity=".75"/><line x1="342.0" y1="230.0" x2="342.0" y2="334.0" class="grid" opacity=".75"/><line x1="368.0" y1="230.0" x2="368.0" y2="334.0" class="grid" opacity=".75"/><line x1="290.0" y1="256.0" x2="394.0" y2="256.0" class="grid" opacity=".75"/><line x1="290.0" y1="282.0" x2="394.0" y2="282.0" class="grid" opacity=".75"/><line x1="290.0" y1="308.0" x2="394.0" y2="308.0" class="grid" opacity=".75"/></g><text x="342.0" y="222.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="282.0" y="286.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="287.0" y="338.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject></g><g data-key="w"><text x="414.0" y="288.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="430.0" y="230.0" width="130.0" height="104.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="456.0" y1="230.0" x2="456.0" y2="334.0" class="grid" opacity=".75"/><line x1="482.0" y1="230.0" x2="482.0" y2="334.0" class="grid" opacity=".75"/><line x1="508.0" y1="230.0" x2="508.0" y2="334.0" class="grid" opacity=".75"/><line x1="534.0" y1="230.0" x2="534.0" y2="334.0" class="grid" opacity=".75"/><line x1="430.0" y1="256.0" x2="560.0" y2="256.0" class="grid" opacity=".75"/><line x1="430.0" y1="282.0" x2="560.0" y2="282.0" class="grid" opacity=".75"/><line x1="430.0" y1="308.0" x2="560.0" y2="308.0" class="grid" opacity=".75"/></g><text x="495.0" y="222.0" font-size="13" fill="#111111" text-anchor="middle">5</text><foreignObject x="440.0" y="338.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_1"></div></foreignObject></g><g data-key="b"><text x="578.0" y="288.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="596.0" y="256.0" width="130.0" height="26.0" rx="2" fill="#7B4AB5" opacity="0.16" stroke="#7B4AB5" stroke-width="1" stroke-dasharray="4 3"/><rect x="596.0" y="282.0" width="130.0" height="26.0" rx="2" fill="#7B4AB5" opacity="0.16" stroke="#7B4AB5" stroke-width="1" stroke-dasharray="4 3"/><rect x="596.0" y="308.0" width="130.0" height="26.0" rx="2" fill="#7B4AB5" opacity="0.16" stroke="#7B4AB5" stroke-width="1" stroke-dasharray="4 3"/></g><g><rect x="596.0" y="230.0" width="130.0" height="26.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="622.0" y1="230.0" x2="622.0" y2="256.0" class="grid" opacity=".75"/><line x1="648.0" y1="230.0" x2="648.0" y2="256.0" class="grid" opacity=".75"/><line x1="674.0" y1="230.0" x2="674.0" y2="256.0" class="grid" opacity=".75"/><line x1="700.0" y1="230.0" x2="700.0" y2="256.0" class="grid" opacity=".75"/></g><text x="661.0" y="222.0" font-size="13" fill="#111111" text-anchor="middle">5</text><foreignObject x="606.0" y="338.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b_1"></div></foreignObject><text x="661.0" y="390.0" font-size="13" fill="#5E5850" text-anchor="middle">одна строка b₁ прибавляется</text><text x="661.0" y="408.0" font-size="13" fill="#5E5850" text-anchor="middle">к каждой строке</text></g><g data-key="z"><text x="744.0" y="288.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="762.0" y="230.0" width="130.0" height="104.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="788.0" y1="230.0" x2="788.0" y2="334.0" class="grid" opacity=".75"/><line x1="814.0" y1="230.0" x2="814.0" y2="334.0" class="grid" opacity=".75"/><line x1="840.0" y1="230.0" x2="840.0" y2="334.0" class="grid" opacity=".75"/><line x1="866.0" y1="230.0" x2="866.0" y2="334.0" class="grid" opacity=".75"/><line x1="762.0" y1="256.0" x2="892.0" y2="256.0" class="grid" opacity=".75"/><line x1="762.0" y1="282.0" x2="892.0" y2="282.0" class="grid" opacity=".75"/><line x1="762.0" y1="308.0" x2="892.0" y2="308.0" class="grid" opacity=".75"/></g><text x="827.0" y="222.0" font-size="13" fill="#111111" text-anchor="middle">5</text><foreignObject x="772.0" y="338.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_1"></div></foreignObject></g><g data-key="cell" data-only="1"><rect x="290.0" y="256.0" width="104.0" height="26.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="482.0" y="230.0" width="26.0" height="104.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="814.0" y="256.0" width="26.0" height="26.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="290.0" y="430.0" width="650.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z_{ij} = \sum_{k=1}^{4} x_{ik}\, w_{kj} + b_j"></div></foreignObject><text x="615.0" y="490.0" font-size="13" fill="#C30B0A" text-anchor="middle">строка i матрицы X · столбец j матрицы W₁ = клетка (i, j) матрицы Z₁</text></g><g data-key="shapes" data-only="1"><foreignObject x="290.0" y="440.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[4 \times 4] \cdot [4 \times 5] + [1 \times 5] = [4 \times 5]"></div></foreignObject><foreignObject x="290.0" y="490.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_1 = X\,W_1 + b_1"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl x" data-focus="hl x">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>Весь батч заходит одной матрицей</h4>
      <p>Никакого цикла по объектам: четыре цветка входят в слой одновременно, строками матрицы X.</p>
    </div>
    <div class="step-panel" data-on="hl x w" data-focus="w">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>W₁ — пять нейронов, поставленные рядом</h4>
      <p>Каждый столбец — веса одного нейрона из прошлой части. Строк столько, сколько признаков на входе: 4. Столбцов столько, сколько нейронов: 5.</p>
    </div>
    <div class="step-panel" data-on="hl x w z cell" data-focus="cell">
      <div class="step-kicker">Шаг 3 · клетка</div>
      <h4>Клетка Z₁ — один нейрон на одном объекте</h4>
      <p>Строка 2 матрицы X на столбец 3 матрицы W₁ даёт клетку (2, 3) результата. Одно матричное умножение делает сразу 4 × 5 = 20 расчётов нейрона из предыдущей части.</p>
    </div>
    <div class="step-panel" data-on="hl x w b z" data-focus="b">
      <div class="step-kicker">Шаг 4 · смещение</div>
      <h4>b₁ растягивается на все строки</h4>
      <p>Смещение нейрона не зависит от объекта, поэтому строка <code>b₁ [1 × 5]</code> прибавляется к каждой из четырёх строк. Формально <code>[4 × 5] + [1 × 5]</code> не складываются — так работает broadcasting в numpy и PyTorch.</p>
    </div>
    <div class="step-panel" data-on="hl x w b z shapes" data-focus="shapes z">
      <div class="step-kicker">Шаг 5 · формы</div>
      <h4>[4 × 4] · [4 × 5] + [1 × 5] = [4 × 5]</h4>
      <p>Внутренние размерности (4 и 4) должны совпасть — это ширина входа. Наружу выходят число объектов и число нейронов. Эта строчка форм — всё, что нужно помнить о линейном слое.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Та же операция на наших числах. Левый верхний угол Z₁ — тот самый нейрон из прошлой части.</p>
<div class="stage" id="stage-lin" tabindex="0">
  <div class="stage-figure">
<svg id="lin" viewBox="0 0 960 510" role="img" aria-label="Числовой расчёт первого линейного слоя">
<style>
  #lin { font-family: Helvetica, Arial, sans-serif; }
  #lin .cap { font-size: 13px; fill: #5E5850; }
  #lin .lbl { font-size: 16px; fill: #111111; }
  #lin .legend { font-size: 13px; fill: #5E5850; }
  #lin .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #lin .grid { stroke: #ffffff; stroke-width: 1.35; }
  #lin .dim { font-size: 13px; fill: #5E5850; }
  #lin .nm { font-size: 16px; font-weight: 800; }
  #lin .op { font-size: 23px; fill: #5E5850; }
  #lin .arw { font-size: 12px; fill: #5E5850; }
  #lin .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="lin-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="lin-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="lin-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="lin-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: Z₁ = X · W₁ + b₁</text><g data-key="x"><g><rect x="96.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="113.0" y1="70.0" x2="113.0" y2="138.0" class="grid" opacity=".75"/><line x1="130.0" y1="70.0" x2="130.0" y2="138.0" class="grid" opacity=".75"/><line x1="147.0" y1="70.0" x2="147.0" y2="138.0" class="grid" opacity=".75"/><line x1="96.0" y1="87.0" x2="164.0" y2="87.0" class="grid" opacity=".75"/><line x1="96.0" y1="104.0" x2="164.0" y2="104.0" class="grid" opacity=".75"/><line x1="96.0" y1="121.0" x2="164.0" y2="121.0" class="grid" opacity=".75"/></g><text x="130.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="86.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="40.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject><foreignObject x="13.0" y="168.0" width="234.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.90 &amp; 1.02 &amp; -1.34 &amp; -1.32 \\ -0.17 &amp; -0.59 &amp; 0.42 &amp; 0.13 \\ 0.80 &amp; 0.33 &amp; 0.76 &amp; 1.05 \\ 0.07 &amp; 0.33 &amp; 0.59 &amp; 0.79\end{bmatrix}"></div></foreignObject></g><text x="272.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g data-key="w"><g><rect x="377.5" y="70.0" width="85.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="394.5" y1="70.0" x2="394.5" y2="138.0" class="grid" opacity=".75"/><line x1="411.5" y1="70.0" x2="411.5" y2="138.0" class="grid" opacity=".75"/><line x1="428.5" y1="70.0" x2="428.5" y2="138.0" class="grid" opacity=".75"/><line x1="445.5" y1="70.0" x2="445.5" y2="138.0" class="grid" opacity=".75"/><line x1="377.5" y1="87.0" x2="462.5" y2="87.0" class="grid" opacity=".75"/><line x1="377.5" y1="104.0" x2="462.5" y2="104.0" class="grid" opacity=".75"/><line x1="377.5" y1="121.0" x2="462.5" y2="121.0" class="grid" opacity=".75"/></g><text x="420.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="367.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="330.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_1"></div></foreignObject><foreignObject x="300.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.4 &amp; 0.0 &amp; -0.3 &amp; -0.9 &amp; 0.5 \\ -0.3 &amp; -1.1 &amp; -0.8 &amp; -0.6 &amp; -0.6 \\ -0.4 &amp; -0.9 &amp; 0.8 &amp; -0.8 &amp; 0.5 \\ -1.2 &amp; 0.0 &amp; -1.8 &amp; -0.7 &amp; 0.4\end{bmatrix}"></div></foreignObject></g><text x="590.0" y="86.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g data-key="b"><g><rect x="717.5" y="70.0" width="85.0" height="17.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="734.5" y1="70.0" x2="734.5" y2="87.0" class="grid" opacity=".75"/><line x1="751.5" y1="70.0" x2="751.5" y2="87.0" class="grid" opacity=".75"/><line x1="768.5" y1="70.0" x2="768.5" y2="87.0" class="grid" opacity=".75"/><line x1="785.5" y1="70.0" x2="785.5" y2="87.0" class="grid" opacity=".75"/></g><text x="760.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="707.5" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="670.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b_1"></div></foreignObject><foreignObject x="640.0" y="117.0" width="240.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.3 &amp; -0.3 &amp; -0.2 &amp; 0.1 &amp; 0.1\end{bmatrix}"></div></foreignObject></g><text x="270.0" y="324.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g data-key="z"><g><rect x="377.5" y="290.0" width="85.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="394.5" y1="290.0" x2="394.5" y2="358.0" class="grid" opacity=".75"/><line x1="411.5" y1="290.0" x2="411.5" y2="358.0" class="grid" opacity=".75"/><line x1="428.5" y1="290.0" x2="428.5" y2="358.0" class="grid" opacity=".75"/><line x1="445.5" y1="290.0" x2="445.5" y2="358.0" class="grid" opacity=".75"/><line x1="377.5" y1="307.0" x2="462.5" y2="307.0" class="grid" opacity=".75"/><line x1="377.5" y1="324.0" x2="462.5" y2="324.0" class="grid" opacity=".75"/><line x1="377.5" y1="341.0" x2="462.5" y2="341.0" class="grid" opacity=".75"/></g><text x="420.0" y="282.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="367.5" y="328.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="330.0" y="361.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_1"></div></foreignObject><foreignObject x="275.0" y="388.0" width="290.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.87 &amp; -0.22 &amp; 0.56 &amp; 2.29 &amp; -2.16 \\ -0.38 &amp; -0.03 &amp; 0.42 &amp; 0.18 &amp; 0.63 \\ -2.28 &amp; -1.35 &amp; -1.99 &amp; -2.16 &amp; 1.10 \\ -1.61 &amp; -1.19 &amp; -1.44 &amp; -1.19 &amp; 0.55\end{bmatrix}"></div></foreignObject></g><g data-key="cell" data-only="1"><rect x="377.5" y="290.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="590.0" y="300.0" width="360.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z_{11} = 1.874 \ \text{(часть 3)}"></div></foreignObject></g><g data-key="dead" data-only="1"><rect x="394.5" y="290.0" width="17.0" height="68.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="590.0" y="370.0" font-size="13" fill="#C30B0A" text-anchor="start">второй столбец: −0.22, −0.03, −1.35, −1.19</text><text x="590.0" y="390.0" font-size="13" fill="#C30B0A" text-anchor="start">все четыре числа отрицательны —</text><text x="590.0" y="408.0" font-size="13" fill="#C30B0A" text-anchor="start">после ReLU нейрон 2 молчит на всём батче</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="x w" data-focus="x w">
      <div class="step-kicker">Шаг 1 · два множителя</div>
      <h4>X [4 × 4] и W₁ [4 × 5]</h4>
      <p>Строки X — четыре цветка, столбцы W₁ — пять нейронов. Веса выбраны случайно и округлены до десятых; сеть не обучена.</p>
    </div>
    <div class="step-panel" data-on="x w z cell" data-focus="cell">
      <div class="step-kicker">Шаг 2 · знакомое число</div>
      <h4>Левый верхний угол — это 1.874 из прошлой части</h4>
      <p>Первая строка X на первый столбец W₁ плюс b₁ = −0.3. Остальные 19 клеток считаются так же.</p>
    </div>
    <div class="step-panel" data-on="x w b z" data-focus="b z">
      <div class="step-kicker">Шаг 3 · весь слой</div>
      <h4>b₁ = (−0.3, −0.3, −0.2, 0.1, 0.1) добавлено к каждой строке</h4>
      <p>Например, пятый столбец: у setosa −2.16, у virginica +1.10. Пятый нейрон реагирует на длинные лепестки — одна из первых «осмысленных» реакций, хотя веса случайные.</p>
    </div>
    <div class="step-panel" data-on="z dead" data-focus="dead">
      <div class="step-kicker">Шаг 4 · находка</div>
      <h4>Столбец, в котором нет ни одного положительного числа</h4>
      <p>У второго нейрона z отрицательно у всех четырёх цветков. Для этого батча он «мёртв»: его выход — нули, и, как покажет обратный проход, ни один его вес на этом батче не получит градиента.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> линейный слой — одно умножение <code>[B × d_in] · [d_in × d_out]</code> и прибавление строки смещений ко всем строкам; внутренние размерности обязаны совпасть.
</div>

---


## Часть 5. ReLU: поэлементная нелинейность

<p>
  Функция активации применяется к каждому числу матрицы отдельно. Самая распространённая —
  ReLU (rectified linear unit): отрицательное превращается в ноль, положительное проходит как есть.
</p>
<div class="math-display" data-tex="A_1 = \max(0,\ Z_1) = Z_1 \odot [Z_1 &gt; 0]"></div>

<p>
  Запись через маску <span class="math-inline" data-tex="[Z_1 > 0]"></span> (единица там, где
  условие выполнено) пригодится на обратном проходе: производная ReLU — это та же маска.
</p>
<div class="stage" id="stage-re" tabindex="0">
  <div class="stage-figure">
<svg id="re" viewBox="0 0 960 620" role="img" aria-label="ReLU: поэлементная маска, форма не меняется">
<style>
  #re { font-family: Helvetica, Arial, sans-serif; }
  #re .cap { font-size: 13px; fill: #5E5850; }
  #re .lbl { font-size: 16px; fill: #111111; }
  #re .legend { font-size: 13px; fill: #5E5850; }
  #re .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #re .grid { stroke: #ffffff; stroke-width: 1.35; }
  #re .dim { font-size: 13px; fill: #5E5850; }
  #re .nm { font-size: 16px; font-weight: 800; }
  #re .op { font-size: 23px; fill: #5E5850; }
  #re .arw { font-size: 12px; fill: #5E5850; }
  #re .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="re-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="re-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="re-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="re-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="348" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="30" y="236" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="398.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 398)">слой 1</text><text x="20.0" y="286.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 286)">слой 2</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#re-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#re-arw)"/><path d="M 125 356 L 125 328" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#re-arw)"/><path d="M 125 292 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#re-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#re-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#re-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#re-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#re-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#re-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 1</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#C30B0A" text-anchor="middle">ReLU</text><rect x="34" y="350" width="182" height="42" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="z"><g><rect x="290.0" y="320.0" width="130.0" height="104.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="316.0" y1="320.0" x2="316.0" y2="424.0" class="grid" opacity=".75"/><line x1="342.0" y1="320.0" x2="342.0" y2="424.0" class="grid" opacity=".75"/><line x1="368.0" y1="320.0" x2="368.0" y2="424.0" class="grid" opacity=".75"/><line x1="394.0" y1="320.0" x2="394.0" y2="424.0" class="grid" opacity=".75"/><line x1="290.0" y1="346.0" x2="420.0" y2="346.0" class="grid" opacity=".75"/><line x1="290.0" y1="372.0" x2="420.0" y2="372.0" class="grid" opacity=".75"/><line x1="290.0" y1="398.0" x2="420.0" y2="398.0" class="grid" opacity=".75"/></g><text x="355.0" y="312.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="282.0" y="376.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="300.0" y="428.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_1"></div></foreignObject></g><g data-key="graph"><line x1="470" y1="240" x2="800" y2="240" stroke="#8A857C" stroke-width="1.2"/><line x1="635" y1="76" x2="635" y2="252" stroke="#8A857C" stroke-width="1.2"/><path d="M 480 240 L 635 240 L 780 95" fill="none" stroke="#73B222" stroke-width="3"/><text x="796.0" y="258.0" font-size="13" fill="#5E5850" text-anchor="end" font-style="italic">z</text><text x="645.0" y="88.0" font-size="13" fill="#5E5850" text-anchor="start" font-style="italic">a</text><text x="650.0" y="104.0" font-size="13" fill="#111111" text-anchor="start">a = max(0, z)</text></g><g data-key="mask"><text x="438.0" y="378.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="456.0" y="320.0" width="130.0" height="104.0" rx="2" fill="#E4E1D7" opacity="1.0" stroke="#ffffff" stroke-width="1"/><line x1="482.0" y1="320.0" x2="482.0" y2="424.0" class="grid" opacity=".75"/><line x1="508.0" y1="320.0" x2="508.0" y2="424.0" class="grid" opacity=".75"/><line x1="534.0" y1="320.0" x2="534.0" y2="424.0" class="grid" opacity=".75"/><line x1="560.0" y1="320.0" x2="560.0" y2="424.0" class="grid" opacity=".75"/><line x1="456.0" y1="346.0" x2="586.0" y2="346.0" class="grid" opacity=".75"/><line x1="456.0" y1="372.0" x2="586.0" y2="372.0" class="grid" opacity=".75"/><line x1="456.0" y1="398.0" x2="586.0" y2="398.0" class="grid" opacity=".75"/></g><rect x="457" y="321" width="24" height="24" fill="#73B222" opacity="0.7" rx="1"/><rect x="509" y="321" width="24" height="24" fill="#73B222" opacity="0.7" rx="1"/><rect x="535" y="321" width="24" height="24" fill="#73B222" opacity="0.7" rx="1"/><rect x="509" y="347" width="24" height="24" fill="#73B222" opacity="0.7" rx="1"/><rect x="535" y="347" width="24" height="24" fill="#73B222" opacity="0.7" rx="1"/><rect x="561" y="347" width="24" height="24" fill="#73B222" opacity="0.7" rx="1"/><rect x="561" y="373" width="24" height="24" fill="#73B222" opacity="0.7" rx="1"/><rect x="561" y="399" width="24" height="24" fill="#73B222" opacity="0.7" rx="1"/><text x="521.0" y="312.0" font-size="13" fill="#111111" text-anchor="middle">5</text><foreignObject x="466.0" y="428.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[Z_1 &gt; 0]"></div></foreignObject></g><g data-key="a"><text x="604.0" y="378.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="622.0" y="320.0" width="130.0" height="104.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="648.0" y1="320.0" x2="648.0" y2="424.0" class="grid" opacity=".75"/><line x1="674.0" y1="320.0" x2="674.0" y2="424.0" class="grid" opacity=".75"/><line x1="700.0" y1="320.0" x2="700.0" y2="424.0" class="grid" opacity=".75"/><line x1="726.0" y1="320.0" x2="726.0" y2="424.0" class="grid" opacity=".75"/><line x1="622.0" y1="346.0" x2="752.0" y2="346.0" class="grid" opacity=".75"/><line x1="622.0" y1="372.0" x2="752.0" y2="372.0" class="grid" opacity=".75"/><line x1="622.0" y1="398.0" x2="752.0" y2="398.0" class="grid" opacity=".75"/></g><rect x="649.0" y="321.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="727.0" y="321.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="623.0" y="347.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="649.0" y="347.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="623.0" y="373.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="649.0" y="373.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="675.0" y="373.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="701.0" y="373.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="623.0" y="399.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="649.0" y="399.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="675.0" y="399.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="701.0" y="399.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><text x="687.0" y="312.0" font-size="13" fill="#111111" text-anchor="middle">5</text><foreignObject x="632.0" y="428.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_1"></div></foreignObject><text x="770.0" y="338.0" font-size="13" fill="#5E5850" text-anchor="start">серые клетки —</text><text x="770.0" y="356.0" font-size="13" fill="#5E5850" text-anchor="start">нейрон молчит</text></g><g data-key="same" data-only="1"><foreignObject x="290.0" y="470.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_1 = \max(0,\ Z_1) = Z_1 \odot [Z_1 &gt; 0]"></div></foreignObject><text x="615.0" y="530.0" font-size="13" fill="#5E5850" text-anchor="middle">форма [4 × 5] сохраняется · параметров нет · каждое число обрабатывается отдельно</text></g><g data-key="grad" data-only="1"><path d="M 480 236 L 635 236" stroke="#C30B0A" stroke-width="2.4" stroke-dasharray="6 4" fill="none"/><path d="M 635 180 L 790 180" stroke="#C30B0A" stroke-width="2.4" stroke-dasharray="6 4" fill="none"/><text x="712.0" y="200.0" font-size="12" fill="#C30B0A" text-anchor="start" font-weight="700">производная = 1</text><text x="490.0" y="226.0" font-size="12" fill="#C30B0A" text-anchor="start" font-weight="700">производная = 0</text></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
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
      <h4>ReLU получает Z₁ целиком</h4>
      <p>Та же матрица <code>[4 × 5]</code>, что вышла из линейного слоя: пред-активации пяти нейронов на четырёх цветках.</p>
    </div>
    <div class="step-panel" data-on="hl z graph" data-focus="graph">
      <div class="step-kicker">Шаг 2 · функция</div>
      <h4>max(0, z) — ломаная из двух лучей</h4>
      <p>Слева ноль, справа прямая с наклоном 1. Самая простая нелинейность, которая работает: считается одним сравнением и почти не мешает градиенту течь.</p>
    </div>
    <div class="step-panel" data-on="hl z graph mask" data-focus="mask">
      <div class="step-kicker">Шаг 3 · маска</div>
      <h4>Где z &gt; 0 — единица, где нет — ноль</h4>
      <p>ReLU удобно записывать как умножение на маску той же формы. Зелёные клетки — открытые нейроны, серые — закрытые. Для каждого объекта своя маска.</p>
    </div>
    <div class="step-panel" data-on="hl z mask a" data-focus="a">
      <div class="step-kicker">Шаг 4 · результат</div>
      <h4>A₁ = Z₁ с обнулёнными клетками</h4>
      <p>Положительные числа прошли без изменений, отрицательные стали нулями. На этом батче открыто 8 клеток из 20.</p>
    </div>
    <div class="step-panel" data-on="hl z mask a same" data-focus="same">
      <div class="step-kicker">Шаг 5 · формы</div>
      <h4>ReLU — единственный слой, который не умеет менять форму</h4>
      <p>Он работает поэлементно, поэтому <code>[4 × 5] → [4 × 5]</code>, и в нём нет ни одного обучаемого числа. Всё, что он делает, — решает, какие клетки пропустить.</p>
    </div>
    <div class="step-panel" data-on="hl graph mask grad" data-focus="grad mask">
      <div class="step-kicker">Шаг 6 · забегая вперёд</div>
      <h4>Та же маска понадобится на обратном пути</h4>
      <p>Производная ReLU — 0 слева и 1 справа. На обратном проходе градиент умножится на ту же самую маску: через закрытую клетку он не пройдёт. Отсюда и «мёртвые» нейроны.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Двадцать чисел Z₁, их знаки и результат.</p>
<div class="stage" id="stage-ren" tabindex="0">
  <div class="stage-figure">
<svg id="ren" viewBox="0 0 960 470" role="img" aria-label="Числовой расчёт ReLU первого слоя">
<style>
  #ren { font-family: Helvetica, Arial, sans-serif; }
  #ren .cap { font-size: 13px; fill: #5E5850; }
  #ren .lbl { font-size: 16px; fill: #111111; }
  #ren .legend { font-size: 13px; fill: #5E5850; }
  #ren .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #ren .grid { stroke: #ffffff; stroke-width: 1.35; }
  #ren .dim { font-size: 13px; fill: #5E5850; }
  #ren .nm { font-size: 16px; font-weight: 800; }
  #ren .op { font-size: 23px; fill: #5E5850; }
  #ren .arw { font-size: 12px; fill: #5E5850; }
  #ren .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="ren-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="ren-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="ren-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="ren-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: A₁ = max(0, Z₁)</text><g data-key="z"><g><rect x="117.5" y="70.0" width="85.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="134.5" y1="70.0" x2="134.5" y2="138.0" class="grid" opacity=".75"/><line x1="151.5" y1="70.0" x2="151.5" y2="138.0" class="grid" opacity=".75"/><line x1="168.5" y1="70.0" x2="168.5" y2="138.0" class="grid" opacity=".75"/><line x1="185.5" y1="70.0" x2="185.5" y2="138.0" class="grid" opacity=".75"/><line x1="117.5" y1="87.0" x2="202.5" y2="87.0" class="grid" opacity=".75"/><line x1="117.5" y1="104.0" x2="202.5" y2="104.0" class="grid" opacity=".75"/><line x1="117.5" y1="121.0" x2="202.5" y2="121.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="107.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="70.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_1"></div></foreignObject><foreignObject x="15.0" y="168.0" width="290.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.87 &amp; -0.22 &amp; 0.56 &amp; 2.29 &amp; -2.16 \\ -0.38 &amp; -0.03 &amp; 0.42 &amp; 0.18 &amp; 0.63 \\ -2.28 &amp; -1.35 &amp; -1.99 &amp; -2.16 &amp; 1.10 \\ -1.61 &amp; -1.19 &amp; -1.44 &amp; -1.19 &amp; 0.55\end{bmatrix}"></div></foreignObject></g><text x="318.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g data-key="m"><g><rect x="397.5" y="70.0" width="85.0" height="68.0" rx="2" fill="#5E5850" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="414.5" y1="70.0" x2="414.5" y2="138.0" class="grid" opacity=".75"/><line x1="431.5" y1="70.0" x2="431.5" y2="138.0" class="grid" opacity=".75"/><line x1="448.5" y1="70.0" x2="448.5" y2="138.0" class="grid" opacity=".75"/><line x1="465.5" y1="70.0" x2="465.5" y2="138.0" class="grid" opacity=".75"/><line x1="397.5" y1="87.0" x2="482.5" y2="87.0" class="grid" opacity=".75"/><line x1="397.5" y1="104.0" x2="482.5" y2="104.0" class="grid" opacity=".75"/><line x1="397.5" y1="121.0" x2="482.5" y2="121.0" class="grid" opacity=".75"/></g><text x="440.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="387.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="350.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[Z_1 &gt; 0]"></div></foreignObject><foreignObject x="350.0" y="168.0" width="180.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 &amp; 0 &amp; 1 &amp; 1 &amp; 0 \\ 0 &amp; 0 &amp; 1 &amp; 1 &amp; 1 \\ 0 &amp; 0 &amp; 0 &amp; 0 &amp; 1 \\ 0 &amp; 0 &amp; 0 &amp; 0 &amp; 1\end{bmatrix}"></div></foreignObject></g><text x="560.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g data-key="a"><g><rect x="697.5" y="70.0" width="85.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="714.5" y1="70.0" x2="714.5" y2="138.0" class="grid" opacity=".75"/><line x1="731.5" y1="70.0" x2="731.5" y2="138.0" class="grid" opacity=".75"/><line x1="748.5" y1="70.0" x2="748.5" y2="138.0" class="grid" opacity=".75"/><line x1="765.5" y1="70.0" x2="765.5" y2="138.0" class="grid" opacity=".75"/><line x1="697.5" y1="87.0" x2="782.5" y2="87.0" class="grid" opacity=".75"/><line x1="697.5" y1="104.0" x2="782.5" y2="104.0" class="grid" opacity=".75"/><line x1="697.5" y1="121.0" x2="782.5" y2="121.0" class="grid" opacity=".75"/></g><text x="740.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="687.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="650.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_1"></div></foreignObject><foreignObject x="595.0" y="168.0" width="290.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.87 &amp; 0.00 &amp; 0.56 &amp; 2.29 &amp; 0.00 \\ 0.00 &amp; 0.00 &amp; 0.42 &amp; 0.18 &amp; 0.63 \\ 0.00 &amp; 0.00 &amp; 0.00 &amp; 0.00 &amp; 1.10 \\ 0.00 &amp; 0.00 &amp; 0.00 &amp; 0.00 &amp; 0.55\end{bmatrix}"></div></foreignObject></g><g data-key="dead" data-only="1"><rect x="134.5" y="70.0" width="17.0" height="68.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="414.5" y="70.0" width="17.0" height="68.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="714.5" y="70.0" width="17.0" height="68.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="480.0" y="320.0" font-size="13" fill="#C30B0A" text-anchor="middle">столбец 2: у всех четырёх цветков z столбец 2 обнулён во всех трёх строках-объектах — нейрон 2 не отвечает ни одному цветкуlt; 0, в маске нули, в A₁ нули — нейрон 2 не отвечает никому</text></g><g data-key="row3" data-only="1"><rect x="697.5" y="104.0" width="85.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="480.0" y="350.0" font-size="13" fill="#5F9420" text-anchor="middle">у virginica открыт только пятый нейрон: 1.10 — вся её информация идёт дальше через одно число</text></g><g data-key="cnt" data-only="1"><text x="480.0" y="390.0" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">открыто 8 клеток из 20 · в каждой строке своя маска</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="z m" data-focus="m">
      <div class="step-kicker">Шаг 1 · маска</div>
      <h4>Знак каждой клетки Z₁</h4>
      <p>Маска — это просто [z &gt; 0], записанная нулями и единицами.</p>
    </div>
    <div class="step-panel" data-on="z m a cnt" data-focus="a cnt">
      <div class="step-kicker">Шаг 2 · результат</div>
      <h4>8 открытых клеток из 20</h4>
      <p>У setosa открыты нейроны 1, 3, 4; у первого versicolor — 3, 4, 5; у virginica и второго versicolor — только пятый.</p>
    </div>
    <div class="step-panel" data-on="z m a dead" data-focus="dead">
      <div class="step-kicker">Шаг 3 · мёртвый нейрон</div>
      <h4>Второй столбец — одни нули</h4>
      <p>Нейрон 2 не отвечает ни одному цветку батча. Для прямого прохода это просто пустой столбец, но для обучения — приговор на этом батче: градиент через него не пойдёт.</p>
    </div>
    <div class="step-panel" data-on="a row3" data-focus="row3">
      <div class="step-kicker">Шаг 4 · узкое горло</div>
      <h4>Virginica проходит через первый слой одним числом</h4>
      <p>Из пяти нейронов у третьего цветка работает один. Всё, что сеть «знает» о нём дальше, — число 1.10. Это не ошибка, а следствие случайных весов: обучение как раз и перераспределит, кто на что реагирует.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> ReLU не меняет форму и не имеет параметров — она решает, какие клетки пропустить; эта маска разная у разных объектов и потом управляет потоком градиента.
</div>

---


## Часть 6. Второй скрытый слой и цепочка форм

<p>
  Второй скрытый слой — это та же пара «линейный слой → ReLU», только вход у неё не X,
  а <code>A₁</code>. Никаких новых формул:
</p>
<div class="math-display" data-tex="Z_2 = A_1 W_2 + b_2, \qquad A_2 = \max(0,\ Z_2), \qquad [4 \times 5] \cdot [5 \times 4] + [1 \times 4] = [4 \times 4]"></div>

<p>
  Новое здесь одно — правило сцепления: число строк следующей матрицы весов равно числу
  столбцов предыдущей. Выбор ширин 5 и 4 — решение архитектора; всё остальное следует из него.
</p>
<div class="stage" id="stage-dp" tabindex="0">
  <div class="stage-figure">
<svg id="dp" viewBox="0 0 960 620" role="img" aria-label="Второй скрытый слой: A1 умножается на W2, добавляется b2, затем ReLU">
<style>
  #dp { font-family: Helvetica, Arial, sans-serif; }
  #dp .cap { font-size: 13px; fill: #5E5850; }
  #dp .lbl { font-size: 16px; fill: #111111; }
  #dp .legend { font-size: 13px; fill: #5E5850; }
  #dp .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #dp .grid { stroke: #ffffff; stroke-width: 1.35; }
  #dp .dim { font-size: 13px; fill: #5E5850; }
  #dp .nm { font-size: 16px; font-weight: 800; }
  #dp .op { font-size: 23px; fill: #5E5850; }
  #dp .arw { font-size: 12px; fill: #5E5850; }
  #dp .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="dp-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="dp-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="dp-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="dp-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="348" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="30" y="236" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="398.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 398)">слой 1</text><text x="20.0" y="286.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 286)">слой 2</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#dp-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#dp-arw)"/><path d="M 125 356 L 125 328" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#dp-arw)"/><path d="M 125 292 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#dp-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#dp-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#dp-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#dp-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#dp-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#dp-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 1</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#C30B0A" text-anchor="middle">ReLU</text><rect x="34" y="238" width="182" height="96" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="a1"><g><rect x="290.0" y="210.0" width="130.0" height="104.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="316.0" y1="210.0" x2="316.0" y2="314.0" class="grid" opacity=".75"/><line x1="342.0" y1="210.0" x2="342.0" y2="314.0" class="grid" opacity=".75"/><line x1="368.0" y1="210.0" x2="368.0" y2="314.0" class="grid" opacity=".75"/><line x1="394.0" y1="210.0" x2="394.0" y2="314.0" class="grid" opacity=".75"/><line x1="290.0" y1="236.0" x2="420.0" y2="236.0" class="grid" opacity=".75"/><line x1="290.0" y1="262.0" x2="420.0" y2="262.0" class="grid" opacity=".75"/><line x1="290.0" y1="288.0" x2="420.0" y2="288.0" class="grid" opacity=".75"/></g><text x="355.0" y="202.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="282.0" y="266.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="300.0" y="318.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_1"></div></foreignObject></g><g data-key="w2"><text x="434.0" y="268.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="450.0" y="197.0" width="104.0" height="130.0" rx="2" fill="#1B9BC2" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="476.0" y1="197.0" x2="476.0" y2="327.0" class="grid" opacity=".75"/><line x1="502.0" y1="197.0" x2="502.0" y2="327.0" class="grid" opacity=".75"/><line x1="528.0" y1="197.0" x2="528.0" y2="327.0" class="grid" opacity=".75"/><line x1="450.0" y1="223.0" x2="554.0" y2="223.0" class="grid" opacity=".75"/><line x1="450.0" y1="249.0" x2="554.0" y2="249.0" class="grid" opacity=".75"/><line x1="450.0" y1="275.0" x2="554.0" y2="275.0" class="grid" opacity=".75"/><line x1="450.0" y1="301.0" x2="554.0" y2="301.0" class="grid" opacity=".75"/></g><text x="502.0" y="189.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="447.0" y="331.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_2"></div></foreignObject></g><g data-key="b2"><text x="570.0" y="268.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="588.0" y="236.0" width="104.0" height="26.0" rx="2" fill="#1B9BC2" opacity="0.16" stroke="#1B9BC2" stroke-width="1" stroke-dasharray="4 3"/><rect x="588.0" y="262.0" width="104.0" height="26.0" rx="2" fill="#1B9BC2" opacity="0.16" stroke="#1B9BC2" stroke-width="1" stroke-dasharray="4 3"/><rect x="588.0" y="288.0" width="104.0" height="26.0" rx="2" fill="#1B9BC2" opacity="0.16" stroke="#1B9BC2" stroke-width="1" stroke-dasharray="4 3"/></g><g><rect x="588.0" y="210.0" width="104.0" height="26.0" rx="2" fill="#1B9BC2" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="614.0" y1="210.0" x2="614.0" y2="236.0" class="grid" opacity=".75"/><line x1="640.0" y1="210.0" x2="640.0" y2="236.0" class="grid" opacity=".75"/><line x1="666.0" y1="210.0" x2="666.0" y2="236.0" class="grid" opacity=".75"/></g><text x="640.0" y="202.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="585.0" y="318.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b_2"></div></foreignObject></g><g data-key="z2"><text x="708.0" y="268.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="726.0" y="210.0" width="104.0" height="104.0" rx="2" fill="#1B9BC2" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="752.0" y1="210.0" x2="752.0" y2="314.0" class="grid" opacity=".75"/><line x1="778.0" y1="210.0" x2="778.0" y2="314.0" class="grid" opacity=".75"/><line x1="804.0" y1="210.0" x2="804.0" y2="314.0" class="grid" opacity=".75"/><line x1="726.0" y1="236.0" x2="830.0" y2="236.0" class="grid" opacity=".75"/><line x1="726.0" y1="262.0" x2="830.0" y2="262.0" class="grid" opacity=".75"/><line x1="726.0" y1="288.0" x2="830.0" y2="288.0" class="grid" opacity=".75"/></g><text x="778.0" y="202.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="723.0" y="318.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_2"></div></foreignObject></g><g data-key="a2"><path d="M 778.0 352.0 L 778.0 388.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#dp-arw)"/><text x="792.0" y="376.0" font-size="12" fill="#5E5850" text-anchor="start">ReLU</text><g><rect x="726.0" y="392.0" width="104.0" height="104.0" rx="2" fill="#1B9BC2" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="752.0" y1="392.0" x2="752.0" y2="496.0" class="grid" opacity=".75"/><line x1="778.0" y1="392.0" x2="778.0" y2="496.0" class="grid" opacity=".75"/><line x1="804.0" y1="392.0" x2="804.0" y2="496.0" class="grid" opacity=".75"/><line x1="726.0" y1="418.0" x2="830.0" y2="418.0" class="grid" opacity=".75"/><line x1="726.0" y1="444.0" x2="830.0" y2="444.0" class="grid" opacity=".75"/><line x1="726.0" y1="470.0" x2="830.0" y2="470.0" class="grid" opacity=".75"/></g><rect x="779.0" y="393.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="805.0" y="393.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><rect x="779.0" y="471.0" width="24.0" height="24.0" fill="#D9D5CC" rx="1"/><foreignObject x="723.0" y="498.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_2"></div></foreignObject></g><g data-key="rule" data-only="1"><rect x="290.0" y="190.0" width="130.0" height="18.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="1.6"/><text x="290.0" y="390.0" font-size="13" fill="#C30B0A" text-anchor="start">5 столбцов у A₁ = 5 строк у W₂:</text><text x="290.0" y="408.0" font-size="13" fill="#C30B0A" text-anchor="start">ширина входа должна совпасть</text></g><g data-key="chain" data-only="1"><foreignObject x="290.0" y="540.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X\,[4\times 4] \cdot W_1 \to [4\times 5] \cdot W_2 \to [4\times 4] \cdot W_3 \to [4\times 3]"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl a1" data-focus="hl a1">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>Вход второго слоя — выход первого</h4>
      <p>Второй слой ничего не знает про ирисы: он видит только <code>A₁ [4 × 5]</code> — пять чисел, которые первый слой насчитал для каждого цветка.</p>
    </div>
    <div class="step-panel" data-on="hl a1 w2 rule" data-focus="w2 rule">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>W₂ [5 × 4]: строк — сколько пришло, столбцов — сколько станет</h4>
      <p>Число строк матрицы весов всегда равно ширине входа, число столбцов — числу нейронов слоя. Поэтому соседние слои обязаны «договориться»: 5 выходов первого = 5 строк второго.</p>
    </div>
    <div class="step-panel" data-on="hl a1 w2 b2 z2" data-focus="b2 z2">
      <div class="step-kicker">Шаг 3 · тот же линейный слой</div>
      <h4>Z₂ = A₁ W₂ + b₂</h4>
      <p>Формула, broadcasting смещения и правило форм — ровно те же, что в части 4. <code>[4 × 5] · [5 × 4] + [1 × 4] = [4 × 4]</code>.</p>
    </div>
    <div class="step-panel" data-on="hl z2 a2" data-focus="a2">
      <div class="step-kicker">Шаг 4 · ReLU</div>
      <h4>И снова поэлементный max(0, ·)</h4>
      <p>Вторая маска своя: на этом батче закрыто 3 клетки из 16. Пара «линейный слой → ReLU» — это и есть один скрытый слой; глубокая сеть — просто несколько таких пар подряд.</p>
    </div>
    <div class="step-panel" data-on="hl a1 w2 z2 a2 chain" data-focus="chain">
      <div class="step-kicker">Шаг 5 · цепочка</div>
      <h4>Вся сеть — цепочка форм</h4>
      <p>Батч идёт сквозь слои, меняя только ширину: 4 → 5 → 4 → 3. Добавить слой — значит вставить в эту цепочку ещё одну матрицу подходящей формы.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Выход первого слоя со своими нулями встречается с весами второго.</p>
<div class="stage" id="stage-dpn" tabindex="0">
  <div class="stage-figure">
<svg id="dpn" viewBox="0 0 960 560" role="img" aria-label="Числовой расчёт второго скрытого слоя">
<style>
  #dpn { font-family: Helvetica, Arial, sans-serif; }
  #dpn .cap { font-size: 13px; fill: #5E5850; }
  #dpn .lbl { font-size: 16px; fill: #111111; }
  #dpn .legend { font-size: 13px; fill: #5E5850; }
  #dpn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #dpn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #dpn .dim { font-size: 13px; fill: #5E5850; }
  #dpn .nm { font-size: 16px; font-weight: 800; }
  #dpn .op { font-size: 23px; fill: #5E5850; }
  #dpn .arw { font-size: 12px; fill: #5E5850; }
  #dpn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="dpn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="dpn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="dpn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="dpn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: A₂ = max(0, A₁ · W₂ + b₂)</text><g data-key="a1"><g><rect x="107.5" y="70.0" width="85.0" height="68.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="124.5" y1="70.0" x2="124.5" y2="138.0" class="grid" opacity=".75"/><line x1="141.5" y1="70.0" x2="141.5" y2="138.0" class="grid" opacity=".75"/><line x1="158.5" y1="70.0" x2="158.5" y2="138.0" class="grid" opacity=".75"/><line x1="175.5" y1="70.0" x2="175.5" y2="138.0" class="grid" opacity=".75"/><line x1="107.5" y1="87.0" x2="192.5" y2="87.0" class="grid" opacity=".75"/><line x1="107.5" y1="104.0" x2="192.5" y2="104.0" class="grid" opacity=".75"/><line x1="107.5" y1="121.0" x2="192.5" y2="121.0" class="grid" opacity=".75"/></g><text x="150.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="97.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="60.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_1"></div></foreignObject><foreignObject x="5.0" y="168.0" width="290.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.87 &amp; 0.00 &amp; 0.56 &amp; 2.29 &amp; 0.00 \\ 0.00 &amp; 0.00 &amp; 0.42 &amp; 0.18 &amp; 0.63 \\ 0.00 &amp; 0.00 &amp; 0.00 &amp; 0.00 &amp; 1.10 \\ 0.00 &amp; 0.00 &amp; 0.00 &amp; 0.00 &amp; 0.55\end{bmatrix}"></div></foreignObject></g><text x="318.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g data-key="w2"><g><rect x="406.0" y="62.0" width="68.0" height="85.0" rx="2" fill="#1B9BC2" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="423.0" y1="62.0" x2="423.0" y2="147.0" class="grid" opacity=".75"/><line x1="440.0" y1="62.0" x2="440.0" y2="147.0" class="grid" opacity=".75"/><line x1="457.0" y1="62.0" x2="457.0" y2="147.0" class="grid" opacity=".75"/><line x1="406.0" y1="79.0" x2="474.0" y2="79.0" class="grid" opacity=".75"/><line x1="406.0" y1="96.0" x2="474.0" y2="96.0" class="grid" opacity=".75"/><line x1="406.0" y1="113.0" x2="474.0" y2="113.0" class="grid" opacity=".75"/><line x1="406.0" y1="130.0" x2="474.0" y2="130.0" class="grid" opacity=".75"/></g><text x="440.0" y="54.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="396.0" y="108.5" font-size="13" fill="#111111" text-anchor="end">5</text><foreignObject x="350.0" y="150.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_2"></div></foreignObject><foreignObject x="325.0" y="177.0" width="230.0" height="123.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.1 &amp; 0.1 &amp; -0.9 &amp; -0.4 \\ 0.2 &amp; 0.3 &amp; 0.5 &amp; -0.3 \\ 0.3 &amp; 0.4 &amp; 1.6 &amp; 0.1 \\ 0.4 &amp; 0.3 &amp; -0.6 &amp; -0.1 \\ 0.0 &amp; 1.1 &amp; 0.2 &amp; 0.2\end{bmatrix}"></div></foreignObject></g><text x="580.0" y="86.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g data-key="b2"><g><rect x="706.0" y="70.0" width="68.0" height="17.0" rx="2" fill="#1B9BC2" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="723.0" y1="70.0" x2="723.0" y2="87.0" class="grid" opacity=".75"/><line x1="740.0" y1="70.0" x2="740.0" y2="87.0" class="grid" opacity=".75"/><line x1="757.0" y1="70.0" x2="757.0" y2="87.0" class="grid" opacity=".75"/></g><text x="740.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="696.0" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="650.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b_2"></div></foreignObject><foreignObject x="625.0" y="117.0" width="230.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.3 &amp; -0.3 &amp; -0.2 &amp; 0.7\end{bmatrix}"></div></foreignObject></g><text x="60.0" y="354.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g data-key="z2"><g><rect x="186.0" y="320.0" width="68.0" height="68.0" rx="2" fill="#1B9BC2" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="203.0" y1="320.0" x2="203.0" y2="388.0" class="grid" opacity=".75"/><line x1="220.0" y1="320.0" x2="220.0" y2="388.0" class="grid" opacity=".75"/><line x1="237.0" y1="320.0" x2="237.0" y2="388.0" class="grid" opacity=".75"/><line x1="186.0" y1="337.0" x2="254.0" y2="337.0" class="grid" opacity=".75"/><line x1="186.0" y1="354.0" x2="254.0" y2="354.0" class="grid" opacity=".75"/><line x1="186.0" y1="371.0" x2="254.0" y2="371.0" class="grid" opacity=".75"/></g><text x="220.0" y="312.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="176.0" y="358.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="130.0" y="391.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_2"></div></foreignObject><foreignObject x="90.0" y="418.0" width="260.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.57 &amp; 0.80 &amp; -2.37 &amp; -0.22 \\ 0.50 &amp; 0.62 &amp; 0.50 &amp; 0.85 \\ 0.30 &amp; 0.91 &amp; 0.02 &amp; 0.92 \\ 0.30 &amp; 0.30 &amp; -0.09 &amp; 0.81\end{bmatrix}"></div></foreignObject></g><g data-key="a2"><path d="M 372.0 354.0 L 432.0 354.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#dpn-arw)"/><text x="402.0" y="344.0" font-size="12" fill="#5E5850" text-anchor="middle">ReLU</text><g><rect x="526.0" y="320.0" width="68.0" height="68.0" rx="2" fill="#1B9BC2" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="543.0" y1="320.0" x2="543.0" y2="388.0" class="grid" opacity=".75"/><line x1="560.0" y1="320.0" x2="560.0" y2="388.0" class="grid" opacity=".75"/><line x1="577.0" y1="320.0" x2="577.0" y2="388.0" class="grid" opacity=".75"/><line x1="526.0" y1="337.0" x2="594.0" y2="337.0" class="grid" opacity=".75"/><line x1="526.0" y1="354.0" x2="594.0" y2="354.0" class="grid" opacity=".75"/><line x1="526.0" y1="371.0" x2="594.0" y2="371.0" class="grid" opacity=".75"/></g><text x="560.0" y="312.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="516.0" y="358.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="470.0" y="391.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_2"></div></foreignObject><foreignObject x="430.0" y="418.0" width="260.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.57 &amp; 0.80 &amp; 0.00 &amp; 0.00 \\ 0.50 &amp; 0.62 &amp; 0.50 &amp; 0.85 \\ 0.30 &amp; 0.91 &amp; 0.02 &amp; 0.92 \\ 0.30 &amp; 0.30 &amp; 0.00 &amp; 0.81\end{bmatrix}"></div></foreignObject></g><g data-key="row2" data-only="1"><rect x="406.0" y="79.0" width="68.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="124.5" y="70.0" width="17.0" height="68.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="720.0" y="340.0" font-size="13" fill="#C30B0A" text-anchor="start">строка 2 матрицы W₂ умножается</text><text x="720.0" y="358.0" font-size="13" fill="#C30B0A" text-anchor="start">только на столбец 2 матрицы A₁,</text><text x="720.0" y="376.0" font-size="13" fill="#C30B0A" text-anchor="start">а он нулевой: эти четыре веса</text><text x="720.0" y="394.0" font-size="13" fill="#C30B0A" text-anchor="start">не влияют на ответ сети</text></g><g data-key="zeros" data-only="1"><rect x="560.0" y="320.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="577.0" y="320.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="560.0" y="371.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="720.0" y="440.0" font-size="15" fill="#111111" text-anchor="start" font-weight="700">открыто 13 клеток из 16</text><text x="720.0" y="462.0" font-size="13" fill="#5E5850" text-anchor="start">у setosa закрыты нейроны 3 и 4</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="a1 w2" data-focus="a1 w2">
      <div class="step-kicker">Шаг 1 · множители</div>
      <h4>A₁ [4 × 5] и W₂ [5 × 4]</h4>
      <p>Слева — выход первого слоя со своими нулями, справа — веса второго слоя.</p>
    </div>
    <div class="step-panel" data-on="a1 w2 row2" data-focus="row2">
      <div class="step-kicker">Шаг 2 · бесполезные веса</div>
      <h4>Строка 2 матрицы W₂ ни на что не влияет</h4>
      <p>В произведении A₁W₂ строка k матрицы весов умножается на столбец k входа. Столбец 2 у A₁ целиком нулевой, значит четыре веса второй строки W₂ сейчас можно менять как угодно — выход не изменится. В обратном проходе это превратится в нулевую строку градиента.</p>
    </div>
    <div class="step-panel" data-on="a1 w2 b2 z2" data-focus="z2">
      <div class="step-kicker">Шаг 3 · сумма</div>
      <h4>Z₂ = A₁ W₂ + b₂</h4>
      <p>Например, z₂₁ у setosa: 1.874·0.1 + 0.558·0.3 + 2.294·0.4 + 0.3 = 1.572. Смещение b₂ = (0.3, −0.3, −0.2, 0.7) добавлено к каждой строке.</p>
    </div>
    <div class="step-panel" data-on="z2 a2 zeros" data-focus="a2 zeros">
      <div class="step-kicker">Шаг 4 · ReLU</div>
      <h4>Закрыты три клетки</h4>
      <p>У setosa −2.37 и −0.22 в третьем и четвёртом столбце, у второго versicolor −0.09 в третьем. Мёртвых столбцов во втором слое нет: каждый нейрон отвечает хотя бы одному цветку.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> глубокая полносвязная сеть — это несколько одинаково устроенных слоев подряд; соседние слои связаны только требованием, чтобы ширина выхода одного совпала с числом строк весов другого.
</div>

---


## Часть 7. Выходной слой и softmax

<p>
  Последний линейный слой выдаёт по одному числу на класс — <em>логиты</em>. Чтобы сравнить
  их с правильным ответом, их превращают в вероятности функцией softmax, по каждой строке
  отдельно:
</p>
<div class="math-display" data-tex="Z_3 = A_2 W_3 + b_3, \qquad p_{ic} = \frac{e^{z_{ic}}}{\sum_{k=1}^{3} e^{z_{ik}}}"></div>

<div class="callout-red">
  <strong>На практике exp считают со сдвигом.</strong> Если логит равен, скажем, 1000,
  <span class="math-inline" data-tex="e^{1000}"></span> не помещается в float64. Поэтому из каждой
  строки сначала вычитают её максимум: вероятности от этого не меняются, а все экспоненты
  становятся не больше единицы. Наши логиты маленькие, и в сценах сдвиг не показан.
</div>
<div class="stage" id="stage-sm" tabindex="0">
  <div class="stage-figure">
<svg id="sm" viewBox="0 0 960 620" role="img" aria-label="Выходной слой и softmax: логиты превращаются в вероятности по строкам">
<style>
  #sm { font-family: Helvetica, Arial, sans-serif; }
  #sm .cap { font-size: 13px; fill: #5E5850; }
  #sm .lbl { font-size: 16px; fill: #111111; }
  #sm .legend { font-size: 13px; fill: #5E5850; }
  #sm .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #sm .grid { stroke: #ffffff; stroke-width: 1.35; }
  #sm .dim { font-size: 13px; fill: #5E5850; }
  #sm .nm { font-size: 16px; font-weight: 800; }
  #sm .op { font-size: 23px; fill: #5E5850; }
  #sm .arw { font-size: 12px; fill: #5E5850; }
  #sm .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="sm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="sm-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="sm-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="sm-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="348" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="30" y="236" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="398.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 398)">слой 1</text><text x="20.0" y="286.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 286)">слой 2</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sm-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sm-arw)"/><path d="M 125 356 L 125 328" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sm-arw)"/><path d="M 125 292 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sm-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sm-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sm-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sm-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sm-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#sm-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 1</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#C30B0A" text-anchor="middle">Softmax</text><rect x="34" y="122" width="182" height="100" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="lin"><g><rect x="290.0" y="100.0" width="88.0" height="88.0" rx="2" fill="#1B9BC2" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="312.0" y1="100.0" x2="312.0" y2="188.0" class="grid" opacity=".75"/><line x1="334.0" y1="100.0" x2="334.0" y2="188.0" class="grid" opacity=".75"/><line x1="356.0" y1="100.0" x2="356.0" y2="188.0" class="grid" opacity=".75"/><line x1="290.0" y1="122.0" x2="378.0" y2="122.0" class="grid" opacity=".75"/><line x1="290.0" y1="144.0" x2="378.0" y2="144.0" class="grid" opacity=".75"/><line x1="290.0" y1="166.0" x2="378.0" y2="166.0" class="grid" opacity=".75"/></g><text x="334.0" y="92.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="279.0" y="190.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_2"></div></foreignObject><text x="396.0" y="150.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="412.0" y="100.0" width="66.0" height="88.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="434.0" y1="100.0" x2="434.0" y2="188.0" class="grid" opacity=".75"/><line x1="456.0" y1="100.0" x2="456.0" y2="188.0" class="grid" opacity=".75"/><line x1="412.0" y1="122.0" x2="478.0" y2="122.0" class="grid" opacity=".75"/><line x1="412.0" y1="144.0" x2="478.0" y2="144.0" class="grid" opacity=".75"/><line x1="412.0" y1="166.0" x2="478.0" y2="166.0" class="grid" opacity=".75"/></g><text x="445.0" y="92.0" font-size="13" fill="#111111" text-anchor="middle">3</text><foreignObject x="390.0" y="190.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_3"></div></foreignObject><text x="494.0" y="150.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="510.0" y="122.0" width="66.0" height="22.0" rx="2" fill="#C29E08" opacity="0.16" stroke="#C29E08" stroke-width="1" stroke-dasharray="4 3"/><rect x="510.0" y="144.0" width="66.0" height="22.0" rx="2" fill="#C29E08" opacity="0.16" stroke="#C29E08" stroke-width="1" stroke-dasharray="4 3"/><rect x="510.0" y="166.0" width="66.0" height="22.0" rx="2" fill="#C29E08" opacity="0.16" stroke="#C29E08" stroke-width="1" stroke-dasharray="4 3"/></g><g><rect x="510.0" y="100.0" width="66.0" height="22.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="532.0" y1="100.0" x2="532.0" y2="122.0" class="grid" opacity=".75"/><line x1="554.0" y1="100.0" x2="554.0" y2="122.0" class="grid" opacity=".75"/></g><text x="543.0" y="92.0" font-size="13" fill="#111111" text-anchor="middle">3</text><foreignObject x="488.0" y="190.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b_3"></div></foreignObject><text x="592.0" y="150.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="608.0" y="100.0" width="66.0" height="88.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="630.0" y1="100.0" x2="630.0" y2="188.0" class="grid" opacity=".75"/><line x1="652.0" y1="100.0" x2="652.0" y2="188.0" class="grid" opacity=".75"/><line x1="608.0" y1="122.0" x2="674.0" y2="122.0" class="grid" opacity=".75"/><line x1="608.0" y1="144.0" x2="674.0" y2="144.0" class="grid" opacity=".75"/><line x1="608.0" y1="166.0" x2="674.0" y2="166.0" class="grid" opacity=".75"/></g><text x="641.0" y="92.0" font-size="13" fill="#111111" text-anchor="middle">3</text><foreignObject x="586.0" y="190.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_3"></div></foreignObject><text x="690.0" y="138.0" font-size="13" fill="#5E5850" text-anchor="start">логиты: по три</text><text x="690.0" y="156.0" font-size="13" fill="#5E5850" text-anchor="start">числа на цветок</text></g><g data-key="exp"><path d="M 641 226 L 641 262 L 413 262 L 413 296" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#sm-arw)"/><text x="527.0" y="254.0" font-size="12" fill="#5E5850" text-anchor="middle">exp — поэлементно</text><g><rect x="380.0" y="300.0" width="66.0" height="88.0" rx="2" fill="#E88919" opacity="0.35" stroke="#ffffff" stroke-width="1"/><line x1="402.0" y1="300.0" x2="402.0" y2="388.0" class="grid" opacity=".75"/><line x1="424.0" y1="300.0" x2="424.0" y2="388.0" class="grid" opacity=".75"/><line x1="380.0" y1="322.0" x2="446.0" y2="322.0" class="grid" opacity=".75"/><line x1="380.0" y1="344.0" x2="446.0" y2="344.0" class="grid" opacity=".75"/><line x1="380.0" y1="366.0" x2="446.0" y2="366.0" class="grid" opacity=".75"/></g><foreignObject x="358.0" y="392.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="e^{Z_3}"></div></foreignObject></g><g data-key="sum"><text x="470.0" y="352.0" font-size="22" fill="#111111" text-anchor="middle">÷</text><rect x="510" y="300" width="22" height="88" rx="2" fill="#E88919" opacity="0.14" stroke="#E88919" stroke-dasharray="4 3"/><rect x="532" y="300" width="22" height="88" rx="2" fill="#E88919" opacity="0.14" stroke="#E88919" stroke-dasharray="4 3"/><g><rect x="488.0" y="300.0" width="22.0" height="88.0" rx="2" fill="#E88919" opacity="0.5" stroke="#ffffff" stroke-width="1"/><line x1="488.0" y1="322.0" x2="510.0" y2="322.0" class="grid" opacity=".75"/><line x1="488.0" y1="344.0" x2="510.0" y2="344.0" class="grid" opacity=".75"/><line x1="488.0" y1="366.0" x2="510.0" y2="366.0" class="grid" opacity=".75"/></g><foreignObject x="444.0" y="392.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\textstyle\sum_k"></div></foreignObject><text x="499.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">1</text></g><g data-key="p"><text x="560.0" y="352.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="578.0" y="300.0" width="66.0" height="88.0" rx="2" fill="#E88919" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="600.0" y1="300.0" x2="600.0" y2="388.0" class="grid" opacity=".75"/><line x1="622.0" y1="300.0" x2="622.0" y2="388.0" class="grid" opacity=".75"/><line x1="578.0" y1="322.0" x2="644.0" y2="322.0" class="grid" opacity=".75"/><line x1="578.0" y1="344.0" x2="644.0" y2="344.0" class="grid" opacity=".75"/><line x1="578.0" y1="366.0" x2="644.0" y2="366.0" class="grid" opacity=".75"/></g><text x="611.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><foreignObject x="556.0" y="392.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P"></div></foreignObject></g><g data-key="rowsum" data-only="1"><rect x="578.0" y="300.0" width="66.0" height="22.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="660.0" y="316.0" font-size="13" fill="#C06F0E" text-anchor="start" font-weight="700">p₁ + p₂ + p₃ = 1</text><text x="660.0" y="336.0" font-size="13" fill="#5E5850" text-anchor="start">в каждой строке</text></g><g data-key="argmax" data-only="1"><rect x="600.0" y="300.0" width="22.0" height="22.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="622.0" y="322.0" width="22.0" height="22.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="600.0" y="344.0" width="22.0" height="22.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="600.0" y="366.0" width="22.0" height="22.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="660.0" y="360.0" font-size="13" fill="#C30B0A" text-anchor="start">ответ сети — номер</text><text x="660.0" y="378.0" font-size="13" fill="#C30B0A" text-anchor="start">самой большой клетки строки</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="450.0" width="650.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="p_{ic} = \dfrac{e^{z_{ic}}}{\sum_{k=1}^{3} e^{z_{ik}}}"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — то, что пересчитывается на каждом батче · оранжевое — вероятности</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl lin" data-focus="hl lin">
      <div class="step-kicker">Шаг 1 · последний линейный слой</div>
      <h4>4 → 3, и без ReLU</h4>
      <p><code>A₂ [4 × 4] · W₃ [4 × 3] + b₃ = Z₃ [4 × 3]</code>. Три столбца — три сорта ириса. ReLU здесь нет намеренно: обнуление отрицательных логитов лишило бы модель возможности сказать «точно не этот класс».</p>
    </div>
    <div class="step-panel" data-on="hl lin exp" data-focus="exp">
      <div class="step-kicker">Шаг 2 · экспонента</div>
      <h4>Все числа становятся положительными</h4>
      <p>Экспонента сохраняет порядок (больший логит — больше число) и превращает любое число в положительное. Отрицательный логит даёт число меньше 1, положительный — больше.</p>
    </div>
    <div class="step-panel" data-on="hl exp sum f" data-focus="sum f">
      <div class="step-kicker">Шаг 3 · нормировка</div>
      <h4>Делим каждую клетку на сумму своей строки</h4>
      <p>Сумма берётся по классам, то есть по строке: столбец <code>[4 × 1]</code> растягивается на три столбца и делит всё поэлементно. Объекты друг на друга не влияют.</p>
    </div>
    <div class="step-panel" data-on="hl exp sum p rowsum" data-focus="p rowsum">
      <div class="step-kicker">Шаг 4 · распределение</div>
      <h4>Каждая строка P — вероятности трёх классов</h4>
      <p>Числа от 0 до 1, в строке в сумме ровно 1. Форма не изменилась: <code>[4 × 3]</code>.</p>
    </div>
    <div class="step-panel" data-on="hl p argmax" data-focus="argmax">
      <div class="step-kicker">Шаг 5 · ответ</div>
      <h4>Класс — это argmax строки</h4>
      <p>Для предсказания softmax даже не нужен: argmax логитов и вероятностей совпадает. Softmax нужен для обучения — чтобы было что подставить в логарифм потери.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Логиты, экспоненты, суммы строк и вероятности. Вероятности даны с четырьмя знаками — они понадобятся в потере.</p>
<div class="stage" id="stage-smn" tabindex="0">
  <div class="stage-figure">
<svg id="smn" viewBox="0 0 960 570" role="img" aria-label="Числовой расчёт логитов и softmax">
<style>
  #smn { font-family: Helvetica, Arial, sans-serif; }
  #smn .cap { font-size: 13px; fill: #5E5850; }
  #smn .lbl { font-size: 16px; fill: #111111; }
  #smn .legend { font-size: 13px; fill: #5E5850; }
  #smn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #smn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #smn .dim { font-size: 13px; fill: #5E5850; }
  #smn .nm { font-size: 16px; font-weight: 800; }
  #smn .op { font-size: 23px; fill: #5E5850; }
  #smn .arw { font-size: 12px; fill: #5E5850; }
  #smn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="smn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="smn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="smn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="smn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: логиты Z₃ и вероятности P</text><g data-key="lin"><g><rect x="116.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#1B9BC2" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="133.0" y1="70.0" x2="133.0" y2="138.0" class="grid" opacity=".75"/><line x1="150.0" y1="70.0" x2="150.0" y2="138.0" class="grid" opacity=".75"/><line x1="167.0" y1="70.0" x2="167.0" y2="138.0" class="grid" opacity=".75"/><line x1="116.0" y1="87.0" x2="184.0" y2="87.0" class="grid" opacity=".75"/><line x1="116.0" y1="104.0" x2="184.0" y2="104.0" class="grid" opacity=".75"/><line x1="116.0" y1="121.0" x2="184.0" y2="121.0" class="grid" opacity=".75"/></g><text x="150.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="106.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="60.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_2"></div></foreignObject><foreignObject x="30.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.57 &amp; 0.80 &amp; 0.00 &amp; 0.00 \\ 0.50 &amp; 0.62 &amp; 0.50 &amp; 0.85 \\ 0.30 &amp; 0.91 &amp; 0.02 &amp; 0.92 \\ 0.30 &amp; 0.30 &amp; 0.00 &amp; 0.81\end{bmatrix}"></div></foreignObject><text x="292.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="394.5" y="70.0" width="51.0" height="68.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="411.5" y1="70.0" x2="411.5" y2="138.0" class="grid" opacity=".75"/><line x1="428.5" y1="70.0" x2="428.5" y2="138.0" class="grid" opacity=".75"/><line x1="394.5" y1="87.0" x2="445.5" y2="87.0" class="grid" opacity=".75"/><line x1="394.5" y1="104.0" x2="445.5" y2="104.0" class="grid" opacity=".75"/><line x1="394.5" y1="121.0" x2="445.5" y2="121.0" class="grid" opacity=".75"/></g><text x="420.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="384.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="330.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_3"></div></foreignObject><foreignObject x="325.0" y="168.0" width="190.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.3 &amp; 0.0 &amp; -0.9 \\ -0.1 &amp; 0.4 &amp; 0.2 \\ -0.9 &amp; -0.3 &amp; 0.4 \\ -0.6 &amp; 0.0 &amp; -0.2\end{bmatrix}"></div></foreignObject><text x="540.0" y="86.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="654.5" y="70.0" width="51.0" height="17.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="671.5" y1="70.0" x2="671.5" y2="87.0" class="grid" opacity=".75"/><line x1="688.5" y1="70.0" x2="688.5" y2="87.0" class="grid" opacity=".75"/></g><text x="680.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="644.5" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="590.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b_3"></div></foreignObject><foreignObject x="585.0" y="117.0" width="190.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.3 &amp; -0.5 &amp; -0.1\end{bmatrix}"></div></foreignObject></g><g data-key="z3"><g><rect x="104.5" y="300.0" width="51.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="121.5" y1="300.0" x2="121.5" y2="368.0" class="grid" opacity=".75"/><line x1="138.5" y1="300.0" x2="138.5" y2="368.0" class="grid" opacity=".75"/><line x1="104.5" y1="317.0" x2="155.5" y2="317.0" class="grid" opacity=".75"/><line x1="104.5" y1="334.0" x2="155.5" y2="334.0" class="grid" opacity=".75"/><line x1="104.5" y1="351.0" x2="155.5" y2="351.0" class="grid" opacity=".75"/></g><text x="130.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="94.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="40.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_3"></div></foreignObject><foreignObject x="30.0" y="398.0" width="200.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.85 &amp; -0.18 &amp; -1.36 \\ -1.47 &amp; -0.40 &amp; -0.40 \\ -1.05 &amp; -0.14 &amp; -0.36 \\ -0.91 &amp; -0.38 &amp; -0.47\end{bmatrix}"></div></foreignObject></g><g data-key="e"><text x="252.0" y="330.0" font-size="13" fill="#5E5850" text-anchor="middle">exp</text><path d="M 236.0 338.0 L 270.0 338.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#smn-arw)"/><g><rect x="344.5" y="300.0" width="51.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="361.5" y1="300.0" x2="361.5" y2="368.0" class="grid" opacity=".75"/><line x1="378.5" y1="300.0" x2="378.5" y2="368.0" class="grid" opacity=".75"/><line x1="344.5" y1="317.0" x2="395.5" y2="317.0" class="grid" opacity=".75"/><line x1="344.5" y1="334.0" x2="395.5" y2="334.0" class="grid" opacity=".75"/><line x1="344.5" y1="351.0" x2="395.5" y2="351.0" class="grid" opacity=".75"/></g><text x="370.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="334.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="280.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="e^{Z_3}"></div></foreignObject><foreignObject x="255.0" y="398.0" width="230.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.4267 &amp; 0.8349 &amp; 0.2578 \\ 0.2298 &amp; 0.6688 &amp; 0.6725 \\ 0.3493 &amp; 0.8683 &amp; 0.6953 \\ 0.4041 &amp; 0.6846 &amp; 0.6242\end{bmatrix}"></div></foreignObject></g><g data-key="s"><text x="500.0" y="338.0" font-size="22" fill="#111111" text-anchor="middle">÷</text><g><rect x="571.5" y="300.0" width="17.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="571.5" y1="317.0" x2="588.5" y2="317.0" class="grid" opacity=".75"/><line x1="571.5" y1="334.0" x2="588.5" y2="334.0" class="grid" opacity=".75"/><line x1="571.5" y1="351.0" x2="588.5" y2="351.0" class="grid" opacity=".75"/></g><text x="580.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="561.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="490.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\textstyle\sum_k"></div></foreignObject><foreignObject x="530.0" y="398.0" width="100.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.5194 \\ 1.5711 \\ 1.9128 \\ 1.7129\end{bmatrix}"></div></foreignObject></g><g data-key="p"><text x="650.0" y="338.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="764.5" y="300.0" width="51.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="781.5" y1="300.0" x2="781.5" y2="368.0" class="grid" opacity=".75"/><line x1="798.5" y1="300.0" x2="798.5" y2="368.0" class="grid" opacity=".75"/><line x1="764.5" y1="317.0" x2="815.5" y2="317.0" class="grid" opacity=".75"/><line x1="764.5" y1="334.0" x2="815.5" y2="334.0" class="grid" opacity=".75"/><line x1="764.5" y1="351.0" x2="815.5" y2="351.0" class="grid" opacity=".75"/></g><text x="790.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="754.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="700.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P"></div></foreignObject><foreignObject x="675.0" y="398.0" width="230.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2808 &amp; 0.5495 &amp; 0.1697 \\ 0.1463 &amp; 0.4257 &amp; 0.4280 \\ 0.1826 &amp; 0.4539 &amp; 0.3635 \\ 0.2359 &amp; 0.3997 &amp; 0.3644\end{bmatrix}"></div></foreignObject></g><g data-key="pred" data-only="1"><rect x="781.5" y="300.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="798.5" y="317.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="781.5" y="334.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="781.5" y="351.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="480.0" y="545.0" font-size="13" fill="#C30B0A" text-anchor="middle">argmax: versicolor, virginica, versicolor, versicolor · правильно: setosa, versicolor, virginica, versicolor</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="lin z3" data-focus="lin z3">
      <div class="step-kicker">Шаг 1 · логиты</div>
      <h4>Z₃ = A₂ W₃ + b₃</h4>
      <p>Все двенадцать логитов отрицательные — это нормально: важны не их знаки, а разности внутри строки. Сдвиг всей строки на константу вероятностей не меняет.</p>
    </div>
    <div class="step-panel" data-on="z3 e" data-focus="e">
      <div class="step-kicker">Шаг 2 · exp</div>
      <h4>e^(−0.85) = 0.4267, e^(−0.18) = 0.8349, e^(−1.36) = 0.2578</h4>
      <p>Первая строка — setosa. Больший логит даёт большее число, отрицательные логиты дают числа меньше единицы.</p>
    </div>
    <div class="step-panel" data-on="e s" data-focus="s">
      <div class="step-kicker">Шаг 3 · суммы строк</div>
      <h4>1.5194, 1.5711, 1.9128, 1.7129</h4>
      <p>На это число делится вся строка. Сумма у каждого объекта своя.</p>
    </div>
    <div class="step-panel" data-on="e s p" data-focus="p">
      <div class="step-kicker">Шаг 4 · вероятности</div>
      <h4>0.4267 / 1.5194 = 0.2808</h4>
      <p>У setosa: 0.2808 / 0.5495 / 0.1697. Модель считает её скорее versicolor — веса-то случайные. Строки P суммируются ровно в 1.</p>
    </div>
    <div class="step-panel" data-on="p pred" data-focus="pred">
      <div class="step-kicker">Шаг 5 · ответ</div>
      <h4>Угадан один цветок из четырёх</h4>
      <p>Правильно назван только последний versicolor. Необученная сеть и не должна угадывать: её 64 числа ещё никто не подбирал. Обучение начнётся с того, что это «плохо» надо выразить одним числом.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> softmax превращает каждую строку логитов в распределение по классам — неотрицательные числа с суммой 1; форма <code>[B × C]</code> при этом не меняется.
</div>

---


## Часть 8. Кросс-энтропия

<p>
  Потеря должна свести всю матрицу P к одному числу, которое тем меньше, чем выше
  вероятность правильного класса. Кросс-энтропия берёт из каждой строки ровно эту вероятность,
  логарифмирует и усредняет по батчу:
</p>
<div class="math-display" data-tex="L = -\frac{1}{B}\sum_{i=1}^{B} \log p_{i,\,y_i} = -\frac{1}{B}\sum_{i=1}^{B}\sum_{c=1}^{3} Y_{ic}\,\log p_{ic}"></div>

<p>
  Вторая запись с one-hot матрицей <code>Y</code> длиннее, но удобна: она показывает, что
  потеря — поэлементное произведение двух матриц одной формы, и из неё сразу получается
  градиент.
</p>
<div class="stage" id="stage-ce" tabindex="0">
  <div class="stage-figure">
<svg id="ce" viewBox="0 0 960 620" role="img" aria-label="Кросс-энтропия: из каждой строки берётся вероятность правильного класса, минус логарифм, среднее">
<style>
  #ce { font-family: Helvetica, Arial, sans-serif; }
  #ce .cap { font-size: 13px; fill: #5E5850; }
  #ce .lbl { font-size: 16px; fill: #111111; }
  #ce .legend { font-size: 13px; fill: #5E5850; }
  #ce .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #ce .grid { stroke: #ffffff; stroke-width: 1.35; }
  #ce .dim { font-size: 13px; fill: #5E5850; }
  #ce .nm { font-size: 16px; font-weight: 800; }
  #ce .op { font-size: 23px; fill: #5E5850; }
  #ce .arw { font-size: 12px; fill: #5E5850; }
  #ce .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="ce-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="ce-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="ce-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="ce-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><rect x="30" y="348" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="30" y="236" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="398.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 398)">слой 1</text><text x="20.0" y="286.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 286)">слой 2</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ce-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ce-arw)"/><path d="M 125 356 L 125 328" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ce-arw)"/><path d="M 125 292 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ce-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ce-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ce-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ce-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ce-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ce-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 1</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#C30B0A" text-anchor="middle">Cross-Entropy</text><rect x="34" y="70" width="182" height="44" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="py"><g><rect x="290.0" y="110.0" width="78.0" height="104.0" rx="2" fill="#E88919" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="316.0" y1="110.0" x2="316.0" y2="214.0" class="grid" opacity=".75"/><line x1="342.0" y1="110.0" x2="342.0" y2="214.0" class="grid" opacity=".75"/><line x1="290.0" y1="136.0" x2="368.0" y2="136.0" class="grid" opacity=".75"/><line x1="290.0" y1="162.0" x2="368.0" y2="162.0" class="grid" opacity=".75"/><line x1="290.0" y1="188.0" x2="368.0" y2="188.0" class="grid" opacity=".75"/></g><text x="329.0" y="102.0" font-size="13" fill="#111111" text-anchor="middle">3</text><foreignObject x="274.0" y="218.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P"></div></foreignObject><text x="390.0" y="172.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="408.0" y="110.0" width="78.0" height="104.0" rx="2" fill="#9A9489" opacity="0.3" stroke="#ffffff" stroke-width="1"/><line x1="434.0" y1="110.0" x2="434.0" y2="214.0" class="grid" opacity=".75"/><line x1="460.0" y1="110.0" x2="460.0" y2="214.0" class="grid" opacity=".75"/><line x1="408.0" y1="136.0" x2="486.0" y2="136.0" class="grid" opacity=".75"/><line x1="408.0" y1="162.0" x2="486.0" y2="162.0" class="grid" opacity=".75"/><line x1="408.0" y1="188.0" x2="486.0" y2="188.0" class="grid" opacity=".75"/></g><rect x="409" y="111" width="24" height="24" rx="1" fill="#5E5850" opacity="0.75"/><rect x="435" y="137" width="24" height="24" rx="1" fill="#5E5850" opacity="0.75"/><rect x="461" y="163" width="24" height="24" rx="1" fill="#5E5850" opacity="0.75"/><rect x="435" y="189" width="24" height="24" rx="1" fill="#5E5850" opacity="0.75"/><text x="447.0" y="102.0" font-size="13" fill="#111111" text-anchor="middle">3</text><foreignObject x="392.0" y="218.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><text x="447.0" y="264.0" font-size="12" fill="#5E5850" text-anchor="middle">one-hot</text></g><g data-key="pick"><path d="M 490.0 162.0 L 530.0 162.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ce-arw)"/><text x="510.0" y="152.0" font-size="12" fill="#5E5850" text-anchor="middle">выбрать</text><g><rect x="536.0" y="110.0" width="26.0" height="104.0" rx="2" fill="#E88919" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="536.0" y1="136.0" x2="562.0" y2="136.0" class="grid" opacity=".75"/><line x1="536.0" y1="162.0" x2="562.0" y2="162.0" class="grid" opacity=".75"/><line x1="536.0" y1="188.0" x2="562.0" y2="188.0" class="grid" opacity=".75"/></g><foreignObject x="494.0" y="218.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="p_{i,y_i}"></div></foreignObject></g><g data-key="log"><path d="M 566.0 162.0 L 616.0 162.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ce-arw)"/><text x="591.0" y="152.0" font-size="12" fill="#5E5850" text-anchor="middle">−log</text><g><rect x="622.0" y="110.0" width="26.0" height="104.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="622.0" y1="136.0" x2="648.0" y2="136.0" class="grid" opacity=".75"/><line x1="622.0" y1="162.0" x2="648.0" y2="162.0" class="grid" opacity=".75"/><line x1="622.0" y1="188.0" x2="648.0" y2="188.0" class="grid" opacity=".75"/></g><foreignObject x="580.0" y="218.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\ell_i"></div></foreignObject><line x1="300" y1="510" x2="620" y2="510" stroke="#8A857C" stroke-width="1.2"/><line x1="300" y1="510" x2="300" y2="300" stroke="#8A857C" stroke-width="1.2"/><polyline points="306.0,314.4 309.7,338.5 313.4,354.7 317.2,367.0 320.9,376.8 324.6,385.0 328.3,392.0 332.1,398.2 335.8,403.7 339.5,408.6 343.2,413.1 346.9,417.3 350.7,421.1 354.4,424.6 358.1,427.9 361.8,431.0 365.5,433.9 369.3,436.7 373.0,439.3 376.7,441.8 380.4,444.2 384.2,446.4 387.9,448.6 391.6,450.7 395.3,452.7 399.0,454.6 402.8,456.4 406.5,458.2 410.2,459.9 413.9,461.6 417.6,463.2 421.4,464.8 425.1,466.3 428.8,467.7 432.5,469.2 436.3,470.5 440.0,471.9 443.7,473.2 447.4,474.5 451.1,475.7 454.9,476.9 458.6,478.1 462.3,479.3 466.0,480.4 469.7,481.5 473.5,482.6 477.2,483.7 480.9,484.7 484.6,485.7 488.4,486.7 492.1,487.7 495.8,488.7 499.5,489.6 503.2,490.5 507.0,491.4 510.7,492.3 514.4,493.2 518.1,494.1 521.8,494.9 525.6,495.7 529.3,496.6 533.0,497.4 536.7,498.2 540.5,498.9 544.2,499.7 547.9,500.5 551.6,501.2 555.3,501.9 559.1,502.7 562.8,503.4 566.5,504.1 570.2,504.8 573.9,505.5 577.7,506.1 581.4,506.8 585.1,507.5 588.8,508.1 592.6,508.7 596.3,509.4 600.0,510.0" fill="none" stroke="#C30B0A" stroke-width="2.6"/><text x="600.0" y="528.0" font-size="12" fill="#5E5850" text-anchor="middle">p = 1</text><text x="314.0" y="528.0" font-size="12" fill="#5E5850" text-anchor="middle">0</text><text x="308.0" y="312.0" font-size="12" fill="#5E5850" text-anchor="start">−log p</text><text x="340.0" y="340.0" font-size="12" fill="#C30B0A" text-anchor="start">p → 0: штраф → ∞</text><text x="500.0" y="490.0" font-size="12" fill="#C30B0A" text-anchor="start">p → 1: штраф → 0</text></g><g data-key="mean"><path d="M 652.0 162.0 L 710.0 162.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ce-arw)"/><text x="681.0" y="152.0" font-size="12" fill="#5E5850" text-anchor="middle">среднее</text><g><rect x="716.0" y="149.0" width="26.0" height="26.0" rx="2" fill="#C30B0A" opacity="0.62" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="674.0" y="180.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L"></div></foreignObject><text x="760.0" y="168.0" font-size="13" fill="#5E5850" text-anchor="start">одно число</text></g><g data-key="lnC" data-only="1"><line x1="400" y1="510" x2="400" y2="455.1" stroke="#3576C0" stroke-width="1.4" stroke-dasharray="5 4"/><line x1="300" y1="455.1" x2="400" y2="455.1" stroke="#3576C0" stroke-width="1.4" stroke-dasharray="5 4"/><text x="406.0" y="447.1" font-size="12" fill="#3576C0" text-anchor="start" font-weight="700">p = 1/3 → ln 3 ≈ 1.10</text><text x="680.0" y="330.0" font-size="13" fill="#3576C0" text-anchor="start">сеть, которая ничего не знает,</text><text x="680.0" y="348.0" font-size="13" fill="#3576C0" text-anchor="start">отвечает 1/3 на всё</text><text x="680.0" y="366.0" font-size="13" fill="#3576C0" text-anchor="start">и получает L = ln 3</text></g><g data-key="f" data-only="1"><foreignObject x="660.0" y="420.0" width="290.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L = -\dfrac{1}{B}\sum_{i=1}^{B} \log p_{i,\,y_i}"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">P — вероятности · Y — правильные ответы · красное — штраф</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl py" data-focus="hl py">
      <div class="step-kicker">Шаг 1 · две матрицы</div>
      <h4>Что предсказано и что должно быть</h4>
      <p>Правильный ответ записан в той же форме, что и предсказание: <code>Y [4 × 3]</code>, в каждой строке одна единица на правильном классе. Такая запись называется one-hot.</p>
    </div>
    <div class="step-panel" data-on="hl py pick" data-focus="pick">
      <div class="step-kicker">Шаг 2 · выбор</div>
      <h4>Из строки нужна одна клетка</h4>
      <p>Потеря смотрит только на вероятность, которую сеть дала <em>правильному</em> классу. Поэлементное произведение с Y и сумма по строке вырезают ровно её: получается столбец <code>[4 × 1]</code>.</p>
    </div>
    <div class="step-panel" data-on="hl pick log" data-focus="log">
      <div class="step-kicker">Шаг 3 · логарифм</div>
      <h4>Штраф −log p</h4>
      <p>Уверенно верный ответ (p близко к 1) почти ничего не стоит, уверенно неверный (p близко к 0) стоит очень дорого. Штраф у каждого объекта свой.</p>
    </div>
    <div class="step-panel" data-on="hl log mean f" data-focus="mean f">
      <div class="step-kicker">Шаг 4 · среднее</div>
      <h4>Батч сворачивается в одно число</h4>
      <p>Среднее по B объектам, а не сумма — чтобы величина потери и градиента не зависела от размера батча. Это деление на B ещё встретится в первой же формуле обратного прохода.</p>
    </div>
    <div class="step-panel" data-on="hl log mean lnC" data-focus="lnC">
      <div class="step-kicker">Шаг 5 · ориентир</div>
      <h4>С чем сравнивать L</h4>
      <p>Если сеть отвечает всем классам 1/3, потеря равна ln 3 ≈ 1.0986 на любом батче. Потеря заметно ниже — сеть что-то выучила; около ln 3 — не знает ничего; выше — уверенно ошибается.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Вероятности правильных классов, штрафы и их среднее.</p>
<div class="stage" id="stage-cen" tabindex="0">
  <div class="stage-figure">
<svg id="cen" viewBox="0 0 960 470" role="img" aria-label="Числовой расчёт кросс-энтропии">
<style>
  #cen { font-family: Helvetica, Arial, sans-serif; }
  #cen .cap { font-size: 13px; fill: #5E5850; }
  #cen .lbl { font-size: 16px; fill: #111111; }
  #cen .legend { font-size: 13px; fill: #5E5850; }
  #cen .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #cen .grid { stroke: #ffffff; stroke-width: 1.35; }
  #cen .dim { font-size: 13px; fill: #5E5850; }
  #cen .nm { font-size: 16px; font-weight: 800; }
  #cen .op { font-size: 23px; fill: #5E5850; }
  #cen .arw { font-size: 12px; fill: #5E5850; }
  #cen .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="cen-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="cen-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="cen-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="cen-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: потеря на батче из четырёх цветков</text><g data-key="p"><g><rect x="124.5" y="70.0" width="51.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="141.5" y1="70.0" x2="141.5" y2="138.0" class="grid" opacity=".75"/><line x1="158.5" y1="70.0" x2="158.5" y2="138.0" class="grid" opacity=".75"/><line x1="124.5" y1="87.0" x2="175.5" y2="87.0" class="grid" opacity=".75"/><line x1="124.5" y1="104.0" x2="175.5" y2="104.0" class="grid" opacity=".75"/><line x1="124.5" y1="121.0" x2="175.5" y2="121.0" class="grid" opacity=".75"/></g><text x="150.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="114.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="60.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P"></div></foreignObject><foreignObject x="30.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2808 &amp; 0.5495 &amp; 0.1697 \\ 0.1463 &amp; 0.4257 &amp; 0.4280 \\ 0.1826 &amp; 0.4539 &amp; 0.3635 \\ 0.2359 &amp; 0.3997 &amp; 0.3644\end{bmatrix}"></div></foreignObject></g><g data-key="y"><text x="292.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="374.5" y="70.0" width="51.0" height="68.0" rx="2" fill="#9A9489" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="391.5" y1="70.0" x2="391.5" y2="138.0" class="grid" opacity=".75"/><line x1="408.5" y1="70.0" x2="408.5" y2="138.0" class="grid" opacity=".75"/><line x1="374.5" y1="87.0" x2="425.5" y2="87.0" class="grid" opacity=".75"/><line x1="374.5" y1="104.0" x2="425.5" y2="104.0" class="grid" opacity=".75"/><line x1="374.5" y1="121.0" x2="425.5" y2="121.0" class="grid" opacity=".75"/></g><text x="400.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="364.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="310.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><foreignObject x="325.0" y="168.0" width="150.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 &amp; 0 &amp; 0 \\ 0 &amp; 1 &amp; 0 \\ 0 &amp; 0 &amp; 1 \\ 0 &amp; 1 &amp; 0\end{bmatrix}"></div></foreignObject></g><g data-key="pick"><path d="M 485.0 104.0 L 525.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#cen-arw)"/><g><rect x="571.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="571.5" y1="87.0" x2="588.5" y2="87.0" class="grid" opacity=".75"/><line x1="571.5" y1="104.0" x2="588.5" y2="104.0" class="grid" opacity=".75"/><line x1="571.5" y1="121.0" x2="588.5" y2="121.0" class="grid" opacity=".75"/></g><text x="580.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="561.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="490.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="p_{i,y_i}"></div></foreignObject><foreignObject x="530.0" y="168.0" width="100.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2808 \\ 0.4257 \\ 0.3635 \\ 0.3997\end{bmatrix}"></div></foreignObject></g><g data-key="l"><text x="650.0" y="94.0" font-size="12" fill="#5E5850" text-anchor="middle">−log</text><path d="M 632.0 104.0 L 668.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#cen-arw)"/><g><rect x="711.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="711.5" y1="87.0" x2="728.5" y2="87.0" class="grid" opacity=".75"/><line x1="711.5" y1="104.0" x2="728.5" y2="104.0" class="grid" opacity=".75"/><line x1="711.5" y1="121.0" x2="728.5" y2="121.0" class="grid" opacity=".75"/></g><text x="720.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="701.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="630.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\ell_i"></div></foreignObject><foreignObject x="670.0" y="168.0" width="100.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.2699 \\ 0.8540 \\ 1.0121 \\ 0.9171\end{bmatrix}"></div></foreignObject></g><g data-key="L"><path d="M 772.0 104.0 L 808.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#cen-arw)"/><g><rect x="851.5" y="95.0" width="17.0" height="17.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/></g><text x="860.0" y="87.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="841.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="770.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L"></div></foreignObject><foreignObject x="810.0" y="142.0" width="100.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.0133\end{bmatrix}"></div></foreignObject></g><g data-key="sum" data-only="1"><foreignObject x="20.0" y="300.0" width="920.0" height="50.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L = \dfrac{1.2699 + 0.8540 + 1.0121 + 0.9171}{4} = 1.0133"></div></foreignObject></g><g data-key="ref" data-only="1"><foreignObject x="20.0" y="360.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\ln 3 = 1.0986 \qquad L = 1.0133 \quad (\text{на } 0.085 \text{ ниже})"></div></foreignObject><text x="480.0" y="425.0" font-size="13" fill="#3576C0" text-anchor="middle">почти равномерный ответ: сеть ещё ничего не выучила, а угаданный versicolor — случайность</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="p y" data-focus="p y">
      <div class="step-kicker">Шаг 1 · P и Y</div>
      <h4>Предсказание и one-hot ответ</h4>
      <p>Правильные классы — 0, 1, 2, 1: setosa, versicolor, virginica, versicolor.</p>
    </div>
    <div class="step-panel" data-on="p y pick" data-focus="pick">
      <div class="step-kicker">Шаг 2 · нужные клетки</div>
      <h4>0.2808, 0.4257, 0.3635, 0.3997</h4>
      <p>Ни одна вероятность правильного класса не дотягивает до половины. Хуже всего с setosa: ей досталось 0.28.</p>
    </div>
    <div class="step-panel" data-on="pick l" data-focus="l">
      <div class="step-kicker">Шаг 3 · штрафы</div>
      <h4>−ln 0.2808 = 1.2699</h4>
      <p>Самый дорогой объект — setosa, самый дешёвый — первый versicolor (0.8540). Угаданный четвёртый цветок всё равно штрафуется на 0.9171: верный argmax при вероятности 0.40 — не повод для нулевой потери.</p>
    </div>
    <div class="step-panel" data-on="l L sum" data-focus="L sum">
      <div class="step-kicker">Шаг 4 · среднее</div>
      <h4>L = 1.0133</h4>
      <p>Это число и будет уменьшать обучение. Всё, что мы делали до сих пор, — цепочка вычислений от 64 параметров до этого одного числа.</p>
    </div>
    <div class="step-panel" data-on="L ref" data-focus="ref">
      <div class="step-kicker">Шаг 5 · ориентир</div>
      <h4>Почти ln 3</h4>
      <p>Разница с равномерным ответом всего 0.085. Случайно инициализированная сеть и должна быть где-то здесь; если бы на старте получилось, например, 3 или 5, это был бы признак слишком крупных начальных весов.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> кросс-энтропия смотрит только на вероятность правильного класса; ориентир для C классов — <span class="math-inline" data-tex="\ln C"></span>, и необученная сеть должна давать что-то близкое к нему.
</div>

---


## Часть 9. Что ломается без нелинейности

<p>
  Зачем вообще ReLU между слоями? Проверим от противного: уберём обе активации и посмотрим,
  во что превратится сеть. Умножение матриц ассоциативно, поэтому скобки можно раскрыть:
</p>
<div class="math-display" data-tex="((X W_1 + b_1) W_2 + b_2) W_3 + b_3 = X\,\underbrace{W_1 W_2 W_3}_{W_{eff}} + \underbrace{b_1 W_2 W_3 + b_2 W_3 + b_3}_{b_{eff}}"></div>
<div class="stage" id="stage-nl" tabindex="0">
  <div class="stage-figure">
<svg id="nl" viewBox="0 0 960 620" role="img" aria-label="Без ReLU три линейных слоя схлопываются в одну матрицу">
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
<g transform="translate(10,60)"><rect x="30" y="348" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="30" y="236" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="398.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 398)">слой 1</text><text x="20.0" y="286.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 286)">слой 2</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 356 L 125 328" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 292 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#nl-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 1</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#C30B0A" text-anchor="middle">ReLU</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#C30B0A" text-anchor="middle">ReLU</text><rect x="34" y="238" width="182" height="154" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="chain"><g><rect x="290.0" y="110.0" width="130.0" height="104.0" rx="2" fill="#7B4AB5" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="316.0" y1="110.0" x2="316.0" y2="214.0" class="grid" opacity=".75"/><line x1="342.0" y1="110.0" x2="342.0" y2="214.0" class="grid" opacity=".75"/><line x1="368.0" y1="110.0" x2="368.0" y2="214.0" class="grid" opacity=".75"/><line x1="394.0" y1="110.0" x2="394.0" y2="214.0" class="grid" opacity=".75"/><line x1="290.0" y1="136.0" x2="420.0" y2="136.0" class="grid" opacity=".75"/><line x1="290.0" y1="162.0" x2="420.0" y2="162.0" class="grid" opacity=".75"/><line x1="290.0" y1="188.0" x2="420.0" y2="188.0" class="grid" opacity=".75"/></g><text x="355.0" y="102.0" font-size="13" fill="#111111" text-anchor="middle">5</text><foreignObject x="300.0" y="218.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_1"></div></foreignObject><text x="434.0" y="168.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="450.0" y="97.0" width="104.0" height="130.0" rx="2" fill="#1B9BC2" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="476.0" y1="97.0" x2="476.0" y2="227.0" class="grid" opacity=".75"/><line x1="502.0" y1="97.0" x2="502.0" y2="227.0" class="grid" opacity=".75"/><line x1="528.0" y1="97.0" x2="528.0" y2="227.0" class="grid" opacity=".75"/><line x1="450.0" y1="123.0" x2="554.0" y2="123.0" class="grid" opacity=".75"/><line x1="450.0" y1="149.0" x2="554.0" y2="149.0" class="grid" opacity=".75"/><line x1="450.0" y1="175.0" x2="554.0" y2="175.0" class="grid" opacity=".75"/><line x1="450.0" y1="201.0" x2="554.0" y2="201.0" class="grid" opacity=".75"/></g><text x="502.0" y="89.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="447.0" y="231.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_2"></div></foreignObject><text x="568.0" y="168.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="584.0" y="110.0" width="78.0" height="104.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="610.0" y1="110.0" x2="610.0" y2="214.0" class="grid" opacity=".75"/><line x1="636.0" y1="110.0" x2="636.0" y2="214.0" class="grid" opacity=".75"/><line x1="584.0" y1="136.0" x2="662.0" y2="136.0" class="grid" opacity=".75"/><line x1="584.0" y1="162.0" x2="662.0" y2="162.0" class="grid" opacity=".75"/><line x1="584.0" y1="188.0" x2="662.0" y2="188.0" class="grid" opacity=".75"/></g><text x="623.0" y="102.0" font-size="13" fill="#111111" text-anchor="middle">3</text><foreignObject x="568.0" y="218.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_3"></div></foreignObject></g><g data-key="eff"><text x="686.0" y="168.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="704.0" y="110.0" width="78.0" height="104.0" rx="2" fill="#3576C0" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="730.0" y1="110.0" x2="730.0" y2="214.0" class="grid" opacity=".75"/><line x1="756.0" y1="110.0" x2="756.0" y2="214.0" class="grid" opacity=".75"/><line x1="704.0" y1="136.0" x2="782.0" y2="136.0" class="grid" opacity=".75"/><line x1="704.0" y1="162.0" x2="782.0" y2="162.0" class="grid" opacity=".75"/><line x1="704.0" y1="188.0" x2="782.0" y2="188.0" class="grid" opacity=".75"/></g><text x="743.0" y="102.0" font-size="13" fill="#111111" text-anchor="middle">3</text><foreignObject x="688.0" y="218.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_{eff}"></div></foreignObject><text x="800.0" y="150.0" font-size="13" fill="#5E5850" text-anchor="start">[4 × 3] —</text><text x="800.0" y="168.0" font-size="13" fill="#5E5850" text-anchor="start">как у одного</text><text x="800.0" y="186.0" font-size="13" fill="#5E5850" text-anchor="start">слоя 4 → 3</text></g><g data-key="bias"><foreignObject x="290.0" y="270.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b_{eff} = b_1 W_2 W_3 + b_2 W_3 + b_3 \quad [1 \times 3]"></div></foreignObject></g><g data-key="count"><rect x="300" y="336" width="384" height="26" rx="3" fill="#8A857C" opacity="0.55"/><text x="310.0" y="354.0" font-size="13" fill="#FFFFFF" text-anchor="start" font-weight="800">три слоя без ReLU: 64 параметра</text><rect x="300" y="370" width="90" height="26" rx="3" fill="#3576C0" opacity="0.85"/><text x="400.0" y="388.0" font-size="13" fill="#3576C0" text-anchor="start" font-weight="700">один слой: 15 параметров — умеет ровно то же</text></g><g data-key="relu" data-only="1"><g><rect x="310.0" y="430.0" width="80.0" height="80.0" rx="2" fill="#E4E1D7" opacity="1.0" stroke="#ffffff" stroke-width="1"/><line x1="326.0" y1="430.0" x2="326.0" y2="510.0" class="grid" opacity=".75"/><line x1="342.0" y1="430.0" x2="342.0" y2="510.0" class="grid" opacity=".75"/><line x1="358.0" y1="430.0" x2="358.0" y2="510.0" class="grid" opacity=".75"/><line x1="374.0" y1="430.0" x2="374.0" y2="510.0" class="grid" opacity=".75"/><line x1="310.0" y1="446.0" x2="390.0" y2="446.0" class="grid" opacity=".75"/><line x1="310.0" y1="462.0" x2="390.0" y2="462.0" class="grid" opacity=".75"/><line x1="310.0" y1="478.0" x2="390.0" y2="478.0" class="grid" opacity=".75"/><line x1="310.0" y1="494.0" x2="390.0" y2="494.0" class="grid" opacity=".75"/></g><rect x="311" y="431" width="14" height="14" fill="#73B222" opacity="0.75" rx="1"/><rect x="343" y="463" width="14" height="14" fill="#73B222" opacity="0.75" rx="1"/><rect x="359" y="479" width="14" height="14" fill="#73B222" opacity="0.75" rx="1"/><text x="350.0" y="528.0" font-size="12" fill="#5E5850" text-anchor="middle">setosa</text><g><rect x="430.0" y="430.0" width="80.0" height="80.0" rx="2" fill="#E4E1D7" opacity="1.0" stroke="#ffffff" stroke-width="1"/><line x1="446.0" y1="430.0" x2="446.0" y2="510.0" class="grid" opacity=".75"/><line x1="462.0" y1="430.0" x2="462.0" y2="510.0" class="grid" opacity=".75"/><line x1="478.0" y1="430.0" x2="478.0" y2="510.0" class="grid" opacity=".75"/><line x1="494.0" y1="430.0" x2="494.0" y2="510.0" class="grid" opacity=".75"/><line x1="430.0" y1="446.0" x2="510.0" y2="446.0" class="grid" opacity=".75"/><line x1="430.0" y1="462.0" x2="510.0" y2="462.0" class="grid" opacity=".75"/><line x1="430.0" y1="478.0" x2="510.0" y2="478.0" class="grid" opacity=".75"/><line x1="430.0" y1="494.0" x2="510.0" y2="494.0" class="grid" opacity=".75"/></g><rect x="495" y="495" width="14" height="14" fill="#73B222" opacity="0.75" rx="1"/><text x="470.0" y="528.0" font-size="12" fill="#5E5850" text-anchor="middle">virginica</text><foreignObject x="540.0" y="424.0" width="410.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="z_i = x_i W_1 D^{(1)}_i W_2 D^{(2)}_i W_3 + \ldots"></div></foreignObject><text x="550.0" y="480.0" font-size="13" fill="#5E5850" text-anchor="start">D — диагональная маска ReLU, у каждого объекта своя:</text><text x="550.0" y="498.0" font-size="13" fill="#5E5850" text-anchor="start">одной общей матрицы уже не существует</text></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">синее — матрица, в которую схлопнулась бы сеть без нелинейности</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl chain" data-focus="hl chain">
      <div class="step-kicker">Шаг 1 · эксперимент</div>
      <h4>Уберём обе ReLU</h4>
      <p>Мысленный опыт: что, если между линейными слоями ничего не стоит? Тогда вся сеть — это <code>((X W₁ + b₁) W₂ + b₂) W₃ + b₃</code>.</p>
    </div>
    <div class="step-panel" data-on="hl chain eff" data-focus="eff">
      <div class="step-kicker">Шаг 2 · схлопывание</div>
      <h4>Произведение матриц — снова матрица</h4>
      <p><code>[4 × 5] · [5 × 4] · [4 × 3] = [4 × 3]</code>. Раскрыв скобки, получаем <code>X W_eff + b_eff</code>: ровно один линейный слой. Сколько бы линейных слоёв ни стояло подряд, они выразят только то, что умеет один.</p>
    </div>
    <div class="step-panel" data-on="hl chain eff bias" data-focus="bias">
      <div class="step-kicker">Шаг 3 · смещения</div>
      <h4>Смещения тоже складываются в одно</h4>
      <p>Каждое смещение просто проходит через оставшиеся матрицы. Итог — одна строка <code>[1 × 3]</code>.</p>
    </div>
    <div class="step-panel" data-on="hl eff bias count" data-focus="count">
      <div class="step-kicker">Шаг 4 · цена</div>
      <h4>64 параметра вместо 15 — и никакой выгоды</h4>
      <p>Глубина без нелинейности только добавляет чисел, которые надо обучать, но не расширяет набор функций. Для ирисов это была бы обычная многоклассовая логистическая регрессия.</p>
    </div>
    <div class="step-panel" data-on="hl chain relu" data-focus="relu">
      <div class="step-kicker">Шаг 5 · что делает ReLU</div>
      <h4>Маска зависит от объекта</h4>
      <p>С ReLU между матрицами встают диагональные маски — у setosa открыты нейроны 1, 3, 4, у virginica только пятый. Для каждого объекта «своя» эффективная матрица, и сеть становится кусочно-линейной функцией, а не одной плоскостью.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Схлопнутые веса, прогон без ReLU и сравнение с настоящей сетью.</p>
<div class="stage" id="stage-nln" tabindex="0">
  <div class="stage-figure">
<svg id="nln" viewBox="0 0 960 570" role="img" aria-label="Числовая проверка: сеть без ReLU равна одному линейному слою">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: без ReLU три слоя равны одному</text><g data-key="weff"><g><rect x="144.5" y="70.0" width="51.0" height="68.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="161.5" y1="70.0" x2="161.5" y2="138.0" class="grid" opacity=".75"/><line x1="178.5" y1="70.0" x2="178.5" y2="138.0" class="grid" opacity=".75"/><line x1="144.5" y1="87.0" x2="195.5" y2="87.0" class="grid" opacity=".75"/><line x1="144.5" y1="104.0" x2="195.5" y2="104.0" class="grid" opacity=".75"/><line x1="144.5" y1="121.0" x2="195.5" y2="121.0" class="grid" opacity=".75"/></g><text x="170.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="134.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="80.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_{eff} = W_1 W_2 W_3"></div></foreignObject><foreignObject x="50.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.525 &amp; -0.108 &amp; 0.609 \\ 1.373 &amp; -0.212 &amp; -0.237 \\ -1.949 &amp; -0.403 &amp; 0.904 \\ 1.243 &amp; 0.146 &amp; 0.114\end{bmatrix}"></div></foreignObject></g><g data-key="beff"><g><rect x="444.5" y="70.0" width="51.0" height="17.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="461.5" y1="70.0" x2="461.5" y2="87.0" class="grid" opacity=".75"/><line x1="478.5" y1="70.0" x2="478.5" y2="87.0" class="grid" opacity=".75"/></g><text x="470.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="434.5" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="380.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b_{eff}"></div></foreignObject><foreignObject x="350.0" y="117.0" width="240.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.465 &amp; -0.512 &amp; -0.699\end{bmatrix}"></div></foreignObject><text x="640.0" y="90.0" font-size="13" fill="#5E5850" text-anchor="start">15 чисел вместо 64</text></g><g data-key="zlin"><g><rect x="144.5" y="300.0" width="51.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="161.5" y1="300.0" x2="161.5" y2="368.0" class="grid" opacity=".75"/><line x1="178.5" y1="300.0" x2="178.5" y2="368.0" class="grid" opacity=".75"/><line x1="144.5" y1="317.0" x2="195.5" y2="317.0" class="grid" opacity=".75"/><line x1="144.5" y1="334.0" x2="195.5" y2="334.0" class="grid" opacity=".75"/><line x1="144.5" y1="351.0" x2="195.5" y2="351.0" class="grid" opacity=".75"/></g><text x="170.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="134.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="80.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\text{три слоя без ReLU}"></div></foreignObject><foreignObject x="60.0" y="398.0" width="220.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2.38 &amp; -0.28 &amp; -2.85 \\ -1.84 &amp; -0.52 &amp; -0.27 \\ -0.61 &amp; -0.82 &amp; 0.52 \\ -0.22 &amp; -0.71 &amp; -0.11\end{bmatrix}"></div></foreignObject></g><g data-key="same"><text x="320.0" y="334.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="444.5" y="300.0" width="51.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="461.5" y1="300.0" x2="461.5" y2="368.0" class="grid" opacity=".75"/><line x1="478.5" y1="300.0" x2="478.5" y2="368.0" class="grid" opacity=".75"/><line x1="444.5" y1="317.0" x2="495.5" y2="317.0" class="grid" opacity=".75"/><line x1="444.5" y1="334.0" x2="495.5" y2="334.0" class="grid" opacity=".75"/><line x1="444.5" y1="351.0" x2="495.5" y2="351.0" class="grid" opacity=".75"/></g><text x="470.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="434.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="380.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X W_{eff} + b_{eff}"></div></foreignObject><foreignObject x="360.0" y="398.0" width="220.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2.38 &amp; -0.28 &amp; -2.85 \\ -1.84 &amp; -0.52 &amp; -0.27 \\ -0.61 &amp; -0.82 &amp; 0.52 \\ -0.22 &amp; -0.71 &amp; -0.11\end{bmatrix}"></div></foreignObject><text x="320.0" y="530.0" font-size="13" fill="#3576C0" text-anchor="middle">расхождение 5.6 · 10⁻¹⁶ — ошибка округления в последнем бите</text></g><g data-key="zrelu"><g><rect x="754.5" y="300.0" width="51.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="771.5" y1="300.0" x2="771.5" y2="368.0" class="grid" opacity=".75"/><line x1="788.5" y1="300.0" x2="788.5" y2="368.0" class="grid" opacity=".75"/><line x1="754.5" y1="317.0" x2="805.5" y2="317.0" class="grid" opacity=".75"/><line x1="754.5" y1="334.0" x2="805.5" y2="334.0" class="grid" opacity=".75"/><line x1="754.5" y1="351.0" x2="805.5" y2="351.0" class="grid" opacity=".75"/></g><text x="780.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="744.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="690.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z_3 \text{ с ReLU}"></div></foreignObject><foreignObject x="670.0" y="398.0" width="220.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.85 &amp; -0.18 &amp; -1.36 \\ -1.47 &amp; -0.40 &amp; -0.40 \\ -1.05 &amp; -0.14 &amp; -0.36 \\ -0.91 &amp; -0.38 &amp; -0.47\end{bmatrix}"></div></foreignObject><text x="780.0" y="530.0" font-size="13" fill="#C30B0A" text-anchor="middle">совсем другие логиты</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="weff beff" data-focus="weff beff">
      <div class="step-kicker">Шаг 1 · схлопнутые веса</div>
      <h4>W_eff [4 × 3] и b_eff [1 × 3]</h4>
      <p>Перемножаем три матрицы весов и собираем смещения по формуле из предыдущей сцены. Получилось 12 + 3 = 15 чисел.</p>
    </div>
    <div class="step-panel" data-on="weff zlin" data-focus="zlin">
      <div class="step-kicker">Шаг 2 · прогон без ReLU</div>
      <h4>Три линейных слоя подряд на той же X</h4>
      <p>Логиты сети, из которой вынули обе активации. У setosa, например, 2.38 / −0.28 / −2.85.</p>
    </div>
    <div class="step-panel" data-on="zlin same" data-focus="same">
      <div class="step-kicker">Шаг 3 · сверка</div>
      <h4>Один слой даёт те же числа</h4>
      <p>Максимальное расхождение 5.6·10⁻¹⁶ — это уровень точности float64. Совпадение точное: без нелинейности глубина — иллюзия.</p>
    </div>
    <div class="step-panel" data-on="zlin same zrelu" data-focus="zrelu">
      <div class="step-kicker">Шаг 4 · с ReLU</div>
      <h4>Тем же весам ReLU даёт совсем другой ответ</h4>
      <p>Логиты настоящей сети (часть 7) не имеют ничего общего с «линейной» версией. Именно маски ReLU, разные у разных объектов, делают из стопки матриц нейросеть.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> без нелинейности любая стопка линейных слоев равна одному слою; вся выразительная сила глубины держится на том, что маска ReLU у каждого объекта своя.
</div>

---


## Часть 10. Backprop: откуда берётся градиент

<p>
  Прямой проход закончился числом L = 1.0133. Обратный проход отвечает на один вопрос: как
  изменится это число, если чуть-чуть подвинуть каждый из 64 параметров. Ответ — градиент, и у
  него всегда та же форма, что у величины, по которой дифференцируем: у градиента матрицы
  <code>[5 × 4]</code> форма <code>[5 × 4]</code>.
</p>
<p>
  Считается он по цепному правилу, слой за слоем от конца к началу. Сначала — карта всего
  пути; потом тот же путь в числах, начиная с самого первого шага.
</p>
<div class="stage" id="stage-bpg" tabindex="0">
  <div class="stage-figure">
<svg id="bpg" viewBox="0 0 960 470" role="img" aria-label="Карта обратного прохода по всему пайплайну">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Обратный проход: тот же конвейер справа налево</text><g data-key="c0"><rect x="24" y="70" width="64" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="56" y="150" transform="rotate(-90 56 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Вход X</text></g><g data-key="c1"><rect x="140" y="70" width="64" height="150" rx="10" fill="#F4EFFA" stroke="#7B4AB5" stroke-width="1.8"/><text x="172" y="150" transform="rotate(-90 172 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear 1</text><rect x="118" y="234" width="108" height="32" rx="7" fill="#F4EFFA" stroke="#7B4AB5" stroke-width="1.4"/><text x="172.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W₁ [4×5] · b₁</text></g><g data-key="c2"><rect x="256" y="70" width="64" height="150" rx="10" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.8"/><text x="288" y="150" transform="rotate(-90 288 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">ReLU</text><rect x="234" y="234" width="108" height="32" rx="7" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.4"/><text x="288.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c3"><rect x="372" y="70" width="64" height="150" rx="10" fill="#EAF6FA" stroke="#1B9BC2" stroke-width="1.8"/><text x="404" y="150" transform="rotate(-90 404 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear 2</text><rect x="350" y="234" width="108" height="32" rx="7" fill="#EAF6FA" stroke="#1B9BC2" stroke-width="1.4"/><text x="404.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W₂ [5×4] · b₂</text></g><g data-key="c4"><rect x="488" y="70" width="64" height="150" rx="10" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.8"/><text x="520" y="150" transform="rotate(-90 520 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">ReLU</text><rect x="466" y="234" width="108" height="32" rx="7" fill="#F1F9EC" stroke="#5E9A3C" stroke-width="1.4"/><text x="520.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c5"><rect x="604" y="70" width="64" height="150" rx="10" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.8"/><text x="636" y="150" transform="rotate(-90 636 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear 3</text><rect x="582" y="234" width="108" height="32" rx="7" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.4"/><text x="636.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W₃ [4×3] · b₃</text></g><g data-key="c6"><rect x="720" y="70" width="64" height="150" rx="10" fill="#FEF4EA" stroke="#E88919" stroke-width="1.8"/><text x="752" y="150" transform="rotate(-90 752 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Softmax</text><rect x="698" y="234" width="108" height="32" rx="7" fill="#FEF4EA" stroke="#E88919" stroke-width="1.4"/><text x="752.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c7"><rect x="836" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="868" y="150" transform="rotate(-90 868 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Cross-Entropy</text></g><path d="M 91.0 145.0 L 137.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="114.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">X</text><text x="114.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 4]</text><path d="M 207.0 145.0 L 253.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="230.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z₁</text><text x="230.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 5]</text><path d="M 323.0 145.0 L 369.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="346.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">A₁</text><text x="346.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 5]</text><path d="M 439.0 145.0 L 485.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="462.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z₂</text><text x="462.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 4]</text><path d="M 555.0 145.0 L 601.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="578.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">A₂</text><text x="578.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 4]</text><path d="M 671.0 145.0 L 717.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="694.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z₃</text><text x="694.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 3]</text><path d="M 787.0 145.0 L 833.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="810.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">P</text><text x="810.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 3]</text><path d="M 903.0 145.0 L 948.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="925.5" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">L</text><text x="925.5" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[1]</text><g data-key="yy"><path d="M 868.0 300.0 L 868.0 224.0" fill="none" stroke="#5E5850" stroke-width="1.6" marker-end="url(#bpg-arw)"/><text x="868.0" y="318.0" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="700">Y [4 × 3]</text><text x="868.0" y="334.0" font-size="12" fill="#5E5850" text-anchor="middle">one-hot</text></g><g data-key="g5"><text x="694.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dZ₃</text></g><g data-key="g4"><text x="578.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dA₂</text></g><g data-key="g3"><text x="462.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dZ₂</text></g><g data-key="g2"><text x="346.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dA₁</text></g><g data-key="g1"><text x="230.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dZ₁</text></g><g data-key="g0"><text x="114.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dX</text></g><g data-key="w3g"><text x="636.0" y="288.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dW₃, db₃</text></g><g data-key="w2g"><text x="404.0" y="288.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dW₂, db₂</text></g><g data-key="w1g"><text x="172.0" y="288.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dW₁, db₁</text></g><g data-key="r2g"><text x="520.0" y="288.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">⊙ [Z₂ &gt; 0]</text></g><g data-key="r1g"><text x="288.0" y="288.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">⊙ [Z₁ &gt; 0]</text></g><g data-key="mag" data-only="1"><path d="M 930.0 380.0 L 40.0 380.0" fill="none" stroke="#E39A9A" stroke-width="3" marker-end="url(#bpg-bw)"/><rect x="290" y="364" width="400" height="32" rx="16" fill="#FDF3F3" stroke="#E39A9A"/><text x="490.0" y="385.0" font-size="13" fill="#C30B0A" text-anchor="middle" font-weight="700">градиент течёт справа налево, формы те же</text><text x="490.0" y="430.0" font-size="13" fill="#5E5850" text-anchor="middle">форма каждого градиента совпадает с формой величины, по которой дифференцируем</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="c7 c6 yy g5" data-focus="c7 g5">
      <div class="step-kicker">Шаг 1 · старт</div>
      <h4>Обратный проход начинается с одного числа</h4>
      <p>Потеря — скаляр, её производная по самой себе равна 1. Softmax и кросс-энтропию удобно пройти одним шагом: вместе они дают удивительно простой градиент <code>(P − Y) / B</code> формы <code>[4 × 3]</code> — ровно как у логитов.</p>
    </div>
    <div class="step-panel" data-on="c5 g5 w3g g4" data-focus="w3g g4">
      <div class="step-kicker">Шаг 2 · третий слой</div>
      <h4>Линейный слой отдаёт три градиента</h4>
      <p>Из <code>dL/dZ₃</code> получаются <code>dW₃ [4 × 3]</code> и <code>db₃ [1 × 3]</code> — их заберёт оптимизатор, — и <code>dL/dA₂ [4 × 4]</code>, который поедет дальше влево.</p>
    </div>
    <div class="step-panel" data-on="c4 g4 r2g g3" data-focus="r2g g3">
      <div class="step-kicker">Шаг 3 · ReLU</div>
      <h4>Градиент проходит только через открытые клетки</h4>
      <p>Параметров у ReLU нет, поэтому она отдаёт один градиент — умножает пришедший на ту же маску, что использовала на прямом проходе.</p>
    </div>
    <div class="step-panel" data-on="c3 g3 w2g g2" data-focus="w2g g2">
      <div class="step-kicker">Шаг 4 · второй слой</div>
      <h4>Та же тройка формул ещё раз</h4>
      <p><code>dW₂ [5 × 4]</code>, <code>db₂ [1 × 4]</code> и <code>dL/dA₁ [4 × 5]</code>. Формулы одинаковы для любого линейного слоя — меняются только матрицы, которые в них подставляют.</p>
    </div>
    <div class="step-panel" data-on="c2 c1 g2 r1g g1 w1g g0" data-focus="w1g g1">
      <div class="step-kicker">Шаг 5 · первый слой</div>
      <h4>Последние градиенты весов — dW₁ и db₁</h4>
      <p>Градиент по входу X тоже можно посчитать, но он не нужен: X — данные, их не обучают. Поэтому на практике обратный проход останавливается на весах первого слоя.</p>
    </div>
    <div class="step-panel" data-on="c0 c1 c2 c3 c4 c5 c6 c7 g0 g1 g2 g3 g4 g5 w1g w2g w3g r1g r2g mag" data-focus="mag">
      <div class="step-kicker">Шаг 6 · целиком</div>
      <h4>Шесть градиентов параметров за один проход</h4>
      <p>Один обратный проход даёт производные потери по всем 64 параметрам сразу. Стоит он примерно как два прямых: каждое умножение на матрицу вперёд превращается в два умножения назад.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<p>
  Начинается всё с производной потерь по логитам. Для softmax вместе с кросс-энтропией она
  получается на удивление простой — разность предсказания и правильного ответа. Дальше
  линейный слой отдаёт три градиента:
</p>
<div class="math-display" data-tex="\frac{\partial L}{\partial Z_3} = \frac{P - Y}{B}, \qquad \frac{\partial L}{\partial W_3} = A_2^{\top} \frac{\partial L}{\partial Z_3}, \qquad \frac{\partial L}{\partial b_3} = \sum_{i} \frac{\partial L}{\partial Z_{3,i\cdot}}, \qquad \frac{\partial L}{\partial A_2} = \frac{\partial L}{\partial Z_3} W_3^{\top}"></div>
<p class="tiny">Дальше для краткости <span class="math-inline" data-tex="dT"></span> означает <span class="math-inline" data-tex="\partial L / \partial T"></span>.</p>
<div class="stage" id="stage-bp1" tabindex="0">
  <div class="stage-figure">
<svg id="bp1" viewBox="0 0 960 770" role="img" aria-label="Первый градиент и градиенты третьего слоя в числах">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: от потери до третьего слоя</text><g data-key="p"><g><rect x="144.5" y="70.0" width="51.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="161.5" y1="70.0" x2="161.5" y2="138.0" class="grid" opacity=".75"/><line x1="178.5" y1="70.0" x2="178.5" y2="138.0" class="grid" opacity=".75"/><line x1="144.5" y1="87.0" x2="195.5" y2="87.0" class="grid" opacity=".75"/><line x1="144.5" y1="104.0" x2="195.5" y2="104.0" class="grid" opacity=".75"/><line x1="144.5" y1="121.0" x2="195.5" y2="121.0" class="grid" opacity=".75"/></g><text x="170.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="134.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="80.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="P"></div></foreignObject><foreignObject x="50.0" y="168.0" width="240.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2808 &amp; 0.5495 &amp; 0.1697 \\ 0.1463 &amp; 0.4257 &amp; 0.4280 \\ 0.1826 &amp; 0.4539 &amp; 0.3635 \\ 0.2359 &amp; 0.3997 &amp; 0.3644\end{bmatrix}"></div></foreignObject></g><g data-key="y"><text x="320.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">−</text><g><rect x="434.5" y="70.0" width="51.0" height="68.0" rx="2" fill="#9A9489" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="451.5" y1="70.0" x2="451.5" y2="138.0" class="grid" opacity=".75"/><line x1="468.5" y1="70.0" x2="468.5" y2="138.0" class="grid" opacity=".75"/><line x1="434.5" y1="87.0" x2="485.5" y2="87.0" class="grid" opacity=".75"/><line x1="434.5" y1="104.0" x2="485.5" y2="104.0" class="grid" opacity=".75"/><line x1="434.5" y1="121.0" x2="485.5" y2="121.0" class="grid" opacity=".75"/></g><text x="460.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="424.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="370.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><foreignObject x="385.0" y="168.0" width="150.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 &amp; 0 &amp; 0 \\ 0 &amp; 1 &amp; 0 \\ 0 &amp; 0 &amp; 1 \\ 0 &amp; 1 &amp; 0\end{bmatrix}"></div></foreignObject></g><g data-key="dz"><g><rect x="144.5" y="300.0" width="51.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="161.5" y1="300.0" x2="161.5" y2="368.0" class="grid" opacity=".75"/><line x1="178.5" y1="300.0" x2="178.5" y2="368.0" class="grid" opacity=".75"/><line x1="144.5" y1="317.0" x2="195.5" y2="317.0" class="grid" opacity=".75"/><line x1="144.5" y1="334.0" x2="195.5" y2="334.0" class="grid" opacity=".75"/><line x1="144.5" y1="351.0" x2="195.5" y2="351.0" class="grid" opacity=".75"/></g><text x="170.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="134.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="80.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_3 = (P - Y)/B"></div></foreignObject><foreignObject x="45.0" y="398.0" width="250.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.1798 &amp; 0.1374 &amp; 0.0424 \\ 0.0366 &amp; -0.1436 &amp; 0.1070 \\ 0.0457 &amp; 0.1135 &amp; -0.1591 \\ 0.0590 &amp; -0.1501 &amp; 0.0911\end{bmatrix}"></div></foreignObject></g><g data-key="sign" data-only="1"><text x="620.0" y="100.0" font-size="13" fill="#C30B0A" text-anchor="start">у правильного класса градиент</text><text x="620.0" y="118.0" font-size="13" fill="#C30B0A" text-anchor="start">отрицательный, у остальных —</text><text x="620.0" y="136.0" font-size="13" fill="#C30B0A" text-anchor="start">положительный; сумма строки = 0</text></g><g data-key="dw"><g><rect x="454.5" y="300.0" width="51.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="471.5" y1="300.0" x2="471.5" y2="368.0" class="grid" opacity=".75"/><line x1="488.5" y1="300.0" x2="488.5" y2="368.0" class="grid" opacity=".75"/><line x1="454.5" y1="317.0" x2="505.5" y2="317.0" class="grid" opacity=".75"/><line x1="454.5" y1="334.0" x2="505.5" y2="334.0" class="grid" opacity=".75"/><line x1="454.5" y1="351.0" x2="505.5" y2="351.0" class="grid" opacity=".75"/></g><text x="480.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="444.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="390.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dW_3 = A_2^{\top} dZ_3"></div></foreignObject><foreignObject x="355.0" y="398.0" width="250.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.2330 &amp; 0.1333 &amp; 0.0997 \\ -0.0615 &amp; 0.0791 &amp; -0.0175 \\ 0.0192 &amp; -0.0692 &amp; 0.0501 \\ 0.1209 &amp; -0.1392 &amp; 0.0183\end{bmatrix}"></div></foreignObject></g><g data-key="db"><g><rect x="764.5" y="300.0" width="51.0" height="17.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="781.5" y1="300.0" x2="781.5" y2="317.0" class="grid" opacity=".75"/><line x1="798.5" y1="300.0" x2="798.5" y2="317.0" class="grid" opacity=".75"/></g><text x="790.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="754.5" y="312.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="700.0" y="320.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="db_3 = \textstyle\sum_i dZ_3"></div></foreignObject><foreignObject x="665.0" y="347.0" width="250.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.0386 &amp; -0.0428 &amp; 0.0814\end{bmatrix}"></div></foreignObject><text x="790.0" y="400.0" font-size="13" fill="#C30B0A" text-anchor="middle">−0.0386 − 0.0428 + 0.0814 = 0</text><text x="790.0" y="418.0" font-size="13" fill="#C30B0A" text-anchor="middle">сумма ровно ноль</text></g><g data-key="da"><g><rect x="166.0" y="530.0" width="68.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="183.0" y1="530.0" x2="183.0" y2="598.0" class="grid" opacity=".75"/><line x1="200.0" y1="530.0" x2="200.0" y2="598.0" class="grid" opacity=".75"/><line x1="217.0" y1="530.0" x2="217.0" y2="598.0" class="grid" opacity=".75"/><line x1="166.0" y1="547.0" x2="234.0" y2="547.0" class="grid" opacity=".75"/><line x1="166.0" y1="564.0" x2="234.0" y2="564.0" class="grid" opacity=".75"/><line x1="166.0" y1="581.0" x2="234.0" y2="581.0" class="grid" opacity=".75"/></g><text x="200.0" y="522.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="156.0" y="568.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="110.0" y="601.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dA_2 = dZ_3 W_3^{\top}"></div></foreignObject><foreignObject x="50.0" y="628.0" width="300.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0158 &amp; 0.0814 &amp; 0.1376 &amp; 0.0994 \\ -0.1073 &amp; -0.0397 &amp; 0.0530 &amp; -0.0433 \\ 0.1295 &amp; 0.0090 &amp; -0.1388 &amp; 0.0044 \\ -0.0997 &amp; -0.0477 &amp; 0.0284 &amp; -0.0536\end{bmatrix}"></div></foreignObject></g><g data-key="step" data-only="1"><text x="460.0" y="560.0" font-size="14" fill="#5E5850" text-anchor="start">шаг оптимизатора:</text><foreignObject x="460.0" y="570.0" width="470.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_3 \leftarrow W_3 - \eta\, dW_3"></div></foreignObject><text x="460.0" y="630.0" font-size="14" fill="#5E5850" text-anchor="start">при η = 0.5 один шаг всех шести матриц</text><text x="460.0" y="650.0" font-size="14" fill="#C30B0A" text-anchor="start">опускает потерю с 1.0133 до 0.8839</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="p y" data-focus="p y">
      <div class="step-kicker">Шаг 1 · две матрицы</div>
      <h4>Что предсказано и что должно быть</h4>
      <p>Те же P и Y, что в части 8. Их разность — почти готовый градиент.</p>
    </div>
    <div class="step-panel" data-on="p y dz sign" data-focus="dz sign">
      <div class="step-kicker">Шаг 2 · первый градиент</div>
      <h4>(P − Y) / B</h4>
      <p>Производная средней кросс-энтропии по логитам. У setosa: (0.2808 − 1) / 4 = −0.1798 — единственное отрицательное число строки; толкать этот логит надо вверх, остальные вниз. Деление на B = 4 — след того, что потеря — среднее.</p>
    </div>
    <div class="step-panel" data-on="dz dw" data-focus="dw">
      <div class="step-kicker">Шаг 3 · веса</div>
      <h4>dW₃ = A₂ᵀ · dZ₃</h4>
      <p><code>[4 × 4]ᵀ · [4 × 3] = [4 × 3]</code> — форма W₃, как и положено. Клетка (k, c) суммирует по объектам «насколько был активен нейрон k» × «куда надо двигать логит c».</p>
    </div>
    <div class="step-panel" data-on="dz db" data-focus="db">
      <div class="step-kicker">Шаг 4 · смещения</div>
      <h4>db₃ — сумма dZ₃ по строкам</h4>
      <p>Смещение прибавлялось к каждой строке, поэтому на обратном пути градиенты всех строк складываются. И получается ровно 0: каждая строка (P − Y) суммируется в 0, значит и их сумма тоже. Смещение выходного слоя softmax двигает логиты только относительно друг друга.</p>
    </div>
    <div class="step-panel" data-on="dz da" data-focus="da">
      <div class="step-kicker">Шаг 5 · дальше влево</div>
      <h4>dA₂ = dZ₃ · W₃ᵀ</h4>
      <p><code>[4 × 3] · [3 × 4] = [4 × 4]</code> — форма A₂. Этот градиент — вход обратного прохода через вторую ReLU и второй слой.</p>
    </div>
    <div class="step-panel" data-on="dw step" data-focus="step">
      <div class="step-kicker">Шаг 6 · зачем всё это</div>
      <h4>Веса сдвигаются против градиента</h4>
      <p>После того как градиенты посчитаны для всех шести матриц, каждая сдвигается на −η·градиент. Одна итерация — прямой проход, обратный и сдвиг.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> обратный проход — цепочка матричных умножений справа налево, от потерь к весам; начинается он с <code>(P − Y) / B</code>, а формы градиентов повторяют формы величин.
</div>

---


## Часть 11. Backprop: через ReLU и линейный слой

<p>
  Любой скрытый слой на обратном пути делает одно и то же. Сначала градиент проходит
  через активацию — умножается на её маску. Потом линейный слой раздаёт его на три
  адреса: весам, смещениям и своему входу.
</p>
<div class="math-display" data-tex="dZ = dA \odot [Z &gt; 0], \qquad dW = A_{in}^{\top}\, dZ, \qquad db = \sum_i dZ_{i\cdot}, \qquad dA_{in} = dZ\, W^{\top}"></div>

<p>
  Посмотрим пошагово, как эти четыре формулы работают для второго слоя, — сначала формами,
  затем числами.
</p>
<div class="stage" id="stage-bp2" tabindex="0">
  <div class="stage-figure">
<svg id="bp2" viewBox="0 0 960 620" role="img" aria-label="Обратный проход через ReLU и линейный слой: маска, градиенты весов, смещения и входа">
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
<g transform="translate(10,60)"><rect x="30" y="348" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="30" y="236" width="190" height="100" rx="14" fill="none" stroke="#8A857C" stroke-width="1.2" stroke-dasharray="6 5"/><text x="20.0" y="398.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 398)">слой 1</text><text x="20.0" y="286.0" font-size="12" fill="#8A857C" text-anchor="middle" transform="rotate(-90 20 286)">слой 2</text><path d="M 125 462 L 125 440" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 404 L 125 386" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 356 L 125 328" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 292 L 125 274" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 244 L 125 216" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 180 L 125 160" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 128 L 125 108" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 76 L 125 48" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><text x="138.0" y="44.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 92 L 214 92" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#bp2-arw)"/><text x="232.0" y="84.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">y</text><rect x="40" y="462" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="482.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="404" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="426.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 1</text><rect x="40" y="356" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="375.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#8A857C" text-anchor="middle">ReLU</text><rect x="40" y="180" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="202.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear 3</text><rect x="40" y="128" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="148.5" font-size="13" fill="#8A857C" text-anchor="middle">Softmax</text><rect x="40" y="76" width="170" height="32" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="96.5" font-size="13" fill="#8A857C" text-anchor="middle">Cross-Entropy</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="292" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear 2</text><rect x="40" y="244" width="170" height="30" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="263.5" font-size="13" fill="#C30B0A" text-anchor="middle">ReLU</text><rect x="34" y="238" width="182" height="96" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="da"><g><rect x="300.0" y="80.0" width="88.0" height="88.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="322.0" y1="80.0" x2="322.0" y2="168.0" class="grid" opacity=".75"/><line x1="344.0" y1="80.0" x2="344.0" y2="168.0" class="grid" opacity=".75"/><line x1="366.0" y1="80.0" x2="366.0" y2="168.0" class="grid" opacity=".75"/><line x1="300.0" y1="102.0" x2="388.0" y2="102.0" class="grid" opacity=".75"/><line x1="300.0" y1="124.0" x2="388.0" y2="124.0" class="grid" opacity=".75"/><line x1="300.0" y1="146.0" x2="388.0" y2="146.0" class="grid" opacity=".75"/></g><text x="344.0" y="72.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="289.0" y="170.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dA_2"></div></foreignObject></g><g data-key="mask"><text x="406.0" y="130.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="424.0" y="80.0" width="88.0" height="88.0" rx="2" fill="#E4E1D7" opacity="1.0" stroke="#ffffff" stroke-width="1"/><line x1="446.0" y1="80.0" x2="446.0" y2="168.0" class="grid" opacity=".75"/><line x1="468.0" y1="80.0" x2="468.0" y2="168.0" class="grid" opacity=".75"/><line x1="490.0" y1="80.0" x2="490.0" y2="168.0" class="grid" opacity=".75"/><line x1="424.0" y1="102.0" x2="512.0" y2="102.0" class="grid" opacity=".75"/><line x1="424.0" y1="124.0" x2="512.0" y2="124.0" class="grid" opacity=".75"/><line x1="424.0" y1="146.0" x2="512.0" y2="146.0" class="grid" opacity=".75"/></g><rect x="425" y="81" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="447" y="81" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="425" y="103" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="447" y="103" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="469" y="103" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="491" y="103" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="425" y="125" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="447" y="125" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="469" y="125" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="491" y="125" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="425" y="147" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="447" y="147" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><rect x="491" y="147" width="20" height="20" fill="#73B222" opacity="0.7" rx="1"/><foreignObject x="413.0" y="170.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[Z_2 &gt; 0]"></div></foreignObject></g><g data-key="dz"><text x="530.0" y="130.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="548.0" y="80.0" width="88.0" height="88.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="570.0" y1="80.0" x2="570.0" y2="168.0" class="grid" opacity=".75"/><line x1="592.0" y1="80.0" x2="592.0" y2="168.0" class="grid" opacity=".75"/><line x1="614.0" y1="80.0" x2="614.0" y2="168.0" class="grid" opacity=".75"/><line x1="548.0" y1="102.0" x2="636.0" y2="102.0" class="grid" opacity=".75"/><line x1="548.0" y1="124.0" x2="636.0" y2="124.0" class="grid" opacity=".75"/><line x1="548.0" y1="146.0" x2="636.0" y2="146.0" class="grid" opacity=".75"/></g><text x="592.0" y="72.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="537.0" y="170.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_2"></div></foreignObject></g><g data-key="dw"><g><rect x="300.0" y="230.0" width="88.0" height="110.0" rx="2" fill="#7B4AB5" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="322.0" y1="230.0" x2="322.0" y2="340.0" class="grid" opacity=".75"/><line x1="344.0" y1="230.0" x2="344.0" y2="340.0" class="grid" opacity=".75"/><line x1="366.0" y1="230.0" x2="366.0" y2="340.0" class="grid" opacity=".75"/><line x1="300.0" y1="252.0" x2="388.0" y2="252.0" class="grid" opacity=".75"/><line x1="300.0" y1="274.0" x2="388.0" y2="274.0" class="grid" opacity=".75"/><line x1="300.0" y1="296.0" x2="388.0" y2="296.0" class="grid" opacity=".75"/><line x1="300.0" y1="318.0" x2="388.0" y2="318.0" class="grid" opacity=".75"/></g><text x="344.0" y="222.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="289.0" y="344.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A_1^{\top}"></div></foreignObject><text x="406.0" y="290.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="424.0" y="230.0" width="88.0" height="88.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="446.0" y1="230.0" x2="446.0" y2="318.0" class="grid" opacity=".75"/><line x1="468.0" y1="230.0" x2="468.0" y2="318.0" class="grid" opacity=".75"/><line x1="490.0" y1="230.0" x2="490.0" y2="318.0" class="grid" opacity=".75"/><line x1="424.0" y1="252.0" x2="512.0" y2="252.0" class="grid" opacity=".75"/><line x1="424.0" y1="274.0" x2="512.0" y2="274.0" class="grid" opacity=".75"/><line x1="424.0" y1="296.0" x2="512.0" y2="296.0" class="grid" opacity=".75"/></g><text x="468.0" y="222.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="413.0" y="322.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_2"></div></foreignObject><text x="530.0" y="290.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="548.0" y="230.0" width="88.0" height="110.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="570.0" y1="230.0" x2="570.0" y2="340.0" class="grid" opacity=".75"/><line x1="592.0" y1="230.0" x2="592.0" y2="340.0" class="grid" opacity=".75"/><line x1="614.0" y1="230.0" x2="614.0" y2="340.0" class="grid" opacity=".75"/><line x1="548.0" y1="252.0" x2="636.0" y2="252.0" class="grid" opacity=".75"/><line x1="548.0" y1="274.0" x2="636.0" y2="274.0" class="grid" opacity=".75"/><line x1="548.0" y1="296.0" x2="636.0" y2="296.0" class="grid" opacity=".75"/><line x1="548.0" y1="318.0" x2="636.0" y2="318.0" class="grid" opacity=".75"/></g><text x="592.0" y="222.0" font-size="13" fill="#111111" text-anchor="middle">4</text><foreignObject x="537.0" y="344.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dW_2"></div></foreignObject></g><g data-key="db"><text x="690.0" y="250.0" font-size="13" fill="#5E5850" text-anchor="start">сумма dZ₂ по строкам</text><g><rect x="700.0" y="262.0" width="88.0" height="22.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="722.0" y1="262.0" x2="722.0" y2="284.0" class="grid" opacity=".75"/><line x1="744.0" y1="262.0" x2="744.0" y2="284.0" class="grid" opacity=".75"/><line x1="766.0" y1="262.0" x2="766.0" y2="284.0" class="grid" opacity=".75"/></g><text x="744.0" y="300.0" font-size="13" fill="#111111" text-anchor="middle">db₂  [1 × 4]</text></g><g data-key="dx"><g><rect x="300.0" y="400.0" width="88.0" height="88.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="322.0" y1="400.0" x2="322.0" y2="488.0" class="grid" opacity=".75"/><line x1="344.0" y1="400.0" x2="344.0" y2="488.0" class="grid" opacity=".75"/><line x1="366.0" y1="400.0" x2="366.0" y2="488.0" class="grid" opacity=".75"/><line x1="300.0" y1="422.0" x2="388.0" y2="422.0" class="grid" opacity=".75"/><line x1="300.0" y1="444.0" x2="388.0" y2="444.0" class="grid" opacity=".75"/><line x1="300.0" y1="466.0" x2="388.0" y2="466.0" class="grid" opacity=".75"/></g><foreignObject x="289.0" y="492.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_2"></div></foreignObject><text x="406.0" y="450.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="424.0" y="400.0" width="110.0" height="88.0" rx="2" fill="#1B9BC2" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="446.0" y1="400.0" x2="446.0" y2="488.0" class="grid" opacity=".75"/><line x1="468.0" y1="400.0" x2="468.0" y2="488.0" class="grid" opacity=".75"/><line x1="490.0" y1="400.0" x2="490.0" y2="488.0" class="grid" opacity=".75"/><line x1="512.0" y1="400.0" x2="512.0" y2="488.0" class="grid" opacity=".75"/><line x1="424.0" y1="422.0" x2="534.0" y2="422.0" class="grid" opacity=".75"/><line x1="424.0" y1="444.0" x2="534.0" y2="444.0" class="grid" opacity=".75"/><line x1="424.0" y1="466.0" x2="534.0" y2="466.0" class="grid" opacity=".75"/></g><text x="479.0" y="392.0" font-size="13" fill="#111111" text-anchor="middle">5</text><foreignObject x="424.0" y="492.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W_2^{\top}"></div></foreignObject><text x="552.0" y="450.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="570.0" y="400.0" width="110.0" height="88.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="592.0" y1="400.0" x2="592.0" y2="488.0" class="grid" opacity=".75"/><line x1="614.0" y1="400.0" x2="614.0" y2="488.0" class="grid" opacity=".75"/><line x1="636.0" y1="400.0" x2="636.0" y2="488.0" class="grid" opacity=".75"/><line x1="658.0" y1="400.0" x2="658.0" y2="488.0" class="grid" opacity=".75"/><line x1="570.0" y1="422.0" x2="680.0" y2="422.0" class="grid" opacity=".75"/><line x1="570.0" y1="444.0" x2="680.0" y2="444.0" class="grid" opacity=".75"/><line x1="570.0" y1="466.0" x2="680.0" y2="466.0" class="grid" opacity=".75"/></g><text x="625.0" y="392.0" font-size="13" fill="#111111" text-anchor="middle">5</text><foreignObject x="570.0" y="492.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dA_1"></div></foreignObject></g><g data-key="rule" data-only="1"><text x="700.0" y="420.0" font-size="13" fill="#C30B0A" text-anchor="start">dW₂ — форма W₂ [5 × 4]</text><text x="700.0" y="440.0" font-size="13" fill="#C30B0A" text-anchor="start">db₂ — форма b₂ [1 × 4]</text><text x="700.0" y="460.0" font-size="13" fill="#C30B0A" text-anchor="start">dA₁ — форма A₁ [4 × 5]</text><foreignObject x="290.0" y="540.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dW = A_{in}^{\top}\, dZ, \qquad db = \textstyle\sum_i dZ_{i\cdot}, \qquad dA_{in} = dZ\, W^{\top}"></div></foreignObject></g><text x="20.0" y="604.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">красное — градиенты · зелёная клетка маски пропускает градиент, серая — нет</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl da" data-focus="hl da">
      <div class="step-kicker">Шаг 1 · что пришло</div>
      <h4>Слева прилетел dA₂</h4>
      <p>Из третьего слоя пришёл градиент по выходу второй ReLU — матрица той же формы <code>[4 × 4]</code>, что и A₂.</p>
    </div>
    <div class="step-panel" data-on="hl da mask dz" data-focus="mask dz">
      <div class="step-kicker">Шаг 2 · назад через ReLU</div>
      <h4>dZ₂ = dA₂ ⊙ [Z₂ &gt; 0]</h4>
      <p>Там, где на прямом проходе ReLU обнулила число, производная равна нулю — туда градиент не проходит. Там, где пропустила, — проходит без изменений. Маска та же самая, её хранят с прямого прохода.</p>
    </div>
    <div class="step-panel" data-on="hl dz dw" data-focus="dw">
      <div class="step-kicker">Шаг 3 · градиент весов</div>
      <h4>dW₂ = A₁ᵀ · dZ₂</h4>
      <p>Вход слоя, транспонированный, умноженный на градиент выхода: <code>[5 × 4] · [4 × 4] = [5 × 4]</code>. Чтобы посчитать градиент весов, нужно помнить вход слоя — поэтому фреймворки хранят активации всего прямого прохода.</p>
    </div>
    <div class="step-panel" data-on="hl dz dw db" data-focus="db">
      <div class="step-kicker">Шаг 4 · градиент смещений</div>
      <h4>db₂ — сумма dZ₂ по строкам</h4>
      <p>Одна строка b₂ участвовала в каждой строке Z₂. На прямом проходе было копирование — на обратном будет сумма. Это общее правило: копия вперёд ⇔ сумма назад.</p>
    </div>
    <div class="step-panel" data-on="hl dz dx" data-focus="dx">
      <div class="step-kicker">Шаг 5 · дальше влево</div>
      <h4>dA₁ = dZ₂ · W₂ᵀ</h4>
      <p><code>[4 × 4] · [4 × 5] = [4 × 5]</code>. Веса на обратном пути те же, только транспонированные: по каждому ребру, по которому число шло вперёд, градиент идёт назад с тем же весом.</p>
    </div>
    <div class="step-panel" data-on="hl dw db dx rule" data-focus="rule">
      <div class="step-kicker">Шаг 6 · правило форм</div>
      <h4>Форма градиента = форма величины</h4>
      <p>Три формулы, одинаковые для любого полносвязного слоя. Их даже не обязательно выводить: транспонирования и порядок множителей однозначно подсказывает требование, чтобы формы сошлись.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Вход — dA₂ из предыдущей части. В числах видно, как мёртвый нейрон первого слоя отражается в градиенте второго.</p>
<div class="stage" id="stage-bp2n" tabindex="0">
  <div class="stage-figure">
<svg id="bp2n" viewBox="0 0 960 610" role="img" aria-label="Числовой расчёт обратного прохода через второй слой">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: обратный проход через ReLU и второй слой</text><g data-key="da"><g><rect x="126.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="143.0" y1="70.0" x2="143.0" y2="138.0" class="grid" opacity=".75"/><line x1="160.0" y1="70.0" x2="160.0" y2="138.0" class="grid" opacity=".75"/><line x1="177.0" y1="70.0" x2="177.0" y2="138.0" class="grid" opacity=".75"/><line x1="126.0" y1="87.0" x2="194.0" y2="87.0" class="grid" opacity=".75"/><line x1="126.0" y1="104.0" x2="194.0" y2="104.0" class="grid" opacity=".75"/><line x1="126.0" y1="121.0" x2="194.0" y2="121.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="116.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="70.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dA_2"></div></foreignObject><foreignObject x="15.0" y="168.0" width="290.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0158 &amp; 0.0814 &amp; 0.1376 &amp; 0.0994 \\ -0.1073 &amp; -0.0397 &amp; 0.0530 &amp; -0.0433 \\ 0.1295 &amp; 0.0090 &amp; -0.1388 &amp; 0.0044 \\ -0.0997 &amp; -0.0477 &amp; 0.0284 &amp; -0.0536\end{bmatrix}"></div></foreignObject></g><g data-key="m"><text x="322.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="376.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#5E5850" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="393.0" y1="70.0" x2="393.0" y2="138.0" class="grid" opacity=".75"/><line x1="410.0" y1="70.0" x2="410.0" y2="138.0" class="grid" opacity=".75"/><line x1="427.0" y1="70.0" x2="427.0" y2="138.0" class="grid" opacity=".75"/><line x1="376.0" y1="87.0" x2="444.0" y2="87.0" class="grid" opacity=".75"/><line x1="376.0" y1="104.0" x2="444.0" y2="104.0" class="grid" opacity=".75"/><line x1="376.0" y1="121.0" x2="444.0" y2="121.0" class="grid" opacity=".75"/></g><text x="410.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="366.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="320.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[Z_2 &gt; 0]"></div></foreignObject><foreignObject x="335.0" y="168.0" width="150.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 &amp; 1 &amp; 0 &amp; 0 \\ 1 &amp; 1 &amp; 1 &amp; 1 \\ 1 &amp; 1 &amp; 1 &amp; 1 \\ 1 &amp; 1 &amp; 0 &amp; 1\end{bmatrix}"></div></foreignObject></g><g data-key="dz"><text x="500.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="626.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="643.0" y1="70.0" x2="643.0" y2="138.0" class="grid" opacity=".75"/><line x1="660.0" y1="70.0" x2="660.0" y2="138.0" class="grid" opacity=".75"/><line x1="677.0" y1="70.0" x2="677.0" y2="138.0" class="grid" opacity=".75"/><line x1="626.0" y1="87.0" x2="694.0" y2="87.0" class="grid" opacity=".75"/><line x1="626.0" y1="104.0" x2="694.0" y2="104.0" class="grid" opacity=".75"/><line x1="626.0" y1="121.0" x2="694.0" y2="121.0" class="grid" opacity=".75"/></g><text x="660.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="616.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="570.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_2"></div></foreignObject><foreignObject x="515.0" y="168.0" width="290.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0158 &amp; 0.0814 &amp; 0.0000 &amp; 0.0000 \\ -0.1073 &amp; -0.0397 &amp; 0.0530 &amp; -0.0433 \\ 0.1295 &amp; 0.0090 &amp; -0.1388 &amp; 0.0044 \\ -0.0997 &amp; -0.0477 &amp; 0.0000 &amp; -0.0536\end{bmatrix}"></div></foreignObject></g><g data-key="dw"><g><rect x="116.0" y="300.0" width="68.0" height="85.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="133.0" y1="300.0" x2="133.0" y2="385.0" class="grid" opacity=".75"/><line x1="150.0" y1="300.0" x2="150.0" y2="385.0" class="grid" opacity=".75"/><line x1="167.0" y1="300.0" x2="167.0" y2="385.0" class="grid" opacity=".75"/><line x1="116.0" y1="317.0" x2="184.0" y2="317.0" class="grid" opacity=".75"/><line x1="116.0" y1="334.0" x2="184.0" y2="334.0" class="grid" opacity=".75"/><line x1="116.0" y1="351.0" x2="184.0" y2="351.0" class="grid" opacity=".75"/><line x1="116.0" y1="368.0" x2="184.0" y2="368.0" class="grid" opacity=".75"/></g><text x="150.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="106.0" y="346.5" font-size="13" fill="#111111" text-anchor="end">5</text><foreignObject x="60.0" y="388.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dW_2 = A_1^{\top} dZ_2"></div></foreignObject><foreignObject x="10.0" y="415.0" width="280.0" height="123.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0295 &amp; 0.1526 &amp; 0.0000 &amp; 0.0000 \\ 0.0000 &amp; 0.0000 &amp; 0.0000 &amp; 0.0000 \\ -0.0368 &amp; 0.0286 &amp; 0.0225 &amp; -0.0184 \\ 0.0168 &amp; 0.1796 &amp; 0.0095 &amp; -0.0078 \\ 0.0204 &amp; -0.0413 &amp; -0.1195 &amp; -0.0518\end{bmatrix}"></div></foreignObject></g><g data-key="zrow" data-only="1"><rect x="116.0" y="317.0" width="68.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="20.0" y="590.0" font-size="13" fill="#C30B0A" text-anchor="start">строка 2 dW₂ — ровно ноль: второй столбец A₁ нулевой, мёртвому нейрону нечего сказать весам следующего слоя</text></g><g data-key="db"><g><rect x="406.0" y="300.0" width="68.0" height="17.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="423.0" y1="300.0" x2="423.0" y2="317.0" class="grid" opacity=".75"/><line x1="440.0" y1="300.0" x2="440.0" y2="317.0" class="grid" opacity=".75"/><line x1="457.0" y1="300.0" x2="457.0" y2="317.0" class="grid" opacity=".75"/></g><text x="440.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="396.0" y="312.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="350.0" y="320.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="db_2"></div></foreignObject><foreignObject x="300.0" y="347.0" width="280.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.0617 &amp; 0.0030 &amp; -0.0858 &amp; -0.0925\end{bmatrix}"></div></foreignObject></g><g data-key="dx"><g><rect x="727.5" y="300.0" width="85.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="744.5" y1="300.0" x2="744.5" y2="368.0" class="grid" opacity=".75"/><line x1="761.5" y1="300.0" x2="761.5" y2="368.0" class="grid" opacity=".75"/><line x1="778.5" y1="300.0" x2="778.5" y2="368.0" class="grid" opacity=".75"/><line x1="795.5" y1="300.0" x2="795.5" y2="368.0" class="grid" opacity=".75"/><line x1="727.5" y1="317.0" x2="812.5" y2="317.0" class="grid" opacity=".75"/><line x1="727.5" y1="334.0" x2="812.5" y2="334.0" class="grid" opacity=".75"/><line x1="727.5" y1="351.0" x2="812.5" y2="351.0" class="grid" opacity=".75"/></g><text x="770.0" y="292.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="717.5" y="338.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="680.0" y="371.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dA_1 = dZ_2 W_2^{\top}"></div></foreignObject><foreignObject x="605.0" y="398.0" width="330.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0097 &amp; 0.0276 &amp; 0.0373 &amp; 0.0307 &amp; 0.0896 \\ -0.0450 &amp; 0.0061 &amp; 0.0323 &amp; -0.0823 &amp; -0.0417 \\ 0.1370 &amp; -0.0421 &amp; -0.1792 &amp; 0.1373 &amp; -0.0170 \\ 0.0067 &amp; -0.0182 &amp; -0.0543 &amp; -0.0488 &amp; -0.0632\end{bmatrix}"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="da m" data-focus="da m">
      <div class="step-kicker">Шаг 1 · вход и маска</div>
      <h4>dA₂ и маска второго слоя</h4>
      <p>Маска та же, что на прямом проходе в части 6: три закрытые клетки.</p>
    </div>
    <div class="step-panel" data-on="da m dz" data-focus="dz">
      <div class="step-kicker">Шаг 2 · через ReLU</div>
      <h4>Три клетки градиента обнулены</h4>
      <p>У setosa градиенты 0.1376 и 0.0994 в третьем и четвёртом столбце погибли — эти нейроны на прямом проходе молчали. У второго versicolor погиб 0.0284.</p>
    </div>
    <div class="step-panel" data-on="dz dw zrow" data-focus="dw zrow">
      <div class="step-kicker">Шаг 3 · градиент весов</div>
      <h4>dW₂ [5 × 4] с нулевой строкой</h4>
      <p>Строка k матрицы dW₂ — это столбец k матрицы A₁ (транспонированный), умноженный на dZ₂. Второй нейрон первого слоя выдал нули на всём батче, поэтому все четыре веса, которые от него идут, получают градиент ровно 0 — ровно те веса, которые в части 6 «ни на что не влияли».</p>
    </div>
    <div class="step-panel" data-on="dz db" data-focus="db">
      <div class="step-kicker">Шаг 4 · смещения</div>
      <h4>db₂ = (−0.0617, 0.0030, −0.0858, −0.0925)</h4>
      <p>Сумма каждого столбца dZ₂. В отличие от выходного слоя, здесь сумма не ноль: скрытым смещениям ничто не запрещает двигаться все вместе.</p>
    </div>
    <div class="step-panel" data-on="dz dx" data-focus="dx">
      <div class="step-kicker">Шаг 5 · дальше влево</div>
      <h4>dA₁ [4 × 5]</h4>
      <p>Этот градиент уйдёт в первую ReLU. Во втором столбце у него, кстати, ненулевые числа (0.0276, 0.0061…) — сеть «хотела бы», чтобы мёртвый нейрон что-то сказал. Но маска первого слоя этот сигнал сейчас обнулит.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout-blue">
  <strong>Почему транспонирования именно такие?</strong> Проще всего проверять формами.
  <code>dW₂</code> обязан быть <code>[5 × 4]</code>; из имеющихся <code>A₁ [4 × 5]</code> и
  <code>dZ₂ [4 × 4]</code> такую форму даёт единственное произведение
  <span class="math-inline" data-tex="A_1^{\top} dZ_2"></span>. Суммирование по объектам при этом
  происходит само — внутренняя размерность произведения как раз B.
</div>
<div class="callout">
  <strong>Главная мысль части:</strong> на обратном пути ReLU умножает градиент на свою маску, а линейный слой отдаёт <span class="math-inline" data-tex="A^{\top}dZ"></span> весам, сумму строк смещению и <span class="math-inline" data-tex="dZ\,W^{\top}"></span> дальше влево — одинаково для любого слоя.
</div>

---


## Часть 12. Backprop: первый слой, проверка и шаг

<p>
  Первый слой — последняя остановка. Те же формулы, вход слоя — сама X:
</p>
<div class="math-display" data-tex="dZ_1 = dA_1 \odot [Z_1 &gt; 0], \qquad dW_1 = X^{\top} dZ_1, \qquad db_1 = \sum_i dZ_{1,i\cdot}"></div>
<div class="stage" id="stage-bp3" tabindex="0">
  <div class="stage-figure">
<svg id="bp3" viewBox="0 0 960 560" role="img" aria-label="Обратный проход через первый слой: dZ1, dW1 и db1">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: градиенты первого слоя</text><g data-key="da"><g><rect x="132.5" y="70.0" width="85.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="149.5" y1="70.0" x2="149.5" y2="138.0" class="grid" opacity=".75"/><line x1="166.5" y1="70.0" x2="166.5" y2="138.0" class="grid" opacity=".75"/><line x1="183.5" y1="70.0" x2="183.5" y2="138.0" class="grid" opacity=".75"/><line x1="200.5" y1="70.0" x2="200.5" y2="138.0" class="grid" opacity=".75"/><line x1="132.5" y1="87.0" x2="217.5" y2="87.0" class="grid" opacity=".75"/><line x1="132.5" y1="104.0" x2="217.5" y2="104.0" class="grid" opacity=".75"/><line x1="132.5" y1="121.0" x2="217.5" y2="121.0" class="grid" opacity=".75"/></g><text x="175.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="122.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="85.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dA_1"></div></foreignObject><foreignObject x="10.0" y="168.0" width="330.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0097 &amp; 0.0276 &amp; 0.0373 &amp; 0.0307 &amp; 0.0896 \\ -0.0450 &amp; 0.0061 &amp; 0.0323 &amp; -0.0823 &amp; -0.0417 \\ 0.1370 &amp; -0.0421 &amp; -0.1792 &amp; 0.1373 &amp; -0.0170 \\ 0.0067 &amp; -0.0182 &amp; -0.0543 &amp; -0.0488 &amp; -0.0632\end{bmatrix}"></div></foreignObject></g><g data-key="m"><text x="352.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="417.5" y="70.0" width="85.0" height="68.0" rx="2" fill="#5E5850" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="434.5" y1="70.0" x2="434.5" y2="138.0" class="grid" opacity=".75"/><line x1="451.5" y1="70.0" x2="451.5" y2="138.0" class="grid" opacity=".75"/><line x1="468.5" y1="70.0" x2="468.5" y2="138.0" class="grid" opacity=".75"/><line x1="485.5" y1="70.0" x2="485.5" y2="138.0" class="grid" opacity=".75"/><line x1="417.5" y1="87.0" x2="502.5" y2="87.0" class="grid" opacity=".75"/><line x1="417.5" y1="104.0" x2="502.5" y2="104.0" class="grid" opacity=".75"/><line x1="417.5" y1="121.0" x2="502.5" y2="121.0" class="grid" opacity=".75"/></g><text x="460.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="407.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="370.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[Z_1 &gt; 0]"></div></foreignObject><foreignObject x="370.0" y="168.0" width="180.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 &amp; 0 &amp; 1 &amp; 1 &amp; 0 \\ 0 &amp; 0 &amp; 1 &amp; 1 &amp; 1 \\ 0 &amp; 0 &amp; 0 &amp; 0 &amp; 1 \\ 0 &amp; 0 &amp; 0 &amp; 0 &amp; 1\end{bmatrix}"></div></foreignObject></g><g data-key="dz"><text x="572.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="727.5" y="70.0" width="85.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="744.5" y1="70.0" x2="744.5" y2="138.0" class="grid" opacity=".75"/><line x1="761.5" y1="70.0" x2="761.5" y2="138.0" class="grid" opacity=".75"/><line x1="778.5" y1="70.0" x2="778.5" y2="138.0" class="grid" opacity=".75"/><line x1="795.5" y1="70.0" x2="795.5" y2="138.0" class="grid" opacity=".75"/><line x1="727.5" y1="87.0" x2="812.5" y2="87.0" class="grid" opacity=".75"/><line x1="727.5" y1="104.0" x2="812.5" y2="104.0" class="grid" opacity=".75"/><line x1="727.5" y1="121.0" x2="812.5" y2="121.0" class="grid" opacity=".75"/></g><text x="770.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="717.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="680.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_1"></div></foreignObject><foreignObject x="605.0" y="168.0" width="330.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0097 &amp; 0.0000 &amp; 0.0373 &amp; 0.0307 &amp; 0.0000 \\ 0.0000 &amp; 0.0000 &amp; 0.0323 &amp; -0.0823 &amp; -0.0417 \\ 0.0000 &amp; 0.0000 &amp; 0.0000 &amp; 0.0000 &amp; -0.0170 \\ 0.0000 &amp; 0.0000 &amp; 0.0000 &amp; 0.0000 &amp; -0.0632\end{bmatrix}"></div></foreignObject></g><g data-key="zcol" data-only="1"><rect x="744.5" y="70.0" width="17.0" height="68.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="480.0" y="300.0" font-size="13" fill="#C30B0A" text-anchor="middle">столбец 2 dZ₁ — одни нули: маска мёртвого нейрона закрыта на всех объектах</text></g><g data-key="row3" data-only="1"><rect x="727.5" y="104.0" width="85.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="480.0" y="300.0" font-size="13" fill="#5F9420" text-anchor="middle">у virginica градиент проходит в первый слой через одну клетку: −0.0170</text></g><g data-key="dw"><g><rect x="207.5" y="330.0" width="85.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="224.5" y1="330.0" x2="224.5" y2="398.0" class="grid" opacity=".75"/><line x1="241.5" y1="330.0" x2="241.5" y2="398.0" class="grid" opacity=".75"/><line x1="258.5" y1="330.0" x2="258.5" y2="398.0" class="grid" opacity=".75"/><line x1="275.5" y1="330.0" x2="275.5" y2="398.0" class="grid" opacity=".75"/><line x1="207.5" y1="347.0" x2="292.5" y2="347.0" class="grid" opacity=".75"/><line x1="207.5" y1="364.0" x2="292.5" y2="364.0" class="grid" opacity=".75"/><line x1="207.5" y1="381.0" x2="292.5" y2="381.0" class="grid" opacity=".75"/></g><text x="250.0" y="322.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="197.5" y="368.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="160.0" y="401.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dW_1 = X^{\top} dZ_1"></div></foreignObject><foreignObject x="85.0" y="428.0" width="330.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.0087 &amp; 0.0000 &amp; -0.0391 &amp; -0.0137 &amp; -0.0109 \\ 0.0099 &amp; 0.0000 &amp; 0.0190 &amp; 0.0799 &amp; -0.0018 \\ -0.0130 &amp; 0.0000 &amp; -0.0364 &amp; -0.0757 &amp; -0.0677 \\ -0.0128 &amp; 0.0000 &amp; -0.0450 &amp; -0.0513 &amp; -0.0732\end{bmatrix}"></div></foreignObject></g><g data-key="db"><g><rect x="657.5" y="330.0" width="85.0" height="17.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="674.5" y1="330.0" x2="674.5" y2="347.0" class="grid" opacity=".75"/><line x1="691.5" y1="330.0" x2="691.5" y2="347.0" class="grid" opacity=".75"/><line x1="708.5" y1="330.0" x2="708.5" y2="347.0" class="grid" opacity=".75"/><line x1="725.5" y1="330.0" x2="725.5" y2="347.0" class="grid" opacity=".75"/></g><text x="700.0" y="322.0" font-size="13" fill="#111111" text-anchor="middle">5</text><text x="647.5" y="342.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="610.0" y="350.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="db_1"></div></foreignObject><foreignObject x="535.0" y="377.0" width="330.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0097 &amp; 0.0000 &amp; 0.0696 &amp; -0.0515 &amp; -0.1219\end{bmatrix}"></div></foreignObject></g><g data-key="wcol" data-only="1"><rect x="224.5" y="330.0" width="17.0" height="68.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="674.5" y="330.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="480.0" y="548.0" font-size="13" fill="#C30B0A" text-anchor="middle">девять параметров мёртвого нейрона (столбец W₁ и b₁[2]) получают градиент 0</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="da m dz" data-focus="dz">
      <div class="step-kicker">Шаг 1 · через ReLU</div>
      <h4>dZ₁ = dA₁ ⊙ [Z₁ &gt; 0]</h4>
      <p>Двенадцать из двадцати клеток обнулены — ровно те, где нейроны первого слоя молчали. Минус перед нулём в некоторых клетках — просто знак крошечного отрицательного числа, умноженного на 0.</p>
    </div>
    <div class="step-panel" data-on="dz zcol" data-focus="zcol">
      <div class="step-kicker">Шаг 2 · мёртвый столбец</div>
      <h4>Градиент до второго нейрона не доходит</h4>
      <p>dA₁ во втором столбце был ненулевым, но маска закрыта на всех четырёх цветках. Для этого батча производная потери по весам нейрона 2 — строго ноль.</p>
    </div>
    <div class="step-panel" data-on="dz row3" data-focus="row3">
      <div class="step-kicker">Шаг 3 · узкое горло</div>
      <h4>Virginica учит только пятый нейрон</h4>
      <p>На прямом проходе третий цветок прошёл через один нейрон — на обратном градиент от него доходит тоже только до одного. Поэтому ошибка на virginica поправит лишь столбец 5 матрицы W₁.</p>
    </div>
    <div class="step-panel" data-on="dz dw db wcol" data-focus="dw db wcol">
      <div class="step-kicker">Шаг 4 · градиенты весов</div>
      <h4>dW₁ = Xᵀ · dZ₁ и db₁</h4>
      <p><code>[4 × 4] · [4 × 5] = [4 × 5]</code>. Второй столбец dW₁ и второе число db₁ — нули. Это последние градиенты: теперь известны производные по всем 64 параметрам.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<p>
  Формулы выведены руками — значит, их надо проверить. Самый надёжный способ — конечные
  разности: сдвинуть параметр на ±ε и посмотреть, как меняется потеря:
</p>
<div class="math-display" data-tex="\frac{\partial L}{\partial \theta} \approx \frac{L(\theta + \varepsilon) - L(\theta - \varepsilon)}{2\varepsilon}"></div>
<p>
  А после проверки — сделать то, ради чего всё считалось: сдвинуть веса против градиента.
</p>
<div class="math-display" data-tex="W \leftarrow W - \eta\, dW, \qquad b \leftarrow b - \eta\, db"></div>
<div class="stage" id="stage-tr" tabindex="0">
  <div class="stage-figure">
<svg id="tr" viewBox="0 0 960 560" role="img" aria-label="Сверка градиентов и кривые обучения на батче при двух шагах обучения">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Проверка градиента и несколько шагов обучения</text><g data-key="check"><text x="30.0" y="80.0" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">параметр</text><text x="150.0" y="80.0" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">форма</text><text x="250.0" y="80.0" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">max |аналитика − разности|</text><line x1="30" y1="90" x2="440" y2="90" stroke="#E0DDD3" stroke-width="1.2"/><text x="30.0" y="116.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">W₁</text><text x="150.0" y="116.0" font-size="14" fill="#111111" text-anchor="start">[4 × 5]</text><text x="250.0" y="116.0" font-size="14" fill="#5F9420" text-anchor="start">1,0 · 10<tspan baseline-shift="super" font-size="11">-10</tspan></text><text x="30.0" y="146.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">b₁</text><text x="150.0" y="146.0" font-size="14" fill="#111111" text-anchor="start">[1 × 5]</text><text x="250.0" y="146.0" font-size="14" fill="#5F9420" text-anchor="start">8,0 · 10<tspan baseline-shift="super" font-size="11">-11</tspan></text><text x="30.0" y="176.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">W₂</text><text x="150.0" y="176.0" font-size="14" fill="#111111" text-anchor="start">[5 × 4]</text><text x="250.0" y="176.0" font-size="14" fill="#5F9420" text-anchor="start">9,2 · 10<tspan baseline-shift="super" font-size="11">-11</tspan></text><text x="30.0" y="206.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">b₂</text><text x="150.0" y="206.0" font-size="14" fill="#111111" text-anchor="start">[1 × 4]</text><text x="250.0" y="206.0" font-size="14" fill="#5F9420" text-anchor="start">8,6 · 10<tspan baseline-shift="super" font-size="11">-11</tspan></text><text x="30.0" y="236.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">W₃</text><text x="150.0" y="236.0" font-size="14" fill="#111111" text-anchor="start">[4 × 3]</text><text x="250.0" y="236.0" font-size="14" fill="#5F9420" text-anchor="start">7,1 · 10<tspan baseline-shift="super" font-size="11">-11</tspan></text><text x="30.0" y="266.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">b₃</text><text x="150.0" y="266.0" font-size="14" fill="#111111" text-anchor="start">[1 × 3]</text><text x="250.0" y="266.0" font-size="14" fill="#5F9420" text-anchor="start">1,2 · 10<tspan baseline-shift="super" font-size="11">-10</tspan></text><text x="30.0" y="310.0" font-size="13" fill="#5E5850" text-anchor="start">центральные разности, ε = 10⁻⁶, все 64 параметра</text></g><g data-key="eps" data-only="1"><text x="30.0" y="350.0" font-size="13" fill="#C30B0A" text-anchor="start">при ε = 0.05 для b₂[3] разности дают −0.0442</text><text x="30.0" y="368.0" font-size="13" fill="#C30B0A" text-anchor="start">вместо −0.0858: шаг перепрыгнул излом ReLU</text><text x="30.0" y="386.0" font-size="13" fill="#C30B0A" text-anchor="start">у третьего цветка (z = 0.0204)</text></g><line x1="520" y1="420" x2="920" y2="420" stroke="#8A857C" stroke-width="1.2"/><line x1="520" y1="420" x2="520" y2="100" stroke="#8A857C" stroke-width="1.2"/><text x="512.0" y="424.0" font-size="12" fill="#5E5850" text-anchor="end">0,0</text><line x1="520" y1="420" x2="920" y2="420" stroke="#EFECE4" stroke-width="1"/><text x="512.0" y="360.0" font-size="12" fill="#5E5850" text-anchor="end">0,5</text><line x1="520" y1="356.0" x2="920" y2="356.0" stroke="#EFECE4" stroke-width="1"/><text x="512.0" y="296.0" font-size="12" fill="#5E5850" text-anchor="end">1,0</text><line x1="520" y1="292.0" x2="920" y2="292.0" stroke="#EFECE4" stroke-width="1"/><text x="512.0" y="232.0" font-size="12" fill="#5E5850" text-anchor="end">1,5</text><line x1="520" y1="228.0" x2="920" y2="228.0" stroke="#EFECE4" stroke-width="1"/><text x="512.0" y="168.0" font-size="12" fill="#5E5850" text-anchor="end">2,0</text><line x1="520" y1="164.0" x2="920" y2="164.0" stroke="#EFECE4" stroke-width="1"/><text x="512.0" y="104.0" font-size="12" fill="#5E5850" text-anchor="end">2,5</text><line x1="520" y1="100.0" x2="920" y2="100.0" stroke="#EFECE4" stroke-width="1"/><text x="520.0" y="438.0" font-size="12" fill="#5E5850" text-anchor="middle">0</text><text x="620.0" y="438.0" font-size="12" fill="#5E5850" text-anchor="middle">25</text><text x="720.0" y="438.0" font-size="12" fill="#5E5850" text-anchor="middle">50</text><text x="820.0" y="438.0" font-size="12" fill="#5E5850" text-anchor="middle">75</text><text x="920.0" y="438.0" font-size="12" fill="#5E5850" text-anchor="middle">100</text><text x="920.0" y="456.0" font-size="12" fill="#5E5850" text-anchor="end">шаг обучения</text><text x="526.0" y="92.0" font-size="13" fill="#5E5850" text-anchor="start" font-style="italic">L</text><g data-key="c05"><polyline points="520.0,290.3 524.0,306.9 528.0,318.9 532.0,329.3 536.0,338.1 540.0,346.0 544.0,352.6 548.0,357.9 552.0,362.1 556.0,364.8 560.0,368.9 564.0,372.6 568.0,375.1 572.0,376.7 576.0,378.9 580.0,379.6 584.0,377.9 588.0,374.8 592.0,373.1 596.0,372.4 600.0,379.1 604.0,384.0 608.0,388.0 612.0,394.0 616.0,396.1 620.0,401.5 624.0,402.9 628.0,406.0 632.0,407.9 636.0,409.1 640.0,409.9 644.0,410.8 648.0,411.6 652.0,412.2 656.0,412.8 660.0,413.3 664.0,413.8 668.0,414.3 672.0,414.6 676.0,415.0 680.0,415.3 684.0,415.5 688.0,415.8 692.0,416.0 696.0,416.2 700.0,416.4 704.0,416.6 708.0,416.8 712.0,416.9 716.0,417.1 720.0,417.2 724.0,417.3 728.0,417.4 732.0,417.5 736.0,417.6 740.0,417.7 744.0,417.8 748.0,417.9 752.0,418.0 756.0,418.0 760.0,418.1 764.0,418.2 768.0,418.2 772.0,418.3 776.0,418.3 780.0,418.4 784.0,418.4 788.0,418.5 792.0,418.5 796.0,418.6 800.0,418.6 804.0,418.6 808.0,418.7 812.0,418.7 816.0,418.7 820.0,418.8 824.0,418.8 828.0,418.8 832.0,418.9 836.0,418.9 840.0,418.9 844.0,418.9 848.0,419.0 852.0,419.0 856.0,419.0 860.0,419.0 864.0,419.1 868.0,419.1 872.0,419.1 876.0,419.1 880.0,419.1 884.0,419.1 888.0,419.2 892.0,419.2 896.0,419.2 900.0,419.2 904.0,419.2 908.0,419.2 912.0,419.2 916.0,419.3 920.0,419.3" fill="none" stroke="#4E9A38" stroke-width="2.6"/><text x="660.0" y="350.0" font-size="12" fill="#4E9A38" text-anchor="start" font-weight="700">η = 0.5: 1.0133 → 0.8839 → … → 0.0057</text></g><g data-key="c3" data-only="1"><polyline points="520.0,290.3 524.0,339.6 528.0,192.4 532.0,109.7 536.0,100.0 540.0,272.0 544.0,286.9 548.0,286.9 552.0,286.9 556.0,286.9 560.0,286.9 564.0,286.9 568.0,286.9 572.0,286.9 576.0,286.9 580.0,286.9 584.0,286.9 588.0,286.9 592.0,286.9 596.0,286.9 600.0,286.9 604.0,286.9 608.0,286.9 612.0,286.9 616.0,286.9 620.0,286.9 624.0,286.9 628.0,286.9 632.0,286.9 636.0,286.9 640.0,286.9 644.0,286.9 648.0,286.9 652.0,286.9 656.0,286.9 660.0,286.9 664.0,286.9 668.0,286.9 672.0,286.9 676.0,286.9 680.0,286.9 684.0,286.9 688.0,286.9 692.0,286.9 696.0,286.9 700.0,286.9 704.0,286.9 708.0,286.9 712.0,286.9 716.0,286.9 720.0,286.9 724.0,286.9 728.0,286.9 732.0,286.9 736.0,286.9 740.0,286.9 744.0,286.9 748.0,286.9 752.0,286.9 756.0,286.9 760.0,286.9 764.0,286.9 768.0,286.9 772.0,286.9 776.0,286.9 780.0,286.9 784.0,286.9 788.0,286.9 792.0,286.9 796.0,286.9 800.0,286.9 804.0,286.9 808.0,286.9 812.0,286.9 816.0,286.9 820.0,286.9 824.0,286.9 828.0,286.9 832.0,286.9 836.0,286.9 840.0,286.9 844.0,286.9 848.0,286.9 852.0,286.9 856.0,286.9 860.0,286.9 864.0,286.9 868.0,286.9 872.0,286.9 876.0,286.9 880.0,286.9 884.0,286.9 888.0,286.9 892.0,286.9 896.0,286.9 900.0,286.9 904.0,286.9 908.0,286.9 912.0,286.9 916.0,286.9 920.0,286.9" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="590.0" y="276.9" font-size="12" fill="#C30B0A" text-anchor="start" font-weight="700">η = 3: застряла на 1.0397</text></g><g data-key="dead" data-only="1"><text x="30.0" y="440.0" font-size="13" fill="#C30B0A" text-anchor="start" font-weight="700">мёртвый нейрон 2 после 100 шагов при η = 0.5:</text><text x="30.0" y="460.0" font-size="13" fill="#C30B0A" text-anchor="start">столбец W₁, b₁[2] и строка W₂ совпадают</text><text x="30.0" y="480.0" font-size="13" fill="#C30B0A" text-anchor="start">с начальными значениями до последнего бита</text></g>
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
      <h4>Аналитика против конечных разностей</h4>
      <p>Каждый из 64 параметров сдвигаем на ±10⁻⁶, пересчитываем потерю и делим разность на 2·10⁻⁶. Худшее расхождение с формулами обратного прохода — 1,2·10⁻¹⁰: выкладки верны.</p>
    </div>
    <div class="step-panel" data-on="check eps" data-focus="eps">
      <div class="step-kicker">Шаг 2 · где проверка ломается</div>
      <h4>Большой ε перешагивает излом ReLU</h4>
      <p>У третьего цветка пред-активация третьего нейрона второго слоя всего 0.0204. Сдвиг смещения на 0.05 закрывает этот нейрон, и разность считает производную «с другой стороны» излома. Это не ошибка градиента, а ограничение проверки: ε должен быть меньше расстояния до ближайшего излома.</p>
    </div>
    <div class="step-panel" data-on="c05" data-focus="c05">
      <div class="step-kicker">Шаг 3 · обучение</div>
      <h4>Сдвиг против градиента уменьшает потерю</h4>
      <p>При η = 0.5 первый шаг опускает L с 1.0133 до 0.8839, за 100 шагов — до 0.0057, и все четыре цветка названы верно. Сеть с 64 параметрами легко запоминает четыре объекта; настоящее обучение идёт на всём наборе и проверяется на отложенных данных.</p>
    </div>
    <div class="step-panel" data-on="c05 c3" data-focus="c3">
      <div class="step-kicker">Шаг 4 · слишком большой шаг</div>
      <h4>При η = 3 сеть умирает</h4>
      <p>Второй шаг выбрасывает потерю до 1.78, веса второго слоя уходят в минус, и все 16 клеток A₂ закрываются. Дальше градиент через ReLU не проходит, учится только b₃ — и выход застывает на (0.25, 0.50, 0.25): доле классов в батче. L = 1.0397 — энтропия меток, лучшее, что можно сделать без входа.</p>
    </div>
    <div class="step-panel" data-on="c05 dead" data-focus="dead">
      <div class="step-kicker">Шаг 5 · мёртвый навсегда</div>
      <h4>Нейрон 2 так и не проснулся</h4>
      <p>Его девять параметров не сдвинулись ни на бит за 100 шагов: на этом батче их градиент тождественно ноль. На полном наборе такой нейрон может ожить, если найдётся цветок, на котором его z станет положительным; если нет — он мёртв для всех данных.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout-yellow">
  <strong>Две вещи, которые видны только в числах.</strong> Первый шаг при η = 0.5 опускает
  среднюю потерю, но вероятность правильного класса у virginica при этом чуть падает: 0.3635 → 0.3631.
  Шаг спуска улучшает сумму, а не каждое слагаемое. И второе: мёртвый нейрон не лечится
  обучением на тех же данных — ни одного ненулевого градиента, ни одного сдвига.
</div>
<div class="callout">
  <strong>Главная мысль части:</strong> одна итерация обучения — прямой проход, обратный проход по формулам из части 11 и сдвиг всех параметров против градиента; правильность формул проверяется конечными разностями, а размер шага решает, учится сеть или умирает.
</div>

---


## Часть 13. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Объект — строка.</strong> Батч — матрица <code>[B × d]</code>; число строк B не меняется ни в одном слое.</li>
  <li><strong>Нейрон — столбец весов.</strong> Его работа — скалярное произведение строки на столбец плюс смещение.</li>
  <li><strong>Слой — одно умножение:</strong> <span class="math-inline" data-tex="Z = XW + b"></span>,
      <code>[B × d_in] · [d_in × d_out] + [1 × d_out]</code>; смещение растягивается на все строки.</li>
  <li><strong>ReLU поэлементна:</strong> форма та же, параметров нет, маска <span class="math-inline" data-tex="[Z > 0]"></span> своя у каждого объекта.</li>
  <li><strong>Слои сцепляются формами:</strong> строк у следующей W столько, сколько столбцов у предыдущей.</li>
  <li><strong>Без нелинейности глубины нет:</strong> <span class="math-inline" data-tex="W_1 W_2 W_3"></span> — это одна матрица.</li>
  <li><strong>Softmax — по строке,</strong> кросс-энтропия — минус логарифм вероятности правильного класса, усреднённый по батчу; ориентир — <span class="math-inline" data-tex="\ln C"></span>.</li>
  <li><strong>Первый градиент</strong> — <span class="math-inline" data-tex="(P - Y)/B"></span>; сумма каждой его строки равна нулю.</li>
  <li><strong>Три формулы линейного слоя назад:</strong> <span class="math-inline" data-tex="dW = A^{\top} dZ"></span>,
      <span class="math-inline" data-tex="db = \sum_i dZ"></span>, <span class="math-inline" data-tex="dA = dZ\,W^{\top}"></span>.</li>
  <li><strong>ReLU назад — та же маска:</strong> через закрытую клетку градиент не проходит; нейрон, закрытый на всём батче, не учится.</li>
  <li><strong>Форма градиента = форма величины.</strong> Это самая дешёвая проверка выкладок; самая надёжная — конечные разности.</li>
</ol>

<p>
  Если держать в голове одну картину — пусть это будет цепочка форм туда и обратно:
  <code>[4 × 4] → [4 × 5] → [4 × 4] → [4 × 3] → L</code> и потом
  <code>L → [4 × 3] → [4 × 4] → [4 × 5]</code> с градиентами весов
  <code>[4 × 3]</code>, <code>[5 × 4]</code>, <code>[4 × 5]</code> по дороге.
  Любая полносвязная сеть, сколько бы в ней ни было слоёв, — подробный рассказ о том, как из
  одной формы получается следующая.
</p>

<div class="callout-yellow">
  <strong>Мелочи соглашений,</strong> которые стоит держать в уме, сверяя с другими источниками:
  в PyTorch матрица весов линейного слоя хранится транспонированной (<code>[d_out × d_in]</code>);
  потеря по умолчанию усредняется по батчу, поэтому в первом градиенте стоит 1/B — при суммировании
  его нет, и шаг обучения приходится подбирать заново; во многих учебниках объекты записывают
  столбцами, и тогда все формулы этой статьи надо читать транспонированными.
</div>

<p class="tiny">
  Сквозной пример: четыре объекта набора Iris (номера 0, 55, 110, 70 — setosa, versicolor,
  virginica, versicolor), четыре признака стандартизованы по всем 150 цветкам и округлены до двух
  знаков. Сеть 4 → 5 → 4 → 3 с ReLU, 64 параметра; веса и смещения взяты из нормального распределения
  (numpy default_rng(146), масштаб √(2/n<sub>in</sub> ) для весов и 0,3 для смещений) и округлены до десятых —
  сеть не обучена, поэтому угадан один цветок из четырёх, а потеря 1,0133 близка к ln 3 = 1,0986.
  Прямой и обратный проход написаны на numpy вручную; аналитические градиенты сверены с центральными
  разностями при <span class="math-inline" data-tex="\varepsilon = 10^{-6}"></span> по всем 64 параметрам —
  худшее расхождение 1,2 · 10<sup>−10</sup>. Сеть без ReLU совпала с одним линейным слоем
  с точностью 5,6 · 10<sup>−16</sup>. Кривые обучения — 100 шагов градиентного спуска на том же батче.
  В матрицах показаны округлённые значения, считалось всё в двойной точности.
</p>
