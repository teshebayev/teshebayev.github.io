



<p class="lead">
  Обучение модели — это спуск с горы в тумане. Видно только наклон под ногами;
  производная измеряет этот наклон, градиент собирает наклоны по всем осям в один
  вектор, а шаг делается строго против него. Всё остальное в обучении — повторение
  этих двух действий много раз подряд.
</p>

<p>
  Мы начнём с функции одной переменной и касательной к её графику, дойдём до
  градиента функции многих переменных, соберём из этого полный цикл обучения
  линейной и логистической регрессии и в последней части сделаем настоящий шаг
  спуска для нейросети — с двенадцатью параметрами и живыми числами.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Производная как наклон</strong>
    <p>Достаточно помнить, что производная — это скорость изменения функции, и уметь дифференцировать многочлен.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Два наблюдения: (1, 2) и (2, 3)</strong>
    <p>Из них получается одна парабола потерь, которая проходит через всю статью — от касательной до нейросети.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Шаг спуска руками</strong>
    <p>Вы сможете посчитать шаг для регрессии и для сети 2-2-2 и объяснить, откуда берётся скорость обучения.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные и модель</span>
  <span><i style="background:#C29E08"></i>параметр и операция</span>
  <span><i style="background:#73B222"></i>результат шага</span>
  <span><i style="background:#C30B0A"></i>ошибка, производная, градиент</span>
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не
  на всю схему сразу, а только на яркую часть. Схема нарисована один раз и целиком:
  положение объектов не меняется, меняется только то, куда надо смотреть.
  Клавиши со стрелками работают, когда сцена в фокусе.
</div>

## Часть 1. Что именно мы минимизируем

<p>
  У любой модели есть <strong>параметры</strong> — числа, которые можно крутить, и
  <strong>данные</strong> — числа, которые крутить нельзя. Обучение состоит в том,
  чтобы подобрать первые под вторые. Чтобы «подобрать» перестало быть делом вкуса,
  нужен судья: одна функция, которая по текущим параметрам выдаёт одно число —
  насколько модель сейчас плоха. Это <strong>функция потерь</strong>.
</p>

<p>
  Возьмём самый маленький пример, какой вообще бывает — обучающую выборку из двух
  объектов. У каждого объекта есть признак <span class="math-inline" data-tex="x_i"></span>
  и правильный ответ <span class="math-inline" data-tex="y_i"></span>:
</p>

<table class="shape-table">
  <tr><th>i — номер объекта</th><th>признак <span class="math-inline" data-tex="x_i"></span></th><th>правильный ответ <span class="math-inline" data-tex="y_i"></span></th></tr>
  <tr><td>1</td><td>1</td><td>2</td></tr>
  <tr><td>2</td><td>2</td><td>3</td></tr>
</table>

<p>
  Всего объектов <span class="math-inline" data-tex="n = 2"></span>. Модель — прямая
  через начало координат с единственным параметром <code>w</code>; её предсказание на
  <span class="math-inline" data-tex="i"></span>-м объекте обозначим
  <span class="math-inline" data-tex="\hat{y}_i"></span>:
</p>

<div class="math-display" data-tex="\hat{y} = w \cdot x"></div>

<p>
  Ошибку на одном объекте меряем квадратом промаха
  <span class="math-inline" data-tex="\bigl(y_i - \hat{y}_i\bigr)^2"></span>, а по
  выборке усредняем — это квадратичная функция потерь, она же MSE. Распишем её по
  всем индексам, шаг за шагом. Сначала общий вид:
</p>

<div class="math-display" data-tex="L(w) = \frac{1}{n}\sum_{i=1}^{n}\bigl(y_i - \hat{y}_i\bigr)^2 = \frac{1}{n}\sum_{i=1}^{n}\bigl(y_i - w x_i\bigr)^2"></div>

<p>Теперь раскрываем сумму — при <span class="math-inline" data-tex="n = 2"></span> в ней ровно два слагаемых:</p>

<div class="math-display" data-tex="L(w) = \frac{1}{2}\Bigl[\bigl(y_1 - w x_1\bigr)^2 + \bigl(y_2 - w x_2\bigr)^2\Bigr]"></div>

<p>И подставляем числа из таблицы — <span class="math-inline" data-tex="x_1 = 1,\ y_1 = 2,\ x_2 = 2,\ y_2 = 3"></span>:</p>

<div class="math-display" data-tex="L(w) = \frac{1}{2}\Bigl[(2 - w\cdot 1)^2 + (3 - w\cdot 2)^2\Bigr] = \frac{1}{2}\bigl[5w^2 - 16w + 13\bigr] = 2.5\,w^2 - 8w + 6.5"></div>

<p>
  Обратите внимание, что произошло: данные <em>исчезли</em> внутрь формулы. Осталась
  функция от одной переменной <code>w</code> — обычная парабола. Обучение модели
  превратилось в школьную задачу «найдите точку минимума».
</p>

<p>Посмотрим пошагово, как из двух точек получается эта парабола.</p>

<div class="stage" id="stageData" tabindex="0">
  <div class="stage-figure">
<svg id="ds" viewBox="0 0 960 570" role="img" aria-label="Слева данные и прямые с разным наклоном, справа график функции потерь как параболы">
  <style>
    #ds { font-family: Helvetica, Arial, sans-serif; }
    #ds .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #ds .grid { stroke: #E5E1D8; stroke-width: 1; }
    #ds .ttl  { font-size: 15px; fill: #111111; font-weight: 700; }
    #ds .cap  { font-size: 13px; fill: #5E5850; }
    #ds .tick { font-size: 13px; fill: #8A8378; }
    #ds .pt   { fill: #3576C0; }
    #ds .ln   { stroke: #3576C0; stroke-width: 2.2; fill: none; }
    #ds .lnd  { stroke: #9FBEE0; stroke-width: 2; fill: none; stroke-dasharray: 5 4; }
    #ds .er   { stroke: #C30B0A; stroke-width: 2.4; }
    #ds .erl  { font-size: 13px; fill: #C30B0A; }
    #ds .cv   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #ds .dot  { fill: #C29E08; }
    #ds .gdot { fill: #73B222; }
    #ds .val  { font-size: 14px; fill: #111111; }
    #ds .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #ds .legend { font-size: 13px; fill: #8A8378; }
  </style>

  <text x="70" y="40" class="ttl">Данные и прямая ŷ = w·x</text>
  <text x="560" y="40" class="ttl">Та же ошибка как функция одного числа w</text>

  <line x1="70" y1="340" x2="382" y2="340" class="ax"/>
  <line x1="70" y1="340" x2="70" y2="62" class="ax"/>
  <text x="388" y="345" class="tick">x</text>
  <text x="60" y="58" class="tick">y</text>
  <text x="185" y="358" class="tick" text-anchor="middle">1</text>
  <text x="300" y="358" class="tick" text-anchor="middle">2</text>
  <text x="62" y="270" class="tick" text-anchor="end">1</text>
  <text x="62" y="195" class="tick" text-anchor="end">2</text>
  <text x="62" y="120" class="tick" text-anchor="end">3</text>

  <line x1="550" y1="340" x2="934" y2="340" class="ax"/>
  <line x1="596" y1="340" x2="596" y2="62" class="ax"/>
  <text x="940" y="345" class="tick">w</text>
  <text x="590" y="58" class="tick" text-anchor="end">L</text>
  <text x="686" y="358" class="tick" text-anchor="middle">1</text>
  <text x="776" y="358" class="tick" text-anchor="middle">2</text>
  <text x="866" y="358" class="tick" text-anchor="middle">3</text>
  <text x="590" y="294" class="tick" text-anchor="end">2</text>
  <text x="590" y="191" class="tick" text-anchor="end">6</text>
  <text x="590" y="88" class="tick" text-anchor="end">10</text>

  <g data-key="data">
    <circle cx="185" cy="190" r="6" class="pt"/>
    <circle cx="300" cy="115" r="6" class="pt"/>
    <text x="196" y="184" class="cap">(1, 2)</text>
    <text x="311" y="109" class="cap">(2, 3)</text>
  </g>

  <g data-key="line0" data-only="1">
    <line x1="70" y1="340" x2="369" y2="340" class="ln"/>
    <text x="200" y="332" class="cap">w = 0: все предсказания равны нулю</text>
  </g>

  <g data-key="err0" data-only="1">
    <line x1="185" y1="340" x2="185" y2="190" class="er"/>
    <line x1="300" y1="340" x2="300" y2="115" class="er"/>
    <text x="192" y="270" class="erl">2</text>
    <text x="307" y="240" class="erl">3</text>
  </g>

  <g data-key="line08" data-only="1">
    <line x1="70" y1="340" x2="369" y2="184" class="ln"/>
    <line x1="185" y1="280" x2="185" y2="190" class="er"/>
    <line x1="300" y1="220" x2="300" y2="115" class="er"/>
    <text x="192" y="245" class="erl">1.2</text>
    <text x="307" y="175" class="erl">1.4</text>
    <text x="245" y="325" class="cap">w = 0.8</text>
  </g>

  <g data-key="line16" data-only="1">
    <line x1="70" y1="340" x2="329" y2="70" class="ln"/>
    <line x1="185" y1="220" x2="185" y2="190" class="er"/>
    <line x1="300" y1="100" x2="300" y2="115" class="er"/>
    <text x="192" y="215" class="erl">0.4</text>
    <text x="307" y="95" class="erl">−0.2</text>
    <text x="250" y="100" class="cap" text-anchor="end">w = 1.6 — лучшая прямая</text>
  </g>

  <g data-key="curve">
    <polyline class="cv" points="560.0,80.3 569.0,105.4 578.0,129.1 587.0,151.6 596.0,172.9 605.0,192.8 614.0,211.4 623.0,228.8 632.0,244.9 641.0,259.6 650.0,273.1 659.0,285.4 668.0,296.3 677.0,305.9 686.0,314.3 695.0,321.4 704.0,327.1 713.0,331.6 722.0,334.9 731.0,336.8 740.0,337.4 749.0,336.8 758.0,334.9 767.0,331.6 776.0,327.1 785.0,321.4 794.0,314.3 803.0,305.9 812.0,296.3 821.0,285.4 830.0,273.1 839.0,259.6 848.0,244.9 857.0,228.8 866.0,211.4 875.0,192.8 884.0,172.9 893.0,151.6 902.0,129.1 911.0,105.4 920.0,80.3"/>
  </g>

  <g data-key="pt0">
    <circle cx="596" cy="172.9" r="6" class="dot"/>
    <text x="606" y="166" class="val">L(0) = 6.5</text>
  </g>

  <g data-key="pt08">
    <circle cx="668" cy="296.3" r="6" class="dot"/>
    <text x="678" y="290" class="val">L(0.8) = 1.7</text>
  </g>

  <g data-key="pt16">
    <circle cx="740" cy="337.4" r="7" class="gdot"/>
    <text x="752" y="322" class="val">минимум: w = 1.6, L = 0.1</text>
  </g>





  <text x="70" y="554" class="legend">синий — данные и модель · красный — промахи · жёлтый — значение потерь · зелёный — лучшее найденное</text>
  <rect x="40" y="386" width="880" height="140" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="412" class="panel-label">формула этого шага</text>
  <g data-key="fx1" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="(x_1,\,y_1) = (1,\,2), \qquad (x_2,\,y_2) = (2,\,3), \qquad \hat{y}_i = w\,x_i"></div></foreignObject></g>
  <g data-key="fx2" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L(0) = \tfrac{1}{2}\bigl[(y_1 - w x_1)^2 + (y_2 - w x_2)^2\bigr] = \tfrac{1}{2}\bigl[(2 - 0\cdot 1)^2 + (3 - 0\cdot 2)^2\bigr] = 6.5"></div></foreignObject></g>
  <g data-key="fx3" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L(0.8) = \tfrac{1}{2}\bigl[(2 - 0.8\cdot 1)^2 + (3 - 0.8\cdot 2)^2\bigr] = \tfrac{1}{2}\bigl[1.44 + 1.96\bigr] = 1.7"></div></foreignObject></g>
  <g data-key="fx4" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L(w) = \tfrac{1}{n}\sum_{i=1}^{n}\bigl(y_i - w x_i\bigr)^2 \quad \text{— по одному числу на каждое } w"></div></foreignObject></g>
  <g data-key="fx5" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L(w) = \tfrac{1}{2}\bigl[(2-w)^2 + (3-2w)^2\bigr] = \tfrac{1}{2}\bigl[5w^2 - 16w + 13\bigr] = 2.5\,w^2 - 8w + 6.5"></div></foreignObject></g>
  <g data-key="fx6" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="L'(w) = 5w - 8 = 0 \;\Longrightarrow\; w = 1.6"></div></foreignObject></g>
  <g data-key="fx7" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L(1.6) = \tfrac{1}{2}\bigl[(2 - 1.6)^2 + (3 - 3.2)^2\bigr] = \tfrac{1}{2}\bigl[0.16 + 0.04\bigr] = 0.1"></div></foreignObject></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="data fx1" data-focus="fx1">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Две точки — вся обучающая выборка</h4>
      <p>Наблюдения <code>(1, 2)</code> и <code>(2, 3)</code> зафиксированы: их
      нельзя двигать. Всё, что мы можем менять, — наклон прямой, то есть одно
      число <code>w</code>.</p>
    </div>
    <div class="step-panel" data-on="data line0 err0 fx2" data-focus="err0">
      <div class="step-kicker">Шаг 2 · плохой наклон</div>
      <h4>При w = 0 модель предсказывает нули</h4>
      <p>Красные отрезки — промахи: 2 и 3. Возводим их в квадрат и усредняем —
      получаем одно число, которым можно измерить, насколько плоха эта прямая.</p>
      </div>
    <div class="step-panel" data-on="data line08 fx3" data-focus="line08">
      <div class="step-kicker">Шаг 3 · наклон получше</div>
      <h4>При w = 0.8 промахи заметно короче</h4>
      <p>Теперь предсказания 0.8 и 1.6, промахи 1.2 и 1.4. Квадраты: 1.44 и 1.96,
      среднее — 1.7. Прямая стала лучше, и число это подтвердило.</p>
    </div>
    <div class="step-panel" data-on="data line08 curve pt0 pt08 fx4" data-focus="curve">
      <div class="step-kicker">Шаг 4 · перенос на правый график</div>
      <h4>Каждому наклону — своя высота</h4>
      <p>Правый график — не про данные. По горизонтали отложен параметр
      <code>w</code>, по вертикали — значение <code>L</code> при этом
      <code>w</code>. Точки 6.5 и 1.7 — это те же самые два расчёта.</p>
    </div>
    <div class="step-panel" data-on="curve pt0 pt08 fx5" data-focus="fx5">
      <div class="step-kicker">Шаг 5 · раскрываем скобки</div>
      <h4>Данные превратились в коэффициенты</h4>
      <p>После раскрытия скобок от выборки остаются три числа: 2.5, −8 и 6.5.
      Дальше мы работаем не с точками, а с параболой — с обычной функцией одной
      переменной.</p>
    </div>
    <div class="step-panel" data-on="curve pt0 pt08 pt16 data line16 fx6" data-focus="pt16">
      <div class="step-kicker">Шаг 6 · дно параболы</div>
      <h4>Минимум параболы — лучшая прямая</h4>
      <p>Дно достигается при <code>w = 1.6</code>, и это в точности лучший наклон
      для наших двух точек. Слева видно соответствующую прямую: она проходит
      между точками, промахнувшись на 0.4 и −0.2.</p>
    </div>
    <div class="step-panel" data-on="curve pt16 data line16 fx7" data-focus="line16">
      <div class="step-kicker">Шаг 7 · честный остаток</div>
      <h4>Минимум не равен нулю — и это нормально</h4>
      <p>Значение в минимуме <code>L = 0.1</code>, а не 0: прямая через начало
      координат физически не может пройти через обе точки. Функция потерь меряет не
      «правильно или нет», а «насколько близко из того, что модель вообще умеет».</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### А если объектов не два, а много?

<p>
  Меняется ровно одно место — количество слагаемых под знаком суммы. При
  <span class="math-inline" data-tex="n"></span> объектах функция потерь выглядит так:
</p>

<div class="math-display" data-tex="L(w) = \frac{1}{n}\Bigl[\bigl(y_1 - w x_1\bigr)^2 + \bigl(y_2 - w x_2\bigr)^2 + \dots + \bigl(y_n - w x_n\bigr)^2\Bigr]"></div>

<p>
  После раскрытия скобок каждое слагаемое даёт вклад в три коэффициента, и они
  складываются в те же три числа, что и у нас:
</p>

<div class="math-display" data-tex="L(w) = \underbrace{\Bigl(\tfrac{1}{n}\sum_i x_i^2\Bigr)}_{A}\,w^2 \;-\; \underbrace{\Bigl(\tfrac{2}{n}\sum_i x_i y_i\Bigr)}_{B}\,w \;+\; \underbrace{\Bigl(\tfrac{1}{n}\sum_i y_i^2\Bigr)}_{C}"></div>

<p>
  Проверим на наших двух точках:
  <span class="math-inline" data-tex="A = \tfrac{1}{2}(1 + 4) = 2.5"></span>,
  <span class="math-inline" data-tex="B = \tfrac{2}{2}(1\cdot 2 + 2\cdot 3) = 8"></span>,
  <span class="math-inline" data-tex="C = \tfrac{1}{2}(4 + 9) = 6.5"></span> — ровно те
  коэффициенты, что и в сцене. Миллион объектов не усложняет картинку: это по-прежнему
  парабола от одного числа <code>w</code>, просто её коэффициенты собраны из миллиона
  слагаемых. Дорожает не форма функции, а один её подсчёт.
</p>

<p>
  Для параболы минимум находится в одну строчку: производная
  <code>L'(w) = 5w − 8</code> обнуляется при <code>w = 1.6</code>. Возникает
  законный вопрос: зачем тогда нужен какой-то спуск?
</p>

<div class="callout-red">
  <strong>Где ломается точный метод:</strong> он требует <em>решить</em> уравнение
  <span class="math-inline" data-tex="\nabla L = 0"></span>. Для параболы это линейное
  уравнение. Для нейросети это система из миллионов нелинейных уравнений с
  сигмоидами и максимумами внутри — у неё нет общего способа решения. Даже
  безобидный многочлен от двух переменных даёт систему, которую проще посчитать
  численно, чем решить.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обучение — это минимизация одной функции,
  у которой аргументы не данные, а параметры модели. Данные лишь задают форму
  этой функции и дальше в оптимизации не участвуют.
</div>

---

## Часть 2. Производная: наклон и касательная

<p>
  Спускаться придётся вслепую: мы не видим весь график, у нас есть только текущая
  точка. Единственное, что можно измерить в точке, — <strong>наклон</strong>. Чтобы
  измерить наклон, нужна вторая точка рядом, и вот тут появляются два ключевых слова:
  приращение аргумента и приращение функции.
</p>

<p>
  Прежде чем считать, договоримся о словах. Сдвинем аргумент из точки
  <code>w</code> на маленькую величину <span class="math-inline" data-tex="\Delta w"></span> —
  это <strong>приращение аргумента</strong>. Функция на это ответит своим сдвигом
  <span class="math-inline" data-tex="\Delta L = L(w + \Delta w) - L(w)"></span> —
  это <strong>приращение функции</strong>. Два приращения образуют прямоугольный
  треугольник, гипотенуза которого — <strong>секущая</strong>, прямая через две точки
  графика:
</p>

<div class="math-display" data-tex="\text{наклон секущей} \;=\; \frac{\Delta L}{\Delta w} \;=\; \frac{L(w + \Delta w) - L(w)}{\Delta w}"></div>

<p>
  Это средняя скорость изменения на отрезке. Чтобы получить скорость <em>именно в
  точке</em>, отрезок нужно стянуть в точку: устремить
  <span class="math-inline" data-tex="\Delta w"></span> к нулю. Предел этого отношения
  и есть <strong>производная</strong>, а предельное положение секущей —
  <strong>касательная</strong>.
</p>

<div class="stage" id="stageDiff" tabindex="0">
  <div class="stage-figure">
