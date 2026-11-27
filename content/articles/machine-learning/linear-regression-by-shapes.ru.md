



<p class="lead">
  Линейная регрессия — это один линейный слой с одним выходом и без активации, обученный на
  среднем квадрате ошибки. Если следить за формами <code>[B × d]</code>, у неё есть два пути к
  ответу: одна формула — проекция вектора ответов на пространство столбцов — и градиентный спуск,
  тот же, что у любой нейросети. Оба пути приходят в одну точку.
</p>

<p>
  Статья устроена так же, как разборы трансформера, полносвязной, рекуррентной и свёрточной сетей
  по формам матриц: к каждой части — сцена, где матрицы нарисованы блоками без чисел, и сразу за
  ней «Те же шаги в числах». Сквозной пример — четыре квартиры с двумя признаками; числа подобраны
  так, чтобы всё проверялось в уме, а точное решение выражалось дробями со знаменателем 23.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Умножение матриц</strong>
    <p>Достаточно помнить <code>[a × b] · [b × c] = [a × c]</code> и что такое транспонирование.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Четыре квартиры</strong>
    <p>B = 4, признаки — площадь и возраст дома, ответ — цена; старт w = (2, −1), b = 1.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Регрессия без чёрных ящиков</strong>
    <p>Вы сможете вывести нормальные уравнения из геометрии, записать градиент в матрицах и объяснить, когда какой путь выбрать.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#73B222"></i>X — признаки</span>
  <span><i style="background:#9A9489"></i>Y — ответы</span>
  <span><i style="background:#C29E08"></i>W, b, θ и предсказания Ŷ</span>
  <span><i style="background:#C30B0A"></i>остатки и проблемы</span>
  <span><i style="background:#D83BB9"></i>градиенты</span>
  <span><i style="background:#3576C0"></i>вспомогательные матрицы</span>
</div>
<p class="tiny">Тёмный блок — обучаемые параметры, светлый блок того же цвета — то, что из них посчитано. На картах прямого прохода зелёная стрелка — движение вперёд, красная — обратный проход.</p>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не на всю
  схему сразу, а только на яркую часть. Слева в каждой сцене форм — карта вычислений: красная
  рамка показывает, какой блок разбирается сейчас. Стрелки на клавиатуре работают, когда сцена в фокусе.
</div>


## Часть 1. Общая схема: нейрон без активации

<p>
  Регрессия предсказывает число: цену, температуру, время. Линейная регрессия делает это
  взвешенной суммой признаков плюс смещение. Если нарисовать её так же, как нейросеть, получится
  один нейрон — без функции активации.
</p>
<div class="stage" id="stage-ar" tabindex="0">
  <div class="stage-figure">
<svg id="ar" viewBox="0 0 960 540" role="img" aria-label="Линейная регрессия: нейрон без активации и сравнение предсказаний с ответами">
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
<g data-key="in"><circle cx="150" cy="170" r="20" fill="#FFFFFF" stroke="#73B222" stroke-width="2.2"/><text x="150.0" y="175.0" font-size="13" fill="#111111" text-anchor="middle">x₁</text><text x="120.0" y="175.0" font-size="13" fill="#5E5850" text-anchor="end">x₁ площадь</text><circle cx="150" cy="300" r="20" fill="#FFFFFF" stroke="#73B222" stroke-width="2.2"/><text x="150.0" y="305.0" font-size="13" fill="#111111" text-anchor="middle">x₂</text><text x="120.0" y="305.0" font-size="13" fill="#5E5850" text-anchor="end">x₂ возраст</text></g><g data-key="w"><line x1="170" y1="170" x2="318" y2="235" stroke="#C29E08" stroke-width="2"/><line x1="170" y1="300" x2="318" y2="235" stroke="#C29E08" stroke-width="2"/><text x="245.0" y="190.0" font-size="13" fill="#A5850A" text-anchor="middle" font-weight="700">w₁</text><text x="245.0" y="292.0" font-size="13" fill="#A5850A" text-anchor="middle" font-weight="700">w₂</text><circle cx="350" cy="235" r="32" fill="#FFFFFF" stroke="#C29E08" stroke-width="2.2"/><text x="350.0" y="243.0" font-size="22" fill="#111111" text-anchor="middle">Σ</text><path d="M 350.0 310.0 L 350.0 269.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="350.0" y="328.0" font-size="13" fill="#A5850A" text-anchor="middle" font-weight="700">+ b</text></g><g data-key="out"><path d="M 382.0 235.0 L 452.0 235.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="472.0" y="240.0" font-size="18" fill="#111111" text-anchor="middle" font-weight="700">ŷ</text><text x="420.0" y="262.0" font-size="12" fill="#5E5850" text-anchor="middle">без активации</text></g><g data-key="bars"><line x1="570" y1="450" x2="930" y2="450" stroke="#8A857C"/><rect x="590" y="300.0" width="26" height="150.0" fill="#9A9489" opacity="0.6"/><text x="603.0" y="468.0" font-size="12" fill="#5E5850" text-anchor="middle">кв. 1</text><rect x="675" y="300.0" width="26" height="150.0" fill="#9A9489" opacity="0.6"/><text x="688.0" y="468.0" font-size="12" fill="#5E5850" text-anchor="middle">кв. 2</text><rect x="760" y="420.0" width="26" height="30.0" fill="#9A9489" opacity="0.6"/><text x="773.0" y="468.0" font-size="12" fill="#5E5850" text-anchor="middle">кв. 3</text><rect x="845" y="270.0" width="26" height="180.0" fill="#9A9489" opacity="0.6"/><text x="858.0" y="468.0" font-size="12" fill="#5E5850" text-anchor="middle">кв. 4</text><text x="640.0" y="96.0" font-size="12" fill="#5E5850" text-anchor="start">серые — настоящие цены y</text></g><g data-key="pred"><rect x="620" y="330.0" width="26" height="120.0" fill="#C29E08" opacity="0.8"/><rect x="705" y="270.0" width="26" height="180.0" fill="#C29E08" opacity="0.8"/><rect x="790" y="450.0" width="26" height="0.1" fill="#C29E08" opacity="0.8"/><rect x="875" y="240.0" width="26" height="210.0" fill="#C29E08" opacity="0.8"/><text x="640.0" y="114.0" font-size="12" fill="#A5850A" text-anchor="start">жёлтые — предсказания ŷ</text></g><g data-key="res"><path d="M 650 300.0 L 650 330.0" fill="none" stroke="#C30B0A" stroke-width="2.6"/><circle cx="650" cy="300.0" r="3" fill="#C30B0A"/><path d="M 735 300.0 L 735 270.0" fill="none" stroke="#C30B0A" stroke-width="2.6"/><circle cx="735" cy="300.0" r="3" fill="#C30B0A"/><path d="M 820 420.0 L 820 450.0" fill="none" stroke="#C30B0A" stroke-width="2.6"/><circle cx="820" cy="420.0" r="3" fill="#C30B0A"/><path d="M 905 270.0 L 905 240.0" fill="none" stroke="#C30B0A" stroke-width="2.6"/><circle cx="905" cy="270.0" r="3" fill="#C30B0A"/><text x="640.0" y="132.0" font-size="12" fill="#C30B0A" text-anchor="start">красные — остатки r = ŷ − y</text></g><g data-key="loss" data-only="1"><rect x="300" y="400" width="220" height="44" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.6"/><text x="410.0" y="427.0" font-size="14" fill="#111111" text-anchor="middle" font-weight="800">L = среднее r² = 1</text></g><text x="20.0" y="528.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">зелёное — признаки · жёлтое — веса и предсказания · серое — ответы · красное — ошибки</text>
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
      <h4>Два числа о квартире</h4>
      <p>Площадь в десятках квадратных метров и возраст дома в десятках лет. Задача — предсказать цену в миллионах.</p>
    </div>
    <div class="step-panel" data-on="in w" data-focus="w">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>Взвешенная сумма и смещение</h4>
      <p>Каждому признаку — свой вес, плюс общее смещение b. Это тот же нейрон, что в полносвязной сети.</p>
    </div>
    <div class="step-panel" data-on="in w out" data-focus="out">
      <div class="step-kicker">Шаг 3 · выход</div>
      <h4>Без активации</h4>
      <p>Главное отличие от нейросети: ответ ŷ не проходит через ReLU или сигмоиду. Линейная регрессия — один линейный слой с одним выходом, и всё.</p>
    </div>
    <div class="step-panel" data-on="out bars pred" data-focus="bars pred">
      <div class="step-kicker">Шаг 4 · предсказания</div>
      <h4>Четыре квартиры: y и ŷ</h4>
      <p>При w = (2, −1), b = 1 модель предсказывает 4, 6, 0, 7 миллионов при настоящих 5, 5, 1, 6.</p>
    </div>
    <div class="step-panel" data-on="bars pred res" data-focus="res">
      <div class="step-kicker">Шаг 5 · остатки</div>
      <h4>Ошибка на каждом объекте</h4>
      <p>Остаток r = ŷ − y: −1, +1, −1, +1. Две квартиры недооценены, две переоценены ровно на миллион.</p>
    </div>
    <div class="step-panel" data-on="in w out res loss" data-focus="loss">
      <div class="step-kicker">Шаг 6 · потеря</div>
      <h4>MSE — среднее квадратов</h4>
      <p>Квадраты остатков — единицы, их среднее L = 1. Обучение — это поиск w и b, при которых это число минимально. Дальше статья разбирает каждый шаг в форме матриц.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Сначала — карта всех вычислений: что течёт между блоками и какой формы.</p>
<div class="stage" id="stage-arn" tabindex="0">
  <div class="stage-figure">
