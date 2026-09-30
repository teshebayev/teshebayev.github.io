

<p class="lead">
  Библиотека — это чужой код, который лежит обычной папкой в <code>site-packages</code>
  и после <code>import</code> становится объектом с атрибутами и методами. Фреймворк —
  та же библиотека, которая вдобавок забирает у вас часть программы и сама вызывает
  ваш код. Я покажу это на одной-единственной операции — умножении матриц — и пройду
  от трёх вложенных циклов до <code>loss.backward()</code>.
</p>

<p>
  Слова «библиотека» и «фреймворк» часто звучат как что-то монолитное и непрозрачное:
  написал <code>import torch</code> — и магия. На деле за каждым таким словом стоят
  вполне осязаемые вещи: файлы на диске, правило поиска модулей, объекты с методами и
  договорённость о том, кто кого вызывает. Я разберу их по порядку, ничего не
  измеряя по скорости: здесь важно не «насколько быстрее», а «что именно происходит».
</p>

<p>
  Маршрут такой. Сначала я умножу две матрицы голым Python. Потом вынесу функцию
  в отдельный файл и посмотрю, что делает <code>import</code>. Потом поставлю NumPy
  и найду, где на диске лежит его код. Потом разберу объект <code>ndarray</code>
  и путь, по которому проходит вызов <code>A @ B</code>. И в конце соберу
  маленькую нейросеть дважды — на NumPy и на PyTorch, — чтобы стало видно, какую
  работу каждый уровень забирает на себя.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Базовый Python</strong>
    <p>Списки, циклы <code>for</code>, функции и умение запустить скрипт из терминала.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Матрицы 2×3 и 3×2 и сеть 2→2→1</strong>
    <p>Одни и те же числа проходят через циклы, NumPy и PyTorch — ответы совпадают.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Вы объясните, что происходит</strong>
    <p>при <code>pip install</code>, <code>import</code>, <code>A @ B</code> и <code>loss.backward()</code> — и чем библиотека отличается от фреймворка.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные, файлы, ваш код</span>
  <span><i style="background:#C29E08"></i>операция и параметр</span>
  <span><i style="background:#73B222"></i>результат, готовое от библиотеки</span>
  <span><i style="background:#C30B0A"></i>ошибка и градиент</span>
</div>

<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не
  на всю схему сразу, а только на яркую часть. Положение объектов остаётся
  постоянным, поэтому меняется именно смысл шага, а не карта перед глазами.
  Кнопки со стрелками на клавиатуре работают, когда сцена в фокусе.
</div>

<h2 id="part-1">Часть 1. Умножение матриц руками</h2>

<p>
  Начну с того, что никакой библиотеки ещё нет. Есть только Python, списки и циклы.
  Матрицу я храню как список строк: <code>A[i]</code> — это строка, <code>A[i][k]</code> —
  число в строке <code>i</code> и столбце <code>k</code>.
</p>

<p>
  Правило умножения одно: элемент результата в строке <code>i</code> и столбце <code>j</code>
  равен <strong>скалярному произведению</strong> <code>i</code>-й строки левой матрицы
  на <code>j</code>-й столбец правой. Попарно перемножаем и складываем:
</p>

<div class="math-display" data-tex="C_{ij} = \sum_{k=1}^{m} A_{ik}\,B_{kj}"></div>

<p>
  Отсюда же следует правило форм: строка <code>A</code> и столбец <code>B</code> должны
  быть одной длины <code>m</code>. Если <code>A</code> имеет форму <span class="math-inline" data-tex="n\times m"></span>, а
  <code>B</code> — <span class="math-inline" data-tex="m\times p"></span>, то результат будет <span class="math-inline" data-tex="n\times p"></span>. Мои матрицы:
</p>

<div class="math-display" data-tex="A = \begin{bmatrix} 1 &amp; 2 &amp; 0 \\ 3 &amp; -1 &amp; 2 \end{bmatrix}, \qquad B = \begin{bmatrix} 2 &amp; 1 \\ 0 &amp; 1 \\ 1 &amp; -1 \end{bmatrix}"></div>

<p>Посмотрим пошагово, как из них получается <code>C</code> и как это правило превращается в код.</p>

<div class="stage" id="stageMatmul" tabindex="0">
  <div class="stage-figure">
<svg id="mm" viewBox="0 0 960 500" role="img" aria-label="Умножение матрицы 2 на 3 на матрицу 3 на 2 и код с тремя вложенными циклами">
  <style>
    #mm { font-family: Helvetica, Arial, sans-serif; }
    #mm .cell { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; }
    #mm .cellc { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.5; stroke-dasharray: 4 3; }
    #mm .cg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #mm .num { font-size: 20px; fill: #111111; }
    #mm .ttl { font-size: 17px; fill: #111111; font-weight: 700; }
    #mm .cap { font-size: 14px; fill: #5E5850; }
    #mm .sgn { font-size: 30px; fill: #5E5850; }
    #mm .hl { fill: none; stroke: #C29E08; stroke-width: 3; }
    #mm .code { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #mm .codebox { fill: #F4F2EC; stroke: #3576C0; stroke-width: 1.5; }
    #mm .kbg { fill: #FFF3C4;  stroke: #C29E08; stroke-width: 1.2; }
    #mm .fbg { fill: #CDEBB0;  stroke: #73B222; stroke-width: 1.2; }
    #mm .fml { font-size: 20px; fill: #111111; }
    #mm .gtx { font-size: 14px; fill: #5a8c1c; }
    #mm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <g data-key="mats">
    <foreignObject x="63" y="113.9" width="122" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:700" data-tex="A \cdot  2\times 3"></div></foreignObject>
    <rect x="40" y="150" width="56" height="56" class="cell"/>
    <rect x="96" y="150" width="56" height="56" class="cell"/>
    <rect x="152" y="150" width="56" height="56" class="cell"/>
    <rect x="40" y="206" width="56" height="56" class="cell"/>
    <rect x="96" y="206" width="56" height="56" class="cell"/>
    <rect x="152" y="206" width="56" height="56" class="cell"/>
    <foreignObject x="43" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="99" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <foreignObject x="155" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <foreignObject x="43" y="212.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="3"></div></foreignObject>
    <foreignObject x="91.5" y="212.8" width="65" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="-1"></div></foreignObject>
    <foreignObject x="155" y="212.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <text x="239" y="216" class="sgn" text-anchor="middle">·</text>
    <foreignObject x="265" y="85.9" width="122" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:700" data-tex="B \cdot  3\times 2"></div></foreignObject>
    <rect x="270" y="122" width="56" height="56" class="cell"/>
    <rect x="326" y="122" width="56" height="56" class="cell"/>
    <rect x="270" y="178" width="56" height="56" class="cell"/>
    <rect x="326" y="178" width="56" height="56" class="cell"/>
    <rect x="270" y="234" width="56" height="56" class="cell"/>
    <rect x="326" y="234" width="56" height="56" class="cell"/>
    <foreignObject x="273" y="128.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <foreignObject x="329" y="128.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="273" y="184.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <foreignObject x="329" y="184.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="273" y="240.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="321.5" y="240.8" width="65" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="-1"></div></foreignObject>
    <text x="414" y="216" class="sgn" text-anchor="middle">=</text>
    <foreignObject x="440" y="113.9" width="122" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:700" data-tex="C \cdot  2\times 2"></div></foreignObject>
    <rect x="445" y="150" width="56" height="56" class="cellc"/>
    <rect x="501" y="150" width="56" height="56" class="cellc"/>
    <rect x="445" y="206" width="56" height="56" class="cellc"/>
    <rect x="501" y="206" width="56" height="56" class="cellc"/>
  </g>
  <g data-key="shape" data-only="1">
    <foreignObject x="40" y="331.8" width="454" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:20px;color:#111111;font-weight:400" data-tex="(2\times 3)\cdot(3\times 2) \;\to\; (2\times 2)"></div></foreignObject>
    <foreignObject x="40" y="370.5" width="681" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span>внутренние размеры обязаны совпасть: <span data-tex="3 = 3"></span>; внешние дают форму <span data-tex="C"></span></span></div></foreignObject>
  </g>
  <g data-key="rc00" data-only="1">
    <rect x="37" y="147" width="174" height="62" rx="4" class="hl"/>
    <rect x="267" y="119" width="62" height="174" rx="4" class="hl"/>
  </g>
  <g data-key="f00" data-only="1">
    <foreignObject x="40" y="331.8" width="454" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:20px;color:#111111;font-weight:400" data-tex="C[0][0] = 1\cdot 2 + 2\cdot 0 + 0\cdot 1 = 2"></div></foreignObject>
    <foreignObject x="40" y="370.5" width="671" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span>строка <span data-tex="0"></span> из <span data-tex="A"></span> идёт по столбцу <span data-tex="0"></span> из <span data-tex="B"></span>: три умножения, одна сумма</span></div></foreignObject>
  </g>
  <g data-key="c00">
    <rect x="445" y="150" width="56" height="56" class="cg"/>
    <foreignObject x="448" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
  </g>
  <g data-key="rc11" data-only="1">
    <rect x="37" y="203" width="174" height="62" rx="4" class="hl"/>
    <rect x="323" y="119" width="62" height="174" rx="4" class="hl"/>
  </g>
  <g data-key="f11" data-only="1">
    <foreignObject x="40" y="331.8" width="540" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:20px;color:#111111;font-weight:400" data-tex="C[1][1] = 3\cdot 1 + (-1)\cdot 1 + 2\cdot (-1) = 0"></div></foreignObject>
    <foreignObject x="40" y="370.5" width="590" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span>ноль — не ошибка: вклады <span data-tex="+3"></span>, <span data-tex="-1"></span> и <span data-tex="-2"></span> взаимно погасились</span></div></foreignObject>
  </g>
  <g data-key="c11">
    <rect x="501" y="206" width="56" height="56" class="cg"/>
    <foreignObject x="504" y="212.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
  </g>
  <g data-key="crest">
    <rect x="501" y="150" width="56" height="56" class="cg"/>
    <foreignObject x="504" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="3"></div></foreignObject>
    <rect x="445" y="206" width="56" height="56" class="cg"/>
    <foreignObject x="448" y="212.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="8"></div></foreignObject>
    <foreignObject x="40" y="420.5" width="852" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span>всего <span data-tex="n \cdot p \cdot m = 2 \cdot 2 \cdot 3 = 12"></span> умножений — по три на каждую из четырёх клеток <span data-tex="C"></span></span></div></foreignObject>
  </g>
  <rect x="605" y="90" width="335" height="252" rx="8" class="codebox"/>
  <g data-key="kline" data-only="1">
    <rect x="612" y="251" width="321" height="42" rx="4" class="kbg"/>
  </g>
  <g data-key="fn" data-only="1">
    <rect x="612" y="102" width="321" height="22" rx="4" class="fbg"/>
    <text x="612" y="370" class="gtx">def даёт имя: теперь это можно вызвать снова</text>
  </g>
  <g data-key="code">
    <text x="620" y="118" class="code">def matmul(A, B):</text>
    <text x="620" y="139" class="code">    n, m = len(A), len(B)</text>
    <text x="620" y="160" class="code">    p = len(B[0])</text>
    <text x="620" y="181" class="code">    C = [[0]*p for _ in range(n)]</text>
    <text x="620" y="202" class="code">    for i in range(n):</text>
    <text x="620" y="223" class="code">        for j in range(p):</text>
    <text x="620" y="244" class="code">            s = 0</text>
    <text x="620" y="265" class="code">            for k in range(m):</text>
    <text x="620" y="286" class="code">                s += A[i][k]*B[k][j]</text>
    <text x="620" y="307" class="code">            C[i][j] = s</text>
    <text x="620" y="328" class="code">    return C</text>
  </g>
  <text x="40" y="486" class="legend">синий — данные · жёлтая рамка — строка и столбец, которые сейчас перемножаются · зелёный — готовая клетка C</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="mats" data-focus="mats">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>Две матрицы — это просто списки списков</h4>
      <p>В Python нет встроенного типа «матрица». <code>A = [[1, 2, 0], [3, -1, 2]]</code> — это
      список из двух строк по три числа. Пустая пунктирная <code>C</code> справа — то, что предстоит заполнить.</p>
    </div>
    <div class="step-panel" data-on="mats shape" data-focus="shape">
      <div class="step-kicker">Шаг 2 · правило форм</div>
      <h4>Форма результата известна заранее</h4>
      <p>Строка <code>A</code> длины 3 перемножается со столбцом <code>B</code> длины 3 — поэтому
      внутренние размеры обязаны совпасть. Строк у результата столько же, сколько у <code>A</code>,
      столбцов — сколько у <code>B</code>: получается <span class="math-inline" data-tex="2\times 2"></span>.</p>
    </div>
    <div class="step-panel" data-on="mats rc00 f00 c00" data-focus="rc00 f00 c00">
      <div class="step-kicker">Шаг 3 · одна клетка</div>
      <h4>Клетка C[0][0]: строка 0 на столбец 0</h4>
      <p>Берём первую строку <code>A</code> и первый столбец <code>B</code>, перемножаем попарно и складываем.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Раскрываем сумму по k</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">k = 0</div>
            <div class="math-display worked-trace-math" data-tex="A_{00}B_{00} = 1\cdot 2 = 2"></div>
            <div class="worked-trace-note">накопленная сумма s = 2</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">k = 1</div>
            <div class="math-display worked-trace-math" data-tex="A_{01}B_{10} = 2\cdot 0 = 0"></div>
            <div class="worked-trace-note">s = 2</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">k = 2</div>
            <div class="math-display worked-trace-math" data-tex="A_{02}B_{20} = 0\cdot 1 = 0"></div>
            <div class="worked-trace-note">s = 2 → записываем в C[0][0]</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> в этой клетке работает
        только первое слагаемое — нули в строке <code>A</code> и в столбце <code>B</code>
        выключили остальные.</p>
      </div>
    </div>
    <div class="step-panel" data-on="mats c00 rc11 f11 c11" data-focus="rc11 f11 c11">
      <div class="step-kicker">Шаг 4 · ещё одна клетка</div>
      <h4>Клетка C[1][1] = 0</h4>
      <p>Вторая строка <code>A</code> — <code>[3, −1, 2]</code>, второй столбец <code>B</code> —
      <code>[1, 1, −1]</code>. Произведения 3, −1 и −2 в сумме дают ровно ноль.</p>
      <div class="callout-blue">
        <strong>Зачем этот пример:</strong> ноль потом появится во всех трёх реализациях — циклах,
        NumPy и PyTorch. Если где-то он не получится, значит, ошибка в коде, а не в арифметике.
      </div>
    </div>
    <div class="step-panel" data-on="mats c00 c11 crest" data-focus="crest">
      <div class="step-kicker">Шаг 5 · результат</div>
      <h4>Все четыре клетки: C = [[2, 3], [8, 0]]</h4>
      <p>Оставшиеся клетки считаются так же: <code>C[0][1] = 1·1 + 2·1 + 0·(−1) = 3</code>,
      <code>C[1][0] = 3·2 + (−1)·0 + 2·1 = 8</code>. На каждую клетку ушло три умножения —
      столько, какова длина строки.</p>
    </div>
    <div class="step-panel" data-on="mats c00 c11 crest code kline" data-focus="code kline">
      <div class="step-kicker">Шаг 6 · код</div>
      <h4>Правило превращается в три вложенных цикла</h4>
      <p>Внешние циклы по <code>i</code> и <code>j</code> выбирают клетку <code>C</code>.
      Внутренний цикл по <code>k</code> (жёлтая подсветка) — это и есть скалярное произведение
      из шага 3: он пробегает строку и столбец и копит сумму в <code>s</code>.</p>
    </div>
    <div class="step-panel" data-on="mats c00 c11 crest code fn" data-focus="code fn">
      <div class="step-kicker">Шаг 7 · упаковка</div>
      <h4>Функция — зародыш библиотеки</h4>
      <p>Строка <code>def matmul(A, B):</code> дала всему этому имя. Теперь не нужно помнить
      про три цикла: достаточно написать <code>matmul(A, B)</code>. Ровно эту идею —
      «спрятать сложное за именем» — библиотеки доводят до конца.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>Целиком файл <code>matmul.py</code> выглядит так:</p>

<pre><code># C:\Users\work\proj\matmul.py
def matmul(A, B):
    n, m = len(A), len(B)
    p = len(B[0])
    C = [[0] * p for _ in range(n)]
    for i in range(n):
        for j in range(p):
            s = 0
            for k in range(m):
                s += A[i][k] * B[k][j]
            C[i][j] = s
    return C

A = [[1, 2, 0], [3, -1, 2]]
B = [[2, 1], [0, 1], [1, -1]]
print(matmul(A, B))</code></pre>

<p>
  Запуск — это просьба к интерпретатору <code>python</code> прочитать файл и выполнить
  его сверху вниз:
</p>

<pre><code>C:\Users\work\proj&gt; python matmul.py
[[2, 3], [8, 0]]</code></pre>

<div class="callout-yellow">
  <strong>Чего здесь не хватает:</strong> функция не проверяет формы. Если передать
  <code>B</code> с двумя строками вместо трёх, она упадёт на <code>IndexError</code>
  где-то внутри циклов, и по сообщению будет непонятно, что не так. Проверка форм с
  понятной ошибкой — одна из скучных вещей, которые библиотека делает за вас.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> матричное умножение — это три вложенных цикла,
  а всё дальнейшее в статье — разные способы не писать их самому.
</div>

<hr>

<h2 id="part-2">Часть 2. Модуль: что делает import</h2>

<p>
  Функция <code>matmul</code> пригодится не в одном скрипте. Я вынесу её в отдельный файл
  <code>mylinalg.py</code>, а в основном скрипте подключу его одной строкой. Папка проекта
  теперь выглядит так:
</p>

<pre><code>C:\Users\work\proj\
├── mylinalg.py     ← def matmul(A, B): ...   (только функция, без print)
└── main.py</code></pre>

<pre><code># main.py
import mylinalg

