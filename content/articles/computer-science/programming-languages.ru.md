<style>

  .term {
    background: #1B1D26;
    border-radius: 12px;
    padding: 0 0 12px;
    margin: 22px 0;
    overflow: hidden;
  }
  .term-title {
    padding: 8px 15px;
    background: #262935;
    color: #B9B4A6;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .06em;
    text-transform: uppercase;
  }
  .term pre {
    background: transparent;
    border: 0;
    border-radius: 0;
    margin: 0;
    padding: 12px 16px 0;
    color: #E6E3DA;
    font-size: 13.5px;
    line-height: 1.55;
  }
  .term .cmd { color: #9CC9FF; }
  .term .cmd::before { content: "$ "; color: #8FCB46; }
  .term .cm { color: #8E897C; }
  .term .hi { color: #E8C84A; }
  .term .ok { color: #8FCB46; }

  .sf {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    border: 1px solid #D9E4F0;
    border-radius: 10px;
    overflow: hidden;
    margin: 15px 0 2px;
    background: #F8FBFE;
  }
  .sf > div { padding: 9px 14px 11px; min-width: 0; }
  .sf > div:first-child { border-right: 1px solid #D9E4F0; }
  .sf span {
    display: block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #2A5E9B;
    margin-bottom: 5px;
  }
  .sf .sf-num { background: #F3FAF0; }
  .sf .sf-num span { color: #5A8C1C; }
  .sf .math-display { margin: 0; text-align: left; font-size: 15px; overflow-x: auto; }
  .sf .math-display .katex { font-size: 1em; }
  .sf code { font-size: 13.5px; background: #EEF3F9; }
  .sf p { margin: 0; font-size: 14.5px; line-height: 1.45; }
  @media (max-width: 760px) {
    .sf { grid-template-columns: 1fr; }
    .sf > div:first-child { border-right: 0; border-bottom: 1px solid #D9E4F0; }
    .term pre { font-size: 12px; }
  }
</style>



<p class="lead">
  Язык программирования — это не свод правил синтаксиса, а работающая
  программа-переводчик, написанная на языке этажом ниже. Вся история языков —
  это история того, как перевод постепенно перекладывали с человека на машину,
  ни разу не отменив при этом сами биты.
</p>

<p>
  В <a href="article.html?slug=operating-system">предыдущем параграфе</a> мы разобрали
  операционную систему и обнаружили, что она сама — программа. Значит, кто-то
  написал её на каком-то языке. А язык, на котором её написали, тоже кем-то
  написан. Эта статья про то, что лежит в основании такой пирамиды и почему
  каждый следующий этаж стоил ровно того, что за него заплатили.
</p>

<p>
  Мы пойдём снизу вверх и на каждом этаже будем решать одну и ту же задачу:
  посчитать факториал пяти. Сначала руками в байтах, потом мнемониками, потом
  одной строкой цикла. Все байты в статье настоящие: они получены ассемблером и
  компилятором на машине x86-64, все замеры сделаны там же.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Процессор исполняет числа</strong>
    <p>Достаточно помнить, что программа лежит в памяти рядом с данными, а процессор берёт оттуда команды по очереди.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>5! = 120 на семи этажах</strong>
    <p>Одна задача: от 21 байта машинного кода до пяти строк на Python — с замером, во сколько раз это дороже.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Чем ассемблер не компилятор</strong>
    <p>Вы сможете объяснить, почему интерпретатор медленнее в десятки раз, а не в тысячи, и что значит «язык написан на языке».</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные, байты, исходный текст</span>
  <span><i style="background:#C29E08"></i>перевод и то, что сейчас разбираем</span>
  <span><i style="background:#73B222"></i>результат</span>
  <span><i style="background:#C30B0A"></i>проблема и цена</span>
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не
  на всю схему сразу, а только на яркую часть. Положение объектов не меняется,
  поэтому от шага к шагу меняется смысл, а не карта перед глазами. Стрелки на
  клавиатуре работают, когда сцена в фокусе.
</div>

## Часть 1. Этаж нулевой: программа — это 21 байт

<p>
  Процессор не умеет читать. Он умеет брать из памяти число, узнавать в нём
  команду и выполнять её. <strong>Машинный код</strong> — это и есть
  последовательность таких чисел: никакого текста, никаких имён, только байты,
  каждый из которых что-то значит для этой конкретной модели процессора.
</p>

<p>
  Вот вся наша задача целиком. Программа кладёт единицу в один регистр, единицу
  в другой, умножает первый на второй, увеличивает счётчик, сравнивает его с
  пятёркой и, если не дошла, прыгает назад. Двадцать один байт.
</p>

<div class="term">
  <div class="term-title">Ассемблируем и смотрим, что получилось в памяти</div>
<pre><span class="cmd">gcc -c fact.s -o fact.o</span>
<span class="cmd">objdump -d fact.o</span>

fact.o:     file format elf64-x86-64

0000000000000000 &lt;fact_asm&gt;:
   0:	b8 01 00 00 00       	mov    $0x1,%eax
   5:	b9 01 00 00 00       	mov    $0x1,%ecx

000000000000000a &lt;loop_body&gt;:
   a:	0f af c1             	imul   %ecx,%eax
   d:	ff c1                	inc    %ecx
   f:	83 f9 05             	cmp    $0x5,%ecx
  12:	7e f6                	jle    a &lt;loop_body&gt;
  14:	c3                   	ret</pre>
</div>

<p>
  Левая колонка — адреса, средняя — те самые байты, правая — их расшифровка,
  которую <code>objdump</code> добавил для человека. В памяти есть только
  средняя колонка. Разберём её по частям.
</p>

<div class="stage" id="stageMc" tabindex="0">
  <div class="stage-figure">
<svg id="mc" viewBox="0 0 960 574" role="img" aria-label="Таблица из семи машинных инструкций факториала с разбором отдельных байтов на поля">
  <style>
    #mc { font-family: Helvetica, Arial, sans-serif; }
    #mc .row  { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #mc .mono { font-family: "Courier New", Courier, monospace; font-size: 15px; fill: #111111; }
    #mc .addr { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #5E5850; }
    #mc .lbl  { font-size: 15px; fill: #111111; }
    #mc .cap  { font-size: 13.5px; fill: #5E5850; }
    #mc .hd   { font-size: 12.5px; fill: #5E5850; letter-spacing: .06em; }
    #mc .box  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mc .boxy { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #mc .boxg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #mc .bit  { fill: #FFFFFF; stroke: #C29E08; stroke-width: 1.4; }
    #mc .sel  { fill: none; stroke: #C29E08; stroke-width: 2.4; }
    #mc .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <text x="52" y="36" class="hd">АДРЕС</text>
  <text x="115" y="36" class="hd">БАЙТЫ В ПАМЯТИ</text>
  <text x="325" y="36" class="hd">МНЕМОНИКА</text>
  <text x="525" y="36" class="hd">ЧТО ЭТО ЗНАЧИТ</text>

  <g data-key="tbl">
    <rect x="40" y="48"  width="880" height="40" rx="6" class="row"/>
    <rect x="40" y="92"  width="880" height="40" rx="6" class="row"/>
    <rect x="40" y="136" width="880" height="40" rx="6" class="row"/>
    <rect x="40" y="180" width="880" height="40" rx="6" class="row"/>
    <rect x="40" y="224" width="880" height="40" rx="6" class="row"/>
    <rect x="40" y="268" width="880" height="40" rx="6" class="row"/>
    <rect x="40" y="312" width="880" height="40" rx="6" class="row"/>
    <text x="52" y="74"  class="addr">00</text>
    <text x="52" y="118" class="addr">05</text>
    <text x="52" y="162" class="addr">0a</text>
    <text x="52" y="206" class="addr">0d</text>
    <text x="52" y="250" class="addr">0f</text>
    <text x="52" y="294" class="addr">12</text>
    <text x="52" y="338" class="addr">14</text>
    <text x="115" y="74"  class="mono">b8 01 00 00 00</text>
    <text x="115" y="118" class="mono">b9 01 00 00 00</text>
    <text x="115" y="162" class="mono">0f af c1</text>
    <text x="115" y="206" class="mono">ff c1</text>
    <text x="115" y="250" class="mono">83 f9 05</text>
    <text x="115" y="294" class="mono">7e f6</text>
    <text x="115" y="338" class="mono">c3</text>
  </g>

  <g data-key="mn">
    <text x="325" y="74"  class="mono">mov $1, %eax</text>
    <text x="325" y="118" class="mono">mov $1, %ecx</text>
    <text x="325" y="162" class="mono">imul %ecx, %eax</text>
    <text x="325" y="206" class="mono">inc %ecx</text>
    <text x="325" y="250" class="mono">cmp $5, %ecx</text>
    <text x="325" y="294" class="mono">jle 0x0a</text>
    <text x="325" y="338" class="mono">ret</text>
  </g>

  <g data-key="cm">
    <text x="525" y="74"  class="cap">результат f = 1</text>
    <text x="525" y="118" class="cap">счётчик i = 1</text>
    <text x="525" y="162" class="cap">f = f × i</text>
    <text x="525" y="206" class="cap">i = i + 1</text>
    <text x="525" y="250" class="cap">дошли ли до пяти</text>
    <text x="525" y="294" class="cap">если нет — назад к умножению</text>
    <text x="525" y="338" class="cap">вернуть управление; ответ лежит в eax</text>
  </g>

  <g data-key="hA" data-only="1"><rect x="38" y="46" width="884" height="88" rx="8" class="sel"/></g>
  <g data-key="hB" data-only="1"><rect x="38" y="134" width="884" height="44" rx="8" class="sel"/></g>
  <g data-key="hC" data-only="1"><rect x="38" y="178" width="884" height="88" rx="8" class="sel"/></g>
  <g data-key="hD" data-only="1"><rect x="38" y="266" width="884" height="44" rx="8" class="sel"/></g>

  <text x="40" y="382" class="hd">РАЗБОР ИНСТРУКЦИИ</text>

  <g data-key="dA" data-only="1">
    <rect x="60" y="394" width="88" height="46" rx="7" class="boxy"/>
    <text x="104" y="424" class="mono" text-anchor="middle">b8</text>
    <rect x="158" y="394" width="382" height="46" rx="7" class="box"/>
    <text x="349" y="424" class="mono" text-anchor="middle">01 00 00 00</text>
    <text x="104" y="462" class="cap" text-anchor="middle">опкод</text>
    <text x="349" y="462" class="cap" text-anchor="middle">четырёхбайтовое число</text>
    <text x="60" y="492" class="cap">b8 — «положить следующее число в регистр eax». Само число записано</text>
    <text x="60" y="512" class="cap">младшим байтом вперёд: 01 00 00 00 читается как единица, а не как 16 777 216.</text>
  </g>

  <g data-key="dA2" data-only="1">
    <rect x="60" y="394" width="88" height="46" rx="7" class="boxy"/>
    <text x="104" y="424" class="mono" text-anchor="middle">b9</text>
    <rect x="158" y="394" width="382" height="46" rx="7" class="box"/>
    <text x="349" y="424" class="mono" text-anchor="middle">01 00 00 00</text>
    <text x="104" y="462" class="cap" text-anchor="middle">опкод</text>
    <text x="349" y="462" class="cap" text-anchor="middle">то же самое число</text>
    <text x="60" y="492" class="cap">Вторая строка отличается от первой ровно одним битом в опкоде: b8 — это eax,</text>
    <text x="60" y="512" class="cap">b9 — ecx. Номер регистра вшит прямо в код команды, отдельного поля для него нет.</text>
  </g>

  <g data-key="dB" data-only="1">
    <rect x="60" y="394" width="130" height="46" rx="7" class="boxy"/>
    <text x="125" y="424" class="mono" text-anchor="middle">0f af</text>
    <rect x="200" y="394" width="88" height="46" rx="7" class="box"/>
    <text x="244" y="424" class="mono" text-anchor="middle">c1</text>
    <text x="125" y="462" class="cap" text-anchor="middle">«умножить»</text>
    <text x="244" y="462" class="cap" text-anchor="middle">кто с кем</text>
    <rect x="330" y="394" width="34" height="34" rx="4" class="bit"/><text x="347" y="417" class="mono" text-anchor="middle">1</text>
    <rect x="366" y="394" width="34" height="34" rx="4" class="bit"/><text x="383" y="417" class="mono" text-anchor="middle">1</text>
    <rect x="406" y="394" width="34" height="34" rx="4" class="bit"/><text x="423" y="417" class="mono" text-anchor="middle">0</text>
    <rect x="442" y="394" width="34" height="34" rx="4" class="bit"/><text x="459" y="417" class="mono" text-anchor="middle">0</text>
    <rect x="478" y="394" width="34" height="34" rx="4" class="bit"/><text x="495" y="417" class="mono" text-anchor="middle">0</text>
    <rect x="518" y="394" width="34" height="34" rx="4" class="bit"/><text x="535" y="417" class="mono" text-anchor="middle">0</text>
    <rect x="554" y="394" width="34" height="34" rx="4" class="bit"/><text x="571" y="417" class="mono" text-anchor="middle">0</text>
    <rect x="590" y="394" width="34" height="34" rx="4" class="bit"/><text x="607" y="417" class="mono" text-anchor="middle">1</text>
    <text x="365" y="446" class="cap" text-anchor="middle">mod</text>
    <text x="459" y="446" class="cap" text-anchor="middle">кому</text>
    <text x="571" y="446" class="cap" text-anchor="middle">кого</text>
    <text x="330" y="478" class="cap">11 — оба операнда лежат в регистрах, а не в памяти;</text>
    <text x="330" y="498" class="cap">000 — это eax, 001 — это ecx. Один байт c1 отвечает на вопрос,</text>
    <text x="330" y="518" class="cap">какие именно регистры перемножить.</text>
    <text x="60" y="498" class="cap">Опкод здесь</text>
    <text x="60" y="518" class="cap">двухбайтовый.</text>
  </g>

  <g data-key="dC" data-only="1">
    <rect x="60" y="394" width="130" height="46" rx="7" class="boxy"/>
    <text x="125" y="424" class="mono" text-anchor="middle">ff c1</text>
    <rect x="210" y="394" width="180" height="46" rx="7" class="boxy"/>
    <text x="300" y="424" class="mono" text-anchor="middle">83 f9 05</text>
    <text x="125" y="462" class="cap" text-anchor="middle">прибавить единицу к ecx</text>
    <text x="300" y="462" class="cap" text-anchor="middle">сравнить ecx с числом 5</text>
    <text x="60" y="494" class="cap">Обе команды короткие, потому что процессор держит для них отдельные компактные формы:</text>
    <text x="60" y="514" class="cap">прибавление единицы стоит два байта, а пятёрка в сравнении умещается в один байт вместо четырёх.</text>
  </g>

  <g data-key="dD" data-only="1">
    <rect x="60" y="394" width="88" height="46" rx="7" class="boxy"/>
    <text x="104" y="424" class="mono" text-anchor="middle">7e</text>
    <rect x="158" y="394" width="88" height="46" rx="7" class="box"/>
    <text x="202" y="424" class="mono" text-anchor="middle">f6</text>
    <text x="104" y="462" class="cap" text-anchor="middle">«прыгнуть, если ≤»</text>
    <text x="202" y="462" class="cap" text-anchor="middle">на сколько</text>
    <foreignObject x="300" y="392" width="600" height="50">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\text{0x14} + (-10) = \text{0x0a}"></div>
    </foreignObject>
    <text x="300" y="470" class="cap">f6 — это −10 в дополнительном коде.</text>
    <text x="60" y="500" class="cap">Адрес перехода не записан в команде: записано смещение от адреса следующей инструкции.</text>
    <text x="60" y="520" class="cap">Следующая начинается с 0x14, отступаем на десять байт назад и попадаем ровно на imul.</text>
  </g>

  <g data-key="sum" data-only="1">
    <rect x="60" y="394" width="840" height="58" rx="9" class="boxg"/>
    <text x="480" y="429" class="lbl" text-anchor="middle">21 байт в памяти · 23 инструкции исполняются · в eax остаётся 120</text>
    <text x="60" y="486" class="cap">Ни одного имени, ни одной буквы. Всё, что видит процессор, — эти двадцать один байт;</text>
    <text x="60" y="506" class="cap">мнемоники и комментарии дописал дизассемблер, чтобы их прочитал человек.</text>
  </g>

  <text x="40" y="562" class="legend">синий — данные и числа · жёлтый — код операции и разбираемое место · зелёный — результат</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="tbl" data-focus="tbl">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Вся программа — это столбик байтов</h4>
      <p>Слева адреса, справа содержимое. Процессор начинает с адреса 00, берёт
      первый байт и по нему понимает, сколько байтов ещё относится к этой же
      команде. Длина команд разная: от одного байта до пяти.</p>
      <div class="sf">
        <div><span>что происходит</span><p>Программа лежит в памяти как обычные данные — этим и отличается архитектура фон Неймана.</p></div>
        <div class="sf-num"><span>числа</span><p>7 команд, 21 байт, адреса от 0x00 до 0x14.</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="tbl hA dA" data-focus="dA">
      <div class="step-kicker">Шаг 2 · первая команда</div>
      <h4>Опкод плюс число</h4>
      <p>Первый байт b8 — это код операции: «положи следующее число в eax».
      Оставшиеся четыре байта — само число, записанное задом наперёд.
      Процессору не нужно знать, что мы назвали эту переменную «f»: у неё нет
      имени, есть регистр.</p>
      <div class="sf">
        <div><span>формула этого шага</span><p><code>b8</code> + четыре байта числа = 5 байт команды</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p><code>01 00 00 00</code> → 1 (младший байт первым)</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="tbl hA dA2" data-focus="dA2">
      <div class="step-kicker">Шаг 3 · вторая команда</div>
      <h4>Номер регистра спрятан внутри опкода</h4>
      <p>Вторая строка отличается от первой единственным байтом: b8 против b9.
      Разработчики процессора выделили под такие команды целый диапазон кодов,
      где номер регистра прибавляется к базовому значению. Отсюда и берётся
      привязка ассемблера к конкретной машине: у другого процессора этот
      диапазон другой.</p>
      <div class="sf">
        <div><span>формула этого шага</span><p>опкод = база <code>b8</code> + номер регистра</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p><code>b8</code> → eax (номер 0), <code>b9</code> → ecx (номер 1)</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="tbl hB dB" data-focus="dB">
      <div class="step-kicker">Шаг 4 · умножение</div>
      <h4>Один байт решает, что с чем перемножить</h4>
      <p>Команда умножения занимает три байта: два на опкод и один на описание
      операндов. Этот третий байт делится на три поля, и по ним процессор
      понимает, что перемножать нужно содержимое eax и ecx, а результат
      оставить в eax.</p>
      <div class="sf">
        <div><span>формула этого шага</span><p><code>c1</code> = 11 · 000 · 001 (режим, кому, кого)</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p>eax = eax × ecx, оба операнда — регистры</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="tbl hC dC" data-focus="dC">
      <div class="step-kicker">Шаг 5 · счётчик и сравнение</div>
      <h4>Частые операции сделаны короткими</h4>
      <p>Увеличить счётчик на единицу — два байта. Сравнить его с пятёркой —
      три, потому что маленькая константа помещается в один байт. Это не
      украшение: чем короче код, тем больше программы влезает в дорогую память,
      а в пятидесятые память была очень дорогой.</p>
      <div class="sf">
        <div><span>что происходит</span><p>i = i + 1, затем сравнение i с границей цикла</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p><code>ff c1</code> — 2 байта, <code>83 f9 05</code> — 3 байта</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="tbl hD dD" data-focus="dD">
      <div class="step-kicker">Шаг 6 · цикл</div>
      <h4>Прыжок записан не адресом, а расстоянием</h4>
      <p>Байт 7e означает «прыгнуть, если предыдущее сравнение дало меньше или
      равно». Второй байт f6 — это −10: столько нужно отступить назад от начала
      следующей команды. Именно поэтому программу можно загрузить в память по
      любому адресу — расстояния внутри неё не меняются.</p>
      <div class="sf">
        <div><span>формула этого шага</span><div class="math-display" data-tex="\text{адрес перехода} = \text{адрес следующей команды} + \text{смещение}"></div></div>
        <div class="sf-num"><span>подстановка чисел</span><div class="math-display" data-tex="\text{0x14} + (-10) = \text{0x0a}"></div></div>
      </div>
    </div>
    <div class="step-panel" data-on="tbl mn" data-focus="mn">
      <div class="step-kicker">Шаг 7 · перевод для человека</div>
      <h4>Те же байты, но словами</h4>
      <p>Средняя колонка — это уже язык ассемблера: каждой строке байтов
      соответствует ровно одна строка текста. Ничего нового она не добавляет и
      ничего не скрывает, она просто читается. Пока это перевод в одну сторону,
      выполненный дизассемблером.</p>
      <div class="sf">
        <div><span>что происходит</span><p>одна команда процессора ↔ одна строка мнемоники, без остатка</p></div>
        <div class="sf-num"><span>числа</span><p>7 строк текста против 21 байта кода</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="tbl mn cm sum" data-focus="sum">
      <div class="step-kicker">Шаг 8 · итог</div>
      <h4>Двадцать один байт и ни одного имени</h4>
      <p>Цикл выполнится пять раз, всего процессор исполнит 23 команды, и в eax
      останется 120. Программа работает, но написать её в таком виде можно
      только с таблицей опкодов под рукой, а изменить — только пересчитав все
      смещения заново.</p>
      <div class="sf">
        <div><span>что происходит</span><p>пять умножений: 1 → 1 → 2 → 6 → 24 → 120</p></div>
        <div class="sf-num"><span>числа</span><p>21 байт кода · 23 исполненные команды · ответ 120</p></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>
  Посмотрим, что происходит внутри цикла. Умножение и увеличение счётчика идут
  до сравнения, поэтому последний проход случается при <code>i = 5</code>, а
  выход — когда счётчик уже равен шести.
</p>

<table class="shape-table">
  <tr><th>Проход</th><th>eax до</th><th>ecx</th><th>после imul</th><th>после inc</th><th>ecx ≤ 5?</th></tr>
  <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>2</td><td>да, назад</td></tr>
  <tr><td>2</td><td>1</td><td>2</td><td>2</td><td>3</td><td>да, назад</td></tr>
  <tr><td>3</td><td>2</td><td>3</td><td>6</td><td>4</td><td>да, назад</td></tr>
  <tr><td>4</td><td>6</td><td>4</td><td>24</td><td>5</td><td>да, назад</td></tr>
  <tr><td>5</td><td>24</td><td>5</td><td>120</td><td>6</td><td>нет, выход</td></tr>
</table>

<p>
  До появления ассемблера такой столбик байтов набирали руками: тумблерами на
  панели, штекерами, перфокартами или перфолентой. Ошибка в одном бите ничем не
  отличалась от правильного бита — программа просто делала что-то другое.
  Хендбук сравнивает эту работу с работой часовщика, и сравнение точное: цена
  дрогнувшей руки такая же.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> в памяти нет ни имён, ни строк, ни
  меток — только числа, у которых есть длина и смысл. Всё, что появится дальше,
  будет способом не писать эти числа руками, но ни один этаж их не отменит.
</div>

---

## Часть 2. Мнемоники и первая программа-переводчик

<p>
  Идея, с которой начались все языки, звучит скучно: давайте вместо чисел
  писать буквы, а превращать буквы обратно в числа поручим самой машине.
  <strong>Язык ассемблера</strong> — это набор коротких мнемоник и символических
  обозначений, каждое из которых соответствует конкретной машинной команде.
  Не «более простой» язык, а тот же самый машинный код, записанный так, чтобы
  его можно было читать.
</p>

<p>
  У истоков стояли Кэтлин и Эндрю Бут. В 1947 году, во время поездки в
  Институт перспективных исследований в Принстоне, они написали два отчёта о
  своей машине ARC, и во втором из них — <em>Coding for A.R.C.</em> — Кэтлин
  Бут описала сокращённую символическую нотацию. Выглядела она так:
</p>

<pre><code>A 44   # сложить с числом в ячейке памяти 44</code></pre>

<p>
  Важная оговорка, которую легко пропустить: эта нотация была соглашением
  между людьми. Программу записывали символами на бумаге, а потом вручную
  переводили в машинный код. Заслуга Бутов в том, что они придумали
  <em>идею</em> — программу можно писать не в числах.
</p>

<p>
  Превратить идею в инструмент — отдельная работа. Её сделали в Кембридже:
  Морис Уилкс, Дэвид Уилер и Стэнли Гилл на машине EDSAC. Уилер написал
  <strong>initial orders</strong> — программу, которая сама читала символьную
  запись с ленты и превращала её в машинные слова. С этого момента переводчик
  перестал быть человеком.
</p>

<div class="callout-blue">
  <strong>Почему это два разных изобретения:</strong> нотация отвечает на
  вопрос «как записать», а ассемблер — на вопрос «кто переведёт». Первое без
  второго экономит внимание программиста, но не его время. Второе без первого
  вообще невозможно.
</div>

<p>
  Что именно делает программа-ассемблер, лучше всего видно на нашей задаче.
  В исходном тексте вместо адреса 0x0a стоит имя <code>loop_body</code>, и
  превратить его в число можно только тогда, когда известно, где эта строка
  окажется в памяти. Посмотрим на два прохода пошагово.
</p>

<div class="stage" id="stageAs" tabindex="0">
  <div class="stage-figure">
<svg id="as" viewBox="0 0 960 566" role="img" aria-label="Схема работы ассемблера: исходный текст, таблица символов и байты в памяти">
  <style>
    #as { font-family: Helvetica, Arial, sans-serif; }
    #as .panel { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1.2; }
    #as .mono  { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #as .addr  { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #C29E08; }
    #as .cap   { font-size: 13.5px; fill: #5E5850; }
    #as .capr  { font-size: 13.5px; fill: #C30B0A; }
    #as .hd    { font-size: 12.5px; fill: #5E5850; letter-spacing: .06em; }
    #as .box   { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #as .boxy  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #as .boxg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #as .boxr  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #as .cell  { fill: #FFFFFF; stroke: #C29E08; stroke-width: 1.4; }
    #as .edge  { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #as .lbl   { font-size: 15px; fill: #111111; }
    #as .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="as-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="src">
    <text x="40" y="60" class="hd">ЧТО НАПИСАЛ ЧЕЛОВЕК</text>
    <rect x="40" y="72" width="290" height="280" rx="10" class="panel"/>
    <text x="54" y="100" class="mono">    mov  $1, %eax</text>
    <text x="54" y="134" class="mono">    mov  $1, %ecx</text>
    <text x="54" y="168" class="mono">loop_body:</text>
    <text x="54" y="202" class="mono">    imul %ecx, %eax</text>
    <text x="54" y="236" class="mono">    inc  %ecx</text>
    <text x="54" y="270" class="mono">    cmp  $5, %ecx</text>
    <text x="54" y="304" class="mono">    jle  loop_body</text>
    <text x="54" y="338" class="mono">    ret</text>
  </g>

  <g data-key="addrs">
    <text x="318" y="100" class="addr" text-anchor="end">00</text>
    <text x="318" y="134" class="addr" text-anchor="end">05</text>
    <text x="318" y="168" class="addr" text-anchor="end">0a</text>
    <text x="318" y="202" class="addr" text-anchor="end">0a</text>
    <text x="318" y="236" class="addr" text-anchor="end">0d</text>
    <text x="318" y="270" class="addr" text-anchor="end">0f</text>
    <text x="318" y="304" class="addr" text-anchor="end">12</text>
    <text x="318" y="338" class="addr" text-anchor="end">14</text>
  </g>

  <g data-key="sym">
    <text x="380" y="150" class="hd">ТАБЛИЦА СИМВОЛОВ</text>
    <rect x="380" y="162" width="220" height="96" rx="10" class="boxy"/>
    <text x="396" y="188" class="cap">имя</text>
    <text x="512" y="188" class="cap">адрес</text>
    <text x="396" y="224" class="mono">loop_body</text>
    <rect x="505" y="204" width="80" height="28" rx="6" class="cell"/>
    <line x1="336" y1="212" x2="374" y2="212" class="edge" marker-end="url(#as-arw)"/>
  </g>
  <g data-key="symq" data-only="1"><text x="545" y="224" class="mono" text-anchor="middle">?</text></g>
  <g data-key="symval" data-only="1"><text x="545" y="224" class="mono" text-anchor="middle">0x0a</text></g>

  <g data-key="bytes">
    <text x="650" y="60" class="hd">ЧТО ПОЛОЖИЛ АССЕМБЛЕР</text>
    <rect x="650" y="72" width="270" height="280" rx="10" class="box"/>
    <line x1="606" y1="212" x2="644" y2="212" class="edge" marker-end="url(#as-arw)"/>
    <text x="666" y="100" class="mono">b8 01 00 00 00</text>
    <text x="666" y="134" class="mono">b9 01 00 00 00</text>
    <text x="666" y="202" class="mono">0f af c1</text>
    <text x="666" y="236" class="mono">ff c1</text>
    <text x="666" y="270" class="mono">83 f9 05</text>
    <text x="666" y="304" class="mono">7e f6</text>
    <text x="666" y="338" class="mono">c3</text>
  </g>

  <g data-key="jmpcalc">
    <rect x="40" y="384" width="560" height="64" rx="10" class="boxy"/>
    <foreignObject x="54" y="392" width="536" height="48">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\text{0x0a} - \text{0x14} = -10 \;\rightarrow\; \text{f6}"></div>
    </foreignObject>
    <text x="40" y="468" class="cap">адрес метки минус адрес следующей команды — и получилось смещение</text>
  </g>

  <g data-key="same" data-only="1">
    <rect x="40" y="486" width="880" height="42" rx="9" class="boxg"/>
    <text x="480" y="513" class="lbl" text-anchor="middle">на выходе те же 21 байт, что мы разбирали в части 1</text>
  </g>

  <g data-key="ins" data-only="1">
    <rect x="620" y="384" width="300" height="84" rx="10" class="boxr"/>
    <text x="634" y="410" class="capr">вставили три команды в начало —</text>
    <text x="634" y="430" class="capr">метка уехала с 0x0a на 0x0d,</text>
    <text x="634" y="450" class="capr">а смещение осталось прежним: f6</text>
  </g>

  <g data-key="dep" data-only="1">
    <rect x="620" y="384" width="300" height="84" rx="10" class="boxr"/>
    <text x="634" y="410" class="capr">та же программа для ARM:</text>
    <text x="634" y="432" class="mono">mov w0, #1</text>
    <text x="634" y="454" class="mono">mul w0, w0, w1</text>
  </g>

  <text x="40" y="552" class="legend">синий — машинный код · жёлтый — работа переводчика · зелёный — результат · красный — цена решения</text>
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
      <h4>Текст, в котором есть имя вместо адреса</h4>
      <p>Восемь строк. Семь из них станут командами, а одна — <code>loop_body:</code> —
      не превратится ни во что: это метка, пометка на полях. Она говорит
      «запомни, что вот это место называется так».</p>
      <div class="sf">
        <div><span>что происходит</span><p>человек пишет мнемоники и имена, а не опкоды и адреса</p></div>
        <div class="sf-num"><span>числа</span><p>8 строк текста, из них 7 команд и 1 метка</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src addrs sym symq" data-focus="addrs">
      <div class="step-kicker">Шаг 2 · первый проход</div>
      <h4>Считаем длины и раздаём адреса</h4>
      <p>Ассемблер идёт по тексту сверху вниз и ведёт счётчик адреса. Он ещё не
      выпускает байты, но уже знает длину каждой команды: <code>mov</code> с
      четырёхбайтовой константой — пять, <code>imul</code> — три, <code>ret</code> — один.
      Счётчик растёт на длину каждой встреченной команды.</p>
      <div class="sf">
        <div><span>формула этого шага</span><p>адрес следующей команды = адрес текущей + её длина</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p>0 + 5 = 5, 5 + 5 = 0x0a, 0x0a + 3 = 0x0d, дальше 0x0f, 0x12, 0x14</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src addrs sym symval" data-focus="sym">
      <div class="step-kicker">Шаг 3 · таблица символов</div>
      <h4>Метка получает число</h4>
      <p>Дойдя до строки с меткой, ассемблер записывает в отдельную таблицу
      пару «имя — текущее значение счётчика». Это и есть та самая работа,
      которую раньше делал человек с карандашом: он держал соответствие имён и
      адресов в голове или на полях листа.</p>
      <div class="sf">
        <div><span>что происходит</span><p>имя <code>loop_body</code> связывается со значением счётчика адреса</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p>loop_body → 0x0a</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src addrs sym symval bytes" data-focus="bytes">
      <div class="step-kicker">Шаг 4 · второй проход</div>
      <h4>Мнемоники превращаются в опкоды</h4>
      <p>Теперь ассемблер идёт по тексту второй раз и для каждой строки
      выбирает подходящую форму команды: какой опкод, сколько байтов занимает
      константа, какие номера у регистров. Строки без команд, вроде метки,
      просто пропускаются.</p>
      <div class="sf">
        <div><span>что происходит</span><p>одна строка текста → один набор байтов, ровно как в части 1</p></div>
        <div class="sf-num"><span>числа</span><p>7 команд превращаются в 21 байт</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src addrs sym symval bytes jmpcalc" data-focus="jmpcalc">
      <div class="step-kicker">Шаг 5 · ссылка назад</div>
      <h4>Зачем понадобилось два прохода</h4>
      <p>Строка <code>jle loop_body</code> ссылается на имя, а в байтах должно
      оказаться расстояние. Ассемблер берёт адрес из таблицы символов, вычитает
      адрес конца текущей команды и получает −10, то есть байт f6. Ссылку
      вперёд, на ещё не встреченную метку, одним проходом посчитать вообще
      нельзя — отсюда и разделение на два.</p>
      <div class="sf">
        <div><span>формула этого шага</span><div class="math-display" data-tex="\text{смещение} = \text{адрес метки} - \text{адрес следующей команды}"></div></div>
        <div class="sf-num"><span>подстановка чисел</span><div class="math-display" data-tex="\text{0x0a} - \text{0x14} = -10 = \text{f6}"></div></div>
      </div>
    </div>
    <div class="step-panel" data-on="src addrs sym symval bytes jmpcalc same" data-focus="same">
      <div class="step-kicker">Шаг 6 · сверка</div>
      <h4>Ничего нового в памяти не появилось</h4>
      <p>Байты справа побайтово совпадают с теми, что мы разбирали в первой
      части. Ассемблер не добавил ни абстракции, ни накладных расходов: он
      сделал ровно ту работу, которую иначе пришлось бы делать руками. Это его
      определяющее свойство — перевод один к одному.</p>
      <div class="sf">
        <div><span>что происходит</span><p>программа-переводчик заменила человека с таблицей опкодов</p></div>
        <div class="sf-num"><span>числа</span><p>21 байт на входе в процессор — столько же, сколько было</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src addrs sym symval bytes jmpcalc ins" data-focus="ins">
      <div class="step-kicker">Шаг 7 · что это дало</div>
      <h4>Правку больше не нужно пересчитывать</h4>
      <p>Вставим в начало три однобайтовые команды. Метка съезжает с 0x0a на
      0x0d, все адреса за ней тоже, но человек не правит ни одной цифры:
      ассемблер пересчитывает таблицу символов сам. А смещение в прыжке даже не
      меняется — расстояние внутри цикла осталось прежним.</p>
      <div class="sf">
        <div><span>что происходит</span><p>адреса стали относительными к тексту, а не вбитыми в код</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p>метка 0x0a → 0x0d, смещение f6 → f6</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src addrs sym symval bytes jmpcalc dep" data-focus="dep">
      <div class="step-kicker">Шаг 8 · чего это не дало</div>
      <h4>Мнемоники привязаны к одному процессору</h4>
      <p>У ассемблера ровно столько выразительности, сколько у машины под ним.
      Регистры называются иначе, набор команд другой, деления может не быть
      вовсе — и текст переписывается целиком. Программа для x86 не запустится
      на ARM, и наоборот: перевод один к одному работает только с одной
      конкретной таблицей опкодов.</p>
      <div class="sf">
        <div><span>что происходит</span><p>переносимости нет: язык описывает конкретное железо</p></div>
        <div class="sf-num"><span>числа</span><p>та же задача = другой текст под каждую архитектуру</p></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>
  Вставку из седьмого шага можно проверить: добавим три пустые команды и
  посмотрим, что скажет дизассемблер.
</p>

<div class="term">
  <div class="term-title">Три лишних байта в начале — и все адреса другие</div>
<pre><span class="cmd">objdump -d fact2.o</span>

0000000000000000 &lt;fact_asm&gt;:
   0:	b8 01 00 00 00       	mov    $0x1,%eax
   5:	90                   	nop
   6:	90                   	nop
   7:	90                   	nop
   8:	b9 01 00 00 00       	mov    $0x1,%ecx

<span class="hi">000000000000000d</span> &lt;loop_body&gt;:
   d:	0f af c1             	imul   %ecx,%eax
  10:	ff c1                	inc    %ecx
  12:	83 f9 05             	cmp    $0x5,%ecx
  15:	7e <span class="hi">f6</span>                	jle    d &lt;loop_body&gt;
  17:	c3                   	ret</pre>
</div>

<p>
  Метка переехала на 0x0d, адреса всех команд после неё сдвинулись, а смещение
  в прыжке осталось тем же f6 — потому что расстояние от конца прыжка до начала
  цикла не изменилось. Ни одной цифры руками мы не тронули.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> ассемблер — это перевод один к одному
  плюс бухгалтерия адресов. Он ничего не упрощает в самой машине, но снимает
  с человека ровно ту работу, в которой человек ошибается чаще всего, — счёт
  байтов.
</div>

---

## Часть 3. EDSAC: машина, которая загружает саму себя

<p>
  Тут возникает вопрос, который в 1949 году был совсем не риторическим. Если
  ассемблер — это программа, то её надо как-то загрузить в память. А
  загрузка — тоже программа. Первую программу в машину должен кто-то положить
  извне, и вот как эту задачу решили на EDSAC.
</p>

<p>
  EDSAC — электронная машина Кембриджского университета, запущенная 6 мая 1949
  года: около 3000 ламп, память на ртутных линиях задержки, ввод с
  пятидорожечной бумажной ленты, вывод на телетайп. Своей энергонезависимой
  памяти у неё не было: после выключения в ячейках не оставалось ничего.
</p>

<div class="stage" id="stageEd" tabindex="0">
  <div class="stage-figure">
<svg id="ed" viewBox="0 0 960 540" role="img" aria-label="Схема загрузки EDSAC: униселекторы, память из 512 слов и перфолента">
  <style>
    #ed { font-family: Helvetica, Arial, sans-serif; }
    #ed .panel { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1.2; }
    #ed .mono  { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #ed .cap   { font-size: 13.5px; fill: #5E5850; }
    #ed .capr  { font-size: 14px; fill: #C30B0A; }
    #ed .hd    { font-size: 12.5px; fill: #5E5850; letter-spacing: .06em; }
    #ed .lbl   { font-size: 15px; fill: #111111; }
    #ed .box   { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ed .boxy  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ed .boxg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ed .boxr  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #ed .sw    { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.2; }
    #ed .hole  { fill: #5E5850; }
    #ed .edge  { stroke: #5E5850; stroke-width: 1.8; fill: none; }
    #ed .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ed-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="uni">
    <text x="40" y="98" class="hd">УНИСЕЛЕКТОРЫ · 31 ПРИКАЗ</text>
    <rect x="40" y="110" width="200" height="196" rx="10" class="boxy"/>
    <rect x="52" y="130" width="24" height="18" rx="3" class="sw"/>
    <rect x="84" y="130" width="24" height="18" rx="3" class="sw"/>
    <rect x="116" y="130" width="24" height="18" rx="3" class="sw"/>
    <rect x="148" y="130" width="24" height="18" rx="3" class="sw"/>
    <rect x="180" y="130" width="24" height="18" rx="3" class="sw"/>
    <rect x="212" y="130" width="24" height="18" rx="3" class="sw"/>
    <rect x="52" y="160" width="24" height="18" rx="3" class="sw"/>
    <rect x="84" y="160" width="24" height="18" rx="3" class="sw"/>
    <rect x="116" y="160" width="24" height="18" rx="3" class="sw"/>
    <rect x="148" y="160" width="24" height="18" rx="3" class="sw"/>
    <rect x="180" y="160" width="24" height="18" rx="3" class="sw"/>
    <rect x="212" y="160" width="24" height="18" rx="3" class="sw"/>
    <rect x="52" y="190" width="24" height="18" rx="3" class="sw"/>
    <rect x="84" y="190" width="24" height="18" rx="3" class="sw"/>
    <rect x="116" y="190" width="24" height="18" rx="3" class="sw"/>
    <rect x="148" y="190" width="24" height="18" rx="3" class="sw"/>
    <rect x="180" y="190" width="24" height="18" rx="3" class="sw"/>
    <rect x="212" y="190" width="24" height="18" rx="3" class="sw"/>
    <rect x="52" y="220" width="24" height="18" rx="3" class="sw"/>
    <rect x="84" y="220" width="24" height="18" rx="3" class="sw"/>
    <rect x="116" y="220" width="24" height="18" rx="3" class="sw"/>
    <rect x="148" y="220" width="24" height="18" rx="3" class="sw"/>
    <rect x="180" y="220" width="24" height="18" rx="3" class="sw"/>
    <rect x="212" y="220" width="24" height="18" rx="3" class="sw"/>
    <rect x="52" y="250" width="24" height="18" rx="3" class="sw"/>
    <rect x="84" y="250" width="24" height="18" rx="3" class="sw"/>
    <rect x="116" y="250" width="24" height="18" rx="3" class="sw"/>
    <rect x="148" y="250" width="24" height="18" rx="3" class="sw"/>
    <rect x="180" y="250" width="24" height="18" rx="3" class="sw"/>
    <rect x="212" y="250" width="24" height="18" rx="3" class="sw"/>
    <rect x="52" y="280" width="24" height="18" rx="3" class="sw"/>
    <text x="140" y="326" class="cap" text-anchor="middle">провода вместо битов</text>
  </g>

  <g data-key="load">
    <line x1="248" y1="200" x2="360" y2="200" class="edge" marker-end="url(#ed-arw)"/>
    <text x="304" y="190" class="cap" text-anchor="middle">кнопка «пуск»</text>
  </g>

  <g data-key="mem">
    <text x="372" y="70" class="hd">ПАМЯТЬ EDSAC · 512 СЛОВ ПО 17 БИТ</text>
    <rect x="372" y="82" width="200" height="268" rx="10" class="panel"/>
    <text x="472" y="366" class="cap" text-anchor="middle">ртутные линии задержки</text>
  </g>

  <g data-key="zoneA">
    <rect x="384" y="96" width="176" height="62" rx="8" class="boxy"/>
    <text x="472" y="122" class="lbl" text-anchor="middle">ячейки 0–30</text>
    <text x="472" y="144" class="cap" text-anchor="middle">начальные приказы</text>
  </g>

  <g data-key="zoneB">
    <rect x="384" y="172" width="176" height="164" rx="8" class="box"/>
    <text x="472" y="200" class="lbl" text-anchor="middle">ячейки 31 и дальше</text>
    <text x="472" y="222" class="cap" text-anchor="middle">программа с ленты</text>
    <text x="472" y="258" class="mono" text-anchor="middle">A 44</text>
    <text x="472" y="282" class="mono" text-anchor="middle">↓</text>
    <text x="472" y="306" class="mono" text-anchor="middle">11100 0000101100 0</text>
  </g>

  <g data-key="tape">
    <text x="640" y="98" class="hd">ПЕРФОЛЕНТА · 5 ДОРОЖЕК</text>
    <rect x="640" y="110" width="290" height="56" rx="6" class="box"/>
    <circle cx="666" cy="124" r="3" class="hole"/>
    <circle cx="666" cy="138" r="3" class="hole"/>
    <circle cx="666" cy="152" r="3" class="hole"/>
    <circle cx="694" cy="124" r="3" class="hole"/>
    <circle cx="694" cy="152" r="3" class="hole"/>
    <circle cx="722" cy="138" r="3" class="hole"/>
    <circle cx="750" cy="124" r="3" class="hole"/>
    <circle cx="750" cy="138" r="3" class="hole"/>
    <text x="850" y="145" class="mono" text-anchor="middle">A 44</text>
    <text x="640" y="186" class="cap">на ленте не биты, а мнемоники</text>
    <text x="640" y="204" class="cap">и десятичные адреса</text>
    <line x1="636" y1="240" x2="580" y2="240" class="edge" marker-end="url(#ed-arw)"/>
  </g>

  <g data-key="asm">
    <rect x="640" y="216" width="290" height="52" rx="9" class="boxy"/>
    <text x="785" y="248" class="lbl" text-anchor="middle">начальные приказы переводят символ в слово</text>
  </g>

  <g data-key="run">
    <rect x="640" y="286" width="290" height="60" rx="9" class="boxg"/>
    <text x="785" y="312" class="lbl" text-anchor="middle">управление уходит на ячейку 31</text>
    <text x="785" y="334" class="cap" text-anchor="middle">программа считает</text>
  </g>

  <g data-key="prob" data-only="1">
    <rect x="40" y="392" width="880" height="76" rx="10" class="boxr"/>
    <text x="60" y="420" class="capr">Курица и яйцо: чтобы прочитать ленту, нужна программа чтения ленты.</text>
    <text x="60" y="446" class="capr">А положить её в память можно только... прочитав ленту.</text>
  </g>

  <g data-key="num" data-only="1">
    <rect x="40" y="392" width="280" height="76" rx="10" class="boxg"/>
    <text x="180" y="422" class="lbl" text-anchor="middle">1088 байт</text>
    <text x="180" y="448" class="cap" text-anchor="middle">вся память: 512 × 17 бит</text>
    <rect x="340" y="392" width="280" height="76" rx="10" class="boxg"/>
    <text x="480" y="422" class="lbl" text-anchor="middle">6⅔ символа в секунду</text>
    <text x="480" y="448" class="cap" text-anchor="middle">≈75 с на программу в 100 приказов</text>
    <rect x="640" y="392" width="280" height="76" rx="10" class="boxg"/>
    <text x="780" y="422" class="lbl" text-anchor="middle">≈650 приказов в секунду</text>
    <text x="780" y="448" class="cap" text-anchor="middle">наш факториал — около 35 мс</text>
  </g>

  <text x="40" y="516" class="legend">синий — данные и память · жёлтый — перевод · зелёный — результат · красный — тупик</text>
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
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Пустая память и лента рядом</h4>
      <p>512 ячеек по 17 бит, и в них ничего нет. Программа лежит на бумажной
      ленте, но лента — это просто дырки в бумаге: сама по себе она в память
      не попадёт.</p>
      <div class="sf">
        <div><span>что происходит</span><p>после включения в машине нет ни одной команды</p></div>
        <div class="sf-num"><span>числа</span><p>512 слов × 17 бит = 8704 бита = 1088 байт на всю машину</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="mem tape prob" data-focus="prob">
      <div class="step-kicker">Шаг 2 · тупик</div>
      <h4>Чтение ленты — это тоже программа</h4>
      <p>Лентопротяжка управляется командами: чтобы взять с ленты символ, надо
      выполнить приказ чтения. Значит, до первого чтения в памяти уже должны
      быть какие-то приказы. А взять их неоткуда — кроме как с ленты.</p>
      <div class="sf">
        <div><span>что происходит</span><p>замкнутый круг: программа нужна раньше, чем её можно загрузить</p></div>
        <div class="sf-num"><span>числа</span><p>0 команд в памяти на старте</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="mem tape uni" data-focus="uni">
      <div class="step-kicker">Шаг 3 · разрыв круга</div>
      <h4>Тридцать один приказ, зашитый в железо</h4>
      <p>Уилер записал минимальный загрузчик — <strong>initial orders</strong>,
      начальные приказы — и их зашили на униселекторах, шаговых искателях из
      телефонной техники. Это механическая память только для чтения: команды
      в ней заданы не битами в ячейках, а тем, как проложены провода.</p>
      <div class="sf">
        <div><span>что происходит</span><p>первая программа не загружается, а существует физически</p></div>
        <div class="sf-num"><span>числа</span><p>31 приказ — версия мая 1949 года; в сентябре её сменила версия из 41 приказа</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="mem uni load zoneA" data-focus="zoneA">
      <div class="step-kicker">Шаг 4 · старт</div>
      <h4>Кнопка «пуск» переносит их в память</h4>
      <p>При нажатии кнопки содержимое униселекторов копируется в ячейки с
      нулевой по тридцатую, и машина начинает выполнять первую из них.
      В современном компьютере ту же роль играет прошивка BIOS или UEFI: она
      живёт вне оперативной памяти и умеет ровно одно — загрузить остальное.</p>
      <div class="sf">
        <div><span>что происходит</span><p>содержимое механической ПЗУ переезжает в оперативную память</p></div>
        <div class="sf-num"><span>числа</span><p>ячейки 0–30 заняты, 481 слово свободно</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="mem uni load zoneA tape" data-focus="tape">
      <div class="step-kicker">Шаг 5 · лента</div>
      <h4>На ленте написано словами</h4>
      <p>А вот теперь начинается интересное. Программа пробита на ленте не в
      машинном коде: там буква приказа и десятичный адрес, вроде <code>A 44</code> —
      «прибавить содержимое ячейки 44». Ровно та нотация, которую придумали
      Буты, только читать её будет не человек.</p>
      <div class="sf">
        <div><span>что происходит</span><p>символическая запись хранится на ленте как есть</p></div>
        <div class="sf-num"><span>числа</span><p>лента на 5 дорожек, чтение 6⅔ символа в секунду</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="mem uni load zoneA tape asm zoneB" data-focus="asm">
      <div class="step-kicker">Шаг 6 · перевод на лету</div>
      <h4>Начальные приказы работают ассемблером</h4>
      <p>Каждый прочитанный символ начальные приказы превращают в 17-битное
      слово: букву — в код операции, цифры — в двоичный адрес. Готовое слово
      кладётся в очередную ячейку начиная с тридцать первой. Это и был первый
      в мире ассемблер — уместившийся в тридцать одну команду.</p>
      <div class="sf">
        <div><span>формула этого шага</span><p>слово = код буквы · 2¹² + адрес · 2 + бит длины</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p>«A 44» → одно 17-битное слово в ячейке 31</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="mem uni load zoneA tape asm zoneB run" data-focus="run">
      <div class="step-kicker">Шаг 7 · запуск</div>
      <h4>Загрузчик уступает место программе</h4>
      <p>Когда лента кончилась, последний приказ передаёт управление на ячейку
      31 — туда, где начинается только что собранная программа. Начальные
      приказы свою работу сделали и больше не нужны, хотя и остаются в памяти.</p>
      <div class="sf">
        <div><span>что происходит</span><p>загрузчик и ассемблер в одном лице отдают управление</p></div>
        <div class="sf-num"><span>числа</span><p>программа живёт с ячейки 31, ей доступен 481 слово</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="mem uni load zoneA tape asm zoneB run num" data-focus="num">
      <div class="step-kicker">Шаг 8 · масштаб</div>
      <h4>Цифры, которые стоит подержать в голове</h4>
      <p>Вся память EDSAC — 1088 байт, меньше, чем занимает эта фраза в файле
      статьи. Программа в сто приказов грузилась с ленты около семидесяти пяти
      секунд. Машина исполняла порядка 650 приказов в секунду, так что наш
      факториал из 23 команд занял бы примерно 35 миллисекунд.</p>
      <div class="sf">
        <div><span>что происходит</span><p>каждая команда стоила дорого — отсюда и экономия на всём</p></div>
        <div class="sf-num"><span>числа</span><p>1088 байт памяти · 6⅔ символа/с ввода · ≈650 приказов/с</p></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout-red">
  <strong>Уточнение к источнику:</strong> хендбук пишет, что оператор набирал
  начальные приказы переключателями на панели, по биту за раз. На самом деле их
  не набирали каждый раз заново: 31 приказ был жёстко зашит на униселекторах и
  копировался в память нажатием кнопки. Тумблерами на панели на EDSAC задавали
  отдельные значения, а не загружали весь начальный код.
</div>

<p>
  Гилл вместе с Уилксом и Уилером написал книгу <em>The Preparation of Programs
  for an Electronic Digital Computer</em> (1951) — первое подробное руководство
  по тому, что даёт программисту ассемблер и как устроены библиотеки
  подпрограмм. Для многих она стала проводником из мира машинного кода в мир
  символических языков.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> первая программа в истории каждой
  машины не может быть загружена обычным способом — её кладут снаружи, руками
  или проводами. Всё остальное программное обеспечение вырастает уже из неё,
  и эта конструкция никуда не делась: сегодня её зовут прошивкой.
</div>

---

## Часть 4. Три первых высокоуровневых языка

<p>
  Ассемблер снял счёт байтов, но оставил всё остальное. Программист по-прежнему
  думал регистрами, а не формулами, и переезд на другую машину означал
  переписывание. В сороковые и пятидесятые появилось три попытки подняться на
  этаж выше. Одна не дожила до реализации, вторая оказалась слишком дорогой,
  третья работает до сих пор.
</p>

### Plankalkül: язык, опередивший машины

<p>
  Конрад Цузе придумал <strong>Plankalkül</strong> между 1942 и 1945 годом —
  первый высокоуровневый язык в истории. В нём уже были массивы, составные
  типы, подпрограммы, условия и присваивание через стрелку. Проблема была не в
  языке: Цузе работал в изоляции сначала в нацистской Германии, потом в
  послевоенной разрухе, его собственная машина Z3 не могла исполнять такие
  программы, а академического сообщества, которому это было бы интересно,
  вокруг не было.
</p>

<p>
  Статью о языке Цузе опубликовал в 1948 году, но она не вызвала отклика.
  Полностью рукопись напечатали только в 1972-м, первый компилятор появился в
  диссертации Йоахима Хомана в 1975 году, а работающие реализации — в 1998 и
  2000 годах в Свободном университете Берлина. Пятьдесят лет между идеей и
  запуском.
</p>

<div class="callout-blue">
  <strong>Язык и инструмент — разные вещи.</strong> Plankalkül был первым
  языком, но не первым средством программирования: без транслятора запись
  остаётся нотацией на бумаге. Ровно поэтому история языков — это в первую
  очередь история переводчиков, а не синтаксисов.
</div>

### Short Code: перевод переехал внутрь машины

<p>
  <strong>Short Code</strong> предложил Джон Моукли в 1949 году, реализовал
  Уильям Шмитт: сначала для BINAC, где версию так и не отладили, а затем для
  UNIVAC I, где язык заработал в 1950-м. Идея была новой: программист пишет
  математическое выражение, а во время выполнения специальная программа читает
  его и вызывает нужные подпрограммы. Это первый <strong>интерпретатор</strong>.
</p>

<p>
  Правда, «пишет выражение» — это оптимизм. Записать формулу нужно было
  двухсимвольными кодами и самому упаковать их в двенадцатибайтовые слова
  машины. Посмотрим на настоящий пример из документации того времени.
</p>

<div class="stage" id="stageSc" tabindex="0">
  <div class="stage-figure">
<svg id="sc" viewBox="0 0 960 540" role="img" aria-label="Преобразование формулы в коды Short Code и упаковка в двенадцатибайтовые слова">
  <style>
    #sc { font-family: Helvetica, Arial, sans-serif; }
    #sc .cell  { fill: #FFFFFF; stroke: #C7C2B6; stroke-width: 1.2; }
    #sc .cellb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; }
    #sc .celly { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.5; }
    #sc .cellg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.5; }
    #sc .dash  { fill: #FFFFFF; stroke: #C30B0A; stroke-width: 1.4; stroke-dasharray: 5 4; }
    #sc .mono  { font-family: "Courier New", Courier, monospace; font-size: 15px; fill: #111111; }
    #sc .cap   { font-size: 13.5px; fill: #5E5850; }
    #sc .capr  { font-size: 14px; fill: #C30B0A; }
    #sc .hd    { font-size: 12.5px; fill: #5E5850; letter-spacing: .06em; }
    #sc .lbl   { font-size: 15px; fill: #111111; }
    #sc .boxy  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #sc .boxb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #sc .boxr  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #sc .edge  { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #sc .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="sc-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="expr">
    <text x="40" y="76" class="hd">ЧТО ХОТЕЛ ПОСЧИТАТЬ ИНЖЕНЕР</text>
    <rect x="76"  y="86" width="68" height="40" rx="6" class="cell"/><text x="110" y="113" class="mono" text-anchor="middle">a</text>
    <rect x="150" y="86" width="68" height="40" rx="6" class="cell"/><text x="184" y="113" class="mono" text-anchor="middle">=</text>
    <rect x="224" y="86" width="68" height="40" rx="6" class="cell"/><text x="258" y="113" class="mono" text-anchor="middle">(</text>
    <rect x="298" y="86" width="68" height="40" rx="6" class="cell"/><text x="332" y="113" class="mono" text-anchor="middle">b</text>
    <rect x="372" y="86" width="68" height="40" rx="6" class="cell"/><text x="406" y="113" class="mono" text-anchor="middle">+</text>
    <rect x="446" y="86" width="68" height="40" rx="6" class="cell"/><text x="480" y="113" class="mono" text-anchor="middle">c</text>
    <rect x="520" y="86" width="68" height="40" rx="6" class="cell"/><text x="554" y="113" class="mono" text-anchor="middle">)</text>
    <rect x="594" y="86" width="68" height="40" rx="6" class="cell"/><text x="628" y="113" class="mono" text-anchor="middle">/</text>
    <rect x="668" y="86" width="68" height="40" rx="6" class="cell"/><text x="702" y="113" class="mono" text-anchor="middle">b</text>
    <rect x="742" y="86" width="68" height="40" rx="6" class="cell"/><text x="776" y="113" class="mono" text-anchor="middle">*</text>
    <rect x="816" y="86" width="68" height="40" rx="6" class="cell"/><text x="850" y="113" class="mono" text-anchor="middle">c</text>
  </g>

  <g data-key="vars">
    <text x="40" y="146" class="hd">ЗАМЕНА ПЕРЕМЕННЫХ</text>
    <rect x="76"  y="156" width="68" height="40" rx="6" class="cellb"/><text x="110" y="183" class="mono" text-anchor="middle">X3</text>
    <rect x="150" y="156" width="68" height="40" rx="6" class="cell"/><text x="184" y="183" class="mono" text-anchor="middle">=</text>
    <rect x="224" y="156" width="68" height="40" rx="6" class="cell"/><text x="258" y="183" class="mono" text-anchor="middle">(</text>
    <rect x="298" y="156" width="68" height="40" rx="6" class="cellb"/><text x="332" y="183" class="mono" text-anchor="middle">X1</text>
    <rect x="372" y="156" width="68" height="40" rx="6" class="cell"/><text x="406" y="183" class="mono" text-anchor="middle">+</text>
    <rect x="446" y="156" width="68" height="40" rx="6" class="cellb"/><text x="480" y="183" class="mono" text-anchor="middle">Y1</text>
    <rect x="520" y="156" width="68" height="40" rx="6" class="cell"/><text x="554" y="183" class="mono" text-anchor="middle">)</text>
    <rect x="594" y="156" width="68" height="40" rx="6" class="cell"/><text x="628" y="183" class="mono" text-anchor="middle">/</text>
    <rect x="668" y="156" width="68" height="40" rx="6" class="cellb"/><text x="702" y="183" class="mono" text-anchor="middle">X1</text>
    <rect x="742" y="156" width="68" height="40" rx="6" class="cell"/><text x="776" y="183" class="mono" text-anchor="middle">*</text>
    <rect x="816" y="156" width="68" height="40" rx="6" class="cellb"/><text x="850" y="183" class="mono" text-anchor="middle">Y1</text>
  </g>

  <g data-key="codes">
    <text x="40" y="216" class="hd">ЗАМЕНА ОПЕРАТОРОВ И СКОБОК</text>
    <rect x="76"  y="226" width="68" height="40" rx="6" class="cellb"/><text x="110" y="253" class="mono" text-anchor="middle">X3</text>
    <rect x="150" y="226" width="68" height="40" rx="6" class="celly"/><text x="184" y="253" class="mono" text-anchor="middle">03</text>
    <rect x="224" y="226" width="68" height="40" rx="6" class="celly"/><text x="258" y="253" class="mono" text-anchor="middle">09</text>
    <rect x="298" y="226" width="68" height="40" rx="6" class="cellb"/><text x="332" y="253" class="mono" text-anchor="middle">X1</text>
    <rect x="372" y="226" width="68" height="40" rx="6" class="celly"/><text x="406" y="253" class="mono" text-anchor="middle">07</text>
    <rect x="446" y="226" width="68" height="40" rx="6" class="cellb"/><text x="480" y="253" class="mono" text-anchor="middle">Y1</text>
    <rect x="520" y="226" width="68" height="40" rx="6" class="celly"/><text x="554" y="253" class="mono" text-anchor="middle">02</text>
    <rect x="594" y="226" width="68" height="40" rx="6" class="celly"/><text x="628" y="253" class="mono" text-anchor="middle">04</text>
    <rect x="668" y="226" width="68" height="40" rx="6" class="cellb"/><text x="702" y="253" class="mono" text-anchor="middle">X1</text>
    <rect x="816" y="226" width="68" height="40" rx="6" class="cellb"/><text x="850" y="253" class="mono" text-anchor="middle">Y1</text>
    <text x="40" y="288" class="cap">03 — знак равенства · 09 — открывающая скобка · 02 — закрывающая · 07 — плюс · 04 — деление</text>
  </g>

  <g data-key="mult" data-only="1">
    <rect x="742" y="226" width="68" height="40" rx="6" class="dash"/>
    <text x="776" y="253" class="mono" text-anchor="middle" fill="#C30B0A">—</text>
    <text x="776" y="310" class="capr" text-anchor="middle">умножение кода не имеет:</text>
    <text x="776" y="330" class="capr" text-anchor="middle">оно записывается соседством</text>
  </g>

  <g data-key="words">
    <text x="40" y="366" class="hd">УПАКОВКА В СЛОВА ПО 12 БАЙТ</text>
    <rect x="76"  y="376" width="60" height="40" rx="6" class="cellg"/><text x="106" y="403" class="mono" text-anchor="middle">07</text>
    <rect x="142" y="376" width="60" height="40" rx="6" class="cellg"/><text x="172" y="403" class="mono" text-anchor="middle">Y1</text>
    <rect x="208" y="376" width="60" height="40" rx="6" class="cellg"/><text x="238" y="403" class="mono" text-anchor="middle">02</text>
    <rect x="274" y="376" width="60" height="40" rx="6" class="cellg"/><text x="304" y="403" class="mono" text-anchor="middle">04</text>
    <rect x="340" y="376" width="60" height="40" rx="6" class="cellg"/><text x="370" y="403" class="mono" text-anchor="middle">X1</text>
    <rect x="406" y="376" width="60" height="40" rx="6" class="cellg"/><text x="436" y="403" class="mono" text-anchor="middle">Y1</text>
    <rect x="496" y="376" width="60" height="40" rx="6" class="celly"/><text x="526" y="403" class="mono" text-anchor="middle">00</text>
    <rect x="562" y="376" width="60" height="40" rx="6" class="celly"/><text x="592" y="403" class="mono" text-anchor="middle">00</text>
    <rect x="628" y="376" width="60" height="40" rx="6" class="cellg"/><text x="658" y="403" class="mono" text-anchor="middle">X3</text>
    <rect x="694" y="376" width="60" height="40" rx="6" class="cellg"/><text x="724" y="403" class="mono" text-anchor="middle">03</text>
    <rect x="760" y="376" width="60" height="40" rx="6" class="cellg"/><text x="790" y="403" class="mono" text-anchor="middle">09</text>
    <rect x="826" y="376" width="60" height="40" rx="6" class="cellg"/><text x="856" y="403" class="mono" text-anchor="middle">X1</text>
    <text x="271" y="438" class="cap" text-anchor="middle">одно слово машины</text>
    <text x="691" y="438" class="cap" text-anchor="middle">второе слово, добитое нулями</text>
  </g>

  <g data-key="count" data-only="1">
    <rect x="40" y="300" width="660" height="46" rx="9" class="boxy"/>
    <text x="60" y="330" class="lbl">10 кодов × 2 байта = 20 байт, а слова по 12 → нужно два слова и 4 байта добивки</text>
  </g>

  <g data-key="interp" data-only="1">
    <rect x="40" y="452" width="420" height="52" rx="9" class="boxb"/>
    <text x="250" y="484" class="lbl" text-anchor="middle">интерпретатор берёт код 07 и прыгает в подпрограмму</text>
    <line x1="466" y1="478" x2="516" y2="478" class="edge" marker-end="url(#sc-arw)"/>
    <rect x="522" y="452" width="398" height="52" rx="9" class="boxy"/>
    <text x="721" y="484" class="lbl" text-anchor="middle">«сложить два числа» — и так на каждом коде, каждый раз</text>
  </g>

  <g data-key="cost" data-only="1">
    <rect x="40" y="452" width="880" height="52" rx="9" class="boxr"/>
    <text x="480" y="484" class="lbl" text-anchor="middle">разбор во время работы стоил примерно 50-кратного замедления против машинного кода</text>
  </g>

  <text x="40" y="528" class="legend">синий — данные · жёлтый — служебные коды и перевод · зелёный — упакованный результат · красный — цена</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="expr" data-focus="expr">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Обычная формула</h4>
      <p>Инженеру нужно посчитать выражение: сумму b и c поделить на b и
      умножить на c. На ассемблере это десяток команд с ручной раскладкой по
      регистрам. Short Code обещал записать это почти как в тетради.</p>
      <div class="sf">
        <div><span>что происходит</span><p>исходная запись задачи — та, что понятна человеку</p></div>
        <div class="sf-num"><span>числа</span><p>11 элементов: три переменные, пять операторов, две скобки</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="expr vars" data-focus="vars">
      <div class="step-kicker">Шаг 2 · переменные</div>
      <h4>Имена превращаются в ячейки</h4>
      <p>Переменные получают двухсимвольные обозначения: a становится X3, b — X1,
      c — Y1. Никакой таблицы имён, как в ассемблере, здесь нет — соответствие
      держит в голове сам программист.</p>
      <div class="sf">
        <div><span>что происходит</span><p>каждое имя заменяется на код из двух символов</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p>a → X3, b → X1, c → Y1</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="expr vars codes" data-focus="codes">
      <div class="step-kicker">Шаг 3 · операторы</div>
      <h4>Знаки тоже становятся числами</h4>
      <p>У каждого оператора свой двузначный код: 03 — присваивание, 09 и 02 —
      скобки, 07 — сложение, 04 — деление. Список кодов был частью языка, и его
      требовалось помнить или держать рядом на карточке.</p>
      <div class="sf">
        <div><span>что происходит</span><p>операторы заменяются на числовые коды из таблицы языка</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p>= → 03, ( → 09, ) → 02, + → 07, / → 04</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="expr vars codes mult" data-focus="mult">
      <div class="step-kicker">Шаг 4 · экономия</div>
      <h4>Умножение не занимает места</h4>
      <p>Для умножения кода не предусмотрели вовсе: два кода, стоящие рядом,
      уже означают произведение. В языке, где каждый символ стоит памяти, это
      разумная экономия, но и первый признак того, что запись делалась под
      машину, а не под человека.</p>
      <div class="sf">
        <div><span>что происходит</span><p>звёздочка исчезает, остаётся соседство кодов</p></div>
        <div class="sf-num"><span>числа</span><p>было 11 элементов, осталось 10 кодов</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="expr vars codes count" data-focus="count">
      <div class="step-kicker">Шаг 5 · арифметика упаковки</div>
      <h4>Строка должна лечь в слова машины</h4>
      <p>BINAC и UNIVAC работали словами по двенадцать байт. Десять кодов по два
      символа — это двадцать байт, в одно слово не помещается, в два помещается
      с запасом в четыре байта. Эти четыре байта нужно заполнить нулями, и
      делал это программист вручную.</p>
      <div class="sf">
        <div><span>формула этого шага</span><div class="math-display" data-tex="\lceil 10 \cdot 2 / 12 \rceil = 2 \text{ слова}"></div></div>
        <div class="sf-num"><span>подстановка чисел</span><p>20 байт кодов + 4 байта нулей = 24 байта = 2 слова</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="expr vars codes words" data-focus="words">
      <div class="step-kicker">Шаг 6 · результат</div>
      <h4>Вот что кладётся в память</h4>
      <p>Слова заполняются с конца выражения, поэтому нули добивки оказываются
      в начале второго слова. Именно эти двадцать четыре байта и есть
      «программа на Short Code»: до машинного кода они не доведены и не будут.</p>
      <div class="sf">
        <div><span>что происходит</span><p>формула превратилась в два слова кодов, а не в команды процессора</p></div>
        <div class="sf-num"><span>числа</span><p>2 слова × 12 байт; 4 байта из 24 — пустая добивка</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="expr vars codes words interp" data-focus="interp">
      <div class="step-kicker">Шаг 7 · во время работы</div>
      <h4>Перевод происходит каждый раз заново</h4>
      <p>Когда программа запускается, в памяти сидит интерпретатор: он берёт
      очередной код, определяет, что это за операция, и вызывает подпрограмму.
      Разбор идёт не один раз перед запуском, а на каждой встреченной операции,
      сколько бы раз она ни повторялась.</p>
      <div class="sf">
        <div><span>что происходит</span><p>переводчик работает во время выполнения, а не до него</p></div>
        <div class="sf-num"><span>числа</span><p>1 код = 1 разбор + 1 вызов подпрограммы, каждый проход цикла</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="expr vars codes words cost" data-focus="cost">
      <div class="step-kicker">Шаг 8 · цена</div>
      <h4>Удобство обошлось в полсотни раз</h4>
      <p>Оценки того времени дают около пятидесятикратного замедления по
      сравнению с машинным кодом. На машине, где и так считали медленно, это
      было слишком дорого, и Short Code остался интересным экспериментом. Но
      сама идея — переводчик, живущий внутри машины, — никуда не делась.</p>
      <div class="sf">
        <div><span>что происходит</span><p>язык понятнее, программа медленнее — обмен, который обсуждают до сих пор</p></div>
        <div class="sf-num"><span>числа</span><p>≈50× медленнее машинного кода</p></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

### Fortran: перевод до запуска

<p>
  Третью попытку сделала IBM под руководством Джона Бэкуса. В 1957 году вышел
  компилятор <strong>Fortran</strong>, и он делал ровно то, чего не делал
  Short Code: переводил программу в машинный код <em>до</em> запуска, целиком.
  Никакого разбора во время работы не оставалось — процессор исполнял обычные
  команды.
</p>

<pre><code>      INTEGER N, I, F
      READ(*,*) N
      F = 1
      DO 10 I = 1, N
        F = F * I
   10 CONTINUE
      WRITE(*,*) F
      END</code></pre>

<p>
  Ключевым аргументом была не читаемость, а скорость: код, который порождал
  компилятор, был близок по эффективности к написанному руками ассемблерному,
  и небольшая просадка окупалась экономией недель работы. К началу 1960-х для
  разных ЭВМ существовало больше сорока компиляторов Fortran — одна и та же
  программа стала переносимой. Сегодня на нём считают линейную алгебру,
  моделируют физические процессы, проектируют в аэрокосмической отрасли и
  энергетике.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> победил не самый выразительный язык, а
  тот, у которого перевод происходил один раз и заранее. Момент перевода — до
  запуска или во время — оказался важнее любых различий в синтаксисе, и
  следующая часть про то, почему.
</div>

---

## Часть 5. Компилятор против интерпретатора

<p>
  Хендбук объясняет разницу через Васю и Петю: Вася десять минут готовился и
  прочитал стих с выражением, Петю вытолкнули на сцену с листком. Вася —
  компилятор, Петя — интерпретатор. Аналогия хорошая, но она не отвечает на
  вопрос «во сколько раз». Давайте измерим.
</p>

<p>
  Возьмём один и тот же цикл: десять миллионов раз умножить накопленное
  значение на счётчик и взять остаток. Напишем его на C и на Python, соберём
  первый компилятором, запустим второй интерпретатором и сравним.
</p>

<div class="term">
  <div class="term-title">Один и тот же цикл, два способа его исполнить</div>
<pre><span class="cm"># C, скомпилировано gcc -O2</span>
<span class="cmd">./benchc</span>
C  best=0.0404 s   f=682498929   ns/iter=4.042

<span class="cm"># Python 3.12, тот же цикл внутри функции</span>
<span class="cmd">python3 bench2.py</span>
PY best=0.5254 s  f=<span class="ok">682498929</span>  ns/iter=52.5  ns/bytecode=5.84</pre>
</div>

<p>
  Ответ совпал до последней цифры, время — нет. Разберём, куда уходит разница.
</p>

<div class="stage" id="stageCi" tabindex="0">
  <div class="stage-figure">
<svg id="ci" viewBox="0 0 960 600" role="img" aria-label="Две дорожки исполнения одного цикла: компиляция до запуска и интерпретация во время работы">
  <style>
    #ci { font-family: Helvetica, Arial, sans-serif; }
    #ci .box   { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ci .boxy  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ci .boxg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ci .boxr  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #ci .lbl   { font-size: 15px; fill: #111111; }
    #ci .lbb   { font-size: 16px; fill: #111111; font-weight: 700; }
    #ci .cap   { font-size: 13px; fill: #5E5850; }
    #ci .mono  { font-family: "Courier New", Courier, monospace; font-size: 13.5px; fill: #111111; }
    #ci .hd    { font-size: 12.5px; fill: #5E5850; letter-spacing: .06em; }
    #ci .edge  { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #ci .barc  { fill: #73B222; }
    #ci .barp  { fill: #C29E08; }
    #ci .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ci-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="src">
    <rect x="40" y="205" width="150" height="100" rx="10" class="box"/>
    <text x="115" y="238" class="lbb" text-anchor="middle">один цикл</text>
    <text x="115" y="262" class="cap" text-anchor="middle">f = f · i mod m</text>
    <text x="115" y="286" class="cap" text-anchor="middle">10 000 000 раз</text>
  </g>

  <g data-key="comp">
    <path d="M 196 235 C 226 235, 226 145, 246 142" class="edge" marker-end="url(#ci-arw)"/>
    <text x="250" y="86" class="hd">ДОРОЖКА КОМПИЛЯТОРА</text>
    <rect x="250" y="104" width="170" height="72" rx="10" class="boxy"/>
    <text x="335" y="136" class="lbl" text-anchor="middle">компилятор</text>
    <text x="335" y="158" class="cap" text-anchor="middle">работает один раз, до запуска</text>
  </g>

  <g data-key="mcode">
    <line x1="424" y1="140" x2="446" y2="140" class="edge" marker-end="url(#ci-arw)"/>
    <rect x="450" y="104" width="210" height="72" rx="10" class="box"/>
    <text x="555" y="136" class="lbl" text-anchor="middle">11 машинных команд</text>
    <text x="555" y="158" class="cap" text-anchor="middle">тело цикла — 43 байта</text>
  </g>

  <g data-key="cpu1">
    <line x1="664" y1="140" x2="686" y2="140" class="edge" marker-end="url(#ci-arw)"/>
    <rect x="690" y="104" width="230" height="72" rx="10" class="boxg"/>
    <text x="805" y="136" class="lbl" text-anchor="middle">процессор исполняет их</text>
    <text x="805" y="158" class="cap" text-anchor="middle">и больше ничего</text>
  </g>

  <g data-key="trick" data-only="1">
    <rect x="450" y="190" width="470" height="52" rx="9" class="boxy"/>
    <text x="464" y="212" class="cap">деления в машинном коде нет: компилятор заменил остаток</text>
    <text x="464" y="232" class="mono">umul 0x89705f3112a28fe5 → shr → imul → sub</text>
  </g>

  <g data-key="bcode">
    <path d="M 196 275 C 226 275, 226 375, 246 378" class="edge" marker-end="url(#ci-arw)"/>
    <text x="250" y="326" class="hd">ДОРОЖКА ИНТЕРПРЕТАТОРА</text>
    <rect x="250" y="344" width="170" height="72" rx="10" class="boxy"/>
    <text x="335" y="376" class="lbl" text-anchor="middle">разбор в байткод</text>
    <text x="335" y="398" class="cap" text-anchor="middle">один раз, при импорте</text>
  </g>

  <g data-key="bc">
    <line x1="424" y1="380" x2="446" y2="380" class="edge" marker-end="url(#ci-arw)"/>
    <rect x="450" y="344" width="210" height="72" rx="10" class="box"/>
    <text x="555" y="376" class="lbl" text-anchor="middle">9 байткод-операций</text>
    <text x="555" y="398" class="cap" text-anchor="middle">на каждую итерацию</text>
  </g>

  <g data-key="eval">
    <line x1="664" y1="380" x2="686" y2="380" class="edge" marker-end="url(#ci-arw)"/>
    <rect x="690" y="344" width="230" height="72" rx="10" class="boxy"/>
    <text x="805" y="372" class="lbl" text-anchor="middle">цикл интерпретатора</text>
    <text x="805" y="394" class="cap" text-anchor="middle">56 311 байт машинного кода</text>
  </g>

  <g data-key="evloop" data-only="1">
    <path d="M 800 420 C 800 450, 560 450, 558 422" class="edge" marker-end="url(#ci-arw)"/>
    <text x="679" y="456" class="cap" text-anchor="middle">и так десять миллионов раз подряд</text>
  </g>

  <g data-key="bars">
    <text x="40" y="486" class="hd">ВРЕМЯ ОДНОЙ ИТЕРАЦИИ</text>
    <text x="140" y="512" class="lbl" text-anchor="end">C</text>
    <rect x="150" y="496" width="57" height="22" rx="4" class="barc"/>
    <text x="216" y="513" class="lbl">4,04 нс</text>
    <text x="140" y="546" class="lbl" text-anchor="end">Python</text>
    <rect x="150" y="530" width="735" height="22" rx="4" class="barp"/>
    <text x="875" y="547" class="lbl" text-anchor="end">52,5 нс</text>
  </g>

  <g data-key="same" data-only="1">
    <rect x="450" y="190" width="470" height="52" rx="9" class="boxg"/>
    <text x="685" y="222" class="lbl" text-anchor="middle">обе версии выдали 682 498 929</text>
  </g>

  <text x="40" y="586" class="legend">синий — данные и код · жёлтый — работа переводчика · зелёный — результат</text>
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
      <h4>Одна задача, два пути</h4>
      <p>Цикл простой: умножить, взять остаток, повторить. Важно, что тело
      выполняется десять миллионов раз — именно на повторениях и проявляется
      разница между переводом заранее и переводом на ходу.</p>
      <div class="sf">
        <div><span>формула этого шага</span><div class="math-display" data-tex="f_{k+1} = f_k \cdot k \bmod 1000000007"></div></div>
        <div class="sf-num"><span>подстановка чисел</span><p>10 000 000 итераций, ответ 682 498 929</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src comp" data-focus="comp">
      <div class="step-kicker">Шаг 2 · верхняя дорожка</div>
      <h4>Компилятор отрабатывает до запуска</h4>
      <p>Он читает весь текст, разбирает его, проверяет типы, выбирает команды и
      записывает результат в файл. Программа в этот момент не считает ничего.
      Зато потом, при каждом запуске, эта работа уже не повторяется.</p>
      <div class="sf">
        <div><span>что происходит</span><p>перевод отделён от исполнения по времени</p></div>
        <div class="sf-num"><span>числа</span><p>1 перевод на любое число запусков</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src comp mcode trick" data-focus="trick">
      <div class="step-kicker">Шаг 3 · что получилось</div>
      <h4>Компилятор переводит не построчно</h4>
      <p>В теле цикла — одиннадцать машинных команд на сорок три байта, и
      деления среди них нет. Компилятор знал, что модуль постоянный, и заменил
      остаток на умножение на подобранную константу со сдвигом: так быстрее.
      Ассемблер на такое неспособен, он переводит один к одному.</p>
      <div class="sf">
        <div><span>что происходит</span><p>переводчик получил право переписывать программу, лишь бы ответ совпадал</p></div>
        <div class="sf-num"><span>числа</span><p>11 команд, 43 байта, ноль делений</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src comp mcode cpu1" data-focus="cpu1">
      <div class="step-kicker">Шаг 4 · исполнение</div>
      <h4>Процессору больше нечего делать</h4>
      <p>Во время работы никакого переводчика в памяти нет: процессор крутит
      одиннадцать команд и обновляет два регистра. Отсюда и 4,04 наносекунды на
      итерацию — примерно девять тактов на нашей машине.</p>
      <div class="sf">
        <div><span>формула этого шага</span><p>время = число итераций × время одной итерации</p></div>
        <div class="sf-num"><span>подстановка чисел</span><p>10⁷ × 4,04 нс = 0,0404 с</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src bcode bc" data-focus="bc">
      <div class="step-kicker">Шаг 5 · нижняя дорожка</div>
      <h4>Python тоже компилирует, но не в машинный код</h4>
      <p>При первом запуске файл разбирается и превращается в байткод —
      компактные команды выдуманной машины: взять переменную, умножить, взять
      остаток, положить обратно, прыгнуть назад. На нашу итерацию их приходится
      девять. Процессор их не понимает.</p>
      <div class="sf">
        <div><span>что происходит</span><p>перевод есть, но он останавливается на полпути</p></div>
        <div class="sf-num"><span>числа</span><p>9 байткод-операций на итерацию</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src bcode bc eval evloop" data-focus="eval">
      <div class="step-kicker">Шаг 6 · кто исполняет байткод</div>
      <h4>Огромный цикл, разбирающий по одной команде</h4>
      <p>Байткод исполняет функция внутри интерпретатора — 56 311 байт
      машинного кода, в которых для каждой байткод-операции есть свой кусок.
      На каждую из девяти операций приходится проверка, переход и работа с
      объектами. И так десять миллионов раз.</p>
      <div class="sf">
        <div><span>что происходит</span><p>разбор происходит не один раз, а на каждой итерации</p></div>
        <div class="sf-num"><span>числа</span><p>9 × 10⁷ = 90 000 000 разборов за один запуск</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src comp mcode cpu1 bcode bc eval bars" data-focus="bars">
      <div class="step-kicker">Шаг 7 · замер</div>
      <h4>Тринадцать раз, а не тысяча</h4>
      <p>52,5 наносекунды против 4,04 — разница в тринадцать раз. Это много,
      но это не пропасть: на одну байткод-операцию приходится около 5,8
      наносекунды, и интерпретатор написан так, чтобы этот путь был как можно
      короче. Оценка Short Code в пятьдесят раз — того же порядка, разрыв за
      семьдесят пять лет скорее сократился.</p>
      <div class="sf">
        <div><span>формула этого шага</span><div class="math-display" data-tex="52{,}5 / 4{,}04 = 13{,}0"></div></div>
        <div class="sf-num"><span>подстановка чисел</span><p>0,525 с против 0,0404 с на 10⁷ итераций</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="src comp mcode cpu1 bcode bc eval bars same" data-focus="same">
      <div class="step-kicker">Шаг 8 · что мы купили</div>
      <h4>Ответ одинаковый, различается только цена</h4>
      <p>Оба пути дали 682 498 929. Компилируемая версия быстрее, зато её надо
      пересобирать под каждую архитектуру. Интерпретируемая работает всюду, где
      есть интерпретатор, и запускается сразу после правки. Вася выигрывает,
      если читать стих десять миллионов раз; Петя — если один раз и прямо
      сейчас.</p>
      <div class="sf">
        <div><span>что происходит</span><p>выбор не «лучше или хуже», а «где платить: временем разработки или временем работы»</p></div>
        <div class="sf-num"><span>числа</span><p>×13 по времени — и ноль по правильности</p></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>
  Байткод можно увидеть своими глазами — в Python для этого есть модуль
  <code>dis</code>. Вот тело цикла: девять операций между меткой и прыжком
  назад.
</p>

<div class="term">
  <div class="term-title">Что на самом деле исполняется в цикле Python</div>
<pre><span class="cmd">python3 -m dis bench.py</span>

  4     &gt;&gt;   36 FOR_ITER                10 (to 60)
             40 STORE_FAST               2 (i)

  5          42 LOAD_FAST                1 (f)
             44 LOAD_FAST                2 (i)
             46 BINARY_OP                5 (*)
             50 LOAD_CONST               2 (1000000007)
             52 BINARY_OP                6 (%)
             56 STORE_FAST               1 (f)
             58 JUMP_BACKWARD           12 (to 36)</pre>
</div>

<div class="callout-yellow">
  <strong>Граница давно размылась.</strong> Java компилируется в байткод, а
  затем виртуальная машина на ходу дособирает горячие места в машинный код.
  JavaScript в браузере делает то же самое. Так что «компилируемый» и
  «интерпретируемый» — свойство не языка, а конкретной реализации: один и тот
  же язык бывает и таким, и таким.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> компилятор и интерпретатор решают одну
  задачу — перевести запись человека в команды процессора — и различаются
  только моментом, когда они это делают. Всё остальное, включая разницу в
  скорости, следует отсюда.
</div>

---

## Часть 6. Пирамида: языки написаны на языках

<p>
  Теперь можно ответить на вопрос, с которого всё началось. Когда говорят
  «Python — интерпретируемый язык», за этим стоит совершенно конкретная
  программа, лежащая в файле на диске. Её можно посмотреть.
</p>

<div class="term">
  <div class="term-title">Из чего сделан «язык Python» на этой машине</div>
<pre><span class="cmd">python3 -c "import sys; print(sys.version)"</span>
3.12.3 (main, Mar  3 2026, 12:15:18) [<span class="hi">GCC 13.3.0</span>]

<span class="cmd">ls -l /usr/bin/python3.12 /usr/lib/x86_64-linux-gnu/libpython3.12.so.1.0</span>
-rwxr-xr-x 1 root root <span class="hi">8020928</span> /usr/bin/python3.12
-rw-r--r-- 1 root root <span class="hi">9056904</span> /usr/lib/x86_64-linux-gnu/libpython3.12.so.1.0

<span class="cm"># главный цикл интерпретатора — обычный машинный код</span>
<span class="cmd">objdump -d libpython3.12.so.1.0</span>
0000000000119500 &lt;_PyEval_EvalFrameDefault&gt;:
  119500:	f3 0f 1e fa          	endbr64
  119504:	55                   	push   %rbp
  119505:	48 89 e5             	mov    %rsp,%rbp
  119508:	41 57                	push   %r15
     ...                          <span class="cm">(всего 56 311 байт)</span></pre>
</div>

<p>
  Строка <code>[GCC 13.3.0]</code> — это признание: интерпретатор Python
  написан на C и собран компилятором GCC. А сам GCC — тоже программа, и она
  тоже кем-то собрана. Разберём эту лестницу снизу вверх.
</p>

<div class="stage" id="stagePy" tabindex="0">
  <div class="stage-figure">
<svg id="py" viewBox="0 0 960 586" role="img" aria-label="Пирамида уровней: от машинного кода через ассемблер и C до скрипта на Python">
  <style>
    #py { font-family: Helvetica, Arial, sans-serif; }
    #py .box   { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #py .boxy  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #py .boxg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #py .boxr  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #py .lbl   { font-size: 16px; fill: #111111; }
    #py .cap   { font-size: 13px; fill: #5E5850; }
    #py .mono  { font-family: "Courier New", Courier, monospace; font-size: 13.5px; fill: #111111; }
    #py .hd    { font-size: 12.5px; fill: #5E5850; letter-spacing: .06em; }
    #py .edge  { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #py .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="py-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text x="250" y="62" class="hd">ЧТО ВЫ ЗАПУСКАЕТЕ</text>
  <text x="726" y="62" class="hd">СКОЛЬКО ЭТО ВЕСИТ</text>

  <g data-key="l5">
    <rect x="250" y="72" width="450" height="60" rx="10" class="boxg"/>
    <text x="475" y="98" class="lbl" text-anchor="middle">fact.py — ваш скрипт</text>
    <text x="475" y="120" class="cap" text-anchor="middle">пять строк текста</text>
    <text x="726" y="108" class="cap">81 байт</text>
  </g>

  <g data-key="l4">
    <line x1="475" y1="136" x2="475" y2="160" class="edge" marker-end="url(#py-arw)"/>
    <rect x="250" y="164" width="450" height="60" rx="10" class="boxy"/>
    <text x="475" y="190" class="lbl" text-anchor="middle">интерпретатор CPython</text>
    <text x="475" y="212" class="cap" text-anchor="middle">разбирает в байткод и исполняет его</text>
    <text x="726" y="192" class="cap">8 020 928 байт python3</text>
    <text x="726" y="212" class="cap">9 056 904 байта libpython</text>
  </g>

  <g data-key="l3">
    <line x1="475" y1="228" x2="475" y2="252" class="edge" marker-end="url(#py-arw)"/>
    <rect x="250" y="256" width="450" height="60" rx="10" class="boxy"/>
    <text x="475" y="282" class="lbl" text-anchor="middle">исходный код на C и компилятор GCC</text>
    <text x="475" y="304" class="cap" text-anchor="middle">переводит C в команды процессора</text>
    <text x="726" y="284" class="cap">cc1 — 30 487 984 байта,</text>
    <text x="726" y="304" class="cap">это сам компилятор</text>
  </g>

  <g data-key="l2">
    <line x1="475" y1="320" x2="475" y2="344" class="edge" marker-end="url(#py-arw)"/>
    <rect x="250" y="348" width="450" height="60" rx="10" class="boxy"/>
    <text x="475" y="374" class="lbl" text-anchor="middle">ассемблер</text>
    <text x="475" y="396" class="cap" text-anchor="middle">мнемоники в опкоды, один к одному</text>
    <text x="726" y="386" class="cap">в 1949-м умещался в 31 приказ</text>
  </g>

  <g data-key="l1">
    <line x1="475" y1="412" x2="475" y2="436" class="edge" marker-end="url(#py-arw)"/>
    <rect x="250" y="440" width="450" height="60" rx="10" class="box"/>
    <text x="475" y="466" class="lbl" text-anchor="middle">машинный код x86-64</text>
    <text x="475" y="488" class="mono" text-anchor="middle">0f af c1</text>
    <text x="726" y="478" class="cap">21 байт на наш факториал</text>
  </g>

  <g data-key="boot" data-only="1">
    <rect x="40" y="164" width="190" height="244" rx="10" class="boxr"/>
    <text x="135" y="196" class="lbl" text-anchor="middle">бутстрап</text>
    <text x="54" y="228" class="cap">GCC написан на C и</text>
    <text x="54" y="248" class="cap">компилируется предыдущей</text>
    <text x="54" y="268" class="cap">версией самого себя.</text>
    <text x="54" y="300" class="cap">Первый компилятор Fortran</text>
    <text x="54" y="320" class="cap">писали на ассемблере.</text>
    <text x="54" y="352" class="cap">Первый ассемблер —</text>
    <text x="54" y="372" class="cap">руками в машинном коде.</text>
  </g>

  <g data-key="sum2" data-only="1">
    <rect x="40" y="516" width="880" height="46" rx="9" class="boxg"/>
    <text x="480" y="545" class="lbl" text-anchor="middle">«на чём написан язык» — это всегда вопрос «кто и когда переводит»</text>
  </g>

  <text x="40" y="578" class="legend">синий — машинный код · жёлтый — переводчики · зелёный — то, что пишет человек · красный — как это началось</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="l5" data-focus="l5">
      <div class="step-kicker">Шаг 1 · верх пирамиды</div>
      <h4>Пять строк, которые ничего не исполняют</h4>
      <p>Файл <code>fact.py</code> — обычный текст. Сам по себе он не является
      программой в том смысле, в каком ей были двадцать один байт из первой
      части: процессор не может взять из него ни одной команды.</p>
      <div class="sf">
        <div><span>что происходит</span><p>исходный текст — это описание задачи, а не команды</p></div>
        <div class="sf-num"><span>числа</span><p>5 строк, 81 байт текста</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="l5 l4" data-focus="l4">
      <div class="step-kicker">Шаг 2 · кто его читает</div>
      <h4>Язык — это программа на диске</h4>
      <p>Текст читает <code>python3</code> — исполняемый файл на восемь мегабайт
      вместе с библиотекой ещё на девять. Внутри неё та самая функция на 56 311
      байт машинного кода, которая крутит байткод. Вот это и есть «язык Python»
      в практическом смысле слова.</p>
      <div class="sf">
        <div><span>что происходит</span><p>язык существует как конкретный набор файлов, а не как идея</p></div>
        <div class="sf-num"><span>числа</span><p>8 020 928 + 9 056 904 байта против 81 байта скрипта</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="l5 l4 l3" data-focus="l3">
      <div class="step-kicker">Шаг 3 · этажом ниже</div>
      <h4>Интерпретатор написан на C</h4>
      <p>Строчка <code>[GCC 13.3.0]</code>, которую печатает сам Python, говорит,
      каким компилятором его собрали. Значит, где-то есть исходный код на C, а
      где-то — программа, которая перевела этот C в машинный код: cc1, тридцать
      мегабайт команд процессора.</p>
      <div class="sf">
        <div><span>что происходит</span><p>переводчик одного языка написан на другом языке</p></div>
        <div class="sf-num"><span>числа</span><p>cc1 — 30 487 984 байта машинного кода</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="l5 l4 l3 l2" data-focus="l2">
      <div class="step-kicker">Шаг 4 · ещё ниже</div>
      <h4>Компилятор опирается на ассемблер</h4>
      <p>GCC не выпускает байты напрямую: он порождает текст на ассемблере, а
      тот превращает мнемоники в опкоды — ровно так, как мы разбирали во второй
      части. Именно поэтому команда <code>gcc -c fact.s</code> в самом начале
      статьи и сработала: ассемблер приходит вместе с компилятором.</p>
      <div class="sf">
        <div><span>что происходит</span><p>этажи не заменяют друг друга, а вызывают по очереди</p></div>
        <div class="sf-num"><span>числа</span><p>перевод один к одному: 7 строк → 21 байт</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="l5 l4 l3 l2 l1" data-focus="l1">
      <div class="step-kicker">Шаг 5 · основание</div>
      <h4>Внизу всё те же байты</h4>
      <p>Что бы ни было написано наверху, до процессора доходит одно и то же:
      последовательность чисел. Байты <code>0f af c1</code> одинаковы и для
      программы, собранной из C, и для внутренностей интерпретатора, который
      исполняет наш скрипт.</p>
      <div class="sf">
        <div><span>что происходит</span><p>ни один этаж не отменил нижний, все они сходятся в машинный код</p></div>
        <div class="sf-num"><span>числа</span><p>21 байт на факториал — независимо от того, с какого этажа мы пришли</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="l5 l4 l3 l2 l1 boot" data-focus="boot">
      <div class="step-kicker">Шаг 6 · курица и яйцо, второй раз</div>
      <h4>Компилятор компилирует сам себя</h4>
      <p>GCC написан на C. Чтобы собрать новый GCC, нужен работающий GCC — и
      это не парадокс, а <strong>бутстрап</strong>: новую версию собирают
      предыдущей. Цепочка уходит вниз до первого компилятора Fortran, который
      писали на ассемблере, и до первого ассемблера, который писали прямо в
      машинном коде.</p>
      <div class="sf">
        <div><span>что происходит</span><p>каждый инструмент сделан предыдущим инструментом</p></div>
        <div class="sf-num"><span>числа</span><p>в основании — 31 приказ Уилера, набранный вручную</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="l5 l4 l3 l2 l1 boot sum2" data-focus="sum2">
      <div class="step-kicker">Шаг 7 · как это читать</div>
      <h4>Вопрос «на чём написан язык» имеет ответ</h4>
      <p>У языка нет собственной субстанции. Есть договорённость о записи и
      есть программа, которая эту запись во что-то превращает. Спросить «на чём
      написан Python» — то же самое, что спросить, кто и когда переводит: CPython
      написан на C, PyPy — на Python, а компилятор Go — на Go.</p>
      <div class="sf">
        <div><span>что происходит</span><p>язык и его реализация — разные вещи, и реализаций может быть несколько</p></div>
        <div class="sf-num"><span>числа</span><p>у одного языка — сколько угодно переводчиков</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="l5 l4 l3 l2 l1 sum2" data-focus="sum2">
      <div class="step-kicker">Шаг 8 · зачем эта картинка</div>
      <h4>Каждый этаж что-то стоит и что-то даёт</h4>
      <p>Поднимаясь на этаж, вы платите временем работы и отдаёте контроль над
      деталями. Получаете скорость разработки, переносимость и меньше
      возможностей ошибиться. История языков — это перебор точек на этом обмене,
      а не движение к единственно правильному языку.</p>
      <div class="sf">
        <div><span>что происходит</span><p>выбор этажа — инженерное решение, а не вопрос моды</p></div>
        <div class="sf-num"><span>числа</span><p>×13 времени работы за 5 строк вместо 7 строк мнемоник</p></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> у языков программирования нет
  фундамента из ничего. Каждый переводчик написан на языке, который уже умели
  переводить, а самая нижняя ступенька когда-то была набрана человеком вручную —
  один раз, чтобы больше этого не делать никогда.
</div>

---

## Часть 7. Ветвление: почему языков стало много

<p>
  После Fortran стало ясно, что подход работает, и языки начали появляться
  один за другим. Со стороны это выглядит как мода, но у каждого была своя
  причина: конкретная боль конкретных людей, из-за которой приходилось писать
  лишнее.
</p>

<div class="stage" id="stageTl" tabindex="0">
  <div class="stage-figure">
<svg id="tl" viewBox="0 0 960 604" role="img" aria-label="Временная шкала появления языков программирования по областям применения">
  <style>
    #tl { font-family: Helvetica, Arial, sans-serif; }
    #tl .lane  { stroke: #E0DDD3; stroke-width: 2; }
    #tl .axis  { stroke: #5E5850; stroke-width: 1.6; }
    #tl .lname { font-size: 12.5px; fill: #5E5850; letter-spacing: .05em; }
    #tl .name  { font-size: 14.5px; fill: #111111; }
    #tl .year  { font-size: 12.5px; fill: #5E5850; }
    #tl .cap   { font-size: 13px; fill: #5E5850; }
    #tl .dotb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 2.2; }
    #tl .doty  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2.2; }
    #tl .dotg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 2.2; }
    #tl .boxg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #tl .lbl   { font-size: 15px; fill: #111111; }
    #tl .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <g data-key="axis">
    <line x1="44" y1="495" x2="920" y2="495" class="axis"/>
    <line x1="60"  y1="490" x2="60"  y2="500" class="axis"/>
    <line x1="225" y1="490" x2="225" y2="500" class="axis"/>
    <line x1="390" y1="490" x2="390" y2="500" class="axis"/>
    <line x1="555" y1="490" x2="555" y2="500" class="axis"/>
    <line x1="720" y1="490" x2="720" y2="500" class="axis"/>
    <line x1="885" y1="490" x2="885" y2="500" class="axis"/>
    <text x="60"  y="518" class="year" text-anchor="middle">1950</text>
    <text x="225" y="518" class="year" text-anchor="middle">1960</text>
    <text x="390" y="518" class="year" text-anchor="middle">1970</text>
    <text x="555" y="518" class="year" text-anchor="middle">1980</text>
    <text x="720" y="518" class="year" text-anchor="middle">1990</text>
    <text x="885" y="518" class="year" text-anchor="middle">2000</text>
  </g>

  <g data-key="lanes">
    <text x="44" y="94"  class="lname">НАУКА И ИНЖЕНЕРИЯ</text>
    <line x1="44" y1="110" x2="920" y2="110" class="lane"/>
    <text x="44" y="159" class="lname">БИЗНЕС И УЧЁТ</text>
    <line x1="44" y1="175" x2="920" y2="175" class="lane"/>
    <text x="44" y="224" class="lname">ОБУЧЕНИЕ</text>
    <line x1="44" y1="240" x2="920" y2="240" class="lane"/>
    <text x="44" y="289" class="lname">ОБЪЕКТЫ</text>
    <line x1="44" y1="305" x2="920" y2="305" class="lane"/>
    <text x="44" y="354" class="lname">СИСТЕМНЫЕ</text>
    <line x1="44" y1="370" x2="920" y2="370" class="lane"/>
    <text x="44" y="419" class="lname">СКРИПТЫ И ВЕБ</text>
    <line x1="44" y1="435" x2="920" y2="435" class="lane"/>
  </g>

  <g data-key="pA">
    <circle cx="176" cy="110" r="7" class="dotb"/>
    <text x="176" y="92" class="name" text-anchor="middle">Fortran · 1957</text>
    <circle cx="225" cy="110" r="7" class="dotb"/>
    <text x="243" y="134" class="name">Algol · 1960</text>
  </g>

  <g data-key="pB">
    <circle cx="209" cy="175" r="7" class="dotb"/>
    <text x="209" y="157" class="name" text-anchor="middle">COBOL · 1959</text>
  </g>

  <g data-key="pC">
    <circle cx="291" cy="240" r="7" class="dotb"/>
    <text x="291" y="222" class="name" text-anchor="middle">BASIC · 1964</text>
    <circle cx="390" cy="240" r="7" class="dotb"/>
    <text x="408" y="264" class="name">Pascal · 1970</text>
  </g>

  <g data-key="pD">
    <circle cx="341" cy="305" r="7" class="dotb"/>
    <text x="341" y="287" class="name" text-anchor="middle">Simula 67</text>
    <circle cx="605" cy="305" r="7" class="dotb"/>
    <text x="605" y="287" class="name" text-anchor="middle">C++ · 1983</text>
    <circle cx="803" cy="305" r="7" class="dotb"/>
    <text x="803" y="287" class="name" text-anchor="middle">Java · 1995</text>
  </g>

  <g data-key="pE">
    <circle cx="423" cy="370" r="7" class="dotb"/>
    <text x="423" y="352" class="name" text-anchor="middle">C · 1972</text>
  </g>

  <g data-key="pF">
    <circle cx="737" cy="435" r="7" class="dotb"/>
    <text x="737" y="417" class="name" text-anchor="middle">Python · 1991</text>
    <circle cx="770" cy="435" r="7" class="dotb"/>
    <text x="788" y="459" class="name">Lua · 1993</text>
    <circle cx="803" cy="435" r="7" class="dotb"/>
    <text x="856" y="417" class="name" text-anchor="middle">PHP · 1995</text>
    <circle cx="820" cy="435" r="7" class="dotb"/>
    <text x="858" y="459" class="name" text-anchor="middle">JavaScript · 1995</text>
  </g>

  <g data-key="rule" data-only="1">
    <rect x="44" y="540" width="876" height="46" rx="9" class="boxg"/>
    <text x="482" y="569" class="lbl" text-anchor="middle">новый язык появляется там, где старый заставляет писать то, что можно не писать</text>
  </g>

  <text x="44" y="600" class="legend">по горизонтали — годы, по вертикали — задача, ради которой язык придумали</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="axis lanes" data-focus="lanes">
      <div class="step-kicker">Шаг 1 · как читать карту</div>
      <h4>По вертикали — не мода, а задача</h4>
      <p>Дорожки на схеме — это области, в которых людям было тесно. Языки
      появлялись не потому, что предыдущие устарели, а потому, что для новой
      задачи предыдущие требовали слишком много ручной работы.</p>
      <div class="sf">
        <div><span>что происходит</span><p>шесть областей, в каждой своя причина для нового языка</p></div>
        <div class="sf-num"><span>числа</span><p>1957–1995: почти вся современная палитра сложилась за 38 лет</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="axis lanes pA" data-focus="pA">
      <div class="step-kicker">Шаг 2 · формулы</div>
      <h4>Fortran и Algol: считать и описывать алгоритмы</h4>
      <p>Fortran дал циклы, массивы, подпрограммы и быстрый машинный код.
      Algol, созданный международной группой во главе с Питером Науром,
      Фридрихом Бауэром и Джоном Бэкусом, добавил блочную структуру
      <code>begin…end</code> и стал языком, на котором стали записывать сами
      алгоритмы — в статьях и учебниках.</p>
      <div class="sf">
        <div><span>что происходит</span><p>появляется понятие структуры программы, а не только последовательности команд</p></div>
        <div class="sf-num"><span>числа</span><p>к началу 1960-х — больше 40 компиляторов Fortran</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="axis lanes pA pB" data-focus="pB">
      <div class="step-kicker">Шаг 3 · деньги</div>
      <h4>COBOL: чтобы программу мог прочитать бухгалтер</h4>
      <p>Крупный бизнес и Министерство обороны США устали платить за
      программистов, владеющих десятком разных языков. Отраслевой комитет
      CODASYL, работу которого координировала Грейс Хоппер, выпустил язык с
      синтаксисом, близким к английскому. Он до сих пор жив в банковских и
      государственных системах.</p>
      <div class="sf">
        <div><span>что происходит</span><p>язык проектируется под читаемость и сопровождение, а не под скорость</p></div>
        <div class="sf-num"><span>числа</span><p>1959 год, требование поставлять язык со всеми машинами для бизнеса</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="axis lanes pA pB pC" data-focus="pC">
      <div class="step-kicker">Шаг 4 · порог входа</div>
      <h4>BASIC и Pascal: учить, а не бороться</h4>
      <p>BASIC придумали Джон Кемени и Томас Курц в Дартмутском колледже, чтобы
      программировать могли студенты-гуманитарии: простой синтаксис и
      немедленный запуск. Никлаус Вирт сделал Pascal со строгой типизацией —
      чтобы ошибка обнаруживалась при компиляции, а не в отладке.</p>
      <div class="sf">
        <div><span>что происходит</span><p>язык становится учебным инструментом и попадает на домашние компьютеры</p></div>
        <div class="sf-num"><span>числа</span><p>1964 и 1970 годы</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="axis lanes pA pB pC pD" data-focus="pD">
      <div class="step-kicker">Шаг 5 · объекты</div>
      <h4>Simula, C++, Java: моделировать мир кусками</h4>
      <p>Оле-Йохан Даль и Кристен Нюгор писали программы имитационного
      моделирования и ввели в Simula 67 классы, объекты, наследование и
      виртуальные методы. Бьёрн Страуструп перенёс эти идеи в C, сохранив
      скорость. Джеймс Гослинг добавил к ним виртуальную машину, чтобы одна
      сборка работала везде.</p>
      <div class="sf">
        <div><span>что происходит</span><p>появляется способ собирать программу из независимых частей со своим состоянием</p></div>
        <div class="sf-num"><span>числа</span><p>1967 → 1983 → 1995: шестнадцать лет от идеи до массовой платформы</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="axis lanes pA pB pC pD pE" data-focus="pE">
      <div class="step-kicker">Шаг 6 · системы</div>
      <h4>C: писать операционную систему не на ассемблере</h4>
      <p>Деннис Ритчи создал C в Bell Labs ради Unix. Язык дал прямой доступ к
      памяти и адресам — то, ради чего раньше спускались в ассемблер, — но
      сохранил циклы, функции и переносимость. Из-за этого на C написаны ядра,
      драйверы, компиляторы и, как мы видели, интерпретаторы других языков.</p>
      <div class="sf">
        <div><span>что происходит</span><p>нижний этаж наконец получает язык, на котором можно писать переносимо</p></div>
        <div class="sf-num"><span>числа</span><p>1972 год; на C написаны и CPython, и сам GCC</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="axis lanes pA pB pC pD pE pF" data-focus="pF">
      <div class="step-kicker">Шаг 7 · сеть</div>
      <h4>Python, Lua, PHP, JavaScript: склеивать и оживлять</h4>
      <p>С середины 1980-х распространяется клиент-серверная архитектура, с
      начала 1990-х — интернет. Появляются языки, где скорость разработки важнее
      скорости счёта: Python как универсальный клей, Lua для встраивания в игры,
      PHP для страниц на сервере, JavaScript для страниц в браузере.</p>
      <div class="sf">
        <div><span>что происходит</span><p>цена машинного времени падает, цена человеческого — растёт</p></div>
        <div class="sf-num"><span>числа</span><p>1991, 1993, 1995, 1995 — четыре языка за пять лет</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="axis lanes pA pB pC pD pE pF rule" data-focus="rule">
      <div class="step-kicker">Шаг 8 · закономерность</div>
      <h4>Каждый язык — ответ на конкретное «пишем лишнее»</h4>
      <p>Fortran убрал ручную раскладку по регистрам, COBOL — непонятность для
      неспециалиста, Simula — ручное связывание данных и процедур, C — выбор
      между переносимостью и контролем, JavaScript — перезагрузку страницы ради
      любого действия. Если языка много, значит, и способов писать лишнее много.</p>
      <div class="sf">
        <div><span>что происходит</span><p>язык не бывает лучше вообще — он лучше для определённой боли</p></div>
        <div class="sf-num"><span>числа</span><p>6 областей — 12 языков на схеме</p></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>
  Та же дюжина языков в виде таблицы — чтобы было куда вернуться.
</p>

<table class="shape-table">
  <tr><th>Язык</th><th>Год</th><th>Кто</th><th>Что принёс</th><th>Где живёт сегодня</th></tr>
  <tr><td>Fortran</td><td>1957</td><td>Джон Бэкус, IBM</td><td>компиляция в быстрый код, циклы и массивы</td><td>численное моделирование, аэрокосмос, энергетика</td></tr>
  <tr><td>COBOL</td><td>1959</td><td>комитет CODASYL</td><td>синтаксис, близкий к английскому</td><td>банковские и государственные системы</td></tr>
  <tr><td>Algol</td><td>1960</td><td>Наур, Бауэр, Бэкус</td><td>блочная структура и структурное программирование</td><td>потомки: почти все современные языки</td></tr>
  <tr><td>BASIC</td><td>1964</td><td>Кемени и Курц</td><td>низкий порог входа, интерактивный запуск</td><td>Visual Basic, макросы в офисных пакетах</td></tr>
  <tr><td>Simula 67</td><td>1967</td><td>Даль и Нюгор</td><td>классы, объекты, наследование</td><td>идея ООП во всех языках</td></tr>
  <tr><td>Pascal</td><td>1970</td><td>Никлаус Вирт</td><td>строгая типизация, модульность</td><td>обучение, Delphi</td></tr>
  <tr><td>C</td><td>1972</td><td>Деннис Ритчи</td><td>контроль над памятью при переносимости</td><td>ядра, драйверы, встроенные системы</td></tr>
  <tr><td>C++</td><td>1983</td><td>Бьёрн Страуструп</td><td>объекты и шаблоны без потери скорости</td><td>игровые движки, браузеры, тяжёлые приложения</td></tr>
  <tr><td>Python</td><td>1991</td><td>Гвидо ван Россум</td><td>лаконичность и огромная библиотека</td><td>анализ данных, машинное обучение, автоматизация</td></tr>
  <tr><td>Lua</td><td>1993</td><td>Иерузалимски и коллеги</td><td>лёгкий встраиваемый скриптовый язык</td><td>игры и расширения приложений</td></tr>
  <tr><td>Java</td><td>1995</td><td>Джеймс Гослинг</td><td>виртуальная машина: «написал один раз — работает везде»</td><td>корпоративные системы, Android</td></tr>
  <tr><td>PHP</td><td>1995</td><td>Расмус Лердорф</td><td>генерация веб-страниц на сервере</td><td>WordPress, Википедия</td></tr>
  <tr><td>JavaScript</td><td>1995</td><td>Брендан Эйк</td><td>интерактивность прямо в браузере</td><td>практически весь веб, плюс серверы на Node.js</td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> языки не выстраиваются в очередь, где
  каждый следующий отменяет предыдущий. Они расходятся по областям, и живучесть
  языка определяется не возрастом, а тем, осталась ли боль, ради которой его
  сделали.
</div>

---

## Часть 8. Один факториал на семи этажах

<p>
  Соберём весь путь в одну картину. Задача всё та же — посчитать 5! — но
  записана она пятью разными способами, и в каждом случае отличается только
  одно: кто и когда переводит эту запись в команды процессора.
</p>

<div class="stage" id="stageSt" tabindex="0">
  <div class="stage-figure">
<svg id="st" viewBox="0 0 960 566" role="img" aria-label="Сводная таблица: та же задача на разных уровнях абстракции с указанием переводчика и цены">
  <style>
    #st { font-family: Helvetica, Arial, sans-serif; }
    #st .row   { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1.1; }
    #st .hrow  { fill: #F4F8FD; stroke: #D9E4F0; stroke-width: 1.1; }
    #st .hd    { font-size: 12.5px; fill: #244F81; letter-spacing: .06em; }
    #st .lbl   { font-size: 15.5px; fill: #111111; }
    #st .cap   { font-size: 13px; fill: #5E5850; }
    #st .num   { font-size: 13.5px; fill: #111111; }
    #st .mono  { font-family: "Courier New", Courier, monospace; font-size: 13.5px; fill: #111111; }
    #st .chip  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.4; }
    #st .chipg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.4; }
    #st .colsel{ fill: none; stroke: #C29E08; stroke-width: 2.4; }
    #st .boxg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #st .boxb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #st .legend { font-size: 13px; fill: #5E5850; }
  </style>

  <g data-key="hdr">
    <rect x="40" y="48" width="880" height="38" rx="7" class="hrow"/>
    <text x="52"  y="73" class="hd">ЭТАЖ</text>
    <text x="202" y="73" class="hd">КАК ВЫГЛЯДИТ ЗАДАЧА</text>
    <text x="482" y="73" class="hd">КТО ПЕРЕВОДИТ</text>
    <text x="662" y="73" class="hd">КОГДА</text>
    <text x="802" y="73" class="hd">ЦЕНА</text>
  </g>

  <g data-key="r1">
    <rect x="40" y="92" width="880" height="68" rx="7" class="row"/>
    <text x="52"  y="126" class="lbl">машинный код</text>
    <text x="202" y="120" class="mono">b8 01 00 00 00 …</text>
    <text x="202" y="142" class="cap">21 байт, 7 команд, ни одного имени</text>
    <text x="482" y="126" class="lbl">никто</text>
    <text x="482" y="146" class="cap">это и есть команды</text>
    <text x="662" y="126" class="lbl">—</text>
  </g>

  <g data-key="r2">
    <rect x="40" y="166" width="880" height="68" rx="7" class="row"/>
    <text x="52"  y="200" class="lbl">ассемблер</text>
    <text x="202" y="194" class="mono">imul %ecx, %eax</text>
    <text x="202" y="216" class="cap">7 строк мнемоник и одна метка</text>
    <rect x="474" y="182" width="150" height="26" rx="13" class="chip"/>
    <text x="549" y="200" class="num" text-anchor="middle">ассемблер</text>
    <text x="482" y="224" class="cap">один к одному</text>
    <text x="662" y="200" class="lbl">до запуска</text>
  </g>

  <g data-key="r3">
    <rect x="40" y="240" width="880" height="68" rx="7" class="row"/>
    <text x="52"  y="274" class="lbl">C и Fortran</text>
    <text x="202" y="268" class="mono">for (i = 1; i &lt;= n; i++)</text>
    <text x="202" y="290" class="cap">одна строка цикла</text>
    <rect x="474" y="256" width="150" height="26" rx="13" class="chip"/>
    <text x="549" y="274" class="num" text-anchor="middle">компилятор</text>
    <text x="482" y="298" class="cap">имеет право переписать</text>
    <text x="662" y="274" class="lbl">до запуска</text>
  </g>

  <g data-key="r4">
    <rect x="40" y="314" width="880" height="68" rx="7" class="row"/>
    <text x="52"  y="348" class="lbl">Python</text>
    <text x="202" y="342" class="mono">for i in range(1, n + 1):</text>
    <text x="202" y="364" class="cap">пять строк</text>
    <rect x="474" y="330" width="150" height="26" rx="13" class="chip"/>
    <text x="549" y="348" class="num" text-anchor="middle">байткод, затем</text>
    <text x="482" y="372" class="cap">цикл интерпретатора</text>
    <text x="662" y="342" class="lbl">при импорте</text>
    <text x="662" y="364" class="cap">и на каждой итерации</text>
  </g>

  <g data-key="r5">
    <rect x="40" y="388" width="880" height="68" rx="7" class="row"/>
    <text x="52"  y="422" class="lbl">под всеми ними</text>
    <text x="202" y="416" class="mono">0f af c1</text>
    <text x="202" y="438" class="cap">то же самое умножение регистров</text>
    <rect x="474" y="404" width="150" height="26" rx="13" class="chipg"/>
    <text x="549" y="422" class="num" text-anchor="middle">процессор</text>
    <text x="662" y="422" class="lbl">всегда</text>
  </g>

  <g data-key="cost" data-only="1">
    <rect x="788" y="90" width="134" height="368" rx="8" class="colsel"/>
    <text x="802" y="132" class="num">полный контроль</text>
    <text x="802" y="206" class="num">только x86-64</text>
    <text x="802" y="280" class="num">4,04 нс</text>
    <text x="802" y="354" class="num">52,5 нс</text>
    <text x="802" y="428" class="num">ответ 120</text>
  </g>

  <g data-key="port" data-only="1">
    <rect x="40" y="474" width="880" height="60" rx="9" class="boxb"/>
    <text x="480" y="500" class="lbl" text-anchor="middle">за каждый этаж заплачено временем работы, а куплена переносимость</text>
    <text x="480" y="522" class="cap" text-anchor="middle">пять строк на Python запустятся и на ARM, и на RISC-V — 21 байт не запустится нигде, кроме x86-64</text>
  </g>

  <g data-key="sum" data-only="1">
    <rect x="40" y="474" width="880" height="60" rx="9" class="boxg"/>
    <text x="480" y="500" class="lbl" text-anchor="middle">на всех пяти строках получается 120</text>
    <text x="480" y="522" class="cap" text-anchor="middle">разница не в ответе, а в том, сколько работы делает человек и сколько — машина</text>
  </g>

  <text x="40" y="556" class="legend">жёлтый — переводчики · зелёный — то, что не меняется ни на одном этаже</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="hdr r1" data-focus="r1">
      <div class="step-kicker">Шаг 1 · нижний этаж</div>
      <h4>Двадцать один байт</h4>
      <p>С этого мы начали. Программу нужно писать по таблице опкодов, любая
      вставка ломает все смещения, и работать это будет только на процессорах
      одного семейства. Зато между вашей записью и тем, что исполняется, нет
      вообще ничего.</p>
      <div class="sf">
        <div><span>что происходит</span><p>человек делает всю работу переводчика сам</p></div>
        <div class="sf-num"><span>числа</span><p>21 байт, 23 исполненные команды</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="hdr r1 r2" data-focus="r2">
      <div class="step-kicker">Шаг 2 · первый переводчик</div>
      <h4>Ассемблер: те же команды, но читаемые</h4>
      <p>Мнемоники и метки, перевод один к одному, вся бухгалтерия адресов на
      машине. Ничего нового в машинном коде не появляется — и это ровно то, чего
      от ассемблера ждут: предсказуемость до байта.</p>
      <div class="sf">
        <div><span>что происходит</span><p>перевод отдан программе, но остался буквальным</p></div>
        <div class="sf-num"><span>числа</span><p>7 строк → те же 21 байт</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="hdr r1 r2 r3" data-focus="r3">
      <div class="step-kicker">Шаг 3 · компилятор</div>
      <h4>Одна строка вместо семи</h4>
      <p>В C цикл записывается одной строкой, и переводчик получает право не
      следовать ей буквально: он выбирает команды, распределяет регистры,
      разворачивает цикл, заменяет деление умножением. Проверить его работу
      по-прежнему можно — дизассемблером.</p>
      <div class="sf">
        <div><span>что происходит</span><p>перевод стал не буквальным, а осмысленным</p></div>
        <div class="sf-num"><span>числа</span><p>11 команд в теле цикла, 4,04 нс на итерацию</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="hdr r1 r2 r3 r4" data-focus="r4">
      <div class="step-kicker">Шаг 4 · интерпретатор</div>
      <h4>Перевод, который не заканчивается</h4>
      <p>Python доводит текст только до байткода, а последний шаг делает во
      время работы — на каждой итерации заново. Взамен ничего не нужно
      пересобирать: поправил файл, запустил, увидел результат.</p>
      <div class="sf">
        <div><span>что происходит</span><p>часть перевода перенесена в момент выполнения</p></div>
        <div class="sf-num"><span>числа</span><p>9 байткод-операций, 52,5 нс на итерацию</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="hdr r1 r2 r3 r4 r5" data-focus="r5">
      <div class="step-kicker">Шаг 5 · основание</div>
      <h4>Внизу у всех одно и то же</h4>
      <p>Байты <code>0f af c1</code> исполняются во всех четырёх случаях —
      просто в одном их написал человек, в другом ассемблер, в третьем
      компилятор, а в четвёртом они лежат внутри интерпретатора. Этажи
      добавляются сверху, дно не двигается.</p>
      <div class="sf">
        <div><span>что происходит</span><p>абстракция скрывает машинный код, но не заменяет его</p></div>
        <div class="sf-num"><span>числа</span><p>одна и та же команда умножения на каждом этаже</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="hdr r1 r2 r3 r4 r5 cost" data-focus="cost">
      <div class="step-kicker">Шаг 6 · счёт</div>
      <h4>Столбик, ради которого всё затевалось</h4>
      <p>Чем выше этаж, тем дороже итерация: от полного контроля внизу до
      тринадцатикратного замедления наверху. Но обратите внимание на порядок
      величин — это десятки процентов и разы, а не тысячи раз. Именно поэтому
      подъём оказался выгодным.</p>
      <div class="sf">
        <div><span>формула этого шага</span><div class="math-display" data-tex="52{,}5\ \text{нс} \;/\; 4{,}04\ \text{нс} = 13"></div></div>
        <div class="sf-num"><span>подстановка чисел</span><p>0,525 с против 0,0404 с на 10 000 000 итераций</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="hdr r1 r2 r3 r4 r5 cost port" data-focus="port">
      <div class="step-kicker">Шаг 7 · что куплено</div>
      <h4>Программа перестала быть привязанной к машине</h4>
      <p>Двадцать один байт из первой части — это программа для конкретного
      семейства процессоров, и больше ни для какого. Четыре строки на Python
      запустятся всюду, где есть интерпретатор. Fortran в 1957 году продавали
      именно этим аргументом, и он оказался сильнее аргумента о скорости.</p>
      <div class="sf">
        <div><span>что происходит</span><p>переносимость — главное, что дали высокоуровневые языки</p></div>
        <div class="sf-num"><span>числа</span><p>к началу 1960-х — 40+ компиляторов Fortran для разных ЭВМ</p></div>
      </div>
    </div>
    <div class="step-panel" data-on="hdr r1 r2 r3 r4 r5 cost sum" data-focus="sum">
      <div class="step-kicker">Шаг 8 · итог</div>
      <h4>Ответ везде одинаковый</h4>
      <p>Ни один этаж не сделал вычисление точнее или правильнее: 120 остаётся
      120. Менялось только распределение работы между человеком и машиной — и
      вся история языков программирования умещается в эту фразу.</p>
      <div class="sf">
        <div><span>что происходит</span><p>абстракция — это перераспределение труда, а не новая математика</p></div>
        <div class="sf-num"><span>числа</span><p>5! = 120 на всех пяти строках таблицы</p></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> подъём на этаж всегда меняет одно и то
  же — сколько думает человек и сколько работает машина. Выбирая язык, вы
  выбираете точку на этом обмене, а не «более современный» инструмент.
</div>

---

## Часть 9. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>В памяти лежат только числа.</strong> У команды есть длина и код
  операции, у перехода — смещение, а не адрес. Имён, строк и меток на этом
  уровне не существует ни в одном языке.</li>

  <li><strong>Язык ассемблера — перевод один к одному.</strong> Одна мнемоника
  соответствует одной машинной команде, поэтому ассемблер ничего не оптимизирует
  и не скрывает; он ведёт таблицу символов и считает смещения.</li>

  <li><strong>Нотацию и инструмент придумали разные люди.</strong> Кэтлин и
  Эндрю Бут в 1947 году предложили символическую запись, которую переводили
  вручную; Уилер, Уилкс и Гилл на EDSAC сделали программу, которая переводила
  её сама.</li>

  <li><strong>Первую программу нельзя загрузить обычным способом.</strong>
  На EDSAC 31 начальный приказ был зашит на униселекторах и копировался в
  память кнопкой. Сегодня ту же роль играет прошивка.</li>

  <li><strong>Момент перевода важнее синтаксиса.</strong> Компилятор переводит
  до запуска и порождает машинный код; интерпретатор разбирает программу во
  время работы. Отсюда вся разница в скорости и в удобстве.</li>

  <li><strong>Разрыв — разы, а не порядки.</strong> Short Code в 1950-м
  оценивали в 50-кратное замедление, современный CPython на измеренном цикле
  отстаёт от кода GCC в 13 раз. Ответ при этом совпадает до последней цифры.</li>

  <li><strong>Компилятор имеет право переписывать.</strong> В нашем цикле
  деление на константу превратилось в умножение и сдвиг, а факториал при
  оптимизации развернулся на два умножения за проход. Проверяется
  дизассемблером.</li>

  <li><strong>Языки написаны на языках.</strong> CPython написан на C, C
  переводит GCC, GCC собирается предыдущей версией себя, а в основании цепочки
  кто-то однажды набрал байты руками. Вопрос «на чём написан язык» — это
  вопрос «кто переводит».</li>

  <li><strong>Новый язык — ответ на конкретную боль.</strong> Fortran убрал
  ручную работу с регистрами, COBOL — непонятность для неспециалиста, C — выбор
  между контролем и переносимостью, JavaScript — перезагрузку страницы. Языков
  много, потому что много способов писать лишнее.</li>
</ol>

<p>
  Если унести из статьи одну картинку, пусть это будет лестница из последней
  части. Внизу двадцать один байт, наверху пять строк, между ними —
  переводчики, каждый из которых сам когда-то был чьей-то программой. Ни один
  этаж не отменил нижний: когда вы пишете <code>f *= i</code>, где-то под этим
  по-прежнему исполняется <code>0f af c1</code>, и весь вопрос лишь в том, кто
  и в какой момент написал эти три байта за вас.
</p>

<p class="tiny">
  Откуда числа. Все байты и дизассемблированные листинги получены на машине
  x86-64 (Ubuntu 24.04, GCC 13.3.0, CPython 3.12.3): сборка <code>gcc -c</code>,
  разбор <code>objdump -d</code>, байткод — модулем <code>dis</code>. Замеры —
  лучшее из нескольких прогонов на одном ядре Intel Xeon 2,1 ГГц: цикл в
  10 000 000 итераций, обе версии дают 682 498 929; времена округлены до трёх
  значащих цифр. Размеры файлов — <code>ls -l</code> на той же системе, размер
  функции интерпретатора — из таблицы символов libpython. Исторические цифры
  взяты из описаний машин: EDSAC — 512 слов по 17 бит, около 3000 ламп, 31
  начальный приказ в версии мая 1949 года (в сентябре — 41), чтение ленты 6⅔
  символа в секунду, порядка 650 приказов в секунду; оценка Short Code в
  «примерно 50 раз медленнее машинного кода» — из литературы по истории языка.
  Пример кодирования Short Code взят из документации того времени;
  пример команд ассемблера x86 — из разбираемого параграфа хендбука.
</p>
