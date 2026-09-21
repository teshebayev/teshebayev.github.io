


<p class="lead">
  Строчка <code>total += x</code> не исполняется. Исполняется поток машинных
  команд, в который её превращают компилятор Python, цикл интерпретатора и сам
  процессор, — и на каждом этаже она дорожает или дешевеет во вполне измеримое
  число раз.
</p>

<p>
  Это опорная статья для всей ветки про Python. Дальше мы будем говорить про
  списки, словари, функции и модули так, как будто это самостоятельные вещи, —
  а они не самостоятельные: каждая из них в конце концов превращается в
  обращения к памяти и в такты процессора. Здесь мы один раз проходим весь путь
  сверху донизу, чтобы потом не возвращаться.
</p>

<p>
  Отдельные этажи этого пути уже разобраны подробно: про железо — в статье
  <a href="article.html?slug=computer-architecture">«Из каких частей состоит современный
  компьютер»</a>, про операционную систему — в
  <a href="article.html?slug=operating-system">«Зачем нужна операционная система»</a>, про то,
  откуда вообще взялись компиляторы и интерпретаторы, — в
  <a href="article.html?slug=programming-languages">«Как появились языки
  программирования»</a>. Здесь мы их сшиваем в одну картину и всюду, где можно,
  подставляем измеренные числа.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Умение читать цикл на Python</strong>
    <p>Достаточно понимать <code>for</code>, присваивание и что такое функция.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Сложение десяти миллионов чисел</strong>
    <p>Один и тот же цикл прогнан на четырёх этажах — от Python до векторных команд.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Объяснить разницу в 69 раз</strong>
    <p>Почему итерация стоит 23,34 нс в Python и 0,337 нс в C — и куда уходит разница.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные и структура</span>
  <span><i style="background:#C29E08"></i>операция, такт, работа процессора</span>
  <span><i style="background:#73B222"></i>результат и выигрыш</span>
  <span><i style="background:#C30B0A"></i>потери, простой, ошибка</span>
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не
  на всю схему сразу, а только на яркую часть. Расположение блоков не меняется
  от шага к шагу — меняется только то, куда смотреть. Стрелки на клавиатуре
  работают, когда сцена в фокусе.
</div>

<div class="callout-yellow">
  <strong>Откуда числа:</strong> всё, что дальше названо измерением, измерено на
  одной машине — виртуалка с одним ядром Intel Xeon 2,1 ГГц, Linux 6.18,
  CPython 3.12.3, gcc 13.3.0, NumPy 2.4.4. Кэш: L1d 48 КиБ, L2 2 МиБ, линия
  64 байта. Один такт на этой машине — 0,476 нс. На вашей машине абсолютные
  числа будут другими, соотношения — примерно теми же.
</div>

## Часть 1. Что на самом деле исполняется

<p>
  Возьмём самую скучную программу, какую можно придумать: сложить десять
  миллионов чисел.
</p>

<pre><code>def total_of(data):
    total = 0
    for x in data:
        total += x
    return total</code></pre>

<p>
  Процессор не умеет читать этот текст. Он умеет читать байты и по ним понимать,
  что делать: сложить два регистра, положить число в память, перейти по адресу.
  Значит, между текстом и процессором обязательно кто-то стоит. В Python таких
  посредников <em>двое</em>, и это главное, что стоит понять про язык.
</p>

<p>
  Первый посредник — <strong>компилятор Python</strong>. Он работает не в момент
  запуска программы целиком, а перед исполнением каждого файла, и переводит
  текст не в машинные команды, а в <strong>байткод</strong>: свой собственный,
  придуманный авторами Python набор из 140 команд. Второй посредник —
  <strong>интерпретатор</strong>, он же цикл вычисления: обычная программа,
  написанная на C и заранее скомпилированная в машинный код, которая читает
  байткод по одной команде и делает то, что там написано. Разница между этими
  двумя ролями подробно разобрана в статье
  <a href="article.html?slug=programming-languages">«Как появились языки программирования»</a>;
  здесь нам важно только одно следствие — за каждую вашу строку платят дважды.
</p>

<p>
  Байткод можно увидеть глазами. Модуль <code>dis</code> печатает то, во что
  превратилась функция:
</p>

<pre><code>&gt;&gt;&gt; import dis; dis.dis(total_of)
  2           0 RESUME                   0
  3           2 LOAD_CONST               1 (0)
              4 STORE_FAST               1 (total)
  4           6 LOAD_FAST                0 (data)
              8 GET_ITER
        &gt;&gt;   10 FOR_ITER                 7 (to 28)
             14 STORE_FAST               2 (x)
  5          16 LOAD_FAST                1 (total)
             18 LOAD_FAST                2 (x)
             20 BINARY_OP               13 (+=)
             24 STORE_FAST               1 (total)
             26 JUMP_BACKWARD            9 (to 10)
  4     &gt;&gt;   28 END_FOR
  6          30 LOAD_FAST                1 (total)
             32 RETURN_VALUE</code></pre>

<p>
  Тело цикла — это строки с 10 по 26: семь опкодов, которые исполняются на
  каждой итерации. <code>FOR_ITER</code> берёт следующий элемент,
  <code>STORE_FAST</code> кладёт его в <code>x</code>, два
  <code>LOAD_FAST</code> достают <code>total</code> и <code>x</code>,
  <code>BINARY_OP</code> складывает, <code>STORE_FAST</code> записывает результат
  обратно, <code>JUMP_BACKWARD</code> возвращает нас в начало. Десять миллионов
  элементов — семьдесят миллионов опкодов.
</p>

<p>
  Теперь измерим тот же самый цикл на разных этажах. Ниже — время на одну
  итерацию (на один элемент), лучшее из пяти прогонов по десять миллионов
  элементов:
</p>

<table class="shape-table">
  <tr><th>Как написан цикл</th><th>нс на элемент</th><th>тактов</th><th>во сколько раз медленнее лучшего</th></tr>
  <tr><td>Python, цикл внутри функции</td><td>23,34</td><td>49,0</td><td>×69</td></tr>
  <tr><td>Python, тот же цикл на верхнем уровне модуля</td><td>60,98</td><td>128,1</td><td>×181</td></tr>
  <tr><td>Python, встроенная <code>sum(data)</code></td><td>6,01</td><td>12,6</td><td>×18</td></tr>
  <tr><td>C, <code>gcc -O0</code></td><td>2,576</td><td>5,4</td><td>×7,6</td></tr>
  <tr><td>C, <code>gcc -O2</code> без векторизации</td><td>1,131</td><td>2,4</td><td>×3,4</td></tr>
  <tr><td>NumPy, <code>a.sum()</code></td><td>0,42</td><td>0,9</td><td>×1,2</td></tr>
  <tr><td>C, <code>gcc -O3 -march=native</code> (векторные команды)</td><td>0,337</td><td>0,71</td><td>×1</td></tr>
</table>

<p>
  Разрыв между первой и последней строкой — 69 раз, и он не объясняется словами
  «Python медленный». Он раскладывается на несколько конкретных, по отдельности
  понятных причин, и вся остальная статья — это разбор каждой из них. Заодно
  обратите внимание на вторую строку: тот же цикл, перенесённый из функции на
  верхний уровень модуля, становится в 2,6 раза медленнее, потому что имена
  <code>total</code> и <code>x</code> ищутся в словаре модуля, а не берутся из
  пронумерованных ячеек функции.
</p>

<p>Посмотрим на все этажи сразу.</p>

<div class="stage" id="stageLevels" tabindex="0">
  <div class="stage-figure">
<svg id="lv" viewBox="0 0 960 650" role="img" aria-label="Пять уровней исполнения строки total += x: исходный текст, байткод, цикл интерпретатора, машинные команды, такты процессора">
  <style>
    #lv { font-family: Helvetica, Arial, sans-serif; }
    #lv .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #lv .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #lv .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #lv .bn  { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.3; }
    #lv .lbl { font-size: 17px; fill: #111111; }
    #lv .mono{ font-size: 13px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #lv .mono17 { font-size: 17px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #lv .op  { font-size: 12px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #lv .arg { font-size: 12px; fill: #5E5850; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #lv .cap { font-size: 13px; fill: #5E5850; }
    #lv .step{ font-size: 13px; fill: #244F81; font-weight: 700; }
    #lv .white { font-size: 12px; fill: #FFFFFF; font-weight: 700; }
    #lv .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <g data-key="src">
    <text x="20" y="56" class="step">1 · исходный</text>
    <text x="20" y="74" class="step">текст</text>
    <rect x="190" y="36" width="300" height="48" rx="8" class="bx"/>
    <text x="206" y="67" class="mono17">total += x</text>
    <text x="510" y="66" class="cap">одна строка вашего файла .py</text>
  </g>

  <g data-key="bc">
    <text x="20" y="140" class="step">2 · байткод</text>
    <text x="20" y="158" class="step">Python</text>
    <rect x="190" y="118" width="100" height="54" rx="6" class="by"/>
    <text x="240" y="140" class="op" text-anchor="middle">FOR_ITER</text>
    <text x="240" y="158" class="arg" text-anchor="middle">next()</text>
    <rect x="298" y="118" width="100" height="54" rx="6" class="by"/>
    <text x="348" y="140" class="op" text-anchor="middle">STORE_FAST</text>
    <text x="348" y="158" class="arg" text-anchor="middle">x</text>
    <rect x="406" y="118" width="100" height="54" rx="6" class="by"/>
    <text x="456" y="140" class="op" text-anchor="middle">LOAD_FAST</text>
    <text x="456" y="158" class="arg" text-anchor="middle">total</text>
    <rect x="514" y="118" width="100" height="54" rx="6" class="by"/>
    <text x="564" y="140" class="op" text-anchor="middle">LOAD_FAST</text>
    <text x="564" y="158" class="arg" text-anchor="middle">x</text>
    <rect x="622" y="118" width="100" height="54" rx="6" class="by"/>
    <text x="672" y="140" class="op" text-anchor="middle">BINARY_OP</text>
    <text x="672" y="158" class="arg" text-anchor="middle">+</text>
    <rect x="730" y="118" width="100" height="54" rx="6" class="by"/>
    <text x="780" y="140" class="op" text-anchor="middle">STORE_FAST</text>
    <text x="780" y="158" class="arg" text-anchor="middle">total</text>
    <rect x="838" y="118" width="100" height="54" rx="6" class="by"/>
    <text x="888" y="140" class="op" text-anchor="middle">JUMP_BACK</text>
    <text x="888" y="158" class="arg" text-anchor="middle">−12</text>
    <text x="190" y="192" class="cap">семь опкодов на одну итерацию · 18 байт байткода вместе со встроенными кэшами</text>
  </g>

  <g data-key="ev">
    <text x="20" y="234" class="step">3 · цикл</text>
    <text x="20" y="252" class="step">интерпретатора</text>
    <rect x="190" y="204" width="748" height="76" rx="8" class="bx"/>
    <text x="206" y="232" class="lbl">_PyEval_EvalFrameDefault — один switch на 140 опкодов</text>
    <text x="206" y="260" class="cap">56 311 байт машинного кода: программа, которая читает опкоды и делает написанное</text>
  </g>

  <g data-key="mc">
    <text x="20" y="352" class="step">4 · машинные</text>
    <text x="20" y="370" class="step">команды</text>
    <rect x="190" y="300" width="748" height="124" rx="8" class="by"/>
    <text x="206" y="326" class="mono">movzbl (%r10),%eax</text>
    <text x="470" y="326" class="cap">взять байт опкода</text>
    <text x="206" y="348" class="mono">movzbl 0x1(%r10),%r15d</text>
    <text x="470" y="348" class="cap">взять байт аргумента</text>
    <text x="206" y="370" class="mono">mov    %rax,%r13</text>
    <text x="470" y="370" class="cap">запомнить номер опкода</text>
    <text x="206" y="392" class="mono">mov    (%rdi,%rax,8),%rax</text>
    <text x="470" y="392" class="cap">найти адрес обработчика в таблице</text>
    <text x="206" y="414" class="mono">jmp    *%rax</text>
    <text x="470" y="414" class="cap">прыгнуть в обработчик</text>
    <text x="190" y="444" class="cap">это только диспетчеризация: пять команд, чтобы понять, какой опкод исполнять</text>
  </g>

  <g data-key="barp">
    <text x="20" y="480" class="step">5 · такты</text>
    <text x="20" y="498" class="step">процессора</text>
    <rect x="190" y="462" width="735" height="24" rx="4" fill="#3576C0"/>
    <text x="200" y="479" class="white">49 тактов — одна итерация цикла на Python</text>
  </g>

  <g data-key="barc">
    <rect x="190" y="498" width="36" height="24" rx="4" fill="#73B222"/>
    <text x="236" y="515" class="cap">2,4 такта — та же итерация, собранная компилятором C</text>
  </g>

  <g data-key="split">
    <rect x="190" y="546" width="12" height="12" fill="#3576C0"/>
    <text x="212" y="557" class="cap">13,3 такта — механика цикла: взять опкод, прыгнуть в обработчик, вернуться</text>
    <rect x="190" y="568" width="12" height="12" fill="#C29E08"/>
    <text x="212" y="579" class="cap">35,7 такта — четыре опкода сложения: проверка типов, сложение, новый объект, счётчики ссылок</text>
    <rect x="190" y="590" width="12" height="12" fill="#73B222"/>
    <text x="212" y="601" class="cap">2,4 такта — столько стоит вся эта итерация, если её собрал компилятор C</text>
  </g>

  <text x="20" y="636" class="legend">синий — данные и структура · жёлтый — работа процессора · зелёный — выигрыш</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="src" data-focus="src">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Строка текста — это ещё не программа</h4>
      <p>
        <code>total += x</code> существует только в файле. Ни один транзистор
        не знает, что такое «плюс равно»: в файле лежат байты кодировки UTF-8,
        и всё.
      </p>
    </div>
    <div class="step-panel" data-on="src bc" data-focus="bc">
      <div class="step-kicker">Шаг 2 · компиляция</div>
      <h4>Компилятор Python переводит строку в семь опкодов</h4>
      <p>
        Это происходит один раз, до запуска функции. Опкоды — не машинные
        команды: их придумали авторы Python, у них свои номера, и ни один
        процессор их не понимает. Тело цикла занимает 18 байт байткода.
      </p>
    </div>
    <div class="step-panel" data-on="src bc ev" data-focus="ev">
      <div class="step-kicker">Шаг 3 · кто исполняет опкоды</div>
      <h4>Их читает обычная программа на C</h4>
      <p>
        Функция <code>_PyEval_EvalFrameDefault</code> — это цикл: взять
        очередной опкод, найти его обработчик, выполнить, перейти к следующему.
        В библиотеке <code>libpython3.12.so</code> она занимает 56 311 байт
        машинного кода. Всё, что вы называете «Python исполняет мою программу», —
        это она.
      </p>
    </div>
    <div class="step-panel" data-on="src bc ev mc" data-focus="mc">
      <div class="step-kicker">Шаг 4 · что видит процессор</div>
      <h4>Ниже байткода начинается настоящий машинный код</h4>
      <p>
        Это реальный фрагмент из дизассемблированной
        <code>libpython3.12.so</code>: пять команд, которые не делают ничего
        полезного, а только выясняют, какой опкод сейчас исполнять, и прыгают в
        нужный кусок кода. Полезная работа — сложение — начнётся после
        <code>jmp</code>.
      </p>
    </div>
    <div class="step-panel" data-on="src bc ev mc barp" data-focus="barp">
      <div class="step-kicker">Шаг 5 · измеренная цена</div>
      <h4>49 тактов на одну итерацию</h4>
      <p>
        23,34 наносекунды на элемент при частоте 2,1 ГГц — это 49 тактов
        процессора. На семь опкодов, то есть по 7 тактов на опкод. За 49 тактов
        процессор успел бы сделать полсотни сложений.
      </p>
    </div>
    <div class="step-panel" data-on="src bc ev mc barp barc" data-focus="barc">
      <div class="step-kicker">Шаг 6 · та же работа без посредников</div>
      <h4>2,4 такта, если убрать оба этажа</h4>
      <p>
        Тот же цикл на C, собранный <code>gcc -O2</code>, — 1,131 нс на элемент.
        Компилятор превратил тело цикла в четыре машинные команды, и байткода
        между программой и процессором просто нет.
      </p>
    </div>
    <div class="step-panel" data-on="src bc ev mc barp barc split" data-focus="split">
      <div class="step-kicker">Шаг 7 · куда ушли такты</div>
      <h4>Разница измерима по частям</h4>
      <p>
        Пустой цикл <code>for x in data: pass</code> — это три опкода из семи —
        стоит 6,32 нс, то есть 13,3 такта. Добавление четырёх опкодов сложения
        добавляет 17,02 нс, то есть 35,7 такта. Именно там живут проверка типов,
        создание нового целого числа и работа со счётчиками ссылок — то, чего в
        версии на C нет вовсе.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> Python не «медленный язык» — он язык, у
  которого между вашей строкой и процессором стоят два переводчика. Всё
  остальное в статье — про то, что происходит ниже второго из них, и это
  одинаково для Python, C и любого другого языка.