A = [[1, 2, 0], [3, -1, 2]]
B = [[2, 1], [0, 1], [1, -1]]
C = mylinalg.matmul(A, B)
print(C)                    # [[2, 3], [8, 0]]
print(type(mylinalg))       # &lt;class 'module'&gt;
print(mylinalg.__file__)    # C:\Users\work\proj\mylinalg.py</code></pre>

<p>
  Файл с кодом на Python, который подключают через <code>import</code>, называется
  <strong>модулем</strong>. Папка с модулями и файлом <code>__init__.py</code> —
  <strong>пакетом</strong>. <strong>Библиотека</strong> — это не отдельная сущность языка,
  а просто пакет, который написал кто-то другой и который решает какую-то общую задачу.
  Для интерпретатора разницы между моим <code>mylinalg</code> и чужим <code>numpy</code> нет.
</p>

<p>
  Строка <code>import mylinalg</code> выглядит как объявление, но на самом деле это
  действие из трёх шагов: <em>найти</em> файл, <em>выполнить</em> его и <em>связать</em>
  результат с именем. Посмотрим пошагово.
</p>

<div class="stage" id="stageImport" tabindex="0">
  <div class="stage-figure">
<svg id="im" viewBox="0 0 960 520" role="img" aria-label="Как import находит файл по sys.path, выполняет его и создаёт объект-модуль">
  <style>
    #im { font-family: Helvetica, Arial, sans-serif; }
    #im .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #im .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #im .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #im .ttl { font-size: 16px; fill: #111111; font-weight: 700; }
    #im .code { font-family: "Courier New", Courier, monospace; font-size: 15px; fill: #111111; }
    #im .mono { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #im .row { fill: #FFFFFF; stroke: #C8C3B6; stroke-width: 1; }
    #im .cap { font-size: 13px; fill: #5E5850; }
    #im .elbl { font-size: 13px; fill: #5E5850; }
    #im .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #im .hitr { fill: #F0FAF0; stroke: #73B222; stroke-width: 2; }
    #im .spr { fill: none; stroke: #3576C0; stroke-width: 2.5; }
    #im .spt { font-size: 14px; fill: #2a5e9b; }
    #im .err { font-size: 14px; fill: #C30B0A; }
    #im .dot { fill: none; stroke: #C29E08; stroke-width: 2; }
    #im .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="im-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>
  <g data-key="main">
    <rect x="40" y="80" width="270" height="150" rx="8" class="bx"/>
    <text x="54" y="106" class="ttl">main.py</text>
    <text x="54" y="142" class="code">import mylinalg</text>
    <text x="54" y="170" class="code">C = mylinalg.matmul(A, B)</text>
    <text x="54" y="198" class="code">print(C)</text>
  </g>
  <g data-key="syspath">
    <rect x="370" y="80" width="260" height="210" rx="8" class="bx"/>
    <text x="384" y="106" class="ttl">sys.path — где искать</text>
    <rect x="378" y="122" width="244" height="30" rx="4" class="row"/>
    <rect x="378" y="158" width="244" height="30" rx="4" class="row"/>
    <rect x="378" y="194" width="244" height="30" rx="4" class="row"/>
    <rect x="378" y="230" width="244" height="30" rx="4" class="row"/>
    <text x="386" y="142" class="mono">[0] C:\Users\work\proj</text>
    <text x="386" y="178" class="mono">[1] …\Python312\DLLs</text>
    <text x="386" y="214" class="mono">[2] …\Python312\Lib</text>
    <text x="386" y="250" class="mono">[3] …\Lib\site-packages</text>
    <text x="384" y="280" class="cap">список сокращён; порядок = приоритет</text>
  </g>
  <g data-key="a1">
    <line x1="310" y1="137" x2="366" y2="137" class="edge" marker-end="url(#im-arw)"/>
    <text x="338" y="128" class="elbl" text-anchor="middle">ищем</text>
  </g>
  <g data-key="hit">
    <rect x="378" y="122" width="244" height="30" rx="4" class="hitr"/>
    <text x="386" y="142" class="mono">[0] C:\Users\work\proj</text>
    <line x1="622" y1="137" x2="686" y2="137" class="edge" marker-end="url(#im-arw)"/>
    <text x="656" y="128" class="elbl" text-anchor="middle">нашли</text>
  </g>
  <g data-key="file">
    <rect x="690" y="80" width="240" height="110" rx="8" class="bx"/>
    <text x="704" y="106" class="ttl">mylinalg.py</text>
    <text x="704" y="142" class="mono">def matmul(A, B):</text>
    <text x="704" y="166" class="mono">    ...три цикла...</text>
  </g>
  <g data-key="module">
    <line x1="810" y1="190" x2="810" y2="246" class="edge" marker-end="url(#im-arw)"/>
    <text x="820" y="224" class="elbl">выполнили</text>
    <rect x="690" y="250" width="240" height="140" rx="8" class="bg"/>
    <text x="704" y="276" class="ttl">объект-модуль</text>
    <text x="704" y="308" class="mono">.matmul   → функция</text>
    <text x="704" y="334" class="mono">.__name__ → 'mylinalg'</text>
    <text x="704" y="360" class="mono">.__file__ → …\mylinalg.py</text>
  </g>
  <g data-key="bind">
    <path d="M 690 345 L 175 345 L 175 234" class="edge" marker-end="url(#im-arw)"/>
    <text x="190" y="336" class="elbl">имя mylinalg → этот объект</text>
    <rect x="159" y="153" width="14" height="24" rx="3" class="dot"/>
  </g>
  <g data-key="cache">
    <rect x="370" y="380" width="260" height="80" rx="8" class="by"/>
    <text x="384" y="406" class="ttl">sys.modules — кэш</text>
    <text x="384" y="438" class="mono">'mylinalg' → объект-модуль</text>
    <path d="M 760 390 L 760 420 L 634 420" class="edge" marker-end="url(#im-arw)"/>
    <text x="646" y="446" class="elbl">запомнили</text>
  </g>
  <g data-key="sp" data-only="1">
    <rect x="376" y="228" width="248" height="34" rx="5" class="spr"/>
    <text x="40" y="418" class="spt">[3] site-packages — сюда pip</text>
    <text x="40" y="440" class="spt">кладёт установленные библиотеки</text>
  </g>
  <g data-key="err" data-only="1">
    <text x="188" y="272" class="err">нет ни в одной папке →</text>
    <text x="188" y="294" class="err">ModuleNotFoundError</text>
  </g>
  <text x="40" y="506" class="legend">синий — файлы и пути · зелёный — созданный объект · жёлтый — служебная таблица интерпретатора</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="main" data-focus="main">
      <div class="step-kicker">Шаг 1 · запрос</div>
      <h4>import — это команда, а не объявление</h4>
      <p>Интерпретатор выполняет <code>main.py</code> сверху вниз. Дойдя до
      <code>import mylinalg</code>, он останавливается: пока модуль не загружен,
      следующая строка не выполнится.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1" data-focus="syspath a1">
      <div class="step-kicker">Шаг 2 · поиск</div>
      <h4>Python перебирает папки из sys.path по порядку</h4>
      <p><code>sys.path</code> — обычный список строк. Первой в нём стоит папка запущенного
      скрипта, дальше — стандартная библиотека Python и <code>site-packages</code>.
      В каждой папке ищется <code>mylinalg.py</code> или папка-пакет <code>mylinalg\</code>.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file" data-focus="hit file">
      <div class="step-kicker">Шаг 3 · находка</div>
      <h4>Первое совпадение побеждает</h4>
      <p>Файл нашёлся уже в папке <code>[0]</code> — рядом со скриптом. Дальше поиск не идёт.
      Это правило ещё выстрелит в части 3: файл с именем чужой библиотеки рядом со скриптом
      перекроет саму библиотеку.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file module" data-focus="module">
      <div class="step-kicker">Шаг 4 · выполнение</div>
      <h4>Файл выполняется, и всё, что в нём определено, становится атрибутами</h4>
      <p>Python создаёт пустой объект типа <code>module</code> и выполняет в нём
      <code>mylinalg.py</code> сверху вниз. Строка <code>def matmul</code> создаёт объект-функцию —
      и она оседает в модуле как атрибут <code>.matmul</code>. Служебные <code>__name__</code> и
      <code>__file__</code> интерпретатор добавляет сам.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file module bind" data-focus="bind main">
      <div class="step-kicker">Шаг 5 · связывание</div>
      <h4>Имя mylinalg в main.py указывает на объект</h4>
      <p>После импорта <code>mylinalg</code> — обычная переменная, как <code>A</code> или <code>B</code>.
      Точка в <code>mylinalg.matmul</code> означает «достань атрибут объекта». Тот же самый
      механизм позже даст нам <code>np.array</code>, <code>A.shape</code> и <code>model.forward</code>.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file module bind cache" data-focus="cache">
      <div class="step-kicker">Шаг 6 · кэш</div>
      <h4>Второй import файл не перечитывает</h4>
      <p>Готовый модуль записывается в словарь <code>sys.modules</code>. Если любой другой
      файл программы снова скажет <code>import mylinalg</code>, Python сразу отдаст объект
      из кэша: код модуля выполняется один раз за запуск.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file module bind cache sp err" data-focus="sp err">
      <div class="step-kicker">Шаг 7 · чужой код</div>
      <h4>Если рядом файла нет, поиск доходит до site-packages</h4>
      <p>Для <code>import numpy</code> ничего не найдётся ни рядом со скриптом, ни в стандартной
      библиотеке. Последняя надежда — <code>site-packages</code>: именно туда
      <code>pip</code> кладёт установленные пакеты. Не нашлось и там — <code>ModuleNotFoundError</code>.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>
  Всё это можно увидеть своими глазами, не веря на слово:
</p>

<pre><code>&gt;&gt;&gt; import sys, mylinalg
&gt;&gt;&gt; sys.path[0]
'C:\\Users\\work\\proj'
&gt;&gt;&gt; 'mylinalg' in sys.modules
True
&gt;&gt;&gt; [name for name in dir(mylinalg) if not name.startswith('_')]
['matmul']</code></pre>

<div class="callout-blue">
  <strong>Откуда берётся папка __pycache__:</strong> после первого импорта рядом
  появится <code>__pycache__\mylinalg.cpython-312.pyc</code>. Это не машинный код, а
  байт-код — уже разобранный Python-текст, который интерпретатор сохраняет, чтобы при
  следующем запуске не разбирать файл заново. Удалять его безопасно.
</div>

<div class="callout-yellow">
  <strong>Почему в модулях пишут <code>if __name__ == "__main__":</code></strong> При
  импорте файл выполняется целиком. Если оставить в <code>mylinalg.py</code> строку
  <code>print(matmul(A, B))</code>, она сработает при каждом <code>import</code>. Код под
  этой проверкой выполняется, только когда файл запущен напрямую: тогда
  <code>__name__</code> равно <code>"__main__"</code>, а при импорте — <code>"mylinalg"</code>.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> import находит файл по списку <code>sys.path</code>,
  выполняет его и отдаёт объект-модуль; для интерпретатора библиотека — это ровно такой же
  модуль, только написанный не вами и лежащий в <code>site-packages</code>.
</div>

<hr>

<h2 id="part-3">Часть 3. pip install numpy: откуда берётся и где лежит код</h2>

<p>
  Теперь чужая библиотека. Сначала я создаю для проекта <strong>виртуальное окружение</strong> —
  отдельную копию папки <code>site-packages</code>, чтобы пакеты этого проекта не смешивались
  с другими, — и ставлю в него NumPy:
</p>

<pre><code>C:\Users\work\proj&gt; python -m venv .venv
C:\Users\work\proj&gt; .venv\Scripts\activate
(.venv) C:\Users\work\proj&gt; pip install numpy
Collecting numpy
  Downloading numpy-2.3.3-cp312-cp312-win_amd64.whl
Installing collected packages: numpy
Successfully installed numpy-2.3.3</code></pre>

<p>
  Здесь три действующих лица. <strong>pip</strong> — установщик пакетов; он сам написан на
  Python и лежит в том же <code>site-packages</code>. <strong>PyPI</strong> (pypi.org) — публичный
  каталог, куда авторы выкладывают свои пакеты. <strong>Колесо</strong> (wheel, файл
  <code>.whl</code>) — формат, в котором пакет приезжает: по сути это zip-архив с готовыми
  файлами, собранный под конкретную версию Python и операционную систему.
</p>

<div class="stage" id="stagePip" tabindex="0">
  <div class="stage-figure">
<svg id="pp" viewBox="0 0 960 560" role="img" aria-label="pip скачивает колесо numpy с PyPI и распаковывает его в site-packages; что лежит в папке numpy">
  <style>
    #pp { font-family: Helvetica, Arial, sans-serif; }
    #pp .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #pp .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #pp .bw  { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.6; }
    #pp .ttl { font-size: 16px; fill: #111111; font-weight: 700; }
    #pp .mono { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #pp .mono13 { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #pp .cap { font-size: 13px; fill: #5E5850; }
    #pp .elbl { font-size: 13px; fill: #5E5850; }
    #pp .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #pp .note { font-size: 13.5px; fill: #111111; }
    #pp .hg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.2; }
    #pp .hy { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.2; }
    #pp .hb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.2; }
    #pp .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="pp-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>
  <g data-key="cmd">
    <rect x="30" y="80" width="220" height="90" rx="8" class="bx"/>
    <text x="44" y="106" class="ttl">терминал</text>
    <text x="44" y="142" class="mono">&gt; pip install numpy</text>
  </g>
  <g data-key="pypi">
    <line x1="250" y1="125" x2="296" y2="125" class="edge" marker-end="url(#pp-arw)"/>
    <rect x="300" y="80" width="200" height="90" rx="8" class="by"/>
    <text x="400" y="114" class="ttl" text-anchor="middle">PyPI</text>
    <text x="400" y="140" class="cap" text-anchor="middle">pypi.org · каталог пакетов</text>
  </g>
  <g data-key="wheel">
    <line x1="500" y1="125" x2="546" y2="125" class="edge" marker-end="url(#pp-arw)"/>
    <rect x="550" y="80" width="380" height="90" rx="8" class="bw"/>
    <text x="564" y="106" class="ttl">колесо .whl = zip-архив</text>
    <text x="564" y="134" class="mono13">numpy-2.3.3-cp312-cp312-win_amd64.whl</text>
    <text x="564" y="158" class="cap">cp312 — Python 3.12 · win_amd64 — Windows x64</text>
  </g>
  <g data-key="tree">
    <line x1="740" y1="170" x2="740" y2="221" class="edge" marker-end="url(#pp-arw)"/>
    <text x="750" y="202" class="elbl">распаковал</text>
    <rect x="30" y="225" width="900" height="295" rx="8" class="bx"/>
    <text x="44" y="252" class="ttl">C:\Users\work\proj\.venv\Lib\site-packages\</text>
  </g>
  <g data-key="imp">
    <rect x="38" y="274" width="500" height="50" rx="4" class="hg"/>
    <text x="560" y="290" class="note">← import numpy находит эту папку-пакет</text>
    <text x="560" y="316" class="note">← и выполняет её __init__.py</text>
  </g>
  <g data-key="py">
    <rect x="38" y="352" width="500" height="24" rx="4" class="hb"/>
    <text x="560" y="368" class="note">← обычный Python: можно открыть и прочитать</text>
  </g>
  <g data-key="pyd">
    <rect x="38" y="378" width="500" height="24" rx="4" class="hy"/>
    <text x="560" y="394" class="note">← скомпилированный C: машинный код, не текст</text>
  </g>
  <g data-key="blas">
    <rect x="38" y="456" width="500" height="24" rx="4" class="hy"/>
    <text x="560" y="472" class="note">← OpenBLAS: быстрые матричные операции</text>
  </g>
  <g data-key="meta">
    <rect x="38" y="482" width="500" height="24" rx="4" class="hb"/>
    <text x="560" y="498" class="note">← метаданные для pip: версия, список файлов</text>
  </g>
  <g data-key="lines">
    <text x="44" y="290" class="mono">numpy\</text>
    <text x="44" y="316" class="mono">  __init__.py</text>
    <text x="44" y="342" class="mono">  _core\</text>
    <text x="44" y="368" class="mono">    multiarray.py</text>
    <text x="44" y="394" class="mono">    _multiarray_umath.cp312-win_amd64.pyd</text>
    <text x="44" y="420" class="mono">  linalg\  random\  fft\  …</text>
    <text x="44" y="446" class="mono">numpy.libs\</text>
    <text x="44" y="472" class="mono">  libscipy_openblas64_-….dll</text>
    <text x="44" y="498" class="mono">numpy-2.3.3.dist-info\</text>
  </g>
  <text x="30" y="548" class="legend">синий — файлы и папки · жёлтый — внешний источник и скомпилированный код · зелёный — то, что находит import</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="cmd" data-focus="cmd">
      <div class="step-kicker">Шаг 1 · команда</div>
      <h4>pip — это тоже программа на Python</h4>
      <p>Команда <code>pip install numpy</code> запускает пакет <code>pip</code> из активного
      окружения. Надёжнее писать <code>python -m pip install numpy</code>: так точно
      сработает pip того самого Python, которым вы потом будете запускать скрипт.</p>
    </div>
    <div class="step-panel" data-on="cmd pypi" data-focus="pypi">
      <div class="step-kicker">Шаг 2 · каталог</div>
      <h4>pip спрашивает у PyPI, какие версии numpy есть</h4>
      <p>PyPI возвращает список файлов для каждой версии. pip выбирает самую свежую версию,
      совместимую с вашим Python, и заодно проверяет зависимости — пакеты, без которых
      этот не работает. У NumPy обязательных зависимостей нет.</p>
    </div>
    <div class="step-panel" data-on="cmd pypi wheel" data-focus="wheel">
      <div class="step-kicker">Шаг 3 · колесо</div>
      <h4>Из десятков файлов выбирается один — под вашу систему</h4>
      <p>Внутри NumPy есть скомпилированный код, а машинный код для Windows и Linux разный.
      Поэтому для каждой пары «версия Python × ОС» собрано своё колесо, и теги в имени файла
      говорят, какое подходит. Скачанное колесо — это обычный zip.</p>
    </div>
    <div class="step-panel" data-on="cmd pypi wheel tree lines" data-focus="tree">
      <div class="step-kicker">Шаг 4 · распаковка</div>
      <h4>Установка — это распаковка архива в site-packages</h4>
      <p>Никакого реестра, никакой магии: pip разворачивает содержимое колеса в папку
      <code>site-packages</code> активного окружения. Удалите папку <code>numpy\</code> руками —
      и библиотеки не станет.</p>
    </div>
    <div class="step-panel" data-on="tree lines imp" data-focus="imp">
      <div class="step-kicker">Шаг 5 · импорт</div>
      <h4>import numpy идёт по тому же маршруту, что и в части 2</h4>
      <p>Перебирая <code>sys.path</code>, Python доходит до <code>site-packages</code> и находит там
      папку <code>numpy\</code> с <code>__init__.py</code> — значит, это пакет. Выполняется
      <code>__init__.py</code>, а он уже сам импортирует свои внутренние модули.</p>
    </div>
    <div class="step-panel" data-on="tree lines imp py pyd" data-focus="py pyd">
      <div class="step-kicker">Шаг 6 · два вида кода</div>
      <h4>Часть кода — Python, часть — скомпилированная</h4>
      <p><code>multiarray.py</code> можно открыть в редакторе. А <code>.pyd</code> на Windows — это
      DLL, собранная из исходников на C: Python загружает её в память процесса, и функции
      из неё выглядят как обычные Python-функции. На Linux тот же файл называется <code>.so</code>.</p>
    </div>
    <div class="step-panel" data-on="tree lines imp py pyd blas" data-focus="blas">
      <div class="step-kicker">Шаг 7 · библиотека под библиотекой</div>
      <h4>NumPy сам опирается на чужой код — OpenBLAS</h4>
      <p>BLAS — стандартный набор процедур линейной алгебры, которому несколько десятилетий.
      Колесо NumPy привозит свою копию OpenBLAS в папке <code>numpy.libs\</code>. Библиотеки
      складываются слоями: вы вызываете NumPy, NumPy вызывает BLAS.</p>
    </div>
    <div class="step-panel" data-on="tree lines imp py pyd blas meta" data-focus="meta">
      <div class="step-kicker">Шаг 8 · учёт</div>
      <h4>dist-info — паспорт установленного пакета</h4>
      <p>В <code>numpy-2.3.3.dist-info\</code> лежат версия, лицензия и список всех
      распакованных файлов. Именно отсюда берут данные <code>pip show numpy</code>,
      <code>pip list</code> и <code>pip uninstall numpy</code> — последний просто удаляет
      файлы по этому списку.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>Проверить, куда всё легло, можно двумя командами:</p>

