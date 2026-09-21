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
  Логистическая регрессия — это линейная регрессия, к которой добавили одну функцию.
  Разберём цикл обучения целиком: где появляется сигмоида, почему её производная исчезает
  из формул и почему в итоге градиент выглядит проще, чем у линейной модели.
</p>

<p>
  Статья самодостаточна: все формулы выводятся здесь же, из определения производной
  и правила цепочки, и ни одна не берётся готовой. Из математики нужны только производная
  сложной функции и умножение матриц. Всё остальное — арифметика, показанная целиком,
  вместе со слагаемыми, из которых сложилось каждое число.
</p>

<p>
  Порядок такой. Сначала задача и данные на плоскости, потом сигмоида, которую можно подвигать
  руками. Затем модель как один нейрон и она же в матричной записи. Потом прямой проход —
  в формах и в числах, обратный — на графе, в матрицах и в числах. В конце шаг спуска, карта
  размерностей, весь цикл кодом и анатомия обучения, общая для всех моделей.
</p>

<div class="reading-contract">
  <div class="contract-card"><span>На входе</span><strong>Производная сложной функции и умножение матриц</strong><p>Больше ничего не нужно: остальное выводится в статье с нуля.</p></div>
  <div class="contract-card"><span>Сквозной пример</span><strong>Четыре студента из ста пятидесяти</strong><p>Один батч проходит все формулы статьи, а затем — полный прогон в 3000 шагов.</p></div>
  <div class="contract-card"><span>На выходе</span><strong>Цикл обучения целиком</strong><p>Вы сможете написать обучение на голом numpy и объяснить каждое число в его логе.</p></div>
</div>

<div class="semantic-key">
  <span>данные: признаки и метки</span>
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
  Задача такая: у нас есть группа студентов, для каждого известно, сколько часов он готовился
  и сколько занятий пропустил, а также чем кончился экзамен — сдал или нет. Хочется выучить
  зависимость, чтобы по этим двум числам оценивать шансы новых студентов.
</p>

<p>
  Это задача классификации — предсказание метки, а не числа. Ответ здесь нельзя «немного
  промахнуть»: студент либо сдал, либо нет, середины в данных не бывает. Но модель всё равно
  отвечает числом — вероятностью. Так и получается обучаемая задача: вероятность непрерывна,
  её можно понемногу двигать, а значит, по ней можно взять производную.
</p>

<p>
  Вот как выглядят данные. Признаки приведены к удобному масштабу заранее: часы подготовки
  считаем десятками часов, пропуски — десятками занятий.
</p>

<table class="shape-table">
  <tr><th>#</th><th>Часы, дес. ч</th><th>Пропуски, дес. занятий</th><th>Сдал</th></tr>
  <tr><td>1</td><td>2,0</td><td>0,5</td><td>0</td></tr>
  <tr><td>2</td><td>4,0</td><td>0,2</td><td>1</td></tr>
  <tr><td>3</td><td>3,0</td><td>1,0</td><td>0</td></tr>
  <tr><td>4</td><td>2,0</td><td>0,9</td><td>1</td></tr>
</table>

<div class="callout-blue">
  <strong>Почему признаки поделены на десять:</strong> чтобы числа были одного порядка.
  Часы в исходных единицах дают значения около 35, пропуски — около 7, и признаки разъезжаются
  впятеро. В части 14 видно, что это не косметика: та же скорость обучения на неотнормированных
  признаках разваливает модель.
</div>

<p>Посмотрим пошагово, как задача выглядит на плоскости.</p>

<div class="stage" id="stageTK" tabindex="0">
  <div class="stage-figure">
<svg id="tk" viewBox="0 0 960 592" role="img" aria-label="Постановка задачи: студенты, точки, константа, промахи, log loss и лучшая кривая">
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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">слева — что происходит, справа — те же студенты на плоскости</text>
<g data-key="c1" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Задача</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">У нас есть группа студентов.</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">Про каждого известно:</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">   • сколько часов он готовился</text>
<text x="68" y="250" font-size="16" fill="#111111" text-anchor="start">   • сдал он экзамен или нет</text>
<text x="68" y="294" font-size="16" fill="#111111" text-anchor="start" font-weight="700">Хотим выучить зависимость:</text>
<text x="68" y="320" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">вероятность сдать ≈ f(часы)</text>
<text x="68" y="364" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">ФИЧА X — то, что подаём на вход</text>
<text x="68" y="390" font-size="14" fill="#5F9420" text-anchor="start" font-weight="700">ТАРГЕТ y — 0 или 1, без середины</text>
</g>
<g data-key="c2" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Смотрим на данные</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Каждая точка — один студент.</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">Внизу те, кто не сдал (y = 0),</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">наверху — сдавшие (y = 1).</text>
<text x="68" y="268" font-size="16" fill="#111111" text-anchor="start">Видна закономерность:</text>
<text x="68" y="294" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">больше часов — чаще сдают.</text>
<text x="68" y="338" font-size="14" fill="#5E5850" text-anchor="start">Но точки не разделяются чисто: есть</text>
<text x="68" y="364" font-size="14" fill="#5E5850" text-anchor="start">сдавшие с малой подготовкой и наоборот.</text>
</g>
<g data-key="c3" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Самая простая модель</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Что если всем называть одну и ту же</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">вероятность — долю сдавших?</text>
<text x="68" y="242" font-size="17" fill="#111111" text-anchor="start" font-weight="700">ŷ = 0,50 для любого студента</text>
<text x="68" y="286" font-size="16" fill="#111111" text-anchor="start">Часы подготовки при этом</text>
<text x="68" y="312" font-size="16" fill="#9C0908" text-anchor="start" font-weight="700">игнорируются полностью.</text>
<text x="68" y="356" font-size="14" fill="#5E5850" text-anchor="start">Плохо — но с чем-то надо сравнивать.</text>
</g>
<g data-key="c4" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Промахи модели</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Ответ y — это 0 или 1, а модель</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">выдаёт число между ними.</text>
<text x="68" y="242" font-size="16" fill="#111111" text-anchor="start" font-weight="700">промах = ŷ − y</text>
<text x="68" y="286" font-size="16" fill="#111111" text-anchor="start">Красные отрезки — расстояния от метки</text>
<text x="68" y="312" font-size="16" fill="#111111" text-anchor="start">студента до линии предсказания.</text>
<text x="68" y="356" font-size="15" fill="#9C0908" text-anchor="start" font-weight="700">Чем длиннее отрезки, тем хуже модель.</text>
</g>
<g data-key="c5" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Функция потерь: log loss</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Сводим промахи к одному числу. Но</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">платим не за длину отрезка, а за</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">уверенность в неверном ответе:</text>
<text x="68" y="268" font-size="16" fill="#111111" text-anchor="start" font-weight="700">L = среднее (−ln вероятности правды)</text>
<text x="68" y="312" font-size="16" fill="#111111" text-anchor="start">Сказать «сдаст с вероятностью 0,99»</text>
<text x="68" y="338" font-size="16" fill="#111111" text-anchor="start">про несдавшего — стоит очень дорого.</text>
<text x="68" y="364" font-size="15" fill="#2A5E9B" text-anchor="start" font-weight="700">Цель обучения — сделать L меньше.</text>
</g>
<g data-key="c6" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#F4FAEC" stroke="#73B222" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Лучшая кривая</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Прямая здесь не годится: она уходит</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">выше единицы и ниже нуля.</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">Подберём S-образную кривую:</text>
<text x="68" y="268" font-size="17" fill="#111111" text-anchor="start" font-weight="700">ŷ = σ(1,45 · часы − 4,79)</text>
<text x="68" y="312" font-size="16" fill="#111111" text-anchor="start">Она всегда лежит между 0 и 1 и</text>
<text x="68" y="338" font-size="16" fill="#111111" text-anchor="start">отвечает вероятностью, а не «да/нет».</text>
<text x="68" y="364" font-size="15" fill="#5F9420" text-anchor="start" font-weight="700">Это и есть логистическая регрессия.</text>
</g>
<g data-key="c7" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Чего не хватает</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Часть точек кривая объясняет плохо.</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">Два студента с одинаковой подготовкой</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">сдают по-разному, если один ходил на</text>
<text x="68" y="250" font-size="16" fill="#111111" text-anchor="start">занятия, а другой пропускал.</text>
<text x="68" y="294" font-size="16" fill="#111111" text-anchor="start" font-weight="700">Добавим второй признак — пропуски.</text>
<text x="68" y="320" font-size="15" fill="#9C0908" text-anchor="start" font-weight="700">одни часы:  L 0,3517 · верно 85,3 %</text>
<text x="68" y="346" font-size="15" fill="#5F9420" text-anchor="start" font-weight="700">часы и пропуски:  L 0,2709 · 90,0 %</text>
<text x="68" y="372" font-size="14" fill="#5E5850" text-anchor="start">Дальше в статье модель двухпризнаковая.</text>
</g>
<g data-key="c8" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Как называют параметры</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">В статистике коэффициенты логистической</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">регрессии пишут как β̂₁ и β̂₀.</text>
<text x="68" y="242" font-size="16" fill="#111111" text-anchor="start">В машинном обучении принята другая</text>
<text x="68" y="268" font-size="16" fill="#111111" text-anchor="start">запись: веса обозначают буквой w,</text>
<text x="68" y="294" font-size="16" fill="#111111" text-anchor="start">а сдвиг буквой b.</text>
<text x="68" y="338" font-size="18" fill="#111111" text-anchor="start" font-weight="700">ŷ = σ(w · x + b)</text>
<text x="68" y="364" font-size="16" fill="#111111" text-anchor="start">У каждого признака свой вес, b один.</text>
</g>
<g data-key="tab" data-only="1">
<text x="720" y="106" font-size="13" fill="#5E5850" text-anchor="middle">фрагмент таблицы</text>
<rect x="530" y="118" width="190" height="30" rx="8" fill="#3576C0"/>
<text x="625" y="138" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">часы — фича X</text>
<rect x="726" y="118" width="190" height="30" rx="8" fill="#73B222"/>
<text x="821" y="138" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">сдал — таргет y</text>
<rect x="530" y="154" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="173" font-size="15" fill="#111111" text-anchor="middle">20</text>
<text x="821" y="173" font-size="15" fill="#111111" text-anchor="middle">0</text>
<rect x="530" y="184" width="386" height="28" fill="#FFFFFF" stroke="#E1E5EA"/>
<text x="625" y="203" font-size="15" fill="#111111" text-anchor="middle">35</text>
<text x="821" y="203" font-size="15" fill="#111111" text-anchor="middle">0</text>
<rect x="530" y="214" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="233" font-size="15" fill="#111111" text-anchor="middle">40</text>
<text x="821" y="233" font-size="15" fill="#111111" text-anchor="middle">1</text>
<rect x="530" y="244" width="386" height="28" fill="#FFFFFF" stroke="#E1E5EA"/>
<text x="625" y="263" font-size="15" fill="#111111" text-anchor="middle">40</text>
<text x="821" y="263" font-size="15" fill="#111111" text-anchor="middle">0</text>
<rect x="530" y="274" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="293" font-size="15" fill="#111111" text-anchor="middle">50</text>
<text x="821" y="293" font-size="15" fill="#111111" text-anchor="middle">1</text>
<rect x="530" y="304" width="386" height="28" fill="#FFFFFF" stroke="#E1E5EA"/>
<text x="625" y="323" font-size="15" fill="#111111" text-anchor="middle">55</text>
<text x="821" y="323" font-size="15" fill="#111111" text-anchor="middle">1</text>
<rect x="530" y="334" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="353" font-size="15" fill="#111111" text-anchor="middle">60</text>
<text x="821" y="353" font-size="15" fill="#111111" text-anchor="middle">1</text>
<text x="720" y="386" font-size="13" fill="#5E5850" text-anchor="middle">… всего 150 строк в обучающей выборке</text>
</g>
<g data-key="pts" data-only="1">
<line x1="546.0" y1="420.0" x2="924.0" y2="420.0" stroke="#5E5850" stroke-width="1.2"/>
<line x1="546.0" y1="112.0" x2="546.0" y2="420.0" stroke="#5E5850" stroke-width="1.2"/>
<text x="735" y="458" text-anchor="middle" font-size="12" fill="#5E5850">часы подготовки, десятки часов</text>
<text x="540" y="102.0" font-size="12" fill="#5E5850">вероятность сдать</text>
<text x="604.2" y="438" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<text x="662.3" y="438" text-anchor="middle" font-size="12" fill="#5E5850">2</text>
<text x="720.5" y="438" text-anchor="middle" font-size="12" fill="#5E5850">3</text>
<text x="778.6" y="438" text-anchor="middle" font-size="12" fill="#5E5850">4</text>
<text x="836.8" y="438" text-anchor="middle" font-size="12" fill="#5E5850">5</text>
<text x="894.9" y="438" text-anchor="middle" font-size="12" fill="#5E5850">6</text>
<text x="538" y="403.3" text-anchor="end" font-size="12" fill="#5E5850">0</text>
<line x1="546.0" y1="399.3" x2="924.0" y2="399.3" stroke="#ECECEC" stroke-width="1"/>
<text x="538" y="274.0" text-anchor="end" font-size="12" fill="#5E5850">0,5</text>
<line x1="546.0" y1="270.0" x2="924.0" y2="270.0" stroke="#ECECEC" stroke-width="1"/>
<text x="538" y="144.7" text-anchor="end" font-size="12" fill="#5E5850">1</text>
<line x1="546.0" y1="140.7" x2="924.0" y2="140.7" stroke="#ECECEC" stroke-width="1"/>
<circle cx="778.6" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="575.1" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="662.3" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="749.5" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="865.8" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="807.7" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="633.2" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="836.8" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="749.5" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="778.6" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="894.9" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="874.3" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="691.4" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="720.5" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="583.6" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="604.2" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="758.0" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="633.2" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="699.9" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="670.8" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="882.8" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="816.2" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<text x="930" y="124.7" text-anchor="end" font-size="12" fill="#5F9420">сдали</text>
<text x="930" y="423.3" text-anchor="end" font-size="12" fill="#9C0908">не сдали</text>
</g>
<g data-key="cst" data-only="1">
<line x1="546.0" y1="270.0" x2="924.0" y2="270.0" stroke="#C29E08" stroke-width="2.8"/>
<text x="916" y="260.0" font-size="13" fill="#8F7406" text-anchor="end" font-weight="700">ŷ = 0,50 для всех</text>
</g>
<g data-key="rc" data-only="1">
<line x1="778.6" y1="140.7" x2="778.6" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="575.1" y1="399.3" x2="575.1" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="662.3" y1="399.3" x2="662.3" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="749.5" y1="399.3" x2="749.5" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="865.8" y1="140.7" x2="865.8" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="807.7" y1="140.7" x2="807.7" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="633.2" y1="399.3" x2="633.2" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="836.8" y1="140.7" x2="836.8" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="749.5" y1="140.7" x2="749.5" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="778.6" y1="399.3" x2="778.6" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="894.9" y1="140.7" x2="894.9" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="874.3" y1="140.7" x2="874.3" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="691.4" y1="399.3" x2="691.4" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="720.5" y1="399.3" x2="720.5" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="583.6" y1="399.3" x2="583.6" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="604.2" y1="399.3" x2="604.2" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="758.0" y1="140.7" x2="758.0" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="633.2" y1="140.7" x2="633.2" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="699.9" y1="399.3" x2="699.9" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="670.8" y1="399.3" x2="670.8" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="882.8" y1="140.7" x2="882.8" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="816.2" y1="140.7" x2="816.2" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
</g>
<g data-key="mb" data-only="1">
<rect x="560" y="470" width="350" height="70" rx="14" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
<text x="735" y="496" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">log loss = 0,6931</text>
<text x="735" y="518" font-size="13" fill="#5E5850" text-anchor="middle">ровно ln 2 — модель не знает ничего</text>
</g>
<g data-key="fit" data-only="1">
<polyline points="546.0,397.2 553.3,396.7 560.5,396.2 567.8,395.6 575.1,394.9 582.3,394.1 589.6,393.1 596.9,391.9 604.2,390.4 611.4,388.7 618.7,386.7 626.0,384.4 633.2,381.6 640.5,378.4 647.8,374.6 655.0,370.3 662.3,365.3 669.6,359.6 676.8,353.1 684.1,345.8 691.4,337.7 698.7,328.8 705.9,319.1 713.2,308.8 720.5,297.9 727.7,286.5 735.0,274.9 742.3,263.2 749.5,251.6 756.8,240.3 764.1,229.4 771.3,219.2 778.6,209.7 785.9,200.9 793.2,192.9 800.4,185.8 807.7,179.4 815.0,173.8 822.2,168.9 829.5,164.7 836.8,161.0 844.0,157.9 851.3,155.2 858.6,152.9 865.8,151.0 873.1,149.3 880.4,147.9 887.7,146.8 894.9,145.8 902.2,144.9 909.5,144.2 916.7,143.7 924.0,143.2" fill="none" stroke="#73B222" stroke-width="3"/>
<text x="916" y="368.3" font-size="13" fill="#5F9420" text-anchor="end" font-weight="700">ŷ = σ(1,45 x − 4,79)</text>
</g>
<g data-key="rf" data-only="1">
<line x1="778.6" y1="140.7" x2="778.6" y2="209.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="575.1" y1="399.3" x2="575.1" y2="394.9" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="662.3" y1="399.3" x2="662.3" y2="365.3" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="749.5" y1="399.3" x2="749.5" y2="251.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="865.8" y1="140.7" x2="865.8" y2="151.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="807.7" y1="140.7" x2="807.7" y2="179.4" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="633.2" y1="399.3" x2="633.2" y2="381.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="836.8" y1="140.7" x2="836.8" y2="161.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="749.5" y1="140.7" x2="749.5" y2="251.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="778.6" y1="399.3" x2="778.6" y2="209.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="894.9" y1="140.7" x2="894.9" y2="145.8" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="874.3" y1="140.7" x2="874.3" y2="151.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="691.4" y1="399.3" x2="691.4" y2="337.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="720.5" y1="399.3" x2="720.5" y2="297.9" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="583.6" y1="399.3" x2="583.6" y2="394.9" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="604.2" y1="399.3" x2="604.2" y2="390.4" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="758.0" y1="140.7" x2="758.0" y2="251.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="633.2" y1="140.7" x2="633.2" y2="381.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="699.9" y1="399.3" x2="699.9" y2="337.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="670.8" y1="399.3" x2="670.8" y2="365.3" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="882.8" y1="140.7" x2="882.8" y2="151.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="816.2" y1="140.7" x2="816.2" y2="179.4" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
</g>
<g data-key="ms" data-only="1">
<rect x="560" y="470" width="350" height="70" rx="14" fill="#F4FAEC" stroke="#73B222" stroke-width="1.5"/>
<text x="735" y="496" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">log loss = 0,3770</text>
<text x="735" y="518" font-size="13" fill="#5E5850" text-anchor="middle">почти вдвое меньше, чем у константы</text>
</g>
<g data-key="nt" data-only="1">
<rect x="520" y="470" width="420" height="70" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="730" y="496" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">ŷ = σ(w · x + b)</text>
<text x="730" y="518" font-size="13" fill="#5E5850" text-anchor="middle">w — вес признака, b — сдвиг, σ — сигмоида</text>
</g>
<text x="40" y="572" class="legend" text-anchor="start">зелёные точки — сдали · красные — нет · жёлтая линия — константа · зелёная кривая — обученная модель</text>
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
<p>Про каждого студента известно несколько чисел, и одно из них объявляем ответом. Часы подготовки — фича, «сдал или нет» — таргет.</p>
<p>Отличие от регрессии в одном: таргет принимает только два значения, 0 и 1. Промежуточных ответов в данных не бывает.</p>
    </div>
    <div class="step-panel" data-on="c2 pts" data-focus="pts">
      <div class="step-kicker">Шаг 2 · смотрим на точки</div>
      <h4>Метки лежат на двух уровнях, а не на кривой</h4>
