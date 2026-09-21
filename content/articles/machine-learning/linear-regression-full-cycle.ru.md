<style>
  .console {
    background: #1D1B17; color: #E8E4DA; border-radius: 12px;
    padding: 15px 18px; margin: 22px 0; overflow-x: auto;
    font-family: Menlo, Consolas, "Courier New", monospace;
    font-size: 13.5px; line-height: 1.6; white-space: pre;
  }
  .console .cmd { color: #8FD14F; }
  .console .chi { color: #FFD166; }
  .console-title {
    font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
    color: #5E5850; font-weight: 800; margin: 26px 0 -12px;
  }
</style>



<style>
  .lr-live-stage { border: 1px solid #E0DDD3; border-radius: 16px; padding: 20px 22px; margin: 26px 0; background: #FFFFFF; }
  .lr-live-head strong { font-size: 17px; }
  .lr-live-head p { margin: 6px 0 0; font-size: 14px; color: #5E5850; }
  .lr-live-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(210px, 1fr); gap: 22px; margin-top: 16px; align-items: start; }
  .lr-live-figure { overflow-x: auto; }
  .lr-live-figure svg, .stage-figure #lineFitSvg { width: 100%; display: block; }
  .lr-controls { display: flex; flex-direction: column; gap: 14px; }
  .lr-control label { display: flex; justify-content: space-between; font-size: 13px; color: #5E5850; margin-bottom: 6px; }
  .lr-control output { font-variant-numeric: tabular-nums; font-weight: 700; color: #111111; }
  .lr-control input[type=range] { width: 100%; accent-color: #3576C0; }
  .lr-live-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .lr-metric { border: 1px solid #E0DDD3; border-radius: 10px; padding: 8px 10px; }
  .lr-metric span { display: block; font-size: 12px; color: #5E5850; }
  .lr-metric strong { font-size: 17px; font-variant-numeric: tabular-nums; }
  .lr-live-formula { border: 1px solid #E0DDD3; border-radius: 10px; padding: 10px; text-align: center;
                     font-family: Menlo, Consolas, "Courier New", monospace; font-size: 15px; }
  .lr-live-note { font-size: 13px; color: #5E5850; margin-top: 4px; }
  @media (max-width: 820px) { .lr-live-grid { grid-template-columns: 1fr; } }
</style>




<p class="lead">
  Все модели машинного обучения — от линейной регрессии до огромных языковых моделей —
  обучаются по одному и тому же шаблону. Разберём его целиком на самой простой модели,
  где каждое число можно посчитать на калькуляторе.
</p>

<p>
  Статья самодостаточна: все формулы выводятся здесь же, из определения производной
  и правила цепочки, и ни одна не берётся готовой. Из математики нужны только производная
  сложной функции и умножение матриц. Всё остальное — арифметика, показанная целиком,
  вместе со слагаемыми, из которых сложилось каждое число.
</p>

<p>
  Порядок такой. Сначала задача и данные на плоскости, потом прямая, которую можно подвигать
  руками. Затем модель как один нейрон и она же в матричной записи. Потом прямой проход —
  в формах и в числах, обратный — на графе, в матрицах и в числах. В конце шаг спуска, карта
  размерностей, весь цикл кодом на NumPy и PyTorch и анатомия обучения, общая для всех моделей.
</p>

<div class="reading-contract">
  <div class="contract-card"><span>На входе</span><strong>Производная сложной функции и умножение матриц</strong><p>Больше ничего не нужно: остальное выводится в статье с нуля.</p></div>
  <div class="contract-card"><span>Сквозной пример</span><strong>Четыре дома из ста пятидесяти</strong><p>Один батч проходит все формулы статьи, а затем — полный прогон в 3000 шагов.</p></div>
  <div class="contract-card"><span>На выходе</span><strong>Цикл обучения целиком</strong><p>Вы сможете написать обучение на голом numpy и объяснить каждое число в его логе.</p></div>
</div>

<div class="semantic-key">
  <span>данные: признаки и цены</span>
  <span>параметры и операции</span>
  <span>то, что модель посчитала</span>
  <span>ошибка и градиенты</span>
</div>

<div class="callout-blue">
  <strong>Внутри схем работает ещё одно правило:</strong> тёмная заливка — то, что обучается
  (веса и сдвиг), светлая — то, что пересчитывается заново на каждом проходе и выбрасывается.
  Разделение на эти две группы — самое полезное, что стоит унести из первых трёх частей.
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не на всю схему
  сразу, а только на яркую часть. Расположение блоков не меняется от шага к шагу, поэтому
  переключается именно смысл, а не картинка перед глазами. Разбор каждого шага — в панели
  под схемой. Стрелки ← → на клавиатуре работают, когда сцена в фокусе.
</div>

---

## Часть 1. Какая задача перед нами

<p>
  Задача такая: у нас есть набор домов, для каждого известны площадь и возраст, а также цена,
  за которую он продан. Хочется выучить зависимость, чтобы по этим двум числам предсказывать
  цену новых домов.
</p>

<p>
  Это типичная задача регрессии — предсказание непрерывного значения. На вход модели идут
  признаки, на выходе — таргет. Ответ лежит на числовой прямой, поэтому промах измеряется
  расстоянием: ошибиться на 0,1 млн и на 3 млн — совершенно разные вещи. Это отличает
  регрессию от классификации, где ответ можно только угадать или не угадать.
</p>

<p>
  Вот как выглядят данные. Признаки приведены к удобному масштабу заранее: площадь измеряем
  десятками квадратных метров, возраст — десятками лет, цену — миллионами.
</p>

<table class="shape-table">
  <tr><th>#</th><th>Площадь, дес. м²</th><th>Возраст, дес. лет</th><th>Цена, млн</th></tr>
  <tr><td>1</td><td>4,0</td><td>2,0</td><td>4,14</td></tr>
  <tr><td>2</td><td>8,0</td><td>1,0</td><td>7,85</td></tr>
  <tr><td>3</td><td>6,0</td><td>4,0</td><td>4,90</td></tr>
  <tr><td>4</td><td>10,0</td><td>2,0</td><td>9,55</td></tr>
</table>

<div class="callout-blue">
  <strong>Почему признаки поделены на десять:</strong> чтобы числа были одного порядка.
  Площадь в квадратных метрах даёт значения около 75, возраст в годах — около 25, и признаки
  разъезжаются втрое. В части 14 видно, что это не косметика: та же скорость обучения
  на неотнормированных признаках разваливает модель за пятнадцать шагов.
</div>

<p>Посмотрим пошагово, как задача выглядит на плоскости.</p>


<div class="stage" id="stageTK" tabindex="0">
  <div class="stage-figure">
<svg id="tk" viewBox="0 0 960 592" role="img" aria-label="Постановка задачи: данные, точки, константа, остатки, MSE и лучшая прямая">
  <style>
    #tk { font-family: Helvetica, Arial, sans-serif; }
    #tk .lbl { font-size: 16px; fill: #111111; }
    #tk .cap { font-size: 13px; fill: #5E5850; }
    #tk .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #tk .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #tk .val { font-size: 14px; fill: #111111; }
    #tk .mm  { font-size: 12px; fill: #5E5850; }
    #tk .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="tk-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="tk-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="tk-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">слева — что происходит, справа — те же дома на плоскости</text>
<g data-key="c1" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Задача</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">У нас есть набор домов.</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">Для каждого известно:</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">   • площадь (в десятках м²)</text>
<text x="68" y="250" font-size="16" fill="#111111" text-anchor="start">   • цена (в миллионах)</text>
<text x="68" y="290" font-size="16" fill="#111111" text-anchor="start" font-weight="700">Хотим выучить зависимость:</text>
<text x="68" y="316" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">цена ≈ f(площадь)</text>
<text x="68" y="356" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">ФИЧА X — то, что подаём на вход</text>
<text x="68" y="382" font-size="14" fill="#5F9420" text-anchor="start" font-weight="700">ТАРГЕТ y — то, что предсказываем</text>
</g>
<g data-key="c2" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Смотрим на данные</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Каждая точка — один дом:</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">по горизонтали площадь, по вертикали цена.</text>
<text x="68" y="238" font-size="16" fill="#111111" text-anchor="start">Видна закономерность:</text>
<text x="68" y="264" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">больше площадь — выше цена.</text>
<text x="68" y="304" font-size="16" fill="#111111" text-anchor="start">Это и есть «зависимость», которую мы</text>
<text x="68" y="330" font-size="16" fill="#111111" text-anchor="start">хотим описать формулой.</text>
<text x="68" y="370" font-size="14" fill="#2A5E9B" text-anchor="start">Но какой именно формулой? И как понять,</text>
<text x="68" y="396" font-size="14" fill="#2A5E9B" text-anchor="start">что одна лучше другой?</text>
</g>
<g data-key="c3" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Самая простая модель</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Что если для любого дома предсказывать</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">одно и то же число — среднюю цену?</text>
<text x="68" y="238" font-size="17" fill="#111111" text-anchor="start" font-weight="700">ŷ = 0 · площадь + 6,378</text>
<text x="68" y="278" font-size="16" fill="#111111" text-anchor="start">Площадь при этом полностью</text>
<text x="68" y="304" font-size="16" fill="#9C0908" text-anchor="start" font-weight="700">игнорируется.</text>
<text x="68" y="344" font-size="14" fill="#5E5850" text-anchor="start">Очевидно, что это плохо.</text>
<text x="68" y="370" font-size="14" fill="#5E5850" text-anchor="start">Но как сказать, насколько именно?</text>
</g>
<g data-key="c4" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Ошибки модели</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Для каждой точки смотрим, насколько</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">модель промахнулась.</text>
<text x="68" y="238" font-size="16" fill="#111111" text-anchor="start" font-weight="700">остаток = предсказание − настоящая цена</text>
<text x="68" y="278" font-size="16" fill="#111111" text-anchor="start">Красные отрезки — расстояния от</text>
<text x="68" y="304" font-size="16" fill="#111111" text-anchor="start">настоящей цены до того, что предсказала</text>
<text x="68" y="330" font-size="16" fill="#111111" text-anchor="start">модель.</text>
<text x="68" y="370" font-size="15" fill="#9C0908" text-anchor="start" font-weight="700">Чем длиннее отрезки, тем хуже модель.</text>
</g>
<g data-key="c5" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Функция потерь: MSE</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Сводим все ошибки к одному числу —</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">среднему квадрату:</text>
<text x="68" y="238" font-size="17" fill="#111111" text-anchor="start" font-weight="700">MSE = среднее (остаток)²</text>
<text x="68" y="278" font-size="16" fill="#111111" text-anchor="start">Квадрат нужен, чтобы плюсы и минусы не</text>
<text x="68" y="304" font-size="16" fill="#111111" text-anchor="start">сократили друг друга и чтобы крупные</text>
<text x="68" y="330" font-size="16" fill="#111111" text-anchor="start">промахи стоили дороже мелких.</text>
<text x="68" y="370" font-size="15" fill="#2A5E9B" text-anchor="start" font-weight="700">Цель обучения — найти параметры,</text>
<text x="68" y="396" font-size="15" fill="#2A5E9B" text-anchor="start" font-weight="700">при которых MSE минимальна.</text>
</g>
<g data-key="c6" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#F4FAEC" stroke="#73B222" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Лучшая прямая</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Подбираем наклон и высоту так, чтобы</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">MSE стала как можно меньше.</text>
<text x="68" y="238" font-size="17" fill="#111111" text-anchor="start" font-weight="700">ŷ = 0,782 · площадь + 1,048</text>
<text x="68" y="278" font-size="16" fill="#111111" text-anchor="start">Точки не лежат на прямой идеально, но</text>
<text x="68" y="304" font-size="16" fill="#111111" text-anchor="start">красные отрезки в сумме минимально</text>
<text x="68" y="330" font-size="16" fill="#111111" text-anchor="start">возможные.</text>
<text x="68" y="370" font-size="15" fill="#5F9420" text-anchor="start" font-weight="700">Это и есть «обучение» линейной регрессии.</text>
</g>
<g data-key="c7" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Чего не хватает</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Разброс вокруг прямой — не случайность.</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">Два дома одинаковой площади стоят</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">по-разному, если один новый, а другой</text>
<text x="68" y="250" font-size="16" fill="#111111" text-anchor="start">старый.</text>
<text x="68" y="290" font-size="16" fill="#111111" text-anchor="start" font-weight="700">Добавим второй признак — возраст дома.</text>
<text x="68" y="330" font-size="15" fill="#9C0908" text-anchor="start" font-weight="700">одна площадь:  MSE 0,4213</text>
<text x="68" y="356" font-size="15" fill="#5F9420" text-anchor="start" font-weight="700">площадь и возраст:  MSE 0,1049</text>
<text x="68" y="396" font-size="14" fill="#5E5850" text-anchor="start">Дальше в статье модель двухпризнаковая.</text>
</g>
<g data-key="c8" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Как называют параметры</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">В статистике наклон и свободный член</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">пишут как β̂₁ и β̂₀.</text>
<text x="68" y="238" font-size="16" fill="#111111" text-anchor="start">В машинном обучении принята другая</text>
<text x="68" y="264" font-size="16" fill="#111111" text-anchor="start">запись: веса обозначают буквой w, а сдвиг</text>
<text x="68" y="290" font-size="16" fill="#111111" text-anchor="start">буквой b.</text>
<text x="68" y="330" font-size="18" fill="#111111" text-anchor="start" font-weight="700">ŷ = w · x + b</text>
<text x="68" y="370" font-size="16" fill="#111111" text-anchor="start">Так удобнее, когда параметров много: у</text>
<text x="68" y="396" font-size="16" fill="#111111" text-anchor="start">каждого признака свой вес w₁, w₂, …, а b</text>
<text x="68" y="422" font-size="16" fill="#111111" text-anchor="start">по-прежнему один.</text>
</g>
<g data-key="tab" data-only="1">
<text x="720" y="106" font-size="13" fill="#5E5850" text-anchor="middle">фрагмент таблицы</text>
<rect x="530" y="118" width="190" height="30" rx="8" fill="#3576C0"/>
<text x="625" y="138" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">площадь — фича X</text>
<rect x="726" y="118" width="190" height="30" rx="8" fill="#73B222"/>
<text x="821" y="138" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">цена — таргет y</text>
<rect x="530" y="154" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="173" font-size="15" fill="#111111" text-anchor="middle">3,0</text>
<text x="821" y="173" font-size="15" fill="#111111" text-anchor="middle">2,92</text>
<rect x="530" y="184" width="386" height="28" fill="#FFFFFF" stroke="#E1E5EA"/>
<text x="625" y="203" font-size="15" fill="#111111" text-anchor="middle">3,5</text>
<text x="821" y="203" font-size="15" fill="#111111" text-anchor="middle">4,24</text>
<rect x="530" y="214" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="233" font-size="15" fill="#111111" text-anchor="middle">4,0</text>
<text x="821" y="233" font-size="15" fill="#111111" text-anchor="middle">3,66</text>
<rect x="530" y="244" width="386" height="28" fill="#FFFFFF" stroke="#E1E5EA"/>
<text x="625" y="263" font-size="15" fill="#111111" text-anchor="middle">4,0</text>
<text x="821" y="263" font-size="15" fill="#111111" text-anchor="middle">4,90</text>
<rect x="530" y="274" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="293" font-size="15" fill="#111111" text-anchor="middle">4,5</text>
<text x="821" y="293" font-size="15" fill="#111111" text-anchor="middle">5,68</text>
<rect x="530" y="304" width="386" height="28" fill="#FFFFFF" stroke="#E1E5EA"/>
<text x="625" y="323" font-size="15" fill="#111111" text-anchor="middle">5,5</text>
<text x="821" y="323" font-size="15" fill="#111111" text-anchor="middle">4,60</text>
<rect x="530" y="334" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="353" font-size="15" fill="#111111" text-anchor="middle">5,5</text>
<text x="821" y="353" font-size="15" fill="#111111" text-anchor="middle">4,93</text>
<text x="720" y="386" font-size="13" fill="#5E5850" text-anchor="middle">… всего 150 строк в обучающей выборке</text>
</g>
<g data-key="pts" data-only="1">
<line x1="546" y1="420" x2="924" y2="420" stroke="#5E5850" stroke-width="1.2"/>
<line x1="546" y1="112" x2="546" y2="420" stroke="#5E5850" stroke-width="1.2"/>
<text x="735" y="458" text-anchor="middle" font-size="12" fill="#5E5850">площадь, дес. м²</text>
<text x="540" y="100" font-size="12" fill="#5E5850">цена, млн</text>
<text x="573.7" y="438" text-anchor="middle" font-size="12" fill="#5E5850">3</text>
<text x="665.9" y="438" text-anchor="middle" font-size="12" fill="#5E5850">5</text>
<text x="758.0" y="438" text-anchor="middle" font-size="12" fill="#5E5850">7</text>
<text x="850.2" y="438" text-anchor="middle" font-size="12" fill="#5E5850">9</text>
<text x="538" y="390.7" text-anchor="end" font-size="12" fill="#5E5850">3</text>
<text x="538" y="307.5" text-anchor="end" font-size="12" fill="#5E5850">5</text>
<text x="538" y="224.2" text-anchor="end" font-size="12" fill="#5E5850">7</text>
<text x="538" y="141.0" text-anchor="end" font-size="12" fill="#5E5850">9</text>
<circle cx="573.7" cy="390.0" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="596.7" cy="335.1" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="619.8" cy="359.2" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="619.8" cy="307.6" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="642.8" cy="275.2" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="688.9" cy="320.1" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="688.9" cy="306.4" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="688.9" cy="306.0" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="712.0" cy="279.7" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="735.0" cy="286.4" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="758.0" cy="201.9" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="781.1" cy="212.7" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="781.1" cy="210.6" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="804.1" cy="214.8" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="804.1" cy="207.3" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="827.2" cy="228.1" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="827.2" cy="200.2" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="827.2" cy="189.4" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="850.2" cy="148.6" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="873.3" cy="138.6" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="896.3" cy="152.8" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="896.3" cy="143.6" r="6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/>
</g>
<g data-key="cst" data-only="1">
<line x1="546.0" y1="246.1" x2="924.0" y2="246.1" stroke="#C29E08" stroke-width="2.8"/>
<text x="916" y="236.105" font-size="13" fill="#8F7406" text-anchor="end" font-weight="700">ŷ = 6,378</text>
</g>
<g data-key="rc" data-only="1">
<line x1="573.7" y1="390.0" x2="573.7" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="596.7" y1="335.1" x2="596.7" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="619.8" y1="359.2" x2="619.8" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="619.8" y1="307.6" x2="619.8" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="642.8" y1="275.2" x2="642.8" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="688.9" y1="320.1" x2="688.9" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="688.9" y1="306.4" x2="688.9" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="688.9" y1="306.0" x2="688.9" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="712.0" y1="279.7" x2="712.0" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="735.0" y1="286.4" x2="735.0" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="758.0" y1="201.9" x2="758.0" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="781.1" y1="212.7" x2="781.1" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="781.1" y1="210.6" x2="781.1" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="804.1" y1="214.8" x2="804.1" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="804.1" y1="207.3" x2="804.1" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="827.2" y1="228.1" x2="827.2" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="827.2" y1="200.2" x2="827.2" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="827.2" y1="189.4" x2="827.2" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="850.2" y1="148.6" x2="850.2" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="873.3" y1="138.6" x2="873.3" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="896.3" y1="152.8" x2="896.3" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="896.3" y1="143.6" x2="896.3" y2="246.1" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
</g>
<g data-key="mb" data-only="1">
<rect x="560" y="470" width="350" height="70" rx="14" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
<text x="735" y="496" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">MSE = 2,9968</text>
<text x="735" y="518" font-size="13" fill="#5E5850" text-anchor="middle">плохая модель: промахи большие</text>
</g>
<g data-key="fit" data-only="1">
<line x1="546.0" y1="389.8" x2="924.0" y2="122.9" stroke="#73B222" stroke-width="3"/>
<text x="916" y="123.957" font-size="13" fill="#5F9420" text-anchor="end" font-weight="700">ŷ = 0,782 x + 1,048</text>
</g>
<g data-key="rf" data-only="1">
<line x1="573.7" y1="390.0" x2="573.7" y2="370.3" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="596.7" y1="335.1" x2="596.7" y2="354.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="619.8" y1="359.2" x2="619.8" y2="337.8" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="619.8" y1="307.6" x2="619.8" y2="337.8" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="642.8" y1="275.2" x2="642.8" y2="321.5" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="688.9" y1="320.1" x2="688.9" y2="288.9" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="688.9" y1="306.4" x2="688.9" y2="288.9" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="688.9" y1="306.0" x2="688.9" y2="288.9" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="712.0" y1="279.7" x2="712.0" y2="272.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="735.0" y1="286.4" x2="735.0" y2="256.4" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="758.0" y1="201.9" x2="758.0" y2="240.1" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="781.1" y1="212.7" x2="781.1" y2="223.8" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="781.1" y1="210.6" x2="781.1" y2="223.8" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="804.1" y1="214.8" x2="804.1" y2="207.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="804.1" y1="207.3" x2="804.1" y2="207.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="827.2" y1="228.1" x2="827.2" y2="191.3" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="827.2" y1="200.2" x2="827.2" y2="191.3" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="827.2" y1="189.4" x2="827.2" y2="191.3" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="850.2" y1="148.6" x2="850.2" y2="175.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="873.3" y1="138.6" x2="873.3" y2="158.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="896.3" y1="152.8" x2="896.3" y2="142.5" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="896.3" y1="143.6" x2="896.3" y2="142.5" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
</g>
<g data-key="ms" data-only="1">
<rect x="560" y="470" width="350" height="70" rx="14" fill="#F4FAEC" stroke="#73B222" stroke-width="1.5"/>
<text x="735" y="496" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">MSE = 0,2949</text>
<text x="735" y="518" font-size="13" fill="#5E5850" text-anchor="middle">в десять раз меньше, чем у константы</text>
</g>
<g data-key="nt" data-only="1">
<rect x="520" y="470" width="420" height="70" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="730" y="496" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">ŷ = w · x + b</text>
<text x="730" y="518" font-size="13" fill="#5E5850" text-anchor="middle">w — вес признака, b — сдвиг</text>
</g>
<text x="40" y="572" class="legend" text-anchor="start">жёлтые точки — дома · жёлтая линия — константа · зелёная — обученная модель · красные отрезки — остатки</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="c1 tab mm0" data-focus="c1">
      <div class="step-kicker">Шаг 1 · данные: фичи и таргет</div>
      <h4>Что подаём на вход и что хотим предсказать</h4>
<p>Про каждый дом известно несколько чисел, и одно из них мы объявляем ответом. Площадь — фича, цена — таргет.</p>
<p>В обучающей выборке 150 таких строк. Модель увидит их все, а качество мы потом проверим на других пятидесяти.</p>
    </div>
    <div class="step-panel" data-on="c2 pts" data-focus="pts">
      <div class="step-kicker">Шаг 2 · смотрим на точки</div>
      <h4>Есть ли зависимость между площадью и ценой</h4>
<p>Каждый дом — точка. Облако вытянуто слева направо и снизу вверх: чем больше площадь, тем выше цена.</p>
<p>На картинке показаны 22 дома из 150 — чтобы точки не сливались в сплошное пятно.</p>
    </div>
    <div class="step-panel" data-on="c3 pts cst" data-focus="cst">
      <div class="step-kicker">Шаг 3 · самая простая модель</div>
      <h4>Предсказываем среднее — площадь игнорируется</h4>
<p>Возьмём модель, которая для любого дома называет одну и ту же цену: среднюю по выборке, 6,378 млн.</p>
<p>Формально это тоже линейная модель, просто с нулевым наклоном. Она заведомо плохая, и это удобно: будет с чем сравнивать.</p>
    </div>
    <div class="step-panel" data-on="c4 pts cst rc" data-focus="rc">
      <div class="step-kicker">Шаг 4 · сколько модель ошибается</div>
      <h4>Остатки — вертикальные расстояния до предсказания</h4>
<p>У маленьких домов константа завышает цену, у больших — занижает. Длина каждого красного отрезка и есть промах на этом доме.</p>
<p>Складывать остатки как есть нельзя: завышения и занижения погасят друг друга, и модель получит ноль при явно плохих предсказаниях.</p>
    </div>
    <div class="step-panel" data-on="c5 pts cst rc mb" data-focus="mb">
      <div class="step-kicker">Шаг 5 · сводим ошибки в одно число</div>
      <h4>MSE — среднее квадратов остатков</h4>
<p><div class="math-display" data-tex="L = \frac{1}{N}\sum_{n=1}^{N}(\hat y_n - y_n)^2"></div></p>
<p>На константной модели получается 2,9968. Само по себе это число ничего не значит — важно, что теперь две модели можно сравнить.</p>
    </div>
    <div class="step-panel" data-on="c6 pts fit rf ms" data-focus="fit ms">
      <div class="step-kicker">Шаг 6 · находим лучшую прямую</div>
      <h4>Минимизируем MSE по наклону и сдвигу</h4>
<p>Наклон 0,782 означает: каждые десять квадратных метров добавляют к цене 0,782 млн. Сдвиг 1,048 — базовая часть цены.</p>
<p>MSE упала с 2,9968 до 0,2949, то есть в десять раз. Красные отрезки стали короче — именно это и означает «модель обучилась».</p>
    </div>
    <div class="step-panel" data-on="c7 pts fit" data-focus="c7">
      <div class="step-kicker">Шаг 7 · чего не хватает</div>
      <h4>Одна площадь объясняет не всё</h4>
<p>Точки по-прежнему не лежат на прямой. Часть разброса — это второй признак, которого на картинке нет: возраст дома.</p>
<p>На всех 150 домах одна площадь даёт MSE 0,4213, а площадь вместе с возрастом — 0,1049. Поэтому дальше модель будет двухпризнаковой.</p>
    </div>
    <div class="step-panel" data-on="c8 pts fit nt" data-focus="c8 nt">
      <div class="step-kicker">Шаг 8 · как принято обозначать</div>
      <h4>В машинном обучении это w и b</h4>
<p>В учебниках статистики наклон и свободный член пишут как β̂₁ и β̂₀. В машинном обучении договорились иначе: параметры при признаках называют весами и обозначают w, а свободный член — сдвигом b.</p>
<p>Причина практическая: признаков бывает много, и удобно, когда у каждого свой вес с номером — w₁, w₂, w₃, — а сдвиг остаётся один. Вся дальнейшая статья написана в этих обозначениях.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> обучение — это подбор параметров модели так, чтобы одно
  число, потеря, стало как можно меньше. Данные при этом не меняются: они целиком определяют,
  чему модель вообще способна научиться.
</div>

---

## Часть 2. Прямая, остатки и MSE

<p>
  При одном признаке модель задаёт прямую. Вес управляет её наклоном, сдвиг — вертикальным
  положением. Точки данных обычно не лежат на прямой идеально, поэтому между настоящей ценой
  и предсказанием остаются вертикальные разрывы — остатки.
</p>

<p>
  Прежде чем выводить формулы, эту связь полезно почувствовать руками. Подвигайте ползунки
  и посмотрите, что происходит с отрезками и с числом внизу.
</p>



<div class="lr-live-stage" id="lineFitInteractive">
  <div class="lr-live-head"><strong>Интерактив: двигайте прямую и наблюдайте MSE</strong>
    <p>Красные пунктирные отрезки — остатки. Чем они в среднем длиннее, тем больше потеря.</p></div>
  <div class="lr-live-grid">
    <div class="lr-live-figure"><svg id="lineFitSvg" viewBox="0 0 700 420" role="img" aria-label="Точки данных, прямая и остатки"><style>#lineFitSvg { font-family: Helvetica, Arial, sans-serif; }</style></svg></div>
    <div class="lr-controls">
      <div class="lr-control"><label for="lineW">Вес w <output id="lineWOut">0,50</output></label>
        <input id="lineW" type="range" min="0" max="1.6" value="0.5" step="0.02"></div>
      <div class="lr-control"><label for="lineB">Сдвиг b <output id="lineBOut">2,00</output></label>
        <input id="lineB" type="range" min="-1" max="4" value="2" step="0.05"></div>
      <div class="lr-live-metrics">
        <div class="lr-metric"><span>MSE</span><strong id="lineLoss">—</strong></div>
        <div class="lr-metric"><span>средний остаток</span><strong id="lineMeanR">—</strong></div>
      </div>
      <div class="lr-live-formula" id="lineFormula">ŷ = 0,50 · x + 2,00</div>
      <p class="lr-live-note">Лучшее, чего можно добиться на этих 22 домах: w = 0,78, b = 1,05, MSE = 0,2949.</p>
    </div>
  </div>
</div>



<script>
(function () {
  var pts = [[3.0, 2.92], [3.5, 4.24], [4.0, 3.66], [4.0, 4.9], [4.5, 5.68], [5.5, 4.6], [5.5, 4.93], [5.5, 4.94], [6.0, 5.57], [6.5, 5.41], [7.0, 7.44], [7.5, 7.18], [7.5, 7.23], [8.0, 7.13], [8.0, 7.31], [8.5, 6.81], [8.5, 7.48], [8.5, 7.74], [9.0, 8.72], [9.5, 8.96], [10.0, 8.62], [10.0, 8.84]];
  var svg = document.getElementById('lineFitSvg');
  if (!svg) return;
  var P = {l: 64, r: 668, t: 28, b: 366, xmin: 2.4, xmax: 10.6, ymin: 2.2, ymax: 9.8};
  function sx(v) { return P.l + (v - P.xmin) / (P.xmax - P.xmin) * (P.r - P.l); }
  function sy(v) { return P.b - (v - P.ymin) / (P.ymax - P.ymin) * (P.b - P.t); }
  function el(n, a) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (var k in a) e.setAttribute(k, a[k]);
    return e;
  }
  function label(x, y, t, anchor) {
    var e = el('text', {x: x, y: y, 'font-size': 12, fill: '#5E5850'});
    if (anchor) e.setAttribute('text-anchor', anchor);
    e.textContent = t;
    return e;
  }
  function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
  function draw(w, b) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 700, height: 420, fill: '#ffffff'}));
    for (var i = 3; i <= 10; i++) {
      svg.appendChild(el('line', {x1: sx(i), y1: P.t, x2: sx(i), y2: P.b, stroke: '#ECECEC', 'stroke-width': 1}));
      svg.appendChild(label(sx(i), P.b + 20, i, 'middle'));
    }
    for (var j = 3; j <= 9; j++) {
      svg.appendChild(el('line', {x1: P.l, y1: sy(j), x2: P.r, y2: sy(j), stroke: '#ECECEC', 'stroke-width': 1}));
      svg.appendChild(label(P.l - 10, sy(j) + 4, j, 'end'));
    }
    svg.appendChild(el('line', {x1: P.l, y1: P.b, x2: P.r, y2: P.b, stroke: '#5E5850', 'stroke-width': 1.2}));
    svg.appendChild(el('line', {x1: P.l, y1: P.t, x2: P.l, y2: P.b, stroke: '#5E5850', 'stroke-width': 1.2}));
    svg.appendChild(label(P.r, P.b + 40, 'площадь, дес. м²', 'end'));
    svg.appendChild(label(P.l - 6, P.t - 10, 'цена, млн'));
    svg.appendChild(el('line', {x1: sx(P.xmin), y1: sy(w * P.xmin + b), x2: sx(P.xmax), y2: sy(w * P.xmax + b),
                                stroke: '#73B222', 'stroke-width': 3}));
    pts.forEach(function (p) {
      var pred = w * p[0] + b;
      svg.appendChild(el('line', {x1: sx(p[0]), y1: sy(p[1]), x2: sx(p[0]), y2: sy(pred),
                                  stroke: '#C30B0A', 'stroke-width': 1.7, 'stroke-dasharray': '3 3', opacity: 0.85}));
      svg.appendChild(el('circle', {cx: sx(p[0]), cy: sy(p[1]), r: 5.5, fill: '#C29E08',
                                    stroke: '#ffffff', 'stroke-width': 1.2}));
    });
  }
  function update() {
    var w = +document.getElementById('lineW').value;
    var b = +document.getElementById('lineB').value;
    var sum = 0, mean = 0;
    pts.forEach(function (p) { var r = w * p[0] + b - p[1]; sum += r * r; mean += r; });
    sum /= pts.length; mean /= pts.length;
    document.getElementById('lineWOut').textContent = fmt(w, 2);
    document.getElementById('lineBOut').textContent = fmt(b, 2);
    document.getElementById('lineLoss').textContent = fmt(sum, 4);
    document.getElementById('lineMeanR').textContent = fmt(mean, 3);
    document.getElementById('lineFormula').textContent = 'ŷ = ' + fmt(w, 2) + ' · x ' + (b >= 0 ? '+ ' : '− ') + fmt(Math.abs(b), 2);
    draw(w, b);
  }
  document.getElementById('lineW').addEventListener('input', update);
  document.getElementById('lineB').addEventListener('input', update);
  update();
})();
</script>


<p>
  Обратите внимание на вторую метрику. Средний остаток можно загнать в ноль плохой прямой:
  достаточно, чтобы завышения уравновесили занижения. MSE так обмануть нельзя — она видит
  каждый промах по отдельности.
</p>

### Почему именно квадрат ошибки

<table class="shape-table">
  <tr><th>Шаг</th><th>Что делает</th></tr>
  <tr><td>Остаток</td><td>сохраняет знак: модель выше или ниже настоящей цены</td></tr>
  <tr><td>Квадрат</td><td>делает вклад неотрицательным и сильнее штрафует крупные промахи</td></tr>
  <tr><td>Среднее</td><td>возвращает один скаляр, сопоставимый между батчами разного размера</td></tr>
</table>

<div class="math-display" data-tex="\ell = (\hat y - y)^2"></div>

<div class="callout-blue">
  <strong>Почему квадрат, а не модуль:</strong> из-за формы штрафа. Производная модуля равна
  <span class="math-inline" data-tex="\pm 1"></span> при любом остатке — и грубый промах,
  и мелкий тянут параметры с одинаковой силой. У квадрата производная равна
  <span class="math-inline" data-tex="2r"></span>: она сама подстраивается под размер ошибки,
  а вблизи минимума становится маленькой и позволяет спуску остановиться. Платить за это
  приходится чувствительностью к выбросам — один дом с опечаткой в цене перетянет прямую на себя.
</div>

<div class="callout-yellow">
  <strong>MSE и RMSE — не одно и то же.</strong> RMSE равен корню из MSE и измеряется в тех же
  единицах, что и таргет: при MSE 0,2949 типичный промах составляет 0,54 млн. Для интерпретации
  удобнее RMSE, а для вывода градиентов — MSE, потому что корень только усложнил бы производную.
</div>

### Как принято обозначать параметры

<p>
  В учебниках статистики наклон и свободный член пишут как
  <span class="math-inline" data-tex="\hat\beta_1"></span> и
  <span class="math-inline" data-tex="\hat\beta_0"></span>. В машинном обучении договорились
  иначе: параметры при признаках называют весами и обозначают
  <span class="math-inline" data-tex="w"></span>, а свободный член — сдвигом
  <span class="math-inline" data-tex="b"></span> (от bias).
</p>

<div class="math-display" data-tex="\hat y = \hat\beta_1 x + \hat\beta_0 \qquad\Longleftrightarrow\qquad \hat y = wx + b"></div>

<p>
  Причина практическая. Признаков бывает много, и удобно, когда у каждого свой вес с номером —
  <span class="math-inline" data-tex="w_1, w_2, \dots, w_P"></span>, — а сдвиг остаётся один
  на всю модель. В таком виде веса естественно собираются в столбец
  <span class="math-inline" data-tex="\mathbf{w}"></span>, и вся запись становится матричной.
  Дальше в статье используются только <span class="math-inline" data-tex="w"></span> и
  <span class="math-inline" data-tex="b"></span>.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> обучение — это подбор двух чисел так, чтобы сумма
  квадратов вертикальных отрезков стала минимальной. Всё остальное в статье — способ находить
  эти числа не вручную и не для двух параметров, а для любого их количества.
</div>

---

## Часть 3. Модель как один нейрон

<p>
  Простейшая модель — линейная: предположим, что цена складывается из вклада площади, вклада
  возраста и какой-то базовой величины. У такой модели три параметра, и задача обучения —
  подобрать их так, чтобы предсказания как можно лучше ложились на настоящие цены.
</p>

<p>
  Нарисовать её удобно как один нейрон: два входа, у каждого свой вес, всё сходится в сумматор,
  снизу к нему подмешивается сдвиг, справа выходит предсказание. Ровно эта картинка потом
  повторится в нейросети — там таких нейронов будут тысячи, но устроен каждый одинаково.
</p>

<div class="callout-blue">
  <strong>Что означает знак веса:</strong> положительный вес говорит, что признак повышает цену,
  отрицательный — что понижает. У возраста вес будет отрицательным, и это не подгонка,
  а то, что модель обнаружит сама.
</div>

<p>Посмотрим пошагово, что происходит с одним домом внутри модели.</p>


<div class="stage" id="stageNN" tabindex="0">
  <div class="stage-figure">
<svg id="nn" viewBox="0 0 960 500" role="img" aria-label="Модель как один нейрон: два входа, два веса, сдвиг и выход">
  <style>
    #nn { font-family: Helvetica, Arial, sans-serif; }
    #nn .lbl { font-size: 16px; fill: #111111; }
    #nn .cap { font-size: 13px; fill: #5E5850; }
    #nn .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #nn .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #nn .val { font-size: 14px; fill: #111111; }
    #nn .mm  { font-size: 12px; fill: #5E5850; }
    #nn .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="nn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="nn-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="nn-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">один дом проходит модель слева направо</text>
<g data-key="inp">
<circle cx="120" cy="150" r="38" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="1.8"/>
<text x="120" y="155.667" text-anchor="middle" font-size="17" fill="#111111">x₁</text>
<circle cx="120" cy="300" r="38" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="1.8"/>
<text x="120" y="305.667" text-anchor="middle" font-size="17" fill="#111111">x₂</text>
<text x="120" y="100" class="cap" text-anchor="middle">площадь</text>
<text x="120" y="358" class="cap" text-anchor="middle">возраст</text>
</g>
<g data-key="wts">
<line x1="158" y1="165" x2="382" y2="205" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
<line x1="158" y1="285" x2="382" y2="245" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
<text x="262" y="168" text-anchor="middle" font-size="16" fill="#C29E08">w₁</text>
<text x="262" y="290" text-anchor="middle" font-size="16" fill="#C29E08">w₂</text>
</g>
<g data-key="bias">
<circle cx="430" cy="378" r="28" fill="#C29E08" fill-opacity="0.85" stroke="#C29E08" stroke-width="1.8"/>
<text x="430" y="383.333" text-anchor="middle" font-size="16" fill="#FFFFFF">b</text>
<line x1="430" y1="348" x2="430" y2="274" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
</g>
<g data-key="z">
<circle cx="430" cy="225" r="44" fill="#73B222" fill-opacity="0.45" stroke="#73B222" stroke-width="1.8"/>
<text x="430" y="230.667" text-anchor="middle" font-size="17" fill="#111111">z</text>
<text x="430" y="158" class="cap" text-anchor="middle">сумматор</text>
</g>
<g data-key="yh">
<line x1="476" y1="225" x2="618" y2="225" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
<text x="547" y="214" class="cap" text-anchor="middle">ŷ = z</text>
<circle cx="658" cy="225" r="38" fill="#73B222" fill-opacity="0.45" stroke="#73B222" stroke-width="1.8"/>
<text x="658" y="230.667" text-anchor="middle" font-size="17" fill="#111111">ŷ</text>
<text x="658" y="158" class="cap" text-anchor="middle">предсказание</text>
</g>
<g data-key="cmp" data-only="1">
<circle cx="658" cy="380" r="34" fill="#3576C0" fill-opacity="0.3" stroke="#3576C0" stroke-width="1.8"/>
<text x="658" y="385.667" text-anchor="middle" font-size="17" fill="#111111">y</text>
<text x="658" y="434" class="cap" text-anchor="middle">настоящая цена</text>
<line x1="658" y1="340" x2="658" y2="268" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
<rect x="770" y="250" width="160" height="76" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.7"/>
<text x="850" y="284" text-anchor="middle" font-size="16" fill="#111111">ℓ = (ŷ − y)²</text>
<text x="850" y="308" class="cap" text-anchor="middle">промах в квадрате</text>
<line x1="698" y1="245" x2="764" y2="274" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
</g>
<text x="40" y="486" class="legend" text-anchor="start">синее — данные · жёлтое — обучаемые числа · зелёное — то, что модель посчитала</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="inp mm0" data-focus="inp">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>Квартира — это два числа</h4>
<p><b>1) x₁, x₂ — вход.</b> Площадь в десятках квадратных метров и возраст дома в десятках лет. Больше модель о доме ничего не знает.</p>
<p>Эти два числа приходят извне и при обучении не меняются.</p>
    </div>
    <div class="step-panel" data-on="inp wts mm1" data-focus="wts">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>У каждого входа свой множитель</h4>
<p><b>2) w₁, w₂ — веса.</b> По одному на признак: сколько миллионов добавляют десять квадратных метров и сколько отнимают десять лет возраста.</p>
<p>Это первые два из тех чисел, которые модель будет подбирать.</p>
    </div>
    <div class="step-panel" data-on="inp wts z mm1" data-focus="z">
      <div class="step-kicker">Шаг 3 · взвешенная сумма</div>
      <h4>Складываем произведения</h4>
<p><b>3) z = x₁·w₁ + x₂·w₂.</b> Каждый признак умножается на свой вес, результаты складываются. Никаких перекрёстных произведений нет: вес площади встречается только с площадью.</p>
<p><div class="math-display" data-tex="z = x_1 w_1 + x_2 w_2"></div></p>
    </div>
    <div class="step-panel" data-on="inp wts z bias mm1" data-focus="bias">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4>Одно число, не привязанное ни к какому признаку</h4>
<p><b>3) … + b.</b> Сдвиг поднимает или опускает предсказание целиком. Без него прямая была бы обязана проходить через ноль: дом нулевой площади стоил бы ноль.</p>
<p><div class="math-display" data-tex="z = x_1 w_1 + x_2 w_2 + b"></div></p>
    </div>
    <div class="step-panel" data-on="inp wts z bias yh mm2" data-focus="yh">
      <div class="step-kicker">Шаг 5 · выход</div>
      <h4>В линейной регрессии выход равен сумматору</h4>
