<p class="lead">
  Свёртка — это не новая формула, а ответ на конкретную поломку. Мы сначала соберём
  обычный полносвязный классификатор рукописных цифр, доведём его до 97% точности,
  а потом сдвинем картинку на один пиксель и увидим, как эти 97% превращаются в 39%.
  Маленький скользящий фильтр появится ровно в том месте, где линейный слой ломается.
</p>

<p>
  Через всю статью проходит одна реальная рукописная цифра — объект №1330 из набора
  <code>digits</code>, который поставляется вместе с scikit-learn: матрица
  <strong>8×8</strong> с яркостями от 0 до 16. Это уменьшенные рукописные формы NIST,
  того же происхождения, что и MNIST, только 8×8 вместо 28×28 — чтобы все 64 числа
  помещались на экран и каждую сумму можно было проверить руками. Все веса, логиты,
  вероятности и точности в частях 1–10 получены обучением на этом наборе, а не придуманы.
  В частях 11–17, где сеть проходится вперёд и назад руками, вход уменьшен до картинки 5×5,
  а веса заданы вручную — об этом сказано там же.
</p>

<div class="reading-contract">
  <div class="contract-card"><span>На входе</span><strong>Линейный слой и матрицы</strong><p>Достаточно понимать умножение чисел, сумму и форму тензора.</p></div>
  <div class="contract-card"><span>Сквозной пример</span><strong>Цифра 7, матрица 8×8</strong><p>Один фильтр 3×3 идёт по тем же 64 числам от первой формулы до кода.</p></div>
  <div class="contract-card"><span>Что получится</span><strong>Свёрточный слой целиком</strong><p>Conv, ReLU, каналы, padding и stride, pooling, рецептивное поле — и обучение: forward и backward руками, затем код.</p></div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные и структура</span>
  <span><i style="background:#C29E08"></i>параметр и текущая операция</span>
  <span><i style="background:#73B222"></i>результат forward</span>
  <span><i style="background:#C30B0A"></i>ошибка и backward</span>
</div>


<div class="callout-blue"><strong>Как работать с интерактивами:</strong> в сцене формула стоит рядом с той частью схемы, к которой относится, а подстановка чисел — в описании шага под кнопками. Нажимайте «Далее» и следите только за яркой операцией. В лабораториях двигайте ползунок: схема, формула и числа пересчитываются из одного состояния. Клавиши ← → работают, когда сцена в фокусе.</div>

## Часть 1. Изображение — это тензор чисел

<p>
  Человек видит написанную от руки семёрку. Модель получает прямоугольную таблицу
  яркостей: у каждой клетки есть координата — номер строки и номер столбца — и одно
  число. Никакого отдельного признака «перекладина» или «наклонный штрих» в файле нет,
  есть только регулярная решётка измерений.
</p>

<div class="math-display" data-tex="X\in\mathbb{R}^{H\times W},\qquad X_{ij}\in\{0,1,\ldots,16\}\quad\xrightarrow{\;/16\;}\quad X'_{ij}\in[0,1]"></div>

<div class="stage step-stage" id="pixels-stage" data-stage="pixels" tabindex="0">
  <div class="stage-figure"><svg id="px-viz" viewBox="0 0 960 520" role="img" aria-label="Переход от рукописной цифры к пиксельной матрице, нормализации и форме тензора"><g data-canvas=""></g></svg></div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel"><div class="step-kicker">Шаг 1 · растр</div><h4>Цифра приходит как решётка яркостей</h4><p>Слева — та самая рукописная семёрка, отрисованная только заливкой клеток: чем темнее клетка, тем больше её значение. Никакого контура, вектора или объекта в файле нет — есть 64 измерения яркости.</p><div class="math-display" data-tex="H=8,\quad W=8\quad\Longrightarrow\quad X\in\mathbb{R}^{8\times8},\quad HW=64"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 2 · координата</div><h4>У каждой клетки есть адрес (i, j)</h4><p>Строка отвечает вертикальной координате, столбец — горизонтальной. Верхняя перекладина семёрки лежит в строке 0, а её самые яркие пиксели — в столбцах 4 и 5.</p><div class="math-display" data-tex="X_{0,4}=16,\qquad X_{4,6}=10,\qquad X_{2,3}=0"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 3 · числа</div><h4>Изображение становится матрицей</h4><p>Соседние числа в матрице соответствуют соседним пикселям на бумаге. Именно это соседство и будет использовать свёртка; для полносвязного слоя оно, как мы увидим, значения не имеет.</p><div class="math-display" data-tex="\sum_{i,j}X_{ij}=277,\qquad \#\{X_{ij}>0\}=31\ \text{из}\ 64"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 4 · нормализация</div><h4>Диапазон 0…16 удобно перевести в 0…1</h4><p>Делим каждую яркость на максимум. Геометрия не меняется: та же матрица в более удобном масштабе. Это линейное преобразование, поэтому любая линейная операция после него — включая свёртку — просто масштабируется.</p><div class="math-display" data-tex="X'_{0,4}=\frac{16}{16}=1{,}00,\qquad X'_{1,1}=\frac{4}{16}=0{,}25"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 5 · форма тензора</div><h4>Оси имеют разный смысл</h4><p>К пространственным осям добавляются каналы <code>C</code> (у нас один, у RGB — три) и внешняя ось батча <code>N</code>. Порядок осей — соглашение библиотеки; в PyTorch это <code>[N, C, H, W]</code>.</p><div class="math-display" data-tex="[N,C,H,W]=[1,1,8,8]\qquad\text{против RGB: }[N,3,32,32]"></div></div>
  </div>
</div>
<p class="tiny">Без JavaScript: сцена последовательно показывает растр цифры, адресацию пикселя, числовую матрицу 8×8, деление на 16 и форму тензора.</p>

<div class="callout-yellow"><strong>Пока канал один:</strong> размер <code>8×8</code> означает 64 яркости и ни одного признака сверх них. Цвет и ось <code>C</code> появятся в части 7 — там же, где они появляются в лекции.</div>

---

## Часть 2. Один вес на каждый пиксель: логистический нейрон

<p>
  Первый честный способ распознать семёрку — уже знакомая логистическая регрессия.
  Матрицу 8×8 распрямляем в вектор из 64 чисел, каждому числу даём собственный вес,
  складываем произведения, добавляем сдвиг и пропускаем результат через сигмоиду.
  Вопрос пока бинарный: «это семёрка или нет?»
</p>

<div class="math-display" data-tex="\mathbf x=\operatorname{vec}(X')\in\mathbb{R}^{64},\qquad z=\mathbf x^\top\mathbf w+b,\qquad \hat p_7=\sigma(z)=\frac{1}{1+e^{-z}}"></div>

<p>
  Веса <span class="math-inline" data-tex="\mathbf w"></span> ниже не выдуманы: это
  коэффициенты логистической регрессии, обученной на 1257 объектах набора
  <code>digits</code> в режиме «7 против всех остальных». На отложенных 540 объектах
  такая модель не ошибается ни разу.
</p>

<div class="stage step-stage" id="classifier-stage" data-stage="classifier" tabindex="0">
  <div class="stage-figure"><svg id="cl-viz" viewBox="0 0 960 700" role="img" aria-label="Переход от цифры к вектору, весам, логиту и вероятности бинарного классификатора"><g data-canvas=""></g></svg></div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel"><div class="step-kicker">Шаг 1 · flatten</div><h4>Матрица становится длинной строкой</h4><p>Операция <code>flatten</code> не удаляет ни одного пикселя и не меняет ни одного числа. Она меняет только форму: восемь строк записываются одна за другой, и координата <code>(i, j)</code> превращается в один индекс.</p><div class="math-display" data-tex="X'\in\mathbb{R}^{8\times8}\;\longrightarrow\;\mathbf x\in\mathbb{R}^{64},\qquad x_{8i+j}=X'_{ij}"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 2 · веса</div><h4>Каждому пикселю соответствует ровно один вес</h4><p>Если развернуть 64 веса обратно в 8×8, видно шаблон: зелёным — координаты, где яркость говорит «семёрка», красным — где она говорит «не семёрка». Самый крупный вес стоит на пикселе (1, 4), самый отрицательный — на (6, 5): там, где у семёрки пусто, а у восьмёрки или нуля проходит штрих.</p><div class="math-display" data-tex="\mathbf w\in\mathbb{R}^{64},\qquad w_{1,4}=2{,}02,\qquad w_{6,5}=-2{,}51"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 3 · вклады</div><h4>Каждый пиксель даёт своё произведение</h4><p>Умножаем поэлементно: яркость на вес. Тёмный пиксель (нулевая яркость) не даёт вклада независимо от веса — он просто не участвует в решении.</p><div class="math-display" data-tex="x_{4,5}w_{4,5}=1{,}00\cdot1{,}21=1{,}21,\qquad x_{6,4}w_{6,4}=0{,}56\cdot(-2{,}01)=-1{,}13"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 4 · логит</div><h4>Все 64 вклада сворачиваются в одно число</h4><p>Положительные вклады дают в сумме <code>+9,05</code>, отрицательные — <code>−3,56</code>, свободный член <code>b</code> сдвигает результат вниз. До сигмоиды это ещё не вероятность: логит ничем не ограничен.</p><div class="math-display" data-tex="z=9{,}05-3{,}56-3{,}08=2{,}42"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 5 · сигмоида</div><h4>Логит переводится в вероятность</h4><p>Сигмоида сжимает любое вещественное число в интервал от 0 до 1. Ноль на входе даёт ровно 0,5; наши 2,42 — уже больше девяти десятых.</p><div class="math-display" data-tex="\hat p_7=\sigma(2{,}42)=\frac{1}{1+e^{-2{,}42}}=0{,}918"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 6 · ответ</div><h4>Модель умеет сказать только «семёрка / не семёрка»</h4><p>При пороге 0,5 получаем класс 1. Но задача распознавания цифр требует выбрать один класс из десяти, а не ответить на один вопрос — этим займёмся дальше.</p><div class="math-display" data-tex="\hat y=[\hat p_7\ge0{,}5]=1,\qquad 0{,}918\ge0{,}5"></div></div>
  </div>
</div>

<div class="callout-blue"><strong>Это в точности полносвязный нейрон.</strong> Формула <span class="math-inline" data-tex="z=\mathbf x^\top\mathbf w+b"></span> — та же, что в статье про многослойный перцептрон. Новым является только смысл координат: теперь координата <code>i</code> — это конкретный пиксель конкретного места картинки.</div>

---

## Часть 3. Десять классов, softmax и обучение шаблонов

<p>
  Для цифр 0–9 одного столбца весов мало. Берём десять столбцов: каждый выдаёт свой
  логит. Softmax сравнивает логиты между собой и превращает их в распределение
  вероятностей, сумма которого равна единице, а cross-entropy измеряет, насколько
  вероятность правильного класса далека от единицы.
</p>

<div class="math-display" data-tex="\mathbf z=W^\top\mathbf x+\mathbf b\in\mathbb{R}^{10},\qquad \hat p_k=\frac{e^{z_k}}{\sum_{j=0}^{9}e^{z_j}},\qquad L=-\log\hat p_y"></div>

<div class="stage step-stage" id="training-stage" data-stage="training" tabindex="0">
  <div class="stage-figure"><svg id="tr-viz" viewBox="0 0 960 560" role="img" aria-label="Десять столбцов весов, логиты, softmax, cross entropy и обученные шаблоны цифр"><g data-canvas=""></g></svg></div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel"><div class="step-kicker">Шаг 1 · десять вопросов</div><h4>Каждому классу нужен свой набор весов</h4><p>Столбец <code>w⁽⁰⁾</code> оценивает сходство с нулём, <code>w⁽¹⁾</code> — с единицей и так далее. Вместе они образуют матрицу весов, а к ней добавляются десять смещений.</p><div class="math-display" data-tex="W\in\mathbb{R}^{64\times10},\quad\mathbf b\in\mathbb{R}^{10}\quad\Longrightarrow\quad 64\cdot10+10=650\ \text{параметров}"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 2 · логиты</div><h4>Один вход даёт десять несравнимых пока чисел</h4><p>Логиты не обязаны быть положительными и не обязаны во что-то суммироваться. У нашей семёрки седьмой логит заметно оторвался от остальных, ближайший конкурент — тройка.</p><div class="math-display" data-tex="z_7=5{,}63,\qquad z_3=3{,}31,\qquad z_6=-5{,}03"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 3 · softmax</div><h4>Теперь классы конкурируют друг с другом</h4><p>Экспонента делает все значения положительными, деление на общую сумму — нормирует. Разница логитов в 2,3 превращается в десятикратную разницу вероятностей.</p><div class="math-display" data-tex="\hat p_7=\frac{e^{5{,}63}}{\sum_j e^{z_j}}=0{,}8903,\qquad \hat p_3=0{,}0880"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 4 · ошибка</div><h4>Cross-entropy смотрит только на правильный класс</h4><p>Истинная метка равна 7, поэтому берём минус логарифм седьмой вероятности. Чем ближе она к единице, тем ближе ошибка к нулю; при <code>p = 0,5</code> ошибка была бы 0,69, при <code>p = 0,1</code> — уже 2,3.</p><div class="math-display" data-tex="L=-\log(0{,}8903)=0{,}1162"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 5 · градиент</div><h4>Производная по логиту получается предельно простой</h4><p>Для softmax с cross-entropy градиент равен «предсказание минус правда». Для нашего объекта он равен −0,11 на седьмом классе и +0,09 на тройке: модель в основном права, поэтому и правки небольшие.</p><div class="math-display" data-tex="\frac{\partial L}{\partial z_k}=\hat p_k-y_k:\qquad -0{,}1097\ \text{для }k=7,\quad +0{,}0880\ \text{для }k=3"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 6 · выученные шаблоны</div><h4>Столбцы весов можно развернуть обратно в картинки</h4><p>Так выглядят настоящие обученные веса всех десяти классов, свёрнутые обратно в 8×8. Видно, что модель выучила именно полноразмерные шаблоны: у семёрки зелёная зона идёт по верхнему штриху и правой диагонали, а красная — в середине слева и внизу по центру, где у семёрки пусто, а у восьмёрки или нуля проходит линия.</p><div class="math-display" data-tex="\mathbf w^{(7)}\in\mathbb{R}^{64}\;\longrightarrow\;W^{(7)}\in\mathbb{R}^{8\times8}"></div></div>
  </div>
</div>

<div class="callout-blue"><strong>Модель работает.</strong> На отложенной части набора такая линейная модель даёт <strong>97,0%</strong> правильных ответов (540 объектов, 1257 в обучении). Пока никакой свёртки не нужно — и именно поэтому важно понять, что именно у неё сломается.</div>

---

## Часть 4. Что ломается при сдвиге на один пиксель

<p>
  Возьмём ту же самую цифру и сдвинем её на один пиксель вправо. Для человека
  не изменилось ничего: та же семёрка, тот же наклон, та же толщина штриха. Для
  полносвязного слоя изменилось всё, потому что вес <span class="math-inline" data-tex="w_{ij}"></span>
  жёстко закреплён за координатой <span class="math-inline" data-tex="(i,j)"></span> и
  никуда за объектом не поедет.
</p>

<div class="math-display" data-tex="z=\sum_{i=0}^{7}\sum_{j=0}^{7}X'_{ij}\,W_{ij}+b\qquad\text{против}\qquad z^{\text{сдвиг}}=\sum_{i,j}X'_{i,\,j-1}W_{ij}+b"></div>

<div class="lab" id="shift-lab">
  <div class="lab-title">Интерактив · передвиньте цифру</div>
  <p class="lab-instruction">Обученный шаблон справа остаётся на месте. Меняется только положение входной цифры — и вместе с ним ответ модели и точность на всей отложенной выборке.</p>
  <div class="stage-figure"><svg id="sh-viz" viewBox="0 0 960 545" role="img" aria-label="Сравнение сдвинутой цифры с фиксированным полносвязным шаблоном"><g data-canvas=""></g></svg></div>
  <div class="lab-controls"><div class="control-group"><label for="shift-range">Сдвиг</label><input id="shift-range" type="range" min="-2" max="2" step="1" value="0"><output id="shift-value">0</output></div><div class="chip-row"><button class="chip" type="button" data-shift="-2">←← 2</button><button class="chip" type="button" data-shift="-1">← 1</button><button class="chip active" type="button" data-shift="0">по центру</button><button class="chip" type="button" data-shift="1">1 →</button><button class="chip" type="button" data-shift="2">2 →→</button></div></div>
  <div class="lab-readout" id="shift-readout"></div>
</div>

<table class="shape-table">
  <thead><tr><th>Сдвиг вправо</th><th>Вероятность семёрки у нашей цифры</th><th>Что предсказано</th><th>Точность на 540 объектах</th></tr></thead>
  <tbody>
    <tr><td><code>−2</code></td><td><code>0,095</code></td><td>класс 4</td><td><code>12,6%</code></td></tr>
    <tr><td><code>−1</code></td><td><code>0,879</code></td><td>класс 7</td><td><code>43,7%</code></td></tr>
    <tr><td><code>0</code></td><td><code>0,890</code></td><td>класс 7</td><td><code>97,0%</code></td></tr>
    <tr><td><code>+1</code></td><td><code>0,702</code></td><td>класс 7</td><td><code>39,3%</code></td></tr>
    <tr><td><code>+2</code></td><td><code>0,261</code></td><td>класс 3</td><td><code>5,7%</code></td></tr>
  </tbody>
</table>

<div class="callout-red"><strong>97,0% → 39,3%.</strong> Один пиксель сдвига — и больше половины предсказаний становятся неверными. Ни одного пикселя не потеряно, ни одна яркость не изменилась: просто числа встретились не с теми весами. Модель выучила не форму цифры, а расположение ярких пятен в абсолютных координатах.</div>

### А если объектов на картинке два?

<p>
  Есть и вторая, менее заметная проблема. Полноразмерный шаблон выдаёт ровно одно
  число на всю картинку. Он может сказать, что «признаков семёрки в кадре много»,
  но не покажет, <em>где</em> они и сколько независимых совпадений произошло.
  Фильтр размера <span class="math-inline" data-tex="H\times W"></span> схлопывает
  всё пространство одной суммой.
</p>

<div class="math-display" data-tex="X\in\mathbb{R}^{8\times8}\quad\xrightarrow{\;W\in\mathbb{R}^{8\times8}\;}\quad z\in\mathbb{R}^{1}"></div>

<p>
  Свёртка меняет сам вопрос. Вместо «есть ли этот признак строго в координате
  <span class="math-inline" data-tex="(i,j)"></span>?» она спрашивает «есть ли этот
  локальный признак <em>здесь</em>?» — и задаёт этот вопрос во всех позициях одним
  и тем же набором весов. Ответы не складываются в одно число, а сохраняются картой.
</p>

<div class="callout"><strong>Что нам нужно от новой операции:</strong> веса, не привязанные к абсолютной координате, и результат, который остаётся картой, а не превращается в одно число. Обе части даёт одна операция — свёртка.</div>

---

## Часть 5. Одна операция свёртки

<p>
  Фильтр (он же ядро) размером 3×3 видит не всю картинку, а только окно 3×3.
  Девять яркостей умножаются на девять весов, произведения складываются, добавляется
  один общий bias. Полученное число становится одной клеткой новой карты.
</p>

<div class="math-display" data-tex="Z_{ij}=b+\sum_{u=0}^{K_h-1}\sum_{v=0}^{K_w-1}X_{i+u,\,j+v}\,K_{uv}"></div>

<p>
  Возьмём классический детектор вертикального края из лекции:
  <span class="math-inline" data-tex="K=\begin{smallmatrix}1&amp;0&amp;-1\\1&amp;0&amp;-1\\1&amp;0&amp;-1\end{smallmatrix}"></span>.
  Он складывает левый столбец окна и вычитает правый, поэтому отвечает на вопрос
  «слева ярче, чем справа?». Чтобы все числа остались целыми, считаем на исходных
  яркостях 0…16: свёртка линейна, и на нормализованном входе получилась бы ровно
  та же карта, поделённая на 16.
</p>

<div class="stage step-stage" id="conv-stage" data-stage="conv" tabindex="0">
  <div class="stage-figure"><svg id="cv-viz" viewBox="0 0 960 660" role="img" aria-label="Пошаговый расчёт одной клетки свёртки 3 на 3"><g data-canvas=""></g></svg></div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel"><div class="step-kicker">Шаг 1 · локальные веса</div><h4>Фильтр намного меньше изображения</h4><p>Девять весов против 64 у полносвязного шаблона. Столбец нулей посередине означает, что фильтру безразлична сама яркость — важен только перепад между левым и правым краем окна.</p><div class="math-display" data-tex="K\in\mathbb{R}^{3\times3},\qquad K_{00}=1,\ K_{01}=0,\ K_{02}=-1"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 2 · окно</div><h4>Берём верхний левый участок 3×3</h4><p>Клетка выхода <code>(0,0)</code> связана ровно с девятью пикселями входа — первыми тремя строками и первыми тремя столбцами. Остальные 55 пикселей в это вычисление не входят вообще.</p><div class="math-display" data-tex="P_{00}=X_{0:3,\,0:3}=\begin{bmatrix}0&amp;0&amp;3\\0&amp;4&amp;16\\0&amp;7&amp;6\end{bmatrix}"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 3 · умножения</div><h4>Каждый пиксель умножается на вес в той же локальной позиции</h4><p>Это поэлементное умножение, а не матричное произведение. Левый столбец окна пустой, поэтому положительных вкладов нет; правый столбец содержит края верхней перекладины, и они входят со знаком минус.</p><div class="math-display" data-tex="P_{00}\odot K=\begin{bmatrix}0&amp;0&amp;-3\\0&amp;0&amp;-16\\0&amp;0&amp;-6\end{bmatrix}"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 4 · сумма</div><h4>Девять вкладов сворачиваются в одно число</h4><p>Отсюда и название: локальное окно превращается в один отклик. Знак минус читается буквально — в этом окне ярче <em>справа</em>, то есть фильтр нашёл левый край штриха, а не правый.</p><div class="math-display" data-tex="Z_{00}=(0+0+0)-(3+16+6)=-25"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 5 · bias и ReLU</div><h4>После линейной операции идёт активация</h4><p>Возьмём <code>b = 0</code>. ReLU оставляет положительные отклики и обнуляет отрицательные, поэтому этот фильтр после активации сообщает только про переходы «светлое слева → тёмное справа». Левые края штрихов достанутся другому фильтру, с противоположными знаками.</p><div class="math-display" data-tex="A_{00}=\operatorname{ReLU}(-25+0)=\max(0,-25)=0"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 6 · клетка карты</div><h4>Число записывается в карту признаков</h4><p>Мы посчитали одну клетку из тридцати шести. Тот же фильтр с теми же девятью весами сдвинется на столбец вправо; в позиции <code>(0,5)</code>, где штрих заканчивается и справа начинается фон, он даст уже <code>+47</code>.</p><div class="math-display" data-tex="Z_{05}=(15+16+16)-(0+0+0)=47"></div></div>
  </div>
</div>

<div class="callout-blue"><strong>Техническая сноска:</strong> библиотеки фактически вычисляют cross-correlation — ядро не переворачивается. В математическом определении свёртки фильтр сначала отражают по обеим осям. В deep learning операцию всё равно называют convolution: веса обучаются, и переворот ничего не меняет в выразительности слоя.</div>

---

## Часть 6. Один фильтр заполняет всю карту признаков

<p>
  После первой клетки окно сдвигается вправо, а когда строка заканчивается —
  переходит ниже. При шаге 1 фильтр 3×3 помещается в картинку 8×8 ровно в
  тридцати шести позициях, поэтому результат имеет размер 6×6.
</p>

<div class="math-display" data-tex="H_{out}=H-K_h+1=8-3+1=6,\qquad W_{out}=W-K_w+1=6,\qquad H_{out}W_{out}=36"></div>

<div class="lab" id="scan-lab">
  <div class="lab-title">Интерактив · проведите фильтр по всем позициям</div>
  <p class="lab-instruction">Ползунок выбирает одну из 36 позиций. Окно на входе, подстановка чисел и клетка результата связаны между собой.</p>
  <div class="stage-figure"><svg id="sc-viz" viewBox="0 0 960 520" role="img" aria-label="Сканирование матрицы 8 на 8 фильтром 3 на 3 и заполнение карты 6 на 6"><g data-canvas=""></g></svg></div>
  <div class="lab-controls"><div class="control-group"><label for="scan-range">Позиция</label><input id="scan-range" type="range" min="0" max="35" step="1" value="0"><output id="scan-value">1 / 36</output></div><button type="button" id="scan-fill">Заполнить всю карту</button><button type="button" id="scan-reset">Сначала</button></div>
  <div class="lab-readout" id="scan-readout"></div>
</div>

<p>
  Пролистайте позиции до правого края цифры: там отклики становятся большими и
  положительными (максимум <code>+47</code> в клетке <code>(0,5)</code>), а слева от
  штриха — большими и отрицательными. Ноль означает, что перепада в этом окне нет:
  фон, ровная заливка или симметричное окружение.
</p>

<p>
  Главное свойство видно прямо на схеме: во всех тридцати шести позициях используется
  <strong>один и тот же</strong> массив <span class="math-inline" data-tex="K"></span>.
  Это и называется разделением весов (weight sharing). Число параметров при этом не
  зависит от размера картинки.
</p>

<table class="shape-table">
  <thead><tr><th>Величина</th><th>Форма</th><th>Параметров</th><th>Что хранит</th></tr></thead>
  <tbody>
    <tr><td><code>X</code></td><td><code>8×8</code></td><td>—</td><td>яркости рукописной цифры</td></tr>
    <tr><td><code>K</code></td><td><code>3×3</code></td><td><code>9</code></td><td>девять общих весов</td></tr>
    <tr><td><code>b</code></td><td><code>1</code></td><td><code>1</code></td><td>один общий сдвиг фильтра</td></tr>
    <tr><td><code>Z</code></td><td><code>6×6</code></td><td>—</td><td>сырые отклики во всех позициях</td></tr>
    <tr><td><code>A=ReLU(Z)</code></td><td><code>6×6</code></td><td>—</td><td>активированная карта признаков</td></tr>
  </tbody>
</table>

<div class="callout"><strong>Десять параметров против шестисот пятидесяти.</strong> Полносвязная модель из части 3 хранила <code>64·10+10 = 650</code> весов и была привязана к координатам. Один свёрточный фильтр хранит <code>3·3+1 = 10</code> весов и работает в любой позиции — и остался бы десятипараметрическим даже на картинке 1000×1000.</div>

---

## Часть 7. Несколько фильтров, каналы и RGB

<p>
  Один фильтр отвечает на один вопрос. Чтобы одновременно искать вертикальные края,
  горизонтальные штрихи, углы и всё остальное, слой обучает несколько фильтров.
  Каждый строит свою карту, а карты складываются в стопку по новой оси — оси каналов.
</p>

<div class="math-display" data-tex="Z^{(m)}_{ij}=b^{(m)}+\sum_{c=1}^{C_{in}}\sum_{u=0}^{K_h-1}\sum_{v=0}^{K_w-1}X_{c,\,i+u,\,j+v}\,K^{(m)}_{c,u,v},\qquad m=1,\ldots,C_{out}"></div>

<div class="stage step-stage" id="channels-stage" data-stage="channels" tabindex="0">
  <div class="stage-figure"><svg id="ch-viz" viewBox="0 0 960 590" role="img" aria-label="Несколько фильтров, стек карт, RGB-каналы и подсчёт параметров слоя"><g data-canvas=""></g></svg></div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel"><div class="step-kicker">Шаг 1 · второй фильтр</div><h4>Другие веса — другой вопрос к той же картинке</h4><p>Повернём ядро на 90°: теперь оно вычитает нижнюю строку окна из верхней и ищет горизонтальные края. На нашей семёрке оно откликается там, где вертикальный фильтр молчал — на верхней перекладине и на средней планке.</p><div class="math-display" data-tex="K^{(2)}=\begin{bmatrix}1&amp;1&amp;1\\0&amp;0&amp;0\\-1&amp;-1&amp;-1\end{bmatrix},\qquad Z^{(2)}_{11}=30,\qquad Z^{(2)}_{44}=33"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 2 · две карты</div><h4>Число фильтров становится глубиной выхода</h4><p>Это не два отдельных изображения, а два представления одного и того же входа: пространственные координаты у них общие, различается только смысл канала.</p><div class="math-display" data-tex="Z=\operatorname{stack}\bigl(Z^{(1)},Z^{(2)}\bigr)\in\mathbb{R}^{2\times6\times6}"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 3 · цветной вход</div><h4>RGB — это три согласованные матрицы</h4><p>Красный, зелёный и синий каналы имеют одни и те же координаты <code>H×W</code>. Поэтому цветная картинка — не три картинки, а один тензор с осью глубины.</p><div class="math-display" data-tex="X=(X_R,X_G,X_B)\in\mathbb{R}^{3\times H\times W},\qquad [3,6,6]"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 4 · глубина фильтра</div><h4>Глубина фильтра всегда равна числу входных каналов</h4><p>Для RGB «фильтр 3×3» на самом деле имеет форму <code>3×3×3</code>: по одной матрице весов на канал. Это жёсткое правило — не совпадение размеров, а условие, без которого свёртка не определена.</p><div class="math-display" data-tex="C_{in}=3\ \Longrightarrow\ K^{(m)}\in\mathbb{R}^{3\times3\times3}\ \text{— }3\cdot3\cdot3=27\ \text{весов}"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 5 · сумма по каналам</div><h4>27 произведений дают одно число, а не три</h4><p>У каждого из трёх каналов своё окно 3×3 и своя матрица весов. Внутри канала считаем обычную свёртку — девять произведений в частичную сумму: красный даёт <code>+2</code>, зелёный <code>+3</code>, синий <code>−1</code>. Затем три частичные суммы складываются с общим bias в <strong>одну</strong> клетку одной карты. Поэтому свёртка <code>6×6×3</code> ядром <code>3×3×3</code> даёт плоский результат, а не объём.</p><div class="math-display" data-tex="z=\underbrace{2}_{R}+\underbrace{3}_{G}+\underbrace{(-1)}_{B}+\underbrace{0{,}5}_{b}=4{,}5"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 6 · слой целиком</div><h4>Свёрточный слой — это те же три действия, что и в полносвязном</h4><p>Линейная операция, прибавление bias, нелинейность. В обозначениях обычной сети это ровно переход от <code>a⁽⁰⁾</code> к <code>a⁽¹⁾</code>, только линейная часть устроена как скользящее окно.</p><div class="math-display" data-tex="Z^{[1]}=K^{[1]}\ast a^{[0]}+b^{[1]},\qquad a^{[1]}=g\bigl(Z^{[1]}\bigr)"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 7 · параметры</div><h4>Один фильтр — 27 весов плюс один bias</h4><p>Классический вопрос лекции: сколько параметров у слоя из десяти фильтров <code>3×3×3</code>? Ответ не зависит от размера картинки — ни 1000×1000, ни 5000×5000 его не меняют.</p><div class="math-display" data-tex="10\cdot(3\cdot3\cdot3+1)=10\cdot28=280"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 8 · форма выхода</div><h4>Вход 6×6×3 превращается в 4×4×2</h4><p>Два фильтра <code>3×3×3</code> дают два канала по 4×4. Пространственный размер задают <code>K</code>, <code>P</code> и <code>S</code>, а глубину — только число фильтров.</p><div class="math-display" data-tex="[3,6,6]\;\xrightarrow{\;2\times K^{(m)}\in\mathbb{R}^{3\times3\times3}\;}\;[2,4,4]"></div></div>
  </div>
