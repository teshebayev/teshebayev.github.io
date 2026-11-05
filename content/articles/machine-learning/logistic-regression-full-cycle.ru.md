<style>
    .prose .stage-figure .is-focus .svg-math > span:not(.katex) { font-weight: 700; }
  .lr-live-stage { border: 1px solid #E0DDD3; border-radius: 16px; padding: 20px 22px; margin: 26px 0; background: #FFFFFF; }
  .lr-live-head strong { font-size: 17px; }
  .lr-live-head p { margin: 6px 0 0; font-size: 14px; color: #5E5850; }
  .lr-live-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(210px, 1fr); gap: 22px; margin-top: 16px; align-items: start; }
  .lr-live-figure { overflow-x: auto; }
  .lr-live-figure svg, .stage-figure #lineFitSvg { width: 100%; display: block; }
  .lr-controls { display: flex; flex-direction: column; gap: 14px; }
  .lr-control label { display: flex; justify-content: space-between; font-size: 13px; color: #5E5850; margin-bottom: 6px; }
  .lr-control output { font-variant-numeric: tabular-nums; font-weight: 700; color: #111111; }
  .lr-control input[type=range] { width: 100%; accent-color: #3576C0; }
  .lr-live-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .lr-metric { border: 1px solid #E0DDD3; border-radius: 10px; padding: 8px 10px; }
  .lr-metric span { display: block; font-size: 12px; color: #5E5850; }
  .lr-metric strong { font-size: 17px; font-variant-numeric: tabular-nums; }
  .lr-live-formula { border: 1px solid #E0DDD3; border-radius: 10px; padding: 10px; text-align: center;
                     font-size: 15px; }
  .lr-live-note { font-size: 13px; color: #5E5850; margin-top: 4px; }
  @media (max-width: 820px) { .lr-live-grid { grid-template-columns: 1fr; } }
</style>



<p class="lead">
  Логистическая регрессия устроена как линейная, к которой добавили одну функцию.
  Разберём цикл обучения целиком: где появляется сигмоида, почему её производная исчезает
  из формул и почему в итоге градиент выглядит проще, чем у линейной модели.
</p>

<p>
  Статья самодостаточна: все формулы выводятся здесь же, из определения производной
  и правила цепочки, и ни одна не берётся готовой. Из математики нужны только производная
  сложной функции и умножение матриц. Всё остальное сводится к арифметике, показанной целиком,
  вместе со слагаемыми, из которых сложилось каждое число.
</p>

<p>
  Порядок такой. Сначала задача и данные на плоскости, потом сигмоида, которую можно подвигать
  руками. Затем модель как один нейрон и она же в матричной записи. Потом прямой проход в формах и в числах, а обратный на графе, в матрицах и в числах. В конце шаг спуска, весь цикл кодом на NumPy и PyTorch и анатомия обучения, общая для всех моделей.
</p>

<div class="semantic-key">
  <span>данные: признаки и метки</span>
  <span>параметры и операции</span>
  <span>то, что модель посчитала</span>
  <span>ошибка и градиенты</span>
</div>

<div class="callout-blue">
  <strong>Внутри схем работает ещё одно правило:</strong> тёмной заливкой отмечено то, что обучается (веса и сдвиг), светлой то, что пересчитывается заново на каждом проходе и выбрасывается. Из первых трёх частей полезнее всего унести именно это разделение на две группы.
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не на всю схему
  сразу, а только на яркую часть. Расположение блоков не меняется от шага к шагу, поэтому
  переключается именно смысл, а не картинка перед глазами. Каждый шаг разобран в панели под схемой. Стрелки ← → на клавиатуре работают, когда сцена в фокусе.
</div>

---

## Часть 1. Какая задача перед нами

<p>
  Задача такая: у нас есть группа студентов, для каждого известно, сколько часов он готовился
  и сколько занятий пропустил, а также чем кончился экзамен: сдал или нет. Хочется выучить
  зависимость, чтобы по этим двум числам оценивать шансы новых студентов.
</p>

<p>
  Это задача классификации: предсказать надо метку, а не число. Ответ здесь нельзя «немного
  промахнуть»: студент либо сдал, либо нет, середины в данных не бывает. Но модель всё равно
  отвечает числом, вероятностью. Так и получается обучаемая задача: вероятность непрерывна,
  её можно понемногу двигать, а значит, по ней можно взять производную.
</p>

<p>
  Вот как выглядят данные. Признаки приведены к удобному масштабу заранее: часы подготовки
  считаем десятками часов, а пропуски десятками занятий.
</p>

<table class="shape-table">
  <tr><th>#</th><th>Часы, дес. ч</th><th>Пропуски, дес. занятий</th><th>Сдал</th></tr>
  <tr><td>1</td><td>2,0</td><td>0,5</td><td>0</td></tr>
  <tr><td>2</td><td>4,0</td><td>0,2</td><td>1</td></tr>
  <tr><td>3</td><td>3,0</td><td>1,0</td><td>0</td></tr>
  <tr><td>4</td><td>2,0</td><td>0,9</td><td>1</td></tr>
</table>

<div class="callout-blue">
  <strong>Почему признаки поделены на десять:</strong> чтобы числа были одного порядка.
  Часы в исходных единицах дают значения около 35, пропуски около 7, и признаки разъезжаются впятеро. Порог устойчивой скорости обучения падает с 0,7340 до 0,0078, и шаг <span class="math-inline" data-tex="\eta = 0{,}5"></span> даёт потерю 2,8852 вместо 0,2709.
</div>

<p>Посмотрим пошагово, как задача выглядит на плоскости.</p>

<div class="stage" id="stageTK" tabindex="0">
  <div class="stage-figure">
<svg id="tk" viewBox="0 0 960 592" role="img" aria-label="Постановка задачи: студенты, точки, константа, промахи, log loss и лучшая кривая">
  <style>
    #tk { font-family: Helvetica, Arial, sans-serif; }
    #tk .lbl { font-size: 16px; fill: #111111; }
    #tk .cap { font-size: 13px; fill: #5E5850; }
    #tk .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #tk .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #tk .val { font-size: 14px; fill: #111111; }
    #tk .mm  { font-size: 12px; fill: #5E5850; }
    #tk .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="tk-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="tk-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="tk-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="w,\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="z"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat y"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">слева: что происходит · справа: те же студенты на плоскости</text>
<g data-key="c1" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Задача</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">У нас есть группа студентов.</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">Про каждого известно:</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">   • сколько часов он готовился</text>
<text x="68" y="250" font-size="16" fill="#111111" text-anchor="start">   • сдал он экзамен или нет</text>
<text x="68" y="294" font-size="16" fill="#111111" text-anchor="start" font-weight="700">Хотим выучить зависимость:</text>
<foreignObject x="68" y="293.48" width="391" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="\text{вероятность сдать}\approx f(\text{часы})"></div></foreignObject>
<foreignObject x="68" y="342.16" width="872" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#2A5E9B;font-weight:700" ><span>ФИЧА <span data-tex="X"></span>: то, что подаём на вход</span></div></foreignObject>
<foreignObject x="68" y="368.16" width="872" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#5F9420;font-weight:700" ><span>ТАРГЕТ <span data-tex="y"></span>: 0 или 1, без середины</span></div></foreignObject>
</g>
<g data-key="c2" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Смотрим на данные</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Каждая точка соответствует студенту.</text>
<foreignObject x="68" y="173.04" width="872" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#111111;font-weight:400" ><span>Внизу те, кто не сдал <span data-tex="(y = 0)"></span>,</span></div></foreignObject>
<foreignObject x="68" y="199.04" width="872" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#111111;font-weight:400" ><span>наверху сдавшие <span data-tex="(y = 1)"></span>.</span></div></foreignObject>
<text x="68" y="268" font-size="16" fill="#111111" text-anchor="start">Видна закономерность:</text>
<text x="68" y="294" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">чем больше часов, тем чаще сдают.</text>
<text x="68" y="338" font-size="14" fill="#5E5850" text-anchor="start">Но точки не разделяются чисто: есть</text>
<text x="68" y="364" font-size="14" fill="#5E5850" text-anchor="start">сдавшие с малой подготовкой и наоборот.</text>
</g>
<g data-key="c3" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Самая простая модель</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Что если всем называть одну и ту же</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">вероятность, долю сдавших?</text>
<foreignObject x="68" y="215.48" width="872" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:17px;color:#111111;font-weight:700" ><span><span data-tex="\hat y = 0{,}50"></span> для любого студента</span></div></foreignObject>
<text x="68" y="286" font-size="16" fill="#111111" text-anchor="start">Часы подготовки при этом</text>
<text x="68" y="312" font-size="16" fill="#9C0908" text-anchor="start" font-weight="700">игнорируются полностью.</text>
<text x="68" y="356" font-size="14" fill="#5E5850" text-anchor="start">Плохо, но с чем-то надо сравнивать.</text>
</g>
<g data-key="c4" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Промахи модели</text>
<foreignObject x="68" y="147.04" width="872" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#111111;font-weight:400" ><span>Ответ <span data-tex="y"></span> равен 0 или 1, а модель</span></div></foreignObject>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">выдаёт число между ними.</text>
<foreignObject x="68" y="217.04" width="222" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#111111;font-weight:700" data-tex="\text{промах} = \hat y - y"></div></foreignObject>
<text x="68" y="286" font-size="16" fill="#111111" text-anchor="start">Красные отрезки: расстояния от метки</text>
<text x="68" y="312" font-size="16" fill="#111111" text-anchor="start">студента до линии предсказания.</text>
<text x="68" y="356" font-size="15" fill="#9C0908" text-anchor="start" font-weight="700">Чем длиннее отрезки, тем хуже модель.</text>
</g>
<g data-key="c5" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Функция потерь: log loss</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Сводим промахи к одному числу. Но</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">платим не за длину отрезка, а за</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">уверенность в неверном ответе:</text>
<foreignObject x="68" y="243.04" width="508" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#111111;font-weight:700" data-tex="L = \text{среднее}\,(-\ln\text{вероятности правды})"></div></foreignObject>
<text x="68" y="312" font-size="16" fill="#111111" text-anchor="start">Сказать «сдаст с вероятностью 0,99»</text>
<text x="68" y="338" font-size="16" fill="#111111" text-anchor="start">про несдавшего стоит очень дорого.</text>
<foreignObject x="68" y="340.6" width="872" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#2A5E9B;font-weight:700" ><span>Цель обучения: сделать <span data-tex="L"></span> меньше.</span></div></foreignObject>
</g>
<g data-key="c6" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#F4FAEC" stroke="#73B222" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Лучшая кривая</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Прямая здесь не годится: она уходит</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">выше единицы и ниже нуля.</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">Подберём S-образную кривую:</text>
<foreignObject x="68" y="241.48" width="365" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:17px;color:#111111;font-weight:700" data-tex="\hat y = \sigma(1{,}45\cdot\text{часы} - 4{,}79)"></div></foreignObject>
<text x="68" y="312" font-size="16" fill="#111111" text-anchor="start">Она всегда лежит между 0 и 1 и</text>
<text x="68" y="338" font-size="16" fill="#111111" text-anchor="start">отвечает вероятностью, а не «да/нет».</text>
<text x="68" y="364" font-size="15" fill="#5F9420" text-anchor="start" font-weight="700">Это и есть логистическая регрессия.</text>
</g>
<g data-key="c7" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Чего не хватает</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">Часть точек кривая объясняет плохо.</text>
<text x="68" y="198" font-size="16" fill="#111111" text-anchor="start">Два студента с одинаковой подготовкой</text>
<text x="68" y="224" font-size="16" fill="#111111" text-anchor="start">сдают по-разному, если один ходил на</text>
<text x="68" y="250" font-size="16" fill="#111111" text-anchor="start">занятия, а другой пропускал.</text>
<text x="68" y="294" font-size="16" fill="#111111" text-anchor="start" font-weight="700">Добавим второй признак: пропуски.</text>
<foreignObject x="68" y="296.6" width="872" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#9C0908;font-weight:700" ><span>одни часы:  <span data-tex="L"></span> 0,3517 · верно 85,3 %</span></div></foreignObject>
<foreignObject x="68" y="322.6" width="872" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#5F9420;font-weight:700" ><span>часы и пропуски:  <span data-tex="L"></span> 0,2709 · 90,0 %</span></div></foreignObject>
<text x="68" y="372" font-size="14" fill="#5E5850" text-anchor="start">Дальше в статье модель двухпризнаковая.</text>
</g>
<g data-key="c8" data-only="1">
<rect x="40" y="88" width="446" height="392" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<text x="68" y="130" font-size="19" fill="#111111" text-anchor="start" font-weight="800">Как называют параметры</text>
<text x="68" y="172" font-size="16" fill="#111111" text-anchor="start">В статистике коэффициенты логистической</text>
<foreignObject x="68" y="173.04" width="872" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#111111;font-weight:400" ><span>регрессии пишут как <span data-tex="\hat\beta_1"></span> и <span data-tex="\hat\beta_0"></span>.</span></div></foreignObject>
<text x="68" y="242" font-size="16" fill="#111111" text-anchor="start">В машинном обучении принята другая</text>
<foreignObject x="68" y="243.04" width="872" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#111111;font-weight:400" ><span>запись: веса обозначают буквой <span data-tex="w"></span>,</span></div></foreignObject>
<foreignObject x="68" y="269.04" width="872" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#111111;font-weight:400" ><span>а сдвиг буквой <span data-tex="b"></span>.</span></div></foreignObject>
<foreignObject x="68" y="309.92" width="248" height="43.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:18px;color:#111111;font-weight:700" data-tex="\hat y = \sigma(w \cdot  x + b)"></div></foreignObject>
<foreignObject x="68" y="339.04" width="872" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#111111;font-weight:400" ><span>У каждого признака свой вес, <span data-tex="b"></span> один.</span></div></foreignObject>
</g>
<g data-key="tab" data-only="1">
<text x="720" y="106" font-size="13" fill="#5E5850" text-anchor="middle">фрагмент таблицы</text>
<rect x="530" y="118" width="190" height="30" rx="8" fill="#3576C0"/>
<foreignObject x="415" y="116.16" width="420" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#FFFFFF;font-weight:700" ><span>часы: фича <span data-tex="X"></span></span></div></foreignObject>
<rect x="726" y="118" width="190" height="30" rx="8" fill="#73B222"/>
<foreignObject x="611" y="116.16" width="420" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#FFFFFF;font-weight:700" ><span>сдал: таргет <span data-tex="y"></span></span></div></foreignObject>
<rect x="530" y="154" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="173" font-size="15" fill="#111111" text-anchor="middle">2,0</text>
<text x="821" y="173" font-size="15" fill="#111111" text-anchor="middle">0</text>
<rect x="530" y="184" width="386" height="28" fill="#FFFFFF" stroke="#E1E5EA"/>
<text x="625" y="203" font-size="15" fill="#111111" text-anchor="middle">3,5</text>
<text x="821" y="203" font-size="15" fill="#111111" text-anchor="middle">0</text>
<rect x="530" y="214" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="233" font-size="15" fill="#111111" text-anchor="middle">4,0</text>
<text x="821" y="233" font-size="15" fill="#111111" text-anchor="middle">1</text>
<rect x="530" y="244" width="386" height="28" fill="#FFFFFF" stroke="#E1E5EA"/>
<text x="625" y="263" font-size="15" fill="#111111" text-anchor="middle">4,0</text>
<text x="821" y="263" font-size="15" fill="#111111" text-anchor="middle">0</text>
<rect x="530" y="274" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="293" font-size="15" fill="#111111" text-anchor="middle">5,0</text>
<text x="821" y="293" font-size="15" fill="#111111" text-anchor="middle">1</text>
<rect x="530" y="304" width="386" height="28" fill="#FFFFFF" stroke="#E1E5EA"/>
<text x="625" y="323" font-size="15" fill="#111111" text-anchor="middle">5,5</text>
<text x="821" y="323" font-size="15" fill="#111111" text-anchor="middle">1</text>
<rect x="530" y="334" width="386" height="28" fill="#F5F8FC" stroke="#E1E5EA"/>
<text x="625" y="353" font-size="15" fill="#111111" text-anchor="middle">6,0</text>
<text x="821" y="353" font-size="15" fill="#111111" text-anchor="middle">1</text>
<text x="720" y="386" font-size="13" fill="#5E5850" text-anchor="middle">… всего 150 строк в обучающей выборке</text>
</g>
<g data-key="pts" data-only="1">
<line x1="546.0" y1="420.0" x2="924.0" y2="420.0" stroke="#5E5850" stroke-width="1.2"/>
<line x1="546.0" y1="112.0" x2="546.0" y2="420.0" stroke="#5E5850" stroke-width="1.2"/>
<text x="735" y="458" text-anchor="middle" font-size="12" fill="#5E5850">часы подготовки, десятки часов</text>
<text x="540" y="102.0" font-size="12" fill="#5E5850">вероятность сдать</text>
<text x="604.2" y="438" text-anchor="middle" font-size="12" fill="#5E5850">1</text>
<text x="662.3" y="438" text-anchor="middle" font-size="12" fill="#5E5850">2</text>
<text x="720.5" y="438" text-anchor="middle" font-size="12" fill="#5E5850">3</text>
<text x="778.6" y="438" text-anchor="middle" font-size="12" fill="#5E5850">4</text>
<text x="836.8" y="438" text-anchor="middle" font-size="12" fill="#5E5850">5</text>
<text x="894.9" y="438" text-anchor="middle" font-size="12" fill="#5E5850">6</text>
<text x="538" y="403.3" text-anchor="end" font-size="12" fill="#5E5850">0</text>
<line x1="546.0" y1="399.3" x2="924.0" y2="399.3" stroke="#ECECEC" stroke-width="1"/>
<text x="538" y="274.0" text-anchor="end" font-size="12" fill="#5E5850">0,5</text>
<line x1="546.0" y1="270.0" x2="924.0" y2="270.0" stroke="#ECECEC" stroke-width="1"/>
<text x="538" y="144.7" text-anchor="end" font-size="12" fill="#5E5850">1</text>
<line x1="546.0" y1="140.7" x2="924.0" y2="140.7" stroke="#ECECEC" stroke-width="1"/>
<circle cx="778.6" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="575.1" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="662.3" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="749.5" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="865.8" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="807.7" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="633.2" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="836.8" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="749.5" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="778.6" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="894.9" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="874.3" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="691.4" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="720.5" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="583.6" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="604.2" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="758.0" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="633.2" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="699.9" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="670.8" cy="399.3" r="6" fill="#C30B0A" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="882.8" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<circle cx="816.2" cy="140.7" r="6" fill="#73B222" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.2"/>
<text x="930" y="124.7" text-anchor="end" font-size="12" fill="#5F9420">сдали</text>
<text x="930" y="392" text-anchor="end" font-size="12" fill="#9C0908">не сдали</text>
</g>
<g data-key="cst" data-only="1">
<line x1="546.0" y1="270.0" x2="924.0" y2="270.0" stroke="#C29E08" stroke-width="2.8"/>
<foreignObject x="640" y="239.72" width="300" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#8F7406;font-weight:700" ><span><span data-tex="\hat y = 0{,}50"></span> для всех</span></div></foreignObject>
</g>
<g data-key="rc" data-only="1">
<line x1="778.6" y1="140.7" x2="778.6" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="575.1" y1="399.3" x2="575.1" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="662.3" y1="399.3" x2="662.3" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="749.5" y1="399.3" x2="749.5" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="865.8" y1="140.7" x2="865.8" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="807.7" y1="140.7" x2="807.7" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="633.2" y1="399.3" x2="633.2" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="836.8" y1="140.7" x2="836.8" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="749.5" y1="140.7" x2="749.5" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="778.6" y1="399.3" x2="778.6" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="894.9" y1="140.7" x2="894.9" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="874.3" y1="140.7" x2="874.3" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="691.4" y1="399.3" x2="691.4" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="720.5" y1="399.3" x2="720.5" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="583.6" y1="399.3" x2="583.6" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="604.2" y1="399.3" x2="604.2" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="758.0" y1="140.7" x2="758.0" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="633.2" y1="140.7" x2="633.2" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="699.9" y1="399.3" x2="699.9" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="670.8" y1="399.3" x2="670.8" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="882.8" y1="140.7" x2="882.8" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
<line x1="816.2" y1="140.7" x2="816.2" y2="270.0" stroke="#C30B0A" stroke-width="1.8" opacity="0.8"/>
</g>
<g data-key="mb" data-only="1">
<rect x="560" y="470" width="350" height="70" rx="14" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
<text x="735" y="496" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">log loss = 0,6931</text>
<foreignObject x="525" y="497.72" width="420" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>ровно <span data-tex="\ln 2"></span>: модель не знает ничего</span></div></foreignObject>
</g>
<g data-key="fit" data-only="1">
<polyline points="546.0,397.2 553.3,396.7 560.5,396.2 567.8,395.6 575.1,394.9 582.3,394.1 589.6,393.1 596.9,391.9 604.2,390.4 611.4,388.7 618.7,386.7 626.0,384.4 633.2,381.6 640.5,378.4 647.8,374.6 655.0,370.3 662.3,365.3 669.6,359.6 676.8,353.1 684.1,345.8 691.4,337.7 698.7,328.8 705.9,319.1 713.2,308.8 720.5,297.9 727.7,286.5 735.0,274.9 742.3,263.2 749.5,251.6 756.8,240.3 764.1,229.4 771.3,219.2 778.6,209.7 785.9,200.9 793.2,192.9 800.4,185.8 807.7,179.4 815.0,173.8 822.2,168.9 829.5,164.7 836.8,161.0 844.0,157.9 851.3,155.2 858.6,152.9 865.8,151.0 873.1,149.3 880.4,147.9 887.7,146.8 894.9,145.8 902.2,144.9 909.5,144.2 916.7,143.7 924.0,143.2" fill="none" stroke="#73B222" stroke-width="3"/>
<foreignObject x="616" y="348.02" width="300" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5F9420;font-weight:700;justify-content:flex-end" data-tex="\hat y = \sigma(1{,}45\,x - 4{,}79)"></div></foreignObject>
</g>
<g data-key="rf" data-only="1">
<line x1="778.6" y1="140.7" x2="778.6" y2="209.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="575.1" y1="399.3" x2="575.1" y2="394.9" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="662.3" y1="399.3" x2="662.3" y2="365.3" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="749.5" y1="399.3" x2="749.5" y2="251.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="865.8" y1="140.7" x2="865.8" y2="151.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="807.7" y1="140.7" x2="807.7" y2="179.4" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="633.2" y1="399.3" x2="633.2" y2="381.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="836.8" y1="140.7" x2="836.8" y2="161.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="749.5" y1="140.7" x2="749.5" y2="251.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="778.6" y1="399.3" x2="778.6" y2="209.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="894.9" y1="140.7" x2="894.9" y2="145.8" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="874.3" y1="140.7" x2="874.3" y2="151.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="691.4" y1="399.3" x2="691.4" y2="337.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="720.5" y1="399.3" x2="720.5" y2="297.9" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="583.6" y1="399.3" x2="583.6" y2="394.9" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="604.2" y1="399.3" x2="604.2" y2="390.4" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="758.0" y1="140.7" x2="758.0" y2="251.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="633.2" y1="140.7" x2="633.2" y2="381.6" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="699.9" y1="399.3" x2="699.9" y2="337.7" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="670.8" y1="399.3" x2="670.8" y2="365.3" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="882.8" y1="140.7" x2="882.8" y2="151.0" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
<line x1="816.2" y1="140.7" x2="816.2" y2="179.4" stroke="#C30B0A" stroke-width="1.6" opacity="0.7"/>
</g>
<g data-key="ms" data-only="1">
<rect x="560" y="470" width="350" height="70" rx="14" fill="#F4FAEC" stroke="#73B222" stroke-width="1.5"/>
<text x="735" y="496" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">log loss = 0,3770</text>
<text x="735" y="518" font-size="13" fill="#5E5850" text-anchor="middle">почти вдвое меньше, чем у константы</text>
</g>
<g data-key="nt" data-only="1">
<rect x="520" y="470" width="420" height="70" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
<foreignObject x="606" y="472.6" width="248" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="\hat y = \sigma(w \cdot  x + b)"></div></foreignObject>
<foreignObject x="520" y="497.72" width="420" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span><span data-tex="w"></span>: вес признака, <span data-tex="b"></span>: сдвиг, <span data-tex="\sigma"></span>: сигмоида</span></div></foreignObject>
</g>
<text x="40" y="572" class="legend" text-anchor="start">зелёные точки: сдали · красные: нет · жёлтая линия: константа · зелёная кривая: обученная модель</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="c1 tab mm0" data-focus="c1">
      <div class="step-kicker">Шаг 1 · данные: фичи и таргет</div>
      <h4>Что подаём на вход и что хотим предсказать</h4>
<p>Про каждого студента известно несколько чисел, и одно из них объявляем ответом. Часы подготовки будут фичей, «сдал или нет» таргетом.</p>
<p>Отличие от регрессии в одном: таргет принимает только два значения, 0 и 1. Промежуточных ответов в данных не бывает.</p>
    </div>
    <div class="step-panel" data-on="c2 pts" data-focus="pts">
      <div class="step-kicker">Шаг 2 · смотрим на точки</div>
      <h4>Метки лежат на двух уровнях, а не на кривой</h4>
<p>Каждый студент нарисован точкой. По горизонтали часы подготовки, по вертикали метка: внизу не сдавшие, наверху сдавшие.</p>
<p>На картинке 22 студента из 150. Слева почти все внизу, справа почти все наверху, а в середине классы перемешаны: это неопределённость самого исхода, ошибки измерения тут ни при чём.</p>
    </div>
    <div class="step-panel" data-on="c3 pts cst" data-focus="cst">
      <div class="step-kicker">Шаг 3 · самая простая модель</div>
      <h4>Предсказываем всем одну вероятность</h4>
<p>Возьмём модель, которая для любого студента называет одну и ту же вероятность: долю сдавших. На этих 22 студентах она равна ровно 0,50.</p>
<p>Часы при этом игнорируются полностью. Модель заведомо плохая, и это удобно: будет с чем сравнивать.</p>
    </div>
    <div class="step-panel" data-on="c4 pts cst rc" data-focus="rc">
      <div class="step-kicker">Шаг 4 · сколько модель ошибается</div>
      <h4>Промах: расстояние от метки до предсказания</h4>
<p>У сдавших модель занижает вероятность, у несдавших завышает. Длина каждого красного отрезка и есть промах на этом студенте.</p>
<p>Но складывать длины отрезков плохо. Ошибиться на 0,49 и на 0,99 совсем не одно и то же: во втором случае модель была уверена и оказалась неправа.</p>
    </div>
    <div class="step-panel" data-on="c5 pts cst rc mb" data-focus="mb">
      <div class="step-kicker">Шаг 5 · сводим промахи в одно число</div>
      <h4>Log loss наказывает за уверенность в неправде</h4>
<p>За каждого студента платим минус логарифмом той вероятности, которую модель дала правильному ответу, и берём среднее.</p>
<p><div class="math-display" data-tex="L = -\frac{1}{N}\sum_{n=1}^{N}\bigl[y_n\ln\hat y_n + (1-y_n)\ln(1-\hat y_n)\bigr]"></div></p><p>У константы 0,50 получается ровно <span class="math-inline" data-tex="\ln 2 = 0{,}6931"></span>: столько стоит честное «не знаю».</p>
    </div>
    <div class="step-panel" data-on="c6 pts fit rf ms" data-focus="fit ms">
      <div class="step-kicker">Шаг 6 · находим лучшую кривую</div>
      <h4>Сигмоида вместо прямой</h4>
<p>Прямая для вероятности не подходит: продлите её вправо, и получите значение больше единицы. Поэтому линейную часть пропускают через сигмоиду, которая сжимает любое число в отрезок от 0 до 1.</p>
<p>Подобранная кривая даёт log loss 0,3770 против 0,6931 у константы и угадывает 19 студентов из 22.</p>
    </div>
    <div class="step-panel" data-on="c7 pts fit" data-focus="c7">
      <div class="step-kicker">Шаг 7 · чего не хватает</div>
      <h4>Одни часы объясняют не всё</h4>
<p>В середине картинки классы по-прежнему перемешаны. Часть этой путаницы объясняет второй признак, которого на графике нет: пропущенные занятия.</p>
<p>На всех 150 студентах одни часы дают потерю 0,3517 и 85,3 % верных ответов, а часы вместе с пропусками 0,2709 и 90,0 %. Поэтому дальше модель двухпризнаковая.</p>
    </div>
    <div class="step-panel" data-on="c8 pts fit nt" data-focus="c8 nt">
      <div class="step-kicker">Шаг 8 · как принято обозначать</div>
      <h4>В машинном обучении это <span class="math-inline" data-tex="w"></span> и <span class="math-inline" data-tex="b"></span></h4>
<p>В учебниках статистики коэффициенты логистической регрессии пишут как <span class="math-inline" data-tex="\hat\beta_1"></span> и <span class="math-inline" data-tex="\hat\beta_0"></span>. В машинном обучении договорились иначе: параметры при признаках называют весами и обозначают <span class="math-inline" data-tex="w"></span>, а свободный член сдвигом <span class="math-inline" data-tex="b"></span>.</p>
<p>Причина практическая: признаков бывает много, и удобно, когда у каждого свой вес с номером <span class="math-inline" data-tex="(w_1,\  w_2,\  w_3)"></span>, а сдвиг остаётся один. Вся дальнейшая статья написана в этих обозначениях.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> в классификации ответ дискретный, а обучаемая величина непрерывная. Модель предсказывает вероятность, потеря измеряет, насколько уверенно эта
  вероятность промахнулась, и именно потерю мы будем уменьшать. Решение «сдаст или нет»
  появляется в самом конце, сравнением с порогом.
</div>

---

## Часть 2. Сигмоида, вероятность и log loss

<p>
  При одном признаке модель задаёт кривую. Вес управляет её крутизной, сдвиг положением по горизонтали: он говорит, при скольких часах подготовки шансы сравниваются. Точки данных
  лежат на двух уровнях, 0 и 1, а кривая проходит между ними.
</p>

<p>
  Прежде чем выводить формулы, эту связь полезно почувствовать руками. Подвигайте ползунки
  и посмотрите, что происходит с кривой и с числами внизу.
</p>

<div class="lr-live-stage" id="lineFitInteractive">
  <div class="lr-live-head"><strong>Интерактив: двигайте сигмоиду и наблюдайте log loss</strong>
    <p>Красные пунктирные отрезки показывают промахи: расстояния от метки студента до кривой.</p></div>
  <div class="lr-live-grid">
    <div class="lr-live-figure"><svg id="lineFitSvg" viewBox="0 0 700 420" role="img" aria-label="Точки данных, сигмоида и промахи"><style>#lineFitSvg { font-family: Helvetica, Arial, sans-serif; }</style></svg></div>
    <div class="lr-controls">
      <div class="lr-control"><label for="lineW"><span>Вес <span class="math-inline" data-tex="w"></span></span> <output id="lineWOut">1,00</output></label>
        <input id="lineW" type="range" min="0" max="4" value="1" step="0.05"></div>
      <div class="lr-control"><label for="lineB"><span>Сдвиг <span class="math-inline" data-tex="b"></span></span> <output id="lineBOut">−3,00</output></label>
        <input id="lineB" type="range" min="-12" max="2" value="-3" step="0.1"></div>
      <div class="lr-live-metrics">
        <div class="lr-metric"><span>log loss</span><strong id="lineLoss">—</strong></div>
        <div class="lr-metric"><span>верных ответов</span><strong id="lineAcc">—</strong></div>
      </div>
      <div class="lr-live-formula" id="lineFormula"></div>
      <p class="lr-live-note">Лучшее, чего можно добиться на этих 22 студентах: <span class="math-inline" data-tex="w = 1{,}45"></span>, <span class="math-inline" data-tex="b = -4{,}79"></span>, log loss = 0,3770 при 19 верных из 22.</p>
    </div>
  </div>
</div>

<script>
(function () {
  var pts = [[4,1],[0.5,0],[2,0],[3.5,0],[5.5,1],[4.5,1],[1.5,0],[5,1],[3.5,1],[4,0],[6,1],[5.5,1],[2.5,0],[3,0],[0.5,0],[1,0],[3.5,1],[1.5,1],[2.5,0],[2,0],[5.5,1],[4.5,1]];
  var svg = document.getElementById('lineFitSvg');
  if (!svg) return;
  var P = {l: 64, r: 668, t: 40, b: 350, xmin: 0, xmax: 6.6};
  function sx(v) { return P.l + (v - P.xmin) / (P.xmax - P.xmin) * (P.r - P.l); }
  function sy(v) { return P.b - v * (P.b - P.t); }
  function sig(z) { return 1 / (1 + Math.exp(-z)); }
  function el(n, a) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (var k in a) e.setAttribute(k, a[k]);
    return e;
  }
  function label(x, y, t, anchor) {
    var e = el('text', {x: x, y: y, 'font-size': 12, fill: '#5E5850'});
    if (anchor) e.setAttribute('text-anchor', anchor);
    e.textContent = t;
    return e;
  }
  function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
  function draw(w, b) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 700, height: 420, fill: '#ffffff'}));
    for (var i = 1; i <= 6; i++) {
      svg.appendChild(el('line', {x1: sx(i), y1: P.t, x2: sx(i), y2: P.b, stroke: '#ECECEC', 'stroke-width': 1}));
      svg.appendChild(label(sx(i), P.b + 20, i, 'middle'));
    }
    [0, 0.5, 1].forEach(function (v) {
      svg.appendChild(el('line', {x1: P.l, y1: sy(v), x2: P.r, y2: sy(v), stroke: '#ECECEC', 'stroke-width': 1}));
      svg.appendChild(label(P.l - 10, sy(v) + 4, fmt(v, 1), 'end'));
    });
    svg.appendChild(el('line', {x1: P.l, y1: P.b, x2: P.r, y2: P.b, stroke: '#5E5850', 'stroke-width': 1.2}));
    svg.appendChild(el('line', {x1: P.l, y1: P.t, x2: P.l, y2: P.b, stroke: '#5E5850', 'stroke-width': 1.2}));
    svg.appendChild(label(P.r, P.b + 44, 'часы подготовки, десятки часов', 'end'));
    svg.appendChild(label(P.l - 6, P.t - 14, 'вероятность сдать'));
    var d = [];
    for (var t = 0; t <= 132; t++) {
      var xv = P.xmin + (P.xmax - P.xmin) * t / 132;
      d.push((t ? 'L' : 'M') + sx(xv) + ' ' + sy(sig(w * xv + b)));
    }
    svg.appendChild(el('path', {d: d.join(' '), fill: 'none', stroke: '#73B222', 'stroke-width': 3}));
    var seen = {};
    pts.forEach(function (p) {
      var key = p[0] + '_' + p[1];
      var n = seen[key] || 0;
      seen[key] = n + 1;
      var px = sx(p[0]) + n * 9;
      var pred = sig(w * p[0] + b);
      svg.appendChild(el('line', {x1: px, y1: sy(p[1]), x2: px, y2: sy(pred),
                                  stroke: '#C30B0A', 'stroke-width': 1.7, 'stroke-dasharray': '3 3', opacity: 0.85}));
      svg.appendChild(el('circle', {cx: px, cy: sy(p[1]), r: 5.5, fill: p[1] ? '#73B222' : '#C30B0A',
                                    'fill-opacity': 0.8, stroke: '#ffffff', 'stroke-width': 1.2}));
    });
  }
  function update() {
    var w = +document.getElementById('lineW').value;
    var b = +document.getElementById('lineB').value;
    var sum = 0, right = 0;
    pts.forEach(function (p) {
      var q = sig(w * p[0] + b);
      q = Math.min(Math.max(q, 1e-12), 1 - 1e-12);
      sum += -(p[1] * Math.log(q) + (1 - p[1]) * Math.log(1 - q));
      if ((q > 0.5 ? 1 : 0) === p[1]) right += 1;
    });
    sum /= pts.length;
    document.getElementById('lineWOut').textContent = fmt(w, 2);
    document.getElementById('lineBOut').textContent = fmt(b, 2).replace('-', '−');
    document.getElementById('lineLoss').textContent = fmt(sum, 4);
    document.getElementById('lineAcc').textContent = right + ' из 22';
    var fNode = document.getElementById('lineFormula');
    var fTex = '\\hat y = \\sigma(' + fmt(w, 2).replace(',', '{,}') + '\\cdot x ' + (b >= 0 ? '+ ' : '- ') + fmt(Math.abs(b), 2).replace(',', '{,}') + ')';
    if (window.katex) { window.katex.render(fTex, fNode, {throwOnError: false}); }
    else { fNode.textContent = 'ŷ = σ(' + fmt(w, 2) + ' · x ' + (b >= 0 ? '+ ' : '− ') + fmt(Math.abs(b), 2) + ')'; }
    draw(w, b);
  }
  document.getElementById('lineW').addEventListener('input', update);
  document.getElementById('lineB').addEventListener('input', update);
  update();
})();
</script>

<p>
  Обратите внимание на две метрики. Точность считает только попадания и не различает
  «угадал еле-еле» и «угадал уверенно»: её можно не сдвинуть вовсе, сильно изменив кривую.
  Log loss видит каждую вероятность по отдельности, поэтому именно её и минимизируют.
</p>

### Почему не прямая

<p>
  Первое, что приходит в голову: обучить обычную линейную регрессию на метках 0 и 1.
  Не работает по двум причинам сразу. Прямая не ограничена: при шестидесяти часах подготовки
  она выдаст 1,4, а это не вероятность. И она не насыщается: студент, готовившийся вдвое дольше
  всех остальных, тянет прямую на себя, хотя про него и так всё ясно.
</p>

<p>
  Поэтому линейную часть оставляют как есть, а поверх ставят функцию, которая сжимает любое
  число в отрезок от нуля до единицы:
</p>

<p><div class="math-display" data-tex="\hat y = \sigma(z) = \frac{1}{1 + e^{-z}}, \qquad z = wx + b"></div></p>

<p>
  Величину <span class="math-inline" data-tex="z"></span> называют логитом. У сигмоиды есть
  обратная функция, и она объясняет название: логит равен логарифму отношения шансов.
</p>

<p><div class="math-display" data-tex="z = \ln\frac{\hat y}{1 - \hat y}"></div></p>

<p>
  Отсюда читается смысл весов. Вес 0,8 у часов означает: каждые десять часов подготовки
  увеличивают логит на 0,8, то есть умножают шансы сдать на
  <span class="math-inline" data-tex="e^{0{,}8} \approx 2{,}2"></span>. Не вероятность,
  а именно шансы: отношение «сдам» к «не сдам».
</p>

### Откуда берётся log loss

<p>
  Функцию потерь здесь не изобретают, а выводят. Модель заявляет вероятность каждого исхода;
  вероятность того, что она предсказала весь обучающий набор правильно, равна произведению по всем студентам:
</p>

<p><div class="math-display" data-tex="\prod_{n=1}^{N} \hat y_n^{\,y_n}\,(1-\hat y_n)^{1-y_n}"></div></p>

<p>
  Показатели степени работают как переключатель: при
  <span class="math-inline" data-tex="y_n = 1"></span> остаётся
  <span class="math-inline" data-tex="\hat y_n"></span>, при
  <span class="math-inline" data-tex="y_n = 0"></span> остаётся <span class="math-inline" data-tex="1-\hat y_n"></span>.
  Произведение сотен маленьких чисел неудобно и вычислительно опасно, поэтому берут логарифм: он превращает произведение в сумму. Максимизировать сумму логарифмов значит минимизировать её со знаком минус, а деление на <span class="math-inline" data-tex="N"></span>
  делает результат сравнимым между батчами:
</p>

<p><div class="math-display" data-tex="L = -\frac{1}{N}\sum_{n=1}^{N}\bigl[y_n\ln\hat y_n + (1-y_n)\ln(1-\hat y_n)\bigr]"></div></p>

<table class="shape-table">
  <tr><th>Шаг</th><th>Что делает</th></tr>
  <tr><td>Вероятность правды</td><td>из двух чисел <span class="math-inline" data-tex="\hat y"></span> и <span class="math-inline" data-tex="1 - \hat y"></span> выбирает то, которое соответствует метке</td></tr>
  <tr><td>Логарифм с минусом</td><td>превращает произведение в сумму и наказывает уверенную ошибку без предела</td></tr>
  <tr><td>Среднее</td><td>возвращает один скаляр, сопоставимый между батчами разного размера</td></tr>
</table>

<div class="callout-blue">
  <strong>Почему не квадрат ошибки:</strong> его можно посчитать и здесь, но обучаться будет
  плохо. На обратном проходе у MSE появляется множитель
  <span class="math-inline" data-tex="\hat y(1-\hat y)"></span>, а он близок к нулю там,
  где модель уверена. Если она уверенно ошиблась, например сказала 0,99 про несдавшего, сигнал ошибки
  у MSE окажется в 50,5 раза слабее, чем у log loss, и исправляться модель будет мучительно
  долго. На нашем батче из четырёх студентов градиент по весу часов выходит −0,2516 у log loss
  и −0,0570 у MSE. Вдобавок MSE поверх сигмоиды невыпукла: у одного объекта
  <span class="math-inline" data-tex="x = 1,\ y = 1"></span> вторая производная становится
  отрицательной при <span class="math-inline" data-tex="w &lt; -\ln 2"></span>.
</div>

<div class="callout-yellow">
  <strong>Ноль и единица в предсказании запрещены.</strong> Log loss берёт логарифм, поэтому
  <span class="math-inline" data-tex="\hat y = 0"></span> у сдавшего даёт бесконечность.
  Математически сигмоида никогда не выдаёт ровно ноль или единицу, но в float64 выдаёт: при <span class="math-inline" data-tex="z \ge 37"></span> получается ровно единица, при <span class="math-inline" data-tex="z \le -710"></span> ровно ноль.
  Поэтому на практике потерю считают не через <code>log(sigmoid(z))</code>, а сразу через логиты, устойчивой формулой, которую мы разберём в части 12.
</div>

### Как принято обозначать параметры

<p>
  В учебниках статистики коэффициенты логистической регрессии пишут как
  <span class="math-inline" data-tex="\hat\beta_1"></span> и
  <span class="math-inline" data-tex="\hat\beta_0"></span>. В машинном обучении договорились
  иначе: параметры при признаках называют весами и обозначают
  <span class="math-inline" data-tex="w"></span>, а свободный член сдвигом <span class="math-inline" data-tex="b"></span> (от bias).
</p>

<p><div class="math-display" data-tex="\hat y = \sigma(\hat\beta_1 x + \hat\beta_0) \qquad\Longleftrightarrow\qquad \hat y = \sigma(wx + b)"></div></p>

<p>
  Причина практическая. Признаков бывает много, и удобно, когда у каждого свой вес с номером, <span class="math-inline" data-tex="w_1, w_2, \dots, w_P"></span>, а сдвиг остаётся один
  на всю модель. В таком виде веса естественно собираются в столбец
  <span class="math-inline" data-tex="\mathbf{w}"></span>, и вся запись становится матричной.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> сигмоида нужна, чтобы ответ стал вероятностью, а log loss нужен, чтобы за уверенную ошибку платили дороже, чем за осторожную. Первая ограничивает выход, вторая выводится из правдоподобия, и вместе они дадут на обратном проходе простую разность <span class="math-inline" data-tex="\hat y - y"></span>.
</div>

---

## Часть 3. Модель как один нейрон

<p>
  Модель предполагает, что шансы сдать складываются из вклада часов, вклада пропусков и какой-то
  базовой величины. У такой модели три параметра, и задача обучения в том, чтобы подобрать их так, чтобы
  предсказанные вероятности как можно лучше согласовались с настоящими исходами.
</p>

<p>
  Нарисовать её удобно как один нейрон: два входа, у каждого свой вес, всё сходится в сумматор,
  снизу подмешивается сдвиг, дальше стоит сигмоида, справа выходит вероятность. Ровно эта
  картинка потом повторится в нейросети: там таких нейронов будут тысячи, но устроен каждый
  одинаково.
</p>

<div class="callout-blue">
  <strong>Что означает знак веса:</strong> положительный вес говорит, что признак повышает шансы,
  отрицательный, что понижает. У пропусков вес будет отрицательным: модель обнаружит это сама.
</div>

<p>Посмотрим пошагово, что происходит с одним студентом внутри модели.</p>

<div class="stage" id="stageNN" tabindex="0">
  <div class="stage-figure">
<svg id="nn" viewBox="0 0 960 442" role="img" aria-label="Модель как один нейрон: два входа, два веса, сдвиг, сигмоида и вероятность">
  <style>
    #nn { font-family: Helvetica, Arial, sans-serif; }
    #nn .lbl { font-size: 16px; fill: #111111; }
    #nn .cap { font-size: 13px; fill: #5E5850; }
    #nn .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #nn .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #nn .val { font-size: 14px; fill: #111111; }
    #nn .mm  { font-size: 12px; fill: #5E5850; }
    #nn .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="nn-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="nn-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="nn-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="nn-ary" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8F7406"/></marker>
    <marker id="nn-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="w,\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="z"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat y"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">один студент проходит модель слева направо</text>
<g data-key="inp"><circle cx="100" cy="118" r="30" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="70" y="88" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><foreignObject x="40" y="152" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>часы</span></div></foreignObject><circle cx="100" cy="235" r="30" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="70" y="205" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><foreignObject x="40" y="269" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>пропуски</span></div></foreignObject></g>
<g data-key="wts"><line x1="128.1" y1="131.1" x2="320.1" y2="221.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#nn-arw)"/><line x1="131.0" y1="235.0" x2="317.0" y2="235.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#nn-arw)"/><foreignObject x="191.358" y="149.914" width="80" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#8F7406;font-weight:400" data-tex="\cdot\, w_1"></div></foreignObject><foreignObject x="185" y="207" width="80" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#8F7406;font-weight:400" data-tex="\cdot\, w_2"></div></foreignObject></g>
<g data-key="bias"><circle cx="100" cy="352" r="30" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="70" y="322" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="b"></div></foreignObject><foreignObject x="40" y="386" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>сдвиг</span></div></foreignObject><line x1="128.1" y1="338.9" x2="320.1" y2="249.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#nn-arw)"/><foreignObject x="211.782" y="294.992" width="40" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject></g>
<g data-key="z"><circle cx="350" cy="235" r="30" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="320" y="205" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="z"></div></foreignObject><foreignObject x="290" y="179" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>логит</span></div></foreignObject></g>
<g data-key="sg"><line x1="381.0" y1="235.0" x2="537.0" y2="235.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#nn-arw)"/><foreignObject x="420" y="207" width="80" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#8F7406;font-weight:400" data-tex="\sigma(\cdot)"></div></foreignObject><line x1="405" y1="348" x2="515" y2="348" stroke="#8A847B" stroke-width="1.2"/><line x1="405" y1="282" x2="515" y2="282" stroke="#8A847B" stroke-width="1.2" stroke-dasharray="3 3"/><polyline points="405.0,347.8 407.8,347.8 410.5,347.7 413.2,347.6 416.0,347.5 418.8,347.3 421.5,347.0 424.2,346.7 427.0,346.2 429.8,345.7 432.5,344.9 435.2,343.8 438.0,342.5 440.8,340.8 443.5,338.6 446.2,336.0 449.0,332.7 451.8,328.9 454.5,324.6 457.2,319.9 460.0,315.0 462.8,310.1 465.5,305.4 468.2,301.1 471.0,297.3 473.8,294.0 476.5,291.4 479.2,289.2 482.0,287.5 484.8,286.2 487.5,285.1 490.2,284.3 493.0,283.8 495.8,283.3 498.5,283.0 501.2,282.7 504.0,282.5 506.8,282.4 509.5,282.3 512.2,282.2 515.0,282.2" fill="none" stroke="#8F7406" stroke-width="2.4"/><foreignObject x="350" y="350" width="220" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\sigma(z) = \dfrac{1}{1 + e^{-z}}"></div></foreignObject></g>
<g data-key="yh"><circle cx="570" cy="235" r="30" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="540" y="205" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\hat y"></div></foreignObject><foreignObject x="500" y="179" width="140" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>вероятность</span></div></foreignObject></g>
<g data-key="cmp" data-only="1"><line x1="601.0" y1="235.0" x2="757.0" y2="235.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#nn-arw)"/><foreignObject x="620" y="207" width="120" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" ><span>log loss</span></div></foreignObject><circle cx="790" cy="118" r="30" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="760" y="88" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y"></div></foreignObject><foreignObject x="830" y="108" width="130" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5E5850;font-weight:400" ><span>настоящая метка</span></div></foreignObject><line x1="790.0" y1="149.0" x2="790.0" y2="202.0" stroke="#3576C0" stroke-width="1.8" marker-end="url(#nn-arb)"/><circle cx="790" cy="235" r="30" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="760" y="205" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\ell"></div></foreignObject><foreignObject x="830" y="225" width="100" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5E5850;font-weight:400" ><span>потеря</span></div></foreignObject><foreignObject x="550" y="287" width="340" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\ell = -\bigl[y\ln\hat y + (1-y)\ln(1-\hat y)\bigr]"></div></foreignObject></g>
<text x="40" y="428" font-size="13" fill="#5E5850" font-weight="400" text-anchor="start">синее: данные · жёлтое: обучаемые числа · зелёное: то, что модель посчитала · красное: потеря</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="inp mm0" data-focus="inp">
      <div class="step-kicker">Шаг 1 · вход</div>
      <h4>Студент: два числа</h4>
<p><b>1) <span class="math-inline" data-tex="x_1,\  x_2"></span>: вход.</b> Часы подготовки в десятках часов и пропущенные занятия в десятках. Больше модель о студенте ничего не знает.</p>
<p>Эти два числа приходят извне и при обучении не меняются.</p>
    </div>
    <div class="step-panel" data-on="inp wts mm1" data-focus="wts">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>У каждого входа свой множитель</h4>
<p><b>2) <span class="math-inline" data-tex="w_1,\  w_2"></span>: веса.</b> По одному на признак: насколько десять часов подготовки повышают шансы и насколько десять пропусков их понижают.</p>
<p>Это первые два из тех чисел, которые модель будет подбирать.</p>
    </div>
    <div class="step-panel" data-on="inp wts z mm1 mm2" data-focus="z">
      <div class="step-kicker">Шаг 3 · взвешенная сумма</div>
      <h4>Складываем произведения</h4>