<p><b>4) z → ŷ.</b> У логистической регрессии здесь стояла бы сигмоида, у нейрона — ReLU. У линейной регрессии не стоит ничего: предсказание — это и есть z.</p>
<p><div class="math-display" data-tex="\hat y = z = x_1 w_1 + x_2 w_2 + b"></div></p>
    </div>
    <div class="step-panel" data-on="inp wts z bias yh cmp mm3 mm4" data-focus="cmp">
      <div class="step-kicker">Шаг 6 · промах</div>
      <h4>Сравниваем с настоящей ценой</h4>
<p>Настоящая цена в обучении известна. Разность между предсказанием и правдой возводится в квадрат — так знак промаха перестаёт мешать, а крупные ошибки становятся дороже мелких.</p>
<p><div class="math-display" data-tex="\ell = (\hat y - y)^2"></div></p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> модель — это два веса и сдвиг плюс правило, как их
  применить к признакам. Данные приходят извне и не меняются, предсказание рождается заново
  на каждом проходе, а между ними живут три числа — и обучение состоит ровно в том,
  чтобы их подобрать.
</div>

---

## Часть 4. Переходим к матричной записи

<p>
  Запись <span class="math-inline" data-tex="z = x_1w_1 + x_2w_2 + b"></span> честная, но у неё
  есть предел применимости: она годится, пока признаков два-три. При тридцати такую строку уже
  не написать, а при тысяче формула перестаёт что-либо сообщать.
