<style>
  .prose .stage-figure .is-focus .svg-math > span:not(.katex) { font-weight: 700; }
  .prose .stage-notes .katex-display { padding-bottom: .35em; }
  .mg { font-family: Helvetica, Arial, sans-serif; }
  .mg .cap { font-size: 13px; fill: #5E5850; }
  .mg .mm { font-size: 12px; fill: #5E5850; }
  .mg .legend { font-size: 13px; fill: #5E5850; }
</style>

<p class="lead">
  Чтобы узнать, как общая ошибка зависит от конкретного параметра, надо пройти по
  стрелкам схемы от ошибки к этому параметру и перемножить то, что написано на каждом
  участке пути. Это и делает бэкпроп. Остальные его детали отвечают на два вопроса:
  как не считать одно и то же дважды и как сложить результат в матрицы.
</p>

<p>
  Начнём с цепного правила на картинке: соберём граф вычисления снизу вверх на
  маленьком числовом примере, а потом заменим в этом же графе имена узлов на
  <span class="math-inline" data-tex="x"></span>, <span class="math-inline" data-tex="w"></span>, <span class="math-inline" data-tex="z"></span>, <span class="math-inline" data-tex="h"></span> и <span class="math-inline" data-tex="E"></span>.
  Получится нейрон, а рассуждение останется прежним. Дальше так же выведем градиенты
  <strong>по всем параметрам</strong> сети 2-2-2: восемь весов и четыре смещения,
  каждый выписан явно.
</p>

<div class="callout-blue">
  <strong>Как устроены интерактивы:</strong> формула стоит над колонкой, к которой
  относится: над сумматорами <span class="math-inline" data-tex="\mathbf z^{(1)} = \mathbf W^{(1)}\mathbf x^{(0)} + \mathbf b^{(1)}"></span>, над активациями
  <span class="math-inline" data-tex="\mathbf h^{(1)} = \sigma (\mathbf z^{(1)})"></span>. Записи накапливаются, так что к концу сцены весь проход
  виден целиком. Раскрытие по клеткам матриц стоит в описании шага под схемой, а под
  самой схемой подписано, какой формы параметры слоя. Вес <span class="math-inline" data-tex="W^{(\ell)}_{ij}"></span> на связи
  ведёт из нейрона <span class="math-inline" data-tex="j"></span> в нейрон <span class="math-inline" data-tex="i"></span>. Графы первой части растут
  <strong>снизу вверх</strong>: внизу вход, наверху результат, красные подписи на
  рёбрах показывают производные.
</div>

<div class="callout-yellow">
  <strong>Каждый вывод показан дважды.</strong> Сначала идёт сцена в переменных,
  сразу под ней сцена в числах с теми же шагами и той же подсветкой. Третья
  сцена части сворачивает всё в компактную матричную запись, которая стоит
  в коде фреймворков.
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#5E5850"></i>прямой проход: стрелки вперёд</span>
  <span><i style="background:#C30B0A"></i>обратный проход: стрелки назад и производные</span>
  <span><i style="background:#C29E08"></i>обучаемые параметры</span>
  <span><i style="background:#73B222"></i>то, что посчитала модель</span>
  <span><i style="background:#3576C0"></i>вход и цель</span>
</div>



## Часть 1. Цепное правило: весь инструмент целиком

<p>
  Бэкпроп использует один математический инструмент: правило дифференцирования
  сложной функции, оно же цепное правило. Сверх него в алгоритме нет ни хитрой
  оптимизации, ни специальной теории для нейросетей, поэтому начнём с него.
</p>

### Производная как коэффициент передачи

<p>
  Для бэкпропа производная отвечает на один вопрос: <strong>если сдвинуть вход на
  маленькую величину, на сколько сдвинется выход?</strong> Сдвинули <span class="math-inline" data-tex="u"></span> на
  0.001, выход сдвинулся на 0.028, значит, коэффициент передачи равен 28.
</p>

<div class="math-display" data-tex="\Delta s \;\approx\; \frac{ds}{du}\cdot \Delta u"></div>

<p>
  Пусть между входом и выходом стоит промежуточная величина: <span class="math-inline" data-tex="u"></span> двигает
  <span class="math-inline" data-tex="v"></span>, а <span class="math-inline" data-tex="v"></span> двигает <span class="math-inline" data-tex="s"></span>. Если первое звено передаёт
  сдвиг с коэффициентом 2, а второе с коэффициентом 14, то вход двигает выход в 28 раз
  сильнее. Коэффициенты <em>перемножаются</em>: это и есть цепное правило.
</p>

<div class="math-display" data-tex="\frac{ds}{du} \;=\; \frac{ds}{dv}\cdot\frac{dv}{du}"></div>

<div class="callout-blue">
  <strong>Почему умножение.</strong> Сдвиг <span class="math-inline" data-tex="\Delta u"></span> сначала
  превращается в <span class="math-inline" data-tex="\Delta v = 2\cdot \Delta u"></span>, а этот сдвиг в
  <span class="math-inline" data-tex="\Delta s = 14\cdot \Delta v = 14\cdot 2\cdot \Delta u"></span>. Множители копятся
  вдоль пути один за другим, потому что каждое следующее звено работает уже с
  результатом предыдущего.
</div>

### На развилке вклады складываются

<p>
  Второе правило нужно, когда вход влияет на результат несколькими способами сразу:
  например, одно и то же <span class="math-inline" data-tex="u"></span> входит и в первый множитель, и во второй.
  Тогда при сдвиге <span class="math-inline" data-tex="u"></span> срабатывают <em>оба</em> маршрута, и их эффекты
  складываются.
</p>

<div class="math-display" data-tex="\frac{ds}{du} \;=\; \sum_{k} \frac{\partial s}{\partial v_k}\cdot\frac{dv_k}{du}"></div>

<p>
  Других правил в статье не будет: дальше растут только длина путей и ширина развилок.
</p>

### Интерактив 1 · граф собирается снизу вверх

<p>
  Возьмём выражение, которое неудобно дифференцировать в лоб. Разрежем его на
  элементарные операции, сложим из них граф снизу вверх, прогоним через граф число,
  а потом пройдём обратно сверху вниз, перемножая то, что написано на рёбрах.
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

  <foreignObject x="40" y="8.96" width="880" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400;text-align:left;justify-content:flex-start"><span>Выражение, которое надо продифференцировать по <span data-tex="u"></span></span></div></foreignObject>

  <g data-key="expr">
    <foreignObject x="40" y="44" width="520" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="s = \bigl(3u\,(u+1)\bigr)^{2}, \qquad u = 1"></div>
    </foreignObject>
  </g>

  <g data-key="nu">
    <rect x="250" y="492" width="170" height="58" rx="12" class="nd"/>
    <foreignObject x="275" y="489.88" width="120" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:400;text-align:center;justify-content:center"><span>вход <span data-tex="u"></span></span></div></foreignObject>
  </g>

  <g data-key="n1">
    <line x1="315" y1="492" x2="222" y2="434" class="ed" marker-end="url(#gb-arw)"/>
    <line x1="355" y1="492" x2="448" y2="434" class="ed" marker-end="url(#gb-arw)"/>
    <rect x="110" y="372" width="170" height="58" rx="12" class="nd"/>
    <rect x="390" y="372" width="170" height="58" rx="12" class="nd"/>
    <foreignObject x="125.5" y="369.88" width="139" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:400;text-align:center;justify-content:center" data-tex="p = u + 1"></div></foreignObject>
    <foreignObject x="415" y="369.88" width="120" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:400;text-align:center;justify-content:center" data-tex="q = 3u"></div></foreignObject>
  </g>

  <g data-key="n2">
    <line x1="222" y1="372" x2="315" y2="314" class="ed" marker-end="url(#gb-arw)"/>
    <line x1="448" y1="372" x2="355" y2="314" class="ed" marker-end="url(#gb-arw)"/>
    <rect x="250" y="252" width="170" height="58" rx="12" class="nd"/>
    <foreignObject x="265.5" y="249.88" width="139" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:400;text-align:center;justify-content:center" data-tex="r = p \cdot  q"></div></foreignObject>
  </g>

  <g data-key="n3">
    <line x1="335" y1="252" x2="335" y2="194" class="ed" marker-end="url(#gb-arw)"/>
    <rect x="250" y="132" width="170" height="58" rx="12" class="ndr"/>
    <foreignObject x="275" y="129.88" width="120" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:400;text-align:center;justify-content:center" data-tex="s = r^{2}"></div></foreignObject>
  </g>

  <g data-key="vl" data-only="1">
    <foreignObject x="275" y="514.6" width="120" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#3576C0;font-weight:700;text-align:center;justify-content:center" data-tex="u = 1"></div></foreignObject>
    <foreignObject x="135" y="394.6" width="120" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#3576C0;font-weight:700;text-align:center;justify-content:center" data-tex="p = 2"></div></foreignObject>
    <foreignObject x="415" y="394.6" width="120" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#3576C0;font-weight:700;text-align:center;justify-content:center" data-tex="q = 3"></div></foreignObject>
    <foreignObject x="275" y="274.6" width="120" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#3576C0;font-weight:700;text-align:center;justify-content:center" data-tex="r = 6"></div></foreignObject>
    <foreignObject x="275" y="154.6" width="120" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#3576C0;font-weight:700;text-align:center;justify-content:center" data-tex="s = 36"></div></foreignObject>
  </g>

  <g data-key="dr" data-only="1">
    <foreignObject x="79" y="430.32" width="139" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:right;justify-content:flex-end" data-tex="dp/du = 1"></div></foreignObject>
    <foreignObject x="452" y="430.32" width="139" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:left;justify-content:flex-start" data-tex="dq/du = 3"></div></foreignObject>
    <foreignObject x="69" y="314.32" width="183" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:right;justify-content:flex-end" data-tex="\partial r/\partial p = q = 3"></div></foreignObject>
    <foreignObject x="418" y="314.32" width="183" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:left;justify-content:flex-start" data-tex="\partial r/\partial q = p = 2"></div></foreignObject>
    <foreignObject x="352" y="204.32" width="205" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:left;justify-content:flex-start" data-tex="ds/dr = 2r = 12"></div></foreignObject>
  </g>

  <g data-key="p1" data-only="1">
    <line x1="315" y1="492" x2="222" y2="434" class="hp"/>
    <line x1="222" y1="372" x2="315" y2="314" class="hp"/>
    <line x1="335" y1="252" x2="335" y2="194" class="hp"/>
    <rect x="600" y="132" width="340" height="80" rx="12" class="card"/>
    <foreignObject x="616" y="134.32" width="271" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400;text-align:left;justify-content:flex-start"><span>Путь 1: <span data-tex="u"></span> → <span data-tex="p"></span> → <span data-tex="r"></span> → <span data-tex="s"></span></span></div></foreignObject>
    <foreignObject x="612" y="162" width="316" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="12 \cdot 3 \cdot 1 = 36"></div>
    </foreignObject>
  </g>

  <g data-key="p2" data-only="1">
    <line x1="355" y1="492" x2="448" y2="434" class="hp" stroke-dasharray="10 7"/>
    <line x1="448" y1="372" x2="355" y2="314" class="hp" stroke-dasharray="10 7"/>
    <rect x="600" y="232" width="340" height="80" rx="12" class="card"/>
    <foreignObject x="616" y="234.32" width="271" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400;text-align:left;justify-content:flex-start"><span>Путь 2: <span data-tex="u"></span> → <span data-tex="q"></span> → <span data-tex="r"></span> → <span data-tex="s"></span></span></div></foreignObject>
    <foreignObject x="612" y="262" width="316" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="12 \cdot 2 \cdot 3 = 72"></div>
    </foreignObject>
  </g>

  <g data-key="sm" data-only="1">
    <rect x="600" y="332" width="340" height="80" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
    <text x="616" y="356" class="ct">Сумма по путям</text>
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
    <foreignObject x="40" y="579.96" width="880" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#A30908;font-weight:400;text-align:center;justify-content:center"><span>Нейросеть устроена так же: узлы это <span data-tex="z"></span> и <span data-tex="h"></span>, а роль <span data-tex="s"></span> играет ошибка <span data-tex="E"></span></span></div></foreignObject>
  </g>

  <text x="40" y="644" class="legend">синее: узлы и значения прямого прохода · красное: локальные производные и пути · зелёное: итог</text>
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
      <h4>Начинаем снизу, со входа</h4>
      <p>Внизу графа лежит то, по чему мы будем дифференцировать: переменная
      <span class="math-inline" data-tex="u"></span>. Всё остальное вырастет над ней.</p>
      <p>Правило сборки одно: <strong>в каждом узле одна элементарная операция</strong>,
      производную которой вы помните наизусть. Чем сложнее выражение, тем больше узлов,
      а формулы в них остаются простыми.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1" data-focus="n1">
      <div class="step-kicker">Шаг 2 · первый ярус</div>
      <h4>От входа отходят две стрелки: это развилка</h4>
      <p>Внутри <span class="math-inline" data-tex="3u(u+1)"></span> величина <span class="math-inline" data-tex="u"></span> используется дважды:
      один раз в скобке <span class="math-inline" data-tex="u + 1"></span>, второй раз в множителе <span class="math-inline" data-tex="3u"></span>.
      Дадим этим кускам имена <span class="math-inline" data-tex="p"></span> и <span class="math-inline" data-tex="q"></span>.</p>
      <p>Развилка следует из самого выражения. В сети она возникает по той же причине:
      выход одного нейрона идёт сразу в несколько нейронов следующего слоя.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2" data-focus="n2">
      <div class="step-kicker">Шаг 3 · слияние</div>
      <h4>Ветви сходятся обратно в одном узле</h4>
      <p>Узел <span class="math-inline" data-tex="r = p \cdot  q"></span> принимает обе ветви. Сам узел не знает, что
      <span class="math-inline" data-tex="p"></span> и <span class="math-inline" data-tex="q"></span> выросли из общего корня: он только умножает два
      своих входа.</p>
      <p>Поэтому дифференцирование можно автоматизировать: каждому узлу достаточно знать
      свою операцию и свои входы.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3" data-focus="n3">
      <div class="step-kicker">Шаг 4 · вершина</div>
      <h4>Граф собран: четыре операции вместо одной длинной формулы</h4>
      <p>Последний узел возводит <span class="math-inline" data-tex="r"></span> в квадрат. Наверху графа стоит
      величина, производную которой мы ищем. В сети её место займёт ошибка.</p>
      <p>Все производные в графе простые: прибавить единицу, умножить на три, перемножить,
      возвести в квадрат.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl" data-focus="vl">
      <div class="step-kicker">Шаг 5 · прямой проход</div>
      <h4>Пропускаем число снизу вверх и всё запоминаем</h4>
      <p>При <span class="math-inline" data-tex="u = 1"></span> получаем <span class="math-inline" data-tex="p = 2"></span>, <span class="math-inline" data-tex="q = 3"></span>,
      <span class="math-inline" data-tex="r = 6"></span> и <span class="math-inline" data-tex="s = 36"></span>. Значения считаются в том же
      порядке, в каком строился граф: снизу вверх.</p>
      <p>Промежуточные числа не выбрасываем: на следующем шаге производные выразятся через
      них. По этой же причине в сети хранят активации.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl dr" data-focus="dr">
      <div class="step-kicker">Шаг 6 · локальные производные</div>
      <h4>На каждом ребре пишем одно маленькое число</h4>
      <p>Ребро <span class="math-inline" data-tex="u \to  p"></span>: производная суммы равна 1. Ребро
      <span class="math-inline" data-tex="u \to  q"></span>: 3. Для умножения производная по одному входу равна
      другому входу, поэтому <span class="math-inline" data-tex="\partial r/\partial p = q = 3"></span>, а
      <span class="math-inline" data-tex="\partial r/\partial q = p = 2"></span>. Наверху <span class="math-inline" data-tex="ds/dr = 2r = 12"></span>.</p>
      <p>Каждое число <em>локально</em>: чтобы его посчитать, достаточно знать операцию в
      узле и значения, сохранённые на прямом проходе.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl dr p1" data-focus="p1">
      <div class="step-kicker">Шаг 7 · первый маршрут</div>
      <h4>Идём сверху вниз и перемножаем то, что на рёбрах</h4>
      <p>Маршрут <span class="math-inline" data-tex="u \to  p \to  r \to  s"></span> состоит из трёх рёбер с числами 1, 3 и
      12. Перемножаем: 12 · 3 · 1 = 36. Это вклад <em>одного</em> маршрута от
      <span class="math-inline" data-tex="u"></span> к <span class="math-inline" data-tex="s"></span>.</p>
      <p>Значения идут вверх, производные читаются вниз. Отсюда и название: обратное
      распространение.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl dr p1 p2" data-focus="p2">
      <div class="step-kicker">Шаг 8 · второй маршрут</div>
      <h4>Второй путь считается так же</h4>
      <p>Маршрут <span class="math-inline" data-tex="u \to  q \to  r \to  s"></span> даёт 12 · 2 · 3 = 72. Верхнее ребро
      <span class="math-inline" data-tex="r \to  s"></span> входит в оба маршрута: его производную мы посчитали один
      раз и используем дважды.</p>
      <p>На этом держится скорость бэкпропа: общие участки пути не пересчитываются заново
      для каждого параметра.</p>
    </div>
    <div class="step-panel" data-on="expr nu n1 n2 n3 vl dr p1 p2 sm ck nb" data-focus="sm ck">
      <div class="step-kicker">Шаг 9 · сумма и проверка</div>
      <h4>Складываем маршруты и сверяемся с прямым дифференцированием</h4>
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
            <div class="math-display worked-trace-math" data-tex="\begin{gathered} s = 9u^{2}(u+1)^{2} \\ \frac{ds}{du} = 18u(u+1)(2u+1) = 108 \end{gathered}"></div>
            <div class="worked-trace-note">раскрыли скобки и продифференцировали как обычно</div>
          </div>
        </div>
        <p class="worked-reading">36 + 72 = 108, столько же даёт прямое дифференцирование. Сумма по путям точна:
        это не приближение. По графу считать механически, а в лоб надо не ошибиться в
        скобках.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 2 · нейрон как та же цепочка

<p>
  Теперь перейдём к нейрону. В графе выше меняются только имена узлов, новой
  математики не появляется.
</p>

<table class="shape-table">
  <tr><th>В графе из интерактива 1</th><th>В нейроне</th><th>Что стоит на ребре</th></tr>
  <tr><td>вход <span class="math-inline" data-tex="u"></span></td><td>вход <span class="math-inline" data-tex="x"></span> и параметры <span class="math-inline" data-tex="w"></span>, <span class="math-inline" data-tex="b"></span></td><td>то, по чему берём производную</td></tr>
  <tr><td>промежуточный узел <span class="math-inline" data-tex="r"></span></td><td>сумматор <span class="math-inline" data-tex="z = wx + b"></span></td><td><span class="math-inline" data-tex="\partial z/\partial w = x"></span></td></tr>
  <tr><td>ещё один узел</td><td>активация <span class="math-inline" data-tex="h = \sigma (z)"></span></td><td><span class="math-inline" data-tex="\partial h/\partial z = h(1 - h)"></span></td></tr>
  <tr><td>вершина <span class="math-inline" data-tex="s"></span></td><td>ошибка <span class="math-inline" data-tex="E = (h - y)^{2}"></span></td><td><span class="math-inline" data-tex="\partial E/\partial h = 2(h - y)"></span></td></tr>
</table>

<p>
  Возьмём один нейрон с одним входом: <span class="math-inline" data-tex="x = 0.5"></span>, вес
  <span class="math-inline" data-tex="w = 0.4"></span>, смещение <span class="math-inline" data-tex="b = 0.1"></span>, правильный ответ
  <span class="math-inline" data-tex="y = 1"></span>. Бэкпроп отвечает на вопрос: <strong>на сколько изменится ошибка, если чуть-чуть
  подвинуть вес?</strong>
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
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="z = wx + b,\quad h = \sigma(z),\quad E = (h-y)^{2}"></div>
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
    <foreignObject x="110" y="456.6" width="120" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400;text-align:center;justify-content:center"><span>вход <span data-tex="x"></span></span></div></foreignObject>
    <foreignObject x="270" y="456.6" width="120" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400;text-align:center;justify-content:center"><span>вес <span data-tex="w"></span></span></div></foreignObject>
    <foreignObject x="415" y="456.6" width="150" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400;text-align:center;justify-content:center"><span>смещение <span data-tex="b"></span></span></div></foreignObject>
    <foreignObject x="255" y="341.88" width="150" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:400;text-align:center;justify-content:center" data-tex="z = wx + b"></div></foreignObject>
    <foreignObject x="266" y="229.88" width="128" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:400;text-align:center;justify-content:center" data-tex="h = \sigma (z)"></div></foreignObject>
    <foreignObject x="244" y="117.88" width="172" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#111111;font-weight:400;text-align:center;justify-content:center" data-tex="E = (h - y)^{2}"></div></foreignObject>
    <foreignObject x="470" y="120.6" width="120" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400;text-align:center;justify-content:center"><span>цель <span data-tex="y"></span></span></div></foreignObject>
  </g>

  <g data-key="vl" data-only="1">
    <text x="170" y="503" class="nv" text-anchor="middle">0.5</text>
    <text x="330" y="503" class="nv" text-anchor="middle">0.4</text>
    <text x="490" y="503" class="nv" text-anchor="middle">0.1</text>
    <foreignObject x="270" y="366.6" width="120" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#3576C0;font-weight:700;text-align:center;justify-content:center" data-tex="z = 0.3"></div></foreignObject>
    <foreignObject x="255" y="254.6" width="150" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#3576C0;font-weight:700;text-align:center;justify-content:center" data-tex="h = 0.5744"></div></foreignObject>
    <foreignObject x="255" y="142.6" width="150" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#3576C0;font-weight:700;text-align:center;justify-content:center" data-tex="E = 0.1811"></div></foreignObject>
    <text x="530" y="167" class="nv" text-anchor="middle">1</text>
  </g>

  <g data-key="d1" data-only="1">
    <foreignObject x="352" y="184.32" width="326" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:left;justify-content:flex-start" data-tex="\partial E/\partial h = 2(h - y) = -0.8511"></div></foreignObject>
  </g>

  <g data-key="d2" data-only="1">
    <foreignObject x="352" y="296.32" width="315" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:left;justify-content:flex-start" data-tex="\partial h/\partial z = h(1 - h) = 0.2445"></div></foreignObject>
  </g>

  <g data-key="dp" data-only="1">
    <foreignObject x="67.5" y="512.32" width="205" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:center;justify-content:center" data-tex="\partial z/\partial x = w = 0.4"></div></foreignObject>
    <foreignObject x="227.5" y="512.32" width="205" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:center;justify-content:center" data-tex="\partial z/\partial w = x = 0.5"></div></foreignObject>
    <foreignObject x="420.5" y="512.32" width="139" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C30B0A;font-weight:400;text-align:center;justify-content:center" data-tex="\partial z/\partial b = 1"></div></foreignObject>
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
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{E(w+\varepsilon)-E(w-\varepsilon)}{2\varepsilon} = -0.1040"></div>
    </foreignObject>
  </g>

  <g data-key="nb" data-only="1">
    <rect x="40" y="590" width="880" height="48" rx="9" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
    <foreignObject x="40" y="595.96" width="880" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#A30908;font-weight:400;text-align:center;justify-content:center"><span><span data-tex="h(1-h)"></span> не больше 0.25: каждый слой умножает проходящий градиент на маленькое число</span></div></foreignObject>
  </g>

  <foreignObject x="40" y="650.32" width="880" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#8A8378;font-weight:400;text-align:left;justify-content:flex-start"><span>синее: данные и значения · жёлтое: параметры · красное: ошибка, производные, сигнал <span data-tex="\delta"></span></span></div></foreignObject>
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
      <h4>Нейрон как цепочка из трёх операций</h4>
      <p>Внизу вход и параметры, над ними сумматор <span class="math-inline" data-tex="z"></span>, над ним
      нелинейность <span class="math-inline" data-tex="h"></span>, наверху ошибка <span class="math-inline" data-tex="E"></span>, которая
      сравнивает предсказание с целью <span class="math-inline" data-tex="y"></span>.</p>
      <p>Устройство то же, что в первом интерактиве, только вместо развилки длинная
      вертикальная цепочка. Разветвление вернётся, когда нейронов станет несколько.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl" data-focus="vl">
      <div class="step-kicker">Шаг 2 · прямой проход</div>
      <h4>Считаем снизу вверх и сохраняем каждое значение</h4>
      <p><span class="math-inline" data-tex="z = 0.4 \cdot  0.5 + 0.1 = 0.3"></span>, затем
      <span class="math-inline" data-tex="h = \sigma (0.3) = 0.5744"></span>, затем
      <span class="math-inline" data-tex="E = (0.5744 - 1)^{2} = 0.1811"></span>.</p>
      <p>Нейрон предсказал 0.57 вместо 1. Обратный проход выясняет, в какую сторону менять
      <span class="math-inline" data-tex="w"></span> и <span class="math-inline" data-tex="b"></span>, чтобы 0.1811 стало меньше.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl d1" data-focus="d1">
      <div class="step-kicker">Шаг 3 · верхнее звено</div>
      <h4>Насколько ошибка чувствительна к предсказанию</h4>
      <p><span class="math-inline" data-tex="E = (h - y)^{2}"></span>, поэтому <span class="math-inline" data-tex="\partial E/\partial h = 2(h - y) = -0.8511"></span>.
      Минус означает, что <em>увеличение</em> предсказания <em>уменьшает</em> ошибку:
      мы пока недотягиваем до цели.</p>
      <p>Обратный проход начинается отсюда: с производной ошибки по предсказанию.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl d1 d2" data-focus="d2">
      <div class="step-kicker">Шаг 4 · второе звено</div>
      <h4>Производная сигмоиды выражается через уже посчитанное значение</h4>
      <p>Для сигмоиды <span class="math-inline" data-tex="\partial h/\partial z = h(1 - h)"></span>. Значение <span class="math-inline" data-tex="h = 0.5744"></span> уже лежит в памяти с прямого прохода, поэтому
      <span class="math-inline" data-tex="0.5744 \cdot  0.4256 = 0.2445"></span>.</p>
      <p>Поэтому фреймворки хранят активации: без них обратный проход пришлось бы начинать
      с повторного прямого.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl d1 d2 dl" data-focus="dl">
      <div class="step-kicker">Шаг 5 · свёртка двух звеньев</div>
      <h4>Перемножаем верхние два ребра и даём результату имя</h4>
      <p><span class="math-inline" data-tex="\delta  = \partial E/\partial z = (-0.8511) \cdot  0.2445 = -0.2081"></span>. Это цепное правило: два коэффициента передачи подряд.</p>
      <p>Величину <span class="math-inline" data-tex="\delta"></span> называют сигналом ошибки на сумматоре. Она
      нужна и для веса, и для смещения, и для входа, поэтому её считают один раз и
      используют повторно.</p>
    </div>
    <div class="step-panel" data-on="ex gr vl d1 d2 dl dp" data-focus="dp">
      <div class="step-kicker">Шаг 6 · нижние рёбра</div>
      <h4>Производные сумматора</h4>
      <p><span class="math-inline" data-tex="z = wx + b"></span> линейна, поэтому <span class="math-inline" data-tex="\partial z/\partial w = x"></span>,
      <span class="math-inline" data-tex="\partial z/\partial b = 1"></span>, <span class="math-inline" data-tex="\partial z/\partial x = w"></span>. Все эти числа уже есть на схеме.</p>
      <p>Производная по весу равна входу, а производная по входу равна весу. Из этого потом
      вырастет транспонирование матрицы.</p>
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
        <p class="worked-reading">Градиент по весу отрицательный, значит, увеличение <span class="math-inline" data-tex="w"></span> уменьшает
        ошибку, и шаг спуска подвинет вес вверх. Он в два раза меньше градиента по
        смещению, потому что вход <span class="math-inline" data-tex="x = 0.5"></span>: чем меньше вход на ребре, тем
        меньше градиент этого веса.</p>
      </div>
    </div>
    <div class="step-panel" data-on="ex gr vl d1 d2 dl dp cg ck nb" data-focus="ck nb">
      <div class="step-kicker">Шаг 8 · проверка и следствие</div>
      <h4>Сверяем с численной производной и смотрим на множитель 0.2445</h4>
      <p>Подвинем <span class="math-inline" data-tex="w"></span> на <span class="math-inline" data-tex="\varepsilon  = 10^{-6}"></span> в обе стороны и поделим
      разность ошибок на <span class="math-inline" data-tex="2\varepsilon"></span>: получаются те же −0.1040. Так обычно ловят
      ошибку в выкладке: если аналитический и численный градиенты разошлись, ошибка в
      аналитическом.</p>
      <p>Множитель <span class="math-inline" data-tex="h(1 - h) = 0.2445"></span> не бывает больше 0.25. В цепочке из десяти
      сигмоидных слоёв градиент умножится на такое число десять раз и придёт к первому
      слою почти нулевым. Это затухание градиента.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Вместе два интерактива дают полный алгоритм. В сети от каждого веса до ошибки ведёт
  свой путь. Вдоль пути производные перемножаются, а если путей несколько (так будет у
  любого веса, кроме последнего слоя), их вклады складываются. Оставшиеся части
  показывают, как обойти все пути, ничего не пересчитывая дважды, и как записать
  результат матрицами.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> производная читается как маршрут по графу:
  перемножить локальные производные вдоль пути и сложить результаты по всем путям.
  Локальные производные простые и считаются через значения, сохранённые на прямом
  проходе.
</div>

<p class="tiny">
  Все числа в части посчитаны скриптом и округлены до четырёх знаков после
  запятой. Аналитические градиенты нейрона сверены с численными (центральная
  разность, <span class="math-inline" data-tex="\varepsilon  = 10^{-6}"></span>): расхождение меньше 10⁻⁸.
</p>

---

## Часть 2. Граф сети: прямой проход

<p>
  Обычно нейрон рисуют одним кружком. Для прямого прохода это удобно, а для вывода
  градиентов нет: внутри кружка спрятаны две операции с разными производными. Поэтому
  мы разрезаем каждый нейрон надвое: <strong>сумматор</strong> <span class="math-inline" data-tex="z"></span>
  складывает взвешенные входы и смещение, <strong>активация</strong> <span class="math-inline" data-tex="h"></span>
  применяет нелинейность.
</p>

<div class="math-display" data-tex="\mathbf z^{(\ell)} = \mathbf W^{(\ell)} \mathbf h^{(\ell-1)} + \mathbf b^{(\ell)}, \qquad \mathbf h^{(\ell)} = \sigma\!\left(\mathbf z^{(\ell)}\right), \qquad \mathbf h^{(0)} = \mathbf x^{(0)}"></div>

### Нотация

<p>
  Верхний индекс в скобках означает номер слоя, нижний номер узла. У весов нижних
  индексов два: <span class="math-inline" data-tex="W^{(2)}_{21}"></span> ведёт из узла 1 предыдущего слоя в узел 2
  текущего. При такой записи строки матрицы <span class="math-inline" data-tex="W"></span> совпадают со строками
  схемы, а индексы читаются как обычная адресация «строка, столбец».
</p>

<table class="shape-table">
  <tr><th>Обозначение</th><th>Что это</th><th>Форма</th><th>В примере</th></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf x^{(0)}"></span></td><td>вход</td><td>2</td><td>(0.5, 0.8)</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf W^{(1)}, \mathbf W^{(2)}"></span></td><td>веса слоёв</td><td>2×2</td><td>задаём сами</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf b^{(1)}, \mathbf b^{(2)}"></span></td><td>смещения</td><td>2</td><td>задаём сами</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf z^{(\ell)}"></span></td><td>сумматор до активации</td><td>2</td><td>считается</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf h^{(\ell)}"></span></td><td>активация</td><td>2</td><td>считается</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf y"></span></td><td>цель</td><td>2</td><td>(1, 0)</td></tr>
  <tr><td><span class="math-inline" data-tex="E"></span></td><td>суммарная ошибка</td><td>число</td><td>0.3183</td></tr>
</table>

### Интерактив 3 · прямой проход в переменных

<div class="stage" id="stageFw" tabindex="0">
  <div class="stage-figure">
<svg class="mg" id="fw" viewBox="0 0 960 512" role="img" aria-label="Прямой проход: граф сети, где каждый нейрон разрезан на сумматор и активацию">
<defs><marker id="fw-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="fw-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="fw-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">вход и цель</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf z^{(1)}"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf h^{(1)}"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf z^{(2)}"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf h^{(2)}"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="785" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>ошибка <span data-tex="E"></span></span></div></foreignObject>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="62" y="128" class="cap" text-anchor="middle">вход</text><text x="192" y="128" class="cap" text-anchor="middle">сумматор</text><text x="300" y="128" class="cap" text-anchor="middle">активация</text><text x="462" y="128" class="cap" text-anchor="middle">сумматор</text><text x="570" y="128" class="cap" text-anchor="middle">активация</text><text x="716" y="128" class="cap" text-anchor="middle">ошибка</text><text x="880" y="128" class="cap" text-anchor="middle">итог</text>
<line x1="30" y1="414" x2="96" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="160" y1="414" x2="332" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="430" y1="414" x2="602" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="684" y1="414" x2="915" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><foreignObject x="-2" y="415.68" width="130" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вход: 2 числа</span></div></foreignObject><foreignObject x="146" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 1: <span data-tex="\mathbf W^{(1)}\ 2\times 2,\ \mathbf b^{(1)}\ 2"></span></span></div></foreignObject><foreignObject x="416" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 2: <span data-tex="\mathbf W^{(2)}\ 2\times 2,\ \mathbf b^{(2)}\ 2"></span></span></div></foreignObject><foreignObject x="680" y="415.68" width="240" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря: сумма по двум выходам</span></div></foreignObject>
<g data-key="D1" data-only="1"><foreignObject x="2" y="46" width="180" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf x^{(0)} = \left(x^{(0)}_1,\; x^{(0)}_2\right)^{\!\top}"></div></foreignObject></g>
<g data-key="D2" data-only="1"><foreignObject x="2" y="68" width="180" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf y = \left(y_1,\; y_2\right)^{\!\top}"></div></foreignObject></g>
<g data-key="A1" data-only="1"><foreignObject x="141" y="46" width="210" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf z^{(1)} = \mathbf W^{(1)} \mathbf x^{(0)} + \mathbf b^{(1)}"></div></foreignObject></g>
<g data-key="A2" data-only="1"><foreignObject x="141" y="68" width="210" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)} = \sigma\!\left(\mathbf z^{(1)}\right)"></div></foreignObject></g>
<g data-key="B1" data-only="1"><foreignObject x="401" y="46" width="230" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)} = \mathbf W^{(2)} \mathbf h^{(1)} + \mathbf b^{(2)}"></div></foreignObject></g>
<g data-key="B2" data-only="1"><foreignObject x="401" y="68" width="230" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf h^{(2)} = \sigma\!\left(\mathbf z^{(2)}\right)"></div></foreignObject></g>
<g data-key="C1" data-only="1"><foreignObject x="640" y="46" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="e^{(3)}_i = \tfrac{1}{2}\left(h^{(2)}_i - y_i\right)^{2}"></div></foreignObject></g>
<g data-key="C2" data-only="1"><foreignObject x="640" y="68" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="E = e^{(3)}_1 + e^{(3)}_2"></div></foreignObject></g>
<g data-key="nin"><circle cx="62" cy="212" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="62" cy="332" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject></g>
<g data-key="gy"><circle cx="716" cy="154" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_1"></div></foreignObject><line x1="716" y1="172.5" x2="716" y2="184" stroke="#3576C0" stroke-width="1.8" marker-end="url(#fw-arb)"/><circle cx="716" cy="390" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_2"></div></foreignObject><line x1="716" y1="371.5" x2="716" y2="360" stroke="#3576C0" stroke-width="1.8" marker-end="url(#fw-arb)"/></g>
<g data-key="ew1"><line x1="88.5" y1="212" x2="164" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="81.472" y1="229.974" x2="171.426" y2="313.008" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="81.472" y1="314.026" x2="171.426" y2="230.992" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="88.5" y1="332" x2="164" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><circle cx="192" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_1"></div></foreignObject><line x1="192" y1="172.5" x2="192" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><circle cx="192" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_2"></div></foreignObject><line x1="192" y1="371.5" x2="192" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><foreignObject x="89" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{11}"></div></foreignObject><foreignObject x="88.1" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{21}"></div></foreignObject><foreignObject x="88.1" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{12}"></div></foreignObject><foreignObject x="89" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{22}"></div></foreignObject></g>
<g data-key="nz1"><circle cx="192" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_1"></div></foreignObject><circle cx="192" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_2"></div></foreignObject></g>
<g data-key="na1"><line x1="218.5" y1="212" x2="272" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="218.5" y1="332" x2="272" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><circle cx="300" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_1"></div></foreignObject><circle cx="300" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_2"></div></foreignObject></g>
<g data-key="ew2"><line x1="326.5" y1="212" x2="434" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="321.294" y1="227.774" x2="439.5" y2="315.334" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="321.294" y1="316.226" x2="439.5" y2="228.666" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="326.5" y1="332" x2="434" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><circle cx="462" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_1"></div></foreignObject><line x1="462" y1="172.5" x2="462" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><circle cx="462" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_2"></div></foreignObject><line x1="462" y1="371.5" x2="462" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{11}"></div></foreignObject><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{21}"></div></foreignObject><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{12}"></div></foreignObject><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{22}"></div></foreignObject></g>
<g data-key="nz2"><circle cx="462" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_1"></div></foreignObject><circle cx="462" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_2"></div></foreignObject></g>
<g data-key="na2"><line x1="488.5" y1="212" x2="542" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="488.5" y1="332" x2="542" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><circle cx="570" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_1"></div></foreignObject><circle cx="570" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_2"></div></foreignObject></g>
<g data-key="ner"><line x1="596.5" y1="212" x2="688" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="596.5" y1="332" x2="688" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><circle cx="716" cy="212" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_1"></div></foreignObject><circle cx="716" cy="332" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_2"></div></foreignObject><line x1="740.887" y1="221.105" x2="850.887" y2="261.349" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><line x1="740.887" y1="322.895" x2="850.887" y2="282.651" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fw-arw)"/><circle cx="880" cy="272" r="28" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="848" y="244" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="E"></div></foreignObject></g>
<g data-key="cch" data-only="1"><rect x="40" y="444" width="880" height="30" rx="9" fill="#F4F7EE" stroke="#73B222" stroke-opacity=".6"/><foreignObject x="50" y="447.02" width="860" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#4F7A16;font-weight:400"><span>Эти значения остаются в памяти: обратный проход берёт их готовыми</span></div></foreignObject></g>
<text x="40" y="496" class="legend">серые стрелки: прямой проход · синее: данные · жёлтое: обучаемые числа · зелёное: то, что посчитала модель · красное: потеря</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="D1 D2 nin gy mm0" data-focus="nin gy">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Один пример и одна цель</h4>
      <p>На вход подаём два числа, целью объявляем пару <span class="math-inline" data-tex="\mathbf y"></span>. Всё, что мы
      считаем дальше, относится к этому единственному примеру: в настоящем обучении
      градиенты усредняются по батчу, но формулы от этого не меняются.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 nin ew1 mm1" data-focus="ew1">
      <div class="step-kicker">Шаг 2 · параметры слоя</div>
      <h4>На рёбрах веса, в маленьких кружках смещения</h4>
      <p>Матрица <span class="math-inline" data-tex="\mathbf W^{(1)}"></span> это четыре подсвеченных ребра, а <span class="math-inline" data-tex="\mathbf b^{(1)}"></span> это два
      маленьких кружка над и под сумматорами, у каждого своё ребро. Под схемой подписано,
      какие у этого слоя параметры: матрица 2×2 и вектор длины 2. Удобно считать, что по
      ребру смещения всегда приходит единица: в части 3 это сразу даст формулу для
      <span class="math-inline" data-tex="\partial E/\partial b"></span>.</p>
      <div class="math-display" data-tex="\mathbf W^{(1)} = \begin{pmatrix} W^{(1)}_{11} &amp; W^{(1)}_{12} \\ W^{(1)}_{21} &amp; W^{(1)}_{22} \end{pmatrix}, \qquad \mathbf b^{(1)} = \begin{pmatrix} b^{(1)}_1 \\ b^{(1)}_2 \end{pmatrix}"></div>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 nin ew1 nz1 mm1" data-focus="nz1">
      <div class="step-kicker">Шаг 3 · сумматор</div>
      <h4>Единственное место, где веса участвуют в вычислении</h4>
      <p>Над этой колонкой стоит компактная форма. Ниже она же, раскрытая по клеткам:
      <em>строка</em> матрицы отвечает одному узлу следующего слоя, а <em>столбец</em>
      одному входу.</p>
      <div class="math-display" data-tex="\begin{pmatrix} z^{(1)}_1 \\ z^{(1)}_2 \end{pmatrix} = \begin{pmatrix} W^{(1)}_{11} &amp; W^{(1)}_{12} \\ W^{(1)}_{21} &amp; W^{(1)}_{22} \end{pmatrix}\begin{pmatrix} x^{(0)}_1 \\ x^{(0)}_2 \end{pmatrix} + \begin{pmatrix} b^{(1)}_1 \\ b^{(1)}_2 \end{pmatrix}"></div>
      <p>Производная по весу берётся отсюда: это единственная строка алгоритма, куда входит
      <span class="math-inline" data-tex="W"></span>.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 nz1 na1 mm2" data-focus="na1">
      <div class="step-kicker">Шаг 4 · активация</div>
      <h4>Нелинейность применяется покомпонентно</h4>
      <div class="math-display" data-tex="\begin{pmatrix} h^{(1)}_1 \\ h^{(1)}_2 \end{pmatrix} = \begin{pmatrix} \sigma\!\left(z^{(1)}_1\right) \\ \sigma\!\left(z^{(1)}_2\right) \end{pmatrix}, \qquad \sigma(s) = \frac{1}{1 + e^{-s}}"></div>
      <p>Компоненты не смешиваются. На обратном проходе производная активации тоже не будет
      их смешивать, поэтому вместо матрицы хватит поэлементного умножения.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 na1 ew2 nz2 mm3" data-focus="ew2 nz2">
      <div class="step-kicker">Шаг 5 · второй слой</div>
      <h4>Тот же приём ещё раз</h4>
      <div class="math-display" data-tex="\begin{pmatrix} z^{(2)}_1 \\ z^{(2)}_2 \end{pmatrix} = \begin{pmatrix} W^{(2)}_{11} &amp; W^{(2)}_{12} \\ W^{(2)}_{21} &amp; W^{(2)}_{22} \end{pmatrix}\begin{pmatrix} h^{(1)}_1 \\ h^{(1)}_2 \end{pmatrix} + \begin{pmatrix} b^{(2)}_1 \\ b^{(2)}_2 \end{pmatrix}"></div>
      <p>Второй слой не знает, что перед ним был первый: он видит вектор входов. Поэтому в
      конце получится одна формула на любой слой.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 nz2 na2 mm4" data-focus="na2">
      <div class="step-kicker">Шаг 6 · выход</div>
      <h4>Активации второго слоя дают ответ сети</h4>
      <p>Два числа от 0 до 1. Накопленные сверху формулы теперь читаются слева направо как
      сама схема: вход, слой 1, слой 2, ошибка.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 C1 C2 na2 gy ner mm5" data-focus="ner">
      <div class="step-kicker">Шаг 7 · ошибка</div>
      <h4>Два частных промаха и один общий счёт</h4>
      <div class="math-display" data-tex="E = \tfrac{1}{2}\left(h^{(2)}_1 - y_1\right)^{2} + \tfrac{1}{2}\left(h^{(2)}_2 - y_2\right)^{2}"></div>
      <p><span class="math-inline" data-tex="E"></span> это сумма, поэтому производная <span class="math-inline" data-tex="E"></span> по любому отдельному
      <span class="math-inline" data-tex="e"></span> равна единице, и первый шаг назад ничего не добавит в произведение.</p>
      <p>Узел <span class="math-inline" data-tex="E"></span> обведён красным: с него начнётся обратный проход.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 C1 C2 nin gy ew1 nz1 na1 ew2 nz2 na2 ner cch" data-focus="cch">
      <div class="step-kicker">Шаг 8 · зачем это запоминать</div>
      <h4>Прямой проход оставляет после себя кэш</h4>
      <p>Формулы обратного прохода состоят почти целиком из этих величин. Если бы они не
      хранились, каждый градиент требовал бы отдельного пересчёта сети. Плата за это
      память: она растёт с глубиной сети и размером батча, а не только с числом
      параметров.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 4 · тот же проход в числах