<pre><code>(.venv) C:\Users\work\proj&gt; pip show numpy
Name: numpy
Version: 2.3.3
Location: C:\Users\work\proj\.venv\Lib\site-packages
Requires:
...

(.venv) C:\Users\work\proj&gt; python -c "import numpy; print(numpy.__file__)"
C:\Users\work\proj\.venv\Lib\site-packages\numpy\__init__.py</code></pre>

<p>
  Атрибут <code>__file__</code> — тот же, что был у моего <code>mylinalg</code>. Его стоит
  запомнить как первый инструмент отладки: если библиотека ведёт себя странно, сначала
  надо убедиться, что импортировалась именно та копия, о которой вы думаете.
</p>

<div class="callout-red">
  <strong>Классическая ловушка:</strong> назовите свой учебный скрипт <code>numpy.py</code> —
  и <code>import numpy</code> внутри любого файла этой папки импортирует его, а не библиотеку.
  Причина — правило из части 2: папка скрипта стоит в <code>sys.path</code> первой, и первое
  совпадение побеждает. Симптом — ошибки вида <code>module 'numpy' has no attribute 'array'</code>.
</div>

<div class="callout-yellow">
  <strong>Если окружение не активировано,</strong> <code>pip</code> из системного Python поставит
  пакет в другой <code>site-packages</code>, а скрипт, запущенный из <code>.venv</code>, его не
  увидит. Команда <code>python -c "import sys; print(sys.executable)"</code> показывает, какой
  именно интерпретатор сейчас работает.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> установить библиотеку — значит скачать архив с PyPI
  и распаковать его в <code>site-packages</code>; внутри лежат обычные <code>.py</code>-файлы и
  скомпилированный код, а находит их import по тому же <code>sys.path</code>.
</div>

<hr>

<h2 id="part-4">Часть 4. Объект ndarray: атрибуты, методы и путь вызова A @ B</h2>

<p>
  Повторю вычисление из части 1, но уже через NumPy. Принятое сокращение
  <code>import numpy as np</code> — тот же импорт, просто модуль привязывается к имени
  <code>np</code>, а не <code>numpy</code>:
</p>

<pre><code>import numpy as np

A = np.array([[1, 2, 0], [3, -1, 2]])
B = np.array([[2, 1], [0, 1], [1, -1]])

C = A @ B
print(C)
# [[2 3]
#  [8 0]]</code></pre>

<p>
  Ответ тот же, включая ноль в правом нижнем углу. Но теперь <code>A</code> — не список
  списков, а <strong>объект</strong> класса <code>numpy.ndarray</code>. У объекта есть
  <strong>атрибуты</strong> — готовые значения, которые читаются через точку без скобок, — и
  <strong>методы</strong> — функции, привязанные к объекту, которые вызываются со скобками.
</p>

<table class="shape-table">
  <tr><th>Выражение</th><th>Что это</th><th>Результат для A</th></tr>
  <tr><td><code>A.shape</code></td><td>атрибут: форма</td><td><code>(2, 3)</code></td></tr>
  <tr><td><code>A.dtype</code></td><td>атрибут: тип элементов</td><td><code>int64</code></td></tr>
  <tr><td><code>A.ndim</code></td><td>атрибут: число осей</td><td><code>2</code></td></tr>
  <tr><td><code>A.T</code></td><td>атрибут: транспонированный вид</td><td>массив формы <code>(3, 2)</code></td></tr>
  <tr><td><code>A.sum()</code></td><td>метод: сумма всех элементов</td><td><code>7</code></td></tr>
  <tr><td><code>A.sum(axis=0)</code></td><td>метод с аргументом: сумма по столбцам</td><td><code>[4, 1, 2]</code></td></tr>
  <tr><td><code>A.reshape(3, 2)</code></td><td>метод: та же память, другая форма</td><td><code>[[1, 2], [0, 3], [-1, 2]]</code></td></tr>
  <tr><td><code>A.dot(B)</code>, <code>np.matmul(A, B)</code></td><td>то же, что <code>A @ B</code></td><td><code>[[2, 3], [8, 0]]</code></td></tr>
</table>

<p>
  Узнать, что вообще умеет объект, можно прямо в интерпретаторе: <code>type(A)</code> скажет
  класс, <code>dir(A)</code> вернёт список всех имён (у <code>ndarray</code> в NumPy 2.x их больше
  полутора сотен, около семидесяти — без подчёркиваний), а <code>help(A.sum)</code> покажет
  документацию метода. Никакой скрытой информации: всё, что «знает» библиотека, доступно
  через те же точки и скобки.
</p>

<div class="callout-blue">
  <strong>Как вызывается метод:</strong> запись <code>A.sum(axis=0)</code> — это сокращение для
  <code>np.ndarray.sum(A, axis=0)</code>. Python находит функцию <code>sum</code> в классе объекта и
  передаёт сам объект первым аргументом — тем самым <code>self</code>, который вы пишете в своих
  классах. Метод — это обычная функция, которой не надо отдельно передавать данные: они
  приходят вместе с объектом.
</div>

<p>Теперь посмотрим, что лежит внутри объекта и куда уходит вызов <code>A @ B</code>.</p>

<div class="stage" id="stageNdarray" tabindex="0">
  <div class="stage-figure">
<svg id="nd" viewBox="0 0 960 560" role="img" aria-label="Устройство объекта ndarray и цепочка вызова A @ B от Python до скомпилированного кода">
  <style>
    #nd { font-family: Helvetica, Arial, sans-serif; }
    #nd .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #nd .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #nd .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #nd .cell { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.4; }
    #nd .ttl { font-size: 16px; fill: #111111; font-weight: 700; }
    #nd .lbl { font-size: 16px; fill: #111111; }
    #nd .mono { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #nd .mono15 { font-family: "Courier New", Courier, monospace; font-size: 15px; fill: #111111; }
    #nd .num { font-size: 18px; fill: #111111; }
    #nd .cap { font-size: 13px; fill: #5E5850; }
    #nd .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #nd .bord { stroke: #5E5850; stroke-width: 1.3; stroke-dasharray: 6 4; fill: none; }
    #nd .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="nd-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>
  <g data-key="obj">
    <rect x="30" y="70" width="400" height="250" rx="8" class="bx"/>
    <text x="44" y="96" class="ttl">A — объект numpy.ndarray</text>
    <text x="44" y="132" class="mono">shape   (2, 3)</text>
    <text x="44" y="158" class="mono">dtype   int64</text>
    <text x="44" y="184" class="mono">strides (24, 8)</text>
    <text x="44" y="210" class="mono">ndim    2</text>
    <text x="250" y="158" class="cap">как читать память</text>
  </g>
  <g data-key="buf">
    <rect x="46" y="236" width="56" height="44" class="cell"/>
    <rect x="102" y="236" width="56" height="44" class="cell"/>
    <rect x="158" y="236" width="56" height="44" class="cell"/>
    <rect x="214" y="236" width="56" height="44" class="cell"/>
    <rect x="270" y="236" width="56" height="44" class="cell"/>
    <rect x="326" y="236" width="56" height="44" class="cell"/>
    <foreignObject x="49.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="105.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <foreignObject x="161.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <foreignObject x="217.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="3"></div></foreignObject>
    <foreignObject x="267" y="238.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="-1"></div></foreignObject>
    <foreignObject x="329.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <text x="44" y="304" class="cap">data: 6 чисел по 8 байт одним блоком</text>
  </g>
  <g data-key="meth">
    <rect x="30" y="350" width="400" height="180" rx="8" class="bx"/>
    <text x="44" y="376" class="ttl">атрибуты без скобок, методы со скобками</text>
    <text x="44" y="406" class="mono">A.T.shape       → (3, 2)</text>
    <text x="44" y="432" class="mono">A.sum()         → 7</text>
    <text x="44" y="458" class="mono">A.sum(axis=0)   → [4, 1, 2]</text>
    <text x="44" y="484" class="mono">A.reshape(3, 2) → [[1,2],[0,3],[-1,2]]</text>
    <text x="44" y="510" class="mono">A @ B           → ?</text>
  </g>
  <g data-key="c1">
    <rect x="480" y="70" width="450" height="50" rx="8" class="bx"/>
    <text x="705" y="101" class="mono15" text-anchor="middle">ваш код:  C = A @ B</text>
  </g>
  <g data-key="c2">
    <line x1="705" y1="120" x2="705" y2="146" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="480" y="150" width="450" height="50" rx="8" class="by"/>
    <text x="705" y="172" class="mono15" text-anchor="middle">A.__matmul__(B)</text>
    <text x="705" y="192" class="cap" text-anchor="middle">оператор @ — это вызов метода объекта A</text>
  </g>
  <g data-key="c3">
    <line x1="705" y1="200" x2="705" y2="226" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="480" y="230" width="450" height="50" rx="8" class="by"/>
    <text x="705" y="252" class="mono15" text-anchor="middle">np.matmul(A, B)</text>
    <text x="705" y="272" class="cap" text-anchor="middle">проверка форм, выбор цикла по dtype</text>
  </g>
  <g data-key="border">
    <line x1="470" y1="300" x2="940" y2="300" class="bord"/>
    <text x="935" y="293" class="cap" text-anchor="end">Python</text>
    <text x="935" y="316" class="cap" text-anchor="end">машинный код</text>
  </g>
  <g data-key="c4a">
    <line x1="640" y1="280" x2="592" y2="321" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="480" y="325" width="215" height="60" rx="8" class="by"/>
    <text x="587" y="350" class="lbl" text-anchor="middle">C-цикл NumPy</text>
    <text x="587" y="372" class="cap" text-anchor="middle">int64 — наш пример</text>
  </g>
  <g data-key="c4b">
    <line x1="770" y1="280" x2="818" y2="321" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="715" y="325" width="215" height="60" rx="8" class="by"/>
    <text x="822" y="350" class="lbl" text-anchor="middle">OpenBLAS · dgemm</text>
    <text x="822" y="372" class="cap" text-anchor="middle">float64 / float32</text>
  </g>
  <g data-key="c5">
    <line x1="587" y1="385" x2="640" y2="416" class="edge" marker-end="url(#nd-arw)"/>
    <line x1="822" y1="385" x2="770" y2="416" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="480" y="420" width="450" height="56" rx="8" class="bg"/>
    <text x="705" y="444" class="lbl" text-anchor="middle">новый объект ndarray</text>
    <text x="705" y="466" class="mono15" text-anchor="middle">[[2, 3], [8, 0]]</text>
  </g>
  <text x="30" y="548" class="legend">синий — данные и ваш код · жёлтый — операции библиотеки · зелёный — результат · пунктир — граница Python и C</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="obj" data-focus="obj">
      <div class="step-kicker">Шаг 1 · объект</div>
      <h4>np.array создаёт объект с описанием данных</h4>
      <p>Функция <code>np.array</code> берёт список списков и строит объект <code>ndarray</code>.
      В его заголовке записано, как понимать данные: форма <code>(2, 3)</code>, тип
      <code>int64</code> (целые числа по 8 байт) и шаги по осям.</p>
    </div>
    <div class="step-panel" data-on="obj buf" data-focus="buf">
      <div class="step-kicker">Шаг 2 · память</div>
      <h4>Сами числа лежат одним сплошным блоком</h4>
      <p>В отличие от списка списков, где каждое число — отдельный Python-объект где-то в
      памяти, здесь шесть чисел идут подряд. <code>strides = (24, 8)</code> читается так: чтобы
      перейти на следующую строку, сдвинься на 24 байта (3 числа × 8), на следующий столбец — на 8.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth" data-focus="meth">
      <div class="step-kicker">Шаг 3 · интерфейс</div>
      <h4>Атрибуты читают заголовок, методы запускают работу</h4>
      <p><code>A.T</code> и <code>A.reshape(3, 2)</code> не копируют числа: они создают новый
      заголовок с другими <code>shape</code> и <code>strides</code> поверх того же блока памяти.
      Последняя строка — <code>A @ B</code> — пока со знаком вопроса: разберём, куда он ведёт.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2" data-focus="c1 c2">
      <div class="step-kicker">Шаг 4 · оператор</div>
      <h4>@ — это вызов метода __matmul__</h4>
      <p>Встретив <code>A @ B</code>, Python ищет у объекта <code>A</code> метод
      <code>__matmul__</code> и вызывает его с аргументом <code>B</code>. Так работают все операторы:
      <code>+</code> — это <code>__add__</code>, <code>[i]</code> — <code>__getitem__</code>.
      Библиотека просто определила эти методы для своего класса.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2 c3" data-focus="c3">
      <div class="step-kicker">Шаг 5 · диспетчер</div>
      <h4>np.matmul проверяет формы и выбирает реализацию</h4>
      <p>Здесь делается то, чего не хватало моей функции: проверка, что внутренние размеры
      совпадают (иначе — понятная <code>ValueError</code>), расчёт формы результата и выбор
      конкретного цикла под тип данных. <code>np.matmul</code> — это <em>ufunc</em>, у неё
      есть отдельная реализация для каждого <code>dtype</code>.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2 c3 border c4a" data-focus="border c4a">
      <div class="step-kicker">Шаг 6 · граница</div>
      <h4>Для целых чисел работает собственный C-цикл NumPy</h4>
      <p>Пересекаем пунктир: дальше — машинный код из <code>.pyd</code>. По сути это те же три
      вложенных цикла из части 1, только написанные на C и работающие с сырыми байтами, без
      Python-объекта на каждое число. Наш <code>int64</code>-пример идёт именно сюда.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2 c3 border c4a c4b" data-focus="c4b">
      <div class="step-kicker">Шаг 7 · ещё глубже</div>
      <h4>Для float — процедура dgemm из OpenBLAS</h4>
      <p>Если сделать <code>A.astype(float) @ B.astype(float)</code>, диспетчер передаст работу
      в BLAS — ту самую <code>.dll</code> из <code>numpy.libs\</code>. Ответ тот же,
      <code>[[2., 3.], [8., 0.]]</code>, а вызов прошёл ещё через один слой чужого кода.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2 c3 border c4a c4b c5" data-focus="c5">
      <div class="step-kicker">Шаг 8 · возврат</div>
      <h4>Обратно в Python возвращается новый объект</h4>
      <p>Результат упаковывается в свежий <code>ndarray</code> формы <code>(2, 2)</code> и
      становится значением выражения. Для вас весь путь — одна строка; граница между Python и C
      пересечена один раз туда и один раз обратно.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout-blue">
  <strong>Почему это быстрее циклов, если внутри те же циклы:</strong> в части 1 на каждое
  из 12 умножений интерпретатор разбирал индексы, доставал Python-объекты чисел и создавал
  новые. Здесь граница Python↔C пересекается один раз на всю операцию, а внутри C-кода
  числа — просто байты в памяти. Библиотека выигрывает не другой математикой, а тем, что
  выносит цикл за пределы интерпретатора.
</div>


<h3>Внутри оригинала: исходный код ndarray и matmul</h3>

<p>
  До сих пор я смотрел на <code>ndarray</code> снаружи — через точки и скобки. Но это чужой
  код, и он открыт: NumPy лежит на GitHub, и можно прочитать ровно те строки, которые
  выполняются при <code>A @ B</code>. Для разработчика это полезнее любого пересказа: по
  исходнику видно, что функция принимает, что возвращает и в каком месте в её работу можно
  вмешаться. Ссылки ниже ведут на тег <code>v2.5.3</code> — так номера строк не уедут, когда
  в основной ветке что-то поменяют.
