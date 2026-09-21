<p class="lead">
  Архитектура компьютера — это не список деталей, а ответ на один неудобный
  факт: процессор быстрее всего остального в сотни тысяч раз. Всё, что мы
  разберём — две памяти вместо одной, три группы линий в шине, кэши внутри
  процессора, чипсет рядом с ним, — придумано ради того, чтобы этот разрыв
  чем-нибудь закрыть.
</p>

<p>
  Мы соберём компьютер с нуля: начнём с процессора и памяти, добавим
  периферию, свяжем всё шиной, увидим, где эта конструкция упирается в потолок,
  и посмотрим, во что она превратилась на современной материнской плате. В
  конце дважды пройдём весь путь сигнала — от двойного клика по иконке игры до
  первого кадра на мониторе.
</p>

<p>
  Никакой подготовки не нужно: ни электроники, ни программирования. Все числа в
  статье — типичные значения для настольного компьютера 2020-х, они нужны не
  для точности, а для чувства масштаба.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Ничего, кроме любопытства</strong>
    <p>Достаточно знать, что внутри системного блока есть процессор и память.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Один настольный компьютер</strong>
    <p>CPU 3,2 ГГц, DDR5-6400 в двух каналах, NVMe SSD 7 ГБ/с, игра на 8 ГБ. Эти числа тянутся через всю статью.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Вы сможете объяснить схему</strong>
    <p>Зачем нужны ОЗУ и ПЗУ по отдельности, что такое узкое место фон Неймана и почему видеокарта висит на процессоре, а мышь — на чипсете.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные, память, хранилища</span>
  <span><i style="background:#C29E08"></i>кто работает: процессор, чипсет</span>
  <span><i style="background:#73B222"></i>результат, вывод наружу</span>
  <span><i style="background:#C30B0A"></i>узкое место, потери, ожидание</span>
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не
  на всю схему сразу, а только на яркую часть. Схема не перерисовывается: блок,
  который на втором шаге был слева, на седьмом останется ровно там же — меняется
  не карта, а то, куда смотреть. Стрелки на клавиатуре работают, когда сцена в
  фокусе.
</div>

## Часть 1. Центральная часть: процессор и две памяти

<p>
  <strong>Архитектура компьютера</strong> — это описание того, из каких частей он
  собран и как эти части между собой договариваются. Не «какие детали лежат в
  коробке», а «кто кому что передаёт и в каком порядке». Дальше мы построим эту
  схему сами, добавляя по одному блоку за раз и каждый раз спрашивая: а зачем
  он тут понадобился?
</p>

<p>
  Начинается всё с двух вещей: с того, что <em>считает</em>, и с того, что
  <em>помнит</em>. Считает <strong>центральный процессор</strong> (CPU) — он
  выбирает из памяти очередную команду, выполняет её и управляет всеми
  остальными устройствами. Помнит <strong>оперативная память</strong> (ОЗУ,
  RAM) — в ней лежат и программа, которая сейчас выполняется, и данные, с
  которыми она работает. Вместе процессор и внутренняя память образуют
  <strong>центральную часть</strong>: блок, который управляет всей машиной.
</p>

<p>
  Но одной оперативной памяти не хватает, и вот почему. ОЗУ
  <strong>энергозависима</strong>: она хранит данные, пока через неё идёт ток.
  Выключили питание — в ней ноль информации. А теперь представьте момент
  включения компьютера: ОЗУ пуста, диск процессор читать не умеет (он ещё не
  знает, ни какой диск подключён, ни как с ним говорить), программ нет. Первую
  команду взять неоткуда.
</p>

<p>
  Поэтому рядом ставят вторую память — <strong>постоянную</strong> (ПЗУ, ROM).
  Она энергонезависимая, маленькая (обычно десятки мегабайт) и записана
  заранее: в ней лежит прошивка BIOS/UEFI — инструкции начальной загрузки и
  базовые настройки системы. Именно с неё процессор начинает работу.
</p>

<p>Соберём центральную часть по шагам.</p>

<div class="stage" id="stageCore" tabindex="0">
  <div class="stage-figure">
<svg id="cp" viewBox="0 0 960 480" role="img" aria-label="Центральная часть компьютера: процессор, оперативная память, постоянная память">
  <style>
    #cp { font-family: Helvetica, Arial, sans-serif; }
    #cp .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #cp .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #cp .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #cp .br  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #cp .frame { fill: none; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 7 6; }
    #cp .big { font-size: 21px; font-weight: 700; fill: #111111; }
    #cp .lbl { font-size: 16px; fill: #111111; }
    #cp .cap { font-size: 13px; fill: #5E5850; }
    #cp .capr { font-size: 13.5px; fill: #C30B0A; }
    #cp .capg { font-size: 13.5px; fill: #4d7a15; }
    #cp .edge { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #cp .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="cp-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="core">
    <rect x="60" y="95" width="520" height="305" rx="16" class="frame"/>
    <text x="62" y="82" class="cap">ЦЕНТРАЛЬНАЯ ЧАСТЬ — работает, ещё ничего не подключив снаружи</text>
  </g>

  <g data-key="cpu">
    <rect x="90" y="130" width="200" height="110" rx="10" class="by"/>
    <text x="190" y="172" class="big" text-anchor="middle">CPU</text>
    <text x="190" y="197" class="cap" text-anchor="middle">процессор</text>
    <text x="190" y="219" class="cap" text-anchor="middle">выполняет команды</text>
  </g>

  <g data-key="ram">
    <rect x="350" y="130" width="210" height="110" rx="10" class="bx"/>
    <text x="455" y="168" class="lbl" text-anchor="middle">ОЗУ (RAM)</text>
    <text x="455" y="192" class="cap" text-anchor="middle">программа и данные,</text>
    <text x="455" y="212" class="cap" text-anchor="middle">пока есть питание</text>
  </g>

  <g data-key="busram">
    <line x1="292" y1="185" x2="348" y2="185" class="edge" marker-start="url(#cp-arw)" marker-end="url(#cp-arw)"/>
    <text x="320" y="172" class="cap" text-anchor="middle">шина</text>
  </g>

  <g data-key="rom">
    <rect x="350" y="290" width="210" height="90" rx="10" class="bx"/>
    <text x="455" y="325" class="lbl" text-anchor="middle">ПЗУ (ROM)</text>
    <text x="455" y="350" class="cap" text-anchor="middle">прошивка BIOS/UEFI,</text>
    <text x="455" y="370" class="cap" text-anchor="middle">записана навсегда</text>
  </g>

  <g data-key="busrom">
    <path d="M 190 240 L 190 335 L 348 335" class="edge" marker-end="url(#cp-arw)"/>
    <text x="200" y="325" class="cap">читается при включении</text>
  </g>

  <g data-key="vol" data-only="1">
    <rect x="630" y="130" width="300" height="110" rx="10" class="br"/>
    <text x="648" y="165" class="lbl">Выключили питание</text>
    <text x="648" y="192" class="capr">ОЗУ — чистый лист</text>
    <text x="648" y="214" class="capr">всё несохранённое исчезло</text>
  </g>

  <g data-key="nonvol" data-only="1">
    <rect x="630" y="290" width="300" height="90" rx="10" class="bg"/>
    <text x="648" y="325" class="lbl">ПЗУ помнит всегда</text>
    <text x="648" y="352" class="capg">поэтому старт начинается с неё</text>
  </g>

  <g data-key="boot" data-only="1">
    <rect x="630" y="130" width="300" height="250" rx="10" class="bg"/>
    <text x="648" y="162" class="lbl">Холодный старт</text>
    <text x="648" y="196" class="cap">1 · питание есть, ОЗУ пуста</text>
    <text x="648" y="226" class="cap">2 · CPU читает команду из ПЗУ</text>
    <text x="648" y="256" class="cap">3 · прошивка проверяет железо</text>
    <text x="648" y="286" class="cap">4 · загрузчик тянет ОС в ОЗУ</text>
    <text x="648" y="316" class="cap">5 · дальше всё живёт в ОЗУ</text>
    <text x="648" y="352" class="capg">ПЗУ больше не нужно до перезагрузки</text>
  </g>

  <text x="60" y="462" class="legend">жёлтый — тот, кто работает · синий — память и данные · зелёный — то, что переживает выключение · красный — потеря</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="core" data-focus="core">
      <div class="step-kicker">Шаг 1 · что собираем</div>
      <h4>Внутри пунктира — то, что уже компьютер</h4>
      <p>Ни монитора, ни клавиатуры, ни диска мы пока не подключали. Тем не
      менее внутри этого контура помещается всё, что нужно, чтобы выполнять
      программу: исполнитель и его память.</p>
      <p>Всё остальное, что появится дальше, — это способы дать этому блоку
      данные снаружи и забрать у него результат.</p>
    </div>
    <div class="step-panel" data-on="core cpu" data-focus="cpu">
      <div class="step-kicker">Шаг 2 · исполнитель</div>
      <h4>Процессор: выбрать команду, выполнить, повторить</h4>
      <p>CPU не «думает» — он крутит один и тот же цикл: взял из памяти
      очередную команду, расшифровал, выполнил, взял следующую. Наш процессор
      делает это 3,2 миллиарда раз в секунду, то есть один такт длится
      0,3125 наносекунды.</p>
      <p>Заодно процессор управляет остальными устройствами: сам решает, когда
      к кому обратиться.</p>
    </div>
    <div class="step-panel" data-on="core cpu ram" data-focus="ram">
      <div class="step-kicker">Шаг 3 · рабочая память</div>
      <h4>ОЗУ: то, с чем процессор работает прямо сейчас</h4>
      <p>Оперативная память быстрая и энергозависимая. В ней лежат запущенные
      программы и их данные — открытый документ, состояние игрового мира,
      содержимое вкладок браузера.</p>
      <p>Типичный объём сегодня — 16–64 ГБ. Держать в ней всё содержимое диска
      незачем и не получится: она в сотни раз меньше и стоит в десятки раз
      дороже за гигабайт.</p>
    </div>
    <div class="step-panel" data-on="core cpu ram busram" data-focus="busram">
      <div class="step-kicker">Шаг 4 · связь</div>
      <h4>Между ними — постоянный обмен</h4>
      <p>Процессор напрямую связан с ОЗУ и обращается к ней непрерывно: читает
      команды, читает данные, записывает результаты. Это самый нагруженный
      маршрут в компьютере, и в части 3 мы разберём его до отдельных линий.</p>
      <p>Важная деталь: команды и данные лежат в <em>одной и той же</em> памяти
      и едут по одному и тому же пути. Из этого в части 4 вырастет главное
      ограничение всей конструкции.</p>
    </div>
    <div class="step-panel" data-on="core cpu ram busram rom busrom vol nonvol" data-focus="rom vol nonvol">
      <div class="step-kicker">Шаг 5 · вторая память</div>
      <h4>ПЗУ существует ради одного момента — включения</h4>
      <p>Разница между двумя памятями — не в скорости и не в объёме, а в сроке
      хранения. ОЗУ живёт, пока есть ток. ПЗУ переживает выключение.</p>
      <p>Именно поэтому нельзя обойтись одной: в момент включения ОЗУ пуста, и
      если бы первой команды не было в ПЗУ, процессору было бы буквально нечего
      выполнить.</p>
    </div>
    <div class="step-panel" data-on="core cpu ram busram rom busrom boot" data-focus="boot">
      <div class="step-kicker">Шаг 6 · порядок запуска</div>
      <h4>Пять шагов от нажатия кнопки до рабочего стола</h4>
      <p>Процессор начинает с фиксированного адреса в ПЗУ. Прошивка проверяет
      железо, находит загрузочный диск и переписывает начало операционной
      системы в ОЗУ. Дальше управление переходит к ОС, и ПЗУ до следующей
      перезагрузки не нужно.</p>
      <p>Обратите внимание на направление: данные всегда движутся <em>в</em> ОЗУ.
      Всё, что процессор собирается выполнять, сначала оказывается там.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> двух памятей в центральной части не
  потому, что инженеры любят сложность, а потому что у них разные обязанности —
  ОЗУ обслуживает работу, ПЗУ обслуживает старт, когда ОЗУ ещё нечем помочь.