<p>Каждый студент — точка. По горизонтали часы подготовки, по вертикали метка: внизу не сдавшие, наверху сдавшие.</p>
<p>На картинке 22 студента из 150. Слева почти все внизу, справа почти все наверху, а в середине классы перемешаны — и это не шум измерений, а реальная неопределённость.</p>
    </div>
    <div class="step-panel" data-on="c3 pts cst" data-focus="cst">
      <div class="step-kicker">Шаг 3 · самая простая модель</div>
      <h4>Предсказываем всем одну вероятность</h4>
<p>Возьмём модель, которая для любого студента называет одну и ту же вероятность — долю сдавших. На этих 22 студентах она равна ровно 0,50.</p>
<p>Часы при этом игнорируются полностью. Модель заведомо плохая, и это удобно: будет с чем сравнивать.</p>
    </div>
    <div class="step-panel" data-on="c4 pts cst rc" data-focus="rc">
      <div class="step-kicker">Шаг 4 · сколько модель ошибается</div>
      <h4>Промах — расстояние от метки до предсказания</h4>
<p>У сдавших модель занижает вероятность, у несдавших завышает. Длина каждого красного отрезка и есть промах на этом студенте.</p>
<p>Но складывать длины отрезков — плохая идея. Ошибиться на 0,49 и на 0,99 совсем не одно и то же: во втором случае модель была уверена и оказалась неправа.</p>
    </div>
    <div class="step-panel" data-on="c5 pts cst rc mb" data-focus="mb">
      <div class="step-kicker">Шаг 5 · сводим промахи в одно число</div>
      <h4>Log loss наказывает за уверенность в неправде</h4>
<p>За каждого студента платим минус логарифмом той вероятности, которую модель дала правильному ответу, и берём среднее.</p>
<p><div class="math-display" data-tex="L = -\frac{1}{N}\sum_{n=1}^{N}\bigl[y_n\ln\hat y_n + (1-y_n)\ln(1-\hat y_n)\bigr]"></div></p><p>У константы 0,50 получается ровно ln 2 = 0,6931 — столько стоит честное «не знаю».</p>
    </div>
    <div class="step-panel" data-on="c6 pts fit rf ms" data-focus="fit ms">
      <div class="step-kicker">Шаг 6 · находим лучшую кривую</div>
      <h4>Сигмоида вместо прямой</h4>
<p>Прямая для вероятности не подходит: продлите её вправо — и получите значение больше единицы. Поэтому линейную часть пропускают через сигмоиду, которая сжимает любое число в отрезок от 0 до 1.</p>
<p>Подобранная кривая даёт log loss 0,3770 против 0,6931 у константы и угадывает 19 студентов из 22.</p>
    </div>
    <div class="step-panel" data-on="c7 pts fit" data-focus="c7">
      <div class="step-kicker">Шаг 7 · чего не хватает</div>
      <h4>Одни часы объясняют не всё</h4>
<p>В середине картинки классы по-прежнему перемешаны. Часть этой путаницы объясняет второй признак, которого на графике нет: пропущенные занятия.</p>
<p>На всех 150 студентах одни часы дают потерю 0,3517 и 85,3 % верных ответов, а часы вместе с пропусками — 0,2709 и 90,0 %. Поэтому дальше модель двухпризнаковая.</p>
    </div>
    <div class="step-panel" data-on="c8 pts fit nt" data-focus="c8 nt">
      <div class="step-kicker">Шаг 8 · как принято обозначать</div>
      <h4>В машинном обучении это w и b</h4>
<p>В учебниках статистики коэффициенты логистической регрессии пишут как β̂₁ и β̂₀. В машинном обучении договорились иначе: параметры при признаках называют весами и обозначают w, а свободный член — сдвигом b.</p>
<p>Причина практическая: признаков бывает много, и удобно, когда у каждого свой вес с номером — w₁, w₂, w₃, — а сдвиг остаётся один. Вся дальнейшая статья написана в этих обозначениях.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> в классификации ответ дискретный, а обучаемая величина —
  непрерывная. Модель предсказывает вероятность, потеря измеряет, насколько уверенно эта
  вероятность промахнулась, и именно потерю мы будем уменьшать. Решение «сдаст или нет»
  появляется в самом конце, сравнением с порогом.
</div>

---

## Часть 2. Сигмоида, вероятность и log loss

<p>
  При одном признаке модель задаёт кривую. Вес управляет её крутизной, сдвиг — положением
  по горизонтали: он говорит, при скольких часах подготовки шансы сравниваются. Точки данных
  лежат на двух уровнях, 0 и 1, а кривая проходит между ними.
</p>

<p>
  Прежде чем выводить формулы, эту связь полезно почувствовать руками. Подвигайте ползунки
  и посмотрите, что происходит с кривой и с числами внизу.
</p>

<div class="lr-live-stage" id="lineFitInteractive">
  <div class="lr-live-head"><strong>Интерактив: двигайте сигмоиду и наблюдайте log loss</strong>
    <p>Красные пунктирные отрезки — промахи: расстояния от метки студента до кривой.</p></div>
  <div class="lr-live-grid">
    <div class="lr-live-figure"><svg id="lineFitSvg" viewBox="0 0 700 420" role="img" aria-label="Точки данных, сигмоида и промахи"><style>#lineFitSvg { font-family: Helvetica, Arial, sans-serif; }</style></svg></div>
    <div class="lr-controls">
      <div class="lr-control"><label for="lineW">Вес w <output id="lineWOut">1,00</output></label>
        <input id="lineW" type="range" min="0" max="4" value="1" step="0.05"></div>
      <div class="lr-control"><label for="lineB">Сдвиг b <output id="lineBOut">−3,00</output></label>
        <input id="lineB" type="range" min="-12" max="2" value="-3" step="0.1"></div>
      <div class="lr-live-metrics">
        <div class="lr-metric"><span>log loss</span><strong id="lineLoss">—</strong></div>
        <div class="lr-metric"><span>верных ответов</span><strong id="lineAcc">—</strong></div>
      </div>
      <div class="lr-live-formula" id="lineFormula">ŷ = σ(1,00 · x − 3,00)</div>
      <p class="lr-live-note">Лучшее, чего можно добиться на этих 22 студентах: w = 1,45, b = −4,79, log loss = 0,3770 при 19 верных из 22.</p>
    </div>
  </div>
</div>

<script>
(function () {
  var pts = [[4,1],[0.5,0],[2,0],[3.5,0],[5.5,1],[4.5,1],[1.5,0],[5,1],[3.5,1],[4,0],[6,1],[5.5,1],[2.5,0],[3,0],[0.5,0],[1,0],[3.5,1],[1.5,1],[2.5,0],[2,0],[5.5,1],[4.5,1]];
  var svg = document.getElementById('lineFitSvg');
  if (!svg) return;
  var P = {l: 64, r: 668, t: 40, b: 350, xmin: 0, xmax: 6.6};
  function sx(v) { return P.l + (v - P.xmin) / (P.xmax - P.xmin) * (P.r - P.l); }
  function sy(v) { return P.b - v * (P.b - P.t); }
  function sig(z) { return 1 / (1 + Math.exp(-z)); }
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
    for (var i = 1; i <= 6; i++) {
      svg.appendChild(el('line', {x1: sx(i), y1: P.t, x2: sx(i), y2: P.b, stroke: '#ECECEC', 'stroke-width': 1}));
      svg.appendChild(label(sx(i), P.b + 20, i, 'middle'));
    }
    [0, 0.5, 1].forEach(function (v) {
      svg.appendChild(el('line', {x1: P.l, y1: sy(v), x2: P.r, y2: sy(v), stroke: '#ECECEC', 'stroke-width': 1}));
      svg.appendChild(label(P.l - 10, sy(v) + 4, fmt(v, 1), 'end'));
    });
    svg.appendChild(el('line', {x1: P.l, y1: P.b, x2: P.r, y2: P.b, stroke: '#5E5850', 'stroke-width': 1.2}));
    svg.appendChild(el('line', {x1: P.l, y1: P.t, x2: P.l, y2: P.b, stroke: '#5E5850', 'stroke-width': 1.2}));
    svg.appendChild(label(P.r, P.b + 44, 'часы подготовки, десятки часов', 'end'));
    svg.appendChild(label(P.l - 6, P.t - 14, 'вероятность сдать'));
    var d = [];
    for (var t = 0; t <= 132; t++) {
      var xv = P.xmin + (P.xmax - P.xmin) * t / 132;
      d.push((t ? 'L' : 'M') + sx(xv) + ' ' + sy(sig(w * xv + b)));
    }
    svg.appendChild(el('path', {d: d.join(' '), fill: 'none', stroke: '#73B222', 'stroke-width': 3}));
    var seen = {};
    pts.forEach(function (p) {
      var key = p[0] + '_' + p[1];
      var n = seen[key] || 0;
      seen[key] = n + 1;
      var px = sx(p[0]) + n * 9;
      var pred = sig(w * p[0] + b);
      svg.appendChild(el('line', {x1: px, y1: sy(p[1]), x2: px, y2: sy(pred),
                                  stroke: '#C30B0A', 'stroke-width': 1.7, 'stroke-dasharray': '3 3', opacity: 0.85}));
      svg.appendChild(el('circle', {cx: px, cy: sy(p[1]), r: 5.5, fill: p[1] ? '#73B222' : '#C30B0A',
                                    'fill-opacity': 0.8, stroke: '#ffffff', 'stroke-width': 1.2}));
    });
  }
  function update() {
    var w = +document.getElementById('lineW').value;
    var b = +document.getElementById('lineB').value;
    var sum = 0, right = 0;
    pts.forEach(function (p) {
      var q = sig(w * p[0] + b);
      q = Math.min(Math.max(q, 1e-12), 1 - 1e-12);
      sum += -(p[1] * Math.log(q) + (1 - p[1]) * Math.log(1 - q));
      if ((q > 0.5 ? 1 : 0) === p[1]) right += 1;
    });
    sum /= pts.length;
    document.getElementById('lineWOut').textContent = fmt(w, 2);
    document.getElementById('lineBOut').textContent = fmt(b, 2).replace('-', '−');
    document.getElementById('lineLoss').textContent = fmt(sum, 4);
    document.getElementById('lineAcc').textContent = right + ' из 22';
    document.getElementById('lineFormula').textContent =
      'ŷ = σ(' + fmt(w, 2) + ' · x ' + (b >= 0 ? '+ ' : '− ') + fmt(Math.abs(b), 2) + ')';
    draw(w, b);
  }
  document.getElementById('lineW').addEventListener('input', update);
  document.getElementById('lineB').addEventListener('input', update);
  update();
})();
</script>

<p>
  Обратите внимание на две метрики. Точность считает только попадания и не различает
  «угадал еле-еле» и «угадал уверенно»: её можно не сдвинуть вовсе, сильно изменив кривую.
  Log loss видит каждую вероятность по отдельности, поэтому именно её и минимизируют.
</p>

### Почему не прямая

<p>
  Первое, что приходит в голову, — обучить обычную линейную регрессию на метках 0 и 1.
  Не работает по двум причинам сразу. Прямая не ограничена: при шестидесяти часах подготовки
  она выдаст 1,4, а это не вероятность. И она не насыщается: студент, готовившийся вдвое дольше
  всех остальных, тянет прямую на себя, хотя про него и так всё ясно.
</p>

<p>
  Поэтому линейную часть оставляют как есть, а поверх ставят функцию, которая сжимает любое
  число в отрезок от нуля до единицы:
</p>

<p><div class="math-display" data-tex="\hat y = \sigma(z) = \frac{1}{1 + e^{-z}}, \qquad z = wx + b"></div></p>

<p>
  Величину <span class="math-inline" data-tex="z"></span> называют логитом. У сигмоиды есть
  обратная функция, и она объясняет название: логит — это логарифм отношения шансов.
</p>

<p><div class="math-display" data-tex="z = \ln\frac{\hat y}{1 - \hat y}"></div></p>

<p>
  Отсюда читается смысл весов. Вес 0,8 у часов означает: каждые десять часов подготовки
  увеличивают логит на 0,8, то есть умножают шансы сдать на
  <span class="math-inline" data-tex="e^{0{,}8} \approx 2{,}2"></span>. Не вероятность,
  а именно шансы — отношение «сдам» к «не сдам».
</p>

### Откуда берётся log loss

<p>
  Функцию потерь здесь не изобретают, а выводят. Модель заявляет вероятность каждого исхода;
  вероятность того, что она предсказала весь обучающий набор правильно, — это произведение
  по всем студентам:
</p>

<p><div class="math-display" data-tex="\prod_{n=1}^{N} \hat y_n^{\,y_n}\,(1-\hat y_n)^{1-y_n}"></div></p>

<p>
  Показатели степени работают как переключатель: при
  <span class="math-inline" data-tex="y_n = 1"></span> остаётся
  <span class="math-inline" data-tex="\hat y_n"></span>, при
  <span class="math-inline" data-tex="y_n = 0"></span> — <span class="math-inline" data-tex="1-\hat y_n"></span>.
  Произведение сотен маленьких чисел неудобно и вычислительно опасно, поэтому берут логарифм —
  он превращает произведение в сумму. Максимизировать сумму логарифмов — то же самое, что
  минимизировать её со знаком минус, а деление на <span class="math-inline" data-tex="N"></span>
  делает результат сравнимым между батчами:
</p>

<p><div class="math-display" data-tex="L = -\frac{1}{N}\sum_{n=1}^{N}\bigl[y_n\ln\hat y_n + (1-y_n)\ln(1-\hat y_n)\bigr]"></div></p>

<table class="shape-table">
  <tr><th>Шаг</th><th>Что делает</th></tr>
  <tr><td>Вероятность правды</td><td>из двух чисел ŷ и 1 − ŷ выбирает то, которое соответствует метке</td></tr>
  <tr><td>Логарифм с минусом</td><td>превращает произведение в сумму и наказывает уверенную ошибку без предела</td></tr>
  <tr><td>Среднее</td><td>возвращает один скаляр, сопоставимый между батчами разного размера</td></tr>
</table>

<div class="callout-blue">
  <strong>Почему не квадрат ошибки:</strong> его можно посчитать и здесь, но обучаться будет
  плохо. На обратном проходе у MSE появляется множитель
  <span class="math-inline" data-tex="\hat y(1-\hat y)"></span>, а он близок к нулю там,
  где модель уверена. Если она уверенно ошиблась — сказала 0,99 про несдавшего, — сигнал ошибки
  у MSE окажется в 50,5 раза слабее, чем у log loss, и исправляться модель будет мучительно
  долго. На нашем батче из четырёх студентов градиент по весу часов выходит −0,2516 у log loss
  и −0,0570 у MSE. Вдобавок MSE поверх сигмоиды невыпукла: у одного объекта
  <span class="math-inline" data-tex="x = 1,\ y = 1"></span> вторая производная становится
  отрицательной при <span class="math-inline" data-tex="w &lt; -\ln 2"></span>.
</div>

<div class="callout-yellow">
  <strong>Ноль и единица в предсказании запрещены.</strong> Log loss берёт логарифм, поэтому
  <span class="math-inline" data-tex="\hat y = 0"></span> у сдавшего даёт бесконечность.
  Сигмоида никогда не выдаёт ровно ноль математически, но в float64 выдаёт: при
  <span class="math-inline" data-tex="z &lt; -745"></span> получается настоящий ноль.
  Поэтому на практике потерю считают не через <code>log(sigmoid(z))</code>, а сразу через
  логиты — устойчивой формулой, которую мы разберём в части 13.
</div>

### Как принято обозначать параметры

<p>
  В учебниках статистики коэффициенты логистической регрессии пишут как
  <span class="math-inline" data-tex="\hat\beta_1"></span> и
  <span class="math-inline" data-tex="\hat\beta_0"></span>. В машинном обучении договорились
  иначе: параметры при признаках называют весами и обозначают
  <span class="math-inline" data-tex="w"></span>, а свободный член — сдвигом
  <span class="math-inline" data-tex="b"></span> (от bias).
</p>

<p><div class="math-display" data-tex="\hat y = \sigma(\hat\beta_1 x + \hat\beta_0) \qquad\Longleftrightarrow\qquad \hat y = \sigma(wx + b)"></div></p>

<p>
  Причина практическая. Признаков бывает много, и удобно, когда у каждого свой вес с номером —
  <span class="math-inline" data-tex="w_1, w_2, \dots, w_P"></span>, — а сдвиг остаётся один
  на всю модель. В таком виде веса естественно собираются в столбец
  <span class="math-inline" data-tex="\mathbf{w}"></span>, и вся запись становится матричной.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> сигмоида нужна, чтобы ответ стал вероятностью, а log
  loss — чтобы за уверенную ошибку платили дороже, чем за осторожную. Обе функции выбраны не
  из эстетики: первая ограничивает выход, вторая выводится из правдоподобия — и вместе они
  дадут на обратном проходе самое простое, что может быть.
</div>

---

## Часть 3. Модель как один нейрон

<p>
  Модель предполагает, что шансы сдать складываются из вклада часов, вклада пропусков и какой-то
  базовой величины. У такой модели три параметра, и задача обучения — подобрать их так, чтобы
  предсказанные вероятности как можно лучше согласовались с настоящими исходами.
</p>

<p>
  Нарисовать её удобно как один нейрон: два входа, у каждого свой вес, всё сходится в сумматор,
  снизу подмешивается сдвиг, дальше стоит сигмоида, справа выходит вероятность. Ровно эта
  картинка потом повторится в нейросети — там таких нейронов будут тысячи, но устроен каждый
  одинаково.
</p>

<div class="callout-blue">
  <strong>Что означает знак веса:</strong> положительный вес говорит, что признак повышает шансы,
  отрицательный — что понижает. У пропусков вес будет отрицательным, и это не подгонка,
  а то, что модель обнаружит сама.
</div>

<p>Посмотрим пошагово, что происходит с одним студентом внутри модели.</p>

<div class="stage" id="stageNN" tabindex="0">
  <div class="stage-figure">