</div>

---

## Часть 2. Цикл процессора: выборка, декодирование, исполнение, запись

<p>
  Спустимся на этаж, где Python уже кончился. Возьмём тот же цикл, написанный на
  C, и посмотрим, во что его превратил компилятор. Это удобно тем, что здесь нет
  никаких посредников: то, что напечатал <code>objdump</code>, процессор и
  исполняет байт в байт.
</p>

<pre><code>1300:  48 03 07        add    (%rdi),%rax    ; total += *p
1303:  48 83 c7 08     add    $0x8,%rdi      ; p++
1307:  48 39 d7        cmp    %rdx,%rdi      ; дошли до конца?
130a:  75 f4           jne    1300           ; если нет — назад на 12 байт</code></pre>

<p>
  Четыре команды, двенадцать байт. Слева — адрес в памяти, дальше — сами байты,
  дальше — их человекочитаемая запись. Всё тело цикла помещается в одну
  <strong>кэш-линию</strong> — тот кусок в 64 байта, которым память отдаёт
  данные (о нём подробно в части 5).
</p>

<p>
  Чтобы исполнить любую из этих команд, процессору нужны три вещи.
  <strong>Регистры</strong> — несколько десятков именованных ячеек прямо внутри
  ядра, самая быстрая память в машине: <code>RAX</code> здесь держит
  накопитель <code>total</code>, <code>RDI</code> — адрес текущего элемента,
  <code>RDX</code> — адрес конца массива. Отдельный регистр
  <code>RIP</code> — <strong>счётчик команд</strong> — хранит адрес той команды,
  которую надо исполнить следующей. <strong>АЛУ</strong>,
  арифметико-логическое устройство, умеет складывать, сравнивать, сдвигать. И
  <strong>декодер</strong>, который по байтам команды понимает, что именно
  делать.
</p>

<div class="callout-blue">
  <strong>Почему <code>75 f4</code> — это «назад на 12 байт»:</strong> байт
  <code>f4</code> читается как знаковое число, то есть −12. Переход считается не
  от начала команды, а от её конца: <code>0x130c − 12 = 0x1300</code>. Ровно то
  же самое делает <code>JUMP_BACKWARD −12</code> в байткоде Python — только там
  «байты» это опкоды, а адрес хранится не в <code>RIP</code>, а в поле кадра.
</div>

<p>
  Дальше начинается цикл, который процессор крутит с момента включения питания и
  до выключения: взять команду по адресу из <code>RIP</code>, разобрать её,
  выполнить, записать результат, сдвинуть <code>RIP</code>. Разберём один оборот
  на команде <code>add (%rdi),%rax</code>.
</p>

<div class="stage" id="stageDatapath" tabindex="0">
  <div class="stage-figure">
<svg id="dp" viewBox="0 0 960 580" role="img" aria-label="Тракт данных процессора: регистры, декодер, АЛУ, кэш, шина и оперативная память с кодом и данными">
  <style>
    #dp { font-family: Helvetica, Arial, sans-serif; }
    #dp .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #dp .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #dp .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #dp .bn  { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.3; }
    #dp .frame { fill: none; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 7 5; }
    #dp .lbl { font-size: 17px; fill: #111111; }
    #dp .mono{ font-size: 13px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #dp .mono12 { font-size: 12px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #dp .cap { font-size: 13px; fill: #5E5850; }
    #dp .cap12 { font-size: 12px; fill: #5E5850; }
    #dp .edge{ stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #dp .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="dp-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="regs">
    <rect x="20" y="58" width="560" height="440" rx="10" class="frame"/>
    <text x="26" y="48" class="lbl">Процессор</text>
    <rect x="38" y="88" width="240" height="270" rx="8" class="bx"/>
    <text x="158" y="114" class="lbl" text-anchor="middle">Регистры</text>
    <rect x="50" y="126" width="216" height="32" rx="5" class="bn"/>
    <text x="60" y="147" class="mono">RIP = 0x1300</text>
    <rect x="50" y="166" width="216" height="32" rx="5" class="bn"/>
    <text x="60" y="187" class="mono">RAX = 0        total</text>
    <rect x="50" y="206" width="216" height="32" rx="5" class="bn"/>
    <text x="60" y="227" class="mono">RDI = 0x…40    &amp;d[i]</text>
    <rect x="50" y="246" width="216" height="32" rx="5" class="bn"/>
    <text x="60" y="267" class="mono">RDX = 0x…      конец</text>
    <rect x="50" y="286" width="216" height="32" rx="5" class="bn"/>
    <text x="60" y="307" class="mono">FLAGS</text>
    <text x="38" y="342" class="cap12">самая быстрая память в машине: доступ за доли такта</text>
  </g>

  <g data-key="dec">
    <rect x="308" y="88" width="252" height="100" rx="8" class="by"/>
    <text x="434" y="126" class="lbl" text-anchor="middle">Декодер</text>
    <text x="434" y="152" class="cap" text-anchor="middle">что за команда и над чем</text>
  </g>

  <g data-key="alu">
    <rect x="308" y="218" width="252" height="100" rx="8" class="by"/>
    <text x="434" y="256" class="lbl" text-anchor="middle">АЛУ</text>
    <text x="434" y="282" class="cap" text-anchor="middle">сложение, сравнение, сдвиг</text>
  </g>

  <g data-key="cache">
    <rect x="38" y="390" width="522" height="70" rx="8" class="bx"/>
    <text x="299" y="418" class="lbl" text-anchor="middle">Кэш L1 и интерфейс шины</text>
    <text x="299" y="442" class="cap" text-anchor="middle">ближайшая к ядру копия кусочков памяти</text>
  </g>

  <g data-key="busA">
    <line x1="582" y1="150" x2="636" y2="150" class="edge" marker-end="url(#dp-arw)"/>
    <text x="609" y="140" class="cap12" text-anchor="middle">адрес</text>
  </g>

  <g data-key="busD">
    <line x1="636" y1="300" x2="582" y2="300" class="edge" marker-end="url(#dp-arw)"/>
    <text x="609" y="290" class="cap12" text-anchor="middle">данные</text>
  </g>

  <g data-key="memcode">
    <rect x="640" y="58" width="300" height="440" rx="10" class="bx"/>
    <text x="790" y="48" class="lbl" text-anchor="middle">Оперативная память</text>
    <rect x="652" y="88" width="276" height="148" rx="6" class="bn"/>
    <text x="658" y="110" class="cap12">код: тело цикла, 12 байт</text>
    <text x="658" y="134" class="mono12">0x1300  48 03 07     add (%rdi),%rax</text>
    <text x="658" y="162" class="mono12">0x1303  48 83 c7 08  add $0x8,%rdi</text>
    <text x="658" y="190" class="mono12">0x1307  48 39 d7     cmp %rdx,%rdi</text>
    <text x="658" y="218" class="mono12">0x130a  75 f4        jne 0x1300</text>
  </g>

  <g data-key="memdata">
    <rect x="652" y="266" width="276" height="140" rx="6" class="bn"/>
    <text x="658" y="288" class="cap12">данные: массив из 10 000 000 чисел</text>
    <rect x="664" y="302" width="80" height="40" rx="5" class="bg"/>
    <text x="704" y="328" class="mono" text-anchor="middle">7</text>
    <rect x="752" y="302" width="80" height="40" rx="5" class="bn"/>
    <text x="792" y="328" class="mono" text-anchor="middle">9</text>
    <rect x="840" y="302" width="80" height="40" rx="5" class="bn"/>
    <text x="880" y="328" class="mono" text-anchor="middle">11</text>
    <text x="704" y="360" class="cap12" text-anchor="middle">0x…40</text>
    <text x="792" y="360" class="cap12" text-anchor="middle">0x…48</text>
    <text x="880" y="360" class="cap12" text-anchor="middle">0x…50</text>
    <text x="658" y="388" class="cap12">каждое число — 8 байт, все лежат подряд</text>
  </g>

  <g data-key="note" data-only="1">
    <text x="20" y="530" class="cap">один оборот цикла — четыре команды, двенадцать байт кода, 2,4 такта на элемент</text>
  </g>

  <text x="20" y="562" class="legend">синий — память и данные · жёлтый — работа процессора · зелёный — то, что сейчас читается</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="regs memcode memdata" data-focus="regs">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Три регистра и два куска памяти</h4>
      <p>
        В <code>RAX</code> копится сумма, в <code>RDI</code> лежит адрес
        текущего элемента, в <code>RDX</code> — адрес, на котором надо
        остановиться. В памяти два интересующих нас участка: двенадцать байт
        кода и восемьдесят мегабайт данных. Код и данные лежат в одной и той же
        памяти — это и есть архитектура фон Неймана.
      </p>
    </div>
    <div class="step-panel" data-on="regs memcode memdata cache busA" data-focus="memcode">
      <div class="step-kicker">Шаг 2 · выборка</div>
      <h4>Процессор берёт команду по адресу из RIP</h4>
      <p>
        <code>RIP</code> равен <code>0x1300</code>. Этот адрес уходит на шину,
        обратно приходят байты <code>48 03 07</code>. На практике они почти
        всегда уже лежат в кэше команд: тело цикла — двенадцать байт, они
        подтягиваются один раз и потом миллион итераций живут внутри ядра.
      </p>
    </div>
    <div class="step-panel" data-on="regs memcode memdata cache busA dec" data-focus="dec">
      <div class="step-kicker">Шаг 3 · декодирование</div>
      <h4>Байты превращаются в намерение</h4>
      <p>
        Декодер разбирает <code>48 03 07</code> на части: префикс
        <code>48</code> говорит, что работаем с 64-битными числами,
        <code>03</code> — что это сложение с записью в регистр,
        <code>07</code> — что первый операнд <code>RAX</code>, а второй лежит
        <em>в памяти</em> по адресу из <code>RDI</code>.
      </p>
    </div>
    <div class="step-panel" data-on="regs memcode memdata cache busA dec busD" data-focus="memdata">
      <div class="step-kicker">Шаг 4 · операнд</div>
      <h4>За вторым слагаемым нужно идти в память</h4>
      <p>
        Одна команда — и уже два обращения к памяти: за самой командой и за
        данными. Число по адресу <code>0x…40</code> едет по шине в ядро. Это
        самая дорогая часть шага, и именно ради неё существует кэш: если
        соседние числа уже подтянуты, обращение стоит несколько тактов, а не
        несколько сотен.
      </p>
    </div>
    <div class="step-panel" data-on="regs memcode memdata cache busA dec busD alu" data-focus="alu">
      <div class="step-kicker">Шаг 5 · исполнение</div>
      <h4>АЛУ складывает</h4>
      <p>
        Собственно арифметика — самая дешёвая часть всего оборота. Сложение двух
        64-битных чисел занимает у АЛУ один такт, а при удачном стечении
        обстоятельств процессор успевает сделать за такт несколько таких
        сложений сразу (об этом часть 4).
      </p>
    </div>
    <div class="step-panel" data-on="regs memcode memdata cache busA dec busD alu" data-focus="regs">
      <div class="step-kicker">Шаг 6 · запись</div>
      <h4>Результат возвращается в регистр, RIP сдвигается</h4>
      <p>
        В <code>RAX</code> теперь 7. <code>RIP</code> увеличивается на длину
        команды — на три байта — и становится <code>0x1303</code>. Никто
        специально не «переходил к следующей строчке»: следующая команда — это
        просто следующие байты.
      </p>
    </div>
    <div class="step-panel" data-on="regs memcode memdata cache busA dec busD alu note" data-focus="memcode">
      <div class="step-kicker">Шаг 7 · круг замыкается</div>
      <h4>Ещё три команды — и всё сначала</h4>
      <p>
        <code>add $0x8,%rdi</code> двигает указатель на следующее число,
        <code>cmp</code> сравнивает его с концом массива и выставляет флаги,
        <code>jne</code> смотрит на флаги и возвращает <code>RIP</code> на
        <code>0x1300</code>. Весь цикл — эти четыре команды, повторённые десять
        миллионов раз.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> процессор не исполняет «программу» — он
  бесконечно повторяет один и тот же оборот «взять команду по адресу из
  счётчика, разобрать, выполнить, сдвинуть счётчик». Всё остальное, включая
  Python, надстроено над этим оборотом.