</div>

---

## Часть 2. Периферия: четыре двери наружу

<p>
  Центральная часть умеет выполнять программу, но пока она полностью замкнута
  на себе: получить задачу ей неоткуда и показать результат некому. Всё, что
  находится за пределами центральной части и связывает компьютер с внешним
  миром, называется <strong>периферийными устройствами</strong>.
</p>

<p>
  Их удобно разложить не по видам разъёмов, а по задачам, которые они решают.
  Задач ровно четыре: получить информацию, отдать информацию, сохранить её
  надолго и передать её другой машине.
</p>

<div class="stage" id="stagePeri" tabindex="0">
  <div class="stage-figure">
<svg id="pf" viewBox="0 0 960 540" role="img" aria-label="Периферийные устройства вокруг центральной части: ввод, вывод, внешняя память, сеть">
  <style>
    #pf { font-family: Helvetica, Arial, sans-serif; }
    #pf .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #pf .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #pf .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #pf .bn  { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.6; stroke-dasharray: 7 6; }
    #pf .lbl { font-size: 17px; fill: #111111; }
    #pf .cap { font-size: 13.5px; fill: #5E5850; }
    #pf .sum { font-size: 15px; fill: #111111; }
    #pf .edge { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #pf .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="pf-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="center">
    <rect x="370" y="225" width="220" height="110" rx="12" class="bn"/>
    <text x="480" y="265" class="lbl" text-anchor="middle">Центральная часть</text>
    <text x="480" y="292" class="cap" text-anchor="middle">CPU · ОЗУ · ПЗУ</text>
    <text x="480" y="314" class="cap" text-anchor="middle">считает и помнит</text>
  </g>

  <g data-key="in">
    <rect x="50" y="70" width="250" height="100" rx="10" class="bx"/>
    <text x="175" y="108" class="lbl" text-anchor="middle">Устройства ввода</text>
    <text x="175" y="133" class="cap" text-anchor="middle">клавиатура, мышь, микрофон,</text>
    <text x="175" y="153" class="cap" text-anchor="middle">камера, сканер, датчики</text>
    <line x1="300" y1="140" x2="366" y2="232" class="edge" marker-end="url(#pf-arw)"/>
  </g>

  <g data-key="out">
    <rect x="660" y="70" width="250" height="100" rx="10" class="bg"/>
    <text x="785" y="108" class="lbl" text-anchor="middle">Устройства вывода</text>
    <text x="785" y="133" class="cap" text-anchor="middle">монитор, колонки,</text>
    <text x="785" y="153" class="cap" text-anchor="middle">принтер, проектор</text>
    <line x1="594" y1="232" x2="658" y2="140" class="edge" marker-end="url(#pf-arw)"/>
  </g>

  <g data-key="disk">
    <rect x="50" y="390" width="250" height="100" rx="10" class="bx"/>
    <text x="175" y="428" class="lbl" text-anchor="middle">Внешняя память</text>
    <text x="175" y="453" class="cap" text-anchor="middle">SSD, HDD, флешка</text>
    <text x="175" y="473" class="cap" text-anchor="middle">от 512 ГБ до нескольких ТБ</text>
    <line x1="300" y1="420" x2="366" y2="330" class="edge" marker-start="url(#pf-arw)" marker-end="url(#pf-arw)"/>
  </g>

  <g data-key="net">
    <rect x="660" y="390" width="250" height="100" rx="10" class="bx"/>
    <text x="785" y="428" class="lbl" text-anchor="middle">Сетевые устройства</text>
    <text x="785" y="453" class="cap" text-anchor="middle">Ethernet, Wi-Fi,</text>
    <text x="785" y="473" class="cap" text-anchor="middle">Bluetooth, модем</text>
    <line x1="594" y1="330" x2="658" y2="420" class="edge" marker-start="url(#pf-arw)" marker-end="url(#pf-arw)"/>
  </g>

  <g data-key="memcmp" data-only="1">
    <rect x="330" y="378" width="300" height="118" rx="10" class="by"/>
    <text x="348" y="406" class="cap">ОЗУ — пока есть ток, 16–64 ГБ</text>
    <text x="348" y="436" class="cap">ПЗУ — навсегда, но 16–128 МБ</text>
    <text x="348" y="466" class="cap">Диск — навсегда и сотни ГБ</text>
  </g>

  <g data-key="summary" data-only="1">
    <text x="480" y="204" class="sum" text-anchor="middle">ввод → обработка → вывод, а сбоку — хранение и сеть</text>
  </g>

  <text x="50" y="524" class="legend">синий — данные и хранение · зелёный — то, что выходит наружу к человеку · пунктир — уже собранная центральная часть</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="center" data-focus="center">
      <div class="step-kicker">Шаг 1 · исходная точка</div>
      <h4>Центральная часть свернулась до одного прямоугольника</h4>
      <p>Всё, что мы собрали в части 1, дальше будет жить внутри этой рамки:
      процессор, оперативная память, постоянная память. Внутрь мы больше не
      заглядываем — интереснее, что вокруг.</p>
      <p>Сама по себе она бесполезна: программу неоткуда взять и результат
      некому показать.</p>
    </div>
    <div class="step-panel" data-on="center in" data-focus="in">
      <div class="step-kicker">Шаг 2 · внутрь</div>
      <h4>Ввод: превратить действие человека в числа</h4>
      <p>Клавиатура, мышь, микрофон, камера — все они делают одно и то же:
      переводят событие внешнего мира в цифровой сигнал, понятный процессору.
      Нажатие клавиши становится кодом, звук — последовательностью чисел.</p>
      <p>Стрелка односторонняя: устройство ввода только отдаёт.</p>
    </div>
    <div class="step-panel" data-on="center in out" data-focus="out">
      <div class="step-kicker">Шаг 3 · наружу</div>
      <h4>Вывод: превратить числа обратно в понятное человеку</h4>
      <p>Монитор, колонки, принтер выполняют обратное преобразование: получают
      данные и превращают их в изображение, звук или текст на бумаге.</p>
      <p>Ввод и вывод — зеркальные операции, поэтому в схеме они стоят
      симметрично и рисуются разными цветами: синий вход, зелёный результат.</p>
    </div>
    <div class="step-panel" data-on="center in out disk memcmp" data-focus="disk memcmp">
      <div class="step-kicker">Шаг 4 · третья память</div>
      <h4>Внешняя память: третий вид хранения, и снова со своей ролью</h4>
      <p>В компьютере уже была память дважды, теперь она появляется в третий
      раз — и опять по другой причине. От ОЗУ внешняя память отличается тем,
      что переживает выключение. От ПЗУ — объёмом: сотни и тысячи гигабайт
      против десятков мегабайт, и записывать в неё можно свободно.</p>
      <p>К ПЗУ процессор обращается сразу после включения, к диску — уже после
      того, как заработала операционная система.</p>
    </div>
    <div class="step-panel" data-on="center in out disk net" data-focus="net">
      <div class="step-kicker">Шаг 5 · другие машины</div>
      <h4>Сеть: те же ввод и вывод, только собеседник — не человек</h4>
      <p>Сетевая карта, Wi-Fi-адаптер и модем передают данные другим
      компьютерам и принимают ответ. По сути это двусторонний ввод-вывод, у
      которого на том конце не человек, а такая же машина.</p>
      <p>Именно сюда в части 8 уйдёт информация о применённом заклинании — к
      другим игрокам.</p>
    </div>
    <div class="step-panel" data-on="center in out disk net summary" data-focus="summary">
      <div class="step-kicker">Шаг 6 · картина целиком</div>
      <h4>Четыре двери, и каждая закрывает свою нехватку</h4>
      <p>Ввод даёт задачу, вывод отдаёт ответ, внешняя память хранит то, что
      должно пережить выключение, сеть связывает с другими машинами. Пятого
      класса устройств не появляется: любая новая железка попадает в одну из
      этих категорий или сразу в две.</p>
      <p>Осталось решить последнюю проблему: пока что все эти блоки нарисованы
      рядом, но ничем не соединены.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> периферия делится не по разъёмам, а по
  четырём задачам — ввести, вывести, сохранить, передать; принтер и монитор
  оказываются в одной группе, а SSD и флешка — в другой, хотя разъёмы у них
  разные.
</div>

---

## Часть 3. Системная шина: адрес, данные, управление

<p>
  Блоки собраны, но между ними пустота. Не хватает магистрали, по которой они
  будут обмениваться данными, — <strong>системной шины</strong>. Современные
  компьютеры строятся по <strong>магистрально-модульному принципу</strong>:
  каждое устройство сделано отдельным модулем (платой или чипом), подключается
  к общей системе соединений и по ней разговаривает со всеми остальными.
  Отсюда и знаменитая открытость архитектуры: видеокарту можно поменять, не
  трогая всё остальное, потому что разговаривает она на общем языке шины.
</p>

<div class="callout-blue">
  <strong>Почему «шина», при чём тут автобус:</strong> по-английски эта общая
  линия называется <code>bus</code>. Термин закрепился в 1960-е, когда вместо
  индивидуальной проводки «точка-точка» между каждой парой блоков инженеры
  выделили одну общую магистраль: как автобус везёт много пассажиров по одному
  маршруту, так один набор проводов обслуживает много устройств. При переводе
  технической литературы в СССР кальку брать не стали, а взяли привычное
  инженерное слово «шина» — общая линия, к которой подключено всё оборудование.
  К автомобильным шинам это отношения не имеет.
</div>

<p>
  Одной линией дело не обходится: чтобы обмен состоялся, нужно сказать
  <em>куда</em>, <em>что</em> и <em>какую операцию</em> выполняем. Поэтому шина
  многосоставная и делится на три группы линий: <strong>шина адреса</strong>,
  <strong>шина данных</strong> и <strong>шина управления</strong>. Пройдём одно
  обращение к памяти по шагам и посчитаем, во что оно обходится.
</p>

<div class="stage" id="stageBus" tabindex="0">
  <div class="stage-figure">