<p><b>3) <span class="math-inline" data-tex="z = x_1\cdot w_1 + x_2\cdot w_2 + b"></span>.</b> Ровно та же линейная комбинация, что и в линейной регрессии. У неё есть имя: логит.</p>
<p><div class="math-display" data-tex="z = x_1 w_1 + x_2 w_2 + b"></div></p>
    </div>
    <div class="step-panel" data-on="inp wts z bias mm1 mm2" data-focus="bias">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4>Одно число, не привязанное ни к какому признаку</h4>
<p><b>3) … + <span class="math-inline" data-tex="b"></span>.</b> Сдвиг двигает всю кривую вправо или влево: он задаёт, сколько часов нужно «в среднем», чтобы шансы сравнялись.</p>
<p>Без него граница была бы обязана проходить через ноль: студент, не готовившийся ни часа и ничего не пропустивший, получал бы ровно 0,5.</p>
    </div>
    <div class="step-panel" data-on="inp wts z bias sg mm2 mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида</div>
      <h4>Превращает любое число в вероятность</h4>
<p><b>4) <span class="math-inline" data-tex="\hat y = \sigma(z)"></span>.</b> Логит может быть любым числом от минус до плюс бесконечности, а вероятность обязана лежать между нулём и единицей. Сигмоида делает именно это.</p>
<p><div class="math-display" data-tex="\sigma(z) = \frac{1}{1 + e^{-z}}"></div></p><p>Ровно здесь логистическая регрессия отличается от линейной. Всё остальное в статье устроено так же.</p>
    </div>
    <div class="step-panel" data-on="inp wts z bias sg yh mm3" data-focus="yh">
      <div class="step-kicker">Шаг 6 · выход</div>
      <h4>Ответ: вероятность, а не «да/нет»</h4>
