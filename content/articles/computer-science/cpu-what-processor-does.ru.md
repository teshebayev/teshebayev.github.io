



<p class="lead">
  Процессор не «выполняет программу» — он в цикле тянет из памяти по одному байту,
  узнаёт в первом байте команду, а в следующих её аргументы, и обновляет один
  счётчик. Всё остальное в архитектуре x86 — от регистра-матрёшки RAX до
  конвейера и предсказателя переходов — надстройки над этими двумя действиями.
</p>

<p>
  Мы возьмём одну крошечную программу на C, соберём её в настоящие двадцать байт
  машинного кода, положим их в память по адресу <code>1000h</code> и пройдём весь
  путь: как байт едет по шине, как из него получается инструкция, что при этом
  меняется в регистрах и сколько тактов на это уходит. В конце сравним с тем, как
  то же самое делает процессор, выпущенный не в 1978 году.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Биты, байты и шестнадцатеричная запись</strong>
    <p>Достаточно помнить, что 1 байт — это 8 бит, а <code>B8h</code> — это просто число 184.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Программа из семи инструкций</strong>
    <p>20 байт по адресам 1000h–1013h. Одни и те же байты во всех восьми сценах.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Вы посчитаете время работы программы</strong>
    <p>Сможете по машинному коду сказать, что окажется в AX и за сколько тактов.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные, байты, память</span>
  <span><i style="background:#C29E08"></i>операция и такты процессора</span>
  <span><i style="background:#73B222"></i>результат</span>
  <span><i style="background:#C30B0A"></i>то, что не выполняется или ломается</span>
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не
  на всю схему сразу, а только на яркую часть. Положение объектов остаётся
  постоянным, поэтому меняется именно смысл шага, а не карта перед глазами.
  Стрелки на клавиатуре работают, когда сцена в фокусе.
</div>

## Часть 1. Регистры: вся быстрая память процессора

<p>
  <strong>Архитектура процессора</strong> — это набор правил, по которым процессор
  выполняет команды и управляет данными. Программа, собранная под x86, не
  запустится на ARM-смартфоне не потому, что «не хватает мощности», а потому что
  у другой архитектуры другой набор команд, другие регистры и другие правила их
  кодирования. Мы будем говорить про x86 — линию, которая началась с 16-битного
  Intel 8086 в 1978 году и дожила до сегодняшних x86-64.
</p>

<p>
  <strong>Разрядность</strong> процессора — это размер куска данных, который он
  обрабатывает за раз: 2 байта у 16-битного, 4 у 32-битного, 8 у 64-битного.
  Хранит эти куски он в <strong>регистрах</strong> — ячейках памяти прямо на
  кристалле. Их мало и они крошечные: у 8086 всего восемь регистров общего
  назначения по 16 бит, то есть <em>шестнадцать байт</em> на всю самую быструю
  память процессора. Зато обращение к регистру стоит один такт, а к оперативной
  памяти — двести-триста.
</p>

<p>
  Каждый регистр делится пополам: старший байт <code>AH</code> и младший
  <code>AL</code>. Когда появились 32-битные процессоры, старые программы должны
  были продолжать работать, поэтому <code>AX</code> не выбросили, а вложили внутрь
  нового 32-битного <code>EAX</code>. Потом <code>EAX</code> вложили внутрь
  64-битного <code>RAX</code>. Получилась матрёшка, где все четыре имени
  указывают на разные куски одного и того же места.
</p>

<div class="stage" id="stageReg" tabindex="0">
  <div class="stage-figure">
<svg id="rg" viewBox="0 0 960 584" role="img" aria-label="Матрёшка регистров x86: RAX содержит EAX, EAX содержит AX, AX состоит из AH и AL; ниже восемь регистров общего назначения и регистры специального назначения">
  <style>
    #rg { font-family: Helvetica, Arial, sans-serif; }
    #rg .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #rg .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #rg .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #rg .cell{ fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.3; }
    #rg .lbl { font-size: 15px; fill: #111111; }
    #rg .nm  { font-size: 16px; fill: #111111; font-weight: 700; }
    #rg .cap { font-size: 13px; fill: #5E5850; }
    #rg .sm  { font-size: 12px; fill: #5E5850; }
    #rg .hex { font-size: 15px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #rg .dash{ stroke: #5E5850; stroke-width: 1.2; stroke-dasharray: 4 4; fill: none; }
    #rg .pan { fill: #F7F6F1; stroke: #E0DDD3; stroke-width: 1.2; }
    #rg .pl  { font-size: 12px; fill: #5E5850; letter-spacing: .06em; }
    #rg .pt  { font-size: 15px; fill: #111111; }
    #rg .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <text x="40" y="30" class="cap">РЕГИСТР — ЯЧЕЙКА ПАМЯТИ ВНУТРИ САМОГО ПРОЦЕССОРА</text>

  <g data-key="rax">
    <text x="288" y="118" class="nm" text-anchor="end">RAX · 64 бита</text>
    <rect x="300" y="88" width="75" height="48" class="cell"/>
    <rect x="375" y="88" width="75" height="48" class="cell"/>
    <rect x="450" y="88" width="75" height="48" class="cell"/>
    <rect x="525" y="88" width="75" height="48" class="cell"/>
    <rect x="600" y="88" width="75" height="48" class="cell"/>
    <rect x="675" y="88" width="75" height="48" class="cell"/>
    <rect x="750" y="88" width="75" height="48" class="cell"/>
    <rect x="825" y="88" width="75" height="48" class="cell"/>
    <path d="M600 136 V166" class="dash"/>
    <path d="M900 136 V166" class="dash"/>
  </g>

  <g data-key="eax">
    <text x="588" y="196" class="nm" text-anchor="end">EAX · 32 бита</text>
    <rect x="600" y="166" width="75" height="48" class="cell"/>
    <rect x="675" y="166" width="75" height="48" class="cell"/>
    <rect x="750" y="166" width="75" height="48" class="cell"/>
    <rect x="825" y="166" width="75" height="48" class="cell"/>
    <path d="M750 214 V244" class="dash"/>
    <path d="M900 214 V244" class="dash"/>
  </g>

  <g data-key="ax16">
    <text x="738" y="274" class="nm" text-anchor="end">AX · 16 бит</text>
    <rect x="750" y="244" width="75" height="48" class="cell"/>
    <rect x="825" y="244" width="75" height="48" class="cell"/>
  </g>

  <g data-key="ahal">
    <text x="787" y="312" class="cap" text-anchor="middle">AH · старший байт</text>
    <text x="862" y="312" class="cap" text-anchor="middle">AL · младший байт</text>
  </g>

  <g data-key="vals">
    <text x="337" y="119" class="hex" text-anchor="middle">00</text>
    <text x="412" y="119" class="hex" text-anchor="middle">00</text>
    <text x="487" y="119" class="hex" text-anchor="middle">00</text>
    <text x="562" y="119" class="hex" text-anchor="middle">00</text>
    <text x="637" y="119" class="hex" text-anchor="middle">00</text>
    <text x="712" y="119" class="hex" text-anchor="middle">00</text>
    <text x="787" y="119" class="hex" text-anchor="middle">00</text>
    <text x="862" y="119" class="hex" text-anchor="middle">0A</text>
    <text x="637" y="197" class="hex" text-anchor="middle">00</text>
    <text x="712" y="197" class="hex" text-anchor="middle">00</text>
    <text x="787" y="197" class="hex" text-anchor="middle">00</text>
    <text x="862" y="197" class="hex" text-anchor="middle">0A</text>
    <text x="787" y="275" class="hex" text-anchor="middle">00</text>
    <text x="862" y="275" class="hex" text-anchor="middle">0A</text>
  </g>

  <g data-key="gp">
    <text x="60" y="348" class="cap">8 регистров общего назначения по 16 бит — вся быстрая память 8086</text>
    <rect x="60"  y="360" width="96" height="42" class="bx"/>
    <rect x="166" y="360" width="96" height="42" class="bx"/>
    <rect x="272" y="360" width="96" height="42" class="bx"/>
    <rect x="378" y="360" width="96" height="42" class="bx"/>
    <rect x="484" y="360" width="96" height="42" class="bx"/>
    <rect x="590" y="360" width="96" height="42" class="bx"/>
    <rect x="696" y="360" width="96" height="42" class="bx"/>
    <rect x="802" y="360" width="96" height="42" class="bx"/>
    <text x="108" y="387" class="nm" text-anchor="middle">AX</text>
    <text x="214" y="387" class="nm" text-anchor="middle">BX</text>
    <text x="320" y="387" class="nm" text-anchor="middle">CX</text>
    <text x="426" y="387" class="nm" text-anchor="middle">DX</text>
    <text x="532" y="387" class="nm" text-anchor="middle">SI</text>
    <text x="638" y="387" class="nm" text-anchor="middle">DI</text>
    <text x="744" y="387" class="nm" text-anchor="middle">BP</text>
    <text x="850" y="387" class="nm" text-anchor="middle">SP</text>
  </g>

  <g data-key="spec">
    <text x="60" y="430" class="cap">регистры специального назначения — не для данных, а для управления</text>
    <rect x="60"  y="442" width="198" height="46" class="by"/>
    <rect x="274" y="442" width="198" height="46" class="by"/>
    <rect x="488" y="442" width="198" height="46" class="by"/>
    <rect x="702" y="442" width="198" height="46" class="by"/>
    <text x="159" y="464" class="nm" text-anchor="middle">IP</text>
    <text x="373" y="464" class="nm" text-anchor="middle">FLAGS</text>
    <text x="587" y="464" class="nm" text-anchor="middle">CS · DS · SS</text>
    <text x="801" y="464" class="nm" text-anchor="middle">IR</text>
    <text x="159" y="481" class="sm" text-anchor="middle">адрес следующей команды</text>
    <text x="373" y="481" class="sm" text-anchor="middle">результат сравнения</text>
    <text x="587" y="481" class="sm" text-anchor="middle">области памяти</text>
    <text x="801" y="481" class="sm" text-anchor="middle">текущая инструкция</text>
  </g>

  <rect x="40" y="500" width="880" height="54" rx="10" class="pan"/>
  <text x="56" y="531" class="pl">НА ЭТОМ ШАГЕ</text>
  <g data-key="n1" data-only="1"><text x="180" y="531" class="pt">8 регистров × 16 бит = 16 байт — столько данных процессор держит под рукой</text></g>
  <g data-key="n2" data-only="1"><text x="180" y="531" class="pt">AX = 16 бит = 2 байта, значения от 0 до 65 535</text></g>
  <g data-key="n3" data-only="1"><text x="180" y="531" class="pt">AX = AH · 256 + AL — два имени для двух половин одного места</text></g>
  <g data-key="n4" data-only="1"><text x="180" y="531" class="pt">младшие 16 бит EAX — это и есть AX, отдельной ячейки под него нет</text></g>
  <g data-key="n5" data-only="1"><text x="180" y="531" class="pt">RAX ⊃ EAX ⊃ AX ⊃ AL — четыре имени, один кусок кремния</text></g>
  <g data-key="n6" data-only="1"><text x="180" y="531" class="pt">после mov ax, 10: AL = 0Ah, AH = 00h, AX = 000Ah = 10</text></g>
  <g data-key="n7" data-only="1"><text x="180" y="531" class="pt">IP = 1000h — адрес, с которого процессор возьмёт следующую инструкцию</text></g>

  <text x="40" y="570" class="legend">синий — данные и регистры данных · жёлтый — управление процессором</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="gp n1" data-focus="gp">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Восьми регистров хватало на всё</h4>
      <p>У 8086 восемь регистров общего назначения по 16 бит. Это не «мало для той эпохи» —
      это принципиальная особенность: регистры дорогие, их держат на самом кристалле рядом
      с вычислительными блоками, поэтому их всегда единицы, а не тысячи.</p>
      <p>В x86-64 регистров стало шестнадцать. За полвека — рост в два раза, тогда как
      объём оперативной памяти вырос примерно в миллион.</p>
    </div>
    <div class="step-panel" data-on="gp ax16 n2" data-focus="ax16">
      <div class="step-kicker">Шаг 2 · размер</div>
      <h4>AX — два байта, и это вся разрядность 8086</h4>
      <p>Шестнадцать бит — это числа от 0 до 65 535. Именно этот размер и называется
      разрядностью процессора: столько данных он умеет взять в работу за один приём.</p>
    </div>
    <div class="step-panel" data-on="gp ax16 ahal n3" data-focus="ahal">
      <div class="step-kicker">Шаг 3 · половины</div>
      <h4>Половинки AH и AL — это тот же AX</h4>
      <p>Регистр можно адресовать целиком или по байтам: <code>AH</code> — старший байт,
      <code>AL</code> — младший. Отдельной памяти под них нет, это два окна в одну и ту же
      пару байт. Записали в <code>AL</code> — изменилась младшая половина <code>AX</code>.</p>
    </div>
    <div class="step-panel" data-on="gp ax16 ahal eax n4" data-focus="eax">
      <div class="step-kicker">Шаг 4 · расширение</div>
      <h4>32 бита: AX не выбросили, а вложили</h4>
      <p>Когда появились 32-битные процессоры, старые программы должны были продолжать
      работать. Поэтому новый регистр <code>EAX</code> сделали расширением: его младшие
      16 бит — это буквально <code>AX</code>, к которому старая программа обращается по
      старому имени и получает то, что ожидает.</p>
    </div>
    <div class="step-panel" data-on="gp ax16 ahal eax rax n5" data-focus="rax">
      <div class="step-kicker">Шаг 5 · матрёшка</div>
      <h4>64 бита: та же операция ещё раз</h4>
      <p>С <code>RAX</code> повторили приём: 64 бита, младшие 32 из которых —
      <code>EAX</code>. Четыре имени описывают вложенные куски одного места, и в этом вся
      совместимость x86: код 1978 года формально всё ещё запускается на процессоре 2026-го.</p>
    </div>
    <div class="step-panel" data-on="gp ax16 ahal eax rax vals n6" data-focus="vals">
      <div class="step-kicker">Шаг 6 · наши числа</div>
      <h4>Первая инструкция программы кладёт сюда 10</h4>
      <p>Наша программа начинается с <code>mov ax, 10</code>. Десятка в шестнадцатеричной
      записи — <code>0Ah</code>, она укладывается в один байт, поэтому уходит в
      <code>AL</code>, а <code>AH</code> остаётся нулевым. Все старшие байты
      <code>EAX</code> и <code>RAX</code> тоже нули — и на всей схеме меняется ровно
      одна ячейка.</p>
    </div>
    <div class="step-panel" data-on="gp ax16 ahal eax rax vals spec n7" data-focus="spec">
      <div class="step-kicker">Шаг 7 · управление</div>
      <h4>Отдельные регистры, в которых лежат не данные, а состояние</h4>
      <p>Регистры общего назначения хранят числа. Но процессору нужно ещё помнить, какую
      команду выполнять следующей (<code>IP</code>), чем закончилось прошлое сравнение
      (<code>FLAGS</code>) и какую команду он прямо сейчас разбирает (<code>IR</code>).
      Именно <code>IP</code> будет главным героем всей статьи: программа — это, по сути,
      история изменений одного этого числа.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-red">
  <strong>Осторожно с формулировкой «разрядность задаёт объём памяти»:</strong> её часто
  пишут как «процессор может обратиться к адресам от 0 до 2<sup>разрядность</sup>», но это
  не так. Разрядность — это ширина регистров и данных, а объём адресуемой памяти задаёт
  число линий адресной шины, и совпадать они не обязаны. У 8086 регистры 16-битные, но
  адресных линий двадцать: 2<sup>20</sup> = 1 МБ, а не 64 КБ. Ровно ради этого несовпадения
  в 8086 и появились сегментные регистры.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> у процессора десятки байт собственной памяти, и
  всё остальное — про то, как быстро таскать данные в эти байты и обратно.
</div>

---

## Часть 2. Цикл чтения: как байт едет по шине

<p>
  Регистры мы заполнили — но откуда в них берутся числа? Из памяти. И память, и
  ПЗУ, и диск устроены одинаково: это набор пронумерованных ячеек, в каждой из
  которых лежит ровно один байт. Это <strong>байтовая адресация</strong>, и она
  дожила до сегодняшнего дня без изменений.