<svg id="dv" viewBox="0 0 960 570" role="img" aria-label="Приращение аргумента, приращение функции, секущая и переход к касательной">
  <style>
    #dv { font-family: Helvetica, Arial, sans-serif; }
    #dv .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #dv .ttl  { font-size: 15px; fill: #111111; font-weight: 700; }
    #dv .tick { font-size: 13px; fill: #8A8378; }
    #dv .cv   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #dv .dot  { fill: #3576C0; }
    #dv .dotb { fill: #244F81; }
    #dv .leg  { stroke: #3576C0; stroke-width: 2; stroke-dasharray: 6 4; fill: none; }
    #dv .sec  { stroke: #5E5850; stroke-width: 2; fill: none; }
    #dv .sec2 { stroke: #B9B4A9; stroke-width: 1.6; fill: none; }
    #dv .tan  { stroke: #C30B0A; stroke-width: 2.8; fill: none; }
    #dv .bl   { font-size: 13px; fill: #244F81; }
    #dv .gl   { font-size: 13px; fill: #5E5850; }
    #dv .rl   { font-size: 14px; fill: #C30B0A; }
    #dv .pan  { fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.4; }
    #dv .th   { font-size: 13px; fill: #244F81; font-weight: 700; }
    #dv .td   { font-size: 14px; fill: #111111; }
    #dv .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #dv .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="dv-ab" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
  </defs>

  <text x="40" y="36" class="ttl">Приращения, секущая и предельный переход к касательной</text>

  <line x1="100" y1="350" x2="546" y2="350" class="ax"/>
  <line x1="109.2" y1="350" x2="109.2" y2="70" class="ax"/>
  <text x="552" y="355" class="tick">w</text>
  <text x="103" y="66" class="tick" text-anchor="end">L</text>
  <text x="294.2" y="368" class="tick" text-anchor="middle">1</text>
  <text x="479.3" y="368" class="tick" text-anchor="middle">2</text>

  <polyline class="cv" points="100.0,87.6 109.2,103.0 118.5,118.0 127.8,132.5 137.0,146.5 146.2,160.0 155.5,173.1 164.8,185.7 174.0,197.8 183.2,209.4 192.5,220.6 201.8,231.2 211.0,241.5 220.2,251.2 229.5,260.5 238.8,269.2 248.0,277.6 257.2,285.4 266.5,292.8 275.8,299.7 285.0,306.1 294.2,312.0 303.5,317.5 312.8,322.4 322.0,327.0 331.2,331.0 340.5,334.6 349.8,337.6 359.0,340.3 368.3,342.4 377.5,344.1 386.8,345.2 396.0,346.0 405.2,346.2 414.5,346.0 423.8,345.2 433.0,344.1 442.2,342.4 451.5,340.3 460.8,337.7 470.0,334.6 479.3,331.0 488.5,327.0 497.8,322.4 507.0,317.5 516.2,312.0"/>

  <g data-key="pa">
    <circle cx="109.2" cy="103" r="6" class="dotb"/>
    <text x="118" y="96" class="bl">A = (0,  6.5)</text>
  </g>

  <g data-key="dw">
    <line x1="109.2" y1="103" x2="288" y2="103" class="leg" marker-end="url(#dv-ab)"/>
    <text x="200" y="92" class="bl" text-anchor="middle">Δw = 1</text>
  </g>

  <g data-key="dl">
    <line x1="294.2" y1="103" x2="294.2" y2="306" class="leg" marker-end="url(#dv-ab)"/>
    <circle cx="294.2" cy="312" r="6" class="dot"/>
    <text x="302" y="210" class="bl">ΔL = 1.0 − 6.5 = −5.5</text>
    <text x="302" y="322" class="bl">B = (1,  1.0)</text>
  </g>

  <g data-key="sec" data-only="1">
    <line x1="100" y1="92.6" x2="330" y2="352.4" class="sec"/>
    <text x="150" y="250" class="gl">секущая: наклон −5.5</text>
  </g>

  <g data-key="small" data-only="1">
    <line x1="109.2" y1="103" x2="215" y2="248" class="sec2"/>
    <line x1="109.2" y1="103" x2="160" y2="180" class="sec2"/>
    <line x1="109.2" y1="103" x2="140" y2="148" class="sec2"/>
    <circle cx="201.8" cy="231.2" r="5" class="dot"/>
    <circle cx="146.2" cy="160" r="5" class="dot"/>
    <circle cx="127.8" cy="132.5" r="5" class="dot"/>
    <text x="212" y="226" class="bl">Δw = 0.5</text>
    <text x="158" y="156" class="bl">0.2</text>
    <text x="140" y="128" class="bl">0.1</text>
  </g>

  <g data-key="tan" data-only="1">
    <line x1="100" y1="87.8" x2="253.6" y2="340.1" class="tan"/>
    <text x="180" y="330" class="rl">касательная: наклон −8</text>
  </g>

  <g data-key="tbl">
    <rect x="600" y="86" width="340" height="240" rx="10" class="pan"/>
    <text x="624" y="116" class="th">Δw</text>
    <text x="916" y="116" class="th" text-anchor="end">ΔL / Δw</text>
    <line x1="616" y1="128" x2="924" y2="128" class="ax"/>
  </g>

  <g data-key="row1" data-only="1">
    <text x="624" y="158" class="td">1.0</text>
    <text x="916" y="158" class="td" text-anchor="end">−5.50</text>
  </g>

  <g data-key="rows" data-only="1">
    <text x="624" y="192" class="td">0.5</text>
    <text x="916" y="192" class="td" text-anchor="end">−6.75</text>
    <text x="624" y="226" class="td">0.2</text>
    <text x="916" y="226" class="td" text-anchor="end">−7.50</text>
    <text x="624" y="260" class="td">0.1</text>
    <text x="916" y="260" class="td" text-anchor="end">−7.75</text>
  </g>

  <g data-key="rowlim" data-only="1">
    <text x="624" y="298" class="rl">→ 0</text>
    <text x="916" y="298" class="rl" text-anchor="end">−8.00</text>
  </g>

  <rect x="40" y="386" width="880" height="140" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="412" class="panel-label">формула этого шага</text>
  <g data-key="dv1" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="\Delta w = 1: \quad w = 0 \;\longrightarrow\; w + \Delta w = 1"></div></foreignObject></g>
  <g data-key="dv2" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\Delta L = L(w + \Delta w) - L(w) = L(1) - L(0) = 1.0 - 6.5 = -5.5"></div></foreignObject></g>
  <g data-key="dv3" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\Delta L}{\Delta w} = \frac{L(w + \Delta w) - L(w)}{\Delta w} = \frac{-5.5}{1} = -5.5"></div></foreignObject></g>
  <g data-key="dv4" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{3.125 - 6.5}{0.5} = -6.75, \qquad \frac{5.0 - 6.5}{0.2} = -7.5, \qquad \frac{5.725 - 6.5}{0.1} = -7.75"></div></foreignObject></g>
  <g data-key="dv5" data-only="1"><foreignObject x="62" y="420" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L'(0) = \lim_{\Delta w \to 0}\frac{L(0 + \Delta w) - L(0)}{\Delta w} = -8"></div></foreignObject></g>
  <g data-key="dv6" data-only="1"><foreignObject x="62" y="426" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L(0 + \Delta w) \approx L(0) + L'(0)\,\Delta w = 6.5 - 8\,\Delta w"></div></foreignObject></g>

  <text x="40" y="554" class="legend">жёлтый — функция · синий — приращения и пробные точки · серый — секущая · красный — касательная и производная</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="pa dw dv1" data-focus="dw">
      <div class="step-kicker">Шаг 1 · приращение аргумента</div>
      <h4>Δw — насколько мы сдвинули параметр</h4>
      <p>Стоим в точке <code>A</code> при <code>w = 0</code>, где <code>L = 6.5</code>,
      и делаем пробный сдвиг вправо на <code>Δw = 1</code>. Это горизонтальный катет:
      сама функция здесь ещё не участвует, мы только выбрали, куда посмотреть.</p>
    </div>
    <div class="step-panel" data-on="pa dw dl dv2" data-focus="dl">
      <div class="step-kicker">Шаг 2 · приращение функции</div>
      <h4>ΔL — как на этот сдвиг ответила функция</h4>
      <p>В точке <code>w = 1</code> потери равны
      <code>2.5·1 − 8·1 + 6.5 = 1.0</code>, значит
      <code>ΔL = 1.0 − 6.5 = −5.5</code>. Знак минус — функция упала. Это
      вертикальный катет треугольника.</p>
    </div>
    <div class="step-panel" data-on="pa dw dl sec tbl row1 dv3" data-focus="sec">
      <div class="step-kicker">Шаг 3 · отношение</div>
      <h4>ΔL / Δw — наклон секущей</h4>
      <p><code>−5.5 / 1 = −5.5</code>: в среднем на этом отрезке функция падает на
      5.5 единицы за единицу <code>w</code>. Гипотенуза треугольника — секущая,
      прямая через точки <code>A</code> и <code>B</code>. Проблема в слове
      «в среднем»: у левого края склон круче, у правого положе.</p>
    </div>
    <div class="step-panel" data-on="pa small sec tbl row1 rows dv4" data-focus="small">
      <div class="step-kicker">Шаг 4 · стягиваем отрезок</div>
      <h4>Чем меньше Δw, тем честнее ответ</h4>
      <p>Берём <code>Δw = 0.5</code>: <code>(3.125 − 6.5)/0.5 = −6.75</code>. Затем
      <code>0.2</code> даёт <code>−7.5</code>, а <code>0.1</code> — <code>−7.75</code>.
      Секущие поворачиваются и всё плотнее прижимаются к одной прямой.</p>
    </div>
    <div class="step-panel" data-on="pa tan tbl row1 rows rowlim dv5" data-focus="tan">
      <div class="step-kicker">Шаг 5 · предел</div>
      <h4>Число −8 и есть производная в точке</h4>
      <p>Последовательность −5.5, −6.75, −7.5, −7.75 упирается в −8. Это значение
      называют производной <span class="math-inline" data-tex="L'(0)"></span>, а
      предельное положение секущей — касательной. Проверка по правилам:
      <code>L′(w) = 5w − 8</code>, при <code>w = 0</code> получаем −8.</p>
    </div>
    <div class="step-panel" data-on="pa tan dv6" data-focus="dv6">
      <div class="step-kicker">Шаг 6 · зачем это нужно спуску</div>
      <h4>Касательная — локальный прогноз</h4>
      <p>Рядом с точкой функция почти совпадает со своей касательной:
      <code>L(Δw) ≈ 6.5 − 8·Δw</code>. Именно этим приближением пользуется
      градиентный спуск, когда решает, куда и насколько шагнуть — а слово «рядом»
      объясняет, почему шаг должен быть небольшим.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Из определения сразу следует главное для нас правило. Знак производной говорит,
  куда функция растёт. Если <span class="math-inline" data-tex="L'(w) &lt; 0"></span>,
  функция убывает вправо, и уменьшить её можно, увеличив <code>w</code>. Если
  <span class="math-inline" data-tex="L'(w) &gt; 0"></span> — наоборот. Значит,
  <em>шагать надо против знака производной</em>.
</p>

<div class="stage" id="stageTangent" tabindex="0">
  <div class="stage-figure">
<svg id="tg" viewBox="0 0 960 620" role="img" aria-label="Парабола потерь с секущей и касательными в точках w=0, w=1.6 и w=2.5">
  <style>
    #tg { font-family: Helvetica, Arial, sans-serif; }
    #tg .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #tg .ttl  { font-size: 15px; fill: #111111; font-weight: 700; }
    #tg .cap  { font-size: 13px; fill: #5E5850; }
    #tg .tick { font-size: 13px; fill: #8A8378; }
    #tg .cv   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #tg .dot  { fill: #3576C0; }
    #tg .gdot { fill: #73B222; }
    #tg .sec  { stroke: #8A8378; stroke-width: 2; stroke-dasharray: 6 4; fill: none; }
    #tg .tan  { stroke: #C30B0A; stroke-width: 2.6; fill: none; }
    #tg .lab  { font-size: 14px; fill: #C30B0A; }
    #tg .val  { font-size: 14px; fill: #111111; }
    #tg .arw  { stroke: #73B222; stroke-width: 2.6; fill: none; }
    #tg .arwl { font-size: 13px; fill: #5A8C1C; }
    #tg .pan  { fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.4; }
    #tg .th   { font-size: 13px; fill: #244F81; font-weight: 700; }
    #tg .td   { font-size: 14px; fill: #111111; }
    #tg .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #tg .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="tg-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
  </defs>

  <text x="70" y="38" class="ttl">Парабола потерь L(w) = 2.5w² − 8w + 6.5 и наклон в трёх точках</text>

  <line x1="70" y1="360" x2="636" y2="360" class="ax"/>
  <line x1="113.4" y1="360" x2="113.4" y2="66" class="ax"/>
  <text x="642" y="365" class="tick">w</text>
  <text x="108" y="62" class="tick" text-anchor="end">L</text>
  <text x="258.2" y="378" class="tick" text-anchor="middle">1</text>
  <text x="402.9" y="378" class="tick" text-anchor="middle">2</text>
  <text x="547.6" y="378" class="tick" text-anchor="middle">3</text>
  <text x="107" y="245" class="tick" text-anchor="end">4</text>
  <text x="107" y="185" class="tick" text-anchor="end">6</text>
  <text x="107" y="125" class="tick" text-anchor="end">8</text>

  <g data-key="curve">
    <polyline class="cv" points="70.0,86.2 77.2,100.3 84.5,114.0 91.7,127.3 98.9,140.2 106.2,152.8 113.4,165.0 120.7,176.8 127.9,188.2 135.1,199.3 142.4,210.0 149.6,220.3 156.8,230.2 164.1,239.8 171.3,249.0 178.6,257.8 185.8,266.2 193.0,274.3 200.3,282.0 207.5,289.3 214.7,296.2 222.0,302.8 229.2,309.0 236.4,314.8 243.7,320.2 250.9,325.3 258.2,330.0 265.4,334.3 272.6,338.2 279.9,341.8 287.1,345.0 294.3,347.8 301.6,350.2 308.8,352.3 316.1,354.0 323.3,355.3 330.5,356.2 337.8,356.8 345.0,357.0 352.2,356.8 359.5,356.2 366.7,355.3 373.9,354.0 381.2,352.3 388.4,350.2 395.7,347.8 402.9,345.0 410.1,341.8 417.4,338.2 424.6,334.3 431.8,330.0 439.1,325.3 446.3,320.2 453.6,314.8 460.8,309.0 468.0,302.8 475.3,296.3 482.5,289.3 489.7,282.0 497.0,274.3 504.2,266.3 511.4,257.8 518.7,249.0 525.9,239.8 533.2,230.3 540.4,220.3 547.6,210.0 554.9,199.3 562.1,188.3 569.3,176.8 576.6,165.0 583.8,152.8 591.1,140.3 598.3,127.3 605.5,114.0 612.8,100.3 620.0,86.3"/>
  </g>

  <g data-key="p0">
    <circle cx="113.4" cy="165" r="6" class="dot"/>
    <text x="122" y="158" class="val">мы здесь: w = 0</text>
  </g>

  <g data-key="sec" data-only="1">
    <line x1="84.5" y1="132" x2="279.9" y2="354.8" class="sec"/>
    <circle cx="258.2" cy="330" r="5" class="dot"/>
    <text x="266" y="324" class="cap">вторая точка: w = 1</text>
    <text x="150" y="235" class="cap">секущая, наклон −5.5</text>
  </g>

  <g data-key="tan0">
    <line x1="77.2" y1="105" x2="226.3" y2="352.2" class="tan"/>
    <text x="130" y="108" class="lab">касательная, наклон −8</text>
  </g>

  <g data-key="dir" data-only="1">
    <line x1="118" y1="400" x2="205" y2="400" class="arw" marker-end="url(#tg-ag)"/>
    <text x="212" y="405" class="arwl">производная отрицательная — двигаем w вправо</text>
  </g>

  <g data-key="p25">
    <circle cx="475.3" cy="296.2" r="6" class="dot"/>
    <text x="484" y="290" class="val">w = 2.5</text>
  </g>

  <g data-key="tan25">
    <line x1="410.1" y1="357" x2="547.6" y2="228.8" class="tan"/>
    <text x="512" y="222" class="lab" text-anchor="middle">наклон +4.5</text>
  </g>

  <g data-key="dir2" data-only="1">
    <line x1="470" y1="400" x2="383" y2="400" class="arw" marker-end="url(#tg-ag)"/>
    <text x="376" y="405" class="arwl" text-anchor="end">производная положительная — двигаем w влево</text>
  </g>

  <g data-key="p16">
    <circle cx="345" cy="357" r="7" class="gdot"/>
    <line x1="258.2" y1="357" x2="439.1" y2="357" class="tan"/>
    <text x="345" y="336" class="lab" text-anchor="middle">наклон 0 — дно</text>
  </g>





  <g data-key="frm">
    <foreignObject x="655" y="52" width="290" height="44">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md svg-math-center" data-tex="L'(w) = 5w - 8"></div>
    </foreignObject>
  </g>

  <g data-key="tbl">
    <rect x="650" y="110" width="290" height="200" rx="10" class="pan"/>
    <text x="672" y="136" class="th">w</text>
    <text x="762" y="136" class="th" text-anchor="end">L′(w)</text>
    <text x="790" y="136" class="th">куда шагать</text>
    <line x1="662" y1="148" x2="928" y2="148" class="ax"/>
    <text x="672" y="176" class="td">0</text>
    <text x="762" y="176" class="td" text-anchor="end">−8.0</text>
    <text x="790" y="176" class="td">вправо</text>
    <text x="672" y="212" class="td">1.0</text>
    <text x="762" y="212" class="td" text-anchor="end">−3.0</text>
    <text x="790" y="212" class="td">вправо</text>
    <text x="672" y="248" class="td">1.6</text>
    <text x="762" y="248" class="td" text-anchor="end">0.0</text>
    <text x="790" y="248" class="td">никуда</text>
    <text x="672" y="284" class="td">2.5</text>
    <text x="762" y="284" class="td" text-anchor="end">+4.5</text>
    <text x="790" y="284" class="td">влево</text>
  </g>

  <text x="70" y="604" class="legend">жёлтый — функция потерь · красный — производная и касательная · зелёный — направление спуска</text>
  <rect x="40" y="430" width="880" height="140" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="456" class="panel-label">формула этого шага</text>
  <g data-key="tf1" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L(w) = 2.5\,w^2 - 8w + 6.5, \qquad \text{стоим в } w = 0, \quad L(0) = 6.5"></div></foreignObject></g>
  <g data-key="tf2" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{L(1) - L(0)}{1 - 0} = \frac{1.0 - 6.5}{1} = -5.5 \quad \text{— наклон секущей}"></div></foreignObject></g>
  <g data-key="tf3" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L'(0) = \lim_{\Delta w \to 0}\frac{L(0 + \Delta w) - L(0)}{\Delta w} = 5\cdot 0 - 8 = -8"></div></foreignObject></g>
  <g data-key="tf4" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L'(0) = -8 &lt; 0 \;\Longrightarrow\; \text{функция убывает вправо} \;\Longrightarrow\; w \text{ увеличиваем}"></div></foreignObject></g>
  <g data-key="tf5" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L'(2.5) = 5\cdot 2.5 - 8 = +4.5 &gt; 0 \;\Longrightarrow\; w \text{ уменьшаем}"></div></foreignObject></g>
  <g data-key="tf6" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L'(1.6) = 5\cdot 1.6 - 8 = 0 \quad \text{— касательная горизонтальна, шагать некуда}"></div></foreignObject></g>
  <g data-key="tf7" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L'(w) = 5w - 8 \quad \text{— одна формула отвечает в любой точке}"></div></foreignObject></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="curve p0 tf1" data-focus="p0">
      <div class="step-kicker">Шаг 1 · вслепую</div>
      <h4>Мы стоим в точке w = 0 и не видим графика</h4>
      <p>Вся картинка нарисована для нас, читателей. Алгоритм её не видит: он умеет
      только вычислять <code>L</code> в конкретной точке и брать производную. Вопрос
      на этом шаге ровно один — увеличивать <code>w</code> или уменьшать.</p>
    </div>
    <div class="step-panel" data-on="curve p0 sec tf2" data-focus="sec">
      <div class="step-kicker">Шаг 2 · секущая</div>
      <h4>Средний наклон между двумя точками</h4>
      <p>Возьмём вторую точку при <code>w = 1</code>: там <code>L = 1.0</code>.
      Наклон отрезка равен <span class="math-inline" data-tex="(1.0 - 6.5)/1 = -5.5"></span>.
      Число уже отвечает на вопрос «вниз или вверх», но описывает весь отрезок, а не
      нашу точку.</p>
    </div>
    <div class="step-panel" data-on="curve p0 sec tan0 tf3" data-focus="tan0">
      <div class="step-kicker">Шаг 3 · предел</div>
      <h4>Сдвигаем вторую точку вплотную — получаем касательную</h4>
      <p>Чем меньше <span class="math-inline" data-tex="\Delta w"></span>, тем ближе
      секущая к касательной. В пределе наклон равен −8: это и есть производная в
      точке <code>w = 0</code>. Проверка по формуле: <code>5·0 − 8 = −8</code>.</p>
    </div>
    <div class="step-panel" data-on="curve p0 tan0 dir tf4" data-focus="dir">
      <div class="step-kicker">Шаг 4 · знак</div>
      <h4>Минус означает «вниз направо»</h4>
      <p>Отрицательная производная — функция убывает при увеличении аргумента.
      Значит, чтобы уменьшить потери, надо двигать <code>w</code> в
      <em>положительную</em> сторону. Направление спуска противоположно знаку
      производной.</p>
    </div>
    <div class="step-panel" data-on="curve p25 tan25 dir2 tf5" data-focus="tan25">
      <div class="step-kicker">Шаг 5 · симметричный случай</div>
      <h4>Справа от минимума наклон положительный</h4>
      <p>В точке <code>w = 2.5</code> производная равна <code>5·2.5 − 8 = +4.5</code>:
      функция растёт вправо. Правило то же — идём против знака, то есть влево. Одно
      правило покрывает оба случая.</p>
    </div>
    <div class="step-panel" data-on="curve p16 tf6" data-focus="p16">
      <div class="step-kicker">Шаг 6 · ноль</div>
      <h4>В минимуме касательная горизонтальна</h4>
      <p>Производная в дне равна нулю, и правило «иди против знака» само собой
      выключается: шагать некуда. Спуск не нужно останавливать вручную — он
      затухает, когда наклон исчезает.</p>
    </div>
    <div class="step-panel" data-on="curve p0 p16 p25 frm tbl tf7" data-focus="tbl">
      <div class="step-kicker">Шаг 7 · вся информация в одной формуле</div>
      <h4>L′(w) = 5w − 8 отвечает в любой точке</h4>
      <p>Производную считают не по определению каждый раз, а по правилам
      дифференцирования. Одна формула сразу даёт и направление (знак), и крутизну
      (модуль) — оба числа понадобятся в следующей части.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Мини-таблица производных, которой хватает на всё обучение

<p>
  Производные в машинном обучении почти никогда не считают по определению: берут
  готовые формулы для базовых функций и три правила, которые собирают из них
  сложные выражения.
</p>

<table class="shape-table">
  <tr><th>Функция</th><th>Производная</th><th>Где встречается</th></tr>
  <tr><td><span class="math-inline" data-tex="c"></span></td><td><span class="math-inline" data-tex="0"></span></td><td>свободные слагаемые в потерях</td></tr>
  <tr><td><span class="math-inline" data-tex="w^{n}"></span></td><td><span class="math-inline" data-tex="n\,w^{\,n-1}"></span></td><td>квадратичная ошибка: <span class="math-inline" data-tex="(w^2)' = 2w"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="e^{w}"></span></td><td><span class="math-inline" data-tex="e^{w}"></span></td><td>сигмоида, softmax</td></tr>
  <tr><td><span class="math-inline" data-tex="\ln w"></span></td><td><span class="math-inline" data-tex="1/w"></span></td><td>логистическая функция потерь</td></tr>
  <tr><td><span class="math-inline" data-tex="\sigma(z) = \dfrac{1}{1+e^{-z}}"></span></td><td><span class="math-inline" data-tex="\sigma(z)\bigl(1-\sigma(z)\bigr)"></span></td><td>активация нейрона</td></tr>
  <tr><td><span class="math-inline" data-tex="\tanh z"></span></td><td><span class="math-inline" data-tex="1 - \tanh^2 z"></span></td><td>активация в рекуррентных сетях</td></tr>
  <tr><td><span class="math-inline" data-tex="\max(0, z)"></span></td><td><span class="math-inline" data-tex="1"></span> при <span class="math-inline" data-tex="z&gt;0"></span>, иначе <span class="math-inline" data-tex="0"></span></td><td>ReLU</td></tr>
</table>

<p>И три правила, которыми это склеивается:</p>

<div class="math-display" data-tex="(u+v)' = u' + v', \qquad (uv)' = u'v + uv', \qquad \bigl(u(v)\bigr)' = u'(v)\cdot v'"></div>

<div class="callout-blue">
  <strong>Третье правило — самое важное.</strong> Правило дифференцирования сложной
  функции (цепное правило) — единственный инструмент, из которого сделан бэкпроп.
  Производная композиции равна произведению производных по цепочке; в сети такой
  цепочкой становится путь от ошибки до конкретного веса.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> производная — это компас, который работает
  в темноте. Её знак задаёт направление шага, а модуль — насколько круто здесь
  падает функция.
</div>

---

## Часть 3. Шаг спуска и скорость обучения

<p>
  Направление есть — осталось решить, насколько далеко идти. Естественная идея:
  сделать длину шага пропорциональной крутизне. Там, где склон крутой, можно
  шагать смело; у самого дна — осторожно. Умножим производную на маленькое
  положительное число и вычтем результат:
</p>

<div class="math-display" data-tex="w_{\text{new}} = w_{\text{old}} - \eta \cdot L'(w_{\text{old}})"></div>

<p>
  Множитель <span class="math-inline" data-tex="\eta"></span> называется
  <strong>скоростью обучения</strong> (learning rate). Минус в формуле — это и есть
  «идти против знака производной»: при отрицательной производной мы вычитаем
  отрицательное число, то есть <code>w</code> растёт.
</p>

<p>
  Возьмём <span class="math-inline" data-tex="\eta = 0.1"></span> и стартовую точку
  <code>w = 0</code>. Дальше — только арифметика, но посмотрим на неё пошагово,
  чтобы увидеть, что происходит с длиной шага.
</p>

<div class="stage" id="stageRate" tabindex="0">
  <div class="stage-figure">
