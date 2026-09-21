



<p class="lead">
  Бэкпроп — это не отдельная теория, а чтение схемы сети в обратную сторону.
  Чтобы узнать, как общая ошибка зависит от конкретного параметра, надо пройти по
  стрелкам от ошибки к этому параметру и перемножить то, что написано на каждом
  участке пути. Всё остальное — бухгалтерия: как не считать одно и то же дважды и
  как сложить результат в матрицы.
</p>

<p>
  Начнём с цепного правила, но не с формулы, а с картинки: соберём граф
  вычисления снизу вверх на маленьком числовом примере, а потом заменим в этом
  же графе имена узлов на <code>x</code>, <code>w</code>, <code>z</code>,
  <code>a</code> и <code>E</code> — и получим нейрон, ничего не меняя в рассуждении.
  Дальше по этой же логике выведем градиенты <strong>по всем параметрам</strong>
  сети 2-2-2 — восемь весов и четыре смещения, ни одного «и так далее по аналогии».
</p>

<div class="callout-blue">
  <strong>Как устроены интерактивы:</strong> формула стоит прямо над тем
  элементом, к которому относится: над колонкой сумматоров — <code>z⁽¹⁾ =
  W⁽¹⁾x⁽⁰⁾ + b⁽¹⁾</code>, над колонкой активаций — <code>a⁽¹⁾ = σ(z⁽¹⁾)</code>.
  Записи короткие и не стираются, а накапливаются, так что к концу сцены весь
  проход виден целиком. Полное раскрытие в матричном виде живёт в описании шага
  под схемой, а под самой схемой подписана топология: сколько узлов в слое и
  какой формы его параметры. Графы первой части растут <strong>снизу
  вверх</strong>: внизу вход, наверху результат, красные подписи на рёбрах —
  направление производной.
</div>

<div class="callout-yellow">
  <strong>Каждый вывод показан дважды.</strong> Сначала идёт сцена в переменных,
  сразу под ней — сцена в числах с теми же шагами и той же подсветкой. Третья
  сцена части сворачивает всё в компактную матричную запись — ту самую, что стоит
  в коде фреймворков.
</div>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Правило цепочки и умножение матриц</strong>
    <p>Достаточно помнить, что производная композиции — произведение производных, и как перемножаются матрица на вектор.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Сеть 2-2-2, сигмоида, один пример</strong>
    <p>Вход (0.5, 0.8), цель (1, 0). Одни и те же числа проходят через все двенадцать градиентов.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Вывод формул по картинке</strong>
    <p>Вы сможете восстановить уравнения бэкпропа по схеме сети и объяснить, откуда берётся транспонирование и почему градиент затухает.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#73B222"></i>прямой проход: данные текут вперёд</span>
  <span><i style="background:#C30B0A"></i>обратный проход: градиент течёт назад</span>
  <span><i style="background:#C29E08"></i>параметры и их градиенты</span>
  <span><i style="background:#3576C0"></i>числа сквозного примера</span>
</div>



## Часть 1. Цепное правило: весь инструмент целиком

<p>
  Прежде чем открывать схему сети, стоит потратить пять минут на инструмент, из
  которого бэкпроп сделан целиком. Инструмент ровно один — правило
  дифференцирования сложной функции, оно же цепное правило. Ничего сверх него в
  алгоритме нет: ни хитрой оптимизации, ни специальной теории для нейросетей.
</p>

### Производная — это коэффициент передачи

<p>
  Забудьте на минуту про касательные и пределы. Для бэкпропа производная — это
  ответ на один практический вопрос: <strong>если я толкну вход на маленькую
  величину, на сколько сдвинется выход?</strong> Толкнули <code>u</code> на
  0.001, выход сдвинулся на 0.028 — значит, коэффициент передачи равен 28.
</p>

<div class="math-display" data-tex="\Delta s \;\approx\; \frac{ds}{du}\cdot \Delta u"></div>

<p>
  Теперь представьте, что между входом и выходом стоит промежуточная величина:
  <code>u</code> двигает <code>v</code>, а <code>v</code> двигает <code>s</code>.
  Это две шестерни на одном валу. Если первая передаёт движение с коэффициентом 2,
  а вторая — с коэффициентом 14, то вход двигает выход в 28 раз сильнее.
  Передаточные отношения <em>перемножаются</em> — и это всё цепное правило.
</p>

<div class="math-display" data-tex="\frac{ds}{du} \;=\; \frac{ds}{dv}\cdot\frac{dv}{du}"></div>

<div class="callout-blue">
  <strong>Почему именно умножение.</strong> Толчок <code>Δu</code> сначала
  превращается в <code>Δv = 2·Δu</code>, а этот сдвиг — в
  <code>Δs = 14·Δv = 14·2·Δu</code>. Множители копятся
  вдоль пути один за другим, потому что каждое следующее звено работает уже с
  результатом предыдущего.
</div>

### На развилке вклады складываются

<p>
  Второе правило нужно, когда вход влияет на результат несколькими способами
  сразу — например, одно и то же <code>u</code> входит и в первый множитель, и во
  второй. Тогда при толчке <code>u</code> срабатывают <em>оба</em> маршрута
  одновременно, и их эффекты просто складываются.
</p>

<div class="math-display" data-tex="\frac{ds}{du} \;=\; \sum_{k} \frac{\partial s}{\partial v_k}\cdot\frac{dv_k}{du}"></div>

<p>
  Дальше в статье не появится ни одного нового правила. Появятся только более
  длинные пути и более широкие развилки.
</p>

### Интерактив 1 · граф собирается снизу вверх

<p>
  Возьмём выражение, которое неприятно дифференцировать в лоб, и не будем его
  дифференцировать в лоб. Разрежем его на элементарные операции, сложим из них
  граф снизу вверх, прогоним через граф число, а потом пройдём обратно — сверху
  вниз — перемножая то, что написано на рёбрах.
</p>

<div class="stage" id="stageGraph" tabindex="0">
  <div class="stage-figure">
<svg id="gb" viewBox="0 0 960 660" role="img" aria-label="Граф вычисления собирается снизу вверх, затем производная читается по путям">
  <style>
    #gb { font-family: Helvetica, Arial, sans-serif; }
    #gb .cap { font-size: 14px; fill: #5E5850; }
    #gb .nd { fill: #FFFFFF; stroke: #3576C0; stroke-width: 2; }
    #gb .ndr { fill: #F0FAF0; stroke: #73B222; stroke-width: 2; }
    #gb .nl { font-size: 17px; fill: #111111; }
    #gb .nv { font-size: 15px; fill: #3576C0; font-weight: 700; }
    #gb .ed { stroke: #9FBEE0; stroke-width: 2.4; fill: none; }
    #gb .hp { stroke: #C30B0A; stroke-width: 6; fill: none; opacity: .32; stroke-linecap: round; }
    #gb .dl { font-size: 13px; fill: #C30B0A; }
    #gb .card { fill: #FFFFFF; stroke: #E0DACE; stroke-width: 1.5; }
    #gb .ct { font-size: 13px; fill: #5E5850; }
    #gb .note { font-size: 14px; }
    #gb .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="gb-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9FBEE0"/>
    </marker>
  </defs>

  <text x="40" y="32" class="cap">Выражение, которое надо продифференцировать по u</text>

  <g data-key="expr">
    <foreignObject x="40" y="44" width="520" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="s = \bigl(3u\,(u+1)\bigr)^{2}, \qquad u = 1"></div>
    </foreignObject>
  </g>

  <g data-key="nu">
    <rect x="250" y="492" width="170" height="58" rx="12" class="nd"/>
    <text x="335" y="517" class="nl" text-anchor="middle">u — вход</text>
  </g>

  <g data-key="n1">
    <line x1="315" y1="492" x2="222" y2="434" class="ed" marker-end="url(#gb-arw)"/>
    <line x1="355" y1="492" x2="448" y2="434" class="ed" marker-end="url(#gb-arw)"/>
    <rect x="110" y="372" width="170" height="58" rx="12" class="nd"/>
    <rect x="390" y="372" width="170" height="58" rx="12" class="nd"/>
    <text x="195" y="397" class="nl" text-anchor="middle">p = u + 1</text>
    <text x="475" y="397" class="nl" text-anchor="middle">q = 3u</text>
  </g>

  <g data-key="n2">
    <line x1="222" y1="372" x2="315" y2="314" class="ed" marker-end="url(#gb-arw)"/>
    <line x1="448" y1="372" x2="355" y2="314" class="ed" marker-end="url(#gb-arw)"/>
    <rect x="250" y="252" width="170" height="58" rx="12" class="nd"/>
    <text x="335" y="277" class="nl" text-anchor="middle">r = p · q</text>
  </g>

  <g data-key="n3">
    <line x1="335" y1="252" x2="335" y2="194" class="ed" marker-end="url(#gb-arw)"/>
    <rect x="250" y="132" width="170" height="58" rx="12" class="ndr"/>
    <text x="335" y="157" class="nl" text-anchor="middle">s = r²</text>
  </g>

  <g data-key="vl" data-only="1">
    <text x="335" y="539" class="nv" text-anchor="middle">u = 1</text>
    <text x="195" y="419" class="nv" text-anchor="middle">p = 2</text>
    <text x="475" y="419" class="nv" text-anchor="middle">q = 3</text>
    <text x="335" y="299" class="nv" text-anchor="middle">r = 6</text>
    <text x="335" y="179" class="nv" text-anchor="middle">s = 36</text>
  </g>

  <g data-key="dr" data-only="1">
    <text x="252" y="452" class="dl" text-anchor="end">dp/du = 1</text>
    <text x="418" y="452" class="dl" text-anchor="start">dq/du = 3</text>
    <text x="252" y="336" class="dl" text-anchor="end">∂r/∂p = q = 3</text>
    <text x="418" y="336" class="dl" text-anchor="start">∂r/∂q = p = 2</text>
    <text x="352" y="226" class="dl" text-anchor="start">ds/dr = 2r = 12</text>
  </g>

  <g data-key="p1" data-only="1">
    <line x1="315" y1="492" x2="222" y2="434" class="hp"/>
    <line x1="222" y1="372" x2="315" y2="314" class="hp"/>
    <line x1="335" y1="252" x2="335" y2="194" class="hp"/>
    <rect x="600" y="132" width="340" height="80" rx="12" class="card"/>
    <text x="616" y="156" class="ct">Путь 1: u → p → r → s</text>
    <foreignObject x="612" y="162" width="316" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="12 \cdot 3 \cdot 1 = 36"></div>
    </foreignObject>
  </g>

  <g data-key="p2" data-only="1">
    <line x1="355" y1="492" x2="448" y2="434" class="hp" stroke-dasharray="10 7"/>
    <line x1="448" y1="372" x2="355" y2="314" class="hp" stroke-dasharray="10 7"/>
    <rect x="600" y="232" width="340" height="80" rx="12" class="card"/>
    <text x="616" y="256" class="ct">Путь 2: u → q → r → s</text>
    <foreignObject x="612" y="262" width="316" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="12 \cdot 2 \cdot 3 = 72"></div>
    </foreignObject>
  </g>

  <g data-key="sm" data-only="1">
    <rect x="600" y="332" width="340" height="80" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
    <text x="616" y="356" class="ct">Сумма по путям — ответ</text>
    <foreignObject x="612" y="362" width="316" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{ds}{du} = 36 + 72 = 108"></div>
    </foreignObject>
  </g>

  <g data-key="ck" data-only="1">
    <rect x="600" y="432" width="340" height="80" rx="12" class="card"/>
    <text x="616" y="456" class="ct">Проверка в лоб</text>
    <foreignObject x="612" y="462" width="316" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="18u(u+1)(2u+1)\big|_{u=1} = 108"></div>
    </foreignObject>
  </g>

  <g data-key="nb" data-only="1">
    <rect x="40" y="576" width="880" height="44" rx="9" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
    <text x="480" y="603" class="note" text-anchor="middle" fill="#A30908">Нейросеть — такой же граф: узлы это z и a, числа на рёбрах это веса, а роль s играет ошибка E</text>
  </g>

  <text x="40" y="644" class="legend">синий — узлы и значения прямого прохода · красный — локальные производные и пути · зелёный — итог</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="expr nu" data-focus="nu">
      <div class="step-kicker">Шаг 1 · фундамент</div>
      <h4>Начинаем с самого низа — со входа</h4>
      <p>Внизу графа лежит то, по чему мы будем дифференцировать: переменная
      <code>u</code>. Всё остальное вырастет над ней.</p>
      <p>Правило сборки одно: <strong>один узел — одна элементарная операция</strong>,
      производную которой вы помните наизусть. Сложность выражения уйдёт не в
      формулы, а в количество узлов.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1" data-focus="n1">
      <div class="step-kicker">Шаг 2 · первый ярус</div>
      <h4>От входа отходят две стрелки — это развилка</h4>
      <p>Внутри <code>3u(u+1)</code> величина <code>u</code> используется дважды:
      один раз в скобке <code>u + 1</code>, второй раз в множителе <code>3u</code>.
      Дадим этим кускам имена <code>p</code> и <code>q</code>.</p>
      <p>Развилка появилась не потому, что мы так нарисовали, а потому что так
      устроено выражение. В сети она возникнет по той же причине: один нейрон
      кормит сразу несколько нейронов следующего слоя.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2" data-focus="n2">
      <div class="step-kicker">Шаг 3 · слияние</div>
      <h4>Ветви сходятся обратно в одном узле</h4>
      <p>Узел <code>r = p · q</code> принимает обе ветви. Обратите внимание: сам
      узел ничего не знает о том, что <code>p</code> и <code>q</code> выросли из
      общего корня. Он умеет только умножать два своих входа.</p>
      <p>Эта близорукость узлов — не недостаток, а именно то, что позволит потом
      автоматизировать дифференцирование.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3" data-focus="n3">
      <div class="step-kicker">Шаг 4 · вершина</div>
      <h4>Граф собран: четыре операции вместо одной страшной формулы</h4>
      <p>Последний узел возводит <code>r</code> в квадрат. Наверху графа стоит
      величина, которую мы хотим контролировать, — в сети её место займёт ошибка.</p>
      <p>Ни одной сложной производной в графе нет: прибавить единицу, умножить на
      три, перемножить, возвести в квадрат.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl" data-focus="vl">
      <div class="step-kicker">Шаг 5 · прямой проход</div>
      <h4>Пропускаем число снизу вверх и всё запоминаем</h4>
      <p>При <code>u = 1</code> получаем <code>p = 2</code>, <code>q = 3</code>,
      <code>r = 6</code> и <code>s = 36</code>. Значения считаются в том же
      порядке, в каком строился граф: снизу вверх.</p>
      <p>Промежуточные числа не выбрасываем. Через шаг окажется, что производные
      выражаются именно через них — и в этом весь смысл хранить активации.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl dr" data-focus="dr">
      <div class="step-kicker">Шаг 6 · локальные производные</div>
      <h4>На каждом ребре пишем одно маленькое число</h4>
      <p>Ребро <code>u → p</code>: производная суммы равна 1. Ребро
      <code>u → q</code>: 3. Для умножения производная по одному входу равна
      другому входу, поэтому <code>∂r/∂p = q = 3</code>, а
      <code>∂r/∂q = p = 2</code>. Наверху <code>ds/dr = 2r = 12</code>.</p>
      <p>Каждое число <em>локально</em>: чтобы его посчитать, достаточно знать
      операцию в узле и значения, сохранённые на прямом проходе. Никакой узел не
      смотрит дальше своих соседей.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl dr p1" data-focus="p1">
      <div class="step-kicker">Шаг 7 · первый маршрут</div>
      <h4>Идём сверху вниз и перемножаем то, что на рёбрах</h4>
      <p>Маршрут <code>u → p → r → s</code> состоит из трёх рёбер с числами 1, 3 и
      12. Перемножаем: 12 · 3 · 1 = 36. Это вклад <em>одного</em> способа, которым
      <code>u</code> влияет на <code>s</code>.</p>
      <p>Направление важно: значения текут вверх, производные читаются вниз. Отсюда
      и название — обратное распространение.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl dr p1 p2" data-focus="p2">
      <div class="step-kicker">Шаг 8 · второй маршрут</div>
      <h4>Второй путь считается ровно так же</h4>
      <p>Маршрут <code>u → q → r → s</code> даёт 12 · 2 · 3 = 72. Верхнее ребро
      <code>r → s</code> входит в оба маршрута — его производную мы посчитали один
      раз и используем дважды.</p>
      <p>Именно на этом наблюдении держится эффективность бэкпропа: общие участки
      пути не пересчитываются заново для каждого параметра.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl dr p1 p2 sm ck nb" data-focus="sm ck">
      <div class="step-kicker">Шаг 9 · сумма и проверка</div>
      <h4>Складываем маршруты — и сверяемся с честным дифференцированием</h4>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · два способа получить один ответ</div>
        <div class="worked-trace">
          <div class="worked-trace-title">По графу и в лоб</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">через p</div>
            <div class="math-display worked-trace-math" data-tex="12 \cdot 3 \cdot 1 = 36"></div>
            <div class="worked-trace-note">производные вдоль первого маршрута</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">через q</div>
            <div class="math-display worked-trace-math" data-tex="12 \cdot 2 \cdot 3 = 72"></div>
            <div class="worked-trace-note">то же самое вдоль второго маршрута</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">в лоб</div>
            <div class="math-display worked-trace-math" data-tex="s = 9u^{2}(u+1)^{2} \;\Rightarrow\; \frac{ds}{du} = 18u(u+1)(2u+1) = 108"></div>
            <div class="worked-trace-note">раскрыли скобки и продифференцировали как обычно</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> 36 + 72 = 108
        — ровно то же, что даёт прямое дифференцирование. Сумма по путям не
        приближение и не эвристика, а точное правило. Разница только в том, что по
        графу считать механически, а в лоб — надо не ошибиться в скобках.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 2 · нейрон — это та же цепочка

<p>
  Теперь самое главное превращение статьи, и оно бесплатное: в графе выше меняются
  только имена узлов. Никакой новой математики для нейросетей не появляется.
</p>

<table class="shape-table">
  <tr><th>В графе из интерактива 1</th><th>В нейроне</th><th>Что стоит на ребре</th></tr>
  <tr><td>вход <code>u</code></td><td>вход <code>x</code> и параметры <code>w</code>, <code>b</code></td><td>то, по чему берём производную</td></tr>
  <tr><td>промежуточный узел <code>r</code></td><td>сумматор <code>z = wx + b</code></td><td><code>∂z/∂w = x</code></td></tr>
  <tr><td>ещё один узел</td><td>активация <code>a = σ(z)</code></td><td><code>∂a/∂z = a(1 − a)</code></td></tr>
  <tr><td>вершина <code>s</code></td><td>ошибка <code>E = (a − y)²</code></td><td><code>∂E/∂a = 2(a − y)</code></td></tr>
</table>

<p>
  Возьмём один нейрон с одним входом: <code>x = 0.5</code>, вес
  <code>w = 0.4</code>, смещение <code>b = 0.1</code>, правильный ответ
  <code>y = 1</code>. Вопрос, на который отвечает бэкпроп, звучит так: <strong>на
  сколько изменится ошибка, если чуть-чуть подвинуть вес?</strong>
</p>

<div class="stage" id="stageNeuron" tabindex="0">
  <div class="stage-figure">
<svg id="nc" viewBox="0 0 960 700" role="img" aria-label="Нейрон как цепочка узлов: вход, сумматор, активация, ошибка, и производная по весу вдоль цепочки">
  <style>
    #nc { font-family: Helvetica, Arial, sans-serif; }
    #nc .cap { font-size: 14px; fill: #5E5850; }
    #nc .nd { fill: #FFFFFF; stroke: #3576C0; stroke-width: 2; }
    #nc .np { fill: #FFFBEB; stroke: #C29E08; stroke-width: 2; }
    #nc .ne { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 2; }
    #nc .nl { font-size: 17px; fill: #111111; }
    #nc .ns { font-size: 15px; fill: #111111; }
    #nc .nv { font-size: 15px; fill: #3576C0; font-weight: 700; }
    #nc .ed { stroke: #9FBEE0; stroke-width: 2.4; fill: none; }
    #nc .dl { font-size: 13px; fill: #C30B0A; }
    #nc .card { fill: #FFFFFF; stroke: #E0DACE; stroke-width: 1.5; }
    #nc .ct { font-size: 13px; fill: #5E5850; }
    #nc .note { font-size: 14px; }
    #nc .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="nc-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9FBEE0"/>
    </marker>
  </defs>

  <text x="40" y="32" class="cap">Один нейрон, разложенный на элементарные узлы</text>

  <g data-key="ex">
    <foreignObject x="40" y="44" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="z = wx + b,\quad a = \sigma(z),\quad E = (a-y)^{2}"></div>
    </foreignObject>
  </g>

  <g data-key="gr">
    <line x1="170" y1="456" x2="285" y2="406" class="ed" marker-end="url(#nc-arw)"/>
    <line x1="330" y1="456" x2="330" y2="406" class="ed" marker-end="url(#nc-arw)"/>
    <line x1="490" y1="456" x2="375" y2="406" class="ed" marker-end="url(#nc-arw)"/>
    <line x1="330" y1="344" x2="330" y2="294" class="ed" marker-end="url(#nc-arw)"/>
    <line x1="330" y1="232" x2="330" y2="182" class="ed" marker-end="url(#nc-arw)"/>
    <line x1="470" y1="149" x2="449" y2="149" class="ed" marker-end="url(#nc-arw)"/>
    <rect x="110" y="456" width="120" height="58" rx="12" class="nd"/>
    <rect x="270" y="456" width="120" height="58" rx="12" class="np"/>
    <rect x="430" y="456" width="120" height="58" rx="12" class="np"/>
    <rect x="215" y="344" width="230" height="58" rx="12" class="nd"/>
    <rect x="215" y="232" width="230" height="58" rx="12" class="nd"/>
    <rect x="215" y="120" width="230" height="58" rx="12" class="ne"/>
    <rect x="470" y="120" width="120" height="58" rx="12" class="nd"/>
    <text x="170" y="481" class="ns" text-anchor="middle">вход x</text>
    <text x="330" y="481" class="ns" text-anchor="middle">вес w</text>
    <text x="490" y="481" class="ns" text-anchor="middle">смещение b</text>
    <text x="330" y="369" class="nl" text-anchor="middle">z = wx + b</text>
    <text x="330" y="257" class="nl" text-anchor="middle">a = σ(z)</text>
    <text x="330" y="145" class="nl" text-anchor="middle">E = (a − y)²</text>
    <text x="530" y="145" class="ns" text-anchor="middle">цель y</text>
  </g>

  <g data-key="vl" data-only="1">
    <text x="170" y="503" class="nv" text-anchor="middle">0.5</text>
    <text x="330" y="503" class="nv" text-anchor="middle">0.4</text>
    <text x="490" y="503" class="nv" text-anchor="middle">0.1</text>
    <text x="330" y="391" class="nv" text-anchor="middle">z = 0.3</text>
    <text x="330" y="279" class="nv" text-anchor="middle">a = 0.5744</text>
    <text x="330" y="167" class="nv" text-anchor="middle">E = 0.1811</text>
    <text x="530" y="167" class="nv" text-anchor="middle">1</text>
  </g>

  <g data-key="d1" data-only="1">
    <text x="352" y="206" class="dl" text-anchor="start">∂E/∂a = 2(a − y) = −0.8511</text>
  </g>

  <g data-key="d2" data-only="1">
    <text x="352" y="318" class="dl" text-anchor="start">∂a/∂z = a(1 − a) = 0.2445</text>
  </g>

  <g data-key="dp" data-only="1">
    <text x="170" y="534" class="dl" text-anchor="middle">∂z/∂x = w = 0.4</text>
    <text x="330" y="534" class="dl" text-anchor="middle">∂z/∂w = x = 0.5</text>
    <text x="490" y="534" class="dl" text-anchor="middle">∂z/∂b = 1</text>
  </g>

  <g data-key="dl" data-only="1">
    <rect x="610" y="224" width="330" height="86" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
    <text x="626" y="248" class="ct">Сигнал ошибки на сумматоре</text>
    <foreignObject x="622" y="254" width="306" height="46">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta = \frac{\partial E}{\partial z} = -0.8511 \cdot 0.2445 = -0.2081"></div>
    </foreignObject>
  </g>

  <g data-key="cg" data-only="1">
    <rect x="610" y="326" width="330" height="104" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/>
    <text x="626" y="350" class="ct">Градиенты параметров</text>
    <foreignObject x="622" y="356" width="306" height="34">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\partial E/\partial w = \delta\,x = -0.1040"></div>
    </foreignObject>
    <foreignObject x="622" y="390" width="306" height="34">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\partial E/\partial b = \delta = -0.2081"></div>
    </foreignObject>
  </g>

  <g data-key="ck" data-only="1">
    <rect x="610" y="446" width="330" height="80" rx="12" class="card"/>
    <text x="626" y="470" class="ct">Проверка конечной разностью</text>
    <foreignObject x="622" y="476" width="306" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{E(w+h)-E(w-h)}{2h} = -0.1040"></div>
    </foreignObject>
  </g>

  <g data-key="nb" data-only="1">
    <rect x="40" y="590" width="880" height="48" rx="9" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
    <text x="480" y="619" class="note" text-anchor="middle" fill="#A30908">a(1 − a) никогда не больше 0.25 — каждый слой умножает проходящий градиент на маленькое число</text>
  </g>

  <text x="40" y="672" class="legend">синий — данные и значения · жёлтый — параметры · красный — ошибка, производные, сигнал δ</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="ex gr" data-focus="gr">
      <div class="step-kicker">Шаг 1 · та же сборка снизу вверх</div>
      <h4>Нейрон — это цепочка из трёх операций</h4>
      <p>Внизу вход и параметры, над ними сумматор <code>z</code>, над ним
      нелинейность <code>a</code>, наверху ошибка <code>E</code>, которая
      сравнивает предсказание с целью <code>y</code>.</p>
      <p>Это тот же граф, что и в первом интерактиве, только с длинной вертикальной
      цепочкой вместо развилки. Разветвление вернётся, когда нейронов станет
      несколько.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl" data-focus="vl">
      <div class="step-kicker">Шаг 2 · прямой проход</div>
      <h4>Считаем снизу вверх и сохраняем каждое значение</h4>
      <p><code>z = 0.4 · 0.5 + 0.1 = 0.3</code>, затем
      <code>a = σ(0.3) = 0.5744</code>, затем
      <code>E = (0.5744 − 1)² = 0.1811</code>.</p>
      <p>Нейрон ошибается: предсказал 0.57 вместо 1. Задача обратного прохода —
      выяснить, в какую сторону крутить <code>w</code> и <code>b</code>, чтобы
      0.1811 стало меньше.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl d1" data-focus="d1">
      <div class="step-kicker">Шаг 3 · верхнее звено</div>
      <h4>Насколько ошибка чувствительна к предсказанию</h4>
      <p><code>E = (a − y)²</code>, поэтому <code>∂E/∂a = 2(a − y) = −0.8511</code>.
      Знак минус читается буквально: <em>увеличение</em> предсказания
      <em>уменьшает</em> ошибку, потому что мы пока недотягиваем до цели.</p>
      <p>Обратный проход всегда начинается отсюда — с производной ошибки по своему
      единственному входу.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl d1 d2" data-focus="d2">
      <div class="step-kicker">Шаг 4 · второе звено</div>
      <h4>Производная сигмоиды выражается через уже посчитанное значение</h4>
      <p>Для сигмоиды <code>∂a/∂z = a(1 − a)</code>. Считать заново ничего не надо:
      <code>a = 0.5744</code> уже лежит в памяти с прямого прохода, поэтому
      <code>0.5744 · 0.4256 = 0.2445</code>.</p>
      <p>Вот и ответ на вопрос, зачем фреймворки хранят активации: без них обратный
      проход пришлось бы начинать с повторного прямого.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl d1 d2 dl" data-focus="dl">
      <div class="step-kicker">Шаг 5 · свёртка двух звеньев</div>
      <h4>Перемножаем верхние два ребра и даём результату имя</h4>
      <p><code>δ = ∂E/∂z = (−0.8511) · 0.2445 = −0.2081</code>. Это цепное правило
      в чистом виде: два коэффициента передачи подряд.</p>
      <p>Величину <code>δ</code> называют сигналом ошибки на сумматоре. Она
      понадобится и для веса, и для смещения, и для входа — поэтому её считают
      один раз и переиспользуют.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl d1 d2 dl dp" data-focus="dp">
      <div class="step-kicker">Шаг 6 · нижние рёбра</div>
      <h4>Производные сумматора тривиальны</h4>
      <p><code>z = wx + b</code> — линейная функция, поэтому <code>∂z/∂w = x</code>,
      <code>∂z/∂b = 1</code>, <code>∂z/∂x = w</code>. Всё, что нужно, уже есть
      на схеме.</p>
      <p>Заметьте асимметрию: производная по весу равна входу, а производная по
      входу равна весу. Из неё потом вырастет транспонирование матрицы.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl d1 d2 dl dp cg" data-focus="cg">
      <div class="step-kicker">Шаг 7 · градиенты</div>
      <h4>Градиент параметра = сигнал ошибки × то, что пришло по ребру</h4>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · один нейрон, x = 0.5, w = 0.4, b = 0.1, y = 1</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Цепочка целиком</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">по весу</div>
            <div class="math-display worked-trace-math" data-tex="\frac{\partial E}{\partial w} = (-0.8511)\cdot 0.2445 \cdot 0.5 = -0.1040"></div>
            <div class="worked-trace-note">три ребра пути E → a → z → w, перемноженные подряд</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">по смещению</div>
            <div class="math-display worked-trace-math" data-tex="\frac{\partial E}{\partial b} = \delta \cdot 1 = -0.2081"></div>
            <div class="worked-trace-note">последнее ребро равно единице, поэтому градиент совпадает с δ</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">по входу</div>
            <div class="math-display worked-trace-math" data-tex="\frac{\partial E}{\partial x} = \delta \cdot w = -0.0832"></div>
            <div class="worked-trace-note">то же число поедет дальше вниз, в предыдущий слой</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> градиент по
        весу отрицательный, значит увеличение <code>w</code> уменьшает ошибку —
        шаг спуска подвинет вес вверх. И он в два раза меньше градиента по
        смещению ровно потому, что вход <code>x = 0.5</code>: чем слабее сигнал
        на ребре, тем меньше вина этого веса в итоговой ошибке.</p>
      </div>
    </div>
    <div class="step-panel" data-on="ex gr vl d1 d2 dl dp cg ck nb" data-focus="ck nb">
      <div class="step-kicker">Шаг 8 · проверка и следствие</div>
      <h4>Сверяем с численной производной и смотрим на множитель 0.2445</h4>
      <p>Подвинем <code>w</code> на <code>h = 10⁻⁶</code> в обе стороны и поделим
      разность ошибок на <code>2h</code>: получается те же −0.1040. Это стандартный
      способ поймать ошибку в выкладке — если аналитический и численный градиенты
      разошлись, ошибка в аналитическом.</p>
      <p>А множитель <code>a(1 − a) = 0.2445</code> — первое неприятное известие:
      он не бывает больше 0.25. В цепочке из десяти сигмоидных слоёв градиент
      умножится на такое число десять раз и придёт к первому слою почти нулевым.
      Это и есть затухание градиента, и видно его прямо на схеме.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Сложите вместе два интерактива — и получится полный алгоритм. В сети от каждого
  веса до ошибки ведёт свой путь; вдоль пути производные перемножаются, а если
  путей несколько (а так будет у любого веса, кроме последнего слоя), их вклады
  складываются. Оставшиеся части статьи — это аккуратная бухгалтерия: как обойти
  все пути, ничего не пересчитывая дважды, и как записать результат матрицами.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> производная читается как маршрут по графу —
  перемножить локальные производные вдоль пути и сложить результаты по всем путям.
  Локальные производные при этом всегда простые и считаются через значения,
  сохранённые на прямом проходе; вся сложность живёт не в математике, а в
  структуре графа.
</div>

<p class="tiny">
  Все числа в части посчитаны скриптом и округлены до четырёх знаков после
  запятой. Аналитические градиенты нейрона сверены с численными (центральная
  разность, <code>h = 10⁻⁶</code>): расхождение меньше 10⁻⁸.
</p>

---

## Часть 2. Сеть как карта: прямой проход

<p>
  Обычно нейрон рисуют одним кружком: пришли числа — вышло число. Для прямого
  прохода это удобно, для вывода градиентов — нет. Внутри кружка спрятаны две
  разные операции с разными производными, поэтому мы разрезаем каждый нейрон
  надвое: <strong>сумматор</strong> <code>z</code> складывает взвешенные входы и
  смещение, <strong>активация</strong> <code>a</code> применяет нелинейность.
</p>

<div class="math-display" data-tex="z^{(\ell)} = W^{(\ell)} a^{(\ell-1)} + b^{(\ell)}, \qquad a^{(\ell)} = \sigma\!\left(z^{(\ell)}\right), \qquad a^{(0)} = x^{(0)}"></div>

### Нотация

<p>
  Верхний индекс в скобках — номер слоя, нижний — номер узла. У весов нижних
  индексов два: <code>w⁽²⁾₂₁</code> ведёт из узла 1 предыдущего слоя в узел 2
  текущего. Порядок выбран не случайно — при такой записи строки матрицы
  <code>W</code> совпадают со строками схемы, а индексы читаются как обычная
  адресация «строка, столбец».
</p>