</div>

---

## Часть 3. Конвейер и цена неправильной догадки

<p>
  В части 2 мы прошли один оборот целиком: выборка, декодирование, исполнение,
  запись. Если делать так честно, одна команда занимает четыре такта, и
  процессор с частотой 2,1 ГГц выполнял бы 525 миллионов команд в секунду. На
  деле он выполняет в разы больше — потому что четыре ступени работают
  одновременно над разными командами.
</p>

<p>
  Это <strong>конвейер</strong>, и он устроен ровно как конвейер на заводе. Пока
  первая команда исполняется в АЛУ, вторая уже декодируется, а третья
  выбирается из памяти. Ни одна команда не стала быстрее — но <em>результаты</em>
  начинают выходить каждый такт, а не каждый четвёртый.
</p>

<div class="callout-blue">
  <strong>Зачем ступеней делают много.</strong> Такт не может быть короче самой
  долгой ступени. Разрежьте работу на пятнадцать коротких ступеней вместо
  четырёх длинных — и можно поднять частоту. Именно так процессоры и добрались
  до гигагерц. Плата за это выясняется через два абзаца.
</div>

<div class="stage" id="stagePipe" tabindex="0">
  <div class="stage-figure">
<svg id="pl" viewBox="0 0 960 620" role="img" aria-label="Четырёхступенчатый конвейер: четыре команды цикла проходят ступени выборки, декодирования, исполнения и записи со сдвигом в один такт">
  <style>
    #pl { font-family: Helvetica, Arial, sans-serif; }
    #pl .cb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.4; }
    #pl .cy  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.4; }
    #pl .cg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.4; }
    #pl .mono{ font-size: 12px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #pl .cell{ font-size: 13px; fill: #111111; }
    #pl .hdr { font-size: 12px; fill: #5E5850; }
    #pl .cap { font-size: 13px; fill: #5E5850; }
    #pl .white { font-size: 12px; fill: #FFFFFF; font-weight: 700; }
    #pl .rdash { fill: none; stroke: #C30B0A; stroke-width: 1.6; stroke-dasharray: 6 4; }
    #pl .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <g data-key="p1">
    <text x="20" y="100" class="hdr">такты →</text>
    <text x="234" y="100" class="hdr" text-anchor="middle">1</text>
    <text x="326" y="100" class="hdr" text-anchor="middle">2</text>
    <text x="418" y="100" class="hdr" text-anchor="middle">3</text>
    <text x="510" y="100" class="hdr" text-anchor="middle">4</text>
    <text x="602" y="100" class="hdr" text-anchor="middle">5</text>
    <text x="694" y="100" class="hdr" text-anchor="middle">6</text>
    <text x="786" y="100" class="hdr" text-anchor="middle">7</text>
    <text x="878" y="100" class="hdr" text-anchor="middle">8</text>
    <text x="20" y="143" class="mono">add (%rdi),%rax</text>
    <rect x="190" y="116" width="88" height="44" rx="5" class="cb"/>
    <text x="234" y="143" class="cell" text-anchor="middle">Выборка</text>
    <rect x="282" y="116" width="88" height="44" rx="5" class="cy"/>
    <text x="326" y="143" class="cell" text-anchor="middle">Декод.</text>
    <rect x="374" y="116" width="88" height="44" rx="5" class="cy"/>
    <text x="418" y="143" class="cell" text-anchor="middle">Исполн.</text>
    <rect x="466" y="116" width="88" height="44" rx="5" class="cg"/>
    <text x="510" y="143" class="cell" text-anchor="middle">Запись</text>
  </g>

  <g data-key="p2">
    <text x="20" y="203" class="mono">add $0x8,%rdi</text>
    <rect x="282" y="176" width="88" height="44" rx="5" class="cb"/>
    <text x="326" y="203" class="cell" text-anchor="middle">Выборка</text>
    <rect x="374" y="176" width="88" height="44" rx="5" class="cy"/>
    <text x="418" y="203" class="cell" text-anchor="middle">Декод.</text>
    <rect x="466" y="176" width="88" height="44" rx="5" class="cy"/>
    <text x="510" y="203" class="cell" text-anchor="middle">Исполн.</text>
    <rect x="558" y="176" width="88" height="44" rx="5" class="cg"/>
    <text x="602" y="203" class="cell" text-anchor="middle">Запись</text>
  </g>

  <g data-key="p3">
    <text x="20" y="263" class="mono">cmp %rdx,%rdi</text>
    <rect x="374" y="236" width="88" height="44" rx="5" class="cb"/>
    <text x="418" y="263" class="cell" text-anchor="middle">Выборка</text>
    <rect x="466" y="236" width="88" height="44" rx="5" class="cy"/>
    <text x="510" y="263" class="cell" text-anchor="middle">Декод.</text>
    <rect x="558" y="236" width="88" height="44" rx="5" class="cy"/>
    <text x="602" y="263" class="cell" text-anchor="middle">Исполн.</text>
    <rect x="650" y="236" width="88" height="44" rx="5" class="cg"/>
    <text x="694" y="263" class="cell" text-anchor="middle">Запись</text>
  </g>

  <g data-key="p4">
    <text x="20" y="323" class="mono">jne 0x1300</text>
    <rect x="466" y="296" width="88" height="44" rx="5" class="cb"/>
    <text x="510" y="323" class="cell" text-anchor="middle">Выборка</text>
    <rect x="558" y="296" width="88" height="44" rx="5" class="cy"/>
    <text x="602" y="323" class="cell" text-anchor="middle">Декод.</text>
    <rect x="650" y="296" width="88" height="44" rx="5" class="cy"/>
    <text x="694" y="323" class="cell" text-anchor="middle">Исполн.</text>
    <rect x="742" y="296" width="88" height="44" rx="5" class="cg"/>
    <text x="786" y="323" class="cell" text-anchor="middle">Запись</text>
  </g>

  <g data-key="thr">
    <text x="20" y="372" class="cap">первый результат готов на 4-м такте, дальше — по результату каждый такт</text>
    <text x="20" y="394" class="cap">без конвейера эти четыре команды заняли бы 16 тактов, с конвейером — 7</text>
  </g>

  <g data-key="deep">
    <text x="20" y="422" class="cap">в реальном x86 ступеней не четыре, а 15–20: короткие ступени позволяют поднять частоту</text>
  </g>

  <g data-key="br" data-only="1">
    <rect x="460" y="290" width="376" height="56" rx="7" class="rdash"/>
    <text x="20" y="450" class="cap">последняя команда — переход: пока она не исполнена, неизвестно, откуда брать следующую</text>
  </g>

  <g data-key="flush" data-only="1">
    <rect x="20" y="468" width="360" height="26" rx="4" fill="#C30B0A"/>
    <text x="30" y="486" class="white">≈17 тактов выброшено при неверном предсказании</text>
  </g>

  <g data-key="nums">
    <text x="20" y="524" class="cap">отсортированные данные: 1,20 такта на элемент — предсказатель почти не ошибается</text>
    <text x="20" y="546" class="cap">случайные данные: 9,84 такта на элемент — примерно половина переходов угадана неверно</text>
    <text x="20" y="568" class="cap">отсюда штраф на один промах: (9,84 − 1,20) ÷ 0,5 ≈ 17 тактов</text>
  </g>

  <text x="20" y="600" class="legend">синий — выборка · жёлтый — декодирование и исполнение · зелёный — запись результата · красный — потери</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="p1" data-focus="p1">
      <div class="step-kicker">Шаг 1 · одна команда</div>
      <h4>Четыре ступени, четыре такта</h4>
      <p>
        Так выглядит честное исполнение <code>add (%rdi),%rax</code>: четыре
        такта от момента, когда команду взяли из памяти, до момента, когда
        результат лёг в регистр. Три четверти времени каждая ступень простаивает.
      </p>
    </div>
    <div class="step-panel" data-on="p1 p2" data-focus="p2">
      <div class="step-kicker">Шаг 2 · перекрытие</div>
      <h4>Вторая команда заходит на такт позже</h4>
      <p>
        Как только первая команда ушла с ступени выборки, ступень свободна — и
        на неё можно завести следующую. Никто не ждёт, пока первая команда
        доедет до конца.
      </p>
    </div>
    <div class="step-panel" data-on="p1 p2 p3 p4" data-focus="p3 p4">
      <div class="step-kicker">Шаг 3 · конвейер заполнен</div>
      <h4>На четвёртом такте работают все ступени сразу</h4>
      <p>
        Четвёртый такт: первая команда пишет результат, вторая исполняется,
        третья декодируется, четвёртая выбирается. Процессор одновременно держит
        в работе четыре команды.
      </p>
    </div>
    <div class="step-panel" data-on="p1 p2 p3 p4 thr" data-focus="thr">
      <div class="step-kicker">Шаг 4 · что это дало</div>
      <h4>Семь тактов вместо шестнадцати</h4>
      <p>
        Задержка одной команды осталась прежней — четыре такта. Изменилась
        <em>пропускная способность</em>: после заполнения конвейера процессор
        завершает по команде каждый такт. Наш цикл на C идёт со скоростью
        2,4 такта на четыре команды — то есть больше одной команды за такт, но
        об этом в следующей части.
      </p>
    </div>
    <div class="step-panel" data-on="p1 p2 p3 p4 thr deep" data-focus="deep">
      <div class="step-kicker">Шаг 5 · глубина</div>
      <h4>Ступеней на самом деле 15–20</h4>
      <p>
        Четыре ступени — учебная схема. В настоящем x86 их полтора-два десятка,
        и в работе одновременно находятся сотни команд. Чем глубже конвейер, тем
        выше может быть частота — и тем дороже обходится ошибка.
      </p>
    </div>
    <div class="step-panel" data-on="p1 p2 p3 p4 thr deep br" data-focus="br">
      <div class="step-kicker">Шаг 6 · где ломается</div>
      <h4>Переход не знает, куда идти</h4>
      <p>
        Чтобы выбрать команду, нужен её адрес. А адрес после <code>jne</code>
        зависит от результата сравнения, который будет готов только на ступени
        исполнения. Ждать нельзя — конвейер опустеет. Поэтому процессор
        <strong>угадывает</strong>: он помнит, чем этот переход кончался раньше,
        и заранее тянет команды с угаданного адреса.
      </p>
    </div>
    <div class="step-panel" data-on="p1 p2 p3 p4 thr deep br flush nums" data-focus="nums">
      <div class="step-kicker">Шаг 7 · цена ошибки</div>
      <h4>Промах стоит примерно 17 тактов</h4>
      <p>
        Если угадали неверно, всё, что успело зайти в конвейер, выбрасывается.
        Измерение: цикл с условием <code>if a[i] &gt;= 128</code> по одному и
        тому же массиву идёт 1,20 такта на элемент, если массив отсортирован, и
        9,84 такта, если перемешан. Данные, работа, кэш — одинаковые. Разница
        только в предсказуемости перехода.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>
  Из этих двух чисел можно достать и саму цену промаха. В отсортированном
  массиве переход угадывается почти всегда, в перемешанном ошибается примерно на
  половине элементов, и лишнее время целиком уходит на эти промахи:
</p>

<div class="math-display" data-tex="\text{штраф} \approx \frac{9{,}84 - 1{,}20}{0{,}5} \approx 17\ \text{тактов}"></div>

<p>
  Семнадцать тактов — это примерно глубина конвейера: столько команд успевает
  зайти в него до того, как выяснится, что зашли они зря.
</p>

<p>
  Восьмикратная разница из-за одного <code>if</code> — это не экзотика, а
  повседневность. И здесь же прячется одна из причин, почему интерпретатор
  дорогой. Вспомните пять команд из части 1: цикл интерпретатора заканчивается
  командой <code>jmp *%rax</code> — переходом по адресу, вычисленному в регистре.
  Куда он прыгнет, зависит от того, какой опкод встретился следующим, а опкоды
  в вашей программе идут в произвольном порядке. Такой переход предсказывается
  плохо по построению — и так происходит семьдесят миллионов раз за наш цикл.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> процессор быстр не потому, что успевает
  сделать команду за такт, а потому, что держит в работе десятки команд сразу —
  и ровно поэтому он так болезненно реагирует на непредсказуемые переходы.
</div>

---

## Часть 4. Больше одной команды за такт

<p>
  В части 3 мы посчитали, что конвейер даёт одну команду за такт. Наш цикл на C
  идёт быстрее: четыре команды за 2,4 такта, то есть 1,7 команды за такт. Значит,
  ступеней исполнения больше одной.
</p>

<p>
  Современное ядро <strong>суперскалярно</strong>: у него несколько
  исполнительных устройств, и каждое умеет своё. Два-три сумматора, отдельное
  устройство умножения, отдельное — деления, несколько портов чтения и записи
  памяти. Если в очереди подряд идут команды, которым нужны разные устройства и
  которые не зависят друг от друга по данным, они уходят на исполнение
  одновременно.
</p>

<p>
  Слово «не зависят» здесь ключевое. Проверим его прямым измерением. Один и тот
  же массив из миллиона чисел, одно и то же количество сложений, разница только
  в том, во сколько накопителей складываем:
</p>

<pre><code>// одна цепочка: каждое сложение ждёт предыдущего
for (i = 0; i &lt; n; i++) s += a[i];                → 1,41 такта на элемент

// четыре независимых цепочки
for (i = 0; i &lt; n; i += 4) {
    s0 += a[i];   s1 += a[i+1];
    s2 += a[i+2]; s3 += a[i+3];
}                                                  → 0,67 такта на элемент</code></pre>