<p>
  Шаги совпадают с предыдущей сценой, меняются только формулы наверху и числа на
  схеме. Можно листать обе сцены параллельно.
</p>

<div class="stage" id="stageFwn" tabindex="0">
  <div class="stage-figure">
<svg class="mg" id="fwn" viewBox="0 0 960 512" role="img" aria-label="Прямой проход в числах: значения появляются рядом с узлами графа">
<defs><marker id="fwn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="fwn-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="fwn-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">вход и цель</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf z^{(1)}"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf h^{(1)}"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf z^{(2)}"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf h^{(2)}"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="785" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>ошибка <span data-tex="E"></span></span></div></foreignObject>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="62" y="128" class="cap" text-anchor="middle">вход</text><text x="192" y="128" class="cap" text-anchor="middle">сумматор</text><text x="300" y="128" class="cap" text-anchor="middle">активация</text><text x="462" y="128" class="cap" text-anchor="middle">сумматор</text><text x="570" y="128" class="cap" text-anchor="middle">активация</text><text x="716" y="128" class="cap" text-anchor="middle">ошибка</text><text x="880" y="128" class="cap" text-anchor="middle">итог</text>
<line x1="30" y1="414" x2="96" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="160" y1="414" x2="332" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="430" y1="414" x2="602" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="684" y1="414" x2="915" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><foreignObject x="-2" y="415.68" width="130" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вход: 2 числа</span></div></foreignObject><foreignObject x="146" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 1: <span data-tex="\mathbf W^{(1)}\ 2\times 2,\ \mathbf b^{(1)}\ 2"></span></span></div></foreignObject><foreignObject x="416" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 2: <span data-tex="\mathbf W^{(2)}\ 2\times 2,\ \mathbf b^{(2)}\ 2"></span></span></div></foreignObject><foreignObject x="680" y="415.68" width="240" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря: сумма по двум выходам</span></div></foreignObject>
<g data-key="D1" data-only="1"><foreignObject x="2" y="46" width="180" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf x^{(0)} = \left(0.5,\; 0.8\right)^{\!\top}"></div></foreignObject></g>
<g data-key="D2" data-only="1"><foreignObject x="2" y="68" width="180" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf y = \left(1,\; 0\right)^{\!\top}"></div></foreignObject></g>
<g data-key="A1" data-only="1"><foreignObject x="141" y="46" width="210" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf z^{(1)} = \left(0.0150,\; 0.3400\right)^{\!\top}"></div></foreignObject></g>
<g data-key="A2" data-only="1"><foreignObject x="141" y="68" width="210" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)} = \left(0.5037,\; 0.5842\right)^{\!\top}"></div></foreignObject></g>
<g data-key="B1" data-only="1"><foreignObject x="401" y="46" width="230" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)} = \left(0.1266,\; 0.6013\right)^{\!\top}"></div></foreignObject></g>
<g data-key="B2" data-only="1"><foreignObject x="401" y="68" width="230" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf h^{(2)} = \left(0.5316,\; 0.6459\right)^{\!\top}"></div></foreignObject></g>
<g data-key="C1" data-only="1"><foreignObject x="640" y="46" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf e^{(3)} = \left(0.1097,\; 0.2086\right)^{\!\top}"></div></foreignObject></g>
<g data-key="C2" data-only="1"><foreignObject x="640" y="68" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="E = 0.3183"></div></foreignObject></g>
<g data-key="sg1" data-only="1"><foreignObject x="141" y="90" width="210" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\sigma'\!\left(\mathbf z^{(1)}\right) = \left(0.2500,\; 0.2429\right)^{\!\top}"></div></foreignObject></g>
<g data-key="sg2" data-only="1"><foreignObject x="401" y="90" width="230" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\sigma'\!\left(\mathbf z^{(2)}\right) = \left(0.2490,\; 0.2287\right)^{\!\top}"></div></foreignObject></g>
<g data-key="nin"><circle cx="62" cy="212" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="62" cy="332" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject></g>
<g data-key="gy"><circle cx="716" cy="154" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject><line x1="716" y1="172.5" x2="716" y2="184" stroke="#3576C0" stroke-width="1.8" marker-end="url(#fwn-arb)"/><circle cx="716" cy="390" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject><line x1="716" y1="371.5" x2="716" y2="360" stroke="#3576C0" stroke-width="1.8" marker-end="url(#fwn-arb)"/></g>
<g data-key="ew1"><line x1="88.5" y1="212" x2="164" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="81.472" y1="229.974" x2="171.426" y2="313.008" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="81.472" y1="314.026" x2="171.426" y2="230.992" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="88.5" y1="332" x2="164" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><circle cx="192" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:10.5px;color:#111111;font-weight:400" data-tex="0.10"></div></foreignObject><line x1="192" y1="172.5" x2="192" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><circle cx="192" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:10.5px;color:#111111;font-weight:400" data-tex="-0.10"></div></foreignObject><line x1="192" y1="371.5" x2="192" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><foreignObject x="89" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="0.15"></div></foreignObject><foreignObject x="88.1" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="0.40"></div></foreignObject><foreignObject x="88.1" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="-0.20"></div></foreignObject><foreignObject x="89" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="0.30"></div></foreignObject></g>
<g data-key="nz1"><circle cx="192" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_1"></div></foreignObject><circle cx="192" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_2"></div></foreignObject></g>
<g data-key="na1"><line x1="218.5" y1="212" x2="272" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="218.5" y1="332" x2="272" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><circle cx="300" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_1"></div></foreignObject><circle cx="300" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_2"></div></foreignObject></g>
<g data-key="ew2"><line x1="326.5" y1="212" x2="434" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="321.294" y1="227.774" x2="439.5" y2="315.334" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="321.294" y1="316.226" x2="439.5" y2="228.666" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="326.5" y1="332" x2="434" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><circle cx="462" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:10.5px;color:#111111;font-weight:400" data-tex="0.05"></div></foreignObject><line x1="462" y1="172.5" x2="462" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><circle cx="462" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:10.5px;color:#111111;font-weight:400" data-tex="0.15"></div></foreignObject><line x1="462" y1="371.5" x2="462" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="0.50"></div></foreignObject><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="0.20"></div></foreignObject><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="-0.30"></div></foreignObject><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="0.60"></div></foreignObject></g>
<g data-key="nz2"><circle cx="462" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_1"></div></foreignObject><circle cx="462" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_2"></div></foreignObject></g>
<g data-key="na2"><line x1="488.5" y1="212" x2="542" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="488.5" y1="332" x2="542" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><circle cx="570" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_1"></div></foreignObject><circle cx="570" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_2"></div></foreignObject></g>
<g data-key="ner"><line x1="596.5" y1="212" x2="688" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="596.5" y1="332" x2="688" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><circle cx="716" cy="212" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_1"></div></foreignObject><circle cx="716" cy="332" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_2"></div></foreignObject><line x1="740.887" y1="221.105" x2="850.887" y2="261.349" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><line x1="740.887" y1="322.895" x2="850.887" y2="282.651" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fwn-arw)"/><circle cx="880" cy="272" r="28" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="848" y="244" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="E"></div></foreignObject></g>
<g data-key="vin" data-only="1"><foreignObject x="19" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.5"></div></foreignObject><foreignObject x="19" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.8"></div></foreignObject></g>
<g data-key="vz1" data-only="1"><foreignObject x="149" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.0150"></div></foreignObject><foreignObject x="149" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.3400"></div></foreignObject></g>
<g data-key="va1" data-only="1"><foreignObject x="257" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.5037"></div></foreignObject><foreignObject x="257" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.5842"></div></foreignObject></g>
<g data-key="vz2" data-only="1"><foreignObject x="419" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.1266"></div></foreignObject><foreignObject x="419" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.6013"></div></foreignObject></g>
<g data-key="va2" data-only="1"><foreignObject x="527" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.5316"></div></foreignObject><foreignObject x="527" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.6459"></div></foreignObject></g>
<g data-key="ver" data-only="1"><foreignObject x="673" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.1097"></div></foreignObject><foreignObject x="673" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.2086"></div></foreignObject><foreignObject x="840" y="302" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.3183"></div></foreignObject></g>
<g data-key="cch" data-only="1"><rect x="40" y="444" width="880" height="30" rx="9" fill="#F4F7EE" stroke="#73B222" stroke-opacity=".6"/><foreignObject x="50" y="447.02" width="860" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#4F7A16;font-weight:400"><span>Эти значения остаются в памяти: обратный проход берёт их готовыми</span></div></foreignObject></g>
<text x="40" y="496" class="legend">серые стрелки: прямой проход · синее: данные · жёлтое: обучаемые числа · зелёное: то, что посчитала модель · красное: потеря</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="D1 D2 nin gy mm0 vin" data-focus="nin gy">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>Вход (0.5, 0.8), цель (1, 0)</h4>
      <p>Сеть должна выдать единицу на первом выходе и ноль на втором.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 nin ew1 mm1 vin" data-focus="ew1">
      <div class="step-kicker">Шаг 2 · параметры</div>
      <h4>Двенадцать чисел, которые мы будем обучать</h4>
      <div class="math-display" data-tex="\begin{gathered} \mathbf W^{(1)} = \begin{pmatrix} 0.15 &amp; -0.20 \\ 0.40 &amp; 0.30 \end{pmatrix}, \quad \mathbf b^{(1)} = \begin{pmatrix} 0.10 \\ -0.10 \end{pmatrix} \\[6pt] \mathbf W^{(2)} = \begin{pmatrix} 0.50 &amp; -0.30 \\ 0.20 &amp; 0.60 \end{pmatrix}, \quad \mathbf b^{(2)} = \begin{pmatrix} 0.05 \\ 0.15 \end{pmatrix} \end{gathered}"></div>
      <p>Значения выбраны произвольно, но разные по знаку: так видно, как знаки
      распространяются назад.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 nin ew1 nz1 mm1 vin vz1" data-focus="nz1">
      <div class="step-kicker">Шаг 3 · сумматор</div>
      <h4>Первый узел почти обнулился</h4>
      <div class="math-display" data-tex="\begin{pmatrix} z^{(1)}_1 \\ z^{(1)}_2 \end{pmatrix} = \begin{pmatrix} 0.15 &amp; -0.20 \\ 0.40 &amp; 0.30 \end{pmatrix}\begin{pmatrix} 0.5 \\ 0.8 \end{pmatrix} + \begin{pmatrix} 0.10 \\ -0.10 \end{pmatrix} = \begin{pmatrix} 0.0150 \\ 0.3400 \end{pmatrix}"></div>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · те же данные на всём пути</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Раскрываем строки</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="z^{(1)}_{1}"></span></div>
            <div class="math-display worked-trace-math" data-tex="0.15\cdot 0.5 + (-0.20)\cdot 0.8 + 0.10 = 0.0150"></div>
            <div class="worked-trace-note">входы тянут в разные стороны</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="z^{(1)}_{2}"></span></div>
            <div class="math-display worked-trace-math" data-tex="0.40\cdot 0.5 + 0.30\cdot 0.8 - 0.10 = 0.3400"></div>
            <div class="worked-trace-note">здесь оба складываются в одну сторону</div>
          </div>
        </div>
        <p class="worked-reading">У первого узла вклады почти погасили друг друга. То же гашение мы увидим на обратном
        проходе.</p>
      </div>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 nz1 na1 mm2 vin vz1 va1" data-focus="na1">
      <div class="step-kicker">Шаг 4 · активация</div>
      <h4>Почти ноль на входе даёт почти 0.5 на выходе</h4>
      <p>Сигмоида в нуле проходит через середину, поэтому <span class="math-inline" data-tex="h^{(1)}_{1}"></span>
      получилось 0.5037. В этой точке производная сигмоиды максимальна и равна 0.25: это понадобится в
      части 9.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 na1 ew2 nz2 mm3 vin vz1 va1 vz2" data-focus="ew2 nz2">
      <div class="step-kicker">Шаг 5 · второй слой</div>
      <h4>Считаем сумматоры выхода</h4>
      <div class="math-display" data-tex="\begin{pmatrix} z^{(2)}_1 \\ z^{(2)}_2 \end{pmatrix} = \begin{pmatrix} 0.50 &amp; -0.30 \\ 0.20 &amp; 0.60 \end{pmatrix}\begin{pmatrix} 0.5037 \\ 0.5842 \end{pmatrix} + \begin{pmatrix} 0.05 \\ 0.15 \end{pmatrix} = \begin{pmatrix} 0.1266 \\ 0.6013 \end{pmatrix}"></div>
      <p>Здесь используются уже посчитанные <span class="math-inline" data-tex="\mathbf h^{(1)}"></span>. Эти же числа потом войдут в
      градиенты <span class="math-inline" data-tex="\mathbf W^{(2)}"></span> без пересчёта.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 nz2 na2 mm4 vin vz1 va1 vz2 va2" data-focus="na2">
      <div class="step-kicker">Шаг 6 · ответ сети</div>
      <h4>0.5316 и 0.6459</h4>
      <p>Первый выход недотягивает до цели 1, второй сильно превышает цель 0.</p>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 C1 C2 na2 gy ner mm5 vin vz1 va1 vz2 va2 ver" data-focus="ner">
      <div class="step-kicker">Шаг 7 · ошибка</div>
      <h4>Второй выход виноват вдвое сильнее</h4>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · где мы промахнулись</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Получили</span>
            <div class="math-display worked-math" data-tex="\mathbf h^{(2)} = (0.5316,\; 0.6459)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Ошибка</span>
            <div class="math-display worked-math" data-tex="E = 0.1097 + 0.2086 = 0.3183"></div>
          </div>
        </div>
        <p class="worked-reading">Вклад второго выхода в общую ошибку почти вдвое больше. Градиенты, идущие от него,
        тоже окажутся крупнее: это видно в части 3.</p>
      </div>
    </div>
    <div class="step-panel" data-on="D1 D2 A1 A2 B1 B2 C1 C2 nin gy ew1 nz1 na1 ew2 nz2 na2 ner cch vin vz1 va1 vz2 va2 ver sg1 sg2" data-focus="cch">
      <div class="step-kicker">Шаг 8 · кэш</div>
      <h4>Тринадцать чисел, из которых соберётся весь обратный проход</h4>
      <p>Наверху добавились производные сигмоиды в точках <span class="math-inline" data-tex="z"></span>: они считаются из
      уже сохранённых активаций. Сеть дальше мы не пересчитываем.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>


### Интерактив 5 · прямой проход в матричной форме

<p>
  Схема с кружками показывает, кто на кого влияет, но не показывает <em>формы</em>.
  В коде частая ошибка начинающих как раз несовпадение размерностей. Поэтому нарисуем
  те же формулы ещё раз, но теперь каждая матрица будет набором клеток.
</p>