</p>

<table class="shape-table">
  <tr><th>Файл в numpy/numpy</th><th>Что в нём</th></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/include/numpy/ndarraytypes.h#L790-L839" target="_blank" rel="noopener"><code>include/numpy/ndarraytypes.h</code></a></td><td>структура <code>PyArrayObject_fields</code> — то, чем объект <code>A</code> является в памяти</td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/multiarray/arrayobject.c#L1263" target="_blank" rel="noopener"><code>src/multiarray/arrayobject.c</code></a></td><td>тип <code>PyArray_Type</code>: имя <code>"numpy.ndarray"</code> и таблицы слотов, в том числе для операторов</td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/multiarray/number.c#L290-L295" target="_blank" rel="noopener"><code>src/multiarray/number.c</code></a></td><td>функция <code>array_matrix_multiply</code> — то, что стоит за <code>@</code></td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/code_generators/generate_umath.py#L1177-L1184" target="_blank" rel="noopener"><code>code_generators/generate_umath.py</code></a></td><td>объявление ufunc <code>matmul</code>: два входа, один выход, сигнатура форм</td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/code_generators/ufunc_docstrings.py#L2764" target="_blank" rel="noopener"><code>code_generators/ufunc_docstrings.py</code></a></td><td>документация: параметры и возвращаемое значение — тот текст, что печатает <code>help(np.matmul)</code></td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/umath/matmul.c.src#L447-L642" target="_blank" rel="noopener"><code>src/umath/matmul.c.src</code></a></td><td>внутренние циклы: шаблон, из которого собирается отдельная функция под каждый тип</td></tr>
</table>

<p>Пройду по ним в том порядке, в каком их проходит вызов, а в конце — по местам, где в этот путь можно встроить свой код.</p>

<div class="stage" id="stageSource" tabindex="0">
  <div class="stage-figure">
<svg id="sc" viewBox="0 0 960 690" role="img" aria-label="Исходный код NumPy за объектом ndarray и вызовом A @ B: C-структура, файлы репозитория, контракт np.matmul и четыре точки, где разработчик может вмешаться">
  <style>
    #sc { font-family: Helvetica, Arial, sans-serif; }
    #sc .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #sc .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #sc .bw  { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.3; }
    #sc .hk  { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.6; stroke-dasharray: 6 4; }
    #sc .ttl { font-size: 15px; font-weight: 700; fill: #111111; }
    #sc .sub { font-size: 13px; font-weight: 700; fill: #5E5850; }
    #sc .mono { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #sc .mono12 { font-family: "Courier New", Courier, monospace; font-size: 12px; fill: #111111; white-space: pre; }
    #sc .mono15 { font-family: "Courier New", Courier, monospace; font-size: 15px; font-weight: 700; fill: #111111; }
    #sc .file { font-family: "Courier New", Courier, monospace; font-size: 12px; fill: #8c7106; }
    #sc .filb { font-family: "Courier New", Courier, monospace; font-size: 12px; fill: #2a5e9b; }
    #sc .cap  { font-size: 13px; fill: #5E5850; }
    #sc .capr { font-size: 13px; fill: #C30B0A; }
    #sc .capg { font-size: 13px; font-weight: 700; fill: #5a8c1c; }
    #sc .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #sc .map  { stroke: #5E5850; stroke-width: 1; stroke-dasharray: 3 3; fill: none; }
    #sc .yed  { stroke: #C29E08; stroke-width: 1.5; stroke-dasharray: 5 4; fill: none; }
    #sc .hed  { stroke: #3576C0; stroke-width: 1.6; stroke-dasharray: 5 4; fill: none; }
    #sc .brk  { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    #sc .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="sc-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="sc-arwb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="sc-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
  </defs>
  <g data-key="st">
<rect x="290" y="40" width="360" height="260" rx="8" class="bw"/>
<text x="304" y="64" class="ttl">C-структура за объектом A</text>
<text x="304" y="84" class="file">numpy/_core/include/numpy/ndarraytypes.h</text>
<text x="304" y="112" class="mono">PyObject_HEAD</text>
<text x="490" y="112" class="cap">счётчик ссылок и тип</text>
<text x="304" y="134" class="mono">char *data;</text>
<text x="490" y="134" class="cap">адрес буфера</text>
<text x="304" y="156" class="mono">int nd;</text>
<text x="490" y="156" class="cap">число осей</text>
<text x="304" y="178" class="mono">npy_intp *dimensions;</text>
<text x="490" y="178" class="cap">размеры по осям</text>
<text x="304" y="200" class="mono">npy_intp *strides;</text>
<text x="490" y="200" class="cap">шаги по осям в байтах</text>
<text x="304" y="222" class="mono">PyObject *base;</text>
<text x="490" y="222" class="cap">чей это буфер</text>
<text x="304" y="244" class="mono">PyArray_Descr *descr;</text>
<text x="490" y="244" class="cap">тип элемента</text>
<text x="304" y="266" class="mono">int flags;</text>
<text x="490" y="266" class="cap">биты: порядок, запись</text>
<text x="304" y="288" class="cap">+ weakreflist, _buffer_info, mem_handler</text>
  </g>
  <g data-key="py">
<rect x="30" y="40" width="222" height="260" rx="8" class="bx"/>
<text x="44" y="64" class="ttl">A в Python</text>
<text x="44" y="84" class="cap">атрибут → что вернёт</text>
<text x="44" y="112" class="mono">type(A) → ndarray</text>
<line x1="254" y1="108" x2="288" y2="108" class="map"/>
<text x="44" y="134" class="mono">A.ctypes.data → адрес</text>
<line x1="254" y1="130" x2="288" y2="130" class="map"/>
<text x="44" y="156" class="mono">A.ndim → 2</text>
<line x1="254" y1="152" x2="288" y2="152" class="map"/>
<text x="44" y="178" class="mono">A.shape → (2, 3)</text>
<line x1="254" y1="174" x2="288" y2="174" class="map"/>
<text x="44" y="200" class="mono">A.strides → (24, 8)</text>
<line x1="254" y1="196" x2="288" y2="196" class="map"/>
<text x="44" y="222" class="mono">A.base → None</text>
<line x1="254" y1="218" x2="288" y2="218" class="map"/>
<text x="44" y="244" class="mono">A.dtype → int64</text>
<line x1="254" y1="240" x2="288" y2="240" class="map"/>
<text x="44" y="266" class="mono">A.flags → C_CONTIGUOUS</text>
<line x1="254" y1="262" x2="288" y2="262" class="map"/>
<text x="44" y="288" class="cap">из Python не видно</text>
  </g>
  <g data-key="ct">
<rect x="680" y="40" width="250" height="260" rx="8" class="by"/>
<text x="694" y="64" class="ttl">np.matmul: контракт</text>
<text x="694" y="88" class="mono">(n?,k),(k,m?)-&gt;(n?,m?)</text>
<text x="694" y="112" class="sub">принимает</text>
<text x="694" y="130" class="mono">x1, x2</text>
<text x="770" y="130" class="cap">два массива</text>
<text x="694" y="148" class="mono">out=</text>
<text x="770" y="148" class="cap">готовый буфер</text>
<text x="694" y="166" class="mono">dtype=</text>
<text x="770" y="166" class="cap">тип вычисления</text>
<text x="694" y="184" class="mono">axes=</text>
<text x="770" y="184" class="cap">где оси-матрицы</text>
<text x="694" y="202" class="cap">и casting, order, subok</text>
<text x="694" y="226" class="sub">возвращает</text>
<text x="694" y="244" class="cap">новый ndarray (n, m)</text>
<text x="694" y="262" class="cap">или сам out, если передан</text>
<text x="694" y="280" class="cap">скаляр, если оба 1-D</text>
<line x1="660" y1="338" x2="738" y2="304" class="yed" marker-end="url(#sc-arwy)"/>
  </g>
  <g data-key="c1">
<rect x="30" y="340" width="200" height="90" rx="8" class="bx"/>
<text x="130" y="366" class="mono15" text-anchor="middle">C = A @ B</text>
<text x="130" y="388" class="cap" text-anchor="middle">ваш Python-код</text>
<text x="130" y="410" class="capg" text-anchor="middle">C — новый ndarray</text>
  </g>
  <g data-key="c2">
<line x1="230" y1="385" x2="259" y2="385" class="edge" marker-end="url(#sc-arw)"/>
<rect x="263" y="340" width="200" height="90" rx="8" class="by"/>
<text x="363" y="366" class="mono" text-anchor="middle">array_matrix_multiply</text>
<text x="363" y="388" class="file" text-anchor="middle">multiarray/number.c</text>
<text x="363" y="410" class="cap" text-anchor="middle">слот nb_matrix_multiply</text>
<path d="M 263 334 L 263 326 L 929 326 L 929 334" class="brk"/>
<text x="470" y="319" class="cap" text-anchor="middle">эти три блока — в _multiarray_umath.pyd</text>
  </g>
  <g data-key="c3">
<line x1="463" y1="385" x2="492" y2="385" class="edge" marker-end="url(#sc-arw)"/>
<rect x="496" y="340" width="200" height="90" rx="8" class="by"/>
<text x="596" y="366" class="mono" text-anchor="middle">ufunc np.matmul</text>
<text x="596" y="388" class="file" text-anchor="middle">generate_umath.py</text>
<text x="596" y="410" class="cap" text-anchor="middle">формы, dtype, выбор цикла</text>
  </g>
  <g data-key="c4">
<line x1="696" y1="385" x2="725" y2="385" class="edge" marker-end="url(#sc-arw)"/>
<rect x="729" y="340" width="200" height="90" rx="8" class="by"/>
<text x="829" y="366" class="mono" text-anchor="middle">@TYPE@_matmul</text>
<text x="829" y="388" class="file" text-anchor="middle">umath/matmul.c.src</text>
<text x="829" y="410" class="cap" text-anchor="middle">3 цикла или cblas_dgemm</text>
  </g>
  <g data-key="h1">
<rect x="30" y="480" width="200" height="170" rx="8" class="hk"/>
<line x1="130" y1="478" x2="130" y2="436" class="hed" marker-end="url(#sc-arwb)"/>
<text x="40" y="504" class="ttl">① подкласс</text>
<text x="40" y="528" class="mono12">class My(np.ndarray):</text>
<text x="40" y="546" class="mono12">  def __matmul__(s, o):</text>
<text x="40" y="564" class="mono12">    print(s.shape)</text>
<text x="40" y="582" class="mono12">    return super()…</text>
<text x="40" y="610" class="cap">меняет @ только</text>
<text x="40" y="628" class="cap">для ваших объектов</text>
  </g>
  <g data-key="h2">
<rect x="263" y="480" width="200" height="170" rx="8" class="hk"/>
<line x1="400" y1="478" x2="556" y2="436" class="hed" marker-end="url(#sc-arwb)"/>
<text x="273" y="504" class="ttl">② аргументы функции</text>
<text x="273" y="528" class="mono12">np.matmul(A, B,</text>
<text x="273" y="546" class="mono12">    out=C,</text>
<text x="273" y="564" class="mono12">    dtype=np.float64)</text>
<text x="273" y="592" class="cap">у оператора @ таких</text>
<text x="273" y="610" class="cap">параметров нет</text>
<text x="273" y="628" class="cap">out: без нового массива</text>
  </g>
  <g data-key="h3">
<rect x="496" y="480" width="200" height="170" rx="8" class="hk"/>
<line x1="620" y1="478" x2="620" y2="436" class="hed" marker-end="url(#sc-arwb)"/>
<text x="506" y="504" class="ttl">③ __array_ufunc__</text>
<text x="506" y="528" class="mono12">class Spy:</text>
<text x="506" y="546" class="mono12"> def __array_ufunc__(</text>
<text x="506" y="564" class="mono12">   s, uf, m, *a, **kw):</text>
<text x="506" y="592" class="cap">ваш объект получает</text>
<text x="506" y="610" class="cap">вызов ufunc целиком</text>
<text x="506" y="628" class="cap">так устроены CuPy, Dask</text>
  </g>
  <g data-key="h4">
<rect x="729" y="480" width="200" height="170" rx="8" class="hk"/>
<line x1="829" y1="478" x2="829" y2="436" class="hed" marker-end="url(#sc-arwb)"/>
<text x="739" y="504" class="ttl">④ правка исходника</text>
<text x="739" y="528" class="mono12">git clone … numpy</text>
<text x="739" y="546" class="mono12"># правка matmul.c.src</text>
<text x="739" y="564" class="mono12">pip install .</text>
<text x="739" y="592" class="capr">нужен компилятор C</text>
<text x="739" y="610" class="capr">и своя сборка .pyd</text>
<text x="739" y="628" class="cap">крайний случай</text>
  </g>
  <text x="30" y="676" class="legend">синий — ваш код и данные · жёлтый — код NumPy · зелёный — результат · синий пунктир — где разработчик может вмешаться</text>

</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="st" data-focus="st">
      <div class="step-kicker">Шаг 1 · структура</div>
      <h4>В оригинале ndarray — это C-структура</h4>
      <p>Объект <code>A</code> в памяти — экземпляр <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/include/numpy/ndarraytypes.h#L790-L839" target="_blank" rel="noopener"><code>PyArrayObject_fields</code></a> из <code>ndarraytypes.h</code>.
      Самих чисел в ней нет: есть указатель <code>data</code> на отдельный буфер, число осей
      <code>nd</code>, два массива длины <code>nd</code> — <code>dimensions</code> и <code>strides</code> —
      и указатель <code>descr</code> на описание типа. «Заголовок» из предыдущей сцены — ровно эти поля.</p>
    </div>
    <div class="step-panel" data-on="st py" data-focus="py">
      <div class="step-kicker">Шаг 2 · Python ↔ C</div>
      <h4>Атрибуты Python — это чтение полей</h4>
      <p><code>A.shape</code> собирает кортеж из <code>dimensions</code>, <code>A.dtype</code> отдаёт объект по
      указателю <code>descr</code>, <code>A.base</code> — поле <code>base</code>. Поэтому атрибуты дешёвые:
      они ничего не вычисляют. <code>A.T</code> создаёт новую структуру с переставленными
      <code>dimensions</code> и <code>strides</code>, тем же <code>data</code> и <code>base</code>, указывающим на
      <code>A</code>: <code>A.T.base is A</code> даёт <code>True</code>.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2" data-focus="c1 c2">
      <div class="step-kicker">Шаг 3 · оператор</div>
      <h4>@ попадает в слот nb_matrix_multiply</h4>
      <p>Тип <code>ndarray</code> в C описан структурой <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/multiarray/arrayobject.c#L1263" target="_blank" rel="noopener"><code>PyArray_Type</code></a>, у неё есть таблица числовых
      операций. Под оператор <code>@</code> там записана функция <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/multiarray/number.c#L290-L295" target="_blank" rel="noopener"><code>array_matrix_multiply</code></a> из <code>number.c</code> —
      всего две строки: проверить, не хочет ли второй операнд обработать <code>@</code> сам, и вызвать
      <code>np.matmul(A, B)</code>. Из Python это видно так: <code>np.ndarray.__matmul__</code> печатается как
      <code>&lt;slot wrapper '__matmul__'&gt;</code>.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct" data-focus="c3 ct">
      <div class="step-kicker">Шаг 4 · контракт</div>
      <h4>Что np.matmul принимает и что возвращает</h4>
      <p>Сама <code>np.matmul</code> объявлена одной записью в <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/code_generators/generate_umath.py#L1177-L1184" target="_blank" rel="noopener"><code>generate_umath.py</code></a>: два входа, один выход и
      сигнатура <code>(n?,k),(k,m?)-&gt;(n?,m?)</code>. Читается так: у первого массива последние оси
      <span class="math-inline" data-tex="n\times k"></span>, у второго <span class="math-inline" data-tex="k\times m"></span>, у результата <span class="math-inline" data-tex="n\times m"></span>; вопросительный знак значит,
      что ось может отсутствовать, — так умножаются векторы. Всё левее двух последних осей работает
      как пачка матриц. Параметры и возвращаемое значение описаны в <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/code_generators/ufunc_docstrings.py#L2764" target="_blank" rel="noopener"><code>ufunc_docstrings.py</code></a>.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же A и B</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="(n\times k)\cdot(k\times m) = (2\times 3)\cdot(3\times 2)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="n\times m = 2\times 2"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> если внутренние размеры не совпадут,
        как в <code>A @ A</code>, ufunc остановится именно здесь — с <code>ValueError</code> про
        <em>mismatch in its core dimension</em>, до всякого умножения.</p>
      </div>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct c4" data-focus="c4">
      <div class="step-kicker">Шаг 5 · внутренний цикл</div>
      <h4>Внутренний цикл — шаблон на C</h4>
      <p><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/umath/matmul.c.src#L447-L642" target="_blank" rel="noopener"><code>matmul.c.src</code></a> — не обычный C-файл, а шаблон: блок <code>/**begin repeat</code> при сборке размножает
      функцию <code>@TYPE@_matmul</code> в 19 копий, по одной на тип, — это те 19 вариантов, которые
      показывает <code>len(np.matmul.types)</code>. Для <code>int64</code> (на Windows это <code>LONGLONG_matmul</code>)
      работает <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/umath/matmul.c.src#L266-L320" target="_blank" rel="noopener"><code>@TYPE@_matmul_inner_noblas</code></a>: три вложенных цикла из части 1, только шаг по памяти берётся из
      <code>strides</code>. Для <code>float32</code> и <code>float64</code>, если массивы лежат в памяти подряд,
      та же функция отдаёт работу в <code>cblas_sgemm</code> / <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/umath/matmul.c.src#L236" target="_blank" rel="noopener"><code>cblas_dgemm</code></a> из OpenBLAS.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct c4 h2" data-focus="h2">
      <div class="step-kicker">Шаг 6 · способ 1</div>
      <h4>Передать то, что не пролезает через @</h4>
      <p>У оператора ровно два операнда, а у функции — весь контракт из шага 4. <code>out=C</code>
      пишет результат в заранее выделенный массив и возвращает его же: <code>R is C</code> — <code>True</code>,
      новый объект не создаётся, что заметно в цикле обучения. <code>dtype=np.float64</code> приводит целые
      к float и уводит вызов в ветку BLAS. <code>axes=</code> говорит, какие оси считать матрицей, если
      они не последние.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct c4 h2 h1 h3" data-focus="h1 h3">
      <div class="step-kicker">Шаг 7 · способы 2 и 3</div>
      <h4>Подменить поведение снаружи, не трогая NumPy</h4>
      <p>Подкласс <code>ndarray</code> переопределяет <code>__matmul__</code> на уровне Python и зовёт
      родителя через <code>super()</code> — так логируют формы или проверяют единицы измерения.
      Протокол <code>__array_ufunc__</code> работает глубже: если у операнда есть такой метод,
      <code>np.matmul</code> не считает сама, а отдаёт ему вызов целиком — ufunc, способ и аргументы.
      На этом держатся CuPy и Dask: <code>np.matmul</code> от их массивов считается на видеокарте или по блокам.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct c4 h2 h1 h3 h4" data-focus="h4">
      <div class="step-kicker">Шаг 8 · способ 4</div>
      <h4>Изменить сам NumPy — и собрать заново</h4>
      <p>Если нужно другое поведение внутри цикла, правится <code>matmul.c.src</code> в клоне
      репозитория, а затем NumPy собирается из исходников в вашем окружении: <code>pip install .</code>
      вызовет Meson и компилятор C. На выходе — ваш собственный <code>_multiarray_umath.pyd</code>.</p>
      <div class="callout-red">
        <strong>Цена:</strong> каждую новую версию NumPy придётся переносить вручную, а коллегам — ставить
        вашу сборку. Поэтому этот путь последний: сначала аргументы, подкласс или протокол.
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>Три способа, которые не требуют трогать NumPy, в одном файле — вывод проверен на NumPy 2.5.3:</p>

