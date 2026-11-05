<style>
  .prose .stage-figure .is-focus .svg-math > span:not(.katex) { font-weight: 700; }
  .mg, .viz-svg { font-family: Helvetica, Arial, sans-serif; }
  .mg .cap { font-size: 13px; fill: #5E5850; }
  .mg .mm { font-size: 12px; fill: #5E5850; }
  .mg .legend { font-size: 13px; fill: #5E5850; }
  .viz-svg .v-title { fill: #111; font-size: 24px; font-weight: 800; }
  .viz-svg .v-label { fill: #111; font-size: 18px; font-weight: 700; }
  .viz-svg .v-small { fill: #5E5850; font-size: 12.5px; }
  .prose .stage-notes .katex-display { padding-bottom: .35em; }
  .viz-svg .layer-name { fill: #111; font-size: 14px; font-weight: 800; letter-spacing: .01em; }
  .viz-svg .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
  .viz-svg .box-green { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
  .viz-svg .edge-green { fill: none; stroke: #73B222; stroke-width: 2.4; }
  .viz-svg .edge-red { fill: none; stroke: #C30B0A; stroke-width: 2.4; }
  .viz-svg .formula-bg { fill: #FAFAF7; stroke: #D8D4C8; stroke-width: 1.2; }
  .viz-svg .box-blue { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
  .viz-svg .box-red { fill: #FFF4F4; stroke: #C30B0A; stroke-width: 1.6; }
  .slider-card {
    background: #fff;
    border: 1px solid #E4E1D7;
    border-radius: 14px;
    padding: 20px;
    margin: 30px 0 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
  }
  .slider-layout { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(250px, .6fr); gap: 22px; align-items: center; }
  .slider-figure { overflow-x: auto; }
  .slider-figure svg { display: block; width: 100%; height: auto; }
  .slider-control { background: #F8F7F2; border: 1px solid #E4E1D7; border-radius: 12px; padding: 17px; }
  .slider-control label { display: block; font-weight: 800; font-size: 15px; margin-bottom: 10px; }
  .slider-control input[type="range"] { width: 100%; accent-color: #3576C0; min-height: 36px; }
  .slider-value { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-top: 9px; }
  .slider-value strong { font-size: 24px; }
  .slider-value span { color: #5E5850; font-size: 13px; }
  .equation-card { margin-top: 12px; padding: 11px 12px; background: #fff; border: 1px solid #E4E1D7; border-radius: 9px; overflow-x: auto; }
  .equation-card .math-display { margin: 0; font-size: 14px; }
  @media (max-width: 760px) {
    .slider-layout { grid-template-columns: 1fr; }
    .slider-card { padding: 12px; margin-left: -4px; margin-right: -4px; }
    .stage-notes .step-panel .math-display { font-size: 13px; overflow-x: auto; overflow-y: hidden; }
  }
</style>



<p class="lead">
  Логистическая регрессия уже содержит почти весь учебный цикл нейросети:
  линейное преобразование, вероятность, loss, градиенты и обновление. Полносвязная
  сеть добавляет несколько таких преобразований подряд и нелинейность между ними.
</p>

<p>
  Возьмём знакомую логику
  <span class="math-inline" data-tex="\text{forward}\to\text{loss}\to\text{backward}\to\text{update}"></span>
  и протянем её через три полносвязных слоя. В примере два признака проходят через
  два скрытых слоя и превращаются в вероятности двух классов. Одни и те же числа,
  обозначения и цвета сохраняются до конца статьи.
</p>

<div class="semantic-key" aria-label="Цветовые обозначения статьи">
  <span><i style="background:#3576C0"></i>данные и структура</span>
  <span><i style="background:#C29E08"></i>параметры и текущая операция</span>
  <span><i style="background:#73B222"></i>значения forward</span>
  <span><i style="background:#C30B0A"></i>loss и градиенты backward</span>
</div>


<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите только на яркую часть.
  Расположение блоков от шага к шагу не меняется. Каждый шаг разобран под кнопками. Стрелки ← → на
  клавиатуре работают, когда сцена в фокусе.
</div>

<div class="callout-blue">
  <strong>Обозначения:</strong> значение скрытого нейрона пишем <span class="math-inline" data-tex="h"></span>,
  всю строку значений слоя <span class="math-inline" data-tex="\mathbf h^{(l)}"></span>. Ширина слоя, то есть число
  нейронов в нём, это <span class="math-inline" data-tex="H_l"></span>.
</div>

## Часть 1. От логистической регрессии к полносвязной сети

<p>
  Логистическая регрессия строит один логит прямо из входных признаков. В
  полносвязной сети выход каждого слоя становится входом следующего. Слово
  <em>полносвязный</em> означает: каждый нейрон слоя получает значения всех
  нейронов предыдущего слоя.
</p>

<div class="math-display" data-tex="\underbrace{\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)}}_{\text{слой 1}}\;\longrightarrow\;\underbrace{\mathbf h^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)}}_{\text{слой 2}}\;\longrightarrow\;\underbrace{\mathbf h^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)}}_{\text{выход}}"></div>

<p>
  Между линейными слоями стоит ReLU: без нелинейности несколько линейных слоёв
  схлопнутся в один, это покажем в третьей части. Сеть в этой статье имеет два
  скрытых слоя, и они присутствуют в каждом forward и backward ниже.
</p>

### Сначала — один нейрон

<p>
  Нейрон устроен как логистическая регрессия: он умножает признаки на веса,
  складывает результаты, добавляет сдвиг и пропускает полученное число через функцию.
  Разница в функции: на месте сигмоиды стоит ReLU.
</p>

<div class="stage" id="stageOneNeuron" tabindex="0" aria-label="Пошаговая схема одного нейрона">
  <div class="stage-figure">
<svg class="mg" id="mlpn1" viewBox="0 0 960 442" role="img" aria-label="Один нейрон: два входа, два веса, сдвиг, сумматор, ReLU и выход h">
<defs><marker id="mlpn1-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="mlpn1-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="mlpn1-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="35" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>объекты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf W,\ \mathbf b"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>скрытые <span data-tex="\mathbf h"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вероятности <span data-tex="\mathbf p"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">один объект проходит один нейрон слева направо</text>
<g data-key="in"><circle cx="100" cy="118" r="30" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="66" y="88" width="68" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><text x="100" y="166" class="cap" text-anchor="middle">признак 1</text><circle cx="100" cy="235" r="30" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="66" y="205" width="68" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><text x="100" y="283" class="cap" text-anchor="middle">признак 2</text></g>
<g data-key="wts"><line x1="128.53" y1="131.352" x2="320.111" y2="221.012" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn1-arw)"/><line x1="131.5" y1="235" x2="317" y2="235" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn1-arw)"/><foreignObject x="191" y="149" width="80" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#8F7406;font-weight:400" data-tex="\cdot\, w_1"></div></foreignObject><foreignObject x="185" y="207" width="80" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#8F7406;font-weight:400" data-tex="\cdot\, w_2"></div></foreignObject></g>
<g data-key="bias"><circle cx="100" cy="352" r="30" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="66" y="322" width="68" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="b"></div></foreignObject><text x="100" y="400" class="cap" text-anchor="middle">сдвиг</text><line x1="128.53" y1="338.648" x2="320.111" y2="248.988" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn1-arw)"/><foreignObject x="212" y="295" width="40" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject></g>
<g data-key="z"><circle cx="350" cy="235" r="30" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="316" y="205" width="68" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="z"></div></foreignObject><text x="350" y="193" class="cap" text-anchor="middle">сумматор</text></g>
<g data-key="act"><line x1="381.5" y1="235" x2="537" y2="235" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn1-arw)"/><foreignObject x="405" y="204" width="110" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\operatorname{ReLU}"></div></foreignObject><circle cx="570" cy="235" r="30" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="536" y="205" width="68" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h"></div></foreignObject><text x="570" y="193" class="cap" text-anchor="middle">выход нейрона</text></g>
<g data-key="mat" data-only="1"><rect x="650" y="200" width="68" height="34" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/><line x1="684" y1="200" x2="684" y2="234" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="650" y="200" width="34" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><foreignObject x="684" y="200" width="34" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><foreignObject x="653" y="197" width="160" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject><rect x="746" y="183" width="34" height="68" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="746" y1="217" x2="780" y2="217" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="746" y="183" width="34" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="w_1"></div></foreignObject><foreignObject x="746" y="217" width="34" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="w_2"></div></foreignObject><foreignObject x="712" y="197" width="160" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject><rect x="805" y="200" width="34" height="34" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><foreignObject x="805" y="200" width="34" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="b"></div></foreignObject><foreignObject x="771" y="197" width="160" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject><rect x="865" y="200" width="34" height="34" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><foreignObject x="865" y="200" width="34" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="z"></div></foreignObject><foreignObject x="644" y="164" width="80" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 2"></div></foreignObject><foreignObject x="723" y="153" width="80" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="2\times 1"></div></foreignObject><foreignObject x="787" y="164" width="70" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 1"></div></foreignObject><foreignObject x="847" y="164" width="70" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times 1"></div></foreignObject></g>
<g data-key="plot" data-only="1"><line x1="660" y1="280" x2="920" y2="280" stroke="#C9C2B8" stroke-width="1.4"/><line x1="790" y1="150" x2="790" y2="290" stroke="#C9C2B8" stroke-width="1.4"/><line x1="668" y1="280" x2="790" y2="280" stroke="#73B222" stroke-width="3.2"/><line x1="790" y1="280" x2="908" y2="162" stroke="#73B222" stroke-width="3.2"/><foreignObject x="915" y="268" width="30" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z"></div></foreignObject><foreignObject x="789" y="140" width="30" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h"></div></foreignObject><foreignObject x="775" y="292" width="30" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="0"></div></foreignObject></g>
<text x="40" y="428" class="legend">синее: данные · жёлтое: обучаемые числа · зелёное: то, что модель посчитала · красное: потеря</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="in mm0" data-focus="in"><div class="step-kicker">Шаг 1 · вход</div><h4>Объект сводится к признакам</h4><div class="math-display" data-tex="\mathbf x=[x_1,\ x_2]"></div><p>В сквозном примере признаков два, в общем случае их <span class="math-inline" data-tex="P"></span>. Эти числа приходят из данных, и обучение их не меняет.</p></div>
    <div class="step-panel" data-on="in wts mm1" data-focus="wts"><div class="step-kicker">Шаг 2 · веса</div><h4>У каждого признака свой вес</h4><div class="math-display" data-tex="x_1 w_1,\qquad x_2 w_2"></div><p>Вес <span class="math-inline" data-tex="w_p"></span> показывает, на сколько меняется сумма при росте признака <span class="math-inline" data-tex="x_p"></span> на единицу. Веса подбирает обучение.</p></div>
    <div class="step-panel" data-on="in wts z bias mm1" data-focus="z bias"><div class="step-kicker">Шаг 3 · сумматор и сдвиг</div><h4>Всё сворачивается в одно число</h4><div class="math-display" data-tex="z=x_1w_1+x_2w_2+b"></div><p>Сдвиг <span class="math-inline" data-tex="b"></span> поднимает или опускает результат целиком. Без него при нулевых признаках <span class="math-inline" data-tex="z"></span> всегда равнялось бы нулю.</p></div>
    <div class="step-panel" data-on="in wts z bias mat mm1" data-focus="mat"><div class="step-kicker">Шаг 4 · та же сумма в матрицах</div><h4>Сумма записывается как произведение строки на столбец</h4><div class="math-display" data-tex="z=\mathbf x\mathbf w+b,\qquad [1,2]\cdot[2,1]\to[1,1]"></div><p>Те же два умножения и одно сложение. Эта запись без изменений переносится на слой, батч и всю сеть.</p></div>
    <div class="step-panel" data-on="in wts z bias act plot mm2" data-focus="act plot"><div class="step-kicker">Шаг 5 · активация</div><h4>После суммы стоит ещё одна функция</h4><div class="math-display" data-tex="h=\operatorname{ReLU}(z)=\max(0,\ z)"></div><p>До этого места нейрон считал то же, что линейная регрессия. Логистическая ставила здесь сигмоиду, скрытый нейрон ставит ReLU: положительное <span class="math-inline" data-tex="z"></span> проходит без изменений, отрицательное становится нулём. Выход скрытого нейрона обозначаем <span class="math-inline" data-tex="h"></span>.</p></div>
  </div>
</div>

### Из одного нейрона — линейный слой

<p>
  Один нейрон возвращает одно число, а слою нужно несколько. Поставим нейроны рядом:
  вход у них общий, а веса у каждого свои. Столбцы весов собираются в одну матрицу,
  и весь слой считается одним умножением.
</p>

<div class="stage" id="stageLinearLayer" tabindex="0" aria-label="Пошаговая схема линейного слоя">
  <div class="stage-figure">
<svg class="mg" id="mlpn2" viewBox="0 0 960 566" role="img" aria-label="Линейный слой: два входа, два нейрона, матрица весов и ReLU">
<defs><marker id="mlpn2-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="mlpn2-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="mlpn2-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="35" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>объекты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf W,\ \mathbf b"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>скрытые <span data-tex="\mathbf h"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вероятности <span data-tex="\mathbf p"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">вход общий, веса у каждого нейрона свои</text>
<g data-key="in"><text x="190" y="112" class="cap" text-anchor="middle">вход</text><circle cx="190" cy="165" r="28" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="158" y="137" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="190" cy="305" r="28" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="158" y="277" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject></g>
<g data-key="edges"><line x1="219.5" y1="165" x2="439" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn2-arw)"/><line x1="216.386" y1="178.193" x2="442.273" y2="291.136" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn2-arw)"/><line x1="216.386" y1="291.807" x2="442.273" y2="178.864" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn2-arw)"/><line x1="219.5" y1="305" x2="439" y2="305" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn2-arw)"/></g>
<g data-key="wlab"><foreignObject x="275" y="134" width="70" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#8F7406;font-weight:400" data-tex="W_{11}"></div></foreignObject><foreignObject x="271" y="186" width="70" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#8F7406;font-weight:400" data-tex="W_{12}"></div></foreignObject><foreignObject x="271" y="260" width="70" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#8F7406;font-weight:400" data-tex="W_{21}"></div></foreignObject><foreignObject x="275" y="312" width="70" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#8F7406;font-weight:400" data-tex="W_{22}"></div></foreignObject></g>
<g data-key="nz"><circle cx="470" cy="165" r="28" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="438" y="137" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="z_1"></div></foreignObject><circle cx="470" cy="305" r="28" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="438" y="277" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="z_2"></div></foreignObject><text x="512" y="239" class="cap" text-anchor="start">сумматоры</text></g>
<g data-key="bias"><circle cx="470" cy="98" r="19" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="447" y="79" width="46" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="b_1"></div></foreignObject><line x1="470" y1="118.5" x2="470" y2="134" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn2-arw)"/><circle cx="470" cy="372" r="19" fill="#E9E1C2" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="447" y="353" width="46" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="b_2"></div></foreignObject><line x1="470" y1="351.5" x2="470" y2="336" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn2-arw)"/></g>
<g data-key="nh"><line x1="499.5" y1="165" x2="649" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn2-arw)"/><line x1="499.5" y1="305" x2="649" y2="305" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn2-arw)"/><foreignObject x="525" y="135" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\operatorname{ReLU}"></div></foreignObject><foreignObject x="525" y="275" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\operatorname{ReLU}"></div></foreignObject><circle cx="680" cy="165" r="28" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="648" y="137" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_1"></div></foreignObject><circle cx="680" cy="305" r="28" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="648" y="277" width="64" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_2"></div></foreignObject><text x="680" y="112" class="cap" text-anchor="middle">выход слоя</text></g>
<g data-key="mat" data-only="1"><rect x="178" y="440" width="108" height="32" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/><line x1="232" y1="440" x2="232" y2="472" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="178" y="440" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><foreignObject x="232" y="440" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><foreignObject x="283" y="443" width="40" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject><rect x="326" y="424" width="108" height="64" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="380" y1="424" x2="380" y2="488" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="326" y1="456" x2="434" y2="456" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="326" y="424" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="W_{11}"></div></foreignObject><foreignObject x="380" y="424" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="W_{12}"></div></foreignObject><foreignObject x="326" y="456" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="W_{21}"></div></foreignObject><foreignObject x="380" y="456" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="W_{22}"></div></foreignObject><foreignObject x="431" y="443" width="40" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject><rect x="474" y="440" width="108" height="32" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="528" y1="440" x2="528" y2="472" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="474" y="440" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="b_1"></div></foreignObject><foreignObject x="528" y="440" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="b_2"></div></foreignObject><foreignObject x="579" y="443" width="40" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject><rect x="622" y="440" width="108" height="32" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="676" y1="440" x2="676" y2="472" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="622" y="440" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="z_1"></div></foreignObject><foreignObject x="676" y="440" width="54" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="z_2"></div></foreignObject><foreignObject x="182" y="412" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times P"></div></foreignObject><foreignObject x="330" y="396" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="P\times H"></div></foreignObject><foreignObject x="478" y="412" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times H"></div></foreignObject><foreignObject x="626" y="412" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1\times H"></div></foreignObject></g>
<g data-key="hl" data-only="1"><rect x="178" y="440" width="108" height="32" fill="#D83BB9" fill-opacity=".2" stroke="#D83BB9" stroke-width="2"/><rect x="326" y="424" width="54" height="64" fill="#D83BB9" fill-opacity=".2" stroke="#D83BB9" stroke-width="2"/><rect x="474" y="440" width="54" height="32" fill="#D83BB9" fill-opacity=".2" stroke="#D83BB9" stroke-width="2"/><rect x="622" y="440" width="54" height="32" fill="#D83BB9" fill-opacity=".2" stroke="#D83BB9" stroke-width="2"/></g>
<text x="40" y="552" class="legend">синее: данные · жёлтое: обучаемые числа · зелёное: то, что модель посчитала · красное: потеря</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="in edges nz mm1" data-focus="edges nz"><div class="step-kicker">Шаг 1 · нейроны рядом</div><h4>Один нейрон даёт одно число, поэтому ставим их рядом</h4><div class="math-display" data-tex="z_j=x_1W_{1j}+x_2W_{2j},\qquad j=1,\ldots,H"></div><p>Каждый нейрон получает все входы и считает свою сумму со своими весами. Слой, где каждый вход соединён с каждым нейроном, называют полносвязным. Число нейронов <span class="math-inline" data-tex="H"></span> называют шириной слоя.</p></div>
    <div class="step-panel" data-on="in edges wlab nz mat mm1" data-focus="wlab mat"><div class="step-kicker">Шаг 2 · матрица весов</div><h4>Наборы весов складываются в одну матрицу</h4><div class="math-display" data-tex="\mathbf z=\mathbf x\mathbf W,\qquad [1,P]\cdot[P,H]\to[1,H]"></div><p>Столбец <span class="math-inline" data-tex="W_{:,j}"></span> содержит веса <span class="math-inline" data-tex="j"></span>-го нейрона, строка <span class="math-inline" data-tex="W_{p,:}"></span> содержит все связи <span class="math-inline" data-tex="p"></span>-го признака.</p></div>
    <div class="step-panel" data-on="in edges wlab nz bias mat hl mm1" data-focus="bias hl"><div class="step-kicker">Шаг 3 · сдвиг</div><h4>У каждого нейрона свой сдвиг</h4><div class="math-display" data-tex="z_1=\underbrace{x_1W_{11}+x_2W_{21}}_{\text{строка на столбец}}+b_1"></div><p>Подсвечено всё, что участвует в <span class="math-inline" data-tex="z_1"></span>: строка входа, первый столбец весов и первый сдвиг. Для всего слоя <span class="math-inline" data-tex="\mathbf z=\mathbf x\mathbf W+\mathbf b"></span>, где <span class="math-inline" data-tex="\mathbf b"></span> имеет форму <span class="math-inline" data-tex="[1,H]"></span>.</p></div>
    <div class="step-panel" data-on="in edges nz bias nh mm2" data-focus="nh"><div class="step-kicker">Шаг 4 · активация</div><h4>ReLU применяется к каждой координате отдельно</h4><div class="math-display" data-tex="\mathbf h=\operatorname{ReLU}(\mathbf z),\qquad [1,H]\to[1,H]"></div><p>Форма не меняется. Эта строка становится входом следующего слоя.</p></div>
  </div>
</div>

<div class="callout">
  <strong>Главная мысль:</strong> полносвязный слой считает
  <span class="math-inline" data-tex="\mathbf Z=\mathbf X\mathbf W+\mathbf b"></span>, и веса его нейронов лежат
  столбцами в одной матрице. Меняются только вход, параметры, размерности и функция активации после слоя.
</div>


### Вся сеть как нейроны и связи

<p>
  Поставим три таких слоя подряд. Каждый круг обозначает отдельное число, каждая
  линия показывает, куда это число идёт дальше.
</p>

<div class="stage" id="stageMlpNeurons" tabindex="0" aria-label="Пошаговая схема полносвязной сети в виде нейронов и связей">
  <div class="stage-figure">
<svg class="mg" id="mlpn3" viewBox="0 0 960 478" role="img" aria-label="Два входа, два скрытых слоя, два логита, softmax и loss; на каждой связи подписан её вес">
<defs><marker id="mlpn3-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="mlpn3-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="mlpn3-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="35" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>объекты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf W,\ \mathbf b"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>скрытые <span data-tex="\mathbf h"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вероятности <span data-tex="\mathbf p"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">вес на связи: верхний индекс слой, нижние откуда и куда</text>
<g data-key="in"><text x="78" y="100" class="cap" text-anchor="middle">вход</text><circle cx="78" cy="165" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="78" cy="295" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject></g>
<g data-key="e1"><line x1="106.5" y1="165" x2="206" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="100.008" y1="183.108" x2="212.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="100.008" y1="276.892" x2="212.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="106.5" y1="295" x2="206" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><foreignObject x="122" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{11}"></div></foreignObject><foreignObject x="122" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{22}"></div></foreignObject><foreignObject x="115" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{12}"></div></foreignObject><foreignObject x="115" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{21}"></div></foreignObject></g>
<g data-key="h1"><text x="236" y="100" class="cap" text-anchor="middle">скрытый слой 1</text><foreignObject x="201" y="114" width="70" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="+\,b^{(1)}_1"></div></foreignObject><foreignObject x="201" y="324" width="70" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="+\,b^{(1)}_2"></div></foreignObject><circle cx="236" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="205" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_1^{(1)}"></div></foreignObject><circle cx="236" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="205" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_2^{(1)}"></div></foreignObject><text x="236" y="362" class="mm" text-anchor="middle">linear + ReLU</text></g>
<g data-key="e2"><line x1="264.5" y1="165" x2="364" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="258.008" y1="183.108" x2="370.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="258.008" y1="276.892" x2="370.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="264.5" y1="295" x2="364" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><foreignObject x="280" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{11}"></div></foreignObject><foreignObject x="280" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{22}"></div></foreignObject><foreignObject x="273" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{12}"></div></foreignObject><foreignObject x="273" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{21}"></div></foreignObject></g>
<g data-key="h2"><text x="394" y="100" class="cap" text-anchor="middle">скрытый слой 2</text><foreignObject x="359" y="114" width="70" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="+\,b^{(2)}_1"></div></foreignObject><foreignObject x="359" y="324" width="70" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="+\,b^{(2)}_2"></div></foreignObject><circle cx="394" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="363" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_1^{(2)}"></div></foreignObject><circle cx="394" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="363" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_2^{(2)}"></div></foreignObject><text x="394" y="362" class="mm" text-anchor="middle">linear + ReLU</text></g>
<g data-key="e3"><line x1="422.5" y1="165" x2="522" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="416.008" y1="183.108" x2="528.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="416.008" y1="276.892" x2="528.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="422.5" y1="295" x2="522" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><foreignObject x="438" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(3)}_{11}"></div></foreignObject><foreignObject x="438" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(3)}_{22}"></div></foreignObject><foreignObject x="431" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(3)}_{12}"></div></foreignObject><foreignObject x="431" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(3)}_{21}"></div></foreignObject></g>
<g data-key="s"><text x="552" y="100" class="cap" text-anchor="middle">логиты</text><foreignObject x="517" y="114" width="70" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="+\,b^{(3)}_1"></div></foreignObject><foreignObject x="517" y="324" width="70" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-tex="+\,b^{(3)}_2"></div></foreignObject><circle cx="552" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="s_1"></div></foreignObject><circle cx="552" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="s_2"></div></foreignObject><text x="552" y="362" class="mm" text-anchor="middle">linear</text></g>
<g data-key="e4"><line x1="580.5" y1="165" x2="676" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="573.778" y1="183.384" x2="683.076" y2="275.648" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="573.778" y1="276.616" x2="683.076" y2="184.352" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="580.5" y1="295" x2="676" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><foreignObject x="574" y="326" width="110" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\operatorname{softmax}"></div></foreignObject></g>
<g data-key="p"><text x="706" y="100" class="cap" text-anchor="middle">вероятности</text><circle cx="706" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="p_1"></div></foreignObject><circle cx="706" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="p_2"></div></foreignObject></g>
<g data-key="loss"><line x1="732.58" y1="175.284" x2="846.021" y2="219.175" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><line x1="732.58" y1="284.716" x2="846.021" y2="240.825" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn3-arw)"/><circle cx="874" cy="112" r="24" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="846" y="92" width="56" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf y"></div></foreignObject><line x1="874" y1="137.5" x2="874" y2="200" stroke="#3576C0" stroke-width="1.8" marker-end="url(#mlpn3-arb)"/><circle cx="874" cy="230" r="27" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="843" y="203" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\ell"></div></foreignObject><text x="874" y="278" class="cap" text-anchor="middle">потеря</text></g>
<g data-key="mats" data-only="1"><foreignObject x="70" y="369" width="90" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:700" data-tex="\mathbf W^{(1)}"></div></foreignObject><rect x="65" y="392" width="100" height="52" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="115" y1="392" x2="115" y2="444" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="65" y1="418" x2="165" y2="418" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="65" y="392" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{11}"></div></foreignObject><foreignObject x="115" y="392" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{12}"></div></foreignObject><foreignObject x="65" y="418" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{21}"></div></foreignObject><foreignObject x="115" y="418" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{22}"></div></foreignObject><foreignObject x="195" y="369" width="90" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:700" data-tex="\mathbf b^{(1)}"></div></foreignObject><rect x="190" y="405" width="100" height="26" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="240" y1="405" x2="240" y2="431" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="190" y="405" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="b_1"></div></foreignObject><foreignObject x="240" y="405" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="b_2"></div></foreignObject><foreignObject x="360" y="369" width="90" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:700" data-tex="\mathbf W^{(2)}"></div></foreignObject><rect x="355" y="392" width="100" height="52" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="405" y1="392" x2="405" y2="444" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="355" y1="418" x2="455" y2="418" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="355" y="392" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{11}"></div></foreignObject><foreignObject x="405" y="392" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{12}"></div></foreignObject><foreignObject x="355" y="418" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{21}"></div></foreignObject><foreignObject x="405" y="418" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{22}"></div></foreignObject><foreignObject x="485" y="369" width="90" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:700" data-tex="\mathbf b^{(2)}"></div></foreignObject><rect x="480" y="405" width="100" height="26" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="530" y1="405" x2="530" y2="431" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="480" y="405" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="b_1"></div></foreignObject><foreignObject x="530" y="405" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="b_2"></div></foreignObject><foreignObject x="650" y="369" width="90" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:700" data-tex="\mathbf W^{(3)}"></div></foreignObject><rect x="645" y="392" width="100" height="52" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="695" y1="392" x2="695" y2="444" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="645" y1="418" x2="745" y2="418" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="645" y="392" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{11}"></div></foreignObject><foreignObject x="695" y="392" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{12}"></div></foreignObject><foreignObject x="645" y="418" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{21}"></div></foreignObject><foreignObject x="695" y="418" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="W_{22}"></div></foreignObject><foreignObject x="775" y="369" width="90" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:700" data-tex="\mathbf b^{(3)}"></div></foreignObject><rect x="770" y="405" width="100" height="26" rx="2" fill="#C29E08" opacity="0.85" stroke="#ffffff" stroke-width="1"/><line x1="820" y1="405" x2="820" y2="431" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="770" y="405" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="b_1"></div></foreignObject><foreignObject x="820" y="405" width="50" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="b_2"></div></foreignObject></g>
<text x="40" y="466" class="legend">синее: данные · жёлтое: обучаемые числа · зелёное: то, что модель посчитала · красное: потеря</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="in mm0" data-focus="in"><div class="step-kicker">Шаг 1 · вход</div><h4>Объект начинается с двух признаков</h4><div class="math-display" data-tex="\mathbf x=[x_1,x_2]\in\mathbb R^{1\times2}"></div><p>Пока это просто два числа из данных.</p></div>
    <div class="step-panel" data-on="in e1 h1 mm2" data-focus="e1 h1"><div class="step-kicker">Шаг 2 · первый скрытый слой</div><h4>Каждый новый нейрон получает оба входа</h4><div class="math-display" data-tex="\begin{gathered}h_1^{(1)}=\operatorname{ReLU}\!\left(x_1W^{(1)}_{11}+x_2W^{(1)}_{21}+b_1^{(1)}\right)\\ h_2^{(1)}=\operatorname{ReLU}\!\left(x_1W^{(1)}_{12}+x_2W^{(1)}_{22}+b_2^{(1)}\right)\end{gathered}"></div><p>Как читать индексы: <span class="math-inline" data-tex="W^{(1)}_{21}"></span> стоит в слое 1 на связи от входа 2 к нейрону 1. Значение скрытого нейрона обозначаем <span class="math-inline" data-tex="h"></span>: верхний индекс указывает слой, нижний указывает нейрон.</p></div>
    <div class="step-panel" data-on="h1 e2 h2 mm2" data-focus="e2 h2"><div class="step-kicker">Шаг 3 · второй скрытый слой</div><h4>Следующий слой комбинирует уже построенные значения</h4><div class="math-display" data-tex="\begin{gathered}h_1^{(2)}=\operatorname{ReLU}\!\left(h_1^{(1)}W^{(2)}_{11}+h_2^{(1)}W^{(2)}_{21}+b_1^{(2)}\right)\\ h_2^{(2)}=\operatorname{ReLU}\!\left(h_1^{(1)}W^{(2)}_{12}+h_2^{(1)}W^{(2)}_{22}+b_2^{(2)}\right)\end{gathered}"></div><p>Правило то же, но входом служат <span class="math-inline" data-tex="h^{(1)}_j"></span>, а не исходные признаки.</p></div>
    <div class="step-panel" data-on="h2 e3 s mm3" data-focus="e3 s"><div class="step-kicker">Шаг 4 · выходной слой</div><h4>Два скрытых значения превращаются в два логита</h4><div class="math-display" data-tex="\begin{gathered}s_1=h_1^{(2)}W^{(3)}_{11}+h_2^{(2)}W^{(3)}_{21}+b_1^{(3)}\\ s_2=h_1^{(2)}W^{(3)}_{12}+h_2^{(2)}W^{(3)}_{22}+b_2^{(3)}\end{gathered}"></div><p>На выходном слое ReLU нет: логит <span class="math-inline" data-tex="s_c"></span> может быть любым числом и ещё не является вероятностью.</p></div>
    <div class="step-panel" data-on="s e4 p mm3" data-focus="e4 p"><div class="step-kicker">Шаг 5 · softmax</div><h4>Логиты становятся вероятностями</h4><div class="math-display" data-tex="p_c=\frac{e^{s_c}}{e^{s_1}+e^{s_2}},\qquad p_1+p_2=1"></div><p>Стрелки идут от каждого логита к каждой вероятности: знаменатель содержит оба логита, поэтому вероятность класса зависит от обоих. Весов на этих связях нет.</p></div>
    <div class="step-panel" data-on="p loss mm4" data-focus="loss"><div class="step-kicker">Шаг 6 · потеря</div><h4>Метка показывает, какую вероятность проверять</h4><div class="math-display" data-tex="\ell=-\sum_c y_c\log p_c=-\log p_{\mathrm{true}}"></div><p>Одно число оценивает весь путь от входов до вероятностей.</p></div>
    <div class="step-panel" data-on="in e1 h1 e2 h2 e3 s e4 p loss mats mm1" data-focus="mats"><div class="step-kicker">Шаг 7 · матричная запись</div><h4>Дальше пишем то же самое матрицами</h4><div class="math-display" data-tex="\begin{gathered}\mathbf h^{(1)}=\operatorname{ReLU}(\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)})\\ \mathbf h^{(2)}=\operatorname{ReLU}(\mathbf h^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)})\\ \mathbf s=\mathbf h^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)}\end{gathered}"></div><p>Это те же 12 весов и 6 сдвигов. Клетка <span class="math-inline" data-tex="i,j"></span> матрицы <span class="math-inline" data-tex="\mathbf W^{(l)}"></span> лежит на связи от нейрона <span class="math-inline" data-tex="i"></span> к нейрону <span class="math-inline" data-tex="j"></span>: столбец <span class="math-inline" data-tex="j"></span> содержит всё, что входит в нейрон <span class="math-inline" data-tex="j"></span>, строка <span class="math-inline" data-tex="i"></span> содержит всё, что выходит из нейрона <span class="math-inline" data-tex="i"></span>. Умножение строки на столбец даёт ровно суммы из шагов 2–4.</p></div>
  </div>
</div>

<div class="callout-blue">
  <strong>Дальше пишем матрицами.</strong> Здесь каждый вес записан отдельно один раз. В следующих частях те же
  числа лежат в <span class="math-inline" data-tex="\mathbf W^{(l)}"></span> и
  <span class="math-inline" data-tex="\mathbf b^{(l)}"></span>: клетка <span class="math-inline" data-tex="i,j"></span>
  обозначает связь от нейрона <span class="math-inline" data-tex="i"></span> к нейрону <span class="math-inline" data-tex="j"></span>.
</div>

## Часть 2. Скрытый нейрон: линейная комбинация плюс ReLU

<p>
  Скрытый нейрон сначала собирает входы в число <span class="math-inline" data-tex="z"></span>,
  затем ReLU оставляет положительную часть и обнуляет отрицательную. Передвиньте ползунок:
  при <span class="math-inline" data-tex="z\le 0"></span> выход равен нулю.
</p>

<div class="slider-card" id="stageRelu">
<div class="slider-layout">
<div class="slider-figure">
<svg class="viz-svg" id="mlp-relu-svg" viewBox="0 0 680 410" role="img" aria-label="График ReLU с управляемым значением z">
<foreignObject x="10" y="7" width="400" height="50"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:25px;color:#111111;font-weight:400" data-tex="\operatorname{ReLU}(z)=\max(0,\ z)"></div></foreignObject>
<line x1="60" y1="330" x2="640" y2="330" stroke="#C9C2B8" stroke-width="1.4"/>
<line x1="350" y1="62" x2="350" y2="360" stroke="#C9C2B8" stroke-width="1.4"/>
<line x1="70" y1="330" x2="350" y2="330" stroke="#73B222" stroke-width="5" stroke-linecap="round"/>
<line x1="350" y1="330" x2="625" y2="75" stroke="#73B222" stroke-width="5" stroke-linecap="round"/>
<foreignObject x="635" y="335" width="30" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#5E5850;font-weight:400" data-tex="z"></div></foreignObject><foreignObject x="353" y="53" width="30" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#5E5850;font-weight:400" data-tex="h"></div></foreignObject>
<foreignObject x="51" y="338" width="50" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5E5850;font-weight:400" data-tex="-3"></div></foreignObject><foreignObject x="335" y="338" width="30" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5E5850;font-weight:400" data-tex="0"></div></foreignObject><foreignObject x="605" y="338" width="30" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5E5850;font-weight:400" data-tex="3"></div></foreignObject>
<line id="mlp-relu-guide" x1="350" y1="330" x2="350" y2="330" stroke="#3576C0" stroke-width="1.5" stroke-dasharray="5 5"/>
<circle id="mlp-relu-point" cx="350" cy="330" r="9" fill="#3576C0" stroke="#fff" stroke-width="3"/>
<rect x="72" y="80" width="210" height="72" rx="12" class="box-blue"/>
<text id="mlp-relu-state" x="177" y="111" text-anchor="middle" class="v-label">сигнал проходит</text>
<foreignObject x="72" y="118" width="210" height="28"><div xmlns="http://www.w3.org/1999/xhtml" id="mlp-relu-value-svg" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#5E5850"></div></foreignObject>
</svg>
</div>
<div class="slider-control">
<label for="mlpReluRange">Линейный выход <span class="math-inline" data-tex="z"></span></label>
<input id="mlpReluRange" type="range" min="-3" max="3" step="0.05" value="1.2">
<div class="slider-value"><strong id="mlpReluValue">1.20</strong><span>выход <span class="math-inline" data-tex="h"></span></span></div>
<div class="equation-card"><div id="mlpReluEquation" class="math-display" data-tex="\operatorname{ReLU}(1.20)=1.20"></div></div>
<p class="tiny" id="mlpReluExplain">Положительное значение проходит дальше без изменения.</p>
</div>
</div>
</div>

<p>
  У ReLU есть простая локальная производная: справа от нуля она равна 1, слева —
  0. Поэтому в backward активный нейрон пропускает градиент, а неактивный
  возвращает ноль.
</p>

<div class="math-display" data-tex="\operatorname{ReLU}'(z)=\begin{cases}1,&z>0,\\0,&z<0.\end{cases}"></div>

<div class="callout-yellow">
  <strong>В точке z = 0</strong> классическая производная не определена. В
  практических библиотеках выбирают согласованное подградиентное значение,
  обычно 0. Для нашего числового примера ни один активный путь точно в ноль не попадает.
</div>

## Часть 3. Почему без нелинейности глубина исчезает

<p>
  Два линейных слоя подряд выглядят глубже, но вычисляют всё ту же линейную
  функцию. Нелинейность разрывает это схлопывание. Именно поэтому ReLU стоит
  <em>между</em> полносвязными слоями, а не только в самом конце.
</p>

<div class="stage" id="stageDepth" tabindex="0" aria-label="Почему несколько линейных слоёв без активации эквивалентны одному">
  <div class="stage-figure">
<svg class="mg" id="mlpn4" viewBox="0 0 960 402" role="img" aria-label="Цепочка линейных слоёв без активации и та же цепочка с ReLU">
<defs><marker id="mlpn4-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="mlpn4-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="mlpn4-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<g data-key="lin"><text x="40" y="84" class="cap" text-anchor="start">два линейных слоя подряд</text><circle cx="90" cy="130" r="26" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="60" y="104" width="60" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\mathbf x"></div></foreignObject><line x1="117.5" y1="130" x2="261" y2="130" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn4-arw)"/><foreignObject x="125" y="99" width="130" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(1)},\mathbf b^{(1)}"></div></foreignObject><circle cx="290" cy="130" r="26" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="260" y="104" width="60" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf z^{(1)}"></div></foreignObject><line x1="317.5" y1="130" x2="461" y2="130" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn4-arw)"/><foreignObject x="325" y="99" width="130" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(2)},\mathbf b^{(2)}"></div></foreignObject><circle cx="490" cy="130" r="26" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="460" y="104" width="60" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)}"></div></foreignObject></g>
<g data-key="col" data-only="1"><foreignObject x="540" y="115" width="40" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="="></div></foreignObject><circle cx="630" cy="130" r="26" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="600" y="104" width="60" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\mathbf x"></div></foreignObject><line x1="657.5" y1="130" x2="821" y2="130" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn4-arw)"/><foreignObject x="675" y="99" width="130" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{*},\mathbf b^{*}"></div></foreignObject><circle cx="850" cy="130" r="26" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="820" y="104" width="60" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)}"></div></foreignObject><text x="740" y="174" class="cap" text-anchor="middle">один линейный слой с другими параметрами</text></g>
<g data-key="rel" data-only="1"><text x="40" y="240" class="cap" text-anchor="start">те же слои с ReLU между ними</text><circle cx="90" cy="300" r="26" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="60" y="274" width="60" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\mathbf x"></div></foreignObject><line x1="117.5" y1="300" x2="221" y2="300" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn4-arw)"/><foreignObject x="105" y="269" width="130" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(1)},\mathbf b^{(1)}"></div></foreignObject><circle cx="250" cy="300" r="26" fill="#F4F7EE" stroke="#C29E08" stroke-width="2.2"/><foreignObject x="220" y="274" width="60" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf z^{(1)}"></div></foreignObject><line x1="277.5" y1="300" x2="371" y2="300" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn4-arw)"/><foreignObject x="275" y="269" width="100" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\operatorname{ReLU}"></div></foreignObject><circle cx="400" cy="300" r="26" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="370" y="274" width="60" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)}"></div></foreignObject></g>
<g data-key="res" data-only="1"><line x1="427.5" y1="300" x2="531" y2="300" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn4-arw)"/><foreignObject x="415" y="269" width="130" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(2)},\mathbf b^{(2)}"></div></foreignObject><circle cx="560" cy="300" r="26" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="530" y="274" width="60" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)}"></div></foreignObject><foreignObject x="610" y="276.32" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span>кусочно-линейная функция от <span data-tex="\mathbf x"></span>:</span></div></foreignObject><foreignObject x="610" y="296.32" width="300" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span>на каждом участке своя матрица</span></div></foreignObject></g>
<text x="40" y="386" class="legend">синее: данные · жёлтое: обучаемые числа · зелёное: то, что модель посчитала · красное: потеря</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="lin" data-focus="lin"><div class="step-kicker">Шаг 1 · два линейных слоя</div><h4>Пока между слоями нет активации</h4><div class="math-display" data-tex="\mathbf z^{(2)}=(\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)})\mathbf W^{(2)}+\mathbf b^{(2)}"></div><p>Скобки можно раскрыть.</p></div>
    <div class="step-panel" data-on="lin col" data-focus="col"><div class="step-kicker">Шаг 2 · схлопывание</div><h4>Произведения и сдвиги объединяются</h4><div class="math-display" data-tex="\mathbf W^*=\mathbf W^{(1)}\mathbf W^{(2)},\qquad \mathbf b^*=\mathbf b^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)}"></div><p>Два линейных слоя считают то же, что один слой с параметрами <span class="math-inline" data-tex="\mathbf W^*,\mathbf b^*"></span>.</p></div>
    <div class="step-panel" data-on="lin rel" data-focus="rel"><div class="step-kicker">Шаг 3 · вставляем ReLU</div><h4>Теперь объединить матрицы нельзя</h4><div class="math-display" data-tex="\mathbf h^{(1)}=\operatorname{ReLU}(\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)})"></div><p>ReLU обнуляет разные координаты у разных объектов, поэтому одной общей матрицей это не заменить.</p></div>
    <div class="step-panel" data-on="lin rel res" data-focus="res"><div class="step-kicker">Шаг 4 · настоящая глубина</div><h4>Каждый следующий слой комбинирует уже построенные признаки</h4><div class="math-display" data-tex="f(\mathbf x)=\operatorname{ReLU}\!\left(\operatorname{ReLU}(\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)})\mathbf W^{(2)}+\mathbf b^{(2)}\right)\mathbf W^{(3)}+\mathbf b^{(3)}"></div><p>Этим многослойная сеть и отличается от одной логистической регрессии: граница решений перестаёт быть одной прямой.</p></div>
  </div>
</div>

## Часть 4. Softmax и cross-entropy: одна строка превращается в loss

<p>
  Выходной слой возвращает логиты <span class="math-inline" data-tex="\mathbf s"></span>.
  Softmax превращает их в распределение вероятностей, а cross-entropy берёт
  отрицательный логарифм вероятности правильного класса. Для one-hot метки формула
  снова становится очень короткой.
</p>

<div class="math-display" data-tex="\mathbf p=\operatorname{softmax}(\mathbf s),\qquad \ell=-\sum_{c=1}^{C}y_c\log p_c=-\log p_{\text{true}}"></div>

<div class="slider-card" id="stageSoftmaxLoss">
<div class="slider-layout">
<div class="slider-figure">
<svg class="viz-svg" id="mlp-loss-svg" viewBox="0 0 680 410" role="img" aria-label="Вероятности двух классов и cross-entropy для правильного класса">
<text x="28" y="36" class="v-title">Cross-entropy смотрит на правильный класс</text>
<line x1="82" y1="330" x2="410" y2="330" stroke="#C9C2B8" stroke-width="1.4"/>
<rect id="mlp-loss-bar-true" x="130" y="90" width="92" height="240" rx="8" fill="#73B222"/>
<rect id="mlp-loss-bar-other" x="280" y="300" width="92" height="30" rx="8" fill="#D8D4C8"/>
<text x="176" y="356" text-anchor="middle" class="v-label">класс 1 · верный</text>
<text x="326" y="356" text-anchor="middle" class="v-label">класс 2</text>
<text id="mlp-loss-ptrue" x="176" y="78" text-anchor="middle" class="v-label">0.88</text>
<text id="mlp-loss-pother" x="326" y="288" text-anchor="middle" class="v-label">0.12</text>
<rect x="452" y="100" width="190" height="160" rx="14" class="box-red"/>
<foreignObject x="517" y="115" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:23px;color:#C30B0A;font-weight:400" data-tex="\ell"></div></foreignObject>
<text id="mlp-loss-number" x="547" y="190" text-anchor="middle" style="fill:#C30B0A;font-size:34px;font-weight:800">0.128</text>
<foreignObject x="457" y="204" width="180" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#5E5850;font-weight:400" data-tex="-\log p_{\text{true}}"></div></foreignObject>
</svg>
</div>
<div class="slider-control">
<label for="mlpLossRange">Вероятность правильного класса</label>
<input id="mlpLossRange" type="range" min="0.02" max="0.98" step="0.01" value="0.88">
<div class="slider-value"><strong id="mlpLossValue">0.128</strong><span><span class="math-inline" data-tex="\ell"></span></span></div>
<div class="equation-card"><div id="mlpLossEquation" class="math-display" data-tex="\ell=-\log(0.88)=0.128"></div></div>
<p class="tiny" id="mlpLossExplain">Модель уверена в верном классе, поэтому штраф мал.</p>
</div>
</div>
</div>

<p>
  В бинарном случае формула BCE учитывала вероятность нужной метки, softmax
  cross-entropy делает то же для одного из нескольких классов.
</p>

<div class="callout-red">
  <strong>Не применяйте softmax по всему батчу.</strong> Нормировка всегда идёт по
  классам внутри одной строки. Объекты батча не должны делить вероятность друг с другом.
</div>

## Часть 5. Полный forward: сначала формулы, затем те же шаги с числами

<p>
  Соберём все блоки. Сначала только формулы и размерности, затем тот же порядок
  с конкретными матрицами.
</p>

<div class="stage" id="stageForwardFormula" tabindex="0" aria-label="Полный forward многослойной сети в формулах">
  <div class="stage-figure">
<svg class="mg" id="mlpn5" viewBox="0 0 960 464" role="img" aria-label="Формульный forward через два скрытых слоя, softmax и cross-entropy">
<defs><marker id="mlpn5-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="mlpn5-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="mlpn5-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="35" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>объекты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf W,\ \mathbf b"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>скрытые <span data-tex="\mathbf h"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вероятности <span data-tex="\mathbf p"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">формулы и формы · значений здесь нет, они будут ниже</text>
<g data-key="in"><text x="78" y="112" class="cap" text-anchor="middle">вход</text><circle cx="78" cy="165" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="78" cy="295" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><foreignObject x="45" y="328" width="66" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,P]"></div></foreignObject></g>
<g data-key="e1"><line x1="106.5" y1="165" x2="206" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="100.008" y1="183.108" x2="212.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="100.008" y1="276.892" x2="212.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="106.5" y1="295" x2="206" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><foreignObject x="102" y="326" width="110" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(1)},\ \mathbf b^{(1)}"></div></foreignObject><foreignObject x="102" y="350" width="110" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="[P,H_1]"></div></foreignObject></g>
<g data-key="n1"><text x="236" y="112" class="cap" text-anchor="middle">скрытый слой 1</text><circle cx="236" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><circle cx="236" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="203" y="328" width="66" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,H_1]"></div></foreignObject></g>
<g data-key="z1" data-only="1"><foreignObject x="206" y="148" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z_1^{(1)}"></div></foreignObject><foreignObject x="206" y="278" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z_2^{(1)}"></div></foreignObject></g>
<g data-key="h1" data-only="1"><foreignObject x="206" y="148" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_1^{(1)}"></div></foreignObject><foreignObject x="206" y="278" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_2^{(1)}"></div></foreignObject></g>
<g data-key="e2"><line x1="264.5" y1="165" x2="364" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="258.008" y1="183.108" x2="370.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="258.008" y1="276.892" x2="370.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="264.5" y1="295" x2="364" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><foreignObject x="260" y="326" width="110" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(2)},\ \mathbf b^{(2)}"></div></foreignObject><foreignObject x="260" y="350" width="110" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="[H_1,H_2]"></div></foreignObject></g>
<g data-key="n2"><text x="394" y="112" class="cap" text-anchor="middle">скрытый слой 2</text><circle cx="394" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><circle cx="394" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="361" y="328" width="66" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,H_2]"></div></foreignObject></g>
<g data-key="z2" data-only="1"><foreignObject x="364" y="148" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z_1^{(2)}"></div></foreignObject><foreignObject x="364" y="278" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z_2^{(2)}"></div></foreignObject></g>
<g data-key="h2" data-only="1"><foreignObject x="364" y="148" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_1^{(2)}"></div></foreignObject><foreignObject x="364" y="278" width="60" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_2^{(2)}"></div></foreignObject></g>
<g data-key="e3"><line x1="422.5" y1="165" x2="522" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="416.008" y1="183.108" x2="528.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="416.008" y1="276.892" x2="528.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="422.5" y1="295" x2="522" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><foreignObject x="418" y="326" width="110" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(3)},\ \mathbf b^{(3)}"></div></foreignObject><foreignObject x="418" y="350" width="110" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="[H_2,C]"></div></foreignObject></g>
<g data-key="ns"><text x="552" y="112" class="cap" text-anchor="middle">логиты</text><circle cx="552" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="s_1"></div></foreignObject><circle cx="552" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="s_2"></div></foreignObject><foreignObject x="519" y="328" width="66" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,C]"></div></foreignObject></g>
<g data-key="e4"><line x1="580.5" y1="165" x2="676" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="573.778" y1="183.384" x2="683.076" y2="275.648" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="573.778" y1="276.616" x2="683.076" y2="184.352" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="580.5" y1="295" x2="676" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><foreignObject x="574" y="326" width="110" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\operatorname{softmax}"></div></foreignObject></g>
<g data-key="np"><text x="706" y="112" class="cap" text-anchor="middle">вероятности</text><circle cx="706" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="p_1"></div></foreignObject><circle cx="706" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="p_2"></div></foreignObject><foreignObject x="673" y="328" width="66" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,C]"></div></foreignObject></g>
<g data-key="nl"><line x1="732.58" y1="175.284" x2="846.021" y2="219.175" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><line x1="732.58" y1="284.716" x2="846.021" y2="240.825" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn5-arw)"/><circle cx="874" cy="112" r="24" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="846" y="92" width="56" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf y"></div></foreignObject><line x1="874" y1="137.5" x2="874" y2="200" stroke="#3576C0" stroke-width="1.8" marker-end="url(#mlpn5-arb)"/><circle cx="874" cy="230" r="27" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="843" y="203" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\ell"></div></foreignObject><text x="874" y="278" class="cap" text-anchor="middle">потеря [1]</text></g>
<rect x="46" y="374" width="868" height="66" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/>
<g data-key="eq0" data-only="1"><foreignObject x="56" y="378" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:15px" data-tex="\mathbf x\in\mathbb R^{1\times P},\quad \mathbf W^{(1)}\in\mathbb R^{P\times H_1},\quad \mathbf b^{(1)}\in\mathbb R^{1\times H_1}"></div></foreignObject></g>
<g data-key="eq1" data-only="1"><foreignObject x="56" y="378" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:15px" data-tex="\mathbf z^{(1)}=\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)},\qquad [1,P]\cdot[P,H_1]\to[1,H_1]"></div></foreignObject></g>
<g data-key="eq2" data-only="1"><foreignObject x="56" y="378" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:15px" data-tex="\mathbf h^{(1)}=\operatorname{ReLU}(\mathbf z^{(1)}),\qquad [1,H_1]\to[1,H_1]"></div></foreignObject></g>
<g data-key="eq3" data-only="1"><foreignObject x="56" y="378" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:15px" data-tex="\mathbf z^{(2)}=\mathbf h^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)},\qquad [1,H_1]\cdot[H_1,H_2]\to[1,H_2]"></div></foreignObject></g>
<g data-key="eq4" data-only="1"><foreignObject x="56" y="378" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:15px" data-tex="\mathbf h^{(2)}=\operatorname{ReLU}(\mathbf z^{(2)}),\qquad [1,H_2]\to[1,H_2]"></div></foreignObject></g>
<g data-key="eq5" data-only="1"><foreignObject x="56" y="378" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:15px" data-tex="\mathbf s=\mathbf h^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)},\qquad [1,H_2]\cdot[H_2,C]\to[1,C]"></div></foreignObject></g>
<g data-key="eq6" data-only="1"><foreignObject x="56" y="378" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:15px" data-tex="p_c=\frac{e^{s_c}}{\sum_{k=1}^{C}e^{s_k}},\qquad [1,C]\to[1,C]"></div></foreignObject></g>
<g data-key="eq7" data-only="1"><foreignObject x="56" y="378" width="848" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:15px" data-tex="\ell=-\sum_{c=1}^{C}y_c\log p_c,\qquad [1,C]\to[1]"></div></foreignObject></g>
<text x="40" y="456" class="legend">синее: данные · жёлтое: обучаемые числа · зелёное: то, что модель посчитала · красное: потеря</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="in eq0 mm0" data-focus="in eq0"><div class="step-kicker">Шаг 1 · вход и параметры</div><h4>Фиксируем формы</h4><div class="math-display" data-tex="\mathbf x:1\times P,\quad \mathbf W^{(1)}:P\times H_1,\quad \mathbf b^{(1)}:1\times H_1"></div><p>Число столбцов входа должно совпасть с числом строк первой матрицы весов.</p></div>
    <div class="step-panel" data-on="in e1 n1 z1 eq1 mm1" data-focus="e1 z1 eq1"><div class="step-kicker">Шаг 2 · линейная часть слоя 1</div><h4>Первый слой строит <span class="math-inline" data-tex="H_1"></span> линейных комбинаций</h4><div class="math-display" data-tex="z^{(1)}_j=\sum_{i=1}^{P}x_iW^{(1)}_{ij}+b^{(1)}_j"></div><p>Один столбец <span class="math-inline" data-tex="W^{(1)}_{:,j}"></span> принадлежит одному скрытому нейрону. В кругах пока значения до активации.</p></div>
    <div class="step-panel" data-on="e1 n1 h1 eq2 mm2" data-focus="h1 eq2"><div class="step-kicker">Шаг 3 · ReLU слоя 1</div><h4>Активация применяется покоординатно</h4><div class="math-display" data-tex="h^{(1)}_j=\max(0,z^{(1)}_j)"></div><p>Форма не меняется: <span class="math-inline" data-tex="\mathbf z^{(1)},\mathbf h^{(1)}\in\mathbb R^{1\times H_1}"></span>.</p></div>
    <div class="step-panel" data-on="n1 h1 e2 n2 z2 eq3 mm1" data-focus="e2 z2 eq3"><div class="step-kicker">Шаг 4 · линейная часть слоя 2</div><h4>Второй слой получает скрытые значения</h4><div class="math-display" data-tex="z^{(2)}_k=\sum_{j=1}^{H_1}h^{(1)}_jW^{(2)}_{jk}+b^{(2)}_k"></div><p>Операция та же, роль входа играет <span class="math-inline" data-tex="\mathbf h^{(1)}"></span>.</p></div>
    <div class="step-panel" data-on="e2 n2 h2 eq4 mm2" data-focus="h2 eq4"><div class="step-kicker">Шаг 5 · ReLU слоя 2</div><h4>Вторая ReLU даёт <span class="math-inline" data-tex="\mathbf h^{(2)}"></span></h4><div class="math-display" data-tex="h^{(2)}_k=\max(0,z^{(2)}_k)"></div><p>Эти значения поступят в выходной слой.</p></div>
    <div class="step-panel" data-on="n2 h2 e3 ns eq5 mm3" data-focus="e3 ns eq5"><div class="step-kicker">Шаг 6 · выходной слой</div><h4>Для каждого класса появляется свой логит</h4><div class="math-display" data-tex="s_c=\sum_{k=1}^{H_2}h^{(2)}_kW^{(3)}_{kc}+b^{(3)}_c"></div><p>Здесь <span class="math-inline" data-tex="c=1,\ldots,C"></span> обозначает класс.</p></div>
    <div class="step-panel" data-on="ns e4 np eq6 mm3" data-focus="e4 np eq6"><div class="step-kicker">Шаг 7 · softmax</div><h4>Логиты становятся вероятностями</h4><div class="math-display" data-tex="\mathbf p=\operatorname{softmax}(\mathbf s)"></div><p>Устойчивая реализация softmax вычитает <span class="math-inline" data-tex="\max_c s_c"></span> перед экспонентой: числитель и знаменатель делятся на одно и то же число, и вероятности не меняются.</p></div>
    <div class="step-panel" data-on="in e1 n1 h1 e2 n2 h2 e3 ns e4 np nl eq7 mm4" data-focus="nl eq7"><div class="step-kicker">Шаг 8 · cross-entropy</div><h4>Сеть заканчивается одним числом ошибки</h4><div class="math-display" data-tex="\ell=-\log p_{\text{true}}"></div><p>Следующая часть проведёт это число обратно через те же слои и получит градиенты.</p></div>
  </div>
