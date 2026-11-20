<style>
  .prose .stage-figure .is-focus .svg-math > span:not(.katex) { font-weight: 700; }
</style>
<p class="lead">
  Библиотека — это чужой код, который лежит обычной папкой в <code>site-packages</code>
  и после <code>import</code> становится объектом с атрибутами и методами. Фреймворк —
  та же библиотека, которая вдобавок забирает у вас часть программы и сама вызывает
  ваш код. Я покажу это на одной-единственной операции — умножении матриц — и пройду
  от трёх вложенных циклов до <code>model.fit(X, y)</code> в scikit-learn.
</p>

<p>
  За строкой <code>import sklearn</code> стоят четыре вещи: файлы на диске, правило поиска
  модулей, объекты с методами и договорённость о том, кто кого вызывает. Я разберу их по
  порядку и на каждом шаге покажу, что происходит; скорость здесь не измеряется.
</p>

<p>
  Маршрут такой. Сначала я умножу две матрицы голым Python. Потом вынесу функцию
  в отдельный файл и посмотрю, что делает <code>import</code>. Потом поставлю NumPy
  и найду, где на диске лежит его код. Потом разберу объект <code>ndarray</code>
  и путь, по которому проходит вызов <code>A @ B</code>. И в конце обучу
  линейную регрессию дважды — руками на NumPy и объектом из scikit-learn, — чтобы стало видно,
  какую работу забирает библиотека и как устроен её объект.
</p>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные, файлы, ваш код</span>
  <span><i style="background:#C29E08"></i>операция и параметр</span>
  <span><i style="background:#73B222"></i>результат, готовое от библиотеки</span>
  <span><i style="background:#C30B0A"></i>ошибка и градиент</span>
</div>

<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите только на яркую часть.
  Расположение блоков от шага к шагу не меняется. Каждый шаг разобран под кнопками. Стрелки ← → на
  клавиатуре работают, когда сцена в фокусе.
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
    #mm .sgn { font-size: 30px; fill: #5E5850; }
    #mm .hl { fill: none; stroke: #C29E08; stroke-width: 3; }
    #mm .code { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #mm .codebox { fill: #F4F2EC; stroke: #3576C0; stroke-width: 1.5; }
    #mm .kbg { fill: #FFF3C4;  stroke: #C29E08; stroke-width: 1.2; }
    #mm .fbg { fill: #CDEBB0;  stroke: #73B222; stroke-width: 1.2; }
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
      <h4>Клетка <span class="math-inline" data-tex="C[0][0]"></span>: строка 0 на столбец 0</h4>
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
      <h4>Клетка <span class="math-inline" data-tex="C[1][1] = 0"></span></h4>
      <p>Вторая строка <code>A</code> — <code>[3, −1, 2]</code>, второй столбец <code>B</code> —
      <code>[1, 1, −1]</code>. Произведения 3, −1 и −2 в сумме дают ровно ноль.</p>
      <div class="callout-blue">
        <strong>Зачем этот пример:</strong> ноль потом появится в обеих реализациях — в циклах
        и в NumPy. Если где-то он не получится, значит, ошибка в коде, а не в арифметике.
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
      про три цикла: достаточно написать <code>matmul(A, B)</code>. Библиотека устроена так же:
      это набор функций и классов, за именами которых лежат циклы, проверки форм и работа с памятью.</p>
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
      механизм позже даст нам <code>np.array</code>, <code>A.shape</code> и <code>model.fit</code>.</p>
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
      <p>Установщик Windows и реестр не участвуют: pip разворачивает содержимое колеса в папку
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
  числа — просто байты в памяти. Умножений столько же, 12; быстрее становится их обход, потому
  что цикл крутится в машинном коде без участия интерпретатора.
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

<h2 id="part-5">Часть 5. Линейная регрессия руками на NumPy</h2>

<p>
  Теперь соберу из тех же умножений модель машинного обучения — <strong>линейную регрессию</strong>.
  Есть <span class="math-inline" data-tex="N = 4"></span> объекта, у каждого <span class="math-inline" data-tex="P = 2"></span>
  признака и правильный ответ. Модель предсказывает ответ как взвешенную сумму признаков плюс сдвиг:
</p>

<div class="math-display" data-tex="\hat y_i = w_1 x_{i1} + w_2 x_{i2} + b \qquad\Longleftrightarrow\qquad \hat{\mathbf y} = X\mathbf w + b"></div>

<p>
  Здесь <span class="math-inline" data-tex="X"></span> — матрица признаков <span class="math-inline" data-tex="4\times 2"></span>
  (строка — объект), <span class="math-inline" data-tex="\mathbf w"></span> — два веса,
  <span class="math-inline" data-tex="b"></span> — число. Запись <span class="math-inline" data-tex="X\mathbf w"></span> — то самое
  умножение из части 1, у которого правая матрица — один столбец. Мои данные:
</p>

<div class="math-display" data-tex="X = \begin{bmatrix} 1 &amp; 2 \\ 2 &amp; 0 \\ 0 &amp; 1 \\ 3 &amp; 1 \end{bmatrix}, \qquad \mathbf y = \begin{bmatrix} 4.3 \\ 4.3 \\ 1.6 \\ 7.6 \end{bmatrix}"></div>

<p>
  Обучить модель — значит подобрать <span class="math-inline" data-tex="\mathbf w"></span> и <span class="math-inline" data-tex="b"></span>,
  при которых средний квадрат ошибки (MSE) минимален:
</p>

<div class="math-display" data-tex="L = \frac{1}{N}\sum_{i=1}^{N} (\hat y_i - y_i)^2"></div>

<p>
  Подбирать буду градиентным спуском: посчитать предсказание, ошибку и градиент, сдвинуть параметры
  против градиента и повторить. Градиент для линейной регрессии записывается в одну строку; откуда он
  берётся, подробно разобрано в статье
  <a href="article.html?slug=linear-regression-full-cycle">«Линейная регрессия: полный цикл обучения на трёх числах»</a>:
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial \mathbf w} = \frac{2}{N}\,X^{\top}(\hat{\mathbf y} - \mathbf y), \qquad \frac{\partial L}{\partial b} = \frac{2}{N}\sum_{i=1}^{N}(\hat y_i - y_i)"></div>

<p>
  Из NumPy понадобятся только <code>@</code>, <code>.T</code>, <code>.sum()</code> и <code>.mean()</code> —
  то, что уже встречалось в части 4. Посмотрим первую итерацию на числах: слева — таблица объектов,
  параметры и ошибка, справа — строки кода, которые их считают.
</p>

<div class="stage" id="stageLR" tabindex="0">
  <div class="stage-figure">