<p>При <span class="math-inline" data-tex="z = 0"></span> сигмоида даёт 0,5, при больших положительных <span class="math-inline" data-tex="z"></span> почти единицу, при больших отрицательных почти ноль. Насыщение важно: очень уверенные ответы получаются далеко от границы.</p>
<p>Чтобы получить решение «сдаст или нет», вероятность потом сравнивают с порогом, обычно с 0,5. Но обучается модель на вероятностях, а не на решениях.</p>
    </div>
    <div class="step-panel" data-on="z sg yh cmp mm4" data-focus="cmp">
      <div class="step-kicker">Шаг 7 · промах</div>
      <h4>Сравниваем с настоящей меткой</h4>
<p>Настоящий исход в обучении известен. Модель платит минус логарифмом той вероятности, которую она дала верному ответу.</p>
<p><div class="math-display" data-tex="\ell = -\bigl[y\ln \hat y + (1-y)\ln(1-\hat y)\bigr]"></div></p><p>Формула выглядит как две формулы, но это одна запись: при <span class="math-inline" data-tex="y = 1"></span> исчезает второе слагаемое, при <span class="math-inline" data-tex="y = 0"></span> первое.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> логистическая регрессия отличается от линейной ровно
  одной коробочкой на схеме. Слева от сигмоиды стоит та же взвешенная сумма, справа вероятность вместо числа и логарифм вместо квадрата. Три обучаемых числа остаются
  теми же самыми.
</div>

---

## Часть 4. Переходим к матричной записи

<p>
  Запись <span class="math-inline" data-tex="z = x_1w_1 + x_2w_2 + b"></span> честная, но у неё
  есть предел применимости: она годится, пока признаков два-три. При тридцати такую строку уже
  не написать, а при тысяче формула перестаёт что-либо сообщать.
</p>

<p>
  Матричная запись решает ровно эту проблему. Признаки складываются в строку, веса в столбец,
  и вместо суммы с индексами появляется одно произведение, которое выглядит одинаково при двух
  признаках и при тысяче. Сигмоида при этом ничего не усложняет: она применяется к каждой клетке
  отдельно.
</p>

<div class="callout-blue">
  <strong>Что означает «сокращение размерностей»:</strong> в произведении
  <span class="math-inline" data-tex="[1\times P]\cdot[P\times 1]"></span> внутренние числа
  обязаны совпасть, а внешние дают форму результата: <span class="math-inline" data-tex="[1\times 1]"></span>.
  В нашем примере <span class="math-inline" data-tex="P = 2"></span>, то есть
  <span class="math-inline" data-tex="[1\times 2]\cdot[2\times 1] = [1\times 1]"></span>: двойка исчезает,
  и после умножения от студента остаётся одно число.
</div>

<p>Посмотрим пошагово, как сумма по индексам превращается в произведение матриц.</p>

<div class="stage" id="stageMX" tabindex="0">
  <div class="stage-figure">
<svg id="mx" viewBox="0 0 960 520" role="img" aria-label="Переход от записи по индексам к матричной">
  <style>
    #mx { font-family: Helvetica, Arial, sans-serif; }
    #mx .lbl { font-size: 16px; fill: #111111; }
    #mx .cap { font-size: 13px; fill: #5E5850; }
    #mx .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #mx .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #mx .val { font-size: 14px; fill: #111111; }
    #mx .mm  { font-size: 12px; fill: #5E5850; }
    #mx .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="mx-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="mx-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="mx-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="\mathbf{w},\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="z"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat{\mathbf{y}}"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">та же сумма, записанная так, чтобы не удлиняться с ростом числа признаков</text>
<g data-key="nrn"><line x1="94.1" y1="127.3" x2="238.0" y2="187.9" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mx-arw)"/><line x1="96.0" y1="198.0" x2="236.0" y2="198.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mx-arw)"/><line x1="94.1" y1="268.7" x2="238.0" y2="208.1" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mx-arw)"/><circle cx="72" cy="118" r="23" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="49" y="95" width="46" height="46"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="72" cy="198" r="23" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="49" y="175" width="46" height="46"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><circle cx="72" cy="278" r="23" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="49" y="255" width="46" height="46"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="b"></div></foreignObject><circle cx="262" cy="198" r="23" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="239" y="175" width="46" height="46"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z"></div></foreignObject><foreignObject x="146.545" y="138.019" width="70" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\cdot\, w_1"></div></foreignObject><foreignObject x="141.5" y="173" width="70" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\cdot\, w_2"></div></foreignObject><foreignObject x="166.933" y="234.903" width="30" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject><text x="168" y="338" font-size="13" fill="#5E5850" font-weight="400" text-anchor="middle">запись по индексам</text></g>
<g data-key="row">
<rect x="360" y="112" width="120" height="44" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="420" y1="112" x2="420" y2="156" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="335" y="83.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="1\times P=1\times 2"></div></foreignObject>
<foreignObject x="385" y="153.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="\mathbf{x}"></div></foreignObject>
<text x="420" y="202" class="cap" text-anchor="middle">признаки в строку</text>
</g>
<g data-key="col">
<foreignObject x="466" y="115.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject>
<rect x="512" y="100" width="46" height="88" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="512" y1="144" x2="558" y2="144" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="450" y="71.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1=2\times 1"></div></foreignObject>
<foreignObject x="500" y="185.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="\mathbf{w}"></div></foreignObject>
</g>
<g data-key="mul" data-only="1">
<foreignObject x="544" y="115.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject>
<rect x="590" y="112" width="44" height="44" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="577" y="153.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="b"></div></foreignObject>
<foreignObject x="620" y="115.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
<rect x="666" y="112" width="44" height="44" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="603" y="83.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="1\times 1"></div></foreignObject>
<foreignObject x="653" y="153.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="z"></div></foreignObject>
<foreignObject x="390" y="211.72" width="420" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span><span data-tex="[1 \times  P] \cdot  [P \times  1] = [1 \times  1]"></span>: внутренние <span data-tex="P"></span> сокращаются</span></div></foreignObject>
</g>
<g data-key="sg" data-only="1">
<line x1="716" y1="134" x2="748" y2="134" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#mx-arw)"/>
<foreignObject x="702" y="91.72" width="60" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="\sigma"></div></foreignObject>
<rect x="760" y="112" width="44" height="44" rx="2" fill="#C29E08" opacity="0.25" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="697" y="83.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="1\times 1"></div></foreignObject>
<foreignObject x="736" y="153.48" width="92" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="\sigma(z)"></div></foreignObject>
<line x1="812" y1="134" x2="844" y2="134" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#mx-arw)"/>
<rect x="856" y="112" width="44" height="44" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="793" y="83.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="1\times 1"></div></foreignObject>
<foreignObject x="848" y="160" width="60" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="\hat y"></div></foreignObject>
<text x="790" y="246" class="cap" text-anchor="middle">сигмоида применяется к каждой клетке отдельно</text>
</g>
<g data-key="bat" data-only="1">
<rect x="360" y="300" width="120" height="96" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="420" y1="300" x2="420" y2="396" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="360" y1="324" x2="480" y2="324" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="360" y1="348" x2="480" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="360" y1="372" x2="480" y2="372" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="335" y="271.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times P=4\times 2"></div></foreignObject>
<foreignObject x="385" y="393.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="X"></div></foreignObject>
<foreignObject x="466" y="329.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject>
<rect x="512" y="322" width="46" height="52" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="512" y1="348" x2="558" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="450" y="293.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1=2\times 1"></div></foreignObject>
<foreignObject x="500" y="371.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="\mathbf{w}"></div></foreignObject>
<foreignObject x="544" y="329.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject>
<rect x="590" y="336" width="44" height="26" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="577" y="359.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="b"></div></foreignObject>
<foreignObject x="620" y="329.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
<rect x="666" y="300" width="44" height="96" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="666" y1="324" x2="710" y2="324" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="666" y1="348" x2="710" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="666" y1="372" x2="710" y2="372" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="628" y="257.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1"></div></foreignObject><foreignObject x="628" y="273.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 1"></div></foreignObject>
<foreignObject x="653" y="393.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="z"></div></foreignObject>
<line x1="716" y1="348" x2="748" y2="348" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#mx-arw)"/>
<foreignObject x="702" y="305.72" width="60" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="\sigma"></div></foreignObject>
<rect x="760" y="300" width="44" height="96" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="760" y1="324" x2="804" y2="324" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="760" y1="348" x2="804" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="760" y1="372" x2="804" y2="372" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="722" y="257.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1"></div></foreignObject><foreignObject x="722" y="273.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 1"></div></foreignObject>
<foreignObject x="747" y="393.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="\hat{\mathbf{y}}"></div></foreignObject>
<text x="860" y="340" class="cap" text-anchor="middle">весь батч</text>
<text x="860" y="364" class="cap" text-anchor="middle">одной строкой</text>
</g>
<text x="40" y="496" class="legend" text-anchor="start">синее: данные · тёмно-жёлтое: обучаемые числа · зелёное: результат</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="nrn mm1" data-focus="nrn">
      <div class="step-kicker">Шаг 1 · что не так с записью по индексам</div>
      <h4>Она растёт вместе с числом признаков</h4>
<p>При двух признаках сумму видно целиком. При тридцати её приходится обрывать многоточием, при тысяче формула перестаёт что-либо сообщать.</p>
<p><div class="math-display" data-tex="z = x_1w_1 + x_2w_2 + \dots + x_Pw_P + b"></div></p>
    </div>
    <div class="step-panel" data-on="nrn row mm1" data-focus="row">
      <div class="step-kicker">Шаг 2 · признаки в строку</div>
      <h4>Один объект: строка из <span class="math-inline" data-tex="P"></span> чисел</h4>
<p><b>1) <span class="math-inline" data-tex="\mathbf{x} = [x_1\ \ x_2]"></span>.</b> Порядок фиксируется раз и навсегда: первое число всегда часы, второе всегда пропуски.</p>
<p><div class="math-display" data-tex="\mathbf{x} \in \mathbb{R}^{1\times P}\quad(1\times 2)"></div></p>
    </div>
    <div class="step-panel" data-on="nrn row col mm1" data-focus="col">
      <div class="step-kicker">Шаг 3 · веса в столбец</div>
      <h4>Тот же порядок, что у признаков</h4>
<p><b>2) <span class="math-inline" data-tex="\mathbf{w} = [w_1;\ w_2]"></span>.</b> В первой строке столбца стоит вес часов, во второй вес пропусков. Именно это соответствие превращает сумму в одну операцию.</p>
<p><div class="math-display" data-tex="\mathbf{w} \in \mathbb{R}^{P\times 1}\quad(2\times 1)"></div></p>
    </div>
    <div class="step-panel" data-on="row col mul mm1 mm2" data-focus="mul">
      <div class="step-kicker">Шаг 4 · строка на столбец</div>
      <h4>Внутренние размеры совпали</h4>
<p><b>3) <span class="math-inline" data-tex="z = \mathbf{x}\cdot \mathbf{w} + b"></span>.</b> Строка проходит по столбцу: элементы с одинаковым номером перемножаются, результаты складываются. Это ровно та же сумма, что была на шаге 1.</p>
<p><div class="math-display" data-tex="\mathbf{x}\mathbf{w} + b = \sum_{p=1}^{P} x_p w_p + b \qquad [1\times P]\cdot[P\times 1] \rightarrow [1\times 1]"></div></p><p>Результат имеет форму <span class="math-inline" data-tex="1 \times  1"></span>, то есть это обычное число. Пока всё в точности как у линейной регрессии.</p>
    </div>
    <div class="step-panel" data-on="mul sg mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида</div>
      <h4>Форму не меняет, потому что работает поклеточно</h4>
<p><b>4) <span class="math-inline" data-tex="\hat y = \sigma(z)"></span>.</b> Сигмоида работает с одним числом. К матрице её применяют поэлементно: сколько было клеток, столько и осталось, каждая независимо от соседей.</p>
<p><div class="math-display" data-tex="\sigma\bigl(X\mathbf{w} + b\bigr)_n = \sigma(z_n)"></div></p><p>Это важно для обратного прохода: раз клетки не перемешиваются, производная сигмоиды тоже будет поклеточной.</p>
    </div>
    <div class="step-panel" data-on="sg bat mm3" data-focus="bat">
      <div class="step-kicker">Шаг 6 · весь батч сразу</div>
      <h4>Строки складываются друг под друга</h4>
<p>Если поставить студентов строками в матрицу <span class="math-inline" data-tex="X"></span>, та же операция сделает все предсказания за один раз. Столбец весов при этом остаётся один: модель общая для всех.</p>
<p><div class="math-display" data-tex="\begin{gathered}\hat{\mathbf{y}} = \sigma(X\mathbf{w} + b)\\[4pt] [N\times P]\cdot[P\times 1] \rightarrow [N\times 1]\qquad [4\times 2]\cdot[2\times 1] \rightarrow [4\times 1]\end{gathered}"></div></p>
    </div>
    <div class="step-panel" data-on="bat mm3" data-focus="bat">
      <div class="step-kicker">Шаг 7 · зачем это нужно</div>
      <h4>Одна строка кода вместо цикла</h4>
<p>В коде это буквально <code>sigmoid(X @ w + b)</code>, без единого цикла по объектам и без индексов. Библиотеки линейной алгебры выполняют такое умножение на порядки быстрее, чем цикл на Python.</p>
<p>И главное: дальше в статье все формулы прямого и обратного прохода записаны в этой форме. Индексы больше не понадобятся.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> матричная запись вводит соглашение о формах, а не новую математику. Она считает ту же сумму, не удлиняется с ростом числа признаков и позволяет
  обработать весь батч без единого цикла, а поэлементная сигмоида не мешает ей ни в чём.
</div>

---

## Часть 5. Прямой проход одного объекта

<p>
  Дальше две части подряд без единого числа. Это сделано намеренно: пока в клетках стоят
  символы, видно устройство операции, а не арифметика. Числа подставим в части 7, по той же
  схеме и в том же порядке.
</p>

<p>
  Начнём с одного студента. На входе строка из двух чисел и столбец той же длины, на выходе одна клетка, которую сигмоида превращает в вероятность. Вся операция целиком укладывается
  в правило «строка идёт по столбцу» плюс одну функцию.
</p>

<p>Посмотрим пошагово, как строка признаков превращается в вероятность.</p>

<div class="stage" id="stageF1" tabindex="0">
  <div class="stage-figure">
<svg id="f1" viewBox="0 0 960 470" role="img" aria-label="Прямой проход одного объекта в формах">
  <style>
    #f1 { font-family: Helvetica, Arial, sans-serif; }
    #f1 .lbl { font-size: 16px; fill: #111111; }
    #f1 .cap { font-size: 13px; fill: #5E5850; }
    #f1 .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #f1 .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #f1 .val { font-size: 14px; fill: #111111; }
    #f1 .mm  { font-size: 12px; fill: #5E5850; }
    #f1 .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="f1-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="f1-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="f1-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="\mathbf{w},\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="z"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat y"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">формы и формулы · значений здесь нет, они будут в части 7</text>
<g data-key="x">
<rect x="60" y="130" width="130" height="46" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="125" y1="130" x2="125" y2="176" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="40" y="101.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="1\times P=1\times 2"></div></foreignObject>
<foreignObject x="90" y="173.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="\mathbf{x}"></div></foreignObject>
</g>
<g data-key="w">
<foreignObject x="182" y="135.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject>
<rect x="234" y="108" width="46" height="90" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="234" y1="153" x2="280" y2="153" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="172" y="79.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1=2\times 1"></div></foreignObject>
<foreignObject x="222" y="195.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="\mathbf{w}"></div></foreignObject>
</g>
<g data-key="bb">
<foreignObject x="276" y="135.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject>
<rect x="328" y="130" width="46" height="46" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="316" y="173.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="b"></div></foreignObject>
</g>
<g data-key="z">
<foreignObject x="370" y="135.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
<rect x="422" y="130" width="46" height="46" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="360" y="101.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="1\times 1"></div></foreignObject>
<foreignObject x="410" y="173.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="z"></div></foreignObject>
</g>
<g data-key="sg">
<line x1="476" y1="153" x2="508" y2="153" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#f1-arw)"/>
<foreignObject x="462" y="110.72" width="60" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="\sigma"></div></foreignObject>
<rect x="520" y="130" width="46" height="46" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="458" y="101.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="1\times 1"></div></foreignObject>
<foreignObject x="508" y="173.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="\hat y"></div></foreignObject>
</g>
<g data-key="cmp" data-only="1">
<rect x="520" y="250" width="46" height="46" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="508" y="293.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="y"></div></foreignObject>
<foreignObject x="574" y="261.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#111111;font-weight:400" data-tex="1\times 1"></div></foreignObject>
<line x1="557" y1="248" x2="557" y2="184" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#f1-arw)"/>
<line x1="576" y1="153" x2="612" y2="153" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#f1-arr)"/>
<rect x="626" y="122" width="290" height="70" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="536.5" y="126.6" width="469" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\ell = -[y\ln\hat y + (1-y)\ln(1-\hat y)]"></div></foreignObject>
<text x="771" y="176" class="cap" text-anchor="middle">одно число, как и предсказание</text>
</g>
<g data-key="cell" data-only="1">
<rect x="60" y="130" width="130" height="46" fill="#C30B0A" opacity="0.12"/>
<rect x="60" y="130" width="130" height="46" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="234" y="108" width="46" height="90" fill="#C30B0A" opacity="0.12"/>
<rect x="234" y="108" width="46" height="90" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="422" y="130" width="46" height="46" fill="#C30B0A" opacity="0.14"/>
<rect x="422" y="130" width="46" height="46" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<text x="264" y="256" class="cap" text-anchor="middle">малиновым выделены строка, столбец и клетка, которая из них получается</text>
</g>
<g data-key="shp" data-only="1">
<rect x="60" y="316" width="840" height="128" rx="12" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/>
<text x="78" y="342" class="cap" text-anchor="start">ПРАВИЛО ФОРМ</text>
<text x="78" y="372" class="val" text-anchor="start">внутренние размеры обязаны совпасть и сокращаются, внешние дают форму результата</text>
<foreignObject x="78" y="378.16" width="862" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#111111;font-weight:400" ><span><span data-tex="[1 \times  P] \cdot  [P \times  1] = [1 \times  1]"></span>, при <span data-tex="P = 2"></span>: <span data-tex="[1 \times  2] \cdot  [2 \times  1] = [1 \times  1]"></span></span></div></foreignObject>
<text x="78" y="428" class="val" text-anchor="start">сигмоида, сложение и вычитание форму не меняют</text>
</g>
<text x="40" y="456" class="legend" text-anchor="start">синее: данные · тёмно-жёлтое: обучаемые числа · зелёное: результат · красное: потеря</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="x mm0" data-focus="x">
      <div class="step-kicker">Шаг 1 · один объект</div>
      <h4>Строка из двух чисел</h4>