<svg id="bs" viewBox="0 0 960 520" role="img" aria-label="Системная шина: линии адреса, данных и управления между процессором и памятью">
  <style>
    #bs { font-family: Helvetica, Arial, sans-serif; }
    #bs .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #bs .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #bs .bgr { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.4; }
    #bs .big { font-size: 21px; font-weight: 700; fill: #111111; }
    #bs .lbl { font-size: 15px; fill: #111111; }
    #bs .cap { font-size: 13.5px; fill: #5E5850; }
    #bs .capr { font-size: 14px; fill: #C30B0A; }
    #bs .capg { font-size: 14px; fill: #4d7a15; }
    #bs .mini { font-size: 12px; fill: #4d7a15; }
    #bs .wire { stroke: #3576C0; stroke-width: 3; fill: none; }
    #bs .wirey { stroke: #C29E08; stroke-width: 3; fill: none; }
    #bs .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #bs .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bs-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
    <marker id="bs-ary" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="bs-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="cpu">
    <rect x="40" y="120" width="170" height="170" rx="10" class="by"/>
    <text x="125" y="185" class="big" text-anchor="middle">CPU</text>
    <text x="125" y="212" class="cap" text-anchor="middle">кому-то что-то</text>
    <text x="125" y="232" class="cap" text-anchor="middle">от кого-то нужно</text>
  </g>

  <g data-key="mem">
    <rect x="750" y="120" width="170" height="170" rx="10" class="bx"/>
    <text x="835" y="185" class="big" text-anchor="middle">ОЗУ</text>
    <text x="835" y="212" class="cap" text-anchor="middle">миллиарды ячеек,</text>
    <text x="835" y="232" class="cap" text-anchor="middle">у каждой свой номер</text>
  </g>

  <g data-key="addr">
    <line x1="215" y1="155" x2="745" y2="155" class="wire" marker-end="url(#bs-arb)"/>
    <text x="480" y="143" class="lbl" text-anchor="middle">шина адреса · номер ячейки, только от процессора</text>
  </g>

  <g data-key="ctrl">
    <line x1="215" y1="255" x2="745" y2="255" class="wirey" marker-start="url(#bs-ary)" marker-end="url(#bs-ary)"/>
    <text x="480" y="243" class="lbl" text-anchor="middle">шина управления · «читаю» или «пишу», такт, подтверждение</text>
  </g>

  <g data-key="data">
    <line x1="215" y1="205" x2="745" y2="205" class="wire" marker-start="url(#bs-arb)" marker-end="url(#bs-arb)"/>
    <text x="480" y="193" class="lbl" text-anchor="middle">шина данных · 64 линии, в обе стороны</text>
  </g>

  <g data-key="mods">
    <line x1="325" y1="255" x2="325" y2="328" class="edge"/>
    <line x1="505" y1="255" x2="505" y2="328" class="edge"/>
    <line x1="685" y1="255" x2="685" y2="328" class="edge"/>
    <rect x="250" y="330" width="150" height="70" rx="9" class="bx"/>
    <text x="325" y="362" class="lbl" text-anchor="middle">видеокарта</text>
    <text x="325" y="384" class="cap" text-anchor="middle">модуль</text>
    <rect x="430" y="330" width="150" height="70" rx="9" class="bx"/>
    <text x="505" y="362" class="lbl" text-anchor="middle">звуковая карта</text>
    <text x="505" y="384" class="cap" text-anchor="middle">модуль</text>
    <rect x="610" y="330" width="150" height="70" rx="9" class="bx"/>
    <text x="685" y="362" class="lbl" text-anchor="middle">сетевая карта</text>
    <text x="685" y="384" class="cap" text-anchor="middle">модуль</text>
  </g>

  <g data-key="wait" data-only="1">
    <text x="40" y="440" class="capr">Между «прошу ячейку» и «держи данные» проходит около 80 нс — это 256 тактов, которые процессор просто ждёт.</text>
  </g>

  <g data-key="burst" data-only="1">
    <rect x="250" y="214" width="50" height="18" rx="4" class="bgr"/>
    <rect x="310" y="214" width="50" height="18" rx="4" class="bgr"/>
    <rect x="370" y="214" width="50" height="18" rx="4" class="bgr"/>
    <rect x="430" y="214" width="50" height="18" rx="4" class="bgr"/>
    <rect x="490" y="214" width="50" height="18" rx="4" class="bgr"/>
    <rect x="550" y="214" width="50" height="18" rx="4" class="bgr"/>
    <rect x="610" y="214" width="50" height="18" rx="4" class="bgr"/>
    <rect x="670" y="214" width="50" height="18" rx="4" class="bgr"/>
    <text x="275" y="228" class="mini" text-anchor="middle">8 Б</text>
    <text x="335" y="228" class="mini" text-anchor="middle">8 Б</text>
    <text x="395" y="228" class="mini" text-anchor="middle">8 Б</text>
    <text x="455" y="228" class="mini" text-anchor="middle">8 Б</text>
    <text x="515" y="228" class="mini" text-anchor="middle">8 Б</text>
    <text x="575" y="228" class="mini" text-anchor="middle">8 Б</text>
    <text x="635" y="228" class="mini" text-anchor="middle">8 Б</text>
    <text x="695" y="228" class="mini" text-anchor="middle">8 Б</text>
    <text x="40" y="470" class="capg">Зато сами 64 байта уезжают за 1,25 нс: 8 передач по 8 байт. Ожидание — 98,5% всего времени обращения.</text>
  </g>

  <text x="40" y="502" class="legend">синий — адреса и данные · жёлтый — управляющие сигналы · зелёный — полезная передача · красный — потерянное время</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="cpu mem" data-focus="cpu mem">
      <div class="step-kicker">Шаг 1 · задача</div>
      <h4>Процессору нужна ячейка памяти — а как её попросить?</h4>
      <p>Память — это миллиарды ячеек, у каждой свой номер (адрес). Чтобы
      получить содержимое одной из них, мало протянуть провод: нужно как-то
      сообщить номер, дождаться ответа и понять, что ответ пришёл.</p>
      <p>Отсюда и три группы линий, которые мы сейчас добавим по одной.</p>
    </div>
    <div class="step-panel" data-on="cpu mem addr" data-focus="addr">
      <div class="step-kicker">Шаг 2 · куда</div>
      <h4>Шина адреса: номер ячейки, и только в одну сторону</h4>
      <p>По ней процессор передаёт адрес ячейки памяти или порта устройства, с
      которым хочет работать. Направление всегда одно — от процессора: память
      сама никогда не решает, к чему обратиться.</p>
      <p>Разрядность адресной шины задаёт, сколько ячеек вообще можно
      пронумеровать: 32 линии — это 4 ГБ адресов, поэтому 32-битные системы и
      упирались в этот потолок.</p>
    </div>
    <div class="step-panel" data-on="cpu mem addr ctrl" data-focus="ctrl">
      <div class="step-kicker">Шаг 3 · что делаем</div>
      <h4>Шина управления: «читаю», «пишу», «готово»</h4>
      <p>Один и тот же адрес означает разное в зависимости от операции. По
      линиям управления идут сигналы чтения и записи, тактовые импульсы,
      подтверждения — всё, что позволяет устройствам понимать, какая операция
      сейчас выполняется и когда она завершена.</p>
      <p>Без этой группы линий адрес и данные превратились бы в шум: непонятно,
      кто говорит и в какой момент.</p>
    </div>
    <div class="step-panel" data-on="cpu mem addr ctrl data" data-focus="data">
      <div class="step-kicker">Шаг 4 · что везём</div>
      <h4>Шина данных: единственная двусторонняя из трёх</h4>
      <p>По ней едет содержимое ячеек. При чтении данные текут от памяти к
      процессору, при записи — обратно. В нашем компьютере это 64 линии, то
      есть за одну передачу проходит 8 байт.</p>
      <p>Память DDR5-6400 делает 6,4 миллиарда передач в секунду, и каждая
      передача — это 8 байт:</p>
      <div class="math-display" data-tex="8\ \text{Б} \times 6{,}4\cdot 10^{9}\ \text{1/с} = 51{,}2\ \text{ГБ/с на канал}"></div>
      <p>В двух каналах — 102,4 ГБ/с.</p>
    </div>
    <div class="step-panel" data-on="cpu mem addr ctrl data mods" data-focus="mods">
      <div class="step-kicker">Шаг 5 · почему магистраль</div>
      <h4>К тем же линиям подключается всё остальное</h4>
      <p>Главная выгода общей магистрали в том, что новое устройство не требует
      новых проводов до каждого соседа: достаточно подключиться к шине и
      соблюдать её протокол. Так компьютер и стал модульным — с заменяемой
      видеокартой, добавляемой сетевой картой, расширяемой памятью.</p>
      <p>Плата за это тоже понятна: линии общие, и в один момент времени
      говорить по ним может кто-то один.</p>
    </div>
    <div class="step-panel" data-on="cpu mem addr ctrl data mods wait" data-focus="wait">
      <div class="step-kicker">Шаг 6 · цена обращения</div>
      <h4>Самое дорогое в обращении к памяти — ожидание</h4>
      <p>Отправить адрес и дождаться данных занимает около 80 наносекунд. Для
      человека — ничто, для процессора с тактом 0,3125 нс — 256 тактов, за
      которые он мог бы выполнить сотни команд.</p>
      <p>Это не дефект конкретной платы, а физика: память большая, и найти в
      ней нужную строку быстрее пока не выходит.</p>
    </div>
    <div class="step-panel" data-on="cpu mem addr ctrl data mods burst" data-focus="burst">
      <div class="step-kicker">Шаг 7 · вывод из числа</div>
      <h4>Раз ждать всё равно, то возить нужно помногу</h4>
      <p>Сама передача 64 байт занимает 1,25 нс — восемь передач по 8 байт
      подряд. На фоне 80 нс ожидания это 1,5% времени: почти всё обращение —
      это ожидание, а не перевозка.</p>
      <p>Отсюда важнейшее следствие: память всегда отдаёт не байт, а целую
      порцию в 64 байта (кэш-линию). Раз уж мы разбудили память, глупо уносить
      из неё один байт.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> шина — это не «провод», а протокол из
  трёх групп линий, и её главная характеристика не ширина, а задержка: 98,5%
  обращения к памяти процессор проводит в ожидании.
</div>

---

## Часть 4. Фон Нейман: хранимая программа и её узкое место

<p>
  Схема, которую мы только что собрали, — это классическая
  <strong>архитектура фон Неймана</strong> (её же называют принстонской),
  сформулированная в середине 1940-х. Её ключевая идея звучит сегодня банально,
  а тогда была революцией: программа хранится в той же памяти, что и данные.
</p>

<p>
  До этого программу задавали физически — переключателями, штекерами,
  перепайкой. <strong>Концепция хранимой программы</strong> (stored-program
  concept) превратила программу в такие же числа в памяти, как и всё остальное.
  Процессор поочерёдно читает команды, расшифровывает их и выполняет, работая
  с данными, лежащими в той же памяти. Именно поэтому компьютер стал
  универсальным: чтобы он делал другое, достаточно положить в память другие
  числа.
</p>

<p>
  Но у этой красоты есть встроенная плата, и её видно прямо на схеме.
</p>

<div class="stage" id="stageVN" tabindex="0">
  <div class="stage-figure">