</div>

### Та же сеть блоками слоёв

<p>
  Тот же forward без отдельных нейронов: каждый столбец свёрнут в блок, линейная часть и ReLU стоят отдельными
  блоками, над стрелкой подписан тензор, под ней его форма.
</p>

<div class="stage" id="stageForwardBlocks" tabindex="0" aria-label="Полный forward многослойной сети в формулах">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-ff-svg" viewBox="0 0 960 420" role="img" aria-label="Формульный forward через два скрытых слоя, softmax и cross-entropy">
      <defs><marker id="mlp-ff-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
      <text x="32" y="38" class="v-title">Forward одного объекта</text>
      <foreignObject x="32" y="45.3" width="520" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850"><span>Формы указаны для <span data-tex="P=H_1=H_2=C=2"></span>.</span></div></foreignObject>
      <g data-key="ff-input">
        <rect x="24" y="86" width="70" height="150" rx="10" class="box-blue"/><text x="59" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 59 161)">Input Layer</text>
      </g>
      <g data-key="ff-l1">
        <path d="M94 161 L130 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><foreignObject x="12" y="113.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf x"></div></foreignObject><foreignObject x="12" y="167" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,P]"></div></foreignObject>
        <rect x="132" y="86" width="80" height="150" rx="10" class="box-yellow"/><text x="172" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 172 161)">Linear Layer 1</text><rect x="136" y="244" width="72" height="30" rx="8" class="box-yellow"/><foreignObject x="72" y="243" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="\mathbf W^{(1)},\mathbf b^{(1)}"></div></foreignObject>
      </g>
      <g data-key="ff-a1">
        <path d="M212 161 L242 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><foreignObject x="127" y="113.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf z^{(1)}"></div></foreignObject><foreignObject x="127" y="167" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,H_1]"></div></foreignObject>
        <rect x="244" y="86" width="70" height="150" rx="10" class="box-green"/><text x="279" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 279 161)">ReLU 1</text>
      </g>
      <g data-key="ff-l2">
        <path d="M314 161 L354 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><foreignObject x="234" y="113.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)}"></div></foreignObject><foreignObject x="234" y="167" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,H_1]"></div></foreignObject>
        <rect x="356" y="86" width="80" height="150" rx="10" class="box-yellow"/><text x="396" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 396 161)">Linear Layer 2</text><rect x="360" y="244" width="72" height="30" rx="8" class="box-yellow"/><foreignObject x="296" y="243" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="\mathbf W^{(2)},\mathbf b^{(2)}"></div></foreignObject>
      </g>
      <g data-key="ff-a2">
        <path d="M436 161 L466 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><foreignObject x="351" y="113.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)}"></div></foreignObject><foreignObject x="351" y="167" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,H_2]"></div></foreignObject>
        <rect x="468" y="86" width="70" height="150" rx="10" class="box-green"/><text x="503" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 503 161)">ReLU 2</text>
      </g>
      <g data-key="ff-out">
        <path d="M538 161 L578 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><foreignObject x="458" y="113.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf h^{(2)}"></div></foreignObject><foreignObject x="458" y="167" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,H_2]"></div></foreignObject>
        <rect x="580" y="86" width="80" height="150" rx="10" class="box-yellow"/><text x="620" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 620 161)">Output Layer</text><rect x="584" y="244" width="72" height="30" rx="8" class="box-yellow"/><foreignObject x="520" y="243" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="\mathbf W^{(3)},\mathbf b^{(3)}"></div></foreignObject>
      </g>
      <g data-key="ff-prob">
        <path d="M660 161 L690 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><foreignObject x="575" y="113.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf s"></div></foreignObject><foreignObject x="575" y="167" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,C]"></div></foreignObject>
        <rect x="692" y="86" width="82" height="150" rx="10" class="box-green"/><text x="733" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 733 161)">Softmax Layer</text>
      </g>
      <g data-key="ff-loss">
        <path d="M774 161 L804 161" class="edge-green" marker-end="url(#mlp-ff-arrow)"/><foreignObject x="689" y="113.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf p"></div></foreignObject><foreignObject x="689" y="167" width="200" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,C]"></div></foreignObject>
        <rect x="806" y="86" width="128" height="150" rx="10" class="box-red"/><text x="870" y="161" text-anchor="middle" class="layer-name" transform="rotate(-90 870 161)">Cross-Entropy Loss</text>
      </g>
      <rect x="46" y="292" width="868" height="92" rx="14" class="formula-bg"/>
      <g data-key="ff-eq-input" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf x\in\mathbb R^{1\times P},\quad \mathbf W^{(1)}\in\mathbb R^{P\times H_1},\quad \mathbf b^{(1)}\in\mathbb R^{1\times H_1}"></div></foreignObject></g>
      <g data-key="ff-eq-l1" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf z^{(1)}=\mathbf x\mathbf W^{(1)}+\mathbf b^{(1)}"></div></foreignObject></g>
      <g data-key="ff-eq-a1" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf h^{(1)}=\operatorname{ReLU}(\mathbf z^{(1)})"></div></foreignObject></g>
      <g data-key="ff-eq-l2" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf z^{(2)}=\mathbf h^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)}"></div></foreignObject></g>
      <g data-key="ff-eq-a2" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf h^{(2)}=\operatorname{ReLU}(\mathbf z^{(2)})"></div></foreignObject></g>
      <g data-key="ff-eq-out" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\mathbf s=\mathbf h^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)}"></div></foreignObject></g>
      <g data-key="ff-eq-prob" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="p_c=\frac{e^{s_c}}{\sum_{k=1}^{C}e^{s_k}},\qquad \sum_c p_c=1"></div></foreignObject></g>
      <g data-key="ff-eq-loss" data-only="1"><foreignObject x="62" y="300" width="836" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\ell(\mathbf y,\mathbf p)=-\sum_{c=1}^{C}y_c\log p_c"></div></foreignObject></g>
    </svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ff-input ff-eq-input" data-focus="ff-input ff-eq-input"><div class="step-kicker">Шаг 1 · вход и параметры</div><h4>Фиксируем формы всех объектов</h4><div class="math-display" data-tex="\mathbf x:1\times P,\quad \mathbf W^{(1)}:P\times H_1,\quad \mathbf b^{(1)}:1\times H_1"></div><p>Число столбцов входа должно совпасть с числом строк первой матрицы весов.</p></div>
    <div class="step-panel" data-on="ff-input ff-l1 ff-eq-l1" data-focus="ff-l1 ff-eq-l1"><div class="step-kicker">Шаг 2 · Linear 1</div><h4>Первый слой строит <span class="math-inline" data-tex="H_1"></span> линейных комбинаций</h4><div class="math-display" data-tex="z^{(1)}_j=\sum_{i=1}^{P}x_iW^{(1)}_{ij}+b^{(1)}_j"></div><p>Один столбец <span class="math-inline" data-tex="W^{(1)}_{:,j}"></span> принадлежит одному скрытому нейрону.</p></div>
    <div class="step-panel" data-on="ff-l1 ff-a1 ff-eq-a1" data-focus="ff-a1 ff-eq-a1"><div class="step-kicker">Шаг 3 · ReLU 1</div><h4>Активация применяется покоординатно</h4><div class="math-display" data-tex="h^{(1)}_j=\max(0,z^{(1)}_j)"></div><p>Форма не меняется: <span class="math-inline" data-tex="\mathbf z^{(1)},\mathbf h^{(1)}\in\mathbb R^{1\times H_1}"></span>.</p></div>
    <div class="step-panel" data-on="ff-a1 ff-l2 ff-eq-l2" data-focus="ff-l2 ff-eq-l2"><div class="step-kicker">Шаг 4 · Linear 2</div><h4>Второй слой получает уже скрытые признаки</h4><div class="math-display" data-tex="z^{(2)}_k=\sum_{j=1}^{H_1}h^{(1)}_jW^{(2)}_{jk}+b^{(2)}_k"></div><p>Операция та же, но роль входа теперь играет <span class="math-inline" data-tex="\mathbf h^{(1)}"></span>.</p></div>
    <div class="step-panel" data-on="ff-l2 ff-a2 ff-eq-a2" data-focus="ff-a2 ff-eq-a2"><div class="step-kicker">Шаг 5 · ReLU 2</div><h4>Вторая ReLU даёт <span class="math-inline" data-tex="\mathbf h^{(2)}"></span></h4><div class="math-display" data-tex="h^{(2)}_k=\max(0,z^{(2)}_k)"></div><p>Эти значения поступят в выходной слой.</p></div>
    <div class="step-panel" data-on="ff-a2 ff-out ff-eq-out" data-focus="ff-out ff-eq-out"><div class="step-kicker">Шаг 6 · выходной Linear</div><h4>Для каждого класса появляется свой логит</h4><div class="math-display" data-tex="s_c=\sum_{k=1}^{H_2}h^{(2)}_kW^{(3)}_{kc}+b^{(3)}_c"></div><p>Здесь <span class="math-inline" data-tex="c=1,\ldots,C"></span> — индекс класса.</p></div>
    <div class="step-panel" data-on="ff-out ff-prob ff-eq-prob" data-focus="ff-prob ff-eq-prob"><div class="step-kicker">Шаг 7 · softmax</div><h4>Логиты становятся вероятностями</h4><div class="math-display" data-tex="\mathbf p=\operatorname{softmax}(\mathbf s)"></div><p>Устойчивая реализация softmax вычитает <span class="math-inline" data-tex="\max_c s_c"></span> перед экспонентой; вероятность от этого не меняется.</p></div>
    <div class="step-panel" data-on="ff-input ff-l1 ff-a1 ff-l2 ff-a2 ff-out ff-prob ff-loss ff-eq-loss" data-focus="ff-loss ff-eq-loss"><div class="step-kicker">Шаг 8 · cross-entropy</div><h4>Вся сеть заканчивается одним числом ошибки</h4><div class="math-display" data-tex="\ell=-\log p_{\text{true}}"></div><p>Следующая часть проведёт это число обратно через те же слои и получит градиенты.</p></div>
  </div>
