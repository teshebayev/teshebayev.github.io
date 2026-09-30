

<p class="lead">
  Компьютер устроен проще, чем кажется: несколько частей, соединённых проводами,
  и один процессор, который бесконечно повторяет одно и то же — берёт очередную
  команду, выполняет её и переходит к следующей.
</p>

<p>
  Это вводная статья к циклу про Python. Прежде чем разбираться, как работают
  списки, циклы и функции, полезно понимать, куда всё это в итоге попадает: в
  железо, которое ничего не знает ни про Python, ни про списки. Никакой
  подготовки не нужно — мы начинаем с самого начала и всюду обходимся обычными
  словами.
</p>

<p>
  Каждая тема здесь разобрана коротко, чтобы получилась общая картина. Если
  захочется глубже, по любой из них есть отдельная подробная статья, и ссылки на
  них стоят прямо в тексте.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Ничего не нужно</strong>
    <p>Достаточно уметь включить компьютер и запустить программу.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Программа из трёх строк</strong>
    <p>Складываем 2 и 5, умножаем на 10, показываем результат.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Рассказать своими словами</strong>
    <p>Что произошло от запуска файла до появления числа на экране.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>память и данные</span>
  <span><i style="background:#C29E08"></i>процессор и его работа</span>
  <span><i style="background:#73B222"></i>результат и внешний мир</span>
  <span><i style="background:#C30B0A"></i>ожидание и потери</span>
</div>

<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите
  только на яркую часть схемы. Картинка при этом не перерисовывается — меняется
  лишь то, куда смотреть. Стрелки на клавиатуре тоже работают, если щёлкнуть по
  схеме.
</div>

<h2 id="part-1">Часть 1. Из каких частей состоит компьютер</h2>

<p>
  Внутри корпуса — довольно мало разных вещей. Есть <strong>процессор</strong>:
  он единственный, кто умеет считать. Есть <strong>оперативная память</strong>,
  сокращённо ОЗУ: быстрая, но забывчивая — при выключении питания всё её
  содержимое пропадает. Есть <strong>диск</strong>, жёсткий или твердотельный:
  он медленнее, зато помнит и без электричества. И есть
  <strong>устройства ввода-вывода</strong> — клавиатура, мышь, экран, динамики,
  сетевая карта.
</p>

<p>
  Всё это соединено <strong>шиной</strong> — общим набором проводов, по которым
  части передают друг другу адреса и данные. Именно поэтому компьютер можно
  собирать из разных деталей: пока они умеют разговаривать по шине, им не важно,
  кто с той стороны.
</p>

<div class="stage" id="stageParts" tabindex="0">
  <div class="stage-figure">
<svg id="cm" viewBox="0 0 960 520" role="img" aria-label="Части компьютера: процессор, оперативная память, диск, устройства ввода и вывода, соединённые общей шиной">
  <style>
    #cm { font-family: Helvetica, Arial, sans-serif; }
    #cm .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.7; }
    #cm .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #cm .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.7; }
    #cm .bus { fill: #ECE9E0; stroke: #5E5850; stroke-width: 1.5; }
    #cm .lbl { font-size: 18px; fill: #111111; font-weight: 700; }
    #cm .sub { font-size: 14px; fill: #111111; }
    #cm .cap { font-size: 13px; fill: #5E5850; }
    #cm .edge { stroke: #5E5850; stroke-width: 2; fill: none; }
    #cm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <g data-key="cpu">
    <rect x="380" y="110" width="200" height="110" rx="10" class="by"/>
    <text x="480" y="148" class="lbl" text-anchor="middle">Процессор</text>
    <text x="480" y="174" class="sub" text-anchor="middle">CPU</text>
    <text x="480" y="200" class="cap" text-anchor="middle">единственный, кто считает</text>
  </g>
  <g data-key="ram">
    <rect x="90" y="110" width="200" height="110" rx="10" class="bx"/>
    <text x="190" y="148" class="lbl" text-anchor="middle">Оперативная</text>
    <text x="190" y="172" class="lbl" text-anchor="middle">память</text>
    <text x="190" y="200" class="cap" text-anchor="middle">помнит, пока включено</text>
  </g>
  <g data-key="disk">
    <rect x="670" y="110" width="200" height="110" rx="10" class="bx"/>
    <text x="770" y="148" class="lbl" text-anchor="middle">Диск</text>
    <text x="770" y="174" class="sub" text-anchor="middle">HDD или SSD</text>
    <text x="770" y="200" class="cap" text-anchor="middle">помнит всегда</text>
  </g>
  <g data-key="bus">
    <line x1="190" y1="220" x2="190" y2="258" class="edge"/>
    <line x1="480" y1="220" x2="480" y2="258" class="edge"/>
    <line x1="770" y1="220" x2="770" y2="258" class="edge"/>
    <rect x="90" y="258" width="780" height="18" rx="6" class="bus"/>
    <line x1="250" y1="276" x2="250" y2="320" class="edge"/>
    <line x1="710" y1="276" x2="710" y2="320" class="edge"/>
    <text x="480" y="302" class="cap" text-anchor="middle">шина — общие провода для всех</text>
  </g>
  <g data-key="io">
    <rect x="140" y="320" width="220" height="96" rx="10" class="bg"/>
    <text x="250" y="356" class="lbl" text-anchor="middle">Ввод</text>
    <text x="250" y="384" class="cap" text-anchor="middle">клавиатура, мышь, микрофон</text>
    <rect x="600" y="320" width="220" height="96" rx="10" class="bg"/>
    <text x="710" y="356" class="lbl" text-anchor="middle">Вывод</text>
    <text x="710" y="384" class="cap" text-anchor="middle">экран, звук, принтер</text>
  </g>
  <g data-key="sum" data-only="1">
    <text x="90" y="456" class="cap">данные всё время едут по кругу: с диска в память, из памяти в процессор, из процессора на экран</text>
  </g>
  <text x="90" y="496" class="legend">синий — память и данные · жёлтый — процессор · зелёный — связь с внешним миром</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="cpu" data-focus="cpu">
      <div class="step-kicker">Шаг 1 · главный</div>
      <h4>Процессор — единственный, кто что-то делает</h4>
      <p>
        Он умеет складывать, сравнивать, перекладывать числа с места на место.
        Всё, что происходит в компьютере, происходит потому, что процессор
        выполнил очередную команду. Хранить много данных он не умеет — ему
        нужна память.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram" data-focus="ram">
      <div class="step-kicker">Шаг 2 · рабочий стол</div>
      <h4>Оперативная память хранит то, с чем работают прямо сейчас</h4>
      <p>
        Она быстрая и большая: гигабайты. Но у неё есть особенность — при
        выключении питания она пустеет полностью. Это рабочий стол: удобно, пока
        вы за ним сидите.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram disk" data-focus="disk">
      <div class="step-kicker">Шаг 3 · склад</div>
      <h4>Диск помнит даже выключенным</h4>
      <p>
        Файлы, программы, фотографии, сама операционная система — всё это лежит
        на диске. Он заметно медленнее оперативной памяти, зато ничего не теряет.
        Это склад, а не рабочий стол.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram disk io" data-focus="io">
      <div class="step-kicker">Шаг 4 · двери наружу</div>
      <h4>Через устройства ввода-вывода компьютер общается с миром</h4>
      <p>
        С одной стороны заходит то, что вы нажали и сказали. С другой выходит то,
        что вы видите и слышите. Для процессора и то и другое — просто числа,
        которые приезжают и уезжают.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram disk io bus" data-focus="bus">
      <div class="step-kicker">Шаг 5 · провода</div>
      <h4>Шина связывает всё в одно целое</h4>
      <p>
        По одним проводам передаётся номер нужной ячейки, по другим — сами
        данные, по третьим — короткие сигналы вроде «читай» или «готово».
        Разговаривать по шине умеют все части, поэтому их можно менять по
        отдельности.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram disk io bus sum" data-focus="sum">
      <div class="step-kicker">Шаг 6 · вся картина</div>
      <h4>Данные ходят по кругу</h4>
      <p>
        Программа лежит на диске. Чтобы её выполнить, её копируют в оперативную
        память. Оттуда процессор забирает команды и данные, считает и
        отправляет результат на экран. Дальше вся статья — про этот круг
        подробнее.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> компьютер — это один считающий блок,
  две памяти с разными характерами и двери наружу, соединённые общими проводами.
  Подробный разбор каждой части и того, почему они именно такие, — в статье
  <a href="article.html?slug=computer-architecture">«Из каких частей состоит компьютер»</a>.