</p>

<p>
  Между процессором и памятью — <strong>системная шина</strong>: пучок физических
  проводов, разбитый на три группы. По <strong>адресной шине</strong> процессор
  говорит, какую ячейку он хочет; по <strong>шине управления</strong> — что
  именно с ней делать; по <strong>шине данных</strong> приходит ответ. Число
  линий адресной шины и задаёт объём памяти, до которого процессор дотянется:
</p>

<div class="math-display" data-tex="2^{16} = 64\ \text{КБ}, \qquad 2^{20} = 1\ \text{МБ}, \qquad 2^{32} = 4\ \text{ГБ}"></div>

<p>
  Мы берём для примера шестнадцать адресных линий — так проще, и так устроен
  разбор в исходном параграфе. У настоящего 8086 их было двадцать (отсюда и
  мегабайт памяти), а у 8088 часть линий вообще работала по очереди то под адрес,
  то под данные: мультиплексирование удешевляло корпус микросхемы. Современные
  шины не мультиплексированы — адрес и данные идут параллельно, потому что важна
  скорость, а не цена.
</p>

<p>
  Дальше есть одна деталь, на которой спотыкаются почти все. Линии нумеруются от
  младшего бита к старшему: <code>A0</code> — младший, <code>A15</code> — старший.
  Если рисовать провода слева направо в порядке номеров, то привычная запись
  числа окажется зеркальной. Адрес <code>1000h</code> — это
  <code>0001 0000 0000 0000</code>, а на линиях <code>A0…A15</code> он же выглядит
  как <code>0000 0000 0000 1000</code>. Число не изменилось, изменился порядок,
  в котором мы на него смотрим.
</p>

<div class="callout-blue">
  <strong>Активный ноль.</strong> На шине управления логика перевёрнута: сигнал
  <em>работает</em>, когда он равен нулю. Это не философия, а физика семидесятых —
  тогда транзисторную схему было проще и дешевле включать низким уровнем, чем
  высоким. Поэтому «читаем» записывается как <code>RD = 0, WR = 1</code>, и такие
  сигналы принято помечать чертой сверху.
</div>

<p>
  Посмотрим пошагово, что происходит на проводах, когда процессор хочет получить
  байт по адресу <code>1000h</code>. Это первый байт нашей программы, и он окажется
  равным <code>B8h</code>.
</p>

<div class="stage" id="stageBus" tabindex="0">
  <div class="stage-figure">
<svg id="bs" viewBox="0 0 960 572" role="img" aria-label="Временная диаграмма цикла чтения из памяти: тактовый сигнал, адресная шина, сигналы RD и WR, ответные CE и OE, шина данных">
  <style>
    #bs { font-family: Helvetica, Arial, sans-serif; }
    #bs .wave { stroke: #C29E08; stroke-width: 2; fill: none; }
    #bs .wctl { stroke: #5E5850; stroke-width: 2; fill: none; }
    #bs .busb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #bs .busg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #bs .idle { stroke: #B8B3A8; stroke-width: 1.4; stroke-dasharray: 5 5; fill: none; }
    #bs .tick { stroke: #E0DDD3; stroke-width: 1; stroke-dasharray: 3 4; }
    #bs .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #bs .lbl { font-size: 14px; fill: #111111; }
    #bs .cap { font-size: 13px; fill: #5E5850; }
    #bs .sm  { font-size: 12px; fill: #5E5850; }
    #bs .red { font-size: 12px; fill: #C30B0A; }
    #bs .brace { stroke: #C29E08; stroke-width: 1.6; fill: none; }
    #bs .pan { fill: #F7F6F1; stroke: #E0DDD3; stroke-width: 1.2; }
    #bs .pl  { font-size: 12px; fill: #5E5850; letter-spacing: .06em; }
    #bs .pt  { font-size: 15px; fill: #111111; }
    #bs .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <text x="40" y="30" class="cap">ЦИКЛ ЧТЕНИЯ ИЗ ПАМЯТИ · ЧТО ПРОИСХОДИТ НА ПРОВОДАХ</text>

  <g data-key="clk">
    <line x1="200" y1="70" x2="200" y2="430" class="tick"/>
    <line x1="375" y1="70" x2="375" y2="430" class="tick"/>
    <line x1="550" y1="70" x2="550" y2="430" class="tick"/>
    <line x1="725" y1="70" x2="725" y2="430" class="tick"/>
    <line x1="900" y1="70" x2="900" y2="430" class="tick"/>
    <text x="287" y="62" class="cap" text-anchor="middle">такт 1</text>
    <text x="462" y="62" class="cap" text-anchor="middle">такт 2</text>
    <text x="637" y="62" class="cap" text-anchor="middle">такт 3</text>
    <text x="812" y="62" class="cap" text-anchor="middle">такт 4</text>
    <text x="186" y="99" class="nm" text-anchor="end">CLK</text>
    <path d="M200 80 H287 V108 H375 V80 H462 V108 H550 V80 H637 V108 H725 V80 H812 V108 H900" class="wave"/>
  </g>

  <g data-key="addr">
    <text x="186" y="151" class="nm" text-anchor="end">A0 — A15</text>
    <rect x="200" y="132" width="700" height="28" rx="4" class="busb"/>
    <text x="550" y="151" class="lbl" text-anchor="middle">1000h = 0000 0000 0000 1000 в порядке линий A0 → A15</text>
  </g>

  <g data-key="ctrl">
    <text x="186" y="203" class="nm" text-anchor="end">RD</text>
    <path d="M200 184 H375 V212 H875 V184 H900" class="wctl"/>
    <text x="625" y="228" class="sm" text-anchor="middle">RD = 0 — активен, процессор читает</text>
    <text x="186" y="255" class="nm" text-anchor="end">WR</text>
    <path d="M200 236 H900" class="wctl"/>
    <text x="625" y="280" class="sm" text-anchor="middle">WR = 1 — неактивен, запись не запрашивается</text>
  </g>

  <g data-key="chip">
    <text x="186" y="307" class="nm" text-anchor="end">CE</text>
    <path d="M200 288 H270 V316 H880 V288 H900" class="wctl"/>
    <text x="186" y="359" class="nm" text-anchor="end">OE</text>
    <path d="M200 340 H430 V368 H870 V340 H900" class="wctl"/>
    <text x="625" y="332" class="sm" text-anchor="middle">CE = 0 — нужный чип памяти выбран</text>
    <text x="625" y="384" class="sm" text-anchor="middle">OE = 0 — память выпускает данные на шину</text>
  </g>

  <g data-key="data">
    <text x="186" y="411" class="nm" text-anchor="end">D0 — D7</text>
    <path d="M200 406 H725" class="idle"/>
    <path d="M875 406 H900" class="idle"/>
    <rect x="725" y="392" width="150" height="28" rx="4" class="busg"/>
    <text x="800" y="411" class="lbl" text-anchor="middle">B8h</text>
  </g>

  <g data-key="rel" data-only="1">
    <circle cx="875" cy="184" r="5" fill="#C30B0A"/>
    <text x="900" y="176" class="red" text-anchor="end">RD отпущен — шина свободна</text>
  </g>

  <g data-key="tally" data-only="1">
    <path d="M200 440 V450 H900 V440" class="brace"/>
    <text x="550" y="470" class="lbl" text-anchor="middle">один цикл чтения = 4 такта = ровно 1 байт</text>
  </g>

  <rect x="40" y="490" width="880" height="54" rx="10" class="pan"/>
  <text x="56" y="521" class="pl">НА ЭТОМ ШАГЕ</text>
  <g data-key="n1" data-only="1"><text x="180" y="521" class="pt">такт — минимальная единица времени; у 8086 на 5 МГц один такт = 200 нс</text></g>
  <g data-key="n2" data-only="1"><text x="180" y="521" class="pt">адрес 1000h → на линиях A0…A15: 0000 0000 0000 1000</text></g>
  <g data-key="n3" data-only="1"><text x="180" y="521" class="pt">RD = 0 и WR = 1 — «читаем, не пишем»; ноль здесь означает «активен»</text></g>
  <g data-key="n4" data-only="1"><text x="180" y="521" class="pt">CE = 0 и OE = 0 — ответ памяти: чип выбран, выход открыт</text></g>
  <g data-key="n5" data-only="1"><text x="180" y="521" class="pt">B8h = 1011 1000 → на линиях D0…D7: 0001 1101</text></g>
  <g data-key="n6" data-only="1"><text x="180" y="521" class="pt">RD снова 1 — цикл закрыт, ячейка 1000h прочитана</text></g>
  <g data-key="n7" data-only="1"><text x="180" y="521" class="pt">4 такта × 3 байта первой инструкции = 12 тактов только на её чтение</text></g>

  <text x="40" y="560" class="legend">жёлтый — такты · синий — адрес · зелёный — пришедшие данные · серый — линии управления</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="clk n1" data-focus="clk">
      <div class="step-kicker">Шаг 1 · метроном</div>
      <h4>Всё, что происходит дальше, происходит по тактам</h4>
      <p><strong>Такт</strong> — импульс тактового генератора и минимальная единица времени
      в процессоре. Все блоки переключаются одновременно, по фронту этого импульса: так
      каждая часть схемы знает, когда ей можно менять состояние.</p>
      <p>Весь цикл чтения занимает четыре такта. Считать байт быстрее физически нечем.</p>
    </div>
    <div class="step-panel" data-on="clk addr n2" data-focus="addr">
      <div class="step-kicker">Шаг 2 · адресная шина</div>
      <h4>Процессор выставляет номер ячейки</h4>
      <p>Шестнадцать линий, на каждой ноль или единица — вместе это двоичная запись адреса.
      Мы запрашиваем <code>1000h</code>, и на проводах появляется соответствующая
      комбинация. Адрес держится на линиях весь цикл: память должна успеть его прочитать.</p>
    </div>
    <div class="step-panel" data-on="clk addr ctrl n3" data-focus="ctrl">
      <div class="step-kicker">Шаг 3 · шина управления</div>
      <h4>Читаем или пишем — это два провода</h4>
      <p>Адрес сам по себе ничего не значит: надо ещё сказать, что с ячейкой делать.
      <code>RD</code> уходит в ноль (активен), <code>WR</code> остаётся в единице.
      Мы обращаемся к ПЗУ, куда писать нельзя по определению, так что <code>WR</code>
      здесь не мог бы стать нулём в принципе.</p>
    </div>
    <div class="step-panel" data-on="clk addr ctrl chip n4" data-focus="chip">
      <div class="step-kicker">Шаг 4 · ответ памяти</div>
      <h4>Микросхема подтверждает, что готова</h4>
      <p>Память отвечает своими сигналами: <code>CE</code> (Chip Enable) выбирает нужный
      чип — их на плате несколько, а адресная шина общая. <code>OE</code> (Output Enable)
      открывает выход микросхемы на шину данных. Оба тоже активны нулём.</p>
    </div>
    <div class="step-panel" data-on="clk addr ctrl chip data n5" data-focus="data">
      <div class="step-kicker">Шаг 5 · шина данных</div>
      <h4>Байт появляется на линиях только в четвёртом такте</h4>
      <p>Восемь линий <code>D0…D7</code> приносят содержимое ячейки: <code>B8h</code>,
      то есть <code>1011 1000</code>. Порядок линий тот же зеркальный, что и у адреса.
      Шина данных у 8086 обычно 8-битная — за один цикл проезжает ровно один байт.</p>
    </div>
    <div class="step-panel" data-on="clk addr ctrl chip data rel n6" data-focus="rel">
      <div class="step-kicker">Шаг 6 · отпускание</div>
      <h4>RD возвращается в единицу, и шина освобождается</h4>
      <p>Пока сигнал <code>RD</code> активен, шина занята — никто другой обратиться к
      памяти не может. Поэтому цикл обязательно закрывают. Дальше всё начинается заново,
      с нового адреса.</p>
    </div>
    <div class="step-panel" data-on="clk addr ctrl chip data tally n7" data-focus="tally">
      <div class="step-kicker">Шаг 7 · цена</div>
      <h4>Четыре такта за один байт — вот основная цена всего</h4>
      <p>Запомните это число, оно будет всплывать до конца статьи. Инструкция
      <code>mov ax, 10</code> занимает три байта, значит только на её чтение уйдёт три
      цикла — двенадцать тактов, ещё до того, как процессор начнёт что-либо делать.</p>
      <p>Именно из этой арифметики потом вырастут и широкие шины, и кэши, и очередь
      предвыборки.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> обращение к памяти — не мгновенное действие, а
  протокол на четыре такта, и его длительность определяет почти всё остальное быстродействие.
</div>

---

## Часть 3. Из C в машинный код

<p>
  Процессор не понимает ни Python, ни C++. Он понимает только байты, каждый из
  которых что-то для него значит. Путь от текста программы до этих байтов идёт
  через два разных объекта с похожими названиями, и их стоит развести сразу:
</p>

<ul>
  <li><strong>Язык ассемблера</strong> — язык программирования, в котором одна
  строка почти один в один соответствует одной машинной инструкции.</li>
  <li><strong>Ассемблер</strong> — программа-транслятор, которая переводит текст
  на языке ассемблера в машинный код.</li>
</ul>

<p>
  Компилятор C сначала приводит программу к языку ассемблера, потом ассемблер
  превращает её в байты. У каждой архитектуры свой язык ассемблера и свой набор
  инструкций, поэтому одна и та же строка на C даёт разные байты для x86 и ARM.
</p>

<p>
  Вот программа, с которой мы будем работать до конца статьи. Она специально
  скучная — зато целиком помещается в двадцать байт:
</p>

<pre><code>int a = 10;
int b = 5;
int c = a + b;
if (c &gt; 20) c = 100;
c = c + 5;
return c;</code></pre>

<div class="callout-blue">
  <strong>Почему в ассемблере не видно переменных.</strong> В C есть <code>a</code>,
  <code>b</code>, <code>c</code>; в машинном коде переменных нет вообще. Компилятор
  раскладывает их по регистрам: <code>a</code> живёт в <code>AX</code>,
  <code>b</code> — в <code>BX</code>, а <code>c</code> получается прямо поверх
  <code>AX</code>, потому что складывать процессор умеет только содержимое
  регистров, а не «переменные».
</div>

<div class="stage" id="stageTrans" tabindex="0">
  <div class="stage-figure">