</div>

### Подставляем числа — тем же маршрутом

<p>
  Используем объект <span class="math-inline" data-tex="\mathbf x=[2,1]"></span> и
  правильный класс 1, то есть <span class="math-inline" data-tex="\mathbf y=[1,0]"></span>.
  Все матрицы имеют размер <span class="math-inline" data-tex="2\times2"></span>,
  поэтому каждое умножение можно проверить вручную.
</p>

<div class="stage" id="stageForwardNumeric" tabindex="0" aria-label="Пошаговая числовая проверка forward">
  <div class="stage-figure">
<svg class="mg" id="mlpn6" viewBox="0 0 960 386" role="img" aria-label="Значения входа, двух скрытых слоёв, логитов, вероятностей и потери">
<defs><marker id="mlpn6-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="mlpn6-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="mlpn6-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="35" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>объекты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf W,\ \mathbf b"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>скрытые <span data-tex="\mathbf h"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вероятности <span data-tex="\mathbf p"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">на связях значения весов · пунктир: нейрон выдал ноль, и его вклад в следующий слой тоже равен нулю</text>
<g data-key="in"><text x="78" y="104" class="cap" text-anchor="middle">вход</text><foreignObject x="53" y="117" width="50" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="x_1"></div></foreignObject><foreignObject x="53" y="247" width="50" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="x_2"></div></foreignObject><circle cx="78" cy="165" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-mlp-tex="vX1"></div></foreignObject><circle cx="78" cy="295" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-mlp-tex="vX2"></div></foreignObject></g>
<g data-key="e1"><line x1="106.5" y1="165" x2="206" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="100.008" y1="183.108" x2="212.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="100.008" y1="276.892" x2="212.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="106.5" y1="295" x2="206" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><foreignObject x="102" y="326" width="110" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(1)},\ \mathbf b^{(1)}"></div></foreignObject><foreignObject x="122" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW1_11"></div></foreignObject><foreignObject x="122" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW1_22"></div></foreignObject><foreignObject x="115" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW1_12"></div></foreignObject><foreignObject x="115" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW1_21"></div></foreignObject></g>
<g data-key="n1"><text x="236" y="104" class="cap" text-anchor="middle">скрытый слой 1</text><circle cx="236" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><circle cx="236" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/></g>
<g data-key="z1" data-only="1"><foreignObject x="211" y="116" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="z_1^{(1)}"></div></foreignObject><foreignObject x="211" y="246" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="z_2^{(1)}"></div></foreignObject><foreignObject x="206" y="150" width="60" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-mlp-tex="vZ11"></div></foreignObject><foreignObject x="206" y="280" width="60" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-mlp-tex="vZ12"></div></foreignObject></g>
<g data-key="h1" data-only="1"><foreignObject x="211" y="116" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="h_1^{(1)}"></div></foreignObject><foreignObject x="211" y="246" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="h_2^{(1)}"></div></foreignObject><foreignObject x="206" y="150" width="60" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-mlp-tex="vH11"></div></foreignObject><circle cx="236" cy="295" r="27" fill="#FFFFFF" stroke="#A8A296" stroke-width="2.2" stroke-dasharray="5 4"/><foreignObject x="205" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-mlp-tex="vH12"></div></foreignObject></g>
<g data-key="e2"><line x1="264.5" y1="165" x2="364" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="258.008" y1="183.108" x2="370.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="258.008" y1="276.892" x2="370.834" y2="184.061" stroke="#A8A296" stroke-width="1.8" stroke-dasharray="5 4"/><line x1="264.5" y1="295" x2="364" y2="295" stroke="#A8A296" stroke-width="1.8" stroke-dasharray="5 4"/><foreignObject x="260" y="326" width="110" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(2)},\ \mathbf b^{(2)}"></div></foreignObject><foreignObject x="280" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW2_11"></div></foreignObject><foreignObject x="280" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW2_22"></div></foreignObject><foreignObject x="273" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW2_12"></div></foreignObject><foreignObject x="273" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW2_21"></div></foreignObject></g>
<g data-key="n2"><text x="394" y="104" class="cap" text-anchor="middle">скрытый слой 2</text><circle cx="394" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><circle cx="394" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/></g>
<g data-key="z2" data-only="1"><foreignObject x="369" y="116" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="z_1^{(2)}"></div></foreignObject><foreignObject x="369" y="246" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="z_2^{(2)}"></div></foreignObject><foreignObject x="364" y="150" width="60" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-mlp-tex="vZ21"></div></foreignObject><foreignObject x="364" y="280" width="60" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-mlp-tex="vZ22"></div></foreignObject></g>
<g data-key="h2" data-only="1"><foreignObject x="369" y="116" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="h_1^{(2)}"></div></foreignObject><foreignObject x="369" y="246" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="h_2^{(2)}"></div></foreignObject><foreignObject x="364" y="150" width="60" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-mlp-tex="vH21"></div></foreignObject><circle cx="394" cy="295" r="27" fill="#FFFFFF" stroke="#A8A296" stroke-width="2.2" stroke-dasharray="5 4"/><foreignObject x="363" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-mlp-tex="vH22"></div></foreignObject></g>
<g data-key="e3"><line x1="422.5" y1="165" x2="522" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="416.008" y1="183.108" x2="528.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="416.008" y1="276.892" x2="528.834" y2="184.061" stroke="#A8A296" stroke-width="1.8" stroke-dasharray="5 4"/><line x1="422.5" y1="295" x2="522" y2="295" stroke="#A8A296" stroke-width="1.8" stroke-dasharray="5 4"/><foreignObject x="418" y="326" width="110" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(3)},\ \mathbf b^{(3)}"></div></foreignObject><foreignObject x="438" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW3_11"></div></foreignObject><foreignObject x="438" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW3_22"></div></foreignObject><foreignObject x="431" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW3_12"></div></foreignObject><foreignObject x="431" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#8F7406;font-weight:400" data-mlp-tex="vW3_21"></div></foreignObject></g>
<g data-key="ns"><text x="552" y="104" class="cap" text-anchor="middle">логиты</text><foreignObject x="527" y="117" width="50" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="s_1"></div></foreignObject><foreignObject x="527" y="247" width="50" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="s_2"></div></foreignObject><circle cx="552" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-mlp-tex="vS1"></div></foreignObject><circle cx="552" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-mlp-tex="vS2"></div></foreignObject></g>
<g data-key="e4"><line x1="580.5" y1="165" x2="676" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="573.778" y1="183.384" x2="683.076" y2="275.648" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="573.778" y1="276.616" x2="683.076" y2="184.352" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="580.5" y1="295" x2="676" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><foreignObject x="574" y="326" width="110" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\operatorname{softmax}"></div></foreignObject></g>
<g data-key="np"><text x="706" y="104" class="cap" text-anchor="middle">вероятности</text><foreignObject x="681" y="117" width="50" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="p_1"></div></foreignObject><foreignObject x="681" y="247" width="50" height="20"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="p_2"></div></foreignObject><circle cx="706" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-mlp-tex="vP1"></div></foreignObject><circle cx="706" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-mlp-tex="vP2"></div></foreignObject></g>
<g data-key="nl"><line x1="732.58" y1="175.284" x2="846.021" y2="219.175" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><line x1="732.58" y1="284.716" x2="846.021" y2="240.825" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn6-arw)"/><circle cx="874" cy="112" r="24" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="846" y="92" width="56" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf y"></div></foreignObject><line x1="874" y1="137.5" x2="874" y2="200" stroke="#3576C0" stroke-width="1.8" marker-end="url(#mlpn6-arb)"/><foreignObject x="892" y="101" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="[1,0]"></div></foreignObject><circle cx="874" cy="230" r="27" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="843" y="203" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-mlp-tex="vL"></div></foreignObject><text x="874" y="278" class="cap" text-anchor="middle">потеря</text></g>
<text x="40" y="374" class="legend">синее: данные · жёлтое: обучаемые числа · зелёное: то, что модель посчитала · красное: потеря</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="in mm0" data-focus="in"><div class="step-kicker">Шаг 1 · исходные числа</div><h4>Фиксируем объект, метку и параметры</h4><div class="math-display" data-mlp-tex="forwardInputs"></div><p>Во время одного forward эти числа не меняются.</p></div>
    <div class="step-panel" data-on="in e1 n1 z1 mm1" data-focus="e1 z1"><div class="step-kicker">Шаг 2 · линейная часть слоя 1</div><h4>Считаем оба скрытых нейрона</h4><div class="math-display" data-mlp-tex="forwardZ1"></div><p>Первая координата положительна, вторая отрицательна.</p></div>
    <div class="step-panel" data-on="e1 n1 h1 mm2" data-focus="h1"><div class="step-kicker">Шаг 3 · ReLU слоя 1</div><h4>Отрицательное значение становится нулём</h4><div class="math-display" data-mlp-tex="forwardA1"></div><p>Нейрон <span class="math-inline" data-tex="h^{(1)}_2"></span> выдаёт ноль, поэтому все его произведения в следующем слое равны нулю.</p></div>
    <div class="step-panel" data-on="n1 h1 e2 n2 z2 mm1" data-focus="e2 z2"><div class="step-kicker">Шаг 4 · линейная часть слоя 2</div><h4>Повторяем ту же матричную операцию</h4><div class="math-display" data-mlp-tex="forwardZ2"></div><p>На входе слоя теперь <span class="math-inline" data-tex="\mathbf h^{(1)}"></span>, а не исходный объект.</p></div>
    <div class="step-panel" data-on="e2 n2 h2 mm2" data-focus="h2"><div class="step-kicker">Шаг 5 · ReLU слоя 2</div><h4>Снова оставляем только положительные координаты</h4><div class="math-display" data-mlp-tex="forwardA2"></div><p>К выходному слою проходит вектор <span class="math-inline" data-tex="[1.16,0]"></span>.</p></div>
    <div class="step-panel" data-on="n2 h2 e3 ns mm3" data-focus="e3 ns"><div class="step-kicker">Шаг 6 · логиты</div><h4>Выходной слой даёт по числу на класс</h4><div class="math-display" data-mlp-tex="forwardS"></div><p>Первый логит выше второго почти на 2, поэтому softmax отдаст предпочтение классу 1.</p></div>
    <div class="step-panel" data-on="ns e4 np mm3" data-focus="e4 np"><div class="step-kicker">Шаг 7 · softmax</div><h4>Вычитаем максимум и нормируем экспоненты</h4><div class="math-display" data-mlp-tex="forwardP"></div><p>Вероятности складываются в 1 с учётом округления.</p></div>
    <div class="step-panel" data-on="in e1 n1 h1 e2 n2 h2 e3 ns e4 np nl mm4" data-focus="nl"><div class="step-kicker">Шаг 8 · потеря</div><h4>Берём вероятность правильного класса</h4><div class="math-display" data-mlp-tex="forwardLoss"></div><p>Сеть дала правильному классу высокую вероятность, поэтому потеря мала, но не равна нулю.</p></div>
  </div>
</div>

<div class="callout">
  <strong>Forward завершён.</strong> Сохранены
  <span class="math-inline" data-tex="\mathbf x,\mathbf z^{(1)},\mathbf h^{(1)},\mathbf z^{(2)},\mathbf h^{(2)},\mathbf p,\mathbf y"></span>.
  Backward возьмёт из них маски ReLU, множители для градиентов весов и начальный сигнал.
</div>

## Часть 6. Backpropagation: один сигнал разворачивается через все слои

<p>
  Backpropagation начинает с выходного сигнала и передаёт его справа налево.
  Каждый блок получает градиент со своей правой стороны, применяет локальную
  производную и возвращает новый градиент дальше.
</p>

<div class="math-display" data-tex="\underbrace{\boldsymbol\delta^{(3)}=\mathbf p-\mathbf y}_{\text{softmax + cross-entropy}}\;\longrightarrow\;\boldsymbol\delta^{(2)}\;\longrightarrow\;\boldsymbol\delta^{(1)}"></div>

<div class="stage" id="stageBackwardFormula" tabindex="0" aria-label="Backpropagation: производная для каждого веса и переход к матрицам">
  <div class="stage-figure">