<svg id="vn" viewBox="0 0 960 560" role="img" aria-label="Архитектура фон Неймана: процессор, единая память, общая шина и очередь обращений">
  <style>
    #vn { font-family: Helvetica, Arial, sans-serif; }
    #vn .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #vn .bxi { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.4; }
    #vn .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #vn .byi { fill: #FFFFFF; stroke: #C29E08; stroke-width: 1.4; }
    #vn .lbl { font-size: 16px; fill: #111111; }
    #vn .hdr { font-size: 15px; fill: #5E5850; }
    #vn .cap { font-size: 12.5px; fill: #5E5850; }
    #vn .cell { font-size: 15px; fill: #111111; }
    #vn .capr { font-size: 13px; fill: #C30B0A; }
    #vn .costr { font-size: 14px; fill: #C30B0A; }
    #vn .wire { stroke: #5E5850; stroke-width: 4; fill: none; }
    #vn .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #vn .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="vn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="mem">
    <rect x="620" y="110" width="280" height="220" rx="12" class="bx"/>
    <text x="760" y="134" class="hdr" text-anchor="middle">одна память на всё</text>
    <rect x="645" y="145" width="230" height="70" rx="8" class="bxi"/>
    <text x="760" y="178" class="lbl" text-anchor="middle">команды программы</text>
    <text x="760" y="200" class="cap" text-anchor="middle">процессор их выбирает по очереди</text>
    <rect x="645" y="235" width="230" height="70" rx="8" class="bxi"/>
    <text x="760" y="268" class="lbl" text-anchor="middle">данные программы</text>
    <text x="760" y="290" class="cap" text-anchor="middle">их же процессор читает и пишет</text>
  </g>

  <g data-key="cpu">
    <rect x="60" y="110" width="280" height="220" rx="12" class="by"/>
    <text x="200" y="134" class="hdr" text-anchor="middle">процессор (CPU)</text>
    <rect x="85" y="145" width="110" height="60" rx="8" class="byi"/>
    <text x="140" y="172" class="lbl" text-anchor="middle">УУ</text>
    <text x="140" y="192" class="cap" text-anchor="middle">управление</text>
    <rect x="205" y="145" width="110" height="60" rx="8" class="byi"/>
    <text x="260" y="172" class="lbl" text-anchor="middle">АЛУ</text>
    <text x="260" y="192" class="cap" text-anchor="middle">арифметика</text>
    <rect x="85" y="230" width="230" height="60" rx="8" class="byi"/>
    <text x="200" y="257" class="lbl" text-anchor="middle">регистры</text>
    <text x="200" y="278" class="cap" text-anchor="middle">несколько ячеек прямо внутри CPU</text>
  </g>

  <g data-key="bus">
    <line x1="344" y1="220" x2="616" y2="220" class="wire" marker-start="url(#vn-arw)" marker-end="url(#vn-arw)"/>
    <text x="480" y="205" class="lbl" text-anchor="middle">одна шина</text>
    <text x="480" y="248" class="cap" text-anchor="middle">и команды, и данные едут здесь</text>
  </g>

  <g data-key="cycle">
    <rect x="60" y="360" width="210" height="44" rx="22" class="byi"/>
    <text x="165" y="388" class="cell" text-anchor="middle">1 · выбрать команду</text>
    <line x1="272" y1="382" x2="286" y2="382" class="edge" marker-end="url(#vn-arw)"/>
    <rect x="290" y="360" width="180" height="44" rx="22" class="byi"/>
    <text x="380" y="388" class="cell" text-anchor="middle">2 · расшифровать</text>
    <line x1="472" y1="382" x2="486" y2="382" class="edge" marker-end="url(#vn-arw)"/>
    <rect x="490" y="360" width="160" height="44" rx="22" class="byi"/>
    <text x="570" y="388" class="cell" text-anchor="middle">3 · выполнить</text>
    <line x1="652" y1="382" x2="666" y2="382" class="edge" marker-end="url(#vn-arw)"/>
    <rect x="670" y="360" width="230" height="44" rx="22" class="byi"/>
    <text x="785" y="388" class="cell" text-anchor="middle">4 · записать результат</text>
  </g>

  <g data-key="conflict" data-only="1">
    <text x="480" y="277" class="capr" text-anchor="middle">в один такт по шине проходит что-то одно</text>
  </g>

  <g data-key="tl">
    <text x="60" y="432" class="cap">очередь на одной шине, такт за тактом — К: команда, Д: данные</text>
    <rect x="60" y="440" width="70" height="40" rx="7" class="byi"/>
    <text x="95" y="466" class="cell" text-anchor="middle">К</text>
    <rect x="138" y="440" width="70" height="40" rx="7" class="bxi"/>
    <text x="173" y="466" class="cell" text-anchor="middle">Д</text>
    <rect x="216" y="440" width="70" height="40" rx="7" class="byi"/>
    <text x="251" y="466" class="cell" text-anchor="middle">К</text>
    <rect x="294" y="440" width="70" height="40" rx="7" class="byi"/>
    <text x="329" y="466" class="cell" text-anchor="middle">К</text>
    <rect x="372" y="440" width="70" height="40" rx="7" class="bxi"/>
    <text x="407" y="466" class="cell" text-anchor="middle">Д</text>
    <rect x="450" y="440" width="70" height="40" rx="7" class="byi"/>
    <text x="485" y="466" class="cell" text-anchor="middle">К</text>
    <rect x="528" y="440" width="70" height="40" rx="7" class="bxi"/>
    <text x="563" y="466" class="cell" text-anchor="middle">Д</text>
    <rect x="606" y="440" width="70" height="40" rx="7" class="byi"/>
    <text x="641" y="466" class="cell" text-anchor="middle">К</text>
    <rect x="684" y="440" width="70" height="40" rx="7" class="byi"/>
    <text x="719" y="466" class="cell" text-anchor="middle">К</text>
    <rect x="762" y="440" width="70" height="40" rx="7" class="bxi"/>
    <text x="797" y="466" class="cell" text-anchor="middle">Д</text>
  </g>

  <g data-key="cost" data-only="1">
    <text x="60" y="512" class="costr">Примерно каждая третья команда лезет за данными: на 100 команд получается около 135 поездок по одной шине.</text>
  </g>

  <text x="60" y="542" class="legend">жёлтый — работа процессора и выборка команд · синий — данные · красный — то, из-за чего теряется время</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="mem" data-focus="mem">
      <div class="step-kicker">Шаг 1 · главная идея</div>
      <h4>Команды и данные лежат вперемешку в одной памяти</h4>
      <p>Для памяти нет разницы между числом 42 и командой «сложи два
      регистра»: и то и другое — просто набор бит в ячейке. Разницу создаёт
      только то, как процессор эти биты прочитает.</p>
      <p>Отсюда универсальность: одна и та же машина считает зарплату, играет в
      «Доту» и правит текст — меняется лишь содержимое памяти.</p>
    </div>
    <div class="step-panel" data-on="mem cpu" data-focus="cpu">
      <div class="step-kicker">Шаг 2 · что внутри процессора</div>
      <h4>Три части: управление, арифметика и несколько своих ячеек</h4>
      <p>Устройство управления решает, какая команда следующая и кому подать
      сигнал. Арифметико-логическое устройство считает. Регистры — крошечная
      собственная память процессора, буквально несколько десятков ячеек, зато
      доступных за один такт.</p>
      <p>Регистры — это ещё один, четвёртый вид памяти в компьютере. Он самый
      быстрый и самый маленький.</p>
    </div>
    <div class="step-panel" data-on="mem cpu cycle" data-focus="cycle">
      <div class="step-kicker">Шаг 3 · рабочий цикл</div>
      <h4>Выбрать → расшифровать → выполнить → записать</h4>
      <p>Этот цикл повторяется миллиарды раз в секунду и не меняется с 1940-х
      годов. Первый шаг всегда одинаков: сходить в память за очередной командой,
      потому что программа лежит именно там.</p>
      <p>Заметьте: поход в память есть в цикле <em>всегда</em>, даже если
      команда ничего не считает.</p>
    </div>
    <div class="step-panel" data-on="mem cpu cycle bus" data-focus="bus">
      <div class="step-kicker">Шаг 4 · один маршрут</div>
      <h4>Обе поездки идут по одной и той же шине</h4>
      <p>Выборка команды — это обращение к памяти. Чтение данных — тоже
      обращение к памяти. Линии у них общие, потому что и лежат они в одной
      памяти.</p>
      <p>Пока команд мало, это никого не смущало: в 1940-е процессор был
      медленнее памяти, а не быстрее.</p>
    </div>
    <div class="step-panel" data-on="mem cpu cycle bus conflict" data-focus="conflict">
      <div class="step-kicker">Шаг 5 · конфликт</div>
      <h4>Одновременно взять команду и данные нельзя</h4>
      <p>Шина одна, и в каждый момент по ней идёт что-то одно. Если процессор
      сейчас тянет данные, выборка следующей команды ждёт, и наоборот.</p>
      <p>Это и есть <strong>узкое место фон Неймана</strong>: скорость всей
      системы определяется пропускной способностью канала к памяти, а не
      скоростью вычислений.</p>
    </div>
    <div class="step-panel" data-on="mem cpu cycle bus tl" data-focus="tl">
      <div class="step-kicker">Шаг 6 · как это выглядит во времени</div>
      <h4>Очередь: К, Д, К, К, Д…</h4>
      <p>Каждая клетка — одно занятие шины. Команды идут всегда, обращения за
      данными вклиниваются между ними. Чем плотнее программа работает с
      памятью, тем длиннее очередь.</p>
      <p>Процессор при этом не занят — он ждёт своей клетки.</p>
    </div>
    <div class="step-panel" data-on="mem cpu cycle bus tl cost" data-focus="cost">
      <div class="step-kicker">Шаг 7 · цена в числах</div>
      <h4>Около трети команд обращается к данным — это плюс треть поездок</h4>
      <p>Если считать, что данные читает или пишет примерно каждая третья
      команда, то на 100 команд приходится около 135 занятий шины вместо 100.
      Треть работы канала уходит просто на то, что маршрут общий.</p>
      <p>Дальше вся история архитектуры — это попытки убрать этот лишний
      процент, не отказываясь от удобства хранимой программы.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-red">
  <strong>Где именно ломается:</strong> узкое место фон Неймана — это не «шина
  узкая», а «шина одна». Расширение шины помогает возить больше за раз, но не
  снимает очередь: команда и данные всё равно едут друг за другом.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> хранимая программа дала компьютеру
  универсальность и сразу же — конкуренцию за единственный канал к памяти;
  всё, что мы увидим дальше, придумано ради этого конфликта.
</div>

---

## Часть 5. Гарвард и смешанная архитектура: кэши внутри

<p>
  Альтернатива появилась почти одновременно с фоннеймановской. В
  <strong>гарвардской архитектуре</strong> команды и данные хранятся раздельно —
  в разных модулях памяти, с раздельными шинами. Принцип реализовали в
  гарвардском Mark I Говарда Эйкена в конце 1930-х, оттуда и название.
</p>

<p>
  Выигрыш прямой: процессор может в один такт получать новую команду и
  одновременно обмениваться данными — очереди из части 4 просто нет. Проигрыш
  тоже прямой: две подсистемы памяти, вдвое больше линий, более сложное
  управление. В ранние годы это было дорого, поэтому компьютеры общего
  назначения пошли по более простому фоннеймановскому пути, а чистый Гарвард
  остался в нишах — специализированные контроллеры, сигнальные процессоры,
  ранние микроконтроллеры.
</p>

<p>
  А потом инженеры сделали ход, который сегодня стоит в каждом процессоре:
  взяли обе схемы и сложили их слоями.
</p>

<div class="stage" id="stageHarv" tabindex="0">
  <div class="stage-figure">