<pre><code>import numpy as np

A = np.array([[1, 2, 0], [3, -1, 2]])
B = np.array([[2, 1], [0, 1], [1, -1]])

# 1. Аргументы, которых нет у оператора @
C = np.empty((2, 2), dtype=np.int64)
R = np.matmul(A, B, out=C)
print(R is C)                             # True — результат лёг в мой буфер
print(np.matmul(A, B, dtype=np.float64))  # [[2. 3.]
                                          #  [8. 0.]] — ветка float/BLAS

# 2. Подкласс: меняю поведение @ для своего типа
class LogArr(np.ndarray):
    def __matmul__(self, other):
        print(f"@: {self.shape} x {np.shape(other)}")
        return super().__matmul__(other)

L = A.view(LogArr)
L @ B                                     # @: (2, 3) x (3, 2)

# 3. Протокол: чужой объект перехватывает ufunc
class Spy:
    def __init__(self, a):
        self.a = np.asarray(a)
    def __array_ufunc__(self, ufunc, method, *inputs, **kwargs):
        print("перехват:", ufunc.__name__, method)
        inputs = [x.a if isinstance(x, Spy) else x for x in inputs]
        return getattr(ufunc, method)(*inputs, **kwargs)

A @ Spy(B)                                # перехват: matmul __call__</code></pre>

<div class="callout-yellow">
  <strong>Как найти такое место самому:</strong> <code>np.matmul.signature</code> печатает сигнатуру
  форм, <code>np.matmul.types</code> — список внутренних циклов (<code>'qq-&gt;q'</code>,
  <code>'dd-&gt;d'</code> и так далее), а <code>np.ndarray.__matmul__</code> — что это слот C-типа, а не
  Python-функция. Дальше имя ищется поиском по репозиторию на GitHub. Править такое «на месте» в
  <code>site-packages</code> не получится: там лежит уже скомпилированный <code>.pyd</code>, исходника
  <code>matmul.c.src</code> в колесе нет.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> объект библиотеки — это данные плюс методы,
  а <code>A @ B</code> — вызов метода, который один раз переходит из Python в
  скомпилированный код, делает там те же три цикла и возвращает новый объект. Код этого
  пути открыт, и в него можно встроиться: аргументами функции, подклассом, протоколом
  <code>__array_ufunc__</code> или, в крайнем случае, пересборкой.
</div>

<hr>

<h2 id="part-5">Часть 5. Нейросеть на NumPy: весь пайплайн руками</h2>

<p>
  Теперь соберу из тех же умножений нейросеть. Самая простая — <strong>полносвязная сеть
  прямого распространения</strong> (FFN): вход из двух чисел, скрытый слой из двух нейронов с
  активацией ReLU, один выход. Каждый слой — это ровно то умножение из части 1 плюс сдвиг:
</p>

<div class="math-display" data-tex="z_1 = x W_1 + b_1, \qquad h = \max(z_1, 0), \qquad \hat{y} = h W_2 + b_2, \qquad L = (\hat{y} - y)^2"></div>

<p>
  Здесь <code>x</code> — вход формы <span class="math-inline" data-tex="1\times 2"></span>, <span class="math-inline" data-tex="W_{1}"></span> — матрица весов <span class="math-inline" data-tex="2\times 2"></span>,
  <span class="math-inline" data-tex="W_{2}"></span> — <span class="math-inline" data-tex="2\times 1"></span>, <code>b</code> — сдвиги, <code>L</code> — ошибка
  (среднеквадратичная, MSE). Обучение сети — это цикл из четырёх действий:
  <strong>forward</strong> (посчитать ответ), <strong>loss</strong> (посчитать ошибку),
  <strong>backward</strong> (посчитать, как ошибка зависит от каждого веса) и
  <strong>шаг</strong> (сдвинуть веса против градиента).
</p>

<p>
  Backward — это цепное правило, применённое к каждой формуле forward в обратном порядке.
  Для нашей сети его можно выписать целиком:
</p>

<div class="math-display" data-tex="\begin{aligned}
\frac{\partial L}{\partial \hat{y}} &amp;= 2(\hat{y}-y), &amp;
\frac{\partial L}{\partial W_2} &amp;= h^{\top}\frac{\partial L}{\partial \hat{y}}, &amp;
\frac{\partial L}{\partial b_2} &amp;= \frac{\partial L}{\partial \hat{y}}, \\
\frac{\partial L}{\partial h} &amp;= \frac{\partial L}{\partial \hat{y}}\,W_2^{\top}, &amp;
\frac{\partial L}{\partial z_1} &amp;= \frac{\partial L}{\partial h}\odot \mathbf{1}[z_1&gt;0], &amp;
\frac{\partial L}{\partial W_1} &amp;= x^{\top}\frac{\partial L}{\partial z_1}, \quad \frac{\partial L}{\partial b_1} = \frac{\partial L}{\partial z_1}
\end{aligned}"></div>

<p>
  Каждую из этих строк на NumPy придётся написать самому. Библиотека даёт быстрое
  <code>@</code>, транспонирование <code>.T</code> и поэлементные операции, но понятия
  не имеет, что такое «слой», «ошибка» или «градиент». Посмотрим одну итерацию обучения
  пошагово, на конкретных числах: слева — матрицы с формами, справа — строка кода, которая их считает.
</p>

<div class="stage" id="stageFFN" tabindex="0">
  <div class="stage-figure">
<svg id="ff" viewBox="0 0 960 640" role="img" aria-label="Одна итерация обучения сети 2-2-1 на NumPy: формы, матрицы прямого прохода, кэш, градиенты с проверкой форм и шаг обновления, рядом — строки кода">
  <style>
    #ff { font-family: Helvetica, Arial, sans-serif; }
    #ff .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ff .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ff .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ff .br  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #ff .bw  { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.2; }
    #ff .cb  { fill: #EEF5FF; stroke: #3576C0; stroke-width: 1; }
    #ff .cy  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1; }
    #ff .cg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1; }
    #ff .cr  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1; }
    #ff .cn  { fill: #FAFAFA; stroke: #5E5850; stroke-width: 1; }
    #ff .rb  { fill: #F0F6FC; }
    #ff .ry  { fill: #FFFBEB; }
    #ff .ct  { font-size: 15px; font-weight: 700; fill: #111111; }
    #ff .sn  { font-size: 14px; fill: #111111; }
    #ff .vt  { font-size: 17px; font-weight: 700; fill: #111111; }
    #ff .mlb { font-size: 15px; font-weight: 700; fill: #111111; }
    #ff .lbl { font-size: 15px; fill: #111111; }
    #ff .th  { font-size: 13px; font-weight: 700; fill: #5E5850; }
    #ff .cap { font-size: 13px; fill: #5E5850; }
    #ff .shp { font-size: 13px; fill: #5E5850; }
    #ff .red { font-size: 14px; fill: #C30B0A; }
    #ff .grn { font-size: 15px; font-weight: 700; fill: #5a8c1c; }
    #ff .opx { font-size: 22px; fill: #5E5850; }
    #ff .mono { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #ff .code { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #ff .cmt  { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #5E5850; }
    #ff .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #ff .fb   { fill: none; stroke: #3576C0; stroke-width: 3; }
    #ff .fbd  { fill: none; stroke: #3576C0; stroke-width: 2.4; stroke-dasharray: 6 4; }
    #ff .frd  { fill: none; stroke: #C30B0A; stroke-width: 3; }
    #ff .fgn  { fill: none; stroke: #73B222; stroke-width: 3; }
    #ff .ab   { stroke: #3576C0; stroke-width: 2; fill: none; }
    #ff .ar   { stroke: #C30B0A; stroke-width: 2; fill: none; }
    #ff .dsh  { fill: none; stroke: #C30B0A; stroke-width: 2; stroke-dasharray: 5 3; }
    #ff .sep  { stroke: #E4E0D8; stroke-width: 1; }
    #ff .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ff-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="ff-arwb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="ff-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
  </defs>
  <rect x="30" y="40" width="70" height="44" rx="8" class="bx"/>
  <foreignObject x="42" y="47.5" width="46" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="x"></div></foreignObject>
  <rect x="130" y="40" width="70" height="44" rx="8" class="by"/>
  <text x="165" y="67" class="sn" text-anchor="middle">Linear 1</text>
  <rect x="230" y="40" width="70" height="44" rx="8" class="by"/>
  <text x="265" y="67" class="sn" text-anchor="middle">ReLU</text>
  <rect x="330" y="40" width="70" height="44" rx="8" class="by"/>
  <text x="365" y="67" class="sn" text-anchor="middle">Linear 2</text>
  <rect x="430" y="40" width="70" height="44" rx="8" class="by"/>
  <text x="465" y="67" class="sn" text-anchor="middle">MSE</text>
  <rect x="530" y="40" width="70" height="44" rx="8" class="br"/>
  <foreignObject x="542" y="47.5" width="46" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="L"></div></foreignObject>
  <line x1="100" y1="62" x2="126" y2="62" class="edge" marker-end="url(#ff-arw)"/>
  <line x1="200" y1="62" x2="226" y2="62" class="edge" marker-end="url(#ff-arw)"/>
  <line x1="300" y1="62" x2="326" y2="62" class="edge" marker-end="url(#ff-arw)"/>
  <line x1="400" y1="62" x2="426" y2="62" class="edge" marker-end="url(#ff-arw)"/>
  <line x1="500" y1="62" x2="526" y2="62" class="edge" marker-end="url(#ff-arw)"/>
  <g data-key="cur-l1" data-only="1">
<rect x="126" y="36" width="78" height="52" rx="10" class="fb"/>
<line x1="65" y1="100" x2="159" y2="100" class="ab" marker-end="url(#ff-arwb)"/>
  </g>
  <g data-key="cur-relu" data-only="1">
<rect x="226" y="36" width="78" height="52" rx="10" class="fb"/>
<line x1="65" y1="100" x2="259" y2="100" class="ab" marker-end="url(#ff-arwb)"/>
  </g>
  <g data-key="cur-head" data-only="1">
<rect x="326" y="36" width="78" height="52" rx="10" class="fb"/>
<rect x="426" y="36" width="78" height="52" rx="10" class="fb"/>
<rect x="526" y="36" width="78" height="52" rx="10" class="fb"/>
<line x1="65" y1="100" x2="559" y2="100" class="ab" marker-end="url(#ff-arwb)"/>
  </g>
  <g data-key="cur-cache" data-only="1">
<rect x="26" y="36" width="78" height="52" rx="10" class="fbd"/>
<rect x="226" y="36" width="78" height="52" rx="10" class="fbd"/>
<rect x="326" y="36" width="78" height="52" rx="10" class="fbd"/>
<text x="600" y="104" class="cap" text-anchor="end">кэш forward</text>
  </g>
  <g data-key="cur-b2" data-only="1">
<rect x="326" y="36" width="78" height="52" rx="10" class="frd"/>
<rect x="426" y="36" width="78" height="52" rx="10" class="frd"/>
<line x1="565" y1="100" x2="371" y2="100" class="ar" marker-end="url(#ff-arwr)"/>
  </g>
  <g data-key="cur-brelu" data-only="1">
<rect x="226" y="36" width="78" height="52" rx="10" class="frd"/>
<line x1="565" y1="100" x2="271" y2="100" class="ar" marker-end="url(#ff-arwr)"/>
  </g>
  <g data-key="cur-b1" data-only="1">
<rect x="126" y="36" width="78" height="52" rx="10" class="frd"/>
<line x1="565" y1="100" x2="171" y2="100" class="ar" marker-end="url(#ff-arwr)"/>
  </g>
  <g data-key="cur-upd" data-only="1">
<rect x="126" y="36" width="78" height="52" rx="10" class="fgn"/>
<rect x="326" y="36" width="78" height="52" rx="10" class="fgn"/>
<foreignObject x="442" y="85.8" width="158" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:13px;color:#5E5850;font-weight:400" data-tex="\theta \leftarrow \theta - \mathrm{lr}\cdot d\theta"></div></foreignObject>
  </g>
  <rect x="620" y="40" width="310" height="540" rx="8" class="bw"/>
  <text x="634" y="64" class="mlb">код одной итерации</text>
  <text x="634" y="96" class="cmt"># forward</text>
  <g data-key="k-z1">
<text x="634" y="122" class="code">z1 = x @ W1 + b1</text>
  </g>
  <g data-key="k-h">
<text x="634" y="148" class="code">h = np.maximum(z1, 0)</text>
  </g>
  <g data-key="k-yhat">
<text x="634" y="174" class="code">y_hat = h @ W2 + b2</text>
  </g>
  <g data-key="k-loss">
<text x="634" y="200" class="code">loss = ((y_hat - y) ** 2).mean()</text>
  </g>
  <text x="634" y="238" class="cmt"># backward</text>
  <g data-key="k-dy">
<text x="634" y="264" class="code">d_yhat = 2 * (y_hat - y) / y.size</text>
  </g>
  <g data-key="k-dw2">
<text x="634" y="290" class="code">dW2 = h.T @ d_yhat</text>
  </g>
  <g data-key="k-db2">
<text x="634" y="316" class="code">db2 = d_yhat.sum(axis=0)</text>
  </g>
  <g data-key="k-dh">
<text x="634" y="342" class="code">dh = d_yhat @ W2.T</text>
  </g>
  <g data-key="k-dz1">
<text x="634" y="368" class="code">dz1 = dh * (z1 &gt; 0)</text>
  </g>
  <g data-key="k-dw1">
<text x="634" y="394" class="code">dW1 = x.T @ dz1</text>
  </g>
  <g data-key="k-db1">
<text x="634" y="420" class="code">db1 = dz1.sum(axis=0)</text>
  </g>
  <text x="634" y="458" class="cmt"># шаг, lr = 0.01</text>
  <g data-key="k-upd">
<text x="634" y="484" class="code">W1 -= lr * dW1;  b1 -= lr * db1</text>
<text x="634" y="510" class="code">W2 -= lr * dW2;  b2 -= lr * db2</text>
  </g>
  <text x="634" y="560" class="cap">каждую строку пишу я сам</text>
  <g data-key="v-tab" data-only="1">