<p>
  Работы столько же, времени вдвое меньше. В первом случае процессор физически
  не может начать следующее сложение, пока не готово предыдущее: у них общий
  накопитель. Во втором — четыре независимые цепочки, и сумматоры работают
  параллельно.
</p>

<p>
  Второе следствие суперскалярности — <strong>внеочередное исполнение</strong>.
  Команды стоят по-разному: сложение целых на этой машине идёт 1,48 такта,
  умножение 1,50, а целочисленное деление — 7,46. Если бы процессор соблюдал
  порядок, деление останавливало бы всё. Вместо этого он берёт из окна
  ожидающих команд те, чьи операнды уже готовы, и запускает их, пока деление
  считается. Порядок <em>результатов</em> при этом сохраняется — программа не
  замечает подмены.
</p>

<div class="stage" id="stageOoO" tabindex="0">
  <div class="stage-figure">
<svg id="oo" viewBox="0 0 960 616" role="img" aria-label="Окно команд, несколько исполнительных портов, независимые цепочки сложений и векторная команда, складывающая четыре пары чисел">
  <style>
    #oo { font-family: Helvetica, Arial, sans-serif; }
    #oo .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #oo .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #oo .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #oo .bn  { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.3; }
    #oo .lbl { font-size: 17px; fill: #111111; }
    #oo .cell{ font-size: 14px; fill: #111111; }
    #oo .mono{ font-size: 12px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #oo .cap { font-size: 13px; fill: #5E5850; }
    #oo .cap12 { font-size: 12px; fill: #5E5850; }
    #oo .big { font-size: 20px; fill: #111111; }
    #oo .edge{ stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #oo .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="oo-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="queue">
    <rect x="20" y="90" width="230" height="280" rx="8" class="bx"/>
    <text x="135" y="118" class="lbl" text-anchor="middle">Окно команд</text>
    <text x="32" y="148" class="mono">load  a[i]   → r1</text>
    <text x="32" y="174" class="mono">add   r1     → s0</text>
    <text x="32" y="200" class="mono">load  a[i+1] → r2</text>
    <text x="32" y="226" class="mono">add   r2     → s1</text>
    <text x="32" y="252" class="mono">div   r3, r4</text>
    <text x="32" y="278" class="mono">load  a[i+2] → r5</text>
    <text x="32" y="304" class="mono">add   r5     → s2</text>
    <text x="20" y="392" class="cap12">ядро смотрит вперёд на сотни команд сразу</text>
  </g>

  <g data-key="ports">
    <rect x="300" y="100" width="230" height="54" rx="6" class="by"/>
    <text x="415" y="132" class="cell" text-anchor="middle">Сумматор 1</text>
    <rect x="300" y="168" width="230" height="54" rx="6" class="by"/>
    <text x="415" y="200" class="cell" text-anchor="middle">Сумматор 2</text>
    <rect x="300" y="236" width="230" height="54" rx="6" class="by"/>
    <text x="415" y="268" class="cell" text-anchor="middle">Чтение памяти</text>
    <rect x="300" y="304" width="230" height="54" rx="6" class="by"/>
    <text x="415" y="336" class="cell" text-anchor="middle">Делитель</text>
    <line x1="252" y1="230" x2="296" y2="230" class="edge" marker-end="url(#oo-arw)"/>
  </g>

  <g data-key="ilp">
    <text x="570" y="120" class="cap">одна зависимая цепочка: 1,41 такта на элемент</text>
    <rect x="570" y="128" width="254" height="22" rx="4" fill="#C30B0A"/>
    <text x="570" y="180" class="cap">четыре независимых цепочки: 0,67 такта</text>
    <rect x="570" y="188" width="121" height="22" rx="4" fill="#73B222"/>
  </g>

  <g data-key="slow">
    <text x="570" y="252" class="cap">сложение целых — 1,48 такта</text>
    <text x="570" y="274" class="cap">умножение целых — 1,50 такта</text>
    <text x="570" y="296" class="cap">деление целых — 7,46 такта</text>
    <text x="570" y="318" class="cap">квадратный корень — 5,99 такта</text>
    <text x="570" y="346" class="cap12">медленная команда не тормозит остальные</text>
  </g>

  <g data-key="simd">
    <rect x="20" y="420" width="920" height="112" rx="8" class="by"/>
    <text x="30" y="458" class="big">A</text>
    <rect x="60" y="436" width="90" height="28" rx="4" class="bn"/>
    <text x="105" y="456" class="mono" text-anchor="middle">2</text>
    <rect x="158" y="436" width="90" height="28" rx="4" class="bn"/>
    <text x="203" y="456" class="mono" text-anchor="middle">4</text>
    <rect x="256" y="436" width="90" height="28" rx="4" class="bn"/>
    <text x="301" y="456" class="mono" text-anchor="middle">6</text>
    <rect x="354" y="436" width="90" height="28" rx="4" class="bn"/>
    <text x="399" y="456" class="mono" text-anchor="middle">8</text>
    <text x="30" y="494" class="big">B</text>
    <rect x="60" y="472" width="90" height="28" rx="4" class="bn"/>
    <text x="105" y="492" class="mono" text-anchor="middle">1</text>
    <rect x="158" y="472" width="90" height="28" rx="4" class="bn"/>
    <text x="203" y="492" class="mono" text-anchor="middle">3</text>
    <rect x="256" y="472" width="90" height="28" rx="4" class="bn"/>
    <text x="301" y="492" class="mono" text-anchor="middle">5</text>
    <rect x="354" y="472" width="90" height="28" rx="4" class="bn"/>
    <text x="399" y="492" class="mono" text-anchor="middle">7</text>
    <text x="466" y="478" class="big" text-anchor="middle">=</text>
    <rect x="500" y="454" width="100" height="28" rx="4" class="bg"/>
    <text x="550" y="474" class="mono" text-anchor="middle">3</text>
    <rect x="608" y="454" width="100" height="28" rx="4" class="bg"/>
    <text x="658" y="474" class="mono" text-anchor="middle">7</text>
    <rect x="716" y="454" width="100" height="28" rx="4" class="bg"/>
    <text x="766" y="474" class="mono" text-anchor="middle">11</text>
    <rect x="824" y="454" width="100" height="28" rx="4" class="bg"/>
    <text x="874" y="474" class="mono" text-anchor="middle">15</text>
    <text x="60" y="520" class="cap12">vpaddq (%rax),%ymm0,%ymm0 — одна команда складывает четыре пары 64-битных чисел</text>
  </g>

  <g data-key="simdnum">
    <text x="20" y="556" class="cap">цикл на C с векторными командами: 0,337 нс на элемент, то есть 0,71 такта — меньше такта на число</text>
  </g>

  <g data-key="pynote" data-only="1">
    <text x="20" y="578" class="cap">в цикле Python такой возможности нет: каждый опкод зависит от результата предыдущего</text>
  </g>

  <text x="20" y="604" class="legend">жёлтый — работа процессора · зелёный — выигрыш · красный — потери на ожидании</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="queue" data-focus="queue">
      <div class="step-kicker">Шаг 1 · запас работы</div>
      <h4>Процессор смотрит далеко вперёд</h4>
      <p>
        Команды не исполняются по одной по мере поступления. Они попадают в
        окно — буфер на сотни команд, — где ядро видит их все сразу и может
        выбирать, какую запустить следующей.
      </p>
    </div>
    <div class="step-panel" data-on="queue ports" data-focus="ports">
      <div class="step-kicker">Шаг 2 · несколько устройств</div>
      <h4>Внутри ядра не один исполнитель, а несколько</h4>
      <p>
        Сумматоров два, отдельно устройство чтения памяти, отдельно делитель.
        Из окна на них можно раздать несколько команд за один такт — если эти
        команды друг от друга не зависят.
      </p>
    </div>
    <div class="step-panel" data-on="queue ports ilp" data-focus="ilp">
      <div class="step-kicker">Шаг 3 · зависимость решает</div>
      <h4>Независимые цепочки идут вдвое быстрее</h4>
      <p>
        Одна цепочка сложений в общий накопитель: 1,41 такта на элемент —
        каждое сложение ждёт предыдущего. Четыре независимых накопителя:
        0,67 такта. Больше одного сложения за такт, при том что кода стало
        только больше.
      </p>
    </div>
    <div class="step-panel" data-on="queue ports ilp slow" data-focus="slow">
      <div class="step-kicker">Шаг 4 · разная цена</div>
      <h4>Деление в пять раз дороже сложения</h4>
      <p>
        Измеренная пропускная способность на этой машине: сложение и умножение
        целых — около полутора тактов, целочисленное деление — 7,46, корень —
        5,99. Внеочередное исполнение нужно как раз для того, чтобы одна
        медленная команда не останавливала конвейер: остальные её обгоняют.
      </p>
    </div>
    <div class="step-panel" data-on="queue ports ilp slow simd" data-focus="simd">
      <div class="step-kicker">Шаг 5 · ещё один способ</div>
      <h4>Одна команда — четыре сложения</h4>
      <p>
        Регистры <code>ymm</code> шириной 256 бит вмещают четыре 64-битных
        числа. Команда <code>vpaddq</code> складывает их попарно за один заход.
        Это <strong>SIMD</strong>: одна команда, много данных. Компилятор
        подставляет такие команды сам, когда видит простой цикл по массиву.
      </p>
    </div>
    <div class="step-panel" data-on="queue ports ilp slow simd simdnum" data-focus="simdnum">
      <div class="step-kicker">Шаг 6 · измерение</div>
      <h4>0,71 такта на число</h4>
      <p>
        Тот же цикл суммирования, собранный с <code>-O3 -march=native</code>:
        0,337 нс на элемент против 1,131 нс без векторизации. Процессор
        обрабатывает по числу быстрее, чем успевает сделать один такт.
      </p>
    </div>
    <div class="step-panel" data-on="queue ports ilp slow simd simdnum pynote" data-focus="pynote">
      <div class="step-kicker">Шаг 7 · чего лишён Python</div>
      <h4>Интерпретатор не даёт разогнаться</h4>
      <p>
        Чтобы обогнать медленную команду или сложить четыре числа разом, нужно
        знать наперёд, что будет дальше. В цикле интерпретатора каждый опкод
        решает, куда прыгать, только после того, как исполнен предыдущий, — окно
        команд заполнить нечем.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout-blue">
  <strong>При чём тут «разрядность процессора».</strong> 64-битный процессор
  называется так потому, что его обычные регистры и адреса шириной 64 бита: за
  один заход он двигает восемь байт и умеет адресовать очень много памяти.
  Векторные регистры к этому числу отношения не имеют — они шире: 128, 256 или
  512 бит. Так что «64-битный» описывает базовую ширину слова, а не предел того,
  сколько данных команда может тронуть.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> производительность процессора — это не
  скорость одной операции, а то, сколько независимой работы ему удаётся найти
  одновременно. Код, в котором каждый шаг ждёт предыдущего, не даёт ему
  развернуться, каким бы быстрым ни было железо.
</div>

---

## Часть 5. Память: почему процессор в основном ждёт

<p>
  Мы разобрали, как процессор исполняет команды, и всюду молча предполагали, что
  данные у него под рукой. Это самое смелое предположение во всей статье.
</p>

<p>
  Регистров в ядре несколько десятков, и в них помещается несколько сотен байт.
  Всё остальное лежит в оперативной памяти, и добраться туда стоит дорого.
  Измерим честно: программа ходит по массиву по случайной перестановке, так что
  предсказать следующий адрес невозможно, и каждое обращение приходится ждать
  по-настоящему.
</p>

<table class="shape-table">
  <tr><th>Размер рабочего набора</th><th>Одно обращение, нс</th><th>Тактов</th><th>Где лежат данные</th></tr>
  <tr><td>8–48 КиБ</td><td>1,76–1,78</td><td>3,7</td><td>кэш первого уровня</td></tr>
  <tr><td>64 КиБ</td><td>2,91</td><td>6,1</td><td>вышли за L1</td></tr>
  <tr><td>1 МиБ</td><td>7,04</td><td>14,8</td><td>кэш второго уровня</td></tr>
  <tr><td>2 МиБ</td><td>12,52</td><td>26,3</td><td>граница L2</td></tr>
  <tr><td>16 МиБ</td><td>42,97</td><td>90,2</td><td>дальше по иерархии</td></tr>
  <tr><td>256 МиБ</td><td>151,47</td><td>318,1</td><td>фактически оперативная память</td></tr>
</table>

<p>
  Триста восемнадцать тактов. За это время процессор успел бы выполнить
  пять сотен сложений. Отсюда главное правило всей темы производительности:
  <strong>процессор почти никогда не считает — он ждёт данные</strong>. Всё, что
  придумано дальше, придумано против этого ожидания.
</p>

<p>
  Первое средство — <strong>кэш</strong>: маленькая быстрая память прямо в ядре,
  в которую складываются недавно использованные куски оперативной памяти.
  Второе — то, что кэш работает не байтами, а <strong>линиями</strong> по
  64 байта. Попросили одно число — привезли всю линию целиком, вместе с семью
  соседями. Если следующая ваша операция обратится к соседнему числу, платить
  повторно не придётся.
</p>

<p>
  Насколько это помогает, считается в одну строчку. Если доля попаданий в кэш
  равна <span class="math-inline" data-tex="p"></span>, то среднее обращение стоит
</p>

<div class="math-display" data-tex="T = p \cdot T_{L1} + (1-p) \cdot T_{\text{ОЗУ}}"></div>

<p>
  При <span class="math-inline" data-tex="T_{L1} = 3{,}7"></span> и
  <span class="math-inline" data-tex="T_{\text{ОЗУ}} = 318"></span> тактах
  попадание в 95 % случаев даёт 19,4 такта на обращение, а 99 % — уже 6,8.
  Даже при 99 % попаданий почти половина среднего времени приходится на тот единственный процент, который промахнулся.
</p>

<p>
  Что размер линии именно такой, видно из измерения. Один и тот же проход по
  64 мегабайтам, меняется только шаг:
</p>