<table class="shape-table">
  <tr><th>Обозначение</th><th>Что это</th><th>Форма</th><th>В примере</th></tr>
  <tr><td><code>x⁽⁰⁾</code></td><td>вход</td><td>2</td><td>(0.5, 0.8)</td></tr>
  <tr><td><code>W⁽¹⁾, W⁽²⁾</code></td><td>веса слоёв</td><td>2×2</td><td>задаём сами</td></tr>
  <tr><td><code>b⁽¹⁾, b⁽²⁾</code></td><td>смещения</td><td>2</td><td>задаём сами</td></tr>
  <tr><td><code>z⁽ˡ⁾</code></td><td>сумматор до активации</td><td>2</td><td>считается</td></tr>
  <tr><td><code>a⁽ˡ⁾</code></td><td>активация</td><td>2</td><td>считается</td></tr>
  <tr><td><code>y</code></td><td>цель</td><td>2</td><td>(1, 0)</td></tr>
  <tr><td><code>E</code></td><td>суммарная ошибка</td><td>число</td><td>0.3183</td></tr>
</table>

### Интерактив 2 · прямой проход в переменных

<div class="stage" id="stageFw" tabindex="0">
  <div class="stage-figure">
<svg id="fw" viewBox="0 0 1240 650" role="img" aria-label="Прямой проход: формула каждого слоя стоит над своей колонкой">
  <style>
    #fw { font-family: Helvetica, Arial, sans-serif; }
    #fw .edge { stroke: #B9B4A9; stroke-width: 1.6; fill: none; }
    #fw .bedge { stroke: #D3CFC5; stroke-width: 1.3; fill: none; stroke-dasharray: 4 4; }
    #fw .nd { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.6; }
    #fw .nl { font-size: 16px; fill: #111111; }
    #fw .wl { font-size: 13px; fill: #5E5850; }
    #fw .cap { font-size: 13px; fill: #8A8378; }
    #fw .he { stroke-width: 4.5; fill: none; stroke-linecap: round; }
    #fw .hr { fill: none; stroke-width: 3.5; }
    #fw .vbg { fill: #FFFFFF; stroke: none; }
    #fw .val { font-size: 13px; }
    #fw .note { font-size: 14px; }
    #fw .topo { stroke: #D3CFC5; stroke-width: 1.4; fill: none; }
    #fw .topl { font-size: 13px; fill: #8A8378; }
    #fw .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <g data-key="D1" data-only="1">
    <foreignObject x="20" y="8" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="x^{(0)} = \left(x^{(0)}_1,\; x^{(0)}_2\right)^{\!\top}"></div>
    </foreignObject>
  </g>
  <g data-key="D2" data-only="1">
    <foreignObject x="20" y="44" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="y = \left(y_1,\; y_2\right)^{\!\top}"></div>
    </foreignObject>
  </g>
  <g data-key="A1" data-only="1">
    <foreignObject x="300" y="8" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="z^{(1)} = W^{(1)} x^{(0)} + b^{(1)}"></div>
    </foreignObject>
  </g>
  <g data-key="A2" data-only="1">
    <foreignObject x="300" y="44" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="a^{(1)} = \sigma\!\left(z^{(1)}\right)"></div>
    </foreignObject>
  </g>
  <g data-key="B1" data-only="1">
    <foreignObject x="680" y="8" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="z^{(2)} = W^{(2)} a^{(1)} + b^{(2)}"></div>
    </foreignObject>
  </g>
  <g data-key="B2" data-only="1">
    <foreignObject x="680" y="44" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="a^{(2)} = \sigma\!\left(z^{(2)}\right)"></div>
    </foreignObject>
  </g>
  <g data-key="C1" data-only="1">
    <foreignObject x="920" y="8" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="e^{(3)}_i = \tfrac{1}{2}\left(a^{(2)}_i - y_i\right)^{2}"></div>
    </foreignObject>
  </g>
  <g data-key="C2" data-only="1">
    <foreignObject x="920" y="44" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="E = e^{(3)}_1 + e^{(3)}_2"></div>
    </foreignObject>
  </g>
  <line x1="120" y1="180" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="180" x2="340" y2="370" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="370" class="edge"/>
  <line x1="340" y1="180" x2="460" y2="180" class="edge"/>
  <line x1="340" y1="370" x2="460" y2="370" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="370" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="370" class="edge"/>
  <line x1="770" y1="180" x2="890" y2="180" class="edge"/>
  <line x1="770" y1="370" x2="890" y2="370" class="edge"/>
  <line x1="890" y1="180" x2="1050" y2="180" class="edge"/>
  <line x1="890" y1="370" x2="1050" y2="370" class="edge"/>
  <line x1="1050" y1="180" x2="1170" y2="275" class="edge"/>
  <line x1="1050" y1="370" x2="1170" y2="275" class="edge"/>
  <line x1="390" y1="470" x2="340" y2="180" class="bedge"/>
  <line x1="390" y1="470" x2="340" y2="370" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="180" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="370" class="bedge"/>
  <g data-key="ew1" data-only="1">
    <line x1="120" y1="180" x2="340" y2="180" class="he" stroke="#73B222"/>
    <line x1="120" y1="180" x2="340" y2="370" class="he" stroke="#73B222"/>
    <line x1="120" y1="370" x2="340" y2="180" class="he" stroke="#73B222"/>
    <line x1="120" y1="370" x2="340" y2="370" class="he" stroke="#73B222"/>
    <line x1="390" y1="470" x2="340" y2="180" class="he" stroke="#73B222"/>
    <line x1="390" y1="470" x2="340" y2="370" class="he" stroke="#73B222"/>
  </g>
  <g data-key="nz1" data-only="1">
    <line x1="340" y1="180" x2="460" y2="180" class="he" stroke="#73B222"/>
    <line x1="340" y1="370" x2="460" y2="370" class="he" stroke="#73B222"/>
  </g>
  <g data-key="ew2" data-only="1">
    <line x1="460" y1="180" x2="770" y2="180" class="he" stroke="#73B222"/>
    <line x1="460" y1="180" x2="770" y2="370" class="he" stroke="#73B222"/>
    <line x1="460" y1="370" x2="770" y2="180" class="he" stroke="#73B222"/>
    <line x1="460" y1="370" x2="770" y2="370" class="he" stroke="#73B222"/>
    <line x1="820" y1="470" x2="770" y2="180" class="he" stroke="#73B222"/>
    <line x1="820" y1="470" x2="770" y2="370" class="he" stroke="#73B222"/>
  </g>
  <g data-key="nz2" data-only="1">
    <line x1="770" y1="180" x2="890" y2="180" class="he" stroke="#73B222"/>
    <line x1="770" y1="370" x2="890" y2="370" class="he" stroke="#73B222"/>
  </g>
  <g data-key="ner" data-only="1">
    <line x1="890" y1="180" x2="1050" y2="180" class="he" stroke="#73B222"/>
    <line x1="890" y1="370" x2="1050" y2="370" class="he" stroke="#73B222"/>
    <line x1="1050" y1="180" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="1050" y1="370" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
  </g>
  <circle cx="120" cy="180" r="27" class="nd"/>
  <text x="120" y="186" class="nl" text-anchor="middle">x₁⁽⁰⁾</text>
  <circle cx="120" cy="370" r="27" class="nd"/>
  <text x="120" y="376" class="nl" text-anchor="middle">x₂⁽⁰⁾</text>
  <circle cx="340" cy="180" r="27" class="nd"/>
  <text x="340" y="186" class="nl" text-anchor="middle">z₁⁽¹⁾</text>
  <circle cx="340" cy="370" r="27" class="nd"/>
  <text x="340" y="376" class="nl" text-anchor="middle">z₂⁽¹⁾</text>
  <circle cx="460" cy="180" r="27" class="nd"/>
  <text x="460" y="186" class="nl" text-anchor="middle">a₁⁽¹⁾</text>
  <circle cx="460" cy="370" r="27" class="nd"/>
  <text x="460" y="376" class="nl" text-anchor="middle">a₂⁽¹⁾</text>
  <circle cx="770" cy="180" r="27" class="nd"/>
  <text x="770" y="186" class="nl" text-anchor="middle">z₁⁽²⁾</text>
  <circle cx="770" cy="370" r="27" class="nd"/>
  <text x="770" y="376" class="nl" text-anchor="middle">z₂⁽²⁾</text>
  <circle cx="890" cy="180" r="27" class="nd"/>
  <text x="890" y="186" class="nl" text-anchor="middle">a₁⁽²⁾</text>
  <circle cx="890" cy="370" r="27" class="nd"/>
  <text x="890" y="376" class="nl" text-anchor="middle">a₂⁽²⁾</text>
  <circle cx="1050" cy="180" r="27" class="nd"/>
  <text x="1050" y="186" class="nl" text-anchor="middle">e₁⁽³⁾</text>
  <circle cx="1050" cy="370" r="27" class="nd"/>
  <text x="1050" y="376" class="nl" text-anchor="middle">e₂⁽³⁾</text>
  <circle cx="1170" cy="275" r="27" class="nd"/>
  <text x="1170" y="281" class="nl" text-anchor="middle">E</text>
  <circle cx="390" cy="470" r="22" class="nd"/>
  <text x="390" y="476" class="nl" text-anchor="middle">b⁽¹⁾</text>
  <circle cx="820" cy="470" r="22" class="nd"/>
  <text x="820" y="476" class="nl" text-anchor="middle">b⁽²⁾</text>
  <g data-key="nin" data-only="1">
    <circle cx="120" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="120" cy="370" r="27" class="hr" stroke="#73B222"/>
  </g>
  <g data-key="nz1" data-only="1">
    <circle cx="340" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="340" cy="370" r="27" class="hr" stroke="#73B222"/>
  </g>
  <g data-key="na1" data-only="1">
    <circle cx="460" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="460" cy="370" r="27" class="hr" stroke="#73B222"/>
  </g>
  <g data-key="nz2" data-only="1">
    <circle cx="770" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="770" cy="370" r="27" class="hr" stroke="#73B222"/>
  </g>
  <g data-key="na2" data-only="1">
    <circle cx="890" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="890" cy="370" r="27" class="hr" stroke="#73B222"/>
  </g>
  <g data-key="ner" data-only="1">
    <circle cx="1050" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="1050" cy="370" r="27" class="hr" stroke="#73B222"/>
    <circle cx="1170" cy="275" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="cch" data-only="1">
    <rect x="20" y="560" width="1200" height="34" rx="9" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
    <text x="620" y="583" class="note" text-anchor="middle" fill="#5A8C1C">Все эти значения остаются в памяти — обратный проход берёт их готовыми</text>
  </g>
  <text x="230" y="168" class="wl" text-anchor="middle">w₁₁⁽¹⁾</text>
  <text x="230" y="392" class="wl" text-anchor="middle">w₂₂⁽¹⁾</text>
  <text x="180" y="228" class="wl" text-anchor="middle">w₂₁⁽¹⁾</text>
  <text x="180" y="330" class="wl" text-anchor="middle">w₁₂⁽¹⁾</text>
  <text x="615" y="168" class="wl" text-anchor="middle">w₁₁⁽²⁾</text>
  <text x="615" y="392" class="wl" text-anchor="middle">w₂₂⁽²⁾</text>
  <text x="535" y="221" class="wl" text-anchor="middle">w₂₁⁽²⁾</text>
  <text x="535" y="337" class="wl" text-anchor="middle">w₁₂⁽²⁾</text>
  <text x="120" y="130" class="cap" text-anchor="middle">вход</text>
  <text x="340" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="460" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="770" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="890" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="1050" y="130" class="cap" text-anchor="middle">ошибка</text>
  <text x="1170" y="130" class="cap" text-anchor="middle">итог</text>
  <path d="M 20 510 L 20 516 L 290 516 L 290 510" class="topo"/>
  <text x="155" y="538" class="topl" text-anchor="middle">вход: 2 числа</text>
  <path d="M 300 510 L 300 516 L 660 516 L 660 510" class="topo"/>
  <text x="480" y="538" class="topl" text-anchor="middle">слой 1: 2 → 2 · W⁽¹⁾ 2×2, b⁽¹⁾ 2</text>
  <path d="M 680 510 L 680 516 L 910 516 L 910 510" class="topo"/>
  <text x="795" y="538" class="topl" text-anchor="middle">слой 2: 2 → 2 · W⁽²⁾ 2×2, b⁽²⁾ 2</text>
  <path d="M 920 510 L 920 516 L 1240 516 L 1240 510" class="topo"/>
  <text x="1080" y="538" class="topl" text-anchor="middle">потеря: MSE по двум выходам</text>
  <text x="20" y="628" class="legend">зелёный — прямой проход, данные текут вперёд · красный — узел ошибки, отсюда начнётся обратный проход</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="D1 D2 nin" data-focus="nin">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Один пример и одна цель</h4>
      <p>На вход подаём два числа, целью объявляем пару <code>y</code>. Всё, что мы
      считаем дальше, относится к этому единственному примеру: в настоящем обучении
      градиенты усредняются по батчу, но формулы от этого не меняются.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 nin ew1" data-focus="ew1">
      <div class="step-kicker">Шаг 2 · параметры слоя</div>
      <h4>Рёбра — веса, узел снизу — смещение</h4>
      <p>Матрица <code>W⁽¹⁾</code> — это ровно четыре подсвеченных ребра, а
      <code>b⁽¹⁾</code> — два ребра от нижнего узла. Под схемой подписано, что у
      этого слоя параметров: матрица 2×2 и вектор длины 2. Удобно считать, что по
      ребру смещения всегда приходит единица: в части 3 это сразу даст формулу
      для <code>∂E/∂b</code>.</p>
      <div class="math-display" data-tex="W^{(1)} = \begin{pmatrix} w^{(1)}_{11} &amp; w^{(1)}_{12} \\ w^{(1)}_{21} &amp; w^{(1)}_{22} \end{pmatrix}, \qquad b^{(1)} = \begin{pmatrix} b^{(1)}_1 \\ b^{(1)}_2 \end{pmatrix}"></div>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 nin ew1 nz1" data-focus="nz1">
      <div class="step-kicker">Шаг 3 · сумматор</div>
      <h4>Единственное место, где веса участвуют в вычислении</h4>
      <p>Над этой колонкой стоит компактная форма. Вот она же, раскрытая по клеткам —
      обратите внимание, что <em>строка</em> матрицы отвечает одному узлу
      следующего слоя, а <em>столбец</em> — одному входу.</p>
      <div class="math-display" data-tex="\begin{pmatrix} z^{(1)}_1 \\ z^{(1)}_2 \end{pmatrix} = \begin{pmatrix} w^{(1)}_{11} &amp; w^{(1)}_{12} \\ w^{(1)}_{21} &amp; w^{(1)}_{22} \end{pmatrix}\begin{pmatrix} x^{(0)}_1 \\ x^{(0)}_2 \end{pmatrix} + \begin{pmatrix} b^{(1)}_1 \\ b^{(1)}_2 \end{pmatrix}"></div>
      <p>Всё, что мы позже узнаем про производную по весу, рождается именно здесь:
      это единственная строка алгоритма, куда <code>W</code> вообще входит.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 nin ew1 nz1 na1" data-focus="na1">
      <div class="step-kicker">Шаг 4 · активация</div>
      <h4>Нелинейность применяется покомпонентно</h4>
      <div class="math-display" data-tex="\begin{pmatrix} a^{(1)}_1 \\ a^{(1)}_2 \end{pmatrix} = \begin{pmatrix} \sigma\!\left(z^{(1)}_1\right) \\ \sigma\!\left(z^{(1)}_2\right) \end{pmatrix}, \qquad \sigma(s) = \frac{1}{1 + e^{-s}}"></div>
      <p>Компоненты не смешиваются — и это важное свойство: на обратном проходе
      производная активации не будет их смешивать тоже, поэтому вместо матрицы
      хватит поэлементного умножения.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 nin ew1 nz1 na1 ew2 nz2" data-focus="ew2">
      <div class="step-kicker">Шаг 5 · второй слой</div>
      <h4>Тот же приём ещё раз</h4>
      <div class="math-display" data-tex="\begin{pmatrix} z^{(2)}_1 \\ z^{(2)}_2 \end{pmatrix} = \begin{pmatrix} w^{(2)}_{11} &amp; w^{(2)}_{12} \\ w^{(2)}_{21} &amp; w^{(2)}_{22} \end{pmatrix}\begin{pmatrix} a^{(1)}_1 \\ a^{(1)}_2 \end{pmatrix} + \begin{pmatrix} b^{(2)}_1 \\ b^{(2)}_2 \end{pmatrix}"></div>
      <p>Второй слой не знает, что перед ним был первый: он видит просто вектор
      входов. Эта повторяемость — причина, по которой в конце получится одна
      формула на любой слой, а не отдельная на каждый.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 nin ew1 nz1 na1 ew2 nz2 na2" data-focus="na2">
      <div class="step-kicker">Шаг 6 · выход</div>
      <h4>Активации второго слоя — это и есть ответ сети</h4>
      <p>Два числа от 0 до 1. Обратите внимание, что накопленные сверху формулы
      теперь читаются слева направо как сама схема: вход, слой 1, слой 2, ошибка.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 C1 C2 na2 ner" data-focus="ner">
      <div class="step-kicker">Шаг 7 · ошибка</div>
      <h4>Два частных промаха и один общий счёт</h4>
      <div class="math-display" data-tex="E = \tfrac{1}{2}\left(a^{(2)}_1 - y_1\right)^{2} + \tfrac{1}{2}\left(a^{(2)}_2 - y_2\right)^{2}"></div>
      <p>Из того, что <code>E</code> — именно сумма, следует важная мелочь:
      производная <code>E</code> по любому отдельному <code>e</code> равна единице,
      поэтому первый шаг назад ничего не добавит в произведение.</p>
      <p>Узел <code>E</code> обведён красным: с него начнётся обратный проход.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 C1 C2 nin nz1 na1 nz2 na2 ner cch" data-focus="cch">
      <div class="step-kicker">Шаг 8 · зачем это запоминать</div>
      <h4>Прямой проход оставляет после себя кэш</h4>
      <p>Формулы обратного прохода состоят почти целиком из этих величин. Если бы
      они не хранились, каждый градиент требовал бы отдельного пересчёта сети.
      Отсюда же плата за бэкпроп — память: она растёт с глубиной и размером батча,
      а не с числом параметров.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 3 · тот же проход в числах

<p>
  Шаги и подсветка совпадают один в один с предыдущей сценой — меняются только
  формулы наверху и подписи под узлами. Можно листать обе сцены параллельно.
</p>

<div class="stage" id="stageFwn" tabindex="0">
  <div class="stage-figure">
<svg id="fwn" viewBox="0 0 1240 650" role="img" aria-label="Прямой проход в числах: значение каждого слоя над своей колонкой">
  <style>
    #fwn { font-family: Helvetica, Arial, sans-serif; }
    #fwn .edge { stroke: #B9B4A9; stroke-width: 1.6; fill: none; }
    #fwn .bedge { stroke: #D3CFC5; stroke-width: 1.3; fill: none; stroke-dasharray: 4 4; }
    #fwn .nd { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.6; }
    #fwn .nl { font-size: 16px; fill: #111111; }
    #fwn .wl { font-size: 13px; fill: #5E5850; }
    #fwn .cap { font-size: 13px; fill: #8A8378; }
    #fwn .he { stroke-width: 4.5; fill: none; stroke-linecap: round; }
    #fwn .hr { fill: none; stroke-width: 3.5; }
    #fwn .vbg { fill: #FFFFFF; stroke: none; }
    #fwn .val { font-size: 13px; }
    #fwn .note { font-size: 14px; }
    #fwn .topo { stroke: #D3CFC5; stroke-width: 1.4; fill: none; }
    #fwn .topl { font-size: 13px; fill: #8A8378; }
    #fwn .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <g data-key="D1" data-only="1">
    <foreignObject x="20" y="8" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="x^{(0)} = \left(0.5,\; 0.8\right)^{\!\top}"></div>
    </foreignObject>
  </g>
  <g data-key="D2" data-only="1">
    <foreignObject x="20" y="44" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="y = \left(1,\; 0\right)^{\!\top}"></div>
    </foreignObject>
  </g>
  <g data-key="A1" data-only="1">
    <foreignObject x="300" y="8" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="z^{(1)} = \left(0.0150,\; 0.3400\right)^{\!\top}"></div>
    </foreignObject>
  </g>
  <g data-key="A2" data-only="1">
    <foreignObject x="300" y="44" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="a^{(1)} = \left(0.5037,\; 0.5842\right)^{\!\top}"></div>
    </foreignObject>
  </g>
  <g data-key="B1" data-only="1">
    <foreignObject x="680" y="8" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="z^{(2)} = \left(0.1266,\; 0.6013\right)^{\!\top}"></div>
    </foreignObject>
  </g>
  <g data-key="B2" data-only="1">
    <foreignObject x="680" y="44" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="a^{(2)} = \left(0.5316,\; 0.6459\right)^{\!\top}"></div>
    </foreignObject>
  </g>
  <g data-key="C1" data-only="1">
    <foreignObject x="920" y="8" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="e^{(3)} = \left(0.1097,\; 0.2086\right)^{\!\top}"></div>
    </foreignObject>
  </g>
  <g data-key="C2" data-only="1">
    <foreignObject x="920" y="44" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="E = 0.3183"></div>
    </foreignObject>
  </g>
  <line x1="120" y1="180" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="180" x2="340" y2="370" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="370" class="edge"/>
  <line x1="340" y1="180" x2="460" y2="180" class="edge"/>
  <line x1="340" y1="370" x2="460" y2="370" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="370" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="370" class="edge"/>
  <line x1="770" y1="180" x2="890" y2="180" class="edge"/>
  <line x1="770" y1="370" x2="890" y2="370" class="edge"/>
  <line x1="890" y1="180" x2="1050" y2="180" class="edge"/>
  <line x1="890" y1="370" x2="1050" y2="370" class="edge"/>
  <line x1="1050" y1="180" x2="1170" y2="275" class="edge"/>
  <line x1="1050" y1="370" x2="1170" y2="275" class="edge"/>
  <line x1="390" y1="470" x2="340" y2="180" class="bedge"/>
  <line x1="390" y1="470" x2="340" y2="370" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="180" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="370" class="bedge"/>
  <g data-key="ew1" data-only="1">
    <line x1="120" y1="180" x2="340" y2="180" class="he" stroke="#73B222"/>
    <line x1="120" y1="180" x2="340" y2="370" class="he" stroke="#73B222"/>
    <line x1="120" y1="370" x2="340" y2="180" class="he" stroke="#73B222"/>
    <line x1="120" y1="370" x2="340" y2="370" class="he" stroke="#73B222"/>
    <line x1="390" y1="470" x2="340" y2="180" class="he" stroke="#73B222"/>
    <line x1="390" y1="470" x2="340" y2="370" class="he" stroke="#73B222"/>
  </g>
  <g data-key="nz1" data-only="1">
    <line x1="340" y1="180" x2="460" y2="180" class="he" stroke="#73B222"/>
    <line x1="340" y1="370" x2="460" y2="370" class="he" stroke="#73B222"/>
  </g>
  <g data-key="ew2" data-only="1">
    <line x1="460" y1="180" x2="770" y2="180" class="he" stroke="#73B222"/>
    <line x1="460" y1="180" x2="770" y2="370" class="he" stroke="#73B222"/>
    <line x1="460" y1="370" x2="770" y2="180" class="he" stroke="#73B222"/>
    <line x1="460" y1="370" x2="770" y2="370" class="he" stroke="#73B222"/>
    <line x1="820" y1="470" x2="770" y2="180" class="he" stroke="#73B222"/>
    <line x1="820" y1="470" x2="770" y2="370" class="he" stroke="#73B222"/>
  </g>
  <g data-key="nz2" data-only="1">
    <line x1="770" y1="180" x2="890" y2="180" class="he" stroke="#73B222"/>
    <line x1="770" y1="370" x2="890" y2="370" class="he" stroke="#73B222"/>
  </g>
  <g data-key="ner" data-only="1">
    <line x1="890" y1="180" x2="1050" y2="180" class="he" stroke="#73B222"/>
    <line x1="890" y1="370" x2="1050" y2="370" class="he" stroke="#73B222"/>
    <line x1="1050" y1="180" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="1050" y1="370" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
  </g>
  <circle cx="120" cy="180" r="27" class="nd"/>
  <text x="120" y="186" class="nl" text-anchor="middle">x₁⁽⁰⁾</text>
  <circle cx="120" cy="370" r="27" class="nd"/>
  <text x="120" y="376" class="nl" text-anchor="middle">x₂⁽⁰⁾</text>
  <circle cx="340" cy="180" r="27" class="nd"/>
  <text x="340" y="186" class="nl" text-anchor="middle">z₁⁽¹⁾</text>
  <circle cx="340" cy="370" r="27" class="nd"/>
  <text x="340" y="376" class="nl" text-anchor="middle">z₂⁽¹⁾</text>
  <circle cx="460" cy="180" r="27" class="nd"/>
  <text x="460" y="186" class="nl" text-anchor="middle">a₁⁽¹⁾</text>
  <circle cx="460" cy="370" r="27" class="nd"/>
  <text x="460" y="376" class="nl" text-anchor="middle">a₂⁽¹⁾</text>
  <circle cx="770" cy="180" r="27" class="nd"/>
  <text x="770" y="186" class="nl" text-anchor="middle">z₁⁽²⁾</text>
  <circle cx="770" cy="370" r="27" class="nd"/>
  <text x="770" y="376" class="nl" text-anchor="middle">z₂⁽²⁾</text>
  <circle cx="890" cy="180" r="27" class="nd"/>
  <text x="890" y="186" class="nl" text-anchor="middle">a₁⁽²⁾</text>
  <circle cx="890" cy="370" r="27" class="nd"/>
  <text x="890" y="376" class="nl" text-anchor="middle">a₂⁽²⁾</text>
  <circle cx="1050" cy="180" r="27" class="nd"/>
  <text x="1050" y="186" class="nl" text-anchor="middle">e₁⁽³⁾</text>
  <circle cx="1050" cy="370" r="27" class="nd"/>
  <text x="1050" y="376" class="nl" text-anchor="middle">e₂⁽³⁾</text>
  <circle cx="1170" cy="275" r="27" class="nd"/>
  <text x="1170" y="281" class="nl" text-anchor="middle">E</text>
  <circle cx="390" cy="470" r="22" class="nd"/>
  <text x="390" y="476" class="nl" text-anchor="middle">b⁽¹⁾</text>
  <circle cx="820" cy="470" r="22" class="nd"/>
  <text x="820" y="476" class="nl" text-anchor="middle">b⁽²⁾</text>
  <g data-key="nin" data-only="1">
    <circle cx="120" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="120" cy="370" r="27" class="hr" stroke="#73B222"/>
    <rect x="94" y="214" width="52" height="20" class="vbg"/>
    <text x="120" y="228" class="val" text-anchor="middle" fill="#73B222">0.5000</text>
    <rect x="94" y="404" width="52" height="20" class="vbg"/>
    <text x="120" y="418" class="val" text-anchor="middle" fill="#73B222">0.8000</text>
  </g>
  <g data-key="nz1" data-only="1">
    <circle cx="340" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="340" cy="370" r="27" class="hr" stroke="#73B222"/>
    <rect x="314" y="214" width="52" height="20" class="vbg"/>
    <text x="340" y="228" class="val" text-anchor="middle" fill="#73B222">0.0150</text>
    <rect x="314" y="404" width="52" height="20" class="vbg"/>
    <text x="340" y="418" class="val" text-anchor="middle" fill="#73B222">0.3400</text>
  </g>
  <g data-key="na1" data-only="1">
    <circle cx="460" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="460" cy="370" r="27" class="hr" stroke="#73B222"/>
    <rect x="434" y="214" width="52" height="20" class="vbg"/>
    <text x="460" y="228" class="val" text-anchor="middle" fill="#73B222">0.5037</text>
    <rect x="434" y="404" width="52" height="20" class="vbg"/>
    <text x="460" y="418" class="val" text-anchor="middle" fill="#73B222">0.5842</text>
  </g>
  <g data-key="nz2" data-only="1">
    <circle cx="770" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="770" cy="370" r="27" class="hr" stroke="#73B222"/>
    <rect x="744" y="214" width="52" height="20" class="vbg"/>
    <text x="770" y="228" class="val" text-anchor="middle" fill="#73B222">0.1266</text>
    <rect x="744" y="404" width="52" height="20" class="vbg"/>
    <text x="770" y="418" class="val" text-anchor="middle" fill="#73B222">0.6013</text>
  </g>
  <g data-key="na2" data-only="1">
    <circle cx="890" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="890" cy="370" r="27" class="hr" stroke="#73B222"/>
    <rect x="864" y="214" width="52" height="20" class="vbg"/>
    <text x="890" y="228" class="val" text-anchor="middle" fill="#73B222">0.5316</text>
    <rect x="864" y="404" width="52" height="20" class="vbg"/>
    <text x="890" y="418" class="val" text-anchor="middle" fill="#73B222">0.6459</text>
  </g>
  <g data-key="ner" data-only="1">
    <circle cx="1050" cy="180" r="27" class="hr" stroke="#73B222"/>
    <circle cx="1050" cy="370" r="27" class="hr" stroke="#73B222"/>
    <rect x="1024" y="214" width="52" height="20" class="vbg"/>
    <text x="1050" y="228" class="val" text-anchor="middle" fill="#73B222">0.1097</text>
    <rect x="1024" y="404" width="52" height="20" class="vbg"/>
    <text x="1050" y="418" class="val" text-anchor="middle" fill="#73B222">0.2086</text>
    <circle cx="1170" cy="275" r="27" class="hr" stroke="#C30B0A"/>
    <rect x="1144" y="309" width="52" height="20" class="vbg"/>
    <text x="1170" y="323" class="val" text-anchor="middle" fill="#C30B0A">0.3183</text>
  </g>
  <g data-key="cch" data-only="1">
    <rect x="20" y="560" width="1200" height="34" rx="9" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
    <text x="620" y="583" class="note" text-anchor="middle" fill="#5A8C1C">Все эти значения остаются в памяти — обратный проход берёт их готовыми</text>
  </g>
  <text x="230" y="168" class="wl" text-anchor="middle">w₁₁⁽¹⁾</text>
  <text x="230" y="392" class="wl" text-anchor="middle">w₂₂⁽¹⁾</text>
  <text x="180" y="228" class="wl" text-anchor="middle">w₂₁⁽¹⁾</text>
  <text x="180" y="330" class="wl" text-anchor="middle">w₁₂⁽¹⁾</text>
  <text x="615" y="168" class="wl" text-anchor="middle">w₁₁⁽²⁾</text>
  <text x="615" y="392" class="wl" text-anchor="middle">w₂₂⁽²⁾</text>
  <text x="535" y="221" class="wl" text-anchor="middle">w₂₁⁽²⁾</text>
  <text x="535" y="337" class="wl" text-anchor="middle">w₁₂⁽²⁾</text>
  <text x="120" y="130" class="cap" text-anchor="middle">вход</text>
  <text x="340" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="460" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="770" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="890" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="1050" y="130" class="cap" text-anchor="middle">ошибка</text>
  <text x="1170" y="130" class="cap" text-anchor="middle">итог</text>
  <path d="M 20 510 L 20 516 L 290 516 L 290 510" class="topo"/>
  <text x="155" y="538" class="topl" text-anchor="middle">вход: 2 числа</text>
  <path d="M 300 510 L 300 516 L 660 516 L 660 510" class="topo"/>
  <text x="480" y="538" class="topl" text-anchor="middle">слой 1: 2 → 2 · W⁽¹⁾ 2×2, b⁽¹⁾ 2</text>
  <path d="M 680 510 L 680 516 L 910 516 L 910 510" class="topo"/>
  <text x="795" y="538" class="topl" text-anchor="middle">слой 2: 2 → 2 · W⁽²⁾ 2×2, b⁽²⁾ 2</text>
  <path d="M 920 510 L 920 516 L 1240 516 L 1240 510" class="topo"/>
  <text x="1080" y="538" class="topl" text-anchor="middle">потеря: MSE по двум выходам</text>
  <text x="20" y="628" class="legend">зелёный — прямой проход, данные текут вперёд · красный — узел ошибки, отсюда начнётся обратный проход</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="D1 D2 nin" data-focus="nin">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>Вход (0.5, 0.8), цель (1, 0)</h4>
      <p>Первый выход должен подняться почти вдвое, второй — упасть до нуля.
      Заранее понятно, что второму придётся двигаться сильнее.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 nin ew1" data-focus="ew1">
      <div class="step-kicker">Шаг 2 · параметры</div>
      <h4>Двенадцать чисел, которые мы будем обучать</h4>
      <div class="math-display" data-tex="W^{(1)} = \begin{pmatrix} 0.15 &amp; -0.20 \\ 0.40 &amp; 0.30 \end{pmatrix}, \quad b^{(1)} = \begin{pmatrix} 0.10 \\ -0.10 \end{pmatrix}, \quad W^{(2)} = \begin{pmatrix} 0.50 &amp; -0.30 \\ 0.20 &amp; 0.60 \end{pmatrix}, \quad b^{(2)} = \begin{pmatrix} 0.05 \\ 0.15 \end{pmatrix}"></div>
      <p>Значения выбраны произвольно — важно лишь то, что они разные по знаку:
      тогда видно, как знаки распространяются назад.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 nin ew1 nz1" data-focus="nz1">
      <div class="step-kicker">Шаг 3 · сумматор</div>
      <h4>Первый узел почти обнулился</h4>
      <div class="math-display" data-tex="\begin{pmatrix} z^{(1)}_1 \\ z^{(1)}_2 \end{pmatrix} = \begin{pmatrix} 0.15 &amp; -0.20 \\ 0.40 &amp; 0.30 \end{pmatrix}\begin{pmatrix} 0.5 \\ 0.8 \end{pmatrix} + \begin{pmatrix} 0.10 \\ -0.10 \end{pmatrix} = \begin{pmatrix} 0.0150 \\ 0.3400 \end{pmatrix}"></div>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Раскрываем строки</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">z₁⁽¹⁾</div>
            <div class="math-display worked-trace-math" data-tex="0.15\cdot 0.5 + (-0.20)\cdot 0.8 + 0.10 = 0.0150"></div>
            <div class="worked-trace-note">входы тянут в разные стороны</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">z₂⁽¹⁾</div>
            <div class="math-display worked-trace-math" data-tex="0.40\cdot 0.5 + 0.30\cdot 0.8 - 0.10 = 0.3400"></div>
            <div class="worked-trace-note">здесь оба складываются в одну сторону</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> у первого узла
        вклады почти погасили друг друга. Это обычная жизнь скрытого узла, и дальше
        мы увидим то же гашение на обратном проходе.</p>
      </div>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 nin ew1 nz1 na1" data-focus="na1">
      <div class="step-kicker">Шаг 4 · активация</div>
      <h4>Почти ноль на входе даёт почти 0.5 на выходе</h4>
      <p>Сигмоида в нуле проходит через середину, поэтому <code>a₁⁽¹⁾</code>
      получилось 0.5037. Заодно это точка, где производная сигмоиды максимальна и
      равна 0.25 — пригодится в части 8.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 nin ew1 nz1 na1 ew2 nz2" data-focus="ew2">
      <div class="step-kicker">Шаг 5 · второй слой</div>
      <h4>Считаем сумматоры выхода</h4>
      <div class="math-display" data-tex="\begin{pmatrix} z^{(2)}_1 \\ z^{(2)}_2 \end{pmatrix} = \begin{pmatrix} 0.50 &amp; -0.30 \\ 0.20 &amp; 0.60 \end{pmatrix}\begin{pmatrix} 0.5037 \\ 0.5842 \end{pmatrix} + \begin{pmatrix} 0.05 \\ 0.15 \end{pmatrix} = \begin{pmatrix} 0.1266 \\ 0.6013 \end{pmatrix}"></div>
      <p>В дело пошли уже посчитанные <code>a⁽¹⁾</code>. Эти же числа через минуту
      появятся в градиентах <code>W⁽²⁾</code> — буквально те же, без пересчёта.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 nin ew1 nz1 na1 ew2 nz2 na2" data-focus="na2">
      <div class="step-kicker">Шаг 6 · ответ сети</div>
      <h4>0.5316 и 0.6459</h4>
      <p>Первый выход недотягивает до цели 1, второй сильно превышает цель 0.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 C1 C2 na2 ner" data-focus="ner">
      <div class="step-kicker">Шаг 7 · ошибка</div>
      <h4>Второй выход виноват вдвое сильнее</h4>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · где мы промахнулись</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Получили</span>
            <div class="math-display worked-math" data-tex="a^{(2)} = (0.5316,\; 0.6459)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Ошибка</span>
            <div class="math-display worked-math" data-tex="E = 0.1097 + 0.2086 = 0.3183"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> вклад второго
        выхода в общую ошибку почти вдвое больше. Ожидаемо, что и градиенты, идущие
        от него, окажутся крупнее — это подтвердится в части 3.</p>
      </div>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 C1 C2 nin nz1 na1 nz2 na2 ner cch" data-focus="cch">
      <div class="step-kicker">Шаг 8 · кэш</div>
      <h4>Тринадцать чисел, из которых соберётся весь обратный проход</h4>
      <p>Наверху добавились производные сигмоиды в точках <code>z</code> — их тоже
      считают на прямом проходе, потому что все нужные значения уже под рукой.
      Дальше мы не будем пересчитывать сеть ни разу.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>