<svg id="lr" viewBox="0 0 960 620" role="img" aria-label="Траектория градиентного спуска по параболе при разных значениях скорости обучения">
  <style>
    #lr { font-family: Helvetica, Arial, sans-serif; }
    #lr .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #lr .ttl  { font-size: 15px; fill: #111111; font-weight: 700; }
    #lr .cap  { font-size: 13px; fill: #5E5850; }
    #lr .tick { font-size: 13px; fill: #8A8378; }
    #lr .cv   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #lr .drop { stroke: #B9C9DA; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #lr .gdot { fill: #73B222; }
    #lr .ydot { fill: #C29E08; }
    #lr .bdot { fill: #3576C0; }
    #lr .mv   { stroke: #73B222; stroke-width: 2.6; fill: none; }
    #lr .zg   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #lr .bad  { stroke: #C30B0A; stroke-width: 2.8; fill: none; }
    #lr .gl   { font-size: 14px; fill: #5A8C1C; }
    #lr .yl   { font-size: 14px; fill: #8C7106; }
    #lr .rl   { font-size: 14px; fill: #C30B0A; }
    #lr .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #lr .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="lr-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="lr-ay" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="lr-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text x="70" y="36" class="ttl">Спуск по параболе потерь: одна формула шага, четыре скорости обучения</text>

  <line x1="80" y1="350" x2="846" y2="350" class="ax"/>
  <line x1="168.1" y1="350" x2="168.1" y2="56" class="ax"/>
  <text x="852" y="355" class="tick">w</text>
  <text x="162" y="52" class="tick" text-anchor="end">L</text>
  <text x="344.3" y="368" class="tick" text-anchor="middle">1</text>
  <text x="520.5" y="368" class="tick" text-anchor="middle">2</text>
  <text x="696.7" y="368" class="tick" text-anchor="middle">3</text>
  <text x="162" y="240" class="tick" text-anchor="end">4</text>
  <text x="162" y="134" class="tick" text-anchor="end">8</text>

  <polyline class="cv" points="80.0,42.9 88.8,57.3 97.6,71.2 106.4,84.9 115.2,98.1 124.0,111.1 132.9,123.7 141.7,135.9 150.5,147.8 159.3,159.4 168.1,170.6 176.9,181.5 185.7,192.0 194.5,202.2 203.3,212.0 212.1,221.5 221.0,230.6 229.8,239.4 238.6,247.9 247.4,256.0 256.2,263.7 265.0,271.2 273.8,278.2 282.6,285.0 291.4,291.3 300.2,297.4 309.1,303.1 317.9,308.4 326.7,313.4 335.5,318.1 344.3,322.4 353.1,326.4 361.9,330.0 370.7,333.3 379.5,336.2 388.3,338.8 397.2,341.0 406.0,342.9 414.8,344.5 423.6,345.7 432.4,346.5 441.2,347.1 450.0,347.2 458.8,347.1 467.6,346.6 476.4,345.7 485.3,344.5 494.1,342.9 502.9,341.0 511.7,338.8 520.5,336.2 529.3,333.3 538.1,330.0 546.9,326.4 555.7,322.4 564.5,318.1 573.4,313.4 582.2,308.4 591.0,303.1 599.8,297.4 608.6,291.4 617.4,285.0 626.2,278.2 635.0,271.2 643.8,263.8 652.6,256.0 661.5,247.9 670.3,239.4 679.1,230.6 687.9,221.5 696.7,212.0 705.5,202.2 714.3,192.0 723.1,181.5 731.9,170.6 740.7,159.4 749.6,147.8 758.4,135.9 767.2,123.7 776.0,111.1 784.8,98.2 793.6,84.9 802.4,71.2 811.2,57.3 820.0,43.0"/>





  <g data-key="rule">
    <foreignObject x="230" y="60" width="420" height="46">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="w_{\text{new}} = w_{\text{old}} - \eta\,L'(w_{\text{old}}),\qquad \eta = 0.1"></div>
    </foreignObject>
  </g>

  <g data-key="t0">
    <circle cx="168.1" cy="170.6" r="6" class="bdot"/>
    <line x1="168.1" y1="170.6" x2="168.1" y2="350" class="drop"/>
    <text x="168.1" y="388" class="tick" text-anchor="middle">0</text>
  </g>

  <g data-key="s1">
    <line x1="176" y1="177" x2="303" y2="297" class="mv" marker-end="url(#lr-ag)"/>
    <circle cx="309.1" cy="303.1" r="6" class="gdot"/>
    <line x1="309.1" y1="303.1" x2="309.1" y2="350" class="drop"/>
    <text x="309.1" y="388" class="tick" text-anchor="middle">0.8</text>
    <text x="196" y="255" class="gl">−0.1 · (−8) = +0.8</text>
  </g>

  <g data-key="s2">
    <line x1="316" y1="307" x2="374" y2="333" class="mv" marker-end="url(#lr-ag)"/>
    <circle cx="379.5" cy="336.2" r="6" class="gdot"/>
    <line x1="379.5" y1="336.2" x2="379.5" y2="350" class="drop"/>
    <text x="379.5" y="388" class="tick" text-anchor="middle">1.2</text>
    <text x="330" y="322" class="gl">+0.4</text>
  </g>

  <g data-key="s3">
    <circle cx="414.8" cy="344.5" r="6" class="gdot"/>
    <circle cx="432.4" cy="346.6" r="6" class="gdot"/>
    <text x="414.8" y="410" class="tick" text-anchor="middle">1.4</text>
    <text x="400" y="215" class="gl">шаги гаснут сами: +0.2, затем +0.1</text>
  </g>

  <g data-key="slow" data-only="1">
    <circle cx="196.3" cy="204.2" r="5" class="ydot"/>
    <circle cx="221.7" cy="231.3" r="5" class="ydot"/>
    <circle cx="244.5" cy="253.4" r="5" class="ydot"/>
    <text x="215" y="150" class="yl">η = 0.02: 0 → 0.16 → 0.30 → 0.43 — ползём</text>
  </g>

  <g data-key="zig" data-only="1">
    <line x1="176" y1="177" x2="584" y2="299" class="zg" marker-end="url(#lr-ay)"/>
    <line x1="584" y1="307" x2="386" y2="335" class="zg" marker-end="url(#lr-ay)"/>
    <line x1="386" y1="339" x2="479" y2="344" class="zg" marker-end="url(#lr-ay)"/>
    <circle cx="591" cy="303.1" r="6" class="ydot"/>
    <circle cx="485.3" cy="344.5" r="6" class="ydot"/>
    <text x="215" y="190" class="yl">η = 0.3: 0 → 2.4 → 1.2 → 1.8 — перелетаем дно, но сходимся</text>
  </g>

  <g data-key="boom" data-only="1">
    <line x1="176" y1="166" x2="880" y2="90" class="bad" marker-end="url(#lr-ar)"/>
    <text x="232" y="230" class="rl">η = 0.55: 0 → 4.4 → −3.3 → 10.2 → −13.4 — улетаем за край</text>
  </g>

  <text x="80" y="604" class="legend">жёлтый — функция потерь и слишком робкий или слишком резвый шаг · зелёный — рабочая траектория · красный — расходимость</text>
  <rect x="40" y="430" width="880" height="140" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="456" class="panel-label">формула этого шага</text>
  <g data-key="sf1" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="w_{\text{new}} = w_{\text{old}} - \eta\,L'(w_{\text{old}}), \qquad L'(w) = 5w - 8, \qquad \eta = 0.1"></div></foreignObject></g>
  <g data-key="sf2" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="w_1 = 0 - 0.1\cdot L'(0) = 0 - 0.1\cdot(-8) = 0.8 \qquad L: 6.5 \rightarrow 1.7"></div></foreignObject></g>
  <g data-key="sf3" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="w_2 = 0.8 - 0.1\cdot L'(0.8) = 0.8 - 0.1\cdot(-4) = 1.2 \qquad L: 1.7 \rightarrow 0.5"></div></foreignObject></g>
  <g data-key="sf4" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="w_3 = 1.2 - 0.1\cdot(-2) = 1.4, \qquad w_4 = 1.4 - 0.1\cdot(-1) = 1.5"></div></foreignObject></g>
  <g data-key="sf5" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\eta = 0.02: \quad w_1 = 0 - 0.02\cdot(-8) = 0.16, \quad w_2 = 0.16 - 0.02\cdot(-7.2) = 0.304"></div></foreignObject></g>
  <g data-key="sf6" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\eta = 0.3: \quad w_1 = 0 - 0.3\cdot(-8) = 2.4, \quad w_2 = 2.4 - 0.3\cdot(+4) = 1.2"></div></foreignObject></g>
  <g data-key="sf7" data-only="1"><foreignObject x="62" y="470" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\eta = 0.55: \quad w_1 = 4.4, \quad w_2 = -3.3, \quad \dots \qquad \text{порог: } \eta = \tfrac{2}{L^{\prime\prime}} = \tfrac{2}{5} = 0.4"></div></foreignObject></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="rule t0 sf1" data-focus="rule">
      <div class="step-kicker">Шаг 1 · правило</div>
      <h4>Вычесть производную, умноженную на η</h4>
      <p>Формула целиком описывает алгоритм: направление берём из знака
      производной, длину — из её модуля, а <span class="math-inline" data-tex="\eta"></span>
      задаёт общий масштаб. Стартуем из <code>w = 0</code>, где
      <code>L = 6.5</code>.</p>
    </div>
    <div class="step-panel" data-on="rule t0 s1 sf2" data-focus="s1">
      <div class="step-kicker">Шаг 2 · первый шаг</div>
      <h4>Крутой склон — длинный шаг</h4>
      <p>Производная в нуле равна −8, значит сдвиг равен
      <code>−0.1 · (−8) = +0.8</code>. Потери падают с 6.5 до 1.7 за один шаг:
      это была самая крутая часть склона.</p>
      </div>
    <div class="step-panel" data-on="rule t0 s1 s2 sf3" data-focus="s2">
      <div class="step-kicker">Шаг 3 · второй шаг</div>
      <h4>Склон стал положе — шаг короче</h4>
      <p>В точке 0.8 производная равна <code>5·0.8 − 8 = −4</code>, сдвиг вдвое
      меньше первого. Мы не задавали это правило отдельно: оно возникло само из
      того, что длина шага пропорциональна производной.</p>
    </div>
    <div class="step-panel" data-on="rule t0 s1 s2 s3 sf4" data-focus="s3">
      <div class="step-kicker">Шаг 4 · затухание</div>
      <h4>К минимуму подходим всё мельче</h4>
      <p>1.4, затем 1.5, затем 1.55 — точное значение 1.6 достигается лишь в
      пределе. Для обучения это нормально: нам нужна не точка минимума, а
      достаточно близкая к ней точка.</p>
    </div>
    <div class="step-panel" data-on="rule t0 slow sf5" data-focus="slow">
      <div class="step-kicker">Шаг 5 · слишком осторожно</div>
      <h4>η = 0.02: правильное направление, черепаший темп</h4>
      <p>За три шага мы добираемся только до 0.43. Такой спуск сойдётся, но
      потратит в разы больше вычислений — а каждый шаг на реальных данных стоит
      прохода по всей выборке.</p>
    </div>
    <div class="step-panel" data-on="rule t0 zig sf6" data-focus="zig">
      <div class="step-kicker">Шаг 6 · слишком смело</div>
      <h4>η = 0.3: перепрыгиваем дно и качаемся вокруг него</h4>
      <p>Из нуля мы улетаем в 2.4 — на другую сторону параболы, оттуда назад в 1.2.
      Колебания затухают, спуск всё равно сходится, но траектория тратит шаги на
      метания поперёк долины.</p>
    </div>
    <div class="step-panel" data-on="rule t0 boom sf7" data-focus="boom">
      <div class="step-kicker">Шаг 7 · граница устойчивости</div>
      <h4>η = 0.55: каждый следующий промах больше предыдущего</h4>
      <p>0 → 4.4 → −3.3 → 10.2 → −13.4: потери растут, обучение развалилось. Для
      параболы порог считается точно: <code>η &gt; 2/L″ = 2/5 = 0.4</code> — и
      спуск расходится при любом старте.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-yellow">
  <strong>Практическая деталь:</strong> <span class="math-inline" data-tex="\eta"></span> —
  не параметр модели, а <em>гиперпараметр</em>: спуск его не подбирает, его выбирает
  человек или расписание. Обычные стартовые значения для нейросетей — от 0.1 до
  0.0001, и почти всегда лучше начать с малого и увеличить, чем поймать расходимость
  и не понять, что случилось.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> длину шага задаёт произведение
  <span class="math-inline" data-tex="\eta \cdot L'(w)"></span>: производная тормозит
  спуск у дна автоматически, а <span class="math-inline" data-tex="\eta"></span>
  решает, сходимся мы медленно, быстро или вообще никогда.
</div>

---

## Часть 4. Градиент: направление наискорейшего роста

<p>
  У настоящей модели параметров больше одного. Добавим к нашей прямой свободный
  член — теперь модель <span class="math-inline" data-tex="\hat{y} = w_0 + w_1 x"></span>,
  и функция потерь стала функцией двух переменных:
</p>

<div class="math-display" data-tex="L(w_0, w_1) = \tfrac{1}{2}\Bigl[(2 - w_0 - w_1)^2 + (3 - w_0 - 2w_1)^2\Bigr]"></div>

<p>
  Здесь «наклон» перестаёт быть одним числом. <strong>Частная производная</strong>
  <span class="math-inline" data-tex="\partial L/\partial w_0"></span> — это наклон
  вдоль оси <span class="math-inline" data-tex="w_0"></span>, когда
  <span class="math-inline" data-tex="w_1"></span> заморожен; вторая частная —
  наклон вдоль второй оси. В стартовой точке <code>(0, 0)</code>:
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial w_0} = \frac{1}{2}\sum -2(y_i - \hat{y}_i) = -5, \qquad \frac{\partial L}{\partial w_1} = \frac{1}{2}\sum -2x_i(y_i - \hat{y}_i) = -8"></div>

<p>
  Но идти-то можно не только вдоль осей: направлений бесконечно много. Направление
  удобно задавать вектором единичной длины
  <span class="math-inline" data-tex="u = (\Delta w_0, \Delta w_1)"></span>,
  <span class="math-inline" data-tex="\|u\| = 1"></span> — иначе мы будем сравнивать
  не направления, а длины векторов. Скорость изменения функции вдоль такого вектора
  называется <strong>производной по направлению</strong>, и считается она на
  удивление просто:
</p>

<div class="math-display" data-tex="L'_u = \Delta w_0 \cdot \frac{\partial L}{\partial w_0} + \Delta w_1 \cdot \frac{\partial L}{\partial w_1}"></div>

<p>
  Вклад каждой оси берётся пропорционально смещению по ней. А справа — знакомая
  конструкция: это скалярное произведение вектора <code>u</code> на вектор из
  частных производных. Этот второй вектор и называется <strong>градиентом</strong>:
</p>

<div class="math-display" data-tex="\nabla L = \left(\frac{\partial L}{\partial w_0},\ \frac{\partial L}{\partial w_1}, \dots, \frac{\partial L}{\partial w_n}\right), \qquad L'_u = u \cdot \nabla L"></div>

<div class="stage" id="stageGrad" tabindex="0">
  <div class="stage-figure">
<svg id="gd" viewBox="0 0 960 560" role="img" aria-label="Круг направлений в точке и столбики значений производной по направлению">
  <style>
    #gd { font-family: Helvetica, Arial, sans-serif; }
    #gd .ax   { stroke: #5E5850; stroke-width: 1.3; }
    #gd .ttl  { font-size: 15px; fill: #111111; font-weight: 700; }
    #gd .cap  { font-size: 13px; fill: #5E5850; }
    #gd .circ { fill: none; stroke: #B9C9DA; stroke-width: 1.4; stroke-dasharray: 5 4; }
    #gd .thin { stroke: #9FBEE0; stroke-width: 1.8; fill: none; }
    #gd .vec  { stroke: #3576C0; stroke-width: 2.6; fill: none; }
    #gd .gvec { stroke: #C30B0A; stroke-width: 3.2; fill: none; }
    #gd .avec { stroke: #73B222; stroke-width: 3.2; fill: none; }
    #gd .bl   { font-size: 13px; fill: #244F81; }
    #gd .rl   { font-size: 14px; fill: #C30B0A; }
    #gd .gl   { font-size: 14px; fill: #5A8C1C; }
    #gd .pan  { fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.4; }
    #gd .bar  { fill: #9FBEE0; }
    #gd .barg { fill: #A9D46A; }
    #gd .barr { fill: #E39A99; }
    #gd .td   { font-size: 14px; fill: #111111; }
    #gd .tick { font-size: 13px; fill: #8A8378; }
    #gd .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #gd .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="gd-ab" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
    <marker id="gd-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
    <marker id="gd-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
  </defs>

  <text x="40" y="36" class="ttl">Все направления из точки (0, 0) и скорость изменения потерь вдоль каждого</text>

  <line x1="110" y1="215" x2="400" y2="215" class="ax"/>
  <line x1="250" y1="350" x2="250" y2="80" class="ax"/>
  <text x="406" y="220" class="tick">Δw₀</text>
  <text x="250" y="70" class="tick" text-anchor="middle">Δw₁</text>

  <g data-key="comp">
    <circle cx="250" cy="215" r="110" class="circ"/>
    <circle cx="250" cy="215" r="5" fill="#111111"/>
    <line x1="250" y1="215" x2="327.8" y2="137.2" class="thin"/>
    <line x1="250" y1="215" x2="327.8" y2="292.8" class="thin"/>
    <line x1="250" y1="215" x2="172.2" y2="137.2" class="thin"/>
    <line x1="250" y1="215" x2="172.2" y2="292.8" class="thin"/>
    <text x="128" y="352" class="cap">все векторы длины 1 — это окружность</text>
  </g>

  <g data-key="pd">
    <line x1="250" y1="215" x2="352" y2="215" class="vec" marker-end="url(#gd-ab)"/>
    <line x1="250" y1="215" x2="250" y2="113" class="vec" marker-end="url(#gd-ab)"/>
    <text x="300" y="207" class="bl" text-anchor="middle">u = (1, 0)</text>
    <text x="258" y="130" class="bl">u = (0, 1)</text>
  </g>

  <g data-key="grad">
    <line x1="250" y1="215" x2="196" y2="301" class="gvec" marker-end="url(#gd-ar)"/>
    <text x="120" y="322" class="rl">градиент (−5, −8)</text>
  </g>

  <g data-key="anti">
    <line x1="250" y1="215" x2="303" y2="128" class="avec" marker-end="url(#gd-ag)"/>
    <text x="312" y="106" class="gl">антиградиент</text>
  </g>





  <g data-key="bars">
    <rect x="470" y="80" width="470" height="270" rx="10" class="pan"/>
    <text x="492" y="110" class="td">производная по направлению</text>
    <line x1="730" y1="128" x2="730" y2="316" class="ax"/>
    <text x="675" y="170" class="bl" text-anchor="end">по оси w₀</text>
    <rect x="675" y="156" width="55" height="18" class="bar"/>
    <text x="738" y="170" class="td">−5.00</text>
    <text x="642" y="215" class="bl" text-anchor="end">по оси w₁</text>
    <rect x="642" y="201" width="88" height="18" class="bar"/>
    <text x="738" y="215" class="td">−8.00</text>
    <text x="626" y="260" class="gl" text-anchor="end">антиградиент</text>
    <rect x="626" y="246" width="104" height="18" class="barg"/>
    <text x="738" y="260" class="td">−9.43 — рекорд</text>
    <text x="736" y="305" class="rl">градиент</text>
    <rect x="730" y="291" width="104" height="18" class="barr"/>
    <text x="842" y="305" class="td">+9.43</text>
    <text x="626" y="336" class="tick" text-anchor="middle">−9.43</text>
    <text x="730" y="336" class="tick" text-anchor="middle">0</text>
    <text x="834" y="336" class="tick" text-anchor="middle">+9.43</text>
  </g>

  <text x="40" y="544" class="legend">синий — пробные направления · красный — градиент, рост · зелёный — антиградиент, спуск</text>
  <rect x="40" y="372" width="880" height="140" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="398" class="panel-label">формула этого шага</text>
  <g data-key="af1" data-only="1"><foreignObject x="62" y="412" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\|u\| = 1: \quad \Delta w_0^2 + \Delta w_1^2 = 1 \qquad \text{— все направления лежат на окружности}"></div></foreignObject></g>
  <g data-key="af2" data-only="1"><foreignObject x="62" y="412" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\partial L}{\partial w_0} = \tfrac{1}{2}\sum_i -2\bigl(y_i - \hat{y}_i\bigr) = -5, \qquad \frac{\partial L}{\partial w_1} = \tfrac{1}{2}\sum_i -2x_i\bigl(y_i - \hat{y}_i\bigr) = -8"></div></foreignObject></g>
  <g data-key="af3" data-only="1"><foreignObject x="62" y="412" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L'_u = \Delta w_0\cdot\frac{\partial L}{\partial w_0} + \Delta w_1\cdot\frac{\partial L}{\partial w_1} = \Delta w_0\,(-5) + \Delta w_1\,(-8)"></div></foreignObject></g>
  <g data-key="af4" data-only="1"><foreignObject x="62" y="412" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\nabla L = (-5,\,-8), \qquad \|\nabla L\| = \sqrt{(-5)^2 + (-8)^2} = \sqrt{89} = 9.434, \qquad L'_u = u\cdot\nabla L"></div></foreignObject></g>
  <g data-key="af5" data-only="1"><foreignObject x="62" y="412" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L'_u = \|u\|\cdot\|\nabla L\|\cdot\cos\alpha = 9.434\,\cos\alpha \quad \text{— максимум при } \alpha = 0"></div></foreignObject></g>
  <g data-key="af6" data-only="1"><foreignObject x="62" y="412" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="u = -\frac{\nabla L}{\|\nabla L\|} = \left(\frac{5}{9.434},\ \frac{8}{9.434}\right) = (0.530,\ 0.848), \qquad L'_u = -9.434"></div></foreignObject></g>
  <g data-key="af7" data-only="1"><foreignObject x="62" y="412" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="-9.434 \;&lt;\; -8 \;&lt;\; -5 \qquad \text{— движение вдоль любой оси проигрывает антиградиенту}"></div></foreignObject></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="comp af1" data-focus="comp">
      <div class="step-kicker">Шаг 1 · выбор</div>
      <h4>Из точки на плоскости можно шагнуть куда угодно</h4>
      <p>В одномерном случае вариантов было два: влево или вправо. Теперь их
      бесконечно много, и все они — точки окружности единичного радиуса. Сравнивать
      имеет смысл только векторы одинаковой длины, иначе выиграет просто самый
      длинный.</p>
    </div>
    <div class="step-panel" data-on="comp pd af2" data-focus="pd">
      <div class="step-kicker">Шаг 2 · что мы уже умеем</div>
      <h4>Частные производные отвечают только про два направления</h4>
      <p>Вдоль <code>w₀</code> функция меняется со скоростью −5, вдоль
      <code>w₁</code> — со скоростью −8. Оба направления ведут вниз, второе круче.
      Про остальную окружность мы пока ничего не знаем.</p>
    </div>
    <div class="step-panel" data-on="comp pd af3" data-focus="af3">
      <div class="step-kicker">Шаг 3 · произвольное направление</div>
      <h4>Смесь двух наклонов пропорционально смещению</h4>
      <p>Для любого <code>u = (Δw₀, Δw₁)</code> скорость равна
      <code>Δw₀·(−5) + Δw₁·(−8)</code>. Никаких новых вычислений: двух частных
      производных хватает, чтобы ответить сразу про все направления.</p>
    </div>
    <div class="step-panel" data-on="comp pd grad af4" data-focus="grad">
      <div class="step-kicker">Шаг 4 · вектор из производных</div>
      <h4>Градиент — это просто список частных производных</h4>
      <p>Записав <span class="math-inline" data-tex="\nabla L = (-5, -8)"></span>,
      формулу можно прочитать как скалярное произведение
      <span class="math-inline" data-tex="L'_u = u\cdot\nabla L"></span>. Длина этого
      вектора здесь равна <span class="math-inline" data-tex="\sqrt{25+64} = 9.434"></span>.</p>
    </div>
    <div class="step-panel" data-on="comp grad bars af5" data-focus="af5">
      <div class="step-kicker">Шаг 5 · косинус решает всё</div>
      <h4>Единственное, чем мы управляем, — угол</h4>
      <p>По определению скалярного произведения
      <span class="math-inline" data-tex="L'_u = \|u\|\|\nabla L\|\cos\alpha"></span>.
      Длина <code>u</code> равна 1 по договорённости, длина градиента задана точкой
      и функцией. Остаётся угол: максимум при <code>α = 0°</code> — вдоль градиента
      функция растёт быстрее всего.</p>
    </div>
    <div class="step-panel" data-on="comp grad anti bars af6" data-focus="anti">
      <div class="step-kicker">Шаг 6 · разворот</div>
      <h4>Минимум косинуса — при 180°</h4>
      <p>Самое быстрое убывание достигается ровно в противоположную сторону:
      <span class="math-inline" data-tex="-\nabla L/\|\nabla L\| = (0.53,\ 0.848)"></span>,
      скорость −9.434. Этот вектор называют <strong>антиградиентом</strong>, и именно
      по нему делает шаг градиентный спуск.</p>
    </div>
    <div class="step-panel" data-on="comp pd grad anti bars af7" data-focus="bars">
      <div class="step-kicker">Шаг 7 · сравнение</div>
      <h4>По осям — хуже, чем по антиградиенту</h4>
      <p>−5 и −8 против −9.43: движение вдоль любой оси проигрывает. Столбики
      показывают весь разброс: от +9.43 (вверх по градиенту) до −9.43 (вниз по
      антиградиенту), и ни одно направление не даёт больше по модулю.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-blue">
  <strong>Почему это работает для любого числа параметров:</strong> в рассуждении
  нигде не использовалось, что переменных ровно две. У сети с миллионом весов
  градиент — вектор из миллиона частных производных, и антиградиент точно так же
  остаётся направлением наискорейшего убывания в этом миллионномерном пространстве.
  Нарисовать нельзя, посчитать — можно.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> градиент собирает все частные производные
  в один вектор, и этого вектора достаточно, чтобы мгновенно ответить про любое из
  бесконечного множества направлений. Спуск идёт против него.