<p>Один студент лежит строкой: сначала часы, потом пропуски. Его форма <span class="math-inline" data-tex="1 \times  P"></span>, в нашем примере <span class="math-inline" data-tex="1 \times  2"></span>.</p>
<p><div class="math-display" data-tex="\mathbf{x} \in \mathbb{R}^{1\times P}\quad(1\times 2)"></div></p>
    </div>
    <div class="step-panel" data-on="x w mm1" data-focus="w">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>Столбец той же длины</h4>
<p>Веса живут отдельно от данных: они одни и те же для всех студентов и меняются только во время обучения. Тёмная заливка на схемах означает ровно это.</p>
<p><div class="math-display" data-tex="\mathbf{w} \in \mathbb{R}^{P\times 1}\quad(2\times 1)"></div></p>
    </div>
    <div class="step-panel" data-on="x w z cell mm2" data-focus="cell">
      <div class="step-kicker">Шаг 3 · строка на столбец</div>
      <h4>Два произведения складываются в одну клетку</h4>
<p>Внутренние размеры <span class="math-inline" data-tex="P = 2"></span> встречаются и сокращаются, остаётся <span class="math-inline" data-tex="[1 \times  1]"></span>: после умножения от студента остаётся одно число.</p>
<p><div class="math-display" data-tex="\begin{gathered}\mathbf{x}\mathbf{w} = x_1w_1 + x_2w_2\\[4pt] [1\times P]\cdot[P\times 1] \rightarrow [1\times 1]\qquad [1\times 2]\cdot[2\times 1] \rightarrow [1\times 1]\end{gathered}"></div></p>
    </div>
    <div class="step-panel" data-on="x w bb z mm2" data-focus="bb z">
      <div class="step-kicker">Шаг 4 · сдвиг и логит</div>
      <h4>Bias прибавляется к готовому числу</h4>
<p>Сдвиг не связан ни с одним признаком. Результат называется логитом: это ещё не вероятность, а произвольное вещественное число.</p>
<p><div class="math-display" data-tex="z = \mathbf{x}\mathbf{w} + b"></div></p>
    </div>
    <div class="step-panel" data-on="z sg mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида</div>
      <h4>Логит становится вероятностью</h4>
<p>Одна клетка на входе, одна на выходе: форма не меняется. Меняется диапазон: любое <span class="math-inline" data-tex="z"></span> превращается в число строго между нулём и единицей.</p>
<p><div class="math-display" data-tex="\hat y = \sigma(z) = \frac{1}{1 + e^{-z}}"></div></p>
    </div>
    <div class="step-panel" data-on="sg cmp mm4" data-focus="cmp">
      <div class="step-kicker">Шаг 6 · потеря</div>
      <h4>Сравнение с меткой даёт скаляр</h4>
<p>Настоящая метка тоже одно число, но всего из двух возможных. Потеря смотрит, какую вероятность модель дала верному варианту, и берёт минус логарифм.</p>
<p><div class="math-display" data-tex="\ell = -\bigl[y\ln\hat y + (1-y)\ln(1-\hat y)\bigr]"></div></p><p>Если модель угадала уверенно, логарифм близок к нулю. Если уверенно ошиблась, он улетает вверх без предела.</p>
    </div>
    <div class="step-panel" data-on="x w z sg shp" data-focus="shp">
      <div class="step-kicker">Шаг 7 · что отсюда следует</div>
      <h4>Форма ответа не зависит от числа признаков</h4>
<p>Сколько бы столбцов ни было в таблице, произведение строки на столбец даёт одну клетку, а сигмоида её не меняет. Поэтому одна и та же строка кода работает и для двух признаков, и для двухсот.</p>
<p>Проверка форм самая дешёвая диагностика: почти все ошибки в коде линейной модели это перепутанные размерности, и ловятся они на бумаге за минуту.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<table class="shape-table">
  <tr><th>Обозначение</th><th>Что это</th><th>Форма</th><th>В примере</th></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf{x}"></span></td><td>признаки одного студента</td><td><span class="math-inline" data-tex="1\times P"></span></td><td><span class="math-inline" data-tex="1 \times  2"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf{w}"></span></td><td>по одному весу на признак</td><td><span class="math-inline" data-tex="P\times 1"></span></td><td><span class="math-inline" data-tex="2 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="b"></span></td><td>сдвиг</td><td><span class="math-inline" data-tex="1 \times  1"></span></td><td><span class="math-inline" data-tex="1 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="z = \mathbf{x}\mathbf{w} + b"></span></td><td>логит</td><td><span class="math-inline" data-tex="1 \times  1"></span></td><td><span class="math-inline" data-tex="1 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="\hat y = \sigma(z)"></span></td><td>вероятность</td><td><span class="math-inline" data-tex="1 \times  1"></span></td><td><span class="math-inline" data-tex="1 \times  1"></span></td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> форма ответа не зависит ни от числа признаков, ни от
  сигмоиды. Произведение строки на столбец даёт одну клетку, поэлементная функция её сохраняет, поэтому одна и та же строка кода работает и для двух признаков, и для двухсот.
</div>

---

## Часть 6. Прямой проход батча

<p>
  Считать студентов по одному незачем: та же операция выполняется для всех строк сразу. Матрица
  <span class="math-inline" data-tex="X"></span> просто складывает объекты друг под друга,
  веса остаются те же самые, и на выходе получается столбец вероятностей той же высоты,
  что и батч.
</p>

<p>
  Заодно доведём цепочку до конца: сравним вероятности с метками и свернём всё в одно число.
  Потеря считается на прямом проходе, отдельной процедуры для неё нет.
</p>

<div class="callout-blue">
  <strong>Где формы не совпадают буквально:</strong> сдвиг один, а прибавляем мы его к столбцу <span class="math-inline" data-tex="N\times 1"></span>, в примере <span class="math-inline" data-tex="4\times 1"></span>. Он размножается по всем
  строкам, и в numpy это делает broadcasting. Место стоит запомнить: на обратном проходе
  размножение обернётся суммированием, и это единственная неочевидная деталь во всём выводе.
</div>

<p>Посмотрим пошагово, как батч превращается в потерю.</p>

<div class="stage" id="stageFB" tabindex="0">
  <div class="stage-figure">
<svg id="fb" viewBox="0 0 960 500" role="img" aria-label="Прямой проход батча в формах">
  <style>
    #fb { font-family: Helvetica, Arial, sans-serif; }
    #fb .lbl { font-size: 16px; fill: #111111; }
    #fb .cap { font-size: 13px; fill: #5E5850; }
    #fb .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #fb .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #fb .val { font-size: 14px; fill: #111111; }
    #fb .mm  { font-size: 12px; fill: #5E5850; }
    #fb .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="fb-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="fb-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="fb-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="\mathbf{w},\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="\mathbf{z}"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat{\mathbf{y}}"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">та же операция для всех четырёх студентов сразу</text>
<g data-key="X">
<rect x="40" y="120" width="110" height="140" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="95" y1="120" x2="95" y2="260" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="155" x2="150" y2="155" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="190" x2="150" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="40" y1="225" x2="150" y2="225" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="35" y="77.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times P"></div></foreignObject><foreignObject x="35" y="93.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 2"></div></foreignObject>
<foreignObject x="60" y="257.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="X"></div></foreignObject>
</g>
<g data-key="w">
<foreignObject x="138" y="171.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject>
<rect x="188" y="155" width="46" height="70" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<line x1="188" y1="190" x2="234" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="151" y="112.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1"></div></foreignObject><foreignObject x="151" y="128.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="2\times 1"></div></foreignObject>
<foreignObject x="176" y="222.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="\mathbf{w}"></div></foreignObject>
</g>
<g data-key="bb">
<foreignObject x="226" y="171.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject>
<rect x="276" y="173" width="46" height="34" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
<foreignObject x="264" y="204.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="b"></div></foreignObject>
</g>
<g data-key="zc">
<foreignObject x="314" y="171.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
<rect x="364" y="120" width="46" height="140" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="364" y1="155" x2="410" y2="155" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="364" y1="190" x2="410" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="364" y1="225" x2="410" y2="225" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="327" y="77.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1"></div></foreignObject><foreignObject x="327" y="93.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 1"></div></foreignObject>
<foreignObject x="352" y="257.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="\mathbf{z}"></div></foreignObject>
</g>
<g data-key="sg">
<line x1="418" y1="190" x2="452" y2="190" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#fb-arw)"/>
<foreignObject x="405" y="147.72" width="60" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="\sigma"></div></foreignObject>
<rect x="464" y="120" width="46" height="140" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="464" y1="155" x2="510" y2="155" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="464" y1="190" x2="510" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="464" y1="225" x2="510" y2="225" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="427" y="77.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1"></div></foreignObject><foreignObject x="427" y="93.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 1"></div></foreignObject>
<foreignObject x="452" y="257.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="\hat{\mathbf{y}}"></div></foreignObject>
</g>
<g data-key="y">
<rect x="556" y="120" width="46" height="140" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="556" y1="155" x2="602" y2="155" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="556" y1="190" x2="602" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="556" y1="225" x2="602" y2="225" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="519" y="77.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1"></div></foreignObject><foreignObject x="519" y="93.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 1"></div></foreignObject>
<foreignObject x="544" y="257.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="\mathbf{y}"></div></foreignObject>
<text x="579" y="308" class="cap" text-anchor="middle">нули и единицы</text>
</g>
<g data-key="L">
<line x1="518" y1="190" x2="546" y2="190" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#fb-arw)"/>
<line x1="610" y1="190" x2="646" y2="190" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#fb-arr)"/>
<rect x="660" y="150" width="250" height="80" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="750" y="155.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:700" data-tex="L"></div></foreignObject>
<foreignObject x="575" y="185.72" width="420" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>среднее <span data-tex="-\ln "></span> вероятности,</span></div></foreignObject>
<text x="785" y="224" class="cap" text-anchor="middle">которую дали правде</text>
</g>
<g data-key="row" data-only="1">
<rect x="40" y="155" width="110" height="35" fill="#C30B0A" opacity="0.12"/>
<rect x="40" y="155" width="110" height="35" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="188" y="155" width="46" height="70" fill="#C30B0A" opacity="0.12"/>
<rect x="188" y="155" width="46" height="70" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="364" y="155" width="46" height="35" fill="#C30B0A" opacity="0.14"/>
<rect x="364" y="155" width="46" height="35" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="464" y="155" width="46" height="35" fill="#C30B0A" opacity="0.14"/>
<rect x="464" y="155" width="46" height="35" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<foreignObject x="10" y="279.72" width="420" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>вторая строка <span data-tex="X"></span> встречается с тем же столбцом <span data-tex="\mathbf{w}"></span></span></div></foreignObject>
</g>
<g data-key="note" data-only="1">
<rect x="60" y="330" width="840" height="96" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/>
<text x="78" y="356" class="cap" text-anchor="start">ГДЕ ФОРМЫ НЕ СОВПАДАЮТ БУКВАЛЬНО</text>
<foreignObject x="78" y="364.16" width="862" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#111111;font-weight:400" ><span><span data-tex="b"></span>: одно число, а прибавляется к столбцу <span data-tex="4 \times  1"></span>, поэтому размножается по всем строкам</span></div></foreignObject>
<text x="78" y="414" class="val" text-anchor="start">на обратном проходе это размножение обернётся суммированием</text>
</g>
<text x="40" y="480" class="legend" text-anchor="start">синее: данные · тёмно-жёлтое: обучаемые числа · зелёное: логиты и вероятности · красное: потеря</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="X mm0" data-focus="X">
      <div class="step-kicker">Шаг 1 · батч</div>
      <h4>Студенты складываются друг под друга</h4>
<p>Строк столько, сколько студентов, а столбцов столько, сколько признаков. Порядок столбцов тот же, что был у одного объекта.</p>
<p><div class="math-display" data-tex="X \in \mathbb{R}^{N\times P}\quad(4\times 2)"></div></p>
    </div>
    <div class="step-panel" data-on="X w mm1" data-focus="w">
      <div class="step-kicker">Шаг 2 · веса те же самые</div>
      <h4>Модель одна на весь батч</h4>
<p>Веса не размножаются по строкам: столбец <span class="math-inline" data-tex="\mathbf{w}"></span> ровно один. Именно поэтому обучение на батче ищет общую закономерность, а не подгоняет каждого студента отдельно.</p>
    </div>
    <div class="step-panel" data-on="X w zc row mm2" data-focus="row">
      <div class="step-kicker">Шаг 3 · строка за строкой</div>
      <h4>Каждая строка <span class="math-inline" data-tex="X"></span> даёт свою клетку <span class="math-inline" data-tex="\mathbf{z}"></span></h4>
<p>Это тот же forward одного объекта, повторённый четыре раза. Внутренние размеры <span class="math-inline" data-tex="P = 2"></span> сходятся, поэтому результат получается столбцом высоты <span class="math-inline" data-tex="N = 4"></span>.</p>
<p><div class="math-display" data-tex="[N\times P]\cdot[P\times 1] \rightarrow [N\times 1]\qquad [4\times 2]\cdot[2\times 1] \rightarrow [4\times 1]"></div></p>
    </div>
    <div class="step-panel" data-on="X w bb zc note mm2" data-focus="bb note">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4>Одно число прибавляется ко всем строкам</h4>
<p>Формально это <span class="math-inline" data-tex="b\mathbf{1}_N"></span>, то есть столбец из <span class="math-inline" data-tex="N"></span> одинаковых значений. В коде то же самое делает broadcasting, и это единственное место во всём прямом проходе, где формы не совпадают буквально.</p>
<p><div class="math-display" data-tex="\mathbf{z} = X\mathbf{w} + b\mathbf{1}_N"></div></p>
    </div>
    <div class="step-panel" data-on="zc sg mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида поэлементно</div>
      <h4>Столбец логитов становится столбцом вероятностей</h4>
<p>Клетка за клеткой, независимо друг от друга. Форма сохраняется: <span class="math-inline" data-tex="N \times  1"></span> на входе, <span class="math-inline" data-tex="N \times  1"></span> на выходе, в примере <span class="math-inline" data-tex="4 \times  1"></span>.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} = \sigma(\mathbf{z}) \in \mathbb{R}^{N\times 1}\quad(4\times 1)"></div></p><p>Обратите внимание, что клетки не смешиваются между собой. У softmax это не так, и обратный проход у него сложнее.</p>
    </div>
    <div class="step-panel" data-on="sg y mm3" data-focus="y">
      <div class="step-kicker">Шаг 6 · метки</div>
      <h4>Столбец из нулей и единиц</h4>
<p>Настоящие исходы лежат столбцом той же высоты. Никаких промежуточных значений: студент либо сдал, либо нет.</p>
<p>Формы <span class="math-inline" data-tex="\hat{\mathbf{y}}"></span> и <span class="math-inline" data-tex="\mathbf{y}"></span> совпадают буквально, поэтому дальше их можно сравнивать клетка в клетку.</p>
    </div>
    <div class="step-panel" data-on="sg y L mm4" data-focus="L">
      <div class="step-kicker">Шаг 7 · потеря</div>
      <h4>Столбец схлопывается в скаляр</h4>
<p>По каждой строке берём логарифм вероятности верного ответа, ставим минус и усредняем по батчу. Деление на <span class="math-inline" data-tex="N"></span> делает потерю сравнимой между батчами разного размера.</p>
<p><div class="math-display" data-tex="\begin{gathered}L = -\frac{1}{N}\sum_{n=1}^{N}\bigl[y_n\ln\hat y_n + (1-y_n)\ln(1-\hat y_n)\bigr]\\[4pt] [N\times 1] \rightarrow [1\times 1]\qquad [4\times 1] \rightarrow [1\times 1]\end{gathered}"></div></p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<table class="shape-table">
  <tr><th>Обозначение</th><th>Что это</th><th>Форма</th><th>В примере</th></tr>
  <tr><td><span class="math-inline" data-tex="X"></span></td><td>признаки батча</td><td><span class="math-inline" data-tex="N \times  P"></span></td><td><span class="math-inline" data-tex="4 \times  2"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf{w}"></span></td><td>веса, по одному на признак</td><td><span class="math-inline" data-tex="P \times  1"></span></td><td><span class="math-inline" data-tex="2 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="b"></span></td><td>сдвиг, размножается по строкам</td><td><span class="math-inline" data-tex="1 \times  1"></span></td><td><span class="math-inline" data-tex="1 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="\mathbf{z}"></span></td><td>логиты</td><td><span class="math-inline" data-tex="N \times  1"></span></td><td><span class="math-inline" data-tex="4 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="\hat{\mathbf{y}},\  \mathbf{y}"></span></td><td>вероятности и метки</td><td><span class="math-inline" data-tex="N \times  1"></span></td><td><span class="math-inline" data-tex="4 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="L"></span></td><td>потеря</td><td><span class="math-inline" data-tex="1 \times  1"></span></td><td><span class="math-inline" data-tex="1 \times  1"></span></td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> батч не добавляет ни одной новой операции. Он добавляет
  только ось объектов, и она проходит через всю цепочку насквозь: <span class="math-inline" data-tex="N = 4"></span> строки на входе,
  <span class="math-inline" data-tex="N = 4"></span> вероятности на выходе, и лишь последний шаг схлопывает их в скаляр. Ось признаков <span class="math-inline" data-tex="P = 2"></span>
  исчезает при первом же умножении на <span class="math-inline" data-tex="\mathbf{w}"></span>.
</div>

---

## Часть 7. Подставляем числа

<p>
  Схема та же, что в части 6, клетки те же. Меняется одно: вместо символов появляются числа
  наших четырёх студентов, и каждый шаг можно пересчитать на калькуляторе.
</p>

<pre><code>def forward(X, w, b, y):
    z    = X @ w + b                    # [4,2]·[2,1] → [4,1]
    yhat = 1 / (1 + np.exp(-z))         # поэлементно
    L    = -np.mean(y * np.log(yhat) + (1 - y) * np.log(1 - yhat))
    return z, yhat, L</code></pre>

<p>Посмотрим пошагово, что за числа получаются на прямом проходе.</p>

<div class="stage" id="stageFX" tabindex="0">
  <div class="stage-figure">
<svg id="fx" viewBox="0 0 960 430" role="img" aria-label="Прямой проход батча с подставленными числами">
  <style>
    #fx { font-family: Helvetica, Arial, sans-serif; }
    #fx .lbl { font-size: 16px; fill: #111111; }
    #fx .cap { font-size: 13px; fill: #5E5850; }
    #fx .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #fx .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #fx .val { font-size: 14px; fill: #111111; }
    #fx .mm  { font-size: 12px; fill: #5E5850; }
    #fx .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="fx-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="fx-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="fx-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="\mathbf{w},\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="\mathbf{z}"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat{\mathbf{y}}"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">та же схема, что в части 6 · красной рамкой обведено то, что считаем руками</text>
<g data-key="X">
<rect x="44" y="104" width="120" height="132" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="104" y1="104" x2="104" y2="236" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="44" y1="137" x2="164" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="44" y1="170" x2="164" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="44" y1="203" x2="164" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="74" y="125.5" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="134" y="125.5" text-anchor="middle" font-size="14" fill="#111111">0,5</text>
<text x="74" y="158.5" text-anchor="middle" font-size="14" fill="#111111">4,0</text>
<text x="134" y="158.5" text-anchor="middle" font-size="14" fill="#111111">0,2</text>
<text x="74" y="191.5" text-anchor="middle" font-size="14" fill="#111111">3,0</text>
<text x="134" y="191.5" text-anchor="middle" font-size="14" fill="#111111">1,0</text>
<text x="74" y="224.5" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="134" y="224.5" text-anchor="middle" font-size="14" fill="#111111">0,9</text>
<foreignObject x="44" y="61.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times P"></div></foreignObject><foreignObject x="44" y="77.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 2"></div></foreignObject>
<foreignObject x="69" y="233.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="X"></div></foreignObject>
</g>
<g data-key="w">
<foreignObject x="158" y="151.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject>
<rect x="210" y="126" width="62" height="88" rx="2" fill="#C29E08" opacity="0.45" stroke="#ffffff" stroke-width="1"/>
<line x1="210" y1="170" x2="272" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="241" y="153" text-anchor="middle" font-size="14" fill="#111111">0,8</text>
<text x="241" y="197" text-anchor="middle" font-size="14" fill="#111111">−1,0</text>
<foreignObject x="181" y="83.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1"></div></foreignObject><foreignObject x="181" y="99.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="2\times 1"></div></foreignObject>
<foreignObject x="206" y="211.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="\mathbf{w}"></div></foreignObject>
</g>
<g data-key="bb">
<foreignObject x="264" y="151.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject>
<rect x="316" y="156" width="56" height="34" rx="2" fill="#C29E08" opacity="0.45" stroke="#ffffff" stroke-width="1"/>
<text x="344" y="178" text-anchor="middle" font-size="14" fill="#111111">−2,0</text>
<foreignObject x="309" y="187.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="b"></div></foreignObject>
</g>
<g data-key="zc">
<foreignObject x="366" y="151.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
<rect x="418" y="104" width="62" height="132" rx="2" fill="#73B222" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="418" y1="137" x2="480" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="418" y1="170" x2="480" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="418" y1="203" x2="480" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="449" y="125.5" text-anchor="middle" font-size="14" fill="#111111">−0,9</text>
<text x="449" y="158.5" text-anchor="middle" font-size="14" fill="#111111">1,0</text>
<text x="449" y="191.5" text-anchor="middle" font-size="14" fill="#111111">−0,6</text>
<text x="449" y="224.5" text-anchor="middle" font-size="14" fill="#111111">−1,3</text>
<foreignObject x="389" y="61.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1"></div></foreignObject><foreignObject x="389" y="77.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 1"></div></foreignObject>
<foreignObject x="414" y="233.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="\mathbf{z}"></div></foreignObject>
</g>
<g data-key="sg">
<line x1="490" y1="170" x2="522" y2="170" stroke="#5E5850" stroke-width="1.6" fill="none" marker-end="url(#fx-arw)"/>
<foreignObject x="476" y="129.72" width="60" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="\sigma"></div></foreignObject>
<rect x="534" y="104" width="84" height="132" rx="2" fill="#73B222" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="534" y1="137" x2="618" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="534" y1="170" x2="618" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="534" y1="203" x2="618" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="576" y="125.5" text-anchor="middle" font-size="14" fill="#111111">0,2891</text>
<text x="576" y="158.5" text-anchor="middle" font-size="14" fill="#111111">0,7311</text>
<text x="576" y="191.5" text-anchor="middle" font-size="14" fill="#111111">0,3543</text>
<text x="576" y="224.5" text-anchor="middle" font-size="14" fill="#111111">0,2142</text>
<foreignObject x="516" y="61.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1"></div></foreignObject><foreignObject x="516" y="77.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 1"></div></foreignObject>
<foreignObject x="541" y="233.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5F9420;font-weight:700" data-tex="\hat{\mathbf{y}}"></div></foreignObject>
</g>
<g data-key="y">
<rect x="646" y="104" width="46" height="132" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="646" y1="137" x2="692" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="646" y1="170" x2="692" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="646" y1="203" x2="692" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="669" y="125.5" text-anchor="middle" font-size="14" fill="#111111">0</text>
<text x="669" y="158.5" text-anchor="middle" font-size="14" fill="#111111">1</text>
<text x="669" y="191.5" text-anchor="middle" font-size="14" fill="#111111">0</text>
<text x="669" y="224.5" text-anchor="middle" font-size="14" fill="#111111">1</text>
<foreignObject x="609" y="61.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1"></div></foreignObject><foreignObject x="609" y="77.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 1"></div></foreignObject>
<foreignObject x="634" y="233.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="\mathbf{y}"></div></foreignObject>
</g>
<g data-key="li" data-only="1">
<rect x="724" y="104" width="84" height="132" rx="2" fill="#C30B0A" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="724" y1="137" x2="808" y2="137" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="724" y1="170" x2="808" y2="170" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="724" y1="203" x2="808" y2="203" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="766" y="125.5" text-anchor="middle" font-size="14" fill="#111111">0,3412</text>
<text x="766" y="158.5" text-anchor="middle" font-size="14" fill="#111111">0,3133</text>
<text x="766" y="191.5" text-anchor="middle" font-size="14" fill="#111111">0,4375</text>
<text x="766" y="224.5" text-anchor="middle" font-size="14" fill="#111111">1,5410</text>
<foreignObject x="706" y="61.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1"></div></foreignObject><foreignObject x="706" y="77.32" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4\times 1"></div></foreignObject>
<foreignObject x="731" y="233.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#9C0908;font-weight:700" data-tex="\ell"></div></foreignObject>
<text x="870" y="150" class="cap" text-anchor="middle">цена</text>
<text x="870" y="168" class="cap" text-anchor="middle">каждого</text>
<text x="870" y="186" class="cap" text-anchor="middle">студента</text>
</g>
<g data-key="hl" data-only="1">
<rect x="44" y="104" width="120" height="33" fill="#C30B0A" opacity="0.12"/>
<rect x="44" y="104" width="120" height="33" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="210" y="126" width="62" height="88" fill="#C30B0A" opacity="0.12"/>
<rect x="210" y="126" width="62" height="88" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="418" y="104" width="62" height="33" fill="#C30B0A" opacity="0.14"/>
<rect x="418" y="104" width="62" height="33" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
</g>
<g data-key="L" data-only="1">
<line x1="600" y1="300" x2="648" y2="300" stroke="#C30B0A" stroke-width="2" fill="none" marker-end="url(#fx-arr)"/>
<rect x="662" y="270" width="248" height="62" rx="10" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="701" y="274.48" width="170" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:700" data-tex="L = 0{,}6582"></div></foreignObject>
<text x="786" y="323" class="cap" text-anchor="middle">потеря батча</text>
<text x="330" y="300" class="cap" text-anchor="middle">сумма четырёх цен, делённая на четыре</text>
</g>
<text x="40" y="396" class="legend" text-anchor="start">все числа получены из этих четырёх студентов и округлены до четвёртого знака</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="X mm0" data-focus="X">
      <div class="step-kicker">Шаг 1 · данные</div>
      <h4>Четыре студента и два признака</h4>