### Интерактив 4 · прямой проход в матричной форме

<p>
  Схема с кружками показывает, кто на кого влияет, но не показывает <em>формы</em>.
  А в коде вы будете иметь дело именно с формами: почти все ошибки начинающих —
  это несовпадение размерностей, а не неверная математика. Поэтому нарисуем те же
  три формулы ещё раз, но теперь каждая матрица будет набором клеток.
</p>

<p>
  Слева стоит всё известное — вход, цель и параметры обоих слоёв. Справа формулы и
  пустые клетки, которые заполняются шаг за шагом. Под каждой матрицей подписана
  её форма: именно за формами и стоит следить.
</p>

<div class="stage" id="stageMfw" tabindex="0">
  <div class="stage-figure">
<svg id="mfw" viewBox="0 0 1240 590" role="img" aria-label="Прямой проход в матричной форме">
  <style>
    #mfw { font-family: Helvetica, Arial, sans-serif; }
    #mfw .title { font-size: 15px; font-weight: 700; fill: #5E5850; }
    #mfw .colhd { font-size: 13px; fill: #8A8378; letter-spacing: 0.06em; }
    #mfw .lab { font-size: 13px; font-weight: 600; }
    #mfw .ct { font-size: 12px; font-weight: 600; }
    #mfw .shape { font-size: 12px; fill: #968F85; }
    #mfw .cell { stroke-width: 1.2; }
    #mfw .empty { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; stroke-dasharray: 3 2; }
    #mfw .qt { font-size: 12px; fill: #C9C2B8; }
    #mfw .div { stroke: #E5E1D8; stroke-width: 1.4; }
    #mfw .note { font-size: 14px; }
    #mfw .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <text x="40" y="34" class="title">Прямой проход: то же самое, но матрицами</text>
  <text x="250" y="72" class="colhd" text-anchor="middle">ДАННЫЕ И ПАРАМЕТРЫ</text>
  <text x="870" y="72" class="colhd" text-anchor="middle">ПРЯМОЙ ПРОХОД</text>
  <line x1="520" y1="56" x2="520" y2="520" class="div"/>
  <g data-key="dat" data-only="1">
    <text x="128" y="131" class="lab" text-anchor="end" fill="#5E5850">x⁽⁰⁾ =</text>
    <rect x="140" y="100" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="167" y="117" class="ct" text-anchor="middle" fill="#5E5850">0.5</text>
    <rect x="140" y="126" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="167" y="143" class="ct" text-anchor="middle" fill="#5E5850">0.8</text>
    <text x="167" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <text x="308" y="131" class="lab" text-anchor="end" fill="#5E5850">y =</text>
    <rect x="320" y="100" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="347" y="117" class="ct" text-anchor="middle" fill="#5E5850">1</text>
    <rect x="320" y="126" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="347" y="143" class="ct" text-anchor="middle" fill="#5E5850">0</text>
    <text x="347" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <text x="128" y="227" class="lab" text-anchor="end" fill="#2A5E9B">W⁽¹⁾ =</text>
    <rect x="140" y="196" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="167" y="213" class="ct" text-anchor="middle" fill="#2A5E9B">0.15</text>
    <rect x="194" y="196" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="221" y="213" class="ct" text-anchor="middle" fill="#2A5E9B">−0.20</text>
    <rect x="140" y="222" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="167" y="239" class="ct" text-anchor="middle" fill="#2A5E9B">0.40</text>
    <rect x="194" y="222" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="221" y="239" class="ct" text-anchor="middle" fill="#2A5E9B">0.30</text>
    <text x="194" y="266" class="shape" text-anchor="middle">(2×2)</text>
    <text x="328" y="227" class="lab" text-anchor="end" fill="#2A5E9B">b⁽¹⁾ =</text>
    <rect x="340" y="196" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="367" y="213" class="ct" text-anchor="middle" fill="#2A5E9B">0.10</text>
    <rect x="340" y="222" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="367" y="239" class="ct" text-anchor="middle" fill="#2A5E9B">−0.10</text>
    <text x="367" y="266" class="shape" text-anchor="middle">(2×1)</text>
    <text x="128" y="323" class="lab" text-anchor="end" fill="#2A5E9B">W⁽²⁾ =</text>
    <rect x="140" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="167" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">0.50</text>
    <rect x="194" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="221" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">−0.30</text>
    <rect x="140" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="167" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.20</text>
    <rect x="194" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="221" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.60</text>
    <text x="194" y="362" class="shape" text-anchor="middle">(2×2)</text>
    <text x="328" y="323" class="lab" text-anchor="end" fill="#2A5E9B">b⁽²⁾ =</text>
    <rect x="340" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="367" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">0.05</text>
    <rect x="340" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="367" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.15</text>
    <text x="367" y="362" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="96" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="z^{(1)} = W^{(1)} x^{(0)} + b^{(1)}"></div>
    </foreignObject>
  <g data-key="f1e" data-only="1">
    <text x="968" y="127" class="lab" text-anchor="end" fill="#C9C2B8">z⁽¹⁾ =</text>
    <rect x="980" y="96" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="113" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="139" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="f1" data-only="1">
    <text x="968" y="127" class="lab" text-anchor="end" fill="#4C8316">z⁽¹⁾ =</text>
    <rect x="980" y="96" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="113" class="ct" text-anchor="middle" fill="#4C8316">0.0150</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="139" class="ct" text-anchor="middle" fill="#4C8316">0.3400</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="184" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="a^{(1)} = \sigma\!\left(z^{(1)}\right)"></div>
    </foreignObject>
  <g data-key="f2e" data-only="1">
    <text x="968" y="215" class="lab" text-anchor="end" fill="#C9C2B8">a⁽¹⁾ =</text>
    <rect x="980" y="184" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="201" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="210" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="227" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="254" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="f2" data-only="1">
    <text x="968" y="215" class="lab" text-anchor="end" fill="#4C8316">a⁽¹⁾ =</text>
    <rect x="980" y="184" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="201" class="ct" text-anchor="middle" fill="#4C8316">0.5037</text>
    <rect x="980" y="210" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="227" class="ct" text-anchor="middle" fill="#4C8316">0.5842</text>
    <text x="1007" y="254" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="272" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="z^{(2)} = W^{(2)} a^{(1)} + b^{(2)}"></div>
    </foreignObject>
  <g data-key="f3e" data-only="1">
    <text x="968" y="303" class="lab" text-anchor="end" fill="#C9C2B8">z⁽²⁾ =</text>
    <rect x="980" y="272" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="289" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="315" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="342" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="f3" data-only="1">
    <text x="968" y="303" class="lab" text-anchor="end" fill="#4C8316">z⁽²⁾ =</text>
    <rect x="980" y="272" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="289" class="ct" text-anchor="middle" fill="#4C8316">0.1266</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="315" class="ct" text-anchor="middle" fill="#4C8316">0.6013</text>
    <text x="1007" y="342" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="360" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="a^{(2)} = \sigma\!\left(z^{(2)}\right)"></div>
    </foreignObject>
  <g data-key="f4e" data-only="1">
    <text x="968" y="391" class="lab" text-anchor="end" fill="#C9C2B8">a⁽²⁾ =</text>
    <rect x="980" y="360" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="377" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="403" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="430" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="f4" data-only="1">
    <text x="968" y="391" class="lab" text-anchor="end" fill="#4C8316">a⁽²⁾ =</text>
    <rect x="980" y="360" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="377" class="ct" text-anchor="middle" fill="#4C8316">0.5316</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="403" class="ct" text-anchor="middle" fill="#4C8316">0.6459</text>
    <text x="1007" y="430" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="448" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="E = \tfrac{1}{2}\left\|a^{(2)} - y\right\|^{2}"></div>
    </foreignObject>
  <g data-key="f5e" data-only="1">
    <text x="968" y="479" class="lab" text-anchor="end" fill="#C9C2B8">E =</text>
    <rect x="980" y="461" width="80" height="26" rx="2" class="empty"/>
    <text x="1020" y="478" class="qt" text-anchor="middle">?</text>
    <text x="1020" y="505" class="shape" text-anchor="middle">(скаляр)</text>
  </g>
  <g data-key="f5" data-only="1">
    <text x="968" y="479" class="lab" text-anchor="end" fill="#4C8316">E =</text>
    <rect x="980" y="461" width="80" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1020" y="478" class="ct" text-anchor="middle" fill="#4C8316">0.3183</text>
    <text x="1020" y="505" class="shape" text-anchor="middle">(скаляр)</text>
  </g>
  <g data-key="nb" data-only="1">
    <rect x="40" y="520" width="1160" height="34" rx="9" fill="#EDF7DD" stroke="#73B222" stroke-width="1.6"/>
    <text x="620" y="543" class="note" text-anchor="middle" fill="#4C8316">Внутренние размеры схлопываются: (2×2)·(2×1) = (2×1). Активация форму не меняет вообще</text>
  </g>
  <text x="40" y="572" class="legend">серый — данные примера · синий — обучаемые параметры · зелёный — то, что вычислил прямой проход · в скобках форма матрицы</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="dat f1e f2e f3e f4e f5e" data-focus="dat">
      <div class="step-kicker">Шаг 1 · что лежит на столе</div>
      <h4>Шесть матриц: вход, цель и параметры двух слоёв</h4>
      <p>Строка <code>i</code> матрицы <code>W⁽¹⁾</code> собирает веса, ведущие в
      узел <code>i</code> следующего слоя, столбец <code>j</code> — веса,
      выходящие из входа <code>j</code>. Справа пока пунктир со знаками вопроса:
      эти клетки нам и предстоит заполнить.</p>
      <p>Матричное умножение — не отдельная операция, а набор скалярных
      произведений. Клетка <code>i</code> результата равна произведению строки
      <code>i</code> на весь вектор:</p>
      <div class="math-display" data-tex="\left(W^{(1)} x^{(0)}\right)_i = \sum_{j} w^{(1)}_{ij}\, x^{(0)}_j"></div>
    </div>
    <div class="step-panel" data-on="dat f1 f2e f3e f4e f5e" data-focus="f1">
      <div class="step-kicker">Шаг 2 · сумматор первого слоя</div>
      <h4>Две строки — два скалярных произведения</h4>
      <p>Формы сходятся так: <code>(2×2) · (2×1)</code> даёт <code>(2×1)</code> —
      двойка в середине исчезает. Смещение прибавляется покомпонентно и просто
      становится третьим слагаемым в каждой строке.</p>
      <div class="worked-example">
        <div class="worked-label">Раскрываем построчно</div>
        <div class="worked-trace">
          <div class="worked-trace-title">W⁽¹⁾ = (0.15, −0.20; 0.40, 0.30), x⁽⁰⁾ = (0.5, 0.8), b⁽¹⁾ = (0.10, −0.10)</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">z₁⁽¹⁾</div>
            <div class="math-display worked-trace-math" data-tex="0.15\cdot 0.5 + (-0.20)\cdot 0.8 + 0.10 = 0.075 - 0.160 + 0.100 = 0.0150"></div>
            <div class="worked-trace-note">вклады входов почти погасили друг друга</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">z₂⁽¹⁾</div>
            <div class="math-display worked-trace-math" data-tex="0.40\cdot 0.5 + 0.30\cdot 0.8 + (-0.10) = 0.200 + 0.240 - 0.100 = 0.3400"></div>
            <div class="worked-trace-note">здесь оба входа тянут в одну сторону</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> первый
        скрытый узел получил почти ноль. Именно поэтому его активация окажется
        почти ровно 0.5 — сигмоида в нуле проходит через середину.</p>
      </div>
    </div>
    <div class="step-panel" data-on="dat f1 f2 f3e f4e f5e" data-focus="f2">
      <div class="step-kicker">Шаг 3 · активация</div>
      <h4>Сигмоида: одно число на клетку</h4>
      <p>Никакой линейной алгебры здесь нет — функция применяется к каждой клетке
      отдельно, поэтому форма не меняется вообще.</p>
      <div class="math-display" data-tex="a^{(1)}_1 = \frac{1}{1 + e^{-0.0150}} = 0.5037, \qquad a^{(1)}_2 = \frac{1}{1 + e^{-0.3400}} = 0.5842"></div>
      <p>Вокруг нуля сигмоида почти линейна с наклоном ¼: вход 0.0150 сдвинул
      выход от середины примерно на 0.0037, то есть на четверть входа.</p>
    </div>
    <div class="step-panel" data-on="dat f1 f2 f3 f4e f5e" data-focus="f3">
      <div class="step-kicker">Шаг 4 · сумматор второго слоя</div>
      <h4>Тот же блок, только вход другой</h4>
      <p>Вместо <code>x⁽⁰⁾</code> в скалярные произведения идёт <code>a⁽¹⁾</code>.
      Структура строк посимвольно та же — поэтому глубокая сеть это повторение
      одного блока, а не набор разных конструкций.</p>
      <div class="worked-example">
        <div class="worked-label">Раскрываем построчно</div>
        <div class="worked-trace">
          <div class="worked-trace-title">W⁽²⁾ = (0.50, −0.30; 0.20, 0.60), a⁽¹⁾ = (0.5037, 0.5842), b⁽²⁾ = (0.05, 0.15)</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">z₁⁽²⁾</div>
            <div class="math-display worked-trace-math" data-tex="0.50\cdot 0.5037 + (-0.30)\cdot 0.5842 + 0.05 = 0.2519 - 0.1753 + 0.0500 = 0.1266"></div>
            <div class="worked-trace-note">второй скрытый узел работает против первого</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">z₂⁽²⁾</div>
            <div class="math-display worked-trace-math" data-tex="0.20\cdot 0.5037 + 0.60\cdot 0.5842 + 0.15 = 0.1008 + 0.3505 + 0.1500 = 0.6013"></div>
            <div class="worked-trace-note">оба узла и смещение складываются</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> знаки в
        строках матрицы решают, складываются вклады или гасятся. У второго выхода
        всё сложилось — он и уедет дальше от нуля.</p>
      </div>
    </div>
    <div class="step-panel" data-on="dat f1 f2 f3 f4 f5e" data-focus="f4">
      <div class="step-kicker">Шаг 5 · выход сети</div>
      <h4>0.5316 и 0.6459</h4>
      <div class="math-display" data-tex="a^{(2)}_1 = \frac{1}{1 + e^{-0.1266}} = 0.5316, \qquad a^{(2)}_2 = \frac{1}{1 + e^{-0.6013}} = 0.6459"></div>
      <p>Первый выход должен был стать единицей, второй — нулём. Промахи в разные
      стороны: −0.4684 и +0.6459. Эти две разности через минуту станут стартовым
      импульсом обратного прохода.</p>
    </div>
    <div class="step-panel" data-on="dat f1 f2 f3 f4 f5" data-focus="f5">
      <div class="step-kicker">Шаг 6 · ошибка</div>
      <h4>Единственное место, где размерность падает до скаляра</h4>
      <p>Разность <code>a⁽²⁾ − y</code> ещё столбец <code>(2×1)</code>, но
      половина квадрата нормы сворачивает его в одно число.</p>
      <div class="math-display" data-tex="E = \tfrac{1}{2}\left(0.5316 - 1\right)^{2} + \tfrac{1}{2}\left(0.6459 - 0\right)^{2} = \tfrac{1}{2}(0.4684)^{2} + \tfrac{1}{2}(0.6459)^{2}"></div>
      <div class="math-display" data-tex="E = 0.1097 + 0.2086 = 0.3183"></div>
      <p>Вклад второго выхода почти вдвое больше — ожидаемо, что и градиенты от
      него окажутся крупнее.</p>
    </div>
    <div class="step-panel" data-on="dat f1 f2 f3 f4 f5 nb" data-focus="nb">
      <div class="step-kicker">Шаг 7 · правило форм</div>
      <h4>Что запомнить про размерности</h4>
      <div class="worked-example">
        <div class="worked-label">Проверка форм · слой из m входов в n выходов</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Три обязательных совпадения</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">умножение</div>
            <div class="math-display worked-trace-math" data-tex="[n \times m]\cdot[m \times 1] = [n \times 1]"></div>
            <div class="worked-trace-note">ширина матрицы равна высоте входа</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">смещение</div>
            <div class="math-display worked-trace-math" data-tex="[n \times 1] + [n \times 1] = [n \times 1]"></div>
            <div class="worked-trace-note">складывается покомпонентно</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">активация</div>
            <div class="math-display worked-trace-math" data-tex="\sigma\!\left([n \times 1]\right) = [n \times 1]"></div>
            <div class="worked-trace-note">форму не трогает вообще</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> форму выхода
        слоя задаёт только высота его матрицы весов. Если размерности сошлись, код
        почти наверняка делает то, что вы задумали.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-blue">
  <strong>Про батчи:</strong> в реальном коде вход обычно не столбец, а матрица
  <code>[B×m]</code> — по строке на пример из мини-батча, и тогда формулу пишут в
  зеркальном виде <code>Z = XW + b</code>. Математика та же, просто всё
  транспонировано; мы держимся столбцов, чтобы индексы совпадали с картой сети.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> разрезав нейрон на сумматор и активацию, мы
  получили карту, где у каждого ребра и каждого узла своя простая производная, а
  прямой проход заодно сохранил все числа, которые для них понадобятся.
</div>

---

## Часть 3. Последний слой: цепочка на каждый параметр

<p>
  У последнего слоя шесть параметров: четыре веса и два смещения. Для каждого нужен
  свой ответ на вопрос «насколько изменится <code>E</code>, если подвинуть этот
  параметр». Мы выведем все шесть, не пропуская ни одного, — и увидим, что
  различаются они ровно одним множителем.
</p>

<p>
  Правило движения простое. На карте каждый узел — функция, каждое ребро —
  умножение на вес. Двигаясь от <code>E</code> назад, на каждом шаге берём
  производную текущего узла по предыдущему и домножаем на накопленное.
</p>

<div class="math-display" data-tex="\frac{\partial E}{\partial w^{(2)}_{ij}} = \underbrace{\frac{\partial E}{\partial e^{(3)}_i}}_{=\,1}\cdot\frac{\partial e^{(3)}_i}{\partial a^{(2)}_i}\cdot\frac{\partial a^{(2)}_i}{\partial z^{(2)}_i}\cdot\frac{\partial z^{(2)}_i}{\partial w^{(2)}_{ij}}"></div>

<div class="callout-blue">
  <strong>Почему в цепочке только одна ошибка:</strong> вес <code>w⁽²⁾ᵢⱼ</code>
  влияет ровно на один выход. Пути от него до второй ошибки на карте просто нет,
  поэтому в формулу она не входит. Для весов первого слоя это будет уже не так —
  там начнутся развилки.
</div>

<p>Три множителя, которые нам понадобятся, читаются прямо со схемы:</p>

<table class="shape-table">
  <tr><th>Производная</th><th>Чему равна</th><th>Откуда видно</th></tr>
  <tr><td><code>∂e/∂a</code></td><td><code>a − y</code></td><td>из выбранной функции потерь</td></tr>
  <tr><td><code>∂a/∂z</code></td><td><code>σ'(z)</code></td><td>активация действует поэлементно</td></tr>
  <tr><td><code>∂z/∂w</code></td><td>то, что вошло в ребро</td><td>сумматор линеен по весам</td></tr>
  <tr><td><code>∂z/∂b</code></td><td><code>1</code></td><td>смещение входит без множителя</td></tr>
</table>

### Интерактив 5 · шесть цепочек в переменных

<div class="stage" id="stageLt" tabindex="0">
  <div class="stage-figure">
<svg id="lt" viewBox="0 0 1240 726" role="img" aria-label="Цепочка производных для каждого параметра последнего слоя">
  <style>
    #lt { font-family: Helvetica, Arial, sans-serif; }
    #lt .edge { stroke: #B9B4A9; stroke-width: 1.6; fill: none; }
    #lt .bedge { stroke: #D3CFC5; stroke-width: 1.3; fill: none; stroke-dasharray: 4 4; }
    #lt .nd { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.6; }
    #lt .nl { font-size: 16px; fill: #111111; }
    #lt .wl { font-size: 13px; fill: #5E5850; }
    #lt .cap { font-size: 13px; fill: #8A8378; }
    #lt .he { stroke-width: 4.5; fill: none; stroke-linecap: round; }
    #lt .hr { fill: none; stroke-width: 3.5; }
    #lt .vbg { fill: #FFFFFF; stroke: none; }
    #lt .val { font-size: 13px; }
    #lt .note { font-size: 14px; }
    #lt .topo { stroke: #D3CFC5; stroke-width: 1.4; fill: none; }
    #lt .topl { font-size: 13px; fill: #8A8378; }
    #lt .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <g data-key="D1" data-only="1">
    <foreignObject x="20" y="8" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E \,/\, \partial W^{(2)} \;=\; ?"></div>
    </foreignObject>
  </g>
  <g data-key="C1" data-only="1">
    <foreignObject x="920" y="8" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E \,/\, \partial e^{(3)}_i = 1"></div>
    </foreignObject>
  </g>
  <g data-key="C2" data-only="1">
    <foreignObject x="920" y="44" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial e^{(3)}_i \,/\, \partial a^{(2)}_i = a^{(2)}_i - y_i"></div>
    </foreignObject>
  </g>
  <g data-key="C3" data-only="1">
    <foreignObject x="920" y="80" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial a^{(2)}_i \,/\, \partial z^{(2)}_i = \sigma'\!\left(z^{(2)}_i\right)"></div>
    </foreignObject>
  </g>
  <g data-key="B1" data-only="1">
    <foreignObject x="680" y="8" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{L}_1 = \left(a^{(2)}_1 - y_1\right)\sigma'\!\left(z^{(2)}_1\right)"></div>
    </foreignObject>
  </g>
  <g data-key="B2" data-only="1">
    <foreignObject x="680" y="44" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{L}_2 = \left(a^{(2)}_2 - y_2\right)\sigma'\!\left(z^{(2)}_2\right)"></div>
    </foreignObject>
  </g>
  <g data-key="A1" data-only="1">
    <foreignObject x="300" y="8" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial z^{(2)}_i \,/\, \partial w^{(2)}_{ij} = a^{(1)}_j"></div>
    </foreignObject>
  </g>
  <g data-key="A2" data-only="1">
    <foreignObject x="300" y="44" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial z^{(2)}_i \,/\, \partial b^{(2)}_i = 1"></div>
    </foreignObject>
  </g>
  <g data-key="q11" data-only="1">
    <foreignObject x="20" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(2)}_{11} = \delta^{L}_1\, a^{(1)}_1"></div>
    </foreignObject>
  </g>
  <g data-key="q12" data-only="1">
    <foreignObject x="425" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(2)}_{12} = \delta^{L}_1\, a^{(1)}_2"></div>
    </foreignObject>
  </g>
  <g data-key="gb1" data-only="1">
    <foreignObject x="830" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial b^{(2)}_{1} = \delta^{L}_1"></div>
    </foreignObject>
  </g>
  <g data-key="q21" data-only="1">
    <foreignObject x="20" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(2)}_{21} = \delta^{L}_2\, a^{(1)}_1"></div>
    </foreignObject>
  </g>
  <g data-key="q22" data-only="1">
    <foreignObject x="425" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(2)}_{22} = \delta^{L}_2\, a^{(1)}_2"></div>
    </foreignObject>
  </g>
  <g data-key="gb2" data-only="1">
    <foreignObject x="830" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial b^{(2)}_{2} = \delta^{L}_2"></div>
    </foreignObject>
  </g>
  <line x1="120" y1="180" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="180" x2="340" y2="370" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="370" class="edge"/>
  <line x1="340" y1="180" x2="460" y2="180" class="edge"/>
  <line x1="340" y1="370" x2="460" y2="370" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="370" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="370" class="edge"/>
  <line x1="770" y1="180" x2="890" y2="180" class="edge"/>
  <line x1="770" y1="370" x2="890" y2="370" class="edge"/>
  <line x1="890" y1="180" x2="1050" y2="180" class="edge"/>
  <line x1="890" y1="370" x2="1050" y2="370" class="edge"/>
  <line x1="1050" y1="180" x2="1170" y2="275" class="edge"/>
  <line x1="1050" y1="370" x2="1170" y2="275" class="edge"/>
  <line x1="390" y1="470" x2="340" y2="180" class="bedge"/>
  <line x1="390" y1="470" x2="340" y2="370" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="180" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="370" class="bedge"/>
  <g data-key="allw" data-only="1">
    <line x1="460" y1="180" x2="770" y2="180" class="he" stroke="#C29E08"/>
    <line x1="460" y1="370" x2="770" y2="180" class="he" stroke="#C29E08"/>
    <line x1="460" y1="180" x2="770" y2="370" class="he" stroke="#C29E08"/>
    <line x1="460" y1="370" x2="770" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="pb" data-only="1">
    <line x1="820" y1="470" x2="770" y2="180" class="he" stroke="#C29E08"/>
    <line x1="820" y1="470" x2="770" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="out1" data-only="1">
    <line x1="1050" y1="180" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="890" y1="180" x2="1050" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="770" y1="180" x2="890" y2="180" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="out2" data-only="1">
    <line x1="1050" y1="370" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="890" y1="370" x2="1050" y2="370" class="he" stroke="#C30B0A"/>
    <line x1="770" y1="370" x2="890" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="w11" data-only="1">
    <line x1="460" y1="180" x2="770" y2="180" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w12" data-only="1">
    <line x1="460" y1="370" x2="770" y2="180" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w21" data-only="1">
    <line x1="460" y1="180" x2="770" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w22" data-only="1">
    <line x1="460" y1="370" x2="770" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <circle cx="120" cy="180" r="27" class="nd"/>
  <text x="120" y="186" class="nl" text-anchor="middle">x₁⁽⁰⁾</text>
  <circle cx="120" cy="370" r="27" class="nd"/>
  <text x="120" y="376" class="nl" text-anchor="middle">x₂⁽⁰⁾</text>
  <circle cx="340" cy="180" r="27" class="nd"/>
  <text x="340" y="186" class="nl" text-anchor="middle">z₁⁽¹⁾</text>
  <circle cx="340" cy="370" r="27" class="nd"/>
  <text x="340" y="376" class="nl" text-anchor="middle">z₂⁽¹⁾</text>
  <circle cx="460" cy="180" r="27" class="nd"/>
  <text x="460" y="186" class="nl" text-anchor="middle">a₁⁽¹⁾</text>
  <circle cx="460" cy="370" r="27" class="nd"/>
  <text x="460" y="376" class="nl" text-anchor="middle">a₂⁽¹⁾</text>
  <circle cx="770" cy="180" r="27" class="nd"/>
  <text x="770" y="186" class="nl" text-anchor="middle">z₁⁽²⁾</text>
  <circle cx="770" cy="370" r="27" class="nd"/>
  <text x="770" y="376" class="nl" text-anchor="middle">z₂⁽²⁾</text>
  <circle cx="890" cy="180" r="27" class="nd"/>
  <text x="890" y="186" class="nl" text-anchor="middle">a₁⁽²⁾</text>
  <circle cx="890" cy="370" r="27" class="nd"/>
  <text x="890" y="376" class="nl" text-anchor="middle">a₂⁽²⁾</text>
  <circle cx="1050" cy="180" r="27" class="nd"/>
  <text x="1050" y="186" class="nl" text-anchor="middle">e₁⁽³⁾</text>
  <circle cx="1050" cy="370" r="27" class="nd"/>
  <text x="1050" y="376" class="nl" text-anchor="middle">e₂⁽³⁾</text>
  <circle cx="1170" cy="275" r="27" class="nd"/>
  <text x="1170" y="281" class="nl" text-anchor="middle">E</text>
  <circle cx="390" cy="470" r="22" class="nd"/>
  <text x="390" y="476" class="nl" text-anchor="middle">b⁽¹⁾</text>
  <circle cx="820" cy="470" r="22" class="nd"/>
  <text x="820" y="476" class="nl" text-anchor="middle">b⁽²⁾</text>
  <g data-key="out1" data-only="1">
    <circle cx="1170" cy="275" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="1050" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="890" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="770" cy="180" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="out2" data-only="1">
    <circle cx="1170" cy="275" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="1050" cy="370" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="890" cy="370" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="770" cy="370" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="w11" data-only="1">
    <circle cx="460" cy="180" r="27" class="hr" stroke="#3576C0"/>
  </g>
  <g data-key="w12" data-only="1">
    <circle cx="460" cy="370" r="27" class="hr" stroke="#3576C0"/>
  </g>
  <g data-key="w21" data-only="1">
    <circle cx="460" cy="180" r="27" class="hr" stroke="#3576C0"/>
  </g>
  <g data-key="w22" data-only="1">
    <circle cx="460" cy="370" r="27" class="hr" stroke="#3576C0"/>
  </g>
  <g data-key="pb" data-only="1">
    <circle cx="820" cy="470" r="22" class="hr" stroke="#C29E08"/>
  </g>
  <g data-key="sum" data-only="1">
    <rect x="20" y="636" width="1200" height="34" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/>
    <text x="620" y="659" class="note" text-anchor="middle" fill="#8C7106">Шесть параметров слоя — шесть цепочек, у которых различается только последний множитель</text>
  </g>
  <text x="230" y="168" class="wl" text-anchor="middle">w₁₁⁽¹⁾</text>
  <text x="230" y="392" class="wl" text-anchor="middle">w₂₂⁽¹⁾</text>
  <text x="180" y="228" class="wl" text-anchor="middle">w₂₁⁽¹⁾</text>
  <text x="180" y="330" class="wl" text-anchor="middle">w₁₂⁽¹⁾</text>
  <text x="615" y="168" class="wl" text-anchor="middle">w₁₁⁽²⁾</text>
  <text x="615" y="392" class="wl" text-anchor="middle">w₂₂⁽²⁾</text>
  <text x="535" y="221" class="wl" text-anchor="middle">w₂₁⁽²⁾</text>
  <text x="535" y="337" class="wl" text-anchor="middle">w₁₂⁽²⁾</text>
  <text x="120" y="130" class="cap" text-anchor="middle">вход</text>
  <text x="340" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="460" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="770" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="890" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="1050" y="130" class="cap" text-anchor="middle">ошибка</text>
  <text x="1170" y="130" class="cap" text-anchor="middle">итог</text>
  <path d="M 20 510 L 20 516 L 290 516 L 290 510" class="topo"/>
  <text x="155" y="538" class="topl" text-anchor="middle">вход: 2 числа</text>
  <path d="M 300 510 L 300 516 L 660 516 L 660 510" class="topo"/>
  <text x="480" y="538" class="topl" text-anchor="middle">слой 1: 2 → 2 · W⁽¹⁾ 2×2, b⁽¹⁾ 2</text>
  <path d="M 680 510 L 680 516 L 910 516 L 910 510" class="topo"/>
  <text x="795" y="538" class="topl" text-anchor="middle">слой 2: 2 → 2 · W⁽²⁾ 2×2, b⁽²⁾ 2</text>
  <path d="M 920 510 L 920 516 L 1240 516 L 1240 510" class="topo"/>
  <text x="1080" y="538" class="topl" text-anchor="middle">потеря: MSE по двум выходам</text>
  <text x="20" y="704" class="legend">красный — обратный проход, сюда течёт градиент · жёлтый — параметр, по которому берём производную · синий — числа из кэша · внизу накапливаются готовые градиенты</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="D1 allw pb" data-focus="allw pb">
      <div class="step-kicker">Шаг 1 · что ищем</div>
      <h4>Шесть чисел, а не одно</h4>
      <p>Четыре веса и два смещения последнего слоя. Наверху над каждой колонкой
      появятся её локальные производные, а готовые градиенты будут копиться в
      нижней полосе — к последнему шагу все шесть окажутся там рядом.</p>
    </div>
    <div class="step-panel" data-on="D1 C1 C2 C3 B1 out1" data-focus="out1">
      <div class="step-kicker">Шаг 2 · общий кусок для выхода 1</div>
      <h4>Путь от ошибки до сумматора первого выхода</h4>
      <p>Он одинаков для всех параметров, ведущих в узел <code>z₁⁽²⁾</code>.
      Посчитаем его один раз и назовём дельтой.</p>
      <div class="math-display" data-tex="\delta^{L}_1 = \frac{\partial E}{\partial z^{(2)}_1} = \frac{\partial E}{\partial e^{(3)}_1}\cdot\frac{\partial e^{(3)}_1}{\partial a^{(2)}_1}\cdot\frac{\partial a^{(2)}_1}{\partial z^{(2)}_1} = 1\cdot\left(a^{(2)}_1 - y_1\right)\cdot\sigma'\!\left(z^{(2)}_1\right)"></div>
      <p>Смысл дельты: чувствительность общей ошибки к сумматору данного узла.</p>
    </div>
    <div class="step-panel" data-on="D1 C1 C2 C3 B1 A1 q11 out1 w11" data-focus="w11">
      <div class="step-kicker">Шаг 3 · параметр 1 из 6</div>
      <h4>Вес из первого скрытого узла в первый выход</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial w^{(2)}_{11}} = \frac{\partial E}{\partial z^{(2)}_1}\cdot\frac{\partial z^{(2)}_1}{\partial w^{(2)}_{11}} = \delta^{L}_1\, a^{(1)}_1"></div>
      <p>К общему куску добавляется последний множитель — то, что вошло в ребро.</p>
    </div>
    <div class="step-panel" data-on="D1 C1 C2 C3 B1 A1 q11 q12 out1 w12" data-focus="w12">
      <div class="step-kicker">Шаг 4 · параметр 2 из 6</div>
      <h4>Вес из второго скрытого узла в тот же выход</h4>
      <p>Начало цепочки не изменилось ни на символ — сравните две формулы в нижней
      полосе. Изменился только хвост: теперь по ребру приходит
      <code>a₂⁽¹⁾</code>.</p>
    </div>
    <div class="step-panel" data-on="C1 C2 C3 B1 B2 A1 q11 q12 out2" data-focus="out2">
      <div class="step-kicker">Шаг 5 · общий кусок для выхода 2</div>
      <h4>Вторая дельта</h4>
      <p>Симметрично первой, но с индексом 2: другая ошибка, другая точка, в которой
      берётся производная сигмоиды. Два выходных узла — две дельты, и больше ничего
      нового на этом слое не появится.</p>
    </div>
    <div class="step-panel" data-on="C1 C2 C3 B1 B2 A1 q11 q12 q21 out2 w21" data-focus="w21">
      <div class="step-kicker">Шаг 6 · параметр 3 из 6</div>
      <h4>Вес из первого скрытого узла во второй выход</h4>
      <p>Дельта вторая, вход ребра — снова <code>a₁⁽¹⁾</code>. Обратите внимание,
      как раскладываются индексы: первый индекс веса выбирает дельту, второй —
      активацию.</p>
    </div>
    <div class="step-panel" data-on="C1 C2 C3 B1 B2 A1 q11 q12 q21 q22 out2 w22" data-focus="w22">
      <div class="step-kicker">Шаг 7 · параметр 4 из 6</div>
      <h4>Последний вес слоя</h4>
      <p>Четыре формулы стоят рядом в нижней полосе, и все имеют вид «дельта
      выходного узла × активация входного». Верхняя строка полосы — первый выход,
      нижняя — второй: это уже готовая матрица 2×2.</p>
    </div>
    <div class="step-panel" data-on="B1 B2 A2 q11 q12 q21 q22 gb1 gb2 out1 out2 pb" data-focus="pb">
      <div class="step-kicker">Шаг 8 · параметры 5 и 6</div>
      <h4>Смещения достаются даром</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial b^{(2)}_i} = \frac{\partial E}{\partial z^{(2)}_i}\cdot\underbrace{\frac{\partial z^{(2)}_i}{\partial b^{(2)}_i}}_{=\,1} = \delta^{L}_i"></div>
      <p>Практическое следствие: смещения всегда получают более чистый сигнал, чем
      веса, — им не мешает малая величина входа.</p>
    </div>
    <div class="step-panel" data-on="B1 B2 q11 q12 q21 q22 gb1 gb2 allw pb sum" data-focus="sum">
      <div class="step-kicker">Шаг 9 · сводка</div>
      <h4>Все шесть формул на одном экране</h4>
      <p>В каждой — только дельта и активация. Ни производных, ни функции потерь:
      всё это уже спрятано внутри <code>δᴸ</code>. Соберём четыре весовые формулы
      в таблицу:</p>
      <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(2)}} = \begin{pmatrix} \delta^{L}_1 a^{(1)}_1 &amp; \delta^{L}_1 a^{(1)}_2 \\ \delta^{L}_2 a^{(1)}_1 &amp; \delta^{L}_2 a^{(1)}_2 \end{pmatrix}"></div>
      <p>Такая одинаковость и позволяет перейти к матрицам, чем мы займёмся в
      части 4.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 6 · те же шесть цепочек в числах