<p>
  Слева стоит всё известное: вход, цель и параметры обоих слоёв. Справа формулы и
  пустые клетки, которые заполняются шаг за шагом. Под каждой матрицей подписана
  её форма.
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
    <foreignObject x="8" y="109.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf x^{(0)} ="></div></foreignObject>
    <rect x="140" y="100" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="167" y="117" class="ct" text-anchor="middle" fill="#5E5850">0.5</text>
    <rect x="140" y="126" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="167" y="143" class="ct" text-anchor="middle" fill="#5E5850">0.8</text>
    <text x="167" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <foreignObject x="188" y="109.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf y ="></div></foreignObject>
    <rect x="320" y="100" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="347" y="117" class="ct" text-anchor="middle" fill="#5E5850">1</text>
    <rect x="320" y="126" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="347" y="143" class="ct" text-anchor="middle" fill="#5E5850">0</text>
    <text x="347" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <foreignObject x="8" y="205.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#2A5E9B;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf W^{(1)} ="></div></foreignObject>
    <rect x="140" y="196" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="167" y="213" class="ct" text-anchor="middle" fill="#2A5E9B">0.15</text>
    <rect x="194" y="196" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="221" y="213" class="ct" text-anchor="middle" fill="#2A5E9B">−0.20</text>
    <rect x="140" y="222" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="167" y="239" class="ct" text-anchor="middle" fill="#2A5E9B">0.40</text>
    <rect x="194" y="222" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="221" y="239" class="ct" text-anchor="middle" fill="#2A5E9B">0.30</text>
    <text x="194" y="266" class="shape" text-anchor="middle">(2×2)</text>
    <foreignObject x="208" y="205.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#2A5E9B;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf b^{(1)} ="></div></foreignObject>
    <rect x="340" y="196" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="367" y="213" class="ct" text-anchor="middle" fill="#2A5E9B">0.10</text>
    <rect x="340" y="222" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="367" y="239" class="ct" text-anchor="middle" fill="#2A5E9B">−0.10</text>
    <text x="367" y="266" class="shape" text-anchor="middle">(2×1)</text>
    <foreignObject x="8" y="301.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#2A5E9B;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf W^{(2)} ="></div></foreignObject>
    <rect x="140" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="167" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">0.50</text>
    <rect x="194" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="221" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">−0.30</text>
    <rect x="140" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="167" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.20</text>
    <rect x="194" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="221" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.60</text>
    <text x="194" y="362" class="shape" text-anchor="middle">(2×2)</text>
    <foreignObject x="208" y="301.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#2A5E9B;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf b^{(2)} ="></div></foreignObject>
    <rect x="340" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="367" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">0.05</text>
    <rect x="340" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="367" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.15</text>
    <text x="367" y="362" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="96" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\mathbf z^{(1)} = \mathbf W^{(1)} \mathbf x^{(0)} + \mathbf b^{(1)}"></div>
    </foreignObject>
  <g data-key="f1e" data-only="1">
    <foreignObject x="848" y="105.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C9C2B8;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf z^{(1)} ="></div></foreignObject>
    <rect x="980" y="96" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="113" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="139" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="f1" data-only="1">
    <foreignObject x="848" y="105.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#4C8316;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf z^{(1)} ="></div></foreignObject>
    <rect x="980" y="96" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="113" class="ct" text-anchor="middle" fill="#4C8316">0.0150</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="139" class="ct" text-anchor="middle" fill="#4C8316">0.3400</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="184" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\mathbf h^{(1)} = \sigma\!\left(\mathbf z^{(1)}\right)"></div>
    </foreignObject>
  <g data-key="f2e" data-only="1">
    <foreignObject x="848" y="193.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C9C2B8;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf h^{(1)} ="></div></foreignObject>
    <rect x="980" y="184" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="201" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="210" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="227" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="254" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="f2" data-only="1">
    <foreignObject x="848" y="193.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#4C8316;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf h^{(1)} ="></div></foreignObject>
    <rect x="980" y="184" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="201" class="ct" text-anchor="middle" fill="#4C8316">0.5037</text>
    <rect x="980" y="210" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="227" class="ct" text-anchor="middle" fill="#4C8316">0.5842</text>
    <text x="1007" y="254" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="272" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\mathbf z^{(2)} = \mathbf W^{(2)} \mathbf h^{(1)} + \mathbf b^{(2)}"></div>
    </foreignObject>
  <g data-key="f3e" data-only="1">
    <foreignObject x="848" y="281.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C9C2B8;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf z^{(2)} ="></div></foreignObject>
    <rect x="980" y="272" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="289" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="315" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="342" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="f3" data-only="1">
    <foreignObject x="848" y="281.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#4C8316;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf z^{(2)} ="></div></foreignObject>
    <rect x="980" y="272" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="289" class="ct" text-anchor="middle" fill="#4C8316">0.1266</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="315" class="ct" text-anchor="middle" fill="#4C8316">0.6013</text>
    <text x="1007" y="342" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="360" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\mathbf h^{(2)} = \sigma\!\left(\mathbf z^{(2)}\right)"></div>
    </foreignObject>
  <g data-key="f4e" data-only="1">
    <foreignObject x="848" y="369.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C9C2B8;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf h^{(2)} ="></div></foreignObject>
    <rect x="980" y="360" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="377" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="403" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="430" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="f4" data-only="1">
    <foreignObject x="848" y="369.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#4C8316;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf h^{(2)} ="></div></foreignObject>
    <rect x="980" y="360" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="377" class="ct" text-anchor="middle" fill="#4C8316">0.5316</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="403" class="ct" text-anchor="middle" fill="#4C8316">0.6459</text>
    <text x="1007" y="430" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="448" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="E = \tfrac{1}{2}\left\|\mathbf h^{(2)} - \mathbf y\right\|^{2}"></div>
    </foreignObject>
  <g data-key="f5e" data-only="1">
    <foreignObject x="848" y="457.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C9C2B8;font-weight:600;text-align:right;justify-content:flex-end" data-tex="E ="></div></foreignObject>
    <rect x="980" y="461" width="80" height="26" rx="2" class="empty"/>
    <text x="1020" y="478" class="qt" text-anchor="middle">?</text>
    <text x="1020" y="505" class="shape" text-anchor="middle">(скаляр)</text>
  </g>
  <g data-key="f5" data-only="1">
    <foreignObject x="848" y="457.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#4C8316;font-weight:600;text-align:right;justify-content:flex-end" data-tex="E ="></div></foreignObject>
    <rect x="980" y="461" width="80" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1020" y="478" class="ct" text-anchor="middle" fill="#4C8316">0.3183</text>
    <text x="1020" y="505" class="shape" text-anchor="middle">(скаляр)</text>
  </g>
  <g data-key="nb" data-only="1">
    <rect x="40" y="520" width="1160" height="34" rx="9" fill="#EDF7DD" stroke="#73B222" stroke-width="1.6"/>
    <text x="620" y="543" class="note" text-anchor="middle" fill="#4C8316">Внутренние размеры схлопываются: (2×2)·(2×1) = (2×1). Активация форму не меняет вообще</text>
  </g>
  <text x="40" y="572" class="legend">серое: данные примера · синее: обучаемые параметры · зелёное: то, что вычислил прямой проход · в скобках форма матрицы</text>
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
      <p>Строка <span class="math-inline" data-tex="i"></span> матрицы <span class="math-inline" data-tex="\mathbf W^{(1)}"></span> собирает веса, ведущие в узел
      <span class="math-inline" data-tex="i"></span> следующего слоя, столбец <span class="math-inline" data-tex="j"></span> собирает веса, выходящие из
      входа <span class="math-inline" data-tex="j"></span>. Справа пока пунктир со знаками вопроса: эти клетки мы будем
      заполнять.</p>
      <p>Матричное умножение сводится к скалярным произведениям. Клетка <span class="math-inline" data-tex="i"></span>
      результата равна произведению строки <span class="math-inline" data-tex="i"></span> на весь вектор:</p>
      <div class="math-display" data-tex="\left(\mathbf W^{(1)} \mathbf x^{(0)}\right)_i = \sum_{j} W^{(1)}_{ij}\, x^{(0)}_j"></div>
    </div>
    <div class="step-panel" data-on="dat f1 f2e f3e f4e f5e" data-focus="f1">
      <div class="step-kicker">Шаг 2 · сумматор первого слоя</div>
      <h4>Две строки, два скалярных произведения</h4>
      <p>Формы сходятся так: <span class="math-inline" data-tex="(2\times 2) \cdot  (2\times 1)"></span> даёт <span class="math-inline" data-tex="(2\times 1)"></span>, двойка в
      середине исчезает. Смещение прибавляется покомпонентно и становится третьим
      слагаемым в каждой строке.</p>
      <div class="worked-example">
        <div class="worked-label">Раскрываем построчно</div>
        <div class="worked-trace">
          <div class="worked-trace-title"><span class="math-inline" data-tex="\mathbf W^{(1)}"></span> = (0.15, −0.20; 0.40, 0.30), <span class="math-inline" data-tex="\mathbf x^{(0)}"></span> = (0.5, 0.8), <span class="math-inline" data-tex="\mathbf b^{(1)}"></span> = (0.10, −0.10)</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="z^{(1)}_{1}"></span></div>
            <div class="math-display worked-trace-math" data-tex="\begin{gathered} 0.15\cdot 0.5 + (-0.20)\cdot 0.8 + 0.10 \\ = 0.075 - 0.160 + 0.100 = 0.0150 \end{gathered}"></div>
            <div class="worked-trace-note">вклады входов почти погасили друг друга</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="z^{(1)}_{2}"></span></div>
            <div class="math-display worked-trace-math" data-tex="\begin{gathered} 0.40\cdot 0.5 + 0.30\cdot 0.8 + (-0.10) \\ = 0.200 + 0.240 - 0.100 = 0.3400 \end{gathered}"></div>
            <div class="worked-trace-note">здесь оба входа тянут в одну сторону</div>
          </div>
        </div>
        <p class="worked-reading">Первый скрытый узел получил почти ноль, поэтому его активация окажется почти равна
        0.5: сигмоида в нуле проходит через середину.</p>
      </div>
    </div>
    <div class="step-panel" data-on="dat f1 f2 f3e f4e f5e" data-focus="f2">
      <div class="step-kicker">Шаг 3 · активация</div>
      <h4>Сигмоида: одно число на клетку</h4>
      <p>Функция применяется к каждой клетке отдельно, поэтому форма не меняется.</p>
      <div class="math-display" data-tex="h^{(1)}_1 = \frac{1}{1 + e^{-0.0150}} = 0.5037, \qquad h^{(1)}_2 = \frac{1}{1 + e^{-0.3400}} = 0.5842"></div>
      <p>Вокруг нуля сигмоида почти линейна с наклоном ¼: вход 0.0150 сдвинул
      выход от середины примерно на 0.0037, то есть на четверть входа.</p>
    </div>
    <div class="step-panel" data-on="dat f1 f2 f3 f4e f5e" data-focus="f3">
      <div class="step-kicker">Шаг 4 · сумматор второго слоя</div>
      <h4>Тот же блок, только вход другой</h4>
      <p>Вместо <span class="math-inline" data-tex="\mathbf x^{(0)}"></span> в скалярные произведения идёт <span class="math-inline" data-tex="\mathbf h^{(1)}"></span>. Строки
      устроены так же, поэтому глубокая сеть это повторение одного блока.</p>
      <div class="worked-example">
        <div class="worked-label">Раскрываем построчно</div>
        <div class="worked-trace">
          <div class="worked-trace-title"><span class="math-inline" data-tex="\mathbf W^{(2)}"></span> = (0.50, −0.30; 0.20, 0.60), <span class="math-inline" data-tex="\mathbf h^{(1)}"></span> = (0.5037, 0.5842), <span class="math-inline" data-tex="\mathbf b^{(2)}"></span> = (0.05, 0.15)</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="z^{(2)}_{1}"></span></div>
            <div class="math-display worked-trace-math" data-tex="\begin{gathered} 0.50\cdot 0.5037 + (-0.30)\cdot 0.5842 + 0.05 \\ = 0.2519 - 0.1753 + 0.0500 = 0.1266 \end{gathered}"></div>
            <div class="worked-trace-note">второй скрытый узел работает против первого</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="z^{(2)}_{2}"></span></div>
            <div class="math-display worked-trace-math" data-tex="\begin{gathered} 0.20\cdot 0.5037 + 0.60\cdot 0.5842 + 0.15 \\ = 0.1008 + 0.3505 + 0.1500 = 0.6013 \end{gathered}"></div>
            <div class="worked-trace-note">оба узла и смещение складываются</div>
          </div>
        </div>
        <p class="worked-reading">Знаки в строках матрицы решают, складываются вклады или гасятся. У второго выхода все
        вклады сложились, поэтому он дальше от нуля.</p>
      </div>
    </div>
    <div class="step-panel" data-on="dat f1 f2 f3 f4 f5e" data-focus="f4">
      <div class="step-kicker">Шаг 5 · выход сети</div>
      <h4>0.5316 и 0.6459</h4>
      <div class="math-display" data-tex="h^{(2)}_1 = \frac{1}{1 + e^{-0.1266}} = 0.5316, \qquad h^{(2)}_2 = \frac{1}{1 + e^{-0.6013}} = 0.6459"></div>
      <p>Первый выход должен был стать единицей, второй нулём. Промахи в разные стороны:
      −0.4684 и +0.6459. С этих двух разностей начнётся обратный проход.</p>
    </div>
    <div class="step-panel" data-on="dat f1 f2 f3 f4 f5" data-focus="f5">
      <div class="step-kicker">Шаг 6 · ошибка</div>
      <h4>Единственное место, где размерность падает до скаляра</h4>
      <p>Разность <span class="math-inline" data-tex="\mathbf h^{(2)} - \mathbf y"></span> ещё столбец <span class="math-inline" data-tex="(2\times 1)"></span>, но
      половина квадрата нормы сворачивает его в одно число.</p>
      <div class="math-display" data-tex="E = \tfrac{1}{2}\left(0.5316 - 1\right)^{2} + \tfrac{1}{2}\left(0.6459 - 0\right)^{2} = \tfrac{1}{2}(0.4684)^{2} + \tfrac{1}{2}(0.6459)^{2}"></div>
      <div class="math-display" data-tex="E = 0.1097 + 0.2086 = 0.3183"></div>
      <p>Вклад второго выхода почти вдвое больше, и градиенты от него окажутся крупнее.</p>
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
        <p class="worked-reading">Форму выхода
        слоя задаёт только высота его матрицы весов. Если размерности сошлись, код
        почти наверняка делает то, что вы задумали.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-blue">
  <strong>Про батчи:</strong> в реальном коде вход обычно не столбец, а матрица
  <span class="math-inline" data-tex="[B\times m]"></span>, по строке на пример из мини-батча, и тогда формулу пишут в
  зеркальном виде <span class="math-inline" data-tex="Z = XW + b"></span>. Математика та же, но всё транспонировано. Мы держимся
  столбцов, чтобы индексы совпадали со схемой сети.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> разрезав нейрон на сумматор и активацию, мы получили схему, где у каждого ребра и
  каждого узла своя простая производная, а прямой проход сохранил все числа, которые
  для них понадобятся.
</div>

---

## Часть 3. Последний слой: цепочка на каждый параметр

<p>
  У последнего слоя шесть параметров: четыре веса и два смещения. Для каждого нужен
  свой ответ на вопрос «насколько изменится <span class="math-inline" data-tex="E"></span>, если подвинуть этот
  параметр». Выведем все шесть и увидим, что различаются они одним множителем.
</p>

<p>
  На схеме каждый узел это функция, каждое ребро это умножение на вес. Двигаясь от
  <span class="math-inline" data-tex="E"></span> назад, на каждом шаге берём производную текущего узла по предыдущему и
  домножаем на накопленное.
</p>

<div class="math-display" data-tex="\frac{\partial E}{\partial W^{(2)}_{ij}} = \underbrace{\frac{\partial E}{\partial e^{(3)}_i}}_{=\,1}\cdot\frac{\partial e^{(3)}_i}{\partial h^{(2)}_i}\cdot\frac{\partial h^{(2)}_i}{\partial z^{(2)}_i}\cdot\frac{\partial z^{(2)}_i}{\partial W^{(2)}_{ij}}"></div>

<div class="callout-blue">
  <strong>Почему в цепочке только одна ошибка:</strong> вес <span class="math-inline" data-tex="W^{(2)}_{ij}"></span> влияет ровно на один выход. Пути от него до второй ошибки на
  схеме нет, поэтому в формулу она не входит. Для весов первого слоя это уже не так:
  там появятся развилки.
</div>

<p>Три множителя, которые нам понадобятся, читаются прямо со схемы:</p>

<table class="shape-table">
  <tr><th>Производная</th><th>Чему равна</th><th>Откуда видно</th></tr>
  <tr><td><span class="math-inline" data-tex="\partial e/\partial h"></span></td><td><span class="math-inline" data-tex="h - \mathbf y"></span></td><td>из выбранной функции потерь</td></tr>
  <tr><td><span class="math-inline" data-tex="\partial h/\partial z"></span></td><td><span class="math-inline" data-tex="\sigma '(z)"></span></td><td>активация действует поэлементно</td></tr>
  <tr><td><span class="math-inline" data-tex="\partial z/\partial w"></span></td><td>то, что вошло в ребро</td><td>сумматор линеен по весам</td></tr>
  <tr><td><span class="math-inline" data-tex="\partial z/\partial b"></span></td><td><span class="math-inline" data-tex="1"></span></td><td>смещение входит без множителя</td></tr>
</table>

### Интерактив 6 · шесть цепочек в переменных

<div class="stage" id="stageLt" tabindex="0">
  <div class="stage-figure">
<svg class="mg" id="lt" viewBox="0 0 960 600" role="img" aria-label="Цепочка производных для каждого веса и смещения последнего слоя на графе сети">
<defs><marker id="lt-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="lt-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="lt-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">что ищем</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\delta^{(2)}_1"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial W^{(2)}_{1j}"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\delta^{(2)}_2"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial W^{(2)}_{2j}"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="785" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial \mathbf b^{(2)}"></span></span></div></foreignObject>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="62" y="128" class="cap" text-anchor="middle">вход</text><text x="192" y="128" class="cap" text-anchor="middle">сумматор</text><text x="300" y="128" class="cap" text-anchor="middle">активация</text><text x="462" y="128" class="cap" text-anchor="middle">сумматор</text><text x="570" y="128" class="cap" text-anchor="middle">активация</text><text x="716" y="128" class="cap" text-anchor="middle">ошибка</text><text x="880" y="128" class="cap" text-anchor="middle">итог</text>
<line x1="30" y1="414" x2="96" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="160" y1="414" x2="332" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="430" y1="414" x2="602" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="684" y1="414" x2="915" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><foreignObject x="-2" y="415.68" width="130" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вход: 2 числа</span></div></foreignObject><foreignObject x="146" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 1: <span data-tex="\mathbf W^{(1)}\ 2\times 2,\ \mathbf b^{(1)}\ 2"></span></span></div></foreignObject><foreignObject x="416" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 2: <span data-tex="\mathbf W^{(2)}\ 2\times 2,\ \mathbf b^{(2)}\ 2"></span></span></div></foreignObject><foreignObject x="680" y="415.68" width="240" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря: сумма по двум выходам</span></div></foreignObject>
<g data-key="D1" data-only="1"><foreignObject x="1" y="46" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial E / \partial \mathbf W^{(2)} = \,?"></div></foreignObject></g>
<g data-key="A1" data-only="1"><foreignObject x="1" y="68" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial z^{(2)}_i / \partial W^{(2)}_{ij} = h^{(1)}_j"></div></foreignObject></g>
<g data-key="A2" data-only="1"><foreignObject x="1" y="90" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial z^{(2)}_i / \partial b^{(2)}_i = 1"></div></foreignObject></g>
<g data-key="B1" data-only="1"><foreignObject x="200" y="46" width="290" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\delta^{(2)}_1 = \left(h^{(2)}_1 - y_1\right)\sigma'\!\left(z^{(2)}_1\right)"></div></foreignObject></g>
<g data-key="B2" data-only="1"><foreignObject x="200" y="68" width="290" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\delta^{(2)}_2 = \left(h^{(2)}_2 - y_2\right)\sigma'\!\left(z^{(2)}_2\right)"></div></foreignObject></g>
<g data-key="C1" data-only="1"><foreignObject x="535" y="46" width="390" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial E / \partial e^{(3)}_i = 1"></div></foreignObject></g>
<g data-key="C2" data-only="1"><foreignObject x="535" y="68" width="390" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial e^{(3)}_i / \partial h^{(2)}_i = h^{(2)}_i - y_i"></div></foreignObject></g>
<g data-key="C3" data-only="1"><foreignObject x="535" y="90" width="390" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial h^{(2)}_i / \partial z^{(2)}_i = \sigma'\!\left(z^{(2)}_i\right)"></div></foreignObject></g>
<g data-key="left"><line x1="88.5" y1="212" x2="164" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="81.472" y1="229.974" x2="171.426" y2="313.008" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="81.472" y1="314.026" x2="171.426" y2="230.992" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="88.5" y1="332" x2="164" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><circle cx="192" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_1"></div></foreignObject><line x1="192" y1="172.5" x2="192" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><circle cx="192" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_2"></div></foreignObject><line x1="192" y1="371.5" x2="192" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><circle cx="62" cy="212" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="62" cy="332" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><circle cx="192" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_1"></div></foreignObject><circle cx="192" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_2"></div></foreignObject><line x1="218.5" y1="212" x2="272" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="218.5" y1="332" x2="272" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/></g>
<g data-key="map"><circle cx="300" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_1"></div></foreignObject><circle cx="300" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_2"></div></foreignObject><line x1="326.5" y1="212" x2="434" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="321.294" y1="227.774" x2="439.5" y2="315.334" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="321.294" y1="316.226" x2="439.5" y2="228.666" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="326.5" y1="332" x2="434" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><circle cx="462" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_1"></div></foreignObject><line x1="462" y1="172.5" x2="462" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><circle cx="462" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_2"></div></foreignObject><line x1="462" y1="371.5" x2="462" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><circle cx="462" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_1"></div></foreignObject><circle cx="462" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_2"></div></foreignObject><line x1="488.5" y1="212" x2="542" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="488.5" y1="332" x2="542" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><circle cx="570" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_1"></div></foreignObject><circle cx="570" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_2"></div></foreignObject><line x1="596.5" y1="212" x2="688" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="596.5" y1="332" x2="688" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><circle cx="716" cy="212" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_1"></div></foreignObject><circle cx="716" cy="332" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_2"></div></foreignObject><line x1="740.887" y1="221.105" x2="850.887" y2="261.349" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><line x1="740.887" y1="322.895" x2="850.887" y2="282.651" stroke="#5E5850" stroke-width="1.8" marker-end="url(#lt-arw)"/><circle cx="880" cy="272" r="28" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="848" y="244" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="E"></div></foreignObject><circle cx="716" cy="154" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_1"></div></foreignObject><line x1="716" y1="172.5" x2="716" y2="184" stroke="#3576C0" stroke-width="1.8" marker-end="url(#lt-arb)"/><circle cx="716" cy="390" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_2"></div></foreignObject><line x1="716" y1="371.5" x2="716" y2="360" stroke="#3576C0" stroke-width="1.8" marker-end="url(#lt-arb)"/></g>
<g data-key="yl11" data-only="1"><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{11}"></div></foreignObject></g>
<g data-key="yl21" data-only="1"><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{21}"></div></foreignObject></g>
<g data-key="yl12" data-only="1"><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{12}"></div></foreignObject></g>
<g data-key="yl22" data-only="1"><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{22}"></div></foreignObject></g>
<g data-key="allw" data-only="1"><line x1="325" y1="212" x2="437" y2="212" stroke="#C29E08" stroke-width="3.4"/><line x1="320.089" y1="226.881" x2="441.911" y2="317.119" stroke="#C29E08" stroke-width="3.4"/><line x1="320.089" y1="317.119" x2="441.911" y2="226.881" stroke="#C29E08" stroke-width="3.4"/><line x1="325" y1="332" x2="437" y2="332" stroke="#C29E08" stroke-width="3.4"/></g>
<g data-key="pb" data-only="1"><circle cx="462" cy="154" r="19" fill="none" stroke="#C29E08" stroke-width="3"/><circle cx="462" cy="390" r="19" fill="none" stroke="#C29E08" stroke-width="3"/></g>
<g data-key="out1" data-only="1"><line x1="852.296" y1="261.864" x2="742.295" y2="221.62" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><line x1="689.5" y1="212" x2="598" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><line x1="543.5" y1="212" x2="490" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><foreignObject x="793" y="220" width="30" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="1"></div></foreignObject><foreignObject x="591" y="187" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="h^{(2)}_1 - y_1"></div></foreignObject><foreignObject x="464" y="187" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#9C0908;font-weight:400" data-tex="\sigma'\!\left(z^{(2)}_1\right)"></div></foreignObject><foreignObject x="419" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_1"></div></foreignObject></g>
<g data-key="out2" data-only="1"><line x1="852.296" y1="282.136" x2="742.295" y2="322.38" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><line x1="689.5" y1="332" x2="598" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><line x1="543.5" y1="332" x2="490" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><foreignObject x="793" y="304" width="30" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="1"></div></foreignObject><foreignObject x="591" y="333" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="h^{(2)}_2 - y_2"></div></foreignObject><foreignObject x="464" y="333" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#9C0908;font-weight:400" data-tex="\sigma'\!\left(z^{(2)}_2\right)"></div></foreignObject><foreignObject x="419" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_2"></div></foreignObject></g>
<g data-key="w11" data-only="1"><line x1="435.5" y1="212" x2="328" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(2)}_{11}"></div></foreignObject></g>
<g data-key="w21" data-only="1"><line x1="440.706" y1="316.226" x2="322.5" y2="228.666" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(2)}_{21}"></div></foreignObject></g>
<g data-key="w12" data-only="1"><line x1="440.706" y1="227.774" x2="322.5" y2="315.334" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(2)}_{12}"></div></foreignObject></g>
<g data-key="w22" data-only="1"><line x1="435.5" y1="332" x2="328" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(2)}_{22}"></div></foreignObject></g>
<g data-key="ab1" data-only="1"><line x1="462" y1="185.5" x2="462" y2="174" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><foreignObject x="480" y="142" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial b^{(2)}_1"></div></foreignObject></g>
<g data-key="ab2" data-only="1"><line x1="462" y1="358.5" x2="462" y2="370" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lt-arr)"/><foreignObject x="480" y="378" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial b^{(2)}_2"></div></foreignObject></g>
<g data-key="q11" data-only="1"><rect x="40" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="40" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(2)}_{11} = \delta^{(2)}_1\, h^{(1)}_1"></div></foreignObject></g>
<g data-key="q12" data-only="1"><rect x="336" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="336" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(2)}_{12} = \delta^{(2)}_1\, h^{(1)}_2"></div></foreignObject></g>
<g data-key="gb1" data-only="1"><rect x="632" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="632" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial b^{(2)}_{1} = \delta^{(2)}_1"></div></foreignObject></g>
<g data-key="q21" data-only="1"><rect x="40" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="40" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(2)}_{21} = \delta^{(2)}_2\, h^{(1)}_1"></div></foreignObject></g>
<g data-key="q22" data-only="1"><rect x="336" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="336" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(2)}_{22} = \delta^{(2)}_2\, h^{(1)}_2"></div></foreignObject></g>
<g data-key="gb2" data-only="1"><rect x="632" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="632" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial b^{(2)}_{2} = \delta^{(2)}_2"></div></foreignObject></g>
<g data-key="sum" data-only="1"><rect x="40" y="538" width="880" height="30" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-opacity=".6"/><foreignObject x="50" y="541.02" width="860" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400"><span>Шесть параметров слоя, шесть цепочек: различается только последний множитель</span></div></foreignObject></g>
<text x="40" y="590" class="legend">красное: обратный проход и производные · жёлтое: параметры и сигнал по ним · внизу копятся готовые градиенты</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="map D1 allw pb yl11 yl12 yl21 yl22 mm0" data-focus="allw pb">
      <div class="step-kicker">Шаг 1 · что ищем</div>
      <h4>Шесть чисел, а не одно</h4>
      <p>Четыре веса и два смещения последнего слоя. Наверху над каждой колонкой появятся её локальные производные, а готовые градиенты
      будут копиться внизу: к последнему шагу все шесть окажутся там рядом.</p>
    </div>
    <div class="step-panel" data-on="map D1 C1 C2 C3 B1 out1 yl11 yl12 yl21 yl22 mm1" data-focus="out1">
      <div class="step-kicker">Шаг 2 · общий кусок для выхода 1</div>
      <h4>Путь от ошибки до сумматора первого выхода</h4>
      <p>Он одинаков для всех параметров, ведущих в узел <span class="math-inline" data-tex="z^{(2)}_{1}"></span>.
      Посчитаем его один раз и назовём дельтой.</p>
      <div class="math-display" data-tex="\delta^{(2)}_1 = \frac{\partial E}{\partial z^{(2)}_1} = \frac{\partial E}{\partial e^{(3)}_1}\cdot\frac{\partial e^{(3)}_1}{\partial h^{(2)}_1}\cdot\frac{\partial h^{(2)}_1}{\partial z^{(2)}_1} = 1\cdot\left(h^{(2)}_1 - y_1\right)\cdot\sigma'\!\left(z^{(2)}_1\right)"></div>
      <p>Дельта показывает чувствительность общей ошибки к сумматору этого узла.</p>
    </div>
    <div class="step-panel" data-on="map D1 C1 C2 C3 B1 A1 q11 out1 w11 yl12 yl21 yl22 mm2" data-focus="w11">
      <div class="step-kicker">Шаг 3 · параметр 1 из 6</div>
      <h4>Вес из первого скрытого узла в первый выход</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(2)}_{11}} = \frac{\partial E}{\partial z^{(2)}_1}\cdot\frac{\partial z^{(2)}_1}{\partial W^{(2)}_{11}} = \delta^{(2)}_1\, h^{(1)}_1"></div>
      <p>К общему куску добавляется последний множитель: то, что вошло в ребро.</p>
    </div>
    <div class="step-panel" data-on="map D1 C1 C2 C3 B1 A1 q11 q12 out1 w11 w12 yl21 yl22 mm2" data-focus="w12">
      <div class="step-kicker">Шаг 4 · параметр 2 из 6</div>
      <h4>Вес из второго скрытого узла в тот же выход</h4>
      <p>Начало цепочки то же: сравните две формулы внизу. Изменился только конец: теперь по
      ребру приходит <span class="math-inline" data-tex="h^{(1)}_{2}"></span>.</p>
    </div>
    <div class="step-panel" data-on="map C1 C2 C3 B1 B2 A1 q11 q12 out2 w11 w12 yl21 yl22 mm3" data-focus="out2">
      <div class="step-kicker">Шаг 5 · общий кусок для выхода 2</div>
      <h4>Вторая дельта</h4>
      <p>Симметрично первой, но с индексом 2: другая ошибка, другая точка, в которой берётся
      производная сигмоиды. На двух выходных узлах две дельты.</p>
    </div>
    <div class="step-panel" data-on="map C1 C2 C3 B1 B2 A1 q11 q12 q21 out2 w11 w12 w21 yl22 mm4" data-focus="w21">
      <div class="step-kicker">Шаг 6 · параметр 3 из 6</div>
      <h4>Вес из первого скрытого узла во второй выход</h4>
      <p>Дельта вторая, вход ребра снова <span class="math-inline" data-tex="h^{(1)}_{1}"></span>. Первый индекс веса выбирает
      дельту, второй выбирает активацию.</p>
    </div>
    <div class="step-panel" data-on="map C1 C2 C3 B1 B2 A1 q11 q12 q21 q22 out2 w11 w12 w21 w22 mm4" data-focus="w22">
      <div class="step-kicker">Шаг 7 · параметр 4 из 6</div>
      <h4>Последний вес слоя</h4>
      <p>Четыре формулы стоят рядом внизу, и все имеют вид «дельта выходного узла × активация
      входного». Верхняя строка относится к первому выходу, нижняя ко второму: это уже
      готовая матрица 2×2.</p>
    </div>
    <div class="step-panel" data-on="map B1 B2 A2 q11 q12 q21 q22 gb1 gb2 out1 out2 w11 w12 w21 w22 ab1 ab2 pb mm5" data-focus="ab1 ab2 pb">
      <div class="step-kicker">Шаг 8 · параметры 5 и 6</div>
      <h4>Для смещений множитель равен единице</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial b^{(2)}_i} = \frac{\partial E}{\partial z^{(2)}_i}\cdot\underbrace{\frac{\partial z^{(2)}_i}{\partial b^{(2)}_i}}_{=\,1} = \delta^{(2)}_i"></div>
      <p>Поэтому вход не стоит в формуле градиента смещения отдельным множителем, в отличие от формулы градиента веса.</p>
    </div>
    <div class="step-panel" data-on="map B1 B2 q11 q12 q21 q22 gb1 gb2 w11 w12 w21 w22 ab1 ab2 sum mm5" data-focus="sum">
      <div class="step-kicker">Шаг 9 · сводка</div>
      <h4>Все шесть формул на одном экране</h4>
      <p>В каждой только дельта и активация: производные и функция потерь уже вошли в
      <span class="math-inline" data-tex="\boldsymbol\delta^{(2)}"></span>. Соберём четыре весовые формулы в таблицу:</p>
      <div class="math-display" data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}} = \begin{pmatrix} \delta^{(2)}_1 h^{(1)}_1 &amp; \delta^{(2)}_1 h^{(1)}_2 \\ \delta^{(2)}_2 h^{(1)}_1 &amp; \delta^{(2)}_2 h^{(1)}_2 \end{pmatrix}"></div>
      <p>Такая одинаковость позволяет перейти к матрицам: это часть 4.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 7 · те же шесть цепочек в числах