</p>

<p>
  Матричная запись решает ровно эту проблему. Признаки складываются в строку, веса — в столбец,
  и вместо суммы с индексами появляется одно произведение, которое выглядит одинаково при двух
  признаках и при тысяче.
</p>

<div class="callout-blue">
  <strong>Что означает «сокращение размерностей»:</strong> в произведении
  <span class="math-inline" data-tex="[1\times 2]\cdot[2\times 1]"></span> внутренние числа
  обязаны совпасть, а внешние дают форму результата — <span class="math-inline" data-tex="[1\times 1]"></span>.
  Двойка — это число признаков, и она исчезает: после умножения от дома остаётся одно число.
</div>

<p>Посмотрим пошагово, как сумма по индексам превращается в произведение матриц.</p>


<div class="stage" id="stageMX" tabindex="0">
  <div class="stage-figure">
<svg id="mx" viewBox="0 0 960 520" role="img" aria-label="Переход от записи по индексам к матричной">
  <style>
    #mx { font-family: Helvetica, Arial, sans-serif; }
    #mx .lbl { font-size: 16px; fill: #111111; }
    #mx .cap { font-size: 13px; fill: #5E5850; }
    #mx .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #mx .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #mx .val { font-size: 14px; fill: #111111; }
    #mx .mm  { font-size: 12px; fill: #5E5850; }
    #mx .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="mx-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="mx-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="mx-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">та же сумма, записанная так, чтобы не удлиняться с ростом числа признаков</text>
<g data-key="nrn">
<circle cx="90" cy="140" r="30" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="1.8"/>
<text x="90" y="145" text-anchor="middle" font-size="15" fill="#111111">x₁</text>
<circle cx="90" cy="250" r="30" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="1.8"/>
<text x="90" y="255" text-anchor="middle" font-size="15" fill="#111111">x₂</text>
<line x1="120" y1="152" x2="214" y2="185" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#mx-arw)"/>
<line x1="120" y1="238" x2="214" y2="205" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#mx-arw)"/>
<text x="167" y="158" text-anchor="middle" font-size="14" fill="#C29E08">w₁</text>
<text x="167" y="248" text-anchor="middle" font-size="14" fill="#C29E08">w₂</text>
<circle cx="246" cy="195" r="32" fill="#73B222" fill-opacity="0.45" stroke="#73B222" stroke-width="1.8"/>
<text x="246" y="200" text-anchor="middle" font-size="15" fill="#111111">z</text>
<circle cx="246" cy="300" r="22" fill="#C29E08" fill-opacity="0.85" stroke="#C29E08" stroke-width="1.8"/>
<text x="246" y="304.333" text-anchor="middle" font-size="13" fill="#FFFFFF">b</text>
<line x1="246" y1="278" x2="246" y2="233" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#mx-arw)"/>
<text x="168" y="348" class="cap" text-anchor="middle">запись по индексам</text>
</g>
<g data-key="row">
<rect x="400" y="112" width="120" height="44" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="460.0" y1="112" x2="460.0" y2="156" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="460" y="100" text-anchor="middle" font-size="13" fill="#111111">1 × 2</text>
<text x="460" y="180" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">x</text>
<text x="460" y="86" class="cap" text-anchor="middle">признаки в строку</text>
</g>
<g data-key="col">
<rect x="580" y="100" width="46" height="88" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="580" y1="144.0" x2="626" y2="144.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="603" y="88" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="603" y="212" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="mul" data-only="1">
<text x="552" y="140" class="lbl" text-anchor="middle">·</text>
<text x="654" y="140" class="lbl" text-anchor="middle">+</text>
<rect x="676" y="112" width="44" height="44" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<text x="698" y="180" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
<text x="746" y="140" class="lbl" text-anchor="middle">=</text>
<rect x="768" y="112" width="44" height="44" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<text x="790" y="100" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="790" y="180" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">z</text>
<text x="600" y="232" class="cap" text-anchor="middle">[1 × 2] · [2 × 1] = [1 × 1] — внутренние двойки сокращаются</text>
</g>
<g data-key="bat" data-only="1">
<rect x="400" y="300" width="120" height="96" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="460.0" y1="300" x2="460.0" y2="396" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="400" y1="324.0" x2="520" y2="324.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="400" y1="348.0" x2="520" y2="348.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="400" y1="372.0" x2="520" y2="372.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="460" y="288" text-anchor="middle" font-size="13" fill="#111111">4 × 2</text>
<text x="460" y="420" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">X</text>
<text x="538" y="354" class="lbl" text-anchor="middle">·</text>
<rect x="556" y="322" width="44" height="52" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="556" y1="348.0" x2="600" y2="348.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="578" y="310" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="578" y="398" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
<text x="620" y="354" class="lbl" text-anchor="middle">+</text>
<rect x="638" y="336" width="44" height="26" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<text x="660" y="386" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
<text x="702" y="354" class="lbl" text-anchor="middle">=</text>
<rect x="722" y="300" width="44" height="96" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="722" y1="324.0" x2="766" y2="324.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="722" y1="348.0" x2="766" y2="348.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="722" y1="372.0" x2="766" y2="372.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="744" y="288" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="744" y="420" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
<text x="838" y="340" class="cap" text-anchor="middle">весь батч</text>
<text x="838" y="364" class="cap" text-anchor="middle">одной строкой</text>
</g>
<text x="40" y="496" class="legend" text-anchor="start">синее — данные · тёмно-жёлтое — обучаемые числа · зелёное — результат</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="nrn mm1" data-focus="nrn">
      <div class="step-kicker">Шаг 1 · что не так с записью по индексам</div>
      <h4>Она растёт вместе с числом признаков</h4>
<p>При двух признаках сумму видно целиком. При тридцати её приходится обрывать многоточием, при тысяче формула перестаёт что-либо сообщать.</p>
<p><div class="math-display" data-tex="z = x_1w_1 + x_2w_2 + \dots + x_Pw_P + b"></div></p>
    </div>
    <div class="step-panel" data-on="nrn row mm1" data-focus="row">
      <div class="step-kicker">Шаг 2 · признаки в строку</div>
      <h4>Один объект — строка из P чисел</h4>
<p><b>1) x = [x₁ x₂].</b> Порядок фиксируется раз и навсегда: первое число всегда площадь, второе всегда возраст.</p>
<p><div class="math-display" data-tex="\mathbf{x} \in \mathbb{R}^{1\times 2}"></div></p>
    </div>
    <div class="step-panel" data-on="nrn row col mm1" data-focus="col">
      <div class="step-kicker">Шаг 3 · веса в столбец</div>
      <h4>Тот же порядок, что у признаков</h4>
<p><b>2) w = [w₁; w₂].</b> Первая строка столбца — вес площади, вторая — вес возраста. Именно это соответствие превращает сумму в одну операцию.</p>
<p><div class="math-display" data-tex="\mathbf{w} \in \mathbb{R}^{2\times 1}"></div></p>
    </div>
    <div class="step-panel" data-on="row col mul mm1 mm2" data-focus="mul">
      <div class="step-kicker">Шаг 4 · строка на столбец</div>
      <h4>Внутренние размеры совпали</h4>
<p><b>3) z = x·w + b.</b> Строка проходит по столбцу: элементы с одинаковым номером перемножаются, результаты складываются. Это ровно та же сумма, что была на шаге 1.</p>
<p><div class="math-display" data-tex="\mathbf{x}\mathbf{w} + b = \sum_{p=1}^{P} x_p w_p + b"></div></p>
<p>Форма результата — 1 × 1, то есть обычное число. Запись не изменится ни при десяти признаках, ни при тысяче: изменится только цифра в размерности.</p>
    </div>
    <div class="step-panel" data-on="mul bat mm2" data-focus="bat">
      <div class="step-kicker">Шаг 5 · весь батч сразу</div>
      <h4>Строки складываются друг под друга</h4>
<p>Если поставить дома строками в матрицу X, та же операция сделает все предсказания за один раз. Столбец весов при этом остаётся один — модель общая для всех домов.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} = X\mathbf{w} + b \qquad [4\times 2]\cdot[2\times 1] \rightarrow [4\times 1]"></div></p>
    </div>
    <div class="step-panel" data-on="bat mm2" data-focus="bat">
      <div class="step-kicker">Шаг 6 · зачем это нужно</div>
      <h4>Одна строка кода вместо цикла</h4>
<p>В коде это буквально <code>X @ w + b</code> — без единого цикла по объектам и без индексов. Библиотеки линейной алгебры выполняют такое умножение на порядки быстрее, чем цикл на Python.</p>
<p>И главное: дальше в статье все формулы — и прямого прохода, и обратного — будут записаны в этой форме. Индексы больше не понадобятся.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> матричная запись — это соглашение о формах, а не новая
  математика. Она считает ту же сумму, но не удлиняется с ростом числа признаков и позволяет
  обработать весь батч без единого цикла. Дальше в статье все формулы записаны именно так.
</div>

---

## Часть 5. Прямой проход одного объекта

<p>
  Дальше две части подряд без единого числа. Это сделано намеренно: пока в клетках стоят
  символы, видно устройство операции, а не арифметика. Числа подставим в части 7, по той же
  схеме и в том же порядке.
</p>

<p>
  Начнём с одного дома. На входе строка из двух чисел и столбец той же длины, на выходе — одна
  клетка. Вся операция целиком укладывается в правило «строка идёт по столбцу».
</p>

<p>Посмотрим пошагово, как строка признаков превращается в одно число.</p>


<div class="stage" id="stageF1" tabindex="0">
  <div class="stage-figure">
<svg id="f1" viewBox="0 0 960 470" role="img" aria-label="Прямой проход одного объекта в формах">
  <style>
    #f1 { font-family: Helvetica, Arial, sans-serif; }
    #f1 .lbl { font-size: 16px; fill: #111111; }
    #f1 .cap { font-size: 13px; fill: #5E5850; }
    #f1 .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #f1 .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #f1 .val { font-size: 14px; fill: #111111; }
    #f1 .mm  { font-size: 12px; fill: #5E5850; }
    #f1 .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="f1-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="f1-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="f1-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">формы и формулы · чисел здесь нет, они будут в части 6</text>
<g data-key="x">
<rect x="60" y="130" width="130" height="46" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="125.0" y1="130" x2="125.0" y2="176" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="125" y="118" text-anchor="middle" font-size="13" fill="#111111">1 × 2</text>
<text x="125" y="200" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">x</text>
</g>
<g data-key="w">
<text x="212" y="160" class="lbl" text-anchor="middle">·</text>
<rect x="234" y="108" width="46" height="90" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="234" y1="153.0" x2="280" y2="153.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="257" y="96" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="257" y="222" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="bb">
<text x="306" y="160" class="lbl" text-anchor="middle">+</text>
<rect x="328" y="130" width="46" height="46" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<text x="351" y="200" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
</g>
<g data-key="z">
<text x="400" y="160" class="lbl" text-anchor="middle">=</text>
<rect x="422" y="130" width="46" height="46" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<text x="445" y="118" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="445" y="200" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
</g>
<g data-key="cell" data-only="1">
<rect x="60" y="130.0" width="130" height="46.0" fill="#C30B0A" opacity="0.12"/>
<rect x="60" y="130.0" width="130" height="46.0" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="234.0" y="108" width="46.0" height="90" fill="#C30B0A" opacity="0.12"/>
<rect x="234.0" y="108" width="46.0" height="90" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="422.0" y="130.0" width="46.0" height="46.0" fill="#C30B0A" opacity="0.14"/>
<rect x="422.0" y="130.0" width="46.0" height="46.0" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<text x="264" y="232" class="cap" text-anchor="middle">малиновым — строка, столбец и клетка, которая из них получается</text>
</g>
<g data-key="cmp" data-only="1">
<text x="500" y="160" class="lbl" text-anchor="middle">−</text>
<rect x="522" y="130" width="46" height="46" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<text x="545" y="118" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="545" y="200" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">y</text>
<text x="600" y="160" class="lbl" text-anchor="middle">=</text>
<rect x="622" y="130" width="46" height="46" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/>
<text x="645" y="118" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="645" y="200" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">r</text>
<line x1="676" y1="153" x2="716" y2="153" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#f1-arr)"/>
<rect x="730" y="128" width="170" height="62" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="815" y="159" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">ℓ = r²</text>
<text x="815" y="181" class="cap" text-anchor="middle">одно число</text>
</g>
<g data-key="shp" data-only="1">
<rect x="60" y="280" width="840" height="128" rx="12" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/>
<text x="78" y="306" class="cap" text-anchor="start">ПРАВИЛО ФОРМ</text>
<text x="78" y="336" class="val" text-anchor="start">внутренние размеры обязаны совпасть и сокращаются, внешние дают форму результата</text>
<text x="78" y="364" class="val" text-anchor="start">[1 × 2] · [2 × 1] = [1 × 1]        сложение и вычитание форму не меняют</text>
<text x="78" y="392" class="val" text-anchor="start">при P признаках вместо двойки стоит P — и больше ничего не меняется</text>
</g>
<text x="40" y="456" class="legend" text-anchor="start">синее — данные · тёмно-жёлтое — обучаемые числа · зелёное — результат · красное — ошибка</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="x mm0" data-focus="x">
      <div class="step-kicker">Шаг 1 · один объект</div>
      <h4>Строка из двух чисел</h4>
<p>Один дом лежит строкой: сначала площадь, потом возраст. Форма — 1 × 2.</p>
<p><div class="math-display" data-tex="\mathbf{x} \in \mathbb{R}^{1\times 2}"></div></p>
    </div>
    <div class="step-panel" data-on="x w mm1" data-focus="w">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>Столбец той же длины</h4>
<p>Веса живут отдельно от данных: они одни и те же для всех домов и меняются только во время обучения. Тёмная заливка на схемах означает ровно это.</p>
<p><div class="math-display" data-tex="\mathbf{w} \in \mathbb{R}^{2\times 1}"></div></p>
    </div>
    <div class="step-panel" data-on="x w z cell mm2" data-focus="cell">
      <div class="step-kicker">Шаг 3 · строка на столбец</div>
      <h4>Два произведения складываются в одну клетку</h4>
<p>Внутренние двойки встречаются и сокращаются, остаётся [1 × 1]. Двойка — это число признаков, и после умножения от дома остаётся одно число.</p>
<p><div class="math-display" data-tex="\mathbf{x}\mathbf{w} = x_1w_1 + x_2w_2 \qquad [1\times 2]\cdot[2\times 1] \rightarrow [1\times 1]"></div></p>
    </div>
    <div class="step-panel" data-on="x w bb z mm2" data-focus="bb z">
      <div class="step-kicker">Шаг 4 · сдвиг и ответ</div>
      <h4>Bias прибавляется к готовому числу</h4>
<p>Сдвиг не связан ни с одним признаком: он поднимает или опускает предсказание целиком. На этом прямой проход линейной регрессии заканчивается.</p>
<p><div class="math-display" data-tex="\hat y = \mathbf{x}\mathbf{w} + b"></div></p>
    </div>
    <div class="step-panel" data-on="z cmp mm3 mm4" data-focus="cmp">
      <div class="step-kicker">Шаг 5 · промах</div>
      <h4>Вычитание и квадрат форму не меняют</h4>
<p>Настоящая цена — тоже одно число, поэтому вычитание идёт клетка в клетку. Квадрат убирает знак: и завышение, и занижение штрафуются одинаково.</p>
<p><div class="math-display" data-tex="r = \hat y - y, \qquad \ell = r^2"></div></p>
    </div>
    <div class="step-panel" data-on="x w z shp" data-focus="shp">
      <div class="step-kicker">Шаг 6 · что отсюда следует</div>
      <h4>Форма ответа не зависит от числа признаков</h4>
<p>Сколько бы столбцов ни было в таблице, произведение строки на столбец даёт одну клетку. Поэтому одна и та же строка кода работает и для двух признаков, и для двухсот.</p>
<p>Проверка форм — самая дешёвая диагностика: почти все ошибки в коде линейной модели это перепутанные размерности, и ловятся они на бумаге за минуту.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<table class="shape-table">
  <tr><th>Обозначение</th><th>Что это</th><th>Форма</th><th>В примере</th></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf{x}"></span></td><td>признаки одного дома</td><td><span class="math-inline" data-tex="1\times P"></span></td><td>1 × 2</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf{w}"></span></td><td>по одному весу на признак</td><td><span class="math-inline" data-tex="P\times 1"></span></td><td>2 × 1</td></tr>
  <tr><td><span class="math-inline" data-tex="b"></span></td><td>сдвиг</td><td>число</td><td>1 × 1</td></tr>
  <tr><td><span class="math-inline" data-tex="\hat y = \mathbf{x}\mathbf{w} + b"></span></td><td>предсказание</td><td>число</td><td>1 × 1</td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> форма ответа не зависит от числа признаков. Сколько бы
  столбцов ни было в таблице, произведение строки на столбец даёт одну клетку — поэтому одна
  и та же строка кода работает и для двух признаков, и для двухсот.