<text x="30" y="134" class="vt">Обозначения и формы</text>
<text x="44" y="172" class="th">код</text>
<text x="112" y="172" class="th">в формуле</text>
<text x="190" y="172" class="th">форма</text>
<text x="248" y="172" class="th">значение</text>
<text x="462" y="172" class="th">роль</text>
<rect x="34" y="183" width="562" height="26" class="rb"/>
<line x1="34" y1="209" x2="596" y2="209" class="sep"/>
<text x="44" y="202" class="mono">x</text>
<foreignObject x="112" y="180.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="x"></div></foreignObject>
<foreignObject x="190" y="182.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<text x="248" y="202" class="code">[[1, 2]]</text>
<text x="462" y="202" class="cap">вход (данные)</text>
<rect x="34" y="211" width="562" height="26" class="rb"/>
<line x1="34" y1="237" x2="596" y2="237" class="sep"/>
<text x="44" y="230" class="mono">y</text>
<foreignObject x="112" y="208.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="y"></div></foreignObject>
<foreignObject x="190" y="210.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="1\times 1"></div></foreignObject>
<text x="248" y="230" class="code">[[2]]</text>
<text x="462" y="230" class="cap">правильный ответ</text>
<rect x="34" y="239" width="562" height="26" class="ry"/>
<line x1="34" y1="265" x2="596" y2="265" class="sep"/>
<text x="44" y="258" class="mono">W1</text>
<foreignObject x="112" y="236.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="W_{1}"></div></foreignObject>
<foreignObject x="190" y="238.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="2\times 2"></div></foreignObject>
<text x="248" y="258" class="code">[[0.5, −1], [0.25, 0.5]]</text>
<text x="462" y="258" class="cap">веса слоя 1</text>
<rect x="34" y="267" width="562" height="26" class="ry"/>
<line x1="34" y1="293" x2="596" y2="293" class="sep"/>
<text x="44" y="286" class="mono">b1</text>
<foreignObject x="112" y="264.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="b_{1}"></div></foreignObject>
<text x="190" y="286" class="mono">(2,)</text>
<text x="248" y="286" class="code">[0, −0.5]</text>
<text x="462" y="286" class="cap">сдвиг слоя 1</text>
<rect x="34" y="295" width="562" height="26" class="ry"/>
<line x1="34" y1="321" x2="596" y2="321" class="sep"/>
<text x="44" y="314" class="mono">W2</text>
<foreignObject x="112" y="292.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="W_{2}"></div></foreignObject>
<foreignObject x="190" y="294.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="2\times 1"></div></foreignObject>
<text x="248" y="314" class="code">[[2], [1]]</text>
<text x="462" y="314" class="cap">веса слоя 2</text>
<rect x="34" y="323" width="562" height="26" class="ry"/>
<line x1="34" y1="349" x2="596" y2="349" class="sep"/>
<text x="44" y="342" class="mono">b2</text>
<foreignObject x="112" y="320.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="b_{2}"></div></foreignObject>
<text x="190" y="342" class="mono">(1,)</text>
<text x="248" y="342" class="code">[0.5]</text>
<text x="462" y="342" class="cap">сдвиг слоя 2</text>
<line x1="34" y1="377" x2="596" y2="377" class="sep"/>
<text x="44" y="370" class="mono">z1</text>
<foreignObject x="112" y="348.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="z_{1}"></div></foreignObject>
<foreignObject x="190" y="350.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<text x="248" y="370" class="cap">считается</text>
<text x="462" y="370" class="cap">до активации</text>
<line x1="34" y1="405" x2="596" y2="405" class="sep"/>
<text x="44" y="398" class="mono">h</text>
<foreignObject x="112" y="376.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="h"></div></foreignObject>
<foreignObject x="190" y="378.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<text x="248" y="398" class="cap">считается</text>
<text x="462" y="398" class="cap">после ReLU</text>
<line x1="34" y1="433" x2="596" y2="433" class="sep"/>
<text x="44" y="426" class="mono">y_hat</text>
<foreignObject x="112" y="404.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="\hat{y}"></div></foreignObject>
<foreignObject x="190" y="406.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="1\times 1"></div></foreignObject>
<text x="248" y="426" class="cap">считается</text>
<text x="462" y="426" class="cap">ответ сети</text>
<text x="34" y="468" class="cap">синий фон — данные, жёлтый — параметры, без фона — промежуточное</text>
<text x="34" y="492" class="cap">(2,) — одномерный сдвиг: при сложении растягивается на каждую строку</text>
<foreignObject x="34" y="497.8" width="523" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>правило форм то же, что в части 1: <span data-tex="(a\times b)\cdot(b\times c) \to a\times c"></span></span></div></foreignObject>
  </g>
  <g data-key="v-l1" data-only="1">
<foreignObject x="30" y="109.9" width="354" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:700"><span>Linear 1: <span data-tex="z_1 = x \cdot W_1 + b_1"></span></span></div></foreignObject>
<rect x="40" y="214" width="52" height="34" class="cb"/>
<foreignObject x="42.5" y="214.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="92" y="214" width="52" height="34" class="cb"/>
<foreignObject x="94.5" y="214.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<foreignObject x="68.5" y="182.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
<foreignObject x="60" y="248.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<text x="164" y="238" class="opx" text-anchor="middle">·</text>
<rect x="184" y="196" width="52" height="34" class="cy"/>
<foreignObject x="176" y="196.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.5"></div></foreignObject>
<rect x="236" y="196" width="52" height="34" class="cy"/>
<foreignObject x="233" y="196.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="-1"></div></foreignObject>
<rect x="184" y="230" width="52" height="34" class="cy"/>
<foreignObject x="170.5" y="230.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.25"></div></foreignObject>
<rect x="236" y="230" width="52" height="34" class="cy"/>
<foreignObject x="228" y="230.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.5"></div></foreignObject>
<foreignObject x="207" y="164.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="W_{1}"></div></foreignObject>
<foreignObject x="204" y="264.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="2\times 2"></div></foreignObject>
<text x="308" y="238" class="opx" text-anchor="middle">+</text>
<rect x="328" y="214" width="52" height="34" class="cy"/>
<foreignObject x="330.5" y="214.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<rect x="380" y="214" width="52" height="34" class="cy"/>
<foreignObject x="366.5" y="214.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="-0.5"></div></foreignObject>
<foreignObject x="351" y="182.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="b_{1}"></div></foreignObject>
<text x="380" y="267" class="shp" text-anchor="middle">(2,)</text>
<text x="452" y="238" class="opx" text-anchor="middle">=</text>
<rect x="472" y="214" width="52" height="34" class="cb"/>
<foreignObject x="474.5" y="214.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="524" y="214" width="52" height="34" class="cb"/>
<foreignObject x="510.5" y="214.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="-0.5"></div></foreignObject>
<foreignObject x="495" y="182.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="z_{1}"></div></foreignObject>
<foreignObject x="492" y="248.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<foreignObject x="40" y="320.5" width="338" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="z_{1}[0] = 1\cdot 0.5 + 2\cdot 0.25 + 0 = 1"></div></foreignObject>
<foreignObject x="40" y="348.5" width="389" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="z_{1}[1] = 1\cdot (-1) + 2\cdot 0.5 - 0.5 = -0.5"></div></foreignObject>
<rect x="36" y="394" width="400" height="30" rx="8" class="bg"/>
<foreignObject x="48" y="392.6" width="446" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span><span data-tex="(1\times 2)\cdot(2\times 2) \to 1\times 2"></span>, сдвиг (2,) <span data-tex="\to 1\times 2"></span> ✓</span></div></foreignObject>
<foreignObject x="40" y="437.8" width="644" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>второй нейрон до сдвига дал ровно <span data-tex="0"></span> — сдвиг <span data-tex="-0.5"></span> увёл его в минус</span></div></foreignObject>
  </g>
  <g data-key="v-relu" data-only="1">
<foreignObject x="30" y="109.9" width="281" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:700"><span>ReLU: <span data-tex="h = \max(z_1,\ 0)"></span></span></div></foreignObject>
<rect x="40" y="190" width="52" height="34" class="cb"/>
<foreignObject x="42.5" y="190.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="92" y="190" width="52" height="34" class="cb"/>
<foreignObject x="78.5" y="190.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="-0.5"></div></foreignObject>
<foreignObject x="40" y="158.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700" data-tex="z_{1}"></div></foreignObject>
<rect x="40" y="262" width="52" height="34" class="cn"/>
<foreignObject x="42.5" y="262.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="92" y="262" width="52" height="34" class="cn"/>
<foreignObject x="94.5" y="262.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<foreignObject x="40" y="230.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700"><span>маска <span data-tex="z_1 &gt; 0"></span></span></div></foreignObject>
<rect x="40" y="334" width="52" height="34" class="cb"/>
<foreignObject x="42.5" y="334.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="92" y="334" width="52" height="34" class="cb"/>
<foreignObject x="94.5" y="334.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<foreignObject x="40" y="302.6" width="187" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700"><span><span data-tex="h = z_1 \odot"></span> маска</span></div></foreignObject>
<rect x="89" y="185" width="58" height="44" rx="6" class="dsh"/>
<rect x="89" y="257" width="58" height="44" rx="6" class="dsh"/>
<rect x="89" y="329" width="58" height="44" rx="6" class="dsh"/>
<text x="160" y="286" class="red">нейрон 2</text>
<line x1="316" y1="380" x2="578" y2="380" class="edge" marker-end="url(#ff-arw)"/>
<line x1="440" y1="404" x2="440" y2="232" class="edge" marker-end="url(#ff-arw)"/>
<foreignObject x="572" y="379.8" width="45" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="z"></div></foreignObject>
<foreignObject x="448" y="223.8" width="45" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="h"></div></foreignObject>
<line x1="520" y1="376" x2="520" y2="384" class="edge"/>
<foreignObject x="497.5" y="379.8" width="45" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1"></div></foreignObject>
<line x1="436" y1="300" x2="444" y2="300" class="edge"/>
<foreignObject x="385" y="286.8" width="45" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:13px;color:#5E5850;font-weight:400" data-tex="1"></div></foreignObject>
<polyline points="320,380 440,380 560,260" fill="none" stroke="#C29E08" stroke-width="3"/>
<circle cx="520" cy="300" r="7" fill="#3576C0"/>
<foreignObject x="530" y="303.8" width="120" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="z = 1 \to h = 1"></div></foreignObject>
<circle cx="400" cy="380" r="7" fill="#C30B0A"/>
<foreignObject x="231" y="346.5" width="157" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:14px;color:#C30B0A;font-weight:400" data-tex="z = -0.5 \to h = 0"></div></foreignObject>
<foreignObject x="40" y="437.8" width="635" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>у ReLU нет параметров; для backward ей нужна только маска <span data-tex="z_1 &gt; 0"></span></span></div></foreignObject>
  </g>
  <g data-key="v-head" data-only="1">
<foreignObject x="30" y="109.9" width="636" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:700"><span>Linear 2 и ошибка: <span data-tex="\hat{y} = h \cdot W_2 + b_2,\quad L = (\hat{y} - y)^2"></span></span></div></foreignObject>
<rect x="40" y="214" width="52" height="34" class="cb"/>
<foreignObject x="42.5" y="214.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="92" y="214" width="52" height="34" class="cb"/>
<foreignObject x="94.5" y="214.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<foreignObject x="68.5" y="182.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="h"></div></foreignObject>
<foreignObject x="60" y="248.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<text x="164" y="238" class="opx" text-anchor="middle">·</text>
<rect x="184" y="196" width="52" height="34" class="cy"/>
<foreignObject x="186.5" y="196.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<rect x="184" y="230" width="52" height="34" class="cy"/>
<foreignObject x="186.5" y="230.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<foreignObject x="181" y="164.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="W_{2}"></div></foreignObject>
<foreignObject x="178" y="264.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="2\times 1"></div></foreignObject>
<text x="258" y="238" class="opx" text-anchor="middle">+</text>
<rect x="280" y="214" width="52" height="34" class="cy"/>
<foreignObject x="272" y="214.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.5"></div></foreignObject>
<foreignObject x="277" y="182.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="b_{2}"></div></foreignObject>
<text x="306" y="267" class="shp" text-anchor="middle">(1,)</text>
<text x="354" y="238" class="opx" text-anchor="middle">=</text>
<rect x="376" y="214" width="52" height="34" class="cg"/>
<foreignObject x="368" y="214.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2.5"></div></foreignObject>
<foreignObject x="378.5" y="182.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="\hat{y}"></div></foreignObject>
<foreignObject x="370" y="248.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 1"></div></foreignObject>
<foreignObject x="40" y="310.5" width="288" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="\hat{y} = 1\cdot 2 + 0\cdot 1 + 0.5 = 2.5"></div></foreignObject>
<foreignObject x="40" y="335.8" width="560" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>вход второго нейрона <span data-tex="0"></span> — его вес <span data-tex="W_2[1] = 1"></span> ничего не дал</span></div></foreignObject>
<rect x="36" y="384" width="404" height="40" rx="8" class="br"/>
<foreignObject x="50" y="390.5" width="359" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="L = (\hat{y} - y)^2 = (2.5 - 2)^2 = 0.25"></div></foreignObject>
<text x="40" y="456" class="cap">одно число, которое дальше будем уменьшать</text>
  </g>
  <g data-key="v-cache" data-only="1">
<text x="30" y="134" class="vt">Что forward оставляет для backward</text>
<text x="44" y="176" class="th">переменная</text>
<text x="160" y="176" class="th">значение</text>
<text x="300" y="176" class="th">где нужна в backward</text>
<rect x="34" y="188" width="562" height="32" rx="6" class="rb"/>
<text x="44" y="210" class="mono">x</text>
<text x="160" y="210" class="mono">[[1, 2]]</text>
<text x="300" y="210" class="mono">dW1 = x.T @ dz1</text>
<rect x="34" y="226" width="562" height="32" rx="6" class="rb"/>
<text x="44" y="248" class="mono">z1</text>
<text x="160" y="248" class="mono">[[1, −0.5]]</text>
<text x="300" y="248" class="mono">маска z1 &gt; 0 в ReLU</text>
<rect x="34" y="264" width="562" height="32" rx="6" class="rb"/>
<text x="44" y="286" class="mono">h</text>
<text x="160" y="286" class="mono">[[1, 0]]</text>
<text x="300" y="286" class="mono">dW2 = h.T @ d_yhat</text>
<rect x="34" y="302" width="562" height="32" rx="6" class="ry"/>
<text x="44" y="324" class="mono">W2</text>
<text x="160" y="324" class="mono">[[2], [1]]</text>
<text x="300" y="324" class="mono">dh = d_yhat @ W2.T</text>
<text x="40" y="386" class="cap">в NumPy кэш — просто переменные, которые ещё живы в цикле:</text>
<text x="40" y="408" class="cap">перезапишу z1 до backward — и маску ReLU уже не восстановить</text>
<text x="40" y="440" class="cap">в PyTorch эти значения за меня сохраняет autograd (часть 6)</text>
  </g>
  <g data-key="v-b2" data-only="1">
<text x="30" y="134" class="vt">Назад через ошибку и Linear 2</text>
<foreignObject x="40" y="154.6" width="673" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>цепное правило: <span data-tex="\partial L/\partial W_2 = h^{\top} \cdot \partial L/\partial \hat{y},\quad \partial L/\partial h = \partial L/\partial \hat{y} \cdot W_2^{\top}"></span></span></div></foreignObject>
<foreignObject x="40" y="186.5" width="359" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="d\hat{y} = 2\cdot (\hat{y} - y) = 2\cdot (2.5 - 2) = 1"></div></foreignObject>
<foreignObject x="40" y="242.5" width="167" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="dW_{2} = h^{\top} \cdot  d\hat{y}"></div></foreignObject>
<rect x="190" y="232" width="52" height="34" class="cb"/>
<foreignObject x="192.5" y="232.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="190" y="266" width="52" height="34" class="cb"/>
<foreignObject x="192.5" y="266.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<text x="262" y="274" class="opx" text-anchor="middle">·</text>
<rect x="282" y="250" width="52" height="34" class="cr"/>
<foreignObject x="284.5" y="250.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<text x="354" y="274" class="opx" text-anchor="middle">=</text>
<rect x="376" y="232" width="52" height="34" class="cr"/>
<foreignObject x="378.5" y="232.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="376" y="266" width="52" height="34" class="cr"/>
<foreignObject x="378.5" y="266.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<foreignObject x="444" y="253.8" width="186" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="2\times 1"></span> = форма <span data-tex="W_2"></span> ✓</span></div></foreignObject>
<foreignObject x="40" y="336.5" width="167" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="dh = d\hat{y} \cdot  W_{2}^{\top}"></div></foreignObject>
<rect x="190" y="334" width="52" height="34" class="cr"/>
<foreignObject x="192.5" y="334.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<text x="262" y="358" class="opx" text-anchor="middle">·</text>
<rect x="282" y="334" width="52" height="34" class="cy"/>
<foreignObject x="284.5" y="334.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<rect x="334" y="334" width="52" height="34" class="cy"/>
<foreignObject x="336.5" y="334.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<text x="406" y="358" class="opx" text-anchor="middle">=</text>
<rect x="428" y="334" width="52" height="34" class="cr"/>
<foreignObject x="430.5" y="334.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<rect x="480" y="334" width="52" height="34" class="cr"/>
<foreignObject x="482.5" y="334.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<foreignObject x="392" y="368.8" width="176" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="1\times 2"></span> = форма <span data-tex="h"></span> ✓</span></div></foreignObject>
<foreignObject x="40" y="408.5" width="570" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400"><span><span data-tex="db_2 = d\hat{y} = 1"></span> — сдвиг получает градиент выхода целиком</span></div></foreignObject>
<text x="40" y="464" class="cap">градиент по параметру всегда той же формы, что сам параметр</text>
  </g>
  <g data-key="v-brelu" data-only="1">
<foreignObject x="30" y="109.9" width="452" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:700"><span>Назад через ReLU: <span data-tex="dz_1 = dh \odot \text{маска}"></span></span></div></foreignObject>
<foreignObject x="40" y="150.6" width="500" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>цепное правило: <span data-tex="\partial L/\partial z_1 = \partial L/\partial h \odot \mathrm{ReLU}&#x27;(z_1)"></span></span></div></foreignObject>
<foreignObject x="40" y="174.6" width="371" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span><span data-tex="\mathrm{ReLU}&#x27;(z) = 1"></span> при <span data-tex="z &gt; 0"></span>, иначе <span data-tex="0"></span></span></div></foreignObject>
<rect x="40" y="236" width="52" height="34" class="cr"/>
<foreignObject x="42.5" y="236.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<rect x="92" y="236" width="52" height="34" class="cr"/>
<foreignObject x="94.5" y="236.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<foreignObject x="63" y="204.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="dh"></div></foreignObject>
<foreignObject x="60" y="270.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<text x="164" y="260" class="opx" text-anchor="middle">⊙</text>
<rect x="184" y="236" width="52" height="34" class="cn"/>
<foreignObject x="186.5" y="236.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="236" y="236" width="52" height="34" class="cn"/>
<foreignObject x="238.5" y="236.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<text x="236" y="226" class="mlb" text-anchor="middle">маска</text>
<foreignObject x="204" y="270.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<text x="308" y="260" class="opx" text-anchor="middle">=</text>
<rect x="328" y="236" width="52" height="34" class="cr"/>
<foreignObject x="330.5" y="236.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<rect x="380" y="236" width="52" height="34" class="cr"/>
<foreignObject x="382.5" y="236.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<foreignObject x="346" y="204.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="dz_{1}"></div></foreignObject>
<foreignObject x="348" y="270.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<rect x="89" y="231" width="58" height="44" rx="6" class="dsh"/>
<rect x="233" y="231" width="58" height="44" rx="6" class="dsh"/>
<rect x="377" y="231" width="58" height="44" rx="6" class="dsh"/>
<text x="40" y="340" class="red">нейрон 2 в forward выдал 0 → через него градиент не проходит</text>
<text x="40" y="366" class="red">это «мёртвый» ReLU в миниатюре</text>
  </g>
  <g data-key="v-b1" data-only="1">