<svg id="nn" viewBox="0 0 960 500" role="img" aria-label="Модель как один нейрон: два входа, два веса, сдвиг, сигмоида и вероятность">
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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">один студент проходит модель слева направо</text>
<g data-key="inp">
<circle cx="100" cy="150" r="38" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="1.8"/>
<text x="100" y="155.667" text-anchor="middle" font-size="17" fill="#111111">x₁</text>
<circle cx="100" cy="300" r="38" fill="#3576C0" fill-opacity="0.45" stroke="#3576C0" stroke-width="1.8"/>
<text x="100" y="305.667" text-anchor="middle" font-size="17" fill="#111111">x₂</text>
<text x="100" y="100" class="cap" text-anchor="middle">часы</text>
<text x="100" y="358" class="cap" text-anchor="middle">пропуски</text>
</g>
<g data-key="wts">
<line x1="138" y1="165" x2="332" y2="205" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
<line x1="138" y1="285" x2="332" y2="245" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
<text x="232" y="168" text-anchor="middle" font-size="16" fill="#C29E08">w₁</text>
<text x="232" y="290" text-anchor="middle" font-size="16" fill="#C29E08">w₂</text>
</g>
<g data-key="bias">
<circle cx="380" cy="378" r="28" fill="#C29E08" fill-opacity="0.85" stroke="#C29E08" stroke-width="1.8"/>
<text x="380" y="383.333" text-anchor="middle" font-size="16" fill="#FFFFFF">b</text>
<line x1="380" y1="348" x2="380" y2="274" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
</g>
<g data-key="z">
<circle cx="380" cy="225" r="44" fill="#73B222" fill-opacity="0.45" stroke="#73B222" stroke-width="1.8"/>
<text x="380" y="230.667" text-anchor="middle" font-size="17" fill="#111111">z</text>
<text x="380" y="158" class="cap" text-anchor="middle">сумматор · логит</text>
</g>
<g data-key="sg">
<line x1="426" y1="225" x2="472" y2="225" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
<circle cx="520" cy="225" r="44" fill="#C29E08" fill-opacity="0.18" stroke="#C29E08" stroke-width="1.8"/>
<polyline points="493.6,250.9 494.9,250.8 496.2,250.8 497.6,250.7 498.9,250.6 500.2,250.4 501.5,250.2 502.8,250.0 504.2,249.6 505.5,249.2 506.8,248.5 508.1,247.7 509.4,246.7 510.8,245.3 512.1,243.6 513.4,241.5 514.7,239.0 516.0,236.0 517.4,232.6 518.7,228.9 520.0,225.0 521.3,221.1 522.6,217.4 524.0,214.0 525.3,211.0 526.6,208.5 527.9,206.4 529.2,204.7 530.6,203.3 531.9,202.3 533.2,201.5 534.5,200.8 535.8,200.4 537.2,200.0 538.5,199.8 539.8,199.6 541.1,199.4 542.4,199.3 543.8,199.2 545.1,199.2 546.4,199.1" fill="none" stroke="#8F7406" stroke-width="2.2"/>
<text x="520" y="158" class="cap" text-anchor="middle">сигмоида</text>
<text x="520" y="292" class="cap" text-anchor="middle">σ(z) = 1 / (1 + e⁻ᶻ)</text>
</g>
<g data-key="yh">
<line x1="566" y1="225" x2="644" y2="225" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
<circle cx="690" cy="225" r="40" fill="#73B222" fill-opacity="0.45" stroke="#73B222" stroke-width="1.8"/>
<text x="690" y="230.667" text-anchor="middle" font-size="17" fill="#111111">ŷ</text>
<text x="690" y="158" class="cap" text-anchor="middle">вероятность 0…1</text>
</g>
<g data-key="cmp" data-only="1">
<circle cx="690" cy="380" r="34" fill="#3576C0" fill-opacity="0.3" stroke="#3576C0" stroke-width="1.8"/>
<text x="690" y="385.667" text-anchor="middle" font-size="17" fill="#111111">y</text>
<text x="690" y="434" class="cap" text-anchor="middle">0 или 1: сдал или нет</text>
<line x1="690" y1="340" x2="690" y2="270" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
<rect x="752" y="248" width="186" height="84" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.7"/>
<text x="845" y="276" text-anchor="middle" font-size="14" fill="#111111">y = 1:  ℓ = −ln ŷ</text>
<text x="845" y="300" text-anchor="middle" font-size="14" fill="#111111">y = 0:  ℓ = −ln(1 − ŷ)</text>
<text x="845" y="322" class="cap" text-anchor="middle">цена одного студента</text>
<line x1="730" y1="245" x2="748" y2="264" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#nn-arw)"/>
</g>
<text x="40" y="486" class="legend" text-anchor="start">синее — данные · жёлтое — обучаемые числа и операция · зелёное — то, что модель посчитала</text>
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
      <h4>Студент — это два числа</h4>
<p><b>1) x₁, x₂ — вход.</b> Часы подготовки в десятках часов и пропущенные занятия в десятках. Больше модель о студенте ничего не знает.</p>
<p>Эти два числа приходят извне и при обучении не меняются.</p>
    </div>
    <div class="step-panel" data-on="inp wts mm1" data-focus="wts">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>У каждого входа свой множитель</h4>
<p><b>2) w₁, w₂ — веса.</b> По одному на признак: насколько десять часов подготовки повышают шансы и насколько десять пропусков их понижают.</p>
<p>Это первые два из тех чисел, которые модель будет подбирать.</p>
    </div>
    <div class="step-panel" data-on="inp wts z mm1 mm2" data-focus="z">
      <div class="step-kicker">Шаг 3 · взвешенная сумма</div>
      <h4>Складываем произведения</h4>
<p><b>3) z = x₁·w₁ + x₂·w₂ + b.</b> Ровно та же линейная комбинация, что и в линейной регрессии. У неё есть имя — логит.</p>
<p><div class="math-display" data-tex="z = x_1 w_1 + x_2 w_2 + b"></div></p>
    </div>
    <div class="step-panel" data-on="inp wts z bias mm1 mm2" data-focus="bias">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4>Одно число, не привязанное ни к какому признаку</h4>
<p><b>3) … + b.</b> Сдвиг двигает всю кривую вправо или влево: он задаёт, сколько часов нужно «в среднем», чтобы шансы сравнялись.</p>
<p>Без него граница была бы обязана проходить через ноль: студент, не готовившийся ни часа и ничего не пропустивший, получал бы ровно 0,5.</p>
    </div>
    <div class="step-panel" data-on="inp wts z bias sg mm2 mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида</div>
      <h4>Превращает любое число в вероятность</h4>
<p><b>4) ŷ = σ(z).</b> Логит может быть любым числом от минус до плюс бесконечности, а вероятность обязана лежать между нулём и единицей. Сигмоида делает именно это.</p>
<p><div class="math-display" data-tex="\sigma(z) = \frac{1}{1 + e^{-z}}"></div></p><p>Ровно здесь логистическая регрессия отличается от линейной. Всё остальное в статье — то же самое.</p>
    </div>
    <div class="step-panel" data-on="inp wts z bias sg yh mm3" data-focus="yh">
      <div class="step-kicker">Шаг 6 · выход</div>
      <h4>Ответ — вероятность, а не «да/нет»</h4>
<p>При z = 0 сигмоида даёт 0,5, при больших положительных z — почти единицу, при больших отрицательных — почти ноль. Насыщение важно: очень уверенные ответы получаются далеко от границы.</p>
<p>Чтобы получить решение «сдаст или нет», вероятность потом сравнивают с порогом, обычно с 0,5. Но обучается модель на вероятностях, а не на решениях.</p>
    </div>
    <div class="step-panel" data-on="z sg yh cmp mm4" data-focus="cmp">
      <div class="step-kicker">Шаг 7 · промах</div>
      <h4>Сравниваем с настоящей меткой</h4>
<p>Настоящий исход в обучении известен. Модель платит минус логарифмом той вероятности, которую она дала верному ответу.</p>
<p><div class="math-display" data-tex="\ell = -\bigl[y\ln \hat y + (1-y)\ln(1-\hat y)\bigr]"></div></p><p>Формула выглядит как две формулы, но это одна запись: при y = 1 второе слагаемое исчезает, при y = 0 — первое.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> логистическая регрессия отличается от линейной ровно
  одной коробочкой на схеме. Всё, что слева от сигмоиды, — та же взвешенная сумма; всё, что
  справа, — вероятность вместо числа и логарифм вместо квадрата. Три обучаемых числа остаются
  теми же самыми.
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
  признаках и при тысяче. Сигмоида при этом ничего не усложняет: она применяется к каждой клетке
  отдельно.
</p>

<div class="callout-blue">
  <strong>Что означает «сокращение размерностей»:</strong> в произведении
  <span class="math-inline" data-tex="[1\times 2]\cdot[2\times 1]"></span> внутренние числа
  обязаны совпасть, а внешние дают форму результата — <span class="math-inline" data-tex="[1\times 1]"></span>.
  Двойка — это число признаков, и она исчезает: после умножения от студента остаётся одно число.
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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
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
<rect x="360" y="112" width="120" height="44" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="420" y1="112" x2="420" y2="156" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="420" y="100" text-anchor="middle" font-size="13" fill="#111111">1 × 2</text>
<text x="420" y="180" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">x</text>
<text x="420" y="86" class="cap" text-anchor="middle">признаки в строку</text>
</g>
<g data-key="col">
<text x="496" y="140" class="lbl" text-anchor="middle">·</text>
<rect x="512" y="100" width="46" height="88" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="512" y1="144" x2="558" y2="144" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="535" y="88" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="535" y="212" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="mul" data-only="1">
<text x="574" y="140" class="lbl" text-anchor="middle">+</text>
<rect x="590" y="112" width="44" height="44" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<text x="612" y="180" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
<text x="650" y="140" class="lbl" text-anchor="middle">=</text>
<rect x="666" y="112" width="44" height="44" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<text x="688" y="100" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="688" y="180" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">z</text>
<text x="600" y="232" class="cap" text-anchor="middle">[1 × 2] · [2 × 1] = [1 × 1] — внутренние двойки сокращаются</text>
</g>
<g data-key="sg" data-only="1">
<line x1="716" y1="134" x2="748" y2="134" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#mx-arw)"/>
<text x="732" y="112" class="cap" text-anchor="middle">σ</text>
<rect x="760" y="112" width="44" height="44" rx="2" fill="#C29E08" opacity="0.25" stroke="#ffffff" stroke-width="1"/>
<text x="782" y="100" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="782" y="180" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">σ(z)</text>
<line x1="812" y1="134" x2="844" y2="134" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#mx-arw)"/>
<rect x="856" y="112" width="44" height="44" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<text x="878" y="100" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="878" y="180" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
<text x="790" y="256" class="cap" text-anchor="middle">сигмоида применяется к каждой клетке отдельно</text>
</g>
<g data-key="bat" data-only="1">
<rect x="360" y="300" width="120" height="96" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="420" y1="300" x2="420" y2="396" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="360" y1="324" x2="480" y2="324" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="360" y1="348" x2="480" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="360" y1="372" x2="480" y2="372" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="420" y="288" text-anchor="middle" font-size="13" fill="#111111">4 × 2</text>
<text x="420" y="420" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">X</text>
<text x="496" y="354" class="lbl" text-anchor="middle">·</text>
<rect x="512" y="322" width="46" height="52" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="512" y1="348" x2="558" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="535" y="310" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="535" y="398" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
<text x="574" y="354" class="lbl" text-anchor="middle">+</text>
<rect x="590" y="336" width="44" height="26" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<text x="612" y="386" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
<text x="650" y="354" class="lbl" text-anchor="middle">=</text>
<rect x="666" y="300" width="44" height="96" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="666" y1="324" x2="710" y2="324" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="666" y1="348" x2="710" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="666" y1="372" x2="710" y2="372" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="688" y="288" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="688" y="420" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">z</text>
<line x1="716" y1="348" x2="748" y2="348" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#mx-arw)"/>
<text x="732" y="326" class="cap" text-anchor="middle">σ</text>
<rect x="760" y="300" width="44" height="96" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="760" y1="324" x2="804" y2="324" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="760" y1="348" x2="804" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="760" y1="372" x2="804" y2="372" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="782" y="288" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="782" y="420" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
<text x="860" y="340" class="cap" text-anchor="middle">весь батч</text>
<text x="860" y="364" class="cap" text-anchor="middle">одной строкой</text>
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
<p><b>1) x = [x₁ x₂].</b> Порядок фиксируется раз и навсегда: первое число всегда часы, второе всегда пропуски.</p>
<p><div class="math-display" data-tex="\mathbf{x} \in \mathbb{R}^{1\times 2}"></div></p>
    </div>
    <div class="step-panel" data-on="nrn row col mm1" data-focus="col">
      <div class="step-kicker">Шаг 3 · веса в столбец</div>
      <h4>Тот же порядок, что у признаков</h4>
<p><b>2) w = [w₁; w₂].</b> Первая строка столбца — вес часов, вторая — вес пропусков. Именно это соответствие превращает сумму в одну операцию.</p>
<p><div class="math-display" data-tex="\mathbf{w} \in \mathbb{R}^{2\times 1}"></div></p>
    </div>
    <div class="step-panel" data-on="row col mul mm1 mm2" data-focus="mul">
      <div class="step-kicker">Шаг 4 · строка на столбец</div>
      <h4>Внутренние размеры совпали</h4>
<p><b>3) z = x·w + b.</b> Строка проходит по столбцу: элементы с одинаковым номером перемножаются, результаты складываются. Это ровно та же сумма, что была на шаге 1.</p>
<p><div class="math-display" data-tex="\mathbf{x}\mathbf{w} + b = \sum_{p=1}^{P} x_p w_p + b"></div></p><p>Форма результата — 1 × 1, то есть обычное число. Пока всё в точности как у линейной регрессии.</p>
    </div>
    <div class="step-panel" data-on="mul sg mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида</div>
      <h4>Форму не меняет, потому что работает поклеточно</h4>
<p><b>4) ŷ = σ(z).</b> Сигмоида — функция одного числа. К матрице её применяют поэлементно: сколько было клеток, столько и осталось, каждая независимо от соседей.</p>
<p><div class="math-display" data-tex="\sigma\bigl(X\mathbf{w} + b\bigr)_n = \sigma(z_n)"></div></p><p>Это важно для обратного прохода: раз клетки не перемешиваются, производная сигмоиды тоже будет поклеточной.</p>
    </div>
    <div class="step-panel" data-on="sg bat mm3" data-focus="bat">
      <div class="step-kicker">Шаг 6 · весь батч сразу</div>
      <h4>Строки складываются друг под друга</h4>
<p>Если поставить студентов строками в матрицу X, та же операция сделает все предсказания за один раз. Столбец весов при этом остаётся один — модель общая для всех.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} = \sigma(X\mathbf{w} + b) \qquad [4\times 2]\cdot[2\times 1] \rightarrow [4\times 1]"></div></p>
    </div>
    <div class="step-panel" data-on="bat mm3" data-focus="bat">
      <div class="step-kicker">Шаг 7 · зачем это нужно</div>
      <h4>Одна строка кода вместо цикла</h4>
<p>В коде это буквально <code>sigmoid(X @ w + b)</code> — без единого цикла по объектам и без индексов. Библиотеки линейной алгебры выполняют такое умножение на порядки быстрее, чем цикл на Python.</p>
<p>И главное: дальше в статье все формулы — и прямого прохода, и обратного — записаны в этой форме. Индексы больше не понадобятся.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> матричная запись — это соглашение о формах, а не новая
  математика. Она считает ту же сумму, не удлиняется с ростом числа признаков и позволяет
  обработать весь батч без единого цикла, а поэлементная сигмоида не мешает ей ни в чём.
</div>

---

## Часть 5. Прямой проход одного объекта

<p>
  Дальше две части подряд без единого числа. Это сделано намеренно: пока в клетках стоят
  символы, видно устройство операции, а не арифметика. Числа подставим в части 7, по той же
  схеме и в том же порядке.
</p>

<p>
  Начнём с одного студента. На входе строка из двух чисел и столбец той же длины, на выходе —
  одна клетка, которую сигмоида превращает в вероятность. Вся операция целиком укладывается
  в правило «строка идёт по столбцу» плюс одну функцию.
</p>

<p>Посмотрим пошагово, как строка признаков превращается в вероятность.</p>

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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">формы и формулы · чисел здесь нет, они будут в части 7</text>
<g data-key="x">
<rect x="60" y="130" width="130" height="46" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="125" y1="130" x2="125" y2="176" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="125" y="118" text-anchor="middle" font-size="13" fill="#111111">1 × 2</text>
<text x="125" y="200" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">x</text>
</g>
<g data-key="w">
<text x="212" y="160" class="lbl" text-anchor="middle">·</text>
<rect x="234" y="108" width="46" height="90" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="234" y1="153" x2="280" y2="153" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
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
<text x="445" y="200" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">z</text>
</g>
<g data-key="sg">
<line x1="476" y1="153" x2="508" y2="153" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#f1-arw)"/>
<text x="492" y="131" class="cap" text-anchor="middle">σ</text>
<rect x="520" y="130" width="46" height="46" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<text x="543" y="118" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="543" y="200" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
</g>
<g data-key="cmp" data-only="1">
<rect x="520" y="250" width="46" height="46" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<text x="543" y="320" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">y</text>
<text x="543" y="242" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<line x1="543" y1="248" x2="543" y2="186" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#f1-arw)"/>
<line x1="576" y1="153" x2="612" y2="153" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#f1-arr)"/>
<rect x="626" y="122" width="290" height="70" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="771" y="150" text-anchor="middle" font-size="15" fill="#111111">ℓ = −[y ln ŷ + (1 − y) ln(1 − ŷ)]</text>
<text x="771" y="176" class="cap" text-anchor="middle">одно число, как и предсказание</text>
</g>
<g data-key="cell" data-only="1">
<rect x="60" y="130" width="130" height="46" fill="#C30B0A" opacity="0.12"/>
<rect x="60" y="130" width="130" height="46" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="234" y="108" width="46" height="90" fill="#C30B0A" opacity="0.12"/>
<rect x="234" y="108" width="46" height="90" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="422" y="130" width="46" height="46" fill="#C30B0A" opacity="0.14"/>
<rect x="422" y="130" width="46" height="46" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<text x="264" y="232" class="cap" text-anchor="middle">малиновым — строка, столбец и клетка, которая из них получается</text>
</g>
<g data-key="shp" data-only="1">
<rect x="60" y="316" width="840" height="128" rx="12" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/>
<text x="78" y="342" class="cap" text-anchor="start">ПРАВИЛО ФОРМ</text>
<text x="78" y="372" class="val" text-anchor="start">внутренние размеры обязаны совпасть и сокращаются, внешние дают форму результата</text>
<text x="78" y="400" class="val" text-anchor="start">[1 × 2] · [2 × 1] = [1 × 1]        сигмоида, сложение и вычитание форму не меняют</text>
<text x="78" y="428" class="val" text-anchor="start">при P признаках вместо двойки стоит P — и больше ничего не меняется</text>
</g>
<text x="40" y="456" class="legend" text-anchor="start">синее — данные · тёмно-жёлтое — обучаемые числа · зелёное — результат · красное — потеря</text>
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
<p>Один студент лежит строкой: сначала часы, потом пропуски. Форма — 1 × 2.</p>
<p><div class="math-display" data-tex="\mathbf{x} \in \mathbb{R}^{1\times 2}"></div></p>
    </div>
    <div class="step-panel" data-on="x w mm1" data-focus="w">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>Столбец той же длины</h4>
<p>Веса живут отдельно от данных: они одни и те же для всех студентов и меняются только во время обучения. Тёмная заливка на схемах означает ровно это.</p>
<p><div class="math-display" data-tex="\mathbf{w} \in \mathbb{R}^{2\times 1}"></div></p>
    </div>
    <div class="step-panel" data-on="x w z cell mm2" data-focus="cell">
      <div class="step-kicker">Шаг 3 · строка на столбец</div>
      <h4>Два произведения складываются в одну клетку</h4>
<p>Внутренние двойки встречаются и сокращаются, остаётся [1 × 1]. Двойка — это число признаков, и после умножения от студента остаётся одно число.</p>
<p><div class="math-display" data-tex="\mathbf{x}\mathbf{w} = x_1w_1 + x_2w_2 \qquad [1\times 2]\cdot[2\times 1] \rightarrow [1\times 1]"></div></p>
    </div>
    <div class="step-panel" data-on="x w bb z mm2" data-focus="bb z">
      <div class="step-kicker">Шаг 4 · сдвиг и логит</div>
      <h4>Bias прибавляется к готовому числу</h4>