<svg class="mg" id="mlpn7" viewBox="0 0 960 520" role="img" aria-label="Обратный проход: на каждой связи подписана производная потери по её весу">
<defs><marker id="mlpn7-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="mlpn7-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="mlpn7-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="35" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>объекты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf W,\ \mathbf b"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>скрытые <span data-tex="\mathbf h"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вероятности <span data-tex="\mathbf p"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">вперёд считаются значения, назад производные; подпись на связи: производная потери по этому весу</text>
<g data-key="map"><text x="78" y="112" class="cap" text-anchor="middle">вход</text><circle cx="78" cy="165" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="78" cy="295" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><line x1="106.5" y1="165" x2="206" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="100.008" y1="183.108" x2="212.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="100.008" y1="276.892" x2="212.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="106.5" y1="295" x2="206" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><text x="236" y="112" class="cap" text-anchor="middle">скрытый слой 1</text><circle cx="236" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="205" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_1^{(1)}"></div></foreignObject><circle cx="236" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="205" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_2^{(1)}"></div></foreignObject><line x1="264.5" y1="165" x2="364" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="258.008" y1="183.108" x2="370.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="258.008" y1="276.892" x2="370.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="264.5" y1="295" x2="364" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><text x="394" y="112" class="cap" text-anchor="middle">скрытый слой 2</text><circle cx="394" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="363" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_1^{(2)}"></div></foreignObject><circle cx="394" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="363" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_2^{(2)}"></div></foreignObject><line x1="422.5" y1="165" x2="522" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="416.008" y1="183.108" x2="528.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="416.008" y1="276.892" x2="528.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="422.5" y1="295" x2="522" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><text x="552" y="112" class="cap" text-anchor="middle">логиты</text><circle cx="552" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="s_1"></div></foreignObject><circle cx="552" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="s_2"></div></foreignObject><line x1="580.5" y1="165" x2="676" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="573.778" y1="183.384" x2="683.076" y2="275.648" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="573.778" y1="276.616" x2="683.076" y2="184.352" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="580.5" y1="295" x2="676" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><text x="706" y="112" class="cap" text-anchor="middle">вероятности</text><circle cx="706" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="p_1"></div></foreignObject><circle cx="706" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="p_2"></div></foreignObject><line x1="732.58" y1="175.284" x2="846.021" y2="219.175" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><line x1="732.58" y1="284.716" x2="846.021" y2="240.825" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn7-arw)"/><circle cx="874" cy="112" r="24" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="846" y="92" width="56" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf y"></div></foreignObject><line x1="874" y1="137.5" x2="874" y2="200" stroke="#3576C0" stroke-width="1.8" marker-end="url(#mlpn7-arb)"/><circle cx="874" cy="230" r="27" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="843" y="203" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\ell"></div></foreignObject></g>
<g data-key="wl1" data-only="1"><foreignObject x="122" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{11}"></div></foreignObject><foreignObject x="122" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{22}"></div></foreignObject><foreignObject x="115" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{12}"></div></foreignObject><foreignObject x="115" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(1)}_{21}"></div></foreignObject></g>
<g data-key="rl1" data-only="1"><foreignObject x="122" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(1)}_{11}"></div></foreignObject><foreignObject x="122" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(1)}_{22}"></div></foreignObject><foreignObject x="115" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(1)}_{12}"></div></foreignObject><foreignObject x="115" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(1)}_{21}"></div></foreignObject></g>
<g data-key="wl2" data-only="1"><foreignObject x="280" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{11}"></div></foreignObject><foreignObject x="280" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{22}"></div></foreignObject><foreignObject x="273" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{12}"></div></foreignObject><foreignObject x="273" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(2)}_{21}"></div></foreignObject></g>
<g data-key="rl2" data-only="1"><foreignObject x="280" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(2)}_{11}"></div></foreignObject><foreignObject x="280" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(2)}_{22}"></div></foreignObject><foreignObject x="273" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(2)}_{12}"></div></foreignObject><foreignObject x="273" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(2)}_{21}"></div></foreignObject></g>
<g data-key="wl3" data-only="1"><foreignObject x="438" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(3)}_{11}"></div></foreignObject><foreignObject x="438" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(3)}_{22}"></div></foreignObject><foreignObject x="431" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(3)}_{12}"></div></foreignObject><foreignObject x="431" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="W^{(3)}_{21}"></div></foreignObject></g>
<g data-key="rl3" data-only="1"><foreignObject x="438" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(3)}_{11}"></div></foreignObject><foreignObject x="438" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(3)}_{22}"></div></foreignObject><foreignObject x="431" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(3)}_{12}"></div></foreignObject><foreignObject x="431" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-tex="\partial W^{(3)}_{21}"></div></foreignObject></g>
<g data-key="a3" data-only="1"><line x1="847.42" y1="219.716" x2="733.979" y2="175.825" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="847.42" y1="240.284" x2="733.979" y2="284.175" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="677.5" y1="165" x2="582" y2="165" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="684.222" y1="183.384" x2="574.924" y2="275.648" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="684.222" y1="276.616" x2="574.924" y2="184.352" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="677.5" y1="295" x2="582" y2="295" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/></g>
<g data-key="a2" data-only="1"><line x1="523.5" y1="165" x2="424" y2="165" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="529.992" y1="183.108" x2="417.166" y2="275.939" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="529.992" y1="276.892" x2="417.166" y2="184.061" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="523.5" y1="295" x2="424" y2="295" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/></g>
<g data-key="a1" data-only="1"><line x1="365.5" y1="165" x2="266" y2="165" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="371.992" y1="183.108" x2="259.166" y2="275.939" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="371.992" y1="276.892" x2="259.166" y2="184.061" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="365.5" y1="295" x2="266" y2="295" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/></g>
<g data-key="a0" data-only="1"><line x1="207.5" y1="165" x2="108" y2="165" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="213.992" y1="183.108" x2="101.166" y2="275.939" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="213.992" y1="276.892" x2="101.166" y2="184.061" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/><line x1="207.5" y1="295" x2="108" y2="295" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn7-arr)"/></g>
<g data-key="dl3" data-only="1"><foreignObject x="522" y="195" width="60" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="\delta^{(3)}_1"></div></foreignObject><foreignObject x="522" y="325" width="60" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="\delta^{(3)}_2"></div></foreignObject></g>
<g data-key="dl2" data-only="1"><foreignObject x="364" y="195" width="60" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_1"></div></foreignObject><foreignObject x="364" y="325" width="60" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="\delta^{(2)}_2"></div></foreignObject></g>
<g data-key="dl1" data-only="1"><foreignObject x="206" y="195" width="60" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="\delta^{(1)}_1"></div></foreignObject><foreignObject x="206" y="325" width="60" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="\delta^{(1)}_2"></div></foreignObject></g>
<g data-key="t1" data-only="1"><rect x="46" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\delta^{(3)}_1=\dfrac{\partial\ell}{\partial s_1}=p_1-y_1"></div></foreignObject><rect x="486" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\delta^{(3)}_2=\dfrac{\partial\ell}{\partial s_2}=p_2-y_2"></div></foreignObject></g>
<g data-key="t2" data-only="1"><rect x="46" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(3)}_{11}}=h^{(2)}_1\,\delta^{(3)}_1"></div></foreignObject><rect x="486" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(3)}_{12}}=h^{(2)}_1\,\delta^{(3)}_2"></div></foreignObject><rect x="46" y="398" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="398" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(3)}_{21}}=h^{(2)}_2\,\delta^{(3)}_1"></div></foreignObject><rect x="486" y="398" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="398" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(3)}_{22}}=h^{(2)}_2\,\delta^{(3)}_2"></div></foreignObject><rect x="46" y="446" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="446" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial b^{(3)}_1}=\delta^{(3)}_1"></div></foreignObject><rect x="486" y="446" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="446" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial b^{(3)}_2}=\delta^{(3)}_2"></div></foreignObject></g>
<g data-key="t3" data-only="1"><rect x="46" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\delta^{(2)}_1=\left(\delta^{(3)}_1W^{(3)}_{11}+\delta^{(3)}_2W^{(3)}_{12}\right)\mathbb 1[z^{(2)}_1>0]"></div></foreignObject><rect x="486" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\delta^{(2)}_2=\left(\delta^{(3)}_1W^{(3)}_{21}+\delta^{(3)}_2W^{(3)}_{22}\right)\mathbb 1[z^{(2)}_2>0]"></div></foreignObject></g>
<g data-key="t4" data-only="1"><rect x="46" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(2)}_{11}}=h^{(1)}_1\,\delta^{(2)}_1"></div></foreignObject><rect x="486" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(2)}_{12}}=h^{(1)}_1\,\delta^{(2)}_2"></div></foreignObject><rect x="46" y="398" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="398" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(2)}_{21}}=h^{(1)}_2\,\delta^{(2)}_1"></div></foreignObject><rect x="486" y="398" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="398" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(2)}_{22}}=h^{(1)}_2\,\delta^{(2)}_2"></div></foreignObject><rect x="46" y="446" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="446" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial b^{(2)}_1}=\delta^{(2)}_1"></div></foreignObject><rect x="486" y="446" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="446" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial b^{(2)}_2}=\delta^{(2)}_2"></div></foreignObject></g>
<g data-key="t5" data-only="1"><rect x="46" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\delta^{(1)}_1=\left(\delta^{(2)}_1W^{(2)}_{11}+\delta^{(2)}_2W^{(2)}_{12}\right)\mathbb 1[z^{(1)}_1>0]"></div></foreignObject><rect x="486" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\delta^{(1)}_2=\left(\delta^{(2)}_1W^{(2)}_{21}+\delta^{(2)}_2W^{(2)}_{22}\right)\mathbb 1[z^{(1)}_2>0]"></div></foreignObject></g>
<g data-key="t6" data-only="1"><rect x="46" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(1)}_{11}}=x_1\,\delta^{(1)}_1"></div></foreignObject><rect x="486" y="350" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="350" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(1)}_{12}}=x_1\,\delta^{(1)}_2"></div></foreignObject><rect x="46" y="398" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="398" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(1)}_{21}}=x_2\,\delta^{(1)}_1"></div></foreignObject><rect x="486" y="398" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="398" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial W^{(1)}_{22}}=x_2\,\delta^{(1)}_2"></div></foreignObject><rect x="46" y="446" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="46" y="446" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial b^{(1)}_1}=\delta^{(1)}_1"></div></foreignObject><rect x="486" y="446" width="428" height="44" rx="10" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".35"/><foreignObject x="486" y="446" width="428" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\dfrac{\partial\ell}{\partial b^{(1)}_2}=\delta^{(1)}_2"></div></foreignObject></g>
<g data-key="tm" data-only="1"><foreignObject x="85" y="360" width="130" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="(\mathbf h^{(l-1)})^\top"></div></foreignObject><rect x="127" y="384" width="46" height="60" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="127" y1="414" x2="173" y2="414" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="127" y="384" width="46" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="h_1"></div></foreignObject><foreignObject x="127" y="414" width="46" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="h_2"></div></foreignObject><foreignObject x="183" y="401" width="30" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\cdot"></div></foreignObject><foreignObject x="220" y="372" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="\boldsymbol\delta^{(l)}"></div></foreignObject><rect x="222" y="399" width="96" height="30" rx="2" fill="#C30B0A" opacity="0.35" stroke="#ffffff" stroke-width="1"/><line x1="270" y1="399" x2="270" y2="429" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="222" y="399" width="48" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\delta_1"></div></foreignObject><foreignObject x="270" y="399" width="48" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\delta_2"></div></foreignObject><foreignObject x="330" y="401" width="30" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="="></div></foreignObject><foreignObject x="390" y="360" width="120" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="d\mathbf W^{(l)}"></div></foreignObject><rect x="370" y="384" width="160" height="60" rx="2" fill="#C30B0A" opacity="0.35" stroke="#ffffff" stroke-width="1"/><line x1="450" y1="384" x2="450" y2="444" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="370" y1="414" x2="530" y2="414" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="370" y="384" width="80" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="h_1\delta_1"></div></foreignObject><foreignObject x="450" y="384" width="80" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="h_1\delta_2"></div></foreignObject><foreignObject x="370" y="414" width="80" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="h_2\delta_1"></div></foreignObject><foreignObject x="450" y="414" width="80" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="h_2\delta_2"></div></foreignObject><foreignObject x="560" y="386" width="260" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="d\mathbf W^{(l)}_{ij}=\dfrac{\partial\ell}{\partial W^{(l)}_{ij}}"></div></foreignObject></g>
<text x="40" y="510" class="legend">серые стрелки: прямой проход · красные стрелки и подписи: обратный, на них производные</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="map wl1 wl2 wl3 mm4" data-focus="map"><div class="step-kicker">Шаг 1 · что ищем</div><h4>Для каждого из 18 чисел нужна своя производная</h4><div class="math-display" data-tex="\frac{\partial\ell}{\partial W^{(l)}_{ij}},\qquad \frac{\partial\ell}{\partial b^{(l)}_{j}}"></div><p>Посчитать их можно от выхода к входу: каждая производная использует уже найденный сигнал справа и значения, сохранённые на forward. Сигнал <span class="math-inline" data-tex="\delta^{(l)}_j=\partial\ell/\partial z^{(l)}_j"></span> показывает, как потеря реагирует на сумму в нейроне <span class="math-inline" data-tex="j"></span> до активации.</p></div>
    <div class="step-panel" data-on="map wl1 wl2 wl3 a3 dl3 t1 mm5" data-focus="a3 dl3 t1"><div class="step-kicker">Шаг 2 · выходной сигнал</div><h4>Softmax и cross-entropy сокращаются до <span class="math-inline" data-tex="p_c-y_c"></span></h4><div class="math-display" data-tex="\delta^{(3)}_c=\frac{\partial\ell}{\partial s_c}=p_c-y_c"></div><p>Правильный класс получает отрицательный сигнал, остальные положительный. Для выходного слоя логит и есть сумма в нейроне.</p></div>
    <div class="step-panel" data-on="map wl1 wl2 a3 a2 rl3 dl3 t2 mm5" data-focus="a2 rl3 t2"><div class="step-kicker">Шаг 3 · веса выходного слоя</div><h4>Каждый вес получает свою производную</h4><div class="math-display" data-tex="\frac{\partial\ell}{\partial W^{(3)}_{kc}}=\frac{\partial\ell}{\partial s_c}\cdot\frac{\partial s_c}{\partial W^{(3)}_{kc}}=\delta^{(3)}_c\,h^{(2)}_k"></div><p>Вес <span class="math-inline" data-tex="W^{(3)}_{kc}"></span> входит только в <span class="math-inline" data-tex="s_c"></span> и только множителем при <span class="math-inline" data-tex="h^{(2)}_k"></span>, поэтому производная равна <span class="math-inline" data-tex="h^{(2)}_k"></span>, умноженному на сигнал нейрона <span class="math-inline" data-tex="c"></span>. Сдвиг входит в <span class="math-inline" data-tex="s_c"></span> с множителем 1.</p></div>
    <div class="step-panel" data-on="map wl1 wl2 a3 a2 rl3 dl3 dl2 t3 mm5" data-focus="dl2 t3"><div class="step-kicker">Шаг 4 · сигнал в скрытый слой 2</div><h4>Сигнал собирается со всех выходов и проходит ReLU</h4><div class="math-display" data-tex="\delta^{(2)}_k=\frac{\partial\ell}{\partial h^{(2)}_k}\cdot\frac{\partial h^{(2)}_k}{\partial z^{(2)}_k}=\left(\sum_c\delta^{(3)}_cW^{(3)}_{kc}\right)\mathbb 1[z^{(2)}_k>0]"></div><p>Значение <span class="math-inline" data-tex="h^{(2)}_k"></span> входит во все логиты, поэтому в скобке сумма. Производная ReLU равна 1 у активного нейрона и 0 у неактивного; <span class="math-inline" data-tex="z^{(2)}_k"></span> сохранено на forward.</p></div>
    <div class="step-panel" data-on="map wl1 a3 a2 a1 rl3 rl2 dl3 dl2 t4 mm5" data-focus="a1 rl2 t4"><div class="step-kicker">Шаг 5 · веса второго слоя</div><h4>То же правило на слой левее</h4><div class="math-display" data-tex="\frac{\partial\ell}{\partial W^{(2)}_{jk}}=\delta^{(2)}_k\,h^{(1)}_j"></div><p>Вес <span class="math-inline" data-tex="W^{(2)}_{jk}"></span> стоит в сумме нейрона <span class="math-inline" data-tex="k"></span> множителем при <span class="math-inline" data-tex="h^{(1)}_j"></span>. Сигнал нейрона <span class="math-inline" data-tex="k"></span> мы только что получили.</p></div>
    <div class="step-panel" data-on="map wl1 a3 a2 a1 rl3 rl2 dl3 dl2 dl1 t5 mm5" data-focus="dl1 t5"><div class="step-kicker">Шаг 6 · сигнал в скрытый слой 1</div><h4>Снова сумма по выходам и маска ReLU</h4><div class="math-display" data-tex="\delta^{(1)}_j=\left(\sum_k\delta^{(2)}_kW^{(2)}_{jk}\right)\mathbb 1[z^{(1)}_j>0]"></div><p>Формула та же, что на шаге 4, с индексами на слой левее.</p></div>
    <div class="step-panel" data-on="map a3 a2 a1 a0 rl3 rl2 rl1 dl3 dl2 dl1 t6 mm5" data-focus="a0 rl1 t6"><div class="step-kicker">Шаг 7 · веса первого слоя</div><h4>Доходим до самых ранних параметров</h4><div class="math-display" data-tex="\frac{\partial\ell}{\partial W^{(1)}_{ij}}=\delta^{(1)}_j\,x_i"></div><p>Вход первого слоя это признаки, поэтому на месте <span class="math-inline" data-tex="h"></span> стоит <span class="math-inline" data-tex="x_i"></span>. Теперь у каждого из 12 весов и 6 сдвигов есть своя производная.</p></div>
    <div class="step-panel" data-on="map a3 a2 a1 a0 rl3 rl2 rl1 dl3 dl2 dl1 tm mm5" data-focus="tm"><div class="step-kicker">Шаг 8 · матричная запись</div><h4>Дальше пишем то же самое матрицами</h4><div class="math-display" data-tex="\begin{gathered}d\mathbf W^{(l)}=(\mathbf h^{(l-1)})^\top\boldsymbol\delta^{(l)},\qquad d\mathbf b^{(l)}=\boldsymbol\delta^{(l)}\\ \boldsymbol\delta^{(l-1)}=\boldsymbol\delta^{(l)}(\mathbf W^{(l)})^\top\odot\mathbb 1[\mathbf z^{(l-1)}>0]\end{gathered}"></div><p>Столбец <span class="math-inline" data-tex="[H_{l-1},1]"></span> на строку <span class="math-inline" data-tex="[1,H_l]"></span> даёт матрицу <span class="math-inline" data-tex="[H_{l-1},H_l]"></span>, и её клетка <span class="math-inline" data-tex="i,j"></span> равна <span class="math-inline" data-tex="h_i\delta_j"></span>, как на шагах 3, 5 и 7. Здесь <span class="math-inline" data-tex="\mathbf h^{(0)}=\mathbf x"></span>. Форма <span class="math-inline" data-tex="d\mathbf W^{(l)}"></span> совпадает с формой <span class="math-inline" data-tex="\mathbf W^{(l)}"></span>.</p></div>
  </div>
</div>

### Тот же backward блоками слоёв

<p>
  Здесь блоки те же, а красные стрелки идут под ними справа налево. На каждой подписано, что появляется на этом участке.
</p>

<div class="stage" id="stageBackwardBlocks" tabindex="0" aria-label="Backpropagation многослойной сети в формулах">
  <div class="stage-figure">
    <svg class="viz-svg" id="mlp-bf-svg" viewBox="0 0 960 440" role="img" aria-label="Красный путь градиентов через выходной и два скрытых слоя">
      <defs>
        <marker id="mlp-bf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#C30B0A"/></marker>
        <marker id="mlp-bf-forward-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker>
      </defs>
      <text x="32" y="38" class="v-title">Backward идёт по сохранённой карте справа налево</text>
      <text x="32" y="62" class="v-small">Красная стрелка переносит производную loss по текущему промежуточному значению.</text>
      <g data-key="bf-map">
        <rect x="24" y="82" width="70" height="142" rx="10" class="box-blue"/><text x="59" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 59 153)">Input Layer</text>
        <path d="M94 153 L130 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><foreignObject x="12" y="106.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf x"></div></foreignObject>
        <rect x="132" y="82" width="80" height="142" rx="10" class="box-yellow"/><text x="172" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 172 153)">Linear Layer 1</text>
        <path d="M212 153 L242 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><foreignObject x="127" y="106.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf z^{(1)}"></div></foreignObject>
        <rect x="244" y="82" width="70" height="142" rx="10" class="box-green"/><text x="279" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 279 153)">ReLU 1</text>
        <path d="M314 153 L354 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><foreignObject x="234" y="106.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)}"></div></foreignObject>
        <rect x="356" y="82" width="80" height="142" rx="10" class="box-yellow"/><text x="396" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 396 153)">Linear Layer 2</text>
        <path d="M436 153 L466 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><foreignObject x="351" y="106.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf z^{(2)}"></div></foreignObject>
        <rect x="468" y="82" width="70" height="142" rx="10" class="box-green"/><text x="503" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 503 153)">ReLU 2</text>
        <path d="M538 153 L578 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><foreignObject x="458" y="106.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf h^{(2)}"></div></foreignObject>
        <rect x="580" y="82" width="80" height="142" rx="10" class="box-yellow"/><text x="620" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 620 153)">Output Layer</text>
        <path d="M660 153 L690 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><foreignObject x="575" y="106.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf s"></div></foreignObject>
        <rect x="692" y="82" width="82" height="142" rx="10" class="box-green"/><text x="733" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 733 153)">Softmax Layer</text>
        <path d="M774 153 L804 153" class="edge-green" marker-end="url(#mlp-bf-forward-arrow)"/><foreignObject x="689" y="106.24" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf p"></div></foreignObject>
        <rect x="806" y="82" width="128" height="142" rx="10" class="box-red"/><text x="870" y="153" text-anchor="middle" class="layer-name" transform="rotate(-90 870 153)">Cross-Entropy Loss</text>
      </g>
      <g data-key="bf-d3"><path d="M806 250 L660 250" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><foreignObject x="633" y="220.32" width="200" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="\boldsymbol\delta^{(3)}=\mathbf p-\mathbf y"></div></foreignObject></g>
      <g data-key="bf-w3"><path d="M660 278 L538 278" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><foreignObject x="499" y="248.32" width="200" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="d\mathbf W^{(3)},\ d\mathbf b^{(3)},\ d\mathbf h^{(2)}"></div></foreignObject></g>
      <g data-key="bf-relu2"><path d="M538 250 L436 250" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><foreignObject x="387" y="220.32" width="200" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="\operatorname{ReLU}'\to\boldsymbol\delta^{(2)}"></div></foreignObject></g>
      <g data-key="bf-w2"><path d="M436 306 L314 306" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><foreignObject x="275" y="276.32" width="200" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="d\mathbf W^{(2)},\ d\mathbf b^{(2)},\ d\mathbf h^{(1)}"></div></foreignObject></g>
      <g data-key="bf-relu1"><path d="M314 278 L94 278" class="edge-red" marker-end="url(#mlp-bf-arrow)"/><foreignObject x="104" y="248.32" width="200" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-tex="\operatorname{ReLU}'\to\boldsymbol\delta^{(1)}\to d\mathbf W^{(1)},\ d\mathbf b^{(1)}"></div></foreignObject></g>
      <rect x="46" y="334" width="868" height="82" rx="14" class="formula-bg"/>
      <g data-key="bf-eq-map" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\ell\to\mathbf s\to\mathbf h^{(2)}\to\mathbf z^{(2)}\to\mathbf h^{(1)}\to\mathbf z^{(1)}"></div></foreignObject></g>
      <g data-key="bf-eq-d3" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\boldsymbol\delta^{(3)}=\frac{\partial\ell}{\partial\mathbf s}=\mathbf p-\mathbf y"></div></foreignObject></g>
      <g data-key="bf-eq-w3" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\nabla_{\mathbf W^{(3)}}\ell=(\mathbf h^{(2)})^\top\boldsymbol\delta^{(3)},\quad \nabla_{\mathbf b^{(3)}}\ell=\boldsymbol\delta^{(3)},\quad \nabla_{\mathbf h^{(2)}}\ell=\boldsymbol\delta^{(3)}(\mathbf W^{(3)})^\top"></div></foreignObject></g>
      <g data-key="bf-eq-r2" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\boldsymbol\delta^{(2)}=\nabla_{\mathbf h^{(2)}}\ell\odot\mathbb 1[\mathbf z^{(2)}>0]"></div></foreignObject></g>
      <g data-key="bf-eq-w2" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\nabla_{\mathbf W^{(2)}}\ell=(\mathbf h^{(1)})^\top\boldsymbol\delta^{(2)},\quad \nabla_{\mathbf h^{(1)}}\ell=\boldsymbol\delta^{(2)}(\mathbf W^{(2)})^\top"></div></foreignObject></g>
      <g data-key="bf-eq-r1" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\boldsymbol\delta^{(1)}=\nabla_{\mathbf h^{(1)}}\ell\odot\mathbb 1[\mathbf z^{(1)}>0]"></div></foreignObject></g>
      <g data-key="bf-eq-all" data-only="1"><foreignObject x="58" y="342" width="844" height="66"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0" data-tex="\nabla_{\mathbf W^{(l)}}\ell=(\mathbf h^{(l-1)})^\top\boldsymbol\delta^{(l)},\qquad \nabla_{\mathbf b^{(l)}}\ell=\boldsymbol\delta^{(l)}"></div></foreignObject></g>
    </svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="bf-map bf-eq-map" data-focus="bf-map bf-eq-map"><div class="step-kicker">Шаг 1 · сохранённая карта</div><h4>Backward использует значения из forward</h4><div class="math-display" data-tex="\mathbf x,\mathbf z^{(1)},\mathbf h^{(1)},\mathbf z^{(2)},\mathbf h^{(2)},\mathbf p,\mathbf y"></div><p>Каждому локальному backward нужны вход или выход соответствующего forward-блока.</p></div>
    <div class="step-panel" data-on="bf-map bf-d3 bf-eq-d3" data-focus="bf-d3 bf-eq-d3"><div class="step-kicker">Шаг 2 · выходной сигнал</div><h4>Softmax и cross-entropy сокращаются до <span class="math-inline" data-tex="\mathbf p-\mathbf y"></span></h4><div class="math-display" data-tex="\delta^{(3)}_c=p_c-y_c"></div><p>Правильный класс получает отрицательный сигнал, ошибочные — положительный.</p></div>
    <div class="step-panel" data-on="bf-map bf-d3 bf-w3 bf-eq-w3" data-focus="bf-w3 bf-eq-w3"><div class="step-kicker">Шаг 3 · Linear 3 backward</div><h4>Считаем градиенты параметров и сигнал влево</h4><div class="math-display" data-tex="d\mathbf W^{(3)}=(\mathbf h^{(2)})^\top\boldsymbol\delta^{(3)},\quad d\mathbf b^{(3)}=\boldsymbol\delta^{(3)},\quad d\mathbf h^{(2)}=\boldsymbol\delta^{(3)}(\mathbf W^{(3)})^\top"></div><p>Один linear backward всегда возвращает эти три семейства производных.</p></div>
    <div class="step-panel" data-on="bf-map bf-w3 bf-relu2 bf-eq-r2" data-focus="bf-relu2 bf-eq-r2"><div class="step-kicker">Шаг 4 · ReLU 2 backward</div><h4>Градиент проходит только через активные координаты</h4><div class="math-display" data-tex="\boldsymbol\delta^{(2)}=d\mathbf h^{(2)}\odot\mathbb 1[\mathbf z^{(2)}>0]"></div><p>Маска берётся из <span class="math-inline" data-tex="\mathbf z^{(2)}"></span>, сохранённого на forward.</p></div>
    <div class="step-panel" data-on="bf-map bf-relu2 bf-w2 bf-eq-w2" data-focus="bf-w2 bf-eq-w2"><div class="step-kicker">Шаг 5 · Linear 2 backward</div><h4>Та же тройка формул повторяется для второго слоя</h4><div class="math-display" data-tex="d\mathbf W^{(2)}=(\mathbf h^{(1)})^\top\boldsymbol\delta^{(2)},\quad d\mathbf h^{(1)}=\boldsymbol\delta^{(2)}(\mathbf W^{(2)})^\top"></div><p>Bias получает тот же сигнал <span class="math-inline" data-tex="d\mathbf b^{(2)}=\boldsymbol\delta^{(2)}"></span>.</p></div>
    <div class="step-panel" data-on="bf-map bf-w2 bf-relu1 bf-eq-r1" data-focus="bf-relu1 bf-eq-r1"><div class="step-kicker">Шаг 6 · ReLU 1 и Linear 1</div><h4>Доходим до самых ранних параметров</h4><div class="math-display" data-tex="\boldsymbol\delta^{(1)}=d\mathbf h^{(1)}\odot\mathbb 1[\mathbf z^{(1)}>0],\qquad d\mathbf W^{(1)}=\mathbf x^\top\boldsymbol\delta^{(1)}"></div><p>Вход первого слоя это признаки, поэтому в формуле стоит <span class="math-inline" data-tex="\mathbf x^\top"></span>.</p></div>
    <div class="step-panel" data-on="bf-map bf-d3 bf-w3 bf-relu2 bf-w2 bf-relu1 bf-eq-all" data-focus="bf-eq-all"><div class="step-kicker">Шаг 7 · общий шаблон</div><h4>Каждый слой повторяет одно правило</h4><div class="math-display" data-tex="d\mathbf W^{(l)}=(\mathbf h^{(l-1)})^\top\boldsymbol\delta^{(l)},\qquad d\mathbf b^{(l)}=\boldsymbol\delta^{(l)}"></div><p>Для более глубокой сети эти формулы применяются к большему числу слоёв.</p></div>
  </div>
