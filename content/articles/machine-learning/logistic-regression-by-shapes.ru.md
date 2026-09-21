



<p class="lead">
  Логистическая регрессия — это линейная регрессия, после которой стоит сигмоида, а вместо
  квадрата ошибки — логарифм вероятности правильного класса. Формы матриц те же
  <code>[B × d] · [d × 1]</code>, а градиент выглядит ровно так же, как у линейной регрессии:
  производная сигмоиды сокращается с производной log loss.
</p>

<p>
  Статья завершает серию разборов по формам матриц — после трансформера, полносвязной,
  рекуррентной и свёрточной сетей и линейной регрессии: к каждой части — сцена, где матрицы
  нарисованы блоками без чисел, и сразу за ней «Те же шаги в числах». Сквозной пример — четыре
  студента и два признака; числа подобраны так, что логиты целые, а вероятности попарно дают в сумме 1.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Линейная регрессия</strong>
    <p>Нужно помнить <span class="math-inline" data-tex="\hat Y = XW + b"></span> и градиент <span class="math-inline" data-tex="X^{\top}d\hat Y"></span>.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Четыре студента</strong>
    <p>B = 4, признаки — часы подготовки и пропуски, ответ — сдал ли экзамен; старт w = (1, −1), b = −1.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Классификатор без чёрных ящиков</strong>
    <p>Вы сможете вывести градиент log loss, объяснить, почему не MSE, и зачем регуляризация на разделимых данных.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#73B222"></i>X — признаки</span>
  <span><i style="background:#9A9489"></i>Y — метки 0/1</span>
  <span><i style="background:#C29E08"></i>W, b и логиты Z</span>
  <span><i style="background:#E88919"></i>Ŷ — вероятности</span>
  <span><i style="background:#C30B0A"></i>потери и проблемы</span>
  <span><i style="background:#D83BB9"></i>градиенты</span>
</div>
<p class="tiny">Тёмный блок — обучаемые параметры, светлый блок того же цвета — то, что из них посчитано. На картах прямого прохода зелёная стрелка — движение вперёд, красная — обратный проход.</p>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не на всю
  схему сразу, а только на яркую часть. Слева в каждой сцене форм — карта вычислений: красная
  рамка показывает, какой блок разбирается сейчас. Стрелки на клавиатуре работают, когда сцена в фокусе.
</div>


## Часть 1. Общая схема: нейрон с сигмоидой

<p>
  Классификация отвечает не числом, а классом. Логистическая регрессия отвечает вероятностью
  класса 1: считает линейную комбинацию признаков и пропускает её через сигмоиду.
</p>
<div class="stage" id="stage-ar" tabindex="0">
  <div class="stage-figure">
<svg id="ar" viewBox="0 0 960 540" role="img" aria-label="Логистическая регрессия: нейрон с сигмоидой, вероятность сдачи и log loss">
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
<g data-key="in"><circle cx="170" cy="170" r="20" fill="#FFFFFF" stroke="#73B222" stroke-width="2.2"/><text x="170.0" y="175.0" font-size="13" fill="#111111" text-anchor="middle">x₁</text><text x="140.0" y="175.0" font-size="13" fill="#5E5850" text-anchor="end">часы подготовки</text><circle cx="170" cy="300" r="20" fill="#FFFFFF" stroke="#73B222" stroke-width="2.2"/><text x="170.0" y="305.0" font-size="13" fill="#111111" text-anchor="middle">x₂</text><text x="140.0" y="305.0" font-size="13" fill="#5E5850" text-anchor="end">пропуски</text></g><g data-key="w"><line x1="190" y1="170" x2="318" y2="235" stroke="#C29E08" stroke-width="2"/><line x1="190" y1="300" x2="318" y2="235" stroke="#C29E08" stroke-width="2"/><circle cx="350" cy="235" r="32" fill="#FFFFFF" stroke="#C29E08" stroke-width="2.2"/><text x="350.0" y="243.0" font-size="22" fill="#111111" text-anchor="middle">Σ</text><path d="M 350.0 310.0 L 350.0 269.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="350.0" y="328.0" font-size="13" fill="#A5850A" text-anchor="middle" font-weight="700">+ b</text></g><g data-key="sg"><path d="M 382.0 235.0 L 440.0 235.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="411.0" y="225.0" font-size="13" fill="#111111" text-anchor="middle" font-style="italic">z</text><rect x="444" y="195" width="110" height="80" rx="10" fill="#FEF4EA" stroke="#E88919" stroke-width="1.6"/><polyline points="459.0,261.6 459.7,261.6 460.3,261.6 461.0,261.5 461.7,261.5 462.4,261.4 463.0,261.4 463.7,261.3 464.4,261.3 465.1,261.2 465.7,261.1 466.4,261.1 467.1,261.0 467.7,260.9 468.4,260.8 469.1,260.7 469.8,260.6 470.4,260.5 471.1,260.3 471.8,260.2 472.4,260.0 473.1,259.9 473.8,259.7 474.5,259.5 475.1,259.3 475.8,259.1 476.5,258.8 477.2,258.6 477.8,258.3 478.5,258.0 479.2,257.7 479.8,257.3 480.5,256.9 481.2,256.5 481.9,256.1 482.5,255.7 483.2,255.2 483.9,254.7 484.5,254.1 485.2,253.5 485.9,252.9 486.6,252.2 487.2,251.5 487.9,250.8 488.6,250.0 489.3,249.2 489.9,248.4 490.6,247.5 491.3,246.6 491.9,245.6 492.6,244.6 493.3,243.6 494.0,242.5 494.6,241.5 495.3,240.4 496.0,239.2 496.6,238.1 497.3,236.9 498.0,235.8 498.7,234.6 499.3,233.4 500.0,232.2 500.7,231.1 501.4,229.9 502.0,228.8 502.7,227.6 503.4,226.5 504.0,225.5 504.7,224.4 505.4,223.4 506.1,222.4 506.7,221.4 507.4,220.5 508.1,219.6 508.7,218.8 509.4,218.0 510.1,217.2 510.8,216.5 511.4,215.8 512.1,215.1 512.8,214.5 513.5,213.9 514.1,213.3 514.8,212.8 515.5,212.3 516.1,211.9 516.8,211.5 517.5,211.1 518.2,210.7 518.8,210.3 519.5,210.0 520.2,209.7 520.8,209.4 521.5,209.2 522.2,208.9 522.9,208.7 523.5,208.5 524.2,208.3 524.9,208.1 525.6,208.0 526.2,207.8 526.9,207.7 527.6,207.5 528.2,207.4 528.9,207.3 529.6,207.2 530.3,207.1 530.9,207.0 531.6,206.9 532.3,206.9 532.9,206.8 533.6,206.7 534.3,206.7 535.0,206.6 535.6,206.6 536.3,206.5 537.0,206.5 537.7,206.4 538.3,206.4 539.0,206.4" fill="none" stroke="#E88919" stroke-width="2.4"/><text x="499.0" y="212.0" font-size="15" fill="#111111" text-anchor="middle" font-weight="800">σ</text><path d="M 554.0 235.0 L 620.0 235.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="650.0" y="240.0" font-size="18" fill="#111111" text-anchor="middle" font-weight="700">p</text><text x="650.0" y="262.0" font-size="12" fill="#5E5850" text-anchor="middle">вероятность «сдал»</text></g><g data-key="loss"><rect x="720" y="210" width="210" height="50" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.6"/><text x="825.0" y="232.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">−log p, если сдал</text><text x="825.0" y="250.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">−log(1 − p), если нет</text><path d="M 680.0 235.0 L 716.0 235.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><path d="M 825.0 330.0 L 825.0 264.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ar-arw)"/><text x="825.0" y="348.0" font-size="12" fill="#5E5850" text-anchor="middle">ответ y ∈ {0, 1}</text></g><g data-key="dec" data-only="1"><text x="499.0" y="420.0" font-size="14" fill="#3576C0" text-anchor="middle" font-weight="700">p &gt; 0.5 ⇔ z &gt; 0: граница решений — прямая w·x + b = 0</text></g><text x="20.0" y="528.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">зелёное — признаки · жёлтое — веса · оранжевое — вероятность · красное — потеря</text>
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
      <h4>Два числа о студенте</h4>
      <p>Часы подготовки и пропуски занятий. Ответ — сдал экзамен (1) или нет (0).</p>
    </div>
    <div class="step-panel" data-on="in w" data-focus="w">
      <div class="step-kicker">Шаг 2 · линейная часть</div>
      <h4>Та же взвешенная сумма</h4>
      <p>z = w₁x₁ + w₂x₂ + b — ровно линейная регрессия. Число z может быть любым, его называют логитом.</p>
    </div>
    <div class="step-panel" data-on="in w sg" data-focus="sg">
      <div class="step-kicker">Шаг 3 · сигмоида</div>
      <h4>Логит → вероятность</h4>
      <p>σ(z) = 1 / (1 + e⁻ᶻ) сжимает любое число в (0, 1). Логистическая регрессия — это нейрон с сигмоидой.</p>
    </div>
    <div class="step-panel" data-on="sg loss" data-focus="loss">
      <div class="step-kicker">Шаг 4 · потеря</div>
      <h4>Log loss</h4>
      <p>Если студент сдал, штраф −log p; если нет, −log(1 − p). Уверенная ошибка стоит очень дорого.</p>
    </div>
    <div class="step-panel" data-on="in w sg loss dec" data-focus="dec">
      <div class="step-kicker">Шаг 5 · решение</div>
      <h4>Порог 0.5</h4>
      <p>Класс 1, если p &gt; 0.5, то есть z &gt; 0. Поэтому модель, несмотря на сигмоиду, проводит между классами прямую — отсюда «линейный классификатор».</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Карта всех вычислений с формами.</p>
<div class="stage" id="stage-arn" tabindex="0">
  <div class="stage-figure">
<svg id="arn" viewBox="0 0 960 470" role="img" aria-label="Карта вычислений логистической регрессии с размерностями">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Пайплайн с размерностями: где какая матрица</text><g data-key="c0"><rect x="48" y="70" width="64" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="80" y="150" transform="rotate(-90 80 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Вход X</text></g><g data-key="c1"><rect x="228" y="70" width="64" height="150" rx="10" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.8"/><text x="260" y="150" transform="rotate(-90 260 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear</text><rect x="198" y="234" width="124" height="32" rx="7" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.4"/><text x="260.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W [2×1] · b [1]</text></g><g data-key="c2"><rect x="408" y="70" width="64" height="150" rx="10" fill="#FEF4EA" stroke="#E88919" stroke-width="1.8"/><text x="440" y="150" transform="rotate(-90 440 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">σ</text><rect x="378" y="234" width="124" height="32" rx="7" fill="#FEF4EA" stroke="#E88919" stroke-width="1.4"/><text x="440.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c3"><rect x="588" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="620" y="150" transform="rotate(-90 620 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">log loss</text><rect x="558" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.4"/><text x="620.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c4"><rect x="768" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#C30B0A" stroke-width="1.8"/><text x="800" y="150" transform="rotate(-90 800 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">среднее</text><rect x="738" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#C30B0A" stroke-width="1.4"/><text x="800.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><path d="M 115.0 145.0 L 225.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="170.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">X</text><text x="170.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 2]</text><path d="M 295.0 145.0 L 405.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="350.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z</text><text x="350.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 475.0 145.0 L 585.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="530.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Ŷ</text><text x="530.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 655.0 145.0 L 765.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="710.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">ℓ</text><text x="710.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 835.0 145.0 L 948.0 145.0" fill="none" stroke="#4E9A38" stroke-width="3" marker-end="url(#arn-fw)"/><text x="891.5" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">L</text><text x="891.5" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[1]</text><g data-key="yy"><path d="M 620.0 320.0 L 620.0 224.0" fill="none" stroke="#5E5850" stroke-width="1.6" marker-end="url(#arn-arw)"/><text x="620.0" y="338.0" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="700">Y [4 × 1]</text></g><g data-key="par"><rect x="150" y="400" width="84" height="32" rx="3" fill="#C29E08" opacity="0.9"/><text x="192.0" y="421.0" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="800">w₁ w₂</text><rect x="234" y="400" width="42" height="32" rx="3" fill="#A5850A"/><text x="255.0" y="421.0" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="800">b</text><text x="290.0" y="421.0" font-size="14" fill="#111111" text-anchor="start" font-weight="700">= 3 параметра — вся модель</text></g>
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
      <h4>Z = XW + b</h4>
      <p><code>[4 × 2] · [2 × 1] + [1] = [4 × 1]</code> — всё как в линейной регрессии.</p>
    </div>
    <div class="step-panel" data-on="c1 c2" data-focus="c2">
      <div class="step-kicker">Шаг 2 · сигмоида</div>
      <h4>Поэлементно, форма та же</h4>
      <p>Каждый логит превращается в вероятность своего объекта.</p>
    </div>
    <div class="step-panel" data-on="c2 c3 yy" data-focus="c3 yy">
      <div class="step-kicker">Шаг 3 · потеря объекта</div>
      <h4>Сравнение с Y</h4>
      <p>Y — нули и единицы той же формы.</p>
    </div>
    <div class="step-panel" data-on="c3 c4" data-focus="c4">
      <div class="step-kicker">Шаг 4 · среднее</div>
      <h4>L = 0.4701</h4>
      <p>Ориентир — ln 2 = 0.6931 (всем 0.5) и 0.5623 (всем доля сдавших 0.75).</p>
    </div>
    <div class="step-panel" data-on="c1 par" data-focus="par">
      <div class="step-kicker">Шаг 5 · параметры</div>
      <h4>Три числа</h4>
      <p>Сигмоида и потеря параметров не имеют.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<p class="tiny">Данные учебные: X = [[2, 2], [3, 1], [1, 2], [4, 1]], Y = (1, 1, 0, 1); стартовые веса w = (1, −1), b = −1 выбраны вручную. Все числа посчитаны numpy.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> логистическая регрессия — линейный слой, сигмоида и log loss; параметров столько же, сколько у линейной регрессии.
</div>

---


## Часть 2. Данные: метки 0 и 1

<div class="math-display" data-tex="X \in \mathbb{R}^{B\times d}, \qquad Y \in \{0,1\}^{B \times 1}"></div>
<div class="stage" id="stage-in" tabindex="0">
  <div class="stage-figure">
<svg id="in" viewBox="0 0 960 600" role="img" aria-label="Данные: студенты строками, ответы нули и единицы">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#in-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 230 L 214 230" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#in-arw)"/><text x="232.0" y="222.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#C30B0A" text-anchor="middle">Вход X</text><rect x="34" y="444" width="182" height="48" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="x"><g><rect x="330.0" y="150.0" width="60.0" height="120.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="360.0" y1="150.0" x2="360.0" y2="270.0" class="grid" opacity=".75"/><line x1="330.0" y1="180.0" x2="390.0" y2="180.0" class="grid" opacity=".75"/><line x1="330.0" y1="210.0" x2="390.0" y2="210.0" class="grid" opacity=".75"/><line x1="330.0" y1="240.0" x2="390.0" y2="240.0" class="grid" opacity=".75"/></g><text x="345.0" y="140.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">x₁</text><text x="375.0" y="140.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">x₂</text><foreignObject x="305.0" y="272.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject><text x="322.0" y="170.0" font-size="12" fill="#5E5850" text-anchor="end">студ. 1</text><text x="322.0" y="200.0" font-size="12" fill="#5E5850" text-anchor="end">студ. 2</text><text x="322.0" y="230.0" font-size="12" fill="#5E5850" text-anchor="end">студ. 3</text><text x="322.0" y="260.0" font-size="12" fill="#5E5850" text-anchor="end">студ. 4</text></g><g data-key="y"><g><rect x="640.0" y="150.0" width="30.0" height="120.0" rx="2" fill="#E4E1D7" opacity="1.0" stroke="#ffffff" stroke-width="1"/><line x1="640.0" y1="180.0" x2="670.0" y2="180.0" class="grid" opacity=".75"/><line x1="640.0" y1="210.0" x2="670.0" y2="210.0" class="grid" opacity=".75"/><line x1="640.0" y1="240.0" x2="670.0" y2="240.0" class="grid" opacity=".75"/></g><rect x="641" y="151" width="28" height="28" fill="#5E5850" opacity="0.8" rx="1"/><rect x="641" y="181" width="28" height="28" fill="#5E5850" opacity="0.8" rx="1"/><rect x="641" y="241" width="28" height="28" fill="#5E5850" opacity="0.8" rx="1"/><text x="655.0" y="140.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">y</text><foreignObject x="600.0" y="272.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><text x="690.0" y="170.0" font-size="13" fill="#5E5850" text-anchor="start">1 — сдал, 0 — нет</text></g><g data-key="leg"><text x="330.0" y="340.0" font-size="13" fill="#5E5850" text-anchor="start">x₁ — часы подготовки (десятки), x₂ — пропуски</text></g><g data-key="row" data-only="1"><rect x="330.0" y="150.0" width="60.0" height="30.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="420.0" y="170.0" font-size="13" fill="#C30B0A" text-anchor="start">один студент — строка</text></g><g data-key="shapes" data-only="1"><foreignObject x="290.0" y="400.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X \in \mathbb{R}^{4 \times 2}, \qquad Y \in \{0, 1\}^{4 \times 1}"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — посчитанное · оранжевое — вероятности</text>
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
      <h4>X [4 × 2]</h4>
      <p>Четыре студента, два признака. Данные учебные, подобраны для ручного счёта.</p>
    </div>
    <div class="step-panel" data-on="hl x row" data-focus="row">
      <div class="step-kicker">Шаг 2 · объект</div>
      <h4>Строка</h4>
      <p>Как во всей серии.</p>
    </div>
    <div class="step-panel" data-on="hl x y" data-focus="y">
      <div class="step-kicker">Шаг 3 · ответы</div>
      <h4>Нули и единицы</h4>
      <p>Сдали трое из четырёх. Ответ — не число на оси, а метка класса.</p>
    </div>
    <div class="step-panel" data-on="hl x y shapes" data-focus="shapes">
      <div class="step-kicker">Шаг 4 · формы</div>
      <h4>Те же формы, что в регрессии</h4>
      <p>Отличается только смысл Y — и поэтому выход модели и потеря.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Четыре студента.</p>
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: четыре студента</text><g data-key="x"><g><rect x="283.0" y="70.0" width="34.0" height="68.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="300.0" y1="70.0" x2="300.0" y2="138.0" class="grid" opacity=".75"/><line x1="283.0" y1="87.0" x2="317.0" y2="87.0" class="grid" opacity=".75"/><line x1="283.0" y1="104.0" x2="317.0" y2="104.0" class="grid" opacity=".75"/><line x1="283.0" y1="121.0" x2="317.0" y2="121.0" class="grid" opacity=".75"/></g><text x="300.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="273.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="210.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject><foreignObject x="245.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 &amp; 2 \\ 3 &amp; 1 \\ 1 &amp; 2 \\ 4 &amp; 1\end{bmatrix}"></div></foreignObject></g><g data-key="y"><g><rect x="611.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#9A9489" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="611.5" y1="87.0" x2="628.5" y2="87.0" class="grid" opacity=".75"/><line x1="611.5" y1="104.0" x2="628.5" y2="104.0" class="grid" opacity=".75"/><line x1="611.5" y1="121.0" x2="628.5" y2="121.0" class="grid" opacity=".75"/></g><text x="620.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="601.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="530.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><foreignObject x="580.0" y="168.0" width="80.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 \\ 1 \\ 0 \\ 1\end{bmatrix}"></div></foreignObject></g><g data-key="m" data-only="1"><text x="480.0" y="300.0" font-size="13" fill="#3576C0" text-anchor="middle">доля сдавших 0.75 — ориентир «модели без признаков»</text></g>
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
      <p></p>
    </div>
    <div class="step-panel" data-on="x y" data-focus="y">
      <div class="step-kicker">Шаг 2 · ответы</div>
      <h4>Y = (1, 1, 0, 1)</h4>
      <p>Не сдал только третий: мало часов и два пропуска.</p>
    </div>
    <div class="step-panel" data-on="y m" data-focus="m">
      <div class="step-kicker">Шаг 3 · ориентир</div>
      <h4>0.75</h4>
      <p>Модель, которая всем отвечает 0.75, получает log loss 0.5623.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> формы данных те же, что в регрессии; меняется только смысл Y — метка класса вместо числа.