<p>
  Шаги совпадают с предыдущей сценой: где там стояла формула
  <span class="math-inline" data-tex="\delta^{(2)}_{1}\cdot h^{(1)}_{1}"></span>, здесь стоит её значение.
</p>

<div class="stage" id="stageLtn" tabindex="0">
  <div class="stage-figure">
<svg class="mg" id="ltn" viewBox="0 0 960 600" role="img" aria-label="Те же шесть цепочек последнего слоя, в которые подставлены числа">
<defs><marker id="ltn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="ltn-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="ltn-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">что ищем</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\delta^{(2)}_1"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial W^{(2)}_{1j}"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\delta^{(2)}_2"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial W^{(2)}_{2j}"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="785" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial \mathbf b^{(2)}"></span></span></div></foreignObject>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="62" y="128" class="cap" text-anchor="middle">вход</text><text x="192" y="128" class="cap" text-anchor="middle">сумматор</text><text x="300" y="128" class="cap" text-anchor="middle">активация</text><text x="462" y="128" class="cap" text-anchor="middle">сумматор</text><text x="570" y="128" class="cap" text-anchor="middle">активация</text><text x="716" y="128" class="cap" text-anchor="middle">ошибка</text><text x="880" y="128" class="cap" text-anchor="middle">итог</text>
<line x1="30" y1="414" x2="96" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="160" y1="414" x2="332" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="430" y1="414" x2="602" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="684" y1="414" x2="915" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><foreignObject x="-2" y="415.68" width="130" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вход: 2 числа</span></div></foreignObject><foreignObject x="146" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 1: <span data-tex="\mathbf W^{(1)}\ 2\times 2,\ \mathbf b^{(1)}\ 2"></span></span></div></foreignObject><foreignObject x="416" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 2: <span data-tex="\mathbf W^{(2)}\ 2\times 2,\ \mathbf b^{(2)}\ 2"></span></span></div></foreignObject><foreignObject x="680" y="415.68" width="240" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря: сумма по двум выходам</span></div></foreignObject>
<g data-key="D1" data-only="1"><foreignObject x="1" y="46" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)} = \left(0.5037,\; 0.5842\right)"></div></foreignObject></g>
<g data-key="A1" data-only="1"><foreignObject x="1" y="68" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial z^{(2)}_i / \partial W^{(2)}_{ij} = h^{(1)}_j"></div></foreignObject></g>
<g data-key="A2" data-only="1"><foreignObject x="1" y="90" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial z^{(2)}_i / \partial b^{(2)}_i = 1"></div></foreignObject></g>
<g data-key="B1" data-only="1"><foreignObject x="200" y="46" width="290" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\delta^{(2)}_1 = (-0.4684)(0.2490) = -0.1166"></div></foreignObject></g>
<g data-key="B2" data-only="1"><foreignObject x="200" y="68" width="290" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\delta^{(2)}_2 = (0.6459)(0.2287) = 0.1477"></div></foreignObject></g>
<g data-key="C1" data-only="1"><foreignObject x="535" y="46" width="390" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial E / \partial e^{(3)}_i = 1"></div></foreignObject></g>
<g data-key="C2" data-only="1"><foreignObject x="535" y="68" width="390" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf h^{(2)} - \mathbf y = \left(-0.4684,\; 0.6459\right)"></div></foreignObject></g>
<g data-key="C3" data-only="1"><foreignObject x="535" y="90" width="390" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\sigma'\!\left(\mathbf z^{(2)}\right) = \left(0.2490,\; 0.2287\right)"></div></foreignObject></g>
<g data-key="left"><line x1="88.5" y1="212" x2="164" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="81.472" y1="229.974" x2="171.426" y2="313.008" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="81.472" y1="314.026" x2="171.426" y2="230.992" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="88.5" y1="332" x2="164" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><circle cx="192" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_1"></div></foreignObject><line x1="192" y1="172.5" x2="192" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><circle cx="192" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_2"></div></foreignObject><line x1="192" y1="371.5" x2="192" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><circle cx="62" cy="212" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="62" cy="332" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><circle cx="192" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_1"></div></foreignObject><circle cx="192" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_2"></div></foreignObject><line x1="218.5" y1="212" x2="272" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="218.5" y1="332" x2="272" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/></g>
<g data-key="map"><circle cx="300" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_1"></div></foreignObject><circle cx="300" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_2"></div></foreignObject><line x1="326.5" y1="212" x2="434" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="321.294" y1="227.774" x2="439.5" y2="315.334" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="321.294" y1="316.226" x2="439.5" y2="228.666" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="326.5" y1="332" x2="434" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><circle cx="462" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_1"></div></foreignObject><line x1="462" y1="172.5" x2="462" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><circle cx="462" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_2"></div></foreignObject><line x1="462" y1="371.5" x2="462" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><circle cx="462" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_1"></div></foreignObject><circle cx="462" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_2"></div></foreignObject><line x1="488.5" y1="212" x2="542" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="488.5" y1="332" x2="542" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><circle cx="570" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_1"></div></foreignObject><circle cx="570" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_2"></div></foreignObject><line x1="596.5" y1="212" x2="688" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="596.5" y1="332" x2="688" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><circle cx="716" cy="212" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_1"></div></foreignObject><circle cx="716" cy="332" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_2"></div></foreignObject><line x1="740.887" y1="221.105" x2="850.887" y2="261.349" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><line x1="740.887" y1="322.895" x2="850.887" y2="282.651" stroke="#5E5850" stroke-width="1.8" marker-end="url(#ltn-arw)"/><circle cx="880" cy="272" r="28" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="848" y="244" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="E"></div></foreignObject><circle cx="716" cy="154" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_1"></div></foreignObject><line x1="716" y1="172.5" x2="716" y2="184" stroke="#3576C0" stroke-width="1.8" marker-end="url(#ltn-arb)"/><circle cx="716" cy="390" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_2"></div></foreignObject><line x1="716" y1="371.5" x2="716" y2="360" stroke="#3576C0" stroke-width="1.8" marker-end="url(#ltn-arb)"/></g>
<g data-key="yl11" data-only="1"><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{11}"></div></foreignObject></g>
<g data-key="yl21" data-only="1"><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{21}"></div></foreignObject></g>
<g data-key="yl12" data-only="1"><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{12}"></div></foreignObject></g>
<g data-key="yl22" data-only="1"><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{22}"></div></foreignObject></g>
<g data-key="allw" data-only="1"><line x1="325" y1="212" x2="437" y2="212" stroke="#C29E08" stroke-width="3.4"/><line x1="320.089" y1="226.881" x2="441.911" y2="317.119" stroke="#C29E08" stroke-width="3.4"/><line x1="320.089" y1="317.119" x2="441.911" y2="226.881" stroke="#C29E08" stroke-width="3.4"/><line x1="325" y1="332" x2="437" y2="332" stroke="#C29E08" stroke-width="3.4"/></g>
<g data-key="pb" data-only="1"><circle cx="462" cy="154" r="19" fill="none" stroke="#C29E08" stroke-width="3"/><circle cx="462" cy="390" r="19" fill="none" stroke="#C29E08" stroke-width="3"/></g>
<g data-key="out1" data-only="1"><line x1="852.296" y1="261.864" x2="742.295" y2="221.62" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><line x1="689.5" y1="212" x2="598" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><line x1="543.5" y1="212" x2="490" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><foreignObject x="793" y="220" width="30" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="1"></div></foreignObject><foreignObject x="591" y="187" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="-0.4684"></div></foreignObject><foreignObject x="464" y="187" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#9C0908;font-weight:400" data-tex="0.2490"></div></foreignObject><foreignObject x="419" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="-0.1166"></div></foreignObject></g>
<g data-key="out2" data-only="1"><line x1="852.296" y1="282.136" x2="742.295" y2="322.38" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><line x1="689.5" y1="332" x2="598" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><line x1="543.5" y1="332" x2="490" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><foreignObject x="793" y="304" width="30" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="1"></div></foreignObject><foreignObject x="591" y="333" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="0.6459"></div></foreignObject><foreignObject x="464" y="333" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#9C0908;font-weight:400" data-tex="0.2287"></div></foreignObject><foreignObject x="419" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="0.1477"></div></foreignObject></g>
<g data-key="w11" data-only="1"><line x1="435.5" y1="212" x2="328" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="-0.0588"></div></foreignObject></g>
<g data-key="w21" data-only="1"><line x1="440.706" y1="316.226" x2="322.5" y2="228.666" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="0.0744"></div></foreignObject></g>
<g data-key="w12" data-only="1"><line x1="440.706" y1="227.774" x2="322.5" y2="315.334" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="-0.0681"></div></foreignObject></g>
<g data-key="w22" data-only="1"><line x1="435.5" y1="332" x2="328" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="0.0863"></div></foreignObject></g>
<g data-key="ab1" data-only="1"><line x1="462" y1="185.5" x2="462" y2="174" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><foreignObject x="480" y="142" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="-0.1166"></div></foreignObject></g>
<g data-key="ab2" data-only="1"><line x1="462" y1="358.5" x2="462" y2="370" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#ltn-arr)"/><foreignObject x="480" y="378" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="0.1477"></div></foreignObject></g>
<g data-key="vh1" data-only="1"><foreignObject x="257" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.5037"></div></foreignObject><foreignObject x="257" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.5842"></div></foreignObject></g>
<g data-key="q11" data-only="1"><rect x="40" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="40" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(2)}_{11} = (-0.1166)(0.5037) = -0.0588"></div></foreignObject></g>
<g data-key="q12" data-only="1"><rect x="336" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="336" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(2)}_{12} = (-0.1166)(0.5842) = -0.0681"></div></foreignObject></g>
<g data-key="gb1" data-only="1"><rect x="632" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="632" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial b^{(2)}_{1} = -0.1166"></div></foreignObject></g>
<g data-key="q21" data-only="1"><rect x="40" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="40" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(2)}_{21} = (0.1477)(0.5037) = 0.0744"></div></foreignObject></g>
<g data-key="q22" data-only="1"><rect x="336" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="336" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(2)}_{22} = (0.1477)(0.5842) = 0.0863"></div></foreignObject></g>
<g data-key="gb2" data-only="1"><rect x="632" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="632" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial b^{(2)}_{2} = 0.1477"></div></foreignObject></g>
<g data-key="sum" data-only="1"><rect x="40" y="538" width="880" height="30" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-opacity=".6"/><foreignObject x="50" y="541.02" width="860" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400"><span>Шесть параметров слоя, шесть цепочек: различается только последний множитель</span></div></foreignObject></g>
<text x="40" y="590" class="legend">красное: обратный проход и производные · жёлтое: параметры и сигнал по ним · внизу копятся готовые градиенты</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="map D1 allw pb yl11 yl12 yl21 yl22 mm0" data-focus="allw pb">
      <div class="step-kicker">Шаг 1 · что берём из кэша</div>
      <h4>Нужны четыре вектора</h4>
      <p>Активации первого слоя, выход сети, цель и производная сигмоиды в точках
      <span class="math-inline" data-tex="\mathbf z^{(2)}"></span>. Всё это уже посчитано на прямом проходе.</p>
    </div>
    <div class="step-panel" data-on="map D1 C1 C2 C3 B1 out1 yl11 yl12 yl21 yl22 mm1" data-focus="out1">
      <div class="step-kicker">Шаг 2 · дельта первого выхода</div>
      <h4>Минус означает «поднимай»</h4>
      <p>Промах равен −0.4684: выход ниже цели. Домножаем на производную сигмоиды 0.2490, она почти в максимуме, и получаем
      <span class="math-inline" data-tex="\delta^{(2)}_{1} = -0.1166"></span>.</p>
    </div>
    <div class="step-panel" data-on="map D1 C1 C2 C3 B1 A1 q11 out1 w11 yl12 yl21 yl22 mm2 vh1" data-focus="w11">
      <div class="step-kicker">Шаг 3 · параметр 1 из 6</div>
      <h4>−0.0588</h4>
      <p>Градиент отрицательный: шаг спуска пойдёт в противоположную сторону, то есть этот вес
      вырастет, и первый выход поднимется.</p>
    </div>
    <div class="step-panel" data-on="map D1 C1 C2 C3 B1 A1 q11 q12 out1 w11 w12 yl21 yl22 mm2 vh1" data-focus="w12">
      <div class="step-kicker">Шаг 4 · параметр 2 из 6</div>
      <h4>−0.0681</h4>
      <p>Тот же множитель дельты, но активация больше (0.5842 против 0.5037),
      поэтому и градиент больше по модулю. У веса от узла с большей активацией поправка
      больше.</p>
    </div>
    <div class="step-panel" data-on="map C1 C2 C3 B1 B2 A1 q11 q12 out2 w11 w12 yl21 yl22 mm3 vh1" data-focus="out2">
      <div class="step-kicker">Шаг 5 · дельта второго выхода</div>
      <h4>Плюс означает «опускай»</h4>
      <p>Промах 0.6459 при цели ноль, производная 0.2287, отсюда
      <span class="math-inline" data-tex="\delta^{(2)}_{2} = 0.1477"></span>. По модулю больше первой дельты: этот выход ошибся
      сильнее.</p>
    </div>
    <div class="step-panel" data-on="map C1 C2 C3 B1 B2 A1 q11 q12 q21 out2 w11 w12 w21 yl22 mm4 vh1" data-focus="w21">
      <div class="step-kicker">Шаг 6 · параметр 3 из 6</div>
      <h4>0.0744</h4>
      <p>Положительный: вес будет уменьшаться.</p>
    </div>
    <div class="step-panel" data-on="map C1 C2 C3 B1 B2 A1 q11 q12 q21 q22 out2 w11 w12 w21 w22 mm4 vh1" data-focus="w22">
      <div class="step-kicker">Шаг 7 · параметр 4 из 6</div>
      <h4>0.0863: самый крупный градиент среди весов слоя</h4>
      <p>Здесь сошлись самая большая дельта и самая большая активация.</p>
    </div>
    <div class="step-panel" data-on="map B1 B2 A2 q11 q12 q21 q22 gb1 gb2 out1 out2 w11 w12 w21 w22 ab1 ab2 pb mm5 vh1" data-focus="ab1 ab2 pb">
      <div class="step-kicker">Шаг 8 · параметры 5 и 6</div>
      <h4>Градиенты смещений равны дельтам</h4>
      <p>−0.1166 и 0.1477, без дополнительного умножения. Оба крупнее любого из весовых
      градиентов этого слоя.</p>
    </div>
    <div class="step-panel" data-on="map B1 B2 q11 q12 q21 q22 gb1 gb2 w11 w12 w21 w22 ab1 ab2 sum mm5 vh1" data-focus="sum">
      <div class="step-kicker">Шаг 9 · сводка</div>
      <h4>Шесть чисел последнего слоя</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}} = \begin{pmatrix} -0.0588 &amp; -0.0681 \\ 0.0744 &amp; 0.0863 \end{pmatrix}, \qquad \frac{\partial E}{\partial \mathbf b^{(2)}} = \begin{pmatrix} -0.1166 \\ 0.1477 \end{pmatrix}"></div>
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
            <div class="math-display worked-trace-math" data-tex="\mathrm{sign} = \mathrm{sign}\left(\boldsymbol\delta^{(2)}\right)"></div>
            <div class="worked-trace-note">знак всей строки задаёт дельта выходного узла</div>
          </div>
        </div>
        <p class="worked-reading">Матрица градиентов равна произведению двух векторов, поэтому её четыре числа не
        независимы. Это мы оформим в следующей части.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> все шесть градиентов слоя строятся из двух дельт. Градиент веса равен дельте его
  выходного узла, умноженной на вход ребра. Градиент смещения равен самой дельте.
</div>

---

## Часть 4. Компактная запись последнего слоя

<p>
  В части 3 мы шли по узлам: так формулы выводятся, но так их не хранят. Тот же результат
  даёт работа сразу с векторами и матрицами как с целыми объектами графа вычислений.
  Переведём шесть скалярных формул на этот язык.
</p>

<p>
  Первые два множителя каждой цепочки зависят только от номера <em>выхода</em>, а не
  от того, из какого узла выходит вес. Это дельта, записанная вектором целиком.
</p>

<div class="math-display" data-tex="\boldsymbol\delta^{(2)} = \frac{\partial E}{\partial \mathbf h^{(2)}} \odot \sigma'\!\left(\mathbf z^{(2)}\right)"></div>

<div class="callout-blue">
  <strong>Что означает <span class="math-inline" data-tex="\odot"></span>:</strong> поэлементное умножение векторов.
  Формально здесь стоит диагональная матрица Якоби активации. Сигмоида применяется к
  каждой компоненте отдельно, поэтому вне диагонали нули, и умножение на такую матрицу
  сводится к поэлементному.
</div>

<p>
  В правом верхнем углу сцены стоит уменьшенная схема сети: она показывает, какой
  кусок мы сейчас разбираем.
</p>

### Интерактив 8 · от четырёх формул к одной матрице

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

  <text x="33" y="32" class="cap">Четыре веса последнего слоя: четыре цепочки одинакового устройства</text>

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
  <foreignObject x="590" y="21.68" width="120" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12px;color:#8A8378;font-weight:400;text-align:center;justify-content:center" data-tex="\mathbf x^{(0)}"></div></foreignObject>
  <foreignObject x="670" y="21.68" width="120" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12px;color:#8A8378;font-weight:400;text-align:center;justify-content:center" data-tex="\mathbf h^{(1)}"></div></foreignObject>
  <foreignObject x="750" y="21.68" width="120" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12px;color:#8A8378;font-weight:400;text-align:center;justify-content:center" data-tex="\mathbf h^{(2)}"></div></foreignObject>
  <foreignObject x="830" y="21.68" width="120" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12px;color:#8A8378;font-weight:400;text-align:center;justify-content:center" data-tex="E"></div></foreignObject>
  <foreignObject x="330" y="121.68" width="880" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12px;color:#8A8378;font-weight:400;text-align:center;justify-content:center"><span>разбираем жёлтый слой: <span data-tex="\mathbf W^{(2)}"></span> и <span data-tex="\mathbf b^{(2)}"></span></span></div></foreignObject>

  <g data-key="eqs" data-only="1">
    <foreignObject x="33" y="44" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial W^{(2)}_{11}} = \textcolor{#C29E08}{\left(h^{(2)}_1 - y_1\right)\,\sigma'\!\left(z^{(2)}_1\right)}\;h^{(1)}_1"></div>
    </foreignObject>
    <foreignObject x="33" y="86" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial W^{(2)}_{12}} = \textcolor{#C29E08}{\left(h^{(2)}_1 - y_1\right)\,\sigma'\!\left(z^{(2)}_1\right)}\;h^{(1)}_2"></div>
    </foreignObject>
    <foreignObject x="33" y="128" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial W^{(2)}_{21}} = \textcolor{#C29E08}{\left(h^{(2)}_2 - y_2\right)\,\sigma'\!\left(z^{(2)}_2\right)}\;h^{(1)}_1"></div>
    </foreignObject>
    <foreignObject x="33" y="170" width="560" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial W^{(2)}_{22}} = \textcolor{#C29E08}{\left(h^{(2)}_2 - y_2\right)\,\sigma'\!\left(z^{(2)}_2\right)}\;h^{(1)}_2"></div>
    </foreignObject>
  </g>

  <g data-key="rep" data-only="1">
    <text x="33" y="238" class="note" fill="#8C7106">Жёлтая часть зависит только от номера выхода: у пары 11 и 12 она общая, у 21 и 22 своя</text>
  </g>

  <g data-key="dlt" data-only="1">
    <rect x="33" y="252" width="430" height="56" rx="10" class="br"/>
    <rect x="493" y="252" width="430" height="56" rx="10" class="br"/>
    <foreignObject x="45" y="264" width="406" height="34">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{(2)}_1 = \left(h^{(2)}_1 - y_1\right)\sigma'\!\left(z^{(2)}_1\right) = -0.1166"></div>
    </foreignObject>
    <foreignObject x="505" y="264" width="406" height="34">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{(2)}_2 = \left(h^{(2)}_2 - y_2\right)\sigma'\!\left(z^{(2)}_2\right) = 0.1477"></div>
    </foreignObject>
  </g>

  <g data-key="rew" data-only="1">
    <foreignObject x="33" y="324" width="890" height="44">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\frac{\partial E}{\partial W^{(2)}_{11}} = \delta^{(2)}_1 h^{(1)}_1, \qquad \frac{\partial E}{\partial W^{(2)}_{12}} = \delta^{(2)}_1 h^{(1)}_2"></div>
    </foreignObject>
    <foreignObject x="33" y="370" width="890" height="44">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\frac{\partial E}{\partial W^{(2)}_{21}} = \delta^{(2)}_2 h^{(1)}_1, \qquad \frac{\partial E}{\partial W^{(2)}_{22}} = \delta^{(2)}_2 h^{(1)}_2"></div>
    </foreignObject>
  </g>

  <g data-key="mat" data-only="1">
    <rect x="33" y="426" width="580" height="76" rx="12" class="by"/>
    <foreignObject x="45" y="436" width="556" height="58">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}} = \begin{pmatrix} \delta^{(2)}_1 \\[4pt] \delta^{(2)}_2 \end{pmatrix}\begin{pmatrix} h^{(1)}_1 &amp; h^{(1)}_2 \end{pmatrix} = \boldsymbol\delta^{(2)}\left(\mathbf h^{(1)}\right)^{\!\top}"></div>
    </foreignObject>
  </g>

  <g data-key="bia" data-only="1">
    <rect x="633" y="426" width="290" height="76" rx="12" class="by"/>
    <foreignObject x="645" y="436" width="266" height="58">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial \mathbf b^{(2)}} = \boldsymbol\delta^{(2)}"></div>
    </foreignObject>
  </g>

  <g data-key="num" data-only="1">
    <rect x="33" y="518" width="890" height="80" rx="12" class="bb"/>
    <foreignObject x="45" y="526" width="866" height="64">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}} = \begin{pmatrix} -0.1166 \\[4pt] 0.1477 \end{pmatrix}\begin{pmatrix} 0.5037 &amp; 0.5842 \end{pmatrix} = \begin{pmatrix} -0.0588 &amp; -0.0681 \\[4pt] 0.0744 &amp; 0.0863 \end{pmatrix}"></div>
    </foreignObject>
  </g>

  <text x="33" y="628" class="legend">красное: сигнал ошибки, идущий назад · жёлтое: параметры и их градиенты · синее: числа сквозного примера</text>
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
      <p>Строки 1 и 2 начинаются одинаково: обе идут в первый выход. Строки 3 и 4 совпадают
      между собой. Считать одно и то же дважды незачем.</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt" data-focus="dlt">
      <div class="step-kicker">Шаг 3 · вводим дельту</div>
      <h4>Повторяющийся кусок получает имя</h4>
      <p>Дельта это единственная величина, которую слой передаёт соседнему слою, и на ней
      держится экономия алгоритма.</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt rew" data-focus="rew">
      <div class="step-kicker">Шаг 4 · переписываем</div>
      <h4>Формулы стали двухбуквенными</h4>
      <p>Индексы читаются так: строка показывает, куда ребро ведёт, столбец откуда выходит.
      Ради этого совпадения в нотации весов сначала стоит «куда», потом «откуда».</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt rew mat" data-focus="mat">
      <div class="step-kicker">Шаг 5 · матричная форма</div>
      <h4>Столбец на строку даёт внешнее произведение</h4>
      <p>Разложите четыре равенства по клеткам матрицы 2×2, и получится таблица умножения:
      вектор дельт по вертикали, вектор активаций по горизонтали.</p>
      <p>Проверка размерностей: столбец 2×1 на строку 1×2 даёт 2×2, форму <span class="math-inline" data-tex="\mathbf W^{(2)}"></span>.
      Градиент всегда той же формы, что и параметр, иначе его нельзя было бы вычесть.</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt rew mat bia" data-focus="bia">
      <div class="step-kicker">Шаг 6 · смещения</div>
      <h4>Градиент смещений равен дельте</h4>
      <p>Градиент вектора смещений равен вектору дельт. В коде эта строка обычно выглядит как
      присваивание.</p>
    </div>
    <div class="step-panel" data-on="eqs rep dlt rew mat bia num" data-focus="num">
      <div class="step-kicker">Шаг 7 · числа</div>
      <h4>Вся матрица градиентов за одно умножение</h4>
      <p>Значение −0.0588 в левом верхнем углу это градиент, который мы выводили руками.
      Остальные три получились попутно, а строки и столбцы оказались пропорциональны.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> градиент весов слоя равен внешнему произведению дельты на вход слоя,
  <span class="math-inline" data-tex="\partial E/\partial W = \delta \cdot h^{\top}"></span>, а градиент смещений равен самой дельте. Результат тот же,
  что в части 3, записанный целиком.
</div>

---

## Часть 5. Первый слой: развилка вперёд, сумма назад

<p>
  С параметрами первого слоя появляется новое обстоятельство. Активация
  <span class="math-inline" data-tex="h^{(1)}_{1}"></span> уходит не в один узел, а во все узлы следующего слоя, и через
  каждый влияет на общую ошибку. Значит, путей от параметра до <span class="math-inline" data-tex="E"></span>
  теперь несколько.
</p>

<p>
  Правило такое: <strong>если из узла вперёд выходит несколько рёбер, назад по ним
  приходят вклады, и эти вклады складываются.</strong>
</p>

<div class="math-display" data-tex="\frac{\partial E}{\partial h^{(1)}_j} = \sum_{k} \frac{\partial E}{\partial z^{(2)}_k}\cdot\frac{\partial z^{(2)}_k}{\partial h^{(1)}_j} = \sum_{k} \delta^{(2)}_k\, W^{(2)}_{kj}"></div>

<div class="callout-blue">
  <strong>Откуда взялась дельта:</strong> выражение <span class="math-inline" data-tex="\partial E/\partial z^{(2)}_{k}"></span> мы уже посчитали в части 4. Предыдущий слой оставил
  готовый результат, и второй раз его не считают: поэтому бэкпроп быстрый.
</div>

### Интерактив 9 · шесть цепочек первого слоя в переменных

<div class="stage" id="stageFb" tabindex="0">
  <div class="stage-figure">