<table class="shape-table">
  <tr><th>Шаг обхода</th><th>Прочитано байт</th><th>Время прохода</th></tr>
  <tr><td>16 байт</td><td>4 194 304</td><td>8,72 мс</td></tr>
  <tr><td>32 байта</td><td>2 097 152</td><td>5,99 мс</td></tr>
  <tr><td>64 байта</td><td>1 048 576</td><td>2,39 мс</td></tr>
  <tr><td>128 байт</td><td>524 288</td><td>2,31 мс</td></tr>
  <tr><td>256 байт</td><td>262 144</td><td>1,58 мс</td></tr>
</table>

<p>
  Обратите внимание на переход от 64 к 128: мы трогаем вдвое меньше байт, а
  время не меняется. Дальше, с 256 байт, время снова начинает падать. Значит, до
  этого места мы платили не за прочитанные байты, а за подвезённые линии — и
  платить меньше можно было, только начав пропускать линии целиком.
</p>

<div class="callout-blue">
  <strong>Почему плато тянется до 128, а не до 64.</strong> Линия здесь ровно
  64 байта — это написано и в <code>/sys/devices/system/cpu/cpu0/cache</code>.
  Но процессоры Intel при последовательном чтении подтягивают линии парами,
  «на всякий случай». Так что фактическая порция, за которую вы платите при
  проходе по массиву, — 128 байт.
</div>

<p>
  Теперь соединим это с Python. Список <code>[2, 4, 6, 8, 10]</code> — это не
  массив чисел. Это массив <em>указателей</em> на объекты-числа, каждый из
  которых лежит в куче отдельно и занимает 28 байт. Десять миллионов чисел в
  списке — это 76,3 МиБ указателей плюс 267 МиБ объектов; процесс с одним таким
  списком занимает 392 МиБ против 80 МБ, которые тот же массив занял бы в C.
  Как устроен сам список, разбиралось в статье
  <a href="article.html?slug=lists">«Введение в списки»</a>; здесь важно только то, что
  добраться до числа — это два обращения к памяти вместо одного.
</p>

<div class="stage" id="stageMem" tabindex="0">
  <div class="stage-figure">
<svg id="mm" viewBox="0 0 960 680" role="img" aria-label="Лестница задержек памяти, кэш-линия в 64 байта и список Python как массив указателей на разбросанные объекты">
  <style>
    #mm { font-family: Helvetica, Arial, sans-serif; }
    #mm .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; }
    #mm .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.5; }
    #mm .bn  { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.3; }
    #mm .lbl { font-size: 17px; fill: #111111; }
    #mm .mono{ font-size: 12px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #mm .cap { font-size: 13px; fill: #5E5850; }
    #mm .cap12 { font-size: 12px; fill: #5E5850; }
    #mm .row { font-size: 13px; fill: #111111; }
    #mm .white { font-size: 12px; fill: #FFFFFF; font-weight: 700; }
    #mm .edge{ stroke: #3576C0; stroke-width: 1.4; fill: none; }
    #mm .redge{ stroke: #C30B0A; stroke-width: 1.4; fill: none; }
    #mm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="mm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
    <marker id="mm-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <g data-key="ladder">
    <text x="20" y="52" class="lbl">Сколько тактов стоит одно обращение</text>
    <text x="20" y="95" class="row">регистры</text>
    <rect x="280" y="76" width="8" height="28" rx="3" fill="#73B222"/>
    <text x="298" y="95" class="cap">меньше такта — они внутри ядра</text>
    <text x="20" y="135" class="row">L1 · 48 КиБ</text>
    <rect x="280" y="116" width="166" height="28" rx="3" fill="#3576C0"/>
    <text x="290" y="135" class="white">3,7 такта</text>
    <text x="20" y="175" class="row">L2 · 2 МиБ</text>
    <rect x="280" y="156" width="355" height="28" rx="3" fill="#3576C0"/>
    <text x="290" y="175" class="white">26,3 такта</text>
    <text x="20" y="215" class="row">16 МиБ</text>
    <rect x="280" y="196" width="485" height="28" rx="3" fill="#C29E08"/>
    <text x="290" y="215" class="white">90,2 такта</text>
    <text x="20" y="255" class="row">256 МиБ</text>
    <rect x="280" y="236" width="620" height="28" rx="3" fill="#C30B0A"/>
    <text x="290" y="255" class="white">318,1 такта — это уже оперативная память</text>
    <text x="280" y="284" class="cap12">длина полос — логарифмическая шкала</text>
  </g>

  <g data-key="line">
    <text x="20" y="330" class="lbl">Память отдаёт не байт, а линию в 64 байта</text>
    <text x="20" y="374" class="row">линия</text>
    <rect x="280" y="350" width="76" height="36" rx="4" class="bg"/>
    <text x="318" y="374" class="mono" text-anchor="middle">d[0]</text>
    <rect x="360" y="350" width="76" height="36" rx="4" class="bn"/>
    <text x="398" y="374" class="mono" text-anchor="middle">d[1]</text>
    <rect x="440" y="350" width="76" height="36" rx="4" class="bn"/>
    <text x="478" y="374" class="mono" text-anchor="middle">d[2]</text>
    <rect x="520" y="350" width="76" height="36" rx="4" class="bn"/>
    <text x="558" y="374" class="mono" text-anchor="middle">d[3]</text>
    <rect x="600" y="350" width="76" height="36" rx="4" class="bn"/>
    <text x="638" y="374" class="mono" text-anchor="middle">d[4]</text>
    <rect x="680" y="350" width="76" height="36" rx="4" class="bn"/>
    <text x="718" y="374" class="mono" text-anchor="middle">d[5]</text>
    <rect x="760" y="350" width="76" height="36" rx="4" class="bn"/>
    <text x="798" y="374" class="mono" text-anchor="middle">d[6]</text>
    <rect x="840" y="350" width="76" height="36" rx="4" class="bn"/>
    <text x="878" y="374" class="mono" text-anchor="middle">d[7]</text>
    <text x="280" y="406" class="cap12">попросили одно число — приехали восемь соседних</text>
  </g>

  <g data-key="linenum" data-only="1">
    <text x="20" y="434" class="cap">шаг обхода 64 байта — 2,39 мс на проход; шаг 128 байт — 2,31 мс, хотя читаем вдвое меньше</text>
  </g>

  <g data-key="pylist">
    <text x="20" y="478" class="lbl">Что из этого достаётся списку Python</text>
    <text x="20" y="520" class="row">список</text>
    <rect x="280" y="498" width="76" height="32" rx="4" class="bx"/>
    <text x="318" y="520" class="mono" text-anchor="middle">→</text>
    <rect x="360" y="498" width="76" height="32" rx="4" class="bx"/>
    <text x="398" y="520" class="mono" text-anchor="middle">→</text>
    <rect x="440" y="498" width="76" height="32" rx="4" class="bx"/>
    <text x="478" y="520" class="mono" text-anchor="middle">→</text>
    <rect x="520" y="498" width="76" height="32" rx="4" class="bx"/>
    <text x="558" y="520" class="mono" text-anchor="middle">→</text>
    <rect x="600" y="498" width="76" height="32" rx="4" class="bx"/>
    <text x="638" y="520" class="mono" text-anchor="middle">→</text>
    <rect x="680" y="498" width="76" height="32" rx="4" class="bx"/>
    <text x="718" y="520" class="mono" text-anchor="middle">→</text>
    <text x="20" y="598" class="row">объекты</text>
    <rect x="280" y="576" width="76" height="32" rx="4" class="bn"/>
    <text x="318" y="598" class="mono" text-anchor="middle">2</text>
    <rect x="360" y="576" width="76" height="32" rx="4" class="bn"/>
    <text x="398" y="598" class="mono" text-anchor="middle">4</text>
    <rect x="440" y="576" width="76" height="32" rx="4" class="bn"/>
    <text x="478" y="598" class="mono" text-anchor="middle">6</text>
    <rect x="520" y="576" width="76" height="32" rx="4" class="bn"/>
    <text x="558" y="598" class="mono" text-anchor="middle">8</text>
    <rect x="600" y="576" width="76" height="32" rx="4" class="bn"/>
    <text x="638" y="598" class="mono" text-anchor="middle">10</text>
    <rect x="680" y="576" width="76" height="32" rx="4" class="bn"/>
    <text x="718" y="598" class="mono" text-anchor="middle">12</text>
    <text x="780" y="520" class="cap12">76,3 МиБ указателей</text>
    <text x="780" y="598" class="cap12">267 МиБ объектов</text>
  </g>

  <g data-key="seq" data-only="1">
    <line x1="318" y1="532" x2="318" y2="572" class="edge" marker-end="url(#mm-arw)"/>
    <line x1="398" y1="532" x2="398" y2="572" class="edge" marker-end="url(#mm-arw)"/>
    <line x1="478" y1="532" x2="478" y2="572" class="edge" marker-end="url(#mm-arw)"/>
    <line x1="558" y1="532" x2="558" y2="572" class="edge" marker-end="url(#mm-arw)"/>
    <line x1="638" y1="532" x2="638" y2="572" class="edge" marker-end="url(#mm-arw)"/>
    <line x1="718" y1="532" x2="718" y2="572" class="edge" marker-end="url(#mm-arw)"/>
  </g>

  <g data-key="shuf" data-only="1">
    <line x1="318" y1="532" x2="558" y2="572" class="redge" marker-end="url(#mm-arwr)"/>
    <line x1="398" y1="532" x2="318" y2="572" class="redge" marker-end="url(#mm-arwr)"/>
    <line x1="478" y1="532" x2="718" y2="572" class="redge" marker-end="url(#mm-arwr)"/>
    <line x1="558" y1="532" x2="398" y2="572" class="redge" marker-end="url(#mm-arwr)"/>
    <line x1="638" y1="532" x2="638" y2="572" class="redge" marker-end="url(#mm-arwr)"/>
    <line x1="718" y1="532" x2="478" y2="572" class="redge" marker-end="url(#mm-arwr)"/>
  </g>

  <g data-key="pynum" data-only="1">
    <text x="20" y="632" class="cap">сумма по упорядоченному списку — 6,03 нс на элемент, по перемешанному — 32,62 нс: те же объекты, тот же ответ</text>
  </g>

  <text x="20" y="664" class="legend">синий — данные и структура · зелёный — то, что запросили · жёлтый и красный — растущая цена ожидания</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="ladder" data-focus="ladder">
      <div class="step-kicker">Шаг 1 · лестница</div>
      <h4>От четырёх тактов до трёхсот</h4>
      <p>
        Пока рабочий набор помещается в 48 КиБ, обращение стоит 3,7 такта. На
        двух мегабайтах — уже 26. На 256 мегабайтах — 318. Это не разные виды
        памяти в программе: это один и тот же массив, просто разного размера.
      </p>
    </div>
    <div class="step-panel" data-on="ladder line" data-focus="line">
      <div class="step-kicker">Шаг 2 · линия</div>
      <h4>Единица обмена — 64 байта</h4>
      <p>
        Запрос одного числа тянет за собой всю линию: восемь 64-битных чисел.
        Поэтому проход по массиву подряд почти бесплатен — за первое число вы
        платите полную цену, за следующие семь не платите ничего.
      </p>
    </div>
    <div class="step-panel" data-on="ladder line linenum" data-focus="linenum">
      <div class="step-kicker">Шаг 3 · проверка</div>
      <h4>Платим за линии, а не за байты</h4>
      <p>
        Увеличив шаг обхода с 64 до 128 байт, мы стали читать вдвое меньше
        данных — а время прохода осталось прежним, 2,3 мс. Значит, счётчик
        крутился не по прочитанным байтам.
      </p>
    </div>
    <div class="step-panel" data-on="ladder line linenum pylist" data-focus="pylist">
      <div class="step-kicker">Шаг 4 · список Python</div>
      <h4>Массив указателей, а не массив чисел</h4>
      <p>
        В самом списке лежат только адреса. Числа — отдельные объекты по 28 байт
        в куче. Чтобы сложить два числа, надо сначала прочитать указатель, потом
        по нему прочитать объект: два обращения вместо одного.
      </p>
    </div>
    <div class="step-panel" data-on="ladder line linenum pylist seq" data-focus="seq">
      <div class="step-kicker">Шаг 5 · когда везёт</div>
      <h4>Объекты, созданные подряд, и лежат подряд</h4>
      <p>
        <code>list(range(10_000_000))</code> создаёт числа одно за другим, и
        аллокатор кладёт их с шагом ровно 32 байта. Обход списка по порядку
        оказывается обходом памяти по порядку — линии работают на вас.
      </p>
    </div>
    <div class="step-panel" data-on="ladder line linenum pylist shuf" data-focus="shuf">
      <div class="step-kicker">Шаг 6 · когда не везёт</div>
      <h4>Перемешаем список — объекты остаются на месте</h4>
      <p>
        <code>random.shuffle</code> переставляет указатели, а не объекты. Список
        тот же, объекты те же, сумма та же. Изменился только порядок, в котором
        мы прыгаем по памяти.
      </p>
    </div>
    <div class="step-panel" data-on="ladder line linenum pylist shuf pynum" data-focus="pynum">
      <div class="step-kicker">Шаг 7 · измеренная разница</div>
      <h4>Те же данные медленнее в 5,4 раза</h4>
      <p>
        6,03 нс на элемент по упорядоченному списку против 32,62 нс по
        перемешанному. Ни одна строчка Python не изменилась — изменилась
        локальность. Это самый дешёвый способ убедиться, что кэш существует.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> скорость программы почти всегда
  определяется не тем, сколько операций она делает, а тем, в каком порядке
  трогает память. Структура данных, которая кладёт нужное рядом, выигрывает у
  структуры, которая раскидывает его по куче, даже при одинаковом числе
  операций.
</div>

---

## Часть 6. Несколько ядер и одна память

<p>
  Пока ядро было одно, кэш был просто ускорителем: копия куска памяти, о которой
  больше никто не знает. Как только ядер становится два, копий тоже становится
  две — и появляется вопрос, которого раньше не было: что делать, если одно ядро
  изменило своё значение, а второе про это не в курсе.
</p>

<p>
  Казалось бы, чем больше процессоров, тем выше производительность. На практике
  выигрыш от параллелизма легко съедается стоимостью общения между ядрами.
  Раньше все процессоры висели на одной общей шине и по очереди её захватывали —
  один говорит, остальные ждут. Сегодня их соединяет сеть внутри кристалла, но
  суть та же: <strong>любые общие изменяемые данные — это трафик</strong>, и
  трафик тем больше, чем чаще их трогают.