</div>

---


## Часть 3. Один объект: логит и вероятность

<div class="math-display" data-tex="z = x\,w + b, \qquad p = \sigma(z) = \frac{1}{1+e^{-z}}"></div>
<div class="stage" id="stage-ne" tabindex="0">
  <div class="stage-figure">
<svg id="ne" viewBox="0 0 960 600" role="img" aria-label="Один объект: логит и вероятность">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ne-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 230 L 214 230" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ne-arw)"/><text x="232.0" y="222.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#C30B0A" text-anchor="middle">Сигмоида σ</text><rect x="34" y="284" width="182" height="132" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="dot"><g><rect x="300.0" y="200.0" width="60.0" height="30.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="330.0" y1="200.0" x2="330.0" y2="230.0" class="grid" opacity=".75"/></g><foreignObject x="275.0" y="234.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="x"></div></foreignObject><text x="378.0" y="222.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="394.0" y="185.0" width="30.0" height="60.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="394.0" y1="215.0" x2="424.0" y2="215.0" class="grid" opacity=".75"/></g><foreignObject x="354.0" y="249.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="w"></div></foreignObject><text x="444.0" y="222.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="460.0" y="200.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="420.0" y="234.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b"></div></foreignObject></g><g data-key="z"><text x="510.0" y="222.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="526.0" y="200.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="486.0" y="234.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z"></div></foreignObject></g><g data-key="s"><path d="M 560.0 215.0 L 610.0 215.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#ne-arw)"/><text x="585.0" y="205.0" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">σ</text><g><rect x="616.0" y="200.0" width="30.0" height="30.0" rx="2" fill="#E88919" opacity="0.62" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="576.0" y="234.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="p"></div></foreignObject></g><g data-key="mean"><text x="680.0" y="210.0" font-size="14" fill="#C06F0E" text-anchor="start" font-weight="700">p = P(y = 1 | x)</text><text x="680.0" y="230.0" font-size="13" fill="#5E5850" text-anchor="start">1 − p = P(y = 0 | x)</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="340.0" width="650.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z = x\,w + b, \qquad p = \sigma(z) = \dfrac{1}{1 + e^{-z}}"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — посчитанное · оранжевое — вероятности</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl dot" data-focus="hl dot">
      <div class="step-kicker">Шаг 1 · линейная часть</div>
      <h4>x · w + b</h4>
      <p>Как в регрессии.</p>
    </div>
    <div class="step-panel" data-on="hl dot z" data-focus="z">
      <div class="step-kicker">Шаг 2 · логит</div>
      <h4>z — любое число</h4>
      <p>Положительный — «скорее сдал», отрицательный — «скорее нет».</p>
    </div>
    <div class="step-panel" data-on="hl z s f" data-focus="s f">
      <div class="step-kicker">Шаг 3 · сигмоида</div>
      <h4>p = σ(z)</h4>
      <p>Число из (0, 1).</p>
    </div>
    <div class="step-panel" data-on="hl s mean" data-focus="mean">
      <div class="step-kicker">Шаг 4 · смысл</div>
      <h4>Вероятность класса 1</h4>
      <p>Модель выдаёт не ответ, а уверенность в нём.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Первый студент.</p>
<div class="stage" id="stage-nen" tabindex="0">
  <div class="stage-figure">
<svg id="nen" viewBox="0 0 960 330" role="img" aria-label="Числовой расчёт для первого студента">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: первый студент</text><g data-key="z"><foreignObject x="20.0" y="80.0" width="920.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z_1 = 2\cdot 1 + 2\cdot(-1) + (-1) = -1"></div></foreignObject></g><g data-key="p"><foreignObject x="20.0" y="140.0" width="920.0" height="50.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="p_1 = \sigma(-1) = \dfrac{1}{1 + e} = 0.2689"></div></foreignObject></g><g data-key="w" data-only="1"><text x="480.0" y="240.0" font-size="14" fill="#C30B0A" text-anchor="middle" font-weight="700">студент сдал, а модель даёт ему 27 % — ошибка</text></g>
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
      <div class="step-kicker">Шаг 1 · логит</div>
      <h4>z = −1</h4>
      <p>Часы и пропуски погасили друг друга, смещение −1 увело логит в минус.</p>
    </div>
    <div class="step-panel" data-on="z p" data-focus="p">
      <div class="step-kicker">Шаг 2 · вероятность</div>
      <h4>0.2689</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="p w" data-focus="w">
      <div class="step-kicker">Шаг 3 · ошибка</div>
      <h4>Неверный ответ</h4>
      <p>p &lt; 0.5 — модель предсказывает «не сдал».</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> модель выдаёт вероятность класса 1: логит z — линейная часть, сигмоида переводит его в (0, 1).
</div>

---


## Часть 4. Весь батч

<div class="math-display" data-tex="\hat Y = \sigma(XW + b)"></div>
<div class="stage" id="stage-li" tabindex="0">
  <div class="stage-figure">
<svg id="li" viewBox="0 0 960 600" role="img" aria-label="Весь батч: Z = XW + b, P = σ(Z)">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#li-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 230 L 214 230" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#li-arw)"/><text x="232.0" y="222.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#C30B0A" text-anchor="middle">Сигмоида σ</text><rect x="34" y="284" width="182" height="132" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="x"><g><rect x="330.0" y="180.0" width="60.0" height="120.0" rx="2" fill="#73B222" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="360.0" y1="180.0" x2="360.0" y2="300.0" class="grid" opacity=".75"/><line x1="330.0" y1="210.0" x2="390.0" y2="210.0" class="grid" opacity=".75"/><line x1="330.0" y1="240.0" x2="390.0" y2="240.0" class="grid" opacity=".75"/><line x1="330.0" y1="270.0" x2="390.0" y2="270.0" class="grid" opacity=".75"/></g><text x="360.0" y="172.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="322.0" y="244.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="305.0" y="302.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject></g><g data-key="w"><text x="414.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="430.0" y="210.0" width="30.0" height="60.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="430.0" y1="240.0" x2="460.0" y2="240.0" class="grid" opacity=".75"/></g><foreignObject x="390.0" y="272.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W"></div></foreignObject></g><g data-key="b"><text x="484.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="500.0" y="210.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.16" stroke="#C29E08" stroke-width="1" stroke-dasharray="4 3"/><rect x="500.0" y="240.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.16" stroke="#C29E08" stroke-width="1" stroke-dasharray="4 3"/><rect x="500.0" y="270.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.16" stroke="#C29E08" stroke-width="1" stroke-dasharray="4 3"/></g><g><rect x="500.0" y="180.0" width="30.0" height="30.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/></g><foreignObject x="460.0" y="302.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b"></div></foreignObject></g><g data-key="z"><text x="550.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="566.0" y="180.0" width="30.0" height="120.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="566.0" y1="210.0" x2="596.0" y2="210.0" class="grid" opacity=".75"/><line x1="566.0" y1="240.0" x2="596.0" y2="240.0" class="grid" opacity=".75"/><line x1="566.0" y1="270.0" x2="596.0" y2="270.0" class="grid" opacity=".75"/></g><foreignObject x="526.0" y="302.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z"></div></foreignObject></g><g data-key="p"><path d="M 600.0 240.0 L 650.0 240.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#li-arw)"/><text x="625.0" y="230.0" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">σ</text><g><rect x="656.0" y="180.0" width="30.0" height="120.0" rx="2" fill="#E88919" opacity="0.62" stroke="#ffffff" stroke-width="1"/><line x1="656.0" y1="210.0" x2="686.0" y2="210.0" class="grid" opacity=".75"/><line x1="656.0" y1="240.0" x2="686.0" y2="240.0" class="grid" opacity=".75"/><line x1="656.0" y1="270.0" x2="686.0" y2="270.0" class="grid" opacity=".75"/></g><foreignObject x="616.0" y="302.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject></g><g data-key="shapes" data-only="1"><foreignObject x="290.0" y="400.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y = \sigma(XW + b), \qquad [4\times2]\cdot[2\times1] + [1] \to [4\times1]"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — посчитанное · оранжевое — вероятности</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl x w" data-focus="hl w">
      <div class="step-kicker">Шаг 1 · умножение</div>
      <h4>X · W</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="hl x w b z" data-focus="z">
      <div class="step-kicker">Шаг 2 · логиты</div>
      <h4>Z [4 × 1]</h4>
      <p>Смещение растянуто на все строки.</p>
    </div>
    <div class="step-panel" data-on="hl z p" data-focus="p">
      <div class="step-kicker">Шаг 3 · вероятности</div>
      <h4>σ поэлементно</h4>
      <p>Ŷ той же формы.</p>
    </div>
    <div class="step-panel" data-on="hl x w b z p shapes" data-focus="shapes">
      <div class="step-kicker">Шаг 4 · формы</div>
      <h4>Одна формула</h4>
      <p>Отличие от регрессии — одна поэлементная функция в конце.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Логиты и вероятности четырёх студентов.</p>
<div class="stage" id="stage-lin" tabindex="0">
  <div class="stage-figure">
<svg id="lin" viewBox="0 0 960 360" role="img" aria-label="Числовые логиты и вероятности">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: Z и Ŷ</text><g data-key="z"><g><rect x="153.0" y="70.0" width="34.0" height="68.0" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="170.0" y1="70.0" x2="170.0" y2="138.0" class="grid" opacity=".75"/><line x1="153.0" y1="87.0" x2="187.0" y2="87.0" class="grid" opacity=".75"/><line x1="153.0" y1="104.0" x2="187.0" y2="104.0" class="grid" opacity=".75"/><line x1="153.0" y1="121.0" x2="187.0" y2="121.0" class="grid" opacity=".75"/></g><text x="170.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">2</text><text x="143.0" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="80.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="X"></div></foreignObject><foreignObject x="115.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}2 &amp; 2 \\ 3 &amp; 1 \\ 1 &amp; 2 \\ 4 &amp; 1\end{bmatrix}"></div></foreignObject><text x="260.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">·</text><g><rect x="321.5" y="86.0" width="17.0" height="34.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/><line x1="321.5" y1="103.0" x2="338.5" y2="103.0" class="grid" opacity=".75"/></g><text x="330.0" y="78.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="311.5" y="107.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="240.0" y="123.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="W"></div></foreignObject><foreignObject x="290.0" y="150.0" width="80.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 \\ -1\end{bmatrix}"></div></foreignObject><text x="400.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">+</text><g><rect x="451.5" y="95.0" width="17.0" height="17.0" rx="2" fill="#C29E08" opacity="0.9" stroke="#ffffff" stroke-width="1"/></g><text x="460.0" y="87.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="441.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="370.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="b"></div></foreignObject><foreignObject x="430.0" y="142.0" width="60.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-1\end{bmatrix}"></div></foreignObject><text x="530.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="591.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="591.5" y1="87.0" x2="608.5" y2="87.0" class="grid" opacity=".75"/><line x1="591.5" y1="104.0" x2="608.5" y2="104.0" class="grid" opacity=".75"/><line x1="591.5" y1="121.0" x2="608.5" y2="121.0" class="grid" opacity=".75"/></g><text x="600.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="581.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="510.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z"></div></foreignObject><foreignObject x="560.0" y="168.0" width="80.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-1 \\ 1 \\ -2 \\ 2\end{bmatrix}"></div></foreignObject></g><g data-key="p"><path d="M 640.0 104.0 L 680.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#lin-arw)"/><g><rect x="751.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="751.5" y1="87.0" x2="768.5" y2="87.0" class="grid" opacity=".75"/><line x1="751.5" y1="104.0" x2="768.5" y2="104.0" class="grid" opacity=".75"/><line x1="751.5" y1="121.0" x2="768.5" y2="121.0" class="grid" opacity=".75"/></g><text x="760.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="741.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="670.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject><foreignObject x="705.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2689 \\ 0.7311 \\ 0.1192 \\ 0.8808\end{bmatrix}"></div></foreignObject></g><g data-key="sym" data-only="1"><text x="480.0" y="330.0" font-size="13" fill="#3576C0" text-anchor="middle">σ(1) + σ(−1) = 0.7311 + 0.2689 = 1: сигмоида симметрична</text></g>
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
      <div class="step-kicker">Шаг 1 · логиты</div>
      <h4>Z = (−1, 1, −2, 2)</h4>
      <p>Круглые числа — случайность подбора данных.</p>
    </div>
    <div class="step-panel" data-on="z p" data-focus="p">
      <div class="step-kicker">Шаг 2 · вероятности</div>
      <h4>Ŷ = (0.27, 0.73, 0.12, 0.88)</h4>
      <p>Верно классифицированы 3 из 4: ошибается только первый.</p>
    </div>
    <div class="step-panel" data-on="p sym" data-focus="sym">
      <div class="step-kicker">Шаг 3 · симметрия</div>
      <h4>σ(−z) = 1 − σ(z)</h4>
      <p>Отсюда пары чисел в столбце.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> весь батч — одно умножение и поэлементная сигмоида: <code>[4 × 2] · [2 × 1] → [4 × 1]</code>.
</div>

---


## Часть 5. Сигмоида и её производная

<div class="math-display" data-tex="\sigma(-z) = 1-\sigma(z), \qquad \sigma'(z) = \sigma(z)(1-\sigma(z)) \le 0.25"></div>
<div class="stage" id="stage-sg" tabindex="0">
  <div class="stage-figure">
<svg id="sg" viewBox="0 0 960 600" role="img" aria-label="Сигмоида и её производная">
<style>
  #sg { font-family: Helvetica, Arial, sans-serif; }
  #sg .cap { font-size: 13px; fill: #5E5850; }
  #sg .lbl { font-size: 16px; fill: #111111; }
  #sg .legend { font-size: 13px; fill: #5E5850; }
  #sg .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #sg .grid { stroke: #ffffff; stroke-width: 1.35; }
  #sg .dim { font-size: 13px; fill: #5E5850; }
  #sg .nm { font-size: 16px; font-weight: 800; }
  #sg .op { font-size: 23px; fill: #5E5850; }
  #sg .arw { font-size: 12px; fill: #5E5850; }
  #sg .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="sg-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="sg-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="sg-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="sg-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sg-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sg-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sg-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sg-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#sg-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 230 L 214 230" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#sg-arw)"/><text x="232.0" y="222.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#C30B0A" text-anchor="middle">Сигмоида σ</text><rect x="34" y="284" width="182" height="52" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="g"><line x1="330" y1="340" x2="910" y2="340" stroke="#8A857C"/><line x1="620" y1="90" x2="620" y2="350" stroke="#8A857C"/><line x1="330" y1="120" x2="910" y2="120" stroke="#C9C2B8" stroke-dasharray="4 4"/><text x="630.0" y="114.0" font-size="12" fill="#5E5850" text-anchor="start">1</text><text x="906.0" y="356.0" font-size="13" fill="#5E5850" text-anchor="end" font-style="italic">z</text><polyline points="350.0,339.5 354.5,339.4 359.1,339.3 363.6,339.3 368.2,339.2 372.7,339.1 377.2,339.0 381.8,338.9 386.3,338.8 390.8,338.7 395.4,338.5 399.9,338.4 404.5,338.2 409.0,338.0 413.5,337.8 418.1,337.6 422.6,337.3 427.1,337.0 431.7,336.7 436.2,336.4 440.8,336.0 445.3,335.6 449.8,335.1 454.4,334.6 458.9,334.0 463.4,333.4 468.0,332.7 472.5,332.0 477.1,331.2 481.6,330.3 486.1,329.3 490.7,328.2 495.2,327.1 499.7,325.8 504.3,324.4 508.8,322.9 513.4,321.2 517.9,319.4 522.4,317.4 527.0,315.3 531.5,313.0 536.1,310.5 540.6,307.8 545.1,305.0 549.7,301.9 554.2,298.6 558.7,295.1 563.3,291.4 567.8,287.5 572.4,283.3 576.9,279.0 581.4,274.5 586.0,269.7 590.5,264.8 595.0,259.7 599.6,254.5 604.1,249.2 608.7,243.8 613.2,238.3 617.7,232.8 622.3,227.2 626.8,221.7 631.3,216.2 635.9,210.8 640.4,205.5 645.0,200.3 649.5,195.2 654.0,190.3 658.6,185.5 663.1,181.0 667.6,176.7 672.2,172.5 676.7,168.6 681.3,164.9 685.8,161.4 690.3,158.1 694.9,155.0 699.4,152.2 703.9,149.5 708.5,147.0 713.0,144.7 717.6,142.6 722.1,140.6 726.6,138.8 731.2,137.1 735.7,135.6 740.3,134.2 744.8,132.9 749.3,131.8 753.9,130.7 758.4,129.7 762.9,128.8 767.5,128.0 772.0,127.3 776.6,126.6 781.1,126.0 785.6,125.4 790.2,124.9 794.7,124.4 799.2,124.0 803.8,123.6 808.3,123.3 812.9,123.0 817.4,122.7 821.9,122.4 826.5,122.2 831.0,122.0 835.5,121.8 840.1,121.6 844.6,121.5 849.2,121.3 853.7,121.2 858.2,121.1 862.8,121.0 867.3,120.9 871.8,120.8 876.4,120.7 880.9,120.7 885.5,120.6 890.0,120.5" fill="none" stroke="#E88919" stroke-width="3"/><text x="760.0" y="150.0" font-size="14" fill="#C06F0E" text-anchor="start" font-weight="700">σ(z)</text></g><g data-key="half" data-only="1"><line x1="330" y1="230.0" x2="910" y2="230.0" stroke="#3576C0" stroke-dasharray="5 4"/><text x="340.0" y="224.0" font-size="12" fill="#3576C0" text-anchor="start">0.5 при z = 0 — порог решения</text></g><g data-key="der"><polyline stroke-dasharray="6 4" points="350.0,339.5 354.5,339.4 359.1,339.3 363.6,339.3 368.2,339.2 372.7,339.1 377.2,339.0 381.8,338.9 386.3,338.8 390.8,338.7 395.4,338.5 399.9,338.4 404.5,338.2 409.0,338.0 413.5,337.8 418.1,337.6 422.6,337.3 427.1,337.1 431.7,336.8 436.2,336.4 440.8,336.1 445.3,335.6 449.8,335.2 454.4,334.7 458.9,334.2 463.4,333.6 468.0,333.0 472.5,332.3 477.1,331.5 481.6,330.7 486.1,329.8 490.7,328.9 495.2,327.8 499.7,326.7 504.3,325.5 508.8,324.2 513.4,322.8 517.9,321.3 522.4,319.7 527.0,318.1 531.5,316.3 536.1,314.5 540.6,312.5 545.1,310.5 549.7,308.5 554.2,306.4 558.7,304.3 563.3,302.1 567.8,300.0 572.4,297.9 576.9,295.9 581.4,294.0 586.0,292.2 590.5,290.5 595.0,289.0 599.6,287.7 604.1,286.7 608.7,285.9 613.2,285.3 617.7,285.0 622.3,285.0 626.8,285.3 631.3,285.9 635.9,286.7 640.4,287.7 645.0,289.0 649.5,290.5 654.0,292.2 658.6,294.0 663.1,295.9 667.6,297.9 672.2,300.0 676.7,302.1 681.3,304.3 685.8,306.4 690.3,308.5 694.9,310.5 699.4,312.5 703.9,314.5 708.5,316.3 713.0,318.1 717.6,319.7 722.1,321.3 726.6,322.8 731.2,324.2 735.7,325.5 740.3,326.7 744.8,327.8 749.3,328.9 753.9,329.8 758.4,330.7 762.9,331.5 767.5,332.3 772.0,333.0 776.6,333.6 781.1,334.2 785.6,334.7 790.2,335.2 794.7,335.6 799.2,336.1 803.8,336.4 808.3,336.8 812.9,337.1 817.4,337.3 821.9,337.6 826.5,337.8 831.0,338.0 835.5,338.2 840.1,338.4 844.6,338.5 849.2,338.7 853.7,338.8 858.2,338.9 862.8,339.0 867.3,339.1 871.8,339.2 876.4,339.3 880.9,339.3 885.5,339.4 890.0,339.5" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="655.0" y="277.0" font-size="12" fill="#C30B0A" text-anchor="start" font-weight="700">σ′ = σ(1 − σ), максимум 0.25</text></g><g data-key="sym" data-only="1"><foreignObject x="290.0" y="400.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\sigma(-z) = 1 - \sigma(z), \qquad \sigma'(z) = \sigma(z)\,(1 - \sigma(z))"></div></foreignObject></g><g data-key="sat" data-only="1"><text x="615.0" y="470.0" font-size="13" fill="#C30B0A" text-anchor="middle">при |z| &gt; 5 производная меньше 0.007: насыщение</text></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — посчитанное · оранжевое — вероятности</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl g" data-focus="hl g">
      <div class="step-kicker">Шаг 1 · форма</div>
      <h4>S-образная кривая</h4>
      <p>От 0 до 1, монотонно растёт.</p>
    </div>
    <div class="step-panel" data-on="hl g half" data-focus="half">
      <div class="step-kicker">Шаг 2 · середина</div>
      <h4>σ(0) = 0.5</h4>
      <p>Порог 0.5 по вероятности = порог 0 по логиту.</p>
    </div>
    <div class="step-panel" data-on="hl g der" data-focus="der">
      <div class="step-kicker">Шаг 3 · производная</div>
      <h4>σ′ = σ(1 − σ)</h4>
      <p>Выражается через сам выход — не нужно помнить z.</p>
    </div>
    <div class="step-panel" data-on="hl g der sym" data-focus="sym">
      <div class="step-kicker">Шаг 4 · свойства</div>
      <h4>Симметрия и производная</h4>
      <p>Обе формулы понадобятся в обратном проходе.</p>
    </div>
    <div class="step-panel" data-on="hl der sat" data-focus="sat">
      <div class="step-kicker">Шаг 5 · насыщение</div>
      <h4>Плоские хвосты</h4>
      <p>При уверенном ответе сигмоида почти не пропускает градиент — важно для выбора потери.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>σ и σ′ на батче.</p>