</div>

<hr>

<h2 id="part-2">Часть 2. Почему памяти несколько, а не одна</h2>

<p>
  Логично было бы иметь одну память: быструю, огромную и не теряющую данные.
  Такой не существует. Чем память быстрее, тем она дороже и тем меньше её
  помещается рядом с процессором. Поэтому память делают
  <strong>ступеньками</strong>: чуть-чуть очень быстрой рядом с ядром и много
  медленной подальше.
</p>

<p>
  Самая верхняя ступенька — <strong>регистры</strong> прямо внутри процессора.
  Их несколько десятков, каждый хранит одно число, и работать с ними процессор
  может мгновенно. Ниже — <strong>кэш</strong>: небольшая память, тоже внутри
  процессора, куда складывают копии тех кусочков оперативной памяти, которыми
  пользуются прямо сейчас. Ещё ниже — оперативная память, а в самом низу — диск.
</p>

<div class="stage" id="stageSpeed" tabindex="0">
  <div class="stage-figure">
<svg id="sp" viewBox="0 0 960 540" role="img" aria-label="Четыре ступени памяти: регистры, кэш, оперативная память и диск, с сравнением скорости и объёма">
  <style>
    #sp { font-family: Helvetica, Arial, sans-serif; }
    #sp .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.7; }
    #sp .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #sp .bn { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.4; }
    #sp .lbl { font-size: 18px; fill: #111111; font-weight: 700; }
    #sp .sub { font-size: 13px; fill: #5E5850; }
    #sp .right { font-size: 14px; fill: #111111; }
    #sp .cap { font-size: 13px; fill: #5E5850; }
    #sp .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <g data-key="regs">
    <rect x="60" y="84" width="430" height="64" rx="9" class="by"/>
    <text x="76" y="112" class="lbl">Регистры</text>
    <text x="76" y="134" class="sub">внутри процессора, несколько десятков чисел</text>
    <text x="530" y="124" class="right">мгновенно</text>
  </g>
  <g data-key="cache">
    <rect x="60" y="164" width="430" height="64" rx="9" class="by"/>
    <text x="76" y="192" class="lbl">Кэш</text>
    <text x="76" y="214" class="sub">копия того, чем пользуются прямо сейчас</text>
    <text x="530" y="204" class="right">очень быстро</text>
  </g>
  <g data-key="ram">
    <rect x="60" y="244" width="430" height="64" rx="9" class="bx"/>
    <text x="76" y="272" class="lbl">Оперативная память</text>
    <text x="76" y="294" class="sub">гигабайты; при выключении всё стирается</text>
    <text x="530" y="284" class="right">в сотни раз медленнее регистров</text>
  </g>
  <g data-key="disk">
    <rect x="60" y="324" width="430" height="64" rx="9" class="bx"/>
    <text x="76" y="352" class="lbl">Диск</text>
    <text x="76" y="374" class="sub">терабайты; помнит и без питания</text>
    <text x="530" y="364" class="right">ещё в тысячи раз медленнее</text>
  </g>
  <g data-key="analogy" data-only="1">
    <rect x="60" y="410" width="840" height="60" rx="9" class="bn"/>
    <text x="76" y="436" class="cap">если один шаг процессора представить как одну секунду, то ответа от оперативной памяти</text>
    <text x="76" y="458" class="cap">он ждал бы несколько минут, а данных с диска — от суток до нескольких месяцев</text>
  </g>
  <g data-key="moral" data-only="1">
    <text x="60" y="500" class="cap">поэтому программу сначала целиком копируют с диска в память, а часто нужное держат в кэше</text>
  </g>
  <text x="60" y="530" class="legend">жёлтый — память внутри процессора · синий — память снаружи</text>
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
      <div class="step-kicker">Шаг 1 · самая верхняя ступень</div>
      <h4>Регистры — рабочие руки процессора</h4>
      <p>
        Складывать процессор умеет только числа, которые лежат в регистрах.
        Их мало, и это принципиально: чем ближе память к вычислителю, тем
        меньше её удаётся туда впихнуть.
      </p>
    </div>
    <div class="step-panel" data-on="regs ram" data-focus="ram">
      <div class="step-kicker">Шаг 2 · рабочий стол</div>
      <h4>Оперативная память большая, но далеко</h4>
      <p>
        Сюда помещается вся программа со всеми данными. Но она снаружи
        процессора, и каждое обращение к ней — это поездка по шине и ожидание
        ответа.
      </p>
    </div>
    <div class="step-panel" data-on="regs ram disk" data-focus="disk">
      <div class="step-kicker">Шаг 3 · склад</div>
      <h4>Диск огромный, но очень медленный</h4>
      <p>
        Зато только он переживает выключение. Всё, что вы хотите сохранить,
        рано или поздно оказывается на диске, а всё, с чем работаете прямо
        сейчас, — в оперативной памяти.
      </p>
    </div>
    <div class="step-panel" data-on="regs cache ram disk" data-focus="cache">
      <div class="step-kicker">Шаг 4 · хитрость посередине</div>
      <h4>Кэш прячет разницу между быстрым и медленным</h4>
      <p>
        Когда процессор просит одно число из памяти, ему привозят целый кусочек
        по соседству и оставляют в кэше. Программы обычно работают с данными,
        лежащими рядом, — и следующие несколько обращений оказываются почти
        бесплатными.
      </p>
    </div>
    <div class="step-panel" data-on="regs cache ram disk analogy" data-focus="analogy">
      <div class="step-kicker">Шаг 5 · масштаб</div>
      <h4>Разрыв огромный, а не «немножко»</h4>
      <p>
        Растянем время: пусть один шаг процессора длится секунду. Тогда ответ из
        оперативной памяти придёт через несколько минут, а с диска — через сутки
        или месяцы. Это грубая аналогия для порядков, но она показывает главное:
        процессор большую часть времени не считает, а ждёт.
      </p>
    </div>
    <div class="step-panel" data-on="regs cache ram disk analogy moral" data-focus="moral">
      <div class="step-kicker">Шаг 6 · что из этого следует</div>
      <h4>Всю конструкцию придумали, чтобы меньше ждать</h4>
      <p>
        Программу копируют с диска в память заранее. Нужные куски памяти
        подтягивают в кэш. Числа, с которыми идёт счёт, держат в регистрах.
        Каждая ступенька существует ради одного — чтобы процессор реже стоял
        без дела.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> идеальной памяти не бывает, поэтому её
  собирают лесенкой — от крошечной и мгновенной до огромной и медленной. Почти
  всё, что кажется в компьютерах сложным, придумано ради того, чтобы обойти эту
  лесенку.