<svg id="lr" viewBox="0 0 960 600" role="img" aria-label="Одна итерация градиентного спуска для линейной регрессии на NumPy: данные, предсказание, ошибка, градиент, шаг и 500 повторов, рядом — код">
  <style>
    #lr { font-family: Helvetica, Arial, sans-serif; }
    #lr .cb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.2; }
    #lr .cg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.2; }
    #lr .cr { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.2; }
    #lr .ce { fill: #FFFFFF; stroke: #B9B3A6; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #lr .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #lr .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #lr .tc { fill: #FFFFFF; stroke: #C8C3B6; stroke-width: 1; }
    #lr .codebox { fill: #F4F2EC; stroke: #3576C0; stroke-width: 1.5; }
    #lr .ttl { font-size: 15px; font-weight: 700; fill: #111111; }
    #lr .cap { font-size: 13px; fill: #5E5850; }
    #lr .capr { font-size: 13px; fill: #C30B0A; }
    #lr .code { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #lr .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <text x="130" y="36" class="cap" text-anchor="middle">признаки X</text>
  <text x="270" y="36" class="cap" text-anchor="middle">предсказание</text>
  <text x="365" y="36" class="cap" text-anchor="middle">ответы</text>
  <text x="460" y="36" class="cap" text-anchor="middle">ошибка</text>
  <foreignObject x="55" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="x_1"></div></foreignObject>
  <foreignObject x="115" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="x_2"></div></foreignObject>
  <foreignObject x="225" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="\hat y"></div></foreignObject>
  <foreignObject x="320" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="y"></div></foreignObject>
  <foreignObject x="415" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="\hat y - y"></div></foreignObject>
  <foreignObject x="34" y="84.5" width="28" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1"></div></foreignObject>
  <rect x="70" y="80" width="60" height="36" class="cb"/>
  <foreignObject x="72" y="81" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
  <rect x="130" y="80" width="60" height="36" class="cb"/>
  <foreignObject x="132" y="81" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
  <rect x="330" y="80" width="70" height="36" class="cb"/>
  <foreignObject x="332" y="81" width="66" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.3"></div></foreignObject>
  <rect x="230" y="80" width="80" height="36" class="ce"/>
  <rect x="420" y="80" width="80" height="36" class="ce"/>
  <foreignObject x="34" y="120.5" width="28" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="2"></div></foreignObject>
  <rect x="70" y="116" width="60" height="36" class="cb"/>
  <foreignObject x="72" y="117" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
  <rect x="130" y="116" width="60" height="36" class="cb"/>
  <foreignObject x="132" y="117" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
  <rect x="330" y="116" width="70" height="36" class="cb"/>
  <foreignObject x="332" y="117" width="66" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.3"></div></foreignObject>
  <rect x="230" y="116" width="80" height="36" class="ce"/>
  <rect x="420" y="116" width="80" height="36" class="ce"/>
  <foreignObject x="34" y="156.5" width="28" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="3"></div></foreignObject>
  <rect x="70" y="152" width="60" height="36" class="cb"/>
  <foreignObject x="72" y="153" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
  <rect x="130" y="152" width="60" height="36" class="cb"/>
  <foreignObject x="132" y="153" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
  <rect x="330" y="152" width="70" height="36" class="cb"/>
  <foreignObject x="332" y="153" width="66" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1.6"></div></foreignObject>
  <rect x="230" y="152" width="80" height="36" class="ce"/>
  <rect x="420" y="152" width="80" height="36" class="ce"/>
  <foreignObject x="34" y="192.5" width="28" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4"></div></foreignObject>
  <rect x="70" y="188" width="60" height="36" class="cb"/>
  <foreignObject x="72" y="189" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="3"></div></foreignObject>
  <rect x="130" y="188" width="60" height="36" class="cb"/>
  <foreignObject x="132" y="189" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
  <rect x="330" y="188" width="70" height="36" class="cb"/>
  <foreignObject x="332" y="189" width="66" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="7.6"></div></foreignObject>
  <rect x="230" y="188" width="80" height="36" class="ce"/>
  <rect x="420" y="188" width="80" height="36" class="ce"/>
  <rect x="30" y="246" width="260" height="80" rx="8" class="by"/>
  <text x="44" y="270" class="ttl">параметры модели</text>
  <rect x="310" y="246" width="270" height="80" rx="8" class="br"/>
  <text x="324" y="270" class="ttl">ошибка MSE</text>
  <g data-key="yh0" data-only="1">
    <rect x="230" y="80" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <rect x="230" y="116" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <rect x="230" y="152" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <rect x="230" y="188" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
  </g>
  <g data-key="er0" data-only="1">
    <rect x="420" y="80" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-4.3"></div></foreignObject>
    <rect x="420" y="116" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-4.3"></div></foreignObject>
    <rect x="420" y="152" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-1.6"></div></foreignObject>
    <rect x="420" y="188" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-7.6"></div></foreignObject>
  </g>
  <g data-key="p0" data-only="1">
    <foreignObject x="44" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf w = [0,\ 0],\quad b = 0"></div></foreignObject>
  </g>
  <g data-key="l0" data-only="1">
    <foreignObject x="324" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="L = 24.325"></div></foreignObject>
  </g>
  <g data-key="yh1" data-only="1">
    <rect x="230" y="80" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.455"></div></foreignObject>
    <rect x="230" y="116" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.46"></div></foreignObject>
    <rect x="230" y="152" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1.78"></div></foreignObject>
    <rect x="230" y="188" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="7.135"></div></foreignObject>
  </g>
  <g data-key="er1" data-only="1">
    <rect x="420" y="80" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.155"></div></foreignObject>
    <rect x="420" y="116" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.16"></div></foreignObject>
    <rect x="420" y="152" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.18"></div></foreignObject>
    <rect x="420" y="188" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-0.465"></div></foreignObject>
  </g>
  <g data-key="p1" data-only="1">
    <foreignObject x="44" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf w = [1.785,\ 0.89],\quad b = 0.89"></div></foreignObject>
  </g>
  <g data-key="l1" data-only="1">
    <foreignObject x="324" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="L = 0.0746"></div></foreignObject>
  </g>
  <g data-key="yh5" data-only="1">
    <rect x="230" y="80" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.45"></div></foreignObject>
    <rect x="230" y="116" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.45"></div></foreignObject>
    <rect x="230" y="152" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1.45"></div></foreignObject>
    <rect x="230" y="188" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="7.45"></div></foreignObject>
  </g>
  <g data-key="er5" data-only="1">
    <rect x="420" y="80" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.15"></div></foreignObject>
    <rect x="420" y="116" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.15"></div></foreignObject>
    <rect x="420" y="152" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-0.15"></div></foreignObject>
    <rect x="420" y="188" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-0.15"></div></foreignObject>
  </g>
  <g data-key="p5" data-only="1">
    <foreignObject x="44" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf w = [2,\ 1],\quad b = 0.45"></div></foreignObject>
  </g>
  <g data-key="l5" data-only="1">
    <foreignObject x="324" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="L = 0.0225"></div></foreignObject>
  </g>
  <g data-key="d-pred" data-only="1">
    <foreignObject x="30" y="355" width="550" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\hat y_i = w_1 x_{i1} + w_2 x_{i2} + b"></div></foreignObject>
    <foreignObject x="30" y="394" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>всё сразу: <span data-tex="\hat{\mathbf y} = X\mathbf w + b"></span>, формы <span data-tex="(4\times 2)\cdot(2\times 1) \to 4\times 1"></span></span></div></foreignObject>
    <foreignObject x="30" y="430" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>первая строка: <span data-tex="\hat y_1 = 0\cdot 1 + 0\cdot 2 + 0 = 0"></span></span></div></foreignObject>
    <text x="30" y="484" class="cap">веса пока нулевые, поэтому все четыре предсказания равны 0</text>
  </g>
  <g data-key="d-loss" data-only="1">
    <foreignObject x="30" y="356" width="550" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="L = \dfrac{1}{N}\sum_{i=1}^{N} (\hat y_i - y_i)^2"></div></foreignObject>
    <foreignObject x="30" y="416" width="550" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="= \dfrac{4.3^2 + 4.3^2 + 1.6^2 + 7.6^2}{4} = \dfrac{97.3}{4} = 24.325"></div></foreignObject>
    <text x="30" y="498" class="cap">квадрат делает каждую ошибку положительной, а большие ошибки — заметнее</text>
  </g>
  <g data-key="d-grad" data-only="1">
    <foreignObject x="30" y="354" width="550" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="\dfrac{\partial L}{\partial \mathbf w} = \dfrac{2}{N}\,X^{\top}(\hat{\mathbf y} - \mathbf y) = [-17.85,\ -8.9]"></div></foreignObject>
    <foreignObject x="30" y="412" width="550" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="\dfrac{\partial L}{\partial b} = \dfrac{2}{N}\sum_{i}(\hat y_i - y_i) = -8.9"></div></foreignObject>
    <foreignObject x="30" y="476.5" width="550" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>X.T @ err — снова умножение матриц: <span data-tex="(2\times 4)\cdot(4\times 1) \to 2\times 1"></span></span></div></foreignObject>
    <text x="30" y="526" class="cap">оба градиента отрицательные: если увеличить w и b, ошибка уменьшится</text>
  </g>
  <g data-key="d-step" data-only="1">
    <foreignObject x="30" y="362" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf w \leftarrow [0,\ 0] - 0.1\cdot[-17.85,\ -8.9] = [1.785,\ 0.89]"></div></foreignObject>
    <foreignObject x="30" y="402" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="b \leftarrow 0 - 0.1\cdot(-8.9) = 0.89"></div></foreignObject>
    <foreignObject x="30" y="444" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>ошибка за один шаг: <span data-tex="24.325 \to 0.0746"></span></span></div></foreignObject>
    <text x="30" y="498" class="cap">первые три предсказания чуть завышены, четвёртое занижено на 0.465</text>
  </g>
  <g data-key="d-loop" data-only="1">
    <text x="30" y="372" class="ttl">ошибка по шагам</text>
    <rect x="30" y="386" width="80" height="34" class="tc"/>
    <foreignObject x="32" y="387" width="76" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\text{шаг}"></div></foreignObject>
    <rect x="110" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="112" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <rect x="200" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="202" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <rect x="290" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="292" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="10"></div></foreignObject>
    <rect x="380" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="382" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="100"></div></foreignObject>
    <rect x="470" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="472" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="500"></div></foreignObject>
    <rect x="30" y="420" width="80" height="34" class="tc"/>
    <foreignObject x="32" y="421" width="76" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="L"></div></foreignObject>
    <rect x="110" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="112" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="24.325"></div></foreignObject>
    <rect x="200" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="202" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0.0746"></div></foreignObject>
    <rect x="290" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="292" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0.0407"></div></foreignObject>
    <rect x="380" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="382" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0.0227"></div></foreignObject>
    <rect x="470" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="472" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0.0225"></div></foreignObject>
    <text x="30" y="484" class="cap">после 200 шагов ошибка почти не меняется: остаток 0.0225 — шум в данных</text>
    <foreignObject x="30" y="490.5" width="550" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>плоскость <span data-tex="\hat y = 2x_1 + x_2 + 0.45"></span> не проходит через все точки: ошибки <span data-tex="\pm 0.15"></span></span></div></foreignObject>
  </g>
  <g data-key="d-new" data-only="1">
    <foreignObject x="30" y="356" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700"><span>новый объект <span data-tex="\mathbf x = [1,\ 1]"></span></span></div></foreignObject>
    <foreignObject x="30" y="393" width="550" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\hat y = 2\cdot 1 + 1\cdot 1 + 0.45 = 3.45"></div></foreignObject>
    <text x="30" y="452" class="cap">predict(X_new, w, b): обученные w и b хранятся в двух переменных,</text>
    <text x="30" y="472" class="cap">и передавать их в predict приходится самому</text>
  </g>
  <rect x="600" y="30" width="330" height="530" rx="8" class="codebox"/>
  <text x="614" y="56" class="ttl">код на NumPy</text>
  <g data-key="k-def">
    <text x="614" y="88" class="code">def train(X, y, lr=0.1, steps=500):</text>
  </g>
  <g data-key="k-init">
    <text x="614" y="109" class="code">    n, m = X.shape</text>
    <text x="614" y="130" class="code">    w = np.zeros(m)</text>
    <text x="614" y="151" class="code">    b = 0.0</text>
  </g>
  <g data-key="k-loop">
    <text x="614" y="172" class="code">    for step in range(steps):</text>
    <text x="614" y="319" class="code">    return w, b</text>
  </g>
  <g data-key="k-pred">
    <text x="614" y="193" class="code">        y_hat = X @ w + b</text>
  </g>
  <g data-key="k-err">
    <text x="614" y="214" class="code">        err = y_hat - y</text>
  </g>
  <g data-key="k-grad">
    <text x="614" y="235" class="code">        dw = 2 / n * (X.T @ err)</text>
    <text x="614" y="256" class="code">        db = 2 / n * err.sum()</text>
  </g>
  <g data-key="k-step">
    <text x="614" y="277" class="code">        w -= lr * dw</text>
    <text x="614" y="298" class="code">        b -= lr * db</text>
  </g>
  <g data-key="k-new">
    <text x="614" y="361" class="code">def predict(X, w, b):</text>
    <text x="614" y="382" class="code">    return X @ w + b</text>
  </g>
  <g data-key="k-loss">
    <text x="614" y="424" class="code">def mse(y_hat, y):</text>
    <text x="614" y="445" class="code">    return ((y_hat - y) ** 2).mean()</text>
  </g>
  <text x="614" y="540" class="cap">каждую строку пишу я сам</text>
  <text x="30" y="588" class="legend">синий — данные · жёлтый — параметры · зелёный — предсказание · красный — ошибка и градиент</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="p0 k-def k-init" data-focus="p0 k-init">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>Четыре объекта, два признака, три параметра</h4>
      <p>Каждая строка таблицы — объект: два признака <span class="math-inline" data-tex="x_1, x_2"></span> и правильный ответ
      <span class="math-inline" data-tex="y"></span>. Признаки образуют матрицу <code>X</code> формы <code>(4, 2)</code>, ответы — вектор
      <code>y</code> формы <code>(4,)</code>. Модель описывают три числа: два веса <code>w</code> и сдвиг <code>b</code>.
      Начинаю с нулей: <code>w = np.zeros(m)</code>, где <code>m = 2</code> — число признаков.</p>
    </div>
    <div class="step-panel" data-on="p0 yh0 d-pred k-pred" data-focus="yh0 d-pred k-pred">
      <div class="step-kicker">Шаг 2 · предсказание</div>
      <h4>Предсказание — умножение матрицы на вектор</h4>
      <p>Строка <code>y_hat = X @ w + b</code> считает предсказание сразу для всех объектов: каждая строка
      <code>X</code> скалярно умножается на <code>w</code>, к результату прибавляется <code>b</code>. Это умножение из
      части 1, у которого правая матрица — один столбец. Пока веса нулевые, все предсказания равны нулю.</p>
    </div>
    <div class="step-panel" data-on="p0 yh0 er0 l0 d-loss k-err k-loss" data-focus="er0 l0 d-loss k-err k-loss">
      <div class="step-kicker">Шаг 3 · ошибка</div>
      <h4>Ошибка — среднее квадратов разностей</h4>
      <p><code>err = y_hat - y</code> — разность по каждому объекту: сейчас все предсказания меньше ответов,
      поэтому ошибки отрицательные. Функция <code>mse</code> возводит их в квадрат и усредняет:
      <span class="math-inline" data-tex="L = 24.325"></span>. Обучение должно сделать это число как можно меньше.</p>
    </div>
    <div class="step-panel" data-on="p0 yh0 er0 l0 d-grad k-grad" data-focus="d-grad k-grad">
      <div class="step-kicker">Шаг 4 · градиент</div>
      <h4>Градиент показывает, куда двигать веса</h4>
      <p>Градиент — вектор производных ошибки по каждому параметру. Для линейной регрессии он
      считается двумя строками: <code>dw = 2 / n * (X.T @ err)</code> и <code>db = 2 / n * err.sum()</code>.
      Знак говорит, в какую сторону растёт ошибка: оба градиента отрицательные, значит, рост весов ошибку уменьшит.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · первый вес</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Подставляем</span>
            <div class="math-display worked-math" data-tex="\tfrac{2}{4}\,(1\cdot(-4.3) + 2\cdot(-4.3) + 0\cdot(-1.6) + 3\cdot(-7.6))"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Получаем</span>
            <div class="math-display worked-math" data-tex="\partial L/\partial w_1 = -17.85"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> столбец признака <span class="math-inline" data-tex="x_1"></span>
        скалярно умножается на столбец ошибок — это одна строка произведения <code>X.T @ err</code>.</p>
      </div>
    </div>
    <div class="step-panel" data-on="p1 yh1 er1 l1 d-step k-step" data-focus="p1 l1 d-step k-step">
      <div class="step-kicker">Шаг 5 · шаг</div>
      <h4>Параметры сдвигаются против градиента</h4>
      <p><code>w -= lr * dw</code>: из каждого параметра вычитается его градиент, умноженный на шаг
      <code>lr = 0.1</code>. Веса стали <code>[1.785, 0.89]</code>, сдвиг — <code>0.89</code>. С новыми параметрами
      предсказания почти совпали с ответами, ошибка упала с 24.325 до 0.0746.</p>
    </div>
    <div class="step-panel" data-on="p5 yh5 er5 l5 d-loop k-loop" data-focus="p5 l5 d-loop k-loop">
      <div class="step-kicker">Шаг 6 · цикл</div>
      <h4>500 повторов — и параметры перестают меняться</h4>
      <p>Шаги 2–5 повторяются в цикле <code>for step in range(steps)</code>. Первый шаг убрал почти всю
      ошибку, дальше она уменьшается медленно и к 500-му шагу останавливается на 0.0225. Параметры к этому
      моменту — <code>w = [2, 1]</code>, <code>b = 0.45</code>: меньшей ошибки на этих данных не получить.</p>
    </div>
    <div class="step-panel" data-on="p5 l5 d-new k-new" data-focus="d-new k-new">
      <div class="step-kicker">Шаг 7 · новый объект</div>
      <h4>Обученная модель — это два числа и формула</h4>
      <p>Чтобы предсказать ответ для нового объекта, нужны только формула <code>X @ w + b</code> и найденные
      <code>w</code> и <code>b</code>: для <code>[1, 1]</code> получается 3.45. Обученные параметры живут в двух
      переменных, и передавать их в <code>predict</code> приходится самому.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>Целиком файл выглядит так:</p>