<div class="stage" id="stage-sgn" tabindex="0">
  <div class="stage-figure">
<svg id="sgn" viewBox="0 0 960 330" role="img" aria-label="Числовые сигмоида и производная">
<style>
  #sgn { font-family: Helvetica, Arial, sans-serif; }
  #sgn .cap { font-size: 13px; fill: #5E5850; }
  #sgn .lbl { font-size: 16px; fill: #111111; }
  #sgn .legend { font-size: 13px; fill: #5E5850; }
  #sgn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #sgn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #sgn .dim { font-size: 13px; fill: #5E5850; }
  #sgn .nm { font-size: 16px; font-weight: 800; }
  #sgn .op { font-size: 23px; fill: #5E5850; }
  #sgn .arw { font-size: 12px; fill: #5E5850; }
  #sgn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="sgn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="sgn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="sgn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="sgn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: σ и σ′ на батче</text><g data-key="z"><g><rect x="151.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="151.5" y1="87.0" x2="168.5" y2="87.0" class="grid" opacity=".75"/><line x1="151.5" y1="104.0" x2="168.5" y2="104.0" class="grid" opacity=".75"/><line x1="151.5" y1="121.0" x2="168.5" y2="121.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="141.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="70.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Z"></div></foreignObject><foreignObject x="120.0" y="168.0" width="80.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-1 \\ 1 \\ -2 \\ 2\end{bmatrix}"></div></foreignObject></g><g data-key="p"><path d="M 210.0 104.0 L 250.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#sgn-arw)"/><g><rect x="331.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="331.5" y1="87.0" x2="348.5" y2="87.0" class="grid" opacity=".75"/><line x1="331.5" y1="104.0" x2="348.5" y2="104.0" class="grid" opacity=".75"/><line x1="331.5" y1="121.0" x2="348.5" y2="121.0" class="grid" opacity=".75"/></g><text x="340.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="321.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="250.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject><foreignObject x="285.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2689 \\ 0.7311 \\ 0.1192 \\ 0.8808\end{bmatrix}"></div></foreignObject></g><g data-key="d"><path d="M 410.0 104.0 L 450.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#sgn-arw)"/><g><rect x="551.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="551.5" y1="87.0" x2="568.5" y2="87.0" class="grid" opacity=".75"/><line x1="551.5" y1="104.0" x2="568.5" y2="104.0" class="grid" opacity=".75"/><line x1="551.5" y1="121.0" x2="568.5" y2="121.0" class="grid" opacity=".75"/></g><text x="560.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="541.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="470.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y(1-\hat Y)"></div></foreignObject><foreignObject x="505.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.1966 \\ 0.1966 \\ 0.1050 \\ 0.1050\end{bmatrix}"></div></foreignObject></g><g data-key="n" data-only="1"><text x="480.0" y="300.0" font-size="13" fill="#C30B0A" text-anchor="middle">у объектов с |z| = 2 производная вдвое меньше, чем с |z| = 1</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="z p" data-focus="p">
      <div class="step-kicker">Шаг 1 · σ</div>
      <h4>Четыре вероятности</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="p d" data-focus="d">
      <div class="step-kicker">Шаг 2 · σ′</div>
      <h4>0.1966 и 0.1050</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="d n" data-focus="n">
      <div class="step-kicker">Шаг 3 · вывод</div>
      <h4>Уверенность гасит градиент</h4>
      <p>Если бы потеря умножалась на σ′, уверенные ошибки учились бы медленно. Log loss этого множителя не допускает — см. часть 7.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> сигмоида симметрична, а её производная выражается через выход и гаснет на хвостах — это ключ к выбору потери.
</div>

---


## Часть 6. Log loss

<div class="math-display" data-tex="L = -\frac{1}{B}\sum_i \big[y_i\log \hat y_i + (1-y_i)\log(1-\hat y_i)\big]"></div>
<div class="stage" id="stage-ls" tabindex="0">
  <div class="stage-figure">
<svg id="ls" viewBox="0 0 960 600" role="img" aria-label="Log loss: штраф за вероятность правильного класса">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ls-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 230 L 214 230" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ls-arw)"/><text x="232.0" y="222.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#C30B0A" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#C30B0A" text-anchor="middle">Среднее → L</text><rect x="34" y="124" width="182" height="132" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="g1"><line x1="330" y1="470" x2="630" y2="470" stroke="#8A857C"/><line x1="330" y1="470" x2="330" y2="120" stroke="#8A857C"/><text x="630.0" y="488.0" font-size="12" fill="#5E5850" text-anchor="middle">p = 1</text><text x="330.0" y="488.0" font-size="12" fill="#5E5850" text-anchor="middle">0</text><polyline points="333.9,122.6 337.6,176.5 341.4,208.4 345.1,231.1 348.9,248.8 352.6,263.3 356.4,275.5 360.1,286.2 363.9,295.5 367.6,303.9 371.4,311.5 375.1,318.5 378.9,324.8 382.6,330.8 386.4,336.3 390.1,341.4 393.9,346.2 397.6,350.8 401.4,355.1 405.1,359.2 408.9,363.1 412.6,366.8 416.4,370.4 420.1,373.8 423.9,377.0 427.6,380.2 431.4,383.2 435.1,386.1 438.8,388.9 442.6,391.6 446.3,394.2 450.1,396.8 453.8,399.2 457.6,401.6 461.3,403.9 465.1,406.2 468.8,408.4 472.6,410.5 476.3,412.6 480.1,414.6 483.8,416.6 487.6,418.5 491.3,420.4 495.1,422.2 498.8,424.0 502.6,425.8 506.3,427.5 510.1,429.2 513.8,430.8 517.6,432.4 521.3,434.0 525.1,435.6 528.8,437.1 532.5,438.6 536.3,440.0 540.0,441.5 543.8,442.9 547.5,444.3 551.3,445.7 555.0,447.0 558.8,448.3 562.5,449.6 566.3,450.9 570.0,452.2 573.8,453.4 577.5,454.6 581.3,455.8 585.0,457.0 588.8,458.2 592.5,459.3 596.3,460.5 600.0,461.6 603.8,462.7 607.5,463.8 611.3,464.8 615.0,465.9 618.8,466.9 622.5,468.0 626.3,469.0 630.0,470.0" fill="none" stroke="#C30B0A" stroke-width="2.6"/><text x="370.0" y="150.0" font-size="13" fill="#C30B0A" text-anchor="start" font-weight="700">y = 1: −log p</text></g><g data-key="g0" data-only="1"><polyline points="330.0,470.0 333.7,469.0 337.5,468.0 341.2,466.9 345.0,465.9 348.7,464.8 352.5,463.8 356.2,462.7 360.0,461.6 363.7,460.5 367.5,459.3 371.2,458.2 375.0,457.0 378.7,455.8 382.5,454.6 386.2,453.4 390.0,452.2 393.7,450.9 397.5,449.6 401.2,448.3 405.0,447.0 408.7,445.7 412.5,444.3 416.2,442.9 420.0,441.5 423.7,440.0 427.5,438.6 431.2,437.1 434.9,435.6 438.7,434.0 442.4,432.4 446.2,430.8 449.9,429.2 453.7,427.5 457.4,425.8 461.2,424.0 464.9,422.2 468.7,420.4 472.4,418.5 476.2,416.6 479.9,414.6 483.7,412.6 487.4,410.5 491.2,408.4 494.9,406.2 498.7,403.9 502.4,401.6 506.2,399.2 509.9,396.8 513.7,394.2 517.4,391.6 521.2,388.9 524.9,386.1 528.6,383.2 532.4,380.2 536.1,377.0 539.9,373.8 543.6,370.4 547.4,366.8 551.1,363.1 554.9,359.2 558.6,355.1 562.4,350.8 566.1,346.2 569.9,341.4 573.6,336.3 577.4,330.8 581.1,324.8 584.9,318.5 588.6,311.5 592.4,303.9 596.1,295.5 599.9,286.2 603.6,275.5 607.4,263.3 611.1,248.8 614.9,231.1 618.6,208.4 622.4,176.5 626.1,122.6" fill="none" stroke="#3576C0" stroke-width="2.6"/><text x="520.0" y="150.0" font-size="13" fill="#3576C0" text-anchor="start" font-weight="700">y = 0: −log(1 − p)</text></g><g data-key="f"><foreignObject x="660.0" y="200.0" width="290.0" height="70.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\ell = -\big[y\log p + (1-y)\log(1-p)\big]"></div></foreignObject></g><g data-key="mean"><foreignObject x="660.0" y="300.0" width="290.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L = \dfrac{1}{B}\sum_i \ell_i"></div></foreignObject></g><g data-key="ref" data-only="1"><text x="800.0" y="400.0" font-size="13" fill="#3576C0" text-anchor="middle">все p = 0.5: L = ln 2 = 0.693</text><text x="800.0" y="420.0" font-size="13" fill="#3576C0" text-anchor="middle">все p = 0.75: L = 0.562</text></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — посчитанное · оранжевое — вероятности</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl g1" data-focus="hl g1">
      <div class="step-kicker">Шаг 1 · класс 1</div>
      <h4>−log p</h4>
      <p>Штраф стремится к бесконечности, когда модель уверенно отрицает правильный ответ.</p>
    </div>
    <div class="step-panel" data-on="hl g1 g0" data-focus="g0">
      <div class="step-kicker">Шаг 2 · класс 0</div>
      <h4>−log(1 − p)</h4>
      <p>Зеркальная кривая.</p>
    </div>
    <div class="step-panel" data-on="hl g1 g0 f" data-focus="f">
      <div class="step-kicker">Шаг 3 · одна формула</div>
      <h4>y выбирает слагаемое</h4>
      <p>При y = 1 остаётся первое, при y = 0 — второе. Это кросс-энтропия для двух классов.</p>
    </div>
    <div class="step-panel" data-on="hl f mean" data-focus="mean">
      <div class="step-kicker">Шаг 4 · среднее</div>
      <h4>По батчу</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="hl mean ref" data-focus="ref">
      <div class="step-kicker">Шаг 5 · ориентиры</div>
      <h4>ln 2 и константа</h4>
      <p>Модель лучше константы, если её L меньше 0.5623.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Штрафы четырёх студентов.</p>
<div class="stage" id="stage-lsn" tabindex="0">
  <div class="stage-figure">
<svg id="lsn" viewBox="0 0 960 330" role="img" aria-label="Числовой log loss">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: штрафы и потеря</text><g data-key="p"><g><rect x="161.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="161.5" y1="87.0" x2="178.5" y2="87.0" class="grid" opacity=".75"/><line x1="161.5" y1="104.0" x2="178.5" y2="104.0" class="grid" opacity=".75"/><line x1="161.5" y1="121.0" x2="178.5" y2="121.0" class="grid" opacity=".75"/></g><text x="170.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="151.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="80.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject><foreignObject x="115.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2689 \\ 0.7311 \\ 0.1192 \\ 0.8808\end{bmatrix}"></div></foreignObject><g><rect x="291.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#9A9489" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="291.5" y1="87.0" x2="308.5" y2="87.0" class="grid" opacity=".75"/><line x1="291.5" y1="104.0" x2="308.5" y2="104.0" class="grid" opacity=".75"/><line x1="291.5" y1="121.0" x2="308.5" y2="121.0" class="grid" opacity=".75"/></g><text x="300.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="281.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="210.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><foreignObject x="265.0" y="168.0" width="70.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 \\ 1 \\ 0 \\ 1\end{bmatrix}"></div></foreignObject></g><g data-key="l"><path d="M 350.0 104.0 L 390.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#lsn-arw)"/><g><rect x="451.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="451.5" y1="87.0" x2="468.5" y2="87.0" class="grid" opacity=".75"/><line x1="451.5" y1="104.0" x2="468.5" y2="104.0" class="grid" opacity=".75"/><line x1="451.5" y1="121.0" x2="468.5" y2="121.0" class="grid" opacity=".75"/></g><text x="460.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="441.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="370.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\ell"></div></foreignObject><foreignObject x="405.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1.3133 \\ 0.3133 \\ 0.1269 \\ 0.1269\end{bmatrix}"></div></foreignObject></g><g data-key="L"><path d="M 530.0 104.0 L 570.0 104.0" fill="none" stroke="#5E5850" stroke-width="1.4" marker-end="url(#lsn-arw)"/><g><rect x="631.5" y="95.0" width="17.0" height="17.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/></g><text x="640.0" y="87.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="621.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="550.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L"></div></foreignObject><foreignObject x="590.0" y="142.0" width="100.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.4701\end{bmatrix}"></div></foreignObject></g><g data-key="w" data-only="1"><text x="480.0" y="300.0" font-size="13" fill="#C30B0A" text-anchor="middle">первый студент стоит 1.3133 из 1.8804 — 70 % всей потери</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="p l" data-focus="l">
      <div class="step-kicker">Шаг 1 · штрафы</div>
      <h4>−ln 0.2689 = 1.3133</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="l L" data-focus="L">
      <div class="step-kicker">Шаг 2 · среднее</div>
      <h4>L = 0.4701</h4>
      <p>Лучше константы (0.5623) и тем более ln 2.</p>
    </div>
    <div class="step-panel" data-on="l w" data-focus="w">
      <div class="step-kicker">Шаг 3 · главный вклад</div>
      <h4>Одна ошибка</h4>
      <p>Он и получит самый большой градиент.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> log loss — кросс-энтропия для двух классов: минус логарифм вероятности правильного класса, усреднённый по батчу.
</div>

---


## Часть 7. Почему не MSE

<p>Можно ли учить классификатор средним квадратом ошибки между вероятностью и меткой? Можно, но плохо:</p>
<div class="math-display" data-tex="\frac{\partial \ell_{log}}{\partial z} = \hat y - y, \qquad \frac{\partial \ell_{mse}}{\partial z} = 2(\hat y - y)\,\hat y(1-\hat y)"></div>
<div class="stage" id="stage-ms" tabindex="0">
  <div class="stage-figure">