</div>

<hr>
<h2 id="part-3">Часть 3. Как процессор разговаривает с оперативной памятью</h2>

<p>
  Оперативная память — это очень длинный ряд пронумерованных ячеек. Номер ячейки
  называется <strong>адресом</strong>. Память сама ничего не решает: она умеет
  только отдать то, что лежит по названному адресу, или записать туда то, что ей
  передали.
</p>

<p>
  Разговор всегда начинает процессор, и идёт он по трём группам проводов. По
  одним процессор называет адрес. По другим ездят сами данные. По третьим —
  короткие сигналы: «читаю», «пишу», «готово». Сигнал — это просто пара
  проводов, на которых может быть четыре комбинации.
</p>

<div class="stage" id="stageBus" tabindex="0">
  <div class="stage-figure">
<svg id="bs" viewBox="0 0 960 526" role="img" aria-label="Разговор процессора с оперативной памятью: провода адреса, данных и управления и четыре управляющих сигнала">
  <style>
    #bs { font-family: Helvetica, Arial, sans-serif; }
    #bs .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.7; }
    #bs .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #bs .lbl { font-size: 18px; fill: #111111; font-weight: 700; }
    #bs .cap { font-size: 13px; fill: #5E5850; }
    #bs .sig { font-size: 14px; fill: #111111; }
    #bs .edge { stroke: #5E5850; stroke-width: 2; fill: none; }
    #bs .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bs-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>
  <g data-key="cpu">
    <rect x="60" y="110" width="220" height="150" rx="10" class="by"/>
    <text x="170" y="154" class="lbl" text-anchor="middle">Процессор</text>
    <text x="170" y="184" class="cap" text-anchor="middle">хочет получить число</text>
    <text x="170" y="208" class="cap" text-anchor="middle">из памяти</text>
  </g>
  <g data-key="ram">
    <rect x="680" y="110" width="220" height="150" rx="10" class="bx"/>
    <text x="790" y="148" class="lbl" text-anchor="middle">Оперативная</text>
    <text x="790" y="172" class="lbl" text-anchor="middle">память</text>
    <text x="790" y="202" class="cap" text-anchor="middle">миллиарды ячеек,</text>
    <text x="790" y="226" class="cap" text-anchor="middle">у каждой свой номер</text>
  </g>
  <g data-key="addr">
    <line x1="285" y1="150" x2="675" y2="150" class="edge" marker-end="url(#bs-arw)"/>
    <text x="480" y="140" class="cap" text-anchor="middle">адрес — номер нужной ячейки</text>
  </g>
  <g data-key="ctrl">
    <line x1="285" y1="250" x2="675" y2="250" class="edge" marker-end="url(#bs-arw)"/>
    <text x="480" y="240" class="cap" text-anchor="middle">управление — что именно делать</text>
  </g>
  <g data-key="data">
    <line x1="675" y1="200" x2="285" y2="200" class="edge" marker-end="url(#bs-arw)"/>
    <text x="480" y="190" class="cap" text-anchor="middle">данные — то, что лежит в ячейке</text>
  </g>
  <g data-key="signals">
    <text x="60" y="320" class="sig">00 — ничего не делаем</text>
    <text x="60" y="348" class="sig">01 — прочитать байт из памяти</text>
    <text x="60" y="376" class="sig">10 — записать байт в память</text>
    <text x="60" y="404" class="sig">11 — готово, данные можно забирать</text>
  </g>
  <g data-key="wait" data-only="1">
    <text x="60" y="440" class="cap">пока память ищет ячейку, процессор просто ждёт — и это самое частое его занятие</text>
  </g>
  <g data-key="sum" data-only="1">
    <text x="60" y="470" class="cap">один такой разговор длится сотни шагов процессора, поэтому рядом с ядром и держат кэш</text>
  </g>
  <text x="60" y="506" class="legend">жёлтый — процессор · синий — память · стрелки — провода шины</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="cpu ram" data-focus="cpu">
      <div class="step-kicker">Шаг 1 · двое собеседников</div>
      <h4>Процессор спрашивает, память отвечает</h4>
      <p>
        Инициатива всегда у процессора. Память — исполнитель: сама она ничего не
        начинает и не знает, что за число у неё хранится, — для неё это просто
        байты по номерам.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram addr" data-focus="addr">
      <div class="step-kicker">Шаг 2 · адрес</div>
      <h4>Сначала процессор называет номер ячейки</h4>
      <p>
        Он выставляет адрес на провода — примерно как назвать номер ящика в
        камере хранения. Никакого «дай мне переменную x» не бывает: есть только
        номера.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram addr ctrl signals" data-focus="signals">
      <div class="step-kicker">Шаг 3 · команда</div>
      <h4>Потом говорит, что с этой ячейкой делать</h4>
      <p>
        На управляющих проводах появляется комбинация <code>01</code> —
        «прочитать». Была бы <code>10</code> — память бы записала то, что лежит
        на проводах данных. Всего таких комбинаций четыре, и они исчерпывают
        весь разговор.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram addr ctrl signals wait" data-focus="wait">
      <div class="step-kicker">Шаг 4 · пауза</div>
      <h4>Память ищет — процессор ждёт</h4>
      <p>
        Поиск нужной ячейки занимает время. Для памяти это доли микросекунды,
        для процессора — целая вечность: за это время он успел бы выполнить
        сотни команд. Именно в этом ожидании проходит большая часть его жизни.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram addr ctrl signals wait data" data-focus="data">
      <div class="step-kicker">Шаг 5 · ответ</div>
      <h4>Число едет обратно по проводам данных</h4>
      <p>
        Память выставляет содержимое ячейки на провода и поднимает сигнал
        <code>11</code> — «готово». Процессор забирает число в регистр, и теперь
        с ним наконец можно что-то делать.
      </p>
    </div>
    <div class="step-panel" data-on="cpu ram addr ctrl signals wait data sum" data-focus="sum">
      <div class="step-kicker">Шаг 6 · вывод</div>
      <h4>Каждое обращение к памяти стоит дорого</h4>
      <p>
        Поэтому память отдаёт данные не по одному байту, а кусками: раз уж
        поехали — привезём заодно и соседей. Эти куски и оседают в кэше. Так
        одна поездка окупается несколькими следующими обращениями.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> у памяти нет имён переменных и типов —
  только номера ячеек и байты. Весь обмен сводится к трём вещам: назвать адрес,
  сказать «читай» или «пиши», дождаться ответа.