<svg id="arn" viewBox="0 0 960 470" role="img" aria-label="Карта вычислений линейной регрессии с размерностями">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Пайплайн с размерностями: где какая матрица</text><g data-key="c0"><rect x="48" y="70" width="64" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="80" y="150" transform="rotate(-90 80 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Вход X</text></g><g data-key="c1"><rect x="228" y="70" width="64" height="150" rx="10" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.8"/><text x="260" y="150" transform="rotate(-90 260 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear</text><rect x="198" y="234" width="124" height="32" rx="7" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.4"/><text x="260.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W [2×1] · b [1]</text></g><g data-key="c2"><rect x="408" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="440" y="150" transform="rotate(-90 440 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Ŷ − Y</text><rect x="378" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.4"/><text x="440.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c3"><rect x="588" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="620" y="150" transform="rotate(-90 620 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">квадрат</text><rect x="558" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.4"/><text x="620.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c4"><rect x="768" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#C30B0A" stroke-width="1.8"/><text x="800" y="150" transform="rotate(-90 800 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">среднее</text><rect x="738" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#C30B0A" stroke-width="1.4"/><text x="800.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><path d="M 115.0 145.0 L 225.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="170.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">X</text><text x="170.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 2]</text><path d="M 295.0 145.0 L 405.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="350.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Ŷ</text><text x="350.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 475.0 145.0 L 585.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="530.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">R</text><text x="530.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 655.0 145.0 L 765.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="710.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">R²</text><text x="710.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 835.0 145.0 L 948.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="891.5" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">L</text><text x="891.5" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[1]</text><g data-key="yy"><path d="M 440.0 320.0 L 440.0 224.0" fill="none" stroke="#5E5850" stroke-width="1.6" marker-end="url(#arn-arw)"/><text x="440.0" y="338.0" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="700">Y [4 × 1]</text></g><g data-key="par"><rect x="150" y="400" width="84" height="32" rx="3" fill="#C29E08" opacity="0.9"/><text x="192.0" y="421.0" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="800">w₁ w₂</text><rect x="234" y="400" width="42" height="32" rx="3" fill="#A5850A"/><text x="255.0" y="421.0" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="800">b</text><text x="290.0" y="421.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">= 3 параметра — вся модель</text></g>
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
      <div class="step-kicker">Шаг 1 · линейный слой</div>
      <h4>[4 × 2] · [2 × 1] + [1] = [4 × 1]</h4>
      <p>Батч из четырёх квартир — матрица <code>X [4 × 2]</code>. Веса — столбец <code>W [2 × 1]</code>, смещение — одно число. Выход — столбец предсказаний.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 yy" data-focus="c2 yy">
      <div class="step-kicker">Шаг 2 · остатки</div>
      <h4>Вычитаем правильные ответы</h4>
      <p>Y той же формы <code>[4 × 1]</code>; разность R — ошибка на каждом объекте.</p>
    </div>
    <div class="step-panel" data-on="c2 c3" data-focus="c3">
      <div class="step-kicker">Шаг 3 · квадрат</div>
      <h4>Поэлементно</h4>
      <p>Квадрат делает все ошибки положительными и сильнее штрафует большие.</p>
    </div>
    <div class="step-panel" data-on="c3 c4" data-focus="c4">
      <div class="step-kicker">Шаг 4 · среднее</div>
      <h4>Столбец → одно число</h4>
      <p>L = 1.0. Сравнение: если всегда отвечать средней ценой 4.25, получится 3.6875.</p>
    </div>
    <div class="step-panel" data-on="c1 par" data-focus="par">
      <div class="step-kicker">Шаг 5 · параметры</div>
      <h4>Три числа</h4>
      <p>Вся модель — два веса и смещение. Обучать нужно только их.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<p class="tiny">Данные учебные: четыре квартиры, площадь в десятках м², возраст дома в десятках лет, цена в миллионах. Старт w = (2, −1), b = 1 выбран вручную. Все числа посчитаны numpy.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> линейная регрессия — один линейный слой <code>[d × 1]</code> плюс MSE; всё остальное в статье — два способа найти его веса.
</div>

---


## Часть 2. Данные: объекты строками

<p>Как во всей серии: объект — строка, признак — столбец.</p>
<div class="math-display" data-tex="X \in \mathbb{R}^{B\times d},\quad Y \in \mathbb{R}^{B \times 1}, \qquad B = 4,\ d = 2"></div>
<div class="stage" id="stage-in" tabindex="0">
  <div class="stage-figure">
<svg id="in" viewBox="0 0 960 600" role="img" aria-label="Данные: квартиры строками, признаки столбцами">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 310 L 214 310" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#in-arw)"/><text x="232.0" y="302.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#C30B0A" text-anchor="middle">Вход X</text><rect x="34" y="444" width="182" height="48" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="x"><g><rect x="330.0" y="150.0" width="60.0" height="120.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="360.0" y1="150.0" x2="360.0" y2="270.0" class="grid" opacity=".75"/><line x1="330.0" y1="180.0" x2="390.0" y2="180.0" class="grid" opacity=".75"/><line x1="330.0" y1="210.0" x2="390.0" y2="210.0" class="grid" opacity=".75"/><line x1="330.0" y1="240.0" x2="390.0" y2="240.0" class="grid" opacity=".75"/></g><text x="345.0" y="140.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">x₁</text><text x="375.0" y="140.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">x₂</text><foreignObject x="305.0" y="272.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject><text x="322.0" y="170.0" font-size="12" fill="#5E5850" text-anchor="end">кв. 1</text><text x="322.0" y="200.0" font-size="12" fill="#5E5850" text-anchor="end">кв. 2</text><text x="322.0" y="230.0" font-size="12" fill="#5E5850" text-anchor="end">кв. 3</text><text x="322.0" y="260.0" font-size="12" fill="#5E5850" text-anchor="end">кв. 4</text></g><g data-key="row" data-only="1"><rect x="330.0" y="150.0" width="60.0" height="30.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="420.0" y="170.0" font-size="13" fill="#C30B0A" text-anchor="start">одна квартира — строка [1 × 2]</text></g><g data-key="col" data-only="1"><rect x="330.0" y="150.0" width="30.0" height="120.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="420.0" y="230.0" font-size="13" fill="#C30B0A" text-anchor="start">один признак — столбец [4 × 1]</text></g><g data-key="y"><g><rect x="640.0" y="150.0" width="30.0" height="120.0" rx="2" fill="#9A9489" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="640.0" y1="180.0" x2="670.0" y2="180.0" class="grid" opacity=".75"/><line x1="640.0" y1="210.0" x2="670.0" y2="210.0" class="grid" opacity=".75"/><line x1="640.0" y1="240.0" x2="670.0" y2="240.0" class="grid" opacity=".75"/></g><text x="655.0" y="140.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">y</text><foreignObject x="600.0" y="272.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><text x="690.0" y="170.0" font-size="13" fill="#5E5850" text-anchor="start">цена, млн</text></g><g data-key="leg"><text x="330.0" y="340.0" font-size="13" fill="#5E5850" text-anchor="start">x₁ — площадь, десятки м² · x₂ — возраст дома, десятки лет</text></g><g data-key="shapes" data-only="1"><foreignObject x="290.0" y="400.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X \in \mathbb{R}^{B \times d} = [4 \times 2], \qquad Y \in \mathbb{R}^{B \times 1} = [4 \times 1]"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — предсказания · красное — остатки</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl x leg" data-focus="hl x">
      <div class="step-kicker">Шаг 1 · признаки</div>
      <h4>Таблица [4 × 2]</h4>
      <p>Четыре квартиры, два признака. Данные учебные: числа подобраны так, чтобы все расчёты проверялись в уме.</p>
    </div>
    <div class="step-panel" data-on="hl x row" data-focus="row">
      <div class="step-kicker">Шаг 2 · объект</div>
      <h4>Строка</h4>
      <p>Как во всех статьях серии: объект — строка. Тогда весь батч проходит модель одной формулой.</p>
    </div>
    <div class="step-panel" data-on="hl x col" data-focus="col">
      <div class="step-kicker">Шаг 3 · признак</div>
      <h4>Столбец</h4>
      <p>Каждому столбцу будет соответствовать свой вес.</p>
    </div>
    <div class="step-panel" data-on="hl x y" data-focus="y">
      <div class="step-kicker">Шаг 4 · ответы</div>
      <h4>Y [4 × 1]</h4>
      <p>Цены 5, 5, 1 и 6 миллионов — столбец той же высоты, что X.</p>
    </div>
    <div class="step-panel" data-on="hl x y shapes" data-focus="shapes">
      <div class="step-kicker">Шаг 5 · формы</div>
      <h4>B = 4, d = 2</h4>
      <p>Эти две формы определяют всё остальное: веса обязаны быть <code>[2 × 1]</code>, предсказания — <code>[4 × 1]</code>.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Четыре строки, два признака и цены.</p>
<div class="stage" id="stage-inn" tabindex="0">
  <div class="stage-figure">
<svg id="inn" viewBox="0 0 960 330" role="img" aria-label="Числовые X и Y">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: четыре квартиры</text><g data-key="x"><g><rect x="283.0" y="70.0" width="34.0" height="68.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="300.0" y1="70.0" x2="300.0" y2="138.0" class="grid" opacity=".75"/><line x1="283.0" y1="87.0" x2="317.0" y2="87.0" class="grid" opacity=".75"/><line x1="283.0" y1="104.0" x2="317.0" y2="104.0" class="grid" opacity=".75"/><line x1="283.0" y1="121.0" x2="317.0" y2="121.0" class="grid" opacity=".75"/></g><text x="300.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="273.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="210.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject><foreignObject x="245.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 &amp; 1 \\ 3 &amp; 1 \\ 1 &amp; 3 \\ 4 &amp; 2\end{bmatrix}"></div></foreignObject></g><g data-key="y"><g><rect x="611.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#9A9489" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="611.5" y1="87.0" x2="628.5" y2="87.0" class="grid" opacity=".75"/><line x1="611.5" y1="104.0" x2="628.5" y2="104.0" class="grid" opacity=".75"/><line x1="611.5" y1="121.0" x2="628.5" y2="121.0" class="grid" opacity=".75"/></g><text x="620.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="601.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="530.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><foreignObject x="580.0" y="168.0" width="80.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}5 \\ 5 \\ 1 \\ 6\end{bmatrix}"></div></foreignObject></g><g data-key="m" data-only="1"><text x="480.0" y="300.0" font-size="13" fill="#3576C0" text-anchor="middle">средняя цена 4.25 млн — ориентир «модели без признаков»</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="x" data-focus="x">
      <div class="step-kicker">Шаг 1 · признаки</div>
      <h4>X</h4>
      <p>Площадь от 10 до 40 м², возраст от 10 до 30 лет.</p>
    </div>
    <div class="step-panel" data-on="x y" data-focus="y">
      <div class="step-kicker">Шаг 2 · цены</div>
      <h4>Y</h4>
      <p>Самая дешёвая — третья квартира: маленькая и в старом доме.</p>
    </div>
    <div class="step-panel" data-on="y m" data-focus="m">
      <div class="step-kicker">Шаг 3 · ориентир</div>
      <h4>Средняя цена</h4>
      <p>Модель, которая всем отвечает 4.25, — точка отсчёта для любой другой.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> данные регрессии — матрица признаков <code>[B × d]</code> и столбец ответов <code>[B × 1]</code>; из этих двух форм следуют формы всего остального.
</div>

---


## Часть 3. Предсказание одного объекта

<div class="math-display" data-tex="\hat y = x\,w + b = \sum_{j=1}^{d} x_j w_j + b"></div>
<div class="stage" id="stage-ne" tabindex="0">
  <div class="stage-figure">
<svg id="ne" viewBox="0 0 960 600" role="img" aria-label="Предсказание одного объекта: строка признаков на столбец весов плюс смещение">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 310 L 214 310" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ne-arw)"/><text x="232.0" y="302.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="34" y="364" width="182" height="52" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="nr"><line x1="330" y1="110" x2="490" y2="155" stroke="#C29E08" stroke-width="1.8"/><circle cx="324" cy="110" r="7" fill="#73B222"/><text x="310.0" y="115.0" font-size="13" fill="#111111" text-anchor="end">x₁</text><line x1="330" y1="200" x2="490" y2="155" stroke="#C29E08" stroke-width="1.8"/><circle cx="324" cy="200" r="7" fill="#73B222"/><text x="310.0" y="205.0" font-size="13" fill="#111111" text-anchor="end">x₂</text><circle cx="520" cy="155" r="30" fill="#FFFFFF" stroke="#C29E08" stroke-width="2.2"/><text x="520.0" y="163.0" font-size="22" fill="#111111" text-anchor="middle">Σ</text><path d="M 520.0 220.0 L 520.0 188.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ne-arw)"/><text x="520.0" y="236.0" font-size="13" fill="#A5850A" text-anchor="middle" font-weight="700">+ b</text><path d="M 550.0 155.0 L 620.0 155.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ne-arw)"/><text x="640.0" y="160.0" font-size="16" fill="#111111" text-anchor="middle" font-weight="700">ŷ</text></g><g data-key="dot"><g><rect x="300.0" y="330.0" width="60.0" height="30.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="330.0" y1="330.0" x2="330.0" y2="360.0" class="grid" opacity=".75"/></g><foreignObject x="275.0" y="364.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="x"></div></foreignObject><text x="378.0" y="352.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="394.0" y="315.0" width="30.0" height="60.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="394.0" y1="345.0" x2="424.0" y2="345.0" class="grid" opacity=".75"/></g><foreignObject x="354.0" y="379.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="w"></div></foreignObject></g><g data-key="bz"><text x="444.0" y="352.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="460.0" y="330.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="420.0" y="364.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b"></div></foreignObject><text x="510.0" y="352.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="526.0" y="330.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="486.0" y="364.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat y"></div></foreignObject></g><g data-key="noact" data-only="1"><text x="700.0" y="300.0" font-size="13" fill="#5E5850" text-anchor="start">в нейросети здесь стояла бы</text><text x="700.0" y="318.0" font-size="13" fill="#5E5850" text-anchor="start">ReLU или сигмоида;</text><text x="700.0" y="336.0" font-size="13" fill="#C30B0A" text-anchor="start" font-weight="700">в регрессии ŷ — любое число</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="450.0" width="650.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat y = x\,w + b = x_1 w_1 + x_2 w_2 + b, \qquad [1\times2]\cdot[2\times1] + [1] = [1\times 1]"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — предсказания · красное — остатки</text>
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
      <h4>Нейрон с двумя входами</h4>
      <p>Рисунок из статьи про полносвязную сеть, только входов два и выход один.</p>
    </div>
    <div class="step-panel" data-on="hl nr dot" data-focus="dot">
      <div class="step-kicker">Шаг 2 · в матрицах</div>
      <h4>Строка на столбец</h4>
      <p><code>[1 × 2] · [2 × 1] = [1 × 1]</code>: два произведения и сумма.</p>
    </div>
    <div class="step-panel" data-on="hl dot bz f" data-focus="bz f">
      <div class="step-kicker">Шаг 3 · смещение</div>
      <h4>+ b</h4>
      <p>Смещение — цена «квартиры с нулевыми признаками», точка пересечения плоскости с осью ŷ.</p>
    </div>
    <div class="step-panel" data-on="hl bz noact" data-focus="noact">
      <div class="step-kicker">Шаг 4 · без активации</div>
      <h4>Выход не ограничен</h4>
      <p>Цена может быть любым числом, поэтому нелинейность не нужна. Вся модель линейна по признакам и по весам.</p>
    </div>
    <div class="step-panel" data-on="hl nr dot bz f" data-focus="f">
      <div class="step-kicker">Шаг 5 · формула</div>
      <h4>ŷ = x w + b</h4>
      <p>Одна строка, два веса, одно смещение.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Первая квартира: 20 м², дом 10 лет, цена 5 млн.</p>
<div class="stage" id="stage-nen" tabindex="0">
  <div class="stage-figure">
<svg id="nen" viewBox="0 0 960 380" role="img" aria-label="Числовое предсказание для первой квартиры">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: первая квартира</text><g data-key="x"><g><rect x="143.0" y="70.0" width="34.0" height="17.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="160.0" y1="70.0" x2="160.0" y2="87.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="133.0" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="70.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="x"></div></foreignObject><foreignObject x="110.0" y="117.0" width="100.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 &amp; 1\end{bmatrix}"></div></foreignObject><text x="260.0" y="86.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="331.5" y="70.0" width="17.0" height="34.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="331.5" y1="87.0" x2="348.5" y2="87.0" class="grid" opacity=".75"/></g><text x="340.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="321.5" y="91.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="250.0" y="107.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="w"></div></foreignObject><foreignObject x="300.0" y="134.0" width="80.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 \\ -1\end{bmatrix}"></div></foreignObject></g><g data-key="b"><text x="420.0" y="86.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="491.5" y="70.0" width="17.0" height="17.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/></g><text x="500.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="481.5" y="82.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="410.0" y="90.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b"></div></foreignObject><foreignObject x="465.0" y="117.0" width="70.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1\end{bmatrix}"></div></foreignObject></g><g data-key="z"><foreignObject x="20.0" y="230.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat y_1 = 2\cdot 2 + 1\cdot(-1) + 1 = 4, \qquad y_1 = 5, \qquad r_1 = \hat y_1 - y_1 = -1"></div></foreignObject></g><g data-key="n" data-only="1"><text x="480.0" y="320.0" font-size="13" fill="#3576C0" text-anchor="middle">положительный вес площади: больше площадь — дороже; отрицательный вес возраста: старше дом — дешевле</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="x" data-focus="x">
      <div class="step-kicker">Шаг 1 · произведение</div>
      <h4>2 · 2 + 1 · (−1) = 3</h4>
      <p>Площадь 20 м² на вес 2, возраст 10 лет на вес −1.</p>
    </div>
    <div class="step-panel" data-on="x b" data-focus="b">
      <div class="step-kicker">Шаг 2 · смещение</div>
      <h4>3 + 1 = 4</h4>
      <p>Модель оценивает первую квартиру в 4 миллиона.</p>
    </div>
    <div class="step-panel" data-on="x b z" data-focus="z">
      <div class="step-kicker">Шаг 3 · ошибка</div>
      <h4>Настоящая цена — 5</h4>
      <p>Остаток −1: модель недооценила квартиру на миллион.</p>
    </div>
    <div class="step-panel" data-on="z n" data-focus="n">
      <div class="step-kicker">Шаг 4 · смысл весов</div>
      <h4>Знаки весов читаются</h4>
      <p>Это главное достоинство линейной модели: каждый вес — «сколько миллионов добавляет единица признака при прочих равных».</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> предсказание — скалярное произведение строки признаков на столбец весов плюс смещение; каждый вес читается как «вклад единицы признака».
</div>

---


## Часть 4. Весь батч: Ŷ = XW + b

<div class="math-display" data-tex="\hat Y = X W + b, \qquad [4 \times 2]\cdot[2 \times 1] + [1 \times 1] = [4 \times 1]"></div>
<div class="stage" id="stage-li" tabindex="0">
  <div class="stage-figure">
<svg id="li" viewBox="0 0 960 600" role="img" aria-label="Весь батч: X умножается на W, прибавляется b">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 310 L 214 310" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#li-arw)"/><text x="232.0" y="302.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="34" y="364" width="182" height="52" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="x"><g><rect x="330.0" y="180.0" width="60.0" height="120.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="360.0" y1="180.0" x2="360.0" y2="300.0" class="grid" opacity=".75"/><line x1="330.0" y1="210.0" x2="390.0" y2="210.0" class="grid" opacity=".75"/><line x1="330.0" y1="240.0" x2="390.0" y2="240.0" class="grid" opacity=".75"/><line x1="330.0" y1="270.0" x2="390.0" y2="270.0" class="grid" opacity=".75"/></g><text x="360.0" y="172.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="322.0" y="244.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="305.0" y="302.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject></g><g data-key="w"><text x="414.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="430.0" y="210.0" width="30.0" height="60.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="430.0" y1="240.0" x2="460.0" y2="240.0" class="grid" opacity=".75"/></g><text x="445.0" y="202.0" font-size="13" fill="#111111" text-anchor="middle">1</text><foreignObject x="390.0" y="272.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W"></div></foreignObject></g><g data-key="b"><text x="484.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="500.0" y="210.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.16" stroke="#C29E08" stroke-width="1" stroke-dasharray="4 3"/><rect x="500.0" y="240.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.16" stroke="#C29E08" stroke-width="1" stroke-dasharray="4 3"/><rect x="500.0" y="270.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.16" stroke="#C29E08" stroke-width="1" stroke-dasharray="4 3"/></g><g><rect x="500.0" y="180.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="460.0" y="302.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b"></div></foreignObject><text x="515.0" y="330.0" font-size="12" fill="#5E5850" text-anchor="middle">растянут на 4 строки</text></g><g data-key="z"><text x="550.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="566.0" y="180.0" width="30.0" height="120.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="566.0" y1="210.0" x2="596.0" y2="210.0" class="grid" opacity=".75"/><line x1="566.0" y1="240.0" x2="596.0" y2="240.0" class="grid" opacity=".75"/><line x1="566.0" y1="270.0" x2="596.0" y2="270.0" class="grid" opacity=".75"/></g><text x="581.0" y="172.0" font-size="13" fill="#111111" text-anchor="middle">1</text><foreignObject x="526.0" y="302.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject></g><g data-key="cell" data-only="1"><rect x="330.0" y="210.0" width="60.0" height="30.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="430.0" y="210.0" width="30.0" height="60.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><rect x="566.0" y="210.0" width="30.0" height="30.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="620.0" y="230.0" font-size="13" fill="#C30B0A" text-anchor="start">строка 2 · W = ŷ₂</text></g><g data-key="shapes" data-only="1"><foreignObject x="290.0" y="400.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[4 \times 2] \cdot [2 \times 1] + [1 \times 1] = [4 \times 1], \qquad \hat Y = X W + b"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — предсказания · красное — остатки</text>
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
      <h4>Все четыре квартиры</h4>
      <p>Одна формула на весь батч.</p>
    </div>
    <div class="step-panel" data-on="hl x w" data-focus="w">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>Столбец [2 × 1]</h4>
      <p>У регрессии с одним выходом W — не матрица, а столбец: «слой с одним нейроном».</p>
    </div>
    <div class="step-panel" data-on="hl x w z cell" data-focus="cell">
      <div class="step-kicker">Шаг 3 · клетка</div>
      <h4>Строка X на столбец W</h4>
      <p>Каждая строка результата — предсказание для своей квартиры, те самые скалярные произведения из прошлой части.</p>
    </div>
    <div class="step-panel" data-on="hl x w b z" data-focus="b">
      <div class="step-kicker">Шаг 4 · смещение</div>
      <h4>Одно число на все строки</h4>
      <p>Broadcasting: b прибавляется к каждому предсказанию.</p>
    </div>
    <div class="step-panel" data-on="hl x w b z shapes" data-focus="shapes">
      <div class="step-kicker">Шаг 5 · формы</div>
      <h4>Ŷ = XW + b</h4>
      <p>Та же формула, что у линейного слоя MLP, при d_out = 1.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Четыре предсказания одним умножением.</p>
<div class="stage" id="stage-lin" tabindex="0">
  <div class="stage-figure">
<svg id="lin" viewBox="0 0 960 360" role="img" aria-label="Числовые предсказания для батча">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: Ŷ = X · W + b</text><g data-key="x"><g><rect x="153.0" y="70.0" width="34.0" height="68.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="170.0" y1="70.0" x2="170.0" y2="138.0" class="grid" opacity=".75"/><line x1="153.0" y1="87.0" x2="187.0" y2="87.0" class="grid" opacity=".75"/><line x1="153.0" y1="104.0" x2="187.0" y2="104.0" class="grid" opacity=".75"/><line x1="153.0" y1="121.0" x2="187.0" y2="121.0" class="grid" opacity=".75"/></g><text x="170.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="143.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="80.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject><foreignObject x="115.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 &amp; 1 \\ 3 &amp; 1 \\ 1 &amp; 3 \\ 4 &amp; 2\end{bmatrix}"></div></foreignObject><text x="260.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="321.5" y="86.0" width="17.0" height="34.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="321.5" y1="103.0" x2="338.5" y2="103.0" class="grid" opacity=".75"/></g><text x="330.0" y="78.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="311.5" y="107.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="240.0" y="123.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W"></div></foreignObject><foreignObject x="290.0" y="150.0" width="80.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 \\ -1\end{bmatrix}"></div></foreignObject></g><g data-key="b"><text x="400.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="451.5" y="95.0" width="17.0" height="17.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/></g><text x="460.0" y="87.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="441.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="370.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b"></div></foreignObject><foreignObject x="430.0" y="142.0" width="60.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1\end{bmatrix}"></div></foreignObject></g><g data-key="z"><text x="530.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="611.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="611.5" y1="87.0" x2="628.5" y2="87.0" class="grid" opacity=".75"/><line x1="611.5" y1="104.0" x2="628.5" y2="104.0" class="grid" opacity=".75"/><line x1="611.5" y1="121.0" x2="628.5" y2="121.0" class="grid" opacity=".75"/></g><text x="620.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="601.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="530.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject><foreignObject x="580.0" y="168.0" width="80.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}4 \\ 6 \\ 0 \\ 7\end{bmatrix}"></div></foreignObject><text x="760.0" y="104.0" font-size="13" fill="#5E5850" text-anchor="start">ответы Y:</text><text x="760.0" y="124.0" font-size="13" fill="#111111" text-anchor="start" font-weight="700">5, 5, 1, 6</text></g><g data-key="zero" data-only="1"><rect x="611.5" y="104.0" width="17.0" height="17.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="480.0" y="330.0" font-size="13" fill="#C30B0A" text-anchor="middle">третья квартира оценена в 0 миллионов: линейная модель не знает, что цена не бывает отрицательной</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="x" data-focus="x">
      <div class="step-kicker">Шаг 1 · произведение</div>
      <h4>XW</h4>
      <p>Строки: 2·2 − 1 = 3, 3·2 − 1 = 5, 1·2 − 3 = −1, 4·2 − 2 = 6.</p>
    </div>
    <div class="step-panel" data-on="x b z" data-focus="z">
      <div class="step-kicker">Шаг 2 · смещение</div>
      <h4>Ŷ = (4, 6, 0, 7)</h4>
      <p>Плюс b = 1 к каждой строке.</p>
    </div>
    <div class="step-panel" data-on="z zero" data-focus="zero">
      <div class="step-kicker">Шаг 3 · предел линейности</div>
      <h4>Прогноз 0</h4>
      <p>При других весах прогноз мог бы уйти и в минус. Это плата за простоту: линейная модель продолжает плоскость туда, где данных нет.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> весь батч предсказывается одним умножением матрицы на столбец; смещение растягивается на все строки.
</div>

---


## Часть 5. Остатки и MSE

<p>Качество модели меряют средним квадратом остатков:</p>
<div class="math-display" data-tex="R = \hat Y - Y, \qquad L = \frac{1}{B}\sum_{i}(\hat y_i - y_i)^2 = \frac{1}{B}R^{\top}R"></div>
<div class="stage" id="stage-ls" tabindex="0">
  <div class="stage-figure">
<svg id="ls" viewBox="0 0 960 600" role="img" aria-label="Остатки, квадраты и среднее: MSE">
<style>
  #ls { font-family: Helvetica, Arial, sans-serif; }
  #ls .cap { font-size: 13px; fill: #5E5850; }
  #ls .lbl { font-size: 16px; fill: #111111; }
  #ls .legend { font-size: 13px; fill: #5E5850; }
  #ls .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #ls .grid { stroke: #ffffff; stroke-width: 1.35; }
  #ls .dim { font-size: 13px; fill: #5E5850; }
  #ls .nm { font-size: 16px; font-weight: 800; }
  #ls .op { font-size: 23px; fill: #5E5850; }
  #ls .arw { font-size: 12px; fill: #5E5850; }
  #ls .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="ls-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="ls-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="ls-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="ls-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 310 L 214 310" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ls-arw)"/><text x="232.0" y="302.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#C30B0A" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#C30B0A" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#C30B0A" text-anchor="middle">Среднее → L</text><rect x="34" y="124" width="182" height="212" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="yy"><g><rect x="320.0" y="150.0" width="30.0" height="120.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="320.0" y1="180.0" x2="350.0" y2="180.0" class="grid" opacity=".75"/><line x1="320.0" y1="210.0" x2="350.0" y2="210.0" class="grid" opacity=".75"/><line x1="320.0" y1="240.0" x2="350.0" y2="240.0" class="grid" opacity=".75"/></g><foreignObject x="305.0" y="272.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject><text x="372.0" y="214.0" font-size="22" fill="#111111" text-anchor="middle">−</text><g><rect x="388.0" y="150.0" width="30.0" height="120.0" rx="2" fill="#9A9489" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="388.0" y1="180.0" x2="418.0" y2="180.0" class="grid" opacity=".75"/><line x1="388.0" y1="210.0" x2="418.0" y2="210.0" class="grid" opacity=".75"/><line x1="388.0" y1="240.0" x2="418.0" y2="240.0" class="grid" opacity=".75"/></g><foreignObject x="373.0" y="272.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject></g><g data-key="r"><text x="436.0" y="214.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="452.0" y="150.0" width="30.0" height="120.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="452.0" y1="180.0" x2="482.0" y2="180.0" class="grid" opacity=".75"/><line x1="452.0" y1="210.0" x2="482.0" y2="210.0" class="grid" opacity=".75"/><line x1="452.0" y1="240.0" x2="482.0" y2="240.0" class="grid" opacity=".75"/></g><foreignObject x="437.0" y="272.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="R"></div></foreignObject></g><g data-key="sq"><path d="M 486.0 210.0 L 526.0 210.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ls-arw)"/><text x="506.0" y="200.0" font-size="16" fill="#5E5850" text-anchor="middle">²</text><g><rect x="532.0" y="150.0" width="30.0" height="120.0" rx="2" fill="#C30B0A" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="532.0" y1="180.0" x2="562.0" y2="180.0" class="grid" opacity=".75"/><line x1="532.0" y1="210.0" x2="562.0" y2="210.0" class="grid" opacity=".75"/><line x1="532.0" y1="240.0" x2="562.0" y2="240.0" class="grid" opacity=".75"/></g><foreignObject x="517.0" y="272.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="R^{2}"></div></foreignObject></g><g data-key="mean"><path d="M 566.0 210.0 L 606.0 210.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ls-arw)"/><text x="586.0" y="200.0" font-size="12" fill="#5E5850" text-anchor="middle">среднее</text><g><rect x="612.0" y="195.0" width="30.0" height="30.0" rx="2" fill="#C30B0A" opacity="0.8" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="602.0" y="228.0" width="50.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L"></div></foreignObject></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="330.0" width="650.0" height="50.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L = \frac{1}{B}\sum_{i=1}^{B} (\hat y_i - y_i)^2 = \frac{1}{B}\,R^{\top}R"></div></foreignObject></g><g data-key="const" data-only="1"><text x="615.0" y="420.0" font-size="13" fill="#3576C0" text-anchor="middle">модель «всегда 4.25»: L = 3.6875 — это дисперсия цен</text><text x="615.0" y="440.0" font-size="13" fill="#3576C0" text-anchor="middle">R² = 1 − L / 3.6875 — доля разброса, которую объяснила модель</text></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — предсказания · красное — остатки</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl yy" data-focus="hl yy">
      <div class="step-kicker">Шаг 1 · две колонки</div>
      <h4>Предсказания и ответы</h4>
      <p>Обе <code>[4 × 1]</code>, их можно вычитать поэлементно.</p>
    </div>
    <div class="step-panel" data-on="hl yy r" data-focus="r">
      <div class="step-kicker">Шаг 2 · остатки</div>
      <h4>R = Ŷ − Y</h4>
      <p>Остаток положителен, когда модель переоценила, и отрицателен, когда недооценила.</p>
    </div>
    <div class="step-panel" data-on="hl r sq" data-focus="sq">
      <div class="step-kicker">Шаг 3 · квадрат</div>
      <h4>Знак больше не важен</h4>
      <p>Квадрат сравнивает ошибки по величине и в четыре раза сильнее штрафует ошибку вдвое большую.</p>
    </div>
    <div class="step-panel" data-on="hl sq mean f" data-focus="mean f">
      <div class="step-kicker">Шаг 4 · среднее</div>
      <h4>L = RᵀR / B</h4>
      <p>Сумма квадратов — это скалярное произведение столбца R на себя: <code>[1 × 4] · [4 × 1] = [1 × 1]</code>.</p>
    </div>
    <div class="step-panel" data-on="hl mean const" data-focus="const">
      <div class="step-kicker">Шаг 5 · ориентир</div>
      <h4>С чем сравнивать</h4>
      <p>Лучшая константа — среднее, её потеря — дисперсия Y. Отношение показывает, сколько разброса объяснили признаки.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Остатки, квадраты и потеря.</p>