<svg id="tr" viewBox="0 0 960 616" role="img" aria-label="Три колонки: программа на C, тот же код на языке ассемблера и машинный код в шестнадцатеричном виде с длиной каждой инструкции">
  <style>
    #tr { font-family: Helvetica, Arial, sans-serif; }
    #tr .bc  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; }
    #tr .ba  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.5; }
    #tr .bm  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.5; }
    #tr .mono{ font-size: 14px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #tr .hd  { font-size: 14px; fill: #111111; font-weight: 700; }
    #tr .cap { font-size: 13px; fill: #5E5850; }
    #tr .sm  { font-size: 12px; fill: #5E5850; }
    #tr .red { font-size: 12px; fill: #C30B0A; }
    #tr .rule{ stroke: #E0DDD3; stroke-width: 1.4; }
    #tr .edge{ stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #tr .pan { fill: #F7F6F1; stroke: #E0DDD3; stroke-width: 1.2; }
    #tr .pl  { font-size: 12px; fill: #5E5850; letter-spacing: .06em; }
    #tr .pt  { font-size: 15px; fill: #111111; }
    #tr .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="tr-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text x="40" y="30" class="cap">ОДНА ПРОГРАММА В ТРЁХ ЗАПИСЯХ</text>

  <g data-key="src">
    <text x="165" y="52" class="hd" text-anchor="middle">исходник на C</text>
    <line x1="40" y1="60" x2="290" y2="60" class="rule"/>
    <rect x="40" y="78"  width="250" height="46" rx="6" class="bc"/>
    <rect x="40" y="132" width="250" height="46" rx="6" class="bc"/>
    <rect x="40" y="186" width="250" height="46" rx="6" class="bc"/>
    <rect x="40" y="240" width="250" height="100" rx="6" class="bc"/>
    <rect x="40" y="348" width="250" height="46" rx="6" class="bc"/>
    <rect x="40" y="402" width="250" height="46" rx="6" class="bc"/>
    <rect x="40" y="456" width="250" height="46" rx="6" class="bc"/>
    <text x="54" y="107" class="mono">int a = 10;</text>
    <text x="54" y="161" class="mono">int b = 5;</text>
    <text x="54" y="215" class="mono">int c = a + b;</text>
    <text x="54" y="269" class="mono">if (c &gt; 20)</text>
    <text x="54" y="377" class="mono">  c = 100;</text>
    <text x="54" y="431" class="mono">c = c + 5;</text>
    <text x="54" y="485" class="mono">return c;</text>
  </g>

  <g data-key="a1">
    <text x="460" y="52" class="hd" text-anchor="middle">язык ассемблера</text>
    <line x1="320" y1="60" x2="600" y2="60" class="rule"/>
    <line x1="294" y1="290" x2="316" y2="290" class="edge" marker-end="url(#tr-arw)"/>
    <rect x="320" y="78"  width="280" height="46" rx="6" class="ba"/>
    <rect x="320" y="132" width="280" height="46" rx="6" class="ba"/>
    <text x="334" y="107" class="mono">mov ax, 10</text>
    <text x="334" y="161" class="mono">mov bx, 5</text>
  </g>

  <g data-key="a2">
    <rect x="320" y="186" width="280" height="46" rx="6" class="ba"/>
    <text x="334" y="215" class="mono">add ax, bx</text>
  </g>

  <g data-key="a3">
    <rect x="320" y="240" width="280" height="46" rx="6" class="ba"/>
    <rect x="320" y="294" width="280" height="46" rx="6" class="ba"/>
    <text x="334" y="269" class="mono">cmp ax, 20</text>
    <text x="334" y="323" class="mono">jle L1</text>
  </g>

  <g data-key="a4">
    <rect x="320" y="348" width="280" height="46" rx="6" class="ba"/>
    <rect x="320" y="402" width="280" height="46" rx="6" class="ba"/>
    <rect x="320" y="456" width="280" height="46" rx="6" class="ba"/>
    <text x="334" y="377" class="mono">mov ax, 100</text>
    <text x="334" y="431" class="mono">L1: add ax, 5</text>
    <text x="334" y="485" class="mono">hlt</text>
  </g>

  <g data-key="inv" data-only="1">
    <text x="54" y="302" class="red">условие перевернулось:</text>
    <text x="54" y="320" class="red">jle прыгает, когда c ≤ 20</text>
  </g>

  <g data-key="mc">
    <text x="765" y="52" class="hd" text-anchor="middle">машинный код</text>
    <line x1="630" y1="60" x2="900" y2="60" class="rule"/>
    <line x1="604" y1="290" x2="626" y2="290" class="edge" marker-end="url(#tr-arw)"/>
    <rect x="630" y="78"  width="270" height="46" rx="6" class="bm"/>
    <rect x="630" y="132" width="270" height="46" rx="6" class="bm"/>
    <rect x="630" y="186" width="270" height="46" rx="6" class="bm"/>
    <rect x="630" y="240" width="270" height="46" rx="6" class="bm"/>
    <rect x="630" y="294" width="270" height="46" rx="6" class="bm"/>
    <rect x="630" y="348" width="270" height="46" rx="6" class="bm"/>
    <rect x="630" y="402" width="270" height="46" rx="6" class="bm"/>
    <rect x="630" y="456" width="270" height="46" rx="6" class="bm"/>
    <text x="644" y="107" class="mono">B8 0A 00</text>
    <text x="644" y="161" class="mono">BB 05 00</text>
    <text x="644" y="215" class="mono">01 D8</text>
    <text x="644" y="269" class="mono">3D 14 00</text>
    <text x="644" y="323" class="mono">7E 03</text>
    <text x="644" y="377" class="mono">B8 64 00</text>
    <text x="644" y="431" class="mono">05 05 00</text>
    <text x="644" y="485" class="mono">F4</text>
  </g>

  <g data-key="sizes">
    <text x="886" y="107" class="sm" text-anchor="end">3 байта</text>
    <text x="886" y="161" class="sm" text-anchor="end">3 байта</text>
    <text x="886" y="215" class="sm" text-anchor="end">2 байта</text>
    <text x="886" y="269" class="sm" text-anchor="end">3 байта</text>
    <text x="886" y="323" class="sm" text-anchor="end">2 байта</text>
    <text x="886" y="377" class="sm" text-anchor="end">3 байта</text>
    <text x="886" y="431" class="sm" text-anchor="end">3 байта</text>
    <text x="886" y="485" class="sm" text-anchor="end">1 байт</text>
  </g>

  <rect x="40" y="530" width="880" height="54" rx="10" class="pan"/>
  <text x="56" y="561" class="pl">НА ЭТОМ ШАГЕ</text>
  <g data-key="n1" data-only="1"><text x="180" y="561" class="pt">шесть строк на C — переменные a, b, c и одно условие</text></g>
  <g data-key="n2" data-only="1"><text x="180" y="561" class="pt">a → регистр AX, b → регистр BX; mov кладёт число в регистр</text></g>
  <g data-key="n3" data-only="1"><text x="180" y="561" class="pt">c = a + b превращается в add ax, bx — результат остаётся в AX</text></g>
  <g data-key="n4" data-only="1"><text x="180" y="561" class="pt">одно if = две инструкции: cmp сравнивает, jle решает, прыгать ли</text></g>
  <g data-key="n5" data-only="1"><text x="180" y="561" class="pt">метка L1 — не инструкция, а имя адреса; в байтах её не будет</text></g>
  <g data-key="n6" data-only="1"><text x="180" y="561" class="pt">каждая строка стала числом: B8 = mov в AX, 0A 00 = само значение 10</text></g>
  <g data-key="n7" data-only="1"><text x="180" y="561" class="pt">3 + 3 + 2 + 3 + 2 + 3 + 3 + 1 = 20 байт на всю программу</text></g>

  <text x="40" y="602" class="legend">синий — исходник · жёлтый — инструкции · зелёный — байты, которые получит процессор</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="src n1" data-focus="src">
      <div class="step-kicker">Шаг 1 · исходник</div>
      <h4>Шесть строк, в которых спрятано семь инструкций</h4>
      <p>Программа кладёт в <code>a</code> десятку, в <code>b</code> пятёрку, складывает
      их, при большом результате заменяет его сотней и в конце прибавляет пять. Считать в
      уме результат пока не надо — мы получим его из машинного кода.</p>
    </div>
    <div class="step-panel" data-on="src a1 n2" data-focus="a1">
      <div class="step-kicker">Шаг 2 · присваивания</div>
      <h4>Переменные исчезают, остаются регистры</h4>
      <p><code>mov ax, 10</code> читается как «положить 10 в AX». Никакого «объявления
      переменной» нет: компилятор просто решил, что <code>a</code> будет жить в
      <code>AX</code>, а <code>b</code> — в <code>BX</code>, и дальше говорит именами
      регистров.</p>
    </div>
    <div class="step-panel" data-on="src a1 a2 n3" data-focus="a2">
      <div class="step-kicker">Шаг 3 · арифметика</div>
      <h4>Сложение перезаписывает первый операнд</h4>
      <p><code>add ax, bx</code> — это <code>AX = AX + BX</code>. Отдельного места для
      результата у процессора нет, он ложится поверх первого операнда. Поэтому
      переменная <code>c</code> и оказалась в том же <code>AX</code>, где лежала
      <code>a</code>: <code>a</code> после этой строки в программе больше не нужна.</p>
    </div>
    <div class="step-panel" data-on="src a1 a2 a3 inv n4" data-focus="a3">
      <div class="step-kicker">Шаг 4 · ветвление</div>
      <h4>Одно if — это сравнение плюс прыжок, и условие переворачивается</h4>
      <p><code>cmp ax, 20</code> вычитает 20 из <code>AX</code>, результат выбрасывает, а
      флаги в <code>FLAGS</code> оставляет. <code>jle L1</code> (jump if less or equal)
      смотрит на эти флаги и прыгает вперёд, если <code>AX ≤ 20</code>.</p>
      <p>Обратите внимание на инверсию. В C написано <code>if (c &gt; 20)</code>, а в
      ассемблере стоит «прыгнуть, если <code>≤ 20</code>». Так и должно быть: прыжок
      здесь <em>перескакивает</em> тело условия, поэтому срабатывать он обязан ровно
      тогда, когда условие ложно.</p>
    </div>
    <div class="step-panel" data-on="src a1 a2 a3 a4 n5" data-focus="a4">
      <div class="step-kicker">Шаг 5 · остаток</div>
      <h4>Метка — это имя для адреса, а не команда</h4>
      <p><code>L1</code> не превратится ни в один байт. Это подсказка ассемблеру: «сюда
      будет прыжок, посчитай расстояние сам». В машинном коде от неё останется только
      число внутри инструкции перехода.</p>
      <p><code>hlt</code> останавливает процессор — так наша программа заканчивается.</p>
    </div>
    <div class="step-panel" data-on="src a1 a2 a3 a4 mc n6" data-focus="mc">
      <div class="step-kicker">Шаг 6 · байты</div>
      <h4>Ассемблер превращает каждую строку в числа</h4>
      <p>Шестнадцатеричная запись здесь только для удобства чтения: <code>B8 0A 00</code>
      — это те же 24 бита <code>10111000 00001010 00000000</code>. Первый байт кодирует
      саму операцию, остальные — то, над чем она выполняется.</p>
    </div>
    <div class="step-panel" data-on="src a1 a2 a3 a4 mc sizes n7" data-focus="sizes">
      <div class="step-kicker">Шаг 7 · длина</div>
      <h4>Инструкции разной длины — и это не мелочь</h4>
      <p>От одного байта у <code>hlt</code> до трёх у <code>mov</code>. У x86 команды
      переменной длины, и понять, где кончается одна и начинается другая, можно только
      расшифровав первый байт. Процессор не может «посмотреть вперёд» и разбить поток на
      команды заранее — он узнаёт границу, уже декодируя.</p>
      <p>Итого двадцать байт. С них и начнём следующую часть.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-yellow">
  <strong>Неточность в исходном параграфе.</strong> В тексте Хендбука сказано, что
  «<code>mov ax, 5</code> превратилось в <code>B8 0A 00</code>». Байты верные, а
  мнемоника — нет: <code>0A</code> — это десять, значит <code>B8 0A 00</code> кодирует
  <code>mov ax, 10</code>, первую строку программы. У <code>mov ax, 5</code> байты были
  бы <code>B8 05 00</code>. Дальше в параграфе то же обозначение переезжает и в расчёт
  времени исполнения. Мы считаем именно <code>mov ax, 10</code>.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> компилятор не «переводит» программу, а
  раскладывает её по регистрам и превращает управляющие конструкции в сравнения и
  прыжки — всё остальное просто нумерация байтов.
</div>

---

## Часть 4. Как программа лежит в памяти

<p>
  После запуска машинный код попадает в оперативную память. Допустим, наши двадцать
  байт легли подряд начиная с адреса <code>1000h</code> — буква <code>h</code> просто
  говорит, что число шестнадцатеричное. Тогда последний байт программы окажется по
  адресу <code>1013h</code>.
</p>

<p>
  Здесь важно увидеть, чего в памяти <em>нет</em>. Там нет пробелов между
  инструкциями, нет пометок «здесь начинается команда», нет разделения на код и
  данные. Это просто двадцать пронумерованных байт. Границы инструкций существуют
  только в голове у декодера: прочитав первый байт, он узнаёт команду и уже из неё
  понимает, сколько байт дочитать.
</p>

<p>
  Сама инструкция состоит из двух частей. <strong>Опкод</strong> (opcode) — байт или
  несколько, кодирующих, какую операцию выполнять и куда класть результат.
  <strong>Операнды</strong> — то, над чем операция выполняется: константа, номер
  регистра или адрес.
</p>

<div class="stage" id="stageMem" tabindex="0">
  <div class="stage-figure">