<p>Сдвиг не связан ни с одним признаком. Результат называется логитом: это ещё не вероятность, а произвольное вещественное число.</p>
<p><div class="math-display" data-tex="z = \mathbf{x}\mathbf{w} + b"></div></p>
    </div>
    <div class="step-panel" data-on="z sg mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида</div>
      <h4>Логит становится вероятностью</h4>
<p>Одна клетка на входе, одна на выходе — форма не меняется. Меняется диапазон: любое z превращается в число строго между нулём и единицей.</p>
<p><div class="math-display" data-tex="\hat y = \sigma(z) = \frac{1}{1 + e^{-z}}"></div></p>
    </div>
    <div class="step-panel" data-on="sg cmp mm4" data-focus="cmp">
      <div class="step-kicker">Шаг 6 · потеря</div>
      <h4>Сравнение с меткой даёт скаляр</h4>
<p>Настоящая метка — тоже одно число, но всего из двух возможных. Потеря смотрит, какую вероятность модель дала верному варианту, и берёт минус логарифм.</p>
<p><div class="math-display" data-tex="\ell = -\bigl[y\ln\hat y + (1-y)\ln(1-\hat y)\bigr]"></div></p><p>Если модель угадала уверенно, логарифм близок к нулю. Если уверенно ошиблась, он улетает вверх без предела.</p>
    </div>
    <div class="step-panel" data-on="x w z sg shp" data-focus="shp">
      <div class="step-kicker">Шаг 7 · что отсюда следует</div>
      <h4>Форма ответа не зависит от числа признаков</h4>
<p>Сколько бы столбцов ни было в таблице, произведение строки на столбец даёт одну клетку, а сигмоида её не меняет. Поэтому одна и та же строка кода работает и для двух признаков, и для двухсот.</p>
<p>Проверка форм — самая дешёвая диагностика: почти все ошибки в коде линейной модели это перепутанные размерности, и ловятся они на бумаге за минуту.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<table class="shape-table">
  <tr><th>Обозначение</th><th>Что это</th><th>Форма</th><th>В примере</th></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf{x}"></span></td><td>признаки одного студента</td><td><span class="math-inline" data-tex="1\times P"></span></td><td>1 × 2</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf{w}"></span></td><td>по одному весу на признак</td><td><span class="math-inline" data-tex="P\times 1"></span></td><td>2 × 1</td></tr>
  <tr><td><span class="math-inline" data-tex="b"></span></td><td>сдвиг</td><td>число</td><td>1 × 1</td></tr>
  <tr><td><span class="math-inline" data-tex="z = \mathbf{x}\mathbf{w} + b"></span></td><td>логит</td><td>число</td><td>1 × 1</td></tr>
  <tr><td><span class="math-inline" data-tex="\hat y = \sigma(z)"></span></td><td>вероятность</td><td>число</td><td>1 × 1</td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> форма ответа не зависит ни от числа признаков, ни от
  сигмоиды. Произведение строки на столбец даёт одну клетку, поэлементная функция её сохраняет —
  поэтому одна и та же строка кода работает и для двух признаков, и для двухсот.
</div>

---

## Часть 6. Прямой проход батча

<p>
  Считать студентов по одному незачем: та же операция выполняется для всех строк сразу. Матрица
  <span class="math-inline" data-tex="X"></span> просто складывает объекты друг под друга,
  веса остаются те же самые, и на выходе получается столбец вероятностей той же высоты,
  что и батч.
</p>

<p>
  Заодно доведём цепочку до конца: сравним вероятности с метками и свернём всё в одно число.
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
<svg id="fb" viewBox="0 0 960 500" role="img" aria-label="Прямой проход батча в формах">
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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">та же операция для всех четырёх студентов сразу</text>
<g data-key="X">
<rect x="40" y="120" width="110" height="140" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="95" y1="120" x2="95" y2="260" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="155" x2="150" y2="155" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="190" x2="150" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="225" x2="150" y2="225" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="95" y="108" text-anchor="middle" font-size="13" fill="#111111">4 × 2</text>
<text x="95" y="284" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">X</text>
</g>
<g data-key="w">
<text x="168" y="196" class="lbl" text-anchor="middle">·</text>
<rect x="188" y="155" width="46" height="70" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="188" y1="190" x2="234" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="211" y="143" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="211" y="249" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="bb">
<text x="256" y="196" class="lbl" text-anchor="middle">+</text>
<rect x="276" y="173" width="46" height="34" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<text x="299" y="231" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
</g>
<g data-key="zc">
<text x="344" y="196" class="lbl" text-anchor="middle">=</text>
<rect x="364" y="120" width="46" height="140" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="364" y1="155" x2="410" y2="155" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="364" y1="190" x2="410" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="364" y1="225" x2="410" y2="225" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="387" y="108" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="387" y="284" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">z</text>
</g>
<g data-key="sg">
<line x1="418" y1="190" x2="452" y2="190" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#fb-arw)"/>
<text x="435" y="168" class="cap" text-anchor="middle">σ</text>
<rect x="464" y="120" width="46" height="140" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="464" y1="155" x2="510" y2="155" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="464" y1="190" x2="510" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="464" y1="225" x2="510" y2="225" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="487" y="108" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="487" y="284" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
</g>
<g data-key="y">
<rect x="556" y="120" width="46" height="140" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="556" y1="155" x2="602" y2="155" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="556" y1="190" x2="602" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="556" y1="225" x2="602" y2="225" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="579" y="108" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="579" y="284" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">y</text>
<text x="579" y="292" class="cap" text-anchor="middle">нули и единицы</text>
</g>
<g data-key="L">
<line x1="518" y1="190" x2="546" y2="190" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#fb-arw)"/>
<line x1="610" y1="190" x2="646" y2="190" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#fb-arr)"/>
<rect x="660" y="150" width="250" height="80" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="785" y="182" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">L</text>
<text x="785" y="206" class="cap" text-anchor="middle">среднее −ln вероятности,</text>
<text x="785" y="224" class="cap" text-anchor="middle">которую дали правде</text>
</g>
<g data-key="row" data-only="1">
<rect x="40" y="155" width="110" height="35" fill="#C30B0A" opacity="0.12"/>
<rect x="40" y="155" width="110" height="35" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="188" y="155" width="46" height="70" fill="#C30B0A" opacity="0.12"/>
<rect x="188" y="155" width="46" height="70" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="364" y="155" width="46" height="35" fill="#C30B0A" opacity="0.14"/>
<rect x="364" y="155" width="46" height="35" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="464" y="155" width="46" height="35" fill="#C30B0A" opacity="0.14"/>
<rect x="464" y="155" width="46" height="35" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<text x="220" y="300" class="cap" text-anchor="middle">вторая строка X встречается с тем же столбцом w</text>
</g>
<g data-key="note" data-only="1">
<rect x="60" y="330" width="840" height="96" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/>
<text x="78" y="356" class="cap" text-anchor="start">ГДЕ ФОРМЫ НЕ СОВПАДАЮТ БУКВАЛЬНО</text>
<text x="78" y="386" class="val" text-anchor="start">b — одно число, а прибавляется к столбцу 4 × 1: оно размножается по всем строкам</text>
<text x="78" y="414" class="val" text-anchor="start">на обратном проходе это размножение обернётся суммированием</text>
</g>
<text x="40" y="480" class="legend" text-anchor="start">синее — данные · тёмно-жёлтое — обучаемые числа · зелёное — логиты и вероятности · красное — потеря</text>
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
      <h4>Студенты складываются друг под друга</h4>
<p>Строк столько, сколько студентов; столбцов — сколько признаков. Порядок столбцов тот же, что был у одного объекта.</p>
<p><div class="math-display" data-tex="X \in \mathbb{R}^{4\times 2}"></div></p>
    </div>
    <div class="step-panel" data-on="X w mm1" data-focus="w">
      <div class="step-kicker">Шаг 2 · веса те же самые</div>
      <h4>Модель одна на весь батч</h4>
<p>Веса не размножаются по строкам: столбец w ровно один. Именно поэтому обучение на батче ищет общую закономерность, а не подгоняет каждого студента отдельно.</p>
    </div>
    <div class="step-panel" data-on="X w zc row mm2" data-focus="row">
      <div class="step-kicker">Шаг 3 · строка за строкой</div>
      <h4>Каждая строка X даёт свою клетку z</h4>
<p>Это тот же forward одного объекта, повторённый четыре раза. Внутренние двойки сходятся, поэтому результат — столбец высоты 4.</p>
<p><div class="math-display" data-tex="[4\times 2]\cdot[2\times 1] \rightarrow [4\times 1]"></div></p>
    </div>
    <div class="step-panel" data-on="X w bb zc note mm2" data-focus="bb note">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4>Одно число прибавляется ко всем строкам</h4>
<p>Формально это <span class="math-inline" data-tex="b\mathbf{1}_N"></span> — столбец из N одинаковых значений. В коде то же самое делает broadcasting, и это единственное место во всём прямом проходе, где формы не совпадают буквально.</p>
<p><div class="math-display" data-tex="\mathbf{z} = X\mathbf{w} + b\mathbf{1}_N"></div></p>
    </div>
    <div class="step-panel" data-on="zc sg mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида поэлементно</div>
      <h4>Столбец логитов становится столбцом вероятностей</h4>
<p>Клетка за клеткой, независимо друг от друга. Форма сохраняется: 4 × 1 на входе, 4 × 1 на выходе.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} = \sigma(\mathbf{z}) \in \mathbb{R}^{4\times 1}"></div></p><p>Обратите внимание, что клетки не смешиваются между собой. У softmax это не так, и обратный проход у него сложнее.</p>
    </div>
    <div class="step-panel" data-on="sg y mm3" data-focus="y">
      <div class="step-kicker">Шаг 6 · метки</div>
      <h4>Столбец из нулей и единиц</h4>
<p>Настоящие исходы лежат столбцом той же высоты. Никаких промежуточных значений: студент либо сдал, либо нет.</p>
<p>Формы ŷ и y совпадают буквально, поэтому дальше их можно сравнивать клетка в клетку.</p>
    </div>
    <div class="step-panel" data-on="sg y L mm4" data-focus="L">
      <div class="step-kicker">Шаг 7 · потеря</div>
      <h4>Столбец схлопывается в скаляр</h4>
<p>По каждой строке берём логарифм вероятности верного ответа, ставим минус и усредняем по батчу. Деление на N делает потерю сравнимой между батчами разного размера.</p>
<p><div class="math-display" data-tex="L = -\frac{1}{N}\sum_{n=1}^{N}\bigl[y_n\ln\hat y_n + (1-y_n)\ln(1-\hat y_n)\bigr]"></div></p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> батч не добавляет ни одной новой операции. Он добавляет
  только ось объектов, и она проходит через всю цепочку насквозь: N строк на входе —
  N вероятностей на выходе, и лишь последний шаг схлопывает их в скаляр.
</div>

---

## Часть 7. Подставляем числа

<p>
  Схема та же, что в части 6, клетки те же. Меняется одно: вместо символов появляются числа
  наших четырёх студентов, и каждый шаг можно пересчитать на калькуляторе.
</p>

<pre><code>def forward(X, w, b, y):
    z    = X @ w + b                    # [4,2]·[2,1] → [4,1]
    yhat = 1 / (1 + np.exp(-z))         # поэлементно
    L    = -np.mean(y * np.log(yhat) + (1 - y) * np.log(1 - yhat))
    return z, yhat, L</code></pre>

<p>Посмотрим пошагово, что за числа получаются на прямом проходе.</p>

<div class="stage" id="stageFX" tabindex="0">
  <div class="stage-figure">
<svg id="fx" viewBox="0 0 960 430" role="img" aria-label="Прямой проход батча с подставленными числами">
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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
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
<rect x="44" y="104" width="120" height="132" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="104" y1="104" x2="104" y2="236" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="44" y1="137" x2="164" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="44" y1="170" x2="164" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="44" y1="203" x2="164" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="74" y="125.5" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="134" y="125.5" text-anchor="middle" font-size="14" fill="#111111">0,5</text>
<text x="74" y="158.5" text-anchor="middle" font-size="14" fill="#111111">4,0</text>
<text x="134" y="158.5" text-anchor="middle" font-size="14" fill="#111111">0,2</text>
<text x="74" y="191.5" text-anchor="middle" font-size="14" fill="#111111">3,0</text>
<text x="134" y="191.5" text-anchor="middle" font-size="14" fill="#111111">1,0</text>
<text x="74" y="224.5" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="134" y="224.5" text-anchor="middle" font-size="14" fill="#111111">0,9</text>
<text x="104" y="92" text-anchor="middle" font-size="13" fill="#111111">4 × 2</text>
<text x="104" y="260" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">X</text>
</g>
<g data-key="w">
<text x="188" y="176" class="lbl" text-anchor="middle">·</text>
<rect x="210" y="126" width="62" height="88" rx="2" fill="#C29E08" opacity="0.45" stroke="#ffffff" stroke-width="1"/>
<line x1="210" y1="170" x2="272" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="241" y="153" text-anchor="middle" font-size="14" fill="#111111">0,8</text>
<text x="241" y="197" text-anchor="middle" font-size="14" fill="#111111">−1,0</text>
<text x="241" y="114" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="241" y="238" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="bb">
<text x="294" y="176" class="lbl" text-anchor="middle">+</text>
<rect x="316" y="156" width="56" height="34" rx="2" fill="#C29E08" opacity="0.45" stroke="#ffffff" stroke-width="1"/>
<text x="344" y="178" text-anchor="middle" font-size="14" fill="#111111">−2,0</text>
<text x="344" y="214" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
</g>
<g data-key="zc">
<text x="396" y="176" class="lbl" text-anchor="middle">=</text>
<rect x="418" y="104" width="62" height="132" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="418" y1="137" x2="480" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="418" y1="170" x2="480" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="418" y1="203" x2="480" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="449" y="125.5" text-anchor="middle" font-size="14" fill="#111111">−0,9</text>
<text x="449" y="158.5" text-anchor="middle" font-size="14" fill="#111111">1,0</text>
<text x="449" y="191.5" text-anchor="middle" font-size="14" fill="#111111">−0,6</text>
<text x="449" y="224.5" text-anchor="middle" font-size="14" fill="#111111">−1,3</text>
<text x="449" y="92" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="449" y="260" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">z</text>
</g>
<g data-key="sg">
<line x1="490" y1="170" x2="522" y2="170" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#fx-arw)"/>
<text x="506" y="150" class="cap" text-anchor="middle">σ</text>
<rect x="534" y="104" width="84" height="132" rx="2" fill="#73B222" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="534" y1="137" x2="618" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="534" y1="170" x2="618" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="534" y1="203" x2="618" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="576" y="125.5" text-anchor="middle" font-size="14" fill="#111111">0,2891</text>
<text x="576" y="158.5" text-anchor="middle" font-size="14" fill="#111111">0,7311</text>
<text x="576" y="191.5" text-anchor="middle" font-size="14" fill="#111111">0,3543</text>
<text x="576" y="224.5" text-anchor="middle" font-size="14" fill="#111111">0,2142</text>
<text x="576" y="92" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="576" y="260" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
</g>
<g data-key="y">
<rect x="646" y="104" width="46" height="132" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="646" y1="137" x2="692" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="646" y1="170" x2="692" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="646" y1="203" x2="692" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="669" y="125.5" text-anchor="middle" font-size="14" fill="#111111">0</text>
<text x="669" y="158.5" text-anchor="middle" font-size="14" fill="#111111">1</text>
<text x="669" y="191.5" text-anchor="middle" font-size="14" fill="#111111">0</text>
<text x="669" y="224.5" text-anchor="middle" font-size="14" fill="#111111">1</text>
<text x="669" y="92" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="669" y="260" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">y</text>
</g>
<g data-key="li" data-only="1">
<rect x="724" y="104" width="84" height="132" rx="2" fill="#C30B0A" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="724" y1="137" x2="808" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="724" y1="170" x2="808" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="724" y1="203" x2="808" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="766" y="125.5" text-anchor="middle" font-size="14" fill="#111111">0,3412</text>
<text x="766" y="158.5" text-anchor="middle" font-size="14" fill="#111111">0,3133</text>
<text x="766" y="191.5" text-anchor="middle" font-size="14" fill="#111111">0,4375</text>
<text x="766" y="224.5" text-anchor="middle" font-size="14" fill="#111111">1,5410</text>
<text x="766" y="92" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="766" y="260" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">ℓ</text>
<text x="870" y="150" class="cap" text-anchor="middle">цена</text>
<text x="870" y="168" class="cap" text-anchor="middle">каждого</text>
<text x="870" y="186" class="cap" text-anchor="middle">студента</text>
</g>
<g data-key="hl" data-only="1">
<rect x="44" y="104" width="120" height="33" fill="#C30B0A" opacity="0.12"/>
<rect x="44" y="104" width="120" height="33" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="210" y="126" width="62" height="88" fill="#C30B0A" opacity="0.12"/>
<rect x="210" y="126" width="62" height="88" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="418" y="104" width="62" height="33" fill="#C30B0A" opacity="0.14"/>
<rect x="418" y="104" width="62" height="33" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
</g>
<g data-key="L" data-only="1">
<line x1="600" y1="300" x2="648" y2="300" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#fx-arr)"/>
<rect x="662" y="270" width="248" height="62" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="786" y="301" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">L = 0,6582</text>
<text x="786" y="323" class="cap" text-anchor="middle">потеря батча</text>
<text x="330" y="300" class="cap" text-anchor="middle">сумма четырёх цен, делённая на четыре</text>
</g>
<text x="40" y="396" class="legend" text-anchor="start">все числа получены из этих четырёх студентов и округлены до четвёртого знака</text>
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
      <h4>Четыре студента и два признака</h4>
<p><b>Дано.</b> Четыре студента: 20 часов подготовки при 5 пропусках, 40 часов при 2 пропусках, 30 часов при 10 пропусках и 20 часов при 9 пропусках.</p>
<p><div class="math-display" data-tex="X = \begin{bmatrix}2{,}0 &amp; 0{,}5\\4{,}0 &amp; 0{,}2\\3{,}0 &amp; 1{,}0\\2{,}0 &amp; 0{,}9\end{bmatrix}"></div></p><p>Настоящие исходы: не сдал, сдал, не сдал, сдал.</p>
    </div>
    <div class="step-panel" data-on="X w bb mm1" data-focus="w bb">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>Разумная догадка, не подобранная</h4>
<p><b>Текущие параметры.</b> Пока это просто разумная догадка: десять часов подготовки прибавляют 0,8 к логиту, десять пропусков отнимают 1,0, базовый уровень −2,0.</p>
<p><div class="math-display" data-tex="\mathbf{w} = (0{,}8;\ -1{,}0)^\top, \qquad b = -2{,}0"></div></p>
    </div>
    <div class="step-panel" data-on="X w hl mm2" data-focus="hl">
      <div class="step-kicker">Шаг 3 · строка на столбец</div>
      <h4>Два произведения для первого студента</h4>
<p><b>Первая строка.</b> Малиновым выделено ровно то, что участвует: первая строка X, весь столбец w и клетка, куда попадёт результат.</p>
<p><div class="math-display" data-tex="2{,}0\cdot 0{,}8 + 0{,}5\cdot(-1{,}0) = 1{,}6 - 0{,}5 = 1{,}1"></div></p>
    </div>
    <div class="step-panel" data-on="X w bb zc mm2" data-focus="zc">
      <div class="step-kicker">Шаг 4 · сдвиг и логиты</div>
      <h4>Логит первого студента равен −0,9</h4>