<svg class="mg" id="fb" viewBox="0 0 960 600" role="img" aria-label="Развилки и суммы ветвей при выводе градиентов первого слоя на графе сети">
<defs><marker id="fb-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="fb-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="fb-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">что ищем</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">развилка</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">сумма ветвей</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\boldsymbol\delta^{(1)}"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial \mathbf W^{(1)}"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="785" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial \mathbf b^{(1)}"></span></span></div></foreignObject>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="62" y="128" class="cap" text-anchor="middle">вход</text><text x="192" y="128" class="cap" text-anchor="middle">сумматор</text><text x="300" y="128" class="cap" text-anchor="middle">активация</text><text x="462" y="128" class="cap" text-anchor="middle">сумматор</text><text x="570" y="128" class="cap" text-anchor="middle">активация</text><text x="716" y="128" class="cap" text-anchor="middle">ошибка</text><text x="880" y="128" class="cap" text-anchor="middle">итог</text>
<line x1="30" y1="414" x2="96" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="160" y1="414" x2="332" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="430" y1="414" x2="602" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="684" y1="414" x2="915" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><foreignObject x="-2" y="415.68" width="130" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вход: 2 числа</span></div></foreignObject><foreignObject x="146" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 1: <span data-tex="\mathbf W^{(1)}\ 2\times 2,\ \mathbf b^{(1)}\ 2"></span></span></div></foreignObject><foreignObject x="416" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 2: <span data-tex="\mathbf W^{(2)}\ 2\times 2,\ \mathbf b^{(2)}\ 2"></span></span></div></foreignObject><foreignObject x="680" y="415.68" width="240" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря: сумма по двум выходам</span></div></foreignObject>
<g data-key="D1" data-only="1"><foreignObject x="1" y="46" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial E / \partial \mathbf W^{(1)} = \,?"></div></foreignObject></g>
<g data-key="D2" data-only="1"><foreignObject x="1" y="68" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial E / \partial \mathbf b^{(1)} = \,?"></div></foreignObject></g>
<g data-key="D3" data-only="1"><foreignObject x="1" y="90" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial z^{(1)}_i / \partial W^{(1)}_{ij} = x^{(0)}_j"></div></foreignObject></g>
<g data-key="A1" data-only="1"><foreignObject x="195" y="46" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial E / \partial h^{(1)}_1 = \delta^{(2)}_1 W^{(2)}_{11} + \delta^{(2)}_2 W^{(2)}_{21}"></div></foreignObject></g>
<g data-key="A2" data-only="1"><foreignObject x="195" y="68" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial E / \partial h^{(1)}_2 = \delta^{(2)}_1 W^{(2)}_{12} + \delta^{(2)}_2 W^{(2)}_{22}"></div></foreignObject></g>
<g data-key="A3" data-only="1"><foreignObject x="195" y="90" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\delta^{(1)}_j = \partial E / \partial h^{(1)}_j \cdot \sigma'\!\left(z^{(1)}_j\right)"></div></foreignObject></g>
<g data-key="B1" data-only="1"><foreignObject x="520" y="46" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial z^{(2)}_k / \partial h^{(1)}_j = W^{(2)}_{kj}"></div></foreignObject></g>
<g data-key="C1" data-only="1"><foreignObject x="715" y="46" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\boldsymbol\delta^{(2)} = \partial E / \partial \mathbf z^{(2)}"></div></foreignObject></g>
<g data-key="map"><circle cx="62" cy="212" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="62" cy="332" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><line x1="88.5" y1="212" x2="164" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="81.472" y1="229.974" x2="171.426" y2="313.008" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="81.472" y1="314.026" x2="171.426" y2="230.992" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="88.5" y1="332" x2="164" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="192" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_1"></div></foreignObject><line x1="192" y1="172.5" x2="192" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="192" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_2"></div></foreignObject><line x1="192" y1="371.5" x2="192" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="192" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_1"></div></foreignObject><circle cx="192" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_2"></div></foreignObject><line x1="218.5" y1="212" x2="272" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="218.5" y1="332" x2="272" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="300" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_1"></div></foreignObject><circle cx="300" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_2"></div></foreignObject><line x1="326.5" y1="212" x2="434" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="321.294" y1="227.774" x2="439.5" y2="315.334" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="321.294" y1="316.226" x2="439.5" y2="228.666" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="326.5" y1="332" x2="434" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="462" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_1"></div></foreignObject><line x1="462" y1="172.5" x2="462" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="462" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_2"></div></foreignObject><line x1="462" y1="371.5" x2="462" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="462" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_1"></div></foreignObject><circle cx="462" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_2"></div></foreignObject><line x1="488.5" y1="212" x2="542" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="488.5" y1="332" x2="542" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="570" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_1"></div></foreignObject><circle cx="570" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_2"></div></foreignObject><line x1="596.5" y1="212" x2="688" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="596.5" y1="332" x2="688" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="716" cy="212" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_1"></div></foreignObject><circle cx="716" cy="332" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_2"></div></foreignObject><line x1="740.887" y1="221.105" x2="850.887" y2="261.349" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><line x1="740.887" y1="322.895" x2="850.887" y2="282.651" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fb-arw)"/><circle cx="880" cy="272" r="28" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="848" y="244" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="E"></div></foreignObject><circle cx="716" cy="154" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_1"></div></foreignObject><line x1="716" y1="172.5" x2="716" y2="184" stroke="#3576C0" stroke-width="1.8" marker-end="url(#fb-arb)"/><circle cx="716" cy="390" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_2"></div></foreignObject><line x1="716" y1="371.5" x2="716" y2="360" stroke="#3576C0" stroke-width="1.8" marker-end="url(#fb-arb)"/></g>
<g data-key="yk11" data-only="1"><foreignObject x="89" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{11}"></div></foreignObject></g>
<g data-key="yl11" data-only="1"><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{11}"></div></foreignObject></g>
<g data-key="yk21" data-only="1"><foreignObject x="88.1" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{21}"></div></foreignObject></g>
<g data-key="yl21" data-only="1"><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{21}"></div></foreignObject></g>
<g data-key="yk12" data-only="1"><foreignObject x="88.1" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{12}"></div></foreignObject></g>
<g data-key="yl12" data-only="1"><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{12}"></div></foreignObject></g>
<g data-key="yk22" data-only="1"><foreignObject x="89" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{22}"></div></foreignObject></g>
<g data-key="yl22" data-only="1"><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{22}"></div></foreignObject></g>
<g data-key="allw" data-only="1"><line x1="87" y1="212" x2="167" y2="212" stroke="#C29E08" stroke-width="3.4"/><line x1="80.37" y1="228.957" x2="173.63" y2="315.043" stroke="#C29E08" stroke-width="3.4"/><line x1="80.37" y1="315.043" x2="173.63" y2="228.957" stroke="#C29E08" stroke-width="3.4"/><line x1="87" y1="332" x2="167" y2="332" stroke="#C29E08" stroke-width="3.4"/></g>
<g data-key="pb" data-only="1"><circle cx="192" cy="154" r="19" fill="none" stroke="#C29E08" stroke-width="3"/><circle cx="192" cy="390" r="19" fill="none" stroke="#C29E08" stroke-width="3"/></g>
<g data-key="out" data-only="1"><line x1="852.296" y1="261.864" x2="742.295" y2="221.62" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><line x1="689.5" y1="212" x2="598" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><line x1="543.5" y1="212" x2="490" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="419" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_1"></div></foreignObject><line x1="852.296" y1="282.136" x2="742.295" y2="322.38" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><line x1="689.5" y1="332" x2="598" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><line x1="543.5" y1="332" x2="490" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="419" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_2"></div></foreignObject></g>
<g data-key="fk1" data-only="1"><line x1="435.5" y1="212" x2="328" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_1 W^{(2)}_{11}"></div></foreignObject><line x1="440.706" y1="316.226" x2="322.5" y2="228.666" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_2 W^{(2)}_{21}"></div></foreignObject></g>
<g data-key="fk2" data-only="1"><line x1="440.706" y1="227.774" x2="322.5" y2="315.334" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_1 W^{(2)}_{12}"></div></foreignObject><line x1="435.5" y1="332" x2="328" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_2 W^{(2)}_{22}"></div></foreignObject></g>
<g data-key="tl1" data-only="1"><line x1="273.5" y1="212" x2="220" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="194" y="187" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#9C0908;font-weight:400" data-tex="\sigma'\!\left(z^{(1)}_1\right)"></div></foreignObject><foreignObject x="149" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(1)}_1"></div></foreignObject></g>
<g data-key="tl2" data-only="1"><line x1="273.5" y1="332" x2="220" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="194" y="333" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#9C0908;font-weight:400" data-tex="\sigma'\!\left(z^{(1)}_2\right)"></div></foreignObject><foreignObject x="149" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\delta^{(1)}_2"></div></foreignObject></g>
<g data-key="w11" data-only="1"><line x1="165.5" y1="212" x2="90" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="89" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="\partial W^{(1)}_{11}"></div></foreignObject></g>
<g data-key="w21" data-only="1"><line x1="172.528" y1="314.026" x2="82.574" y2="230.992" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="88.1" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="\partial W^{(1)}_{21}"></div></foreignObject></g>
<g data-key="w12" data-only="1"><line x1="172.528" y1="229.974" x2="82.574" y2="313.008" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="88.1" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="\partial W^{(1)}_{12}"></div></foreignObject></g>
<g data-key="w22" data-only="1"><line x1="165.5" y1="332" x2="90" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="89" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="\partial W^{(1)}_{22}"></div></foreignObject></g>
<g data-key="ab1" data-only="1"><line x1="192" y1="185.5" x2="192" y2="174" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="210" y="142" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial b^{(1)}_1"></div></foreignObject></g>
<g data-key="ab2" data-only="1"><line x1="192" y1="358.5" x2="192" y2="370" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fb-arr)"/><foreignObject x="210" y="378" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial b^{(1)}_2"></div></foreignObject></g>
<g data-key="r11" data-only="1"><rect x="40" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="40" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(1)}_{11} = \delta^{(1)}_1 x^{(0)}_1"></div></foreignObject></g>
<g data-key="r12" data-only="1"><rect x="336" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="336" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(1)}_{12} = \delta^{(1)}_1 x^{(0)}_2"></div></foreignObject></g>
<g data-key="rb1" data-only="1"><rect x="632" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="632" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial b^{(1)}_1 = \delta^{(1)}_1"></div></foreignObject></g>
<g data-key="r21" data-only="1"><rect x="40" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="40" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(1)}_{21} = \delta^{(1)}_2 x^{(0)}_1"></div></foreignObject></g>
<g data-key="r22" data-only="1"><rect x="336" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="336" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(1)}_{22} = \delta^{(1)}_2 x^{(0)}_2"></div></foreignObject></g>
<g data-key="rb2" data-only="1"><rect x="632" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="632" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\partial E / \partial b^{(1)}_2 = \delta^{(1)}_2"></div></foreignObject></g>
<g data-key="sum" data-only="1"><rect x="40" y="538" width="880" height="30" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".6"/><foreignObject x="50" y="541.02" width="860" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400"><span>К первому слою сигнал приходит ослабленным: ветви частично гасят друг друга</span></div></foreignObject></g>
<text x="40" y="590" class="legend">красное: обратный проход и производные · жёлтое: параметры и сигнал по ним · внизу копятся готовые градиенты</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="map D1 D2 allw pb yk11 yk12 yk21 yk22 yl11 yl12 yl21 yl22 mm0" data-focus="allw pb">
      <div class="step-kicker">Шаг 1 · что ищем</div>
      <h4>Снова шесть параметров</h4>
      <p>Четыре веса и два смещения первого слоя. Ответ устроен так же, как раньше, но путь к нему длиннее.</p>
    </div>
    <div class="step-panel" data-on="map D1 D2 C1 B1 out fk1 yk11 yk12 yk21 yk22 yl12 yl22 mm1" data-focus="fk1">
      <div class="step-kicker">Шаг 2 · развилка</div>
      <h4>Один узел влияет на оба выхода</h4>
      <p>Всё, что меняет <span class="math-inline" data-tex="h^{(1)}_{1}"></span>, меняет и <span class="math-inline" data-tex="z^{(2)}_{1}"></span>, и
      <span class="math-inline" data-tex="z^{(2)}_{2}"></span>. Производная линейного узла по своему входу равна весу ребра, поэтому оба вклада
      читаются со схемы.</p>
      <div class="math-display" data-tex="\frac{\partial z^{(2)}_k}{\partial h^{(1)}_j} = W^{(2)}_{kj}"></div>
    </div>
    <div class="step-panel" data-on="map D1 D2 C1 B1 A1 out fk1 yk11 yk12 yk21 yk22 yl12 yl22 mm2" data-focus="fk1">
      <div class="step-kicker">Шаг 3 · сумма для первого узла</div>
      <h4>Складываем вклады обеих ветвей</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial h^{(1)}_1} = \frac{\partial E}{\partial z^{(2)}_1}\frac{\partial z^{(2)}_1}{\partial h^{(1)}_1} + \frac{\partial E}{\partial z^{(2)}_2}\frac{\partial z^{(2)}_2}{\partial h^{(1)}_1} = \delta^{(2)}_1 W^{(2)}_{11} + \delta^{(2)}_2 W^{(2)}_{21}"></div>
      <p>В сумму вошли веса с разными первыми индексами и общим вторым. Это столбец матрицы
      <span class="math-inline" data-tex="\mathbf W^{(2)}"></span>, и в части 6 отсюда появится транспонирование.</p>
    </div>
    <div class="step-panel" data-on="map D1 D2 C1 B1 A1 A2 out fk1 fk2 yk11 yk12 yk21 yk22 mm2" data-focus="fk2">
      <div class="step-kicker">Шаг 4 · сумма для второго узла</div>
      <h4>То же самое для второго скрытого узла</h4>
      <p>Меняется только второй индекс весов. Обе суммы стоят рядом, и видно, что наборы весов
      не пересекаются.</p>
    </div>
    <div class="step-panel" data-on="map C1 A1 A2 A3 fk1 fk2 tl1 tl2 yk11 yk12 yk21 yk22 mm3" data-focus="tl1 tl2">
      <div class="step-kicker">Шаг 5 · дельты первого слоя</div>
      <h4>Проходим активацию и получаем ту же величину, что раньше</h4>
      <div class="math-display" data-tex="\begin{pmatrix} \delta^{(1)}_1 \\ \delta^{(1)}_2 \end{pmatrix} = \begin{pmatrix} \partial E / \partial h^{(1)}_1 \\ \partial E / \partial h^{(1)}_2 \end{pmatrix} \odot \begin{pmatrix} \sigma'\!\left(z^{(1)}_1\right) \\ \sigma'\!\left(z^{(1)}_2\right) \end{pmatrix}"></div>
      <p>Определение то же, что у <span class="math-inline" data-tex="\boldsymbol\delta^{(2)}"></span>, слой другой. Дальше первый слой считается
      как последний: у нас есть его дельты, а остальное было в части 3.</p>
    </div>
    <div class="step-panel" data-on="map A1 A2 A3 D3 r11 r12 tl1 w11 w12 yk21 yk22 yl11 yl12 yl21 yl22 mm4" data-focus="w11 w12">
      <div class="step-kicker">Шаг 6 · параметры 1 и 2</div>
      <h4>Веса, ведущие в первый скрытый узел</h4>
      <p>Последний множитель равен тому, что вошло в ребро. Для первого слоя это сам вход
      сети.</p>
    </div>
    <div class="step-panel" data-on="map A1 A2 A3 D3 r11 r12 r21 r22 tl1 tl2 w11 w12 w21 w22 yl11 yl12 yl21 yl22 mm4" data-focus="w21 w22">
      <div class="step-kicker">Шаг 7 · параметры 3 и 4</div>
      <h4>Веса, ведущие во второй скрытый узел</h4>
      <p>Вторая дельта, те же два входа. Все четыре формулы снова имеют вид «дельта × вход».</p>
    </div>
    <div class="step-panel" data-on="map A3 D3 r11 r12 r21 r22 rb1 rb2 tl1 tl2 w11 w12 w21 w22 ab1 ab2 pb yl11 yl12 yl21 yl22 mm5" data-focus="ab1 ab2 pb">
      <div class="step-kicker">Шаг 8 · параметры 5 и 6</div>
      <h4>Градиенты смещений снова равны дельтам</h4>
      <p>Как на последнем слое: <span class="math-inline" data-tex="\partial z/\partial b = 1"></span>.</p>
    </div>
    <div class="step-panel" data-on="map r11 r12 r21 r22 rb1 rb2 w11 w12 w21 w22 ab1 ab2 yl11 yl12 yl21 yl22 sum mm5" data-focus="sum">
      <div class="step-kicker">Шаг 9 · сводка</div>
      <h4>Двенадцать градиентов сети выведены полностью</h4>
      <div class="math-display" data-tex="\frac{\partial E}{\partial \mathbf W^{(1)}} = \begin{pmatrix} \delta^{(1)}_1 x^{(0)}_1 &amp; \delta^{(1)}_1 x^{(0)}_2 \\ \delta^{(1)}_2 x^{(0)}_1 &amp; \delta^{(1)}_2 x^{(0)}_2 \end{pmatrix}"></div>
      <p>Шесть в части 3 и шесть здесь. Первый слой отличается от последнего одной строкой:
      тем, как получена его дельта.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 10 · те же шесть цепочек в числах

<div class="stage" id="stageFbn" tabindex="0">
  <div class="stage-figure">
<svg class="mg" id="fbn" viewBox="0 0 960 600" role="img" aria-label="Те же выкладки первого слоя, подставлены числа">
<defs><marker id="fbn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="fbn-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="fbn-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="105" y="35" class="mm" text-anchor="middle">что ищем</text>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="255" y="35" class="mm" text-anchor="middle">развилка</text>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="405" y="35" class="mm" text-anchor="middle">сумма ветвей</text>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\boldsymbol\delta^{(1)}"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial \mathbf W^{(1)}"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="785" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\partial \mathbf b^{(1)}"></span></span></div></foreignObject>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="62" y="128" class="cap" text-anchor="middle">вход</text><text x="192" y="128" class="cap" text-anchor="middle">сумматор</text><text x="300" y="128" class="cap" text-anchor="middle">активация</text><text x="462" y="128" class="cap" text-anchor="middle">сумматор</text><text x="570" y="128" class="cap" text-anchor="middle">активация</text><text x="716" y="128" class="cap" text-anchor="middle">ошибка</text><text x="880" y="128" class="cap" text-anchor="middle">итог</text>
<line x1="30" y1="414" x2="96" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="160" y1="414" x2="332" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="430" y1="414" x2="602" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><line x1="684" y1="414" x2="915" y2="414" stroke="#D8D4C8" stroke-width="1.2"/><foreignObject x="-2" y="415.68" width="130" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вход: 2 числа</span></div></foreignObject><foreignObject x="146" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 1: <span data-tex="\mathbf W^{(1)}\ 2\times 2,\ \mathbf b^{(1)}\ 2"></span></span></div></foreignObject><foreignObject x="416" y="415.68" width="200" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>слой 2: <span data-tex="\mathbf W^{(2)}\ 2\times 2,\ \mathbf b^{(2)}\ 2"></span></span></div></foreignObject><foreignObject x="680" y="415.68" width="240" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря: сумма по двум выходам</span></div></foreignObject>
<g data-key="D1" data-only="1"><foreignObject x="1" y="46" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf x^{(0)} = \left(0.5,\; 0.8\right)"></div></foreignObject></g>
<g data-key="D2" data-only="1"><foreignObject x="1" y="68" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\sigma'\!\left(\mathbf z^{(1)}\right) = \left(0.2500,\; 0.2429\right)"></div></foreignObject></g>
<g data-key="D3" data-only="1"><foreignObject x="1" y="90" width="190" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial z^{(1)}_i / \partial W^{(1)}_{ij} = x^{(0)}_j"></div></foreignObject></g>
<g data-key="A1" data-only="1"><foreignObject x="195" y="46" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial E / \partial h^{(1)}_1 = -0.0583 + 0.0295 = -0.0288"></div></foreignObject></g>
<g data-key="A2" data-only="1"><foreignObject x="195" y="68" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\partial E / \partial h^{(1)}_2 = 0.0350 + 0.0886 = 0.1236"></div></foreignObject></g>
<g data-key="A3" data-only="1"><foreignObject x="195" y="90" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\boldsymbol\delta^{(1)} = \left(-0.0072,\; 0.0300\right)"></div></foreignObject></g>
<g data-key="B1" data-only="1"><foreignObject x="500" y="68" width="180" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf W^{(2)} = \begin{pmatrix} 0.50 &amp; -0.30 \\ 0.20 &amp; 0.60 \end{pmatrix}"></div></foreignObject></g>
<g data-key="C1" data-only="1"><foreignObject x="685" y="46" width="230" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\boldsymbol\delta^{(2)} = \left(-0.1166,\; 0.1477\right)"></div></foreignObject></g>
<g data-key="map"><circle cx="62" cy="212" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="62" cy="332" r="25" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="33" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><line x1="88.5" y1="212" x2="164" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="81.472" y1="229.974" x2="171.426" y2="313.008" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="81.472" y1="314.026" x2="171.426" y2="230.992" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="88.5" y1="332" x2="164" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="192" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_1"></div></foreignObject><line x1="192" y1="172.5" x2="192" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="192" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="171" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(1)}_2"></div></foreignObject><line x1="192" y1="371.5" x2="192" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="192" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_1"></div></foreignObject><circle cx="192" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="163" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(1)}_2"></div></foreignObject><line x1="218.5" y1="212" x2="272" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="218.5" y1="332" x2="272" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="300" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_1"></div></foreignObject><circle cx="300" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="271" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(1)}_2"></div></foreignObject><line x1="326.5" y1="212" x2="434" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="321.294" y1="227.774" x2="439.5" y2="315.334" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="321.294" y1="316.226" x2="439.5" y2="228.666" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="326.5" y1="332" x2="434" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="462" cy="154" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_1"></div></foreignObject><line x1="462" y1="172.5" x2="462" y2="184" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="462" cy="390" r="17" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="441" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="b^{(2)}_2"></div></foreignObject><line x1="462" y1="371.5" x2="462" y2="360" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="462" cy="212" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_1"></div></foreignObject><circle cx="462" cy="332" r="25" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="433" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z^{(2)}_2"></div></foreignObject><line x1="488.5" y1="212" x2="542" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="488.5" y1="332" x2="542" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="570" cy="212" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_1"></div></foreignObject><circle cx="570" cy="332" r="25" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="541" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h^{(2)}_2"></div></foreignObject><line x1="596.5" y1="212" x2="688" y2="212" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="596.5" y1="332" x2="688" y2="332" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="716" cy="212" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="187" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_1"></div></foreignObject><circle cx="716" cy="332" r="25" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="687" y="307" width="58" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="e^{(3)}_2"></div></foreignObject><line x1="740.887" y1="221.105" x2="850.887" y2="261.349" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><line x1="740.887" y1="322.895" x2="850.887" y2="282.651" stroke="#5E5850" stroke-width="1.8" marker-end="url(#fbn-arw)"/><circle cx="880" cy="272" r="28" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="848" y="244" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="E"></div></foreignObject><circle cx="716" cy="154" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="137" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_1"></div></foreignObject><line x1="716" y1="172.5" x2="716" y2="184" stroke="#3576C0" stroke-width="1.8" marker-end="url(#fbn-arb)"/><circle cx="716" cy="390" r="17" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="695" y="373" width="42" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#111111;font-weight:400" data-tex="y_2"></div></foreignObject><line x1="716" y1="371.5" x2="716" y2="360" stroke="#3576C0" stroke-width="1.8" marker-end="url(#fbn-arb)"/></g>
<g data-key="yk11" data-only="1"><foreignObject x="89" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{11}"></div></foreignObject></g>
<g data-key="yl11" data-only="1"><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="0.50"></div></foreignObject></g>
<g data-key="yk21" data-only="1"><foreignObject x="88.1" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{21}"></div></foreignObject></g>
<g data-key="yl21" data-only="1"><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="0.20"></div></foreignObject></g>
<g data-key="yk12" data-only="1"><foreignObject x="88.1" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{12}"></div></foreignObject></g>
<g data-key="yl12" data-only="1"><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="-0.30"></div></foreignObject></g>
<g data-key="yk22" data-only="1"><foreignObject x="89" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{22}"></div></foreignObject></g>
<g data-key="yl22" data-only="1"><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="0.60"></div></foreignObject></g>
<g data-key="allw" data-only="1"><line x1="87" y1="212" x2="167" y2="212" stroke="#C29E08" stroke-width="3.4"/><line x1="80.37" y1="228.957" x2="173.63" y2="315.043" stroke="#C29E08" stroke-width="3.4"/><line x1="80.37" y1="315.043" x2="173.63" y2="228.957" stroke="#C29E08" stroke-width="3.4"/><line x1="87" y1="332" x2="167" y2="332" stroke="#C29E08" stroke-width="3.4"/></g>
<g data-key="pb" data-only="1"><circle cx="192" cy="154" r="19" fill="none" stroke="#C29E08" stroke-width="3"/><circle cx="192" cy="390" r="19" fill="none" stroke="#C29E08" stroke-width="3"/></g>
<g data-key="out" data-only="1"><line x1="852.296" y1="261.864" x2="742.295" y2="221.62" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><line x1="689.5" y1="212" x2="598" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><line x1="543.5" y1="212" x2="490" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="419" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="-0.1166"></div></foreignObject><line x1="852.296" y1="282.136" x2="742.295" y2="322.38" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><line x1="689.5" y1="332" x2="598" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><line x1="543.5" y1="332" x2="490" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="419" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="0.1477"></div></foreignObject></g>
<g data-key="fk1" data-only="1"><line x1="435.5" y1="212" x2="328" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="343" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="-0.0583"></div></foreignObject><line x1="440.706" y1="316.226" x2="322.5" y2="228.666" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="341.14" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="+0.0295"></div></foreignObject></g>
<g data-key="fk2" data-only="1"><line x1="440.706" y1="227.774" x2="322.5" y2="315.334" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="341.14" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="+0.0350"></div></foreignObject><line x1="435.5" y1="332" x2="328" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="343" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="+0.0886"></div></foreignObject></g>
<g data-key="tl1" data-only="1"><line x1="273.5" y1="212" x2="220" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="194" y="187" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#9C0908;font-weight:400" data-tex="0.2500"></div></foreignObject><foreignObject x="149" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="-0.0072"></div></foreignObject></g>
<g data-key="tl2" data-only="1"><line x1="273.5" y1="332" x2="220" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="194" y="333" width="104" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#9C0908;font-weight:400" data-tex="0.2429"></div></foreignObject><foreignObject x="149" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="0.0300"></div></foreignObject></g>
<g data-key="w11" data-only="1"><line x1="165.5" y1="212" x2="90" y2="212" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="89" y="187" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="-0.0036"></div></foreignObject></g>
<g data-key="w21" data-only="1"><line x1="172.528" y1="314.026" x2="82.574" y2="230.992" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="88.1" y="227" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="0.0150"></div></foreignObject></g>
<g data-key="w12" data-only="1"><line x1="172.528" y1="229.974" x2="82.574" y2="313.008" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="88.1" y="293" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="-0.0058"></div></foreignObject></g>
<g data-key="w22" data-only="1"><line x1="165.5" y1="332" x2="90" y2="332" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="89" y="334" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="0.0240"></div></foreignObject></g>
<g data-key="ab1" data-only="1"><line x1="192" y1="185.5" x2="192" y2="174" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="210" y="142" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="-0.0072"></div></foreignObject></g>
<g data-key="ab2" data-only="1"><line x1="192" y1="358.5" x2="192" y2="370" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#fbn-arr)"/><foreignObject x="210" y="378" width="76" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="0.0300"></div></foreignObject></g>
<g data-key="vin" data-only="1"><foreignObject x="19" y="239" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.5"></div></foreignObject><foreignObject x="19" y="283" width="86" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#3576C0;font-weight:400" data-tex="0.8"></div></foreignObject></g>
<g data-key="r11" data-only="1"><rect x="40" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="40" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(1)}_{11} = (-0.0072)(0.5) = -0.0036"></div></foreignObject></g>
<g data-key="r12" data-only="1"><rect x="336" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="336" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(1)}_{12} = (-0.0072)(0.8) = -0.0058"></div></foreignObject></g>
<g data-key="rb1" data-only="1"><rect x="632" y="446" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="632" y="446" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial b^{(1)}_1 = -0.0072"></div></foreignObject></g>
<g data-key="r21" data-only="1"><rect x="40" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="40" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(1)}_{21} = (0.0300)(0.5) = 0.0150"></div></foreignObject></g>
<g data-key="r22" data-only="1"><rect x="336" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="336" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial W^{(1)}_{22} = (0.0300)(0.8) = 0.0240"></div></foreignObject></g>
<g data-key="rb2" data-only="1"><rect x="632" y="490" width="288" height="38" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="632" y="490" width="288" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial E / \partial b^{(1)}_2 = 0.0300"></div></foreignObject></g>
<g data-key="sum" data-only="1"><rect x="40" y="538" width="880" height="30" rx="9" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".6"/><foreignObject x="50" y="541.02" width="860" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400"><span>К первому слою сигнал приходит ослабленным: ветви частично гасят друг друга</span></div></foreignObject></g>
<text x="40" y="590" class="legend">красное: обратный проход и производные · жёлтое: параметры и сигнал по ним · внизу копятся готовые градиенты</text>
</svg>

  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="map D1 D2 allw pb yk11 yk12 yk21 yk22 yl11 yl12 yl21 yl22 mm0" data-focus="allw pb">
      <div class="step-kicker">Шаг 1 · что берём</div>
      <h4>Дельты следующего слоя плюс кэш</h4>
      <p>Дельты <span class="math-inline" data-tex="\boldsymbol\delta^{(2)}"></span> уже посчитаны в части 3, вход и производные сигмоиды
      лежат в кэше. Матрица <span class="math-inline" data-tex="\mathbf W^{(2)}"></span> берётся в старом, необновлённом виде: веса меняются только
      после того, как посчитаны все градиенты.</p>
    </div>
    <div class="step-panel" data-on="map D1 D2 C1 B1 out fk1 yk11 yk12 yk21 yk22 yl12 yl22 mm1" data-focus="fk1">
      <div class="step-kicker">Шаг 2 · развилка</div>
      <h4>Два маршрута от одного узла</h4>
      <p>Первый выход тянет активацию вверх, второй вниз. На следующем шаге их сложим.</p>
    </div>
    <div class="step-panel" data-on="map D1 D2 C1 B1 A1 out fk1 yk11 yk12 yk21 yk22 yl12 yl22 mm2" data-focus="fk1">
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
        <p class="worked-reading">К первому слою сигнал приходит ослабленным, потому что требования выходов частично
        противоположны.</p>
      </div>
    </div>
    <div class="step-panel" data-on="map D1 D2 C1 B1 A1 A2 out fk1 fk2 yk11 yk12 yk21 yk22 mm2" data-focus="fk2">
      <div class="step-kicker">Шаг 4 · вторая сумма</div>
      <h4>Здесь, наоборот, вклады складываются</h4>
      <p>0.0350 и 0.0886 оба положительные, потому что во втором столбце <span class="math-inline" data-tex="\mathbf W^{(2)}"></span>
      другое сочетание знаков. Итог 0.1236, вчетверо больше первой суммы.</p>
    </div>
    <div class="step-panel" data-on="map C1 A1 A2 A3 fk1 fk2 tl1 tl2 yk11 yk12 yk21 yk22 mm3" data-focus="tl1 tl2">
      <div class="step-kicker">Шаг 5 · дельты первого слоя</div>
      <h4>Производная сигмоиды режет обе величины вчетверо</h4>
      <p>Множители 0.2500 и 0.2429 почти в максимуме, и всё равно сигнал уменьшился в четыре
      раза: выше 0.25 производная сигмоиды не поднимается.</p>
    </div>
    <div class="step-panel" data-on="map A1 A2 A3 D3 r11 r12 tl1 w11 w12 vin yk21 yk22 yl11 yl12 yl21 yl22 mm4" data-focus="w11 w12">
      <div class="step-kicker">Шаг 6 · параметры 1 и 2</div>
      <h4>−0.0036 и −0.0058</h4>
      <p>Отношение этих двух чисел равно 1.6, отношению входов 0.8 к 0.5. Дельта у них общая,
      поэтому различает их только вход.</p>
    </div>
    <div class="step-panel" data-on="map A1 A2 A3 D3 r11 r12 r21 r22 tl1 tl2 w11 w12 w21 w22 vin yl11 yl12 yl21 yl22 mm4" data-focus="w21 w22">
      <div class="step-kicker">Шаг 7 · параметры 3 и 4</div>
      <h4>0.0150 и 0.0240</h4>
      <p>То же отношение 1.6 и другой знак: вторая дельта положительна. Обе строки
      матрицы градиентов пропорциональны одному и тому же вектору входов.</p>
    </div>
    <div class="step-panel" data-on="map A3 D3 r11 r12 r21 r22 rb1 rb2 tl1 tl2 w11 w12 w21 w22 ab1 ab2 pb yl11 yl12 yl21 yl22 mm5" data-focus="ab1 ab2 pb">
      <div class="step-kicker">Шаг 8 · параметры 5 и 6</div>
      <h4>−0.0072 и 0.0300</h4>
      <p>Градиенты смещений крупнее градиентов весов этого слоя: входы меньше единицы и
      уменьшают произведение, а у смещения множитель равен единице.</p>
    </div>
    <div class="step-panel" data-on="map r11 r12 r21 r22 rb1 rb2 w11 w12 w21 w22 ab1 ab2 yl11 yl12 yl21 yl22 sum mm5" data-focus="sum">
      <div class="step-kicker">Шаг 9 · сводка и сравнение слоёв</div>
      <h4>Сигнал упал в шесть раз на одном слое</h4>
      <div class="math-display" data-tex="\begin{gathered} \frac{\partial E}{\partial \mathbf W^{(1)}} = \begin{pmatrix} -0.0036 &amp; -0.0058 \\ 0.0150 &amp; 0.0240 \end{pmatrix} \\[6pt] \left\|\boldsymbol\delta^{(2)}\right\| = 0.1882 \;\to\; \left\|\boldsymbol\delta^{(1)}\right\| = 0.0309 \end{gathered}"></div>
      <p>Часть потери идёт от гашения ветвей, часть от множителя <span class="math-inline" data-tex="\sigma '"></span>, который не
      бывает больше 0.25. Так начинается затухание градиента.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> глубина добавляет только суммирование по ветвям. Когда сумма посчитана и превращена в
  дельту, слой обрабатывается так же, как последний.