<div class="stage" id="stage-lsn" tabindex="0">
  <div class="stage-figure">
<svg id="lsn" viewBox="0 0 960 360" role="img" aria-label="Числовой расчёт MSE">
<style>
  #lsn { font-family: Helvetica, Arial, sans-serif; }
  #lsn .cap { font-size: 13px; fill: #5E5850; }
  #lsn .lbl { font-size: 16px; fill: #111111; }
  #lsn .legend { font-size: 13px; fill: #5E5850; }
  #lsn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #lsn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #lsn .dim { font-size: 13px; fill: #5E5850; }
  #lsn .nm { font-size: 16px; font-weight: 800; }
  #lsn .op { font-size: 23px; fill: #5E5850; }
  #lsn .arw { font-size: 12px; fill: #5E5850; }
  #lsn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="lsn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="lsn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="lsn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="lsn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: остатки и потеря</text><g data-key="r"><g><rect x="151.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="151.5" y1="87.0" x2="168.5" y2="87.0" class="grid" opacity=".75"/><line x1="151.5" y1="104.0" x2="168.5" y2="104.0" class="grid" opacity=".75"/><line x1="151.5" y1="121.0" x2="168.5" y2="121.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="141.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="70.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject><foreignObject x="125.0" y="168.0" width="70.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}4 \\ 6 \\ 0 \\ 7\end{bmatrix}"></div></foreignObject><text x="220.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">−</text><g><rect x="271.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#9A9489" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="271.5" y1="87.0" x2="288.5" y2="87.0" class="grid" opacity=".75"/><line x1="271.5" y1="104.0" x2="288.5" y2="104.0" class="grid" opacity=".75"/><line x1="271.5" y1="121.0" x2="288.5" y2="121.0" class="grid" opacity=".75"/></g><text x="280.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="261.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="190.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><foreignObject x="245.0" y="168.0" width="70.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}5 \\ 5 \\ 1 \\ 6\end{bmatrix}"></div></foreignObject><text x="340.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="401.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="401.5" y1="87.0" x2="418.5" y2="87.0" class="grid" opacity=".75"/><line x1="401.5" y1="104.0" x2="418.5" y2="104.0" class="grid" opacity=".75"/><line x1="401.5" y1="121.0" x2="418.5" y2="121.0" class="grid" opacity=".75"/></g><text x="410.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="391.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="320.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="R"></div></foreignObject><foreignObject x="370.0" y="168.0" width="80.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-1 \\ 1 \\ -1 \\ 1\end{bmatrix}"></div></foreignObject></g><g data-key="sq"><path d="M 460.0 104.0 L 500.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#lsn-arw)"/><g><rect x="551.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="551.5" y1="87.0" x2="568.5" y2="87.0" class="grid" opacity=".75"/><line x1="551.5" y1="104.0" x2="568.5" y2="104.0" class="grid" opacity=".75"/><line x1="551.5" y1="121.0" x2="568.5" y2="121.0" class="grid" opacity=".75"/></g><text x="560.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="541.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="470.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="R^2"></div></foreignObject><foreignObject x="525.0" y="168.0" width="70.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 \\ 1 \\ 1 \\ 1\end{bmatrix}"></div></foreignObject></g><g data-key="L"><path d="M 610.0 104.0 L 650.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#lsn-arw)"/><g><rect x="701.5" y="95.0" width="17.0" height="17.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/></g><text x="710.0" y="87.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="691.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="620.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L"></div></foreignObject><foreignObject x="660.0" y="142.0" width="100.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.0000\end{bmatrix}"></div></foreignObject></g><g data-key="c" data-only="1"><foreignObject x="20.0" y="270.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L_{const} = 3.6875, \qquad R^2 = 1 - \frac{1.0000}{3.6875} = 0.7288"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="r" data-focus="r">
      <div class="step-kicker">Шаг 1 · остатки</div>
      <h4>−1, 1, −1, 1</h4>
      <p>Все ошибки ровно по миллиону, знаки чередуются.</p>
    </div>
    <div class="step-panel" data-on="r sq" data-focus="sq">
      <div class="step-kicker">Шаг 2 · квадраты</div>
      <h4>Все по 1</h4>
      <p>Каждый объект стоит одинаково.</p>
    </div>
    <div class="step-panel" data-on="sq L" data-focus="L">
      <div class="step-kicker">Шаг 3 · среднее</div>
      <h4>L = 1</h4>
      <p>Удобное число для проверки дальнейших формул.</p>
    </div>
    <div class="step-panel" data-on="L c" data-focus="c">
      <div class="step-kicker">Шаг 4 · качество</div>
      <h4>R² = 0.7288</h4>
      <p>Даже со случайно выбранными весами модель объясняет почти три четверти разброса цен. Обучение сделает лучше.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> MSE — квадрат длины вектора остатков, делённый на B; ориентир — дисперсия ответов, то есть потеря лучшей константы.
</div>

---


## Часть 6. Трюк с единицей

<p>Смещение можно спрятать внутрь умножения, если дописать к признакам столбец единиц:</p>
<div class="math-display" data-tex="\tilde X = [\,X \ \ \mathbf{1}\,] \in \mathbb{R}^{B \times (d+1)}, \qquad \theta = \begin{bmatrix} W \\ b \end{bmatrix}, \qquad \hat Y = \tilde X\,\theta"></div>
<div class="stage" id="stage-ex" tabindex="0">
  <div class="stage-figure">
<svg id="ex" viewBox="0 0 960 600" role="img" aria-label="Трюк с единицей: смещение как ещё один вес">
<style>
  #ex { font-family: Helvetica, Arial, sans-serif; }
  #ex .cap { font-size: 13px; fill: #5E5850; }
  #ex .lbl { font-size: 16px; fill: #111111; }
  #ex .legend { font-size: 13px; fill: #5E5850; }
  #ex .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #ex .grid { stroke: #ffffff; stroke-width: 1.35; }
  #ex .dim { font-size: 13px; fill: #5E5850; }
  #ex .nm { font-size: 16px; font-weight: 800; }
  #ex .op { font-size: 23px; fill: #5E5850; }
  #ex .arw { font-size: 12px; fill: #5E5850; }
  #ex .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="ex-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="ex-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="ex-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="ex-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ex-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ex-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ex-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ex-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ex-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 310 L 214 310" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ex-arw)"/><text x="232.0" y="302.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="34" y="364" width="182" height="52" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="two"><foreignObject x="290.0" y="80.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y = X W + b"></div></foreignObject></g><g data-key="x1"><g><rect x="330.0" y="180.0" width="60.0" height="120.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="360.0" y1="180.0" x2="360.0" y2="300.0" class="grid" opacity=".75"/><line x1="330.0" y1="210.0" x2="390.0" y2="210.0" class="grid" opacity=".75"/><line x1="330.0" y1="240.0" x2="390.0" y2="240.0" class="grid" opacity=".75"/><line x1="330.0" y1="270.0" x2="390.0" y2="270.0" class="grid" opacity=".75"/></g><g><rect x="390.0" y="180.0" width="30.0" height="120.0" rx="2" fill="#8A857C" opacity="0.35" stroke="#ffffff" stroke-width="1"/><line x1="390.0" y1="210.0" x2="420.0" y2="210.0" class="grid" opacity=".75"/><line x1="390.0" y1="240.0" x2="420.0" y2="240.0" class="grid" opacity=".75"/><line x1="390.0" y1="270.0" x2="420.0" y2="270.0" class="grid" opacity=".75"/></g><line x1="390" y1="172" x2="390" y2="308" stroke="#C30B0A" stroke-dasharray="4 3" stroke-width="1.6"/><text x="405.0" y="172.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">1</text><foreignObject x="295.0" y="312.0" width="160.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X = [X\ \ \mathbf{1}]"></div></foreignObject></g><g data-key="th"><text x="440.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="456.0" y="195.0" width="30.0" height="90.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="456.0" y1="225.0" x2="486.0" y2="225.0" class="grid" opacity=".75"/><line x1="456.0" y1="255.0" x2="486.0" y2="255.0" class="grid" opacity=".75"/></g><line x1="448" y1="255" x2="494" y2="255" stroke="#C30B0A" stroke-dasharray="4 3" stroke-width="1.6"/><text x="500.0" y="275.0" font-size="13" fill="#A5850A" text-anchor="start" font-weight="700">← b</text><foreignObject x="441.0" y="293.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta"></div></foreignObject></g><g data-key="z"><text x="540.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="556.0" y="180.0" width="30.0" height="120.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="556.0" y1="210.0" x2="586.0" y2="210.0" class="grid" opacity=".75"/><line x1="556.0" y1="240.0" x2="586.0" y2="240.0" class="grid" opacity=".75"/><line x1="556.0" y1="270.0" x2="586.0" y2="270.0" class="grid" opacity=".75"/></g><foreignObject x="541.0" y="302.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject></g><g data-key="dims" data-only="1"><foreignObject x="290.0" y="380.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[4 \times 3] \cdot [3 \times 1] = [4 \times 1], \qquad \hat Y = \tilde X\,\theta"></div></foreignObject><text x="615.0" y="440.0" font-size="13" fill="#C30B0A" text-anchor="middle">смещение — вес при признаке, который у всех объектов равен 1</text></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — предсказания · красное — остатки</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl two" data-focus="hl two">
      <div class="step-kicker">Шаг 1 · две части</div>
      <h4>Умножение и сложение</h4>
      <p>Смещение портит красоту формулы: его приходится прибавлять отдельно, и в выкладках для него своя производная.</p>
    </div>
    <div class="step-panel" data-on="hl two x1" data-focus="x1">
      <div class="step-kicker">Шаг 2 · столбец единиц</div>
      <h4>Допишем к X столбец из 1</h4>
      <p>У каждой квартиры появился третий «признак», всегда равный 1.</p>
    </div>
    <div class="step-panel" data-on="hl x1 th" data-focus="th">
      <div class="step-kicker">Шаг 3 · веса</div>
      <h4>b встаёт в конец столбца весов</h4>
      <p>θ = (w₁, w₂, b): вес при столбце единиц умножается на 1 у каждого объекта и прибавляется к сумме — ровно как смещение.</p>
    </div>
    <div class="step-panel" data-on="hl x1 th z" data-focus="z">
      <div class="step-kicker">Шаг 4 · результат</div>
      <h4>Ŷ = X̃ θ</h4>
      <p>Одна матрица на один столбец. Дальше это позволит записать решение одной формулой.</p>
    </div>
    <div class="step-panel" data-on="hl x1 th z dims" data-focus="dims">
      <div class="step-kicker">Шаг 5 · формы</div>
      <h4>[4 × 3] · [3 × 1]</h4>
      <p>Тот же приём объясняет, почему у линейного слоя смещение ведёт себя как ещё одна строка весов.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Та же модель одной матрицей.</p>
<div class="stage" id="stage-exn" tabindex="0">
  <div class="stage-figure">
<svg id="exn" viewBox="0 0 960 340" role="img" aria-label="Числовая проверка трюка с единицей">
<style>
  #exn { font-family: Helvetica, Arial, sans-serif; }
  #exn .cap { font-size: 13px; fill: #5E5850; }
  #exn .lbl { font-size: 16px; fill: #111111; }
  #exn .legend { font-size: 13px; fill: #5E5850; }
  #exn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #exn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #exn .dim { font-size: 13px; fill: #5E5850; }
  #exn .nm { font-size: 16px; font-weight: 800; }
  #exn .op { font-size: 23px; fill: #5E5850; }
  #exn .arw { font-size: 12px; fill: #5E5850; }
  #exn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="exn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="exn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="exn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="exn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: X̃ · θ</text><g data-key="x"><g><rect x="174.5" y="70.0" width="51.0" height="68.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="191.5" y1="70.0" x2="191.5" y2="138.0" class="grid" opacity=".75"/><line x1="208.5" y1="70.0" x2="208.5" y2="138.0" class="grid" opacity=".75"/><line x1="174.5" y1="87.0" x2="225.5" y2="87.0" class="grid" opacity=".75"/><line x1="174.5" y1="104.0" x2="225.5" y2="104.0" class="grid" opacity=".75"/><line x1="174.5" y1="121.0" x2="225.5" y2="121.0" class="grid" opacity=".75"/></g><text x="200.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="164.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="110.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X"></div></foreignObject><foreignObject x="135.0" y="168.0" width="130.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 &amp; 1 &amp; 1 \\ 3 &amp; 1 &amp; 1 \\ 1 &amp; 3 &amp; 1 \\ 4 &amp; 2 &amp; 1\end{bmatrix}"></div></foreignObject></g><g data-key="th"><text x="290.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="351.5" y="78.0" width="17.0" height="51.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="351.5" y1="95.0" x2="368.5" y2="95.0" class="grid" opacity=".75"/><line x1="351.5" y1="112.0" x2="368.5" y2="112.0" class="grid" opacity=".75"/></g><text x="360.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="341.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="270.0" y="132.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta"></div></foreignObject><foreignObject x="320.0" y="159.0" width="80.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 \\ -1 \\ 1\end{bmatrix}"></div></foreignObject></g><g data-key="z"><text x="430.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="501.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="501.5" y1="87.0" x2="518.5" y2="87.0" class="grid" opacity=".75"/><line x1="501.5" y1="104.0" x2="518.5" y2="104.0" class="grid" opacity=".75"/><line x1="501.5" y1="121.0" x2="518.5" y2="121.0" class="grid" opacity=".75"/></g><text x="510.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="491.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="420.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject><foreignObject x="470.0" y="168.0" width="80.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}4 \\ 6 \\ 0 \\ 7\end{bmatrix}"></div></foreignObject><text x="700.0" y="110.0" font-size="13" fill="#3576C0" text-anchor="start">те же 4, 6, 0, 7</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="x" data-focus="x">
      <div class="step-kicker">Шаг 1 · расширенная матрица</div>
      <h4>Третий столбец — единицы</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="x th" data-focus="th">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>θ = (2, −1, 1)</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="x th z" data-focus="z">
      <div class="step-kicker">Шаг 3 · произведение</div>
      <h4>Совпало с XW + b</h4>
      <p>Например, первая строка: 2·2 + 1·(−1) + 1·1 = 4.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> со столбцом единиц регрессия записывается как <span class="math-inline" data-tex="\hat Y = \tilde X\theta"></span> — без отдельного смещения, и все дальнейшие формулы становятся короче.
</div>

---


## Часть 7. Геометрия: проекция

<p>
  Посмотрим на задачу не по строкам, а по столбцам. Y — один вектор из B чисел. Все предсказания,
  которые умеет модель, — линейные комбинации столбцов X̃. Лучшее из них — ближайшая к Y точка
  этого подпространства:
</p>
<div class="math-display" data-tex="\min_{\theta} \|\tilde X\theta - Y\|^2 \quad\Longleftrightarrow\quad \tilde X^{\top}(\tilde X\theta^{*} - Y) = 0"></div>
<div class="stage" id="stage-gm" tabindex="0">
  <div class="stage-figure">
<svg id="gm" viewBox="0 0 960 600" role="img" aria-label="Геометрия МНК: проекция вектора ответов на пространство столбцов">
<style>
  #gm { font-family: Helvetica, Arial, sans-serif; }
  #gm .cap { font-size: 13px; fill: #5E5850; }
  #gm .lbl { font-size: 16px; fill: #111111; }
  #gm .legend { font-size: 13px; fill: #5E5850; }
  #gm .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #gm .grid { stroke: #ffffff; stroke-width: 1.35; }
  #gm .dim { font-size: 13px; fill: #5E5850; }
  #gm .nm { font-size: 16px; font-weight: 800; }
  #gm .op { font-size: 23px; fill: #5E5850; }
  #gm .arw { font-size: 12px; fill: #5E5850; }
  #gm .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="gm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="gm-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="gm-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="gm-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#gm-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#gm-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#gm-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#gm-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#gm-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 310 L 214 310" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#gm-arw)"/><text x="232.0" y="302.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#C30B0A" text-anchor="middle">Остаток Ŷ − Y</text><rect x="34" y="284" width="182" height="52" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="plane"><path d="M 320 420 L 620 470 L 900 380 L 600 330 Z" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.6"/><text x="860.0" y="440.0" font-size="13" fill="#A5850A" text-anchor="end" font-weight="700">все возможные X̃θ</text></g><g data-key="y"><circle cx="610" cy="170" r="6" fill="#5E5850"/><text x="624.0" y="168.0" font-size="16" fill="#111111" text-anchor="start" font-weight="800">Y</text><text x="624.0" y="188.0" font-size="12" fill="#5E5850" text-anchor="start">вектор из 4 цен</text></g><g data-key="cur"><circle cx="480" cy="410" r="6" fill="#C29E08"/><text x="470.0" y="432.0" font-size="12" fill="#A5850A" text-anchor="end">Ŷ при θ = (2, −1, 1)</text><path d="M 480 410 L 610 170" fill="none" stroke="#C30B0A" stroke-width="2"/><text x="520.0" y="280.0" font-size="14" fill="#C30B0A" text-anchor="end" font-weight="700">R</text></g><g data-key="proj"><circle cx="610" cy="400" r="6" fill="#4E9A38"/><path d="M 610 400 L 610 176" fill="none" stroke="#4E9A38" stroke-width="2.4"/><path d="M 610 386 L 624 388 L 624 402" fill="none" stroke="#4E9A38" stroke-width="1.4"/><text x="630.0" y="300.0" font-size="13" fill="#4E9A38" text-anchor="start" font-weight="700">R* ⟂ плоскости</text><text x="622.0" y="420.0" font-size="12" fill="#4E9A38" text-anchor="start">Ŷ* — проекция</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="500.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X^{\top} R^{*} = 0 \quad\Longleftrightarrow\quad \tilde X^{\top}(\tilde X\theta^{*} - Y) = 0"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">жёлтая плоскость — все предсказания, которые умеет модель · красное — текущий остаток · зелёное — оптимум</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl y" data-focus="hl y">
      <div class="step-kicker">Шаг 1 · взгляд со стороны объектов</div>
      <h4>Y — точка в 4-мерном пространстве</h4>
      <p>Четыре цены — один вектор. Каждая ось — одна квартира.</p>
    </div>
    <div class="step-panel" data-on="hl y plane" data-focus="plane">
      <div class="step-kicker">Шаг 2 · что умеет модель</div>
      <h4>Все X̃θ — плоскость</h4>
      <p>Меняя θ, мы получаем линейные комбинации трёх столбцов X̃: трёхмерное подпространство в четырёхмерном. Y в нём не лежит — точного решения нет.</p>
    </div>
    <div class="step-panel" data-on="hl y plane cur" data-focus="cur">
      <div class="step-kicker">Шаг 3 · текущее решение</div>
      <h4>Остаток R — от Ŷ до Y</h4>
      <p>L = |R|² / B — квадрат длины этого отрезка, делённый на 4.</p>
    </div>
    <div class="step-panel" data-on="hl y plane cur proj" data-focus="proj">
      <div class="step-kicker">Шаг 4 · лучшее решение</div>
      <h4>Перпендикуляр</h4>
      <p>Самая короткая дорога от точки до плоскости — перпендикуляр. Значит, в оптимуме остаток ортогонален каждому столбцу X̃.</p>
    </div>
    <div class="step-panel" data-on="hl plane proj f" data-focus="f">
      <div class="step-kicker">Шаг 5 · условие</div>
      <h4>X̃ᵀR* = 0</h4>
      <p>Три скалярных произведения со столбцами — три уравнения на три неизвестных. Это и есть нормальные уравнения следующей части.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Скалярные произведения остатка со столбцами X̃.</p>