</p>

<p>
  Правило, по которому кэши договариваются, называется
  <strong>когерентностью</strong>. У каждой линии в каждом кэше есть пометка —
  как её состояние соотносится с состоянием такой же линии у соседей.
  Классический набор пометок называется <strong>MESI</strong>, по первым буквам
  четырёх состояний.
</p>

<div class="stage" id="stageCores" tabindex="0">
  <div class="stage-figure">
<svg id="mc" viewBox="0 0 960 610" role="img" aria-label="Два ядра со своими кэшами, общая шина и оперативная память; состояния кэш-линии по протоколу MESI">
  <style>
    #mc { font-family: Helvetica, Arial, sans-serif; }
    #mc .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mc .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #mc .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #mc .br  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #mc .bn  { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.3; }
    #mc .frame { fill: none; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 7 5; }
    #mc .lbl { font-size: 17px; fill: #111111; }
    #mc .mono{ font-size: 13px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #mc .cap { font-size: 13px; fill: #5E5850; }
    #mc .st  { font-size: 14px; fill: #111111; font-weight: 700; }
    #mc .edge{ stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #mc .redge{ stroke: #C30B0A; stroke-width: 2; fill: none; }
    #mc .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="mc-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <g data-key="cores">
    <rect x="40" y="58" width="380" height="222" rx="10" class="frame"/>
    <text x="230" y="86" class="lbl" text-anchor="middle">Ядро 1</text>
    <rect x="60" y="102" width="340" height="158" rx="8" class="bx"/>
    <text x="230" y="128" class="cap" text-anchor="middle">кэш L1 · одна линия из 64 байт</text>
    <rect x="80" y="144" width="300" height="44" rx="5" class="bn"/>
    <text x="230" y="172" class="mono" text-anchor="middle">counter</text>
    <rect x="540" y="58" width="380" height="222" rx="10" class="frame"/>
    <text x="730" y="86" class="lbl" text-anchor="middle">Ядро 2</text>
    <rect x="560" y="102" width="340" height="158" rx="8" class="bx"/>
    <text x="730" y="128" class="cap" text-anchor="middle">кэш L1 · та же линия</text>
    <rect x="580" y="144" width="300" height="44" rx="5" class="bn"/>
    <text x="730" y="172" class="mono" text-anchor="middle">counter</text>
  </g>

  <g data-key="bus">
    <line x1="230" y1="280" x2="230" y2="322" class="edge"/>
    <line x1="730" y1="280" x2="730" y2="322" class="edge"/>
    <line x1="120" y1="322" x2="840" y2="322" class="edge"/>
    <text x="480" y="312" class="cap" text-anchor="middle">общая шина между ядрами и памятью</text>
  </g>

  <g data-key="ram">
    <line x1="480" y1="322" x2="480" y2="358" class="edge"/>
    <rect x="340" y="358" width="280" height="80" rx="8" class="bx"/>
    <text x="480" y="388" class="lbl" text-anchor="middle">Оперативная память</text>
    <text x="480" y="414" class="mono" text-anchor="middle">counter = 0</text>
  </g>

  <g data-key="c1E" data-only="1">
    <rect x="80" y="204" width="300" height="34" rx="5" class="bg"/>
    <text x="230" y="227" class="st" text-anchor="middle">Exclusive · counter = 0</text>
  </g>
  <g data-key="c1S" data-only="1">
    <rect x="80" y="204" width="300" height="34" rx="5" class="by"/>
    <text x="230" y="227" class="st" text-anchor="middle">Shared · counter = 0</text>
  </g>
  <g data-key="c1M" data-only="1">
    <rect x="80" y="204" width="300" height="34" rx="5" class="bg"/>
    <text x="230" y="227" class="st" text-anchor="middle">Modified · counter = 1</text>
  </g>
  <g data-key="c1S2" data-only="1">
    <rect x="80" y="204" width="300" height="34" rx="5" class="by"/>
    <text x="230" y="227" class="st" text-anchor="middle">Shared · counter = 1</text>
  </g>
  <g data-key="c2S" data-only="1">
    <rect x="580" y="204" width="300" height="34" rx="5" class="by"/>
    <text x="730" y="227" class="st" text-anchor="middle">Shared · counter = 0</text>
  </g>
  <g data-key="c2I" data-only="1">
    <rect x="580" y="204" width="300" height="34" rx="5" class="br"/>
    <text x="730" y="227" class="st" text-anchor="middle">Invalid — копия устарела</text>
  </g>
  <g data-key="c2S2" data-only="1">
    <rect x="580" y="204" width="300" height="34" rx="5" class="by"/>
    <text x="730" y="227" class="st" text-anchor="middle">Shared · counter = 1</text>
  </g>

  <g data-key="traffic" data-only="1">
    <path d="M 250 296 C 400 262, 560 262, 710 296" class="redge" marker-end="url(#mc-arw)"/>
    <text x="480" y="348" class="cap" text-anchor="middle">свежее значение едет из чужого кэша, а не из памяти</text>
  </g>

  <g data-key="mesi">
    <text x="40" y="480" class="cap">Modified — линия изменена, до памяти изменение ещё не дошло</text>
    <text x="40" y="502" class="cap">Exclusive — совпадает с памятью, и больше ни у кого её нет</text>
    <text x="40" y="524" class="cap">Shared — совпадает с памятью, копии есть у соседей</text>
    <text x="40" y="546" class="cap">Invalid — копия недействительна, чтение приведёт к промаху</text>
  </g>

  <g data-key="note" data-only="1">
    <text x="40" y="576" class="cap">каждая запись в общую переменную гасит копии у соседей — это и есть цена общего изменяемого состояния</text>
  </g>

  <text x="40" y="602" class="legend">синий — структура · жёлтый — согласуемое состояние · зелёный — линия своя · красный — недействительна</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="cores bus ram" data-focus="cores">
      <div class="step-kicker">Шаг 1 · расстановка</div>
      <h4>Два ядра, два кэша, одна память</h4>
      <p>
        В памяти лежит переменная <code>counter</code>. Кэш каждого ядра свой:
        физически это отдельная память внутри своего кристалла ядра, и второе
        ядро в неё не заглядывает.
      </p>
    </div>
    <div class="step-panel" data-on="cores bus ram c1E" data-focus="c1E">
      <div class="step-kicker">Шаг 2 · первое чтение</div>
      <h4>Exclusive: копия есть только у меня</h4>
      <p>
        Ядро 1 прочитало <code>counter</code> — линия приехала в его кэш и
        помечена как <em>Exclusive</em>. Значение совпадает с памятью, соседей с
        копиями нет. Это самое удобное состояние: писать в такую линию можно, ни
        с кем не согласовывая.
      </p>
    </div>
    <div class="step-panel" data-on="cores bus ram c1S c2S" data-focus="c2S">
      <div class="step-kicker">Шаг 3 · второе чтение</div>
      <h4>Shared: копий стало две</h4>
      <p>
        Теперь ту же переменную читает ядро 2. Обе линии переходят в
        <em>Shared</em>: значения совпадают друг с другом и с памятью. Пока все
        только читают, всё бесплатно — читать общие данные могут сколько угодно
        ядер одновременно.
      </p>
    </div>
    <div class="step-panel" data-on="cores bus ram c1M c2I" data-focus="c1M">
      <div class="step-kicker">Шаг 4 · запись</div>
      <h4>Modified у одного — Invalid у всех остальных</h4>
      <p>
        Ядро 1 делает <code>counter += 1</code>. Прежде чем изменить линию, оно
        обязано объявить об этом по шине, и копия ядра 2 помечается как
        <em>Invalid</em>. В памяти всё ещё ноль: новое значение живёт только в
        кэше первого ядра.
      </p>
    </div>
    <div class="step-panel" data-on="cores bus ram c1S2 c2S2 traffic" data-focus="traffic">
      <div class="step-kicker">Шаг 5 · расплата</div>
      <h4>Соседу приходится спрашивать</h4>
      <p>
        Ядро 2 снова читает <code>counter</code> — и получает промах, хотя линия
        физически лежит в его кэше. Свежее значение приходится тянуть из чужого
        кэша. Обе линии возвращаются в <em>Shared</em> — до следующей записи.
      </p>
    </div>
    <div class="step-panel" data-on="cores bus ram mesi" data-focus="mesi">
      <div class="step-kicker">Шаг 6 · четыре пометки</div>
      <h4>Весь протокол — это четыре состояния линии</h4>
      <p>
        Ядро смотрит на пометку своей линии и по ней решает, можно ли читать без
        вопросов, писать без вопросов или нужно объявлять о намерении. Всё
        остальное — детали конкретной реализации.
      </p>
    </div>
    <div class="step-panel" data-on="cores bus ram mesi note" data-focus="note">
      <div class="step-kicker">Шаг 7 · что из этого следует</div>
      <h4>Общая переменная стоит дороже, чем кажется</h4>
      <p>
        Если два потока по очереди пишут в один счётчик, линия ходит между
        кэшами туда-обратно на каждой операции. Причём согласуется не
        переменная, а вся линия целиком: две независимые переменные, случайно
        попавшие в одни 64 байта, будут мешать друг другу так же, как одна общая.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout-red">
  <strong>Честная оговорка:</strong> все остальные числа в статье измерены, а эта
  часть — единственная без собственных замеров. У машины, на которой готовилась
  статья, одно ядро, а показать перебрасывание линии между кэшами на одном ядре
  невозможно. Схема здесь описывает протокол, а не результат эксперимента.
</div>

<div class="callout-blue">
  <strong>Откуда взялась «атомарность int».</strong> Часто говорят, что на x86
  запись <code>int</code> атомарна, а чего-то большего — уже нет. Смысл в том,
  что за один сеанс обмена процессор передаёт ограниченное число байт, и
  значение, которое целиком помещается в такой сеанс и не пересекает границу
  линии, соседи увидят либо старым, либо новым, но никогда наполовину
  обновлённым. Это свойство одной записи в память — и оно ничего не говорит про
  <code>counter += 1</code>, где записей две, а между ними ещё и чтение.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> ядра не делят кэш — они его
  согласовывают. Читать общее можно сколько угодно и бесплатно; каждая запись в
  общее превращается в сообщение всем остальным.
</div>

---

## Часть 7. Кто раздаёт процессор: процессы, потоки, виртуальная память

<p>
  До сих пор мы говорили так, будто ваша программа на машине одна. На самом деле
  их сотни. Кто-то должен раздавать им ядра, следить, чтобы они не залезали в
  чужую память, и не давать одной программе уронить всю систему. Этим занимается
  операционная система — подробно про неё в статье
  <a href="article.html?slug=operating-system">«Зачем нужна операционная система»</a>; здесь
  нам нужны три её понятия.
</p>

<p>
  <strong>Процесс</strong> — это запущенная программа со всем, что ей выдали:
  собственным адресным пространством, открытыми файлами, правами.
  <strong>Поток</strong> — это отдельная нить исполнения внутри процесса: у него
  свои регистры и свой стек, а куча, код и файлы — общие с остальными потоками
  того же процесса. Именно поэтому потоки дешевле процессов: создать и завершить
  поток на этой машине стоит 35,5 мкс, а запустить новый интерпретатор
  Python — 11,3 мс, в триста раз дороже.
</p>

<p>
  <strong>Виртуальная память</strong> — это обещание, которое операционная
  система даёт каждому процессу: «вот тебе адреса от нуля до огромного числа,
  распоряжайся». Адреса ненастоящие. Каждое обращение по адресу переводится в
  настоящий, физический адрес блоком внутри процессора — <strong>MMU</strong>, —
  по таблице, которую для этого процесса завела система. Перевод идёт кусками по
  4096 байт, они называются страницами.
</p>

<div class="callout-blue">
  <strong>Три вещи, которые это даёт.</strong> Во-первых, программе можно выдать
  больше адресов, чем есть физической памяти: <code>mmap</code> на гигабайт
  занимает 6,2 микросекунды и не тратит ни байта, пока вы туда не напишете.
  Во-вторых, процессы изолированы: один и тот же адрес у двух процессов ведёт в
  разные физические страницы, и залезть в чужую память просто нечем. В-третьих,
  у разных участков могут быть разные права — код можно исполнять, но нельзя
  менять, а одну и ту же копию <code>libc</code> видят все процессы сразу.
</div>

<div class="stage" id="stageOS" tabindex="0">
  <div class="stage-figure">