</div>

---

## Часть 5. Спуск по карте высот

<p>
  Функцию двух переменных удобно рисовать как рельеф: по горизонтали
  <code>w₀</code>, по вертикали <code>w₁</code>, а высота — значение потерь.
  Замкнутые кривые — <strong>линии уровня</strong>: вдоль такой линии потери
  одинаковы, как горизонтали на топографической карте.
</p>

<p>
  Человек с завязанными глазами, стоящий на этом рельефе, видит ровно то же, что и
  алгоритм: ничего. Он может лишь пощупать наклон вокруг себя и шагнуть туда, где
  спуск круче. Именно это и делает формула шага — теперь векторная:
</p>

<div class="math-display" data-tex="\begin{pmatrix} w_0 \\ w_1 \end{pmatrix}_{\text{new}} = \begin{pmatrix} w_0 \\ w_1 \end{pmatrix}_{\text{old}} - \eta \cdot \nabla L\bigl(w_{\text{old}}\bigr)"></div>

<p>
  Алгоритм целиком умещается в три строки: выбрать начальную точку (обычно
  случайно), посчитать в ней градиент, сдвинуться против него — и повторять, пока
  шаги не станут пренебрежимо малы. Посмотрим на траекторию для наших двух точек.
</p>

<div class="stage" id="stageMap" tabindex="0">
  <div class="stage-figure">
<svg id="mp" viewBox="0 0 960 700" role="img" aria-label="Карта линий уровня функции потерь и траектория градиентного спуска из нуля">
  <style>
    #mp { font-family: Helvetica, Arial, sans-serif; }
    #mp .ax   { stroke: #5E5850; stroke-width: 1.3; }
    #mp .ttl  { font-size: 15px; fill: #111111; font-weight: 700; }
    #mp .cap  { font-size: 13px; fill: #5E5850; }
    #mp .tick { font-size: 13px; fill: #8A8378; }
    #mp .lvl  { fill: none; stroke: #C9BE7A; stroke-width: 1.6; }
    #mp .lvl2 { fill: none; stroke: #C29E08; stroke-width: 2; }
    #mp .val  { font-size: 13px; fill: #8C7106; }
    #mp .mv   { stroke: #73B222; stroke-width: 2.8; fill: none; }
    #mp .gv   { stroke: #C30B0A; stroke-width: 2.6; fill: none; }
    #mp .dot  { fill: #3576C0; }
    #mp .gdot { fill: #73B222; }
    #mp .rl   { font-size: 13px; fill: #C30B0A; }
    #mp .gl   { font-size: 13px; fill: #5A8C1C; }
    #mp .val2 { font-size: 14px; fill: #111111; }
    #mp .pan  { fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.4; }
    #mp .th   { font-size: 13px; fill: #244F81; font-weight: 700; }
    #mp .td   { font-size: 14px; fill: #111111; }
    #mp .dash { stroke: #C30B0A; stroke-width: 1.6; stroke-dasharray: 7 5; fill: none; }
    #mp .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #mp .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="mp-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/>
    </marker>
    <marker id="mp-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
    <clipPath id="mp-box"><rect x="60" y="60" width="340" height="374"/></clipPath>
  </defs>

  <text x="40" y="36" class="ttl">Карта потерь L(w₀, w₁): линии уровня и путь спуска при η = 0.1</text>

  <line x1="60" y1="383" x2="410" y2="383" class="ax"/>
  <line x1="111" y1="434" x2="111" y2="60" class="ax"/>
  <text x="416" y="388" class="tick">w₀</text>
  <text x="111" y="52" class="tick" text-anchor="middle">w₁</text>
  <text x="281" y="401" class="tick" text-anchor="middle">1</text>
  <text x="105" y="218" class="tick" text-anchor="end">1</text>

  <g data-key="map" clip-path="url(#mp-box)">
    <ellipse cx="281" cy="213" rx="1605" ry="234" class="lvl" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="1090" ry="159" class="lvl" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="771" ry="112" class="lvl" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="508" ry="74" class="lvl2" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="345" ry="50" class="lvl" transform="rotate(31.72 281 213)"/>
    <ellipse cx="281" cy="213" rx="168" ry="24" class="lvl" transform="rotate(31.72 281 213)"/>
  </g>

  <g data-key="min">
    <circle cx="281" cy="213" r="6" class="gdot"/>
    <text x="292" y="203" class="val2">минимум (1, 1)</text>
    <text x="292" y="223" class="val2">L = 0</text>
  </g>

  <g data-key="start">
    <circle cx="111" cy="383" r="6" class="dot"/>
    <text x="120" y="399" class="val2">старт (0, 0), L = 6.5</text>
  </g>

  <g data-key="g1">
    <line x1="111" y1="383" x2="79" y2="428" class="gv" marker-end="url(#mp-ar)"/>
    <text x="66" y="446" class="rl">∇L = (−5, −8)</text>
  </g>

  <g data-key="s1">
    <line x1="115" y1="377" x2="192" y2="253" class="mv" marker-end="url(#mp-ag)"/>
    <circle cx="196" cy="247" r="6" class="gdot"/>
    <text x="204" y="262" class="gl">после шага: (0.5, 0.8), L = 0.65</text>
  </g>

  <g data-key="s2">
    <line x1="199" y1="242" x2="220" y2="210" class="mv" marker-end="url(#mp-ag)"/>
    <circle cx="223.2" cy="204.5" r="5" class="gdot"/>
    <circle cx="232.2" cy="191.4" r="4" class="gdot"/>
    <circle cx="235.4" cy="187.6" r="4" class="gdot"/>
    <text x="243" y="180" class="gl">и дальше всё мельче</text>
  </g>

  <g data-key="ravine" data-only="1">
    <line x1="60" y1="76.5" x2="399" y2="286" class="dash"/>
    <text x="150" y="95" class="rl">дно долины: вдоль этой линии</text>
    <text x="150" y="115" class="rl">потери почти не меняются</text>
  </g>

  <g data-key="tbl">
    <rect x="440" y="70" width="500" height="250" rx="10" class="pan"/>
    <text x="462" y="100" class="th">шаг</text>
    <text x="580" y="100" class="th" text-anchor="end">w₀</text>
    <text x="660" y="100" class="th" text-anchor="end">w₁</text>
    <text x="752" y="100" class="th" text-anchor="end">L</text>
    <text x="790" y="100" class="th">∇L</text>
    <line x1="455" y1="112" x2="925" y2="112" class="ax"/>
    <text x="462" y="140" class="td">0</text>
    <text x="580" y="140" class="td" text-anchor="end">0.000</text>
    <text x="660" y="140" class="td" text-anchor="end">0.000</text>
    <text x="752" y="140" class="td" text-anchor="end">6.5000</text>
    <text x="790" y="140" class="td">(−5.00, −8.00)</text>
    <text x="462" y="175" class="td">1</text>
    <text x="580" y="175" class="td" text-anchor="end">0.500</text>
    <text x="660" y="175" class="td" text-anchor="end">0.800</text>
    <text x="752" y="175" class="td" text-anchor="end">0.6500</text>
    <text x="790" y="175" class="td">(−1.60, −2.50)</text>
    <text x="462" y="210" class="td">2</text>
    <text x="580" y="210" class="td" text-anchor="end">0.660</text>
    <text x="660" y="210" class="td" text-anchor="end">1.050</text>
    <text x="752" y="210" class="td" text-anchor="end">0.0708</text>
    <text x="790" y="210" class="td">(−0.53, −0.77)</text>
    <text x="462" y="245" class="td">3</text>
    <text x="580" y="245" class="td" text-anchor="end">0.713</text>
    <text x="660" y="245" class="td" text-anchor="end">1.127</text>
    <text x="752" y="245" class="td" text-anchor="end">0.0133</text>
    <text x="790" y="245" class="td">(−0.19, −0.23)</text>
    <text x="462" y="280" class="td">4</text>
    <text x="580" y="280" class="td" text-anchor="end">0.732</text>
    <text x="660" y="280" class="td" text-anchor="end">1.150</text>
    <text x="752" y="280" class="td" text-anchor="end">0.0075</text>
    <text x="790" y="280" class="td">(−0.09, −0.06)</text>
  </g>


  <g data-key="slow" data-only="1">
    <text x="440" y="446" class="val2">За 4 шага потери упали в 870 раз, но до точки (1, 1)</text>
    <text x="440" y="470" class="val2">этому спуску понадобится ещё около 230 шагов:</text>
    <text x="440" y="494" class="rl">вдоль дна долины градиент почти нулевой.</text>
  </g>

  <text x="40" y="684" class="legend">жёлтый — линии уровня потерь · красный — градиент и проблемное место · зелёный — шаги спуска</text>
  <rect x="40" y="514" width="880" height="150" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="540" class="panel-label">формула этого шага</text>
  <g data-key="mf1" data-only="1"><foreignObject x="62" y="556" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L(w_0, w_1) = \tfrac{1}{2}\Bigl[(2 - w_0 - w_1)^2 + (3 - w_0 - 2w_1)^2\Bigr] \qquad \min \text{ в } (1,\,1)"></div></foreignObject></g>
  <g data-key="mf2" data-only="1"><foreignObject x="62" y="556" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="L(0,\,0) = \tfrac{1}{2}\bigl[2^2 + 3^2\bigr] = 6.5"></div></foreignObject></g>
  <g data-key="mf3" data-only="1"><foreignObject x="62" y="556" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\nabla L = \left(\tfrac{1}{2}\sum_i -2\bigl(y_i - \hat{y}_i\bigr),\ \ \tfrac{1}{2}\sum_i -2x_i\bigl(y_i - \hat{y}_i\bigr)\right) = (-5,\ -8)"></div></foreignObject></g>
  <g data-key="mf4" data-only="1"><foreignObject x="62" y="556" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\begin{pmatrix} w_0 \\ w_1 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \end{pmatrix} - 0.1\begin{pmatrix} -5 \\ -8 \end{pmatrix} = \begin{pmatrix} 0.5 \\ 0.8 \end{pmatrix}, \qquad L = 0.65"></div></foreignObject></g>
  <g data-key="mf5" data-only="1"><foreignObject x="62" y="556" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\begin{pmatrix} 0.5 \\ 0.8 \end{pmatrix} - 0.1\begin{pmatrix} -1.60 \\ -2.50 \end{pmatrix} = \begin{pmatrix} 0.66 \\ 1.05 \end{pmatrix}, \qquad L = 0.0708"></div></foreignObject></g>
  <g data-key="mf6" data-only="1"><foreignObject x="62" y="556" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\lambda_{\max}}{\lambda_{\min}} = \frac{3.427}{0.0729} \approx 47 \qquad \text{— во столько раз долина вытянута}"></div></foreignObject></g>
  <g data-key="mf7" data-only="1"><foreignObject x="62" y="556" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\bigl\|w_t - (1,\,1)\bigr\| &lt; 0.01 \quad \text{при } t \approx 237 \qquad (\text{с моментом } \alpha = 0.9: \ t \approx 48)"></div></foreignObject></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="map min mf1" data-focus="map">
      <div class="step-kicker">Шаг 1 · рельеф</div>
      <h4>Линии уровня — горизонтали карты потерь</h4>
      <p>Каждая кривая соединяет точки с одинаковым значением <code>L</code>. Здесь
      они оказались сильно вытянутыми эллипсами с общим центром в точке
      <code>(1, 1)</code> — там модель <span class="math-inline" data-tex="\hat{y} = 1 + x"></span>
      проходит ровно через оба наблюдения, и потери равны нулю.</p>
    </div>
    <div class="step-panel" data-on="map min start mf2" data-focus="start">
      <div class="step-kicker">Шаг 2 · старт</div>
      <h4>Начинаем из нуля, ничего не зная о рельефе</h4>
      <p>Алгоритм не видит ни центра, ни линий уровня. Ему известны только
      координаты текущей точки и значение потерь в ней: <code>L(0, 0) = 6.5</code>.</p>
    </div>
    <div class="step-panel" data-on="map min start g1 mf3" data-focus="g1">
      <div class="step-kicker">Шаг 3 · щупаем склон</div>
      <h4>Градиент указывает вверх по склону</h4>
      <p>В стартовой точке <span class="math-inline" data-tex="\nabla L = (-5, -8)"></span> —
      красная стрелка ведёт от центра, туда, где потери растут. Полезное свойство:
      градиент всегда перпендикулярен линии уровня, ведь вдоль самой линии функция
      не меняется.</p>
    </div>
    <div class="step-panel" data-on="map min start s1 mf4" data-focus="s1">
      <div class="step-kicker">Шаг 4 · первый шаг</div>
      <h4>Разворачиваемся и умножаем на η</h4>
      <p>Сдвиг равен <code>−0.1·(−5, −8) = (0.5, 0.8)</code>. Одним шагом потери
      падают с 6.5 до 0.65 — в десять раз. Обе координаты обновляются одновременно
      и независимо: у каждого параметра своя частная производная.</p>
      </div>
    <div class="step-panel" data-on="map min start s1 s2 tbl mf5" data-focus="tbl">
      <div class="step-kicker">Шаг 5 · дальше</div>
      <h4>Шаги укорачиваются быстрее, чем хотелось бы</h4>
      <p>Второй шаг переносит нас в <code>(0.66, 1.05)</code>, третий — в
      <code>(0.713, 1.127)</code>. Потери уже 0.0133, но точка всё ещё далеко от
      центра карты: спуск явно замедлился, не дойдя до цели.</p>
    </div>
    <div class="step-panel" data-on="map min s2 ravine mf6" data-focus="ravine">
      <div class="step-kicker">Шаг 6 · диагноз</div>
      <h4>Мы в узкой долине</h4>
      <p>Эллипсы вытянуты в отношении примерно 47 к 1. Поперёк долины склон крутой,
      вдоль неё — почти плоский. Спуск быстро сваливается на дно, а потом ползёт
      вдоль него микроскопическими шагами: градиент там почти ноль.</p>
    </div>
    <div class="step-panel" data-on="map min start s1 s2 slow mf7" data-focus="slow">
      <div class="step-kicker">Шаг 7 · цена</div>
      <h4>Ещё 230 шагов до точного попадания</h4>
      <p>С <span class="math-inline" data-tex="\eta = 0.1"></span> в окрестность
      <code>(1, 1)</code> спуск приходит примерно за 237 итераций — при том, что
      первые 90% пути были пройдены за один шаг. Именно из-за таких долин придумали
      инерцию и нормировку признаков; о них — в следующей части.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-red">
  <strong>Чего спуск не гарантирует:</strong> он находит <em>локальный</em> минимум —
  ту яму, в которую скатился из своей случайной стартовой точки. Если рельеф
  сложный, из другой инициализации получится другой ответ. Отдельная беда — седловые
  точки и плато, где градиент близок к нулю, хотя рядом есть путь вниз. Для
  выпуклых потерь (MSE линейной регрессии, logloss логистической) проблемы нет:
  яма там одна.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> спуск — это ходьба по карте вслепую, где
  единственный доступный прибор показывает направление наибольшего подъёма. Скорость
  зависит не от алгоритма, а от формы рельефа: круглые ямы проходятся за считанные
  шаги, вытянутые долины — за сотни.
</div>

---

## Часть 6. Цикл обучения: батч, SGD, инерция

<p>
  Соберём всё, что было, в один цикл. Он одинаков для линейной регрессии и для
  сети с миллиардом параметров — меняется только то, насколько сложно вычислить
  предсказание и градиент. В сцене ниже слева лежат данные и параметр, справа —
  четыре формулы итерации и пустые клетки, которые заполняются шаг за шагом.
</p>

<div class="stage" id="stagePipe" tabindex="0">
  <div class="stage-figure">
<svg id="pl" viewBox="0 0 1240 730" role="img" aria-label="Одна итерация обучения в числах: предсказание, потери, градиент и новое значение веса">
  <style>
    #pl { font-family: Helvetica, Arial, sans-serif; }
    #pl .title { font-size: 15px; font-weight: 700; fill: #5E5850; }
    #pl .colhd { font-size: 13px; fill: #8A8378; letter-spacing: 0.06em; }
    #pl .lab   { font-size: 13px; font-weight: 600; }
    #pl .ct    { font-size: 12px; font-weight: 600; }
    #pl .shape { font-size: 12px; fill: #968F85; }
    #pl .cell  { stroke-width: 1.2; }
    #pl .empty { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; stroke-dasharray: 3 2; }
    #pl .qt    { font-size: 12px; fill: #C9C2B8; }
    #pl .div   { stroke: #E5E1D8; stroke-width: 1.4; }
    #pl .note  { font-size: 14px; fill: #5E5850; }
    #pl .hl    { fill: none; stroke: #73B222; stroke-width: 2; stroke-dasharray: 5 4; }
    #pl .arw   { font-size: 15px; fill: #8A8378; }
    #pl .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #pl .legend { font-size: 13px; fill: #8A8378; }
  </style>

  <text x="40" y="34" class="title">Одна итерация обучения: четыре формулы и числа, которые через них проходят</text>
  <text x="250" y="72" class="colhd" text-anchor="middle">ДАННЫЕ И ПАРАМЕТРЫ</text>
  <text x="880" y="72" class="colhd" text-anchor="middle">ИТЕРАЦИЯ 1</text>
  <line x1="520" y1="56" x2="520" y2="412" class="div"/>

  <g data-key="dat">
    <text x="128" y="131" class="lab" text-anchor="end" fill="#5E5850">x =</text>
    <rect x="140" y="100" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="167" y="117" class="ct" text-anchor="middle" fill="#5E5850">1</text>
    <rect x="140" y="126" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="167" y="143" class="ct" text-anchor="middle" fill="#5E5850">2</text>
    <text x="167" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <text x="308" y="131" class="lab" text-anchor="end" fill="#5E5850">y =</text>
    <rect x="320" y="100" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="347" y="117" class="ct" text-anchor="middle" fill="#5E5850">2</text>
    <rect x="320" y="126" width="54" height="26" rx="2" class="cell" fill="#F3F1EE" stroke="#5E5850"/>
    <text x="347" y="143" class="ct" text-anchor="middle" fill="#5E5850">3</text>
    <text x="347" y="170" class="shape" text-anchor="middle">(2×1)</text>
    <text x="128" y="227" class="lab" text-anchor="end" fill="#2A5E9B">w =</text>
    <rect x="140" y="196" width="54" height="26" rx="2" class="cell" fill="#E8F0F7" stroke="#3576C0"/>
    <text x="167" y="213" class="ct" text-anchor="middle" fill="#2A5E9B">0.0000</text>
    <text x="167" y="240" class="shape" text-anchor="middle">параметр</text>
    <text x="308" y="227" class="lab" text-anchor="end" fill="#8C7106">η =</text>
    <rect x="320" y="196" width="54" height="26" rx="2" class="cell" fill="#FFF7DF" stroke="#C29E08"/>
    <text x="347" y="213" class="ct" text-anchor="middle" fill="#8C7106">0.10</text>
    <text x="347" y="240" class="shape" text-anchor="middle">гиперпараметр</text>
    <text x="40" y="300" class="note">Данные и η в цикле не меняются никогда.</text>
    <text x="40" y="324" class="note">Меняется ровно одна клетка — синяя.</text>
  </g>

  <foreignObject x="560" y="92" width="400" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\hat{y} = w\,x"></div>
  </foreignObject>
  <g data-key="pAe" data-only="1">
    <text x="968" y="127" class="lab" text-anchor="end" fill="#C9C2B8">ŷ =</text>
    <rect x="980" y="96" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="113" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="139" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="pA" data-only="1">
    <text x="968" y="127" class="lab" text-anchor="end" fill="#4C8316">ŷ =</text>
    <rect x="980" y="96" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="113" class="ct" text-anchor="middle" fill="#4C8316">0.0000</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="139" class="ct" text-anchor="middle" fill="#4C8316">0.0000</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
    <text x="1060" y="127" class="note">0·1 = 0,  0·2 = 0</text>
  </g>

  <foreignObject x="560" y="180" width="400" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="L = \tfrac{1}{n}\sum_i \left(y_i - \hat{y}_i\right)^2"></div>
  </foreignObject>
  <g data-key="pBe" data-only="1">
    <text x="968" y="201" class="lab" text-anchor="end" fill="#C9C2B8">L =</text>
    <rect x="980" y="184" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="201" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="228" class="shape" text-anchor="middle">(скаляр)</text>
  </g>
  <g data-key="pB" data-only="1">
    <text x="968" y="201" class="lab" text-anchor="end" fill="#8C7106">L =</text>
    <rect x="980" y="184" width="54" height="26" rx="2" class="cell" fill="#FFF7DF" stroke="#C29E08"/>
    <text x="1007" y="201" class="ct" text-anchor="middle" fill="#8C7106">6.5000</text>
    <text x="1007" y="228" class="shape" text-anchor="middle">(скаляр)</text>
    <text x="1060" y="201" class="note">½(2² + 3²)</text>
  </g>

  <foreignObject x="560" y="268" width="400" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\nabla L = \tfrac{1}{n}\sum_i -2x_i\left(y_i - \hat{y}_i\right)"></div>
  </foreignObject>
  <g data-key="pCe" data-only="1">
    <text x="968" y="289" class="lab" text-anchor="end" fill="#C9C2B8">∇L =</text>
    <rect x="980" y="272" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="289" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="316" class="shape" text-anchor="middle">по числу на параметр</text>
  </g>
  <g data-key="pC" data-only="1">
    <text x="968" y="289" class="lab" text-anchor="end" fill="#A30908">∇L =</text>
    <rect x="980" y="272" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1007" y="289" class="ct" text-anchor="middle" fill="#A30908">−8.0000</text>
    <text x="1007" y="316" class="shape" text-anchor="middle">по числу на параметр</text>
    <text x="1060" y="289" class="note">½(−4 − 12)</text>
  </g>

  <foreignObject x="560" y="356" width="400" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="w \leftarrow w - \eta\,\nabla L"></div>
  </foreignObject>
  <g data-key="pDe" data-only="1">
    <text x="968" y="377" class="lab" text-anchor="end" fill="#C9C2B8">w =</text>
    <rect x="980" y="360" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="377" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="404" class="shape" text-anchor="middle">новое значение</text>
  </g>
  <g data-key="pD" data-only="1">
    <text x="968" y="377" class="lab" text-anchor="end" fill="#4C8316">w =</text>
    <rect x="980" y="360" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="377" class="ct" text-anchor="middle" fill="#4C8316">0.8000</text>
    <text x="1007" y="404" class="shape" text-anchor="middle">новое значение</text>
    <text x="1060" y="377" class="note">0 − 0.1·(−8)</text>
  </g>

  <g data-key="loop" data-only="1">
    <text x="128" y="612" class="lab" text-anchor="end" fill="#4C8316">w:</text>
    <rect x="140" y="594" width="90" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="185" y="611" class="ct" text-anchor="middle" fill="#4C8316">0.0000</text>
    <text x="235" y="612" class="arw" text-anchor="middle">→</text>
    <rect x="240" y="594" width="90" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="285" y="611" class="ct" text-anchor="middle" fill="#4C8316">0.8000</text>
    <text x="335" y="612" class="arw" text-anchor="middle">→</text>
    <rect x="340" y="594" width="90" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="385" y="611" class="ct" text-anchor="middle" fill="#4C8316">1.2000</text>
    <text x="435" y="612" class="arw" text-anchor="middle">→</text>
    <rect x="440" y="594" width="90" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="485" y="611" class="ct" text-anchor="middle" fill="#4C8316">1.4000</text>
    <text x="535" y="612" class="arw" text-anchor="middle">→</text>
    <rect x="540" y="594" width="90" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="585" y="611" class="ct" text-anchor="middle" fill="#4C8316">1.5000</text>
    <text x="128" y="644" class="lab" text-anchor="end" fill="#8C7106">L:</text>
    <rect x="140" y="626" width="90" height="26" rx="2" class="cell" fill="#FFF7DF" stroke="#C29E08"/>
    <text x="185" y="643" class="ct" text-anchor="middle" fill="#8C7106">6.5000</text>
    <rect x="240" y="626" width="90" height="26" rx="2" class="cell" fill="#FFF7DF" stroke="#C29E08"/>
    <text x="285" y="643" class="ct" text-anchor="middle" fill="#8C7106">1.7000</text>
    <rect x="340" y="626" width="90" height="26" rx="2" class="cell" fill="#FFF7DF" stroke="#C29E08"/>
    <text x="385" y="643" class="ct" text-anchor="middle" fill="#8C7106">0.5000</text>
    <rect x="440" y="626" width="90" height="26" rx="2" class="cell" fill="#FFF7DF" stroke="#C29E08"/>
    <text x="485" y="643" class="ct" text-anchor="middle" fill="#8C7106">0.2000</text>
    <rect x="540" y="626" width="90" height="26" rx="2" class="cell" fill="#FFF7DF" stroke="#C29E08"/>
    <text x="585" y="643" class="ct" text-anchor="middle" fill="#8C7106">0.1250</text>
    <text x="140" y="682" class="note">Те же четыре формулы, новое значение w — и так до сходимости.</text>
  </g>

  <g data-key="batch" data-only="1">
    <rect x="134" y="94" width="254" height="64" rx="4" class="hl"/>
    <text x="700" y="594" class="note">Здесь в сумме два слагаемых. Если объектов миллионы,</text>
    <text x="700" y="618" class="note">сумму считают по случайной подвыборке — мини-батчу.</text>
    <text x="700" y="642" class="note">Формулы те же, меняется только набор слагаемых.</text>
  </g>

  <text x="40" y="712" class="legend">серый — данные · синий — обучаемый параметр · жёлтый — η и потери · зелёный — вычисленное на этой итерации · красный — градиент</text>
  <rect x="40" y="424" width="1160" height="140" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="450" class="panel-label">подстановка чисел на этом шаге</text>
  <g data-key="cf1" data-only="1"><foreignObject x="62" y="466" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\hat{y}_i = w\,x_i, \qquad L = \tfrac{1}{n}\sum_{i=1}^{n}\bigl(y_i - \hat{y}_i\bigr)^2, \qquad \nabla L = \tfrac{1}{n}\sum_{i=1}^{n} -2x_i\bigl(y_i - \hat{y}_i\bigr)"></div></foreignObject></g>
  <g data-key="cf2" data-only="1"><foreignObject x="62" y="466" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\hat{y} = \bigl(w x_1,\ w x_2\bigr) = \bigl(0\cdot 1,\ 0\cdot 2\bigr) = (0,\ 0)"></div></foreignObject></g>
  <g data-key="cf3" data-only="1"><foreignObject x="62" y="466" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L = \tfrac{1}{2}\Bigl[(2 - 0)^2 + (3 - 0)^2\Bigr] = \tfrac{1}{2}\bigl[4 + 9\bigr] = 6.5"></div></foreignObject></g>
  <g data-key="cf4" data-only="1"><foreignObject x="62" y="466" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\nabla L = \tfrac{1}{2}\Bigl[-2\cdot 1\cdot(2 - 0) \;-\; 2\cdot 2\cdot(3 - 0)\Bigr] = \tfrac{1}{2}\bigl[-4 - 12\bigr] = -8"></div></foreignObject></g>
  <g data-key="cf5" data-only="1"><foreignObject x="62" y="466" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="w \leftarrow w - \eta\,\nabla L = 0 - 0.1\cdot(-8) = 0.8"></div></foreignObject></g>
  <g data-key="cf6" data-only="1"><foreignObject x="62" y="466" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="w_2 = 1.2, \quad w_3 = 1.4, \quad w_4 = 1.5 \qquad L:\ 6.5 \rightarrow 1.7 \rightarrow 0.5 \rightarrow 0.2 \rightarrow 0.125"></div></foreignObject></g>
  <g data-key="cf7" data-only="1"><foreignObject x="62" y="466" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\nabla L \approx \frac{1}{|B|}\sum_{i \in B} -2x_i\bigl(y_i - \hat{y}_i\bigr), \qquad B \subset \{1, \dots, n\} \quad \text{— случайный мини-батч}"></div></foreignObject></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="dat pAe pBe pCe pDe cf1" data-focus="dat">
      <div class="step-kicker">Шаг 1 · что лежит на столе</div>
      <h4>Два вектора данных, один параметр и одна настройка</h4>
      <p>Серые клетки — выборка, её трогать нельзя. Синяя клетка — единственное,
      что меняется в ходе обучения. Жёлтая <span class="math-inline" data-tex="\eta"></span> —
      настройка, которую выбирает человек. Справа четыре пустые клетки: их и предстоит
      заполнить.</p>
    </div>
    <div class="step-panel" data-on="dat pA pBe pCe pDe cf2" data-focus="pA">
      <div class="step-kicker">Шаг 2 · прямой проход</div>
      <h4>Первая формула превращает данные в предсказания</h4>
      <p>При <code>w = 0</code> модель умножает каждый вход на ноль:
      <code>0·1 = 0</code> и <code>0·2 = 0</code>. Форма сохраняется — сколько
      объектов на входе, столько предсказаний на выходе.</p>
    </div>
    <div class="step-panel" data-on="dat pA pB pCe pDe cf3" data-focus="pB">
      <div class="step-kicker">Шаг 3 · оценка</div>
      <h4>Вторая формула сворачивает вектор в одно число</h4>
      <p>Разности <code>2 − 0</code> и <code>3 − 0</code> возводятся в квадрат и
      усредняются: <code>½(4 + 9) = 6.5</code>. Это единственное место в цикле, где
      размерность падает до скаляра.</p>
      </div>
    <div class="step-panel" data-on="dat pA pB pC pDe cf4" data-focus="pC">
      <div class="step-kicker">Шаг 4 · градиент</div>
      <h4>Третья формула — производная той же суммы</h4>
      <p>Каждое слагаемое даёт <code>−2x(y − ŷ)</code>:
      <code>−2·1·2 = −4</code> и <code>−2·2·3 = −12</code>, среднее равно −8.
      Признак <code>x</code> входит множителем — параметр при большем признаке
      получает и больший градиент.</p>
      </div>
    <div class="step-panel" data-on="dat pA pB pC pD cf5" data-focus="pD">
      <div class="step-kicker">Шаг 5 · обновление</div>
      <h4>Четвёртая формула — единственная, которая меняет модель</h4>
      <p><code>w = 0 − 0.1·(−8) = 0.8</code>. Всё остальное в цикле было
      вычислениями: данные не изменились, потери и градиент — промежуточные
      величины. После этой строки синяя клетка слева становится равной 0.8.</p>
    </div>
    <div class="step-panel" data-on="dat pA pB pC pD loop cf6" data-focus="loop">
      <div class="step-kicker">Шаг 6 · повтор</div>
      <h4>Цикл прокручивается заново с новым w</h4>
      <p>0.8 → 1.2 → 1.4 → 1.5, а потери 6.5 → 1.7 → 0.5 → 0.2 → 0.125. Один полный
      проход по всей выборке называют <strong>эпохой</strong>; здесь выборка из двух
      объектов, поэтому итерация и эпоха совпадают.</p>
    </div>
    <div class="step-panel" data-on="dat pA pB pC pD loop batch cf7" data-focus="batch">
      <div class="step-kicker">Шаг 7 · где появляется случайность</div>
      <h4>Сумма по всей выборке — самая дорогая часть</h4>
      <p>Во второй и третьей формулах стоит сумма по всем объектам: каждая итерация
      читает весь датасет. При миллионах объектов сумму считают по случайному
      <strong>мини-батчу</strong> — формулы остаются теми же, меняется только
      набор слагаемых.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### Стохастический спуск: дешевле шаг, шумнее путь