<div class="stage" id="stage-gmn" tabindex="0">
  <div class="stage-figure">
<svg id="gmn" viewBox="0 0 960 360" role="img" aria-label="Числовая проверка ортогональности остатка">
<style>
  #gmn { font-family: Helvetica, Arial, sans-serif; }
  #gmn .cap { font-size: 13px; fill: #5E5850; }
  #gmn .lbl { font-size: 16px; fill: #111111; }
  #gmn .legend { font-size: 13px; fill: #5E5850; }
  #gmn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #gmn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #gmn .dim { font-size: 13px; fill: #5E5850; }
  #gmn .nm { font-size: 16px; font-weight: 800; }
  #gmn .op { font-size: 23px; fill: #5E5850; }
  #gmn .arw { font-size: 12px; fill: #5E5850; }
  #gmn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="gmn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="gmn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="gmn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="gmn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: X̃ᵀR сейчас и в оптимуме</text><g data-key="cur"><g><rect x="191.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="191.5" y1="87.0" x2="208.5" y2="87.0" class="grid" opacity=".75"/><line x1="191.5" y1="104.0" x2="208.5" y2="104.0" class="grid" opacity=".75"/><line x1="191.5" y1="121.0" x2="208.5" y2="121.0" class="grid" opacity=".75"/></g><text x="200.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="181.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="110.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="R"></div></foreignObject><foreignObject x="160.0" y="168.0" width="80.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-1 \\ 1 \\ -1 \\ 1\end{bmatrix}"></div></foreignObject><text x="270.0" y="104.0" font-size="18" fill="#111111" text-anchor="middle">→</text><g><rect x="351.5" y="86.0" width="17.0" height="51.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="351.5" y1="103.0" x2="368.5" y2="103.0" class="grid" opacity=".75"/><line x1="351.5" y1="120.0" x2="368.5" y2="120.0" class="grid" opacity=".75"/></g><text x="360.0" y="78.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="341.5" y="115.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="270.0" y="140.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X^{\top} R"></div></foreignObject><foreignObject x="315.0" y="167.0" width="90.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}4 \\ -1 \\ 0\end{bmatrix}"></div></foreignObject><text x="200.0" y="280.0" font-size="13" fill="#C30B0A" text-anchor="middle">не ноль: решение не оптимально</text></g><g data-key="opt"><g><rect x="611.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="611.5" y1="87.0" x2="628.5" y2="87.0" class="grid" opacity=".75"/><line x1="611.5" y1="104.0" x2="628.5" y2="104.0" class="grid" opacity=".75"/><line x1="611.5" y1="121.0" x2="628.5" y2="121.0" class="grid" opacity=".75"/></g><text x="620.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="601.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="530.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="23\,R^{*}"></div></foreignObject><foreignObject x="575.0" y="168.0" width="90.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-12 \\ 15 \\ 3 \\ -6\end{bmatrix}"></div></foreignObject><text x="690.0" y="104.0" font-size="18" fill="#111111" text-anchor="middle">→</text><g><rect x="771.5" y="86.0" width="17.0" height="51.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="771.5" y1="103.0" x2="788.5" y2="103.0" class="grid" opacity=".75"/><line x1="771.5" y1="120.0" x2="788.5" y2="120.0" class="grid" opacity=".75"/></g><text x="780.0" y="78.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="761.5" y="115.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="690.0" y="140.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X^{\top} R^{*}"></div></foreignObject><foreignObject x="735.0" y="167.0" width="90.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0 \\ 0 \\ 0\end{bmatrix}"></div></foreignObject><text x="700.0" y="280.0" font-size="13" fill="#4E9A38" text-anchor="middle">ровно ноль</text></g><g data-key="link" data-only="1"><text x="480.0" y="330.0" font-size="13" fill="#3576C0" text-anchor="middle">заметьте: (4, −1, 0) · 2/B = (2, −0.5, 0) — это градиент из части 10</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="cur" data-focus="cur">
      <div class="step-kicker">Шаг 1 · сейчас</div>
      <h4>X̃ᵀR = (4, −1, 0)</h4>
      <p>Остаток «смотрит» вдоль первого и второго столбцов — значит, веса можно улучшить. Со столбцом единиц он уже ортогонален: сумма остатков 0.</p>
    </div>
    <div class="step-panel" data-on="cur opt" data-focus="opt">
      <div class="step-kicker">Шаг 2 · оптимум</div>
      <h4>R* = (−12, 15, 3, −6) / 23</h4>
      <p>Все три скалярных произведения ровно нулевые.</p>
    </div>
    <div class="step-panel" data-on="cur link" data-focus="link">
      <div class="step-kicker">Шаг 3 · забегая вперёд</div>
      <h4>Это и есть градиент</h4>
      <p>Условие оптимума «остаток ортогонален столбцам» и условие «градиент равен нулю» — одно и то же.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> метод наименьших квадратов — это ортогональная проекция Y на пространство столбцов X̃; в оптимуме остаток перпендикулярен каждому столбцу.
</div>

---


## Часть 8. Нормальные уравнения

<p>Раскроем скобки в условии ортогональности:</p>
<div class="math-display" data-tex="\tilde X^{\top}\tilde X\,\theta^{*} = \tilde X^{\top}Y \quad\Rightarrow\quad \theta^{*} = (\tilde X^{\top}\tilde X)^{-1}\tilde X^{\top}Y"></div>
<div class="stage" id="stage-eq" tabindex="0">
  <div class="stage-figure">
<svg id="eq" viewBox="0 0 960 600" role="img" aria-label="Нормальные уравнения: X транспонированная на X, обращение и решение">
<style>
  #eq { font-family: Helvetica, Arial, sans-serif; }
  #eq .cap { font-size: 13px; fill: #5E5850; }
  #eq .lbl { font-size: 16px; fill: #111111; }
  #eq .legend { font-size: 13px; fill: #5E5850; }
  #eq .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #eq .grid { stroke: #ffffff; stroke-width: 1.35; }
  #eq .dim { font-size: 13px; fill: #5E5850; }
  #eq .nm { font-size: 16px; font-weight: 800; }
  #eq .op { font-size: 23px; fill: #5E5850; }
  #eq .arw { font-size: 12px; fill: #5E5850; }
  #eq .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="eq-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="eq-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="eq-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="eq-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#eq-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#eq-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#eq-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#eq-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#eq-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 310 L 214 310" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#eq-arw)"/><text x="232.0" y="302.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="34" y="364" width="182" height="52" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="a"><g><rect x="300.0" y="150.0" width="104.0" height="78.0" rx="2" fill="#73B222" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="326.0" y1="150.0" x2="326.0" y2="228.0" class="grid" opacity=".75"/><line x1="352.0" y1="150.0" x2="352.0" y2="228.0" class="grid" opacity=".75"/><line x1="378.0" y1="150.0" x2="378.0" y2="228.0" class="grid" opacity=".75"/><line x1="300.0" y1="176.0" x2="404.0" y2="176.0" class="grid" opacity=".75"/><line x1="300.0" y1="202.0" x2="404.0" y2="202.0" class="grid" opacity=".75"/></g><foreignObject x="297.0" y="234.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X^{\top}"></div></foreignObject><text x="420.0" y="190.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="436.0" y="124.0" width="78.0" height="104.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="462.0" y1="124.0" x2="462.0" y2="228.0" class="grid" opacity=".75"/><line x1="488.0" y1="124.0" x2="488.0" y2="228.0" class="grid" opacity=".75"/><line x1="436.0" y1="150.0" x2="514.0" y2="150.0" class="grid" opacity=".75"/><line x1="436.0" y1="176.0" x2="514.0" y2="176.0" class="grid" opacity=".75"/><line x1="436.0" y1="202.0" x2="514.0" y2="202.0" class="grid" opacity=".75"/></g><foreignObject x="420.0" y="234.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X"></div></foreignObject><text x="528.0" y="190.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="544.0" y="150.0" width="78.0" height="78.0" rx="2" fill="#3576C0" opacity="0.6" stroke="#ffffff" stroke-width="1"/><line x1="570.0" y1="150.0" x2="570.0" y2="228.0" class="grid" opacity=".75"/><line x1="596.0" y1="150.0" x2="596.0" y2="228.0" class="grid" opacity=".75"/><line x1="544.0" y1="176.0" x2="622.0" y2="176.0" class="grid" opacity=".75"/><line x1="544.0" y1="202.0" x2="622.0" y2="202.0" class="grid" opacity=".75"/></g><foreignObject x="528.0" y="234.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A"></div></foreignObject><text x="640.0" y="180.0" font-size="12" fill="#5E5850" text-anchor="start">[3 × 3] — симметричная</text></g><g data-key="c"><g><rect x="300.0" y="300.0" width="104.0" height="78.0" rx="2" fill="#73B222" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="326.0" y1="300.0" x2="326.0" y2="378.0" class="grid" opacity=".75"/><line x1="352.0" y1="300.0" x2="352.0" y2="378.0" class="grid" opacity=".75"/><line x1="378.0" y1="300.0" x2="378.0" y2="378.0" class="grid" opacity=".75"/><line x1="300.0" y1="326.0" x2="404.0" y2="326.0" class="grid" opacity=".75"/><line x1="300.0" y1="352.0" x2="404.0" y2="352.0" class="grid" opacity=".75"/></g><foreignObject x="297.0" y="384.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X^{\top}"></div></foreignObject><text x="420.0" y="340.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="436.0" y="274.0" width="26.0" height="104.0" rx="2" fill="#9A9489" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="436.0" y1="300.0" x2="462.0" y2="300.0" class="grid" opacity=".75"/><line x1="436.0" y1="326.0" x2="462.0" y2="326.0" class="grid" opacity=".75"/><line x1="436.0" y1="352.0" x2="462.0" y2="352.0" class="grid" opacity=".75"/></g><foreignObject x="424.0" y="384.0" width="50.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><text x="480.0" y="340.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="496.0" y="300.0" width="26.0" height="78.0" rx="2" fill="#3576C0" opacity="0.6" stroke="#ffffff" stroke-width="1"/><line x1="496.0" y1="326.0" x2="522.0" y2="326.0" class="grid" opacity=".75"/><line x1="496.0" y1="352.0" x2="522.0" y2="352.0" class="grid" opacity=".75"/></g><foreignObject x="484.0" y="384.0" width="50.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="c"></div></foreignObject></g><g data-key="sol"><path d="M 640.0 340.0 L 690.0 340.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#eq-arw)"/><g><rect x="700.0" y="300.0" width="26.0" height="78.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="700.0" y1="326.0" x2="726.0" y2="326.0" class="grid" opacity=".75"/><line x1="700.0" y1="352.0" x2="726.0" y2="352.0" class="grid" opacity=".75"/></g><foreignObject x="683.0" y="384.0" width="60.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta^{*}"></div></foreignObject><foreignObject x="760.0" y="320.0" width="190.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="= A^{-1} c"></div></foreignObject></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="440.0" width="650.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X^{\top}\tilde X\,\theta^{*} = \tilde X^{\top} Y \quad\Rightarrow\quad \theta^{*} = (\tilde X^{\top}\tilde X)^{-1}\tilde X^{\top} Y"></div></foreignObject></g><g data-key="cost" data-only="1"><text x="615.0" y="520.0" font-size="13" fill="#C30B0A" text-anchor="middle">обращение [d × d] стоит порядка d³ операций: при тысячах признаков дешевле спуск</text></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — предсказания · красное — остатки · синее — вспомогательные матрицы</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl a" data-focus="hl a">
      <div class="step-kicker">Шаг 1 · матрица Грама</div>
      <h4>A = X̃ᵀX̃ [3 × 3]</h4>
      <p>Скалярные произведения столбцов X̃ между собой. Размер зависит только от числа признаков, а не объектов.</p>
    </div>
    <div class="step-panel" data-on="hl a c" data-focus="c">
      <div class="step-kicker">Шаг 2 · правая часть</div>
      <h4>c = X̃ᵀY [3 × 1]</h4>
      <p>Скалярные произведения каждого столбца с ответами.</p>
    </div>
    <div class="step-panel" data-on="hl a c f" data-focus="f">
      <div class="step-kicker">Шаг 3 · уравнения</div>
      <h4>Aθ = c</h4>
      <p>Условие X̃ᵀ(X̃θ − Y) = 0 из прошлой части, раскрытое по скобкам.</p>
    </div>
    <div class="step-panel" data-on="hl a c sol" data-focus="sol">
      <div class="step-kicker">Шаг 4 · решение</div>
      <h4>θ* = A⁻¹c</h4>
      <p>Если A обратима, решение единственно и находится одной формулой — без итераций.</p>
    </div>
    <div class="step-panel" data-on="hl sol cost" data-focus="cost">
      <div class="step-kicker">Шаг 5 · цена</div>
      <h4>Когда формула невыгодна</h4>
      <p>Для двух признаков — мгновенно. Для миллиона — матрица 10⁶ × 10⁶ не поместится в память; тогда используют градиентный спуск.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Матрица Грама 3 × 3, её определитель и точное решение.</p>
<div class="stage" id="stage-eqn" tabindex="0">
  <div class="stage-figure">
<svg id="eqn" viewBox="0 0 960 360" role="img" aria-label="Числовое решение нормальных уравнений">
<style>
  #eqn { font-family: Helvetica, Arial, sans-serif; }
  #eqn .cap { font-size: 13px; fill: #5E5850; }
  #eqn .lbl { font-size: 16px; fill: #111111; }
  #eqn .legend { font-size: 13px; fill: #5E5850; }
  #eqn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #eqn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #eqn .dim { font-size: 13px; fill: #5E5850; }
  #eqn .nm { font-size: 16px; font-weight: 800; }
  #eqn .op { font-size: 23px; fill: #5E5850; }
  #eqn .arw { font-size: 12px; fill: #5E5850; }
  #eqn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="eqn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="eqn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="eqn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="eqn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: A, c и θ*</text><g data-key="a"><g><rect x="144.5" y="70.0" width="51.0" height="51.0" rx="2" fill="#3576C0" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="161.5" y1="70.0" x2="161.5" y2="121.0" class="grid" opacity=".75"/><line x1="178.5" y1="70.0" x2="178.5" y2="121.0" class="grid" opacity=".75"/><line x1="144.5" y1="87.0" x2="195.5" y2="87.0" class="grid" opacity=".75"/><line x1="144.5" y1="104.0" x2="195.5" y2="104.0" class="grid" opacity=".75"/></g><text x="170.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">3</text><text x="134.5" y="99.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="80.0" y="124.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A = \tilde X^{\top}\tilde X"></div></foreignObject><foreignObject x="95.0" y="151.0" width="150.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}30 &amp; 16 &amp; 10 \\ 16 &amp; 15 &amp; 7 \\ 10 &amp; 7 &amp; 4\end{bmatrix}"></div></foreignObject><text x="170.0" y="290.0" font-size="13" fill="#111111" text-anchor="middle">det A = 46</text></g><g data-key="c"><g><rect x="381.5" y="78.0" width="17.0" height="51.0" rx="2" fill="#3576C0" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="381.5" y1="95.0" x2="398.5" y2="95.0" class="grid" opacity=".75"/><line x1="381.5" y1="112.0" x2="398.5" y2="112.0" class="grid" opacity=".75"/></g><text x="390.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="371.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="300.0" y="132.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="c = \tilde X^{\top} Y"></div></foreignObject><foreignObject x="345.0" y="159.0" width="90.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}50 \\ 25 \\ 17\end{bmatrix}"></div></foreignObject></g><g data-key="sol"><g><rect x="601.5" y="78.0" width="17.0" height="51.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="601.5" y1="95.0" x2="618.5" y2="95.0" class="grid" opacity=".75"/><line x1="601.5" y1="112.0" x2="618.5" y2="112.0" class="grid" opacity=".75"/></g><text x="610.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="591.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="520.0" y="132.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta^{*}"></div></foreignObject><foreignObject x="555.0" y="159.0" width="110.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.1739 \\ -1.0870 \\ 3.2174\end{bmatrix}"></div></foreignObject><foreignObject x="680.0" y="90.0" width="270.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="= \tfrac{1}{23}(27,\ -25,\ 74)"></div></foreignObject></g><g data-key="L" data-only="1"><text x="480.0" y="320.0" font-size="13" fill="#4E9A38" text-anchor="middle" font-weight="700">L* = 9/46 = 0.1957 — меньше не бывает: в 5 раз лучше стартовой 1.0</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="a" data-focus="a">
      <div class="step-kicker">Шаг 1 · A</div>
      <h4>Сумма квадратов и произведений</h4>
      <p>A₁₁ = 4 + 9 + 1 + 16 = 30, A₃₃ = 4 — число объектов (столбец единиц на себя).</p>
    </div>
    <div class="step-panel" data-on="a c" data-focus="c">
      <div class="step-kicker">Шаг 2 · c</div>
      <h4>X̃ᵀY</h4>
      <p>Первая клетка: 2·5 + 3·5 + 1·1 + 4·6 = 50.</p>
    </div>
    <div class="step-panel" data-on="a c sol" data-focus="sol">
      <div class="step-kicker">Шаг 3 · решение</div>
      <h4>w = (1.17, −1.09), b = 3.22</h4>
      <p>Все три числа — дроби со знаменателем 23: det A = 46 = 2 · 23.</p>
    </div>
    <div class="step-panel" data-on="sol L" data-focus="L">
      <div class="step-kicker">Шаг 4 · минимум</div>
      <h4>L* = 0.1957</h4>
      <p>Это абсолютный минимум MSE на этих данных: к нему обязан прийти градиентный спуск.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> нормальные уравнения дают ответ одной формулой: матрица Грама <code>[(d+1) × (d+1)]</code>, правая часть и обращение.
</div>

---


## Часть 9. Что ломается: коллинеарность

<p>
  Формула из прошлой части требует обратимости <span class="math-inline" data-tex="\tilde X^{\top}\tilde X"></span>.
  Она ломается, когда столбцы X̃ линейно зависимы — например, когда один признак повторяет другой.
</p>
<div class="math-display" data-tex="x_3 = 2x_1 \ \Rightarrow\ \det(\tilde X^{\top}\tilde X) = 0"></div>
<div class="stage" id="stage-nl" tabindex="0">
  <div class="stage-figure">