<svg id="hv" viewBox="0 0 960 580" role="img" aria-label="Сравнение архитектур: фон Нейман, Гарвард и смешанная с кэшами команд и данных">
  <style>
    #hv { font-family: Helvetica, Arial, sans-serif; }
    #hv .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #hv .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #hv .byi { fill: #FFFFFF; stroke: #C29E08; stroke-width: 1.4; }
    #hv .ttl { font-size: 16px; font-weight: 700; fill: #111111; }
    #hv .sub { font-size: 12.5px; fill: #5E5850; }
    #hv .big { font-size: 18px; font-weight: 700; fill: #111111; }
    #hv .lbl { font-size: 15px; fill: #111111; }
    #hv .cap { font-size: 12.5px; fill: #5E5850; }
    #hv .capr { font-size: 13px; fill: #C30B0A; }
    #hv .capg { font-size: 13.5px; fill: #4d7a15; }
    #hv .capb { font-size: 13px; fill: #2a5e9b; }
    #hv .wire { stroke: #5E5850; stroke-width: 3.5; fill: none; }
    #hv .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="hv-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="vnc">
    <text x="170" y="120" class="ttl" text-anchor="middle">фон Нейман</text>
    <rect x="90" y="150" width="160" height="70" rx="9" class="by"/>
    <text x="170" y="192" class="big" text-anchor="middle">CPU</text>
    <line x1="170" y1="222" x2="170" y2="296" class="wire" marker-start="url(#hv-arw)" marker-end="url(#hv-arw)"/>
    <text x="182" y="265" class="cap">одна шина</text>
    <rect x="90" y="300" width="160" height="90" rx="9" class="bx"/>
    <text x="170" y="334" class="lbl" text-anchor="middle">команды</text>
    <text x="170" y="360" class="lbl" text-anchor="middle">+ данные</text>
  </g>

  <g data-key="hrv">
    <text x="480" y="120" class="ttl" text-anchor="middle">Гарвард</text>
    <rect x="400" y="150" width="160" height="70" rx="9" class="by"/>
    <text x="480" y="192" class="big" text-anchor="middle">CPU</text>
    <line x1="430" y1="222" x2="405" y2="296" class="wire" marker-start="url(#hv-arw)" marker-end="url(#hv-arw)"/>
    <line x1="530" y1="222" x2="555" y2="296" class="wire" marker-start="url(#hv-arw)" marker-end="url(#hv-arw)"/>
    <text x="480" y="268" class="cap" text-anchor="middle">две шины</text>
    <rect x="340" y="300" width="130" height="90" rx="9" class="bx"/>
    <text x="405" y="334" class="lbl" text-anchor="middle">команды</text>
    <text x="405" y="360" class="cap" text-anchor="middle">своя память</text>
    <rect x="490" y="300" width="130" height="90" rx="9" class="bx"/>
    <text x="555" y="334" class="lbl" text-anchor="middle">данные</text>
    <text x="555" y="360" class="cap" text-anchor="middle">своя память</text>
  </g>

  <g data-key="mix">
    <text x="800" y="105" class="ttl" text-anchor="middle">смешанная</text>
    <text x="800" y="126" class="sub" text-anchor="middle">модифицированная гарвардская</text>
    <rect x="700" y="150" width="200" height="120" rx="10" class="by"/>
    <text x="800" y="176" class="lbl" text-anchor="middle">CPU</text>
    <rect x="715" y="190" width="80" height="55" rx="7" class="byi"/>
    <text x="755" y="213" class="cap" text-anchor="middle">i-кэш</text>
    <text x="755" y="233" class="cap" text-anchor="middle">команды</text>
    <rect x="805" y="190" width="80" height="55" rx="7" class="byi"/>
    <text x="845" y="213" class="cap" text-anchor="middle">d-кэш</text>
    <text x="845" y="233" class="cap" text-anchor="middle">данные</text>
    <line x1="800" y1="272" x2="800" y2="336" class="wire" marker-start="url(#hv-arw)" marker-end="url(#hv-arw)"/>
    <text x="812" y="310" class="cap">одна шина наружу</text>
    <rect x="720" y="340" width="160" height="90" rx="9" class="bx"/>
    <text x="800" y="374" class="lbl" text-anchor="middle">одна память</text>
    <text x="800" y="400" class="cap" text-anchor="middle">команды + данные</text>
  </g>

  <g data-key="cost" data-only="1">
    <text x="340" y="462" class="capr">Две памяти и вдвое больше линий связи — в 1940-е это было слишком дорого.</text>
  </g>

  <g data-key="where" data-only="1">
    <text x="340" y="486" class="capb">Поэтому чистый Гарвард ушёл в микроконтроллеры и сигнальные процессоры.</text>
  </g>

  <g data-key="nums" data-only="1">
    <text x="560" y="512" class="capb">95% попаданий в кэш → в среднем 16,6 такта на обращение</text>
    <text x="560" y="535" class="capb">99% попаданий → 6,52 такта вместо 256 без кэша</text>
  </g>

  <g data-key="pview" data-only="1">
    <text x="40" y="512" class="capg">Программисту по-прежнему видна одна память,</text>
    <text x="40" y="535" class="capg">разделение спрятано внутри процессора.</text>
  </g>

  <text x="40" y="562" class="legend">жёлтый — процессор и его быстрая память · синий — основная память и шины · красный — цена решения</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="vnc" data-focus="vnc">
      <div class="step-kicker">Шаг 1 · точка отсчёта</div>
      <h4>Слева — то, что мы уже собрали</h4>
      <p>Одна память, одна шина, очередь из команд и данных. Простая и дешёвая
      конструкция, ставшая стандартом для первых поколений ЭВМ.</p>
      <p>Держите эту картинку в голове: две следующие схемы отличаются от неё
      ровно одной деталью каждая.</p>
    </div>
    <div class="step-panel" data-on="vnc hrv" data-focus="hrv">
      <div class="step-kicker">Шаг 2 · разделение</div>
      <h4>Гарвард: два хранилища и две дороги</h4>
      <p>Команды лежат в одной памяти, данные — в другой, у каждой свой канал.
      Теперь выборка следующей команды и чтение данных происходят
      одновременно, и очередь из прошлой сцены исчезает.</p>
      <p>Программу при этом нельзя просто так изменить как данные: она в другой
      памяти, и это одновременно защита и ограничение.</p>
    </div>
    <div class="step-panel" data-on="vnc hrv cost" data-focus="cost">
      <div class="step-kicker">Шаг 3 · цена</div>
      <h4>Скорость покупается удвоением железа</h4>
      <p>Две подсистемы памяти означают вдвое больше линий связи, отдельные
      контроллеры и более сложное управление. В эпоху, когда каждый килобайт
      памяти был дорог, это перевешивало выигрыш.</p>
      <p>Классическая инженерная развилка: простая схема, которая тормозит, или
      быстрая, которую не окупить.</p>
    </div>
    <div class="step-panel" data-on="vnc hrv cost where" data-focus="where">
      <div class="step-kicker">Шаг 4 · где прижилось</div>
      <h4>Ниши, где программа не меняется</h4>
      <p>В микроконтроллере стиральной машины или в сигнальном процессоре
      программа зашита раз и навсегда, а поток данных плотный. Там раздельные
      памяти — идеальный вариант, и лишней гибкости не жалко.</p>
      <p>А вот компьютеру общего назначения нужно уметь запускать любую
      программу, которую пользователь только что скачал.</p>
    </div>
    <div class="step-panel" data-on="vnc hrv mix" data-focus="mix">
      <div class="step-kicker">Шаг 5 · компромисс</div>
      <h4>Снаружи фон Нейман, внутри Гарвард</h4>
      <p>Современный процессор держит внутри себя <strong>кэш</strong> — очень
      быструю память небольшого объёма, где лежат копии часто используемых
      команд и данных. И кэш этот раздельный: i-кэш для инструкций, d-кэш для
      данных, у каждого свой путь внутри процессора.</p>
      <p>Снаружи память остаётся одна: программная модель не меняется, а
      конфликт двух потоков решается там, где он мешает больше всего.</p>
    </div>
    <div class="step-panel" data-on="vnc hrv mix nums" data-focus="nums">
      <div class="step-kicker">Шаг 6 · сколько это даёт</div>
      <h4>Всё держится на том, что попадания почти всегда</h4>
      <p>Обращение к кэшу первого уровня стоит около 4 тактов, промах — все
      256. Среднее обращение при доле попаданий <code>p</code> считается так:</p>
      <div class="math-display" data-tex="\bar{t} = p\cdot 4 + (1-p)\cdot 256"></div>
      <p>При <code>p = 0,95</code> получается 16,6 такта, при
      <code>p = 0,99</code> — 6,52 такта.</p>
      <p>Сравните с 256 тактами без кэша: почти сорокакратная разница возникает
      не из-за более быстрых проводов, а из-за того, что до проводов дело чаще
      всего не доходит.</p>
    </div>
    <div class="step-panel" data-on="vnc hrv mix nums pview" data-focus="pview">
      <div class="step-kicker">Шаг 7 · что видит программист</div>
      <h4>Вся эта кухня снаружи не видна</h4>
      <p>С точки зрения программы память по-прежнему одна и непрерывна: код и
      данные живут в общем адресном пространстве. Кэши, их разделение и
      подкачка строк по 64 байта — забота процессора.</p>
      <p>Именно так и выглядят почти все современные CPU — Intel, AMD, ARM, а
      также GPU и цифровые сигнальные процессоры.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-blue">
  <strong>Кэш — не от слова cash:</strong> написание <code>cache</code> идёт от
  французского <em>cacher</em> — прятать. Это спрятанный от программиста запас
  недавно использованных данных, а не наличные.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> современный процессор не выбирает между
  фон Нейманом и Гарвардом — он снаружи фоннеймановский ради удобства, а внутри
  гарвардский ради скорости, и весь выигрыш держится на высокой доле попаданий
  в кэш.
</div>

---

## Часть 6. Лестница скоростей: откуда взялась вся конструкция

<p>
  Мы несколько раз натыкались на числа: 256 тактов до ОЗУ, 4 такта до кэша,
  98,5% времени в ожидании. Пора выложить их в один ряд — потому что именно
  этот ряд объясняет всю остальную схему компьютера.
</p>

<p>
  Возьмём наш процессор с тактовой частотой 3,2 ГГц. Один такт — 0,3125
  наносекунды. Дальше мы просто пересчитаем время доступа к каждому виду
  памяти в тактах: во что обходится процессору поход в ту или иную сторону.
</p>

<div class="stage" id="stageHier" tabindex="0">
  <div class="stage-figure">