</div>

---

## Часть 6. Прямой проход батча

<p>
  Считать дома по одному незачем: та же операция выполняется для всех строк сразу. Матрица
  <span class="math-inline" data-tex="X"></span> просто складывает объекты друг под друга,
  веса остаются те же самые, и на выходе получается столбец предсказаний той же высоты,
  что и батч.
</p>

<p>
  Заодно доведём цепочку до конца: вычтем настоящие цены и свернём остатки в одно число.
  Потеря — часть прямого прохода, а не отдельная процедура.
</p>

<div class="callout-blue">
  <strong>Где формы не совпадают буквально:</strong> сдвиг — одно число, а прибавляем мы его
  к столбцу <span class="math-inline" data-tex="N\times 1"></span>. Оно размножается по всем
  строкам, и в numpy это делает broadcasting. Место стоит запомнить: на обратном проходе
  размножение обернётся суммированием, и это единственная неочевидная деталь во всём выводе.
</div>

<p>Посмотрим пошагово, как батч превращается в потерю.</p>


<div class="stage" id="stageFB" tabindex="0">
  <div class="stage-figure">
<svg id="fb" viewBox="0 0 960 490" role="img" aria-label="Прямой проход батча в формах">
  <style>
    #fb { font-family: Helvetica, Arial, sans-serif; }
    #fb .lbl { font-size: 16px; fill: #111111; }
    #fb .cap { font-size: 13px; fill: #5E5850; }
    #fb .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #fb .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #fb .val { font-size: 14px; fill: #111111; }
    #fb .mm  { font-size: 12px; fill: #5E5850; }
    #fb .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="fb-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="fb-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="fb-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">та же операция для всех четырёх домов сразу</text>
<g data-key="X">
<rect x="40" y="120" width="110" height="140" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="95.0" y1="120" x2="95.0" y2="260" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="155.0" x2="150" y2="155.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="190.0" x2="150" y2="190.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="225.0" x2="150" y2="225.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="95" y="108" text-anchor="middle" font-size="13" fill="#111111">4 × 2</text>
<text x="95" y="284" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">X</text>
</g>
<g data-key="w">
<text x="168" y="196" class="lbl" text-anchor="middle">·</text>
<rect x="188" y="155" width="46" height="70" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="188" y1="190.0" x2="234" y2="190.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="211" y="143" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="211" y="249" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="bb">
<text x="256" y="196" class="lbl" text-anchor="middle">+</text>
<rect x="276" y="173" width="46" height="34" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<text x="299" y="231" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
</g>
<g data-key="yh">
<text x="344" y="196" class="lbl" text-anchor="middle">=</text>
<rect x="364" y="120" width="46" height="140" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="364" y1="155.0" x2="410" y2="155.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="364" y1="190.0" x2="410" y2="190.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="364" y1="225.0" x2="410" y2="225.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="387" y="108" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="387" y="284" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
</g>
<g data-key="y">
<text x="432" y="196" class="lbl" text-anchor="middle">−</text>
<rect x="452" y="120" width="46" height="140" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="452" y1="155.0" x2="498" y2="155.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="452" y1="190.0" x2="498" y2="190.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="452" y1="225.0" x2="498" y2="225.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="475" y="108" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="475" y="284" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">y</text>
</g>
<g data-key="r">
<text x="520" y="196" class="lbl" text-anchor="middle">=</text>
<rect x="540" y="120" width="46" height="140" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/>
<line x1="540" y1="155.0" x2="586" y2="155.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="540" y1="190.0" x2="586" y2="190.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="540" y1="225.0" x2="586" y2="225.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="563" y="108" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="563" y="284" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">r</text>
</g>
<g data-key="L">
<line x1="594" y1="190" x2="646" y2="190" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#fb-arr)"/>
<rect x="660" y="158" width="190" height="66" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="755" y="191" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">L</text>
<text x="755" y="213" class="cap" text-anchor="middle">среднее квадратов</text>
</g>
<g data-key="row" data-only="1">
<rect x="40" y="155.0" width="110" height="35.0" fill="#C30B0A" opacity="0.12"/>
<rect x="40" y="155.0" width="110" height="35.0" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="188.0" y="155" width="46.0" height="70" fill="#C30B0A" opacity="0.12"/>
<rect x="188.0" y="155" width="46.0" height="70" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="364.0" y="155.0" width="46.0" height="35.0" fill="#C30B0A" opacity="0.14"/>
<rect x="364.0" y="155.0" width="46.0" height="35.0" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<text x="220" y="300" class="cap" text-anchor="middle">вторая строка X встречается с тем же столбцом w</text>
</g>
<g data-key="note" data-only="1">
<rect x="60" y="330" width="840" height="96" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="78" y="356" class="cap" text-anchor="start">ГДЕ ФОРМЫ НЕ СОВПАДАЮТ БУКВАЛЬНО</text>
<text x="78" y="384" class="val" text-anchor="start">b — одно число, а прибавляется к столбцу 4 × 1: оно размножается по всем строкам</text>
<text x="78" y="410" class="val" text-anchor="start">на обратном проходе это размножение обернётся суммированием</text>
</g>
<text x="40" y="470" class="legend" text-anchor="start">синее — данные · тёмно-жёлтое — обучаемые числа · зелёное — предсказания · красное — ошибка</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="X mm0" data-focus="X">
      <div class="step-kicker">Шаг 1 · батч</div>
      <h4>Дома складываются друг под друга</h4>
<p>Строк столько, сколько домов; столбцов — сколько признаков. Порядок столбцов тот же, что был у одного объекта.</p>
<p><div class="math-display" data-tex="X \in \mathbb{R}^{4\times 2}"></div></p>
    </div>
    <div class="step-panel" data-on="X w mm1" data-focus="w">
      <div class="step-kicker">Шаг 2 · веса те же самые</div>
      <h4>Модель одна на весь батч</h4>
<p>Веса не размножаются по строкам: столбец w ровно один. Именно поэтому обучение на батче ищет общую закономерность, а не подгоняет каждый дом отдельно.</p>
    </div>
    <div class="step-panel" data-on="X w yh row mm2" data-focus="row">
      <div class="step-kicker">Шаг 3 · строка за строкой</div>
      <h4>Каждая строка X даёт свою клетку ŷ</h4>
<p>Это тот же forward одного объекта, повторённый четыре раза. Внутренние двойки сходятся, поэтому результат — столбец высоты 4.</p>
<p><div class="math-display" data-tex="[4\times 2]\cdot[2\times 1] \rightarrow [4\times 1]"></div></p>
    </div>
    <div class="step-panel" data-on="X w bb yh note mm2" data-focus="bb note">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4>Одно число прибавляется ко всем строкам</h4>
<p>Формально это <span class="math-inline" data-tex="b\mathbf{1}_N"></span> — столбец из N одинаковых значений. В коде то же самое делает broadcasting, и это единственное место во всём прямом проходе, где формы не совпадают буквально.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} = X\mathbf{w} + b\mathbf{1}_N"></div></p>
    </div>
    <div class="step-panel" data-on="yh y r mm3" data-focus="r">
      <div class="step-kicker">Шаг 5 · остатки</div>
      <h4>Вычитание клетка в клетку</h4>
<p>Формы совпадают буквально, поэтому вычитание поэлементное. Знак читается прямо: минус — модель занизила цену, плюс — завысила.</p>
<p><div class="math-display" data-tex="\mathbf{r} = \hat{\mathbf{y}} - \mathbf{y} \in \mathbb{R}^{4\times 1}"></div></p>
    </div>
    <div class="step-panel" data-on="r L mm4" data-focus="L">
      <div class="step-kicker">Шаг 6 · потеря</div>
      <h4>Столбец схлопывается в скаляр</h4>
<p>Квадрат убирает знак и сильнее наказывает крупные промахи, деление на N делает потерю сравнимой между батчами разного размера.</p>
<p><div class="math-display" data-tex="L = \frac{1}{N}\mathbf{r}^\top\mathbf{r}"></div></p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> батч не добавляет ни одной новой операции. Он добавляет
  только ось объектов, и она проходит через всю цепочку насквозь: N строк на входе —
  N остатков на выходе, и лишь последний шаг схлопывает их в скаляр.
</div>

---

## Часть 7. Подставляем числа

<p>
  Схема та же, что в части 6, клетки те же. Меняется одно: вместо символов появляются числа
  наших четырёх домов, и каждый шаг можно пересчитать на калькуляторе.
</p>

<pre><code>def forward(X, w, b, y):
    yhat = X @ w + b          # [4,2]·[2,1] → [4,1]
    r    = yhat - y           # поэлементно
    L    = (r ** 2).mean()    # одно число
    return yhat, r, L</code></pre>

<p>Посмотрим пошагово, что за числа получаются на прямом проходе.</p>


<div class="stage" id="stageFX" tabindex="0">
  <div class="stage-figure">
<svg id="fx" viewBox="0 0 960 410" role="img" aria-label="Прямой проход батча с подставленными числами">
  <style>
    #fx { font-family: Helvetica, Arial, sans-serif; }
    #fx .lbl { font-size: 16px; fill: #111111; }
    #fx .cap { font-size: 13px; fill: #5E5850; }
    #fx .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #fx .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #fx .val { font-size: 14px; fill: #111111; }
    #fx .mm  { font-size: 12px; fill: #5E5850; }
    #fx .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="fx-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="fx-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="fx-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">та же схема, что в части 6 · красной рамкой — то, что считаем руками</text>
<g data-key="X">
<rect x="64" y="104" width="130" height="132" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="129.0" y1="104" x2="129.0" y2="236" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="64" y1="137.0" x2="194" y2="137.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="64" y1="170.0" x2="194" y2="170.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="64" y1="203.0" x2="194" y2="203.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="96.5" y="125.5" text-anchor="middle" font-size="14" fill="#111111">4,0</text>
<text x="161.5" y="125.5" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="96.5" y="158.5" text-anchor="middle" font-size="14" fill="#111111">8,0</text>
<text x="161.5" y="158.5" text-anchor="middle" font-size="14" fill="#111111">1,0</text>
<text x="96.5" y="191.5" text-anchor="middle" font-size="14" fill="#111111">6,0</text>
<text x="161.5" y="191.5" text-anchor="middle" font-size="14" fill="#111111">4,0</text>
<text x="96.5" y="224.5" text-anchor="middle" font-size="14" fill="#111111">10,0</text>
<text x="161.5" y="224.5" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="129" y="92" text-anchor="middle" font-size="13" fill="#111111">4 × 2</text>
<text x="129" y="260" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">X</text>
</g>
<g data-key="w">
<text x="230" y="176" class="lbl" text-anchor="middle">·</text>
<rect x="256" y="126" width="62" height="88" rx="2" fill="#C29E08" opacity="0.45" stroke="#ffffff" stroke-width="1"/>
<line x1="256" y1="170.0" x2="318" y2="170.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="287.0" y="153.0" text-anchor="middle" font-size="14" fill="#111111">0,7</text>
<text x="287.0" y="197.0" text-anchor="middle" font-size="14" fill="#111111">−0,2</text>
<text x="287" y="114" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="287" y="238" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="bb">
<text x="354" y="176" class="lbl" text-anchor="middle">+</text>
<rect x="380" y="156" width="56" height="34" rx="2" fill="#C29E08" opacity="0.45" stroke="#ffffff" stroke-width="1"/>
<text x="408.0" y="178.0" text-anchor="middle" font-size="14" fill="#111111">1,0</text>
<text x="408" y="214" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
</g>
<g data-key="yh">
<text x="472" y="176" class="lbl" text-anchor="middle">=</text>
<rect x="500" y="104" width="62" height="132" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="500" y1="137.0" x2="562" y2="137.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="500" y1="170.0" x2="562" y2="170.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="500" y1="203.0" x2="562" y2="203.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="531.0" y="125.5" text-anchor="middle" font-size="14" fill="#111111">3,4</text>
<text x="531.0" y="158.5" text-anchor="middle" font-size="14" fill="#111111">6,4</text>
<text x="531.0" y="191.5" text-anchor="middle" font-size="14" fill="#111111">4,4</text>
<text x="531.0" y="224.5" text-anchor="middle" font-size="14" fill="#111111">7,6</text>
<text x="531" y="92" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="531" y="260" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
</g>
<g data-key="y">
<text x="596" y="176" class="lbl" text-anchor="middle">−</text>
<rect x="624" y="104" width="68" height="132" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="624" y1="137.0" x2="692" y2="137.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="624" y1="170.0" x2="692" y2="170.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="624" y1="203.0" x2="692" y2="203.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="658.0" y="125.5" text-anchor="middle" font-size="14" fill="#111111">4,14</text>
<text x="658.0" y="158.5" text-anchor="middle" font-size="14" fill="#111111">7,85</text>
<text x="658.0" y="191.5" text-anchor="middle" font-size="14" fill="#111111">4,90</text>
<text x="658.0" y="224.5" text-anchor="middle" font-size="14" fill="#111111">9,55</text>
<text x="658" y="92" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="658" y="260" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">y</text>
</g>
<g data-key="r">
<text x="728" y="176" class="lbl" text-anchor="middle">=</text>
<rect x="756" y="104" width="74" height="132" rx="2" fill="#C30B0A" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="756" y1="137.0" x2="830" y2="137.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="756" y1="170.0" x2="830" y2="170.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="756" y1="203.0" x2="830" y2="203.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="793.0" y="125.5" text-anchor="middle" font-size="14" fill="#111111">−0,74</text>
<text x="793.0" y="158.5" text-anchor="middle" font-size="14" fill="#111111">−1,45</text>
<text x="793.0" y="191.5" text-anchor="middle" font-size="14" fill="#111111">−0,50</text>
<text x="793.0" y="224.5" text-anchor="middle" font-size="14" fill="#111111">−1,95</text>
<text x="793" y="92" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="793" y="260" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">r</text>
</g>
<g data-key="hl" data-only="1">
<rect x="64" y="104.0" width="130" height="33.0" fill="#C30B0A" opacity="0.12"/>
<rect x="64" y="104.0" width="130" height="33.0" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="256.0" y="126" width="62.0" height="88" fill="#C30B0A" opacity="0.12"/>
<rect x="256.0" y="126" width="62.0" height="88" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="500.0" y="104.0" width="62.0" height="33.0" fill="#C30B0A" opacity="0.14"/>
<rect x="500.0" y="104.0" width="62.0" height="33.0" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
</g>
<g data-key="L" data-only="1">
<line x1="560" y1="300" x2="616" y2="300" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#fx-arr)"/>
<rect x="630" y="270" width="190" height="62" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="725" y="301" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">1,6757</text>
<text x="725" y="323" class="cap" text-anchor="middle">потеря батча</text>
<text x="300" y="300" class="cap" text-anchor="middle">сумма четырёх квадратов, делённая на четыре</text>
</g>
<text x="40" y="396" class="legend" text-anchor="start">все числа точные: признаки заданы с одним знаком после запятой, цены — с двумя</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="X mm0" data-focus="X">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>Четыре дома и два признака</h4>
<p><b>Дано.</b> Четыре дома: 40 м² возрастом 20 лет, 80 м² возрастом 10 лет, 60 м² возрастом 40 лет и 100 м² возрастом 20 лет.</p>
<p><div class="math-display" data-tex="X = \begin{bmatrix}4{,}0 &amp; 2{,}0\\8{,}0 &amp; 1{,}0\\6{,}0 &amp; 4{,}0\\10{,}0 &amp; 2{,}0\end{bmatrix}"></div></p>
    </div>
    <div class="step-panel" data-on="X w bb mm1" data-focus="w bb">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>Разумная догадка, не подобранная</h4>
<p><b>Текущие веса.</b> Пока это просто разумная догадка: 0,7 млн за десять квадратных метров и минус 0,2 млн за десять лет возраста, плюс миллион базовой цены.</p>
<p><div class="math-display" data-tex="\mathbf{w} = (0{,}7;\ -0{,}2)^\top, \qquad b = 1{,}0"></div></p>
    </div>
    <div class="step-panel" data-on="X w hl mm2" data-focus="hl">
      <div class="step-kicker">Шаг 3 · строка на столбец</div>
      <h4>Два произведения для первого дома</h4>
<p><b>Первая строка.</b> Малиновым выделено ровно то, что участвует: первая строка X, весь столбец w и клетка, куда попадёт результат.</p>
<p><div class="math-display" data-tex="4{,}0\cdot 0{,}7 + 2{,}0\cdot(-0{,}2) = 2{,}8 - 0{,}4 = 2{,}4"></div></p>
    </div>
    <div class="step-panel" data-on="X w bb yh mm2" data-focus="yh">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4>Первый дом оценён в 3,4 млн</h4>
<p><b>Плюс сдвиг.</b> Одна и та же единица ко всем четырём строкам.</p>
<p><div class="math-display" data-tex="\hat y_1 = 2{,}4 + 1{,}0 = 3{,}4"></div></p>
    </div>
    <div class="step-panel" data-on="X w bb yh mm2" data-focus="yh">
      <div class="step-kicker">Шаг 5 · остальные строки</div>
      <h4>Те же две операции ещё трижды</h4>
<p><b>Остальные три строки.</b> Считаются точно так же — те же два умножения и то же прибавление сдвига.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} = (3{,}4;\ 6{,}4;\ 4{,}4;\ 7{,}6)^\top"></div></p>
    </div>
    <div class="step-panel" data-on="yh y r mm3" data-focus="r">
      <div class="step-kicker">Шаг 6 · остатки</div>
      <h4>Все четыре предсказания занижены</h4>
<p><b>Сравниваем с правдой.</b> Настоящие цены — 4,14; 7,85; 4,90 и 9,55 млн. Модель занизила все четыре дома, и это не случайность: стартовый вес площади меньше настоящего.</p>
<p><div class="math-display" data-tex="\mathbf{r} = (-0{,}74;\ -1{,}45;\ -0{,}50;\ -1{,}95)^\top"></div></p>
    </div>
    <div class="step-panel" data-on="r L mm4" data-focus="L">
      <div class="step-kicker">Шаг 7 · потеря</div>
      <h4>Одно число вместо четырёх</h4>
<p><b>Потеря.</b> Квадраты остатков: 0,5476; 2,1025; 0,2500 и 3,8025.</p>
<p><div class="math-display" data-tex="L = \tfrac{1}{4}(0{,}5476 + 2{,}1025 + 0{,}2500 + 3{,}8025) = 1{,}6757"></div></p>
<p>Само по себе 1,6757 ничего не говорит. Смысл появится в части 11, когда после одного шага обучения это число станет 0,1704.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout-red">
  <strong>Осторожно с «модель почти угадала»:</strong> предсказание 3,4 при настоящей цене 4,14
  выглядит не так уж плохо, но ощущение обманчиво. Промах в 0,74 млн на доме за 4,14 — это
  ошибка в 18 %. Судить по одной строке вообще нельзя: для этого и нужна потеря, которая
  сводит все четыре промаха в одно число.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> в прямом проходе нет ни одной операции сложнее умножения
  и сложения. Все четыре предсказания получены одним и тем же набором из двух весов и сдвига,
  и различаются они только потому, что различаются строки <span class="math-inline" data-tex="X"></span>.
</div>

---

## Часть 8. Обратный проход на графе: цепное правило

<p>
  Прямой проход ответил, что предсказывает модель. Обратный отвечает на другой вопрос:
  если увеличить один из трёх параметров на крошечную величину, потеря вырастет или упадёт
  и насколько быстро. Ответ — производная, и берётся она по звеньям.
</p>

<p>
  Удобно смотреть на вычисление как на граф: узлы — величины, рёбра — операции. Прямой проход
  идёт по стрелкам слева направо, обратный — против стрелок, и на каждом ребре забирает свою
  локальную производную.
</p>