<p><b>Плюс сдвиг.</b> Одна и та же величина −2,0 ко всем четырём строкам.</p>
<p><div class="math-display" data-tex="z_1 = 1{,}1 - 2{,}0 = -0{,}9, \qquad \mathbf{z} = (-0{,}9;\ 1{,}0;\ -0{,}6;\ -1{,}3)^\top"></div></p><p>Знак логита уже содержит ответ модели: положительный — скорее сдаст, отрицательный — скорее нет.</p>
    </div>
    <div class="step-panel" data-on="zc sg mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида</div>
      <h4>Логиты становятся вероятностями</h4>
<p><b>Четыре независимых применения σ.</b> Например, для первого студента.</p>
<p><div class="math-display" data-tex="\hat y_1 = \frac{1}{1 + e^{0{,}9}} = 0{,}2891"></div></p><p>Столбец целиком: 0,2891; 0,7311; 0,3543 и 0,2142. Все четыре числа лежат между нулём и единицей — иначе и быть не могло.</p>
    </div>
    <div class="step-panel" data-on="sg y li mm3 mm4" data-focus="y li">
      <div class="step-kicker">Шаг 6 · цена каждого студента</div>
      <h4>Платим за вероятность, отданную правде</h4>
<p><b>Сравниваем с метками.</b> У первого студента y = 0, значит правде отдана вероятность 1 − 0,2891 = 0,7109, и цена равна −ln 0,7109 = 0,3412. У второго y = 1 и цена −ln 0,7311 = 0,3133.</p>
<p><div class="math-display" data-tex="\boldsymbol{\ell} = (0{,}3412;\ 0{,}3133;\ 0{,}4375;\ 1{,}5410)^\top"></div></p>
    </div>
    <div class="step-panel" data-on="li L mm4" data-focus="L">
      <div class="step-kicker">Шаг 7 · потеря</div>
      <h4>Одно число вместо четырёх</h4>
<p><b>Потеря батча.</b> Среднее четырёх цен.</p>
<p><div class="math-display" data-tex="L = \tfrac{1}{4}(0{,}3412 + 0{,}3133 + 0{,}4375 + 1{,}5410) = 0{,}6582"></div></p><p>Ориентир для сравнения — ln 2 = 0,6931: столько стоит ответ «не знаю, 0,5» на каждом студенте. Мы едва лучше него.</p>
    </div>
    <div class="step-panel" data-on="li L mm4" data-focus="li">
      <div class="step-kicker">Шаг 8 · где спрятана вся потеря</div>
      <h4>Один студент стоит дороже трёх остальных</h4>
<p>Четвёртый студент готовился всего 20 часов и пропустил 9 занятий — а сдал. Модель дала ему 0,2142, и это обошлось в 1,5410 из 2,6329, то есть 58,5 % всей потери батча.</p>
<p>Такова природа log loss: три аккуратных предсказания не компенсируют одну уверенную ошибку. На обратном проходе именно этот студент будет громче всех тянуть веса.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout-red">
  <strong>Осторожно с «модель почти угадала»:</strong> вероятность 0,2142 у студента, который
  на самом деле сдал, выглядит не так уж страшно — всего лишь «скорее нет». Но в log loss она
  стоит 1,5410, вчетверо дороже среднего промаха, и составляет 58,5 % всей потери батча.
  Судить о модели по одному числу вроде «доли верных ответов» нельзя: три студента угаданы,
  а вся работа обратного прохода будет определяться четвёртым.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> в прямом проходе нет ни одной операции сложнее умножения,
  сложения и экспоненты. Все четыре вероятности получены одним и тем же набором из двух весов
  и сдвига, и различаются они только потому, что различаются строки
  <span class="math-inline" data-tex="X"></span>.
</div>

---

## Часть 8. Обратный проход на графе: цепное правило

<p>
  Прямой проход ответил, что предсказывает модель. Обратный отвечает на другой вопрос:
  если увеличить один из трёх параметров на крошечную величину, потеря вырастет или упадёт
  и насколько быстро. Ответ — производная, и берётся она по звеньям.
</p>

<p>
  Звеньев теперь три, а не два: между логитом и потерей встала сигмоида. Её производную удобно
  выразить через саму сигмоиду. Запишем
  <span class="math-inline" data-tex="\sigma(z) = (1+e^{-z})^{-1}"></span> и продифференцируем
  как сложную функцию:
</p>

<p><div class="math-display" data-tex="\sigma'(z) = \frac{e^{-z}}{(1+e^{-z})^2} = \frac{1}{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}} = \sigma(z)\bigl(1-\sigma(z)\bigr)"></div></p>

<p>
  Это редкий подарок: чтобы получить производную, ничего заново считать не нужно — достаточно
  готовой вероятности с прямого прохода. У наших четырёх студентов
  <span class="math-inline" data-tex="\hat y(1-\hat y)"></span> равно 0,2055; 0,1966; 0,2288
  и 0,1683 — обратите внимание, все меньше 0,25, и это максимум сигмоиды.
</p>

<div class="callout-blue">
  <strong>Что такое локальная производная:</strong> она зависит только от той операции, которая
  стоит на ребре, и ничего не знает об остальном графе. У сложения производная равна единице,
  у умножения на <span class="math-inline" data-tex="x_1"></span> — это
  <span class="math-inline" data-tex="x_1"></span>, у сигмоиды —
  <span class="math-inline" data-tex="\hat y(1-\hat y)"></span>. Именно поэтому обратный проход
  можно собирать из готовых кусочков, не выводя каждый раз всё заново.
</div>

<p>Посмотрим пошагово, как градиент едет от потери до весов.</p>

<div class="stage" id="stageBG" tabindex="0">
  <div class="stage-figure">
<svg id="bg" viewBox="0 0 960 560" role="img" aria-label="Обратный проход на графе: сигнал ошибки течёт справа налево">
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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
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
<text x="400" y="158" class="cap" text-anchor="middle">логит</text>
<circle cx="618" cy="225" r="38" fill="#73B222" fill-opacity="0.13" stroke="#73B222" stroke-width="2.2"/>
<text x="618" y="230.667" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700">ŷ</text>
<text x="618" y="158" class="cap" text-anchor="middle">вероятность</text>
<text x="511" y="250" class="cap" text-anchor="middle">σ</text>
<rect x="782" y="194" width="152" height="62" rx="14" fill="#FFF7F7" stroke="#C30B0A" stroke-width="1.5"/>
<text x="858" y="222" font-size="14" fill="#9C0908" text-anchor="middle" font-weight="700">ℓ = −ln p(правды)</text>
<text x="858" y="244" class="cap" text-anchor="middle">потеря студента</text>
</g>
<g data-key="loc" data-only="1">
<rect x="202" y="148" width="96" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="250" y="162" text-anchor="middle" font-size="13" fill="#C30B0A">∂z/∂w₁ = x₁</text>
<rect x="202" y="286" width="96" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="250" y="300" text-anchor="middle" font-size="13" fill="#C30B0A">∂z/∂w₂ = x₂</text>
<rect x="415" y="326" width="82" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="456" y="340" text-anchor="middle" font-size="13" fill="#C30B0A">∂z/∂b = 1</text>
<rect x="440" y="176" width="142" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="511" y="190" text-anchor="middle" font-size="13" fill="#C30B0A">∂ŷ/∂z = ŷ(1 − ŷ)</text>
<rect x="640" y="176" width="180" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="730" y="190" text-anchor="middle" font-size="13" fill="#C30B0A">∂ℓ/∂ŷ = (ŷ − y) / ŷ(1 − ŷ)</text>
</g>
<g data-key="b1" data-only="1">
<path d="M 800 264 C 762 306 700 306 652 254" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<rect x="644" y="302" width="180" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="734" y="316" text-anchor="middle" font-size="13" fill="#C30B0A">приходит (ŷ − y) / ŷ(1 − ŷ)</text>
</g>
<g data-key="b2" data-only="1">
<path d="M 588 256 C 548 300 478 302 436 254" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<rect x="428" y="300" width="172" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="514" y="314" text-anchor="middle" font-size="13" fill="#C30B0A">после сокращения: ŷ − y</text>
</g>
<g data-key="canc" data-only="1">
<rect x="96" y="410" width="768" height="72" rx="14" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="118" y="436" class="cap" text-anchor="start">ГЛАВНОЕ СОКРАЩЕНИЕ ВСЕЙ СТАТЬИ</text>
<text x="118" y="466" font-size="16" fill="#111111" text-anchor="start">(ŷ − y) / [ŷ(1 − ŷ)]   ·   ŷ(1 − ŷ)   =   ŷ − y</text>
</g>
<g data-key="b3" data-only="1">
<path d="M 368 198 C 300 150 218 134 150 132" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<path d="M 368 252 C 300 300 218 318 150 318" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<rect x="196" y="98" width="84" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="238" y="112" text-anchor="middle" font-size="13" fill="#C30B0A">(ŷ − y) x₁</text>
<rect x="196" y="334" width="84" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="238" y="348" text-anchor="middle" font-size="13" fill="#C30B0A">(ŷ − y) x₂</text>
</g>
<g data-key="b4" data-only="1">
<path d="M 384 268 C 352 320 356 362 372 372" fill="none" stroke="#C30B0A" stroke-width="2.6" marker-end="url(#bg-arr)"/>
<rect x="284" y="386" width="66" height="20" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-opacity="0.35" stroke-width="1"/>
<text x="317" y="400" text-anchor="middle" font-size="13" fill="#C30B0A">ŷ − y</text>
</g>
<g data-key="ch" data-only="1">
<rect x="60" y="492" width="236" height="52" rx="14" fill="#FFF7F7" stroke="#C30B0A" stroke-width="1.5"/>
<text x="178" y="524" font-size="14" fill="#111111" text-anchor="middle">∂ℓ/∂ŷ = (ŷ−y)/ŷ(1−ŷ)</text>
<text x="312" y="524" class="lbl" text-anchor="middle">·</text>
<rect x="330" y="492" width="212" height="52" rx="14" fill="#FFF7F7" stroke="#C30B0A" stroke-width="1.5"/>
<text x="436" y="524" font-size="14" fill="#111111" text-anchor="middle">∂ŷ/∂z = ŷ(1−ŷ)</text>
<text x="558" y="524" class="lbl" text-anchor="middle">·</text>
<rect x="576" y="492" width="176" height="52" rx="14" fill="#FFF7F7" stroke="#C30B0A" stroke-width="1.5"/>
<text x="664" y="524" font-size="14" fill="#111111" text-anchor="middle">∂z/∂w₁ = x₁</text>
<text x="768" y="524" class="lbl" text-anchor="middle">=</text>
<rect x="788" y="492" width="144" height="52" rx="14" fill="#FDF2FA" stroke="#D83BB9" stroke-width="1.5"/>
<text x="860" y="524" font-size="15" fill="#A62E8E" text-anchor="middle" font-weight="700">(ŷ − y) x₁</text>
</g>
<text x="40" y="556" class="legend" text-anchor="start">серые линии — прямой проход · красные дуги — обратный · на плашках — то, что течёт назад</text>
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
<p>Прямой проход — цепочка: из весов и признаков получается логит, из логита сигмоида делает вероятность, из вероятности и настоящей метки — потеря. Каждая линия здесь — одна операция.</p>
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
      <h4>Две простые и одна страшная</h4>
<p>Производные линейной части выглядят так же, как в линейной регрессии. Производная сигмоиды считается в одну строку и выражается через саму сигмоиду.</p>
<p><div class="math-display" data-tex="\frac{\partial \hat y}{\partial z} = \sigma(z)\bigl(1-\sigma(z)\bigr) = \hat y(1-\hat y)"></div></p><p>А вот производная log loss по вероятности выглядит пугающе: в знаменателе стоит <span class="math-inline" data-tex="\hat y(1-\hat y)"></span>.</p>
    </div>
    <div class="step-panel" data-on="fw loc b1" data-focus="b1">
      <div class="step-kicker">Шаг 4 · поток стартует</div>
      <h4>Из потери в вероятность приходит дробь</h4>
<p>Обратный проход начинается с самого правого узла и идёт против стрелок. Первое, что он несёт, — производная потери по вероятности.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial \hat y} = \frac{\hat y - y}{\hat y(1-\hat y)}"></div></p><p>Проверьте на нашем четвёртом студенте: ŷ = 0,2142 при y = 1 даёт −4,6685. Число большое, потому что модель уверенно ошиблась.</p>
    </div>
    <div class="step-panel" data-on="fw loc b1 b2 canc" data-focus="b2 canc">
      <div class="step-kicker">Шаг 5 · через сигмоиду</div>
      <h4>Знаменатель сокращается ровно</h4>
<p>Дальше поток проходит ребро сигмоиды и домножается на её производную. И тут случается то, ради чего логистическую регрессию и учат с log loss: множитель <span class="math-inline" data-tex="\hat y(1-\hat y)"></span> сокращается со знаменателем.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial z} = \frac{\hat y - y}{\hat y(1-\hat y)}\cdot \hat y(1-\hat y) = \hat y - y"></div></p><p>Остаётся простая разность «предсказал минус правда». У четвёртого студента вместо −4,6685 это ровно −0,7858.</p>
    </div>
    <div class="step-panel" data-on="fw loc b1 b2 b3" data-focus="b3">
      <div class="step-kicker">Шаг 6 · в веса</div>
      <h4>Домножаем на признак — и попадаем в w₁ и w₂</h4>
<p>Здесь пути расходятся. К весу часов сигнал приходит домноженным на часы, к весу пропусков — на пропуски. Общий множитель у них один и тот же.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial w_1} = (\hat y - y)\,x_1, \qquad \frac{\partial \ell}{\partial w_2} = (\hat y - y)\,x_2"></div></p><p>Отсюда видно, почему признаки полезно приводить к одному масштабу: если один из них в тридцать раз крупнее, его градиент будет в тридцать раз больше — не потому, что он важнее.</p>
    </div>
    <div class="step-panel" data-on="fw loc b1 b2 b4" data-focus="b4">
      <div class="step-kicker">Шаг 7 · в сдвиг</div>
      <h4>Последний множитель равен единице</h4>
<p>У сдвига нет своего признака: он входит в логит с коэффициентом 1. Поэтому его производная совпадает с самим сигналом ошибки.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial b} = \hat y - y"></div></p>
    </div>
    <div class="step-panel" data-on="loc ch" data-focus="ch">
      <div class="step-kicker">Шаг 8 · цепочка целиком</div>
      <h4>Три множителя вдоль одного пути</h4>
<p>Путь от потери до w₁ ровно один, поэтому и слагаемое одно. Перемножаем то, что стояло на каждом ребре, — и получаем готовую формулу.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial w_1} = \frac{\partial \ell}{\partial \hat y}\cdot\frac{\partial \hat y}{\partial z}\cdot\frac{\partial z}{\partial w_1} = (\hat y - y)\,x_1"></div></p><p>Сравните с линейной регрессией, где на этом месте стояло 2r·1·x₁. Разница только в множителе перед x₁ — и это единственное, чем два обратных прохода отличаются.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> log loss и сигмоида подобраны друг под друга. Страшная
  дробь <span class="math-inline" data-tex="(\hat y - y)/[\hat y(1-\hat y)]"></span> и множитель
  <span class="math-inline" data-tex="\hat y(1-\hat y)"></span> сокращаются нацело, и от всего
  обратного прохода остаётся разность «предсказал минус правда». Ни производную сигмоиды,
  ни логарифм в коде считать не придётся.
</div>

---

## Часть 9. Обратный проход в матричной форме

<p>
  Формулы из части 8 записаны для одного студента и одного веса. Для батча их не нужно выводить
  заново — достаточно собрать те же производные в матрицы, следя за формами.
</p>

<p>
  Вес <span class="math-inline" data-tex="w_1"></span> влияет на все
  <span class="math-inline" data-tex="N"></span> предсказаний сразу, поэтому вклады
  складываются по объектам. Это и есть цепное правило для функции многих переменных:
</p>

<p><div class="math-display" data-tex="\frac{\partial L}{\partial w_p} = \sum_{n=1}^{N} \frac{\partial L}{\partial z_n}\cdot\frac{\partial z_n}{\partial w_p} = \sum_{n=1}^{N} \frac{1}{N}(\hat y_n - y_n)\,x_{np}"></div></p>

<p>
  Сумма произведений по номеру объекта — это в точности одна клетка матричного произведения,
  в котором ось объектов стоит внутри. Отсюда обе итоговые формулы:
</p>

<p><div class="math-display" data-tex="\nabla_{\mathbf{w}} L = \frac{1}{N}X^\top(\hat{\mathbf{y}} - \mathbf{y}) \in \mathbb{R}^{P\times 1},\qquad \frac{\partial L}{\partial b} = \frac{1}{N}\sum_{n=1}^{N} (\hat y_n - y_n) \in \mathbb{R}"></div></p>

<p>
  Сравните с линейной регрессией: там было
  <span class="math-inline" data-tex="\frac{2}{N}X^\top\mathbf{r}"></span>, где
  <span class="math-inline" data-tex="\mathbf{r} = \hat{\mathbf{y}} - \mathbf{y}"></span>.
  Разница ровно в двойке, которая пришла от квадрата. Формула градиента у двух моделей одна
  и та же, хотя выводились они из совершенно разных потерь, — и это не совпадение, а свойство
  канонической функции связи в обобщённых линейных моделях.
</p>

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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">те же производные, собранные в матрицы</text>
<g data-key="r">
<rect x="60" y="100" width="60" height="120" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/>
<line x1="60" y1="130" x2="120" y2="130" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="160" x2="120" y2="160" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="190" x2="120" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="90" y="88" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="90" y="244" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">ŷ − y</text>
<text x="150" y="166" class="lbl" text-anchor="middle">·</text>
<text x="182" y="172" class="lbl" text-anchor="middle">1/N</text>
<text x="216" y="166" class="lbl" text-anchor="middle">=</text>
</g>
<g data-key="sig">
<rect x="240" y="100" width="60" height="120" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="240" y1="130" x2="300" y2="130" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="240" y1="160" x2="300" y2="160" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="240" y1="190" x2="300" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="270" y="88" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="270" y="244" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂z</text>
</g>
<g data-key="XT">
<path d="M 270 250 C 270 272 289 262 305 276" fill="none" stroke="#5E5850" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#bm-arw)"/>
<text x="366" y="250" class="cap" text-anchor="start">тот же столбец</text>
<rect x="60" y="288" width="180" height="68" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="105" y1="288" x2="105" y2="356" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="150" y1="288" x2="150" y2="356" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="195" y1="288" x2="195" y2="356" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="322" x2="240" y2="322" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="150" y="276" text-anchor="middle" font-size="13" fill="#111111">2 × 4</text>
<text x="150" y="380" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">Xᵀ</text>
</g>
<g data-key="sig2">
<text x="266" y="326" class="lbl" text-anchor="middle">·</text>
<rect x="292" y="262" width="60" height="120" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="292" y1="292" x2="352" y2="292" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="292" y1="322" x2="352" y2="322" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="292" y1="352" x2="352" y2="352" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="322" y="250" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="322" y="406" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂z</text>
</g>
<g data-key="nab">
<text x="378" y="326" class="lbl" text-anchor="middle">=</text>
<rect x="404" y="288" width="46" height="68" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="404" y1="322" x2="450" y2="322" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="427" y="276" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="427" y="380" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
</g>
<g data-key="bias" data-only="1">
<rect x="520" y="262" width="400" height="120" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
<text x="538" y="288" class="cap" text-anchor="start">ГРАДИЕНТ СДВИГА</text>
<text x="538" y="318" class="val" text-anchor="start">∂L/∂b = сумма всех клеток ∂L/∂z</text>
<text x="538" y="346" class="cap" text-anchor="start">размножение вперёд — суммирование назад</text>
</g>
<g data-key="rule" data-only="1">
<rect x="520" y="100" width="400" height="120" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="538" y="126" class="cap" text-anchor="start">ПРАВИЛО ПРОВЕРКИ</text>
<text x="538" y="156" class="val" text-anchor="start">w:  2 × 1   →   ∇wL:  2 × 1</text>
<text x="538" y="184" class="val" text-anchor="start">b:  число   →   ∂L/∂b:  число</text>
<text x="538" y="208" class="cap" text-anchor="start">если формы разошлись — ошибка в выкладке</text>
</g>
<text x="40" y="436" class="legend" text-anchor="start">красное — разность предсказания и правды · оранжевое — сигнал ошибки · малиновое — градиенты</text>
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
      <h4>Единственное, что нужно, — столбец ŷ − y</h4>