<svg id="os" viewBox="0 0 960 686" role="img" aria-label="Адресное пространство процесса, потоки, MMU, страницы физической памяти и планировщик">
  <style>
    #os { font-family: Helvetica, Arial, sans-serif; }
    #os .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; }
    #os .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.5; }
    #os .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.5; }
    #os .bn  { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.3; }
    #os .frame { fill: none; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 7 5; }
    #os .lbl { font-size: 17px; fill: #111111; }
    #os .seg { font-size: 13px; fill: #111111; }
    #os .cap { font-size: 13px; fill: #5E5850; }
    #os .cap12 { font-size: 12px; fill: #5E5850; }
    #os .in12 { font-size: 12px; fill: #111111; }
    #os .edge{ stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #os .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="os-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="space">
    <text x="150" y="84" class="lbl" text-anchor="middle">Адресное пространство</text>
    <rect x="40" y="96" width="220" height="460" rx="10" class="frame"/>
    <rect x="54" y="112" width="192" height="50" rx="5" class="bx"/>
    <text x="150" y="142" class="seg" text-anchor="middle">стек потока 1</text>
    <rect x="54" y="168" width="192" height="50" rx="5" class="bx"/>
    <text x="150" y="198" class="seg" text-anchor="middle">стек потока 2</text>
    <rect x="54" y="224" width="192" height="34" rx="5" class="bn"/>
    <text x="150" y="246" class="seg" text-anchor="middle">свободно</text>
    <rect x="54" y="264" width="192" height="46" rx="5" class="bx"/>
    <text x="150" y="292" class="seg" text-anchor="middle">файлы и библиотеки</text>
    <rect x="54" y="316" width="192" height="34" rx="5" class="bn"/>
    <text x="150" y="338" class="seg" text-anchor="middle">свободно</text>
    <rect x="54" y="356" width="192" height="60" rx="5" class="bx"/>
    <text x="150" y="391" class="seg" text-anchor="middle">куча — объекты Python</text>
    <rect x="54" y="422" width="192" height="50" rx="5" class="bx"/>
    <text x="150" y="452" class="seg" text-anchor="middle">глобальные данные</text>
    <rect x="54" y="478" width="192" height="50" rx="5" class="bx"/>
    <text x="150" y="508" class="seg" text-anchor="middle">код программы</text>
    <text x="40" y="576" class="cap">адреса здесь виртуальные: от нуля и до огромных чисел, независимо от объёма ОЗУ</text>
  </g>

  <g data-key="threads">
    <rect x="290" y="112" width="250" height="106" rx="8" class="by"/>
    <text x="415" y="138" class="lbl" text-anchor="middle">Поток</text>
    <text x="302" y="164" class="in12">свои регистры: RIP, RSP, RAX…</text>
    <text x="302" y="186" class="in12">свой стек — свои 8 МБ адресов</text>
    <text x="302" y="208" class="in12">всё остальное общее с процессом</text>
  </g>

  <g data-key="mmu">
    <line x1="262" y1="300" x2="286" y2="300" class="edge" marker-end="url(#os-arw)"/>
    <rect x="290" y="250" width="250" height="100" rx="8" class="by"/>
    <text x="415" y="282" class="lbl" text-anchor="middle">MMU</text>
    <text x="415" y="308" class="in12" text-anchor="middle">переводит виртуальный адрес</text>
    <text x="415" y="328" class="in12" text-anchor="middle">в физический, страницами по 4 КиБ</text>
  </g>

  <g data-key="phys">
    <line x1="544" y1="300" x2="612" y2="300" class="edge" marker-end="url(#os-arw)"/>
    <text x="768" y="84" class="lbl" text-anchor="middle">Физическая память</text>
    <rect x="616" y="96" width="304" height="460" rx="10" class="bx"/>
    <rect x="634" y="116" width="132" height="44" rx="5" class="bx"/>
    <text x="700" y="143" class="in12" text-anchor="middle">наш процесс</text>
    <rect x="778" y="116" width="132" height="44" rx="5" class="bn"/>
    <text x="844" y="143" class="in12" text-anchor="middle">свободно</text>
    <rect x="634" y="172" width="132" height="44" rx="5" class="bg"/>
    <text x="700" y="199" class="in12" text-anchor="middle">другой процесс</text>
    <rect x="778" y="172" width="132" height="44" rx="5" class="bx"/>
    <text x="844" y="199" class="in12" text-anchor="middle">наш процесс</text>
    <rect x="634" y="228" width="132" height="44" rx="5" class="bn"/>
    <text x="700" y="255" class="in12" text-anchor="middle">свободно</text>
    <rect x="778" y="228" width="132" height="44" rx="5" class="bg"/>
    <text x="844" y="255" class="in12" text-anchor="middle">другой процесс</text>
    <rect x="634" y="284" width="132" height="44" rx="5" class="bx"/>
    <text x="700" y="311" class="in12" text-anchor="middle">наш процесс</text>
    <rect x="778" y="284" width="132" height="44" rx="5" class="bn"/>
    <text x="844" y="311" class="in12" text-anchor="middle">свободно</text>
    <rect x="634" y="340" width="132" height="44" rx="5" class="bg"/>
    <text x="700" y="367" class="in12" text-anchor="middle">другой процесс</text>
    <rect x="778" y="340" width="132" height="44" rx="5" class="bx"/>
    <text x="844" y="367" class="in12" text-anchor="middle">наш процесс</text>
    <text x="634" y="412" class="cap12">страницы по 4 КиБ, лежат где придётся</text>
    <rect x="634" y="430" width="276" height="50" rx="6" class="bn"/>
    <text x="772" y="460" class="seg" text-anchor="middle">файл подкачки на диске</text>
  </g>

  <g data-key="iso" data-only="1">
    <text x="40" y="600" class="cap">тот же самый адрес у другого процесса ведёт в другую физическую страницу — это и есть изоляция</text>
  </g>

  <g data-key="sched">
    <rect x="290" y="390" width="250" height="110" rx="8" class="bx"/>
    <text x="415" y="422" class="lbl" text-anchor="middle">Планировщик</text>
    <text x="415" y="448" class="in12" text-anchor="middle">раздаёт ядро квантами времени</text>
    <text x="415" y="470" class="in12" text-anchor="middle">поток, который ждёт ввода,</text>
    <text x="415" y="490" class="in12" text-anchor="middle">уступает место сразу</text>
  </g>

  <g data-key="nums" data-only="1">
    <text x="40" y="626" class="cap">выделить 1 ГиБ — 6,2 мкс, и памяти не тратится: страница появляется при первом касании</text>
    <text x="40" y="648" class="cap">первое касание страницы 18,6 мкс, повторная запись 0,25 мкс; круг между процессами 3,48 мкс</text>
  </g>

  <text x="40" y="674" class="legend">синий — наш процесс и его структура · жёлтый — механизмы ядра · зелёный — чужой процесс</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="space" data-focus="space">
      <div class="step-kicker">Шаг 1 · что видит программа</div>
      <h4>Своё адресное пространство, разложенное по полкам</h4>
      <p>
        Внизу — код программы, он не меняется. Выше глобальные данные и куча:
        там живут все объекты Python. Ещё выше — отображённые файлы и
        библиотеки. Сверху — стеки. Между ними много пустого места, и это не
        расточительство: пустые адреса ничего не стоят.
      </p>
    </div>
    <div class="step-panel" data-on="space threads" data-focus="threads">
      <div class="step-kicker">Шаг 2 · потоки</div>
      <h4>Поток — это регистры и стек, всё остальное общее</h4>
      <p>
        Второй поток добавляет к картинке один прямоугольник — свой стек — и
        набор значений регистров. Куча общая, поэтому потоки видят одни и те же
        объекты; отсюда же берутся все гонки за данные.
      </p>
    </div>
    <div class="step-panel" data-on="space threads mmu" data-focus="mmu">
      <div class="step-kicker">Шаг 3 · перевод адресов</div>
      <h4>Между программой и памятью стоит переводчик</h4>
      <p>
        Любой адрес, который встречается в машинной команде, — виртуальный. MMU
        переводит его в физический по таблице страниц. Перевод настолько частая
        операция, что для него есть свой маленький кэш прямо в ядре.
      </p>
    </div>
    <div class="step-panel" data-on="space threads mmu phys" data-focus="phys">
      <div class="step-kicker">Шаг 4 · как оно лежит на самом деле</div>
      <h4>Непрерывное в программе — разбросанное в железе</h4>
      <p>
        Куча, которая в адресном пространстве выглядит сплошным куском, физически
        собрана из страниц по 4 КиБ, лежащих где придётся и вперемешку с чужими.
        Часть страниц может вообще не находиться в памяти — они уехали в файл
        подкачки.
      </p>
    </div>
    <div class="step-panel" data-on="space threads mmu phys iso" data-focus="iso">
      <div class="step-kicker">Шаг 5 · изоляция</div>
      <h4>Чужую память не достать, даже если очень захотеть</h4>
      <p>
        У каждого процесса своя таблица страниц. Один и тот же виртуальный адрес
        в двух процессах — это два разных места в физической памяти. Именно
        поэтому ошибка в вашей программе роняет вашу программу, а не всю машину.
      </p>
    </div>
    <div class="step-panel" data-on="space threads mmu phys sched" data-focus="sched">
      <div class="step-kicker">Шаг 6 · кто когда считает</div>
      <h4>Планировщик раздаёт ядро квантами</h4>
      <p>
        Потоков и процессов больше, чем ядер, поэтому каждый получает ядро на
        небольшой отрезок времени, а потом уступает. Поток, который ждёт диск или
        сеть, отдаёт ядро сразу — ждать он может и не занимая процессор.
      </p>
    </div>
    <div class="step-panel" data-on="space threads mmu phys sched nums" data-focus="nums">
      <div class="step-kicker">Шаг 7 · сколько это стоит</div>
      <h4>Дёшево заказать, дорого тронуть</h4>
      <p>
        Запросить у системы гигабайт адресов — 6,2 мкс, и физической памяти при
        этом не расходуется вовсе. А вот первое обращение к каждой новой странице
        стоит 18,6 мкс против 0,25 мкс на повторную запись: система в этот момент
        подбирает реальную страницу и правит таблицу. Переброска сообщения между
        двумя процессами — 3,48 мкс на круг.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout-yellow">
  <strong>Осторожно с абсолютными числами:</strong> статья готовилась на
  виртуальной машине, а страничные отказы в виртуализации заметно дороже, чем на
  железе. Соотношение «первое касание против повторного» останется таким же
  разительным везде, а сами 18,6 мкс на обычном ноутбуке будут в разы меньше.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> процесс — это не «программа», а
  выданный ей набор ресурсов, в первую очередь собственная карта адресов. Всё,
  что программа считает памятью, на самом деле обещание, которое система
  выполняет по мере того, как вы им пользуетесь.
</div>

---

## Часть 8. Где во всём этом Python

<p>
  Соберём всё вместе и пройдём путь от команды <code>python main.py</code> до
  тактов процессора — уже зная, что происходит на каждом этаже.
</p>

<p>
  Сначала операционная система запускает процесс: новое адресное пространство,
  загрузка интерпретатора и его библиотек. На этой машине пустой запуск
  <code>python3 -c pass</code> стоит 11,3 мс против 0,8 мс на запуск
  <code>/bin/true</code>, и к моменту, когда дело доходит до вашей первой строки,
  уже загружено 70 модулей. Как устанавливается сам интерпретатор и откуда
  берётся <code>PATH</code>, разобрано в
  <a href="article.html?slug=ustanovka-python">«Установке интерпретатора»</a>, а про
  виртуальные окружения — в <a href="article.html?slug=cmd-line-venv">статье про командную
  строку</a>.
</p>

<p>
  Дальше ваш файл компилируется в байткод, и начинается то, ради чего написана
  вся статья: цикл <code>_PyEval_EvalFrameDefault</code> крутится по опкодам, и
  каждый опкод разворачивается в десятки машинных команд, которые процессор
  исполняет по правилам частей 2–5.
</p>

### Почему опкод стоит семь тактов

<p>
  Возьмём <code>BINARY_OP</code> на строке <code>total += x</code>. Даже когда
  оба слагаемых — обычные целые числа, интерпретатор обязан: проверить, что это
  действительно целые, а не что-то со своим <code>__add__</code>; сложить их;
  <strong>создать новый объект</strong> под результат, потому что числа в Python
  неизменяемы; уменьшить счётчик ссылок у старого значения <code>total</code> и,
  если он обнулился, освободить объект; увеличить счётчики у операндов. Отсюда и
  берутся измеренные 17,02 нс на четыре опкода сложения против 6,32 нс на три
  опкода пустого цикла.
</p>

<p>
  С версии 3.11 интерпретатор пытается с этим бороться: он смотрит, какие типы
  реально встречаются, и <strong>переписывает собственный байткод</strong> под
  них. Это видно глазами — достаточно дизассемблировать функцию после нескольких
  вызовов:
</p>

<pre><code>&gt;&gt;&gt; dis.dis(total_of, adaptive=True)
        &gt;&gt;   10 FOR_ITER_LIST            7 (to 28)
             14 STORE_FAST__LOAD_FAST     2 (x)
             16 LOAD_FAST__LOAD_FAST      1 (total)
             18 LOAD_FAST                 2 (x)
             20 BINARY_OP_ADD_INT        13 (+=)</code></pre>

<p>
  <code>FOR_ITER</code> превратился в <code>FOR_ITER_LIST</code> — версию,
  которая знает, что итерируется именно список. <code>BINARY_OP</code> стал
  <code>BINARY_OP_ADD_INT</code> — сложением, которое уже не проверяет типы в
  общем виде. Две пары соседних опкодов слиплись в суперинструкции, чтобы
  сэкономить на диспетчеризации. Это тот же приём, что предсказание переходов из
  части 3, только на этаж выше: догадка о том, что дальше будет как раньше.
</p>

<div class="stage" id="stagePy" tabindex="0">
  <div class="stage-figure">