</div>

<hr>

<h2 id="part-4">Часть 4. Что находится внутри процессора</h2>

<p>
  Процессор снаружи — небольшая пластинка. Внутри у него есть четыре вещи,
  которых достаточно, чтобы объяснить всю его работу.
</p>

<p>
  <strong>Регистры</strong> — несколько десятков ячеек для чисел, с которыми
  идёт счёт прямо сейчас. Один из них особенный: он хранит адрес следующей
  команды и называется <strong>счётчиком команд</strong>.
  <strong>АЛУ</strong> — арифметико-логическое устройство, то есть встроенный
  калькулятор: складывает, вычитает, сравнивает. <strong>Устройство
  управления</strong> разбирает очередную команду и говорит остальным, что
  делать. И <strong>кэш</strong> — та самая быстрая копия кусочков оперативной
  памяти.
</p>

<div class="stage" id="stageInside" tabindex="0">
  <div class="stage-figure">
<svg id="in" viewBox="0 0 960 484" role="img" aria-label="Внутреннее устройство процессора: регистры, АЛУ, устройство управления и кэш">
  <style>
    #in { font-family: Helvetica, Arial, sans-serif; }
    #in .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.7; }
    #in .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #in .bn { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.4; }
    #in .frame { fill: none; stroke: #5E5850; stroke-width: 1.5; stroke-dasharray: 8 5; }
    #in .lbl { font-size: 18px; fill: #111111; font-weight: 700; }
    #in .cap { font-size: 13px; fill: #5E5850; }
    #in .mono { font-size: 14px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #in .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <g data-key="regs">
    <rect x="60" y="70" width="840" height="330" rx="12" class="frame"/>
    <text x="66" y="58" class="lbl">Процессор</text>
    <rect x="90" y="110" width="280" height="180" rx="9" class="bx"/>
    <text x="230" y="142" class="lbl" text-anchor="middle">Регистры</text>
    <rect x="110" y="158" width="240" height="34" rx="5" class="bn"/>
    <text x="122" y="181" class="mono">AX = 7</text>
    <rect x="110" y="202" width="240" height="34" rx="5" class="bn"/>
    <text x="122" y="225" class="mono">BX = 5</text>
    <rect x="110" y="246" width="240" height="34" rx="5" class="bn"/>
    <text x="122" y="269" class="mono">IP = адрес команды</text>
  </g>
  <g data-key="alu">
    <rect x="410" y="110" width="220" height="120" rx="9" class="by"/>
    <text x="520" y="150" class="lbl" text-anchor="middle">АЛУ</text>
    <text x="520" y="180" class="cap" text-anchor="middle">складывает, вычитает,</text>
    <text x="520" y="202" class="cap" text-anchor="middle">умножает, сравнивает</text>
  </g>
  <g data-key="ctl">
    <rect x="410" y="250" width="220" height="110" rx="9" class="by"/>
    <text x="520" y="288" class="lbl" text-anchor="middle">Управление</text>
    <text x="520" y="316" class="cap" text-anchor="middle">разбирает команду</text>
    <text x="520" y="338" class="cap" text-anchor="middle">и раздаёт указания</text>
  </g>
  <g data-key="cache">
    <rect x="670" y="110" width="200" height="250" rx="9" class="bx"/>
    <text x="770" y="150" class="lbl" text-anchor="middle">Кэш</text>
    <text x="770" y="180" class="cap" text-anchor="middle">копии кусочков</text>
    <text x="770" y="202" class="cap" text-anchor="middle">оперативной памяти</text>
    <text x="770" y="240" class="cap" text-anchor="middle">чтобы реже ездить</text>
    <text x="770" y="262" class="cap" text-anchor="middle">за ними наружу</text>
  </g>
  <g data-key="sum" data-only="1">
    <text x="60" y="432" class="cap">регистры — рабочий стол, АЛУ — калькулятор, управление — дирижёр, кэш — стопка нужных бумаг под рукой</text>
  </g>
  <text x="60" y="464" class="legend">жёлтый — то, что считает и командует · синий — то, что хранит числа</text>
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
      <div class="step-kicker">Шаг 1 · где лежат числа</div>
      <h4>Регистры — единственное место, где процессор умеет считать</h4>
      <p>
        Сложить два числа он может, только если оба лежат в регистрах. Всё
        остальное — про то, как их туда доставить и куда потом деть. Регистр
        <code>IP</code> хранит адрес команды, которую надо выполнить следующей.
      </p>
    </div>
    <div class="step-panel" data-on="regs alu" data-focus="alu">
      <div class="step-kicker">Шаг 2 · кто считает</div>
      <h4>АЛУ — калькулятор внутри процессора</h4>
      <p>
        Ему на вход подают два числа из регистров и говорят, что с ними сделать.
        Результат он кладёт обратно в регистр. Сложение он делает почти
        мгновенно, деление — заметно дольше.
      </p>
    </div>
    <div class="step-panel" data-on="regs alu ctl" data-focus="ctl">
      <div class="step-kicker">Шаг 3 · кто командует</div>
      <h4>Устройство управления разбирает команды</h4>
      <p>
        Команда приходит из памяти в виде нескольких байт. Управление
        расшифровывает их: какая это операция, откуда брать числа, куда класть
        результат — и включает нужные части процессора.
      </p>
    </div>
    <div class="step-panel" data-on="regs alu ctl cache" data-focus="cache">
      <div class="step-kicker">Шаг 4 · кто сокращает ожидание</div>
      <h4>Кэш держит под рукой то, что нужно чаще всего</h4>
      <p>
        Если нужный кусок памяти уже в кэше, ехать наружу не надо. Программы
        обычно крутятся вокруг одних и тех же данных, так что попаданий гораздо
        больше, чем промахов.
      </p>
    </div>
    <div class="step-panel" data-on="regs alu ctl cache sum" data-focus="sum">
      <div class="step-kicker">Шаг 5 · четыре роли</div>
      <h4>Больше ничего знать не нужно</h4>
      <p>
        Всё, что делает процессор, — это перекладывание чисел между регистрами,
        памятью и АЛУ по указаниям устройства управления. В следующей части мы
        посмотрим, как из этого складывается выполнение программы.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> внутри процессора всего четыре роли:
  где лежат числа, кто их складывает, кто командует и кто сокращает ожидание.
  Если захочется деталей — про регистры, шину и машинные команды подробно
  написано в статье
  <a href="article.html?slug=cpu-what-processor-does">«Что делает процессор»</a>.