<p>
  Шаги совпадают с предыдущей сценой: где там стояла формула
  <code>δᴸ₁·a₁⁽¹⁾</code>, здесь стоит её значение.
</p>

<div class="stage" id="stageLtn" tabindex="0">
  <div class="stage-figure">
<svg id="ltn" viewBox="0 0 1240 726" role="img" aria-label="Те же шесть цепочек последнего слоя, посчитанные в числах">
  <style>
    #ltn { font-family: Helvetica, Arial, sans-serif; }
    #ltn .edge { stroke: #B9B4A9; stroke-width: 1.6; fill: none; }
    #ltn .bedge { stroke: #D3CFC5; stroke-width: 1.3; fill: none; stroke-dasharray: 4 4; }
    #ltn .nd { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.6; }
    #ltn .nl { font-size: 16px; fill: #111111; }
    #ltn .wl { font-size: 13px; fill: #5E5850; }
    #ltn .cap { font-size: 13px; fill: #8A8378; }
    #ltn .he { stroke-width: 4.5; fill: none; stroke-linecap: round; }
    #ltn .hr { fill: none; stroke-width: 3.5; }
    #ltn .vbg { fill: #FFFFFF; stroke: none; }
    #ltn .val { font-size: 13px; }
    #ltn .note { font-size: 14px; }
    #ltn .topo { stroke: #D3CFC5; stroke-width: 1.4; fill: none; }
    #ltn .topl { font-size: 13px; fill: #8A8378; }
    #ltn .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <g data-key="D1" data-only="1">
    <foreignObject x="20" y="8" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="a^{(1)} = \left(0.5037,\; 0.5842\right)"></div>
    </foreignObject>
  </g>
  <g data-key="C1" data-only="1">
    <foreignObject x="920" y="8" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E \,/\, \partial e^{(3)}_i = 1"></div>
    </foreignObject>
  </g>
  <g data-key="C2" data-only="1">
    <foreignObject x="920" y="44" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="a^{(2)} - y = \left(-0.4684,\; 0.6459\right)"></div>
    </foreignObject>
  </g>
  <g data-key="C3" data-only="1">
    <foreignObject x="920" y="80" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\sigma'\!\left(z^{(2)}\right) = \left(0.2490,\; 0.2287\right)"></div>
    </foreignObject>
  </g>
  <g data-key="B1" data-only="1">
    <foreignObject x="680" y="8" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{L}_1 = (-0.4684)(0.2490) = -0.1166"></div>
    </foreignObject>
  </g>
  <g data-key="B2" data-only="1">
    <foreignObject x="680" y="44" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{L}_2 = (0.6459)(0.2287) = 0.1477"></div>
    </foreignObject>
  </g>
  <g data-key="A1" data-only="1">
    <foreignObject x="300" y="8" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial z^{(2)}_i \,/\, \partial w^{(2)}_{ij} = a^{(1)}_j"></div>
    </foreignObject>
  </g>
  <g data-key="A2" data-only="1">
    <foreignObject x="300" y="44" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial z^{(2)}_i \,/\, \partial b^{(2)}_i = 1"></div>
    </foreignObject>
  </g>
  <g data-key="q11" data-only="1">
    <foreignObject x="20" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(2)}_{11} = (-0.1166)(0.5037) = -0.0588"></div>
    </foreignObject>
  </g>
  <g data-key="q12" data-only="1">
    <foreignObject x="425" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(2)}_{12} = (-0.1166)(0.5842) = -0.0681"></div>
    </foreignObject>
  </g>
  <g data-key="gb1" data-only="1">
    <foreignObject x="830" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial b^{(2)}_{1} = -0.1166"></div>
    </foreignObject>
  </g>
  <g data-key="q21" data-only="1">
    <foreignObject x="20" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(2)}_{21} = (0.1477)(0.5037) = 0.0744"></div>
    </foreignObject>
  </g>
  <g data-key="q22" data-only="1">
    <foreignObject x="425" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(2)}_{22} = (0.1477)(0.5842) = 0.0863"></div>
    </foreignObject>
  </g>
  <g data-key="gb2" data-only="1">
    <foreignObject x="830" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial b^{(2)}_{2} = 0.1477"></div>
    </foreignObject>
  </g>
  <line x1="120" y1="180" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="180" x2="340" y2="370" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="370" class="edge"/>
  <line x1="340" y1="180" x2="460" y2="180" class="edge"/>
  <line x1="340" y1="370" x2="460" y2="370" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="370" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="370" class="edge"/>
  <line x1="770" y1="180" x2="890" y2="180" class="edge"/>
  <line x1="770" y1="370" x2="890" y2="370" class="edge"/>
  <line x1="890" y1="180" x2="1050" y2="180" class="edge"/>
  <line x1="890" y1="370" x2="1050" y2="370" class="edge"/>
  <line x1="1050" y1="180" x2="1170" y2="275" class="edge"/>
  <line x1="1050" y1="370" x2="1170" y2="275" class="edge"/>
  <line x1="390" y1="470" x2="340" y2="180" class="bedge"/>
  <line x1="390" y1="470" x2="340" y2="370" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="180" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="370" class="bedge"/>
  <g data-key="allw" data-only="1">
    <line x1="460" y1="180" x2="770" y2="180" class="he" stroke="#C29E08"/>
    <line x1="460" y1="370" x2="770" y2="180" class="he" stroke="#C29E08"/>
    <line x1="460" y1="180" x2="770" y2="370" class="he" stroke="#C29E08"/>
    <line x1="460" y1="370" x2="770" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="pb" data-only="1">
    <line x1="820" y1="470" x2="770" y2="180" class="he" stroke="#C29E08"/>
    <line x1="820" y1="470" x2="770" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="out1" data-only="1">
    <line x1="1050" y1="180" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="890" y1="180" x2="1050" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="770" y1="180" x2="890" y2="180" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="out2" data-only="1">
    <line x1="1050" y1="370" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="890" y1="370" x2="1050" y2="370" class="he" stroke="#C30B0A"/>
    <line x1="770" y1="370" x2="890" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="w11" data-only="1">
    <line x1="460" y1="180" x2="770" y2="180" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w12" data-only="1">
    <line x1="460" y1="370" x2="770" y2="180" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w21" data-only="1">
    <line x1="460" y1="180" x2="770" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w22" data-only="1">
    <line x1="460" y1="370" x2="770" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <circle cx="120" cy="180" r="27" class="nd"/>
  <text x="120" y="186" class="nl" text-anchor="middle">x₁⁽⁰⁾</text>
  <circle cx="120" cy="370" r="27" class="nd"/>
  <text x="120" y="376" class="nl" text-anchor="middle">x₂⁽⁰⁾</text>
  <circle cx="340" cy="180" r="27" class="nd"/>
  <text x="340" y="186" class="nl" text-anchor="middle">z₁⁽¹⁾</text>
  <circle cx="340" cy="370" r="27" class="nd"/>
  <text x="340" y="376" class="nl" text-anchor="middle">z₂⁽¹⁾</text>
  <circle cx="460" cy="180" r="27" class="nd"/>
  <text x="460" y="186" class="nl" text-anchor="middle">a₁⁽¹⁾</text>
  <circle cx="460" cy="370" r="27" class="nd"/>
  <text x="460" y="376" class="nl" text-anchor="middle">a₂⁽¹⁾</text>
  <circle cx="770" cy="180" r="27" class="nd"/>
  <text x="770" y="186" class="nl" text-anchor="middle">z₁⁽²⁾</text>
  <circle cx="770" cy="370" r="27" class="nd"/>
  <text x="770" y="376" class="nl" text-anchor="middle">z₂⁽²⁾</text>
  <circle cx="890" cy="180" r="27" class="nd"/>
  <text x="890" y="186" class="nl" text-anchor="middle">a₁⁽²⁾</text>
  <circle cx="890" cy="370" r="27" class="nd"/>
  <text x="890" y="376" class="nl" text-anchor="middle">a₂⁽²⁾</text>
  <circle cx="1050" cy="180" r="27" class="nd"/>
  <text x="1050" y="186" class="nl" text-anchor="middle">e₁⁽³⁾</text>
  <circle cx="1050" cy="370" r="27" class="nd"/>
  <text x="1050" y="376" class="nl" text-anchor="middle">e₂⁽³⁾</text>
  <circle cx="1170" cy="275" r="27" class="nd"/>
  <text x="1170" y="281" class="nl" text-anchor="middle">E</text>
  <circle cx="390" cy="470" r="22" class="nd"/>
  <text x="390" y="476" class="nl" text-anchor="middle">b⁽¹⁾</text>
  <circle cx="820" cy="470" r="22" class="nd"/>
  <text x="820" y="476" class="nl" text-anchor="middle">b⁽²⁾</text>
  <g data-key="out1" data-only="1">
    <circle cx="1170" cy="275" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="1050" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="890" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="770" cy="180" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="out2" data-only="1">
    <circle cx="1170" cy="275" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="1050" cy="370" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="890" cy="370" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="770" cy="370" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="w11" data-only="1">
    <circle cx="460" cy="180" r="27" class="hr" stroke="#3576C0"/>
    <rect x="434" y="214" width="52" height="20" class="vbg"/>
    <text x="460" y="228" class="val" text-anchor="middle" fill="#3576C0">0.5037</text>
  </g>
  <g data-key="w12" data-only="1">
    <circle cx="460" cy="370" r="27" class="hr" stroke="#3576C0"/>
    <rect x="434" y="404" width="52" height="20" class="vbg"/>
    <text x="460" y="418" class="val" text-anchor="middle" fill="#3576C0">0.5842</text>
  </g>
  <g data-key="w21" data-only="1">
    <circle cx="460" cy="180" r="27" class="hr" stroke="#3576C0"/>
    <rect x="434" y="214" width="52" height="20" class="vbg"/>
    <text x="460" y="228" class="val" text-anchor="middle" fill="#3576C0">0.5037</text>
  </g>
  <g data-key="w22" data-only="1">
    <circle cx="460" cy="370" r="27" class="hr" stroke="#3576C0"/>
    <rect x="434" y="404" width="52" height="20" class="vbg"/>
    <text x="460" y="418" class="val" text-anchor="middle" fill="#3576C0">0.5842</text>
  </g>
  <g data-key="pb" data-only="1">
    <circle cx="820" cy="470" r="22" class="hr" stroke="#C29E08"/>
  </g>
  <g data-key="sum" data-only="1">
    <rect x="20" y="636" width="1200" height="34" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/>
    <text x="620" y="659" class="note" text-anchor="middle" fill="#8C7106">Шесть параметров слоя — шесть цепочек, у которых различается только последний множитель</text>
  </g>
  <text x="230" y="168" class="wl" text-anchor="middle">w₁₁⁽¹⁾</text>
  <text x="230" y="392" class="wl" text-anchor="middle">w₂₂⁽¹⁾</text>
  <text x="180" y="228" class="wl" text-anchor="middle">w₂₁⁽¹⁾</text>
  <text x="180" y="330" class="wl" text-anchor="middle">w₁₂⁽¹⁾</text>
  <text x="615" y="168" class="wl" text-anchor="middle">w₁₁⁽²⁾</text>
  <text x="615" y="392" class="wl" text-anchor="middle">w₂₂⁽²⁾</text>
  <text x="535" y="221" class="wl" text-anchor="middle">w₂₁⁽²⁾</text>
  <text x="535" y="337" class="wl" text-anchor="middle">w₁₂⁽²⁾</text>
  <text x="120" y="130" class="cap" text-anchor="middle">вход</text>
  <text x="340" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="460" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="770" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="890" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="1050" y="130" class="cap" text-anchor="middle">ошибка</text>
  <text x="1170" y="130" class="cap" text-anchor="middle">итог</text>
  <path d="M 20 510 L 20 516 L 290 516 L 290 510" class="topo"/>
  <text x="155" y="538" class="topl" text-anchor="middle">вход: 2 числа</text>
  <path d="M 300 510 L 300 516 L 660 516 L 660 510" class="topo"/>
  <text x="480" y="538" class="topl" text-anchor="middle">слой 1: 2 → 2 · W⁽¹⁾ 2×2, b⁽¹⁾ 2</text>
  <path d="M 680 510 L 680 516 L 910 516 L 910 510" class="topo"/>
  <text x="795" y="538" class="topl" text-anchor="middle">слой 2: 2 → 2 · W⁽²⁾ 2×2, b⁽²⁾ 2</text>
  <path d="M 920 510 L 920 516 L 1240 516 L 1240 510" class="topo"/>
  <text x="1080" y="538" class="topl" text-anchor="middle">потеря: MSE по двум выходам</text>
  <text x="20" y="704" class="legend">красный — обратный проход, сюда течёт градиент · жёлтый — параметр, по которому берём производную · синий — числа из кэша · внизу накапливаются готовые градиенты</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="D1 allw pb" data-focus="allw pb">
      <div class="step-kicker">Шаг 1 · что берём из кэша</div>
      <h4>Четыре вектора — и больше ничего не нужно</h4>
      <p>Активации первого слоя, выход сети, цель и производная сигмоиды в точках
      <code>z⁽²⁾</code>. Всё это уже посчитано на прямом проходе.</p>
    </div>
    <div class="step-panel" data-on="D1 C1 C2 C3 B1 out1" data-focus="out1">
      <div class="step-kicker">Шаг 2 · дельта первого выхода</div>
      <h4>Минус означает «поднимай»</h4>
      <p>Промах равен −0.4684: выход ниже цели. Домножаем на 0.2490 — производную
      сигмоиды почти в максимуме — и получаем <code>δᴸ₁ = −0.1166</code>.</p>
    </div>
    <div class="step-panel" data-on="D1 C1 C2 C3 B1 A1 q11 out1 w11" data-focus="w11">
      <div class="step-kicker">Шаг 3 · параметр 1 из 6</div>
      <h4>−0.0588</h4>
      <p>Отрицательный градиент: шаг спуска пойдёт в противоположную сторону, то
      есть этот вес вырастет. Логично — сеть хочет поднять первый выход.</p>
    </div>
    <div class="step-panel" data-on="D1 C1 C2 C3 B1 A1 q11 q12 out1 w12" data-focus="w12">
      <div class="step-kicker">Шаг 4 · параметр 2 из 6</div>
      <h4>−0.0681</h4>
      <p>Тот же множитель дельты, но активация больше (0.5842 против 0.5037),
      поэтому и градиент больше по модулю. Узел, который сильнее «звучал» на прямом
      проходе, получает и более сильную поправку.</p>
    </div>
    <div class="step-panel" data-on="C1 C2 C3 B1 B2 A1 q11 q12 out2" data-focus="out2">
      <div class="step-kicker">Шаг 5 · дельта второго выхода</div>
      <h4>Плюс означает «опускай»</h4>
      <p>Промах 0.6459 при цели ноль, производная 0.2287 — и
      <code>δᴸ₂ = 0.1477</code>. По модулю больше первой дельты: этот выход ошибся
      сильнее.</p>
    </div>
    <div class="step-panel" data-on="C1 C2 C3 B1 B2 A1 q11 q12 q21 out2 w21" data-focus="w21">
      <div class="step-kicker">Шаг 6 · параметр 3 из 6</div>
      <h4>0.0744</h4>
      <p>Положительный: вес будет уменьшаться.</p>
    </div>
    <div class="step-panel" data-on="C1 C2 C3 B1 B2 A1 q11 q12 q21 q22 out2 w22" data-focus="w22">
      <div class="step-kicker">Шаг 7 · параметр 4 из 6</div>
      <h4>0.0863 — самый крупный градиент слоя</h4>
      <p>Здесь сошлись самая большая дельта и самая большая активация. Это и есть
      «путь наибольшего влияния», ради поиска которого всё затевалось.</p>
    </div>
    <div class="step-panel" data-on="B1 B2 A2 q11 q12 q21 q22 gb1 gb2 out1 out2 pb" data-focus="pb">
      <div class="step-kicker">Шаг 8 · параметры 5 и 6</div>
      <h4>Градиенты смещений равны дельтам</h4>
      <p>−0.1166 и 0.1477, без единого дополнительного умножения. Заметьте, что оба
      крупнее любого из весовых градиентов этого слоя.</p>
    </div>
    <div class="step-panel" data-on="B1 B2 q11 q12 q21 q22 gb1 gb2 allw pb sum" data-focus="sum">
      <div class="step-kicker">Шаг 9 · сводка</div>
      <h4>Шесть чисел последнего слоя</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(2)}} = \begin{pmatrix} -0.0588 &amp; -0.0681 \\ 0.0744 &amp; 0.0863 \end{pmatrix}, \qquad \frac{\partial E}{\partial b^{(2)}} = \begin{pmatrix} -0.1166 \\ 0.1477 \end{pmatrix}"></div>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · закономерности в матрице</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Что видно без вычислений</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">строки</div>
            <div class="math-display worked-trace-math" data-tex="-0.0588 : -0.0681 \;=\; 0.0744 : 0.0863"></div>
            <div class="worked-trace-note">обе строки пропорциональны одному и тому же вектору активаций</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">знаки</div>
            <div class="math-display worked-trace-math" data-tex="\mathrm{sign} = \mathrm{sign}\left(\delta^{L}\right)"></div>
            <div class="worked-trace-note">знак всей строки задаёт дельта выходного узла</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> матрица
        градиентов — не набор из четырёх независимых чисел, а произведение двух
        векторов. Именно это мы и оформим в следующей части.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> все шесть градиентов слоя строятся из двух
  дельт. Градиент веса — дельта его выходного узла, умноженная на вход ребра;
  градиент смещения — сама дельта.
</div>

---

## Часть 4. Компактная запись последнего слоя

<p>
  В части 3 мы шли по узлам — так формулы выводятся, но так их не хранят.
  Существует второй, эквивалентный маршрут к тем же результатам: работать сразу с
  векторами и матрицами, как с целыми объектами графа вычислений. Сейчас мы
  переведём шесть скалярных формул на этот язык.
</p>

<p>
  Первые два множителя каждой цепочки зависят только от номера <em>выхода</em>, а
  не от того, из какого узла выходит вес. Это и есть дельта, записанная вектором
  целиком.
</p>

<div class="math-display" data-tex="\delta^{L} = \frac{\partial E}{\partial a^{(2)}} \odot \sigma'\!\left(z^{(2)}\right)"></div>

<div class="callout-blue">
  <strong>Что означает <code>⊙</code>:</strong> поэлементное умножение векторов.
  Формально в этом месте стоит диагональная матрица Якоби активации, но раз
  сигмоида применяется к каждой компоненте отдельно, вне диагонали всё нули — и
  умножение на такую матрицу сводится к поэлементному.
</div>

<p>
  В правом верхнем углу сцены — уменьшенная схема сети: она показывает, какой
  именно кусок мы сейчас разбираем, чтобы формулы не висели в воздухе.
</p>

### Интерактив 7 · от четырёх формул к одной матрице

<div class="stage" id="stageMx" tabindex="0">
  <div class="stage-figure">
<svg id="mx" viewBox="0 0 960 646" role="img" aria-label="Сборка четырёх скалярных формул последнего слоя в одну матричную запись">
  <style>
    #mx { font-family: Helvetica, Arial, sans-serif; }
    #mx .cap { font-size: 14px; fill: #5E5850; }
    #mx .note { font-size: 14px; }
    #mx .mini { font-size: 12px; fill: #8A8378; }
    #mx .mmn { fill: #FFFFFF; stroke: #B9B4A9; stroke-width: 1.4; }
    #mx .mme { stroke: #D3CFC5; stroke-width: 1.3; fill: none; }
    #mx .mmy { stroke: #C29E08; stroke-width: 3; fill: none; stroke-linecap: round; }
    #mx .mmr { stroke: #C30B0A; stroke-width: 3; fill: none; stroke-linecap: round; }
    #mx .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #mx .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #mx .bb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mx .legend { font-size: 13px; fill: #8A8378; }
  </style>

  <text x="33" y="32" class="cap">Четыре веса последнего слоя — четыре цепочки одинакового устройства</text>

  <line x1="650" y1="62" x2="730" y2="62" class="mme"/>
  <line x1="650" y1="62" x2="730" y2="112" class="mme"/>
  <line x1="650" y1="112" x2="730" y2="62" class="mme"/>
  <line x1="650" y1="112" x2="730" y2="112" class="mme"/>
  <line x1="730" y1="62" x2="810" y2="62" class="mmy"/>
  <line x1="730" y1="62" x2="810" y2="112" class="mmy"/>
  <line x1="730" y1="112" x2="810" y2="62" class="mmy"/>
  <line x1="730" y1="112" x2="810" y2="112" class="mmy"/>
  <line x1="810" y1="62" x2="890" y2="87" class="mmr"/>
  <line x1="810" y1="112" x2="890" y2="87" class="mmr"/>
  <circle cx="650" cy="62" r="11" class="mmn"/>
  <circle cx="650" cy="112" r="11" class="mmn"/>
  <circle cx="730" cy="62" r="11" class="mmn"/>
  <circle cx="730" cy="112" r="11" class="mmn"/>
  <circle cx="810" cy="62" r="11" class="mmn"/>
  <circle cx="810" cy="112" r="11" class="mmn"/>
  <circle cx="890" cy="87" r="11" class="mmn"/>
  <text x="650" y="42" class="mini" text-anchor="middle">x⁽⁰⁾</text>
  <text x="730" y="42" class="mini" text-anchor="middle">a⁽¹⁾</text>
  <text x="810" y="42" class="mini" text-anchor="middle">a⁽²⁾</text>
  <text x="890" y="42" class="mini" text-anchor="middle">E</text>
  <text x="770" y="142" class="mini" text-anchor="middle">разбираем жёлтый слой: W⁽²⁾ и b⁽²⁾</text>

  <g data-key="eqs" data-only="1">
    <foreignObject x="33" y="44" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial w^{(2)}_{11}} = \textcolor{#C29E08}{\left(a^{(2)}_1 - y_1\right)\,\sigma'\!\left(z^{(2)}_1\right)}\;a^{(1)}_1"></div>
    </foreignObject>
    <foreignObject x="33" y="86" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial w^{(2)}_{12}} = \textcolor{#C29E08}{\left(a^{(2)}_1 - y_1\right)\,\sigma'\!\left(z^{(2)}_1\right)}\;a^{(1)}_2"></div>
    </foreignObject>
    <foreignObject x="33" y="128" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial w^{(2)}_{21}} = \textcolor{#C29E08}{\left(a^{(2)}_2 - y_2\right)\,\sigma'\!\left(z^{(2)}_2\right)}\;a^{(1)}_1"></div>
    </foreignObject>
    <foreignObject x="33" y="170" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial w^{(2)}_{22}} = \textcolor{#C29E08}{\left(a^{(2)}_2 - y_2\right)\,\sigma'\!\left(z^{(2)}_2\right)}\;a^{(1)}_2"></div>
    </foreignObject>
  </g>

  <g data-key="rep" data-only="1">
    <text x="33" y="238" class="note" fill="#8C7106">Жёлтая часть зависит только от номера выхода: у пары 11 и 12 она общая, у 21 и 22 — своя</text>
  </g>

  <g data-key="dlt" data-only="1">
    <rect x="33" y="252" width="430" height="56" rx="10" class="br"/>
    <rect x="493" y="252" width="430" height="56" rx="10" class="br"/>
    <foreignObject x="45" y="264" width="406" height="34">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{L}_1 = \left(a^{(2)}_1 - y_1\right)\sigma'\!\left(z^{(2)}_1\right) = -0.1166"></div>
    </foreignObject>
    <foreignObject x="505" y="264" width="406" height="34">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{L}_2 = \left(a^{(2)}_2 - y_2\right)\sigma'\!\left(z^{(2)}_2\right) = 0.1477"></div>
    </foreignObject>
  </g>

  <g data-key="rew" data-only="1">
    <foreignObject x="33" y="324" width="890" height="44">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\frac{\partial E}{\partial w^{(2)}_{11}} = \delta^{L}_1 a^{(1)}_1, \qquad \frac{\partial E}{\partial w^{(2)}_{12}} = \delta^{L}_1 a^{(1)}_2"></div>
    </foreignObject>
    <foreignObject x="33" y="370" width="890" height="44">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\frac{\partial E}{\partial w^{(2)}_{21}} = \delta^{L}_2 a^{(1)}_1, \qquad \frac{\partial E}{\partial w^{(2)}_{22}} = \delta^{L}_2 a^{(1)}_2"></div>
    </foreignObject>
  </g>

  <g data-key="mat" data-only="1">
    <rect x="33" y="426" width="580" height="76" rx="12" class="by"/>
    <foreignObject x="45" y="436" width="556" height="58">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial W^{(2)}} = \begin{pmatrix} \delta^{L}_1 \\ \delta^{L}_2 \end{pmatrix}\begin{pmatrix} a^{(1)}_1 &amp; a^{(1)}_2 \end{pmatrix} = \delta^{L}\left(a^{(1)}\right)^{\!\top}"></div>
    </foreignObject>
  </g>

  <g data-key="bia" data-only="1">
    <rect x="633" y="426" width="290" height="76" rx="12" class="by"/>
    <foreignObject x="645" y="436" width="266" height="58">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial b^{(2)}} = \delta^{L}"></div>
    </foreignObject>
  </g>

  <g data-key="num" data-only="1">
    <rect x="33" y="518" width="890" height="80" rx="12" class="bb"/>
    <foreignObject x="45" y="526" width="866" height="64">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial W^{(2)}} = \begin{pmatrix} -0.1166 \\ 0.1477 \end{pmatrix}\begin{pmatrix} 0.5037 &amp; 0.5842 \end{pmatrix} = \begin{pmatrix} -0.0588 &amp; -0.0681 \\ 0.0744 &amp; 0.0863 \end{pmatrix}"></div>
    </foreignObject>
  </g>

  <text x="33" y="628" class="legend">красный — сигнал ошибки, идущий назад · жёлтый — параметры и их градиенты · синий — числа сквозного примера</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="eqs" data-focus="eqs">
      <div class="step-kicker">Шаг 1 · что есть</div>
      <h4>Четыре цепочки, выписанные подряд</h4>
      <p>Это результат части 3 без сокращений: промах, производная активации, вход
      ребра. На мини-схеме жёлтым отмечен слой, о котором идёт речь.</p>
    </div>
    <div class="step-panel" data-on="eqs rep" data-focus="rep">
      <div class="step-kicker">Шаг 2 · находим повтор</div>
      <h4>Жёлтая часть повторяется дважды</h4>
      <p>Строки 1 и 2 начинаются одинаково — обе идут в первый выход. Строки 3 и 4
      совпадают между собой. Считать одно и то же дважды не нужно, а в большой сети
      — просто разорительно.</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt" data-focus="dlt">
      <div class="step-kicker">Шаг 3 · вводим дельту</div>
      <h4>Повторяющийся кусок получает имя</h4>
      <p>Дельта — не сокращение записи ради красоты. Это единственная величина,
      которую слой передаёт соседям, и на ней держится вся экономия алгоритма.</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt rew" data-focus="rew">
      <div class="step-kicker">Шаг 4 · переписываем</div>
      <h4>Формулы стали двухбуквенными</h4>
      <p>Индексы читаются буквально: строка — куда ребро ведёт, столбец — откуда
      выходит. Именно ради этого совпадения нотация весов и была выбрана
      «вывернутой».</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt rew mat" data-focus="mat">
      <div class="step-kicker">Шаг 5 · матричная форма</div>
      <h4>Столбец на строку — это внешнее произведение</h4>
      <p>Разложите четыре равенства по клеткам матрицы 2×2 — получится таблица
      умножения: вектор дельт по вертикали, вектор активаций по горизонтали.</p>
      <p>Проверка размерностей бесплатная: столбец 2×1 на строку 1×2 даёт 2×2 —
      ровно форму <code>W⁽²⁾</code>. Градиент всегда той же формы, что и параметр,
      иначе его некуда было бы вычитать.</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt rew mat bia" data-focus="bia">
      <div class="step-kicker">Шаг 6 · смещения</div>
      <h4>Отдельной формулы не понадобилось</h4>
      <p>Градиент вектора смещений — это и есть вектор дельт. В коде эта строка
      обычно выглядит просто как присваивание.</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt rew mat bia num" data-focus="num">
      <div class="step-kicker">Шаг 7 · числа</div>
      <h4>Вся матрица градиентов за одно умножение</h4>
      <p>Значение −0.0588 в левом верхнем углу — тот самый градиент, который мы
      выводили руками. Остальные три получились попутно, а строки и столбцы
      оказались пропорциональны, как и обещала предыдущая часть.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> градиент весов слоя — внешнее произведение
  дельты на вход слоя, <code>∂E/∂W = δ·aᵀ</code>; градиент смещений равен самой
  дельте. Это тот же результат, что и в части 3, просто записанный целиком.