<p>
  <strong>Стохастический градиентный спуск</strong> (SGD) считает градиент не по всей
  выборке, а по одному объекту (или небольшому батчу) и сразу делает шаг. Цена
  итерации падает с <code>O(n)</code> до <code>O(1)</code>, а траектория становится
  дёрганой: каждый объект тянет параметр в свою сторону. Возьмём наши два
  наблюдения по очереди, <span class="math-inline" data-tex="\eta = 0.1"></span>:
</p>

<table class="shape-table">
  <tr><th>Шаг</th><th>Объект</th><th>Градиент по одному объекту</th><th>w после шага</th></tr>
  <tr><td>1</td><td>(1, 2)</td><td><span class="math-inline" data-tex="-2\cdot 1\cdot(2 - 0) = -4"></span></td><td>0.400</td></tr>
  <tr><td>2</td><td>(2, 3)</td><td><span class="math-inline" data-tex="-2\cdot 2\cdot(3 - 0.4\cdot 2) = -8.8"></span></td><td>1.280</td></tr>
  <tr><td>3</td><td>(1, 2)</td><td><span class="math-inline" data-tex="-2\cdot 1\cdot(2 - 1.28) = -1.44"></span></td><td>1.424</td></tr>
  <tr><td>4</td><td>(2, 3)</td><td><span class="math-inline" data-tex="-2\cdot 2\cdot(3 - 2.848) = -0.608"></span></td><td>1.485</td></tr>
</table>

<p>
  За четыре дешёвых шага SGD подошёл к 1.485 — примерно туда же, куда полный спуск
  добрался за четыре дорогих. Но у шума есть цена: продолжив, мы увидим не
  сходимость в точку, а блуждание вокруг неё (1.52, 1.61, 1.52, 1.61 …). Ровно
  поэтому скорость обучения со временем уменьшают: шум надо гасить руками.
</p>

### Инерция: лекарство от узких долин

<p>
  Вернёмся к вытянутой долине из части 5. Проблема была не в скорости обучения, а в
  том, что градиент раз за разом указывает поперёк долины. <strong>Momentum</strong>
  копит скорость, как шарик, катящийся по склону: если несколько шагов подряд
  тянут в одну сторону, движение разгоняется, а колебания поперёк гасят друг друга.
</p>

<div class="math-display" data-tex="h_t = \alpha\,h_{t-1} + \eta\,\nabla L(w_{t-1}), \qquad w_t = w_{t-1} - h_t"></div>

<p>
  На нашей карте высот с <span class="math-inline" data-tex="\alpha = 0.9"></span>
  и той же <span class="math-inline" data-tex="\eta = 0.1"></span> спуск доходит до
  окрестности <code>(1, 1)</code> примерно за 48 итераций вместо 237 — почти в пять
  раз быстрее, хотя формула изменилась на одну строку.
</p>

<table class="shape-table">
  <tr><th>Метод</th><th>Чем считает градиент</th><th>Что добавляет</th><th>Где выигрывает</th></tr>
  <tr><td>Полный (batch) GD</td><td>вся выборка</td><td>—</td><td>гладкая траектория, но дорогой шаг</td></tr>
  <tr><td>SGD / мини-батч</td><td>один объект или батч</td><td>шум</td><td>дешёвый шаг, выбирается из мелких ям</td></tr>
  <tr><td>Momentum</td><td>батч</td><td>инерция <span class="math-inline" data-tex="\alpha"></span></td><td>вытянутые долины, плато</td></tr>
  <tr><td>Nesterov</td><td>батч</td><td>градиент в точке «после инерции»</td><td>тот же разгон, меньше перелёты</td></tr>
  <tr><td>RMSprop / Adam</td><td>батч</td><td>своя <span class="math-inline" data-tex="\eta"></span> для каждого параметра</td><td>разномасштабные параметры — база для нейросетей</td></tr>
</table>

<div class="callout-blue">
  <strong>Что общего у всех строк таблицы:</strong> ни одна из них не меняет
  ни функцию потерь, ни способ вычисления градиента. Меняется только правило, по
  которому из градиента получается шаг. Поэтому всё, что вы поняли про
  <span class="math-inline" data-tex="w \leftarrow w - \eta\nabla L"></span>, остаётся
  верным и для Adam.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обучение — это замкнутый цикл
  «предсказать → оценить → продифференцировать → шагнуть», и параметры меняются
  ровно в одной его точке. Все модификации спуска живут внутри этой одной строки.
</div>

---

## Часть 7. Логистическая регрессия: другая ошибка, тот же спуск

<p>
  Поменяем задачу: теперь ответ не число, а класс — 0 или 1. Модель должна выдавать
  вероятность, а вероятность обязана лежать между нулём и единицей. Линейная
  комбинация <span class="math-inline" data-tex="z = w\cdot x"></span> этого не
  обещает, поэтому её пропускают через <strong>сигмоиду</strong>:
</p>

<div class="math-display" data-tex="p = \mathbb{P}(y = 1 \mid x) = \sigma(z) = \frac{1}{1 + e^{-z}}"></div>

<p>
  Квадратичная ошибка здесь работает плохо, вместо неё берут
  <strong>логистическую функцию потерь</strong> — она штрафует уверенную ошибку
  бесконечно сильно:
</p>

<div class="math-display" data-tex="\text{logloss} = -\bigl[y\ln p + (1-y)\ln(1-p)\bigr]"></div>

<p>
  Аналитического решения у этой задачи нет — приравнять производную к нулю и решить
  уравнение не получится. Градиентный спуск же не замечает разницы: ему нужна
  только производная. Возьмём один объект: <code>x = −5</code>, правильный ответ
  <code>y = 1</code>, текущий вес <code>w = 1</code> и скорость обучения
  <span class="math-inline" data-tex="\gamma = 0.01"></span>.
</p>

<div class="stage" id="stageLogit" tabindex="0">
  <div class="stage-figure">
<svg id="lg" viewBox="0 0 960 620" role="img" aria-label="Формулы логистической регрессии: прямой проход, цепочка производных и шаг спуска">
  <style>
    #lg { font-family: Helvetica, Arial, sans-serif; }
    #lg .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.7; }
    #lg .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.7; }
    #lg .br  { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.7; }
    #lg .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.7; }
    #lg .ttl { font-size: 15px; fill: #111111; font-weight: 700; }
    #lg .cap { font-size: 13px; fill: #8A8378; }
    #lg .edge{ stroke: #5E5850; stroke-width: 1.6; fill: none; }
    #lg .bak { stroke: #C30B0A; stroke-width: 2; fill: none; }
    #lg .ax  { stroke: #5E5850; stroke-width: 1.3; }
    #lg .cv  { stroke: #3576C0; stroke-width: 2.4; fill: none; }
    #lg .grid{ stroke: #E5E1D8; stroke-width: 1; }
    #lg .tick{ font-size: 13px; fill: #8A8378; }
    #lg .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #lg .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="lg-aw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="lg-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text x="40" y="34" class="ttl">Логистическая регрессия в формулах: вперёд — предсказание, назад — производные</text>

  <g data-key="fx">
    <rect x="40" y="70" width="150" height="66" rx="9" class="bx"/>
    <text x="115" y="92" class="cap" text-anchor="middle">объект</text>
    <foreignObject x="48" y="96" width="134" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="x,\ y \in \{0, 1\}"></div></foreignObject>
  </g>

  <g data-key="fz">
    <line x1="190" y1="103" x2="234" y2="103" class="edge" marker-end="url(#lg-aw)"/>
    <rect x="240" y="70" width="160" height="66" rx="9" class="bx"/>
    <text x="320" y="92" class="cap" text-anchor="middle">логит</text>
    <foreignObject x="248" y="96" width="144" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="z = w\,x"></div></foreignObject>
  </g>

  <g data-key="fp">
    <line x1="400" y1="103" x2="444" y2="103" class="edge" marker-end="url(#lg-aw)"/>
    <rect x="450" y="70" width="170" height="66" rx="9" class="by"/>
    <text x="535" y="92" class="cap" text-anchor="middle">вероятность</text>
    <foreignObject x="458" y="96" width="154" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="p = \sigma(z) = \tfrac{1}{1 + e^{-z}}"></div></foreignObject>
  </g>

  <g data-key="fl">
    <line x1="620" y1="103" x2="664" y2="103" class="edge" marker-end="url(#lg-aw)"/>
    <rect x="670" y="70" width="250" height="66" rx="9" class="br"/>
    <text x="795" y="92" class="cap" text-anchor="middle">log loss</text>
    <foreignObject x="678" y="96" width="234" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L = -\bigl[y\ln p + (1-y)\ln(1-p)\bigr]"></div></foreignObject>
  </g>

  <g data-key="b1">
    <line x1="880" y1="176" x2="630" y2="176" class="bak" marker-end="url(#lg-ar)"/>
    <foreignObject x="640" y="150" width="250" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\partial L / \partial p"></div></foreignObject>
  </g>

  <g data-key="b2">
    <line x1="610" y1="176" x2="410" y2="176" class="bak" marker-end="url(#lg-ar)"/>
    <foreignObject x="420" y="150" width="200" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\partial p / \partial z"></div></foreignObject>
  </g>

  <g data-key="b3">
    <line x1="390" y1="176" x2="190" y2="176" class="bak" marker-end="url(#lg-ar)"/>
    <foreignObject x="200" y="150" width="200" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\partial z / \partial w = x"></div></foreignObject>
  </g>

  <g data-key="grd">
    <rect x="500" y="230" width="420" height="70" rx="9" class="br"/>
    <text x="710" y="254" class="cap" text-anchor="middle">градиент по весу</text>
    <foreignObject x="510" y="258" width="400" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="\partial L / \partial w = (p - y)\,x"></div></foreignObject>
  </g>

  <g data-key="upd">
    <rect x="500" y="322" width="420" height="70" rx="9" class="bg"/>
    <text x="710" y="346" class="cap" text-anchor="middle">шаг спуска</text>
    <foreignObject x="510" y="350" width="400" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="w \leftarrow w - \gamma\,(p - y)\,x"></div></foreignObject>
  </g>

  <g data-key="sig">
    <line x1="60" y1="410" x2="466" y2="410" class="ax"/>
    <line x1="260" y1="418" x2="260" y2="230" class="ax"/>
    <line x1="60" y1="300" x2="460" y2="300" class="grid"/>
    <polyline class="cv" points="60.0,409.9 70.0,409.9 80.0,409.8 90.0,409.7 100.0,409.6 110.0,409.4 120.0,409.2 130.0,408.8 140.0,408.4 150.0,407.7 160.0,406.8 170.0,405.5 180.0,403.7 190.0,401.3 200.0,398.0 210.0,393.7 220.0,388.2 230.0,381.5 240.0,373.5 250.0,364.5 260.0,355.0 270.0,345.5 280.0,336.5 290.0,328.5 300.0,321.8 310.0,316.3 320.0,312.0 330.0,308.7 340.0,306.3 350.0,304.5 360.0,303.2 370.0,302.3 380.0,301.6 390.0,301.2 400.0,300.8 410.0,300.6 420.0,300.4 430.0,300.3 440.0,300.2 450.0,300.1 460.0,300.1"/>
    <text x="472" y="415" class="tick">z</text>
    <text x="52" y="296" class="tick" text-anchor="end">1</text>
    <text x="52" y="415" class="tick" text-anchor="end">0</text>
    <text x="60" y="240" class="cap">сигмоида: любое число → (0, 1)</text>
  </g>

  <g data-key="sat" data-only="1">
    <line x1="60" y1="404" x2="150" y2="404" class="bak"/>
    <line x1="370" y1="306" x2="460" y2="306" class="bak"/>
    <text x="70" y="434" class="cap">в хвостах наклон p(1 − p) почти нулевой — здесь шаги мельчают</text>
  </g>

  <rect x="40" y="450" width="880" height="140" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="476" class="panel-label">формула этого шага</text>
  <g data-key="gf1" data-only="1"><foreignObject x="62" y="490" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="z = w\,x"></div></foreignObject></g>
  <g data-key="gf2" data-only="1"><foreignObject x="62" y="484" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="p = \sigma(z) = \frac{1}{1 + e^{-z}} \in (0,\,1)"></div></foreignObject></g>
  <g data-key="gf3" data-only="1"><foreignObject x="62" y="490" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="L = -\bigl[y\ln p + (1-y)\ln(1-p)\bigr] \qquad (y = 1 \Rightarrow L = -\ln p)"></div></foreignObject></g>
  <g data-key="gf4" data-only="1"><foreignObject x="62" y="484" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\partial L}{\partial p} = -\frac{y}{p} + \frac{1-y}{1-p}, \qquad \frac{\partial p}{\partial z} = p\,(1-p)"></div></foreignObject></g>
  <g data-key="gf5" data-only="1"><foreignObject x="62" y="484" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\partial L}{\partial z} = \frac{\partial L}{\partial p}\cdot\frac{\partial p}{\partial z} = \left(-\frac{y}{p} + \frac{1-y}{1-p}\right)p(1-p) = p - y"></div></foreignObject></g>
  <g data-key="gf6" data-only="1"><foreignObject x="62" y="484" width="836" height="96"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\partial L}{\partial w} = \frac{\partial L}{\partial z}\cdot\frac{\partial z}{\partial w} = (p - y)\,x"></div></foreignObject></g>
  <g data-key="gf7" data-only="1"><foreignObject x="62" y="490" width="836" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-md" data-tex="w \leftarrow w - \gamma\,(p - y)\,x"></div></foreignObject></g>

  <text x="40" y="604" class="legend">синий — данные и линейная часть · жёлтый — вероятность · красный — потери и производные · зелёный — обновление веса</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="fx fz gf1" data-focus="fz">
      <div class="step-kicker">Шаг 1 · линейная часть</div>
      <h4>Сначала всё как в регрессии</h4>
      <p>Модель считает <code>z = w·x</code> — произвольное число, ещё не вероятность.
      Его называют логитом. На нашем объекте <code>x = −5</code> при <code>w = 1</code>
      получается <code>z = −5</code>.</p>
    </div>
    <div class="step-panel" data-on="fx fz fp sig gf2" data-focus="fp">
      <div class="step-kicker">Шаг 2 · сжатие в вероятность</div>
      <h4>Сигмоида переводит любое число в отрезок (0, 1)</h4>
      <p>Большие отрицательные <code>z</code> дают вероятность около нуля, большие
      положительные — около единицы. Для <code>z = −5</code>:
      <code>p = 1/(1 + e⁵) = 0.0067</code>, то есть модель почти уверена, что класс
      нулевой.</p>
    </div>
    <div class="step-panel" data-on="fx fz fp fl gf3" data-focus="fl">
      <div class="step-kicker">Шаг 3 · штраф</div>
      <h4>Уверенная ошибка стоит дорого</h4>
      <p>Верный ответ <code>y = 1</code>, поэтому от log loss остаётся только первое
      слагаемое: <code>−ln(0.0067) = 5.01</code>. Для сравнения: при
      <code>p = 0.5</code> штраф был бы всего <code>0.69</code>, а при
      <code>p = 0.99</code> — <code>0.01</code>.</p>
    </div>
    <div class="step-panel" data-on="fl fp b1 b2 gf4" data-focus="b1">
      <div class="step-kicker">Шаг 4 · обратный проход</div>
      <h4>Разбираем цепочку по звеньям</h4>
      <p>Потери зависят от веса через <code>p</code>, а <code>p</code> — через
      <code>z</code>. Первое звено при <code>y = 1</code> равно <code>−1/p</code> —
      на наших числах это <code>−149.4</code>. Второе, <code>p(1 − p)</code>,
      наоборот крошечное: <code>0.0066</code>.</p>
    </div>
    <div class="step-panel" data-on="fp fz b2 b3 gf5" data-focus="gf5">
      <div class="step-kicker">Шаг 5 · красивое сокращение</div>
      <h4>Произведение схлопывается в p − y</h4>
      <p>Гигантский множитель и микроскопический гасят друг друга — в общем виде
      остаётся ровно <code>p − y</code>. Проверка на числах:
      <code>−149.4 · 0.0066 = −0.9933</code>, и это в точности
      <code>0.0067 − 1</code>. Именно поэтому log loss и сигмоиду используют в паре.</p>
    </div>
    <div class="step-panel" data-on="fx b3 grd gf6" data-focus="grd">
      <div class="step-kicker">Шаг 6 · градиент по весу</div>
      <h4>Ошибка, умноженная на признак</h4>
      <p>Та же структура, что и в линейной регрессии. На наших числах:
      <code>(0.0067 − 1)·(−5) = +4.9665</code>. Знак плюс означает, что вес нужно
      уменьшать.</p>
    </div>
    <div class="step-panel" data-on="grd upd sig sat gf7" data-focus="upd">
      <div class="step-kicker">Шаг 7 · шаг и его размер</div>
      <h4>Насыщение делает первые шаги мелкими</h4>
      <p>При <code>γ = 0.01</code> получаем <code>w = 1 − 0.01·4.9665 = 0.9503</code>,
      и вероятность подрастает с 0.0067 до 0.0086. Мы стартовали в плоском хвосте
      сигмоиды, поэтому до <code>p &gt; 0.5</code> понадобится около 24 шагов.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-yellow">
  <strong>Подводный камень:</strong> насыщение сигмоиды. В плоских хвостах
  <span class="math-inline" data-tex="p(1-p)\approx 0"></span>, и градиент по
  <em>внутренним</em> параметрам почти исчезает. Для логистической регрессии это
  лечится сокращением в <span class="math-inline" data-tex="p - y"></span>, но в
  глубокой сети такие множители перемножаются слой за слоем — и получается
  затухающий градиент.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> при смене задачи меняются только формула
  предсказания и формула потерь. Спуск остаётся прежним:
  <span class="math-inline" data-tex="w \leftarrow w - \eta\,\partial L/\partial w"></span>,
  где производная снова оказывается произведением «ошибка × вход».