<p>Прямой проход уже посчитал вероятности, метки известны. Ни логиты, ни производная сигмоиды по отдельности больше не понадобятся — они сократились ещё в части 8.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} - \mathbf{y} \in \mathbb{R}^{N\times 1}"></div></p>
    </div>
    <div class="step-panel" data-on="r sig mm5" data-focus="sig">
      <div class="step-kicker">Шаг 2 · сигнал ошибки</div>
      <h4>Производная потери по каждому логиту</h4>
<p>Усреднение по батчу даёт деление на N. Форма при этом не меняется: сколько было предсказаний, столько и производных.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial \mathbf{z}} = \frac{1}{N}\,(\hat{\mathbf{y}} - \mathbf{y}) \in \mathbb{R}^{N\times 1}"></div></p><p>У линейной регрессии здесь стояло <span class="math-inline" data-tex="\frac{2}{N}\mathbf{r}"></span>. Двойка пришла от квадрата, у нас её нет — вот и вся разница.</p>
    </div>
    <div class="step-panel" data-on="sig XT sig2 mm5" data-focus="XT">
      <div class="step-kicker">Шаг 3 · откуда берётся транспонирование</div>
      <h4>Нужно свернуть ось объектов, а не ось признаков</h4>
<p>У сигнала ошибки высота N — по числу студентов. У градиента весов высота должна быть P — по числу признаков. Свернуть N способна только матрица, у которой N стоит в столбцах, а это <span class="math-inline" data-tex="X^\top"></span>.</p>
<p>Смысл строки <span class="math-inline" data-tex="X^\top"></span> прямой: это один признак у всех студентов сразу.</p>
    </div>
    <div class="step-panel" data-on="XT sig2 nab mm5" data-focus="nab">
      <div class="step-kicker">Шаг 4 · градиент весов</div>
      <h4>Формы сходятся, получается столбец 2 × 1</h4>
<p>Каждая клетка результата — сумма по всем студентам: признак, умноженный на сигнал ошибки этого студента. Ровно то же, что мы получили на графе, только сразу для всего батча.</p>
<p><div class="math-display" data-tex="\nabla_{\mathbf{w}} L = \frac{1}{N}X^\top(\hat{\mathbf{y}} - \mathbf{y}) \qquad [2\times 4]\cdot[4\times 1] \rightarrow [2\times 1]"></div></p>
    </div>
    <div class="step-panel" data-on="sig bias mm5" data-focus="bias">
      <div class="step-kicker">Шаг 5 · градиент сдвига</div>
      <h4>Сдвиг входит во все строки с коэффициентом единица</h4>
<p>Поэтому взвешивать признаками нечего, и остаётся просто сумма сигналов ошибки. Помните размножение b по строкам на прямом проходе? Здесь оно обернулось суммированием — так бывает всегда.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial b} = \frac{1}{N}\sum_{n=1}^{N} (\hat y_n - y_n)"></div></p>
    </div>
    <div class="step-panel" data-on="nab bias rule" data-focus="rule">
      <div class="step-kicker">Шаг 6 · как проверить себя</div>
      <h4>Форма градиента повторяет форму параметра</h4>
<p>Это самая дешёвая проверка выкладки: если у градиента весов получилась форма N × 1 или 1 × P, ошибка в производной, а не в данных — вычесть такой градиент из w всё равно не из чего.</p>
<p>Весь обратный проход логистической регрессии — одно вычитание, одно умножение матрицы на столбец и одно суммирование того же столбца.</p>
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
  Все величины уже посчитаны в части 7. Вероятности лежат готовым столбцом, метки известны,
  матрица признаков не менялась — обратный проход переиспользует результаты прямого целиком.
</p>

<pre><code>def backward(X, y, yhat):
    g  = (yhat - y) / len(y)  # сигнал ошибки, [4,1]
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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">обратный проход стартует с того же столбца, которым кончился прямой</text>
<g data-key="r">
<rect x="60" y="96" width="84" height="104" rx="2" fill="#C30B0A" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="60" y1="122" x2="144" y2="122" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="148" x2="144" y2="148" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="174" x2="144" y2="174" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="102" y="114" text-anchor="middle" font-size="14" fill="#111111">0,2891</text>
<text x="102" y="140" text-anchor="middle" font-size="14" fill="#111111">−0,2689</text>
<text x="102" y="166" text-anchor="middle" font-size="14" fill="#111111">0,3543</text>
<text x="102" y="192" text-anchor="middle" font-size="14" fill="#111111">−0,7858</text>
<text x="102" y="84" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="102" y="224" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">ŷ − y</text>
<text x="186" y="150" class="lbl" text-anchor="middle">·</text>
<text x="216" y="156" class="lbl" text-anchor="middle">1/4</text>
<text x="250" y="150" class="lbl" text-anchor="middle">=</text>
</g>
<g data-key="sig">
<rect x="280" y="96" width="84" height="104" rx="2" fill="#E88919" opacity="0.42" stroke="#ffffff" stroke-width="1"/>
<line x1="280" y1="122" x2="364" y2="122" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="280" y1="148" x2="364" y2="148" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="280" y1="174" x2="364" y2="174" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="322" y="114" text-anchor="middle" font-size="14" fill="#111111">0,0723</text>
<text x="322" y="140" text-anchor="middle" font-size="14" fill="#111111">−0,0672</text>
<text x="322" y="166" text-anchor="middle" font-size="14" fill="#111111">0,0886</text>
<text x="322" y="192" text-anchor="middle" font-size="14" fill="#111111">−0,1965</text>
<text x="322" y="84" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="322" y="224" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂z</text>
</g>
<g data-key="XT">
<path d="M 320 218 C 320 246 340 240 372 262" fill="none" stroke="#5E5850" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#bx-arw)"/>
<text x="400" y="232" class="cap" text-anchor="start">тот же столбец</text>
<rect x="70" y="280" width="200" height="68" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="120" y1="280" x2="120" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="170" y1="280" x2="170" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="220" y1="280" x2="220" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="70" y1="314" x2="270" y2="314" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="95" y="302" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="145" y="302" text-anchor="middle" font-size="14" fill="#111111">4,0</text>
<text x="195" y="302" text-anchor="middle" font-size="14" fill="#111111">3,0</text>
<text x="245" y="302" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="95" y="336" text-anchor="middle" font-size="14" fill="#111111">0,5</text>
<text x="145" y="336" text-anchor="middle" font-size="14" fill="#111111">0,2</text>
<text x="195" y="336" text-anchor="middle" font-size="14" fill="#111111">1,0</text>
<text x="245" y="336" text-anchor="middle" font-size="14" fill="#111111">0,9</text>
<text x="170" y="268" text-anchor="middle" font-size="13" fill="#111111">2 × 4</text>
<text x="170" y="372" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">Xᵀ</text>
</g>
<g data-key="sig2">
<text x="300" y="318" class="lbl" text-anchor="middle">·</text>
<rect x="336" y="258" width="84" height="112" rx="2" fill="#E88919" opacity="0.42" stroke="#ffffff" stroke-width="1"/>
<line x1="336" y1="286" x2="420" y2="286" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="336" y1="314" x2="420" y2="314" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="336" y1="342" x2="420" y2="342" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="378" y="277" text-anchor="middle" font-size="14" fill="#111111">0,0723</text>
<text x="378" y="305" text-anchor="middle" font-size="14" fill="#111111">−0,0672</text>
<text x="378" y="333" text-anchor="middle" font-size="14" fill="#111111">0,0886</text>
<text x="378" y="361" text-anchor="middle" font-size="14" fill="#111111">−0,1965</text>
<text x="378" y="246" text-anchor="middle" font-size="13" fill="#111111">4 × 1</text>
<text x="378" y="394" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂z</text>
</g>
<g data-key="nab">
<text x="456" y="318" class="lbl" text-anchor="middle">=</text>
<rect x="492" y="280" width="94" height="68" rx="2" fill="#D83BB9" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="492" y1="314" x2="586" y2="314" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="539" y="302" text-anchor="middle" font-size="14" fill="#111111">−0,2516</text>
<text x="539" y="336" text-anchor="middle" font-size="14" fill="#111111">−0,0655</text>
<text x="539" y="268" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="539" y="372" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
</g>
<g data-key="hl" data-only="1">
<rect x="70" y="280" width="200" height="34" fill="#C30B0A" opacity="0.12"/>
<rect x="70" y="280" width="200" height="34" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="336" y="258" width="84" height="112" fill="#C30B0A" opacity="0.12"/>
<rect x="336" y="258" width="84" height="112" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="492" y="280" width="94" height="34" fill="#C30B0A" opacity="0.14"/>
<rect x="492" y="280" width="94" height="34" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
</g>
<g data-key="bias" data-only="1">
<rect x="646" y="258" width="274" height="112" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
<text x="664" y="284" class="cap" text-anchor="start">ГРАДИЕНТ СДВИГА</text>
<text x="664" y="314" class="val" text-anchor="start">0,0723 − 0,0672 + 0,0886 − 0,1965</text>
<text x="664" y="342" class="nm" text-anchor="start">∂L/∂b = −0,1028</text>
</g>
<g data-key="chk" data-only="1">
<rect x="646" y="96" width="274" height="104" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="664" y="122" class="cap" text-anchor="start">ЧИСЛЕННАЯ СВЕРКА</text>
<text x="664" y="152" class="val" text-anchor="start">(L(w+ε) − L(w−ε)) / 2ε</text>
<text x="664" y="180" class="val" text-anchor="start">расхождение 2,2 · 10⁻¹¹</text>
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
      <div class="step-kicker">Шаг 1 · разность предсказания и правды</div>
      <h4>Ничего пересчитывать не нужно</h4>
<p><b>Из прямого прохода.</b> Вероятности были 0,2891; 0,7311; 0,3543 и 0,2142, метки — 0, 1, 0 и 1. Вычитаем клетка в клетку.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} - \mathbf{y} = (0{,}2891;\ -0{,}2689;\ 0{,}3543;\ -0{,}7858)^\top"></div></p><p>Знак читается буквально: плюс — модель завысила шансы, минус — занизила.</p>
    </div>
    <div class="step-panel" data-on="r sig mm5" data-focus="sig">
      <div class="step-kicker">Шаг 2 · сигнал ошибки</div>
      <h4>Делим на размер батча</h4>
<p><b>Сигнал ошибки.</b> Умножаем на 1/N = 1/4 = 0,25. Больше на этом столбце ничего не делается — производная сигмоиды уже сократилась.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial \mathbf{z}} = 0{,}25\cdot(\hat{\mathbf{y}} - \mathbf{y}) = (0{,}0723;\ -0{,}0672;\ 0{,}0886;\ -0{,}1965)^\top"></div></p><p>Самая крупная клетка — у четвёртого студента, того самого, который сдал вопреки прогнозу.</p>
    </div>
    <div class="step-panel" data-on="sig XT sig2 mm5" data-focus="XT">
      <div class="step-kicker">Шаг 3 · Xᵀ</div>
      <h4>Та же матрица, повёрнутая на бок</h4>
<p><b>Та же таблица на боку.</b> Первая строка <span class="math-inline" data-tex="X^\top"></span> — часы всех четырёх студентов, вторая — их пропуски. Ни одно число не изменилось, изменился только порядок осей.</p>
<p><div class="math-display" data-tex="X^\top = \begin{bmatrix}2{,}0 &amp; 4{,}0 &amp; 3{,}0 &amp; 2{,}0\\0{,}5 &amp; 0{,}2 &amp; 1{,}0 &amp; 0{,}9\end{bmatrix}"></div></p>
    </div>
    <div class="step-panel" data-on="XT sig2 nab hl mm5" data-focus="hl">
      <div class="step-kicker">Шаг 4 · вес часов</div>
      <h4>Четыре произведения и их сумма</h4>
<p><b>Первая клетка градиента.</b> Малиновым выделено то, что её даёт: строка часов, весь столбец сигнала ошибки и клетка результата.</p>
<p><div class="math-display" data-tex="2{,}0\cdot 0{,}0723 + 4{,}0\cdot(-0{,}0672) + 3{,}0\cdot 0{,}0886 + 2{,}0\cdot(-0{,}1965) = -0{,}2516"></div></p>
    </div>
    <div class="step-panel" data-on="XT sig2 nab mm5" data-focus="nab">
      <div class="step-kicker">Шаг 5 · вес пропусков</div>
      <h4>Строка пропусков на тот же столбец</h4>
<p><b>Вторая клетка.</b> Та же операция со строкой пропусков.</p>
<p><div class="math-display" data-tex="0{,}5\cdot 0{,}0723 + 0{,}2\cdot(-0{,}0672) + 1{,}0\cdot 0{,}0886 + 0{,}9\cdot(-0{,}1965) = -0{,}0655"></div></p><p>Обе производные отрицательны, значит шаг спуска увеличит оба веса. Для веса пропусков это означает движение к нулю: батч требует ослабить штраф за прогулы — из-за одного студента, который прогуливал и всё равно сдал.</p>
    </div>
    <div class="step-panel" data-on="sig bias mm5" data-focus="bias">
      <div class="step-kicker">Шаг 6 · сдвиг</div>
      <h4>Сумма сигналов ошибки</h4>
<p><b>Градиент сдвига.</b> Просто сумма того же столбца — взвешивать нечем.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial b} = 0{,}0723 - 0{,}0672 + 0{,}0886 - 0{,}1965 = -0{,}1028"></div></p><p>Он тоже отрицательный: в среднем по этому батчу модель занижает шансы сдать.</p>
    </div>
    <div class="step-panel" data-on="nab bias chk" data-focus="chk">
      <div class="step-kicker">Шаг 7 · сверка</div>
      <h4>Сдвинуть вес и посмотреть на потерю</h4>
<p><b>Проверка без формул.</b> Производную можно оценить в лоб: изменить один параметр на 10⁻⁶ в обе стороны, посчитать потерю дважды и поделить разность на удвоенное приращение. Формулы при этом не используются вообще.</p>
<p>Все три числа совпали с аналитическими до 2,2 · 10⁻¹¹. Такой проверкой стоит сопровождать любой выведенный руками обратный проход — она ловит опечатки, которые глазами не видны.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="console-title">Сверка аналитического градиента с численным · настоящий вывод</div>
<div class="console"><span class="cmd">$ python3 grad_check.py</span>
аналитически: dw = [-0.2516  -0.0655]  db = -0.1028
численно:     dw = [-0.2516  -0.0655]  db = -0.1028
максимальное расхождение: 2.1672441619102756e-11
</div>

<div class="callout-blue">
  <strong>Знаки читаются буквально:</strong> у всех трёх производных знак минус, значит
  увеличение любого из трёх чисел уменьшит потерю — и шаг спуска каждое из них увеличит.
  Для веса пропусков это движение к нулю: батч просит ослабить штраф за прогулы. Такова цена
  маленького батча — один нетипичный студент разворачивает целый признак, и лечится это только
  усреднением по большему числу объектов.
</div>

<div class="callout-yellow">
  <strong>Где численная проверка перестаёт работать:</strong> она опирается на гладкость
  функции. У логистической регрессии проблем нет — потеря гладкая всюду. Но стоит появиться
  ReLU или модулю, и в точке излома численная производная начнёт врать при слишком крупном
  <span class="math-inline" data-tex="\varepsilon"></span>, а при слишком мелком её съест
  машинная точность. Разумный диапазон — от <span class="math-inline" data-tex="10^{-6}"></span>
  до <span class="math-inline" data-tex="10^{-4}"></span>.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обратный проход логистической регрессии — это одно
  вычитание, одно умножение <span class="math-inline" data-tex="X^\top"></span> на столбец
  и одно суммирование того же столбца. Три строки кода, и все три выведены здесь из определения
  производной.
</div>

---

## Часть 11. Получили градиент — придумываем спуск

<p>
  На руках три числа: −0,2516, −0,0655 и −0,1028. Что с ними делать? Знак говорит, в какую
  сторону потеря растёт; значит, двигаться надо в противоположную. Осталось решить, насколько
  далеко.
</p>

<p>
  Производная описывает поведение потери только при бесконечно малом смещении. Она не знает,
  где линейное приближение перестаёт работать, поэтому градиент умножают на небольшой множитель.
  Его называют скоростью обучения, и это единственное число во всём цикле, которое приходится
  выбирать руками.
</p>