</div>

---

## Часть 5. Первый слой: развилка вперёд — сумма назад

<p>
  С параметрами первого слоя появляется новое обстоятельство. Активация
  <code>a₁⁽¹⁾</code> уходит не в один узел, а во все узлы следующего слоя, и через
  каждый влияет на общую ошибку. Значит, путей от параметра до <code>E</code>
  теперь несколько.
</p>

<p>
  Правило совпадает с интуицией: <strong>если из узла вперёд выходит несколько
  рёбер, назад по ним приходят вклады, и эти вклады складываются.</strong>
</p>

<div class="math-display" data-tex="\frac{\partial E}{\partial a^{(1)}_j} = \sum_{k} \frac{\partial E}{\partial z^{(2)}_k}\cdot\frac{\partial z^{(2)}_k}{\partial a^{(1)}_j} = \sum_{k} \delta^{L}_k\, w^{(2)}_{kj}"></div>

<div class="callout-blue">
  <strong>Откуда взялась дельта:</strong> выражение <code>∂E/∂z⁽²⁾ₖ</code> — это
  ровно то, что мы посчитали в части 4. Ничего нового считать не надо: предыдущий
  слой уже оставил готовый результат. Именно это делает бэкпроп быстрым.
</div>

### Интерактив 8 · шесть цепочек первого слоя в переменных

<div class="stage" id="stageFb" tabindex="0">
  <div class="stage-figure">
<svg id="fb" viewBox="0 0 1240 726" role="img" aria-label="Развилки и суммы ветвей при выводе градиентов первого слоя">
  <style>
    #fb { font-family: Helvetica, Arial, sans-serif; }
    #fb .edge { stroke: #B9B4A9; stroke-width: 1.6; fill: none; }
    #fb .bedge { stroke: #D3CFC5; stroke-width: 1.3; fill: none; stroke-dasharray: 4 4; }
    #fb .nd { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.6; }
    #fb .nl { font-size: 16px; fill: #111111; }
    #fb .wl { font-size: 13px; fill: #5E5850; }
    #fb .cap { font-size: 13px; fill: #8A8378; }
    #fb .he { stroke-width: 4.5; fill: none; stroke-linecap: round; }
    #fb .hr { fill: none; stroke-width: 3.5; }
    #fb .vbg { fill: #FFFFFF; stroke: none; }
    #fb .val { font-size: 13px; }
    #fb .note { font-size: 14px; }
    #fb .topo { stroke: #D3CFC5; stroke-width: 1.4; fill: none; }
    #fb .topl { font-size: 13px; fill: #8A8378; }
    #fb .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <g data-key="D1" data-only="1">
    <foreignObject x="20" y="8" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E \,/\, \partial W^{(1)} \;=\; ?"></div>
    </foreignObject>
  </g>
  <g data-key="D2" data-only="1">
    <foreignObject x="20" y="44" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E \,/\, \partial b^{(1)} \;=\; ?"></div>
    </foreignObject>
  </g>
  <g data-key="D3" data-only="1">
    <foreignObject x="20" y="80" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial z^{(1)}_j \,/\, \partial w^{(1)}_{ji} = x^{(0)}_i"></div>
    </foreignObject>
  </g>
  <g data-key="C1" data-only="1">
    <foreignObject x="920" y="8" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{L} = \partial E \,/\, \partial z^{(2)}"></div>
    </foreignObject>
  </g>
  <g data-key="B1" data-only="1">
    <foreignObject x="680" y="8" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial z^{(2)}_k \,/\, \partial a^{(1)}_j = w^{(2)}_{kj}"></div>
    </foreignObject>
  </g>
  <g data-key="A1" data-only="1">
    <foreignObject x="300" y="8" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial a^{(1)}_1 = \delta^{L}_1 w^{(2)}_{11} + \delta^{L}_2 w^{(2)}_{21}"></div>
    </foreignObject>
  </g>
  <g data-key="A2" data-only="1">
    <foreignObject x="300" y="44" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial a^{(1)}_2 = \delta^{L}_1 w^{(2)}_{12} + \delta^{L}_2 w^{(2)}_{22}"></div>
    </foreignObject>
  </g>
  <g data-key="A3" data-only="1">
    <foreignObject x="300" y="80" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{(1)}_j = \partial E / \partial a^{(1)}_j \cdot \sigma'\!\left(z^{(1)}_j\right)"></div>
    </foreignObject>
  </g>
  <g data-key="r11" data-only="1">
    <foreignObject x="20" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(1)}_{11} = \delta^{(1)}_1 x^{(0)}_1"></div>
    </foreignObject>
  </g>
  <g data-key="r12" data-only="1">
    <foreignObject x="425" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(1)}_{12} = \delta^{(1)}_1 x^{(0)}_2"></div>
    </foreignObject>
  </g>
  <g data-key="rb1" data-only="1">
    <foreignObject x="830" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial b^{(1)}_{1} = \delta^{(1)}_1"></div>
    </foreignObject>
  </g>
  <g data-key="r21" data-only="1">
    <foreignObject x="20" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(1)}_{21} = \delta^{(1)}_2 x^{(0)}_1"></div>
    </foreignObject>
  </g>
  <g data-key="r22" data-only="1">
    <foreignObject x="425" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(1)}_{22} = \delta^{(1)}_2 x^{(0)}_2"></div>
    </foreignObject>
  </g>
  <g data-key="rb2" data-only="1">
    <foreignObject x="830" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial b^{(1)}_{2} = \delta^{(1)}_2"></div>
    </foreignObject>
  </g>
  <line x1="120" y1="180" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="180" x2="340" y2="370" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="370" class="edge"/>
  <line x1="340" y1="180" x2="460" y2="180" class="edge"/>
  <line x1="340" y1="370" x2="460" y2="370" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="370" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="370" class="edge"/>
  <line x1="770" y1="180" x2="890" y2="180" class="edge"/>
  <line x1="770" y1="370" x2="890" y2="370" class="edge"/>
  <line x1="890" y1="180" x2="1050" y2="180" class="edge"/>
  <line x1="890" y1="370" x2="1050" y2="370" class="edge"/>
  <line x1="1050" y1="180" x2="1170" y2="275" class="edge"/>
  <line x1="1050" y1="370" x2="1170" y2="275" class="edge"/>
  <line x1="390" y1="470" x2="340" y2="180" class="bedge"/>
  <line x1="390" y1="470" x2="340" y2="370" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="180" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="370" class="bedge"/>
  <g data-key="allw" data-only="1">
    <line x1="120" y1="180" x2="340" y2="180" class="he" stroke="#C29E08"/>
    <line x1="120" y1="370" x2="340" y2="180" class="he" stroke="#C29E08"/>
    <line x1="120" y1="180" x2="340" y2="370" class="he" stroke="#C29E08"/>
    <line x1="120" y1="370" x2="340" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="pb" data-only="1">
    <line x1="390" y1="470" x2="340" y2="180" class="he" stroke="#C29E08"/>
    <line x1="390" y1="470" x2="340" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="out" data-only="1">
    <line x1="1050" y1="180" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="890" y1="180" x2="1050" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="770" y1="180" x2="890" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="1050" y1="370" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="890" y1="370" x2="1050" y2="370" class="he" stroke="#C30B0A"/>
    <line x1="770" y1="370" x2="890" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="fk1" data-only="1">
    <line x1="460" y1="180" x2="770" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="460" y1="180" x2="770" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="fk2" data-only="1">
    <line x1="460" y1="370" x2="770" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="460" y1="370" x2="770" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="tl1" data-only="1">
    <line x1="340" y1="180" x2="460" y2="180" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="tl2" data-only="1">
    <line x1="340" y1="370" x2="460" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="w11" data-only="1">
    <line x1="120" y1="180" x2="340" y2="180" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w12" data-only="1">
    <line x1="120" y1="370" x2="340" y2="180" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w21" data-only="1">
    <line x1="120" y1="180" x2="340" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w22" data-only="1">
    <line x1="120" y1="370" x2="340" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <circle cx="120" cy="180" r="27" class="nd"/>
  <text x="120" y="186" class="nl" text-anchor="middle">x₁⁽⁰⁾</text>
  <circle cx="120" cy="370" r="27" class="nd"/>
  <text x="120" y="376" class="nl" text-anchor="middle">x₂⁽⁰⁾</text>
  <circle cx="340" cy="180" r="27" class="nd"/>
  <text x="340" y="186" class="nl" text-anchor="middle">z₁⁽¹⁾</text>
  <circle cx="340" cy="370" r="27" class="nd"/>
  <text x="340" y="376" class="nl" text-anchor="middle">z₂⁽¹⁾</text>
  <circle cx="460" cy="180" r="27" class="nd"/>
  <text x="460" y="186" class="nl" text-anchor="middle">a₁⁽¹⁾</text>
  <circle cx="460" cy="370" r="27" class="nd"/>
  <text x="460" y="376" class="nl" text-anchor="middle">a₂⁽¹⁾</text>
  <circle cx="770" cy="180" r="27" class="nd"/>
  <text x="770" y="186" class="nl" text-anchor="middle">z₁⁽²⁾</text>
  <circle cx="770" cy="370" r="27" class="nd"/>
  <text x="770" y="376" class="nl" text-anchor="middle">z₂⁽²⁾</text>
  <circle cx="890" cy="180" r="27" class="nd"/>
  <text x="890" y="186" class="nl" text-anchor="middle">a₁⁽²⁾</text>
  <circle cx="890" cy="370" r="27" class="nd"/>
  <text x="890" y="376" class="nl" text-anchor="middle">a₂⁽²⁾</text>
  <circle cx="1050" cy="180" r="27" class="nd"/>
  <text x="1050" y="186" class="nl" text-anchor="middle">e₁⁽³⁾</text>
  <circle cx="1050" cy="370" r="27" class="nd"/>
  <text x="1050" y="376" class="nl" text-anchor="middle">e₂⁽³⁾</text>
  <circle cx="1170" cy="275" r="27" class="nd"/>
  <text x="1170" y="281" class="nl" text-anchor="middle">E</text>
  <circle cx="390" cy="470" r="22" class="nd"/>
  <text x="390" y="476" class="nl" text-anchor="middle">b⁽¹⁾</text>
  <circle cx="820" cy="470" r="22" class="nd"/>
  <text x="820" y="476" class="nl" text-anchor="middle">b⁽²⁾</text>
  <g data-key="out" data-only="1">
    <circle cx="1170" cy="275" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="1050" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="1050" cy="370" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="890" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="890" cy="370" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="770" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="770" cy="370" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="fk1" data-only="1">
    <circle cx="460" cy="180" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="fk2" data-only="1">
    <circle cx="460" cy="370" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="tl1" data-only="1">
    <circle cx="340" cy="180" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="tl2" data-only="1">
    <circle cx="340" cy="370" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="w11" data-only="1">
    <circle cx="120" cy="180" r="27" class="hr" stroke="#3576C0"/>
  </g>
  <g data-key="w12" data-only="1">
    <circle cx="120" cy="370" r="27" class="hr" stroke="#3576C0"/>
  </g>
  <g data-key="w21" data-only="1">
    <circle cx="120" cy="180" r="27" class="hr" stroke="#3576C0"/>
  </g>
  <g data-key="w22" data-only="1">
    <circle cx="120" cy="370" r="27" class="hr" stroke="#3576C0"/>
  </g>
  <g data-key="pb" data-only="1">
    <circle cx="390" cy="470" r="22" class="hr" stroke="#C29E08"/>
  </g>
  <g data-key="sum" data-only="1">
    <rect x="20" y="636" width="1200" height="34" rx="9" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
    <text x="620" y="659" class="note" text-anchor="middle" fill="#A30908">К первому слою сигнал приходит уже ослабленным: ветви частично гасят друг друга</text>
  </g>
  <text x="230" y="168" class="wl" text-anchor="middle">w₁₁⁽¹⁾</text>
  <text x="230" y="392" class="wl" text-anchor="middle">w₂₂⁽¹⁾</text>
  <text x="180" y="228" class="wl" text-anchor="middle">w₂₁⁽¹⁾</text>
  <text x="180" y="330" class="wl" text-anchor="middle">w₁₂⁽¹⁾</text>
  <text x="615" y="168" class="wl" text-anchor="middle">w₁₁⁽²⁾</text>
  <text x="615" y="392" class="wl" text-anchor="middle">w₂₂⁽²⁾</text>
  <text x="535" y="221" class="wl" text-anchor="middle">w₂₁⁽²⁾</text>
  <text x="535" y="337" class="wl" text-anchor="middle">w₁₂⁽²⁾</text>
  <text x="120" y="130" class="cap" text-anchor="middle">вход</text>
  <text x="340" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="460" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="770" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="890" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="1050" y="130" class="cap" text-anchor="middle">ошибка</text>
  <text x="1170" y="130" class="cap" text-anchor="middle">итог</text>
  <path d="M 20 510 L 20 516 L 290 516 L 290 510" class="topo"/>
  <text x="155" y="538" class="topl" text-anchor="middle">вход: 2 числа</text>
  <path d="M 300 510 L 300 516 L 660 516 L 660 510" class="topo"/>
  <text x="480" y="538" class="topl" text-anchor="middle">слой 1: 2 → 2 · W⁽¹⁾ 2×2, b⁽¹⁾ 2</text>
  <path d="M 680 510 L 680 516 L 910 516 L 910 510" class="topo"/>
  <text x="795" y="538" class="topl" text-anchor="middle">слой 2: 2 → 2 · W⁽²⁾ 2×2, b⁽²⁾ 2</text>
  <path d="M 920 510 L 920 516 L 1240 516 L 1240 510" class="topo"/>
  <text x="1080" y="538" class="topl" text-anchor="middle">потеря: MSE по двум выходам</text>
  <text x="20" y="704" class="legend">красный — обратный проход, сюда течёт градиент · жёлтый — параметр, по которому берём производную · синий — числа из кэша · внизу накапливаются готовые градиенты</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="D1 D2 allw pb" data-focus="allw pb">
      <div class="step-kicker">Шаг 1 · что ищем</div>
      <h4>Снова шесть параметров</h4>
      <p>Четыре веса и два смещения первого слоя. Устройство ответа будет тем же,
      что и раньше, но добраться до него сложнее.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 C1 B1 out fk1" data-focus="fk1">
      <div class="step-kicker">Шаг 2 · развилка</div>
      <h4>Один узел влияет на оба выхода</h4>
      <p>Всё, что меняет <code>a₁⁽¹⁾</code>, меняет и <code>z₁⁽²⁾</code>, и
      <code>z₂⁽²⁾</code>. Производная линейного узла по своему входу равна весу
      ребра, так что оба вклада читаются со схемы.</p>
      <div class="math-display" data-tex="\frac{\partial z^{(2)}_k}{\partial a^{(1)}_j} = w^{(2)}_{kj}"></div>
    </div>
    <div class="step-panel" data-on="D1 D2 C1 B1 A1 out fk1" data-focus="fk1">
      <div class="step-kicker">Шаг 3 · сумма для первого узла</div>
      <h4>Складываем вклады обеих ветвей</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial a^{(1)}_1} = \frac{\partial E}{\partial z^{(2)}_1}\frac{\partial z^{(2)}_1}{\partial a^{(1)}_1} + \frac{\partial E}{\partial z^{(2)}_2}\frac{\partial z^{(2)}_2}{\partial a^{(1)}_1} = \delta^{L}_1 w^{(2)}_{11} + \delta^{L}_2 w^{(2)}_{21}"></div>
      <p>Заметьте, какие именно веса вошли в сумму: первые индексы у них разные,
      второй — общий. Это столбец матрицы <code>W⁽²⁾</code>, и в части 6 отсюда
      появится транспонирование.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 C1 B1 A1 A2 out fk2" data-focus="fk2">
      <div class="step-kicker">Шаг 4 · сумма для второго узла</div>
      <h4>То же самое для второго скрытого узла</h4>
      <p>Устройство идентично, меняется только второй индекс весов. Обе суммы стоят
      рядом над колонкой активаций — их удобно сравнить: наборы весов не
      пересекаются.</p>
    </div>
    <div class="step-panel" data-on="C1 A1 A2 A3 fk1 fk2 tl1 tl2" data-focus="tl1 tl2">
      <div class="step-kicker">Шаг 5 · дельты первого слоя</div>
      <h4>Проходим активацию — и получаем ту же величину, что и раньше</h4>
      <div class="math-display" data-tex="\begin{pmatrix} \delta^{(1)}_1 \\ \delta^{(1)}_2 \end{pmatrix} = \begin{pmatrix} \partial E / \partial a^{(1)}_1 \\ \partial E / \partial a^{(1)}_2 \end{pmatrix} \odot \begin{pmatrix} \sigma'\!\left(z^{(1)}_1\right) \\ \sigma'\!\left(z^{(1)}_2\right) \end{pmatrix}"></div>
      <p>Определение то же, что и у <code>δᴸ</code>, просто слой другой. С этого
      момента первый слой ничем не отличается от последнего: у нас есть его дельты,
      а всё остальное было в части 3.</p>
    </div>
    <div class="step-panel" data-on="A1 A2 A3 D3 r11 r12 tl1 w11 w12" data-focus="w11 w12">
      <div class="step-kicker">Шаг 6 · параметры 1 и 2</div>
      <h4>Веса, ведущие в первый скрытый узел</h4>
      <p>Последний множитель — то, что вошло в ребро. Здесь это уже не активация
      предыдущего слоя, а сам вход сети: для первого слоя роль «предыдущих
      активаций» играют входные данные.</p>
    </div>
    <div class="step-panel" data-on="A1 A2 A3 D3 r11 r12 r21 r22 tl2 w21 w22" data-focus="w21 w22">
      <div class="step-kicker">Шаг 7 · параметры 3 и 4</div>
      <h4>Веса, ведущие во второй скрытый узел</h4>
      <p>Вторая дельта, те же два входа. Все четыре формулы снова имеют вид «дельта
      × вход» — структура не изменилась.</p>
    </div>
    <div class="step-panel" data-on="A3 D3 r11 r12 r21 r22 rb1 rb2 tl1 tl2 pb" data-focus="pb">
      <div class="step-kicker">Шаг 8 · параметры 5 и 6</div>
      <h4>Смещения — снова просто дельты</h4>
      <p>Ровно та же логика, что и на последнем слое: <code>∂z/∂b = 1</code>.</p>
    </div>
    <div class="step-panel" data-on="r11 r12 r21 r22 rb1 rb2 allw pb sum" data-focus="sum">
      <div class="step-kicker">Шаг 9 · сводка</div>
      <h4>Двенадцать градиентов сети выведены полностью</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(1)}} = \begin{pmatrix} \delta^{(1)}_1 x^{(0)}_1 &amp; \delta^{(1)}_1 x^{(0)}_2 \\ \delta^{(1)}_2 x^{(0)}_1 &amp; \delta^{(1)}_2 x^{(0)}_2 \end{pmatrix}"></div>
      <p>Шесть в части 3 и шесть здесь. Отличие первого слоя от последнего свелось к
      одной строке — к тому, как получена его дельта.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 9 · те же шесть цепочек в числах

<div class="stage" id="stageFbn" tabindex="0">
  <div class="stage-figure">
<svg id="fbn" viewBox="0 0 1240 726" role="img" aria-label="Те же выкладки первого слоя, посчитанные в числах">
  <style>
    #fbn { font-family: Helvetica, Arial, sans-serif; }
    #fbn .edge { stroke: #B9B4A9; stroke-width: 1.6; fill: none; }
    #fbn .bedge { stroke: #D3CFC5; stroke-width: 1.3; fill: none; stroke-dasharray: 4 4; }
    #fbn .nd { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.6; }
    #fbn .nl { font-size: 16px; fill: #111111; }
    #fbn .wl { font-size: 13px; fill: #5E5850; }
    #fbn .cap { font-size: 13px; fill: #8A8378; }
    #fbn .he { stroke-width: 4.5; fill: none; stroke-linecap: round; }
    #fbn .hr { fill: none; stroke-width: 3.5; }
    #fbn .vbg { fill: #FFFFFF; stroke: none; }
    #fbn .val { font-size: 13px; }
    #fbn .note { font-size: 14px; }
    #fbn .topo { stroke: #D3CFC5; stroke-width: 1.4; fill: none; }
    #fbn .topl { font-size: 13px; fill: #8A8378; }
    #fbn .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <g data-key="D1" data-only="1">
    <foreignObject x="20" y="8" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="x^{(0)} = \left(0.5,\; 0.8\right)"></div>
    </foreignObject>
  </g>
  <g data-key="D2" data-only="1">
    <foreignObject x="20" y="44" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\sigma'\!\left(z^{(1)}\right) = \left(0.2500,\; 0.2429\right)"></div>
    </foreignObject>
  </g>
  <g data-key="D3" data-only="1">
    <foreignObject x="20" y="80" width="270" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial z^{(1)}_j \,/\, \partial w^{(1)}_{ji} = x^{(0)}_i"></div>
    </foreignObject>
  </g>
  <g data-key="C1" data-only="1">
    <foreignObject x="920" y="8" width="320" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{L} = \left(-0.1166,\; 0.1477\right)"></div>
    </foreignObject>
  </g>
  <g data-key="B1" data-only="1">
    <foreignObject x="680" y="8" width="230" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="W^{(2)} = \begin{pmatrix} 0.50 &amp; -0.30 \\ 0.20 &amp; 0.60 \end{pmatrix}"></div>
    </foreignObject>
  </g>
  <g data-key="A1" data-only="1">
    <foreignObject x="300" y="8" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial a^{(1)}_1 = -0.0583 + 0.0295 = -0.0288"></div>
    </foreignObject>
  </g>
  <g data-key="A2" data-only="1">
    <foreignObject x="300" y="44" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial a^{(1)}_2 = 0.0350 + 0.0886 = 0.1236"></div>
    </foreignObject>
  </g>
  <g data-key="A3" data-only="1">
    <foreignObject x="300" y="80" width="360" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{(1)} = \left(-0.0072,\; 0.0300\right)"></div>
    </foreignObject>
  </g>
  <g data-key="r11" data-only="1">
    <foreignObject x="20" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(1)}_{11} = (-0.0072)(0.5) = -0.0036"></div>
    </foreignObject>
  </g>
  <g data-key="r12" data-only="1">
    <foreignObject x="425" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(1)}_{12} = (-0.0072)(0.8) = -0.0058"></div>
    </foreignObject>
  </g>
  <g data-key="rb1" data-only="1">
    <foreignObject x="830" y="560" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial b^{(1)}_{1} = -0.0072"></div>
    </foreignObject>
  </g>
  <g data-key="r21" data-only="1">
    <foreignObject x="20" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(1)}_{21} = (0.0300)(0.5) = 0.0150"></div>
    </foreignObject>
  </g>
  <g data-key="r22" data-only="1">
    <foreignObject x="425" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial w^{(1)}_{22} = (0.0300)(0.8) = 0.0240"></div>
    </foreignObject>
  </g>
  <g data-key="rb2" data-only="1">
    <foreignObject x="830" y="596" width="390" height="32">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\partial E / \partial b^{(1)}_{2} = 0.0300"></div>
    </foreignObject>
  </g>
  <line x1="120" y1="180" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="180" x2="340" y2="370" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="180" class="edge"/>
  <line x1="120" y1="370" x2="340" y2="370" class="edge"/>
  <line x1="340" y1="180" x2="460" y2="180" class="edge"/>
  <line x1="340" y1="370" x2="460" y2="370" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="180" x2="770" y2="370" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="180" class="edge"/>
  <line x1="460" y1="370" x2="770" y2="370" class="edge"/>
  <line x1="770" y1="180" x2="890" y2="180" class="edge"/>
  <line x1="770" y1="370" x2="890" y2="370" class="edge"/>
  <line x1="890" y1="180" x2="1050" y2="180" class="edge"/>
  <line x1="890" y1="370" x2="1050" y2="370" class="edge"/>
  <line x1="1050" y1="180" x2="1170" y2="275" class="edge"/>
  <line x1="1050" y1="370" x2="1170" y2="275" class="edge"/>
  <line x1="390" y1="470" x2="340" y2="180" class="bedge"/>
  <line x1="390" y1="470" x2="340" y2="370" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="180" class="bedge"/>
  <line x1="820" y1="470" x2="770" y2="370" class="bedge"/>
  <g data-key="allw" data-only="1">
    <line x1="120" y1="180" x2="340" y2="180" class="he" stroke="#C29E08"/>
    <line x1="120" y1="370" x2="340" y2="180" class="he" stroke="#C29E08"/>
    <line x1="120" y1="180" x2="340" y2="370" class="he" stroke="#C29E08"/>
    <line x1="120" y1="370" x2="340" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="pb" data-only="1">
    <line x1="390" y1="470" x2="340" y2="180" class="he" stroke="#C29E08"/>
    <line x1="390" y1="470" x2="340" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="out" data-only="1">
    <line x1="1050" y1="180" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="890" y1="180" x2="1050" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="770" y1="180" x2="890" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="1050" y1="370" x2="1170" y2="275" class="he" stroke="#C30B0A"/>
    <line x1="890" y1="370" x2="1050" y2="370" class="he" stroke="#C30B0A"/>
    <line x1="770" y1="370" x2="890" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="fk1" data-only="1">
    <line x1="460" y1="180" x2="770" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="460" y1="180" x2="770" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="fk2" data-only="1">
    <line x1="460" y1="370" x2="770" y2="180" class="he" stroke="#C30B0A"/>
    <line x1="460" y1="370" x2="770" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="tl1" data-only="1">
    <line x1="340" y1="180" x2="460" y2="180" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="tl2" data-only="1">
    <line x1="340" y1="370" x2="460" y2="370" class="he" stroke="#C30B0A"/>
  </g>
  <g data-key="w11" data-only="1">
    <line x1="120" y1="180" x2="340" y2="180" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w12" data-only="1">
    <line x1="120" y1="370" x2="340" y2="180" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w21" data-only="1">
    <line x1="120" y1="180" x2="340" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <g data-key="w22" data-only="1">
    <line x1="120" y1="370" x2="340" y2="370" class="he" stroke="#C29E08"/>
  </g>
  <circle cx="120" cy="180" r="27" class="nd"/>
  <text x="120" y="186" class="nl" text-anchor="middle">x₁⁽⁰⁾</text>
  <circle cx="120" cy="370" r="27" class="nd"/>
  <text x="120" y="376" class="nl" text-anchor="middle">x₂⁽⁰⁾</text>
  <circle cx="340" cy="180" r="27" class="nd"/>
  <text x="340" y="186" class="nl" text-anchor="middle">z₁⁽¹⁾</text>
  <circle cx="340" cy="370" r="27" class="nd"/>
  <text x="340" y="376" class="nl" text-anchor="middle">z₂⁽¹⁾</text>
  <circle cx="460" cy="180" r="27" class="nd"/>
  <text x="460" y="186" class="nl" text-anchor="middle">a₁⁽¹⁾</text>
  <circle cx="460" cy="370" r="27" class="nd"/>
  <text x="460" y="376" class="nl" text-anchor="middle">a₂⁽¹⁾</text>
  <circle cx="770" cy="180" r="27" class="nd"/>
  <text x="770" y="186" class="nl" text-anchor="middle">z₁⁽²⁾</text>
  <circle cx="770" cy="370" r="27" class="nd"/>
  <text x="770" y="376" class="nl" text-anchor="middle">z₂⁽²⁾</text>
  <circle cx="890" cy="180" r="27" class="nd"/>
  <text x="890" y="186" class="nl" text-anchor="middle">a₁⁽²⁾</text>
  <circle cx="890" cy="370" r="27" class="nd"/>
  <text x="890" y="376" class="nl" text-anchor="middle">a₂⁽²⁾</text>
  <circle cx="1050" cy="180" r="27" class="nd"/>
  <text x="1050" y="186" class="nl" text-anchor="middle">e₁⁽³⁾</text>
  <circle cx="1050" cy="370" r="27" class="nd"/>
  <text x="1050" y="376" class="nl" text-anchor="middle">e₂⁽³⁾</text>
  <circle cx="1170" cy="275" r="27" class="nd"/>
  <text x="1170" y="281" class="nl" text-anchor="middle">E</text>
  <circle cx="390" cy="470" r="22" class="nd"/>
  <text x="390" y="476" class="nl" text-anchor="middle">b⁽¹⁾</text>
  <circle cx="820" cy="470" r="22" class="nd"/>
  <text x="820" y="476" class="nl" text-anchor="middle">b⁽²⁾</text>
  <g data-key="out" data-only="1">
    <circle cx="1170" cy="275" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="1050" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="1050" cy="370" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="890" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="890" cy="370" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="770" cy="180" r="27" class="hr" stroke="#C30B0A"/>
    <circle cx="770" cy="370" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="fk1" data-only="1">
    <circle cx="460" cy="180" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="fk2" data-only="1">
    <circle cx="460" cy="370" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="tl1" data-only="1">
    <circle cx="340" cy="180" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="tl2" data-only="1">
    <circle cx="340" cy="370" r="27" class="hr" stroke="#C30B0A"/>
  </g>
  <g data-key="w11" data-only="1">
    <circle cx="120" cy="180" r="27" class="hr" stroke="#3576C0"/>
    <rect x="94" y="214" width="52" height="20" class="vbg"/>
    <text x="120" y="228" class="val" text-anchor="middle" fill="#3576C0">0.5000</text>
  </g>
  <g data-key="w12" data-only="1">
    <circle cx="120" cy="370" r="27" class="hr" stroke="#3576C0"/>
    <rect x="94" y="404" width="52" height="20" class="vbg"/>
    <text x="120" y="418" class="val" text-anchor="middle" fill="#3576C0">0.8000</text>
  </g>
  <g data-key="w21" data-only="1">
    <circle cx="120" cy="180" r="27" class="hr" stroke="#3576C0"/>
    <rect x="94" y="214" width="52" height="20" class="vbg"/>
    <text x="120" y="228" class="val" text-anchor="middle" fill="#3576C0">0.5000</text>
  </g>
  <g data-key="w22" data-only="1">
    <circle cx="120" cy="370" r="27" class="hr" stroke="#3576C0"/>
    <rect x="94" y="404" width="52" height="20" class="vbg"/>
    <text x="120" y="418" class="val" text-anchor="middle" fill="#3576C0">0.8000</text>
  </g>
  <g data-key="pb" data-only="1">
    <circle cx="390" cy="470" r="22" class="hr" stroke="#C29E08"/>
  </g>
  <g data-key="sum" data-only="1">
    <rect x="20" y="636" width="1200" height="34" rx="9" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
    <text x="620" y="659" class="note" text-anchor="middle" fill="#A30908">К первому слою сигнал приходит уже ослабленным: ветви частично гасят друг друга</text>
  </g>
  <text x="230" y="168" class="wl" text-anchor="middle">w₁₁⁽¹⁾</text>
  <text x="230" y="392" class="wl" text-anchor="middle">w₂₂⁽¹⁾</text>
  <text x="180" y="228" class="wl" text-anchor="middle">w₂₁⁽¹⁾</text>
  <text x="180" y="330" class="wl" text-anchor="middle">w₁₂⁽¹⁾</text>
  <text x="615" y="168" class="wl" text-anchor="middle">w₁₁⁽²⁾</text>
  <text x="615" y="392" class="wl" text-anchor="middle">w₂₂⁽²⁾</text>
  <text x="535" y="221" class="wl" text-anchor="middle">w₂₁⁽²⁾</text>
  <text x="535" y="337" class="wl" text-anchor="middle">w₁₂⁽²⁾</text>
  <text x="120" y="130" class="cap" text-anchor="middle">вход</text>
  <text x="340" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="460" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="770" y="130" class="cap" text-anchor="middle">сумматор</text>
  <text x="890" y="130" class="cap" text-anchor="middle">активация</text>
  <text x="1050" y="130" class="cap" text-anchor="middle">ошибка</text>
  <text x="1170" y="130" class="cap" text-anchor="middle">итог</text>
  <path d="M 20 510 L 20 516 L 290 516 L 290 510" class="topo"/>
  <text x="155" y="538" class="topl" text-anchor="middle">вход: 2 числа</text>
  <path d="M 300 510 L 300 516 L 660 516 L 660 510" class="topo"/>
  <text x="480" y="538" class="topl" text-anchor="middle">слой 1: 2 → 2 · W⁽¹⁾ 2×2, b⁽¹⁾ 2</text>
  <path d="M 680 510 L 680 516 L 910 516 L 910 510" class="topo"/>
  <text x="795" y="538" class="topl" text-anchor="middle">слой 2: 2 → 2 · W⁽²⁾ 2×2, b⁽²⁾ 2</text>
  <path d="M 920 510 L 920 516 L 1240 516 L 1240 510" class="topo"/>
  <text x="1080" y="538" class="topl" text-anchor="middle">потеря: MSE по двум выходам</text>
  <text x="20" y="704" class="legend">красный — обратный проход, сюда течёт градиент · жёлтый — параметр, по которому берём производную · синий — числа из кэша · внизу накапливаются готовые градиенты</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="D1 D2 allw pb" data-focus="allw pb">
      <div class="step-kicker">Шаг 1 · что берём</div>
      <h4>Дельты следующего слоя плюс кэш</h4>
      <p>Дельты <code>δᴸ</code> уже посчитаны в части 3, вход и производные сигмоиды
      лежат в кэше. Матрица <code>W⁽²⁾</code> берётся в старом, необновлённом виде —
      веса меняются только после того, как посчитаны все градиенты.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 C1 B1 out fk1" data-focus="fk1">
      <div class="step-kicker">Шаг 2 · развилка</div>
      <h4>Два маршрута от одного узла</h4>
      <p>Первый выход тянет активацию вверх, второй — вниз. Сейчас посмотрим, что
      останется после сложения.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 C1 B1 A1 out fk1" data-focus="fk1">
      <div class="step-kicker">Шаг 3 · первая сумма</div>
      <h4>Ветви гасят друг друга</h4>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · сумма ветвей</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Вклад каждого маршрута</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">ветвь 1</div>
            <div class="math-display worked-trace-math" data-tex="(-0.1166)\cdot 0.50 = -0.0583"></div>
            <div class="worked-trace-note">первый выход просит поднять активацию</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">ветвь 2</div>
            <div class="math-display worked-trace-math" data-tex="(0.1477)\cdot 0.20 = +0.0295"></div>
            <div class="worked-trace-note">второй выход просит опустить</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">сумма</div>
            <div class="math-display worked-trace-math" data-tex="-0.0583 + 0.0295 = -0.0288"></div>
            <div class="worked-trace-note">побеждает первая ветвь, но с большим трудом</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> к первому слою
        сигнал приходит ослабленным не потому, что что-то потерялось, а потому, что
        требования выходов частично противоположны.</p>
      </div>
    </div>
    <div class="step-panel" data-on="D1 D2 C1 B1 A1 A2 out fk2" data-focus="fk2">
      <div class="step-kicker">Шаг 4 · вторая сумма</div>
      <h4>Здесь, наоборот, вклады складываются</h4>
      <p>0.0350 и 0.0886 — оба положительные, потому что второй столбец
      <code>W⁽²⁾</code> имеет другое сочетание знаков. Итог 0.1236, вчетверо больше
      первой суммы: обе стоят рядом над колонкой активаций, разницу видно сразу.</p>
    </div>
    <div class="step-panel" data-on="C1 A1 A2 A3 fk1 fk2 tl1 tl2" data-focus="tl1 tl2">
      <div class="step-kicker">Шаг 5 · дельты первого слоя</div>
      <h4>Производная сигмоиды режет обе величины вчетверо</h4>
      <p>0.2500 и 0.2429 — оба множителя почти в максимуме, и всё равно сигнал
      уменьшился в четыре раза. Это не сбой, а свойство сигмоиды.</p>
    </div>
    <div class="step-panel" data-on="A1 A2 A3 D3 r11 r12 tl1 w11 w12" data-focus="w11 w12">
      <div class="step-kicker">Шаг 6 · параметры 1 и 2</div>
      <h4>−0.0036 и −0.0058</h4>
      <p>Отношение этих двух чисел равно ровно 1.6 — то есть отношению входов 0.8 к
      0.5. Дельта у них общая, поэтому различает их только вход.</p>
    </div>
    <div class="step-panel" data-on="A1 A2 A3 D3 r11 r12 r21 r22 tl2 w21 w22" data-focus="w21 w22">
      <div class="step-kicker">Шаг 7 · параметры 3 и 4</div>
      <h4>0.0150 и 0.0240</h4>
      <p>То же отношение 1.6 и другой знак: вторая дельта положительна. Обе строки
      матрицы градиентов пропорциональны одному и тому же вектору входов.</p>
    </div>
    <div class="step-panel" data-on="A3 D3 r11 r12 r21 r22 rb1 rb2 tl1 tl2 pb" data-focus="pb">
      <div class="step-kicker">Шаг 8 · параметры 5 и 6</div>
      <h4>−0.0072 и 0.0300</h4>
      <p>Градиенты смещений заметно крупнее градиентов весов этого слоя — просто
      потому, что входы меньше единицы и уменьшают произведение, а у смещения
      множитель равен единице.</p>
    </div>
    <div class="step-panel" data-on="r11 r12 r21 r22 rb1 rb2 allw pb sum" data-focus="sum">
      <div class="step-kicker">Шаг 9 · сводка и сравнение слоёв</div>
      <h4>Сигнал упал в шесть раз на одном слое</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(1)}} = \begin{pmatrix} -0.0036 &amp; -0.0058 \\ 0.0150 &amp; 0.0240 \end{pmatrix}, \qquad \left\|\delta^{L}\right\| = 0.1882 \;\to\; \left\|\delta^{(1)}\right\| = 0.0309"></div>
      <p>Часть потери — из-за гашения ветвей, часть — из-за множителя
      <code>σ'</code>, который не бывает больше 0.25. Это первый намёк на затухающий
      градиент.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> глубина не добавляет новых правил, она
  добавляет только суммирование по ветвям. Как только сумма посчитана и превращена
  в дельту, слой обрабатывается точно так же, как последний.