<svg id="mm" viewBox="0 0 960 562" role="img" aria-label="Двадцать байт программы в памяти с адресами от 1000h до 1013h, границы инструкций и разбор первой инструкции на опкод и операнд">
  <style>
    #mm { font-family: Helvetica, Arial, sans-serif; }
    #mm .cell{ fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.2; }
    #mm .brk { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.4; }
    #mm .big { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.5; }
    #mm .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #mm .hlY { fill: none; stroke: #C29E08; stroke-width: 3; }
    #mm .hlB { fill: none; stroke: #3576C0; stroke-width: 3; }
    #mm .hex { font-size: 13px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #mm .huge{ font-size: 30px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #mm .adr { font-size: 12px; fill: #5E5850; font-family: "Courier New", Courier, monospace; }
    #mm .lbl { font-size: 16px; fill: #111111; }
    #mm .cap { font-size: 13px; fill: #5E5850; }
    #mm .sm  { font-size: 12px; fill: #111111; }
    #mm .dash{ stroke: #B8B3A8; stroke-width: 1.2; stroke-dasharray: 5 4; fill: none; }
    #mm .edge{ stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #mm .pan { fill: #F7F6F1; stroke: #E0DDD3; stroke-width: 1.2; }
    #mm .pl  { font-size: 12px; fill: #5E5850; letter-spacing: .06em; }
    #mm .pt  { font-size: 15px; fill: #111111; }
    #mm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="mm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text x="40" y="30" class="cap">ПРОГРАММА В ПАМЯТИ: 20 БАЙТ ПОДРЯД, БЕЗ ВСЯКОЙ РАЗМЕТКИ</text>

  <g data-key="instr">
    <rect x="60"  y="124" width="126" height="22" rx="4" class="brk"/>
    <rect x="186" y="124" width="126" height="22" rx="4" class="brk"/>
    <rect x="312" y="124" width="84"  height="22" rx="4" class="brk"/>
    <rect x="396" y="124" width="126" height="22" rx="4" class="brk"/>
    <rect x="522" y="124" width="84"  height="22" rx="4" class="brk"/>
    <rect x="606" y="124" width="126" height="22" rx="4" class="brk"/>
    <rect x="732" y="124" width="126" height="22" rx="4" class="brk"/>
    <rect x="858" y="124" width="42"  height="22" rx="4" class="brk"/>
    <text x="123" y="140" class="sm" text-anchor="middle">mov ax, 10</text>
    <text x="249" y="140" class="sm" text-anchor="middle">mov bx, 5</text>
    <text x="354" y="140" class="sm" text-anchor="middle">add ax, bx</text>
    <text x="459" y="140" class="sm" text-anchor="middle">cmp ax, 20</text>
    <text x="564" y="140" class="sm" text-anchor="middle">jle L1</text>
    <text x="669" y="140" class="sm" text-anchor="middle">mov ax, 100</text>
    <text x="795" y="140" class="sm" text-anchor="middle">add ax, 5</text>
    <text x="879" y="140" class="sm" text-anchor="middle">hlt</text>
  </g>

  <g data-key="bytes">
    <rect x="60"  y="150" width="42" height="50" class="cell"/>
    <rect x="102" y="150" width="42" height="50" class="cell"/>
    <rect x="144" y="150" width="42" height="50" class="cell"/>
    <rect x="186" y="150" width="42" height="50" class="cell"/>
    <rect x="228" y="150" width="42" height="50" class="cell"/>
    <rect x="270" y="150" width="42" height="50" class="cell"/>
    <rect x="312" y="150" width="42" height="50" class="cell"/>
    <rect x="354" y="150" width="42" height="50" class="cell"/>
    <rect x="396" y="150" width="42" height="50" class="cell"/>
    <rect x="438" y="150" width="42" height="50" class="cell"/>
    <rect x="480" y="150" width="42" height="50" class="cell"/>
    <rect x="522" y="150" width="42" height="50" class="cell"/>
    <rect x="564" y="150" width="42" height="50" class="cell"/>
    <rect x="606" y="150" width="42" height="50" class="cell"/>
    <rect x="648" y="150" width="42" height="50" class="cell"/>
    <rect x="690" y="150" width="42" height="50" class="cell"/>
    <rect x="732" y="150" width="42" height="50" class="cell"/>
    <rect x="774" y="150" width="42" height="50" class="cell"/>
    <rect x="816" y="150" width="42" height="50" class="cell"/>
    <rect x="858" y="150" width="42" height="50" class="cell"/>
    <text x="81"  y="181" class="hex" text-anchor="middle">B8</text>
    <text x="123" y="181" class="hex" text-anchor="middle">0A</text>
    <text x="165" y="181" class="hex" text-anchor="middle">00</text>
    <text x="207" y="181" class="hex" text-anchor="middle">BB</text>
    <text x="249" y="181" class="hex" text-anchor="middle">05</text>
    <text x="291" y="181" class="hex" text-anchor="middle">00</text>
    <text x="333" y="181" class="hex" text-anchor="middle">01</text>
    <text x="375" y="181" class="hex" text-anchor="middle">D8</text>
    <text x="417" y="181" class="hex" text-anchor="middle">3D</text>
    <text x="459" y="181" class="hex" text-anchor="middle">14</text>
    <text x="501" y="181" class="hex" text-anchor="middle">00</text>
    <text x="543" y="181" class="hex" text-anchor="middle">7E</text>
    <text x="585" y="181" class="hex" text-anchor="middle">03</text>
    <text x="627" y="181" class="hex" text-anchor="middle">B8</text>
    <text x="669" y="181" class="hex" text-anchor="middle">64</text>
    <text x="711" y="181" class="hex" text-anchor="middle">00</text>
    <text x="753" y="181" class="hex" text-anchor="middle">05</text>
    <text x="795" y="181" class="hex" text-anchor="middle">05</text>
    <text x="837" y="181" class="hex" text-anchor="middle">00</text>
    <text x="879" y="181" class="hex" text-anchor="middle">F4</text>
  </g>

  <g data-key="addrs">
    <text x="123" y="218" class="adr" text-anchor="middle">1000h</text>
    <text x="249" y="218" class="adr" text-anchor="middle">1003h</text>
    <text x="354" y="218" class="adr" text-anchor="middle">1006h</text>
    <text x="459" y="218" class="adr" text-anchor="middle">1008h</text>
    <text x="564" y="218" class="adr" text-anchor="middle">100Bh</text>
    <text x="669" y="218" class="adr" text-anchor="middle">100Dh</text>
    <text x="795" y="218" class="adr" text-anchor="middle">1010h</text>
    <text x="879" y="218" class="adr" text-anchor="middle">1013h</text>
    <text x="40" y="240" class="cap">у каждого байта свой адрес; подписаны только те, с которых начинаются инструкции</text>
  </g>

  <g data-key="zoom">
    <path d="M60 202 L200 278" class="dash"/>
    <path d="M186 202 L800 278" class="dash"/>
    <rect x="200" y="280" width="200" height="80" class="big"/>
    <rect x="400" y="280" width="200" height="80" class="big"/>
    <rect x="600" y="280" width="200" height="80" class="big"/>
    <text x="300" y="328" class="huge" text-anchor="middle">B8</text>
    <text x="500" y="328" class="huge" text-anchor="middle">0A</text>
    <text x="700" y="328" class="huge" text-anchor="middle">00</text>
    <text x="300" y="384" class="adr" text-anchor="middle">1000h</text>
    <text x="500" y="384" class="adr" text-anchor="middle">1001h</text>
    <text x="700" y="384" class="adr" text-anchor="middle">1002h</text>
  </g>

  <g data-key="op">
    <rect x="200" y="280" width="200" height="80" class="hlY"/>
    <text x="300" y="272" class="cap" text-anchor="middle">опкод</text>
  </g>

  <g data-key="imm">
    <rect x="400" y="280" width="400" height="80" class="hlB"/>
    <text x="500" y="272" class="cap" text-anchor="middle">операнд · младший байт</text>
    <text x="700" y="272" class="cap" text-anchor="middle">операнд · старший байт</text>
  </g>

  <g data-key="le">
    <path d="M600 366 V390 H648 V400" class="edge" marker-end="url(#mm-arw)"/>
    <text x="540" y="429" class="cap" text-anchor="end">младший байт лежит первым</text>
    <rect x="560" y="404" width="240" height="40" rx="8" class="bg"/>
    <text x="680" y="429" class="lbl" text-anchor="middle">AX = 000Ah = 10</text>
  </g>

  <rect x="40" y="470" width="880" height="54" rx="10" class="pan"/>
  <text x="56" y="501" class="pl">НА ЭТОМ ШАГЕ</text>
  <g data-key="n1" data-only="1"><text x="180" y="501" class="pt">20 байт подряд: B8 0A 00 BB 05 00 01 D8 3D 14 00 7E 03 B8 64 00 05 05 00 F4</text></g>
  <g data-key="n2" data-only="1"><text x="180" y="501" class="pt">байтовая адресация: 1000h + 20 байт = последний байт по адресу 1013h</text></g>
  <g data-key="n3" data-only="1"><text x="180" y="501" class="pt">длины 3, 3, 2, 3, 2, 3, 3, 1 — в самих байтах эти границы никак не помечены</text></g>
  <g data-key="n4" data-only="1"><text x="180" y="501" class="pt">разбираем первые три байта по адресам 1000h, 1001h, 1002h</text></g>
  <g data-key="n5" data-only="1"><text x="180" y="501" class="pt">B8 = MOV r16, imm16 — «положить в AX следующие два байта»</text></g>
  <g data-key="n6" data-only="1"><text x="180" y="501" class="pt">0A 00 — два байта непосредственного значения</text></g>
  <g data-key="n7" data-only="1"><text x="180" y="501" class="pt">little-endian: 0A 00 читается как 000Ah = 10, а не как 0A00h = 2560</text></g>

  <text x="40" y="548" class="legend">синий — байты и данные · жёлтый — код операции · зелёный — собранное значение</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="bytes n1" data-focus="bytes">
      <div class="step-kicker">Шаг 1 · как это выглядит на самом деле</div>
      <h4>Двадцать чисел, и больше ничего</h4>
      <p>Вот вся программа глазами памяти. Ни имён, ни строк, ни отступов — только байты.
      Ровно эту последовательность процессор и будет разбирать.</p>
    </div>
    <div class="step-panel" data-on="bytes addrs n2" data-focus="addrs">
      <div class="step-kicker">Шаг 2 · адресация</div>
      <h4>У каждого байта свой номер</h4>
      <p>Первый байт лежит по адресу <code>1000h</code>, второй — <code>1001h</code>, и так
      далее. Обратиться можно к любому из них по отдельности: это и есть байтовая
      адресация, единая для ПЗУ, оперативной памяти и дисков.</p>
    </div>
    <div class="step-panel" data-on="bytes addrs instr n3" data-focus="instr">
      <div class="step-kicker">Шаг 3 · границы</div>
      <h4>Границы инструкций нигде не записаны</h4>
      <p>Восемь инструкций занимают 3, 3, 2, 3, 2, 3 и 3 байта плюс один байт на
      <code>hlt</code>. Но в памяти между ними ничего не разделяет. Если начать читать
      программу не с <code>1000h</code>, а с <code>1001h</code>, процессор честно
      расшифрует получившуюся чепуху и выполнит её — просто потому, что никакого способа
      понять, что он сбился, у него нет.</p>
    </div>
    <div class="step-panel" data-on="bytes addrs instr zoom n4" data-focus="zoom">
      <div class="step-kicker">Шаг 4 · увеличиваем</div>
      <h4>Берём три байта первой инструкции</h4>
      <p><code>B8 0A 00</code>. Дальше нас интересует, откуда процессор узнает, что это
      целое, где здесь команда, а где число.</p>
    </div>
    <div class="step-panel" data-on="bytes addrs instr zoom op n5" data-focus="op">
      <div class="step-kicker">Шаг 5 · опкод</div>
      <h4>Первый байт говорит и что делать, и куда</h4>
      <p><code>B8</code> — это опкод <code>MOV r16, imm16</code> с уже вшитым номером
      регистра: конкретно <code>AX</code>. У соседа <code>BB</code> отличается младшая
      тетрада — это тот же <code>MOV</code>, но в <code>BX</code>. Ровно поэтому
      <code>mov bx, 5</code> начинается с <code>BB</code>.</p>
      <p>Из опкода же следует и длина инструкции: раз значение непосредственное и
      16-битное, надо дочитать ещё два байта.</p>
    </div>
    <div class="step-panel" data-on="bytes addrs instr zoom op imm n6" data-focus="imm">
      <div class="step-kicker">Шаг 6 · операнд</div>
      <h4>Следующие два байта — само число</h4>
      <p>Их называют непосредственным значением (immediate): оно лежит прямо в потоке
      команд, а не где-то в памяти по адресу. Такое значение не нужно отдельно
      подгружать — оно приезжает вместе с инструкцией.</p>
    </div>
    <div class="step-panel" data-on="bytes addrs instr zoom op imm le n7" data-focus="le">
      <div class="step-kicker">Шаг 7 · порядок байтов</div>
      <h4>Младший байт лежит по меньшему адресу</h4>
      <p>Байты идут <code>0A 00</code>, а число получается <code>000Ah</code> — десять.
      Это <strong>little-endian</strong>, и он же объясняет, почему сотня в шестой
      инструкции записана как <code>64 00</code>, а двадцатка в сравнении — как
      <code>14 00</code>.</p>
      <p>Прочитать <code>0A 00</code> слева направо как <code>0A00h</code> = 2560 — самая
      частая ошибка при чтении дампов памяти.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> в памяти нет ни инструкций, ни программы — есть
  нумерованные байты, а смысл им придаёт только то, с какого адреса процессор начал читать.
</div>

---

## Часть 5. Fetch — Decode — Execute — Store

<p>
  Теперь соберём всё вместе. Байты лежат в памяти, шина умеет их доставать,
  регистры готовы принимать числа. Осталось понять, что процессор делает с
  каждой инструкцией. Делает он всегда одно и то же, по кругу, с момента включения
  и до выключения — четыре шага:
</p>

<ol>
  <li><strong>Fetch</strong> — достать инструкцию из памяти по адресу из <code>IP</code>.</li>
  <li><strong>Decode</strong> — расшифровать опкод и дочитать операнды.</li>
  <li><strong>Execute</strong> — выполнить: посчитать в АЛУ, переложить данные, прыгнуть.</li>
  <li><strong>Store</strong> — записать результат, если его есть куда записывать.</li>
</ol>

<p>
  Здесь встречаются два регистра из первой части. <code>IP</code> (Instruction
  Pointer) хранит адрес следующей команды — именно он превращает набор байт в
  последовательность. <code>IR</code> (Instruction Register) держит инструкцию,
  которую процессор разбирает прямо сейчас.
</p>

<p>
  Пройдём цикл целиком на первой инструкции нашей программы — <code>mov ax, 10</code>
  по адресу <code>1000h</code>.
</p>

<div class="stage" id="stageCycle" tabindex="0">
  <div class="stage-figure">