</div>

---

## Часть 6. Компактная запись первого слоя и транспонирование

<p>
  Осталось перевести на матричный язык вторую половину вывода, где мы складывали ветви.
  Как и в части 4, результат будет тем же, записанным целиком.
</p>

<p>
  Посмотрите на индексы в двух суммах, полученных в части 5. Чтобы собрать вклад для узла <span class="math-inline" data-tex="j"></span> предыдущего слоя, нужны веса
  <span class="math-inline" data-tex="W^{(2)}_{kj}"></span> при всех <span class="math-inline" data-tex="k"></span>, то есть <em>столбец</em> <span class="math-inline" data-tex="j"></span>
  матрицы <span class="math-inline" data-tex="W"></span>. Матричное умножение читает строки, а не столбцы, поэтому матрицу
  приходится транспонировать.
</p>

<div class="math-display" data-tex="\frac{\partial E}{\partial \mathbf h^{(\ell-1)}} = \left(\mathbf W^{(\ell)}\right)^{\!\top} \boldsymbol\delta^{(\ell)}"></div>

<div class="callout-blue">
  <strong>Откуда транспонирование:</strong> вперёд матрица <span class="math-inline" data-tex="W"></span> раздаёт
  активации по узлам следующего слоя, назад та же матрица собирает вклады обратно. Читать
  её приходится в другую сторону, отсюда <span class="math-inline" data-tex="W^{\top}"></span>. В общем виде <span class="math-inline" data-tex="W"></span>
  это якобиан линейного слоя.
</div>

<p>
  Как и в предыдущей компактной сцене, справа вверху стоит уменьшенная схема
  сети: жёлтым отмечен слой, градиенты которого мы выводим, красным рёбра, по которым к нему
  приходит сигнал ошибки.
</p>

### Интерактив 11 · суммы по ветвям превращаются в Wᵀ

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

  <text x="33" y="32" class="cap">Две суммы по ветвям, по одной на каждый скрытый узел</text>

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
  <foreignObject x="590" y="21.68" width="120" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12px;color:#8A8378;font-weight:400;text-align:center;justify-content:center" data-tex="\mathbf x^{(0)}"></div></foreignObject>
  <foreignObject x="670" y="21.68" width="120" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12px;color:#8A8378;font-weight:400;text-align:center;justify-content:center" data-tex="\mathbf h^{(1)}"></div></foreignObject>
  <foreignObject x="750" y="21.68" width="120" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12px;color:#8A8378;font-weight:400;text-align:center;justify-content:center" data-tex="\mathbf h^{(2)}"></div></foreignObject>
  <foreignObject x="830" y="21.68" width="120" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12px;color:#8A8378;font-weight:400;text-align:center;justify-content:center" data-tex="E"></div></foreignObject>
  <text x="770" y="142" class="mini" text-anchor="middle">ищем жёлтый слой, сигнал приходит по красным рёбрам</text>

  <g data-key="eqs" data-only="1">
    <foreignObject x="33" y="44" width="560" height="44">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial h^{(1)}_1} = \delta^{(2)}_1 \textcolor{#3576C0}{W^{(2)}_{11}} + \delta^{(2)}_2 \textcolor{#3576C0}{W^{(2)}_{21}}"></div>
    </foreignObject>
    <foreignObject x="33" y="90" width="560" height="44">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial h^{(1)}_2} = \delta^{(2)}_1 \textcolor{#3576C0}{W^{(2)}_{12}} + \delta^{(2)}_2 \textcolor{#3576C0}{W^{(2)}_{22}}"></div>
    </foreignObject>
  </g>

  <g data-key="col" data-only="1">
    <foreignObject x="33" y="148.96" width="880" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#2A5E9B;font-weight:400;text-align:left;justify-content:flex-start"><span>В строке собрались веса с общим вторым индексом: это столбец матрицы <span data-tex="\mathbf W^{(2)}"></span></span></div></foreignObject>
  </g>

  <g data-key="trn" data-only="1">
    <rect x="33" y="186" width="890" height="86" rx="12" class="br"/>
    <foreignObject x="45" y="198" width="866" height="64">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial \mathbf h^{(1)}} = \begin{pmatrix} W^{(2)}_{11} &amp; W^{(2)}_{21} \\[4pt] W^{(2)}_{12} &amp; W^{(2)}_{22} \end{pmatrix}\begin{pmatrix} \delta^{(2)}_1 \\[4pt] \delta^{(2)}_2 \end{pmatrix} = \left(\mathbf W^{(2)}\right)^{\!\top} \boldsymbol\delta^{(2)}"></div>
    </foreignObject>
  </g>

  <g data-key="dlt" data-only="1">
    <rect x="33" y="288" width="890" height="70" rx="12" class="br"/>
    <foreignObject x="45" y="298" width="866" height="50">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\boldsymbol\delta^{(1)} = \left(\left(\mathbf W^{(2)}\right)^{\!\top} \boldsymbol\delta^{(2)}\right) \odot \sigma'\!\left(\mathbf z^{(1)}\right)"></div>
    </foreignObject>
  </g>

  <g data-key="gw" data-only="1">
    <rect x="33" y="374" width="890" height="86" rx="12" class="by"/>
    <foreignObject x="45" y="386" width="866" height="64">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial \mathbf W^{(1)}} = \boldsymbol\delta^{(1)}\left(\mathbf x^{(0)}\right)^{\!\top} = \begin{pmatrix} \delta^{(1)}_1 \\[4pt] \delta^{(1)}_2 \end{pmatrix}\begin{pmatrix} x^{(0)}_1 &amp; x^{(0)}_2 \end{pmatrix}"></div>
    </foreignObject>
  </g>

  <g data-key="gb" data-only="1">
    <rect x="33" y="476" width="890" height="60" rx="12" class="by"/>
    <foreignObject x="45" y="486" width="866" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial \mathbf b^{(1)}} = \boldsymbol\delta^{(1)}"></div>
    </foreignObject>
  </g>

  <g data-key="num" data-only="1">
    <rect x="33" y="552" width="890" height="80" rx="12" class="bb"/>
    <foreignObject x="45" y="560" width="866" height="64">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\frac{\partial E}{\partial \mathbf W^{(1)}} = \begin{pmatrix} -0.0072 \\[4pt] 0.0300 \end{pmatrix}\begin{pmatrix} 0.5 &amp; 0.8 \end{pmatrix} = \begin{pmatrix} -0.0036 &amp; -0.0058 \\[4pt] 0.0150 &amp; 0.0240 \end{pmatrix}"></div>
    </foreignObject>
  </g>

  <text x="33" y="654" class="legend">красное: сигнал ошибки, идущий назад · жёлтое: параметры и их градиенты · синее: числа сквозного примера</text>
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
      <p>Это результат части 5. В каждой сумме обе дельты следующего слоя, но веса разные.</p>
    </div>
    <div class="step-panel" data-on="eqs col" data-focus="col">
      <div class="step-kicker">Шаг 2 · смотрим на индексы</div>
      <h4>В строке собрались веса с общим вторым индексом</h4>
      <p>В первой строке это <span class="math-inline" data-tex="W_{11}"></span> и <span class="math-inline" data-tex="W_{21}"></span>, во второй <span class="math-inline" data-tex="W_{12}"></span> и
      <span class="math-inline" data-tex="W_{22}"></span>. По второму индексу веса группируются в столбцы
      <span class="math-inline" data-tex="\mathbf W^{(2)}"></span>.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn" data-focus="trn">
      <div class="step-kicker">Шаг 3 · транспонирование</div>
      <h4>Столбцы становятся строками</h4>
      <p>Чтобы записать обе суммы одним умножением матрицы на вектор, матрицу нужно
      транспонировать. Это те же четыре числа, прочитанные в другом порядке.</p>
      <p>Проверка форм: <span class="math-inline" data-tex="2\times 2"></span> на <span class="math-inline" data-tex="2\times 1"></span> даёт <span class="math-inline" data-tex="2\times 1"></span>, вектор той
      же длины, что и активации предыдущего слоя.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn dlt" data-focus="dlt">
      <div class="step-kicker">Шаг 4 · дельта слоя</div>
      <h4>Рекурсия замкнулась</h4>
      <p>Полученный вектор домножаем поэлементно на производную активации и получаем
      <span class="math-inline" data-tex="\delta ^{(1)}"></span>. Формула выражает дельту слоя через дельту следующего слоя: это
      рекурсия обратного прохода.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn dlt gw" data-focus="gw">
      <div class="step-kicker">Шаг 5 · градиент весов</div>
      <h4>Дальше всё как в части 4</h4>
      <p>Внешнее произведение дельты слоя на его вход. Отличие от последнего слоя: вместо
      активаций предыдущего слоя здесь стоит сам вход сети.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn dlt gw gb" data-focus="gb">
      <div class="step-kicker">Шаг 6 · градиент смещений</div>
      <h4>Снова дельта</h4>
      <p>Формула та же, что для последнего слоя: отдельного случая для первого слоя в алгоритме
      нет.</p>
    </div>
    <div class="step-panel" data-on="eqs col trn dlt gw gb num" data-focus="num">
      <div class="step-kicker">Шаг 7 · числа</div>
      <h4>Те же −0.0036, −0.0058, 0.0150, 0.0240</h4>
      <p>Матричная запись дала те же четыре числа, которые в части 5 мы получили по одному.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> сумма по ветвям равна умножению на транспонированную матрицу весов. После него слой
  считается как выходной: поэлементно на <span class="math-inline" data-tex="\sigma '"></span>, затем внешнее произведение.
</div>

---

## Часть 7. Обратный проход одним конвейером

<p>
  Соберём обе части вместе. Обратный проход состоит из двух действий, которые повторяются
  на каждом слое: пересчитать дельту, потом превратить её в градиенты параметров. Между
  слоями передаётся один вектор.
</p>

### Интерактив 12 · весь обратный проход одним конвейером

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
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\mathbf x^{(0)},\; \mathbf z^{(1)},\; \mathbf h^{(1)},\; \mathbf z^{(2)},\; \mathbf h^{(2)},\; \mathbf W^{(1)},\; \mathbf W^{(2)}"></div>
    </foreignObject>
  </g>

  <g data-key="r1" data-only="1">
    <line x1="248" y1="82" x2="248" y2="98" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="33" y="100" width="430" height="64" rx="12" class="br"/>
    <foreignObject x="45" y="112" width="406" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\frac{\partial E}{\partial \mathbf h^{(2)}} = \mathbf h^{(2)} - \mathbf y"></div>
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
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\boldsymbol\delta^{(2)} = \frac{\partial E}{\partial \mathbf h^{(2)}} \odot \sigma'\!\left(\mathbf z^{(2)}\right) = \left(-0.1166,\; 0.1477\right)"></div>
    </foreignObject>
  </g>

  <g data-key="r2g" data-only="1">
    <line x1="465" y1="218" x2="488" y2="218" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="490" y="186" width="433" height="64" rx="12" class="bg"/>
    <foreignObject x="502" y="198" width="409" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}} = \boldsymbol\delta^{(2)}\left(\mathbf h^{(1)}\right)^{\!\top}, \;\; \frac{\partial E}{\partial \mathbf b^{(2)}} = \boldsymbol\delta^{(2)}"></div>
    </foreignObject>
  </g>

  <g data-key="r3" data-only="1">
    <line x1="248" y1="252" x2="248" y2="270" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="33" y="272" width="430" height="64" rx="12" class="br"/>
    <foreignObject x="45" y="284" width="406" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\frac{\partial E}{\partial \mathbf h^{(1)}} = \left(\mathbf W^{(2)}\right)^{\!\top} \boldsymbol\delta^{(2)}"></div>
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
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\boldsymbol\delta^{(1)} = \frac{\partial E}{\partial \mathbf h^{(1)}} \odot \sigma'\!\left(\mathbf z^{(1)}\right) = \left(-0.0072,\; 0.0300\right)"></div>
    </foreignObject>
  </g>

  <g data-key="r4g" data-only="1">
    <line x1="465" y1="390" x2="488" y2="390" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="490" y="358" width="433" height="64" rx="12" class="bg"/>
    <foreignObject x="502" y="370" width="409" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial \mathbf W^{(1)}} = \boldsymbol\delta^{(1)}\left(\mathbf x^{(0)}\right)^{\!\top}, \;\; \frac{\partial E}{\partial \mathbf b^{(1)}} = \boldsymbol\delta^{(1)}"></div>
    </foreignObject>
  </g>

  <g data-key="lp" data-only="1">
    <line x1="248" y1="424" x2="248" y2="442" class="ar" marker-end="url(#bw-arw)"/>
    <rect x="33" y="444" width="890" height="64" rx="12" class="by"/>
    <foreignObject x="45" y="456" width="866" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm svg-math-center" data-tex="\boldsymbol\delta^{(\ell)} = \left(\left(\mathbf W^{(\ell+1)}\right)^{\!\top}\boldsymbol\delta^{(\ell+1)}\right) \odot \sigma'\!\left(\mathbf z^{(\ell)}\right), \qquad \frac{\partial E}{\partial \mathbf W^{(\ell)}} = \boldsymbol\delta^{(\ell)}\left(\mathbf h^{(\ell-1)}\right)^{\!\top}, \qquad \frac{\partial E}{\partial \mathbf b^{(\ell)}} = \boldsymbol\delta^{(\ell)}"></div>
    </foreignObject>
  </g>

  <text x="33" y="540" class="legend">зелёное: итог прямого прохода · красное: сигнал ошибки, текущий назад · жёлтое: готовые градиенты параметров · синее: числа</text>
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
      <h4>Обратному проходу уже есть с чем работать</h4>
      <p>Всё нужное лежит в памяти после прямого прохода: входы, сумматоры, активации и сами
      матрицы весов. Сеть заново не считается.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n" data-focus="r1">
      <div class="step-kicker">Шаг 2 · точка входа</div>
      <h4>Единственное место, где важна функция потерь</h4>
      <p>С производной потери по выходу начинается обратный проход. Если сменить квадратичную
      ошибку на кросс-энтропию, изменится только эта строка.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n r2" data-focus="r2">
      <div class="step-kicker">Шаг 3 · дельта последнего слоя</div>
      <h4>Проходим активацию поэлементно</h4>
      <p>Те же −0.1166 и 0.1477, что мы считали по одному в части 3, получаются одной строкой.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n r2 r2g" data-focus="r2g">
      <div class="step-kicker">Шаг 4 · градиенты слоя</div>
      <h4>Дельта сразу даёт и веса, и смещения</h4>
      <p>Для весов это внешнее произведение на активации предыдущего слоя, для смещений сама
      дельта. Шесть чисел за две операции.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n r2 r2g r3 r3n" data-focus="r3">
      <div class="step-kicker">Шаг 5 · передача назад</div>
      <h4>Та же матрица, прочитанная в другую сторону</h4>
      <p>Это матричная запись суммирования по ветвям. Результат показывает чувствительность
      ошибки к активациям предыдущего слоя и идёт на вход следующего витка.</p>
    </div>
    <div class="step-panel" data-on="ch r1 r1n r2 r2g r3 r3n r4 r4g" data-focus="r4">
      <div class="step-kicker">Шаг 6 · виток повторяется</div>
      <h4>Первый слой обрабатывается теми же двумя строками</h4>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · во сколько раз ослаб сигнал</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Дельта второго слоя</span>
            <div class="math-display worked-math" data-tex="\left\|\boldsymbol\delta^{(2)}\right\| = 0.1882"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Дельта первого слоя</span>
            <div class="math-display worked-math" data-tex="\left\|\boldsymbol\delta^{(1)}\right\| = 0.0309"></div>
          </div>
        </div>
        <p class="worked-reading">Один слой уменьшил длину сигнала в шесть раз, хотя производная сигмоиды была близка к
        своему максимуму 0.25. Десять множителей по 0.25 дают около 10⁻⁶.</p>
      </div>
    </div>
    <div class="step-panel" data-on="r2 r2g r4 r4g lp" data-focus="lp">
      <div class="step-kicker">Шаг 7 · общее правило</div>
      <h4>Три строки на любую глубину</h4>
      <p>Верхняя строка задаёт рекурсию: как получить дельту слоя из дельты следующего. Две
      нижние превращают дельту в градиенты параметров.</p>
      <p>Те же вычисления фреймворки выполняют в обратном режиме автоматического
      дифференцирования.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>


### Интерактив 13 · обратный проход в матричной форме

<p>
  Тот же экран, но теперь в клетках градиенты. Слева всё, что оставил прямой проход,
  справа пять формул обратного прохода и пустые матрицы, которые заполняются по одной.
  <strong>Форма градиента всегда совпадает с формой параметра</strong>, иначе его нельзя
  было бы вычесть при шаге спуска.
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
    <foreignObject x="-2" y="109.32" width="150" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#A1090A;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf h^{(2)} - \mathbf y ="></div></foreignObject>
    <rect x="160" y="100" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="187" y="117" class="ct" text-anchor="middle" fill="#A1090A">−0.4684</text>
    <rect x="160" y="126" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="187" y="143" class="ct" text-anchor="middle" fill="#A1090A">0.6459</text>
    <text x="187" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <foreignObject x="198" y="109.32" width="150" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#4C8316;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\sigma'(\mathbf z^{(2)}) ="></div></foreignObject>
    <rect x="360" y="100" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="387" y="117" class="ct" text-anchor="middle" fill="#4C8316">0.2490</text>
    <rect x="360" y="126" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="387" y="143" class="ct" text-anchor="middle" fill="#4C8316">0.2287</text>
    <text x="387" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <foreignObject x="28" y="205.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#4C8316;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf h^{(1)} ="></div></foreignObject>
    <rect x="160" y="196" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="187" y="213" class="ct" text-anchor="middle" fill="#4C8316">0.5037</text>
    <rect x="160" y="222" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="187" y="239" class="ct" text-anchor="middle" fill="#4C8316">0.5842</text>
    <text x="187" y="266" class="shape" text-anchor="middle">(2×1)</text>
    <foreignObject x="198" y="205.32" width="150" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#4C8316;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\sigma'(\mathbf z^{(1)}) ="></div></foreignObject>
    <rect x="360" y="196" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="387" y="213" class="ct" text-anchor="middle" fill="#4C8316">0.2500</text>
    <rect x="360" y="222" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="387" y="239" class="ct" text-anchor="middle" fill="#4C8316">0.2429</text>
    <text x="387" y="266" class="shape" text-anchor="middle">(2×1)</text>
    <foreignObject x="28" y="301.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#2A5E9B;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf W^{(2)} ="></div></foreignObject>
    <rect x="160" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="187" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">0.50</text>
    <rect x="214" y="292" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="241" y="309" class="ct" text-anchor="middle" fill="#2A5E9B">−0.30</text>
    <rect x="160" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="187" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.20</text>
    <rect x="214" y="318" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="241" y="335" class="ct" text-anchor="middle" fill="#2A5E9B">0.60</text>
    <text x="214" y="362" class="shape" text-anchor="middle">(2×2)</text>
    <foreignObject x="248" y="301.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\mathbf x^{(0)} ="></div></foreignObject>
    <rect x="380" y="292" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="407" y="309" class="ct" text-anchor="middle" fill="#5E5850">0.5</text>
    <rect x="380" y="318" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="407" y="335" class="ct" text-anchor="middle" fill="#5E5850">0.8</text>
    <text x="407" y="362" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="96" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\boldsymbol\delta^{(2)} = \left(\mathbf h^{(2)} - \mathbf y\right) \odot \sigma'\!\left(\mathbf z^{(2)}\right)"></div>
    </foreignObject>
  <g data-key="b1e" data-only="1">
    <foreignObject x="848" y="105.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C9C2B8;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\delta ^{(2)} ="></div></foreignObject>
    <rect x="980" y="96" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="113" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="139" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="b1" data-only="1">
    <foreignObject x="848" y="105.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#A1090A;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\delta ^{(2)} ="></div></foreignObject>
    <rect x="980" y="96" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="113" class="ct" text-anchor="middle" fill="#A1090A">−0.1166</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="139" class="ct" text-anchor="middle" fill="#A1090A">0.1477</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="184" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}} = \boldsymbol\delta^{(2)}\!\left(\mathbf h^{(1)}\right)^{\!\top}\!\!, \;\; \frac{\partial E}{\partial \mathbf b^{(2)}} = \boldsymbol\delta^{(2)}"></div>
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
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial \mathbf h^{(1)}} = \left(\mathbf W^{(2)}\right)^{\!\top}\boldsymbol\delta^{(2)}"></div>
    </foreignObject>
  <g data-key="b3e" data-only="1">
    <foreignObject x="818" y="281.32" width="150" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C9C2B8;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\partial E/\partial \mathbf h^{(1)} ="></div></foreignObject>
    <rect x="980" y="272" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="289" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="315" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="342" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="b3" data-only="1">
    <foreignObject x="818" y="281.32" width="150" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#A1090A;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\partial E/\partial \mathbf h^{(1)} ="></div></foreignObject>
    <rect x="980" y="272" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="289" class="ct" text-anchor="middle" fill="#A1090A">−0.0288</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="315" class="ct" text-anchor="middle" fill="#A1090A">0.1236</text>
    <text x="1007" y="342" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="360" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\boldsymbol\delta^{(1)} = \frac{\partial E}{\partial \mathbf h^{(1)}} \odot \sigma'\!\left(\mathbf z^{(1)}\right)"></div>
    </foreignObject>
  <g data-key="b4e" data-only="1">
    <foreignObject x="848" y="369.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#C9C2B8;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\delta ^{(1)} ="></div></foreignObject>
    <rect x="980" y="360" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="377" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="403" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="430" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="b4" data-only="1">
    <foreignObject x="848" y="369.32" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#A1090A;font-weight:600;text-align:right;justify-content:flex-end" data-tex="\delta ^{(1)} ="></div></foreignObject>
    <rect x="980" y="360" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="377" class="ct" text-anchor="middle" fill="#A1090A">−0.0072</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="cell" fill="#FDE6E6" stroke="#C30B0A"/>
    <text x="1007" y="403" class="ct" text-anchor="middle" fill="#A1090A">0.0300</text>
    <text x="1007" y="430" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <foreignObject x="560" y="448" width="380" height="52">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\frac{\partial E}{\partial \mathbf W^{(1)}} = \boldsymbol\delta^{(1)}\!\left(\mathbf x^{(0)}\right)^{\!\top}\!\!, \;\; \frac{\partial E}{\partial \mathbf b^{(1)}} = \boldsymbol\delta^{(1)}"></div>
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
    <text x="620" y="543" class="note" text-anchor="middle" fill="#A1090A">Форма градиента всегда совпадает с формой параметра, иначе его нельзя было бы вычесть</text>
  </g>
  <text x="40" y="572" class="legend">красное: градиенты · зелёное: значения с прямого прохода · синее: веса · пунктир с «?»: то, что ещё не посчитано</text>
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
      активаций, активации первого слоя и сам вход. Плюс матрица <span class="math-inline" data-tex="\mathbf W^{(2)}"></span>: её мы прочитаем в обратную сторону.</p>
      <p>Экспоненту второй раз считать не нужно: у сигмоиды производная
      выражается через саму функцию, а её значение уже лежит в кэше.</p>
      <div class="math-display" data-tex="\sigma'(s) = \sigma(s)\left(1 - \sigma(s)\right) \quad\Longrightarrow\quad \sigma'\!\left(z^{(\ell)}_i\right) = h^{(\ell)}_i\left(1 - h^{(\ell)}_i\right)"></div>
      <div class="worked-example">
        <div class="worked-label">Производные активаций · четыре умножения</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Всё берётся из сохранённых <span class="math-inline" data-tex="\mathbf h^{(1)}"></span> и <span class="math-inline" data-tex="\mathbf h^{(2)}"></span></div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\sigma'(z^{(2)}_{1})"></span></div>
            <div class="math-display worked-trace-math" data-tex="\begin{gathered} 0.5316\cdot(1 - 0.5316) \\ = 0.5316\cdot 0.4684 = 0.2490 \end{gathered}"></div>
            <div class="worked-trace-note">почти максимум: выход близок к 0.5</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\sigma'(z^{(2)}_{2})"></span></div>
            <div class="math-display worked-trace-math" data-tex="0.6459\cdot 0.3541 = 0.2287"></div>
            <div class="worked-trace-note">чуть меньше: узел дальше от середины</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\sigma'(z^{(1)}_{1})"></span></div>
            <div class="math-display worked-trace-math" data-tex="0.5037\cdot 0.4963 = 0.2500"></div>
            <div class="worked-trace-note">почти потолок сигмоиды</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\sigma'(z^{(1)}_{2})"></span></div>
            <div class="math-display worked-trace-math" data-tex="0.5842\cdot 0.4158 = 0.2429"></div>
            <div class="worked-trace-note">и здесь тоже близко к потолку</div>
          </div>
        </div>
        <p class="worked-reading">Все четыре множителя лежат между 0.22 и 0.25. Даже в таком благоприятном случае каждый
        слой уменьшает сигнал примерно вчетверо: отсюда затухание градиента.</p>
      </div>
    </div>
    <div class="step-panel" data-on="dat b1 b2e b3e b4e b5e" data-focus="b1">
      <div class="step-kicker">Шаг 2 · дельта последнего слоя</div>
      <h4>Поэлементное произведение двух столбцов</h4>
      <p>Значок <span class="math-inline" data-tex="\odot"></span> требует одинаковых форм:
      <span class="math-inline" data-tex="(2\times 1) \odot  (2\times 1) = (2\times 1)"></span>. Матричное умножение здесь было бы ошибкой:
      компоненты не должны смешиваться.</p>
      <div class="math-display" data-tex="\begin{gathered} \delta^{(2)}_1 = (-0.4684)\cdot 0.2490 = -0.1166 \\ \delta^{(2)}_2 = (0.6459)\cdot 0.2287 = 0.1477 \end{gathered}"></div>
      <p>Минус в первой клетке означает «поднимай выход», плюс во второй «опускай». Этот вектор
      слой передаёт дальше.</p>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3e b4e b5e" data-focus="b2">
      <div class="step-kicker">Шаг 3 · градиенты параметров слоя 2</div>
      <h4>Столбец на строку даёт таблицу умножения</h4>
      <p><span class="math-inline" data-tex="(2\times 1) \cdot  (1\times 2) = (2\times 2)"></span>: единица в середине схлопывается,
      наружу выходят обе размерности. Клетка <span class="math-inline" data-tex="(i, j)"></span> берёт
      <span class="math-inline" data-tex="i"></span>-е число из столбца и <span class="math-inline" data-tex="j"></span>-е из строки.</p>
      <div class="math-display" data-tex="\left(\frac{\partial E}{\partial \mathbf W^{(2)}}\right)_{ij} = \delta^{(2)}_i\, h^{(1)}_j"></div>
      <div class="worked-example">
        <div class="worked-label">Четыре клетки по очереди</div>
        <div class="worked-trace">
          <div class="worked-trace-title"><span class="math-inline" data-tex="\delta ^{(2)}"></span> = (−0.1166, 0.1477), <span class="math-inline" data-tex="\mathbf h^{(1)}"></span> = (0.5037, 0.5842)</div>
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
        <p class="worked-reading">Знак всей строки задаёт дельта, а отношение внутри строки равно отношению активаций,
        0.5037 к 0.5842. Строки пропорциональны, у матрицы ранг 1.</p>
      </div>
      <p>Градиент смещения равен той же дельте: <span class="math-inline" data-tex="\partial z/\partial b = 1"></span>, поэтому дополнительного
      умножения нет.</p>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3 b4e b5e" data-focus="b3">
      <div class="step-kicker">Шаг 4 · сигнал переходит на слой ниже</div>
      <h4>Сумма идёт по столбцу</h4>
      <p>Клетка <span class="math-inline" data-tex="j"></span> результата собирает вклады всех выходных узлов, но
      берёт из матрицы <em>столбец</em> <span class="math-inline" data-tex="j"></span>. Отсюда транспонирование: те же четыре числа читаются в другом порядке.</p>
      <div class="math-display" data-tex="\left(\frac{\partial E}{\partial \mathbf h^{(1)}}\right)_j = \sum_{k} W^{(2)}_{kj}\, \delta^{(2)}_k"></div>
      <div class="worked-example">
        <div class="worked-label">Два столбца <span class="math-inline" data-tex="\mathbf W^{(2)}"></span>, две суммы</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Первый столбец (0.50, 0.20), второй (−0.30, 0.60)</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">узел 1</div>
            <div class="math-display worked-trace-math" data-tex="\begin{gathered} 0.50\cdot(-0.1166) + 0.20\cdot(0.1477) \\ = -0.0583 + 0.0295 = -0.0288 \end{gathered}"></div>
            <div class="worked-trace-note">ветви тянут в разные стороны и почти гасятся</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">узел 2</div>
            <div class="math-display worked-trace-math" data-tex="\begin{gathered} (-0.30)\cdot(-0.1166) + 0.60\cdot(0.1477) \\ = 0.0350 + 0.0886 = 0.1236 \end{gathered}"></div>
            <div class="worked-trace-note">здесь оба вклада положительные</div>
          </div>
        </div>
        <p class="worked-reading">Два скрытых
        узла получили сигналы, отличающиеся вчетверо, хотя дельты выходов были
        почти равны по модулю. Всё решило сочетание знаков в столбцах.</p>
      </div>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3 b4 b5e" data-focus="b4">
      <div class="step-kicker">Шаг 5 · дельта первого слоя</div>
      <h4>Строка в точности повторяет шаг 2</h4>
      <p>Вектор <span class="math-inline" data-tex="(2\times 1)"></span> поэлементно умножается на производную активации, получается
      дельта. Разница только в том, откуда взялся первый множитель.</p>
      <div class="math-display" data-tex="\begin{gathered} \delta^{(1)}_1 = (-0.0288)\cdot 0.2500 = -0.0072 \\ \delta^{(1)}_2 = (0.1236)\cdot 0.2429 = 0.0300 \end{gathered}"></div>
      <p>Длина этого вектора 0.0309 против 0.1882 у дельты второго слоя: сигнал уменьшился
      вшестеро за один слой, хотя оба множителя <span class="math-inline" data-tex="\sigma'"></span> были почти в максимуме.</p>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3 b4 b5" data-focus="b5">
      <div class="step-kicker">Шаг 6 · градиенты параметров слоя 1</div>
      <h4>Та же строка, что и на шаге 3</h4>
      <p>Внешнее произведение дельты на вход слоя. Вход первого слоя это сам
      <span class="math-inline" data-tex="\mathbf x^{(0)} = (0.5, 0.8)"></span>.</p>
      <div class="math-display" data-tex="\begin{gathered} \frac{\partial E}{\partial \mathbf W^{(1)}} = \begin{pmatrix} (-0.0072)(0.5) &amp; (-0.0072)(0.8) \\ (0.0300)(0.5) &amp; (0.0300)(0.8) \end{pmatrix} \\[6pt] = \begin{pmatrix} -0.0036 &amp; -0.0058 \\ 0.0150 &amp; 0.0240 \end{pmatrix} \end{gathered}"></div>
      <p>Отношение чисел внутри каждой строки равно 1.6, отношению входов 0.8 к 0.5. Дельта у
      них общая, различает их только вход.</p>
    </div>
    <div class="step-panel" data-on="dat b1 b2 b3 b4 b5 nb" data-focus="nb">
      <div class="step-kicker">Шаг 7 · все двенадцать чисел</div>
      <h4>Градиент всегда той же формы, что параметр</h4>
      <table class="shape-table">
        <tr><th>Параметр</th><th>Формула клетки</th><th>Значение</th></tr>
        <tr><td><span class="math-inline" data-tex="W^{(1)}_{11}, W^{(1)}_{12}"></span></td><td><span class="math-inline" data-tex="\delta ^{(1)}_{1}\cdot x_{1}, \delta ^{(1)}_{1}\cdot x_{2}"></span></td><td>−0.0036, −0.0058</td></tr>
        <tr><td><span class="math-inline" data-tex="W^{(1)}_{21}, W^{(1)}_{22}"></span></td><td><span class="math-inline" data-tex="\delta ^{(1)}_{2}\cdot x_{1}, \delta ^{(1)}_{2}\cdot x_{2}"></span></td><td>0.0150, 0.0240</td></tr>
        <tr><td><span class="math-inline" data-tex="b^{(1)}_{1}, b^{(1)}_{2}"></span></td><td><span class="math-inline" data-tex="\delta ^{(1)}_{1}, \delta ^{(1)}_{2}"></span></td><td>−0.0072, 0.0300</td></tr>
        <tr><td><span class="math-inline" data-tex="W^{(2)}_{11}, W^{(2)}_{12}"></span></td><td><span class="math-inline" data-tex="\delta ^{(2)}_{1}\cdot h^{(1)}_{1}, \delta ^{(2)}_{1}\cdot h^{(1)}_{2}"></span></td><td>−0.0588, −0.0681</td></tr>
        <tr><td><span class="math-inline" data-tex="W^{(2)}_{21}, W^{(2)}_{22}"></span></td><td><span class="math-inline" data-tex="\delta ^{(2)}_{2}\cdot h^{(1)}_{1}, \delta ^{(2)}_{2}\cdot h^{(1)}_{2}"></span></td><td>0.0744, 0.0863</td></tr>
        <tr><td><span class="math-inline" data-tex="b^{(2)}_{1}, b^{(2)}_{2}"></span></td><td><span class="math-inline" data-tex="\delta ^{(2)}_{1}, \delta ^{(2)}_{2}"></span></td><td>−0.1166, 0.1477</td></tr>
      </table>
      <p>Если в коде градиент получился не той формы, что параметр, вы почти
      наверняка забыли транспонирование или перепутали порядок множителей во
      внешнем произведении. Сверка форм ловит обе ошибки ещё до отладки чисел.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-yellow">
  <strong>Как проверить себя:</strong> сдвиньте любой параметр на
  <span class="math-inline" data-tex="\varepsilon  = 10^{-6}"></span> в обе стороны, дважды посчитайте прямой проход и возьмите
  <span class="math-inline" data-tex="(E_{+} - E_{-}) / 2\varepsilon"></span>. Для всех двенадцати чисел выше расхождение с аналитическим
  градиентом не превышает 5·10⁻¹¹: так этот пример и проверен.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обратный проход это цикл из двух действий на слой. Его стоимость того же порядка, что и
  один прямой проход, независимо от глубины сети и от числа параметров.