<div class="callout-blue">
  <strong>Что такое локальная производная:</strong> она зависит только от той операции, которая
  стоит на ребре, и ничего не знает об остальном графе. У сложения производная равна единице,
  у умножения на <span class="math-inline" data-tex="x_1"></span> — это
  <span class="math-inline" data-tex="x_1"></span>, у квадрата — удвоенный аргумент.
  Именно поэтому обратный проход можно собирать из готовых кусочков, не выводя каждый раз всё
  заново.
</div>

<p>Посмотрим пошагово, как градиент едет от потери до весов.</p>


<div class="stage" id="stageBG" tabindex="0">
  <div class="stage-figure">
<svg id="bg" viewBox="0 0 960 520" role="img" aria-label="Обратный проход на графе: сигнал ошибки течёт справа налево">
  <style>
    #bg { font-family: Helvetica, Arial, sans-serif; }
    #bg .lbl { font-size: 16px; fill: #111111; }
    #bg .cap { font-size: 13px; fill: #5E5850; }
    #bg .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #bg .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #bg .val { font-size: 14px; fill: #111111; }
    #bg .mm  { font-size: 12px; fill: #5E5850; }
    #bg .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bg-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="bg-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bg-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>

<text x="480" y="62" class="cap" text-anchor="middle">вперёд считаются числа, назад — производные</text>
<g data-key="fw">
<line x1="146" y1="164" x2="356" y2="206" stroke="#8A857C" stroke-width="1.5"/>
<line x1="146" y1="286" x2="356" y2="244" stroke="#8A857C" stroke-width="1.5"/>
<line x1="400" y1="346" x2="400" y2="270" stroke="#8A857C" stroke-width="1.5"/>
<line x1="444" y1="225" x2="578" y2="225" stroke="#8A857C" stroke-width="1.5"/>
<line x1="656" y1="225" x2="778" y2="225" stroke="#8A857C" stroke-width="1.5"/>
<circle cx="110" cy="150" r="36" fill="#C29E08" fill-opacity="0.13" stroke="#C29E08" stroke-width="2.2"/>
<text x="110" y="155.333" text-anchor="middle" font-size="16" fill="#8F7406" font-weight="700">w₁</text>
<circle cx="110" cy="300" r="36" fill="#C29E08" fill-opacity="0.13" stroke="#C29E08" stroke-width="2.2"/>
<text x="110" y="305.333" text-anchor="middle" font-size="16" fill="#8F7406" font-weight="700">w₂</text>
<circle cx="400" cy="372" r="26" fill="#C29E08" fill-opacity="0.13" stroke="#C29E08" stroke-width="2.2"/>
<text x="400" y="377" text-anchor="middle" font-size="15" fill="#8F7406" font-weight="700">b</text>
<circle cx="400" cy="225" r="44" fill="#73B222" fill-opacity="0.13" stroke="#73B222" stroke-width="2.2"/>
<text x="400" y="230.667" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700">z</text>
<circle cx="618" cy="225" r="38" fill="#73B222" fill-opacity="0.13" stroke="#73B222" stroke-width="2.2"/>
<text x="618" y="230.667" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700">ŷ</text>
<rect x="782" y="194" width="152" height="62" rx="14" fill="#FFF7F7" stroke="#C30B0A" stroke-width="1.5"/>
<text x="858" y="232" font-size="16" fill="#9C0908" text-anchor="middle" font-weight="700">ℓ = (ŷ − y)²</text>
<text x="858" y="274" class="cap" text-anchor="middle">потеря одного дома</text>
</g>
<g data-key="loc" data-only="1">
<rect x="202.0" y="148.0" width="96.1" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="250" y="162" text-anchor="middle" font-size="13" fill="#C30B0A">∂z/∂w₁ = x₁</text>
<rect x="202.0" y="286.0" width="96.1" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="250" y="300" text-anchor="middle" font-size="13" fill="#C30B0A">∂z/∂w₂ = x₂</text>
<rect x="415.2" y="326.0" width="81.5" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="456" y="340" text-anchor="middle" font-size="13" fill="#C30B0A">∂z/∂b = 1</text>
<rect x="470.2" y="200.0" width="81.5" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="511" y="214" text-anchor="middle" font-size="13" fill="#C30B0A">∂ŷ/∂z = 1</text>
<rect x="672.6" y="200.0" width="88.8" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="717" y="214" text-anchor="middle" font-size="13" fill="#C30B0A">∂ℓ/∂ŷ = 2r</text>
</g>
<g data-key="b1" data-only="1">
<path d="M 800 264 C 762 306 700 306 652 254" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<rect x="678.0" y="302.0" width="96.1" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="726" y="316" text-anchor="middle" font-size="13" fill="#C30B0A">приходит 2r</text>
</g>
<g data-key="b2" data-only="1">
<path d="M 588 256 C 548 300 478 302 436 254" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<rect x="405.7" y="300.0" width="212.6" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="512" y="314" text-anchor="middle" font-size="13" fill="#C30B0A">умножили на 1 — осталось 2r</text>
</g>
<g data-key="b3" data-only="1">
<path d="M 368 198 C 300 150 218 134 150 132" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<path d="M 368 252 C 300 300 218 318 150 318" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<rect x="204.5" y="98.0" width="67.0" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="238" y="112" text-anchor="middle" font-size="13" fill="#C30B0A">2r · x₁</text>
<rect x="204.5" y="334.0" width="67.0" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="238" y="348" text-anchor="middle" font-size="13" fill="#C30B0A">2r · x₂</text>
</g>
<g data-key="b4" data-only="1">
<path d="M 384 268 C 352 320 356 362 372 372" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<rect x="286.2" y="386.0" width="59.7" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="316" y="400" text-anchor="middle" font-size="13" fill="#C30B0A">2r · 1</text>
</g>
<g data-key="ch" data-only="1">
<rect x="96" y="424" width="200" height="52" rx="14" fill="#FFF7F7" stroke="#C30B0A" stroke-width="1.5"/>
<text x="196" y="456" font-size="15" fill="#111111" text-anchor="middle">∂ℓ/∂ŷ = 2r</text>
<text x="316" y="456" class="lbl" text-anchor="middle">·</text>
<rect x="336" y="424" width="176" height="52" rx="14" fill="#FFF7F7" stroke="#C30B0A" stroke-width="1.5"/>
<text x="424" y="456" font-size="15" fill="#111111" text-anchor="middle">∂ŷ/∂z = 1</text>
<text x="532" y="456" class="lbl" text-anchor="middle">·</text>
<rect x="552" y="424" width="200" height="52" rx="14" fill="#FFF7F7" stroke="#C30B0A" stroke-width="1.5"/>
<text x="652" y="456" font-size="15" fill="#111111" text-anchor="middle">∂z/∂w₁ = x₁</text>
<text x="772" y="456" class="lbl" text-anchor="middle">=</text>
<rect x="792" y="424" width="140" height="52" rx="14" fill="#FDF2FA" stroke="#D83BB9" stroke-width="1.5"/>
<text x="862" y="456" font-size="15" fill="#A62E8E" text-anchor="middle" font-weight="700">2r · x₁</text>
</g>
<text x="40" y="508" class="legend" text-anchor="start">серые линии — прямой проход · красные дуги — обратный · на плашках — то, что течёт назад</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="fw" data-focus="fw">
      <div class="step-kicker">Шаг 1 · граф вычислений</div>
      <h4>Сначала запишем, что от чего зависит</h4>
<p>Прямой проход — цепочка: из весов и признаков получается сумматор, из него предсказание, из предсказания и настоящей цены — потеря. Каждая линия здесь — одна операция.</p>
<p>Признаки не нарисованы кружками: они не обучаются, и производные по ним не нужны. Обучаются w₁, w₂ и b.</p>
    </div>
    <div class="step-panel" data-on="fw" data-focus="fw">
      <div class="step-kicker">Шаг 2 · что мы спрашиваем</div>
      <h4>Насколько потеря чувствительна к каждому весу</h4>
<p>Производная <span class="math-inline" data-tex="\partial\ell/\partial w_1"></span> отвечает: если чуть-чуть увеличить w₁, потеря вырастет или упадёт и насколько быстро.</p>
<p>Брать её сразу от всей цепочки не нужно и не получится — цепочку разбирают по звеньям.</p>
    </div>
    <div class="step-panel" data-on="fw loc" data-focus="loc">
      <div class="step-kicker">Шаг 3 · локальные производные</div>
      <h4>У каждой линии своя, и все они простые</h4>
<p>Локальная производная зависит только от той операции, которая стоит на ребре, и ничего не знает об остальном графе.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial \hat y} = 2r, \qquad \frac{\partial \hat y}{\partial z} = 1, \qquad \frac{\partial z}{\partial w_p} = x_p, \qquad \frac{\partial z}{\partial b} = 1"></div></p>
    </div>
    <div class="step-panel" data-on="fw loc b1" data-focus="b1">
      <div class="step-kicker">Шаг 4 · поток стартует</div>
      <h4>Из потери в предсказание приходит 2r</h4>
<p>Обратный проход начинается с самого правого узла и идёт против стрелок. Первое, что он несёт, — производная потери по предсказанию.</p>
<p>Если модель занизила цену на 0,74 млн, сюда придёт −1,48. Знак сохраняется и дальше по всей цепочке.</p>
    </div>
    <div class="step-panel" data-on="fw loc b1 b2" data-focus="b2">
      <div class="step-kicker">Шаг 5 · через сумматор</div>
      <h4>Множитель равен единице, значение не меняется</h4>
<p>В линейной регрессии предсказание совпадает с сумматором, поэтому на этом участке сигнал проходит без потерь: 2r · 1 = 2r.</p>
<p>У логистической регрессии здесь стояла бы производная сигмоиды, а у нейрона — маска ReLU, и сигнал бы ослаб или обнулился. Вот почему линейная модель — самый короткий из всех обратных проходов.</p>
    </div>
    <div class="step-panel" data-on="fw loc b1 b2 b3" data-focus="b3">
      <div class="step-kicker">Шаг 6 · в веса</div>
      <h4>Домножаем на признак — и попадаем в w₁ и w₂</h4>
<p>Здесь пути расходятся. К весу площади сигнал приходит домноженным на площадь, к весу возраста — на возраст. Общий множитель у них один и тот же.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial w_1} = 2r\,x_1, \qquad \frac{\partial \ell}{\partial w_2} = 2r\,x_2"></div></p>
<p>Отсюда видно, почему признаки полезно приводить к одному масштабу: если один из них в тридцать раз крупнее, его градиент будет в тридцать раз больше — не потому, что он важнее.</p>
    </div>
    <div class="step-panel" data-on="fw loc b1 b2 b4" data-focus="b4">
      <div class="step-kicker">Шаг 7 · в сдвиг</div>
      <h4>Последний множитель равен единице</h4>
<p>У сдвига нет своего признака: он входит в сумму с коэффициентом 1. Поэтому его производная совпадает с самим сигналом ошибки.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial b} = 2r"></div></p>
    </div>
    <div class="step-panel" data-on="loc ch" data-focus="ch">
      <div class="step-kicker">Шаг 8 · цепочка целиком</div>
      <h4>Три множителя вдоль одного пути</h4>
<p>Путь от потери до w₁ ровно один, поэтому и слагаемое одно. Перемножаем то, что стояло на каждом ребре, — и получаем готовую формулу.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial w_1} = \frac{\partial \ell}{\partial \hat y}\cdot\frac{\partial \hat y}{\partial z}\cdot\frac{\partial z}{\partial w_1} = 2r\cdot 1\cdot x_1"></div></p>
<p>Если путей несколько — как в сети со скрытыми слоями, — производные вдоль них складываются. Больше никаких правил в backpropagation нет.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> цепное правило — единственный инструмент обратного
  прохода. Всё остальное в backpropagation — бухгалтерия: аккуратно перемножить локальные
  производные вдоль пути и, если путей несколько, сложить результаты.
</div>

---

## Часть 9. Обратный проход в матричной форме

<p>
  Формулы из части 8 записаны для одного дома и одного веса. Для батча их не нужно выводить
  заново — достаточно собрать те же производные в матрицы, следя за формами.
</p>

<p>
  Вес <span class="math-inline" data-tex="w_1"></span> влияет на все
  <span class="math-inline" data-tex="N"></span> предсказаний сразу, поэтому вклады
  складываются по объектам. Это и есть цепное правило для функции многих переменных:
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial w_p} = \sum_{n=1}^{N} \frac{\partial L}{\partial \hat y_n}\cdot\frac{\partial \hat y_n}{\partial w_p} = \sum_{n=1}^{N} \frac{2}{N}r_n\,x_{np}"></div>

<p>
  Сумма произведений по номеру объекта — это в точности одна клетка матричного произведения,
  в котором ось объектов стоит внутри. Отсюда обе итоговые формулы:
</p>

<div class="math-display" data-tex="\nabla_{\mathbf{w}} L = \frac{2}{N}X^\top\mathbf{r} \in \mathbb{R}^{P\times 1},\qquad \frac{\partial L}{\partial b} = \frac{2}{N}\sum_{n=1}^{N} r_n \in \mathbb{R}"></div>

<div class="callout-blue">
  <strong>Откуда в градиенте сдвига взялась сумма:</strong> на прямом проходе
  <span class="math-inline" data-tex="b"></span> размножился по всем строкам батча. Каждая копия
  получила свою производную, а поскольку само число одно, все копии обязаны сложиться. Правило
  общее: размножение вперёд — суммирование назад, и в сетях с broadcasting оно встречается
  на каждом слое.
</div>

<p>Посмотрим пошагово, как это правило выглядит на самих матрицах.</p>


<div class="stage" id="stageBM" tabindex="0">
  <div class="stage-figure">
<svg id="bm" viewBox="0 0 960 450" role="img" aria-label="Градиенты батча в матричной форме">
  <style>
    #bm { font-family: Helvetica, Arial, sans-serif; }
    #bm .lbl { font-size: 16px; fill: #111111; }
    #bm .cap { font-size: 13px; fill: #5E5850; }
    #bm .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #bm .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #bm .val { font-size: 14px; fill: #111111; }
    #bm .mm  { font-size: 12px; fill: #5E5850; }
    #bm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="bm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bm-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">те же производные, собранные в матрицы</text>
<g data-key="r">
<rect x="60" y="100" width="46" height="120" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/>
<line x1="60" y1="130.0" x2="106" y2="130.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="160.0" x2="106" y2="160.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="190.0" x2="106" y2="190.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="83" y="88" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="83" y="244" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">r</text>
<text x="140" y="166" class="lbl" text-anchor="middle">·</text>
<text x="172" y="172" class="lbl" text-anchor="middle">2/N</text>
<text x="206" y="166" class="lbl" text-anchor="middle">=</text>
</g>
<g data-key="sig">
<rect x="230" y="100" width="46" height="120" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="230" y1="130.0" x2="276" y2="130.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="230" y1="160.0" x2="276" y2="160.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="230" y1="190.0" x2="276" y2="190.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="253" y="88" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="253" y="244" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂ŷ</text>
</g>
<g data-key="XT">
<path d="M 253 250 C 253 272 272 262 288 276" fill="none" stroke="#5E5850" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#bm-arw)"/>
<text x="352" y="250" class="cap" text-anchor="start">тот же столбец</text>
<rect x="60" y="288" width="180" height="68" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="105.0" y1="288" x2="105.0" y2="356" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="150.0" y1="288" x2="150.0" y2="356" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="195.0" y1="288" x2="195.0" y2="356" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="322.0" x2="240" y2="322.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="150" y="276" text-anchor="middle" font-size="13" fill="#111111">2 × 4</text>
<text x="150" y="380" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">Xᵀ</text>
</g>
<g data-key="sig2">
<text x="266" y="326" class="lbl" text-anchor="middle">·</text>
<rect x="292" y="262" width="46" height="120" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="292" y1="292.0" x2="338" y2="292.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="292" y1="322.0" x2="338" y2="322.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="292" y1="352.0" x2="338" y2="352.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="315" y="250" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="315" y="406" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂ŷ</text>
</g>
<g data-key="nab">
<text x="370" y="326" class="lbl" text-anchor="middle">=</text>
<rect x="396" y="288" width="46" height="68" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="396" y1="322.0" x2="442" y2="322.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="419" y="276" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="419" y="380" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
</g>
<g data-key="bias" data-only="1">
<rect x="520" y="262" width="400" height="120" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
<text x="538" y="288" class="cap" text-anchor="start">ГРАДИЕНТ СДВИГА</text>
<text x="538" y="320" class="val" text-anchor="start">∂L/∂b = сумма всех клеток ∂L/∂ŷ</text>
<text x="538" y="350" class="cap" text-anchor="start">размножение вперёд — суммирование назад</text>
</g>
<g data-key="rule" data-only="1">
<rect x="520" y="100" width="400" height="120" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="538" y="126" class="cap" text-anchor="start">ПРАВИЛО ПРОВЕРКИ</text>
<text x="538" y="156" class="val" text-anchor="start">w:  2 × 1   →   ∇wL:  2 × 1</text>
<text x="538" y="184" class="val" text-anchor="start">b:  число   →   ∂L/∂b:  число</text>
<text x="538" y="208" class="cap" text-anchor="start">если формы разошлись — ошибка в выкладке</text>
</g>
<text x="40" y="436" class="legend" text-anchor="start">красное — всё, что связано с ошибкой и градиентом · синее — данные</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="r mm3" data-focus="r">
      <div class="step-kicker">Шаг 1 · с чего начинается обратный проход</div>
      <h4>Единственное, что нужно, — столбец остатков</h4>
<p>Прямой проход уже посчитал остатки, и заново ничего вычислять не придётся. Ни предсказания, ни настоящие цены по отдельности больше не понадобятся.</p>
<p><div class="math-display" data-tex="\mathbf{r} = \hat{\mathbf{y}} - \mathbf{y} \in \mathbb{R}^{N\times 1}"></div></p>
    </div>
    <div class="step-panel" data-on="r sig mm5" data-focus="sig">
      <div class="step-kicker">Шаг 2 · сигнал ошибки</div>
      <h4>Производная потери по каждому предсказанию</h4>
<p>Квадрат даёт множитель 2, усреднение — деление на N. Форма при этом не меняется: сколько было предсказаний, столько и производных.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial \hat{\mathbf{y}}} = \frac{2}{N}\,\mathbf{r} \in \mathbb{R}^{N\times 1}"></div></p>
    </div>
    <div class="step-panel" data-on="sig XT sig2 mm5" data-focus="XT">
      <div class="step-kicker">Шаг 3 · откуда берётся транспонирование</div>
      <h4>Нужно свернуть ось объектов, а не ось признаков</h4>
<p>У сигнала ошибки высота N — по числу домов. У градиента весов высота должна быть P — по числу признаков. Свернуть N способна только матрица, у которой N стоит в столбцах, а это <span class="math-inline" data-tex="X^\top"></span>.</p>
<p>Смысл строки <span class="math-inline" data-tex="X^\top"></span> прямой: это один признак у всех домов сразу.</p>
    </div>
    <div class="step-panel" data-on="XT sig2 nab mm5" data-focus="nab">
      <div class="step-kicker">Шаг 4 · градиент весов</div>
      <h4>Формы сходятся, получается столбец 2 × 1</h4>
<p>Каждая клетка результата — сумма по всем домам: признак, умноженный на сигнал ошибки этого дома. Ровно то же, что мы получили на графе, только сразу для всего батча.</p>
<p><div class="math-display" data-tex="\nabla_{\mathbf{w}} L = \frac{2}{N}X^\top\mathbf{r} \qquad [2\times 4]\cdot[4\times 1] \rightarrow [2\times 1]"></div></p>
    </div>
    <div class="step-panel" data-on="sig bias mm5" data-focus="bias">
      <div class="step-kicker">Шаг 5 · градиент сдвига</div>
      <h4>Сдвиг входит во все строки с коэффициентом единица</h4>
<p>Поэтому взвешивать признаками нечего, и остаётся просто сумма сигналов ошибки. Помните размножение b по строкам на прямом проходе? Здесь оно обернулось суммированием — так бывает всегда.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial b} = \frac{2}{N}\sum_{n=1}^{N} r_n"></div></p>
    </div>
    <div class="step-panel" data-on="nab bias rule" data-focus="rule">
      <div class="step-kicker">Шаг 6 · как проверить себя</div>
      <h4>Форма градиента повторяет форму параметра</h4>