</div>

### Проверяем backward на тех же числах

<p>
  Возвращаемся к объекту <span class="math-inline" data-tex="[2,1]"></span>.
  Числовой backward начнётся с вероятностей, полученных выше, и пройдёт через
  обе ReLU-маски. Важно заметить: координаты, обнулённые в forward, дают нулевые
  градиенты на соответствующих путях.
</p>

<div class="stage" id="stageBackwardNumeric" tabindex="0" aria-label="Пошаговая числовая проверка backpropagation">
  <div class="stage-figure">
<svg class="mg" id="mlpn8" viewBox="0 0 960 386" role="img" aria-label="Числовые градиенты выходного и двух скрытых слоёв">
<defs><marker id="mlpn8-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="mlpn8-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="mlpn8-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="35" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>объекты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf W,\ \mathbf b"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>скрытые <span data-tex="\mathbf h"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вероятности <span data-tex="\mathbf p"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" class="cap" text-anchor="middle">на связях производная потери по весу · пунктир: неактивный нейрон, через него сигнал дальше не идёт</text>
<g data-key="map"><text x="78" y="112" class="cap" text-anchor="middle">вход</text><circle cx="78" cy="165" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_1"></div></foreignObject><circle cx="78" cy="295" r="27" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="47" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_2"></div></foreignObject><line x1="106.5" y1="165" x2="206" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="100.008" y1="183.108" x2="212.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="100.008" y1="276.892" x2="212.834" y2="184.061" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="106.5" y1="295" x2="206" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><text x="236" y="112" class="cap" text-anchor="middle">скрытый слой 1</text><circle cx="236" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="205" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_1^{(1)}"></div></foreignObject><circle cx="236" cy="295" r="27" fill="#FFFFFF" stroke="#A8A296" stroke-width="2.2" stroke-dasharray="5 4"/><foreignObject x="205" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#5E5850;font-weight:400" data-tex="h_2^{(1)}"></div></foreignObject><line x1="264.5" y1="165" x2="364" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="258.008" y1="183.108" x2="370.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="258.008" y1="276.892" x2="370.834" y2="184.061" stroke="#A8A296" stroke-width="1.8" stroke-dasharray="5 4"/><line x1="264.5" y1="295" x2="364" y2="295" stroke="#A8A296" stroke-width="1.8" stroke-dasharray="5 4"/><text x="394" y="112" class="cap" text-anchor="middle">скрытый слой 2</text><circle cx="394" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="363" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_1^{(2)}"></div></foreignObject><circle cx="394" cy="295" r="27" fill="#FFFFFF" stroke="#A8A296" stroke-width="2.2" stroke-dasharray="5 4"/><foreignObject x="363" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#5E5850;font-weight:400" data-tex="h_2^{(2)}"></div></foreignObject><line x1="422.5" y1="165" x2="522" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="416.008" y1="183.108" x2="528.834" y2="275.939" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="416.008" y1="276.892" x2="528.834" y2="184.061" stroke="#A8A296" stroke-width="1.8" stroke-dasharray="5 4"/><line x1="422.5" y1="295" x2="522" y2="295" stroke="#A8A296" stroke-width="1.8" stroke-dasharray="5 4"/><text x="552" y="112" class="cap" text-anchor="middle">логиты</text><circle cx="552" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="s_1"></div></foreignObject><circle cx="552" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="521" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="s_2"></div></foreignObject><line x1="580.5" y1="165" x2="676" y2="165" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="573.778" y1="183.384" x2="683.076" y2="275.648" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="573.778" y1="276.616" x2="683.076" y2="184.352" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="580.5" y1="295" x2="676" y2="295" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><text x="706" y="112" class="cap" text-anchor="middle">вероятности</text><circle cx="706" cy="165" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="138" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="p_1"></div></foreignObject><circle cx="706" cy="295" r="27" fill="#F4F7EE" stroke="#73B222" stroke-width="2.2"/><foreignObject x="675" y="268" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="p_2"></div></foreignObject><line x1="732.58" y1="175.284" x2="846.021" y2="219.175" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><line x1="732.58" y1="284.716" x2="846.021" y2="240.825" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn8-arw)"/><circle cx="874" cy="112" r="24" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.2"/><foreignObject x="846" y="92" width="56" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf y"></div></foreignObject><line x1="874" y1="137.5" x2="874" y2="200" stroke="#3576C0" stroke-width="1.8" marker-end="url(#mlpn8-arb)"/><circle cx="874" cy="230" r="27" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="843" y="203" width="62" height="54"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\ell"></div></foreignObject></g>
<g data-key="a3" data-only="1"><line x1="847.42" y1="219.716" x2="733.979" y2="175.825" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="847.42" y1="240.284" x2="733.979" y2="284.175" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="677.5" y1="165" x2="582" y2="165" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="684.222" y1="183.384" x2="574.924" y2="275.648" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="684.222" y1="276.616" x2="574.924" y2="184.352" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="677.5" y1="295" x2="582" y2="295" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><foreignObject x="512" y="196" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vD31"></div></foreignObject><foreignObject x="512" y="326" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vD32"></div></foreignObject></g>
<g data-key="a2" data-only="1"><line x1="523.5" y1="165" x2="424" y2="165" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="529.992" y1="183.108" x2="417.166" y2="275.939" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="529.992" y1="276.892" x2="417.166" y2="184.061" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="523.5" y1="295" x2="424" y2="295" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><foreignObject x="438" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW3_11"></div></foreignObject><foreignObject x="438" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW3_22"></div></foreignObject><foreignObject x="431" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW3_12"></div></foreignObject><foreignObject x="431" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW3_21"></div></foreignObject></g>
<g data-key="v2" data-only="1"><foreignObject x="354" y="196" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vDH21"></div></foreignObject><foreignObject x="354" y="326" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vDH22"></div></foreignObject></g>
<g data-key="m2" data-only="1"><foreignObject x="354" y="196" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vD21"></div></foreignObject><foreignObject x="354" y="326" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vD22"></div></foreignObject></g>
<g data-key="a1" data-only="1"><line x1="365.5" y1="165" x2="266" y2="165" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="371.992" y1="183.108" x2="259.166" y2="275.939" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><foreignObject x="280" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW2_11"></div></foreignObject><foreignObject x="280" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW2_22"></div></foreignObject><foreignObject x="273" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW2_12"></div></foreignObject><foreignObject x="273" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW2_21"></div></foreignObject></g>
<g data-key="v1" data-only="1"><foreignObject x="196" y="196" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vDH11"></div></foreignObject><foreignObject x="196" y="326" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vDH12"></div></foreignObject></g>
<g data-key="m1" data-only="1"><foreignObject x="196" y="196" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vD11"></div></foreignObject><foreignObject x="196" y="326" width="80" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#9C0908;font-weight:400" data-mlp-tex="vD12"></div></foreignObject><line x1="207.5" y1="165" x2="108" y2="165" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><line x1="213.992" y1="183.108" x2="101.166" y2="275.939" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn8-arr)"/><foreignObject x="122" y="139" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW1_11"></div></foreignObject><foreignObject x="122" y="295" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW1_22"></div></foreignObject><foreignObject x="115" y="182" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW1_12"></div></foreignObject><foreignObject x="115" y="252" width="70" height="26"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#9C0908;font-weight:400" data-mlp-tex="vdW1_21"></div></foreignObject></g>
<text x="40" y="374" class="legend">серые стрелки: прямой проход · красные стрелки и подписи: обратный, на них производные</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="map mm4" data-focus="map"><div class="step-kicker">Шаг 1 · значения из forward</div><h4>Берём вероятности и сохранённые значения</h4><div class="math-display" data-mlp-tex="backStart"></div><p>Заново ничего не считаем: backward относится к только что выполненному forward.</p></div>
    <div class="step-panel" data-on="map a3 mm5" data-focus="a3"><div class="step-kicker">Шаг 2 · выходной сигнал</div><h4>Вычитаем one-hot метку</h4><div class="math-display" data-mlp-tex="backD3"></div><p>Сумма координат равна нулю, потому что сумма вероятностей и сумма метки равны единице.</p></div>
    <div class="step-panel" data-on="map a3 a2 v2 mm5" data-focus="a2 v2"><div class="step-kicker">Шаг 3 · третий слой</div><h4>Считаем <span class="math-inline" data-tex="d\mathbf W^{(3)}"></span> и возвращаем сигнал в <span class="math-inline" data-tex="\mathbf h^{(2)}"></span></h4><div class="math-display" data-mlp-tex="backW3"></div><p>Вторая строка <span class="math-inline" data-tex="d\mathbf W^{(3)}"></span> нулевая, потому что <span class="math-inline" data-tex="h^{(2)}_2=0"></span>.</p></div>
    <div class="step-panel" data-on="map a3 a2 m2 mm5" data-focus="m2"><div class="step-kicker">Шаг 4 · ReLU слоя 2</div><h4>Умножаем на маску <span class="math-inline" data-tex="[1,0]"></span></h4><div class="math-display" data-mlp-tex="backD2"></div><p>Положительная первая координата пропускает сигнал, вторая его обнуляет.</p></div>
    <div class="step-panel" data-on="map a3 a2 m2 a1 v1 mm5" data-focus="a1 v1"><div class="step-kicker">Шаг 5 · второй слой</div><h4>Получаем <span class="math-inline" data-tex="d\mathbf W^{(2)}"></span> и сигнал для первого скрытого слоя</h4><div class="math-display" data-mlp-tex="backW2"></div><p>Формула та же; другие только сохранённый вход и матрица. От неактивного нейрона красных стрелок нет.</p></div>
    <div class="step-panel" data-on="map a3 a2 m2 a1 m1 mm5" data-focus="m1"><div class="step-kicker">Шаг 6 · первый слой</div><h4>Последняя маска и <span class="math-inline" data-tex="d\mathbf W^{(1)}"></span></h4><div class="math-display" data-mlp-tex="backD1"></div><p>Второй столбец <span class="math-inline" data-tex="d\mathbf W^{(1)}"></span> равен нулю: второй нейрон первого скрытого слоя неактивен, и его веса на этом объекте не обновятся.</p></div>
    <div class="step-panel" data-on="map a3 a2 m2 a1 m1 mm5" data-focus="map"><div class="step-kicker">Шаг 7 · все градиенты</div><h4>Каждый параметр получил матрицу своей формы</h4><div class="math-display" data-mlp-tex="backAll"></div><p>Backpropagation завершён. Параметры пока не изменились, это сделает следующий шаг.</p></div>
  </div>
</div>

<div class="callout-red">
  <strong>Backpropagation и gradient descent — не одно и то же.</strong>
  Backpropagation вычисляет <span class="math-inline" data-tex="d\mathbf W,d\mathbf b"></span>;
  gradient descent использует их, чтобы изменить параметры.
</div>

## Часть 7. Батч и gradient descent: строки меняются, модель остаётся общей

<p>
  Для одного объекта все промежуточные значения были строками. Батч просто
  складывает несколько объектов в матрицу <span class="math-inline" data-tex="\mathbf X"></span>.
  Матрицы весов не копируются: один и тот же параметр участвует в расчёте каждой
  строки, поэтому в backward получает сумму вкладов объектов.
</p>

<div class="stage" id="stageBatchFormula" tabindex="0" aria-label="Forward и backward батча в формулах">
  <div class="stage-figure">
<svg class="mg" id="mlpn9" viewBox="0 0 960 468" role="img" aria-label="Батч проходит через слои как матрицы с B строками, градиенты возвращаются общей линией">
<defs><marker id="mlpn9-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker><marker id="mlpn9-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker><marker id="mlpn9-arb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker></defs>
<rect x="35" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="35" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>объекты → <span data-tex="X"></span></span></div></foreignObject>
<rect x="185" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="185" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf W,\ \mathbf b"></span></span></div></foreignObject>
<rect x="335" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="335" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>скрытые <span data-tex="\mathbf h"></span></span></div></foreignObject>
<rect x="485" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="485" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>вероятности <span data-tex="\mathbf p"></span></span></div></foreignObject>
<rect x="635" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="635" y="15.68" width="140" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>потеря <span data-tex="L"></span></span></div></foreignObject>
<rect x="785" y="18" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="855" y="35" class="mm" text-anchor="middle">градиент и шаг</text>
<g data-key="mm0" data-only="1"><rect x="33" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="183" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="333" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="633" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="783" y="16" width="144" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<foreignObject x="50" y="45.32" width="860" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="B"></span> строк проходят через одни и те же <span data-tex="\mathbf W"></span> и <span data-tex="\mathbf b"></span>; softmax работает внутри каждой строки</span></div></foreignObject>
<g data-key="x"><rect x="50" y="112" width="56" height="90" rx="2" fill="#3576C0" opacity="0.5" stroke="#ffffff" stroke-width="1"/><line x1="78" y1="112" x2="78" y2="202" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="50" y1="142" x2="106" y2="142" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="50" y1="172" x2="106" y2="172" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="23" y="86" width="110" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="B\times P"></div></foreignObject><foreignObject x="33" y="205" width="90" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#2A5E9B;font-weight:700" data-tex="\mathbf X"></div></foreignObject></g>
<g data-key="h1"><line x1="110" y1="157" x2="211" y2="157" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn9-arw)"/><foreignObject x="110" y="129" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(1)},\mathbf b^{(1)}"></div></foreignObject><rect x="214" y="112" width="56" height="90" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="242" y1="112" x2="242" y2="202" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="214" y1="142" x2="270" y2="142" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="214" y1="172" x2="270" y2="172" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="187" y="86" width="110" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="B\times H_1"></div></foreignObject><foreignObject x="197" y="205" width="90" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#5F9420;font-weight:700" data-tex="\mathbf H^{(1)}"></div></foreignObject></g>
<g data-key="h2"><line x1="274" y1="157" x2="375" y2="157" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn9-arw)"/><foreignObject x="274" y="129" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(2)},\mathbf b^{(2)}"></div></foreignObject><rect x="378" y="112" width="56" height="90" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="406" y1="112" x2="406" y2="202" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="378" y1="142" x2="434" y2="142" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="378" y1="172" x2="434" y2="172" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="351" y="86" width="110" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="B\times H_2"></div></foreignObject><foreignObject x="361" y="205" width="90" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#5F9420;font-weight:700" data-tex="\mathbf H^{(2)}"></div></foreignObject></g>
<g data-key="s"><line x1="438" y1="157" x2="539" y2="157" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn9-arw)"/><foreignObject x="438" y="129" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#8F7406;font-weight:400" data-tex="\mathbf W^{(3)},\mathbf b^{(3)}"></div></foreignObject><rect x="542" y="112" width="56" height="90" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="570" y1="112" x2="570" y2="202" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="542" y1="142" x2="598" y2="142" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="542" y1="172" x2="598" y2="172" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="515" y="86" width="110" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="B\times C"></div></foreignObject><foreignObject x="525" y="205" width="90" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#5F9420;font-weight:700" data-tex="\mathbf S"></div></foreignObject></g>
<g data-key="p"><line x1="602" y1="157" x2="703" y2="157" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn9-arw)"/><foreignObject x="602" y="129" width="100" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\operatorname{softmax}"></div></foreignObject><rect x="706" y="112" width="56" height="90" rx="2" fill="#73B222" opacity="0.55" stroke="#ffffff" stroke-width="1"/><line x1="734" y1="112" x2="734" y2="202" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="706" y1="142" x2="762" y2="142" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><line x1="706" y1="172" x2="762" y2="172" stroke="#ffffff" stroke-width="1.35" stroke-opacity=".75"/><foreignObject x="679" y="86" width="110" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="B\times C"></div></foreignObject><foreignObject x="689" y="205" width="90" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#5F9420;font-weight:700" data-tex="\mathbf P"></div></foreignObject></g>
<g data-key="loss"><line x1="766" y1="157" x2="853" y2="157" stroke="#5E5850" stroke-width="1.8" marker-end="url(#mlpn9-arw)"/><circle cx="880" cy="157.0" r="24" fill="#F4F7EE" stroke="#C30B0A" stroke-width="2.2"/><foreignObject x="852" y="133" width="56" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="L"></div></foreignObject><foreignObject x="855" y="188" width="50" height="22"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="[1]"></div></foreignObject></g>
<g data-key="grad"><line x1="878.5" y1="270" x2="53" y2="270" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlpn9-arr)"/><rect x="265" y="277" width="430" height="30" rx="15" fill="#FFF7F7" stroke="#C30B0A" stroke-opacity=".45"/><foreignObject x="265" y="277" width="430" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#9C0908;font-weight:400" data-tex="\text{общие градиенты: сумма вкладов }B\text{ строк, делённая на }B"></div></foreignObject></g>
<rect x="46" y="324" width="868" height="90" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/>
<g data-key="eq0" data-only="1"><foreignObject x="56" y="328" width="848" height="82"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:14.5px" data-tex="\mathbf X\in\mathbb R^{B\times P},\qquad \mathbf Y\in\mathbb R^{B\times C}"></div></foreignObject></g>
<g data-key="eq1" data-only="1"><foreignObject x="56" y="328" width="848" height="82"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:14.5px" data-tex="\mathbf H^{(1)}=\operatorname{ReLU}(\mathbf X\mathbf W^{(1)}+\mathbf b^{(1)}),\quad \mathbf H^{(2)}=\operatorname{ReLU}(\mathbf H^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)})"></div></foreignObject></g>
<g data-key="eq2" data-only="1"><foreignObject x="56" y="328" width="848" height="82"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:14.5px" data-tex="\mathbf S=\mathbf H^{(2)}\mathbf W^{(3)}+\mathbf b^{(3)},\qquad \mathbf P_{n,:}=\operatorname{softmax}(\mathbf S_{n,:})"></div></foreignObject></g>
<g data-key="eq3" data-only="1"><foreignObject x="56" y="328" width="848" height="82"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:14.5px" data-tex="L=-\frac1B\sum_{n=1}^{B}\sum_{c=1}^{C}Y_{nc}\log P_{nc}"></div></foreignObject></g>
<g data-key="eq4" data-only="1"><foreignObject x="56" y="328" width="848" height="82"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:14.5px" data-tex="\boldsymbol\Delta^{(3)}=\frac{\mathbf P-\mathbf Y}{B}"></div></foreignObject></g>
<g data-key="eq5" data-only="1"><foreignObject x="56" y="328" width="848" height="82"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-center math-display" style="margin:0;font-size:14.5px" data-tex="d\mathbf W^{(l)}=(\mathbf H^{(l-1)})^\top\boldsymbol\Delta^{(l)},\qquad d\mathbf b^{(l)}=\sum_{n=1}^{B}\boldsymbol\Delta^{(l)}_{n,:},\qquad [H_{l-1},B]\cdot[B,H_l]\to[H_{l-1},H_l]"></div></foreignObject></g>
<text x="40" y="444" class="legend">серые стрелки: прямой проход · красные стрелки и подписи: обратный, на них производные</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="x eq0 mm0" data-focus="x eq0"><div class="step-kicker">Шаг 1 · данные батча</div><h4>Каждый объект занимает одну строку</h4><div class="math-display" data-tex="\mathbf X=[\mathbf x_1;\ldots;\mathbf x_B],\qquad \mathbf Y=[\mathbf y_1;\ldots;\mathbf y_B]"></div><p>Новая ось <span class="math-inline" data-tex="B"></span> считает объекты. Значения скрытых слоёв теперь тоже матрицы, поэтому пишем <span class="math-inline" data-tex="\mathbf H^{(l)}"></span>, а ширины слоёв остаются <span class="math-inline" data-tex="H_l"></span>.</p></div>
    <div class="step-panel" data-on="x h1 h2 eq1 mm2" data-focus="h1 h2 eq1"><div class="step-kicker">Шаг 2 · скрытые слои</div><h4>Одна матричная операция обрабатывает все строки</h4><div class="math-display" data-tex="\mathbf Z^{(1)}=\mathbf X\mathbf W^{(1)}+\mathbf b^{(1)},\qquad \mathbf Z^{(2)}=\mathbf H^{(1)}\mathbf W^{(2)}+\mathbf b^{(2)}"></div><p>Сдвиг прибавляется к каждой строке.</p></div>
    <div class="step-panel" data-on="h2 s p eq2 mm3" data-focus="s p eq2"><div class="step-kicker">Шаг 3 · логиты и softmax</div><h4>Softmax применяется независимо к каждой строке</h4><div class="math-display" data-tex="P_{nc}=\frac{e^{S_{nc}}}{\sum_k e^{S_{nk}}}"></div><p>Сумма по <span class="math-inline" data-tex="c"></span> равна 1 для каждого объекта <span class="math-inline" data-tex="n"></span>.</p></div>
    <div class="step-panel" data-on="p loss eq3 mm4" data-focus="loss eq3"><div class="step-kicker">Шаг 4 · средняя потеря</div><h4>Сначала <span class="math-inline" data-tex="B"></span> отдельных ошибок, затем среднее</h4><div class="math-display" data-tex="L=\frac1B\sum_{n=1}^{B}\ell_n"></div><p>Раз потеря усреднена, множитель <span class="math-inline" data-tex="1/B"></span> появится и в градиентах.</p></div>
    <div class="step-panel" data-on="p loss grad eq4 mm5" data-focus="grad eq4"><div class="step-kicker">Шаг 5 · выходной сигнал</div><h4>У каждой строки свой остаток</h4><div class="math-display" data-tex="\Delta^{(3)}_{n,:}=\frac{\mathbf p_n-\mathbf y_n}{B}"></div><p>Строки пока не смешиваются, каждая только делится на размер батча.</p></div>
    <div class="step-panel" data-on="x h1 h2 s p loss grad eq5 mm5" data-focus="grad eq5"><div class="step-kicker">Шаг 6 · общие параметры</div><h4>Матричное произведение складывает вклады объектов</h4><div class="math-display" data-tex="dW^{(l)}_{ij}=\sum_{n=1}^{B}H^{(l-1)}_{ni}\Delta^{(l)}_{nj}"></div><p>Один вес использовался во всех строках, поэтому получает один общий градиент.</p></div>
  </div>
</div>

### Проверяем батч из двух объектов

<p>
  Добавим второй объект <span class="math-inline" data-tex="[0.5,2]"></span> с
  правильным классом 2. Параметры сети не меняем. Второй объект пока распознаётся
  плохо, поэтому его вклад в средний loss и градиент будет заметно больше.
</p>

<div class="stage" id="stageBatchNumeric" tabindex="0" aria-label="Пошаговая числовая проверка батча из двух объектов">
  <div class="stage-figure">