<svg id="ms" viewBox="0 0 960 600" role="img" aria-label="Почему не MSE: градиент по логиту у log loss и у MSE поверх сигмоиды">
<style>
  #ms { font-family: Helvetica, Arial, sans-serif; }
  #ms .cap { font-size: 13px; fill: #5E5850; }
  #ms .lbl { font-size: 16px; fill: #111111; }
  #ms .legend { font-size: 13px; fill: #5E5850; }
  #ms .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #ms .grid { stroke: #ffffff; stroke-width: 1.35; }
  #ms .dim { font-size: 13px; fill: #5E5850; }
  #ms .nm { font-size: 16px; font-weight: 800; }
  #ms .op { font-size: 23px; fill: #5E5850; }
  #ms .arw { font-size: 12px; fill: #5E5850; }
  #ms .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="ms-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="ms-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="ms-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="ms-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ms-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ms-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ms-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ms-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#ms-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 230 L 214 230" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#ms-arw)"/><text x="232.0" y="222.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#C30B0A" text-anchor="middle">Log loss</text><rect x="34" y="204" width="182" height="52" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="ll"><line x1="330" y1="420" x2="910" y2="420" stroke="#8A857C"/><line x1="620" y1="120" x2="620" y2="420" stroke="#8A857C"/><text x="906.0" y="436.0" font-size="12" fill="#5E5850" text-anchor="end">z (при y = 1)</text><polyline points="350.0,160.6 354.5,160.7 359.1,160.8 363.6,160.9 368.2,161.0 372.7,161.1 377.2,161.2 381.8,161.3 386.3,161.4 390.8,161.6 395.4,161.8 399.9,161.9 404.5,162.1 409.0,162.4 413.5,162.6 418.1,162.9 422.6,163.2 427.1,163.5 431.7,163.9 436.2,164.3 440.8,164.8 445.3,165.2 449.8,165.8 454.4,166.4 458.9,167.1 463.4,167.8 468.0,168.6 472.5,169.5 477.1,170.4 481.6,171.5 486.1,172.6 490.7,173.9 495.2,175.3 499.7,176.8 504.3,178.5 508.8,180.3 513.4,182.2 517.9,184.4 522.4,186.7 527.0,189.2 531.5,191.9 536.1,194.9 540.6,198.0 545.1,201.4 549.7,205.0 554.2,208.9 558.7,213.0 563.3,217.4 567.8,222.1 572.4,227.0 576.9,232.1 581.4,237.5 586.0,243.1 590.5,248.9 595.0,254.8 599.6,261.0 604.1,267.3 608.7,273.7 613.2,280.2 617.7,286.7 622.3,293.3 626.8,299.8 631.3,306.3 635.9,312.7 640.4,319.0 645.0,325.2 649.5,331.1 654.0,336.9 658.6,342.5 663.1,347.9 667.6,353.0 672.2,357.9 676.7,362.6 681.3,367.0 685.8,371.1 690.3,375.0 694.9,378.6 699.4,382.0 703.9,385.1 708.5,388.1 713.0,390.8 717.6,393.3 722.1,395.6 726.6,397.8 731.2,399.7 735.7,401.5 740.3,403.2 744.8,404.7 749.3,406.1 753.9,407.4 758.4,408.5 762.9,409.6 767.5,410.5 772.0,411.4 776.6,412.2 781.1,412.9 785.6,413.6 790.2,414.2 794.7,414.8 799.2,415.2 803.8,415.7 808.3,416.1 812.9,416.5 817.4,416.8 821.9,417.1 826.5,417.4 831.0,417.6 835.5,417.9 840.1,418.1 844.6,418.2 849.2,418.4 853.7,418.6 858.2,418.7 862.8,418.8 867.3,418.9 871.8,419.0 876.4,419.1 880.9,419.2 885.5,419.3 890.0,419.4" fill="none" stroke="#4E9A38" stroke-width="3"/><text x="360.0" y="150.0" font-size="13" fill="#4E9A38" text-anchor="start" font-weight="700">log loss: |∂ℓ/∂z| = 1 − p</text></g><g data-key="mse"><polyline points="350.0,418.7 354.5,418.6 359.1,418.4 363.6,418.3 368.2,418.1 372.7,417.9 377.2,417.7 381.8,417.4 386.3,417.2 390.8,416.9 395.4,416.5 399.9,416.2 404.5,415.8 409.0,415.3 413.5,414.9 418.1,414.3 422.6,413.8 427.1,413.1 431.7,412.4 436.2,411.7 440.8,410.8 445.3,409.9 449.8,408.9 454.4,407.8 458.9,406.7 463.4,405.4 468.0,404.0 472.5,402.4 477.1,400.8 481.6,399.0 486.1,397.1 490.7,395.1 495.2,392.9 499.7,390.6 504.3,388.1 508.8,385.5 513.4,382.8 517.9,380.0 522.4,377.0 527.0,374.0 531.5,370.9 536.1,367.7 540.6,364.6 545.1,361.5 549.7,358.4 554.2,355.5 558.7,352.8 563.3,350.3 567.8,348.1 572.4,346.2 576.9,344.7 581.4,343.6 586.0,343.1 590.5,343.0 595.0,343.5 599.6,344.5 604.1,346.0 608.7,348.0 613.2,350.5 617.7,353.4 622.3,356.7 626.8,360.2 631.3,364.0 635.9,368.0 640.4,372.0 645.0,376.0 649.5,380.0 654.0,383.9 658.6,387.6 663.1,391.1 667.6,394.4 672.2,397.4 676.7,400.2 681.3,402.8 685.8,405.1 690.3,407.1 694.9,408.9 699.4,410.5 703.9,411.9 708.5,413.1 713.0,414.2 717.6,415.1 722.1,415.9 726.6,416.5 731.2,417.1 735.7,417.6 740.3,418.0 744.8,418.3 749.3,418.6 753.9,418.8 758.4,419.0 762.9,419.2 767.5,419.3 772.0,419.5 776.6,419.5 781.1,419.6 785.6,419.7 790.2,419.7 794.7,419.8 799.2,419.8 803.8,419.9 808.3,419.9 812.9,419.9 817.4,419.9 821.9,419.9 826.5,419.9 831.0,420.0 835.5,420.0 840.1,420.0 844.6,420.0 849.2,420.0 853.7,420.0 858.2,420.0 862.8,420.0 867.3,420.0 871.8,420.0 876.4,420.0 880.9,420.0 885.5,420.0 890.0,420.0" fill="none" stroke="#C30B0A" stroke-width="3"/><text x="360.0" y="172.0" font-size="13" fill="#C30B0A" text-anchor="start" font-weight="700">MSE: |∂ℓ/∂z| = 2(1 − p)·p(1 − p)</text></g><g data-key="bad" data-only="1"><rect x="330.0" y="120.0" width="110.0" height="300.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="615.0" y="480.0" font-size="13" fill="#C30B0A" text-anchor="middle">уверенная ошибка (z ≪ 0): log loss толкает сильнее всего, MSE — почти никак</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="510.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\frac{\partial \ell_{log}}{\partial z} = p - y, \qquad \frac{\partial \ell_{mse}}{\partial z} = 2(p-y)\,p(1-p)"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — посчитанное · оранжевое — вероятности</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl ll" data-focus="hl ll">
      <div class="step-kicker">Шаг 1 · log loss</div>
      <h4>Градиент линейно растёт с ошибкой</h4>
      <p>Для y = 1 это 1 − p: чем меньше вероятность правильного класса, тем сильнее толчок.</p>
    </div>
    <div class="step-panel" data-on="hl ll mse" data-focus="mse">
      <div class="step-kicker">Шаг 2 · MSE</div>
      <h4>Лишний множитель σ′</h4>
      <p>Квадрат ошибки поверх сигмоиды умножает градиент на p(1 − p), а он исчезает на хвостах.</p>
    </div>
    <div class="step-panel" data-on="hl ll mse bad" data-focus="bad">
      <div class="step-kicker">Шаг 3 · проблема</div>
      <h4>Уверенная ошибка не учится</h4>
      <p>Слева — самые плохие ответы, и именно там у MSE градиент почти ноль.</p>
    </div>
    <div class="step-panel" data-on="hl ll mse f" data-focus="f">
      <div class="step-kicker">Шаг 4 · формулы</div>
      <h4>p − y против 2(p − y)p(1 − p)</h4>
      <p>Log loss сокращает σ′ — это покажет часть 11.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Градиенты по логитам двумя способами.</p>
<div class="stage" id="stage-msn" tabindex="0">
  <div class="stage-figure">
<svg id="msn" viewBox="0 0 960 330" role="img" aria-label="Числовое сравнение градиентов">
<style>
  #msn { font-family: Helvetica, Arial, sans-serif; }
  #msn .cap { font-size: 13px; fill: #5E5850; }
  #msn .lbl { font-size: 16px; fill: #111111; }
  #msn .legend { font-size: 13px; fill: #5E5850; }
  #msn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #msn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #msn .dim { font-size: 13px; fill: #5E5850; }
  #msn .nm { font-size: 16px; font-weight: 800; }
  #msn .op { font-size: 23px; fill: #5E5850; }
  #msn .arw { font-size: 12px; fill: #5E5850; }
  #msn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="msn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="msn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="msn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="msn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: градиент по логитам, log loss и MSE</text><g data-key="a"><g><rect x="191.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="191.5" y1="87.0" x2="208.5" y2="87.0" class="grid" opacity=".75"/><line x1="191.5" y1="104.0" x2="208.5" y2="104.0" class="grid" opacity=".75"/><line x1="191.5" y1="121.0" x2="208.5" y2="121.0" class="grid" opacity=".75"/></g><text x="200.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="181.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="110.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_{log}"></div></foreignObject><foreignObject x="145.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.1828 \\ -0.0672 \\ 0.0298 \\ -0.0298\end{bmatrix}"></div></foreignObject></g><g data-key="b"><g><rect x="411.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="411.5" y1="87.0" x2="428.5" y2="87.0" class="grid" opacity=".75"/><line x1="411.5" y1="104.0" x2="428.5" y2="104.0" class="grid" opacity=".75"/><line x1="411.5" y1="121.0" x2="428.5" y2="121.0" class="grid" opacity=".75"/></g><text x="420.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="401.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="330.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ_{mse}"></div></foreignObject><foreignObject x="365.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.0719 \\ -0.0264 \\ 0.0063 \\ -0.0063\end{bmatrix}"></div></foreignObject></g><g data-key="r"><text x="720.0" y="110.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">во сколько раз слабее:</text><text x="720.0" y="130.0" font-size="13" fill="#C30B0A" text-anchor="middle">2.54, 2.54, 4.76, 4.76</text></g><g data-key="z6" data-only="1"><text x="480.0" y="300.0" font-size="14" fill="#C30B0A" text-anchor="middle" font-weight="700">при z = −6 и y = 1 (уверенная ошибка) MSE слабее в 202.7 раза</text></g>
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
      <div class="step-kicker">Шаг 1 · log loss</div>
      <h4>(Ŷ − Y)/B</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="a b r" data-focus="b r">
      <div class="step-kicker">Шаг 2 · MSE</div>
      <h4>В 2.5–4.8 раза меньше</h4>
      <p>Даже при умеренных логитах.</p>
    </div>
    <div class="step-panel" data-on="r z6" data-focus="z6">
      <div class="step-kicker">Шаг 3 · крайний случай</div>
      <h4>202.7</h4>
      <p>Поэтому для классификации берут log loss.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> MSE поверх сигмоиды умножает градиент на σ′ и перестаёт учить именно на уверенных ошибках; log loss этого множителя не имеет.
</div>

---


## Часть 8. Граница решений

<div class="math-display" data-tex="\hat y &gt; 0.5 \iff z &gt; 0 \iff w_1x_1 + w_2x_2 + b &gt; 0"></div>
<div class="stage" id="stage-bd" tabindex="0">
  <div class="stage-figure">
<svg id="bd" viewBox="0 0 960 600" role="img" aria-label="Граница решений на плоскости признаков">
<style>
  #bd { font-family: Helvetica, Arial, sans-serif; }
  #bd .cap { font-size: 13px; fill: #5E5850; }
  #bd .lbl { font-size: 16px; fill: #111111; }
  #bd .legend { font-size: 13px; fill: #5E5850; }
  #bd .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #bd .grid { stroke: #ffffff; stroke-width: 1.35; }
  #bd .dim { font-size: 13px; fill: #5E5850; }
  #bd .nm { font-size: 16px; font-weight: 800; }
  #bd .op { font-size: 23px; fill: #5E5850; }
  #bd .arw { font-size: 12px; fill: #5E5850; }
  #bd .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="bd-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="bd-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="bd-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="bd-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bd-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bd-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bd-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bd-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bd-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 230 L 214 230" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#bd-arw)"/><text x="232.0" y="222.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#C30B0A" text-anchor="middle">Сигмоида σ</text><rect x="34" y="284" width="182" height="132" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="pts"><line x1="330" y1="480" x2="760" y2="480" stroke="#8A857C"/><line x1="330" y1="480" x2="330" y2="220" stroke="#8A857C"/><text x="760.0" y="498.0" font-size="13" fill="#5E5850" text-anchor="end">x₁</text><text x="318.0" y="226.0" font-size="13" fill="#5E5850" text-anchor="end">x₂</text><circle cx="490.0" cy="320.0" r="9" fill="#4E9A38" stroke="#4E9A38" stroke-width="2.2"/><text x="504.0" y="310.0" font-size="12" fill="#5E5850" text-anchor="start">1</text><circle cx="570.0" cy="400.0" r="9" fill="#4E9A38" stroke="#4E9A38" stroke-width="2.2"/><text x="584.0" y="390.0" font-size="12" fill="#5E5850" text-anchor="start">2</text><circle cx="410.0" cy="320.0" r="9" fill="#FFFFFF" stroke="#4E9A38" stroke-width="2.2"/><text x="424.0" y="310.0" font-size="12" fill="#5E5850" text-anchor="start">3</text><circle cx="650.0" cy="400.0" r="9" fill="#4E9A38" stroke="#4E9A38" stroke-width="2.2"/><text x="664.0" y="390.0" font-size="12" fill="#5E5850" text-anchor="start">4</text><text x="780.0" y="250.0" font-size="13" fill="#5E5850" text-anchor="start">● сдал  ○ не сдал</text></g><g data-key="line"><polygon points="410,480 760,480 760,240 650,240" fill="#E88919" opacity="0.10"/><line x1="410" y1="480" x2="650" y2="240" stroke="#C06F0E" stroke-width="2.6"/><text x="780.0" y="300.0" font-size="13" fill="#C06F0E" text-anchor="start" font-weight="700">x₁ − x₂ − 1 = 0</text><text x="780.0" y="320.0" font-size="12" fill="#5E5850" text-anchor="start">справа снизу z &gt; 0: «сдал»</text></g><g data-key="err" data-only="1"><rect x="476.0" y="306.0" width="28.0" height="28.0" rx="3" fill="none" stroke="#C30B0A" stroke-width="2.2"/><text x="780.0" y="360.0" font-size="13" fill="#C30B0A" text-anchor="start">студент 1: z = −1,</text><text x="780.0" y="378.0" font-size="13" fill="#C30B0A" text-anchor="start">сдал, но по ту сторону</text></g><g data-key="tr" data-only="1"><line x1="356.3" y1="480.0" x2="495.7" y2="240.0" stroke="#4E9A38" stroke-width="2.6" stroke-dasharray="6 4"/><text x="780.0" y="420.0" font-size="13" fill="#4E9A38" text-anchor="start">после 5000 шагов:</text><text x="780.0" y="438.0" font-size="13" fill="#4E9A38" text-anchor="start">все по свою сторону</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="510.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="z = w_1 x_1 + w_2 x_2 + b = 0 \quad \Leftrightarrow \quad p = 0.5"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">точки — студенты · оранжевая линия — граница при w = (1, −1), b = −1 · зелёная — после обучения</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl pts" data-focus="hl pts">
      <div class="step-kicker">Шаг 1 · данные на плоскости</div>
      <h4>Четыре точки</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="hl pts line f" data-focus="line f">
      <div class="step-kicker">Шаг 2 · граница</div>
      <h4>z = 0 — прямая</h4>
      <p>Вектор w перпендикулярен ей и указывает в сторону класса 1; b сдвигает прямую.</p>
    </div>
    <div class="step-panel" data-on="hl pts line err" data-focus="err">
      <div class="step-kicker">Шаг 3 · ошибка</div>
      <h4>Один студент не на той стороне</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="hl pts line tr" data-focus="tr">
      <div class="step-kicker">Шаг 4 · обучение</div>
      <h4>Прямая поворачивается</h4>
      <p>Обученная модель отделяет все четыре точки.</p>
    </div>
    <div class="step-panel" data-on="pts tr f" data-focus="f">
      <div class="step-kicker">Шаг 5 · вывод</div>
      <h4>Линейный классификатор</h4>
      <p>Сигмоида меняет уверенность, но не форму границы: она всегда прямая (плоскость).</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Решения при пороге 0.5.</p>
<div class="stage" id="stage-bdn" tabindex="0">
  <div class="stage-figure">
<svg id="bdn" viewBox="0 0 960 330" role="img" aria-label="Числовая классификация с порогом 0.5">
<style>
  #bdn { font-family: Helvetica, Arial, sans-serif; }
  #bdn .cap { font-size: 13px; fill: #5E5850; }
  #bdn .lbl { font-size: 16px; fill: #111111; }
  #bdn .legend { font-size: 13px; fill: #5E5850; }
  #bdn .edge { stroke: #5E5850; stroke-width: 1.4; fill: none; }
  #bdn .grid { stroke: #ffffff; stroke-width: 1.35; }
  #bdn .dim { font-size: 13px; fill: #5E5850; }
  #bdn .nm { font-size: 16px; font-weight: 800; }
  #bdn .op { font-size: 23px; fill: #5E5850; }
  #bdn .arw { font-size: 12px; fill: #5E5850; }
  #bdn .box { fill: #FBFAF7; stroke: #C9C2B8; stroke-width: 1.4; }
</style>
<defs><marker id="bdn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="bdn-fw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#4E9A38"/></marker><marker id="bdn-bw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker><marker id="bdn-gr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#B9B3A8"/></marker></defs>
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: решения при пороге 0.5</text><g data-key="p"><g><rect x="191.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="191.5" y1="87.0" x2="208.5" y2="87.0" class="grid" opacity=".75"/><line x1="191.5" y1="104.0" x2="208.5" y2="104.0" class="grid" opacity=".75"/><line x1="191.5" y1="121.0" x2="208.5" y2="121.0" class="grid" opacity=".75"/></g><text x="200.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="181.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="110.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y"></div></foreignObject><foreignObject x="145.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.2689 \\ 0.7311 \\ 0.1192 \\ 0.8808\end{bmatrix}"></div></foreignObject><g><rect x="351.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C29E08" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="351.5" y1="87.0" x2="368.5" y2="87.0" class="grid" opacity=".75"/><line x1="351.5" y1="104.0" x2="368.5" y2="104.0" class="grid" opacity=".75"/><line x1="351.5" y1="121.0" x2="368.5" y2="121.0" class="grid" opacity=".75"/></g><text x="360.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="341.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="270.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="[\hat Y &gt; 0.5]"></div></foreignObject><foreignObject x="320.0" y="168.0" width="80.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0 \\ 1 \\ 0 \\ 1\end{bmatrix}"></div></foreignObject><g><rect x="511.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#9A9489" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="511.5" y1="87.0" x2="528.5" y2="87.0" class="grid" opacity=".75"/><line x1="511.5" y1="104.0" x2="528.5" y2="104.0" class="grid" opacity=".75"/><line x1="511.5" y1="121.0" x2="528.5" y2="121.0" class="grid" opacity=".75"/></g><text x="520.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="501.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="430.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="Y"></div></foreignObject><foreignObject x="485.0" y="168.0" width="70.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}1 \\ 1 \\ 0 \\ 1\end{bmatrix}"></div></foreignObject></g><g data-key="acc" data-only="1"><text x="760.0" y="110.0" font-size="15" fill="#111111" text-anchor="middle" font-weight="800">точность 3 / 4</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="p" data-focus="p">
      <div class="step-kicker">Шаг 1 · решения</div>
      <h4>Порог 0.5</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="p acc" data-focus="acc">
      <div class="step-kicker">Шаг 2 · точность</div>
      <h4>0.75</h4>
      <p>Ровно столько же дала бы константа «все сдали»; зато log loss у модели ниже.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> граница решений логистической регрессии — прямая (гиперплоскость) z = 0; сигмоида отвечает за уверенность, а не за форму границы.