<p>Это самая дешёвая проверка выкладки: если у градиента весов получилась форма N × 1 или 1 × P, ошибка в производной, а не в данных — вычесть такой градиент из w всё равно не из чего.</p>
<p>Весь обратный проход линейной регрессии — одно умножение матрицы на столбец и одно суммирование того же столбца.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> у градиента всегда форма того, по чему дифференцировали.
  <span class="math-inline" data-tex="\mathbf{w}"></span> имеет форму
  <span class="math-inline" data-tex="P\times 1"></span> — и градиент тоже;
  <span class="math-inline" data-tex="b"></span> число — и его производная число. Если формы
  разошлись, ошибка в выкладке, а не в данных.
</div>

---

## Часть 10. Подставляем числа в обратный проход

<p>
  Все величины уже посчитаны в части 7. Остатки лежат готовым столбцом, матрица признаков
  не менялась, и заново вычислять нечего — обратный проход переиспользует результаты прямого
  целиком.
</p>

<pre><code>def backward(X, r):
    g  = 2 / len(r) * r       # сигнал ошибки, [4,1]
    dw = X.T @ g              # [2,4]·[4,1] → [2,1]
    db = g.sum()              # одно число
    return dw, db</code></pre>

<p>Посмотрим пошагово, что за числа получаются назад.</p>


<div class="stage" id="stageBX" tabindex="0">
  <div class="stage-figure">
<svg id="bx" viewBox="0 0 960 430" role="img" aria-label="Обратный проход в числах и сверка градиента">
  <style>
    #bx { font-family: Helvetica, Arial, sans-serif; }
    #bx .lbl { font-size: 16px; fill: #111111; }
    #bx .cap { font-size: 13px; fill: #5E5850; }
    #bx .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #bx .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #bx .val { font-size: 14px; fill: #111111; }
    #bx .mm  { font-size: 12px; fill: #5E5850; }
    #bx .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bx-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="bx-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bx-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">обратный проход стартует с того же столбца, которым кончился прямой</text>
<g data-key="r">
<rect x="70" y="96" width="74" height="104" rx="2" fill="#C30B0A" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="70" y1="122.0" x2="144" y2="122.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="70" y1="148.0" x2="144" y2="148.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="70" y1="174.0" x2="144" y2="174.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="107.0" y="114.0" text-anchor="middle" font-size="14" fill="#111111">−0,74</text>
<text x="107.0" y="140.0" text-anchor="middle" font-size="14" fill="#111111">−1,45</text>
<text x="107.0" y="166.0" text-anchor="middle" font-size="14" fill="#111111">−0,50</text>
<text x="107.0" y="192.0" text-anchor="middle" font-size="14" fill="#111111">−1,95</text>
<text x="107" y="84" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="107" y="224" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">r</text>
<text x="186" y="150" class="lbl" text-anchor="middle">·</text>
<text x="216" y="156" class="lbl" text-anchor="middle">2/4</text>
<text x="250" y="150" class="lbl" text-anchor="middle">=</text>
</g>
<g data-key="sig">
<rect x="280" y="96" width="84" height="104" rx="2" fill="#E88919" opacity="0.42" stroke="#ffffff" stroke-width="1"/>
<line x1="280" y1="122.0" x2="364" y2="122.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="280" y1="148.0" x2="364" y2="148.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="280" y1="174.0" x2="364" y2="174.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="322.0" y="114.0" text-anchor="middle" font-size="14" fill="#111111">−0,37</text>
<text x="322.0" y="140.0" text-anchor="middle" font-size="14" fill="#111111">−0,725</text>
<text x="322.0" y="166.0" text-anchor="middle" font-size="14" fill="#111111">−0,25</text>
<text x="322.0" y="192.0" text-anchor="middle" font-size="14" fill="#111111">−0,975</text>
<text x="322" y="84" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="322" y="224" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂ŷ</text>
</g>
<g data-key="XT">
<path d="M 320 218 C 320 246 340 240 372 262" fill="none" stroke="#5E5850" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#bx-arw)"/>
<text x="400" y="232" class="cap" text-anchor="start">тот же столбец</text>
<rect x="70" y="280" width="200" height="68" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="120.0" y1="280" x2="120.0" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="170.0" y1="280" x2="170.0" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="220.0" y1="280" x2="220.0" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="70" y1="314.0" x2="270" y2="314.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="95.0" y="302.0" text-anchor="middle" font-size="14" fill="#111111">4,0</text>
<text x="145.0" y="302.0" text-anchor="middle" font-size="14" fill="#111111">8,0</text>
<text x="195.0" y="302.0" text-anchor="middle" font-size="14" fill="#111111">6,0</text>
<text x="245.0" y="302.0" text-anchor="middle" font-size="14" fill="#111111">10,0</text>
<text x="95.0" y="336.0" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="145.0" y="336.0" text-anchor="middle" font-size="14" fill="#111111">1,0</text>
<text x="195.0" y="336.0" text-anchor="middle" font-size="14" fill="#111111">4,0</text>
<text x="245.0" y="336.0" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="170" y="268" text-anchor="middle" font-size="13" fill="#111111">2 × 4</text>
<text x="170" y="372" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">Xᵀ</text>
</g>
<g data-key="sig2">
<text x="300" y="318" class="lbl" text-anchor="middle">·</text>
<rect x="336" y="258" width="84" height="112" rx="2" fill="#E88919" opacity="0.42" stroke="#ffffff" stroke-width="1"/>
<line x1="336" y1="286.0" x2="420" y2="286.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="336" y1="314.0" x2="420" y2="314.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="336" y1="342.0" x2="420" y2="342.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="378.0" y="277.0" text-anchor="middle" font-size="14" fill="#111111">−0,37</text>
<text x="378.0" y="305.0" text-anchor="middle" font-size="14" fill="#111111">−0,725</text>
<text x="378.0" y="333.0" text-anchor="middle" font-size="14" fill="#111111">−0,25</text>
<text x="378.0" y="361.0" text-anchor="middle" font-size="14" fill="#111111">−0,975</text>
<text x="378" y="394" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂ŷ</text>
</g>
<g data-key="nab">
<text x="456" y="318" class="lbl" text-anchor="middle">=</text>
<rect x="492" y="280" width="94" height="68" rx="2" fill="#D83BB9" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="492" y1="314.0" x2="586" y2="314.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="539.0" y="302.0" text-anchor="middle" font-size="14" fill="#111111">−18,53</text>
<text x="539.0" y="336.0" text-anchor="middle" font-size="14" fill="#111111">−4,415</text>
<text x="539" y="268" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="539" y="372" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
</g>
<g data-key="hl" data-only="1">
<rect x="70" y="280.0" width="200" height="34.0" fill="#C30B0A" opacity="0.12"/>
<rect x="70" y="280.0" width="200" height="34.0" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="336.0" y="258" width="84.0" height="112" fill="#C30B0A" opacity="0.12"/>
<rect x="336.0" y="258" width="84.0" height="112" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="492.0" y="280.0" width="94.0" height="34.0" fill="#C30B0A" opacity="0.14"/>
<rect x="492.0" y="280.0" width="94.0" height="34.0" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
</g>
<g data-key="bias" data-only="1">
<rect x="646" y="258" width="274" height="112" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
<text x="664" y="284" class="cap" text-anchor="start">ГРАДИЕНТ СДВИГА</text>
<text x="664" y="314" class="val" text-anchor="start">−0,37 − 0,725 − 0,25 − 0,975</text>
<text x="664" y="346" class="nm" text-anchor="start">∂L/∂b = −2,32</text>
</g>
<g data-key="chk" data-only="1">
<rect x="646" y="96" width="274" height="104" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="664" y="122" class="cap" text-anchor="start">ЧИСЛЕННАЯ СВЕРКА</text>
<text x="664" y="150" class="val" text-anchor="start">(L(w+ε) − L(w−ε)) / 2ε</text>
<text x="664" y="178" class="val" text-anchor="start">расхождение 7,4 · 10⁻¹⁰</text>
</g>
<text x="40" y="416" class="legend" text-anchor="start">малиновым — строка, столбец и клетка, которую они дают · зелёное — независимая проверка</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="r mm3" data-focus="r">
      <div class="step-kicker">Шаг 1 · остатки</div>
      <h4>Ничего пересчитывать не нужно</h4>
<p><b>Остатки из прямого прохода.</b> Берём готовый столбец, ничего не пересчитывая. Потеря на нём была 1,6757 — её и предстоит уменьшить.</p>
<p><div class="math-display" data-tex="\mathbf{r} = (-0{,}74;\ -1{,}45;\ -0{,}50;\ -1{,}95)^\top"></div></p>
    </div>
    <div class="step-panel" data-on="r sig mm5" data-focus="sig">
      <div class="step-kicker">Шаг 2 · сигнал ошибки</div>
      <h4>Умножаем на 2/N</h4>
<p><b>Сигнал ошибки.</b> Умножаем на 2/N = 2/4 = 0,5. Знаки сохранились: все четыре дома модель занизила, поэтому весь столбец отрицательный.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial \hat{\mathbf{y}}} = 0{,}5\cdot\mathbf{r} = (-0{,}37;\ -0{,}725;\ -0{,}25;\ -0{,}975)^\top"></div></p>
    </div>
    <div class="step-panel" data-on="sig XT sig2 mm5" data-focus="XT">
      <div class="step-kicker">Шаг 3 · Xᵀ</div>
      <h4>Та же матрица, повёрнутая на бок</h4>
<p><b>Та же таблица на боку.</b> Первая строка <span class="math-inline" data-tex="X^\top"></span> — площади всех четырёх домов, вторая — их возраст. Ни одно число не изменилось, изменился только порядок осей.</p>
<p><div class="math-display" data-tex="X^\top = \begin{bmatrix}4{,}0 &amp; 8{,}0 &amp; 6{,}0 &amp; 10{,}0\\2{,}0 &amp; 1{,}0 &amp; 4{,}0 &amp; 2{,}0\end{bmatrix}"></div></p>
    </div>
    <div class="step-panel" data-on="XT sig2 nab hl mm5" data-focus="hl">
      <div class="step-kicker">Шаг 4 · вес площади</div>
      <h4>Четыре произведения и их сумма</h4>
<p><b>Первая клетка градиента.</b> Малиновым выделено то, что её даёт: строка площадей, весь столбец сигнала ошибки и клетка результата.</p>
<p><div class="math-display" data-tex="4{,}0(-0{,}37) + 8{,}0(-0{,}725) + 6{,}0(-0{,}25) + 10{,}0(-0{,}975) = -18{,}53"></div></p>
    </div>
    <div class="step-panel" data-on="XT sig2 nab mm5" data-focus="nab">
      <div class="step-kicker">Шаг 5 · вес возраста</div>
      <h4>Строка возрастов на тот же столбец</h4>
<p><b>Вторая клетка.</b> Та же операция со строкой возрастов.</p>
<p><div class="math-display" data-tex="2{,}0(-0{,}37) + 1{,}0(-0{,}725) + 4{,}0(-0{,}25) + 2{,}0(-0{,}975) = -4{,}415"></div></p>
<p>Градиент площади вчетверо больше не потому, что площадь важнее, а потому, что её числа крупнее: 4–10 против 1–4.</p>
    </div>
    <div class="step-panel" data-on="sig bias mm5" data-focus="bias">
      <div class="step-kicker">Шаг 6 · сдвиг</div>
      <h4>Сумма сигналов ошибки</h4>
<p><b>Градиент сдвига.</b> Просто сумма того же столбца — взвешивать нечем.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial b} = -0{,}37 - 0{,}725 - 0{,}25 - 0{,}975 = -2{,}32"></div></p>
<p>Все три производные отрицательны: увеличение любого из трёх чисел уменьшит потерю. Шаг спуска поднимет каждое.</p>
    </div>
    <div class="step-panel" data-on="nab bias chk" data-focus="chk">
      <div class="step-kicker">Шаг 7 · сверка</div>
      <h4>Сдвинуть вес и посмотреть на потерю</h4>
<p><b>Проверка без формул.</b> Производную можно оценить в лоб: изменить один вес на 10⁻⁶ в обе стороны, посчитать потерю дважды и поделить разность на удвоенное приращение. Формулы при этом не используются вообще.</p>
<p>Все три числа совпали с аналитическими до 7,4 · 10⁻¹⁰. Такой проверкой стоит сопровождать любой выведенный руками обратный проход — она ловит опечатки, которые глазами не видны.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="console-title">Сверка аналитического градиента с численным · настоящий вывод</div>
<div class="console"><span class="cmd">$ python3 grad_check.py</span>
аналитически: dw = [-18.53   -4.415]  db = -2.32
численно:     dw = [-18.53   -4.415]  db = -2.32
максимальное расхождение: 7.382254807453137e-10
</div>

<div class="callout-blue">
  <strong>Знаки читаются буквально:</strong> у всех трёх производных знак минус, значит
  увеличение любого из трёх чисел уменьшит потерю — и шаг спуска каждое из них увеличит.
  Это ровно то, что видно на числах: модель занизила все четыре дома.
</div>

<div class="callout-yellow">
  <strong>Где численная проверка перестаёт работать:</strong> она опирается на гладкость
  функции. У линейной регрессии с MSE проблем нет — потеря гладкая всюду. Но стоит появиться
  ReLU или модулю, и в точке излома численная производная начнёт врать при слишком крупном
  <span class="math-inline" data-tex="\varepsilon"></span>, а при слишком мелком её съест
  машинная точность. Разумный диапазон — от <span class="math-inline" data-tex="10^{-6}"></span>
  до <span class="math-inline" data-tex="10^{-4}"></span>.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обратный проход линейной регрессии — это одно умножение
  <span class="math-inline" data-tex="X^\top"></span> на столбец и одно суммирование того же
  столбца. Две строки кода, и обе выведены здесь из определения производной.
</div>

---

## Часть 11. Получили градиент — придумываем спуск

<p>
  На руках три числа: −18,53, −4,415 и −2,32. Что с ними делать? Знак говорит, в какую сторону
  потеря растёт; значит, двигаться надо в противоположную. Осталось решить, насколько далеко.
</p>

<p>
  Производная описывает поведение потери только при бесконечно малом смещении. Она не знает,
  где линейное приближение перестаёт работать, поэтому градиент умножают на небольшой множитель.
  Его называют скоростью обучения, и это единственное число во всём цикле, которое приходится
  выбирать руками.
</p>

<div class="math-display" data-tex="\theta \leftarrow \theta - \eta\,\frac{\partial L}{\partial \theta}"></div>

<p>Посмотрим пошагово, что даёт один шаг из точки, в которой мы стоим.</p>


<div class="stage" id="stageGD" tabindex="0">
  <div class="stage-figure">
<svg id="gd" viewBox="0 0 960 410" role="img" aria-label="Шаг градиентного спуска и зависимость потери от длины шага">
  <style>
    #gd { font-family: Helvetica, Arial, sans-serif; }
    #gd .lbl { font-size: 16px; fill: #111111; }
    #gd .cap { font-size: 13px; fill: #5E5850; }
    #gd .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #gd .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #gd .val { font-size: 14px; fill: #111111; }
    #gd .mm  { font-size: 12px; fill: #5E5850; }
    #gd .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="gd-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="gd-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="gd-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">градиент даёт направление, η — длину шага</text>
<g data-key="w0">
<rect x="78" y="118" width="72" height="70" rx="2" fill="#C29E08" opacity="0.45" stroke="#ffffff" stroke-width="1"/>
<line x1="78" y1="153.0" x2="150" y2="153.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="114.0" y="140.5" text-anchor="middle" font-size="14" fill="#111111">0,7</text>
<text x="114.0" y="175.5" text-anchor="middle" font-size="14" fill="#111111">−0,2</text>
<text x="114" y="106" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="114" y="212" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="gr">
<text x="186" y="158" class="lbl" text-anchor="middle">−</text>
<text x="220" y="162" class="lbl" text-anchor="middle">η ·</text>
<rect x="262" y="118" width="96" height="70" rx="2" fill="#D83BB9" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="262" y1="153.0" x2="358" y2="153.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="310.0" y="140.5" text-anchor="middle" font-size="14" fill="#111111">−18,53</text>
<text x="310.0" y="175.5" text-anchor="middle" font-size="14" fill="#111111">−4,415</text>
<text x="310" y="106" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="310" y="212" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
</g>
<g data-key="w1">
<text x="400" y="158" class="lbl" text-anchor="middle">=</text>
<rect x="434" y="118" width="100" height="70" rx="2" fill="#C29E08" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="434" y1="153.0" x2="534" y2="153.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="484.0" y="140.5" text-anchor="middle" font-size="14" fill="#111111">0,8853</text>
<text x="484.0" y="175.5" text-anchor="middle" font-size="14" fill="#111111">−0,1558</text>
<text x="484" y="106" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="484" y="212" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w после шага</text>
</g>
<g data-key="bs" data-only="1">
<rect x="60" y="250" width="490" height="96" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/>
<text x="78" y="276" class="cap" text-anchor="start">СДВИГ ОБНОВЛЯЕТСЯ ПО ТОМУ ЖЕ ПРАВИЛУ</text>
<text x="78" y="306" class="val" text-anchor="start">b ← 1,0 − 0,01 · (−2,32) = 1,0232</text>
<text x="78" y="332" class="cap" text-anchor="start">отдельной формулы для b не существует — это такой же параметр</text>
</g>
<g data-key="pl" data-only="1">
<rect x="586" y="96" width="340" height="266" rx="12" fill="#FFFFFF" stroke="#E4E1D7" stroke-width="1.3"/>
<text x="602" y="116" class="cap" text-anchor="start">потеря батча после одного шага</text>
<line x1="620" y1="320" x2="920" y2="320" stroke="#8A847B" stroke-width="1.4"/>
<line x1="620" y1="120" x2="620" y2="320" stroke="#8A847B" stroke-width="1.4"/>
<polyline points="620.0,215.3 641.4,255.9 662.9,285.6 684.3,304.4 705.7,312.3 727.1,309.4 748.6,295.5 770.0,270.8 791.4,235.2 812.9,188.7 834.3,131.3" fill="none" stroke="#3576C0" stroke-width="2.4"/>
<line x1="620" y1="215.3" x2="920" y2="215.3" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="4 4"/>
<text x="626" y="209.269" class="cap" text-anchor="start">было 1,6757</text>
<text x="620" y="338" class="cap" text-anchor="start">η = 0</text>
<text x="920" y="338" class="cap" text-anchor="end">0,028</text>
<circle cx="727.1" cy="309.4" r="5" fill="#73B222"/>
<text x="719.143" y="295.35" class="cap" text-anchor="end">η = 0,01 → 0,1704</text>
</g>
<g data-key="bad" data-only="1">
<circle cx="834.3" cy="131.3" r="6" fill="#C30B0A"/>
<text x="824.286" y="151.294" class="cap" text-anchor="end">η = 0,02 → 3,0193</text>
</g>
<text x="40" y="396" class="legend" text-anchor="start">зелёное — результат шага · красное — градиент и шаг, который делает хуже</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="w0 gr mm5" data-focus="w0 gr">
      <div class="step-kicker">Шаг 1 · что на руках</div>
      <h4>Веса и градиент одной формы</h4>
<p>После обратного прохода у нас два столбца 2 × 1: сами веса и их производные. Дальше только арифметика.</p>
<p>Совпадение форм здесь не украшение: будь у градиента другая форма, вычесть его было бы физически не из чего.</p>
    </div>
    <div class="step-panel" data-on="w0 gr mm5" data-focus="gr">
      <div class="step-kicker">Шаг 2 · почему минус</div>
      <h4>Градиент показывает, куда потеря растёт</h4>
<p>Производная −18,53 означает: увеличение w₁ уменьшает потерю. Значит, двигаться надо против градиента, то есть вычитать его.</p>
<p><div class="math-display" data-tex="\theta \leftarrow \theta - \eta\,\frac{\partial L}{\partial \theta}"></div></p>
    </div>
    <div class="step-panel" data-on="w0 gr w1 mm5" data-focus="w1">
      <div class="step-kicker">Шаг 3 · новые веса</div>
      <h4>Каждая клетка меняется независимо</h4>