</div>

---

## Часть 8. Нейросеть: градиент даёт бэкпроп, шаг делает спуск

<p>
  У регрессии параметр был один, у логистической — тоже. У сети их сотни тысяч, и
  единственная новая трудность — <em>получить</em> градиент. Сам спуск не меняется
  ни на символ: та же формула, только применённая к каждому из параметров.
</p>

<p>
  Возьмём сеть 2-2-2 с сигмоидами — ту самую, что разбиралась в статье
  <a href="article.html?slug=backprop">«Обратное распространение ошибки: как читать сеть справа
  налево»</a>. Вход <code>(0.5, 0.8)</code>, цель <code>(1, 0)</code>, двенадцать
  параметров: восемь весов и четыре смещения. Бэкпроп там довёл дело до градиентов —
  и остановился. Сейчас мы сделаем следующий шаг, буквально.
</p>

<div class="callout-blue">
  <strong>Разделение труда:</strong> бэкпроп — это <em>способ вычислить</em>
  <span class="math-inline" data-tex="\nabla E"></span> за один обратный проход
  вместо миллиона отдельных дифференцирований. Градиентный спуск — это
  <em>что делать</em> с полученным вектором. Они независимы: тот же бэкпроп
  кормит и SGD, и Adam.
</div>

### Что именно здесь минимизируется

<p>
  В части 1 мы выписали функцию потерь целиком, подставили в неё данные и увидели,
  что от выборки остались три числа, а от задачи — парабола
  <span class="math-inline" data-tex="L(w) = 2.5\,w^2 - 8w + 6.5"></span>. Прежде
  чем считать градиенты сети, сделаем ровно то же самое: выпишем функцию, значение
  которой мы собираемся уменьшать, и посмотрим, что от неё останется после
  подстановки данных.
</p>

<p>
  Модель — два слоя с сигмоидами, поэтому предсказание записывается одной строкой:
</p>

<div class="math-display" data-tex="\hat{y} = \sigma\!\left(W^{(2)}\sigma\!\left(W^{(1)}x + b^{(1)}\right) + b^{(2)}\right)"></div>

<p>
  Ошибка на одном объекте — половина квадрата длины вектора промаха. Половина здесь
  та же самая, что в части 1: она нужна только чтобы двойка сократилась при
  дифференцировании.
</p>

<div class="math-display" data-tex="E(\theta) = \tfrac{1}{2}\bigl\|\hat{y} - y\bigr\|^2 = \tfrac{1}{2}\Bigl[\bigl(\hat{y}_1 - y_1\bigr)^2 + \bigl(\hat{y}_2 - y_2\bigr)^2\Bigr]"></div>

<p>
  Буква <span class="math-inline" data-tex="\theta"></span> — это сокращение для
  всех параметров сразу: <span class="math-inline" data-tex="\theta = \bigl(W^{(1)}, b^{(1)}, W^{(2)}, b^{(2)}\bigr)"></span>,
  двенадцать чисел. Раскроем запись по индексам, слой за слоем:
</p>

<div class="math-display" data-tex="a_1 = \sigma\bigl(w^{(1)}_{11}x_1 + w^{(1)}_{12}x_2 + b^{(1)}_1\bigr), \qquad a_2 = \sigma\bigl(w^{(1)}_{21}x_1 + w^{(1)}_{22}x_2 + b^{(1)}_2\bigr)"></div>

<div class="math-display" data-tex="\hat{y}_1 = \sigma\bigl(w^{(2)}_{11}a_1 + w^{(2)}_{12}a_2 + b^{(2)}_1\bigr), \qquad \hat{y}_2 = \sigma\bigl(w^{(2)}_{21}a_1 + w^{(2)}_{22}a_2 + b^{(2)}_2\bigr)"></div>

<p>
  И подставляем наш единственный объект — <span class="math-inline" data-tex="x = (0.5,\ 0.8)"></span>,
  <span class="math-inline" data-tex="y = (1,\ 0)"></span>. Данные уходят внутрь
  формулы и больше нигде не появляются:
</p>

<div class="math-display" data-tex="E(\theta) = \tfrac{1}{2}\Bigl[\Bigl(\sigma\bigl(w^{(2)}_{11}\,\sigma(0.5\,w^{(1)}_{11} + 0.8\,w^{(1)}_{12} + b^{(1)}_1) + w^{(2)}_{12}\,\sigma(0.5\,w^{(1)}_{21} + 0.8\,w^{(1)}_{22} + b^{(1)}_2) + b^{(2)}_1\bigr) - 1\Bigr)^2 + \Bigl(\sigma\bigl(w^{(2)}_{21}\,\sigma(0.5\,w^{(1)}_{11} + 0.8\,w^{(1)}_{12} + b^{(1)}_1) + w^{(2)}_{22}\,\sigma(0.5\,w^{(1)}_{21} + 0.8\,w^{(1)}_{22} + b^{(1)}_2) + b^{(2)}_2\bigr) - 0\Bigr)^2\Bigr]"></div>

<p>
  Формула длинная, но устроена она так же, как парабола из части 1: слева — имя
  функции, справа — выражение, в котором нет ничего, кроме двенадцати параметров и
  чисел. Подставьте в него любые двенадцать значений — получите одно число. Это и
  есть тот функционал, который спуск уменьшает.
</p>

<div class="callout-blue">
  <strong>Про слово «функционал».</strong> Строго говоря, перед нами обычная
  функция двенадцати переменных, а функционал — это отображение из пространства
  функций в число. В русскоязычной традиции машинного обучения за
  <span class="math-inline" data-tex="E(\theta)"></span> закрепилось название
  «функционал качества», и путаницы оно не создаёт: важно, что аргументы у него —
  параметры, а не данные.
</div>

<p>
  А вот чем эта функция отличается от параболы:
</p>

<table class="shape-table">
  <tr><th></th><th>Часть 1: регрессия</th><th>Часть 8: сеть 2-2-2</th></tr>
  <tr><td>Сколько аргументов</td><td>1 (<code>w</code>)</td><td>12</td></tr>
  <tr><td>Что осталось после подстановки данных</td><td><span class="math-inline" data-tex="2.5\,w^2 - 8w + 6.5"></span></td><td>сигмоида от сигмоиды, дважды</td></tr>
  <tr><td>Уравнение <span class="math-inline" data-tex="\nabla E = 0"></span></td><td>линейное, решается в строчку</td><td>12 нелинейных уравнений, общего решения нет</td></tr>
  <tr><td>Форма графика</td><td>парабола с дном</td><td>плато — обрыв — плато, дно на бесконечности</td></tr>
  <tr><td>Как искать минимум</td><td>можно точно, можно спуском</td><td>только спуском</td></tr>
</table>

<p>
  Последняя строка таблицы — не общие слова: её видно на срезе. Двенадцать
  измерений нарисовать нельзя, но можно зафиксировать одиннадцать параметров и
  посмотреть, как <span class="math-inline" data-tex="E"></span> зависит от
  двенадцатого. Посмотрим пошагово.
</p>

<div class="stage" id="stageFunc" tabindex="0">
  <div class="stage-figure">
<svg id="fn" viewBox="0 0 960 620" role="img" aria-label="Слева данные и двенадцать параметров, дающие одно число потерь, справа два среза функции потерь вдоль отдельных параметров">
  <style>
    #fn { font-family: Helvetica, Arial, sans-serif; }
    #fn .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #fn .ttl  { font-size: 13px; fill: #8A8378; letter-spacing: 0.06em; }
    #fn .cap  { font-size: 13px; fill: #5E5850; }
    #fn .tick { font-size: 13px; fill: #8A8378; }
    #fn .nl   { font-size: 16px; fill: #111111; }
    #fn .lab  { font-size: 13px; font-weight: 600; fill: #8C7106; }
    #fn .ct   { font-size: 13px; font-weight: 600; fill: #8C7106; }
    #fn .cellp{ fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.2; }
    #fn .cv   { stroke: #C29E08; stroke-width: 2.4; fill: none; }
    #fn .cv2  { stroke: #C29E08; stroke-width: 2.2; fill: none; stroke-dasharray: 6 4; }
    #fn .dash { stroke: #B9B2A6; stroke-width: 1.3; fill: none; stroke-dasharray: 5 4; }
    #fn .tan  { stroke: #C30B0A; stroke-width: 2.4; fill: none; }
    #fn .rn   { font-size: 13px; fill: #A30908; }
    #fn .dot  { fill: #C29E08; }
    #fn .ring { fill: none; stroke: #C30B0A; stroke-width: 2.4; }
    #fn .div  { stroke: #E5E1D8; stroke-width: 1.4; }
    #fn .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #fn .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="fn-aw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text x="250" y="72" class="ttl" text-anchor="middle">ИЗ ДВЕНАДЦАТИ ЧИСЕЛ — ОДНО</text>
  <text x="720" y="72" class="ttl" text-anchor="middle">СРЕЗ ВДОЛЬ ОДНОГО ПАРАМЕТРА</text>
  <line x1="487" y1="56" x2="487" y2="440" class="div"/>

  <g data-key="dat">
    <rect x="40" y="88" width="420" height="62" rx="10" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/>
    <text x="62" y="112" class="cap">данные зафиксированы — их менять нельзя</text>
    <text x="62" y="138" class="nl">x = (0.5, 0.8)     y = (1, 0)</text>
  </g>

  <g data-key="par">
    <rect x="40" y="168" width="420" height="182" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/>
    <text x="62" y="192" class="cap">двенадцать параметров — аргументы функции</text>
    <text x="96" y="230" class="lab" text-anchor="end">W⁽¹⁾</text>
    <rect x="104" y="206" width="52" height="26" rx="2" class="cellp"/>
    <text x="130" y="224" class="ct" text-anchor="middle">0.15</text>
    <rect x="156" y="206" width="52" height="26" rx="2" class="cellp"/>
    <text x="182" y="224" class="ct" text-anchor="middle">−0.20</text>
    <rect x="104" y="232" width="52" height="26" rx="2" class="cellp"/>
    <text x="130" y="250" class="ct" text-anchor="middle">0.40</text>
    <rect x="156" y="232" width="52" height="26" rx="2" class="cellp"/>
    <text x="182" y="250" class="ct" text-anchor="middle">0.30</text>
    <text x="252" y="230" class="lab" text-anchor="end">b⁽¹⁾</text>
    <rect x="260" y="206" width="52" height="26" rx="2" class="cellp"/>
    <text x="286" y="224" class="ct" text-anchor="middle">0.10</text>
    <rect x="260" y="232" width="52" height="26" rx="2" class="cellp"/>
    <text x="286" y="250" class="ct" text-anchor="middle">−0.10</text>
    <text x="96" y="298" class="lab" text-anchor="end">W⁽²⁾</text>
    <rect x="104" y="274" width="52" height="26" rx="2" class="cellp"/>
    <text x="130" y="292" class="ct" text-anchor="middle">0.50</text>
    <rect x="156" y="274" width="52" height="26" rx="2" class="cellp"/>
    <text x="182" y="292" class="ct" text-anchor="middle">−0.30</text>
    <rect x="104" y="300" width="52" height="26" rx="2" class="cellp"/>
    <text x="130" y="318" class="ct" text-anchor="middle">0.20</text>
    <rect x="156" y="300" width="52" height="26" rx="2" class="cellp"/>
    <text x="182" y="318" class="ct" text-anchor="middle">0.60</text>
    <text x="252" y="298" class="lab" text-anchor="end">b⁽²⁾</text>
    <rect x="260" y="274" width="52" height="26" rx="2" class="cellp"/>
    <text x="286" y="292" class="ct" text-anchor="middle">0.05</text>
    <rect x="260" y="300" width="52" height="26" rx="2" class="cellp"/>
    <text x="286" y="318" class="ct" text-anchor="middle">0.15</text>
    <text x="332" y="224" class="cap">8 весов</text>
    <text x="332" y="292" class="cap">4 смещения</text>
  </g>

  <g data-key="cell11" data-only="1">
    <rect x="100" y="270" width="60" height="34" rx="4" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
    <text x="332" y="338" class="rn">двигаем только эту клетку</text>
  </g>

  <g data-key="arr">
    <line x1="250" y1="352" x2="250" y2="374" class="ax" marker-end="url(#fn-aw)"/>
    <text x="266" y="368" class="cap">подставляем данные в формулу</text>
  </g>

  <g data-key="eval">
    <rect x="60" y="380" width="240" height="50" rx="10" fill="#F0FAF0" stroke="#73B222" stroke-width="1.7"/>
    <text x="180" y="411" class="nl" text-anchor="middle">E(θ) = 0.3183</text>
    <text x="312" y="411" class="cap">одно число</text>
  </g>

  <line x1="505" y1="96" x2="505" y2="394" class="ax"/>
  <line x1="500" y1="390" x2="938" y2="390" class="ax"/>
  <text x="505" y="88" class="tick" text-anchor="middle">E</text>
  <text x="520" y="409" class="tick" text-anchor="middle">−8</text>
  <text x="622" y="409" class="tick" text-anchor="middle">−4</text>
  <text x="725" y="409" class="tick" text-anchor="middle">0</text>
  <text x="827" y="409" class="tick" text-anchor="middle">+4</text>
  <text x="930" y="409" class="tick" text-anchor="middle">+8</text>
  <text x="498" y="389" class="tick" text-anchor="end">0.2</text>
  <text x="498" y="334" class="tick" text-anchor="end">0.3</text>
  <text x="498" y="279" class="tick" text-anchor="end">0.4</text>
  <text x="498" y="225" class="tick" text-anchor="end">0.5</text>
  <text x="498" y="170" class="tick" text-anchor="end">0.6</text>
  <text x="498" y="115" class="tick" text-anchor="end">0.7</text>
  <text x="725" y="432" class="tick" text-anchor="middle">на сколько сдвинули этот параметр от текущего значения</text>

  <g data-key="cw2">
    <polyline class="cv" points="520.0,116.9 525.1,118.0 530.2,119.2 535.4,120.6 540.5,122.0 545.6,123.6 550.8,125.4 555.9,127.3 561.0,129.4 566.1,131.6 571.2,134.1 576.4,136.8 581.5,139.8 586.6,143.0 591.8,146.4 596.9,150.1 602.0,154.2 607.1,158.5 612.2,163.1 617.4,168.1 622.5,173.4 627.6,179.0 632.8,185.0 637.9,191.3 643.0,197.9 648.1,204.8 653.2,212.0 658.4,219.5 663.5,227.2 668.6,235.0 673.8,243.1 678.9,251.2 684.0,259.3 689.1,267.5 694.2,275.6 699.4,283.5 704.5,291.3 709.6,298.9 714.8,306.2 719.9,313.2 725.0,319.8 730.1,326.0 735.2,331.8 740.4,337.3 745.5,342.2 750.6,346.8 755.8,350.9 760.9,354.7 766.0,358.0 771.1,361.0 776.2,363.6 781.4,365.9 786.5,367.9 791.6,369.7 796.8,371.2 801.9,372.6 807.0,373.7 812.1,374.7 817.2,375.5 822.4,376.2 827.5,376.8 832.6,377.3 837.8,377.7 842.9,378.1 848.0,378.4 853.1,378.6 858.2,378.8 863.4,379.0 868.5,379.1 873.6,379.2 878.8,379.3 883.9,379.4 889.0,379.5 894.1,379.6 899.2,379.6 904.4,379.6 909.5,379.7 914.6,379.7 919.8,379.7 924.9,379.7 930.0,379.7"/>
    <text x="596" y="196" class="lab">срез по w⁽²⁾₁₁</text>
  </g>

  <g data-key="plat" data-only="1">
    <line x1="520" y1="106.2" x2="930" y2="106.2" class="dash"/>
    <line x1="520" y1="379.8" x2="930" y2="379.8" class="dash"/>
    <text x="925" y="100" class="cap" text-anchor="end">верхнее плато 0.7086</text>
    <text x="925" y="373" class="cap" text-anchor="end">нижнее плато 0.2086</text>
  </g>

  <g data-key="pt0">
    <circle cx="725" cy="319.8" r="6" class="dot"/>
    <text x="736" y="302" class="cap">E = 0.3183</text>
  </g>

  <g data-key="tan" data-only="1">
    <line x1="684" y1="268.4" x2="766" y2="371.2" class="tan"/>
    <text x="676" y="262" class="rn" text-anchor="end">наклон среза −0.0588</text>
  </g>

  <g data-key="cw1">
    <polyline class="cv2" points="520.0,311.1 525.1,311.1 530.2,311.1 535.4,311.2 540.5,311.2 545.6,311.3 550.8,311.4 555.9,311.4 561.0,311.5 566.1,311.6 571.2,311.7 576.4,311.8 581.5,311.9 586.6,312.0 591.8,312.1 596.9,312.2 602.0,312.4 607.1,312.5 612.2,312.7 617.4,312.9 622.5,313.1 627.6,313.3 632.8,313.5 637.9,313.8 643.0,314.0 648.1,314.3 653.2,314.6 658.4,314.9 663.5,315.2 668.6,315.5 673.8,315.9 678.9,316.2 684.0,316.6 689.1,317.0 694.2,317.4 699.4,317.8 704.5,318.2 709.6,318.6 714.8,319.0 719.9,319.4 725.0,319.8 730.1,320.2 735.2,320.6 740.4,320.9 745.5,321.3 750.6,321.6 755.8,322.0 760.9,322.3 766.0,322.6 771.1,322.9 776.2,323.2 781.4,323.4 786.5,323.6 791.6,323.9 796.8,324.1 801.9,324.3 807.0,324.4 812.1,324.6 817.2,324.8 822.4,324.9 827.5,325.0 832.6,325.2 837.8,325.3 842.9,325.4 848.0,325.5 853.1,325.5 858.2,325.6 863.4,325.7 868.5,325.7 873.6,325.8 878.8,325.9 883.9,325.9 889.0,325.9 894.1,326.0 899.2,326.0 904.4,326.1 909.5,326.1 914.6,326.1 919.8,326.1 924.9,326.2 930.0,326.2"/>
    <text x="530" y="305" class="lab">срез по w⁽¹⁾₁₁</text>
  </g>

  <g data-key="corr" data-only="1">
    <line x1="520" y1="310.7" x2="930" y2="310.7" class="dash"/>
    <line x1="520" y1="326.4" x2="930" y2="326.4" class="dash"/>
    <text x="530" y="345" class="cap">весь размах этого среза — 0.029</text>
  </g>

  <text x="40" y="604" class="legend">синий — данные · жёлтый — параметры и срезы функции · зелёный — итоговое число · красный — наклон и выбранный параметр</text>
  <rect x="40" y="450" width="880" height="130" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="476" class="panel-label">формула этого шага</text>
  <g data-key="f1" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="x = (0.5,\ 0.8), \qquad y = (1,\ 0) \qquad \text{— это не аргументы, это константы}"></div></foreignObject></g>
  <g data-key="f2" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\theta = \bigl(W^{(1)},\, b^{(1)},\, W^{(2)},\, b^{(2)}\bigr) \qquad \text{— 12 чисел, и только они аргументы } E"></div></foreignObject></g>
  <g data-key="f3" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="a_1 = \sigma\bigl(0.5\,w^{(1)}_{11} + 0.8\,w^{(1)}_{12} + b^{(1)}_1\bigr), \qquad a_2 = \sigma\bigl(0.5\,w^{(1)}_{21} + 0.8\,w^{(1)}_{22} + b^{(1)}_2\bigr)"></div></foreignObject></g>
  <g data-key="f4" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="E(\theta) = \tfrac{1}{2}\Bigl[\bigl(\sigma(w^{(2)}_{11}a_1 + w^{(2)}_{12}a_2 + b^{(2)}_1) - 1\bigr)^2 + \bigl(\sigma(w^{(2)}_{21}a_1 + w^{(2)}_{22}a_2 + b^{(2)}_2) - 0\bigr)^2\Bigr]"></div></foreignObject></g>
  <g data-key="f5" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="E(0.15,\, -0.20,\, 0.40,\, 0.30,\, 0.10,\, -0.10,\, 0.50,\, -0.30,\, 0.20,\, 0.60,\, 0.05,\, 0.15) = 0.3183"></div></foreignObject></g>
  <g data-key="f6" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="E \to 0.7086 \ \ \text{при } w^{(2)}_{11} \to -\infty, \qquad E \to 0.2086 \ \ \text{при } w^{(2)}_{11} \to +\infty"></div></foreignObject></g>
  <g data-key="f7" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\partial E}{\partial w^{(2)}_{11}} = -0.0588 \qquad \text{— наклон этого среза в текущей точке}"></div></foreignObject></g>
  <g data-key="f8" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\partial E}{\partial w^{(1)}_{11}} = -0.0036, \qquad \text{размах среза } 0.3349 - 0.3063 = 0.0286"></div></foreignObject></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="dat f1" data-focus="dat">
      <div class="step-kicker">Шаг 1 · что дано</div>
      <h4>Один объект — и он не двигается</h4>
      <p>Вход <code>(0.5, 0.8)</code> и цель <code>(1, 0)</code> зафиксированы, как
      две точки в части 1. В функции потерь они будут константами: 0.5, 0.8, 1 и 0
      просто окажутся вписаны в формулу.</p>
    </div>
    <div class="step-panel" data-on="dat par f2" data-focus="par">
      <div class="step-kicker">Шаг 2 · что можно крутить</div>
      <h4>Двенадцать чисел — вот они целиком</h4>
      <p>Восемь весов и четыре смещения. Именно они — аргументы функции потерь:
      подставили двенадцать значений, получили одно число. У регрессии из части 1
      такой аргумент был ровно один.</p>
    </div>
    <div class="step-panel" data-on="dat par arr f3" data-focus="arr">
      <div class="step-kicker">Шаг 3 · подстановка</div>
      <h4>Данные исчезают внутрь формулы</h4>
      <p>Сумматор первого слоя превращается в
      <code>σ(0.5·w⁽¹⁾₁₁ + 0.8·w⁽¹⁾₁₂ + b⁽¹⁾₁)</code>: 0.5 и 0.8 больше нигде не
      понадобятся, они стали коэффициентами. Так же цель <code>(1, 0)</code>
      вписывается в скобки квадратов.</p>
    </div>
    <div class="step-panel" data-on="dat par arr eval f4" data-focus="eval">
      <div class="step-kicker">Шаг 4 · функционал целиком</div>
      <h4>На выходе — одно число, и это судья</h4>
      <p>Вся конструкция сворачивается в <code>E(θ) = 0.3183</code>. Это ровно те же
      потери, что в основной сцене части 8, только теперь видно, что стоит за
      числом: функция двенадцати переменных с двумя вложенными сигмоидами.</p>
    </div>
    <div class="step-panel" data-on="par cell11 eval cw2 pt0 f5" data-focus="cw2">
      <div class="step-kicker">Шаг 5 · срез</div>
      <h4>Держим одиннадцать, двигаем один</h4>
      <p>Двенадцатимерный график не нарисовать, зато можно взять один вес —
      <code>w⁽²⁾₁₁</code> — и менять только его. По горизонтали отложено, на сколько
      мы его сдвинули; жёлтая точка при нуле — те самые 0.3183.</p>
    </div>
    <div class="step-panel" data-on="par cell11 cw2 pt0 plat f6" data-focus="plat">
      <div class="step-kicker">Шаг 6 · это не парабола</div>
      <h4>Два плато и никакого дна</h4>
      <p>Слева кривая упирается в 0.7086, справа — в 0.2086, и нигде не
      разворачивается вверх. Минимума в конечной точке просто нет, а до нуля этот
      срез не доходит: 0.2086 — вклад второго выхода, на который данный вес не
      влияет вообще.</p>
    </div>
    <div class="step-panel" data-on="par cell11 cw2 pt0 tan f7" data-focus="tan">
      <div class="step-kicker">Шаг 7 · наклон</div>
      <h4>Производная по весу — это наклон среза</h4>
      <p>Касательная в текущей точке идёт вниз с наклоном <code>−0.0588</code>. Это
      не новое понятие: то же самое, что <code>L′(w)</code> из части 2, только
      функция теперь двенадцатимерная. Это же число выдаст бэкпроп в следующей
      сцене.</p>
    </div>
    <div class="step-panel" data-on="cw2 pt0 cw1 corr f8" data-focus="cw1">
      <div class="step-kicker">Шаг 8 · остальные одиннадцать</div>
      <h4>У каждого параметра свой срез, и они очень разные</h4>
      <p>Срез по весу первого слоя <code>w⁽¹⁾₁₁</code> почти горизонтален: сдвиньте
      этот вес хоть на бесконечность — потери изменятся всего на 0.029, а наклон
      здесь <code>−0.0036</code>, в 16 раз мельче. Двенадцать таких наклонов,
      собранных в вектор, и есть <code>∇E</code>.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<div class="callout-red">
  <strong>Почему точный метод здесь не работает.</strong> В части 1 мы решили
  <span class="math-inline" data-tex="L'(w) = 5w - 8 = 0"></span> в одну строчку.
  Здесь <span class="math-inline" data-tex="\nabla E = 0"></span> — это система из
  двенадцати уравнений, в каждом из которых сигмоида от сигмоиды. Общего способа
  её решить нет, а у срезов, как видно на сцене, дно вообще уезжает на
  бесконечность. Остаётся идти вниз по наклону — то есть спуск.