</div>

---

## Часть 8. Вычислительный граф: один путь вперёд и четыре пути назад

<p>
  До сих пор сеть была разобрана по узлам: восемь весов и четыре смещения, у
  каждого своя цепочка. Теперь свернём всю картину до шести прямоугольников: вход, два сумматора, две активации
  и ошибка. Это <strong>вычислительный граф</strong>, схема, по которой фреймворки считают
  градиенты. На ней прямой проход идёт одним путём слева направо, а бэкпроп проходит
  четыре маршрута от <span class="math-inline" data-tex="E"></span> назад к четырём параметрам.
</p>

<p>
  Разница с частями 2–7 в масштабе: там мы смотрели на отдельные числа
  <span class="math-inline" data-tex="W^{(2)}_{21}"></span>, здесь каждый узел сразу вектор или матрица. Формулы становятся
  короче, но смысл у них тот же.
</p>

<div class="callout-blue">
  <strong>Зачем ещё одна картинка:</strong> на графе нейронов общая форма рассуждения
  теряется за двенадцатью частными случаями. Граф из шести узлов легко запомнить, и по
  нему четыре градиента восстанавливаются, даже если конкретные индексы забылись.
</div>

### Интерактив 14 · прямой проход по вычислительному графу

<p>
  Схема разворачивается слева направо. В каждом узле стоит его значение на нашем примере,
  под узлом формула, которая это значение произвела.
</p>

<div class="stage" id="stageCg" tabindex="0">
  <div class="stage-figure">
<svg class="mg" id="cg" viewBox="0 0 960 416" role="img" aria-label="Вычислительный граф прямого прохода: шесть узлов и четыре параметра">
<defs><marker id="cg-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="cg-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="cg-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<text x="40" y="28" class="cap" text-anchor="start">Шесть узлов, весь прямой проход. Стрелка читается как «входит в».</text>
<g data-key="px"><rect x="6.0" y="141.0" width="128" height="62" rx="10" fill="#FFFFFF" stroke="#3576C0" stroke-width="2"/><foreignObject x="6" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf x^{(0)}"></div></foreignObject><foreignObject x="6" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.5,\ 0.8)"></div></foreignObject><text x="70" y="250" class="cap" text-anchor="middle">вход примера</text></g>
<g data-key="py"><rect x="812.0" y="55.0" width="120" height="34" rx="10" fill="#FFFFFF" stroke="#3576C0" stroke-width="2"/><foreignObject x="812" y="55" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf y = (1,\ 0)"></div></foreignObject><line x1="872" y1="89" x2="872" y2="137.0" stroke="#3576C0" stroke-width="1.8" marker-end="url(#cg-arb)"/></g>
<g data-key="p1"><rect x="159.0" y="55.0" width="62" height="34" rx="10" fill="#E9E1C2" stroke="#C29E08" stroke-width="2"/><foreignObject x="159" y="55" width="62" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf W^{(1)}"></div></foreignObject><line x1="190" y1="89" x2="209.8" y2="137.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#cg-arw)"/><rect x="231.0" y="55.0" width="62" height="34" rx="10" fill="#E9E1C2" stroke="#C29E08" stroke-width="2"/><foreignObject x="231" y="55" width="62" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf b^{(1)}"></div></foreignObject><line x1="262" y1="89" x2="242.2" y2="137.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#cg-arw)"/></g>
<g data-key="z1"><line x1="134.0" y1="172" x2="159.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#cg-arw)"/><rect x="162.0" y="141.0" width="128" height="62" rx="10" fill="#F4F7EE" stroke="#C29E08" stroke-width="2"/><foreignObject x="162" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf z^{(1)}"></div></foreignObject><foreignObject x="162" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.0150,\ 0.3400)"></div></foreignObject><foreignObject x="151" y="211" width="150" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\mathbf z^{(1)} = \mathbf W^{(1)}\mathbf x^{(0)} + \mathbf b^{(1)}"></div></foreignObject><text x="226" y="250" class="cap" text-anchor="middle">линейная часть</text></g>
<g data-key="a1"><line x1="290.0" y1="172" x2="315.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#cg-arw)"/><rect x="318.0" y="141.0" width="128" height="62" rx="10" fill="#F4F7EE" stroke="#73B222" stroke-width="2"/><foreignObject x="318" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)}"></div></foreignObject><foreignObject x="318" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.5037,\ 0.5842)"></div></foreignObject><foreignObject x="307" y="211" width="150" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)} = \sigma\!\left(\mathbf z^{(1)}\right)"></div></foreignObject><text x="382" y="250" class="cap" text-anchor="middle">нелинейность</text></g>
<g data-key="p2"><rect x="471.0" y="55.0" width="62" height="34" rx="10" fill="#E9E1C2" stroke="#C29E08" stroke-width="2"/><foreignObject x="471" y="55" width="62" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf W^{(2)}"></div></foreignObject><line x1="502" y1="89" x2="521.8" y2="137.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#cg-arw)"/><rect x="543.0" y="55.0" width="62" height="34" rx="10" fill="#E9E1C2" stroke="#C29E08" stroke-width="2"/><foreignObject x="543" y="55" width="62" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf b^{(2)}"></div></foreignObject><line x1="574" y1="89" x2="554.2" y2="137.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#cg-arw)"/></g>
<g data-key="z2"><line x1="446.0" y1="172" x2="471.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#cg-arw)"/><rect x="474.0" y="141.0" width="128" height="62" rx="10" fill="#F4F7EE" stroke="#C29E08" stroke-width="2"/><foreignObject x="474" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)}"></div></foreignObject><foreignObject x="474" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.1266,\ 0.6013)"></div></foreignObject><foreignObject x="463" y="211" width="150" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)} = \mathbf W^{(2)}\mathbf h^{(1)} + \mathbf b^{(2)}"></div></foreignObject><text x="538" y="250" class="cap" text-anchor="middle">линейная часть</text></g>
<g data-key="a2"><line x1="602.0" y1="172" x2="627.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#cg-arw)"/><rect x="630.0" y="141.0" width="128" height="62" rx="10" fill="#F4F7EE" stroke="#73B222" stroke-width="2"/><foreignObject x="630" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf h^{(2)} = \hat{\mathbf y}"></div></foreignObject><foreignObject x="630" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.5316,\ 0.6459)"></div></foreignObject><foreignObject x="619" y="211" width="150" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="\mathbf h^{(2)} = \sigma\!\left(\mathbf z^{(2)}\right)"></div></foreignObject><text x="694" y="250" class="cap" text-anchor="middle">предсказание</text></g>
<g data-key="er"><line x1="758.0" y1="172" x2="805.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#cg-arw)"/><rect x="804.0" y="141.0" width="136" height="62" rx="10" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2"/><foreignObject x="804" y="145" width="136" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="E"></div></foreignObject><foreignObject x="804" y="174" width="136" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="0.3183"></div></foreignObject><foreignObject x="792" y="211" width="160" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#111111;font-weight:400" data-tex="E = \tfrac{1}{2}\left\|\mathbf h^{(2)} - \mathbf y\right\|^{2}"></div></foreignObject><text x="872" y="250" class="cap" text-anchor="middle">цена ошибки</text></g>
<g data-key="comp" data-only="1"><rect x="40" y="278" width="880" height="44" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.4"/><foreignObject x="50" y="279" width="860" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="E = \tfrac{1}{2}\left\| \sigma\!\left(\mathbf W^{(2)}\sigma\!\left(\mathbf W^{(1)}\mathbf x^{(0)} + \mathbf b^{(1)}\right) + \mathbf b^{(2)}\right) - \mathbf y \right\|^{2}"></div></foreignObject></g>
<g data-key="cache" data-only="1"><rect x="40" y="330" width="880" height="44" rx="10" fill="#F7F5EE" stroke="#A8A296" stroke-width="1.4" stroke-dasharray="6 5"/><foreignObject x="50" y="338.96" width="860" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span>в памяти до обратного прохода: <span data-tex="\mathbf x^{(0)},\; \mathbf z^{(1)},\; \mathbf h^{(1)},\; \mathbf z^{(2)},\; \mathbf h^{(2)},\; \mathbf W^{(1)},\; \mathbf W^{(2)}"></span></span></div></foreignObject></g>
<text x="40" y="402" class="legend">зелёное: что вычисляет прямой проход · жёлтое: параметры · синее: данные и значения узлов</text>
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
      <p>Вход <span class="math-inline" data-tex="\mathbf x^{(0)}"></span> входит слева, цель <span class="math-inline" data-tex="\mathbf y"></span> приходит сверху справа, прямо в
      узел ошибки. Цель участвует в одной операции и потому появится в одном множителе
      градиента.</p>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="\mathbf x^{(0)} = \begin{pmatrix} x^{(0)}_1 \\ x^{(0)}_2 \end{pmatrix} = \begin{pmatrix} 0.5 \\ 0.8 \end{pmatrix}, \qquad \mathbf y = \begin{pmatrix} y_1 \\ y_2 \end{pmatrix} = \begin{pmatrix} 1 \\ 0 \end{pmatrix}"></div>
        <div class="math-display" data-tex="i,\, j \in \{1, 2\} \;\; \text{: номера узлов слоя}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1" data-focus="z1">
      <div class="step-kicker">Шаг 2 · первый сумматор</div>
      <h4>Параметры входят в граф как отдельные узлы</h4>
      <p><span class="math-inline" data-tex="\mathbf W^{(1)}"></span> и <span class="math-inline" data-tex="\mathbf b^{(1)}"></span> нарисованы как входы <span class="math-inline" data-tex="\mathbf z^{(1)}"></span>, поэтому по
      ним можно взять производную так же, как по любому другому входу.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · одна строка матричного умножения</div>
        <div class="worked-trace">
          <div class="worked-trace-title"><span class="math-inline" data-tex="\mathbf W^{(1)}"></span> = (0.15, −0.20; 0.40, 0.30), <span class="math-inline" data-tex="\mathbf x^{(0)}"></span> = (0.5, 0.8), <span class="math-inline" data-tex="\mathbf b^{(1)}"></span> = (0.10, −0.10)</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="z^{(1)}_{1}"></span></div>
            <div class="math-display worked-trace-math" data-tex="0.15\cdot 0.5 + (-0.20)\cdot 0.8 + 0.10 = 0.0150"></div>
            <div class="worked-trace-note">вклады входов почти погасили друг друга</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="z^{(1)}_{2}"></span></div>
            <div class="math-display worked-trace-math" data-tex="0.40\cdot 0.5 + 0.30\cdot 0.8 + (-0.10) = 0.3400"></div>
            <div class="worked-trace-note">оба слагаемых тянут в одну сторону</div>
          </div>
        </div>
        <p class="worked-reading">Узел <span class="math-inline" data-tex="\mathbf z^{(1)}"></span> обозначает весь слой. Два числа внутри него получились одной
        операцией.</p>
      </div>
          <div class="callout-blue">
        <strong>Матричная форма первого слоя:</strong>
        <div class="math-display" data-tex="\begin{pmatrix} z^{(1)}_1 \\ z^{(1)}_2 \end{pmatrix} = \begin{pmatrix} W^{(1)}_{11} &amp; W^{(1)}_{12} \\ W^{(1)}_{21} &amp; W^{(1)}_{22} \end{pmatrix}\begin{pmatrix} x^{(0)}_1 \\ x^{(0)}_2 \end{pmatrix} + \begin{pmatrix} b^{(1)}_1 \\ b^{(1)}_2 \end{pmatrix}"></div>
        <div class="math-display" data-tex="z^{(1)}_i = \sum_{j} W^{(1)}_{ij}\, x^{(0)}_j + b^{(1)}_i, \qquad W^{(1)}_{ij} : \; j \to i"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1" data-focus="a1">
      <div class="step-kicker">Шаг 3 · активация</div>
      <h4>Сигмоида стоит отдельным узлом</h4>
      <p>Разрез из части 2 остался и здесь: <span class="math-inline" data-tex="z"></span> и <span class="math-inline" data-tex="h"></span> это разные узлы. На
      обратном пути между ними появится множитель <span class="math-inline" data-tex="\sigma '"></span>. Если слепить их в один прямоугольник, этот множитель негде будет поставить.</p>
      <p>У этого узла нет параметров: ни одна стрелка не входит в него сверху. Назад сигнал
      проходит через него транзитом.</p>
          <div class="callout-blue">
        <strong>Матричная форма активации:</strong>
        <div class="math-display" data-tex="\begin{pmatrix} h^{(1)}_1 \\ h^{(1)}_2 \end{pmatrix} = \begin{pmatrix} \sigma\!\left(z^{(1)}_1\right) \\ \sigma\!\left(z^{(1)}_2\right) \end{pmatrix}, \qquad h^{(1)}_i = \sigma\!\left(z^{(1)}_i\right)"></div>
        <div class="math-display" data-tex="\sigma'\!\left(z^{(1)}_i\right) = h^{(1)}_i\left(1 - h^{(1)}_i\right)"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2" data-focus="z2">
      <div class="step-kicker">Шаг 4 · второй слой</div>
      <h4>Та же пара узлов, только вход другой</h4>
      <p>Формула для <span class="math-inline" data-tex="\mathbf z^{(2)}"></span> отличается от формулы для <span class="math-inline" data-tex="\mathbf z^{(1)}"></span> одним: вместо
      <span class="math-inline" data-tex="\mathbf x^{(0)}"></span> в неё входит <span class="math-inline" data-tex="\mathbf h^{(1)}"></span>. Глубина сети это повторение одного
      блока с подстановкой предыдущего выхода.</p>
          <div class="callout-blue">
        <strong>Матричная форма второго слоя:</strong>
        <div class="math-display" data-tex="\begin{pmatrix} z^{(2)}_1 \\ z^{(2)}_2 \end{pmatrix} = \begin{pmatrix} W^{(2)}_{11} &amp; W^{(2)}_{12} \\ W^{(2)}_{21} &amp; W^{(2)}_{22} \end{pmatrix}\begin{pmatrix} h^{(1)}_1 \\ h^{(1)}_2 \end{pmatrix} + \begin{pmatrix} b^{(2)}_1 \\ b^{(2)}_2 \end{pmatrix}"></div>
        <div class="math-display" data-tex="z^{(2)}_i = \sum_{j} W^{(2)}_{ij}\, h^{(1)}_j + b^{(2)}_i"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2 a2" data-focus="a2">
      <div class="step-kicker">Шаг 5 · предсказание</div>
      <h4>Выход последней активации и есть <span class="math-inline" data-tex="\hat{\mathbf y}"></span></h4>
      <p>Отдельного «слоя предсказания» нет: <span class="math-inline" data-tex="\mathbf h^{(2)}"></span> это обычная активация, после
      которой нет следующего слоя. До цели (1, 0) далеко: 0.5316 вместо единицы и 0.6459
      вместо нуля.</p>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="\begin{pmatrix} h^{(2)}_1 \\ h^{(2)}_2 \end{pmatrix} = \begin{pmatrix} \sigma\!\left(z^{(2)}_1\right) \\ \sigma\!\left(z^{(2)}_2\right) \end{pmatrix}, \qquad h^{(2)}_i = \hat{y}_i = \sigma\!\left(z^{(2)}_i\right)"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2 a2 er" data-focus="er">
      <div class="step-kicker">Шаг 6 · цена</div>
      <h4>Ошибка тоже стоит узлом графа</h4>
      <p>Здесь сходятся две стрелки: предсказание и цель. Обратный путь начинается отсюда,
      поэтому смена функции потерь затрагивает один множитель, самый первый.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · во что обошёлся этот прямой проход</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Промахи по компонентам</span>
            <div class="math-display worked-math" data-tex="\mathbf h^{(2)} - \mathbf y = \left(-0.4684,\; 0.6459\right)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Суммарная цена</span>
            <div class="math-display worked-math" data-tex="E = 0.1097 + 0.2086 = 0.3183"></div>
          </div>
        </div>
        <p class="worked-reading">Второй выход промахнулся сильнее первого и вносит в общую цену почти вдвое больше.
        Обучение уменьшает это число, а бэкпроп считает для него градиенты.</p>
      </div>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="E = \tfrac{1}{2}\sum_i \left(h^{(2)}_i - y_i\right)^2 = \tfrac{1}{2}\left(h^{(2)}_1 - y_1\right)^2 + \tfrac{1}{2}\left(h^{(2)}_2 - y_2\right)^2"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2 a2 er comp" data-focus="comp">
      <div class="step-kicker">Шаг 7 · весь граф одной формулой</div>
      <h4>Сеть как одна длинная композиция функций</h4>
      <p>Если подставить каждый узел в следующий, получится строка внизу. Из неё видно, что <span class="math-inline" data-tex="E"></span> зависит от всех четырёх параметров через вложенные
      скобки.</p>
      <p>Такую строку не дифференцируют в лоб: цепное правило берёт производную композиции по
      одному звену за раз, двигаясь по графу справа налево.</p>
          <div class="callout-blue">
        <strong>Та же композиция по индексам:</strong>
        <div class="math-display" data-tex="h^{(2)}_i = \sigma\!\left(\sum_k W^{(2)}_{ik}\, \sigma\!\left(\sum_j W^{(1)}_{kj} x^{(0)}_j + b^{(1)}_k\right) + b^{(2)}_i\right)"></div>
        <div class="math-display" data-tex="E = \tfrac{1}{2}\sum_i \left(h^{(2)}_i - y_i\right)^2"></div>
      </div>
    </div>
    <div class="step-panel" data-on="px py p1 z1 a1 p2 z2 a2 er cache" data-focus="cache">
      <div class="step-kicker">Шаг 8 · что остаётся в памяти</div>
      <h4>Прямой проход оставляет после себя кэш</h4>
      <p>Обратный проход не пересчитывает сеть, а комбинирует уже посчитанное. Поэтому все
      промежуточные узлы приходится держать в памяти до конца шага обучения.</p>
      <p>Память под обучение растёт с глубиной сети и размером батча, а не только с числом
      параметров.</p>
          <div class="callout-blue">
        <strong>Что лежит в кэше, по индексам:</strong>
        <div class="math-display" data-tex="x^{(0)}_j,\quad z^{(1)}_i,\; h^{(1)}_i,\quad z^{(2)}_i,\; h^{(2)}_i,\quad W^{(1)}_{ij},\; W^{(2)}_{ij}"></div>
        <div class="math-display" data-tex="\mathbf W^{(\ell)} \in \mathbb{R}^{2\times 2}, \qquad \mathbf b^{(\ell)},\, \mathbf z^{(\ell)},\, \mathbf h^{(\ell)} \in \mathbb{R}^{2}"></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Интерактив 15 · четыре пути назад по тому же графу

<p>
  Те же шесть узлов на тех же местах. Меняется направление чтения: теперь мы идём от
  <span class="math-inline" data-tex="E"></span> влево и на каждом участке пути выписываем производную. Красные стрелки
  внизу показывают множители цепного правила, а формулы под схемой накапливаются и к концу
  дают все четыре градиента.
</p>

<div class="stage" id="stageGp" tabindex="0">
  <div class="stage-figure">