<svg class="viz-svg" id="mlp-batchn-svg" viewBox="0 0 960 316" role="img" aria-label="Батч из двух объектов: матрицы X и Y, forward, вероятности, дельты и градиенты">
<defs><marker id="mlp-batchn-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#C30B0A"/></marker></defs>
<rect x="24" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-284.167" y="14.68" width="760" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf X"></span> и <span data-tex="\mathbf Y"></span></span></div></foreignObject>
<rect x="177.667" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="249.5" y="35" text-anchor="middle" font-size="12" fill="#5E5850">два forward</text>
<rect x="331.333" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="23.167" y="14.68" width="760" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf P"></span> и loss</span></div></foreignObject>
<rect x="485" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="436.833" y="14.68" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400" data-tex="\boldsymbol\Delta^{(3)}"></div></foreignObject>
<rect x="638.667" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="330.5" y="14.68" width="760" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="d\mathbf W^{(3)}"></span> и <span data-tex="d\mathbf b^{(3)}"></span></span></div></foreignObject>
<rect x="792.333" y="18" width="143.667" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="864.167" y="35" text-anchor="middle" font-size="12" fill="#5E5850">шесть градиентов</text>
<g data-key="mm0" data-only="1"><rect x="22" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="175.667" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="329.333" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="483" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="636.667" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm5" data-only="1"><rect x="790.333" y="16" width="147.667" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" text-anchor="middle" font-size="13" fill="#5E5850">малиновым выделено то, что считаем руками: строка, столбец и клетка результата</text>
<g transform="translate(0,-34)">
<g data-key="e1" data-only="1"><rect x="250" y="190" width="120" height="68" fill="#3576C0" fill-opacity="0.1"/>
<line x1="310" y1="190" x2="310" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="250" y1="224" x2="370" y2="224" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 249 185 L 239 185 L 239 263 L 249 263" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 371 185 L 381 185 L 381 263 L 371 263" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<foreignObject x="160" y="188.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{1,1}"></div></foreignObject>
<foreignObject x="220" y="188.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{1,2}"></div></foreignObject>
<foreignObject x="160" y="222.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{2,1}"></div></foreignObject>
<foreignObject x="220" y="222.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{2,2}"></div></foreignObject>
<foreignObject x="190" y="154.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="-70" y="261.96" width="760" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700"><span><span data-tex="\mathbf X"></span> · два объекта</span></div></foreignObject><text x="228" y="212" text-anchor="end" font-size="12.5" fill="#5E5850">объект 1</text><text x="228" y="246" text-anchor="end" font-size="12.5" fill="#5E5850">объект 2</text><rect x="570" y="190" width="120" height="68" fill="#3576C0" fill-opacity="0.1"/>
<line x1="630" y1="190" x2="630" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="570" y1="224" x2="690" y2="224" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 569 185 L 559 185 L 559 263 L 569 263" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 691 185 L 701 185 L 701 263 L 691 263" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<foreignObject x="480" y="188.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{1,1}"></div></foreignObject>
<foreignObject x="540" y="188.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{1,2}"></div></foreignObject>
<foreignObject x="480" y="222.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{2,1}"></div></foreignObject>
<foreignObject x="540" y="222.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{2,2}"></div></foreignObject>
<foreignObject x="510" y="154.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="250" y="261.96" width="760" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700"><span><span data-tex="\mathbf Y"></span> · верные классы</span></div></foreignObject><foreignObject x="100" y="288.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span>строка <span data-tex="n"></span> — объект <span data-tex="n"></span>, столбец <span data-tex="c"></span> — класс <span data-tex="c"></span>; в каждой строке <span data-tex="\mathbf Y"></span> ровно одна единица</span></div></foreignObject></g>
<g data-key="e2" data-only="1"><rect x="60" y="175" width="108" height="64" fill="#3576C0" fill-opacity="0.1"/>
<line x1="114" y1="175" x2="114" y2="239" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="60" y1="207" x2="168" y2="207" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 59 170 L 49 170 L 49 244 L 59 244" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 169 170 L 179 170 L 179 244 L 169 244" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<foreignObject x="-33" y="171.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{1,1}"></div></foreignObject>
<foreignObject x="21" y="171.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{1,2}"></div></foreignObject>
<foreignObject x="-33" y="203.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{2,1}"></div></foreignObject>
<foreignObject x="21" y="203.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{2,2}"></div></foreignObject>
<foreignObject x="-6" y="139.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="-6" y="242.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf X"></div></foreignObject><foreignObject x="72" y="182.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="\times"></div></foreignObject><rect x="218" y="175" width="108" height="64" fill="#C29E08" fill-opacity="0.16"/>
<line x1="272" y1="175" x2="272" y2="239" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="218" y1="207" x2="326" y2="207" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 217 170 L 207 170 L 207 244 L 217 244" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 327 170 L 337 170 L 337 244 L 327 244" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="125" y="171.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w_{1,1}"></div></foreignObject>
<foreignObject x="179" y="171.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w_{1,2}"></div></foreignObject>
<foreignObject x="125" y="203.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w_{2,1}"></div></foreignObject>
<foreignObject x="179" y="203.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w_{2,2}"></div></foreignObject>
<foreignObject x="152" y="139.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="152" y="242.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf W^{(1)}"></div></foreignObject><foreignObject x="230" y="182.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="+"></div></foreignObject><rect x="376" y="191" width="108" height="32" fill="#C29E08" fill-opacity="0.16"/>
<line x1="430" y1="191" x2="430" y2="223" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 375 186 L 365 186 L 365 228 L 375 228" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 485 186 L 495 186 L 495 228 L 485 228" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="283" y="187.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="b_{1}"></div></foreignObject>
<foreignObject x="337" y="187.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="b_{2}"></div></foreignObject>
<foreignObject x="310" y="155.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="1\times 2"></div></foreignObject>
<foreignObject x="310" y="242.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf b^{(1)}"></div></foreignObject><foreignObject x="388" y="182.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="="></div></foreignObject><rect x="534" y="175" width="108" height="64" fill="#73B222" fill-opacity="0.1"/>
<line x1="588" y1="175" x2="588" y2="239" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="534" y1="207" x2="642" y2="207" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 533 170 L 523 170 L 523 244 L 533 244" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 643 170 L 653 170 L 653 244 L 643 244" fill="none" stroke="#73B222" stroke-width="1.8"/>
<foreignObject x="441" y="171.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z_{1,1}"></div></foreignObject>
<foreignObject x="495" y="171.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z_{1,2}"></div></foreignObject>
<foreignObject x="441" y="203.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z_{2,1}"></div></foreignObject>
<foreignObject x="495" y="203.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="z_{2,2}"></div></foreignObject>
<foreignObject x="468" y="139.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="468" y="242.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf Z^{(1)}"></div></foreignObject><foreignObject x="420" y="174.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span>одни и те же <span data-tex="\mathbf W"></span> и <span data-tex="\mathbf b"></span></span></div></foreignObject><text x="800" y="216" text-anchor="middle" font-size="13" fill="#5E5850">обрабатывают обе строки;</text><text x="800" y="236" text-anchor="middle" font-size="13" fill="#5E5850">строки между собой не смешиваются</text><text x="480" y="300" text-anchor="middle" font-size="13" fill="#5E5850">дальше ReLU, второй скрытый слой и выходной — те же три операции</text></g>
<g data-key="h2" data-only="1"><rect x="60" y="207" width="108" height="32" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="218" y="175" width="54" height="64" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="534" y="207" width="54" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e3" data-only="1"><rect x="190" y="178" width="128" height="72" fill="#73B222" fill-opacity="0.1"/>
<line x1="254" y1="178" x2="254" y2="250" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="190" y1="214" x2="318" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 189 173 L 179 173 L 179 255 L 189 255" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 319 173 L 329 173 L 329 255 L 319 255" fill="none" stroke="#73B222" stroke-width="1.8"/>
<foreignObject x="102" y="177.36" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="p_{1,1}"></div></foreignObject>
<foreignObject x="166" y="177.36" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="p_{1,2}"></div></foreignObject>
<foreignObject x="102" y="213.36" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="p_{2,1}"></div></foreignObject>
<foreignObject x="166" y="213.36" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="p_{2,2}"></div></foreignObject>
<foreignObject x="134" y="142.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="-126" y="253.96" width="760" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700"><span><span data-tex="\mathbf P"></span> · вероятности</span></div></foreignObject><path d="M 340 214 L 396 214" fill="none" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlp-batchn-arrow)"/><rect x="404" y="172" width="176" height="38" rx="9" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.6"/><foreignObject x="372" y="172.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\ell_1=-\log p_{1,1}"></div></foreignObject><rect x="404" y="220" width="176" height="38" rx="9" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.6"/><foreignObject x="372" y="220.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\ell_2=-\log p_{2,2}"></div></foreignObject><path d="M 580 214 L 636 214" fill="none" stroke="#C30B0A" stroke-width="2.4" marker-end="url(#mlp-batchn-arrow)"/><rect x="644" y="180" width="170" height="70" rx="11" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.6"/><foreignObject x="609" y="184.6" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="L"></div></foreignObject><foreignObject x="609" y="210.64" width="240" height="35"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13.5px;color:#5E5850;font-weight:400" data-tex="(\ell_1+\ell_2)/2"></div></foreignObject><rect x="190" y="178" width="64" height="36" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="254" y="214" width="64" height="36" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><foreignObject x="100" y="286.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span>из каждой строки <span data-tex="\mathbf P"></span> берётся ровно одна клетка — та, где в <span data-tex="\mathbf Y"></span> стоит единица</span></div></foreignObject></g>
<g data-key="e4" data-only="1"><rect x="110" y="180" width="116" height="68" fill="#73B222" fill-opacity="0.1"/>
<line x1="168" y1="180" x2="168" y2="248" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="110" y1="214" x2="226" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 109 175 L 99 175 L 99 253 L 109 253" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 227 175 L 237 175 L 237 253 L 227 253" fill="none" stroke="#73B222" stroke-width="1.8"/>
<foreignObject x="19" y="178.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="p_{1,1}"></div></foreignObject>
<foreignObject x="77" y="178.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="p_{1,2}"></div></foreignObject>
<foreignObject x="19" y="212.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="p_{2,1}"></div></foreignObject>
<foreignObject x="77" y="212.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="p_{2,2}"></div></foreignObject>
<foreignObject x="48" y="144.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="48" y="251.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf P"></div></foreignObject><foreignObject x="128" y="188.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="-"></div></foreignObject><rect x="276" y="180" width="116" height="68" fill="#3576C0" fill-opacity="0.1"/>
<line x1="334" y1="180" x2="334" y2="248" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="276" y1="214" x2="392" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 275 175 L 265 175 L 265 253 L 275 253" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<path d="M 393 175 L 403 175 L 403 253 L 393 253" fill="none" stroke="#3576C0" stroke-width="1.8"/>
<foreignObject x="185" y="178.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{1,1}"></div></foreignObject>
<foreignObject x="243" y="178.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{1,2}"></div></foreignObject>
<foreignObject x="185" y="212.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{2,1}"></div></foreignObject>
<foreignObject x="243" y="212.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{2,2}"></div></foreignObject>
<foreignObject x="214" y="144.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="214" y="251.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf Y"></div></foreignObject><foreignObject x="294" y="188.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="="></div></foreignObject><rect x="442" y="180" width="116" height="68" fill="#E88919" fill-opacity="0.14"/>
<line x1="500" y1="180" x2="500" y2="248" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="442" y1="214" x2="558" y2="214" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 441 175 L 431 175 L 431 253 L 441 253" fill="none" stroke="#E88919" stroke-width="1.8"/>
<path d="M 559 175 L 569 175 L 569 253 L 559 253" fill="none" stroke="#E88919" stroke-width="1.8"/>
<foreignObject x="351" y="178.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\delta_{1,1}"></div></foreignObject>
<foreignObject x="409" y="178.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\delta_{1,2}"></div></foreignObject>
<foreignObject x="351" y="212.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\delta_{2,1}"></div></foreignObject>
<foreignObject x="409" y="212.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\delta_{2,2}"></div></foreignObject>
<foreignObject x="380" y="144.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="380" y="251.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\boldsymbol\Delta^{(3)}"></div></foreignObject><foreignObject x="178" y="277" width="760" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400"><span>уже поделено на <span data-tex="B=2"></span></span></div></foreignObject><text x="790" y="196" text-anchor="middle" font-size="13" fill="#5E5850">знак клетки говорит,</text><text x="790" y="216" text-anchor="middle" font-size="13" fill="#5E5850">какой логит опустить,</text><text x="790" y="236" text-anchor="middle" font-size="13" fill="#5E5850">а какой поднять</text><text x="480" y="326" text-anchor="middle" font-size="13" fill="#5E5850">строки пока не смешиваются: у каждого объекта свой остаток</text></g>
<g data-key="h4" data-only="1"><rect x="110" y="214" width="116" height="34" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="276" y="214" width="116" height="34" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="442" y="214" width="116" height="34" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/></g>
<g data-key="e5" data-only="1"><rect x="70" y="178" width="108" height="64" fill="#73B222" fill-opacity="0.1"/>
<line x1="124" y1="178" x2="124" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="70" y1="210" x2="178" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 69 173 L 59 173 L 59 247 L 69 247" fill="none" stroke="#73B222" stroke-width="1.8"/>
<path d="M 179 173 L 189 173 L 189 247 L 179 247" fill="none" stroke="#73B222" stroke-width="1.8"/>
<foreignObject x="-23" y="174.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{1,1}"></div></foreignObject>
<foreignObject x="31" y="174.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{2,1}"></div></foreignObject>
<foreignObject x="-23" y="206.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{1,2}"></div></foreignObject>
<foreignObject x="31" y="206.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{2,2}"></div></foreignObject>
<foreignObject x="4" y="142.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="4" y="245.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="(\mathbf H^{(2)})^\top"></div></foreignObject><foreignObject x="82" y="185.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="\times"></div></foreignObject><rect x="228" y="178" width="108" height="64" fill="#E88919" fill-opacity="0.14"/>
<line x1="282" y1="178" x2="282" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="228" y1="210" x2="336" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 227 173 L 217 173 L 217 247 L 227 247" fill="none" stroke="#E88919" stroke-width="1.8"/>
<path d="M 337 173 L 347 173 L 347 247 L 337 247" fill="none" stroke="#E88919" stroke-width="1.8"/>
<foreignObject x="135" y="174.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\delta_{1,1}"></div></foreignObject>
<foreignObject x="189" y="174.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\delta_{1,2}"></div></foreignObject>
<foreignObject x="135" y="206.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\delta_{2,1}"></div></foreignObject>
<foreignObject x="189" y="206.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\delta_{2,2}"></div></foreignObject>
<foreignObject x="162" y="142.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="162" y="245.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\boldsymbol\Delta^{(3)}"></div></foreignObject><foreignObject x="240" y="185.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="="></div></foreignObject><rect x="386" y="178" width="108" height="64" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="440" y1="178" x2="440" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="386" y1="210" x2="494" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 385 173 L 375 173 L 375 247 L 385 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 495 173 L 505 173 L 505 247 L 495 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="293" y="174.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{1,1}"></div></foreignObject>
<foreignObject x="347" y="174.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{1,2}"></div></foreignObject>
<foreignObject x="293" y="206.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{2,1}"></div></foreignObject>
<foreignObject x="347" y="206.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{2,2}"></div></foreignObject>
<foreignObject x="320" y="142.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="320" y="245.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf W^{(3)}"></div></foreignObject><rect x="640" y="194" width="108" height="32" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="694" y1="194" x2="694" y2="226" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 639 189 L 629 189 L 629 231 L 639 231" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 749 189 L 759 189 L 759 231 L 749 231" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="547" y="190.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial b_{1}"></div></foreignObject>
<foreignObject x="601" y="190.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial b_{2}"></div></foreignObject>
<foreignObject x="574" y="158.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="1\times 2"></div></foreignObject>
<foreignObject x="574" y="245.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf b^{(3)}"></div></foreignObject><foreignObject x="314" y="269" width="760" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12.5px;color:#5E5850;font-weight:400"><span>сумма строк <span data-tex="\boldsymbol\Delta^{(3)}"></span></span></div></foreignObject><text x="480" y="324" text-anchor="middle" font-size="13" fill="#5E5850">транспонирование ставит объекты внутрь суммы: один вес получает вклад обеих строк</text></g>
<g data-key="h5" data-only="1"><rect x="70" y="178" width="108" height="32" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="228" y="178" width="54" height="64" fill="#D83BB9" fill-opacity="0.2" stroke="#D83BB9" stroke-width="2"/><rect x="386" y="178" width="54" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="e6" data-only="1"><rect x="60" y="200" width="88" height="56" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="104" y1="200" x2="104" y2="256" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="60" y1="228" x2="148" y2="228" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 59 195 L 49 195 L 49 261 L 59 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 149 195 L 159 195 L 159 261 L 149 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="-38" y="198.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{1,1}"></div></foreignObject>
<foreignObject x="6" y="198.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{1,2}"></div></foreignObject>
<foreignObject x="-38" y="226.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{2,1}"></div></foreignObject>
<foreignObject x="6" y="226.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{2,2}"></div></foreignObject>
<foreignObject x="-16" y="164.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="-16" y="259.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf W^{(1)}"></div></foreignObject><rect x="210" y="214" width="88" height="28" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="254" y1="214" x2="254" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 209 209 L 199 209 L 199 247 L 209 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 299 209 L 309 209 L 309 247 L 299 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="112" y="212.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial b_{1}"></div></foreignObject>
<foreignObject x="156" y="212.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial b_{2}"></div></foreignObject>
<foreignObject x="134" y="178.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="1\times 2"></div></foreignObject>
<foreignObject x="134" y="259.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf b^{(1)}"></div></foreignObject><rect x="360" y="200" width="88" height="56" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="404" y1="200" x2="404" y2="256" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="360" y1="228" x2="448" y2="228" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 359 195 L 349 195 L 349 261 L 359 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 449 195 L 459 195 L 459 261 L 449 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="262" y="198.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{1,1}"></div></foreignObject>
<foreignObject x="306" y="198.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{1,2}"></div></foreignObject>
<foreignObject x="262" y="226.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{2,1}"></div></foreignObject>
<foreignObject x="306" y="226.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{2,2}"></div></foreignObject>
<foreignObject x="284" y="164.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="284" y="259.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf W^{(2)}"></div></foreignObject><rect x="510" y="214" width="88" height="28" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="554" y1="214" x2="554" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 509 209 L 499 209 L 499 247 L 509 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 599 209 L 609 209 L 609 247 L 599 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="412" y="212.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial b_{1}"></div></foreignObject>
<foreignObject x="456" y="212.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial b_{2}"></div></foreignObject>
<foreignObject x="434" y="178.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="1\times 2"></div></foreignObject>
<foreignObject x="434" y="259.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf b^{(2)}"></div></foreignObject><rect x="660" y="200" width="88" height="56" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="704" y1="200" x2="704" y2="256" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="660" y1="228" x2="748" y2="228" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 659 195 L 649 195 L 649 261 L 659 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 749 195 L 759 195 L 759 261 L 749 261" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="562" y="198.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{1,1}"></div></foreignObject>
<foreignObject x="606" y="198.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{1,2}"></div></foreignObject>
<foreignObject x="562" y="226.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{2,1}"></div></foreignObject>
<foreignObject x="606" y="226.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial w_{2,2}"></div></foreignObject>
<foreignObject x="584" y="164.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="584" y="259.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf W^{(3)}"></div></foreignObject><rect x="810" y="214" width="88" height="28" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="854" y1="214" x2="854" y2="242" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 809 209 L 799 209 L 799 247 L 809 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 899 209 L 909 209 L 909 247 L 899 247" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="712" y="212.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial b_{1}"></div></foreignObject>
<foreignObject x="756" y="212.16" width="240" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#111111;font-weight:400" data-tex="\partial b_{2}"></div></foreignObject>
<foreignObject x="734" y="178.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="1\times 2"></div></foreignObject>
<foreignObject x="734" y="259.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf b^{(3)}"></div></foreignObject><text x="480" y="320" text-anchor="middle" font-size="13" fill="#5E5850">эти шесть матриц — весь результат backward; их получает оптимизатор</text></g>
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
    <div class="step-panel" data-on="mm0 e1" data-focus="e1"><div class="step-kicker">Шаг 1 &#183; что дано</div><h4>Батч — это матрица <span class="math-inline" data-tex="2\times2"></span>: строка на объект</h4><div class="math-display" data-mlp-tex="batchData"></div><p>Второй объект — <span class="math-inline" data-tex="[0.5,\,2]"></span> с верным классом 2. Параметры сети те же, что и в разделе про один объект: меняется только число строк на входе.</p></div>
    <div class="step-panel" data-on="mm1 e2 h2" data-focus="h2"><div class="step-kicker">Шаг 2 &#183; одна клетка результата</div><h4><span class="math-inline" data-tex="z^{(1)}_{2,1}"></span>: сумма двух произведений плюс смещение</h4><div class="math-display" data-mlp-tex="batchCellForm"></div><div class="math-display" data-mlp-tex="batchCellNum"></div><p>Подсвечены строка 2 матрицы <span class="math-inline" data-tex="\mathbf X"></span>, столбец 1 матрицы <span class="math-inline" data-tex="\mathbf W^{(1)}"></span> и клетка, которая из них получается. Правило одно на все четыре клетки <span class="math-inline" data-tex="\mathbf Z^{(1)}"></span>.</p></div>
    <div class="step-panel" data-on="mm2 e3" data-focus="e3"><div class="step-kicker">Шаг 3 &#183; вероятности и средний loss</div><h4>Каждая строка получает свою вероятность и свой штраф</h4><div class="math-display" data-mlp-tex="batchForward"></div><div class="math-display" data-mlp-tex="batchLoss"></div><p>Первый объект распознан уверенно, второй — уверенно неверно, поэтому в среднем loss почти всё приходит от второй строки.</p></div>
    <div class="step-panel" data-on="mm3 e4 h4" data-focus="h4"><div class="step-kicker">Шаг 4 &#183; выходной сигнал</div><h4>Вычитаем метки и сразу делим на <span class="math-inline" data-tex="B=2"></span></h4><div class="math-display" data-mlp-tex="batchD3"></div><p>Деление на размер батча появляется здесь ровно потому, что loss усреднён. Если бы мы складывали ошибки без деления, множитель <span class="math-inline" data-tex="1/B"></span> пропал бы и из градиентов.</p></div>
    <div class="step-panel" data-on="mm4 e5 h5" data-focus="h5"><div class="step-kicker">Шаг 5 &#183; выходной слой</div><h4><span class="math-inline" data-tex="(\mathbf H^{(2)})^\top"></span> складывает вклады обоих объектов</h4><div class="math-display" data-mlp-tex="batchDW3cell"></div><div class="math-display" data-mlp-tex="batchW3"></div><p>Форма результата совпадает с формой <span class="math-inline" data-tex="\mathbf W^{(3)}"></span>. Смещение получает сумму строк <span class="math-inline" data-tex="\boldsymbol\Delta^{(3)}"></span>: <span class="math-inline" data-tex="\mathbf b^{(3)}"></span> участвовал в обеих строках одинаково.</p></div>
    <div class="step-panel" data-on="mm5 e6" data-focus="e6"><div class="step-kicker">Шаг 6 &#183; все слои</div><h4>Дальше повторяется маска ReLU и тот же linear backward</h4><div class="math-display" data-mlp-tex="batchAll"></div><p>Формулы те же, что для одного объекта; добавилась только ось строк, по которой идёт суммирование.</p></div>
  </div>
</div>

### Один шаг gradient descent

<p>
  Оптимизатор не меняет данные, активации, softmax или loss. Он обновляет только
  обучаемые параметры. Для каждого слоя действует одно и то же правило.
</p>

<div class="stage" id="stageUpdateFormula" tabindex="0" aria-label="Формулы одного шага gradient descent для многослойной сети">
  <div class="stage-figure">