</div>

---


## Часть 9. Что ломается: разделимые данные

<p>
  Если прямая может разделить классы без ошибок, у log loss нет минимума: увеличивая длину w,
  модель бесконечно уменьшает потерю. Лекарство — штраф за длину весов:
</p>
<div class="math-display" data-tex="L_\lambda = L + \lambda\|w\|^2"></div>
<div class="stage" id="stage-nl" tabindex="0">
  <div class="stage-figure">
<svg id="nl" viewBox="0 0 960 600" role="img" aria-label="Разделимые данные: веса растут без предела">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#nl-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 230 L 214 230" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#nl-arw)"/><text x="232.0" y="222.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#C30B0A" text-anchor="middle">Linear: XW + b</text><rect x="34" y="364" width="182" height="52" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="grow"><line x1="330" y1="440" x2="750" y2="440" stroke="#8A857C"/><line x1="330" y1="440" x2="330" y2="100" stroke="#8A857C"/><text x="750.0" y="458.0" font-size="12" fill="#5E5850" text-anchor="end">шаг, 0 … 5000</text><text x="336.0" y="94.0" font-size="13" fill="#5E5850" text-anchor="start">‖w‖</text><polyline points="330.0,406.1 330.8,392.5 331.7,384.7 332.5,378.0 333.4,372.0 334.2,366.6 335.0,361.6 335.9,357.1 336.7,352.8 337.6,348.8 338.4,345.0 339.2,341.5 340.1,338.1 340.9,334.9 341.8,331.9 342.6,329.0 343.4,326.2 344.3,323.5 345.1,321.0 346.0,318.6 346.8,316.2 347.6,313.9 348.5,311.8 349.3,309.7 350.2,307.6 351.0,305.6 351.8,303.7 352.7,301.9 353.5,300.1 354.4,298.3 355.2,296.7 356.0,295.0 356.9,293.4 357.7,291.8 358.6,290.3 359.4,288.8 360.2,287.4 361.1,286.0 361.9,284.6 362.8,283.3 363.6,281.9 364.4,280.6 365.3,279.4 366.1,278.1 367.0,276.9 367.8,275.7 368.6,274.6 369.5,273.4 370.3,272.3 371.2,271.2 372.0,270.2 372.8,269.1 373.7,268.1 374.5,267.0 375.4,266.0 376.2,265.0 377.0,264.1 377.9,263.1 378.7,262.2 379.6,261.3 380.4,260.4 381.2,259.5 382.1,258.6 382.9,257.7 383.8,256.9 384.6,256.0 385.4,255.2 386.3,254.4 387.1,253.6 388.0,252.8 388.8,252.0 389.6,251.2 390.5,250.4 391.3,249.7 392.2,248.9 393.0,248.2 393.8,247.5 394.7,246.7 395.5,246.0 396.4,245.3 397.2,244.6 398.0,244.0 398.9,243.3 399.7,242.6 400.6,242.0 401.4,241.3 402.2,240.7 403.1,240.0 403.9,239.4 404.8,238.8 405.6,238.2 406.4,237.5 407.3,236.9 408.1,236.3 409.0,235.7 409.8,235.2 410.6,234.6 411.5,234.0 412.3,233.4 413.2,232.9 414.0,232.3 414.8,231.8 415.7,231.2 416.5,230.7 417.4,230.1 418.2,229.6 419.0,229.1 419.9,228.6 420.7,228.0 421.6,227.5 422.4,227.0 423.2,226.5 424.1,226.0 424.9,225.5 425.8,225.0 426.6,224.5 427.4,224.1 428.3,223.6 429.1,223.1 430.0,222.6 430.8,222.2 431.6,221.7 432.5,221.3 433.3,220.8 434.2,220.3 435.0,219.9 435.8,219.5 436.7,219.0 437.5,218.6 438.4,218.1 439.2,217.7 440.0,217.3 440.9,216.9 441.7,216.4 442.6,216.0 443.4,215.6 444.2,215.2 445.1,214.8 445.9,214.4 446.8,214.0 447.6,213.6 448.4,213.2 449.3,212.8 450.1,212.4 451.0,212.0 451.8,211.6 452.6,211.2 453.5,210.8 454.3,210.5 455.2,210.1 456.0,209.7 456.8,209.3 457.7,209.0 458.5,208.6 459.4,208.2 460.2,207.9 461.0,207.5 461.9,207.2 462.7,206.8 463.6,206.4 464.4,206.1 465.2,205.7 466.1,205.4 466.9,205.1 467.8,204.7 468.6,204.4 469.4,204.0 470.3,203.7 471.1,203.4 472.0,203.0 472.8,202.7 473.6,202.4 474.5,202.0 475.3,201.7 476.2,201.4 477.0,201.1 477.8,200.8 478.7,200.4 479.5,200.1 480.4,199.8 481.2,199.5 482.0,199.2 482.9,198.9 483.7,198.6 484.6,198.3 485.4,198.0 486.2,197.6 487.1,197.3 487.9,197.0 488.8,196.8 489.6,196.5 490.4,196.2 491.3,195.9 492.1,195.6 493.0,195.3 493.8,195.0 494.6,194.7 495.5,194.4 496.3,194.1 497.2,193.9 498.0,193.6 498.8,193.3 499.7,193.0 500.5,192.7 501.4,192.5 502.2,192.2 503.0,191.9 503.9,191.6 504.7,191.4 505.6,191.1 506.4,190.8 507.2,190.6 508.1,190.3 508.9,190.0 509.8,189.8 510.6,189.5 511.4,189.3 512.3,189.0 513.1,188.7 514.0,188.5 514.8,188.2 515.6,188.0 516.5,187.7 517.3,187.5 518.2,187.2 519.0,187.0 519.8,186.7 520.7,186.5 521.5,186.2 522.4,186.0 523.2,185.7 524.0,185.5 524.9,185.2 525.7,185.0 526.6,184.8 527.4,184.5 528.2,184.3 529.1,184.0 529.9,183.8 530.8,183.6 531.6,183.3 532.4,183.1 533.3,182.9 534.1,182.6 535.0,182.4 535.8,182.2 536.6,181.9 537.5,181.7 538.3,181.5 539.2,181.3 540.0,181.0 540.8,180.8 541.7,180.6 542.5,180.4 543.4,180.1 544.2,179.9 545.0,179.7 545.9,179.5 546.7,179.3 547.6,179.0 548.4,178.8 549.2,178.6 550.1,178.4 550.9,178.2 551.8,178.0 552.6,177.8 553.4,177.5 554.3,177.3 555.1,177.1 556.0,176.9 556.8,176.7 557.6,176.5 558.5,176.3 559.3,176.1 560.2,175.9 561.0,175.7 561.8,175.5 562.7,175.3 563.5,175.1 564.4,174.9 565.2,174.7 566.0,174.5 566.9,174.3 567.7,174.1 568.6,173.9 569.4,173.7 570.2,173.5 571.1,173.3 571.9,173.1 572.8,172.9 573.6,172.7 574.4,172.5 575.3,172.3 576.1,172.1 577.0,171.9 577.8,171.7 578.6,171.5 579.5,171.3 580.3,171.2 581.2,171.0 582.0,170.8 582.8,170.6 583.7,170.4 584.5,170.2 585.4,170.0 586.2,169.8 587.0,169.7 587.9,169.5 588.7,169.3 589.6,169.1 590.4,168.9 591.2,168.7 592.1,168.6 592.9,168.4 593.8,168.2 594.6,168.0 595.4,167.9 596.3,167.7 597.1,167.5 598.0,167.3 598.8,167.1 599.6,167.0 600.5,166.8 601.3,166.6 602.2,166.4 603.0,166.3 603.8,166.1 604.7,165.9 605.5,165.8 606.4,165.6 607.2,165.4 608.0,165.2 608.9,165.1 609.7,164.9 610.6,164.7 611.4,164.6 612.2,164.4 613.1,164.2 613.9,164.1 614.8,163.9 615.6,163.7 616.4,163.6 617.3,163.4 618.1,163.2 619.0,163.1 619.8,162.9 620.6,162.7 621.5,162.6 622.3,162.4 623.2,162.3 624.0,162.1 624.8,161.9 625.7,161.8 626.5,161.6 627.4,161.5 628.2,161.3 629.0,161.1 629.9,161.0 630.7,160.8 631.6,160.7 632.4,160.5 633.2,160.4 634.1,160.2 634.9,160.0 635.8,159.9 636.6,159.7 637.4,159.6 638.3,159.4 639.1,159.3 640.0,159.1 640.8,159.0 641.6,158.8 642.5,158.7 643.3,158.5 644.2,158.4 645.0,158.2 645.8,158.1 646.7,157.9 647.5,157.8 648.4,157.6 649.2,157.5 650.0,157.3 650.9,157.2 651.7,157.0 652.6,156.9 653.4,156.7 654.2,156.6 655.1,156.4 655.9,156.3 656.8,156.2 657.6,156.0 658.4,155.9 659.3,155.7 660.1,155.6 661.0,155.4 661.8,155.3 662.6,155.1 663.5,155.0 664.3,154.9 665.2,154.7 666.0,154.6 666.8,154.4 667.7,154.3 668.5,154.2 669.4,154.0 670.2,153.9 671.0,153.7 671.9,153.6 672.7,153.5 673.6,153.3 674.4,153.2 675.2,153.1 676.1,152.9 676.9,152.8 677.8,152.6 678.6,152.5 679.4,152.4 680.3,152.2 681.1,152.1 682.0,152.0 682.8,151.8 683.6,151.7 684.5,151.6 685.3,151.4 686.2,151.3 687.0,151.2 687.8,151.0 688.7,150.9 689.5,150.8 690.4,150.6 691.2,150.5 692.0,150.4 692.9,150.2 693.7,150.1 694.6,150.0 695.4,149.9 696.2,149.7 697.1,149.6 697.9,149.5 698.8,149.3 699.6,149.2 700.4,149.1 701.3,149.0 702.1,148.8 703.0,148.7 703.8,148.6 704.6,148.5 705.5,148.3 706.3,148.2 707.2,148.1 708.0,148.0 708.8,147.8 709.7,147.7 710.5,147.6 711.4,147.5 712.2,147.3 713.0,147.2 713.9,147.1 714.7,147.0 715.6,146.8 716.4,146.7 717.2,146.6 718.1,146.5 718.9,146.3 719.8,146.2 720.6,146.1 721.4,146.0 722.3,145.9 723.1,145.7 724.0,145.6 724.8,145.5 725.6,145.4 726.5,145.3 727.3,145.1 728.2,145.0 729.0,144.9 729.8,144.8 730.7,144.7 731.5,144.6 732.4,144.4 733.2,144.3 734.0,144.2 734.9,144.1 735.7,144.0 736.6,143.9 737.4,143.7 738.2,143.6 739.1,143.5 739.9,143.4 740.8,143.3 741.6,143.2 742.4,143.0 743.3,142.9 744.1,142.8 745.0,142.7 745.8,142.6 746.6,142.5 747.5,142.4 748.3,142.2 749.2,142.1 750.0,142.0" fill="none" stroke="#C30B0A" stroke-width="2.6"/><text x="750.0" y="134.4" font-size="12" fill="#C30B0A" text-anchor="end" font-weight="700">‖w‖: 1.41 → 12.4 и дальше</text></g><g data-key="why"><text x="790.0" y="180.0" font-size="13" fill="#111111" text-anchor="start">когда прямая разделит</text><text x="790.0" y="198.0" font-size="13" fill="#111111" text-anchor="start">все точки, L всё ещё &gt; 0:</text><text x="790.0" y="216.0" font-size="13" fill="#111111" text-anchor="start">растягивая w, модель</text><text x="790.0" y="234.0" font-size="13" fill="#111111" text-anchor="start">делает p ближе к 0 и 1</text></g><g data-key="rg" data-only="1"><polyline points="330.0,406.1 330.8,414.6 331.7,416.7 332.5,417.1 333.4,417.3 334.2,417.3 335.0,417.4 335.9,417.4 336.7,417.5 337.6,417.5 338.4,417.6 339.2,417.6 340.1,417.6 340.9,417.6 341.8,417.7 342.6,417.7 343.4,417.7 344.3,417.7 345.1,417.7 346.0,417.7 346.8,417.7 347.6,417.8 348.5,417.8 349.3,417.8 350.2,417.8 351.0,417.8 351.8,417.8 352.7,417.8 353.5,417.8 354.4,417.8 355.2,417.8 356.0,417.8 356.9,417.8 357.7,417.8 358.6,417.8 359.4,417.8 360.2,417.8 361.1,417.8 361.9,417.8 362.8,417.8 363.6,417.8 364.4,417.8 365.3,417.8 366.1,417.8 367.0,417.8 367.8,417.8 368.6,417.8 369.5,417.8 370.3,417.8 371.2,417.8 372.0,417.8 372.8,417.8 373.7,417.8 374.5,417.8 375.4,417.8 376.2,417.8 377.0,417.8 377.9,417.8 378.7,417.8 379.6,417.8 380.4,417.8 381.2,417.8 382.1,417.8 382.9,417.8 383.8,417.8 384.6,417.8 385.4,417.8 386.3,417.8 387.1,417.8 388.0,417.8 388.8,417.8 389.6,417.8 390.5,417.8 391.3,417.8 392.2,417.8 393.0,417.8 393.8,417.8 394.7,417.8 395.5,417.8 396.4,417.8 397.2,417.8 398.0,417.8 398.9,417.8 399.7,417.8 400.6,417.8 401.4,417.8 402.2,417.8 403.1,417.8 403.9,417.8 404.8,417.8 405.6,417.8 406.4,417.8 407.3,417.8 408.1,417.8 409.0,417.8 409.8,417.8 410.6,417.8 411.5,417.8 412.3,417.8 413.2,417.8 414.0,417.8 414.8,417.8 415.7,417.8 416.5,417.8 417.4,417.8 418.2,417.8 419.0,417.8 419.9,417.8 420.7,417.8 421.6,417.8 422.4,417.8 423.2,417.8 424.1,417.8 424.9,417.8 425.8,417.8 426.6,417.8 427.4,417.8 428.3,417.8 429.1,417.8 430.0,417.8 430.8,417.8 431.6,417.8 432.5,417.8 433.3,417.8 434.2,417.8 435.0,417.8 435.8,417.8 436.7,417.8 437.5,417.8 438.4,417.8 439.2,417.8 440.0,417.8 440.9,417.8 441.7,417.8 442.6,417.8 443.4,417.8 444.2,417.8 445.1,417.8 445.9,417.8 446.8,417.8 447.6,417.8 448.4,417.8 449.3,417.8 450.1,417.8 451.0,417.8 451.8,417.8 452.6,417.8 453.5,417.8 454.3,417.8 455.2,417.8 456.0,417.8 456.8,417.8 457.7,417.8 458.5,417.8 459.4,417.8 460.2,417.8 461.0,417.8 461.9,417.8 462.7,417.8 463.6,417.8 464.4,417.8 465.2,417.8 466.1,417.8 466.9,417.8 467.8,417.8 468.6,417.8 469.4,417.8 470.3,417.8 471.1,417.8 472.0,417.8 472.8,417.8 473.6,417.8 474.5,417.8 475.3,417.8 476.2,417.8 477.0,417.8 477.8,417.8 478.7,417.8 479.5,417.8 480.4,417.8 481.2,417.8 482.0,417.8 482.9,417.8 483.7,417.8 484.6,417.8 485.4,417.8 486.2,417.8 487.1,417.8 487.9,417.8 488.8,417.8 489.6,417.8 490.4,417.8 491.3,417.8 492.1,417.8 493.0,417.8 493.8,417.8 494.6,417.8 495.5,417.8 496.3,417.8 497.2,417.8 498.0,417.8 498.8,417.8 499.7,417.8 500.5,417.8 501.4,417.8 502.2,417.8 503.0,417.8 503.9,417.8 504.7,417.8 505.6,417.8 506.4,417.8 507.2,417.8 508.1,417.8 508.9,417.8 509.8,417.8 510.6,417.8 511.4,417.8 512.3,417.8 513.1,417.8 514.0,417.8 514.8,417.8 515.6,417.8 516.5,417.8 517.3,417.8 518.2,417.8 519.0,417.8 519.8,417.8 520.7,417.8 521.5,417.8 522.4,417.8 523.2,417.8 524.0,417.8 524.9,417.8 525.7,417.8 526.6,417.8 527.4,417.8 528.2,417.8 529.1,417.8 529.9,417.8 530.8,417.8 531.6,417.8 532.4,417.8 533.3,417.8 534.1,417.8 535.0,417.8 535.8,417.8 536.6,417.8 537.5,417.8 538.3,417.8 539.2,417.8 540.0,417.8 540.8,417.8 541.7,417.8 542.5,417.8 543.4,417.8 544.2,417.8 545.0,417.8 545.9,417.8 546.7,417.8 547.6,417.8 548.4,417.8 549.2,417.8 550.1,417.8 550.9,417.8 551.8,417.8 552.6,417.8 553.4,417.8 554.3,417.8 555.1,417.8 556.0,417.8 556.8,417.8 557.6,417.8 558.5,417.8 559.3,417.8 560.2,417.8 561.0,417.8 561.8,417.8 562.7,417.8 563.5,417.8 564.4,417.8 565.2,417.8 566.0,417.8 566.9,417.8 567.7,417.8 568.6,417.8 569.4,417.8 570.2,417.8 571.1,417.8 571.9,417.8 572.8,417.8 573.6,417.8 574.4,417.8 575.3,417.8 576.1,417.8 577.0,417.8 577.8,417.8 578.6,417.8 579.5,417.8 580.3,417.8 581.2,417.8 582.0,417.8 582.8,417.8 583.7,417.8 584.5,417.8 585.4,417.8 586.2,417.8 587.0,417.8 587.9,417.8 588.7,417.8 589.6,417.8 590.4,417.8 591.2,417.8 592.1,417.8 592.9,417.8 593.8,417.8 594.6,417.8 595.4,417.8 596.3,417.8 597.1,417.8 598.0,417.8 598.8,417.8 599.6,417.8 600.5,417.8 601.3,417.8 602.2,417.8 603.0,417.8 603.8,417.8 604.7,417.8 605.5,417.8 606.4,417.8 607.2,417.8 608.0,417.8 608.9,417.8 609.7,417.8 610.6,417.8 611.4,417.8 612.2,417.8 613.1,417.8 613.9,417.8 614.8,417.8 615.6,417.8 616.4,417.8 617.3,417.8 618.1,417.8 619.0,417.8 619.8,417.8 620.6,417.8 621.5,417.8 622.3,417.8 623.2,417.8 624.0,417.8 624.8,417.8 625.7,417.8 626.5,417.8 627.4,417.8 628.2,417.8 629.0,417.8 629.9,417.8 630.7,417.8 631.6,417.8 632.4,417.8 633.2,417.8 634.1,417.8 634.9,417.8 635.8,417.8 636.6,417.8 637.4,417.8 638.3,417.8 639.1,417.8 640.0,417.8 640.8,417.8 641.6,417.8 642.5,417.8 643.3,417.8 644.2,417.8 645.0,417.8 645.8,417.8 646.7,417.8 647.5,417.8 648.4,417.8 649.2,417.8 650.0,417.8 650.9,417.8 651.7,417.8 652.6,417.8 653.4,417.8 654.2,417.8 655.1,417.8 655.9,417.8 656.8,417.8 657.6,417.8 658.4,417.8 659.3,417.8 660.1,417.8 661.0,417.8 661.8,417.8 662.6,417.8 663.5,417.8 664.3,417.8 665.2,417.8 666.0,417.8 666.8,417.8 667.7,417.8 668.5,417.8 669.4,417.8 670.2,417.8 671.0,417.8 671.9,417.8 672.7,417.8 673.6,417.8 674.4,417.8 675.2,417.8 676.1,417.8 676.9,417.8 677.8,417.8 678.6,417.8 679.4,417.8 680.3,417.8 681.1,417.8 682.0,417.8 682.8,417.8 683.6,417.8 684.5,417.8 685.3,417.8 686.2,417.8 687.0,417.8 687.8,417.8 688.7,417.8 689.5,417.8 690.4,417.8 691.2,417.8 692.0,417.8 692.9,417.8 693.7,417.8 694.6,417.8 695.4,417.8 696.2,417.8 697.1,417.8 697.9,417.8 698.8,417.8 699.6,417.8 700.4,417.8 701.3,417.8 702.1,417.8 703.0,417.8 703.8,417.8 704.6,417.8 705.5,417.8 706.3,417.8 707.2,417.8 708.0,417.8 708.8,417.8 709.7,417.8 710.5,417.8 711.4,417.8 712.2,417.8 713.0,417.8 713.9,417.8 714.7,417.8 715.6,417.8 716.4,417.8 717.2,417.8 718.1,417.8 718.9,417.8 719.8,417.8 720.6,417.8 721.4,417.8 722.3,417.8 723.1,417.8 724.0,417.8 724.8,417.8 725.6,417.8 726.5,417.8 727.3,417.8 728.2,417.8 729.0,417.8 729.8,417.8 730.7,417.8 731.5,417.8 732.4,417.8 733.2,417.8 734.0,417.8 734.9,417.8 735.7,417.8 736.6,417.8 737.4,417.8 738.2,417.8 739.1,417.8 739.9,417.8 740.8,417.8 741.6,417.8 742.4,417.8 743.3,417.8 744.1,417.8 745.0,417.8 745.8,417.8 746.6,417.8 747.5,417.8 748.3,417.8 749.2,417.8 750.0,417.8" fill="none" stroke="#4E9A38" stroke-width="2.6"/><text x="750.0" y="409.8" font-size="12" fill="#4E9A38" text-anchor="end" font-weight="700">с λ = 0.1: ‖w‖ = 0.92</text></g><g data-key="f" data-only="1"><foreignObject x="290.0" y="490.0" width="650.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L_{\lambda} = L + \lambda\,\|w\|^2"></div></foreignObject></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">красное — без регуляризации · зелёное — с λ = 0.1</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl grow" data-focus="hl grow">
      <div class="step-kicker">Шаг 1 · эксперимент</div>
      <h4>Обучаем 5000 шагов</h4>
      <p>Наши четыре точки линейно разделимы.</p>
    </div>
    <div class="step-panel" data-on="hl grow why" data-focus="why">
      <div class="step-kicker">Шаг 2 · почему растёт</div>
      <h4>Минимума нет</h4>
      <p>Log loss можно уменьшать бесконечно, умножая w на число больше 1: все вероятности уходят к 0 и 1, но никогда не достигают. Решения нормальных уравнений здесь нет вообще.</p>
    </div>
    <div class="step-panel" data-on="hl grow rg f" data-focus="rg f">
      <div class="step-kicker">Шаг 3 · лечение</div>
      <h4>Штраф за длину w</h4>
      <p>С λ‖w‖² у потери появляется настоящий минимум.</p>
    </div>
    <div class="step-panel" data-on="grow rg" data-focus="rg">
      <div class="step-kicker">Шаг 4 · вывод</div>
      <h4>Регуляризация в классификации обязательна</h4>
      <p>Без неё на разделимых данных веса — и уверенность модели — растут бесконечно. В scikit-learn LogisticRegression штраф включён по умолчанию (C = 1).</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Веса и вероятности после 5000 шагов.</p>