<svg id="fd" viewBox="0 0 960 570" role="img" aria-label="Путь инструкции: из памяти через шину в регистр команд, оттуда в декодер, затем в регистры; внизу распределение тактов по шагам цикла">
  <style>
    #fd { font-family: Helvetica, Arial, sans-serif; }
    #fd .box { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.5; }
    #fd .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #fd .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #fd .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #fd .band{ fill: #F4F2EC; stroke: #B8B3A8; stroke-width: 1.3; }
    #fd .frame{ fill: none; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 6 5; }
    #fd .hl  { fill: none; stroke: #C29E08; stroke-width: 3; }
    #fd .no  { fill: none; stroke: #C30B0A; stroke-width: 2; stroke-dasharray: 5 4; }
    #fd .edge{ stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #fd .nm  { font-size: 13px; fill: #5E5850; }
    #fd .lbl { font-size: 16px; fill: #111111; }
    #fd .mono{ font-size: 14px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #fd .cap { font-size: 13px; fill: #5E5850; }
    #fd .red { font-size: 13px; fill: #C30B0A; }
    #fd .pan { fill: #F7F6F1; stroke: #E0DDD3; stroke-width: 1.2; }
    #fd .pl  { font-size: 12px; fill: #5E5850; letter-spacing: .06em; }
    #fd .pt  { font-size: 15px; fill: #111111; }
    #fd .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="fd-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text x="125" y="82" class="cap" text-anchor="middle">память</text>
  <text x="262" y="82" class="cap" text-anchor="middle">системная шина</text>
  <text x="330" y="62" class="cap">процессор</text>

  <rect x="40" y="90" width="170" height="210" rx="8" class="box"/>
  <rect x="56" y="110" width="138" height="40" rx="5" class="bx"/>
  <rect x="56" y="160" width="138" height="40" rx="5" class="bx"/>
  <rect x="56" y="210" width="138" height="40" rx="5" class="bx"/>
  <text x="125" y="135" class="mono" text-anchor="middle">1000h  B8</text>
  <text x="125" y="185" class="mono" text-anchor="middle">1001h  0A</text>
  <text x="125" y="235" class="mono" text-anchor="middle">1002h  00</text>

  <rect x="232" y="90" width="60" height="210" rx="8" class="band"/>
  <text x="262" y="144" class="nm" text-anchor="middle">адрес</text>
  <text x="262" y="184" class="nm" text-anchor="middle">упр.</text>
  <text x="262" y="224" class="nm" text-anchor="middle">данные</text>

  <rect x="320" y="70" width="600" height="250" rx="10" class="frame"/>

  <rect x="350" y="110" width="150" height="50" rx="6" class="box"/>
  <text x="360" y="128" class="nm">IR</text>
  <rect x="350" y="190" width="150" height="60" rx="6" class="box"/>
  <text x="360" y="208" class="nm">декодер</text>
  <rect x="750" y="110" width="150" height="140" rx="6" class="box"/>
  <text x="825" y="128" class="nm" text-anchor="middle">регистры</text>
  <rect x="766" y="138" width="118" height="38" rx="5" class="bx"/>
  <rect x="766" y="186" width="118" height="38" rx="5" class="bx"/>
  <text x="780" y="162" class="mono">AX</text>
  <text x="780" y="210" class="mono">BX</text>

  <g data-key="ip">
    <rect x="560" y="110" width="140" height="50" rx="6" class="by"/>
    <text x="570" y="128" class="nm">IP</text>
    <text x="630" y="150" class="mono" text-anchor="middle">1000h</text>
  </g>

  <g data-key="alu">
    <rect x="560" y="190" width="140" height="60" rx="6" class="by"/>
    <text x="570" y="208" class="nm">АЛУ</text>
    <text x="630" y="232" class="nm" text-anchor="middle">сложение, сравнение</text>
  </g>

  <g data-key="fetch">
    <path d="M630 160 V176 H298" class="edge" marker-end="url(#fd-arw)"/>
    <path d="M194 130 H228" class="edge" marker-end="url(#fd-arw)"/>
    <path d="M292 135 H346" class="edge" marker-end="url(#fd-arw)"/>
    <rect x="56" y="110" width="138" height="40" rx="5" class="hl"/>
    <text x="425" y="150" class="mono" text-anchor="middle">B8</text>
  </g>

  <g data-key="fetch2">
    <rect x="56" y="160" width="138" height="40" rx="5" class="hl"/>
    <rect x="56" y="210" width="138" height="40" rx="5" class="hl"/>
    <text x="40" y="320" class="cap">ещё два запроса: 1001h и 1002h</text>
  </g>

  <g data-key="decode">
    <path d="M425 160 V186" class="edge" marker-end="url(#fd-arw)"/>
    <text x="425" y="232" class="nm" text-anchor="middle">MOV r16, imm16</text>
  </g>

  <g data-key="exec">
    <path d="M500 245 V278 H730 V152 H746" class="edge" marker-end="url(#fd-arw)"/>
    <text x="870" y="162" class="mono" text-anchor="end">000Ah</text>
  </g>

  <g data-key="noalu" data-only="1">
    <rect x="560" y="190" width="140" height="60" rx="6" class="no"/>
    <text x="40" y="344" class="red">mov ничего не вычисляет — АЛУ на этой инструкции простаивает</text>
  </g>

  <g data-key="store" data-only="1">
    <rect x="40" y="90" width="170" height="210" rx="8" class="no"/>
    <text x="40" y="368" class="red">Store: писать в память нечего, результат уже лежит в регистре</text>
  </g>

  <g data-key="ipn" data-only="1">
    <text x="630" y="102" class="mono" text-anchor="middle">IP += 3 → 1003h</text>
  </g>

  <g data-key="tl">
    <rect x="60" y="400" width="630" height="40" rx="6" class="bx"/>
    <rect x="690" y="400" width="210" height="40" rx="6" class="by"/>
    <text x="375" y="425" class="lbl" text-anchor="middle">Fetch · 12 тактов</text>
    <text x="795" y="425" class="lbl" text-anchor="middle">Execute · 4</text>
    <text x="60" y="462" class="cap">Decode почти бесплатен, Store пустой — итого 16 тактов на одну инструкцию</text>
  </g>

  <rect x="40" y="480" width="880" height="54" rx="10" class="pan"/>
  <text x="56" y="511" class="pl">НА ЭТОМ ШАГЕ</text>
  <g data-key="n1" data-only="1"><text x="180" y="511" class="pt">IP = 1000h — единственное, что связывает байты в программу</text></g>
  <g data-key="n2" data-only="1"><text x="180" y="511" class="pt">Fetch: запрос по адресу 1000h → в IR приходит B8 (4 такта)</text></g>
  <g data-key="n3" data-only="1"><text x="180" y="511" class="pt">3 байта = 3 цикла шины = 4 × 3 = 12 тактов только на выборку</text></g>
  <g data-key="n4" data-only="1"><text x="180" y="511" class="pt">Decode: B8 → MOV r16, imm16, приёмник AX, длина инструкции 3 байта</text></g>
  <g data-key="n5" data-only="1"><text x="180" y="511" class="pt">Execute: 0A 00 собирается в 000Ah и уходит в AX (4 такта)</text></g>
  <g data-key="n6" data-only="1"><text x="180" y="511" class="pt">АЛУ включится только на add ax, bx и cmp ax, 20</text></g>
  <g data-key="n7" data-only="1"><text x="180" y="511" class="pt">Store пропущен; IP += 3 → 1003h, адрес следующей инструкции</text></g>
  <g data-key="n8" data-only="1"><text x="180" y="511" class="pt">12 + 0 + 4 + 0 = 16 тактов, из них 12 — ожидание памяти</text></g>

  <text x="40" y="556" class="legend">синий — данные и байты · жёлтый — управление и такты · красный — то, что не выполняется</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="ip alu n1" data-focus="ip">
      <div class="step-kicker">Шаг 1 · откуда всё начинается</div>
      <h4>Программа — это значение IP</h4>
      <p>Перед стартом в <code>IP</code> лежит <code>1000h</code>: адрес первого байта.
      Процессор не знает ни имени программы, ни её длины — он знает один адрес и берёт
      байт оттуда.</p>
    </div>
    <div class="step-panel" data-on="ip alu fetch n2" data-focus="fetch">
      <div class="step-kicker">Шаг 2 · Fetch</div>
      <h4>Адрес уходит на шину, байт приходит в IR</h4>
      <p>Это ровно тот цикл чтения, который мы разбирали во второй части: адрес на
      <code>A0…A15</code>, <code>RD = 0</code>, через четыре такта на <code>D0…D7</code>
      появляется <code>B8</code>. Он ложится в <code>IR</code>.</p>
      <p>На этом этапе процессор ещё не знает, что это за инструкция. В <code>IR</code>
      просто число 184.</p>
    </div>
    <div class="step-panel" data-on="ip alu fetch fetch2 n3" data-focus="fetch2">
      <div class="step-kicker">Шаг 3 · выборка длиннее одного байта</div>
      <h4>Одного цикла шины не хватает</h4>
      <p>Инструкция занимает три байта, а шина за цикл приносит один. Значит, нужны ещё
      два обращения — к <code>1001h</code> и <code>1002h</code>. Двенадцать тактов
      уходит на то, чтобы просто получить инструкцию целиком.</p>
      <p>Отсюда, забегая вперёд, растёт всё: и широкие шины, и кэш инструкций, и очередь
      предвыборки.</p>
    </div>
    <div class="step-panel" data-on="ip alu fetch fetch2 decode n4" data-focus="decode">
      <div class="step-kicker">Шаг 4 · Decode</div>
      <h4>Декодер узнаёт команду и её длину</h4>
      <p>Блок управления смотрит на <code>B8</code> и понимает: это <code>MOV</code> с
      непосредственным 16-битным значением, приёмник — <code>AX</code>. Из опкода же
      следует, что операнд занимает два байта, а вся инструкция — три.</p>
      <p>У 8086 декодирование почти ничего не стоило: несколько логических вентилей,
      меньше такта.</p>
    </div>
    <div class="step-panel" data-on="ip alu fetch fetch2 decode exec n5" data-focus="exec">
      <div class="step-kicker">Шаг 5 · Execute</div>
      <h4>Значение перекладывается в регистр</h4>
      <p>Байты <code>0A 00</code> собираются в число <code>000Ah</code> с учётом порядка
      little-endian и записываются в <code>AX</code>. Всё, инструкция выполнена: четыре
      такта.</p>
    </div>
    <div class="step-panel" data-on="ip alu fetch fetch2 decode exec noalu n6" data-focus="alu noalu">
      <div class="step-kicker">Шаг 6 · чего не произошло</div>
      <h4>АЛУ в этой инструкции не участвует</h4>
      <p>Арифметико-логическое устройство считает: сложение, вычитание, сравнение, сдвиги,
      логические операции. <code>mov</code> ничего не считает, он перекладывает, поэтому
      АЛУ простаивает.</p>
      <p>В нашей программе АЛУ включится дважды: на <code>add ax, bx</code> и на
      <code>cmp ax, 20</code>. Остальные пять инструкций проходят мимо него.</p>
    </div>
    <div class="step-panel" data-on="ip alu fetch fetch2 decode exec noalu store ipn n7" data-focus="store ipn">
      <div class="step-kicker">Шаг 7 · Store и переход к следующей</div>
      <h4>Записывать нечего — просто двигаем IP</h4>
      <p>Шаг <code>Store</code> нужен, когда результат должен уехать обратно в память.
      У нас он остался в регистре, так что шаг пустой.</p>
      <p>А дальше происходит главное: <code>IP</code> увеличивается на длину выполненной
      инструкции — на три — и становится равен <code>1003h</code>. Цикл начинается заново
      с этого адреса. Никакого «перехода к следующей строке» не существует: есть только
      прибавление длины к одному числу.</p>
    </div>
    <div class="step-panel" data-on="ip alu fetch fetch2 decode exec noalu store ipn tl n8" data-focus="tl">
      <div class="step-kicker">Шаг 8 · цена цикла</div>
      <h4>Шестнадцать тактов, из которых двенадцать — ожидание</h4>
      <p>Сложите: выборка 12, декодирование около нуля, выполнение 4, запись 0. Итого 16
      тактов на инструкцию, которая всего лишь кладёт число в регистр.</p>
      <p>Три четверти этого времени процессор ждёт память. Запомните пропорцию — в конце
      статьи из неё вырастут все улучшения современных процессоров.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> вся работа процессора — это прибавление длины
  инструкции к регистру <code>IP</code>; остальные три шага цикла обслуживают это
  прибавление.
</div>

---

## Часть 6. Прогон всей программы

<p>
  Один цикл мы разобрали. Теперь прокрутим все семь инструкций и посмотрим, что
  происходит с регистрами. Это самая полезная сцена статьи: после неё по любому
  куску машинного кода можно вручную сказать, чем всё кончится.
</p>

<p>
  Понадобятся флаги. <code>cmp ax, 20</code> вычитает 20 из <code>AX</code>,
  результат выбрасывает, а в регистре <code>FLAGS</code> оставляет следы: нам
  хватит двух битов.
</p>

<table class="shape-table">
  <tr><th>Флаг</th><th>Что означает</th><th>После cmp ax, 20 при AX = 15</th></tr>
  <tr><td><code>ZF</code></td><td>результат вычитания равен нулю, то есть операнды равны</td><td>0 — числа не равны</td></tr>
  <tr><td><code>SF</code></td><td>результат отрицательный</td><td>1 — 15 − 20 = −5</td></tr>
</table>

<p>
  Условие <code>jle</code> (jump if less or equal) читает именно эти биты: прыжок
  выполняется, если <code>ZF = 1</code> (равно) или <code>SF</code> говорит, что
  результат отрицательный (меньше).
</p>

<div class="stage" id="stageRun" tabindex="0">
  <div class="stage-figure">