<pre><code>import numpy as np

X = np.array([[1, 2], [2, 0], [0, 1], [3, 1]], dtype=float)
y = np.array([4.3, 4.3, 1.6, 7.6])

def train(X, y, lr=0.1, steps=500):
    n, m = X.shape
    w = np.zeros(m)
    b = 0.0
    for step in range(steps):
        y_hat = X @ w + b              # предсказание для всех объектов
        err = y_hat - y                # ошибка на каждом объекте
        dw = 2 / n * (X.T @ err)       # градиент по весам
        db = 2 / n * err.sum()         # градиент по сдвигу
        w -= lr * dw                   # шаг против градиента
        b -= lr * db
    return w, b

def predict(X, w, b):
    return X @ w + b

def mse(y_hat, y):
    return ((y_hat - y) ** 2).mean()

w, b = train(X, y)
print(w.round(4), round(b, 4))                    # [2. 1.] 0.45
print(mse(predict(X, w, b), y).round(4))          # 0.0225
print(predict(np.array([[1, 1]]), w, b).round(4)) # [3.45]</code></pre>

<div class="callout-yellow">
  <strong>Чего не хватает этой реализации:</strong> обученные <code>w</code> и <code>b</code> — две отдельные
  переменные, их надо хранить самому и передавать в <code>predict</code> в правильном порядке. Если вызвать
  <code>predict(X, None, None)</code> до обучения, Python упадёт на <code>TypeError</code> внутри <code>@</code>, и
  по сообщению не понять, что модель просто не обучена. Настройки <code>lr</code> и <code>steps</code> нигде не
  записаны рядом с результатом. Всё это в следующей части решает один объект.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> линейная регрессия на NumPy — это четыре строки в цикле:
  <code>X @ w + b</code>, разность с <code>y</code>, <code>X.T @ err</code> и сдвиг против градиента. NumPy даёт
  быстрые <code>@</code> и <code>.T</code>, а модель, обучение и хранение параметров остаются вашим кодом.
</div>

<hr>

<h2 id="part-6">Часть 6. Та же модель в scikit-learn: объект с атрибутами и методами</h2>

<p>
  scikit-learn ставится так же, как NumPy, но с одной ловушкой для новичка: имя пакета для pip и
  имя для import разные.
</p>

<pre><code>(.venv) C:\Users\work\proj&gt; pip install scikit-learn
(.venv) C:\Users\work\proj&gt; python -c "import sklearn; print(sklearn.__version__)"
1.9.1</code></pre>

<p>
  У NumPy обязательных зависимостей не было. У scikit-learn они есть, и pip сам скачает недостающие колёса:
  <code>pip show scikit-learn</code> печатает строку <code>Requires: joblib, narwhals, numpy, scipy, threadpoolctl</code>.
  В <code>site-packages</code> появится несколько папок:
</p>

<pre><code>C:\Users\work\proj\.venv\Lib\site-packages\
├── sklearn\                      ← import sklearn
│   ├── __init__.py
│   ├── base.py                   ← BaseEstimator, RegressorMixin — общие родители моделей
│   ├── linear_model\_base.py     ← LinearRegression — обычный Python
│   ├── model_selection\          ← cross_val_score, GridSearchCV
│   ├── utils\validation.py       ← check_is_fitted, validate_data
│   └── …                         ← рядом есть и скомпилированные модули .pyd
├── scipy\                        ← lstsq и LAPACK
├── joblib\  threadpoolctl\  narwhals\
└── scikit_learn-1.9.1.dist-info\</code></pre>

<p>Та же задача, что в части 5, — в четыре строки:</p>

<pre><code>from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X, y)
print(model.coef_, round(model.intercept_, 4))    # [2. 1.] 0.45
print(model.predict([[1, 1]]))                    # [3.45]</code></pre>

<p>
  Числа совпали с моими, но получены по-другому: <code>fit</code> не делает 500 шагов градиентного спуска,
  а решает задачу наименьших квадратов точно, за один вызов. Важнее другое: вместо двух функций и двух
  переменных теперь один <strong>объект</strong>. Посмотрим, что в нём лежит и откуда берутся его методы.
</p>

<div class="stage" id="stageEstimator" tabindex="0">
  <div class="stage-figure">
<svg id="es" viewBox="0 0 960 600" role="img" aria-label="Объект LinearRegression: настройки из конструктора, атрибуты, выученные в fit, и методы, унаследованные от родительских классов; слева — команды в консоли">
  <style>
    #es { font-family: Helvetica, Arial, sans-serif; }
    #es .codebox { fill: #F4F2EC; stroke: #3576C0; stroke-width: 1.5; }
    #es .obj { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.3; }
    #es .sy { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.4; }
    #es .sg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.4; }
    #es .sb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.4; }
    #es .hl { fill: none; stroke: #3576C0; stroke-width: 2.5; }
    #es .ttl { font-size: 15px; font-weight: 700; fill: #111111; }
    #es .sub { font-size: 13px; font-weight: 700; fill: #5E5850; }
    #es .cap { font-size: 13px; fill: #5E5850; }
    #es .code { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #es .out { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #5E5850; }
    #es .err { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #C30B0A; }
    #es .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #es .edger { stroke: #C30B0A; stroke-width: 1.8; fill: none; stroke-dasharray: 5 3; }
    #es .edgeg { stroke: #73B222; stroke-width: 2; fill: none; }
    #es .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="es-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="es-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="es-arwg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
  <rect x="30" y="30" width="420" height="480" rx="8" class="codebox"/>
  <text x="44" y="56" class="ttl">консоль Python</text>
  <g data-key="c1" data-only="1">
    <text x="44" y="90" class="code">&gt;&gt;&gt; model = LinearRegression()</text>
  </g>
  <g data-key="c2" data-only="1">
    <text x="44" y="128" class="code">&gt;&gt;&gt; model.get_params()</text>
    <text x="44" y="150" class="out">{'copy_X': True, 'fit_intercept': True,</text>
    <text x="44" y="168" class="out">'n_jobs': None, 'positive': False, 'tol': 1e-06}</text>
  </g>
  <g data-key="c3" data-only="1">
    <text x="44" y="206" class="code">&gt;&gt;&gt; model.predict([[1, 1]])</text>
    <text x="44" y="228" class="err">NotFittedError: This LinearRegression</text>
    <text x="44" y="246" class="err">instance is not fitted yet. ...</text>
  </g>
  <g data-key="c4" data-only="1">
    <text x="44" y="284" class="code">&gt;&gt;&gt; model.fit(X, y)</text>
    <text x="44" y="306" class="out">LinearRegression()</text>
  </g>
  <g data-key="c5" data-only="1">
    <text x="44" y="344" class="code">&gt;&gt;&gt; model.coef_, round(model.intercept_, 4)</text>
    <text x="44" y="366" class="out">(array([2., 1.]), 0.45)</text>
  </g>
  <g data-key="c6" data-only="1">
    <text x="44" y="404" class="code">&gt;&gt;&gt; model.predict([[1, 1]])</text>
    <text x="44" y="426" class="out">array([3.45])</text>
  </g>
  <g data-key="c7" data-only="1">
    <text x="44" y="464" class="code">&gt;&gt;&gt; model.score(X, y)</text>
    <text x="44" y="486" class="out">0.9950248756218906</text>
  </g>
  <rect x="480" y="30" width="450" height="530" rx="8" class="obj"/>
  <text x="494" y="56" class="ttl">model — объект класса LinearRegression</text>
  <rect x="494" y="72" width="422" height="150" rx="6" class="sy"/>
  <text x="506" y="94" class="sub">настройки: из __init__, имена без _</text>
  <rect x="494" y="234" width="422" height="150" rx="6" class="sg"/>
  <text x="506" y="256" class="sub">выучено в fit: имена с _ на конце</text>
  <rect x="494" y="396" width="422" height="150" rx="6" class="sb"/>
  <text x="506" y="418" class="sub">методы: где определены</text>
  <g data-key="hyp" data-only="1">
    <text x="506" y="118" class="code">fit_intercept</text>
    <text x="650" y="118" class="code">= True</text>
    <text x="506" y="138" class="code">copy_X</text>
    <text x="650" y="138" class="code">= True</text>
    <text x="506" y="158" class="code">tol</text>
    <text x="650" y="158" class="code">= 1e-06</text>
    <text x="506" y="178" class="code">n_jobs</text>
    <text x="650" y="178" class="code">= None</text>
    <text x="506" y="198" class="code">positive</text>
    <text x="650" y="198" class="code">= False</text>
  </g>
  <g data-key="empty" data-only="1">
    <text x="705" y="316" class="cap" text-anchor="middle">пусто: fit ещё не вызывали</text>
  </g>
  <g data-key="learned" data-only="1">
    <text x="506" y="280" class="code">n_features_in_</text>
    <text x="650" y="280" class="code">= 2</text>
    <text x="506" y="300" class="code">coef_</text>
    <text x="650" y="300" class="code">= [2., 1.]</text>
    <text x="506" y="320" class="code">intercept_</text>
    <text x="650" y="320" class="code">= 0.45</text>
    <text x="506" y="340" class="code">rank_</text>
    <text x="650" y="340" class="code">= 2</text>
    <text x="506" y="360" class="code">singular_</text>
    <text x="650" y="360" class="code">= [2.303, 1.303]</text>
  </g>
  <g data-key="meth">
    <text x="506" y="444" class="code">fit(X, y)</text>
    <text x="650" y="444" class="cap">LinearRegression</text>
    <text x="506" y="470" class="code">predict(X)</text>
    <text x="650" y="470" class="cap">MultiOutputLinearModel</text>
    <text x="506" y="496" class="code">score(X, y)</text>
    <text x="650" y="496" class="cap">RegressorMixin</text>
    <text x="506" y="522" class="code">get_params()</text>
    <text x="650" y="522" class="cap">BaseEstimator</text>
  </g>
  <g data-key="hl-fit" data-only="1">
    <rect x="500" y="427" width="410" height="24" rx="5" class="hl"/>
  </g>
  <g data-key="hl-pred" data-only="1">
    <rect x="500" y="453" width="410" height="24" rx="5" class="hl"/>
  </g>
  <g data-key="hl-score" data-only="1">
    <rect x="500" y="479" width="410" height="24" rx="5" class="hl"/>
  </g>
  <g data-key="hl-gp" data-only="1">
    <rect x="500" y="505" width="410" height="24" rx="5" class="hl"/>
  </g>
  <g data-key="a-gp" data-only="1">
    <path d="M 452 138 C 470 138, 470 150, 490 150" class="edge" marker-end="url(#es-arw)"/>
  </g>
  <g data-key="a-nf" data-only="1">
    <path d="M 452 216 C 472 216, 472 300, 490 300" class="edger" marker-end="url(#es-arwr)"/>
  </g>
  <g data-key="a-fit" data-only="1">
    <path d="M 452 292 C 470 292, 470 280, 490 280" class="edgeg" marker-end="url(#es-arwg)"/>
  </g>
  <g data-key="n1" data-only="1">
    <text x="30" y="540" class="cap">__init__ только записывает аргументы в self</text>
  </g>
  <g data-key="n2" data-only="1">
    <text x="30" y="540" class="cap">get_params читает имена аргументов __init__</text>
  </g>
  <g data-key="n3" data-only="1">
    <text x="30" y="540" class="cap">check_is_fitted не нашёл в vars(model) имён на _</text>
  </g>
  <g data-key="n4" data-only="1">
    <text x="30" y="540" class="cap">fit записал атрибуты и вернул self: это и напечатано</text>
  </g>
  <g data-key="n5" data-only="1">
    <foreignObject x="30" y="522.5" width="440" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>те же <span data-tex="\mathbf w = [2,\ 1]"></span> и <span data-tex="b = 0.45"></span>, что у train из части 5</span></div></foreignObject>
  </g>
  <g data-key="n6" data-only="1">
    <foreignObject x="30" y="522.5" width="440" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>внутри predict: <span data-tex="[1,\ 1]\cdot[2,\ 1] + 0.45 = 3.45"></span></span></div></foreignObject>
  </g>
  <g data-key="n7" data-only="1">
    <foreignObject x="30" y="522.5" width="440" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>score — это <span data-tex="R^2 = 1 - 0.09/18.09 \approx 0.995"></span></span></div></foreignObject>
  </g>
  <g data-key="n8" data-only="1">
    <text x="30" y="540" class="cap">родители: RegressorMixin → … → LinearModel → BaseEstimator</text>
  </g>
  <text x="30" y="588" class="legend">жёлтый — настройки · зелёный — выучено из данных · синий — методы · красный — ошибка</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="c1 hyp empty meth n1" data-focus="c1 hyp n1">
      <div class="step-kicker">Шаг 1 · создание</div>
      <h4>Конструктор запоминает настройки</h4>
      <p><code>LinearRegression()</code> создаёт объект и вызывает его <code>__init__</code>. Всё, что тот делает, —
      записывает аргументы в атрибуты под теми же именами: <code>self.fit_intercept = fit_intercept</code> и так далее.
      Аргументы я не передал, поэтому взялись значения по умолчанию. Данных объект ещё не видел.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 hyp empty meth hl-gp a-gp n2" data-focus="c2 hl-gp a-gp n2">
      <div class="step-kicker">Шаг 2 · get_params</div>
      <h4>Настройки можно прочитать одним методом</h4>
      <p>Метода <code>get_params</code> в классе <code>LinearRegression</code> нет: он достался от общего родителя
      всех моделей sklearn, <code>BaseEstimator</code>. Метод смотрит, какие аргументы перечислены в сигнатуре
      <code>__init__</code>, и возвращает словарь с текущими значениями атрибутов с этими именами.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 hyp empty meth a-nf n3" data-focus="c3 a-nf empty n3">
      <div class="step-kicker">Шаг 3 · до обучения</div>
      <h4>predict до fit — понятная ошибка</h4>
      <p>Предсказывать пока нечем: весов нет. Вместо непонятного <code>AttributeError</code> sklearn выдаёт
      <code>NotFittedError</code> с подсказкой вызвать <code>fit</code>. Проверка простая: функция
      <code>check_is_fitted</code> ищет среди атрибутов объекта имена, которые кончаются на <code>_</code>.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 hyp meth learned hl-fit a-fit n4" data-focus="c4 learned a-fit n4">
      <div class="step-kicker">Шаг 4 · fit</div>
      <h4>fit записывает в объект то, что выучил</h4>
      <p><code>model.fit(X, y)</code> проверяет формы <code>X</code> и <code>y</code>, решает задачу наименьших квадратов
      и записывает результат в атрибуты объекта. Сам метод возвращает <code>self</code> — тот же объект, поэтому консоль
      напечатала <code>LinearRegression()</code>, и можно писать цепочкой: <code>LinearRegression().fit(X, y).predict(...)</code>.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 c5 hyp meth learned n5" data-focus="c5 learned n5">
      <div class="step-kicker">Шаг 5 · атрибуты</div>
      <h4>Выученное — атрибуты с подчёркиванием на конце</h4>
      <p><code>coef_</code> — веса, <code>intercept_</code> — сдвиг; это мои <code>w</code> и <code>b</code> из части 5,
      и числа те же. Рядом служебные: <code>n_features_in_</code> — сколько признаков было при обучении,
      <code>rank_</code> и <code>singular_</code> — побочные результаты решения. Подчёркивание на конце — договорённость
      sklearn: так помечено всё, что получено из данных, а не задано вами.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 c5 c6 hyp meth learned hl-pred n6" data-focus="c6 hl-pred n6">
      <div class="step-kicker">Шаг 6 · predict</div>
      <h4>predict — та же формула, что у меня</h4>
      <p>Внутри <code>predict</code> стоит строка <code>return X @ coef_ + self.intercept_</code> — моя функция
      <code>predict</code> из части 5, только веса берутся не из аргументов, а из атрибутов объекта. Передавать их
      больше не нужно: объект носит их с собой.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 c5 c6 c7 hyp meth learned hl-score n7" data-focus="c7 hl-score n7">
      <div class="step-kicker">Шаг 7 · score</div>
      <h4>score достался от родителя</h4>
      <p><code>score</code> считает коэффициент детерминации <span class="math-inline" data-tex="R^2"></span>: единица минус
      отношение суммы квадратов ошибок (0.09) к разбросу ответов вокруг среднего (18.09). Метод написан один раз в
      <code>RegressorMixin</code> и работает у любой регрессии: он вызывает её <code>predict</code> и сравнивает с <code>y</code>.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 c5 c6 c7 hyp meth learned n8" data-focus="meth n8">
      <div class="step-kicker">Шаг 8 · итог</div>
      <h4>Объект модели: настройки, выученное, методы</h4>
      <p>В объекте три вида содержимого. Настройки заданы в конструкторе и после <code>fit</code> не меняются.
      Выученные атрибуты появляются в <code>fit</code> и читаются в <code>predict</code>. Методы собраны из цепочки
      родительских классов: <code>fit</code> свой, <code>predict</code> — от линейных моделей, <code>score</code> — от
      всех регрессий, <code>get_params</code> — от всех моделей sklearn.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>Моя версия из части 5 и объект sklearn отвечают на одни и те же вопросы:</p>