</div>

### А если объектов не один, а много?

<p>
  Меняется ровно одно место — количество слагаемых, как и в части 1. Функция потерь
  по выборке из <span class="math-inline" data-tex="n"></span> объектов усредняет
  ошибку по объектам, а зависимость от параметров у каждого слагаемого своя:
</p>

<div class="math-display" data-tex="E(\theta) = \frac{1}{n}\sum_{i=1}^{n} \tfrac{1}{2}\bigl\|\hat{y}(x_i;\theta) - y_i\bigr\|^2 = \frac{1}{n}\Bigl[E_1(\theta) + E_2(\theta) + \dots + E_n(\theta)\Bigr]"></div>

<p>
  Здесь <span class="math-inline" data-tex="E_i(\theta)"></span> — та самая длинная
  формула с двенадцатью параметрами, в которую подставлен
  <span class="math-inline" data-tex="i"></span>-й объект. Аргументы у всех слагаемых
  общие: сеть одна, параметров по-прежнему двенадцать. Растёт не размерность, а
  количество слагаемых.
</p>

<p>
  Отсюда сразу следует главное свойство: производная суммы — сумма производных,
  поэтому
</p>

<div class="math-display" data-tex="\nabla E(\theta) = \frac{1}{n}\sum_{i=1}^{n} \nabla E_i(\theta)"></div>

<p>
  То есть бэкпроп из следующей сцены не нужно переизобретать под выборку: он
  считает <span class="math-inline" data-tex="\nabla E_i"></span> для одного объекта,
  а по батчу результаты просто усредняются. Возьмём второй объект и посмотрим, что
  из этого получается.
</p>

<div class="stage" id="stageBatch" tabindex="0">
  <div class="stage-figure">
<svg id="bt" viewBox="0 0 960 620" role="img" aria-label="Слева два объекта и функционал батча, справа срезы потерь для каждого объекта и их среднее">
  <style>
    #bt { font-family: Helvetica, Arial, sans-serif; }
    #bt .ax   { stroke: #5E5850; stroke-width: 1.4; }
    #bt .ttl  { font-size: 13px; fill: #8A8378; letter-spacing: 0.06em; }
    #bt .cap  { font-size: 13px; fill: #5E5850; }
    #bt .tick { font-size: 13px; fill: #8A8378; }
    #bt .nl   { font-size: 16px; fill: #111111; }
    #bt .vl   { font-size: 13px; fill: #4C8316; }
    #bt .lab  { font-size: 13px; font-weight: 600; fill: #8C7106; }
    #bt .labb { font-size: 13px; font-weight: 700; fill: #4C8316; }
    #bt .cv   { stroke: #C29E08; stroke-width: 2; fill: none; stroke-dasharray: 6 4; }
    #bt .cvb  { stroke: #73B222; stroke-width: 3; fill: none; }
    #bt .link { stroke: #B9B2A6; stroke-width: 1.3; }
    #bt .dash { stroke: #73B222; stroke-width: 1.4; fill: none; stroke-dasharray: 5 4; }
    #bt .dot  { fill: #C29E08; }
    #bt .gdot { fill: #73B222; }
    #bt .ring { fill: none; stroke: #73B222; stroke-width: 2.6; }
    #bt .rn   { font-size: 13px; fill: #A30908; }
    #bt .div  { stroke: #E5E1D8; stroke-width: 1.4; }
    #bt .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #bt .legend { font-size: 13px; fill: #8A8378; }
  </style>

  <text x="250" y="72" class="ttl" text-anchor="middle">ДВА ОБЪЕКТА — ДВА СЛАГАЕМЫХ</text>
  <text x="715" y="72" class="ttl" text-anchor="middle">СРЕЗ ПО ТОМУ ЖЕ ВЕСУ w⁽²⁾₁₁</text>
  <line x1="470" y1="56" x2="470" y2="440" class="div"/>

  <g data-key="obj1">
    <rect x="40" y="88" width="400" height="88" rx="10" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/>
    <text x="62" y="112" class="cap">объект 1 — тот же, что во всей части</text>
    <text x="62" y="138" class="nl">x = (0.5, 0.8)   →   y = (1, 0)</text>
    <text x="62" y="162" class="vl">ŷ = (0.5316, 0.6459),   E₁ = 0.3183</text>
  </g>

  <g data-key="obj2">
    <rect x="40" y="192" width="400" height="88" rx="10" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/>
    <text x="62" y="216" class="cap">объект 2 — другая цель</text>
    <text x="62" y="242" class="nl">x = (0.9, 0.2)   →   y = (0, 1)</text>
    <text x="62" y="266" class="vl">ŷ = (0.5376, 0.6473),   E₂ = 0.2067</text>
  </g>

  <g data-key="bform">
    <rect x="40" y="298" width="400" height="76" rx="10" fill="#F0FAF0" stroke="#73B222" stroke-width="1.7"/>
    <text x="62" y="322" class="cap">функционал батча — среднее слагаемых</text>
    <text x="62" y="352" class="nl">E = ½(0.3183 + 0.2067) = 0.2625</text>
  </g>

  <text x="40" y="400" class="cap">параметры те же самые двенадцать — общие для обоих слагаемых</text>

  <line x1="490" y1="106" x2="490" y2="394" class="ax"/>
  <line x1="485" y1="390" x2="938" y2="390" class="ax"/>
  <text x="490" y="98" class="tick" text-anchor="middle">E</text>
  <text x="505" y="409" class="tick" text-anchor="middle">−8</text>
  <text x="610" y="409" class="tick" text-anchor="middle">−4</text>
  <text x="715" y="409" class="tick" text-anchor="middle">0</text>
  <text x="820" y="409" class="tick" text-anchor="middle">+4</text>
  <text x="925" y="409" class="tick" text-anchor="middle">+8</text>
  <text x="483" y="371" class="tick" text-anchor="end">0.1</text>
  <text x="483" y="331" class="tick" text-anchor="end">0.2</text>
  <text x="483" y="291" class="tick" text-anchor="end">0.3</text>
  <text x="483" y="251" class="tick" text-anchor="end">0.4</text>
  <text x="483" y="211" class="tick" text-anchor="end">0.5</text>
  <text x="483" y="171" class="tick" text-anchor="end">0.6</text>
  <text x="483" y="131" class="tick" text-anchor="end">0.7</text>
  <text x="715" y="432" class="tick" text-anchor="middle">на сколько сдвинули вес w⁽²⁾₁₁ от текущего значения 0.5</text>

  <g data-key="c1">
    <polyline class="cv" points="505.0,130.4 510.2,131.2 515.5,132.1 520.8,133.0 526.0,134.1 531.2,135.3 536.5,136.5 541.8,137.9 547.0,139.5 552.2,141.1 557.5,142.9 562.8,144.9 568.0,147.1 573.2,149.4 578.5,151.9 583.8,154.7 589.0,157.6 594.2,160.8 599.5,164.2 604.8,167.8 610.0,171.7 615.2,175.8 620.5,180.1 625.8,184.7 631.0,189.6 636.2,194.6 641.5,199.9 646.8,205.3 652.0,211.0 657.2,216.7 662.5,222.6 667.8,228.5 673.0,234.5 678.2,240.4 683.5,246.4 688.8,252.2 694.0,257.9 699.2,263.4 704.5,268.7 709.8,273.8 715.0,278.7 720.2,283.2 725.5,287.5 730.8,291.4 736.0,295.1 741.2,298.4 746.5,301.4 751.8,304.2 757.0,306.6 762.2,308.8 767.5,310.7 772.8,312.4 778.0,313.9 783.2,315.2 788.5,316.3 793.8,317.3 799.0,318.1 804.2,318.8 809.5,319.4 814.8,319.9 820.0,320.3 825.2,320.7 830.5,321.0 835.8,321.3 841.0,321.5 846.2,321.7 851.5,321.8 856.8,321.9 862.0,322.1 867.2,322.1 872.5,322.2 877.8,322.3 883.0,322.3 888.2,322.4 893.5,322.4 898.8,322.4 904.0,322.4 909.2,322.5 914.5,322.5 919.8,322.5 925.0,322.5"/>
    <text x="920" y="317" class="lab" text-anchor="end">объект 1</text>
  </g>

  <g data-key="c2">
    <polyline class="cv" points="505.0,381.1 510.2,381.1 515.5,381.1 520.8,381.0 526.0,381.0 531.2,381.0 536.5,381.0 541.8,380.9 547.0,380.9 552.2,380.8 557.5,380.8 562.8,380.7 568.0,380.6 573.2,380.5 578.5,380.3 583.8,380.2 589.0,379.9 594.2,379.7 599.5,379.3 604.8,379.0 610.0,378.5 615.2,377.9 620.5,377.3 625.8,376.5 631.0,375.5 636.2,374.4 641.5,373.1 646.8,371.6 652.0,369.8 657.2,367.8 662.5,365.5 667.8,362.9 673.0,359.9 678.2,356.6 683.5,352.9 688.8,348.8 694.0,344.4 699.2,339.6 704.5,334.5 709.8,329.1 715.0,323.3 720.2,317.3 725.5,311.2 730.8,304.8 736.0,298.4 741.2,291.9 746.5,285.4 751.8,279.0 757.0,272.6 762.2,266.4 767.5,260.4 772.8,254.6 778.0,249.1 783.2,243.8 788.5,238.7 793.8,234.0 799.0,229.5 804.2,225.4 809.5,221.5 814.8,217.9 820.0,214.6 825.2,211.5 830.5,208.7 835.8,206.1 841.0,203.7 846.2,201.6 851.5,199.6 856.8,197.8 862.0,196.2 867.2,194.7 872.5,193.3 877.8,192.1 883.0,191.0 888.2,190.0 893.5,189.1 898.8,188.3 904.0,187.6 909.2,186.9 914.5,186.3 919.8,185.8 925.0,185.3"/>
    <text x="920" y="180" class="lab" text-anchor="end">объект 2</text>
  </g>

  <g data-key="cb">
    <polyline class="cvb" points="505.0,255.7 510.2,256.1 515.5,256.6 520.8,257.0 526.0,257.6 531.2,258.1 536.5,258.8 541.8,259.4 547.0,260.2 552.2,261.0 557.5,261.9 562.8,262.8 568.0,263.8 573.2,264.9 578.5,266.1 583.8,267.4 589.0,268.8 594.2,270.2 599.5,271.8 604.8,273.4 610.0,275.1 615.2,276.9 620.5,278.7 625.8,280.6 631.0,282.6 636.2,284.5 641.5,286.5 646.8,288.5 652.0,290.4 657.2,292.3 662.5,294.0 667.8,295.7 673.0,297.2 678.2,298.5 683.5,299.6 688.8,300.5 694.0,301.1 699.2,301.5 704.5,301.6 709.8,301.5 715.0,301.0 720.2,300.3 725.5,299.3 730.8,298.1 736.0,296.7 741.2,295.1 746.5,293.4 751.8,291.6 757.0,289.6 762.2,287.6 767.5,285.6 772.8,283.5 778.0,281.5 783.2,279.5 788.5,277.5 793.8,275.6 799.0,273.8 804.2,272.1 809.5,270.5 814.8,268.9 820.0,267.5 825.2,266.1 830.5,264.9 835.8,263.7 841.0,262.6 846.2,261.6 851.5,260.7 856.8,259.9 862.0,259.1 867.2,258.4 872.5,257.8 877.8,257.2 883.0,256.7 888.2,256.2 893.5,255.8 898.8,255.4 904.0,255.0 909.2,254.7 914.5,254.4 919.8,254.2 925.0,253.9"/>
    <text x="920" y="240" class="labb" text-anchor="end">батч: среднее двух</text>
  </g>

  <g data-key="pts">
    <line x1="715" y1="278.7" x2="715" y2="323.3" class="link"/>
    <circle cx="715" cy="278.7" r="5" class="dot"/>
    <circle cx="715" cy="323.3" r="5" class="dot"/>
    <circle cx="715" cy="301.0" r="6" class="gdot"/>
  </g>

  <g data-key="ptsv" data-only="1">
    <text x="730" y="344" class="cap">в текущей точке:</text>
    <text x="730" y="362" class="cap">E₁ = 0.3183,  E₂ = 0.2067</text>
    <text x="730" y="380" class="cap">среднее: 0.2625</text>
  </g>

  <g data-key="mn" data-only="1">
    <circle cx="703.8" cy="301.6" r="9" class="ring"/>
    <line x1="703.8" y1="312" x2="703.8" y2="392" class="dash"/>
    <text x="694" y="406" class="labb" text-anchor="end">дно</text>
  </g>

  <g data-key="gr" data-only="1">
    <text x="730" y="344" class="rn">наклоны в текущей точке:</text>
    <text x="730" y="362" class="rn">−0.0588  и  +0.0733</text>
    <text x="730" y="380" class="rn">среднее: +0.0073 — почти ноль</text>
  </g>

  <text x="40" y="604" class="legend">синий — данные · жёлтый — слагаемые по отдельным объектам · зелёный — функционал батча и его дно · красный — наклоны</text>
  <rect x="40" y="450" width="880" height="130" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="476" class="panel-label">формула этого шага</text>
  <g data-key="g1" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="E_1(\theta) = \tfrac{1}{2}\bigl[(0.5316 - 1)^2 + (0.6459 - 0)^2\bigr] = 0.3183"></div></foreignObject></g>
  <g data-key="g2" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="E_2(\theta) = \tfrac{1}{2}\bigl[(0.5376 - 0)^2 + (0.6473 - 1)^2\bigr] = 0.2067"></div></foreignObject></g>
  <g data-key="g3" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="E(\theta) = \frac{1}{n}\sum_{i=1}^{n} \tfrac{1}{2}\bigl\|\hat{y}(x_i;\theta) - y_i\bigr\|^2 \qquad \text{— здесь } n = 2"></div></foreignObject></g>
  <g data-key="g4" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="E(\theta) = \tfrac{1}{2}\bigl(0.3183 + 0.2067\bigr) = 0.2625"></div></foreignObject></g>
  <g data-key="g5" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\min E = 0.2609 \ \ \text{при } w^{(2)}_{11} = 0.074, \qquad \text{сейчас } w^{(2)}_{11} = 0.5"></div></foreignObject></g>
  <g data-key="g6" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\partial E}{\partial w^{(2)}_{11}} = \tfrac{1}{2}\bigl(-0.0588 + 0.0733\bigr) = +0.0073"></div></foreignObject></g>
  <g data-key="g7" data-only="1"><foreignObject x="62" y="490" width="836" height="84"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\nabla E = \frac{1}{n}\sum_{i=1}^{n}\nabla E_i \qquad \text{— } n \text{ слагаемых, форма функции та же}"></div></foreignObject></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="obj1 c1 g1" data-focus="c1">
      <div class="step-kicker">Шаг 1 · одно слагаемое</div>
      <h4>У объекта 1 срез падает вправо</h4>
      <p>Это та же кривая, что в предыдущей сцене: первый выход должен подрасти до
      единицы, поэтому увеличение веса <code>w⁽²⁾₁₁</code> уменьшает ошибку. Объект
      как бы тянет этот вес вверх.</p>
    </div>
    <div class="step-panel" data-on="obj1 obj2 c1 c2 g2" data-focus="c2">
      <div class="step-kicker">Шаг 2 · второе слагаемое</div>
      <h4>У объекта 2 цель обратная — и срез растёт</h4>
      <p>Здесь первый выход должен быть нулём, а не единицей. Тот же самый вес,
      увеличиваясь, делает объекту 2 хуже: его кривая идёт в противоположную
      сторону. Данные разные, параметры общие.</p>
    </div>
    <div class="step-panel" data-on="obj1 obj2 bform c1 c2 cb g3" data-focus="cb">
      <div class="step-kicker">Шаг 3 · функционал батча</div>
      <h4>Толстая кривая — среднее двух тонких</h4>
      <p>Формула не изменилась ни на символ: те же двенадцать аргументов, просто
      слагаемых теперь два и они делятся на <code>n</code>. Геометрически усреднение
      означает «взять середину между кривыми в каждой точке».</p>
    </div>
    <div class="step-panel" data-on="bform c1 c2 cb pts ptsv g4" data-focus="pts">
      <div class="step-kicker">Шаг 4 · проверка в точке</div>
      <h4>0.3183 и 0.2067 дают 0.2625</h4>
      <p>Зелёная точка лежит ровно посередине отрезка между жёлтыми — это и есть
      среднее арифметическое, увиденное глазами. Никакой новой математики в переходе
      от одного объекта к выборке нет.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 cb pts mn g5" data-focus="mn">
      <div class="step-kicker">Шаг 5 · дно появилось</div>
      <h4>У среднего есть минимум, которого не было у слагаемых</h4>
      <p>Обе тонкие кривые монотонны и дна не имеют. А их среднее разворачивается:
      минимум при <code>w⁽²⁾₁₁ = 0.074</code>. Причина простая — объекты тянут вес в
      разные стороны, и где-то их требования уравновешиваются.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 cb pts gr g6" data-focus="gr">
      <div class="step-kicker">Шаг 6 · градиент батча</div>
      <h4>Наклоны усредняются так же, как значения</h4>
      <p><code>−0.0588</code> и <code>+0.0733</code> в среднем дают
      <code>+0.0073</code>. По этому весу шаг почти не будет сделан, хотя каждый
      объект по отдельности требовал заметного движения: мы уже стоим почти на дне
      среза, и батч это видит, а одиночный объект — нет.</p>
    </div>
    <div class="step-panel" data-on="obj1 obj2 bform cb pts g7" data-focus="cb">
      <div class="step-kicker">Шаг 7 · миллион объектов</div>
      <h4>Форма функции та же, дорожает только подсчёт</h4>
      <p>При <code>n</code> объектах слагаемых <code>n</code>, аргументов
      по-прежнему двенадцать. Один честный градиент стоит <code>n</code> прямых и
      <code>n</code> обратных проходов — отсюда мини-батчи и SGD из части 6: берём
      среднее не по всей выборке, а по случайной горстке.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Проверим утверждение про усреднение на числах: одиночный градиент объекта 1 по
  весу <span class="math-inline" data-tex="w^{(2)}_{11}"></span> равен
  <span class="math-inline" data-tex="\delta^{(2)}_1 a^{(1)}_1 = -0.1166 \cdot 0.5037 = -0.0588"></span>,
  у объекта 2 та же формула даёт
  <span class="math-inline" data-tex="+0.1337 \cdot 0.5486 = +0.0733"></span>.
  Среднее — <span class="math-inline" data-tex="+0.0073"></span>. Никакой отдельной
  «батчевой» формулы не понадобилось: бэкпроп отработал по объекту, а сумма
  собралась снаружи.
</p>

<div class="callout-yellow">
  <strong>Практическая деталь.</strong> В коде это одна строка: прямой проход делают
  сразу для всей матрицы объектов <code>X</code> формы <code>[n, 2]</code>, а
  градиент получается как <code>δᵀ A / n</code> — то же внешнее произведение, только
  просуммированное по строкам батча. Делить на <code>n</code> не обязательно, но
  тогда подходящая скорость обучения будет зависеть от размера батча.
</div>

<p>
  Итак, функционал выписан: одно число, двенадцать аргументов,
  <span class="math-inline" data-tex="n"></span> слагаемых. Осталось понять, как
  получить все двенадцать наклонов, не считая каждый срез отдельно. Этим и займётся
  следующая сцена.
</p>

<div class="stage" id="stageNet" tabindex="0">
  <div class="stage-figure">