</div>

---

## Часть 6. Компактная запись первого слоя и транспонирование

<p>
  Осталось перевести на матричный язык вторую половину вывода — ту, где мы
  складывали ветви. Как и в части 4, результат будет тем же самым, просто
  записанным целиком.
</p>

<p>
  Посмотрите на индексы в двух суммах, полученных в части 5. Чтобы собрать вклад
  для узла <code>j</code> предыдущего слоя, нужны веса <code>w⁽²⁾ₖⱼ</code> при
  всех <code>k</code> — то есть <em>столбец</em> <code>j</code> матрицы
  <code>W</code>. Матричное умножение читает строки, а не столбцы, поэтому матрицу
  приходится транспонировать.
</p>

<div class="math-display" data-tex="\frac{\partial E}{\partial a^{(\ell-1)}} = \left(W^{(\ell)}\right)^{\!\top} \delta^{(\ell)}"></div>

<div class="callout-blue">
  <strong>Вот и весь секрет транспонирования:</strong> вперёд матрица
  <code>W</code> раздаёт активации по узлам следующего слоя, назад та же матрица
  собирает вклады обратно. Читать её приходится в другую сторону — отсюда
  <code>Wᵀ</code>, а не какая-то новая матрица. В общем виде это якобиан линейного
  слоя, и он равен самой матрице.
</div>

<p>
  Как и в предыдущей компактной сцене, справа вверху стоит уменьшенная схема
  сети: жёлтым отмечен слой, градиенты которого мы выводим, красным — рёбра, по
  которым к нему приходит сигнал ошибки.
</p>

### Интерактив 10 · суммы по ветвям превращаются в Wᵀ

<div class="stage" id="stageMx2" tabindex="0">
  <div class="stage-figure">
<svg id="mx2" viewBox="0 0 960 670" role="img" aria-label="Суммы по ветвям превращаются в умножение на транспонированную матрицу весов">
  <style>
    #mx2 { font-family: Helvetica, Arial, sans-serif; }
    #mx2 .cap { font-size: 14px; fill: #5E5850; }
    #mx2 .note { font-size: 14px; }
    #mx2 .mini { font-size: 12px; fill: #8A8378; }
    #mx2 .mmn { fill: #FFFFFF; stroke: #B9B4A9; stroke-width: 1.4; }
    #mx2 .mme { stroke: #D3CFC5; stroke-width: 1.3; fill: none; }
    #mx2 .mmy { stroke: #C29E08; stroke-width: 3; fill: none; stroke-linecap: round; }
    #mx2 .mmr { stroke: #C30B0A; stroke-width: 3; fill: none; stroke-linecap: round; }
    #mx2 .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #mx2 .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #mx2 .bb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mx2 .legend { font-size: 13px; fill: #8A8378; }
  </style>

  <text x="33" y="32" class="cap">Две суммы по ветвям — по одной на каждый скрытый узел</text>

  <line x1="650" y1="62" x2="730" y2="62" class="mmy"/>
  <line x1="650" y1="62" x2="730" y2="112" class="mmy"/>
  <line x1="650" y1="112" x2="730" y2="62" class="mmy"/>
  <line x1="650" y1="112" x2="730" y2="112" class="mmy"/>
  <line x1="730" y1="62" x2="810" y2="62" class="mmr"/>
  <line x1="730" y1="62" x2="810" y2="112" class="mmr"/>
  <line x1="730" y1="112" x2="810" y2="62" class="mmr"/>
  <line x1="730" y1="112" x2="810" y2="112" class="mmr"/>
  <line x1="810" y1="62" x2="890" y2="87" class="mmr"/>
  <line x1="810" y1="112" x2="890" y2="87" class="mmr"/>
  <circle cx="650" cy="62" r="11" class="mmn"/>
  <circle cx="650" cy="112" r="11" class="mmn"/>
  <circle cx="730" cy="62" r="11" class="mmn"/>
  <circle cx="730" cy="112" r="11" class="mmn"/>
  <circle cx="810" cy="62" r="11" class="mmn"/>
  <circle cx="810" cy="112" r="11" class="mmn"/>
  <circle cx="890" cy="87" r="11" class="mmn"/>
  <text x="650" y="42" class="mini" text-anchor="middle">x⁽⁰⁾</text>
  <text x="730" y="42" class="mini" text-anchor="middle">a⁽¹⁾</text>
  <text x="810" y="42" class="mini" text-anchor="middle">a⁽²⁾</text>
  <text x="890" y="42" class="mini" text-anchor="middle">E</text>
  <text x="770" y="142" class="mini" text-anchor="middle">ищем жёлтый слой, сигнал приходит по красным рёбрам</text>

  <g data-key="eqs" data-only="1">
    <foreignObject x="33" y="44" width="560" height="44">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial a^{(1)}_1} = \delta^{L}_1 \textcolor{#3576C0}{w^{(2)}_{11}} + \delta^{L}_2 \textcolor{#3576C0}{w^{(2)}_{21}}"></div>
    </foreignObject>
    <foreignObject x="33" y="90" width="560" height="44">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial a^{(1)}_2} = \delta^{L}_1 \textcolor{#3576C0}{w^{(2)}_{12}} + \delta^{L}_2 \textcolor{#3576C0}{w^{(2)}_{22}}"></div>
    </foreignObject>
  </g>

  <g data-key="col" data-only="1">
    <text x="33" y="172" class="note" fill="#2A5E9B">В строке собрались веса с общим вторым индексом — это столбец матрицы W⁽²⁾, а не её строка</text>
  </g>

  <g data-key="trn" data-only="1">
    <rect x="33" y="186" width="890" height="86" rx="12" class="br"/>
    <foreignObject x="45" y="198" width="866" height="64">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial a^{(1)}} = \begin{pmatrix} w^{(2)}_{11} &amp; w^{(2)}_{21} \\ w^{(2)}_{12} &amp; w^{(2)}_{22} \end{pmatrix}\begin{pmatrix} \delta^{L}_1 \\ \delta^{L}_2 \end{pmatrix} = \left(W^{(2)}\right)^{\!\top} \delta^{L}"></div>
    </foreignObject>
  </g>

  <g data-key="dlt" data-only="1">
    <rect x="33" y="288" width="890" height="70" rx="12" class="br"/>
    <foreignObject x="45" y="298" width="866" height="50">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{(1)} = \left(\left(W^{(2)}\right)^{\!\top} \delta^{L}\right) \odot \sigma'\!\left(z^{(1)}\right)"></div>
    </foreignObject>
  </g>

  <g data-key="gw" data-only="1">
    <rect x="33" y="374" width="890" height="86" rx="12" class="by"/>
    <foreignObject x="45" y="386" width="866" height="64">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial W^{(1)}} = \delta^{(1)}\left(x^{(0)}\right)^{\!\top} = \begin{pmatrix} \delta^{(1)}_1 \\ \delta^{(1)}_2 \end{pmatrix}\begin{pmatrix} x^{(0)}_1 &amp; x^{(0)}_2 \end{pmatrix}"></div>
    </foreignObject>
  </g>

  <g data-key="gb" data-only="1">
    <rect x="33" y="476" width="890" height="60" rx="12" class="by"/>
    <foreignObject x="45" y="486" width="866" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial b^{(1)}} = \delta^{(1)}"></div>
    </foreignObject>
  </g>

  <g data-key="num" data-only="1">
    <rect x="33" y="552" width="890" height="80" rx="12" class="bb"/>
    <foreignObject x="45" y="560" width="866" height="64">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial W^{(1)}} = \begin{pmatrix} -0.0072 \\ 0.0300 \end{pmatrix}\begin{pmatrix} 0.5 &amp; 0.8 \end{pmatrix} = \begin{pmatrix} -0.0036 &amp; -0.0058 \\ 0.0150 &amp; 0.0240 \end{pmatrix}"></div>
    </foreignObject>
  </g>

  <text x="33" y="654" class="legend">красный — сигнал ошибки, идущий назад · жёлтый — параметры и их градиенты · синий — числа сквозного примера</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="eqs" data-focus="eqs">
      <div class="step-kicker">Шаг 1 · что есть</div>
      <h4>Две суммы, по одной на скрытый узел</h4>
      <p>Это дословный результат части 5. В каждой сумме — обе дельты следующего
      слоя, но веса разные.</p>
    </div>
    <div class="step-panel" data-on="eqs col" data-focus="col">
      <div class="step-kicker">Шаг 2 · смотрим на индексы</div>
      <h4>В строке собрались веса с общим вторым индексом</h4>
      <p>В первой строке это <code>w₁₁</code> и <code>w₂₁</code>, во второй —
      <code>w₁₂</code> и <code>w₂₂</code>. По второму индексу веса группируются в
      столбцы <code>W⁽²⁾</code>, а не в строки.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn" data-focus="trn">
      <div class="step-kicker">Шаг 3 · транспонирование</div>
      <h4>Столбцы становятся строками</h4>
      <p>Чтобы записать обе суммы одним умножением матрицы на вектор, матрицу
      нужно перевернуть. Никакого нового объекта не появилось — это те же восемь
      чисел, прочитанные в другом порядке.</p>
      <p>Проверка форм: <code>2×2</code> на <code>2×1</code> даёт <code>2×1</code>
      — вектор той же длины, что и активации предыдущего слоя.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn dlt" data-focus="dlt">
      <div class="step-kicker">Шаг 4 · дельта слоя</div>
      <h4>Рекурсия замкнулась</h4>
      <p>Полученный вектор домножаем поэлементно на производную активации — и
      получаем <code>δ⁽¹⁾</code>. Формула выражает дельту слоя через дельту
      следующего слоя: это и есть та рекурсия, ради которой всё затевалось.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn dlt gw" data-focus="gw">
      <div class="step-kicker">Шаг 5 · градиент весов</div>
      <h4>Дальше всё как в части 4</h4>
      <p>Внешнее произведение дельты слоя на его вход. Единственное отличие от
      последнего слоя: вместо активаций предыдущего слоя здесь стоит сам вход
      сети.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn dlt gw gb" data-focus="gb">
      <div class="step-kicker">Шаг 6 · градиент смещений</div>
      <h4>Опять просто дельта</h4>
      <p>Формула буквально та же, что и для последнего слоя. Никаких «особых
      случаев» для первого слоя в алгоритме нет.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn dlt gw gb num" data-focus="num">
      <div class="step-kicker">Шаг 7 · числа</div>
      <h4>Те же −0.0036, −0.0058, 0.0150, 0.0240</h4>
      <p>Матричная запись дала ровно те четыре числа, которые в части 5 мы
      получили по одному. Это и есть проверка: два маршрута, один результат.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> сумма по ветвям — это умножение на
  транспонированную матрицу весов. После него слой ничем не отличается от
  выходного: поэлементно на <code>σ'</code>, затем внешнее произведение.
</div>

---

## Часть 7. Обратный проход одним конвейером

<p>
  Теперь соберём обе части вместе. Обратный проход распадается на два действия,
  которые повторяются на каждом слое: сначала пересчитать дельту, потом превратить
  её в градиенты параметров. Между слоями передаётся ровно один вектор.
</p>

### Интерактив 11 · весь обратный проход одним конвейером

<div class="stage" id="stageBw" tabindex="0">
  <div class="stage-figure">
<svg id="bw" viewBox="0 0 960 560" role="img" aria-label="Конвейер обратного прохода: от ошибки к дельтам и градиентам обоих слоёв">
  <style>
    #bw { font-family: Helvetica, Arial, sans-serif; }
    #bw .lab { font-size: 14px; fill: #5E5850; }
    #bw .bb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #bw .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #bw .bg { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #bw .by { fill: #F7F5F1; stroke: #5E5850; stroke-width: 1.6; }
    #bw .bf { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #bw .ar { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #bw .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="bw-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="ch" data-only="1">
    <rect x="33" y="26" width="890" height="54" rx="12" class="bf"/>
    <text x="47" y="58" class="lab" fill="#5A8C1C">После прямого прохода сохранены:</text>
    <foreignObject x="380" y="36" width="530" height="36">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="x^{(0)},\; z^{(1)},\; a^{(1)},\; z^{(2)},\; a^{(2)},\; W^{(1)},\; W^{(2)}"></div>
    </foreignObject>
  </g>

  <g data-key="r1" data-only="1">
    <line x1="248" y1="82" x2="248" y2="98" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="33" y="100" width="430" height="64" rx="12" class="br"/>
    <foreignObject x="45" y="112" width="406" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\frac{\partial E}{\partial a^{(2)}} = a^{(2)} - y"></div>
    </foreignObject>
  </g>

  <g data-key="r1n" data-only="1">
    <line x1="465" y1="132" x2="488" y2="132" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="490" y="100" width="433" height="64" rx="12" class="bb"/>
    <foreignObject x="502" y="112" width="409" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="= \left(-0.4684,\; 0.6459\right)"></div>
    </foreignObject>
  </g>

  <g data-key="r2" data-only="1">
    <line x1="248" y1="166" x2="248" y2="184" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="33" y="186" width="430" height="64" rx="12" class="br"/>
    <foreignObject x="45" y="198" width="406" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{(2)} = \frac{\partial E}{\partial a^{(2)}} \odot \sigma'\!\left(z^{(2)}\right) = \left(-0.1166,\; 0.1477\right)"></div>
    </foreignObject>
  </g>

  <g data-key="r2g" data-only="1">
    <line x1="465" y1="218" x2="488" y2="218" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="490" y="186" width="433" height="64" rx="12" class="bg"/>
    <foreignObject x="502" y="198" width="409" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial W^{(2)}} = \delta^{(2)}\left(a^{(1)}\right)^{\!\top}, \;\; \frac{\partial E}{\partial b^{(2)}} = \delta^{(2)}"></div>
    </foreignObject>
  </g>

  <g data-key="r3" data-only="1">
    <line x1="248" y1="252" x2="248" y2="270" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="33" y="272" width="430" height="64" rx="12" class="br"/>
    <foreignObject x="45" y="284" width="406" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\frac{\partial E}{\partial a^{(1)}} = \left(W^{(2)}\right)^{\!\top} \delta^{(2)}"></div>
    </foreignObject>
  </g>

  <g data-key="r3n" data-only="1">
    <line x1="465" y1="304" x2="488" y2="304" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="490" y="272" width="433" height="64" rx="12" class="bb"/>
    <foreignObject x="502" y="284" width="409" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="= \left(-0.0288,\; 0.1236\right)"></div>
    </foreignObject>
  </g>

  <g data-key="r4" data-only="1">
    <line x1="248" y1="338" x2="248" y2="356" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="33" y="358" width="430" height="64" rx="12" class="br"/>
    <foreignObject x="45" y="370" width="406" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{(1)} = \frac{\partial E}{\partial a^{(1)}} \odot \sigma'\!\left(z^{(1)}\right) = \left(-0.0072,\; 0.0300\right)"></div>
    </foreignObject>
  </g>

  <g data-key="r4g" data-only="1">
    <line x1="465" y1="390" x2="488" y2="390" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="490" y="358" width="433" height="64" rx="12" class="bg"/>
    <foreignObject x="502" y="370" width="409" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial W^{(1)}} = \delta^{(1)}\left(x^{(0)}\right)^{\!\top}, \;\; \frac{\partial E}{\partial b^{(1)}} = \delta^{(1)}"></div>
    </foreignObject>
  </g>

  <g data-key="lp" data-only="1">
    <line x1="248" y1="424" x2="248" y2="442" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="33" y="444" width="890" height="64" rx="12" class="by"/>
    <foreignObject x="45" y="456" width="866" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\delta^{(\ell)} = \left(\left(W^{(\ell+1)}\right)^{\!\top}\delta^{(\ell+1)}\right) \odot \sigma'\!\left(z^{(\ell)}\right), \qquad \frac{\partial E}{\partial W^{(\ell)}} = \delta^{(\ell)}\left(a^{(\ell-1)}\right)^{\!\top}, \qquad \frac{\partial E}{\partial b^{(\ell)}} = \delta^{(\ell)}"></div>
    </foreignObject>
  </g>

  <text x="33" y="540" class="legend">зелёный — итог прямого прохода · красный — сигнал ошибки, текущий назад · жёлтый — готовые градиенты параметров · синий — числа</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="ch" data-focus="ch">
      <div class="step-kicker">Шаг 1 · что уже есть</div>
      <h4>Обратный проход начинается не с нуля</h4>
      <p>Всё, что понадобится, лежит в памяти после прямого прохода: входы,
      сумматоры, активации и сами матрицы весов. Сеть не считается заново — только
      комбинируется сохранённое.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n" data-focus="r1">
      <div class="step-kicker">Шаг 2 · точка входа</div>
      <h4>Единственное место, где важна функция потерь</h4>
      <p>Производная потери по выходу — стартовый импульс. Смените квадратичную
      ошибку на кросс-энтропию — изменится только эта строка, остальной конвейер не
      заметит разницы.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n r2" data-focus="r2">
      <div class="step-kicker">Шаг 3 · дельта последнего слоя</div>
      <h4>Проходим активацию поэлементно</h4>
      <p>Те же −0.1166 и 0.1477, что мы считали по одному в части 3. Здесь они
      получаются одной строкой.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n r2 r2g" data-focus="r2g">
      <div class="step-kicker">Шаг 4 · градиенты слоя</div>
      <h4>Дельта сразу даёт и веса, и смещения</h4>
      <p>Для весов — внешнее произведение на активации предыдущего слоя, для
      смещений — сама дельта. Шесть чисел за две операции.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n r2 r2g r3 r3n" data-focus="r3">
      <div class="step-kicker">Шаг 5 · передача назад</div>
      <h4>Та же матрица, прочитанная в другую сторону</h4>
      <p>Это матричная запись суммирования по ветвям. Результат —
      чувствительность ошибки к активациям предыдущего слоя, то есть входной
      сигнал для следующего витка.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n r2 r2g r3 r3n r4 r4g" data-focus="r4">
      <div class="step-kicker">Шаг 6 · виток повторяется</div>
      <h4>Первый слой обрабатывается теми же двумя строками</h4>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · во сколько раз ослаб сигнал</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Дельта второго слоя</span>
            <div class="math-display worked-math" data-tex="\left\|\delta^{(2)}\right\| = 0.1882"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Дельта первого слоя</span>
            <div class="math-display worked-math" data-tex="\left\|\delta^{(1)}\right\| = 0.0309"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> один слой
        уменьшил длину сигнала в шесть раз, хотя производная сигмоиды была близка к
        своему максимуму 0.25. Десять таких слоёв — и от градиента остаются
        миллионные доли.</p>
      </div>
    </div>
    <div class="step-panel" data-on="r2 r2g r4 r4g lp" data-focus="lp">
      <div class="step-kicker">Шаг 7 · общее правило</div>
      <h4>Три строки на любую глубину</h4>
      <p>Верхняя — рекурсия: как получить дельту слоя из дельты следующего. Две
      нижние — как превратить дельту в градиенты параметров. Больше в алгоритме
      ничего нет.</p>
      <p>Именно эти три строки и реализованы внутри любого фреймворка под именем
      обратного режима автоматического дифференцирования.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>


### Интерактив 12 · обратный проход в матричной форме

<p>
  Тот же экран, но теперь в клетках градиенты. Слева всё, что оставил прямой
  проход, справа — пять формул обратного прохода и пустые матрицы, которые
  заполняются по одной. Главное наблюдение: <strong>форма градиента всегда
  совпадает с формой параметра</strong>, иначе его просто некуда было бы вычитать
  при шаге спуска.
</p>

<div class="stage" id="stageMbw" tabindex="0">
  <div class="stage-figure">