<table class="shape-table">
  <tr><th></th><th>NumPy, часть 5</th><th>scikit-learn</th></tr>
  <tr><td>Настройки</td><td>аргументы <code>lr</code>, <code>steps</code> функции <code>train</code></td><td>аргументы конструктора: <code>LinearRegression(fit_intercept=True)</code></td></tr>
  <tr><td>Обучение</td><td><code>w, b = train(X, y)</code></td><td><code>model.fit(X, y)</code></td></tr>
  <tr><td>Где хранятся параметры</td><td>переменные <code>w</code>, <code>b</code></td><td>атрибуты <code>model.coef_</code>, <code>model.intercept_</code></td></tr>
  <tr><td>Предсказание</td><td><code>predict(X, w, b)</code></td><td><code>model.predict(X)</code></td></tr>
  <tr><td>Оценка</td><td><code>mse(predict(X, w, b), y)</code></td><td><code>model.score(X, y)</code> — это <span class="math-inline" data-tex="R^2"></span>, а не MSE</td></tr>
  <tr><td>Вызов до обучения</td><td><code>TypeError</code> где-то внутри <code>@</code></td><td><code>NotFittedError</code> с подсказкой</td></tr>
</table>

<div class="callout-blue">
  <strong>Почему одни имена с подчёркиванием на конце, а другие без:</strong> это договорённость всех моделей
  sklearn. Аргументы конструктора сохраняются под своими именами без изменений: <code>fit_intercept</code>,
  <code>tol</code>. Всё, что вычислено из данных в <code>fit</code>, получает <code>_</code> на конце:
  <code>coef_</code>, <code>intercept_</code>, <code>n_features_in_</code>. На этой договорённости держится
  проверка «модель обучена?»: <code>check_is_fitted</code> просто ищет такие имена в <code>vars(model)</code>.
</div>

<h3>Внутри оригинала: исходный код LinearRegression</h3>

<p>
  В отличие от <code>matmul</code> в NumPy, код <code>LinearRegression</code> написан на Python, и его не нужно
  искать на GitHub: он лежит в <code>site-packages\sklearn\linear_model\_base.py</code>, его можно открыть в
  редакторе или напечатать прямо из интерпретатора командой
  <code>import inspect; print(inspect.getsource(LinearRegression.fit))</code>. Ссылки ниже ведут на тег
  <code>1.9.1</code>, чтобы номера строк не уехали.
</p>

<table class="shape-table">
  <tr><th>Файл в scikit-learn</th><th>Что в нём</th></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/linear_model/_base.py#L638-L652" target="_blank" rel="noopener"><code>linear_model/_base.py</code></a></td><td><code>LinearRegression.__init__</code>: пять присваиваний <code>self.имя = имя</code> и больше ничего</td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/linear_model/_base.py#L654-L760" target="_blank" rel="noopener"><code>linear_model/_base.py</code></a></td><td><code>LinearRegression.fit</code>: проверка данных, центрирование, <code>linalg.lstsq</code>, сдвиг, <code>return self</code></td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/linear_model/_base.py#L291-L299" target="_blank" rel="noopener"><code>linear_model/_base.py</code></a></td><td><code>LinearModel._decision_function</code> — то, что выполняет <code>predict</code></td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/base.py#L219-L270" target="_blank" rel="noopener"><code>base.py</code></a></td><td><code>BaseEstimator.get_params</code>: имена берутся из сигнатуры <code>__init__</code></td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/base.py#L672-L716" target="_blank" rel="noopener"><code>base.py</code></a></td><td><code>RegressorMixin.score</code>: <code>predict</code> плюс <code>r2_score</code></td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/utils/validation.py#L1599-L1634" target="_blank" rel="noopener"><code>utils/validation.py</code></a></td><td><code>_is_fitted</code>: поиск атрибутов с <code>_</code> на конце</td></tr>
</table>

<p>Весь <code>predict</code> линейной модели — девять строк, и их можно прочитать без подготовки:</p>