<svg id="nn" viewBox="0 0 1240 800" role="img" aria-label="Сеть 2-2-2, дельты обратного прохода, матрицы градиентов и обновлённые веса">
  <style>
    #nn { font-family: Helvetica, Arial, sans-serif; }
    #nn .title { font-size: 15px; font-weight: 700; fill: #5E5850; }
    #nn .colhd { font-size: 13px; fill: #8A8378; letter-spacing: 0.06em; }
    #nn .nd  { fill: #FFFFFF; stroke: #3576C0; stroke-width: 2; }
    #nn .ed  { stroke: #9FBEE0; stroke-width: 2; fill: none; }
    #nn .nl  { font-size: 16px; fill: #111111; }
    #nn .wl  { font-size: 13px; fill: #8C7106; }
    #nn .vl  { font-size: 13px; fill: #4C8316; }
    #nn .cap { font-size: 13px; fill: #8A8378; }
    #nn .note{ font-size: 14px; fill: #5E5850; }
    #nn .rn  { font-size: 14px; fill: #A30908; }
    #nn .br  { fill: #FDECEC; stroke: #C30B0A; stroke-width: 1.7; }
    #nn .bak { stroke: #C30B0A; stroke-width: 2.4; fill: none; }
    #nn .lab { font-size: 13px; font-weight: 600; }
    #nn .ct  { font-size: 12px; font-weight: 600; }
    #nn .shape { font-size: 12px; fill: #968F85; }
    #nn .cell  { stroke-width: 1.2; }
    #nn .empty { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; stroke-dasharray: 3 2; }
    #nn .qt    { font-size: 12px; fill: #C9C2B8; }
    #nn .div   { stroke: #E5E1D8; stroke-width: 1.4; }
    #nn .panel-label { font-size: 13px; fill: #8A8378; letter-spacing: 0.04em; }
    #nn .legend { font-size: 13px; fill: #8A8378; }
  </style>
  <defs>
    <marker id="nn-aw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
    <marker id="nn-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text x="40" y="34" class="title">Сеть 2-2-2: прямой проход, дельты обратного прохода и шаг спуска при η = 0.5</text>
  <text x="270" y="72" class="colhd" text-anchor="middle">СЕТЬ И ЕЁ ПАРАМЕТРЫ</text>
  <text x="900" y="72" class="colhd" text-anchor="middle">ГРАДИЕНТЫ И ОБНОВЛЕНИЕ</text>
  <line x1="580" y1="56" x2="580" y2="600" class="div"/>

  <g data-key="net">
    <line x1="116" y1="160" x2="224" y2="160" class="ed"/>
    <line x1="108" y1="182" x2="232" y2="278" class="ed"/>
    <line x1="108" y1="278" x2="232" y2="182" class="ed"/>
    <line x1="116" y1="300" x2="224" y2="300" class="ed"/>
    <line x1="276" y1="160" x2="384" y2="160" class="ed"/>
    <line x1="268" y1="182" x2="392" y2="278" class="ed"/>
    <line x1="268" y1="278" x2="392" y2="182" class="ed"/>
    <line x1="276" y1="300" x2="384" y2="300" class="ed"/>
    <circle cx="90" cy="160" r="26" class="nd"/>
    <circle cx="90" cy="300" r="26" class="nd"/>
    <circle cx="250" cy="160" r="26" class="nd"/>
    <circle cx="250" cy="300" r="26" class="nd"/>
    <circle cx="410" cy="160" r="26" class="nd"/>
    <circle cx="410" cy="300" r="26" class="nd"/>
    <text x="90" y="166" class="nl" text-anchor="middle">x₁</text>
    <text x="90" y="306" class="nl" text-anchor="middle">x₂</text>
    <text x="250" y="166" class="nl" text-anchor="middle">a₁</text>
    <text x="250" y="306" class="nl" text-anchor="middle">a₂</text>
    <text x="410" y="166" class="nl" text-anchor="middle">ŷ₁</text>
    <text x="410" y="306" class="nl" text-anchor="middle">ŷ₂</text>
    <text x="170" y="150" class="wl" text-anchor="middle">0.15</text>
    <text x="140" y="220" class="wl" text-anchor="middle">0.40</text>
    <text x="140" y="266" class="wl" text-anchor="middle">−0.20</text>
    <text x="170" y="318" class="wl" text-anchor="middle">0.30</text>
    <text x="330" y="150" class="wl" text-anchor="middle">0.50</text>
    <text x="300" y="220" class="wl" text-anchor="middle">0.20</text>
    <text x="300" y="266" class="wl" text-anchor="middle">−0.30</text>
    <text x="330" y="318" class="wl" text-anchor="middle">0.60</text>
    <text x="40" y="360" class="cap">смещения: b⁽¹⁾ = (0.10, −0.10),  b⁽²⁾ = (0.05, 0.15)</text>
    <text x="40" y="384" class="cap">2 входа → 2 скрытых нейрона → 2 выхода, после каждого сумматора сигмоида</text>
  </g>

  <g data-key="fwd">
    <text x="90" y="122" class="vl" text-anchor="middle">0.5</text>
    <text x="90" y="344" class="vl" text-anchor="middle">0.8</text>
    <text x="250" y="122" class="vl" text-anchor="middle">0.5037</text>
    <text x="250" y="344" class="vl" text-anchor="middle">0.5842</text>
    <text x="410" y="122" class="vl" text-anchor="middle">0.5316 (цель 1)</text>
    <text x="410" y="344" class="vl" text-anchor="middle">0.6459 (цель 0)</text>
    <line x1="436" y1="176" x2="464" y2="204" class="ed" marker-end="url(#nn-aw)"/>
    <line x1="436" y1="284" x2="464" y2="256" class="ed" marker-end="url(#nn-aw)"/>
    <rect x="470" y="196" width="100" height="68" rx="9" class="br"/>
    <text x="520" y="222" class="cap" text-anchor="middle">потери</text>
    <text x="520" y="246" class="nl" text-anchor="middle">E = 0.3183</text>
  </g>

  <g data-key="ask" data-only="1">
    <text x="40" y="470" class="rn">Формула шага требует ∂E/∂w для каждого из 12 параметров:</text>
    <text x="40" y="494" class="rn">8 весов и 4 смещения. Считать их по отдельности — 12 проходов.</text>
  </g>

  <g data-key="bpath" data-only="1">
    <path d="M 466 216 C 450 170, 440 140, 438 128" class="bak" marker-end="url(#nn-ar)"/>
    <path d="M 384 176 C 340 130, 300 128, 264 140" class="bak" marker-end="url(#nn-ar)"/>
    <text x="40" y="470" class="rn">Обратный проход идёт справа налево одной волной</text>
    <text x="40" y="494" class="rn">и выдаёт все 12 производных за один заход.</text>
  </g>

  <g data-key="res" data-only="1">
    <text x="40" y="470" class="note">после шага: ŷ = (0.5554, 0.6177),  E = 0.2896</text>
    <text x="40" y="494" class="note">через 50 таких шагов: E = 0.0186,  ŷ = (0.8708, 0.1435)</text>
    <text x="40" y="518" class="cap">оба выхода поехали к своим целям — это и есть обучение</text>
  </g>

  <foreignObject x="600" y="92" width="360" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{(2)} = \left(\hat{y} - y\right)\odot\sigma'\!\left(z^{(2)}\right)"></div>
  </foreignObject>
  <g data-key="d2e" data-only="1">
    <text x="968" y="127" class="lab" text-anchor="end" fill="#C9C2B8">δ⁽²⁾ =</text>
    <rect x="980" y="96" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="113" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="139" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="d2" data-only="1">
    <text x="968" y="127" class="lab" text-anchor="end" fill="#A30908">δ⁽²⁾ =</text>
    <rect x="980" y="96" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1007" y="113" class="ct" text-anchor="middle" fill="#A30908">−0.1166</text>
    <rect x="980" y="122" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1007" y="139" class="ct" text-anchor="middle" fill="#A30908">0.1477</text>
    <text x="1007" y="166" class="shape" text-anchor="middle">(2×1)</text>
    <text x="1060" y="127" class="cap">(0.5316 − 1)·σ′</text>
  </g>

  <foreignObject x="600" y="180" width="360" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\delta^{(1)} = \left(W^{(2)\top}\delta^{(2)}\right)\odot\sigma'\!\left(z^{(1)}\right)"></div>
  </foreignObject>
  <g data-key="d1e" data-only="1">
    <text x="968" y="215" class="lab" text-anchor="end" fill="#C9C2B8">δ⁽¹⁾ =</text>
    <rect x="980" y="184" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="201" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="210" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="227" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="254" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="d1" data-only="1">
    <text x="968" y="215" class="lab" text-anchor="end" fill="#A30908">δ⁽¹⁾ =</text>
    <rect x="980" y="184" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1007" y="201" class="ct" text-anchor="middle" fill="#A30908">−0.0072</text>
    <rect x="980" y="210" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1007" y="227" class="ct" text-anchor="middle" fill="#A30908">0.0300</text>
    <text x="1007" y="254" class="shape" text-anchor="middle">(2×1)</text>
    <text x="1060" y="215" class="cap">в 5–15 раз мельче</text>
  </g>

  <foreignObject x="600" y="268" width="360" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\nabla W^{(2)} = \delta^{(2)}\left(a^{(1)}\right)^{\top}"></div>
  </foreignObject>
  <g data-key="gW2e" data-only="1">
    <text x="968" y="303" class="lab" text-anchor="end" fill="#C9C2B8">∇W⁽²⁾ =</text>
    <rect x="980" y="272" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="289" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="272" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="289" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="315" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="298" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="315" class="qt" text-anchor="middle">?</text>
    <text x="1034" y="342" class="shape" text-anchor="middle">(2×2)</text>
  </g>
  <g data-key="gW2" data-only="1">
    <text x="968" y="303" class="lab" text-anchor="end" fill="#A30908">∇W⁽²⁾ =</text>
    <rect x="980" y="272" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1007" y="289" class="ct" text-anchor="middle" fill="#A30908">−0.0588</text>
    <rect x="1034" y="272" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1061" y="289" class="ct" text-anchor="middle" fill="#A30908">−0.0681</text>
    <rect x="980" y="298" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1007" y="315" class="ct" text-anchor="middle" fill="#A30908">0.0744</text>
    <rect x="1034" y="298" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1061" y="315" class="ct" text-anchor="middle" fill="#A30908">0.0863</text>
    <text x="1034" y="342" class="shape" text-anchor="middle">(2×2)</text>
    <text x="1100" y="289" class="cap">−0.1166·0.5037</text>
  </g>

  <foreignObject x="600" y="356" width="360" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="\nabla W^{(1)} = \delta^{(1)}\left(x\right)^{\top}"></div>
  </foreignObject>
  <g data-key="gW1e" data-only="1">
    <text x="968" y="391" class="lab" text-anchor="end" fill="#C9C2B8">∇W⁽¹⁾ =</text>
    <rect x="980" y="360" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="377" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="360" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="377" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="403" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="386" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="403" class="qt" text-anchor="middle">?</text>
    <text x="1034" y="430" class="shape" text-anchor="middle">(2×2)</text>
  </g>
  <g data-key="gW1" data-only="1">
    <text x="968" y="391" class="lab" text-anchor="end" fill="#A30908">∇W⁽¹⁾ =</text>
    <rect x="980" y="360" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1007" y="377" class="ct" text-anchor="middle" fill="#A30908">−0.0036</text>
    <rect x="1034" y="360" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1061" y="377" class="ct" text-anchor="middle" fill="#A30908">−0.0058</text>
    <rect x="980" y="386" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1007" y="403" class="ct" text-anchor="middle" fill="#A30908">0.0150</text>
    <rect x="1034" y="386" width="54" height="26" rx="2" class="cell" fill="#FDECEC" stroke="#C30B0A"/>
    <text x="1061" y="403" class="ct" text-anchor="middle" fill="#A30908">0.0240</text>
    <text x="1034" y="430" class="shape" text-anchor="middle">(2×2)</text>
    <text x="1100" y="377" class="cap">на порядок мельче,</text>
    <text x="1100" y="397" class="cap">чем во втором слое</text>
  </g>

  <foreignObject x="600" y="444" width="360" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="W^{(2)} \leftarrow W^{(2)} - \eta\,\nabla W^{(2)}"></div>
  </foreignObject>
  <g data-key="uWe" data-only="1">
    <text x="968" y="479" class="lab" text-anchor="end" fill="#C9C2B8">W⁽²⁾ =</text>
    <rect x="980" y="448" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="465" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="448" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="465" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="474" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="491" class="qt" text-anchor="middle">?</text>
    <rect x="1034" y="474" width="54" height="26" rx="2" class="empty"/>
    <text x="1061" y="491" class="qt" text-anchor="middle">?</text>
    <text x="1034" y="518" class="shape" text-anchor="middle">(2×2)</text>
  </g>
  <g data-key="uW" data-only="1">
    <text x="968" y="479" class="lab" text-anchor="end" fill="#4C8316">W⁽²⁾ =</text>
    <rect x="980" y="448" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="465" class="ct" text-anchor="middle" fill="#4C8316">0.5294</text>
    <rect x="1034" y="448" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1061" y="465" class="ct" text-anchor="middle" fill="#4C8316">−0.2659</text>
    <rect x="980" y="474" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="491" class="ct" text-anchor="middle" fill="#4C8316">0.1628</text>
    <rect x="1034" y="474" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1061" y="491" class="ct" text-anchor="middle" fill="#4C8316">0.5568</text>
    <text x="1034" y="518" class="shape" text-anchor="middle">(2×2)</text>
    <text x="1100" y="465" class="cap">0.50 − 0.5·(−0.059)</text>
  </g>

  <foreignObject x="600" y="532" width="360" height="52">
    <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-sm" data-tex="b^{(2)} \leftarrow b^{(2)} - \eta\,\delta^{(2)}"></div>
  </foreignObject>
  <g data-key="ube" data-only="1">
    <text x="968" y="567" class="lab" text-anchor="end" fill="#C9C2B8">b⁽²⁾ =</text>
    <rect x="980" y="536" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="553" class="qt" text-anchor="middle">?</text>
    <rect x="980" y="562" width="54" height="26" rx="2" class="empty"/>
    <text x="1007" y="579" class="qt" text-anchor="middle">?</text>
    <text x="1007" y="606" class="shape" text-anchor="middle">(2×1)</text>
  </g>
  <g data-key="ub" data-only="1">
    <text x="968" y="567" class="lab" text-anchor="end" fill="#4C8316">b⁽²⁾ =</text>
    <rect x="980" y="536" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="553" class="ct" text-anchor="middle" fill="#4C8316">0.1083</text>
    <rect x="980" y="562" width="54" height="26" rx="2" class="cell" fill="#EDF7DD" stroke="#73B222"/>
    <text x="1007" y="579" class="ct" text-anchor="middle" fill="#4C8316">0.0761</text>
    <text x="1007" y="606" class="shape" text-anchor="middle">(2×1)</text>
    <text x="1060" y="559" class="cap">смещения — той же</text>
    <text x="1060" y="579" class="cap">формулой</text>
  </g>

  <text x="40" y="780" class="legend">синий — сеть и её структура · жёлтый — веса · зелёный — значения прямого прохода и результат шага · красный — потери и градиенты</text>
  <rect x="40" y="616" width="1160" height="140" rx="14" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
  <text x="62" y="642" class="panel-label">подстановка чисел на этом шаге</text>
  <g data-key="nf1" data-only="1"><foreignObject x="62" y="658" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\hat{y} = \sigma\!\left(W^{(2)}\sigma\!\left(W^{(1)}x + b^{(1)}\right) + b^{(2)}\right) \qquad \text{параметров: } 4 + 2 + 4 + 2 = 12"></div></foreignObject></g>
  <g data-key="nf2" data-only="1"><foreignObject x="62" y="658" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="a^{(1)} = (0.5037,\ 0.5842), \quad \hat{y} = (0.5316,\ 0.6459), \quad E = \tfrac{1}{2}\bigl[(0.5316 - 1)^2 + (0.6459 - 0)^2\bigr] = 0.3183"></div></foreignObject></g>
  <g data-key="nf3" data-only="1"><foreignObject x="62" y="658" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="w \leftarrow w - \eta\,\frac{\partial E}{\partial w} \qquad \text{— нужно } \frac{\partial E}{\partial w} \text{ для каждого из 12 параметров}"></div></foreignObject></g>
  <g data-key="nf4" data-only="1"><foreignObject x="62" y="658" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\delta^{(2)}_1 = \bigl(\hat{y}_1 - y_1\bigr)\,\hat{y}_1\bigl(1 - \hat{y}_1\bigr) = (0.5316 - 1)\cdot 0.5316\cdot 0.4684 = -0.1166"></div></foreignObject></g>
  <g data-key="nf5" data-only="1"><foreignObject x="62" y="658" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\delta^{(1)}_1 = \bigl(w^{(2)}_{11}\delta^{(2)}_1 + w^{(2)}_{21}\delta^{(2)}_2\bigr)\,a^{(1)}_1\bigl(1 - a^{(1)}_1\bigr) = \bigl(0.5\cdot(-0.1166) + 0.2\cdot 0.1477\bigr)\cdot 0.25 = -0.0072"></div></foreignObject></g>
  <g data-key="nf6" data-only="1"><foreignObject x="62" y="658" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\partial E}{\partial w^{(2)}_{11}} = \delta^{(2)}_1\,a^{(1)}_1 = -0.1166\cdot 0.5037 = -0.0588"></div></foreignObject></g>
  <g data-key="nf7" data-only="1"><foreignObject x="62" y="658" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="\frac{\partial E}{\partial w^{(1)}_{11}} = \delta^{(1)}_1\,x_1 = -0.0072\cdot 0.5 = -0.0036 \qquad \text{— в 16 раз мельче}"></div></foreignObject></g>
  <g data-key="nf8" data-only="1"><foreignObject x="62" y="658" width="1116" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center svg-math-sm" data-tex="w^{(2)}_{11} = 0.50 - 0.5\cdot(-0.0588) = 0.5294, \qquad E:\ 0.3183 \;\rightarrow\; 0.2896"></div></foreignObject></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="net d2e d1e gW2e gW1e uWe ube nf1" data-focus="net">
      <div class="step-kicker">Шаг 1 · что настраиваем</div>
      <h4>Двенадцать чисел, и все они — параметры</h4>
      <p>Восемь весов на рёбрах и четыре смещения. Функция потерь зависит от всех
      двенадцати сразу, то есть градиент здесь — вектор длины 12. Справа шесть
      пустых блоков: это те матрицы, которые нам предстоит заполнить.</p>
    </div>
    <div class="step-panel" data-on="net fwd d2e d1e gW2e gW1e uWe ube nf2" data-focus="fwd">
      <div class="step-kicker">Шаг 2 · прямой проход</div>
      <h4>Считаем предсказание и ошибку</h4>
      <p>Числа текут слева направо: <code>a⁽¹⁾ = (0.5037, 0.5842)</code>, затем
      <code>ŷ = (0.5316, 0.6459)</code>. Цель — <code>(1, 0)</code>, промахи в разные
      стороны, суммарные потери <code>E = 0.3183</code>.</p>
    </div>
    <div class="step-panel" data-on="net fwd ask d2e d1e gW2e gW1e uWe ube nf3" data-focus="ask">
      <div class="step-kicker">Шаг 3 · чего не хватает</div>
      <h4>Формула шага требует производную по каждому весу</h4>
      <p>Мы умеем шагать, если знаем <span class="math-inline" data-tex="\partial E/\partial w"></span>
      для всех параметров. Считать каждую отдельно — двенадцать проходов по сети
      здесь и миллион проходов в реальной модели.</p>
    </div>
    <div class="step-panel" data-on="net fwd bpath d2 d1e gW2e gW1e uWe ube nf4" data-focus="d2">
      <div class="step-kicker">Шаг 4 · дельта последнего слоя</div>
      <h4>Ошибка на выходе, умноженная на наклон сигмоиды</h4>
      <p><code>δ⁽²⁾ = (ŷ − y) ⊙ σ′(z⁽²⁾)</code>, где
      <span class="math-inline" data-tex="\sigma'(z) = a(1-a)"></span>. Первый выход
      промахнулся вниз, второй вверх — отсюда разные знаки: −0.1166 и 0.1477.</p>
    </div>
    <div class="step-panel" data-on="net bpath d2 d1 gW2e gW1e uWe ube nf5" data-focus="d1">
      <div class="step-kicker">Шаг 5 · дельта первого слоя</div>
      <h4>Ту же величину протаскиваем назад через транспонированную матрицу</h4>
      <p><code>δ⁽¹⁾ = (W⁽²⁾ᵀ δ⁽²⁾) ⊙ σ′(z⁽¹⁾)</code>. Транспонирование появляется
      потому, что назад сигнал идёт по тем же рёбрам, но в обратную сторону.
      Результат — уже в 5–15 раз мельче, чем на выходе.</p>
    </div>
    <div class="step-panel" data-on="net d2 d1 gW2 gW1e uWe ube nf6" data-focus="gW2">
      <div class="step-kicker">Шаг 6 · градиент второго слоя</div>
      <h4>Каждый градиент — «дельта × вход этого ребра»</h4>
      <p>Внешнее произведение <span class="math-inline" data-tex="\delta^{(2)}\left(a^{(1)}\right)^{\top}"></span>
      даёт сразу всю матрицу: например,
      <code>∂E/∂w⁽²⁾₁₁ = −0.1166 · 0.5037 = −0.0588</code>. Знак минус читается
      буквально — этот вес надо увеличить.</p>
    </div>
    <div class="step-panel" data-on="net d1 gW2 gW1 uWe ube nf7" data-focus="gW1">
      <div class="step-kicker">Шаг 7 · градиент первого слоя</div>
      <h4>Та же формула, только вход — сами данные</h4>
      <p><span class="math-inline" data-tex="\nabla W^{(1)} = \delta^{(1)} x^{\top}"></span>.
      Сравните масштабы: 0.06–0.09 во втором слое против 0.004–0.024 в первом.</p>
      </div>
    <div class="step-panel" data-on="net fwd res gW2 gW1 uW ub nf8" data-focus="uW">
      <div class="step-kicker">Шаг 8 · шаг спуска</div>
      <h4>Та же строка, что и для одного веса — только двенадцать раз</h4>
      <p>С <span class="math-inline" data-tex="\eta = 0.5"></span>:
      <code>0.50 − 0.5·(−0.0588) = 0.5294</code>, и так по каждой клетке, включая
      смещения. Новый прямой проход даёт <code>ŷ = (0.5554, 0.6177)</code> и
      <code>E = 0.2896</code>; через 50 итераций — <code>E = 0.0186</code>.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

<p>
  Сравните три задачи, которые мы решили одной и той же формулой:
</p>

<table class="shape-table">
  <tr><th>Модель</th><th>Предсказание</th><th>Потери</th><th>Градиент по весу</th><th>Шаг</th></tr>
  <tr><td>Линейная регрессия</td><td><span class="math-inline" data-tex="\hat{y} = wx"></span></td><td>MSE</td><td><span class="math-inline" data-tex="-2x(y - \hat{y})"></span></td><td rowspan="3"><span class="math-inline" data-tex="w \leftarrow w - \eta\,\nabla L"></span></td></tr>
  <tr><td>Логистическая регрессия</td><td><span class="math-inline" data-tex="\hat{y} = \sigma(wx)"></span></td><td>logloss</td><td><span class="math-inline" data-tex="(\hat{y} - y)\,x"></span></td></tr>
  <tr><td>Сеть 2-2-2</td><td>два слоя с сигмоидами</td><td>½‖ŷ − y‖²</td><td><span class="math-inline" data-tex="\delta^{(l)} \bigl(a^{(l-1)}\bigr)^{\top}"></span> из бэкпропа</td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> нейросеть не требует нового метода
  оптимизации — она требует эффективного способа посчитать градиент. Как только
  бэкпроп его выдал, обучение сети становится той же арифметикой, что и первый шаг
  из части 3.
</div>

---

## Часть 9. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Обучение — это минимизация:</strong> данные фиксированы, аргументами
  функции потерь служат параметры модели. Найти минимум <span class="math-inline" data-tex="L(w)"></span>
  и обучить модель — одно и то же действие.</li>
  <li><strong>Производная — компас в темноте:</strong> её знак говорит, куда функция
  растёт, поэтому шаг делается против знака. Модуль говорит, насколько здесь круто.</li>
  <li><strong>Формула шага:</strong>
  <span class="math-inline" data-tex="w \leftarrow w - \eta\,L'(w)"></span>. Шаги
  укорачиваются сами по мере приближения к минимуму — отдельного торможения не нужно.</li>
  <li><strong>Скорость обучения решает судьбу спуска:</strong> слишком мала — ползём,
  слишком велика — колеблемся или расходимся. Для параболы порог считается точно:
  <span class="math-inline" data-tex="\eta &gt; 2/L''"></span> — расходимость.</li>
  <li><strong>Градиент — вектор частных производных.</strong> Производная по любому
  направлению равна <span class="math-inline" data-tex="u \cdot \nabla L"></span>,
  поэтому максимум роста — вдоль градиента, максимум убывания — против него.</li>
  <li><strong>Спуск идёт перпендикулярно линиям уровня</strong> и тормозит в
  вытянутых долинах: там градиент почти нулевой вдоль дна. Отсюда инерция,
  нормировка признаков и адаптивные методы.</li>
  <li><strong>Цикл обучения:</strong> предсказать → посчитать потери → взять
  градиент → шагнуть → повторить. Параметры меняются ровно в одном месте цикла.</li>
  <li><strong>Стохастичность — про цену шага, а не про точность:</strong> градиент
  по мини-батчу дешевле и шумнее; шум приходится гасить убыванием
  <span class="math-inline" data-tex="\eta"></span>.</li>
  <li><strong>Смена задачи меняет только две формулы:</strong> предсказание и потери.
  У линейной регрессии градиент равен <span class="math-inline" data-tex="-2x(y-\hat{y})"></span>,
  у логистической — <span class="math-inline" data-tex="(\hat{y}-y)x"></span>; правило
  обновления одно и то же.</li>
  <li><strong>Бэкпроп и спуск — разные вещи:</strong> первый вычисляет градиент,
  второй решает, что с ним делать. Для сети шаг выглядит ровно так же, как для
  одного веса, просто выполняется для всех параметров сразу.</li>
</ol>

<p>
  Если из статьи стоит унести одну картину — пусть это будет человек с завязанными
  глазами на склоне. Он не знает, где долина, не видит карты и не умеет решать
  уравнения. Он умеет одно: пощупать землю под ногами и сделать небольшой шаг вниз.
  Повторённое достаточное число раз, это скромное умение обучает и линейную
  регрессию из двух точек, и сеть с миллиардом параметров.
</p>

<p class="tiny">
  Все числа в статье посчитаны на данных
  <span class="math-inline" data-tex="x = (1, 2)"></span>,
  <span class="math-inline" data-tex="y = (2, 3)"></span> (регрессия), на одном
  объекте <span class="math-inline" data-tex="x = -5,\ y = 1"></span> (логистическая
  регрессия) и на сети 2-2-2 с входом <span class="math-inline" data-tex="(0.5, 0.8)"></span>
  и целью <span class="math-inline" data-tex="(1, 0)"></span> — те же веса, что в
  статье про бэкпроп. Градиенты проверены сравнением с численными производными
  (конечные разности, расхождение порядка 10⁻¹¹). Округление везде до четырёх
  знаков; данные учебные и подобраны так, чтобы все промежуточные величины
  помещались на экран.
</p>