<svg id="nl" viewBox="0 0 960 600" role="img" aria-label="Что ломается: коллинеарный признак делает матрицу Грама вырожденной">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 310 L 214 310" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#nl-arw)"/><text x="232.0" y="302.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#C30B0A" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="34" y="364" width="182" height="128" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="x3"><g><rect x="330.0" y="160.0" width="56.0" height="112.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="358.0" y1="160.0" x2="358.0" y2="272.0" class="grid" opacity=".75"/><line x1="330.0" y1="188.0" x2="386.0" y2="188.0" class="grid" opacity=".75"/><line x1="330.0" y1="216.0" x2="386.0" y2="216.0" class="grid" opacity=".75"/><line x1="330.0" y1="244.0" x2="386.0" y2="244.0" class="grid" opacity=".75"/></g><g><rect x="386.0" y="160.0" width="28.0" height="112.0" rx="2" fill="#C30B0A" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="386.0" y1="188.0" x2="414.0" y2="188.0" class="grid" opacity=".75"/><line x1="386.0" y1="216.0" x2="414.0" y2="216.0" class="grid" opacity=".75"/><line x1="386.0" y1="244.0" x2="414.0" y2="244.0" class="grid" opacity=".75"/></g><g><rect x="414.0" y="160.0" width="28.0" height="112.0" rx="2" fill="#8A857C" opacity="0.35" stroke="#ffffff" stroke-width="1"/><line x1="414.0" y1="188.0" x2="442.0" y2="188.0" class="grid" opacity=".75"/><line x1="414.0" y1="216.0" x2="442.0" y2="216.0" class="grid" opacity=".75"/><line x1="414.0" y1="244.0" x2="442.0" y2="244.0" class="grid" opacity=".75"/></g><text x="400.0" y="152.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">x₃ = 2x₁</text><foreignObject x="316.0" y="278.0" width="140.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X\ [4\times4]"></div></foreignObject></g><g data-key="a"><path d="M 460.0 216.0 L 500.0 216.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#nl-arw)"/><g><rect x="506.0" y="160.0" width="112.0" height="112.0" rx="2" fill="#3576C0" opacity="0.6" stroke="#ffffff" stroke-width="1"/><line x1="534.0" y1="160.0" x2="534.0" y2="272.0" class="grid" opacity=".75"/><line x1="562.0" y1="160.0" x2="562.0" y2="272.0" class="grid" opacity=".75"/><line x1="590.0" y1="160.0" x2="590.0" y2="272.0" class="grid" opacity=".75"/><line x1="506.0" y1="188.0" x2="618.0" y2="188.0" class="grid" opacity=".75"/><line x1="506.0" y1="216.0" x2="618.0" y2="216.0" class="grid" opacity=".75"/><line x1="506.0" y1="244.0" x2="618.0" y2="244.0" class="grid" opacity=".75"/></g><foreignObject x="502.0" y="278.0" width="120.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A\ [4\times4]"></div></foreignObject><text x="640.0" y="200.0" font-size="15" fill="#C30B0A" text-anchor="start" font-weight="800">det A = 0</text><text x="640.0" y="220.0" font-size="13" fill="#C30B0A" text-anchor="start">ранг 3 из 4</text></g><g data-key="two"><foreignObject x="290.0" y="330.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta_a = (1.17,\,-1.09,\,0,\,3.22), \quad \theta_b = (-0.83,\,-1.09,\,1,\,3.22)"></div></foreignObject><text x="615.0" y="390.0" font-size="13" fill="#C30B0A" text-anchor="middle">разные веса — одинаковые предсказания: веса x₁ и x₃ можно перекладывать друг в друга</text></g><g data-key="ridge" data-only="1"><foreignObject x="290.0" y="430.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta_{ridge} = (\tilde X^{\top}\tilde X + \lambda I)^{-1}\tilde X^{\top} Y"></div></foreignObject><text x="615.0" y="490.0" font-size="13" fill="#4E9A38" text-anchor="middle">λ = 0.1 делает матрицу обратимой: одно решение ценой чуть большей ошибки</text></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — предсказания · красное — остатки</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl x3" data-focus="hl x3">
      <div class="step-kicker">Шаг 1 · эксперимент</div>
      <h4>Добавим площадь ещё раз</h4>
      <p>Третий признак — та же площадь, но в пятиметровых единицах: x₃ = 2x₁. Новой информации нет.</p>
    </div>
    <div class="step-panel" data-on="hl x3 a" data-focus="a">
      <div class="step-kicker">Шаг 2 · поломка</div>
      <h4>A стала вырожденной</h4>
      <p>Столбцы X̃ линейно зависимы, и матрица Грама теряет обратимость: det A = 0. Формула θ* = A⁻¹c перестаёт работать.</p>
    </div>
    <div class="step-panel" data-on="hl a two" data-focus="two">
      <div class="step-kicker">Шаг 3 · неединственность</div>
      <h4>Бесконечно много решений</h4>
      <p>Уменьшим w₁ на 2 и прибавим 1 к w₃ — предсказания не изменятся ни на одном объекте. Минимум потерь один, а весов, которые его дают, — целая прямая.</p>
    </div>
    <div class="step-panel" data-on="hl a ridge" data-focus="ridge">
      <div class="step-kicker">Шаг 4 · лечение</div>
      <h4>Гребень: + λI</h4>
      <p>Добавка λ на диагональ делает A обратимой и выбирает из всех решений самое «короткое».</p>
    </div>
    <div class="step-panel" data-on="hl x3 two ridge" data-focus="two ridge">
      <div class="step-kicker">Шаг 5 · вывод</div>
      <h4>Почему это важно</h4>
      <p>На практике точной коллинеарности почти не бывает, но сильно коррелированные признаки дают почти вырожденную A: веса становятся огромными и неустойчивыми. Регуляризация — стандартное лекарство.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Вырожденная матрица, два разных решения и гребень.</p>
<div class="stage" id="stage-nln" tabindex="0">
  <div class="stage-figure">
<svg id="nln" viewBox="0 0 960 380" role="img" aria-label="Числовая проверка вырожденности">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: четыре признака, из них два одинаковых</text><g data-key="a"><g><rect x="166.0" y="70.0" width="68.0" height="68.0" rx="2" fill="#3576C0" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="183.0" y1="70.0" x2="183.0" y2="138.0" class="grid" opacity=".75"/><line x1="200.0" y1="70.0" x2="200.0" y2="138.0" class="grid" opacity=".75"/><line x1="217.0" y1="70.0" x2="217.0" y2="138.0" class="grid" opacity=".75"/><line x1="166.0" y1="87.0" x2="234.0" y2="87.0" class="grid" opacity=".75"/><line x1="166.0" y1="104.0" x2="234.0" y2="104.0" class="grid" opacity=".75"/><line x1="166.0" y1="121.0" x2="234.0" y2="121.0" class="grid" opacity=".75"/></g><text x="200.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">4</text><text x="156.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="110.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="A"></div></foreignObject><foreignObject x="105.0" y="168.0" width="190.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}30 &amp; 16 &amp; 60 &amp; 10 \\ 16 &amp; 15 &amp; 32 &amp; 7 \\ 60 &amp; 32 &amp; 120 &amp; 20 \\ 10 &amp; 7 &amp; 20 &amp; 4\end{bmatrix}"></div></foreignObject><text x="200.0" y="300.0" font-size="13" fill="#C30B0A" text-anchor="middle" font-weight="700">det A = 0</text></g><g data-key="two"><foreignObject x="360.0" y="90.0" width="590.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\tilde X\theta_a - \tilde X\theta_b = (0,\ 0,\ 0,\ 0)"></div></foreignObject><text x="650.0" y="150.0" font-size="13" fill="#C30B0A" text-anchor="middle">одинаковые предсказания, L = 0.1957 у обоих</text></g><g data-key="ridge" data-only="1"><foreignObject x="360.0" y="200.0" width="590.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta_{ridge} = (0.27,\ -0.81,\ 0.54,\ 2.22), \quad L = 0.2554"></div></foreignObject><text x="650.0" y="260.0" font-size="13" fill="#4E9A38" text-anchor="middle">x₁ и x₃ поделили вес: 0.27 + 2 · 0.54 ≈ 1.36</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="a" data-focus="a">
      <div class="step-kicker">Шаг 1 · A [4 × 4]</div>
      <h4>Третий столбец = 2 × первый</h4>
      <p>Видно прямо по числам: третья строка и третий столбец ровно вдвое больше первых.</p>
    </div>
    <div class="step-panel" data-on="a two" data-focus="two">
      <div class="step-kicker">Шаг 2 · два решения</div>
      <h4>Разница предсказаний — ноль</h4>
      <p>θ_a — старый оптимум с нулевым весом при x₃, θ_b — тот же оптимум, где часть веса площади переложена в x₃.</p>
    </div>
    <div class="step-panel" data-on="two ridge" data-focus="ridge">
      <div class="step-kicker">Шаг 3 · гребень</div>
      <h4>Единственное решение</h4>
      <p>Потеря чуть выше минимума (0.2554 против 0.1957) — это плата за устойчивость.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> при линейно зависимых признаках минимум потери есть, а единственного решения нет; регуляризация λI возвращает обратимость ценой небольшого смещения.
</div>

---


## Часть 10. Градиент: обратный проход

<p>
  Второй путь — градиентный спуск. Обратный проход по карте вычислений даёт градиент, как у любой
  нейросети:
</p>
<div class="math-display" data-tex="dR = \frac{2R}{B},\qquad d\hat Y = dR, \qquad dW = X^{\top} d\hat Y, \qquad db = \sum_i d\hat y_i"></div>
<div class="stage" id="stage-bpg" tabindex="0">
  <div class="stage-figure">