<svg id="mbw" viewBox="0 0 1240 590" role="img" aria-label="Обратный проход в матричной форме">
  <style>
    #mbw { font-family: Helvetica, Arial, sans-serif; }
    #mbw .title { font-size: 15px; font-weight: 700; fill: #5E5850; }
    #mbw .colhd { font-size: 13px; fill: #8A8378; letter-spacing: 0.06em; }
    #mbw .lab { font-size: 13px; font-weight: 600; }
    #mbw .ct { font-size: 12px; font-weight: 600; }
    #mbw .shape { font-size: 12px; fill: #968F85; }
    #mbw .cell { stroke-width: 1.2; }
    #mbw .empty { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; stroke-dasharray: 3 2; }
    #mbw .qt { font-size: 12px; fill: #C9C2B8; }
    #mbw .div { stroke: #E5E1D8; stroke-width: 1.4; }
    #mbw .note { font-size: 14px; }
    #mbw .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <text x="40" y="34" class="title">Обратный проход: те же матрицы, но в них градиенты</text>
  <text x="250" y="72" class="colhd" text-anchor="middle">ЧТО УЖЕ ИЗВЕСТНО</text>
  <text x="870" y="72" class="colhd" text-anchor="middle">ОБРАТНЫЙ ПРОХОД</text>
  <line x1="520" y1="56" x2="520" y2="520" class="div"/>
  <g data-key="dat" data-only="1">
    <text x="148" y="131" class="lab" text-anchor="end" fill="#A1090A">a⁽²⁾ − y =</text>
    <rect x="160" y="100" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="187" y="117" class="ct" text-anchor="middle" fill="#A1090A">−0.4684</text>
    <rect x="160" y="126" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="187" y="143" class="ct" text-anchor="middle" fill="#A1090A">0.6459</text>
    <text x="187" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <text x="348" y="131" class="lab" text-anchor="end" fill="#4C8316">σ′(z⁽²⁾) =</text>
    <rect x="360" y="100" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="387" y="117" class="ct" text-anchor="middle" fill="#4C8316">0.2490</text>
    <rect x="360" y="126" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="387" y="143" class="ct" text-anchor="middle" fill="#4C8316">0.2287</text>
    <text x="387" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <text x="148" y="227" class="lab" text-anchor="end" fill="#4C8316">a⁽¹⁾ =</text>
    <rect x="160" y="196" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="187" y="213" class="ct" text-anchor="middle" fill="#4C8316">0.5037</text>
    <rect x="160" y="222" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="187" y="239" class="ct" text-anchor="middle" fill="#4C8316">0.5842</text>
    <text x="187" y="266" class="shape" text-anchor="middle">(2×1)</text>
    <text x="348" y="227" class="lab" text-anchor="end" fill="#4C8316">σ′(z⁽¹⁾) =</text>
    <rect x="360" y="196" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="387" y="213" class="ct" text-anchor="middle" fill="#4C8316">0.2500</text>
    <rect x="360" y="222" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="387" y="239" class="ct" text-anchor="middle" fill="#4C8316">0.2429</text>
    <text x="387" y="266" class="shape" text-anchor="middle">(2×1)</text>
    <text x="148" y="323" class="lab" text-anchor="end" fill="#2A5E9B">W⁽²⁾ =</text>
    <rect x="160" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="187" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">0.50</text>
    <rect x="214" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="241" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">−0.30</text>
    <rect x="160" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="187" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.20</text>
    <rect x="214" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="241" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.60</text>
    <text x="214" y="362" class="shape" text-anchor="middle">(2×2)</text>
    <text x="368" y="323" class="lab" text-anchor="end" fill="#5E5850">x⁽⁰⁾ =</text>
    <rect x="380" y="292" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="407" y="309" class="ct" text-anchor="middle" fill="#5E5850">0.5</text>
    <rect x="380" y="318" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="407" y="335" class="ct" text-anchor="middle" fill="#5E5850">0.8</text>
    <text x="407" y="362" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="96" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{(2)} = \left(a^{(2)} - y\right) \odot \sigma'\!\left(z^{(2)}\right)"></div>
    </foreignObject>
  <g data-key="b1e" data-only="1">
    <text x="968" y="127" class="lab" text-anchor="end" fill="#C9C2B8">δ⁽²⁾ =</text>
    <rect x="980" y="96" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="113" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="139" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="b1" data-only="1">
    <text x="968" y="127" class="lab" text-anchor="end" fill="#A1090A">δ⁽²⁾ =</text>
    <rect x="980" y="96" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="113" class="ct" text-anchor="middle" fill="#A1090A">−0.1166</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="139" class="ct" text-anchor="middle" fill="#A1090A">0.1477</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="184" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial W^{(2)}} = \delta^{(2)}\!\left(a^{(1)}\right)^{\!\top}\!\!, \;\; \frac{\partial E}{\partial b^{(2)}} = \delta^{(2)}"></div>
    </foreignObject>
  <g data-key="b2e" data-only="1">
    <rect x="980" y="184" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="201" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="184" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="201" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="210" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="227" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="210" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="227" class="qt" text-anchor="middle">?</text>
    <text x="1034" y="254" class="shape" text-anchor="middle">(2×2)</text>
    <rect x="1150" y="184" width="54" height="26" rx="2" class="empty"/>
    <text x="1177" y="201" class="qt" text-anchor="middle">?</text>
    <rect x="1150" y="210" width="54" height="26" rx="2" class="empty"/>
    <text x="1177" y="227" class="qt" text-anchor="middle">?</text>
    <text x="1177" y="254" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="b2" data-only="1">
    <rect x="980" y="184" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="201" class="ct" text-anchor="middle" fill="#A1090A">−0.0588</text>
    <rect x="1034" y="184" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1061" y="201" class="ct" text-anchor="middle" fill="#A1090A">−0.0681</text>
    <rect x="980" y="210" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="227" class="ct" text-anchor="middle" fill="#A1090A">0.0744</text>
    <rect x="1034" y="210" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1061" y="227" class="ct" text-anchor="middle" fill="#A1090A">0.0863</text>
    <text x="1034" y="254" class="shape" text-anchor="middle">(2×2)</text>
    <rect x="1150" y="184" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1177" y="201" class="ct" text-anchor="middle" fill="#A1090A">−0.1166</text>
    <rect x="1150" y="210" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1177" y="227" class="ct" text-anchor="middle" fill="#A1090A">0.1477</text>
    <text x="1177" y="254" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="272" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial a^{(1)}} = \left(W^{(2)}\right)^{\!\top}\delta^{(2)}"></div>
    </foreignObject>
  <g data-key="b3e" data-only="1">
    <text x="968" y="303" class="lab" text-anchor="end" fill="#C9C2B8">∂E/∂a⁽¹⁾ =</text>
    <rect x="980" y="272" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="289" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="315" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="342" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="b3" data-only="1">
    <text x="968" y="303" class="lab" text-anchor="end" fill="#A1090A">∂E/∂a⁽¹⁾ =</text>
    <rect x="980" y="272" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="289" class="ct" text-anchor="middle" fill="#A1090A">−0.0288</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="315" class="ct" text-anchor="middle" fill="#A1090A">0.1236</text>
    <text x="1007" y="342" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="360" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{(1)} = \frac{\partial E}{\partial a^{(1)}} \odot \sigma'\!\left(z^{(1)}\right)"></div>
    </foreignObject>
  <g data-key="b4e" data-only="1">
    <text x="968" y="391" class="lab" text-anchor="end" fill="#C9C2B8">δ⁽¹⁾ =</text>
    <rect x="980" y="360" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="377" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="403" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="430" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="b4" data-only="1">
    <text x="968" y="391" class="lab" text-anchor="end" fill="#A1090A">δ⁽¹⁾ =</text>
    <rect x="980" y="360" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="377" class="ct" text-anchor="middle" fill="#A1090A">−0.0072</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="403" class="ct" text-anchor="middle" fill="#A1090A">0.0300</text>
    <text x="1007" y="430" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="448" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial W^{(1)}} = \delta^{(1)}\!\left(x^{(0)}\right)^{\!\top}\!\!, \;\; \frac{\partial E}{\partial b^{(1)}} = \delta^{(1)}"></div>
    </foreignObject>
  <g data-key="b5e" data-only="1">
    <rect x="980" y="448" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="465" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="448" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="465" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="474" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="491" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="474" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="491" class="qt" text-anchor="middle">?</text>
    <text x="1034" y="518" class="shape" text-anchor="middle">(2×2)</text>
    <rect x="1150" y="448" width="54" height="26" rx="2" class="empty"/>
    <text x="1177" y="465" class="qt" text-anchor="middle">?</text>
    <rect x="1150" y="474" width="54" height="26" rx="2" class="empty"/>
    <text x="1177" y="491" class="qt" text-anchor="middle">?</text>
    <text x="1177" y="518" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="b5" data-only="1">
    <rect x="980" y="448" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="465" class="ct" text-anchor="middle" fill="#A1090A">−0.0036</text>
    <rect x="1034" y="448" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1061" y="465" class="ct" text-anchor="middle" fill="#A1090A">−0.0058</text>
    <rect x="980" y="474" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="491" class="ct" text-anchor="middle" fill="#A1090A">0.0150</text>
    <rect x="1034" y="474" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1061" y="491" class="ct" text-anchor="middle" fill="#A1090A">0.0240</text>
    <text x="1034" y="518" class="shape" text-anchor="middle">(2×2)</text>
    <rect x="1150" y="448" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1177" y="465" class="ct" text-anchor="middle" fill="#A1090A">−0.0072</text>
    <rect x="1150" y="474" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1177" y="491" class="ct" text-anchor="middle" fill="#A1090A">0.0300</text>
    <text x="1177" y="518" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="nb" data-only="1">
    <rect x="40" y="520" width="1160" height="34" rx="9" fill="#FDE6E6" stroke="#C30B0A" stroke-width="1.6"/>
    <text x="620" y="543" class="note" text-anchor="middle" fill="#A1090A">Форма градиента всегда совпадает с формой параметра — иначе его некуда было бы вычитать</text>
  </g>
  <text x="40" y="572" class="legend">красный — градиенты · зелёный — значения с прямого прохода · синий — веса · пунктир с «?» — то, что ещё не посчитано</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="dat b1e b2e b3e b4e b5e" data-focus="dat">
      <div class="step-kicker">Шаг 1 · что уже посчитано</div>
      <h4>Обратный проход не считает сеть заново</h4>
      <p>Слева всё, что оставил прямой проход: промах выхода, производные
      активаций, активации первого слоя и сам вход. Плюс матрица
      <code>W⁽²⁾</code> — её мы прочитаем в обратную сторону.</p>
      <p>Экспоненту второй раз считать не нужно: у сигмоиды производная
      выражается через саму функцию, а её значение уже лежит в кэше.</p>
      <div class="math-display" data-tex="\sigma'(s) = \sigma(s)\left(1 - \sigma(s)\right) \quad\Longrightarrow\quad \sigma'\!\left(z^{(\ell)}_i\right) = a^{(\ell)}_i\left(1 - a^{(\ell)}_i\right)"></div>
      <div class="worked-example">
        <div class="worked-label">Производные активаций · четыре умножения</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Всё берётся из сохранённых a⁽¹⁾ и a⁽²⁾</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">σ′(z₁⁽²⁾)</div>
            <div class="math-display worked-trace-math" data-tex="0.5316\cdot(1 - 0.5316) = 0.5316\cdot 0.4684 = 0.2490"></div>
            <div class="worked-trace-note">почти максимум: выход близок к 0.5</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">σ′(z₂⁽²⁾)</div>
            <div class="math-display worked-trace-math" data-tex="0.6459\cdot 0.3541 = 0.2287"></div>
            <div class="worked-trace-note">чуть меньше — узел дальше от середины</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">σ′(z₁⁽¹⁾)</div>
            <div class="math-display worked-trace-math" data-tex="0.5037\cdot 0.4963 = 0.2500"></div>
            <div class="worked-trace-note">ровно потолок сигмоиды</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">σ′(z₂⁽¹⁾)</div>
            <div class="math-display worked-trace-math" data-tex="0.5842\cdot 0.4158 = 0.2429"></div>
            <div class="worked-trace-note">и здесь тоже близко к потолку</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> все четыре
        множителя лежат между 0.23 и 0.25. Даже в таком благоприятном случае каждый
        слой режет сигнал вчетверо — это и есть корень затухания градиента.</p>
      </div>
    </div>
    <div class="step-panel" data-on="dat b1 b2e b3e b4e b5e" data-focus="b1">
      <div class="step-kicker">Шаг 2 · дельта последнего слоя</div>
      <h4>Поэлементное произведение двух столбцов</h4>
      <p>Значок <code>⊙</code> требует одинаковых форм:
      <code>(2×1) ⊙ (2×1) = (2×1)</code>. Матричное умножение здесь было бы
      ошибкой — компоненты не должны смешиваться.</p>
      <div class="math-display" data-tex="\delta^{(2)}_1 = (-0.4684)\cdot 0.2490 = -0.1166, \qquad \delta^{(2)}_2 = (0.6459)\cdot 0.2287 = 0.1477"></div>
      <p>Знак минус в первой клетке означает «поднимай выход», плюс во второй —
      «опускай». Это и есть единственный вектор, который слой передаёт соседу.</p>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3e b4e b5e" data-focus="b2">
      <div class="step-kicker">Шаг 3 · градиенты параметров слоя 2</div>
      <h4>Столбец на строку — это таблица умножения</h4>
      <p><code>(2×1) · (1×2) = (2×2)</code>: единица в середине схлопывается,
      наружу выходят обе размерности. Клетка <code>(i, j)</code> берёт
      <code>i</code>-е число из столбца и <code>j</code>-е из строки.</p>
      <div class="math-display" data-tex="\left(\frac{\partial E}{\partial W^{(2)}}\right)_{ij} = \delta^{(2)}_i\, a^{(1)}_j"></div>
      <div class="worked-example">
        <div class="worked-label">Четыре клетки по очереди</div>
        <div class="worked-trace">
          <div class="worked-trace-title">δ⁽²⁾ = (−0.1166, 0.1477), a⁽¹⁾ = (0.5037, 0.5842)</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">(1,1)</div>
            <div class="math-display worked-trace-math" data-tex="(-0.1166)\cdot 0.5037 = -0.0588"></div>
            <div class="worked-trace-note">первая дельта × первая активация</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">(1,2)</div>
            <div class="math-display worked-trace-math" data-tex="(-0.1166)\cdot 0.5842 = -0.0681"></div>
            <div class="worked-trace-note">та же дельта, вторая активация</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">(2,1)</div>
            <div class="math-display worked-trace-math" data-tex="(0.1477)\cdot 0.5037 = 0.0744"></div>
            <div class="worked-trace-note">вторая дельта, первая активация</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">(2,2)</div>
            <div class="math-display worked-trace-math" data-tex="(0.1477)\cdot 0.5842 = 0.0863"></div>
            <div class="worked-trace-note">самая крупная клетка слоя</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> знак всей
        строки задаёт дельта, а отношение внутри строки равно отношению активаций,
        0.5037 к 0.5842. Строки пропорциональны — у матрицы ранг 1.</p>
      </div>
      <p>Градиент смещения — та же дельта без изменений: <code>∂z/∂b = 1</code>,
      поэтому дополнительного умножения не требуется.</p>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3 b4e b5e" data-focus="b3">
      <div class="step-kicker">Шаг 4 · сигнал переходит на слой ниже</div>
      <h4>Сумма идёт по столбцу, а не по строке</h4>
      <p>Клетка <code>j</code> результата собирает вклады всех выходных узлов, но
      берёт из матрицы <em>столбец</em> <code>j</code>. Отсюда и транспонирование:
      никакой новой матрицы не появилось, те же четыре числа читаются в другом
      порядке.</p>
      <div class="math-display" data-tex="\left(\frac{\partial E}{\partial a^{(1)}}\right)_j = \sum_{k} w^{(2)}_{kj}\, \delta^{(2)}_k"></div>
      <div class="worked-example">
        <div class="worked-label">Два столбца W⁽²⁾ — две суммы</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Первый столбец (0.50, 0.20), второй (−0.30, 0.60)</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">узел 1</div>
            <div class="math-display worked-trace-math" data-tex="0.50\cdot(-0.1166) + 0.20\cdot(0.1477) = -0.0583 + 0.0295 = -0.0288"></div>
            <div class="worked-trace-note">ветви тянут в разные стороны и почти гасятся</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">узел 2</div>
            <div class="math-display worked-trace-math" data-tex="(-0.30)\cdot(-0.1166) + 0.60\cdot(0.1477) = 0.0350 + 0.0886 = 0.1236"></div>
            <div class="worked-trace-note">здесь оба вклада положительные</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> два скрытых
        узла получили сигналы, отличающиеся вчетверо, хотя дельты выходов были
        почти равны по модулю. Всё решило сочетание знаков в столбцах.</p>
      </div>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3 b4 b5e" data-focus="b4">
      <div class="step-kicker">Шаг 5 · дельта первого слоя</div>
      <h4>Строка в точности повторяет шаг 2</h4>
      <p>Что-то <code>(2×1)</code>, поэлементно на производную активации — и
      получается дельта. Разница только в том, откуда взялся первый множитель.</p>
      <div class="math-display" data-tex="\delta^{(1)}_1 = (-0.0288)\cdot 0.2500 = -0.0072, \qquad \delta^{(1)}_2 = (0.1236)\cdot 0.2429 = 0.0300"></div>
      <p>Длина этого вектора 0.0309 против 0.1882 у дельты второго слоя — сигнал
      просел вшестеро за один слой, при том что оба множителя <code>σ′</code> были
      почти в максимуме.</p>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3 b4 b5" data-focus="b5">
      <div class="step-kicker">Шаг 6 · градиенты параметров слоя 1</div>
      <h4>Та же строка, что и на шаге 3</h4>
      <p>Внешнее произведение дельты на вход слоя. Единственное отличие: вход
      первого слоя — это сам <code>x⁽⁰⁾ = (0.5, 0.8)</code>, а не активации
      предыдущего.</p>
      <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(1)}} = \begin{pmatrix} (-0.0072)(0.5) &amp; (-0.0072)(0.8) \\ (0.0300)(0.5) &amp; (0.0300)(0.8) \end{pmatrix} = \begin{pmatrix} -0.0036 &amp; -0.0058 \\ 0.0150 &amp; 0.0240 \end{pmatrix}"></div>
      <p>Отношение чисел внутри каждой строки равно 1.6 — то есть отношению входов
      0.8 к 0.5. Дельта у них общая, различает их только вход.</p>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3 b4 b5 nb" data-focus="nb">
      <div class="step-kicker">Шаг 7 · все двенадцать чисел</div>
      <h4>Градиент всегда той же формы, что параметр</h4>
      <table class="shape-table">
        <tr><th>Параметр</th><th>Формула клетки</th><th>Значение</th></tr>
        <tr><td><code>w₁₁⁽¹⁾, w₁₂⁽¹⁾</code></td><td><code>δ₁⁽¹⁾·x₁, δ₁⁽¹⁾·x₂</code></td><td>−0.0036, −0.0058</td></tr>
        <tr><td><code>w₂₁⁽¹⁾, w₂₂⁽¹⁾</code></td><td><code>δ₂⁽¹⁾·x₁, δ₂⁽¹⁾·x₂</code></td><td>0.0150, 0.0240</td></tr>
        <tr><td><code>b₁⁽¹⁾, b₂⁽¹⁾</code></td><td><code>δ₁⁽¹⁾, δ₂⁽¹⁾</code></td><td>−0.0072, 0.0300</td></tr>
        <tr><td><code>w₁₁⁽²⁾, w₁₂⁽²⁾</code></td><td><code>δ₁⁽²⁾·a₁⁽¹⁾, δ₁⁽²⁾·a₂⁽¹⁾</code></td><td>−0.0588, −0.0681</td></tr>
        <tr><td><code>w₂₁⁽²⁾, w₂₂⁽²⁾</code></td><td><code>δ₂⁽²⁾·a₁⁽¹⁾, δ₂⁽²⁾·a₂⁽¹⁾</code></td><td>0.0744, 0.0863</td></tr>
        <tr><td><code>b₁⁽²⁾, b₂⁽²⁾</code></td><td><code>δ₁⁽²⁾, δ₂⁽²⁾</code></td><td>−0.1166, 0.1477</td></tr>
      </table>
      <p>Если в коде градиент получился не той формы, что параметр, вы почти
      наверняка забыли транспонирование или перепутали порядок множителей во
      внешнем произведении. Сверка форм ловит обе ошибки до всякой отладки чисел.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-yellow">
  <strong>Как проверить себя:</strong> сдвиньте любой параметр на
  <code>h = 10⁻⁶</code> в обе стороны, дважды посчитайте прямой проход и возьмите
  <code>(E₊ − E₋) / 2h</code>. Для всех двенадцати чисел выше расхождение с
  аналитическим градиентом не превышает 5·10⁻¹¹ — так этот пример и был выверен.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обратный проход — цикл из двух действий на
  слой. Его стоимость того же порядка, что и один прямой проход, независимо от
  глубины сети и от числа параметров.
</div>

---

## Часть 8. Вычислительный граф: один путь вперёд и четыре пути назад

<p>
  До сих пор сеть была разобрана по узлам: восемь весов и четыре смещения, у
  каждого своя цепочка. Теперь свернём всю картину до шести прямоугольников —
  вход, два сумматора, две активации и ошибка. Это <strong>вычислительный
  граф</strong>: ровно та схема, по которой фреймворки и считают градиенты. На
  ней прямой проход — один путь слева направо, а весь бэкпроп — четыре маршрута
  от <code>E</code> назад к четырём параметрам.
</p>

<p>
  Разница с частями 2–7 не в математике, а в масштабе: там мы смотрели на
  отдельные числа <code>w⁽²⁾₂₁</code>, здесь каждый узел сразу вектор или
  матрица. Формулы от этого не меняются, только становятся короче.
</p>

<div class="callout-blue">
  <strong>Зачем ещё одна картинка:</strong> на карте нейронов легко потерять
  общую форму рассуждения за двенадцатью частными случаями. Граф из шести узлов
  держится в голове целиком — и по нему четыре градиента восстанавливаются за
  минуту, даже если конкретные индексы забылись.
</div>

### Интерактив 13 · прямой проход по вычислительному графу

<p>
  Схема разворачивается слева направо. Под каждым узлом стоит его значение на
  нашем примере, над узлом — формула, которая это значение произвела; ни то, ни
  другое дальше не стирается.
</p>

<div class="stage" id="stageCg" tabindex="0">
  <div class="stage-figure">
<svg id="cg" viewBox="0 0 1240 570" role="img" aria-label="Вычислительный граф прямого прохода: вход, два сумматора, две активации и ошибка">
  <style>
    #cg { font-family: Helvetica, Arial, sans-serif; }
    #cg .cap { font-size: 13px; fill: #8A8378; }
    #cg .nm { font-size: 17px; fill: #111111; }
    #cg .vl { font-size: 13px; fill: #2A5E9B; }
    #cg .op { font-size: 13px; fill: #8A8378; }
    #cg .nd { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #cg .nb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #cg .np { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #cg .ar { stroke: #5E5850; stroke-width: 1.7; fill: none; }
    #cg .pr { stroke: #C29E08; stroke-width: 1.6; fill: none; }
    #cg .br { stroke: #B9B4A9; stroke-width: 1.4; fill: none; }
    #cg .cb { fill: #F7F5F1; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 5 3; }
    #cg .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="cg-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="cg-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
  </defs>

  <text x="30" y="48" class="cap">Шесть узлов — весь прямой проход. Стрелка читается как «входит в».</text>

  <g data-key="px">
    <rect x="24" y="224" width="132" height="68" rx="12" class="nb"/>
    <text x="90" y="256" class="nm" text-anchor="middle">x⁽⁰⁾</text>
    <text x="90" y="278" class="vl" text-anchor="middle">(0.5, 0.8)</text>
    <text x="90" y="362" class="op" text-anchor="middle">вход примера</text>
  </g>

  <g data-key="py">
    <rect x="1086" y="88" width="108" height="48" rx="10" class="nb"/>
    <text x="1140" y="118" class="nm" text-anchor="middle">y = (1, 0)</text>
  </g>

  <g data-key="p1">
    <rect x="170" y="88" width="104" height="48" rx="10" class="np"/>
    <text x="222" y="118" class="nm" text-anchor="middle">W⁽¹⁾</text>
    <rect x="296" y="88" width="88" height="48" rx="10" class="np"/>
    <text x="340" y="118" class="nm" text-anchor="middle">b⁽¹⁾</text>
    <path d="M 222 136 L 276 218" class="pr" marker-end="url(#cg-arp)"/>
    <path d="M 340 136 L 322 218" class="pr" marker-end="url(#cg-arp)"/>
  </g>

  <g data-key="z1">
    <path d="M 156 258 L 228 258" class="ar" marker-end="url(#cg-arw)"/>
    <rect x="234" y="224" width="132" height="68" rx="12" class="nd"/>
    <text x="300" y="256" class="nm" text-anchor="middle">z⁽¹⁾</text>
    <text x="300" y="278" class="vl" text-anchor="middle">(0.0150, 0.3400)</text>
    <foreignObject x="195" y="300" width="210" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="z^{(1)} = W^{(1)}x^{(0)} + b^{(1)}"></div>
    </foreignObject>
    <text x="300" y="362" class="op" text-anchor="middle">линейная часть</text>
  </g>

  <g data-key="a1">
    <path d="M 366 258 L 438 258" class="ar" marker-end="url(#cg-arw)"/>
    <rect x="444" y="224" width="132" height="68" rx="12" class="nd"/>
    <text x="510" y="256" class="nm" text-anchor="middle">a⁽¹⁾</text>
    <text x="510" y="278" class="vl" text-anchor="middle">(0.5037, 0.5842)</text>
    <foreignObject x="405" y="300" width="210" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="a^{(1)} = \sigma\!\left(z^{(1)}\right)"></div>
    </foreignObject>
    <text x="510" y="362" class="op" text-anchor="middle">нелинейность</text>
  </g>

  <g data-key="p2">
    <rect x="590" y="88" width="104" height="48" rx="10" class="np"/>
    <text x="642" y="118" class="nm" text-anchor="middle">W⁽²⁾</text>
    <rect x="716" y="88" width="88" height="48" rx="10" class="np"/>
    <text x="760" y="118" class="nm" text-anchor="middle">b⁽²⁾</text>
    <path d="M 642 136 L 696 218" class="pr" marker-end="url(#cg-arp)"/>
    <path d="M 760 136 L 744 218" class="pr" marker-end="url(#cg-arp)"/>
  </g>

  <g data-key="z2">
    <path d="M 576 258 L 648 258" class="ar" marker-end="url(#cg-arw)"/>
    <rect x="654" y="224" width="132" height="68" rx="12" class="nd"/>
    <text x="720" y="256" class="nm" text-anchor="middle">z⁽²⁾</text>
    <text x="720" y="278" class="vl" text-anchor="middle">(0.1266, 0.6013)</text>
    <foreignObject x="615" y="300" width="210" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="z^{(2)} = W^{(2)}a^{(1)} + b^{(2)}"></div>
    </foreignObject>
    <text x="720" y="362" class="op" text-anchor="middle">линейная часть</text>
  </g>

  <g data-key="a2">
    <path d="M 786 258 L 858 258" class="ar" marker-end="url(#cg-arw)"/>
    <rect x="864" y="224" width="132" height="68" rx="12" class="nd"/>
    <text x="930" y="256" class="nm" text-anchor="middle">a⁽²⁾ = ŷ</text>
    <text x="930" y="278" class="vl" text-anchor="middle">(0.5316, 0.6459)</text>
    <foreignObject x="825" y="300" width="210" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="a^{(2)} = \sigma\!\left(z^{(2)}\right)"></div>
    </foreignObject>
    <text x="930" y="362" class="op" text-anchor="middle">предсказание</text>
  </g>

  <g data-key="er">
    <path d="M 996 258 L 1068 258" class="ar" marker-end="url(#cg-arw)"/>
    <path d="M 1140 136 L 1140 218" class="ar" marker-end="url(#cg-arw)"/>
    <rect x="1074" y="224" width="132" height="68" rx="12" class="nd"/>
    <text x="1140" y="256" class="nm" text-anchor="middle">E</text>
    <text x="1140" y="278" class="vl" text-anchor="middle">0.3183</text>
    <foreignObject x="1040" y="300" width="196" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="E = \tfrac{1}{2}\left\|a^{(2)} - y\right\|^{2}"></div>
    </foreignObject>
    <text x="1140" y="362" class="op" text-anchor="middle">цена ошибки</text>
  </g>

  <g data-key="comp" data-only="1">
    <path d="M 30 380 L 30 392 L 1204 392 L 1204 380" class="br"/>
    <foreignObject x="320" y="400" width="600" height="42">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="E = \tfrac{1}{2}\left\| \sigma\!\left(W^{(2)}\sigma\!\left(W^{(1)}x^{(0)} + b^{(1)}\right) + b^{(2)}\right) - y \right\|^{2}"></div>
    </foreignObject>
  </g>

  <g data-key="cache" data-only="1">
    <rect x="30" y="456" width="1174" height="62" rx="12" class="cb"/>
    <text x="46" y="493" class="cap" fill="#5A8C1C">В памяти до обратного прохода:</text>
    <foreignObject x="290" y="470" width="890" height="36">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="x^{(0)},\; z^{(1)},\; a^{(1)},\; z^{(2)},\; a^{(2)},\; W^{(1)},\; W^{(2)}"></div>
    </foreignObject>
  </g>

  <text x="30" y="548" class="legend">зелёный — что вычисляет прямой проход · жёлтый — параметры · синий — данные примера · под каждым узлом его значение</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="px py" data-focus="px">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>На графе всего два внешних числа</h4>
      <p>Вход <code>x⁽⁰⁾</code> входит слева, цель <code>y</code> — сверху справа,
      прямо в узел ошибки. Всё между ними сеть посчитает сама. Обратите внимание,
      куда именно приходит <code>y</code>: она участвует ровно в одной операции и
      потому появится ровно в одном множителе градиента.</p>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="x^{(0)} = \begin{pmatrix} x^{(0)}_1 \\ x^{(0)}_2 \end{pmatrix} = \begin{pmatrix} 0.5 \\ 0.8 \end{pmatrix}, \qquad y = \begin{pmatrix} y_1 \\ y_2 \end{pmatrix} = \begin{pmatrix} 1 \\ 0 \end{pmatrix}"></div>
        <div class="math-display" data-tex="i,\, j \in \{1, 2\} \;\; \text{— номера узлов слоя}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1" data-focus="z1">
      <div class="step-kicker">Шаг 2 · первый сумматор</div>
      <h4>Параметры входят в граф как отдельные узлы</h4>
      <p><code>W⁽¹⁾</code> и <code>b⁽¹⁾</code> нарисованы не подписями на стрелке, а
      полноценными входами <code>z⁽¹⁾</code> — именно поэтому по ним можно будет
      взять производную так же, как по любому другому входу.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · одна строка матричного умножения</div>
        <div class="worked-trace">
          <div class="worked-trace-title">W⁽¹⁾ = (0.15, −0.20; 0.40, 0.30), x⁽⁰⁾ = (0.5, 0.8), b⁽¹⁾ = (0.10, −0.10)</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">z⁽¹⁾₁</div>
            <div class="math-display worked-trace-math" data-tex="0.15\cdot 0.5 + (-0.20)\cdot 0.8 + 0.10 = 0.0150"></div>
            <div class="worked-trace-note">вход почти гасит сам себя</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">z⁽¹⁾₂</div>
            <div class="math-display worked-trace-math" data-tex="0.40\cdot 0.5 + 0.30\cdot 0.8 + (-0.10) = 0.3400"></div>
            <div class="worked-trace-note">оба слагаемых тянут в одну сторону</div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> узел
        <code>z⁽¹⁾</code> — это весь слой целиком, а не один нейрон. Два числа
        внутри него получились одной операцией.</p>
      </div>
          <div class="callout-blue">
        <strong>Матричная форма первого слоя:</strong>
        <div class="math-display" data-tex="\begin{pmatrix} z^{(1)}_1 \\ z^{(1)}_2 \end{pmatrix} = \begin{pmatrix} w^{(1)}_{11} &amp; w^{(1)}_{12} \\ w^{(1)}_{21} &amp; w^{(1)}_{22} \end{pmatrix}\begin{pmatrix} x^{(0)}_1 \\ x^{(0)}_2 \end{pmatrix} + \begin{pmatrix} b^{(1)}_1 \\ b^{(1)}_2 \end{pmatrix}"></div>
        <div class="math-display" data-tex="z^{(1)}_i = \sum_{j} w^{(1)}_{ij}\, x^{(0)}_j + b^{(1)}_i, \qquad w^{(1)}_{ij} : \; j \to i"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1" data-focus="a1">
      <div class="step-kicker">Шаг 3 · активация</div>
      <h4>Сигмоида — отдельный узел, а не деталь сумматора</h4>
      <p>Разрез из части 2 остался и здесь: <code>z</code> и <code>a</code> — разные
      узлы. На обратном пути между ними появится множитель <code>σ'</code>, и если
      их слепить в один прямоугольник, этот множитель просто негде будет
      поставить.</p>
      <p>У этого узла нет параметров — ни одна стрелка не входит в него сверху.
      Значит, назад через него сигнал проходит, но останавливаться здесь не на
      чем.</p>
          <div class="callout-blue">
        <strong>Матричная форма активации:</strong>
        <div class="math-display" data-tex="\begin{pmatrix} a^{(1)}_1 \\ a^{(1)}_2 \end{pmatrix} = \begin{pmatrix} \sigma\!\left(z^{(1)}_1\right) \\ \sigma\!\left(z^{(1)}_2\right) \end{pmatrix}, \qquad a^{(1)}_i = \sigma\!\left(z^{(1)}_i\right)"></div>
        <div class="math-display" data-tex="\sigma'\!\left(z^{(1)}_i\right) = a^{(1)}_i\left(1 - a^{(1)}_i\right)"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2" data-focus="z2">
      <div class="step-kicker">Шаг 4 · второй слой</div>
      <h4>Та же пара узлов, только вход другой</h4>
      <p>Формула над <code>z⁽²⁾</code> отличается от формулы над <code>z⁽¹⁾</code>
      ровно одним: вместо <code>x⁽⁰⁾</code> в неё входит <code>a⁽¹⁾</code>. Это и
      есть вся глубина сети — повторение одного блока с подстановкой предыдущего
      выхода.</p>
          <div class="callout-blue">
        <strong>Матричная форма второго слоя:</strong>
        <div class="math-display" data-tex="\begin{pmatrix} z^{(2)}_1 \\ z^{(2)}_2 \end{pmatrix} = \begin{pmatrix} w^{(2)}_{11} &amp; w^{(2)}_{12} \\ w^{(2)}_{21} &amp; w^{(2)}_{22} \end{pmatrix}\begin{pmatrix} a^{(1)}_1 \\ a^{(1)}_2 \end{pmatrix} + \begin{pmatrix} b^{(2)}_1 \\ b^{(2)}_2 \end{pmatrix}"></div>
        <div class="math-display" data-tex="z^{(2)}_i = \sum_{j} w^{(2)}_{ij}\, a^{(1)}_j + b^{(2)}_i"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2 a2" data-focus="a2">
      <div class="step-kicker">Шаг 5 · предсказание</div>
      <h4>Выход последней активации и есть ŷ</h4>
      <p>Никакого отдельного «слоя предсказания» нет: <code>a⁽²⁾</code> — обычная
      активация, которой просто не досталось следующего слоя. Цель (1, 0) стоит
      далеко: 0.5316 вместо единицы и 0.6459 вместо нуля.</p>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="\begin{pmatrix} a^{(2)}_1 \\ a^{(2)}_2 \end{pmatrix} = \begin{pmatrix} \sigma\!\left(z^{(2)}_1\right) \\ \sigma\!\left(z^{(2)}_2\right) \end{pmatrix}, \qquad a^{(2)}_i = \hat{y}_i = \sigma\!\left(z^{(2)}_i\right)"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2 a2 er" data-focus="er">
      <div class="step-kicker">Шаг 6 · цена</div>
      <h4>Ошибка — тоже узел графа</h4>
      <p>Здесь сходятся две стрелки: предсказание и цель. Всё, что дальше произойдёт
      на обратном пути, стартует именно отсюда, поэтому смена функции потерь
      затрагивает ровно один множитель — самый первый.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · во что обошёлся этот прямой проход</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Промахи по компонентам</span>
            <div class="math-display worked-math" data-tex="a^{(2)} - y = \left(-0.4684,\; 0.6459\right)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Суммарная цена</span>
            <div class="math-display worked-math" data-tex="E = 0.1097 + 0.2086 = 0.3183"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> второй выход
        промахнулся сильнее первого, и в общую цену он вносит почти вдвое больше.
        Это число — единственное, что бэкпропу нужно уменьшить.</p>
      </div>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="E = \tfrac{1}{2}\sum_i \left(a^{(2)}_i - y_i\right)^2 = \tfrac{1}{2}\left(a^{(2)}_1 - y_1\right)^2 + \tfrac{1}{2}\left(a^{(2)}_2 - y_2\right)^2"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2 a2 er comp" data-focus="comp">
      <div class="step-kicker">Шаг 7 · весь граф одной формулой</div>
      <h4>Сеть — это одна длинная композиция функций</h4>
      <p>Если подставить каждый узел в следующий, получится строка внизу. Смотреть
      на неё неудобно, зато сразу видно главное: <code>E</code> зависит от всех
      четырёх параметров, и зависит через вложенные скобки.</p>
      <p>Дифференцировать эту строку «в лоб» никто не станет — но именно ради неё и
      существует цепное правило: производную композиции берут по одному звену за
      раз, двигаясь по графу справа налево.</p>
          <div class="callout-blue">
        <strong>Та же композиция по индексам:</strong>
        <div class="math-display" data-tex="a^{(2)}_i = \sigma\!\left(\sum_k w^{(2)}_{ik}\, \sigma\!\left(\sum_j w^{(1)}_{kj} x^{(0)}_j + b^{(1)}_k\right) + b^{(2)}_i\right)"></div>
        <div class="math-display" data-tex="E = \tfrac{1}{2}\sum_i \left(a^{(2)}_i - y_i\right)^2"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2 a2 er cache" data-focus="cache">
      <div class="step-kicker">Шаг 8 · что остаётся в памяти</div>
      <h4>Прямой проход оставляет после себя кэш</h4>
      <p>Обратный проход не пересчитывает сеть — он комбинирует то, что уже
      посчитано. Поэтому все промежуточные узлы приходится держать в памяти до
      конца шага обучения.</p>
      <p>Отсюда и практическое следствие: память под обучение растёт с глубиной сети
      и размером батча, а не только с числом параметров.</p>
          <div class="callout-blue">
        <strong>Что лежит в кэше, по индексам:</strong>
        <div class="math-display" data-tex="x^{(0)}_j,\quad z^{(1)}_i,\; a^{(1)}_i,\quad z^{(2)}_i,\; a^{(2)}_i,\quad w^{(1)}_{ij},\; w^{(2)}_{ij}"></div>
        <div class="math-display" data-tex="W^{(\ell)} \in \mathbb{R}^{2\times 2}, \qquad b^{(\ell)},\, z^{(\ell)},\, a^{(\ell)} \in \mathbb{R}^{2}"></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 14 · четыре пути назад по тому же графу

<p>
  Карта не меняется — те же шесть узлов на тех же местах. Меняется направление
  чтения: теперь мы идём от <code>E</code> влево и на каждом участке пути
  выписываем производную. Красные стрелки внизу и есть множители цепного
  правила; формулы под схемой накапливаются и к концу дают все четыре градиента.
</p>

<div class="stage" id="stageGp" tabindex="0">
  <div class="stage-figure">
