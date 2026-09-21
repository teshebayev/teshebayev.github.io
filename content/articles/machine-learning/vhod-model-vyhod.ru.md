> **В этой статье.** Прежде чем разбираться, *как* модель машинного обучения учится и что у неё внутри, полезно посмотреть на неё снаружи — как на **чёрную коробку**. У коробки есть только две стороны, которые нас сейчас интересуют: что мы в неё *кладём* (вход) и что из неё *достаём* (выход). Оказывается, почти все задачи ML можно разложить именно по этим двум осям. И заодно станет понятно, почему выбор самой модели — это во многом следствие того, *что у нас на входе* и *что мы хотим на выходе*.

## 1. Карта машинного обучения: три области

Прежде чем открывать коробку, полезно увидеть карту целиком. Машинное обучение обычно делят на три большие области — по тому, **как** модель учится и какую обратную связь она при этом получает.

- **Обучение с учителем (Supervised)** — у каждого примера есть правильный ответ. Модель учится на парах «*вход → правильный выход*».
- **Обучение без учителя (Unsupervised)** — правильных ответов нет. Модель сама ищет структуру в данных: кластеры, закономерности, сжатые представления.
- **Обучение с подкреплением (Reinforcement Learning)** — агент действует в среде, получает награды или штраф и учится максимизировать награду.

Дальше статья будет говорить в основном про **обучение с учителем**: именно сам взгляд «вход → модель → выход *с правильным ответом*» работает напрямую. Но сначала — короткая прогулка по всем трём областям.

<div class="stage" id="stageParadigms" tabindex="0">
  <div class="stage-figure">
<svg id="mlParadigmsMap" viewBox="0 90 960 470" role="img" aria-label="Три области машинного обучения">
  <style>
    #mlParadigmsMap { font-family: Helvetica, Arial, sans-serif; }
    #mlParadigmsMap .text { font-size:16px; fill:#111111; }
    #mlParadigmsMap .small { font-size:13px; fill:#5E5850; }
    #mlParadigmsMap .label { font-size:14px; font-weight:700; fill:#111111; }
    #mlParadigmsMap .box-blue { fill:#ffffff; stroke:#3576C0; stroke-width:1.5; rx:14; }
    #mlParadigmsMap .box-yellow { fill:#FFFBEB; stroke:#C29E08; stroke-width:1.5; rx:14; }
    #mlParadigmsMap .box-green { fill:#F0FAF0; stroke:#73B222; stroke-width:1.5; rx:14; }
    #mlParadigmsMap .box-red { fill:#FFF2F2; stroke:#C30B0A; stroke-width:1.5; rx:14; }
    #mlParadigmsMap .box-gray { fill:#F6F5F3; stroke:#5E5850; stroke-width:1.2; rx:14; }
    #mlParadigmsMap .box-dark { fill:#1b1d26; rx:16; }
  </style>
  <defs>
    <marker id="mpArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
    <marker id="mpArrowY" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#C29E08"/>
    </marker>
  </defs>

  <g data-key="step1" data-only="1">
    <rect class="box-dark" x="360" y="116" width="240" height="64"/>
    <text x="480" y="146" text-anchor="middle" font-size="18" font-weight="800" fill="#ffffff">Машинное обучение</text>
    <text x="480" y="168" text-anchor="middle" font-size="13" fill="#c7c7d1">три способа учиться</text>

    <line x1="470" y1="180" x2="205" y2="300" stroke="#5E5850" stroke-width="2" marker-end="url(#mpArrow)"/>
    <line x1="480" y1="180" x2="480" y2="300" stroke="#5E5850" stroke-width="2" marker-end="url(#mpArrow)"/>
    <line x1="490" y1="180" x2="755" y2="300" stroke="#5E5850" stroke-width="2" marker-end="url(#mpArrow)"/>

    <rect class="box-blue" x="70" y="305" width="250" height="155"/>
    <text x="195" y="345" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">С учителем</text>
    <text x="195" y="368" text-anchor="middle" class="small">Supervised</text>
    <text x="195" y="404" text-anchor="middle" class="small" fill="#111111">есть правильные ответы</text>
    <text x="195" y="426" text-anchor="middle" class="small" fill="#111111">учимся на парах вход → ответ</text>

    <rect class="box-blue" x="355" y="305" width="250" height="155"/>
    <text x="480" y="345" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">Без учителя</text>
    <text x="480" y="368" text-anchor="middle" class="small">Unsupervised</text>
    <text x="480" y="404" text-anchor="middle" class="small" fill="#111111">ответов нет</text>
    <text x="480" y="426" text-anchor="middle" class="small" fill="#111111">ищем структуру в данных</text>

    <rect class="box-blue" x="640" y="305" width="250" height="155"/>
    <text x="765" y="345" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">С подкреплением</text>
    <text x="765" y="368" text-anchor="middle" class="small">Reinforcement</text>
    <text x="765" y="404" text-anchor="middle" class="small" fill="#111111">награда или штраф</text>
    <text x="765" y="426" text-anchor="middle" class="small" fill="#111111">учимся действовать</text>

    <text x="480" y="520" class="text" text-anchor="middle" font-weight="700">Различаются тем, что (и есть ли вообще) модель получает в ответ на свои попытки</text>
  </g>

  <g data-key="step2" data-only="1">
    <text x="250" y="150" text-anchor="middle" class="label" fill="#3576C0">вход (x)</text>
    <text x="650" y="150" text-anchor="middle" class="label" fill="#73B222">правильный ответ (y)</text>

    <rect class="box-blue" x="120" y="172" width="260" height="60"/>
    <text x="250" y="208" text-anchor="middle" class="text">фото животного</text>
    <line x1="395" y1="202" x2="505" y2="202" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
    <rect class="box-green" x="520" y="172" width="260" height="60"/>
    <text x="650" y="208" text-anchor="middle" class="text" font-weight="700" fill="#73B222">«кошка»</text>

    <rect class="box-blue" x="120" y="252" width="260" height="76"/>
    <text x="250" y="284" text-anchor="middle" class="text">площадь дома, м²</text>
    <text x="250" y="306" text-anchor="middle" class="small">упрощённый фрагмент Ames Housing</text>
    <line x1="395" y1="290" x2="505" y2="290" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
    <rect class="box-green" x="520" y="252" width="260" height="76"/>
    <text x="650" y="296" text-anchor="middle" class="text" font-weight="700" fill="#73B222">цена: 215 000 $</text>

    <rect class="box-blue" x="120" y="348" width="260" height="60"/>
    <text x="250" y="384" text-anchor="middle" class="text">текст письма</text>
    <line x1="395" y1="378" x2="505" y2="378" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
    <rect class="box-green" x="520" y="348" width="260" height="60"/>
    <text x="650" y="384" text-anchor="middle" class="text" font-weight="700" fill="#73B222">«спам»</text>

    <text x="480" y="468" class="small" text-anchor="middle">Модель видит много таких пар и учится сама давать правильный ответ на новом входе</text>
  </g>

  <g data-key="step3" data-only="1">
    <text x="225" y="172" text-anchor="middle" class="label">данные без меток</text>
    <rect class="box-gray" x="90" y="186" width="270" height="260"/>
    <circle cx="150" cy="248" r="6" fill="#5E5850"/>
    <circle cx="185" cy="282" r="6" fill="#5E5850"/>
    <circle cx="160" cy="320" r="6" fill="#5E5850"/>
    <circle cx="210" cy="262" r="6" fill="#5E5850"/>
    <circle cx="135" cy="298" r="6" fill="#5E5850"/>
    <circle cx="298" cy="392" r="6" fill="#5E5850"/>
    <circle cx="320" cy="362" r="6" fill="#5E5850"/>
    <circle cx="300" cy="420" r="6" fill="#5E5850"/>
    <circle cx="262" cy="402" r="6" fill="#5E5850"/>
    <circle cx="332" cy="408" r="6" fill="#5E5850"/>

    <line x1="372" y1="316" x2="452" y2="316" stroke="#C29E08" stroke-width="2.5" marker-end="url(#mpArrowY)"/>
    <text x="412" y="298" text-anchor="middle" class="small" font-weight="700" fill="#C29E08">находим</text>
    <text x="412" y="346" text-anchor="middle" class="small" font-weight="700" fill="#C29E08">структуру</text>

    <text x="735" y="172" text-anchor="middle" class="label">модель нашла группы</text>
    <rect class="box-gray" x="600" y="186" width="270" height="260"/>
    <ellipse cx="690" cy="288" rx="78" ry="72" fill="#3576C0" fill-opacity="0.07" stroke="#3576C0" stroke-width="1.5" stroke-dasharray="5 4"/>
    <ellipse cx="798" cy="388" rx="58" ry="50" fill="#73B222" fill-opacity="0.07" stroke="#73B222" stroke-width="1.5" stroke-dasharray="5 4"/>
    <circle cx="660" cy="248" r="6" fill="#3576C0"/>
    <circle cx="695" cy="282" r="6" fill="#3576C0"/>
    <circle cx="670" cy="320" r="6" fill="#3576C0"/>
    <circle cx="720" cy="262" r="6" fill="#3576C0"/>
    <circle cx="645" cy="298" r="6" fill="#3576C0"/>
    <circle cx="790" cy="388" r="6" fill="#73B222"/>
    <circle cx="815" cy="366" r="6" fill="#73B222"/>
    <circle cx="795" cy="412" r="6" fill="#73B222"/>
    <circle cx="765" cy="398" r="6" fill="#73B222"/>
    <circle cx="822" cy="402" r="6" fill="#73B222"/>

    <text x="480" y="492" class="small" text-anchor="middle">Похожие объекты собираются в кластеры. Так же ищут закономерности и сжатые представления</text>
  </g>

  <g data-key="step4" data-only="1">
    <rect class="box-blue" x="110" y="238" width="220" height="120"/>
    <text x="220" y="292" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">Агент</text>
    <text x="220" y="320" text-anchor="middle" class="small">напр., робот-рука</text>

    <rect class="box-gray" x="630" y="238" width="220" height="120"/>
    <text x="740" y="292" text-anchor="middle" class="text" font-weight="800">Среда</text>
    <text x="740" y="320" text-anchor="middle" class="small">мир / задача</text>

    <line x1="332" y1="270" x2="626" y2="270" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
    <text x="480" y="258" text-anchor="middle" class="small" font-weight="700">действие</text>

    <line x1="628" y1="332" x2="334" y2="332" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>
    <text x="480" y="354" text-anchor="middle" class="small" font-weight="700">новое состояние + сигнал</text>

    <rect class="box-green" x="250" y="408" width="210" height="56"/>
    <text x="355" y="442" text-anchor="middle" class="text" font-weight="700" fill="#73B222">+ награда за успех</text>
    <rect class="box-red" x="500" y="408" width="210" height="56"/>
    <text x="605" y="442" text-anchor="middle" class="text" font-weight="700" fill="#C30B0A">− штраф за ошибку</text>

    <text x="480" y="512" class="small" text-anchor="middle">Цель — выбирать действия так, чтобы суммарная награда была максимальной</text>
  </g>

  <g data-key="step5" data-only="1">
    <rect class="box-blue" x="70" y="140" width="260" height="50"/>
    <text x="200" y="172" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">С учителем</text>
    <rect class="box-blue" x="350" y="140" width="260" height="50"/>
    <text x="480" y="172" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">Без учителя</text>
    <rect class="box-blue" x="630" y="140" width="260" height="50"/>
    <text x="760" y="172" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">С подкреплением</text>

    <rect class="box-gray" x="70" y="200" width="260" height="220"/>
    <rect class="box-gray" x="350" y="200" width="260" height="220"/>
    <rect class="box-gray" x="630" y="200" width="260" height="220"/>

    <text x="90" y="238" class="small">Вход:</text>
    <text x="90" y="260" class="text">данные + метки</text>
    <text x="90" y="308" class="small">Правильный ответ:</text>
    <text x="90" y="330" class="text" fill="#73B222" font-weight="700">дан заранее</text>
    <text x="90" y="378" class="small">Учится:</text>
    <text x="90" y="400" class="text">повторять ответ</text>

    <text x="370" y="238" class="small">Вход:</text>
    <text x="370" y="260" class="text">только данные</text>
    <text x="370" y="308" class="small">Правильный ответ:</text>
    <text x="370" y="330" class="text" fill="#C30B0A" font-weight="700">нет</text>
    <text x="370" y="378" class="small">Учится:</text>
    <text x="370" y="400" class="text">находить структуру</text>

    <text x="650" y="238" class="small">Вход:</text>
    <text x="650" y="260" class="text">опыт в среде</text>
    <text x="650" y="308" class="small">Правильный ответ:</text>
    <text x="650" y="330" class="text" fill="#C29E08" font-weight="700">только награда</text>
    <text x="650" y="378" class="small">Учится:</text>
    <text x="650" y="400" class="text">стратегию действий</text>

    <text x="480" y="478" class="small" text-anchor="middle">Точный ответ • ничего • награда — вот три разных вида обратной связи</text>
  </g>

  <g data-key="step6" data-only="1">
    <rect class="box-blue" x="320" y="120" width="320" height="48"/>
    <text x="480" y="151" text-anchor="middle" class="text" font-weight="800" fill="#3576C0">Обучение с учителем (Supervised)</text>

    <rect class="box-blue" x="60" y="288" width="190" height="100"/>
    <text x="155" y="334" text-anchor="middle" class="text" font-weight="700">вход x</text>
    <text x="155" y="360" text-anchor="middle" class="small">данные</text>

    <line x1="256" y1="338" x2="372" y2="338" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>

    <rect class="box-dark" x="380" y="278" width="200" height="120"/>
    <text x="480" y="332" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">Модель</text>
    <text x="480" y="360" text-anchor="middle" font-size="13" fill="#c7c7d1">чёрная коробка</text>

    <line x1="586" y1="338" x2="702" y2="338" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mpArrow)"/>

    <rect class="box-green" x="710" y="288" width="190" height="100"/>
    <text x="805" y="328" text-anchor="middle" class="text" font-weight="700" fill="#73B222">выход ŷ</text>
    <text x="805" y="356" text-anchor="middle" class="small" fill="#111111">сравниваем с правильным ответом</text>

    <text x="480" y="468" class="text" text-anchor="middle" font-weight="700">Именно здесь работает шаблон «вход → модель → выход»</text>
    <text x="480" y="500" class="small" text-anchor="middle">Дальше открываем эту коробку — но сначала смотрим на неё снаружи</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · три области</div>
      <h4>ML делится на три области</h4>
      <p>Три области различаются тем, как модель учится и какую обратную связь получает: с учителем, без учителя и с подкреплением. Это деление задаёт саму природу задачи ещё до выбора конкретного алгоритма.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · с учителем</div>
      <h4>Учимся на парах «вход → правильный ответ»</h4>
      <p>У каждого примера — фото, площади дома, текста письма — заранее известен верный ответ. Модель видит много таких пар и учится сама давать правильный ответ на новом, ранее не встречавшемся входе.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · без учителя</div>
      <h4>Структура находится без готовых ответов</h4>
      <p>Меток никто не дал. Модель сама ищет закономерности в данных — например, собирает похожие объекты в кластеры, как на схеме справа. Так же ищут и другие виды структуры: сжатые представления, аномалии.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · с подкреплением</div>
      <h4>Агент действует и получает награду или штраф</h4>
      <p>Агент пробует действия в среде, получает новое состояние и сигнал — награду за успех или штраф за ошибку. Цель — выбирать действия так, чтобы суммарная награда со временем была максимальной.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · три вида обратной связи</div>
      <h4>Ключевое различие — что видит модель в ответ</h4>
      <p>С учителем ответ дан заранее и точен. Без учителя ответа нет вовсе. С подкреплением есть только награда — оценка успеха, а не готовый правильный ответ. Это три принципиально разных вида обратной связи.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Шаг 6 · где мы дальше</div>
      <h4>Дальше статья — про обучение с учителем</h4>
      <p>Именно здесь работает шаблон «вход → модель → выход»: есть данные, есть правильный ответ, с которым можно сравнить предсказание. Дальше мы откроем эту коробку — но сначала посмотрим на неё снаружи.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

## 2. Модель как чёрная коробка

Представим, что модель — это закрытая коробка с двумя отверстиями. В одно мы что-то подаём, из другого что-то получаем. Что происходит внутри — пока не важно: возможно, там линейная формула, возможно, дерево решений, возможно, нейросеть на сто слоёв. С точки зрения «снаружи» это всё одно и то же — **функция**:

$$\text{выход} = f(\text{вход})$$

Такой взгляд кажется упрощением, но он невероятно полезен. Он позволяет:

- **классифицировать любую задачу ML** по двум признакам — *форма входа* и *тип выхода*;
- **отделить постановку задачи от реализации**: сначала решаем, что подаём и что хотим получить, и только потом выбираем конкретную модель;
- увидеть, что совершенно разные на первый взгляд задачи (предсказать цену дома, узнать кошку на фото, угадать следующее слово) — это один и тот же шаблон **вход → f → выход**.

Дальше мы по очереди откроем обе стороны коробки. Сначала — что бывает на входе. Потом — что бывает на выходе. А внутрь специально заглядывать не будем: это тема следующей статьи.
<div class="stage" id="stageBlackBox" tabindex="0">
  <div class="stage-figure">