<p><b>Дано.</b> Четыре студента: 20 часов подготовки при 5 пропусках, 40 часов при 2 пропусках, 30 часов при 10 пропусках и 20 часов при 9 пропусках.</p>
<p><div class="math-display" data-tex="X = \begin{bmatrix}2{,}0 &amp; 0{,}5\\4{,}0 &amp; 0{,}2\\3{,}0 &amp; 1{,}0\\2{,}0 &amp; 0{,}9\end{bmatrix} \in \mathbb{R}^{4\times 2}"></div></p><p>Настоящие исходы: не сдал, сдал, не сдал, сдал.</p>
    </div>
    <div class="step-panel" data-on="X w bb mm1" data-focus="w bb">
      <div class="step-kicker">Шаг 2 · веса</div>
      <h4>Разумная догадка, не подобранная</h4>
<p><b>Текущие параметры.</b> Пока это просто разумная догадка: десять часов подготовки прибавляют 0,8 к логиту, десять пропусков отнимают 1,0, базовый уровень −2,0.</p>
<p><div class="math-display" data-tex="\mathbf{w} = (0{,}8;\ -1{,}0)^\top \in \mathbb{R}^{2\times 1}, \qquad b = -2{,}0"></div></p>
    </div>
    <div class="step-panel" data-on="X w hl mm2" data-focus="hl">
      <div class="step-kicker">Шаг 3 · строка на столбец</div>
      <h4>Два произведения для первого студента</h4>
<p><b>Первая строка.</b> Малиновым выделено ровно то, что участвует: первая строка <span class="math-inline" data-tex="X"></span>, весь столбец <span class="math-inline" data-tex="\mathbf{w}"></span> и клетка, куда попадёт результат.</p>
<p><div class="math-display" data-tex="2{,}0\cdot 0{,}8 + 0{,}5\cdot(-1{,}0) = 1{,}6 - 0{,}5 = 1{,}1"></div></p>
    </div>
    <div class="step-panel" data-on="X w bb zc mm2" data-focus="zc">
      <div class="step-kicker">Шаг 4 · сдвиг и логиты</div>
      <h4>Логит первого студента равен −0,9</h4>
<p><b>Плюс сдвиг.</b> Одна и та же величина −2,0 ко всем четырём строкам.</p>
<p><div class="math-display" data-tex="z_1 = 1{,}1 - 2{,}0 = -0{,}9, \qquad \mathbf{z} = (-0{,}9;\ 1{,}0;\ -0{,}6;\ -1{,}3)^\top \in \mathbb{R}^{4\times 1}"></div></p><p>Знак логита уже содержит ответ модели: положительный значит «скорее сдаст», отрицательный «скорее нет».</p>
    </div>
    <div class="step-panel" data-on="zc sg mm3" data-focus="sg">
      <div class="step-kicker">Шаг 5 · сигмоида</div>
      <h4>Логиты становятся вероятностями</h4>
<p><b>Четыре независимых применения <span class="math-inline" data-tex="\sigma"></span>.</b> Например, для первого студента.</p>
<p><div class="math-display" data-tex="\hat y_1 = \frac{1}{1 + e^{0{,}9}} = 0{,}2891"></div></p><p>Столбец целиком: 0,2891; 0,7311; 0,3543 и 0,2142. Все четыре числа лежат между нулём и единицей: другого сигмоида выдать не может.</p>
    </div>
    <div class="step-panel" data-on="sg y li mm3 mm4" data-focus="y li">
      <div class="step-kicker">Шаг 6 · цена каждого студента</div>
      <h4>Платим за вероятность, отданную правде</h4>
<p><b>Сравниваем с метками.</b> У первого студента <span class="math-inline" data-tex="y = 0"></span>, значит правде отдана вероятность 1 − 0,2891 = 0,7109, и цена равна <span class="math-inline" data-tex="-\ln 0{,}7109 = 0{,}3412"></span>. У второго <span class="math-inline" data-tex="y = 1"></span> и цена <span class="math-inline" data-tex="-\ln 0{,}7311 = 0{,}3133"></span>.</p>
<p><div class="math-display" data-tex="\boldsymbol{\ell} = (0{,}3412;\ 0{,}3133;\ 0{,}4375;\ 1{,}5410)^\top \in \mathbb{R}^{4\times 1}"></div></p>
    </div>
    <div class="step-panel" data-on="li L mm4" data-focus="L">
      <div class="step-kicker">Шаг 7 · потеря</div>
      <h4>Одно число вместо четырёх</h4>
<p><b>Потеря батча.</b> Среднее четырёх цен.</p>
<p><div class="math-display" data-tex="L = \tfrac{1}{4}(0{,}3412 + 0{,}3133 + 0{,}4375 + 1{,}5410) = 0{,}6582"></div></p><p>Ориентир для сравнения: <span class="math-inline" data-tex="\ln 2 = 0{,}6931"></span>, столько стоит ответ «не знаю, 0,5» на каждом студенте. Мы едва лучше него.</p>
    </div>
    <div class="step-panel" data-on="li L mm4" data-focus="li">
      <div class="step-kicker">Шаг 8 · где спрятана вся потеря</div>
      <h4>Один студент стоит дороже трёх остальных</h4>
<p>Четвёртый студент готовился всего 20 часов и пропустил 9 занятий, но сдал. Модель дала ему 0,2142, и это обошлось в 1,5410 из 2,6329, то есть 58,5 % всей потери батча.</p>
<p>Такова природа log loss: три аккуратных предсказания не компенсируют одну уверенную ошибку. На обратном проходе именно этот студент будет громче всех тянуть веса.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout-red">
  <strong>Осторожно с «модель почти угадала»:</strong> вероятность 0,2142 у студента, который
  на самом деле сдал, выглядит не так уж страшно: всего лишь «скорее нет». Но в log loss она стоит 1,5410, в 3,5–4,9 раза дороже каждого из трёх остальных студентов, и составляет 58,5 % всей потери батча.
  Судить о модели по одному числу вроде «доли верных ответов» нельзя: три студента угаданы,
  а самый сильный сигнал на обратном проходе даст четвёртый.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> в прямом проходе нет ни одной операции сложнее умножения,
  сложения и экспоненты. Все четыре вероятности получены одним и тем же набором из двух весов
  и сдвига, и различаются они только потому, что различаются строки
  <span class="math-inline" data-tex="X"></span>.
</div>

---

## Часть 8. Обратный проход на графе: цепное правило

<p>
  Прямой проход ответил, что предсказывает модель. Обратный отвечает на другой вопрос:
  если увеличить один из трёх параметров на крошечную величину, потеря вырастет или упадёт
  и насколько быстро. Ответ даёт производная, и берётся она по звеньям.
</p>

<p>
  Звеньев теперь три, а не два: между логитом и потерей встала сигмоида. Её производную удобно
  выразить через саму сигмоиду. Запишем
  <span class="math-inline" data-tex="\sigma(z) = (1+e^{-z})^{-1}"></span> и продифференцируем
  как сложную функцию:
</p>

<p><div class="math-display" data-tex="\sigma'(z) = \frac{e^{-z}}{(1+e^{-z})^2} = \frac{1}{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}} = \sigma(z)\bigl(1-\sigma(z)\bigr)"></div></p>

<p>
  Поэтому, чтобы получить производную, ничего заново считать не нужно: достаточно готовой вероятности с прямого прохода. У наших четырёх студентов
  <span class="math-inline" data-tex="\hat y(1-\hat y)"></span> равно 0,2055; 0,1966; 0,2288
  и 0,1683. Все они меньше 0,25, а 0,25 это максимум производной сигмоиды, он достигается при <span class="math-inline" data-tex="z = 0"></span>.
</p>

<div class="callout-blue">
  <strong>Что такое локальная производная:</strong> она зависит только от той операции, которая
  стоит на стрелке, и ничего не знает об остальном графе. У сложения производная равна единице,
  у умножения веса на <span class="math-inline" data-tex="x_1"></span> она равна
  <span class="math-inline" data-tex="x_1"></span>, у сигмоиды
  <span class="math-inline" data-tex="\hat y(1-\hat y)"></span>. Именно поэтому обратный проход
  можно собирать из готовых кусочков, не выводя каждый раз всё заново.
</div>

<p>Посмотрим пошагово, как градиент едет от потери до весов.</p>

<div class="stage" id="stageBG" tabindex="0">
  <div class="stage-figure">
<svg id="bg" viewBox="0 0 960 628" role="img" aria-label="Обратный проход на графе: сигнал ошибки течёт справа налево">
  <style>
    #bg { font-family: Helvetica, Arial, sans-serif; }
    #bg .lbl { font-size: 16px; fill: #111111; }
    #bg .cap { font-size: 13px; fill: #5E5850; }
    #bg .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #bg .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #bg .val { font-size: 14px; fill: #111111; }
    #bg .mm  { font-size: 12px; fill: #5E5850; }
    #bg .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bg-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="bg-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bg-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="bg-ary" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8F7406"/></marker>
    <marker id="bg-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="w,\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="z"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat y"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<text x="480" y="62" class="cap" text-anchor="middle">вперёд считаются числа, назад производные</text>
<g data-key="fw"><line x1="128.1" y1="131.1" x2="320.1" y2="221.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#bg-arw)"/><line x1="131.0" y1="235.0" x2="317.0" y2="235.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#bg-arw)"/><foreignObject x="191.358" y="149.914" width="80" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#8F7406;font-weight:400" data-tex="\cdot\, w_1"></div></foreignObject><foreignObject x="185" y="207" width="80" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#8F7406;font-weight:400" data-tex="\cdot\, w_2"></div></foreignObject><circle cx="100" cy="352" r="30" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="70" y="322" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="b"></div></foreignObject><foreignObject x="40" y="386" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>сдвиг</span></div></foreignObject><line x1="128.1" y1="338.9" x2="320.1" y2="249.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#bg-arw)"/><foreignObject x="211.782" y="294.992" width="40" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject><circle cx="100" cy="118" r="30" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="70" y="88" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><foreignObject x="40" y="152" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>часы</span></div></foreignObject><circle cx="100" cy="235" r="30" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="70" y="205" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><foreignObject x="40" y="269" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>пропуски</span></div></foreignObject><circle cx="350" cy="235" r="30" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="320" y="205" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="z"></div></foreignObject><foreignObject x="290" y="179" width="120" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>логит</span></div></foreignObject><line x1="381.0" y1="235.0" x2="537.0" y2="235.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#bg-arw)"/><foreignObject x="420" y="207" width="80" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#8F7406;font-weight:400" data-tex="\sigma(\cdot)"></div></foreignObject><circle cx="570" cy="235" r="30" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="540" y="205" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\hat y"></div></foreignObject><foreignObject x="500" y="179" width="140" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>вероятность</span></div></foreignObject><line x1="601.0" y1="235.0" x2="757.0" y2="235.0" stroke="#5E5850" stroke-width="1.8" marker-end="url(#bg-arw)"/><foreignObject x="620" y="207" width="120" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" ><span>log loss</span></div></foreignObject><circle cx="790" cy="118" r="30" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="760" y="88" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y"></div></foreignObject><foreignObject x="830" y="108" width="130" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5E5850;font-weight:400" ><span>настоящая метка</span></div></foreignObject><line x1="790.0" y1="149.0" x2="790.0" y2="202.0" stroke="#3576C0" stroke-width="1.8" marker-end="url(#bg-arb)"/><circle cx="790" cy="235" r="30" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="760" y="205" width="60" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\ell"></div></foreignObject><foreignObject x="830" y="225" width="100" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5E5850;font-weight:400" ><span>потеря</span></div></foreignObject></g>
<g data-key="loc" data-only="1"><foreignObject x="82.3702" y="156.403" width="170" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:400" data-tex="x_1"></div></foreignObject><foreignObject x="90" y="240" width="170" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:400" data-tex="x_2"></div></foreignObject><foreignObject x="76.4359" y="274.917" width="170" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:400" data-tex="1"></div></foreignObject><foreignObject x="375" y="252" width="170" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:400" data-tex="\hat y(1-\hat y)"></div></foreignObject><foreignObject x="595" y="247" width="170" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:400" data-tex="\dfrac{\hat y - y}{\hat y(1-\hat y)}"></div></foreignObject></g>
<g data-key="val" data-only="1"><foreignObject x="80" y="401" width="800" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="\text{четвёртый студент:}\quad x_1 = 2{,}0,\quad x_2 = 0{,}9,\quad \hat y = 0{,}2142,\quad y = 1"></div></foreignObject></g>
<g data-key="b1" data-only="1"><line x1="750.0" y1="246.0" x2="610.0" y2="246.0" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#bg-arr)"/><rect x="615" y="319" width="130" height="30" rx="15" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".45"/><foreignObject x="615" y="319" width="130" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#9C0908;font-weight:400" data-tex="= -4{,}6693"></div></foreignObject></g>
<g data-key="b2" data-only="1"><line x1="530.0" y1="246.0" x2="390.0" y2="246.0" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#bg-arr)"/><rect x="375" y="319" width="170" height="30" rx="15" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".45"/><foreignObject x="375" y="319" width="170" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#9C0908;font-weight:400" data-tex="\hat y - y = -0{,}7858"></div></foreignObject></g>
<g data-key="canc" data-only="1"><rect x="60" y="438" width="840" height="48" rx="12" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><text x="78" y="467" font-size="13" fill="#9C0908" font-weight="700" text-anchor="start">сокращение</text><foreignObject x="210" y="430" width="680" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" data-tex="\dfrac{\hat y - y}{\cancel{\hat y(1-\hat y)}}\cdot\cancel{\hat y(1-\hat y)} = \hat y - y"></div></foreignObject></g>
<g data-key="b3" data-only="1"><line x1="309.1" y1="228.0" x2="210.3" y2="181.8" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#bg-arr)"/><line x1="310.0" y1="246.0" x2="215.0" y2="246.0" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#bg-arr)"/><rect x="60" y="438" width="840" height="48" rx="12" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="210" y="430" width="680" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial w_1} = (\hat y - y)\,x_1 = -0{,}7858\cdot 2{,}0 = -1{,}5717"></div></foreignObject><rect x="60" y="492" width="840" height="48" rx="12" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="210" y="484" width="680" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial w_2} = (\hat y - y)\,x_2 = -0{,}7858\cdot 0{,}9 = -0{,}7072"></div></foreignObject></g>
<g data-key="b4" data-only="1"><line x1="309.1" y1="242.0" x2="131.6" y2="325.1" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#bg-arr)"/><rect x="60" y="546" width="840" height="48" rx="12" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="210" y="538" width="680" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial b} = (\hat y - y)\cdot 1 = -0{,}7858"></div></foreignObject></g>
<g data-key="ch" data-only="1"><rect x="60" y="438" width="840" height="48" rx="12" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="210" y="430" width="680" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial w_1} = \dfrac{\partial\ell}{\partial\hat y}\cdot\dfrac{\partial\hat y}{\partial z}\cdot\dfrac{\partial z}{\partial w_1} = \dfrac{\hat y - y}{\hat y(1-\hat y)}\cdot\hat y(1-\hat y)\cdot x_1 = (\hat y - y)\,x_1"></div></foreignObject></g>
<text x="40" y="614" font-size="13" fill="#5E5850" font-weight="400" text-anchor="start">серые стрелки: прямой проход · красные стрелки и подписи: обратный, на них производные</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="fw" data-focus="fw">
      <div class="step-kicker">Шаг 1 · граф вычислений</div>
      <h4>Сначала запишем, что от чего зависит</h4>
<p>В кружках слева стоят признаки и сдвиг, на стрелках от признаков подписаны веса. Каждая стрелка означает одну операцию: признак умножается на свой вес, всё складывается в логит, сигмоида делает из логита вероятность, а из вероятности и настоящей метки получается потеря.</p>
<p>Признаки и метка приходят из данных и не обучаются. Обучаются три числа: <span class="math-inline" data-tex="w_1"></span> и <span class="math-inline" data-tex="w_2"></span> на стрелках и <span class="math-inline" data-tex="b"></span> в кружке, и производные нужны именно по ним.</p>
    </div>
    <div class="step-panel" data-on="fw" data-focus="fw">
      <div class="step-kicker">Шаг 2 · что мы спрашиваем</div>
      <h4>Насколько потеря чувствительна к каждому весу</h4>
<p>Производная <span class="math-inline" data-tex="\partial \ell/\partial w_1"></span> отвечает: если чуть-чуть увеличить <span class="math-inline" data-tex="w_1"></span>, потеря вырастет или упадёт и насколько быстро.</p>
<p>Брать её сразу от всей цепочки не нужно: цепочку разбирают по звеньям.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial w_1} = \;?"></div></p>
    </div>
    <div class="step-panel" data-on="fw loc" data-focus="loc">
      <div class="step-kicker">Шаг 3 · локальные производные</div>
      <h4>Простые, сигмоида и одна страшная</h4>
<p>Локальная производная зависит только от той операции, которая стоит на стрелке. Красным под стрелками подписаны её значения. Производные линейной части такие же, как в линейной регрессии, а производная сигмоиды выражается через саму сигмоиду.</p>
<p><div class="math-display" data-tex="\frac{\partial z}{\partial w_p} = x_p, \qquad \frac{\partial z}{\partial b} = 1, \qquad \frac{\partial \hat y}{\partial z} = \sigma(z)\bigl(1-\sigma(z)\bigr) = \hat y(1-\hat y)"></div></p>
<p>А вот производная log loss по вероятности выглядит пугающе: в знаменателе стоит <span class="math-inline" data-tex="\hat y(1-\hat y)"></span>.</p>
    </div>
    <div class="step-panel" data-on="fw loc val b1" data-focus="b1">
      <div class="step-kicker">Шаг 4 · поток стартует</div>
      <h4>Из потери в вероятность приходит дробь</h4>
<p>Обратный проход начинается с самого правого узла и идёт против стрелок. Первой он несёт производную потери по вероятности.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial \hat y} = \frac{\hat y - y}{\hat y(1-\hat y)}"></div></p>
<p>У четвёртого студента <span class="math-inline" data-tex="\hat y = 0{,}2142"></span> при <span class="math-inline" data-tex="y = 1"></span>, и сюда приходит −4,6693. Число большое, потому что модель уверенно ошиблась.</p>
    </div>
    <div class="step-panel" data-on="fw loc val b1 b2 canc" data-focus="b2 canc">
      <div class="step-kicker">Шаг 5 · через сигмоиду</div>
      <h4>Знаменатель сокращается ровно</h4>
<p>Дальше поток проходит стрелку сигмоиды и домножается на её производную. Множитель <span class="math-inline" data-tex="\hat y(1-\hat y)"></span> сокращается со знаменателем: ради этого логистическую регрессию и учат с log loss.</p>
<p><div class="math-display" data-tex="\frac{\partial \ell}{\partial z} = \frac{\hat y - y}{\hat y(1-\hat y)}\cdot \hat y(1-\hat y) = \hat y - y"></div></p>
<p>Остаётся простая разность «предсказал минус правда». У четвёртого студента вместо −4,6693 это −0,7858.</p>
    </div>
    <div class="step-panel" data-on="fw loc val b1 b2 b3" data-focus="b3">
      <div class="step-kicker">Шаг 6 · в веса</div>
      <h4>Домножаем на признак и попадаем в <span class="math-inline" data-tex="w_1"></span> и <span class="math-inline" data-tex="w_2"></span></h4>
<p>Здесь пути расходятся. К весу часов сигнал приходит домноженным на часы, к весу пропусков домноженным на пропуски. Общий множитель <span class="math-inline" data-tex="\hat y - y"></span> у них один и тот же.</p>
<p>Отсюда видно, почему признаки полезно приводить к одному масштабу: если один из них в тридцать раз крупнее, его градиент будет в тридцать раз больше, даже если важность у него та же.</p>
    </div>
    <div class="step-panel" data-on="fw loc val b1 b2 b3 b4" data-focus="b4">
      <div class="step-kicker">Шаг 7 · в сдвиг</div>
      <h4>Последний множитель равен единице</h4>
<p>У сдвига нет своего признака: он входит в логит с коэффициентом 1. Поэтому его производная совпадает с самим сигналом ошибки.</p>
    </div>
    <div class="step-panel" data-on="fw loc ch" data-focus="ch">
      <div class="step-kicker">Шаг 8 · цепочка целиком</div>
      <h4>Три множителя вдоль одного пути</h4>
<p>Путь от потери до <span class="math-inline" data-tex="w_1"></span> ровно один, поэтому и слагаемое одно. Перемножаем то, что стояло на каждой стрелке, и получаем готовую формулу.</p>
<p>Сравните с линейной регрессией, где на этом месте стояло <span class="math-inline" data-tex="2(\hat y - y) \cdot  1 \cdot  x_1"></span>. Разница только в множителе перед <span class="math-inline" data-tex="x_1"></span>: других отличий у двух обратных проходов нет.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout">
  <strong>Главная мысль части:</strong> log loss и сигмоида подобраны друг под друга. Страшная
  дробь <span class="math-inline" data-tex="(\hat y - y)/[\hat y(1-\hat y)]"></span> и множитель
  <span class="math-inline" data-tex="\hat y(1-\hat y)"></span> сокращаются нацело, и от всего
  обратного прохода остаётся разность «предсказал минус правда». Ни производную сигмоиды,
  ни логарифм в коде считать не придётся.
</div>

---