<p><div class="math-display" data-tex="\theta \leftarrow \theta - \eta\,\frac{\partial L}{\partial \theta}"></div></p>

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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">градиент даёт направление, η — длину шага</text>
<g data-key="w0">
<rect x="78" y="118" width="72" height="70" rx="2" fill="#C29E08" opacity="0.45" stroke="#ffffff" stroke-width="1"/>
<line x1="78" y1="153" x2="150" y2="153" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="114" y="140.5" text-anchor="middle" font-size="14" fill="#111111">0,8</text>
<text x="114" y="175.5" text-anchor="middle" font-size="14" fill="#111111">−1,0</text>
<text x="114" y="106" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="114" y="212" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="gr">
<text x="186" y="158" class="lbl" text-anchor="middle">−</text>
<text x="220" y="162" class="lbl" text-anchor="middle">η ·</text>
<rect x="252" y="118" width="106" height="70" rx="2" fill="#D83BB9" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="252" y1="153" x2="358" y2="153" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="305" y="140.5" text-anchor="middle" font-size="14" fill="#111111">−0,2516</text>
<text x="305" y="175.5" text-anchor="middle" font-size="14" fill="#111111">−0,0655</text>
<text x="305" y="106" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="305" y="212" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
</g>
<g data-key="w1">
<text x="400" y="158" class="lbl" text-anchor="middle">=</text>
<rect x="434" y="118" width="100" height="70" rx="2" fill="#C29E08" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="434" y1="153" x2="534" y2="153" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="484" y="140.5" text-anchor="middle" font-size="14" fill="#111111">0,9258</text>
<text x="484" y="175.5" text-anchor="middle" font-size="14" fill="#111111">−0,9672</text>
<text x="484" y="106" text-anchor="middle" font-size="13" fill="#111111">2 × 1</text>
<text x="484" y="212" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w после шага</text>
</g>
<g data-key="bs" data-only="1">
<rect x="60" y="250" width="490" height="96" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/>
<text x="78" y="276" class="cap" text-anchor="start">СДВИГ ОБНОВЛЯЕТСЯ ПО ТОМУ ЖЕ ПРАВИЛУ</text>
<text x="78" y="306" class="val" text-anchor="start">b ← −2,0 − 0,5 · (−0,1028) = −1,9486</text>
<text x="78" y="334" class="cap" text-anchor="start">отдельной формулы для b не существует — это такой же параметр</text>
</g>
<g data-key="pl" data-only="1">
<rect x="586" y="96" width="340" height="266" rx="12" fill="#FFFFFF" stroke="#E4E1D7" stroke-width="1.3"/>
<text x="602" y="116" class="cap" text-anchor="start">потеря батча после одного шага</text>
<line x1="620.0" y1="320.0" x2="902.0" y2="320.0" stroke="#8A847B" stroke-width="1.4"/>
<line x1="620.0" y1="130.0" x2="620.0" y2="320.0" stroke="#8A847B" stroke-width="1.4"/>
<polyline points="620.0,252.7 648.2,278.4 676.4,295.6 704.6,304.3 732.8,304.6 761.0,296.9 789.2,281.0 817.4,257.4 845.6,226.0 873.8,187.8 902.0,142.1" fill="none" stroke="#3576C0" stroke-width="2.4"/>
<line x1="620.0" y1="252.7" x2="902.0" y2="252.7" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="4 4"/>
<text x="626" y="246.7" class="cap" text-anchor="start">было 0,6582</text>
<text x="620" y="338" class="cap" text-anchor="start">η = 0</text>
<text x="906" y="338" class="cap" text-anchor="end">η = 1,5</text>
<circle cx="714.0" cy="305.4" r="5" fill="#73B222"/>
<text x="726.0" y="293.4" class="cap" text-anchor="start">η = 0,5 → 0,6377</text>
</g>
<g data-key="bad" data-only="1">
<circle cx="902.0" cy="142.1" r="6" fill="#C30B0A"/>
<text x="892.0" y="160.1" class="cap" text-anchor="end">η = 1,5 → 0,7013</text>
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
<p>Производная −0,2516 означает: увеличение w₁ уменьшает потерю. Значит, двигаться надо против градиента, то есть вычитать его.</p>
<p><div class="math-display" data-tex="\theta \leftarrow \theta - \eta\,\frac{\partial L}{\partial \theta}"></div></p>
    </div>
    <div class="step-panel" data-on="w0 gr w1 mm5" data-focus="w1">
      <div class="step-kicker">Шаг 3 · новые веса</div>
      <h4>Каждая клетка меняется независимо</h4>
<p><div class="math-display" data-tex="0{,}8 - 0{,}5\cdot(-0{,}2516) = 0{,}9258, \qquad -1{,}0 - 0{,}5\cdot(-0{,}0655) = -0{,}9672"></div></p><p>Вес часов прибавил 0,126, вес пропусков сдвинулся всего на 0,033 — его градиент был вчетверо меньше.</p>
    </div>
    <div class="step-panel" data-on="w1 bs mm5" data-focus="bs">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4>b обновляется той же строкой</h4>
<p>Никакого особого правила для сдвига нет, и в коде он обычно даже не выделяется в отдельную переменную.</p>
<p>После шага потеря батча падает с 0,6582 до 0,6377.</p>
    </div>
    <div class="step-panel" data-on="w1 bs pl" data-focus="pl">
      <div class="step-kicker">Шаг 5 · насколько длинный шаг</div>
      <h4>Потеря после шага зависит от η не монотонно</h4>
<p>При η = 0,5 потеря падает с 0,6582 до 0,6377. Лучший одиночный шаг здесь около 0,53, и он даёт 0,6376 — выигрыш смешной по сравнению с самим фактом движения.</p>
<p>Гнаться за ним не нужно: следующий шаг всё равно будет делаться из другой точки.</p>
    </div>
    <div class="step-panel" data-on="pl bad" data-focus="bad">
      <div class="step-kicker">Шаг 6 · когда шаг ломает всё</div>
      <h4>После порога потеря начинает расти</h4>
<p>При η = 1,5 потеря после шага равна 0,7013 — хуже, чем была до него. Направление было правильным, длина — нет.</p>
<p>Порог считается точно: удвоенная обратная величина наибольшего собственного числа матрицы вторых производных. На этом батче он равен 1,0350, на всей обучающей выборке — 0,7340.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout-red">
  <strong>Потеря и точность — разные вещи, и они умеют расходиться.</strong> Возьмите на этом
  же батче <span class="math-inline" data-tex="\eta = 1"></span>: потеря станет 0,6530, то есть
  лучше стартовых 0,6582. А доля верных ответов упадёт с 0,75 до 0,50 — третий студент
  перевалит через порог 0,5 и будет назван сдавшим, хотя он не сдал. Спуск оптимизирует ту
  величину, которую ему дали, и точность в их число не входит: у неё производная равна нулю
  почти всюду, поэтому обучать по ней нечего.
</div>

<p>
  Дальше цикл повторяется: новый прямой проход, новая потеря, новый градиент. Ниже — настоящий
  лог обучения на всех 150 студентах при
  <span class="math-inline" data-tex="\eta = 0{,}5"></span>.
</p>

<div class="console-title">Полный прогон · настоящий вывод</div>
<div class="console"><span class="cmd">$ python3 train.py</span>
шаг    потеря обуч   точность   потеря отл
    0      0.3828      0.9000     0.3170
    1      0.3627      0.8600     —
   30      0.3223      0.9000     —
  300      0.2743      0.9000     —
 3000      0.2709      0.9000     0.2198
w = [2.3049, -3.4718]  b = -4.8372
<span class="chi">правило данных: [1.6, -2.2]  b = -3.4</span>
точность на отложенных: 0.92  (46 из 50)
</div>

<p>
  Две вещи в этом логе стоит заметить. Первая: точность после первого шага не выросла, а упала —
  с 0,90 до 0,86, — хотя потеря честно уменьшилась. Через десять шагов она вернулась. Вторая:
  найденные веса не совпали с правилом, породившим данные, и это нормально. Наклон границы
  у модели 0,664 против 0,727 у правила — направление почти то же, а длина вектора весов
  завышена вдвое. Так работает максимум правдоподобия на конечной выборке: если сгенерировать
  тем же правилом 20 000 студентов, спуск приходит к (1,59; −2,21) при b = −3,39.
</p>

<div class="callout-yellow">
  <strong>Ниже неопределённости не спуститься:</strong> метки разыграны монеткой с вероятностью
  <span class="math-inline" data-tex="\sigma(1{,}6x_1 - 2{,}2x_2 - 3{,}4)"></span>, а не заданы
  жёстко. Даже модель, знающая настоящие коэффициенты, будет ошибаться на этой случайности:
  на большой выборке её средняя потеря равна 0,3492, а доля верных ответов — 84,7 %. Наши 0,2709
  на обучении ниже этого предела не потому, что модель лучше правила, а потому, что она
  подстроилась под конкретные 150 меток. Отложенные 50 студентов оказались лёгкими — на них
  и само правило даёт всего 0,2270.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> направление даёт обратный проход, длину выбираете вы.
  Ошибка в направлении уводит модель не туда, слишком длинный шаг разгоняет потерю, слишком
  короткий просто стоит времени. И ни один из них не гарантирует роста точности: её улучшение —
  побочный эффект уменьшения потери, а не его определение.
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
  и проследите, где она появляется и где исчезает. Она входит с батчем, проходит сигмоиду
  без изменений, доживает до столбца
  <span class="math-inline" data-tex="\hat{\mathbf{y}} - \mathbf{y}"></span> — и пропадает
  ровно там, где <span class="math-inline" data-tex="X^\top"></span> сворачивает её в градиент.
</p>

<p>Посмотрим пошагово, как формы стыкуются между собой.</p>

<div class="stage" id="stageDM" tabindex="0">
  <div class="stage-figure">
<svg id="dm" viewBox="0 0 960 620" role="img" aria-label="Карта размерностей: прямой проход, обратный и шаг">
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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<text x="480" y="62" class="cap" text-anchor="middle">все формы одной картинкой: N объектов, P признаков</text>
<g data-key="f">
<text x="40" y="82" class="cap" text-anchor="start">ПРЯМОЙ ПРОХОД</text>
<rect x="40" y="112" width="90" height="96" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="85" y1="112" x2="85" y2="208" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="136" x2="130" y2="136" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="160" x2="130" y2="160" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="184" x2="130" y2="184" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="85" y="100" text-anchor="middle" font-size="13" fill="#111111">N × P</text>
<text x="85" y="232" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">X</text>
<text x="148" y="164" class="lbl" text-anchor="middle">·</text>
<rect x="166" y="132" width="40" height="56" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="166" y1="160" x2="206" y2="160" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="186" y="120" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="186" y="212" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
<text x="224" y="164" class="lbl" text-anchor="middle">+</text>
<rect x="242" y="148" width="40" height="28" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<text x="262" y="136" text-anchor="middle" font-size="13" fill="#111111">1</text>
<text x="262" y="200" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">b</text>
<text x="300" y="164" class="lbl" text-anchor="middle">=</text>
<rect x="318" y="112" width="40" height="96" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="318" y1="136" x2="358" y2="136" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="318" y1="160" x2="358" y2="160" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="318" y1="184" x2="358" y2="184" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="338" y="100" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="338" y="232" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">z</text>
<line x1="366" y1="160" x2="396" y2="160" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#dm-arw)"/>
<text x="381" y="140" class="cap" text-anchor="middle">σ</text>
<rect x="408" y="112" width="40" height="96" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="408" y1="136" x2="448" y2="136" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="408" y1="160" x2="448" y2="160" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="408" y1="184" x2="448" y2="184" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="428" y="100" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="428" y="232" text-anchor="middle" font-size="17" fill="#5F9420" font-weight="700" font-style="italic">ŷ</text>
<text x="466" y="164" class="lbl" text-anchor="middle">−</text>
<rect x="484" y="112" width="40" height="96" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="484" y1="136" x2="524" y2="136" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="484" y1="160" x2="524" y2="160" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="484" y1="184" x2="524" y2="184" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="504" y="100" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="504" y="232" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">y</text>
<line x1="532" y1="160" x2="566" y2="160" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#dm-arr)"/>
<rect x="580" y="132" width="130" height="56" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<text x="645" y="160" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">L</text>
<text x="645" y="182" class="cap" text-anchor="middle">1 × 1</text>
</g>
<g data-key="b1">
<text x="40" y="264" class="cap" text-anchor="start">ОБРАТНЫЙ ПРОХОД</text>
<rect x="40" y="294" width="50" height="96" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/>
<line x1="40" y1="318" x2="90" y2="318" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="342" x2="90" y2="342" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="366" x2="90" y2="366" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="65" y="282" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="65" y="414" text-anchor="middle" font-size="17" fill="#9C0908" font-weight="700" font-style="italic">ŷ − y</text>
<text x="108" y="346" class="lbl" text-anchor="middle">·</text>
<text x="136" y="352" class="lbl" text-anchor="middle">1/N</text>
<text x="164" y="346" class="lbl" text-anchor="middle">=</text>
<rect x="182" y="294" width="50" height="96" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="182" y1="318" x2="232" y2="318" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="182" y1="342" x2="232" y2="342" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="182" y1="366" x2="232" y2="366" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="207" y="282" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="207" y="414" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂z</text>
</g>
<g data-key="b2">
<rect x="290" y="310" width="130" height="64" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="322.5" y1="310" x2="322.5" y2="374" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="355" y1="310" x2="355" y2="374" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="387.5" y1="310" x2="387.5" y2="374" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="290" y1="342" x2="420" y2="342" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="355" y="298" text-anchor="middle" font-size="13" fill="#111111">P × N</text>
<text x="355" y="398" text-anchor="middle" font-size="17" fill="#2A5E9B" font-weight="700" font-style="italic">Xᵀ</text>
<text x="438" y="346" class="lbl" text-anchor="middle">·</text>
<rect x="456" y="294" width="50" height="96" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="456" y1="318" x2="506" y2="318" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="456" y1="342" x2="506" y2="342" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="456" y1="366" x2="506" y2="366" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="481" y="282" text-anchor="middle" font-size="13" fill="#111111">N × 1</text>
<text x="481" y="414" text-anchor="middle" font-size="17" fill="#B76A11" font-weight="700" font-style="italic">∂L/∂z</text>
<text x="524" y="346" class="lbl" text-anchor="middle">=</text>
<rect x="542" y="310" width="40" height="64" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="542" y1="342" x2="582" y2="342" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="562" y="298" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="562" y="398" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
</g>
<g data-key="b3">
<rect x="640" y="326" width="130" height="32" rx="2" fill="#9A9489" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="672.5" y1="326" x2="672.5" y2="358" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="705" y1="326" x2="705" y2="358" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="737.5" y1="326" x2="737.5" y2="358" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="705" y="314" text-anchor="middle" font-size="13" fill="#111111">1 × N</text>
<text x="705" y="382" text-anchor="middle" font-size="17" fill="#6E6960" font-weight="700" font-style="italic">1ᵀ</text>
<text x="788" y="346" class="lbl" text-anchor="middle">·</text>
<text x="822" y="346" class="lbl" text-anchor="middle">→</text>
<rect x="846" y="326" width="40" height="32" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<text x="866" y="314" text-anchor="middle" font-size="13" fill="#111111">1 × 1</text>
<text x="866" y="382" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∂L/∂b</text>
</g>
<g data-key="s">
<text x="40" y="446" class="cap" text-anchor="start">ШАГ</text>
<rect x="40" y="476" width="40" height="64" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="40" y1="508" x2="80" y2="508" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="60" y="464" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="60" y="564" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
<text x="98" y="512" class="lbl" text-anchor="middle">−</text>
<text x="126" y="518" class="lbl" text-anchor="middle">η ·</text>
<rect x="154" y="476" width="40" height="64" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="154" y1="508" x2="194" y2="508" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="174" y="464" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="174" y="564" text-anchor="middle" font-size="17" fill="#A62E8E" font-weight="700" font-style="italic">∇wL</text>
<text x="212" y="512" class="lbl" text-anchor="middle">=</text>
<rect x="230" y="476" width="40" height="64" rx="2" fill="#C29E08" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="230" y1="508" x2="270" y2="508" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="250" y="464" text-anchor="middle" font-size="13" fill="#111111">P × 1</text>
<text x="250" y="564" text-anchor="middle" font-size="17" fill="#8F7406" font-weight="700" font-style="italic">w</text>
</g>
<g data-key="rule" data-only="1">
<rect x="330" y="460" width="590" height="96" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="348" y="486" class="cap" text-anchor="start">ДВЕ ПРОВЕРКИ, КОТОРЫЕ ЛОВЯТ ПОЧТИ ВСЁ</text>
<text x="348" y="516" class="val" text-anchor="start">1. в каждом произведении внутренние размеры совпадают</text>
<text x="348" y="544" class="val" text-anchor="start">2. форма градиента равна форме своего параметра</text>
</g>
<text x="40" y="600" class="legend" text-anchor="start">N — число объектов в батче, P — число признаков · в нашем примере N = 4, P = 2</text>
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
<p>N входит в X и доживает до столбца вероятностей: сколько студентов дали, столько предсказаний получили. P исчезает при первом же умножении, а сигмоида форму не трогает.</p>
<p><div class="math-display" data-tex="[N,P]\cdot[P,1] \rightarrow [N,1] \xrightarrow{\ \sigma\ } [N,1], \qquad [N,1] \rightarrow [1]"></div></p>
    </div>
    <div class="step-panel" data-on="f b1" data-focus="b1">
      <div class="step-kicker">Шаг 2 · сигнал ошибки</div>
      <h4>Форма та же, что у предсказаний</h4>
<p>Вычитание меток и умножение на скаляр 1/N с формой ничего не делают. Это единственная величина обратного прохода, которая живёт на оси объектов.</p>
<p>Производной сигмоиды здесь нет — она сократилась при выводе, и в коде её действительно не считают.</p>
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
  модели: признаки <span class="math-inline" data-tex="X"></span> и метки
  <span class="math-inline" data-tex="\mathbf{y}"></span>.
</p>

<pre><code>import numpy as np
import pandas as pd

# Шаг 1. Сырые данные — как выгрузка из ведомости.
# Каждый студент это словарь; на практике сюда же легли бы строки из CSV или БД.
records = [
    {"name": "Аружан",  "hours": 20, "missed": 5,  "passed": 0},
    {"name": "Данияр",  "hours": 40, "missed": 2,  "passed": 1},
    {"name": "Мария",   "hours": 30, "missed": 10, "passed": 0},
    {"name": "Тимур",   "hours": 20, "missed": 9,  "passed": 1},
    # ... всего 150 строк в обучающей выборке
]

# Шаг 2. Кладём в pandas — теперь это привычная таблица.
df = pd.DataFrame(records)
print(df.head())
print(df.groupby("passed")[["hours", "missed"]].mean())   # взгляд на разницу классов

# Шаг 3. Достаём в NumPy только нужные колонки: признаки X и метки y.
X = df[["hours", "missed"]].to_numpy(dtype=float)   # (n, 2)
y = df["passed"].to_numpy(dtype=float)              # (n,)</code></pre>

<div class="callout-blue">
  <strong>Почему признаки делят на десять:</strong> часы измеряются десятками, пропуски —
  единицами. Если оставить как есть, у одного признака градиент окажется на порядок больше
  просто из-за единиц измерения, и допустимый шаг спуска упадёт почти в сто раз: 0,0078 вместо
  0,7340. Приведение к одному масштабу — самое дешёвое, что можно сделать для устойчивости.
</div>

<pre><code># Масштабирование: часы в десятках часов, пропуски в десятках занятий.
# Ровно то, что в статье записано как x1 и x2.
X = X / np.array([10.0, 10.0])

# Более общий приём — стандартизация к среднему 0 и разбросу 1:
# X = (X - X.mean(axis=0)) / X.std(axis=0)</code></pre>

### Версия 1. Просто функции на NumPy

<p>
  Это «голая» математика из частей 6–11: модель — матричное умножение и сигмоида, обучение —
  цикл forward → loss → backward → update. Каждая строка здесь уже выведена выше вручную.
</p>

<pre><code>def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def forward(X, w, b):                  # FORWARD: ŷ = σ(X · w + b)
    return sigmoid(X @ w + b)          # [n,2]·[2,1] → [n,1]

def log_loss(yhat, y):                 # LOSS: средний −ln вероятности правды
    return -np.mean(y * np.log(yhat) + (1 - y) * np.log(1 - yhat))

def gradients(X, y, yhat):             # BACKWARD: выведено в части 9
    g = (yhat - y) / len(y)            # сигнал ошибки — вся производная целиком
    return X.T @ g, g.sum()            # ∂L/∂w — [2], ∂L/∂b — число

w = np.array([0.8, -1.0])              # стартовая догадка из части 7
b = -2.0
eta = 0.5                              # learning rate — длина шага

for step in range(3000):               # тот самый цикл из четырёх действий
    yhat = forward(X, w, b)
    dw, db = gradients(X, y, yhat)
    w -= eta * dw                      # UPDATE: θ ← θ − η · ∂L/∂θ
    b -= eta * db

print(np.round(w, 4), round(b, 4))     # [ 2.3049 -3.4718] -4.8372
print(round(log_loss(forward(X, w, b), y), 4))   # 0.2709</code></pre>

<div class="console-title">Результат прогона · настоящий вывод</div>
<div class="console"><span class="cmd">$ python3 train.py</span>
шаг    потеря обуч   точность   потеря отл
    0      0.3828      0.9000     0.3170
    1      0.3627      0.8600     —
   30      0.3223      0.9000     —
  300      0.2743      0.9000     —
 3000      0.2709      0.9000     0.2198