<p><div class="math-display" data-tex="0{,}7 - 0{,}01\cdot(-18{,}53) = 0{,}8853, \qquad -0{,}2 - 0{,}01\cdot(-4{,}415) = -0{,}1558"></div></p>
<p>Вес площади прибавил 0,185 и сразу подошёл близко к настоящему 0,9. Вес возраста сдвинулся всего на 0,044 — его градиент был вчетверо меньше.</p>
    </div>
    <div class="step-panel" data-on="w1 bs mm5" data-focus="bs">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4>b обновляется той же строкой</h4>
<p>Никакого особого правила для сдвига нет, и в коде он обычно даже не выделяется в отдельную переменную.</p>
    </div>
    <div class="step-panel" data-on="w1 bs pl" data-focus="pl">
      <div class="step-kicker">Шаг 5 · насколько длинный шаг</div>
      <h4>Потеря после шага зависит от η не монотонно</h4>
<p>При η = 0,01 потеря батча падает с 1,6757 до 0,1704 — почти в десять раз за один шаг. Дальше кривая идёт вверх.</p>
<p>Лучший одиночный шаг здесь около 0,0085, но гнаться за ним не нужно: следующий шаг всё равно будет делаться из другой точки.</p>
    </div>
    <div class="step-panel" data-on="pl bad" data-focus="bad">
      <div class="step-kicker">Шаг 6 · когда шаг ломает всё</div>
      <h4>После порога потеря начинает расти</h4>
<p>При η = 0,02 потеря после шага равна 3,0193 — вдвое хуже, чем была до него. Направление было правильным, длина — нет.</p>
<p>Порог считается точно: удвоенная обратная величина наибольшего собственного числа матрицы вторых производных. На всей обучающей выборке это 0,0185, и в части 14 видно, что бывает при его переходе.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout-red">
  <strong>Соблазн, которому нельзя поддаваться:</strong> раз при
  <span class="math-inline" data-tex="\eta \approx 0{,}0085"></span> потеря падает сильнее
  всего, взять именно это значение и радоваться. Кривая на схеме построена для одного шага
  из одной конкретной точки. На следующем шаге точка другая, кривая другая, и «оптимальный»
  шаг тоже другой. Подбирают не лучший шаг, а такой, который безопасен на всём пути, —
  и он всегда заметно меньше.
</div>

<p>
  Дальше цикл повторяется: новый прямой проход, новая потеря, новый градиент. Ниже — настоящий
  лог обучения на всех 150 домах при
  <span class="math-inline" data-tex="\eta = 0{,}01"></span>.
</p>

<div class="console-title">Полный прогон · настоящий вывод</div>
<div class="console"><span class="cmd">$ python3 train.py</span>
шаг    потеря обуч   потеря отл
    0      1.6718   1.6553
    1      0.2149   —
   30      0.1196   —
  300      0.1092   —
 3000      0.1049   0.0967
w = [0.8751, -0.36]  b = 1.3869
<span class="chi">правило данных: [0.9, -0.35]  b = 1.2</span>
</div>

<p>
  Почти вся работа делается за первый же шаг: потеря падает с 1,67 до 0,21. С тридцатого
  по трёхтысячный шаг она улучшается всего на 0,015 — это типичная картина, и длинный хвост
  кривой обучения стоит дорого, а даёт мало.
</p>

<div class="callout-yellow">
  <strong>Ниже дисперсии шума не спуститься:</strong> данные порождены правилом плюс случайная
  добавка со стандартным отклонением 0,35. Даже модель, знающая настоящие коэффициенты, будет
  ошибаться на этот шум, и её потеря составит примерно
  <span class="math-inline" data-tex="0{,}35^2 = 0{,}1225"></span>. Мы дошли до 0,1049 — рядом
  с этим пределом. Остаток не закономерность, а случайность, и улучшать здесь нужно не обучение,
  а данные.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> направление даёт обратный проход, длину выбираете вы.
  Ошибка в направлении уводит модель не туда, слишком длинный шаг разгоняет потерю, слишком
  короткий просто стоит времени. Из этих трёх бед вторая — единственная, которая ломает
  обучение необратимо.
</div>

---

## Часть 12. Размерности одной картинкой

<p>
  Соберём формы всех величин в одну карту — от матрицы признаков до обновлённых весов.
  Здесь <span class="math-inline" data-tex="N"></span> — число объектов в батче,
  <span class="math-inline" data-tex="P"></span> — число признаков; в нашем примере это 4 и 2.
</p>

<p>
  Смотреть на неё стоит так: найдите ось <span class="math-inline" data-tex="N"></span>
  и проследите, где она появляется и где исчезает. Она входит с батчем, доживает до столбца
  остатков, ещё раз всплывает в сигнале ошибки — и пропадает ровно там, где
  <span class="math-inline" data-tex="X^\top"></span> сворачивает её в градиент.
</p>

<p>Посмотрим пошагово, как формы стыкуются между собой.</p>


<div class="stage" id="stageDM" tabindex="0">
  <div class="stage-figure">
<svg id="dm" viewBox="0 0 960 600" role="img" aria-label="Карта размерностей: прямой проход, обратный и шаг">
  <style>
    #dm { font-family: Helvetica, Arial, sans-serif; }
    #dm .lbl { font-size: 16px; fill: #111111; }
    #dm .cap { font-size: 13px; fill: #5E5850; }
    #dm .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #dm .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #dm .val { font-size: 14px; fill: #111111; }
    #dm .mm  { font-size: 12px; fill: #5E5850; }
    #dm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="dm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="dm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="dm-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>

<text x="480" y="62" class="cap" text-anchor="middle">все формы одной картинкой: N объектов, P признаков</text>
<g data-key="f">
<text x="40" y="82" class="cap" text-anchor="start">ПРЯМОЙ ПРОХОД</text>
<rect x="40" y="112" width="90" height="96" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="85.0" y1="112" x2="85.0" y2="208" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="136.0" x2="130" y2="136.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="160.0" x2="130" y2="160.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="184.0" x2="130" y2="184.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="85" y="100" text-anchor="middle" font-size="13" fill="#111111">N × P</text>
<text x="85" y="232" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">X</text>
<text x="148" y="164" class="lbl" text-anchor="middle">·</text>
<rect x="166" y="132" width="40" height="56" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="166" y1="160.0" x2="206" y2="160.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="186" y="120" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="186" y="212" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
<text x="224" y="164" class="lbl" text-anchor="middle">+</text>
<rect x="242" y="148" width="40" height="28" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<text x="262" y="136" text-anchor="middle" font-size="13" fill="#111111">1</text>
<text x="262" y="200" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
<text x="300" y="164" class="lbl" text-anchor="middle">=</text>
<rect x="318" y="112" width="40" height="96" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="318" y1="136.0" x2="358" y2="136.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="318" y1="160.0" x2="358" y2="160.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="318" y1="184.0" x2="358" y2="184.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="338" y="100" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="338" y="232" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
<text x="376" y="164" class="lbl" text-anchor="middle">−</text>
<rect x="394" y="112" width="40" height="96" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="394" y1="136.0" x2="434" y2="136.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="394" y1="160.0" x2="434" y2="160.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="394" y1="184.0" x2="434" y2="184.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="414" y="100" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="414" y="232" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">y</text>
<text x="452" y="164" class="lbl" text-anchor="middle">=</text>
<rect x="470" y="112" width="40" height="96" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/>
<line x1="470" y1="136.0" x2="510" y2="136.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="470" y1="160.0" x2="510" y2="160.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="470" y1="184.0" x2="510" y2="184.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="490" y="100" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="490" y="232" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">r</text>
<line x1="518" y1="160" x2="556" y2="160" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#dm-arr)"/>
<rect x="570" y="132" width="130" height="56" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="635" y="160" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">L</text>
<text x="635" y="182" class="cap" text-anchor="middle">1 × 1</text>
</g>
<g data-key="b1">
<text x="40" y="254" class="cap" text-anchor="start">ОБРАТНЫЙ ПРОХОД</text>
<rect x="40" y="284" width="40" height="96" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/>
<line x1="40" y1="308.0" x2="80" y2="308.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="332.0" x2="80" y2="332.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="356.0" x2="80" y2="356.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="60" y="272" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="60" y="404" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">r</text>
<text x="98" y="336" class="lbl" text-anchor="middle">·</text>
<text x="126" y="342" class="lbl" text-anchor="middle">2/N</text>
<text x="154" y="336" class="lbl" text-anchor="middle">=</text>
<rect x="172" y="284" width="40" height="96" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="172" y1="308.0" x2="212" y2="308.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="172" y1="332.0" x2="212" y2="332.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="172" y1="356.0" x2="212" y2="356.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="192" y="272" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="192" y="404" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂ŷ</text>
</g>
<g data-key="b2">
<rect x="280" y="300" width="130" height="64" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="312.5" y1="300" x2="312.5" y2="364" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="345.0" y1="300" x2="345.0" y2="364" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="377.5" y1="300" x2="377.5" y2="364" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="280" y1="332.0" x2="410" y2="332.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="345" y="288" text-anchor="middle" font-size="13" fill="#111111">P × N</text>
<text x="345" y="388" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">Xᵀ</text>
<text x="428" y="336" class="lbl" text-anchor="middle">·</text>
<rect x="446" y="284" width="40" height="96" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="446" y1="308.0" x2="486" y2="308.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="446" y1="332.0" x2="486" y2="332.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="446" y1="356.0" x2="486" y2="356.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="466" y="272" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="466" y="404" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂ŷ</text>
<text x="504" y="336" class="lbl" text-anchor="middle">=</text>
<rect x="522" y="300" width="40" height="64" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="522" y1="332.0" x2="562" y2="332.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="542" y="288" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="542" y="388" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
</g>
<g data-key="b3">
<rect x="620" y="316" width="130" height="32" rx="2" fill="#9A9489" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="652.5" y1="316" x2="652.5" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="685.0" y1="316" x2="685.0" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="717.5" y1="316" x2="717.5" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="685" y="304" text-anchor="middle" font-size="13" fill="#111111">1 × N</text>
<text x="685" y="372" text-anchor="middle" font-size="17" fill="#6E6960" font-weight="700" font-style="italic">1ᵀ</text>
<text x="768" y="336" class="lbl" text-anchor="middle">·</text>
<text x="806" y="336" class="lbl" text-anchor="middle">→</text>
<rect x="830" y="316" width="40" height="32" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<text x="850" y="304" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="850" y="372" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∂L/∂b</text>
</g>
<g data-key="s">
<text x="40" y="426" class="cap" text-anchor="start">ШАГ</text>
<rect x="40" y="456" width="40" height="64" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="40" y1="488.0" x2="80" y2="488.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="60" y="444" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="60" y="544" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
<text x="98" y="492" class="lbl" text-anchor="middle">−</text>
<text x="126" y="498" class="lbl" text-anchor="middle">η ·</text>
<rect x="154" y="456" width="40" height="64" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="154" y1="488.0" x2="194" y2="488.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="174" y="444" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="174" y="544" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
<text x="212" y="492" class="lbl" text-anchor="middle">=</text>
<rect x="230" y="456" width="40" height="64" rx="2" fill="#C29E08" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="230" y1="488.0" x2="270" y2="488.0" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="250" y="444" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="250" y="544" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="rule" data-only="1">
<rect x="330" y="440" width="590" height="96" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="348" y="466" class="cap" text-anchor="start">ДВЕ ПРОВЕРКИ, КОТОРЫЕ ЛОВЯТ ПОЧТИ ВСЁ</text>
<text x="348" y="494" class="val" text-anchor="start">1. в каждом произведении внутренние размеры совпадают</text>
<text x="348" y="520" class="val" text-anchor="start">2. форма градиента равна форме своего параметра</text>
</g>
<text x="40" y="580" class="legend" text-anchor="start">N — число объектов в батче, P — число признаков · в нашем примере N = 4, P = 2</text>
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
      <div class="step-kicker">Шаг 1 · прямой проход</div>
      <h4>Ось объектов проходит насквозь</h4>
<p>N входит в X и выходит в r: сколько домов дали, столько промахов получили. P исчезает при первом же умножении.</p>
<p><div class="math-display" data-tex="[N,P]\cdot[P,1] \rightarrow [N,1], \qquad [N,1] - [N,1] \rightarrow [N,1], \qquad [N,1] \rightarrow [1]"></div></p>
    </div>
    <div class="step-panel" data-on="f b1" data-focus="b1">
      <div class="step-kicker">Шаг 2 · сигнал ошибки</div>
      <h4>Форма та же, что у предсказаний</h4>
<p>Умножение на скаляр 2/N ничего с формой не делает. Это единственная величина обратного прохода, которая живёт на оси объектов.</p>
    </div>
    <div class="step-panel" data-on="b1 b2" data-focus="b2">
      <div class="step-kicker">Шаг 3 · градиент весов</div>
      <h4>Транспонирование меняет местами N и P</h4>
<p>Xᵀ имеет форму P × N, поэтому в произведении с сигналом ошибки сокращается именно N, а остаётся P. Это и есть техническая причина, по которой в формуле стоит транспонирование.</p>
<p><div class="math-display" data-tex="[P,N]\cdot[N,1] \rightarrow [P,1]"></div></p>
    </div>
    <div class="step-panel" data-on="b1 b3" data-focus="b3">
      <div class="step-kicker">Шаг 4 · градиент сдвига</div>
      <h4>Строка из единиц сворачивает столбец в число</h4>
<p>Формально это умножение на <span class="math-inline" data-tex="\mathbf{1}^\top"></span> формы 1 × N, практически — просто сумма. Результат имеет форму 1 × 1, как и сам сдвиг.</p>
    </div>
    <div class="step-panel" data-on="s" data-focus="s">
      <div class="step-kicker">Шаг 5 · шаг</div>
      <h4>Вычитание требует совпадения форм буквально</h4>
<p>Здесь и становится видно, зачем нужна вся возня с транспонированием: если бы градиент имел форму 1 × P, эта строка просто не выполнилась бы.</p>
    </div>
    <div class="step-panel" data-on="f b2 rule" data-focus="rule">
      <div class="step-kicker">Шаг 6 · две проверки</div>
      <h4>Они ловят почти все ошибки реализации</h4>
<p>Прежде чем искать опечатку в числах, проверьте формы. Внутренние размеры в каждом произведении должны совпадать, а каждый градиент — повторять форму своего параметра.</p>
<p>Обе проверки делаются на бумаге за минуту и не требуют ни одного вычисления.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> проверка форм ловит почти все ошибки реализации.
  Прежде чем искать опечатку в числах, убедитесь, что в каждом произведении совпадают
  внутренние размеры, а каждый градиент повторяет форму своего параметра. Обе проверки делаются
  на бумаге за минуту.
</div>

---

## Часть 13. От таблицы к коду — три версии одного и того же

<p>
  Соберём всю математику в код. В реальных проектах данные читают из CSV, выгружают из базы
  или получают через API. Здесь оставим небольшой набор прямо в коде, чтобы путь от таблицы
  до обученной модели можно было проследить по каждому шагу.
</p>

### Данные: список → pandas → NumPy

<p>
  Данные удобно держать таблицей в pandas, а в NumPy переводить только те столбцы, которые нужны
  модели: признаки <span class="math-inline" data-tex="X"></span> и таргет
  <span class="math-inline" data-tex="\mathbf{y}"></span>.
</p>

<pre><code>import numpy as np
import pandas as pd

# Шаг 1. Сырые данные — как выгрузка объявлений о продаже.
# Каждый дом это словарь; на практике сюда же легли бы строки из CSV или БД.
listings = [
    {"address": "12 Кленовая",   "area_m2": 40,  "age_years": 20, "price_mln": 4.14},
    {"address": "5 Дубовая",     "area_m2": 80,  "age_years": 10, "price_mln": 7.85},
    {"address": "71 Сосновая",   "area_m2": 60,  "age_years": 40, "price_mln": 4.90},
    {"address": "9 Кедровая",    "area_m2": 100, "age_years": 20, "price_mln": 9.55},
    # ... всего 150 строк в обучающей выборке
]

# Шаг 2. Кладём в pandas — теперь это привычная таблица.
df = pd.DataFrame(listings)
print(df.head())
print(df[["area_m2", "age_years", "price_mln"]].describe())   # взгляд на разброс

# Шаг 3. Достаём в NumPy только нужные колонки: признаки X и таргет y.
# Модель работает с числовыми массивами, а не с DataFrame.
X = df[["area_m2", "age_years"]].to_numpy(dtype=float)   # (n, 2)
y = df["price_mln"].to_numpy(dtype=float)                # (n,)</code></pre>

<div class="callout-blue">
  <strong>Почему признаки делят на десять:</strong> площадь измеряется десятками и сотнями,
  возраст — единицами и десятками. Если оставить как есть, у одного признака градиент окажется
  на порядок больше просто из-за единиц измерения, и допустимый шаг спуска упадёт в тысячи раз.
  Приведение к одному масштабу — самое дешёвое, что можно сделать для устойчивости.
</div>

<pre><code># Масштабирование: площадь в десятках м², возраст в десятках лет.
# Ровно то, что в статье записано как x1 и x2.
X = X / np.array([10.0, 10.0])

# Более общий приём — стандартизация к среднему 0 и разбросу 1:
# X = (X - X.mean(axis=0)) / X.std(axis=0)</code></pre>

### Версия 1. Просто функции на NumPy

<p>
  Это «голая» математика из частей 6–11: модель — матричное умножение, обучение — цикл
  forward → loss → backward → update. Каждая строка здесь уже выведена выше вручную.
</p>

<pre><code>def forward(X, w, b):                  # FORWARD: ŷ = X · w + b
    return X @ w + b                   # [n,2]·[2,1] → [n,1]

def mse(yhat, y):                      # LOSS: средний квадрат ошибки
    return np.mean((yhat - y) ** 2)

def gradients(X, y, yhat):             # BACKWARD: выведено в части 9
    r = yhat - y                       # остатки, [n]
    g = 2 / len(y) * r                 # сигнал ошибки
    return X.T @ g, g.sum()            # ∂L/∂w — [2], ∂L/∂b — число

w = np.array([0.7, -0.2])              # стартовая догадка из части 7
b = 1.0
eta = 0.01                             # learning rate — длина шага

for step in range(3000):               # тот самый цикл из четырёх действий
    yhat = forward(X, w, b)
    dw, db = gradients(X, y, yhat)
    w -= eta * dw                      # UPDATE: θ ← θ − η · ∂L/∂θ
    b -= eta * db

print(np.round(w, 4), round(b, 4))     # [0.8751 -0.36 ] 1.3869
print(round(mse(forward(X, w, b), y), 4))   # 0.1049</code></pre>

<div class="console-title">Результат прогона · настоящий вывод</div>
<div class="console"><span class="cmd">$ python3 train.py</span>
шаг    потеря обуч   потеря отл
    0      1.6718   1.6553
    1      0.2149   —
   30      0.1196   —
  300      0.1092   —
 3000      0.1049   0.0967
w = [0.8751, -0.36]  b = 1.3869
<span class="chi">правило данных: [0.9, -0.35]  b = 1.2</span>
</div>

### Проверка градиента без формул

<p>
  Прежде чем доверять выведенному вручную backward, его стоит сверить с численной производной.
  Приём универсальный и работает для любой модели.
</p>

<pre><code>def numeric_grad(X, y, w, b, eps=1e-6):
    g = np.zeros_like(w)
    for p in range(len(w)):
        e = np.zeros_like(w); e[p] = eps
        g[p] = (mse(forward(X, w + e, b), y) -
                mse(forward(X, w - e, b), y)) / (2 * eps)
    gb = (mse(forward(X, w, b + eps), y) -
          mse(forward(X, w, b - eps), y)) / (2 * eps)
    return g, gb

# на батче из четырёх домов расхождение — 7.4e-10</code></pre>

### Аналитическое решение без градиентного спуска

<p>
  Для линейной регрессии минимум MSE можно получить напрямую методом наименьших квадратов.
  Это исключение, а не правило: для нейросети такой формулы не существует.
</p>

<pre><code># w = (XᵀX)⁻¹ Xᵀy — столбец единиц берёт на себя сдвиг b.
Xb = np.hstack([X, np.ones((len(y), 1))])
theta = np.linalg.solve(Xb.T @ Xb, Xb.T @ y)