</div>

<div class="callout"><strong>Число фильтров и глубина фильтра — разные вещи.</strong> Глубина каждого фильтра продиктована входом (<span class="math-inline" data-tex="C_{in}"></span>), а число фильтров вы выбираете сами — оно и становится <span class="math-inline" data-tex="C_{out}"></span>, глубиной входа для следующего слоя.</div>

---

## Часть 8. Padding и stride управляют геометрией

<p>
  У свёртки без дополнения есть два недостатка, о которых стоит сказать прямо.
  Первый: картинка сжимается на каждом слое — 8×8 стало 6×6, и после нескольких
  слоёв от неё ничего не останется. Второй: угловой пиксель попадает ровно в одно
  окно, а центральный — в девять, поэтому информация с краёв используется хуже.
</p>

<p>
  <strong>Padding</strong> добавляет рамку из нулей и лечит обе проблемы.
  <strong>Stride</strong> — наоборот, задаёт шаг окна: при <code>S = 2</code> фильтр
  перескакивает через позицию и карта уменьшается примерно вдвое.
</p>

<div class="math-display" data-tex="H_{out}=\left\lfloor\frac{H+2P-K_h}{S}\right\rfloor+1,\qquad W_{out}=\left\lfloor\frac{W+2P-K_w}{S}\right\rfloor+1"></div>

<div class="lab" id="shape-lab">
  <div class="lab-title">Интерактив · калькулятор формы</div>
  <p class="lab-instruction">Меняйте размер ядра, padding и stride. Схема показывает допустимые позиции верхнего левого угла окна, формула — подстановку ваших чисел.</p>
  <div class="stage-figure"><svg id="sp-viz" viewBox="0 0 960 495" role="img" aria-label="Влияние padding и stride на размер выхода свёртки"><g data-canvas=""></g></svg></div>
  <div class="lab-controls">
    <div class="control-group"><label for="kernel-range">Ядро K</label><input id="kernel-range" type="range" min="2" max="5" step="1" value="3"><output id="kernel-value">3</output></div>
    <div class="control-group"><label for="padding-range">Padding P</label><input id="padding-range" type="range" min="0" max="2" step="1" value="0"><output id="padding-value">0</output></div>
    <div class="control-group"><label for="stride-range">Stride S</label><input id="stride-range" type="range" min="1" max="3" step="1" value="1"><output id="stride-value">1</output></div>
  </div>
  <div class="lab-readout" id="shape-readout"></div>
</div>

<div class="callout-yellow"><strong>Остаток от деления важен:</strong> в формуле стоит floor. Если в последней позиции окно не помещается целиком, библиотека не создаёт «неполную» клетку выхода, а просто отбрасывает хвост. При <code>K=4</code>, <code>P=0</code>, <code>S=3</code> из восьми столбцов используются только первые семь.</div>

<table class="shape-table">
  <thead><tr><th>Настройка</th><th>Подстановка для входа 8×8</th><th>Выход</th><th>Как называется</th></tr></thead>
  <tbody>
    <tr><td><code>K=3, P=0, S=1</code></td><td><code>(8+0−3)/1+1 = 6</code></td><td><code>6×6</code></td><td>valid</td></tr>
    <tr><td><code>K=3, P=1, S=1</code></td><td><code>(8+2−3)/1+1 = 8</code></td><td><code>8×8</code></td><td>same</td></tr>
    <tr><td><code>K=3, P=0, S=2</code></td><td><code>⌊(8−3)/2⌋+1 = 3</code></td><td><code>3×3</code></td><td>strided</td></tr>
    <tr><td><code>K=5, P=2, S=1</code></td><td><code>(8+4−5)/1+1 = 8</code></td><td><code>8×8</code></td><td>same</td></tr>
  </tbody>
</table>

<div class="callout"><strong>Правило same-свёртки:</strong> размер сохраняется при <span class="math-inline" data-tex="P=(K-1)/2"></span> — отсюда и привычка брать нечётные ядра. Для <code>K=3</code> нужен <code>P=1</code>, для <code>K=5</code> — <code>P=2</code>. У чётного ядра такого целого <code>P</code> нет, и рамку пришлось бы делать несимметричной.</div>

---

## Часть 9. Pooling: сжать карту и не потерять признак

<p>
  Карта признаков всё ещё большая, а соседние клетки в ней сильно похожи: окна
  перекрываются, и один и тот же край попадает сразу в несколько откликов.
  Pooling разбивает карту на участки и оставляет от каждого одно число. Обучаемых
  весов у него нет — только гиперпараметры <span class="math-inline" data-tex="f"></span>
  и <span class="math-inline" data-tex="s"></span>, поэтому градиентному спуску здесь нечего настраивать.
</p>

<div class="math-display" data-tex="\text{MaxPool}(A)_{ij}=\max_{0\le u,v&lt;f}A_{is+u,\,js+v},\qquad H_{out}=\left\lfloor\frac{H-f}{s}\right\rfloor+1"></div>

<div class="stage step-stage" id="pool-stage" data-stage="pool" tabindex="0">
  <div class="stage-figure"><svg id="pl-viz" viewBox="0 0 960 545" role="img" aria-label="Max pooling и average pooling карты признаков, независимость каналов и устойчивость к сдвигу"><g data-canvas=""></g></svg></div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel"><div class="step-kicker">Шаг 1 · разбиение</div><h4>Карта делится на непересекающиеся окна</h4><p>Берём стандартные значения: окно <code>2×2</code> и шаг <code>2</code>. Окна не перекрываются, потому что шаг равен размеру окна, и карта 6×6 распадается ровно на девять участков.</p><div class="math-display" data-tex="f=2,\ s=2:\qquad H_{out}=\left\lfloor\frac{6-2}{2}\right\rfloor+1=3"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 2 · максимум</div><h4>От каждого окна остаётся самый сильный отклик</h4><p>В верхнем левом окне активаций почти нет, и от него остаётся 1. В правом верхнем стоят отклики правого края штриха — остаётся 47. Максимум по окну отвечает на вопрос «был ли здесь признак хоть где-нибудь?», а не «где именно он был».</p><div class="math-display" data-tex="\max\begin{bmatrix}0&amp;0\\0&amp;1\end{bmatrix}=1,\qquad \max\begin{bmatrix}18&amp;47\\14&amp;44\end{bmatrix}=47"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 3 · результат</div><h4>Карта 6×6 стала 3×3</h4><p>Данных вчетверо меньше, дальнейшие слои считаются быстрее, а самый сильный отклик каждого участка сохранён. Заодно исчезла часть мелких сдвигов: если бы край сместился на одну клетку внутри окна, максимум остался бы тем же числом.</p><div class="math-display" data-tex="A\in\mathbb{R}^{6\times6}\;\longrightarrow\;\text{MaxPool}_{2,2}(A)\in\mathbb{R}^{3\times3},\qquad 36\to9"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 4 · average pooling</div><h4>Второй вариант — среднее вместо максимума</h4><p>Average pooling усредняет окно и потому размывает одиночные сильные отклики: 47 и 44 превращаются в 30,75 и 32,00. Сегодня max pooling используют заметно чаще, а среднее обычно встречается в самом конце сети, в виде global average pooling.</p><div class="math-display" data-tex="\frac{18+47+14+44}{4}=30{,}75\qquad\text{против}\qquad\max=47"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 5 · каналы</div><h4>Pooling работает над каждым каналом отдельно</h4><p>Он уменьшает только высоту и ширину и никогда не смешивает каналы между собой, поэтому глубина проходит насквозь без изменений. С другими гиперпараметрами работает та же формула: окно <code>3×3</code> с шагом 1 превращает 5×5 в 3×3.</p><div class="math-display" data-tex="[n_C,5,5]\;\xrightarrow{\;f=3,\ s=1\;}\;[n_C,3,3],\qquad\text{параметров: }0"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 6 · сдвиг</div><h4>Вот теперь сдвиг картинки перестаёт быть катастрофой</h4><p>Сдвинем ту же цифру на пиксель влево. Карта признаков сдвигается ровно на ту же клетку — это проверяется поэлементно и называется эквивариантностью. А максимум по карте вообще не меняется: 47 остаётся 47, тогда как у полносвязного шаблона из части 4 при таком же сдвиге точность падала с 97,0% до 43,7%.</p><div class="math-display" data-tex="A^{\text{сдвиг}}_{i,j-1}=A_{ij},\qquad \max_{ij}A^{\text{сдвиг}}=\max_{ij}A=47"></div></div>
  </div>
</div>

<div class="callout"><strong>Свёртка эквивариантна, pooling добавляет устойчивость.</strong> Сама свёртка не делает ответ независимым от положения — она аккуратно переносит признак вместе с объектом. Инвариантность появляется только после агрегирования: max pooling, global average pooling или финального линейного слоя над сжатой картой.</div>

---

## Часть 10. Рецептивное поле: что видит глубокий слой

<p>
  Клетка первой карты зависит от окна 3×3 исходного изображения. Клетка второго
  свёрточного слоя смотрит на окно 3×3 <em>первой карты</em> — но каждая клетка этой
  карты сама собрана из своего окна входа. Поэтому на исходной картинке она
  косвенно видит уже 5×5 пикселей. Это её <strong>рецептивное поле</strong>.
</p>

<div class="stage step-stage" id="rf-stage" data-stage="receptive" tabindex="0">
  <div class="stage-figure"><svg id="rf-viz" viewBox="0 0 960 590" role="img" aria-label="Рост рецептивного поля через два свёрточных слоя"><g data-canvas=""></g></svg></div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel"><div class="step-kicker">Шаг 1 · первый слой</div><h4>Одна клетка Conv 1 напрямую видит девять пикселей</h4><p>Линии связывают выбранную клетку карты с тем самым окном входа, из которого она посчитана. Ни один пиксель за пределами окна на неё не влияет.</p><div class="math-display" data-tex="r_1=K_1=3,\qquad 3\times3=9\ \text{пикселей}"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 2 · второй слой</div><h4>Одна клетка Conv 2 видит 3×3 клеток Conv 1</h4><p>На своём собственном входе — карте первого слоя — область по-прежнему имеет размер 3×3. Второй слой не знает, что его вход был получен свёрткой; для него это просто тензор.</p><div class="math-display" data-tex="A^{(1)}\in\mathbb{R}^{6\times6}\;\xrightarrow{\;K_2=3\;}\;A^{(2)}\in\mathbb{R}^{4\times4}"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 3 · косвенная область</div><h4>На исходном изображении это уже 5×5</h4><p>Соседние окна первого слоя перекрываются и сдвинуты друг относительно друга на один пиксель. Их объединение накрывает пять строк и пять столбцов входа — четверть нашей картинки вместо одной седьмой.</p><div class="math-display" data-tex="r_2=r_1+(K_2-1)=3+2=5,\qquad 5\times5=25\ \text{пикселей}"></div></div>
    <div class="step-panel"><div class="step-kicker">Шаг 4 · общая рекурсия</div><h4>Глубина собирает контекст быстрее, чем растут ядра</h4><p>Мы по-прежнему смотрим на <em>ту же самую</em> клетку Conv 2 — поэтому её подсветка не меняется. Меняется то, во что она разворачивается влево: на своём входе это 3×3 клеток Conv 1, а те, перекрываясь, покрывают 5×5 пикселей входа. При шаге 1 каждый слой добавляет к рецептивному полю <code>K−1</code>; если где-то стоял stride или pooling, накопленный шаг <code>j</code> между соседними клетками растёт, и следующий слой прибавляет уже кратно больше.</p><div class="math-display" data-tex="r_l=r_{l-1}+(K_l-1)\,j_{l-1},\qquad j_l=j_{l-1}S_l"></div></div>
  </div>
</div>

<div class="callout"><strong>Три слоя 3×3 видят столько же, сколько один 7×7</strong> (<span class="math-inline" data-tex="3\to5\to7"></span>), но стоят <span class="math-inline" data-tex="3\cdot9=27"></span> весов вместо 49 и содержат две дополнительные нелинейности. Именно поэтому современные сети строят из маленьких ядер.</div>

---