<svg id="hr" viewBox="0 0 960 540" role="img" aria-label="Логарифмическая шкала задержек: регистры, кэши, оперативная память, накопители, сеть">
  <style>
    #hr { font-family: Helvetica, Arial, sans-serif; }
    #hr .b1 { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #hr .b2 { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #hr .b3 { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #hr .val { font-size: 12.5px; fill: #5E5850; }
    #hr .tick { font-size: 12.5px; fill: #111111; }
    #hr .nm  { font-size: 14px; fill: #111111; }
    #hr .hd  { font-size: 13px; fill: #5E5850; }
    #hr .hu  { font-size: 12.5px; fill: #2a5e9b; }
    #hr .cap { font-size: 13px; fill: #5E5850; }
    #hr .capg { font-size: 14px; fill: #4d7a15; }
    #hr .base { stroke: #5E5850; stroke-width: 1.4; }
    #hr .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <text x="30" y="32" class="cap">сколько процессор ждёт ответа · высота столбика растёт логарифмически</text>
  <line x1="20" y1="400" x2="940" y2="400" class="base"/>

  <g data-key="regs">
    <rect x="30" y="381" width="100" height="19" class="b1"/>
    <text x="80" y="355" class="val" text-anchor="middle">0,3 нс</text>
    <text x="80" y="372" class="tick" text-anchor="middle">1 такт</text>
    <text x="80" y="422" class="nm" text-anchor="middle">регистры</text>
  </g>

  <g data-key="caches">
    <rect x="145" y="358" width="100" height="42" class="b1"/>
    <text x="195" y="332" class="val" text-anchor="middle">1,25 нс</text>
    <text x="195" y="349" class="tick" text-anchor="middle">4 такта</text>
    <text x="195" y="422" class="nm" text-anchor="middle">кэш L1</text>
    <rect x="260" y="338" width="100" height="62" class="b1"/>
    <text x="310" y="312" class="val" text-anchor="middle">4,4 нс</text>
    <text x="310" y="329" class="tick" text-anchor="middle">14 тактов</text>
    <text x="310" y="422" class="nm" text-anchor="middle">кэш L2</text>
    <rect x="375" y="320" width="100" height="80" class="b1"/>
    <text x="425" y="294" class="val" text-anchor="middle">12,5 нс</text>
    <text x="425" y="311" class="tick" text-anchor="middle">40 тактов</text>
    <text x="425" y="422" class="nm" text-anchor="middle">кэш L3</text>
  </g>

  <g data-key="ram">
    <rect x="490" y="290" width="100" height="110" class="b2"/>
    <text x="540" y="264" class="val" text-anchor="middle">80 нс</text>
    <text x="540" y="281" class="tick" text-anchor="middle">256 тактов</text>
    <text x="540" y="422" class="nm" text-anchor="middle">ОЗУ</text>
  </g>

  <g data-key="disk">
    <rect x="605" y="172" width="100" height="228" class="b2"/>
    <text x="655" y="146" class="val" text-anchor="middle">0,1 мс</text>
    <text x="655" y="163" class="tick" text-anchor="middle">320 тыс. тактов</text>
    <text x="655" y="422" class="nm" text-anchor="middle">NVMe SSD</text>
    <rect x="720" y="100" width="100" height="300" class="b3"/>
    <text x="770" y="74" class="val" text-anchor="middle">8 мс</text>
    <text x="770" y="91" class="tick" text-anchor="middle">25,6 млн тактов</text>
    <text x="770" y="422" class="nm" text-anchor="middle">жёсткий диск</text>
  </g>

  <g data-key="net">
    <rect x="835" y="78" width="100" height="322" class="b3"/>
    <text x="885" y="52" class="val" text-anchor="middle">30 мс</text>
    <text x="885" y="69" class="tick" text-anchor="middle">96 млн тактов</text>
    <text x="885" y="422" class="nm" text-anchor="middle">сеть, пинг</text>
  </g>

  <g data-key="human" data-only="1">
    <text x="30" y="448" class="hd">а теперь представим, что один такт процессора длится одну секунду:</text>
    <text x="80" y="472" class="hu" text-anchor="middle">1 секунда</text>
    <text x="195" y="472" class="hu" text-anchor="middle">4 секунды</text>
    <text x="310" y="472" class="hu" text-anchor="middle">14 секунд</text>
    <text x="425" y="472" class="hu" text-anchor="middle">40 секунд</text>
    <text x="540" y="472" class="hu" text-anchor="middle">4 минуты</text>
    <text x="655" y="472" class="hu" text-anchor="middle">3,7 дня</text>
    <text x="770" y="472" class="hu" text-anchor="middle">296 дней</text>
    <text x="885" y="472" class="hu" text-anchor="middle">3 года</text>
  </g>

  <g data-key="rule" data-only="1">
    <text x="30" y="500" class="capg">Вся архитектура компьютера — способ почаще оставаться в левой половине этой шкалы.</text>
  </g>

  <text x="30" y="526" class="legend">жёлтый — память внутри процессора · синий — память снаружи · красный — то, что измеряется миллисекундами</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="regs" data-focus="regs">
      <div class="step-kicker">Шаг 1 · нулевая отметка</div>
      <h4>Регистры: данные уже на месте</h4>
      <p>Несколько десятков ячеек прямо в процессоре. Обращение к ним ничего не
      стоит: значение доступно в том же такте, в котором понадобилось.</p>
      <p>Это наш эталон. Всё остальное на шкале измеряется в том, во сколько раз
      оно медленнее.</p>
    </div>
    <div class="step-panel" data-on="regs caches" data-focus="caches">
      <div class="step-kicker">Шаг 2 · три ступени кэша</div>
      <h4>L1, L2, L3: маленький и быстрый, побольше и помедленнее</h4>
      <p>Кэш делают уровнями, потому что быстрая память дорога и физически
      должна быть маленькой — иначе сигнал не успеет добежать. L1 в несколько
      десятков килобайт отвечает за 4 такта, L3 в десятки мегабайт — за 40.</p>
      <p>Обратите внимание: шкала логарифмическая, и три ступени кэша на ней
      выглядят соседями. По сравнению с тем, что дальше, они и есть соседи.</p>
    </div>
    <div class="step-panel" data-on="regs caches ram" data-focus="ram">
      <div class="step-kicker">Шаг 3 · выход из процессора</div>
      <h4>ОЗУ: 256 тактов, и это ещё быстро</h4>
      <p>Первый же шаг за пределы процессора обходится в 256 тактов ожидания.
      Именно из-за этой цифры существует кэш, существует подкачка целыми
      строками по 64 байта и существует привычка процессора угадывать, что
      понадобится дальше.</p>
      <p>И это при том, что оперативная память считается быстрой.</p>
    </div>
    <div class="step-panel" data-on="regs caches ram disk" data-focus="disk">
      <div class="step-kicker">Шаг 4 · накопители</div>
      <h4>Диск: другой порядок величин, а не просто «медленнее»</h4>
      <p>NVMe SSD отвечает примерно за 0,1 миллисекунды — это 320 тысяч тактов.
      Жёсткий диск с механической головкой — около 8 миллисекунд, то есть 25,6
      миллиона тактов.</p>
      <p>Разрыв между ОЗУ и SSD больше, чем между кэшем и ОЗУ, — поэтому
      операционная система так старается держать нужное в памяти.</p>
    </div>
    <div class="step-panel" data-on="regs caches ram disk net" data-focus="net">
      <div class="step-kicker">Шаг 5 · дальняя граница</div>
      <h4>Сеть: сюда процессор отправляет и забывает</h4>
      <p>Пинг в 30 миллисекунд — это 96 миллионов тактов. Ждать ответа, ничего
      не делая, здесь невозможно в принципе: за это время можно было бы
      отрисовать почти два кадра игры.</p>
      <p>Поэтому сетевые операции всегда асинхронные: отправили пакет и пошли
      заниматься другим.</p>
    </div>
    <div class="step-panel" data-on="regs caches ram disk net human" data-focus="human">
      <div class="step-kicker">Шаг 6 · масштаб по-человечески</div>
      <h4>Если такт — это секунда</h4>
      <p>Тогда сходить в кэш L1 — 4 секунды, в ОЗУ — 4 минуты, на SSD — почти
      четверо суток, на жёсткий диск — 296 дней, а в сеть — три года. Всё это
      в масштабе одной операции процессора.</p>
      <p>Здесь и становится понятно, почему инженеры готовы усложнять схему
      ради каждого сэкономленного обращения.</p>
    </div>
    <div class="step-panel" data-on="regs caches ram disk net human rule" data-focus="rule">
      <div class="step-kicker">Шаг 7 · зачем это было</div>
      <h4>Схема компьютера читается по этой шкале</h4>
      <p>Кэши, отдельные каналы к памяти, чипсет для медленной периферии,
      видеокарта со своей памятью — все эти решения появляются в одном и том же
      месте: там, где очередная ступень шкалы становится слишком дорогой.</p>
      <p>С этим ключом соберём современную плату.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> компоненты компьютера различаются не
  «немного», а на порядки — и архитектура целиком построена на том, чтобы как
  можно реже спускаться на ступень ниже.
</div>

---

## Часть 7. Современная плата: процессор забрал себе быстрое

<p>
  Роль магистрали, которая связывает всё со всем, в реальном компьютере
  выполняет <strong>материнская плата</strong>. Название историческое: в 1980-е
  к ней подключались дочерние платы (daughterboards), да и вообще все
  устройства подключаются именно к ней. Каждый разъём на плате — это, по сути,
  шина: место, куда модуль встаёт и начинает разговаривать с остальными.
</p>

<div class="callout-blue">
  <strong>Немного сленга:</strong> «материнская плата» произносить долго,
  поэтому прижились «материнка» и «мать». Энтузиасты разгоняли процессор и
  память выше заводских частот, платы этого иногда не переживали — и в
  разговоре это звучало как «у меня мать умерла». Фраза, сказанная в курилке,
  на непосвящённых производила сильное впечатление.
</div>

<p>
  Но интересна не сама плата, а то, как за тридцать лет изменилась логика
  соединений. Раньше все компоненты висели на общей шине, а рядом с процессором
  стояли два чипа-контроллера: <strong>северный мост</strong> (память,
  видеокарта, быстрые шины) и <strong>южный мост</strong> (всё медленное).
  Сегодня северного моста нет — его функции переехали внутрь процессора, а
  южный остался и называется <strong>чипсетом</strong>.
</p>

<div class="stage" id="stageBoard" tabindex="0">
  <div class="stage-figure">
<svg id="mb" viewBox="0 0 960 600" role="img" aria-label="Современная плата: процессор напрямую связан с памятью, видеокартой и накопителем, чипсет обслуживает медленную периферию">
  <style>
    #mb { font-family: Helvetica, Arial, sans-serif; }
    #mb .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mb .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #mb .frame { fill: none; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 8 7; }
    #mb .big { font-size: 21px; font-weight: 700; fill: #111111; }
    #mb .mid { font-size: 18px; font-weight: 700; fill: #111111; }
    #mb .lbl { font-size: 16px; fill: #111111; }
    #mb .cap { font-size: 13px; fill: #5E5850; }
    #mb .capb { font-size: 13px; fill: #2a5e9b; }
    #mb .capr { font-size: 13px; fill: #C30B0A; }
    #mb .fast { stroke: #3576C0; stroke-width: 4; fill: none; }
    #mb .slowl { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #mb .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="mb-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
    <marker id="mb-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="board">
    <rect x="25" y="45" width="910" height="520" rx="16" class="frame"/>
    <text x="930" y="36" class="cap" text-anchor="end">материнская плата — все разъёмы на ней и есть шины</text>
  </g>

  <g data-key="cpu">
    <rect x="380" y="180" width="200" height="120" rx="10" class="by"/>
    <text x="480" y="228" class="big" text-anchor="middle">CPU</text>
    <text x="480" y="254" class="cap" text-anchor="middle">контроллер памяти внутри,</text>
    <text x="480" y="276" class="cap" text-anchor="middle">линии PCIe тоже внутри</text>
  </g>

  <g data-key="ram">
    <rect x="60" y="180" width="230" height="120" rx="10" class="bx"/>
    <text x="175" y="222" class="lbl" text-anchor="middle">ОЗУ DDR5-6400</text>
    <text x="175" y="250" class="cap" text-anchor="middle">2 канала по 51,2 ГБ/с</text>
    <text x="175" y="274" class="cap" text-anchor="middle">вместе — 102,4 ГБ/с</text>
    <line x1="292" y1="215" x2="376" y2="215" class="fast" marker-start="url(#mb-arb)" marker-end="url(#mb-arb)"/>
    <line x1="292" y1="265" x2="376" y2="265" class="fast" marker-start="url(#mb-arb)" marker-end="url(#mb-arb)"/>
  </g>

  <g data-key="gpu">
    <rect x="670" y="180" width="230" height="120" rx="10" class="bx"/>
    <text x="785" y="222" class="lbl" text-anchor="middle">Видеокарта (GPU)</text>
    <text x="785" y="250" class="cap" text-anchor="middle">PCIe ×16</text>
    <text x="785" y="274" class="cap" text-anchor="middle">со своей видеопамятью</text>
    <line x1="584" y1="240" x2="666" y2="240" class="fast" marker-start="url(#mb-arb)" marker-end="url(#mb-arb)"/>
  </g>

  <g data-key="nvme">
    <rect x="380" y="60" width="200" height="80" rx="10" class="bx"/>
    <text x="480" y="98" class="lbl" text-anchor="middle">NVMe SSD</text>
    <text x="480" y="122" class="cap" text-anchor="middle">PCIe ×4 · около 7 ГБ/с</text>
    <line x1="480" y1="144" x2="480" y2="176" class="fast" marker-start="url(#mb-arb)" marker-end="url(#mb-arb)"/>
  </g>

  <g data-key="chip">
    <rect x="380" y="380" width="200" height="90" rx="10" class="by"/>
    <text x="480" y="418" class="mid" text-anchor="middle">Чипсет</text>
    <text x="480" y="444" class="cap" text-anchor="middle">бывший южный мост</text>
    <line x1="480" y1="304" x2="480" y2="376" class="slowl" marker-start="url(#mb-arg)" marker-end="url(#mb-arg)"/>
    <text x="492" y="346" class="cap">одна шина DMI</text>
  </g>

  <g data-key="slow">
    <line x1="470" y1="470" x2="160" y2="486" class="slowl" marker-end="url(#mb-arg)"/>
    <line x1="476" y1="472" x2="380" y2="486" class="slowl" marker-end="url(#mb-arg)"/>
    <line x1="486" y1="472" x2="595" y2="486" class="slowl" marker-end="url(#mb-arg)"/>
    <line x1="492" y1="470" x2="810" y2="486" class="slowl" marker-end="url(#mb-arg)"/>
    <rect x="60" y="490" width="190" height="60" rx="9" class="bx"/>
    <text x="155" y="516" class="cap" text-anchor="middle">SATA · диски</text>
    <text x="155" y="537" class="cap" text-anchor="middle">0,55 ГБ/с</text>
    <rect x="280" y="490" width="190" height="60" rx="9" class="bx"/>
    <text x="375" y="516" class="cap" text-anchor="middle">USB · мышь, клавиатура</text>
    <text x="375" y="537" class="cap" text-anchor="middle">опрос 1000 раз в секунду</text>
    <rect x="500" y="490" width="190" height="60" rx="9" class="bx"/>
    <text x="595" y="516" class="cap" text-anchor="middle">Звук</text>
    <text x="595" y="537" class="cap" text-anchor="middle">колонки и наушники</text>
    <rect x="720" y="490" width="190" height="60" rx="9" class="bx"/>
    <text x="815" y="516" class="cap" text-anchor="middle">Ethernet / Wi-Fi</text>
    <text x="815" y="537" class="cap" text-anchor="middle">пинг около 30 мс</text>
  </g>

  <g data-key="bridges" data-only="1">
    <text x="60" y="360" class="capr">1990-е: северный мост — отдельный чип</text>
    <text x="60" y="386" class="capr">он управлял памятью и видеокартой</text>
    <text x="60" y="412" class="capr">сегодня он целиком внутри процессора</text>
  </g>

  <g data-key="speeds" data-only="1">
    <text x="620" y="360" class="capb">быстрое — напрямую в процессор</text>
    <text x="620" y="386" class="capb">медленное — через чипсет</text>
    <text x="620" y="412" class="capb">единой общей шины больше нет</text>
  </g>

  <text x="30" y="586" class="legend">жёлтый — кто управляет · синий — память и устройства · толстая синяя линия — быстрая шина · тонкая серая — медленная</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="board" data-focus="board">
      <div class="step-kicker">Шаг 1 · основа</div>
      <h4>Плата — это овеществлённая схема из части 3</h4>
      <p>Разъём для процессора, слоты для памяти, слот PCIe для видеокарты,
      разъём M.2 для накопителя, гребёнка USB — каждый из них представляет собой
      шину со своим протоколом.</p>
      <p>Набор компонентов остался тем же, что мы собирали с самого начала.
      Изменилась логика соединений — её и разберём.</p>
    </div>
    <div class="step-panel" data-on="board cpu" data-focus="cpu">
      <div class="step-kicker">Шаг 2 · центр</div>
      <h4>Процессор сегодня — ещё и узел связи</h4>
      <p>Внутри современного CPU живёт контроллер памяти и десятки линий PCIe.
      То есть процессор не просто считает — он лично обслуживает подключение
      самых быстрых устройств.</p>
      <p>Это и есть «северный мост уехал внутрь»: чем короче путь до памяти,
      тем меньше тактов ожидания из части 6.</p>
    </div>
    <div class="step-panel" data-on="board cpu ram" data-focus="ram">
      <div class="step-kicker">Шаг 3 · память</div>
      <h4>Память подключена напрямую и не одним каналом</h4>
      <p>Модули DDR5 стоят на собственных линиях, идущих прямо в процессор.
      Каждый канал даёт 8 байт × 6,4 млрд передач = 51,2 ГБ/с, а два канала —
      102,4 ГБ/с.</p>
      <p>Заметьте, что задержка при этом почти не меняется: каналы дают
      пропускную способность, а 256 тактов ожидания остаются.</p>
    </div>
    <div class="step-panel" data-on="board cpu ram gpu" data-focus="gpu">
      <div class="step-kicker">Шаг 4 · графика</div>
      <h4>Видеокарта — отдельный компьютер на быстрой шине</h4>
      <p>У GPU своя память и тысячи простых вычислителей, а связан он с
      процессором по PCIe ×16. Процессор не рисует кадр сам: он готовит команды
      и данные сцены, а картинку собирает видеокарта.</p>
      <p>Поэтому графика подключена прямо к CPU: обмен между ними идёт каждый
      кадр, то есть до сотни раз в секунду.</p>
    </div>
    <div class="step-panel" data-on="board cpu ram gpu nvme" data-focus="nvme">
      <div class="step-kicker">Шаг 5 · быстрый накопитель</div>
      <h4>NVMe SSD тоже подключён к процессору напрямую</h4>
      <p>NVMe — это протокол доступа к SSD по линиям PCIe вместо старого
      SATA. Отсюда и разница в цифрах: около 7 ГБ/с против 0,55 ГБ/с.</p>
      <p>Раз накопитель стал быстрым, держать его на медленной ветке стало
      расточительно — так он и оказался в одной компании с памятью и
      видеокартой.</p>
    </div>
    <div class="step-panel" data-on="board cpu ram gpu nvme chip slow" data-focus="chip slow">
      <div class="step-kicker">Шаг 6 · всё остальное</div>
      <h4>Чипсет собирает медленную периферию на себя</h4>
      <p>Мышь, клавиатура, звук, сеть, SATA-диски, старые слоты расширения —
      всё это идёт в чипсет, а он передаёт процессору уже готовые события по
      одной шине (у Intel она называется DMI).</p>
      <p>Смысл простой: незачем тратить драгоценные линии процессора на
      устройство, которое опрашивается тысячу раз в секунду, когда сам
      процессор делает 3,2 миллиарда тактов за то же время.</p>
    </div>
    <div class="step-panel" data-on="board cpu ram gpu nvme chip slow bridges" data-focus="bridges">
      <div class="step-kicker">Шаг 7 · как было раньше</div>
      <h4>Два моста вместо одного чипсета</h4>
      <p>В 1990–2000-е рядом с процессором стояли два контроллера. Северный мост
      отвечал за память, видеокарту и высокоскоростные шины; южный — за диски,
      USB, звук и всё медленное.</p>
      <p>Северный мост исчез не потому, что стал не нужен, а потому, что
      переехал внутрь процессора: так короче путь и меньше задержка.</p>
    </div>
    <div class="step-panel" data-on="board cpu ram gpu nvme chip slow speeds" data-focus="speeds">
      <div class="step-kicker">Шаг 8 · правило чтения схемы</div>
      <h4>Разделение по скорости, а не по назначению</h4>
      <p>Всё быстрое — память, видеокарта, NVMe — висит на процессоре
      персональными шинами. Всё медленное собрано за чипсетом. Единой общей
      шины, как в исходной схеме, больше нет: каждая толстая синяя линия на
      рисунке — отдельная магистраль.</p>
      <p>Конкретный набор линий зависит от процессора: у разных линеек — Core,
      Ryzen, Xeon, EPYC — разное количество линий PCIe и каналов памяти, а
      графика иногда встроена прямо в CPU.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> современная плата — это та же схема из
  части 3, пересобранная по одному правилу: чем быстрее устройство, тем короче
  его путь до процессора, вплоть до переезда контроллера внутрь кристалла.