<svg id="rn" viewBox="0 0 960 652" role="img" aria-label="Таблица прогона программы: для каждой инструкции адрес, содержимое AX и BX, флаги, следующий адрес и число тактов">
  <style>
    #rn { font-family: Helvetica, Arial, sans-serif; }
    #rn .row { fill: #FFFFFF; }
    #rn .rowr{ fill: #FFF2F2; }
    #rn .hdr { fill: #F4F8FD; stroke: #E0DDD3; stroke-width: 1.2; }
    #rn .grid{ stroke: #E0DDD3; stroke-width: 1.1; }
    #rn .out { fill: none; stroke: #C9C4B8; stroke-width: 1.5; }
    #rn .hd  { font-size: 13px; fill: #244f81; font-weight: 700; }
    #rn .mono{ font-size: 14px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #rn .monr{ font-size: 14px; fill: #C30B0A; font-family: "Courier New", Courier, monospace; }
    #rn .cap { font-size: 13px; fill: #5E5850; }
    #rn .red { font-size: 13px; fill: #C30B0A; }
    #rn .lbl { font-size: 15px; fill: #111111; }
    #rn .okc { fill: #E4F5D6; }
    #rn .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #rn .arw { stroke: #73B222; stroke-width: 2.2; fill: none; }
    #rn .strike { stroke: #C30B0A; stroke-width: 1.6; }
    #rn .pan { fill: #F7F6F1; stroke: #E0DDD3; stroke-width: 1.2; }
    #rn .pl  { font-size: 12px; fill: #5E5850; letter-spacing: .06em; }
    #rn .pt  { font-size: 15px; fill: #111111; }
    #rn .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="rn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
  </defs>

  <text x="40" y="30" class="cap">ЧТО ЛЕЖИТ В РЕГИСТРАХ ПОСЛЕ КАЖДОЙ ИНСТРУКЦИИ</text>

  <g data-key="r1">
    <rect x="40" y="104" width="860" height="48" class="row"/>
    <text x="85"  y="134" class="mono" text-anchor="middle">1000h</text>
    <text x="144" y="134" class="mono">mov ax, 10</text>
    <text x="350" y="134" class="mono" text-anchor="middle">000Ah</text>
    <text x="450" y="134" class="mono" text-anchor="middle">0000h</text>
    <text x="535" y="134" class="mono" text-anchor="middle">—</text>
    <text x="605" y="134" class="mono" text-anchor="middle">—</text>
    <text x="700" y="134" class="mono" text-anchor="middle">1003h</text>
    <text x="830" y="134" class="mono" text-anchor="middle">16</text>
  </g>

  <g data-key="r2">
    <rect x="40" y="152" width="860" height="48" class="row"/>
    <text x="85"  y="182" class="mono" text-anchor="middle">1003h</text>
    <text x="144" y="182" class="mono">mov bx, 5</text>
    <text x="350" y="182" class="mono" text-anchor="middle">000Ah</text>
    <text x="450" y="182" class="mono" text-anchor="middle">0005h</text>
    <text x="535" y="182" class="mono" text-anchor="middle">—</text>
    <text x="605" y="182" class="mono" text-anchor="middle">—</text>
    <text x="700" y="182" class="mono" text-anchor="middle">1006h</text>
    <text x="830" y="182" class="mono" text-anchor="middle">16</text>
  </g>

  <g data-key="r3">
    <rect x="40" y="200" width="860" height="48" class="row"/>
    <text x="85"  y="230" class="mono" text-anchor="middle">1006h</text>
    <text x="144" y="230" class="mono">add ax, bx</text>
    <text x="350" y="230" class="mono" text-anchor="middle">000Fh</text>
    <text x="450" y="230" class="mono" text-anchor="middle">0005h</text>
    <text x="535" y="230" class="mono" text-anchor="middle">0</text>
    <text x="605" y="230" class="mono" text-anchor="middle">0</text>
    <text x="700" y="230" class="mono" text-anchor="middle">1008h</text>
    <text x="830" y="230" class="mono" text-anchor="middle">11</text>
  </g>

  <g data-key="r4">
    <rect x="40" y="248" width="860" height="48" class="row"/>
    <text x="85"  y="278" class="mono" text-anchor="middle">1008h</text>
    <text x="144" y="278" class="mono">cmp ax, 20</text>
    <text x="350" y="278" class="mono" text-anchor="middle">000Fh</text>
    <text x="450" y="278" class="mono" text-anchor="middle">0005h</text>
    <text x="535" y="278" class="mono" text-anchor="middle">0</text>
    <text x="605" y="278" class="mono" text-anchor="middle">1</text>
    <text x="700" y="278" class="mono" text-anchor="middle">100Bh</text>
    <text x="830" y="278" class="mono" text-anchor="middle">16</text>
  </g>

  <g data-key="r5">
    <rect x="40" y="296" width="860" height="48" class="row"/>
    <text x="85"  y="326" class="mono" text-anchor="middle">100Bh</text>
    <text x="144" y="326" class="mono">jle L1</text>
    <text x="350" y="326" class="mono" text-anchor="middle">000Fh</text>
    <text x="450" y="326" class="mono" text-anchor="middle">0005h</text>
    <text x="535" y="326" class="mono" text-anchor="middle">0</text>
    <text x="605" y="326" class="mono" text-anchor="middle">1</text>
    <text x="700" y="326" class="mono" text-anchor="middle">1010h</text>
    <text x="830" y="326" class="mono" text-anchor="middle">24</text>
    <path d="M34 320 H20 V416 H34" class="arw" marker-end="url(#rn-arw)"/>
  </g>

  <g data-key="skip">
    <rect x="40" y="344" width="860" height="48" class="rowr"/>
    <text x="85"  y="374" class="monr" text-anchor="middle">100Dh</text>
    <text x="144" y="374" class="monr">mov ax, 100</text>
    <text x="350" y="374" class="monr" text-anchor="middle">—</text>
    <text x="450" y="374" class="monr" text-anchor="middle">—</text>
    <text x="535" y="374" class="monr" text-anchor="middle">—</text>
    <text x="605" y="374" class="monr" text-anchor="middle">—</text>
    <text x="700" y="374" class="monr" text-anchor="middle">—</text>
    <text x="830" y="374" class="monr" text-anchor="middle">0</text>
    <line x1="136" y1="369" x2="296" y2="369" class="strike"/>
    <text x="40" y="552" class="red">три байта B8 64 00 по адресу 100Dh лежат в памяти, но не выполняются ни разу</text>
  </g>

  <g data-key="r7">
    <rect x="40" y="392" width="860" height="48" class="row"/>
    <text x="85"  y="422" class="mono" text-anchor="middle">1010h</text>
    <text x="144" y="422" class="mono">add ax, 5</text>
    <text x="350" y="422" class="mono" text-anchor="middle">0014h</text>
    <text x="450" y="422" class="mono" text-anchor="middle">0005h</text>
    <text x="535" y="422" class="mono" text-anchor="middle">0</text>
    <text x="605" y="422" class="mono" text-anchor="middle">1</text>
    <text x="700" y="422" class="mono" text-anchor="middle">1013h</text>
    <text x="830" y="422" class="mono" text-anchor="middle">16</text>
  </g>

  <g data-key="r8">
    <rect x="40" y="440" width="860" height="48" class="row"/>
    <rect x="300" y="440" width="100" height="48" class="okc"/>
    <text x="85"  y="470" class="mono" text-anchor="middle">1013h</text>
    <text x="144" y="470" class="mono">hlt</text>
    <text x="350" y="470" class="mono" text-anchor="middle">0014h</text>
    <text x="450" y="470" class="mono" text-anchor="middle">0005h</text>
    <text x="535" y="470" class="mono" text-anchor="middle">0</text>
    <text x="605" y="470" class="mono" text-anchor="middle">1</text>
    <text x="700" y="470" class="mono" text-anchor="middle">—</text>
    <text x="830" y="470" class="mono" text-anchor="middle">6</text>
  </g>

  <g data-key="tot">
    <rect x="640" y="500" width="260" height="40" rx="8" class="bg"/>
    <text x="770" y="525" class="lbl" text-anchor="middle">итого 105 тактов</text>
  </g>

  <rect x="40" y="70" width="860" height="34" class="hdr"/>
  <text x="85"  y="92" class="hd" text-anchor="middle">IP</text>
  <text x="215" y="92" class="hd" text-anchor="middle">инструкция</text>
  <text x="350" y="92" class="hd" text-anchor="middle">AX</text>
  <text x="450" y="92" class="hd" text-anchor="middle">BX</text>
  <text x="535" y="92" class="hd" text-anchor="middle">ZF</text>
  <text x="605" y="92" class="hd" text-anchor="middle">SF</text>
  <text x="700" y="92" class="hd" text-anchor="middle">IP после</text>
  <text x="830" y="92" class="hd" text-anchor="middle">такты</text>
  <line x1="40" y1="152" x2="900" y2="152" class="grid"/>
  <line x1="40" y1="200" x2="900" y2="200" class="grid"/>
  <line x1="40" y1="248" x2="900" y2="248" class="grid"/>
  <line x1="40" y1="296" x2="900" y2="296" class="grid"/>
  <line x1="40" y1="344" x2="900" y2="344" class="grid"/>
  <line x1="40" y1="392" x2="900" y2="392" class="grid"/>
  <line x1="40" y1="440" x2="900" y2="440" class="grid"/>
  <line x1="130" y1="70" x2="130" y2="488" class="grid"/>
  <line x1="300" y1="70" x2="300" y2="488" class="grid"/>
  <line x1="400" y1="70" x2="400" y2="488" class="grid"/>
  <line x1="500" y1="70" x2="500" y2="488" class="grid"/>
  <line x1="570" y1="70" x2="570" y2="488" class="grid"/>
  <line x1="640" y1="70" x2="640" y2="488" class="grid"/>
  <line x1="760" y1="70" x2="760" y2="488" class="grid"/>
  <rect x="40" y="70" width="860" height="418" class="out"/>

  <rect x="40" y="560" width="880" height="54" rx="10" class="pan"/>
  <text x="56" y="591" class="pl">НА ЭТОМ ШАГЕ</text>
  <g data-key="n1" data-only="1"><text x="180" y="591" class="pt">AX = 000Ah = 10; флаги не тронуты — mov их не меняет</text></g>
  <g data-key="n2" data-only="1"><text x="180" y="591" class="pt">BX = 0005h = 5; переменные a и b разложены по двум регистрам</text></g>
  <g data-key="n3" data-only="1"><text x="180" y="591" class="pt">AX = 10 + 5 = 15 = 000Fh; результат лёг поверх первого операнда</text></g>
  <g data-key="n4" data-only="1"><text x="180" y="591" class="pt">15 − 20 = −5 → ZF = 0, SF = 1; сам AX не изменился</text></g>
  <g data-key="n5" data-only="1"><text x="180" y="591" class="pt">SF = 1 → условие «меньше или равно» истинно → IP = 100Bh + 2 + 3 = 1010h</text></g>
  <g data-key="n6" data-only="1"><text x="180" y="591" class="pt">100Dh пропущен: if (c &gt; 20) было ложным, ведь c = 15</text></g>
  <g data-key="n7" data-only="1"><text x="180" y="591" class="pt">AX = 15 + 5 = 20 = 0014h</text></g>
  <g data-key="n8" data-only="1"><text x="180" y="591" class="pt">16 + 16 + 11 + 16 + 24 + 16 + 6 = 105 тактов, ответ программы AX = 20</text></g>

  <text x="40" y="638" class="legend">зелёный — итоговый ответ · красный — инструкция, которая не выполнилась</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="r1 n1" data-focus="r1">
      <div class="step-kicker">Шаг 1 · инструкция 1</div>
      <h4>mov ax, 10 — то, что мы уже разобрали по тактам</h4>
      <p>В <code>AX</code> оказывается <code>000Ah</code>. Флаги остаются в прежнем
      состоянии: команды пересылки их не трогают, и это важно — иногда сравнение и
      условный переход разделены несколькими <code>mov</code>.</p>
    </div>
    <div class="step-panel" data-on="r1 r2 n2" data-focus="r2">
      <div class="step-kicker">Шаг 2 · инструкция 2</div>
      <h4>Второе присваивание, второй регистр</h4>
      <p>Опкод другой (<code>BB</code> вместо <code>B8</code>), потому что приёмник —
      <code>BX</code>. Всё остальное идентично: три байта, три цикла шины, 16 тактов.</p>
    </div>
    <div class="step-panel" data-on="r1 r2 r3 n3" data-focus="r3">
      <div class="step-kicker">Шаг 3 · инструкция 3</div>
      <h4>Первое настоящее вычисление</h4>
      <p><code>add ax, bx</code> отправляет оба числа в АЛУ и кладёт сумму обратно в
      <code>AX</code>: <code>000Fh</code>, то есть 15. Инструкция занимает всего два байта
      — операнды здесь регистры, их номера умещаются в один байт вместе с опкодом. Отсюда
      и 11 тактов вместо 16.</p>
    </div>
    <div class="step-panel" data-on="r1 r2 r3 r4 n4" data-focus="r4">
      <div class="step-kicker">Шаг 4 · инструкция 4</div>
      <h4>Сравнение, которое ничего не меняет — кроме флагов</h4>
      <p><code>cmp</code> — это то же вычитание, только результат выбрасывается.
      15 − 20 = −5: значит <code>ZF = 0</code> (не равно) и <code>SF = 1</code>
      (отрицательный). <code>AX</code> остался равен <code>000Fh</code>.</p>
    </div>
    <div class="step-panel" data-on="r1 r2 r3 r4 r5 n5" data-focus="r5">
      <div class="step-kicker">Шаг 5 · инструкция 5</div>
      <h4>Переход выполняется — и IP прыгает вперёд</h4>
      <p><code>SF = 1</code>, значит «меньше или равно» истинно, значит прыгаем. Байты
      инструкции — <code>7E 03</code>, где <code>03</code> — это смещение <em>относительно
      следующей инструкции</em>: <code>100Dh + 3 = 1010h</code>.</p>
      <p>Переход стоит дорого: 24 такта против 16 у обычной пересылки. Процессору
      приходится выбросить то, что он уже начал готовить, и начать с нового адреса.</p>
    </div>
    <div class="step-panel" data-on="r1 r2 r3 r4 r5 skip n6" data-focus="skip">
      <div class="step-kicker">Шаг 6 · то, чего не случилось</div>
      <h4>Три байта, которые никогда не выполнятся</h4>
      <p>Условие <code>if (c &gt; 20)</code> было ложным: <code>c</code> равно 15.
      Инструкция <code>mov ax, 100</code> лежит в памяти по адресу <code>100Dh</code>,
      её байты <code>B8 64 00</code> честно занимают место — но <code>IP</code> через них
      перепрыгнул, и процессор их даже не прочитает.</p>
      <p>Вот наглядная разница между «программа содержит инструкцию» и «процессор её
      выполняет». В памяти лежит весь код целиком, включая ветки, которые в этом запуске
      не понадобятся.</p>
    </div>
    <div class="step-panel" data-on="r1 r2 r3 r4 r5 skip r7 n7" data-focus="r7">
      <div class="step-kicker">Шаг 7 · инструкция 6</div>
      <h4>Приземлились ровно на метку L1</h4>
      <p><code>add ax, 5</code> по адресу <code>1010h</code> — это и есть <code>L1</code>.
      <code>AX</code> становится равен <code>0014h</code>, то есть 20.</p>
    </div>
    <div class="step-panel" data-on="r1 r2 r3 r4 r5 skip r7 r8 tot n8" data-focus="r8 tot">
      <div class="step-kicker">Шаг 8 · результат</div>
      <h4>AX = 20, и на это ушло 105 тактов</h4>
      <p><code>hlt</code> останавливает процессор. Ответ программы лежит в
      <code>AX</code>: <code>0014h</code> = 20. Сверимся с исходником:
      <code>c = 10 + 5 = 15</code>, условие ложно, <code>c = 15 + 5 = 20</code>. Сходится.</p>
      <p>Семь выполненных инструкций стоили 105 тактов. Сколько это в секундах — в
      следующей части.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-blue">
  <strong>Почему смещение перехода считается от следующей инструкции.</strong> В байтах
  <code>7E 03</code> тройка означает «прибавь 3 к <code>IP</code>». Но <code>IP</code> к
  моменту выполнения уже указывает на <code>100Dh</code> — процессор увеличил его сразу
  после выборки. Поэтому <code>100Dh + 3 = 1010h</code>. Такая адресация называется
  относительной, и благодаря ей код можно загрузить в память по любому адресу, ничего
  в нём не переписывая.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> исполнение программы — это восемь строк таблицы,
  и каждую из них можно восстановить руками, зная только байты и правила декодирования.
</div>

---

## Часть 7. Сколько это в тактах и наносекундах

<p>
  Мы насчитали 105 тактов. Чтобы перевести их во время, нужна тактовая частота.
  У Intel 8086 она составляла 5 МГц — пять миллионов тактов в секунду, значит
  длительность одного такта:
</p>

<div class="math-display" data-tex="t_{\text{такт}} = \frac{1}{f} = \frac{1}{5 \cdot 10^{6}\ \text{Гц}} = 200\ \text{нс}"></div>

<p>
  За один такт процессор успевает ровно одно элементарное действие: выставить
  адрес, передать байт по внутренней шине, обновить регистр, выполнить часть
  операции в АЛУ. Отсюда и вся арифметика: сколько элементарных действий — столько
  тактов, а сколько тактов — столько наносекунд.
</p>

<p>
  Число тактов на выполнение каждой инструкции берётся из таблиц таймингов
  конкретного процессора — они опубликованы и для 8086, и для его потомков.
  Сложим стоимость выборки (4 такта на байт) и стоимость выполнения:
</p>

<div class="stage" id="stageTicks" tabindex="0">
  <div class="stage-figure">