</div>

<hr>
<h2 id="part-5">Часть 5. Как процессор выполняет программу</h2>

<p>
  Теперь главное. Возьмём маленькую программу из трёх действий: сложить 2 и 5,
  умножить результат на 10, показать его на экране. В памяти она лежит как три
  команды, у каждой свой адрес — условно <code>0xF2</code>, <code>0xF3</code> и
  <code>0xF4</code>.
</p>

<p>
  Процессор выполняет её не «целиком», а по одной команде за раз, и на каждую
  тратит один и тот же круг из четырёх шагов: <strong>выборка</strong> —
  достать команду из памяти по адресу из счётчика; <strong>декодирование</strong> —
  понять, что она означает; <strong>исполнение</strong> — сделать это;
  <strong>запись</strong> — положить результат и сдвинуть счётчик на следующую
  команду. Потом всё сначала.
</p>

<div class="stage" id="stageExec" tabindex="0">
  <div class="stage-figure">
<svg id="ex" viewBox="0 0 960 612" role="img" aria-label="Выполнение программы из трёх команд: регистры, программа в памяти и четыре шага цикла выборка-декодирование-исполнение-запись">
  <style>
    #ex { font-family: Helvetica, Arial, sans-serif; }
    #ex .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.7; }
    #ex .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #ex .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.7; }
    #ex .bn { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.4; }
    #ex .lbl { font-size: 18px; fill: #111111; font-weight: 700; }
    #ex .st { font-size: 16px; fill: #111111; font-weight: 700; }
    #ex .cap { font-size: 13px; fill: #5E5850; }
    #ex .mono { font-size: 14px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; white-space: pre; }
    #ex .res { font-size: 14px; fill: #111111; }
    #ex .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <g data-key="regs">
    <rect x="60" y="110" width="260" height="150" rx="9" class="bx"/>
    <text x="190" y="142" class="lbl" text-anchor="middle">Регистры</text>
    <rect x="80" y="162" width="220" height="38" rx="5" class="bn"/>
    <text x="92" y="187" class="mono">AX = 0</text>
    <rect x="80" y="210" width="220" height="38" rx="5" class="bn"/>
    <text x="92" y="235" class="mono">IP = 0xF2</text>
  </g>
  <g data-key="prog">
    <rect x="560" y="110" width="340" height="170" rx="9" class="bx"/>
    <text x="730" y="142" class="lbl" text-anchor="middle">Программа в памяти</text>
    <text x="578" y="182" class="mono">0xF2  AX = 2 + 5</text>
    <text x="578" y="214" class="mono">0xF3  AX = AX * 10</text>
    <text x="578" y="246" class="mono">0xF4  показать AX</text>
  </g>
  <g data-key="s1">
    <rect x="60" y="330" width="200" height="90" rx="9" class="by"/>
    <text x="160" y="364" class="st" text-anchor="middle">1. Выборка</text>
    <text x="160" y="388" class="cap" text-anchor="middle">взять команду</text>
    <text x="160" y="408" class="cap" text-anchor="middle">по адресу из IP</text>
  </g>
  <g data-key="s2">
    <rect x="280" y="330" width="200" height="90" rx="9" class="by"/>
    <text x="380" y="364" class="st" text-anchor="middle">2. Разбор</text>
    <text x="380" y="388" class="cap" text-anchor="middle">понять, что именно</text>
    <text x="380" y="408" class="cap" text-anchor="middle">нужно сделать</text>
  </g>
  <g data-key="s3">
    <rect x="500" y="330" width="200" height="90" rx="9" class="by"/>
    <text x="600" y="364" class="st" text-anchor="middle">3. Исполнение</text>
    <text x="600" y="388" class="cap" text-anchor="middle">АЛУ выполняет</text>
    <text x="600" y="408" class="cap" text-anchor="middle">операцию</text>
  </g>
  <g data-key="s4">
    <rect x="720" y="330" width="200" height="90" rx="9" class="bg"/>
    <text x="820" y="364" class="st" text-anchor="middle">4. Запись</text>
    <text x="820" y="388" class="cap" text-anchor="middle">результат в регистр,</text>
    <text x="820" y="408" class="cap" text-anchor="middle">IP сдвигается</text>
  </g>
  <g data-key="r1" data-only="1">
    <text x="60" y="470" class="res">после первого круга: AX = 7, следующая команда — 0xF3</text>
  </g>
  <g data-key="r2" data-only="1">
    <text x="60" y="498" class="res">после второго круга: AX = 70, следующая команда — 0xF4</text>
  </g>
  <g data-key="r3" data-only="1">
    <text x="60" y="526" class="res">третий круг отправляет число 70 на экран</text>
  </g>
  <g data-key="sum" data-only="1">
    <text x="60" y="564" class="cap">таких кругов процессор делает миллиарды в секунду — из них и складывается любая программа</text>
  </g>
  <text x="60" y="596" class="legend">синий — память и регистры · жёлтый — работа процессора · зелёный — готовый результат</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="regs prog" data-focus="prog">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Программа — это команды, лежащие в памяти подряд</h4>
      <p>
        Никакого «файла» для процессора не существует: есть ячейки памяти, в
        которых записаны команды, и адреса этих ячеек. В регистре
        <code>IP</code> лежит адрес первой из них — <code>0xF2</code>.
      </p>
    </div>
    <div class="step-panel" data-on="regs prog s1" data-focus="s1">
      <div class="step-kicker">Шаг 2 · выборка</div>
      <h4>Процессор забирает команду по адресу из счётчика</h4>
      <p>
        Тот самый разговор из части 3: назвать адрес <code>0xF2</code>, сказать
        «читаю», дождаться ответа. Обратно приезжают байты команды
        <code>AX = 2 + 5</code>.
      </p>
    </div>
    <div class="step-panel" data-on="regs prog s1 s2" data-focus="s2">
      <div class="step-kicker">Шаг 3 · разбор</div>
      <h4>Устройство управления понимает, что это сложение</h4>
      <p>
        Из байтов команды становится ясно: нужно сложить два числа и положить
        результат в регистр <code>AX</code>. Процессор включает АЛУ и подаёт ему
        нужные значения.
      </p>
    </div>
    <div class="step-panel" data-on="regs prog s1 s2 s3" data-focus="s3">
      <div class="step-kicker">Шаг 4 · исполнение</div>
      <h4>АЛУ складывает 2 и 5</h4>
      <p>
        Это самая быстрая часть круга: сложение занимает у процессора один шаг.
        Заметно дольше было доехать до памяти за самой командой, чем выполнить
        её.
      </p>
    </div>
    <div class="step-panel" data-on="regs prog s1 s2 s3 s4 r1" data-focus="s4">
      <div class="step-kicker">Шаг 5 · запись</div>
      <h4>Результат ложится в регистр, счётчик едет дальше</h4>
      <p>
        В <code>AX</code> теперь 7, а <code>IP</code> указывает на
        <code>0xF3</code>. Никто специально не «переходил к следующей строчке»:
        следующая команда — это просто следующий адрес.
      </p>
    </div>
    <div class="step-panel" data-on="regs prog s1 s2 s3 s4 r1 r2" data-focus="r2">
      <div class="step-kicker">Шаг 6 · второй круг</div>
      <h4>Те же четыре шага для умножения</h4>
      <p>
        Процессор снова забирает команду — теперь по адресу <code>0xF3</code>, —
        разбирает её, отдаёт АЛУ, записывает результат. В <code>AX</code>
        становится 70.
      </p>
    </div>
    <div class="step-panel" data-on="regs prog s1 s2 s3 s4 r1 r2 r3" data-focus="r3">
      <div class="step-kicker">Шаг 7 · третий круг</div>
      <h4>Показать на экране — тоже команда</h4>
      <p>
        Для процессора вывод числа ничем не отличается от сложения: он передаёт
        значение устройству вывода через ту же шину. Дальше уже дело видеокарты
        и экрана.
      </p>
    </div>
    <div class="step-panel" data-on="regs prog s1 s2 s3 s4 r1 r2 r3 sum" data-focus="sum">
      <div class="step-kicker">Шаг 8 · масштаб</div>
      <h4>Вся разница только в количестве</h4>
      <p>
        Наша программа заняла три круга. Открытие браузера — триллионы таких же
        кругов. Процессор не делает ничего другого: берёт команду, выполняет,
        сдвигает счётчик — и так с момента включения до выключения.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout-blue">
  <strong>Откуда берётся скорость.</strong> Современный процессор не ждёт, пока
  один круг закончится, чтобы начать следующий: пока первая команда исполняется,
  вторая уже разбирается, а третья — выбирается из памяти. Это называется
  конвейером и работает как конвейер на заводе. Плюс ядер в процессоре обычно
  несколько, и каждое крутит свои круги независимо.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> процессор бесконечно повторяет один и
  тот же круг из четырёх шагов. Любая программа — от калькулятора до
  видеоигры — это просто очень много таких кругов.