</div>

---

## Часть 8. Два сценария: запуск игры и нажатие кнопки

<p>
  Схема собрана — проверим её в деле. Возьмём самый обычный сюжет: вы дважды
  кликнули по иконке игры на рабочем столе. Карта на сцене ниже — та же самая,
  что в части 7, ни один блок не переехал. Появляются только стрелки: путь,
  который проходит сигнал.
</p>

<div class="stage" id="stageGame" tabindex="0">
  <div class="stage-figure">
<svg id="gm" viewBox="0 0 960 600" role="img" aria-label="Путь сигнала при запуске игры: от клика мышью до первого кадра на мониторе">
  <style>
    #gm { font-family: Helvetica, Arial, sans-serif; }
    #gm .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #gm .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #gm .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #gm .frame { fill: none; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 8 7; }
    #gm .big { font-size: 21px; font-weight: 700; fill: #111111; }
    #gm .mid { font-size: 18px; font-weight: 700; fill: #111111; }
    #gm .lbl { font-size: 16px; fill: #111111; }
    #gm .cap { font-size: 13px; fill: #5E5850; }
    #gm .note { font-size: 13px; fill: #2a5e9b; }
    #gm .link { stroke: #C9C4B8; stroke-width: 2; fill: none; }
    #gm .flow { stroke: #3576C0; stroke-width: 5; fill: none; }
    #gm .bdg { fill: #C29E08; }
    #gm .bdgt { font-size: 15px; font-weight: 700; fill: #FFFFFF; }
    #gm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="gm-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
  </defs>

  <g data-key="base">
    <rect x="25" y="45" width="910" height="520" rx="16" class="frame"/>
    <text x="930" y="36" class="cap" text-anchor="end">та же плата, что и в прошлой сцене</text>
    <rect x="380" y="180" width="200" height="120" rx="10" class="by"/>
    <text x="480" y="235" class="big" text-anchor="middle">CPU</text>
    <text x="480" y="262" class="cap" text-anchor="middle">выполняет код игры</text>
    <rect x="60" y="180" width="230" height="120" rx="10" class="bx"/>
    <text x="175" y="228" class="lbl" text-anchor="middle">ОЗУ DDR5</text>
    <text x="175" y="256" class="cap" text-anchor="middle">102,4 ГБ/с</text>
    <rect x="670" y="180" width="230" height="120" rx="10" class="bx"/>
    <text x="785" y="228" class="lbl" text-anchor="middle">Видеокарта (GPU)</text>
    <text x="785" y="256" class="cap" text-anchor="middle">строит кадры</text>
    <rect x="380" y="60" width="200" height="80" rx="10" class="bx"/>
    <text x="480" y="98" class="lbl" text-anchor="middle">NVMe SSD</text>
    <text x="480" y="122" class="cap" text-anchor="middle">файлы игры, 8 ГБ</text>
    <rect x="670" y="60" width="230" height="80" rx="10" class="bg"/>
    <text x="785" y="98" class="lbl" text-anchor="middle">Монитор и колонки</text>
    <text x="785" y="122" class="cap" text-anchor="middle">первый экран игры</text>
    <rect x="380" y="380" width="200" height="90" rx="10" class="by"/>
    <text x="480" y="418" class="mid" text-anchor="middle">Чипсет</text>
    <text x="480" y="444" class="cap" text-anchor="middle">шина DMI до процессора</text>
    <rect x="280" y="490" width="190" height="60" rx="9" class="bx"/>
    <text x="375" y="516" class="cap" text-anchor="middle">USB · мышь</text>
    <text x="375" y="537" class="cap" text-anchor="middle">двойной щелчок</text>
    <rect x="60" y="490" width="190" height="60" rx="9" class="bx"/>
    <text x="155" y="516" class="cap" text-anchor="middle">SATA · старые диски</text>
    <text x="155" y="537" class="cap" text-anchor="middle">не участвуют</text>
    <rect x="500" y="490" width="190" height="60" rx="9" class="bx"/>
    <text x="595" y="516" class="cap" text-anchor="middle">Звук</text>
    <text x="595" y="537" class="cap" text-anchor="middle">стартовая заставка</text>
    <rect x="720" y="490" width="190" height="60" rx="9" class="bx"/>
    <text x="815" y="516" class="cap" text-anchor="middle">Ethernet / Wi-Fi</text>
    <text x="815" y="537" class="cap" text-anchor="middle">ждёт своей очереди</text>
    <line x1="292" y1="240" x2="376" y2="240" class="link"/>
    <line x1="584" y1="240" x2="666" y2="240" class="link"/>
    <line x1="480" y1="144" x2="480" y2="176" class="link"/>
    <line x1="785" y1="144" x2="785" y2="176" class="link"/>
    <line x1="480" y1="304" x2="480" y2="376" class="link"/>
    <line x1="470" y1="472" x2="380" y2="487" class="link"/>
    <line x1="490" y1="472" x2="595" y2="487" class="link"/>
    <line x1="466" y1="470" x2="160" y2="487" class="link"/>
    <line x1="494" y1="470" x2="810" y2="487" class="link"/>
  </g>

  <g data-key="s1" data-only="1">
    <line x1="380" y1="487" x2="466" y2="473" class="flow" marker-end="url(#gm-arb)"/>
    <circle cx="330" cy="470" r="15" class="bdg"/>
    <text x="330" y="476" class="bdgt" text-anchor="middle">1</text>
  </g>

  <g data-key="s2" data-only="1">
    <line x1="480" y1="376" x2="480" y2="306" class="flow" marker-end="url(#gm-arb)"/>
    <circle cx="430" cy="340" r="15" class="bdg"/>
    <text x="430" y="346" class="bdgt" text-anchor="middle">2</text>
  </g>

  <g data-key="s3" data-only="1">
    <line x1="468" y1="176" x2="468" y2="146" class="flow" marker-end="url(#gm-arb)"/>
    <circle cx="420" cy="160" r="15" class="bdg"/>
    <text x="420" y="166" class="bdgt" text-anchor="middle">3</text>
  </g>

  <g data-key="s4" data-only="1">
    <line x1="492" y1="146" x2="492" y2="176" class="flow" marker-end="url(#gm-arb)"/>
    <circle cx="540" cy="160" r="15" class="bdg"/>
    <text x="540" y="166" class="bdgt" text-anchor="middle">4</text>
  </g>

  <g data-key="s5" data-only="1">
    <line x1="376" y1="240" x2="296" y2="240" class="flow" marker-end="url(#gm-arb)"/>
    <circle cx="335" cy="320" r="15" class="bdg"/>
    <text x="335" y="326" class="bdgt" text-anchor="middle">5</text>
    <text x="250" y="352" class="note">код и текстуры легли в память</text>
  </g>

  <g data-key="s6" data-only="1">
    <circle cx="560" cy="196" r="15" class="bdg"/>
    <text x="560" y="202" class="bdgt" text-anchor="middle">6</text>
    <text x="480" y="332" class="note" text-anchor="middle">процессор выполняет код игры</text>
  </g>

  <g data-key="s7" data-only="1">
    <line x1="584" y1="240" x2="664" y2="240" class="flow" marker-end="url(#gm-arb)"/>
    <circle cx="625" cy="205" r="15" class="bdg"/>
    <text x="625" y="211" class="bdgt" text-anchor="middle">7</text>
  </g>

  <g data-key="s8" data-only="1">
    <line x1="785" y1="176" x2="785" y2="146" class="flow" marker-end="url(#gm-arb)"/>
    <circle cx="735" cy="160" r="15" class="bdg"/>
    <text x="735" y="166" class="bdgt" text-anchor="middle">8</text>
  </g>

  <text x="30" y="586" class="legend">синяя стрелка — куда идут данные сейчас · жёлтый кружок — номер шага · серая линия — сейчас не работает</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="base s1" data-focus="s1">
      <div class="step-kicker">Шаг 1 · ввод</div>
      <h4>Мышь фиксирует два быстрых щелчка</h4>
      <p>Устройство ввода определяет, что кликов было два и что они пришли
      подряд, и передаёт событие контроллеру USB, который подключён к чипсету.
      Мышь опрашивается около тысячи раз в секунду — для процессора это
      бесконечно редко, для человека — незаметно часто.</p>
    </div>
    <div class="step-panel" data-on="base s1 s2" data-focus="s2">
      <div class="step-kicker">Шаг 2 · медленная ветка</div>
      <h4>Чипсет пересылает событие процессору</h4>
      <p>Чипсет получает событие от контроллера ввода и отправляет его дальше по
      шине DMI. Здесь видно, зачем он вообще нужен: процессор не опрашивает
      мышь сам, ему приносят уже готовое событие.</p>
    </div>
    <div class="step-panel" data-on="base s1 s2 s3" data-focus="s3">
      <div class="step-kicker">Шаг 3 · решение</div>
      <h4>Процессор понимает, что нужно запустить игру</h4>
      <p>Вместе с операционной системой и драйверами процессор трактует двойной
      клик по иконке как команду запуска и формирует запрос к накопителю:
      прочитать исполняемый файл и ресурсы.</p>
      <p>Сам запрос — это несколько тактов. Дальше начнётся ожидание.</p>
    </div>
    <div class="step-panel" data-on="base s1 s2 s3 s4" data-focus="s4">
      <div class="step-kicker">Шаг 4 · чтение с диска</div>
      <h4>SSD отдаёт 8 гигабайт — и это самая долгая часть</h4>
      <p>При скорости около 7 ГБ/с на чтение 8 ГБ уходит примерно 1,14 секунды.
      За это же время процессор успел бы сделать 3,7 миллиарда тактов, поэтому
      он не ждёт молча: операционная система переключает его на другие задачи.</p>
      <p>На старом жёстком диске те же 8 ГБ читались бы около 53 секунд — вот
      откуда взялись легендарные экраны загрузки.</p>
    </div>
    <div class="step-panel" data-on="base s1 s2 s3 s4 s5" data-focus="s5">
      <div class="step-kicker">Шаг 5 · перенос в ОЗУ</div>
      <h4>Код и ресурсы оседают в оперативной памяти</h4>
      <p>Поток данных идёт через контроллер памяти внутри процессора прямо в
      ОЗУ. Дальше игра живёт именно там: 256 тактов до памяти — это дорого, но
      в 1250 раз дешевле, чем каждый раз ходить на SSD.</p>
      <p>Именно поэтому объём ОЗУ так влияет на игры: не влезло — придётся
      подкачивать с накопителя во время игры.</p>
    </div>
    <div class="step-panel" data-on="base s1 s2 s3 s4 s5 s6" data-focus="s6">
      <div class="step-kicker">Шаг 6 · выполнение</div>
      <h4>Начинается обычный цикл из части 4</h4>
      <p>Процессор шаг за шагом выполняет код игры: обрабатывает ввод, считает
      физику и логику, готовит команды для видеокарты. Команды и данные он
      берёт из той самой единой памяти, а промахи мимо кэша обходятся ему в
      сотни тактов.</p>
    </div>
    <div class="step-panel" data-on="base s1 s2 s3 s4 s5 s6 s7" data-focus="s7">
      <div class="step-kicker">Шаг 7 · отрисовка</div>
      <h4>Видеокарта строит сцену и собирает кадр</h4>
      <p>GPU получает команды от процессора, выстраивает трёхмерную сцену и
      формирует изображение. В кадре 1920×1080 около 2,07 миллиона пикселей, и
      при 60 кадрах в секунду на каждый кадр есть 16,7 мс — 53 миллиона тактов
      процессора.</p>
      <p>Разделение труда здесь предельно наглядное: CPU решает, что происходит
      в мире, GPU решает, как это выглядит.</p>
    </div>
    <div class="step-panel" data-on="base s1 s2 s3 s4 s5 s6 s7 s8" data-focus="s8">
      <div class="step-kicker">Шаг 8 · вывод</div>
      <h4>Первый экран игры и стартовый звук</h4>
      <p>Готовый кадр уходит на видеовыход, монитор его показывает, а звуковой
      тракт через чипсет воспроизводит заставку. Круг из части 2 замкнулся:
      ввод — обработка — хранение — вывод.</p>
      <p>Всё путешествие заняло около секунды, и почти вся эта секунда — чтение
      с накопителя.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Второй сценарий: вы нажали кнопку в уже запущенной игре