<pre><code># sklearn/linear_model/_base.py, класс LinearModel
def _decision_function(self, X):
    check_is_fitted(self)

    X = validate_data(self, X, accept_sparse=["csr", "csc", "coo"], reset=False)
    coef_ = self.coef_
    if coef_.ndim == 1:
        return X @ coef_ + self.intercept_
    else:
        return X @ coef_.T + self.intercept_</code></pre>

<p>
  Строка <code>return X @ coef_ + self.intercept_</code> — моя функция <code>predict</code> из части 5. Ветка
  <code>else</code> нужна, когда модель предсказывает сразу несколько ответов и <code>coef_</code> — матрица.
  Пройдём по всему пути вызовов от моего кода до машинного.
</p>

<div class="stage" id="stageSkSource" tabindex="0">
  <div class="stage-figure">
<svg id="ss" viewBox="0 0 960 580" role="img" aria-label="Путь вызовов fit, predict и score через исходный код scikit-learn, SciPy и NumPy до машинного кода">
  <style>
    #ss { font-family: Helvetica, Arial, sans-serif; }
    #ss .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ss .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ss .bm { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; stroke-dasharray: 6 3; }
    #ss .band { stroke: #C8C3B6; stroke-width: 1; stroke-dasharray: 5 4; }
    #ss .band-t { font-size: 13px; font-weight: 700; fill: #5E5850; }
    #ss .ttl { font-size: 14px; font-weight: 700; fill: #111111; }
    #ss .mono { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #ss .file { font-family: "Courier New", Courier, monospace; font-size: 12px; fill: #8c7106; }
    #ss .cap { font-size: 12.5px; fill: #5E5850; }
    #ss .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #ss .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ss-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="ss-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="ss-arwg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
  <text x="24" y="28" class="band-t">ваш код</text>
  <line x1="20" y1="106" x2="940" y2="106" class="band"/>
  <text x="24" y="120" class="band-t">scikit-learn — обычный Python</text>
  <line x1="20" y1="358" x2="940" y2="358" class="band"/>
  <text x="24" y="372" class="band-t">SciPy и NumPy</text>
  <line x1="20" y1="448" x2="940" y2="448" class="band"/>
  <text x="24" y="462" class="band-t">машинный код</text>
  <g data-key="u">
    <rect x="30" y="40" width="290" height="56" rx="8" class="bx"/>
    <text x="42" y="74" class="mono">model.fit(X, y)</text>
    <rect x="335" y="40" width="290" height="56" rx="8" class="bx"/>
    <text x="347" y="74" class="mono">model.predict(X_new)</text>
    <rect x="640" y="40" width="290" height="56" rx="8" class="bx"/>
    <text x="652" y="64" class="mono">model.score(X, y)</text>
    <text x="652" y="84" class="mono">model.get_params()</text>
  </g>
  <g data-key="f-sk" data-only="1">
    <rect x="30" y="132" width="290" height="228" rx="8" class="by"/>
    <text x="42" y="156" class="ttl">LinearRegression.fit</text>
    <text x="42" y="174" class="file">sklearn/linear_model/_base.py</text>
    <text x="42" y="200" class="mono">validate_data(self, X, y)</text>
    <text x="42" y="218" class="cap">формы и типы, n_features_in_</text>
    <text x="42" y="244" class="mono">_preprocess_data(...)</text>
    <text x="42" y="288" class="mono">linalg.lstsq(X, y)</text>
    <text x="42" y="306" class="cap">веса по центрированным данным</text>
    <text x="42" y="332" class="mono">_set_intercept(...)</text>
    <foreignObject x="42" y="244.5" width="266" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>вычесть средние <span data-tex="\bar{\mathbf x}"></span> и <span data-tex="\bar y"></span></span></div></foreignObject>
    <foreignObject x="42" y="332.5" width="266" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="b = \bar y - \bar{\mathbf x}\cdot\mathbf w"></span></span></div></foreignObject>
    <line x1="270" y1="96" x2="270" y2="128" class="edge" marker-end="url(#ss-arw)"/>
  </g>
  <g data-key="f-low" data-only="1">
    <rect x="30" y="384" width="290" height="56" rx="8" class="by"/>
    <text x="42" y="406" class="mono">scipy.linalg.lstsq</text>
    <text x="42" y="426" class="cap">наименьшие квадраты</text>
    <rect x="30" y="474" width="290" height="56" rx="8" class="bm"/>
    <text x="42" y="496" class="mono">LAPACK · gelsd</text>
    <text x="42" y="516" class="cap">из колеса SciPy</text>
    <line x1="175" y1="360" x2="175" y2="380" class="edge" marker-end="url(#ss-arw)"/>
    <line x1="175" y1="440" x2="175" y2="470" class="edge" marker-end="url(#ss-arw)"/>
  </g>
  <g data-key="p-sk" data-only="1">
    <rect x="335" y="132" width="290" height="228" rx="8" class="by"/>
    <text x="347" y="156" class="ttl">LinearModel._decision_function</text>
    <text x="347" y="174" class="file">sklearn/linear_model/_base.py</text>
    <text x="347" y="204" class="mono">check_is_fitted(self)</text>
    <text x="347" y="222" class="cap">есть ли атрибуты на _</text>
    <text x="347" y="250" class="mono">validate_data(self, X,</text>
    <text x="347" y="268" class="mono">              reset=False)</text>
    <text x="347" y="286" class="cap">признаков столько же, сколько в fit</text>
    <text x="347" y="322" class="mono">return X @ coef_ + self.intercept_</text>
    <line x1="480" y1="96" x2="480" y2="128" class="edge" marker-end="url(#ss-arw)"/>
  </g>
  <g data-key="p-low" data-only="1">
    <rect x="335" y="384" width="290" height="56" rx="8" class="by"/>
    <text x="347" y="406" class="mono">ndarray.__matmul__ → np.matmul</text>
    <text x="347" y="426" class="cap">часть 4</text>
    <rect x="335" y="474" width="290" height="56" rx="8" class="bm"/>
    <text x="347" y="496" class="mono">C-цикл NumPy или BLAS</text>
    <text x="347" y="516" class="cap">float64 → dgemm/dgemv</text>
    <line x1="480" y1="360" x2="480" y2="380" class="edge" marker-end="url(#ss-arw)"/>
    <line x1="480" y1="440" x2="480" y2="470" class="edge" marker-end="url(#ss-arw)"/>
  </g>
  <g data-key="b-sk" data-only="1">
    <rect x="640" y="132" width="290" height="228" rx="8" class="by"/>
    <text x="652" y="156" class="ttl">общие родители</text>
    <text x="652" y="174" class="file">sklearn/base.py</text>
    <text x="652" y="204" class="mono">BaseEstimator.get_params</text>
    <text x="652" y="222" class="cap">inspect.signature(__init__)</text>
    <text x="652" y="258" class="mono">RegressorMixin.score</text>
    <text x="652" y="276" class="mono">y_pred = self.predict(X)</text>
    <text x="652" y="294" class="mono">r2_score(y, y_pred)</text>
    <line x1="785" y1="96" x2="785" y2="128" class="edge" marker-end="url(#ss-arw)"/>
    <line x1="640" y1="276" x2="629" y2="276" class="edge" marker-end="url(#ss-arw)"/>
    <text x="652" y="316" class="cap">score вызывает predict</text>
    <text x="652" y="334" class="cap">той же модели, слева</text>
  </g>
  <text x="30" y="566" class="legend">синий — ваш код · жёлтый — код библиотек · пунктир — скомпилированный код</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="u" data-focus="u">
      <div class="step-kicker">Шаг 1 · вызовы</div>
      <h4>Три вызова одного объекта</h4>
      <p>Сверху — то, что пишу я: <code>fit</code>, <code>predict</code> и <code>score</code>. Каждая точка — поиск
      метода в классе объекта и его родителях, как в части 4. Дальше смотрим, куда ведёт каждый вызов.</p>
    </div>
    <div class="step-panel" data-on="u f-sk" data-focus="f-sk">
      <div class="step-kicker">Шаг 2 · fit в sklearn</div>
      <h4>fit: проверить, центрировать, решить</h4>
      <p><code>validate_data</code> проверяет, что <code>X</code> двумерный, а строк в <code>X</code> и <code>y</code> поровну,
      и запоминает <code>n_features_in_</code>. Затем из каждого столбца вычитается среднее:
      <span class="math-inline" data-tex="\bar{\mathbf x} = [1.5,\ 1]"></span>, <span class="math-inline" data-tex="\bar y = 4.45"></span>.
      По центрированным данным <code>lstsq</code> находит веса <code>[2, 1]</code>, а сдвиг считается отдельно:
      <span class="math-inline" data-tex="b = \bar y - \bar{\mathbf x}\cdot\mathbf w = 4.45 - (1.5\cdot 2 + 1\cdot 1) = 0.45"></span>.</p>
    </div>
    <div class="step-panel" data-on="u f-sk f-low" data-focus="f-low">
      <div class="step-kicker">Шаг 3 · fit ниже</div>
      <h4>Решение — в чужой библиотеке: SciPy</h4>
      <p>Сам sklearn систему не решает: <code>linalg.lstsq</code> — функция SciPy, которую pip поставил как зависимость.
      SciPy, в свою очередь, вызывает процедуру <code>gelsd</code> из LAPACK — скомпилированной библиотеки линейной
      алгебры, родственной BLAS из части 3. Ответ точный, за один вызов, без 500 шагов градиентного спуска.</p>
    </div>
    <div class="step-panel" data-on="u f-sk f-low p-sk" data-focus="p-sk">
      <div class="step-kicker">Шаг 4 · predict в sklearn</div>
      <h4>predict: две проверки и одна строка</h4>
      <p><code>check_is_fitted</code> выдаёт <code>NotFittedError</code>, если <code>fit</code> ещё не вызывали.
      <code>validate_data(..., reset=False)</code> сверяет число признаков с запомненным <code>n_features_in_</code>:
      подать <code>X</code> с тремя столбцами — получить понятную <code>ValueError</code>. Само предсказание — одна строка
      <code>X @ coef_ + self.intercept_</code>.</p>
    </div>
    <div class="step-panel" data-on="u f-sk f-low p-sk p-low" data-focus="p-low">
      <div class="step-kicker">Шаг 5 · predict ниже</div>
      <h4>Оператор @ ведёт в NumPy</h4>
      <p>Дальше путь уже знаком по части 4: <code>@</code> — это <code>ndarray.__matmul__</code>, он вызывает
      ufunc <code>np.matmul</code>, а та для массивов <code>float64</code> отдаёт работу в BLAS. Слои складываются:
      sklearn вызывает NumPy, NumPy вызывает BLAS.</p>
    </div>
    <div class="step-panel" data-on="u f-sk f-low p-sk p-low b-sk" data-focus="b-sk">
      <div class="step-kicker">Шаг 6 · родители</div>
      <h4>Общие методы лежат в base.py</h4>
      <p><code>get_params</code> и <code>score</code> написаны в <code>sklearn/base.py</code> один раз для всех моделей.
      <code>score</code> сам ничего не обучает: он вызывает <code>self.predict(X)</code> — тот, что стоит слева, —
      и сравнивает ответы через <code>r2_score</code>. Поэтому <code>score</code> работает у любого класса, который
      унаследовал <code>RegressorMixin</code> и написал свой <code>predict</code>.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> модель sklearn — объект, в котором лежат настройки из конструктора и
  выученные в <code>fit</code> атрибуты с <code>_</code> на конце, а методы собраны из цепочки родительских
  классов. Внутри <code>predict</code> стоит тот же <code>X @ coef_ + intercept_</code>, а <code>fit</code>
  отдаёт решение SciPy и LAPACK.