</div>

<hr>

<h2 id="part-6">Часть 6. Что происходит, когда вы запускаете программу</h2>

<p>
  Соберём картинку целиком. Вы дважды щёлкнули по значку или набрали команду в
  терминале. Дальше всё делает <strong>операционная система</strong> — Windows,
  macOS или Linux: это главная программа компьютера, которая распоряжается
  памятью, диском и процессором и запускает все остальные программы.
</p>

<div class="stage" id="stageRun" tabindex="0">
  <div class="stage-figure">
<svg id="rn" viewBox="0 0 960 444" role="img" aria-label="Путь запуска программы: файл на диске, операционная система, программа в памяти, процессор и экран">
  <style>
    #rn { font-family: Helvetica, Arial, sans-serif; }
    #rn .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.7; }
    #rn .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #rn .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.7; }
    #rn .lbl { font-size: 16px; fill: #111111; font-weight: 700; }
    #rn .cap { font-size: 13px; fill: #5E5850; }
    #rn .edge { stroke: #5E5850; stroke-width: 2; fill: none; }
    #rn .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="rn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>
  <g data-key="f1">
    <rect x="20" y="120" width="160" height="90" rx="9" class="bx"/>
    <text x="100" y="158" class="lbl" text-anchor="middle">Файл</text>
    <text x="100" y="182" class="lbl" text-anchor="middle">на диске</text>
    <text x="100" y="244" class="cap" text-anchor="middle">просто набор байтов</text>
  </g>
  <g data-key="f2">
    <line x1="184" y1="165" x2="206" y2="165" class="edge" marker-end="url(#rn-arw)"/>
    <rect x="210" y="120" width="160" height="90" rx="9" class="by"/>
    <text x="290" y="158" class="lbl" text-anchor="middle">Операционная</text>
    <text x="290" y="182" class="lbl" text-anchor="middle">система</text>
    <text x="290" y="244" class="cap" text-anchor="middle">находит, проверяет,</text>
    <text x="290" y="264" class="cap" text-anchor="middle">выделяет память</text>
  </g>
  <g data-key="f3">
    <line x1="374" y1="165" x2="396" y2="165" class="edge" marker-end="url(#rn-arw)"/>
    <rect x="400" y="120" width="160" height="90" rx="9" class="bx"/>
    <text x="480" y="158" class="lbl" text-anchor="middle">Программа</text>
    <text x="480" y="182" class="lbl" text-anchor="middle">в памяти</text>
    <text x="480" y="244" class="cap" text-anchor="middle">команды и данные</text>
    <text x="480" y="264" class="cap" text-anchor="middle">готовы к работе</text>
  </g>
  <g data-key="f4">
    <line x1="564" y1="165" x2="586" y2="165" class="edge" marker-end="url(#rn-arw)"/>
    <rect x="590" y="120" width="160" height="90" rx="9" class="by"/>
    <text x="670" y="170" class="lbl" text-anchor="middle">Процессор</text>
    <text x="670" y="244" class="cap" text-anchor="middle">выполняет команду</text>
    <text x="670" y="264" class="cap" text-anchor="middle">за командой</text>
  </g>
  <g data-key="f5">
    <line x1="754" y1="165" x2="776" y2="165" class="edge" marker-end="url(#rn-arw)"/>
    <rect x="780" y="120" width="160" height="90" rx="9" class="bg"/>
    <text x="860" y="170" class="lbl" text-anchor="middle">Экран</text>
    <text x="860" y="244" class="cap" text-anchor="middle">результат видите вы</text>
  </g>
  <g data-key="explain" data-only="1">
    <text x="20" y="316" class="cap">программа не выполняется прямо с диска: сначала её целиком копируют в оперативную память</text>
  </g>
  <g data-key="watch" data-only="1">
    <text x="20" y="346" class="cap">пока она работает, операционная система делит процессор между всеми запущенными программами</text>
  </g>
  <g data-key="sum" data-only="1">
    <text x="20" y="376" class="cap">поэтому запуск программы — это всегда работа операционной системы, а не только вашего кода</text>
  </g>
  <text x="20" y="418" class="legend">синий — данные · жёлтый — тот, кто работает · зелёный — то, что видно снаружи</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="f1" data-focus="f1">
      <div class="step-kicker">Шаг 1 · до запуска</div>
      <h4>На диске лежит просто файл</h4>
      <p>
        Пока вы его не запустили, это никакая не программа, а набор байтов среди
        миллионов других файлов. Ничего не происходит и происходить не может:
        диск не умеет считать.
      </p>
    </div>
    <div class="step-panel" data-on="f1 f2" data-focus="f2">
      <div class="step-kicker">Шаг 2 · система берётся за дело</div>
      <h4>Операционная система готовит запуск</h4>
      <p>
        Она находит файл, проверяет, что его можно запускать, выделяет новой
        программе кусок оперативной памяти и подгружает всё, что той
        понадобится.
      </p>
    </div>
    <div class="step-panel" data-on="f1 f2 f3 explain" data-focus="f3">
      <div class="step-kicker">Шаг 3 · переезд</div>
      <h4>Программа копируется с диска в память</h4>
      <p>
        Только теперь появляется то, что можно выполнять: команды лежат в
        оперативной памяти по конкретным адресам. Запущенная программа со всем
        своим хозяйством называется <strong>процессом</strong>.
      </p>
    </div>
    <div class="step-panel" data-on="f1 f2 f3 explain f4" data-focus="f4">
      <div class="step-kicker">Шаг 4 · работа</div>
      <h4>Процессор начинает крутить свои круги</h4>
      <p>
        Система сообщает процессору адрес первой команды — и дальше всё идёт так,
        как в части 5: выборка, разбор, исполнение, запись. Миллионы раз в
        секунду.
      </p>
    </div>
    <div class="step-panel" data-on="f1 f2 f3 explain f4 f5" data-focus="f5">
      <div class="step-kicker">Шаг 5 · результат</div>
      <h4>Число доезжает до экрана</h4>
      <p>
        Чтобы что-то показать, программа не рисует пиксели сама — она просит об
        этом операционную систему, а та обращается к видеокарте. Тот же путь
        проходит любое сохранение файла или запрос в сеть.
      </p>
    </div>
    <div class="step-panel" data-on="f1 f2 f3 explain f4 f5 watch sum" data-focus="sum">
      <div class="step-kicker">Шаг 6 · кто здесь главный</div>
      <h4>Ваша программа не одна</h4>
      <p>
        Одновременно запущены десятки процессов, а ядер у процессора несколько.
        Система быстро переключает их: каждому даётся крошечный отрезок времени,
        потом очередь переходит к следующему. Поэтому кажется, что всё работает
        одновременно.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> запуск программы — это переезд с диска в
  память плюс постоянный присмотр операционной системы. Что именно она при этом
  делает, подробно разобрано в статье
  <a href="article.html?slug=operating-system">«Зачем нужна операционная система»</a>.