<div class="stage" id="stage-nln" tabindex="0">
  <div class="stage-figure">
<svg id="nln" viewBox="0 0 960 360" role="img" aria-label="Числа эксперимента с разделимыми данными">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: 5000 шагов, η = 0.5</text><g data-key="a"><foreignObject x="20.0" y="80.0" width="920.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\lambda = 0:\quad w = (10.74,\ -6.24),\ b = -3.53,\quad L = 0.0023,\quad \hat Y = (0.996,\ 1.000,\ 0.005,\ 1.000)"></div></foreignObject></g><g data-key="b" data-only="1"><foreignObject x="20.0" y="150.0" width="920.0" height="34.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\lambda = 0.1:\quad w = (0.90,\ -0.22),\ b = -0.52,\quad L_\lambda = 0.3883,\quad \hat Y = (0.70,\ 0.88,\ 0.48,\ 0.95)"></div></foreignObject></g><g data-key="c" data-only="1"><text x="480.0" y="260.0" font-size="13" fill="#3576C0" text-anchor="middle">обе модели классифицируют все четыре точки верно — но вторая не утверждает, что уверена на 100 %</text></g>
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
      <div class="step-kicker">Шаг 1 · без штрафа</div>
      <h4>Веса в 9 раз длиннее</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="a b" data-focus="b">
      <div class="step-kicker">Шаг 2 · со штрафом</div>
      <h4>Остановились</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="a b c" data-focus="c">
      <div class="step-kicker">Шаг 3 · вывод</div>
      <h4>Одинаковая точность, разная уверенность</h4>
      <p></p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> на разделимых данных логистическая регрессия без регуляризации не сходится — веса растут бесконечно; штраф λ‖w‖² возвращает конечный минимум.
</div>

---


## Часть 10. Градиент: обратный проход

<div class="math-display" data-tex="dZ = \frac{\hat Y - Y}{B}, \qquad dW = X^{\top}dZ, \qquad db = \sum_i dz_i"></div>
<div class="stage" id="stage-bpg" tabindex="0">
  <div class="stage-figure">
<svg id="bpg" viewBox="0 0 960 470" role="img" aria-label="Карта обратного прохода логистической регрессии">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Обратный проход: тот же конвейер справа налево</text><g data-key="c0"><rect x="48" y="70" width="64" height="150" rx="10" fill="#FBFAF7" stroke="#C9C2B8" stroke-width="1.8"/><text x="80" y="150" transform="rotate(-90 80 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Вход X</text></g><g data-key="c1"><rect x="228" y="70" width="64" height="150" rx="10" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.8"/><text x="260" y="150" transform="rotate(-90 260 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">Linear</text><rect x="198" y="234" width="124" height="32" rx="7" fill="#FFFBEA" stroke="#C9A227" stroke-width="1.4"/><text x="260.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">W [2×1] · b [1]</text></g><g data-key="c2"><rect x="408" y="70" width="64" height="150" rx="10" fill="#FEF4EA" stroke="#E88919" stroke-width="1.8"/><text x="440" y="150" transform="rotate(-90 440 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">σ</text><rect x="378" y="234" width="124" height="32" rx="7" fill="#FEF4EA" stroke="#E88919" stroke-width="1.4"/><text x="440.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c3"><rect x="588" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.8"/><text x="620" y="150" transform="rotate(-90 620 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">log loss</text><rect x="558" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#D89A9A" stroke-width="1.4"/><text x="620.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><g data-key="c4"><rect x="768" y="70" width="64" height="150" rx="10" fill="#FDF3F3" stroke="#C30B0A" stroke-width="1.8"/><text x="800" y="150" transform="rotate(-90 800 145)" text-anchor="middle" font-size="13" font-weight="800" fill="#111111">среднее</text><rect x="738" y="234" width="124" height="32" rx="7" fill="#FDF3F3" stroke="#C30B0A" stroke-width="1.4"/><text x="800.0" y="255.0" font-size="12" fill="#111111" text-anchor="middle" font-weight="700">нет весов</text></g><path d="M 115.0 145.0 L 225.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="170.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">X</text><text x="170.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 2]</text><path d="M 295.0 145.0 L 405.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="350.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Z</text><text x="350.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 475.0 145.0 L 585.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="530.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">Ŷ</text><text x="530.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 655.0 145.0 L 765.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="710.0" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">ℓ</text><text x="710.0" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[4 × 1]</text><path d="M 835.0 145.0 L 948.0 145.0" fill="none" stroke="#B9B3A8" stroke-width="3" marker-end="url(#bpg-gr)"/><text x="891.5" y="131.0" font-size="13" fill="#111111" text-anchor="middle" font-weight="800" font-style="italic">L</text><text x="891.5" y="171.0" font-size="12" fill="#5E5850" text-anchor="middle">[1]</text><g data-key="yy"><path d="M 620.0 320.0 L 620.0 224.0" fill="none" stroke="#5E5850" stroke-width="1.6" marker-end="url(#bpg-arw)"/><text x="620.0" y="338.0" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="700">Y [4 × 1]</text></g><g data-key="g3"><text x="710.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">1/B</text></g><g data-key="g2"><text x="530.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dŶ</text></g><g data-key="g1"><text x="350.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dZ = (Ŷ−Y)/B</text></g><g data-key="g0"><text x="170.0" y="110.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dL/dX</text></g><g data-key="wg"><text x="260.0" y="290.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">dW = XᵀdZ,  db = ΣdZ</text></g><g data-key="sg"><text x="440.0" y="290.0" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">⊙ Ŷ(1 − Ŷ)</text></g><g data-key="mag" data-only="1"><path d="M 930.0 380.0 L 40.0 380.0" fill="none" stroke="#E39A9A" stroke-width="3" marker-end="url(#bpg-bw)"/><rect x="290" y="364" width="400" height="32" rx="16" fill="#FDF3F3" stroke="#E39A9A"/><text x="490.0" y="385.0" font-size="13" fill="#C30B0A" text-anchor="middle" font-weight="700">градиент течёт справа налево, формы те же</text></g>
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
      <div class="step-kicker">Шаг 1 · среднее</div>
      <h4>1/B</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="c3 c2 yy g2" data-focus="g2">
      <div class="step-kicker">Шаг 2 · log loss назад</div>
      <h4>dL/dŶ = −(Y/Ŷ − (1−Y)/(1−Ŷ))/B</h4>
      <p>Громоздкая дробь…</p>
    </div>
    <div class="step-panel" data-on="c2 c1 sg g1" data-focus="sg g1">
      <div class="step-kicker">Шаг 3 · сигмоида назад</div>
      <h4>… умножается на Ŷ(1 − Ŷ) и сокращается</h4>
      <p>Результат — просто (Ŷ − Y)/B, как у линейной регрессии и у softmax.</p>
    </div>
    <div class="step-panel" data-on="c1 g1 wg" data-focus="wg">
      <div class="step-kicker">Шаг 4 · линейный слой</div>
      <h4>Те же две формулы</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="c0 c1 c2 c3 c4 g0 g1 g2 g3 wg sg mag" data-focus="mag">
      <div class="step-kicker">Шаг 5 · целиком</div>
      <h4>∇ = Xᵀ(Ŷ − Y)/B</h4>
      <p>Формально тот же вид, что у линейной регрессии, только Ŷ теперь нелинеен по θ.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<p class="tiny">Для краткости <span class="math-inline" data-tex="dT"></span> означает <span class="math-inline" data-tex="\partial L / \partial T"></span>.</p>
<div class="stage" id="stage-bp1" tabindex="0">
  <div class="stage-figure">
<svg id="bp1" viewBox="0 0 960 360" role="img" aria-label="Числовой градиент логистической регрессии">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: градиент в точке w = (1, −1), b = −1</text><g data-key="dz"><g><rect x="151.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="151.5" y1="87.0" x2="168.5" y2="87.0" class="grid" opacity=".75"/><line x1="151.5" y1="104.0" x2="168.5" y2="104.0" class="grid" opacity=".75"/><line x1="151.5" y1="121.0" x2="168.5" y2="121.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="141.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="70.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ = (\hat Y - Y)/B"></div></foreignObject><foreignObject x="105.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.1828 \\ -0.0672 \\ 0.0298 \\ -0.0298\end{bmatrix}"></div></foreignObject></g><g data-key="dw"><g><rect x="411.5" y="78.0" width="17.0" height="34.0" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="411.5" y1="95.0" x2="428.5" y2="95.0" class="grid" opacity=".75"/></g><text x="420.0" y="70.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="401.5" y="99.0" font-size="13" fill="#111111" text-anchor="end">2</text><foreignObject x="330.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dW = X^{\top}dZ"></div></foreignObject><foreignObject x="365.0" y="142.0" width="110.0" height="60.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.6566 \\ -0.4030\end{bmatrix}"></div></foreignObject></g><g data-key="db"><g><rect x="651.5" y="95.0" width="17.0" height="17.0" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/></g><text x="660.0" y="87.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="641.5" y="107.5" font-size="13" fill="#111111" text-anchor="end">1</text><foreignObject x="570.0" y="115.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="db"></div></foreignObject><foreignObject x="610.0" y="142.0" width="100.0" height="39.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.2500\end{bmatrix}"></div></foreignObject><text x="660.0" y="200.0" font-size="13" fill="#C30B0A" text-anchor="middle" font-weight="700">ровно −0.25</text></g><g data-key="why" data-only="1"><text x="480.0" y="290.0" font-size="13" fill="#3576C0" text-anchor="middle">σ(1) + σ(−1) = 1 и σ(2) + σ(−2) = 1 ⇒ ΣŶ = 2, ΣY = 3 ⇒ db = (2 − 3)/4</text></g><g data-key="chk" data-only="1"><text x="480.0" y="320.0" font-size="13" fill="#3576C0" text-anchor="middle">сверка разностями: 5.4 · 10⁻¹¹</text></g>
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
      <h4>(Ŷ − Y)/B</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="dz dw" data-focus="dw">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>dW = (−0.66, −0.40)</h4>
      <p>Оба отрицательные — оба веса надо увеличивать.</p>
    </div>
    <div class="step-panel" data-on="dz db why" data-focus="db why">
      <div class="step-kicker">Шаг 3 · смещение</div>
      <h4>Ровно −0.25</h4>
      <p>Симметрия сигмоиды делает сумму предсказаний ровно 2.</p>
    </div>
    <div class="step-panel" data-on="dw db chk" data-focus="chk">
      <div class="step-kicker">Шаг 4 · проверка</div>
      <h4>Численно — то же</h4>
      <p></p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> градиент логистической регрессии — <span class="math-inline" data-tex="X^{\top}(\hat Y - Y)/B"></span>, внешне как у линейной, только Ŷ нелинейно зависит от весов.
</div>

---


## Часть 11. Сокращение производной

<div class="math-display" data-tex="d\hat y = \frac{\hat y - y}{B\,\hat y(1-\hat y)}, \qquad dz = d\hat y\cdot\hat y(1-\hat y) = \frac{\hat y - y}{B}"></div>
<div class="stage" id="stage-bp2" tabindex="0">
  <div class="stage-figure">
<svg id="bp2" viewBox="0 0 960 600" role="img" aria-label="Сокращение производной сигмоиды с производной log loss">
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
<g transform="translate(10,60)"><path d="M 125 450 L 125 410" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 370 L 125 330" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 290 L 125 250" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 210 L 125 170" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><path d="M 125 130 L 125 96" fill="none" stroke="#8A857C" stroke-width="1.2" marker-end="url(#bp2-arw)"/><text x="138.0" y="92.0" font-size="16" fill="#8A857C" text-anchor="start" font-style="italic">L</text><path d="M 236 230 L 214 230" fill="none" stroke="#8A857C" stroke-width="1.1" marker-end="url(#bp2-arw)"/><text x="232.0" y="222.0" font-size="13" fill="#8A857C" text-anchor="start" font-style="italic">Y</text><rect x="40" y="450" width="170" height="36" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="472.5" font-size="13" fill="#8A857C" text-anchor="middle">Вход X</text><rect x="40" y="370" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="394.5" font-size="13" fill="#8A857C" text-anchor="middle">Linear: XW + b</text><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#8A857C" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#8A857C" text-anchor="middle">Log loss</text><rect x="40" y="130" width="170" height="40" rx="7" fill="#FFFFFF" stroke="#8A857C" stroke-width="1.3"/><text x="125.0" y="154.5" font-size="13" fill="#8A857C" text-anchor="middle">Среднее → L</text></g><g data-key="hl" data-only="1"><g transform="translate(10,60)"><rect x="40" y="290" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="314.5" font-size="13" fill="#C30B0A" text-anchor="middle">Сигмоида σ</text><rect x="40" y="210" width="170" height="40" rx="7" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.3"/><text x="125.0" y="234.5" font-size="13" fill="#C30B0A" text-anchor="middle">Log loss</text><rect x="34" y="204" width="182" height="132" rx="10" fill="none" stroke="#C30B0A" stroke-width="2"/></g></g><g data-key="dp"><g><rect x="320.0" y="180.0" width="30.0" height="120.0" rx="2" fill="#C30B0A" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="320.0" y1="210.0" x2="350.0" y2="210.0" class="grid" opacity=".75"/><line x1="320.0" y1="240.0" x2="350.0" y2="240.0" class="grid" opacity=".75"/><line x1="320.0" y1="270.0" x2="350.0" y2="270.0" class="grid" opacity=".75"/></g><foreignObject x="280.0" y="302.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="d\hat Y"></div></foreignObject></g><g data-key="ds"><text x="370.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="386.0" y="180.0" width="30.0" height="120.0" rx="2" fill="#E88919" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="386.0" y1="210.0" x2="416.0" y2="210.0" class="grid" opacity=".75"/><line x1="386.0" y1="240.0" x2="416.0" y2="240.0" class="grid" opacity=".75"/><line x1="386.0" y1="270.0" x2="416.0" y2="270.0" class="grid" opacity=".75"/></g><foreignObject x="341.0" y="302.0" width="120.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y(1-\hat Y)"></div></foreignObject></g><g data-key="dz"><text x="436.0" y="244.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="452.0" y="180.0" width="30.0" height="120.0" rx="2" fill="#D83BB9" opacity="0.45" stroke="#ffffff" stroke-width="1"/><line x1="452.0" y1="210.0" x2="482.0" y2="210.0" class="grid" opacity=".75"/><line x1="452.0" y1="240.0" x2="482.0" y2="240.0" class="grid" opacity=".75"/><line x1="452.0" y1="270.0" x2="482.0" y2="270.0" class="grid" opacity=".75"/></g><foreignObject x="412.0" y="302.0" width="110.0" height="30.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ"></div></foreignObject></g><g data-key="f1"><foreignObject x="520.0" y="170.0" width="430.0" height="50.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="d\hat y = -\dfrac{1}{B}\Big(\dfrac{y}{\hat y} - \dfrac{1-y}{1-\hat y}\Big) = \dfrac{\hat y - y}{B\,\hat y(1-\hat y)}"></div></foreignObject></g><g data-key="f2" data-only="1"><foreignObject x="520.0" y="250.0" width="430.0" height="40.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dz = d\hat y \cdot \hat y(1-\hat y) = \dfrac{\hat y - y}{B}"></div></foreignObject></g><g data-key="note" data-only="1"><text x="615.0" y="380.0" font-size="13" fill="#4E9A38" text-anchor="middle">знаменатель log loss в точности равен σ′ — они сокращаются;</text><text x="615.0" y="400.0" font-size="13" fill="#4E9A38" text-anchor="middle">поэтому градиент не гаснет даже при насыщенной сигмоиде</text></g><text x="20.0" y="584.0" font-size="13" fill="#5E5850" text-anchor="start" class="legend">X — данные · тёмные блоки — обучаемые веса · светлые — посчитанное · оранжевое — вероятности · розовое — градиент по логитам</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hl dp f1" data-focus="hl dp f1">
      <div class="step-kicker">Шаг 1 · градиент по вероятности</div>
      <h4>dŶ</h4>
      <p>Из производной log loss. Приведём к общему знаменателю: ŷ(1 − ŷ) внизу.</p>
    </div>
    <div class="step-panel" data-on="hl dp ds" data-focus="ds">
      <div class="step-kicker">Шаг 2 · через сигмоиду</div>
      <h4>⊙ σ′</h4>
      <p>Цепное правило: умножаем на производную сигмоиды — тот самый ŷ(1 − ŷ).</p>
    </div>
    <div class="step-panel" data-on="hl dp ds dz f2" data-focus="dz f2">
      <div class="step-kicker">Шаг 3 · сокращение</div>
      <h4>(ŷ − y)/B</h4>
      <p>Знаменатель и множитель одинаковы. Остаётся разность предсказания и ответа — без всяких σ′.</p>
    </div>
    <div class="step-panel" data-on="hl dz note" data-focus="note">
      <div class="step-kicker">Шаг 4 · смысл</div>
      <h4>Пара «сигмоида + log loss» подобрана</h4>
      <p>То же происходит с softmax и кросс-энтропией. Поэтому фреймворки считают их вместе (BCEWithLogitsLoss): и формула проще, и численно устойчивее.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

### Те же шаги в числах

<p>Проверка сокращения на батче.</p>
<div class="stage" id="stage-bp2n" tabindex="0">
  <div class="stage-figure">
<svg id="bp2n" viewBox="0 0 960 330" role="img" aria-label="Числовая проверка сокращения">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Числа: dŶ ⊙ Ŷ(1 − Ŷ) = (Ŷ − Y)/B</text><g data-key="dp"><g><rect x="151.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/><line x1="151.5" y1="87.0" x2="168.5" y2="87.0" class="grid" opacity=".75"/><line x1="151.5" y1="104.0" x2="168.5" y2="104.0" class="grid" opacity=".75"/><line x1="151.5" y1="121.0" x2="168.5" y2="121.0" class="grid" opacity=".75"/></g><text x="160.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="141.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="70.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="d\hat Y"></div></foreignObject><foreignObject x="105.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.9296 \\ -0.3420 \\ 0.2838 \\ -0.2838\end{bmatrix}"></div></foreignObject></g><g data-key="ds"><text x="240.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">⊙</text><g><rect x="311.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#E88919" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="311.5" y1="87.0" x2="328.5" y2="87.0" class="grid" opacity=".75"/><line x1="311.5" y1="104.0" x2="328.5" y2="104.0" class="grid" opacity=".75"/><line x1="311.5" y1="121.0" x2="328.5" y2="121.0" class="grid" opacity=".75"/></g><text x="320.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="301.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="230.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="\hat Y(1-\hat Y)"></div></foreignObject><foreignObject x="265.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}0.1966 \\ 0.1966 \\ 0.1050 \\ 0.1050\end{bmatrix}"></div></foreignObject></g><g data-key="dz"><text x="400.0" y="104.0" font-size="22" fill="#111111" text-anchor="middle">=</text><g><rect x="471.5" y="70.0" width="17.0" height="68.0" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="471.5" y1="87.0" x2="488.5" y2="87.0" class="grid" opacity=".75"/><line x1="471.5" y1="104.0" x2="488.5" y2="104.0" class="grid" opacity=".75"/><line x1="471.5" y1="121.0" x2="488.5" y2="121.0" class="grid" opacity=".75"/></g><text x="480.0" y="62.0" font-size="13" fill="#111111" text-anchor="middle">1</text><text x="461.5" y="108.0" font-size="13" fill="#111111" text-anchor="end">4</text><foreignObject x="390.0" y="141.0" width="180.0" height="26.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="dZ"></div></foreignObject><foreignObject x="425.0" y="168.0" width="110.0" height="102.0"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\begin{bmatrix}-0.1828 \\ -0.0672 \\ 0.0298 \\ -0.0298\end{bmatrix}"></div></foreignObject><text x="700.0" y="110.0" font-size="13" fill="#111111" text-anchor="start">= (Ŷ − Y)/4:</text><text x="700.0" y="130.0" font-size="13" fill="#111111" text-anchor="start">(0.2689 − 1)/4 = −0.1828</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="dp" data-focus="dp">
      <div class="step-kicker">Шаг 1 · dŶ</div>
      <h4>−0.9296 у первого</h4>
      <p>Большой: вероятность правильного класса мала.</p>
    </div>
    <div class="step-panel" data-on="dp ds" data-focus="ds">
      <div class="step-kicker">Шаг 2 · σ′</div>
      <h4>0.1966</h4>
      <p></p>
    </div>
    <div class="step-panel" data-on="dp ds dz" data-focus="dz">
      <div class="step-kicker">Шаг 3 · произведение</div>
      <h4>−0.1828</h4>
      <p>Ровно (Ŷ − Y)/B.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> знаменатель производной log loss в точности равен производной сигмоиды; вместе они дают простую разность <code>Ŷ − Y</code>.
