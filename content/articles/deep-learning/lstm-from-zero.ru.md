<style>
  .slider-stage { padding-bottom: 20px; }
  .slider-grid { display: grid; grid-template-columns: minmax(0, 1fr) 252px; gap: 20px; align-items: stretch; }
  .slider-panel { border-left: 1px solid #ECE9E0; padding: 10px 2px 10px 20px; display: flex; flex-direction: column; justify-content: center; }
  .range-label { font-size: 13px; color: #5E5850; text-transform: uppercase; letter-spacing: .06em; font-weight: 800; }
  .slider-panel input[type="range"] { width: 100%; accent-color: #3576C0; min-height: 44px; cursor: pointer; }
  .live-number { font-size: 30px; line-height: 1; font-weight: 800; margin: 8px 0 4px; color: #3576C0; }
  .live-number.small { font-size: 22px; }
  .live-caption { color: #5E5850; font-size: 14px; line-height: 1.45; margin-bottom: 6px; }
  .toggle-row { display: flex; gap: 8px; margin: 4px 0 12px; flex-wrap: wrap; }
  .toggle-row button { min-height: 40px; padding: 7px 13px; border-radius: 9px; border: 1px solid #C9C2B8; background: #fff; color: #111; font: inherit; font-size: 14px; font-weight: 750; cursor: pointer; }
  .toggle-row button[aria-pressed="true"] { color: #fff; background: #1b1d26; border-color: #1b1d26; }
  .ls-axis { stroke: #C9C2B8; stroke-width: 1.5; }
  .ls-grid { stroke: #ECE9E0; stroke-width: 1.4; }
  .ls-tick { font-size: 13px; fill: #5E5850; font-family: Helvetica, Arial, sans-serif; }
  .ls-cap { font-size: 12.5px; fill: #5E5850; letter-spacing: .04em; text-transform: uppercase; font-family: Helvetica, Arial, sans-serif; }
  .prose pre { width: 0; min-width: 100%; box-sizing: border-box; }
  .prose .lstm-table { overflow-x: auto; width: 0; min-width: 100%; margin: 1.5em 0; position: relative; }
  .prose .lstm-table table { margin: 0; }
  .prose .lstm-table td:not(:first-child) { white-space: nowrap; }
  .prose .worked-trace-note:empty { display: none; }
  .prose .worked-trace-row:has(.worked-trace-note:empty) { grid-template-columns: 84px minmax(0, 1fr); }
  .prose .math-display { width: 0; min-width: 100%; box-sizing: border-box; }
  .prose .stage, .prose .worked-example, .prose .lstm-chart, .prose .reading-contract { width: 0; min-width: 100%; box-sizing: border-box; }
  .prose .lstm-chart { margin: 22px 0; }
  .prose .lstm-chart svg { width: 100%; max-width: 680px; display: block; margin: 0 auto; }
  .prose .stage-figure .svg-math { white-space: nowrap; }
  @media (max-width: 760px) {
    .slider-grid { grid-template-columns: 1fr; }
    .slider-panel { border-left: 0; border-top: 1px solid #ECE9E0; padding: 16px 4px 2px; }
    .prose .worked-trace-row { grid-template-columns: minmax(0, 1fr); gap: 4px; }
    .prose .worked-trace-math { overflow-x: auto; overflow-y: hidden; }
  }
</style>

<p class="lead">
  LSTM (long short-term memory) — это ячейка RNN, к которой добавили второй вектор состояния, память <span class="math-inline" data-tex="c_t"></span>, и три сигмоидных
  слоя, которые называют воротами. Память меняется только поэлементно: часть старого содержимого стирается, часть нового
  дописывается. Поэтому градиент по памяти при шаге назад во времени умножается не на матрицу весов, а на значения ворот
  забывания, и сеть может научиться переносить информацию через десятки тактов.
</p>

<p>
  Статья продолжает <a href="article.html?slug=rnn-from-zero">разбор RNN с нуля</a> и устроена так же: ячейка по деталям, прямой и обратный проход
  руками на той же фразе ⟨BOS⟩ you will pass, формы тензоров и три версии кода. Веса подобраны так, что внутри LSTM лежит
  ровно та RNN: кандидат <span class="math-inline" data-tex="g_t"></span> использует матрицы <span class="math-inline" data-tex="W_{xh}, W_{hh}, b_h"></span> из той статьи, выходной слой тоже общий. Второй
  пример — задача, где ответ зависит от токена, который был 50 тактов назад: на ней RNN и LSTM обучены по-настоящему.
</p>

<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Статья про RNN</strong>
    <p>Скрытое состояние, развёртка во времени, BPTT и затухающий градиент.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>Та же фраза, H = 2, 68 чисел</strong>
    <p>И задача на память длины 50, где сравниваются обученные сети.</p>
  </div>
  <div class="contract-card">
    <span>На выходе</span>
    <strong>Forward и BPTT LSTM руками</strong>
    <p>Вы увидите, на что именно умножается градиент по памяти и почему важен сдвиг ворот забывания.</p>
  </div>
</div>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>память c и поэлементные операции</span>
  <span><i style="background:#C29E08"></i>ворота и кандидат: обучаемые слои</span>
  <span><i style="background:#73B222"></i>выход h и результат прямого хода</span>
  <span><i style="background:#C30B0A"></i>ошибка и градиент</span>
</div>

<div class="callout-blue">
  <strong>Как работать с интерактивами.</strong> Пошаговые сцены переключаются кнопками «Далее» и «Назад» или стрелками
  ← → на клавиатуре, когда сцена в фокусе: яркой остаётся та часть схемы, о которой идёт речь, а внизу схемы — формула
  этого шага с числами. Ползунки меняют одно число и сразу пересчитывают график.
</div>

## Часть 1. Где RNN перестаёт учиться

<p>
  В <a href="article.html?slug=rnn-from-zero">статье про RNN</a> мы получили рекурсию обратного прохода
  <span class="math-inline" data-tex="dh_{t-1} = \left(dh_t\odot(1-h_t^2)\right)W_{hh}^{\top}"></span>. Градиент, который ушёл на <span class="math-inline" data-tex="k"></span> тактов назад, умножился
  <span class="math-inline" data-tex="k"></span> раз на <span class="math-inline" data-tex="W_{hh}^{\top}"></span> и <span class="math-inline" data-tex="k"></span> раз на производную <span class="math-inline" data-tex="\tanh"></span>. Если такой множитель за такт меньше единицы, сигнал от
  далёкого токена затухает как геометрическая прогрессия, и веса, которые могли бы связать ответ с этим токеном, почти не
  меняются.
</p>

### Считаем руками: что остаётся от градиента за два такта

<p>
  Возьмём фразу из статьи про RNN и проследим, как градиент идёт от третьего такта к первому. Пусть на <span class="math-inline" data-tex="h_3"></span> пришёл
  градиент <span class="math-inline" data-tex="(1;\,0)"></span> — единица в первой координате. В RNN шаг назад выглядит так: умножить поэлементно на производную
  <span class="math-inline" data-tex="\tanh"></span>, то есть на <span class="math-inline" data-tex="1-h_t^2"></span>, и умножить на <span class="math-inline" data-tex="W_{hh}^{\top}"></span>. Состояния берём из той статьи:
  <span class="math-inline" data-tex="h_2 = (0{,}4371;\,0{,}4313)"></span>, <span class="math-inline" data-tex="h_3 = (-0{,}2748;\,0{,}3169)"></span>.
</p>

<div class="worked-example">
<div class="worked-label">RNN: от h₃ к h₁</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="dh_{t-1}=\left(dh_t\odot\left(1-h_t^2\right)\right)W_{hh}^{\top},\qquad W_{hh}^{\top}=\begin{bmatrix}0{,}4&amp;0{,}1\\-0{,}2&amp;0{,}5\end{bmatrix}"></div><div class="worked-trace-note">один шаг назад во времени</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">такт 3</div><div class="math-display worked-trace-math" data-tex="1-h_3^2=\left(0{,}9245;\ 0{,}8995\right),\qquad (1;\,0)\odot\left(0{,}9245;\ 0{,}8995\right)=\left(0{,}9245;\ 0{,}0000\right)"></div><div class="worked-trace-note">производная tanh на третьем такте</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">в h₂</div><div class="math-display worked-trace-math" data-tex="dh_2=\left(0{,}9245;\ 0{,}0000\right)\,W_{hh}^{\top}=\left(0{,}3698;\ 0{,}0924\right)"></div><div class="worked-trace-note">строка на матрицу: <span class="math-inline" data-tex="0{,}9245\cdot0{,}4 = 0{,}3698"></span> и <span class="math-inline" data-tex="0{,}9245\cdot0{,}1 = 0{,}0924"></span></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">такт 2</div><div class="math-display worked-trace-math" data-tex="1-h_2^2=\left(0{,}8090;\ 0{,}8140\right),\qquad dh_2\odot(1-h_2^2)=\left(0{,}2992;\ 0{,}0752\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">в h₁</div><div class="math-display worked-trace-math" data-tex="dh_1=\left(0{,}2992;\ 0{,}0752\right)\,W_{hh}^{\top}=\left(0{,}1046;\ 0{,}0675\right)"></div><div class="worked-trace-note">от единицы осталось <span class="math-inline" data-tex="0{,}1046"></span> — в 9,6 раз меньше</div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">LSTM: от c₃ к c₁ по линии памяти</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="dc_{t-1}=dc_t\odot f_t+\ldots"></div><div class="worked-trace-note">прямой путь: только ворота забывания</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">числа</div><div class="math-display worked-trace-math" data-tex="(1;\,0)\odot f_3\odot f_2=(1;\,0)\odot\left(0{,}8401;\ 0{,}7543\right)\odot\left(0{,}6650;\ 0{,}8155\right)=\left(0{,}5587;\ 0{,}0000\right)"></div><div class="worked-trace-note"><span class="math-inline" data-tex="0{,}8401\cdot0{,}6650 = 0{,}5587"></span></div></div>
</div>
<p class="worked-reading">За два такта RNN оставила 10 % градиента, линия памяти LSTM — 56 %. Разница пока небольшая. Но у RNN каждый такт умножает на матрицу и на <span class="math-inline" data-tex="1-h^2"></span>, а у LSTM — на число <span class="math-inline" data-tex="f"></span>, которое сеть может обучить до 0,99 и выше. Через 50 тактов это разница между <span class="math-inline" data-tex="10^{-14}"></span> и десятками процентов (часть 6).</p>
</div>

### Опыт: запомнить первый токен

<p>
  Чтобы увидеть, как это мешает обучению, нужна задача, где ответ зависит только от далёкого токена. Словарь из четырёх
  токенов: A, B, x, y. Последовательность длины <span class="math-inline" data-tex="T"></span> начинается с A или B, дальше идут <span class="math-inline" data-tex="T-1"></span> случайных x и y. На последнем
  такте сеть должна назвать первый токен. Угадывая наугад, она будет права в половине случаев, ошибка при этом
  <span class="math-inline" data-tex="\ln 2 = 0{,}693"></span>.
</p>

<p>
  Сети одного размера, <span class="math-inline" data-tex="H = 8"></span>: RNN и три LSTM, которые отличаются только начальным сдвигом ворот забывания: <span class="math-inline" data-tex="b_f = 1"></span>,
  <span class="math-inline" data-tex="3"></span> и <span class="math-inline" data-tex="5"></span> (зачем это, объясняет часть 6). Обучение одинаковое: Adam с шагом 0,01, батч 64, 3000 шагов,
  клиппинг градиента по норме 1. Для каждой длины пять запусков с разными начальными весами. Запуск считаем успешным, если
  на 2000 новых последовательностях точность выше 95 %; на деле там почти всегда либо 100 %, либо около 50 %.
</p>

<div class="lstm-table"><table class="shape-table">
  <tr><th>успешных запусков</th><th><span class="math-inline" data-tex="T = 10"></span></th><th><span class="math-inline" data-tex="T = 20"></span></th><th><span class="math-inline" data-tex="T = 30"></span></th><th><span class="math-inline" data-tex="T = 50"></span></th><th><span class="math-inline" data-tex="T = 100"></span></th></tr>
  <tr><td>RNN</td><td>5 из 5</td><td>5 из 5</td><td>5 из 5</td><td>0 из 5</td><td>1 из 5</td></tr>
  <tr><td>LSTM, <span class="math-inline" data-tex="b_f = 1"></span></td><td>5 из 5</td><td>5 из 5</td><td>1 из 5</td><td>0 из 5</td><td>0 из 5</td></tr>
  <tr><td>LSTM, <span class="math-inline" data-tex="b_f = 3"></span></td><td>5 из 5</td><td>5 из 5</td><td>5 из 5</td><td>5 из 5</td><td>1 из 5</td></tr>
  <tr><td>LSTM, <span class="math-inline" data-tex="b_f = 5"></span></td><td>5 из 5</td><td>5 из 5</td><td>5 из 5</td><td>5 из 5</td><td>2 из 5</td></tr>
</table></div>

<p>
  До 20 тактов задачу решают все. На 30 RNN ещё справляется, а LSTM со сдвигом 1 — только в 1 запуске из 5:
  ворота без настройки ничем не помогают. На 50 тактах RNN не учится ни в одном запуске, LSTM со сдвигами 3 и 5 — во всех
  пяти. На 100 тактах надёжно не учится никто: за 3000 шагов RNN решает задачу в 1 запуске из 5,
  LSTM со сдвигами 1, 3 и 5 — в 0, 1 и 2; за 8000 шагов RNN — в 2,
  LSTM со сдвигом 3 — в 2. Линия памяти убирает затухание градиента при инициализации, но на такой дистанции этого
  мало, и что именно мешает дальше — больше шагов, больше <span class="math-inline" data-tex="H"></span> или другие гиперпараметры, — этот опыт не показывает.
</p>

<p>
  Ниже кривые обучения на длине 50 для первого запуска. RNN весь опыт стоит на линии <span class="math-inline" data-tex="\ln 2"></span>: она не нашла связи
  между ответом и первым токеном. LSTM со сдвигом 3 около шага
  1150 резко падает почти до нуля.
</p>

<figure class="lstm-chart"><svg viewBox="0 0 680 420" role="img" aria-label="Кривые обучения RNN и LSTM на задаче с памятью длины 50"><line x1="70" y1="360" x2="650" y2="360" class="ls-grid"/><text x="62" y="364" text-anchor="end" class="ls-tick">0,0</text><line x1="70" y1="280" x2="650" y2="280" class="ls-grid"/><text x="62" y="284" text-anchor="end" class="ls-tick">0,2</text><line x1="70" y1="200" x2="650" y2="200" class="ls-grid"/><text x="62" y="204" text-anchor="end" class="ls-tick">0,4</text><line x1="70" y1="120" x2="650" y2="120" class="ls-grid"/><text x="62" y="124" text-anchor="end" class="ls-tick">0,6</text><line x1="70" y1="40" x2="650" y2="40" class="ls-grid"/><text x="62" y="44" text-anchor="end" class="ls-tick">0,8</text><text x="70" y="380" text-anchor="middle" class="ls-tick">0</text><text x="166.67" y="380" text-anchor="middle" class="ls-tick">500</text><text x="263.33" y="380" text-anchor="middle" class="ls-tick">1000</text><text x="360" y="380" text-anchor="middle" class="ls-tick">1500</text><text x="456.67" y="380" text-anchor="middle" class="ls-tick">2000</text><text x="553.33" y="380" text-anchor="middle" class="ls-tick">2500</text><text x="650" y="380" text-anchor="middle" class="ls-tick">3000</text><line x1="70" y1="82.74" x2="650" y2="82.74" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="6 5"/><text x="646" y="74.74" text-anchor="end" class="ls-tick">ln 2 = 0,693 — угадывание наугад</text><line x1="70" y1="360" x2="650" y2="360" class="ls-axis"/><line x1="70" y1="40" x2="70" y2="360" class="ls-axis"/><text x="650" y="404" text-anchor="end" class="ls-cap">шаг обучения</text><text x="70" y="26" class="ls-cap">ошибка на батче, T = 50</text><path d="M70 84.78 L74.83 84.89 L79.67 83.89 L84.5 83.18 L89.33 83.08 L94.17 83.43 L99 83.19 L103.83 83.7 L108.67 83.51 L113.5 83.02 L118.33 83.35 L123.17 83.58 L128 83.92 L132.83 83.33 L137.67 83.25 L142.5 83.03 L147.33 83.23 L152.17 83.33 L157 83.51 L161.83 83.55 L166.67 82.66 L171.5 82.48 L176.33 82.59 L181.17 82.95 L186 83.12 L190.83 83.94 L195.67 84.17 L200.5 83.48 L205.33 82.46 L210.17 81.93 L215 81.44 L219.83 81.27 L224.67 81.71 L229.5 81.67 L234.33 81.55 L239.17 81.94 L244 82.48 L248.83 82.42 L253.67 81.98 L258.5 81.66 L263.33 82.08 L268.17 82.18 L273 83.26 L277.83 83.56 L282.67 83.19 L287.5 83.08 L292.33 82.65 L297.17 82.94 L302 82.2 L306.83 82.34 L311.67 82.23 L316.5 81.88 L321.33 82.55 L326.17 82.71 L331 82.8 L335.83 82.86 L340.67 82.73 L345.5 81.95 L350.33 82.17 L355.17 81.94 L360 82.28 L364.83 82.7 L369.67 82.71 L374.5 82.88 L379.33 82.73 L384.17 82.96 L389 82.53 L393.83 82.27 L398.67 81.89 L403.5 81.84 L408.33 82.18 L413.17 82.97 L418 83.58 L422.83 83.47 L427.67 83.16 L432.5 82.65 L437.33 82.23 L442.17 82.76 L447 83.06 L451.83 82.88 L456.67 83.47 L461.5 83.08 L466.33 83.77 L471.17 83.76 L476 83.11 L480.83 82.47 L485.67 81.83 L490.5 81.94 L495.33 82.57 L500.17 83.17 L505 83.21 L509.83 83.18 L514.67 82.56 L519.5 81.85 L524.33 81.8 L529.17 81.74 L534 81.95 L538.83 82.52 L543.67 82.47 L548.5 82.72 L553.33 83.37 L558.17 83.09 L563 83 L567.83 82.9 L572.67 82.09 L577.5 82.68 L582.33 82.65 L587.17 82.65 L592 82.69 L596.83 82.33 L601.67 82.21 L606.5 82.22 L611.33 82.4 L616.17 82.05 L621 82.85 L625.83 83.2 L630.67 82.96 L635.5 83.2 L640.33 82.05 L645.17 81.8" fill="none" stroke="#C30B0A" stroke-width="3" stroke-linejoin="round"/><path d="M70 67.23 L74.83 76.44 L79.67 78.96 L84.5 79.67 L89.33 84.45 L94.17 84.53 L99 84.14 L103.83 84.56 L108.67 83.78 L113.5 83.41 L118.33 83.62 L123.17 83.74 L128 84.17 L132.83 83.72 L137.67 83.27 L142.5 82.98 L147.33 83.13 L152.17 83.19 L157 83.62 L161.83 83.81 L166.67 82.9 L171.5 82.65 L176.33 82.46 L181.17 82.38 L186 82.67 L190.83 83.2 L195.67 83.25 L200.5 83.07 L205.33 82.25 L210.17 81.96 L215 81.77 L219.83 81.61 L224.67 82.06 L229.5 82.07 L234.33 82.07 L239.17 82.25 L244 82.61 L248.83 82.55 L253.67 82.41 L258.5 82.42 L263.33 82.66 L268.17 82.97 L273 83.68 L277.83 83.73 L282.67 83.48 L287.5 83.08 L292.33 82.63 L297.17 82.79 L302 82.26 L306.83 82.15 L311.67 82.16 L316.5 81.9 L321.33 82.35 L326.17 82.59 L331 82.7 L335.83 82.78 L340.67 82.68 L345.5 82.52 L350.33 82.64 L355.17 82.68 L360 82.98 L364.83 83.09 L369.67 83.1 L374.5 83.03 L379.33 82.87 L384.17 82.95 L389 82.48 L393.83 82.24 L398.67 81.81 L403.5 81.74 L408.33 82.1 L413.17 82.82 L418 83.5 L422.83 83.06 L427.67 83.03 L432.5 82.52 L437.33 82.22 L442.17 83.16 L447 83.17 L451.83 83.19 L456.67 83.55 L461.5 83.18 L466.33 83.79 L471.17 83.67 L476 83.23 L480.83 82.82 L485.67 81.99 L490.5 82.04 L495.33 82.6 L500.17 82.91 L505 83.11 L509.83 83.23 L514.67 82.78 L519.5 82.43 L524.33 82.46 L529.17 82.23 L534 82.19 L538.83 82.41 L543.67 82.35 L548.5 82.58 L553.33 83.23 L558.17 83.47 L563 83.49 L567.83 83.39 L572.67 82.66 L577.5 82.71 L582.33 82.63 L587.17 82.69 L592 82.72 L596.83 82.39 L601.67 82.31 L606.5 82.37 L611.33 82.5 L616.17 82.3 L621 82.62 L625.83 82.52 L630.67 82.17 L635.5 82.47 L640.33 82.28 L645.17 82.4" fill="none" stroke="#8FB3DC" stroke-width="3" stroke-linejoin="round"/><path d="M70 71.15 L74.83 78.3 L79.67 80.03 L84.5 80.16 L89.33 83.71 L94.17 83.43 L99 81.84 L103.83 82.51 L108.67 82.51 L113.5 82.37 L118.33 83.51 L123.17 83.78 L128 83.67 L132.83 83.25 L137.67 83.01 L142.5 82.65 L147.33 82.56 L152.17 82.64 L157 82.99 L161.83 82.96 L166.67 82.38 L171.5 81.62 L176.33 82.04 L181.17 82.63 L186 82.61 L190.83 84.03 L195.67 84.05 L200.5 83.27 L205.33 82.07 L210.17 81.55 L215 81.05 L219.83 80.76 L224.67 81.52 L229.5 81.39 L234.33 81.12 L239.17 81.64 L244 82.4 L248.83 82.41 L253.67 81.57 L258.5 81.1 L263.33 81.51 L268.17 81.44 L273 83.31 L277.83 83.71 L282.67 83.15 L287.5 109.58 L292.33 177.82 L297.17 246.98 L302 316.17 L306.83 359.06 L311.67 359.51 L316.5 359.61 L321.33 359.64 L326.17 359.68 L331 359.72 L335.83 359.75 L340.67 359.77 L345.5 359.79 L350.33 359.81 L355.17 359.83 L360 359.85 L364.83 359.86 L369.67 359.87 L374.5 359.87 L379.33 359.88 L384.17 359.88 L389 359.9 L393.83 359.9 L398.67 359.91 L403.5 359.91 L408.33 359.91 L413.17 359.92 L418 359.92 L422.83 359.92 L427.67 359.93 L432.5 359.93 L437.33 359.94 L442.17 359.94 L447 359.94 L451.83 359.94 L456.67 359.94 L461.5 359.95 L466.33 359.95 L471.17 359.95 L476 359.95 L480.83 359.95 L485.67 359.96 L490.5 359.96 L495.33 359.96 L500.17 359.96 L505 359.96 L509.83 359.96 L514.67 359.96 L519.5 359.97 L524.33 359.97 L529.17 359.97 L534 359.97 L538.83 359.97 L543.67 359.97 L548.5 359.97 L553.33 359.97 L558.17 359.97 L563 359.97 L567.83 359.97 L572.67 359.97 L577.5 359.97 L582.33 359.98 L587.17 359.98 L592 359.98 L596.83 359.98 L601.67 359.98 L606.5 359.98 L611.33 359.98 L616.17 359.98 L621 359.98 L625.83 359.98 L630.67 359.98 L635.5 359.98 L640.33 359.98 L645.17 359.98" fill="none" stroke="#3576C0" stroke-width="3" stroke-linejoin="round"/><rect x="430" y="220" width="22" height="5" fill="#C30B0A"/><text x="460" y="227" font-size="14" fill="#111" font-family="Helvetica, Arial, sans-serif">RNN</text><rect x="430" y="246" width="22" height="5" fill="#8FB3DC"/><text x="460" y="253" font-size="14" fill="#111" font-family="Helvetica, Arial, sans-serif">LSTM, b<tspan dy="4" font-size="10">f</tspan><tspan dy="-4"> = 1</tspan></text><rect x="430" y="272" width="22" height="5" fill="#3576C0"/><text x="460" y="279" font-size="14" fill="#111" font-family="Helvetica, Arial, sans-serif">LSTM, b<tspan dy="4" font-size="10">f</tspan><tspan dy="-4"> = 3</tspan></text></svg></figure>

<p>
  Почему так, видно по множителю градиента. У RNN за такт он равен примерно <span class="math-inline" data-tex="\gamma"></span> — норме якобиана, у памяти LSTM — значению
  ворот забывания <span class="math-inline" data-tex="f"></span>. Подвигайте оба. При <span class="math-inline" data-tex="\gamma = 0{,}9"></span> до 1 % сигнал доживает за 44 такта, при <span class="math-inline" data-tex="f = 0{,}95"></span> — за 90,
  при <span class="math-inline" data-tex="f = 0{,}99"></span> — за 459. Важно, кто выбирает это число: <span class="math-inline" data-tex="\gamma"></span> складывается из весов и состояний и не управляется
  напрямую, а <span class="math-inline" data-tex="f"></span> — выход отдельного обучаемого слоя, и сеть может поставить его близко к единице только там, где нужно помнить.
</p>

<div class="stage slider-stage" id="decayLive">
<div class="slider-grid">
<div class="stage-figure">
<svg id="dlSvg" viewBox="0 0 680 420" role="img" aria-label="Множитель градиента через k тактов у RNN и по линии памяти LSTM"><line x1="70" y1="360" x2="650" y2="360" class="ls-grid"/><text x="62" y="364" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−6</tspan></text><line x1="70" y1="320" x2="650" y2="320" class="ls-grid"/><text x="62" y="324" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−5</tspan></text><line x1="70" y1="280" x2="650" y2="280" class="ls-grid"/><text x="62" y="284" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−4</tspan></text><line x1="70" y1="240" x2="650" y2="240" class="ls-grid"/><text x="62" y="244" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−3</tspan></text><line x1="70" y1="200" x2="650" y2="200" class="ls-grid"/><text x="62" y="204" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−2</tspan></text><line x1="70" y1="160" x2="650" y2="160" class="ls-grid"/><text x="62" y="164" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−1</tspan></text><line x1="70" y1="120" x2="650" y2="120" class="ls-grid"/><text x="62" y="124" text-anchor="end" class="ls-tick">1</text><line x1="70" y1="80" x2="650" y2="80" class="ls-grid"/><text x="62" y="84" text-anchor="end" class="ls-tick">10</text><line x1="70" y1="40" x2="650" y2="40" class="ls-grid"/><text x="62" y="44" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">2</tspan></text><text x="70" y="380" text-anchor="middle" class="ls-tick">0</text><text x="186" y="380" text-anchor="middle" class="ls-tick">20</text><text x="302" y="380" text-anchor="middle" class="ls-tick">40</text><text x="418" y="380" text-anchor="middle" class="ls-tick">60</text><text x="534" y="380" text-anchor="middle" class="ls-tick">80</text><text x="650" y="380" text-anchor="middle" class="ls-tick">100</text><line x1="70" y1="360" x2="650" y2="360" class="ls-axis"/><line x1="70" y1="40" x2="70" y2="360" class="ls-axis"/><text x="650" y="404" text-anchor="end" class="ls-cap">тактов назад, k</text><text x="70" y="26" text-anchor="start" class="ls-cap">во сколько раз изменился градиент</text><path id="dlR" fill="none" stroke="#C30B0A" stroke-width="3.5" stroke-linecap="round"/><path id="dlB" fill="none" stroke="#3576C0" stroke-width="3.5" stroke-linecap="round"/><text x="500" y="70" font-size="15" font-weight="800" fill="#A30908">RNN: γ<tspan dy="-6" font-size="11">k</tspan></text><text x="500" y="94" font-size="15" font-weight="800" fill="#2A5E9B">память LSTM: f<tspan dy="-6" font-size="11">k</tspan></text></svg>
</div>
<div class="slider-panel">
<label class="range-label" for="dlG">усиление такта RNN, <span style="text-transform:none">γ</span></label>
<input id="dlG" type="range" min="0.5" max="1.1" step="0.01" value="0.9">
<div id="dlGv" class="live-number small" style="color:#C30B0A">0,90</div>
<div id="dlGk" class="live-caption"></div>
<label class="range-label" for="dlF">ворота забывания, <span style="text-transform:none">f</span></label>
<input id="dlF" type="range" min="0.5" max="0.999" step="0.001" value="0.95">
<div id="dlFv" class="live-number small">0,950</div>
<div id="dlFk" class="live-caption"></div>
</div>
</div>
</div>
<p class="stage-hint">Красная кривая — множитель градиента у RNN, синяя — по линии памяти LSTM. Шкала логарифмическая: каждая клетка — в десять раз.</p>
<script>
(function () {
  var g = document.getElementById('dlG'), fr = document.getElementById('dlF');
  if (!g) return;
  function X(k) { return 70 + k / 100 * 580; }
  function Y(v) { var e = Math.log10(v); e = Math.max(-6.3, Math.min(2.3, e)); return 360 - (e + 6) / 8 * 320; }
  function curve(q) { var d = ''; for (var k = 0; k <= 100; k++) { var v = Math.pow(q, k); d += (k ? 'L' : 'M') + X(k).toFixed(1) + ' ' + Y(v).toFixed(1) + ' '; if (v < 1e-6 || v > 200) break; } return d; }
  function steps(q) { if (q >= 1) return Infinity; return Math.ceil(Math.log(0.01) / Math.log(q)); }
  function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
  function say(n) { if (!isFinite(n)) return 'не затухает: при γ ≥ 1 градиент растёт или стоит на месте'; return 'до 1 % сигнал доживает за <b>' + n + '</b> ' + (n % 10 === 1 && n % 100 !== 11 ? 'такт' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'такта' : 'тактов')); }
  function draw() {
    var a = +g.value, b = +fr.value;
    document.getElementById('dlR').setAttribute('d', curve(a));
    document.getElementById('dlB').setAttribute('d', curve(b));
    document.getElementById('dlGv').textContent = fmt(a, 2);
    document.getElementById('dlFv').textContent = fmt(b, 3);
    document.getElementById('dlGk').innerHTML = a > 1 ? 'за 100 тактов вырастает в <b>' + Math.round(Math.pow(a, 100)) + '</b> раз — взрыв' : say(steps(a));
    document.getElementById('dlFk').innerHTML = say(steps(b));
  }
  g.addEventListener('input', draw); fr.addEventListener('input', draw); draw();
})();
</script>

## Часть 2. Вторая линия: память, которая обновляется сложением

<p>
  Соберём LSTM из ячейки RNN по одной детали. Каждая деталь отвечает на конкретную проблему предыдущей версии, поэтому
  ни одна из них не выглядит случайной.
</p>

<div class="stage" id="stageMorph" tabindex="0">
  <div class="stage-figure">
<svg id="lsM" viewBox="0 0 960 640" role="img" aria-label="Переход от ячейки RNN к ячейке LSTM: линия памяти и трое ворот"><style>#lsM { font-family: Helvetica, Arial, sans-serif; }</style><defs><marker id="lsM-g" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/></marker><marker id="lsM-b" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#3576C0"/></marker><marker id="lsM-r" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C30B0A"/></marker><marker id="lsM-y" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C29E08"/></marker><marker id="lsM-n" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#73B222"/></marker></defs>
<g data-key="cell"><rect x="150" y="55" width="555" height="400" rx="16" fill="#F0FAF0" stroke="#73B222" stroke-width="2"/><text x="164" y="77" font-size="12.5" fill="#5A8C1C" text-anchor="start" font-weight="700" letter-spacing="0.06em">ЯЧЕЙКА LSTM, ТАКТ t</text></g>
<g data-key="cline"><path d="M 24 110 L 935 110" fill="none" stroke="#3576C0" stroke-width="4" marker-end="url(#lsM-b)" stroke-linejoin="round"/><text x="80" y="96" font-size="20" fill="#2A5E9B" text-anchor="middle" font-weight="700">c</text><text x="91" y="101" font-size="12" fill="#2A5E9B" text-anchor="middle" font-weight="400">t−1</text><text x="860" y="96" font-size="20" fill="#2A5E9B" text-anchor="middle" font-weight="700">c</text><text x="871" y="101" font-size="12" fill="#2A5E9B" text-anchor="middle" font-weight="400">t</text></g>
<g data-key="hin"><path d="M 24 400 L 592 400" fill="none" stroke="#5E5850" stroke-width="2.2" stroke-linejoin="round"/><path d="M 195 492 L 195 406" fill="none" stroke="#5E5850" stroke-width="2.2" marker-end="url(#lsM-g)" stroke-linejoin="round"/><circle cx="195" cy="400" r="4.5" fill="#5E5850" stroke="#5E5850" stroke-width="1"/><text x="80" y="388" font-size="20" fill="#111111" text-anchor="middle" font-weight="700">h</text><text x="91" y="393" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">t−1</text><text x="182" y="486" font-size="20" fill="#111111" text-anchor="end" font-weight="700">x</text><text x="185" y="491" font-size="12" fill="#111111" text-anchor="start" font-weight="400">t</text><text x="222" y="470" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">[x</text><text x="237" y="474" font-size="10" fill="#5E5850" text-anchor="start" font-weight="400">t</text><text x="243" y="470" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">, h</text><text x="261" y="474" font-size="10" fill="#5E5850" text-anchor="start" font-weight="400">t−1</text><text x="279" y="470" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">] — общий вход ворот</text><path d="M 270 400 L 270 337.0" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsM-g)" stroke-linejoin="round"/><circle cx="270" cy="400" r="4" fill="#5E5850" stroke="#5E5850" stroke-width="1"/><path d="M 375 400 L 375 337.0" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsM-g)" stroke-linejoin="round"/><circle cx="375" cy="400" r="4" fill="#5E5850" stroke="#5E5850" stroke-width="1"/><path d="M 478 400 L 478 337.0" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsM-g)" stroke-linejoin="round"/><circle cx="478" cy="400" r="4" fill="#5E5850" stroke="#5E5850" stroke-width="1"/><path d="M 592 400 L 592 337.0" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsM-g)" stroke-linejoin="round"/><circle cx="592" cy="400" r="4" fill="#5E5850" stroke="#5E5850" stroke-width="1"/></g>
<g data-key="forget"><rect x="227" y="267" width="86" height="66" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="2"/><text x="270" y="297" font-size="22" fill="#8C7106" text-anchor="middle" font-weight="700">f</text><text x="270" y="320" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">σ</text><path d="M 270 267.0 L 270 127" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#lsM-y)" stroke-linejoin="round"/><circle cx="270" cy="110" r="15" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="270" y="116" font-size="19" fill="#3576C0" text-anchor="middle" font-weight="700">×</text><text x="292" y="144" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="400">f ⊙ c</text></g>
<g data-key="cand"><rect x="435" y="267" width="86" height="66" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="2"/><text x="478" y="297" font-size="22" fill="#8C7106" text-anchor="middle" font-weight="700">g</text><text x="478" y="320" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">tanh</text><path d="M 478 267.0 L 478 217" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#lsM-y)" stroke-linejoin="round"/><path d="M 478 185 L 478 127" fill="none" stroke="#3576C0" stroke-width="2.4" marker-end="url(#lsM-b)" stroke-linejoin="round"/></g>
<g data-key="input"><rect x="332" y="267" width="86" height="66" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="2"/><text x="375" y="297" font-size="22" fill="#8C7106" text-anchor="middle" font-weight="700">i</text><text x="375" y="320" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">σ</text><path d="M 375 267.0 L 375 200 L 461 200" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#lsM-y)" stroke-linejoin="round"/><circle cx="478" cy="200" r="15" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="478" y="206" font-size="19" fill="#3576C0" text-anchor="middle" font-weight="700">×</text><text x="458" y="190" font-size="13" fill="#2A5E9B" text-anchor="end" font-weight="400">i ⊙ g</text></g>
<g data-key="plus"><circle cx="478" cy="110" r="15" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="478" y="116" font-size="19" fill="#3576C0" text-anchor="middle" font-weight="700">+</text></g>
<g data-key="tanhc"><path d="M 655 110 L 655 182" fill="none" stroke="#3576C0" stroke-width="2.2" marker-end="url(#lsM-b)" stroke-linejoin="round"/><rect x="625" y="184" width="60" height="32" rx="16" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="655" y="205" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">tanh</text><path d="M 655 216 L 655 283" fill="none" stroke="#3576C0" stroke-width="2.2" marker-end="url(#lsM-b)" stroke-linejoin="round"/></g>
<g data-key="ogate"><rect x="549" y="267" width="86" height="66" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="2"/><text x="592" y="297" font-size="22" fill="#8C7106" text-anchor="middle" font-weight="700">o</text><text x="592" y="320" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">σ</text><path d="M 635.0 300 L 638 300" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#lsM-y)" stroke-linejoin="round"/><circle cx="655" cy="300" r="15" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="655" y="306" font-size="19" fill="#3576C0" text-anchor="middle" font-weight="700">×</text></g>
<g data-key="hout"><path d="M 655 315 L 655 425 L 935 425" fill="none" stroke="#73B222" stroke-width="3" marker-end="url(#lsM-n)" stroke-linejoin="round"/><path d="M 835 425 L 835 222" fill="none" stroke="#73B222" stroke-width="2.4" marker-end="url(#lsM-n)" stroke-linejoin="round"/><text x="870" y="451" font-size="20" fill="#5A8C1C" text-anchor="middle" font-weight="700">h</text><text x="881" y="456" font-size="12" fill="#5A8C1C" text-anchor="middle" font-weight="400">t</text></g>
<g data-key="yout"><rect x="728" y="132" width="212" height="88" rx="10" fill="#FFFFFF" stroke="#73B222" stroke-width="2"/><foreignObject x="731.5" y="139" width="205" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="z_t=h_tW_{hy}+b_y"></div></foreignObject><foreignObject x="731.5" y="177" width="205" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#5A8C1C" data-tex="\hat y_t=\operatorname{softmax}(z_t)"></div></foreignObject></g>
<g data-key="rnnpath" data-only="1"><path d="M 521.0 300 L 538 300 L 538 425 L 935 425" fill="none" stroke="#73B222" stroke-width="3" marker-end="url(#lsM-n)" stroke-linejoin="round"/><text x="548" y="360" font-size="18" fill="#5A8C1C" text-anchor="start" font-weight="700">h</text><text x="560" y="365" font-size="11" fill="#5A8C1C" text-anchor="start" font-weight="400">t</text><text x="566" y="360" font-size="18" fill="#5A8C1C" text-anchor="start" font-weight="700"> = g</text><text x="870" y="451" font-size="20" fill="#5A8C1C" text-anchor="middle" font-weight="700">h</text><text x="881" y="456" font-size="12" fill="#5A8C1C" text-anchor="middle" font-weight="400">t</text></g>
<g data-key="redpath" data-only="1"><path d="M 24 400 L 478 400 L 478 335.0" fill="none" stroke="#C30B0A" stroke-width="4.5" stroke-linejoin="round"/><path d="M 521.0 300 L 538 300 L 538 425 L 935 425" fill="none" stroke="#C30B0A" stroke-width="4.5" stroke-linejoin="round"/><text x="330" y="430" font-size="13.5" fill="#A30908" text-anchor="start" font-weight="700">каждый такт: умножение на W_hh и tanh</text></g>
<g data-key="cpath" data-only="1"><path d="M 24 110 L 935 110" fill="none" stroke="#3576C0" stroke-width="9" stroke-linejoin="round"/><text x="470" y="84" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">по этой линии нет ни одной матрицы весов</text></g>
<rect x="20" y="512" width="920" height="118" rx="10" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
<g data-key="M1" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="h_t=\tanh\left(x_tW_{xh}+h_{t-1}W_{hh}+b_h\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="\text{один вектор }h_t\text{ — и выход такта, и память}"></div></foreignObject></g>
<g data-key="M2" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="dh_{t-1}=\left(dh_t\odot\left(1-h_t^2\right)\right)W_{hh}^{\top}"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="\text{за }k\text{ тактов назад: }k\text{ умножений на }W_{hh}^{\top}\text{ и на }1-h^2"></div></foreignObject></g>
<g data-key="M3" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="c_t=c_{t-1}+g_t,\qquad g_t=\tanh\left(x_tW_{xg}+h_{t-1}W_{hg}+b_g\right),\qquad h_t=\tanh(c_t)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="\partial c_t/\partial c_{t-1}=1\text{: градиент проходит без потерь, но память только копится}"></div></foreignObject></g>
<g data-key="M4" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="c_t=f_t\odot c_{t-1}+g_t,\qquad f_t=\sigma\left(x_tW_{xf}+h_{t-1}W_{hf}+b_f\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="f_t\in(0;1)\text{ по каждой координате: сколько оставить от старой памяти}"></div></foreignObject></g>
<g data-key="M5" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="c_t=f_t\odot c_{t-1}+i_t\odot g_t,\qquad i_t=\sigma\left(x_tW_{xi}+h_{t-1}W_{hi}+b_i\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="i_t\text{ — сколько записать из кандидата }g_t"></div></foreignObject></g>
<g data-key="M6" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="h_t=o_t\odot\tanh(c_t),\qquad o_t=\sigma\left(x_tW_{xo}+h_{t-1}W_{ho}+b_o\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="o_t\text{ — какую часть памяти выдать наружу на этом такте}"></div></foreignObject></g>
<g data-key="M7" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="(c_{t-1},\,h_{t-1},\,x_t)\;\longrightarrow\;(c_t,\,h_t),\qquad z_t=h_tW_{hy}+b_y"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="\text{в следующий такт уходят два вектора длины }H"></div></foreignObject></g>
<g data-key="M8" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="c_t=f_t\odot c_{t-1}+\ldots\quad\Rightarrow\quad dc_{t-1}=dc_t\odot f_t+\ldots"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111" data-tex="\text{на прямом пути памяти градиент умножается только на }f_t"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="cell hin cand rnnpath M1" data-focus="cand">
      <div class="step-kicker">Шаг 1 · ячейка RNN</div>
      <h4>Начинаем с обычной ячейки RNN</h4>
      <p>Нарисуем ячейку RNN в той же раскладке, в которой дальше будет LSTM. Блок <span class="math-inline" data-tex="g"></span> — это вся старая ячейка: склейка входа и памяти, умножение на матрицы и <span class="math-inline" data-tex="\tanh"></span>. Его результат и есть новое состояние <span class="math-inline" data-tex="h_t"></span>. Остальные детали пока бледные: их мы добавим по одной.</p>
    </div>
    <div class="step-panel" data-on="cell hin cand rnnpath redpath M2" data-focus="redpath">
      <div class="step-kicker">Шаг 2 · где теряется градиент</div>
      <h4>Путь памяти идёт через матрицу</h4>
      <p>Красный путь — то, как память переходит из такта в такт. Состояние <span class="math-inline" data-tex="h_{t-1}"></span> попадает в склейку, умножается на <span class="math-inline" data-tex="W_{hh}"></span>, проходит через <span class="math-inline" data-tex="\tanh"></span> и становится <span class="math-inline" data-tex="h_t"></span>. На обратном проходе градиент идёт тем же путём: на каждом такте он умножается на <span class="math-inline" data-tex="W_{hh}^{\top}"></span> и на <span class="math-inline" data-tex="1-h^2"></span>. Эти множители обычно меньше единицы, и за 20–30 тактов сигнал падает в миллионы раз (часть 5 статьи про RNN).</p>
    </div>
    <div class="step-panel" data-on="cell hin cline cand plus tanhc hout M3" data-focus="cline plus">
      <div class="step-kicker">Шаг 3 · вторая линия</div>
      <h4>Добавим память, которая обновляется сложением</h4>
      <p>Протянем через ячейку вторую линию — вектор <span class="math-inline" data-tex="c_t"></span> той же длины <span class="math-inline" data-tex="H"></span>. Ячейка не перезаписывает его, а прибавляет к нему результат старой ячейки: <span class="math-inline" data-tex="c_t = c_{t-1} + g_t"></span>. Производная суммы по <span class="math-inline" data-tex="c_{t-1}"></span> равна единице, поэтому градиент по этой линии идёт назад без ослабления. Наружу пока выдаём <span class="math-inline" data-tex="h_t = \tanh(c_t)"></span>.</p><p>У такой памяти беда: она только копится. Через сотню тактов в <span class="math-inline" data-tex="c"></span> лежит сумма ста векторов, и стереть старое нечем.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline cand plus tanhc hout forget M4" data-focus="forget">
      <div class="step-kicker">Шаг 4 · ворота забывания</div>
      <h4>Каждую координату памяти можно ослабить</h4>
      <p>Перед сложением умножим старую память поэлементно на вектор <span class="math-inline" data-tex="f_t"></span>. Его считает собственный маленький слой с сигмоидой, поэтому каждая координата <span class="math-inline" data-tex="f_t"></span> лежит между 0 и 1. Единица — оставить координату памяти как есть, ноль — стереть, 0,5 — ослабить вдвое. Слой видит текущий токен и прошлый выход, поэтому решение «что забыть» зависит от контекста.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline cand plus tanhc hout forget input M5" data-focus="input">
      <div class="step-kicker">Шаг 5 · ворота входа</div>
      <h4>Запись тоже дозируется</h4>
      <p>Кандидат <span class="math-inline" data-tex="g_t"></span> решает, <em>что</em> записать: это вектор значений от −1 до 1. Второй сигмоидный слой <span class="math-inline" data-tex="i_t"></span> решает, <em>сколько</em> из него записать в каждую координату. Их произведение <span class="math-inline" data-tex="i_t \odot g_t"></span> и прибавляется к памяти. Если <span class="math-inline" data-tex="i_t \approx 0"></span>, токен не меняет память совсем, например, когда это шум, который нужно пропустить.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline cand plus tanhc hout forget input ogate M6" data-focus="ogate tanhc">
      <div class="step-kicker">Шаг 6 · ворота выхода</div>
      <h4>Наружу выдаётся не вся память</h4>
      <p>Третьи ворота <span class="math-inline" data-tex="o_t"></span> умножаются на <span class="math-inline" data-tex="\tanh(c_t)"></span>. <span class="math-inline" data-tex="\tanh"></span> возвращает значения памяти в диапазон <span class="math-inline" data-tex="(-1;\,1)"></span>: сама <span class="math-inline" data-tex="c_t"></span> ничем не ограничена, она может накопить и 3, и −5. А <span class="math-inline" data-tex="o_t"></span> выбирает, какие координаты памяти нужны выходному слою и следующему такту прямо сейчас. Память может хранить признак, который понадобится только через 40 токенов, и не выдавать его до тех пор.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline cand plus tanhc hout forget input ogate yout M7" data-focus="hout cline">
      <div class="step-kicker">Шаг 7 · вся ячейка</div>
      <h4>В следующий такт идут два вектора</h4>
      <p>Ячейка собрана: четыре слоя (три ворот и кандидат) смотрят на один и тот же вход <span class="math-inline" data-tex="[x_t, h_{t-1}]"></span>, а два поэлементных умножения и одно сложение соединяют их результаты. Между тактами передаются <span class="math-inline" data-tex="c_t"></span> и <span class="math-inline" data-tex="h_t"></span>. Выходной слой, softmax и кросс-энтропия остаются такими же, как в RNN: они смотрят только на <span class="math-inline" data-tex="h_t"></span>.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline cand plus tanhc hout forget input ogate yout cpath M8" data-focus="cline">
      <div class="step-kicker">Шаг 8 · зачем всё это</div>
      <h4>Градиент по памяти умножается только на f</h4>
      <p>Посмотрим на обратный путь по верхней линии. Из <span class="math-inline" data-tex="c_t = f_t \odot c_{t-1} + i_t\odot g_t"></span> следует, что градиент по <span class="math-inline" data-tex="c_{t-1}"></span> получает слагаемое <span class="math-inline" data-tex="dc_t \odot f_t"></span>. Матрицы весов на этом пути нет, производной <span class="math-inline" data-tex="\tanh"></span> тоже нет. Если сеть научится держать <span class="math-inline" data-tex="f_t \approx 1"></span> на нужной координате, градиент дойдёт до начала последовательности почти без потерь. Многоточие в формуле — пути через ворота и <span class="math-inline" data-tex="h"></span>; они затухают так же, как в RNN, но этот путь сохраняется.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Переключайте шаги кнопками или стрелками ← → на клавиатуре, когда сцена в фокусе.</p>

<p>
  Вся ячейка в шести строках. Все четыре слоя получают один и тот же вход <span class="math-inline" data-tex="x_t"></span> и прошлый выход <span class="math-inline" data-tex="h_{t-1}"></span>, у каждого свои
  матрицы <span class="math-inline" data-tex="W_{x\cdot}"></span> размера <span class="math-inline" data-tex="[E\times H]"></span>, <span class="math-inline" data-tex="W_{h\cdot}"></span> размера <span class="math-inline" data-tex="[H\times H]"></span> и свой сдвиг.
</p>

<div class="math-display" data-tex="\begin{aligned}
f_t&=\sigma\left(x_tW_{xf}+h_{t-1}W_{hf}+b_f\right)&&\text{ворота забывания}\\
i_t&=\sigma\left(x_tW_{xi}+h_{t-1}W_{hi}+b_i\right)&&\text{ворота входа}\\
g_t&=\tanh\left(x_tW_{xg}+h_{t-1}W_{hg}+b_g\right)&&\text{кандидат}\\
o_t&=\sigma\left(x_tW_{xo}+h_{t-1}W_{ho}+b_o\right)&&\text{ворота выхода}\\
c_t&=f_t\odot c_{t-1}+i_t\odot g_t&&\text{память}\\
h_t&=o_t\odot\tanh(c_t)&&\text{выход}
\end{aligned}"></div>

<div class="lstm-table"><table class="shape-table">
  <tr><th>обозначение</th><th>что это</th><th>диапазон</th><th>форма</th></tr>
  <tr><td><span class="math-inline" data-tex="f_t, i_t, o_t"></span></td><td>ворота: доля, которую пропустить</td><td><span class="math-inline" data-tex="(0;\,1)"></span></td><td><span class="math-inline" data-tex="[B\times H]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="g_t"></span></td><td>кандидат на запись — бывшая ячейка RNN</td><td><span class="math-inline" data-tex="(-1;\,1)"></span></td><td><span class="math-inline" data-tex="[B\times H]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="c_t"></span></td><td>память (cell state), идёт только между ячейками</td><td>не ограничена</td><td><span class="math-inline" data-tex="[B\times H]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="h_t"></span></td><td>выход такта: в выходной слой и в следующий такт</td><td><span class="math-inline" data-tex="(-1;\,1)"></span></td><td><span class="math-inline" data-tex="[B\times H]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="\odot"></span></td><td>поэлементное произведение</td><td></td><td></td></tr>
</table></div>

<div class="callout-blue">
  <strong>Об обозначениях.</strong> Строки — векторы, веса умножаются справа: <span class="math-inline" data-tex="x_tW_{xf}"></span>, как в статье про RNN. В литературе
  часто пишут столбцы и <span class="math-inline" data-tex="W_f[h_{t-1}, x_t]"></span> — это та же формула, транспонированная. Кандидат там обозначают <span class="math-inline" data-tex="\tilde c_t"></span>;
  мы пишем <span class="math-inline" data-tex="g_t"></span>, как в PyTorch.
</div>

## Часть 3. Ворота по одному: первый такт на числах

<p>
  Ворота — это обычный полносвязный слой с сигмоидой на выходе. Сигмоида и делает из слоя «ворота»: её значения лежат
  между 0 и 1, и их можно понимать как долю, которую нужно пропустить.
</p>

<div class="callout-blue">
<p><strong>Справка: сигмоида</strong></p>
<p>
  <span class="math-inline" data-tex="\sigma(a) = \dfrac{1}{1+e^{-a}}"></span>. При <span class="math-inline" data-tex="a = 0"></span> получается <span class="math-inline" data-tex="1/2"></span>. При больших положительных <span class="math-inline" data-tex="a"></span> слагаемое <span class="math-inline" data-tex="e^{-a}"></span> почти ноль,
  и <span class="math-inline" data-tex="\sigma \to 1"></span>; при больших отрицательных <span class="math-inline" data-tex="e^{-a}"></span> огромно, и <span class="math-inline" data-tex="\sigma \to 0"></span>. Поэтому выход сигмоиды всегда лежит между
  0 и 1 и подходит на роль доли: сколько пропустить. Производная выражается через само значение:
  <span class="math-inline" data-tex="\sigma'(a) = \sigma(a)\,(1-\sigma(a))"></span>. Она не больше <span class="math-inline" data-tex="0{,}25"></span> — это максимум при <span class="math-inline" data-tex="a = 0"></span>.
</p>
</div>

<p>
  Подвигайте предактивацию. Зелёная кривая — значение ворот, жёлтая — производная. Она понадобится на обратном проходе:
  градиент, проходя через ворота, умножается на <span class="math-inline" data-tex="\sigma(1-\sigma)"></span>, и чем ближе ворота к 0 или 1, тем меньше этот множитель.
</p>

<div class="stage slider-stage" id="sigStage">
<div class="slider-grid">
<div class="stage-figure">
<svg id="sgSvg" viewBox="0 0 680 420" role="img" aria-label="Сигмоида и её производная"><line x1="70" y1="60" x2="650" y2="60" class="ls-grid"/><text x="62" y="64" text-anchor="end" class="ls-tick">1</text><line x1="70" y1="210" x2="650" y2="210" class="ls-grid"/><text x="62" y="214" text-anchor="end" class="ls-tick">0,5</text><line x1="70" y1="285" x2="650" y2="285" class="ls-grid"/><text x="62" y="289" text-anchor="end" class="ls-tick">0,25</text><line x1="70" y1="360" x2="650" y2="360" class="ls-grid"/><text x="62" y="364" text-anchor="end" class="ls-tick">0</text><text x="70" y="380" text-anchor="middle" class="ls-tick">-6</text><text x="215" y="380" text-anchor="middle" class="ls-tick">-3</text><text x="360" y="380" text-anchor="middle" class="ls-tick">0</text><text x="505" y="380" text-anchor="middle" class="ls-tick">3</text><text x="650" y="380" text-anchor="middle" class="ls-tick">6</text><line x1="70" y1="360" x2="650" y2="360" class="ls-axis"/><line x1="360" y1="40" x2="360" y2="360" class="ls-axis"/><text x="650" y="404" text-anchor="end" class="ls-cap">предактивация a</text><path id="sgC" fill="none" stroke="#73B222" stroke-width="4" stroke-linecap="round"/><path id="sgD" fill="none" stroke="#C29E08" stroke-width="3.5" stroke-dasharray="9 5" stroke-linecap="round"/><line id="sgGuide" stroke="#3576C0" stroke-width="2" stroke-dasharray="5 5"/><circle id="sgDot" r="9" fill="#3576C0" stroke="#fff" stroke-width="3"/><circle id="sgDotD" r="7" fill="#C29E08" stroke="#fff" stroke-width="3"/><text x="90" y="80" font-size="15" font-weight="800" fill="#5A8C1C">σ(a) = 1 / (1 + e<tspan dy="-6" font-size="11">−a</tspan><tspan dy="6">)</tspan></text><text x="90" y="104" font-size="15" font-weight="800" fill="#8C7106">σ(1 − σ) — производная</text></svg>
</div>
<div class="slider-panel">
<label class="range-label" for="sgA">предактивация a</label>
<input id="sgA" type="range" min="-6" max="6" step="0.05" value="1.2">
<div id="sgAv" class="live-number small">1,20</div>
<div class="live-caption">сумма вкладов токена, памяти и сдвига</div>
<div id="sgS" class="live-number" style="color:#5A8C1C">0,7685</div>
<div class="live-caption">значение ворот σ(a): какая доля проходит</div>
<div id="sgDv" class="live-number small" style="color:#8C7106">0,1779</div>
<div class="live-caption">производная σ(1 − σ), не больше 0,25</div>
</div>
</div>
</div>
<p class="stage-hint">Стартовое значение 1,2 — предактивация первой координаты ворот забывания на первом такте нашего примера.</p>
<script>
(function () {
  var r = document.getElementById('sgA'); if (!r) return;
  function X(a) { return 70 + (a + 6) / 12 * 580; } function Y(v) { return 360 - v * 300; }
  function s(a) { return 1 / (1 + Math.exp(-a)); }
  var c = '', d = '';
  for (var i = 0; i <= 240; i++) { var a = -6 + i * 0.05; c += (i ? 'L' : 'M') + X(a).toFixed(1) + ' ' + Y(s(a)).toFixed(1) + ' '; d += (i ? 'L' : 'M') + X(a).toFixed(1) + ' ' + Y(s(a) * (1 - s(a))).toFixed(1) + ' '; }
  document.getElementById('sgC').setAttribute('d', c); document.getElementById('sgD').setAttribute('d', d);
  function fmt(v, k) { return v.toFixed(k).replace('.', ',').replace('-', '−'); }
  function draw() {
    var a = +r.value, v = s(a), dv = v * (1 - v), x = X(a);
    var dot = document.getElementById('sgDot'), dd = document.getElementById('sgDotD'), gl = document.getElementById('sgGuide');
    dot.setAttribute('cx', x); dot.setAttribute('cy', Y(v)); dd.setAttribute('cx', x); dd.setAttribute('cy', Y(dv));
    gl.setAttribute('x1', x); gl.setAttribute('x2', x); gl.setAttribute('y1', 360); gl.setAttribute('y2', Y(v));
    document.getElementById('sgAv').textContent = fmt(a, 2);
    document.getElementById('sgS').textContent = fmt(v, 4);
    document.getElementById('sgDv').textContent = fmt(dv, 4);
  }
  r.addEventListener('input', draw); draw();
})();
</script>

<div class="callout-blue">
<p><strong>Справка: поэлементное произведение ⊙</strong></p>
<p>
  <span class="math-inline" data-tex="u \odot v"></span> — векторы той же длины перемножаются по координатам: <span class="math-inline" data-tex="(0{,}5;\,2) \odot (4;\,0{,}1) = (2;\,0{,}2)"></span>.
  Это не скалярное произведение (там результат — одно число) и не умножение на матрицу. Когда ворота
  <span class="math-inline" data-tex="f = (1;\,0)"></span> умножаются на память <span class="math-inline" data-tex="c = (0{,}7;\,-0{,}3)"></span>, первая координата сохраняется, вторая обнуляется: <span class="math-inline" data-tex="(0{,}7;\,0)"></span>.
</p>
</div>

<p>
  Теперь пройдём ячейку на первом такте нашей фразы. Веса ворот выбраны вручную, небольшими числами с одним знаком после
  запятой; полностью они есть в коде части 8.
</p>

<div class="stage" id="stageGates" tabindex="0">
  <div class="stage-figure">
<svg id="lsG" viewBox="0 0 960 640" role="img" aria-label="Ячейка LSTM на первом такте с числами"><style>#lsG { font-family: Helvetica, Arial, sans-serif; }</style><defs><marker id="lsG-g" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/></marker><marker id="lsG-b" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#3576C0"/></marker><marker id="lsG-r" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C30B0A"/></marker><marker id="lsG-y" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C29E08"/></marker><marker id="lsG-n" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#73B222"/></marker></defs>
<g data-key="cell"><rect x="150" y="55" width="555" height="400" rx="16" fill="#F0FAF0" stroke="#73B222" stroke-width="2"/><text x="164" y="77" font-size="12.5" fill="#5A8C1C" text-anchor="start" font-weight="700" letter-spacing="0.06em">ЯЧЕЙКА LSTM, ТАКТ t = 1</text></g>
<g data-key="cline"><path d="M 24 110 L 935 110" fill="none" stroke="#3576C0" stroke-width="4" marker-end="url(#lsG-b)" stroke-linejoin="round"/><text x="80" y="96" font-size="20" fill="#2A5E9B" text-anchor="middle" font-weight="700">c</text><text x="91" y="101" font-size="12" fill="#2A5E9B" text-anchor="middle" font-weight="400">t−1</text><text x="860" y="96" font-size="20" fill="#2A5E9B" text-anchor="middle" font-weight="700">c</text><text x="871" y="101" font-size="12" fill="#2A5E9B" text-anchor="middle" font-weight="400">t</text><text x="80" y="136" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="400">(0,0; 0,0)</text><text x="80" y="154" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">память пуста</text></g>
<g data-key="hin"><path d="M 24 400 L 592 400" fill="none" stroke="#5E5850" stroke-width="2.2" stroke-linejoin="round"/><path d="M 195 492 L 195 406" fill="none" stroke="#5E5850" stroke-width="2.2" marker-end="url(#lsG-g)" stroke-linejoin="round"/><circle cx="195" cy="400" r="4.5" fill="#5E5850" stroke="#5E5850" stroke-width="1"/><text x="80" y="388" font-size="20" fill="#111111" text-anchor="middle" font-weight="700">h</text><text x="91" y="393" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">t−1</text><text x="182" y="486" font-size="20" fill="#111111" text-anchor="end" font-weight="700">x</text><text x="185" y="491" font-size="12" fill="#111111" text-anchor="start" font-weight="400">t</text><text x="222" y="470" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">[x</text><text x="237" y="474" font-size="10" fill="#5E5850" text-anchor="start" font-weight="400">t</text><text x="243" y="470" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">, h</text><text x="261" y="474" font-size="10" fill="#5E5850" text-anchor="start" font-weight="400">t−1</text><text x="279" y="470" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">] — общий вход ворот</text><text x="80" y="426" font-size="13" fill="#111111" text-anchor="middle" font-weight="400">(0,0; 0,0)</text><text x="120" y="486" font-size="13" fill="#111111" text-anchor="end" font-weight="400">⟨BOS⟩ = (1; 0; 0; 0)</text><path d="M 270 400 L 270 337.0" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsG-g)" stroke-linejoin="round"/><circle cx="270" cy="400" r="4" fill="#5E5850" stroke="#5E5850" stroke-width="1"/><path d="M 375 400 L 375 337.0" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsG-g)" stroke-linejoin="round"/><circle cx="375" cy="400" r="4" fill="#5E5850" stroke="#5E5850" stroke-width="1"/><path d="M 478 400 L 478 337.0" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsG-g)" stroke-linejoin="round"/><circle cx="478" cy="400" r="4" fill="#5E5850" stroke="#5E5850" stroke-width="1"/><path d="M 592 400 L 592 337.0" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsG-g)" stroke-linejoin="round"/><circle cx="592" cy="400" r="4" fill="#5E5850" stroke="#5E5850" stroke-width="1"/></g>
<g data-key="forget"><rect x="227" y="267" width="86" height="66" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="2"/><text x="242" y="288" font-size="19" fill="#8C7106" text-anchor="middle" font-weight="700">f</text><text x="292" y="288" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">σ</text><text x="270" y="309" font-size="14" fill="#111111" text-anchor="middle" font-weight="400">0,7685</text><text x="270" y="327" font-size="14" fill="#111111" text-anchor="middle" font-weight="400">0,6682</text><path d="M 270 267.0 L 270 127" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#lsG-y)" stroke-linejoin="round"/><circle cx="270" cy="110" r="15" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="270" y="116" font-size="19" fill="#3576C0" text-anchor="middle" font-weight="700">×</text><text x="292" y="144" font-size="12.5" fill="#2A5E9B" text-anchor="start" font-weight="400">f ⊙ c = (0,0; 0,0)</text></g>
<g data-key="cand"><rect x="435" y="267" width="86" height="66" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="2"/><text x="450" y="288" font-size="19" fill="#8C7106" text-anchor="middle" font-weight="700">g</text><text x="500" y="288" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">tanh</text><text x="478" y="309" font-size="14" fill="#111111" text-anchor="middle" font-weight="400">0,5370</text><text x="478" y="327" font-size="14" fill="#111111" text-anchor="middle" font-weight="400">−0,4621</text><path d="M 478 267.0 L 478 217" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#lsG-y)" stroke-linejoin="round"/><path d="M 478 185 L 478 127" fill="none" stroke="#3576C0" stroke-width="2.4" marker-end="url(#lsG-b)" stroke-linejoin="round"/></g>
<g data-key="input"><rect x="332" y="267" width="86" height="66" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="2"/><text x="347" y="288" font-size="19" fill="#8C7106" text-anchor="middle" font-weight="700">i</text><text x="397" y="288" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">σ</text><text x="375" y="309" font-size="14" fill="#111111" text-anchor="middle" font-weight="400">0,5744</text><text x="375" y="327" font-size="14" fill="#111111" text-anchor="middle" font-weight="400">0,6457</text><path d="M 375 267.0 L 375 200 L 461 200" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#lsG-y)" stroke-linejoin="round"/><circle cx="478" cy="200" r="15" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="478" y="206" font-size="19" fill="#3576C0" text-anchor="middle" font-weight="700">×</text><text x="458" y="190" font-size="12.5" fill="#2A5E9B" text-anchor="end" font-weight="400">i ⊙ g = (0,3085; −0,2984)</text></g>
<g data-key="plus"><circle cx="478" cy="110" r="15" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="478" y="116" font-size="19" fill="#3576C0" text-anchor="middle" font-weight="700">+</text><text x="860" y="74" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="400">(0,3085; −0,2984)</text></g>
<g data-key="tanhc"><path d="M 655 110 L 655 182" fill="none" stroke="#3576C0" stroke-width="2.2" marker-end="url(#lsG-b)" stroke-linejoin="round"/><rect x="625" y="184" width="60" height="32" rx="16" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="655" y="205" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">tanh</text><path d="M 655 216 L 655 283" fill="none" stroke="#3576C0" stroke-width="2.2" marker-end="url(#lsG-b)" stroke-linejoin="round"/><text x="665" y="252" font-size="12" fill="#2A5E9B" text-anchor="start" font-weight="400">tanh c = (0,2991; −0,2898)</text></g>
<g data-key="ogate"><rect x="549" y="267" width="86" height="66" rx="9" fill="#FFFBEB" stroke="#C29E08" stroke-width="2"/><text x="564" y="288" font-size="19" fill="#8C7106" text-anchor="middle" font-weight="700">o</text><text x="614" y="288" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">σ</text><text x="592" y="309" font-size="14" fill="#111111" text-anchor="middle" font-weight="400">0,5987</text><text x="592" y="327" font-size="14" fill="#111111" text-anchor="middle" font-weight="400">0,5498</text><path d="M 635.0 300 L 638 300" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#lsG-y)" stroke-linejoin="round"/><circle cx="655" cy="300" r="15" fill="#F0F6FC" stroke="#3576C0" stroke-width="2"/><text x="655" y="306" font-size="19" fill="#3576C0" text-anchor="middle" font-weight="700">×</text></g>
<g data-key="hout"><path d="M 655 315 L 655 425 L 935 425" fill="none" stroke="#73B222" stroke-width="3" marker-end="url(#lsG-n)" stroke-linejoin="round"/><path d="M 835 425 L 835 222" fill="none" stroke="#73B222" stroke-width="2.4" marker-end="url(#lsG-n)" stroke-linejoin="round"/><text x="870" y="451" font-size="20" fill="#5A8C1C" text-anchor="middle" font-weight="700">h</text><text x="881" y="456" font-size="12" fill="#5A8C1C" text-anchor="middle" font-weight="400">t</text><text x="760" y="451" font-size="13" fill="#5A8C1C" text-anchor="middle" font-weight="400">(0,1791; −0,1594)</text></g>
<g data-key="yout"><rect x="728" y="132" width="212" height="88" rx="10" fill="#FFFFFF" stroke="#73B222" stroke-width="2"/><foreignObject x="731.5" y="135" width="205" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111" data-tex="z_1=h_1W_{hy}+b_y"></div></foreignObject><text x="834" y="189" font-size="13.5" fill="#5A8C1C" text-anchor="middle" font-weight="700">ŷ(you) = 0,2296</text><text x="834" y="210" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">l₁ = −ln ŷ(you) = 1,4715</text></g>
<g data-key="rnnpath" data-only="1"><path d="M 521.0 300 L 538 300 L 538 425 L 935 425" fill="none" stroke="#73B222" stroke-width="3" marker-end="url(#lsG-n)" stroke-linejoin="round"/><text x="548" y="360" font-size="18" fill="#5A8C1C" text-anchor="start" font-weight="700">h</text><text x="560" y="365" font-size="11" fill="#5A8C1C" text-anchor="start" font-weight="400">t</text><text x="566" y="360" font-size="18" fill="#5A8C1C" text-anchor="start" font-weight="700"> = g</text><text x="870" y="451" font-size="20" fill="#5A8C1C" text-anchor="middle" font-weight="700">h</text><text x="881" y="456" font-size="12" fill="#5A8C1C" text-anchor="middle" font-weight="400">t</text></g>
<g data-key="redpath" data-only="1"><path d="M 24 400 L 478 400 L 478 335.0" fill="none" stroke="#C30B0A" stroke-width="4.5" stroke-linejoin="round"/><path d="M 521.0 300 L 538 300 L 538 425 L 935 425" fill="none" stroke="#C30B0A" stroke-width="4.5" stroke-linejoin="round"/><text x="330" y="430" font-size="13.5" fill="#A30908" text-anchor="start" font-weight="700">каждый такт: умножение на W_hh и tanh</text></g>
<g data-key="cpath" data-only="1"><path d="M 24 110 L 935 110" fill="none" stroke="#3576C0" stroke-width="9" stroke-linejoin="round"/><text x="470" y="84" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">по этой линии нет ни одной матрицы весов</text></g>
<rect x="20" y="512" width="920" height="118" rx="10" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
<g data-key="G1" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="x_1=(1;\,0;\,0;\,0),\qquad h_0=(0;\,0),\qquad c_0=(0;\,0)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="x_1W_x=\text{первая строка }W_x,\qquad h_0W_h=0\quad\Rightarrow\quad a=\text{строка 1}+b"></div></foreignObject></g>
<g data-key="G2" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="a_f=x_1W_{xf}+h_0W_{hf}+b_f=\left(0{,}2;\ -0{,}3\right)+\left(1;\ 1\right)=\left(1{,}2;\ 0{,}7\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="f_1=\sigma(a_f)=\left(0{,}7685;\ 0{,}6682\right)"></div></foreignObject></g>
<g data-key="G3" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="a_i=x_1W_{xi}+h_0W_{hi}+b_i=\left(0{,}3;\ 0{,}6\right)+\left(0;\ 0\right)=\left(0{,}3;\ 0{,}6\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="i_1=\sigma(a_i)=\left(0{,}5744;\ 0{,}6457\right)"></div></foreignObject></g>
<g data-key="G4" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="a_g=x_1W_{xg}+h_0W_{hg}+b_g=\left(0{,}5;\ -0{,}4\right)+\left(0{,}1;\ -0{,}1\right)=\left(0{,}6;\ -0{,}5\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="g_1=\tanh(a_g)=\left(0{,}5370;\ -0{,}4621\right)\quad\text{— ровно }h_1\text{ из статьи про RNN}"></div></foreignObject></g>
<g data-key="G5" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="c_1=f_1\odot c_0+i_1\odot g_1=\left(0;\ 0\right)+\left(0{,}5744;\ 0{,}6457\right)\odot\left(0{,}5370;\ -0{,}4621\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="c_1=\left(0{,}3085;\ -0{,}2984\right)"></div></foreignObject></g>
<g data-key="G6" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="a_o=\left(0{,}4;\ 0{,}2\right)+\left(0;\ 0\right)=\left(0{,}4;\ 0{,}2\right),\qquad o_1=\sigma(a_o)=\left(0{,}5987;\ 0{,}5498\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="\tanh(c_1)=\left(0{,}2991;\ -0{,}2898\right)"></div></foreignObject></g>
<g data-key="G7" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="h_1=o_1\odot\tanh(c_1)=\left(0{,}5987;\ 0{,}5498\right)\odot\left(0{,}2991;\ -0{,}2898\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="h_1=\left(0{,}1791;\ -0{,}1594\right)"></div></foreignObject></g>
<g data-key="G8" data-only="1"><foreignObject x="30" y="532" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="z_1=h_1W_{hy}+b_y=\left(0{,}1653;\ -0{,}0851;\ -0{,}0727;\ -0{,}0279\right),\qquad \hat y_1=\left(0{,}2949;\ 0{,}2296;\ 0{,}2324;\ 0{,}2431\right)"></div></foreignObject><foreignObject x="30" y="572" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="l_1=-\ln\hat y_1(\text{you})=-\ln 0{,}2296=1{,}4715"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="cell hin cline G1" data-focus="hin">
      <div class="step-kicker">Шаг 1 · входы</div>
      <h4>На первом такте память пуста</h4>
      <p>На вход пришёл токен ⟨BOS⟩, его one-hot вектор <span class="math-inline" data-tex="x_1=(1;0;0;0)"></span>. Память ещё пуста: <span class="math-inline" data-tex="h_0 = 0"></span> и <span class="math-inline" data-tex="c_0 = 0"></span>. Отсюда два упрощения. Умножение one-hot строки на матрицу выбирает из матрицы одну строку — ту, где стоит единица. А слагаемое <span class="math-inline" data-tex="h_0W_h"></span> равно нулю. Значит, предактивация каждых ворот — это первая строка их матрицы <span class="math-inline" data-tex="W_x"></span> плюс сдвиг.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline forget G2" data-focus="forget">
      <div class="step-kicker">Шаг 2 · ворота забывания</div>
      <h4>f₁: сколько оставить от памяти</h4>
      <p>Строка ⟨BOS⟩ в <span class="math-inline" data-tex="W_{xf}"></span> равна <span class="math-inline" data-tex="(0{,}2;\,-0{,}3)"></span>, сдвиг <span class="math-inline" data-tex="b_f=(1;\,1)"></span>. Сумма <span class="math-inline" data-tex="(1{,}2;\,0{,}7)"></span>, сигмоида даёт <span class="math-inline" data-tex="(0{,}7685;\,0{,}6682)"></span>. Сдвиг 1 выбран нарочно: так ворота с самого начала пропускают около 73 % памяти. Почему так делают, разберём в части 6. На первом такте забывать нечего, <span class="math-inline" data-tex="f_1\odot c_0 = 0"></span> при любом <span class="math-inline" data-tex="f_1"></span>.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline forget input G3" data-focus="input">
      <div class="step-kicker">Шаг 3 · ворота входа</div>
      <h4>i₁: сколько записать</h4>
      <p>Тот же расчёт со своей матрицей: строка <span class="math-inline" data-tex="(0{,}3;\,0{,}6)"></span>, сдвиг 0, после сигмоиды <span class="math-inline" data-tex="(0{,}5744;\,0{,}6457)"></span>. В первую координату памяти запишется 57 % кандидата, во вторую — 65 %.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline forget input cand G4" data-focus="cand">
      <div class="step-kicker">Шаг 4 · кандидат</div>
      <h4>g₁ — это старая ячейка RNN</h4>
      <p>Веса кандидата мы взяли из статьи про RNN: <span class="math-inline" data-tex="W_{xg}=W_{xh}"></span>, <span class="math-inline" data-tex="W_{hg}=W_{hh}"></span>, <span class="math-inline" data-tex="b_g=b_h"></span>. Поэтому <span class="math-inline" data-tex="g_1"></span> совпадает с <span class="math-inline" data-tex="h_1"></span> из той статьи до последней цифры: <span class="math-inline" data-tex="(0{,}5370;\,-0{,}4621)"></span>. LSTM не выбрасывает ячейку RNN, она оставляет её внутри и окружает тремя воротами.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline forget input cand plus G5" data-focus="plus input">
      <div class="step-kicker">Шаг 5 · обновление памяти</div>
      <h4>c₁ = f₁⊙c₀ + i₁⊙g₁</h4>
      <p>Старая память нулевая, поэтому вся <span class="math-inline" data-tex="c_1"></span> — это записанная часть кандидата: <span class="math-inline" data-tex="0{,}5744\cdot0{,}5370 = 0{,}3085"></span> и <span class="math-inline" data-tex="0{,}6457\cdot(-0{,}4621) = -0{,}2984"></span>. Знак <span class="math-inline" data-tex="\odot"></span> — поэлементное произведение: первая координата на первую, вторая на вторую.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline forget input cand plus tanhc ogate G6" data-focus="ogate tanhc">
      <div class="step-kicker">Шаг 6 · ворота выхода</div>
      <h4>o₁ и tanh(c₁)</h4>
      <p>Ворота выхода считаются так же, как остальные: строка <span class="math-inline" data-tex="(0{,}4;\,0{,}2)"></span>, сигмоида, <span class="math-inline" data-tex="\left(0{,}5987;\ 0{,}5498\right)"></span>. Параллельно память сжимается через <span class="math-inline" data-tex="\tanh"></span>: <span class="math-inline" data-tex="\tanh(0{,}3085) = 0{,}2991"></span>, <span class="math-inline" data-tex="\tanh(-0{,}2984) = -0{,}2898"></span>.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline forget input cand plus tanhc ogate hout G7" data-focus="hout">
      <div class="step-kicker">Шаг 7 · выход ячейки</div>
      <h4>h₁ = o₁⊙tanh(c₁)</h4>
      <p>Перемножаем по координатам: <span class="math-inline" data-tex="0{,}5987\cdot0{,}2991 = 0{,}1791"></span> и <span class="math-inline" data-tex="0{,}5498\cdot(-0{,}2898) = -0{,}1594"></span>. Это <span class="math-inline" data-tex="h_1"></span>. Он в три раза меньше, чем <span class="math-inline" data-tex="h_1"></span> у RNN: ворота выхода и ворота входа пропускают примерно по половине, и эти доли перемножаются.</p>
    </div>
    <div class="step-panel" data-on="cell hin cline forget input cand plus tanhc ogate hout yout G8" data-focus="yout">
      <div class="step-kicker">Шаг 8 · ответ такта</div>
      <h4>Выходной слой — тот же, что у RNN</h4>
      <p>Дальше всё как в RNN: <span class="math-inline" data-tex="z_1 = h_1W_{hy}+b_y"></span>, softmax, кросс-энтропия. Правильный следующий токен — you, его вероятность <span class="math-inline" data-tex="0{,}2296"></span>, ошибка такта <span class="math-inline" data-tex="-\ln 0{,}2296 = 1{,}4715"></span>. У RNN на этом такте было 1,9253: разница появилась только потому, что <span class="math-inline" data-tex="h_1"></span> стал другим.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Переключайте шаги кнопками или стрелками ← → на клавиатуре, когда сцена в фокусе.</p>

### Считаем руками: первый такт

<p>
  Повторим расчёт из сцены на бумаге. Каждая координата считается отдельно, поэтому достаточно уметь посчитать
  сигмоиду и <span class="math-inline" data-tex="\tanh"></span> одного числа. На калькуляторе нужна кнопка <span class="math-inline" data-tex="e^x"></span>.
</p>

<div class="worked-example">
<div class="worked-label">Ворота забывания f₁</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="f_1=\sigma\left(x_1W_{xf}+h_0W_{hf}+b_f\right)"></div><div class="worked-trace-note">x₁ = ⟨BOS⟩, h₀ = 0</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">предактивация</div><div class="math-display worked-trace-math" data-tex="a_f=\left(0{,}2;\ -0{,}3\right)+(0;\,0)+(1;\,1)=\left(1{,}2;\ 0{,}7\right)"></div><div class="worked-trace-note">первая строка <span class="math-inline" data-tex="W_{xf}"></span> плюс сдвиг</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">1-я коорд.</div><div class="math-display worked-trace-math" data-tex="\sigma(1{,}2000)=\frac{1}{1+e^{-1{,}2000}}=\frac{1}{1+0{,}3012}=0{,}7685"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">2-я коорд.</div><div class="math-display worked-trace-math" data-tex="\sigma(0{,}7000)=\frac{1}{1+e^{-0{,}7000}}=\frac{1}{1+0{,}4966}=0{,}6682"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Ворота входа i₁ и выхода o₁</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формулы</div><div class="math-display worked-trace-math" data-tex="i_1=\sigma\left(x_1W_{xi}+b_i\right),\qquad o_1=\sigma\left(x_1W_{xo}+b_o\right)"></div><div class="worked-trace-note">слагаемое с h₀ равно нулю</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">i, 1-я</div><div class="math-display worked-trace-math" data-tex="\sigma(0{,}3000)=\frac{1}{1+e^{-0{,}3000}}=\frac{1}{1+0{,}7408}=0{,}5744"></div><div class="worked-trace-note">строка <span class="math-inline" data-tex="W_{xi}"></span>: (0,3; 0,6)</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">i, 2-я</div><div class="math-display worked-trace-math" data-tex="\sigma(0{,}6000)=\frac{1}{1+e^{-0{,}6000}}=\frac{1}{1+0{,}5488}=0{,}6457"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">o, 1-я</div><div class="math-display worked-trace-math" data-tex="\sigma(0{,}4000)=\frac{1}{1+e^{-0{,}4000}}=\frac{1}{1+0{,}6703}=0{,}5987"></div><div class="worked-trace-note">строка <span class="math-inline" data-tex="W_{xo}"></span>: (0,4; 0,2)</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">o, 2-я</div><div class="math-display worked-trace-math" data-tex="\sigma(0{,}2000)=\frac{1}{1+e^{-0{,}2000}}=\frac{1}{1+0{,}8187}=0{,}5498"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Кандидат g₁</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="g_1=\tanh\left(x_1W_{xg}+h_0W_{hg}+b_g\right)"></div><div class="worked-trace-note">те же веса, что у RNN</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">предактивация</div><div class="math-display worked-trace-math" data-tex="a_g=\left(0{,}5;\ -0{,}4\right)+\left(0{,}1;\ -0{,}1\right)=\left(0{,}6;\ -0{,}5\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">1-я коорд.</div><div class="math-display worked-trace-math" data-tex="\tanh(0{,}6000)=\frac{e^{1{,}2000}-1}{e^{1{,}2000}+1}=\frac{2{,}3201}{4{,}3201}=0{,}5370"></div><div class="worked-trace-note"><span class="math-inline" data-tex="\tanh"></span> через экспоненту</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">2-я коорд.</div><div class="math-display worked-trace-math" data-tex="\tanh(-0{,}5000)=\frac{e^{-1{,}0000}-1}{e^{-1{,}0000}+1}=\frac{-0{,}6321}{1{,}3679}=-0{,}4621"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Память c₁ и выход h₁</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула c</div><div class="math-display worked-trace-math" data-tex="c_1=f_1\odot c_0+i_1\odot g_1"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">числа c</div><div class="math-display worked-trace-math" data-tex="c_1=0+\left(0{,}5744\cdot0{,}5370;\ 0{,}6457\cdot(-0{,}4621)\right)=\left(0{,}3085;\ -0{,}2984\right)"></div><div class="worked-trace-note">c₀ = 0, забывать нечего</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">tanh c</div><div class="math-display worked-trace-math" data-tex="\tanh(c_1)=\left(\tanh 0{,}3085;\ \tanh(-0{,}2984)\right)=\left(0{,}2991;\ -0{,}2898\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">формула h</div><div class="math-display worked-trace-math" data-tex="h_1=o_1\odot\tanh(c_1)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">числа h</div><div class="math-display worked-trace-math" data-tex="h_1=\left(0{,}5987\cdot0{,}2991;\ 0{,}5498\cdot(-0{,}2898)\right)=\left(0{,}1791;\ -0{,}1594\right)"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Ответ первого такта</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="z_1=h_1W_{hy}+b_y,\qquad \hat y_1=\operatorname{softmax}(z_1),\qquad l_1=-\ln\hat y_1(\text{you})"></div><div class="worked-trace-note">выходной слой RNN</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">z, you</div><div class="math-display worked-trace-math" data-tex="z_1(\text{you})=0{,}1791\cdot(-0{,}5)+(-0{,}1594)\cdot0{,}6+0{,}1=-0{,}0851"></div><div class="worked-trace-note">второй столбец <span class="math-inline" data-tex="W_{hy}"></span></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">все z</div><div class="math-display worked-trace-math" data-tex="z_1=\left(0{,}1653;\ -0{,}0851;\ -0{,}0727;\ -0{,}0279\right)"></div><div class="worked-trace-note">так же для трёх других столбцов</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">экспоненты</div><div class="math-display worked-trace-math" data-tex="e^{z_1}=\left(1{,}1797;\ 0{,}9184;\ 0{,}9299;\ 0{,}9725\right),\qquad \textstyle\sum=  4{,}0004"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">вероятность</div><div class="math-display worked-trace-math" data-tex="\hat y_1(\text{you})=\frac{0{,}9184}{4{,}0004}=0{,}2296"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">ошибка</div><div class="math-display worked-trace-math" data-tex="l_1=-\ln 0{,}2296=1{,}4715"></div><div class="worked-trace-note">у RNN на этом такте было 1,9253</div></div>
</div>
<p class="worked-reading">Логиты почти равны, и вероятности близки к 1/4: малое <span class="math-inline" data-tex="h_1"></span> мало сдвигает выход. Обучение как раз и должно сделать <span class="math-inline" data-tex="h"></span> информативным.</p>
</div>

## Часть 4. Forward на всей фразе

<div class="stage" id="stageUnroll" tabindex="0">
  <div class="stage-figure">
<svg id="lsU" viewBox="0 0 960 640" role="img" aria-label="Развёртка LSTM на три такта с числами прямого прохода"><style>#lsU { font-family: Helvetica, Arial, sans-serif; }</style><defs><marker id="lsU-g" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/></marker><marker id="lsU-b" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#3576C0"/></marker><marker id="lsU-r" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C30B0A"/></marker><marker id="lsU-y" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C29E08"/></marker><marker id="lsU-n" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#73B222"/></marker></defs>
<g data-key="lines"><path d="M 24 200 L 936 200" fill="none" stroke="#3576C0" stroke-width="3.4" marker-end="url(#lsU-b)" stroke-linejoin="round"/><path d="M 24 380 L 936 380" fill="none" stroke="#73B222" stroke-width="2.6" marker-end="url(#lsU-n)" stroke-linejoin="round"/></g>
<g data-key="c0"><text x="62" y="222" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="400">(0; 0)</text><text x="62" y="402" font-size="13" fill="#5A8C1C" text-anchor="middle" font-weight="400">(0; 0)</text><text x="62" y="172" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">c₀</text><text x="62" y="352" font-size="14" fill="#5A8C1C" text-anchor="middle" font-weight="700">h₀</text></g>
<g data-key="cell1"><rect x="110" y="165" width="180" height="245" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="2"/><text x="120" y="183" font-size="11.5" fill="#5A8C1C" text-anchor="start" font-weight="700" letter-spacing="0.06em">ТАКТ 1</text><text x="132" y="238" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">f</text><text x="194" y="238" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,7685</text><text x="255" y="238" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,6682</text><text x="132" y="265" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">i</text><text x="194" y="265" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,5744</text><text x="255" y="265" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,6457</text><text x="132" y="292" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">g</text><text x="194" y="292" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,5370</text><text x="255" y="292" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">−0,4621</text><text x="132" y="319" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">o</text><text x="194" y="319" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,5987</text><text x="255" y="319" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,5498</text><text x="200" y="346" font-size="11.5" fill="#5E5850" text-anchor="middle" font-weight="400">c = f⊙c + i⊙g</text><text x="200" y="362" font-size="11.5" fill="#5E5850" text-anchor="middle" font-weight="400">h = o⊙tanh c</text><path d="M 140 452 L 140 414" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsU-g)" stroke-linejoin="round"/><text x="140" y="472" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">x₁ = ⟨BOS⟩</text></g>
<g data-key="out1"><path d="M 284 380 L 284 126" fill="none" stroke="#73B222" stroke-width="2" marker-end="url(#lsU-n)" stroke-linejoin="round"/><rect x="102" y="46" width="196" height="80" rx="10" fill="#FFFFFF" stroke="#73B222" stroke-width="2"/><text x="200" y="70" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">цель: you</text><text x="200" y="94" font-size="14" fill="#5A8C1C" text-anchor="middle" font-weight="700">ŷ(you) = 0,2296</text><text x="200" y="116" font-size="14" fill="#A30908" text-anchor="middle" font-weight="700">l₁ = 1,4715</text></g>
<g data-key="v1"><text x="340" y="172" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">c₁</text><text x="340" y="222" font-size="12.5" fill="#2A5E9B" text-anchor="middle" font-weight="400">0,3085</text><text x="340" y="238" font-size="12.5" fill="#2A5E9B" text-anchor="middle" font-weight="400">−0,2984</text><text x="340" y="352" font-size="14" fill="#5A8C1C" text-anchor="middle" font-weight="700">h₁</text><text x="340" y="402" font-size="12.5" fill="#5A8C1C" text-anchor="middle" font-weight="400">0,1791</text><text x="340" y="418" font-size="12.5" fill="#5A8C1C" text-anchor="middle" font-weight="400">−0,1594</text></g>
<g data-key="cell2"><rect x="390" y="165" width="180" height="245" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="2"/><text x="400" y="183" font-size="11.5" fill="#5A8C1C" text-anchor="start" font-weight="700" letter-spacing="0.06em">ТАКТ 2</text><text x="412" y="238" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">f</text><text x="474" y="238" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,6650</text><text x="535" y="238" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,8155</text><text x="412" y="265" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">i</text><text x="474" y="265" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,6271</text><text x="535" y="265" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,4340</text><text x="412" y="292" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">g</text><text x="474" y="292" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,3414</text><text x="535" y="292" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,5944</text><text x="412" y="319" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">o</text><text x="474" y="319" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,5086</text><text x="535" y="319" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,4304</text><text x="480" y="346" font-size="11.5" fill="#5E5850" text-anchor="middle" font-weight="400">c = f⊙c + i⊙g</text><text x="480" y="362" font-size="11.5" fill="#5E5850" text-anchor="middle" font-weight="400">h = o⊙tanh c</text><path d="M 420 452 L 420 414" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsU-g)" stroke-linejoin="round"/><text x="420" y="472" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">x₂ = you</text></g>
<g data-key="out2"><path d="M 564 380 L 564 126" fill="none" stroke="#73B222" stroke-width="2" marker-end="url(#lsU-n)" stroke-linejoin="round"/><rect x="382" y="46" width="196" height="80" rx="10" fill="#FFFFFF" stroke="#73B222" stroke-width="2"/><text x="480" y="70" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">цель: will</text><text x="480" y="94" font-size="14" fill="#5A8C1C" text-anchor="middle" font-weight="700">ŷ(will) = 0,2367</text><text x="480" y="116" font-size="14" fill="#A30908" text-anchor="middle" font-weight="700">l₂ = 1,4410</text></g>
<g data-key="v2"><text x="620" y="172" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">c₂</text><text x="620" y="222" font-size="12.5" fill="#2A5E9B" text-anchor="middle" font-weight="400">0,4193</text><text x="620" y="238" font-size="12.5" fill="#2A5E9B" text-anchor="middle" font-weight="400">0,0147</text><text x="620" y="352" font-size="14" fill="#5A8C1C" text-anchor="middle" font-weight="700">h₂</text><text x="620" y="402" font-size="12.5" fill="#5A8C1C" text-anchor="middle" font-weight="400">0,2015</text><text x="620" y="418" font-size="12.5" fill="#5A8C1C" text-anchor="middle" font-weight="400">0,0063</text></g>
<g data-key="cell3"><rect x="670" y="165" width="180" height="245" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="2"/><text x="680" y="183" font-size="11.5" fill="#5A8C1C" text-anchor="start" font-weight="700" letter-spacing="0.06em">ТАКТ 3</text><text x="692" y="238" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">f</text><text x="754" y="238" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,8401</text><text x="815" y="238" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,7543</text><text x="692" y="265" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">i</text><text x="754" y="265" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,6085</text><text x="815" y="265" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,5204</text><text x="692" y="292" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">g</text><text x="754" y="292" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">−0,3959</text><text x="815" y="292" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,1614</text><text x="692" y="319" font-size="15" fill="#8C7106" text-anchor="middle" font-weight="700">o</text><text x="754" y="319" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,4456</text><text x="815" y="319" font-size="13.5" fill="#111111" text-anchor="middle" font-weight="400">0,6320</text><text x="760" y="346" font-size="11.5" fill="#5E5850" text-anchor="middle" font-weight="400">c = f⊙c + i⊙g</text><text x="760" y="362" font-size="11.5" fill="#5E5850" text-anchor="middle" font-weight="400">h = o⊙tanh c</text><path d="M 700 452 L 700 414" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsU-g)" stroke-linejoin="round"/><text x="700" y="472" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">x₃ = will</text></g>
<g data-key="out3"><path d="M 844 380 L 844 126" fill="none" stroke="#73B222" stroke-width="2" marker-end="url(#lsU-n)" stroke-linejoin="round"/><rect x="662" y="46" width="196" height="80" rx="10" fill="#FFFFFF" stroke="#73B222" stroke-width="2"/><text x="760" y="70" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">цель: pass</text><text x="760" y="94" font-size="14" fill="#5A8C1C" text-anchor="middle" font-weight="700">ŷ(pass) = 0,2598</text><text x="760" y="116" font-size="14" fill="#A30908" text-anchor="middle" font-weight="700">l₃ = 1,3480</text></g>
<g data-key="v3"><text x="896" y="172" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">c₃</text><text x="896" y="222" font-size="12.5" fill="#2A5E9B" text-anchor="middle" font-weight="400">0,1113</text><text x="896" y="238" font-size="12.5" fill="#2A5E9B" text-anchor="middle" font-weight="400">0,0951</text><text x="896" y="352" font-size="14" fill="#5A8C1C" text-anchor="middle" font-weight="700">h₃</text><text x="896" y="402" font-size="12.5" fill="#5A8C1C" text-anchor="middle" font-weight="400">0,0494</text><text x="896" y="418" font-size="12.5" fill="#5A8C1C" text-anchor="middle" font-weight="400">0,0599</text></g>
<rect x="20" y="500" width="920" height="132" rx="10" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
<g data-key="U1" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="c_t=f_t\odot c_{t-1}+i_t\odot g_t,\qquad h_t=o_t\odot\tanh(c_t),\qquad t=1{,}2,3"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="\text{веса }W_x,W_h,b\text{ общие для всех тактов; меняются только }x_t,\ c_{t-1},\ h_{t-1}"></div></foreignObject></g>
<g data-key="U2" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="c_1=f_1\odot\left(0;\ 0\right)+\left(0{,}5744;\ 0{,}6457\right)\odot\left(0{,}5370;\ -0{,}4621\right)=\left(0{,}3085;\ -0{,}2984\right)"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="h_1=\left(0{,}5987;\ 0{,}5498\right)\odot\tanh(c_1)=\left(0{,}1791;\ -0{,}1594\right),\qquad l_1=1{,}4715"></div></foreignObject></g>
<g data-key="U3" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="c_2=\left(0{,}6650;\ 0{,}8155\right)\odot\left(0{,}3085;\ -0{,}2984\right)+\left(0{,}6271;\ 0{,}4340\right)\odot\left(0{,}3414;\ 0{,}5944\right)"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="c_2=\left(0{,}2052;\ -0{,}2433\right)+\left(0{,}2141;\ 0{,}2580\right)=\left(0{,}4193;\ 0{,}0147\right)"></div></foreignObject></g>
<g data-key="U4" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="c_3=\left(0{,}8401;\ 0{,}7543\right)\odot\left(0{,}4193;\ 0{,}0147\right)+\left(0{,}6085;\ 0{,}5204\right)\odot\left(-0{,}3959;\ 0{,}1614\right)"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="c_3=\left(0{,}3522;\ 0{,}0111\right)+\left(-0{,}2409;\ 0{,}0840\right)=\left(0{,}1113;\ 0{,}0951\right)"></div></foreignObject></g>
<g data-key="U5" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="\mathcal L=\tfrac13\left(l_1+l_2+l_3\right)=\tfrac13\left(1{,}4715+1{,}4410+1{,}3480\right)=1{,}4202"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111" data-tex="\text{у RNN с тем же кандидатом и выходным слоем: }\mathcal L=1{,}5192"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="lines c0 cell1 cell2 cell3 out1 out2 out3 v1 v2 v3 U1" data-focus="lines">
      <div class="step-kicker">Шаг 1 · развёртка</div>
      <h4>Три копии одной ячейки</h4>
      <p>Развернём LSTM на три такта, как разворачивали RNN. Сверху идёт линия памяти <span class="math-inline" data-tex="c"></span>, снизу — линия выхода <span class="math-inline" data-tex="h"></span>. Внутри каждого такта — значения четырёх слоёв: ворот <span class="math-inline" data-tex="f"></span>, <span class="math-inline" data-tex="i"></span>, <span class="math-inline" data-tex="o"></span> и кандидата <span class="math-inline" data-tex="g"></span> (две координаты, потому что <span class="math-inline" data-tex="H = 2"></span>). Над тактами — вероятность правильного следующего токена и ошибка такта.</p>
    </div>
    <div class="step-panel" data-on="lines c0 cell1 out1 v1 U2" data-focus="cell1 v1">
      <div class="step-kicker">Шаг 2 · такт 1</div>
      <h4>Первый такт мы уже посчитали</h4>
      <p>Это числа из предыдущей сцены: память пуста, поэтому <span class="math-inline" data-tex="c_1 = i_1\odot g_1"></span>. Справа от такта — то, что уходит дальше: <span class="math-inline" data-tex="c_1"></span> по верхней линии и <span class="math-inline" data-tex="h_1"></span> по нижней.</p>
    </div>
    <div class="step-panel" data-on="lines c0 cell1 cell2 out2 v1 v2 U3" data-focus="cell2 v2">
      <div class="step-kicker">Шаг 3 · такт 2</div>
      <h4>На втором такте работает забывание</h4>
      <p>Теперь <span class="math-inline" data-tex="c_1 \ne 0"></span>, и ворота забывания начинают влиять: от первой координаты памяти остаётся <span class="math-inline" data-tex="0{,}665"></span>, от второй — <span class="math-inline" data-tex="0{,}8155"></span>. Второе слагаемое — новая запись, <span class="math-inline" data-tex="i_2\odot g_2"></span>. Во вторую координату ворота записали <span class="math-inline" data-tex="0{,}2580"></span>, а старая память там была <span class="math-inline" data-tex="-0{,}2984\cdot0{,}8155 = -0{,}2433"></span>; они почти погасили друг друга, <span class="math-inline" data-tex="c_2"></span> по этой координате всего <span class="math-inline" data-tex="0{,}0147"></span>.</p><p>Ворота теперь видят и <span class="math-inline" data-tex="h_1"></span>: в предактивации появилось слагаемое <span class="math-inline" data-tex="h_1W_h"></span>. Как оно считается, разберём руками ниже.</p>
    </div>
    <div class="step-panel" data-on="lines c0 cell1 cell2 cell3 out3 v2 v3 U4" data-focus="cell3 v3">
      <div class="step-kicker">Шаг 4 · такт 3</div>
      <h4>Третий такт — тот же расчёт</h4>
      <p>Ворота забывания на третьем такте <span class="math-inline" data-tex="(0{,}8401;\,0{,}7543)"></span>: память в основном сохраняется. Кандидат по первой координате отрицательный, <span class="math-inline" data-tex="-0{,}3959"></span>, и запись <span class="math-inline" data-tex="i_3\odot g_3"></span> уменьшает память с <span class="math-inline" data-tex="0{,}3522"></span> до <span class="math-inline" data-tex="0{,}1113"></span>.</p>
    </div>
    <div class="step-panel" data-on="lines c0 cell1 cell2 cell3 out1 out2 out3 v1 v2 v3 U5" data-focus="out1 out2 out3">
      <div class="step-kicker">Шаг 5 · ошибка</div>
      <h4>Потеря — среднее трёх тактов</h4>
      <p>Ошибка последовательности считается так же, как у RNN: среднее кросс-энтропий по тактам. Вышло <span class="math-inline" data-tex="1{,}4202"></span> против <span class="math-inline" data-tex="1{,}5192"></span> у RNN. Делать из этого вывод о качестве LSTM нельзя: веса ворот мы выбрали сами, сеть ничему не училась. Сравнивать архитектуры имеет смысл только после обучения, как в части 1.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Переключайте шаги кнопками или стрелками ← → на клавиатуре, когда сцена в фокусе.</p>

### Считаем руками: второй такт

<p>
  На втором такте <span class="math-inline" data-tex="h_1 \ne 0"></span>, и в предактивации появляется слагаемое <span class="math-inline" data-tex="h_1W_h"></span>: строка из двух чисел умножается на матрицу <span class="math-inline" data-tex="2\times2"></span>.
  Каждая координата результата — сумма двух произведений: первая координата <span class="math-inline" data-tex="h_1"></span> на элемент первой строки плюс вторая координата
  на элемент второй строки того же столбца. Вход <span class="math-inline" data-tex="x_2"></span> = you выбирает из <span class="math-inline" data-tex="W_x"></span> вторую строку.
</p>

<div class="worked-example">
<div class="worked-label">Ворота забывания — f₂</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="a_f=x_2W_{xf}+h_1W_{hf}+b_f,\qquad f_2=\sigma(a_f)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">x₂W_x</div><div class="math-display worked-trace-math" data-tex="x_2W_{xf}=\left(-0{,}4;\ 0{,}5\right)"></div><div class="worked-trace-note">вторая строка матрицы</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">h₁W_h</div><div class="math-display worked-trace-math" data-tex="h_1W_{hf}=\left(0{,}1791\cdot0{,}3+(-0{,}1594)\cdot-0{,}2;\ 0{,}1791\cdot0{,}1+(-0{,}1594)\cdot0{,}2\right)=\left(0{,}0856;\ -0{,}0140\right)"></div><div class="worked-trace-note"><span class="math-inline" data-tex="W_{hf}=\begin{bmatrix}0{,}3&amp;0{,}1\\-0{,}2&amp;0{,}2\end{bmatrix}"></span></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">сумма</div><div class="math-display worked-trace-math" data-tex="a_f=\left(-0{,}4;\ 0{,}5\right)+\left(0{,}0856;\ -0{,}0140\right)+\left(1{,}0;\ 1{,}0\right)=\left(0{,}6856;\ 1{,}4860\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">значение</div><div class="math-display worked-trace-math" data-tex="f_2=\sigma\,\left(0{,}6856;\ 1{,}4860\right)=\left(0{,}6650;\ 0{,}8155\right)"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Ворота входа — i₂</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="a_i=x_2W_{xi}+h_1W_{hi}+b_i,\qquad i_2=\sigma(a_i)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">x₂W_x</div><div class="math-display worked-trace-math" data-tex="x_2W_{xi}=\left(0{,}5;\ -0{,}2\right)"></div><div class="worked-trace-note">вторая строка матрицы</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">h₁W_h</div><div class="math-display worked-trace-math" data-tex="h_1W_{hi}=\left(0{,}1791\cdot0{,}2+(-0{,}1594)\cdot0{,}1;\ 0{,}1791\cdot-0{,}1+(-0{,}1594)\cdot0{,}3\right)=\left(0{,}0199;\ -0{,}0657\right)"></div><div class="worked-trace-note"><span class="math-inline" data-tex="W_{hi}=\begin{bmatrix}0{,}2&amp;-0{,}1\\0{,}1&amp;0{,}3\end{bmatrix}"></span></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">сумма</div><div class="math-display worked-trace-math" data-tex="a_i=\left(0{,}5;\ -0{,}2\right)+\left(0{,}0199;\ -0{,}0657\right)+\left(0{,}0;\ 0{,}0\right)=\left(0{,}5199;\ -0{,}2657\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">значение</div><div class="math-display worked-trace-math" data-tex="i_2=\sigma\,\left(0{,}5199;\ -0{,}2657\right)=\left(0{,}6271;\ 0{,}4340\right)"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Кандидат — g₂</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="a_g=x_2W_{xg}+h_1W_{hg}+b_g,\qquad g_2=\tanh(a_g)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">x₂W_x</div><div class="math-display worked-trace-math" data-tex="x_2W_{xg}=\left(0{,}2;\ 0{,}9\right)"></div><div class="worked-trace-note">вторая строка матрицы</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">h₁W_h</div><div class="math-display worked-trace-math" data-tex="h_1W_{hg}=\left(0{,}1791\cdot0{,}4+(-0{,}1594)\cdot0{,}1;\ 0{,}1791\cdot-0{,}2+(-0{,}1594)\cdot0{,}5\right)=\left(0{,}0557;\ -0{,}1155\right)"></div><div class="worked-trace-note"><span class="math-inline" data-tex="W_{hg}=\begin{bmatrix}0{,}4&amp;-0{,}2\\0{,}1&amp;0{,}5\end{bmatrix}"></span></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">сумма</div><div class="math-display worked-trace-math" data-tex="a_g=\left(0{,}2;\ 0{,}9\right)+\left(0{,}0557;\ -0{,}1155\right)+\left(0{,}1;\ -0{,}1\right)=\left(0{,}3557;\ 0{,}6845\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">значение</div><div class="math-display worked-trace-math" data-tex="g_2=\tanh\,\left(0{,}3557;\ 0{,}6845\right)=\left(0{,}3414;\ 0{,}5944\right)"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Ворота выхода — o₂</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="a_o=x_2W_{xo}+h_1W_{ho}+b_o,\qquad o_2=\sigma(a_o)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">x₂W_x</div><div class="math-display worked-trace-math" data-tex="x_2W_{xo}=\left(0{,}1;\ -0{,}3\right)"></div><div class="worked-trace-note">вторая строка матрицы</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">h₁W_h</div><div class="math-display worked-trace-math" data-tex="h_1W_{ho}=\left(0{,}1791\cdot-0{,}1+(-0{,}1594)\cdot0{,}3;\ 0{,}1791\cdot0{,}2+(-0{,}1594)\cdot0{,}1\right)=\left(-0{,}0657;\ 0{,}0199\right)"></div><div class="worked-trace-note"><span class="math-inline" data-tex="W_{ho}=\begin{bmatrix}-0{,}1&amp;0{,}2\\0{,}3&amp;0{,}1\end{bmatrix}"></span></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">сумма</div><div class="math-display worked-trace-math" data-tex="a_o=\left(0{,}1;\ -0{,}3\right)+\left(-0{,}0657;\ 0{,}0199\right)+\left(0{,}0;\ 0{,}0\right)=\left(0{,}0343;\ -0{,}2801\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">значение</div><div class="math-display worked-trace-math" data-tex="o_2=\sigma\,\left(0{,}0343;\ -0{,}2801\right)=\left(0{,}5086;\ 0{,}4304\right)"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Память и выход второго такта</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула c</div><div class="math-display worked-trace-math" data-tex="c_2=f_2\odot c_1+i_2\odot g_2"></div><div class="worked-trace-note">сначала забываем, потом записываем</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">забыли</div><div class="math-display worked-trace-math" data-tex="f_2\odot c_1=\left(0{,}6650\cdot0{,}3085;\ 0{,}8155\cdot(-0{,}2984)\right)=\left(0{,}2052;\ -0{,}2433\right)"></div><div class="worked-trace-note">старая память, ослабленная</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">записали</div><div class="math-display worked-trace-math" data-tex="i_2\odot g_2=\left(0{,}6271\cdot0{,}3414;\ 0{,}4340\cdot0{,}5944\right)=\left(0{,}2141;\ 0{,}2580\right)"></div><div class="worked-trace-note">новая порция</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">c₂</div><div class="math-display worked-trace-math" data-tex="c_2=\left(0{,}2052;\ -0{,}2433\right)+\left(0{,}2141;\ 0{,}2580\right)=\left(0{,}4193;\ 0{,}0147\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">h₂</div><div class="math-display worked-trace-math" data-tex="h_2=o_2\odot\tanh(c_2)=\left(0{,}5086;\ 0{,}4304\right)\odot\left(0{,}3963;\ 0{,}0147\right)=\left(0{,}2015;\ 0{,}0063\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">ошибка</div><div class="math-display worked-trace-math" data-tex="\hat y_2(\text{will})=0{,}2367,\qquad l_2=-\ln0{,}2367=1{,}4410"></div><div class="worked-trace-note">у RNN было 1,3120</div></div>
</div>
<p class="worked-reading">Во второй координате старая память и новая запись разного знака и почти равны по модулю, поэтому <span class="math-inline" data-tex="c_2"></span> там почти ноль. Так ворота «переписывают» координату: забывают старое и кладут новое.</p>
</div>

<p>Третий такт считается так же. Все значения прямого прохода — в одной таблице.</p>

<div class="lstm-table"><table class="shape-table">
  <tr><th>величина</th><th>такт 1 · ⟨BOS⟩</th><th>такт 2 · you</th><th>такт 3 · will</th></tr>
  <tr><td>ворота забывания <span class="math-inline" data-tex="f_t"></span></td><td>(0,7685; 0,6682)</td><td>(0,6650; 0,8155)</td><td>(0,8401; 0,7543)</td></tr>
  <tr><td>ворота входа <span class="math-inline" data-tex="i_t"></span></td><td>(0,5744; 0,6457)</td><td>(0,6271; 0,4340)</td><td>(0,6085; 0,5204)</td></tr>
  <tr><td>кандидат <span class="math-inline" data-tex="g_t"></span></td><td>(0,5370; −0,4621)</td><td>(0,3414; 0,5944)</td><td>(−0,3959; 0,1614)</td></tr>
  <tr><td>ворота выхода <span class="math-inline" data-tex="o_t"></span></td><td>(0,5987; 0,5498)</td><td>(0,5086; 0,4304)</td><td>(0,4456; 0,6320)</td></tr>
  <tr><td><span class="math-inline" data-tex="f_t\odot c_{t-1}"></span></td><td>(0,0000; 0,0000)</td><td>(0,2052; −0,2433)</td><td>(0,3522; 0,0111)</td></tr>
  <tr><td><span class="math-inline" data-tex="i_t\odot g_t"></span></td><td>(0,3085; −0,2984)</td><td>(0,2141; 0,2580)</td><td>(−0,2409; 0,0840)</td></tr>
  <tr><td>память <span class="math-inline" data-tex="c_t"></span></td><td>(0,3085; −0,2984)</td><td>(0,4193; 0,0147)</td><td>(0,1113; 0,0951)</td></tr>
  <tr><td><span class="math-inline" data-tex="\tanh c_t"></span></td><td>(0,2991; −0,2898)</td><td>(0,3963; 0,0147)</td><td>(0,1109; 0,0948)</td></tr>
  <tr><td>выход <span class="math-inline" data-tex="h_t"></span></td><td>(0,1791; −0,1594)</td><td>(0,2015; 0,0063)</td><td>(0,0494; 0,0599)</td></tr>
  <tr><td><span class="math-inline" data-tex="\hat y_t"></span>(цель)</td><td>0,2296 (you)</td><td>0,2367 (will)</td><td>0,2598 (pass)</td></tr>
  <tr><td>ошибка <span class="math-inline" data-tex="l_t"></span></td><td>1,4715</td><td>1,4410</td><td>1,3480</td></tr>
  <tr><td>ошибка RNN</td><td>1,9253</td><td>1,3120</td><td>1,3204</td></tr>
</table></div>

### Что forward обязан запомнить

<p>
  Для обратного прохода на каждом такте нужны: вход <span class="math-inline" data-tex="x_t"></span>, прошлые <span class="math-inline" data-tex="h_{t-1}"></span> и <span class="math-inline" data-tex="c_{t-1}"></span>, значения четырёх слоёв
  <span class="math-inline" data-tex="f_t, i_t, g_t, o_t"></span>, память <span class="math-inline" data-tex="c_t"></span> и <span class="math-inline" data-tex="\tanh c_t"></span>. У RNN хватало <span class="math-inline" data-tex="x_t"></span> и <span class="math-inline" data-tex="h_t"></span>. Поэтому LSTM на длинной последовательности
  занимает в памяти видеокарты примерно в пять раз больше, чем RNN того же размера: это ещё одна причина для усечённого
  BPTT из статьи про RNN.
</p>

## Часть 5. Обратный проход во времени

<p>
  У RNN назад шёл один поток, <span class="math-inline" data-tex="dh_t"></span>. У LSTM их два: <span class="math-inline" data-tex="dh_t"></span> по нижней линии и <span class="math-inline" data-tex="dc_t"></span> по верхней. Всю рекурсию задают
  шесть строк. Здесь <span class="math-inline" data-tex="da_{k,t}"></span> — градиент по предактивации слоя <span class="math-inline" data-tex="k"></span> на такте <span class="math-inline" data-tex="t"></span>, то есть по сумме до сигмоиды или <span class="math-inline" data-tex="\tanh"></span>.
</p>

<div class="math-display" data-tex="\begin{aligned}
dh_t&amp;=dz_tW_{hy}^{\top}+\textstyle\sum_{k}da_{k,t+1}W_{hk}^{\top}&amp;&amp;\text{своё + из такта }t+1\\
dc_t&amp;=dh_t\odot o_t\odot\left(1-\tanh^2c_t\right)+dc_{t+1}\odot f_{t+1}&amp;&amp;\text{через }h_t\text{ + по линии памяти}\\
da_{o,t}&amp;=dh_t\odot\tanh c_t\odot o_t(1-o_t)\\
da_{f,t}&amp;=dc_t\odot c_{t-1}\odot f_t(1-f_t)\\
da_{i,t}&amp;=dc_t\odot g_t\odot i_t(1-i_t)\\
da_{g,t}&amp;=dc_t\odot i_t\odot\left(1-g_t^2\right)
\end{aligned}"></div>

<p>
  Каждая строка — цепное правило для одной из шести формул прямого прохода, прочитанной справа налево. Вторая строка
  главная: у <span class="math-inline" data-tex="dc_t"></span> два слагаемых, и второе — <span class="math-inline" data-tex="dc_{t+1}\odot f_{t+1}"></span> — это тот самый путь, где нет ни матрицы, ни
  производной <span class="math-inline" data-tex="\tanh"></span>.
</p>

<div class="callout-blue">
<p><strong>Справка: производные, которые понадобятся</strong></p>
<p>
  Производная говорит, во сколько раз изменится выход, если чуть-чуть сдвинуть вход. Для трёх функций ячейки она выражается
  через уже посчитанное значение, поэтому на обратном проходе ничего не нужно считать заново:
</p>
<ul>
  <li>сигмоида: <span class="math-inline" data-tex="\sigma' = \sigma(1-\sigma)"></span>; для <span class="math-inline" data-tex="f = 0{,}8401"></span> это <span class="math-inline" data-tex="0{,}8401\cdot0{,}1599 = 0{,}1343"></span>;</li>
  <li><span class="math-inline" data-tex="\tanh"></span>: <span class="math-inline" data-tex="\tanh' = 1-\tanh^2"></span>; для <span class="math-inline" data-tex="\tanh c = 0{,}1109"></span> это <span class="math-inline" data-tex="1 - 0{,}0123 = 0{,}9877"></span>;</li>
  <li>произведение <span class="math-inline" data-tex="u\odot v"></span>: производная по <span class="math-inline" data-tex="u"></span> равна <span class="math-inline" data-tex="v"></span>, по <span class="math-inline" data-tex="v"></span> равна <span class="math-inline" data-tex="u"></span>. Так <span class="math-inline" data-tex="c_t = f_t\odot c_{t-1} + \ldots"></span> даёт
  градиент по <span class="math-inline" data-tex="f_t"></span>, равный <span class="math-inline" data-tex="dc_t \odot c_{t-1}"></span>.</li>
</ul>
<p>
  Обозначение <span class="math-inline" data-tex="dX"></span> — градиент потери по <span class="math-inline" data-tex="X"></span>, той же формы, что <span class="math-inline" data-tex="X"></span>.
</p>
</div>

<div class="stage" id="stageBack" tabindex="0">
  <div class="stage-figure">
<svg id="lsB" viewBox="0 0 960 640" role="img" aria-label="Обратный проход по развёрнутой LSTM: градиенты по тактам"><style>#lsB { font-family: Helvetica, Arial, sans-serif; }</style><defs><marker id="lsB-g" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/></marker><marker id="lsB-b" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#3576C0"/></marker><marker id="lsB-r" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C30B0A"/></marker><marker id="lsB-y" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C29E08"/></marker><marker id="lsB-n" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#73B222"/></marker></defs>
<g data-key="lines"><path d="M 24 200 L 936 200" fill="none" stroke="#3576C0" stroke-width="3.4" marker-end="url(#lsB-b)" stroke-linejoin="round"/><path d="M 24 380 L 936 380" fill="none" stroke="#73B222" stroke-width="2.6" marker-end="url(#lsB-n)" stroke-linejoin="round"/></g>
<g data-key="c0"><text x="62" y="222" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="400">(0; 0)</text><text x="62" y="402" font-size="13" fill="#5A8C1C" text-anchor="middle" font-weight="400">(0; 0)</text><text x="62" y="172" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">c₀</text><text x="62" y="352" font-size="14" fill="#5A8C1C" text-anchor="middle" font-weight="700">h₀</text></g>
<g data-key="cell1"><rect x="110" y="165" width="180" height="245" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="2"/><text x="120" y="183" font-size="11.5" fill="#5A8C1C" text-anchor="start" font-weight="700" letter-spacing="0.06em">ТАКТ 1</text><text x="136" y="228" font-size="13.5" fill="#5A8C1C" text-anchor="middle" font-weight="700">dh</text><text x="202" y="228" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,2187</text><text x="260" y="228" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,2021</text><text x="136" y="252" font-size="13.5" fill="#2A5E9B" text-anchor="middle" font-weight="700">dc</text><text x="202" y="252" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0595</text><text x="260" y="252" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,1439</text><text x="136" y="276" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_f</text><text x="202" y="276" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0000</text><text x="260" y="276" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0000</text><text x="136" y="300" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_i</text><text x="202" y="300" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0078</text><text x="260" y="300" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0152</text><text x="136" y="324" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_g</text><text x="202" y="324" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0243</text><text x="260" y="324" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0731</text><text x="136" y="348" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_o</text><text x="202" y="348" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0157</text><text x="260" y="348" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0145</text><path d="M 140 452 L 140 414" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsB-g)" stroke-linejoin="round"/><text x="140" y="472" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">x₁ = ⟨BOS⟩</text></g>
<g data-key="out1"><path d="M 284 380 L 284 126" fill="none" stroke="#73B222" stroke-width="2" marker-end="url(#lsB-n)" stroke-linejoin="round"/><rect x="102" y="46" width="196" height="80" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-width="2"/><text x="200" y="68" font-size="13" fill="#A30908" text-anchor="middle" font-weight="700">dz₁ = (ŷ − y) / 3</text><text x="200" y="92" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,098; −0,257;</text><text x="200" y="113" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,077; 0,081</text></g>
<g data-key="v1"><path d="M 366 216 L 314 216" fill="none" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lsB-r)" stroke-linejoin="round"/><text x="340" y="236" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="400">−0,0597</text><text x="340" y="252" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="400">−0,0421</text><text x="340" y="188" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="700">dc⊙f</text><path d="M 366 364 L 314 364" fill="none" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lsB-r)" stroke-linejoin="round"/><text x="340" y="338" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="400">−0,0174</text><text x="340" y="354" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="400">−0,0194</text><text x="340" y="402" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="700">Σ da·Wₕᵀ</text></g>
<g data-key="cell2"><rect x="390" y="165" width="180" height="245" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="2"/><text x="400" y="183" font-size="11.5" fill="#5A8C1C" text-anchor="start" font-weight="700" letter-spacing="0.06em">ТАКТ 2</text><text x="416" y="228" font-size="13.5" fill="#5A8C1C" text-anchor="middle" font-weight="700">dh</text><text x="482" y="228" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,1971</text><text x="540" y="228" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0185</text><text x="416" y="252" font-size="13.5" fill="#2A5E9B" text-anchor="middle" font-weight="700">dc</text><text x="482" y="252" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0898</text><text x="540" y="252" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0516</text><text x="416" y="276" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_f</text><text x="482" y="276" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0062</text><text x="540" y="276" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0023</text><text x="416" y="300" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_i</text><text x="482" y="300" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0072</text><text x="540" y="300" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0075</text><text x="416" y="324" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_g</text><text x="482" y="324" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0497</text><text x="540" y="324" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0145</text><text x="416" y="348" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_o</text><text x="482" y="348" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0195</text><text x="540" y="348" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0001</text><path d="M 420 452 L 420 414" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsB-g)" stroke-linejoin="round"/><text x="420" y="472" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">x₂ = you</text></g>
<g data-key="out2"><path d="M 564 380 L 564 126" fill="none" stroke="#73B222" stroke-width="2" marker-end="url(#lsB-n)" stroke-linejoin="round"/><rect x="382" y="46" width="196" height="80" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-width="2"/><text x="480" y="68" font-size="13" fill="#A30908" text-anchor="middle" font-weight="700">dz₂ = (ŷ − y) / 3</text><text x="480" y="92" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,087; 0,082;</text><text x="480" y="113" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,254; 0,086</text></g>
<g data-key="v2"><path d="M 646 216 L 594 216" fill="none" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lsB-r)" stroke-linejoin="round"/><text x="620" y="236" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="400">−0,0053</text><text x="620" y="252" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="400">−0,0437</text><text x="620" y="188" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="700">dc⊙f</text><path d="M 646 364 L 594 364" fill="none" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#lsB-r)" stroke-linejoin="round"/><text x="620" y="338" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="400">0,0044</text><text x="620" y="354" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="400">−0,0159</text><text x="620" y="402" font-size="12.5" fill="#A30908" text-anchor="middle" font-weight="700">Σ da·Wₕᵀ</text></g>
<g data-key="cell3"><rect x="670" y="165" width="180" height="245" rx="12" fill="#F0FAF0" stroke="#73B222" stroke-width="2"/><text x="680" y="183" font-size="11.5" fill="#5A8C1C" text-anchor="start" font-weight="700" letter-spacing="0.06em">ТАКТ 3</text><text x="696" y="228" font-size="13.5" fill="#5A8C1C" text-anchor="middle" font-weight="700">dh</text><text x="762" y="228" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0143</text><text x="820" y="228" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0924</text><text x="696" y="252" font-size="13.5" fill="#2A5E9B" text-anchor="middle" font-weight="700">dc</text><text x="762" y="252" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0063</text><text x="820" y="252" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0579</text><text x="696" y="276" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_f</text><text x="762" y="276" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0004</text><text x="820" y="276" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0002</text><text x="696" y="300" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_i</text><text x="762" y="300" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,0006</text><text x="820" y="300" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0023</text><text x="696" y="324" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_g</text><text x="762" y="324" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0032</text><text x="820" y="324" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0293</text><text x="696" y="348" font-size="13.5" fill="#8C7106" text-anchor="middle" font-weight="700">da_o</text><text x="762" y="348" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0004</text><text x="820" y="348" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">−0,0020</text><path d="M 700 452 L 700 414" fill="none" stroke="#5E5850" stroke-width="2" marker-end="url(#lsB-g)" stroke-linejoin="round"/><text x="700" y="472" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">x₃ = will</text></g>
<g data-key="out3"><path d="M 844 380 L 844 126" fill="none" stroke="#73B222" stroke-width="2" marker-end="url(#lsB-n)" stroke-linejoin="round"/><rect x="662" y="46" width="196" height="80" rx="10" fill="#FFFFFF" stroke="#C30B0A" stroke-width="2"/><text x="760" y="68" font-size="13" fill="#A30908" text-anchor="middle" font-weight="700">dz₃ = (ŷ − y) / 3</text><text x="760" y="92" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,081; 0,094;</text><text x="760" y="113" font-size="13" fill="#A30908" text-anchor="middle" font-weight="400">0,072; −0,247</text></g>
<g data-key="v3"><text x="896" y="224" font-size="14" fill="#A30908" text-anchor="middle" font-weight="700">0</text><text x="896" y="404" font-size="14" fill="#A30908" text-anchor="middle" font-weight="700">0</text><text x="896" y="188" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">после T</text><text x="896" y="368" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">нет такта</text></g>
<rect x="20" y="500" width="920" height="132" rx="10" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/>
<g data-key="B1" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dz_t=\frac{\hat y_t-y_t}{3},\qquad dh_t^{\text{out}}=dz_t\,W_{hy}^{\top}"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dh_3^{\text{out}}=\left(-0{,}0143;\ -0{,}0924\right),\quad dh_2^{\text{out}}=\left(-0{,}2015;\ -0{,}0026\right),\quad dh_1^{\text{out}}=\left(0{,}2361;\ -0{,}1827\right)"></div></foreignObject></g>
<g data-key="B2" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dh_3=dh_3^{\text{out}}+0=\left(-0{,}0143;\ -0{,}0924\right)"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dc_3=dh_3\odot o_3\odot\left(1-\tanh^2 c_3\right)+0=\left(-0{,}0063;\ -0{,}0579\right)"></div></foreignObject></g>
<g data-key="B3" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="da_f=dc_3\odot c_2\odot f_3(1-f_3)=\left(-0{,}0004;\ -0{,}0002\right),\quad da_i=dc_3\odot g_3\odot i_3(1-i_3)=\left(0{,}0006;\ -0{,}0023\right)"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="da_g=dc_3\odot i_3\odot(1-g_3^2)=\left(-0{,}0032;\ -0{,}0293\right),\quad da_o=dh_3\odot\tanh c_3\odot o_3(1-o_3)=\left(-0{,}0004;\ -0{,}0020\right)"></div></foreignObject></g>
<g data-key="B4" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dc_3\odot f_3=\left(-0{,}0063;\ -0{,}0579\right)\odot\left(0{,}8401;\ 0{,}7543\right)=\left(-0{,}0053;\ -0{,}0437\right)"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="\textstyle\sum_k da_k W_{hk}^{\top}=\left(0{,}0044;\ -0{,}0159\right)\quad(k=i,f,g,o)"></div></foreignObject></g>
<g data-key="B5" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dh_2=dh_2^{\text{out}}+\left(0{,}0044;\ -0{,}0159\right)=\left(-0{,}1971;\ -0{,}0185\right)"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dc_2=dh_2\odot o_2\odot(1-\tanh^2c_2)+dc_3\odot f_3=\left(-0{,}0845;\ -0{,}0080\right)+\left(-0{,}0053;\ -0{,}0437\right)=\left(-0{,}0898;\ -0{,}0516\right)"></div></foreignObject></g>
<g data-key="B6" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dh_1=dh_1^{\text{out}}+\left(-0{,}0174;\ -0{,}0194\right)=\left(0{,}2187;\ -0{,}2021\right)"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dc_1=\left(0{,}1192;\ -0{,}1018\right)+\left(-0{,}0597;\ -0{,}0421\right)=\left(0{,}0595;\ -0{,}1439\right)"></div></foreignObject></g>
<g data-key="B7" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dW_{xk}=\sum_t x_t^{\top}da_{k,t},\qquad dW_{hk}=\sum_t h_{t-1}^{\top}da_{k,t},\qquad db_k=\sum_t da_{k,t}"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="db_f=\left(-0{,}0065;\ 0{,}0022\right),\quad db_i=\left(0{,}0012;\ 0{,}0053\right),\quad db_g=\left(-0{,}0286;\ -0{,}1169\right),\quad db_o=\left(-0{,}0042;\ 0{,}0124\right)"></div></foreignObject></g>
<g data-key="B8" data-only="1"><foreignObject x="30" y="527" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="dc_1\ni dc_3\odot f_3\odot f_2=\left(-0{,}0063;\ -0{,}0579\right)\odot\left(0{,}8401;\ 0{,}7543\right)\odot\left(0{,}6650;\ 0{,}8155\right)"></div></foreignObject><foreignObject x="30" y="567" width="900" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111" data-tex="=\left(-0{,}0035;\ -0{,}0356\right)\quad\text{— только сигмоиды, без }W"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="lines out1 out2 out3 B1" data-focus="out1 out2 out3">
      <div class="step-kicker">Шаг 1 · ошибки тактов</div>
      <h4>Начало то же, что у RNN</h4>
      <p>Каждый такт даёт свою ошибку, и её градиент по логитам равен <span class="math-inline" data-tex="dz_t = (\hat y_t - y_t)/3"></span>: вероятности минус one-hot цели, делённые на число тактов. Выходной слой переводит его в градиент по <span class="math-inline" data-tex="h_t"></span>: <span class="math-inline" data-tex="dh_t^{\text{out}} = dz_tW_{hy}^{\top}"></span>. Всё это — локальные расчёты, связи между тактами здесь ещё нет.</p>
    </div>
    <div class="step-panel" data-on="lines cell3 out3 v3 B2" data-focus="cell3">
      <div class="step-kicker">Шаг 2 · такт 3: dh и dc</div>
      <h4>Градиент приходит в h и переходит в c</h4>
      <p>На последнем такте сверху ничего не приходит: следующего такта нет. Значит, <span class="math-inline" data-tex="dh_3 = dh_3^{\text{out}}"></span>. Дальше цепное правило по формуле <span class="math-inline" data-tex="h_3 = o_3\odot\tanh c_3"></span>: в память градиент попадает, умножившись на <span class="math-inline" data-tex="o_3"></span> и на производную <span class="math-inline" data-tex="\tanh"></span>, то есть на <span class="math-inline" data-tex="1-\tanh^2c_3"></span>.</p>
    </div>
    <div class="step-panel" data-on="lines cell3 out3 v3 B3" data-focus="cell3">
      <div class="step-kicker">Шаг 3 · такт 3: ворота</div>
      <h4>Градиенты четырёх предактиваций</h4>
      <p>Каждые ворота получают свою долю. Из <span class="math-inline" data-tex="c_3 = f_3\odot c_2 + i_3\odot g_3"></span>: градиент по <span class="math-inline" data-tex="f_3"></span> равен <span class="math-inline" data-tex="dc_3\odot c_2"></span>, по <span class="math-inline" data-tex="i_3"></span> — <span class="math-inline" data-tex="dc_3\odot g_3"></span>, по <span class="math-inline" data-tex="g_3"></span> — <span class="math-inline" data-tex="dc_3\odot i_3"></span>. Из <span class="math-inline" data-tex="h_3=o_3\odot\tanh c_3"></span>: по <span class="math-inline" data-tex="o_3"></span> — <span class="math-inline" data-tex="dh_3\odot\tanh c_3"></span>. Затем каждый умножается на производную своей активации: <span class="math-inline" data-tex="\sigma(1-\sigma)"></span> для ворот и <span class="math-inline" data-tex="1-g^2"></span> для кандидата. Получаются <span class="math-inline" data-tex="da_f, da_i, da_g, da_o"></span> — градиенты по предактивациям.</p>
    </div>
    <div class="step-panel" data-on="lines cell2 cell3 v2 B4" data-focus="v2">
      <div class="step-kicker">Шаг 4 · передача назад</div>
      <h4>В такт 2 уходят два градиента</h4>
      <p>По верхней линии в такт 2 уходит <span class="math-inline" data-tex="dc_3\odot f_3"></span>: градиент памяти, умноженный на ворота забывания. По нижней — сумма четырёх слагаемых <span class="math-inline" data-tex="da_kW_{hk}^{\top}"></span>: <span class="math-inline" data-tex="h_2"></span> входил в предактивации всех четырёх слоёв такта 3, и каждый возвращает свой вклад. Нижний путь устроен как у RNN, только матриц не одна, а четыре.</p>
    </div>
    <div class="step-panel" data-on="lines cell2 out2 v2 B5" data-focus="cell2">
      <div class="step-kicker">Шаг 5 · такт 2</div>
      <h4>Своё плюс пришедшее сверху</h4>
      <p>На такте 2 градиент по <span class="math-inline" data-tex="h_2"></span> — это его собственная ошибка <span class="math-inline" data-tex="dh_2^{\text{out}}"></span> плюс то, что пришло из такта 3. Градиент по <span class="math-inline" data-tex="c_2"></span> тоже складывается из двух частей: из <span class="math-inline" data-tex="h_2"></span> (через <span class="math-inline" data-tex="o_2"></span> и <span class="math-inline" data-tex="\tanh"></span>) и из <span class="math-inline" data-tex="c_3"></span> по верхней линии. Дальше ворота такта 2 считаются по тем же формулам.</p>
    </div>
    <div class="step-panel" data-on="lines cell1 cell2 out1 v1 B6" data-focus="cell1">
      <div class="step-kicker">Шаг 6 · такт 1</div>
      <h4>Первый такт завершает обход</h4>
      <p>Тот же расчёт ещё раз. На такте 1 <span class="math-inline" data-tex="c_0 = 0"></span>, поэтому <span class="math-inline" data-tex="da_f = dc_1\odot c_0\odot\ldots = 0"></span>: ворота забывания первого такта не получают градиента, им нечего было забывать. Это видно в таблице такта 1: строка <span class="math-inline" data-tex="da_f"></span> нулевая.</p>
    </div>
    <div class="step-panel" data-on="lines cell1 cell2 cell3 out1 out2 out3 v1 v2 v3 B7" data-focus="cell1 cell2 cell3">
      <div class="step-kicker">Шаг 7 · градиенты весов</div>
      <h4>Веса общие — вклады тактов складываются</h4>
      <p>Все такты используют одни и те же матрицы, поэтому градиент каждой матрицы — сумма вкладов тактов. Формула та же, что у RNN, только повторяется для четырёх слоёв: вход такта, транспонированный, умножить на градиент предактивации. Для сдвигов достаточно сложить <span class="math-inline" data-tex="da"></span> по тактам: это суммы строк таблиц выше.</p>
    </div>
    <div class="step-panel" data-on="lines cell1 cell2 cell3 out1 out2 out3 v1 v2 v3 B8" data-focus="lines v1 v2">
      <div class="step-kicker">Шаг 8 · два пути назад</div>
      <h4>По верхней линии — только произведение f</h4>
      <p>Проследим, как ошибка третьего такта доходит до памяти первого по верхней линии: <span class="math-inline" data-tex="dc_3"></span> умножается на <span class="math-inline" data-tex="f_3"></span>, потом на <span class="math-inline" data-tex="f_2"></span>. Никаких матриц, никаких производных <span class="math-inline" data-tex="\tanh"></span>: только значения ворот забывания, которые сеть выбирает сама. В нашем примере они 0,67–0,84, и за два такта сигнал ослабевает примерно вдвое. Если ворота держат 0,99, за сто тактов остаётся <span class="math-inline" data-tex="0{,}99^{100}\approx0{,}37"></span>.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Переключайте шаги кнопками или стрелками ← → на клавиатуре, когда сцена в фокусе.</p>

### Считаем руками: обратный проход на третьем такте

<p>
  Начинаем с конца. Формулы выводятся цепным правилом из двух строк прямого прохода, <span class="math-inline" data-tex="c_t = f_t\odot c_{t-1} + i_t\odot g_t"></span>
  и <span class="math-inline" data-tex="h_t = o_t\odot \tanh c_t"></span>; справка о производных — выше.
</p>

<div class="worked-example">
<div class="worked-label">Градиент по логитам и по h₃</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="dz_3=\frac{\hat y_3-y_3}{3},\qquad dh_3=dz_3W_{hy}^{\top}+dh_3^{\text{next}}"></div><div class="worked-trace-note">после последнего такта ничего не приходит: <span class="math-inline" data-tex="dh_3^{\text{next}} = 0"></span></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">dz₃</div><div class="math-display worked-trace-math" data-tex="dz_3=\frac{\left(0{,}2444;\ 0{,}2807;\ 0{,}2152;\ 0{,}2598\right)-(0;\,0;\,0;\,1)}{3}=\left(0{,}0815;\ 0{,}0936;\ 0{,}0717;\ -0{,}2467\right)"></div><div class="worked-trace-note">цель — pass, четвёртая координата</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">dh₃, 1-я</div><div class="math-display worked-trace-math" data-tex="0{,}0815\cdot0{,}3+0{,}0936\cdot(-0{,}5)+0{,}0717\cdot0{,}8+(-0{,}2467)\cdot0{,}2=-0{,}0143"></div><div class="worked-trace-note">первая строка <span class="math-inline" data-tex="W_{hy}"></span></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">dh₃, 2-я</div><div class="math-display worked-trace-math" data-tex="0{,}0815\cdot(-0{,}7)+0{,}0936\cdot0{,}6+0{,}0717\cdot0{,}1+(-0{,}2467)\cdot0{,}4=-0{,}0924"></div><div class="worked-trace-note">вторая строка</div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Из h₃ в память и в ворота выхода</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формулы</div><div class="math-display worked-trace-math" data-tex="dc_3=dh_3\odot o_3\odot\left(1-\tanh^2c_3\right)+dc_4\odot f_4,\qquad do_3=dh_3\odot\tanh c_3"></div><div class="worked-trace-note"><span class="math-inline" data-tex="dc_4 = 0"></span>: такта 4 нет</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">dc₃, 1-я</div><div class="math-display worked-trace-math" data-tex="-0{,}0143\cdot0{,}4456\cdot(1-0{,}1109^2)=-0{,}0063"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">dc₃, 2-я</div><div class="math-display worked-trace-math" data-tex="-0{,}0924\cdot0{,}6320\cdot(1-0{,}0948^2)=-0{,}0579"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">do₃</div><div class="math-display worked-trace-math" data-tex="do_3=\left(-0{,}0143;\ -0{,}0924\right)\odot\left(0{,}1109;\ 0{,}0948\right)=\left(-0{,}0016;\ -0{,}0088\right)"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Градиенты предактиваций такта 3</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формулы f, i</div><div class="math-display worked-trace-math" data-tex="da_f=dc\odot c_{t-1}\odot f(1-f),\qquad da_i=dc\odot g\odot i(1-i)"></div><div class="worked-trace-note">градиент по значению × производная активации</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">формулы g, o</div><div class="math-display worked-trace-math" data-tex="da_g=dc\odot i\odot(1-g^2),\qquad da_o=do\odot o(1-o)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">da_f, 1-я</div><div class="math-display worked-trace-math" data-tex="-0{,}0063\cdot0{,}4193\cdot0{,}8401\cdot0{,}1599=-0{,}0004"></div><div class="worked-trace-note">c₂ — память, которую ворота ослабляли</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">da_i, 1-я</div><div class="math-display worked-trace-math" data-tex="-0{,}0063\cdot(-0{,}3959)\cdot0{,}6085\cdot0{,}3915=0{,}0006"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">da_g, 1-я</div><div class="math-display worked-trace-math" data-tex="-0{,}0063\cdot0{,}6085\cdot(1-(-0{,}3959)^2)=-0{,}0032"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">da_o, 1-я</div><div class="math-display worked-trace-math" data-tex="-0{,}0016\cdot0{,}4456\cdot0{,}5544=-0{,}0004"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">все: f, i</div><div class="math-display worked-trace-math" data-tex="da_f=\left(-0{,}0004;\ -0{,}0002\right),\qquad da_i=\left(0{,}0006;\ -0{,}0023\right)"></div><div class="worked-trace-note">вторые координаты — так же</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">все: g, o</div><div class="math-display worked-trace-math" data-tex="da_g=\left(-0{,}0032;\ -0{,}0293\right),\qquad da_o=\left(-0{,}0004;\ -0{,}0020\right)"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="worked-example">
<div class="worked-label">Что уходит в такт 2</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">по памяти</div><div class="math-display worked-trace-math" data-tex="dc_3\odot f_3=\left(-0{,}0063;\ -0{,}0579\right)\odot\left(0{,}8401;\ 0{,}7543\right)=\left(-0{,}0053;\ -0{,}0437\right)"></div><div class="worked-trace-note">только умножение на ворота</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">по выходу</div><div class="math-display worked-trace-math" data-tex="dh_2^{\text{next}}=da_iW_{hi}^{\top}+da_fW_{hf}^{\top}+da_gW_{hg}^{\top}+da_oW_{ho}^{\top}"></div><div class="worked-trace-note">h₂ входил во все четыре слоя такта 3</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">i и f</div><div class="math-display worked-trace-math" data-tex="\left(0{,}0004;\ -0{,}0006\right)\;+\;\left(-0{,}0001;\ 0{,}0000\right)"></div><div class="worked-trace-note">вклады ворот входа и забывания</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">g и o</div><div class="math-display worked-trace-math" data-tex="+\;\left(0{,}0046;\ -0{,}0150\right)\;+\;\left(-0{,}0004;\ -0{,}0003\right)"></div><div class="worked-trace-note">вклады кандидата и ворот выхода</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">сумма</div><div class="math-display worked-trace-math" data-tex="dh_2^{\text{next}}=\left(0{,}0044;\ -0{,}0159\right)"></div><div class="worked-trace-note"></div></div>
</div>
</div>

### Считаем руками: такт 2 собирает два потока

<p>
  На втором такте к собственной ошибке добавляется то, что пришло из третьего. Дальше формулы те же.
</p>

<div class="worked-example">
<div class="worked-label">dh₂ и dc₂</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">dh₂</div><div class="math-display worked-trace-math" data-tex="dh_2=dz_2W_{hy}^{\top}+dh_2^{\text{next}}=\left(-0{,}2015;\ -0{,}0026\right)+\left(0{,}0044;\ -0{,}0159\right)=\left(-0{,}1971;\ -0{,}0185\right)"></div><div class="worked-trace-note">своё + из такта 3</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">через h</div><div class="math-display worked-trace-math" data-tex="dh_2\odot o_2\odot(1-\tanh^2c_2)=\left(-0{,}0845;\ -0{,}0080\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">по линии</div><div class="math-display worked-trace-math" data-tex="dc_3\odot f_3=\left(-0{,}0053;\ -0{,}0437\right)"></div><div class="worked-trace-note">посчитано выше</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">dc₂</div><div class="math-display worked-trace-math" data-tex="dc_2=\left(-0{,}0845;\ -0{,}0080\right)+\left(-0{,}0053;\ -0{,}0437\right)=\left(-0{,}0898;\ -0{,}0516\right)"></div><div class="worked-trace-note"></div></div>
</div>
</div>

<div class="lstm-table"><table class="shape-table">
  <tr><th>величина</th><th>такт 1</th><th>такт 2</th><th>такт 3</th></tr>
  <tr><td><span class="math-inline" data-tex="dh_t"></span></td><td>(0,2187; −0,2021)</td><td>(−0,1971; −0,0185)</td><td>(−0,0143; −0,0924)</td></tr>
  <tr><td><span class="math-inline" data-tex="dc_t"></span> через <span class="math-inline" data-tex="h_t"></span></td><td>(0,1192; −0,1018)</td><td>(−0,0845; −0,0080)</td><td>(−0,0063; −0,0579)</td></tr>
  <tr><td><span class="math-inline" data-tex="dc_t"></span> из <span class="math-inline" data-tex="c_{t+1}"></span></td><td>(−0,0597; −0,0421)</td><td>(−0,0053; −0,0437)</td><td>(0,0000; 0,0000)</td></tr>
  <tr><td><span class="math-inline" data-tex="dc_t"></span></td><td>(0,0595; −0,1439)</td><td>(−0,0898; −0,0516)</td><td>(−0,0063; −0,0579)</td></tr>
  <tr><td><span class="math-inline" data-tex="da_f"></span></td><td>(0,0000; 0,0000)</td><td>(−0,0062; 0,0023)</td><td>(−0,0004; −0,0002)</td></tr>
  <tr><td><span class="math-inline" data-tex="da_i"></span></td><td>(0,0078; 0,0152)</td><td>(−0,0072; −0,0075)</td><td>(0,0006; −0,0023)</td></tr>
  <tr><td><span class="math-inline" data-tex="da_g"></span></td><td>(0,0243; −0,0731)</td><td>(−0,0497; −0,0145)</td><td>(−0,0032; −0,0293)</td></tr>
  <tr><td><span class="math-inline" data-tex="da_o"></span></td><td>(0,0157; 0,0145)</td><td>(−0,0195; −0,0001)</td><td>(−0,0004; −0,0020)</td></tr>
</table></div>

<div class="worked-example">
<div class="worked-label">Градиенты весов: сумма по тактам</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формулы</div><div class="math-display worked-trace-math" data-tex="dW_{xk}=\sum_{t}x_t^{\top}da_{k,t},\qquad dW_{hk}=\sum_t h_{t-1}^{\top}da_{k,t},\qquad db_k=\sum_t da_{k,t}"></div><div class="worked-trace-note">k = i, f, g, o</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">db_f</div><div class="math-display worked-trace-math" data-tex="db_f=\left(0{,}0000;\ 0{,}0000\right)+\left(-0{,}0062;\ 0{,}0023\right)+\left(-0{,}0004;\ -0{,}0002\right)=\left(-0{,}0065;\ 0{,}0022\right)"></div><div class="worked-trace-note">сумма строки <span class="math-inline" data-tex="da_f"></span> по тактам</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">dW_xf</div><div class="math-display worked-trace-math" data-tex="dW_{xf}=\begin{bmatrix}0{,}0000&amp;0{,}0000\\-0{,}0062&amp;0{,}0023\\-0{,}0004&amp;-0{,}0002\\0{,}0000&amp;0{,}0000\end{bmatrix}"></div><div class="worked-trace-note">строка токена — <span class="math-inline" data-tex="da_f"></span> того такта, где он был входом</div></div>
</div>
<p class="worked-reading">Строка ⟨BOS⟩ в <span class="math-inline" data-tex="dW_{xf}"></span> нулевая, хотя ⟨BOS⟩ был входом: на первом такте <span class="math-inline" data-tex="c_0 = 0"></span>, и ворота забывания ни на что не повлияли. Строка pass нулевая, потому что pass ни разу не был входом.</p>
</div>

### Проверка градиента и шаг обучения

<p>
  Ошибку в такой выкладке легко сделать и трудно заметить, поэтому её проверяют численно. Каждый из 68 параметров сдвигают
  на <span class="math-inline" data-tex="\pm\varepsilon"></span>, пересчитывают потерю и делят разность на <span class="math-inline" data-tex="2\varepsilon"></span>. При <span class="math-inline" data-tex="\varepsilon = 10^{-6}"></span> наибольшее
  расхождение с аналитическим градиентом — <span class="math-inline" data-tex="1{,}7\cdot10^{-10}"></span>: формулы верны.
</p>

<div class="worked-example">
<div class="worked-label">Один шаг градиентного спуска</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="\theta\leftarrow\theta-\eta\,d\theta,\qquad \eta=0{,}5"></div><div class="worked-trace-note">для каждой из 68 величин</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">пример</div><div class="math-display worked-trace-math" data-tex="b_f\leftarrow(1;\,1)-0{,}5\cdot\left(-0{,}0065;\ 0{,}0022\right)=\left(1{,}0033;\ 0{,}9989\right)"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">потеря</div><div class="math-display worked-trace-math" data-tex="\mathcal L:\ 1{,}4202\ \to\ 1{,}3606"></div><div class="worked-trace-note">у RNN тот же шаг давал 1,5192 → 1,3478</div></div>
</div>
</div>

## Часть 6. Почему градиент доходит до начала

<p>
  Посмотрим ещё раз на переход памяти из такта в такт. Если бы ворота не зависели от прошлого, было бы
  <span class="math-inline" data-tex="\partial c_t/\partial c_{t-1} = \operatorname{diag}(f_t)"></span> — диагональная матрица со значениями ворот. На самом деле
  <span class="math-inline" data-tex="c_{t-1}"></span> влияет на <span class="math-inline" data-tex="c_t"></span> ещё и окольным путём: через <span class="math-inline" data-tex="h_{t-1} = o_{t-1}\odot\tanh c_{t-1}"></span>, от которого зависят все
  четверо слоёв. Эти окольные слагаемые устроены как у RNN: в них есть <span class="math-inline" data-tex="W_{h\cdot}"></span> и производные активаций, и они затухают
  так же быстро. Прямой путь остаётся, и на нём за <span class="math-inline" data-tex="k"></span> тактов градиент умножается на произведение <span class="math-inline" data-tex="k"></span> векторов <span class="math-inline" data-tex="f"></span>.
</p>

<div class="math-display" data-tex="\frac{\partial c_T}{\partial c_k}\Big|_{\text{прямой путь}}=\operatorname{diag}\left(f_T\odot f_{T-1}\odot\cdots\odot f_{k+1}\right)"></div>

<p>
  Это ещё не гарантия. Если ворота забывания около 0,5, произведение пятидесяти таких чисел — <span class="math-inline" data-tex="10^{-15}"></span>, хуже, чем у RNN.
  Длинная память появляется, только если сеть держит <span class="math-inline" data-tex="f\approx1"></span> на тех координатах памяти, где лежит нужный признак.
  Ниже реальные градиенты из опыта части 1 на длине 50: для RNN норма <span class="math-inline" data-tex="\partial\mathcal L/\partial h_k"></span>, для LSTM —
  <span class="math-inline" data-tex="\partial\mathcal L/\partial c_k"></span>, обе как доля от значения на последнем такте.
</p>

<div class="stage slider-stage" id="grStage">
<div class="slider-grid">
<div class="stage-figure">
<svg id="grSvg" viewBox="0 0 680 420" role="img" aria-label="Норма градиента по тактам назад у RNN и LSTM до и после обучения"><line x1="70" y1="360" x2="650" y2="360" class="ls-grid"/><text x="62" y="364" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−10</tspan></text><line x1="70" y1="328" x2="650" y2="328" class="ls-grid"/><text x="62" y="332" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−9</tspan></text><line x1="70" y1="296" x2="650" y2="296" class="ls-grid"/><text x="62" y="300" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−8</tspan></text><line x1="70" y1="264" x2="650" y2="264" class="ls-grid"/><text x="62" y="268" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−7</tspan></text><line x1="70" y1="232" x2="650" y2="232" class="ls-grid"/><text x="62" y="236" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−6</tspan></text><line x1="70" y1="200" x2="650" y2="200" class="ls-grid"/><text x="62" y="204" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−5</tspan></text><line x1="70" y1="168" x2="650" y2="168" class="ls-grid"/><text x="62" y="172" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−4</tspan></text><line x1="70" y1="136" x2="650" y2="136" class="ls-grid"/><text x="62" y="140" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−3</tspan></text><line x1="70" y1="104" x2="650" y2="104" class="ls-grid"/><text x="62" y="108" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−2</tspan></text><line x1="70" y1="72" x2="650" y2="72" class="ls-grid"/><text x="62" y="76" text-anchor="end" class="ls-tick">10<tspan dy="−6" font−size="10">−1</tspan></text><line x1="70" y1="40" x2="650" y2="40" class="ls-grid"/><text x="62" y="44" text-anchor="end" class="ls-tick">1</text><line x1="70" y1="360" x2="650" y2="360" class="ls-axis"/><line x1="70" y1="40" x2="70" y2="360" class="ls-axis"/><text x="650" y="404" text-anchor="end" class="ls-cap">номер такта t: 1 — первый токен, 50 — ответ</text><text x="70" y="26" text-anchor="start" class="ls-cap">норма градиента, доля от последнего такта</text><text x="70" y="380" text-anchor="middle" class="ls-tick">1</text><text x="176.53" y="380" text-anchor="middle" class="ls-tick">10</text><text x="294.9" y="380" text-anchor="middle" class="ls-tick">20</text><text x="413.27" y="380" text-anchor="middle" class="ls-tick">30</text><text x="531.63" y="380" text-anchor="middle" class="ls-tick">40</text><text x="650" y="380" text-anchor="middle" class="ls-tick">50</text><path id="gl_rnn" fill="none" stroke="#C30B0A" stroke-width="3.2" stroke-linejoin="round"/><path id="gl_lstm1" fill="none" stroke="#8FB3DC" stroke-width="3.2" stroke-linejoin="round"/><path id="gl_lstm3" fill="none" stroke="#3576C0" stroke-width="3.2" stroke-linejoin="round"/><rect x="96" y="272" width="22" height="5" fill="#C30B0A"/><text x="126" y="279" font-size="13.5" fill="#111" font-family="Helvetica, Arial, sans-serif">RNN: ‖∂L/∂h‖</text><rect x="96" y="296" width="22" height="5" fill="#8FB3DC"/><text x="126" y="303" font-size="13.5" fill="#111" font-family="Helvetica, Arial, sans-serif">LSTM, b<tspan dy="4" font-size="10">f</tspan><tspan dy="-4"> = 1: ‖∂L/∂c‖</tspan></text><rect x="96" y="320" width="22" height="5" fill="#3576C0"/><text x="126" y="327" font-size="13.5" fill="#111" font-family="Helvetica, Arial, sans-serif">LSTM, b<tspan dy="4" font-size="10">f</tspan><tspan dy="-4"> = 3: ‖∂L/∂c‖</tspan></text></svg>
</div>
<div class="slider-panel">
<div class="range-label">состояние сети</div>
<div class="toggle-row"><button type="button" data-ph="init" aria-pressed="true">до обучения</button><button type="button" data-ph="trained" aria-pressed="false">после</button></div>
<div id="grK1" class="live-number small" style="color:#C30B0A"></div>
<div class="live-caption">RNN: доля градиента, дошедшая до первого токена</div>
<div id="grK3" class="live-number small"></div>
<div class="live-caption">LSTM с b<sub>f</sub> = 3: то же по линии памяти</div>
<div id="grNote" class="live-caption"></div>
</div>
</div>
</div>
<p class="stage-hint">Слева — первый токен последовательности, справа — последний такт, где считается ошибка. Данные — реальные градиенты, средние по 256 последовательностям длины 50.</p>
<script>
(function () {
  var D = {"rnn_init": [-13.28, -12.965, -12.67, -12.437, -12.248, -12.092, -11.9, -11.573, -11.185, -10.816, -10.495, -10.225, -10.007, -9.834, -9.69, -9.461, -9.089, -8.689, -8.333, -8.032, -7.773, -7.57, -7.414, -7.27, -7.003, -6.601, -6.204, -5.865, -5.567, -5.322, -5.134, -4.994, -4.844, -4.529, -4.111, -3.727, -3.397, -3.115, -2.887, -2.712, -2.592, -2.42, -2.037, -1.614, -1.239, -0.937, -0.66, -0.5, -0.185, 0.0], "rnn_trained": [-8.028, -7.804, -7.631, -7.465, -7.298, -7.131, -6.964, -6.798, -6.631, -6.464, -6.297, -6.131, -5.964, -5.798, -5.632, -5.465, -5.298, -5.132, -4.965, -4.799, -4.631, -4.465, -4.298, -4.131, -3.964, -3.798, -3.631, -3.465, -3.298, -3.134, -2.968, -2.801, -2.635, -2.469, -2.304, -2.138, -1.973, -1.807, -1.645, -1.483, -1.32, -1.154, -0.993, -0.84, -0.692, -0.534, -0.374, -0.236, -0.141, 0.0], "lstm1_init": [-4.443, -4.38, -4.315, -4.247, -4.176, -4.106, -4.033, -3.96, -3.886, -3.813, -3.741, -3.668, -3.595, -3.523, -3.451, -3.379, -3.308, -3.237, -3.167, -3.097, -3.029, -2.96, -2.891, -2.823, -2.756, -2.689, -2.622, -2.556, -2.491, -2.426, -2.36, -2.294, -2.228, -2.16, -2.091, -2.019, -1.944, -1.865, -1.78, -1.688, -1.589, -1.482, -1.369, -1.251, -1.126, -0.998, -0.866, -0.731, -0.593, -0.447], "lstm1_trained": [-11.18, -10.973, -10.763, -10.55, -10.337, -10.127, -9.911, -9.697, -9.48, -9.266, -9.053, -8.84, -8.624, -8.41, -8.197, -7.984, -7.77, -7.557, -7.345, -7.13, -6.921, -6.707, -6.494, -6.281, -6.069, -5.856, -5.646, -5.434, -5.228, -5.02, -4.803, -4.595, -4.385, -4.173, -3.961, -3.75, -3.539, -3.328, -3.113, -2.896, -2.678, -2.455, -2.229, -1.997, -1.759, -1.516, -1.268, -1.014, -0.756, -0.51], "lstm3_init": [-1.518, -1.546, -1.571, -1.591, -1.607, -1.619, -1.627, -1.633, -1.637, -1.639, -1.639, -1.637, -1.634, -1.63, -1.625, -1.619, -1.611, -1.603, -1.593, -1.581, -1.569, -1.556, -1.541, -1.525, -1.508, -1.49, -1.47, -1.449, -1.427, -1.405, -1.381, -1.357, -1.331, -1.305, -1.278, -1.25, -1.221, -1.192, -1.162, -1.132, -1.101, -1.07, -1.038, -1.006, -0.973, -0.941, -0.907, -0.873, -0.838, -0.801], "lstm3_trained": [-5.551, -5.495, -5.42, -5.359, -5.31, -5.269, -5.232, -5.199, -5.168, -5.139, -5.112, -5.085, -5.059, -5.034, -5.009, -4.984, -4.959, -4.935, -4.911, -4.886, -4.863, -4.838, -4.815, -4.791, -4.767, -4.743, -4.719, -4.695, -4.672, -4.648, -4.624, -4.6, -4.577, -4.553, -4.529, -4.506, -4.482, -4.458, -4.435, -4.411, -4.387, -4.364, -4.34, -4.316, -4.293, -4.269, -4.246, -4.22, -4.213, -4.074]}, I = {"f_mean3": 0.9802508354187012, "f_unit3": 0.9995831774205578, "f_unit3_min": 0.9988524913787842, "f_init": 0.9500448107719421, "f_init1": 0.7247270941734314, "acc": {"rnn": 0.4880000054836273, "lstm1": 0.47850000858306885, "lstm3": 1.0}};
  var root = document.getElementById('grStage'); if (!root) return;
  function X(k) { return 650 - k / 49 * 580; }
  function Y(e) { e = Math.max(-10.3, Math.min(0.3, e)); return 360 - (e + 10) / 10 * 320; }
  function sci(e) { var v = Math.pow(10, e); if (v >= 0.01) return v.toFixed(2).replace('.', ','); var p = Math.floor(e), m = Math.pow(10, e - p); return m.toFixed(1).replace('.', ',') + '·10' + String(p).replace('-', '⁻').replace(/[0-9]/g, function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]; }); }
  function pct(v) { return (v * 100).toFixed(1).replace('.', ',') + ' %'; }
  function draw(ph) {
    ['rnn', 'lstm1', 'lstm3'].forEach(function (m) {
      var a = D[m + '_' + ph], d = '';
      for (var t = 0; t < a.length; t++) { var k = a.length - 1 - t; d += (t ? 'L' : 'M') + X(k).toFixed(1) + ' ' + Y(a[t]).toFixed(1) + ' '; }
      document.getElementById('gl_' + m).setAttribute('d', d);
    });
    document.getElementById('grK1').textContent = sci(D['rnn_' + ph][0]);
    document.getElementById('grK3').textContent = sci(D['lstm3_' + ph][0]);
    document.getElementById('grNote').innerHTML = ph === 'init'
      ? 'До обучения ворота забывания в среднем ' + I.f_init1.toFixed(2).replace('.', ',') + ' при b<sub>f</sub> = 1 и ' + I.f_init.toFixed(2).replace('.', ',') + ' при b<sub>f</sub> = 3.'
      : 'После обучения точность: RNN ' + pct(I.acc.rnn) + ', LSTM с b<sub>f</sub> = 1 ' + pct(I.acc.lstm1) + ', с b<sub>f</sub> = 3 ' + pct(I.acc.lstm3) + '. Ворота забывания у координаты, где хранится ответ, в среднем ' + I.f_unit3.toFixed(4).replace('.', ',') + '.';
    root.querySelectorAll('[data-ph]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.ph === ph)); });
  }
  root.querySelectorAll('[data-ph]').forEach(function (b) { b.addEventListener('click', function () { draw(b.dataset.ph); }); });
  draw('init');
})();
</script>

<p>
  До обучения до первого токена доходит такая доля градиента последнего такта: у RNN 5,3·10⁻¹⁴,
  у LSTM со сдвигом 1 — 3,6·10⁻⁵, со сдвигом 3 — 3,0·10⁻². Это и решает
  исход опыта: сеть может выучить связь ответа с первым токеном, только если градиент от этой связи до весов доходит.
</p>

<p>
  После обучения LSTM со сдвигом 3 держит ворота забывания на координате памяти, где лежит первый токен, в среднем
  0,9996 (минимум 0,9989), и градиент по памяти от последнего такта до первого
  меняется всего в 30 раз. Синяя линия
  при этом вся лежит низко: на последнем такте почти весь градиент получает <span class="math-inline" data-tex="h"></span>, а не <span class="math-inline" data-tex="c"></span>. Важен наклон, а не высота. У RNN
  после обучения градиент за 50 тактов по-прежнему падает в 1,1·10⁸ раз.
  У LSTM со сдвигом 1 ворота забывания после обучения в среднем 0,51 — меньше,
  чем было в начале, — и градиент гаснет быстрее, чем у RNN.
</p>

### Сдвиг ворот забывания

<p>
  Пока веса ворот маленькие, <span class="math-inline" data-tex="f\approx\sigma(b_f)"></span>. Отсюда простой приём, который предложили Gers и соавторы в 2000 году
  и подтвердили Jozefowicz и соавторы в 2015-м: инициализировать <span class="math-inline" data-tex="b_f"></span> единицей или больше, чтобы с первого шага обучения
  ворота пропускали большую часть памяти. В PyTorch сдвиги по умолчанию случайные около нуля, то есть <span class="math-inline" data-tex="f\approx0{,}5"></span> —
  сдвиг нужно выставить самому, как в коде части 8.
</p>

<div class="worked-example">
<div class="worked-label">Сколько градиента доживает до первого токена при T = 50</div>
<div class="worked-trace">
<div class="worked-trace-row"><div class="worked-trace-name">формула</div><div class="math-display worked-trace-math" data-tex="f=\sigma(b_f),\qquad \text{через 49 тактов: } f^{49}"></div><div class="worked-trace-note">пока веса ворот малы, f ≈ σ(b_f)</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">b_f = 0</div><div class="math-display worked-trace-math" data-tex="\sigma(0)=0{,}5,\qquad 0{,}5^{49}=1{,}8\cdot10^{-15}"></div><div class="worked-trace-note">сдвиг по умолчанию</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">b_f = 1</div><div class="math-display worked-trace-math" data-tex="\sigma(1)=0{,}7311,\qquad 0{,}7311^{49}=2{,}2\cdot10^{-7}"></div><div class="worked-trace-note"></div></div>
<div class="worked-trace-row"><div class="worked-trace-name">b_f = 3</div><div class="math-display worked-trace-math" data-tex="\sigma(3)=0{,}9526,\qquad 0{,}9526^{49}=0{,}0925"></div><div class="worked-trace-note">в 400 тысяч раз больше</div></div>
</div>
<p class="worked-reading">Оценка грубая: настоящие ворота зависят от входа, и в задаче они в среднем 0,72 и 0,95. Но порядок величин она даёт верный, и именно его видно на графике выше.</p>
</div>

<div class="callout-red">
  <strong>Клиппинг всё равно нужен.</strong> Линия памяти защищает от затухания, но не от взрыва: пути через <span class="math-inline" data-tex="h"></span> и четыре
  матрицы <span class="math-inline" data-tex="W_{h\cdot}"></span> могут усиливать градиент так же, как у RNN, а сама <span class="math-inline" data-tex="c_t"></span> не ограничена и может расти. В опыте
  части 1 клиппинг по норме 1 включён для всех трёх моделей.
</div>

## Часть 7. Формы тензоров и одна большая матрица

<div class="stage" id="stageShapes" tabindex="0">
  <div class="stage-figure">
<svg id="lsS" viewBox="0 0 960 600" role="img" aria-label="Формы тензоров LSTM: одно умножение на склеенную матрицу и разрезание на четыре слоя"><style>#lsS { font-family: Helvetica, Arial, sans-serif; }</style><defs><marker id="lsS-g" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/></marker><marker id="lsS-b" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#3576C0"/></marker><marker id="lsS-r" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C30B0A"/></marker><marker id="lsS-y" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C29E08"/></marker><marker id="lsS-n" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#73B222"/></marker></defs>
<g data-key="r1"><rect x="40" y="70" width="38" height="30" rx="0" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.4"/><text x="59" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0</text><rect x="78" y="70" width="38" height="30" rx="0" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.4"/><text x="97" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">1</text><rect x="116" y="70" width="38" height="30" rx="0" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.4"/><text x="135" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0</text><rect x="154" y="70" width="38" height="30" rx="0" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.4"/><text x="173" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0</text><text x="116" y="58" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">x₂ = you</text><text x="116" y="122" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">[B × E] = [1 × 4]</text><text x="214" y="92" font-size="28" fill="#111111" text-anchor="middle" font-weight="400">·</text><rect x="236" y="37" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="274" y="37" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="312" y="37" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="350" y="37" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="388" y="37" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="426" y="37" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="464" y="37" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="502" y="37" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="236" y="61" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="274" y="61" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="312" y="61" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="350" y="61" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="388" y="61" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="426" y="61" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="464" y="61" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="502" y="61" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="236" y="85" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="274" y="85" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="312" y="85" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="350" y="85" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="388" y="85" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="426" y="85" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="464" y="85" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="502" y="85" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="236" y="109" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="274" y="109" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="312" y="109" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="350" y="109" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="388" y="109" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="426" y="109" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="464" y="109" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="502" y="109" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><foreignObject x="228" y="10" width="320" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111" data-tex="W_x=\left[\,W_{xi}\;|\;W_{xf}\;|\;W_{xg}\;|\;W_{xo}\,\right]"></div></foreignObject><text x="388" y="151" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">[E × 4H] = [4 × 8]</text><text x="560" y="92" font-size="24" fill="#111111" text-anchor="middle" font-weight="400">=</text><rect x="584" y="70" width="38" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="603" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,5</text><rect x="622" y="70" width="38" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="641" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">−0,2</text><rect x="660" y="70" width="38" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="679" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">−0,4</text><rect x="698" y="70" width="38" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="717" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,5</text><rect x="736" y="70" width="38" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="755" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,2</text><rect x="774" y="70" width="38" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="793" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,9</text><rect x="812" y="70" width="38" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="831" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,1</text><rect x="850" y="70" width="38" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="869" y="89.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">−0,3</text><foreignObject x="576" y="42" width="320" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111" data-tex="x_2W_x\ \text{— вторая строка }W_x"></div></foreignObject><text x="736" y="122" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">[1 × 8]</text></g>
<g data-key="r2"><rect x="40" y="200" width="58" height="30" rx="0" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.4"/><text x="69" y="219.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,1791</text><rect x="98" y="200" width="58" height="30" rx="0" fill="#FFFFFF" stroke="#5E5850" stroke-width="1.4"/><text x="127" y="219.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">−0,1594</text><text x="78" y="188" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">h₁</text><text x="78" y="248" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">[B × H] = [1 × 2]</text><text x="214" y="222" font-size="28" fill="#111111" text-anchor="middle" font-weight="400">·</text><rect x="236" y="191" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="274" y="191" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="312" y="191" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="350" y="191" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="388" y="191" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="426" y="191" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="464" y="191" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="502" y="191" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="236" y="215" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="274" y="215" width="38" height="24" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.2"/><rect x="312" y="215" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="350" y="215" width="38" height="24" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.2"/><rect x="388" y="215" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="426" y="215" width="38" height="24" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.2"/><rect x="464" y="215" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><rect x="502" y="215" width="38" height="24" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.2"/><foreignObject x="228" y="164" width="320" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111" data-tex="W_h=\left[\,W_{hi}\;|\;W_{hf}\;|\;W_{hg}\;|\;W_{ho}\,\right]"></div></foreignObject><text x="388" y="255" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">[H × 4H] = [2 × 8]</text><text x="560" y="222" font-size="24" fill="#111111" text-anchor="middle" font-weight="400">=</text><rect x="584" y="200" width="38" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="603" y="219.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">0,020</text><rect x="622" y="200" width="38" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="641" y="219.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">−0,066</text><rect x="660" y="200" width="38" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="679" y="219.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">0,086</text><rect x="698" y="200" width="38" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="717" y="219.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">−0,014</text><rect x="736" y="200" width="38" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="755" y="219.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">0,056</text><rect x="774" y="200" width="38" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="793" y="219.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">−0,115</text><rect x="812" y="200" width="38" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="831" y="219.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">−0,066</text><rect x="850" y="200" width="38" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="869" y="219.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">0,020</text><foreignObject x="636" y="172" width="200" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111" data-tex="h_1W_h"></div></foreignObject><text x="736" y="248" font-size="12.5" fill="#5E5850" text-anchor="middle" font-weight="400">[1 × 8]</text></g>
<g data-key="r3"><foreignObject x="40" y="283" width="220" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111" data-tex="a=x_2W_x+h_1W_h+b"></div></foreignObject><text x="40" y="322" font-size="12.5" fill="#5E5850" text-anchor="start" font-weight="400">[1 × 8] + [1 × 8] + [8]</text><text x="260" y="320" font-size="14" fill="#111111" text-anchor="start" font-weight="400">b =</text><rect x="290" y="300" width="38" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="309" y="319.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,0</text><rect x="328" y="300" width="38" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="347" y="319.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,0</text><rect x="366" y="300" width="38" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="385" y="319.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">1,0</text><rect x="404" y="300" width="38" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="423" y="319.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">1,0</text><rect x="442" y="300" width="38" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="461" y="319.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,1</text><rect x="480" y="300" width="38" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="499" y="319.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">−0,1</text><rect x="518" y="300" width="38" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="537" y="319.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,0</text><rect x="556" y="300" width="38" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="575" y="319.5" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="400">0,0</text><text x="612" y="320" font-size="14" fill="#111111" text-anchor="start" font-weight="700">a =</text><rect x="640" y="300" width="38" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="659" y="319.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">0,520</text><rect x="678" y="300" width="38" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="697" y="319.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">−0,266</text><rect x="716" y="300" width="38" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="735" y="319.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">0,686</text><rect x="754" y="300" width="38" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="773" y="319.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">1,486</text><rect x="792" y="300" width="38" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="811" y="319.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">0,356</text><rect x="830" y="300" width="38" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="849" y="319.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">0,685</text><rect x="868" y="300" width="38" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="887" y="319.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">0,034</text><rect x="906" y="300" width="38" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="925" y="319.5" font-size="11.5" fill="#111111" text-anchor="middle" font-weight="400">−0,280</text></g>
<g data-key="r4"><foreignObject x="40" y="370" width="220" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#8C7106" data-tex="i_2=\sigma\left(a[0{:}2]\right)"></div></foreignObject><rect x="40" y="398" width="58" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="69" y="417.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,6271</text><rect x="98" y="398" width="58" height="30" rx="0" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><text x="127" y="417.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,4340</text><text x="166" y="418" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">[1 × 2]</text><foreignObject x="268" y="370" width="220" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#C30B0A" data-tex="f_2=\sigma\left(a[2{:}4]\right)"></div></foreignObject><rect x="268" y="398" width="58" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="297" y="417.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,6650</text><rect x="326" y="398" width="58" height="30" rx="0" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.4"/><text x="355" y="417.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,8155</text><text x="394" y="418" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">[1 × 2]</text><foreignObject x="496" y="370" width="220" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#3576C0" data-tex="g_2=\tanh\left(a[4{:}6]\right)"></div></foreignObject><rect x="496" y="398" width="58" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="525" y="417.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,3414</text><rect x="554" y="398" width="58" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="583" y="417.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,5944</text><text x="622" y="418" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">[1 × 2]</text><foreignObject x="724" y="370" width="220" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#73B222" data-tex="o_2=\sigma\left(a[6{:}8]\right)"></div></foreignObject><rect x="724" y="398" width="58" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="753" y="417.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,5086</text><rect x="782" y="398" width="58" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="811" y="417.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,4304</text><text x="850" y="418" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">[1 × 2]</text></g>
<g data-key="r5"><foreignObject x="40" y="458" width="240" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#2A5E9B" data-tex="c_2=f_2\odot c_1+i_2\odot g_2"></div></foreignObject><rect x="40" y="486" width="58" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="69" y="505.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,4193</text><rect x="98" y="486" width="58" height="30" rx="0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.4"/><text x="127" y="505.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,0147</text><text x="166" y="506" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">[B × H]</text><foreignObject x="300" y="458" width="210" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#5A8C1C" data-tex="h_2=o_2\odot\tanh c_2"></div></foreignObject><rect x="300" y="486" width="58" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="329" y="505.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,2015</text><rect x="358" y="486" width="58" height="30" rx="0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="387" y="505.5" font-size="12" fill="#111111" text-anchor="middle" font-weight="400">0,0063</text><text x="426" y="506" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">[B × H]</text></g>
<g data-key="pt" data-only="1"><rect x="520" y="450" width="420" height="136" rx="10" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/><text x="536" y="474" font-size="13" fill="#111111" text-anchor="start" font-weight="700">nn.LSTM хранит те же числа транспонированными</text><text x="536" y="500" font-size="12.5" fill="#2A5E9B" text-anchor="start" font-weight="400" font-family="Courier New, monospace">weight_ih_l0</text><text x="760" y="500" font-size="12.5" fill="#111111" text-anchor="start" font-weight="400">[4H × E] = Wₓᵀ</text><text x="536" y="522" font-size="12.5" fill="#2A5E9B" text-anchor="start" font-weight="400" font-family="Courier New, monospace">weight_hh_l0</text><text x="760" y="522" font-size="12.5" fill="#111111" text-anchor="start" font-weight="400">[4H × H] = Wₕᵀ</text><text x="536" y="544" font-size="12.5" fill="#2A5E9B" text-anchor="start" font-weight="400" font-family="Courier New, monospace">bias_ih_l0 + bias_hh_l0</text><text x="760" y="544" font-size="12.5" fill="#111111" text-anchor="start" font-weight="400">[4H] = b</text><text x="536" y="566" font-size="12.5" fill="#2A5E9B" text-anchor="start" font-weight="400" font-family="Courier New, monospace">порядок блоков</text><text x="760" y="566" font-size="12.5" fill="#111111" text-anchor="start" font-weight="400">i, f, g, o</text></g>
<g data-key="nt" data-only="1"><rect x="520" y="450" width="420" height="136" rx="10" fill="#FAFAF8" stroke="#E4E1D7" stroke-width="1.5"/><text x="536" y="476" font-size="13" fill="#111111" text-anchor="start" font-weight="700">Один такт = два матричных умножения</text><text x="536" y="502" font-size="12.5" fill="#5E5850" text-anchor="start" font-weight="400">вместо восьми маленьких: все четыре слоя</text><text x="536" y="522" font-size="12.5" fill="#5E5850" text-anchor="start" font-weight="400">склеены по столбцам в две матрицы.</text><text x="536" y="548" font-size="12.5" fill="#5E5850" text-anchor="start" font-weight="400">Цвет столбца — слой: i, f, g, o.</text><text x="536" y="570" font-size="12.5" fill="#5E5850" text-anchor="start" font-weight="400">Пример: такт 2, B = 1, E = 4, H = 2.</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="r1 r2 r3 r4 r5 nt" data-focus="r1 r2">
      <div class="step-kicker">Шаг 1 · общая картина</div>
      <h4>Четыре слоя — одна матрица</h4>
      <p>Вместо четырёх матриц <span class="math-inline" data-tex="W_{xi}, W_{xf}, W_{xg}, W_{xo}"></span> размера <span class="math-inline" data-tex="[E\times H]"></span> их склеивают по столбцам в одну, <span class="math-inline" data-tex="W_x"></span> размера <span class="math-inline" data-tex="[E\times 4H]"></span>. Так же склеивают <span class="math-inline" data-tex="W_h"></span> и сдвиги. Тогда весь такт — два матричных умножения и одно сложение, а не восемь маленьких умножений. На видеокарте это заметно быстрее. Числа на схеме — второй такт нашего примера.</p>
    </div>
    <div class="step-panel" data-on="r1 nt" data-focus="r1">
      <div class="step-kicker">Шаг 2 · вход</div>
      <h4>x₂W_x: строка длиной 4H</h4>
      <p>Строка <span class="math-inline" data-tex="x_2"></span> имеет форму <span class="math-inline" data-tex="[1\times4]"></span>, <span class="math-inline" data-tex="W_x"></span> — <span class="math-inline" data-tex="[4\times8]"></span>, произведение — <span class="math-inline" data-tex="[1\times 8]"></span>. One-hot вектор слова you выбирает вторую строку <span class="math-inline" data-tex="W_x"></span>, то есть вторые строки всех четырёх матриц подряд: <span class="math-inline" data-tex="(0{,}5;\,-0{,}2)"></span> из <span class="math-inline" data-tex="W_{xi}"></span>, <span class="math-inline" data-tex="(-0{,}4;\,0{,}5)"></span> из <span class="math-inline" data-tex="W_{xf}"></span> и так далее.</p>
    </div>
    <div class="step-panel" data-on="r2 nt" data-focus="r2">
      <div class="step-kicker">Шаг 3 · память</div>
      <h4>h₁W_h: та же длина 4H</h4>
      <p><span class="math-inline" data-tex="h_1"></span> — строка <span class="math-inline" data-tex="[1\times2]"></span>, <span class="math-inline" data-tex="W_h"></span> — <span class="math-inline" data-tex="[2\times 8]"></span>. Результат опять <span class="math-inline" data-tex="[1\times 8]"></span>, поэтому его можно сложить с <span class="math-inline" data-tex="x_2W_x"></span> поэлементно. В батче из <span class="math-inline" data-tex="B"></span> последовательностей все строки становятся матрицами <span class="math-inline" data-tex="[B\times\ldots]"></span>, а формы весов не меняются.</p>
    </div>
    <div class="step-panel" data-on="r1 r2 r3 nt" data-focus="r3">
      <div class="step-kicker">Шаг 4 · сумма</div>
      <h4>Предактивации всех слоёв сразу</h4>
      <p>Складываем две строки и сдвиг: получаем <span class="math-inline" data-tex="a"></span> длины 8. Первые две координаты — предактивация ворот входа, следующие две — ворот забывания, потом кандидата и ворот выхода.</p>
    </div>
    <div class="step-panel" data-on="r3 r4 nt" data-focus="r4">
      <div class="step-kicker">Шаг 5 · разрезание</div>
      <h4>Режем на четыре куска по H</h4>
      <p>Строку <span class="math-inline" data-tex="a"></span> режут на четыре куска длины <span class="math-inline" data-tex="H"></span> и к каждому применяют свою функцию: сигмоиду к трём воротам и <span class="math-inline" data-tex="\tanh"></span> к кандидату. Значения совпадают с тем, что мы считали по отдельным матрицам: склейка ничего не меняет в арифметике.</p>
    </div>
    <div class="step-panel" data-on="r4 r5 nt" data-focus="r5">
      <div class="step-kicker">Шаг 6 · выход</div>
      <h4>c₂ и h₂ имеют форму [B × H]</h4>
      <p>Дальше только поэлементные операции, формы не меняются: <span class="math-inline" data-tex="c_2"></span> и <span class="math-inline" data-tex="h_2"></span> — строки длины <span class="math-inline" data-tex="H"></span>. В батче — матрицы <span class="math-inline" data-tex="[B\times H]"></span>.</p>
    </div>
    <div class="step-panel" data-on="r1 r2 r3 r4 r5 pt" data-focus="pt">
      <div class="step-kicker">Шаг 7 · PyTorch</div>
      <h4>Как это лежит в nn.LSTM</h4>
      <p>PyTorch хранит веса в виде <code>[выход × вход]</code>, поэтому <code>weight_ih_l0</code> — это <span class="math-inline" data-tex="W_x^{\top}"></span> формы <span class="math-inline" data-tex="[4H\times E]"></span>. Порядок блоков по строкам — i, f, g, o. Сдвига два, <code>bias_ih_l0</code> и <code>bias_hh_l0</code>, в формулу входит их сумма. Это нужно знать, чтобы загрузить свои веса в <code>nn.LSTM</code>; в коде части 8 так и сделано.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Переключайте шаги кнопками или стрелками ← → на клавиатуре, когда сцена в фокусе.</p>

<div class="lstm-table"><table class="shape-table">
  <tr><th>тензор</th><th>форма</th><th>в примере</th></tr>
  <tr><td><span class="math-inline" data-tex="X_t"></span> — батч токенов на такте <span class="math-inline" data-tex="t"></span></td><td><span class="math-inline" data-tex="[B\times E]"></span></td><td><span class="math-inline" data-tex="[1\times4]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="H_{t-1},\ C_{t-1}"></span></td><td><span class="math-inline" data-tex="[B\times H]"></span></td><td><span class="math-inline" data-tex="[1\times2]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="W_x = [W_{xi}\,|\,W_{xf}\,|\,W_{xg}\,|\,W_{xo}]"></span></td><td><span class="math-inline" data-tex="[E\times4H]"></span></td><td><span class="math-inline" data-tex="[4\times8]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="W_h"></span></td><td><span class="math-inline" data-tex="[H\times4H]"></span></td><td><span class="math-inline" data-tex="[2\times8]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="b"></span></td><td><span class="math-inline" data-tex="[4H]"></span></td><td><span class="math-inline" data-tex="[8]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="A = X_tW_x + H_{t-1}W_h + b"></span></td><td><span class="math-inline" data-tex="[B\times4H]"></span></td><td><span class="math-inline" data-tex="[1\times8]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="I, F, G, O"></span> — куски <span class="math-inline" data-tex="A"></span> после активаций</td><td><span class="math-inline" data-tex="[B\times H]"></span></td><td><span class="math-inline" data-tex="[1\times2]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="C_t,\ H_t"></span></td><td><span class="math-inline" data-tex="[B\times H]"></span></td><td><span class="math-inline" data-tex="[1\times2]"></span></td></tr>
  <tr><td><span class="math-inline" data-tex="W_{hy}"></span>, <span class="math-inline" data-tex="b_y"></span> — выходной слой</td><td><span class="math-inline" data-tex="[H\times V]"></span>, <span class="math-inline" data-tex="[V]"></span></td><td><span class="math-inline" data-tex="[2\times4]"></span>, <span class="math-inline" data-tex="[4]"></span></td></tr>
</table></div>

<p>
  Параметров в ячейке <span class="math-inline" data-tex="4(EH + H^2 + H)"></span>: четыре слоя, у каждого две матрицы и сдвиг. В примере <span class="math-inline" data-tex="4\cdot(8+4+2) = 56"></span>, плюс
  выходной слой <span class="math-inline" data-tex="2\cdot4+4 = 12"></span>, всего 68. У RNN с теми же размерами было <span class="math-inline" data-tex="8+4+2+12 = 26"></span>. PyTorch хранит два сдвига,
  поэтому <code>nn.LSTM</code> покажет <span class="math-inline" data-tex="4(EH + H^2 + 2H)"></span>.
</p>

<div class="stage slider-stage" id="pmStage">
<div class="slider-grid">
<div class="stage-figure">
<svg id="pmSvg" viewBox="0 0 680 420" role="img" aria-label="Число параметров ячеек RNN, GRU и LSTM"><line x1="70" y1="360" x2="650" y2="360" class="ls-grid"/><line x1="70" y1="285" x2="650" y2="285" class="ls-grid"/><line x1="70" y1="210" x2="650" y2="210" class="ls-grid"/><line x1="70" y1="135" x2="650" y2="135" class="ls-grid"/><line x1="70" y1="60" x2="650" y2="60" class="ls-grid"/><line x1="70" y1="360" x2="650" y2="360" class="ls-axis"/><text x="70" y="26" class="ls-cap">параметров в ячейке, E = H</text><rect id="pb_rnn" x="130" width="120" fill="#C30B0A" opacity="0.85" rx="4"/><text x="190" y="384" text-anchor="middle" font-size="15" font-weight="800" fill="#111" font-family="Helvetica, Arial, sans-serif">RNN</text><text id="pt_rnn" x="190" text-anchor="middle" font-size="15" font-weight="700" fill="#111" font-family="Helvetica, Arial, sans-serif"></text><text x="190" y="404" text-anchor="middle" font-size="12.5" fill="#5E5850" font-family="Helvetica, Arial, sans-serif">EH + H² + H</text><rect id="pb_gru" x="310" width="120" fill="#C29E08" opacity="0.85" rx="4"/><text x="370" y="384" text-anchor="middle" font-size="15" font-weight="800" fill="#111" font-family="Helvetica, Arial, sans-serif">GRU</text><text id="pt_gru" x="370" text-anchor="middle" font-size="15" font-weight="700" fill="#111" font-family="Helvetica, Arial, sans-serif"></text><text x="370" y="404" text-anchor="middle" font-size="12.5" fill="#5E5850" font-family="Helvetica, Arial, sans-serif">3(EH + H² + H)</text><rect id="pb_lstm" x="490" width="120" fill="#3576C0" opacity="0.85" rx="4"/><text x="550" y="384" text-anchor="middle" font-size="15" font-weight="800" fill="#111" font-family="Helvetica, Arial, sans-serif">LSTM</text><text id="pt_lstm" x="550" text-anchor="middle" font-size="15" font-weight="700" fill="#111" font-family="Helvetica, Arial, sans-serif"></text><text x="550" y="404" text-anchor="middle" font-size="12.5" fill="#5E5850" font-family="Helvetica, Arial, sans-serif">4(EH + H² + H)</text></svg>
</div>
<div class="slider-panel">
<label class="range-label" for="pmH">размер состояния <span style="text-transform:none">H</span></label>
<input id="pmH" type="range" min="0" max="8" step="1" value="4">
<div id="pmHv" class="live-number small">256</div>
<div class="live-caption">вход того же размера: E = H</div>
<div id="pmL" class="live-number" style="color:#3576C0"></div>
<div class="live-caption">параметров у LSTM — ровно вчетверо больше, чем у RNN</div>
<div id="pmT" class="live-caption"></div>
</div>
</div>
</div>
<p class="stage-hint">Высоты столбцов — в одном масштабе. Отношение 1 : 3 : 4 не зависит от H: у GRU три слоя, у LSTM четыре.</p>
<script>
(function () {
  var r = document.getElementById('pmH'); if (!r) return;
  var HS = [16, 32, 64, 128, 256, 512, 768, 1024, 2048];
  function sp(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function draw() {
    var H = HS[+r.value], E = H, base = E * H + H * H + H;
    var v = { rnn: base, gru: 3 * base, lstm: 4 * base }, mx = 4 * base;
    ['rnn', 'gru', 'lstm'].forEach(function (k) {
      var h = v[k] / mx * 290, b = document.getElementById('pb_' + k), t = document.getElementById('pt_' + k);
      b.setAttribute('y', 360 - h); b.setAttribute('height', h); t.setAttribute('y', 352 - h); t.textContent = sp(v[k]);
    });
    document.getElementById('pmHv').textContent = H;
    document.getElementById('pmL').textContent = sp(4 * base);
    document.getElementById('pmT').innerHTML = 'Умножений на такт у LSTM ≈ ' + sp(4 * (E * H + H * H)) + ' — тоже вчетверо больше, чем у RNN.';
  }
  r.addEventListener('input', draw); draw();
})();
</script>

## Часть 8. Код: три версии одной LSTM

<p>
  Все три версии считают одну и ту же сеть на одной и той же фразе и печатают одинаковые числа: потерю 1,4202,
  градиенты и потерю 1,3606 после одного шага SGD с <span class="math-inline" data-tex="\eta = 0{,}5"></span>.
</p>

### Версия 1. Функции на NumPy: forward и BPTT вручную

<p>
  Каждый слой хранится отдельной матрицей, как в формулах статьи. Функция <code>backward</code> — это шесть строк из части 5:
  два потока <code>dh</code> и <code>dc</code>, четыре градиента предактиваций, суммирование по тактам. В конце — проверка
  центральными разностями и один шаг спуска.
</p>

```python
import numpy as np

# Фраза: на каждом такте предсказываем следующее слово.
vocab = ["<BOS>", "you", "will", "pass"]
idx = {w: i for i, w in enumerate(vocab)}
inp = ["<BOS>", "you", "will"]
tgt = ["you", "will", "pass"]
X = np.eye(4)[[idx[w] for w in inp]]          # (T, E) = (3, 4)
Y = np.eye(4)[[idx[w] for w in tgt]]          # (T, V) = (3, 4)
T = len(inp)

# Веса из статьи. Кандидат g и выходной слой взяты из статьи про RNN.
P = {
    "Wx": {"i": [[0.3, 0.6], [0.5, -0.2], [0.4, 0.1], [-0.3, 0.2]],
           "f": [[0.2, -0.3], [-0.4, 0.5], [0.6, 0.1], [0.1, -0.2]],
           "g": [[0.5, -0.4], [0.2, 0.9], [-0.6, 0.3], [0.7, 0.1]],
           "o": [[0.4, 0.2], [0.1, -0.3], [-0.2, 0.5], [0.3, 0.4]]},
    "Wh": {"i": [[0.2, -0.1], [0.1, 0.3]], "f": [[0.3, 0.1], [-0.2, 0.2]],
           "g": [[0.4, -0.2], [0.1, 0.5]], "o": [[-0.1, 0.2], [0.3, 0.1]]},
    "b": {"i": [0, 0], "f": [1, 1], "g": [0.1, -0.1], "o": [0, 0]},
}
P = {k: {g: np.array(v, float) for g, v in d.items()} for k, d in P.items()}
Why = np.array([[0.3, -0.5, 0.8, 0.2], [-0.7, 0.6, 0.1, 0.4]])
by = np.array([0.0, 0.1, -0.2, 0.0])
G = "ifgo"

def sigmoid(a):
    return 1 / (1 + np.exp(-a))

def forward(P, Why, by):
    h, c = np.zeros(2), np.zeros(2)
    cache, loss = [], 0.0
    for t in range(T):
        a = {k: X[t] @ P["Wx"][k] + h @ P["Wh"][k] + P["b"][k] for k in G}
        i, f, o = sigmoid(a["i"]), sigmoid(a["f"]), sigmoid(a["o"])
        g = np.tanh(a["g"])
        c_new = f * c + i * g
        h_new = o * np.tanh(c_new)
        z = h_new @ Why + by
        p = np.exp(z - z.max()); p /= p.sum()
        loss += -np.log(p @ Y[t]) / T
        cache.append(dict(h_prev=h, c_prev=c, i=i, f=f, g=g, o=o, c=c_new, h=h_new, p=p))
        h, c = h_new, c_new
    return loss, cache

def backward(P, Why, cache):
    dP = {k: {g: np.zeros_like(v) for g, v in d.items()} for k, d in P.items()}
    dWhy, dby = np.zeros_like(Why), np.zeros_like(by)
    dh_next, dc_next, f_next = np.zeros(2), np.zeros(2), np.zeros(2)
    for t in reversed(range(T)):
        s = cache[t]
        dz = (s["p"] - Y[t]) / T
        dWhy += np.outer(s["h"], dz); dby += dz
        dh = dz @ Why.T + dh_next                                # своё + из такта t+1
        tc = np.tanh(s["c"])
        dc = dh * s["o"] * (1 - tc ** 2) + dc_next * f_next      # через h + по линии памяти
        da = {"i": dc * s["g"] * s["i"] * (1 - s["i"]),
              "f": dc * s["c_prev"] * s["f"] * (1 - s["f"]),
              "g": dc * s["i"] * (1 - s["g"] ** 2),
              "o": dh * tc * s["o"] * (1 - s["o"])}
        for k in G:
            dP["Wx"][k] += np.outer(X[t], da[k])
            dP["Wh"][k] += np.outer(s["h_prev"], da[k])
            dP["b"][k] += da[k]
        dh_next = sum(da[k] @ P["Wh"][k].T for k in G)
        dc_next, f_next = dc, s["f"]
    return dP, dWhy, dby

loss, cache = forward(P, Why, by)
dP, dWhy, dby = backward(P, Why, cache)
print("loss:", round(loss, 4))
print("dW_xf:\n", dP["Wx"]["f"].round(4))

# Проверка градиента центральными разностями.
eps, worst = 1e-6, 0.0
for k in G:
    for name in ("Wx", "Wh", "b"):
        A = P[name][k]
        for ix in np.ndindex(A.shape):
            old = A[ix]
            A[ix] = old + eps; lp, _ = forward(P, Why, by)
            A[ix] = old - eps; lm, _ = forward(P, Why, by)
            A[ix] = old
            worst = max(worst, abs((lp - lm) / (2 * eps) - dP[name][k][ix]))
print("max |analytic - numeric|: %.1e" % worst)

# Один шаг градиентного спуска.
lr = 0.5
for k in G:
    for name in ("Wx", "Wh", "b"):
        P[name][k] -= lr * dP[name][k]
Why -= lr * dWhy; by -= lr * dby
print("loss after one step:", round(forward(P, Why, by)[0], 4))
```

```text
loss: 1.4202
dW_xf:
 [[ 0.      0.    ]
 [-0.0062  0.0023]
 [-0.0004 -0.0002]
 [ 0.      0.    ]]
max |analytic - numeric|: 1.7e-10
loss after one step: 1.3606
```

### Версия 2. NumPy-класс со склеенными весами

<p>
  Здесь четыре слоя склеены в <span class="math-inline" data-tex="W_x"></span> формы <span class="math-inline" data-tex="[E\times4H]"></span> и <span class="math-inline" data-tex="W_h"></span> формы <span class="math-inline" data-tex="[H\times4H]"></span>, как в части 7: такт — одно
  умножение и разрезание на четыре куска. Числа те же. Дальше 300 эпох спуска на этой фразе: сеть запоминает её почти
  наизусть.
</p>

```python
import numpy as np

def sigmoid(a):
    return 1 / (1 + np.exp(-a))

class LSTM:
    """Одна ячейка LSTM со склеенными весами: столбцы идут блоками i, f, g, o."""

    def __init__(self, Wx, Wh, b, Why, by):
        self.Wx, self.Wh, self.b = Wx, Wh, b          # (E, 4H), (H, 4H), (4H,)
        self.Why, self.by = Why, by                   # (H, V), (V,)
        self.H = Wh.shape[0]

    def step(self, x, h, c):
        H = self.H
        a = x @ self.Wx + h @ self.Wh + self.b        # (4H,) за одно умножение
        i, f = sigmoid(a[:H]), sigmoid(a[H:2 * H])
        g, o = np.tanh(a[2 * H:3 * H]), sigmoid(a[3 * H:])
        c = f * c + i * g
        h = o * np.tanh(c)
        return h, c, (a, i, f, g, o)

    def forward(self, X, Y):
        h, c = np.zeros(self.H), np.zeros(self.H)
        self.cache, loss = [], 0.0
        for x, y in zip(X, Y):
            h_prev, c_prev = h, c
            h, c, gates = self.step(x, h, c)
            z = h @ self.Why + self.by
            p = np.exp(z - z.max()); p /= p.sum()
            loss += -np.log(p @ y) / len(X)
            self.cache.append((x, y, h_prev, c_prev, h, c, p, gates))
        return loss

    def backward(self):
        H, T = self.H, len(self.cache)
        dWx, dWh, db = np.zeros_like(self.Wx), np.zeros_like(self.Wh), np.zeros_like(self.b)
        dWhy, dby = np.zeros_like(self.Why), np.zeros_like(self.by)
        dh_next, dc_next, f_next = np.zeros(H), np.zeros(H), np.zeros(H)
        for x, y, h_prev, c_prev, h, c, p, (a, i, f, g, o) in reversed(self.cache):
            dz = (p - y) / T
            dWhy += np.outer(h, dz); dby += dz
            dh = dz @ self.Why.T + dh_next
            tc = np.tanh(c)
            dc = dh * o * (1 - tc ** 2) + dc_next * f_next
            da = np.concatenate([dc * g * i * (1 - i), dc * c_prev * f * (1 - f),
                                 dc * i * (1 - g ** 2), dh * tc * o * (1 - o)])
            dWx += np.outer(x, da); dWh += np.outer(h_prev, da); db += da
            dh_next, dc_next, f_next = da @ self.Wh.T, dc, f
        return dWx, dWh, db, dWhy, dby

    def sgd(self, lr):
        for p, d in zip((self.Wx, self.Wh, self.b, self.Why, self.by), self.backward()):
            p -= lr * d

# Те же веса, что в версии 1, склеенные по столбцам в порядке i, f, g, o.
Wx = np.array([[0.3, 0.6, 0.2, -0.3, 0.5, -0.4, 0.4, 0.2],
               [0.5, -0.2, -0.4, 0.5, 0.2, 0.9, 0.1, -0.3],
               [0.4, 0.1, 0.6, 0.1, -0.6, 0.3, -0.2, 0.5],
               [-0.3, 0.2, 0.1, -0.2, 0.7, 0.1, 0.3, 0.4]])
Wh = np.array([[0.2, -0.1, 0.3, 0.1, 0.4, -0.2, -0.1, 0.2],
               [0.1, 0.3, -0.2, 0.2, 0.1, 0.5, 0.3, 0.1]])
b = np.array([0, 0, 1, 1, 0.1, -0.1, 0, 0], float)
Why = np.array([[0.3, -0.5, 0.8, 0.2], [-0.7, 0.6, 0.1, 0.4]])
by = np.array([0.0, 0.1, -0.2, 0.0])

X = np.eye(4)[[0, 1, 2]]    # <BOS> you will
Y = np.eye(4)[[1, 2, 3]]    # you will pass

net = LSTM(Wx, Wh, b, Why, by)
print("loss:", round(net.forward(X, Y), 4))
dWx, dWh, db, *_ = net.backward()
print("db (i, f, g, o):", db.round(4))
for epoch in range(1, 301):
    net.forward(X, Y)
    net.sgd(0.5)
    if epoch in (1, 10, 100, 300):
        print(f"epoch {epoch:3d}  loss {net.forward(X, Y):.4f}")
```

```text
loss: 1.4202
db (i, f, g, o): [ 0.0012  0.0053 -0.0065  0.0022 -0.0286 -0.1169 -0.0042  0.0124]
epoch   1  loss 1.3606
epoch  10  loss 1.1382
epoch 100  loss 0.1224
epoch 300  loss 0.0156
```

### Версия 3. PyTorch: nn.LSTM с нашими весами

<p>
  <code>nn.LSTM</code> считает ту же ячейку, нужно только правильно загрузить веса: транспонировать, сохранить порядок блоков
  i, f, g, o и учесть, что сдвигов два. Если оставить <code>bias_hh_l0</code> обучаемым, оба сдвига получат одинаковый
  градиент, SGD сдвинет их сумму вдвое сильнее, и после шага выйдет 1,3542 вместо 1,3606. Поэтому второй сдвиг здесь
  заморожен. Градиент <code>bias_ih_l0</code> совпадает с <span class="math-inline" data-tex="db"></span> из версии 2.
</p>

```python
import torch
from torch import nn

torch.set_printoptions(precision=4, sci_mode=False)

class CharLSTM(nn.Module):
    def __init__(self, vocab_size, hidden_size):
        super().__init__()
        self.lstm = nn.LSTM(vocab_size, hidden_size, batch_first=True)
        self.out = nn.Linear(hidden_size, vocab_size)

    def forward(self, x):                 # x: (B, T, V)
        h, (h_T, c_T) = self.lstm(x)      # h: (B, T, H) — выходы всех тактов
        return self.out(h)                # (B, T, V) — логиты

# Наши склеенные веса (E, 4H) и (H, 4H), блоки i, f, g, o — как в версии 2.
Wx = torch.tensor([[0.3, 0.6, 0.2, -0.3, 0.5, -0.4, 0.4, 0.2],
                   [0.5, -0.2, -0.4, 0.5, 0.2, 0.9, 0.1, -0.3],
                   [0.4, 0.1, 0.6, 0.1, -0.6, 0.3, -0.2, 0.5],
                   [-0.3, 0.2, 0.1, -0.2, 0.7, 0.1, 0.3, 0.4]])
Wh = torch.tensor([[0.2, -0.1, 0.3, 0.1, 0.4, -0.2, -0.1, 0.2],
                   [0.1, 0.3, -0.2, 0.2, 0.1, 0.5, 0.3, 0.1]])
b = torch.tensor([0, 0, 1, 1, 0.1, -0.1, 0, 0])
Why = torch.tensor([[0.3, -0.5, 0.8, 0.2], [-0.7, 0.6, 0.1, 0.4]])
by = torch.tensor([0.0, 0.1, -0.2, 0.0])

model = CharLSTM(4, 2)
with torch.no_grad():                     # PyTorch хранит веса как [выход × вход]
    model.lstm.weight_ih_l0.copy_(Wx.T)   # (4H, E)
    model.lstm.weight_hh_l0.copy_(Wh.T)   # (4H, H)
    model.lstm.bias_ih_l0.copy_(b)
    model.lstm.bias_hh_l0.zero_()         # в формулу входит сумма двух сдвигов
    model.out.weight.copy_(Why.T)
    model.out.bias.copy_(by)
model.lstm.bias_hh_l0.requires_grad_(False)  # иначе SGD сдвинет сумму сдвигов дважды

x = torch.eye(4)[[0, 1, 2]].unsqueeze(0)  # (1, 3, 4): <BOS> you will
y = torch.tensor([[1, 2, 3]])             # you will pass
loss_fn = nn.CrossEntropyLoss()

logits = model(x)
loss = loss_fn(logits.reshape(-1, 4), y.reshape(-1))
loss.backward()
print("loss:", round(loss.item(), 4))
print("grad bias_ih (i, f, g, o):", model.lstm.bias_ih_l0.grad)

opt = torch.optim.SGD(model.parameters(), lr=0.5)
opt.step()
with torch.no_grad():
    print("loss after one step:", round(loss_fn(model(x).reshape(-1, 4), y.reshape(-1)).item(), 4))
```

```text
loss: 1.4202
grad bias_ih (i, f, g, o): tensor([ 0.0012,  0.0053, -0.0065,  0.0022, -0.0286, -0.1169, -0.0042,  0.0124])
loss after one step: 1.3606
```

### Опыт с памятью из части 1

<p>
  Короткая версия опыта на готовых <code>nn.RNN</code> и <code>nn.LSTM</code>. Начальные веса у них устроены не так, как
  у ячеек из основного опыта, поэтому отдельные запуски могут отличаться, но картина та же.
</p>

```python
import torch
from torch import nn

H, STEPS, T = 8, 3000, 50

def batch(n, gen):
    """Первый токен A (0) или B (1), дальше T-1 шумовых токенов x (2) / y (3)."""
    first = torch.randint(0, 2, (n,), generator=gen)
    noise = torch.randint(2, 4, (n, T - 1), generator=gen)
    tokens = torch.cat([first[:, None], noise], 1)
    return nn.functional.one_hot(tokens, 4).float(), first

class Memory(nn.Module):
    def __init__(self, kind, forget_bias=1.0):
        super().__init__()
        cls = nn.LSTM if kind == "lstm" else nn.RNN
        self.rnn = cls(4, H, batch_first=True)
        if kind == "lstm":
            with torch.no_grad():
                self.rnn.bias_ih_l0[H:2 * H] = forget_bias   # блок f
                self.rnn.bias_hh_l0[H:2 * H] = 0.0
        self.out = nn.Linear(H, 2)

    def forward(self, x):
        h, _ = self.rnn(x)
        return self.out(h[:, -1])         # ответ только на последнем такте

def train(kind, forget_bias=1.0, seed=0):
    torch.manual_seed(seed)
    gen = torch.Generator().manual_seed(1000 + seed)
    net = Memory(kind, forget_bias)
    opt = torch.optim.Adam(net.parameters(), lr=1e-2)
    for step in range(STEPS):
        x, y = batch(64, gen)
        loss = nn.functional.cross_entropy(net(x), y)
        opt.zero_grad()
        loss.backward()
        nn.utils.clip_grad_norm_(net.parameters(), 1.0)
        opt.step()
    x, y = batch(2000, torch.Generator().manual_seed(99))
    with torch.no_grad():
        return (net(x).argmax(1) == y).float().mean().item()

torch.set_num_threads(4)
print("RNN            T=50 accuracy:", train("rnn"))
print("LSTM, b_f = 1  T=50 accuracy:", train("lstm", 1.0))
print("LSTM, b_f = 3  T=50 accuracy:", train("lstm", 3.0))
```

```text
RNN            T=50 accuracy: 0.4884999990463257
LSTM, b_f = 1  T=50 accuracy: 0.47850000858306885
LSTM, b_f = 3  T=50 accuracy: 1.0
```

## Часть 9. GRU и другие варианты

<p>
  Самый распространённый родственник LSTM — GRU (gated recurrent unit, Cho и соавторы, 2014). У неё нет отдельной памяти:
  роль линии <span class="math-inline" data-tex="c"></span> играет сам <span class="math-inline" data-tex="h_t"></span>, а ворот двое.
</p>

<div class="math-display" data-tex="\begin{aligned}
z_t&=\sigma\left(x_tW_{xz}+h_{t-1}W_{hz}+b_z\right)&&\text{ворота обновления}\\
r_t&=\sigma\left(x_tW_{xr}+h_{t-1}W_{hr}+b_r\right)&&\text{ворота сброса}\\
\hat h_t&=\tanh\left(x_tW_{xh}+(r_t\odot h_{t-1})W_{hh}+b_h\right)&&\text{кандидат}\\
h_t&=(1-z_t)\odot h_{t-1}+z_t\odot\hat h_t
\end{aligned}"></div>

<p>
  Последняя строка — та же идея, что <span class="math-inline" data-tex="c_t = f\odot c_{t-1} + i\odot g"></span>, только доли забывания и записи связаны:
  <span class="math-inline" data-tex="f = 1-z"></span>, <span class="math-inline" data-tex="i = z"></span>. Сколько стёрли, столько и записали. Ворота сброса <span class="math-inline" data-tex="r_t"></span> решают, какую часть прошлого состояния
  кандидат вообще видит. В PyTorch роли <span class="math-inline" data-tex="z"></span> и <span class="math-inline" data-tex="1-z"></span> в последней строке поменяны местами; формулы эквивалентны.
</p>

<div class="lstm-table"><table class="shape-table">
  <tr><th>ячейка</th><th>состояние</th><th>слоёв</th><th>параметров</th><th>градиент назад по прямому пути</th></tr>
  <tr><td>RNN</td><td><span class="math-inline" data-tex="h"></span></td><td>1</td><td><span class="math-inline" data-tex="EH + H^2 + H"></span></td><td><span class="math-inline" data-tex="\left(\cdot\odot(1-h^2)\right)W_{hh}^{\top}"></span></td></tr>
  <tr><td>LSTM</td><td><span class="math-inline" data-tex="h"></span> и <span class="math-inline" data-tex="c"></span></td><td>4</td><td><span class="math-inline" data-tex="4(EH + H^2 + H)"></span></td><td><span class="math-inline" data-tex="\odot f_t"></span></td></tr>
  <tr><td>GRU</td><td><span class="math-inline" data-tex="h"></span></td><td>3</td><td><span class="math-inline" data-tex="3(EH + H^2 + H)"></span></td><td><span class="math-inline" data-tex="\odot(1-z_t)"></span></td></tr>
  <tr><td>LSTM с peephole</td><td><span class="math-inline" data-tex="h"></span> и <span class="math-inline" data-tex="c"></span></td><td>4</td><td><span class="math-inline" data-tex="+\,3H"></span></td><td>ворота видят ещё и <span class="math-inline" data-tex="c"></span></td></tr>
</table></div>

<p>
  На практике GRU и LSTM решают одни и те же задачи с похожим качеством; GRU на четверть легче. Peephole-связи
  (Gers и Schmidhuber, 2000) добавляют воротам вход <span class="math-inline" data-tex="c_{t-1}"></span> поэлементно, в стандартных библиотеках их нет.
  Дальше рекуррентность убрали совсем: <a href="article.html?slug=transformer">трансформер</a> связывает любые два токена
  напрямую через внимание, и градиенту не нужно идти через все такты между ними.
</p>

## Часть 10. Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>LSTM — ячейка RNN плюс память <span class="math-inline" data-tex="c_t"></span> и трое ворот.</strong> Кандидат <span class="math-inline" data-tex="g_t"></span> — это и есть старая ячейка RNN.</li>
  <li><strong>Ворота — полносвязные слои с сигмоидой</strong> на том же входе <span class="math-inline" data-tex="[x_t, h_{t-1}]"></span>; их значения от 0 до 1 — доли.</li>
  <li><strong>Память:</strong> <span class="math-inline" data-tex="c_t = f_t\odot c_{t-1} + i_t\odot g_t"></span> — забыть часть старого, записать часть нового, только поэлементно.</li>
  <li><strong>Выход:</strong> <span class="math-inline" data-tex="h_t = o_t\odot\tanh c_t"></span>; выходной слой и следующий такт видят только <span class="math-inline" data-tex="h_t"></span>.</li>
  <li><strong>Назад идут два потока:</strong> <span class="math-inline" data-tex="dh_t"></span> через четыре матрицы <span class="math-inline" data-tex="W_{h\cdot}"></span> и <span class="math-inline" data-tex="dc_t"></span> по линии памяти.</li>
  <li><strong>По линии памяти</strong> <span class="math-inline" data-tex="dc_{t-1}"></span> получает <span class="math-inline" data-tex="dc_t\odot f_t"></span>: ни матрицы, ни производной <span class="math-inline" data-tex="\tanh"></span>.</li>
  <li><strong>Это работает, только если <span class="math-inline" data-tex="f\approx1"></span></strong> там, где нужно помнить. Сдвиг <span class="math-inline" data-tex="b_f"></span> от 1 до 3 при инициализации — обязательная настройка.</li>
  <li><strong>Формы:</strong> <span class="math-inline" data-tex="W_x"></span> — <span class="math-inline" data-tex="[E\times4H]"></span>, <span class="math-inline" data-tex="W_h"></span> — <span class="math-inline" data-tex="[H\times4H]"></span>, предактивации <span class="math-inline" data-tex="[B\times4H]"></span> режутся на четыре куска <span class="math-inline" data-tex="[B\times H]"></span>.</li>
  <li><strong>Цена:</strong> вчетверо больше параметров и умножений, чем у RNN, и в пять раз больше сохранённых значений на такт.</li>
  <li><strong>В PyTorch</strong> веса лежат транспонированными, блоки в порядке i, f, g, o, сдвигов два.</li>
</ol>

<p class="tiny">
  Числа прямого и обратного прохода посчитаны скриптом на NumPy и проверены центральными разностями
  (<span class="math-inline" data-tex="\varepsilon = 10^{-6}"></span>, расхождение <span class="math-inline" data-tex="1{,}7\cdot10^{-10}"></span>); значения округлены до четырёх знаков. Опыт с памятью:
  PyTorch, ячейки <code>nn.RNNCell</code> и <code>nn.LSTMCell</code>, <span class="math-inline" data-tex="H = 8"></span>, Adam с шагом 0,01, батч 64,
  3000 шагов (8000 для отдельного столбца <span class="math-inline" data-tex="T = 100"></span>), пять начальных зёрен на каждую клетку таблицы.
</p>