<p>
  Игра идёт, вы применяете заклинание. Маршрут будет похож, но нагрузка
  ляжет на другие участки схемы: накопитель почти не нужен, зато появляется
  сеть — другим игрокам надо сообщить, что произошло.
</p>

<table class="shape-table">
  <tr><th>Шаг</th><th>Запуск игры</th><th>Нажатие кнопки в игре</th></tr>
  <tr><td>1</td><td>мышь фиксирует двойной щелчок</td><td>клавиатура или мышь фиксирует нажатие</td></tr>
  <tr><td>2</td><td>чипсет передаёт событие в CPU</td><td>то же самое, по той же шине DMI</td></tr>
  <tr><td>3</td><td>CPU решает запустить игру, идёт к SSD</td><td>CPU сопоставляет нажатие с контекстом игры и считает урон и эффекты</td></tr>
  <tr><td>4</td><td>SSD отдаёт 8 ГБ файлов</td><td>накопитель не нужен: всё уже в ОЗУ</td></tr>
  <tr><td>5</td><td>данные оседают в ОЗУ</td><td>CPU обновляет в ОЗУ состояние мира: здоровье, эффекты, позиции</td></tr>
  <tr><td>6</td><td>CPU начинает выполнять код игры</td><td>CPU собирает сетевой пакет и отдаёт его сетевому контроллеру</td></tr>
  <tr><td>7</td><td>GPU строит первый кадр</td><td>GPU рисует анимацию заклинания и эффекты</td></tr>
  <tr><td>8</td><td>монитор и колонки показывают заставку</td><td>монитор показывает вспышку, звук воспроизводит эффект</td></tr>
</table>

<p>
  Логика одна и та же: данные попадают в систему через устройства ввода или из
  накопителя, процессор их обрабатывает, память хранит промежуточные
  результаты, шины связывают модули, а результат уходит наружу. Разница только
  в том, какая часть схемы нагружена сильнее: при запуске — накопитель, при
  игре — память, видеокарта и сеть.
</p>

<div class="callout-yellow">
  <strong>Практическая деталь:</strong> пакет улетает к другим игрокам и
  возвращается за 30 мс — это 96 миллионов тактов процессора. Поэтому игра
  никогда не ждёт ответа сети, чтобы показать вам следующий кадр: она рисует
  предсказанный результат, а пришедший ответ при необходимости поправляет
  картинку.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> сценарии различаются не маршрутом, а
  тем, какая ступень лестницы скоростей включается — и именно эта ступень
  определяет, что вы почувствуете: долгую загрузку, подтормаживание или лаг.
</div>

---

## Часть 9. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Архитектура — это правила взаимодействия, а не список деталей.</strong>
  Один и тот же набор компонентов можно соединить по-разному, и различаться
  машины будут именно этим.</li>

  <li><strong>Центральная часть — процессор плюс внутренняя память.</strong> ОЗУ
  обслуживает работу и живёт, пока есть питание; ПЗУ обслуживает включение,
  когда в ОЗУ ещё ничего нет.</li>

  <li><strong>Периферия делится по задачам, а не по разъёмам:</strong> ввод,
  вывод, внешняя память, сеть. Любое устройство попадает в одну из этих
  четырёх групп.</li>

  <li><strong>Шина — это три группы линий.</strong> Адресная (куда,
  односторонняя), данных (что, двусторонняя), управления (какая операция и
  когда). Магистрально-модульный принцип отсюда и вырос.</li>

  <li><strong>Фон Нейман: команды и данные в одной памяти.</strong> Это дало
  универсальность и одновременно узкое место — единственный канал, за который
  конкурируют выборка команд и обращения к данным.</li>

  <li><strong>Гарвард разделяет память и шины, смешанная архитектура прячет
  это внутрь.</strong> Снаружи процессор фоннеймановский, внутри у него
  раздельные i-кэш и d-кэш; программная модель при этом не меняется.</li>

  <li><strong>Ключевые числа — про ожидание.</strong> Регистр — 1 такт, кэш
  L1 — 4, ОЗУ — 256, SSD — 320 тысяч, жёсткий диск — 25,6 миллиона,
  сеть — 96 миллионов.</li>

  <li><strong>Современная плата разделена по скорости.</strong> Память,
  видеокарта и NVMe висят на процессоре отдельными шинами; всё медленное
  собрано за чипсетом; северный мост переехал внутрь CPU, южный стал чипсетом.</li>

  <li><strong>Любой сценарий читается по схеме.</strong> Ввод → чипсет → CPU →
  память или накопитель → GPU → вывод. Меняется только то, какое звено на этот
  раз оказывается самым медленным.</li>
</ol>

<p>
  Если из статьи стоит унести одну картину, пусть это будет лестница скоростей.
  Процессор — существо, живущее в наносекундах, а всё, с чем ему приходится
  работать, живёт в микро- и миллисекундах. Две памяти вместо одной, кэши
  внутри кристалла, отдельные каналы к DDR, чипсет для мыши и клавиатуры,
  видеокарта со своей памятью — это не разные изобретения, а один и тот же
  ответ на один и тот же разрыв, данный на разных этажах системы. Увидев схему
  незнакомого компьютера — сервера, смартфона, микроконтроллера, — ищите на
  ней тот же самый ответ: что здесь быстрое, что медленное и кто их разделяет.
</p>

<p class="tiny">
  Числа в статье — типичные значения для настольного компьютера начала 2020-х:
  процессор 3,2 ГГц (такт 0,3125 нс), память DDR5-6400 в двух каналах
  (8 байт × 6,4 млрд передач = 51,2 ГБ/с на канал), NVMe SSD около 7 ГБ/с,
  SATA SSD 0,55 ГБ/с, жёсткий диск 0,15 ГБ/с, задержки 4 / 14 / 40 тактов для
  кэшей L1–L3, 80 нс для ОЗУ, 0,1 мс для NVMe, 8 мс для HDD, 30 мс для сетевого
  пинга. Пересчёт в такты, доли ожидания, среднее время обращения при разной
  доле попаданий в кэш и время загрузки 8 ГБ посчитаны скриптом; округление —
  до трёх значащих цифр. Конкретные значения зависят от модели процессора,
  памяти и накопителя, поэтому воспринимайте их как порядок величины, а не как
  паспортные данные вашей машины.
</p>