## Часть 9. Обратный проход в матричной форме

<p>
  Формулы из части 8 записаны для одного студента и одного веса. Для батча их не нужно выводить заново: достаточно собрать те же производные в матрицы, следя за формами.
</p>

<p>
  Вес <span class="math-inline" data-tex="w_1"></span> влияет на все
  <span class="math-inline" data-tex="N"></span> предсказаний сразу, поэтому вклады
  складываются по объектам. Это и есть цепное правило для функции многих переменных:
</p>

<p><div class="math-display" data-tex="\frac{\partial L}{\partial w_p} = \sum_{n=1}^{N} \frac{\partial L}{\partial z_n}\cdot\frac{\partial z_n}{\partial w_p} = \sum_{n=1}^{N} \frac{1}{N}(\hat y_n - y_n)\,x_{np}"></div></p>

<p>
  Сумма произведений по номеру объекта даёт в точности одну клетку матричного произведения,
  в котором ось объектов стоит внутри. Отсюда обе итоговые формулы:
</p>

<p><div class="math-display" data-tex="\begin{gathered}\nabla_{\mathbf{w}} L = \frac{1}{N}X^\top(\hat{\mathbf{y}} - \mathbf{y}) \in \mathbb{R}^{P\times 1}\quad(2\times 1)\\[6pt] \frac{\partial L}{\partial b} = \frac{1}{N}\sum_{n=1}^{N} (\hat y_n - y_n) \in \mathbb{R}^{1\times 1}\end{gathered}"></div></p>

<p>
  Сравните с линейной регрессией: там было
  <span class="math-inline" data-tex="\frac{2}{N}X^\top(\hat{\mathbf{y}} - \mathbf{y})"></span>.
  Разница ровно в двойке, которая пришла от квадрата. Формула градиента у двух моделей одна
  и та же, хотя выводились они из разных потерь. Это свойство канонической функции связи в обобщённых линейных моделях.
</p>

<div class="callout-blue">
  <strong>Откуда в градиенте сдвига взялась сумма:</strong> на прямом проходе
  <span class="math-inline" data-tex="b"></span> размножился по всем строкам батча. Каждая копия
  получила свою производную, а поскольку само число одно, все копии обязаны сложиться. Правило
  общее: размножение вперёд оборачивается суммированием назад, и в сетях с broadcasting оно встречается
  на каждом слое.
</div>

<p>Посмотрим пошагово, как это правило выглядит на самих матрицах.</p>

<div class="stage" id="stageBM" tabindex="0">
  <div class="stage-figure">
<svg id="bm" viewBox="0 0 960 450" role="img" aria-label="Градиенты батча в матричной форме">
  <style>
    #bm { font-family: Helvetica, Arial, sans-serif; }
    #bm .lbl { font-size: 16px; fill: #111111; }
    #bm .cap { font-size: 13px; fill: #5E5850; }
    #bm .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #bm .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #bm .val { font-size: 14px; fill: #111111; }
    #bm .mm  { font-size: 12px; fill: #5E5850; }
    #bm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="bm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bm-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="\mathbf{w},\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="\mathbf{z}"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat{\mathbf{y}}"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">те же производные, собранные в матрицы</text>
<g data-key="r">
<rect x="60" y="100" width="60" height="120" rx="2" fill="#C30B0A" opacity="0.38" stroke="#ffffff" stroke-width="1"/>
<line x1="60" y1="130" x2="120" y2="130" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="160" x2="120" y2="160" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="190" x2="120" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="5" y="71.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1=4\times 1"></div></foreignObject>
<foreignObject x="37.5" y="217.48" width="105" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#9C0908;font-weight:700" data-tex="\hat{\mathbf{y}} - \mathbf{y}"></div></foreignObject>
<foreignObject x="120" y="141.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject>
<foreignObject x="142.5" y="134.24" width="79" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\dfrac{1}{N}"></div></foreignObject>
<foreignObject x="186" y="141.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
</g>
<g data-key="sig">
<rect x="240" y="100" width="60" height="120" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="240" y1="130" x2="300" y2="130" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="240" y1="160" x2="300" y2="160" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="240" y1="190" x2="300" y2="190" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="185" y="71.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1=4\times 1"></div></foreignObject>
<foreignObject x="217.5" y="217.48" width="105" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#B76A11;font-weight:700" data-tex="\partial L/\partial \mathbf{z}"></div></foreignObject>
</g>
<g data-key="XT" transform="translate(40 0)">
<path d="M 230 252 C 235 285 267 300 302 300" fill="none" stroke="#5E5850" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#bm-arw)"/>

<rect x="60" y="288" width="180" height="68" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="105" y1="288" x2="105" y2="356" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="150" y1="288" x2="150" y2="356" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="195" y1="288" x2="195" y2="356" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="322" x2="240" y2="322" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="65" y="259.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times N=2\times 4"></div></foreignObject>
<foreignObject x="115" y="353.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="X^\top"></div></foreignObject>
</g>
<g data-key="sig2" transform="translate(40 0)">
<foreignObject x="236" y="301.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject>
<rect x="292" y="262" width="60" height="120" rx="2" fill="#E88919" opacity="0.6" stroke="#ffffff" stroke-width="1"/>
<line x1="292" y1="292" x2="352" y2="292" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="292" y1="322" x2="352" y2="322" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="292" y1="352" x2="352" y2="352" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="237" y="233.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1=4\times 1"></div></foreignObject>
<foreignObject x="269.5" y="379.48" width="105" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#B76A11;font-weight:700" data-tex="\partial L/\partial \mathbf{z}"></div></foreignObject>
</g>
<g data-key="nab" transform="translate(40 0)">
<foreignObject x="348" y="301.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
<rect x="404" y="288" width="46" height="68" rx="2" fill="#D83BB9" opacity="0.55" stroke="#ffffff" stroke-width="1"/>
<line x1="404" y1="322" x2="450" y2="322" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<foreignObject x="342" y="259.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1=2\times 1"></div></foreignObject>
<foreignObject x="387.5" y="353.48" width="79" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#A62E8E;font-weight:700" data-tex="\nabla_{\mathbf{w}}L"></div></foreignObject>
</g>
<g data-key="bias" data-only="1">
<rect x="520" y="262" width="400" height="120" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
<text x="538" y="288" class="cap" text-anchor="start">ГРАДИЕНТ СДВИГА</text>
<foreignObject x="538" y="296.16" width="402" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#111111;font-weight:400" ><span><span data-tex="\partial L/\partial b"></span> = сумма всех клеток <span data-tex="\partial L/\partial \mathbf{z}"></span></span></div></foreignObject>
<text x="538" y="346" class="cap" text-anchor="start">размножение вперёд, суммирование назад</text>
</g>
<g data-key="rule" data-only="1">
<rect x="520" y="100" width="400" height="120" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="538" y="126" class="cap" text-anchor="start">ПРАВИЛО ПРОВЕРКИ</text>
<foreignObject x="538" y="134.16" width="391" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#111111;font-weight:400" data-tex="\mathbf{w}:\ P\times 1=2\times 1\ \rightarrow\ \nabla_{\mathbf{w}}L:\ P\times 1=2\times 1"></div></foreignObject>
<foreignObject x="538" y="162.16" width="417" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#111111;font-weight:400" data-tex="b:\ 1\times 1\ \rightarrow\ \partial L/\partial b:\ 1\times 1"></div></foreignObject>
<text x="538" y="208" class="cap" text-anchor="start">если формы разошлись, ошибка в выкладке</text>
</g>
<text x="40" y="436" class="legend" text-anchor="start">красное: разность предсказания и правды · оранжевое: сигнал ошибки · малиновое: градиенты</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="r mm3" data-focus="r">
      <div class="step-kicker">Шаг 1 · с чего начинается обратный проход</div>
      <h4>Единственное, что нужно: столбец <span class="math-inline" data-tex="\hat{\mathbf{y}} - \mathbf{y}"></span></h4>
<p>Прямой проход уже посчитал вероятности, метки известны. Ни логиты, ни производная сигмоиды по отдельности больше не понадобятся: они сократились ещё в части 8.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} - \mathbf{y} \in \mathbb{R}^{N\times 1}\quad(4\times 1)"></div></p>
    </div>
    <div class="step-panel" data-on="r sig mm5" data-focus="sig">
      <div class="step-kicker">Шаг 2 · сигнал ошибки</div>
      <h4>Производная потери по каждому логиту</h4>
<p>Усреднение по батчу даёт деление на <span class="math-inline" data-tex="N"></span>. Форма при этом не меняется: сколько было предсказаний, столько и производных.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial \mathbf{z}} = \frac{1}{N}\,(\hat{\mathbf{y}} - \mathbf{y}) \in \mathbb{R}^{N\times 1}\quad(4\times 1)"></div></p><p>У линейной регрессии здесь стояло <span class="math-inline" data-tex="\frac{2}{N}(\hat{\mathbf{y}} - \mathbf{y})"></span>. Двойка пришла от квадрата, у нас её нет.</p>
    </div>
    <div class="step-panel" data-on="sig XT sig2 mm5" data-focus="XT">
      <div class="step-kicker">Шаг 3 · откуда берётся транспонирование</div>
      <h4>Нужно свернуть ось объектов, а не ось признаков</h4>
<p>У сигнала ошибки высота <span class="math-inline" data-tex="N"></span>, по числу студентов. У градиента весов высота должна быть <span class="math-inline" data-tex="P"></span>, по числу признаков. Свернуть <span class="math-inline" data-tex="N"></span> способна только матрица, у которой <span class="math-inline" data-tex="N"></span> стоит в столбцах, а это <span class="math-inline" data-tex="X^\top"></span>.</p>
<p>Смысл строки <span class="math-inline" data-tex="X^\top"></span> прямой: это один признак у всех студентов сразу.</p>
    </div>
    <div class="step-panel" data-on="XT sig2 nab mm5" data-focus="nab">
      <div class="step-kicker">Шаг 4 · градиент весов</div>
      <h4>Формы сходятся, получается столбец <span class="math-inline" data-tex="2 \times  1"></span></h4>
<p>Каждая клетка результата равна сумме по всем студентам: признак, умноженный на сигнал ошибки этого студента. Ровно то же, что мы получили на графе, только сразу для всего батча.</p>
<p><div class="math-display" data-tex="\begin{gathered}\nabla_{\mathbf{w}} L = \frac{1}{N}X^\top(\hat{\mathbf{y}} - \mathbf{y})\\[4pt] [P\times N]\cdot[N\times 1] \rightarrow [P\times 1]\qquad [2\times 4]\cdot[4\times 1] \rightarrow [2\times 1]\end{gathered}"></div></p>
    </div>
    <div class="step-panel" data-on="sig bias mm5" data-focus="bias">
      <div class="step-kicker">Шаг 5 · градиент сдвига</div>
      <h4>Сдвиг входит во все строки с коэффициентом единица</h4>
<p>Поэтому взвешивать признаками нечего, и остаётся просто сумма сигналов ошибки. Помните размножение <span class="math-inline" data-tex="b"></span> по строкам на прямом проходе? Здесь оно обернулось суммированием, и так бывает всегда.</p>
<p><div class="math-display" data-tex="\begin{gathered}\frac{\partial L}{\partial b} = \frac{1}{N}\sum_{n=1}^{N} (\hat y_n - y_n)\\[4pt] [1\times N]\cdot[N\times 1] \rightarrow [1\times 1]\qquad [1\times 4]\cdot[4\times 1] \rightarrow [1\times 1]\end{gathered}"></div></p>
    </div>
    <div class="step-panel" data-on="nab bias rule" data-focus="rule">
      <div class="step-kicker">Шаг 6 · как проверить себя</div>
      <h4>Форма градиента повторяет форму параметра</h4>
<p>Проверок две. Первая: в каждом произведении внутренние размеры совпадают. Вторая: форма градиента равна форме параметра, у весов это <span class="math-inline" data-tex="P \times  1"></span> <span class="math-inline" data-tex="(2 \times  1)"></span>, у сдвига <span class="math-inline" data-tex="1 \times  1"></span>. Если у градиента весов получилась форма <span class="math-inline" data-tex="N \times  1"></span> или <span class="math-inline" data-tex="1 \times  P"></span>, ошибка в производной, и вычесть такой градиент из <span class="math-inline" data-tex="\mathbf{w}"></span> не получится.</p>
<p>Весь обратный проход логистической регрессии сводится к одному вычитанию, одному умножению матрицы на столбец и одному суммированию того же столбца.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<table class="shape-table">
  <tr><th>Обозначение</th><th>Что это</th><th>Форма</th><th>В примере</th></tr>
  <tr><td><span class="math-inline" data-tex="\hat{\mathbf{y}} - \mathbf{y}"></span></td><td>разность вероятностей и меток</td><td><span class="math-inline" data-tex="N \times  1"></span></td><td><span class="math-inline" data-tex="4 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="\partial L/\partial \mathbf{z}"></span></td><td>сигнал ошибки, форма не меняется</td><td><span class="math-inline" data-tex="N \times  1"></span></td><td><span class="math-inline" data-tex="4 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="X^\top"></span></td><td>признаки на боку</td><td><span class="math-inline" data-tex="P \times  N"></span></td><td><span class="math-inline" data-tex="2 \times  4"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="\nabla_{\mathbf{w}}L"></span></td><td>градиент весов</td><td><span class="math-inline" data-tex="P \times  1"></span></td><td><span class="math-inline" data-tex="2 \times  1"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="\partial L/\partial b"></span></td><td>градиент сдвига</td><td><span class="math-inline" data-tex="1 \times  1"></span></td><td><span class="math-inline" data-tex="1 \times  1"></span></td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> у градиента всегда форма того, по чему дифференцировали.
  <span class="math-inline" data-tex="\mathbf{w}"></span> имеет форму
  <span class="math-inline" data-tex="P\times 1"></span> (в примере <span class="math-inline" data-tex="2\times 1"></span>), и градиент тоже;
  <span class="math-inline" data-tex="b"></span> одно число, и его производная одно число. Если формы
  разошлись, ошибка в выкладке, а не в данных.
</div>

---

## Часть 10. Подставляем числа в обратный проход

<p>
  Все величины уже посчитаны в части 7. Вероятности лежат готовым столбцом, метки известны,
  матрица признаков не менялась: обратный проход переиспользует результаты прямого целиком.
</p>

<pre><code>def backward(X, y, yhat):
    g  = (yhat - y) / len(y)  # сигнал ошибки, [4,1]
    dw = X.T @ g              # [2,4]·[4,1] → [2,1]
    db = g.sum()              # одно число
    return dw, db</code></pre>

<p>Посмотрим пошагово, что за числа получаются назад.</p>

<div class="stage" id="stageBX" tabindex="0">
  <div class="stage-figure">
<svg id="bx" viewBox="0 0 960 430" role="img" aria-label="Обратный проход в числах и сверка градиента">
  <style>
    #bx { font-family: Helvetica, Arial, sans-serif; }
    #bx .lbl { font-size: 16px; fill: #111111; }
    #bx .cap { font-size: 13px; fill: #5E5850; }
    #bx .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #bx .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #bx .val { font-size: 14px; fill: #111111; }
    #bx .mm  { font-size: 12px; fill: #5E5850; }
    #bx .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="bx-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="bx-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bx-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="\mathbf{w},\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="\mathbf{z}"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat{\mathbf{y}}"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">обратный проход стартует с того же столбца, которым кончился прямой</text>
<g data-key="r">
<rect x="60" y="96" width="84" height="104" rx="2" fill="#C30B0A" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="60" y1="122" x2="144" y2="122" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="148" x2="144" y2="148" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="60" y1="174" x2="144" y2="174" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="102" y="114" text-anchor="middle" font-size="14" fill="#111111">0,2891</text>
<text x="102" y="140" text-anchor="middle" font-size="14" fill="#111111">−0,2689</text>
<text x="102" y="166" text-anchor="middle" font-size="14" fill="#111111">0,3543</text>
<text x="102" y="192" text-anchor="middle" font-size="14" fill="#111111">−0,7858</text>
<foreignObject x="17" y="67.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1=4\times 1"></div></foreignObject>
<foreignObject x="49.5" y="197.48" width="105" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#9C0908;font-weight:700" data-tex="\hat{\mathbf{y}} - \mathbf{y}"></div></foreignObject>
<foreignObject x="156" y="125.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject>
<foreignObject x="176.5" y="118.24" width="79" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\dfrac{1}{4}"></div></foreignObject>
<foreignObject x="220" y="125.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
</g>
<g data-key="sig">
<rect x="280" y="96" width="84" height="104" rx="2" fill="#E88919" opacity="0.42" stroke="#ffffff" stroke-width="1"/>
<line x1="280" y1="122" x2="364" y2="122" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="280" y1="148" x2="364" y2="148" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="280" y1="174" x2="364" y2="174" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="322" y="114" text-anchor="middle" font-size="14" fill="#111111">0,0723</text>
<text x="322" y="140" text-anchor="middle" font-size="14" fill="#111111">−0,0672</text>
<text x="322" y="166" text-anchor="middle" font-size="14" fill="#111111">0,0886</text>
<text x="322" y="192" text-anchor="middle" font-size="14" fill="#111111">−0,1965</text>
<foreignObject x="237" y="67.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1=4\times 1"></div></foreignObject>
<foreignObject x="269.5" y="197.48" width="105" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#B76A11;font-weight:700" data-tex="\partial L/\partial \mathbf{z}"></div></foreignObject>
</g>
<g data-key="XT">
<path d="M 320 218 C 318 250 318 276 332 288" fill="none" stroke="#5E5850" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#bx-arw)"/>
<text x="436" y="246" class="cap" text-anchor="start">тот же столбец</text>
<rect x="70" y="280" width="200" height="68" rx="2" fill="#3576C0" opacity="0.3" stroke="#ffffff" stroke-width="1"/>
<line x1="120" y1="280" x2="120" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="170" y1="280" x2="170" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="220" y1="280" x2="220" y2="348" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="70" y1="314" x2="270" y2="314" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="95" y="302" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="145" y="302" text-anchor="middle" font-size="14" fill="#111111">4,0</text>
<text x="195" y="302" text-anchor="middle" font-size="14" fill="#111111">3,0</text>
<text x="245" y="302" text-anchor="middle" font-size="14" fill="#111111">2,0</text>
<text x="95" y="336" text-anchor="middle" font-size="14" fill="#111111">0,5</text>
<text x="145" y="336" text-anchor="middle" font-size="14" fill="#111111">0,2</text>
<text x="195" y="336" text-anchor="middle" font-size="14" fill="#111111">1,0</text>
<text x="245" y="336" text-anchor="middle" font-size="14" fill="#111111">0,9</text>
<foreignObject x="85" y="251.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times N=2\times 4"></div></foreignObject>
<foreignObject x="135" y="345.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#2A5E9B;font-weight:700" data-tex="X^\top"></div></foreignObject>
</g>
<g data-key="sig2">
<foreignObject x="270" y="293.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject>
<rect x="336" y="258" width="84" height="112" rx="2" fill="#E88919" opacity="0.42" stroke="#ffffff" stroke-width="1"/>
<line x1="336" y1="286" x2="420" y2="286" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="336" y1="314" x2="420" y2="314" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<line x1="336" y1="342" x2="420" y2="342" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="378" y="277" text-anchor="middle" font-size="14" fill="#111111">0,0723</text>
<text x="378" y="305" text-anchor="middle" font-size="14" fill="#111111">−0,0672</text>
<text x="378" y="333" text-anchor="middle" font-size="14" fill="#111111">0,0886</text>
<text x="378" y="361" text-anchor="middle" font-size="14" fill="#111111">−0,1965</text>
<foreignObject x="293" y="229.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="N\times 1=4\times 1"></div></foreignObject>
<foreignObject x="325.5" y="367.48" width="105" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#B76A11;font-weight:700" data-tex="\partial L/\partial \mathbf{z}"></div></foreignObject>
</g>
<g data-key="nab">
<foreignObject x="426" y="293.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
<rect x="492" y="280" width="94" height="68" rx="2" fill="#D83BB9" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="492" y1="314" x2="586" y2="314" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="539" y="302" text-anchor="middle" font-size="14" fill="#111111">−0,2516</text>
<text x="539" y="336" text-anchor="middle" font-size="14" fill="#111111">−0,0655</text>
<foreignObject x="454" y="251.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1=2\times 1"></div></foreignObject>
<foreignObject x="499.5" y="345.48" width="79" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#A62E8E;font-weight:700" data-tex="\nabla_{\mathbf{w}}L"></div></foreignObject>
</g>
<g data-key="hl" data-only="1">
<rect x="70" y="280" width="200" height="34" fill="#C30B0A" opacity="0.12"/>
<rect x="70" y="280" width="200" height="34" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="336" y="258" width="84" height="112" fill="#C30B0A" opacity="0.12"/>
<rect x="336" y="258" width="84" height="112" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
<rect x="492" y="280" width="94" height="34" fill="#C30B0A" opacity="0.14"/>
<rect x="492" y="280" width="94" height="34" fill="none" stroke="#C30B0A" stroke-width="2.4"/>
</g>
<g data-key="bias" data-only="1">
<rect x="646" y="258" width="274" height="112" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.6"/>
<text x="664" y="284" class="cap" text-anchor="start">ГРАДИЕНТ СДВИГА</text>
<foreignObject x="664" y="292.16" width="469" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#111111;font-weight:400" data-tex="0{,}0723 - 0{,}0672 + 0{,}0886 - 0{,}1965"></div></foreignObject>
<foreignObject x="664" y="320.16" width="235" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#111111;font-weight:700" data-tex="\partial L/\partial b = -0{,}1028"></div></foreignObject>
</g>
<g data-key="chk" data-only="1">
<rect x="646" y="96" width="274" height="104" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/>
<text x="664" y="122" class="cap" text-anchor="start">ЧИСЛЕННАЯ СВЕРКА</text>
<foreignObject x="664" y="114.96" width="326" height="64"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{L(\mathbf{w}+\varepsilon) - L(\mathbf{w}-\varepsilon)}{2\varepsilon}"></div></foreignObject>
<text x="664" y="180" class="val" text-anchor="start">те же три числа</text>
</g>
<text x="40" y="416" class="legend" text-anchor="start">малиновым выделены строка, столбец и клетка, которую они дают · зелёное: независимая проверка</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="r mm3" data-focus="r">
      <div class="step-kicker">Шаг 1 · разность предсказания и правды</div>
      <h4>Ничего пересчитывать не нужно</h4>
<p><b>Из прямого прохода.</b> Вероятности были 0,2891; 0,7311; 0,3543 и 0,2142, метки 0, 1, 0 и 1. Вычитаем клетка в клетку.</p>
<p><div class="math-display" data-tex="\hat{\mathbf{y}} - \mathbf{y} = (0{,}2891;\ -0{,}2689;\ 0{,}3543;\ -0{,}7858)^\top \in \mathbb{R}^{4\times 1}"></div></p><p>Знак читается буквально: плюс значит, что модель завысила шансы, минус, что занизила.</p>
    </div>
    <div class="step-panel" data-on="r sig mm5" data-focus="sig">
      <div class="step-kicker">Шаг 2 · сигнал ошибки</div>
      <h4>Делим на размер батча</h4>
<p><b>Сигнал ошибки.</b> Умножаем на <span class="math-inline" data-tex="1/N = 1/4 = 0{,}25"></span>. Больше на этом столбце ничего не делается: производная сигмоиды уже сократилась.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial \mathbf{z}} = 0{,}25\cdot(\hat{\mathbf{y}} - \mathbf{y}) = (0{,}0723;\ -0{,}0672;\ 0{,}0886;\ -0{,}1965)^\top"></div></p><p>Самая крупная клетка у четвёртого студента, того самого, который сдал вопреки прогнозу.</p>
    </div>
    <div class="step-panel" data-on="sig XT sig2 mm5" data-focus="XT">
      <div class="step-kicker">Шаг 3 · транспонирование</div>
      <h4>Та же матрица, повёрнутая на бок</h4>