w = [2.3049, -3.4718]  b = -4.8372
<span class="chi">правило данных: [1.6, -2.2]  b = -3.4</span>
точность на отложенных: 0.92  (46 из 50)
</div>

### Устойчивый счёт потери через логиты

<p>
  Наивная формула с <code>np.log(sigmoid(z))</code> ломается на больших по модулю логитах:
  при <span class="math-inline" data-tex="z &lt; -745"></span> сигмоида в float64 обращается
  в ноль, а логарифм нуля даёт минус бесконечность. Лечится тождеством, которое проверяется
  подстановкой обоих значений <span class="math-inline" data-tex="y"></span>:
</p>

<p><div class="math-display" data-tex="\ell = \ln\bigl(1 + e^{z}\bigr) - y\,z"></div></p>

<pre><code>def log_loss_stable(z, y):             # z — логиты, а не вероятности
    return np.mean(np.logaddexp(0, z) - y * z)

# np.logaddexp(0, z) считает ln(1 + e^z) без переполнения;
# именно так устроены BCEWithLogitsLoss в PyTorch и log_loss в sklearn.</code></pre>

### Проверка градиента без формул

<p>
  Прежде чем доверять выведенному вручную backward, его стоит сверить с численной производной.
  Приём универсальный и работает для любой модели.
</p>

<pre><code>def numeric_grad(X, y, w, b, eps=1e-6):
    L = lambda w, b: log_loss(forward(X, w, b), y)
    g = np.zeros_like(w)
    for p in range(len(w)):
        e = np.zeros_like(w); e[p] = eps
        g[p] = (L(w + e, b) - L(w - e, b)) / (2 * eps)
    gb = (L(w, b + eps) - L(w, b - eps)) / (2 * eps)
    return g, gb

# на батче из четырёх студентов расхождение — 2.2e-11</code></pre>

### Почему здесь нет формулы, как у наименьших квадратов

<p>
  У линейной регрессии минимум находится одной строкой:
  <span class="math-inline" data-tex="\mathbf{w} = (X^\top X)^{-1}X^\top\mathbf{y}"></span>.
  Здесь так не получится. Приравняв градиент нулю, мы получаем
</p>

<p><div class="math-display" data-tex="X^\top\bigl(\sigma(X\mathbf{w} + b) - \mathbf{y}\bigr) = \mathbf{0}"></div></p>

<p>
  и это уравнение нелинейно относительно <span class="math-inline" data-tex="\mathbf{w}"></span>:
  веса стоят внутри сигмоиды, вынести их наружу нельзя. Решение существует, но выражается
  только итеративно — градиентным спуском, как у нас, или методом Ньютона, который в статистике
  называют IRLS. Библиотеки берут что-то из этого: <code>sklearn</code> по умолчанию использует
  L-BFGS.
</p>

<pre><code>from sklearn.linear_model import LogisticRegression

# C=1e6 фактически отключает регуляризацию — иначе sklearn решает другую задачу
clf = LogisticRegression(C=1e6, max_iter=1000).fit(X, y)
print(clf.coef_, clf.intercept_, clf.n_iter_)</code></pre>

<div class="console-title">Наш спуск против sklearn · настоящий вывод</div>
<div class="console"><span class="cmd">$ python3 compare.py</span>
sklearn: w = [2.3051, -3.4716]  b = -4.8380  за 13 итераций
наш спуск за 3000 шагов: w = [2.3049, -3.4718]  b = -4.8372
</div>

<div class="callout-red">
  <strong>Если классы разделяются прямой, минимума не существует.</strong> Возьмите четыре
  объекта, которые прямая делит без ошибок, и запустите спуск: потеря будет падать, а длина
  вектора весов — расти без остановки. На нашем примере ‖w‖ равна 2,27 после ста шагов, 4,13
  после тысячи, 6,59 после десяти тысяч и 9,21 после ста тысяч, а потеря доходит до 0,000194
  и продолжает уменьшаться. Модель разгоняет уверенность до бесконечности, потому что за это
  ничего не штрафует. Ровно поэтому в <code>sklearn</code> регуляризация включена по умолчанию,
  и отключать её, как в примере выше, стоит только чтобы сравнить два численных метода.
</div>

### Версия 2. Тот же код, но в объектном виде

<p>
  Математика не меняется: те же forward, loss, градиенты и шаг складываются в класс. Это переход
  к тому, как модели устроены в библиотеках.
</p>

<pre><code>class LogisticRegressionScratch:
    def __init__(self, n_features):
        self.w = np.zeros(n_features)      # веса признаков
        self.b = 0.0                       # сдвиг

    def forward(self, X):                  # FORWARD
        return sigmoid(X @ self.w + self.b)

    def loss(self, yhat, y):               # LOSS
        return -np.mean(y * np.log(yhat) + (1 - y) * np.log(1 - yhat))

    def backward(self, X, y, yhat):        # BACKWARD
        g = (yhat - y) / len(y)
        self.dw = X.T @ g
        self.db = g.sum()

    def step(self, eta):                   # UPDATE
        self.w -= eta * self.dw
        self.b -= eta * self.db

    def fit(self, X, y, eta=0.5, epochs=3000):
        for _ in range(epochs):
            yhat = self.forward(X)
            self.backward(X, y, yhat)
            self.step(eta)

    def predict(self, X, threshold=0.5):   # решение появляется только здесь
        return (self.forward(X) >= threshold).astype(int)

model = LogisticRegressionScratch(n_features=2)
model.fit(X, y)
print(np.round(model.w, 4), round(model.b, 4))</code></pre>

### Версия 3. PyTorch и autograd

<p>
  Цикл остаётся тем же, но ручной вывод градиентов заменяется вызовом
  <code>loss.backward()</code>. PyTorch строит ровно тот граф, который мы рисовали в части 8,
  и проходит по нему в обратном порядке, перемножая те же локальные производные — включая то
  самое сокращение, которое он тоже выполняет заранее внутри
  <code>BCEWithLogitsLoss</code>.
</p>

<pre><code>import torch
import torch.nn as nn

Xt = torch.tensor(X, dtype=torch.float32)
yt = torch.tensor(y, dtype=torch.float32).unsqueeze(1)

model = nn.Linear(2, 1)                    # MODEL: logits = X·w + b
loss_fn = nn.BCEWithLogitsLoss()           # LOSS: сигмоида + log loss устойчиво
opt = torch.optim.SGD(model.parameters(), lr=0.5)   # UPDATE

for step in range(3000):
    logits = model(Xt)                     # FORWARD
    loss = loss_fn(logits, yt)             # LOSS
    opt.zero_grad()                        # обнулить прошлые градиенты
    loss.backward()                        # BACKWARD — вместо наших формул
    opt.step()                             # UPDATE

probs = torch.sigmoid(model(Xt))           # вероятности — уже после обучения</code></pre>

<div class="callout-yellow">
  <strong>Не ставьте сигмоиду в модель, если берёте BCEWithLogitsLoss.</strong> Эта функция
  потерь ждёт логиты и применяет сигмоиду внутри — устойчивым способом из раздела выше. Если
  подать ей уже готовые вероятности, сигмоида применится дважды: обучение не упадёт с ошибкой,
  но пойдёт заметно хуже, и найти такую опечатку тяжело. Второй классический промах — забыть
  <code>zero_grad</code>: PyTorch градиенты накапливает, а не перезаписывает.
</div>

### Итоговая карта одного шага обучения

<table class="shape-table">
  <tr><th>Действие</th><th>Формула</th><th>NumPy</th><th>PyTorch</th></tr>
  <tr><td>forward</td><td><span class="math-inline" data-tex="\hat{\mathbf{y}} = \sigma(X\mathbf{w} + b)"></span></td><td><code>sigmoid(X @ w + b)</code></td><td><code>model(Xt)</code></td></tr>
  <tr><td>loss</td><td><span class="math-inline" data-tex="L = -\frac{1}{N}\sum[y\ln\hat y + (1-y)\ln(1-\hat y)]"></span></td><td><code>log_loss(yhat, y)</code></td><td><code>loss_fn(logits, yt)</code></td></tr>
  <tr><td>backward</td><td><span class="math-inline" data-tex="\nabla_{\mathbf{w}} L = \frac{1}{N}X^\top(\hat{\mathbf{y}}-\mathbf{y})"></span></td><td><code>X.T @ g</code></td><td><code>loss.backward()</code></td></tr>
  <tr><td>update</td><td><span class="math-inline" data-tex="\theta \leftarrow \theta - \eta\nabla_\theta L"></span></td><td><code>w -= eta * dw</code></td><td><code>opt.step()</code></td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> между формулами из этой статьи и строчками PyTorch нет
  разрыва. Библиотека не делает ничего, кроме того, что мы посчитали руками, — она только
  выполняет это быстрее, устойчивее к переполнению и не требует выводить производные заново
  для каждой новой модели.
</div>

---

## Часть 14. Анатомия обучения: так устроены все модели

<p>
  Всё, что разобрано выше, — не особенность логистической регрессии. Это скелет обучения любой
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
<text x="105" y="35" class="mm" text-anchor="middle">студенты → X</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">w · b</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">логит z</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="555" y="35" class="mm" text-anchor="middle">вероятность ŷ</text>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="705" y="35" class="mm" text-anchor="middle">потеря L</text>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<text x="480" y="62" class="cap" text-anchor="middle">Task — Data — Model — Loss. Один и тот же каркас для всех ML-моделей</text>
<rect x="40" y="88" width="430" height="420" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="66" y="126" font-size="20" fill="#111111" text-anchor="start" font-weight="800">Анатомия обучения</text>
<text x="66" y="166" font-size="16" fill="#111111" text-anchor="start">У любой модели — от логистической</text>
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
<p>Мы предсказываем класс — сдаст или нет. Отсюда следует и выбор функции потерь: для бинарной классификации берут log loss, для нескольких классов — кросс-энтропию с softmax, для регрессии — квадрат ошибки.</p>
<p>Task — единственный блок, который не выбирают: он приходит извне вместе с задачей.</p>
    </div>
    <div class="step-panel" data-on="task loss data model" data-focus="data">
      <div class="step-kicker">Шаг 3 · Data</div>
      <h4>Пары «вход — правильный ответ»</h4>
<p>Для нас это 150 студентов: матрица X и столбец меток из нулей и единиц. Данные не меняются при обучении и целиком определяют, чему модель способна научиться.</p>
<p>В части 1 было видно, что это ограничение реальное: по одним часам потеря 0,3517, по двум признакам — 0,2709.</p>
    </div>
    <div class="step-panel" data-on="task loss data model" data-focus="model">
      <div class="step-kicker">Шаг 4 · Model</div>
      <h4>То, что обучаем</h4>
<p>Здесь это три числа и правило <span class="math-inline" data-tex="\hat{\mathbf{y}} = \sigma(X\mathbf{w} + b)"></span>. В линейной регрессии сигмоиды нет, в нейросети слоёв несколько, в трансформере весов миллиарды.</p>
<p>Модель принимает x и выдаёт ŷ. Больше от неё ничего не требуется.</p>
    </div>
    <div class="step-panel" data-on="task loss data model" data-focus="loss">
      <div class="step-kicker">Шаг 5 · Loss</div>
      <h4>Одно число, которое можно уменьшать</h4>
<p>Loss сравнивает ŷ с настоящим ответом и выдаёт скаляр. Именно скаляр: по столбцу вероятностей нельзя сказать, какая модель лучше, а по одному числу — можно.</p>
<p>И у этого числа есть производная по каждому параметру — то, ради чего всё и затевалось. Точность, кстати, такого числа не даёт: у неё производная равна нулю почти всюду.</p>
    </div>
    <div class="step-panel" data-on="task loss data model cycle" data-focus="cycle">
      <div class="step-kicker">Шаг 6 · цикл</div>
      <h4>Предсказание вперёд, градиенты назад</h4>
<p>Модель отдаёт ŷ в Loss, Loss возвращает градиенты в Model. Один оборот — один шаг обучения; таких оборотов тысячи.</p>
<p>Именно этот круг мы прошли по частям: forward в частях 6 и 7, потеря там же, backward в частях 8–10, шаг в части 11. Ничего сверх этого в обучении не происходит — ни у логистической регрессии, ни у языковой модели.</p>
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
  <tr><td>Потеря</td><td>MSE</td><td>log loss</td><td>кросс-энтропия или MSE</td></tr>
  <tr><td>Сигнал ошибки</td><td><span class="math-inline" data-tex="\frac{2}{N}(\hat{\mathbf{y}}-\mathbf{y})"></span></td><td><span class="math-inline" data-tex="\frac{1}{N}(\hat{\mathbf{y}}-\mathbf{y})"></span></td><td>то же, дальше — через слои</td></tr>
  <tr><td>Градиент весов</td><td><span class="math-inline" data-tex="X^\top\delta"></span></td><td><span class="math-inline" data-tex="X^\top\delta"></span></td><td><span class="math-inline" data-tex="A^\top\delta"></span> на каждом слое</td></tr>
  <tr><td>Шаг</td><td colspan="3"><span class="math-inline" data-tex="\theta\leftarrow\theta-\eta\nabla_\theta L"></span> — одинаково везде</td></tr>
</table>

<p>
  Обратите внимание на две средние строки. Сигнал ошибки у обеих моделей — это разность
  «предсказал минус правда», хотя выводился он из совершенно разных функций потерь. А строка
  с градиентом весов совпадает у всех трёх: транспонированная матрица входов, умноженная
  на сигнал ошибки, — это не формула конкретной модели, а общее правило для линейного слоя,
  откуда бы сигнал ни пришёл.
</p>

<p>Весь шаг обучения на numpy умещается в шесть строк, и каждая уже разобрана:</p>

<pre><code>for step in range(3000):
    z    = X @ w + b          # логиты, часть 5
    yhat = 1 / (1 + np.exp(-z))   # сигмоида, часть 5
    g    = (yhat - y) / len(y)    # сигнал ошибки, часть 8
    w   -= eta * (X.T @ g)        # градиент весов, часть 9
    b   -= eta * g.sum()          # градиент сдвига, часть 9
</code></pre>

<p>
  В PyTorch средние строки заменяются на <code>loss.backward()</code>, но происходит там
  ровно то же самое: библиотека строит тот же граф из части 8 и проходит по нему в обратном
  порядке, перемножая те же локальные производные.
</p>

### Что ломается, если сдвинуть одно условие

<table class="shape-table">
  <tr><th>Эксперимент</th><th>Что получилось</th></tr>
  <tr><td>Шаг длиннее порога</td><td>η = 0,5 → потеря 0,2709; η = 2 → 0,2941 и точность 0,8867. Порог 2/λ<sub>max</sub> = 0,7340</td></tr>
  <tr><td>Признаки в исходных единицах</td><td>обусловленность 104,9 вместо 12,5, порог шага 0,0078; η = 0,5 даёт потерю 2,8852 вместо 0,2709</td></tr>
  <tr><td>Размер батча (200 эпох)</td><td>150 → 0,2785; 16 → 0,2730; 4 → 0,2741; 1 → 0,4329</td></tr>
  <tr><td>Обучение на четырёх студентах</td><td>потеря на них застревает на 0,6278, на отложенных растёт до 0,3845 против 0,2198</td></tr>
</table>

<p>
  Последняя строка любопытнее остальных. Четыре объекта и три параметра — модель должна была бы
  выучить их наизусть, но потеря упёрлась в 0,6278 и дальше не пошла. Причина в самих данных:
  наш батч не разделяется прямой. Студент 4 сдал, пропустив девять занятий, а студент 1 с теми
  же двадцатью часами и пятью пропусками не сдал — значит, прямая обязана считать пропуски
  полезными. Но студент 2 сдал при сорока часах и двух пропусках, а студент 3 не сдал при
  тридцати часах и десяти — из этой пары следует обратное. Никакие три числа не удовлетворяют
  обоим требованиям сразу.
</p>

### Что важно уметь восстановить по памяти

<div class="end-list">
  <ol>
    <li>Данные — матрица <span class="math-inline" data-tex="X\in\mathbb{R}^{N\times P}"></span> и столбец меток <span class="math-inline" data-tex="\mathbf{y}\in\{0,1\}^{N\times 1}"></span>. Строка — объект, столбец — признак.</li>
    <li>Модель — <span class="math-inline" data-tex="P+1"></span> чисел: <span class="math-inline" data-tex="\hat{\mathbf{y}} = \sigma(X\mathbf{w} + b)"></span>. Линейная часть даёт логит, сигмоида делает из него вероятность.</li>
    <li>Логит — это логарифм отношения шансов, поэтому вес читается как множитель к шансам: <span class="math-inline" data-tex="e^{w_p}"></span> на единицу признака.</li>
    <li>Потеря — <span class="math-inline" data-tex="L = -\frac{1}{N}\sum[y\ln\hat y + (1-y)\ln(1-\hat y)]"></span>, выводится из правдоподобия. Ориентир: <span class="math-inline" data-tex="\ln 2 = 0{,}6931"></span> — цена ответа «не знаю».</li>
    <li>Локальные производные: <span class="math-inline" data-tex="\partial\ell/\partial\hat y = (\hat y - y)/[\hat y(1-\hat y)]"></span> и <span class="math-inline" data-tex="\partial\hat y/\partial z = \hat y(1-\hat y)"></span>.</li>
    <li>Они сокращаются нацело: <span class="math-inline" data-tex="\partial\ell/\partial z = \hat y - y"></span>. Это главная формула статьи.</li>
    <li>Отсюда <span class="math-inline" data-tex="\nabla_{\mathbf{w}}L = \frac{1}{N}X^\top(\hat{\mathbf{y}}-\mathbf{y})"></span> и <span class="math-inline" data-tex="\partial L/\partial b = \frac{1}{N}\sum_n(\hat y_n - y_n)"></span> — как у линейной регрессии, только без двойки.</li>
    <li><span class="math-inline" data-tex="X^\top"></span> появляется затем, чтобы свернуть ось объектов и оставить ось признаков; форма градиента всегда равна форме параметра.</li>
    <li>Аналитический градиент сверяется численно: <span class="math-inline" data-tex="(L(\theta+\varepsilon)-L(\theta-\varepsilon))/2\varepsilon"></span> при <span class="math-inline" data-tex="\varepsilon=10^{-6}"></span>.</li>
    <li>Шаг — <span class="math-inline" data-tex="\theta \leftarrow \theta - \eta\nabla_\theta L"></span>; закрытой формулы нет, а на разделимых данных нет и минимума — веса уходят в бесконечность.</li>
  </ol>
</div>

<p>
  Если вы поняли логистическую регрессию, каркас современных моделей у вас в кармане. Дальше
  идут вариации: другие архитектуры, другие функции потерь, другие оптимизаторы. Цикл обучения
  остаётся тем же — forward, потеря, backward, шаг, миллионы раз.
</p>

<p class="tiny">
  Данные синтетические: 200 студентов, для каждого разыграна монетка с вероятностью
  <span class="math-inline" data-tex="\sigma(1{,}6x_1 - 2{,}2x_2 - 3{,}4)"></span>, признаки
  округлены до половины десятка часов и до одного пропуска, выборка разбита на 150 обучающих
  и 50 отложенных. Все числа посчитаны скриптом на этих данных (NumPy 2.4.4, scikit-learn 1.8.0),
  округление — до четвёртого знака. Градиенты сверены с центральными разностями, расхождение
  2,2 · 10⁻¹¹. Фрагмент на PyTorch приведён как перевод того же цикла и в этом окружении
  не запускался.
</p>
