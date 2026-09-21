<style>

  .term { background: #1B1D26; border: 1px solid #2C2F3C; border-radius: 12px; margin: 22px 0 6px; overflow: hidden; }
  .term-head { background: #252834; color: #C9CEDB; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; padding: 8px 14px; border-bottom: 1px solid #2C2F3C; }
  .term-screen { font-family: "Courier New", Courier, monospace; font-size: 13.5px; line-height: 1.5; color: #DDE3EE; padding: 14px 16px; max-height: 360px; overflow: auto; white-space: pre; }
  .term-screen div { min-height: 1px; }
  .term-screen .cmd { color: #8FD14F; }
  .term-screen .bad { color: #F08B8A; }
  .term-screen .note { color: #9AA3B5; }
  .term-line { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-top: 1px solid #2C2F3C; background: #20232E; }
  .term-ps { color: #8FD14F; font-family: "Courier New", Courier, monospace; font-size: 14px; }
  .term-in { flex: 1; background: transparent; border: 0; outline: none; color: #FFE9A8; font-family: "Courier New", Courier, monospace; font-size: 14px; caret-color: #FFE9A8; }
  .term-cmds { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px 12px; background: #20232E; border-top: 1px solid #2C2F3C; }
  .term-cmds button { font-family: "Courier New", Courier, monospace; font-size: 12.5px; color: #DDE3EE; background: #2C3040; border: 1px solid #3A3F52; border-radius: 7px; padding: 5px 10px; cursor: pointer; }
  .term-cmds button:hover { background: #3A4056; }
  .term-hint { font-size: 13px; color: #5E5850; margin: 6px 0 26px; }
</style>



<p class="lead">
  Операционная система — не «программа, которая запускает программы». Это
  единственный код в машине, которому процессор разрешает трогать железо.
  Всё остальное может только попросить — и каждая просьба проходит через
  одни и те же ворота.
</p>

<p>
  В <a href="article.html?slug=computer-architecture">разборе устройства компьютера</a> речь шла
  об аппаратном уровне: процессор, память, накопитель, шина. Здесь мы поднимаемся
  на этаж выше — к тому, кто всем этим железом распоряжается. Мы пройдём путь
  одного действия пользователя от нажатия клавиши до записи байтов на диск и по
  дороге зайдём в каждую подсистему ядра.
</p>

<p>
  Все числа в статье — не иллюстративные. Они измерены на настоящей машине:
  Linux 6.18, x86-64, одно ядро на 2,1 ГГц, 3,9 ГиБ памяти. Код замеров простой,
  и в каждом месте сказано, что именно замерялось.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Из чего состоит компьютер</strong>
    <p>Достаточно помнить, что есть процессор, оперативная память, накопитель и шина между ними.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Редактор notes сохраняет файл</strong>
    <p>Нажали W, нажали «Сохранить», 4200 байт ушли на диск — и всё это на одном ядре вместе с двумя другими процессами.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Кто отвечает за каждый шаг</strong>
    <p>Вы сможете назвать подсистему ядра, которая обслуживает любое действие программы, и объяснить, почему без неё нельзя.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>пространство пользователя, данные</span>
  <span><i style="background:#C29E08"></i>работа ядра, операция</span>
  <span><i style="background:#73B222"></i>результат, вернувшийся приложению</span>
  <span><i style="background:#C30B0A"></i>запрет, отказ, поломка</span>
  <span><i style="background:#5E5850"></i>железо и контекст</span>
</div>


<div class="callout-blue">
  <strong>Как работать со статьёй:</strong> в ней два вида интерактива. Сцены
  листаются кнопкой «Далее» — смотрите не на всю схему сразу, а только на яркую
  часть; положение блоков не меняется, меняется смысл шага. Стрелки на клавиатуре
  работают, когда сцена в фокусе. Кроме сцен есть чёрные консоли: там можно
  нажать на команду или набрать её руками и увидеть настоящий вывод, записанный
  с той самой машины, на которой сделаны замеры.
</div>

---

## Часть 1. Прослойка между вами и железом

<p>
  Представьте, что операционной системы нет. Вы хотите открыть текстовый файл.
  Значит, вам нужно самому найти на диске, в каком месте лежат его байты,
  самому попросить контроллер накопителя прочитать нужные секторы, самому
  выбрать свободный участок оперативной памяти, куда их положить, самому
  разложить пиксели букв в видеопамять — и всё это, помня, что рядом ничего
  другого работать не должно, потому что делить машину не с кем и не через что.
</p>

<p>
  Именно поэтому появилась прослойка.
</p>

<div class="callout-blue">
  <strong>Операционная система</strong> — это набор программ, который управляет
  аппаратным обеспечением компьютера и приложениями, а также распределяет доступ
  к ресурсам: памяти, процессорному времени, устройствам ввода-вывода и файловому
  хранилищу.
</div>

<p>
  Ключевое слово здесь — <strong>распределяет</strong>. Ресурс один, желающих
  много: браузер, редактор, антивирус, десятки служебных процессов. ОС стоит
  между ними и железом и решает, кому, сколько и когда. Программа не берёт
  память — программа просит память. Программа не читает диск — программа просит
  прочитать файл.
</p>

<p>
  Отсюда и иерархия: у одной системы может быть несколько пользователей (поэтому
  вы и выбираете себя перед входом на рабочий стол), от имени пользователя
  запускаются программы, программы обращаются к ОС, ОС — к железу. Причём
  многопользовательская работа не музейная древность: в 1960-х один компьютер
  обслуживал десятки терминалов, а сегодня то же самое делают удалённые сессии,
  серверы приложений и облачные сервисы.
</p>

<p>Посмотрим на весь маршрут сразу — дальше вся статья будет ходить по этой карте.</p>

<div class="stage" id="stageOv" tabindex="0">
  <div class="stage-figure">
<svg id="ov" viewBox="0 0 960 580" role="img" aria-label="Общая карта: пользователь, приложения, граница ядра, подсистемы ядра, драйверы и железо">
  <style>
    #ov { font-family: Helvetica, Arial, sans-serif; }
    #ov .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ov .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ov .bh { fill: #F2F0EA; stroke: #5E5850; stroke-width: 1.5; }
    #ov .lbl { font-size: 16px; fill: #111111; }
    #ov .sm { font-size: 13px; fill: #5E5850; }
    #ov .band { font-size: 12.5px; fill: #5E5850; letter-spacing: .08em; }
    #ov .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #ov .dash { stroke: #5E5850; stroke-width: 2; fill: none; stroke-dasharray: 8 6; }
    #ov .redge { stroke: #C30B0A; stroke-width: 2.2; fill: none; stroke-dasharray: 7 5; }
    #ov .rx { stroke: #C30B0A; stroke-width: 3; }
    #ov .rtx { font-size: 14px; fill: #C30B0A; }
    #ov .gedge { stroke: #73B222; stroke-width: 2.2; fill: none; }
    #ov .gtx { font-size: 13px; fill: #5A8C1C; }
    #ov .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ov-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="ov-rarw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
    <marker id="ov-garw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
  </defs>

  <g data-key="usr">
    <rect x="40" y="40" width="880" height="54" rx="9" class="bx"/>
    <text x="60" y="73" class="lbl">Пользователь</text>
    <text x="215" y="73" class="sm">нажал клавишу W, потом нажал «Сохранить»</text>
    <line x1="175" y1="94" x2="175" y2="130" class="edge" marker-end="url(#ov-arw)"/>
  </g>

  <text x="40" y="126" class="band">ПРОСТРАНСТВО ПОЛЬЗОВАТЕЛЯ (USER SPACE)</text>

  <g data-key="sh">
    <rect x="40" y="136" width="270" height="64" rx="9" class="bx"/>
    <text x="175" y="162" class="lbl" text-anchor="middle">Оболочка (shell)</text>
    <text x="175" y="184" class="sm" text-anchor="middle">bash, explorer.exe</text>
  </g>

  <g data-key="app">
    <line x1="310" y1="168" x2="341" y2="168" class="edge" marker-end="url(#ov-arw)"/>
    <rect x="345" y="136" width="270" height="64" rx="9" class="bx"/>
    <text x="480" y="162" class="lbl" text-anchor="middle">Приложение notes</text>
    <text x="480" y="184" class="sm" text-anchor="middle">обычный текстовый редактор</text>
  </g>

  <g data-key="lib">
    <line x1="615" y1="168" x2="646" y2="168" class="edge" marker-end="url(#ov-arw)"/>
    <rect x="650" y="136" width="270" height="64" rx="9" class="bx"/>
    <text x="785" y="162" class="lbl" text-anchor="middle">Библиотека libc</text>
    <text x="785" y="184" class="sm" text-anchor="middle">.so в Linux, .dll в Windows</text>
  </g>

  <g data-key="bound">
    <line x1="40" y1="250" x2="920" y2="250" class="dash"/>
    <text x="40" y="242" class="band">ГРАНИЦА ПРИВИЛЕГИЙ · ВСЁ НИЖЕ РАБОТАЕТ В РЕЖИМЕ ЯДРА</text>
  </g>

  <g data-key="gate">
    <line x1="785" y1="200" x2="785" y2="218" class="edge" marker-end="url(#ov-arw)"/>
    <rect x="650" y="222" width="270" height="56" rx="9" class="by"/>
    <text x="785" y="245" class="lbl" text-anchor="middle">Системный вызов</text>
    <text x="785" y="266" class="sm" text-anchor="middle">write(fd, buf, 4200)</text>
  </g>

  <text x="40" y="306" class="band">ПРОСТРАНСТВО ЯДРА (KERNEL SPACE)</text>

  <g data-key="subs">
    <line x1="785" y1="278" x2="785" y2="300" class="edge"/>
    <line x1="122" y1="300" x2="838" y2="300" class="edge"/>
    <rect x="40" y="316" width="164" height="76" rx="9" class="by"/>
    <text x="122" y="348" class="lbl" text-anchor="middle">Планировщик</text>
    <text x="122" y="370" class="lbl" text-anchor="middle">процессов</text>
    <line x1="122" y1="300" x2="122" y2="312" class="edge" marker-end="url(#ov-arw)"/>
    <rect x="219" y="316" width="164" height="76" rx="9" class="by"/>
    <text x="301" y="348" class="lbl" text-anchor="middle">Межпроцессное</text>
    <text x="301" y="370" class="lbl" text-anchor="middle">взаимодействие</text>
    <line x1="301" y1="300" x2="301" y2="312" class="edge" marker-end="url(#ov-arw)"/>
    <rect x="398" y="316" width="164" height="76" rx="9" class="by"/>
    <text x="480" y="348" class="lbl" text-anchor="middle">Файловая</text>
    <text x="480" y="370" class="lbl" text-anchor="middle">система</text>
    <line x1="480" y1="300" x2="480" y2="312" class="edge" marker-end="url(#ov-arw)"/>
    <rect x="577" y="316" width="164" height="76" rx="9" class="by"/>
    <text x="659" y="348" class="lbl" text-anchor="middle">Менеджер</text>
    <text x="659" y="370" class="lbl" text-anchor="middle">памяти</text>
    <line x1="659" y1="300" x2="659" y2="312" class="edge" marker-end="url(#ov-arw)"/>
    <rect x="756" y="316" width="164" height="76" rx="9" class="by"/>
    <text x="838" y="348" class="lbl" text-anchor="middle">Блок работы</text>
    <text x="838" y="370" class="lbl" text-anchor="middle">с устройствами</text>
    <line x1="838" y1="300" x2="838" y2="312" class="edge" marker-end="url(#ov-arw)"/>
  </g>

  <g data-key="drv">
    <line x1="122" y1="392" x2="122" y2="408" class="edge"/>
    <line x1="301" y1="392" x2="301" y2="408" class="edge"/>
    <line x1="480" y1="392" x2="480" y2="408" class="edge"/>
    <line x1="659" y1="392" x2="659" y2="408" class="edge"/>
    <line x1="838" y1="392" x2="838" y2="408" class="edge"/>
    <line x1="122" y1="408" x2="838" y2="408" class="edge"/>
    <line x1="480" y1="408" x2="480" y2="420" class="edge" marker-end="url(#ov-arw)"/>
    <rect x="340" y="424" width="280" height="50" rx="9" class="by"/>
    <text x="480" y="455" class="lbl" text-anchor="middle">Драйверы устройств</text>
    <line x1="480" y1="474" x2="480" y2="492" class="edge" marker-end="url(#ov-arw)"/>
  </g>

  <text x="40" y="488" class="band">ЖЕЛЕЗО</text>

  <g data-key="hw">
    <rect x="40" y="496" width="880" height="54" rx="9" class="bh"/>
    <line x1="211" y1="496" x2="211" y2="550" class="edge"/>
    <line x1="390" y1="496" x2="390" y2="550" class="edge"/>
    <line x1="569" y1="496" x2="569" y2="550" class="edge"/>
    <line x1="748" y1="496" x2="748" y2="550" class="edge"/>
    <text x="125" y="529" class="lbl" text-anchor="middle">Процессор</text>
    <text x="300" y="529" class="lbl" text-anchor="middle">Оперативная память</text>
    <text x="480" y="529" class="lbl" text-anchor="middle">SSD</text>
    <text x="658" y="529" class="lbl" text-anchor="middle">Клавиатура</text>
    <text x="834" y="529" class="lbl" text-anchor="middle">Сетевая карта</text>
  </g>

  <g data-key="noway" data-only="1">
    <path d="M 480 200 L 480 490" class="redge" marker-end="url(#ov-rarw)"/>
    <line x1="466" y1="236" x2="494" y2="264" class="rx"/>
    <line x1="494" y1="236" x2="466" y2="264" class="rx"/>
    <text x="506" y="245" class="rtx">напрямую к железу нельзя</text>
  </g>

  <g data-key="back" data-only="1">
    <path d="M 926 520 L 946 520 L 946 120 L 928 120" class="gedge" marker-end="url(#ov-garw)"/>
    <text x="940" y="110" class="gtx" text-anchor="end">ответ возвращается тем же путём</text>
  </g>

  <text x="40" y="570" class="legend">синий — пространство пользователя · жёлтый — работа ядра · зелёный — ответ · красный — запрет · серый — железо</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="usr sh app hw" data-focus="usr">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Человек, программа и железо</h4>
      <p>Вы нажимаете клавишу и нажимаете «Сохранить». Между вашим пальцем и микросхемой SSD лежат несколько слоёв, и почти ни один из них вам не виден.</p>
      <p>Обратите внимание: оболочка и приложение нарисованы на одном уровне. Оболочка — такая же обычная программа, просто её работа состоит в том, чтобы запускать другие.</p>
    </div>
    <div class="step-panel" data-on="usr sh app hw noway" data-focus="noway">
      <div class="step-kicker">Шаг 2 · главный запрет</div>
      <h4>Приложение не может дотянуться до железа</h4>
      <p>Красная стрелка перечёркнута не для красоты. Это физическое ограничение: процессор, исполняя код обычной программы, отказывается выполнять инструкции обращения к устройствам и не даёт читать чужую память.</p>
      <p>Значит, у прикладного кода нет способа «обойти» операционную систему. Не «не принято», а именно нет.</p>
    </div>
    <div class="step-panel" data-on="usr sh app lib hw" data-focus="lib">
      <div class="step-kicker">Шаг 3 · удобство, но не власть</div>
      <h4>Библиотека — это ещё не ядро</h4>
      <p>Приложение почти никогда не разговаривает с ядром напрямую: оно зовёт готовую функцию из библиотеки — <code>read()</code>, <code>fopen()</code>, <code>malloc()</code>.</p>
      <p>Но библиотека живёт в том же пространстве пользователя и с теми же правами. Она не даёт новых возможностей, она лишь избавляет от рутины.</p>
    </div>
    <div class="step-panel" data-on="usr sh app lib bound gate hw" data-focus="gate">
      <div class="step-kicker">Шаг 4 · единственная дверь</div>
      <h4>Системный вызов</h4>
      <p>Единственный законный переход через границу — системный вызов. Программа кладёт в регистры номер операции и аргументы и выполняет специальную инструкцию, после которой процессор переключается в режим ядра.</p>
      <p>Всё, что программа хочет от мира за пределами своей памяти, она получает так и только так.</p>
    </div>
    <div class="step-panel" data-on="usr sh app lib bound gate subs hw" data-focus="subs">
      <div class="step-kicker">Шаг 5 · сортировка запроса</div>
      <h4>За воротами — пять подсистем</h4>
      <p>Ядро смотрит на номер вызова и отдаёт запрос профильной службе: «открой файл» — файловой системе, «дай память» — менеджеру памяти, «усни на секунду» — планировщику.</p>
      <p>Части с 5 по 9 — это ровно эти пять прямоугольников, по одной части на каждый.</p>
    </div>
    <div class="step-panel" data-on="usr sh app lib bound gate subs drv hw" data-focus="drv">
      <div class="step-kicker">Шаг 6 · разговор с устройством</div>
      <h4>Драйвер знает язык железа</h4>
      <p>Подсистема ядра работает в общих понятиях: «файл», «блок», «пакет». Превратить это в конкретные команды конкретной микросхемы умеет драйвер — программа, написанная под определённое устройство.</p>
    </div>
    <div class="step-panel" data-on="usr sh app lib bound gate subs drv hw back" data-focus="back">
      <div class="step-kicker">Шаг 7 · обратный путь</div>
      <h4>Ответ идёт тем же маршрутом</h4>
      <p>Устройство отвечает, ядро складывает результат туда, где его ждёт программа, возвращает процессор в непривилегированный режим — и приложение продолжает с того места, где остановилось.</p>
      <p>Вся дальнейшая статья — это движение по этой карте: сверху вниз и обратно.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> операционная система нужна не для удобства,
  а потому что прикладной программе физически не разрешено обращаться к железу.
  Всё, что ей остаётся, — просить.
</div>

---

## Часть 2. Два режима процессора и два пространства

<p>
  Запрет из первой части нужно во что-то упереть. Нельзя же просто договориться,
  что программы ведут себя прилично: любая программа состоит из тех же инструкций,
  что и ядро, и исполняет их тот же процессор. Значит, различать своих и чужих
  должен сам процессор.
</p>

<p>
  Он и различает. У архитектуры x86-64 есть четыре <strong>уровня привилегий</strong>,
  их по традиции называют кольцами. Уровень 0 — <strong>режим ядра</strong>
  (Kernel Mode): доступно всё, включая инструкции работы с устройствами и любую
  память. Уровень 3 — <strong>пользовательский режим</strong> (User Mode): браузеры,
  игры, офисные пакеты. Уровни 1 и 2 задумывались для системных служб, но ни
  Windows, ни Linux ими не пользуются — архитектуру решили не усложнять.
</p>

<div class="callout-red">
  <strong>Цена ошибки в кольце 0:</strong> сбой в обычной программе убивает одну
  программу. Сбой в коде, работающем в кольце 0, некому перехватить — это тот
  самый «синий экран смерти» в Windows и kernel panic в Linux. Поэтому в ядро
  пускают крайне неохотно, а драйверы — самая частая причина таких падений.
</div>

<p>
  Раз есть два уровня доступа, должны быть и две территории. Адресное пространство
  делится на <strong>пространство пользователя</strong> (User Space), где живут
  приложения, и <strong>пространство ядра</strong> (Kernel Space), куда пускают
  только в кольце 0. Причём один и тот же процессор играет обе роли по очереди:
  секунду назад он исполнял ваш редактор, сейчас — код ядра, через микросекунду
  снова вернётся к редактору.
</p>

<div class="stage" id="stageRg" tabindex="0">
  <div class="stage-figure">
<svg id="rg" viewBox="0 0 960 560" role="img" aria-label="Четыре кольца привилегий процессора и деление адресного пространства на пространство ядра и пространство пользователя">
  <style>
    #rg { font-family: Helvetica, Arial, sans-serif; }
    #rg .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #rg .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #rg .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #rg .bn { fill: #F2F0EA; stroke: #5E5850; stroke-width: 1.5; }
    #rg .lbl { font-size: 15px; fill: #111111; }
    #rg .big { font-size: 16px; fill: #111111; }
    #rg .sm { font-size: 13px; fill: #5E5850; }
    #rg .band { font-size: 12.5px; fill: #5E5850; letter-spacing: .08em; }
    #rg .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #rg .dash { stroke: #5E5850; stroke-width: 2; fill: none; stroke-dasharray: 8 6; }
    #rg .redge { stroke: #C30B0A; stroke-width: 2.4; fill: none; stroke-dasharray: 7 5; }
    #rg .rx { stroke: #C30B0A; stroke-width: 3; }
    #rg .rtx { font-size: 14px; fill: #C30B0A; }
    #rg .yedge { stroke: #C29E08; stroke-width: 2.6; fill: none; }
    #rg .ytx { font-size: 14px; fill: #8C7106; }
    #rg .gtx { font-size: 13px; fill: #5A8C1C; }
    #rg .strip { fill: #F8FBFE; stroke: #D9E4F0; stroke-width: 1.2; }
    #rg .striplab { font-size: 12px; fill: #2A5E9B; letter-spacing: .07em; }
    #rg .stripval { font-size: 14px; fill: #111111; }
    #rg .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="rg-rarw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
    <marker id="rg-yarw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
  </defs>

  <text x="240" y="44" class="sm" text-anchor="middle">Уровни привилегий процессора x86-64</text>

  <g data-key="r3">
    <circle cx="240" cy="250" r="190" class="bx"/>
    <text x="240" y="88" class="lbl" text-anchor="middle">Кольцо 3 · приложения</text>
  </g>
  <g data-key="r2">
    <circle cx="240" cy="250" r="150" class="bn"/>
    <text x="240" y="128" class="lbl" text-anchor="middle">Кольцо 2</text>
  </g>
  <g data-key="r1">
    <circle cx="240" cy="250" r="110" class="bn"/>
    <text x="240" y="168" class="lbl" text-anchor="middle">Кольцо 1</text>
  </g>
  <g data-key="r0">
    <circle cx="240" cy="250" r="70" class="by"/>
    <text x="240" y="243" class="lbl" text-anchor="middle">Кольцо 0</text>
    <text x="240" y="265" class="sm" text-anchor="middle">ядро и драйверы</text>
  </g>

  <g data-key="mid" data-only="1">
    <text x="240" y="450" class="sm" text-anchor="middle">кольца 1 и 2 остались в архитектуре,</text>
    <text x="240" y="470" class="sm" text-anchor="middle">но операционными системами не используются</text>
  </g>

  <g data-key="space">
    <rect x="580" y="70" width="300" height="100" rx="9" class="by"/>
    <text x="730" y="102" class="big" text-anchor="middle">Пространство ядра</text>
    <text x="730" y="124" class="sm" text-anchor="middle">код ядра, драйверы, буферы устройств</text>
    <text x="730" y="148" class="sm" text-anchor="middle">войти можно только в кольце 0</text>
    <rect x="580" y="170" width="300" height="260" rx="9" class="bx"/>
    <text x="730" y="206" class="big" text-anchor="middle">Пространство пользователя</text>
    <text x="730" y="228" class="sm" text-anchor="middle">код приложения, стек, куча, библиотеки</text>
    <text x="730" y="252" class="sm" text-anchor="middle">здесь работает кольцо 3</text>
    <text x="572" y="78" class="sm" text-anchor="end">старшие адреса</text>
    <text x="572" y="424" class="sm" text-anchor="end">младшие адреса</text>
    <text x="730" y="452" class="band" text-anchor="middle">ОДНО АДРЕСНОЕ ПРОСТРАНСТВО, ДВЕ ЗОНЫ</text>
  </g>

  <g data-key="deny" data-only="1">
    <path d="M 640 260 L 640 132" class="redge" marker-end="url(#rg-rarw)"/>
    <line x1="626" y1="176" x2="654" y2="204" class="rx"/>
    <line x1="654" y1="176" x2="626" y2="204" class="rx"/>
    <text x="670" y="196" class="rtx">SIGSEGV</text>
  </g>

  <g data-key="door" data-only="1">
    <path d="M 830 260 L 830 132" class="yedge" marker-end="url(#rg-yarw)"/>
    <rect x="784" y="158" width="92" height="26" rx="6" class="by"/>
    <text x="830" y="176" class="ytx" text-anchor="middle">syscall</text>
  </g>

  <g data-key="vdso" data-only="1">
    <rect x="600" y="330" width="260" height="72" rx="8" class="bg"/>
    <text x="730" y="356" class="lbl" text-anchor="middle">vDSO</text>
    <text x="730" y="378" class="gtx" text-anchor="middle">страница с кодом ядра, отображённая</text>
    <text x="730" y="394" class="gtx" text-anchor="middle">прямо в пространство пользователя</text>
  </g>

  <rect x="40" y="482" width="880" height="44" rx="8" class="strip"/>
  <text x="54" y="509" class="striplab">ЗАМЕР</text>

  <g data-key="n1" data-only="1"><text x="106" y="509" class="stripval">четыре кольца — свойство процессора, а не операционной системы</text></g>
  <g data-key="n2" data-only="1"><text x="106" y="509" class="stripval">в кольце 0 работают ядро Linux, ядро Windows и все драйверы устройств</text></g>
  <g data-key="n3" data-only="1"><text x="106" y="509" class="stripval">Windows и Linux используют ровно два уровня из четырёх: 0 и 3</text></g>
  <g data-key="n4" data-only="1"><text x="106" y="509" class="stripval">граница проходит по адресам: старшая половина пространства принадлежит ядру</text></g>
  <g data-key="n5" data-only="1"><text x="106" y="509" class="stripval">чтение чужой памяти обрывает процесс сигналом SIGSEGV — Segmentation fault</text></g>
  <g data-key="n6" data-only="1"><text x="106" y="509" class="stripval">вызов функции 2,8 нс · системный вызов getpid() 116 нс · разница в 41 раз</text></g>
  <g data-key="n7" data-only="1"><text x="106" y="509" class="stripval">clock_gettime() через vDSO — 29 нс: в кольцо 0 переходить не пришлось</text></g>

  <text x="40" y="548" class="legend">синий — пространство пользователя · жёлтый — ядро · зелёный — граница, которую удалось не переходить · красный — отказ</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="r3 r2 r1 r0 n1" data-focus="r3">
      <div class="step-kicker">Шаг 1 · снаружи</div>
      <h4>Кольцо 3 — там, где вы живёте</h4>
      <p>Всё, что вы обычно запускаете, исполняется в самом внешнем кольце. Инструкции обращения к портам ввода-вывода здесь просто не работают: процессор возбуждает исключение вместо того, чтобы их выполнить.</p>
    </div>
    <div class="step-panel" data-on="r3 r2 r1 r0 n2" data-focus="r0">
      <div class="step-kicker">Шаг 2 · в центре</div>
      <h4>Кольцо 0 — там, где можно всё</h4>
      <p>Ядро и драйверы работают здесь. Никаких ограничений: любая память, любая инструкция, любое устройство. Обратная сторона — некому поймать ошибку.</p>
    </div>
    <div class="step-panel" data-on="r3 r2 r1 r0 mid n3" data-focus="mid">
      <div class="step-kicker">Шаг 3 · неиспользуемая середина</div>
      <h4>Кольца 1 и 2 остались пустыми</h4>
      <p>Их задумывали для системных служб, которым нужно чуть больше прав, чем приложению. На практике оказалось проще держать два состояния вместо четырёх, и оба массовых семейства ОС так и сделали.</p>
    </div>
    <div class="step-panel" data-on="r3 r2 r1 r0 space n4" data-focus="space">
      <div class="step-kicker">Шаг 4 · две территории</div>
      <h4>Кольцо определяет, куда можно смотреть</h4>
      <p>Адресное пространство одно, но поделено. Старшая половина адресов помечена как принадлежащая ядру, и признак «сюда только в кольце 0» хранится прямо в таблицах страниц, которые проверяет сам процессор.</p>
    </div>
    <div class="step-panel" data-on="r3 r2 r1 r0 space deny n5" data-focus="deny">
      <div class="step-kicker">Шаг 5 · попытка обойти</div>
      <h4>Что будет, если просто прочитать память ядра</h4>
      <p>Ничего интересного: процессор поймает обращение по таблице страниц, ядро получит исключение и пришлёт процессу сигнал SIGSEGV. Программа завершится с сообщением «Segmentation fault».</p>
      <p>Тот же механизм защищает процессы друг от друга: чужая память для вас так же недоступна, как память ядра.</p>
    </div>
    <div class="step-panel" data-on="r3 r2 r1 r0 space door n6" data-focus="door">
      <div class="step-kicker">Шаг 6 · законный переход</div>
      <h4>Одна инструкция и смена кольца</h4>
      <p>Инструкция <code>syscall</code> — единственная дверь в стене. Процессор переключается в кольцо 0, но не туда, куда захочет программа: адрес входа задан заранее и лежит в регистре, который из кольца 3 менять нельзя.</p>
      <p>Стоимость двери измерима. Обычный вызов функции на этой машине занимает 2,8 нс, то есть около шести тактов. Простейший системный вызов <code>getpid()</code> — 116 нс, примерно 244 такта.</p>
    </div>
    <div class="step-panel" data-on="r3 r2 r1 r0 space vdso n7" data-focus="vdso">
      <div class="step-kicker">Шаг 7 · хитрость ради скорости</div>
      <h4>vDSO — вызов, который не входит в ядро</h4>
      <p>Некоторые вопросы задают так часто, что ради них жалко платить 116 нс. Например, «который час». Ядро отображает маленькую страницу со своим кодом и свежим временем прямо в пространство каждого процесса.</p>
      <p><code>clock_gettime()</code> оттуда стоит 29 нс: кольцо не меняется, дверь не открывается. Быстрее обычного вызова функции всё равно не выходит, но и близко не 116.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> изоляция ядра держится не на договорённостях,
  а на двух состояниях процессора и на пометках в таблицах страниц. Программа не
  «не хочет» лезть в ядро — она не может, и проверяет это железо на каждом обращении к памяти.
</div>

---

## Часть 3. Пространство пользователя: оболочка, приложение, библиотеки

<p>
  В пространстве пользователя живут три вида кода, и различать их полезно.
</p>

<p>
  <strong>Приложение</strong> — программа, решающая задачу пользователя или системы:
  браузер, редактор, медиаплеер, серверная служба. <strong>Оболочка</strong> (shell) —
  особый вид приложения, чья задача — принимать ваши команды и запускать другие
  программы. В Windows их две: графическая <code>explorer.exe</code> (рабочий стол,
  панель задач, проводник) и командная — <code>cmd.exe</code> или PowerShell.
  <strong>Библиотеки</strong> — наборы готовых функций в отдельных файлах
  (<code>.so</code> в Linux, <code>.dll</code> в Windows), которыми пользуются все
  сразу: не писать же каждому автору программы своё чтение файлов.
</p>

<div class="callout-blue">
  <strong>Оболочка не имеет особых прав.</strong> Кажется, что раз она запускает
  другие программы, у неё есть какая-то власть. Нет: это обычный процесс в кольце
  3, который умеет пользоваться двумя системными вызовами — «сделай копию меня»
  и «замени свой код на другой файл». Запускать программы может любая программа.
</div>

<p>
  Проследим за тем, как из строчки, набранной в оболочке, получается работающий
  процесс, и где в этой цепочке появляется библиотека.
</p>

<div class="stage" id="stageEx" tabindex="0">
  <div class="stage-figure">
<svg id="ex" viewBox="0 0 960 560" role="img" aria-label="Как оболочка запускает приложение через fork и exec и как приложение вызывает функцию библиотеки">
  <style>
    #ex { font-family: Helvetica, Arial, sans-serif; }
    #ex .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ex .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ex .lbl { font-size: 16px; fill: #111111; }
    #ex .sm { font-size: 13px; fill: #5E5850; }
    #ex .band { font-size: 12.5px; fill: #5E5850; letter-spacing: .08em; }
    #ex .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #ex .dash { stroke: #5E5850; stroke-width: 2; fill: none; stroke-dasharray: 8 6; }
    #ex .ytx { font-size: 13.5px; fill: #8C7106; }
    #ex .yline { stroke: #C29E08; stroke-width: 1.6; fill: none; stroke-dasharray: 5 4; }
    #ex .strip { fill: #F8FBFE; stroke: #D9E4F0; stroke-width: 1.2; }
    #ex .striplab { font-size: 12px; fill: #2A5E9B; letter-spacing: .07em; }
    #ex .stripval { font-size: 14px; fill: #111111; }
    #ex .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ex-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text x="40" y="64" class="band">ЗАПУСК ПРОГРАММЫ</text>

  <g data-key="shellb">
    <rect x="40" y="80" width="200" height="64" rx="9" class="bx"/>
    <text x="140" y="108" class="lbl" text-anchor="middle">Оболочка bash</text>
    <text x="140" y="130" class="sm" text-anchor="middle">PID 3100, кольцо 3</text>
  </g>

  <g data-key="forkb">
    <line x1="240" y1="112" x2="294" y2="112" class="edge" marker-end="url(#ex-arw)"/>
    <rect x="300" y="80" width="220" height="64" rx="9" class="bx"/>
    <text x="410" y="108" class="lbl" text-anchor="middle">fork()</text>
    <text x="410" y="130" class="sm" text-anchor="middle">копия процесса, PID 4210</text>
  </g>

  <g data-key="execb">
    <line x1="520" y1="112" x2="574" y2="112" class="edge" marker-end="url(#ex-arw)"/>
    <rect x="580" y="80" width="180" height="64" rx="9" class="by"/>
    <text x="670" y="108" class="lbl" text-anchor="middle">exec("notes")</text>
    <text x="670" y="130" class="sm" text-anchor="middle">код заменён</text>
  </g>

  <g data-key="procb">
    <line x1="760" y1="112" x2="774" y2="112" class="edge" marker-end="url(#ex-arw)"/>
    <rect x="780" y="80" width="140" height="64" rx="9" class="bx"/>
    <text x="850" y="108" class="lbl" text-anchor="middle">notes</text>
    <text x="850" y="130" class="sm" text-anchor="middle">PID 4210</text>
  </g>

  <g data-key="cow" data-only="1">
    <line x1="410" y1="144" x2="410" y2="176" class="yline"/>
    <text x="300" y="196" class="ytx">страницы пока общие: копия делается только при первой записи</text>
  </g>

  <text x="40" y="234" class="band">ВЫЗОВ ФУНКЦИИ ВНУТРИ ПРОЦЕССА</text>

  <g data-key="callb">
    <rect x="40" y="250" width="260" height="64" rx="9" class="bx"/>
    <text x="170" y="278" class="lbl" text-anchor="middle">notes зовёт read()</text>
    <text x="170" y="300" class="sm" text-anchor="middle">выглядит как обычная функция</text>
  </g>

  <g data-key="libb">
    <line x1="300" y1="282" x2="334" y2="282" class="edge" marker-end="url(#ex-arw)"/>
    <rect x="340" y="250" width="260" height="64" rx="9" class="bx"/>
    <text x="470" y="278" class="lbl" text-anchor="middle">libc.so.6</text>
    <text x="470" y="300" class="sm" text-anchor="middle">та же память, те же права</text>
  </g>

  <g data-key="insb">
    <line x1="600" y1="282" x2="654" y2="282" class="edge" marker-end="url(#ex-arw)"/>
    <rect x="660" y="250" width="260" height="64" rx="9" class="by"/>
    <text x="790" y="278" class="lbl" text-anchor="middle">mov rax, 0 ; syscall</text>
    <text x="790" y="300" class="sm" text-anchor="middle">две инструкции — и всё</text>
  </g>

  <g data-key="bound">
    <line x1="40" y1="370" x2="920" y2="370" class="dash"/>
    <text x="40" y="362" class="band">ГРАНИЦА ПРОСТРАНСТВА ПОЛЬЗОВАТЕЛЯ</text>
  </g>

  <g data-key="kern">
    <line x1="790" y1="314" x2="790" y2="386" class="edge" marker-end="url(#ex-arw)"/>
    <rect x="660" y="390" width="260" height="56" rx="9" class="by"/>
    <text x="790" y="424" class="lbl" text-anchor="middle">sys_read() внутри ядра</text>
  </g>

  <rect x="40" y="470" width="880" height="44" rx="8" class="strip"/>
  <text x="54" y="497" class="striplab">ФАКТ</text>

  <g data-key="n1" data-only="1"><text x="106" y="497" class="stripval">оболочка — такой же процесс, как редактор: у неё есть PID, и она работает в кольце 3</text></g>
  <g data-key="n2" data-only="1"><text x="106" y="497" class="stripval">fork() копирует не память, а таблицу страниц: страницы помечаются как «копировать при записи»</text></g>
  <g data-key="n3" data-only="1"><text x="106" y="497" class="stripval">exec() сохраняет номер процесса, но полностью заменяет содержимое его адресного пространства</text></g>
  <g data-key="n4" data-only="1"><text x="106" y="497" class="stripval">в выводе ps колонка PPID показывает родителя — так видно, кто кого запустил</text></g>
  <g data-key="n5" data-only="1"><text x="106" y="497" class="stripval">обычный вызов функции на этой машине — 2,8 нс, около шести тактов</text></g>
  <g data-key="n6" data-only="1"><text x="106" y="497" class="stripval">ldd /bin/cat показывает: даже cat тянет за собой libc.so.6 и vDSO</text></g>
  <g data-key="n7" data-only="1"><text x="106" y="497" class="stripval">после инструкции syscall тот же процессор продолжает работу уже в кольце 0</text></g>

  <text x="40" y="536" class="legend">синий — код в пространстве пользователя · жёлтый — переход в ядро и работа ядра</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="shellb n1" data-focus="shellb">
      <div class="step-kicker">Шаг 1 · исходное положение</div>
      <h4>Оболочка ждёт команду</h4>
      <p>Вы набрали <code>./notes</code> и нажали Enter. Оболочка — обычный процесс с номером 3100. Она разобрала строку и поняла, что нужно запустить файл.</p>
    </div>
    <div class="step-panel" data-on="shellb forkb cow n2" data-focus="forkb">
      <div class="step-kicker">Шаг 2 · раздвоение</div>
      <h4>fork(): ядро делает копию процесса</h4>
      <p>Странно, но факт: чтобы запустить чужую программу, оболочка сначала копирует саму себя. Появляется второй процесс с новым номером и точно такой же памятью.</p>
      <p>Копия при этом дешёвая. Физически память не дублируется — обе копии смотрят на одни страницы, помеченные «только для чтения». Настоящее копирование случится, только если кто-то попробует туда записать.</p>
    </div>
    <div class="step-panel" data-on="shellb forkb execb n3" data-focus="execb">
      <div class="step-kicker">Шаг 3 · подмена содержимого</div>
      <h4>exec(): код заменяется на другой файл</h4>
      <p>Копия оболочки немедленно просит ядро выбросить всё своё содержимое и загрузить вместо него исполняемый файл <code>notes</code>. Номер процесса при этом не меняется.</p>
    </div>
    <div class="step-panel" data-on="shellb forkb execb procb n4" data-focus="procb">
      <div class="step-kicker">Шаг 4 · результат</div>
      <h4>Процесс notes с PID 4210</h4>
      <p>В системе появилась новая работающая программа, и у неё записан родитель — 3100. Именно поэтому в диспетчере задач и в выводе <code>ps</code> процессы выстраиваются в дерево.</p>
    </div>
    <div class="step-panel" data-on="shellb forkb execb procb callb n5" data-focus="callb">
      <div class="step-kicker">Шаг 5 · программа работает</div>
      <h4>notes зовёт read()</h4>
      <p>С точки зрения кода это самая обычная строчка: вызвали функцию, получили результат. Ничего в её виде не намекает, что дальше произойдёт смена привилегий.</p>
    </div>
    <div class="step-panel" data-on="shellb forkb execb procb callb libb n6" data-focus="libb">
      <div class="step-kicker">Шаг 6 · развеиваем иллюзию</div>
      <h4>read() — это функция библиотеки</h4>
      <p>Управление уходит в <code>libc.so.6</code>, которая загружена в тот же процесс. Библиотека работает с теми же правами и в той же памяти: никакой магии, просто чужой код рядом с вашим.</p>
      <p>Её польза в другом: она прячет различия между версиями ядра, проверяет аргументы и превращает коды ошибок в привычный <code>errno</code>.</p>
    </div>
    <div class="step-panel" data-on="shellb forkb execb procb callb libb insb bound kern n7" data-focus="insb kern">
      <div class="step-kicker">Шаг 7 · граница</div>
      <h4>Две инструкции — и мы в ядре</h4>
      <p>Внутри библиотечной обёртки всё заканчивается парой инструкций: положить номер вызова в регистр и выполнить <code>syscall</code>. Ниже пунктирной линии кода приложения уже нет — там работает ядро.</p>
      <p>Как именно устроен этот переход, разбираем в следующей части.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Всё это можно посмотреть своими глазами. Ниже — консоль с записанным выводом
  настоящих команд: нажмите на команду или наберите её сами.
</p>

<div class="term" id="tm1" data-first="ps -eo pid,ppid,stat,comm | head -8">
  <div class="term-head">Консоль 1 · кто живёт в пространстве пользователя</div>
  <div class="term-screen" aria-live="polite"></div>
  <div class="term-line"><span class="term-ps">$</span><input class="term-in" type="text" spellcheck="false" autocomplete="off" aria-label="Ввод команды"></div>
  <div class="term-cmds">
    <button type="button" data-cmd="ps -eo pid,ppid,stat,comm | head -8">ps</button>
    <button type="button" data-cmd="ldd /bin/cat">ldd /bin/cat</button>
    <button type="button" data-cmd="ls -l /bin/cat">ls -l /bin/cat</button>
    <button type="button" data-cmd="nproc">nproc</button>
    <button type="button" data-cmd="help">help</button>
  </div>
</div>
<p class="term-hint">Вывод записан с той же машины, на которой сделаны все замеры статьи. Команда <code>help</code> покажет, что здесь есть, <code>clear</code> — очистит экран.</p>

<p>
  В выводе <code>ps</code> видно дерево: у процесса 1 родителя нет, всё остальное
  выросло из него. А <code>ldd</code> показывает, что даже такая крошечная
  программа, как <code>cat</code>, не одинока: рядом с ней в память загружены
  <code>libc.so.6</code> и та самая страница <code>linux-vdso.so.1</code> из
  прошлой части.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> в пространстве пользователя нет иерархии
  власти — оболочка, приложение и библиотека одинаково бесправны. Разница только
  в том, кто чем занимается, а не в том, кому что позволено.
</div>

---

## Часть 4. Системный вызов — ворота в ядро

<p>
  Итак, приложение хочет чего-то, что ему самому недоступно. Оно оформляет
  запрос.
</p>

<div class="callout-blue">
  <strong>Системный вызов</strong> (System Call) — механизм, с помощью которого
  программа просит ядро операционной системы выполнить определённую операцию:
  открыть файл, выделить память, отправить пакет, создать процесс.
</div>

<p>
  Удобная аналогия — многофункциональный центр. Вы приходите в одно окно и
  описываете суть обращения. Дальше сотрудник смотрит на категорию запроса и
  передаёт его нужной службе: одна занимается недвижимостью, другая — паспортами.
  Вы не ходите по службам сами и даже не знаете, где они находятся; вы получаете
  результат в том же окне.
</p>

<p>
  Ядро устроено так же. Категория запроса определяется номером вызова, и по этому
  номеру запрос попадает в профильную подсистему.
</p>

<table class="shape-table">
  <tr><th>Что просит программа</th><th>Примеры вызовов в Linux</th><th>Куда попадает запрос</th></tr>
  <tr><td>Открыть, прочитать, записать файл</td><td><code>open</code>, <code>read</code>, <code>write</code>, <code>close</code></td><td>Файловая система</td></tr>
  <tr><td>Получить или отдать память</td><td><code>mmap</code>, <code>munmap</code>, <code>brk</code></td><td>Менеджер памяти</td></tr>
  <tr><td>Создать процесс, подождать, уснуть</td><td><code>fork</code>, <code>execve</code>, <code>wait4</code>, <code>nanosleep</code></td><td>Планировщик процессов</td></tr>
  <tr><td>Обменяться данными с другим процессом</td><td><code>pipe</code>, <code>socket</code>, <code>shmget</code>, <code>send</code></td><td>Межпроцессное взаимодействие</td></tr>
  <tr><td>Управлять устройством</td><td><code>ioctl</code>, чтение и запись файла устройства</td><td>Блок работы с устройствами</td></tr>
</table>

<p>
  Пять строк этой таблицы — пять оставшихся частей статьи. Но сначала разберём
  сам механизм перехода: что физически происходит между последней инструкцией
  приложения и первой инструкцией ядра.
</p>

<div class="stage" id="stageSc" tabindex="0">
  <div class="stage-figure">
<svg id="sc" viewBox="0 0 960 590" role="img" aria-label="Анатомия системного вызова: регистры, инструкция syscall, точка входа в ядро, таблица номеров вызовов и возврат результата">
  <style>
    #sc { font-family: Helvetica, Arial, sans-serif; }
    #sc .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #sc .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #sc .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #sc .hl { fill: none; stroke: #C29E08; stroke-width: 2.4; }
    #sc .lbl { font-size: 16px; fill: #111111; }
    #sc .mono { font-size: 14px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #sc .big { font-size: 20px; fill: #111111; font-family: "Courier New", Courier, monospace; }
    #sc .sm { font-size: 13px; fill: #5E5850; }
    #sc .band { font-size: 12.5px; fill: #5E5850; letter-spacing: .08em; }
    #sc .edge { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #sc .gedge { stroke: #73B222; stroke-width: 2.2; fill: none; }
    #sc .dash { stroke: #5E5850; stroke-width: 2; fill: none; stroke-dasharray: 8 6; }
    #sc .strip { fill: #F8FBFE; stroke: #D9E4F0; stroke-width: 1.2; }
    #sc .striplab { font-size: 12px; fill: #2A5E9B; letter-spacing: .07em; }
    #sc .stripval { font-size: 14px; fill: #111111; }
    #sc .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="sc-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="sc-garw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
  </defs>

  <text x="40" y="64" class="band">КОЛЬЦО 3 · ПРИЛОЖЕНИЕ NOTES</text>
  <text x="420" y="64" class="band">КОЛЬЦО 0 · ЯДРО</text>

  <g data-key="regs">
    <rect x="40" y="80" width="300" height="170" rx="9" class="bx"/>
    <text x="60" y="108" class="lbl">Регистры процессора</text>
  </g>

  <g data-key="rax">
    <text x="60" y="142" class="mono">rax = 1</text>
    <text x="152" y="142" class="sm">номер вызова write</text>
  </g>

  <g data-key="args">
    <text x="60" y="172" class="mono">rdi = 3</text>
    <text x="152" y="172" class="sm">дескриптор notes.txt</text>
    <text x="60" y="202" class="mono">rsi = адрес</text>
    <text x="182" y="202" class="sm">откуда брать байты</text>
    <text x="60" y="232" class="mono">rdx = 4200</text>
    <text x="182" y="232" class="sm">сколько записать</text>
  </g>

  <g data-key="ins">
    <rect x="40" y="280" width="300" height="56" rx="9" class="by"/>
    <text x="190" y="317" class="big" text-anchor="middle">syscall</text>
  </g>

  <g data-key="bound">
    <line x1="380" y1="76" x2="380" y2="470" class="dash"/>
  </g>

  <g data-key="entry">
    <line x1="340" y1="308" x2="414" y2="308" class="edge" marker-end="url(#sc-arw)"/>
    <rect x="420" y="280" width="280" height="56" rx="9" class="by"/>
    <text x="560" y="313" class="lbl" text-anchor="middle">entry_SYSCALL_64</text>
  </g>

  <g data-key="table">
    <line x1="560" y1="280" x2="560" y2="256" class="edge" marker-end="url(#sc-arw)"/>
    <rect x="420" y="100" width="280" height="150" rx="9" class="by"/>
    <text x="560" y="128" class="lbl" text-anchor="middle">Таблица sys_call_table</text>
    <text x="446" y="158" class="mono">0  → sys_read</text>
    <text x="446" y="186" class="mono">1  → sys_write</text>
    <text x="446" y="214" class="mono">2  → sys_open</text>
    <text x="446" y="240" class="mono">57 → sys_fork</text>
  </g>

  <g data-key="pick" data-only="1">
    <rect x="434" y="168" width="252" height="26" rx="6" class="hl"/>
  </g>

  <g data-key="disp">
    <line x1="700" y1="181" x2="734" y2="181" class="edge" marker-end="url(#sc-arw)"/>
    <rect x="740" y="140" width="180" height="100" rx="9" class="by"/>
    <text x="830" y="176" class="lbl" text-anchor="middle">sys_write()</text>
    <text x="830" y="202" class="sm" text-anchor="middle">дальше — файловая</text>
    <text x="830" y="222" class="sm" text-anchor="middle">система</text>
  </g>

  <g data-key="ret">
    <line x1="830" y1="240" x2="830" y2="384" class="gedge" marker-end="url(#sc-garw)"/>
    <rect x="420" y="390" width="500" height="56" rx="9" class="bg"/>
    <text x="670" y="424" class="lbl" text-anchor="middle">rax = 4200 — столько байт записано</text>
    <path d="M 416 418 L 200 418 L 200 342" class="gedge" marker-end="url(#sc-garw)"/>
  </g>

  <rect x="40" y="500" width="880" height="44" rx="8" class="strip"/>
  <text x="54" y="527" class="striplab">ЗАМЕР</text>

  <g data-key="n1" data-only="1"><text x="106" y="527" class="stripval">системный вызов — это соглашение: где лежит номер операции, где аргументы, где ответ</text></g>
  <g data-key="n2" data-only="1"><text x="106" y="527" class="stripval">в Linux x86-64 номер кладут в rax: 0 — read, 1 — write, 2 — open, 57 — fork</text></g>
  <g data-key="n3" data-only="1"><text x="106" y="527" class="stripval">аргументы идут в rdi, rsi, rdx, r10, r8, r9 — не больше шести, остальное передают через память</text></g>
  <g data-key="n4" data-only="1"><text x="106" y="527" class="stripval">syscall меняет кольцо и переключает на стек ядра; адрес входа программа выбрать не может</text></g>
  <g data-key="n5" data-only="1"><text x="106" y="527" class="stripval">точка входа одна на все вызовы: её адрес заранее записан в регистр MSR_LSTAR</text></g>
  <g data-key="n6" data-only="1"><text x="106" y="527" class="stripval">в современном Linux в таблице несколько сотен номеров, и освободившиеся не переиспользуют</text></g>
  <g data-key="n7" data-only="1"><text x="106" y="527" class="stripval">после диспетчеризации работает уже обычный код ядра — с полным доступом к железу</text></g>
  <g data-key="n8" data-only="1"><text x="106" y="527" class="stripval">весь путь туда и обратно: getpid() — 116 нс, write() одного байта в /dev/null — 129 нс</text></g>

  <text x="40" y="570" class="legend">синий — данные приложения · жёлтый — переход и работа ядра · зелёный — результат, вернувшийся в кольцо 3</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="regs n1" data-focus="regs">
      <div class="step-kicker">Шаг 1 · подготовка</div>
      <h4>Заявление заполняют в регистрах</h4>
      <p>Никакого «интерфейса» в привычном смысле нет: программа и ядро договорились заранее, что запрос передаётся через регистры процессора. Это самый быстрый способ — данные уже внутри процессора, копировать ничего не надо.</p>
    </div>
    <div class="step-panel" data-on="regs rax n2" data-focus="rax">
      <div class="step-kicker">Шаг 2 · какая операция</div>
      <h4>Номер вызова кладут в rax</h4>
      <p>Один регистр целиком отведён под «что я прошу». Единица означает «записать». Номера зафиксированы навсегда: если бы они менялись, старые программы перестали бы работать после обновления ядра.</p>
    </div>
    <div class="step-panel" data-on="regs rax args n3" data-focus="args">
      <div class="step-kicker">Шаг 3 · подробности</div>
      <h4>Аргументы — в следующие регистры</h4>
      <p>Куда писать (дескриптор 3 — это наш открытый <code>notes.txt</code>), откуда брать данные и сколько байт. Обратите внимание на <code>rsi</code>: передаётся не сам буфер, а его адрес.</p>
      <p>Это важная деталь. Ядро видит всю память процесса и может прочитать буфер само — обратное неверно.</p>
    </div>
    <div class="step-panel" data-on="regs rax args ins bound n4" data-focus="ins">
      <div class="step-kicker">Шаг 4 · переход</div>
      <h4>Одна инструкция меняет кольцо</h4>
      <p><code>syscall</code> — не вызов функции. Процессор сохраняет адрес возврата, переключается в кольцо 0, меняет стек на служебный и прыгает по адресу, который ядро записало в специальный регистр при загрузке.</p>
      <p>Программа не выбирает, куда прыгнуть. Иначе весь механизм защиты не стоил бы ничего.</p>
    </div>
    <div class="step-panel" data-on="regs rax args ins bound entry n5" data-focus="entry">
      <div class="step-kicker">Шаг 5 · одна дверь на всех</div>
      <h4>Точка входа</h4>
      <p>Все системные вызовы всех процессов приходят в одну и ту же функцию. Она сохраняет регистры приложения, проверяет, что номер вызова не выходит за границы таблицы, и только потом смотрит, чего от неё хотят.</p>
    </div>
    <div class="step-panel" data-on="regs rax args ins bound entry table pick n6" data-focus="table pick">
      <div class="step-kicker">Шаг 6 · сортировка</div>
      <h4>Номер превращается в адрес обработчика</h4>
      <p>Таблица <code>sys_call_table</code> — обычный массив указателей на функции. Взять элемент под номером из <code>rax</code> и вызвать его: вот и весь диспетчер.</p>
      <p>Тот самый сотрудник МФЦ, который смотрит на категорию обращения и передаёт его нужной службе.</p>
    </div>
    <div class="step-panel" data-on="regs rax args ins bound entry table disp n7" data-focus="disp">
      <div class="step-kicker">Шаг 7 · профильная служба</div>
      <h4>Работает подсистема</h4>
      <p>С этого момента исполняется обычный код ядра: проверяет права, находит структуру открытого файла по дескриптору 3, копирует байты из буфера приложения и передаёт их файловой системе.</p>
    </div>
    <div class="step-panel" data-on="regs rax args ins bound entry table disp ret n8" data-focus="ret">
      <div class="step-kicker">Шаг 8 · возврат и цена</div>
      <h4>Результат кладут в тот же rax</h4>
      <p>Ядро восстанавливает регистры, возвращает процессор в кольцо 3 и передаёт управление на инструкцию после <code>syscall</code>. В <code>rax</code> лежит либо число записанных байт, либо отрицательный код ошибки, который библиотека превратит в <code>errno</code>.</p>
      <p>Дорога стоит примерно 116 нс — около 244 тактов процессора. Дёшево для похода на диск и дорого, если делать это на каждый байт: отсюда буферизация во всех библиотеках ввода-вывода.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-yellow">
  <strong>Практическая деталь:</strong> именно из-за цены перехода
  <code>printf()</code> не пишет на экран сразу. Библиотека копит вывод в своём
  буфере и отдаёт его ядру целиком. Побочный эффект знаком всем: если программа
  падает, последние строки лога иногда не успевают появиться — они остались в
  буфере, до системного вызова дело не дошло.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> системный вызов — не функция, а смена
  режима процессора по единственному разрешённому адресу. Ядро не доверяет
  приложению ничего, кроме номера и шести чисел, и всё остальное проверяет само.
</div>

---

## Часть 5. Планировщик процессов

<p>
  Первая подсистема за воротами распоряжается самым дефицитным ресурсом —
  процессорным временем. Но сначала определим единицу, с которой она работает.
</p>

<div class="callout-blue">
  <strong>Процесс</strong> — программа в состоянии выполнения. Файл на диске —
  это ещё не процесс; процесс появляется, когда код загружен в память, ему
  выделены ресурсы и он получил свой номер.
</div>

<p>
  Одна и та же программа легко даёт несколько процессов: открыли «Блокнот» —
  появился <code>notepad.exe</code>, открыли из него второй файл — при таком
  устройстве программы появится ещё один процесс с тем же именем и другим
  номером.
</p>

<p>
  Чтобы управлять процессом, ядро хранит о нём структуру данных —
  <strong>блок контроля процессов</strong> (Process Control Block, PCB). В неё
  входят состояние процесса, его идентификатор, счётчик команд (адрес, с которого
  продолжать), значения регистров, сведения о выделенной памяти, приоритет и
  учётная информация вроде израсходованного процессорного времени.
</p>

<p>
  Процессов десятки и сотни, а ядро — одно или несколько. В каждый момент на
  одном ядре исполняется ровно один процесс. Значит, кто-то должен решать, кто
  следующий: это и есть <strong>планировщик процессов</strong>.
</p>

<div class="stage" id="stagePl" tabindex="0">
  <div class="stage-figure">
<svg id="pl" viewBox="0 0 960 590" role="img" aria-label="Блок контроля процессов, четыре состояния процесса и временная шкала чередования трёх процессов на одном ядре">
  <style>
    #pl { font-family: Helvetica, Arial, sans-serif; }
    #pl .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #pl .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #pl .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #pl .bn { fill: #F4F2EC; stroke: #C8C3B6; stroke-width: 1.2; }
    #pl .lbl { font-size: 15px; fill: #111111; }
    #pl .row { font-size: 13.5px; fill: #111111; }
    #pl .sm { font-size: 13px; fill: #5E5850; }
    #pl .band { font-size: 12.5px; fill: #5E5850; letter-spacing: .08em; }
    #pl .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #pl .rtick { fill: #C30B0A; }
    #pl .rtx { font-size: 13px; fill: #C30B0A; }
    #pl .ytx { font-size: 13px; fill: #8C7106; }
    #pl .yedge { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #pl .strip { fill: #F8FBFE; stroke: #D9E4F0; stroke-width: 1.2; }
    #pl .striplab { font-size: 12px; fill: #2A5E9B; letter-spacing: .07em; }
    #pl .stripval { font-size: 14px; fill: #111111; }
    #pl .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="pl-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="pcb">
    <rect x="40" y="80" width="320" height="250" rx="9" class="bx"/>
    <text x="200" y="110" class="lbl" text-anchor="middle">Блок контроля процессов</text>
    <text x="60" y="146" class="row">Состояние: выполняется</text>
    <text x="60" y="174" class="row">Идентификатор: PID 4210</text>
    <text x="60" y="202" class="row">Счётчик команд: 0x401256</text>
    <text x="60" y="230" class="row">Регистры: rax, rbx, rsp, …</text>
    <text x="60" y="258" class="row">Память: код, стек, куча</text>
    <text x="60" y="286" class="row">Приоритет и учёт времени</text>
    <text x="60" y="314" class="row">Открытые файлы и права</text>
  </g>

  <g data-key="states">
    <text x="400" y="64" class="band">ЧЕТЫРЕ СОСТОЯНИЯ ПРОЦЕССА</text>
    <rect x="400" y="80" width="115" height="60" rx="9" class="bx"/>
    <text x="457" y="116" class="row" text-anchor="middle">готов</text>
    <rect x="535" y="80" width="115" height="60" rx="9" class="bg"/>
    <text x="592" y="116" class="row" text-anchor="middle">выполняется</text>
    <rect x="670" y="80" width="115" height="60" rx="9" class="by"/>
    <text x="727" y="116" class="row" text-anchor="middle">ожидает</text>
    <rect x="805" y="80" width="115" height="60" rx="9" class="bn"/>
    <text x="862" y="116" class="row" text-anchor="middle">завершён</text>
    <line x1="515" y1="110" x2="531" y2="110" class="edge" marker-end="url(#pl-arw)"/>
    <line x1="650" y1="110" x2="666" y2="110" class="edge" marker-end="url(#pl-arw)"/>
    <line x1="785" y1="110" x2="801" y2="110" class="edge" marker-end="url(#pl-arw)"/>
    <path d="M 727 140 L 727 160 L 457 160 L 457 144" class="edge" marker-end="url(#pl-arw)"/>
    <text x="592" y="176" class="sm" text-anchor="middle">дождался данных — снова в очередь</text>
  </g>

  <g data-key="exp">
    <rect x="400" y="200" width="520" height="130" rx="9" class="bg"/>
    <text x="420" y="228" class="lbl">Эксперимент: три счётчика, 3 секунды, одно ядро</text>
    <text x="420" y="258" class="row">в одиночку: 52 513 000 итераций</text>
    <text x="420" y="284" class="row">втроём: 18,0 + 18,3 + 17,6 = 53,9 млн итераций</text>
    <text x="420" y="310" class="row">каждому досталось 0,88 с процессора и 227 вытеснений</text>
  </g>

  <g data-key="lanes">
    <text x="40" y="362" class="band">ОДНО ЯДРО · ВРЕМЯ ИДЁТ СЛЕВА НАПРАВО</text>
    <rect x="110" y="376" width="810" height="26" rx="5" class="bn"/>
    <rect x="110" y="410" width="810" height="26" rx="5" class="bn"/>
    <rect x="110" y="444" width="810" height="26" rx="5" class="bn"/>
    <text x="40" y="394" class="row">notes</text>
    <text x="40" y="428" class="row">браузер</text>
    <text x="40" y="462" class="row">сборка</text>
    <text x="110" y="490" class="sm" text-anchor="middle">0</text>
    <text x="245" y="490" class="sm" text-anchor="middle">4</text>
    <text x="380" y="490" class="sm" text-anchor="middle">8</text>
    <text x="515" y="490" class="sm" text-anchor="middle">12</text>
    <text x="650" y="490" class="sm" text-anchor="middle">16</text>
    <text x="785" y="490" class="sm" text-anchor="middle">20</text>
    <text x="920" y="490" class="sm" text-anchor="end">24 мс</text>
  </g>

  <g data-key="slices">
    <rect x="110" y="376" width="135" height="26" rx="5" class="bx"/>
    <rect x="515" y="376" width="135" height="26" rx="5" class="bx"/>
    <rect x="245" y="410" width="135" height="26" rx="5" class="bx"/>
    <rect x="650" y="410" width="135" height="26" rx="5" class="bx"/>
    <rect x="380" y="444" width="135" height="26" rx="5" class="bx"/>
    <rect x="785" y="444" width="135" height="26" rx="5" class="bx"/>
  </g>

  <g data-key="quant" data-only="1">
    <line x1="110" y1="366" x2="245" y2="366" class="yedge"/>
    <line x1="110" y1="360" x2="110" y2="372" class="yedge"/>
    <line x1="245" y1="360" x2="245" y2="372" class="yedge"/>
    <text x="255" y="371" class="ytx">квант ≈ 3,87 мс</text>
  </g>

  <g data-key="sw">
    <rect x="244" y="376" width="3" height="94" class="rtick"/>
    <rect x="379" y="376" width="3" height="94" class="rtick"/>
    <rect x="514" y="376" width="3" height="94" class="rtick"/>
    <rect x="649" y="376" width="3" height="94" class="rtick"/>
    <rect x="784" y="376" width="3" height="94" class="rtick"/>
    <text x="620" y="352" class="rtx" text-anchor="middle">красная черта — переключение контекста, 1,22 мкс</text>
  </g>

  <rect x="40" y="506" width="880" height="44" rx="8" class="strip"/>
  <text x="54" y="533" class="striplab">ЗАМЕР</text>

  <g data-key="n1" data-only="1"><text x="106" y="533" class="stripval">в Linux блок контроля процессов называется task_struct и занимает несколько килобайт</text></g>
  <g data-key="n2" data-only="1"><text x="106" y="533" class="stripval">процесс уходит в «ожидает», когда просит диск, сеть или данные от соседнего процесса</text></g>
  <g data-key="n3" data-only="1"><text x="106" y="533" class="stripval">на этой машине одно ядро: настоящей параллельности нет, есть только чередование</text></g>
  <g data-key="n4" data-only="1"><text x="106" y="533" class="stripval">Linux использует не строгую карусель, а учёт того, кому из процессов больше задолжали</text></g>
  <g data-key="n5" data-only="1"><text x="106" y="533" class="stripval">0,88 с процессорного времени на 227 вытеснений даёт средний квант 3,87 мс</text></g>
  <g data-key="n6" data-only="1"><text x="106" y="533" class="stripval">одно переключение контекста — 1,22 мкс, это около 2560 тактов процессора</text></g>
  <g data-key="n7" data-only="1"><text x="106" y="533" class="stripval">втроём сделано 53,9 млн итераций против 52,5 млн в одиночку — времени не прибавилось</text></g>
  <g data-key="n8" data-only="1"><text x="106" y="533" class="stripval">накладные при кванте 3,87 мс — 0,03%; при кванте 10 мкс было бы 10,9%</text></g>

  <text x="40" y="572" class="legend">синий — процесс на процессоре · серый — процесс ждёт своей очереди · красный — момент переключения</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="pcb n1" data-focus="pcb">
      <div class="step-kicker">Шаг 1 · что помнит ядро</div>
      <h4>Блок контроля процессов</h4>
      <p>Всё, что нужно, чтобы приостановить программу и потом вернуть её к жизни, лежит в одной структуре. Ключевые поля — счётчик команд и регистры: без них процесс не сможет продолжить с того места, где его прервали.</p>
    </div>
    <div class="step-panel" data-on="pcb states n2" data-focus="states">
      <div class="step-kicker">Шаг 2 · жизненный цикл</div>
      <h4>Готов, выполняется, ожидает, завершён</h4>
      <p>«Готов» и «выполняется» — разные вещи. Готовых всегда много, выполняется ровно один на ядро. «Ожидает» — состояние процесса, который попросил что-то медленное: диск, сеть, ввод пользователя.</p>
      <p>Пока он ждёт, процессор ему не нужен, и планировщик спокойно отдаёт время другим.</p>
    </div>
    <div class="step-panel" data-on="pcb states lanes n3" data-focus="lanes">
      <div class="step-kicker">Шаг 3 · сцена действия</div>
      <h4>Три процесса и одно ядро</h4>
      <p>Редактор, браузер и сборка проекта хотят считать одновременно. Ядро одно. Серые дорожки — это время, которое каждый процесс проводит в очереди.</p>
    </div>
    <div class="step-panel" data-on="pcb states lanes slices n4" data-focus="slices">
      <div class="step-kicker">Шаг 4 · чередование</div>
      <h4>Каждому по кусочку времени</h4>
      <p>Планировщик выдаёт процессу отрезок и по его окончании отбирает процессор принудительно, не спрашивая. Отсюда ощущение, что программы работают одновременно: переключения происходят быстрее, чем человек может заметить.</p>
    </div>
    <div class="step-panel" data-on="pcb states lanes slices quant n5" data-focus="quant">
      <div class="step-kicker">Шаг 5 · длина отрезка</div>
      <h4>Квант можно измерить</h4>
      <p>Ядро само сообщает, сколько раз процесс был вытеснен: это счётчик <code>nonvoluntary_ctxt_switches</code> в <code>/proc</code>. Три счётчика за три секунды получили по 0,88 с процессора и были вытеснены по 227 раз.</p>
      <p>0,88 с разделить на 227 — примерно 3,87 мс на отрезок. Величина не константа: планировщик Linux считает её из числа готовых процессов и их приоритетов.</p>
    </div>
    <div class="step-panel" data-on="pcb states lanes slices sw n6" data-focus="sw">
      <div class="step-kicker">Шаг 6 · момент подмены</div>
      <h4>Переключение контекста</h4>
      <p>В красной черте происходит вот что: регистры и счётчик команд текущего процесса сохраняются в его PCB, оттуда же достаются сохранённые значения следующего, переключается таблица страниц — и процессор продолжает уже чужую программу.</p>
      <p>Ровно так же вы возвращаетесь к недописанному письму после телефонного звонка: дописали предложение, поговорили, вернулись на то же место.</p>
    </div>
    <div class="step-panel" data-on="pcb states lanes slices sw exp n7" data-focus="exp">
      <div class="step-kicker">Шаг 7 · проверка на числах</div>
      <h4>Время делится, а не появляется</h4>
      <p>Один процесс за три секунды успел 52,5 млн итераций. Три процесса за те же три секунды — 18,0, 18,3 и 17,6 млн, в сумме 53,9 млн (расхождение в пределах разброса между запусками).</p>
      <p>Каждому досталась почти ровно треть. Это и есть работа планировщика: не ускорить, а честно поделить.</p>
    </div>
    <div class="step-panel" data-on="pcb states lanes slices quant sw exp n8" data-focus="quant sw">
      <div class="step-kicker">Шаг 8 · почему именно миллисекунды</div>
      <h4>Компромисс между отзывчивостью и потерями</h4>
      <p>Чем короче квант, тем быстрее система реагирует на нажатие клавиши. Но каждое переключение стоит 1,22 мкс, и эта плата не делает никакой полезной работы.</p>
      <p>При кванте 3,87 мс на переключения уходит 0,03% процессора. При кванте 10 мкс ушло бы 10,9% — десятая часть машины, потраченная на перекладывание регистров.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<table class="shape-table">
  <tr><th>Длина кванта</th><th>Доля времени на переключения</th><th>Что это значит на практике</th></tr>
  <tr><td>3,87 мс (измеренный)</td><td>0,03%</td><td>потери незаметны, задержка реакции тоже</td></tr>
  <tr><td>1 мс</td><td>0,12%</td><td>ещё нормально, так делают системы реального времени</td></tr>
  <tr><td>100 мкс</td><td>1,2%</td><td>процент машины уходит впустую</td></tr>
  <tr><td>10 мкс</td><td>10,9%</td><td>каждое десятое ядро занято только собой</td></tr>
</table>

<p>
  Считается это в одну строчку: за каждый квант <span class="math-inline" data-tex="q"></span>
  система один раз платит за переключение
  <span class="math-inline" data-tex="t_{sw}"></span>, и полезной работы в этой
  плате нет.
</p>

<div class="math-display" data-tex="\text{доля потерь} \;=\; \frac{t_{sw}}{q + t_{sw}} \;=\; \frac{1{,}22}{3870 + 1{,}22} \;\approx\; 0{,}03\%"></div>

<p>
  Счётчики вытеснений и всё остальное содержимое PCB Linux показывает прямо в
  файловой системе <code>/proc</code>. Вот настоящий снимок одного из трёх
  процессов эксперимента, сделанный на 2,6-й секунде.
</p>

<div class="term" id="tm2" data-first="cat /proc/539/status">
  <div class="term-head">Консоль 2 · планировщик изнутри</div>
  <div class="term-screen" aria-live="polite"></div>
  <div class="term-line"><span class="term-ps">$</span><input class="term-in" type="text" spellcheck="false" autocomplete="off" aria-label="Ввод команды"></div>
  <div class="term-cmds">
    <button type="button" data-cmd="cat /proc/539/status">cat /proc/539/status</button>
    <button type="button" data-cmd="python3 sched_exp.py">python3 sched_exp.py</button>
    <button type="button" data-cmd="nproc">nproc</button>
    <button type="button" data-cmd="help">help</button>
  </div>
</div>
<p class="term-hint">Вывод <code>status</code> сокращён до полей, о которых шла речь; остальные строки той же структуры опущены.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> планировщик не ускоряет ничего. Он делит
  одно и то же процессорное время между желающими так быстро, что мы принимаем
  чередование за одновременность, — и берёт за это около трёх сотых процента.
</div>

---

## Часть 6. Межпроцессное взаимодействие

<p>
  Изоляция процессов — благо, но полная изоляция сделала бы систему бесполезной.
  Браузер скачал страницу и не может передать её процессу отрисовки. Десять
  процессов работают с одной базой и каждый грузит её содержимое заново.
  Редактор не может дождаться, пока принтер освободится. Значит, нужен
  разрешённый способ разговаривать.
</p>

<div class="callout-blue">
  <strong>Межпроцессное взаимодействие</strong> (Inter-Process Communication,
  IPC) — набор механизмов, с помощью которых процессы обмениваются данными и
  согласуют свои действия.
</div>

<p>
  Способов два, и разница между ними принципиальна. При <strong>обмене
  сообщениями</strong> (message passing) данные проходят через ядро: сокеты,
  каналы, очереди сообщений. При работе через <strong>разделяемую память</strong>
  (shared memory) ядро только один раз отображает одни и те же физические
  страницы в оба процесса, а дальше не участвует вовсе.
</p>

<div class="stage" id="stageIp" tabindex="0">
  <div class="stage-figure">
<svg id="ip" viewBox="0 0 960 580" role="img" aria-label="Два способа обмена данными между процессами: через буфер в ядре с двумя копиями и через общую страницу памяти без копий, а также схема взаимной блокировки">
  <style>
    #ip { font-family: Helvetica, Arial, sans-serif; }
    #ip .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ip .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ip .kb { fill: none; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 7 5; }
    #ip .lbl { font-size: 16px; fill: #111111; }
    #ip .sm { font-size: 13px; fill: #5E5850; }
    #ip .band { font-size: 12.5px; fill: #5E5850; letter-spacing: .08em; }
    #ip .edge { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #ip .gtx { font-size: 14px; fill: #5A8C1C; }
    #ip .ytx { font-size: 13.5px; fill: #8C7106; }
    #ip .yline { stroke: #C29E08; stroke-width: 1.6; fill: none; stroke-dasharray: 5 4; }
    #ip .redge { stroke: #C30B0A; stroke-width: 2.2; fill: none; stroke-dasharray: 7 5; }
    #ip .rtx { font-size: 14px; fill: #C30B0A; }
    #ip .strip { fill: #F8FBFE; stroke: #D9E4F0; stroke-width: 1.2; }
    #ip .striplab { font-size: 12px; fill: #2A5E9B; letter-spacing: .07em; }
    #ip .stripval { font-size: 14px; fill: #111111; }
    #ip .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ip-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="ip-rarw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text x="40" y="64" class="band">СПОСОБ ПЕРВЫЙ · ОБМЕН СООБЩЕНИЯМИ</text>

  <g data-key="pa">
    <rect x="40" y="80" width="200" height="64" rx="9" class="bx"/>
    <text x="140" y="108" class="lbl" text-anchor="middle">Процесс A</text>
    <text x="140" y="130" class="sm" text-anchor="middle">браузер скачал страницу</text>
  </g>

  <g data-key="pb">
    <rect x="720" y="80" width="200" height="64" rx="9" class="bx"/>
    <text x="820" y="108" class="lbl" text-anchor="middle">Процесс B</text>
    <text x="820" y="130" class="sm" text-anchor="middle">рисует её на экране</text>
  </g>

  <g data-key="buf">
    <rect x="360" y="62" width="240" height="100" rx="10" class="kb"/>
    <text x="480" y="56" class="band" text-anchor="middle">ЯДРО</text>
    <rect x="380" y="80" width="200" height="64" rx="9" class="by"/>
    <text x="480" y="108" class="lbl" text-anchor="middle">Буфер в ядре</text>
    <text x="480" y="130" class="sm" text-anchor="middle">канал, сокет, очередь</text>
  </g>

  <g data-key="copies">
    <line x1="240" y1="112" x2="374" y2="112" class="edge" marker-end="url(#ip-arw)"/>
    <line x1="580" y1="112" x2="714" y2="112" class="edge" marker-end="url(#ip-arw)"/>
    <text x="307" y="100" class="sm" text-anchor="middle">копия 1</text>
    <text x="647" y="100" class="sm" text-anchor="middle">копия 2</text>
  </g>

  <g data-key="wait" data-only="1">
    <text x="40" y="192" class="gtx">пока данных нет, процесс B уходит в состояние «ожидает» и не тратит процессорное время</text>
  </g>

  <text x="40" y="214" class="band">СПОСОБ ВТОРОЙ · РАЗДЕЛЯЕМАЯ ПАМЯТЬ</text>

  <g data-key="shm">
    <rect x="40" y="230" width="200" height="64" rx="9" class="bx"/>
    <text x="140" y="258" class="lbl" text-anchor="middle">Процесс A</text>
    <text x="140" y="280" class="sm" text-anchor="middle">пишет прямо сюда</text>
    <rect x="380" y="230" width="200" height="64" rx="9" class="bx"/>
    <text x="480" y="258" class="lbl" text-anchor="middle">Общая страница</text>
    <text x="480" y="280" class="sm" text-anchor="middle">одни и те же байты</text>
    <rect x="720" y="230" width="200" height="64" rx="9" class="bx"/>
    <text x="820" y="258" class="lbl" text-anchor="middle">Процесс B</text>
    <text x="820" y="280" class="sm" text-anchor="middle">читает на месте</text>
    <line x1="240" y1="262" x2="374" y2="262" class="edge" marker-end="url(#ip-arw)"/>
    <line x1="714" y1="262" x2="586" y2="262" class="edge" marker-end="url(#ip-arw)"/>
    <text x="307" y="250" class="sm" text-anchor="middle">без копий</text>
    <text x="650" y="250" class="sm" text-anchor="middle">без копий</text>
  </g>

  <g data-key="sync" data-only="1">
    <path d="M 140 294 L 140 322 L 374 322" class="yline"/>
    <path d="M 820 294 L 820 322 L 586 322" class="yline"/>
    <rect x="380" y="306" width="200" height="32" rx="7" class="by"/>
    <text x="480" y="327" class="ytx" text-anchor="middle">семафор или мьютекс</text>
  </g>

  <g data-key="dead" data-only="1">
    <text x="40" y="360" class="band">ЧТО ЛОМАЕТСЯ</text>
    <rect x="110" y="370" width="170" height="54" rx="9" class="bx"/>
    <text x="195" y="403" class="lbl" text-anchor="middle">Процесс 1</text>
    <rect x="340" y="370" width="130" height="54" rx="9" class="by"/>
    <text x="405" y="403" class="lbl" text-anchor="middle">Ресурс A</text>
    <rect x="530" y="370" width="170" height="54" rx="9" class="bx"/>
    <text x="615" y="403" class="lbl" text-anchor="middle">Процесс 2</text>
    <rect x="760" y="370" width="130" height="54" rx="9" class="by"/>
    <text x="825" y="403" class="lbl" text-anchor="middle">Ресурс B</text>
    <line x1="280" y1="397" x2="334" y2="397" class="edge" marker-end="url(#ip-arw)"/>
    <line x1="700" y1="397" x2="754" y2="397" class="edge" marker-end="url(#ip-arw)"/>
    <text x="307" y="364" class="sm" text-anchor="middle">держит</text>
    <text x="727" y="364" class="sm" text-anchor="middle">держит</text>
    <path d="M 195 424 L 195 452 L 825 452 L 825 430" class="redge" marker-end="url(#ip-rarw)"/>
    <path d="M 615 370 L 615 344 L 405 344 L 405 364" class="redge" marker-end="url(#ip-rarw)"/>
    <text x="510" y="468" class="rtx" text-anchor="middle">ждёт</text>
    <text x="510" y="338" class="rtx" text-anchor="middle">ждёт</text>
    <text x="110" y="486" class="rtx">взаимная блокировка: оба ждут вечно, и каждый по отдельности ведёт себя правильно</text>
  </g>

  <rect x="40" y="506" width="880" height="44" rx="8" class="strip"/>
  <text x="54" y="533" class="striplab">ЗАМЕР</text>

  <g data-key="n1" data-only="1"><text x="106" y="533" class="stripval">без обмена данными браузер не передал бы скачанную страницу процессу отрисовки</text></g>
  <g data-key="n2" data-only="1"><text x="106" y="533" class="stripval">буфер живёт в ядре: оба процесса видят его только через системные вызовы</text></g>
  <g data-key="n3" data-only="1"><text x="106" y="533" class="stripval">256 МиБ порциями по 64 КиБ — это 8192 системных вызова и два копирования каждого байта</text></g>
  <g data-key="n4" data-only="1"><text x="106" y="533" class="stripval">разделяемая память: настройка один раз, дальше ноль вызовов и ноль копий</text></g>
  <g data-key="n5" data-only="1"><text x="106" y="533" class="stripval">круг «отправил — получил ответ» через два канала занял 2,45 мкс: два переключения контекста</text></g>
  <g data-key="n6" data-only="1"><text x="106" y="533" class="stripval">дедлок — свойство порядка захвата, а не ошибка в отдельно взятом процессе</text></g>
  <g data-key="n7" data-only="1"><text x="106" y="533" class="stripval">ожидание данных переводит процесс в «ожидает», и планировщик отдаёт ядро другому</text></g>

  <text x="40" y="570" class="legend">синий — память процессов · жёлтый — то, что принадлежит ядру · красный — тупик</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="pa pb n1" data-focus="pa pb">
      <div class="step-kicker">Шаг 1 · зачем это вообще</div>
      <h4>Два процесса, которым нужно друг от друга</h4>
      <p>Один скачал данные, другой должен их нарисовать. Их адресные пространства изолированы: адрес 0x7fff… у одного и у другого — разные физические байты. Просто передать указатель нельзя.</p>
    </div>
    <div class="step-panel" data-on="pa pb buf n2" data-focus="buf">
      <div class="step-kicker">Шаг 2 · посредник</div>
      <h4>Данные идут через ядро</h4>
      <p>Отправитель делает системный вызов и отдаёт байты ядру, ядро складывает их в свой буфер. Получатель делает свой системный вызов и забирает их оттуда.</p>
      <p>Канал (<code>pipe</code>), сокет и очередь сообщений устроены именно так и отличаются в основном правилами доставки.</p>
    </div>
    <div class="step-panel" data-on="pa pb buf copies n3" data-focus="copies">
      <div class="step-kicker">Шаг 3 · за что платим</div>
      <h4>Каждый байт копируется дважды</h4>
      <p>Из памяти отправителя в буфер ядра и из буфера в память получателя. Плюс по системному вызову на каждую порцию с обеих сторон.</p>
      <p>В замере 256 МиБ передавались кусками по 64 КиБ: это 4096 вызовов <code>write</code> и 4096 вызовов <code>read</code> — 8192 перехода через границу колец.</p>
    </div>
    <div class="step-panel" data-on="pa pb buf copies shm n4" data-focus="shm">
      <div class="step-kicker">Шаг 4 · способ без посредника</div>
      <h4>Одни и те же физические страницы</h4>
      <p>Ядро отображает один участок физической памяти в адресные пространства обоих процессов. После этого копий нет: то, что записал первый, второй видит там же, ядро при обмене не участвует и системных вызовов не происходит.</p>
    </div>
    <div class="step-panel" data-on="pa pb buf copies shm sync n5" data-focus="sync">
      <div class="step-kicker">Шаг 5 · чего теперь не хватает</div>
      <h4>Кто скажет, что данные готовы</h4>
      <p>У сообщений синхронизация встроена: пришло — значит, готово. У общей памяти её нет, и приходится добавлять отдельно — семафор, мьютекс, флажок в самой странице.</p>
      <p>Синхронизация стоит недёшево: круг «отправил сигнал — получил ответ» через два канала занял 2,45 мкс, почти всё это — два переключения контекста.</p>
    </div>
    <div class="step-panel" data-on="pa pb buf copies shm sync dead n6" data-focus="dead">
      <div class="step-kicker">Шаг 6 · новая беда</div>
      <h4>Взаимная блокировка</h4>
      <p>Вы идёте по узкому коридору, навстречу идёт другой человек. Оба останавливаетесь и ждёте, что уступит другой. Так и с ресурсами: первый занял A и ждёт B, второй занял B и ждёт A.</p>
      <p>Никто не нарушил правил. Ошибка не в процессе, а в порядке, в котором два разных процесса захватывают ресурсы. Поэтому и лечат её договорённостями о порядке захвата и алгоритмами обнаружения.</p>
    </div>
    <div class="step-panel" data-on="pa pb buf copies shm dead wait n7" data-focus="wait">
      <div class="step-kicker">Шаг 7 · связь с планировщиком</div>
      <h4>Ожидание — это подсказка</h4>
      <p>Когда процесс просит данные, которых ещё нет, он не крутится в пустом цикле. Ядро переводит его в состояние «ожидает» и отдаёт процессор соседям, а разбудит, когда данные появятся.</p>
      <p>Так две подсистемы работают вместе: IPC знает, кто чего ждёт, планировщик — кому отдать время.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-red">
  <strong>Посмотреть на работу IPC вживую нельзя.</strong> В отличие от процессов,
  файлов и памяти, у межпроцессного взаимодействия нет наглядного окна: это
  внутренняя механика ядра. Косвенно её видно только по последствиям — процесс,
  который навсегда застрял в состоянии ожидания, скорее всего, участник дедлока.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> выбор между сообщениями и общей памятью —
  это выбор между безопасностью и скоростью. Сообщения дороже, но синхронизация
  в них уже есть; общая память бесплатна в передаче, но всю дисциплину доступа
  вы обязаны построить сами — и дедлок появляется именно здесь.
</div>

---

## Часть 7. Файловая система

<p>
  Наш редактор дошёл до сохранения. Системный вызов <code>write</code> отдан,
  запрос ушёл в подсистему, которая превращает удобное человеку имя файла в
  конкретные байты на конкретном устройстве.
</p>

<div class="callout-blue">
  <strong>Файловая система</strong> — часть ядра, которая организует хранение
  данных во внешней памяти: определяет правила размещения, отвечает за именование
  и права и обеспечивает доступ к содержимому.
</div>

<p>
  Набор операций над файлом стандартен настолько, что у него есть собственное имя:
  <strong>CRUD</strong> — Create, Read, Update, Delete, то есть «создать,
  прочитать, обновить, удалить». Аббревиатура пригодится далеко за пределами
  файловых систем: точно так же описывают работу с базами данных и веб-интерфейсами.
</p>

<p>
  Между именем <code>notes.txt</code> и микросхемой памяти SSD лежат пять
  уровней, и у каждого своя, довольно узкая задача.
</p>

<div class="stage" id="stageFs" tabindex="0">
  <div class="stage-figure">
<svg id="fs" viewBox="0 0 960 600" role="img" aria-label="Пять уровней файловой системы от приложения до блочного уровня, а также как файл в 4200 байт занимает два блока по 4096 байт">
  <style>
    #fs { font-family: Helvetica, Arial, sans-serif; }
    #fs .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #fs .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #fs .bn { fill: #F4F2EC; stroke: #C8C3B6; stroke-width: 1.3; }
    #fs .bh { fill: #F2F0EA; stroke: #5E5850; stroke-width: 1.5; }
    #fs .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #fs .lbl { font-size: 15px; fill: #111111; }
    #fs .sm { font-size: 13px; fill: #5E5850; }
    #fs .chip { font-size: 13px; fill: #111111; }
    #fs .band { font-size: 12.5px; fill: #5E5850; letter-spacing: .08em; }
    #fs .edge { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #fs .rtx { font-size: 13px; fill: #C30B0A; }
    #fs .strip { fill: #F8FBFE; stroke: #D9E4F0; stroke-width: 1.2; }
    #fs .striplab { font-size: 12px; fill: #2A5E9B; letter-spacing: .07em; }
    #fs .stripval { font-size: 14px; fill: #111111; }
    #fs .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="fs-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text x="40" y="64" class="band">ПУТЬ ЗАПРОСА СВЕРХУ ВНИЗ</text>

  <g data-key="l1">
    <rect x="40" y="80" width="560" height="56" rx="9" class="bx"/>
    <text x="60" y="105" class="lbl">1 · Приложение пользователя</text>
    <text x="60" y="126" class="sm">видит имя и путь: /home/user/notes.txt</text>
  </g>

  <g data-key="l2">
    <line x1="320" y1="136" x2="320" y2="150" class="edge" marker-end="url(#fs-arw)"/>
    <rect x="40" y="154" width="560" height="56" rx="9" class="by"/>
    <text x="60" y="179" class="lbl">2 · Логическая файловая система</text>
    <text x="60" y="200" class="sm">права, владелец, каталоги, время изменения — существует ли путь</text>
  </g>

  <g data-key="l3">
    <line x1="320" y1="210" x2="320" y2="224" class="edge" marker-end="url(#fs-arw)"/>
    <rect x="40" y="228" width="560" height="56" rx="9" class="by"/>
    <text x="60" y="253" class="lbl">3 · Виртуальная файловая система (VFS)</text>
    <text x="60" y="274" class="sm">единый интерфейс поверх ext4, NTFS, FAT32, APFS</text>
  </g>

  <g data-key="l4">
    <line x1="320" y1="284" x2="320" y2="298" class="edge" marker-end="url(#fs-arw)"/>
    <rect x="40" y="302" width="560" height="56" rx="9" class="by"/>
    <text x="60" y="327" class="lbl">4 · Физическая файловая система</text>
    <text x="60" y="348" class="sm">в каких именно блоках диска лежит этот файл</text>
  </g>

  <g data-key="l5">
    <line x1="320" y1="358" x2="320" y2="372" class="edge" marker-end="url(#fs-arw)"/>
    <rect x="40" y="376" width="560" height="56" rx="9" class="by"/>
    <text x="60" y="401" class="lbl">5 · Блочный уровень</text>
    <text x="60" y="422" class="sm">чтение и запись блоками по 4096 байт, дальше — драйвер</text>
  </g>

  <g data-key="hw">
    <line x1="320" y1="432" x2="320" y2="446" class="edge" marker-end="url(#fs-arw)"/>
    <rect x="40" y="450" width="560" height="56" rx="9" class="bh"/>
    <text x="60" y="475" class="lbl">Накопитель</text>
    <text x="60" y="496" class="sm">SSD, жёсткий диск, флешка, карта памяти</text>
  </g>

  <g data-key="blocks">
    <text x="640" y="100" class="sm">Файл notes.txt — 4200 байт</text>
    <rect x="640" y="112" width="280" height="44" rx="6" class="bx"/>
    <text x="652" y="140" class="chip">блок 1 · 4096 Б заполнен</text>
    <rect x="640" y="166" width="280" height="44" rx="6" class="bn"/>
    <rect x="640" y="166" width="7" height="44" class="bx"/>
    <text x="660" y="194" class="chip">блок 2 · всего 104 Б данных</text>
    <text x="640" y="238" class="sm">на диске 8192 Б вместо 4200:</text>
    <text x="640" y="258" class="sm">потеря 3992 Б, это 48,7%</text>
  </g>

  <g data-key="waste" data-only="1">
    <rect x="649" y="168" width="269" height="40" rx="5" class="br"/>
    <text x="783" y="193" class="rtx" text-anchor="middle">3992 Б впустую</text>
  </g>

  <g data-key="types">
    <text x="640" y="296" class="band">ТИПЫ ФАЙЛОВЫХ СИСТЕМ</text>
    <rect x="640" y="308" width="280" height="26" rx="6" class="bn"/>
    <text x="652" y="326" class="chip">FAT · флешки, карты памяти</text>
    <rect x="640" y="340" width="280" height="26" rx="6" class="bn"/>
    <text x="652" y="358" class="chip">NTFS · внутренние диски Windows</text>
    <rect x="640" y="372" width="280" height="26" rx="6" class="bn"/>
    <text x="652" y="390" class="chip">ext4 · Linux и Linux-серверы</text>
    <rect x="640" y="404" width="280" height="26" rx="6" class="bn"/>
    <text x="652" y="422" class="chip">HFS · старые Mac</text>
    <rect x="640" y="436" width="280" height="26" rx="6" class="bn"/>
    <text x="652" y="454" class="chip">APFS · macOS и iOS 11 и новее</text>
  </g>

  <rect x="40" y="520" width="880" height="44" rx="8" class="strip"/>
  <text x="54" y="547" class="striplab">ЗАМЕР</text>

  <g data-key="n1" data-only="1"><text x="106" y="547" class="stripval">в Windows путь выглядит как C:\notes.txt, в Linux — /home/user/notes.txt</text></g>
  <g data-key="n2" data-only="1"><text x="106" y="547" class="stripval">права и владелец лежат не в файле, а в его метаданных: inode 622607, режим 0644</text></g>
  <g data-key="n3" data-only="1"><text x="106" y="547" class="stripval">cat /proc/filesystems на этой машине перечисляет больше двадцати типов файловых систем</text></g>
  <g data-key="n4" data-only="1"><text x="106" y="547" class="stripval">этот уровень знает внутреннее устройство носителя и сопоставляет файл конкретным блокам</text></g>
  <g data-key="n5" data-only="1"><text x="106" y="547" class="stripval">размер блока на этом диске — 4096 байт, его же показывает stat в поле IO Block</text></g>
  <g data-key="n6" data-only="1"><text x="106" y="547" class="stripval">stat notes.txt: Size 4200, Blocks 16 — шестнадцать секторов по 512 Б, то есть два блока</text></g>
  <g data-key="n7" data-only="1"><text x="106" y="547" class="stripval">каталог /etc: 302 файла, 5 672 383 Б содержимого, 6 541 312 Б на диске — 13,3% впустую</text></g>

  <text x="40" y="586" class="legend">синий — то, что видит приложение, и занятые данные · жёлтый — уровни ядра · серый — носитель и пустое место</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="l1 n1" data-focus="l1">
      <div class="step-kicker">Шаг 1 · человеческий уровень</div>
      <h4>Файл — это имя и путь</h4>
      <p>Приложение не знает ни о каких блоках. Оно оперирует строкой и дескриптором, полученным при открытии, а всё остальное для него не существует.</p>
    </div>
    <div class="step-panel" data-on="l1 l2 n2" data-focus="l2">
      <div class="step-kicker">Шаг 2 · можно ли вообще</div>
      <h4>Логическая файловая система: права и метаданные</h4>
      <p>Первый вопрос — не «где лежит», а «существует ли такой путь и разрешено ли вам туда писать». Здесь живут имена, каталоги, владельцы, права, время создания и изменения.</p>
      <p>Обратите внимание: всё это хранится отдельно от содержимого файла. Поэтому переименование огромного файла происходит мгновенно — двигать данные не нужно.</p>
    </div>
    <div class="step-panel" data-on="l1 l2 l3 types n3" data-focus="l3">
      <div class="step-kicker">Шаг 3 · слой абстракции</div>
      <h4>VFS: приложению всё равно, что под ним</h4>
      <p>Виртуальная файловая система принимает вызов, разбирает путь и передаёт операцию драйверу той файловой системы, на которой файл живёт. Благодаря ей один и тот же <code>read()</code> работает и на ext4, и на NTFS, и на флешке с FAT32.</p>
      <p>Более того, через VFS работают вещи, которые файлами не являются вовсе: <code>/proc</code> из прошлых частей — это тоже «файловая система», просто её содержимое ядро сочиняет на лету.</p>
    </div>
    <div class="step-panel" data-on="l1 l2 l3 l4 types n4" data-focus="l4">
      <div class="step-kicker">Шаг 4 · конкретика</div>
      <h4>Физическая файловая система</h4>
      <p>Здесь начинается устройство носителя: где хранятся метаданные, как устроены каталоги, какие блоки заняты этим файлом. Это и есть то, что отличает ext4 от NTFS, — способ разложить данные по диску.</p>
    </div>
    <div class="step-panel" data-on="l1 l2 l3 l4 l5 hw types n5" data-focus="l5 hw">
      <div class="step-kicker">Шаг 5 · дно стопки</div>
      <h4>Блочный уровень</h4>
      <p>Ниже никаких файлов уже нет — есть пронумерованные блоки фиксированного размера, обычно 512 байт или 4 КиБ. Блочный уровень собирает запросы, при необходимости переупорядочивает их и отдаёт драйверу устройства.</p>
    </div>
    <div class="step-panel" data-on="l1 l2 l3 l4 l5 hw types blocks n6" data-focus="blocks">
      <div class="step-kicker">Шаг 6 · арифметика на диске</div>
      <h4>4200 байт не помещаются в один блок</h4>
      <p>4200 больше 4096, значит, нужен второй блок. Во втором блоке лежат оставшиеся 104 байта, а остальные 3992 байта места остаются занятыми, но пустыми: блок нельзя поделить между двумя файлами.</p>
      <p>Проверяется одной командой: <code>stat</code> честно показывает Size 4200 и Blocks 16, то есть шестнадцать секторов по 512 байт.</p>
    </div>
    <div class="step-panel" data-on="l1 l2 l3 l4 l5 hw types blocks waste n7" data-focus="waste">
      <div class="step-kicker">Шаг 7 · насколько это дорого</div>
      <h4>Внутренняя фрагментация</h4>
      <p>На одном файле потеря почти половина. В среднем по системе — меньше, но заметно: в каталоге <code>/etc</code> той же машины 302 файла содержат 5 672 383 байта, а занимают 6 541 312. Тринадцать процентов места держат пустоту.</p>
      <p>Уменьшить блок — уменьшить потери, но вырастет число обращений к диску и размер таблиц. 4 КиБ — это компромисс, а не природная константа.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Правило, по которому считается занятое место, одно для всех файлов: размер
  округляется вверх до целого числа блоков.
</p>

<div class="math-display" data-tex="\text{на диске} \;=\; \left\lceil \frac{S}{B} \right\rceil \cdot B \;=\; \left\lceil \frac{4200}{4096} \right\rceil \cdot 4096 \;=\; 2 \cdot 4096 \;=\; 8192\ \text{Б}"></div>

<p>
  Отсюда и потеря в 3992 байта — почти половина от полезного размера. На одном
  файле это ничто, но в каталоге <code>/etc</code> этой машины лежат 302 файла с
  общим содержимым 5 672 383 байта, а диска они занимают 6 541 312 — на 13,3%
  больше. Чем мельче файлы, тем заметнее эффект, и это одна из причин, по которым
  файловые системы для огромного числа мелких файлов настраивают отдельно.
</p>

<div class="term" id="tm3" data-first="stat notes.txt">
  <div class="term-head">Консоль 3 · файл, диск и типы файловых систем</div>
  <div class="term-screen" aria-live="polite"></div>
  <div class="term-line"><span class="term-ps">$</span><input class="term-in" type="text" spellcheck="false" autocomplete="off" aria-label="Ввод команды"></div>
  <div class="term-cmds">
    <button type="button" data-cmd="stat notes.txt">stat notes.txt</button>
    <button type="button" data-cmd="df -h /">df -h /</button>
    <button type="button" data-cmd="lsblk">lsblk</button>
    <button type="button" data-cmd="cat /proc/filesystems | head -20">cat /proc/filesystems</button>
    <button type="button" data-cmd="help">help</button>
  </div>
</div>
<p class="term-hint">В Windows то же самое смотрят через свойства файла и оснастку «Управление дисками», в macOS — через Finder и Disk Utility.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> файловая система — это стопка переводчиков.
  Наверху имя и права, внизу пронумерованные блоки одинакового размера, и между
  ними слой VFS, благодаря которому приложению безразлично, на чём именно лежит
  файл.
</div>

---

## Часть 8. Менеджер памяти

<p>
  Пока файл сохранялся, редактор держал текст в памяти. Кто-то должен был эту
  память ему выдать, вести учёт, а потом забрать обратно.
</p>

<p>
  Задачи подсистемы управления памятью формулируются коротко: выделять и
  освобождать память процессам, вести учёт занятого, бороться с
  <strong>фрагментацией</strong> (когда свободное место рассыпано мелкими
  несмежными кусками и им невозможно воспользоваться), обеспечивать корректную
  работу с оперативной памятью и кэшами и не давать процессам портить данные
  друг друга.
</p>

<p>
  С точки зрения памяти процесс — не сплошной кусок, а несколько секций с разными
  правилами. <strong>Секция кода</strong> (Text) содержит исполняемые инструкции
  и обычно доступна только для чтения. <strong>Секция данных</strong> (Data) —
  переменные, которые созданы до запуска и живут всё время работы.
  <strong>Куча</strong> (Heap) — область для того, что запрашивается по ходу дела
  и чей размер заранее неизвестен. <strong>Стек</strong> (Stack) — временные
  данные: аргументы функций, адреса возврата, локальные переменные. Между кучей
  и стеком лежит <strong>свободная область</strong>: куча растёт вверх, стек —
  вниз, и этот зазор позволяет им расширяться, не мешая друг другу.
</p>

<p>
  Всё это не рисунок из учебника, а то, что видно в работающей программе. Ниже —
  настоящая карта адресного пространства крошечной программы на C.
</p>

<div class="stage" id="stageMm" tabindex="0">
  <div class="stage-figure">
<svg id="mm" viewBox="0 0 960 580" role="img" aria-label="Карта адресного пространства процесса с секциями кода, данных, кучей, стеком и свободной областью, и таблица перевода виртуальных страниц в физические кадры">
  <style>
    #mm { font-family: Helvetica, Arial, sans-serif; }
    #mm .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mm .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #mm .bn { fill: #F4F2EC; stroke: #C8C3B6; stroke-width: 1.3; stroke-dasharray: 7 5; }
    #mm .bf { fill: #F4F2EC; stroke: #C8C3B6; stroke-width: 1.3; }
    #mm .ok { fill: none; stroke: #73B222; stroke-width: 2.2; }
    #mm .lbl { font-size: 15px; fill: #111111; }
    #mm .sm { font-size: 13px; fill: #5E5850; }
    #mm .mono { font-size: 12.5px; fill: #5E5850; font-family: "Courier New", Courier, monospace; }
    #mm .band { font-size: 12.5px; fill: #5E5850; letter-spacing: .08em; }
    #mm .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #mm .redge { stroke: #C30B0A; stroke-width: 1.8; fill: none; stroke-dasharray: 6 4; }
    #mm .gtx { font-size: 13px; fill: #5A8C1C; }
    #mm .ytx { font-size: 14px; fill: #111111; }
    #mm .strip { fill: #F8FBFE; stroke: #D9E4F0; stroke-width: 1.2; }
    #mm .striplab { font-size: 12px; fill: #2A5E9B; letter-spacing: .07em; }
    #mm .stripval { font-size: 14px; fill: #111111; }
    #mm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="mm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="mm-rarw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text x="280" y="58" class="band" text-anchor="middle">АДРЕСНОЕ ПРОСТРАНСТВО ПРОЦЕССА</text>
  <text x="132" y="84" class="sm" text-anchor="end">старшие</text>
  <text x="132" y="478" class="sm" text-anchor="end">младшие</text>

  <g data-key="kern">
    <rect x="140" y="70" width="280" height="44" rx="8" class="by"/>
    <text x="280" y="98" class="lbl" text-anchor="middle">Пространство ядра</text>
  </g>

  <g data-key="stack">
    <rect x="140" y="124" width="280" height="54" rx="8" class="bx"/>
    <text x="280" y="148" class="lbl" text-anchor="middle">Стек (Stack)</text>
    <text x="280" y="168" class="sm" text-anchor="middle">132 КиБ, растёт вниз</text>
    <text x="430" y="146" class="mono">7fff1a65d000</text>
    <text x="430" y="170" class="mono">7fff1a63c000</text>
  </g>

  <g data-key="gap">
    <rect x="140" y="188" width="280" height="130" rx="8" class="bn"/>
    <text x="280" y="242" class="lbl" text-anchor="middle">Свободная область</text>
    <text x="280" y="268" class="lbl" text-anchor="middle">≈ 128 ТиБ</text>
    <line x1="200" y1="196" x2="200" y2="222" class="edge" marker-end="url(#mm-arw)"/>
    <line x1="360" y1="310" x2="360" y2="284" class="edge" marker-end="url(#mm-arw)"/>
  </g>

  <g data-key="heap">
    <rect x="140" y="328" width="280" height="54" rx="8" class="bx"/>
    <text x="280" y="352" class="lbl" text-anchor="middle">Куча (Heap)</text>
    <text x="280" y="372" class="sm" text-anchor="middle">132 КиБ, растёт вверх</text>
    <text x="430" y="350" class="mono">0b21f000</text>
    <text x="430" y="374" class="mono">0b1fe000</text>
  </g>

  <g data-key="data">
    <rect x="140" y="392" width="280" height="44" rx="8" class="bx"/>
    <text x="280" y="420" class="lbl" text-anchor="middle">Данные · rw-</text>
    <text x="430" y="420" class="mono">00404000-00405000</text>
  </g>

  <g data-key="textg">
    <rect x="140" y="446" width="280" height="44" rx="8" class="bx"/>
    <text x="280" y="474" class="lbl" text-anchor="middle">Код программы · r-x</text>
    <text x="430" y="474" class="mono">00401000-00402000</text>
  </g>

  <g data-key="perm" data-only="1">
    <rect x="136" y="388" width="288" height="52" rx="10" class="ok"/>
    <rect x="136" y="442" width="288" height="52" rx="10" class="ok"/>
    <text x="600" y="440" class="gtx">r-x: исполнять можно, писать нельзя</text>
    <text x="600" y="462" class="gtx">rw-: писать можно, исполнять нельзя</text>
  </g>

  <g data-key="pages">
    <text x="600" y="58" class="band">СТРАНИЦЫ ПРОЦЕССА И КАДРЫ ПАМЯТИ</text>
    <rect x="600" y="80" width="110" height="36" rx="6" class="bx"/>
    <text x="655" y="104" class="sm" text-anchor="middle">страница 0</text>
    <rect x="600" y="126" width="110" height="36" rx="6" class="bx"/>
    <text x="655" y="150" class="sm" text-anchor="middle">страница 1</text>
    <rect x="600" y="172" width="110" height="36" rx="6" class="bx"/>
    <text x="655" y="196" class="sm" text-anchor="middle">страница 2</text>
    <rect x="600" y="218" width="110" height="36" rx="6" class="bx"/>
    <text x="655" y="242" class="sm" text-anchor="middle">страница 3</text>
    <rect x="810" y="80" width="110" height="36" rx="6" class="bf"/>
    <text x="865" y="104" class="sm" text-anchor="middle">кадр 7</text>
    <rect x="810" y="126" width="110" height="36" rx="6" class="bf"/>
    <text x="865" y="150" class="sm" text-anchor="middle">кадр 2</text>
    <rect x="810" y="172" width="110" height="36" rx="6" class="bf"/>
    <text x="865" y="196" class="sm" text-anchor="middle">кадр 19</text>
    <rect x="810" y="218" width="110" height="36" rx="6" class="bf"/>
    <text x="865" y="242" class="sm" text-anchor="middle">ещё не выдан</text>
    <line x1="710" y1="98" x2="806" y2="144" class="edge" marker-end="url(#mm-arw)"/>
    <line x1="710" y1="144" x2="806" y2="98" class="edge" marker-end="url(#mm-arw)"/>
    <line x1="710" y1="190" x2="806" y2="190" class="edge" marker-end="url(#mm-arw)"/>
    <line x1="710" y1="236" x2="806" y2="236" class="redge" marker-end="url(#mm-rarw)"/>
    <text x="600" y="276" class="sm">страница — 4096 байт;</text>
    <text x="600" y="294" class="sm">таблица перевода у каждого процесса своя</text>
  </g>

  <g data-key="lazy" data-only="1">
    <rect x="600" y="310" width="320" height="96" rx="9" class="by"/>
    <text x="760" y="338" class="ytx" text-anchor="middle">mmap на 1 ГиБ — 3,0 мкс</text>
    <text x="760" y="364" class="ytx" text-anchor="middle">первое касание страницы — 1,5 мкс</text>
    <text x="760" y="390" class="ytx" text-anchor="middle">повторная запись туда же — 14 нс</text>
  </g>

  <g data-key="mmapnote" data-only="1">
    <rect x="600" y="310" width="320" height="96" rx="9" class="by"/>
    <text x="760" y="338" class="ytx" text-anchor="middle">malloc(1 МиБ) не попал в кучу:</text>
    <text x="760" y="364" class="ytx" text-anchor="middle">крупные блоки glibc берёт</text>
    <text x="760" y="390" class="ytx" text-anchor="middle">отдельной областью через mmap</text>
  </g>

  <rect x="40" y="500" width="880" height="44" rx="8" class="strip"/>
  <text x="54" y="527" class="striplab">ЗАМЕР</text>

  <g data-key="n1" data-only="1"><text x="106" y="527" class="stripval">адреса взяты из настоящего прогона: 00401000 — код, 00404000 — данные</text></g>
  <g data-key="n2" data-only="1"><text x="106" y="527" class="stripval">страница кода помечена r-x, страница данных rw- — выполнить данные процессор откажется</text></g>
  <g data-key="n3" data-only="1"><text x="106" y="527" class="stripval">куча в этом прогоне занимала 132 КиБ: от 0b1fe000 до 0b21f000</text></g>
  <g data-key="n4" data-only="1"><text x="106" y="527" class="stripval">стек тоже 132 КиБ: от 7fff1a63c000 до 7fff1a65d000, и растёт он вниз</text></g>
  <g data-key="n5" data-only="1"><text x="106" y="527" class="stripval">между вершиной кучи и дном стека 140 733 449 359 360 байт — ровно 128 ТиБ</text></g>
  <g data-key="n6" data-only="1"><text x="106" y="527" class="stripval">getconf PAGE_SIZE на этой машине отвечает 4096</text></g>
  <g data-key="n7" data-only="1"><text x="106" y="527" class="stripval">выделить 1 ГиБ — 3,0 мкс; первое касание страницы — 1,5 мкс; повторная запись — 14 нс</text></g>
  <g data-key="n8" data-only="1"><text x="106" y="527" class="stripval">malloc(1 МиБ) в этом прогоне ушёл не в [heap], а в отдельную область через mmap</text></g>

  <text x="40" y="566" class="legend">синий — память процесса · жёлтый — то, чем распоряжается ядро · серый — свободное и физическое · зелёный — права страниц</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="kern textg data n1" data-focus="textg data">
      <div class="step-kicker">Шаг 1 · с чего начинается процесс</div>
      <h4>Код и данные приходят из файла</h4>
      <p>Внизу карты лежит то, что загружено прямо из исполняемого файла: инструкции и заранее известные переменные. Адреса настоящие — это вывод <code>/proc/self/maps</code> реальной программы.</p>
    </div>
    <div class="step-panel" data-on="kern textg data perm n2" data-focus="perm">
      <div class="step-kicker">Шаг 2 · права на страницы</div>
      <h4>Разделение кода и данных — это защита</h4>
      <p>У каждой области свои права, и проверяет их процессор. Код можно исполнять, но нельзя изменять; данные можно менять, но нельзя исполнять.</p>
      <p>Это не педантизм: огромный класс атак строится на том, чтобы подсунуть программе данные и заставить выполнить их как код. Запрет на уровне таблицы страниц закрывает эту дверь целиком.</p>
    </div>
    <div class="step-panel" data-on="kern textg data heap n3" data-focus="heap">
      <div class="step-kicker">Шаг 3 · то, что просят по ходу</div>
      <h4>Куча</h4>
      <p>Сюда попадает всё, чей размер и срок жизни заранее неизвестны: текст, который вы печатаете, открытые документы, буферы. Именно эту область увеличивает <code>malloc()</code>, обращаясь к ядру за новыми страницами.</p>
    </div>
    <div class="step-panel" data-on="kern textg data heap stack n4" data-focus="stack">
      <div class="step-kicker">Шаг 4 · то, что живёт недолго</div>
      <h4>Стек</h4>
      <p>Аргументы функций, адреса возврата, локальные переменные. Вызвали функцию — стек подрос, вернулись — уменьшился. Всё автоматически, никаких обращений к ядру.</p>
      <p>Стек растёт в сторону меньших адресов, то есть навстречу куче.</p>
    </div>
    <div class="step-panel" data-on="kern textg data heap stack gap n5" data-focus="gap">
      <div class="step-kicker">Шаг 5 · почему они не встретятся</div>
      <h4>Между ними 128 терабайт</h4>
      <p>Разрыв между вершиной кучи и дном стека в этом прогоне — 140 733 449 359 360 байт. Столько оперативной памяти не бывает, и это нормально: адреса виртуальные, физической памяти за ними пока нет.</p>
      <p>Классическая картинка «куча растёт вверх, стек вниз, однажды столкнутся» описывает машины, где адресное пространство было сравнимо с объёмом памяти. На 64 разрядах места хватает всем.</p>
    </div>
    <div class="step-panel" data-on="kern textg data heap stack gap pages n6" data-focus="pages">
      <div class="step-kicker">Шаг 6 · как это устроено</div>
      <h4>Страницы и кадры</h4>
      <p>Адресное пространство нарезано на страницы по 4096 байт, физическая память — на кадры того же размера. Таблица перевода у каждого процесса своя, и именно поэтому один и тот же адрес у двух процессов указывает на разные байты.</p>
      <p>Заодно решается фрагментация: странице всё равно, в какой кадр она попадёт, поэтому непрерывный кусок физической памяти никому не нужен.</p>
    </div>
    <div class="step-panel" data-on="kern textg data heap stack gap pages lazy n7" data-focus="lazy">
      <div class="step-kicker">Шаг 7 · главная экономия</div>
      <h4>Память выдают лениво</h4>
      <p>Запросить гигабайт стоит 3,0 мкс — ядро просто отмечает диапазон адресов как ваш. Физической памяти при этом не выдаётся ни байта.</p>
      <p>Кадр появляется в момент первого обращения: процессор возбуждает страничный отказ, ядро находит свободный кадр, обнуляет его и правит таблицу. Это 1,5 мкс на страницу. Повторная запись в ту же страницу — 14 нс, в сто раз быстрее: ядро больше не участвует.</p>
    </div>
    <div class="step-panel" data-on="kern textg data heap stack gap pages mmapnote n8" data-focus="mmapnote">
      <div class="step-kicker">Шаг 8 · неожиданная подробность</div>
      <h4>Куча — не единственное место для malloc</h4>
      <p>В этом прогоне программа попросила мегабайт, и он не появился в области <code>[heap]</code>: библиотека взяла его отдельным участком через <code>mmap</code>, потому что для крупных блоков так проще потом вернуть память системе.</p>
      <p>Полезное напоминание: «куча» — понятие библиотеки, а не ядра. Ядро знает только про области адресов и их права.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="term" id="tm4" data-first="/home/claude/maps">
  <div class="term-head">Консоль 4 · карта памяти живого процесса</div>
  <div class="term-screen" aria-live="polite"></div>
  <div class="term-line"><span class="term-ps">$</span><input class="term-in" type="text" spellcheck="false" autocomplete="off" aria-label="Ввод команды"></div>
  <div class="term-cmds">
    <button type="button" data-cmd="/home/claude/maps">./maps</button>
    <button type="button" data-cmd="getconf PAGE_SIZE">getconf PAGE_SIZE</button>
    <button type="button" data-cmd="free -h">free -h</button>
    <button type="button" data-cmd="help">help</button>
  </div>
</div>
<p class="term-hint">Программа <code>maps</code> печатает адреса своих переменных, а затем читает собственный файл <code>/proc/self/maps</code>. Между запусками адреса кучи и стека меняются: ядро специально их сдвигает, чтобы усложнить атаки.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> процесс работает не с памятью, а со своей
  картой адресов. Ядро выдаёт диапазоны мгновенно и почти бесплатно, а настоящие
  килобайты подкладывает под них по одному, в момент первого обращения.
</div>

---

<script type="application/json" id="term-data">
{
 "ps -eo pid,ppid,stat,comm | head -8": "  PID  PPID STAT COMMAND\n    1     0 SLl  process_api\n    2     0 S    kthreadd\n    3     2 S    pool_workqueue_release\n    4     2 I\u003c   kworker/R-rcu_gp\n    5     2 I\u003c   kworker/R-sync_wq\n    6     2 I\u003c   kworker/R-kvfree_rcu_reclaim\n    7     2 I\u003c   kworker/R-slub_flushwq",
 "ldd /bin/cat": "\tlinux-vdso.so.1 (0x00007ff0a15fa000)\n\tlibc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ff0a1200000)\n\t/lib64/ld-linux-x86-64.so.2 (0x00007ff0a15fc000)",
 "ls -l /bin/cat": "-rwxr-xr-x 1 root root 39384 Jan 23  2026 /bin/cat",
 "stat notes.txt": "  File: notes.txt\n  Size: 4200      \tBlocks: 16         IO Block: 4096   regular file\nDevice: 254,0\tInode: 622607      Links: 1\nAccess: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)\nAccess: 2026-08-27 06:52:44.502055606 +0000\nModify: 2026-08-27 06:52:56.504916725 +0000\nChange: 2026-08-27 06:52:56.504916725 +0000\n Birth: 2026-08-27 06:52:44.502055606 +0000",
 "df -h /": "Filesystem      Size  Used Avail Use% Mounted on\n/dev/vda        252G  8.6G   10G  47% /",
 "lsblk": "NAME  MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\nzram0 253:0    0    0B  0 disk \nvda   254:0    0  256G  0 disk /\nvdb   254:16   0  9.8M  1 disk /opt/rclone\nvdc   254:32   0  676K  1 disk /mnt/skills/public\nvdd   254:48   0  5.5M  1 disk /mnt/skills/examples",
 "cat /proc/filesystems | head -20": "nodev\tsysfs\nnodev\ttmpfs\nnodev\tproc\nnodev\tcgroup\nnodev\tcgroup2\nnodev\tcpuset\nnodev\tdevtmpfs\nnodev\tbinfmt_misc\nnodev\tdebugfs\nnodev\ttracefs\nnodev\tsecurityfs\nnodev\tsockfs\nnodev\tbpf\nnodev\tpipefs\nnodev\tramfs\nnodev\thugetlbfs\nnodev\tdevpts\n\text3\n\text2\n\text4",
 "free -h": "               total        used        free      shared  buff/cache   available\nMem:           3.9Gi       229Mi       3.8Gi       5.0Mi        89Mi       3.7Gi\nSwap:             0B          0B          0B",
 "getconf PAGE_SIZE": "4096",
 "ls -l /dev/vda /dev/tty /dev/null /dev/zero": "crw-rw-rw- 1 root root   1, 3 Aug 27 04:57 /dev/null\ncrw-rw-rw- 1 root root   5, 0 Aug 27 04:57 /dev/tty\nbrw------- 1 root root 254, 0 Aug 27 04:57 /dev/vda\ncrw-rw-rw- 1 root root   1, 5 Aug 27 04:57 /dev/zero",
 "cat /proc/interrupts": "           CPU0       \n 24:          1  IO-APIC   5-edge      ACPI:Ged\n 25:          1  IO-APIC   6-edge      ACPI:Ged\n 26:          0  IO-APIC   4-edge      ttyS0\n 29:          0 PCI-MSIX-0000:00:01.0   0-edge      virtio0-config\n 30:          0 PCI-MSIX-0000:00:01.0   1-edge      virtio0-inflate\n 31:          0 PCI-MSIX-0000:00:01.0   2-edge      virtio0-deflate\n 32:         26 PCI-MSIX-0000:00:01.0   3-edge      virtio0-stats\n 33:          1 PCI-MSIX-0000:00:01.0   4-edge      virtio0-reporting_vq\n 34:          0 PCI-MSIX-0000:00:08.0   0-edge      virtio7-config\n 35:         14 PCI-MSIX-0000:00:08.0   1-edge      virtio7-input\n 36:          1 PCI-MSIX-0000:00:02.0   0-edge      virtio1-config\n 37:        750 PCI-MSIX-0000:00:02.0   1-edge      virtio1-req.0\n 38:          1 PCI-MSIX-0000:00:03.0   0-edge      virtio2-config\n 39:         72 PCI-MSIX-0000:00:03.0   1-edge      virtio2-req.0\n 40:          1 PCI-MSIX-0000:00:04.0   0-edge      virtio3-config\n 41:          8 PCI-MSIX-0000:00:04.0   1-edge      virtio3-req.0\n 42:          1 PCI-MSIX-0000:00:05.0   0-edge      virtio4-config\n 43:          8 PCI-MSIX-0000:00:05.0   1-edge      virtio4-req.0\n 44:          0 PCI-MSIX-0000:00:06.0   0-edge      virtio5-config\n 45:         79 PCI-MSIX-0000:00:06.0   1-edge      virtio5-input.0\n 46:         70 PCI-MSIX-0000:00:06.0   2-edge      virtio5-output.0\n 47:          0 PCI-MSIX-0000:00:07.0   0-edge      virtio6-config\n 48:         20 PCI-MSIX-0000:00:07.0   1-edge      virtio6-rx\n 49:        276 PCI-MSIX-0000:00:07.0   2-edge      virtio6-tx\n 50:          1 PCI-MSIX-0000:00:07.0   3-edge      virtio6-event\nNMI:          0   Non-maskable interrupts\nLOC:       4649   Local timer interrupts\nSPU:          0   Spurious interrupts\nPMI:          0   Performance monitoring interrupts\nIWI:          0   IRQ work interrupts\nRTR:          0   APIC ICR read retries\nRES:          0   Rescheduling interrupts\nCAL:          0   Function call interrupts\nTLB:          0   TLB shootdowns\nTRM:          0   Thermal event interrupts\nHYP:          2   Hypervisor callback interrupts\nERR:          0\nMIS:          0",
 "ls /sys/class/net": "eth0\nifb0\nifb1\nlo",
 "nproc": "1",
 "/home/claude/maps": "PID 521\nкод main   0x401256\n.data      0x404060\n.bss       0x404074\nкуча       0x7ffb4c8a5010\nстек       0x7fff1a65b47f\n---- /proc/self/maps ----\n00400000-00401000 r--p 00000000 fe:00 622609                             /home/claude/maps\n00401000-00402000 r-xp 00001000 fe:00 622609                             /home/claude/maps\n00402000-00403000 r--p 00002000 fe:00 622609                             /home/claude/maps\n00403000-00404000 r--p 00002000 fe:00 622609                             /home/claude/maps\n00404000-00405000 rw-p 00003000 fe:00 622609                             /home/claude/maps\n0b1fe000-0b21f000 rw-p 00000000 00:00 0                                  [heap]\n7ffb4c600000-7ffb4c628000 r--p 00000000 fe:00 191494                     /usr/lib/x86_64-linux-gnu/libc.so.6\n7ffb4c628000-7ffb4c7b0000 r-xp 00028000 fe:00 191494                     /usr/lib/x86_64-linux-gnu/libc.so.6\n7ffb4c7b0000-7ffb4c7ff000 r--p 001b0000 fe:00 191494                     /usr/lib/x86_64-linux-gnu/libc.so.6\n7ffb4c7ff000-7ffb4c803000 r--p 001fe000 fe:00 191494                     /usr/lib/x86_64-linux-gnu/libc.so.6\n7ffb4c803000-7ffb4c805000 rw-p 00202000 fe:00 191494                     /usr/lib/x86_64-linux-gnu/libc.so.6\n7ffb4c805000-7ffb4c812000 rw-p 00000000 00:00 0 \n7ffb4c8a5000-7ffb4c9a9000 rw-p 00000000 00:00 0 \n7ffb4c9b6000-7ffb4c9b8000 rw-p 00000000 00:00 0 \n7ffb4c9b8000-7ffb4c9bc000 r--p 00000000 00:00 0                          [vvar]\n7ffb4c9bc000-7ffb4c9be000 r--p 00000000 00:00 0                          [vvar_vclock]\n7ffb4c9be000-7ffb4c9c0000 r-xp 00000000 00:00 0                          [vdso]\n7ffb4c9c0000-7ffb4c9c1000 r--p 00000000 fe:00 191474                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2\n7ffb4c9c1000-7ffb4c9ec000 r-xp 00001000 fe:00 191474                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2\n7ffb4c9ec000-7ffb4c9f6000 r--p 0002c000 fe:00 191474                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2\n7ffb4c9f6000-7ffb4c9f8000 r--p 00036000 fe:00 191474                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2\n7ffb4c9f8000-7ffb4c9fa000 rw-p 00038000 fe:00 191474                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2\n7fff1a63c000-7fff1a65d000 rw-p 00000000 00:00 0                          [stack]\nffffffffff600000-ffffffffff601000 --xp 00000000 00:00 0                  [vsyscall]",
 "cat /proc/539/status": "Name:\tpython3\nState:\tR (running)\nTgid:\t539\nPid:\t539\nPPid:\t538\nVmRSS:\t    9380 kB\nThreads:\t1\nvoluntary_ctxt_switches:\t1\nnonvoluntary_ctxt_switches:\t230",
 "python3 sched_exp.py": "counts ['18038000', '18313000', '17630000']\nwall 3.041 HZ 100\npid 599 cpu_s 0.88 nonvol 227 vol 0 avg_slice_ms 3.877\npid 600 cpu_s 0.88 nonvol 228 vol 0 avg_slice_ms 3.86\npid 601 cpu_s 0.88 nonvol 226 vol 0 avg_slice_ms 3.894"
}
</script>

## Часть 9. Блок работы с устройствами

<p>
  Осталась последняя подсистема — та, что действительно разговаривает с железом.
  Она состоит из трёх дополняющих друг друга частей: интерфейса ввода-вывода,
  сетевого интерфейса и драйверов.
</p>

<div class="callout-blue">
  <strong>Драйвер</strong> — программа, которая знает, какие команды понимает
  конкретное устройство, и переводит запросы операционной системы на его язык и
  обратно. Драйверы обычно пишут на C и C++: нужен и высокоуровневый код, и
  прямая работа с памятью и регистрами оборудования.
</div>

<p>
  Устройства разные, но ядро сводит их к трём типам потоков. <strong>Блочный
  ввод-вывод</strong> — всё, что работает блоками фиксированного размера:
  диски, SSD, флешки, карты памяти. <strong>Символьный ввод-вывод</strong> —
  поток отдельных символов и событий: клавиатура, мышь, монитор, принтер, звук,
  камера. <strong>Сетевой ввод-вывод</strong> — пакеты: карта Ethernet,
  Bluetooth, модемы, VPN-интерфейсы.
</p>

<p>
  По своей сути ввод-вывод и сеть похожи, но исторически развивались параллельно
  и на схемах обычно идут отдельно: у них разная природа данных — файлы против
  пакетов.
</p>

<p>
  Проследим два сценария: нажатие клавиши и приход пакета из сети. Работу с
  блоками мы уже разобрали в части про файловую систему.
</p>

<div class="stage" id="stageIo" tabindex="0">
  <div class="stage-figure">
<svg id="io" viewBox="0 0 960 580" role="img" aria-label="Два сценария ввода-вывода: путь нажатой клавиши и путь сетевого пакета от железа через прерывание и драйвер до приложения, а также три типа потоков ввода-вывода">
  <style>
    #io { font-family: Helvetica, Arial, sans-serif; }
    #io .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #io .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #io .bh { fill: #F2F0EA; stroke: #5E5850; stroke-width: 1.5; }
    #io .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #io .lbl { font-size: 13.5px; fill: #111111; }
    #io .big { font-size: 15px; fill: #111111; }
    #io .sm { font-size: 13px; fill: #5E5850; }
    #io .band { font-size: 12.5px; fill: #5E5850; letter-spacing: .08em; }
    #io .edge { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #io .dash { stroke: #5E5850; stroke-width: 1.6; fill: none; stroke-dasharray: 7 5; }
    #io .rtx { font-size: 13.5px; fill: #C30B0A; }
    #io .strip { fill: #F8FBFE; stroke: #D9E4F0; stroke-width: 1.2; }
    #io .striplab { font-size: 12px; fill: #2A5E9B; letter-spacing: .07em; }
    #io .stripval { font-size: 14px; fill: #111111; }
    #io .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="io-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="seps">
    <text x="185" y="70" class="band" text-anchor="middle">ЖЕЛЕЗО</text>
    <text x="555" y="70" class="band" text-anchor="middle">ЯДРО</text>
    <text x="855" y="70" class="band" text-anchor="middle">ПРИЛОЖЕНИЕ</text>
    <line x1="330" y1="80" x2="330" y2="310" class="dash"/>
    <line x1="780" y1="80" x2="780" y2="310" class="dash"/>
  </g>

  <g data-key="kb1">
    <text x="40" y="94" class="band">СЦЕНАРИЙ 1 · НАЖАТИЕ КЛАВИШИ W</text>
    <rect x="40" y="100" width="130" height="64" rx="8" class="bh"/>
    <text x="105" y="126" class="lbl" text-anchor="middle">Клавиша W</text>
    <text x="105" y="146" class="sm" text-anchor="middle">скан-код</text>
    <line x1="170" y1="132" x2="184" y2="132" class="edge" marker-end="url(#io-arw)"/>
    <rect x="190" y="100" width="130" height="64" rx="8" class="bh"/>
    <text x="255" y="126" class="lbl" text-anchor="middle">Чипсет</text>
    <text x="255" y="146" class="sm" text-anchor="middle">прерывание</text>
  </g>

  <g data-key="kb2">
    <line x1="320" y1="132" x2="336" y2="132" class="edge" marker-end="url(#io-arw)"/>
    <rect x="340" y="100" width="130" height="64" rx="8" class="by"/>
    <text x="405" y="126" class="lbl" text-anchor="middle">Драйвер</text>
    <text x="405" y="146" class="sm" text-anchor="middle">код → буква w</text>
    <line x1="470" y1="132" x2="484" y2="132" class="edge" marker-end="url(#io-arw)"/>
    <rect x="490" y="100" width="130" height="64" rx="8" class="by"/>
    <text x="555" y="126" class="lbl" text-anchor="middle">Символьный</text>
    <text x="555" y="146" class="sm" text-anchor="middle">ввод-вывод</text>
  </g>

  <g data-key="kb3">
    <line x1="620" y1="132" x2="634" y2="132" class="edge" marker-end="url(#io-arw)"/>
    <rect x="640" y="100" width="130" height="64" rx="8" class="by"/>
    <text x="705" y="126" class="lbl" text-anchor="middle">Событие</text>
    <text x="705" y="146" class="sm" text-anchor="middle">в очередь окна</text>
    <line x1="770" y1="132" x2="786" y2="132" class="edge" marker-end="url(#io-arw)"/>
    <rect x="790" y="100" width="130" height="64" rx="8" class="bx"/>
    <text x="855" y="126" class="lbl" text-anchor="middle">notes</text>
    <text x="855" y="146" class="sm" text-anchor="middle">печатает w</text>
  </g>

  <g data-key="net1">
    <text x="40" y="224" class="band">СЦЕНАРИЙ 2 · ПРИШЁЛ ПАКЕТ ИЗ СЕТИ</text>
    <rect x="40" y="230" width="130" height="64" rx="8" class="bh"/>
    <text x="105" y="256" class="lbl" text-anchor="middle">Пакет</text>
    <text x="105" y="276" class="sm" text-anchor="middle">сетевая карта</text>
    <line x1="170" y1="262" x2="184" y2="262" class="edge" marker-end="url(#io-arw)"/>
    <rect x="190" y="230" width="130" height="64" rx="8" class="bh"/>
    <text x="255" y="256" class="lbl" text-anchor="middle">Чипсет</text>
    <text x="255" y="276" class="sm" text-anchor="middle">прерывание</text>
    <line x1="320" y1="262" x2="336" y2="262" class="edge" marker-end="url(#io-arw)"/>
    <rect x="340" y="230" width="130" height="64" rx="8" class="by"/>
    <text x="405" y="256" class="lbl" text-anchor="middle">Драйвер</text>
    <text x="405" y="276" class="sm" text-anchor="middle">разбирает кадр</text>
  </g>

  <g data-key="net2">
    <line x1="470" y1="262" x2="484" y2="262" class="edge" marker-end="url(#io-arw)"/>
    <rect x="490" y="230" width="130" height="64" rx="8" class="by"/>
    <text x="555" y="256" class="lbl" text-anchor="middle">Сетевой</text>
    <text x="555" y="276" class="sm" text-anchor="middle">ввод-вывод</text>
    <line x1="620" y1="262" x2="634" y2="262" class="edge" marker-end="url(#io-arw)"/>
    <rect x="640" y="230" width="130" height="64" rx="8" class="by"/>
    <text x="705" y="256" class="lbl" text-anchor="middle">Буфер сокета</text>
    <text x="705" y="276" class="sm" text-anchor="middle">ждёт читателя</text>
    <line x1="770" y1="262" x2="786" y2="262" class="edge" marker-end="url(#io-arw)"/>
    <rect x="790" y="230" width="130" height="64" rx="8" class="bx"/>
    <text x="855" y="256" class="lbl" text-anchor="middle">Браузер</text>
    <text x="855" y="276" class="sm" text-anchor="middle">recv() или read()</text>
  </g>

  <g data-key="coal" data-only="1">
    <rect x="620" y="306" width="300" height="36" rx="7" class="br"/>
    <text x="770" y="330" class="rtx" text-anchor="middle">83 333 прерывания в секунду</text>
  </g>

  <g data-key="types">
    <rect x="40" y="350" width="280" height="64" rx="9" class="by"/>
    <text x="180" y="380" class="big" text-anchor="middle">Блочный ввод-вывод</text>
    <text x="180" y="402" class="sm" text-anchor="middle">Block I/O Path</text>
    <text x="40" y="438" class="sm">HDD, SSD, NVMe, флешки,</text>
    <text x="40" y="458" class="sm">CD и DVD, карты памяти</text>
    <rect x="340" y="350" width="280" height="64" rx="9" class="by"/>
    <text x="480" y="380" class="big" text-anchor="middle">Символьный ввод-вывод</text>
    <text x="480" y="402" class="sm" text-anchor="middle">Char I/O Path</text>
    <text x="340" y="438" class="sm">клавиатура, мышь, монитор,</text>
    <text x="340" y="458" class="sm">принтер, звук, камера</text>
    <rect x="640" y="350" width="280" height="64" rx="9" class="by"/>
    <text x="780" y="380" class="big" text-anchor="middle">Сетевой ввод-вывод</text>
    <text x="780" y="402" class="sm" text-anchor="middle">Network I/O Path</text>
    <text x="640" y="438" class="sm">карта Ethernet, Bluetooth,</text>
    <text x="640" y="458" class="sm">модемы, VPN-интерфейсы</text>
  </g>

  <rect x="40" y="490" width="880" height="44" rx="8" class="strip"/>
  <text x="54" y="517" class="striplab">ЗАМЕР</text>

  <g data-key="n1" data-only="1"><text x="106" y="517" class="stripval">в /dev символьные устройства помечены буквой c, блочные — буквой b</text></g>
  <g data-key="n2" data-only="1"><text x="106" y="517" class="stripval">прерывание заставляет процессор бросить текущую задачу и уйти в обработчик драйвера</text></g>
  <g data-key="n3" data-only="1"><text x="106" y="517" class="stripval">драйверы пишут на C и C++: нужен доступ и к абстракциям, и к регистрам устройства</text></g>
  <g data-key="n4" data-only="1"><text x="106" y="517" class="stripval">что делать с событием, решает приложение: буква в редакторе, действие в игре</text></g>
  <g data-key="n5" data-only="1"><text x="106" y="517" class="stripval">в /proc/interrupts видны счётчики прерываний по каждому устройству отдельно</text></g>
  <g data-key="n6" data-only="1"><text x="106" y="517" class="stripval">браузер забирает данные из буфера сокета вызовами recv() или read()</text></g>
  <g data-key="n7" data-only="1"><text x="106" y="517" class="stripval">клавиатура даёт около 10 прерываний в секунду, сеть на 1 Гбит/с — 83 333</text></g>
  <g data-key="n8" data-only="1"><text x="106" y="517" class="stripval">если бы вход в обработчик стоил как системный вызов, это 9,7 мс процессора на секунду</text></g>

  <text x="40" y="556" class="legend">серый — железо · жёлтый — ядро и драйверы · синий — приложение · красный — нагрузка, с которой так работать нельзя</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="seps types n1" data-focus="types">
      <div class="step-kicker">Шаг 1 · три очереди</div>
      <h4>Ядро сводит все устройства к трём типам потоков</h4>
      <p>Устройств бесконечно много, но правил обработки — три. Блоки, символы, пакеты. Внутри каждого потока ядро работает одинаково независимо от того, чья именно микросхема стоит в компьютере.</p>
      <p>Различие видно даже в именах файлов устройств: в Linux <code>ls -l /dev</code> помечает символьные буквой <code>c</code>, а блочные — буквой <code>b</code>.</p>
    </div>
    <div class="step-panel" data-on="seps types kb1 n2" data-focus="kb1">
      <div class="step-kicker">Шаг 2 · сигнал снизу</div>
      <h4>Клавиша порождает прерывание</h4>
      <p>Нажатие превращается в скан-код, который приходит на чипсет. Чипсет поднимает <strong>прерывание</strong> — сигнал, по которому процессор бросает текущую работу и переходит к обработчику.</p>
      <p>Заметьте направление: здесь не приложение просит, а устройство сообщает. Это второй способ попасть в ядро, помимо системного вызова.</p>
    </div>
    <div class="step-panel" data-on="seps types kb1 kb2 n3" data-focus="kb2">
      <div class="step-kicker">Шаг 3 · перевод</div>
      <h4>Драйвер превращает код в символ</h4>
      <p>Число, пришедшее от клавиатуры, само по себе ничего не значит: раскладки разные, устройства разные. Драйвер знает эту конкретную клавиатуру и отдаёт наверх уже осмысленный символ.</p>
      <p>Дальше он попадает в общий для всех символьных устройств путь, где события выстраиваются в очередь.</p>
    </div>
    <div class="step-panel" data-on="seps types kb1 kb2 kb3 n4" data-focus="kb3">
      <div class="step-kicker">Шаг 4 · доставка</div>
      <h4>Событие доходит до приложения</h4>
      <p>Ядро кладёт событие в очередь того окна, которое сейчас активно. Что с ним делать — решает уже сама программа: в редакторе появится буква, в игре сработает привязанное к клавише действие.</p>
    </div>
    <div class="step-panel" data-on="seps types kb1 kb2 kb3 net1 n5" data-focus="net1">
      <div class="step-kicker">Шаг 5 · то же самое, но из сети</div>
      <h4>Пакет приходит на сетевую карту</h4>
      <p>Начало один в один: данные попали в устройство, чипсет поднял прерывание, процессор ушёл в драйвер. Драйвер разбирает кадр и передаёт содержимое дальше.</p>
    </div>
    <div class="step-panel" data-on="seps types kb1 kb2 kb3 net1 net2 n6" data-focus="net2">
      <div class="step-kicker">Шаг 6 · до приложения</div>
      <h4>Данные ждут в буфере сокета</h4>
      <p>Сетевой путь складывает разобранные данные в буфер уже открытого соединения. Браузер заберёт их системным вызовом <code>recv()</code> или <code>read()</code>, когда дойдёт до этого в своём цикле.</p>
      <p>Если он попросит раньше, чем данные придут, — уйдёт в состояние «ожидает», и планировщик отдаст процессор другому. Все подсистемы снова встретились в одной точке.</p>
    </div>
    <div class="step-panel" data-on="seps types kb1 kb2 kb3 net1 net2 coal n7" data-focus="coal">
      <div class="step-kicker">Шаг 7 · разница в масштабе</div>
      <h4>Где механизм перестаёт работать</h4>
      <p>Очень быстрая печать — это десяток нажатий в секунду. Соединение на 1 Гбит/с кадрами по 1500 байт даёт 83 333 пакета в секунду, то есть в восемь тысяч раз больше событий.</p>
      <p>Даже если считать, что вход в обработчик стоит столько же, сколько системный вызов на этой машине — 116 нс, — получается 9,7 мс процессорного времени на каждую секунду. И это только вход, без обработки.</p>
    </div>
    <div class="step-panel" data-on="seps types kb1 kb2 kb3 net1 net2 coal n8" data-focus="coal types">
      <div class="step-kicker">Шаг 8 · как чинят</div>
      <h4>Прерывания объединяют</h4>
      <p>Один и тот же приём — прерывание на каждое событие — идеален для клавиатуры и разорителен для сети. Поэтому сетевые драйверы после первого прерывания временно его выключают и разбирают накопившиеся пакеты пачкой.</p>
      <p>Отсюда вывод, полезный далеко за пределами ядра: у механизма всегда есть диапазон нагрузки, в котором он хорош, и вне этого диапазона его меняют, а не чинят.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Откуда взялись 83 тысячи. Кадр Ethernet — 1500 байт, то есть 12 000 бит;
  гигабитный канал за секунду пропускает миллиард бит:
</p>

<div class="math-display" data-tex="\frac{10^{9}\ \text{бит/с}}{1500 \cdot 8\ \text{бит}} \;\approx\; 83\,333\ \text{кадра в секунду}"></div>

<div class="term" id="tm5" data-first="ls -l /dev/vda /dev/tty /dev/null /dev/zero">
  <div class="term-head">Консоль 5 · устройства и прерывания</div>
  <div class="term-screen" aria-live="polite"></div>
  <div class="term-line"><span class="term-ps">$</span><input class="term-in" type="text" spellcheck="false" autocomplete="off" aria-label="Ввод команды"></div>
  <div class="term-cmds">
    <button type="button" data-cmd="ls -l /dev/vda /dev/tty /dev/null /dev/zero">ls -l /dev/…</button>
    <button type="button" data-cmd="cat /proc/interrupts">cat /proc/interrupts</button>
    <button type="button" data-cmd="ls /sys/class/net">ls /sys/class/net</button>
    <button type="button" data-cmd="help">help</button>
  </div>
</div>
<p class="term-hint">Первая буква в правах — тип устройства: <code>b</code> у блочных, <code>c</code> у символьных. В Windows то же самое смотрят в диспетчере устройств, в macOS — в System Information.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> устройство не просит разрешения — оно
  дёргает процессор прерыванием. Драйвер переводит его сигнал на язык ядра, а
  ядро раскладывает всё на три одинаково устроенных потока: блоки, символы,
  пакеты.
</div>

---

## Часть 10. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Зачем нужна ОС:</strong> прикладной программе физически запрещено обращаться к железу. Операционная система — единственный посредник, и она же распределяет ресурсы между желающими.</li>
  <li><strong>Два режима процессора:</strong> кольцо 0 (Kernel Mode) может всё, кольцо 3 (User Mode) — почти ничего. Кольца 1 и 2 в массовых ОС не используются. Соответственно делится и адресное пространство: Kernel Space и User Space.</li>
  <li><strong>Системный вызов:</strong> единственные ворота. Номер операции кладут в регистр, аргументы — в следующие, выполняют инструкцию <code>syscall</code>. Процессор меняет кольцо и прыгает по заранее заданному адресу. Цена — около 116 нс против 2,8 нс у обычного вызова функции.</li>
  <li><strong>Пространство пользователя:</strong> приложение, оболочка и библиотеки одинаково бесправны. Оболочка запускает программы через <code>fork</code> и <code>exec</code>, библиотека лишь прячет рутину.</li>
  <li><strong>Планировщик процессов:</strong> хранит о каждом процессе блок контроля (состояние, PID, счётчик команд, регистры, память, приоритет, учёт), выдаёт кванты и переключает контекст. Измеренный квант — 3,87 мс, переключение — 1,22 мкс, накладные 0,03%.</li>
  <li><strong>Межпроцессное взаимодействие:</strong> сообщения (две копии и системные вызовы, синхронизация встроена) или разделяемая память (ноль копий, синхронизацию строите сами). Плата за второй способ — риск взаимной блокировки.</li>
  <li><strong>Файловая система:</strong> пять уровней от имени файла до пронумерованных блоков, с VFS посередине. Блок неделим, поэтому файл в 4200 байт занимает 8192.</li>
  <li><strong>Менеджер памяти:</strong> процесс делится на код, данные, кучу, свободную область и стек. Память виртуальная, нарезана страницами по 4 КиБ, выдаётся лениво: диапазон адресов мгновенно, физический кадр — при первом обращении.</li>
  <li><strong>Блок работы с устройствами:</strong> три потока (блочный, символьный, сетевой) и драйверы, переводящие команды ядра на язык железа. Второй вход в ядро, кроме системного вызова, — прерывание от устройства.</li>
  <li><strong>Общий принцип:</strong> у любого механизма ядра есть диапазон нагрузки, где он хорош. Квант в миллисекундах, блок в 4 КиБ, прерывание на событие — всё это компромиссы, а не законы природы.</li>
</ol>

<p>
  Если унести из статьи одну картину, пусть это будет вертикаль из первой сцены:
  человек, приложение, библиотека, ворота системного вызова, пять подсистем,
  драйвер, железо — и ответ, идущий обратно. Всё остальное — подробности того,
  что происходит на каждой ступеньке. В следующем параграфе исходного хендбука
  речь пойдёт о языках программирования, на которых написано всё, включая сами
  операционные системы.
</p>

<p class="tiny">
  О числах. Все замеры сделаны на одной машине: Linux 6.18.44, x86-64, одно ядро
  Intel Xeon 2,1 ГГц, 3,9 ГиБ памяти, файловая система ext4 с блоком 4096 байт.
  Времена вызовов и переключений получены циклами на 1–2 млн повторений на C,
  собранном с <code>-O2</code>; приведены медианы трёх запусков, разброс между
  запусками не превышал 5%. Квант планировщика вычислен как процессорное время,
  делённое на число вытеснений из <code>/proc/PID/status</code>. Числа округлены
  до трёх значащих цифр. Адреса в карте памяти — из одного конкретного прогона;
  при следующем запуске они будут другими, потому что ядро сдвигает области
  случайным образом. Вывод команд в консолях записан с той же машины дословно;
  вывод <code>/proc/PID/status</code> сокращён до обсуждаемых полей. Материал
  параграфа — раздел «Зачем нужна операционная система и как она работает» из
  хендбука Яндекса по введению в компьютерные науки; примеры, замеры и схемы
  добавлены к нему здесь.
</p>

<script>
(function () {
  'use strict';
  function initTerms() {
    document.querySelectorAll('.term').forEach(function (term) {
      if (term.dataset.ready === '1') return;
      var holder = document.getElementById('term-data');
      if (!holder) return;
      var data = JSON.parse(holder.textContent);
      var screen = term.querySelector('.term-screen');
      var input = term.querySelector('.term-in');
      if (!screen || !input) return;
      var known = Array.prototype.slice.call(term.querySelectorAll('.term-cmds button'))
        .map(function (b) { return b.getAttribute('data-cmd'); })
        .filter(function (c) { return c && c !== 'help'; });

      function put(cls, text) {
        var line = document.createElement('div');
        if (cls) line.className = cls;
        line.textContent = text;
        screen.appendChild(line);
        screen.scrollTop = screen.scrollHeight;
      }

      function run(raw) {
        var cmd = (raw || '').trim();
        if (!cmd) return;
        put('cmd', '$ ' + cmd);
        if (cmd === 'clear') { screen.textContent = ''; return; }
        if (cmd === 'help' || cmd === '?') {
          put('note', 'В этой лаборатории записан вывод таких команд:');
          known.forEach(function (c) { put('note', '  ' + c); });
          put('note', 'ещё есть clear — очистить экран');
          return;
        }
        if (Object.prototype.hasOwnProperty.call(data, cmd)) { put('', data[cmd]); return; }
        put('bad', 'bash: ' + cmd.split(' ')[0] + ': вывод этой команды здесь не записан');
        put('note', 'наберите help — покажу, что есть');
      }

      term.querySelectorAll('.term-cmds button').forEach(function (button) {
        button.addEventListener('click', function () { run(button.getAttribute('data-cmd')); });
      });
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') { run(input.value); input.value = ''; }
      });
      var first = term.getAttribute('data-first');
      if (first) run(first);
      term.dataset.ready = '1';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTerms);
  else initTerms();
})();
</script>