</div>

<hr>

<h2 id="part-7">Часть 7. Библиотека и фреймворк: кто кого вызывает</h2>

<p>
  Сравним три реализации одной модели построчно: что в каждой пишете вы, а что делает библиотека.
</p>

<div class="stage" id="stageLevels" tabindex="0">
  <div class="stage-figure">
<svg id="lv" viewBox="0 0 960 600" role="img" aria-label="Таблица: какие этапы работы с линейной регрессией пишете вы, а какие берёт на себя библиотека, в чистом Python, NumPy и scikit-learn">
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
    <text x="822" y="80" class="ttl" text-anchor="middle">scikit-learn</text>
    <text x="24" y="136" class="rlbl">умножение</text>
    <text x="24" y="206" class="rlbl">предсказание</text>
    <text x="24" y="276" class="rlbl">ошибка</text>
    <text x="24" y="346" class="rlbl">обучение</text>
    <text x="24" y="416" class="rlbl">параметры</text>
    <text x="24" y="486" class="rlbl">проверка</text>
  </g>
  <g data-key="cpy">
    <rect x="205" y="100" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="126" class="code" text-anchor="middle">for i, j, k: s += …</text>
    <text x="322" y="147" class="cap" text-anchor="middle">вы — часть 1</text>
    <rect x="205" y="170" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="196" class="code" text-anchor="middle">циклы по объектам</text>
    <text x="322" y="217" class="cap" text-anchor="middle">вы</text>
    <rect x="205" y="240" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="266" class="code" text-anchor="middle">sum((yh - y)**2) / n</text>
    <text x="322" y="287" class="cap" text-anchor="middle">вы</text>
    <rect x="205" y="310" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="336" class="code" text-anchor="middle">производные в циклах</text>
    <text x="322" y="357" class="cap" text-anchor="middle">вы</text>
    <rect x="205" y="380" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="406" class="code" text-anchor="middle">переменные w, b</text>
    <text x="322" y="427" class="cap" text-anchor="middle">вы</text>
    <rect x="205" y="450" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="476" class="code" text-anchor="middle">цикл по частям данных</text>
    <text x="322" y="497" class="cap" text-anchor="middle">вы</text>
  </g>
  <g data-key="np1">
    <rect x="455" y="100" width="235" height="60" rx="8" class="cg"/>
    <text x="572" y="126" class="code" text-anchor="middle">X @ w</text>
    <text x="572" y="147" class="cap" text-anchor="middle">библиотека: C и BLAS</text>
  </g>
  <g data-key="cnp">
    <rect x="455" y="170" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="196" class="code" text-anchor="middle">predict(X, w, b)</text>
    <text x="572" y="217" class="cap" text-anchor="middle">вы</text>
    <rect x="455" y="240" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="266" class="code" text-anchor="middle">mse(y_hat, y)</text>
    <text x="572" y="287" class="cap" text-anchor="middle">вы</text>
    <rect x="455" y="310" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="336" class="code" text-anchor="middle">dw = 2/n*(X.T @ err)</text>
    <text x="572" y="357" class="cap" text-anchor="middle">каждая формула — вы</text>
    <rect x="455" y="380" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="406" class="code" text-anchor="middle">w, b = train(X, y)</text>
    <text x="572" y="427" class="cap" text-anchor="middle">храните и передаёте вы</text>
    <rect x="455" y="450" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="476" class="code" text-anchor="middle">цикл по частям данных</text>
    <text x="572" y="497" class="cap" text-anchor="middle">вы</text>
  </g>
  <g data-key="s14">
    <rect x="705" y="100" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="126" class="code" text-anchor="middle">X @ coef_</text>
    <text x="822" y="147" class="cap" text-anchor="middle">внутри predict</text>
    <rect x="705" y="170" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="196" class="code" text-anchor="middle">model.predict(X)</text>
    <text x="822" y="217" class="cap" text-anchor="middle">метод объекта</text>
    <rect x="705" y="240" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="266" class="code" text-anchor="middle">model.score(X, y)</text>
    <text x="822" y="287" class="cap" text-anchor="middle">метод от RegressorMixin</text>
    <rect x="705" y="310" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="336" class="code" text-anchor="middle">model.fit(X, y)</text>
    <text x="822" y="357" class="cap" text-anchor="middle">точное решение lstsq</text>
  </g>
  <g data-key="s5">
    <rect x="705" y="380" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="406" class="code" text-anchor="middle">coef_, intercept_</text>
    <text x="822" y="427" class="cap" text-anchor="middle">хранит сам объект</text>
  </g>
  <g data-key="s6">
    <rect x="705" y="450" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="476" class="code" text-anchor="middle">cross_val_score(model, X, y)</text>
    <text x="822" y="497" class="cap" text-anchor="middle">вызывает fit и predict</text>
  </g>
  <g data-key="ioc" data-only="1">
    <rect x="700" y="445" width="245" height="70" rx="10" class="iocr"/>
    <text x="205" y="545" class="ioct">cross_val_score сам вызывает fit и predict вашей модели: здесь sklearn работает как фреймворк</text>
  </g>
  <text x="24" y="588" class="legend">синий — этот код пишете вы · зелёный — это делает библиотека · строки — этапы из частей 5 и 6</text>
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
      <h4>Одна модель, шесть этапов, три реализации</h4>
      <p>Строки — этапы работы с линейной регрессией из частей 5 и 6, столбцы — три уровня инструментов.
      Для каждой клетки задаём один вопрос: кто пишет этот код — вы или библиотека?</p>
    </div>
    <div class="step-panel" data-on="hdr cpy" data-focus="cpy">
      <div class="step-kicker">Шаг 2 · чистый Python</div>
      <h4>Без библиотек всё синее</h4>
      <p>Умножение — три цикла из части 1, предсказание и ошибка — циклы по объектам, градиент — ещё циклы,
      а проверку на разных частях данных тоже придётся писать вручную. Работает, но каждая строка на вашей ответственности.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp" data-focus="np1 cnp">
      <div class="step-kicker">Шаг 3 · NumPy</div>
      <h4>NumPy забирает только вычисления</h4>
      <p>Зелёной стала одна клетка: <code>@</code> и прочие операции над массивами. Предсказание, ошибка,
      градиент, хранение <code>w</code> и <code>b</code> — по-прежнему ваш код, просто записанный короче.
      NumPy — классическая библиотека: вы её вызываете, когда вам нужно.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp s14" data-focus="s14">
      <div class="step-kicker">Шаг 4 · scikit-learn</div>
      <h4>Модель и обучение — готовые методы</h4>
      <p>В sklearn формулы предсказания, ошибки и обучения уже написаны: <code>predict</code>, <code>score</code>,
      <code>fit</code>. Вы не выписываете градиент и не выбираете шаг: <code>fit</code> решает задачу точно через
      <code>lstsq</code>. Умножение внутри — тот же <code>@</code> из NumPy.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp s14 s5" data-focus="s5">
      <div class="step-kicker">Шаг 5 · объект</div>
      <h4>Параметры хранит объект</h4>
      <p>В NumPy-версии <code>w</code> и <code>b</code> — две переменные, которые нужно не потерять и передать в
      <code>predict</code>. В sklearn они записаны в атрибуты <code>coef_</code> и <code>intercept_</code> того же
      объекта, у которого вызывается <code>predict</code>.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp s14 s5 s6" data-focus="s6">
      <div class="step-kicker">Шаг 6 · проверка</div>
      <h4>Проверка на частях данных — одной функцией</h4>
      <p>Чтобы оценить модель честно, её обучают на одной части данных и проверяют на другой, и так несколько раз.
      <code>cross_val_score(model, X, y, cv=5)</code> делает это сам: режет данные, обучает копии модели и собирает
      оценки <code>score</code>.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp s14 s5 s6 ioc" data-focus="s6 ioc">
      <div class="step-kicker">Шаг 7 · кто кого вызывает</div>
      <h4>Здесь управление переворачивается</h4>
      <p>Во всех клетках выше вы вызываете библиотеку. В последней — наоборот: вы отдаёте модель, а
      <code>cross_val_score</code> сам решает, когда вызвать её <code>fit</code> и <code>predict</code>.
      Подойдёт любой объект с этими методами — в том числе написанный вами.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте ← → для навигации.</p>