<svg id="blackBoxOverview" viewBox="0 140 960 420" role="img" aria-label="Вход — модель — выход как чёрная коробка">
  <style>
    #blackBoxOverview { font-family: Helvetica, Arial, sans-serif; }
    #blackBoxOverview .text { font-size:16px; fill:#111111; }
    #blackBoxOverview .small { font-size:13px; fill:#5E5850; }
    #blackBoxOverview .box-blue { fill:#ffffff; stroke:#3576C0; stroke-width:1.5; rx:14; }
    #blackBoxOverview .box-yellow { fill:#FFFBEB; stroke:#C29E08; stroke-width:1.5; rx:14; }
    #blackBoxOverview .box-green { fill:#F0FAF0; stroke:#73B222; stroke-width:1.5; rx:14; }
    #blackBoxOverview .box-red { fill:#FFF2F2; stroke:#C30B0A; stroke-width:1.5; rx:14; }
    #blackBoxOverview .box-dark { fill:#1b1d26; rx:16; }
  </style>
  <defs>
    <marker id="bbArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="step1" data-only="1">
    <rect class="box-blue" x="90" y="260" width="190" height="120"/><text x="185" y="310" class="text" text-anchor="middle" font-weight="700">Вход</text><text x="185" y="340" class="small" text-anchor="middle">данные, которые мы подаём</text>
    <line x1="285" y1="320" x2="388" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/><line x1="573" y1="320" x2="676" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/>
    <rect class="box-dark" x="395" y="245" width="170" height="150"/><text x="480" y="308" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">Модель</text><text x="480" y="338" text-anchor="middle" font-size="14" fill="#c7c7d1">чёрная коробка</text>
    <rect class="box-green" x="680" y="260" width="190" height="120"/><text x="775" y="310" class="text" text-anchor="middle" font-weight="700">Выход</text><text x="775" y="340" class="small" text-anchor="middle">ответ модели</text>
    <text x="480" y="470" class="text" text-anchor="middle" font-weight="700">Пока не открываем коробку: важно понять две стороны — вход и выход</text>
  </g>

  <g data-key="step2" data-only="1">
    <rect class="box-blue" x="70" y="160" width="210" height="110"/><text x="175" y="205" class="text" text-anchor="middle" font-weight="700">Таблица</text><text x="175" y="232" class="small" text-anchor="middle">квартиры, клиенты, продажи</text>
    <rect class="box-blue" x="70" y="285" width="210" height="110"/><text x="175" y="330" class="text" text-anchor="middle" font-weight="700">Картинка</text><text x="175" y="357" class="small" text-anchor="middle">пиксели изображения</text>
    <rect class="box-blue" x="70" y="410" width="210" height="110"/><text x="175" y="455" class="text" text-anchor="middle" font-weight="700">Текст</text><text x="175" y="482" class="small" text-anchor="middle">слова и токены</text>
    <line x1="285" y1="215" x2="388" y2="295" stroke="#5E5850" stroke-width="2.2" marker-end="url(#bbArrow)"/><line x1="285" y1="340" x2="388" y2="320" stroke="#5E5850" stroke-width="2.2" marker-end="url(#bbArrow)"/><line x1="285" y1="465" x2="388" y2="345" stroke="#5E5850" stroke-width="2.2" marker-end="url(#bbArrow)"/>
    <rect class="box-dark" x="395" y="245" width="170" height="150"/><text x="480" y="308" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">Модель</text><text x="480" y="338" text-anchor="middle" font-size="14" fill="#c7c7d1">чёрная коробка</text>
    <text x="670" y="315" class="small">Но для модели всё это должно стать числами</text>
  </g>

  <g data-key="step3" data-only="1">
    <rect class="box-blue" x="80" y="280" width="200" height="90"/><text x="180" y="334" class="text" text-anchor="middle" font-weight="700">Вход x</text><line x1="285" y1="320" x2="388" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/><line x1="573" y1="320" x2="676" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/><rect class="box-dark" x="395" y="245" width="170" height="150"/><text x="480" y="308" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">Модель</text><text x="480" y="338" text-anchor="middle" font-size="14" fill="#c7c7d1">чёрная коробка</text>
    <rect class="box-green" x="690" y="180" width="200" height="70"/><text x="790" y="224" class="text" text-anchor="middle" font-weight="700">23.7 °C</text>
    <rect class="box-yellow" x="690" y="285" width="200" height="70"/><text x="790" y="329" class="text" text-anchor="middle" font-weight="700">«кошка»</text>
    <rect class="box-red" x="690" y="390" width="200" height="70"/><text x="790" y="433" class="text" text-anchor="middle" font-weight="700">токены...</text>
    <text x="480" y="520" class="small" text-anchor="middle">Тип выхода заранее подсказывает, какая это задача: регрессия, классификация, генерация и т.д.</text>
  </g>

  <g data-key="step4" data-only="1">
    <rect class="box-blue" x="80" y="270" width="200" height="100"/><text x="180" y="327" class="text" text-anchor="middle" font-weight="700">вход x</text>
    <line x1="286" y1="320" x2="372" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/>
    <rect class="box-yellow" x="380" y="230" width="200" height="180"/><text x="480" y="292" text-anchor="middle" font-size="34" font-weight="800" fill="#C29E08">f</text><text x="480" y="326" class="text" text-anchor="middle" font-weight="700">параметры</text><text x="480" y="352" class="small" text-anchor="middle">подбираются по данным</text>
    <line x1="586" y1="320" x2="672" y2="320" stroke="#5E5850" stroke-width="2.5" marker-end="url(#bbArrow)"/>
    <rect class="box-green" x="680" y="270" width="200" height="100"/><text x="780" y="327" class="text" text-anchor="middle" font-weight="700">выход ŷ</text>
    <text x="480" y="485" font-size="24" font-weight="800" text-anchor="middle" fill="#111111">ŷ = f(x)</text><text x="480" y="525" class="small" text-anchor="middle">В этой статье фиксируем вход и выход. Внутрь коробки зайдём позже.</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · снаружи</div>
      <h4>У модели есть вход, функция и выход</h4>
      <p>Что-то подаём в одно отверстие коробки, что-то получаем из другого. Пока не открываем коробку: важно сначала понять две стороны — вход и выход, а внутреннее устройство — тема следующей статьи.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · разные входы</div>
      <h4>На вход могут прийти разные данные</h4>
      <p>Таблица, картинка и текст выглядят по-разному для человека — но для модели всё это должно стать числами. Способ превращения зависит от типа данных, а дальше коробка обрабатывает их одинаково.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · разные выходы</div>
      <h4>Выход тоже бывает разным</h4>
      <p>Одна и та же коробка может возвращать число (23.7 °C), класс («кошка») или последовательность токенов. Тип выхода заранее подсказывает, какая это задача: регрессия, классификация, генерация и т.д.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · внутри функция f</div>
      <h4>Внутри — функция f, снаружи — тот же шаблон</h4>
      <p>Обучение подбирает параметры функции f по данным, но снаружи формула остаётся той же: ŷ = f(x). В этой статье мы фиксируем вход и выход, а внутрь коробки заглянем позже.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

## 3. Что на входе: всё сводится к числам

Главная идея этого раздела одна, и её стоит проговорить сразу:

> **Модель не умеет работать с «картинками», «текстом» или «таблицами». Она умеет работать только с числами** — векторами, матрицами и тензорами.

Какими бы разными ни были исходные данные, перед входом в коробку их всегда превращают в набор чисел фиксированной формы. Разберём три типичных случая.

### 3.1. Табличные данные — самый базовый вид

Это самый привычный формат: таблица, где **строки — это объекты**, а **столбцы — их признаки** (характеристики). Каждая ячейка — одно число. Одна строка превращается в **вектор признаков** `x`, а вся таблица — в **матрицу X** формы `(n × m)`: `n` объектов на `m` признаков. Отдельно выделяют **целевой столбец y** — то, что мы хотим предсказать.

Именно в таком виде данные подаются почти в любую классическую ML-модель. Поэтому с таблиц удобно начинать: на них проще всего увидеть и `X`, и `y`, и саму идею `f(признаки) → ответ`.
<div class="stage" id="stageTabular" tabindex="0">
  <div class="stage-figure">
<svg id="tabularDataViz" viewBox="0 100 960 490" role="img" aria-label="Табличные данные как вход модели машинного обучения">
  <style>
    #tabularDataViz { font-family: Helvetica, Arial, sans-serif; }
    #tabularDataViz .text { font-size: 16px; fill: #111111; }
    #tabularDataViz .small { font-size: 13px; fill: #5E5850; }
    #tabularDataViz .label { font-size: 14px; font-weight: 700; fill: #111111; }
  </style>

  <g data-key="step1" data-only="1">
<line x1="205" y1="158" x2="846.0" y2="158.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="855,158 846.0,164.0 846.0,152.0" fill="#5E5850"/><line x1="855" y1="158" x2="214.0" y2="158.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="205,158 214.0,152.0 214.0,164.0" fill="#5E5850"/><text x="530" y="148" class="label" text-anchor="middle">СТОЛБЦЫ = признаки (характеристики)</text><text class="label" text-anchor="middle" transform="translate(180, 313) rotate(-90)">СТРОКИ = объекты</text><line x1="198" y1="225" x2="198.0" y2="392.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="198,401 192.0,392.0 204.0,392.0" fill="#5E5850"/><rect x="215" y="175" width="126" height="46" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="278" y="203" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Площадь</text><rect x="341" y="175" width="126" height="46" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="404" y="203" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Комнаты</text><rect x="467" y="175" width="126" height="46" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="530" y="203" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Этаж</text><rect x="593" y="175" width="126" height="46" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="656" y="203" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Возраст</text><rect x="719" y="175" width="126" height="46" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="782" y="203" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Цена, млн</text><rect x="215" y="221" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="278" y="249" font-size="15" fill="#111" text-anchor="middle">65</text><rect x="341" y="221" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="404" y="249" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="467" y="221" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="530" y="249" font-size="15" fill="#111" text-anchor="middle">4</text><rect x="593" y="221" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="656" y="249" font-size="15" fill="#111" text-anchor="middle">10</text><rect x="719" y="221" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="782" y="249" font-size="15" fill="#111" text-anchor="middle">18</text><rect x="215" y="267" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="278" y="295" font-size="15" fill="#111" text-anchor="middle">80</text><rect x="341" y="267" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="404" y="295" font-size="15" fill="#111" text-anchor="middle">3</text><rect x="467" y="267" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="530" y="295" font-size="15" fill="#111" text-anchor="middle">7</text><rect x="593" y="267" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="656" y="295" font-size="15" fill="#111" text-anchor="middle">5</text><rect x="719" y="267" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="782" y="295" font-size="15" fill="#111" text-anchor="middle">25</text><rect x="215" y="313" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="278" y="341" font-size="15" fill="#111" text-anchor="middle">45</text><rect x="341" y="313" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="404" y="341" font-size="15" fill="#111" text-anchor="middle">1</text><rect x="467" y="313" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="530" y="341" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="593" y="313" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="656" y="341" font-size="15" fill="#111" text-anchor="middle">20</text><rect x="719" y="313" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="782" y="341" font-size="15" fill="#111" text-anchor="middle">12</text><rect x="215" y="359" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="278" y="387" font-size="15" fill="#111" text-anchor="middle">120</text><rect x="341" y="359" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="404" y="387" font-size="15" fill="#111" text-anchor="middle">4</text><rect x="467" y="359" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="530" y="387" font-size="15" fill="#111" text-anchor="middle">12</text><rect x="593" y="359" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="656" y="387" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="719" y="359" width="126" height="46" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="782" y="387" font-size="15" fill="#111" text-anchor="middle">40</text><rect x="341" y="267" width="126" height="46" fill="none" stroke="#C29E08" stroke-width="3"/><line x1="404" y1="374" x2="404.0" y2="304.0" stroke="#C29E08" stroke-width="2"/><polygon points="404,294 410.0,304.0 398.0,304.0" fill="#C29E08"/><text x="404" y="394" class="small" fill="#C29E08" font-weight="700" text-anchor="middle">одна ячейка = одно число</text>
    <g transform="translate(80, 470)">
      <rect width="800" height="100" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
      <text x="400" y="34" class="text" font-weight="700" text-anchor="middle">Для модели любая таблица — это просто прямоугольник чисел (матрица)</text>
      <text x="400" y="62" class="small" text-anchor="middle">Строки — отдельные объекты (здесь: 4 квартиры). Столбцы — их измеримые характеристики.</text>
      <text x="400" y="84" class="small" text-anchor="middle">Каждая ячейка — одно значение. Дальше разберём, как это превращается во вход модели.</text>
    </g>
  </g>

  <g data-key="step2" data-only="1">