<p><b>Та же таблица на боку.</b> В первой строке <span class="math-inline" data-tex="X^\top"></span> стоят часы всех четырёх студентов, во второй их пропуски. Ни одно число не изменилось, изменился только порядок осей.</p>
<p><div class="math-display" data-tex="X^\top = \begin{bmatrix}2{,}0 &amp; 4{,}0 &amp; 3{,}0 &amp; 2{,}0\\0{,}5 &amp; 0{,}2 &amp; 1{,}0 &amp; 0{,}9\end{bmatrix} \in \mathbb{R}^{2\times 4}"></div></p>
    </div>
    <div class="step-panel" data-on="XT sig2 nab hl mm5" data-focus="hl">
      <div class="step-kicker">Шаг 4 · вес часов</div>
      <h4>Четыре произведения и их сумма</h4>
<p><b>Первая клетка градиента.</b> Малиновым выделено то, что её даёт: строка часов, весь столбец сигнала ошибки и клетка результата.</p>
<p><div class="math-display" data-tex="\begin{gathered}[2\times 4]\cdot[4\times 1] \rightarrow [2\times 1]\\[4pt] 2{,}0\cdot 0{,}0723 + 4{,}0\cdot(-0{,}0672) + 3{,}0\cdot 0{,}0886 + 2{,}0\cdot(-0{,}1965) = -0{,}2516\end{gathered}"></div></p>
    </div>
    <div class="step-panel" data-on="XT sig2 nab mm5" data-focus="nab">
      <div class="step-kicker">Шаг 5 · вес пропусков</div>
      <h4>Строка пропусков на тот же столбец</h4>
<p><b>Вторая клетка.</b> Та же операция со строкой пропусков.</p>
<p><div class="math-display" data-tex="0{,}5\cdot 0{,}0723 + 0{,}2\cdot(-0{,}0672) + 1{,}0\cdot 0{,}0886 + 0{,}9\cdot(-0{,}1965) = -0{,}0655"></div></p><p>Обе производные отрицательны, значит шаг спуска увеличит оба веса. Для веса пропусков это означает движение к нулю: батч требует ослабить штраф за прогулы из-за одного студента, который прогуливал и всё равно сдал.</p>
    </div>
    <div class="step-panel" data-on="sig bias mm5" data-focus="bias">
      <div class="step-kicker">Шаг 6 · сдвиг</div>
      <h4>Сумма сигналов ошибки</h4>
<p><b>Градиент сдвига.</b> Просто сумма того же столбца: взвешивать нечем.</p>
<p><div class="math-display" data-tex="\frac{\partial L}{\partial b} = 0{,}0723 - 0{,}0672 + 0{,}0886 - 0{,}1965 = -0{,}1028"></div></p><p>Он тоже отрицательный: в среднем по этому батчу модель занижает шансы сдать.</p>
    </div>
    <div class="step-panel" data-on="nab bias chk" data-focus="chk">
      <div class="step-kicker">Шаг 7 · сверка</div>
      <h4>Сдвинуть вес и посмотреть на потерю</h4>
<p><b>Проверка без формул.</b> Производную можно оценить в лоб: изменить один параметр на <span class="math-inline" data-tex="10^{-6}"></span> в обе стороны, посчитать потерю дважды и поделить разность на удвоенное приращение. Формулы при этом не используются вообще.</p>
<p>Все три числа совпадают с аналитическими. Такой проверкой стоит сопровождать любой выведенный руками обратный проход: она ловит опечатки, которые глазами не видны.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout-blue">
  <strong>Знаки читаются буквально:</strong> у всех трёх производных знак минус, значит
  увеличение любого из трёх чисел уменьшит потерю, и шаг спуска каждое из них увеличит.
  Для веса пропусков это движение к нулю: батч просит ослабить штраф за прогулы. Такова цена маленького батча: один нетипичный студент разворачивает целый признак, и лечится это только
  усреднением по большему числу объектов.
</div>

<div class="callout-yellow">
  <strong>Где численная проверка перестаёт работать:</strong> она опирается на гладкость
  функции. У логистической регрессии проблем нет: потеря гладкая всюду. Но стоит появиться
  ReLU или модулю, и в точке излома численная производная начнёт врать при слишком крупном
  <span class="math-inline" data-tex="\varepsilon"></span>, а при слишком мелком её съест
  машинная точность. Разумный диапазон: от <span class="math-inline" data-tex="10^{-6}"></span>
  до <span class="math-inline" data-tex="10^{-4}"></span>.
</div>

<div class="callout">
  <strong>Главная мысль части:</strong> обратный проход логистической регрессии сводится к одному
  вычитанию, одному умножению <span class="math-inline" data-tex="X^\top"></span> на столбец
  и одному суммированию того же столбца. Три строки кода, и все три выведены здесь из определения
  производной.
</div>

---

## Часть 11. Получили градиент, придумываем спуск

<p>
  На руках три числа: −0,2516, −0,0655 и −0,1028. Что с ними делать? Знак говорит, в какую
  сторону потеря растёт; значит, двигаться надо в противоположную. Осталось решить, насколько
  далеко.
</p>

<p>
  Производная описывает поведение потери только при бесконечно малом смещении. Она не знает,
  где линейное приближение перестаёт работать, поэтому градиент умножают на небольшой множитель.
  Его называют скоростью обучения, и это единственное число во всём цикле, которое приходится
  выбирать руками.
</p>

<p><div class="math-display" data-tex="\theta \leftarrow \theta - \eta\,\frac{\partial L}{\partial \theta}"></div></p>

<p>Посмотрим пошагово, что даёт один шаг из точки, в которой мы стоим.</p>

<div class="stage" id="stageGD" tabindex="0">
  <div class="stage-figure">
<svg id="gd" viewBox="0 0 960 410" role="img" aria-label="Шаг градиентного спуска и зависимость потери от длины шага">
  <style>
    #gd { font-family: Helvetica, Arial, sans-serif; }
    #gd .lbl { font-size: 16px; fill: #111111; }
    #gd .cap { font-size: 13px; fill: #5E5850; }
    #gd .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #gd .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #gd .val { font-size: 14px; fill: #111111; }
    #gd .mm  { font-size: 12px; fill: #5E5850; }
    #gd .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="gd-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="gd-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="gd-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>

<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-105" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>студенты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="209" y="15.68" width="92" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="\mathbf{w},\  b"></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="195" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>логит <span data-tex="z"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="345" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>вероятность <span data-tex="\hat y"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="495" y="15.68" width="420" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" ><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<foreignObject x="270" y="41.72" width="420" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" ><span>градиент даёт направление, а <span data-tex="\eta"></span> длину шага</span></div></foreignObject>
<g data-key="w0">
<rect x="78" y="118" width="72" height="70" rx="2" fill="#C29E08" opacity="0.45" stroke="#ffffff" stroke-width="1"/>
<line x1="78" y1="153" x2="150" y2="153" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="114" y="140.5" text-anchor="middle" font-size="14" fill="#111111">0,8</text>
<text x="114" y="175.5" text-anchor="middle" font-size="14" fill="#111111">−1,0</text>
<foreignObject x="29" y="89.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1=2\times 1"></div></foreignObject>
<foreignObject x="79" y="185.48" width="70" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" data-tex="\mathbf{w}"></div></foreignObject>
</g>
<g data-key="gr">
<foreignObject x="156" y="133.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-"></div></foreignObject>
<foreignObject x="180.5" y="137.04" width="79" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\eta\,\cdot"></div></foreignObject>
<rect x="252" y="118" width="106" height="70" rx="2" fill="#D83BB9" opacity="0.4" stroke="#ffffff" stroke-width="1"/>
<line x1="252" y1="153" x2="358" y2="153" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="305" y="140.5" text-anchor="middle" font-size="14" fill="#111111">−0,2516</text>
<text x="305" y="175.5" text-anchor="middle" font-size="14" fill="#111111">−0,0655</text>
<foreignObject x="220" y="89.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1=2\times 1"></div></foreignObject>
<foreignObject x="265.5" y="185.48" width="79" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#A62E8E;font-weight:700" data-tex="\nabla_{\mathbf{w}}L"></div></foreignObject>
</g>
<g data-key="w1">
<foreignObject x="370" y="133.04" width="60" height="38.4"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject>
<rect x="434" y="118" width="100" height="70" rx="2" fill="#C29E08" opacity="0.5" stroke="#ffffff" stroke-width="1"/>
<line x1="434" y1="153" x2="534" y2="153" stroke="#ffffff" stroke-width="1.35" stroke-opacity="0.75"/>
<text x="484" y="140.5" text-anchor="middle" font-size="14" fill="#111111">0,9258</text>
<text x="484" y="175.5" text-anchor="middle" font-size="14" fill="#111111">−0,9672</text>
<foreignObject x="399" y="89.32" width="170" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="P\times 1=2\times 1"></div></foreignObject>
<foreignObject x="274" y="185.48" width="420" height="40.8"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#8F7406;font-weight:700" ><span><span data-tex="\mathbf{w}"></span> после шага</span></div></foreignObject>
</g>
<g data-key="bs" data-only="1">
<rect x="60" y="250" width="490" height="96" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/>
<text x="78" y="276" class="cap" text-anchor="start">СДВИГ ОБНОВЛЯЕТСЯ ПО ТОМУ ЖЕ ПРАВИЛУ</text>
<foreignObject x="78" y="284.16" width="508" height="33.6"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:14px;color:#111111;font-weight:400" data-tex="b \leftarrow -2{,}0 - 0{,}5\cdot(-0{,}1028) = -1{,}9486"></div></foreignObject>
<foreignObject x="78" y="313.72" width="862" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5E5850;font-weight:400" ><span>отдельной формулы для <span data-tex="b"></span> не существует: это такой же параметр</span></div></foreignObject>
</g>
<g data-key="pl" data-only="1">
<rect x="586" y="96" width="340" height="266" rx="12" fill="#FFFFFF" stroke="#E4E1D7" stroke-width="1.3"/>
<text x="602" y="116" class="cap" text-anchor="start">потеря батча после одного шага</text>
<line x1="620.0" y1="320.0" x2="902.0" y2="320.0" stroke="#8A847B" stroke-width="1.4"/>
<line x1="620.0" y1="130.0" x2="620.0" y2="320.0" stroke="#8A847B" stroke-width="1.4"/>
<polyline points="620.0,252.7 648.2,278.4 676.4,295.6 704.6,304.3 732.8,304.6 761.0,296.9 789.2,281.0 817.4,257.4 845.6,226.0 873.8,187.8 902.0,142.1" fill="none" stroke="#3576C0" stroke-width="2.4"/>
<line x1="620.0" y1="252.7" x2="902.0" y2="252.7" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="4 4"/>
<text x="626" y="246.7" class="cap" text-anchor="start">было 0,6582</text>
<foreignObject x="620" y="317.72" width="105" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5E5850;font-weight:400" data-tex="\eta = 0"></div></foreignObject>
<foreignObject x="775" y="317.72" width="131" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5E5850;font-weight:400;justify-content:flex-end" data-tex="\eta = 1{,}5"></div></foreignObject>
<circle cx="714.0" cy="305.4" r="5" fill="#73B222"/>
<foreignObject x="735" y="295.72" width="248" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5E5850;font-weight:400" data-tex="\eta = 0{,}5 \rightarrow  0{,}6377"></div></foreignObject>
</g>
<g data-key="bad" data-only="1">
<circle cx="902.0" cy="142.1" r="6" fill="#C30B0A"/>
<foreignObject x="630" y="129.72" width="248" height="31.2"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:13px;color:#5E5850;font-weight:400;justify-content:flex-end" data-tex="\eta = 1{,}5 \rightarrow  0{,}7013"></div></foreignObject>
</g>
<text x="40" y="396" class="legend" text-anchor="start">зелёное: результат шага · красное: градиент и шаг, который делает хуже</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="w0 gr mm5" data-focus="w0 gr">
      <div class="step-kicker">Шаг 1 · что на руках</div>
      <h4>Веса и градиент одной формы</h4>
<p>После обратного прохода у нас два столбца формы <span class="math-inline" data-tex="P \times  1"></span>, в примере <span class="math-inline" data-tex="2 \times  1"></span>: сами веса и их производные. Дальше только арифметика.</p>
<p><div class="math-display" data-tex="[P\times 1] - \eta\,[P\times 1] = [P\times 1]\qquad [2\times 1] - \eta\,[2\times 1] = [2\times 1]"></div></p>
<p>Если бы градиент имел форму <span class="math-inline" data-tex="1 \times  P"></span> <span class="math-inline" data-tex="(1 \times  2)"></span>, эта строка просто не выполнилась бы. Ради совпадения форм в градиенте и стоит транспонирование.</p>
    </div>
    <div class="step-panel" data-on="w0 gr mm5" data-focus="gr">
      <div class="step-kicker">Шаг 2 · почему минус</div>
      <h4>Градиент показывает, куда потеря растёт</h4>
<p>Производная −0,2516 означает: увеличение <span class="math-inline" data-tex="w_1"></span> уменьшает потерю. Значит, двигаться надо против градиента, то есть вычитать его.</p>
<p><div class="math-display" data-tex="\theta \leftarrow \theta - \eta\,\frac{\partial L}{\partial \theta}"></div></p>
    </div>
    <div class="step-panel" data-on="w0 gr w1 mm5" data-focus="w1">
      <div class="step-kicker">Шаг 3 · новые веса</div>
      <h4>Каждая клетка меняется независимо</h4>
<p><div class="math-display" data-tex="0{,}8 - 0{,}5\cdot(-0{,}2516) = 0{,}9258, \qquad -1{,}0 - 0{,}5\cdot(-0{,}0655) = -0{,}9672"></div></p><p>Вес часов прибавил 0,126, вес пропусков сдвинулся всего на 0,033: его градиент был вчетверо меньше.</p>
    </div>
    <div class="step-panel" data-on="w1 bs mm5" data-focus="bs">
      <div class="step-kicker">Шаг 4 · сдвиг</div>
      <h4><span class="math-inline" data-tex="b"></span> обновляется той же строкой</h4>
<p>Никакого особого правила для сдвига нет, и в коде он обычно даже не выделяется в отдельную переменную.</p>
<p>После шага потеря батча падает с 0,6582 до 0,6377.</p>
    </div>
    <div class="step-panel" data-on="w1 bs pl" data-focus="pl">
      <div class="step-kicker">Шаг 5 · насколько длинный шаг</div>
      <h4>Потеря после шага зависит от <span class="math-inline" data-tex="\eta"></span> не монотонно</h4>
<p>При <span class="math-inline" data-tex="\eta = 0{,}5"></span> потеря падает с 0,6582 до 0,6377. Лучший одиночный шаг здесь около 0,53, и он даёт 0,6376: на 0,0001 лучше, чем при <span class="math-inline" data-tex="\eta = 0{,}5"></span>.</p>
<p>Гнаться за ним не нужно: следующий шаг всё равно будет делаться из другой точки.</p>
    </div>
    <div class="step-panel" data-on="pl bad" data-focus="bad">
      <div class="step-kicker">Шаг 6 · когда шаг ломает всё</div>
      <h4>После порога потеря начинает расти</h4>
<p>При <span class="math-inline" data-tex="\eta = 1{,}5"></span> потеря после шага равна 0,7013, хуже, чем была до него. Направление было правильным, а длина нет.</p>
<p>Порог считается точно: удвоенная обратная величина наибольшего собственного числа матрицы вторых производных. На этом батче он равен 1,0350, на всей обучающей выборке 0,7340: при <span class="math-inline" data-tex="\eta = 0{,}5"></span> потеря за 3000 шагов доходит до 0,2709, а при <span class="math-inline" data-tex="\eta = 2"></span> только до 0,2941, и точность падает до 0,8867.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout-red">
  <strong>Потеря и точность могут расходиться.</strong> Возьмите на этом
  же батче <span class="math-inline" data-tex="\eta = 1"></span>: потеря станет 0,6530, то есть
  лучше стартовых 0,6582. А доля верных ответов упадёт с 0,75 до 0,50: третий студент
  перевалит через порог 0,5 и будет назван сдавшим, хотя он не сдал. Спуск оптимизирует ту
  величину, которую ему дали, и точность в их число не входит: у неё производная равна нулю
  почти всюду, поэтому обучать по ней нечего.
</div>

<p>
  Дальше цикл повторяется: новый прямой проход, новая потеря, новый градиент. На всех 150 студентах
  при <span class="math-inline" data-tex="\eta = 0{,}5"></span> потеря за первый шаг падает с 0,3828 до 0,3627,
  к тридцатому шагу доходит до 0,3223, а к трёхтысячному до 0,2709. Параметры при этом приходят к
  <span class="math-inline" data-tex="\mathbf{w} = (2{,}3049;\ -3{,}4718)^\top"></span> и
  <span class="math-inline" data-tex="b = -4{,}8372"></span>.
</p>

<p>
  Точность ведёт себя иначе: после первого шага она падает с 0,90 до 0,86, хотя потеря
  уменьшилась, а через десять шагов возвращается к 0,90.
</p>

<div class="callout">
  <strong>Главная мысль части:</strong> направление даёт обратный проход, длину выбираете вы.
  Ошибка в направлении уводит модель не туда, слишком длинный шаг разгоняет потерю, слишком
  короткий просто стоит времени. Рост точности ни один из них не гарантирует: спуск уменьшает потерю, а точность меняется лишь вслед за ней.
</div>

---

## Часть 12. От таблицы к коду: три версии одного и того же

<p>
  Соберём всю математику в код. В реальных проектах данные читают из CSV, выгружают из базы
  или получают через API. Здесь оставим небольшой набор прямо в коде, чтобы путь от таблицы
  до обученной модели можно было проследить по каждому шагу.
</p>

### Данные: список → pandas → NumPy

<p>
  Данные удобно держать таблицей в pandas, а в NumPy переводить только те столбцы, которые нужны
  модели: признаки <span class="math-inline" data-tex="X"></span> и метки
  <span class="math-inline" data-tex="\mathbf{y}"></span>.
</p>

<pre><code>import numpy as np
import pandas as pd

# Шаг 1. Сырые данные — как выгрузка из ведомости.
# Каждый студент это словарь; на практике сюда же легли бы строки из CSV или БД.
records = [
    {"name": "Аружан",  "hours": 20, "missed": 5,  "passed": 0},
    {"name": "Данияр",  "hours": 40, "missed": 2,  "passed": 1},
    {"name": "Мария",   "hours": 30, "missed": 10, "passed": 0},
    {"name": "Тимур",   "hours": 20, "missed": 9,  "passed": 1},
    # ... всего 150 строк в обучающей выборке
]

# Шаг 2. Кладём в pandas — теперь это привычная таблица.
df = pd.DataFrame(records)
print(df.head())
print(df.groupby("passed")[["hours", "missed"]].mean())   # взгляд на разницу классов

# Шаг 3. Достаём в NumPy только нужные колонки: признаки X и метки y.
X = df[["hours", "missed"]].to_numpy(dtype=float)   # (n, 2)
y = df["passed"].to_numpy(dtype=float)              # (n,)</code></pre>

<div class="callout-blue">
  <strong>Почему признаки делят на десять:</strong> часы измеряются десятками, пропуски единицами. Если оставить как есть, у одного признака градиент окажется на порядок больше
  просто из-за единиц измерения, и допустимый шаг спуска упадёт почти в сто раз: 0,0078 вместо
  0,7340. Приведение к одному масштабу обходится дешевле других способов повысить устойчивость.
</div>

<pre><code># Масштабирование: часы в десятках часов, пропуски в десятках занятий.
# Ровно то, что в статье записано как x1 и x2.
X = X / np.array([10.0, 10.0])

# Более общий приём — стандартизация к среднему 0 и разбросу 1:
# X = (X - X.mean(axis=0)) / X.std(axis=0)</code></pre>

### Версия 1. Просто функции на NumPy

<p>
  Это «голая» математика из частей 6–11: модель сводится к матричному умножению и сигмоиде, обучение к циклу forward → loss → backward → update. Каждая строка здесь уже выведена выше вручную.
</p>

<pre><code>def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def forward(X, w, b):                  # FORWARD: ŷ = σ(X · w + b)
    return sigmoid(X @ w + b)          # [n,2]·[2,1] → [n,1]

def log_loss(yhat, y):                 # LOSS: средний −ln вероятности правды
    return -np.mean(y * np.log(yhat) + (1 - y) * np.log(1 - yhat))

def gradients(X, y, yhat):             # BACKWARD: выведено в части 9
    g = (yhat - y) / len(y)            # сигнал ошибки, [n]
    return X.T @ g, g.sum()            # ∂L/∂w — [2], ∂L/∂b — число

w = np.array([0.8, -1.0])              # стартовая догадка из части 7
b = -2.0
eta = 0.5                              # learning rate — длина шага

for step in range(3000):               # тот самый цикл из четырёх действий
    yhat = forward(X, w, b)
    dw, db = gradients(X, y, yhat)
    w -= eta * dw                      # UPDATE: θ ← θ − η · ∂L/∂θ
    b -= eta * db

print(np.round(w, 4), round(b, 4))     # [ 2.3049 -3.4718] -4.8372
print(round(log_loss(forward(X, w, b), y), 4))   # 0.2709</code></pre>

### Устойчивый счёт потери через логиты

<p>
  Наивная формула с <code>np.log(sigmoid(z))</code> ломается на больших по модулю логитах:
  при <span class="math-inline" data-tex="z \ge 37"></span> сигмоида в float64 округляется до единицы, и <span class="math-inline" data-tex="\ln(1-\hat y)"></span> даёт минус бесконечность, а при <span class="math-inline" data-tex="z \le -710"></span> то же происходит с <span class="math-inline" data-tex="\ln\hat y"></span>. Лечится тождеством, которое проверяется
  подстановкой обоих значений <span class="math-inline" data-tex="y"></span>:
</p>

<p><div class="math-display" data-tex="\ell = \ln\bigl(1 + e^{z}\bigr) - y\,z"></div></p>

<pre><code>def log_loss_stable(z, y):             # z — логиты, а не вероятности
    return np.mean(np.logaddexp(0, z) - y * z)

# np.logaddexp(0, z) считает ln(1 + e^z) без переполнения;
# так же считают BCEWithLogitsLoss в PyTorch и LogisticRegression в sklearn.</code></pre>

### Проверка градиента без формул

<p>
  Прежде чем доверять выведенному вручную backward, его стоит сверить с численной производной.
  Приём универсальный и работает для любой модели.
</p>

<pre><code>def numeric_grad(X, y, w, b, eps=1e-6):
    L = lambda w, b: log_loss(forward(X, w, b), y)
    g = np.zeros_like(w)
    for p in range(len(w)):
        e = np.zeros_like(w); e[p] = eps
        g[p] = (L(w + e, b) - L(w - e, b)) / (2 * eps)
    gb = (L(w, b + eps) - L(w, b - eps)) / (2 * eps)
    return g, gb
</code></pre>

### Почему здесь нет формулы, как у наименьших квадратов

<p>
  У линейной регрессии минимум находится одной строкой:
  <span class="math-inline" data-tex="\mathbf{w} = (X^\top X)^{-1}X^\top\mathbf{y}"></span>.
  Здесь так не получится. Приравняв градиент нулю, мы получаем
</p>

<p><div class="math-display" data-tex="X^\top\bigl(\sigma(X\mathbf{w} + b) - \mathbf{y}\bigr) = \mathbf{0}"></div></p>