</div>

---


## Часть 12. Проверка градиента и обучение

<div class="math-display" data-tex="\theta \leftarrow \theta - \eta\,\nabla_\theta L"></div>
<div class="stage" id="stage-tr" tabindex="0">
  <div class="stage-figure">
<svg id="tr" viewBox="0 0 960 520" role="img" aria-label="Обучение с регуляризацией и без">
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
<text x="20.0" y="34.0" font-size="20" fill="#111111" text-anchor="start" font-weight="800" class="ttl">Проверка градиента и обучение</text><g data-key="check"><text x="30.0" y="90.0" font-size="13" fill="#111111" text-anchor="start" font-weight="700">сверка градиента: 5.4 · 10⁻¹¹</text><text x="30.0" y="114.0" font-size="13" fill="#111111" text-anchor="start">первый шаг η = 0.5: L 0.4701 → 0.2505</text></g><g data-key="t0" data-only="1"><text x="30.0" y="160.0" font-size="13" fill="#C30B0A" text-anchor="start" font-weight="700">λ = 0: L → 0.0023 за 5000 шагов,</text><text x="30.0" y="178.0" font-size="13" fill="#C30B0A" text-anchor="start">но никогда не 0; ‖w‖ растёт</text></g><g data-key="t1" data-only="1"><text x="30.0" y="220.0" font-size="13" fill="#4E9A38" text-anchor="start" font-weight="700">λ = 0.1: L_λ = 0.3883 уже к ~100 шагу;</text><text x="30.0" y="238.0" font-size="13" fill="#4E9A38" text-anchor="start">все четыре верно, p от 0.48 до 0.95</text></g><line x1="520" y1="440" x2="920" y2="440" stroke="#8A857C"/><line x1="520" y1="440" x2="520" y2="100" stroke="#8A857C"/><text x="512.0" y="444.0" font-size="12" fill="#5E5850" text-anchor="end">0,00</text><line x1="520" y1="440" x2="920" y2="440" stroke="#EFECE4"/><text x="512.0" y="344.0" font-size="12" fill="#5E5850" text-anchor="end">0,25</text><line x1="520" y1="340.0" x2="920" y2="340.0" stroke="#EFECE4"/><text x="512.0" y="244.0" font-size="12" fill="#5E5850" text-anchor="end">0,50</text><line x1="520" y1="240.0" x2="920" y2="240.0" stroke="#EFECE4"/><text x="512.0" y="144.0" font-size="12" fill="#5E5850" text-anchor="end">0,75</text><line x1="520" y1="140.0" x2="920" y2="140.0" stroke="#EFECE4"/><text x="520.0" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">0</text><text x="653.3" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">1000</text><text x="786.7" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">2000</text><text x="920.0" y="458.0" font-size="12" fill="#5E5850" text-anchor="middle">3000</text><text x="920.0" y="476.0" font-size="12" fill="#5E5850" text-anchor="end">шаг, η = 0.5</text><text x="526.0" y="92.0" font-size="13" fill="#5E5850" text-anchor="start" font-style="italic">L</text><g data-key="c0"><polyline points="520.0,252.0 520.7,362.1 521.3,368.2 522.0,373.1 522.7,377.2 523.3,380.8 524.0,383.9 524.7,386.7 525.3,389.2 526.0,391.4 526.7,393.5 527.3,395.4 528.0,397.2 528.7,398.8 529.3,400.3 530.0,401.7 530.7,403.0 531.3,404.2 532.0,405.4 532.7,406.4 533.3,407.5 534.0,408.4 534.7,409.3 535.3,410.2 536.0,411.0 536.7,411.8 537.3,412.5 538.0,413.2 538.7,413.9 539.3,414.5 540.0,415.1 540.7,415.7 541.3,416.3 542.0,416.8 542.7,417.3 543.3,417.8 544.0,418.3 544.7,418.7 545.3,419.1 546.0,419.6 546.7,420.0 547.3,420.3 548.0,420.7 548.7,421.1 549.3,421.4 550.0,421.8 550.7,422.1 551.3,422.4 552.0,422.7 552.7,423.0 553.3,423.3 554.0,423.5 554.7,423.8 555.3,424.1 556.0,424.3 556.7,424.6 557.3,424.8 558.0,425.0 558.7,425.2 559.3,425.5 560.0,425.7 560.7,425.9 561.3,426.1 562.0,426.3 562.7,426.5 563.3,426.6 564.0,426.8 564.7,427.0 565.3,427.2 566.0,427.3 566.7,427.5 567.3,427.6 568.0,427.8 568.7,427.9 569.3,428.1 570.0,428.2 570.7,428.4 571.3,428.5 572.0,428.6 572.7,428.8 573.3,428.9 574.0,429.0 574.7,429.1 575.3,429.3 576.0,429.4 576.7,429.5 577.3,429.6 578.0,429.7 578.7,429.8 579.3,429.9 580.0,430.0 580.7,430.1 581.3,430.2 582.0,430.3 582.7,430.4 583.3,430.5 584.0,430.6 584.7,430.7 585.3,430.8 586.0,430.9 586.7,431.0 587.3,431.0 588.0,431.1 588.7,431.2 589.3,431.3 590.0,431.4 590.7,431.4 591.3,431.5 592.0,431.6 592.7,431.7 593.3,431.7 594.0,431.8 594.7,431.9 595.3,431.9 596.0,432.0 596.7,432.1 597.3,432.1 598.0,432.2 598.7,432.3 599.3,432.3 600.0,432.4 600.7,432.4 601.3,432.5 602.0,432.6 602.7,432.6 603.3,432.7 604.0,432.7 604.7,432.8 605.3,432.8 606.0,432.9 606.7,432.9 607.3,433.0 608.0,433.0 608.7,433.1 609.3,433.1 610.0,433.2 610.7,433.2 611.3,433.3 612.0,433.3 612.7,433.4 613.3,433.4 614.0,433.5 614.7,433.5 615.3,433.6 616.0,433.6 616.7,433.6 617.3,433.7 618.0,433.7 618.7,433.8 619.3,433.8 620.0,433.8 620.7,433.9 621.3,433.9 622.0,434.0 622.7,434.0 623.3,434.0 624.0,434.1 624.7,434.1 625.3,434.1 626.0,434.2 626.7,434.2 627.3,434.3 628.0,434.3 628.7,434.3 629.3,434.4 630.0,434.4 630.7,434.4 631.3,434.5 632.0,434.5 632.7,434.5 633.3,434.5 634.0,434.6 634.7,434.6 635.3,434.6 636.0,434.7 636.7,434.7 637.3,434.7 638.0,434.8 638.7,434.8 639.3,434.8 640.0,434.8 640.7,434.9 641.3,434.9 642.0,434.9 642.7,435.0 643.3,435.0 644.0,435.0 644.7,435.0 645.3,435.1 646.0,435.1 646.7,435.1 647.3,435.1 648.0,435.2 648.7,435.2 649.3,435.2 650.0,435.2 650.7,435.3 651.3,435.3 652.0,435.3 652.7,435.3 653.3,435.3 654.0,435.4 654.7,435.4 655.3,435.4 656.0,435.4 656.7,435.5 657.3,435.5 658.0,435.5 658.7,435.5 659.3,435.5 660.0,435.6 660.7,435.6 661.3,435.6 662.0,435.6 662.7,435.6 663.3,435.7 664.0,435.7 664.7,435.7 665.3,435.7 666.0,435.7 666.7,435.8 667.3,435.8 668.0,435.8 668.7,435.8 669.3,435.8 670.0,435.9 670.7,435.9 671.3,435.9 672.0,435.9 672.7,435.9 673.3,435.9 674.0,436.0 674.7,436.0 675.3,436.0 676.0,436.0 676.7,436.0 677.3,436.0 678.0,436.1 678.7,436.1 679.3,436.1 680.0,436.1 680.7,436.1 681.3,436.1 682.0,436.2 682.7,436.2 683.3,436.2 684.0,436.2 684.7,436.2 685.3,436.2 686.0,436.3 686.7,436.3 687.3,436.3 688.0,436.3 688.7,436.3 689.3,436.3 690.0,436.3 690.7,436.4 691.3,436.4 692.0,436.4 692.7,436.4 693.3,436.4 694.0,436.4 694.7,436.4 695.3,436.4 696.0,436.5 696.7,436.5 697.3,436.5 698.0,436.5 698.7,436.5 699.3,436.5 700.0,436.5 700.7,436.6 701.3,436.6 702.0,436.6 702.7,436.6 703.3,436.6 704.0,436.6 704.7,436.6 705.3,436.6 706.0,436.6 706.7,436.7 707.3,436.7 708.0,436.7 708.7,436.7 709.3,436.7 710.0,436.7 710.7,436.7 711.3,436.7 712.0,436.8 712.7,436.8 713.3,436.8 714.0,436.8 714.7,436.8 715.3,436.8 716.0,436.8 716.7,436.8 717.3,436.8 718.0,436.9 718.7,436.9 719.3,436.9 720.0,436.9 720.7,436.9 721.3,436.9 722.0,436.9 722.7,436.9 723.3,436.9 724.0,436.9 724.7,437.0 725.3,437.0 726.0,437.0 726.7,437.0 727.3,437.0 728.0,437.0 728.7,437.0 729.3,437.0 730.0,437.0 730.7,437.0 731.3,437.0 732.0,437.1 732.7,437.1 733.3,437.1 734.0,437.1 734.7,437.1 735.3,437.1 736.0,437.1 736.7,437.1 737.3,437.1 738.0,437.1 738.7,437.1 739.3,437.2 740.0,437.2 740.7,437.2 741.3,437.2 742.0,437.2 742.7,437.2 743.3,437.2 744.0,437.2 744.7,437.2 745.3,437.2 746.0,437.2 746.7,437.2 747.3,437.3 748.0,437.3 748.7,437.3 749.3,437.3 750.0,437.3 750.7,437.3 751.3,437.3 752.0,437.3 752.7,437.3 753.3,437.3 754.0,437.3 754.7,437.3 755.3,437.3 756.0,437.4 756.7,437.4 757.3,437.4 758.0,437.4 758.7,437.4 759.3,437.4 760.0,437.4 760.7,437.4 761.3,437.4 762.0,437.4 762.7,437.4 763.3,437.4 764.0,437.4 764.7,437.4 765.3,437.5 766.0,437.5 766.7,437.5 767.3,437.5 768.0,437.5 768.7,437.5 769.3,437.5 770.0,437.5 770.7,437.5 771.3,437.5 772.0,437.5 772.7,437.5 773.3,437.5 774.0,437.5 774.7,437.5 775.3,437.6 776.0,437.6 776.7,437.6 777.3,437.6 778.0,437.6 778.7,437.6 779.3,437.6 780.0,437.6 780.7,437.6 781.3,437.6 782.0,437.6 782.7,437.6 783.3,437.6 784.0,437.6 784.7,437.6 785.3,437.6 786.0,437.7 786.7,437.7 787.3,437.7 788.0,437.7 788.7,437.7 789.3,437.7 790.0,437.7 790.7,437.7 791.3,437.7 792.0,437.7 792.7,437.7 793.3,437.7 794.0,437.7 794.7,437.7 795.3,437.7 796.0,437.7 796.7,437.7 797.3,437.7 798.0,437.8 798.7,437.8 799.3,437.8 800.0,437.8 800.7,437.8 801.3,437.8 802.0,437.8 802.7,437.8 803.3,437.8 804.0,437.8 804.7,437.8 805.3,437.8 806.0,437.8 806.7,437.8 807.3,437.8 808.0,437.8 808.7,437.8 809.3,437.8 810.0,437.8 810.7,437.9 811.3,437.9 812.0,437.9 812.7,437.9 813.3,437.9 814.0,437.9 814.7,437.9 815.3,437.9 816.0,437.9 816.7,437.9 817.3,437.9 818.0,437.9 818.7,437.9 819.3,437.9 820.0,437.9 820.7,437.9 821.3,437.9 822.0,437.9 822.7,437.9 823.3,437.9 824.0,437.9 824.7,438.0 825.3,438.0 826.0,438.0 826.7,438.0 827.3,438.0 828.0,438.0 828.7,438.0 829.3,438.0 830.0,438.0 830.7,438.0 831.3,438.0 832.0,438.0 832.7,438.0 833.3,438.0 834.0,438.0 834.7,438.0 835.3,438.0 836.0,438.0 836.7,438.0 837.3,438.0 838.0,438.0 838.7,438.0 839.3,438.0 840.0,438.0 840.7,438.1 841.3,438.1 842.0,438.1 842.7,438.1 843.3,438.1 844.0,438.1 844.7,438.1 845.3,438.1 846.0,438.1 846.7,438.1 847.3,438.1 848.0,438.1 848.7,438.1 849.3,438.1 850.0,438.1 850.7,438.1 851.3,438.1 852.0,438.1 852.7,438.1 853.3,438.1 854.0,438.1 854.7,438.1 855.3,438.1 856.0,438.1 856.7,438.1 857.3,438.1 858.0,438.2 858.7,438.2 859.3,438.2 860.0,438.2 860.7,438.2 861.3,438.2 862.0,438.2 862.7,438.2 863.3,438.2 864.0,438.2 864.7,438.2 865.3,438.2 866.0,438.2 866.7,438.2 867.3,438.2 868.0,438.2 868.7,438.2 869.3,438.2 870.0,438.2 870.7,438.2 871.3,438.2 872.0,438.2 872.7,438.2 873.3,438.2 874.0,438.2 874.7,438.2 875.3,438.2 876.0,438.2 876.7,438.2 877.3,438.3 878.0,438.3 878.7,438.3 879.3,438.3 880.0,438.3 880.7,438.3 881.3,438.3 882.0,438.3 882.7,438.3 883.3,438.3 884.0,438.3 884.7,438.3 885.3,438.3 886.0,438.3 886.7,438.3 887.3,438.3 888.0,438.3 888.7,438.3 889.3,438.3 890.0,438.3 890.7,438.3 891.3,438.3 892.0,438.3 892.7,438.3 893.3,438.3 894.0,438.3 894.7,438.3 895.3,438.3 896.0,438.3 896.7,438.3 897.3,438.3 898.0,438.3 898.7,438.4 899.3,438.4 900.0,438.4 900.7,438.4 901.3,438.4 902.0,438.4 902.7,438.4 903.3,438.4 904.0,438.4 904.7,438.4 905.3,438.4 906.0,438.4 906.7,438.4 907.3,438.4 908.0,438.4 908.7,438.4 909.3,438.4 910.0,438.4 910.7,438.4 911.3,438.4 912.0,438.4 912.7,438.4 913.3,438.4 914.0,438.4 914.7,438.4 915.3,438.4 916.0,438.4 916.7,438.4 917.3,438.4 918.0,438.4 918.7,438.4 919.3,438.4 920.0,438.4" fill="none" stroke="#C30B0A" stroke-width="2.6"/><text x="920.0" y="428.0" font-size="12" fill="#C30B0A" text-anchor="end" font-weight="700">λ = 0</text></g><g data-key="c1" data-only="1"><polyline points="520.0,172.0 520.7,278.5 521.3,283.3 522.0,284.2 522.7,284.4 523.3,284.4 524.0,284.5 524.7,284.5 525.3,284.5 526.0,284.5 526.7,284.6 527.3,284.6 528.0,284.6 528.7,284.6 529.3,284.6 530.0,284.6 530.7,284.6 531.3,284.6 532.0,284.6 532.7,284.6 533.3,284.6 534.0,284.6 534.7,284.6 535.3,284.7 536.0,284.7 536.7,284.7 537.3,284.7 538.0,284.7 538.7,284.7 539.3,284.7 540.0,284.7 540.7,284.7 541.3,284.7 542.0,284.7 542.7,284.7 543.3,284.7 544.0,284.7 544.7,284.7 545.3,284.7 546.0,284.7 546.7,284.7 547.3,284.7 548.0,284.7 548.7,284.7 549.3,284.7 550.0,284.7 550.7,284.7 551.3,284.7 552.0,284.7 552.7,284.7 553.3,284.7 554.0,284.7 554.7,284.7 555.3,284.7 556.0,284.7 556.7,284.7 557.3,284.7 558.0,284.7 558.7,284.7 559.3,284.7 560.0,284.7 560.7,284.7 561.3,284.7 562.0,284.7 562.7,284.7 563.3,284.7 564.0,284.7 564.7,284.7 565.3,284.7 566.0,284.7 566.7,284.7 567.3,284.7 568.0,284.7 568.7,284.7 569.3,284.7 570.0,284.7 570.7,284.7 571.3,284.7 572.0,284.7 572.7,284.7 573.3,284.7 574.0,284.7 574.7,284.7 575.3,284.7 576.0,284.7 576.7,284.7 577.3,284.7 578.0,284.7 578.7,284.7 579.3,284.7 580.0,284.7 580.7,284.7 581.3,284.7 582.0,284.7 582.7,284.7 583.3,284.7 584.0,284.7 584.7,284.7 585.3,284.7 586.0,284.7 586.7,284.7 587.3,284.7 588.0,284.7 588.7,284.7 589.3,284.7 590.0,284.7 590.7,284.7 591.3,284.7 592.0,284.7 592.7,284.7 593.3,284.7 594.0,284.7 594.7,284.7 595.3,284.7 596.0,284.7 596.7,284.7 597.3,284.7 598.0,284.7 598.7,284.7 599.3,284.7 600.0,284.7 600.7,284.7 601.3,284.7 602.0,284.7 602.7,284.7 603.3,284.7 604.0,284.7 604.7,284.7 605.3,284.7 606.0,284.7 606.7,284.7 607.3,284.7 608.0,284.7 608.7,284.7 609.3,284.7 610.0,284.7 610.7,284.7 611.3,284.7 612.0,284.7 612.7,284.7 613.3,284.7 614.0,284.7 614.7,284.7 615.3,284.7 616.0,284.7 616.7,284.7 617.3,284.7 618.0,284.7 618.7,284.7 619.3,284.7 620.0,284.7 620.7,284.7 621.3,284.7 622.0,284.7 622.7,284.7 623.3,284.7 624.0,284.7 624.7,284.7 625.3,284.7 626.0,284.7 626.7,284.7 627.3,284.7 628.0,284.7 628.7,284.7 629.3,284.7 630.0,284.7 630.7,284.7 631.3,284.7 632.0,284.7 632.7,284.7 633.3,284.7 634.0,284.7 634.7,284.7 635.3,284.7 636.0,284.7 636.7,284.7 637.3,284.7 638.0,284.7 638.7,284.7 639.3,284.7 640.0,284.7 640.7,284.7 641.3,284.7 642.0,284.7 642.7,284.7 643.3,284.7 644.0,284.7 644.7,284.7 645.3,284.7 646.0,284.7 646.7,284.7 647.3,284.7 648.0,284.7 648.7,284.7 649.3,284.7 650.0,284.7 650.7,284.7 651.3,284.7 652.0,284.7 652.7,284.7 653.3,284.7 654.0,284.7 654.7,284.7 655.3,284.7 656.0,284.7 656.7,284.7 657.3,284.7 658.0,284.7 658.7,284.7 659.3,284.7 660.0,284.7 660.7,284.7 661.3,284.7 662.0,284.7 662.7,284.7 663.3,284.7 664.0,284.7 664.7,284.7 665.3,284.7 666.0,284.7 666.7,284.7 667.3,284.7 668.0,284.7 668.7,284.7 669.3,284.7 670.0,284.7 670.7,284.7 671.3,284.7 672.0,284.7 672.7,284.7 673.3,284.7 674.0,284.7 674.7,284.7 675.3,284.7 676.0,284.7 676.7,284.7 677.3,284.7 678.0,284.7 678.7,284.7 679.3,284.7 680.0,284.7 680.7,284.7 681.3,284.7 682.0,284.7 682.7,284.7 683.3,284.7 684.0,284.7 684.7,284.7 685.3,284.7 686.0,284.7 686.7,284.7 687.3,284.7 688.0,284.7 688.7,284.7 689.3,284.7 690.0,284.7 690.7,284.7 691.3,284.7 692.0,284.7 692.7,284.7 693.3,284.7 694.0,284.7 694.7,284.7 695.3,284.7 696.0,284.7 696.7,284.7 697.3,284.7 698.0,284.7 698.7,284.7 699.3,284.7 700.0,284.7 700.7,284.7 701.3,284.7 702.0,284.7 702.7,284.7 703.3,284.7 704.0,284.7 704.7,284.7 705.3,284.7 706.0,284.7 706.7,284.7 707.3,284.7 708.0,284.7 708.7,284.7 709.3,284.7 710.0,284.7 710.7,284.7 711.3,284.7 712.0,284.7 712.7,284.7 713.3,284.7 714.0,284.7 714.7,284.7 715.3,284.7 716.0,284.7 716.7,284.7 717.3,284.7 718.0,284.7 718.7,284.7 719.3,284.7 720.0,284.7 720.7,284.7 721.3,284.7 722.0,284.7 722.7,284.7 723.3,284.7 724.0,284.7 724.7,284.7 725.3,284.7 726.0,284.7 726.7,284.7 727.3,284.7 728.0,284.7 728.7,284.7 729.3,284.7 730.0,284.7 730.7,284.7 731.3,284.7 732.0,284.7 732.7,284.7 733.3,284.7 734.0,284.7 734.7,284.7 735.3,284.7 736.0,284.7 736.7,284.7 737.3,284.7 738.0,284.7 738.7,284.7 739.3,284.7 740.0,284.7 740.7,284.7 741.3,284.7 742.0,284.7 742.7,284.7 743.3,284.7 744.0,284.7 744.7,284.7 745.3,284.7 746.0,284.7 746.7,284.7 747.3,284.7 748.0,284.7 748.7,284.7 749.3,284.7 750.0,284.7 750.7,284.7 751.3,284.7 752.0,284.7 752.7,284.7 753.3,284.7 754.0,284.7 754.7,284.7 755.3,284.7 756.0,284.7 756.7,284.7 757.3,284.7 758.0,284.7 758.7,284.7 759.3,284.7 760.0,284.7 760.7,284.7 761.3,284.7 762.0,284.7 762.7,284.7 763.3,284.7 764.0,284.7 764.7,284.7 765.3,284.7 766.0,284.7 766.7,284.7 767.3,284.7 768.0,284.7 768.7,284.7 769.3,284.7 770.0,284.7 770.7,284.7 771.3,284.7 772.0,284.7 772.7,284.7 773.3,284.7 774.0,284.7 774.7,284.7 775.3,284.7 776.0,284.7 776.7,284.7 777.3,284.7 778.0,284.7 778.7,284.7 779.3,284.7 780.0,284.7 780.7,284.7 781.3,284.7 782.0,284.7 782.7,284.7 783.3,284.7 784.0,284.7 784.7,284.7 785.3,284.7 786.0,284.7 786.7,284.7 787.3,284.7 788.0,284.7 788.7,284.7 789.3,284.7 790.0,284.7 790.7,284.7 791.3,284.7 792.0,284.7 792.7,284.7 793.3,284.7 794.0,284.7 794.7,284.7 795.3,284.7 796.0,284.7 796.7,284.7 797.3,284.7 798.0,284.7 798.7,284.7 799.3,284.7 800.0,284.7 800.7,284.7 801.3,284.7 802.0,284.7 802.7,284.7 803.3,284.7 804.0,284.7 804.7,284.7 805.3,284.7 806.0,284.7 806.7,284.7 807.3,284.7 808.0,284.7 808.7,284.7 809.3,284.7 810.0,284.7 810.7,284.7 811.3,284.7 812.0,284.7 812.7,284.7 813.3,284.7 814.0,284.7 814.7,284.7 815.3,284.7 816.0,284.7 816.7,284.7 817.3,284.7 818.0,284.7 818.7,284.7 819.3,284.7 820.0,284.7 820.7,284.7 821.3,284.7 822.0,284.7 822.7,284.7 823.3,284.7 824.0,284.7 824.7,284.7 825.3,284.7 826.0,284.7 826.7,284.7 827.3,284.7 828.0,284.7 828.7,284.7 829.3,284.7 830.0,284.7 830.7,284.7 831.3,284.7 832.0,284.7 832.7,284.7 833.3,284.7 834.0,284.7 834.7,284.7 835.3,284.7 836.0,284.7 836.7,284.7 837.3,284.7 838.0,284.7 838.7,284.7 839.3,284.7 840.0,284.7 840.7,284.7 841.3,284.7 842.0,284.7 842.7,284.7 843.3,284.7 844.0,284.7 844.7,284.7 845.3,284.7 846.0,284.7 846.7,284.7 847.3,284.7 848.0,284.7 848.7,284.7 849.3,284.7 850.0,284.7 850.7,284.7 851.3,284.7 852.0,284.7 852.7,284.7 853.3,284.7 854.0,284.7 854.7,284.7 855.3,284.7 856.0,284.7 856.7,284.7 857.3,284.7 858.0,284.7 858.7,284.7 859.3,284.7 860.0,284.7 860.7,284.7 861.3,284.7 862.0,284.7 862.7,284.7 863.3,284.7 864.0,284.7 864.7,284.7 865.3,284.7 866.0,284.7 866.7,284.7 867.3,284.7 868.0,284.7 868.7,284.7 869.3,284.7 870.0,284.7 870.7,284.7 871.3,284.7 872.0,284.7 872.7,284.7 873.3,284.7 874.0,284.7 874.7,284.7 875.3,284.7 876.0,284.7 876.7,284.7 877.3,284.7 878.0,284.7 878.7,284.7 879.3,284.7 880.0,284.7 880.7,284.7 881.3,284.7 882.0,284.7 882.7,284.7 883.3,284.7 884.0,284.7 884.7,284.7 885.3,284.7 886.0,284.7 886.7,284.7 887.3,284.7 888.0,284.7 888.7,284.7 889.3,284.7 890.0,284.7 890.7,284.7 891.3,284.7 892.0,284.7 892.7,284.7 893.3,284.7 894.0,284.7 894.7,284.7 895.3,284.7 896.0,284.7 896.7,284.7 897.3,284.7 898.0,284.7 898.7,284.7 899.3,284.7 900.0,284.7 900.7,284.7 901.3,284.7 902.0,284.7 902.7,284.7 903.3,284.7 904.0,284.7 904.7,284.7 905.3,284.7 906.0,284.7 906.7,284.7 907.3,284.7 908.0,284.7 908.7,284.7 909.3,284.7 910.0,284.7 910.7,284.7 911.3,284.7 912.0,284.7 912.7,284.7 913.3,284.7 914.0,284.7 914.7,284.7 915.3,284.7 916.0,284.7 916.7,284.7 917.3,284.7 918.0,284.7 918.7,284.7 919.3,284.7 920.0,284.7" fill="none" stroke="#4E9A38" stroke-width="2.6"/><text x="920.0" y="276.7" font-size="12" fill="#4E9A38" text-anchor="end" font-weight="700">λ = 0.1</text></g>
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
      <p></p>
    </div>
    <div class="step-panel" data-on="check c0 t0" data-focus="c0 t0">
      <div class="step-kicker">Шаг 2 · без штрафа</div>
      <h4>Потеря ползёт к нулю</h4>
      <p>Классы уже разделены, и дальше модель только «накачивает уверенность».</p>
    </div>
    <div class="step-panel" data-on="check c0 c1 t0 t1" data-focus="c1 t1">
      <div class="step-kicker">Шаг 3 · со штрафом</div>
      <h4>Быстро выходит на полку</h4>
      <p>Полка выше, но это настоящий минимум: веса перестают расти.</p>
    </div>
    <div class="step-panel" data-on="c0 c1 t1" data-focus="c1">
      <div class="step-kicker">Шаг 4 · итог</div>
      <h4>Спуск — единственный путь</h4>
      <p>У логистической регрессии нет формулы вида нормальных уравнений: уравнение Xᵀ(σ(Xθ) − Y) = 0 нелинейно. Поэтому её решают итерациями — спуском, Ньютоном или L-BFGS.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>