<svg class="viz-svg" id="mlp-uf-svg" viewBox="0 0 960 442" role="img" aria-label="Шаг спуска: параметры, градиенты той же формы и обновлённые параметры">
<defs><marker id="mlp-uf-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#C30B0A"/></marker><marker id="mlp-uf-arrow2" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#C29E08"/></marker></defs>
<rect x="24" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-268.8" y="14.68" width="760" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\theta"></span> — что меняем</span></div></foreignObject>
<rect x="208.4" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-84.4" y="14.68" width="760" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\nabla_\theta L"></span> — куда</span></div></foreignObject>
<rect x="392.8" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="480" y="35" text-anchor="middle" font-size="12" fill="#5E5850">правило клетки</text>
<rect x="577.2" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="284.4" y="14.68" width="760" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="\theta'"></span> — новое состояние</span></div></foreignObject>
<rect x="761.6" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="848.8" y="35" text-anchor="middle" font-size="12" fill="#5E5850">новый forward</text>
<g data-key="mm0" data-only="1"><rect x="22" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="206.4" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="390.8" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="575.2" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="759.6" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" text-anchor="middle" font-size="13" fill="#5E5850">форма градиента всегда совпадает с формой параметра — поэтому вычитание поклеточное</text>
<g data-key="uf-theta" data-only="1"><foreignObject x="20" y="91" width="760" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12.5px;color:#5E5850;font-weight:400"><span><span data-tex="\theta"></span> — обучаемые числа</span></div></foreignObject><rect x="40" y="120" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="78" y1="120" x2="78" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="40" y1="146" x2="116" y2="146" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 39 115 L 29 115 L 29 177 L 39 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 117 115 L 127 115 L 127 177 L 117 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="-61" y="118.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{1,1}"></div></foreignObject>
<foreignObject x="-23" y="118.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{1,2}"></div></foreignObject>
<foreignObject x="-61" y="144.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{2,1}"></div></foreignObject>
<foreignObject x="-23" y="144.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{2,2}"></div></foreignObject>
<foreignObject x="-42" y="173.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf W^{(1)}"></div></foreignObject><rect x="150" y="133" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="188" y1="133" x2="188" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 149 128 L 139 128 L 139 164 L 149 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 227 128 L 237 128 L 237 164 L 227 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="49" y="131.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b_{1}"></div></foreignObject>
<foreignObject x="87" y="131.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b_{2}"></div></foreignObject>
<foreignObject x="68" y="173.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf b^{(1)}"></div></foreignObject><rect x="260" y="120" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="298" y1="120" x2="298" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="260" y1="146" x2="336" y2="146" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 259 115 L 249 115 L 249 177 L 259 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 337 115 L 347 115 L 347 177 L 337 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="159" y="118.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{1,1}"></div></foreignObject>
<foreignObject x="197" y="118.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{1,2}"></div></foreignObject>
<foreignObject x="159" y="144.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{2,1}"></div></foreignObject>
<foreignObject x="197" y="144.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{2,2}"></div></foreignObject>
<foreignObject x="178" y="173.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf W^{(2)}"></div></foreignObject><rect x="370" y="133" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="408" y1="133" x2="408" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 369 128 L 359 128 L 359 164 L 369 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 447 128 L 457 128 L 457 164 L 447 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="269" y="131.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b_{1}"></div></foreignObject>
<foreignObject x="307" y="131.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b_{2}"></div></foreignObject>
<foreignObject x="288" y="173.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf b^{(2)}"></div></foreignObject><rect x="480" y="120" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="518" y1="120" x2="518" y2="172" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="480" y1="146" x2="556" y2="146" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 479 115 L 469 115 L 469 177 L 479 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 557 115 L 567 115 L 567 177 L 557 177" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="379" y="118.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{1,1}"></div></foreignObject>
<foreignObject x="417" y="118.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{1,2}"></div></foreignObject>
<foreignObject x="379" y="144.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{2,1}"></div></foreignObject>
<foreignObject x="417" y="144.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w_{2,2}"></div></foreignObject>
<foreignObject x="398" y="173.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf W^{(3)}"></div></foreignObject><rect x="590" y="133" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="628" y1="133" x2="628" y2="159" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 589 128 L 579 128 L 579 164 L 589 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 667 128 L 677 128 L 677 164 L 667 164" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="489" y="131.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b_{1}"></div></foreignObject>
<foreignObject x="527" y="131.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b_{2}"></div></foreignObject>
<foreignObject x="508" y="173.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf b^{(3)}"></div></foreignObject></g>
<g data-key="uf-grad" data-only="1"><foreignObject x="92" y="201" width="240" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="\nabla_\theta L"></div></foreignObject><rect x="40" y="232" width="76" height="52" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="78" y1="232" x2="78" y2="284" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="40" y1="258" x2="116" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 39 227 L 29 227 L 29 289 L 39 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 117 227 L 127 227 L 127 289 L 117 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="-61" y="230.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{1,1}"></div></foreignObject>
<foreignObject x="-23" y="230.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{1,2}"></div></foreignObject>
<foreignObject x="-61" y="256.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{2,1}"></div></foreignObject>
<foreignObject x="-23" y="256.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{2,2}"></div></foreignObject>
<foreignObject x="-42" y="285.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf W^{(1)}"></div></foreignObject><rect x="150" y="245" width="76" height="26" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="188" y1="245" x2="188" y2="271" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 149 240 L 139 240 L 139 276 L 149 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 227 240 L 237 240 L 237 276 L 227 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="49" y="243.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial b_{1}"></div></foreignObject>
<foreignObject x="87" y="243.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial b_{2}"></div></foreignObject>
<foreignObject x="68" y="285.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf b^{(1)}"></div></foreignObject><rect x="260" y="232" width="76" height="52" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="298" y1="232" x2="298" y2="284" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="260" y1="258" x2="336" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 259 227 L 249 227 L 249 289 L 259 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 337 227 L 347 227 L 347 289 L 337 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="159" y="230.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{1,1}"></div></foreignObject>
<foreignObject x="197" y="230.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{1,2}"></div></foreignObject>
<foreignObject x="159" y="256.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{2,1}"></div></foreignObject>
<foreignObject x="197" y="256.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{2,2}"></div></foreignObject>
<foreignObject x="178" y="285.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf W^{(2)}"></div></foreignObject><rect x="370" y="245" width="76" height="26" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="408" y1="245" x2="408" y2="271" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 369 240 L 359 240 L 359 276 L 369 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 447 240 L 457 240 L 457 276 L 447 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="269" y="243.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial b_{1}"></div></foreignObject>
<foreignObject x="307" y="243.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial b_{2}"></div></foreignObject>
<foreignObject x="288" y="285.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf b^{(2)}"></div></foreignObject><rect x="480" y="232" width="76" height="52" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="518" y1="232" x2="518" y2="284" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="480" y1="258" x2="556" y2="258" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 479 227 L 469 227 L 469 289 L 479 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 557 227 L 567 227 L 567 289 L 557 289" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="379" y="230.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{1,1}"></div></foreignObject>
<foreignObject x="417" y="230.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{1,2}"></div></foreignObject>
<foreignObject x="379" y="256.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{2,1}"></div></foreignObject>
<foreignObject x="417" y="256.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial w_{2,2}"></div></foreignObject>
<foreignObject x="398" y="285.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf W^{(3)}"></div></foreignObject><rect x="590" y="245" width="76" height="26" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="628" y1="245" x2="628" y2="271" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 589 240 L 579 240 L 579 276 L 589 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 667 240 L 677 240 L 677 276 L 667 276" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="489" y="243.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial b_{1}"></div></foreignObject>
<foreignObject x="527" y="243.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="\partial b_{2}"></div></foreignObject>
<foreignObject x="508" y="285.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf b^{(3)}"></div></foreignObject></g>
<g data-key="uf-new" data-only="1"><foreignObject x="92" y="313" width="240" height="33"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:12.5px;color:#5E5850;font-weight:400" data-tex="\theta'"></div></foreignObject><rect x="40" y="344" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="78" y1="344" x2="78" y2="396" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="40" y1="370" x2="116" y2="370" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 39 339 L 29 339 L 29 401 L 39 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 117 339 L 127 339 L 127 401 L 117 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="-61" y="342.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{1,1}"></div></foreignObject>
<foreignObject x="-23" y="342.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{1,2}"></div></foreignObject>
<foreignObject x="-61" y="368.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{2,1}"></div></foreignObject>
<foreignObject x="-23" y="368.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{2,2}"></div></foreignObject>
<foreignObject x="-42" y="397.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf W^{(1)\prime}"></div></foreignObject><rect x="150" y="357" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="188" y1="357" x2="188" y2="383" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 149 352 L 139 352 L 139 388 L 149 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 227 352 L 237 352 L 237 388 L 227 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="49" y="355.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b\prime_{1}"></div></foreignObject>
<foreignObject x="87" y="355.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b\prime_{2}"></div></foreignObject>
<foreignObject x="68" y="397.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf b^{(1)\prime}"></div></foreignObject><rect x="260" y="344" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="298" y1="344" x2="298" y2="396" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="260" y1="370" x2="336" y2="370" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 259 339 L 249 339 L 249 401 L 259 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 337 339 L 347 339 L 347 401 L 337 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="159" y="342.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{1,1}"></div></foreignObject>
<foreignObject x="197" y="342.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{1,2}"></div></foreignObject>
<foreignObject x="159" y="368.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{2,1}"></div></foreignObject>
<foreignObject x="197" y="368.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{2,2}"></div></foreignObject>
<foreignObject x="178" y="397.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf W^{(2)\prime}"></div></foreignObject><rect x="370" y="357" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="408" y1="357" x2="408" y2="383" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 369 352 L 359 352 L 359 388 L 369 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 447 352 L 457 352 L 457 388 L 447 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="269" y="355.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b\prime_{1}"></div></foreignObject>
<foreignObject x="307" y="355.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b\prime_{2}"></div></foreignObject>
<foreignObject x="288" y="397.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf b^{(2)\prime}"></div></foreignObject><rect x="480" y="344" width="76" height="52" fill="#C29E08" fill-opacity="0.16"/>
<line x1="518" y1="344" x2="518" y2="396" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="480" y1="370" x2="556" y2="370" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 479 339 L 469 339 L 469 401 L 479 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 557 339 L 567 339 L 567 401 L 557 401" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="379" y="342.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{1,1}"></div></foreignObject>
<foreignObject x="417" y="342.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{1,2}"></div></foreignObject>
<foreignObject x="379" y="368.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{2,1}"></div></foreignObject>
<foreignObject x="417" y="368.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="w\prime_{2,2}"></div></foreignObject>
<foreignObject x="398" y="397.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf W^{(3)\prime}"></div></foreignObject><rect x="590" y="357" width="76" height="26" fill="#C29E08" fill-opacity="0.16"/>
<line x1="628" y1="357" x2="628" y2="383" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 589 352 L 579 352 L 579 388 L 589 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 667 352 L 677 352 L 677 388 L 667 388" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="489" y="355.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b\prime_{1}"></div></foreignObject>
<foreignObject x="527" y="355.2" width="240" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:11px;color:#111111;font-weight:400" data-tex="b\prime_{2}"></div></foreignObject>
<foreignObject x="508" y="397.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf b^{(3)\prime}"></div></foreignObject></g>
<g data-key="uf-arrow1" data-only="1"><path d="M 78 200 L 78 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 188 200 L 188 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 298 200 L 298 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 408 200 L 408 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 518 200 L 518 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/><path d="M 628 200 L 628 224" fill="none" stroke="#C30B0A" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow)"/></g>
<g data-key="uf-arrow2" data-only="1"><path d="M 78 312 L 78 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 188 312 L 188 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 298 312 L 298 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 408 312 L 408 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 518 312 L 518 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/><path d="M 628 312 L 628 336" fill="none" stroke="#C29E08" stroke-width="1.4" stroke-dasharray="3 3" marker-end="url(#mlp-uf-arrow2)"/></g>
<g data-key="uf-rule" data-only="1"><rect x="690" y="150" width="250" height="180" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/><text x="815" y="176" text-anchor="middle" font-size="12.5" fill="#5E5850">правило одной клетки</text><rect x="712" y="192" width="88" height="36" rx="6" fill="#C29E08" fill-opacity="0.16" stroke="#D83BB9" stroke-width="2"/><foreignObject x="636" y="192.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="w^{(3)}_{1,1}"></div></foreignObject><foreignObject x="700" y="187.52" width="240" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="-"></div></foreignObject><rect x="840" y="192" width="88" height="36" rx="6" fill="#C30B0A" fill-opacity="0.10" stroke="#D83BB9" stroke-width="2"/><foreignObject x="764" y="192.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="\eta\,\partial w_{1,1}"></div></foreignObject><foreignObject x="695" y="223.52" width="240" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\downarrow"></div></foreignObject><rect x="776" y="264" width="88" height="36" rx="6" fill="#C29E08" fill-opacity="0.16" stroke="#D83BB9" stroke-width="2"/><foreignObject x="700" y="264.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="w^{(3)\prime}_{1,1}"></div></foreignObject><text x="815" y="318" text-anchor="middle" font-size="12" fill="#5E5850">так меняется каждое из 18 чисел</text></g>
<g data-key="uf-hl" data-only="1"><rect x="480" y="120" width="38" height="26" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="480" y="232" width="38" height="26" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="480" y="344" width="38" height="26" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><path d="M 499 146 L 499 230" fill="none" stroke="#D83BB9" stroke-width="1.4" stroke-dasharray="4 3"/><path d="M 499 258 L 499 342" fill="none" stroke="#D83BB9" stroke-width="1.4" stroke-dasharray="4 3"/></g>
<g data-key="uf-all" data-only="1"><rect x="690" y="150" width="250" height="180" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/><text x="815" y="180" text-anchor="middle" font-size="13" fill="#5E5850">в этой сети</text><text x="815" y="216" text-anchor="middle" font-size="30" font-weight="800" fill="#111111">18</text><text x="815" y="240" text-anchor="middle" font-size="13" fill="#5E5850">обучаемых чисел</text><text x="815" y="268" text-anchor="middle" font-size="12.5" fill="#5E5850">12 весов + 6 смещений;</text><text x="815" y="288" text-anchor="middle" font-size="12.5" fill="#5E5850">все меняются одновременно,</text><text x="815" y="308" text-anchor="middle" font-size="12.5" fill="#5E5850">по одному и тому же правилу</text></g>
<g data-key="uf-check" data-only="1"><rect x="690" y="150" width="250" height="180" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/><text x="815" y="176" text-anchor="middle" font-size="12.5" fill="#5E5850">проверка шага</text><rect x="712" y="190" width="206" height="34" rx="8" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/><foreignObject x="435" y="189.64" width="760" height="35"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13.5px;color:#111111;font-weight:400"><span>тот же батч <span data-tex="\mathbf X"></span>, <span data-tex="\mathbf Y"></span></span></div></foreignObject><foreignObject x="695" y="214.24" width="240" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\downarrow"></div></foreignObject><rect x="712" y="246" width="206" height="34" rx="8" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><foreignObject x="435" y="245.64" width="760" height="35"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13.5px;color:#111111;font-weight:400"><span>forward с <span data-tex="\theta'"></span></span></div></foreignObject><foreignObject x="695" y="270.24" width="240" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="\downarrow"></div></foreignObject><rect x="742" y="300" width="146" height="26" rx="8" fill="#FFF4F4" stroke="#C30B0A" stroke-width="1.6"/><foreignObject x="435" y="295.64" width="760" height="35"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13.5px;color:#111111;font-weight:400"><span>новый <span data-tex="L'"></span></span></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="mm0 uf-theta" data-focus="uf-theta"><div class="step-kicker">Шаг 1 &#183; текущее состояние</div><h4>Все обучаемые числа собраны в один набор <span class="math-inline" data-tex="\boldsymbol\theta"></span></h4><div class="math-display" data-tex="\boldsymbol\theta=\{\mathbf W^{(1)},\mathbf b^{(1)},\mathbf W^{(2)},\mathbf b^{(2)},\mathbf W^{(3)},\mathbf b^{(3)}\}"></div><p>Входы, значения скрытых слоёв и вероятности в <span class="math-inline" data-tex="\boldsymbol\theta"></span> не входят: они пересчитываются заново на каждом forward.</p></div>
    <div class="step-panel" data-on="mm1 uf-theta uf-grad uf-arrow1" data-focus="uf-grad"><div class="step-kicker">Шаг 2 &#183; направление</div><h4>Backward вернул матрицы ровно тех же форм</h4><div class="math-display" data-tex="\nabla_{\boldsymbol\theta}L=\{d\mathbf W^{(1)},d\mathbf b^{(1)},d\mathbf W^{(2)},d\mathbf b^{(2)},d\mathbf W^{(3)},d\mathbf b^{(3)}\}"></div><p>Совпадение форм градиента и параметра — проверка: если формы разошлись, где-то забыто транспонирование или суммирование по батчу.</p></div>
    <div class="step-panel" data-on="mm2 uf-theta uf-grad uf-new uf-arrow1 uf-arrow2 uf-rule uf-hl" data-focus="uf-rule"><div class="step-kicker">Шаг 3 &#183; правило клетки</div><h4>Каждое число уменьшается на свою производную с множителем <span class="math-inline" data-tex="\eta"></span></h4><div class="math-display" data-tex="w^{(l)}_{ij}\;\leftarrow\;w^{(l)}_{ij}-\eta\,\frac{\partial L}{\partial w^{(l)}_{ij}}"></div><p>Градиент показывает направление роста loss, поэтому мы идём в противоположную сторону. Для обновления клетки нужны только её значение и её производная.</p></div>
    <div class="step-panel" data-on="mm3 uf-theta uf-grad uf-new uf-arrow1 uf-arrow2 uf-all" data-focus="uf-all"><div class="step-kicker">Шаг 4 &#183; обновление</div><h4>Одно и то же вычитание применяется ко всем слоям</h4><div class="math-display" data-tex="\boldsymbol\theta' = \boldsymbol\theta-\eta\,\nabla_{\boldsymbol\theta}L"></div><p>Никакой очерёдности нет: слои обновляются из градиентов, посчитанных до шага, а не по цепочке друг за другом.</p></div>
    <div class="step-panel" data-on="mm4 uf-theta uf-grad uf-new uf-arrow1 uf-arrow2 uf-check" data-focus="uf-check"><div class="step-kicker">Шаг 5 &#183; проверка</div><h4>Новый loss узнаём только новым forward</h4><div class="math-display" data-tex="L(\boldsymbol\theta')&lt;L(\boldsymbol\theta)\quad\text{при достаточно малом }\eta"></div><p>Слишком большой шаг перескакивает через область уменьшения: спад гарантирован только при достаточно малом <span class="math-inline" data-tex="\eta"></span>.</p></div>
  </div>
</div>

### Проверяем обновление на числах

<p>
  Берём средние градиенты батча и learning rate
  <span class="math-inline" data-tex="\eta=0.1"></span>. Проследим одну клетку —
  <span class="math-inline" data-tex="W^{(3)}_{1,1}"></span> — от градиента до нового
  значения, а затем запустим новый forward для того же батча.
</p>

<div class="stage" id="stageUpdateNumeric" tabindex="0" aria-label="Числовая проверка одного шага gradient descent">
  <div class="stage-figure">
<svg class="viz-svg" id="mlp-un-svg" viewBox="0 0 960 326" role="img" aria-label="Числовой шаг спуска: loss до, градиенты, умножение на eta, вычитание и loss после">
<defs><marker id="mlp-un-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#73B222"/></marker></defs>
<rect x="24" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="-268.8" y="14.68" width="760" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="L"></span> до шага</span></div></foreignObject>
<rect x="208.4" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="295.6" y="35" text-anchor="middle" font-size="12" fill="#5E5850">градиенты</text>
<rect x="392.8" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="100" y="14.68" width="760" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span>умножаем на <span data-tex="\eta"></span></span></div></foreignObject>
<rect x="577.2" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<text x="664.4" y="35" text-anchor="middle" font-size="12" fill="#5E5850">вычитаем</text>
<rect x="761.6" y="18" width="174.4" height="26" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/>
<foreignObject x="468.8" y="14.68" width="760" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:12px;color:#5E5850;font-weight:400"><span><span data-tex="L"></span> после шага</span></div></foreignObject>
<g data-key="mm0" data-only="1"><rect x="22" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm1" data-only="1"><rect x="206.4" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm2" data-only="1"><rect x="390.8" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm3" data-only="1"><rect x="575.2" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<g data-key="mm4" data-only="1"><rect x="759.6" y="16" width="178.4" height="30" rx="6" fill="none" stroke="#C30B0A" stroke-width="2"/></g>
<text x="480" y="62" text-anchor="middle" font-size="13" fill="#5E5850">в клетках стоят только имена — все числа собраны в описании шага под сценой</text>
<g transform="translate(0,-34)">
<g data-key="un1" data-only="1"><line x1="300" y1="292" x2="700" y2="292" stroke="#C9C2B8" stroke-width="1.4"/><rect x="360" y="284" width="62" height="8" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.5"/><foreignObject x="11" y="290.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="\ell_1"></span> · объект 1</span></div></foreignObject><rect x="500" y="136" width="62" height="156" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.5"/><foreignObject x="151" y="290.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="\ell_2"></span> · объект 2</span></div></foreignObject><line x1="320" y1="210" x2="680" y2="210" stroke="#111111" stroke-width="1.6" stroke-dasharray="6 4"/><foreignObject x="690" y="192.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#111111;font-weight:700"><span><span data-tex="L"></span> — среднее</span></div></foreignObject><text x="480" y="340" text-anchor="middle" font-size="13" fill="#5E5850">почти весь средний loss приходит от второго объекта — он и потянет градиент</text></g>
<g data-key="un2" data-only="1"><rect x="250" y="176" width="120" height="68" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="310" y1="176" x2="310" y2="244" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="250" y1="210" x2="370" y2="210" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 249 171 L 239 171 L 239 249 L 249 249" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 371 171 L 381 171 L 381 249 L 371 249" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="160" y="174.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{1,1}"></div></foreignObject>
<foreignObject x="220" y="174.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{1,2}"></div></foreignObject>
<foreignObject x="160" y="208.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{2,1}"></div></foreignObject>
<foreignObject x="220" y="208.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{2,2}"></div></foreignObject>
<foreignObject x="190" y="140.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="190" y="247.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf W^{(3)}"></div></foreignObject><rect x="560" y="193" width="120" height="34" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="620" y1="193" x2="620" y2="227" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 559 188 L 549 188 L 549 232 L 559 232" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 681 188 L 691 188 L 691 232 L 681 232" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="470" y="191.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial b_{1}"></div></foreignObject>
<foreignObject x="530" y="191.04" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial b_{2}"></div></foreignObject>
<foreignObject x="500" y="157.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="1\times 2"></div></foreignObject>
<foreignObject x="500" y="246.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf b^{(3)}"></div></foreignObject><foreignObject x="100" y="298.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span>форма <span data-tex="d\mathbf W^{(3)}"></span> совпадает с формой <span data-tex="\mathbf W^{(3)}"></span>, форма <span data-tex="d\mathbf b^{(3)}"></span> — с формой <span data-tex="\mathbf b^{(3)}"></span></span></div></foreignObject></g>
<g data-key="un-hl2" data-only="1"><rect x="250" y="176" width="60" height="34" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="un3" data-only="1"><foreignObject x="76" y="187.52" width="240" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\eta\ \times"></div></foreignObject><rect x="240" y="176" width="112" height="64" fill="#C30B0A" fill-opacity="0.1"/>
<line x1="296" y1="176" x2="296" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="240" y1="208" x2="352" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 239 171 L 229 171 L 229 245 L 239 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<path d="M 353 171 L 363 171 L 363 245 L 353 245" fill="none" stroke="#C30B0A" stroke-width="1.8"/>
<foreignObject x="148" y="172.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{1,1}"></div></foreignObject>
<foreignObject x="204" y="172.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{1,2}"></div></foreignObject>
<foreignObject x="148" y="204.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{2,1}"></div></foreignObject>
<foreignObject x="204" y="204.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\partial w_{2,2}"></div></foreignObject>
<foreignObject x="176" y="140.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="176" y="243.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="d\mathbf W^{(3)}"></div></foreignObject><foreignObject x="272" y="184.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="="></div></foreignObject><rect x="430" y="176" width="112" height="64" fill="#E88919" fill-opacity="0.14"/>
<line x1="486" y1="176" x2="486" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="430" y1="208" x2="542" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 429 171 L 419 171 L 419 245 L 429 245" fill="none" stroke="#E88919" stroke-width="1.8"/>
<path d="M 543 171 L 553 171 L 553 245 L 543 245" fill="none" stroke="#E88919" stroke-width="1.8"/>
<foreignObject x="338" y="175.44" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\eta\,\partial w_{1,1}"></div></foreignObject>
<foreignObject x="394" y="175.44" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\eta\,\partial w_{1,2}"></div></foreignObject>
<foreignObject x="338" y="207.44" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\eta\,\partial w_{2,1}"></div></foreignObject>
<foreignObject x="394" y="207.44" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\eta\,\partial w_{2,2}"></div></foreignObject>
<foreignObject x="366" y="140.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="366" y="243.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\eta\cdot d\mathbf W^{(3)}"></div></foreignObject><foreignObject x="340" y="178.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="\eta=0.1"></span> — длина шага;</span></div></foreignObject><text x="720" y="220" text-anchor="middle" font-size="13" fill="#5E5850">направление задал градиент,</text><foreignObject x="340" y="218.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="\eta"></span> отвечает только за масштаб</span></div></foreignObject></g>
<g data-key="un-hl3" data-only="1"><rect x="240" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="430" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="un4" data-only="1"><rect x="90" y="176" width="112" height="64" fill="#C29E08" fill-opacity="0.16"/>
<line x1="146" y1="176" x2="146" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="90" y1="208" x2="202" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 89 171 L 79 171 L 79 245 L 89 245" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 203 171 L 213 171 L 213 245 L 203 245" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="-2" y="172.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w_{1,1}"></div></foreignObject>
<foreignObject x="54" y="172.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w_{1,2}"></div></foreignObject>
<foreignObject x="-2" y="204.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w_{2,1}"></div></foreignObject>
<foreignObject x="54" y="204.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w_{2,2}"></div></foreignObject>
<foreignObject x="26" y="140.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="26" y="243.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf W^{(3)}"></div></foreignObject><foreignObject x="108" y="184.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="-"></div></foreignObject><rect x="264" y="176" width="112" height="64" fill="#E88919" fill-opacity="0.14"/>
<line x1="320" y1="176" x2="320" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="264" y1="208" x2="376" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 263 171 L 253 171 L 253 245 L 263 245" fill="none" stroke="#E88919" stroke-width="1.8"/>
<path d="M 377 171 L 387 171 L 387 245 L 377 245" fill="none" stroke="#E88919" stroke-width="1.8"/>
<foreignObject x="172" y="175.44" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\eta\,\partial w_{1,1}"></div></foreignObject>
<foreignObject x="228" y="175.44" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\eta\,\partial w_{1,2}"></div></foreignObject>
<foreignObject x="172" y="207.44" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\eta\,\partial w_{2,1}"></div></foreignObject>
<foreignObject x="228" y="207.44" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\eta\,\partial w_{2,2}"></div></foreignObject>
<foreignObject x="200" y="140.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="200" y="243.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\eta\cdot d\mathbf W^{(3)}"></div></foreignObject><foreignObject x="282" y="184.8" width="240" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="="></div></foreignObject><rect x="438" y="176" width="112" height="64" fill="#C29E08" fill-opacity="0.16"/>
<line x1="494" y1="176" x2="494" y2="240" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<line x1="438" y1="208" x2="550" y2="208" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.85"/>
<path d="M 437 171 L 427 171 L 427 245 L 437 245" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<path d="M 551 171 L 561 171 L 561 245 L 551 245" fill="none" stroke="#C29E08" stroke-width="1.8"/>
<foreignObject x="346" y="172.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w\prime_{1,1}"></div></foreignObject>
<foreignObject x="402" y="172.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w\prime_{1,2}"></div></foreignObject>
<foreignObject x="346" y="204.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w\prime_{2,1}"></div></foreignObject>
<foreignObject x="402" y="204.72" width="240" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="w\prime_{2,2}"></div></foreignObject>
<foreignObject x="374" y="140.32" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:700" data-tex="2\times 2"></div></foreignObject>
<foreignObject x="374" y="243.96" width="240" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\mathbf W^{(3)\prime}"></div></foreignObject><foreignObject x="360" y="170.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf b^{(3)}"></span>, <span data-tex="\mathbf W^{(2)}"></span>, <span data-tex="\mathbf b^{(2)}"></span>,</span></div></foreignObject><foreignObject x="360" y="190.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="\mathbf W^{(1)}"></span> и <span data-tex="\mathbf b^{(1)}"></span> обновляются</span></div></foreignObject><text x="740" y="232" text-anchor="middle" font-size="13" fill="#5E5850">этой же строкой кода</text><text x="480" y="320" text-anchor="middle" font-size="13" fill="#5E5850">операция поклеточная: клетка (1,1) слева даёт клетку (1,1) справа</text></g>
<g data-key="un-hl4" data-only="1"><rect x="90" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="264" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/><rect x="438" y="176" width="56" height="32" fill="#D83BB9" fill-opacity="0.28" stroke="#D83BB9" stroke-width="2.2"/></g>
<g data-key="un5" data-only="1"><line x1="300" y1="292" x2="700" y2="292" stroke="#C9C2B8" stroke-width="1.4"/><rect x="370" y="152" width="74" height="140" fill="#C30B0A" fill-opacity="0.55" stroke="#C30B0A" stroke-width="1.5"/><foreignObject x="27" y="289.64" width="760" height="35"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13.5px;color:#111111;font-weight:700"><span><span data-tex="L"></span> — до шага</span></div></foreignObject><path d="M 470 192 L 536 192" fill="none" stroke="#73B222" stroke-width="2.4" marker-end="url(#mlp-un-arrow)"/><rect x="556" y="220" width="74" height="72" fill="#73B222" fill-opacity="0.55" stroke="#73B222" stroke-width="1.5"/><foreignObject x="213" y="289.64" width="760" height="35"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13.5px;color:#111111;font-weight:700"><span><span data-tex="L'"></span> — после шага</span></div></foreignObject><foreignObject x="100" y="318.32" width="760" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400"><span>это проверка одного шага, а не обещание монотонного спуска при любом <span data-tex="\eta"></span></span></div></foreignObject></g>
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
    <div class="step-panel" data-on="mm0 un1" data-focus="un1"><div class="step-kicker">Шаг 1 &#183; исходное состояние</div><h4>Средний loss до шага</h4><div class="math-display" data-mlp-tex="updateOld"></div><p>Столбики нарисованы в одном масштабе: первый объект почти не штрафуется, второй даёт больше двух с половиной единиц.</p></div>
    <div class="step-panel" data-on="mm1 un2 un-hl2" data-focus="un-hl2"><div class="step-kicker">Шаг 2 &#183; градиенты батча</div><h4>Берём результаты batch backward как есть</h4><div class="math-display" data-mlp-tex="updateGrad"></div><p>Подсвечена клетка (1,1): дальше проследим именно её. В коде все клетки обрабатываются одной операцией над массивами.</p></div>
    <div class="step-panel" data-on="mm2 un3 un-hl3" data-focus="un-hl3"><div class="step-kicker">Шаг 3 &#183; масштаб</div><h4><span class="math-inline" data-tex="\eta=0.1"></span> сжимает шаг в десять раз</h4><div class="math-display" data-mlp-tex="updateScaled"></div><p>Знаки не меняются: умножение на положительное число сохраняет направление, поэтому <span class="math-inline" data-tex="\eta"></span> отвечает только за длину шага.</p></div>
    <div class="step-panel" data-on="mm3 un4 un-hl4" data-focus="un-hl4"><div class="step-kicker">Шаг 4 &#183; вычитаем</div><h4>Показываем обновление <span class="math-inline" data-tex="\mathbf W^{(3)}"></span> и <span class="math-inline" data-tex="\mathbf b^{(3)}"></span> полностью</h4><div class="math-display" data-mlp-tex="updateCellNum"></div><div class="math-display" data-mlp-tex="updateNew"></div><p>Одновременно тем же правилом обновлены <span class="math-inline" data-tex="W^{(1)},b^{(1)},W^{(2)},b^{(2)}"></span> — всего 18 чисел.</p></div>
    <div class="step-panel" data-on="mm4 un5" data-focus="un5"><div class="step-kicker">Шаг 5 &#183; новый forward</div><h4>Средний loss уменьшился почти вдвое</h4><div class="math-display" data-mlp-tex="updateCheck"></div><p>Дальше цикл повторяется: новый forward, новый loss, новый backward, новый шаг.</p></div>
  </div>
</div>

<div class="callout">
  <strong>Полный цикл замкнулся:</strong>
  <span class="math-inline" data-tex="\mathbf X\to L\to\nabla_{\theta}L\to\theta'\to\text{новый forward}"></span>.
  В более глубокой сети эти шаги те же, только слоёв больше.
</div>

## Часть 8. От формул к коду: три версии одного и того же

<p>
Соберём ту же сеть в код тремя способами: руками на NumPy, слоями-объектами и на PyTorch. Все три считают градиенты из частей 6 и 7, различается только объём математики, которую мы пишем сами.
</p>

### Данные и параметры: та же сеть 2 → 2 → 2 → 2