<svg id="bpg" viewBox="0 0 960 470" role="img" aria-label="Карта обратного прохода линейной регрессии">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Обратный проход: тот же конвейер справа налево</text><g data-key="c0"><rect x="48" y="70" width="64" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="80" y="150" transform="rotate(-90 80 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Вход X</text></g><g data-key="c1"><rect x="228" y="70" width="64" height="150" rx="10" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.8"/><text x="260" y="150" transform="rotate(-90 260 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear</text><rect x="198" y="234" width="124" height="32" rx="7" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.4"/><text x="260.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W [2×1] · b [1]</text></g><g data-key="c2"><rect x="408" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="440" y="150" transform="rotate(-90 440 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Ŷ − Y</text><rect x="378" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.4"/><text x="440.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c3"><rect x="588" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="620" y="150" transform="rotate(-90 620 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">квадрат</text><rect x="558" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.4"/><text x="620.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c4"><rect x="768" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#C30B0A" stroke-width="1.8"/><text x="800" y="150" transform="rotate(-90 800 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">среднее</text><rect x="738" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#C30B0A" stroke-width="1.4"/><text x="800.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><path d="M 115.0 145.0 L 225.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="170.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">X</text><text x="170.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 2]</text><path d="M 295.0 145.0 L 405.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="350.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Ŷ</text><text x="350.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 475.0 145.0 L 585.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="530.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">R</text><text x="530.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 655.0 145.0 L 765.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="710.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">R²</text><text x="710.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 835.0 145.0 L 948.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="891.5" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">L</text><text x="891.5" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[1]</text><g data-key="yy"><path d="M 440.0 320.0 L 440.0 224.0" fill="none" stroke="#5E5850" stroke-width="1.6" marker-end="url(#bpg-arw)"/><text x="440.0" y="338.0" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="700">Y [4 × 1]</text></g><g data-key="g3"><text x="710.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">1/B</text></g><g data-key="g2"><text x="530.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dR = 2R/B</text></g><g data-key="g1"><text x="350.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dŶ</text></g><g data-key="g0"><text x="170.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dX</text></g><g data-key="wg"><text x="260.0" y="290.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dW = Xᵀ dŶ,  db = Σ dŶ</text></g><g data-key="mag" data-only="1"><path d="M 930.0 380.0 L 40.0 380.0" fill="none" stroke="#E39A9A" stroke-width="3" marker-end="url(#bpg-bw)"/><rect x="290" y="364" width="400" height="32" rx="16" fill="#FDF3F3" stroke="#E39A9A"/><text x="490.0" y="385.0" font-size="13" fill="#C30B0A" text-anchor="middle" font-weight="700">градиент течёт справа налево, формы те же</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="c4 c3 g3" data-focus="g3">
      <div class="step-kicker">Шаг 1 · среднее назад</div>
      <h4>Каждому квадрату — 1/B</h4>
      <p>Среднее из B чисел: производная по каждому — 1/B.</p>
    </div>
    <div class="step-panel" data-on="c3 c2 g2" data-focus="g2">
      <div class="step-kicker">Шаг 2 · квадрат назад</div>
      <h4>2R/B</h4>
      <p>Производная r² — 2r. Получается столбец <code>[4 × 1]</code>, как у R.</p>
    </div>
    <div class="step-panel" data-on="c2 c1 yy g1" data-focus="g1">
      <div class="step-kicker">Шаг 3 · вычитание назад</div>
      <h4>dŶ = dR</h4>
      <p>Y — константа, Ŷ входит в R с плюсом, так что градиент проходит без изменений.</p>
    </div>
    <div class="step-panel" data-on="c1 g1 wg" data-focus="wg">
      <div class="step-kicker">Шаг 4 · линейный слой</div>
      <h4>Две формулы для весов</h4>
      <p>dW = Xᵀ·dŶ <code>[2 × 4] · [4 × 1] = [2 × 1]</code> и db = сумма dŶ. Градиент по X не нужен — это данные.</p>
    </div>
    <div class="step-panel" data-on="c0 c1 c2 c3 c4 g0 g1 g2 g3 wg mag" data-focus="mag">
      <div class="step-kicker">Шаг 5 · целиком</div>
      <h4>Три производных</h4>
      <p>Весь обратный проход — три строки кода. Вместе: ∇θ = (2/B)·X̃ᵀ(X̃θ − Y).</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<p class="tiny">Для краткости <span class="math-inline" data-tex="dT"></span> означает <span class="math-inline" data-tex="\partial L / \partial T"></span>.</p>
<div class="stage" id="stage-bp1" tabindex="0">
  <div class="stage-figure">
<svg id="bp1" viewBox="0 0 960 360" role="img" aria-label="Числовой градиент линейной регрессии">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: градиент в точке θ = (2, −1, 1)</text><g data-key="dy"><g><rect x="151.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="151.5" y1="87.0" x2="168.5" y2="87.0" class="grid" opacity=".75"/><line x1="151.5" y1="104.0" x2="168.5" y2="104.0" class="grid" opacity=".75"/><line x1="151.5" y1="121.0" x2="168.5" y2="121.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="141.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="70.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dY = 2R/B"></div></foreignObject><foreignObject x="115.0" y="168.0" width="90.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.5 \\ 0.5 \\ -0.5 \\ 0.5\end{bmatrix}"></div></foreignObject></g><g data-key="dw"><g><rect x="411.5" y="78.0" width="17.0" height="34.0" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="411.5" y1="95.0" x2="428.5" y2="95.0" class="grid" opacity=".75"/></g><text x="420.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="401.5" y="99.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="330.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dW = X^{\top}dY"></div></foreignObject><foreignObject x="375.0" y="142.0" width="90.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2.0 \\ -0.5\end{bmatrix}"></div></foreignObject><text x="420.0" y="250.0" font-size="12" fill="#5E5850" text-anchor="middle">[2 × 4] · [4 × 1] = [2 × 1]</text></g><g data-key="db"><g><rect x="651.5" y="95.0" width="17.0" height="17.0" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/></g><text x="660.0" y="87.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="641.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="570.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="db = \textstyle\sum dY"></div></foreignObject><foreignObject x="620.0" y="142.0" width="80.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.0\end{bmatrix}"></div></foreignObject><text x="660.0" y="230.0" font-size="13" fill="#C30B0A" text-anchor="middle" font-weight="700">ровно 0</text></g><g data-key="chk" data-only="1"><text x="480.0" y="320.0" font-size="13" fill="#3576C0" text-anchor="middle">сверка центральными разностями: 2.1 · 10⁻¹⁰</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="dy" data-focus="dy">
      <div class="step-kicker">Шаг 1 · первый градиент</div>
      <h4>2R/B = R/2</h4>
      <p>(−0.5, 0.5, −0.5, 0.5).</p>
    </div>
    <div class="step-panel" data-on="dy dw" data-focus="dw">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>dW = (2, −0.5)</h4>
      <p>Первая клетка: (−0.5)·2 + 0.5·3 + (−0.5)·1 + 0.5·4 = 2. Положительный градиент — вес площади надо уменьшать.</p>
    </div>
    <div class="step-panel" data-on="dy db" data-focus="db">
      <div class="step-kicker">Шаг 3 · смещение</div>
      <h4>db = 0</h4>
      <p>Остатки в сумме дают ноль, поэтому смещение на первом шаге не сдвинется. Это то же наблюдение, что X̃ᵀR = (4, −1, 0) в части 7: третья клетка — столбец единиц.</p>
    </div>
    <div class="step-panel" data-on="dw db chk" data-focus="chk">
      <div class="step-kicker">Шаг 4 · проверка</div>
      <h4>Численно — то же</h4>
      <p>Сдвигаем каждый параметр на ±10⁻⁶ и пересчитываем потерю.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> градиент MSE — <span class="math-inline" data-tex="\tfrac{2}{B}\tilde X^{\top}(\tilde X\theta - Y)"></span>: те же формулы линейного слоя, что в MLP, только выход один.
</div>

---


## Часть 11. Шаг градиентного спуска

<div class="math-display" data-tex="\theta \leftarrow \theta - \eta\,\nabla_\theta L, \qquad \nabla_\theta L = \frac{2}{B}\tilde X^{\top}(\tilde X\theta - Y)"></div>
<div class="stage" id="stage-bp2" tabindex="0">
  <div class="stage-figure">
<svg id="bp2" viewBox="0 0 960 600" role="img" aria-label="Шаг градиентного спуска в формах матриц">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 310 L 214 310" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#bp2-arw)"/><text x="232.0" y="302.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Остаток Ŷ − Y</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Квадрат R²</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="34" y="364" width="182" height="52" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="w"><g><rect x="320.0" y="200.0" width="30.0" height="90.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="320.0" y1="230.0" x2="350.0" y2="230.0" class="grid" opacity=".75"/><line x1="320.0" y1="260.0" x2="350.0" y2="260.0" class="grid" opacity=".75"/></g><foreignObject x="280.0" y="296.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta"></div></foreignObject></g><g data-key="dw"><text x="370.0" y="250.0" font-size="22" fill="#111111" text-anchor="middle">−</text><text x="398.0" y="255.0" font-size="18" fill="#111111" text-anchor="middle" font-style="italic">η</text><text x="420.0" y="250.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="436.0" y="200.0" width="30.0" height="90.0" rx="2" fill="#D83BB9" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="436.0" y1="230.0" x2="466.0" y2="230.0" class="grid" opacity=".75"/><line x1="436.0" y1="260.0" x2="466.0" y2="260.0" class="grid" opacity=".75"/></g><foreignObject x="396.0" y="296.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\nabla_\theta L"></div></foreignObject></g><g data-key="new"><text x="486.0" y="250.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="502.0" y="200.0" width="30.0" height="90.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="502.0" y1="230.0" x2="532.0" y2="230.0" class="grid" opacity=".75"/><line x1="502.0" y1="260.0" x2="532.0" y2="260.0" class="grid" opacity=".75"/></g><foreignObject x="462.0" y="296.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta_{new}"></div></foreignObject></g><g data-key="grad"><foreignObject x="290.0" y="360.0" width="650.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\nabla_\theta L = \frac{2}{B}\,\tilde X^{\top}(\tilde X\theta - Y), \qquad [3 \times 4]\cdot[4 \times 1] = [3 \times 1]"></div></foreignObject></g><g data-key="zero" data-only="1"><text x="615.0" y="440.0" font-size="13" fill="#4E9A38" text-anchor="middle" font-weight="700">в оптимуме градиент = 0 ⇔ X̃ᵀX̃θ = X̃ᵀY — нормальные уравнения</text></g><g data-key="eta" data-only="1"><text x="615.0" y="480.0" font-size="13" fill="#C30B0A" text-anchor="middle">η — шаг: слишком маленький — медленно, слишком большой — расходится</text></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — предсказания · красное — остатки · розовое — градиенты</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl w" data-focus="hl w">
      <div class="step-kicker">Шаг 1 · параметры</div>
      <h4>θ = (w₁, w₂, b)</h4>
      <p>Все три числа в одном столбце — трюк с единицей из части 6.</p>
    </div>
    <div class="step-panel" data-on="hl w dw grad" data-focus="dw grad">
      <div class="step-kicker">Шаг 2 · градиент</div>
      <h4>Той же формы</h4>
      <p>Градиент по θ — столбец <code>[3 × 1]</code>: по числу на параметр.</p>
    </div>
    <div class="step-panel" data-on="hl w dw new" data-focus="new">
      <div class="step-kicker">Шаг 3 · шаг</div>
      <h4>θ − η∇L</h4>
      <p>Сдвигаем параметры против градиента — туда, где потеря уменьшается быстрее всего.</p>
    </div>
    <div class="step-panel" data-on="hl grad zero" data-focus="zero">
      <div class="step-kicker">Шаг 4 · где остановиться</div>
      <h4>Градиент ноль — это нормальные уравнения</h4>
      <p>Спуск и формула из части 8 ищут одну и ту же точку: спуск — постепенно, формула — сразу.</p>
    </div>
    <div class="step-panel" data-on="hl new eta" data-focus="eta">
      <div class="step-kicker">Шаг 5 · размер шага</div>
      <h4>η решает всё</h4>
      <p>У MSE поверхность — чаша, и её кривизна задаёт предельный шаг: η_max = 2 / λ_max, где λ_max — наибольшее собственное число матрицы (2/B)·X̃ᵀX̃.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Первый шаг с η = 0.05.</p>
<div class="stage" id="stage-bp2n" tabindex="0">
  <div class="stage-figure">
<svg id="bp2n" viewBox="0 0 960 360" role="img" aria-label="Первый шаг градиентного спуска в числах">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: первый шаг, η = 0.05</text><g data-key="w"><g><rect x="151.5" y="70.0" width="17.0" height="51.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="151.5" y1="87.0" x2="168.5" y2="87.0" class="grid" opacity=".75"/><line x1="151.5" y1="104.0" x2="168.5" y2="104.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="141.5" y="99.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="70.0" y="124.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta"></div></foreignObject><foreignObject x="120.0" y="151.0" width="80.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 \\ -1 \\ 1\end{bmatrix}"></div></foreignObject><text x="230.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">−</text><text x="262.0" y="110.0" font-size="15" fill="#111111" text-anchor="middle">0.05 ·</text></g><g data-key="dw"><g><rect x="331.5" y="70.0" width="17.0" height="51.0" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="331.5" y1="87.0" x2="348.5" y2="87.0" class="grid" opacity=".75"/><line x1="331.5" y1="104.0" x2="348.5" y2="104.0" class="grid" opacity=".75"/></g><text x="340.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="321.5" y="99.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="250.0" y="124.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\nabla L"></div></foreignObject><foreignObject x="295.0" y="151.0" width="90.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2.0 \\ -0.5 \\ 0.0\end{bmatrix}"></div></foreignObject></g><g data-key="new"><text x="410.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="491.5" y="70.0" width="17.0" height="51.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="491.5" y1="87.0" x2="508.5" y2="87.0" class="grid" opacity=".75"/><line x1="491.5" y1="104.0" x2="508.5" y2="104.0" class="grid" opacity=".75"/></g><text x="500.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="481.5" y="99.5" font-size="13" fill="#111111" text-anchor="end">3</text><foreignObject x="410.0" y="124.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\theta_1"></div></foreignObject><foreignObject x="445.0" y="151.0" width="110.0" height="81.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.900 \\ -0.975 \\ 1.000\end{bmatrix}"></div></foreignObject></g><g data-key="L" data-only="1"><text x="780.0" y="100.0" font-size="15" fill="#111111" text-anchor="middle" font-weight="800">L: 1.0000 → 0.8448</text><text x="780.0" y="124.0" font-size="13" fill="#C30B0A" text-anchor="middle">b не сдвинулось</text></g><g data-key="lim" data-only="1"><text x="480.0" y="300.0" font-size="13" fill="#3576C0" text-anchor="middle">η_max = 2 / 21.949 = 0.0911: собственные числа (2/B)X̃ᵀX̃ — 0.107, 2.44, 21.95; обусловленность 204.7</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="w dw" data-focus="w dw">
      <div class="step-kicker">Шаг 1 · что есть</div>
      <h4>θ и градиент</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="w dw new" data-focus="new">
      <div class="step-kicker">Шаг 2 · шаг</div>
      <h4>θ₁ = (1.9, −0.975, 1)</h4>
      <p>w₁ уменьшился на 0.1, w₂ вырос на 0.025, b на месте.</p>
    </div>
    <div class="step-panel" data-on="new L" data-focus="L">
      <div class="step-kicker">Шаг 3 · результат</div>
      <h4>0.8448</h4>
      <p>Потеря упала на 15 % за один шаг.</p>
    </div>
    <div class="step-panel" data-on="L lim" data-focus="lim">
      <div class="step-kicker">Шаг 4 · предел шага</div>
      <h4>η_max = 0.0911</h4>
      <p>Большое отношение собственных чисел — «вытянутая» чаша: по одному направлению она крутая, по другому пологая, и спуск идёт медленно.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> спуск сдвигает θ против градиента; его точка остановки — там, где градиент ноль, то есть ровно решение нормальных уравнений.
</div>

---


## Часть 12. Обучение: спуск против формулы

<p>Проверим градиент численно, запустим спуск с разными шагами и сравним с точным ответом.</p>
<div class="math-display" data-tex="\eta_{max} = \frac{2}{\lambda_{max}\big(\tfrac{2}{B}\tilde X^{\top}\tilde X\big)} = 0.0911"></div>
<div class="stage" id="stage-tr" tabindex="0">
  <div class="stage-figure">
<svg id="tr" viewBox="0 0 960 520" role="img" aria-label="Кривые обучения при разных шагах и сверка с точным решением">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Обучение: спуск против формулы</text><g data-key="check"><text x="30.0" y="90.0" font-size="13" fill="#111111" text-anchor="start" font-weight="700">сверка градиента: 2.1 · 10⁻¹⁰</text><text x="30.0" y="120.0" font-size="13" fill="#111111" text-anchor="start">точный минимум (часть 8): L* = 0.1957</text></g><g data-key="e05t" data-only="1"><text x="30.0" y="170.0" font-size="13" fill="#4E9A38" text-anchor="start" font-weight="700">η = 0.05: до L* с точностью 10⁻⁶ за 1167 шагов</text></g><g data-key="e09t" data-only="1"><text x="30.0" y="196.0" font-size="13" fill="#3576C0" text-anchor="start" font-weight="700">η = 0.09: за 647 шагов — у самого предела</text></g><g data-key="e10t" data-only="1"><text x="30.0" y="222.0" font-size="13" fill="#C30B0A" text-anchor="start" font-weight="700">η = 0.10 &gt; η_max: расходится, через 60 шагов</text><text x="30.0" y="240.0" font-size="13" fill="#C30B0A" text-anchor="start">потеря порядка 10⁸</text></g><g data-key="endt" data-only="1"><text x="30.0" y="290.0" font-size="13" fill="#111111" text-anchor="start">спуск пришёл ровно к θ* = (27, −25, 74)/23:</text><text x="30.0" y="308.0" font-size="13" fill="#111111" text-anchor="start">та же точка, что даёт формула</text></g><line x1="520" y1="440" x2="920" y2="440" stroke="#8A857C"/><line x1="520" y1="440" x2="520" y2="100" stroke="#8A857C"/><text x="512.0" y="444.0" font-size="12" fill="#5E5850" text-anchor="end">0,0</text><line x1="520" y1="440" x2="920" y2="440" stroke="#EFECE4"/><text x="512.0" y="334.0" font-size="12" fill="#5E5850" text-anchor="end">0,5</text><line x1="520" y1="330.0" x2="920" y2="330.0" stroke="#EFECE4"/><text x="512.0" y="224.0" font-size="12" fill="#5E5850" text-anchor="end">1,0</text><line x1="520" y1="220.0" x2="920" y2="220.0" stroke="#EFECE4"/><text x="512.0" y="114.0" font-size="12" fill="#5E5850" text-anchor="end">1,5</text><line x1="520" y1="110.0" x2="920" y2="110.0" stroke="#EFECE4"/><text x="520.0" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">0</text><text x="653.3" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">400</text><text x="786.7" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">800</text><text x="920.0" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">1200</text><text x="920.0" y="476.0" font-size="12" fill="#5E5850" text-anchor="end">шаг</text><text x="526.0" y="92.0" font-size="13" fill="#5E5850" text-anchor="start" font-style="italic">L</text><line x1="520" y1="397.0" x2="920" y2="397.0" stroke="#4E9A38" stroke-dasharray="5 4"/><text x="920.0" y="391.0" font-size="12" fill="#4E9A38" text-anchor="end">L* = 0.1957</text><g data-key="c05"><polyline points="520.0,220.0 520.3,254.1 520.7,273.7 521.0,288.8 521.3,300.6 521.7,309.9 522.0,317.1 522.3,322.8 522.7,327.4 523.0,331.0 523.3,334.0 523.7,336.3 524.0,338.3 524.3,340.0 524.7,341.4 525.0,342.6 525.3,343.6 525.7,344.5 526.0,345.4 526.3,346.1 526.7,346.8 527.0,347.5 527.3,348.1 527.7,348.7 528.0,349.3 528.3,349.9 528.7,350.4 529.0,350.9 529.3,351.4 529.7,351.9 530.0,352.4 530.3,352.9 530.7,353.4 531.0,353.9 531.3,354.3 531.7,354.8 532.0,355.2 532.3,355.7 532.7,356.1 533.0,356.6 533.3,357.0 533.7,357.4 534.0,357.9 534.3,358.3 534.7,358.7 535.0,359.1 535.3,359.5 535.7,359.9 536.0,360.3 536.3,360.7 536.7,361.1 537.0,361.5 537.3,361.8 537.7,362.2 538.0,362.6 538.3,363.0 538.7,363.3 539.0,363.7 539.3,364.0 539.7,364.4 540.0,364.7 540.3,365.1 540.7,365.4 541.0,365.8 541.3,366.1 541.7,366.4 542.0,366.8 542.3,367.1 542.7,367.4 543.0,367.7 543.3,368.0 543.7,368.3 544.0,368.6 544.3,368.9 544.7,369.2 545.0,369.5 545.3,369.8 545.7,370.1 546.0,370.4 546.3,370.7 546.7,371.0 547.0,371.2 547.3,371.5 547.7,371.8 548.0,372.1 548.3,372.3 548.7,372.6 549.0,372.9 549.3,373.1 549.7,373.4 550.0,373.6 550.3,373.9 550.7,374.1 551.0,374.4 551.3,374.6 551.7,374.8 552.0,375.1 552.3,375.3 552.7,375.5 553.0,375.8 553.3,376.0 553.7,376.2 554.0,376.4 554.3,376.7 554.7,376.9 555.0,377.1 555.3,377.3 555.7,377.5 556.0,377.7 556.3,377.9 556.7,378.1 557.0,378.3 557.3,378.5 557.7,378.7 558.0,378.9 558.3,379.1 558.7,379.3 559.0,379.5 559.3,379.7 559.7,379.9 560.0,380.1 560.3,380.2 560.7,380.4 561.0,380.6 561.3,380.8 561.7,380.9 562.0,381.1 562.3,381.3 562.7,381.4 563.0,381.6 563.3,381.8 563.7,381.9 564.0,382.1 564.3,382.3 564.7,382.4 565.0,382.6 565.3,382.7 565.7,382.9 566.0,383.0 566.3,383.2 566.7,383.3 567.0,383.5 567.3,383.6 567.7,383.8 568.0,383.9 568.3,384.0 568.7,384.2 569.0,384.3 569.3,384.4 569.7,384.6 570.0,384.7 570.3,384.8 570.7,385.0 571.0,385.1 571.3,385.2 571.7,385.4 572.0,385.5 572.3,385.6 572.7,385.7 573.0,385.8 573.3,386.0 573.7,386.1 574.0,386.2 574.3,386.3 574.7,386.4 575.0,386.5 575.3,386.6 575.7,386.8 576.0,386.9 576.3,387.0 576.7,387.1 577.0,387.2 577.3,387.3 577.7,387.4 578.0,387.5 578.3,387.6 578.7,387.7 579.0,387.8 579.3,387.9 579.7,388.0 580.0,388.1 580.3,388.2 580.7,388.3 581.0,388.4 581.3,388.5 581.7,388.6 582.0,388.6 582.3,388.7 582.7,388.8 583.0,388.9 583.3,389.0 583.7,389.1 584.0,389.2 584.3,389.2 584.7,389.3 585.0,389.4 585.3,389.5 585.7,389.6 586.0,389.6 586.3,389.7 586.7,389.8 587.0,389.9 587.3,390.0 587.7,390.0 588.0,390.1 588.3,390.2 588.7,390.2 589.0,390.3 589.3,390.4 589.7,390.5 590.0,390.5 590.3,390.6 590.7,390.7 591.0,390.7 591.3,390.8 591.7,390.9 592.0,390.9 592.3,391.0 592.7,391.1 593.0,391.1 593.3,391.2 593.7,391.2 594.0,391.3 594.3,391.4 594.7,391.4 595.0,391.5 595.3,391.5 595.7,391.6 596.0,391.7 596.3,391.7 596.7,391.8 597.0,391.8 597.3,391.9 597.7,391.9 598.0,392.0 598.3,392.0 598.7,392.1 599.0,392.2 599.3,392.2 599.7,392.3 600.0,392.3 600.3,392.4 600.7,392.4 601.0,392.5 601.3,392.5 601.7,392.5 602.0,392.6 602.3,392.6 602.7,392.7 603.0,392.7 603.3,392.8 603.7,392.8 604.0,392.9 604.3,392.9 604.7,393.0 605.0,393.0 605.3,393.0 605.7,393.1 606.0,393.1 606.3,393.2 606.7,393.2 607.0,393.2 607.3,393.3 607.7,393.3 608.0,393.4 608.3,393.4 608.7,393.4 609.0,393.5 609.3,393.5 609.7,393.5 610.0,393.6 610.3,393.6 610.7,393.7 611.0,393.7 611.3,393.7 611.7,393.8 612.0,393.8 612.3,393.8 612.7,393.9 613.0,393.9 613.3,393.9 613.7,394.0 614.0,394.0 614.3,394.0 614.7,394.1 615.0,394.1 615.3,394.1 615.7,394.1 616.0,394.2 616.3,394.2 616.7,394.2 617.0,394.3 617.3,394.3 617.7,394.3 618.0,394.4 618.3,394.4 618.7,394.4 619.0,394.4 619.3,394.5 619.7,394.5 620.0,394.5 620.3,394.5 620.7,394.6 621.0,394.6 621.3,394.6 621.7,394.6 622.0,394.7 622.3,394.7 622.7,394.7 623.0,394.7 623.3,394.8 623.7,394.8 624.0,394.8 624.3,394.8 624.7,394.9 625.0,394.9 625.3,394.9 625.7,394.9 626.0,394.9 626.3,395.0 626.7,395.0 627.0,395.0 627.3,395.0 627.7,395.0 628.0,395.1 628.3,395.1 628.7,395.1 629.0,395.1 629.3,395.1 629.7,395.2 630.0,395.2 630.3,395.2 630.7,395.2 631.0,395.2 631.3,395.3 631.7,395.3 632.0,395.3 632.3,395.3 632.7,395.3 633.0,395.4 633.3,395.4 633.7,395.4 634.0,395.4 634.3,395.4 634.7,395.4 635.0,395.5 635.3,395.5 635.7,395.5 636.0,395.5 636.3,395.5 636.7,395.5 637.0,395.5 637.3,395.6 637.7,395.6 638.0,395.6 638.3,395.6 638.7,395.6 639.0,395.6 639.3,395.6 639.7,395.7 640.0,395.7 640.3,395.7 640.7,395.7 641.0,395.7 641.3,395.7 641.7,395.7 642.0,395.8 642.3,395.8 642.7,395.8 643.0,395.8 643.3,395.8 643.7,395.8 644.0,395.8 644.3,395.8 644.7,395.9 645.0,395.9 645.3,395.9 645.7,395.9 646.0,395.9 646.3,395.9 646.7,395.9 647.0,395.9 647.3,395.9 647.7,396.0 648.0,396.0 648.3,396.0 648.7,396.0 649.0,396.0 649.3,396.0 649.7,396.0 650.0,396.0 650.3,396.0 650.7,396.0 651.0,396.1 651.3,396.1 651.7,396.1 652.0,396.1 652.3,396.1 652.7,396.1 653.0,396.1 653.3,396.1 653.7,396.1 654.0,396.1 654.3,396.1 654.7,396.2 655.0,396.2 655.3,396.2 655.7,396.2 656.0,396.2 656.3,396.2 656.7,396.2 657.0,396.2 657.3,396.2 657.7,396.2 658.0,396.2 658.3,396.2 658.7,396.3 659.0,396.3 659.3,396.3 659.7,396.3 660.0,396.3 660.3,396.3 660.7,396.3 661.0,396.3 661.3,396.3 661.7,396.3 662.0,396.3 662.3,396.3 662.7,396.3 663.0,396.3 663.3,396.4 663.7,396.4 664.0,396.4 664.3,396.4 664.7,396.4 665.0,396.4 665.3,396.4 665.7,396.4 666.0,396.4 666.3,396.4 666.7,396.4 667.0,396.4 667.3,396.4 667.7,396.4 668.0,396.4 668.3,396.4 668.7,396.4 669.0,396.5 669.3,396.5 669.7,396.5 670.0,396.5 670.3,396.5 670.7,396.5 671.0,396.5 671.3,396.5 671.7,396.5 672.0,396.5 672.3,396.5 672.7,396.5 673.0,396.5 673.3,396.5 673.7,396.5 674.0,396.5 674.3,396.5 674.7,396.5 675.0,396.5 675.3,396.5 675.7,396.6 676.0,396.6 676.3,396.6 676.7,396.6 677.0,396.6 677.3,396.6 677.7,396.6 678.0,396.6 678.3,396.6 678.7,396.6 679.0,396.6 679.3,396.6 679.7,396.6 680.0,396.6 680.3,396.6 680.7,396.6 681.0,396.6 681.3,396.6 681.7,396.6 682.0,396.6 682.3,396.6 682.7,396.6 683.0,396.6 683.3,396.6 683.7,396.6 684.0,396.6 684.3,396.6 684.7,396.7 685.0,396.7 685.3,396.7 685.7,396.7 686.0,396.7 686.3,396.7 686.7,396.7 687.0,396.7 687.3,396.7 687.7,396.7 688.0,396.7 688.3,396.7 688.7,396.7 689.0,396.7 689.3,396.7 689.7,396.7 690.0,396.7 690.3,396.7 690.7,396.7 691.0,396.7 691.3,396.7 691.7,396.7 692.0,396.7 692.3,396.7 692.7,396.7 693.0,396.7 693.3,396.7 693.7,396.7 694.0,396.7 694.3,396.7 694.7,396.7 695.0,396.7 695.3,396.7 695.7,396.7 696.0,396.7 696.3,396.7 696.7,396.8 697.0,396.8 697.3,396.8 697.7,396.8 698.0,396.8 698.3,396.8 698.7,396.8 699.0,396.8 699.3,396.8 699.7,396.8 700.0,396.8 700.3,396.8 700.7,396.8 701.0,396.8 701.3,396.8 701.7,396.8 702.0,396.8 702.3,396.8 702.7,396.8 703.0,396.8 703.3,396.8 703.7,396.8 704.0,396.8 704.3,396.8 704.7,396.8 705.0,396.8 705.3,396.8 705.7,396.8 706.0,396.8 706.3,396.8 706.7,396.8 707.0,396.8 707.3,396.8 707.7,396.8 708.0,396.8 708.3,396.8 708.7,396.8 709.0,396.8 709.3,396.8 709.7,396.8 710.0,396.8 710.3,396.8 710.7,396.8 711.0,396.8 711.3,396.8 711.7,396.8 712.0,396.8 712.3,396.8 712.7,396.8 713.0,396.8 713.3,396.8 713.7,396.8 714.0,396.8 714.3,396.8 714.7,396.8 715.0,396.8 715.3,396.8 715.7,396.8 716.0,396.8 716.3,396.8 716.7,396.8 717.0,396.8 717.3,396.9 717.7,396.9 718.0,396.9 718.3,396.9 718.7,396.9 719.0,396.9 719.3,396.9 719.7,396.9 720.0,396.9 720.3,396.9 720.7,396.9 721.0,396.9 721.3,396.9 721.7,396.9 722.0,396.9 722.3,396.9 722.7,396.9 723.0,396.9 723.3,396.9 723.7,396.9 724.0,396.9 724.3,396.9 724.7,396.9 725.0,396.9 725.3,396.9 725.7,396.9 726.0,396.9 726.3,396.9 726.7,396.9 727.0,396.9 727.3,396.9 727.7,396.9 728.0,396.9 728.3,396.9 728.7,396.9 729.0,396.9 729.3,396.9 729.7,396.9 730.0,396.9 730.3,396.9 730.7,396.9 731.0,396.9 731.3,396.9 731.7,396.9 732.0,396.9 732.3,396.9 732.7,396.9 733.0,396.9 733.3,396.9 733.7,396.9 734.0,396.9 734.3,396.9 734.7,396.9 735.0,396.9 735.3,396.9 735.7,396.9 736.0,396.9 736.3,396.9 736.7,396.9 737.0,396.9 737.3,396.9 737.7,396.9 738.0,396.9 738.3,396.9 738.7,396.9 739.0,396.9 739.3,396.9 739.7,396.9 740.0,396.9 740.3,396.9 740.7,396.9 741.0,396.9 741.3,396.9 741.7,396.9 742.0,396.9 742.3,396.9 742.7,396.9 743.0,396.9 743.3,396.9 743.7,396.9 744.0,396.9 744.3,396.9 744.7,396.9 745.0,396.9 745.3,396.9 745.7,396.9 746.0,396.9 746.3,396.9 746.7,396.9 747.0,396.9 747.3,396.9 747.7,396.9 748.0,396.9 748.3,396.9 748.7,396.9 749.0,396.9 749.3,396.9 749.7,396.9 750.0,396.9 750.3,396.9 750.7,396.9 751.0,396.9 751.3,396.9 751.7,396.9 752.0,396.9 752.3,396.9 752.7,396.9 753.0,396.9 753.3,396.9 753.7,396.9 754.0,396.9 754.3,396.9 754.7,396.9 755.0,396.9 755.3,396.9 755.7,396.9 756.0,396.9 756.3,396.9 756.7,396.9 757.0,396.9 757.3,396.9 757.7,396.9 758.0,396.9 758.3,396.9 758.7,396.9 759.0,396.9 759.3,396.9 759.7,396.9 760.0,396.9 760.3,396.9 760.7,396.9 761.0,396.9 761.3,396.9 761.7,396.9 762.0,396.9 762.3,396.9 762.7,396.9 763.0,396.9 763.3,396.9 763.7,396.9 764.0,396.9 764.3,396.9 764.7,396.9 765.0,396.9 765.3,396.9 765.7,396.9 766.0,396.9 766.3,396.9 766.7,396.9 767.0,396.9 767.3,396.9 767.7,396.9 768.0,396.9 768.3,396.9 768.7,396.9 769.0,396.9 769.3,396.9 769.7,396.9 770.0,396.9 770.3,396.9 770.7,396.9 771.0,396.9 771.3,396.9 771.7,396.9 772.0,396.9 772.3,396.9 772.7,396.9 773.0,396.9 773.3,396.9 773.7,396.9 774.0,396.9 774.3,396.9 774.7,396.9 775.0,396.9 775.3,396.9 775.7,396.9 776.0,396.9 776.3,396.9 776.7,396.9 777.0,396.9 777.3,396.9 777.7,396.9 778.0,396.9 778.3,396.9 778.7,396.9 779.0,396.9 779.3,396.9 779.7,396.9 780.0,396.9 780.3,396.9 780.7,396.9 781.0,396.9 781.3,396.9 781.7,396.9 782.0,396.9 782.3,396.9 782.7,396.9 783.0,396.9 783.3,396.9 783.7,396.9 784.0,396.9 784.3,396.9 784.7,396.9 785.0,396.9 785.3,396.9 785.7,396.9 786.0,396.9 786.3,396.9 786.7,396.9 787.0,396.9 787.3,396.9 787.7,396.9 788.0,396.9 788.3,396.9 788.7,396.9 789.0,396.9 789.3,396.9 789.7,396.9 790.0,396.9 790.3,396.9 790.7,396.9 791.0,396.9 791.3,396.9 791.7,396.9 792.0,396.9 792.3,396.9 792.7,396.9 793.0,396.9 793.3,396.9 793.7,396.9 794.0,396.9 794.3,396.9 794.7,396.9 795.0,396.9 795.3,396.9 795.7,396.9 796.0,396.9 796.3,396.9 796.7,396.9 797.0,396.9 797.3,396.9 797.7,396.9 798.0,396.9 798.3,396.9 798.7,396.9 799.0,396.9 799.3,396.9 799.7,396.9 800.0,396.9 800.3,396.9 800.7,396.9 801.0,396.9 801.3,396.9 801.7,396.9 802.0,396.9 802.3,396.9 802.7,396.9 803.0,396.9 803.3,396.9 803.7,396.9 804.0,397.0 804.3,397.0 804.7,397.0 805.0,397.0 805.3,397.0 805.7,397.0 806.0,397.0 806.3,397.0 806.7,397.0 807.0,397.0 807.3,397.0 807.7,397.0 808.0,397.0 808.3,397.0 808.7,397.0 809.0,397.0 809.3,397.0 809.7,397.0 810.0,397.0 810.3,397.0 810.7,397.0 811.0,397.0 811.3,397.0 811.7,397.0 812.0,397.0 812.3,397.0 812.7,397.0 813.0,397.0 813.3,397.0 813.7,397.0 814.0,397.0 814.3,397.0 814.7,397.0 815.0,397.0 815.3,397.0 815.7,397.0 816.0,397.0 816.3,397.0 816.7,397.0 817.0,397.0 817.3,397.0 817.7,397.0 818.0,397.0 818.3,397.0 818.7,397.0 819.0,397.0 819.3,397.0 819.7,397.0 820.0,397.0 820.3,397.0 820.7,397.0 821.0,397.0 821.3,397.0 821.7,397.0 822.0,397.0 822.3,397.0 822.7,397.0 823.0,397.0 823.3,397.0 823.7,397.0 824.0,397.0 824.3,397.0 824.7,397.0 825.0,397.0 825.3,397.0 825.7,397.0 826.0,397.0 826.3,397.0 826.7,397.0 827.0,397.0 827.3,397.0 827.7,397.0 828.0,397.0 828.3,397.0 828.7,397.0 829.0,397.0 829.3,397.0 829.7,397.0 830.0,397.0 830.3,397.0 830.7,397.0 831.0,397.0 831.3,397.0 831.7,397.0 832.0,397.0 832.3,397.0 832.7,397.0 833.0,397.0 833.3,397.0 833.7,397.0 834.0,397.0 834.3,397.0 834.7,397.0 835.0,397.0 835.3,397.0 835.7,397.0 836.0,397.0 836.3,397.0 836.7,397.0 837.0,397.0 837.3,397.0 837.7,397.0 838.0,397.0 838.3,397.0 838.7,397.0 839.0,397.0 839.3,397.0 839.7,397.0 840.0,397.0 840.3,397.0 840.7,397.0 841.0,397.0 841.3,397.0 841.7,397.0 842.0,397.0 842.3,397.0 842.7,397.0 843.0,397.0 843.3,397.0 843.7,397.0 844.0,397.0 844.3,397.0 844.7,397.0 845.0,397.0 845.3,397.0 845.7,397.0 846.0,397.0 846.3,397.0 846.7,397.0 847.0,397.0 847.3,397.0 847.7,397.0 848.0,397.0 848.3,397.0 848.7,397.0 849.0,397.0 849.3,397.0 849.7,397.0 850.0,397.0 850.3,397.0 850.7,397.0 851.0,397.0 851.3,397.0 851.7,397.0 852.0,397.0 852.3,397.0 852.7,397.0 853.0,397.0 853.3,397.0 853.7,397.0 854.0,397.0 854.3,397.0 854.7,397.0 855.0,397.0 855.3,397.0 855.7,397.0 856.0,397.0 856.3,397.0 856.7,397.0 857.0,397.0 857.3,397.0 857.7,397.0 858.0,397.0 858.3,397.0 858.7,397.0 859.0,397.0 859.3,397.0 859.7,397.0 860.0,397.0 860.3,397.0 860.7,397.0 861.0,397.0 861.3,397.0 861.7,397.0 862.0,397.0 862.3,397.0 862.7,397.0 863.0,397.0 863.3,397.0 863.7,397.0 864.0,397.0 864.3,397.0 864.7,397.0 865.0,397.0 865.3,397.0 865.7,397.0 866.0,397.0 866.3,397.0 866.7,397.0 867.0,397.0 867.3,397.0 867.7,397.0 868.0,397.0 868.3,397.0 868.7,397.0 869.0,397.0 869.3,397.0 869.7,397.0 870.0,397.0 870.3,397.0 870.7,397.0 871.0,397.0 871.3,397.0 871.7,397.0 872.0,397.0 872.3,397.0 872.7,397.0 873.0,397.0 873.3,397.0 873.7,397.0 874.0,397.0 874.3,397.0 874.7,397.0 875.0,397.0 875.3,397.0 875.7,397.0 876.0,397.0 876.3,397.0 876.7,397.0 877.0,397.0 877.3,397.0 877.7,397.0 878.0,397.0 878.3,397.0 878.7,397.0 879.0,397.0 879.3,397.0 879.7,397.0 880.0,397.0 880.3,397.0 880.7,397.0 881.0,397.0 881.3,397.0 881.7,397.0 882.0,397.0 882.3,397.0 882.7,397.0 883.0,397.0 883.3,397.0 883.7,397.0 884.0,397.0 884.3,397.0 884.7,397.0 885.0,397.0 885.3,397.0 885.7,397.0 886.0,397.0 886.3,397.0 886.7,397.0 887.0,397.0 887.3,397.0 887.7,397.0 888.0,397.0 888.3,397.0 888.7,397.0 889.0,397.0 889.3,397.0 889.7,397.0 890.0,397.0 890.3,397.0 890.7,397.0 891.0,397.0 891.3,397.0 891.7,397.0 892.0,397.0 892.3,397.0 892.7,397.0 893.0,397.0 893.3,397.0 893.7,397.0 894.0,397.0 894.3,397.0 894.7,397.0 895.0,397.0 895.3,397.0 895.7,397.0 896.0,397.0 896.3,397.0 896.7,397.0 897.0,397.0 897.3,397.0 897.7,397.0 898.0,397.0 898.3,397.0 898.7,397.0 899.0,397.0 899.3,397.0 899.7,397.0 900.0,397.0 900.3,397.0 900.7,397.0 901.0,397.0 901.3,397.0 901.7,397.0 902.0,397.0 902.3,397.0 902.7,397.0 903.0,397.0 903.3,397.0 903.7,397.0 904.0,397.0 904.3,397.0 904.7,397.0 905.0,397.0 905.3,397.0 905.7,397.0 906.0,397.0 906.3,397.0 906.7,397.0 907.0,397.0 907.3,397.0 907.7,397.0 908.0,397.0 908.3,397.0 908.7,397.0 909.0,397.0 909.3,397.0 909.7,397.0 910.0,397.0 910.3,397.0 910.7,397.0 911.0,397.0 911.3,397.0 911.7,397.0 912.0,397.0 912.3,397.0 912.7,397.0 913.0,397.0 913.3,397.0 913.7,397.0 914.0,397.0 914.3,397.0 914.7,397.0 915.0,397.0 915.3,397.0 915.7,397.0 916.0,397.0 916.3,397.0 916.7,397.0 917.0,397.0 917.3,397.0 917.7,397.0 918.0,397.0 918.3,397.0 918.7,397.0 919.0,397.0 919.3,397.0 919.7,397.0 920.0,397.0" fill="none" stroke="#4E9A38" stroke-width="2.6"/></g><g data-key="c09" data-only="1"><polyline points="520.0,220.0 520.3,263.3 520.7,290.2 521.0,307.2 521.3,318.0 521.7,325.2 522.0,330.1 522.3,333.6 522.7,336.2 523.0,338.3 523.3,340.1 523.7,341.6 524.0,343.0 524.3,344.3 524.7,345.5 525.0,346.6 525.3,347.8 525.7,348.8 526.0,349.9 526.3,350.9 526.7,351.9 527.0,352.9 527.3,353.8 527.7,354.7 528.0,355.6 528.3,356.5 528.7,357.4 529.0,358.2 529.3,359.0 529.7,359.8 530.0,360.6 530.3,361.3 530.7,362.1 531.0,362.8 531.3,363.5 531.7,364.2 532.0,364.9 532.3,365.5 532.7,366.2 533.0,366.8 533.3,367.4 533.7,368.0 534.0,368.6 534.3,369.2 534.7,369.8 535.0,370.3 535.3,370.9 535.7,371.4 536.0,371.9 536.3,372.4 536.7,372.9 537.0,373.4 537.3,373.9 537.7,374.3 538.0,374.8 538.3,375.2 538.7,375.7 539.0,376.1 539.3,376.5 539.7,376.9 540.0,377.3 540.3,377.7 540.7,378.1 541.0,378.5 541.3,378.8 541.7,379.2 542.0,379.5 542.3,379.9 542.7,380.2 543.0,380.5 543.3,380.9 543.7,381.2 544.0,381.5 544.3,381.8 544.7,382.1 545.0,382.4 545.3,382.7 545.7,383.0 546.0,383.2 546.3,383.5 546.7,383.8 547.0,384.0 547.3,384.3 547.7,384.5 548.0,384.8 548.3,385.0 548.7,385.2 549.0,385.5 549.3,385.7 549.7,385.9 550.0,386.1 550.3,386.3 550.7,386.5 551.0,386.8 551.3,386.9 551.7,387.1 552.0,387.3 552.3,387.5 552.7,387.7 553.0,387.9 553.3,388.1 553.7,388.2 554.0,388.4 554.3,388.6 554.7,388.7 555.0,388.9 555.3,389.0 555.7,389.2 556.0,389.4 556.3,389.5 556.7,389.6 557.0,389.8 557.3,389.9 557.7,390.1 558.0,390.2 558.3,390.3 558.7,390.5 559.0,390.6 559.3,390.7 559.7,390.8 560.0,390.9 560.3,391.1 560.7,391.2 561.0,391.3 561.3,391.4 561.7,391.5 562.0,391.6 562.3,391.7 562.7,391.8 563.0,391.9 563.3,392.0 563.7,392.1 564.0,392.2 564.3,392.3 564.7,392.4 565.0,392.5 565.3,392.6 565.7,392.6 566.0,392.7 566.3,392.8 566.7,392.9 567.0,393.0 567.3,393.0 567.7,393.1 568.0,393.2 568.3,393.3 568.7,393.3 569.0,393.4 569.3,393.5 569.7,393.5 570.0,393.6 570.3,393.7 570.7,393.7 571.0,393.8 571.3,393.9 571.7,393.9 572.0,394.0 572.3,394.0 572.7,394.1 573.0,394.1 573.3,394.2 573.7,394.2 574.0,394.3 574.3,394.4 574.7,394.4 575.0,394.4 575.3,394.5 575.7,394.5 576.0,394.6 576.3,394.6 576.7,394.7 577.0,394.7 577.3,394.8 577.7,394.8 578.0,394.9 578.3,394.9 578.7,394.9 579.0,395.0 579.3,395.0 579.7,395.0 580.0,395.1 580.3,395.1 580.7,395.2 581.0,395.2 581.3,395.2 581.7,395.3 582.0,395.3 582.3,395.3 582.7,395.4 583.0,395.4 583.3,395.4 583.7,395.4 584.0,395.5 584.3,395.5 584.7,395.5 585.0,395.6 585.3,395.6 585.7,395.6 586.0,395.6 586.3,395.7 586.7,395.7 587.0,395.7 587.3,395.7 587.7,395.8 588.0,395.8 588.3,395.8 588.7,395.8 589.0,395.8 589.3,395.9 589.7,395.9 590.0,395.9 590.3,395.9 590.7,395.9 591.0,396.0 591.3,396.0 591.7,396.0 592.0,396.0 592.3,396.0 592.7,396.1 593.0,396.1 593.3,396.1 593.7,396.1 594.0,396.1 594.3,396.1 594.7,396.2 595.0,396.2 595.3,396.2 595.7,396.2 596.0,396.2 596.3,396.2 596.7,396.2 597.0,396.3 597.3,396.3 597.7,396.3 598.0,396.3 598.3,396.3 598.7,396.3 599.0,396.3 599.3,396.3 599.7,396.4 600.0,396.4 600.3,396.4 600.7,396.4 601.0,396.4 601.3,396.4 601.7,396.4 602.0,396.4 602.3,396.4 602.7,396.5 603.0,396.5 603.3,396.5 603.7,396.5 604.0,396.5 604.3,396.5 604.7,396.5 605.0,396.5 605.3,396.5 605.7,396.5 606.0,396.5 606.3,396.6 606.7,396.6 607.0,396.6 607.3,396.6 607.7,396.6 608.0,396.6 608.3,396.6 608.7,396.6 609.0,396.6 609.3,396.6 609.7,396.6 610.0,396.6 610.3,396.6 610.7,396.6 611.0,396.6 611.3,396.7 611.7,396.7 612.0,396.7 612.3,396.7 612.7,396.7 613.0,396.7 613.3,396.7 613.7,396.7 614.0,396.7 614.3,396.7 614.7,396.7 615.0,396.7 615.3,396.7 615.7,396.7 616.0,396.7 616.3,396.7 616.7,396.7 617.0,396.7 617.3,396.7 617.7,396.7 618.0,396.8 618.3,396.8 618.7,396.8 619.0,396.8 619.3,396.8 619.7,396.8 620.0,396.8 620.3,396.8 620.7,396.8 621.0,396.8 621.3,396.8 621.7,396.8 622.0,396.8 622.3,396.8 622.7,396.8 623.0,396.8 623.3,396.8 623.7,396.8 624.0,396.8 624.3,396.8 624.7,396.8 625.0,396.8 625.3,396.8 625.7,396.8 626.0,396.8 626.3,396.8 626.7,396.8 627.0,396.8 627.3,396.8 627.7,396.8 628.0,396.8 628.3,396.8 628.7,396.8 629.0,396.8 629.3,396.9 629.7,396.9 630.0,396.9 630.3,396.9 630.7,396.9 631.0,396.9 631.3,396.9 631.7,396.9 632.0,396.9 632.3,396.9 632.7,396.9 633.0,396.9 633.3,396.9 633.7,396.9 634.0,396.9 634.3,396.9 634.7,396.9 635.0,396.9 635.3,396.9 635.7,396.9 636.0,396.9 636.3,396.9 636.7,396.9 637.0,396.9 637.3,396.9 637.7,396.9 638.0,396.9 638.3,396.9 638.7,396.9 639.0,396.9 639.3,396.9 639.7,396.9 640.0,396.9 640.3,396.9 640.7,396.9 641.0,396.9 641.3,396.9 641.7,396.9 642.0,396.9 642.3,396.9 642.7,396.9 643.0,396.9 643.3,396.9 643.7,396.9 644.0,396.9 644.3,396.9 644.7,396.9 645.0,396.9 645.3,396.9 645.7,396.9 646.0,396.9 646.3,396.9 646.7,396.9 647.0,396.9 647.3,396.9 647.7,396.9 648.0,396.9 648.3,396.9 648.7,396.9 649.0,396.9 649.3,396.9 649.7,396.9 650.0,396.9 650.3,396.9 650.7,396.9 651.0,396.9 651.3,396.9 651.7,396.9 652.0,396.9 652.3,396.9 652.7,396.9 653.0,396.9 653.3,396.9 653.7,396.9 654.0,396.9 654.3,396.9 654.7,396.9 655.0,396.9 655.3,396.9 655.7,396.9 656.0,396.9 656.3,396.9 656.7,396.9 657.0,396.9 657.3,396.9 657.7,396.9 658.0,396.9 658.3,396.9 658.7,396.9 659.0,396.9 659.3,396.9 659.7,396.9 660.0,396.9 660.3,396.9 660.7,396.9 661.0,396.9 661.3,396.9 661.7,396.9 662.0,396.9 662.3,396.9 662.7,396.9 663.0,396.9 663.3,396.9 663.7,396.9 664.0,396.9 664.3,396.9 664.7,396.9 665.0,396.9 665.3,396.9 665.7,396.9 666.0,396.9 666.3,396.9 666.7,396.9 667.0,396.9 667.3,396.9 667.7,396.9 668.0,396.9 668.3,396.9 668.7,396.9 669.0,396.9 669.3,396.9 669.7,396.9 670.0,396.9 670.3,396.9 670.7,396.9 671.0,396.9 671.3,396.9 671.7,396.9 672.0,396.9 672.3,396.9 672.7,396.9 673.0,396.9 673.3,396.9 673.7,396.9 674.0,396.9 674.3,396.9 674.7,396.9 675.0,396.9 675.3,396.9 675.7,396.9 676.0,396.9 676.3,396.9 676.7,396.9 677.0,396.9 677.3,397.0 677.7,397.0 678.0,397.0 678.3,397.0 678.7,397.0 679.0,397.0 679.3,397.0 679.7,397.0 680.0,397.0 680.3,397.0 680.7,397.0 681.0,397.0 681.3,397.0 681.7,397.0 682.0,397.0 682.3,397.0 682.7,397.0 683.0,397.0 683.3,397.0 683.7,397.0 684.0,397.0 684.3,397.0 684.7,397.0 685.0,397.0 685.3,397.0 685.7,397.0 686.0,397.0 686.3,397.0 686.7,397.0 687.0,397.0 687.3,397.0 687.7,397.0 688.0,397.0 688.3,397.0 688.7,397.0 689.0,397.0 689.3,397.0 689.7,397.0 690.0,397.0 690.3,397.0 690.7,397.0 691.0,397.0 691.3,397.0 691.7,397.0 692.0,397.0 692.3,397.0 692.7,397.0 693.0,397.0 693.3,397.0 693.7,397.0 694.0,397.0 694.3,397.0 694.7,397.0 695.0,397.0 695.3,397.0 695.7,397.0 696.0,397.0 696.3,397.0 696.7,397.0 697.0,397.0 697.3,397.0 697.7,397.0 698.0,397.0 698.3,397.0 698.7,397.0 699.0,397.0 699.3,397.0 699.7,397.0 700.0,397.0 700.3,397.0 700.7,397.0 701.0,397.0 701.3,397.0 701.7,397.0 702.0,397.0 702.3,397.0 702.7,397.0 703.0,397.0 703.3,397.0 703.7,397.0 704.0,397.0 704.3,397.0 704.7,397.0 705.0,397.0 705.3,397.0 705.7,397.0 706.0,397.0 706.3,397.0 706.7,397.0 707.0,397.0 707.3,397.0 707.7,397.0 708.0,397.0 708.3,397.0 708.7,397.0 709.0,397.0 709.3,397.0 709.7,397.0 710.0,397.0 710.3,397.0 710.7,397.0 711.0,397.0 711.3,397.0 711.7,397.0 712.0,397.0 712.3,397.0 712.7,397.0 713.0,397.0 713.3,397.0 713.7,397.0 714.0,397.0 714.3,397.0 714.7,397.0 715.0,397.0 715.3,397.0 715.7,397.0 716.0,397.0 716.3,397.0 716.7,397.0 717.0,397.0 717.3,397.0 717.7,397.0 718.0,397.0 718.3,397.0 718.7,397.0 719.0,397.0 719.3,397.0 719.7,397.0 720.0,397.0 720.3,397.0 720.7,397.0 721.0,397.0 721.3,397.0 721.7,397.0 722.0,397.0 722.3,397.0 722.7,397.0 723.0,397.0 723.3,397.0 723.7,397.0 724.0,397.0 724.3,397.0 724.7,397.0 725.0,397.0 725.3,397.0 725.7,397.0 726.0,397.0 726.3,397.0 726.7,397.0 727.0,397.0 727.3,397.0 727.7,397.0 728.0,397.0 728.3,397.0 728.7,397.0 729.0,397.0 729.3,397.0 729.7,397.0 730.0,397.0 730.3,397.0 730.7,397.0 731.0,397.0 731.3,397.0 731.7,397.0 732.0,397.0 732.3,397.0 732.7,397.0 733.0,397.0 733.3,397.0 733.7,397.0 734.0,397.0 734.3,397.0 734.7,397.0 735.0,397.0 735.3,397.0 735.7,397.0 736.0,397.0 736.3,397.0 736.7,397.0 737.0,397.0 737.3,397.0 737.7,397.0 738.0,397.0 738.3,397.0 738.7,397.0 739.0,397.0 739.3,397.0 739.7,397.0 740.0,397.0 740.3,397.0 740.7,397.0 741.0,397.0 741.3,397.0 741.7,397.0 742.0,397.0 742.3,397.0 742.7,397.0 743.0,397.0 743.3,397.0 743.7,397.0 744.0,397.0 744.3,397.0 744.7,397.0 745.0,397.0 745.3,397.0 745.7,397.0 746.0,397.0 746.3,397.0 746.7,397.0 747.0,397.0 747.3,397.0 747.7,397.0 748.0,397.0 748.3,397.0 748.7,397.0 749.0,397.0 749.3,397.0 749.7,397.0 750.0,397.0 750.3,397.0 750.7,397.0 751.0,397.0 751.3,397.0 751.7,397.0 752.0,397.0 752.3,397.0 752.7,397.0 753.0,397.0 753.3,397.0 753.7,397.0 754.0,397.0 754.3,397.0 754.7,397.0 755.0,397.0 755.3,397.0 755.7,397.0 756.0,397.0 756.3,397.0 756.7,397.0 757.0,397.0 757.3,397.0 757.7,397.0 758.0,397.0 758.3,397.0 758.7,397.0 759.0,397.0 759.3,397.0 759.7,397.0 760.0,397.0 760.3,397.0 760.7,397.0 761.0,397.0 761.3,397.0 761.7,397.0 762.0,397.0 762.3,397.0 762.7,397.0 763.0,397.0 763.3,397.0 763.7,397.0 764.0,397.0 764.3,397.0 764.7,397.0 765.0,397.0 765.3,397.0 765.7,397.0 766.0,397.0 766.3,397.0 766.7,397.0 767.0,397.0 767.3,397.0 767.7,397.0 768.0,397.0 768.3,397.0 768.7,397.0 769.0,397.0 769.3,397.0 769.7,397.0 770.0,397.0 770.3,397.0 770.7,397.0 771.0,397.0 771.3,397.0 771.7,397.0 772.0,397.0 772.3,397.0 772.7,397.0 773.0,397.0 773.3,397.0 773.7,397.0 774.0,397.0 774.3,397.0 774.7,397.0 775.0,397.0 775.3,397.0 775.7,397.0 776.0,397.0 776.3,397.0 776.7,397.0 777.0,397.0 777.3,397.0 777.7,397.0 778.0,397.0 778.3,397.0 778.7,397.0 779.0,397.0 779.3,397.0 779.7,397.0 780.0,397.0 780.3,397.0 780.7,397.0 781.0,397.0 781.3,397.0 781.7,397.0 782.0,397.0 782.3,397.0 782.7,397.0 783.0,397.0 783.3,397.0 783.7,397.0 784.0,397.0 784.3,397.0 784.7,397.0 785.0,397.0 785.3,397.0 785.7,397.0 786.0,397.0 786.3,397.0 786.7,397.0 787.0,397.0 787.3,397.0 787.7,397.0 788.0,397.0 788.3,397.0 788.7,397.0 789.0,397.0 789.3,397.0 789.7,397.0 790.0,397.0 790.3,397.0 790.7,397.0 791.0,397.0 791.3,397.0 791.7,397.0 792.0,397.0 792.3,397.0 792.7,397.0 793.0,397.0 793.3,397.0 793.7,397.0 794.0,397.0 794.3,397.0 794.7,397.0 795.0,397.0 795.3,397.0 795.7,397.0 796.0,397.0 796.3,397.0 796.7,397.0 797.0,397.0 797.3,397.0 797.7,397.0 798.0,397.0 798.3,397.0 798.7,397.0 799.0,397.0 799.3,397.0 799.7,397.0 800.0,397.0 800.3,397.0 800.7,397.0 801.0,397.0 801.3,397.0 801.7,397.0 802.0,397.0 802.3,397.0 802.7,397.0 803.0,397.0 803.3,397.0 803.7,397.0 804.0,397.0 804.3,397.0 804.7,397.0 805.0,397.0 805.3,397.0 805.7,397.0 806.0,397.0 806.3,397.0 806.7,397.0 807.0,397.0 807.3,397.0 807.7,397.0 808.0,397.0 808.3,397.0 808.7,397.0 809.0,397.0 809.3,397.0 809.7,397.0 810.0,397.0 810.3,397.0 810.7,397.0 811.0,397.0 811.3,397.0 811.7,397.0 812.0,397.0 812.3,397.0 812.7,397.0 813.0,397.0 813.3,397.0 813.7,397.0 814.0,397.0 814.3,397.0 814.7,397.0 815.0,397.0 815.3,397.0 815.7,397.0 816.0,397.0 816.3,397.0 816.7,397.0 817.0,397.0 817.3,397.0 817.7,397.0 818.0,397.0 818.3,397.0 818.7,397.0 819.0,397.0 819.3,397.0 819.7,397.0 820.0,397.0 820.3,397.0 820.7,397.0 821.0,397.0 821.3,397.0 821.7,397.0 822.0,397.0 822.3,397.0 822.7,397.0 823.0,397.0 823.3,397.0 823.7,397.0 824.0,397.0 824.3,397.0 824.7,397.0 825.0,397.0 825.3,397.0 825.7,397.0 826.0,397.0 826.3,397.0 826.7,397.0 827.0,397.0 827.3,397.0 827.7,397.0 828.0,397.0 828.3,397.0 828.7,397.0 829.0,397.0 829.3,397.0 829.7,397.0 830.0,397.0 830.3,397.0 830.7,397.0 831.0,397.0 831.3,397.0 831.7,397.0 832.0,397.0 832.3,397.0 832.7,397.0 833.0,397.0 833.3,397.0 833.7,397.0 834.0,397.0 834.3,397.0 834.7,397.0 835.0,397.0 835.3,397.0 835.7,397.0 836.0,397.0 836.3,397.0 836.7,397.0 837.0,397.0 837.3,397.0 837.7,397.0 838.0,397.0 838.3,397.0 838.7,397.0 839.0,397.0 839.3,397.0 839.7,397.0 840.0,397.0 840.3,397.0 840.7,397.0 841.0,397.0 841.3,397.0 841.7,397.0 842.0,397.0 842.3,397.0 842.7,397.0 843.0,397.0 843.3,397.0 843.7,397.0 844.0,397.0 844.3,397.0 844.7,397.0 845.0,397.0 845.3,397.0 845.7,397.0 846.0,397.0 846.3,397.0 846.7,397.0 847.0,397.0 847.3,397.0 847.7,397.0 848.0,397.0 848.3,397.0 848.7,397.0 849.0,397.0 849.3,397.0 849.7,397.0 850.0,397.0 850.3,397.0 850.7,397.0 851.0,397.0 851.3,397.0 851.7,397.0 852.0,397.0 852.3,397.0 852.7,397.0 853.0,397.0 853.3,397.0 853.7,397.0 854.0,397.0 854.3,397.0 854.7,397.0 855.0,397.0 855.3,397.0 855.7,397.0 856.0,397.0 856.3,397.0 856.7,397.0 857.0,397.0 857.3,397.0 857.7,397.0 858.0,397.0 858.3,397.0 858.7,397.0 859.0,397.0 859.3,397.0 859.7,397.0 860.0,397.0 860.3,397.0 860.7,397.0 861.0,397.0 861.3,397.0 861.7,397.0 862.0,397.0 862.3,397.0 862.7,397.0 863.0,397.0 863.3,397.0 863.7,397.0 864.0,397.0 864.3,397.0 864.7,397.0 865.0,397.0 865.3,397.0 865.7,397.0 866.0,397.0 866.3,397.0 866.7,397.0 867.0,397.0 867.3,397.0 867.7,397.0 868.0,397.0 868.3,397.0 868.7,397.0 869.0,397.0 869.3,397.0 869.7,397.0 870.0,397.0 870.3,397.0 870.7,397.0 871.0,397.0 871.3,397.0 871.7,397.0 872.0,397.0 872.3,397.0 872.7,397.0 873.0,397.0 873.3,397.0 873.7,397.0 874.0,397.0 874.3,397.0 874.7,397.0 875.0,397.0 875.3,397.0 875.7,397.0 876.0,397.0 876.3,397.0 876.7,397.0 877.0,397.0 877.3,397.0 877.7,397.0 878.0,397.0 878.3,397.0 878.7,397.0 879.0,397.0 879.3,397.0 879.7,397.0 880.0,397.0 880.3,397.0 880.7,397.0 881.0,397.0 881.3,397.0 881.7,397.0 882.0,397.0 882.3,397.0 882.7,397.0 883.0,397.0 883.3,397.0 883.7,397.0 884.0,397.0 884.3,397.0 884.7,397.0 885.0,397.0 885.3,397.0 885.7,397.0 886.0,397.0 886.3,397.0 886.7,397.0 887.0,397.0 887.3,397.0 887.7,397.0 888.0,397.0 888.3,397.0 888.7,397.0 889.0,397.0 889.3,397.0 889.7,397.0 890.0,397.0 890.3,397.0 890.7,397.0 891.0,397.0 891.3,397.0 891.7,397.0 892.0,397.0 892.3,397.0 892.7,397.0 893.0,397.0 893.3,397.0 893.7,397.0 894.0,397.0 894.3,397.0 894.7,397.0 895.0,397.0 895.3,397.0 895.7,397.0 896.0,397.0 896.3,397.0 896.7,397.0 897.0,397.0 897.3,397.0 897.7,397.0 898.0,397.0 898.3,397.0 898.7,397.0 899.0,397.0 899.3,397.0 899.7,397.0 900.0,397.0 900.3,397.0 900.7,397.0 901.0,397.0 901.3,397.0 901.7,397.0 902.0,397.0 902.3,397.0 902.7,397.0 903.0,397.0 903.3,397.0 903.7,397.0 904.0,397.0 904.3,397.0 904.7,397.0 905.0,397.0 905.3,397.0 905.7,397.0 906.0,397.0 906.3,397.0 906.7,397.0 907.0,397.0 907.3,397.0 907.7,397.0 908.0,397.0 908.3,397.0 908.7,397.0 909.0,397.0 909.3,397.0 909.7,397.0 910.0,397.0 910.3,397.0 910.7,397.0 911.0,397.0 911.3,397.0 911.7,397.0 912.0,397.0 912.3,397.0 912.7,397.0 913.0,397.0 913.3,397.0 913.7,397.0 914.0,397.0 914.3,397.0 914.7,397.0 915.0,397.0 915.3,397.0 915.7,397.0 916.0,397.0 916.3,397.0 916.7,397.0 917.0,397.0 917.3,397.0 917.7,397.0 918.0,397.0 918.3,397.0 918.7,397.0 919.0,397.0 919.3,397.0 919.7,397.0 920.0,397.0" fill="none" stroke="#3576C0" stroke-width="2.2"/></g><g data-key="c10" data-only="1"><polyline points="520.0,220.0 520.3,263.0 520.7,284.8 521.0,292.9 521.3,291.3 521.7,281.0 522.0,261.7 522.3,231.3 522.7,185.9 523.0,119.9 523.3,110.0 523.7,110.0 524.0,110.0 524.3,110.0 524.7,110.0 525.0,110.0 525.3,110.0 525.7,110.0 526.0,110.0 526.3,110.0 526.7,110.0 527.0,110.0 527.3,110.0 527.7,110.0 528.0,110.0 528.3,110.0 528.7,110.0 529.0,110.0 529.3,110.0 529.7,110.0 530.0,110.0 530.3,110.0 530.7,110.0 531.0,110.0 531.3,110.0 531.7,110.0 532.0,110.0 532.3,110.0 532.7,110.0 533.0,110.0 533.3,110.0 533.7,110.0 534.0,110.0 534.3,110.0 534.7,110.0 535.0,110.0 535.3,110.0 535.7,110.0 536.0,110.0 536.3,110.0 536.7,110.0 537.0,110.0 537.3,110.0 537.7,110.0 538.0,110.0 538.3,110.0 538.7,110.0 539.0,110.0 539.3,110.0 539.7,110.0 540.0,110.0" fill="none" stroke="#C30B0A" stroke-width="2.2"/></g>
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
      <h4>Формулы верны</h4>
      <p>Аналитический градиент совпал с численным, а точный минимум известен из нормальных уравнений.</p>
    </div>
    <div class="step-panel" data-on="check c05 e05t" data-focus="c05 e05t">
      <div class="step-kicker">Шаг 2 · η = 0.05</div>
      <h4>Медленно, но верно</h4>
      <p>Сначала потеря падает быстро (вдоль крутого направления чаши), потом долго ползёт вдоль пологого.</p>
    </div>
    <div class="step-panel" data-on="check c05 c09 e05t e09t" data-focus="c09 e09t">
      <div class="step-kicker">Шаг 3 · η = 0.09</div>
      <h4>Почти вдвое быстрее</h4>
      <p>Ближе к пределу 0.0911 — меньше шагов.</p>
    </div>
    <div class="step-panel" data-on="check c09 c10 e09t e10t" data-focus="c10 e10t">
      <div class="step-kicker">Шаг 4 · η = 0.10</div>
      <h4>Чуть больше предела — и взрыв</h4>
      <p>Вдоль крутого направления каждый шаг перелетает минимум всё дальше: 1.0 → 0.80 → … → 1.89 на десятом шаге → бесконечность.</p>
    </div>
    <div class="step-panel" data-on="c05 e05t endt" data-focus="endt">
      <div class="step-kicker">Шаг 5 · итог</div>
      <h4>Две дороги к одной точке</h4>
      <p>Нормальные уравнения дают ответ сразу, спуск — постепенно, зато работает там, где матрицу не обратить, и переносится на нейросети без изменений.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> спуск приходит к той же точке, что и формула, если шаг меньше <span class="math-inline" data-tex="2/\lambda_{max}"></span>; скорость определяет обусловленность — отношение крайних собственных чисел.
</div>

---


## Часть 13. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Модель:</strong> <span class="math-inline" data-tex="\hat Y = XW + b"></span>, <code>[B × d] · [d × 1] + [1] = [B × 1]</code> — один нейрон без активации.</li>
  <li><strong>Потеря:</strong> <span class="math-inline" data-tex="L = \tfrac{1}{B}R^{\top}R"></span>, ориентир — дисперсия Y; <span class="math-inline" data-tex="R^2 = 1 - L/\mathrm{Var}(Y)"></span>.</li>
  <li><strong>Столбец единиц</strong> превращает смещение в обычный вес: <span class="math-inline" data-tex="\hat Y = \tilde X\theta"></span>.</li>
  <li><strong>Геометрия:</strong> МНК — проекция Y на пространство столбцов; остаток ⟂ столбцам.</li>
  <li><strong>Нормальные уравнения:</strong> <span class="math-inline" data-tex="\tilde X^{\top}\tilde X\,\theta = \tilde X^{\top}Y"></span>.</li>
  <li><strong>Матрица Грама</strong> <code>[(d+1) × (d+1)]</code> от числа объектов не зависит; вырождена при коллинеарных признаках.</li>
  <li><strong>Гребень:</strong> <span class="math-inline" data-tex="(\tilde X^{\top}\tilde X + \lambda I)^{-1}\tilde X^{\top}Y"></span> — единственное решение всегда.</li>
  <li><strong>Градиент:</strong> <span class="math-inline" data-tex="\tfrac{2}{B}\tilde X^{\top}(\tilde X\theta - Y)"></span>; ноль градиента = нормальные уравнения.</li>
  <li><strong>Сумма остатков при модели со смещением</strong> в оптимуме равна нулю — это уравнение для b.</li>
  <li><strong>Шаг спуска</strong> ограничен <span class="math-inline" data-tex="2/\lambda_{max}"></span>, скорость — обусловленностью; поэтому признаки нормируют.</li>
</ol>

<p>
  Если держать в голове одну картину — пусть это будет цепочка форм
  <code>[B × (d+1)] · [(d+1) × 1] → [B × 1] → L</code> и обратно
  <code>[(d+1) × B] · [B × 1] → [(d+1) × 1]</code>. Всё остальное — две дороги к точке, где второе
  произведение обнуляется.
</p>

<div class="callout-yellow">
  <strong>Мелочи соглашений:</strong> многие источники пишут потерю как сумму квадратов (без 1/B) или
  как <span class="math-inline" data-tex="\tfrac{1}{2B}\sum r^2"></span> — тогда множитель 2 в градиенте исчезает, а шаг η
  надо подбирать заново; точка минимума от этого не меняется. В scikit-learn <code>LinearRegression</code> решает
  задачу через разложение матрицы (lstsq), а не явным обращением <span class="math-inline" data-tex="\tilde X^{\top}\tilde X"></span>, — это
  устойчивее к почти коллинеарным признакам.
</div>

<p class="tiny">
  Сквозной пример: X = [[2, 1], [3, 1], [1, 3], [4, 2]], Y = (5, 5, 1, 6), стартовые w = (2, −1), b = 1 — данные и
  веса учебные. На старте Ŷ = (4, 6, 0, 7), остатки (−1, 1, −1, 1), L = 1, градиент (2, −0,5, 0). Точное решение
  θ* = (27, −25, 74) / 23, L* = 9/46 = 0,1957, det(X̃ᵀX̃) = 46. Градиент сверен с центральными разностями при
  <span class="math-inline" data-tex="\varepsilon = 10^{-6}"></span>: расхождение 2,1 · 10<sup>−10</sup>.
  Спуск: η = 0,05 — 1167 шагов до L* с точностью 10⁻⁶, η = 0,09 — 647, η = 0,1 расходится; η_max = 0,0911,
  собственные числа (2/B)X̃ᵀX̃ — 0,107, 2,44 и 21,95. Коллинеарный пример: x₃ = 2x₁, гребень λ = 0,1.
  Все числа посчитаны numpy в двойной точности и округлены при выводе.
</p>