<rect x="230" y="120" width="120" height="42" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="290" y="146" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Площадь</text><rect x="350" y="120" width="120" height="42" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="410" y="146" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Комнаты</text><rect x="470" y="120" width="120" height="42" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="530" y="146" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Этаж</text><rect x="590" y="120" width="120" height="42" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="650" y="146" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Возраст</text><rect x="710" y="120" width="120" height="42" fill="#EFEFEC" stroke="#b6b6b6" stroke-width="1"/><text x="770" y="146" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Цена, млн</text><rect x="230" y="162" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="290" y="188" font-size="15" fill="#111" text-anchor="middle">65</text><rect x="350" y="162" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="410" y="188" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="470" y="162" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="530" y="188" font-size="15" fill="#111" text-anchor="middle">4</text><rect x="590" y="162" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="650" y="188" font-size="15" fill="#111" text-anchor="middle">10</text><rect x="710" y="162" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="770" y="188" font-size="15" fill="#111" text-anchor="middle">18</text><rect x="230" y="204" width="120" height="42" fill="#FFF4D2" stroke="#dddddd" stroke-width="1"/><text x="290" y="230" font-size="15" fill="#111" text-anchor="middle">80</text><rect x="350" y="204" width="120" height="42" fill="#FFF4D2" stroke="#dddddd" stroke-width="1"/><text x="410" y="230" font-size="15" fill="#111" text-anchor="middle">3</text><rect x="470" y="204" width="120" height="42" fill="#FFF4D2" stroke="#dddddd" stroke-width="1"/><text x="530" y="230" font-size="15" fill="#111" text-anchor="middle">7</text><rect x="590" y="204" width="120" height="42" fill="#FFF4D2" stroke="#dddddd" stroke-width="1"/><text x="650" y="230" font-size="15" fill="#111" text-anchor="middle">5</text><rect x="710" y="204" width="120" height="42" fill="#FFF4D2" stroke="#dddddd" stroke-width="1"/><text x="770" y="230" font-size="15" fill="#111" text-anchor="middle">25</text><rect x="230" y="204" width="600" height="42" fill="none" stroke="#C29E08" stroke-width="3"/><rect x="230" y="246" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="290" y="272" font-size="15" fill="#111" text-anchor="middle">45</text><rect x="350" y="246" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="410" y="272" font-size="15" fill="#111" text-anchor="middle">1</text><rect x="470" y="246" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="530" y="272" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="590" y="246" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="650" y="272" font-size="15" fill="#111" text-anchor="middle">20</text><rect x="710" y="246" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="770" y="272" font-size="15" fill="#111" text-anchor="middle">12</text><rect x="230" y="288" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="290" y="314" font-size="15" fill="#111" text-anchor="middle">120</text><rect x="350" y="288" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="410" y="314" font-size="15" fill="#111" text-anchor="middle">4</text><rect x="470" y="288" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="530" y="314" font-size="15" fill="#111" text-anchor="middle">12</text><rect x="590" y="288" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="650" y="314" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="710" y="288" width="120" height="42" fill="#fff" stroke="#dddddd" stroke-width="1"/><text x="770" y="314" font-size="15" fill="#111" text-anchor="middle">40</text><text x="846" y="230" class="small" fill="#C29E08" font-weight="700">→ объект №2</text><line x1="530" y1="336" x2="530.0" y2="332.0" stroke="#C29E08" stroke-width="2"/><polygon points="530,322 536.0,332.0 524.0,332.0" fill="#C29E08"/><text x="544" y="378" class="small" fill="#C29E08" font-weight="700">вынем эту строку</text><text x="210" y="428" font-size="20" font-weight="800" fill="#111" text-anchor="end">x⁽²⁾ =</text><text x="234" y="430" font-size="40" fill="#111" text-anchor="end">[</text><rect x="240" y="400" width="88" height="50" rx="6" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.4"/><text x="284" y="432" font-size="18" font-weight="700" fill="#111" text-anchor="middle">80</text><text x="284" y="470" font-size="11" fill="#5E5850" text-anchor="middle">Площадь</text><rect x="338" y="400" width="88" height="50" rx="6" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.4"/><text x="382" y="432" font-size="18" font-weight="700" fill="#111" text-anchor="middle">3</text><text x="382" y="470" font-size="11" fill="#5E5850" text-anchor="middle">Комнаты</text><rect x="436" y="400" width="88" height="50" rx="6" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.4"/><text x="480" y="432" font-size="18" font-weight="700" fill="#111" text-anchor="middle">7</text><text x="480" y="470" font-size="11" fill="#5E5850" text-anchor="middle">Этаж</text><rect x="534" y="400" width="88" height="50" rx="6" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.4"/><text x="578" y="432" font-size="18" font-weight="700" fill="#111" text-anchor="middle">5</text><text x="578" y="470" font-size="11" fill="#5E5850" text-anchor="middle">Возраст</text><rect x="632" y="400" width="88" height="50" rx="6" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.4"/><text x="676" y="432" font-size="18" font-weight="700" fill="#111" text-anchor="middle">25</text><text x="676" y="470" font-size="11" fill="#5E5850" text-anchor="middle">Цена</text><text x="726" y="430" font-size="40" fill="#111">]</text>
    <g transform="translate(80, 488)">
      <rect width="800" height="82" rx="12" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Строка таблицы — это вектор: список чисел в фиксированном порядке</text>
      <text x="400" y="60" class="small" text-anchor="middle">Порядок важен: 2-я позиция всегда «комнаты», 3-я всегда «этаж». Так модель понимает, что есть что.</text>
    </g>
  </g>

  <g data-key="step3" data-only="1">
<rect x="175" y="160" width="118" height="46" fill="#DCEAFB" stroke="#b6b6b6" stroke-width="1"/><text x="234" y="188" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Площадь</text><rect x="293" y="160" width="118" height="46" fill="#DCEAFB" stroke="#b6b6b6" stroke-width="1"/><text x="352" y="188" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Комнаты</text><rect x="411" y="160" width="118" height="46" fill="#DCEAFB" stroke="#b6b6b6" stroke-width="1"/><text x="470" y="188" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Этаж</text><rect x="529" y="160" width="118" height="46" fill="#DCEAFB" stroke="#b6b6b6" stroke-width="1"/><text x="588" y="188" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Возраст</text><rect x="691" y="160" width="118" height="46" fill="#E2F2D2" stroke="#b6b6b6" stroke-width="1"/><text x="750" y="188" font-size="13.5" font-weight="700" fill="#111" text-anchor="middle">Цена, млн</text><rect x="175" y="206" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="234" y="234" font-size="15" fill="#111" text-anchor="middle">65</text><rect x="293" y="206" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="352" y="234" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="411" y="206" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="470" y="234" font-size="15" fill="#111" text-anchor="middle">4</text><rect x="529" y="206" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="588" y="234" font-size="15" fill="#111" text-anchor="middle">10</text><rect x="691" y="206" width="118" height="46" fill="#F5FBEE" stroke="#dddddd" stroke-width="1"/><text x="750" y="234" font-size="15" fill="#111" text-anchor="middle">18</text><rect x="175" y="252" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="234" y="280" font-size="15" fill="#111" text-anchor="middle">80</text><rect x="293" y="252" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="352" y="280" font-size="15" fill="#111" text-anchor="middle">3</text><rect x="411" y="252" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="470" y="280" font-size="15" fill="#111" text-anchor="middle">7</text><rect x="529" y="252" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="588" y="280" font-size="15" fill="#111" text-anchor="middle">5</text><rect x="691" y="252" width="118" height="46" fill="#F5FBEE" stroke="#dddddd" stroke-width="1"/><text x="750" y="280" font-size="15" fill="#111" text-anchor="middle">25</text><rect x="175" y="298" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="234" y="326" font-size="15" fill="#111" text-anchor="middle">45</text><rect x="293" y="298" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="352" y="326" font-size="15" fill="#111" text-anchor="middle">1</text><rect x="411" y="298" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="470" y="326" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="529" y="298" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="588" y="326" font-size="15" fill="#111" text-anchor="middle">20</text><rect x="691" y="298" width="118" height="46" fill="#F5FBEE" stroke="#dddddd" stroke-width="1"/><text x="750" y="326" font-size="15" fill="#111" text-anchor="middle">12</text><rect x="175" y="344" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="234" y="372" font-size="15" fill="#111" text-anchor="middle">120</text><rect x="293" y="344" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="352" y="372" font-size="15" fill="#111" text-anchor="middle">4</text><rect x="411" y="344" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="470" y="372" font-size="15" fill="#111" text-anchor="middle">12</text><rect x="529" y="344" width="118" height="46" fill="#F5F9FE" stroke="#dddddd" stroke-width="1"/><text x="588" y="372" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="691" y="344" width="118" height="46" fill="#F5FBEE" stroke="#dddddd" stroke-width="1"/><text x="750" y="372" font-size="15" fill="#111" text-anchor="middle">40</text><line x1="175" y1="406" x2="647" y2="406" stroke="#3576C0" stroke-width="2"/><line x1="175" y1="406" x2="175" y2="398" stroke="#3576C0" stroke-width="2"/><line x1="647" y1="406" x2="647" y2="398" stroke="#3576C0" stroke-width="2"/><text x="411" y="432" font-size="22" font-weight="800" fill="#3576C0" text-anchor="middle">X — признаки (вход)</text><line x1="691" y1="406" x2="809" y2="406" stroke="#73B222" stroke-width="2"/><line x1="691" y1="406" x2="691" y2="398" stroke="#73B222" stroke-width="2"/><line x1="809" y1="406" x2="809" y2="398" stroke="#73B222" stroke-width="2"/><text x="750" y="432" font-size="22" font-weight="800" fill="#73B222" text-anchor="middle">y — цель</text><text x="669" y="138" font-size="26" fill="#5E5850" text-anchor="middle">→</text>
    <g transform="translate(80, 460)">
      <rect width="800" height="110" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">X — то, что известно. y — то, что нужно предсказать.</text>
      <text x="400" y="60" class="small" text-anchor="middle">Признаки (площадь, комнаты, этаж, возраст) → цель (цена). Цель — обычно один столбец.</text>
      <text x="400" y="82" class="small" text-anchor="middle">Регрессия: y — число (цена). Классификация: y — метка класса (например, «дорогая / дешёвая»).</text>
      <text x="400" y="102" class="small" text-anchor="middle">Какой столбец сделать целью — решаем мы, исходя из задачи.</text>
    </g>
  </g>

  <g data-key="step4" data-only="1">
<text x="268" y="165" font-size="10.5" fill="#5E5850" text-anchor="middle">Площад</text><text x="334" y="165" font-size="10.5" fill="#5E5850" text-anchor="middle">Комнат</text><text x="400" y="165" font-size="10.5" fill="#5E5850" text-anchor="middle">Этаж</text><text x="466" y="165" font-size="10.5" fill="#5E5850" text-anchor="middle">Возрас</text><rect x="235" y="175" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="268" y="203" font-size="15" fill="#111" text-anchor="middle">65</text><rect x="301" y="175" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="334" y="203" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="367" y="175" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="400" y="203" font-size="15" fill="#111" text-anchor="middle">4</text><rect x="433" y="175" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="466" y="203" font-size="15" fill="#111" text-anchor="middle">10</text><rect x="235" y="221" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="268" y="249" font-size="15" fill="#111" text-anchor="middle">80</text><rect x="301" y="221" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="334" y="249" font-size="15" fill="#111" text-anchor="middle">3</text><rect x="367" y="221" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="400" y="249" font-size="15" fill="#111" text-anchor="middle">7</text><rect x="433" y="221" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="466" y="249" font-size="15" fill="#111" text-anchor="middle">5</text><rect x="235" y="267" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="268" y="295" font-size="15" fill="#111" text-anchor="middle">45</text><rect x="301" y="267" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="334" y="295" font-size="15" fill="#111" text-anchor="middle">1</text><rect x="367" y="267" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="400" y="295" font-size="15" fill="#111" text-anchor="middle">2</text><rect x="433" y="267" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="466" y="295" font-size="15" fill="#111" text-anchor="middle">20</text><rect x="235" y="313" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="268" y="341" font-size="15" fill="#111" text-anchor="middle">120</text><rect x="301" y="313" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="334" y="341" font-size="15" fill="#111" text-anchor="middle">4</text><rect x="367" y="313" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="400" y="341" font-size="15" fill="#111" text-anchor="middle">12</text><rect x="433" y="313" width="66" height="46" fill="#F5F9FE" stroke="#3576C0" stroke-width="0.8"/><text x="466" y="341" font-size="15" fill="#111" text-anchor="middle">2</text><path d="M 227 175 L 227 359 M 227 175 L 233 175 M 227 359 L 233 359" stroke="#3576C0" stroke-width="2.5" fill="none"/><path d="M 507 175 L 507 359 M 507 175 L 501 175 M 507 359 L 501 359" stroke="#3576C0" stroke-width="2.5" fill="none"/><text x="367" y="141" font-size="26" font-weight="800" fill="#3576C0" text-anchor="middle">X</text><line x1="209" y1="175" x2="209.0" y2="351.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="209,359 203.0,351.0 215.0,351.0" fill="#5E5850"/><line x1="209" y1="359" x2="209.0" y2="183.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="209,175 215.0,183.0 203.0,183.0" fill="#5E5850"/><text class="small" text-anchor="middle" transform="translate(195, 267) rotate(-90)">n = 4 объекта</text><line x1="235" y1="381" x2="491.0" y2="381.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="499,381 491.0,387.0 491.0,375.0" fill="#5E5850"/><line x1="499" y1="381" x2="243.0" y2="381.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="235,381 243.0,375.0 243.0,387.0" fill="#5E5850"/><text x="367" y="399" class="small" text-anchor="middle">m = 4 признака</text><text x="685" y="165" font-size="10.5" fill="#5E5850" text-anchor="middle">Цена</text><rect x="640" y="175" width="90" height="46" fill="#F5FBEE" stroke="#73B222" stroke-width="0.8"/><text x="685" y="203" font-size="15" fill="#111" text-anchor="middle">18</text><rect x="640" y="221" width="90" height="46" fill="#F5FBEE" stroke="#73B222" stroke-width="0.8"/><text x="685" y="249" font-size="15" fill="#111" text-anchor="middle">25</text><rect x="640" y="267" width="90" height="46" fill="#F5FBEE" stroke="#73B222" stroke-width="0.8"/><text x="685" y="295" font-size="15" fill="#111" text-anchor="middle">12</text><rect x="640" y="313" width="90" height="46" fill="#F5FBEE" stroke="#73B222" stroke-width="0.8"/><text x="685" y="341" font-size="15" fill="#111" text-anchor="middle">40</text><path d="M 632 175 L 632 359 M 632 175 L 638 175 M 632 359 L 638 359" stroke="#73B222" stroke-width="2.5" fill="none"/><path d="M 738 175 L 738 359 M 738 175 L 732 175 M 738 359 L 732 359" stroke="#73B222" stroke-width="2.5" fill="none"/><text x="685" y="141" font-size="26" font-weight="800" fill="#73B222" text-anchor="middle">y</text>
    <g transform="translate(80, 430)">
      <rect width="800" height="140" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Стандартная форма данных в ML</text>
      <text x="400" y="62" font-size="16" text-anchor="middle"><tspan fill="#3576C0" font-weight="700">X: форма (n × m) = (4 × 4)</tspan><tspan fill="#5E5850">     ·     </tspan><tspan fill="#73B222" font-weight="700">y: форма (n,) = (4,)</tspan></text>
      <text x="400" y="90" class="small" text-anchor="middle">n — число объектов (samples), m — число признаков (features). У каждого объекта свой ответ в y.</text>
      <text x="400" y="112" class="small" text-anchor="middle">В реальности n бывает миллионы строк, m — десятки или тысячи столбцов.</text>
      <text x="400" y="132" class="small" text-anchor="middle">Это ровно тот вид, в котором данные подаются почти в любую классическую ML-модель.</text>
    </g>
  </g>

  <g data-key="step5" data-only="1">
<text x="220" y="136" class="label" fill="#3576C0" text-anchor="middle">признаки одной квартиры</text><rect x="110" y="150" width="220" height="40" rx="6" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.3"/><text x="126" y="175" font-size="15" fill="#111">Площадь: 65</text><rect x="110" y="196" width="220" height="40" rx="6" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.3"/><text x="126" y="221" font-size="15" fill="#111">Комнаты: 2</text><rect x="110" y="242" width="220" height="40" rx="6" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.3"/><text x="126" y="267" font-size="15" fill="#111">Этаж: 4</text><rect x="110" y="288" width="220" height="40" rx="6" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.3"/><text x="126" y="313" font-size="15" fill="#111">Возраст: 10</text><text x="220" y="342" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">вектор x = [65, 2, 4, 10]</text><line x1="338" y1="239" x2="389.2" y2="247.8" stroke="#5E5850" stroke-width="2.5"/><polygon points="402,250 388.2,253.7 390.2,241.9" fill="#5E5850"/><rect x="410" y="195" width="150" height="110" rx="14" fill="#FFFBEB" stroke="#C29E08" stroke-width="2.5"/><text x="485" y="241" font-size="30" font-weight="800" fill="#C29E08" text-anchor="middle">f</text><text x="485" y="273" class="small" text-anchor="middle">модель</text><text x="485" y="291" class="small" text-anchor="middle">(функция)</text><line x1="568" y1="250" x2="639.0" y2="250.0" stroke="#5E5850" stroke-width="2.5"/><polygon points="652,250 639.0,256.0 639.0,244.0" fill="#5E5850"/><rect x="660" y="208" width="200" height="84" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="2"/><text x="760" y="238" class="small" fill="#73B222" font-weight="700" text-anchor="middle">предсказание цены</text><text x="760" y="272" font-size="24" font-weight="800" fill="#111" text-anchor="middle">ŷ ≈ 18 млн</text><text x="480" y="370" font-size="22" font-weight="800" text-anchor="middle"><tspan fill="#C29E08">f</tspan><tspan fill="#111">(</tspan><tspan fill="#3576C0">X</tspan><tspan fill="#111">) → </tspan><tspan fill="#73B222">y</tspan></text>
    <g transform="translate(80, 405)">
      <rect width="800" height="165" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Цель машинного обучения — найти такую f</text>
      <text x="400" y="60" class="small" text-anchor="middle">...чтобы для каждого объекта предсказание f(признаки) было близко к настоящему ответу y.</text>
      <text x="400" y="82" class="small" text-anchor="middle">Вход всегда один и тот же по форме: вектор признаков фиксированной длины m.</text>
      <text x="400" y="104" class="small" text-anchor="middle">Выход — одно число (регрессия) или метка класса (классификация).</text>
      <text x="400" y="132" class="small" text-anchor="middle" font-weight="700">Как именно подбирается f по данным (обучение) — это уже отдельная история.</text>
      <text x="400" y="152" class="small" text-anchor="middle">Здесь главное: вход модели = матрица X, и мы хотим из неё получить y.</text>
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · таблица как матрица</div>
      <h4>Табличные данные — это матрица</h4>
      <p>Как в Excel или CSV: строки и столбцы из чисел. Строки — отдельные объекты (здесь: 4 квартиры), столбцы — их измеримые характеристики, а каждая ячейка — одно число.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · строка как вектор</div>
      <h4>Одно наблюдение = строка = вектор</h4>
      <p>Каждый объект описывается упорядоченным набором чисел. Порядок важен: 2-я позиция всегда «комнаты», 3-я всегда «этаж» — так модель понимает, что есть что, не видя названий столбцов.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · X и y</div>
      <h4>Признаки (X) и цель (y)</h4>
      <p>Столбцы делятся на то, что мы знаем (X — признаки), и то, что хотим предсказать (y — цель, обычно один столбец). Какой столбец сделать целью — решаем мы сами, исходя из задачи.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · весь датасет</div>
      <h4>Весь датасет: матрица X и вектор y</h4>
      <p>n объектов × m признаков — матрица X формы (n × m), и столбец ответов y длины n. В реальности n бывает миллионы строк, m — десятки или тысячи столбцов, но форма всегда такая.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · предсказать y по X</div>
      <h4>Задача: предсказать y по X</h4>
      <p>Нужна функция f, которая по признакам одной квартиры выдаст цель — предсказание цены. Вход всегда один и тот же по форме: вектор признаков фиксированной длины m, а найти подходящую f — и есть обучение.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### 3.2. Изображения — это тоже числа

Человек видит на картинке кошку. Компьютер видит **сетку чисел**. Каждый пиксель — это число (для серого — одно число от 0 до 255), а для цветного изображения — **три числа** (R, G, B). Сложив три цветовых канала, получаем **3D-тензор** формы `высота × ширина × каналы`.

То есть картинка — это не что-то принципиально новое для модели: это просто матрица (или тензор) чисел, только большего размера, чем строка таблицы.
<div class="stage" id="stageImagePixels" tabindex="0">
  <div class="stage-figure">
<svg id="howComputerSeesImage" viewBox="0 100 960 500" role="img" aria-label="Как компьютер видит цветную картинку">
  <style>
    #howComputerSeesImage { font-family: Helvetica, Arial, sans-serif; }
    #howComputerSeesImage .text { font-size: 16px; fill: #111111; }
    #howComputerSeesImage .small { font-size: 13px; fill: #5E5850; }
    #howComputerSeesImage .label { font-size: 14px; font-weight: 700; fill: #111111; }
  </style>

  <g data-key="step1" data-only="1">
    <text x="200" y="170" class="label" text-anchor="middle">ЧЕЛОВЕК ВИДИТ</text>
    <rect x="110" y="190" width="60" height="60" fill="rgb(220,70,70)"/><rect x="170" y="190" width="60" height="60" fill="rgb(250,200,80)"/><rect x="230" y="190" width="60" height="60" fill="rgb(90,180,90)"/><rect x="110" y="250" width="60" height="60" fill="rgb(80,150,220)"/><rect x="170" y="250" width="60" height="60" fill="rgb(220,130,200)"/><rect x="230" y="250" width="60" height="60" fill="rgb(200,200,200)"/><rect x="110" y="310" width="60" height="60" fill="rgb(240,150,60)"/><rect x="170" y="310" width="60" height="60" fill="rgb(60,60,150)"/><rect x="230" y="310" width="60" height="60" fill="rgb(40,40,40)"/><rect x="110" y="190" width="180" height="180" fill="none" stroke="#111" stroke-width="1.5"/>
    <text x="200" y="395" class="small" text-anchor="middle">3 × 3 пикселя (увеличено)</text>

    <line x1="305" y1="280" x2="375" y2="280" stroke="#5E5850" stroke-width="2.5"/>
    <polygon points="375,280 362,274 362,286" fill="#5E5850"/>

    <text x="635" y="170" class="label" text-anchor="middle">КОМПЬЮТЕР ВИДИТ</text>
    <rect x="395" y="190" width="160" height="60" fill="#ffffff" stroke="#3576C0" stroke-width="1"/><text x="475" y="225" font-size="15" font-weight="700" text-anchor="middle"><tspan fill="#C30B0A">220</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#73B222">70</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#3576C0">70</tspan></text><rect x="555" y="190" width="160" height="60" fill="#ffffff" stroke="#3576C0" stroke-width="1"/><text x="635" y="225" font-size="15" font-weight="700" text-anchor="middle"><tspan fill="#C30B0A">250</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#73B222">200</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#3576C0">80</tspan></text><rect x="715" y="190" width="160" height="60" fill="#ffffff" stroke="#3576C0" stroke-width="1"/><text x="795" y="225" font-size="15" font-weight="700" text-anchor="middle"><tspan fill="#C30B0A">90</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#73B222">180</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#3576C0">90</tspan></text><rect x="395" y="250" width="160" height="60" fill="#ffffff" stroke="#3576C0" stroke-width="1"/><text x="475" y="285" font-size="15" font-weight="700" text-anchor="middle"><tspan fill="#C30B0A">80</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#73B222">150</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#3576C0">220</tspan></text><rect x="555" y="250" width="160" height="60" fill="#ffffff" stroke="#3576C0" stroke-width="1"/><text x="635" y="285" font-size="15" font-weight="700" text-anchor="middle"><tspan fill="#C30B0A">220</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#73B222">130</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#3576C0">200</tspan></text><rect x="715" y="250" width="160" height="60" fill="#ffffff" stroke="#3576C0" stroke-width="1"/><text x="795" y="285" font-size="15" font-weight="700" text-anchor="middle"><tspan fill="#C30B0A">200</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#73B222">200</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#3576C0">200</tspan></text><rect x="395" y="310" width="160" height="60" fill="#ffffff" stroke="#3576C0" stroke-width="1"/><text x="475" y="345" font-size="15" font-weight="700" text-anchor="middle"><tspan fill="#C30B0A">240</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#73B222">150</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#3576C0">60</tspan></text><rect x="555" y="310" width="160" height="60" fill="#ffffff" stroke="#3576C0" stroke-width="1"/><text x="635" y="345" font-size="15" font-weight="700" text-anchor="middle"><tspan fill="#C30B0A">60</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#73B222">60</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#3576C0">150</tspan></text><rect x="715" y="310" width="160" height="60" fill="#ffffff" stroke="#3576C0" stroke-width="1"/><text x="795" y="345" font-size="15" font-weight="700" text-anchor="middle"><tspan fill="#C30B0A">40</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#73B222">40</tspan><tspan fill="#5E5850">,&#160;</tspan><tspan fill="#3576C0">40</tspan></text>
    <text x="635" y="395" class="small" text-anchor="middle">та же сетка — но из чисел (R, G, B) на каждый пиксель</text>

    <g transform="translate(80, 440)">
      <rect width="800" height="115" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
      <text x="400" y="38" class="text" font-weight="700" text-anchor="middle">Любая цифровая картинка хранится в виде чисел.</text>
      <text x="400" y="68" class="small" text-anchor="middle">Дальше разберём: почему чисел три на каждый пиксель,</text>
      <text x="400" y="90" class="small" text-anchor="middle">как из них собирается цвет и почему всё это — 3D тензор.</text>
    </g>
  </g>

  <g data-key="step2" data-only="1">
    <text x="510" y="160" class="label" text-anchor="middle">Фрагмент изображения (как в MNIST)</text>
    <rect x="372" y="180" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="399.5" y="213.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="427" y="180" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="454.5" y="213.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="482" y="180" width="55" height="55" fill="rgb(220,220,220)" stroke="#888" stroke-width="0.5"/><text x="509.5" y="213.5" font-size="17" font-weight="700" fill="#111" text-anchor="middle">220</text><rect x="537" y="180" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="564.5" y="213.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="592" y="180" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="619.5" y="213.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="372" y="235" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="399.5" y="268.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="427" y="235" width="55" height="55" fill="rgb(60,60,60)" stroke="#888" stroke-width="0.5"/><text x="454.5" y="268.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">60</text><rect x="482" y="235" width="55" height="55" fill="rgb(240,240,240)" stroke="#888" stroke-width="0.5"/><text x="509.5" y="268.5" font-size="17" font-weight="700" fill="#111" text-anchor="middle">240</text><rect x="537" y="235" width="55" height="55" fill="rgb(60,60,60)" stroke="#888" stroke-width="0.5"/><text x="564.5" y="268.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">60</text><rect x="592" y="235" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="619.5" y="268.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="372" y="290" width="55" height="55" fill="rgb(220,220,220)" stroke="#888" stroke-width="0.5"/><text x="399.5" y="323.5" font-size="17" font-weight="700" fill="#111" text-anchor="middle">220</text><rect x="427" y="290" width="55" height="55" fill="rgb(240,240,240)" stroke="#888" stroke-width="0.5"/><text x="454.5" y="323.5" font-size="17" font-weight="700" fill="#111" text-anchor="middle">240</text><rect x="482" y="290" width="55" height="55" fill="rgb(255,255,255)" stroke="#888" stroke-width="0.5"/><text x="509.5" y="323.5" font-size="17" font-weight="700" fill="#111" text-anchor="middle">255</text><rect x="537" y="290" width="55" height="55" fill="rgb(240,240,240)" stroke="#888" stroke-width="0.5"/><text x="564.5" y="323.5" font-size="17" font-weight="700" fill="#111" text-anchor="middle">240</text><rect x="592" y="290" width="55" height="55" fill="rgb(220,220,220)" stroke="#888" stroke-width="0.5"/><text x="619.5" y="323.5" font-size="17" font-weight="700" fill="#111" text-anchor="middle">220</text><rect x="372" y="345" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="399.5" y="378.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="427" y="345" width="55" height="55" fill="rgb(60,60,60)" stroke="#888" stroke-width="0.5"/><text x="454.5" y="378.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">60</text><rect x="482" y="345" width="55" height="55" fill="rgb(240,240,240)" stroke="#888" stroke-width="0.5"/><text x="509.5" y="378.5" font-size="17" font-weight="700" fill="#111" text-anchor="middle">240</text><rect x="537" y="345" width="55" height="55" fill="rgb(60,60,60)" stroke="#888" stroke-width="0.5"/><text x="564.5" y="378.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">60</text><rect x="592" y="345" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="619.5" y="378.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="372" y="400" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="399.5" y="433.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="427" y="400" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="454.5" y="433.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="482" y="400" width="55" height="55" fill="rgb(220,220,220)" stroke="#888" stroke-width="0.5"/><text x="509.5" y="433.5" font-size="17" font-weight="700" fill="#111" text-anchor="middle">220</text><rect x="537" y="400" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="564.5" y="433.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="592" y="400" width="55" height="55" fill="rgb(0,0,0)" stroke="#888" stroke-width="0.5"/><text x="619.5" y="433.5" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">0</text><rect x="372" y="180" width="275" height="275" fill="none" stroke="#111" stroke-width="2"/>

    <g transform="translate(70, 215)">
      <rect width="180" height="240" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
      <text x="90" y="34" class="label" text-anchor="middle">ОДИН ПИКСЕЛЬ</text>
      <text x="90" y="58" class="small" text-anchor="middle">=</text>
      <text x="90" y="82" class="label" text-anchor="middle">ОДНО ЧИСЛО (0–255)</text>

      <rect x="40" y="105" width="100" height="60" fill="rgb(60,60,60)" stroke="#111" stroke-width="1.5"/>
      <text x="90" y="143" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">60</text>
      <text x="90" y="187" class="small" text-anchor="middle">тёмно-серый пиксель</text>
      <text x="90" y="208" class="small" text-anchor="middle">(пример из матрицы справа)</text>
    </g>

    <text x="510" y="500" class="text" font-weight="700" text-anchor="middle">0 — чёрный   ·   255 — белый   ·   между — оттенки серого</text>
    <text x="510" y="525" class="small" text-anchor="middle">в MNIST реальный размер цифры — 28 × 28 таких пикселей</text>
  </g>

  <g data-key="step3" data-only="1">
    <text x="200" y="135" class="small" text-anchor="middle">Красный</text><rect x="130" y="145" width="140" height="140" fill="rgb(230,60,60)" stroke="#111" stroke-width="1.5"/><text x="200" y="313" font-size="17" font-weight="800" fill="#C30B0A" text-anchor="middle">R = 230</text><text x="200" y="337" font-size="17" font-weight="800" fill="#73B222" text-anchor="middle">G = 60</text><text x="200" y="361" font-size="17" font-weight="800" fill="#3576C0" text-anchor="middle">B = 60</text><text x="390" y="135" class="small" text-anchor="middle">Жёлтый</text><rect x="320" y="145" width="140" height="140" fill="rgb(240,220,60)" stroke="#111" stroke-width="1.5"/><text x="390" y="313" font-size="17" font-weight="800" fill="#C30B0A" text-anchor="middle">R = 240</text><text x="390" y="337" font-size="17" font-weight="800" fill="#73B222" text-anchor="middle">G = 220</text><text x="390" y="361" font-size="17" font-weight="800" fill="#3576C0" text-anchor="middle">B = 60</text><text x="580" y="135" class="small" text-anchor="middle">Зелёный</text><rect x="510" y="145" width="140" height="140" fill="rgb(60,200,80)" stroke="#111" stroke-width="1.5"/><text x="580" y="313" font-size="17" font-weight="800" fill="#C30B0A" text-anchor="middle">R = 60</text><text x="580" y="337" font-size="17" font-weight="800" fill="#73B222" text-anchor="middle">G = 200</text><text x="580" y="361" font-size="17" font-weight="800" fill="#3576C0" text-anchor="middle">B = 80</text><text x="770" y="135" class="small" text-anchor="middle">Голубой</text><rect x="700" y="145" width="140" height="140" fill="rgb(60,180,230)" stroke="#111" stroke-width="1.5"/><text x="770" y="313" font-size="17" font-weight="800" fill="#C30B0A" text-anchor="middle">R = 60</text><text x="770" y="337" font-size="17" font-weight="800" fill="#73B222" text-anchor="middle">G = 180</text><text x="770" y="361" font-size="17" font-weight="800" fill="#3576C0" text-anchor="middle">B = 230</text>
    <g transform="translate(80, 495)">
      <rect width="800" height="85" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Интуиция: 0 — нет этого цвета, 255 — максимум.</text>
      <text x="400" y="60" class="small" text-anchor="middle">Жёлтый = много R + много G + мало B.   Чёрный = (0, 0, 0).   Белый = (255, 255, 255).</text>
    </g>
  </g>

  <g data-key="step4" data-only="1">
    <rect x="80" y="270" width="60" height="60" fill="rgb(220,70,70)"/><rect x="140" y="270" width="60" height="60" fill="rgb(250,200,80)"/><rect x="200" y="270" width="60" height="60" fill="rgb(90,180,90)"/><rect x="80" y="330" width="60" height="60" fill="rgb(80,150,220)"/><rect x="140" y="330" width="60" height="60" fill="rgb(220,130,200)"/><rect x="200" y="330" width="60" height="60" fill="rgb(200,200,200)"/><rect x="80" y="390" width="60" height="60" fill="rgb(240,150,60)"/><rect x="140" y="390" width="60" height="60" fill="rgb(60,60,150)"/><rect x="200" y="390" width="60" height="60" fill="rgb(40,40,40)"/><rect x="80" y="270" width="180" height="180" fill="none" stroke="#111" stroke-width="1.5"/>
    <text x="170" y="465" class="small" text-anchor="middle">цветная картинка 3×3</text>

    <line x1="260" y1="360" x2="310" y2="360" stroke="#5E5850" stroke-width="2"/>
    <line x1="310" y1="215" x2="310" y2="505" stroke="#5E5850" stroke-width="2"/>

    <line x1="310" y1="215" x2="475" y2="215" stroke="#C30B0A" stroke-width="2"/>
    <polygon points="475,215 463,210 463,220" fill="#C30B0A"/>
    <line x1="310" y1="360" x2="475" y2="360" stroke="#73B222" stroke-width="2"/>
    <polygon points="475,360 463,355 463,365" fill="#73B222"/>
    <line x1="310" y1="505" x2="475" y2="505" stroke="#3576C0" stroke-width="2"/>
    <polygon points="475,505 463,500 463,510" fill="#3576C0"/>

    <text x="490" y="170" font-size="22" font-weight="800" fill="#C30B0A">R</text>
    <rect x="520" y="155" width="40" height="40" fill="rgb(220,220,220)" stroke="#bbb" stroke-width="0.5"/><text x="540" y="180" font-size="14" font-weight="700" fill="#111" text-anchor="middle">220</text><rect x="560" y="155" width="40" height="40" fill="rgb(250,250,250)" stroke="#bbb" stroke-width="0.5"/><text x="580" y="180" font-size="14" font-weight="700" fill="#111" text-anchor="middle">250</text><rect x="600" y="155" width="40" height="40" fill="rgb(90,90,90)" stroke="#bbb" stroke-width="0.5"/><text x="620" y="180" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">90</text><rect x="520" y="195" width="40" height="40" fill="rgb(80,80,80)" stroke="#bbb" stroke-width="0.5"/><text x="540" y="220" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">80</text><rect x="560" y="195" width="40" height="40" fill="rgb(220,220,220)" stroke="#bbb" stroke-width="0.5"/><text x="580" y="220" font-size="14" font-weight="700" fill="#111" text-anchor="middle">220</text><rect x="600" y="195" width="40" height="40" fill="rgb(200,200,200)" stroke="#bbb" stroke-width="0.5"/><text x="620" y="220" font-size="14" font-weight="700" fill="#111" text-anchor="middle">200</text><rect x="520" y="235" width="40" height="40" fill="rgb(240,240,240)" stroke="#bbb" stroke-width="0.5"/><text x="540" y="260" font-size="14" font-weight="700" fill="#111" text-anchor="middle">240</text><rect x="560" y="235" width="40" height="40" fill="rgb(60,60,60)" stroke="#bbb" stroke-width="0.5"/><text x="580" y="260" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">60</text><rect x="600" y="235" width="40" height="40" fill="rgb(40,40,40)" stroke="#bbb" stroke-width="0.5"/><text x="620" y="260" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">40</text><rect x="520" y="155" width="120" height="120" fill="none" stroke="#C30B0A" stroke-width="2.5"/>
    <text x="660" y="185" class="label" fill="#C30B0A">красный канал</text>
    <text x="660" y="208" class="small">матрица 3×3, значения 0–255</text>

    <text x="490" y="315" font-size="22" font-weight="800" fill="#73B222">G</text>
    <rect x="520" y="300" width="40" height="40" fill="rgb(70,70,70)" stroke="#bbb" stroke-width="0.5"/><text x="540" y="325" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">70</text><rect x="560" y="300" width="40" height="40" fill="rgb(200,200,200)" stroke="#bbb" stroke-width="0.5"/><text x="580" y="325" font-size="14" font-weight="700" fill="#111" text-anchor="middle">200</text><rect x="600" y="300" width="40" height="40" fill="rgb(180,180,180)" stroke="#bbb" stroke-width="0.5"/><text x="620" y="325" font-size="14" font-weight="700" fill="#111" text-anchor="middle">180</text><rect x="520" y="340" width="40" height="40" fill="rgb(150,150,150)" stroke="#bbb" stroke-width="0.5"/><text x="540" y="365" font-size="14" font-weight="700" fill="#111" text-anchor="middle">150</text><rect x="560" y="340" width="40" height="40" fill="rgb(130,130,130)" stroke="#bbb" stroke-width="0.5"/><text x="580" y="365" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">130</text><rect x="600" y="340" width="40" height="40" fill="rgb(200,200,200)" stroke="#bbb" stroke-width="0.5"/><text x="620" y="365" font-size="14" font-weight="700" fill="#111" text-anchor="middle">200</text><rect x="520" y="380" width="40" height="40" fill="rgb(150,150,150)" stroke="#bbb" stroke-width="0.5"/><text x="540" y="405" font-size="14" font-weight="700" fill="#111" text-anchor="middle">150</text><rect x="560" y="380" width="40" height="40" fill="rgb(60,60,60)" stroke="#bbb" stroke-width="0.5"/><text x="580" y="405" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">60</text><rect x="600" y="380" width="40" height="40" fill="rgb(40,40,40)" stroke="#bbb" stroke-width="0.5"/><text x="620" y="405" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">40</text><rect x="520" y="300" width="120" height="120" fill="none" stroke="#73B222" stroke-width="2.5"/>
    <text x="660" y="330" class="label" fill="#73B222">зелёный канал</text>
    <text x="660" y="353" class="small">та же сетка, но яркость зелёного</text>

    <text x="490" y="460" font-size="22" font-weight="800" fill="#3576C0">B</text>
    <rect x="520" y="445" width="40" height="40" fill="rgb(70,70,70)" stroke="#bbb" stroke-width="0.5"/><text x="540" y="470" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">70</text><rect x="560" y="445" width="40" height="40" fill="rgb(80,80,80)" stroke="#bbb" stroke-width="0.5"/><text x="580" y="470" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">80</text><rect x="600" y="445" width="40" height="40" fill="rgb(90,90,90)" stroke="#bbb" stroke-width="0.5"/><text x="620" y="470" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">90</text><rect x="520" y="485" width="40" height="40" fill="rgb(220,220,220)" stroke="#bbb" stroke-width="0.5"/><text x="540" y="510" font-size="14" font-weight="700" fill="#111" text-anchor="middle">220</text><rect x="560" y="485" width="40" height="40" fill="rgb(200,200,200)" stroke="#bbb" stroke-width="0.5"/><text x="580" y="510" font-size="14" font-weight="700" fill="#111" text-anchor="middle">200</text><rect x="600" y="485" width="40" height="40" fill="rgb(200,200,200)" stroke="#bbb" stroke-width="0.5"/><text x="620" y="510" font-size="14" font-weight="700" fill="#111" text-anchor="middle">200</text><rect x="520" y="525" width="40" height="40" fill="rgb(60,60,60)" stroke="#bbb" stroke-width="0.5"/><text x="540" y="550" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">60</text><rect x="560" y="525" width="40" height="40" fill="rgb(150,150,150)" stroke="#bbb" stroke-width="0.5"/><text x="580" y="550" font-size="14" font-weight="700" fill="#111" text-anchor="middle">150</text><rect x="600" y="525" width="40" height="40" fill="rgb(40,40,40)" stroke="#bbb" stroke-width="0.5"/><text x="620" y="550" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">40</text><rect x="520" y="445" width="120" height="120" fill="none" stroke="#3576C0" stroke-width="2.5"/>
    <text x="660" y="475" class="label" fill="#3576C0">синий канал</text>
    <text x="660" y="498" class="small">опять 3×3 чисел 0–255</text>
  </g>

  <g data-key="step5" data-only="1">
    <rect x="162" y="210" width="40" height="40" fill="rgb(220,0,0)"/><rect x="202" y="210" width="40" height="40" fill="rgb(250,0,0)"/><rect x="242" y="210" width="40" height="40" fill="rgb(90,0,0)"/><rect x="162" y="250" width="40" height="40" fill="rgb(80,0,0)"/><rect x="202" y="250" width="40" height="40" fill="rgb(220,0,0)"/><rect x="242" y="250" width="40" height="40" fill="rgb(200,0,0)"/><rect x="162" y="290" width="40" height="40" fill="rgb(240,0,0)"/><rect x="202" y="290" width="40" height="40" fill="rgb(60,0,0)"/><rect x="242" y="290" width="40" height="40" fill="rgb(40,0,0)"/><rect x="162" y="210" width="120" height="120" fill="none" stroke="#C30B0A" stroke-width="2"/><text x="222" y="352" class="label" text-anchor="middle" fill="#C30B0A">только R</text><text x="308" y="270" font-size="34" font-weight="800" fill="#5E5850" text-anchor="middle" dominant-baseline="middle">+</text><rect x="334" y="210" width="40" height="40" fill="rgb(0,70,0)"/><rect x="374" y="210" width="40" height="40" fill="rgb(0,200,0)"/><rect x="414" y="210" width="40" height="40" fill="rgb(0,180,0)"/><rect x="334" y="250" width="40" height="40" fill="rgb(0,150,0)"/><rect x="374" y="250" width="40" height="40" fill="rgb(0,130,0)"/><rect x="414" y="250" width="40" height="40" fill="rgb(0,200,0)"/><rect x="334" y="290" width="40" height="40" fill="rgb(0,150,0)"/><rect x="374" y="290" width="40" height="40" fill="rgb(0,60,0)"/><rect x="414" y="290" width="40" height="40" fill="rgb(0,40,0)"/><rect x="334" y="210" width="120" height="120" fill="none" stroke="#73B222" stroke-width="2"/><text x="394" y="352" class="label" text-anchor="middle" fill="#73B222">только G</text><text x="480" y="270" font-size="34" font-weight="800" fill="#5E5850" text-anchor="middle" dominant-baseline="middle">+</text><rect x="506" y="210" width="40" height="40" fill="rgb(0,0,70)"/><rect x="546" y="210" width="40" height="40" fill="rgb(0,0,80)"/><rect x="586" y="210" width="40" height="40" fill="rgb(0,0,90)"/><rect x="506" y="250" width="40" height="40" fill="rgb(0,0,220)"/><rect x="546" y="250" width="40" height="40" fill="rgb(0,0,200)"/><rect x="586" y="250" width="40" height="40" fill="rgb(0,0,200)"/><rect x="506" y="290" width="40" height="40" fill="rgb(0,0,60)"/><rect x="546" y="290" width="40" height="40" fill="rgb(0,0,150)"/><rect x="586" y="290" width="40" height="40" fill="rgb(0,0,40)"/><rect x="506" y="210" width="120" height="120" fill="none" stroke="#3576C0" stroke-width="2"/><text x="566" y="352" class="label" text-anchor="middle" fill="#3576C0">только B</text><text x="652" y="270" font-size="34" font-weight="800" fill="#5E5850" text-anchor="middle" dominant-baseline="middle">=</text><rect x="678" y="210" width="40" height="40" fill="rgb(220,70,70)"/><rect x="718" y="210" width="40" height="40" fill="rgb(250,200,80)"/><rect x="758" y="210" width="40" height="40" fill="rgb(90,180,90)"/><rect x="678" y="250" width="40" height="40" fill="rgb(80,150,220)"/><rect x="718" y="250" width="40" height="40" fill="rgb(220,130,200)"/><rect x="758" y="250" width="40" height="40" fill="rgb(200,200,200)"/><rect x="678" y="290" width="40" height="40" fill="rgb(240,150,60)"/><rect x="718" y="290" width="40" height="40" fill="rgb(60,60,150)"/><rect x="758" y="290" width="40" height="40" fill="rgb(40,40,40)"/><rect x="678" y="210" width="120" height="120" fill="none" stroke="#111" stroke-width="2"/><text x="738" y="352" class="label" text-anchor="middle" fill="#111">цветная</text>
    <g transform="translate(80, 410)">
      <rect width="800" height="155" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Каждый пиксель собирается из трёх интенсивностей</text>
      <text x="400" y="62" class="small" text-anchor="middle">Центральный пиксель в этой картинке: R = 220, G = 130, B = 200 — пурпурно-розовый.</text>
      <text x="400" y="85" class="small" text-anchor="middle">«Только R» — это вся картинка, но обнулены G и B. Видим только «красную составляющую».</text>
      <text x="400" y="108" class="small" text-anchor="middle">Аналогично «только G» и «только B». Сложили три слоя — получили исходный цвет.</text>
      <text x="400" y="135" class="small" text-anchor="middle" font-weight="700">Никакого «цвета» в данных нет — только три числа на пиксель.</text>
    </g>
  </g>

  <g data-key="step6" data-only="1">
    <rect x="350" y="210" width="320" height="200" fill="#E8F1FE" stroke="#3576C0" stroke-width="2.5"/>
    <rect x="310" y="250" width="320" height="200" fill="#EFF8E8" stroke="#73B222" stroke-width="2.5"/>
    <rect x="270" y="290" width="320" height="200" fill="#FFEDED" stroke="#C30B0A" stroke-width="2.5"/>

    <line x1="350" y1="210" x2="270" y2="290" stroke="#aaa" stroke-width="0.8" stroke-dasharray="3 3"/>
    <line x1="670" y1="210" x2="590" y2="290" stroke="#aaa" stroke-width="0.8" stroke-dasharray="3 3"/>
    <line x1="670" y1="410" x2="590" y2="490" stroke="#aaa" stroke-width="0.8" stroke-dasharray="3 3"/>

    <text x="525" y="232" font-size="26" font-weight="800" fill="#3576C0" text-anchor="middle" dominant-baseline="middle">B</text>
    <text x="485" y="272" font-size="26" font-weight="800" fill="#73B222" text-anchor="middle" dominant-baseline="middle">G</text>
    <text x="430" y="395" font-size="64" font-weight="800" fill="#C30B0A" text-anchor="middle" dominant-baseline="middle" opacity="0.45">R</text>

    <line x1="270" y1="282" x2="590" y2="282" stroke="#5E5850" stroke-width="1.2"/>
    <line x1="270" y1="277" x2="270" y2="287" stroke="#5E5850" stroke-width="1.2"/>
    <line x1="590" y1="277" x2="590" y2="287" stroke="#5E5850" stroke-width="1.2"/>
    <text x="430" y="272" class="label" text-anchor="middle">W (ширина)</text>

    <line x1="262" y1="290" x2="262" y2="490" stroke="#5E5850" stroke-width="1.2"/>
    <line x1="257" y1="290" x2="267" y2="290" stroke="#5E5850" stroke-width="1.2"/>
    <line x1="257" y1="490" x2="267" y2="490" stroke="#5E5850" stroke-width="1.2"/>
    <text class="label" text-anchor="middle" transform="translate(245, 390) rotate(-90)">H (высота)</text>

    <line x1="600" y1="300" x2="680" y2="220" stroke="#5E5850" stroke-width="1.4"/>
    <polygon points="680,220 668,222 672,232" fill="#5E5850"/>
    <text x="695" y="215" class="label" fill="#73B222">C = 3 канала</text>
    <text x="695" y="234" class="small">«глубина» тензора</text>

    <g transform="translate(80, 500)">
      <rect width="800" height="90" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
      <text x="400" y="28" class="text" font-weight="700" text-anchor="middle">Реальные размеры тензора:</text>
      <text x="170" y="58" class="label" text-anchor="middle">CIFAR-10</text>
      <text x="170" y="78" class="small" text-anchor="middle">32 × 32 × 3</text>
      <text x="400" y="58" class="label" text-anchor="middle">ImageNet</text>
      <text x="400" y="78" class="small" text-anchor="middle">224 × 224 × 3</text>
      <text x="630" y="58" class="label" text-anchor="middle">Full HD фото</text>
      <text x="630" y="78" class="small" text-anchor="middle">1080 × 1920 × 3</text>
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · что видит компьютер</div>
      <h4>Любая картинка для машины — просто матрица чисел</h4>
      <p>Человек видит цветные пиксели, а компьютер — ту же сетку, но из чисел R, G, B на каждый пиксель. Дальше разберём, почему чисел три на пиксель, как из них собирается цвет и почему всё это — 3D-тензор.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · один пиксель</div>
      <h4>Один пиксель — одно число (в grayscale)</h4>
      <p>Сначала простой случай — чёрно-белая картинка, как в MNIST. 0 — чёрный, 255 — белый, всё между ними — оттенки серого. Реальный размер цифры в MNIST — 28 × 28 таких пикселей.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · цветной пиксель</div>
      <h4>Цветной пиксель — уже три числа</h4>
      <p>Любой цвет — это смесь R (красный), G (зелёный) и B (синий), каждое от 0 до 255. Жёлтый — много R и G, мало B; чёрный — (0, 0, 0); белый — (255, 255, 255).</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · три канала</div>
      <h4>Картинка раскладывается на 3 канала</h4>
      <p>Раз на пиксель приходится три числа, вся картинка — это три отдельные матрицы одинакового размера: красный, зелёный и синий каналы, каждый со значениями 0–255.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · сборка цвета</div>
      <h4>R + G + B = итоговая цветная картинка</h4>
      <p>Складываем интенсивности по всем каналам — получаем итоговый цвет. Центральный пиксель здесь: R = 220, G = 130, B = 200 — пурпурно-розовый. Никакого «цвета» в данных нет, только три числа на пиксель.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Шаг 6 · 3D-тензор</div>
      <h4>Картинка — это стопка из трёх матриц</h4>
      <p>Форма такого тензора — (высота × ширина × 3). Именно в этой форме картинки подаются в модели: CIFAR-10 — 32×32×3, ImageNet — 224×224×3, фото Full HD — 1080×1920×3.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### 3.3. Текст — самый хитрый случай

С текстом сложнее всего, потому что «правильное» превращение в числа здесь неочевидно. Наивный путь — закодировать каждую букву её номером (ASCII) — не работает: у слов *cat* и *car* почти одинаковые коды, но совершенно разный смысл, а у *cat* и *kitten* коды разные, хотя по смыслу они близки.

Следующая попытка — **one-hot векторы** — даёт каждому слову уникальный «адрес», но такие векторы огромные, почти полностью из нулей, и все слова в них «одинаково чужие» друг другу. Решение — **эмбеддинги**: короткие плотные векторы из вещественных чисел, которые модель *выстраивает* так, чтобы **геометрия отражала смысл** (близкие по смыслу слова — близкие векторы).

Главное для нашей картины: на вход модели в итоге всё равно идёт **вектор чисел** — просто полученный хитрее, чем у таблицы.
<div class="stage" id="stageWordEmbeddings" tabindex="0">
  <div class="stage-figure">
<svg id="wordEmbeddingsViz" viewBox="0 90 960 495" role="img" aria-label="Как слова становятся числами: word embeddings">
  <style>
    #wordEmbeddingsViz { font-family: Helvetica, Arial, sans-serif; }
    #wordEmbeddingsViz .text { font-size: 16px; fill: #111111; }
    #wordEmbeddingsViz .small { font-size: 13px; fill: #5E5850; }
    #wordEmbeddingsViz .label { font-size: 14px; font-weight: 700; fill: #111111; }
  </style>

  <g data-key="step1" data-only="1">
    <text x="240" y="120" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"cat"</text><rect x="148" y="135" width="52" height="52" fill="#ffffff" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="174" y="169" font-size="24" font-weight="700" fill="#111" text-anchor="middle">c</text><line x1="174" y1="191" x2="174.0" y2="207.0" stroke="#5E5850" stroke-width="1.5"/><polygon points="174,215 169.0,207.0 179.0,207.0" fill="#5E5850"/><text x="174" y="239" font-size="20" font-weight="800" fill="#3576C0" text-anchor="middle">99</text><rect x="214" y="135" width="52" height="52" fill="#ffffff" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="240" y="169" font-size="24" font-weight="700" fill="#111" text-anchor="middle">a</text><line x1="240" y1="191" x2="240.0" y2="207.0" stroke="#5E5850" stroke-width="1.5"/><polygon points="240,215 235.0,207.0 245.0,207.0" fill="#5E5850"/><text x="240" y="239" font-size="20" font-weight="800" fill="#3576C0" text-anchor="middle">97</text><rect x="280" y="135" width="52" height="52" fill="#ffffff" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="306" y="169" font-size="24" font-weight="700" fill="#111" text-anchor="middle">t</text><line x1="306" y1="191" x2="306.0" y2="207.0" stroke="#5E5850" stroke-width="1.5"/><polygon points="306,215 301.0,207.0 311.0,207.0" fill="#5E5850"/><text x="306" y="239" font-size="20" font-weight="800" fill="#3576C0" text-anchor="middle">116</text><text x="240" y="273" font-size="16" font-weight="700" fill="#111" text-anchor="middle">→ [99, 97, 116]</text>
    <text x="720" y="120" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"dog"</text><rect x="628" y="135" width="52" height="52" fill="#ffffff" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="654" y="169" font-size="24" font-weight="700" fill="#111" text-anchor="middle">d</text><line x1="654" y1="191" x2="654.0" y2="207.0" stroke="#5E5850" stroke-width="1.5"/><polygon points="654,215 649.0,207.0 659.0,207.0" fill="#5E5850"/><text x="654" y="239" font-size="20" font-weight="800" fill="#3576C0" text-anchor="middle">100</text><rect x="694" y="135" width="52" height="52" fill="#ffffff" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="720" y="169" font-size="24" font-weight="700" fill="#111" text-anchor="middle">o</text><line x1="720" y1="191" x2="720.0" y2="207.0" stroke="#5E5850" stroke-width="1.5"/><polygon points="720,215 715.0,207.0 725.0,207.0" fill="#5E5850"/><text x="720" y="239" font-size="20" font-weight="800" fill="#3576C0" text-anchor="middle">111</text><rect x="760" y="135" width="52" height="52" fill="#ffffff" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="786" y="169" font-size="24" font-weight="700" fill="#111" text-anchor="middle">g</text><line x1="786" y1="191" x2="786.0" y2="207.0" stroke="#5E5850" stroke-width="1.5"/><polygon points="786,215 781.0,207.0 791.0,207.0" fill="#5E5850"/><text x="786" y="239" font-size="20" font-weight="800" fill="#3576C0" text-anchor="middle">103</text><text x="720" y="273" font-size="16" font-weight="700" fill="#111" text-anchor="middle">→ [100, 111, 103]</text>

    <g transform="translate(80, 360)">
      <rect width="800" height="50" rx="10" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.2"/>
      <text x="400" y="20" class="label" text-anchor="middle">Откуда числа: ASCII-таблица</text>
      <text x="400" y="40" class="small" text-anchor="middle">a = 97   ·   b = 98   ·   c = 99   ·   d = 100   ·   …   ·   z = 122   ·   ' ' = 32   ·   '!' = 33</text>
    </g>

    <g transform="translate(80, 440)">
      <rect width="800" height="130" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Так компьютер хранит текст: 1 буква = 1 число (0–255)</text>
      <text x="400" y="60" class="small" text-anchor="middle">ASCII — реальный стандарт, используется в каждом текстовом файле.</text>
      <text x="400" y="82" class="small" text-anchor="middle">Слово целиком = массив чисел. Это естественная первая мысль:</text>
      <text x="400" y="104" class="small" text-anchor="middle">взять эти массивы и подавать в нейросеть. Дальше — почему так не работает.</text>
    </g>
  </g>

  <g data-key="step2" data-only="1">
    <g transform="translate(80, 110)">
      <rect width="380" height="300" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
      <text x="190" y="32" class="label" fill="#C30B0A" text-anchor="middle">Близкие коды — разный смысл</text>

      <text x="100" y="80" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"cat"</text>
      <text x="100" y="108" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">[99, 97, 116]</text>

      <text x="280" y="80" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"car"</text>
      <text x="280" y="108" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">[99, 97, 114]</text>

      <text x="190" y="160" class="small" text-anchor="middle">Отличаются только на 2</text>
      <text x="190" y="178" class="small" text-anchor="middle">в одной позиции</text>
      <text x="190" y="196" class="small" text-anchor="middle">→ для ASCII почти одно и то же</text>

      <text x="190" y="235" class="text" font-weight="700" text-anchor="middle">Но cat ≠ car</text>
      <text x="190" y="260" class="small" text-anchor="middle">(животное vs транспорт —</text>
      <text x="190" y="278" class="small" text-anchor="middle">никакого сходства по смыслу)</text>
    </g>

    <g transform="translate(500, 110)">
      <rect width="380" height="300" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
      <text x="190" y="32" class="label" fill="#C30B0A" text-anchor="middle">Близкий смысл — разные коды</text>

      <text x="100" y="80" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"cat"</text>
      <text x="100" y="108" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">[99, 97, 116]</text>

      <text x="280" y="80" font-size="22" font-weight="800" fill="#111" text-anchor="middle">"kitten"</text>
      <text x="280" y="108" font-size="12" font-weight="700" fill="#3576C0" text-anchor="middle">[107, 105, 116, 116, 101, 110]</text>

      <text x="190" y="160" class="small" text-anchor="middle">Совсем разные числа,</text>
      <text x="190" y="178" class="small" text-anchor="middle">даже длины массивов разные</text>

      <text x="190" y="235" class="text" font-weight="700" text-anchor="middle">Но kitten ≈ cat</text>
      <text x="190" y="260" class="small" text-anchor="middle">(котёнок и кошка —</text>
      <text x="190" y="278" class="small" text-anchor="middle">буквально семья)</text>
    </g>

    <g transform="translate(80, 440)">
      <rect width="800" height="130" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">ASCII оптимизирован для хранения, а не для понимания</text>
      <text x="400" y="60" class="small" text-anchor="middle">Числа в ASCII — это просто порядковые номера символов в таблице.</text>
      <text x="400" y="82" class="small" text-anchor="middle">Они отражают «как буква записана», но ничего не знают про смысл слов.</text>
      <text x="400" y="106" class="small" text-anchor="middle">Нужен другой способ — на уровне слов, а не букв.</text>
    </g>
  </g>

  <g data-key="step3" data-only="1">
<text x="175" y="131" class="label" text-anchor="middle">слово</text><text x="376" y="131" class="label" text-anchor="middle">one-hot вектор</text><text x="570" y="131" class="label" text-anchor="middle">как массив</text><text x="175" y="173" font-size="17" font-weight="700" fill="#111" text-anchor="middle">кот</text><rect x="250" y="145" width="44" height="44" fill="#3576C0" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="272" y="174" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">1</text><rect x="302" y="145" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="324" y="174" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="354" y="145" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="376" y="174" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="406" y="145" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="428" y="174" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="458" y="145" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="480" y="174" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><text x="515" y="172" font-size="14" font-weight="700" fill="#111">[1, 0, 0, 0, 0]</text><text x="175" y="229" font-size="17" font-weight="700" fill="#111" text-anchor="middle">собака</text><rect x="250" y="201" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="272" y="230" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="302" y="201" width="44" height="44" fill="#3576C0" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="324" y="230" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">1</text><rect x="354" y="201" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="376" y="230" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="406" y="201" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="428" y="230" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="458" y="201" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="480" y="230" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><text x="515" y="228" font-size="14" font-weight="700" fill="#111">[0, 1, 0, 0, 0]</text><text x="175" y="285" font-size="17" font-weight="700" fill="#111" text-anchor="middle">автомобиль</text><rect x="250" y="257" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="272" y="286" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="302" y="257" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="324" y="286" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="354" y="257" width="44" height="44" fill="#3576C0" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="376" y="286" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">1</text><rect x="406" y="257" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="428" y="286" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="458" y="257" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="480" y="286" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><text x="515" y="284" font-size="14" font-weight="700" fill="#111">[0, 0, 1, 0, 0]</text><text x="175" y="341" font-size="17" font-weight="700" fill="#111" text-anchor="middle">молоко</text><rect x="250" y="313" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="272" y="342" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="302" y="313" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="324" y="342" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="354" y="313" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="376" y="342" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="406" y="313" width="44" height="44" fill="#3576C0" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="428" y="342" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">1</text><rect x="458" y="313" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="480" y="342" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><text x="515" y="340" font-size="14" font-weight="700" fill="#111">[0, 0, 0, 1, 0]</text><text x="175" y="397" font-size="17" font-weight="700" fill="#111" text-anchor="middle">дом</text><rect x="250" y="369" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="272" y="398" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="302" y="369" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="324" y="398" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="354" y="369" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="376" y="398" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="406" y="369" width="44" height="44" fill="#F4F4F4" stroke="#CCC" stroke-width="1" rx="6"/><text x="428" y="398" font-size="20" font-weight="600" fill="#999" text-anchor="middle">0</text><rect x="458" y="369" width="44" height="44" fill="#3576C0" stroke="#3576C0" stroke-width="1.5" rx="6"/><text x="480" y="398" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">1</text><text x="515" y="396" font-size="14" font-weight="700" fill="#111">[0, 0, 0, 0, 1]</text>
    <g transform="translate(80, 460)">
      <rect width="800" height="110" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Каждое слово получает уникальный «адрес» в словаре</text>
      <text x="400" y="58" class="small" text-anchor="middle">Длина вектора = размер словаря V. Единица — в позиции слова, остальное — нули.</text>
      <text x="400" y="80" class="small" text-anchor="middle">В реальности V = 10 000 — 50 000 слов. Огромный вектор почти из одних нулей.</text>
      <text x="400" y="102" class="small" text-anchor="middle">Уже лучше ASCII: компьютер видит «слово №42», а не «три буквы».</text>
    </g>
  </g>

  <g data-key="step4" data-only="1">
<line x1="270" y1="405" x2="460.0" y2="405.0" stroke="#5E5850" stroke-width="1.5"/><polygon points="470,405 460.0,410.0 460.0,400.0" fill="#5E5850"/><line x1="270" y1="405" x2="270.0" y2="215.0" stroke="#5E5850" stroke-width="1.5"/><polygon points="270,205 275.0,215.0 265.0,215.0" fill="#5E5850"/><line x1="270" y1="405" x2="392.4" y2="301.5" stroke="#5E5850" stroke-width="1.5"/><polygon points="400,295 395.6,305.3 389.1,297.6" fill="#5E5850"/><text x="478" y="410" class="small">ось 1</text><text x="265" y="195" class="small">ось 2</text><text x="408" y="291" class="small">ось 3</text><line x1="470" y1="405" x2="270" y2="205" stroke="#C30B0A" stroke-width="1.2" stroke-dasharray="5 4"/><line x1="470" y1="405" x2="400" y2="295" stroke="#C30B0A" stroke-width="1.2" stroke-dasharray="5 4"/><line x1="270" y1="205" x2="400" y2="295" stroke="#C30B0A" stroke-width="1.2" stroke-dasharray="5 4"/><rect x="352" y="293" width="36" height="20" rx="4" fill="#fff" stroke="#C30B0A" stroke-width="0.8"/><text x="370" y="308" font-size="13" font-weight="700" fill="#C30B0A" text-anchor="middle">√2</text><rect x="425" y="346" width="36" height="20" rx="4" fill="#fff" stroke="#C30B0A" stroke-width="0.8"/><text x="443" y="361" font-size="13" font-weight="700" fill="#C30B0A" text-anchor="middle">√2</text><rect x="303" y="238" width="36" height="20" rx="4" fill="#fff" stroke="#C30B0A" stroke-width="0.8"/><text x="321" y="253" font-size="13" font-weight="700" fill="#C30B0A" text-anchor="middle">√2</text><circle cx="470" cy="405" r="7" fill="#3576C0" stroke="#111" stroke-width="1.5"/><text x="480" y="411" class="label">кот</text><circle cx="270" cy="205" r="7" fill="#3576C0" stroke="#111" stroke-width="1.5"/><text x="282" y="209" class="label">собака</text><circle cx="400" cy="295" r="7" fill="#3576C0" stroke="#111" stroke-width="1.5"/><text x="410" y="287" class="label">автомобиль</text><text x="258" y="423" class="small">0</text>
    <g transform="translate(560, 110)">
      <rect width="320" height="280" rx="12" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.5"/>
      <text x="160" y="35" class="label" text-anchor="middle">Что не так?</text>
      <text x="20" y="72" class="small">• Все векторы перпендикулярны</text>
      <text x="20" y="92" class="small">  друг другу (ортогональны)</text>
      <text x="20" y="130" class="small">• Расстояние между любыми</text>
      <text x="20" y="150" class="small">  двумя словами одинаковое: √2</text>
      <text x="20" y="190" class="small">  d(кот, собака) =</text>
      <text x="20" y="210" class="small">  d(кот, автомобиль) = √2</text>
      <text x="20" y="248" class="small" font-weight="700">• Семантика нулевая —</text>
      <text x="20" y="268" class="small" font-weight="700">  все слова одинаково «чужие»</text>
    </g>

    <g transform="translate(80, 460)">
      <rect width="800" height="110" rx="12" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" fill="#C30B0A" text-anchor="middle">Нельзя сказать, что кот ближе к собаке, чем к автомобилю</text>
      <text x="400" y="60" class="small" text-anchor="middle">При V = 50 000 — гигантские разреженные векторы, и каждое слово «остров».</text>
      <text x="400" y="82" class="small" text-anchor="middle">Нужны векторы, у которых геометрия отражает семантику.</text>
      <text x="400" y="102" class="small" text-anchor="middle">Так появляются эмбеддинги — следующий шаг.</text>
    </g>
  </g>

  <g data-key="step5" data-only="1">
<text x="290" y="135" class="label" text-anchor="middle">слово → вектор (длина 2 для примера)</text><rect x="100" y="165" width="380" height="40" fill="#FAFAFA" stroke="#3576C0" stroke-width="0.6" rx="4"/><text x="210" y="190" font-size="16" font-weight="700" fill="#111" text-anchor="end">кот</text><text x="235" y="190" font-size="16" fill="#5E5850" text-anchor="middle">→</text><text x="265" y="190" font-size="18" fill="#111">[</text><text x="320" y="190" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.85</text><text x="355" y="190" font-size="15" fill="#5E5850" text-anchor="middle">,</text><text x="395" y="190" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.20</text><text x="450" y="190" font-size="18" fill="#111">]</text><rect x="100" y="211" width="380" height="40" fill="#FFFFFF" stroke="#3576C0" stroke-width="0.6" rx="4"/><text x="210" y="236" font-size="16" font-weight="700" fill="#111" text-anchor="end">собака</text><text x="235" y="236" font-size="16" fill="#5E5850" text-anchor="middle">→</text><text x="265" y="236" font-size="18" fill="#111">[</text><text x="320" y="236" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.90</text><text x="355" y="236" font-size="15" fill="#5E5850" text-anchor="middle">,</text><text x="395" y="236" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.35</text><text x="450" y="236" font-size="18" fill="#111">]</text><rect x="100" y="257" width="380" height="40" fill="#FAFAFA" stroke="#3576C0" stroke-width="0.6" rx="4"/><text x="210" y="282" font-size="16" font-weight="700" fill="#111" text-anchor="end">молоко</text><text x="235" y="282" font-size="16" fill="#5E5850" text-anchor="middle">→</text><text x="265" y="282" font-size="18" fill="#111">[</text><text x="320" y="282" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.35</text><text x="355" y="282" font-size="15" fill="#5E5850" text-anchor="middle">,</text><text x="395" y="282" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.25</text><text x="450" y="282" font-size="18" fill="#111">]</text><rect x="100" y="303" width="380" height="40" fill="#FFFFFF" stroke="#3576C0" stroke-width="0.6" rx="4"/><text x="210" y="328" font-size="16" font-weight="700" fill="#111" text-anchor="end">автомобиль</text><text x="235" y="328" font-size="16" fill="#5E5850" text-anchor="middle">→</text><text x="265" y="328" font-size="18" fill="#111">[</text><text x="320" y="328" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.15</text><text x="355" y="328" font-size="15" fill="#5E5850" text-anchor="middle">,</text><text x="395" y="328" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.85</text><text x="450" y="328" font-size="18" fill="#111">]</text><rect x="100" y="349" width="380" height="40" fill="#FAFAFA" stroke="#3576C0" stroke-width="0.6" rx="4"/><text x="210" y="374" font-size="16" font-weight="700" fill="#111" text-anchor="end">дом</text><text x="235" y="374" font-size="16" fill="#5E5850" text-anchor="middle">→</text><text x="265" y="374" font-size="18" fill="#111">[</text><text x="320" y="374" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.20</text><text x="355" y="374" font-size="15" fill="#5E5850" text-anchor="middle">,</text><text x="395" y="374" font-size="15" font-weight="700" fill="#3576C0" text-anchor="middle">0.75</text><text x="450" y="374" font-size="18" fill="#111">]</text>
    <g transform="translate(540, 145)">
      <rect width="340" height="245" rx="12" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.5"/>
      <text x="170" y="32" class="label" text-anchor="middle">Особенности</text>
      <text x="20" y="64" class="small">• Длина вектора маленькая:</text>
      <text x="20" y="83" class="small">  в реальности 50–1000 чисел</text>

      <text x="20" y="115" class="small">• Числа реальные (0.34, -0.12...),</text>
      <text x="20" y="134" class="small">  не нули и единицы</text>

      <text x="20" y="166" class="small">• Подбираются обучением модели —</text>
      <text x="20" y="185" class="small">  не задаются вручную</text>

      <text x="20" y="216" class="small" font-weight="700">• Сами по себе числа выглядят</text>
      <text x="20" y="232" class="small" font-weight="700">  случайно. Магия — в геометрии.</text>
    </g>

    <g transform="translate(80, 410)">
      <rect width="800" height="160" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Контраст с one-hot</text>
      <text x="400" y="60" class="small" text-anchor="middle">one-hot: длина 50 000, почти всё нули, единственная 1</text>
      <text x="400" y="82" class="small" text-anchor="middle">embedding: длина 50–1000, все числа значимые и реальные</text>
      <text x="400" y="104" class="small" text-anchor="middle">one-hot задаются вручную; эмбеддинги выстраиваются из текстов</text>
      <text x="400" y="135" class="small" text-anchor="middle" font-weight="700">Главное — у этих чисел появляется геометрический смысл (следующий шаг).</text>
    </g>
  </g>

  <g data-key="step6" data-only="1">
<rect x="80" y="110" width="620" height="310" fill="#FAFCFF" stroke="#DDE" stroke-width="1" rx="6"/><line x1="110" y1="390" x2="675.0" y2="390.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="685,390 675.0,395.0 675.0,385.0" fill="#5E5850"/><line x1="110" y1="390" x2="110.0" y2="135.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="110,125 115.0,135.0 105.0,135.0" fill="#5E5850"/><text x="610" y="408" class="small">ось 1 (→ живое)</text><text class="small" transform="translate(98, 210) rotate(-90)" text-anchor="middle">ось 2 (→ крупное)</text><ellipse cx="601.25" cy="311.25" rx="62" ry="48" fill="#73B222" fill-opacity="0.10" stroke="#73B222" stroke-width="1.3" stroke-dasharray="5 4"/><text x="671.25" y="281.25" class="label" fill="#73B222">животные</text><ellipse cx="216.25" cy="180" rx="58" ry="48" fill="#3576C0" fill-opacity="0.10" stroke="#3576C0" stroke-width="1.3" stroke-dasharray="5 4"/><text x="286.25" y="150" class="label" fill="#3576C0">крупное, неживое</text><line x1="587.5" y1="330" x2="615" y2="292.5" stroke="#73B222" stroke-width="1.5" stroke-dasharray="5 4"/><text x="615.25" y="307.25" font-size="12" font-weight="700" fill="#73B222">близко</text><line x1="587.5" y1="330" x2="202.5" y2="167.5" stroke="#C30B0A" stroke-width="1.5" stroke-dasharray="5 4"/><text x="365" y="266.75" font-size="12" font-weight="700" fill="#C30B0A">далеко</text><circle cx="587.5" cy="330" r="6" fill="#111" stroke="#111" stroke-width="1.5"/><text x="597.5" y="335" class="label" text-anchor="start">кот</text><circle cx="615" cy="292.5" r="6" fill="#111" stroke="#111" stroke-width="1.5"/><text x="625" y="282.5" class="label" text-anchor="start">собака</text><circle cx="312.5" cy="317.5" r="6" fill="#111" stroke="#111" stroke-width="1.5"/><text x="322.5" y="322.5" class="label" text-anchor="start">молоко</text><circle cx="202.5" cy="167.5" r="6" fill="#111" stroke="#111" stroke-width="1.5"/><text x="192.5" y="157.5" class="label" text-anchor="end">автомобиль</text><circle cx="230" cy="192.5" r="6" fill="#111" stroke="#111" stroke-width="1.5"/><text x="240" y="210.5" class="label" text-anchor="start">дом</text>
    <g transform="translate(720, 110)">
      <rect width="160" height="310" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
      <text x="80" y="32" class="label" text-anchor="middle">Что видно</text>
      <text x="10" y="68" class="small">• кот и собака</text>
      <text x="10" y="86" class="small">  оказались рядом</text>

      <text x="10" y="120" class="small">• автомобиль и дом</text>
      <text x="10" y="138" class="small">  тоже близко</text>

      <text x="10" y="172" class="small">• молоко</text>
      <text x="10" y="190" class="small">  само по себе</text>

      <text x="10" y="240" class="small" font-weight="700">Расстояние</text>
      <text x="10" y="258" class="small" font-weight="700">в пространстве</text>
      <text x="10" y="276" class="small" font-weight="700">= близость</text>
      <text x="10" y="294" class="small" font-weight="700">по смыслу</text>
    </g>

    <g transform="translate(80, 440)">
      <rect width="800" height="130" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Геометрия теперь несёт смысл</text>
      <text x="400" y="60" class="small" text-anchor="middle">В one-hot все слова на расстоянии √2 друг от друга — это бесполезно.</text>
      <text x="400" y="82" class="small" text-anchor="middle">В embeddings: d(кот, собака) маленькое, d(кот, автомобиль) большое.</text>
      <text x="400" y="106" class="small" text-anchor="middle">Откуда модель берёт именно такие числа? Следующий шаг — обучение.</text>
    </g>
  </g>

  <g data-key="step7" data-only="1">
    <g transform="translate(80, 110)">
      <rect width="800" height="135" rx="12" fill="#F4F8FF" stroke="#3576C0" stroke-width="1.2"/>
      <text x="400" y="32" class="label" text-anchor="middle">Модель видит миллионы предложений из текста. Сравните:</text>

      <text x="60" y="76" font-size="18" fill="#111">Пушистый</text>
      <rect x="172" y="58" width="80" height="28" fill="#73B222" fill-opacity="0.20" stroke="#73B222" stroke-width="1.5" rx="5"/>
      <text x="212" y="78" font-size="18" font-weight="800" fill="#73B222" text-anchor="middle">кот</text>
      <text x="265" y="76" font-size="18" fill="#111">сидит на коврике.</text>

      <text x="60" y="115" font-size="18" fill="#111">Пушистый</text>
      <rect x="172" y="97" width="80" height="28" fill="#73B222" fill-opacity="0.20" stroke="#73B222" stroke-width="1.5" rx="5"/>
      <text x="212" y="117" font-size="18" font-weight="800" fill="#73B222" text-anchor="middle">пёс</text>
      <text x="265" y="115" font-size="18" fill="#111">сидит на коврике.</text>

      <text x="560" y="78" class="small" fill="#5E5850" font-weight="700">одинаковый</text>
      <text x="560" y="96" class="small" fill="#5E5850" font-weight="700">контекст:</text>
      <text x="560" y="118" class="small" fill="#5E5850">«Пушистый ___ сидит»</text>
    </g>

    <g transform="translate(80, 270)">
      <rect width="800" height="170" rx="12" fill="#fff" stroke="#C29E08" stroke-width="1.2"/>
      <text x="400" y="28" class="label" text-anchor="middle" fill="#C29E08">Что делает обучение: подвигает векторы ближе</text>

      <text x="160" y="58" class="small" text-anchor="middle" font-weight="700">До обучения</text>
      <circle cx="90" cy="110" r="6" fill="none" stroke="#111" stroke-width="1.5" stroke-dasharray="3 2"/>
      <text x="90" y="132" class="small" text-anchor="middle">кот</text>
      <circle cx="240" cy="130" r="6" fill="none" stroke="#111" stroke-width="1.5" stroke-dasharray="3 2"/>
      <text x="240" y="152" class="small" text-anchor="middle">пёс</text>

      <line x1="330" y1="115" x2="448.0" y2="115.0" stroke="#C29E08" stroke-width="2.5"/><polygon points="460,115 448.0,120.0 448.0,110.0" fill="#C29E08"/>
      <text x="395" y="103" class="small" text-anchor="middle" fill="#C29E08" font-weight="700">обучение</text>
      <text x="395" y="138" class="small" text-anchor="middle">млрд примеров</text>

      <text x="620" y="58" class="small" text-anchor="middle" font-weight="700">После обучения</text>
      <circle cx="600" cy="120" r="6" fill="#73B222" stroke="#111" stroke-width="1.5"/>
      <text x="600" y="142" class="small" text-anchor="middle" font-weight="700">кот</text>
      <circle cx="645" cy="125" r="6" fill="#73B222" stroke="#111" stroke-width="1.5"/>
      <text x="645" y="147" class="small" text-anchor="middle" font-weight="700">пёс</text>

      <text x="622" y="95" class="small" fill="#73B222" font-weight="700" text-anchor="middle">рядом</text>
    </g>

    <g transform="translate(80, 460)">
      <rect width="800" height="110" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/>
      <text x="400" y="32" class="text" font-weight="700" text-anchor="middle">Word2Vec (2013): нейросеть учится предсказывать соседние слова</text>
      <text x="400" y="58" class="small" text-anchor="middle">«Кот» и «пёс» появляются в похожих фразах — их векторы сближаются.</text>
      <text x="400" y="80" class="small" text-anchor="middle">«Автомобиль» в таких контекстах не встречается — его вектор остаётся далеко.</text>
      <text x="400" y="100" class="small" text-anchor="middle">После миллиардов примеров — стабильная карта смыслов.</text>
    </g>
  </g>

  <g data-key="step8" data-only="1">
<rect x="140" y="100" width="680" height="310" fill="#FAFCFF" stroke="#DDE" stroke-width="1" rx="6"/><line x1="170" y1="380" x2="795.0" y2="380.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="805,380 795.0,385.0 795.0,375.0" fill="#5E5850"/><line x1="170" y1="380" x2="170.0" y2="125.0" stroke="#5E5850" stroke-width="1.2"/><polygon points="170,115 175.0,125.0 165.0,125.0" fill="#5E5850"/><text x="720" y="398" class="small">«женское» →</text><text class="small" transform="translate(158, 190) rotate(-90)" text-anchor="middle">«королевское» →</text><line x1="278.5" y1="325.5" x2="332.4" y2="209.9" stroke="#73B222" stroke-width="2.6"/><polygon points="337.5,199 337.0,212.0 327.9,207.8" fill="#73B222"/><line x1="603" y1="314" x2="656.9" y2="198.4" stroke="#73B222" stroke-width="2.6"/><polygon points="662,187.5 661.5,200.5 652.4,196.3" fill="#73B222"/><text x="296" y="267.25" class="small" fill="#73B222" font-weight="700" text-anchor="end">+ королевское</text><text x="644.5" y="255.75" class="small" fill="#73B222" font-weight="700">+ королевское</text><line x1="278.5" y1="325.5" x2="603" y2="314" stroke="#C29E08" stroke-width="1.5" stroke-dasharray="5 4"/><text x="440.75" y="339.75" class="small" fill="#C29E08" font-weight="700" text-anchor="middle">+ женское</text><line x1="337.5" y1="199" x2="662" y2="187.5" stroke="#C29E08" stroke-width="1.5" stroke-dasharray="5 4"/><text x="499.75" y="183.25" class="small" fill="#C29E08" font-weight="700" text-anchor="middle">+ женское</text><circle cx="278.5" cy="325.5" r="7" fill="#111" stroke="#fff" stroke-width="1.5"/><circle cx="337.5" cy="199" r="7" fill="#111" stroke="#fff" stroke-width="1.5"/><circle cx="603" cy="314" r="7" fill="#111" stroke="#fff" stroke-width="1.5"/><circle cx="662" cy="187.5" r="7" fill="#111" stroke="#fff" stroke-width="1.5"/><text x="268.5" y="330.5" class="label" text-anchor="end">мужчина</text><text x="327.5" y="204" class="label" text-anchor="end">король</text><text x="615" y="319" class="label">женщина</text><text x="674" y="192.5" class="label">королева</text>
    <g transform="translate(80, 430)">
      <rect width="800" height="140" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5"/>
      <text x="400" y="30" class="text" font-weight="700" text-anchor="middle">Эмбеддинги несут смысловые отношения</text>
      <text x="400" y="62" font-size="18" font-weight="800" fill="#73B222" text-anchor="middle">vec(король) − vec(мужчина) + vec(женщина) ≈ vec(королева)</text>
      <text x="400" y="90" class="small" text-anchor="middle">Разница между «королём» и «мужчиной» — тот же вектор, что между «королевой» и «женщиной».</text>
      <text x="400" y="110" class="small" text-anchor="middle">Модель выучила «королевское» и «женское» как направления в пространстве.</text>
      <text x="400" y="130" class="small" text-anchor="middle" font-weight="700">С эмбеддингами можно считать. И именно так работают все современные языковые модели.</text>
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · наивная идея</div>
      <h4>Буква → число: ASCII</h4>
      <p>Самый простой способ кодировать текст — назначить каждой букве число по ASCII-таблице. Слово целиком становится массивом чисел — естественная первая мысль, но дальше выясняется, почему так не работает.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · проблема ASCII</div>
      <h4>Близость кодов не равна близости смысла</h4>
      <p>"cat" и "car" отличаются в ASCII всего на 2 — но животное и транспорт ничего общего не имеют. А "cat" и "kitten" совсем разные по кодам, хотя смысл почти один и тот же. Нужен способ на уровне слов, а не букв.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · one-hot encoding</div>
      <h4>Идея получше: one-hot кодирование</h4>
      <p>Словарь из V слов — каждое слово получает вектор длины V с единственной единицей на своей позиции. Уже лучше ASCII: компьютер видит «слово №42», а не «три буквы».</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · проблема one-hot</div>
      <h4>Все слова одинаково далеки друг от друга</h4>
      <p>Векторы one-hot попарно ортогональны — расстояние между любыми двумя словами одинаковое: √2. Нельзя сказать, что кот ближе к собаке, чем к автомобилю. Нужны векторы, у которых геометрия отражает семантику.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · эмбеддинги</div>
      <h4>Эмбеддинг — плотный вектор осмысленных чисел</h4>
      <p>Каждое слово — короткий массив реальных чисел (в реальности 50–1000 значений), которые подбираются обучением модели, а не задаются вручную. Сами числа выглядят случайно — магия в их геометрии.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Шаг 6 · геометрия смысла</div>
      <h4>Близкие по смыслу слова оказываются рядом</h4>
      <p>Те же 5 слов как точки на плоскости: кот и собака оказались рядом, автомобиль и дом — тоже близко. Расстояние в пространстве эмбеддингов = близость по смыслу — то, чего one-hot дать не может.</p>
    </div>
    <div class="step-panel" data-on="step7" data-focus="step7">
      <div class="step-kicker">Шаг 7 · как обучаются</div>
      <h4>Обучение через предсказание контекста</h4>
      <p>Word2Vec: слова, появляющиеся в похожих контекстах, получают похожие векторы. «Кот» и «пёс» встречаются в одинаковых фразах — их векторы сближаются, а «автомобиль» в таких контекстах не встречается и остаётся далеко.</p>
    </div>
    <div class="step-panel" data-on="step8" data-focus="step8">
      <div class="step-kicker">Шаг 8 · магия арифметики</div>
      <h4>С векторами слов можно считать</h4>
      <p>Классика Word2Vec: vec(король) − vec(мужчина) + vec(женщина) ≈ vec(королева). Модель выучила «королевское» и «женское» как направления в пространстве — и именно так устроены все современные языковые модели.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### 3.4. Общий знаменатель

Если отойти на шаг назад, видно одну и ту же картину:

| Тип данных | Во что превращается | Форма |
| --- | --- | --- |
| Таблица (один объект) | вектор | `(m,)` |
| Изображение | тензор | `(H × W × C)` |
| Текст (слово/токен) | вектор-эмбеддинг | `(d,)` |
| Аудио, временные ряды | вектор / 1D-сигнал | `(t,)` |

> *Аудио и временные ряды добавлены для полноты — они тоже сводятся к числам. При желании это отдельный мини-интерактив, но для статьи достаточно строки в таблице.*

Вывод раздела: **любой вход — это тензор чисел фиксированной формы.** Эта форма — первое, что определяет, какую модель мы вообще можем использовать.
<div class="stage" id="stageTensors" tabindex="0">
  <div class="stage-figure">
<svg id="mlTensors" viewBox="0 160 960 390" role="img" aria-label="Любой вход превращается в тензор чисел">
  <style>
    #mlTensors { font-family: Helvetica, Arial, sans-serif; }
    #mlTensors .lbl { font-size: 15px; fill: #111111; }
    #mlTensors .mono { font-size: 15px; fill: #111111; font-family: "Courier New", monospace; }
    #mlTensors .text { font-size: 16px; fill: #111111; }
    #mlTensors .small { font-size: 13px; fill: #5E5850; }
    #mlTensors .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    #mlTensors .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    #mlTensors .box-dark   { fill: #1b1d26; rx: 14; }
  </style>
  <defs>
    <marker id="tsArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="step1" data-only="1">
    <rect class="box-blue" x="80" y="230" width="200" height="160"/>
    <text x="180" y="270" class="lbl" text-anchor="middle" font-weight="700">Таблица</text>
    <g stroke="#3576C0" stroke-width="1.2" fill="none">
      <rect x="110" y="290" width="140" height="60"/>
      <line x1="110" y1="310" x2="250" y2="310"/>
      <line x1="110" y1="330" x2="250" y2="330"/>
      <line x1="157" y1="290" x2="157" y2="350"/>
      <line x1="203" y1="290" x2="203" y2="350"/>
    </g>

    <rect class="box-blue" x="380" y="230" width="200" height="160"/>
    <text x="480" y="270" class="lbl" text-anchor="middle" font-weight="700">Картинка</text>
    <g>
      <rect x="420" y="288" width="20" height="20" fill="#C30B0A"/>
      <rect x="440" y="288" width="20" height="20" fill="#C29E08"/>
      <rect x="460" y="288" width="20" height="20" fill="#73B222"/>
      <rect x="480" y="288" width="20" height="20" fill="#3576C0"/>
      <rect x="420" y="308" width="20" height="20" fill="#C29E08"/>
      <rect x="440" y="308" width="20" height="20" fill="#73B222"/>
      <rect x="460" y="308" width="20" height="20" fill="#3576C0"/>
      <rect x="480" y="308" width="20" height="20" fill="#C30B0A"/>
      <rect x="420" y="328" width="20" height="20" fill="#73B222"/>
      <rect x="440" y="328" width="20" height="20" fill="#3576C0"/>
      <rect x="460" y="328" width="20" height="20" fill="#C30B0A"/>
      <rect x="480" y="328" width="20" height="20" fill="#C29E08"/>
    </g>

    <rect class="box-blue" x="680" y="230" width="200" height="160"/>
    <text x="780" y="270" class="lbl" text-anchor="middle" font-weight="700">Текст</text>
    <text x="780" y="325" text-anchor="middle" font-size="26" font-weight="700" fill="#3576C0">«кот»</text>

    <text x="480" y="450" class="text" text-anchor="middle" font-weight="700">Внутри коробки все они должны превратиться в числа</text>
    <text x="480" y="482" class="small" text-anchor="middle">Дальше посмотрим, как именно это происходит с каждым</text>
  </g>

  <g data-key="step2" data-only="1">
    <text x="200" y="220" class="lbl" text-anchor="middle">Одна квартира</text>
    <g stroke="#3576C0" stroke-width="1.3" fill="none">
      <rect x="90" y="250" width="220" height="120"/>
      <line x1="90" y1="280" x2="310" y2="280"/>
      <line x1="90" y1="310" x2="310" y2="310"/>
      <line x1="90" y1="340" x2="310" y2="340"/>
      <line x1="200" y1="250" x2="200" y2="370"/>
    </g>
    <g class="small" fill="#5E5850">
      <text x="100" y="300">площадь</text><text x="240" y="300">65</text>
      <text x="100" y="330">комнаты</text><text x="240" y="330">2</text>
      <text x="100" y="360">этаж</text><text x="240" y="360">4</text>
    </g>

    <line x1="330" y1="310" x2="452" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#tsArrow)"/>

    <rect class="box-green" x="470" y="270" width="410" height="80"/>
    <text x="675" y="318" class="mono" text-anchor="middle" font-weight="700" fill="#73B222">x = [65, 2, 4, 10]</text>

    <text x="675" y="410" class="small" text-anchor="middle">Вектор формы <tspan font-weight="700">(m,)</tspan> — m признаков подряд</text>
    <text x="480" y="500" class="small" text-anchor="middle">Порядок важен: 2-я позиция всегда «комнаты», 3-я всегда «этаж»</text>
  </g>

  <g data-key="step3" data-only="1">
    <text x="200" y="215" class="lbl" text-anchor="middle">Один пиксель</text>
    <rect x="150" y="235" width="100" height="100" fill="#dc82c8" stroke="#3576C0" stroke-width="1.5"/>

    <line x1="266" y1="285" x2="388" y2="285" stroke="#5E5850" stroke-width="2.5" marker-end="url(#tsArrow)"/>

    <rect class="box-red"   x="400" y="240" width="150" height="44" fill="#FFF2F2" stroke="#C30B0A" stroke-width="1.45" rx="14"/>
    <text x="475" y="268" class="mono" text-anchor="middle" font-weight="700" fill="#C30B0A">R = 220</text>
    <rect class="box-green" x="400" y="292" width="150" height="44"/>
    <text x="475" y="320" class="mono" text-anchor="middle" font-weight="700" fill="#73B222">G = 130</text>
    <rect class="box-blue"  x="400" y="344" width="150" height="44"/>
    <text x="475" y="372" class="mono" text-anchor="middle" font-weight="700" fill="#3576C0">B = 200</text>

    <line x1="566" y1="314" x2="612" y2="314" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>
    <rect x="625" y="270" width="255" height="88" fill="#F6F5F3" stroke="#5E5850" stroke-width="1.3" rx="14"/>
    <text x="752" y="305" class="text" text-anchor="middle" font-weight="700">3D-тензор</text>
    <text x="752" y="335" class="mono" text-anchor="middle">(H × W × C)</text>

    <text x="480" y="500" class="small" text-anchor="middle">Вся картинка — сетка таких пикселей: высота × ширина × 3 канала</text>
  </g>

  <g data-key="step4" data-only="1">
    <rect class="box-blue" x="120" y="270" width="160" height="80"/>
    <text x="200" y="318" text-anchor="middle" font-size="24" font-weight="700" fill="#3576C0">«кот»</text>

    <line x1="296" y1="310" x2="418" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#tsArrow)"/>

    <rect class="box-green" x="435" y="270" width="445" height="80"/>
    <text x="657" y="318" class="mono" text-anchor="middle" font-weight="700" fill="#73B222">[0.21, -0.45, 0.78, …]</text>

    <text x="480" y="420" class="small" text-anchor="middle">Числа не задаются вручную — модель <tspan font-weight="700">выстраивает</tspan> их так,</text>
    <text x="480" y="446" class="small" text-anchor="middle">чтобы близкие по смыслу слова получали близкие векторы</text>
    <text x="480" y="510" class="small" text-anchor="middle">Вектор формы <tspan font-weight="700">(d,)</tspan> — обычно 50–1000 чисел</text>
  </g>

  <g data-key="step5" data-only="1">
    <rect class="box-blue" x="60" y="180" width="190" height="56"/>
    <text x="80" y="215" class="lbl" font-weight="700">Таблица</text>
    <text x="230" y="215" class="mono" text-anchor="end" fill="#5E5850">(m,)</text>

    <rect class="box-blue" x="60" y="250" width="190" height="56"/>
    <text x="80" y="285" class="lbl" font-weight="700">Картинка</text>
    <text x="230" y="285" class="mono" text-anchor="end" fill="#5E5850">(H×W×C)</text>

    <rect class="box-blue" x="60" y="320" width="190" height="56"/>
    <text x="80" y="355" class="lbl" font-weight="700">Текст</text>
    <text x="230" y="355" class="mono" text-anchor="end" fill="#5E5850">(d,)</text>

    <rect class="box-blue" x="60" y="390" width="190" height="56"/>
    <text x="80" y="425" class="lbl" font-weight="700">Аудио</text>
    <text x="230" y="425" class="mono" text-anchor="end" fill="#5E5850">(t,)</text>

    <line x1="250" y1="208" x2="452" y2="300" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>
    <line x1="250" y1="278" x2="452" y2="305" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>
    <line x1="250" y1="348" x2="452" y2="315" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>
    <line x1="250" y1="418" x2="452" y2="320" stroke="#5E5850" stroke-width="2" marker-end="url(#tsArrow)"/>

    <rect class="box-green" x="460" y="270" width="210" height="80"/>
    <text x="565" y="305" class="text" text-anchor="middle" font-weight="800" fill="#73B222">тензор</text>
    <text x="565" y="332" class="small" text-anchor="middle">просто числа</text>

    <line x1="676" y1="310" x2="742" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#tsArrow)"/>

    <rect class="box-dark" x="750" y="270" width="150" height="80"/>
    <text x="825" y="316" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>

    <text x="480" y="525" class="text" text-anchor="middle" font-weight="700">Любой вход — это тензор чисел фиксированной формы</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · только числа</div>
      <h4>Модель понимает только числа</h4>
      <p>Картинка, текст, таблица — для модели это не «образы», а наборы чисел. Внутри коробки все они должны превратиться в числа. Дальше посмотрим, как именно это происходит с каждым типом данных.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · таблица</div>
      <h4>Таблица → вектор чисел</h4>
      <p>Одна строка таблицы — это список чисел в фиксированном порядке, вектор формы (m,). Порядок важен: 2-я позиция всегда «комнаты», 3-я всегда «этаж».</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · картинка</div>
      <h4>Картинка → тензор чисел</h4>
      <p>Каждый пиксель — это числа интенсивности по каналам R, G, B. Вся картинка — сетка таких пикселей: высота × ширина × 3 канала, то есть 3D-тензор.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · текст</div>
      <h4>Текст → вектор-эмбеддинг</h4>
      <p>Слово превращается в короткий вектор вещественных чисел формы (d,), обычно 50–1000 значений. Числа не задаются вручную — модель выстраивает их так, чтобы близкие по смыслу слова получали близкие векторы.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · общий знаменатель</div>
      <h4>Любой вход — это тензор чисел</h4>
      <p>Что бы ни было на входе — таблица, картинка, текст или аудио, — в коробку модели заходит один и тот же объект: тензор чисел фиксированной формы. Дальше модели неважно, откуда эти числа взялись.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

## 4. Что внутри: коробка «что-то делает»

Здесь мы держим обещание и **не открываем коробку**. Скажем лишь самое необходимое:

внутри сидит функция `f` с настраиваемыми параметрами. Эти параметры **подбираются по данным** — это и есть обучение. После обучения коробка фиксируется: подаём ей вход `x` → получаем предсказание `ŷ = f(x)`.

Для нашего взгляда снаружи важно ровно одно: коробка **превращает вход определённой формы в выход определённого типа**. Каким именно образом — разберём в следующей статье на примере регрессии, где по шагам соберём весь пайплайн обучения.

## 5. Что на выходе: тип выхода определяет задачу

Теперь откроем вторую сторону коробки. И тут есть простое, но очень важное правило:

> **Сначала смотрим на выход.** Именно он диктует, какую модель брать, какую функцию потерь оптимизировать и какими метриками мерить качество.

### 5.1. Главный водораздел: дискретный или непрерывный выход

Все исходы можно разделить на два больших класса.

- **Дискретный выход** — конечный, «пересчитываемый» набор значений. Метафора: бросок кубика (только 1–6, значения 3.5 не бывает). Если выход — это **одна метка из заранее известного списка**, то задача называется **классификацией**. Примеры: письмо → спам / не спам; фото → цифра 0–9; лицо → «это Алиса».
- **Непрерывный выход** — значение из бесконечного диапазона, которое можно сколь угодно дробить. Метафора: рост человека (172.4 см, а между 172 и 173 — бесконечно много значений). Если выход — это **произвольное число**, задача называется **регрессией**. Примеры: дом → цена; погода → температура; фото → возраст.

<div class="stage" id="stageOutputTypes" tabindex="0">
  <div class="stage-figure">
<svg id="mlOutputTypes" viewBox="0 130 960 480" role="img" aria-label="Дискретные и непрерывные выходы ML-модели">
  <style>
    #mlOutputTypes { font-family: Helvetica, Arial, sans-serif; }
    #mlOutputTypes .text { font-size: 16px; fill: #111111; }
    #mlOutputTypes .small { font-size: 13px; fill: #5E5850; }
    #mlOutputTypes .lbl { font-size: 15px; fill: #111111; }
    #mlOutputTypes .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    #mlOutputTypes .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    #mlOutputTypes .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    #mlOutputTypes .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    #mlOutputTypes .box-gray   { fill: #F6F5F3; stroke: #5E5850; stroke-width: 1.3; rx: 14; }
  </style>
  <defs>
    <marker id="mlArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="step1" data-only="1">
    <rect class="box-blue" x="60" y="250" width="200" height="120"/>
    <text x="160" y="298" class="text" text-anchor="middle" font-weight="700">Вход</text>
    <text x="160" y="326" class="small" text-anchor="middle">фото, текст, числа…</text>

    <line x1="266" y1="310" x2="372" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>

    <rect class="box-yellow" x="380" y="250" width="200" height="120"/>
    <text x="480" y="298" class="text" text-anchor="middle" font-weight="700">Модель ML</text>
    <text x="480" y="326" class="small" text-anchor="middle">обученная функция</text>

    <line x1="586" y1="310" x2="692" y2="310" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>

    <rect class="box-green" x="700" y="250" width="200" height="120"/>
    <text x="800" y="328" text-anchor="middle" font-size="56" font-weight="800" fill="#73B222">?</text>

    <text x="480" y="450" class="text" text-anchor="middle" font-weight="700">Главный вопрос: какие значения может принимать выход?</text>
    <text x="480" y="480" class="small" text-anchor="middle">Ответ делит все задачи на два больших класса</text>
  </g>

  <g data-key="step2" data-only="1">
    <text x="140" y="165" class="lbl">Возможные исходы броска шестигранного кубика:</text>

    <g>
      <rect x="220" y="205" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
      <circle cx="287.5" cy="250" r="10" fill="#111111"/>
      <text x="287.5" y="322" class="small" text-anchor="middle" font-weight="700">сторона 1</text>

      <rect x="412" y="205" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
      <circle cx="442" cy="267" r="10" fill="#111111"/>
      <circle cx="517" cy="223" r="10" fill="#111111"/>
      <text x="479.5" y="322" class="small" text-anchor="middle" font-weight="700">сторона 2</text>

      <rect x="604" y="205" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
      <circle cx="634" cy="272" r="10" fill="#111111"/>
      <circle cx="671.5" cy="250" r="10" fill="#111111"/>
      <circle cx="709" cy="228" r="10" fill="#111111"/>
      <text x="671.5" y="322" class="small" text-anchor="middle" font-weight="700">сторона 3</text>

      <rect x="220" y="350" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
      <circle cx="250" cy="372" r="10" fill="#111111"/>
      <circle cx="325" cy="372" r="10" fill="#111111"/>
      <circle cx="250" cy="418" r="10" fill="#111111"/>
      <circle cx="325" cy="418" r="10" fill="#111111"/>
      <text x="287.5" y="467" class="small" text-anchor="middle" font-weight="700">сторона 4</text>

      <rect x="412" y="350" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
      <circle cx="442" cy="372" r="10" fill="#111111"/>
      <circle cx="517" cy="372" r="10" fill="#111111"/>
      <circle cx="479.5" cy="395" r="10" fill="#111111"/>
      <circle cx="442" cy="418" r="10" fill="#111111"/>
      <circle cx="517" cy="418" r="10" fill="#111111"/>
      <text x="479.5" y="467" class="small" text-anchor="middle" font-weight="700">сторона 5</text>

      <rect x="604" y="350" width="135" height="90" rx="14" fill="#F6F5F3" stroke="#DADADA" stroke-width="1.5"/>
      <circle cx="634" cy="372" r="10" fill="#111111"/>
      <circle cx="709" cy="372" r="10" fill="#111111"/>
      <circle cx="634" cy="395" r="10" fill="#111111"/>
      <circle cx="709" cy="395" r="10" fill="#111111"/>
      <circle cx="634" cy="418" r="10" fill="#111111"/>
      <circle cx="709" cy="418" r="10" fill="#111111"/>
      <text x="671.5" y="467" class="small" text-anchor="middle" font-weight="700">сторона 6</text>
    </g>

    <rect class="box-red" x="330" y="492" width="300" height="70"/>
    <text x="480" y="522" text-anchor="middle" font-size="17" font-weight="800" fill="#C30B0A">3.5 — невозможно</text>
    <text x="480" y="545" text-anchor="middle" class="small" fill="#C30B0A">на кубике нет стороны «три с половиной»</text>

    <text x="480" y="585" class="small" text-anchor="middle">Можно пересчитать все варианты: закрытый список из 6 исходов — <tspan fill="#3576C0" font-weight="700">дискретные значения</tspan></text>
  </g>

  <g data-key="step3" data-only="1">
    <text x="110" y="160" class="lbl">Возможный рост человека (см):</text>

    <rect x="115" y="240" width="730" height="28" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5" rx="6"/>

    <g stroke="#73B222" stroke-width="2">
      <line x1="115" y1="268" x2="115" y2="288"/><line x1="261" y1="268" x2="261" y2="288"/>
      <line x1="407" y1="268" x2="407" y2="288"/><line x1="553" y1="268" x2="553" y2="288"/>
      <line x1="699" y1="268" x2="699" y2="288"/><line x1="845" y1="268" x2="845" y2="288"/>
    </g>
    <g class="small" text-anchor="middle">
      <text x="115" y="310">150 см</text><text x="261" y="310">160 см</text>
      <text x="407" y="310">170 см</text><text x="553" y="310">180 см</text>
      <text x="699" y="310">190 см</text><text x="845" y="310">200 см</text>
    </g>

    <polygon points="443,207 432,229 454,229" fill="#C30B0A"/>
    <line x1="443" y1="229" x2="443" y2="268" stroke="#C30B0A" stroke-width="2.5"/>
    <text x="443" y="190" text-anchor="middle" font-size="18" font-weight="800" fill="#C30B0A">172.43856… см</text>

    <text x="480" y="360" class="lbl" text-anchor="middle" font-weight="700">Увеличим маленький участок между 172 и 173 см</text>
    <line x1="360" y1="384" x2="600" y2="384" stroke="#5E5850" stroke-width="1.6" stroke-dasharray="5 5"/>
    <line x1="443" y1="268" x2="360" y2="384" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="5 5"/>
    <line x1="458" y1="268" x2="600" y2="384" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="5 5"/>

    <rect x="300" y="405" width="360" height="24" fill="#F0FAF0" stroke="#73B222" stroke-width="1.5" rx="6"/>
    <g stroke="#73B222" stroke-width="1.6">
      <line x1="300" y1="429" x2="300" y2="448"/>
      <line x1="336" y1="429" x2="336" y2="440"/>
      <line x1="372" y1="429" x2="372" y2="440"/>
      <line x1="408" y1="429" x2="408" y2="440"/>
      <line x1="444" y1="429" x2="444" y2="440"/>
      <line x1="480" y1="429" x2="480" y2="448"/>
      <line x1="516" y1="429" x2="516" y2="440"/>
      <line x1="552" y1="429" x2="552" y2="440"/>
      <line x1="588" y1="429" x2="588" y2="440"/>
      <line x1="624" y1="429" x2="624" y2="440"/>
      <line x1="660" y1="429" x2="660" y2="448"/>
    </g>
    <g class="small" text-anchor="middle">
      <text x="300" y="470">172.0 см</text>
      <text x="480" y="470">172.5 см</text>
      <text x="660" y="470">173.0 см</text>
      <text x="300" y="492">1720 мм</text>
      <text x="480" y="492">1725 мм</text>
      <text x="660" y="492">1730 мм</text>
    </g>

    <polygon points="458,382 450,398 466,398" fill="#C30B0A"/>
    <line x1="458" y1="398" x2="458" y2="429" stroke="#C30B0A" stroke-width="2"/>
    <text x="458" y="525" text-anchor="middle" font-size="15" font-weight="800" fill="#C30B0A">172.43856 см = 1724.3856 мм</text>

    <text x="480" y="560" class="small" text-anchor="middle">Можно записать грубо: 172 см, точнее: 1724 мм, ещё точнее: 172.43856 см.</text>
    <text x="480" y="584" class="small" text-anchor="middle">Между 172 и 173 см есть миллиметры и ещё более мелкие значения — <tspan fill="#73B222" font-weight="700">непрерывные</tspan></text>
  </g>

  <g data-key="step4" data-only="1">
    <rect class="box-yellow" x="90" y="280" width="170" height="100"/>
    <text x="175" y="325" class="text" text-anchor="middle" font-weight="700">Модель</text>
    <text x="175" y="350" class="small" text-anchor="middle">вход → класс</text>

    <line x1="266" y1="330" x2="382" y2="330" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>

    <rect class="box-blue" x="430" y="240" width="280" height="50"/>
    <text x="455" y="271" class="text">кошка</text>

    <rect class="box-green" x="430" y="305" width="280" height="50"/>
    <text x="455" y="336" class="text" font-weight="700" fill="#73B222">собака  ←</text>

    <rect class="box-blue" x="430" y="370" width="280" height="50"/>
    <text x="455" y="401" class="text">птица</text>

    <text x="500" y="500" class="small" text-anchor="middle">Выход — одна из заранее известных меток. Это и есть <tspan fill="#3576C0" font-weight="700">классификация</tspan></text>
  </g>

  <g data-key="step5" data-only="1">
    <line x1="200" y1="470" x2="840" y2="470" stroke="#5E5850" stroke-width="2"/>
    <line x1="200" y1="470" x2="200" y2="180" stroke="#5E5850" stroke-width="2"/>
    <text x="520" y="510" class="small" text-anchor="middle">площадь дома, м²</text>
    <text x="150" y="330" class="small" text-anchor="middle" transform="rotate(-90 150 330)">цена, $</text>

    <line x1="220" y1="440" x2="820" y2="220" stroke="#C29E08" stroke-width="3"/>

    <g fill="#3576C0">
      <circle cx="270" cy="410" r="7"/><circle cx="360" cy="390" r="7"/>
      <circle cx="440" cy="350" r="7"/><circle cx="540" cy="330" r="7"/>
      <circle cx="640" cy="290" r="7"/><circle cx="740" cy="250" r="7"/>
    </g>

    <circle cx="600" cy="306" r="9" fill="#73B222"/>
    <line x1="600" y1="306" x2="600" y2="470" stroke="#73B222" stroke-width="1.5" stroke-dasharray="4 4"/>
    <text x="612" y="300" font-size="15" font-weight="700" fill="#73B222">$215 000</text>

    <text x="500" y="555" class="small" text-anchor="middle">Выход — произвольное число (упрощённый фрагмент Ames Housing). Это <tspan fill="#73B222" font-weight="700">регрессия</tspan></text>
  </g>

  <g data-key="step6" data-only="1">
    <rect class="box-gray" x="80" y="170" width="300" height="62"/>
    <text x="100" y="208" class="lbl">Распознавание лица</text>
    <line x1="388" y1="201" x2="470" y2="201" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
    <rect class="box-blue" x="478" y="170" width="400" height="62"/>
    <text x="498" y="208" class="lbl" fill="#3576C0" font-weight="700">«это Алиса» — один из N людей</text>

    <rect class="box-gray" x="80" y="258" width="300" height="62"/>
    <text x="100" y="296" class="lbl">Генерация токена</text>
    <line x1="388" y1="289" x2="470" y2="289" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
    <rect class="box-blue" x="478" y="258" width="400" height="62"/>
    <text x="498" y="296" class="lbl" fill="#3576C0" font-weight="700">следующее слово из словаря</text>

    <rect class="box-gray" x="80" y="346" width="300" height="62"/>
    <text x="100" y="384" class="lbl">Письмо</text>
    <line x1="388" y1="377" x2="470" y2="377" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
    <rect class="box-blue" x="478" y="346" width="400" height="62"/>
    <text x="498" y="384" class="lbl" fill="#3576C0" font-weight="700">спам / не спам</text>

    <rect class="box-gray" x="80" y="434" width="300" height="62"/>
    <text x="100" y="472" class="lbl">Картинка MNIST</text>
    <line x1="388" y1="465" x2="470" y2="465" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
    <rect class="box-blue" x="478" y="434" width="400" height="62"/>
    <text x="498" y="472" class="lbl" fill="#3576C0" font-weight="700">цифра 0–9</text>

    <text x="480" y="558" class="small" text-anchor="middle">Внутри модель считает вероятности, но итог — один дискретный класс</text>
  </g>

  <g data-key="step7" data-only="1">
    <rect class="box-gray" x="80" y="170" width="300" height="62"/>
    <text x="100" y="208" class="lbl">Дом (Ames Housing)</text>
    <line x1="388" y1="201" x2="470" y2="201" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
    <rect class="box-green" x="478" y="170" width="400" height="62"/>
    <text x="498" y="208" class="lbl" fill="#73B222" font-weight="700">цена: $215 000</text>

    <rect class="box-gray" x="80" y="258" width="300" height="62"/>
    <text x="100" y="296" class="lbl">Погода на завтра</text>
    <line x1="388" y1="289" x2="470" y2="289" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
    <rect class="box-green" x="478" y="258" width="400" height="62"/>
    <text x="498" y="296" class="lbl" fill="#73B222" font-weight="700">температура: 23.7 °C</text>

    <rect class="box-gray" x="80" y="346" width="300" height="62"/>
    <text x="100" y="384" class="lbl">Фото человека</text>
    <line x1="388" y1="377" x2="470" y2="377" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
    <rect class="box-green" x="478" y="346" width="400" height="62"/>
    <text x="498" y="384" class="lbl" fill="#73B222" font-weight="700">возраст: 31.4 года</text>

    <rect class="box-gray" x="80" y="434" width="300" height="62"/>
    <text x="100" y="472" class="lbl">Замер пациента</text>
    <line x1="388" y1="465" x2="470" y2="465" stroke="#5E5850" stroke-width="2.5" marker-end="url(#mlArrow)"/>
    <rect class="box-green" x="478" y="434" width="400" height="62"/>
    <text x="498" y="472" class="lbl" fill="#73B222" font-weight="700">рост: 172.4 см</text>

    <text x="480" y="558" class="small" text-anchor="middle">Выход можно бесконечно дробить — это число, а не метка</text>
  </g>

  <g data-key="step8" data-only="1">
    <rect class="box-blue" x="70" y="150" width="380" height="360"/>
    <text x="260" y="195" class="text" text-anchor="middle" font-weight="800" fill="#3576C0">Дискретный выход</text>
    <text x="260" y="222" class="lbl" text-anchor="middle" font-weight="700">→ классификация</text>
    <g class="small" fill="#111111">
      <text x="100" y="268">• конечный набор значений</text>
      <text x="100" y="298">• метафора: кубик 1–6</text>
      <text x="100" y="328">• лицо → «это Алиса»</text>
      <text x="100" y="358">• токен → следующее слово</text>
      <text x="100" y="388">• письмо → спам / не спам</text>
      <text x="100" y="418">• картинка → цифра 0–9</text>
    </g>

    <rect class="box-green" x="510" y="150" width="380" height="360"/>
    <text x="700" y="195" class="text" text-anchor="middle" font-weight="800" fill="#73B222">Непрерывный выход</text>
    <text x="700" y="222" class="lbl" text-anchor="middle" font-weight="700">→ регрессия</text>
    <g class="small" fill="#111111">
      <text x="540" y="268">• бесконечный диапазон</text>
      <text x="540" y="298">• метафора: рост человека</text>
      <text x="540" y="328">• дом → цена $215 000</text>
      <text x="540" y="358">• погода → 23.7 °C</text>
      <text x="540" y="388">• фото → возраст 31.4 года</text>
      <text x="540" y="418">• замер → рост 172.4 см</text>
    </g>

    <text x="480" y="555" class="text" text-anchor="middle" font-weight="700">Сначала смотрим на выход — он диктует выбор модели и метрики</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · что на выходе</div>
      <h4>Что вообще на выходе модели?</h4>
      <p>Модель берёт вход и возвращает выход — вопрос в том, какие значения он может принимать. Ответ на этот вопрос делит все задачи ML на два больших класса.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · дискретные значения</div>
      <h4>Дискретные значения — стороны кубика</h4>
      <p>У кубика есть только 6 сторон: 1, 2, 3, 4, 5 или 6. Другого исхода быть не может — 3.5 невозможно. Закрытый список из конечного числа исходов — это и есть дискретные значения.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · непрерывные значения</div>
      <h4>Непрерывные значения — рост человека</h4>
      <p>Рост можно описать в сантиметрах, миллиметрах и ещё точнее — шкала не заканчивается отдельными точками. Между 172 и 173 см есть миллиметры и ещё более мелкие значения — это непрерывные величины.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · классификация</div>
      <h4>Дискретный выход — классификация</h4>
      <p>Модель выбирает один вариант из конечного списка классов — здесь «собака» из трёх возможных меток. Выход — одна из заранее известных меток, и это классификация.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · регрессия</div>
      <h4>Непрерывный выход — регрессия</h4>
      <p>Модель предсказывает число на непрерывной шкале — здесь цену дома по его площади. Выход — произвольное число, и это регрессия.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Шаг 6 · примеры классификации</div>
      <h4>Примеры классификации (дискретный выход)</h4>
      <p>Распознавание лица, генерация следующего токена, фильтрация спама, распознавание цифры — везде ответ один: метка из конечного набора. Внутри модель считает вероятности, но итог — один дискретный класс.</p>
    </div>
    <div class="step-panel" data-on="step7" data-focus="step7">
      <div class="step-kicker">Шаг 7 · примеры регрессии</div>
      <h4>Примеры регрессии (непрерывный выход)</h4>
      <p>Цена дома, температура завтра, возраст по фото, рост пациента — везде ответ число на непрерывной шкале. Такой выход можно бесконечно дробить — это число, а не метка.</p>
    </div>
    <div class="step-panel" data-on="step8" data-focus="step8">
      <div class="step-kicker">Шаг 8 · итог</div>
      <h4>Тип выхода определяет тип задачи</h4>
      <p>Дискретно — классификация, непрерывно — регрессия. Это базовое деление стоит держать в голове с самого начала: сначала смотрим на выход, а он уже диктует выбор модели и метрики качества.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

### 5.2. На самом деле выходов больше, чем «число или метка»

Деление на регрессию и классификацию — это фундамент, но реальные модели выдают и более богатые выходы. Полезно знать весь «зоопарк», чтобы понимать, что коробка может отдавать почти что угодно:

- **Одно число** (скалярная регрессия) — цена, температура.
- **Одна метка из K классов** (классификация) — кошка/собака/птица.
- **Несколько меток сразу** (multi-label) — у фото могут быть теги «пляж», «закат», «люди».
- **Вероятности / распределение** — не просто «кошка», а «кошка 0.8, собака 0.15, …».
- **Последовательность** — перевод, генерация текста: на выходе цепочка токенов.
- **Структурированный выход** — рамки объектов на фото (детекция), маска по пикселям (сегментация), или даже **целая картинка** (генеративные модели).
- **Вектор-эмбеддинг** — иногда нужен сам по себе (поиск похожих, рекомендации).

Большинство из этих случаев под капотом сводится к тем же двум базовым кирпичикам («предскажи число» и «предскажи класс»), просто применённым много раз или к структуре. Но на уровне постановки задачи их полезно различать.
<div class="stage" id="stageOutputZoo" tabindex="0">
  <div class="stage-figure">
<svg id="mlOutputZoo" viewBox="0 130 960 450" role="img" aria-label="Разные типы выхода модели">
  <style>
    #mlOutputZoo { font-family: Helvetica, Arial, sans-serif; }
    #mlOutputZoo .text { font-size: 16px; fill: #111111; }
    #mlOutputZoo .small { font-size: 13px; fill: #5E5850; }
    #mlOutputZoo .lbl { font-size: 15px; fill: #111111; }
    #mlOutputZoo .mono { font-size: 15px; fill: #111111; font-family: "Courier New", monospace; }
    #mlOutputZoo .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    #mlOutputZoo .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    #mlOutputZoo .box-gray   { fill: #F6F5F3; stroke: #5E5850; stroke-width: 1.3; rx: 14; }
    #mlOutputZoo .box-dark   { fill: #1b1d26; rx: 14; }
  </style>
  <defs>
    <marker id="ozArrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
      <path d="M0,0 L8,3.5 L0,7 Z" fill="#5E5850"/>
    </marker>
  </defs>

  <g data-key="step1" data-only="1">
    <rect class="box-dark" x="120" y="270" width="180" height="110"/>
    <text x="210" y="328" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>
    <text x="210" y="354" text-anchor="middle" font-size="12" fill="#9a9aa4">f( вход )</text>
    <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>
    <rect class="box-gray" x="460" y="270" width="320" height="110"/>
    <text x="620" y="335" text-anchor="middle" font-size="40" font-weight="800" fill="#5E5850">?</text>

    <text x="480" y="460" class="text" text-anchor="middle" font-weight="700">Дальше — «зоопарк» выходов, которые встречаются на практике</text>
    <text x="480" y="492" class="small" text-anchor="middle">от одного числа до целой картинки</text>
  </g>

  <g data-key="step2" data-only="1">
    <rect class="box-dark" x="120" y="270" width="180" height="110"/>
    <text x="210" y="328" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>
    <text x="210" y="354" text-anchor="middle" font-size="12" fill="#9a9aa4">f( вход )</text>
    <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>
    <rect class="box-green" x="460" y="270" width="360" height="110"/>
    <text x="640" y="320" text-anchor="middle" font-size="32" font-weight="800" fill="#73B222">23.7 °C</text>
    <text x="640" y="352" class="small" text-anchor="middle">температура на завтра</text>

    <text x="480" y="470" class="small" text-anchor="middle">Также: цена дома, возраст по фото, длительность поездки</text>
  </g>

  <g data-key="step3" data-only="1">
    <rect class="box-dark" x="120" y="270" width="180" height="110"/>
    <text x="210" y="328" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>
    <text x="210" y="354" text-anchor="middle" font-size="12" fill="#9a9aa4">f( вход )</text>
    <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>
    <rect class="box-blue"  x="460" y="250" width="320" height="46"/>
    <text x="486" y="279" class="text">спам</text>
    <rect class="box-green" x="460" y="304" width="320" height="46"/>
    <text x="486" y="333" class="text" font-weight="700" fill="#73B222">не спам  ←</text>

    <text x="480" y="470" class="small" text-anchor="middle">Также: кошка/собака/птица, цифра 0–9, «это Алиса»</text>
  </g>

  <g data-key="step4" data-only="1">
    <rect class="box-dark" x="120" y="270" width="180" height="110"/>
    <text x="210" y="328" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>
    <text x="210" y="354" text-anchor="middle" font-size="12" fill="#9a9aa4">f( вход )</text>
    <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>

    <rect class="box-green" x="460" y="240" width="150" height="46"/>
    <text x="486" y="269" class="text" font-weight="700" fill="#73B222">пляж  ←</text>
    <rect class="box-green" x="460" y="296" width="150" height="46"/>
    <text x="486" y="325" class="text" font-weight="700" fill="#73B222">закат  ←</text>
    <rect class="box-blue"  x="460" y="352" width="150" height="46"/>
    <text x="486" y="381" class="text">снег</text>

    <rect class="box-green" x="630" y="240" width="150" height="46"/>
    <text x="656" y="269" class="text" font-weight="700" fill="#73B222">люди  ←</text>
    <rect class="box-blue"  x="630" y="296" width="150" height="46"/>
    <text x="656" y="325" class="text">город</text>
    <rect class="box-blue"  x="630" y="352" width="150" height="46"/>
    <text x="656" y="381" class="text">ночь</text>

    <text x="480" y="470" class="small" text-anchor="middle">Теги фотографии: помечаем все подходящие, а не одну метку</text>
  </g>

  <g data-key="step5" data-only="1">
    <rect class="box-dark" x="120" y="270" width="180" height="110"/>
    <text x="210" y="328" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>
    <text x="210" y="354" text-anchor="middle" font-size="12" fill="#9a9aa4">f( вход )</text>
    <line x1="306" y1="325" x2="452" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>

    <g>
      <text x="470" y="262" class="lbl">кошка</text>
      <rect x="560" y="248" width="256" height="22" fill="#73B222"/>
      <text x="828" y="265" class="small" font-weight="700" fill="#73B222">0.80</text>

      <text x="470" y="310" class="lbl">собака</text>
      <rect x="560" y="296" width="48" height="22" fill="#3576C0"/>
      <text x="620" y="313" class="small" fill="#3576C0">0.15</text>

      <text x="470" y="358" class="lbl">птица</text>
      <rect x="560" y="344" width="16" height="22" fill="#3576C0"/>
      <text x="588" y="361" class="small" fill="#3576C0">0.05</text>
    </g>

    <text x="480" y="470" class="small" text-anchor="middle">Сумма = 1. Если нужен один класс — берём максимум (кошка)</text>
  </g>

  <g data-key="step6" data-only="1">
    <rect class="box-blue" x="80" y="290" width="200" height="70"/>
    <text x="180" y="332" text-anchor="middle" font-size="18" font-weight="700" fill="#3576C0">«I love cats»</text>

    <line x1="296" y1="325" x2="372" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>
    <rect class="box-dark" x="380" y="270" width="180" height="110"/>
    <text x="470" y="328" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>
    <text x="470" y="354" text-anchor="middle" font-size="12" fill="#9a9aa4">f( вход )</text>
    <line x1="566" y1="325" x2="604" y2="325" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>

    <g>
      <rect class="box-green" x="610" y="250" width="90" height="46"/>
      <text x="655" y="279" text-anchor="middle" class="text" fill="#73B222">Я</text>
      <rect class="box-green" x="708" y="250" width="120" height="46"/>
      <text x="768" y="279" text-anchor="middle" class="text" fill="#73B222">люблю</text>
      <rect class="box-green" x="610" y="306" width="120" height="46"/>
      <text x="670" y="335" text-anchor="middle" class="text" fill="#73B222">котов</text>
    </g>

    <text x="480" y="470" class="small" text-anchor="middle">Перевод, ответ чат-бота, описание картинки — выход переменной длины</text>
  </g>

  <g data-key="step7" data-only="1">
    <rect class="box-dark" x="90" y="280" width="180" height="110"/>
    <text x="180" y="338" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">Модель</text>
    <text x="180" y="364" text-anchor="middle" font-size="12" fill="#9a9aa4">f( вход )</text>
    <line x1="276" y1="335" x2="352" y2="335" stroke="#5E5850" stroke-width="2.5" marker-end="url(#ozArrow)"/>

    <rect x="370" y="250" width="170" height="170" class="box-gray"/>
    <rect x="410" y="300" width="90" height="80" fill="none" stroke="#C30B0A" stroke-width="3"/>
    <rect x="408" y="284" width="86" height="18" fill="#C30B0A"/>
    <text x="451" y="297" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">кошка 0.97</text>
    <text x="455" y="440" class="small" text-anchor="middle">детекция (рамка)</text>

    <rect x="600" y="250" width="170" height="170" class="box-gray"/>
    <path d="M650 380 q10 -70 55 -75 q40 0 35 75 z" fill="#73B222" opacity="0.55"/>
    <text x="685" y="440" class="small" text-anchor="middle">сегментация (маска)</text>

    <text x="480" y="500" class="small" text-anchor="middle">Сюда же — генерация изображений: на выходе целый тензор-картинка</text>
  </g>

  <g data-key="step8" data-only="1">
    <rect class="box-blue" x="70" y="150" width="380" height="360"/>
    <text x="260" y="195" class="text" text-anchor="middle" font-weight="800" fill="#3576C0">Два базовых кирпичика</text>
    <g class="small" fill="#111111">
      <text x="100" y="250">• число → регрессия</text>
      <text x="100" y="288">• класс → классификация</text>
    </g>
    <text x="260" y="350" class="lbl" text-anchor="middle" font-weight="700">из них собирают</text>
    <text x="260" y="382" class="small" text-anchor="middle">сложные выходы ниже →</text>

    <rect class="box-green" x="510" y="150" width="380" height="360"/>
    <text x="700" y="195" class="text" text-anchor="middle" font-weight="800" fill="#73B222">Богатые выходы</text>
    <g class="small" fill="#111111">
      <text x="540" y="245">• набор меток (multi-label)</text>
      <text x="540" y="283">• распределение вероятностей</text>
      <text x="540" y="321">• последовательность токенов</text>
      <text x="540" y="359">• рамки и маски объектов</text>
      <text x="540" y="397">• целое изображение</text>
      <text x="540" y="435">• вектор-эмбеддинг</text>
    </g>

    <text x="480" y="555" class="text" text-anchor="middle" font-weight="700">Тип выхода определяет последний слой, функцию потерь и метрику</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 1 · не только число или метка</div>
      <h4>Выход бывает не только числом или меткой</h4>
      <p>Базовое деление — регрессия и классификация. Но коробка умеет больше: дальше — «зоопарк» выходов, которые встречаются на практике, от одного числа до целой картинки.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 2 · одно число</div>
      <h4>Одно число — регрессия</h4>
      <p>Самый простой выход: единственное значение на непрерывной шкале, например температура на завтра. Тот же принцип — цена дома, возраст по фото, длительность поездки.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 3 · одна метка</div>
      <h4>Одна метка — классификация</h4>
      <p>Выход — один класс из конечного, заранее заданного списка, например «не спам». Тот же принцип — кошка/собака/птица, цифра 0–9, «это Алиса».</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 4 · multi-label</div>
      <h4>Несколько меток сразу — multi-label</h4>
      <p>У одного объекта может быть несколько верных меток одновременно. Теги фотографии — «пляж», «закат», «люди»: помечаем все подходящие метки, а не выбираем одну.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 5 · распределение</div>
      <h4>Распределение вероятностей</h4>
      <p>Часто модель отдаёт не один ответ, а уверенность по каждому варианту — кошка 0.80, собака 0.15, птица 0.05. Сумма всегда равна 1. Если нужен один класс — берём максимум.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Шаг 6 · последовательность</div>
      <h4>Последовательность — генерация и перевод</h4>
      <p>Выход — это цепочка токенов, выдаваемая шаг за шагом. Перевод, ответ чат-бота, описание картинки — везде выход переменной длины, а не фиксированного размера.</p>
    </div>
    <div class="step-panel" data-on="step7" data-focus="step7">
      <div class="step-kicker">Шаг 7 · структурный выход</div>
      <h4>Структурный выход: рамки, маски, картинки</h4>
      <p>Выход может иметь форму: координаты объекта (детекция), маска по пикселям (сегментация) или даже целое изображение — на выходе целый тензор-картинка, как в генеративных моделях.</p>
    </div>
    <div class="step-panel" data-on="step8" data-focus="step8">
      <div class="step-kicker">Шаг 8 · итог</div>
      <h4>Коробка отдаёт почти что угодно</h4>
      <p>Но почти всё сводится к двум кирпичикам: «предскажи число» и «предскажи класс», применённым много раз или к структуре. Тип выхода определяет последний слой модели, функцию потерь и метрику.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>

## 6. Главный вывод: модель выбирают по входу и выходу

Сложим обе стороны коробки вместе. Получается простое правило, которое и будет мостом к следующей статье:

> **Форма входа** подсказывает **семейство модели**, а **тип выхода** определяет **последний слой, функцию потерь и метрику**.

Грубая, но рабочая шпаргалка:

| Что на входе | Типичное семейство моделей |
| --- | --- |
| Таблица | линейные модели, деревья / градиентный бустинг, MLP |
| Изображение | свёрточные сети (CNN), визуальные трансформеры (ViT) |
| Текст | трансформеры |

| Что на выходе | Что меняется в модели |
| --- | --- |
| Число (регрессия) | один выход без активации, потери типа MSE |
| Класс (классификация) | softmax на K классов, кросс-энтропия |

Поэтому правильный порядок мыслей в любой ML-задаче такой: **сначала зафиксировать вход и выход коробки — и только потом выбирать, что положить внутрь.**

В следующей статье мы наконец **откроем коробку** и на примере **регрессии** соберём весь пайплайн обучения по шагам: данные → модель → как она учится → как проверяем качество. Там станет видно, что «магия» внутри коробки — это вполне понятный последовательный процесс.