<svg id="py" viewBox="0 0 960 654" role="img" aria-label="Путь от файла main.py до машинных команд, куча объектов, специализация байткода и работа глобальной блокировки интерпретатора">
  <style>
    #py { font-family: Helvetica, Arial, sans-serif; }
    #py .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; }
    #py .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.5; }
    #py .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.5; }
    #py .bn  { fill: #FFFFFF; stroke: #C9C4B8; stroke-width: 1.3; }
    #py .lbl { font-size: 16px; fill: #111111; }
    #py .mono{ font-size: 12px; fill: #111111; font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; }
    #py .cap { font-size: 13px; fill: #5E5850; }
    #py .cap12 { font-size: 12px; fill: #5E5850; }
    #py .in12 { font-size: 12px; fill: #111111; }
    #py .edge{ stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #py .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="py-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="f12">
    <rect x="20" y="90" width="160" height="70" rx="8" class="bx"/>
    <text x="100" y="130" class="lbl" text-anchor="middle">main.py</text>
    <text x="100" y="180" class="cap12" text-anchor="middle">текст на диске</text>
    <line x1="182" y1="125" x2="206" y2="125" class="edge" marker-end="url(#py-arw)"/>
    <rect x="210" y="90" width="160" height="70" rx="8" class="bx"/>
    <text x="290" y="122" class="lbl" text-anchor="middle">процесс</text>
    <text x="290" y="144" class="in12" text-anchor="middle">интерпретатора</text>
    <text x="290" y="180" class="cap12" text-anchor="middle">старт 11,3 мс</text>
    <text x="290" y="198" class="cap12" text-anchor="middle">70 модулей до первой строки</text>
  </g>

  <g data-key="fbc">
    <line x1="372" y1="125" x2="396" y2="125" class="edge" marker-end="url(#py-arw)"/>
    <rect x="400" y="90" width="160" height="70" rx="8" class="by"/>
    <text x="480" y="130" class="lbl" text-anchor="middle">байткод</text>
    <text x="480" y="180" class="cap12" text-anchor="middle">7 опкодов на итерацию</text>
  </g>

  <g data-key="fev">
    <line x1="562" y1="125" x2="586" y2="125" class="edge" marker-end="url(#py-arw)"/>
    <rect x="590" y="90" width="160" height="70" rx="8" class="by"/>
    <text x="670" y="122" class="lbl" text-anchor="middle">цикл eval</text>
    <text x="670" y="144" class="in12" text-anchor="middle">switch на 140 опкодов</text>
    <text x="670" y="180" class="cap12" text-anchor="middle">56 311 байт кода</text>
  </g>

  <g data-key="fmc">
    <line x1="752" y1="125" x2="776" y2="125" class="edge" marker-end="url(#py-arw)"/>
    <rect x="780" y="90" width="160" height="70" rx="8" class="bg"/>
    <text x="860" y="122" class="lbl" text-anchor="middle">машинные</text>
    <text x="860" y="144" class="lbl" text-anchor="middle">команды</text>
    <text x="860" y="180" class="cap12" text-anchor="middle">49 тактов на итерацию</text>
  </g>

  <g data-key="heap">
    <rect x="20" y="232" width="430" height="140" rx="8" class="bx"/>
    <text x="235" y="260" class="lbl" text-anchor="middle">Куча: объекты</text>
    <rect x="40" y="276" width="120" height="44" rx="5" class="bn"/>
    <text x="100" y="303" class="mono" text-anchor="middle">int · 28 Б</text>
    <rect x="175" y="276" width="120" height="44" rx="5" class="bn"/>
    <text x="235" y="303" class="mono" text-anchor="middle">int · 28 Б</text>
    <rect x="310" y="276" width="120" height="44" rx="5" class="bn"/>
    <text x="370" y="303" class="mono" text-anchor="middle">int · 28 Б</text>
    <text x="40" y="348" class="cap12">каждое += создаёт новый объект и правит счётчики ссылок</text>
  </g>

  <g data-key="spec">
    <rect x="490" y="232" width="450" height="140" rx="8" class="by"/>
    <text x="715" y="260" class="lbl" text-anchor="middle">Специализация байткода</text>
    <text x="502" y="288" class="mono">BINARY_OP     → BINARY_OP_ADD_INT</text>
    <text x="502" y="312" class="mono">FOR_ITER      → FOR_ITER_LIST</text>
    <text x="502" y="336" class="mono">LOAD_FAST ×2  → LOAD_FAST__LOAD_FAST</text>
    <text x="502" y="360" class="cap12">интерпретатор переписывает себя под ваши типы</text>
  </g>

  <g data-key="gil">
    <rect x="20" y="402" width="920" height="150" rx="8" class="bx"/>
    <text x="480" y="430" class="lbl" text-anchor="middle">Глобальная блокировка интерпретатора</text>
    <text x="30" y="472" class="cap">поток A</text>
    <rect x="180" y="452" width="120" height="26" rx="4" fill="#C29E08"/>
    <rect x="420" y="452" width="120" height="26" rx="4" fill="#C29E08"/>
    <rect x="660" y="452" width="120" height="26" rx="4" fill="#C29E08"/>
    <text x="30" y="512" class="cap">поток B</text>
    <rect x="300" y="492" width="120" height="26" rx="4" fill="#3576C0"/>
    <rect x="540" y="492" width="120" height="26" rx="4" fill="#3576C0"/>
    <rect x="780" y="492" width="120" height="26" rx="4" fill="#3576C0"/>
    <text x="180" y="540" class="cap12">байткод исполняет ровно один поток за раз; смена владельца — не чаще чем раз в 5 мс</text>
  </g>

  <g data-key="gilnum" data-only="1">
    <text x="20" y="582" class="cap">поток просыпается за 0,105 мс без нагрузки и за 5,148 мс рядом со счётным Python-потоком</text>
    <text x="20" y="604" class="cap">та же нагрузка внутри NumPy — 0,085 мс: библиотека отпускает блокировку на время счёта</text>
  </g>

  <text x="20" y="634" class="legend">синий — данные и структура · жёлтый — работа интерпретатора · зелёный — то, что реально исполняет процессор</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="f12" data-focus="f12">
      <div class="step-kicker">Шаг 1 · запуск</div>
      <h4>Сначала система запускает не вашу программу, а интерпретатор</h4>
      <p>
        <code>python main.py</code> — это запрос операционной системе создать
        процесс с программой <code>python</code>. Ваш файл для неё просто
        аргумент. 11,3 мс уходит на то, чтобы этот процесс появился и подгрузил
        свои 70 модулей, — и только потом читается первая ваша строка.
      </p>
    </div>
    <div class="step-panel" data-on="f12 fbc" data-focus="fbc">
      <div class="step-kicker">Шаг 2 · компиляция</div>
      <h4>Текст превращается в байткод</h4>
      <p>
        Компиляция быстрая и происходит один раз: для импортированных модулей
        результат ещё и кэшируется в <code>__pycache__</code>. Байткод — это
        удобная форма записи вашей программы, но не то, что понимает процессор.
      </p>
    </div>
    <div class="step-panel" data-on="f12 fbc fev" data-focus="fev">
      <div class="step-kicker">Шаг 3 · исполнение байткода</div>
      <h4>Дальше всё делает один большой цикл на C</h4>
      <p>
        Взять опкод, прыгнуть в обработчик, выполнить, вернуться. Семьдесят
        миллионов оборотов на наш цикл. И заканчивается каждый оборот
        непредсказуемым переходом <code>jmp *%rax</code> — тем самым, который так
        не любит конвейер.
      </p>
    </div>
    <div class="step-panel" data-on="f12 fbc fev fmc" data-focus="fmc">
      <div class="step-kicker">Шаг 4 · внизу лестницы</div>
      <h4>Процессор не знает ни про Python, ни про опкоды</h4>
      <p>
        Он видит только машинные команды интерпретатора и работает с ними ровно
        так, как описано в частях 2–4: конвейер, предсказание, кэш. 49 тактов на
        итерацию — это его честный счёт за ту работу, которую ему принесли.
      </p>
    </div>
    <div class="step-panel" data-on="f12 fbc fev fmc heap" data-focus="heap">
      <div class="step-kicker">Шаг 5 · откуда обращения к памяти</div>
      <h4>Каждое сложение — это новый объект</h4>
      <p>
        Числа в Python неизменяемы, поэтому <code>total += x</code> не меняет
        число на месте, а создаёт новое на 28 байт и правит счётчики ссылок у
        старого. Аллокатор, счётчики, разыменование указателей — вот содержимое
        тех 35,7 такта из части 1.
      </p>
    </div>
    <div class="step-panel" data-on="f12 fbc fev fmc heap spec" data-focus="spec">
      <div class="step-kicker">Шаг 6 · как интерпретатор борется</div>
      <h4>Он переписывает свой байткод под ваши типы</h4>
      <p>
        Увидев, что в <code>BINARY_OP</code> всё время приходят целые, CPython
        подменяет опкод на специализированный и склеивает соседние опкоды в
        суперинструкции. Если типы вдруг поменяются, специализация откатывается
        обратно.
      </p>
    </div>
    <div class="step-panel" data-on="f12 fbc fev fmc heap spec gil" data-focus="gil">
      <div class="step-kicker">Шаг 7 · почему потоки не складываются</div>
      <h4>Байткод исполняет один поток за раз</h4>
      <p>
        Счётчики ссылок у объектов общие для всего процесса, и защищать каждый
        по отдельности слишком дорого. Поэтому в CPython одна большая блокировка
        на весь интерпретатор: владеть ей может только один поток, и отдаёт он
        её не чаще, чем раз в 5 миллисекунд.
      </p>
    </div>
    <div class="step-panel" data-on="f12 fbc fev fmc heap spec gil gilnum" data-focus="gilnum">
      <div class="step-kicker">Шаг 8 · это измеримо</div>
      <h4>5 миллисекунд ожидания вместо 0,1</h4>
      <p>
        Поток, который просто просыпается каждую миллисекунду, без нагрузки
        тратит на пробуждение 0,105 мс. Стоит запустить рядом обычный счётный
        цикл на Python — и медиана становится 5,148 мс: он ждёт, пока сосед
        отдаст блокировку. Если ту же работу отдать NumPy, задержка падает до
        0,085 мс, потому что библиотека отпускает блокировку на время счёта.
      </p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

### Что блокировка не обещает

<p>
  Из «байткод исполняет один поток за раз» часто делают вывод, что операции над
  общими данными в Python безопасны. Это не так, и проверить легко. Два варианта
  одного и того же увеличения общего счётчика, четыре потока по 200 000
  итераций, ожидаемый результат 800 000:
</p>

<pre><code>counter += 1                 → 800000, 800000, 800000
counter = counter + one()    → 379396, 587232, 467268</code></pre>

<p>
  Во втором варианте теряется от четверти до половины увеличений. Разница между
  строками в том, где интерпретатор разрешает себе передать блокировку другому
  потоку: он проверяет это на обратном переходе цикла и при входе в функцию.
  В первой строке между чтением <code>counter</code> и записью результата такой
  точки не оказалось, во второй — вызов <code>one()</code> её создаёт, и второй
  поток успевает прочитать то же старое значение.
</p>

<div class="callout-red">
  <strong>Не полагайтесь на первую строку.</strong> То, что <code>counter += 1</code>
  здесь не потерял ни одного увеличения, — не гарантия языка, а совпадение
  внутреннего устройства конкретной версии CPython. Для общих данных
  используйте <code>Lock</code> или очередь; заодно это единственный вариант,
  который переживёт смену версии интерпретатора.
</div>

### Что с этим делать на практике

<p>
  Вся статья сходится в одну табличку. Ускорять программу на Python — значит
  уменьшать число оборотов цикла интерпретатора, а не «оптимизировать
  алгоритм внутри цикла»:
</p>

<table class="shape-table">
  <tr><th>Приём</th><th>Что меняется внизу</th><th>Измеренный эффект</th></tr>
  <tr><td>Перенести цикл из модуля в функцию</td><td>имена берутся из ячеек, а не из словаря</td><td>60,98 → 23,34 нс</td></tr>
  <tr><td>Заменить цикл на <code>sum()</code></td><td>цикл уезжает внутрь кода на C</td><td>23,34 → 6,01 нс</td></tr>
  <tr><td>Взять NumPy</td><td>числа лежат подряд, работают векторные команды</td><td>23,34 → 0,42 нс</td></tr>
  <tr><td>Не разрушать порядок обхода</td><td>кэш-линии перестают работать вхолостую</td><td>32,62 → 6,03 нс</td></tr>
  <tr><td>Потоки для счётной работы</td><td>ничего: блокировка одна на процесс</td><td>без выигрыша</td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> Python — это программа на C, которая
  ходит по вашему байткоду. Всё, что делает программу на Python быстрее,
  сводится к одному: отдать как можно больше работы за один оборот этого цикла —
  или вообще увести её из него.
</div>

---

## Часть 9. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Между строкой и процессором стоят два переводчика.</strong>
    Компилятор Python превращает текст в байткод, интерпретатор — обычная
    программа на C — исполняет байткод. Процессор не знает ни о том, ни о
    другом.</li>
  <li><strong>Процессор крутит один и тот же оборот.</strong> Взять команду по
    адресу из счётчика, декодировать, исполнить, записать, сдвинуть счётчик.
    Всё остальное — надстройки над этим оборотом.</li>
  <li><strong>Конвейер даёт пропускную способность, а не скорость.</strong>
    Одна команда всё так же идёт несколько тактов, но в работе их десятки
    одновременно. Поэтому непредсказуемый переход стоит около 17 тактов: конвейер
    приходится опустошать.</li>
  <li><strong>Параллелизм внутри одного ядра ищется автоматически.</strong>
    Несколько исполнительных устройств, внеочередное исполнение, векторные
    команды. Но найти его можно только там, где команды не зависят друг от
    друга.</li>
  <li><strong>Процессор в основном ждёт память.</strong> 3,7 такта до L1 и
    318 тактов до оперативной памяти. Обмен идёт линиями по 64 байта, поэтому
    порядок обхода данных влияет на время сильнее, чем количество операций.</li>
  <li><strong>Общие изменяемые данные стоят дорого.</strong> Читать одно и то же
    могут все ядра сразу и бесплатно; каждая запись объявляется соседям и гасит
    их копии.</li>
  <li><strong>Память, которую видит программа, виртуальная.</strong> Адреса
    переводит MMU, страницами по 4 КиБ. Отсюда изоляция процессов и то, что
    заказать гигабайт дёшево, а тронуть его — нет.</li>
  <li><strong>В Python дорога не арифметика, а обслуживание.</strong> Проверка
    типов, новый объект на каждый результат, счётчики ссылок, разыменование
    указателей. Отсюда 49 тактов на итерацию вместо 2,4.</li>
  <li><strong>Ускорение — это уменьшение числа оборотов цикла
    интерпретатора.</strong> Функция вместо модуля, встроенная операция вместо
    цикла, массив вместо списка объектов. Потоки для счётной работы не помогают:
    байткод исполняет один поток за раз.</li>
</ol>

<p>
  Если унести из статьи одну картинку, пусть это будет лестница. Наверху —
  строка, которую вы написали. Под ней байткод, под ним цикл на C, под ним
  машинные команды, под ними такты и обращения к памяти. Каждый следующий этаж
  ничего не знает про предыдущий и честно делает свою работу. Когда программа
  «почему-то медленная», ответ почти всегда лежит не на том этаже, на котором вы
  её писали, — и теперь вы знаете, на какой спуститься.
</p>

<p class="tiny">
  Все числа в статье — результаты измерений на одной машине: виртуальный сервер
  с одним ядром Intel Xeon 2,1 ГГц, Linux 6.18, CPython 3.12.3, gcc 13.3.0,
  NumPy 2.4.4; L1d 48 КиБ, L2 2 МиБ, кэш-линия 64 байта, страница 4096 байт.
  Времена — лучшее из трёх–семи прогонов, такты пересчитаны из наносекунд по
  частоте 2,1 ГГц. Фрагменты машинного кода получены <code>objdump</code> из
  собранных здесь же бинарников и из <code>libpython3.12.so</code>. Часть 6 —
  единственная, где нет собственных измерений: показать перебрасывание кэш-линии
  между ядрами на одноядерной машине невозможно. На другом железе абсолютные
  значения будут другими, соотношения — близкими.
</p>