<svg id="tk" viewBox="0 0 960 642" role="img" aria-label="Диаграмма стоимости инструкций в тактах: у каждой инструкции синяя часть — выборка из памяти, жёлтая — выполнение">
  <style>
    #tk { font-family: Helvetica, Arial, sans-serif; }
    #tk .bf  { fill: #CFE0F2; stroke: #3576C0; stroke-width: 1.3; }
    #tk .be  { fill: #FBEFC0; stroke: #C29E08; stroke-width: 1.3; }
    #tk .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #tk .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #tk .ring{ fill: none; stroke: #5E5850; stroke-width: 2; stroke-dasharray: 5 4; }
    #tk .grid{ stroke: #E8E5DC; stroke-width: 1; stroke-dasharray: 3 4; }
    #tk .mono{ font-size: 13px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #tk .num { font-size: 13px; fill: #111111; font-weight: 700; }
    #tk .cap { font-size: 13px; fill: #5E5850; }
    #tk .lbl { font-size: 15px; fill: #111111; }
    #tk .inb { font-size: 13px; fill: #111111; }
    #tk .pan { fill: #F7F6F1; stroke: #E0DDD3; stroke-width: 1.2; }
    #tk .pl  { font-size: 12px; fill: #5E5850; letter-spacing: .06em; }
    #tk .pt  { font-size: 15px; fill: #111111; }
    #tk .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <text x="40" y="30" class="cap">СТОИМОСТЬ КАЖДОЙ ИНСТРУКЦИИ В ТАКТАХ</text>
  <text x="900" y="60" class="cap" text-anchor="end">такты</text>
  <line x1="200" y1="84" x2="200" y2="402" class="grid"/>
  <line x1="340" y1="84" x2="340" y2="402" class="grid"/>
  <line x1="480" y1="84" x2="480" y2="402" class="grid"/>
  <line x1="620" y1="84" x2="620" y2="402" class="grid"/>
  <line x1="760" y1="84" x2="760" y2="402" class="grid"/>
  <line x1="900" y1="84" x2="900" y2="402" class="grid"/>
  <text x="200" y="76" class="cap" text-anchor="middle">0</text>
  <text x="340" y="76" class="cap" text-anchor="middle">5</text>
  <text x="480" y="76" class="cap" text-anchor="middle">10</text>
  <text x="620" y="76" class="cap" text-anchor="middle">15</text>
  <text x="760" y="76" class="cap" text-anchor="middle">20</text>
  <text x="900" y="76" class="cap" text-anchor="middle">25</text>

  <g data-key="bars">
    <text x="190" y="111" class="mono" text-anchor="end">mov ax, 10</text>
    <rect x="200" y="90" width="336" height="32" class="bf"/>
    <rect x="536" y="90" width="112" height="32" class="be"/>
    <text x="658" y="111" class="num">16</text>
    <text x="190" y="157" class="mono" text-anchor="end">mov bx, 5</text>
    <rect x="200" y="136" width="336" height="32" class="bf"/>
    <rect x="536" y="136" width="112" height="32" class="be"/>
    <text x="658" y="157" class="num">16</text>
    <text x="190" y="203" class="mono" text-anchor="end">add ax, bx</text>
    <rect x="200" y="182" width="224" height="32" class="bf"/>
    <rect x="424" y="182" width="84" height="32" class="be"/>
    <text x="518" y="203" class="num">11</text>
    <text x="190" y="249" class="mono" text-anchor="end">cmp ax, 20</text>
    <rect x="200" y="228" width="336" height="32" class="bf"/>
    <rect x="536" y="228" width="112" height="32" class="be"/>
    <text x="658" y="249" class="num">16</text>
    <text x="190" y="295" class="mono" text-anchor="end">jle L1</text>
    <rect x="200" y="274" width="224" height="32" class="bf"/>
    <rect x="424" y="274" width="448" height="32" class="be"/>
    <text x="882" y="295" class="num">24</text>
    <text x="190" y="341" class="mono" text-anchor="end">add ax, 5</text>
    <rect x="200" y="320" width="336" height="32" class="bf"/>
    <rect x="536" y="320" width="112" height="32" class="be"/>
    <text x="658" y="341" class="num">16</text>
    <text x="190" y="387" class="mono" text-anchor="end">hlt</text>
    <rect x="200" y="366" width="112" height="32" class="bf"/>
    <rect x="312" y="366" width="56" height="32" class="be"/>
    <text x="378" y="387" class="num">6</text>
  </g>

  <g data-key="first" data-only="1">
    <rect x="197" y="87" width="454" height="38" rx="4" class="ring"/>
  </g>
  <g data-key="sml" data-only="1">
    <rect x="197" y="179" width="314" height="38" rx="4" class="ring"/>
  </g>
  <g data-key="jmp" data-only="1">
    <rect x="197" y="271" width="678" height="38" rx="4" class="ring"/>
  </g>

  <g data-key="tot">
    <rect x="200" y="430" width="360" height="42" rx="8" class="by"/>
    <text x="380" y="456" class="lbl" text-anchor="middle">105 тактов на всю программу</text>
  </g>

  <g data-key="time">
    <rect x="580" y="430" width="320" height="42" rx="8" class="bg"/>
    <text x="740" y="456" class="lbl" text-anchor="middle">105 × 200 нс = 21 мкс</text>
  </g>

  <g data-key="share">
    <text x="200" y="492" class="cap">куда ушли эти 105 тактов</text>
    <rect x="200" y="500" width="453" height="32" class="bf"/>
    <rect x="653" y="500" width="247" height="32" class="be"/>
    <text x="426" y="521" class="inb" text-anchor="middle">ожидание памяти · 68 тактов</text>
    <text x="776" y="521" class="inb" text-anchor="middle">работа · 37</text>
  </g>

  <rect x="40" y="550" width="880" height="54" rx="10" class="pan"/>
  <text x="56" y="581" class="pl">НА ЭТОМ ШАГЕ</text>
  <g data-key="n1" data-only="1"><text x="180" y="581" class="pt">длина полосы = 4 × (число байт) + такты на выполнение</text></g>
  <g data-key="n2" data-only="1"><text x="180" y="581" class="pt">mov ax, 10: 4 × 3 + 4 = 16 тактов = 3,2 мкс на частоте 5 МГц</text></g>
  <g data-key="n3" data-only="1"><text x="180" y="581" class="pt">add ax, bx: 4 × 2 + 3 = 11 тактов — короткая инструкция дешевле вдвойне</text></g>
  <g data-key="n4" data-only="1"><text x="180" y="581" class="pt">jle: 4 × 2 + 16 = 24 такта; сам переход стоит 16</text></g>
  <g data-key="n5" data-only="1"><text x="180" y="581" class="pt">16 + 16 + 11 + 16 + 24 + 16 + 6 = 105 тактов</text></g>
  <g data-key="n6" data-only="1"><text x="180" y="581" class="pt">105 × 200 нс = 21 000 нс = 21 мкс; в секунде таких программ 47 тысяч</text></g>
  <g data-key="n7" data-only="1"><text x="180" y="581" class="pt">68 из 105 тактов (65%) — это ожидание байтов из памяти</text></g>

  <text x="40" y="628" class="legend">синий — выборка байтов из памяти · жёлтый — собственно выполнение</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="bars n1" data-focus="bars">
      <div class="step-kicker">Шаг 1 · как читать</div>
      <h4>Каждая полоса состоит из двух частей</h4>
      <p>Синяя — сколько тактов ушло на то, чтобы вытащить байты инструкции из памяти:
      четыре такта за байт. Жёлтая — сколько заняло само выполнение по таблице таймингов
      8086. Полоса целиком — цена инструкции.</p>
    </div>
    <div class="step-panel" data-on="bars first n2" data-focus="first">
      <div class="step-kicker">Шаг 2 · базовая цена</div>
      <h4>Шестнадцать тактов на пересылку числа в регистр</h4>
      <p>Три байта выборки — двенадцать тактов, выполнение — четыре. На частоте 5 МГц это
      <code>16 × 200 нс = 3,2 мкс</code>. Три инструкции <code>mov</code> в программе
      стоят одинаково: их длина и работа совпадают.</p>
    </div>
    <div class="step-panel" data-on="bars sml n3" data-focus="sml">
      <div class="step-kicker">Шаг 3 · короткая инструкция</div>
      <h4>Экономия на длине важнее экономии на работе</h4>
      <p><code>add ax, bx</code> занимает два байта вместо трёх и выполняется за три такта
      вместо четырёх. Итог — 11 тактов. Обратите внимание, что выигрыш в основном пришёл
      не от более быстрой работы АЛУ, а от того, что читать надо на байт меньше.</p>
    </div>
    <div class="step-panel" data-on="bars jmp n4" data-focus="jmp">
      <div class="step-kicker">Шаг 4 · дорогая инструкция</div>
      <h4>Переход — самая дорогая инструкция программы</h4>
      <p>Байт всего два, а тактов 24. Шестнадцать из них — сам переход: процессору надо
      пересчитать <code>IP</code> и выбросить всё, что он уже успел подготовить для
      следующего по порядку адреса.</p>
      <p>Ветвления дороги — это правда и сегодня, только по другой причине: сейчас
      выбрасывать приходится не пару байт, а половину конвейера.</p>
    </div>
    <div class="step-panel" data-on="bars tot n5" data-focus="tot">
      <div class="step-kicker">Шаг 5 · сумма</div>
      <h4>Вся программа — 105 тактов</h4>
      <p>Семь выполненных инструкций. Пропущенная <code>mov ax, 100</code> не стоит
      ничего: её байты не читались, потому что <code>IP</code> через них перепрыгнул.</p>
    </div>
    <div class="step-panel" data-on="bars tot time n6" data-focus="time">
      <div class="step-kicker">Шаг 6 · во времени</div>
      <h4>Двадцать одна микросекунда</h4>
      <p><code>105 × 200 нс = 21 мкс</code>. За секунду процессор 8086 успел бы выполнить
      такую программу примерно 47 тысяч раз. Современное ядро на 4 ГГц с конвейером
      справляется с семью такими инструкциями за единицы наносекунд — разрыв около четырёх
      порядков.</p>
    </div>
    <div class="step-panel" data-on="bars tot time share n7" data-focus="share">
      <div class="step-kicker">Шаг 7 · главный вывод</div>
      <h4>Две трети времени процессор ждёт память</h4>
      <p>Сложите синие части: 12 + 12 + 8 + 12 + 8 + 12 + 4 = 68 тактов. Жёлтые дают 37.
      То есть 65% времени процессор не считает, а ждёт, пока по восьмибитной шине
      доедут байты.</p>
      <p>Это и есть та цифра, из которой выросла вся дальнейшая история архитектуры:
      широкие шины, кэши, очередь предвыборки, конвейер. Все они по-разному решают одну
      и ту же задачу — уменьшить синюю часть.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-red">
  <strong>Честная оговорка про модель.</strong> Мы считали по упрощённой схеме
  «выборка, потом выполнение», как в исходном параграфе. Реальный 8086 был устроен
  чуть хитрее: у него была очередь предвыборки на 6 байт, и шинный блок дочитывал
  следующие инструкции, пока исполнительный блок работал над текущей. Поэтому
  настоящие 105 тактов на этой программе были бы меньше — часть выборки пряталась
  за выполнением. Наша модель верна как <em>верхняя оценка</em> и как способ увидеть
  пропорцию, а не как точный хронометраж.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> время работы программы определяется не
  сложностью вычислений, а числом обращений к памяти — и именно поэтому дальше вся
  архитектура развивалась вокруг памяти, а не вокруг арифметики.
</div>

---

## Часть 8. Что изменилось за пятьдесят лет

<p>
  Цикл <code>Fetch — Decode — Execute — Store</code> никуда не делся: современное
  ядро делает ровно то же самое. Изменилось всё вокруг него, и почти каждое
  изменение атакует ту самую синюю часть диаграммы — 65% времени, потраченных на
  ожидание памяти.
</p>

### Шире всё, что можно расширить

<p>
  Регистры выросли до 64 бит, их стало шестнадцать вместо восьми, адресное
  пространство — до <code>2<sup>64</sup></code>. Но важнее для нашего примера
  другое: шина данных тоже стала 64-битной. Там, где 8086 тащил инструкцию
  <code>B8 0A 00</code> тремя циклами по четыре такта, современный процессор
  забирает восемь байт за одно обращение — то есть всю нашу программу за три
  запроса вместо двадцати. И единой системной шины больше нет: у каждого узла
  свой канал, они не мешают друг другу.
</p>

### Конвейер

<p>
  Второй приём — не ускорять инструкцию, а перестать ждать её окончания. Пока
  первая инструкция декодируется, вторую уже можно выбирать: стадии
  <code>F</code>, <code>D</code>, <code>E</code>, <code>S</code> — это разные блоки
  кристалла, и держать три из них простаивающими незачем.
</p>

<div class="stage" id="stageMod" tabindex="0">
  <div class="stage-figure">