<div class="callout">
  <strong>Главная мысль части:</strong> у логистической регрессии нет формулы в замкнутом виде — только итерации; регуляризация делает минимум конечным и обучение устойчивым.
</div>

---


## Часть 13. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Модель:</strong> <span class="math-inline" data-tex="\hat Y = \sigma(XW + b)"></span> — линейный слой и сигмоида.</li>
  <li><strong>Сигмоида:</strong> <span class="math-inline" data-tex="\sigma(-z) = 1 - \sigma(z)"></span>, <span class="math-inline" data-tex="\sigma' = \sigma(1-\sigma) \le 0.25"></span>.</li>
  <li><strong>Log loss:</strong> <span class="math-inline" data-tex="-[y\log\hat y + (1-y)\log(1-\hat y)]"></span>, ориентиры ln 2 и потеря константы.</li>
  <li><strong>Не MSE:</strong> лишний множитель σ′ глушит градиент на уверенных ошибках.</li>
  <li><strong>Граница:</strong> z = 0 — прямая; w перпендикулярен ей.</li>
  <li><strong>Градиент:</strong> <span class="math-inline" data-tex="dZ = (\hat Y - Y)/B,\ dW = X^{\top}dZ,\ db = \sum dZ"></span>.</li>
  <li><strong>Сокращение:</strong> производная log loss по Ŷ имеет в знаменателе ровно σ′.</li>
  <li><strong>Разделимые данные:</strong> минимума нет, веса растут — нужен штраф λ‖w‖².</li>
  <li><strong>Решение только итерациями:</strong> <span class="math-inline" data-tex="X^{\top}(\sigma(X\theta) - Y) = 0"></span> нелинейно.</li>
</ol>

<p>
  Одна картина на память: <code>[B × d] · [d × 1] → σ → [B × 1] → L</code> и обратно
  <code>(Ŷ − Y)/B → Xᵀ · → [d × 1]</code>. Та же цепочка в softmax-классификаторе, только столбец
  становится матрицей <code>[B × C]</code>, — и мы уже прошли её в статье про полносвязную сеть.
</p>

<div class="callout-yellow">
  <strong>Мелочи соглашений:</strong> в scikit-learn <code>LogisticRegression</code> по умолчанию включена
  L2-регуляризация с силой <code>C = 1/λ</code> (и штраф не делится на B), решатель — L-BFGS; в PyTorch
  сигмоиду и log loss объединяют в <code>BCEWithLogitsLoss</code>, которая принимает логиты — так устойчивее,
  чем <code>sigmoid</code> + <code>BCELoss</code>. Метки иногда кодируют как ±1 — тогда потеря записывается
  как <span class="math-inline" data-tex="\log(1 + e^{-y z})"></span>, но это та же функция.
</div>

<p class="tiny">
  Сквозной пример: X = [[2, 2], [3, 1], [1, 2], [4, 1]], Y = (1, 1, 0, 1), старт w = (1, −1), b = −1 — данные
  учебные. Z = (−1, 1, −2, 2), Ŷ = (0,2689; 0,7311; 0,1192; 0,8808), L = 0,4701 против ln 2 = 0,6931 и 0,5623 у
  константы 0,75; градиент (−0,6566; −0,4030; −0,25). Градиент сверен с центральными разностями при
  <span class="math-inline" data-tex="\varepsilon = 10^{-6}"></span>: 5,4 · 10<sup>−11</sup>.
  MSE поверх сигмоиды даёт градиент по логитам в 2,5–4,8 раза слабее на батче и в 202,7 раза при z = −6.
  Обучение: η = 0,5, 5000 шагов; без штрафа ‖w‖ 1,41 → 12,4 и L → 0,0023, с λ = 0,1 (штраф λ‖w‖², без смещения)
  L_λ = 0,3883, ‖w‖ = 0,92. Все числа посчитаны numpy в двойной точности и округлены при выводе.
</p>