<p>
  Теперь можно дать определение, которое не зависит от размера пакета или от того, как он
  себя называет. <strong>Библиотеку вызываете вы</strong>: ваш код управляет порядком
  действий, а библиотека выполняет отдельные поручения — умножь, отсортируй, прочитай
  файл. <strong>Фреймворк вызывает вас</strong>: порядок действий задан им, а вы
  заполняете оставленные для вас места. Этот переворот называют <em>инверсией управления</em>.
</p>

<p>
  В sklearn обе роли видны на одном примере. Пока вы пишете <code>model.fit(X, y)</code>, sklearn —
  библиотека. Но <code>cross_val_score</code>, <code>GridSearchCV</code> и <code>Pipeline</code> принимают модель и
  сами решают, когда вызвать её <code>fit</code> и <code>predict</code>. Им подходит любой объект с этими
  методами — в том числе мой градиентный спуск из части 5, если завернуть его в класс:
</p>

<pre><code>from sklearn.base import BaseEstimator, RegressorMixin
from sklearn.model_selection import cross_val_score

class GDRegressor(RegressorMixin, BaseEstimator):
    def __init__(self, lr=0.1, steps=500):
        self.lr = lr                    # только запоминаю настройки
        self.steps = steps

    def fit(self, X, y):
        print("fit на", len(X), "объектах")
        self.coef_, self.intercept_ = train(X, y, self.lr, self.steps)   # функция из части 5
        return self

    def predict(self, X):
        return X @ self.coef_ + self.intercept_

model = GDRegressor().fit(X, y)          # fit на 4 объектах
print(model.coef_.round(4))              # [2. 1.]
print(model.get_params())                # {'lr': 0.1, 'steps': 500}
print(round(model.score(X, y), 4))       # 0.995

scores = cross_val_score(GDRegressor(), X, y, cv=2)
# fit на 2 объектах
# fit на 2 объектах</code></pre>

<p>
  Я написал только <code>__init__</code>, <code>fit</code> и <code>predict</code>. <code>get_params</code> достался
  от <code>BaseEstimator</code>, <code>score</code> — от <code>RegressorMixin</code>, и он работает через мой
  <code>predict</code>. Строка «fit на 2 объектах» напечаталась дважды, хотя сам я так <code>fit</code> не вызывал:
  <code>cross_val_score</code> разрезал четыре объекта на две части (<code>cv=2</code>), для каждой создал свежую
  копию модели, обучил её на одной части и оценил на другой. Копию он собирает по <code>get_params</code>,
  поэтому <code>__init__</code> должен только сохранять аргументы под теми же именами: любая другая логика в
  конструкторе в копию не попадёт.
</p>

<div class="callout-yellow">
  <strong>Чем мой класс хуже LinearRegression:</strong> мой <code>predict</code> не вызывает
  <code>check_is_fitted</code>, поэтому до <code>fit</code> он упадёт с <code>AttributeError: 'GDRegressor' object
  has no attribute 'coef_'</code>, а не с понятным <code>NotFittedError</code>. Готовые модели sklearn добавляют
  такие проверки в каждый метод.
</div>

<p>
  В глубоком обучении разделение то же. В PyTorch модель описывают классом-наследником
  <code>nn.Module</code> с методом <code>forward</code>, но вызывают её как <code>model(x)</code>: метод
  <code>nn.Module.__call__</code> из кода фреймворка выполняет служебную работу и уже сам вызывает ваш
  <code>forward</code>. Надстройка PyTorch Lightning забирает и цикл обучения: вы пишете
  <code>training_step</code> для одного шага, а <code>trainer.fit</code> решает, когда его вызвать. Как такая
  сеть учится внутри, разобрано в статьях
  <a href="article.html?slug=mlp-full-cycle">«Полносвязная нейросеть с нуля»</a> и
  <a href="article.html?slug=how-network-learns">«Как обучается нейросеть»</a>.
</p>

<table class="shape-table">
  <tr><th></th><th>Библиотека</th><th>Фреймворк</th></tr>
  <tr><td>Кто управляет порядком</td><td>ваш код</td><td>фреймворк</td></tr>
  <tr><td>Как вы с ним работаете</td><td>вызываете функции и методы</td><td>наследуете классы, переопределяете методы, отдаёте свои объекты</td></tr>
  <tr><td>Что отдаёте</td><td>отдельные вычисления</td><td>целый сценарий работы</td></tr>
  <tr><td>Примеры из статьи</td><td><code>numpy</code>, <code>model.fit(X, y)</code></td><td><code>cross_val_score</code>, <code>GridSearchCV</code>, <code>Pipeline</code>; в PyTorch — <code>nn.Module.__call__</code> и <code>Trainer</code> из Lightning</td></tr>
  <tr><td>Вне ML</td><td><code>requests</code>, <code>json</code></td><td>Django, FastAPI: вы пишете обработчик, сервер сам решает, когда его вызвать</td></tr>
</table>

<div class="callout-blue">
  <strong>Граница размыта, и это нормально:</strong> scikit-learn обычно называют библиотекой, хотя
  <code>cross_val_score</code> и <code>Pipeline</code> устроены как маленький фреймворк; PyTorch называют
  фреймворком, хотя половиной он — библиотека тензоров, которую можно использовать как NumPy. Вместо спора о
  названии полезнее задать вопрос из сцены выше: какую часть программы этот инструмент забирает у меня и кто в
  ней решает, что вызывать дальше.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> иерархия инструментов — это список того, что вы перестаёте писать
  сами: NumPy забирает циклы умножения, объект sklearn — обучение, хранение параметров и оценку, а
  <code>cross_val_score</code> — ещё и порядок вызовов: дальше он сам вызывает <code>fit</code> и
  <code>predict</code> вашей модели.
</div>

<hr>

<h2 id="part-8">Часть 8. Что важно уметь восстановить по памяти</h2>

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
  <li><strong>Обучение — предсказание, ошибка, градиент, шаг, повтор.</strong> Для линейной регрессии это
  <code>X @ w + b</code>, <code>y_hat - y</code>, <code>2 / n * (X.T @ err)</code> и <code>w -= lr * dw</code>; на NumPy
  вы пишете каждую строку, в sklearn всё это — <code>model.fit(X, y)</code>.</li>
  <li><strong>Модель sklearn — объект из трёх частей.</strong> Настройки из <code>__init__</code>
  (<code>fit_intercept</code>), выученные в <code>fit</code> атрибуты с <code>_</code> на конце (<code>coef_</code>,
  <code>intercept_</code>) и методы, часть которых унаследована: <code>score</code> от <code>RegressorMixin</code>,
  <code>get_params</code> от <code>BaseEstimator</code>.</li>
  <li><strong>Библиотеку вызываете вы, фреймворк вызывает вас.</strong> Признак фреймворка —
  вы пишете <code>fit</code> или <code>forward</code>, а вызывают их <code>cross_val_score</code> или <code>Trainer</code>.</li>
</ol>

<p>
  Если унести одну картину, то такую: внизу всегда те же три вложенных цикла из первой
  части. Каждый следующий уровень берёт на себя ещё один кусок программы, который раньше
  приходилось писать вручную: NumPy — сами циклы, объект sklearn — обучение, хранение параметров
  и оценку, <code>cross_val_score</code> — порядок вызовов. Всё, что отдано, вы больше не
  пишете, но и порядок этих действий задаёт уже код библиотеки.
</p>

<p class="tiny">
  Все числа статьи посчитаны скриптом на Python: умножение циклами и через <code>@</code> дают одинаковое
  <code>[[2, 3], [8, 0]]</code>; градиентный спуск на NumPy за 500 шагов и <code>LinearRegression</code> из
  scikit-learn 1.9.1 дают одинаковые <code>w = [2, 1]</code>, <code>b = 0.45</code> (до четырёх знаков),
  <code>score</code> равен 0.995. Пути вида <code>C:\Users\work\…</code>, версии пакетов и имена файлов с хешами
  у вас будут немного другими. Ссылки на исходники NumPy ведут на тег <code>v2.5.3</code>, на исходники
  scikit-learn — на тег <code>1.9.1</code>; поведение <code>out=</code>, подкласса и <code>__array_ufunc__</code>
  проверено на NumPy 2.5.3.
</p>