<svg id="gp" viewBox="0 0 1240 740" role="img" aria-label="Четыре пути обратного прохода по вычислительному графу">
  <style>
    #gp { font-family: Helvetica, Arial, sans-serif; }
    #gp .cap { font-size: 13px; fill: #8A8378; }
    #gp .nm { font-size: 17px; fill: #111111; }
    #gp .vl { font-size: 13px; fill: #2A5E9B; }
    #gp .nd { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #gp .nb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #gp .np { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #gp .ar { stroke: #B9B4A9; stroke-width: 1.5; fill: none; }
    #gp .pr { stroke: #DCC98A; stroke-width: 1.5; fill: none; }
    #gp .rd { stroke: #C30B0A; stroke-width: 2.4; fill: none; }
    #gp .rl { font-size: 13px; fill: #C30B0A; }
    #gp .dv { font-size: 13px; fill: #C30B0A; font-weight: 700; }
    #gp .halo { fill: none; stroke: #C30B0A; stroke-width: 2.6; stroke-dasharray: 5 3; }
    #gp .brk { stroke: #C30B0A; stroke-width: 1.6; fill: none; }
    #gp .fr { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.5; }
    #gp .fq { fill: #F7F5F1; stroke: #5E5850; stroke-width: 1.4; stroke-dasharray: 5 3; }
    #gp .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="gp-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#B9B4A9"/>
    </marker>
    <marker id="gp-arp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#DCC98A"/>
    </marker>
    <marker id="gp-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text x="30" y="48" class="cap">Тот же граф. Теперь читаем его справа налево: красная стрелка — производная одного участка пути.</text>

  <rect x="170" y="88" width="104" height="48" rx="10" class="np"/>
  <text x="222" y="118" class="nm" text-anchor="middle">W⁽¹⁾</text>
  <rect x="296" y="88" width="88" height="48" rx="10" class="np"/>
  <text x="340" y="118" class="nm" text-anchor="middle">b⁽¹⁾</text>
  <rect x="590" y="88" width="104" height="48" rx="10" class="np"/>
  <text x="642" y="118" class="nm" text-anchor="middle">W⁽²⁾</text>
  <rect x="716" y="88" width="88" height="48" rx="10" class="np"/>
  <text x="760" y="118" class="nm" text-anchor="middle">b⁽²⁾</text>
  <rect x="1086" y="88" width="108" height="48" rx="10" class="nb"/>
  <text x="1140" y="118" class="nm" text-anchor="middle">y = (1, 0)</text>

  <path d="M 222 136 L 276 218" class="pr" marker-end="url(#gp-arp)"/>
  <path d="M 340 136 L 322 218" class="pr" marker-end="url(#gp-arp)"/>
  <path d="M 642 136 L 696 218" class="pr" marker-end="url(#gp-arp)"/>
  <path d="M 760 136 L 744 218" class="pr" marker-end="url(#gp-arp)"/>
  <path d="M 1140 136 L 1140 218" class="ar" marker-end="url(#gp-arw)"/>

  <rect x="24" y="224" width="132" height="68" rx="12" class="nb"/>
  <text x="90" y="256" class="nm" text-anchor="middle">x⁽⁰⁾</text>
  <text x="90" y="278" class="vl" text-anchor="middle">(0.5, 0.8)</text>

  <rect x="234" y="224" width="132" height="68" rx="12" class="nd"/>
  <text x="300" y="256" class="nm" text-anchor="middle">z⁽¹⁾</text>
  <text x="300" y="278" class="vl" text-anchor="middle">(0.0150, 0.3400)</text>

  <rect x="444" y="224" width="132" height="68" rx="12" class="nd"/>
  <text x="510" y="256" class="nm" text-anchor="middle">a⁽¹⁾</text>
  <text x="510" y="278" class="vl" text-anchor="middle">(0.5037, 0.5842)</text>

  <rect x="654" y="224" width="132" height="68" rx="12" class="nd"/>
  <text x="720" y="256" class="nm" text-anchor="middle">z⁽²⁾</text>
  <text x="720" y="278" class="vl" text-anchor="middle">(0.1266, 0.6013)</text>

  <rect x="864" y="224" width="132" height="68" rx="12" class="nd"/>
  <text x="930" y="256" class="nm" text-anchor="middle">a⁽²⁾ = ŷ</text>
  <text x="930" y="278" class="vl" text-anchor="middle">(0.5316, 0.6459)</text>

  <rect x="1074" y="224" width="132" height="68" rx="12" class="nd"/>
  <text x="1140" y="256" class="nm" text-anchor="middle">E</text>
  <text x="1140" y="278" class="vl" text-anchor="middle">0.3183</text>

  <path d="M 156 258 L 228 258" class="ar" marker-end="url(#gp-arw)"/>
  <path d="M 366 258 L 438 258" class="ar" marker-end="url(#gp-arw)"/>
  <path d="M 576 258 L 648 258" class="ar" marker-end="url(#gp-arw)"/>
  <path d="M 786 258 L 858 258" class="ar" marker-end="url(#gp-arw)"/>
  <path d="M 996 258 L 1068 258" class="ar" marker-end="url(#gp-arw)"/>

  <g data-key="hW2" data-only="1"><rect x="584" y="82" width="116" height="60" rx="13" class="halo"/></g>
  <g data-key="hb2" data-only="1"><rect x="710" y="82" width="100" height="60" rx="13" class="halo"/></g>
  <g data-key="hW1" data-only="1"><rect x="164" y="82" width="116" height="60" rx="13" class="halo"/></g>
  <g data-key="hb1" data-only="1"><rect x="290" y="82" width="100" height="60" rx="13" class="halo"/></g>

  <g data-key="bw1" data-only="1">
    <path d="M 1140 292 L 1140 330 L 936 330 L 936 300" class="rd" marker-end="url(#gp-arr)"/>
    <foreignObject x="938" y="292" width="200" height="36">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial a^{(2)}} = a^{(2)} - y"></div>
    </foreignObject>
  </g>

  <g data-key="bw2" data-only="1">
    <path d="M 924 292 L 924 330 L 726 330 L 726 300" class="rd" marker-end="url(#gp-arr)"/>
    <foreignObject x="725" y="292" width="200" height="36">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial a^{(2)}}{\partial z^{(2)}} = \sigma'\!\left(z^{(2)}\right)"></div>
    </foreignObject>
  </g>

  <g data-key="bw3" data-only="1">
    <path d="M 714 292 L 714 330 L 516 330 L 516 300" class="rd" marker-end="url(#gp-arr)"/>
    <foreignObject x="515" y="292" width="200" height="36">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial z^{(2)}}{\partial a^{(1)}} = \left(W^{(2)}\right)^{\!\top}"></div>
    </foreignObject>
  </g>

  <g data-key="bw4" data-only="1">
    <path d="M 504 292 L 504 330 L 306 330 L 306 300" class="rd" marker-end="url(#gp-arr)"/>
    <foreignObject x="305" y="292" width="200" height="36">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial a^{(1)}}{\partial z^{(1)}} = \sigma'\!\left(z^{(1)}\right)"></div>
    </foreignObject>
  </g>

  <g data-key="dl2" data-only="1">
    <path d="M 716 352 L 716 364 L 1148 364 L 1148 352" class="brk"/>
    <text x="932" y="384" class="dv" text-anchor="middle">δ⁽²⁾ = (−0.1166, 0.1477)</text>
  </g>

  <g data-key="dl1" data-only="1">
    <path d="M 296 396 L 296 408 L 1148 408 L 1148 396" class="brk"/>
    <text x="722" y="428" class="dv" text-anchor="middle">δ⁽¹⁾ = (−0.0072, 0.0300)</text>
  </g>

  <g data-key="pw2" data-only="1">
    <text x="628" y="182" class="rl" text-anchor="end">× (a⁽¹⁾)ᵀ</text>
    <text x="778" y="182" class="rl" text-anchor="start">× 1</text>
  </g>

  <g data-key="pw1" data-only="1">
    <text x="208" y="182" class="rl" text-anchor="end">× (x⁽⁰⁾)ᵀ</text>
    <text x="358" y="182" class="rl" text-anchor="start">× 1</text>
  </g>

  <g data-key="g4" data-only="1">
    <rect x="30" y="448" width="1180" height="56" rx="12" class="fq"/>
    <text x="60" y="482" class="cap">Четыре маршрута от E назад:</text>
    <foreignObject x="330" y="458" width="580" height="38">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial W^{(2)}},\quad \frac{\partial E}{\partial b^{(2)}},\quad \frac{\partial E}{\partial W^{(1)}},\quad \frac{\partial E}{\partial b^{(1)}}"></div>
    </foreignObject>
  </g>

  <g data-key="f1" data-only="1">
    <rect x="30" y="448" width="1180" height="56" rx="12" class="fr"/>
    <foreignObject x="42" y="458" width="1156" height="38">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial W^{(2)}} = \frac{\partial E}{\partial a^{(2)}}\cdot\frac{\partial a^{(2)}}{\partial z^{(2)}}\cdot\frac{\partial z^{(2)}}{\partial W^{(2)}} = \left(a^{(2)} - y\right)\odot\sigma'\!\left(z^{(2)}\right)\left(a^{(1)}\right)^{\!\top} = \delta^{(2)}\left(a^{(1)}\right)^{\!\top}"></div>
    </foreignObject>
  </g>

  <g data-key="f2" data-only="1">
    <rect x="30" y="512" width="1180" height="56" rx="12" class="fr"/>
    <foreignObject x="42" y="522" width="1156" height="38">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial b^{(2)}} = \frac{\partial E}{\partial a^{(2)}}\cdot\frac{\partial a^{(2)}}{\partial z^{(2)}}\cdot\frac{\partial z^{(2)}}{\partial b^{(2)}} = \delta^{(2)}\cdot 1 = \delta^{(2)}"></div>
    </foreignObject>
  </g>

  <g data-key="f3" data-only="1">
    <rect x="30" y="576" width="1180" height="56" rx="12" class="fr"/>
    <foreignObject x="42" y="586" width="1156" height="38">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial W^{(1)}} = \frac{\partial E}{\partial a^{(2)}}\cdot\frac{\partial a^{(2)}}{\partial z^{(2)}}\cdot\frac{\partial z^{(2)}}{\partial a^{(1)}}\cdot\frac{\partial a^{(1)}}{\partial z^{(1)}}\cdot\frac{\partial z^{(1)}}{\partial W^{(1)}} = \left(\left(W^{(2)}\right)^{\!\top}\delta^{(2)}\right)\odot\sigma'\!\left(z^{(1)}\right)\left(x^{(0)}\right)^{\!\top} = \delta^{(1)}\left(x^{(0)}\right)^{\!\top}"></div>
    </foreignObject>
  </g>

  <g data-key="f4" data-only="1">
    <rect x="30" y="640" width="1180" height="56" rx="12" class="fr"/>
    <foreignObject x="42" y="650" width="1156" height="38">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial b^{(1)}} = \frac{\partial E}{\partial z^{(1)}}\cdot\frac{\partial z^{(1)}}{\partial b^{(1)}} = \delta^{(1)}\cdot 1 = \delta^{(1)}"></div>
    </foreignObject>
  </g>

  <text x="30" y="722" class="legend">красный — производная участка пути · пунктирная рамка — параметр, для которого идёт вывод · скобка — множитель, посчитанный один раз на всех</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="g4 hW1 hb1 hW2 hb2" data-focus="g4">
      <div class="step-kicker">Шаг 1 · что ищем</div>
      <h4>Четыре параметра — четыре маршрута</h4>
      <p>Пунктиром обведены все четыре узла, по которым нужен градиент. Ни в один
      из них стрелка не входит: параметры — листья графа, дальше идти некуда,
      маршрут на них заканчивается.</p>
      <p>Правило одно и то же для всех четырёх: пройти от <code>E</code> до узла по
      стрелкам в обратную сторону и перемножить то, что написано на каждом
      участке.</p>
          <div class="callout-blue">
        <strong>Что именно ищем, по индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(\ell)}} = \begin{pmatrix} \dfrac{\partial E}{\partial w^{(\ell)}_{11}} &amp; \dfrac{\partial E}{\partial w^{(\ell)}_{12}} \\[6pt] \dfrac{\partial E}{\partial w^{(\ell)}_{21}} &amp; \dfrac{\partial E}{\partial w^{(\ell)}_{22}} \end{pmatrix}, \qquad \frac{\partial E}{\partial b^{(\ell)}} = \begin{pmatrix} \dfrac{\partial E}{\partial b^{(\ell)}_{1}} \\[6pt] \dfrac{\partial E}{\partial b^{(\ell)}_{2}} \end{pmatrix}"></div>
        <div class="math-display" data-tex="\ell \in \{1, 2\} \;\Rightarrow\; 8 + 4 = 12 \;\; \text{чисел}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW2 hb2 bw1" data-focus="bw1">
      <div class="step-kicker">Шаг 2 · первый участок</div>
      <h4>Производная потери по предсказанию</h4>
      <p>Единственное место, где вообще участвует <code>y</code>. Для квадратичной
      ошибки этот множитель равен промаху <code>a⁽²⁾ − y</code>; для
      кросс-энтропии он был бы другим, а весь остальной путь остался бы прежним.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · стартовый импульс</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Предсказание и цель</span>
            <div class="math-display worked-math" data-tex="a^{(2)} = (0.5316,\; 0.6459), \; y = (1,\; 0)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Первый множитель</span>
            <div class="math-display worked-math" data-tex="a^{(2)} - y = \left(-0.4684,\; 0.6459\right)"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> знак говорит,
        в какую сторону промахнулись. Первый выход ниже цели — минус, второй выше —
        плюс.</p>
      </div>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial a^{(2)}_i} = a^{(2)}_i - y_i, \qquad \frac{\partial E}{\partial a^{(2)}} = \begin{pmatrix} a^{(2)}_1 - y_1 \\ a^{(2)}_2 - y_2 \end{pmatrix}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW2 hb2 bw1 bw2 dl2" data-focus="bw2">
      <div class="step-kicker">Шаг 3 · второй участок</div>
      <h4>Через активацию — поэлементно</h4>
      <p>Сигмоида действует на каждую координату отдельно, поэтому её производная
      входит не матрицей, а поэлементным умножением. Произведение первых двух
      множителей встречается во всех четырёх маршрутах, поэтому у него есть
      имя — <code>δ⁽²⁾</code>.</p>
      <p>Именно ради этого куска бэкпроп и работает быстро: он считается один раз и
      дальше переиспользуется всеми путями, которые проходят через
      <code>z⁽²⁾</code>.</p>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="\delta^{(2)}_i = \frac{\partial E}{\partial a^{(2)}_i}\cdot\sigma'\!\left(z^{(2)}_i\right) = \left(a^{(2)}_i - y_i\right) a^{(2)}_i \left(1 - a^{(2)}_i\right)"></div>
        <div class="math-display" data-tex="\delta^{(2)} = \begin{pmatrix} \delta^{(2)}_1 \\ \delta^{(2)}_2 \end{pmatrix} = \left(a^{(2)} - y\right) \odot \sigma'\!\left(z^{(2)}\right)"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW2 hb2 bw1 bw2 dl2 pw2 f1 f2" data-focus="pw2">
      <div class="step-kicker">Шаг 4 · маршрут закончился</div>
      <h4>Последний участок — от сумматора к его параметру</h4>
      <p>Производная <code>z⁽²⁾</code> по весам равна тому, что в них вошло, то есть
      <code>a⁽¹⁾</code>; по смещению — единице. Домножаем <code>δ⁽²⁾</code> на эти
      множители и получаем сразу оба градиента второго слоя.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · градиенты второго слоя</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Веса</span>
            <div class="math-display worked-math" data-tex="\frac{\partial E}{\partial W^{(2)}} = \begin{pmatrix} -0.0588 &amp; -0.0681 \\ 0.0744 &amp; 0.0863 \end{pmatrix}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Смещения</span>
            <div class="math-display worked-math" data-tex="\frac{\partial E}{\partial b^{(2)}} = \left(-0.1166,\; 0.1477\right)^{\!\top}"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> те же шесть
        чисел, что мы выводили по одному в части 3 — здесь они получились двумя
        операциями над <code>δ⁽²⁾</code>.</p>
      </div>
          <div class="callout-blue">
        <strong>Градиенты второго слоя по индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial w^{(2)}_{ij}} = \delta^{(2)}_i\, a^{(1)}_j, \qquad \frac{\partial E}{\partial b^{(2)}_i} = \delta^{(2)}_i"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(2)}} = \begin{pmatrix} \delta^{(2)}_1 a^{(1)}_1 &amp; \delta^{(2)}_1 a^{(1)}_2 \\ \delta^{(2)}_2 a^{(1)}_1 &amp; \delta^{(2)}_2 a^{(1)}_2 \end{pmatrix} = \delta^{(2)}\left(a^{(1)}\right)^{\!\top}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW1 hb1 hW2 hb2 bw1 bw2 dl2 f1 f2 bw3" data-focus="bw3">
      <div class="step-kicker">Шаг 5 · дальше влево</div>
      <h4>Через сумматор назад — это транспонированная матрица</h4>
      <p>Чтобы добраться до первого слоя, надо пройти узел <code>z⁽²⁾</code> насквозь.
      Вперёд он умножал на <code>W⁽²⁾</code>, назад — на <code>W⁽²⁾ᵀ</code>: та же
      матрица, прочитанная по столбцам, потому что каждая активация
      <code>a⁽¹⁾</code> влияла на оба выхода сразу.</p>
          <div class="callout-blue">
        <strong>Сумма по ветвям, расписанная по индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial a^{(1)}_1} = \delta^{(2)}_1 w^{(2)}_{11} + \delta^{(2)}_2 w^{(2)}_{21}"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial a^{(1)}_2} = \delta^{(2)}_1 w^{(2)}_{12} + \delta^{(2)}_2 w^{(2)}_{22}"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial a^{(1)}_j} = \sum_i \delta^{(2)}_i w^{(2)}_{ij} \qquad\Longleftrightarrow\qquad \frac{\partial E}{\partial a^{(1)}} = \left(W^{(2)}\right)^{\!\top}\delta^{(2)}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW1 hb1 hW2 hb2 bw1 bw2 dl2 f1 f2 bw3 bw4 dl1" data-focus="bw4">
      <div class="step-kicker">Шаг 6 · виток повторяется</div>
      <h4>Ещё одна активация — ещё один σ'</h4>
      <p>Участок <code>a⁽¹⁾ → z⁽¹⁾</code> устроен точно как участок из шага 3.
      Накопленное произведение получает имя <code>δ⁽¹⁾</code>, и на этом сеть
      кончилась: слева от <code>z⁽¹⁾</code> только вход, по которому градиент не
      нужен.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · во сколько раз ослаб сигнал</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Дельта второго слоя</span>
            <div class="math-display worked-math" data-tex="\delta^{(2)} = \left(-0.1166,\; 0.1477\right)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Дельта первого слоя</span>
            <div class="math-display worked-math" data-tex="\delta^{(1)} = \left(-0.0072,\; 0.0300\right)"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> два лишних
        множителя по дороге — и сигнал стал примерно вшестеро слабее. На этой
        картинке затухающий градиент виден как длина пути.</p>
      </div>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="\delta^{(1)}_j = \frac{\partial E}{\partial a^{(1)}_j}\cdot\sigma'\!\left(z^{(1)}_j\right) = \left(\sum_i \delta^{(2)}_i w^{(2)}_{ij}\right) a^{(1)}_j\left(1 - a^{(1)}_j\right)"></div>
        <div class="math-display" data-tex="\delta^{(1)} = \left(\left(W^{(2)}\right)^{\!\top}\delta^{(2)}\right) \odot \sigma'\!\left(z^{(1)}\right)"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW1 hb1 hW2 hb2 bw1 bw2 dl2 f1 f2 bw3 bw4 dl1 pw1 f3 f4" data-focus="pw1">
      <div class="step-kicker">Шаг 7 · конец обоих маршрутов</div>
      <h4>Последний множитель тот же, только вход другой</h4>
      <p>Для первого слоя роль «того, что вошло» играет <code>x⁽⁰⁾</code>, а
      смещение снова даёт единицу. Сравните строки на схеме: маршруты первого слоя
      отличаются от маршрутов второго только двумя лишними множителями
      посередине.</p>
          <div class="callout-blue">
        <strong>Градиенты первого слоя по индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial w^{(1)}_{ij}} = \delta^{(1)}_i\, x^{(0)}_j, \qquad \frac{\partial E}{\partial b^{(1)}_i} = \delta^{(1)}_i"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(1)}} = \begin{pmatrix} \delta^{(1)}_1 x^{(0)}_1 &amp; \delta^{(1)}_1 x^{(0)}_2 \\ \delta^{(1)}_2 x^{(0)}_1 &amp; \delta^{(1)}_2 x^{(0)}_2 \end{pmatrix} = \delta^{(1)}\left(x^{(0)}\right)^{\!\top}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW1 hb1 hW2 hb2 bw1 bw2 dl2 bw3 bw4 dl1 pw1 pw2 f1 f2 f3 f4" data-focus="f1 f2 f3 f4">
      <div class="step-kicker">Шаг 8 · все четыре градиента</div>
      <h4>Один обход графа справа налево — и всё посчитано</h4>
      <p>Четыре строки внизу — это весь бэкпроп для нашей сети. Общая часть
      маршрутов посчитана по одному разу, различаются только хвосты: у весов —
      вход слоя, у смещений — единица.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · двенадцать чисел целиком</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Первый слой</span>
            <div class="math-display worked-math" data-tex="\frac{\partial E}{\partial W^{(1)}} = \begin{pmatrix} -0.0036 &amp; -0.0058 \\ 0.0150 &amp; 0.0240 \end{pmatrix}, \; \frac{\partial E}{\partial b^{(1)}} = \begin{pmatrix} -0.0072 \\ 0.0300 \end{pmatrix}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Второй слой</span>
            <div class="math-display worked-math" data-tex="\frac{\partial E}{\partial W^{(2)}} = \begin{pmatrix} -0.0588 &amp; -0.0681 \\ 0.0744 &amp; 0.0863 \end{pmatrix}, \; \frac{\partial E}{\partial b^{(2)}} = \begin{pmatrix} -0.1166 \\ 0.1477 \end{pmatrix}"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>Как это прочитать:</strong> градиенты
        первого слоя на порядок мельче — не потому, что его веса менее важны, а
        потому, что до них сигнал шёл длиннее.</p>
      </div>
          <div class="callout-blue">
        <strong>Обе пары формул одним правилом:</strong>
        <div class="math-display" data-tex="\delta^{(2)}_i = \left(a^{(2)}_i - y_i\right)\sigma'\!\left(z^{(2)}_i\right), \qquad \delta^{(1)}_j = \left(\sum_i \delta^{(2)}_i w^{(2)}_{ij}\right)\sigma'\!\left(z^{(1)}_j\right)"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial w^{(\ell)}_{ij}} = \delta^{(\ell)}_i\, a^{(\ell-1)}_j, \qquad \frac{\partial E}{\partial b^{(\ell)}_i} = \delta^{(\ell)}_i, \qquad a^{(0)} = x^{(0)}"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(\ell)}} = \delta^{(\ell)}\left(a^{(\ell-1)}\right)^{\!\top}, \qquad \frac{\partial E}{\partial b^{(\ell)}} = \delta^{(\ell)}"></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Если выписать участки графа в таблицу, получится вся памятка по обратному
  проходу: слева тип узла, справа — что он делает с сигналом, когда через него
  проходят назад.
</p>

<table class="shape-table">
  <tr><th>Участок пути</th><th>Что стоит на нём</th><th>Как действует на сигнал</th></tr>
  <tr><td><code>E → a⁽²⁾</code></td><td><code>a⁽²⁾ − y</code></td><td>задаёт стартовый вектор и знак промаха</td></tr>
  <tr><td><code>a⁽ˡ⁾ → z⁽ˡ⁾</code></td><td><code>σ'(z⁽ˡ⁾)</code></td><td>поэлементное умножение, всегда ≤ 0.25</td></tr>
  <tr><td><code>z⁽ˡ⁾ → a⁽ˡ⁻¹⁾</code></td><td><code>W⁽ˡ⁾ᵀ</code></td><td>раскидывает сигнал по ветвям и складывает</td></tr>
  <tr><td><code>z⁽ˡ⁾ → W⁽ˡ⁾</code></td><td><code>(a⁽ˡ⁻¹⁾)ᵀ</code></td><td>внешнее произведение, маршрут закончен</td></tr>
  <tr><td><code>z⁽ˡ⁾ → b⁽ˡ⁾</code></td><td><code>1</code></td><td>ничего не меняет, маршрут закончен</td></tr>
</table>

### Что происходит дальше: шаг обучения

<p>
  Градиент показывает, куда ошибка растёт быстрее всего, поэтому параметры
  двигают в противоположную сторону. Величина шага задаётся скоростью обучения
  <code>α</code> — единственным числом, которое бэкпроп не вычисляет, а получает
  извне.
</p>

<div class="math-display" data-tex="W^{(\ell)} \leftarrow W^{(\ell)} - \alpha\,\frac{\partial E}{\partial W^{(\ell)}}, \qquad b^{(\ell)} \leftarrow b^{(\ell)} - \alpha\,\frac{\partial E}{\partial b^{(\ell)}}"></div>

<div class="worked-example">
  <div class="worked-label">Числовой пример · один шаг при α = 0.5</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Двигаем веса второго слоя против градиента</div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">w⁽²⁾₁₁</div>
      <div class="math-display worked-trace-math" data-tex="0.50 - 0.5\cdot(-0.0588) = 0.5294"></div>
      <div class="worked-trace-note">градиент отрицательный — вес растёт</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">b⁽²⁾₂</div>
      <div class="math-display worked-trace-math" data-tex="0.15 - 0.5\cdot 0.1477 = 0.0761"></div>
      <div class="worked-trace-note">второй выход был слишком велик — смещение падает</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">новая E</div>
      <div class="math-display worked-trace-math" data-tex="0.3183 \;\rightarrow\; 0.2896"></div>
      <div class="worked-trace-note">прямой проход с новыми параметрами</div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> один шаг убрал
  примерно 9% ошибки на этом примере. Дальше цикл повторяется: прямой проход по
  графу слева направо, обратный — справа налево, шаг, снова прямой проход.</p>
</div>

<div class="callout-yellow">
  <strong>Подводный камень:</strong> градиент верен только в точке, где он
  посчитан. При слишком большом <code>α</code> шаг уводит в область, где прежнее
  направление уже не годится, и ошибка вместо падения начинает скакать. Уменьшать
  <code>α</code> до бесконечности тоже нельзя — обучение просто остановится.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> сеть — это граф из нескольких операций, а
  градиент по любому параметру — произведение того, что написано на участках пути
  от ошибки к этому параметру. Все четыре маршрута делят общее начало, поэтому
  один обход графа справа налево даёт сразу все градиенты.
</div>

---

## Часть 9. Общий алгоритм и почему градиент затухает

<p>
  Сеть произвольной глубины описывается двумя строками прямого прохода, и любой
  слой обрабатывается одинаково — независимо от того, первый он или сотый.
</p>

<div class="math-display" data-tex="z^{(\ell)} = W^{(\ell)} a^{(\ell-1)} + b^{(\ell)}, \qquad a^{(\ell)} = \sigma\!\left(z^{(\ell)}\right), \qquad a^{(0)} = x"></div>

<p>
  Обратный проход — три строки. Первая запускает процесс на последнем слое, вторая
  двигает дельту на слой ниже, третья превращает дельту в градиенты.
</p>

<div class="math-display" data-tex="\delta^{(L)} = \frac{\partial E}{\partial a^{(L)}} \odot \sigma'\!\left(z^{(L)}\right)"></div>

<div class="math-display" data-tex="\delta^{(\ell)} = \left(\left(W^{(\ell+1)}\right)^{\!\top} \delta^{(\ell+1)}\right) \odot \sigma'\!\left(z^{(\ell)}\right)"></div>

<div class="math-display" data-tex="\frac{\partial E}{\partial W^{(\ell)}} = \delta^{(\ell)} \left(a^{(\ell-1)}\right)^{\!\top}, \qquad \frac{\partial E}{\partial b^{(\ell)}} = \delta^{(\ell)}"></div>

<table class="shape-table">
  <tr><th>Величина</th><th>Смысл</th><th>Форма при слое n×m</th><th>В примере</th></tr>
  <tr><td><code>δ⁽ˡ⁾</code></td><td>чувствительность ошибки к сумматорам слоя</td><td>n</td><td>2</td></tr>
  <tr><td><code>W⁽ˡ⁾</code></td><td>веса слоя</td><td>n×m</td><td>2×2</td></tr>
  <tr><td><code>∂E/∂W⁽ˡ⁾</code></td><td>градиент весов</td><td>n×m</td><td>2×2</td></tr>
  <tr><td><code>∂E/∂b⁽ˡ⁾</code></td><td>градиент смещений</td><td>n</td><td>2</td></tr>
  <tr><td><code>a⁽ˡ⁻¹⁾</code></td><td>вход слоя из кэша</td><td>m</td><td>2</td></tr>
</table>

### Почему это быстро

<p>
  Наивный подход — «подвинем каждый параметр по очереди и посмотрим, как изменится
  ошибка» — требует по одному прямому проходу на каждый параметр. При миллионе
  параметров это миллион проходов на один пример. Бэкпроп обходится <em>одним</em>
  проходом назад: каждая промежуточная величина вычисляется ровно один раз и
  дальше переиспользуется всеми, кому она нужна.
</p>

<p>
  Плата за это — память. Все активации приходится держать до конца обратного
  прохода, поэтому расход растёт с глубиной сети и размером батча. Отсюда же
  берутся приёмы вроде пересчёта активаций вместо их хранения.
</p>

### Затухающий градиент

<p>
  Посмотрите на рекурсию ещё раз: на каждом слое дельта умножается на
  <code>σ'(z)</code>. У сигмоиды этот множитель не превышает 0.25 <em>нигде</em>, а
  на насыщенных участках близок к нулю. Значит, при движении к первым слоям сигнал
  умножается на маленькое число снова и снова.
</p>

<div class="callout-red">
  <strong>Что ломается:</strong> в сети из десяти сигмоидных слоёв градиент первого
  слоя содержит десять множителей <code>σ'</code>. Даже в самом благоприятном
  случае, когда каждый равен максимальным 0.25, произведение составит около 10⁻⁶ —
  первые слои практически не обучаются. В нашей крошечной сети эффект уже виден:
  один слой ослабил сигнал в шесть раз.
</div>

<p>
  Отсюда популярность ReLU: её производная равна единице на всей положительной
  полуоси, и рекурсия перестаёт систематически гасить сигнал. Проблема при этом не
  исчезает совсем — она превращается в другую, «мёртвые» нейроны с нулевой
  производной, — но обучать глубокие сети становится возможно. Тому же служат
  остаточные связи, нормализация и аккуратная инициализация весов.
</p>

<div class="callout-yellow">
  <strong>Практическая деталь:</strong> ReLU не дифференцируема в нуле. На практике
  в этой точке берут любое значение из отрезка [0, 1] — субградиент — и
  стохастическое обучение этого просто не замечает: попасть ровно в ноль
  вероятность нулевая.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> длина цепочки — одновременно источник силы
  и слабости бэкпропа. Она позволяет посчитать все градиенты за один проход и она
  же экспоненциально ослабляет сигнал, если множители по дороге меньше единицы.
</div>

---

## Часть 10. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Нейрон разрезается надвое.</strong> Сумматор <code>z</code> и
  активация <code>a</code> — разные узлы с разными производными; без этого разреза
  вывод превращается в кашу.</li>
  <li><strong>Градиент по параметру — это маршрут по карте.</strong> Идём от
  ошибки к ребру и перемножаем то, что написано на каждом участке.</li>
  <li><strong>Производная по весу равна тому, что в ребро вошло:</strong>
  <code>∂z/∂w = a</code>. Выводить не надо, видно на схеме.</li>
  <li><strong>Производная по входу равна весу ребра:</strong>
  <code>∂z/∂a = w</code>. Симметрично предыдущему пункту.</li>
  <li><strong>Производная по смещению равна единице.</strong> Поэтому
  <code>∂E/∂b = δ</code> без единого лишнего умножения.</li>
  <li><strong>Развилка вперёд — сумма назад.</strong> Если узел влияет на несколько
  следующих, вклады складываются.</li>
  <li><strong>Дельта — накопленный сигнал на сумматоре:</strong>
  <code>δ⁽ˡ⁾ = ∂E/∂z⁽ˡ⁾</code>. Единственное, что слой передаёт соседу, и
  единственная причина, по которой алгоритм быстрый.</li>
  <li><strong>Два действия на слой.</strong> Пересчитать дельту через
  <code>Wᵀ</code> и <code>σ'</code>, затем выдать градиенты: внешнее произведение
  для весов, сама дельта для смещений.</li>
  <li><strong>Транспонирование не магия.</strong> Вперёд матрица раздаёт, назад она
  же собирает — просто читается по столбцам.</li>
  <li><strong>Функция потерь входит ровно в одну строку.</strong> Всё остальное от
  неё не зависит.</li>
  <li><strong>Затухание встроено в рекурсию.</strong> Каждый слой умножает сигнал
  на <code>σ'</code>; при <code>σ' &lt; 1</code> глубина работает против вас.</li>
</ol>

<p>
  Если из статьи стоит унести одну картину, пусть это будет такая: сеть — карта, по
  которой число идёт слева направо, а его вина за ошибку возвращается справа
  налево. По дороге вина умножается на то, что написано на рёбрах, и складывается
  на развилках. Все формулы бэкпропа — аккуратная запись этого движения; ни одна из
  них не содержит ничего, чего не было бы видно на схеме.
</p>

<p class="tiny">
  Все числа относятся к иллюстративной сети 2-2-2 с сигмоидой, входом (0.5, 0.8) и
  целью (1, 0); веса и смещения выбраны произвольно. Промежуточные значения и все
  двенадцать градиентов посчитаны скриптом и сверены с численными производными
  методом центральных разностей — расхождение не превышает 5·10⁻¹¹. Округление
  всюду до четырёх знаков после запятой, поэтому произведения округлённых чисел
  могут расходиться с приведённым результатом в последнем знаке.
</p>