<svg id="md" viewBox="0 0 960 644" role="img" aria-label="Сравнение последовательного выполнения и конвейера: те же семь инструкций занимают 28 тактов последовательно и 10 тактов на конвейере">
  <style>
    #md { font-family: Helvetica, Arial, sans-serif; }
    #md .sF { fill: #CFE0F2; stroke: #3576C0; stroke-width: 1; }
    #md .sD { fill: #EDF4FB; stroke: #3576C0; stroke-width: 1; }
    #md .sE { fill: #FBEFC0; stroke: #C29E08; stroke-width: 1; }
    #md .sS { fill: #E4F5D6; stroke: #73B222; stroke-width: 1; }
    #md .stg { font-size: 12px; fill: #111111; }
    #md .mono{ font-size: 12px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #md .grid{ stroke: #E8E5DC; stroke-width: 1; stroke-dasharray: 3 4; }
    #md .cap { font-size: 13px; fill: #5E5850; }
    #md .hd  { font-size: 14px; fill: #111111; font-weight: 700; }
    #md .num { font-size: 14px; fill: #111111; font-weight: 700; }
    #md .red { font-size: 12px; fill: #C30B0A; }
    #md .grn { font-size: 12px; fill: #5A8C1C; }
    #md .ringr { fill: none; stroke: #C30B0A; stroke-width: 2.2; }
    #md .ringg { fill: none; stroke: #73B222; stroke-width: 2.2; }
    #md .pan { fill: #F7F6F1; stroke: #E0DDD3; stroke-width: 1.2; }
    #md .pl  { font-size: 12px; fill: #5E5850; letter-spacing: .06em; }
    #md .pt  { font-size: 15px; fill: #111111; }
    #md .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <text x="40" y="30" class="cap">ТЕ ЖЕ СЕМЬ ИНСТРУКЦИЙ, ДВА СПОСОБА ИХ ВЫПОЛНИТЬ</text>
  <line x1="200" y1="72" x2="200" y2="508" class="grid"/>
  <line x1="300" y1="72" x2="300" y2="508" class="grid"/>
  <line x1="400" y1="72" x2="400" y2="508" class="grid"/>
  <line x1="500" y1="72" x2="500" y2="508" class="grid"/>
  <line x1="600" y1="72" x2="600" y2="508" class="grid"/>
  <line x1="700" y1="72" x2="700" y2="508" class="grid"/>
  <line x1="800" y1="72" x2="800" y2="508" class="grid"/>
  <line x1="900" y1="72" x2="900" y2="508" class="grid"/>
  <text x="200" y="64" class="cap" text-anchor="middle">0</text>
  <text x="300" y="64" class="cap" text-anchor="middle">4</text>
  <text x="400" y="64" class="cap" text-anchor="middle">8</text>
  <text x="500" y="64" class="cap" text-anchor="middle">12</text>
  <text x="600" y="64" class="cap" text-anchor="middle">16</text>
  <text x="700" y="64" class="cap" text-anchor="middle">20</text>
  <text x="800" y="64" class="cap" text-anchor="middle">24</text>
  <text x="900" y="64" class="cap" text-anchor="middle">28</text>
  <text x="40" y="64" class="hd">такты →</text>

  <g data-key="seq">
    <text x="190" y="100" class="mono" text-anchor="end">mov ax, 10</text>
    <rect x="200" y="84" width="25" height="22" class="sF"/>
    <text x="212" y="100" class="stg" text-anchor="middle">F</text>
    <rect x="225" y="84" width="25" height="22" class="sD"/>
    <text x="237" y="100" class="stg" text-anchor="middle">D</text>
    <rect x="250" y="84" width="25" height="22" class="sE"/>
    <text x="262" y="100" class="stg" text-anchor="middle">E</text>
    <rect x="275" y="84" width="25" height="22" class="sS"/>
    <text x="287" y="100" class="stg" text-anchor="middle">S</text>
    <text x="190" y="126" class="mono" text-anchor="end">mov bx, 5</text>
    <rect x="300" y="110" width="25" height="22" class="sF"/>
    <text x="312" y="126" class="stg" text-anchor="middle">F</text>
    <rect x="325" y="110" width="25" height="22" class="sD"/>
    <text x="337" y="126" class="stg" text-anchor="middle">D</text>
    <rect x="350" y="110" width="25" height="22" class="sE"/>
    <text x="362" y="126" class="stg" text-anchor="middle">E</text>
    <rect x="375" y="110" width="25" height="22" class="sS"/>
    <text x="387" y="126" class="stg" text-anchor="middle">S</text>
    <text x="190" y="152" class="mono" text-anchor="end">add ax, bx</text>
    <rect x="400" y="136" width="25" height="22" class="sF"/>
    <text x="412" y="152" class="stg" text-anchor="middle">F</text>
    <rect x="425" y="136" width="25" height="22" class="sD"/>
    <text x="437" y="152" class="stg" text-anchor="middle">D</text>
    <rect x="450" y="136" width="25" height="22" class="sE"/>
    <text x="462" y="152" class="stg" text-anchor="middle">E</text>
    <rect x="475" y="136" width="25" height="22" class="sS"/>
    <text x="487" y="152" class="stg" text-anchor="middle">S</text>
    <text x="190" y="178" class="mono" text-anchor="end">cmp ax, 20</text>
    <rect x="500" y="162" width="25" height="22" class="sF"/>
    <text x="512" y="178" class="stg" text-anchor="middle">F</text>
    <rect x="525" y="162" width="25" height="22" class="sD"/>
    <text x="537" y="178" class="stg" text-anchor="middle">D</text>
    <rect x="550" y="162" width="25" height="22" class="sE"/>
    <text x="562" y="178" class="stg" text-anchor="middle">E</text>
    <rect x="575" y="162" width="25" height="22" class="sS"/>
    <text x="587" y="178" class="stg" text-anchor="middle">S</text>
    <text x="190" y="204" class="mono" text-anchor="end">jle L1</text>
    <rect x="600" y="188" width="25" height="22" class="sF"/>
    <text x="612" y="204" class="stg" text-anchor="middle">F</text>
    <rect x="625" y="188" width="25" height="22" class="sD"/>
    <text x="637" y="204" class="stg" text-anchor="middle">D</text>
    <rect x="650" y="188" width="25" height="22" class="sE"/>
    <text x="662" y="204" class="stg" text-anchor="middle">E</text>
    <rect x="675" y="188" width="25" height="22" class="sS"/>
    <text x="687" y="204" class="stg" text-anchor="middle">S</text>
    <text x="190" y="230" class="mono" text-anchor="end">add ax, 5</text>
    <rect x="700" y="214" width="25" height="22" class="sF"/>
    <text x="712" y="230" class="stg" text-anchor="middle">F</text>
    <rect x="725" y="214" width="25" height="22" class="sD"/>
    <text x="737" y="230" class="stg" text-anchor="middle">D</text>
    <rect x="750" y="214" width="25" height="22" class="sE"/>
    <text x="762" y="230" class="stg" text-anchor="middle">E</text>
    <rect x="775" y="214" width="25" height="22" class="sS"/>
    <text x="787" y="230" class="stg" text-anchor="middle">S</text>
    <text x="190" y="256" class="mono" text-anchor="end">hlt</text>
    <rect x="800" y="240" width="25" height="22" class="sF"/>
    <text x="812" y="256" class="stg" text-anchor="middle">F</text>
    <rect x="825" y="240" width="25" height="22" class="sD"/>
    <text x="837" y="256" class="stg" text-anchor="middle">D</text>
    <rect x="850" y="240" width="25" height="22" class="sE"/>
    <text x="862" y="256" class="stg" text-anchor="middle">E</text>
    <rect x="875" y="240" width="25" height="22" class="sS"/>
    <text x="887" y="256" class="stg" text-anchor="middle">S</text>
    <text x="900" y="282" class="num" text-anchor="end">28 тактов</text>
  </g>

  <g data-key="pipe">
    <text x="40" y="322" class="cap">на конвейере стадии разных инструкций работают одновременно</text>
    <text x="190" y="346" class="mono" text-anchor="end">mov ax, 10</text>
    <rect x="200" y="330" width="25" height="22" class="sF"/>
    <text x="212" y="346" class="stg" text-anchor="middle">F</text>
    <rect x="225" y="330" width="25" height="22" class="sD"/>
    <text x="237" y="346" class="stg" text-anchor="middle">D</text>
    <rect x="250" y="330" width="25" height="22" class="sE"/>
    <text x="262" y="346" class="stg" text-anchor="middle">E</text>
    <rect x="275" y="330" width="25" height="22" class="sS"/>
    <text x="287" y="346" class="stg" text-anchor="middle">S</text>
    <text x="190" y="372" class="mono" text-anchor="end">mov bx, 5</text>
    <rect x="225" y="356" width="25" height="22" class="sF"/>
    <text x="237" y="372" class="stg" text-anchor="middle">F</text>
    <rect x="250" y="356" width="25" height="22" class="sD"/>
    <text x="262" y="372" class="stg" text-anchor="middle">D</text>
    <rect x="275" y="356" width="25" height="22" class="sE"/>
    <text x="287" y="372" class="stg" text-anchor="middle">E</text>
    <rect x="300" y="356" width="25" height="22" class="sS"/>
    <text x="312" y="372" class="stg" text-anchor="middle">S</text>
    <text x="190" y="398" class="mono" text-anchor="end">add ax, bx</text>
    <rect x="250" y="382" width="25" height="22" class="sF"/>
    <text x="262" y="398" class="stg" text-anchor="middle">F</text>
    <rect x="275" y="382" width="25" height="22" class="sD"/>
    <text x="287" y="398" class="stg" text-anchor="middle">D</text>
    <rect x="300" y="382" width="25" height="22" class="sE"/>
    <text x="312" y="398" class="stg" text-anchor="middle">E</text>
    <rect x="325" y="382" width="25" height="22" class="sS"/>
    <text x="337" y="398" class="stg" text-anchor="middle">S</text>
    <text x="190" y="424" class="mono" text-anchor="end">cmp ax, 20</text>
    <rect x="275" y="408" width="25" height="22" class="sF"/>
    <text x="287" y="424" class="stg" text-anchor="middle">F</text>
    <rect x="300" y="408" width="25" height="22" class="sD"/>
    <text x="312" y="424" class="stg" text-anchor="middle">D</text>
    <rect x="325" y="408" width="25" height="22" class="sE"/>
    <text x="337" y="424" class="stg" text-anchor="middle">E</text>
    <rect x="350" y="408" width="25" height="22" class="sS"/>
    <text x="362" y="424" class="stg" text-anchor="middle">S</text>
    <text x="190" y="450" class="mono" text-anchor="end">jle L1</text>
    <rect x="300" y="434" width="25" height="22" class="sF"/>
    <text x="312" y="450" class="stg" text-anchor="middle">F</text>
    <rect x="325" y="434" width="25" height="22" class="sD"/>
    <text x="337" y="450" class="stg" text-anchor="middle">D</text>
    <rect x="350" y="434" width="25" height="22" class="sE"/>
    <text x="362" y="450" class="stg" text-anchor="middle">E</text>
    <rect x="375" y="434" width="25" height="22" class="sS"/>
    <text x="387" y="450" class="stg" text-anchor="middle">S</text>
    <text x="190" y="476" class="mono" text-anchor="end">add ax, 5</text>
    <rect x="325" y="460" width="25" height="22" class="sF"/>
    <text x="337" y="476" class="stg" text-anchor="middle">F</text>
    <rect x="350" y="460" width="25" height="22" class="sD"/>
    <text x="362" y="476" class="stg" text-anchor="middle">D</text>
    <rect x="375" y="460" width="25" height="22" class="sE"/>
    <text x="387" y="476" class="stg" text-anchor="middle">E</text>
    <rect x="400" y="460" width="25" height="22" class="sS"/>
    <text x="412" y="476" class="stg" text-anchor="middle">S</text>
    <text x="190" y="502" class="mono" text-anchor="end">hlt</text>
    <rect x="350" y="486" width="25" height="22" class="sF"/>
    <text x="362" y="502" class="stg" text-anchor="middle">F</text>
    <rect x="375" y="486" width="25" height="22" class="sD"/>
    <text x="387" y="502" class="stg" text-anchor="middle">D</text>
    <rect x="400" y="486" width="25" height="22" class="sE"/>
    <text x="412" y="502" class="stg" text-anchor="middle">E</text>
    <rect x="425" y="486" width="25" height="22" class="sS"/>
    <text x="437" y="502" class="stg" text-anchor="middle">S</text>
    <text x="470" y="502" class="num">10 тактов</text>
  </g>

  <g data-key="gain" data-only="1">
    <text x="40" y="282" class="cap">быстрее в 2,8 раза; предел для четырёх стадий — 4 раза</text>
  </g>

  <g data-key="stall" data-only="1">
    <rect x="298" y="432" width="104" height="26" rx="3" class="ringr"/>
    <text x="412" y="449" class="red">jle не может начать, пока cmp не досчитал флаги</text>
  </g>

  <g data-key="pred" data-only="1">
    <rect x="298" y="432" width="104" height="26" rx="3" class="ringg"/>
    <text x="440" y="475" class="grn">предсказатель ставит на «прыгаем» и не ждёт результата</text>
  </g>

  <g data-key="math" data-only="1">
    <text x="600" y="530" class="cap">простой: 150 → 15 тактов на 100 инструкций</text>
  </g>

  <rect x="40" y="552" width="880" height="54" rx="10" class="pan"/>
  <text x="56" y="583" class="pl">НА ЭТОМ ШАГЕ</text>
  <g data-key="n1" data-only="1"><text x="180" y="583" class="pt">последовательно: инструкция 2 стартует только после того, как закончила инструкция 1</text></g>
  <g data-key="n2" data-only="1"><text x="180" y="583" class="pt">на конвейере инструкция 2 стартует, когда инструкция 1 ушла со стадии выборки</text></g>
  <g data-key="n3" data-only="1"><text x="180" y="583" class="pt">7 × 4 = 28 тактов против 4 + 6 = 10; выигрыш 2,8 раза, предел для 4 стадий — 4 раза</text></g>
  <g data-key="n4" data-only="1"><text x="180" y="583" class="pt">jle зависит от результата cmp: конвейер встаёт, пока флаги не готовы</text></g>
  <g data-key="n5" data-only="1"><text x="180" y="583" class="pt">предсказатель угадывает направление ветвления и заполняет конвейер заранее</text></g>
  <g data-key="n6" data-only="1"><text x="180" y="583" class="pt">без предсказателя 15 × 10 = 150 тактов простоя, с ним 0,75 × 20 = 15 тактов</text></g>

  <text x="40" y="630" class="legend">F — выборка · D — декодирование · E — выполнение · S — запись результата</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="seq n1" data-focus="seq">
      <div class="step-kicker">Шаг 1 · как было</div>
      <h4>Каждая инструкция ждёт предыдущую целиком</h4>
      <p>Так работал 8086 в нашей модели: четыре стадии подряд, потом следующая
      инструкция. Семь инструкций по четыре стадии — 28 тактов, и три четверти блоков
      процессора в любой момент простаивают.</p>
      <p>Здесь все стадии для наглядности взяты одинаковой длины в один такт — в
      реальности выборка была намного дороже.</p>
    </div>
    <div class="step-panel" data-on="seq pipe n2" data-focus="pipe">
      <div class="step-kicker">Шаг 2 · как стало</div>
      <h4>Стадии сдвигаются на один такт, а не на четыре</h4>
      <p>Как только первая инструкция ушла с выборки, блок выборки свободен — и берётся
      за вторую. Через четыре такта конвейер заполнен: в нём одновременно живут четыре
      инструкции на разных стадиях.</p>
      <p>Отдельная инструкция при этом быстрее не стала. Быстрее стал <em>поток</em>.</p>
    </div>
    <div class="step-panel" data-on="seq pipe gain n3" data-focus="gain">
      <div class="step-kicker">Шаг 3 · выигрыш</div>
      <h4>28 тактов против 10</h4>
      <p>Формула простая: последовательно нужно <code>N × S</code> тактов, на конвейере —
      <code>S + (N − 1)</code>. На семи инструкциях это 28 против 10, ускорение в 2,8 раза;
      на длинной программе выигрыш стремится к числу стадий.</p>
      <p>Отсюда и гонка за глубиной конвейера: у Pentium 4 стадий было больше двадцати.</p>
    </div>
    <div class="step-panel" data-on="seq pipe gain stall n4" data-focus="stall">
      <div class="step-kicker">Шаг 4 · что ломается</div>
      <h4>Ветвление разрывает конвейер</h4>
      <p>Наша пятая инструкция — <code>jle L1</code>. Чтобы решить, прыгать ли, нужны
      флаги от <code>cmp ax, 20</code>, а та ещё не дошла до стадии выполнения. Конвейер
      встаёт.</p>
      <p>Хуже того: процессор не знает, какую инструкцию выбирать следующей —
      <code>mov ax, 100</code> или <code>add ax, 5</code>. Любая догадка может оказаться
      неверной, и тогда всё, что успело заехать в конвейер, придётся выбросить.</p>
    </div>
    <div class="step-panel" data-on="seq pipe gain pred n5" data-focus="pred">
      <div class="step-kicker">Шаг 5 · решение</div>
      <h4>Предсказатель переходов угадывает и не ждёт</h4>
      <p>Вместо простоя процессор делает ставку: смотрит на историю этого перехода и
      продолжает заполнять конвейер по угаданной ветке. Угадал — простоя не было вовсе.
      Ошибся — конвейер сбрасывается, и это стоит 15–20 тактов штрафа.</p>
      <p>На современных ядрах точность предсказания превышает 95%, а на предсказуемых
      циклах доходит до 99%.</p>
    </div>
    <div class="step-panel" data-on="seq pipe gain pred math n6" data-focus="math">
      <div class="step-kicker">Шаг 6 · арифметика ставки</div>
      <h4>Почему ставка выгодна даже с ошибками</h4>
      <p>Инструкций с ветвлением в коде примерно 15%. Без предсказателя каждая ждёт около
      десяти тактов: на 100 инструкций это <code>15 × 10 = 150</code> тактов простоя.</p>
      <p>С предсказателем при точности 95% ошибаются <code>15 × 0,05 = 0,75</code>
      инструкции, штраф 20 тактов каждая: <code>0,75 × 20 = 15</code> тактов. Простой
      сократился в десять раз — и это при том, что ошибка обходится вдвое дороже
      ожидания.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Кэши: три уровня между регистрами и памятью

<p>
  Тактовая частота росла быстрее, чем скорость памяти, и разрыв стал пропастью.
  Ответом стала иерархия кэшей — небольших быстрых буферов прямо на кристалле,
  где оседает то, к чему процессор обращался недавно. <code>L1</code> при этом
  разделён на кэш данных и кэш инструкций — ровно та идея разделения, которая в
  чистом виде называется гарвардской архитектурой.
</p>

<table class="shape-table">
  <tr><th>Где лежат данные</th><th>Объём</th><th>Цена обращения</th><th>Во сколько раз дольше регистра</th></tr>
  <tr><td>регистры</td><td>16 × 8 байт</td><td>1 такт</td><td>1</td></tr>
  <tr><td>L1 (отдельно данные и инструкции)</td><td>16–128 КБ на ядро</td><td>1–3 такта</td><td>до 3</td></tr>
  <tr><td>L2</td><td>256 КБ – 2 МБ на ядро</td><td>5–15 тактов</td><td>до 15</td></tr>
  <tr><td>L3 (общий для всех ядер)</td><td>2–64 МБ</td><td>30–60 тактов</td><td>до 60</td></tr>
  <tr><td>оперативная память</td><td>гигабайты</td><td>200–300 тактов</td><td>до 300</td></tr>
  <tr><td>SSD NVMe</td><td>терабайты</td><td>порядка 10<sup>5</sup> тактов</td><td>до 100 000</td></tr>
</table>

<p>
  Прочитайте последний столбец ещё раз. Промах мимо кэша в оперативную память
  стоит примерно как триста обращений к регистру — то есть как три наши
  программы целиком. Именно поэтому современный код оптимизируют не по числу
  операций, а по расположению данных в памяти.
</p>

### Больше АЛУ и векторные блоки

<p>
  У 8086 было одно арифметико-логическое устройство, умевшее складывать,
  вычитать, сдвигать и сравнивать 16-битные числа; умножение собиралось из
  десятков элементарных шагов, а дробных чисел не было вовсе. Сегодня в ядре
  несколько АЛУ, работающих параллельно, отдельные блоки умножения и деления,
  блок чисел с плавающей точкой и <strong>SIMD</strong>-блоки — векторные
  устройства, где одна инструкция выполняет операцию сразу над набором чисел.
  Например, <code>vaddps</code> складывает 16 пар 32-битных дробных чисел за один
  такт — там, где обычному АЛУ понадобилось бы шестнадцать инструкций.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> все улучшения последних пятидесяти лет —
  широкие шины, кэши, конвейер, предсказание, векторные блоки — решают одну задачу:
  не дать исполнительным блокам простаивать в ожидании байтов.
</div>

---

## Часть 9. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Регистр — не переменная, а место.</strong> <code>AL</code>,
  <code>AH</code>, <code>AX</code>, <code>EAX</code>, <code>RAX</code> — пять имён
  для вложенных кусков одной ячейки. Совместимость x86 держится на этой матрёшке.</li>

  <li><strong>Разрядность и объём памяти — разные вещи.</strong> Первая — ширина
  регистров, вторая — число линий адресной шины. У 8086 это 16 и 20.</li>

  <li><strong>Обращение к памяти — протокол на четыре такта.</strong> Адрес на
  <code>A0…A15</code>, <code>RD = 0</code> и <code>WR = 1</code> на шине управления,
  ответные <code>CE</code> и <code>OE</code>, байт на <code>D0…D7</code>. На шине
  управления активен ноль, а не единица.</li>

  <li><strong>Инструкция = опкод + операнды.</strong> Первый байт задаёт и операцию,
  и приёмник, и длину всей инструкции. У x86 инструкции переменной длины, поэтому
  границу между ними знает только декодер.</li>

  <li><strong>Little-endian.</strong> <code>0A 00</code> в памяти — это число
  <code>000Ah</code> = 10, а не <code>0A00h</code>.</li>

  <li><strong>Программа — это история регистра IP.</strong> Выполнить инструкцию
  значит прибавить её длину к <code>IP</code>; условный переход просто пишет туда
  другое число, и байты пропущенной ветки остаются лежать непрочитанными.</li>

  <li><strong>Условие в ассемблере переворачивается.</strong> <code>if (c &gt; 20)</code>
  превращается в <code>jle</code>, потому что прыжок перескакивает тело условия.</li>

  <li><strong>Цена инструкции = выборка + выполнение.</strong> Четыре такта за байт
  плюс табличное время команды. В нашей программе 68 тактов из 105 ушли на выборку.</li>

  <li><strong>Конвейер ускоряет поток, а не инструкцию.</strong>
  <code>N × S</code> тактов превращаются в <code>S + (N − 1)</code>, а ветвления
  этот выигрыш съедают — отсюда предсказатель переходов.</li>

  <li><strong>Вся современная архитектура выросла из ожидания памяти.</strong>
  Кэши, широкие шины, предвыборка, конвейер — разные ответы на один и тот же
  вопрос: чем занять процессор, пока едут байты.</li>
</ol>

<p>
  Если унести из статьи одну картину, пусть это будет таблица прогона из шестой
  части. Двадцать байт, семь строк, один счётчик <code>IP</code>, который каждый
  раз увеличивается на длину выполненной инструкции — и в конце в <code>AX</code>
  оказывается двадцатка. Всё остальное, от кэша третьего уровня до векторных
  инструкций, надстроено над этими семью строками, чтобы они проходили быстрее.
</p>

<p class="tiny">
  Числа в статье получены так: программа из параграфа собрана в машинный код x86-16
  вручную и проверена скриптом (смещение перехода, длины инструкций, побайтовый
  образ памяти), исполнение просимулировано, флаги посчитаны по правилам вычитания
  16-битных чисел. Такты складываются из 4 тактов на байт выборки (модель исходного
  параграфа) и табличного времени выполнения для 8086: MOV r16,imm16 — 4,
  ADD r/m16,r16 — 3, CMP AX,imm16 — 4, условный переход при выполненном переходе —
  16, HLT — 2. Модель упрощённая: реальный 8086 частично совмещал выборку и
  выполнение через очередь предвыборки, поэтому 105 тактов — верхняя оценка.
  Характеристики кэшей, доля ветвлений (15%), точность предсказания (более 95%) и
  штраф за промах (15–20 тактов) взяты из исходного параграфа Хендбука и приведены
  как порядковые величины, а не как параметры конкретной модели процессора.
</p>