<foreignObject x="30" y="109.9" width="624" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:700"><span>Назад через Linear 1: <span data-tex="dW_1 = x^{\top} \cdot dz_1,\quad db_1 = dz_1"></span></span></div></foreignObject>
<rect x="40" y="196" width="52" height="34" class="cb"/>
<foreignObject x="42.5" y="196.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="1"></div></foreignObject>
<rect x="40" y="230" width="52" height="34" class="cb"/>
<foreignObject x="42.5" y="230.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<foreignObject x="37" y="164.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="x^{\top}"></div></foreignObject>
<foreignObject x="34" y="264.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="2\times 1"></div></foreignObject>
<text x="112" y="238" class="opx" text-anchor="middle">·</text>
<rect x="132" y="214" width="52" height="34" class="cr"/>
<foreignObject x="134.5" y="214.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<rect x="184" y="214" width="52" height="34" class="cr"/>
<foreignObject x="186.5" y="214.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<foreignObject x="150" y="182.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="dz_{1}"></div></foreignObject>
<foreignObject x="152" y="248.8" width="64" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 2"></div></foreignObject>
<text x="256" y="238" class="opx" text-anchor="middle">=</text>
<rect x="278" y="196" width="52" height="34" class="cr"/>
<foreignObject x="280.5" y="196.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<rect x="330" y="196" width="52" height="34" class="cr"/>
<foreignObject x="332.5" y="196.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<rect x="278" y="230" width="52" height="34" class="cr"/>
<foreignObject x="280.5" y="230.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="4"></div></foreignObject>
<rect x="330" y="230" width="52" height="34" class="cr"/>
<foreignObject x="332.5" y="230.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<foreignObject x="296" y="164.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="dW_{1}"></div></foreignObject>
<foreignObject x="237" y="264.8" width="186" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="2\times 2"></span> = форма <span data-tex="W_1"></span> ✓</span></div></foreignObject>
<rect x="327" y="193" width="58" height="74" rx="6" class="dsh"/>
<text x="398" y="238" class="red">столбец нейрона 2 — нули</text>
<foreignObject x="40" y="320.5" width="520" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400"><span><span data-tex="dW_1[i][j] = x[i] \cdot dz_1[j]"></span> — внешнее произведение</span></div></foreignObject>
<foreignObject x="40" y="350.5" width="217" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="db_1 = dz_1 = [2,\ 0]"></div></foreignObject>
<foreignObject x="40" y="389.8" width="401" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="dx"></span> не считаю: <span data-tex="x"></span> — данные, их не обучают</span></div></foreignObject>
  </g>
  <g data-key="v-upd" data-only="1">
<foreignObject x="30" y="109.9" width="464" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:700"><span>Шаг: <span data-tex="W_1 \leftarrow W_1 - \mathrm{lr} \cdot dW_1,\quad \mathrm{lr} = 0.01"></span></span></div></foreignObject>
<rect x="40" y="196" width="52" height="34" class="cy"/>
<foreignObject x="32" y="196.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.5"></div></foreignObject>
<rect x="92" y="196" width="52" height="34" class="cy"/>
<foreignObject x="89" y="196.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="-1"></div></foreignObject>
<rect x="40" y="230" width="52" height="34" class="cy"/>
<foreignObject x="26.5" y="230.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.25"></div></foreignObject>
<rect x="92" y="230" width="52" height="34" class="cy"/>
<foreignObject x="84" y="230.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.5"></div></foreignObject>
<foreignObject x="63" y="164.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="W_{1}"></div></foreignObject>
<text x="164" y="238" class="opx" text-anchor="middle">−</text>
<foreignObject x="145.5" y="216.6" width="101" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="0.01\,\cdot"></div></foreignObject>
<rect x="228" y="196" width="52" height="34" class="cr"/>
<foreignObject x="230.5" y="196.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="2"></div></foreignObject>
<rect x="280" y="196" width="52" height="34" class="cr"/>
<foreignObject x="282.5" y="196.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<rect x="228" y="230" width="52" height="34" class="cr"/>
<foreignObject x="230.5" y="230.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="4"></div></foreignObject>
<rect x="280" y="230" width="52" height="34" class="cr"/>
<foreignObject x="282.5" y="230.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0"></div></foreignObject>
<foreignObject x="246" y="164.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="dW_{1}"></div></foreignObject>
<text x="352" y="238" class="opx" text-anchor="middle">=</text>
<rect x="374" y="196" width="52" height="34" class="cg"/>
<foreignObject x="360.5" y="196.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.48"></div></foreignObject>
<rect x="426" y="196" width="52" height="34" class="cg"/>
<foreignObject x="423" y="196.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="-1"></div></foreignObject>
<rect x="374" y="230" width="52" height="34" class="cg"/>
<foreignObject x="360.5" y="230.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.21"></div></foreignObject>
<rect x="426" y="230" width="52" height="34" class="cg"/>
<foreignObject x="418" y="230.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="0.5"></div></foreignObject>
<foreignObject x="365" y="164.6" width="122" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700"><span>новый <span data-tex="W_1"></span></span></div></foreignObject>
<foreignObject x="40" y="296.5" width="540" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#111111;font-weight:400" data-tex="b_1 \to [-0.02,\ -0.5] \qquad W_2 \to [1.99,\ 1]^{\top} \qquad b_2 \to 0.49"></div></foreignObject>
<foreignObject x="40" y="325.8" width="513" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>второй столбец <span data-tex="W_1"></span> не изменился — его градиент был <span data-tex="0"></span></span></div></foreignObject>
<rect x="36" y="378" width="480" height="40" rx="8" class="bg"/>
<foreignObject x="50" y="382.6" width="608" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#5a8c1c;font-weight:700"><span>повторный forward: <span data-tex="\hat{y} = 2.2412,\; L = 0.0582"></span> (было <span data-tex="0.25"></span>)</span></div></foreignObject>
  </g>
  <text x="30" y="624" class="legend">синий — данные и активации · жёлтый — слои и параметры · зелёный — ответ и обновление · красный — ошибка и градиенты</text>

</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="v-tab k-z1 k-h k-yhat k-loss k-dy k-dw2 k-db2 k-dh k-dz1 k-dw1 k-db1 k-upd" data-focus="v-tab">
      <div class="step-kicker">Шаг 1 · обозначения</div>
      <h4>Сначала — формы всех массивов</h4>
      <p>Вход <code>x = [[1, 2]]</code> — одна строка из двух признаков, правильный ответ <code>y = 2</code>.
      Параметры — четыре обычных массива NumPy; объекта «слой» нет, есть переменные, которые я
      договорился так понимать. Справа — весь код одной итерации: дальше каждый шаг подсвечивает
      только те строки, которые объясняет.</p>
    </div>
    <div class="step-panel" data-on="cur-l1 v-l1 k-z1" data-focus="v-l1">
      <div class="step-kicker">Шаг 2 · первый слой</div>
      <h4>Linear 1 — умножение из части 1 плюс сдвиг</h4>
      <p>Строка <code>z1 = x @ W1 + b1</code>: каждый элемент <span class="math-inline" data-tex="z_{1}"></span> — строка <code>x</code>, умноженная
      на столбец <span class="math-inline" data-tex="W_{1}"></span>. Сдвиг формы <code>(2,)</code> NumPy растягивает на строку сам — это
      broadcasting; в пачке из N примеров он так же прибавился бы к каждой из N строк.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="(1\cdot0.5 + 2\cdot0.25,\; 1\cdot(-1) + 2\cdot0.5) + (0,\,-0.5)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="z_1 = (1,\; -0.5)"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> второй нейрон до сдвига
        дал ровно 0, и отрицательный сдвиг −0.5 увёл его в минус — на следующем шаге это решит его судьбу.</p>
      </div>
    </div>
    <div class="step-panel" data-on="cur-relu v-relu k-h" data-focus="v-relu">
      <div class="step-kicker">Шаг 3 · активация</div>
      <h4>ReLU обнуляет отрицательное</h4>
      <p><code>h = np.maximum(z1, 0)</code> — поэлементный максимум с нулём: первый нейрон пропускает 1
      как есть, второй выдаёт 0. Удобно смотреть на это как на маску <span class="math-inline" data-tex="z_1 &gt; 0"></span>, умноженную на
      <span class="math-inline" data-tex="z_{1}"></span>: та же маска понадобится на обратном пути. Без этой нелинейности два линейных слоя
      схлопнулись бы в один.</p>
    </div>
    <div class="step-panel" data-on="cur-head v-head k-yhat k-loss" data-focus="v-head">
      <div class="step-kicker">Шаг 4 · ответ и ошибка</div>
      <h4>Linear 2 даёт ответ, MSE — одно число ошибки</h4>
      <p><code>y_hat = h @ W2 + b2 = 2.5</code>: второй нейрон в ответ ничего не внёс, его вход — ноль.
      <code>loss = ((y_hat - y) ** 2).mean() = 0.25</code> — сеть ответила на 0.5 больше нужного. Forward
      закончен; дальше вопрос, какие веса и в какую сторону в этом виноваты.</p>
    </div>
    <div class="step-panel" data-on="cur-cache v-cache k-dw2 k-dh k-dz1 k-dw1" data-focus="v-cache">
      <div class="step-kicker">Шаг 5 · кэш</div>
      <h4>Что нужно запомнить из forward</h4>
      <p>Каждая формула backward читает что-то из прямого прохода: <code>x</code> и <code>h</code> — для
      градиентов весов, <span class="math-inline" data-tex="z_{1}"></span> — для маски ReLU, <span class="math-inline" data-tex="W_{2}"></span> — чтобы передать ошибку в скрытый
      слой. На NumPy этот «кэш» — просто переменные, которые ещё живы; справа подсвечены строки,
      которые их читают.</p>
    </div>
    <div class="step-panel" data-on="cur-b2 v-b2 k-dy k-dw2 k-db2 k-dh" data-focus="v-b2">
      <div class="step-kicker">Шаг 6 · назад через второй слой</div>
      <h4>Градиенты идут справа налево</h4>
      <p>Производная ошибки по ответу — <span class="math-inline" data-tex="2\cdot(2.5 - 2) = 1"></span>. Через <code>Linear 2</code> она
      раздаётся на веса, сдвиг и вход слоя. Сначала цепное правило, потом то же в матричном виде — и
      проверка: градиент по параметру обязан иметь форму самого параметра.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Три формулы — три строки кода</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">dW2</div>
            <div class="math-display worked-trace-math" data-tex="h^{\top}\cdot 1 = (1,\;0)^{\top}"></div>
            <div class="worked-trace-note">вес молчащего нейрона не виноват — его вход был 0</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">db2</div>
            <div class="math-display worked-trace-math" data-tex="1"></div>
            <div class="worked-trace-note">сдвиг получает градиент выхода целиком</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">dh</div>
            <div class="math-display worked-trace-math" data-tex="1\cdot W_2^{\top} = (2,\;1)"></div>
            <div class="worked-trace-note">ошибка, переданная назад в скрытый слой</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> каждый градиент — снова
        матричное умножение, только с транспонированными матрицами.</p>
      </div>
    </div>
    <div class="step-panel" data-on="cur-brelu v-brelu k-dz1" data-focus="v-brelu">
      <div class="step-kicker">Шаг 7 · назад через ReLU</div>
      <h4>ReLU пропускает градиент только там, где пропускала сигнал</h4>
      <p>Производная ReLU — та же маска: 1, где <span class="math-inline" data-tex="z_1 &gt; 0"></span>, и 0 в остальных местах. Поэтому
      <code>dz1 = dh * (z1 &gt; 0)</code> <span class="math-inline" data-tex="= [2,\ 1] \odot [1,\ 0] = [2,\ 0]"></span> — поэлементное умножение, не матричное.</p>
    </div>
    <div class="step-panel" data-on="cur-b1 v-b1 k-dw1 k-db1" data-focus="v-b1">
      <div class="step-kicker">Шаг 8 · назад через первый слой</div>
      <h4>Градиент весов — внешнее произведение</h4>
      <p><code>dW1 = x.T @ dz1</code>: столбец <span class="math-inline" data-tex="2\times 1"></span> на строку <span class="math-inline" data-tex="1\times 2"></span> даёт матрицу
      <span class="math-inline" data-tex="2\times 2"></span>, каждый элемент — вход, умноженный на градиент нейрона. <code>db1 = dz1</code>:
      сдвиг получает градиент нейрона целиком.</p>
      <div class="callout-red">
        <strong>Нейрон 2 не учится:</strong> весь второй столбец <span class="math-inline" data-tex="dW_{1}"></span> и <span class="math-inline" data-tex="db_1[1]"></span> — нули.
        Его веса на этом шаге не изменятся. Это и есть «мёртвый» ReLU в миниатюре.
      </div>
    </div>
    <div class="step-panel" data-on="cur-upd v-upd k-upd" data-focus="v-upd">
      <div class="step-kicker">Шаг 9 · шаг и проверка</div>
      <h4>Ошибка уменьшилась больше чем вчетверо</h4>
      <p>Каждый параметр сдвигается против своего градиента с шагом <span class="math-inline" data-tex="\mathrm{lr} = 0.01"></span>:
      <span class="math-inline" data-tex="W_1[0][0]"></span>: <span class="math-inline" data-tex="0.5 - 0.01\cdot 2 = 0.48"></span>, <span class="math-inline" data-tex="W_1[1][0]"></span>: <span class="math-inline" data-tex="0.25 - 0.01\cdot 4 = 0.21"></span>. Тот же forward
      с новыми весами даёт <span class="math-inline" data-tex="z_1 = [0.88,\ -0.5]"></span>, <span class="math-inline" data-tex="\hat{y} = 2.2412"></span> и <span class="math-inline" data-tex="L = 0.0582"></span>.
      Один проход вперёд, один назад и шаг — это итерация; дальше её повторяют в цикле.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>Весь пайплайн на NumPy умещается в один файл — и каждая его строка написана мной:</p>

<pre><code>import numpy as np

x = np.array([[1.0, 2.0]])
y = np.array([[2.0]])

W1 = np.array([[0.5, -1.0],
               [0.25, 0.5]])
b1 = np.array([0.0, -0.5])
W2 = np.array([[2.0],
               [1.0]])
b2 = np.array([0.5])
lr = 0.01

for step in range(100):
    # forward
    z1 = x @ W1 + b1
    h = np.maximum(z1, 0)                # ReLU
    y_hat = h @ W2 + b2
    loss = ((y_hat - y) ** 2).mean()     # на step 0: 0.25

    # backward — производные выписаны руками
    d_yhat = 2 * (y_hat - y) / y.size
    dW2 = h.T @ d_yhat
    db2 = d_yhat.sum(axis=0)
    dh = d_yhat @ W2.T
    dz1 = dh * (z1 &gt; 0)
    dW1 = x.T @ dz1
    db1 = dz1.sum(axis=0)

    # шаг градиентного спуска
    W1 -= lr * dW1;  b1 -= lr * db1
    W2 -= lr * dW2;  b2 -= lr * db2</code></pre>

<div class="callout-yellow">
  <strong>Как я проверяю ручной backward:</strong> немного шевелю каждый параметр на
  <span class="math-inline" data-tex="\varepsilon = 10^{-6}"></span> вверх и вниз, пересчитываю loss и сравниваю разностное отношение с
  формулой. Для этой сети расхождение порядка <span class="math-inline" data-tex="10^{-10}"></span> — формулы верны. На NumPy это
  приходится делать самому: библиотека не знает, какую функцию вы дифференцируете.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> на NumPy библиотека даёт быстрые операции над
  массивами, но весь пайплайн — слои, ошибка, производные, шаг и цикл — остаётся вашим кодом.
</div>

<hr>

<h2 id="part-6">Часть 6. Та же сеть на PyTorch: библиотека и фреймворк</h2>

<p>
  PyTorch ставится так же, как NumPy, — это ещё одно колесо, распакованное в
  <code>site-packages</code>:
</p>

<pre><code>(.venv) C:\Users\work\proj&gt; pip install torch</code></pre>

<p>
  С PyPI на Windows приезжает сборка для процессора. Для видеокарты команду берут с
  сайта pytorch.org: в ней указан отдельный каталог колёс (<code>--index-url</code>), где
  лежат сборки с CUDA. Внутри папки всё устроено знакомо:
</p>

<pre><code>C:\Users\work\proj\.venv\Lib\site-packages\
└── torch\
    ├── __init__.py              ← выполняется при import torch
    ├── nn\                      ← слои и функции ошибок — обычный Python
    ├── optim\                   ← оптимизаторы — обычный Python
    ├── autograd\                ← Python-обёртка над движком градиентов
    ├── _C.cp312-win_amd64.pyd   ← мост из Python в C++
    └── lib\
        ├── torch_cpu.dll        ← вычислительные ядра (ATen)
        └── c10.dll              ← базовые типы и память</code></pre>

<p>
  Та же картина, что у NumPy: сверху — Python, который можно открыть и прочитать
  (попробуйте <code>torch\nn\modules\linear.py</code>: у класса <code>Linear</code> там пара десятков строк логики, остальное — документация),
  снизу — скомпилированные ядра. Разница в том, <em>сколько</em> работы лежит в
  Python-слое. Вот та же сеть с теми же весами:
</p>

<pre><code>import torch
from torch import nn

x = torch.tensor([[1.0, 2.0]])
y = torch.tensor([[2.0]])

model = nn.Sequential(
    nn.Linear(2, 2),
    nn.ReLU(),
    nn.Linear(2, 1),
)
with torch.no_grad():                    # копирую веса из части 5
    model[0].weight.copy_(torch.tensor([[0.5, 0.25], [-1.0, 0.5]]))   # = W1.T
    model[0].bias.copy_(torch.tensor([0.0, -0.5]))
    model[2].weight.copy_(torch.tensor([[2.0, 1.0]]))                 # = W2.T
    model[2].bias.copy_(torch.tensor([0.5]))

loss_fn = nn.MSELoss()
opt = torch.optim.SGD(model.parameters(), lr=0.01)