<p>
Берём батч и начальные параметры из части 7, поэтому первый шаг можно сверить со сценами выше.
</p>

<pre><code>import numpy as np

X = np.array([[2.0, 1.0], [0.5, 2.0]])     # (B, P) = (2, 2)
Y = np.array([[1.0, 0.0], [0.0, 1.0]])     # (B, C) = (2, 2), one-hot

W1 = np.array([[0.5, -0.4], [1.0, 0.8]]);  b1 = np.array([[0.1, -0.2]])   # (P, H1), (1, H1)
W2 = np.array([[0.6, -0.5], [0.2, 0.9]]);  b2 = np.array([[-0.1, 0.2]])   # (H1, H2), (1, H2)
W3 = np.array([[1.0, -0.8], [-0.3, 0.5]]); b3 = np.array([[0.0, 0.1]])    # (H2, C), (1, C)</code></pre>

### Версия 1. Функции на NumPy

<p>
Forward проходит через два скрытых слоя и softmax, потеря считается как средняя cross-entropy, backward идёт справа налево. Каждый параметр обновляется одним правилом.
</p>

<pre><code>def relu(z):
    return np.maximum(0.0, z)

def softmax(s):
    e = np.exp(s - s.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)

def forward(X, params):
    W1, b1, W2, b2, W3, b3 = params
    Z1 = X @ W1 + b1;  H1 = relu(Z1)
    Z2 = H1 @ W2 + b2; H2 = relu(Z2)
    S = H2 @ W3 + b3;  P = softmax(S)
    return Z1, H1, Z2, H2, P

def loss_fn(P, Y):
    return -(Y * np.log(P)).sum(axis=1).mean()

def backward(X, Y, params, cache):
    W1, b1, W2, b2, W3, b3 = params
    Z1, H1, Z2, H2, P = cache
    D3 = (P - Y) / len(X)                  # Δ⁽³⁾
    dW3, db3 = H2.T @ D3, D3.sum(axis=0, keepdims=True)
    D2 = (D3 @ W3.T) * (Z2 > 0)            # назад через W⁽³⁾ и маску ReLU
    dW2, db2 = H1.T @ D2, D2.sum(axis=0, keepdims=True)
    D1 = (D2 @ W2.T) * (Z1 > 0)
    dW1, db1 = X.T @ D1, D1.sum(axis=0, keepdims=True)
    return dW1, db1, dW2, db2, dW3, db3

params = [W1, b1, W2, b2, W3, b3]
eta = 0.1
for step in range(300):
    cache = forward(X, params)
    grads = backward(X, Y, params, cache)
    params = [p - eta * g for p, g in zip(params, grads)]

print(round(loss_fn(forward(X, params)[-1], Y), 4))   # 0.0012</code></pre>

<div class="callout-blue">
  <strong>Сверка с частью 7:</strong> до первого шага <code>loss_fn</code> возвращает 1.4028, после него 0.7192,
  а <code>grads[4]</code> равен <span class="math-inline" data-tex="d\mathbf W^{(3)}"></span> из сцены батча.
  Форма каждого градиента совпадает с формой его параметра. Если формы разошлись, где-то пропущено
  транспонирование или суммирование по батчу.
</div>

### Версия 2. Тот же код, но слоями

<p>
Каждый слой становится объектом с методами <code>forward</code> (запоминает вход) и <code>backward</code> (считает градиенты своих весов и передаёт сигнал дальше назад). Так устроены слои в PyTorch.
</p>

<pre><code>class Linear:
    def __init__(self, W, b):
        self.W, self.b = W.copy(), b.copy()
    def forward(self, X):
        self.X = X
        return X @ self.W + self.b
    def backward(self, grad):
        self.dW = self.X.T @ grad
        self.db = grad.sum(axis=0, keepdims=True)
        return grad @ self.W.T
    def step(self, eta):
        self.W -= eta * self.dW
        self.b -= eta * self.db

class ReLU:
    def forward(self, Z):
        self.mask = Z > 0
        return Z * self.mask
    def backward(self, grad):
        return grad * self.mask

net = [Linear(W1, b1), ReLU(), Linear(W2, b2), ReLU(), Linear(W3, b3)]

for step in range(300):
    out = X
    for layer in net:
        out = layer.forward(out)
    P = softmax(out)
    grad = (P - Y) / len(X)
    for layer in reversed(net):
        grad = layer.backward(grad)
    for layer in net:
        if isinstance(layer, Linear):
            layer.step(eta)</code></pre>

### Версия 3. PyTorch

<p>
Цикл тот же, но блок backward сворачивается в <code>loss.backward()</code>: autograd сам проходит по всем слоям. <code>nn.CrossEntropyLoss</code> принимает логиты и сам применяет softmax, поэтому в модели его нет. PyTorch хранит веса как <code>[выходы, входы]</code>, поэтому при копировании наших матриц их нужно транспонировать.
</p>

<pre><code>import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(2, 2)
        self.fc2 = nn.Linear(2, 2)
        self.fc3 = nn.Linear(2, 2)

    def forward(self, x):
        h1 = torch.relu(self.fc1(x))
        h2 = torch.relu(self.fc2(h1))
        return self.fc3(h2)                # логиты

net = MLP()
with torch.no_grad():
    for fc, W, b in [(net.fc1, W1, b1), (net.fc2, W2, b2), (net.fc3, W3, b3)]:
        fc.weight.copy_(torch.tensor(W.T, dtype=torch.float32))
        fc.bias.copy_(torch.tensor(b[0], dtype=torch.float32))

Xt = torch.tensor(X, dtype=torch.float32)
yt = torch.tensor(Y.argmax(axis=1))        # номера классов
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(net.parameters(), lr=0.1)

for step in range(300):
    optimizer.zero_grad()
    loss = criterion(net(Xt), yt)
    loss.backward()
    optimizer.step()

print(round(criterion(net(Xt), yt).item(), 4))   # 0.0012</code></pre>

<p>
Все три версии начинают с одинаковых параметров и за 300 шагов приходят к одной потере 0.0012. На NumPy мы сами вывели каждый градиент, в версии со слоями завернули их в объекты, в PyTorch описываем только слои и потерю.
</p>


### Что важно уметь восстановить по памяти

<ol class="end-list">
  <li><strong>Полносвязный слой:</strong> <span class="math-inline" data-tex="\mathbf Z=\mathbf X\mathbf W+\mathbf b"></span>; каждый выход использует все входы предыдущего слоя.</li>
  <li><strong>Нелинейность обязательна:</strong> без неё несколько линейных слоёв схлопываются в один.</li>
  <li><strong>Forward:</strong> <span class="math-inline" data-tex="\text{Linear}\to\text{ReLU}\to\text{Linear}\to\text{ReLU}\to\text{Linear}\to\text{softmax}\to\text{loss}"></span>.</li>
  <li><strong>Softmax + cross-entropy:</strong> выходной градиент сокращается до <span class="math-inline" data-tex="(\mathbf P-\mathbf Y)/B"></span> для среднего loss.</li>
  <li><strong>Linear backward:</strong> <span class="math-inline" data-tex="dW=H^\top\Delta"></span>, <span class="math-inline" data-tex="db=\sum_n\Delta_{n,:}"></span>, <span class="math-inline" data-tex="dH=\Delta W^\top"></span>.</li>
  <li><strong>ReLU backward:</strong> градиент умножается на маску <span class="math-inline" data-tex="\mathbb1[Z>0]"></span>.</li>
  <li><strong>Батч:</strong> добавляет строки данным и промежуточным значениям, но не копирует параметры.</li>
  <li><strong>Backpropagation считает</strong> градиенты; <strong>gradient descent обновляет</strong> параметры.</li>
  <li><strong>Проверка размерностей:</strong> форма <span class="math-inline" data-tex="dW^{(l)}"></span> совпадает с <span class="math-inline" data-tex="W^{(l)}"></span>, а форма <span class="math-inline" data-tex="db^{(l)}"></span> — с <span class="math-inline" data-tex="b^{(l)}"></span>.</li>
</ol>

<p>
  Значения идут слева направо, градиенты возвращаются справа налево, и каждый слой выполняет
  одни и те же формулы. Более глубокая сеть повторяет эти формулы для большего числа слоёв.
</p>

<script>
(function () {
  'use strict';

  var model = {
    X: [[2, 1], [0.5, 2]],
    Y: [[1, 0], [0, 1]],
    W1: [[0.5, -0.4], [1.0, 0.8]], b1: [0.1, -0.2],
    W2: [[0.6, -0.5], [0.2, 0.9]], b2: [-0.1, 0.2],
    W3: [[1.0, -0.8], [-0.3, 0.5]], b3: [0.0, 0.1],
    eta: 0.1
  };

  function cloneMatrix(A) { return A.map(function (row) { return row.slice(); }); }
  function zeros(rows, cols) { return Array.from({length: rows}, function () { return Array(cols).fill(0); }); }
  function matMul(A, B) {
    return A.map(function (row) {
      return B[0].map(function (_, j) {
        return row.reduce(function (sum, value, i) { return sum + value * B[i][j]; }, 0);
      });
    });
  }
  function addBias(A, b) { return A.map(function (row) { return row.map(function (v, j) { return v + b[j]; }); }); }
  function reluMatrix(A) { return A.map(function (row) { return row.map(function (v) { return Math.max(0, v); }); }); }
  function softmaxRows(A) {
    return A.map(function (row) {
      var m = Math.max.apply(null, row);
      var exps = row.map(function (v) { return Math.exp(v - m); });
      var sum = exps.reduce(function (a, b) { return a + b; }, 0);
      return exps.map(function (v) { return v / sum; });
    });
  }
  function transpose(A) { return A[0].map(function (_, j) { return A.map(function (row) { return row[j]; }); }); }
  function hadamardMask(A, Z) { return A.map(function (row, i) { return row.map(function (v, j) { return Z[i][j] > 0 ? v : 0; }); }); }
  function sumRows(A) { return A[0].map(function (_, j) { return A.reduce(function (s, row) { return s + row[j]; }, 0); }); }
  function subtractScaled(A, dA, eta) { return A.map(function (row, i) { return row.map(function (v, j) { return v - eta * dA[i][j]; }); }); }
  function subtractScaledVector(a, da, eta) { return a.map(function (v, j) { return v - eta * da[j]; }); }

  function forward(X, params) {
    var Z1 = addBias(matMul(X, params.W1), params.b1);
    var A1 = reluMatrix(Z1);
    var Z2 = addBias(matMul(A1, params.W2), params.b2);
    var A2 = reluMatrix(Z2);
    var S = addBias(matMul(A2, params.W3), params.b3);
    var P = softmaxRows(S);
    var losses = P.map(function (row, i) {
      return -model.Y[i].reduce(function (sum, y, j) { return sum + y * Math.log(row[j]); }, 0);
    });
    var loss = losses.reduce(function (a, b) { return a + b; }, 0) / losses.length;
    return {Z1: Z1, A1: A1, Z2: Z2, A2: A2, S: S, P: P, losses: losses, loss: loss};
  }

  function backward(X, Y, params, cache, average) {
    var B = X.length;
    var scale = average ? 1 / B : 1;
    var D3 = cache.P.map(function (row, i) { return row.map(function (p, j) { return (p - Y[i][j]) * scale; }); });
    var dW3 = matMul(transpose(cache.A2), D3);
    var db3 = sumRows(D3);
    var dA2 = matMul(D3, transpose(params.W3));
    var D2 = hadamardMask(dA2, cache.Z2);
    var dW2 = matMul(transpose(cache.A1), D2);
    var db2 = sumRows(D2);
    var dA1 = matMul(D2, transpose(params.W2));
    var D1 = hadamardMask(dA1, cache.Z1);
    var dW1 = matMul(transpose(X), D1);
    var db1 = sumRows(D1);
    return {D3:D3,dW3:dW3,db3:db3,dA2:dA2,D2:D2,dW2:dW2,db2:db2,dA1:dA1,D1:D1,dW1:dW1,db1:db1};
  }

  var params = {W1:cloneMatrix(model.W1),b1:model.b1.slice(),W2:cloneMatrix(model.W2),b2:model.b2.slice(),W3:cloneMatrix(model.W3),b3:model.b3.slice()};
  var batch = forward(model.X, params);
  var batchGrad = backward(model.X, model.Y, params, batch, true);
  var oneX = [model.X[0]], oneY = [model.Y[0]];
  var one = forward(oneX, params);
  one.losses = [-Math.log(one.P[0][0])]; one.loss = one.losses[0];
  var oneGrad = backward(oneX, oneY, params, one, false);
  var newParams = {
    W1: subtractScaled(params.W1, batchGrad.dW1, model.eta), b1: subtractScaledVector(params.b1, batchGrad.db1, model.eta),
    W2: subtractScaled(params.W2, batchGrad.dW2, model.eta), b2: subtractScaledVector(params.b2, batchGrad.db2, model.eta),
    W3: subtractScaled(params.W3, batchGrad.dW3, model.eta), b3: subtractScaledVector(params.b3, batchGrad.db3, model.eta)
  };
  var updated = forward(model.X, newParams);

  function fixed(value, digits) {
    var threshold = Math.pow(10, -digits) / 2;
    if (Math.abs(value) < threshold) value = 0;
    return Number(value).toFixed(digits).replace('-', '\u2212');
  }
  function latexNumber(value, digits) {
    var text = fixed(value, digits);
    return text.charAt(0) === '\u2212' ? '-' + text.slice(1) : text;
  }
  function texVector(v, digits) { return '\\begin{bmatrix}' + v.map(function (x) { return latexNumber(x, digits); }).join('&') + '\\end{bmatrix}'; }
  function texColumn(v, digits) { return '\\begin{bmatrix}' + v.map(function (x) { return latexNumber(x, digits); }).join('\\\\') + '\\end{bmatrix}'; }
  function texMatrix(A, digits) { return '\\begin{bmatrix}' + A.map(function (row) { return row.map(function (x) { return latexNumber(x, digits); }).join('&'); }).join('\\\\') + '\\end{bmatrix}'; }

  var t = {
    forwardInputs: '\\begin{gathered}\\mathbf x=' + texVector(oneX[0],1) + ',\\quad \\mathbf y=' + texVector(oneY[0],0) + '\\\\ \\mathbf W^{(1)}=' + texMatrix(params.W1,1) + ',\\quad \\mathbf b^{(1)}=' + texVector(params.b1,1) + '\\end{gathered}',
    forwardZ1: '\\mathbf z^{(1)}=' + texVector(oneX[0],1) + texMatrix(params.W1,1) + '+' + texVector(params.b1,1) + '=' + texVector(one.Z1[0],2),
    forwardA1: '\\mathbf h^{(1)}=\\operatorname{ReLU}' + texVector(one.Z1[0],2) + '=' + texVector(one.A1[0],2),
    forwardZ2: '\\mathbf z^{(2)}=' + texVector(one.A1[0],2) + texMatrix(params.W2,1) + '+' + texVector(params.b2,1) + '=' + texVector(one.Z2[0],2),
    forwardA2: '\\mathbf h^{(2)}=\\operatorname{ReLU}' + texVector(one.Z2[0],2) + '=' + texVector(one.A2[0],2),
    forwardS: '\\mathbf s=' + texVector(one.A2[0],2) + texMatrix(params.W3,1) + '+' + texVector(params.b3,1) + '=' + texVector(one.S[0],3),
    forwardP: '\\mathbf p=\\operatorname{softmax}' + texVector(one.S[0],3) + '=' + texVector(one.P[0],4),
    forwardLoss: '\\ell=-\\log(' + latexNumber(one.P[0][0],6) + ')=' + latexNumber(one.loss,6),
    backStart: '\\mathbf p=' + texVector(one.P[0],4) + ',\\quad \\mathbf y=' + texVector(oneY[0],0) + ',\\quad \\mathbf h^{(2)}=' + texVector(one.A2[0],2),
    backD3: '\\boldsymbol\\delta^{(3)}=\\mathbf p-\\mathbf y=' + texVector(oneGrad.D3[0],4),
    backW3: '\\begin{gathered}d\\mathbf W^{(3)}=' + texColumn(one.A2[0],2) + texVector(oneGrad.D3[0],4) + '=' + texMatrix(oneGrad.dW3,4) + '\\\\ d\\mathbf h^{(2)}=' + texVector(oneGrad.dA2[0],4) + '\\end{gathered}',
    backD2: '\\boldsymbol\\delta^{(2)}=' + texVector(oneGrad.dA2[0],4) + '\\odot' + texVector(one.Z2[0].map(function(v){return v>0?1:0;}),0) + '=' + texVector(oneGrad.D2[0],4),
    backW2: '\\begin{gathered}d\\mathbf W^{(2)}=' + texColumn(one.A1[0],2) + texVector(oneGrad.D2[0],4) + '=' + texMatrix(oneGrad.dW2,4) + '\\\\ d\\mathbf h^{(1)}=' + texVector(oneGrad.dA1[0],4) + '\\end{gathered}',
    backD1: '\\begin{gathered}\\boldsymbol\\delta^{(1)}=' + texVector(oneGrad.dA1[0],4) + '\\odot' + texVector(one.Z1[0].map(function(v){return v>0?1:0;}),0) + '=' + texVector(oneGrad.D1[0],4) + '\\\\ d\\mathbf W^{(1)}=' + texMatrix(oneGrad.dW1,4) + '\\end{gathered}',
    backAll: '\\begin{gathered}d\\mathbf W^{(1)}=' + texMatrix(oneGrad.dW1,4) + ',\\quad d\\mathbf W^{(2)}=' + texMatrix(oneGrad.dW2,4) + '\\\\ d\\mathbf W^{(3)}=' + texMatrix(oneGrad.dW3,4) + '\\end{gathered}',
    batchData: '\\mathbf X=' + texMatrix(model.X,1) + ',\\qquad \\mathbf Y=' + texMatrix(model.Y,0),
    batchForward: '\\mathbf P=' + texMatrix(batch.P,4) + ',\\qquad (\\ell_1,\\ell_2)=(' + latexNumber(batch.losses[0],4) + ',' + latexNumber(batch.losses[1],4) + ')',
    batchLoss: 'L=\\frac{' + latexNumber(batch.losses[0],6) + '+' + latexNumber(batch.losses[1],6) + '}{2}=' + latexNumber(batch.loss,6),
    batchD3: '\\boldsymbol\\Delta^{(3)}=\\frac{\\mathbf P-\\mathbf Y}{2}=' + texMatrix(batchGrad.D3,4),
    batchW3: '\\begin{gathered}d\\mathbf W^{(3)}=(\\mathbf H^{(2)})^\\top\\boldsymbol\\Delta^{(3)}=' + texMatrix(batchGrad.dW3,4) + '\\\\ d\\mathbf b^{(3)}=' + texVector(batchGrad.db3,4) + '\\end{gathered}',
    batchAll: '\\begin{gathered}d\\mathbf W^{(1)}=' + texMatrix(batchGrad.dW1,4) + ',\\quad d\\mathbf W^{(2)}=' + texMatrix(batchGrad.dW2,4) + '\\\\ d\\mathbf W^{(3)}=' + texMatrix(batchGrad.dW3,4) + '\\end{gathered}',
    updateOld: 'L(\\boldsymbol\\theta)=(' + latexNumber(batch.losses[0],6) + '+' + latexNumber(batch.losses[1],6) + ')/2=' + latexNumber(batch.loss,6),
    updateGrad: 'd\\mathbf W^{(3)}=' + texMatrix(batchGrad.dW3,4) + ',\\qquad d\\mathbf b^{(3)}=' + texVector(batchGrad.db3,4),
    updateNew: '\\begin{gathered}\\mathbf W^{(3)\\prime}=' + texMatrix(params.W3,1) + '-0.1' + texMatrix(batchGrad.dW3,4) + '\\\\ =' + texMatrix(newParams.W3,4) + ',\\quad \\mathbf b^{(3)\\prime}=' + texVector(newParams.b3,4) + '\\end{gathered}',
    updateCheck: 'L(\\boldsymbol\\theta)= ' + latexNumber(batch.loss,6) + '\\quad\\longrightarrow\\quad L(\\boldsymbol\\theta\\prime)=' + latexNumber(updated.loss,6)
  };

  function signed(value, digits) {
    var text = latexNumber(value, digits);
    return text.charAt(0) === '-' ? text : '+' + text;
  }
  var etaW3 = batchGrad.dW3.map(function (row) {
    return row.map(function (v) { return v * model.eta; });
  });
  t.batchCellForm = 'z^{(1)}_{2,1}=x_{2,1}W^{(1)}_{1,1}+x_{2,2}W^{(1)}_{2,1}+b^{(1)}_{1}';
  t.batchCellNum = 'z^{(1)}_{2,1}=' + latexNumber(model.X[1][0],1) + '\\cdot' + latexNumber(params.W1[0][0],1)
    + '+' + latexNumber(model.X[1][1],1) + '\\cdot' + latexNumber(params.W1[1][0],1)
    + '+' + latexNumber(params.b1[0],1) + '=' + latexNumber(batch.Z1[1][0],4);
  t.batchDW3cell = '\\begin{gathered}dW^{(3)}_{1,1}=H^{(2)}_{1,1}\\Delta^{(3)}_{1,1}+H^{(2)}_{2,1}\\Delta^{(3)}_{2,1}\\\\ ='
    + latexNumber(batch.A2[0][0],4) + '\\cdot(' + latexNumber(batchGrad.D3[0][0],4) + ')'
    + '+' + latexNumber(batch.A2[1][0],4) + '\\cdot(' + latexNumber(batchGrad.D3[1][0],4) + ')'
    + '=' + latexNumber(batchGrad.dW3[0][0],4) + '\\end{gathered}';
  t.updateScaled = '\\eta\\,d\\mathbf W^{(3)}=0.1\\cdot' + texMatrix(batchGrad.dW3,4) + '=' + texMatrix(etaW3,4);
  t.updateCellNum = 'W^{(3)\\prime}_{1,1}=' + latexNumber(params.W3[0][0],1) + '-0.1\\cdot('
    + latexNumber(batchGrad.dW3[0][0],4) + ')=' + latexNumber(newParams.W3[0][0],4);

  function put(prefix, v, digits) {
    v.forEach(function (x, i) { t[prefix + (i + 1)] = latexNumber(x, digits); });
  }
  put('vX', oneX[0], 0);
  put('vZ1', one.Z1[0], 2); put('vH1', one.A1[0], 2);
  put('vZ2', one.Z2[0], 2); put('vH2', one.A2[0], 2);
  put('vS', one.S[0], 2); put('vP', one.P[0], 3);
  t.vL = latexNumber(one.loss, 3);
  put('vD3', oneGrad.D3[0], 3); put('vDH2', oneGrad.dA2[0], 3); put('vD2', oneGrad.D2[0], 3);
  put('vDH1', oneGrad.dA1[0], 3); put('vD1', oneGrad.D1[0], 3);
  [1, 2, 3].forEach(function (l) {
    params['W' + l].forEach(function (row, i) {
      row.forEach(function (v, j) {
        t['vW' + l + '_' + (i + 1) + (j + 1)] = latexNumber(v, 1);
        t['vdW' + l + '_' + (i + 1) + (j + 1)] = latexNumber(oneGrad['dW' + l][i][j], 3);
      });
    });
  });

  function renderDerivedMath() {
    document.querySelectorAll('[data-mlp-tex]').forEach(function (node) {
      var key = node.getAttribute('data-mlp-tex');
      var source = t[key] || key;
      node.setAttribute('data-tex', source);
      try {
        katex.render(source, node, {throwOnError:false, displayMode:node.classList.contains('math-display'), strict:'ignore'});
        node.dataset.rendered = '1';
      } catch (error) { node.textContent = source; }
    });
  }

  function rerenderNode(node, tex) {
    node.setAttribute('data-tex', tex);
    try { katex.render(tex, node, {throwOnError:false,displayMode:true,strict:'ignore'}); } catch (error) { node.textContent = tex; }
  }

  function initRelu() {
    var range = document.getElementById('mlpReluRange');
    if (!range) return;
    var point = document.getElementById('mlp-relu-point');
    var guide = document.getElementById('mlp-relu-guide');
    var state = document.getElementById('mlp-relu-state');
    var svgText = document.getElementById('mlp-relu-value-svg');
    var valueText = document.getElementById('mlpReluValue');
    var equation = document.getElementById('mlpReluEquation');
    var explain = document.getElementById('mlpReluExplain');
    function render() {
      var z = Number(range.value), a = Math.max(0, z);
      var x = 350 + z * (275 / 3);
      var y = 330 - a * (255 / 3);
      point.setAttribute('cx', x); point.setAttribute('cy', y);
      guide.setAttribute('x1', x); guide.setAttribute('x2', x); guide.setAttribute('y1', 330); guide.setAttribute('y2', y);
      state.textContent = z > 0 ? 'сигнал проходит' : (z < 0 ? 'сигнал закрыт' : 'граница ReLU');
      katex.render('z=' + latexNumber(z,2) + '\\ \\to\\ h=' + latexNumber(a,2), svgText, {throwOnError:false, strict:'ignore'});
      valueText.textContent = fixed(a,2);
      explain.textContent = z > 0 ? 'Положительное значение проходит дальше без изменения.' : (z < 0 ? 'Отрицательное значение превращается в ноль.' : 'В точке ноль реализация выбирает подградиент.');
      rerenderNode(equation, '\\operatorname{ReLU}(' + latexNumber(z,2) + ')=' + latexNumber(a,2));
    }
    range.addEventListener('input', render); render();
  }

  function initLoss() {
    var range = document.getElementById('mlpLossRange');
    if (!range) return;
    var barTrue = document.getElementById('mlp-loss-bar-true');
    var barOther = document.getElementById('mlp-loss-bar-other');
    var pTrueText = document.getElementById('mlp-loss-ptrue');
    var pOtherText = document.getElementById('mlp-loss-pother');
    var number = document.getElementById('mlp-loss-number');
    var value = document.getElementById('mlpLossValue');
    var equation = document.getElementById('mlpLossEquation');
    var explain = document.getElementById('mlpLossExplain');
    function setBar(rect, p) { var h = p * 250; rect.setAttribute('y', 330-h); rect.setAttribute('height', h); }
    function render() {
      var p = Number(range.value), q = 1-p, loss = -Math.log(p);
      setBar(barTrue,p); setBar(barOther,q);
      pTrueText.textContent = fixed(p,2); pTrueText.setAttribute('y', Math.max(72, 330-p*250-12));
      pOtherText.textContent = fixed(q,2); pOtherText.setAttribute('y', Math.max(72, 330-q*250-12));
      number.textContent = fixed(loss,3); value.textContent = fixed(loss,3);
      explain.textContent = p >= .75 ? 'Модель уверена в верном классе, поэтому штраф мал.' : (p >= .5 ? 'Верный класс лидирует, но уверенность пока невысока.' : 'Модель отдаёт больше вероятности неверному классу, поэтому штраф быстро растёт.');
      rerenderNode(equation, '\\ell=-\\log(' + latexNumber(p,2) + ')=' + latexNumber(loss,3));
    }
    range.addEventListener('input', render); render();
  }

  function boot() {
    renderDerivedMath();
    initRelu();
    initLoss();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
</script>