<svg class="mg" id="gp" viewBox="0 0 960 544" role="img" aria-label="Четыре пути обратного прохода по вычислительному графу">
<defs><marker id="gp-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="gp-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="gp-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<text x="40" y="28" class="cap" text-anchor="start">Тот же граф читаем справа налево: красная стрелка показывает производную одного участка пути.</text>
<rect x="159.0" y="55.0" width="62" height="34" rx="10" fill="#E9E1C2" stroke="#C29E08" stroke-width="2"/><foreignObject x="159" y="55" width="62" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf W^{(1)}"></div></foreignObject><line x1="190" y1="89" x2="209.8" y2="137.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#gp-arw)"/><rect x="231.0" y="55.0" width="62" height="34" rx="10" fill="#E9E1C2" stroke="#C29E08" stroke-width="2"/><foreignObject x="231" y="55" width="62" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf b^{(1)}"></div></foreignObject><line x1="262" y1="89" x2="242.2" y2="137.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#gp-arw)"/><rect x="471.0" y="55.0" width="62" height="34" rx="10" fill="#E9E1C2" stroke="#C29E08" stroke-width="2"/><foreignObject x="471" y="55" width="62" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf W^{(2)}"></div></foreignObject><line x1="502" y1="89" x2="521.8" y2="137.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#gp-arw)"/><rect x="543.0" y="55.0" width="62" height="34" rx="10" fill="#E9E1C2" stroke="#C29E08" stroke-width="2"/><foreignObject x="543" y="55" width="62" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf b^{(2)}"></div></foreignObject><line x1="574" y1="89" x2="554.2" y2="137.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#gp-arw)"/>
<rect x="812.0" y="55.0" width="120" height="34" rx="10" fill="#FFFFFF" stroke="#3576C0" stroke-width="2"/><foreignObject x="812" y="55" width="120" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf y = (1,\ 0)"></div></foreignObject><line x1="872" y1="89" x2="872" y2="137.0" stroke="#3576C0" stroke-width="1.8" marker-end="url(#gp-arb)"/>
<rect x="6.0" y="141.0" width="128" height="62" rx="10" fill="#FFFFFF" stroke="#3576C0" stroke-width="2"/><foreignObject x="6" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf x^{(0)}"></div></foreignObject><foreignObject x="6" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.5,\ 0.8)"></div></foreignObject><line x1="134.0" y1="172" x2="159.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#gp-arw)"/><rect x="162.0" y="141.0" width="128" height="62" rx="10" fill="#F4F7EE" stroke="#C29E08" stroke-width="2"/><foreignObject x="162" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf z^{(1)}"></div></foreignObject><foreignObject x="162" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.0150,\ 0.3400)"></div></foreignObject><line x1="290.0" y1="172" x2="315.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#gp-arw)"/><rect x="318.0" y="141.0" width="128" height="62" rx="10" fill="#F4F7EE" stroke="#73B222" stroke-width="2"/><foreignObject x="318" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)}"></div></foreignObject><foreignObject x="318" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.5037,\ 0.5842)"></div></foreignObject><line x1="446.0" y1="172" x2="471.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#gp-arw)"/><rect x="474.0" y="141.0" width="128" height="62" rx="10" fill="#F4F7EE" stroke="#C29E08" stroke-width="2"/><foreignObject x="474" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)}"></div></foreignObject><foreignObject x="474" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.1266,\ 0.6013)"></div></foreignObject><line x1="602.0" y1="172" x2="627.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#gp-arw)"/><rect x="630.0" y="141.0" width="128" height="62" rx="10" fill="#F4F7EE" stroke="#73B222" stroke-width="2"/><foreignObject x="630" y="145" width="128" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf h^{(2)} = \hat{\mathbf y}"></div></foreignObject><foreignObject x="630" y="174" width="128" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="(0.5316,\ 0.6459)"></div></foreignObject><line x1="758.0" y1="172" x2="805.0" y2="172" stroke="#5E5850" stroke-width="1.8" marker-end="url(#gp-arw)"/><rect x="804.0" y="141.0" width="136" height="62" rx="10" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2"/><foreignObject x="804" y="145" width="136" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="E"></div></foreignObject><foreignObject x="804" y="174" width="136" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#3576C0;font-weight:400" data-tex="0.3183"></div></foreignObject>
<g data-key="hW2" data-only="1"><rect x="466.0" y="50.0" width="72" height="44" rx="9" fill="none" stroke="#C30B0A" stroke-width="1.8" stroke-dasharray="6 5"/></g>
<g data-key="hb2" data-only="1"><rect x="538.0" y="50.0" width="72" height="44" rx="9" fill="none" stroke="#C30B0A" stroke-width="1.8" stroke-dasharray="6 5"/></g>
<g data-key="hW1" data-only="1"><rect x="154.0" y="50.0" width="72" height="44" rx="9" fill="none" stroke="#C30B0A" stroke-width="1.8" stroke-dasharray="6 5"/></g>
<g data-key="hb1" data-only="1"><rect x="226.0" y="50.0" width="72" height="44" rx="9" fill="none" stroke="#C30B0A" stroke-width="1.8" stroke-dasharray="6 5"/></g>
<g data-key="bw1" data-only="1"><line x1="872" y1="222" x2="697" y2="222" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#gp-arr)"/><foreignObject x="708" y="225" width="150" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="\partial E/\partial \mathbf h^{(2)} = \mathbf h^{(2)} - \mathbf y"></div></foreignObject></g>
<g data-key="bw2" data-only="1"><line x1="694" y1="222" x2="541" y2="222" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#gp-arr)"/><foreignObject x="541" y="225" width="150" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="\partial \mathbf h^{(2)}/\partial \mathbf z^{(2)} = \sigma'\!\left(\mathbf z^{(2)}\right)"></div></foreignObject></g>
<g data-key="bw3" data-only="1"><line x1="538" y1="222" x2="385" y2="222" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#gp-arr)"/><foreignObject x="385" y="225" width="150" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="\partial \mathbf z^{(2)}/\partial \mathbf h^{(1)} = \left(\mathbf W^{(2)}\right)^{\!\top}"></div></foreignObject></g>
<g data-key="bw4" data-only="1"><line x1="382" y1="222" x2="229" y2="222" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#gp-arr)"/><foreignObject x="229" y="225" width="150" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11.5px;color:#9C0908;font-weight:400" data-tex="\partial \mathbf h^{(1)}/\partial \mathbf z^{(1)} = \sigma'\!\left(\mathbf z^{(1)}\right)"></div></foreignObject></g>
<g data-key="dl2" data-only="1"><path d="M 538 260 L 538 266 L 872 266 L 872 260" fill="none" stroke="#C30B0A" stroke-width="1.6"/><foreignObject x="555" y="267" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\boldsymbol\delta^{(2)} = (-0.1166,\ 0.1477)"></div></foreignObject></g>
<g data-key="dl1" data-only="1"><path d="M 226 260 L 226 266 L 530 266 L 530 260" fill="none" stroke="#C30B0A" stroke-width="1.6"/><foreignObject x="228" y="267" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\boldsymbol\delta^{(1)} = (-0.0072,\ 0.0300)"></div></foreignObject></g>
<g data-key="pw2" data-only="1"><line x1="521.8" y1="139.0" x2="502" y2="92" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#gp-arr)"/><line x1="554.2" y1="139.0" x2="574" y2="92" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#gp-arr)"/><foreignObject x="431" y="101" width="70" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="\times \left(\mathbf h^{(1)}\right)^{\!\top}"></div></foreignObject><foreignObject x="580" y="101" width="40" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="\times 1"></div></foreignObject></g>
<g data-key="pw1" data-only="1"><line x1="209.8" y1="139.0" x2="190" y2="92" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#gp-arr)"/><line x1="242.2" y1="139.0" x2="262" y2="92" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#gp-arr)"/><foreignObject x="119" y="101" width="70" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="\times \left(\mathbf x^{(0)}\right)^{\!\top}"></div></foreignObject><foreignObject x="268" y="101" width="40" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#9C0908;font-weight:400" data-tex="\times 1"></div></foreignObject></g>
<g data-key="g4" data-only="1"><rect x="40" y="304" width="880" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="50" y="312.96" width="860" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span>четыре маршрута от <span data-tex="E"></span> назад: <span data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}},\ \frac{\partial E}{\partial \mathbf b^{(2)}},\ \frac{\partial E}{\partial \mathbf W^{(1)}},\ \frac{\partial E}{\partial \mathbf b^{(1)}}"></span></span></div></foreignObject></g>
<g data-key="f1" data-only="1"><rect x="40" y="304" width="880" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="45" y="304" width="870" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}} = \frac{\partial E}{\partial \mathbf h^{(2)}}\cdot\frac{\partial \mathbf h^{(2)}}{\partial \mathbf z^{(2)}}\cdot\frac{\partial \mathbf z^{(2)}}{\partial \mathbf W^{(2)}} = \left(\mathbf h^{(2)} - \mathbf y\right)\odot\sigma'\!\left(\mathbf z^{(2)}\right)\left(\mathbf h^{(1)}\right)^{\!\top} = \boldsymbol\delta^{(2)}\left(\mathbf h^{(1)}\right)^{\!\top}"></div></foreignObject></g>
<g data-key="f2" data-only="1"><rect x="40" y="352" width="880" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="45" y="352" width="870" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\frac{\partial E}{\partial \mathbf b^{(2)}} = \frac{\partial E}{\partial \mathbf h^{(2)}}\cdot\frac{\partial \mathbf h^{(2)}}{\partial \mathbf z^{(2)}}\cdot\frac{\partial \mathbf z^{(2)}}{\partial \mathbf b^{(2)}} = \boldsymbol\delta^{(2)}\cdot 1 = \boldsymbol\delta^{(2)}"></div></foreignObject></g>
<g data-key="f3" data-only="1"><rect x="40" y="400" width="880" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="45" y="400" width="870" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\frac{\partial E}{\partial \mathbf W^{(1)}} = \frac{\partial E}{\partial \mathbf h^{(2)}}\frac{\partial \mathbf h^{(2)}}{\partial \mathbf z^{(2)}}\frac{\partial \mathbf z^{(2)}}{\partial \mathbf h^{(1)}}\frac{\partial \mathbf h^{(1)}}{\partial \mathbf z^{(1)}}\frac{\partial \mathbf z^{(1)}}{\partial \mathbf W^{(1)}} = \left(\left(\mathbf W^{(2)}\right)^{\!\top}\boldsymbol\delta^{(2)}\right)\odot\sigma'\!\left(\mathbf z^{(1)}\right)\left(\mathbf x^{(0)}\right)^{\!\top} = \boldsymbol\delta^{(1)}\left(\mathbf x^{(0)}\right)^{\!\top}"></div></foreignObject></g>
<g data-key="f4" data-only="1"><rect x="40" y="448" width="880" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="45" y="448" width="870" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\frac{\partial E}{\partial \mathbf b^{(1)}} = \frac{\partial E}{\partial \mathbf z^{(1)}}\cdot\frac{\partial \mathbf z^{(1)}}{\partial \mathbf b^{(1)}} = \boldsymbol\delta^{(1)}\cdot 1 = \boldsymbol\delta^{(1)}"></div></foreignObject></g>
<text x="40" y="512" class="legend">красное: производная участка пути · пунктирная рамка: параметр, для которого идёт вывод</text>
<text x="40" y="530" class="legend">скобка: множитель, посчитанный один раз и общий для нескольких маршрутов</text>
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
      <h4>Четыре параметра, четыре маршрута</h4>
      <p>Пунктиром обведены все четыре узла, по которым нужен градиент. Ни в один из них стрелка
      не входит: параметры это листья графа, и маршрут на них заканчивается.</p>
      <p>Для всех четырёх правило одно: пройти от <span class="math-inline" data-tex="E"></span> до узла по стрелкам в обратную
      сторону и перемножить то, что написано на каждом участке.</p>
          <div class="callout-blue">
        <strong>Что именно ищем, по индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial \mathbf W^{(\ell)}} = \begin{pmatrix} \dfrac{\partial E}{\partial W^{(\ell)}_{11}} &amp; \dfrac{\partial E}{\partial W^{(\ell)}_{12}} \\[6pt] \dfrac{\partial E}{\partial W^{(\ell)}_{21}} &amp; \dfrac{\partial E}{\partial W^{(\ell)}_{22}} \end{pmatrix}, \qquad \frac{\partial E}{\partial \mathbf b^{(\ell)}} = \begin{pmatrix} \dfrac{\partial E}{\partial b^{(\ell)}_{1}} \\[6pt] \dfrac{\partial E}{\partial b^{(\ell)}_{2}} \end{pmatrix}"></div>
        <div class="math-display" data-tex="\ell \in \{1, 2\} \;\Rightarrow\; 8 + 4 = 12 \;\; \text{чисел}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW2 hb2 bw1" data-focus="bw1">
      <div class="step-kicker">Шаг 2 · первый участок</div>
      <h4>Производная потери по предсказанию</h4>
      <p>Здесь участвует <span class="math-inline" data-tex="\mathbf y"></span>, больше нигде. Для квадратичной ошибки этот множитель
      равен промаху <span class="math-inline" data-tex="\mathbf h^{(2)} - \mathbf y"></span>. Для кросс-энтропии он был бы другим, а остальной
      путь остался бы прежним.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · стартовый импульс</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Предсказание и цель</span>
            <div class="math-display worked-math" data-tex="\mathbf h^{(2)} = (0.5316,\; 0.6459), \; \mathbf y = (1,\; 0)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Первый множитель</span>
            <div class="math-display worked-math" data-tex="\mathbf h^{(2)} - \mathbf y = \left(-0.4684,\; 0.6459\right)"></div>
          </div>
        </div>
        <p class="worked-reading">Знак говорит,
        в какую сторону промахнулись. Первый выход ниже цели, поэтому минус, второй выше, поэтому плюс.</p>
      </div>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial h^{(2)}_i} = h^{(2)}_i - y_i, \qquad \frac{\partial E}{\partial \mathbf h^{(2)}} = \begin{pmatrix} h^{(2)}_1 - y_1 \\ h^{(2)}_2 - y_2 \end{pmatrix}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW2 hb2 bw1 bw2 dl2" data-focus="bw2">
      <div class="step-kicker">Шаг 3 · второй участок</div>
      <h4>Через активацию поэлементно</h4>
      <p>Сигмоида действует на каждую координату отдельно, поэтому её производная
      входит не матрицей, а поэлементным умножением. Произведение первых двух множителей встречается во всех четырёх маршрутах, поэтому у
      него есть имя: <span class="math-inline" data-tex="\delta ^{(2)}"></span>.</p>
      <p>Этот кусок считается один раз и используется всеми путями, которые проходят через
      <span class="math-inline" data-tex="\mathbf z^{(2)}"></span>: за счёт этого бэкпроп быстрый.</p>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="\delta^{(2)}_i = \frac{\partial E}{\partial h^{(2)}_i}\cdot\sigma'\!\left(z^{(2)}_i\right) = \left(h^{(2)}_i - y_i\right) h^{(2)}_i \left(1 - h^{(2)}_i\right)"></div>
        <div class="math-display" data-tex="\boldsymbol\delta^{(2)} = \begin{pmatrix} \delta^{(2)}_1 \\ \delta^{(2)}_2 \end{pmatrix} = \left(\mathbf h^{(2)} - \mathbf y\right) \odot \sigma'\!\left(\mathbf z^{(2)}\right)"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW2 hb2 bw1 bw2 dl2 pw2 f1 f2" data-focus="pw2">
      <div class="step-kicker">Шаг 4 · маршрут закончился</div>
      <h4>Последний участок: от сумматора к его параметру</h4>
      <p>Производная <span class="math-inline" data-tex="\mathbf z^{(2)}"></span> по весам равна тому, что в них вошло, то есть
      <span class="math-inline" data-tex="\mathbf h^{(1)}"></span>; по смещению единице. Домножаем <span class="math-inline" data-tex="\delta ^{(2)}"></span> на эти
      множители и получаем сразу оба градиента второго слоя.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · градиенты второго слоя</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Веса</span>
            <div class="math-display worked-math" data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}} = \begin{pmatrix} -0.0588 &amp; -0.0681 \\ 0.0744 &amp; 0.0863 \end{pmatrix}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Смещения</span>
            <div class="math-display worked-math" data-tex="\frac{\partial E}{\partial \mathbf b^{(2)}} = \left(-0.1166,\; 0.1477\right)^{\!\top}"></div>
          </div>
        </div>
        <p class="worked-reading">Те же шесть чисел, что мы выводили по одному в части 3, получились двумя операциями над
        <span class="math-inline" data-tex="\delta ^{(2)}"></span>.</p>
      </div>
          <div class="callout-blue">
        <strong>Градиенты второго слоя по индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(2)}_{ij}} = \delta^{(2)}_i\, h^{(1)}_j, \qquad \frac{\partial E}{\partial b^{(2)}_i} = \delta^{(2)}_i"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial \mathbf W^{(2)}} = \begin{pmatrix} \delta^{(2)}_1 h^{(1)}_1 &amp; \delta^{(2)}_1 h^{(1)}_2 \\ \delta^{(2)}_2 h^{(1)}_1 &amp; \delta^{(2)}_2 h^{(1)}_2 \end{pmatrix} = \boldsymbol\delta^{(2)}\left(\mathbf h^{(1)}\right)^{\!\top}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW1 hb1 hW2 hb2 bw1 bw2 dl2 f1 f2 bw3" data-focus="bw3">
      <div class="step-kicker">Шаг 5 · дальше влево</div>
      <h4>Через сумматор назад: транспонированная матрица</h4>
      <p>Чтобы добраться до первого слоя, надо пройти узел <span class="math-inline" data-tex="\mathbf z^{(2)}"></span> насквозь.
      Вперёд он умножал на <span class="math-inline" data-tex="\mathbf W^{(2)}"></span>, назад умножает на <span class="math-inline" data-tex="\mathbf W^{(2)\top}"></span>: та же
      матрица, прочитанная по столбцам, потому что каждая активация <span class="math-inline" data-tex="\mathbf h^{(1)}"></span> влияла
      на оба выхода сразу.</p>
          <div class="callout-blue">
        <strong>Сумма по ветвям, расписанная по индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial h^{(1)}_1} = \delta^{(2)}_1 W^{(2)}_{11} + \delta^{(2)}_2 W^{(2)}_{21}"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial h^{(1)}_2} = \delta^{(2)}_1 W^{(2)}_{12} + \delta^{(2)}_2 W^{(2)}_{22}"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial h^{(1)}_j} = \sum_i \delta^{(2)}_i W^{(2)}_{ij} \qquad\Longleftrightarrow\qquad \frac{\partial E}{\partial \mathbf h^{(1)}} = \left(\mathbf W^{(2)}\right)^{\!\top}\boldsymbol\delta^{(2)}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW1 hb1 hW2 hb2 bw1 bw2 dl2 f1 f2 bw3 bw4 dl1" data-focus="bw4">
      <div class="step-kicker">Шаг 6 · виток повторяется</div>
      <h4>Ещё одна активация, ещё один <span class="math-inline" data-tex="\sigma '"></span></h4>
      <p>Участок <span class="math-inline" data-tex="\mathbf h^{(1)} \to  \mathbf z^{(1)}"></span> устроен как участок из шага 3. Накопленное произведение
      получает имя <span class="math-inline" data-tex="\delta ^{(1)}"></span>. Слева от <span class="math-inline" data-tex="\mathbf z^{(1)}"></span> только вход, по которому
      градиент не нужен.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · во сколько раз ослаб сигнал</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Дельта второго слоя</span>
            <div class="math-display worked-math" data-tex="\boldsymbol\delta^{(2)} = \left(-0.1166,\; 0.1477\right)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Дельта первого слоя</span>
            <div class="math-display worked-math" data-tex="\boldsymbol\delta^{(1)} = \left(-0.0072,\; 0.0300\right)"></div>
          </div>
        </div>
        <p class="worked-reading">Два дополнительных множителя по дороге, и сигнал стал примерно вшестеро слабее.</p>
      </div>
          <div class="callout-blue">
        <strong>По индексам:</strong>
        <div class="math-display" data-tex="\delta^{(1)}_j = \frac{\partial E}{\partial h^{(1)}_j}\cdot\sigma'\!\left(z^{(1)}_j\right) = \left(\sum_i \delta^{(2)}_i W^{(2)}_{ij}\right) h^{(1)}_j\left(1 - h^{(1)}_j\right)"></div>
        <div class="math-display" data-tex="\boldsymbol\delta^{(1)} = \left(\left(\mathbf W^{(2)}\right)^{\!\top}\boldsymbol\delta^{(2)}\right) \odot \sigma'\!\left(\mathbf z^{(1)}\right)"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW1 hb1 hW2 hb2 bw1 bw2 dl2 f1 f2 bw3 bw4 dl1 pw1 f3 f4" data-focus="pw1">
      <div class="step-kicker">Шаг 7 · конец обоих маршрутов</div>
      <h4>Последний множитель тот же, только вход другой</h4>
      <p>Для первого слоя в ребро входит <span class="math-inline" data-tex="\mathbf x^{(0)}"></span>, а смещение снова даёт единицу. Маршруты
      первого слоя отличаются от маршрутов второго двумя дополнительными множителями
      посередине.</p>
          <div class="callout-blue">
        <strong>Градиенты первого слоя по индексам:</strong>
        <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(1)}_{ij}} = \delta^{(1)}_i\, x^{(0)}_j, \qquad \frac{\partial E}{\partial b^{(1)}_i} = \delta^{(1)}_i"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial \mathbf W^{(1)}} = \begin{pmatrix} \delta^{(1)}_1 x^{(0)}_1 &amp; \delta^{(1)}_1 x^{(0)}_2 \\ \delta^{(1)}_2 x^{(0)}_1 &amp; \delta^{(1)}_2 x^{(0)}_2 \end{pmatrix} = \boldsymbol\delta^{(1)}\left(\mathbf x^{(0)}\right)^{\!\top}"></div>
      </div>
    </div>
    <div class="step-panel" data-on="hW1 hb1 hW2 hb2 bw1 bw2 dl2 bw3 bw4 dl1 pw1 pw2 f1 f2 f3 f4" data-focus="f1 f2 f3 f4">
      <div class="step-kicker">Шаг 8 · все четыре градиента</div>
      <h4>Один обход графа справа налево считает всё</h4>
      <p>Четыре строки внизу задают весь бэкпроп для нашей сети. Общая часть маршрутов посчитана
      по одному разу, различаются только концы: у весов вход слоя, у смещений единица.</p>
      <div class="worked-example">
        <div class="worked-label">Числовой пример · двенадцать чисел целиком</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Первый слой</span>
            <div class="math-display worked-math" data-tex="\begin{gathered} \frac{\partial E}{\partial \mathbf W^{(1)}} = \begin{pmatrix} -0.0036 &amp; -0.0058 \\ 0.0150 &amp; 0.0240 \end{pmatrix} \\[6pt] \frac{\partial E}{\partial \mathbf b^{(1)}} = \begin{pmatrix} -0.0072 \\ 0.0300 \end{pmatrix} \end{gathered}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Второй слой</span>
            <div class="math-display worked-math" data-tex="\begin{gathered} \frac{\partial E}{\partial \mathbf W^{(2)}} = \begin{pmatrix} -0.0588 &amp; -0.0681 \\ 0.0744 &amp; 0.0863 \end{pmatrix} \\[6pt] \frac{\partial E}{\partial \mathbf b^{(2)}} = \begin{pmatrix} -0.1166 \\ 0.1477 \end{pmatrix} \end{gathered}"></div>
          </div>
        </div>
        <p class="worked-reading">Градиенты первого слоя на порядок мельче: до них сигнал прошёл ещё через
        <span class="math-inline" data-tex="\mathbf W^{(2)\top}"></span> и <span class="math-inline" data-tex="\sigma '"></span>.</p>
      </div>
          <div class="callout-blue">
        <strong>Обе пары формул одним правилом:</strong>
        <div class="math-display" data-tex="\delta^{(2)}_i = \left(h^{(2)}_i - y_i\right)\sigma'\!\left(z^{(2)}_i\right), \qquad \delta^{(1)}_j = \left(\sum_i \delta^{(2)}_i W^{(2)}_{ij}\right)\sigma'\!\left(z^{(1)}_j\right)"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial W^{(\ell)}_{ij}} = \delta^{(\ell)}_i\, h^{(\ell-1)}_j, \qquad \frac{\partial E}{\partial b^{(\ell)}_i} = \delta^{(\ell)}_i, \qquad \mathbf h^{(0)} = \mathbf x^{(0)}"></div>
        <div class="math-display" data-tex="\frac{\partial E}{\partial \mathbf W^{(\ell)}} = \boldsymbol\delta^{(\ell)}\left(\mathbf h^{(\ell-1)}\right)^{\!\top}, \qquad \frac{\partial E}{\partial \mathbf b^{(\ell)}} = \boldsymbol\delta^{(\ell)}"></div>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Участки графа можно свести в таблицу: слева тип участка, справа то, что он делает с
  сигналом при обратном проходе.
</p>

<table class="shape-table">
  <tr><th>Участок пути</th><th>Что стоит на нём</th><th>Как действует на сигнал</th></tr>
  <tr><td><span class="math-inline" data-tex="E \to  \mathbf h^{(2)}"></span></td><td><span class="math-inline" data-tex="\mathbf h^{(2)} - \mathbf y"></span></td><td>задаёт стартовый вектор и знак промаха</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf h^{(\ell)} \to  \mathbf z^{(\ell)}"></span></td><td><span class="math-inline" data-tex="\sigma '(\mathbf z^{(\ell)})"></span></td><td>поэлементное умножение, всегда ≤ 0.25</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf z^{(\ell)} \to  \mathbf h^{(\ell-1)}"></span></td><td><span class="math-inline" data-tex="\mathbf W^{(\ell)\top}"></span></td><td>раскидывает сигнал по ветвям и складывает</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf z^{(\ell)} \to  \mathbf W^{(\ell)}"></span></td><td><span class="math-inline" data-tex="(\mathbf h^{(\ell-1)})^{\top}"></span></td><td>внешнее произведение, маршрут закончен</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf z^{(\ell)} \to  \mathbf b^{(\ell)}"></span></td><td><span class="math-inline" data-tex="1"></span></td><td>ничего не меняет, маршрут закончен</td></tr>
</table>

### Что происходит дальше: шаг обучения

<p>
  Градиент показывает, куда ошибка растёт быстрее всего, поэтому параметры двигают в
  противоположную сторону. Величину шага задаёт скорость обучения <span class="math-inline" data-tex="\alpha"></span>: её
  бэкпроп не вычисляет, а получает извне.
</p>

<div class="math-display" data-tex="\mathbf W^{(\ell)} \leftarrow \mathbf W^{(\ell)} - \alpha\,\frac{\partial E}{\partial \mathbf W^{(\ell)}}, \qquad \mathbf b^{(\ell)} \leftarrow \mathbf b^{(\ell)} - \alpha\,\frac{\partial E}{\partial \mathbf b^{(\ell)}}"></div>

<div class="worked-example">
  <div class="worked-label">Числовой пример · один шаг при α = 0.5</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Двигаем веса второго слоя против градиента</div>
    <div class="worked-trace-row">
      <div class="worked-trace-name"><span class="math-inline" data-tex="W^{(2)}_{11}"></span></div>
      <div class="math-display worked-trace-math" data-tex="0.50 - 0.5\cdot(-0.0588) = 0.5294"></div>
      <div class="worked-trace-note">градиент отрицательный, вес растёт</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name"><span class="math-inline" data-tex="b^{(2)}_{2}"></span></div>
      <div class="math-display worked-trace-math" data-tex="0.15 - 0.5\cdot 0.1477 = 0.0761"></div>
      <div class="worked-trace-note">второй выход был слишком велик, смещение падает</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">новая E</div>
      <div class="math-display worked-trace-math" data-tex="0.3183 \;\rightarrow\; 0.2896"></div>
      <div class="worked-trace-note">прямой проход с новыми параметрами</div>
    </div>
  </div>
  <p class="worked-reading">Один шаг убрал примерно 9% ошибки на этом примере. Дальше цикл повторяется: прямой проход
  по графу слева направо, обратный справа налево, шаг, снова прямой проход.</p>
</div>

<div class="callout-yellow">
  <strong>Подводный камень:</strong> градиент верен только в точке, где он
  посчитан. При слишком большом <span class="math-inline" data-tex="\alpha"></span> шаг уводит в область, где прежнее
  направление уже не годится, и ошибка вместо падения начинает скакать. Сильно уменьшать <span class="math-inline" data-tex="\alpha"></span> тоже нельзя: обучение почти остановится.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> сеть можно записать графом из нескольких операций, а градиент по любому параметру равен
  произведению того, что написано на участках пути от ошибки к этому параметру. Четыре
  маршрута имеют общее начало, поэтому один обход графа справа налево даёт сразу все
  градиенты.
</div>

---

## Часть 9. Общий алгоритм и почему градиент затухает

<p>
  Сеть произвольной глубины описывается двумя строками прямого прохода, и любой слой
  обрабатывается одинаково, первый он или сотый.
</p>

<div class="math-display" data-tex="\mathbf z^{(\ell)} = \mathbf W^{(\ell)} \mathbf h^{(\ell-1)} + \mathbf b^{(\ell)}, \qquad \mathbf h^{(\ell)} = \sigma\!\left(\mathbf z^{(\ell)}\right), \qquad \mathbf h^{(0)} = \mathbf x^{(0)}"></div>

<p>
  Обратный проход занимает три строки. Первая запускает процесс на последнем слое, вторая
  двигает дельту на слой ниже, третья превращает дельту в градиенты.
</p>

<div class="math-display" data-tex="\boldsymbol\delta^{(L)} = \frac{\partial E}{\partial \mathbf h^{(L)}} \odot \sigma'\!\left(\mathbf z^{(L)}\right)"></div>

<div class="math-display" data-tex="\boldsymbol\delta^{(\ell)} = \left(\left(\mathbf W^{(\ell+1)}\right)^{\!\top} \boldsymbol\delta^{(\ell+1)}\right) \odot \sigma'\!\left(\mathbf z^{(\ell)}\right)"></div>

<div class="math-display" data-tex="\frac{\partial E}{\partial \mathbf W^{(\ell)}} = \boldsymbol\delta^{(\ell)} \left(\mathbf h^{(\ell-1)}\right)^{\!\top}, \qquad \frac{\partial E}{\partial \mathbf b^{(\ell)}} = \boldsymbol\delta^{(\ell)}"></div>

<table class="shape-table">
  <tr><th>Величина</th><th>Смысл</th><th>Форма при слое n×m</th><th>В примере</th></tr>
  <tr><td><span class="math-inline" data-tex="\delta ^{(\ell)}"></span></td><td>чувствительность ошибки к сумматорам слоя</td><td>n</td><td>2</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf W^{(\ell)}"></span></td><td>веса слоя</td><td>n×m</td><td>2×2</td></tr>
  <tr><td><span class="math-inline" data-tex="\partial E/\partial \mathbf W^{(\ell)}"></span></td><td>градиент весов</td><td>n×m</td><td>2×2</td></tr>
  <tr><td><span class="math-inline" data-tex="\partial E/\partial \mathbf b^{(\ell)}"></span></td><td>градиент смещений</td><td>n</td><td>2</td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf h^{(\ell-1)}"></span></td><td>вход слоя из кэша</td><td>m</td><td>2</td></tr>
</table>

### Почему это быстро

<p>
  Наивный подход двигает каждый параметр по очереди и смотрит, как изменится ошибка. Он
  требует по одному прямому проходу на параметр: при миллионе параметров это миллион
  проходов на один пример. Бэкпроп обходится <em>одним</em> проходом назад: каждая
  промежуточная величина вычисляется один раз и дальше используется всеми, кому она нужна.
</p>

<p>
  Плата за это память. Все активации приходится держать до конца обратного прохода,
  поэтому расход растёт с глубиной сети и размером батча. Для экономии есть приёмы вроде
  пересчёта активаций вместо их хранения.
</p>

### Затухающий градиент

<p>
  В рекурсии на каждом слое дельта умножается на <span class="math-inline" data-tex="\sigma '(z)"></span>. У сигмоиды этот
  множитель нигде не превышает 0.25, а на насыщенных участках близок к нулю. Значит, при
  движении к первым слоям сигнал раз за разом умножается на маленькое число.
</p>

<div class="callout-red">
  <strong>Что ломается:</strong> в сети из десяти сигмоидных слоёв градиент первого
  слоя содержит десять множителей <span class="math-inline" data-tex="\sigma '"></span>. Даже в самом благоприятном случае, когда каждый равен максимальным 0.25, произведение
  составит около 10⁻⁶, и первые слои почти не обучаются. В нашей сети эффект уже виден:
  один слой ослабил сигнал в шесть раз.
</div>

<p>
  Поэтому популярна ReLU: её производная равна единице на всей положительной полуоси, и
  рекурсия перестаёт систематически гасить сигнал. У неё своя проблема, «мёртвые» нейроны
  с нулевой производной, но глубокие сети с ней обучаются. Для этого же служат остаточные
  связи, нормализация и аккуратная инициализация весов.
</p>

<div class="callout-yellow">
  <strong>Практическая деталь:</strong> ReLU не дифференцируема в нуле. На практике в этой точке берут любое значение из отрезка [0, 1], субградиент. На обучении
  это не сказывается: вероятность попасть ровно в ноль нулевая.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> общие участки цепочки позволяют посчитать все градиенты за один проход, а длинная цепочка
  экспоненциально ослабляет сигнал, если множители по дороге меньше единицы.
</div>

---

## Часть 10. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Нейрон разрезается надвое.</strong> Сумматор <span class="math-inline" data-tex="z"></span> и активация <span class="math-inline" data-tex="h"></span> это разные узлы с разными
  производными.</li>
  <li><strong>Градиент по параметру читается как маршрут по схеме.</strong> Идём от
  ошибки к ребру и перемножаем то, что написано на каждом участке.</li>
  <li><strong>Производная по весу равна тому, что в ребро вошло:</strong>
  <span class="math-inline" data-tex="\partial z/\partial w = h"></span>. Это видно на схеме.</li>
  <li><strong>Производная по входу равна весу ребра:</strong>
  <span class="math-inline" data-tex="\partial z/\partial h = w"></span>. Симметрично предыдущему пункту.</li>
  <li><strong>Производная по смещению равна единице.</strong> Поэтому
  <span class="math-inline" data-tex="\partial E/\partial b = \delta"></span> без единого лишнего умножения.</li>
  <li><strong>Развилка вперёд, сумма назад.</strong> Если узел влияет на несколько
  следующих, вклады складываются.</li>
  <li><strong>Дельта это накопленный сигнал на сумматоре:</strong>
  <span class="math-inline" data-tex="\delta ^{(\ell)} = \partial E/\partial \mathbf z^{(\ell)}"></span>. Этот вектор слой передаёт дальше, и за счёт него алгоритм
  быстрый.</li>
  <li><strong>Два действия на слой.</strong> Пересчитать дельту через
  <span class="math-inline" data-tex="W^{\top}"></span> и <span class="math-inline" data-tex="\sigma '"></span>, затем выдать градиенты: внешнее произведение
  для весов, сама дельта для смещений.</li>
  <li><strong>Откуда транспонирование.</strong> Вперёд матрица раздаёт, назад она же собирает и
  читается по столбцам.</li>
  <li><strong>Функция потерь входит в одну строку.</strong> Остальное от неё не зависит.</li>
  <li><strong>Затухание следует из рекурсии.</strong> Каждый слой умножает сигнал на
  <span class="math-inline" data-tex="\sigma '"></span>, поэтому при <span class="math-inline" data-tex="\sigma ' &lt; 1"></span> он слабеет с глубиной.</li>
</ol>

<p>
  Коротко: по схеме сети числа идут слева направо, а производная ошибки возвращается справа
  налево. По дороге она умножается на то, что написано на рёбрах, и складывается на
  развилках. Формулы бэкпропа записывают это движение.
</p>

<p class="tiny">
  Все числа относятся к иллюстративной сети 2-2-2 с сигмоидой, входом (0.5, 0.8) и
  целью (1, 0); веса и смещения выбраны произвольно. Промежуточные значения и все двенадцать градиентов
  посчитаны скриптом и сверены с численными производными методом центральных разностей:
  расхождение не превышает 5·10⁻¹¹. Округление
  всюду до четырёх знаков после запятой, поэтому произведения округлённых чисел
  могут расходиться с приведённым результатом в последнем знаке.
</p>