</div>

<hr>

<h2 id="part-7">Часть 7. Где во всём этом Python</h2>

<p>
  Процессор понимает только машинные команды — короткие байтовые указания вроде
  «сложи эти два регистра». Ваш файл на Python — это текст, и никакой процессор
  такого не понимает. Значит, между ними обязательно кто-то стоит.
</p>

<p>
  Этот кто-то — <strong>интерпретатор Python</strong>, программа с именем
  <code>python</code>. Когда вы набираете <code>python program.py</code>,
  запускается не ваша программа, а интерпретатор; ваш файл он получает как
  данные, читает его и делает то, что там написано. Из всего, что мы разобрали,
  ничего не меняется: интерпретатор — обычный процесс, он лежит в оперативной
  памяти, и процессор крутит его команды теми же кругами.
</p>

<div class="stage" id="stagePython" tabindex="0">
  <div class="stage-figure">
<svg id="py" viewBox="0 0 960 556" role="img" aria-label="Слои: файл на Python, интерпретатор, машинные команды и процессор">
  <style>
    #py { font-family: Helvetica, Arial, sans-serif; }
    #py .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.7; }
    #py .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #py .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.7; }
    #py .lbl { font-size: 18px; fill: #111111; font-weight: 700; }
    #py .cap { font-size: 13px; fill: #5E5850; }
    #py .edge { stroke: #5E5850; stroke-width: 2; fill: none; }
    #py .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="py-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>
  <g data-key="f">
    <rect x="200" y="80" width="560" height="70" rx="9" class="bx"/>
    <text x="480" y="112" class="lbl" text-anchor="middle">Ваш файл program.py</text>
    <text x="480" y="136" class="cap" text-anchor="middle">текст, который написали вы</text>
  </g>
  <g data-key="pyi">
    <line x1="480" y1="152" x2="480" y2="176" class="edge" marker-end="url(#py-arw)"/>
    <rect x="200" y="180" width="560" height="70" rx="9" class="by"/>
    <text x="480" y="212" class="lbl" text-anchor="middle">Интерпретатор Python</text>
    <text x="480" y="236" class="cap" text-anchor="middle">обычная программа: читает ваш файл и делает то, что в нём написано</text>
  </g>
  <g data-key="mc">
    <line x1="480" y1="252" x2="480" y2="276" class="edge" marker-end="url(#py-arw)"/>
    <rect x="200" y="280" width="560" height="70" rx="9" class="by"/>
    <text x="480" y="312" class="lbl" text-anchor="middle">Машинные команды</text>
    <text x="480" y="336" class="cap" text-anchor="middle">то единственное, что понимает процессор</text>
  </g>
  <g data-key="cpu">
    <line x1="480" y1="352" x2="480" y2="376" class="edge" marker-end="url(#py-arw)"/>
    <rect x="200" y="380" width="560" height="70" rx="9" class="bg"/>
    <text x="480" y="412" class="lbl" text-anchor="middle">Процессор</text>
    <text x="480" y="436" class="cap" text-anchor="middle">выполняет их круг за кругом</text>
  </g>
  <g data-key="note" data-only="1">
    <text x="40" y="482" class="cap">между вашей строчкой и процессором стоит ещё одна программа — отсюда и удобство Python, и его неспешность</text>
  </g>
  <g data-key="sum" data-only="1">
    <text x="40" y="510" class="cap">дальше в цикле мы разберём, что именно интерпретатор делает с вашим кодом</text>
  </g>
  <text x="40" y="542" class="legend">синий — то, что написали вы · жёлтый — программы-посредники · зелёный — железо</text>
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
      <div class="step-kicker">Шаг 1 · ваш код</div>
      <h4>Файл на Python — это просто текст</h4>
      <p>
        Его можно открыть блокнотом и прочитать. Для компьютера в нём нет ничего
        волшебного: буквы, пробелы и переводы строк, записанные байтами. Сам по
        себе он ничего не делает.
      </p>
    </div>
    <div class="step-panel" data-on="f pyi" data-focus="pyi">
      <div class="step-kicker">Шаг 2 · переводчик</div>
      <h4>Интерпретатор читает ваш файл и исполняет его</h4>
      <p>
        Он разбирает текст, понимает, что <code>print</code> — это вывод, а
        <code>+</code> — сложение, и выполняет действия одно за другим. Для
        операционной системы это самый обычный процесс, такой же, как браузер.
      </p>
    </div>
    <div class="step-panel" data-on="f pyi mc" data-focus="mc">
      <div class="step-kicker">Шаг 3 · вниз до железа</div>
      <h4>Сам интерпретатор состоит из машинных команд</h4>
      <p>
        Его когда-то написали на языке C и заранее перевели в машинный код —
        поэтому он умеет работать напрямую с процессором. Вашего кода
        процессор по-прежнему не видит: он видит только команды интерпретатора.
      </p>
    </div>
    <div class="step-panel" data-on="f pyi mc cpu" data-focus="cpu">
      <div class="step-kicker">Шаг 4 · знакомый круг</div>
      <h4>Дальше всё как в части 5</h4>
      <p>
        Выборка, разбор, исполнение, запись. Процессор не знает ни про Python,
        ни про ваши переменные — он просто выполняет то, что ему принесли.
      </p>
    </div>
    <div class="step-panel" data-on="f pyi mc cpu note" data-focus="note">
      <div class="step-kicker">Шаг 5 · цена и польза</div>
      <h4>За удобство платят лишним слоем</h4>
      <p>
        Одна ваша строчка превращается в десятки действий интерпретатора и сотни
        машинных команд. Поэтому Python медленнее, чем C, — и поэтому же на нём
        можно написать за десять минут то, что иначе заняло бы день.
      </p>
    </div>
    <div class="step-panel" data-on="f pyi mc cpu note sum" data-focus="sum">
      <div class="step-kicker">Шаг 6 · что дальше</div>
      <h4>Теперь можно разбираться в самом языке</h4>
      <p>
        Дальше в цикле — переменные, списки, циклы и функции. Всякий раз, когда
        что-то покажется магией, вспоминайте эту лестницу: внизу всё равно
        регистры, память и четыре шага одного круга.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> Python — это программа, которая читает
  ваш файл и делает то, что в нём написано. Откуда вообще взялись компиляторы и
  интерпретаторы, рассказано в статье
  <a href="article.html?slug=programming-languages">«Как появились языки программирования»</a>.