<p>
  и это уравнение нелинейно относительно <span class="math-inline" data-tex="\mathbf{w}"></span>:
  веса стоят внутри сигмоиды, вынести их наружу нельзя. Когда минимум есть, его находят только итеративно: градиентным спуском, как у нас, или методом Ньютона, который в статистике
  называют IRLS. Библиотеки тоже считают итеративно: <code>sklearn</code> по умолчанию использует <span class="math-inline" data-tex="L"></span>-BFGS.
</p>

<pre><code>from sklearn.linear_model import LogisticRegression

# C=1e6 фактически отключает регуляризацию — иначе sklearn решает другую задачу
clf = LogisticRegression(C=1e6, max_iter=1000).fit(X, y)
print(clf.coef_, clf.intercept_, clf.n_iter_)
# sklearn за 13 итераций:     w = [2.3051, -3.4716], b = -4.8380
# наш спуск за 3000 шагов:   w = [2.3049, -3.4718], b = -4.8372</code></pre>

<div class="callout-red">
  <strong>Если классы разделяются прямой, минимума не существует.</strong> Возьмите четыре
  объекта, которые прямая делит без ошибок, и запустите спуск: потеря будет падать, а длина вектора весов расти без остановки. В одном таком примере <span class="math-inline" data-tex="\|\mathbf{w}\|"></span> равна 2,27 после ста шагов, 4,13
  после тысячи, 6,59 после десяти тысяч и 9,21 после ста тысяч, а потеря доходит до 0,000194
  и продолжает уменьшаться. Модель разгоняет уверенность до бесконечности, потому что за это
  ничего не штрафует. Ровно поэтому в <code>sklearn</code> регуляризация включена по умолчанию,
  и отключать её, как в примере выше, стоит только чтобы сравнить два численных метода.
</div>

<p>
  Наш батч из четырёх студентов как раз не разделяется прямой, поэтому минимум у него есть: спуск
  останавливается на потере 0,6278 при <span class="math-inline" data-tex="\mathbf{w} = (0{,}52;\ -1{,}46)^\top"></span>
  и <span class="math-inline" data-tex="b = -0{,}45"></span>. Причина видна на плоскости признаков: отрезок между
  сдавшими студентами 2 и 4 пересекает отрезок между несдавшими студентами 1 и 3. Прямая, которая
  разделила бы классы, должна была бы оставить каждый отрезок целиком на своей стороне, а в точке
  пересечения это невозможно.
</p>

### Версия 2. Тот же код, но в объектном виде

<p>
  Математика не меняется: те же forward, loss, градиенты и шаг складываются в класс. Это переход
  к тому, как модели устроены в библиотеках.
</p>

<pre><code>class LogisticRegressionScratch:
    def __init__(self, n_features):
        self.w = np.zeros(n_features)      # веса признаков
        self.b = 0.0                       # сдвиг

    def forward(self, X):                  # FORWARD
        return sigmoid(X @ self.w + self.b)

    def loss(self, yhat, y):               # LOSS
        return -np.mean(y * np.log(yhat) + (1 - y) * np.log(1 - yhat))

    def backward(self, X, y, yhat):        # BACKWARD
        g = (yhat - y) / len(y)
        self.dw = X.T @ g
        self.db = g.sum()

    def step(self, eta):                   # UPDATE
        self.w -= eta * self.dw
        self.b -= eta * self.db

    def fit(self, X, y, eta=0.5, epochs=3000):
        for _ in range(epochs):
            yhat = self.forward(X)
            self.backward(X, y, yhat)
            self.step(eta)

    def predict(self, X, threshold=0.5):   # решение появляется только здесь
        return (self.forward(X) >= threshold).astype(int)

model = LogisticRegressionScratch(n_features=2)
model.fit(X, y)
print(np.round(model.w, 4), round(model.b, 4))</code></pre>

### Версия 3. PyTorch и autograd

<p>
  Цикл остаётся тем же, но ручной вывод градиентов заменяется вызовом
  <code>loss.backward()</code>. PyTorch строит граф вычислений, как в части 8, и проходит по нему
  в обратном порядке, перемножая локальные производные. <code>BCEWithLogitsLoss</code> считает
  потерю сразу из логита, поэтому узла сигмоиды в таком графе нет, а производная по логиту
  получается та же: <span class="math-inline" data-tex="\hat y - y"></span>.
</p>

<pre><code>import torch
import torch.nn as nn

Xt = torch.tensor(X, dtype=torch.float32)
yt = torch.tensor(y, dtype=torch.float32).unsqueeze(1)

model = nn.Linear(2, 1)                    # MODEL: logits = X·w + b
loss_fn = nn.BCEWithLogitsLoss()           # LOSS: сигмоида + log loss устойчиво
opt = torch.optim.SGD(model.parameters(), lr=0.5)   # UPDATE

for step in range(3000):
    logits = model(Xt)                     # FORWARD
    loss = loss_fn(logits, yt)             # LOSS
    opt.zero_grad()                        # обнулить прошлые градиенты
    loss.backward()                        # BACKWARD — вместо наших формул
    opt.step()                             # UPDATE

probs = torch.sigmoid(model(Xt))           # вероятности — уже после обучения</code></pre>

<div class="callout-yellow">
  <strong>Не ставьте сигмоиду в модель, если берёте BCEWithLogitsLoss.</strong> Эта функция
  потерь ждёт логиты и применяет сигмоиду внутри, устойчивым способом из раздела выше. Если
  подать ей уже готовые вероятности, сигмоида применится дважды: обучение не упадёт с ошибкой,
  но пойдёт заметно хуже, и найти такую опечатку тяжело. Второй классический промах: забыть <code>zero_grad</code>: PyTorch градиенты накапливает, а не перезаписывает.
</div>

### Итоговая карта одного шага обучения

<table class="shape-table">
  <tr><th>Действие</th><th>Формула</th><th>NumPy</th><th>PyTorch</th></tr>
  <tr><td>forward</td><td><span class="math-inline" data-tex="\hat{\mathbf{y}} = \sigma(X\mathbf{w} + b)"></span></td><td><code>sigmoid(X @ w + b)</code></td><td><code>model(Xt)</code></td></tr>
  <tr><td>loss</td><td><span class="math-inline" data-tex="L = -\frac{1}{N}\sum[y\ln\hat y + (1-y)\ln(1-\hat y)]"></span></td><td><code>log_loss(yhat, y)</code></td><td><code>loss_fn(logits, yt)</code></td></tr>
  <tr><td>backward</td><td><span class="math-inline" data-tex="\nabla_{\mathbf{w}} L = \frac{1}{N}X^\top(\hat{\mathbf{y}}-\mathbf{y})"></span></td><td><code>X.T @ g</code></td><td><code>loss.backward()</code></td></tr>
  <tr><td>update</td><td><span class="math-inline" data-tex="\theta \leftarrow \theta - \eta\nabla_\theta L"></span></td><td><code>w -= eta * dw</code></td><td><code>opt.step()</code></td></tr>
</table>

<div class="callout">
  <strong>Главная мысль части:</strong> между формулами из этой статьи и строчками PyTorch нет
  разрыва. Библиотека считает то же, что мы считали руками, только быстрее, устойчивее к переполнению и без вывода производных заново для каждой новой модели.
</div>

---

## Часть 13. Анатомия обучения: так устроены все модели

<p>
  Всё, что разобрано выше, работает и за пределами логистической регрессии: это скелет обучения любой модели с градиентным спуском. Меняется содержимое блоков, но не их порядок, и теперь,
  когда каждое звено посчитано руками, на этот скелет можно посмотреть целиком.
</p>

<p>Посмотрим пошагово, из каких блоков состоит обучение любой модели.</p>

<div class="stage" id="stageCY" tabindex="0">
  <div class="stage-figure">
<svg id="cy" viewBox="0 0 960 522" role="img" aria-label="Анатомия обучения: Task, Data, Model, Loss и цикл между ними">
  <style>
    #cy { font-family: Helvetica, Arial, sans-serif; }
    #cy .lbl { font-size: 16px; fill: #111111; }
    #cy .cap { font-size: 13px; fill: #5E5850; }
    #cy .dim { font-size: 13px; fill: #5E5850; font-weight: 700; }
    #cy .nm  { font-size: 14px; fill: #111111; font-weight: 700; }
    #cy .val { font-size: 14px; fill: #111111; }
    #cy .mm  { font-size: 12px; fill: #5E5850; }
    #cy .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="cy-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="cy-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="cy-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="cy-ary" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8F7406"/></marker>
    <marker id="cy-arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
<text x="480" y="34" font-size="13" fill="#5E5850" font-weight="400" text-anchor="middle">Task · Data · Model · Loss: один и тот же каркас для всех моделей</text>
<rect x="30" y="54" width="376" height="432" rx="14" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.6"/>
<text x="54" y="92" font-size="20" fill="#111111" font-weight="800" text-anchor="start">Анатомия обучения</text>
<text x="54" y="124" font-size="15" fill="#111111" font-weight="400" text-anchor="start">У любой модели, от логистической регрессии</text>
<text x="54" y="146" font-size="15" fill="#111111" font-weight="400" text-anchor="start">до GPT, обучение устроено одинаково.</text>
<text x="54" y="186" font-size="15" fill="#111111" font-weight="700" text-anchor="start">Четыре блока</text>
<text x="54" y="214" font-size="15" fill="#3576C0" font-weight="700" text-anchor="start">Task</text>
<foreignObject x="122" y="191" width="270" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" ><span>что мы вообще делаем</span></div></foreignObject>
<text x="54" y="242" font-size="15" fill="#3576C0" font-weight="700" text-anchor="start">Data</text>
<foreignObject x="122" y="219" width="270" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" ><span>примеры <span data-tex="(x,\  y)"></span></span></div></foreignObject>
<text x="54" y="270" font-size="15" fill="#3576C0" font-weight="700" text-anchor="start">Model</text>
<foreignObject x="122" y="247" width="270" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" ><span>то, что обучаем</span></div></foreignObject>
<text x="54" y="298" font-size="15" fill="#C30B0A" font-weight="700" text-anchor="start">Loss</text>
<foreignObject x="122" y="275" width="270" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" ><span>насколько ошибается</span></div></foreignObject>
<text x="54" y="346" font-size="15" fill="#111111" font-weight="700" text-anchor="start">Один цикл, тысячи повторений</text>
<foreignObject x="54" y="361" width="130" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" data-tex="\hat y = f_\theta(x)"></div></foreignObject>
<text x="192" y="381" font-size="15" fill="#5E5850" font-weight="400" text-anchor="start">модель предсказывает</text>
<foreignObject x="54" y="393" width="130" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" data-tex="L(\hat y,\ y)"></div></foreignObject>
<text x="192" y="413" font-size="15" fill="#5E5850" font-weight="400" text-anchor="start">потеря считает ошибку</text>
<foreignObject x="54" y="425" width="130" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:15px;color:#111111;font-weight:400" data-tex="\theta \leftarrow \theta - \eta\nabla_\theta L"></div></foreignObject>
<text x="192" y="445" font-size="15" fill="#5E5850" font-weight="400" text-anchor="start">модель обновляется</text>
<g data-key="task"><rect x="620" y="54" width="240" height="62" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.6"/><text x="740" y="80" font-size="17" fill="#3576C0" font-weight="700" text-anchor="middle">Task</text><text x="740" y="102" font-size="13" fill="#5E5850" font-weight="400" text-anchor="middle">определяет вид потери</text><line x1="740" y1="118" x2="740" y2="146" stroke="#5E5850" stroke-width="1.6" marker-end="url(#cy-arw)"/></g>
<g data-key="loss"><rect x="620" y="150" width="240" height="92" rx="14" fill="#FFF7F7" stroke="#C30B0A" stroke-width="1.6"/><text x="740" y="176" font-size="17" fill="#C30B0A" font-weight="700" text-anchor="middle">Loss</text><foreignObject x="630" y="186" width="220" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="L(\hat y,\ y)"></div></foreignObject><text x="740" y="228" font-size="12.5" fill="#5E5850" font-weight="400" text-anchor="middle">промах модели одним числом</text></g>
<g data-key="data"><rect x="424" y="264" width="122" height="110" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.6"/><text x="485" y="294" font-size="17" fill="#3576C0" font-weight="700" text-anchor="middle">Data</text><foreignObject x="430" y="306" width="110" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="(x,\ y)"></div></foreignObject><text x="485" y="348" font-size="12.5" fill="#5E5850" font-weight="400" text-anchor="middle">вход и правда</text><line x1="548" y1="290" x2="616" y2="212" stroke="#5E5850" stroke-width="1.6" marker-end="url(#cy-arw)"/><line x1="548" y1="348" x2="616" y2="426" stroke="#5E5850" stroke-width="1.6" marker-end="url(#cy-arw)"/><foreignObject x="551" y="224" width="30" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#3576C0;font-weight:400" data-tex="y"></div></foreignObject><foreignObject x="551" y="390" width="30" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#3576C0;font-weight:400" data-tex="x"></div></foreignObject></g>
<g data-key="model"><rect x="620" y="396" width="240" height="80" rx="14" fill="#FFFFFF" stroke="#3576C0" stroke-width="1.6"/><text x="740" y="424" font-size="17" fill="#3576C0" font-weight="700" text-anchor="middle">Model</text><foreignObject x="630" y="436" width="220" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\hat y = f_\theta(x)"></div></foreignObject></g>
<g data-key="cycle" data-only="1"><path d="M 680 394 C 628 358 628 280 680 244" fill="none" stroke="#8F7406" stroke-width="2.8" marker-end="url(#cy-ary)"/><path d="M 800 244 C 852 280 852 358 800 394" fill="none" stroke="#C30B0A" stroke-width="2.8" stroke-dasharray="7 5" marker-end="url(#cy-arr)"/><rect x="658" y="292" width="164" height="54" rx="27" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="740" y="311" font-size="12" fill="#5E5850" font-weight="400" text-anchor="middle">один шаг обучения</text><foreignObject x="660" y="317" width="160" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\theta \leftarrow \theta - \eta\nabla_\theta L"></div></foreignObject><foreignObject x="576" y="293" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#8F7406;font-weight:400;justify-content:flex-end" data-tex="\hat y"></div></foreignObject><text x="626" y="338" font-size="12.5" fill="#8F7406" font-weight="700" text-anchor="end">вперёд</text><foreignObject x="854" y="293" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit " style="font-size:16px;color:#9C0908;font-weight:400" data-tex="\nabla_\theta L"></div></foreignObject><text x="854" y="338" font-size="12.5" fill="#9C0908" font-weight="700" text-anchor="start">назад</text></g>
<text x="40" y="508" font-size="13" fill="#5E5850" font-weight="400" text-anchor="start">синие блоки: что задаёт задача · красный: то, что измеряет промах и порождает градиенты</text>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="task loss data model" data-focus="task loss data model">
      <div class="step-kicker">Шаг 1 · четыре блока</div>
      <h4>Каркас, который не меняется</h4>
<p>У любой задачи машинного обучения есть Task, Data, Model и Loss. Всё остальное относится к деталям реализации: какая именно модель внутри и как считается градиент.</p>
<p>Эта часть стоит в конце статьи не случайно: теперь у каждого из четырёх слов есть конкретное содержание, которое вы посчитали руками.</p>
    </div>
    <div class="step-panel" data-on="task" data-focus="task">
      <div class="step-kicker">Шаг 2 · Task</div>
      <h4>Задача определяет всё остальное</h4>
<p>Мы предсказываем класс: сдаст или нет. Отсюда следует и выбор функции потерь: для бинарной классификации берут log loss, для нескольких классов кросс-энтропию с softmax, для регрессии квадрат ошибки.</p>
<p>Task единственный блок, который не выбирают: он приходит извне вместе с задачей.</p>
    </div>
    <div class="step-panel" data-on="data" data-focus="data">
      <div class="step-kicker">Шаг 3 · Data</div>
      <h4>Пары «вход и правильный ответ»</h4>
<p>Для нас это 150 студентов: матрица <span class="math-inline" data-tex="X"></span> и столбец меток из нулей и единиц. Данные не меняются при обучении и целиком определяют, чему модель способна научиться.</p>
<p>В части 1 было видно, что это ограничение реальное: по одним часам потеря 0,3517, по двум признакам 0,2709.</p>
    </div>
    <div class="step-panel" data-on="model" data-focus="model">
      <div class="step-kicker">Шаг 4 · Model</div>
      <h4>То, что обучаем</h4>
<p>Здесь это три числа и правило <span class="math-inline" data-tex="\hat{\mathbf{y}} = \sigma(X\mathbf{w} + b)"></span>. В линейной регрессии сигмоиды нет, в нейросети слоёв несколько, в трансформере весов миллиарды.</p>
<p>Модель принимает <span class="math-inline" data-tex="x"></span> и выдаёт <span class="math-inline" data-tex="\hat y"></span>. Больше от неё ничего не требуется.</p>
    </div>
    <div class="step-panel" data-on="loss" data-focus="loss">
      <div class="step-kicker">Шаг 5 · Loss</div>
      <h4>Одно число, которое можно уменьшать</h4>
<p>Loss сравнивает <span class="math-inline" data-tex="\hat y"></span> с настоящим ответом и выдаёт скаляр. Именно скаляр: по столбцу вероятностей нельзя сказать, какая модель лучше, а по одному числу можно.</p>
<p>И у этого числа есть производная по каждому параметру, ради неё всё и затевалось. Точность, кстати, такого числа не даёт: у неё производная равна нулю почти всюду.</p>
    </div>
    <div class="step-panel" data-on="task loss data model cycle" data-focus="cycle">
      <div class="step-kicker">Шаг 6 · цикл</div>
      <h4>Предсказание вперёд, градиенты назад</h4>
<p>Модель отдаёт <span class="math-inline" data-tex="\hat y"></span> в Loss, Loss возвращает градиенты в Model, и параметры сдвигаются на шаг против градиента. Один оборот даёт один шаг обучения; таких оборотов тысячи.</p>
<p>Именно этот круг мы прошли по частям: forward в частях 6 и 7, потеря там же, backward в частях 8–10, шаг в части 11. Ничего сверх этого в обучении не происходит: ни у логистической регрессии, ни у языковой модели.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<p>
  Меняется только содержимое блоков. Вот как выглядит та же таблица для трёх разных моделей.
</p>

<table class="shape-table">
  <tr><th>Блок</th><th>Линейная регрессия</th><th>Логистическая регрессия</th><th>Полносвязная сеть</th></tr>
  <tr><td>Прямой проход</td><td><span class="math-inline" data-tex="X\mathbf{w}+b"></span></td><td><span class="math-inline" data-tex="\sigma(X\mathbf{w}+b)"></span></td><td>несколько слоёв <span class="math-inline" data-tex="AW+\mathbf{b}"></span> с активациями</td></tr>
  <tr><td>Потеря</td><td>MSE</td><td>log loss</td><td>кросс-энтропия или MSE</td></tr>
  <tr><td>Сигнал ошибки</td><td><span class="math-inline" data-tex="\frac{2}{N}(\hat{\mathbf{y}}-\mathbf{y})"></span></td><td><span class="math-inline" data-tex="\frac{1}{N}(\hat{\mathbf{y}}-\mathbf{y})"></span></td><td>то же, дальше через слои</td></tr>
  <tr><td>Градиент весов</td><td><span class="math-inline" data-tex="X^\top\cdot\text{сигнал}"></span></td><td><span class="math-inline" data-tex="X^\top\cdot\text{сигнал}"></span></td><td><span class="math-inline" data-tex="A^\top\cdot\text{сигнал}"></span> на каждом слое</td></tr>
  <tr><td>Шаг</td><td colspan="3"><span class="math-inline" data-tex="\theta\leftarrow\theta-\eta\nabla_\theta L"></span>: одинаково везде</td></tr>
</table>

<p>
  Обратите внимание на две средние строки. Сигнал ошибки у обеих моделей строится из разности «предсказал минус правда», хотя выводился он из совершенно разных функций потерь. А строка
  с градиентом весов совпадает у всех трёх: транспонированная матрица входов, умноженная на сигнал ошибки, работает для любого линейного слоя, откуда бы сигнал ни пришёл.
</p>

<p>Весь цикл обучения на numpy умещается в шесть строк, и каждая уже разобрана:</p>

<pre><code>for step in range(3000):
    z    = X @ w + b          # логиты, часть 5
    yhat = 1 / (1 + np.exp(-z))   # сигмоида, часть 5
    g    = (yhat - y) / len(y)    # сигнал ошибки, часть 9
    w   -= eta * (X.T @ g)        # градиент весов, часть 9
    b   -= eta * g.sum()          # градиент сдвига, часть 9
</code></pre>

<p>
  В PyTorch строка с <code>g</code> заменяется на <code>loss.backward()</code>, а две последние на <code>opt.step()</code>, но считается там то же самое: библиотека строит граф, как в части 8, и проходит по нему в обратном порядке, перемножая локальные производные.
</p>

### Что важно уметь восстановить по памяти

<div class="end-list">
  <ol>
    <li>Данные: матрица <span class="math-inline" data-tex="X\in\mathbb{R}^{N\times P}"></span> и столбец меток <span class="math-inline" data-tex="\mathbf{y}\in\{0,1\}^{N\times 1}"></span>. Строка соответствует объекту, столбец признаку.</li>
    <li>Модель задают <span class="math-inline" data-tex="P+1"></span> чисел: <span class="math-inline" data-tex="\hat{\mathbf{y}} = \sigma(X\mathbf{w} + b)"></span>. Линейная часть даёт логит, сигмоида делает из него вероятность.</li>
    <li>Логит равен логарифму отношения шансов, поэтому вес читается как множитель к шансам: <span class="math-inline" data-tex="e^{w_p}"></span> на единицу признака.</li>
    <li>Потеря: <span class="math-inline" data-tex="L = -\frac{1}{N}\sum[y\ln\hat y + (1-y)\ln(1-\hat y)]"></span>, выводится из правдоподобия. Ориентир: <span class="math-inline" data-tex="\ln 2 = 0{,}6931"></span>, цена ответа «не знаю».</li>
    <li>Локальные производные: <span class="math-inline" data-tex="\partial\ell/\partial\hat y = (\hat y - y)/[\hat y(1-\hat y)]"></span> и <span class="math-inline" data-tex="\partial\hat y/\partial z = \hat y(1-\hat y)"></span>.</li>
    <li>Они сокращаются нацело: <span class="math-inline" data-tex="\partial\ell/\partial z = \hat y - y"></span>. Это главная формула статьи.</li>
    <li>Отсюда <span class="math-inline" data-tex="\nabla_{\mathbf{w}}L = \frac{1}{N}X^\top(\hat{\mathbf{y}}-\mathbf{y})"></span> и <span class="math-inline" data-tex="\partial L/\partial b = \frac{1}{N}\sum_n(\hat y_n - y_n)"></span>, как у линейной регрессии, только без двойки.</li>
    <li><span class="math-inline" data-tex="X^\top"></span> появляется затем, чтобы свернуть ось объектов и оставить ось признаков; форма градиента всегда равна форме параметра.</li>
    <li>Аналитический градиент сверяется численно: <span class="math-inline" data-tex="(L(\theta+\varepsilon)-L(\theta-\varepsilon))/2\varepsilon"></span> при <span class="math-inline" data-tex="\varepsilon=10^{-6}"></span>.</li>
    <li>Шаг: <span class="math-inline" data-tex="\theta \leftarrow \theta - \eta\nabla_\theta L"></span>; закрытой формулы нет, а на разделимых данных нет и минимума: веса уходят в бесконечность.</li>
  </ol>
</div>

<p>
  Если вы поняли логистическую регрессию, каркас современных моделей у вас в кармане. Дальше
  идут вариации: другие архитектуры, другие функции потерь, другие оптимизаторы. Цикл обучения остаётся тем же: forward, потеря, backward, шаг, миллионы раз.
</p>