<style>
  .cnn-svg text { font-family: Helvetica, Arial, sans-serif; }
  .cnn-svg .v-title { font-size: 19px; font-weight: 700; fill: #111; }
  .cnn-svg .v-small { font-size: 13px; fill: #5E5850; }
  .cnn-svg .v-tiny  { font-size: 11px; fill: #5E5850; }
  .cnn-svg .layer-name { font-size: 13px; font-weight: 700; fill: #111; }
  .cnn-svg .tensor-name { font-size: 13px; font-style: italic; fill: #111; }
  .cnn-svg .box-blue   { fill:#EAF2FA; stroke:#3576C0; stroke-width:2; }
  .cnn-svg .box-yellow { fill:#FFF8D9; stroke:#C29E08; stroke-width:2; }
  .cnn-svg .box-green  { fill:#F0FAF0; stroke:#73B222; stroke-width:2; }
  .cnn-svg .box-red    { fill:#FDECEC; stroke:#C30B0A; stroke-width:2; }
  .cnn-svg .edge-green { stroke:#73B222; stroke-width:2; fill:none; }
  .cnn-svg .edge-red   { stroke:#C30B0A; stroke-width:2; fill:none; }
  .cnn-svg .formula-bg { fill:#FAFAF8; stroke:#E4E1D7; stroke-width:1.5; }
  .cnn-svg .cell       { stroke:#C9C2B8; stroke-width:1; }
  .cnn-svg .cellnum    { font-size:12px; fill:#111; }
  .cnn-svg .gridlabel  { font-size:12px; fill:#5E5850; }
  .stage-figure foreignObject { overflow: hidden; }
  .stage-figure [data-key] { transition: opacity .22s ease; }
  .stage-figure .is-dim { opacity: .12; }
  .stage-figure .is-hidden { display: none; }
  .stage-figure .is-focus text { font-weight: 700; }
  .stage-hint { font-size: 13px; color: #5E5850; margin: 6px 0 26px; }
  .step-panel h4 { font-size: 20px; font-weight: 750; margin: 0 0 6px; line-height: 1.3; }
  @media (prefers-reduced-motion: reduce) { .stage-figure [data-key] { transition: none; } }
</style>

## Часть 11. Обучение свёртки: сеть, которую можно посчитать руками

<p>
  До сих пор цифра шла по сети только вперёд, а фильтры мы задавали руками. Но
  свёрточный слой обучается тем же циклом, что и логистический нейрон из части 3:
  forward → loss → backward → update. Новое здесь одно — локальные производные
  свёртки и пулинга. Чтобы каждое число обратного прохода поместилось на экран,
  уменьшим задачу до сети, которую можно пересчитать на бумаге.
</p>

<p>
  Вход — картинка 5×5 с яркостями 0…16, делёнными на 16, как в части 1. Она подобрана
  вручную: в самом наборе <code>digits</code> такого фрагмента нет, поэтому это не
  объект №1330, а отдельный учебный пример. Дальше четыре операции: свёртка одним
  фильтром 3×3 — тем же детектором вертикального края из части 5, только с весом 0,5
  в центре — и общим сдвигом <span class="math-inline" data-tex="b=0{,}2"></span>,
  ReLU, max-пулинг окном 2×2 с шагом 1 и линейный слой на два класса. Всё
  заканчивается softmax и cross-entropy. Веса заданы вручную и не обучены.
</p>

<div class="math-display" data-tex="K=\begin{bmatrix}1&amp;0&amp;-1\\1&amp;0{,}5&amp;-1\\1&amp;0&amp;-1\end{bmatrix},\quad b=0{,}2,\qquad W=\begin{bmatrix}0{,}6&amp;-0{,}6&amp;0{,}3&amp;-0{,}1\\-0{,}5&amp;0{,}5&amp;-0{,}2&amp;0{,}2\end{bmatrix},\quad \mathbf c=\begin{bmatrix}1\\0{,}8\end{bmatrix}"></div>

<div class="math-display" data-tex="X\in\mathbb{R}^{5\times5}\;\xrightarrow{\;K,\,b\;}\;Z\in\mathbb{R}^{3\times3}\;\xrightarrow{\;\mathrm{ReLU}\;}\;A\;\xrightarrow{\;\text{maxpool}\;}\;P\in\mathbb{R}^{2\times2}\;\xrightarrow{\;W,\,\mathbf c\;}\;\mathbf z\in\mathbb{R}^{2}\;\to\;\mathbf p,\ \mathcal L"></div>

<div class="stage" id="stageArch" tabindex="0" aria-label="Архитектура маленькой свёрточной сети">
  <div class="stage-figure">
    <svg class="cnn-svg" id="ar-svg" viewBox="0 0 940 298" role="img" aria-label="Цепочка блоков: вход, свёртка, ReLU, пулинг, линейный слой, softmax, ошибка">
      <defs><marker id="ar-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
      <text x="30" y="40" class="v-title">Шесть блоков, параметры только в жёлтых</text>
      <text x="30" y="62" class="v-small">Синий — данные, жёлтый — обучаемая операция, зелёный — активация и пулинг, красный — ошибка.</text>
      <g data-key="ar-x"><rect x="24" y="96" width="96" height="150" rx="10" class="box-blue"/><text x="72" y="171" text-anchor="middle" class="layer-name" transform="rotate(-90 72 171)">Input</text><text x="72" y="266" text-anchor="middle" class="v-small">X · 5×5</text><text x="72" y="284" text-anchor="middle" class="v-tiny">0 параметров</text></g>
      <g data-key="ar-c"><path d="M120 171 L150 171" class="edge-green" marker-end="url(#ar-arrow)"/><text x="135" y="150" text-anchor="middle" class="tensor-name">X</text><rect x="152" y="96" width="110" height="150" rx="10" class="box-yellow"/><text x="207" y="171" text-anchor="middle" class="layer-name" transform="rotate(-90 207 171)">Conv</text><text x="207" y="266" text-anchor="middle" class="v-small">K · 3×3, b</text><text x="207" y="284" text-anchor="middle" class="v-tiny">10 параметров</text></g>
      <g data-key="ar-r"><path d="M262 171 L292 171" class="edge-green" marker-end="url(#ar-arrow)"/><text x="277" y="150" text-anchor="middle" class="tensor-name">Z</text><rect x="294" y="96" width="96" height="150" rx="10" class="box-green"/><text x="342" y="171" text-anchor="middle" class="layer-name" transform="rotate(-90 342 171)">ReLU</text><text x="342" y="266" text-anchor="middle" class="v-small">A = max(0,Z)</text><text x="342" y="284" text-anchor="middle" class="v-tiny">0 параметров</text></g>
      <g data-key="ar-p"><path d="M390 171 L420 171" class="edge-green" marker-end="url(#ar-arrow)"/><text x="405" y="150" text-anchor="middle" class="tensor-name">A</text><rect x="422" y="96" width="104" height="150" rx="10" class="box-green"/><text x="474" y="171" text-anchor="middle" class="layer-name" transform="rotate(-90 474 171)">MaxPool</text><text x="474" y="266" text-anchor="middle" class="v-small">P · 2×2</text><text x="474" y="284" text-anchor="middle" class="v-tiny">0 параметров</text></g>
      <g data-key="ar-f"><path d="M526 171 L556 171" class="edge-green" marker-end="url(#ar-arrow)"/><text x="541" y="150" text-anchor="middle" class="tensor-name">p</text><rect x="558" y="96" width="110" height="150" rx="10" class="box-yellow"/><text x="613" y="171" text-anchor="middle" class="layer-name" transform="rotate(-90 613 171)">Linear</text><text x="613" y="266" text-anchor="middle" class="v-small">W · 2×4, c</text><text x="613" y="284" text-anchor="middle" class="v-tiny">10 параметров</text></g>
      <g data-key="ar-s"><path d="M668 171 L698 171" class="edge-green" marker-end="url(#ar-arrow)"/><text x="683" y="150" text-anchor="middle" class="tensor-name">z</text><rect x="700" y="96" width="96" height="150" rx="10" class="box-green"/><text x="748" y="171" text-anchor="middle" class="layer-name" transform="rotate(-90 748 171)">Softmax</text><text x="748" y="266" text-anchor="middle" class="v-small">p · 2</text><text x="748" y="284" text-anchor="middle" class="v-tiny">0 параметров</text></g>
      <g data-key="ar-l"><path d="M796 171 L826 171" class="edge-green" marker-end="url(#ar-arrow)"/><text x="811" y="150" text-anchor="middle" class="tensor-name">p</text><rect x="828" y="96" width="96" height="150" rx="10" class="box-red"/><text x="876" y="171" text-anchor="middle" class="layer-name" transform="rotate(-90 876 171)">Loss</text><text x="876" y="266" text-anchor="middle" class="v-small">L</text></g>
                                                    </svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ar-x" data-focus="ar-x"><div class="step-kicker">Шаг 1 · вход</div><h4>Двадцать пять яркостей</h4><p>Картинка 5×5, делённая на 16. Это единственные данные; всё остальное сеть вычислит из них и своих весов.</p></div>
    <div class="step-panel" data-on="ar-x ar-c" data-focus="ar-c"><div class="step-kicker">Шаг 2 · свёртка</div><h4>Один фильтр 3×3 и общий сдвиг</h4><p>Окно 3×3 помещается в картинку 5×5 девятью способами, поэтому выход <span class="math-inline" data-tex="Z"></span> имеет размер 3×3. Веса общие для всех девяти позиций.</p></div>
    <div class="step-panel" data-on="ar-c ar-r" data-focus="ar-r"><div class="step-kicker">Шаг 3 · ReLU</div><h4>Отрицательное закрывается</h4><p>У ReLU нет параметров, но есть память: то, какие клетки оказались положительными, определит, куда backward пропустит градиент.</p></div>
    <div class="step-panel" data-on="ar-r ar-p" data-focus="ar-p"><div class="step-kicker">Шаг 4 · пулинг</div><h4>Окно 2×2 с шагом 1</h4><p>Шаг здесь единица, а не два, поэтому окна перекрываются, а из 3×3 получается 2×2. В обратном проходе перекрытие превратится в сумму вкладов.</p></div>
    <div class="step-panel" data-on="ar-p ar-f" data-focus="ar-f"><div class="step-kicker">Шаг 5 · линейный слой</div><h4>Четыре числа → два логита</h4><p>Карту 2×2 распрямляем в вектор из четырёх чисел, дальше — обычный полносвязный слой. Здесь ещё 10 параметров.</p></div>
    <div class="step-panel" data-on="ar-f ar-s" data-focus="ar-s"><div class="step-kicker">Шаг 6 · softmax</div><h4>Два логита → две вероятности</h4><p>Экспонента и нормировка. Правильный класс — индекс 1.</p></div>
    <div class="step-panel" data-on="ar-x ar-c ar-r ar-p ar-f ar-s ar-l" data-focus="ar-l"><div class="step-kicker">Шаг 7 · ошибка</div><h4>Вся сеть — одно число</h4><p>Cross-entropy сворачивает распределение в скаляр <span class="math-inline" data-tex="\mathcal L"></span>. Именно по нему берутся производные всех параметров.</p></div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки для навигации.</p>

<div class="callout">
  <strong>Двадцать параметров, четыре операции.</strong> Свёрточная и полносвязная
  части хранят по десять весов; ReLU, пулинг и softmax не обучаются. Дальше мы
  проведём один объект через всю цепочку и вернём градиент обратно.
</div>

---

## Часть 12. Forward в формулах

<p>
  Сначала общий вид каждой операции — без чисел. Свёртка суммирует девять
  произведений «пиксель × вес» и добавляет сдвиг; ReLU обрезает отрицательное;
  пулинг берёт максимум по окну; линейный слой — матричное умножение; softmax и
  cross-entropy закрывают цепочку.
</p>

<div class="stage" id="stageFF" tabindex="0" aria-label="Forward свёрточной сети в формулах">
  <div class="stage-figure">
    <svg class="cnn-svg" id="ff-svg" viewBox="0 0 940 240" role="img" aria-label="Формулы каждого слоя прямого прохода">
      <defs><marker id="ff-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
      <text x="30" y="38" class="v-title">Forward: формула каждого слоя</text>
      <g data-key="ff-x"><rect x="24" y="70" width="92" height="150" rx="10" class="box-blue"/><text x="70" y="145" text-anchor="middle" class="layer-name" transform="rotate(-90 70 145)">Input</text></g>
      <g data-key="ff-c"><path d="M116 145 L146 145" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="148" y="70" width="104" height="150" rx="10" class="box-yellow"/><text x="200" y="145" text-anchor="middle" class="layer-name" transform="rotate(-90 200 145)">Conv</text></g>
      <g data-key="ff-r"><path d="M252 145 L282 145" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="284" y="70" width="92" height="150" rx="10" class="box-green"/><text x="330" y="145" text-anchor="middle" class="layer-name" transform="rotate(-90 330 145)">ReLU</text></g>
      <g data-key="ff-p"><path d="M376 145 L406 145" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="408" y="70" width="100" height="150" rx="10" class="box-green"/><text x="458" y="145" text-anchor="middle" class="layer-name" transform="rotate(-90 458 145)">MaxPool</text></g>
      <g data-key="ff-f"><path d="M508 145 L538 145" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="540" y="70" width="104" height="150" rx="10" class="box-yellow"/><text x="592" y="145" text-anchor="middle" class="layer-name" transform="rotate(-90 592 145)">Linear</text></g>
      <g data-key="ff-s"><path d="M644 145 L674 145" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="676" y="70" width="92" height="150" rx="10" class="box-green"/><text x="722" y="145" text-anchor="middle" class="layer-name" transform="rotate(-90 722 145)">Softmax</text></g>
      <g data-key="ff-l"><path d="M768 145 L798 145" class="edge-green" marker-end="url(#ff-arrow)"/><rect x="800" y="70" width="120" height="150" rx="10" class="box-red"/><text x="860" y="145" text-anchor="middle" class="layer-name" transform="rotate(-90 860 145)">Loss</text></g>
                                                    </svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ff-x" data-focus="ff-x"><div class="step-kicker">Шаг 1 · вход и параметры</div><h4>Что фиксировано на один forward</h4><div class="math-display" data-fwdf-tex="fx"></div><p>Матрица <span class="math-inline" data-tex="X"></span>, ядро <span class="math-inline" data-tex="K"></span>, сдвиг <span class="math-inline" data-tex="b"></span>, матрица <span class="math-inline" data-tex="W"></span> и вектор <span class="math-inline" data-tex="\mathbf c"></span> не меняются.</p></div>
    <div class="step-panel" data-on="ff-x ff-c" data-focus="ff-c"><div class="step-kicker">Шаг 2 · свёртка</div><h4>Одна клетка — девять произведений плюс сдвиг</h4><div class="math-display" data-fwdf-tex="fc"></div><p>Ядро скользит по всем девяти позициям одними и теми же весами (weight sharing).</p></div>
    <div class="step-panel" data-on="ff-c ff-r" data-focus="ff-r"><div class="step-kicker">Шаг 3 · ReLU</div><h4>Поэлементное обрезание снизу</h4><div class="math-display" data-fwdf-tex="fr"></div><p>Производная равна 1 там, где отклик был положителен, и 0 в остальных клетках.</p></div>
    <div class="step-panel" data-on="ff-r ff-p" data-focus="ff-p"><div class="step-kicker">Шаг 4 · max-пулинг</div><h4>Максимум по окну 2×2</h4><div class="math-display" data-fwdf-tex="fp"></div><p>Запоминаем адрес победителя в каждом окне — он понадобится в backward.</p></div>
    <div class="step-panel" data-on="ff-p ff-f" data-focus="ff-f"><div class="step-kicker">Шаг 5 · линейный слой</div><h4>Распрямляем и умножаем на матрицу</h4><div class="math-display" data-fwdf-tex="ff"></div><p>Карта 2×2 становится вектором <span class="math-inline" data-tex="\mathbf p"></span> из четырёх чисел, затем <span class="math-inline" data-tex="\mathbf z=W\mathbf p+\mathbf c"></span>.</p></div>
    <div class="step-panel" data-on="ff-f ff-s" data-focus="ff-s"><div class="step-kicker">Шаг 6 · softmax</div><h4>Логиты → вероятности</h4><div class="math-display" data-fwdf-tex="fs"></div><p>Вычитаем максимум для устойчивости и нормируем экспоненты.</p></div>
    <div class="step-panel" data-on="ff-x ff-c ff-r ff-p ff-f ff-s ff-l" data-focus="ff-l"><div class="step-kicker">Шаг 7 · loss</div><h4>Минус логарифм правильной вероятности</h4><div class="math-display" data-fwdf-tex="fl"></div><p>Правильный класс — индекс 1; loss тем меньше, чем ближе <span class="math-inline" data-tex="p_1"></span> к единице.</p></div>
  </div>
</div>
<p class="stage-hint">Формулы даны в общем виде; в следующей части те же шаги проходят на конкретных числах.</p>

<div class="callout">
  <strong>Пять формул — весь прямой проход.</strong> Свёртка и линейный слой —
  линейные операции с параметрами; ReLU, пулинг, softmax — фиксированные
  нелинейности. Backward будет ровно этой же цепочкой, пройденной справа налево.
</div>

### Тот же forward по элементам матриц

<p>Тот же полный прогон, что и на числах, но по элементам: <span class="math-inline" data-tex="x_{i,j}"></span> вместо чисел. Сверху виден текущий шаг; при «Далее» добавляется следующая матрица.</p>

<div class="stage" id="stageSF" tabindex="0" aria-label="Тот же forward по элементам матриц">
  <div class="stage-figure">
<svg class="cnn-svg" id="sf-svg" viewBox="0 0 960 470" role="img" aria-label="Forward по элементам: полный цикл">
<defs><marker id="sf-ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#73B222"/></marker></defs><rect x="24.0" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="85.7" y="36" text-anchor="middle" font-size="12" fill="#5E5850">вход X</text><rect x="155.4" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="217.1" y="36" text-anchor="middle" font-size="12" fill="#5E5850">свёртка Z</text><rect x="286.9" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="348.6" y="36" text-anchor="middle" font-size="12" fill="#5E5850">ReLU A</text><rect x="418.3" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="480.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">пулинг P</text><rect x="549.7" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="611.4" y="36" text-anchor="middle" font-size="12" fill="#5E5850">p, z</text><rect x="681.1" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="742.9" y="36" text-anchor="middle" font-size="12" fill="#5E5850">softmax p̂</text><rect x="812.6" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="874.3" y="36" text-anchor="middle" font-size="12" fill="#5E5850">loss L</text><text x="480" y="60" text-anchor="middle" font-size="12" fill="#5E5850">весь forward по элементам: X → Z → A → P → p → z → p̂ → L</text>
<g data-key="sf-m0" data-only="1"><rect x="40" y="100" width="210" height="190" fill="#3576C0" fill-opacity="0.1"/><line x1="82" y1="100" x2="82" y2="290" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="124" y1="100" x2="124" y2="290" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="166" y1="100" x2="166" y2="290" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="208" y1="100" x2="208" y2="290" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="40" y1="138" x2="250" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="40" y1="176" x2="250" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="40" y1="214" x2="250" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="40" y1="252" x2="250" y2="252" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 39 95 L 33 95 L 33 295 L 39 295" fill="none" stroke="#3576C0" stroke-width="1.8"/><path d="M 251 95 L 257 95 L 257 295 L 251 295" fill="none" stroke="#3576C0" stroke-width="1.8"/><text x="61.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,1</tspan></text><text x="103.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,2</tspan></text><text x="145.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,3</tspan></text><text x="187.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,4</tspan></text><text x="229.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">1,5</tspan></text><text x="61.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,1</tspan></text><text x="103.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,2</tspan></text><text x="145.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,3</tspan></text><text x="187.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,4</tspan></text><text x="229.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">2,5</tspan></text><text x="61.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,1</tspan></text><text x="103.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,2</tspan></text><text x="145.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,3</tspan></text><text x="187.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,4</tspan></text><text x="229.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">3,5</tspan></text><text x="61.0" y="237.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">4,1</tspan></text><text x="103.0" y="237.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">4,2</tspan></text><text x="145.0" y="237.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">4,3</tspan></text><text x="187.0" y="237.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">4,4</tspan></text><text x="229.0" y="237.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">4,5</tspan></text><text x="61.0" y="275.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">5,1</tspan></text><text x="103.0" y="275.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">5,2</tspan></text><text x="145.0" y="275.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">5,3</tspan></text><text x="187.0" y="275.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">5,4</tspan></text><text x="229.0" y="275.6" text-anchor="middle" font-size="13" fill="#111">x<tspan font-size="10" dy="4">5,5</tspan></text><text x="145.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">5 × 5</text><text x="145.0" y="312" text-anchor="middle" font-size="14" font-weight="700" fill="#111">X · 5×5</text></g>
<g data-key="sf-a1" data-only="1"><path d="M258 195.0 L312 195.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m1" data-only="1"><rect x="320" y="100" width="144" height="114" fill="#73B222" fill-opacity="0.1"/><line x1="368" y1="100" x2="368" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="416" y1="100" x2="416" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="320" y1="138" x2="464" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="320" y1="176" x2="464" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 319 95 L 313 95 L 313 219 L 319 219" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 465 95 L 471 95 L 471 219 L 465 219" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="344.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">1,1</tspan></text><text x="392.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">1,2</tspan></text><text x="440.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">1,3</tspan></text><text x="344.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">2,1</tspan></text><text x="392.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">2,2</tspan></text><text x="440.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">2,3</tspan></text><text x="344.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">3,1</tspan></text><text x="392.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">3,2</tspan></text><text x="440.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">3,3</tspan></text><text x="392.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="392.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">Z · 3×3</text></g>
<g data-key="sf-a2" data-only="1"><path d="M472 157.0 L532 157.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m2" data-only="1"><rect x="540" y="100" width="144" height="114" fill="#73B222" fill-opacity="0.1"/><line x1="588" y1="100" x2="588" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="636" y1="100" x2="636" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="540" y1="138" x2="684" y2="138" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="540" y1="176" x2="684" y2="176" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 539 95 L 533 95 L 533 219 L 539 219" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 685 95 L 691 95 L 691 219 L 685 219" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="564.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">1,1</tspan></text><text x="612.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">1,2</tspan></text><text x="660.0" y="123.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">1,3</tspan></text><text x="564.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">2,1</tspan></text><text x="612.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">2,2</tspan></text><text x="660.0" y="161.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">2,3</tspan></text><text x="564.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">3,1</tspan></text><text x="612.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">3,2</tspan></text><text x="660.0" y="199.6" text-anchor="middle" font-size="13" fill="#111">a<tspan font-size="10" dy="4">3,3</tspan></text><text x="612.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="612.0" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#111">A=ReLU(Z)</text></g>
<g data-key="sf-a3" data-only="1"><path d="M692 157.0 L752 157.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m3" data-only="1"><rect x="760" y="100" width="112" height="88" fill="#73B222" fill-opacity="0.1"/><line x1="816" y1="100" x2="816" y2="188" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="760" y1="144" x2="872" y2="144" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 759 95 L 753 95 L 753 193 L 759 193" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 873 95 L 879 95 L 879 193 L 873 193" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="788.0" y="127.3" text-anchor="middle" font-size="12" fill="#111">P<tspan font-size="10" dy="4">1,1</tspan></text><text x="844.0" y="127.3" text-anchor="middle" font-size="12" fill="#111">P<tspan font-size="10" dy="4">1,2</tspan></text><text x="788.0" y="171.3" text-anchor="middle" font-size="12" fill="#111">P<tspan font-size="10" dy="4">2,1</tspan></text><text x="844.0" y="171.3" text-anchor="middle" font-size="12" fill="#111">P<tspan font-size="10" dy="4">2,2</tspan></text><text x="816.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 × 2</text><text x="816.0" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#111">P · 2×2</text></g>
<g data-key="sf-c1" data-only="1"><path d="M816.0 188 L816.0 300 L20 300 L20 372.0 L60 372.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m4a" data-only="1"><rect x="60" y="350" width="216" height="44" fill="#73B222" fill-opacity="0.1"/><line x1="114" y1="350" x2="114" y2="394" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="168" y1="350" x2="168" y2="394" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="222" y1="350" x2="222" y2="394" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 59 345 L 53 345 L 53 399 L 59 399" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 277 345 L 283 345 L 283 399 L 277 399" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="87.0" y="377.3" text-anchor="middle" font-size="13" fill="#111">p<tspan font-size="10" dy="4">1,1</tspan></text><text x="141.0" y="377.3" text-anchor="middle" font-size="13" fill="#111">p<tspan font-size="10" dy="4">1,2</tspan></text><text x="195.0" y="377.3" text-anchor="middle" font-size="13" fill="#111">p<tspan font-size="10" dy="4">1,3</tspan></text><text x="249.0" y="377.3" text-anchor="middle" font-size="13" fill="#111">p<tspan font-size="10" dy="4">1,4</tspan></text><text x="168.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 × 4</text><text x="168.0" y="416" text-anchor="middle" font-size="14" font-weight="700" fill="#111">p · 1×4</text></g>
<g data-key="sf-a5" data-only="1"><path d="M284 372.0 L336 372.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m4b" data-only="1"><rect x="340" y="350" width="128" height="44" fill="#73B222" fill-opacity="0.1"/><line x1="404" y1="350" x2="404" y2="394" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 339 345 L 333 345 L 333 399 L 339 399" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 469 345 L 475 345 L 475 399 L 469 399" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="372.0" y="377.3" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">1,1</tspan></text><text x="436.0" y="377.3" text-anchor="middle" font-size="13" fill="#111">z<tspan font-size="10" dy="4">1,2</tspan></text><text x="404.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 × 2</text><text x="404.0" y="416" text-anchor="middle" font-size="14" font-weight="700" fill="#111">z=Wp+c · 1×2</text></g>
<g data-key="sf-a6" data-only="1"><path d="M476 372.0 L556 372.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m5" data-only="1"><rect x="560" y="350" width="128" height="44" fill="#73B222" fill-opacity="0.1"/><line x1="624" y1="350" x2="624" y2="394" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 559 345 L 553 345 L 553 399 L 559 399" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 689 345 L 695 345 L 695 399 L 689 399" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="592.0" y="377.3" text-anchor="middle" font-size="12" fill="#111">p̂<tspan font-size="10" dy="4">1,1</tspan></text><text x="656.0" y="377.3" text-anchor="middle" font-size="12" fill="#111">p̂<tspan font-size="10" dy="4">1,2</tspan></text><text x="624.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 × 2</text><text x="624.0" y="416" text-anchor="middle" font-size="14" font-weight="700" fill="#111">p̂ · 1×2</text></g>
<g data-key="sf-a7" data-only="1"><path d="M696 372.0 L776 372.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#sf-ar)"/></g>
<g data-key="sf-m6" data-only="1"><rect x="780" y="350" width="80" height="44" fill="#C30B0A" fill-opacity="0.12"/><path d="M 779 345 L 773 345 L 773 399 L 779 399" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 861 345 L 867 345 L 867 399 L 861 399" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="820.0" y="377.3" text-anchor="middle" font-size="17" fill="#111">L</text><text x="820.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">loss</text><text x="820.0" y="416" text-anchor="middle" font-size="14" font-weight="700" fill="#111">L</text></g>
<g data-key="sf-tab0" data-only="1"><rect x="22.0" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab1" data-only="1"><rect x="153.4" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab2" data-only="1"><rect x="284.9" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab3" data-only="1"><rect x="416.3" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab4" data-only="1"><rect x="547.7" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab5" data-only="1"><rect x="679.1" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-tab6" data-only="1"><rect x="810.6" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sf-f0" data-only="1"><rect x="34" y="94" width="222" height="202" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f1" data-only="1"><rect x="314" y="94" width="156" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f2" data-only="1"><rect x="534" y="94" width="156" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f3" data-only="1"><rect x="754" y="94" width="124" height="100" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f4" data-only="1"><rect x="54" y="344" width="228" height="56" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f4b" data-only="1"><rect x="334" y="344" width="140" height="56" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f5" data-only="1"><rect x="554" y="344" width="140" height="56" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sf-f6" data-only="1"><rect x="774" y="344" width="92" height="56" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="sf-m0 sf-tab0 sf-f0" data-focus="sf-f0"><div class="step-kicker">Шаг 1 · вход</div><h4>Матрица X (символьно)</h4><p>Те же 25 пикселей, но обозначенные <span class="math-inline" data-tex="x_{i,j}"></span>. Дальше сеть прогонит их по всем слоям.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-tab1 sf-f1" data-focus="sf-f1"><div class="step-kicker">Шаг 2 · свёртка</div><h4>X → Z</h4><p>Ядро 3×3 скользит по входу; каждая клетка <span class="math-inline" data-tex="z_{i,j}=b+\sum_{u,v}x_{i+u,\,j+v}K_{uv}"></span>. Выход 3×3.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-tab2 sf-f2" data-focus="sf-f2"><div class="step-kicker">Шаг 3 · ReLU</div><h4>Z → A</h4><p>Поэлементно <span class="math-inline" data-tex="a_{i,j}=\max(0,z_{i,j})"></span>. Форма не меняется.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-a3 sf-m3 sf-tab3 sf-f3" data-focus="sf-f3"><div class="step-kicker">Шаг 4 · пулинг</div><h4>A → P</h4><p>Максимум по окну 2×2 (шаг 1): <span class="math-inline" data-tex="P_{i,j}=\max A[i{:}i{+}2,\,j{:}j{+}2]"></span>. Выход 2×2.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-a3 sf-m3 sf-c1 sf-m4a sf-a5 sf-m4b sf-tab4 sf-f4 sf-f4b" data-focus="sf-f4 sf-f4b"><div class="step-kicker">Шаг 5 · классификатор</div><h4>P → p → z</h4><p>Карту распрямляем в строку <span class="math-inline" data-tex="\mathbf p"></span> (1×4). Логит <span class="math-inline" data-tex="z_c=\sum_k p_k W_{ck}+c_c"></span> — строка p × столбец W.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-a3 sf-m3 sf-c1 sf-m4a sf-a5 sf-m4b sf-a6 sf-m5 sf-tab5 sf-f5" data-focus="sf-f5"><div class="step-kicker">Шаг 6 · softmax</div><h4>z → p̂</h4><p><span class="math-inline" data-tex="\hat p_c=\dfrac{e^{z_c}}{\sum_k e^{z_k}}"></span> — логиты становятся вероятностями.</p></div>
    <div class="step-panel" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-a3 sf-m3 sf-c1 sf-m4a sf-a5 sf-m4b sf-a6 sf-m5 sf-a7 sf-m6 sf-tab6 sf-f6" data-focus="sf-f6"><div class="step-kicker">Шаг 7 · loss</div><h4>p̂ → L</h4><p><span class="math-inline" data-tex="L=-\log \hat p_{\text{true}}"></span>. Вся сеть — одно число.</p></div>
  </div>
</div>
<p class="stage-hint">Полный forward одного свёрточного слоя: X → Z → A → P → p → z → p̂ → L.</p>

---

## Часть 13. Forward на числах

<p>
  Теперь те же операции на нашем объекте. Ядро — детектор вертикального края,
  поэтому положительные отклики появляются только у правого столбца карты. После
  ReLU почти вся карта <span class="math-inline" data-tex="A"></span> зануляется,
  и в пулинге побеждают лишь две клетки —
  <span class="math-inline" data-tex="A_{12}=1{,}7625"></span> и
  <span class="math-inline" data-tex="A_{22}=1{,}825"></span>. Их и подсвечиваем
  зелёным: только через них пойдёт градиент назад.
</p>

<div class="stage numeric-stage" id="stageFN" tabindex="0" aria-label="Числа прямого прохода">
  <div class="stage-figure">
<svg class="cnn-svg" id="fn-svg" viewBox="0 0 960 470" role="img" aria-label="Числа прямого прохода по шагам">
<defs><marker id="fn-ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#73B222"/></marker></defs><rect x="24.0" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="85.7" y="36" text-anchor="middle" font-size="12" fill="#5E5850">вход X</text><rect x="155.4" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="217.1" y="36" text-anchor="middle" font-size="12" fill="#5E5850">свёртка Z</text><rect x="286.9" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="348.6" y="36" text-anchor="middle" font-size="12" fill="#5E5850">ReLU A</text><rect x="418.3" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="480.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">пулинг P</text><rect x="549.7" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="611.4" y="36" text-anchor="middle" font-size="12" fill="#5E5850">p, z</text><rect x="681.1" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="742.9" y="36" text-anchor="middle" font-size="12" fill="#5E5850">softmax p̂</text><rect x="812.6" y="16" width="123.4" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="874.3" y="36" text-anchor="middle" font-size="12" fill="#5E5850">loss L</text><text x="480" y="60" text-anchor="middle" font-size="12" fill="#5E5850">каждый шаг добавляет новую матрицу; стрелка вниз — переход к классификатору</text>
<g data-key="fn-m0" data-only="1"><rect x="40" y="100" width="40" height="34" fill="rgb(255,255,255)" stroke="#C9C2B8" stroke-width="1"/><rect x="80" y="100" width="40" height="34" fill="rgb(226,230,238)" stroke="#C9C2B8" stroke-width="1"/><rect x="120" y="100" width="40" height="34" fill="rgb(142,157,187)" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="100" width="40" height="34" fill="rgb(105,125,165)" stroke="#C9C2B8" stroke-width="1"/><rect x="200" y="100" width="40" height="34" fill="rgb(180,190,210)" stroke="#C9C2B8" stroke-width="1"/><rect x="40" y="134" width="40" height="34" fill="rgb(255,255,255)" stroke="#C9C2B8" stroke-width="1"/><rect x="80" y="134" width="40" height="34" fill="rgb(180,190,210)" stroke="#C9C2B8" stroke-width="1"/><rect x="120" y="134" width="40" height="34" fill="rgb(105,125,165)" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="134" width="40" height="34" fill="rgb(198,206,221)" stroke="#C9C2B8" stroke-width="1"/><rect x="200" y="134" width="40" height="34" fill="rgb(236,238,243)" stroke="#C9C2B8" stroke-width="1"/><rect x="40" y="168" width="40" height="34" fill="rgb(255,255,255)" stroke="#C9C2B8" stroke-width="1"/><rect x="80" y="168" width="40" height="34" fill="rgb(236,238,243)" stroke="#C9C2B8" stroke-width="1"/><rect x="120" y="168" width="40" height="34" fill="rgb(217,222,232)" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="168" width="40" height="34" fill="rgb(123,141,176)" stroke="#C9C2B8" stroke-width="1"/><rect x="200" y="168" width="40" height="34" fill="rgb(217,222,232)" stroke="#C9C2B8" stroke-width="1"/><rect x="40" y="202" width="40" height="34" fill="rgb(255,255,255)" stroke="#C9C2B8" stroke-width="1"/><rect x="80" y="202" width="40" height="34" fill="rgb(255,255,255)" stroke="#C9C2B8" stroke-width="1"/><rect x="120" y="202" width="40" height="34" fill="rgb(161,173,198)" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="202" width="40" height="34" fill="rgb(105,125,165)" stroke="#C9C2B8" stroke-width="1"/><rect x="200" y="202" width="40" height="34" fill="rgb(198,206,221)" stroke="#C9C2B8" stroke-width="1"/><rect x="40" y="236" width="40" height="34" fill="rgb(255,255,255)" stroke="#C9C2B8" stroke-width="1"/><rect x="80" y="236" width="40" height="34" fill="rgb(217,222,232)" stroke="#C9C2B8" stroke-width="1"/><rect x="120" y="236" width="40" height="34" fill="rgb(123,141,176)" stroke="#C9C2B8" stroke-width="1"/><rect x="160" y="236" width="40" height="34" fill="rgb(180,190,210)" stroke="#C9C2B8" stroke-width="1"/><rect x="200" y="236" width="40" height="34" fill="rgb(255,255,255)" stroke="#C9C2B8" stroke-width="1"/><path d="M 39 95 L 33 95 L 33 275 L 39 275" fill="none" stroke="#3576C0" stroke-width="1.8"/><path d="M 241 95 L 247 95 L 247 275 L 241 275" fill="none" stroke="#3576C0" stroke-width="1.8"/><text x="60.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="100.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">0.188</text><text x="140.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">0.750</text><text x="180.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">1.000</text><text x="220.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">0.500</text><text x="60.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="100.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">0.500</text><text x="140.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">1.000</text><text x="180.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">0.375</text><text x="220.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">0.125</text><text x="60.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="100.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">0.125</text><text x="140.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">0.250</text><text x="180.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">0.875</text><text x="220.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">0.250</text><text x="60.0" y="223.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="100.0" y="223.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="140.0" y="223.1" text-anchor="middle" font-size="12" fill="#111">0.625</text><text x="180.0" y="223.1" text-anchor="middle" font-size="12" fill="#111">1.000</text><text x="220.0" y="223.1" text-anchor="middle" font-size="12" fill="#111">0.375</text><text x="60.0" y="257.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="100.0" y="257.1" text-anchor="middle" font-size="12" fill="#111">0.250</text><text x="140.0" y="257.1" text-anchor="middle" font-size="12" fill="#111">0.875</text><text x="180.0" y="257.1" text-anchor="middle" font-size="12" fill="#111">0.500</text><text x="220.0" y="257.1" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="140.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">5 × 5</text><text x="140.0" y="292" text-anchor="middle" font-size="14" font-weight="700" fill="#111">X · 5×5</text></g>
<g data-key="fn-a1" data-only="1"><path d="M245 185.0 L296 185.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m1" data-only="1"><rect x="300" y="100" width="46" height="34" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="346" y="100" width="46" height="34" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="392" y="100" width="46" height="34" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="300" y="134" width="46" height="34" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="346" y="134" width="46" height="34" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="392" y="134" width="46" height="34" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="300" y="168" width="46" height="34" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="346" y="168" width="46" height="34" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="392" y="168" width="46" height="34" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><path d="M 299 95 L 293 95 L 293 207 L 299 207" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 439 95 L 445 95 L 445 207 L 439 207" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="323.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">−1.55</text><text x="369.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">−0.74</text><text x="415.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">1.51</text><text x="323.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">−1.61</text><text x="369.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">−1.30</text><text x="415.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">1.76</text><text x="323.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">−1.55</text><text x="369.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">−1.49</text><text x="415.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">1.82</text><text x="369.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="369.0" y="224" text-anchor="middle" font-size="14" font-weight="700" fill="#111">Z · 3×3</text></g>
<g data-key="fn-a2" data-only="1"><path d="M438 151.0 L486 151.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m2" data-only="1"><rect x="490" y="100" width="46" height="34" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><rect x="536" y="100" width="46" height="34" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="582" y="100" width="46" height="34" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><rect x="490" y="134" width="46" height="34" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><rect x="536" y="134" width="46" height="34" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="582" y="134" width="46" height="34" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><rect x="490" y="168" width="46" height="34" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="536" y="168" width="46" height="34" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="582" y="168" width="46" height="34" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><path d="M 489 95 L 483 95 L 483 207 L 489 207" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 629 95 L 635 95 L 635 207 L 629 207" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="513.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="559.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="605.0" y="121.1" text-anchor="middle" font-size="12" fill="#111">1.51</text><text x="513.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="559.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="605.0" y="155.1" text-anchor="middle" font-size="12" fill="#111">1.76</text><text x="513.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="559.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="605.0" y="189.1" text-anchor="middle" font-size="12" fill="#111">1.82</text><text x="559.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="559.0" y="224" text-anchor="middle" font-size="14" font-weight="700" fill="#111">A=ReLU(Z)</text></g>
<g data-key="fn-a3" data-only="1"><path d="M628 151.0 L676 151.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m3" data-only="1"><rect x="680" y="100" width="54" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="734" y="100" width="54" height="40" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><rect x="680" y="140" width="54" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="734" y="140" width="54" height="40" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><path d="M 679 95 L 673 95 L 673 185 L 679 185" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 789 95 L 795 95 L 795 185 L 789 185" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="707.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="761.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">1.762</text><text x="707.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="761.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">1.825</text><text x="734.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 × 2</text><text x="734.0" y="202" text-anchor="middle" font-size="14" font-weight="700" fill="#111">P · 2×2</text></g>
<g data-key="fn-c1" data-only="1"><path d="M734.0 180 L734.0 300 L20 300 L20 370.0 L60 370.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m4a" data-only="1"><rect x="60" y="350" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="112" y="350" width="52" height="40" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><rect x="164" y="350" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="216" y="350" width="52" height="40" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><path d="M 59 345 L 53 345 L 53 395 L 59 395" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 269 345 L 275 345 L 275 395 L 269 395" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="86.0" y="374.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="138.0" y="374.8" text-anchor="middle" font-size="12" fill="#111">1.762</text><text x="190.0" y="374.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="242.0" y="374.8" text-anchor="middle" font-size="12" fill="#111">1.825</text><text x="164.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 × 4</text><text x="164.0" y="412" text-anchor="middle" font-size="14" font-weight="700" fill="#111">p · 1×4</text></g>
<g data-key="fn-a5" data-only="1"><path d="M276 370.0 L336 370.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m4b" data-only="1"><rect x="340" y="350" width="64" height="40" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><rect x="404" y="350" width="64" height="40" fill="#E8F3DC" stroke="#C9C2B8" stroke-width="1"/><path d="M 339 345 L 333 345 L 333 395 L 339 395" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 469 345 L 475 345 L 475 395 L 469 395" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="372.0" y="374.8" text-anchor="middle" font-size="12" fill="#111">−0.24</text><text x="436.0" y="374.8" text-anchor="middle" font-size="12" fill="#111">2.05</text><text x="404.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 × 2</text><text x="404.0" y="412" text-anchor="middle" font-size="14" font-weight="700" fill="#111">z=Wp+c · 1×2</text></g>
<g data-key="fn-a6" data-only="1"><path d="M476 370.0 L556 370.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m5" data-only="1"><rect x="560" y="350" width="64" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="624" y="350" width="64" height="40" fill="#CDEBAA" stroke="#C9C2B8" stroke-width="1"/><path d="M 559 345 L 553 345 L 553 395 L 559 395" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 689 345 L 695 345 L 695 395 L 689 395" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="592.0" y="374.8" text-anchor="middle" font-size="12" fill="#111">0.092</text><text x="656.0" y="374.8" text-anchor="middle" font-size="12" fill="#111">0.908</text><text x="624.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 × 2</text><text x="624.0" y="412" text-anchor="middle" font-size="14" font-weight="700" fill="#111">p̂ · 1×2</text></g>
<g data-key="fn-a7" data-only="1"><path d="M696 370.0 L776 370.0" stroke="#73B222" stroke-width="2.2" fill="none" marker-end="url(#fn-ar)"/></g>
<g data-key="fn-m6" data-only="1"><rect x="780" y="350" width="90" height="40" fill="#FBE4E3" stroke="#C9C2B8" stroke-width="1"/><path d="M 779 345 L 773 345 L 773 395 L 779 395" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 871 345 L 877 345 L 877 395 L 871 395" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="825.0" y="374.8" text-anchor="middle" font-size="12" fill="#111">0.0968</text><text x="825.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">loss</text><text x="825.0" y="412" text-anchor="middle" font-size="14" font-weight="700" fill="#111">L</text></g>
<g data-key="fn-tab0" data-only="1"><rect x="22.0" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab1" data-only="1"><rect x="153.4" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab2" data-only="1"><rect x="284.9" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab3" data-only="1"><rect x="416.3" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab4" data-only="1"><rect x="547.7" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab5" data-only="1"><rect x="679.1" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-tab6" data-only="1"><rect x="810.6" y="14" width="127.4" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="fn-f0" data-only="1"><rect x="34" y="94" width="212" height="182" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f1" data-only="1"><rect x="294" y="94" width="150" height="114" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f2" data-only="1"><rect x="484" y="94" width="150" height="114" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f3" data-only="1"><rect x="674" y="94" width="120" height="92" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f4" data-only="1"><rect x="54" y="344" width="220" height="52" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f4b" data-only="1"><rect x="334" y="344" width="140" height="52" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f5" data-only="1"><rect x="554" y="344" width="140" height="52" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="fn-f6" data-only="1"><rect x="774" y="344" width="102" height="52" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="fn-m0 fn-tab0 fn-f0" data-focus="fn-f0"><div class="step-kicker">Шаг 1 · вход</div><h4>Матрица 5×5 в отрезке [0, 1]</h4><div class="math-display" data-fwdn-tex="fx"></div><p>Исходные яркости 0…16, делённые на 16, дают точные двоичные дроби.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-tab1 fn-f1" data-focus="fn-f1"><div class="step-kicker">Шаг 2 · свёртка</div><h4>Девять откликов, все левые — отрицательные</h4><div class="math-display" data-fwdn-tex="fz"></div><p>Фильтр вычитает правый столбец окна из левого; у левой части картинки ярче справа, поэтому отклики уходят в минус.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-tab2 fn-f2" data-focus="fn-f2"><div class="step-kicker">Шаг 3 · ReLU</div><h4>Остаётся только правый столбец</h4><div class="math-display" data-fwdn-tex="fa"></div><p>Шесть клеток из девяти становятся нулями. Производная ReLU в них равна нулю — туда backward ничего не пропустит.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-a3 fn-m3 fn-tab3 fn-f3" data-focus="fn-f3"><div class="step-kicker">Шаг 4 · пулинг</div><h4>Побеждают две клетки</h4><div class="math-display" data-fwdn-tex="fp"></div><p>В двух окнах максимум — ноль (там всё занулено), в двух других побеждают <span class="math-inline" data-tex="A_{12}"></span> и <span class="math-inline" data-tex="A_{22}"></span>.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-a3 fn-m3 fn-c1 fn-m4a fn-a5 fn-m4b fn-tab4 fn-f4 fn-f4b" data-focus="fn-f4 fn-f4b"><div class="step-kicker">Шаг 5 · линейный слой</div><h4>Четыре числа → два логита</h4><div class="math-display" data-fwdn-tex="flin"></div><p>Распрямлённый вектор <span class="math-inline" data-tex="\mathbf p=[0;\,1{,}7625;\,0;\,1{,}825]"></span> умножается на <span class="math-inline" data-tex="W"></span>.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-a3 fn-m3 fn-c1 fn-m4a fn-a5 fn-m4b fn-a6 fn-m5 fn-tab5 fn-f5" data-focus="fn-f5"><div class="step-kicker">Шаг 6 · softmax</div><h4>Вероятности классов</h4><div class="math-display" data-fwdn-tex="fsoft"></div><p>Второй логит выше, поэтому правильному классу 1 достаётся 0,9077.</p></div>
    <div class="step-panel" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-a3 fn-m3 fn-c1 fn-m4a fn-a5 fn-m4b fn-a6 fn-m5 fn-a7 fn-m6 fn-tab6 fn-f6" data-focus="fn-f6"><div class="step-kicker">Шаг 7 · loss</div><h4>Одно число</h4><div class="math-display" data-fwdn-tex="floss"></div><p>Сеть уверена в правильном классе, поэтому loss мал, но не ноль.</p></div>
  </div>
</div>
<p class="stage-hint">В клетках сцены числа округлены до трёх знаков, в формуле под кнопками — до четырёх; всё посчитано одним NumPy-скриптом из части 18.</p>

<div class="callout">
  <strong>Из 25 пикселей до loss доходят двое.</strong> Только
  <span class="math-inline" data-tex="A_{12}"></span> и
  <span class="math-inline" data-tex="A_{22}"></span> пережили ReLU и победили в
  пулинге, поэтому именно их рецептивные поля получат весь градиент. Остальные
  клетки участвуют в прямом проходе, но их производная обнулилась.
</div>

---

## Часть 14. Что forward обязан запомнить

<p>
  Backward — это цепное правило, применённое по слоям справа налево. Чтобы
  посчитать локальную производную каждого слоя, нужны величины, вычисленные в
  forward. Их не так много, и все они у нас уже есть.
</p>

<table class="shape-table">
  <thead><tr><th>Что помним</th><th>Форма</th><th>Зачем в backward</th></tr></thead>
  <tbody>
    <tr><td><code>X</code></td><td><code>5×5</code></td><td>для <code>dK</code>: градиент ядра — свёртка входа с <code>dZ</code></td></tr>
    <tr><td>маска ReLU <code>[Z&gt;0]</code></td><td><code>3×3</code></td><td>пропускает <code>dA</code> только там, где отклик был положителен</td></tr>
    <tr><td>адреса победителей пулинга</td><td><code>2×2 → 3×3</code></td><td>маршрутизируют <code>dP</code> в нужную клетку <code>dA</code></td></tr>
    <tr><td><code>p</code> (распрямлённая карта)</td><td><code>4</code></td><td>для <code>dW = dz · pᵀ</code></td></tr>
    <tr><td><code>p̂</code> (softmax)</td><td><code>2</code></td><td>для <code>dz = p̂ − y</code></td></tr>
  </tbody>
</table>

<div class="math-display" data-tex="\frac{\partial \mathcal L}{\partial \mathbf z}=\hat{\mathbf p}-\mathbf y,\qquad \frac{\partial \mathcal L}{\partial W}=\frac{\partial \mathcal L}{\partial \mathbf z}\,\mathbf p^{\top},\qquad \frac{\partial \mathcal L}{\partial \mathbf p}=W^{\top}\frac{\partial \mathcal L}{\partial \mathbf z}"></div>

<div class="callout-blue">
  <strong>Память — не расточительство.</strong> Ровно эти сохранённые величины
  делают backward набором простых локальных операций: каждый слой знает свою
  производную по входу и по параметрам, если помнит вход и «переключатели»
  (маску ReLU и адреса пулинга).
</div>

---

## Часть 15. Backward в формулах

<p>
  Идём справа налево. Softmax с cross-entropy дают предельно простой старт:
  производная по логитам — это «предсказание минус правда». Дальше линейный слой,
  пулинг, ReLU и свёртка, каждый со своей локальной формулой.
</p>

<div class="stage" id="stageBF" tabindex="0" aria-label="Backward свёрточной сети в формулах">
  <div class="stage-figure">
    <svg class="cnn-svg" id="bf-svg" viewBox="0 0 940 240" role="img" aria-label="Формулы каждого шага обратного прохода">
      <defs><marker id="bf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#C30B0A"/></marker></defs>
      <text x="30" y="38" class="v-title">Backward: локальная производная каждого слоя</text>
      <text x="30" y="58" class="v-small">Красные стрелки идут справа налево: градиент разворачивается по сохранённой карте.</text>
      <g data-key="bf-l"><rect x="808" y="78" width="116" height="150" rx="10" class="box-red"/><text x="866" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 866 153)">Loss</text></g>
      <g data-key="bf-s"><path d="M806 153 L776 153" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="700" y="78" width="92" height="150" rx="10" class="box-green"/><text x="746" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 746 153)">Softmax</text></g>
      <g data-key="bf-f"><path d="M698 153 L668 153" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="560" y="78" width="104" height="150" rx="10" class="box-yellow"/><text x="612" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 612 153)">Linear</text></g>
      <g data-key="bf-p"><path d="M558 153 L528 153" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="420" y="78" width="104" height="150" rx="10" class="box-green"/><text x="472" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 472 153)">MaxPool</text></g>
      <g data-key="bf-r"><path d="M418 153 L388 153" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="294" y="78" width="92" height="150" rx="10" class="box-green"/><text x="340" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 340 153)">ReLU</text></g>
      <g data-key="bf-c"><path d="M292 153 L262 153" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="148" y="78" width="110" height="150" rx="10" class="box-yellow"/><text x="203" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 203 153)">Conv</text></g>
      <g data-key="bf-x"><path d="M146 153 L116 153" class="edge-red" marker-end="url(#bf-arrow)"/><rect x="24" y="78" width="92" height="150" rx="10" class="box-blue"/><text x="70" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 70 153)">Input</text></g>
                                              </svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="bf-l bf-s" data-focus="bf-s"><div class="step-kicker">Шаг 1 · softmax + CE</div><h4>Предсказание минус правда</h4><div class="math-display" data-bwdf-tex="bs"></div><p>Самый простой градиент во всей сети: разность распределения и one-hot метки.</p></div>
    <div class="step-panel" data-on="bf-s bf-f" data-focus="bf-f"><div class="step-kicker">Шаг 2 · линейный слой</div><h4>Три производные из одного вектора</h4><div class="math-display" data-bwdf-tex="bf"></div><p><span class="math-inline" data-tex="dW"></span> — внешнее произведение, <span class="math-inline" data-tex="d\mathbf c"></span> — сам вектор, <span class="math-inline" data-tex="d\mathbf p=W^{\top}d\mathbf z"></span> уходит назад.</p></div>
    <div class="step-panel" data-on="bf-f bf-p" data-focus="bf-p"><div class="step-kicker">Шаг 3 · пулинг</div><h4>Маршрутизация к победителю</h4><div class="math-display" data-bwdf-tex="bp"></div><p>Каждый элемент <span class="math-inline" data-tex="d\mathbf p"></span> кладётся в ту клетку <span class="math-inline" data-tex="dA"></span>, что победила в своём окне; перекрытия суммируются.</p></div>
    <div class="step-panel" data-on="bf-p bf-r" data-focus="bf-r"><div class="step-kicker">Шаг 4 · ReLU</div><h4>Пропускаем только живые клетки</h4><div class="math-display" data-bwdf-tex="br"></div><p>Умножаем на маску <span class="math-inline" data-tex="[Z>0]"></span>: где отклик был неположителен, градиент обнуляется.</p></div>
    <div class="step-panel" data-on="bf-r bf-c" data-focus="bf-c"><div class="step-kicker">Шаг 5 · свёртка</div><h4>Общий вес — сумма по всем позициям</h4><div class="math-display" data-bwdf-tex="bc"></div><p><span class="math-inline" data-tex="dK_{uv}"></span> — свёртка входа с <span class="math-inline" data-tex="dZ"></span>; каждый коэффициент ядра собирает вклады со всех девяти позиций.</p></div>
    <div class="step-panel" data-on="bf-c bf-x" data-focus="bf-x"><div class="step-kicker">Шаг 6 · градиент по входу</div><h4>Полная свёртка с перевёрнутым ядром</h4><div class="math-display" data-bwdf-tex="bx"></div><p>Нужен, если перед свёрткой есть ещё слои. Ядро отражается на 180°, <span class="math-inline" data-tex="dZ"></span> сворачивается с ним «на полную».</p></div>
  </div>
</div>
<p class="stage-hint">Каждый шаг — одна локальная производная; ниже те же шаги проходят на числах нашего объекта.</p>

<div class="callout">
  <strong>Backward — та же цепочка, пройденная наоборот.</strong> Разность
  <span class="math-inline" data-tex="\hat{\mathbf p}-\mathbf y"></span> стартует
  градиент, а пулинг и ReLU работают как переключатели: они решают, по каким
  клеткам сигнал вообще пойдёт дальше.
</div>

### Те же градиенты по элементам матриц

<p>Полный обратный проход по элементам. Сверху — текущий шаг; при «Далее» добавляется следующая матрица градиента.</p>

<div class="stage" id="stageSB" tabindex="0" aria-label="Те же градиенты по элементам матриц">
  <div class="stage-figure">
<svg class="cnn-svg" id="sb-svg" viewBox="0 0 960 520" role="img" aria-label="Backward по элементам: полный цикл">
<defs><marker id="sb-ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C30B0A"/></marker></defs><rect x="24.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="112.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dz (выход)</text><rect x="208.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="296.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dP</text><rect x="392.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="480.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dA (пулинг)</text><rect x="576.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="664.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dZ (ReLU)</text><rect x="760.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="848.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dK, db</text><text x="480" y="60" text-anchor="middle" font-size="12" fill="#5E5850">весь backward по элементам: dz → dP → dA → dZ → dK, а вход даёт dK свёрткой</text>
<g data-key="sb-m0" data-only="1"><rect x="40" y="100" width="120" height="42" fill="#C30B0A" fill-opacity="0.12"/><line x1="100" y1="100" x2="100" y2="142" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 39 95 L 33 95 L 33 147 L 39 147" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 161 95 L 167 95 L 167 147 L 161 147" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="70.0" y="126.0" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">1,1</tspan></text><text x="130.0" y="126.0" text-anchor="middle" font-size="12" fill="#111">dz<tspan font-size="10" dy="4">1,2</tspan></text><text x="100.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 × 2</text><text x="100.0" y="164" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dz · 1×2</text></g>
<g data-key="sb-a1" data-only="1"><path d="M168 121.0 L246 121.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#sb-ar)"/></g>
<g data-key="sb-m1" data-only="1"><rect x="250" y="100" width="112" height="84" fill="#C30B0A" fill-opacity="0.12"/><line x1="306" y1="100" x2="306" y2="184" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="250" y1="142" x2="362" y2="142" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 249 95 L 243 95 L 243 189 L 249 189" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 363 95 L 369 95 L 369 189 L 363 189" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="278.0" y="126.0" text-anchor="middle" font-size="11" fill="#111">dP<tspan font-size="10" dy="4">1,1</tspan></text><text x="334.0" y="126.0" text-anchor="middle" font-size="11" fill="#111">dP<tspan font-size="10" dy="4">1,2</tspan></text><text x="278.0" y="168.0" text-anchor="middle" font-size="11" fill="#111">dP<tspan font-size="10" dy="4">2,1</tspan></text><text x="334.0" y="168.0" text-anchor="middle" font-size="11" fill="#111">dP<tspan font-size="10" dy="4">2,2</tspan></text><text x="306.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 × 2</text><text x="306.0" y="206" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dP · 2×2</text></g>
<g data-key="sb-a2" data-only="1"><path d="M370 142.0 L426 142.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#sb-ar)"/></g>
<g data-key="sb-m2" data-only="1"><rect x="430" y="100" width="156" height="126" fill="#C30B0A" fill-opacity="0.12"/><line x1="482" y1="100" x2="482" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="534" y1="100" x2="534" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="430" y1="142" x2="586" y2="142" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="430" y1="184" x2="586" y2="184" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 429 95 L 423 95 L 423 231 L 429 231" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 587 95 L 593 95 L 593 231 L 587 231" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="456.0" y="126.0" text-anchor="middle" font-size="11" fill="#111">dA<tspan font-size="10" dy="4">1,1</tspan></text><text x="508.0" y="126.0" text-anchor="middle" font-size="11" fill="#111">dA<tspan font-size="10" dy="4">1,2</tspan></text><text x="560.0" y="126.0" text-anchor="middle" font-size="11" fill="#111">dA<tspan font-size="10" dy="4">1,3</tspan></text><text x="456.0" y="168.0" text-anchor="middle" font-size="11" fill="#111">dA<tspan font-size="10" dy="4">2,1</tspan></text><text x="508.0" y="168.0" text-anchor="middle" font-size="11" fill="#111">dA<tspan font-size="10" dy="4">2,2</tspan></text><text x="560.0" y="168.0" text-anchor="middle" font-size="11" fill="#111">dA<tspan font-size="10" dy="4">2,3</tspan></text><text x="456.0" y="210.0" text-anchor="middle" font-size="11" fill="#111">dA<tspan font-size="10" dy="4">3,1</tspan></text><text x="508.0" y="210.0" text-anchor="middle" font-size="11" fill="#111">dA<tspan font-size="10" dy="4">3,2</tspan></text><text x="560.0" y="210.0" text-anchor="middle" font-size="11" fill="#111">dA<tspan font-size="10" dy="4">3,3</tspan></text><text x="508.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="508.0" y="248" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dA (пулинг)</text></g>
<g data-key="sb-a3" data-only="1"><path d="M594 163.0 L676 163.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#sb-ar)"/></g>
<g data-key="sb-m3" data-only="1"><rect x="680" y="100" width="156" height="126" fill="#C30B0A" fill-opacity="0.12"/><line x1="732" y1="100" x2="732" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="784" y1="100" x2="784" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="680" y1="142" x2="836" y2="142" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="680" y1="184" x2="836" y2="184" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 679 95 L 673 95 L 673 231 L 679 231" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 837 95 L 843 95 L 843 231 L 837 231" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="706.0" y="126.0" text-anchor="middle" font-size="11" fill="#111">dZ<tspan font-size="10" dy="4">1,1</tspan></text><text x="758.0" y="126.0" text-anchor="middle" font-size="11" fill="#111">dZ<tspan font-size="10" dy="4">1,2</tspan></text><text x="810.0" y="126.0" text-anchor="middle" font-size="11" fill="#111">dZ<tspan font-size="10" dy="4">1,3</tspan></text><text x="706.0" y="168.0" text-anchor="middle" font-size="11" fill="#111">dZ<tspan font-size="10" dy="4">2,1</tspan></text><text x="758.0" y="168.0" text-anchor="middle" font-size="11" fill="#111">dZ<tspan font-size="10" dy="4">2,2</tspan></text><text x="810.0" y="168.0" text-anchor="middle" font-size="11" fill="#111">dZ<tspan font-size="10" dy="4">2,3</tspan></text><text x="706.0" y="210.0" text-anchor="middle" font-size="11" fill="#111">dZ<tspan font-size="10" dy="4">3,1</tspan></text><text x="758.0" y="210.0" text-anchor="middle" font-size="11" fill="#111">dZ<tspan font-size="10" dy="4">3,2</tspan></text><text x="810.0" y="210.0" text-anchor="middle" font-size="11" fill="#111">dZ<tspan font-size="10" dy="4">3,3</tspan></text><text x="758.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="758.0" y="248" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dZ=dA·[Z&gt;0]</text></g>
<g data-key="sb-c1" data-only="1"><path d="M758.0 226 L758.0 300 L20 300 L20 416.0 L60 416.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#sb-ar)"/></g>
<g data-key="sb-m4" data-only="1"><rect x="60" y="350" width="168" height="132" fill="#C30B0A" fill-opacity="0.12"/><line x1="116" y1="350" x2="116" y2="482" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="172" y1="350" x2="172" y2="482" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="60" y1="394" x2="228" y2="394" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="60" y1="438" x2="228" y2="438" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 59 345 L 53 345 L 53 487 L 59 487" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 229 345 L 235 345 L 235 487 L 229 487" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="88.0" y="377.3" text-anchor="middle" font-size="11" fill="#111">dK<tspan font-size="10" dy="4">1,1</tspan></text><text x="144.0" y="377.3" text-anchor="middle" font-size="11" fill="#111">dK<tspan font-size="10" dy="4">1,2</tspan></text><text x="200.0" y="377.3" text-anchor="middle" font-size="11" fill="#111">dK<tspan font-size="10" dy="4">1,3</tspan></text><text x="88.0" y="421.3" text-anchor="middle" font-size="11" fill="#111">dK<tspan font-size="10" dy="4">2,1</tspan></text><text x="144.0" y="421.3" text-anchor="middle" font-size="11" fill="#111">dK<tspan font-size="10" dy="4">2,2</tspan></text><text x="200.0" y="421.3" text-anchor="middle" font-size="11" fill="#111">dK<tspan font-size="10" dy="4">2,3</tspan></text><text x="88.0" y="465.3" text-anchor="middle" font-size="11" fill="#111">dK<tspan font-size="10" dy="4">3,1</tspan></text><text x="144.0" y="465.3" text-anchor="middle" font-size="11" fill="#111">dK<tspan font-size="10" dy="4">3,2</tspan></text><text x="200.0" y="465.3" text-anchor="middle" font-size="11" fill="#111">dK<tspan font-size="10" dy="4">3,3</tspan></text><text x="144.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="144.0" y="504" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dK · 3×3</text></g>
<g data-key="sb-m4lbl" data-only="1"><text x="60" y="326" class="v-small">dK = X ⊛ dZ (рец. поле входа)</text></g>
<g data-key="sb-a5" data-only="1"><path d="M236 416.0 L426 416.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#sb-ar)"/></g>
<g data-key="sb-m4X" data-only="1"><rect x="430" y="350" width="150" height="126" fill="#3576C0" fill-opacity="0.1"/><line x1="480" y1="350" x2="480" y2="476" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="530" y1="350" x2="530" y2="476" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="430" y1="392" x2="580" y2="392" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><line x1="430" y1="434" x2="580" y2="434" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/><path d="M 429 345 L 423 345 L 423 481 L 429 481" fill="none" stroke="#3576C0" stroke-width="1.8"/><path d="M 581 345 L 587 345 L 587 481 L 581 481" fill="none" stroke="#3576C0" stroke-width="1.8"/><text x="455.0" y="376.0" text-anchor="middle" font-size="12" fill="#111">x<tspan font-size="10" dy="4">1,1</tspan></text><text x="505.0" y="376.0" text-anchor="middle" font-size="12" fill="#111">x<tspan font-size="10" dy="4">1,2</tspan></text><text x="555.0" y="376.0" text-anchor="middle" font-size="12" fill="#111">x<tspan font-size="10" dy="4">1,3</tspan></text><text x="455.0" y="418.0" text-anchor="middle" font-size="12" fill="#111">x<tspan font-size="10" dy="4">2,1</tspan></text><text x="505.0" y="418.0" text-anchor="middle" font-size="12" fill="#111">x<tspan font-size="10" dy="4">2,2</tspan></text><text x="555.0" y="418.0" text-anchor="middle" font-size="12" fill="#111">x<tspan font-size="10" dy="4">2,3</tspan></text><text x="455.0" y="460.0" text-anchor="middle" font-size="12" fill="#111">x<tspan font-size="10" dy="4">3,1</tspan></text><text x="505.0" y="460.0" text-anchor="middle" font-size="12" fill="#111">x<tspan font-size="10" dy="4">3,2</tspan></text><text x="555.0" y="460.0" text-anchor="middle" font-size="12" fill="#111">x<tspan font-size="10" dy="4">3,3</tspan></text><text x="505.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="505.0" y="498" text-anchor="middle" font-size="14" font-weight="700" fill="#111">X (рец. поле)</text></g>
<g data-key="sb-tab0" data-only="1"><rect x="22.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-tab1" data-only="1"><rect x="206.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-tab2" data-only="1"><rect x="390.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-tab3" data-only="1"><rect x="574.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-tab4" data-only="1"><rect x="758.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="sb-f0" data-only="1"><rect x="34" y="94" width="132" height="54" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sb-f1" data-only="1"><rect x="244" y="94" width="124" height="96" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sb-f2" data-only="1"><rect x="424" y="94" width="168" height="138" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sb-f3" data-only="1"><rect x="674" y="94" width="168" height="138" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="sb-f4" data-only="1"><rect x="54" y="344" width="180" height="144" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="sb-m0 sb-tab0 sb-f0" data-focus="sb-f0"><div class="step-kicker">Шаг 1 · выход</div><h4>dz</h4><p>Самый простой градиент: <span class="math-inline" data-tex="d\mathbf z=\hat{\mathbf p}-\mathbf y"></span>.</p></div>
    <div class="step-panel" data-on="sb-m0 sb-a1 sb-m1 sb-tab1 sb-f1" data-focus="sb-f1"><div class="step-kicker">Шаг 2 · линейный</div><h4>dz → dP</h4><p>Через веса: <span class="math-inline" data-tex="d\mathbf p=W^{\top}d\mathbf z"></span>, затем свернём обратно в 2×2.</p></div>
    <div class="step-panel" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-tab2 sb-f2" data-focus="sb-f2"><div class="step-kicker">Шаг 3 · пулинг</div><h4>dP → dA</h4><p>Каждый <span class="math-inline" data-tex="dP_{ij}"></span> кладётся в ту клетку <span class="math-inline" data-tex="dA"></span>, что победила в окне; перекрытия суммируются.</p></div>
    <div class="step-panel" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-a3 sb-m3 sb-tab3 sb-f3" data-focus="sb-f3"><div class="step-kicker">Шаг 4 · ReLU</div><h4>dA → dZ</h4><p>Умножаем на маску: <span class="math-inline" data-tex="dZ=dA\odot[Z>0]"></span>. Живыми остаются немногие клетки.</p></div>
    <div class="step-panel" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-a3 sb-m3 sb-c1 sb-m4 sb-m4lbl sb-a5 sb-m4X sb-tab4 sb-f4" data-focus="sb-f4"><div class="step-kicker">Шаг 5 · свёртка</div><h4>dZ → dK</h4><p><span class="math-inline" data-tex="dK_{uv}=\sum_{i,j}dZ_{ij}\,x_{i+u,\,j+v}"></span> — свёртка входа с dZ; <span class="math-inline" data-tex="db=\sum dZ"></span>.</p></div>
  </div>
</div>
<p class="stage-hint">Полный backward: dz → dP → dA → dZ → dK, а вход даёт dK свёрткой.</p>

---

## Часть 16. Backward на числах

<p>
  Теперь та же цепочка на числах. Старт — разность
  <span class="math-inline" data-tex="\hat{\mathbf p}-\mathbf y=[0{,}0923;\,-0{,}0923]"></span>.
  Пулинг маршрутизирует четыре числа в карту
  <span class="math-inline" data-tex="dA"></span>, но маска ReLU оставляет в
  <span class="math-inline" data-tex="dZ"></span> лишь две живые клетки — те, что
  победили в forward. Их рецептивные поля (красное на входе) — единственные
  пиксели, которые вообще влияют на градиент ядра.
</p>

<div class="stage numeric-stage" id="stageBN" tabindex="0" aria-label="Числа обратного прохода">
  <div class="stage-figure">
<svg class="cnn-svg" id="bn-svg" viewBox="0 0 960 540" role="img" aria-label="Числа обратного прохода по шагам">
<defs><marker id="bn-ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C30B0A"/></marker></defs><rect x="24.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="112.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dz (выход)</text><rect x="208.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="296.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dP</text><rect x="392.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="480.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dA (пулинг)</text><rect x="576.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="664.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dZ (ReLU)</text><rect x="760.0" y="16" width="176.0" height="30" rx="6" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="848.0" y="36" text-anchor="middle" font-size="12" fill="#5E5850">dK, db</text><text x="480" y="60" text-anchor="middle" font-size="12" fill="#5E5850">градиент идёт справа налево по слоям; каждый шаг добавляет матрицу</text>
<g data-key="bn-m0" data-only="1"><rect x="40" y="100" width="60" height="40" fill="rgb(255,181,181)" stroke="#C9C2B8" stroke-width="1"/><rect x="100" y="100" width="60" height="40" fill="rgb(255,181,181)" stroke="#C9C2B8" stroke-width="1"/><path d="M 39 95 L 33 95 L 33 145 L 39 145" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 161 95 L 167 95 L 167 145 L 161 145" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="70.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">0.092</text><text x="130.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">−0.092</text><text x="100.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">1 × 2</text><text x="100.0" y="162" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dz=p̂−y · 1×2</text></g>
<g data-key="bn-a1" data-only="1"><path d="M158 120.0 L246 120.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-ar)"/></g>
<g data-key="bn-m1" data-only="1"><rect x="250" y="100" width="56" height="40" fill="rgb(255,173,173)" stroke="#C9C2B8" stroke-width="1"/><rect x="306" y="100" width="56" height="40" fill="rgb(255,173,173)" stroke="#C9C2B8" stroke-width="1"/><rect x="250" y="140" width="56" height="40" fill="rgb(255,218,218)" stroke="#C9C2B8" stroke-width="1"/><rect x="306" y="140" width="56" height="40" fill="rgb(255,232,232)" stroke="#C9C2B8" stroke-width="1"/><path d="M 249 95 L 243 95 L 243 185 L 249 185" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 363 95 L 369 95 L 369 185 L 363 185" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="278.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">0.101</text><text x="334.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">−0.101</text><text x="278.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">0.046</text><text x="334.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">−0.028</text><text x="306.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">2 × 2</text><text x="306.0" y="202" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dP · 2×2</text></g>
<g data-key="bn-a2" data-only="1"><path d="M368 140.0 L426 140.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-ar)"/></g>
<g data-key="bn-m2" data-only="1"><rect x="430" y="100" width="52" height="40" fill="rgb(255,173,173)" stroke="#C9C2B8" stroke-width="1"/><rect x="482" y="100" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="534" y="100" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="430" y="140" width="52" height="40" fill="rgb(255,218,218)" stroke="#C9C2B8" stroke-width="1"/><rect x="482" y="140" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="534" y="140" width="52" height="40" fill="rgb(255,173,173)" stroke="#C9C2B8" stroke-width="1"/><rect x="430" y="180" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="482" y="180" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="534" y="180" width="52" height="40" fill="rgb(255,232,232)" stroke="#C9C2B8" stroke-width="1"/><path d="M 429 95 L 423 95 L 423 225 L 429 225" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 587 95 L 593 95 L 593 225 L 587 225" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="456.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">0.101</text><text x="508.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="560.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="456.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">0.046</text><text x="508.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="560.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">−0.101</text><text x="456.0" y="204.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="508.0" y="204.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="560.0" y="204.8" text-anchor="middle" font-size="12" fill="#111">−0.028</text><text x="508.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="508.0" y="242" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dA (пулинг)</text></g>
<g data-key="bn-a3" data-only="1"><path d="M592 160.0 L676 160.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-ar)"/></g>
<g data-key="bn-m3" data-only="1"><rect x="680" y="100" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="732" y="100" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="784" y="100" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="680" y="140" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="732" y="140" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="784" y="140" width="52" height="40" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="680" y="180" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="732" y="180" width="52" height="40" fill="#F4F3EF" stroke="#C9C2B8" stroke-width="1"/><rect x="784" y="180" width="52" height="40" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><path d="M 679 95 L 673 95 L 673 225 L 679 225" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 837 95 L 843 95 L 843 225 L 837 225" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="706.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="758.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="810.0" y="124.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="706.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="758.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="810.0" y="164.8" text-anchor="middle" font-size="12" fill="#111">−0.101</text><text x="706.0" y="204.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="758.0" y="204.8" text-anchor="middle" font-size="12" fill="#111">0.000</text><text x="810.0" y="204.8" text-anchor="middle" font-size="12" fill="#111">−0.028</text><text x="758.0" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="758.0" y="242" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dZ=dA·[Z&gt;0]</text></g>
<g data-key="bn-c1" data-only="1"><path d="M758.0 220 L758.0 300 L20 300 L20 413.0 L60 413.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-ar)"/></g>
<g data-key="bn-m4" data-only="1"><rect x="60" y="350" width="56" height="42" fill="rgb(255,168,168)" stroke="#C9C2B8" stroke-width="1"/><rect x="116" y="350" width="56" height="42" fill="rgb(255,205,205)" stroke="#C9C2B8" stroke-width="1"/><rect x="172" y="350" width="56" height="42" fill="rgb(255,239,239)" stroke="#C9C2B8" stroke-width="1"/><rect x="60" y="392" width="56" height="42" fill="rgb(255,220,220)" stroke="#C9C2B8" stroke-width="1"/><rect x="116" y="392" width="56" height="42" fill="rgb(255,161,161)" stroke="#C9C2B8" stroke-width="1"/><rect x="172" y="392" width="56" height="42" fill="rgb(255,226,226)" stroke="#C9C2B8" stroke-width="1"/><rect x="60" y="434" width="56" height="42" fill="rgb(255,184,184)" stroke="#C9C2B8" stroke-width="1"/><rect x="116" y="434" width="56" height="42" fill="rgb(255,162,162)" stroke="#C9C2B8" stroke-width="1"/><rect x="172" y="434" width="56" height="42" fill="rgb(255,224,224)" stroke="#C9C2B8" stroke-width="1"/><path d="M 59 345 L 53 345 L 53 481 L 59 481" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 229 345 L 235 345 L 235 481 L 229 481" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="88.0" y="376.0" text-anchor="middle" font-size="12" fill="#111">−0.108</text><text x="144.0" y="376.0" text-anchor="middle" font-size="12" fill="#111">−0.062</text><text x="200.0" y="376.0" text-anchor="middle" font-size="12" fill="#111">−0.020</text><text x="88.0" y="418.0" text-anchor="middle" font-size="12" fill="#111">−0.043</text><text x="144.0" y="418.0" text-anchor="middle" font-size="12" fill="#111">−0.116</text><text x="200.0" y="418.0" text-anchor="middle" font-size="12" fill="#111">−0.036</text><text x="88.0" y="460.0" text-anchor="middle" font-size="12" fill="#111">−0.088</text><text x="144.0" y="460.0" text-anchor="middle" font-size="12" fill="#111">−0.115</text><text x="200.0" y="460.0" text-anchor="middle" font-size="12" fill="#111">−0.038</text><text x="144.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="144.0" y="498" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dK · 3×3</text></g>
<g data-key="bn-a5" data-only="1"><path d="M236 413.0 L426 413.0" stroke="#C30B0A" stroke-width="2.2" fill="none" marker-end="url(#bn-ar)"/></g>
<g data-key="bn-m4X" data-only="1"><rect x="430" y="350" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="472" y="350" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="514" y="350" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="556" y="350" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="598" y="350" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="430" y="380" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="472" y="380" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="514" y="380" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="556" y="380" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="598" y="380" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="430" y="410" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="472" y="410" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="514" y="410" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="556" y="410" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="598" y="410" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="430" y="440" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="472" y="440" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="514" y="440" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="556" y="440" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="598" y="440" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="430" y="470" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="472" y="470" width="42" height="30" fill="#FFFFFF" stroke="#C9C2B8" stroke-width="1"/><rect x="514" y="470" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="556" y="470" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><rect x="598" y="470" width="42" height="30" fill="#F6B8B4" stroke="#C9C2B8" stroke-width="1"/><path d="M 429 345 L 423 345 L 423 505 L 429 505" fill="none" stroke="#3576C0" stroke-width="1.8"/><path d="M 641 345 L 647 345 L 647 505 L 641 505" fill="none" stroke="#3576C0" stroke-width="1.8"/><text x="451.0" y="368.6" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="493.0" y="368.6" text-anchor="middle" font-size="12" fill="#111">0.19</text><text x="535.0" y="368.6" text-anchor="middle" font-size="12" fill="#111">0.75</text><text x="577.0" y="368.6" text-anchor="middle" font-size="12" fill="#111">1.00</text><text x="619.0" y="368.6" text-anchor="middle" font-size="12" fill="#111">0.50</text><text x="451.0" y="398.6" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="493.0" y="398.6" text-anchor="middle" font-size="12" fill="#111">0.50</text><text x="535.0" y="398.6" text-anchor="middle" font-size="12" fill="#111">1.00</text><text x="577.0" y="398.6" text-anchor="middle" font-size="12" fill="#111">0.38</text><text x="619.0" y="398.6" text-anchor="middle" font-size="12" fill="#111">0.12</text><text x="451.0" y="428.6" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="493.0" y="428.6" text-anchor="middle" font-size="12" fill="#111">0.12</text><text x="535.0" y="428.6" text-anchor="middle" font-size="12" fill="#111">0.25</text><text x="577.0" y="428.6" text-anchor="middle" font-size="12" fill="#111">0.88</text><text x="619.0" y="428.6" text-anchor="middle" font-size="12" fill="#111">0.25</text><text x="451.0" y="458.6" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="493.0" y="458.6" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="535.0" y="458.6" text-anchor="middle" font-size="12" fill="#111">0.62</text><text x="577.0" y="458.6" text-anchor="middle" font-size="12" fill="#111">1.00</text><text x="619.0" y="458.6" text-anchor="middle" font-size="12" fill="#111">0.38</text><text x="451.0" y="488.6" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="493.0" y="488.6" text-anchor="middle" font-size="12" fill="#111">0.25</text><text x="535.0" y="488.6" text-anchor="middle" font-size="12" fill="#111">0.88</text><text x="577.0" y="488.6" text-anchor="middle" font-size="12" fill="#111">0.50</text><text x="619.0" y="488.6" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="535.0" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">5 × 5</text><text x="535.0" y="522" text-anchor="middle" font-size="14" font-weight="700" fill="#111">X: красное — рец. поле</text></g>
<g data-key="bn-db" data-only="1"><text x="60" y="518" class="v-small">db = Σ dZ = −0.129</text></g>
<g data-key="bn-tab0" data-only="1"><rect x="22.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-tab1" data-only="1"><rect x="206.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-tab2" data-only="1"><rect x="390.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-tab3" data-only="1"><rect x="574.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-tab4" data-only="1"><rect x="758.0" y="14" width="180.0" height="34" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.4"/></g>
<g data-key="bn-f0" data-only="1"><rect x="34" y="94" width="132" height="52" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="bn-f1" data-only="1"><rect x="244" y="94" width="124" height="92" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="bn-f2" data-only="1"><rect x="424" y="94" width="168" height="132" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="bn-f3" data-only="1"><rect x="674" y="94" width="168" height="132" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
<g data-key="bn-f4" data-only="1"><rect x="54" y="344" width="180" height="138" rx="8" fill="none" stroke="#D83BB9" stroke-width="2.6"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="bn-m0 bn-tab0 bn-f0" data-focus="bn-f0"><div class="step-kicker">Шаг 1 · dz</div><h4>Предсказание минус правда</h4><div class="math-display" data-bwdn-tex="bz"></div><p>Модель почти права, поэтому и правки маленькие: правильному классу нужно чуть больше вероятности, второму — чуть меньше.</p></div>
    <div class="step-panel" data-on="bn-m0 bn-a1 bn-m1 bn-tab1 bn-f1" data-focus="bn-f1"><div class="step-kicker">Шаг 2 · dW, dc, dp</div><h4>Линейный слой раздаёт градиент</h4><div class="math-display" data-bwdn-tex="bp"></div><p>Обратите внимание: столбцы <span class="math-inline" data-tex="dW"></span>, отвечающие нулевым входам <span class="math-inline" data-tex="p_1=p_3=0"></span>, тоже нулевые.</p></div>
    <div class="step-panel" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-tab2 bn-f2" data-focus="bn-f2"><div class="step-kicker">Шаг 3 · dA (пулинг)</div><h4>Каждое число — к своему победителю</h4><div class="math-display" data-bwdn-tex="ba"></div><p>Четыре элемента <span class="math-inline" data-tex="dP"></span> ложатся в адреса победителей. Два из них попадают в клетки, где forward давал ноль.</p></div>
    <div class="step-panel" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-a3 bn-m3 bn-tab3 bn-f3" data-focus="bn-f3"><div class="step-kicker">Шаг 4 · dZ (ReLU)</div><h4>Маска гасит мёртвые клетки</h4><div class="math-display" data-bwdn-tex="bZ"></div><p>Умножение на <span class="math-inline" data-tex="[Z>0]"></span> обнуляет те два вклада, что пришли в занулённые ReLU клетки. Остаются ровно две живые: <span class="math-inline" data-tex="(1,2)"></span> и <span class="math-inline" data-tex="(2,2)"></span>.</p></div>
    <div class="step-panel" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-a3 bn-m3 bn-c1 bn-m4 bn-a5 bn-m4X bn-db bn-tab4 bn-f4" data-focus="bn-f4"><div class="step-kicker">Шаг 5 · dK и db</div><h4>Свёртка входа с dZ</h4><div class="math-display" data-bwdn-tex="bK"></div><p>Каждый коэффициент ядра — сумма произведений <span class="math-inline" data-tex="dZ_{ij}"></span> на пиксели входа, которые с ним встречались. Красное поле на <span class="math-inline" data-tex="X"></span> — это все такие пиксели.</p></div>
  </div>
</div>
<p class="stage-hint">Красные клетки на входе — объединение рецептивных полей двух живых клеток dZ. Только они влияют на dK.</p>

<div class="callout-red">
  <strong>Градиент проходит по узкому коридору.</strong> Из двадцати пяти
  пикселей на <span class="math-inline" data-tex="dK"></span> влияет только правый
  блок 4×3 — рецептивное поле двух выживших клеток. Это прямое следствие того,
  что мы видели в forward: назад градиент течёт ровно по тем адресам, откуда
  вперёд пришёл сигнал, и только через переключатели, которые остались открыты.
</div>

---

## Часть 17. Проверка градиента и шаг обучения

<p>
  Аналитический градиент легко сверить с численным: сдвинуть один параметр на
  маленькое <span class="math-inline" data-tex="\varepsilon"></span> в обе стороны
  и поделить разность loss на <span class="math-inline" data-tex="2\varepsilon"></span>.
  Совпадение до десятого знака означает, что в выкладке нет ошибки.
</p>

<div class="worked-example">
  <div class="worked-label">Сверка центральными разностями · ε = 10⁻⁶</div>
  <div class="worked-grid">
    <div class="worked-cell">
      <span>Максимум расхождения по dK</span>
      <div class="math-display worked-math" data-tex="\max|dK-dK_{\text{числ}}|\approx7{,}1\cdot10^{-11}"></div>
    </div>
    <div class="worked-cell">
      <span>По db</span>
      <div class="math-display worked-math" data-tex="|db-db_{\text{числ}}|\approx9{,}4\cdot10^{-12}"></div>
    </div>
    <div class="worked-cell worked-result">
      <span>По dW</span>
      <div class="math-display worked-math" data-tex="\max|dW-dW_{\text{числ}}|\approx3{,}8\cdot10^{-11}"></div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> расхождения порядка <span class="math-inline" data-tex="10^{-10}"></span> — это шум округления, а не ошибка. Аналитические <span class="math-inline" data-tex="dK,\,db,\,dW"></span> верны; <span class="math-inline" data-tex="dX"></span> сверяется так же — расхождение 7,2·10⁻¹¹. Код сверки — в части 18.</p>
</div>

<p>
  Остаётся один шаг градиентного спуска. Вычитаем
  <span class="math-inline" data-tex="\eta\cdot\text{градиент}"></span> из каждого
  параметра и снова считаем loss на том же объекте.
</p>

<div class="math-display" data-tex="K\leftarrow K-\eta\,dK,\quad b\leftarrow b-\eta\,db,\quad W\leftarrow W-\eta\,dW,\quad \mathbf c\leftarrow \mathbf c-\eta\,d\mathbf c"></div>

<div class="worked-example">
  <div class="worked-label">Один шаг · η = 0,5</div>
  <div class="worked-grid">
    <div class="worked-cell">
      <span>Loss до шага</span>
      <div class="math-display worked-math" data-tex="\mathcal L = 0{,}0968"></div>
    </div>
    <div class="worked-cell worked-result">
      <span>Loss после шага</span>
      <div class="math-display worked-math" data-tex="\mathcal L = 0{,}0312"></div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> один шаг по верному градиенту уменьшил ошибку на том же объекте втрое — сеть стала ещё увереннее в правильном классе.</p>
</div>

### Как выглядит один шаг для ядра

<p>
  Правило простое: из каждого веса вычитаем скорость обучения, умноженную на его
  градиент. Ниже — та же операция для ядра на числах; для клетки правого столбца
  подсвечена вся тройка «было − η·градиент = стало».
</p>

<div class="stage numeric-stage" id="stageGD" tabindex="0" aria-label="Один шаг градиентного спуска для ядра">
  <div class="stage-figure">
<svg class="cnn-svg" id="gd-svg" viewBox="0 0 960 394" role="img" aria-label="Один шаг градиентного спуска для ядра">
<text x="30" y="34" class="v-title">Шаг градиентного спуска: K ← K − η·dK</text>
<text x="30" y="54" class="v-small">Вычитаем η=0,5 от градиента из каждого параметра. Показано ядро; b, W, c обновляются так же.</text>
<defs><marker id="gd-arrow2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
<g data-key="gd-base"><rect x="60" y="110" width="58" height="40" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="118" y="110" width="58" height="40" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="176" y="110" width="58" height="40" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="60" y="150" width="58" height="40" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="118" y="150" width="58" height="40" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="176" y="150" width="58" height="40" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="60" y="190" width="58" height="40" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="118" y="190" width="58" height="40" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><rect x="176" y="190" width="58" height="40" fill="#FFF8D9" stroke="#C9C2B8" stroke-width="1"/><path d="M 59 105 L 53 105 L 53 235 L 59 235" fill="none" stroke="#C29E08" stroke-width="1.8"/><path d="M 235 105 L 241 105 L 241 235 L 235 235" fill="none" stroke="#C29E08" stroke-width="1.8"/><text x="89.0" y="134.8" text-anchor="middle" font-size="12" fill="#111">1.00</text><text x="147.0" y="134.8" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="205.0" y="134.8" text-anchor="middle" font-size="12" fill="#111">−1.00</text><text x="89.0" y="174.8" text-anchor="middle" font-size="12" fill="#111">1.00</text><text x="147.0" y="174.8" text-anchor="middle" font-size="12" fill="#111">0.50</text><text x="205.0" y="174.8" text-anchor="middle" font-size="12" fill="#111">−1.00</text><text x="89.0" y="214.8" text-anchor="middle" font-size="12" fill="#111">1.00</text><text x="147.0" y="214.8" text-anchor="middle" font-size="12" fill="#111">0.00</text><text x="205.0" y="214.8" text-anchor="middle" font-size="12" fill="#111">−1.00</text><text x="147.0" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="147.0" y="252" text-anchor="middle" font-size="14" font-weight="700" fill="#111">K (было)</text><text x="256" y="175" text-anchor="middle" font-size="18" fill="#111">− 0,5 ×</text><rect x="310" y="110" width="58" height="40" fill="#FDECEC" stroke="#C9C2B8" stroke-width="1"/><rect x="368" y="110" width="58" height="40" fill="#FDECEC" stroke="#C9C2B8" stroke-width="1"/><rect x="426" y="110" width="58" height="40" fill="#FDECEC" stroke="#C9C2B8" stroke-width="1"/><rect x="310" y="150" width="58" height="40" fill="#FDECEC" stroke="#C9C2B8" stroke-width="1"/><rect x="368" y="150" width="58" height="40" fill="#FDECEC" stroke="#C9C2B8" stroke-width="1"/><rect x="426" y="150" width="58" height="40" fill="#FDECEC" stroke="#C9C2B8" stroke-width="1"/><rect x="310" y="190" width="58" height="40" fill="#FDECEC" stroke="#C9C2B8" stroke-width="1"/><rect x="368" y="190" width="58" height="40" fill="#FDECEC" stroke="#C9C2B8" stroke-width="1"/><rect x="426" y="190" width="58" height="40" fill="#FDECEC" stroke="#C9C2B8" stroke-width="1"/><path d="M 309 105 L 303 105 L 303 235 L 309 235" fill="none" stroke="#C30B0A" stroke-width="1.8"/><path d="M 485 105 L 491 105 L 491 235 L 485 235" fill="none" stroke="#C30B0A" stroke-width="1.8"/><text x="339.0" y="134.8" text-anchor="middle" font-size="12" fill="#111">−0.108</text><text x="397.0" y="134.8" text-anchor="middle" font-size="12" fill="#111">−0.062</text><text x="455.0" y="134.8" text-anchor="middle" font-size="12" fill="#111">−0.020</text><text x="339.0" y="174.8" text-anchor="middle" font-size="12" fill="#111">−0.043</text><text x="397.0" y="174.8" text-anchor="middle" font-size="12" fill="#111">−0.116</text><text x="455.0" y="174.8" text-anchor="middle" font-size="12" fill="#111">−0.036</text><text x="339.0" y="214.8" text-anchor="middle" font-size="12" fill="#111">−0.088</text><text x="397.0" y="214.8" text-anchor="middle" font-size="12" fill="#111">−0.115</text><text x="455.0" y="214.8" text-anchor="middle" font-size="12" fill="#111">−0.038</text><text x="397.0" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="397.0" y="252" text-anchor="middle" font-size="14" font-weight="700" fill="#111">dK</text><text x="524" y="175" text-anchor="middle" font-size="20" fill="#111">=</text><rect x="560" y="110" width="58" height="40" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="618" y="110" width="58" height="40" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="676" y="110" width="58" height="40" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="560" y="150" width="58" height="40" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="618" y="150" width="58" height="40" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="676" y="150" width="58" height="40" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="560" y="190" width="58" height="40" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="618" y="190" width="58" height="40" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><rect x="676" y="190" width="58" height="40" fill="#EAF6DC" stroke="#C9C2B8" stroke-width="1"/><path d="M 559 105 L 553 105 L 553 235 L 559 235" fill="none" stroke="#73B222" stroke-width="1.8"/><path d="M 735 105 L 741 105 L 741 235 L 735 235" fill="none" stroke="#73B222" stroke-width="1.8"/><text x="589.0" y="134.8" text-anchor="middle" font-size="12" fill="#111">1.054</text><text x="647.0" y="134.8" text-anchor="middle" font-size="12" fill="#111">0.031</text><text x="705.0" y="134.8" text-anchor="middle" font-size="12" fill="#111">−0.990</text><text x="589.0" y="174.8" text-anchor="middle" font-size="12" fill="#111">1.021</text><text x="647.0" y="174.8" text-anchor="middle" font-size="12" fill="#111">0.558</text><text x="705.0" y="174.8" text-anchor="middle" font-size="12" fill="#111">−0.982</text><text x="589.0" y="214.8" text-anchor="middle" font-size="12" fill="#111">1.044</text><text x="647.0" y="214.8" text-anchor="middle" font-size="12" fill="#111">0.058</text><text x="705.0" y="214.8" text-anchor="middle" font-size="12" fill="#111">−0.981</text><text x="647.0" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#5E5850">3 × 3</text><text x="647.0" y="252" text-anchor="middle" font-size="14" font-weight="700" fill="#111">K (стало)</text><rect x="60" y="290" width="360" height="90" rx="12" class="formula-bg"/><text x="240" y="322" text-anchor="middle" class="v-small">Loss до шага</text><text x="240" y="352" text-anchor="middle" font-size="20" fill="#C30B0A">L = 0.0968</text><path d="M430 335 L470 335" class="edge-green" marker-end="url(#gd-arrow2)"/><rect x="500" y="290" width="360" height="90" rx="12" class="formula-bg"/><text x="680" y="322" text-anchor="middle" class="v-small">Loss после шага (тот же объект)</text><text x="680" y="352" text-anchor="middle" font-size="20" fill="#73B222">L = 0.0312</text></g>
<g data-key="gd-hl" data-only="1"><rect x="176" y="110" width="58" height="40" fill="#D83BB9" fill-opacity="0.3" stroke="#D83BB9" stroke-width="2.2"/><rect x="426" y="110" width="58" height="40" fill="#D83BB9" fill-opacity="0.3" stroke="#D83BB9" stroke-width="2.2"/><rect x="676" y="110" width="58" height="40" fill="#D83BB9" fill-opacity="0.3" stroke="#D83BB9" stroke-width="2.2"/></g>
</svg>
  </div>
  <div class="stage-bar"><button type="button" data-nav="prev">← Назад</button><button type="button" data-nav="next">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
  <div class="stage-notes">
    <div class="step-panel" data-on="gd-base" data-focus="gd-base"><div class="step-kicker">Шаг 1 · всё ядро</div><h4>K ← K − η·dK</h4><p>Каждая из девяти клеток обновляется независимо: из старого веса вычитается <span class="math-inline" data-tex="\eta=0{,}5"></span> градиента. Loss на том же объекте падает с 0,0968 до 0,0312.</p></div>
    <div class="step-panel" data-on="gd-base gd-hl" data-focus="gd-hl"><div class="step-kicker">Шаг 2 · одна клетка</div><h4>Правый столбец — где живёт градиент</h4><p>Клетка <span class="math-inline" data-tex="K_{1,3}"></span>: <span class="math-inline" data-tex="-1 - 0{,}5\cdot(-0{,}020) = -0{,}990"></span>. Меняются в основном веса, через которые прошёл сигнал в forward.</p></div>
  </div>
</div>
<p class="stage-hint">b, W и c обновляются точно так же — вычитанием η, умноженного на их градиент.</p>

<div class="callout">
  <strong>Градиент верен, шаг работает.</strong> Мы прошли объект вперёд до loss,
  вернули производную назад до каждого веса, сверили её с численной и сделали шаг
  обучения. Это полный цикл, из которого состоит обучение любой свёрточной сети —
  только матрицы там больше, а объектов миллионы.
</div>

---

## Часть 18. Тот же путь в коде: NumPy → классы → PyTorch

<p>
  Всё, что было в интерактивах, — это несколько коротких функций. Ниже одно и то же
  вычисление записано трижды. Сначала голый NumPy: forward и backward отдельными
  функциями, каждая повторяет одну формулу из частей 5–16. Потом тот же код,
  разложенный по классам: у каждого слоя свой <code>forward</code>, свой
  <code>backward</code> и своя память. И в конце — PyTorch, где эти классы уже
  написаны за нас. Все три версии печатают одни и те же числа.
</p>

### Шаг 1. NumPy: forward функциями

<p>
  Три функции — свёртка, ReLU и max-пулинг — повторяют ровно те тридцать шесть
  локальных произведений, которые были в интерактиве части 6, и печатают ту же карту
  для цифры 7. Пулинг сразу запоминает адрес победителя в каждом окне: на forward он
  не нужен, но без него не построить backward.
</p>

<pre><code>import numpy as np

X = np.array([                       # цифра 7 из sklearn digits, объект №1330
    [0, 0,  3, 11, 16, 15,  2, 0],
    [0, 4, 16, 10,  4, 16,  4, 0],
    [0, 7,  6,  0,  5, 16,  1, 0],
    [0, 0,  0,  0, 10, 12,  0, 0],
    [0, 0,  0,  9, 16, 16, 10, 0],
    [0, 0,  0,  6, 15,  6,  1, 0],
    [0, 0,  0, 13,  9,  0,  0, 0],
    [0, 0,  1, 15,  2,  0,  0, 0],
], dtype=float)

K = np.array([[1, 0, -1],
              [1, 0, -1],
              [1, 0, -1]], dtype=float)   # детектор вертикального края

def conv2d(x, kernel, bias=0.0, stride=1, padding=0):
    x = np.pad(x, padding)
    kh, kw = kernel.shape
    h_out = (x.shape[0] - kh) // stride + 1
    w_out = (x.shape[1] - kw) // stride + 1
    z = np.empty((h_out, w_out))
    for i in range(h_out):
        for j in range(w_out):
            patch = x[i*stride:i*stride+kh, j*stride:j*stride+kw]
            z[i, j] = np.sum(patch * kernel) + bias
    return z

def relu(z):
    return np.maximum(z, 0)

def max_pool(a, f=2, s=2):
    h_out = (a.shape[0] - f) // s + 1
    w_out = (a.shape[1] - f) // s + 1
    out, winners = np.empty((h_out, w_out)), {}
    for i in range(h_out):
        for j in range(w_out):
            win = a[i*s:i*s+f, j*s:j*s+f]
            r, c = np.unravel_index(win.argmax(), win.shape)
            out[i, j] = win[r, c]
            winners[i, j] = (i*s + r, j*s + c)   # адрес победителя — для backward
    return out, winners

Z = conv2d(X, K)                     # (6, 6)
A = relu(Z)
print(Z[0, 0], Z[0, 5], A.max())     # -25.0  47.0  47.0
P, _ = max_pool(A)                   # 2×2, шаг 2
print(P)
# [[ 1.  3. 47.]
#  [ 0.  0. 44.]
#  [ 0. 28. 29.]]

shifted = np.zeros_like(X)
shifted[:, :-1] = X[:, 1:]                       # сдвиг цифры на пиксель влево
A_shift = relu(conv2d(shifted, K))
print(np.array_equal(A_shift[:, :-1], A[:, 1:])) # True — карта сдвинулась так же
print(A.max(), A_shift.max())                    # 47.0 47.0 — максимум тот же</code></pre>

### Шаг 2. NumPy: backward функциями

<p>
  Теперь сеть из частей 11–17. Прямой проход собирается из тех же функций и
  возвращает не только loss, но и <code>cache</code> — ровно то, что в таблице части
  14 названо памятью forward. Обратный проход идёт по формулам части 15 справа
  налево. Обратите внимание на <code>conv2d_backward</code>: новой процедуры в нём нет,
  обе производные — снова вызовы <code>conv2d</code>. Градиент ядра — свёртка входа с
  <span class="math-inline" data-tex="dZ"></span>, градиент входа — свёртка
  дополненного нулями <span class="math-inline" data-tex="dZ"></span> с ядром,
  повёрнутым на 180°.
</p>

<pre><code>np.set_printoptions(precision=4, suppress=True)

X5 = np.array([[0, 3, 12, 16, 8],
               [0, 8, 16,  6, 2],
               [0, 2,  4, 14, 4],
               [0, 0, 10, 16, 6],
               [0, 4, 14,  8, 0]]) / 16
K5 = np.array([[1, 0,   -1],
               [1, 0.5, -1],
               [1, 0,   -1]])
b5 = 0.2
W = np.array([[ 0.6, -0.6,  0.3, -0.1],
              [-0.5,  0.5, -0.2,  0.2]])
c = np.array([1.0, 0.8])
y = 1                                          # правильный класс

def softmax_ce(z, y):
    e = np.exp(z - z.max())
    p_hat = e / e.sum()
    return p_hat, -np.log(p_hat[y])

def forward(X, K, b, W, c):
    Z = conv2d(X, K, b)                        # (3, 3)
    A = relu(Z)
    P, winners = max_pool(A, f=2, s=1)         # (2, 2)
    p = P.ravel()                              # (4,)
    z = W @ p + c                              # (2,)
    p_hat, L = softmax_ce(z, y)
    cache = (X, Z, A, winners, p, p_hat)
    return L, cache

def relu_backward(dA, Z):
    return dA * (Z &gt; 0)

def max_pool_backward(dP, winners, shape):
    dA = np.zeros(shape)
    for (i, j), (r, c_) in winners.items():
        dA[r, c_] += dP[i, j]                  # перекрытия окон складываются
    return dA

def conv2d_backward(dZ, X, K):
    dK = conv2d(X, dZ)                         # вход ⋆ dZ
    db = dZ.sum()
    dX = conv2d(np.pad(dZ, K.shape[0] - 1), np.rot90(K, 2))  # полная свёртка с rot180
    return dK, db, dX

def backward(cache, K, W):
    X, Z, A, winners, p, p_hat = cache
    dz = p_hat.copy(); dz[y] -= 1              # p̂ − y
    dW, dc = np.outer(dz, p), dz
    dP = (W.T @ dz).reshape(2, 2)
    dA = max_pool_backward(dP, winners, A.shape)
    dZ = relu_backward(dA, Z)
    dK, db, dX = conv2d_backward(dZ, X, K)
    return dK, db, dW, dc

L, cache = forward(X5, K5, b5, W, c)
dK, db, dW, dc = backward(cache, K5, W)
print(round(L, 4))                             # 0.0968
print(dK)
# [[-0.1084 -0.0623 -0.0196]
#  [-0.0427 -0.1165 -0.0358]
#  [-0.0877 -0.1153 -0.0381]]
print(round(db, 4))                            # -0.1292</code></pre>

<p>
  Сверка центральными разностями и шаг обучения — те же числа, что в части 17:
</p>

<pre><code>def numeric_grad(f, t, eps=1e-6):
    g = np.zeros_like(t)
    for idx in np.ndindex(t.shape):
        old = t[idx]
        t[idx] = old + eps; up = f()
        t[idx] = old - eps; down = f()
        t[idx] = old
        g[idx] = (up - down) / (2 * eps)
    return g

loss = lambda: forward(X5, K5, b5, W, c)[0]
print(np.abs(dK - numeric_grad(loss, K5)).max())   # 7.1e-11
print(np.abs(dW - numeric_grad(loss, W)).max())    # 3.8e-11

eta = 0.5
K5 -= eta * dK; b5 -= eta * db; W -= eta * dW; c -= eta * dc
print(round(forward(X5, K5, b5, W, c)[0], 4))  # 0.0312</code></pre>

<div class="callout-blue"><strong>Где тут неудобно?</strong> Функции работают, но
  связывает их вручную написанный <code>forward</code>/<code>backward</code> всей сети:
  порядок вызовов, <code>cache</code> как кортеж, список параметров для шага. Добавьте
  второй свёрточный слой — и придётся переписывать все три места. Объектный вид
  убирает именно эту склейку.</div>

### Шаг 3. Тот же код в объектном виде

<p>
  Каждая функция становится классом с двумя методами. <code>forward</code> считает
  выход и кладёт в <code>self</code> то, что понадобится назад: вход свёртки, маску
  ReLU, адреса победителей пулинга, форму карты, вектор <span class="math-inline" data-tex="\mathbf p"></span>.
  <code>backward</code> получает градиент по своему выходу, записывает градиенты
  параметров в <code>self.grads</code> и возвращает градиент по входу. Внутри —
  те же строки, что в шаге 2; <code>conv2d</code> и <code>max_pool</code> переиспользуются
  без изменений.
</p>

<pre><code>class Conv2d:
    def __init__(self, K, b):
        self.params = {"K": np.array(K, float), "b": np.array(b, float)}
        self.grads = {}
    def forward(self, X):
        self.X = X                                   # запомнить вход
        return conv2d(X, self.params["K"], self.params["b"])
    def backward(self, dZ):
        K = self.params["K"]
        self.grads["K"] = conv2d(self.X, dZ)         # вход ⋆ dZ
        self.grads["b"] = dZ.sum()
        return conv2d(np.pad(dZ, K.shape[0] - 1), np.rot90(K, 2))

class ReLU:
    params, grads = {}, {}
    def forward(self, Z):
        self.mask = Z &gt; 0                            # запомнить маску
        return Z * self.mask
    def backward(self, dA):
        return dA * self.mask

class MaxPool2d:
    params, grads = {}, {}
    def __init__(self, f, s):
        self.f, self.s = f, s
    def forward(self, A):
        self.shape = A.shape
        P, self.winners = max_pool(A, self.f, self.s)  # запомнить адреса
        return P
    def backward(self, dP):
        dA = np.zeros(self.shape)
        for (i, j), (r, c) in self.winners.items():
            dA[r, c] += dP[i, j]
        return dA

class Flatten:
    params, grads = {}, {}
    def forward(self, P):
        self.shape = P.shape
        return P.ravel()
    def backward(self, dp):
        return dp.reshape(self.shape)

class Linear:
    def __init__(self, W, c):
        self.params = {"W": np.array(W, float), "c": np.array(c, float)}
        self.grads = {}
    def forward(self, p):
        self.p = p
        return self.params["W"] @ p + self.params["c"]
    def backward(self, dz):
        self.grads["W"] = np.outer(dz, self.p)
        self.grads["c"] = dz
        return self.params["W"].T @ dz

class SoftmaxCrossEntropy:
    def forward(self, z, y):
        e = np.exp(z - z.max())
        self.p_hat, self.y = e / e.sum(), y
        return -np.log(self.p_hat[y])
    def backward(self):
        dz = self.p_hat.copy()
        dz[self.y] -= 1
        return dz

class Sequential:
    def __init__(self, *layers):
        self.layers = layers
    def forward(self, x):
        for layer in self.layers:
            x = layer.forward(x)
        return x
    def backward(self, grad):
        for layer in reversed(self.layers):
            grad = layer.backward(grad)
        return grad

class SGD:
    def __init__(self, layers, lr):
        self.layers, self.lr = layers, lr
    def step(self):
        for layer in self.layers:
            for name in layer.params:
                layer.params[name] -= self.lr * layer.grads[name]</code></pre>

<p>
  Теперь сеть собирается как список слоёв, а весь backward — это цикл по нему в
  обратном порядке. Оптимизатору не нужно знать, какие слои у сети: он просто
  обходит их словари <code>params</code> и <code>grads</code>.
</p>

<pre><code>model = Sequential(
    Conv2d(K=[[1, 0, -1], [1, 0.5, -1], [1, 0, -1]], b=0.2),
    ReLU(),
    MaxPool2d(f=2, s=1),
    Flatten(),
    Linear(W=[[0.6, -0.6, 0.3, -0.1], [-0.5, 0.5, -0.2, 0.2]], c=[1.0, 0.8]),
)
criterion = SoftmaxCrossEntropy()
optimizer = SGD(model.layers, lr=0.5)

L = criterion.forward(model.forward(X5), y=1)
dX = model.backward(criterion.backward())   # градиент дошёл до входа: (5, 5)
conv = model.layers[0]
print(round(L, 4))                          # 0.0968
print(conv.grads["K"].round(4))            # та же матрица dK, что в листинге 2
print(round(conv.grads["b"], 4))            # -0.1292

optimizer.step()
print(round(criterion.forward(model.forward(X5), y=1), 4))   # 0.0312

edge = Conv2d(K=np.array([[1, 0, -1]] * 3), b=0.0)   # тот же класс на цифре 7
print(ReLU().forward(edge.forward(X)).max())          # 47.0</code></pre>

<div class="callout-blue"><strong>Контракт слоя:</strong> <code>forward(x)</code>
  запоминает, <code>backward(grad)</code> возвращает градиент по входу и заполняет
  <code>grads</code>. Пока каждый слой его соблюдает, <code>Sequential</code> и
  <code>SGD</code> не меняются, сколько бы слоёв ни добавилось. Ровно так устроены
  модули настоящих фреймворков.</div>

### Шаг 4. То же в PyTorch

<p>
  В PyTorch классы из шага 3 уже есть: <code>nn.Conv2d</code>, <code>nn.ReLU</code>,
  <code>nn.MaxPool2d</code>, <code>nn.Flatten</code>, <code>nn.Linear</code>, а softmax
  с cross-entropy объединены в <code>F.cross_entropy</code>. Методы
  <code>backward</code> писать не нужно: autograd сам записывает граф во время forward и
  проходит его назад. Две вещи остаются на нас — явные оси батча и каналов
  <code>[N, C, H, W]</code> и обнуление градиентов после шага.
</p>

<pre><code>import torch
from torch import nn
import torch.nn.functional as F

x = torch.tensor(X5)[None, None]            # [N, C, H, W] = [1, 1, 5, 5], float64

net = nn.Sequential(
    nn.Conv2d(1, 1, kernel_size=3),          # K: [1, 1, 3, 3], b: [1]
    nn.ReLU(),
    nn.MaxPool2d(kernel_size=2, stride=1),   # [1, 1, 3, 3] → [1, 1, 2, 2]
    nn.Flatten(),                            # → [1, 4], тот же порядок, что ravel
    nn.Linear(4, 2),                         # W: [2, 4], c: [2]
).double()

with torch.no_grad():                        # те же веса, что у NumPy-версии
    net[0].weight.copy_(torch.tensor([[1, 0, -1], [1, 0.5, -1], [1, 0, -1]])[None, None])
    net[0].bias.fill_(0.2)
    net[4].weight.copy_(torch.tensor([[0.6, -0.6, 0.3, -0.1], [-0.5, 0.5, -0.2, 0.2]]))
    net[4].bias.copy_(torch.tensor([1.0, 0.8]))

optimizer = torch.optim.SGD(net.parameters(), lr=0.5)
target = torch.tensor([1])

loss = F.cross_entropy(net(x), target)      # softmax и −log внутри
loss.backward()                              # все dK, db, dW, dc — одной строкой
print(round(loss.item(), 4))                 # 0.0968
print(net[0].weight.grad[0, 0])              # та же матрица dK
print(net[0].bias.grad)                      # tensor([-0.1292])

optimizer.step()                             # K ← K − η·dK и так для всех
optimizer.zero_grad()                        # иначе градиенты накопятся
print(round(F.cross_entropy(net(x), target).item(), 4))   # 0.0312</code></pre>

<table class="shape-table">
  <thead><tr><th>Операция</th><th>NumPy-функция</th><th>Класс</th><th>PyTorch</th><th>Что помнит forward</th></tr></thead>
  <tbody>
    <tr><td>свёртка</td><td><code>conv2d</code>, <code>conv2d_backward</code></td><td><code>Conv2d</code></td><td><code>nn.Conv2d</code></td><td>вход <code>X</code></td></tr>
    <tr><td>ReLU</td><td><code>relu</code>, <code>relu_backward</code></td><td><code>ReLU</code></td><td><code>nn.ReLU</code></td><td>маска <code>Z &gt; 0</code></td></tr>
    <tr><td>max-пулинг</td><td><code>max_pool</code>, <code>max_pool_backward</code></td><td><code>MaxPool2d</code></td><td><code>nn.MaxPool2d</code></td><td>адреса победителей</td></tr>
    <tr><td>распрямление</td><td><code>P.ravel()</code></td><td><code>Flatten</code></td><td><code>nn.Flatten</code></td><td>форму карты</td></tr>
    <tr><td>линейный слой</td><td><code>W @ p + c</code></td><td><code>Linear</code></td><td><code>nn.Linear</code></td><td>вектор <code>p</code></td></tr>
    <tr><td>softmax + CE</td><td><code>softmax_ce</code></td><td><code>SoftmaxCrossEntropy</code></td><td><code>F.cross_entropy</code></td><td><code>p̂</code> и метку</td></tr>
    <tr><td>шаг обучения</td><td><code>K5 -= eta * dK</code> …</td><td><code>SGD</code></td><td><code>torch.optim.SGD</code></td><td>—</td></tr>
  </tbody>
</table>

<div class="callout-yellow"><strong>Честно о проверке:</strong> листинги NumPy и
  классов запущены, их вывод приведён в комментариях. PyTorch в песочнице, где
  собиралась статья, не установлен, поэтому последний листинг не прогонялся; числа в
  его комментариях — из NumPy-версии, с которой он обязан совпасть, потому что
  операции те же. Возможная разница — только в том, какой из равных нулей пулинг
  назовёт победителем, но такие клетки всё равно закрыты маской ReLU.</div>

<div class="callout"><strong>Что берёт на себя фреймворк:</strong> backward каждого
  слоя, память forward, сбор параметров, батч и каналы, быстрые циклы. Математика та
  же, что в шаге 2, а за формами тензоров, архитектурой, loss и смыслом данных
  по-прежнему следите вы.</div>

### Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Изображение — тензор.</strong> Пространственные оси <code>H, W</code>, каналы <code>C</code> и батч <code>N</code> несут разный смысл.</li>
  <li><strong>Полносвязный слой привязан к координатам.</strong> Один пиксель сдвига уронил точность с 97,0% до 39,3% — это и есть причина появления свёртки.</li>
  <li><strong>Одна клетка карты — локальный dot product.</strong> Окно и ядро перемножаются поэлементно, складываются и получают общий bias.</li>
  <li><strong>Веса разделяются по пространству.</strong> Десять параметров вместо шестисот пятидесяти, и это число не зависит от размера картинки.</li>
  <li><strong>Один фильтр — один выходной канал,</strong> а глубина фильтра всегда равна числу входных каналов.</li>
  <li><strong>Размер выхода считается заранее:</strong> <code>⌊(n+2p−f)/s⌋+1</code>, одна формула для свёртки и для пулинга.</li>
  <li><strong>Pooling не обучается.</strong> Он сжимает высоту и ширину, работает по каналам независимо и добавляет устойчивость к мелкому сдвигу.</li>
  <li><strong>Глубина растит рецептивное поле:</strong> при шаге 1 каждый слой прибавляет <code>K−1</code>, поэтому три ядра 3×3 видят столько же, сколько одно 7×7.</li>
  <li><strong>Backward стартует с <span class="math-inline" data-tex="\hat{\mathbf p}-\mathbf y"></span></strong> и идёт справа налево; для него forward запоминает вход, маску ReLU и адреса победителей пулинга.</li>
  <li><strong>ReLU и max-пулинг — переключатели:</strong> градиент возвращается только по тем клеткам, через которые прошёл сигнал вперёд.</li>
  <li><strong>В backward общий вес получает сумму</strong> градиентов со всех позиций: <span class="math-inline" data-tex="dK=X\star dZ"></span>, а <span class="math-inline" data-tex="dX"></span> — полная свёртка <span class="math-inline" data-tex="dZ"></span> с перевёрнутым ядром.</li>
  <li><strong>Градиент проверяется центральными разностями:</strong> расхождение порядка <span class="math-inline" data-tex="10^{-10}"></span> — шум округления, а не ошибка.</li>
  <li><strong>Слой — это пара forward/backward плюс память.</strong> Функции NumPy, классы с кэшем и <code>nn.Module</code> PyTorch — три записи одной и той же математики.</li>
  <li><strong>Цикл обучения не изменился:</strong> forward → loss → backward → update. Новым стал только способ связать входы с параметрами.</li>
</ol>

<p class="tiny">Изображение, веса, логиты, вероятности и точности получены на наборе <code>digits</code> из scikit-learn: 1257 объектов в обучении, 540 в проверке, логистическая регрессия с настройками по умолчанию. Карты признаков, pooling и сдвиги посчитаны NumPy-кодом из части 18. Части 11–17 используют отдельную картинку 5×5, подобранную вручную (в <code>digits</code> такого фрагмента нет), и заданные руками K, b, W, c; forward, backward, сверка центральными разностями (ε = 10⁻⁶) и шаг η = 0,5 посчитаны тем же кодом. Листинг PyTorch в песочнице не запускался — числа в его комментариях взяты из NumPy-версии. Округление — до четырёх знаков, в тексте обычно до двух-трёх. Фильтры 3×3 заданы вручную, как в лекции, а не обучены.</p>

<script>
(function () {
  'use strict';
  // Строки формул для сцен. Заполняются до renderProseMath шелла.
  var FWDF = {
    fx: 'X\\in\\mathbb{R}^{5\\times5},\\quad K\\in\\mathbb{R}^{3\\times3},\\ b\\in\\mathbb{R},\\quad W\\in\\mathbb{R}^{2\\times4},\\ \\mathbf c\\in\\mathbb{R}^{2}',
    fc: 'Z_{ij}=b+\\sum_{u=0}^{2}\\sum_{v=0}^{2}X_{i+u,\\,j+v}\\,K_{uv}\\quad\\Rightarrow\\quad Z\\in\\mathbb{R}^{3\\times3}',
    fr: 'A_{ij}=\\max(0,\\;Z_{ij})',
    fp: 'P_{ij}=\\max_{0\\le u,v\\le1}A_{i+u,\\,j+v}\\quad\\Rightarrow\\quad P\\in\\mathbb{R}^{2\\times2}',
    ff: '\\mathbf p=\\operatorname{vec}(P)\\in\\mathbb{R}^{4},\\qquad \\mathbf z=W\\mathbf p+\\mathbf c\\in\\mathbb{R}^{2}',
    fs: '\\hat p_k=\\dfrac{e^{z_k}}{\\sum_j e^{z_j}}',
    fl: '\\mathcal L=-\\log \\hat p_{y},\\qquad y=1'
  };
  var FWDN = {
    fx: 'X=\\tfrac{1}{16}\\begin{bmatrix}0&3&12&16&8\\\\0&8&16&6&2\\\\0&2&4&14&4\\\\0&0&10&16&6\\\\0&4&14&8&0\\end{bmatrix}',
    fz: 'Z=\\begin{bmatrix}-1{,}55&-0{,}74&1{,}51\\\\-1{,}61&-1{,}30&1{,}76\\\\-1{,}55&-1{,}49&1{,}83\\end{bmatrix}\\ (\\text{правый столбец}>0)',
    fa: 'A=\\max(0,Z)=\\begin{bmatrix}0&0&1{,}51\\\\0&0&1{,}76\\\\0&0&1{,}83\\end{bmatrix}',
    fp: 'P=\\begin{bmatrix}0&1{,}7625\\\\0&1{,}825\\end{bmatrix},\\qquad \\mathbf p=[\\,0;\\ 1{,}7625;\\ 0;\\ 1{,}825\\,]',
    flin: '\\mathbf z=W\\mathbf p+\\mathbf c=[\\,-0{,}24;\\ 2{,}0462\\,]',
    fsoft: '\\hat{\\mathbf p}=[\\,0{,}0923;\\ 0{,}9077\\,]',
    floss: '\\mathcal L=-\\log(0{,}9077)=0{,}0968'
  };
  var BWDF = {
    bs: '\\dfrac{\\partial \\mathcal L}{\\partial \\mathbf z}=\\hat{\\mathbf p}-\\mathbf y',
    bf: 'dW=d\\mathbf z\\,\\mathbf p^{\\top},\\quad d\\mathbf c=d\\mathbf z,\\quad d\\mathbf p=W^{\\top}d\\mathbf z',
    bp: 'dA_{r,c}\\mathrel{+}=dP_{ij}\\ \\text{для победителя }(r,c)\\text{ окна }(i,j)',
    br: 'dZ_{ij}=dA_{ij}\\cdot[\\,Z_{ij}>0\\,]',
    bc: 'dK_{uv}=\\sum_{i,j}dZ_{ij}\\,X_{i+u,\\,j+v},\\qquad db=\\sum_{i,j}dZ_{ij}',
    bx: 'dX=dZ \\ast \\operatorname{rot}_{180}(K)\\ (\\text{полная свёртка})'
  };
  var BWDN = {
    bz: 'd\\mathbf z=\\hat{\\mathbf p}-\\mathbf y=[\\,0{,}0923;\\ -0{,}0923\\,]',
    bp: 'dW=\\begin{bmatrix}0&0{,}163&0&0{,}168\\\\0&-0{,}163&0&-0{,}168\\end{bmatrix},\\quad d\\mathbf p=[\\,0{,}101;\\,-0{,}101;\\,0{,}046;\\,-0{,}028\\,]',
    ba: 'dA=\\begin{bmatrix}0{,}101&0&0\\\\0{,}046&0&-0{,}101\\\\0&0&-0{,}028\\end{bmatrix}\\ (\\text{до маски ReLU})',
    bZ: 'dZ=dA\\cdot[Z>0]=\\begin{bmatrix}0&0&0\\\\0&0&-0{,}101\\\\0&0&-0{,}028\\end{bmatrix}',
    bK: 'dK=\\begin{bmatrix}-0{,}108&-0{,}062&-0{,}020\\\\-0{,}043&-0{,}116&-0{,}036\\\\-0{,}088&-0{,}115&-0{,}038\\end{bmatrix},\\quad db=-0{,}1292'
  };
  function fill(attr, table) {
    document.querySelectorAll('[' + attr + ']').forEach(function (node) {
      var key = node.getAttribute(attr);
      if (table[key]) node.setAttribute('data-tex', table[key]);
    });
  }
  fill('data-fwdf-tex', FWDF);
  fill('data-fwdn-tex', FWDN);
  fill('data-bwdf-tex', BWDF);
  fill('data-bwdn-tex', BWDN);
})();
</script>

<script>
(function () {
  'use strict';

  const BLUE = '#3576C0', YELLOW = '#C29E08', GREEN = '#73B222', RED = '#C30B0A';
  const INK = '#111111', MUTED = '#5E5850', GRID = '#C9C2B8';
  const X8 = [[0,0,3,11,16,15,2,0],
    [0,4,16,10,4,16,4,0],
    [0,7,6,0,5,16,1,0],
    [0,0,0,0,10,12,0,0],
    [0,0,0,9,16,16,10,0],
    [0,0,0,6,15,6,1,0],
    [0,0,0,13,9,0,0,0],
    [0,0,1,15,2,0,0,0]];
  const SMOOTH = [[0,0,0,0,0,0,0,0,0,1,2,5,7,10,12,14,16,16,16,16,16,16,14,10,6,3,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,2,3,5,8,10,12,14,15,16,16,16,16,16,14,10,6,3,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,2,3,5,7,8,10,12,13,14,15,15,15,16,16,14,11,7,3,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,3,5,7,8,9,10,11,11,12,12,12,12,13,15,16,14,11,7,4,2,1,0,0,0,0],
    [0,0,0,0,1,2,3,6,9,11,12,12,12,11,11,10,9,8,9,11,14,16,15,12,8,5,3,1,1,0,0,0],
    [0,0,0,1,1,3,5,8,12,15,15,15,13,11,10,8,6,5,6,9,13,15,15,13,9,5,3,2,1,0,0,0],
    [0,0,0,1,2,4,6,9,13,15,16,15,12,10,8,6,4,3,4,8,12,16,16,13,9,5,3,2,1,0,0,0],
    [0,0,0,1,3,5,7,9,12,13,13,12,10,7,6,4,3,3,4,8,13,16,16,13,8,4,2,1,1,0,0,0],
    [0,0,1,2,4,6,7,9,10,11,10,8,6,4,3,2,2,3,5,9,13,16,16,12,8,4,1,1,0,0,0,0],
    [0,0,1,2,4,6,7,8,8,8,7,5,3,1,1,1,2,4,6,9,13,16,15,12,7,3,0,0,0,0,0,0],
    [0,0,1,2,4,6,7,7,6,5,4,3,1,0,0,1,2,4,7,10,13,15,15,11,6,2,0,0,0,0,0,0],
    [0,0,0,2,3,4,5,5,4,4,3,1,0,0,0,1,3,5,8,10,13,15,14,10,5,1,0,0,0,0,0,0],
    [0,0,0,1,2,2,3,3,2,2,1,1,0,0,0,2,4,7,9,11,13,13,12,9,4,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,3,6,8,10,12,13,13,11,8,4,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,4,7,10,11,12,13,13,11,8,5,2,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,7,9,12,13,14,14,14,13,10,7,5,3,2,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,2,4,5,7,9,12,14,14,15,15,15,15,13,10,8,6,4,2,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,3,5,7,9,11,13,15,16,16,16,16,16,14,13,11,8,6,3,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,3,5,8,10,12,14,16,16,16,16,15,15,14,12,11,9,6,3,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,3,5,7,9,12,14,16,16,15,14,13,12,11,10,8,7,4,2,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,2,4,6,8,11,14,16,16,15,13,11,9,8,6,5,4,2,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,2,3,5,7,10,13,15,15,13,11,8,6,5,3,2,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,2,4,5,7,10,13,14,14,12,9,6,4,3,2,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,3,5,7,9,11,12,13,13,10,7,4,3,2,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,3,7,9,11,12,12,12,11,8,5,3,1,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,4,8,11,13,13,12,11,9,6,4,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,5,9,13,14,13,11,9,7,5,2,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,2,6,10,13,14,13,10,7,5,3,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,2,6,11,14,14,12,9,5,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,2,6,11,14,14,12,8,4,2,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,2,7,11,15,15,12,7,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,2,7,11,15,15,11,7,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
  const KV = [[1,0,-1],[1,0,-1],[1,0,-1]];
  const KH = [[1,1,1],[0,0,0],[-1,-1,-1]];
  const WBIN = [[0.00,-0.12,0.12,0.57,0.39,1.09,1.14,0.43],
    [0.00,-0.06,0.80,0.24,2.02,0.51,0.40,0.55],
    [-0.00,-0.83,-1.40,-1.22,-0.24,0.28,0.51,-0.00],
    [0.00,-1.34,-0.77,-1.34,-0.29,1.17,0.75,-0.03],
    [0.00,-0.12,0.29,0.56,0.86,1.21,0.98,0.00],
    [-0.00,-0.59,-0.04,0.57,0.51,-0.41,-0.14,-0.00],
    [-0.00,-0.35,-0.32,0.16,-2.01,-2.51,-0.46,-0.02],
    [-0.00,-0.21,0.13,-0.88,-2.22,-1.67,-0.33,-0.04]];
  const BBIN = -3.0759;
  const TPL = [
    [[0.00,-0.02,-0.08,0.33,-0.07,-0.79,-0.46,-0.05],
    [-0.00,-0.08,0.02,0.43,0.36,0.48,-0.21,-0.05],
    [-0.00,0.32,0.45,-0.16,-1.09,0.85,0.29,-0.01],
    [0.00,0.55,0.50,-1.01,-2.09,0.05,0.66,-0.00],
    [0.00,0.79,0.66,-1.13,-1.80,-0.06,0.58,0.00],
    [-0.00,0.22,1.22,-0.86,-0.77,0.30,0.30,-0.00],
    [-0.00,-0.25,0.65,0.03,0.37,0.23,-0.20,-0.06],
    [-0.00,-0.04,-0.18,0.49,-0.17,-0.39,-0.25,-0.10]],
    [[0.00,-0.12,-0.15,-0.11,-1.79,1.07,-0.06,-0.07],
    [-0.01,-1.01,-1.83,-0.39,0.93,0.41,-0.51,-0.06],
    [-0.00,0.24,-0.18,2.54,2.02,-0.28,0.00,-0.02],
    [0.00,-0.01,0.46,0.96,0.63,0.51,-0.14,-0.00],
    [0.00,-0.13,0.34,0.17,0.32,-0.17,-0.70,0.00],
    [-0.00,-0.59,-0.78,0.76,0.84,-0.84,-1.11,-0.03],
    [-0.02,-0.35,-0.31,0.75,1.00,0.05,-0.26,0.47],
    [-0.01,-0.13,-0.59,-0.16,0.36,0.88,1.10,1.02]],
    [[0.00,0.07,0.51,0.38,0.18,-0.34,-0.26,-0.01],
    [-0.02,0.59,0.45,0.00,0.65,-0.12,-0.22,-0.01],
    [-0.00,-0.19,-0.35,-0.87,0.36,-0.05,0.18,0.00],
    [0.00,-0.65,-1.95,-1.90,-0.41,0.03,-0.13,0.00],
    [0.00,-0.33,-1.43,-0.50,0.03,-1.23,-0.76,0.00],
    [0.00,0.16,0.26,1.63,-0.92,-1.66,-0.72,0.02],
    [0.03,0.42,0.48,1.65,1.20,1.05,0.72,0.20],
    [0.01,0.18,0.64,0.34,0.28,1.28,1.16,0.42]],
    [[0.00,0.26,0.19,0.39,1.50,0.46,0.18,-0.01],
    [-0.01,0.48,0.25,-0.05,0.27,0.58,0.56,0.01],
    [-0.01,0.05,-2.04,-1.51,0.79,-0.24,-0.34,-0.01],
    [0.00,-0.29,-1.79,-0.35,0.97,-1.80,-0.99,0.00],
    [0.00,-0.35,-0.82,-0.46,0.78,0.14,0.04,0.00],
    [0.00,-0.01,-1.07,-1.55,0.07,1.17,1.17,-0.02],
    [-0.00,0.12,-0.22,-0.69,0.23,0.62,0.89,-0.30],
    [-0.00,0.12,0.69,0.24,0.12,0.20,-0.24,-0.43]],
    [[0.00,-0.04,-0.64,-1.21,-0.51,-1.36,-0.76,0.25],
    [-0.00,-0.12,-0.80,-0.67,-1.15,-1.23,-0.48,0.08],
    [-0.00,-0.23,0.36,0.74,0.21,0.00,0.35,0.15],
    [0.00,0.50,1.05,-0.26,0.09,0.09,1.60,0.03],
    [0.00,1.02,0.92,-0.56,0.83,0.82,0.98,0.00],
    [0.01,1.46,0.27,1.27,1.45,0.30,-0.00,-0.01],
    [0.00,0.53,-0.91,-0.02,0.53,-1.00,-0.78,-0.03],
    [-0.00,-0.06,-0.56,-1.07,-0.48,-0.94,-0.32,-0.04]],
    [[0.00,0.14,1.27,0.04,0.40,1.61,1.07,-0.16],
    [-0.00,0.08,0.92,0.39,-0.11,-0.80,-0.23,-0.12],
    [-0.00,0.26,0.90,-0.13,-1.44,-2.24,-1.39,-0.03],
    [0.00,0.74,1.22,0.29,0.57,-0.33,-0.82,-0.00],
    [0.00,0.04,0.22,-0.49,-0.67,0.35,0.31,0.00],
    [0.00,-0.62,-1.11,-0.74,-0.54,0.47,0.05,-0.01],
    [-0.00,-0.10,-0.49,-0.48,0.22,0.10,-0.61,-0.06],
    [-0.00,0.12,1.41,0.81,-0.01,-0.47,-0.46,-0.22]],
    [[0.00,-0.05,-0.74,-0.16,-0.29,-0.61,-0.16,-0.00],
    [-0.00,-0.49,-0.67,0.25,-1.08,-0.83,-0.13,-0.01],
    [-0.00,-0.54,0.61,0.17,-1.30,-1.63,-0.35,-0.01],
    [0.00,0.10,0.48,0.11,-0.67,-0.69,-0.62,-0.00],
    [0.00,0.45,1.03,0.59,0.19,0.37,0.02,0.00],
    [-0.00,-0.29,1.70,0.57,0.22,0.60,0.72,0.05],
    [-0.00,-0.35,0.76,0.78,-0.61,0.79,0.86,-0.22],
    [-0.00,-0.06,-0.71,-0.35,0.35,1.00,0.03,-0.30]],
    [[0.00,0.08,0.27,0.37,0.40,0.60,0.88,0.32],
    [-0.00,0.22,0.37,0.31,1.28,0.09,0.38,0.32],
    [-0.00,-0.70,-1.28,-0.93,0.00,0.29,0.48,0.02],
    [0.00,-0.76,-0.43,-1.06,-0.07,0.87,0.72,-0.01],
    [0.00,0.14,0.27,0.18,0.73,1.08,0.78,0.00],
    [-0.00,-0.17,-0.00,0.59,0.49,-0.24,-0.08,-0.00],
    [-0.00,-0.20,-0.29,0.24,-1.12,-1.80,-0.37,-0.02],
    [-0.00,0.05,0.33,-0.75,-1.62,-1.34,-0.27,-0.04]],
    [[0.00,-0.19,-0.33,-0.78,-0.07,-0.16,-0.84,-0.06],
    [0.06,-0.06,0.72,-0.35,-1.01,1.11,0.19,-0.04],
    [0.02,0.45,0.58,-0.05,0.02,1.01,0.35,-0.01],
    [0.00,-0.14,-0.34,1.68,-0.10,-0.28,-0.52,-0.00],
    [0.00,-0.69,-0.64,1.61,0.65,-1.05,-1.35,0.00],
    [-0.00,0.11,1.22,0.65,0.45,0.71,-0.34,-0.01],
    [-0.01,0.04,0.85,-1.19,-0.96,0.42,-0.20,-0.11],
    [-0.00,-0.08,-0.97,0.27,0.80,0.08,-0.50,-0.24]],
    [[0.00,-0.14,-0.29,0.75,0.25,-0.47,0.40,-0.20],
    [-0.00,0.40,0.58,0.07,-0.13,0.32,0.64,-0.13],
    [-0.00,0.33,0.96,0.20,0.43,2.29,0.42,-0.09],
    [0.00,-0.04,0.81,1.54,1.08,1.54,0.26,-0.01],
    [0.00,-0.94,-0.56,0.58,-1.07,-0.25,0.10,0.00],
    [0.00,-0.27,-1.71,-2.32,-1.29,-0.81,0.00,-0.00],
    [-0.00,0.14,-0.51,-1.07,-0.85,-0.47,-0.05,0.13],
    [-0.00,-0.10,-0.09,0.17,0.35,-0.30,-0.25,-0.06]]];
  const LOGITS = [-2.05,-2.61,-0.05,3.31,-0.16,-0.41,-5.03,5.63,0.42,0.96];
  const PROBS = [0.0004,0.0002,0.0030,0.0880,0.0027,0.0021,0.0000,0.8903,0.0049,0.0083];
  const SHIFTS = {'-2':{p:0.0953,cls:4,acc:12.6},'-1':{p:0.8792,cls:7,acc:43.7},'0':{p:0.8903,cls:7,acc:97.0},'1':{p:0.7023,cls:7,acc:39.3},'2':{p:0.2611,cls:3,acc:5.7}};

  function conv2d(x,kernel,stride,padding){
    stride=stride||1; padding=padding||0;
    const h=x.length,w=x[0].length,kh=kernel.length,kw=kernel[0].length;
    const hp=h+2*padding,wp=w+2*padding;
    const pad=Array.from({length:hp},(_,i)=>Array.from({length:wp},(_,j)=>{
      const oi=i-padding,oj=j-padding;
      return oi>=0&&oi<h&&oj>=0&&oj<w?x[oi][oj]:0;
    }));
    const oh=Math.floor((hp-kh)/stride)+1, ow=Math.floor((wp-kw)/stride)+1;
    const out=Array.from({length:oh},()=>Array(ow).fill(0));
    for(let i=0;i<oh;i++) for(let j=0;j<ow;j++){
      let sum=0;
      for(let u=0;u<kh;u++) for(let v=0;v<kw;v++) sum+=pad[i*stride+u][j*stride+v]*kernel[u][v];
      out[i][j]=sum;
    }
    return out;
  }
  function relu(m){ return m.map(row=>row.map(v=>Math.max(0,v))); }
  function poolMap(m,f,s,fn){
    const oh=Math.floor((m.length-f)/s)+1, ow=Math.floor((m[0].length-f)/s)+1;
    return Array.from({length:oh},(_,i)=>Array.from({length:ow},(_,j)=>{
      const vals=[];
      for(let u=0;u<f;u++) for(let v=0;v<f;v++) vals.push(m[i*s+u][j*s+v]);
      return fn(vals);
    }));
  }
  const ZV = conv2d(X8,KV,1,0);
  const ZH = conv2d(X8,KH,1,0);
  const AV = relu(ZV);
  const POOLM = poolMap(AV,2,2,a=>Math.max.apply(null,a));
  const POOLA = poolMap(AV,2,2,a=>a.reduce((x,y)=>x+y,0)/a.length);

  function esc(value) {
    return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function foMath(x,y,w,h,tex,size,align) {
    return '<foreignObject x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-'+(size||'md')+' '+(align==='left'?'':'svg-math-center')+'" data-tex="'+esc(tex)+'"></div></foreignObject>';
  }
  function arrow(x1,y1,x2,y2,color,dashed) {
    color = color || MUTED;
    const dash = dashed ? ' stroke-dasharray="5 5"' : '';
    const angle = Math.atan2(y2-y1,x2-x1), len = 9;
    const ax1=x2-len*Math.cos(angle-.45), ay1=y2-len*Math.sin(angle-.45);
    const ax2=x2-len*Math.cos(angle+.45), ay2=y2-len*Math.sin(angle+.45);
    return '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" fill="none" stroke="'+color+'" stroke-width="1.8"'+dash+'/>'+
      '<path d="M'+ax1+' '+ay1+' L'+x2+' '+y2+' L'+ax2+' '+ay2+'" fill="none" stroke="'+color+'" stroke-width="1.8"/>';
  }
  function matrix(data,x,y,cell,opt) {
    opt = opt || {};
    let s = '';
    const rows=data.length, cols=data[0].length;
    if (opt.title) s += '<text x="'+(x+cols*cell/2)+'" y="'+(y-18)+'" text-anchor="middle" class="viz-label">'+esc(opt.title)+'</text>';
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
      const value=data[r][c];
      let fill = opt.baseFill || '#FFFFFF';
      if (opt.fillFn) fill = opt.fillFn(value,r,c);
      const inHi = opt.highlight && r>=opt.highlight.r && r<opt.highlight.r+opt.highlight.h && c>=opt.highlight.c && c<opt.highlight.c+opt.highlight.w;
      if (inHi) fill = opt.highlight.fill || '#FFF4A8';
      const stroke = inHi ? (opt.highlight.stroke || YELLOW) : (opt.stroke || GRID);
      const sw = inHi ? 2 : 1;
      s += '<rect x="'+(x+c*cell)+'" y="'+(y+r*cell)+'" width="'+cell+'" height="'+cell+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
      if (opt.showNumbers !== false) {
        const tc = opt.textColorFn ? opt.textColorFn(value,r,c) : (value===1 && fill===BLUE ? '#fff' : INK);
        s += '<text x="'+(x+c*cell+cell/2)+'" y="'+(y+r*cell+cell*.66)+'" text-anchor="middle" font-size="'+Math.max(12,cell*.38)+'" fill="'+tc+'">'+esc(opt.format?opt.format(value,r,c):value)+'</text>';
      }
    }
    if (opt.outline) s += '<rect x="'+x+'" y="'+y+'" width="'+(cols*cell)+'" height="'+(rows*cell)+'" fill="none" stroke="'+opt.outline+'" stroke-width="2.2"/>';
    return s;
  }
  function stackPlanes(count,x,y,w,h,colors,title,active) {
    let s = title ? '<text x="'+(x+w/2+count*9)+'" y="'+(y-26)+'" text-anchor="middle" class="viz-label">'+esc(title)+'</text>' : '';
    for (let c=count-1;c>=0;c--) {
      const dx=c*14, dy=-c*10;
      const opacity = active == null || active===c ? 1 : .28;
      s += '<rect x="'+(x+dx)+'" y="'+(y+dy)+'" width="'+w+'" height="'+h+'" rx="5" fill="'+colors[c%colors.length]+'" fill-opacity="'+(.17*opacity)+'" stroke="'+colors[c%colors.length]+'" stroke-opacity="'+opacity+'" stroke-width="2"/>';
      for (let i=1;i<4;i++) {
        s += '<line x1="'+(x+dx+i*w/4)+'" y1="'+(y+dy)+'" x2="'+(x+dx+i*w/4)+'" y2="'+(y+dy+h)+'" stroke="'+colors[c%colors.length]+'" stroke-opacity="'+(.45*opacity)+'"/>';
        s += '<line x1="'+(x+dx)+'" y1="'+(y+dy+i*h/4)+'" x2="'+(x+dx+w)+'" y2="'+(y+dy+i*h/4)+'" stroke="'+colors[c%colors.length]+'" stroke-opacity="'+(.45*opacity)+'"/>';
      }
    }
    return s;
  }
  function renderMath(root) {
    (root || document).querySelectorAll('[data-tex]').forEach(function (node) {
      if (node.dataset.rendered === '1') return;
      try {
        katex.render(node.getAttribute('data-tex'), node, {
          throwOnError:false,
          displayMode:node.classList.contains('math-display'),
          strict:'ignore'
        });
        node.dataset.rendered='1';
      } catch (e) { node.textContent=node.getAttribute('data-tex'); }
    });
  }
  function canvas(stage) { return stage.querySelector('[data-canvas]'); }

  function shade(v){
    if(!v) return '#FFFFFF';
    const t=v/16;
    return 'rgb('+Math.round(255-190*t)+','+Math.round(255-175*t)+','+Math.round(255-140*t)+')';
  }
  function mix(a,b,t){ return 'rgb('+Math.round(a[0]+(b[0]-a[0])*t)+','+Math.round(a[1]+(b[1]-a[1])*t)+','+Math.round(a[2]+(b[2]-a[2])*t)+')'; }
  function wFill(v,scale){
    const t=Math.min(1,Math.abs(v)/(scale||2));
    if(v>0.02) return mix([255,255,255],[95,160,40],t);
    if(v<-0.02) return mix([255,255,255],[200,45,45],t);
    return '#FFFFFF';
  }
  function digitInk(v){ return (typeof v==='number'&&v>=11)?'#FFFFFF':INK; }
  function signFill(v){ return v>0.02?'#EEF7E6':(v<-0.02?'#FDEEEE':'#FFFFFF'); }
  function signStroke(v){ return v>0.02?'#8FBF60':(v<-0.02?'#DE9A99':'#D9D5CC'); }
  function num(v,dec){ return (Math.round(v*Math.pow(10,dec))/Math.pow(10,dec)).toFixed(dec).replace('.',','); }

  function renderPixels(stage,step){
    const g=canvas(stage);
    let s='<text x="36" y="42" class="viz-title">От рукописной цифры к тензору</text>';
    if(step===0){
      s+=matrix(SMOOTH,80,100,9,{fillFn:shade,showNumbers:false,stroke:'none'});
      s+='<rect x="80" y="100" width="288" height="288" fill="none" stroke="'+BLUE+'" stroke-width="2"/>';
      s+='<text x="224" y="424" text-anchor="middle" class="viz-label">так её видит человек</text>';
      s+='<text x="224" y="452" text-anchor="middle" class="viz-small">та же картинка с интерполяцией</text>';
      s+=arrow(400,244,470,244,BLUE,false);
      s+=matrix(X8,500,100,36,{fillFn:shade,showNumbers:false,stroke:'#D7D3CB',outline:BLUE});
      s+='<text x="644" y="424" text-anchor="middle" class="viz-label">так её получает модель</text>';
      s+='<text x="644" y="452" text-anchor="middle" class="viz-small">решётка 8×8, яркости от 0 до 16</text>';
      s+=foMath(700,120,240,60,'X\\in\\mathbb{R}^{8\\times8}','lg');
      s+='<text x="820" y="220" text-anchor="middle" class="viz-small">ни контура, ни объекта —</text>';
      s+='<text x="820" y="246" text-anchor="middle" class="viz-small">только 64 измерения</text>';
    } else if(step===1){
      s+=matrix(X8,180,120,42,{fillFn:shade,showNumbers:false,stroke:'#D7D3CB',highlight:{r:0,c:4,h:1,w:1,fill:'#FFF1A8',stroke:YELLOW}});
      for(let c=0;c<8;c++) s+='<text x="'+(201+c*42)+'" y="108" text-anchor="middle" class="viz-small">'+c+'</text>';
      for(let r=0;r<8;r++) s+='<text x="164" y="'+(148+r*42)+'" text-anchor="middle" class="viz-small">'+r+'</text>';
      s+='<rect x="516" y="288" width="42" height="42" fill="#FFF1A8" stroke="'+YELLOW+'" stroke-width="2"/>';
      s+='<text x="537" y="315" text-anchor="middle" font-size="15" fill="'+INK+'">10</text>';
      s+=arrow(516,141,620,141,YELLOW,true);
      s+='<text x="700" y="130" class="viz-label">строка 0, столбец 4</text><text x="700" y="158" class="viz-small">самый яркий пиксель верхнего штриха</text>';
      s+=arrow(560,309,620,309,YELLOW,true);
      s+='<text x="700" y="300" class="viz-label">строка 4, столбец 6</text><text x="700" y="328" class="viz-small">правый край нижней части</text>';
      s+=foMath(560,390,360,58,'X_{ij}=\\text{яркость в координате }(i,j)','md');
    } else if(step===2){
      s+=matrix(X8,150,110,44,{fillFn:shade,stroke:'#D7D3CB',textColorFn:digitInk,title:'матрица X · 8×8'});
      s+='<rect x="580" y="150" width="330" height="200" rx="12" fill="#F8FBFE" stroke="#D9E4F0" stroke-width="2"/>';
      s+='<text x="745" y="196" text-anchor="middle" class="viz-small">сумма всех яркостей</text><text x="745" y="234" text-anchor="middle" class="viz-title viz-blue">277</text>';
      s+='<text x="745" y="276" text-anchor="middle" class="viz-small">ненулевых пикселей</text><text x="745" y="314" text-anchor="middle" class="viz-title viz-blue">31 из 64</text>';
      s+=foMath(580,372,330,58,'X_{ij}\\in\\{0,\\ldots,16\\}','lg');
    } else if(step===3){
      s+=matrix(X8,40,110,38,{fillFn:shade,stroke:'#D7D3CB',textColorFn:digitInk,title:'яркости 0…16'});
      s+=arrow(360,230,510,230,BLUE,false);
      s+=foMath(345,150,180,52,'\\div\\,16','lg');
      const norm=X8.map(r=>r.map(v=>v?num(v/16,2):'0'));
      s+=matrix(norm,560,110,38,{fillFn:(v,r,c)=>shade(X8[r][c]),textColorFn:(v,r,c)=>X8[r][c]>=11?'#FFFFFF':INK,stroke:'#B8CBB0',title:'после деления на 16'});
      s+=foMath(280,438,400,58,'X\'_{ij}=X_{ij}/16\\in[0,1]','lg');
    } else {
      const boxes=[{t:'N',v:'1',d:'объектов в батче',c:BLUE},{t:'C',v:'1',d:'каналов',c:YELLOW},{t:'H',v:'8',d:'строк',c:GREEN},{t:'W',v:'8',d:'столбцов',c:GREEN}];
      boxes.forEach((b,i)=>{
        const x=90+i*205;
        s+='<rect x="'+x+'" y="150" width="170" height="170" rx="12" fill="#FBFAF7" stroke="'+b.c+'" stroke-width="2"/>';
        s+='<text x="'+(x+85)+'" y="200" text-anchor="middle" class="viz-title" fill="'+b.c+'">'+b.t+'</text>';
        s+='<text x="'+(x+85)+'" y="250" text-anchor="middle" class="viz-title">'+b.v+'</text>';
        s+='<text x="'+(x+85)+'" y="292" text-anchor="middle" class="viz-small">'+b.d+'</text>';
      });
      s+=foMath(150,360,660,60,'[N,C,H,W]=[1,1,8,8]','lg');
      s+='<text x="480" y="470" text-anchor="middle" class="viz-small">у цветной картинки 32×32 та же схема даёт [1, 3, 32, 32]</text>';
    }
    g.innerHTML=s; renderMath(stage);
  }

  function renderClassifier(stage,step){
    const g=canvas(stage);
    const xs=[],ws=[],pr=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){ xs.push(X8[r][c]/16); ws.push(WBIN[r][c]); pr.push(X8[r][c]/16*WBIN[r][c]); }
    let s='<text x="36" y="42" class="viz-title">Логистический нейрон: 64 веса на 64 пикселя</text>';
    // левая колонка: цифра сверху, тепловая карта весов под ней — без наложений
    s+=matrix(X8,40,100,28,{fillFn:shade,showNumbers:false,stroke:'#D7D3CB',title:'X · 8×8'});
    s+=arrow(272,158,320,158,BLUE,false);
    if(step>=1){
      s+=matrix(WBIN,40,400,28,{fillFn:(v)=>wFill(v,2.2),stroke:'#E2DED6',showNumbers:false,title:'те же w как 8×8'});
      s+='<text x="152" y="650" text-anchor="middle" class="viz-small">зелёный: за семёрку · красный: против</text>';
    }
    // три полосы справа: x, w, x⊙w
    const stripX=340, stripW=8, stripGap=1;
    const strip=(vals,y,label,mode)=>{
      let t='<text x="'+stripX+'" y="'+(y-10)+'" class="viz-small">'+label+'</text>';
      vals.forEach((v,i)=>{
        const x=stripX+i*(stripW+stripGap);
        let fill='#FFFFFF',stroke='#D7D3CB';
        if(mode==='x'){ fill=v?shade(v*16):'#fff'; stroke='#C6D5E4'; }
        else { fill=wFill(v,mode==='w'?2.2:1.2); stroke=signStroke(v); }
        t+='<rect x="'+x+'" y="'+y+'" width="'+stripW+'" height="28" fill="'+fill+'" stroke="'+stroke+'"/>';
      });
      return t;
    };
    s+='<g opacity="1">'+strip(xs,110,'x = flatten(X\') · 64 числа','x')+'</g>';
    s+='<g opacity="'+(step>=1?1:0.18)+'">'+strip(ws,200,'w · 64 обученных веса','w')+'</g>';
    s+='<g opacity="'+(step>=2?1:0.18)+'">'+strip(pr,290,'x ⊙ w · 64 вклада','w')+'</g>';
    // формула суммы — своя строка под полосами
    s+=foMath(stripX,335,600,48,step<2?'z=\\mathbf x^\\top\\mathbf w+b':(step<3?'x_i w_i':'z=\\sum_{i=1}^{64}x_iw_i+b'),'md');
    // блок логита — справа, на уровне формулы суммы
    if(step>=3){
      s+='<text x="'+stripX+'" y="410" class="viz-small">+9,05 положительных · −3,56 отрицательных · b = −3,08</text>';
      s+=foMath(stripX,430,300,50,'z=\\textstyle\\sum x_iw_i+b','md');
      s+=arrow(640,455,700,455,GREEN,false);
      s+='<rect x="712" y="420" width="200" height="72" rx="12" fill="#F0FAF0" stroke="'+GREEN+'" stroke-width="2"/>';
      s+='<text x="812" y="448" text-anchor="middle" class="viz-small">логит</text><text x="812" y="480" text-anchor="middle" class="viz-title viz-green">z = 2,42</text>';
    }
    // сигмоида — собственная зона внизу справа, ничего не пересекает
    if(step>=4){
      const sx0=340, sx1=640, sy0=640, sy1=520, mid=(sx0+sx1)/2, ymid=(sy0+sy1)/2;
      s+='<line x1="'+sx0+'" y1="'+ymid+'" x2="'+sx1+'" y2="'+ymid+'" stroke="#D7D3CB" stroke-dasharray="4 4"/>';
      s+='<path d="M'+sx0+' '+(sy0-6)+' C'+(sx0+90)+' '+(sy0-6)+' '+(mid-20)+' '+(sy0-2)+' '+mid+' '+ymid+' C'+(mid+20)+' '+(sy1+2)+' '+(sx1-90)+' '+(sy1+4)+' '+sx1+' '+(sy1+4)+'" fill="none" stroke="'+GREEN+'" stroke-width="3"/>';
      s+='<circle cx="'+(mid+58)+'" cy="'+(ymid-38)+'" r="7" fill="'+GREEN+'"/>';
      s+='<text x="'+sx0+'" y="510" class="viz-small">σ(z) = 1/(1+e⁻ᶻ)</text>';
      s+=foMath(sx0,650,300,44,'\\hat p_7=\\sigma(2{,}42)=0{,}918','md');
    }
    if(step>=5){
      s+='<rect x="712" y="560" width="200" height="72" rx="12" fill="#F0FAF0" stroke="'+GREEN+'" stroke-width="2"/>';
      s+='<text x="812" y="592" text-anchor="middle" class="viz-small">порог 0,5</text><text x="812" y="620" text-anchor="middle" class="viz-label viz-green">класс: 7</text>';
    }
    g.innerHTML=s; renderMath(stage);
  }

  function renderTraining(stage,step){
    const g=canvas(stage);
    let s='<text x="36" y="42" class="viz-title">Десять классов, softmax и обученные шаблоны</text>';
    if(step===0){
      s+=matrix(X8,45,140,26,{fillFn:shade,showNumbers:false,stroke:'#D7D3CB',title:'вход x'});
      s+=arrow(268,215,330,215,BLUE,false);
      for(let k=0;k<10;k++){
        const x=350+k*58;
        s+='<rect x="'+x+'" y="120" width="40" height="230" rx="4" fill="#FFF8D9" stroke="'+YELLOW+'"/>';
        s+='<text x="'+(x+20)+'" y="374" text-anchor="middle" class="viz-small">w'+k+'</text>';
      }
      s+='<text x="640" y="100" text-anchor="middle" class="viz-label">десять столбцов по 64 веса</text>';
      s+=foMath(300,410,400,60,'W\\in\\mathbb{R}^{64\\times10}','lg');
      s+=foMath(700,410,240,60,'64\\cdot10+10=650','md');
    } else if(step===1||step===2||step===4){
      const vals=step===1?LOGITS:(step===2?PROBS:PROBS.map((p,k)=>p-(k===7?1:0)));
      const maxAbs=Math.max.apply(null,vals.map(Math.abs));
      const base=step===1?300:(step===4?300:420);
      s+='<line x1="90" y1="'+base+'" x2="900" y2="'+base+'" stroke="#BDB8AE"/>';
      vals.forEach((v,k)=>{
        const h=Math.abs(v)/maxAbs*(step===2?300:150), x=120+k*76;
        const y=v>=0?base-h:base, c=k===7?GREEN:(v<0?RED:BLUE);
        s+='<rect x="'+x+'" y="'+y+'" width="46" height="'+h+'" rx="4" fill="'+c+'" fill-opacity=".78"/>';
        s+='<text x="'+(x+23)+'" y="'+(base+26)+'" text-anchor="middle" class="viz-label">'+k+'</text>';
        s+='<text x="'+(x+23)+'" y="'+(v>=0?y-8:base+h+20)+'" text-anchor="middle" class="viz-small">'+(step===1?num(v,2):num(v,step===4?3:3))+'</text>';
      });
      s+='<text x="480" y="86" text-anchor="middle" class="viz-label">'+(step===1?'логиты z₀…z₉ — любые числа':(step===2?'после softmax: сумма равна 1':'градиент по логитам: p − y'))+'</text>';
      s+=foMath(230,'450','500',60,step===1?'\\mathbf z=W^\\top\\mathbf x+\\mathbf b':(step===2?'\\hat p_k=\\dfrac{e^{z_k}}{\\sum_j e^{z_j}}':'\\dfrac{\\partial L}{\\partial z_k}=\\hat p_k-y_k'),'lg');
    } else if(step===3){
      s+='<line x1="90" y1="420" x2="900" y2="420" stroke="#BDB8AE"/>';
      PROBS.forEach((v,k)=>{
        const h=v*300,x=120+k*76,c=k===7?GREEN:BLUE;
        s+='<rect x="'+x+'" y="'+(420-h)+'" width="46" height="'+h+'" rx="4" fill="'+c+'" fill-opacity="'+(k===7?'.85':'.35')+'"/>';
        s+='<text x="'+(x+23)+'" y="446" text-anchor="middle" class="viz-label">'+k+'</text>';
      });
      s+='<rect x="560" y="110" width="330" height="120" rx="12" fill="#FFF4F4" stroke="'+RED+'" stroke-width="2"/>';
      s+='<text x="725" y="150" text-anchor="middle" class="viz-small">истинный класс y = 7</text>';
      s+='<text x="725" y="196" text-anchor="middle" class="viz-title viz-red">L = 0,1162</text>';
      s+=arrow(600,250,470,395,RED,true);
      s+=foMath(120,470,500,60,'L=-\\log\\hat p_y=-\\log 0{,}8903','lg');
    } else {
      for(let k=0;k<10;k++){
        const col=k%5,row=Math.floor(k/5),x=52+col*186,y=110+row*220,c=k===7?GREEN:BLUE;
        s+=matrix(TPL[k],x,y,17,{fillFn:(v)=>wFill(v,1.8),showNumbers:false,stroke:'#E8E5DE',outline:c});
        s+='<text x="'+(x+68)+'" y="'+(y+166)+'" text-anchor="middle" class="viz-small">'+(k===7?'w⁽⁷⁾ — семёрка':'w⁽'+k+'⁾')+'</text>';
      }
      s+='<text x="480" y="86" text-anchor="middle" class="viz-label">обученные веса, свёрнутые обратно в 8×8</text>';
    }
    g.innerHTML=s; renderMath(stage);
  }

  function shiftedImage(dx){
    return X8.map(row=>row.map((_,c)=>{ const src=c-dx; return src>=0&&src<8?row[src]:0; }));
  }
  function renderShift(){
    const dx=Number(document.getElementById('shift-range').value);
    const info=SHIFTS[String(dx)], input=shiftedImage(dx);
    const g=document.querySelector('#sh-viz [data-canvas]');
    let s='<text x="36" y="42" class="viz-title">Полносвязные веса привязаны к координатам</text>';
    s+=matrix(input,60,110,38,{fillFn:shade,showNumbers:false,stroke:'#D7D3CB',title:'вход: цифра сдвинута на '+(dx>0?'+':'')+dx});
    s+=foMath(378,150,120,52,'\\odot','lg');
    s+=matrix(TPL[7],510,110,38,{fillFn:(v)=>wFill(v,1.8),showNumbers:false,stroke:'#E8E5DE',title:'обученный шаблон w⁽⁷⁾ — не двигается'});
    const ok=info.cls===7;
    s+='<rect x="60" y="440" width="404" height="76" rx="12" fill="'+(ok?'#F0FAF0':'#FFF4F4')+'" stroke="'+(ok?GREEN:RED)+'" stroke-width="2"/>';
    s+='<text x="262" y="470" text-anchor="middle" class="viz-small">вероятность семёрки у этой цифры</text>';
    s+='<text x="262" y="502" text-anchor="middle" class="viz-title '+(ok?'viz-green':'viz-red')+'">'+num(info.p,3)+'</text>';
    s+='<rect x="510" y="440" width="390" height="76" rx="12" fill="'+(info.acc>90?'#F0FAF0':'#FFF4F4')+'" stroke="'+(info.acc>90?GREEN:RED)+'" stroke-width="2"/>';
    s+='<text x="705" y="470" text-anchor="middle" class="viz-small">точность на 540 отложенных объектах</text>';
    s+='<text x="705" y="502" text-anchor="middle" class="viz-title '+(info.acc>90?'viz-green':'viz-red')+'">'+num(info.acc,1)+' %</text>';
    s+=foMath(300,378,360,54,'z=\\sum_{i,j}X\'_{i,\\,j-'+dx+'}W_{ij}+b','md');
    g.innerHTML=s;
    document.getElementById('shift-value').textContent=dx===0?'0':(dx>0?'+'+dx:String(dx));
    document.getElementById('shift-readout').innerHTML='<strong>Сдвиг '+(dx>0?'+':'')+dx+': вероятность семёрки '+num(info.p,3)+', предсказан класс '+info.cls+'.</strong> '+(dx===0?'Шаблон и цифра стоят в одних координатах — модель уверена, и на всей выборке точность 97,0%.':'Пиксели не изменились, изменились только их адреса. Каждое число встретилось с чужим весом, и точность по всей выборке упала до '+num(info.acc,1)+'%.');
    document.querySelectorAll('[data-shift]').forEach(b=>b.classList.toggle('active',Number(b.dataset.shift)===dx));
    renderMath(document.getElementById('shift-lab'));
  }
  function renderConv(stage,step){
    const g=canvas(stage);
    let s='<text x="36" y="42" class="viz-title">Одна клетка свёртки: девять умножений и сумма</text>';
    // окно на шагах 5-6 берём под нужную клетку карты
    const cellRC = step>=5 ? {r:0,c:5} : {r:0,c:0};
    const rr0=cellRC.r, cc0=cellRC.c;
    const win=[0,1,2].map(u=>[0,1,2].map(v=>X8[rr0+u][cc0+v]));
    const prods=[0,1,2].map(u=>[0,1,2].map(v=>win[u][v]*KV[u][v]));
    // ЛЕВО: вход 8×8 с подсвеченным окном
    const hi=step>=1?{r:rr0,c:cc0,h:3,w:3,fill:'#FFF7C9',stroke:YELLOW}:null;
    s+=matrix(X8,40,95,30,{fillFn:shade,stroke:'#D7D3CB',showNumbers:false,highlight:hi,title:'вход X · 8×8'});
    if(step>=1) s+='<text x="160" y="365" text-anchor="middle" class="viz-small">окно 3×3 в позиции ('+rr0+', '+cc0+')</text>';

    if(step===0){
      // шаг 0: показываем только ядро крупно
      s+=matrix(KV,470,150,72,{fillFn:v=>v>0?'#F0FAF0':(v<0?'#FFF4F4':'#F6F5F1'),textColorFn:()=>INK,stroke:'#C9C2B8',title:'ядро K · 3×3'});
      s+='<text x="578" y="400" text-anchor="middle" class="viz-small">левый столбец +1, правый −1, середина 0</text>';
      s+=foMath(300,470,360,58,'K\\in\\mathbb{R}^{3\\times3},\\quad b\\in\\mathbb{R}','lg');
      g.innerHTML=s; renderMath(stage); return;
    }

    // стрелка вынимания окна
    s+=arrow(310,240,360,240,YELLOW,false);
    // вынутое окно P (крупно, с числами) — верхний ряд
    s+=matrix(win,380,110,58,{fillFn:v=>shade(v),textColorFn:()=>INK,stroke:'#C9C2B8',title:'окно P · пиксели'});
    // ⊙
    s+=foMath(560,150,60,58,'\\odot','lg');
    // ядро K (крупно) — рядом
    s+=matrix(KV,624,110,58,{fillFn:v=>v>0?'#F0FAF0':(v<0?'#FFF4F4':'#F6F5F1'),textColorFn:()=>INK,stroke:'#C9C2B8',title:'веса K'});

    if(step===1){
      s+='<text x="480" y="330" text-anchor="middle" class="viz-small">клетка выхода ('+rr0+', '+cc0+') связана ровно с этими девятью пикселями</text>';
      s+=foMath(240,470,480,58,'P=X_{'+rr0+':'+(rr0+3)+',\\,'+cc0+':'+(cc0+3)+'}','lg');
      g.innerHTML=s; renderMath(stage); return;
    }

    // шаги 2–4: показываем девять попарных произведений отдельной таблицей
    if(step<5){
    s+='<text x="480" y="330" text-anchor="middle" class="viz-small">каждый пиксель умножается на вес в той же клетке</text>';
    // таблица произведений: тройка «пиксель × вес = результат»
    // ширина тройки: pcell + ×(16) + pcell + =(16) + pcell = 3*pcell+32; шаг колонки — с запасом
    const pcell=44, opGap=18, tripW=3*pcell+2*opGap, colGap=26, rowGap=12;
    const tableW=3*tripW+2*colGap, px=(960-tableW)/2, py=362;
    for(let u=0;u<3;u++) for(let v=0;v<3;v++){
      const x=px+v*(tripW+colGap), y=py+u*(pcell+rowGap);
      const pv=win[u][v], kv=KV[u][v], res=prods[u][v];
      const xPix=x, xMul=x+pcell+opGap/2, xKer=x+pcell+opGap, xEq=x+2*pcell+opGap+opGap/2, xRes=x+2*pcell+2*opGap;
      // пиксель
      s+='<rect x="'+xPix+'" y="'+y+'" width="'+pcell+'" height="'+pcell+'" fill="'+shade(pv)+'" stroke="#C9C2B8"/>';
      s+='<text x="'+(xPix+pcell/2)+'" y="'+(y+pcell*.66)+'" text-anchor="middle" font-size="16" fill="'+INK+'">'+pv+'</text>';
      s+='<text x="'+xMul+'" y="'+(y+pcell*.66)+'" text-anchor="middle" font-size="15" fill="'+MUTED+'">×</text>';
      // вес
      const kfill=kv>0?'#F0FAF0':(kv<0?'#FFF4F4':'#F6F5F1');
      s+='<rect x="'+xKer+'" y="'+y+'" width="'+pcell+'" height="'+pcell+'" fill="'+kfill+'" stroke="#C9C2B8"/>';
      s+='<text x="'+(xKer+pcell/2)+'" y="'+(y+pcell*.66)+'" text-anchor="middle" font-size="16" fill="'+INK+'">'+kv+'</text>';
      s+='<text x="'+xEq+'" y="'+(y+pcell*.66)+'" text-anchor="middle" font-size="15" fill="'+MUTED+'">=</text>';
      // результат
      const rfill=res>0?'#DFF2D1':(res<0?'#FDE3E3':'#F6F5F1');
      s+='<rect x="'+xRes+'" y="'+y+'" width="'+pcell+'" height="'+pcell+'" fill="'+rfill+'" stroke="#B8CBB0" stroke-width="1.6"/>';
      s+='<text x="'+(xRes+pcell/2)+'" y="'+(y+pcell*.66)+'" text-anchor="middle" font-size="16" font-weight="700" fill="'+INK+'">'+res+'</text>';
    }
    }

    if(step===2){
      s+='<text x="480" y="350" text-anchor="middle" class="viz-small" fill="'+MUTED+'">пиксель × вес = вклад · девять независимых умножений</text>';
      g.innerHTML=s; renderMath(stage); return;
    }

    // шаг 3: сумма девяти результатов
    if(step===3){
      const left=win[0][0]+win[1][0]+win[2][0], right=win[0][2]+win[1][2]+win[2][2];
      s+=foMath(90,545,780,62,'Z_{'+rr0+cc0+'}=\\underbrace{('+win[0][0]+'+'+win[1][0]+'+'+win[2][0]+')}_{\\text{левый столбец}}-\\underbrace{('+win[0][2]+'+'+win[1][2]+'+'+win[2][2]+')}_{\\text{правый столбец}}='+(left-right),'lg');
      s+='<text x="480" y="628" text-anchor="middle" class="viz-small">минус означает: в этом окне ярче справа — фильтр нашёл левый край штриха</text>';
      g.innerHTML=s; renderMath(stage); return;
    }
    // шаг 4: bias и ReLU
    if(step===4){
      s+=foMath(200,545,560,62,'A_{'+rr0+cc0+'}=\\operatorname{ReLU}(Z_{'+rr0+cc0+'}+b)=\\max(0,-25)=0','lg');
      s+='<text x="480" y="628" text-anchor="middle" class="viz-small">после линейной свёртки идёт активация: ReLU обнуляет отрицательные отклики</text>';
      g.innerHTML=s; renderMath(stage); return;
    }
    // шаг 5-6: новая позиция, положительный отклик, запись в карту
    const left=win[0][0]+win[1][0]+win[2][0], right=win[0][2]+win[1][2]+win[2][2];
    // карта 6×6 — по центру под окном и ядром
    const out=Array.from({length:6},()=>Array(6).fill('·'));
    out[0][5]=47;
    const mapCell=34, mapX=(960-6*mapCell)/2, mapY=350;
    s+='<text x="'+(mapX+6*mapCell/2)+'" y="'+(mapY-14)+'" text-anchor="middle" class="viz-label">карта признаков · 6×6</text>';
    s+=matrix(out,mapX,mapY,mapCell,{fillFn:(v,r,c)=>(r===0&&c===5)?'#DFF2D1':'#fff',stroke:'#B8CBB0'});
    // стрелка от ядра K (сверху) к подсвеченной клетке (0,5) карты
    s+=arrow(700,290,mapX+5*mapCell+mapCell/2,mapY-6,GREEN,false);
    s+=foMath(120,568,720,52,'Z_{'+rr0+cc0+'}=('+win[0][0]+'+'+win[1][0]+'+'+win[2][0]+')-('+win[0][2]+'+'+win[1][2]+'+'+win[2][2]+')='+(left-right),'md');
    s+='<text x="480" y="634" text-anchor="middle" class="viz-small">тот же фильтр сдвинулся к правому краю штриха — ярче слева, отклик +47 ложится в клетку (0, 5) карты</text>';
    g.innerHTML=s; renderMath(stage);
  }

  let scanAll=false;
  function renderScan(){
    const idx=Number(document.getElementById('scan-range').value), r=Math.floor(idx/6), c=idx%6;
    const g=document.querySelector('#sc-viz [data-canvas]');
    let s='<text x="36" y="42" class="viz-title">Один фильтр · тридцать шесть позиций</text>';
    s+=matrix(X8,50,105,40,{fillFn:shade,stroke:'#D7D3CB',textColorFn:(v,rr,cc)=>(rr>=r&&rr<r+3&&cc>=c&&cc<c+3)?INK:digitInk(v),highlight:{r:r,c:c,h:3,w:3,fill:'#FFF7C9',stroke:YELLOW},title:'X · 8×8'});
    s+=matrix(KV,410,160,46,{fillFn:v=>v>0?'#F0FAF0':(v<0?'#FFF4F4':'#F6F5F1'),stroke:'#C9C2B8',title:'общие веса K'});
    s+=arrow(378,235,402,235,YELLOW,true)+arrow(560,235,628,235,GREEN,false);
    const shown=ZV.map((row,rr)=>row.map((v,cc)=>(scanAll||rr*6+cc<=idx)?v:'·'));
    s+=matrix(shown,640,120,42,{fillFn:(v,rr,cc)=>rr===r&&cc===c?'#DFF2D1':(v==='·'?'#fff':(v>0?'#F3FAF0':(v<0?'#FDF2F2':'#F6F5F1'))),stroke:'#B8CBB0',title:'Z · 6×6'});
    const win=[0,1,2].map(u=>[0,1,2].map(v=>X8[r+u][c+v]));
    const left=win[0][0]+win[1][0]+win[2][0], right=win[0][2]+win[1][2]+win[2][2];
    s+=foMath(120,400,720,62,'Z_{'+r+','+c+'}=\\sum_{u=0}^{2}\\sum_{v=0}^{2}X_{'+r+'+u,\\,'+c+'+v}K_{uv}=('+left+')-('+right+')='+ZV[r][c],'lg');
    g.innerHTML=s;
    document.getElementById('scan-value').textContent=(idx+1)+' / 36';
    const sign=ZV[r][c]>0?'правый край штриха':(ZV[r][c]<0?'левый край штриха':'перепада нет');
    // подробная раскладка девяти произведений
    const KVflat=[[1,0,-1],[1,0,-1],[1,0,-1]];
    const terms=[];
    for(let u=0;u<3;u++) for(let v=0;v<3;v++){ if(KVflat[u][v]!==0){ const pv=win[u][v], kv=KVflat[u][v]; terms.push(pv+'·'+(kv>0?'(+1)':'(−1)')+' = '+(pv*kv>=0?'+':'')+(pv*kv)); } }
    document.getElementById('scan-readout').innerHTML='<strong>Позиция ('+r+', '+c+'): Z = '+ZV[r][c]+' — '+sign+'.</strong> '+
      'Окно накрывает пиксели входа со строк '+r+'–'+(r+2)+' и столбцов '+c+'–'+(c+2)+'. '+
      'Средний столбец ядра равен нулю, поэтому в сумму входят только левый и правый столбцы окна: '+
      'левый столбец ('+win[0][0]+', '+win[1][0]+', '+win[2][0]+') умножается на +1, правый ('+win[0][2]+', '+win[1][2]+', '+win[2][2]+') — на −1. '+
      'Итого '+left+' − '+right+' = '+ZV[r][c]+'. Девять весов те же самые, что и во всех остальных 35 позициях.';
    document.getElementById('scan-fill').textContent=scanAll?'Показывать по шагам':'Заполнить всю карту';
    renderMath(document.getElementById('scan-lab'));
  }

  function renderChannels(stage,step){
    const g=canvas(stage);
    let s='<text x="36" y="42" class="viz-title">Фильтры, каналы и параметры слоя</text>';
    if(step===0){
      // две согласованные строки: верхняя (вертикальный фильтр), нижняя (горизонтальный)
      const rowTopY=110, rowBotY=330, kCell=38, mCell=30;
      // общий вход слева, по центру между двумя строками
      s+=matrix(X8,40,215,26,{fillFn:shade,showNumbers:false,stroke:'#D7D3CB',title:'один вход X · 8×8'});
      const inMidY=215+8*26/2; // центр входа
      // верхняя строка
      const kTopY=rowTopY, k1x=330;
      s+=matrix(KV,k1x,kTopY,kCell,{fillFn:v=>v>0?'#F0FAF0':(v<0?'#FFF4F4':'#F6F5F1'),textColorFn:()=>INK,stroke:'#C9C2B8',title:'K⁽¹⁾ вертикальный'});
      const kTopMid=kTopY+3*kCell/2;
      s+=matrix(ZV,560,kTopY-24,mCell,{fillFn:v=>v>0?'#F3FAF0':(v<0?'#FDF2F2':'#F6F5F1'),stroke:'#B8CBB0',title:'Z⁽¹⁾ · 6×6'});
      const zTopMid=(kTopY-24)+6*mCell/2;
      // нижняя строка
      const kBotY=rowBotY, k2x=330;
      s+=matrix(KH,k2x,kBotY,kCell,{fillFn:v=>v>0?'#F0FAF0':(v<0?'#FFF4F4':'#F6F5F1'),textColorFn:()=>INK,stroke:'#C9C2B8',title:'K⁽²⁾ горизонтальный'});
      const kBotMid=kBotY+3*kCell/2;
      s+=matrix(ZH,560,kBotY-24,mCell,{fillFn:v=>v>0?'#F3FAF0':(v<0?'#FDF2F2':'#F6F5F1'),stroke:'#B8CBB0',title:'Z⁽²⁾ · 6×6'});
      const zBotMid=(kBotY-24)+6*mCell/2;
      // стрелки: вход → каждое ядро, ядро → своя карта, на согласованных высотах
      s+=arrow(300,kTopMid,k1x-8,kTopMid,YELLOW,false)+arrow(300,kBotMid,k2x-8,kBotMid,YELLOW,false);
      s+=arrow(k1x+3*kCell+8,kTopMid,552,zTopMid,GREEN,false)+arrow(k2x+3*kCell+8,kBotMid,552,zBotMid,GREEN,false);
      s+='<text x="820" y="'+(zTopMid-10)+'" class="viz-small">максимум +47</text><text x="820" y="'+(zTopMid+14)+'" class="viz-small">на правых краях</text>';
      s+='<text x="820" y="'+(zBotMid-10)+'" class="viz-small">максимум +33</text><text x="820" y="'+(zBotMid+14)+'" class="viz-small">на горизонталях</text>';
    } else if(step===1){
      s+=stackPlanes(1,95,160,210,210,[BLUE],'вход · 1×8×8');
      s+=arrow(330,265,430,265,YELLOW,false);
      s+=stackPlanes(2,530,160,210,210,[GREEN,'#8B6BB7'],'выход · 2×6×6');
      s+=foMath(280,430,400,58,'Z\\in\\mathbb{R}^{2\\times6\\times6}','lg');
      s+='<text x="480" y="520" text-anchor="middle" class="viz-small">две плоскости с общими координатами, но разным смыслом</text>';
    } else if(step===2){
      const names=['R','G','B'],cols=['#C0392B','#27AE60','#2E6FBF'];
      for(let i=0;i<3;i++){
        s+='<rect x="'+(120+i*80)+'" y="'+(150+i*40)+'" width="230" height="230" rx="8" fill="'+cols[i]+'" fill-opacity=".14" stroke="'+cols[i]+'" stroke-width="2"/>';
        s+='<text x="'+(135+i*80)+'" y="'+(178+i*40)+'" class="viz-label" fill="'+cols[i]+'">'+names[i]+'</text>';
      }
      s+=foMath(500,220,400,60,'X\\in\\mathbb{R}^{3\\times H\\times W}','lg');
      s+='<text x="700" y="330" text-anchor="middle" class="viz-small">три матрицы с одинаковыми координатами,</text>';
      s+='<text x="700" y="358" text-anchor="middle" class="viz-small">а не три отдельные картинки</text>';
    } else if(step===3){
      s+=stackPlanes(3,90,150,200,200,[BLUE,BLUE,BLUE],'вход · 3×6×6');
      s+=arrow(345,255,425,255,YELLOW,false);
      s+=stackPlanes(3,470,190,110,110,[YELLOW,YELLOW,YELLOW],'фильтр · 3×3×3');
      s+=arrow(640,255,720,255,GREEN,false);
      s+=stackPlanes(1,760,190,150,150,[GREEN],'карта · 4×4');
      s+=foMath(230,420,500,60,'C_{in}=3\\ \\Longrightarrow\\ K^{(m)}\\in\\mathbb{R}^{3\\times3\\times3}','lg');
      s+='<text x="480" y="520" text-anchor="middle" class="viz-small">глубину фильтра выбирает не человек, а вход</text>';
    } else if(step===4){
      // три канала: у каждого своё окно 3×3 и своё ядро 3×3, каждый даёт частичную сумму
      const chans=[
        {name:'R', col:'#C0392B', win:[[2,0,0],[1,2,0],[0,2,1]], ker:[[-1,1,-1],[1,1,0],[-1,1,-1]], sum:2},
        {name:'G', col:'#27AE60', win:[[2,1,1],[1,0,1],[1,0,0]], ker:[[1,-1,1],[1,0,-1],[1,-1,-1]], sum:3},
        {name:'B', col:'#2E6FBF', win:[[1,1,0],[0,0,2],[1,2,2]], ker:[[-1,0,-1],[0,-1,-1],[0,0,1]], sum:-1}
      ];
      const cell=26, rowY=[100,240,380], winX=90, kerX=250, sumX=430;
      chans.forEach((ch,i)=>{
        const y=rowY[i], midY=y+3*cell/2;
        // метка канала
        s+='<text x="60" y="'+(midY+5)+'" text-anchor="middle" class="viz-label" fill="'+ch.col+'">'+ch.name+'</text>';
        // окно канала (подкрашено в цвет канала по яркости)
        const chRGB=[[192,57,43],[39,174,96],[46,111,191]][i];
        for(let u=0;u<3;u++) for(let v=0;v<3;v++){
          const t=ch.win[u][v]/2*0.55;
          s+='<rect x="'+(winX+v*cell)+'" y="'+(y+u*cell)+'" width="'+cell+'" height="'+cell+'" fill="'+mix([255,255,255],chRGB,t)+'" stroke="#D5D1C8"/>';
          s+='<text x="'+(winX+v*cell+cell/2)+'" y="'+(y+u*cell+cell*.66)+'" text-anchor="middle" font-size="12" fill="'+INK+'">'+ch.win[u][v]+'</text>';
        }
        s+='<text x="'+(winX+cell*1.5)+'" y="'+(y-8)+'" text-anchor="middle" class="viz-small">окно ('+ch.name+')</text>';
        // ⊙
        s+='<text x="'+(kerX-22)+'" y="'+(midY+5)+'" text-anchor="middle" font-size="18" fill="'+MUTED+'">⊙</text>';
        // ядро канала
        for(let u=0;u<3;u++) for(let v=0;v<3;v++){
          const kv=ch.ker[u][v], kf=kv>0?'#F0FAF0':(kv<0?'#FFF4F4':'#F6F5F1');
          s+='<rect x="'+(kerX+v*cell)+'" y="'+(y+u*cell)+'" width="'+cell+'" height="'+cell+'" fill="'+kf+'" stroke="#C9C2B8"/>';
          s+='<text x="'+(kerX+v*cell+cell/2)+'" y="'+(y+u*cell+cell*.66)+'" text-anchor="middle" font-size="12" fill="'+INK+'">'+kv+'</text>';
        }
        s+='<text x="'+(kerX+cell*1.5)+'" y="'+(y-8)+'" text-anchor="middle" class="viz-small">ядро K('+ch.name+')</text>';
        // = частичная сумма
        s+='<text x="'+(sumX-22)+'" y="'+(midY+5)+'" text-anchor="middle" font-size="18" fill="'+MUTED+'">=</text>';
        s+='<rect x="'+sumX+'" y="'+(midY-26)+'" width="120" height="52" rx="8" fill="#FBFAF7" stroke="'+ch.col+'" stroke-width="2"/>';
        s+='<text x="'+(sumX+60)+'" y="'+(midY-6)+'" text-anchor="middle" class="viz-small">вклад '+ch.name+'</text>';
        s+='<text x="'+(sumX+60)+'" y="'+(midY+18)+'" text-anchor="middle" class="viz-label" fill="'+ch.col+'">'+(ch.sum>=0?'+':'')+ch.sum+'</text>';
        // плюс между строками
        if(i<2) s+='<text x="'+(sumX+60)+'" y="'+(rowY[i]+3*cell+30)+'" text-anchor="middle" font-size="20" fill="'+MUTED+'">+</text>';
      });
      // аккуратная сборка: от правого края каждого вклада — короткий отрезок к вертикальной шине, шина → bias → клетка
      const boxR=sumX+120;                 // правый край блоков вклада (550)
      const spineX=600;                    // вертикальная шина
      const midRow=rowY[1]+3*cell/2;       // центр среднего ряда
      rowY.forEach(y=>{ const cy=y+3*cell/2; s+='<path d="M'+boxR+' '+cy+' L'+spineX+' '+cy+'" fill="none" stroke="'+MUTED+'" stroke-width="1.6"/>'; });
      s+='<path d="M'+spineX+' '+(rowY[0]+3*cell/2)+' L'+spineX+' '+(rowY[2]+3*cell/2)+'" fill="none" stroke="'+MUTED+'" stroke-width="1.6"/>';
      // шина → bias
      s+=arrow(spineX,midRow,648,midRow,MUTED,false);
      s+='<rect x="656" y="'+(midRow-22)+'" width="120" height="44" rx="8" fill="#FFF8D9" stroke="'+YELLOW+'" stroke-width="1.8"/>';
      s+='<text x="716" y="'+(midRow+5)+'" text-anchor="middle" class="viz-small">+ bias 0,5</text>';
      // bias → одна клетка
      s+=arrow(776,midRow,820,midRow,GREEN,false);
      s+='<rect x="828" y="'+(midRow-38)+'" width="118" height="76" rx="12" fill="#F0FAF0" stroke="'+GREEN+'" stroke-width="2"/>';
      s+='<text x="887" y="'+(midRow-14)+'" text-anchor="middle" class="viz-small">одна клетка</text>';
      s+='<text x="887" y="'+(midRow+6)+'" text-anchor="middle" class="viz-small">одной карты</text>';
      s+='<text x="887" y="'+(midRow+32)+'" text-anchor="middle" class="viz-title viz-green">4,5</text>';
      s+=foMath(90,520,780,54,'z=\\underbrace{2}_{R}+\\underbrace{3}_{G}+\\underbrace{(-1)}_{B}+\\underbrace{0{,}5}_{b}=4{,}5','md');
    } else if(step===5){
      const blocks=[{t:'a⁽⁰⁾',d:'вход',c:BLUE},{t:'K ∗ a + b',d:'линейная часть',c:YELLOW},{t:'g(·)',d:'нелинейность',c:GREEN},{t:'a⁽¹⁾',d:'выход слоя',c:GREEN}];
      blocks.forEach((b,i)=>{
        const x=50+i*235;
        s+='<rect x="'+x+'" y="180" width="185" height="130" rx="12" fill="#FBFAF7" stroke="'+b.c+'" stroke-width="2"/>';
        s+='<text x="'+(x+92)+'" y="232" text-anchor="middle" class="viz-title" fill="'+b.c+'">'+b.t+'</text>';
        s+='<text x="'+(x+92)+'" y="276" text-anchor="middle" class="viz-small">'+b.d+'</text>';
        if(i<3) s+=arrow(x+188,245,x+232,245,MUTED,false);
      });
      s+=foMath(180,370,600,62,'Z^{[1]}=K^{[1]}\\ast a^{[0]}+b^{[1]},\\qquad a^{[1]}=g(Z^{[1]})','lg');
      s+='<text x="480" y="500" text-anchor="middle" class="viz-small">та же тройка действий, что и в полносвязном слое</text>';
    } else if(step===6){
      s+=stackPlanes(3,80,180,120,120,[YELLOW,YELLOW,YELLOW],'один фильтр 3×3×3');
      s+='<text x="170" y="360" text-anchor="middle" class="viz-title viz-yellow">27 + 1 = 28</text>';
      s+='<text x="170" y="392" text-anchor="middle" class="viz-small">весов и один bias</text>';
      s+=arrow(300,250,380,250,MUTED,false);
      for(let i=0;i<10;i++) s+='<rect x="'+(400+i*46)+'" y="180" width="36" height="120" rx="5" fill="#FFF8D9" stroke="'+YELLOW+'"/>';
      s+='<text x="630" y="150" text-anchor="middle" class="viz-label">десять таких фильтров</text>';
      s+=foMath(400,340,470,62,'10\\cdot(3\\cdot3\\cdot3+1)=280','lg');
      s+='<text x="630" y="450" text-anchor="middle" class="viz-small">картинка 8×8 или 5000×5000 — параметров по-прежнему 280</text>';
    } else {
      s+=stackPlanes(3,80,170,190,190,[BLUE,BLUE,BLUE],'вход · 3×6×6');
      s+=arrow(330,265,410,265,YELLOW,false);
      s+=stackPlanes(2,450,205,110,110,[YELLOW,YELLOW],'2 фильтра 3×3×3');
      s+=arrow(620,265,700,265,GREEN,false);
      s+=stackPlanes(2,730,195,150,150,[GREEN,'#8B6BB7'],'выход · 2×4×4');
      s+=foMath(200,430,560,60,'[3,6,6]\\;\\longrightarrow\\;[2,4,4]','lg');
      s+='<text x="480" y="520" text-anchor="middle" class="viz-small">глубину выхода задаёт только число фильтров</text>';
    }
    g.innerHTML=s; renderMath(stage);
  }

  function renderShape(){
    const K=Number(document.getElementById('kernel-range').value);
    const P=Number(document.getElementById('padding-range').value);
    const S=Number(document.getElementById('stride-range').value);
    const n=8, np=n+2*P, out=Math.floor((np-K)/S)+1;
    const g=document.querySelector('#sp-viz [data-canvas]');
    const cell=Math.min(36,Math.floor(400/np));
    let s='<text x="36" y="42" class="viz-title">Калькулятор формы: K, P и S</text>';
    const x0=60,y0=110;
    for(let r=0;r<np;r++) for(let c=0;c<np;c++){
      const ir=r-P, ic=c-P, inside=ir>=0&&ir<n&&ic>=0&&ic<n;
      const v=inside?X8[ir][ic]:0;
      s+='<rect x="'+(x0+c*cell)+'" y="'+(y0+r*cell)+'" width="'+cell+'" height="'+cell+'" fill="'+(inside?shade(v):'#F1EFE9')+'" stroke="'+(inside?'#D7D3CB':'#DCD8D0')+'"/>';
    }
    for(let r=0;r+K<=np;r+=S) for(let c=0;c+K<=np;c+=S)
      s+='<circle cx="'+(x0+c*cell+2)+'" cy="'+(y0+r*cell+2)+'" r="3.4" fill="'+YELLOW+'"/>';
    s+='<rect x="'+x0+'" y="'+y0+'" width="'+(K*cell)+'" height="'+(K*cell)+'" fill="none" stroke="'+YELLOW+'" stroke-width="2.4"/>';
    s+='<text x="'+(x0+np*cell/2)+'" y="'+(y0-18)+'" text-anchor="middle" class="viz-label">вход с рамкой: '+np+'×'+np+' · жёлтые точки — левые верхние углы окон</text>';
    const ox=620,oc=Math.min(46,Math.floor(260/Math.max(out,1)));
    for(let r=0;r<out;r++) for(let c=0;c<out;c++)
      s+='<rect x="'+(ox+c*oc)+'" y="'+(140+r*oc)+'" width="'+oc+'" height="'+oc+'" fill="#F0FAF0" stroke="'+GREEN+'"/>';
    s+='<text x="'+(ox+out*oc/2)+'" y="122" text-anchor="middle" class="viz-label">выход: '+out+'×'+out+'</text>';
    s+=foMath(520,'380',400,64,'\\left\\lfloor\\frac{8+2\\cdot'+P+'-'+K+'}{'+S+'}\\right\\rfloor+1='+out,'lg');
    g.innerHTML=s;
    document.getElementById('kernel-value').textContent=K;
    document.getElementById('padding-value').textContent=P;
    document.getElementById('stride-value').textContent=S;
    const same=(out===n), rest=(np-K)%S;
    document.getElementById('shape-readout').innerHTML='<strong>Выход '+out+'×'+out+', позиций всего '+(out*out)+'.</strong> '+
      (P?'Рамка из нулей шириной '+P+' увеличила вход до '+np+'×'+np+'. ':'Рамки нет, вход остался 8×8. ')+
      (S>1?'Окно шагает через '+S+'. ':'Окно сдвигается на одну клетку. ')+
      (same?'Размер совпал со входом — это same-свёртка.':'')+
      (rest?' Последние '+rest+' столбца окно уже не покрывает — floor их отбрасывает.':'');
    renderMath(document.getElementById('shape-lab'));
  }
  function renderPool(stage,step){
    const g=canvas(stage);
    let s='<text x="36" y="42" class="viz-title">Pooling: девять окон вместо тридцати шести клеток</text>';
    const cellFill=(v)=>v>0?'#F3FAF0':'#F6F5F1';
    if(step<=3){
      s+=matrix(AV,50,120,44,{fillFn:cellFill,stroke:'#B8CBB0',title:'A = ReLU(Z) · 6×6'});
      for(let r=0;r<3;r++) for(let c=0;c<3;c++){
        const on=(step===1&&r===0)||step>=2;
        s+='<rect x="'+(50+c*88)+'" y="'+(120+r*88)+'" width="88" height="88" fill="none" stroke="'+(on?YELLOW:'#CFC9BE')+'" stroke-width="'+(on?2.6:1.6)+'"/>';
      }
      s+=arrow(360,240,440,240,step>=1?GREEN:MUTED,step<1);
      const res=step===3?POOLA.map(r=>r.map(v=>num(v,2))):POOLM.map((row,r)=>row.map((v,c)=>(step>=2||(step===1&&r===0))?v:'·'));
      s+=matrix(res,470,150,64,{fillFn:(v,r,c)=>v==='·'?'#fff':(Number(String(v).replace(',','.'))>0?'#DFF2D1':'#F6F5F1'),stroke:'#8ABF52',title:step===3?'AvgPool 2×2, s=2':'MaxPool 2×2, s=2'});
      if(step===3){
        s+=foMath(660,150,280,60,'\\text{avg}=30{,}75','md');
        s+=foMath(660,230,280,60,'\\text{max}=47','md');
        s+='<text x="800" y="330" text-anchor="middle" class="viz-small">среднее размывает</text><text x="800" y="356" text-anchor="middle" class="viz-small">одиночный сильный отклик</text>';
      }
      if(step===0) s+=foMath(240,430,480,62,'H_{out}=\\left\\lfloor\\frac{6-2}{2}\\right\\rfloor+1=3','lg');
      if(step===1) s+=foMath(200,430,560,62,'\\max\\{0,0,0,1\\}=1,\\quad\\max\\{18,47,14,44\\}=47','md');
      if(step===2) s+=foMath(240,430,480,62,'36\\ \\text{чисел}\\;\\longrightarrow\\;9\\ \\text{чисел}','lg');
      if(step===3) s+=foMath(180,430,600,62,'\\tfrac{18+47+14+44}{4}=30{,}75','lg');
    } else if(step===4){
      s+=stackPlanes(3,90,170,190,190,[GREEN,'#8B6BB7','#D17A42'],'вход · n_C×5×5');
      s+=arrow(340,265,430,265,YELLOW,false);
      s+='<rect x="440" y="215" width="130" height="100" rx="10" fill="#FFF8D9" stroke="'+YELLOW+'" stroke-width="2"/>';
      s+='<text x="505" y="252" text-anchor="middle" class="viz-small">MaxPool</text><text x="505" y="288" text-anchor="middle" class="viz-label">f=3, s=1</text>';
      s+=arrow(590,265,670,265,GREEN,false);
      s+=stackPlanes(3,700,190,150,150,[GREEN,'#8B6BB7','#D17A42'],'выход · n_C×3×3');
      s+=foMath(230,420,500,60,'\\left\\lfloor\\frac{5-3}{1}\\right\\rfloor+1=3,\\qquad n_C\\ \\text{без изменений}','lg');
      s+='<text x="480" y="510" text-anchor="middle" class="viz-small">каналы обрабатываются независимо · обучаемых весов ноль</text>';
    } else {
      const shifted=AV.map(row=>row.map((_,c)=>c+1<6?row[c+1]:0));
      const shiftedTrue=[[0,0,0,18,47,7],[1,3,0,14,44,5],[0,0,0,20,44,11],[0,0,0,30,34,11],[0,0,6,29,22,11],[0,0,28,25,6,1]];
      s+=matrix(AV,45,130,40,{fillFn:cellFill,stroke:'#B8CBB0',title:'карта исходной цифры'});
      s+=matrix(shiftedTrue,505,130,40,{fillFn:cellFill,stroke:'#B8CBB0',title:'карта цифры, сдвинутой влево'});
      s+='<rect x="'+(45+5*40)+'" y="130" width="40" height="40" fill="none" stroke="'+GREEN+'" stroke-width="3"/>';
      s+='<rect x="'+(505+4*40)+'" y="130" width="40" height="40" fill="none" stroke="'+GREEN+'" stroke-width="3"/>';
      s+=arrow(300,395,480,395,GREEN,true);
      s+='<text x="390" y="425" text-anchor="middle" class="viz-small">вся карта сдвинулась на одну клетку</text>';
      s+=foMath(150,450,660,62,'\\max_{ij}A=\\max_{ij}A^{\\text{сдвиг}}=47','lg');
    }
    g.innerHTML=s; renderMath(stage);
  }

  function renderReceptive(stage,step){
    const g=canvas(stage);
    let s='<text x="36" y="42" class="viz-title">Рецептивное поле растёт с глубиной</text>';
    // три сетки выровнены по общему верхнему краю topY; подписи снизу на общей линии
    const cell=34, topY=140;
    const inX=45, c1X=400, c2X=700;
    const inH=8*cell, c1H=6*cell, c2H=4*cell;
    const inHi=step===0?{r:0,c:0,h:3,w:3,fill:'#FFF7C9',stroke:YELLOW}:(step>=2?{r:0,c:0,h:5,w:5,fill:'#FFF7C9',stroke:YELLOW}:null);
    s+=matrix(X8,inX,topY,cell,{fillFn:shade,showNumbers:false,stroke:'#D7D3CB',highlight:inHi,title:'вход · 8×8'});
    const c1Hi=step===0?{r:0,c:0,h:1,w:1,fill:'#DFF2D1',stroke:GREEN}:(step>=1?{r:0,c:0,h:3,w:3,fill:'#DFF2D1',stroke:GREEN}:null);
    const map1=Array.from({length:6},()=>Array(6).fill(''));
    s+=matrix(map1,c1X,topY,cell,{fillFn:()=>'#F6F8F4',stroke:'#B8CBB0',showNumbers:false,highlight:c1Hi,title:'Conv 1 · 6×6'});
    const map2=Array.from({length:4},()=>Array(4).fill(''));
    const c2Hi=step>=1?{r:0,c:0,h:1,w:1,fill:'#DFF2D1',stroke:GREEN}:null;
    s+=matrix(map2,c2X,topY,cell,{fillFn:()=>'#F6F8F4',stroke:'#B8CBB0',showNumbers:false,highlight:c2Hi,title:'Conv 2 · 4×4'});
    // стрелки от Conv2-клетки к окну Conv1 и от Conv1-окна к окну входа — по верхней зоне
    s+=arrow(c1X-8,topY+18,inX+3*cell+8,topY+2*cell,YELLOW,false);
    s+=arrow(c2X-8,topY+18,c1X+3*cell+8,topY+1.5*cell,YELLOW,false);
    // подписи размеров рецептивного поля под каждой сеткой — появляются по мере шагов
    const labelY=topY+inH+30;
    if(step>=0) s+='<text x="'+(inX+inH/2)+'" y="'+labelY+'" text-anchor="middle" class="viz-small">'+(step>=2?'смотрит на 5×5 = 25 пикселей':(step===0?'окно одной клетки Conv 1: 3×3':''))+'</text>';
    if(step>=1) s+='<text x="'+(c1X+c1H/2)+'" y="'+labelY+'" text-anchor="middle" class="viz-small">окно одной клетки Conv 2: 3×3</text>';
    if(step>=1) s+='<text x="'+(c2X+c2H/2)+'" y="'+labelY+'" text-anchor="middle" class="viz-small">выбранная клетка Conv 2</text>';
    if(step===0) s+=foMath(230,470,500,60,'r_1=K_1=3','lg');
    if(step===1) s+=foMath(200,470,560,60,'\\text{на своём входе Conv 2 видит снова }3\\times3','md');
    if(step===2) s+=foMath(180,470,600,60,'r_2=r_1+(K_2-1)=3+2=5','lg');
    if(step===3){
      // общая рекурсия: показываем всю цепочку r0=1 → r1=3 → r2=5 явными подписями
      s+=foMath(120,455,720,66,'r_l=r_{l-1}+(K_l-1)\\,j_{l-1},\\qquad j_l=j_{l-1}S_l','lg');
      s+='<text x="480" y="540" text-anchor="middle" class="viz-small">'+
         'цепочка при K=3, S=1:  '+
         'r₀ = 1 (одна клетка Conv 2)  →  r₁ = 1+(3−1) = 3 в Conv 1  →  r₂ = 3+(3−1) = 5 на входе'+
         '</text>';
      s+='<text x="480" y="566" text-anchor="middle" class="viz-small" fill="'+MUTED+'">'+
         'Conv 2 не перекрашивается: подсвечена та же одна клетка, но теперь видно, во что она разворачивается на каждом слое влево. '+
         'Со stride или pooling шаг j растёт, и слой прибавляет уже кратно больше.'+
         '</text>';
    }
    if(step===2) s+='<text x="480" y="540" text-anchor="middle" class="viz-small">одна клетка второго слоя косвенно смотрит на 25 пикселей входа</text>';
    g.innerHTML=s; renderMath(stage);
  }

  const renderers={pixels:renderPixels,classifier:renderClassifier,training:renderTraining,conv:renderConv,channels:renderChannels,pool:renderPool,receptive:renderReceptive};
  function setupStage(stage){
    const panels=Array.from(stage.querySelectorAll('.step-panel'));
    const prev=stage.querySelector('[data-nav="prev"]'),next=stage.querySelector('[data-nav="next"]'),progress=stage.querySelector('.stage-progress'),counter=stage.querySelector('.stage-counter');
    let index=0; progress.innerHTML=panels.map(()=>'<i></i>').join('');
    function render(){
      panels.forEach((p,i)=>p.classList.toggle('active',i===index));
      Array.from(progress.children).forEach((dot,i)=>dot.classList.toggle('done',i<=index));
      prev.disabled=index===0;next.textContent=index===panels.length-1?'Сначала ↺':'Далее →';counter.textContent=(index+1)+' / '+panels.length;
      renderers[stage.dataset.stage](stage,index);
    }
    prev.addEventListener('click',()=>{index=Math.max(0,index-1);render();});
    next.addEventListener('click',()=>{index=index===panels.length-1?0:index+1;render();});
    stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();index=index===panels.length-1?0:index+1;render();}if(e.key==='ArrowLeft'){e.preventDefault();index=Math.max(0,index-1);render();}});
    render();
  }

  renderMath(document);
  document.querySelectorAll('.step-stage').forEach(setupStage);
  document.getElementById('shift-range').addEventListener('input',renderShift);
  document.querySelectorAll('[data-shift]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('shift-range').value=b.dataset.shift;renderShift();}));
  document.getElementById('scan-range').addEventListener('input',()=>{scanAll=false;renderScan();});
  document.getElementById('scan-fill').addEventListener('click',()=>{scanAll=!scanAll;renderScan();});
  document.getElementById('scan-reset').addEventListener('click',()=>{scanAll=false;document.getElementById('scan-range').value=0;renderScan();});
  ['kernel-range','padding-range','stride-range'].forEach(id=>document.getElementById(id).addEventListener('input',renderShape));
  renderShift();renderScan();renderShape();
})();
</script>
<script>
(function () {
  'use strict';
  function renderProseMath() {
    if (typeof katex === 'undefined') return;
    document.querySelectorAll('[data-tex]').forEach(function (node) {
      if (node.dataset.rendered === '1') return;
      try {
        katex.render(node.getAttribute('data-tex'), node, {
          throwOnError: false, displayMode: node.classList.contains('math-display'), strict: 'ignore'
        });
        node.dataset.rendered = '1';
      } catch (error) { node.textContent = node.getAttribute('data-tex'); }
    });
  }

  function initStages() {
    document.querySelectorAll('.stage:not(.step-stage)').forEach(function (stage) {
      if (stage.dataset.ready === '1') return;
      var svg = stage.querySelector('.stage-figure svg');
      var figure = stage.querySelector('.stage-figure');
      var panels = Array.prototype.slice.call(stage.querySelectorAll('.step-panel'));
      var groups = svg ? Array.prototype.slice.call(svg.querySelectorAll('[data-key]')) : [];
      var prev = stage.querySelector('[data-nav="prev"]');
      var next = stage.querySelector('[data-nav="next"]');
      var counter = stage.querySelector('.stage-counter');
      var progress = stage.querySelector('.stage-progress');
      if (!svg || !panels.length || !prev || !next || !counter || !progress) return;

      var cur = 0;
      panels.forEach(function () { progress.appendChild(document.createElement('i')); });
      var ticks = Array.prototype.slice.call(progress.querySelectorAll('i'));

      function render() {
        var panel = panels[cur];
        var on = (panel.getAttribute('data-on') || '').split(/\s+/).filter(Boolean);
        var focus = (panel.getAttribute('data-focus') || '').split(/\s+/).filter(Boolean);

        groups.forEach(function (group) {
          var key = group.getAttribute('data-key');
          var active = on.indexOf(key) !== -1;
          var only = group.hasAttribute('data-only');
          group.classList.toggle('is-hidden', only && !active);
          group.classList.toggle('is-dim', !active && !only);
          group.classList.toggle('is-focus', focus.indexOf(key) !== -1);
        });

        panels.forEach(function (panelNode, index) {
          panelNode.classList.toggle('active', index === cur);
        });
        ticks.forEach(function (tick, index) {
          tick.classList.toggle('done', index <= cur);
        });

        counter.textContent = (cur + 1) + ' / ' + panels.length;
        prev.disabled = cur === 0;
        next.textContent = cur === panels.length - 1 ? 'Сначала ↺' : 'Далее →';
        renderProseMath();

        requestAnimationFrame(function () {
          if (!figure || figure.scrollWidth <= figure.clientWidth) return;
          var focused = groups.filter(function (group) {
            return focus.indexOf(group.getAttribute('data-key')) !== -1 &&
              !group.classList.contains('is-hidden');
          });
          if (!focused.length) { figure.scrollLeft = 0; return; }
          var wrapRect = figure.getBoundingClientRect();
          var left = Infinity;
          var right = -Infinity;
          focused.forEach(function (group) {
            var rect = group.getBoundingClientRect();
            left = Math.min(left, rect.left - wrapRect.left + figure.scrollLeft);
            right = Math.max(right, rect.right - wrapRect.left + figure.scrollLeft);
          });
          var target = (left + right) / 2 - figure.clientWidth / 2;
          figure.scrollLeft = Math.max(0, Math.min(target, figure.scrollWidth - figure.clientWidth));
        });
      }

      function move(delta) {
        var target = cur + delta;
        if (target < 0) return;
        if (target >= panels.length) target = 0;
        cur = target;
        render();
      }

      prev.addEventListener('click', function () { move(-1); });
      next.addEventListener('click', function () { move(1); });
      stage.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') { move(1); event.preventDefault(); }
        if (event.key === 'ArrowLeft') { move(-1); event.preventDefault(); }
      });
      stage.dataset.ready = '1';
      render();
    });
  }

  function boot() {
    renderProseMath();
    initStages();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
</script>