</div>

<hr>

<h2 id="part-8">Часть 8. Что важно запомнить</h2>

<ol class="end-list">
  <li><strong>Компьютер — это несколько частей на общих проводах.</strong>
    Процессор считает, оперативная память хранит текущее, диск хранит
    постоянное, устройства ввода-вывода связывают с миром.</li>
  <li><strong>Памяти несколько, потому что идеальной не бывает.</strong>
    Регистры, кэш, оперативная память, диск — от крошечной и мгновенной до
    огромной и медленной.</li>
  <li><strong>Оперативная память — это пронумерованные ячейки.</strong>
    Процессор называет адрес, говорит «читай» или «пиши» и ждёт ответа. Имён
    переменных на этом уровне уже нет.</li>
  <li><strong>Внутри процессора четыре роли.</strong> Регистры хранят числа,
    АЛУ считает, устройство управления разбирает команды, кэш сокращает
    ожидание.</li>
  <li><strong>Выполнение программы — это бесконечный круг из четырёх
    шагов.</strong> Выборка, разбор, исполнение, запись — и счётчик команд
    сдвигается на следующую.</li>
  <li><strong>Запуск программы делает операционная система.</strong> Она
    копирует файл с диска в память, выделяет ресурсы и потом делит процессор
    между всеми процессами.</li>
  <li><strong>Python — это ещё одна программа поверх всего этого.</strong>
    Ваш файл для неё — данные. Отсюда и удобство языка, и его цена в скорости.</li>
  <li><strong>Процессор в основном ждёт, а не считает.</strong> Сложение — самое
    дешёвое, что он делает; дорого добираться до данных.</li>
</ol>

<p>
  Если унести из статьи одну картинку, пусть это будет круг: взять команду,
  разобрать, выполнить, сдвинуть счётчик. Всё остальное — способы кормить этот
  круг данными побыстрее. Теперь, когда вы будете писать на Python цикл или
  создавать список, вы будете примерно представлять, что под этим происходит, — и
  этого достаточно, чтобы двигаться дальше.
</p>

<p class="tiny">
  Статья вводная: адреса <code>0xF2</code>, <code>0xF3</code>, <code>0xF4</code>
  и содержимое регистров в примере условные, взяты для наглядности. Сравнения
  скоростей («минуты», «месяцы») — грубая аналогия для порядков величин: на
  разных машинах числа заметно отличаются. Точные измерения и подробные разборы —
  в статьях, на которые стоят ссылки в тексте.
</p>