print(np.round(theta, 4))   # [ 0.8747 -0.3602  1.3901 ]
# те же числа, что дали 3000 шагов спуска выше</code></pre>

### Версия 2. Тот же код, но в объектном виде

<p>
  Математика не меняется: те же forward, loss, градиенты и шаг складываются в класс. Это переход
  к тому, как модели устроены в библиотеках.
</p>

<pre><code>class LinearRegression:
    def __init__(self, n_features):
        self.w = np.zeros(n_features)      # веса признаков
        self.b = 0.0                       # сдвиг

    def forward(self, X):                  # FORWARD
        return X @ self.w + self.b

    def loss(self, yhat, y):               # LOSS
        return np.mean((yhat - y) ** 2)

    def backward(self, X, y, yhat):        # BACKWARD
        g = 2 / len(y) * (yhat - y)
        self.dw = X.T @ g
        self.db = g.sum()

    def step(self, eta):                   # UPDATE
        self.w -= eta * self.dw
        self.b -= eta * self.db

    def fit(self, X, y, eta=0.01, epochs=3000):
        for _ in range(epochs):
            yhat = self.forward(X)
            self.backward(X, y, yhat)
            self.step(eta)

model = LinearRegression(n_features=2)
model.fit(X, y)
print(np.round(model.w, 4), round(model.b, 4))</code></pre>

### Версия 3. PyTorch и autograd

<p>
  Цикл остаётся тем же, но ручной вывод градиентов заменяется вызовом
  <code>loss.backward()</code>. PyTorch строит ровно тот граф, который мы рисовали в части 8,
  и проходит по нему в обратном порядке, перемножая те же локальные производные.
</p>

<pre><code>import torch
import torch.nn as nn

Xt = torch.tensor(X, dtype=torch.float32)
yt = torch.tensor(y, dtype=torch.float32).unsqueeze(1)

model = nn.Linear(2, 1)                    # MODEL: ŷ = X·w + b
loss_fn = nn.MSELoss()                     # LOSS
opt = torch.optim.SGD(model.parameters(), lr=0.01)   # UPDATE

for step in range(3000):
    yhat = model(Xt)                       # FORWARD
    loss = loss_fn(yhat, yt)               # LOSS
    opt.zero_grad()                        # обнулить прошлые градиенты
    loss.backward()                        # BACKWARD — вместо наших формул
    opt.step()                             # UPDATE

print(model.weight.detach().numpy().round(4),
      model.bias.detach().numpy().round(4))</code></pre>

<div class="callout-yellow">
  <strong>Зачем <code>zero_grad</code>:</strong> PyTorch накапливает градиенты, а не перезаписывает.
  Если не обнулить их перед <code>backward()</code>, к новому градиенту прибавится старый,
  и шаг уйдёт не туда. Это самая частая ошибка в первом самостоятельно написанном цикле обучения.
</div>

### Итоговая карта одного шага обучения

<table class="shape-table">
  <tr><th>Действие</th><th>Формула</th><th>NumPy</th><th>PyTorch</th></tr>
  <tr><td>forward</td><td><span class="math-inline" data-tex="\hat{\mathbf{y}} = X\mathbf{w} + b"></span></td><td><code>X @ w + b</code></td><td><code>model(Xt)</code></td></tr>
  <tr><td>loss</td><td><span class="math-inline" data-tex="L = \frac{1}{N}\mathbf{r}^\top\mathbf{r}"></span></td><td><code>((yhat - y) ** 2).mean()</code></td><td><code>loss_fn(yhat, yt)</code></td></tr>
  <tr><td>backward</td><td><span class="math-inline" data-tex="\nabla_{\mathbf{w}} L = \frac{2}{N}X^\top\mathbf{r}"></span></td><td><code>X.T @ g</code></td><td><code>loss.backward()</code></td></tr>
  <tr><td>update</td><td><span class="math-inline" data-tex="\theta \leftarrow \theta - \eta\nabla_\theta L"></span></td><td><code>w -= eta * dw</code></td><td><code>opt.step()</code></td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> между формулами из этой статьи и строчками PyTorch нет
  разрыва. Библиотека не делает ничего, кроме того, что мы посчитали руками, — она только
  выполняет это быстрее и не требует выводить производные заново для каждой новой модели.
</div>


---

## Часть 14. Анатомия обучения: так устроены все модели

<p>
  Всё, что разобрано выше, — не особенность линейной регрессии. Это скелет обучения любой
  модели с градиентным спуском. Меняется содержимое блоков, но не их порядок, и теперь,
  когда каждое звено посчитано руками, на этот скелет можно посмотреть целиком.
</p>

<p>Посмотрим пошагово, из каких блоков состоит обучение любой модели.</p>


<div class="stage" id="stageCY" tabindex="0">
  <div class="stage-figure">
<svg id="cy" viewBox="0 0 960 560" role="img" aria-label="Анатомия обучения: Task, Data, Model, Loss и цикл между ними">
  <style>
    #cy { font-family: Helvetica, Arial, sans-serif; }
    #cy .lbl { font-size: 16px; fill: #111111; }
    #cy .cap { font-size: 13px; fill: #5E5850; }
    #cy .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #cy .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #cy .val { font-size: 14px; fill: #111111; }
    #cy .mm  { font-size: 12px; fill: #5E5850; }
    #cy .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="cy-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="cy-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="cy-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">дома → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">предсказания ŷ</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">остатки r</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>

<text x="480" y="62" class="cap" text-anchor="middle">Task — Data — Model — Loss. Один и тот же каркас для всех ML-моделей</text>
<rect x="40" y="88" width="430" height="420" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="66" y="126" font-size="20" fill="#111111" text-anchor="start" font-weight="800">Анатомия обучения</text>
<text x="66" y="166" font-size="16" fill="#111111" text-anchor="start">У любой модели — от линейной</text>
<text x="66" y="192" font-size="16" fill="#111111" text-anchor="start">регрессии до GPT — обучение</text>
<text x="66" y="218" font-size="16" fill="#111111" text-anchor="start">устроено одинаково.</text>
<text x="66" y="258" font-size="16" fill="#111111" text-anchor="start" font-weight="700">Всегда есть четыре блока:</text>
<text x="94" y="292" font-size="16" fill="#3576C0" text-anchor="start" font-weight="700">Task</text>
<text x="140" y="292" font-size="16" fill="#111111" text-anchor="start">— что мы вообще делаем</text>
<text x="94" y="320" font-size="16" fill="#3576C0" text-anchor="start" font-weight="700">Data</text>
<text x="140" y="320" font-size="16" fill="#111111" text-anchor="start">— примеры (x, y)</text>
<text x="94" y="348" font-size="16" fill="#3576C0" text-anchor="start" font-weight="700">Model</text>
<text x="150" y="348" font-size="16" fill="#111111" text-anchor="start">— то, что обучаем</text>
<text x="94" y="376" font-size="16" fill="#C30B0A" text-anchor="start" font-weight="700">Loss</text>
<text x="140" y="376" font-size="16" fill="#111111" text-anchor="start">— насколько ошибается</text>
<text x="66" y="416" font-size="16" fill="#111111" text-anchor="start">И один цикл, который повторяется</text>
<text x="66" y="442" font-size="16" fill="#111111" text-anchor="start">тысячи раз: модель предсказывает,</text>
<text x="66" y="468" font-size="16" fill="#111111" text-anchor="start">loss считает ошибку, модель обновляется.</text>
<g data-key="task">
<rect x="534" y="96" width="250" height="74" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="659" y="130" font-size="18" fill="#3576C0" text-anchor="middle" font-weight="700">Task</text>
<text x="659" y="156" font-size="13" fill="#5E5850" text-anchor="middle">определяет вид Loss</text>
<line x1="659" y1="174" x2="659" y2="232" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#cy-arw)"/>
</g>
<g data-key="loss">
<rect x="534" y="240" width="250" height="128" rx="14" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
<text x="659" y="274" font-size="18" fill="#C30B0A" text-anchor="middle" font-weight="700">Loss</text>
<text x="659" y="300" font-size="13" fill="#5E5850" text-anchor="middle">L = «насколько</text>
<text x="659" y="322" font-size="13" fill="#5E5850" text-anchor="middle">модель ошиблась»</text>
<text x="659" y="344" font-size="13" fill="#5E5850" text-anchor="middle">→ одно число</text>
</g>
<g data-key="data">
<rect x="800" y="240" width="134" height="128" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="867" y="274" font-size="18" fill="#3576C0" text-anchor="middle" font-weight="700">Data</text>
<text x="867" y="300" font-size="13" fill="#5E5850" text-anchor="middle">(x, y)</text>
<text x="867" y="322" font-size="13" fill="#5E5850" text-anchor="middle">примеры:</text>
<text x="867" y="344" font-size="13" fill="#5E5850" text-anchor="middle">вход и правда</text>
<line x1="796" y1="304" x2="786" y2="304" stroke="#5E5850" stroke-width="1.4" fill="none" marker-end="url(#cy-arw)"/>
</g>
<g data-key="model">
<rect x="534" y="424" width="250" height="74" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="659" y="458" font-size="18" fill="#3576C0" text-anchor="middle" font-weight="700">Model</text>
<text x="659" y="484" font-size="13" fill="#5E5850" text-anchor="middle">принимает x → даёт ŷ</text>
</g>
<g data-key="cycle" data-only="1">
<path d="M 580 420 L 580 374" fill="none" stroke="#C29E08" stroke-width="2.4" marker-end="url(#cy-arw)"/>
<text x="560" y="400" font-size="15" fill="#8F7406" text-anchor="end" font-weight="700">ŷ</text>
<path d="M 740 374 L 740 420" fill="none" stroke="#C30B0A" stroke-width="2.4" stroke-dasharray="6 4" marker-end="url(#cy-arr)"/>
<text x="756" y="400" font-size="14" fill="#9C0908" text-anchor="start" font-weight="700">градиенты</text>
</g>
<text x="40" y="546" class="legend" text-anchor="start">синие блоки — что задаёт задача · красный — то, что измеряет промах и порождает градиенты</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="task loss data model" data-focus="task loss data model">
      <div class="step-kicker">Шаг 1 · четыре блока</div>
      <h4>Каркас, который не меняется</h4>
<p>У любой задачи машинного обучения есть Task, Data, Model и Loss. Всё остальное — детали реализации: какая именно модель внутри и как считается градиент.</p>
<p>Эта часть стоит в конце статьи не случайно: теперь у каждого из четырёх слов есть конкретное содержание, которое вы посчитали руками.</p>
    </div>
    <div class="step-panel" data-on="task loss data model" data-focus="task">
      <div class="step-kicker">Шаг 2 · Task</div>
      <h4>Задача определяет всё остальное</h4>
<p>Мы предсказываем цену — непрерывное число. Отсюда следует и выбор функции потерь: для регрессии берут квадрат ошибки, для классификации — кросс-энтропию.</p>
<p>Task — единственный блок, который не выбирают: он приходит извне вместе с задачей.</p>
    </div>
    <div class="step-panel" data-on="task loss data model" data-focus="data">
      <div class="step-kicker">Шаг 3 · Data</div>
      <h4>Пары «вход — правильный ответ»</h4>
<p>Для нас это 150 домов: две матрицы одинаковой высоты, X и y. Данные не меняются при обучении и целиком определяют, чему модель способна научиться.</p>
<p>В части 1 было видно, что это ограничение реальное: по одной площади потеря 0,4213, по двум признакам — 0,1049.</p>
    </div>
    <div class="step-panel" data-on="task loss data model" data-focus="model">
      <div class="step-kicker">Шаг 4 · Model</div>
      <h4>То, что обучаем</h4>
<p>Здесь это три числа и правило <span class="math-inline" data-tex="\hat{\mathbf{y}} = X\mathbf{w} + b"></span>. В логистической регрессии добавится сигмоида, в нейросети — несколько слоёв, в трансформере — миллиарды весов.</p>
<p>Модель принимает x и выдаёт ŷ. Больше от неё ничего не требуется.</p>
    </div>
    <div class="step-panel" data-on="task loss data model" data-focus="loss">
      <div class="step-kicker">Шаг 5 · Loss</div>
      <h4>Одно число, которое можно уменьшать</h4>
<p>Loss сравнивает ŷ с настоящим ответом и выдаёт скаляр. Именно скаляр: по столбцу остатков нельзя сказать, какая модель лучше, а по одному числу — можно.</p>
<p>И у этого числа есть производная по каждому параметру — то, ради чего всё и затевалось.</p>
    </div>
    <div class="step-panel" data-on="task loss data model cycle" data-focus="cycle">
      <div class="step-kicker">Шаг 6 · цикл</div>
      <h4>Предсказание вперёд, градиенты назад</h4>
<p>Модель отдаёт ŷ в Loss, Loss возвращает градиенты в Model. Один оборот — один шаг обучения; таких оборотов тысячи.</p>
<p>Именно этот круг мы прошли по частям: forward в частях 6 и 7, потеря там же, backward в частях 8–10, шаг в части 11. Ничего сверх этого в обучении не происходит — ни у линейной регрессии, ни у языковой модели.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<p>
  Меняется только содержимое блоков. Вот как выглядит та же таблица для трёх разных моделей.
</p>

<table class="shape-table">
  <tr><th>Блок</th><th>Линейная регрессия</th><th>Логистическая регрессия</th><th>Полносвязная сеть</th></tr>
  <tr><td>Прямой проход</td><td><span class="math-inline" data-tex="X\mathbf{w}+b"></span></td><td><span class="math-inline" data-tex="\sigma(X\mathbf{w}+b)"></span></td><td>несколько слоёв <span class="math-inline" data-tex="AW+\mathbf{b}"></span> с активациями</td></tr>
  <tr><td>Потеря</td><td>MSE</td><td>кросс-энтропия</td><td>кросс-энтропия или MSE</td></tr>
  <tr><td>Сигнал ошибки</td><td><span class="math-inline" data-tex="\frac{2}{N}\mathbf{r}"></span></td><td><span class="math-inline" data-tex="\frac{1}{N}(\hat{\mathbf{y}}-\mathbf{y})"></span></td><td>то же, дальше — через слои</td></tr>
  <tr><td>Градиент весов</td><td><span class="math-inline" data-tex="X^\top\delta"></span></td><td><span class="math-inline" data-tex="X^\top\delta"></span></td><td><span class="math-inline" data-tex="A^\top\delta"></span> на каждом слое</td></tr>
  <tr><td>Шаг</td><td colspan="3"><span class="math-inline" data-tex="\theta\leftarrow\theta-\eta\nabla_\theta L"></span> — одинаково везде</td></tr>
</table>

<p>
  Обратите внимание на строку с градиентом весов: она совпадает у всех трёх моделей.
  Транспонированная матрица входов, умноженная на сигнал ошибки, — это не формула линейной
  регрессии, а общее правило для линейного слоя, откуда бы сигнал ни пришёл.
</p>

<p>Весь шаг обучения на numpy умещается в шесть строк, и каждая уже разобрана:</p>

<pre><code>for step in range(3000):
    yhat = X @ w + b          # forward, часть 5
    r    = yhat - y           # остатки
    g    = 2 / len(y) * r     # сигнал ошибки, часть 8
    w   -= eta * (X.T @ g)    # градиент весов
    b   -= eta * g.sum()      # градиент сдвига
</code></pre>

<p>
  В PyTorch первые четыре строки заменяются на <code>L.backward()</code>, но происходит там
  ровно то же самое: библиотека строит тот же граф из части 7 и проходит по нему в обратном
  порядке, перемножая те же локальные производные.
</p>

### Что ломается, если сдвинуть одно условие

<table class="shape-table">
  <tr><th>Эксперимент</th><th>Что получилось</th></tr>
  <tr><td>Шаг длиннее порога</td><td>η = 0,01 → 0,1049; η = 0,02 → веса улетают на 214-м шаге. Порог 2/λ<sub>max</sub> = 0,0185</td></tr>
  <tr><td>Признаки в исходных единицах</td><td>обусловленность 65 682 вместо 680, порог шага 0,00019; η = 0,001 разносит модель за 15 шагов</td></tr>
  <tr><td>Размер батча</td><td>150 → 0,1049; 16 → 0,1110; 4 → 0,1146; 1 → 0,1553</td></tr>
  <tr><td>Обучение на трёх домах</td><td>на них потеря ровно 0, на отложенных 0,1936 против 0,0967</td></tr>
</table>

<p>
  Последняя строка — самая важная. Три дома и три параметра дают систему, которая решается
  точно: потеря на обучении становится нулём, а веса выходят
  <span class="math-inline" data-tex="(0{,}818;\ -0{,}438)"></span> при
  <span class="math-inline" data-tex="b = 1{,}744"></span> — далеко от правила, породившего
  данные. Нулевая потеря на обучении означает не успех, а то, что модель выучила шум.
</p>

### Что важно уметь восстановить по памяти

<div class="end-list">
  <ol>
    <li>Данные — две матрицы одинаковой высоты: <span class="math-inline" data-tex="X\in\mathbb{R}^{N\times P}"></span> и <span class="math-inline" data-tex="\mathbf{y}\in\mathbb{R}^{N\times 1}"></span>. Строка — объект, столбец — признак.</li>
    <li>Модель — <span class="math-inline" data-tex="P+1"></span> чисел: <span class="math-inline" data-tex="\hat{\mathbf{y}} = X\mathbf{w} + b"></span>. Матричная запись считает ту же сумму по индексам, но не удлиняется.</li>
    <li>Потеря — <span class="math-inline" data-tex="L = \frac{1}{N}\mathbf{r}^\top\mathbf{r}"></span>, где <span class="math-inline" data-tex="\mathbf{r} = \hat{\mathbf{y}} - \mathbf{y}"></span>. Корень из неё возвращает единицы ответа.</li>
    <li>Локальные производные: <span class="math-inline" data-tex="\partial\ell/\partial\hat y = 2r"></span>, <span class="math-inline" data-tex="\partial\hat y/\partial w_p = x_p"></span>, <span class="math-inline" data-tex="\partial\hat y/\partial b = 1"></span>.</li>
    <li>Цепное правило перемножает их вдоль пути и суммирует по объектам — отсюда <span class="math-inline" data-tex="\nabla_{\mathbf{w}}L = \frac{2}{N}X^\top\mathbf{r}"></span>.</li>
    <li><span class="math-inline" data-tex="X^\top"></span> появляется затем, чтобы свернуть ось объектов и оставить ось признаков.</li>
    <li>Размножение сдвига вперёд оборачивается суммированием назад: <span class="math-inline" data-tex="\partial L/\partial b = \frac{2}{N}\sum_n r_n"></span>.</li>
    <li>Форма градиента всегда равна форме параметра. Это первая проверка любой выкладки.</li>
    <li>Аналитический градиент сверяется численно: <span class="math-inline" data-tex="(L(\theta+\varepsilon)-L(\theta-\varepsilon))/2\varepsilon"></span> при <span class="math-inline" data-tex="\varepsilon=10^{-6}"></span>.</li>
    <li>Шаг — <span class="math-inline" data-tex="\theta \leftarrow \theta - \eta\nabla_\theta L"></span>. Направление даёт градиент, длину выбирают; порог устойчивости <span class="math-inline" data-tex="2/\lambda_{\max}"></span>.</li>
  </ol>
</div>

<p>
  Если вы поняли линейную регрессию, каркас современных моделей у вас в кармане. Дальше идут
  вариации: другие архитектуры, другие функции потерь, другие оптимизаторы. Цикл обучения
  остаётся тем же — forward, потеря, backward, шаг, миллионы раз.
</p>

<p class="tiny">
  Данные синтетические: 200 домов порождены правилом
  <span class="math-inline" data-tex="y = 0{,}9x_1 - 0{,}35x_2 + 1{,}2 + \varepsilon"></span> с
  <span class="math-inline" data-tex="\varepsilon \sim \mathcal{N}(0;\ 0{,}35^2)"></span>, цены округлены до второго знака,
  выборка разбита на 150 обучающих и 50 отложенных. Все прочие числа посчитаны скриптом
  на этих данных; величины прямого прохода на батче из четырёх домов точны без округления.
  Градиенты сверены с центральными разностями, расхождение 7,4 · 10⁻¹⁰.
</p>