y_hat = model(x)             # forward:  tensor([[2.5000]], grad_fn=&lt;AddmmBackward0&gt;)
loss = loss_fn(y_hat, y)     # tensor(0.2500, grad_fn=&lt;MseLossBackward0&gt;)
opt.zero_grad()
loss.backward()              # все градиенты — одной строкой
print(model[0].weight.grad)  # tensor([[2., 4.], [0., 0.]])  = dW1.T
opt.step()                   # W ← W − lr·grad для всех параметров
print(loss_fn(model(x), y))  # tensor(0.0582, ...)</code></pre>

<div class="callout-yellow">
  <strong>Почему веса транспонированы:</strong> <code>nn.Linear</code> хранит матрицу в форме
  <code>[выходы, входы]</code> и считает <code>x @ weight.T + bias</code>. Поэтому мой
  <span class="math-inline" data-tex="W_{1}"></span> из части 5 кладётся как <code>W1.T</code>, и градиент приходит тоже
  транспонированным: <code>[[2, 4], [0, 0]]</code> вместо <code>[[2, 0], [4, 0]]</code>. Числа
  те же, включая нулевую строку мёртвого нейрона.
</div>

<div class="callout-blue">
  <strong>Откуда autograd знает, что дифференцировать:</strong> у каждого параметра стоит флаг
  <code>requires_grad=True</code>. Пока идёт forward, каждая операция над такими тензорами
  записывает себя в граф: <code>grad_fn=&lt;AddmmBackward0&gt;</code> в выводе — это узел
  «умножение матриц плюс сдвиг». <code>loss.backward()</code> проходит этот граф в обратном
  порядке и для каждого узла вызывает заранее написанную формулу производной — те самые
  строки, которые в части 5 я выписывал руками.
</div>

<p>
  Сравним три реализации одной сети построчно: что в каждой пишете вы, а что делает
  библиотека.
</p>

<div class="stage" id="stageLevels" tabindex="0">
  <div class="stage-figure">
<svg id="lv" viewBox="0 0 960 600" role="img" aria-label="Таблица: какие этапы обучения сети пишете вы, а какие берёт на себя библиотека, в чистом Python, NumPy и PyTorch">
  <style>
    #lv { font-family: Helvetica, Arial, sans-serif; }
    #lv .cb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; }
    #lv .cg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #lv .ttl { font-size: 17px; fill: #111111; font-weight: 700; }
    #lv .rlbl { font-size: 14px; fill: #111111; font-weight: 700; }
    #lv .code { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #lv .cap { font-size: 12.5px; fill: #5E5850; }
    #lv .iocr { fill: none; stroke: #73B222; stroke-width: 3; stroke-dasharray: 7 4; }
    #lv .ioct { font-size: 13px; fill: #5a8c1c; font-weight: 700; }
    #lv .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <g data-key="hdr">
    <text x="322" y="80" class="ttl" text-anchor="middle">чистый Python</text>
    <text x="572" y="80" class="ttl" text-anchor="middle">NumPy</text>
    <text x="822" y="80" class="ttl" text-anchor="middle">PyTorch</text>
    <text x="24" y="136" class="rlbl">умножение</text>
    <text x="24" y="206" class="rlbl">слой (forward)</text>
    <text x="24" y="276" class="rlbl">ошибка (loss)</text>
    <text x="24" y="346" class="rlbl">backward</text>
    <text x="24" y="416" class="rlbl">шаг обновления</text>
    <text x="24" y="486" class="rlbl">цикл обучения</text>
  </g>
  <g data-key="cpy">
    <rect x="205" y="100" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="126" class="code" text-anchor="middle">for i, j, k: s += …</text>
    <text x="322" y="147" class="cap" text-anchor="middle">вы — часть 1</text>
    <rect x="205" y="170" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="196" class="code" text-anchor="middle">списки и циклы</text>
    <text x="322" y="217" class="cap" text-anchor="middle">вы</text>
    <rect x="205" y="240" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="266" class="code" text-anchor="middle">sum((y_hat - y)**2)</text>
    <text x="322" y="287" class="cap" text-anchor="middle">вы</text>
    <rect x="205" y="310" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="336" class="code" text-anchor="middle">производные руками</text>
    <text x="322" y="357" class="cap" text-anchor="middle">вы</text>
    <rect x="205" y="380" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="406" class="code" text-anchor="middle">w -= lr * g в циклах</text>
    <text x="322" y="427" class="cap" text-anchor="middle">вы</text>
    <rect x="205" y="450" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="476" class="code" text-anchor="middle">for epoch in …</text>
    <text x="322" y="497" class="cap" text-anchor="middle">вы</text>
  </g>
  <g data-key="np1">
    <rect x="455" y="100" width="235" height="60" rx="8" class="cg"/>
    <text x="572" y="126" class="code" text-anchor="middle">x @ W1</text>
    <text x="572" y="147" class="cap" text-anchor="middle">библиотека: C и BLAS</text>
  </g>
  <g data-key="cnp">
    <rect x="455" y="170" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="196" class="code" text-anchor="middle">x @ W1 + b1</text>
    <text x="572" y="217" class="cap" text-anchor="middle">np.maximum(z1, 0) — вы</text>
    <rect x="455" y="240" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="266" class="code" text-anchor="middle">((y_hat - y)**2).mean()</text>
    <text x="572" y="287" class="cap" text-anchor="middle">вы</text>
    <rect x="455" y="310" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="336" class="code" text-anchor="middle">dW1 = x.T @ dz1 …</text>
    <text x="572" y="357" class="cap" text-anchor="middle">каждая формула — вы</text>
    <rect x="455" y="380" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="406" class="code" text-anchor="middle">W1 -= lr * dW1 …</text>
    <text x="572" y="427" class="cap" text-anchor="middle">вы</text>
    <rect x="455" y="450" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="476" class="code" text-anchor="middle">for epoch in …</text>
    <text x="572" y="497" class="cap" text-anchor="middle">вы</text>
  </g>
  <g data-key="t1">
    <rect x="705" y="100" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="126" class="code" text-anchor="middle">x @ W1</text>
    <text x="822" y="147" class="cap" text-anchor="middle">библиотека: ATen</text>
  </g>
  <g data-key="t4">
    <rect x="705" y="310" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="336" class="code" text-anchor="middle">loss.backward()</text>
    <text x="822" y="357" class="cap" text-anchor="middle">autograd считает сам</text>
  </g>
  <g data-key="t235">
    <rect x="705" y="170" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="196" class="code" text-anchor="middle">nn.Linear(2, 2)</text>
    <text x="822" y="217" class="cap" text-anchor="middle">nn.ReLU() — готовые слои</text>
    <rect x="705" y="240" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="266" class="code" text-anchor="middle">nn.MSELoss()</text>
    <text x="822" y="287" class="cap" text-anchor="middle">готовая функция ошибки</text>
    <rect x="705" y="380" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="406" class="code" text-anchor="middle">opt.step()</text>
    <text x="822" y="427" class="cap" text-anchor="middle">optim.SGD</text>
  </g>
  <g data-key="t6">
    <rect x="705" y="450" width="235" height="60" rx="8" class="cb"/>
    <text x="822" y="476" class="code" text-anchor="middle">for epoch in …</text>
    <text x="822" y="497" class="cap" text-anchor="middle">всё ещё вы</text>
  </g>
  <g data-key="ioc" data-only="1">
    <rect x="700" y="445" width="245" height="70" rx="10" class="iocr"/>
    <text x="205" y="545" class="ioct">Lightning: trainer.fit(model) забирает и цикл — дальше фреймворк сам вызывает ваш код</text>
  </g>
  <text x="24" y="588" class="legend">синий — этот код пишете вы · зелёный — это делает библиотека · строки таблицы — этапы из части 5</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hdr" data-focus="hdr">
      <div class="step-kicker">Шаг 1 · постановка</div>
      <h4>Одна сеть, шесть этапов, три реализации</h4>
      <p>Строки — этапы обучения из части 5, столбцы — три уровня инструментов. Для каждой
      клетки задаём один вопрос: кто пишет этот код — вы или библиотека?</p>
    </div>
    <div class="step-panel" data-on="hdr cpy" data-focus="cpy">
      <div class="step-kicker">Шаг 2 · чистый Python</div>
      <h4>Без библиотек всё синее</h4>
      <p>Умножение — три цикла из части 1, слой — списки и циклы, производные — выписаны
      вручную, обновление — ещё один цикл по каждому числу. Работает, но каждая строка на
      вашей ответственности.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp" data-focus="np1 cnp">
      <div class="step-kicker">Шаг 3 · NumPy</div>
      <h4>Библиотека забирает только вычисления</h4>
      <p>Зелёной стала одна клетка: <code>@</code> и прочие операции над массивами. Всё
      остальное — сборка слоёв, loss, backward, шаг — по-прежнему ваш код, просто
      записанный короче. NumPy — классическая библиотека: вы её вызываете, когда вам нужно.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp t1" data-focus="t1">
      <div class="step-kicker">Шаг 4 · тензор</div>
      <h4>torch.Tensor — это ndarray с дополнительными возможностями</h4>
      <p>На нижнем уровне PyTorch повторяет NumPy: тот же <code>@</code>, та же форма, тот же
      <code>dtype</code>, похожие методы (<code>.shape</code>, <code>.sum()</code>, <code>.T</code>).
      Сверху добавлены два умения: жить на видеокарте и записывать операции в граф.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp t1 t4" data-focus="t4">
      <div class="step-kicker">Шаг 5 · autograd</div>
      <h4>Главный скачок — backward становится зелёным</h4>
      <p>Самая трудоёмкая и опасная часть ручной реализации — производные — заменяется одной
      строкой <code>loss.backward()</code>. Именно ради этого PyTorch и существует: поменяйте
      архитектуру как угодно, и градиенты по-прежнему посчитаются правильно.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp t1 t4 t235" data-focus="t235">
      <div class="step-kicker">Шаг 6 · готовые блоки</div>
      <h4>Слои, ошибки и оптимизаторы — тоже из коробки</h4>
      <p><code>nn.Linear</code> сам создаёт и хранит свои <code>weight</code> и <code>bias</code>,
      <code>nn.MSELoss</code> — функция ошибки, <code>optim.SGD</code> знает все параметры модели
      и обновляет их разом. Синим в столбце PyTorch остался только цикл.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp t1 t4 t235 t6 ioc" data-focus="t6 ioc">
      <div class="step-kicker">Шаг 7 · кто кого вызывает</div>
      <h4>Отдайте и цикл — получится фреймворк в чистом виде</h4>
      <p>В PyTorch цикл <code>for epoch</code> вы всё ещё пишете сами. Надстройки вроде
      PyTorch Lightning забирают и его: вы описываете, что делать на одном шаге, а
      <code>trainer.fit</code> сам решает, когда вас вызвать. Управление перевернулось.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<h3>Библиотека против фреймворка: кто кого вызывает</h3>

<p>
  Теперь можно дать определение, которое не зависит от размера пакета или от того, как он
  себя называет. <strong>Библиотеку вызываете вы</strong>: ваш код управляет порядком
  действий, а библиотека выполняет отдельные поручения — умножь, отсортируй, прочитай
  файл. <strong>Фреймворк вызывает вас</strong>: порядок действий задан им, а вы
  заполняете оставленные для вас места. Этот переворот называют <em>инверсией управления</em>.
</p>

<p>
  PyTorch стоит посередине, и это хорошо видно на привычном способе описывать модель
  классом:
</p>

<pre><code>class FFN(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(2, 2)
        self.fc2 = nn.Linear(2, 1)

    def forward(self, x):
        return self.fc2(torch.relu(self.fc1(x)))

model = FFN()
y_hat = model(x)        # не model.forward(x)!</code></pre>

<p>
  Метод <code>forward</code> я написал, но сам его не вызываю. Вызов <code>model(x)</code>
  уходит в <code>nn.Module.__call__</code> — код фреймворка, — который выполняет служебную
  работу (хуки, режимы) и уже оттуда вызывает мой <code>forward</code>. Это та же инверсия
  управления, только маленькая. А присваивание <code>self.fc1 = nn.Linear(...)</code>
  перехватывается <code>nn.Module</code>, и параметры слоя регистрируются в модели —
  поэтому <code>model.parameters()</code> потом находит их сам.
</p>

<p>Если отдать фреймворку ещё и цикл обучения, получится так (PyTorch Lightning):</p>

<pre><code>import lightning as L

class LitFFN(L.LightningModule):
    def __init__(self):
        super().__init__()
        self.net = FFN()

    def training_step(self, batch, batch_idx):      # фреймворк вызовет это на каждом шаге
        x, y = batch
        return nn.functional.mse_loss(self.net(x), y)

    def configure_optimizers(self):                 # и это — один раз в начале
        return torch.optim.SGD(self.parameters(), lr=0.01)

trainer = L.Trainer(max_epochs=100)
trainer.fit(LitFFN(), train_dataloaders=loader)    # цикл, backward и step — внутри</code></pre>

<table class="shape-table">
  <tr><th></th><th>Библиотека</th><th>Фреймворк</th></tr>
  <tr><td>Кто управляет порядком</td><td>ваш код</td><td>фреймворк</td></tr>
  <tr><td>Как вы с ним работаете</td><td>вызываете функции и методы</td><td>наследуете классы, переопределяете методы, отдаёте свои функции</td></tr>
  <tr><td>Что отдаёте</td><td>отдельные вычисления</td><td>целый сценарий работы</td></tr>
  <tr><td>Примеры из статьи</td><td><code>numpy</code>, <code>torch.Tensor</code></td><td><code>nn.Module.__call__</code>, Lightning <code>Trainer</code></td></tr>
  <tr><td>Вне ML</td><td><code>requests</code>, <code>json</code></td><td>Django, FastAPI: вы пишете обработчик, сервер сам решает, когда его вызвать</td></tr>
</table>

<div class="callout-blue">
  <strong>Граница размыта, и это нормально:</strong> PyTorch обычно называют фреймворком,
  хотя половиной он — библиотека тензоров, которую можно использовать как NumPy. Полезнее
  не спорить о названии, а задавать вопрос из сцены выше: какую часть программы этот
  инструмент забирает у меня и кто в ней решает, что вызывать дальше.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> иерархия инструментов — это список того, что вы
  перестаёте писать сами: NumPy забирает циклы, autograd — производные, <code>nn</code> и
  <code>optim</code> — слои и шаг, а фреймворк вроде Lightning — и сам цикл, после чего
  уже он вызывает ваш код.
</div>

<hr>

<h2 id="part-7">Часть 7. Что важно уметь восстановить по памяти</h2>

<ol class="end-list">
  <li><strong>Матричное умножение — три цикла.</strong> <code>C[i][j]</code> — скалярное произведение
  строки <code>i</code> на столбец <code>j</code>; формы <span class="math-inline" data-tex="(n\times m)\cdot(m\times p) \to n\times p"></span>.</li>
  <li><strong>Модуль — это файл, библиотека — чужой пакет.</strong> Для интерпретатора
  <code>mylinalg</code> и <code>numpy</code> устроены одинаково.</li>
  <li><strong>import = найти, выполнить, связать.</strong> Поиск идёт по <code>sys.path</code>,
  первое совпадение побеждает, результат кэшируется в <code>sys.modules</code>.</li>
  <li><strong>pip install = скачать колесо и распаковать.</strong> Колесо — zip с PyPI под вашу
  версию Python и ОС; содержимое ложится в <code>site-packages</code> активного окружения.</li>
  <li><strong><code>__file__</code> отвечает на вопрос «откуда это взялось».</strong> Первый шаг
  при странном поведении — проверить, та ли копия импортировалась; не называйте свои файлы
  именами библиотек.</li>
  <li><strong>Внутри библиотек — Python сверху и машинный код снизу.</strong> <code>.pyd</code>/<code>.so</code>
  — скомпилированный C/C++, а под NumPy лежит ещё и BLAS.</li>
  <li><strong>Атрибут — без скобок, метод — со скобками.</strong> <code>A.sum(axis=0)</code> — это
  <code>np.ndarray.sum(A, axis=0)</code>, а <code>A @ B</code> — это <code>A.__matmul__(B)</code>.</li>
  <li><strong>Чужой код открыт — и расширяется снаружи.</strong> За <code>ndarray</code> стоит
  C-структура, за <code>@</code> — ufunc <code>np.matmul</code> с контрактом; вмешиваются аргументами,
  подклассом или <code>__array_ufunc__</code>, а пересборка — крайний случай.</li>
  <li><strong>Пайплайн обучения — forward, loss, backward, шаг, цикл.</strong> На NumPy вы пишете
  все пять; на PyTorch — только цикл и описание модели.</li>
  <li><strong>Библиотеку вызываете вы, фреймворк вызывает вас.</strong> Признак фреймворка —
  вы пишете <code>forward</code> или <code>training_step</code>, но не вызываете их сами.</li>
</ol>

<p>
  Если унести одну картину, то такую: внизу всегда те же три вложенных цикла из первой
  части. Каждый следующий уровень — NumPy, autograd, <code>nn.Module</code>, Lightning — не
  делает ничего принципиально нового, а просто берёт на себя ещё один кусок программы,
  который раньше приходилось писать вручную. Выбирая инструмент, вы на самом деле выбираете,
  какую часть работы готовы отдать и какую часть контроля вместе с ней.
</p>

<p class="tiny">
  Все числа статьи посчитаны скриптом на Python и NumPy 2.x: умножение циклами и через
  <code>@</code> дают одинаковое <code>[[2, 3], [8, 0]]</code>, ручной backward сети 2→2→1 сверен
  с конечными разностями (расхождение порядка 10⁻¹⁰). Вывод PyTorch приведён для тех же весов
  с учётом транспонирования в <code>nn.Linear</code>; значения округлены до четырёх знаков.
  Пути вида <code>C:\Users\work\…</code>, версии пакетов и имена файлов с хешами у вас будут
  немного другими. Ссылки на исходники NumPy ведут на тег <code>v2.5.3</code>; поведение
  <code>out=</code>, подкласса и <code>__array_ufunc__</code> проверено на этой версии.
</p>
